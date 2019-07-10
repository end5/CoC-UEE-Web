import { Monster } from "../../../Monster";
import { StatusEffects } from "../../../StatusEffects";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { rand } from "../../../Extra";
import { WeaponLib } from "../../../Items/WeaponLib";
import { CockTypesEnum } from "../../../CockTypesEnum";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { LowerBody } from "../../../BodyParts/LowerBody";
import { Skin } from "../../../BodyParts/Skin";
import { Face } from "../../../BodyParts/Face";
import { ChainedDrop } from "../../../internals/ChainedDrop";
import { Tail } from "../../../BodyParts/Tail";
import { kGAMECLASS } from "../../../GlobalFlags/kGAMECLASS";

export class MinotaurLord extends Monster {

    protected performCombatAction(): void {
        if (this.HP < 300 && this.statusEffectv1(StatusEffects.MinoMilk) < 4 && this.flags[kFLAGS.URTA_QUEST_STATUS] == 0.75) this.minotaurDrankMalk();
        else if (rand(4) == 0 && this.player.weaponName != "fists") this.minotaurDisarm();
        else if (!this.hasStatusEffect(StatusEffects.Timer)) this.minotaurLordEntangle();
        else if (this.hasStatusEffect(StatusEffects.MinotaurEntangled)) this.minotaurCumPress();
        else {
            if (rand(2) == 0) this.minotaurPrecumTease();
            else this.eAttack();
        }
    }

    private minotaurDrankMalk(): void // Only procs during Urta's quest.
    {
        this.outputText("The minotaur lord snorts audibly and turns to look at his mistress.  \"<i>What is it, Fido, boy?  You thirsty?</i>\"  The hulking minotaur nods.");
        // Success: any
        if (this.statusEffectv1(StatusEffects.MinoMilk) < 3) {
            this.outputText("\"<i>Catch!</i>\"  The succubus throws a bottle containing a milky-white substance to the minotaur.  He grabs it and uncorks the bottle, quickly chugging its contents with obvious enjoyment.  After he is done he looks even more energetic and ready to fight, and his cock looks even harder!");
            this.addHP(300);
            this.lust += 10;
            if (!this.hasStatusEffect(StatusEffects.MinoMilk))
                this.createStatusEffect(StatusEffects.MinoMilk, 1, 0, 0, 0);
            else
                this.addStatusValue(StatusEffects.MinoMilk, 1, 1);
        }
        // Failure: any
        else {
            this.outputText("\"<i>Well too bad!  We're all out of milk... but don't worry, my dear pet, I'll let you drink as much as you want after you're done with this bitch.</i>\"  The succubus replies, idly checking her elongated nails.");
            this.outputText("\n\nThe minotaur glares at you and snorts, obviously pissed at not getting his serving...");
            this.addStatusValue(StatusEffects.MinoMilk, 1, 1);
        }
        this.combatRoundOver();
    }

    private minotaurDisarm(): void {
        if (this.flags[kFLAGS.URTA_QUEST_STATUS] == 0.75) {
            this.outputText("The giant of a minotaur raises his chain threateningly into the air, clearly intent on striking you down.  With your trained reflexes, you quickly move to block his blow with your halberd.  You recoil as the chain impacts your halberd with a loud clang, wrapping around it.  You smile triumphantly at the minotaur, only to glance at his smirk.  With a strong pull, he rips the halberd off your hands and into a corner of the room. Shit!");
            this.outputText("\n\nThe succubus laughs maniacally.  \"<i>Good boy, Fido!  Take that fox slut's toys away so she'll be easier to play with!</i>\"  The minotaur puffs his chest, proud of himself for pleasing his mistress.");
            this.player.setWeapon(WeaponLib.FISTS);
        }
        else {
            this.outputText("The giant of a minotaur raises his chain threateningly into the air, clearly intent on striking you down.  With your trained reflexes, you quickly move to block his blow with your [weapon].  You recoil as the chain impacts your [weapon] with a loud clang, wrapping around it.  You smile triumphantly at the minotaur, only to glance at his smirk.  ");
            if (this.player.weaponName != "fists") {
                this.outputText("With a strong pull, he yanks your " + this.player.weaponName + " off your hands and into a corner of the room. Shit!");
                this.flags[kFLAGS.PLAYER_DISARMED_WEAPON_ID] = this.player.weapon.id;
                this.flags[kFLAGS.PLAYER_DISARMED_WEAPON_ATTACK] = this.player.weaponAttack;
                this.player.setWeapon(WeaponLib.FISTS);
                this.player.createStatusEffect(StatusEffects.Disarmed, 2, 0, 0, 0);
            }
        }
        this.combatRoundOver();
    }

