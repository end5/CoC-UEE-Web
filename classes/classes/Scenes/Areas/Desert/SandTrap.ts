import { Monster } from "../../../Monster";
import { SpriteDb } from "../../../display/SpriteDb";
import { StatusEffects } from "../../../StatusEffects";
import { rand } from "../../../Extra";
import { CockTypesEnum } from "../../../CockTypesEnum";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { ChainedDrop } from "../../../internals/ChainedDrop";
import { Tail } from "../../../BodyParts/Tail";

export class SandTrap extends Monster {
    // Wait:
    public sandTrapWait(): void {
        this.clearOutput();
        this.game.spriteSelect(SpriteDb.s_sandtrap);
        if (!this.hasStatusEffect(StatusEffects.Climbed)) this.createStatusEffect(StatusEffects.Climbed, 0, 0, 0, 0);
        this.outputText("Instead of attacking, you turn away from the monster and doggedly attempt to climb back up the pit, digging all of your limbs into the soft powder as you climb against the sandslide.");
        if (this.trapLevel() == 4) {
            this.outputText("\n\nYou eye the ground above you.  The edge of the pit is too sheer, the ground too unstable... although it looks like you can fight against the currents carrying you further down, it seems impossible to gain freedom with the sand under the monster's spell.");
        }
        else {
            // Strength check success: [Player goes up one level, does not go down a level this turn]
            if (this.player.str / 10 + rand(20) > 10) {
                this.outputText("\n\nSweat beads your forehead - trying to clamber out of this pit is like running against the softest treadmill imaginable.  Nonetheless, through considerable effort you see you've managed to pull further clear of the sandtrap's grasp.  \"<i>Watching you squirm around like that gets me so hot,</i>\" it calls up to you.  Turning around you see that the creature is rubbing its hands all over its lean body whilst watching you struggle.  \"<i>Such an energetic little mating dance, just for me... mmm, prey who do that are always the best!</i>\"");
                this.trapLevel(2);
            }
            else {
                // Strength check fail:  [Player goes down as normal]
                this.outputText("\n\nSweat beads your forehead - trying to clamber out of this pit is like running against the softest treadmill imaginable.  You feel like you're going to burst and you eventually give up, noting wearily that you've managed to get nowhere. \"<i>Watching you squirm around like that gets me so hot,</i>\" the sandtrap calls to you.  Turning around you see that the creature is rubbing its hands all over its lean body whilst watching you struggle.  \"<i>Such an energetic little mating dance, just for me... mmm, prey who do that are always the best!</i>\"");
                this.trapLevel(1);
            }
        }
        this.outputText("\n\n");
        this.doAI();
        // combatRoundOver();
    }

    public trapLevel(adjustment: number = 0): number {
        if (!this.hasStatusEffect(StatusEffects.Level)) this.createStatusEffect(StatusEffects.Level, 4, 0, 0, 0);
        if (adjustment != 0) {
            this.addStatusValue(StatusEffects.Level, 1, adjustment);
            // Keep in bounds ya lummox
            if (this.statusEffectv1(StatusEffects.Level) < 1) this.changeStatusValue(StatusEffects.Level, 1, 1);
            if (this.statusEffectv1(StatusEffects.Level) > 4) this.changeStatusValue(StatusEffects.Level, 1, 4);
        }
        return this.statusEffectv1(StatusEffects.Level);
    }

    // sandtrap pheromone attack:
    private sandTrapPheremones(): void {
        this.game.spriteSelect(SpriteDb.s_sandtrap);
        this.outputText("The sandtrap puckers its lips.  For one crazed moment you think it's going to blow you a kiss... but instead it spits clear fluid at you!   You desperately try to avoid it, even as your lower half is mired in sand.");
        if (this.player.spe / 10 + rand(20) > 10 || this.player.getEvasionRoll(false)) {
            this.outputText("  Moving artfully with the flow rather than against it, you are able to avoid the trap's fluids, which splash harmlessly into the dune.");
        }
        else {
            const lustDmg: number = (10 + this.player.lib / 10);
            this.outputText("  Despite ducking away from the jet of fluid as best you can, you cannot avoid some of the stuff splashing upon your arms and face.  The substance feels oddly warm and oily, and though you quickly try to wipe it off it sticks resolutely to your skin and the smell hits your nose.  Your heart begins to beat faster as warmth radiates out from it; you feel languid, light-headed and sensual, eager to be touched and led by the hand to a sandy bed...  Shaking your head, you try to stifle what the foreign pheromones are making you feel.");
            this.player.takeLustDamage(lustDmg, true);
        }
    }

