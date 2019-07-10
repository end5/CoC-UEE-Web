import { Monster } from "../../../Monster";
import { rand } from "../../../Extra";
import { StatusEffects } from "../../../StatusEffects";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { kGAMECLASS } from "../../../GlobalFlags/kGAMECLASS";
import { CockTypesEnum } from "../../../CockTypesEnum";
import { Vagina } from "../../../Vagina";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { WeightedDrop } from "../../../internals/WeightedDrop";
import { Tail } from "../../../BodyParts/Tail";
import { Horns } from "../../../BodyParts/Horns";

export class DemonPack extends Monster {

    protected performCombatAction(): void {
        // Demon pack has different AI
        if (rand(2) == 0)
            this.special1();
        else this.special2();
    }

    public defeated(hpVictory: boolean): void {
        this.clearOutput();
        if (hpVictory) {
            this.outputText("You strike out and the last of the demons tumbles to the ground with a thud. You stand there for a second surrounded by dead or unconscious demons feeling like a god of battle. Then you realize that if a god of battle does exist he lives on a demonic plane like this, so to avoid insulting him you take your hands off your hips and your " + this.player.legs() + " off the head of the demon leader before you start to search the bodies.");
            this.game.dynStats("lus", 1);
        } else {
            this.outputText("The demons stop attacking, and reach out to touch your body. Some are already masturbating like it's the only thing in the world and you know that right now, if you wanted to, you could make each and every one of them fuck you.");
        }
        if (this.hasStatusEffect(StatusEffects.phyllafight)) {
            this.doNext(this.game.desert.antsScene.consolePhylla);
        } else if (hpVictory || this.flags[kFLAGS.SFW_MODE] > 0) {
            this.game.combat.cleanupAfterCombat();
        } else {
            this.outputText("  Do you rape them?");
            kGAMECLASS.output.doYesNo(this.rapeDemons, this.game.combat.cleanupAfterCombat);
        }
    }

    private rapeDemons(): void {
        this.clearOutput();
        this.outputText("You open your arms and step into the throng of eager demons. They jump eagerly to touch you, becoming more and more lust-frenzied every second. You take the nearest demon and throw it to the ground and without a moment's thought the rest of the group leap to join you in a thoughtless madness of lust...");
        this.doNext(this.game.desert.oasis.oasisSexing);
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        this.clearOutput();
        if (this.player.gender == 0) {
            if (hpVictory) {
                this.outputText("You collapse before the demons, who laugh at your utter lack of male or female endowments, beating you until you pass out.");
            } else {
                this.outputText("You offer yourself to the demons, who promptly begin laughing at your lack of endowments.  They fall on you as one, beating you into unconsciousness.");
            }
            this.game.combat.cleanupAfterCombat();
        } else if (this.flags[kFLAGS.SFW_MODE] > 0) {
            this.outputText("Because SFW mode is enabled, this scene is disabled.");
            this.game.combat.cleanupAfterCombat();
        } else if (hpVictory) {
            this.outputText("The demons finally beat you down and you collapse onto the sand of the oasis. Almost immediately you feel demonic hands pressing and probing your prone form. You hear the leader of the group say something in a strange tongue but you have a feeling you know what it means. The demons dive onto your inert body with intent and begin to press themselves against you...");
            this.doNext(this.game.desert.oasis.oasisSexing);
        } else {
            this.outputText("You struggle to keep your mind on the fight and fail to do so. ");
            if (pcCameWorms) {
                this.outputText("\n\nThe demons joke and smile, obviously unconcerned with your state.\n\n");
            }
            if (this.player.cocks.length > 0) {
                if (this.player.cockTotal() > 1) this.outputText("Each of y");
                else this.outputText("Y");
                this.outputText("our " + this.player.multiCockDescriptLight() + " throbs ");
                if (this.player.hasVagina()) this.outputText(" and your ");
            }
            if (this.player.vaginas.length > 0) {
                if (!this.player.hasCock()) this.outputText("Your ");
                this.outputText(this.player.vaginaDescript(0) + " burns ");
            }
            this.outputText("with arousal.  You make a grab for the nearest demon and catch a handful of jiggly breast. You try desperately to use your other arm to pull her closer to slake your thirst but you both go tumbling to the ground. The demonic leader laughs out loud and the rest of the tribe falls on you, grabbing for anything it can find.");
            this.doNext(this.game.desert.oasis.oasisSexing);
        }
    }

