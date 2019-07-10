import { Monster } from "../../../Monster";
import { StatusEffects } from "../../../StatusEffects";
import { int } from "../../../Extra";
import { SpriteDb } from "../../../display/SpriteDb";
import { Vagina } from "../../../Vagina";
import { Appearance } from "../../../Appearance";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { Skin } from "../../../BodyParts/Skin";

export class ChameleonGirl extends Monster {

    public chameleonTongueAttack(): void {
        this.weaponName = "tongue";
        this.weaponVerb = "tongue-slap";
        this.weaponAttack = 10;
        this.createStatusEffect(StatusEffects.Attacks, 1, 0, 0, 0);
        this.eAttack();
        this.weaponAttack = 30;
        this.weaponName = "claws";
        this.weaponVerb = "claw";
        this.combatRoundOver();
    }

    // Ignores armor
    public chameleonClaws(): void {
        // Blind dodge change
        if (this.hasStatusEffect(StatusEffects.Blind) && ChameleonGirl.rand(3) < 1) {
            this.outputText(this.capitalA + this.short + " completely misses you with a blind claw-attack!\n");
        }
        // Evade:
        else if (this.player.getEvasionRoll()) this.outputText("The chameleon girl's claws slash towards you, but you lean away from them and they fly by in a harmless blur.");
        // Get hit
        else {
            let damage: number = int((this.str + this.weaponAttack) - ChameleonGirl.rand(this.player.tou));
            if (damage > 0) {

                this.outputText("The chameleon swings her arm at you, catching you with her claws.  You wince as they scratch your skin, leaving thin cuts in their wake. ");
                damage = this.player.takeDamage(damage, true);
            }
            else this.outputText("The chameleon swings her arm at you, catching you with her claws.  You defend against the razor sharp attack.");
        }
        this.combatRoundOver();
    }

    // Attack 3:
    public rollKickClawWhatTheFuckComboIsThisShit(): void {
        // Blind dodge change
        if (this.hasStatusEffect(StatusEffects.Blind) && ChameleonGirl.rand(3) < 1) {
            this.outputText(this.capitalA + this.short + " completely misses you with a blind roll-kick!\n");
        }
        // Evade:
        else if (this.player.getEvasionRoll()) {
            let damage2: number = 1 + ChameleonGirl.rand(10);
            this.outputText("The chameleon girl leaps in your direction, rolls, and kicks at you.  You sidestep her flying charge and give her a push from below to ensure she lands face-first in the bog. ");
            damage2 = this.game.combat.doDamage(damage2, true);
            this.outputText("<b>(<font color=\"#800000\">" + damage2 + "</font>)</b>");
        }
        // Get hit
        else {
            let damage: number = int((this.str + this.weaponAttack) - ChameleonGirl.rand(this.player.tou) - this.player.armorDef) + 25;
            if (damage > 0) {

                this.outputText("The chameleon leaps in your direction, rolls, and kicks you square in the shoulder as she ascends, sending you reeling.  You grunt in pain as a set of sharp claws rake across your chest. ");
                damage = this.player.takeDamage(damage, true);
            }
            else this.outputText("The chameleon rolls in your direction and kicks up at your chest, but you knock her aside without taking any damage..");
        }
        this.combatRoundOver();
    }

    protected performCombatAction(): void {
        this.game.spriteSelect(SpriteDb.s_chameleon);
        const select: number = ChameleonGirl.rand(3);
        if (select == 0) this.rollKickClawWhatTheFuckComboIsThisShit();
        else if (select == 1) this.chameleonTongueAttack();
        else this.chameleonClaws();
    }

    public defeated(hpVictory: boolean): void {
        this.game.bog.chameleonGirlScene.defeatChameleonGirl();
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        if (pcCameWorms) {
            this.outputText("\n\nThe chameleon girl recoils.  \"<i>Ew, gross!</i>\" she screeches as she runs away, leaving you to recover from your defeat alone.");
            this.game.combat.cleanupAfterCombat();
        } else {
            this.game.bog.chameleonGirlScene.loseToChameleonGirl();
        }
    }

    protected outputPlayerDodged(dodge: number): void {
        this.outputText("The chameleon girl whips her head and sends her tongue flying at you, but you hop to the side and manage to avoid it.  The pink blur flies back into her mouth as quickly as it came at you, and she looks more than a bit angry that she didn't find her target.\n");
    }

    public outputAttack(damage: number): void {
        if (damage <= 0) {
            this.outputText("The Chameleon Girl lashes out with her tongue, but you deflect the sticky projectile off your arm, successfully defending against it.  She doesn't look happy about it when she slurps the muscle back into her mouth.");
        } else {
            this.outputText("The chameleon whips her head forward and sends her tongue flying at you.  It catches you in the gut, the incredible force behind it staggering you.  The pink blur flies back into her mouth as quickly as it came at you, and she laughs mockingly as you recover your footing. <b>(<font color=\"#000080\">" + damage + "</font>)</b>");
        }
    }

    /**
     * Pairs of skinTone/skinAdj
     */
    private SKIN_VARIATIONS: any[] = [
        ["red", "black"],
        ["green", "yellowish"],
        ["blue", "lighter blue"],
        ["purple", "bright yellow"],
        ["orange", "brown"],
        ["tan", "white"]
    ];

    public constructor() {
        super();
        const skinToneAdj: any[] = ChameleonGirl.randomChoice(this.SKIN_VARIATIONS);
        this.a = "the ";
        this.short = "chameleon girl";
        this.imageName = "chameleongirl";
        this.long = "You're faced with a tall lizard-like girl with smooth " + skinToneAdj[0] + " skin and long, " + skinToneAdj[1] + " stripes that run along her body from ankle to shoulder.  An abnormally large tail swishes behind her, and her hands are massive for her frame, built for easily climbing the trees.  A pair of small, cute horns grow from her temples, and a pair of perky B-cups push out through her skimpy drapings.  Large, sharp claws cap her fingers, gesturing menacingly at you.";
        this.race = "Chameleon-Morph";
        // this.plural = false;
        this.createVagina(false, Vagina.WETNESS_SLAVERING, Vagina.LOOSENESS_LOOSE);
        this.createBreastRow(Appearance.breastCupInverse("B"));
        this.ass.analLooseness = Ass.LOOSENESS_NORMAL;
        this.ass.analWetness = Ass.WETNESS_DRY;
        this.tallness = ChameleonGirl.rand(2) + 68;
        this.hips.rating = Hips.RATING_AMPLE + 2;
        this.butt.rating = Butt.RATING_LARGE;
        this.skin.tone = skinToneAdj[0];
        this.skin.type = Skin.PLAIN;
        this.skin.desc = "skin";
        this.skin.adj = skinToneAdj[1];
        this.hair.color = "black";
        this.hair.length = 15;
        this.initStrTouSpeInte(65, 65, 95, 85);
        this.initLibSensCor(50, 45, 50);
        this.weaponName = "claws";
        this.weaponVerb = "claw";
        this.weaponAttack = 30;
        this.armorName = "skin";
        this.armorDef = 20;
        this.bonusHP = 350;
        this.lust = 30;
        this.lustVuln = .25;
        this.temperment = ChameleonGirl.TEMPERMENT_LOVE_GRAPPLES;
        this.level = 14;
        this.gems = 10 + ChameleonGirl.rand(50);
        this.drop = this.NO_DROP;
        this.checkMonster();
    }

}

