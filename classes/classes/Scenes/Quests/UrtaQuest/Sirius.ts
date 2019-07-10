import { Naga } from "../../Areas/Desert/Naga";
import { rand } from "../../../Extra";
import { StatusEffects } from "../../../StatusEffects";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { LowerBody } from "../../../BodyParts/LowerBody";
import { kGAMECLASS } from "../../../GlobalFlags/kGAMECLASS";

export class Sirius extends Naga {

    public eAttack(): void {
        this.outputText("Sirius readies his hands, undulating his body erratically with quick motions in order to catch you off-guard and strike at you.\n");
        super.eAttack();
    }

    protected outputPlayerDodged(dodge: number): void {
        this.outputText("With your trained eyes, you see through his feints and effectively block his first swipe, then quickly twist your body to kick him away.  He clutches his belly where you kicked him, but recovers quickly, eyes fixated on yours.\n");
    }

    public outputAttack(damage: number): void {
        if (damage <= 0) {
            super.outputAttack(damage);
        } else {
            this.outputText("You misjudge his pattern and wind up getting slashed by a series of swipes from his sharpened nails.  He distances himself from you in order to avoid retaliation and glares at you with his piercing yellow eyes, a hint of a smile on his face. <b>(<font color=\"#800000\">" + damage + "</font>)</b>");
        }
    }

    protected performCombatAction(): void {
        let attack: number = rand(4);
        if (this.player.hasStatusEffect(StatusEffects.Blind)) attack = rand(3);
        if (attack == 0) this.eAttack();
        if (attack == 1) this.poisonBite();
        if (attack == 2) this.manNagaTease();
        if (attack == 3) this.nagaSpitAttack();
    }

    private manNagaTease(): void {
        this.outputText("The snake-man stares deeply into your eyes, seemingly looking past them, and for a moment your body goes numb.");
        // Miss:
        if (rand(10) == 0) {
            this.outputText("  You blink and shake yourself free of the effects of the snake-man's penetrating gaze.");
            this.combatRoundOver();
        }
        // Hit (Blind):
        if (this.hasStatusEffect(StatusEffects.Blind)) {
            this.outputText("  Though your vision is still blurry, you feel yourself being sucked into the golden depths of those pupils, making you forget all your worries, if only for an instant.  All you can focus on is your growing arousal as you sink deeper into his gaze.  You shake your head, clearing your mind of the hypnotising effects the snake-man's eyes seem to possess, though the arousal remains.");
            kGAMECLASS.dynStats("lus", (5 + this.player.lib / 10 - this.player.inte / 20));
        }
        // Hit:
        else {
            this.outputText("  Those pools of yellow suck you into their golden depths, making you forget all your worries, if only for an instant.  All you can focus on is your growing arousal as you sink deeper into his gaze.  You shake your head, clearing your mind of the hypnotising effects the snake-man's eyes seem to possess, though the arousal remains.");
            kGAMECLASS.dynStats("lus", (10 + this.player.lib / 7 - this.player.inte / 20));
        }
        this.combatRoundOver();
    }

    private nagaSpitAttack(): void {
        this.outputText("Hissing loudly, Sirius suddenly curls his lips and spits at your eyes!  ");
        // {Hit:
        if (this.spe / 20 + rand(20) + 1 > this.player.spe / 20 + 10) {
            this.outputText("The vile spray hits your eyes and you scream in pain, clawing fiercely at your burning, watering, weeping eyes.  <b>You can't see!  It'll be much harder to fight in this state, but at the same time, his hypnosis won't be so effective...</b>");
            this.player.createStatusEffect(StatusEffects.Blind, 3, 0, 0, 0);
        }
        // Miss:
        else this.outputText("You quickly lean to the side, narrowly avoiding being blinded by the snake-man's spit!");
        this.combatRoundOver();
    }

    private poisonBite(): void {
        this.outputText("With a loud and vicious hiss, Sirius suddenly lunges at you, mouth distended impossibly wide and revealing four needle-like fangs dripping with venom!  ");
        // Miss:
        if (this.player.getEvasionRoll()) {
            this.outputText("You dodge just in the nick of time, and deliver a punishing blow with the butt of your halberd as Sirius soars past, forcing him to slither past you to make himself ready to defend himself again.");
            this.combatRoundOver();
        }
        // Hit:
        this.outputText("The snake-man moves too quickly for you to evade and he sinks long fangs into your flesh, leaving a wound that burns with horrific pain. ");
        let damage: number = 40 + rand(20);
        damage = this.player.takeDamage(damage, true);
        this.combatRoundOver();
    }

    public defeated(hpVictory: boolean): void {
        this.game.urtaQuest.urtaBeatsUpSiriusRadio();
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        this.game.urtaQuest.urtaLosesToSirriusSnakeRadio();
    }

    public constructor() {
        super(true);
        this.a = "";
        this.short = "Sirius, a naga hypnotist";
        this.imageName = "sirius";
        this.long = "A strange being with the upper torso of a human man topped with the head of a giant serpent stands before you, hissing in anger and occasionally letting a long, fork-tipped tongue flicker out past his lips.  An imperial-featured masculine human face regards you with an indifferent expression.  A ponytail of deep orange - almost bright red - hair falls down between his shoulders, held together by snake-styled circlets of silver, and matching bracelets of the same material and design adorn his wrists. Scales begin at his lower waist, concealing his manhood from you; he's completely naked otherwise.  His snake body is long and slender, covered in finely meshing scales of a rich orange-red shade, the red broken by a pattern of randomly thick or thin stripes of black.  His burning yellow eyes stare directly into yours, vertical slits of pupils fixated on your own as he undulates and coils in an eerily seductive manner.";
        this.race = "Naga";
        this.plural = false;
        this.createCock(14, 2);
        this.createBreastRow(0);
        this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
        this.ass.analWetness = Ass.WETNESS_DRY;
        this.createStatusEffect(StatusEffects.BonusACapacity, 10, 0, 0, 0);
        this.tallness = 5 * 12 + 10;
        this.hips.rating = Hips.RATING_AMPLE + 2;
        this.butt.rating = Butt.RATING_LARGE;
        this.lowerBody.type = LowerBody.NAGA;
        this.skin.tone = "mediterranean-toned";
        this.hair.color = "orange";
        this.hair.length = 16;
        this.initStrTouSpeInte(75, 70, 75, 92);
        this.initLibSensCor(45, 35, 40);
        this.weaponName = "fangs";
        this.weaponVerb = "bite";
        this.weaponAttack = 25;
        this.armorName = "scales";
        this.armorDef = 30;
        this.bonusHP = 400;
        this.lust = 30;
        this.temperment = Sirius.TEMPERMENT_RANDOM_GRAPPLES;
        this.level = 12;
        this.gems = rand(5) + 8;
        this.drop = this.NO_DROP;
        this.special1 = this.nagaPoisonBiteAttack;
        this.special2 = this.nagaConstrict;
        this.special3 = this.nagaTailWhip;
        this.checkMonster();
    }

}
