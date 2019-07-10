import { Monster } from "../../../Monster";
import { int, rand } from "../../../Extra";
import { StatusEffects } from "../../../StatusEffects";
import { PerkLib } from "../../../PerkLib";
import { kACHIEVEMENTS } from "../../../GlobalFlags/kACHIEVEMENTS";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { kGAMECLASS } from "../../../GlobalFlags/kGAMECLASS";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { Skin } from "../../../BodyParts/Skin";
import { WeightedDrop } from "../../../internals/WeightedDrop";
import { Tail } from "../../../BodyParts/Tail";

export class TentacleBeast extends Monster {
    private tentaclePhysicalAttack(): void {
        this.outputText("The shambling horror throws its tentacles at you with a murderous force.\n");
        let temp: number = int((this.str + this.weaponAttack) - Math.random() * (this.player.tou) - this.player.armorDef);
        if (temp < 0) temp = 0;
        // Miss
        if (temp == 0 || (this.player.spe - this.spe > 0 && int(Math.random() * (((this.player.spe - this.spe) / 4) + 80)) > 80)) {
            this.outputText("However, you quickly evade the clumsy efforts of the abomination to strike you.");
        }
        // Hit
        else {
            this.outputText("The tentacles crash upon your body mercilessly. ");
            this.player.takeDamage(temp, true);
        }
        this.combatRoundOver();
    }
    private tentacleEntwine(): void {
        this.outputText("The beast lunges its tentacles at you from all directions in an attempt to immobilize you.\n");
        // Not Trapped yet
        if (!this.player.hasStatusEffect(StatusEffects.TentacleBind)) {
            // Success
            if (int(Math.random() * (((this.player.spe) / 2))) > 15 || (this.player.findPerk(PerkLib.Evade) >= 0 && int(Math.random() * (((this.player.spe) / 2))) > 15)) {
                this.outputText("In an impressive display of gymnastics, you dodge, duck, dip, dive, and roll away from the shower of grab-happy arms trying to hold you. Your instincts tell you that this was a GOOD thing.\n");
            }
            // Fail
            else {
                this.outputText("While you attempt to avoid the onslaught of pseudopods, one catches you around your " + this.player.foot() + " and drags you to the ground. You attempt to reach for it to pull it off only to have all of the other tentacles grab you in various places and immobilize you in the air. You are trapped and helpless!!!\n\n");
                // Male/Herm Version:
                if (this.player.hasCock()) this.outputText("The creature, having immobilized you, coils a long tendril about your penis. You shudder as the creature begins stroking your cock like a maid at a dairy farm in an attempt to provoke a response from you. Unable to resist, your " + this.player.cockDescript(0) + " easily becomes erect, signaling to the creature that you are responsive to harsher stimulation.\n");
                // Female Version:
                else if (this.player.hasVagina()) this.outputText("The creature quickly positions a long tentacle with a single sucker over your clitoris. You feel the power of the suction on you, and your body quickly heats up.  Your clit engorges, prompting the beast to latch the sucker onto your " + this.player.clitDescript() + ".\n");
                // Genderless
                else this.outputText("The creature quickly positions a long tentacle against your " + this.player.assholeDescript() + ". It circles your pucker with slow, delicate strokes that bring unexpected warmth to your body.\n");
                const lustDmg: number = 8 + this.player.sens / 20;
                this.player.takeLustDamage(lustDmg, true);
                this.player.createStatusEffect(StatusEffects.TentacleBind, 0, 0, 0, 0);
            }
        }
        this.combatRoundOver();
    }