    private minotaurLordEntangle(): void {
        this.outputText("The minotaur lord lashes out with his chain, swinging in a wide arc!\n");
        this.createStatusEffect(StatusEffects.Timer, 2 + rand(4), 0, 0, 0);
        // {dodge/whatever}
        if (this.player.getEvasionRoll()) {
            this.outputText("You leap over the clumsy swing, allowing the chain to fly harmlessly underneath you!");
        }
        else {
            this.outputText("You try to avoid it, but you're too slow, and the chain slaps into your hip, painfully bruising you with the strength of the blow, even through your armor.  The inertia carries the back half of the whip around you, and in a second, the chain has you all wrapped up with your arms pinned to your sides and your movement restricted.");
            if (this.flags[kFLAGS.URTA_QUEST_STATUS] == 0.75) this.outputText("\n\n\"<i>Hahaha!  Good boy, Fido!  Leash that bitch up!</i>\"  The succubus laughs with glee.");
            this.outputText("\n\n<b>You're tangled up in the minotaur lord's chain, and at his mercy, unless you can break free!</b>");
            this.createStatusEffect(StatusEffects.MinotaurEntangled, 0, 0, 0, 0);
        }
        this.combatRoundOver();
    }

    private minotaurCumPress(): void {
        this.outputText("The minotaur lord tugs on the end of the chain, pulling you toward him, making you spin round and round so many times that you're dazed and dizzy.  You can feel the links coming free of your " + this.player.skinFurScales() + ", and the closer you get, the more freedom of movement you have.  Yet, the dizziness makes it hard to do anything other than stumble.  You splat into something wet, sticky, and spongy.  You gasp, breathing a heavy gasp of minotaur musk that makes your head spin in a whole different way.  You pry yourself away from the sweaty, sperm-soaked nuts you landed on and look up, admiring the towering horse-cock with its three-rings of pre-puce along its length.  A droplet of pre-cum as fat as your head smacks into your face, staggering you back and dulling your senses with narcotic lust.");
        kGAMECLASS.dynStats("lus", 22 + this.player.lib / 8 + this.player.sens / 8);
        this.outputText("You tumble to your knees a few feet away, compulsively licking it up.  Once it's gone, ");
        if (this.player.lust >= this.player.maxLust()) this.outputText("you rise up, horny and hungry for more.");
        else {
            this.outputText("you realize what you've been doing.  Your embarrassment gives you the strength to re-adopt your fighting pose, but it's hard with how ");
            if (this.player.hasCock()) {
                this.outputText("rigid");
                if (this.player.lust100 >= 80) this.outputText(" and drippy");
                this.outputText(" your cock has become.  ");

            }
            else if (this.player.hasVagina()) {
                this.outputText("wet your pussy has become.  ");
            }
            else {
                this.outputText("aroused you feel in your groin.  ");
            }
            this.outputText("You want another taste...");
        }
        this.removeStatusEffect(StatusEffects.MinotaurEntangled);
        this.combatRoundOver();
    }

    private minotaurPrecumTease(): void {
        this.outputText("The minotaur smiles at you and lifts his loincloth, flicking it at you.  Thick ropes of pre-cum fly through the air in a swarm,");
        if (rand(2) == 0) {
            this.outputText(" slapping into your face before you can react!  You wipe the slick snot-like stuff out of your eyes and nose, ");
            if (this.player.lust100 >= 70) this.outputText("swallowing it into your mouth without thinking.  You greedily guzzle the potent, narcotic aphrodisiac down, even going so far as to lick it from each of your fingers in turn, sucking every drop into your waiting gullet.");
            else this.outputText("feeling your heart hammer lustily.");
            kGAMECLASS.dynStats("lus", 15 + this.player.lib / 8 + this.player.sens / 8);
        }
        else {
            this.outputText(" right past your head, but the smell alone is enough to make you weak at the knees.");
            if (this.flags[kFLAGS.URTA_QUEST_STATUS] == 0.75) this.outputText("  The animalistic scent of it seems to get inside you, the musky aroma burning a path of liquid heat to your groin, stiffening your horse-cock to absurd degrees.");
            else this.outputText("  The animalistic scent of it seems to get inside you, the musky aroma burning a path of liquid heat to your groin.");
            kGAMECLASS.dynStats("lus", 11 + this.player.lib / 10);
        }
        // (1)
        if (this.player.lust100 <= 75) this.outputText("  You shiver with need, wanting nothing more than to bury your face under that loincloth and slurp out every drop of goopey goodness.");
        else this.outputText("  <b>You groan and lick your lips over and over, craving the taste of him in your mouth.</b>");
        this.combatRoundOver();
    }