    // sandtrap quicksand attack:
    private nestleQuikSandAttack(): void {
        this.game.spriteSelect(SpriteDb.s_sandtrap);
        this.outputText("The sandtrap smiles at you winningly as it thrusts its hands into the sifting granules.  The sand beneath you suddenly seems to lose even more of its density; you're sinking up to your thighs!");
        // Quicksand attack fail:
        if (this.player.spe / 10 + rand(20) > 10 || this.player.getEvasionRoll(false)) {
            this.outputText("  Acting with alacrity, you manage to haul yourself free of the area affected by the sandtrap's spell, and set yourself anew.");
        }
        // Quicksand attack success: (Speed and Strength loss, ability to fly free lost)
        else {
            this.outputText("  You can't get free in time and in a panic you realize you are now practically wading in sand.  Attempting to climb free now is going to be very difficult.");
            if (this.player.canFly()) this.outputText("  You try to wrench yourself free by flapping your wings, but it is hopeless.  You are well and truly snared.");
            this.trapLevel(-1);
            if (!this.hasStatusEffect(StatusEffects.Climbed)) this.createStatusEffect(StatusEffects.Climbed, 0, 0, 0, 0);
        }
    }

    protected performCombatAction(): void {
        if (this.hasStatusEffect(StatusEffects.Level)) {
            if (this.trapLevel() == 4 && !this.hasStatusEffect(StatusEffects.Climbed)) this.nestleQuikSandAttack();
            else this.sandTrapPheremones();
            // PC sinks a level (end of any turn in which player didn't successfully \"<i>Wait</i>\"):
            if (!this.hasStatusEffect(StatusEffects.Climbed)) {
                this.outputText("\n\nRivulets of sand run past you as you continue to sink deeper into both the pit and the sand itself.");
                this.trapLevel(-1);
            }
            else this.removeStatusEffect(StatusEffects.Climbed);
            this.combatRoundOver();
        } else super.performCombatAction();
    }

    public defeated(hpVictory: boolean): void {
        this.game.desert.sandTrapScene.pcBeatsATrap();
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        if (pcCameWorms) {
            this.outputText("\n\nThe sand trap seems bemused by the insects your body houses...");
            this.doNext(this.game.combat.endLustLoss);
        } else {
            this.game.desert.sandTrapScene.sandtrapmentLoss(true);
        }
    }

    public getAscensionHP(hp: number): number {
        return hp * (1 + this.player.ascensionFactor(1.00)); // +100% per NG+-level
    }

    public SandTrap() {
        // 1/3 have fertilized eggs!
        if (rand(3) == 0) this.createStatusEffect(StatusEffects.Fertilized, 0, 0, 0, 0);
        this.a = "the ";
        if (this.game.silly())
            this.short = "sand tarp";
        else
            this.short = "sandtrap";
        this.imageName = "sandtrap";
        this.long = "You are fighting the sandtrap.  It sits half buried at the bottom of its huge conical pit, only its lean human anatomy on show, leering at you from beneath its shoulder length black hair with its six equally sable eyes.  You cannot say whether its long, soft face with its pointed chin is very pretty or very handsome - every time the creature's face moves, its gender seems to shift.  Its lithe, brown flat-chested body supports four arms, long fingers playing with the rivulets of powder sand surrounding it.  Beneath its belly you occasionally catch glimpses of its insect half: a massive sand-coloured abdomen which anchors it to the desert, with who knows what kind of anatomy.";
        this.race = "Sand Trap";
        // this.plural = false;
        this.createCock(10, 2, CockTypesEnum.HUMAN);
        this.balls = 2;
        this.ballSize = 4;
        this.cumMultiplier = 3;
        // this.hoursSinceCum = 0;
        this.createBreastRow(0, 0);
        this.ass.analLooseness = Ass.LOOSENESS_NORMAL;
        this.ass.analWetness = Ass.WETNESS_DRY;
        this.tallness = rand(8) + 150;
        this.hips.rating = Hips.RATING_AMPLE + 2;
        this.butt.rating = Butt.RATING_LARGE;
        this.skin.tone = "fair";
        this.hair.color = "black";
        this.hair.length = 15;
        this.initStrTouSpeInte(55, 10, 45, 55);
        this.initLibSensCor(60, 45, 50);
        this.weaponName = "claws";
        this.weaponVerb = "claw";
        this.weaponAttack = 10;
        this.armorName = "chitin";
        this.armorDef = 20;
        this.bonusHP = 100;
        this.lust = 20;
        this.lustVuln = .55;
        this.temperment = SandTrap.TEMPERMENT_LOVE_GRAPPLES;
        this.level = 4;
        this.gems = 2 + rand(5);
        this.drop = new ChainedDrop(this.consumables.TRAPOIL).add(this.consumables.OVIELIX, 1 / 3);
        this.tail.type = Tail.DEMONIC;
        this.createStatusEffect(StatusEffects.Level, 4, 0, 0, 0);
        this.checkMonster();
    }

}