    public defeated(hpVictory: boolean): void {
        this.clearOutput();
        if (hpVictory) {
            this.outputText("The creature lets out an ear-piercing screech as it collapses upon itself. Its green coloring quickly fades to brown as the life drains from it, leaving you victorious.");
            this.game.awardAchievement("Tentacle Beast Slayer", kACHIEVEMENTS.GENERAL_TENTACLE_BEAST_SLAYER);
            this.flags[kFLAGS.TENTACLE_BEASTS_KILLED]++;
        } else {
            this.outputText("The tentacle beast's mass begins quivering and sighing, the tentacles wrapping around each other and feverishly caressing each other.  It seems the beast has given up on fighting.");
        }
        if (this.hasStatusEffect(StatusEffects.PhyllaFight)) {
            this.removeStatusEffect(StatusEffects.PhyllaFight);
            this.game.desert.antsScene.phyllaTentacleDefeat();
        }
        else {
            if (!hpVictory && this.player.gender > 0 && this.flags[kFLAGS.SFW_MODE] <= 0) {
                this.outputText("  Perhaps you could use it to sate yourself?");
                kGAMECLASS.output.doYesNo(this.game.forest.tentacleBeastScene.tentacleVictoryRape, this.game.combat.cleanupAfterCombat);
            } else {
                this.game.combat.cleanupAfterCombat();
            }
        }
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        if (hpVictory) {
            this.outputText("Overcome by your wounds, you turn to make a last desperate attempt to run...\n\n");
            if (this.hasStatusEffect(StatusEffects.PhyllaFight)) {
                this.removeStatusEffect(StatusEffects.PhyllaFight);
                this.outputText("...and make it into the nearby tunnel.  ");
                this.game.desert.antsScene.phyllaTentaclePCLoss();
            } else
                this.game.forest.tentacleBeastScene.tentacleLossRape();
        } else {
            this.outputText("You give up on fighting, too aroused to resist any longer.  Shrugging, you walk into the writhing mass...\n\n");
            if (this.hasStatusEffect(StatusEffects.PhyllaFight)) {
                this.removeStatusEffect(StatusEffects.PhyllaFight);
                this.outputText("...but an insistent voice rouses you from your stupor.  You manage to run into a nearby tunnel.  ");
                this.game.desert.antsScene.phyllaTentaclePCLoss();
            } else
                this.doNext(this.game.forest.tentacleBeastScene.tentacleLossRape);
        }
    }

    protected performCombatAction(): void {
        // tentacle beasts have special AI
        if (rand(2) == 0 || this.hasStatusEffect(StatusEffects.TentacleCoolDown))
            this.special1();
        else this.special2();
    }

    public constructor() {
        super();
        // trace("TentacleBeast Constructor!");
        this.a = "the ";
        this.short = "tentacle beast";
        this.imageName = "tentaclebeast";
        this.long = "You see the massive, shambling form of the tentacle beast before you.  Appearing as a large shrub, it shifts its bulbous mass and reveals a collection of thorny tendrils and cephalopodic limbs.";
        this.race = "Abomination";
        // this.plural = false;
        this.createCock(40, 1.5);
        this.createCock(60, 1.5);
        this.createCock(50, 1.5);
        this.createCock(20, 1.5);
        this.balls = 0;
        this.ballSize = 0;
        this.cumMultiplier = 3;
        // this.hoursSinceCum = 0;
        this.pronoun1 = "it";
        this.pronoun2 = "it";
        this.pronoun3 = "its";
        this.createBreastRow(0, 0);
        this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
        this.ass.analWetness = Ass.WETNESS_SLIME_DROOLING;
        this.tallness = rand(9) + 70;
        this.hips.rating = Hips.RATING_BOYISH;
        this.butt.rating = Butt.RATING_BUTTLESS;
        this.skin.tone = "green";
        this.skin.type = Skin.PLAIN;
        this.skin.desc = "bark";
        this.hair.color = "green";
        this.hair.length = 1;
        this.initStrTouSpeInte(58, 25, 35, 45);
        this.initLibSensCor(90, 20, 100);
        this.weaponName = "whip-tendril";
        this.weaponVerb = "thorny tendril";
        this.weaponAttack = 1;
        this.armorName = "rubbery skin";
        this.armorDef = 1;
        this.bonusHP = 250;
        this.lust = 10;
        this.lustVuln = 0.8;
        this.temperment = TentacleBeast.TEMPERMENT_LOVE_GRAPPLES;
        this.level = 6;
        this.gems = rand(15) + 5;
        this.drop = new WeightedDrop(undefined, 1);
        this.special1 = this.tentaclePhysicalAttack;
        this.special2 = this.tentacleEntwine;
        this.special3 = this.tentaclePhysicalAttack;
        this.tail.type = Tail.DEMONIC;
        this.checkMonster();
    }

}