    public defeated(hpVictory: boolean): void {
        this.game.clearOutput();
        this.outputText("The minotaur lord is defeated!  ");
        if (this.flags[kFLAGS.URTA_QUEST_STATUS] == 0.75) {
            this.outputText("  You could use him for a quick fuck to sate your lusts before continuing on.  Do you?");
            kGAMECLASS.output.menu();
            kGAMECLASS.output.addButton(0, "Fuck", this.game.urtaQuest.winRapeAMinoLordAsUrta);
            kGAMECLASS.output.addButton(4, "Leave", this.game.urtaQuest.beatMinoLordOnToSuccubi);
        }
        else this.game.mountain.minotaurScene.minoVictoryRapeChoices();
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        if (this.flags[kFLAGS.URTA_QUEST_STATUS] == 0.75) {
            if (hpVictory) this.game.urtaQuest.urtaLosesToMinotaurRoughVersion();
            else this.game.urtaQuest.urtaSubmitsToMinotaurBadEnd();
        }
        else this.game.mountain.minotaurScene.getRapedByMinotaur();
    }

    public constructor() {
        super();
        this.a = "the ";
        this.short = "minotaur lord";
        this.imageName = "minotaurlord";
        if (this.flags[kFLAGS.URTA_QUEST_STATUS] == 0.75) this.long = "Across from you is the biggest minotaur you've ever seen.  Fully eleven feet tall, this shaggy monstrosity has muscles so thick that they stand even through his thick, obscuring fur.  A leather collar with a tag indicates his status as 'pet' though it seems completely out of place on the herculean minotaur.  His legs and arms are like thick tree trunks, imposing and implacable, flexing fiercely with every movement.  This can only be a minotaur lord, a minotaur of strength and virility far beyond his lesser brothers. In his hands, a massive chain swings, connected to his collar, but used as an impromptu weapon for now.  A simple loincloth girds his groin, though it does little to hide the massive, erect length that tents it.  It winds up looking more like a simple, cloth condom than any sort of clothing, and it drips long strings of musky pre-slime in ribbons onto the ground.  Below, heavy testes, each easily the size of a basketball, swing in a taut, sloshing sack.  You can almost smell the liquid bounty he has for you, and the musk he's giving off makes it seem like a good idea...";
        else this.long = "Across from you is the biggest minotaur you've ever seen.  Fully eleven feet tall, this shaggy monstrosity has muscles so thick that they stand even through his thick, obscuring fur.  His legs and arms are like thick tree trunks, imposing and implacable, flexing fiercely with every movement.  This can only be a minotaur lord, a minotaur of strength and virility far beyond his lesser brothers. In his hands, a massive chain swings, connected to his collar, but used as an impromptu weapon for now.  A simple loincloth girds his groin, though it does little to hide the massive, erect length that tents it.  It winds up looking more like a simple, cloth condom than any sort of clothing, and it drips long strings of musky pre-slime in ribbons onto the ground.  Below, heavy testes, each easily the size of a basketball, swing in a taut, sloshing sack.  You can almost smell the liquid bounty he has for you, and the musk he's giving off makes it seem like a good idea...";
        this.race = "Minotaur";
        // this.plural = false;
        this.createCock(rand(13 + 24), 2 + rand(3), CockTypesEnum.HORSE);
        this.balls = 2;
        this.ballSize = 2 + rand(13);
        this.cumMultiplier = 1.5;
        this.hoursSinceCum = this.ballSize * 10;
        this.createBreastRow(0);
        this.ass.analLooseness = Ass.LOOSENESS_STRETCHED;
        this.ass.analWetness = Ass.WETNESS_NORMAL;
        this.createStatusEffect(StatusEffects.BonusACapacity, 50, 0, 0, 0);
        this.tallness = 132;
        this.hips.rating = Hips.RATING_AVERAGE;
        this.butt.rating = Butt.RATING_AVERAGE + 1;
        this.lowerBody.type = LowerBody.HOOFED;
        this.skin.tone = "red";
        this.skin.type = Skin.FUR;
        this.skin.desc = "shaggy fur";
        this.hair.color = MinotaurLord.randomChoice("black", "brown");
        this.hair.length = 3;
        this.face.type = Face.COW_MINOTAUR;
        this.initStrTouSpeInte(125, 90, 30, 30);
        this.initLibSensCor(70, 25, 85);
        this.weaponName = "chain";
        this.weaponVerb = "chain-whip";
        this.weaponAttack = 50;
        this.armorName = "thick fur";
        this.bonusHP = 700;
        this.lust = 50;
        this.lustVuln = 0.33;
        this.temperment = MinotaurLord.TEMPERMENT_LUSTY_GRAPPLES;
        this.level = 15;
        this.additionalXP = 50;
        this.gems = rand(15) + 25;
        if (this.flags[kFLAGS.URTA_QUEST_STATUS] != 0.75) {
            this.drop = new ChainedDrop().add(this.consumables.MINOCUM, 1 / 5)
                .add(this.consumables.MINOBLO, 1 / 2)
                .elseDrop(undefined);
        }
        else this.drop = this.NO_DROP;
        this.tail.type = Tail.COW;
        this.special1 = this.game.mountain.minotaurScene.minoPheromones;
        this.checkMonster();
    }

}