    public teased(lustDelta: number): void {
        this.outputText("\n");
        if (lustDelta == 0) this.outputText("\n" + this.capitalA + this.short + " seems unimpressed.");
        else if (lustDelta > 0 && lustDelta < 5) this.outputText("The demons lessen somewhat in the intensity of their attack, and some even eye up your assets as they strike at you.");
        else if (lustDelta >= 5 && lustDelta < 10) this.outputText("The demons are obviously steering clear from damaging anything you might use to fuck and they're starting to leave their hands on you just a little longer after each blow. Some are starting to cop quick feels with their other hands and you can smell the demonic lust of a dozen bodies on the air.");
        else if (lustDelta >= 10) this.outputText("The demons are less and less willing to hit you and more and more willing to just stroke their hands sensuously over you. The smell of demonic lust is thick on the air and part of the group just stands there stroking themselves openly.");
        this.applyTease(lustDelta);
    }

    public constructor() {
        super();
        // trace("DemonPack Constructor!");
        this.a = "the ";
        this.short = "demons";
        this.imageName = "demonmob";
        this.long = "The group is composed of roughly twenty tan-skinned demons, mostly humanoid in shape with many and varied corruptions across the mob. You see demonic high heels, twisting horns and swinging cocks of all shapes and sizes. There even seems to be a bull head in there somewhere. You also make out plenty of breasts ranging from tiny ones to a pair that requires a second person to carry them, and with those breasts a wide range of pussies, dripping and dry, sometimes nestled below some form of demonic dick.  The small tribe carries no weapons and what little clothing they wear is well-shredded, except for one hefty male wearing a cloak of what appears to be snakeskin across his broad shoulders." + (this.game.silly() ? "  You spot an odd patch that reads, \"<i>41st Engineer Company: Vaginal Clearance</i>\" on his shoulder." : "");
        this.race = "Demons";
        this.plural = true;
        this.pronoun1 = "they";
        this.pronoun2 = "them";
        this.pronoun3 = "their";
        this.createCock(18, 2);
        this.createCock(18, 2, CockTypesEnum.DEMON);
        this.balls = 2;
        this.ballSize = 1;
        this.cumMultiplier = 3;
        // this.hoursSinceCum = 0;
        this.createVagina(false, Vagina.WETNESS_SLICK, Vagina.LOOSENESS_LOOSE);
        this.createBreastRow(0);
        this.ass.analLooseness = Ass.LOOSENESS_STRETCHED;
        this.ass.analWetness = Ass.WETNESS_SLIME_DROOLING;
        this.tallness = rand(8) + 70;
        this.hips.rating = Hips.RATING_AMPLE + 2;
        this.butt.rating = Butt.RATING_LARGE;
        this.skin.tone = "red";
        this.hair.color = "black";
        this.hair.length = 15;
        this.initStrTouSpeInte(80, 10, 10, 5);
        this.initLibSensCor(50, 60, 80);
        this.weaponName = "claws";
        this.weaponVerb = "claw";
        this.armorName = "demonic skin";
        this.bonusHP = 200;
        this.lust = 30;
        this.temperment = DemonPack.TEMPERMENT_LOVE_GRAPPLES;
        this.level = 6;
        this.gems = rand(25) + 10;
        this.drop = new WeightedDrop().addMany(1,
            this.consumables.SUCMILK,
            this.consumables.INCUBID,
            this.consumables.OVIELIX,
            this.consumables.B__BOOK);
        this.special1 = this.game.combat.packAttack;
        this.special2 = this.game.combat.lustAttack;
        this.tail.type = Tail.DEMONIC;
        this.horns.type = Horns.DEMON;
        this.horns.value = 2;
        this.checkMonster();
    }

}
