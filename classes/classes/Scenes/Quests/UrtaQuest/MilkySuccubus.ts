import { AbstractSuccubus } from "../../Monsters/AbstractSuccubus";
import { StatusEffects } from "../../../StatusEffects";
import { rand } from "../../../Extra";
import { Vagina } from "../../../Vagina";
import { Appearance } from "../../../Appearance";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { LowerBody } from "../../../BodyParts/LowerBody";
import { Horns } from "../../../BodyParts/Horns";
import { Wings } from "../../../BodyParts/Wings";
import { Tail } from "../../../BodyParts/Tail";
import { kGAMECLASS } from "../../../GlobalFlags/kGAMECLASS";

export class MilkySuccubus extends AbstractSuccubus {

    protected performCombatAction(): void {
        if (!this.hasStatusEffect(StatusEffects.MilkyUrta) && rand(3) == 0) this.cowCubiMilkSprayAttack();
        else if (this.HP < 400) this.drinkMinoCum();
        else if (this.player.HP < 100) this.eAttack();
        else if (this.player.lust100 >= 90) this.succubusTease();
        else if (rand(2) == 0) this.succubusTease();
        else this.eAttack();
    }

    private cowCubiMilkSprayAttack(): void {
        // Lasts a couple turns like the goblin lust poison?
        this.outputText("\"<i>How about a taste?</i>\"  The succubus asks, pressing her tits together.  Before you can reply, a veritable jet of milk sprays in your direction!\n");
        // Miss:
        if (rand(20) + 1 + this.player.spe / 20 > 17) {
            this.outputText("With your trained reflexes, you manage to duck and roll, narrowly avoiding getting sprayed with milk.");
            this.outputText("\n\n\"<i>Such a waste.</i>\"  The succubus pouts.  \"<i>No worries, I'll just have Fido clean it up later... perhaps I'll even have you do it later, when you become mine.</i>\"  The succubus giggles.");
            kGAMECLASS.dynStats("lus", 6);
        }
        // Hit:
        else {
            this.outputText("All you manage to do is cover your face; the rest of you, however, gets completely soaked in the demon's corrupted milk.  Looking down at yourself, you realize that you are panting, and the places where the milk splashed your fur begin to heat up.  Oh no! <b>You'd better finish off this succubus before you succumb to your lusts!</b>");
            kGAMECLASS.dynStats("lus", 15);
            this.createStatusEffect(StatusEffects.MilkyUrta, 3, 0, 0, 0);
        }
        this.combatRoundOver();
    }

    private drinkMinoCum(): void {
        this.outputText("Smiling wryly and licking her lips, the succubus-cow procures a bottle of her pet's cum with her probing tail.");
        // Success:
        if (!this.hasStatusEffect(StatusEffects.DrankMinoCum) || !this.hasStatusEffect(StatusEffects.DrankMinoCum2)) {
            this.outputText("\n\nSmiling triumphantly, she takes the bottle and opens it with a pop, drinking the contents with glee.  When done, she throws the bottle away and smacks her lips.  \"<i>Nothing like a bottle of minotaur cum to get you back on your feet, right?</i>\"  She grins, her pussy dripping with more juices.");
            this.addHP(400);
            this.lust += 25;
            if (!this.hasStatusEffect(StatusEffects.DrankMinoCum)) this.createStatusEffect(StatusEffects.DrankMinoCum, 0, 0, 0, 0);
            else this.createStatusEffect(StatusEffects.DrankMinoCum2, 0, 0, 0, 0);
        }
        // Failure:
        else {
            this.outputText("\n\nShe frowns and looks behind her, pouting slightly when she turns to look back at you.  \"<i>Seems like I'm all out of cum.</i>\"  She grins evilly.  \"<i>I'll just have to get more after I'm done with you.</i>\"");
        }
        this.combatRoundOver();
    }

    private succubusTease(): void {
        if (rand(4) == 0) this.outputText("Turning around, the succubus begins to bounce her rather round derriere in your direction, the cheeks lewdly clapping together with each change in direction, exposing her dark anal star and juicy snatch, literally gushing forth a stream of lubricants.  Her eyes glow with faint, purple light as she whispers, \"<i>Don't you just want to... slide on in?</i>\"");
        else if (rand(3) == 0) this.outputText("The succubus squeezes her spotted, sweat-oiled breasts together, squirting out trickles of fresh, creamy, succubi milk.  Bending down, she laps at her own bounty, taking to meet your eyes, her own glowing violet.  You can feel her next words as much as hear them, reaching into your brain and stirring a familiar heat in your loins.  \"<i>Giving in would mean pleasure unending, my dear vixen.</i>\"");
        else if (rand(2) == 0) this.outputText("The succubus turns slightly and slowly bends over, sliding her hands down the sides of her milk laden jugs. \"<i>Mmm, would you help a poor girl relax? These things need some attention,</i>\" she says with a lust filled moan as her hands reach her multitude of nipples.");
        else this.outputText("The succubus leans forwards holding her tits, while wrapping her fingers around her nipples.  \"<i>My boobs are soo full.  Would you like to help me drain them?</i>\" she says with a husky voice.");
        kGAMECLASS.dynStats("lus", 20);
        this.combatRoundOver();
    }

    public defeated(hpVictory: boolean): void {
        this.game.urtaQuest.urtaBeatsUpCowcubi();
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        this.game.urtaQuest.urtaLosesToCowCubi();
    }

    public teased(lustDelta: number): void {
        this.outputText(this.capitalA + this.short + " smiles, rubbing her hands across herself as she watches your display.  She does not seem greatly affected by your show - at least in the sense of increasing arousal.  She does seem oddly more... vital, as if she drew strength from the very display you put on.");
        this.str += 5;
        this.addHP(50);
        this.applyTease(lustDelta);
    }

    public constructor() {
        super();
        this.a = "the ";
        this.short = "milky succubus";
        this.imageName = "milkysuccubus";
        this.long = "You are fighting a milky, cow-like succubus.  She stands about seven feet tall and is hugely voluptuous, with breasts three times the size of her head, tipped with a cluster of four obscenely teat-like nipples.  Her hips flare out into an exaggerated hourglass shape, with a long tail tipped with a fleshy arrow-head spade that waves above her spankable butt.  A small cowbell is tied at the base of the arrow-head with a cute little ribbon.  Wide, cow-like horns, easily appropriate for a minotaur, rise from her head, and she flicks bovine ears about the sides of her head whilst sashaying from side to side on demonic, high-heeled feet.  Her skin is a vibrant purple with splotches of shiny black here and there, including one large spot covering her right eye.  She's using a leather whip as a weapon.";
        this.race = "Demon";
        // this.plural = false;
        this.createVagina(false, Vagina.WETNESS_SLAVERING, Vagina.LOOSENESS_NORMAL);
        this.createStatusEffect(StatusEffects.BonusVCapacity, 300, 0, 0, 0);
        this.createBreastRow(Appearance.breastCupInverse("G"));
        this.ass.analLooseness = Ass.LOOSENESS_STRETCHED;
        this.ass.analWetness = Ass.WETNESS_SLIME_DROOLING;
        this.tallness = 84;
        this.hips.rating = Hips.RATING_CURVY;
        this.butt.rating = Butt.RATING_LARGE + 1;
        this.lowerBody.type = LowerBody.DEMONIC_HIGH_HEELS;
        this.skin.tone = "blue";
        this.hair.color = "black";
        this.hair.length = 13;
        this.initStrTouSpeInte(75, 50, 125, 95);
        this.initLibSensCor(90, 60, 99);
        this.weaponName = "whip";
        this.weaponVerb = "whipping";
        this.weaponAttack = 10;
        this.weaponPerk = "";
        this.weaponValue = 150;
        this.armorName = "demonic skin";
        this.armorDef = 10;
        this.bonusHP = 700;
        this.lust = 40;
        this.lustVuln = .3;
        this.temperment = MilkySuccubus.TEMPERMENT_LOVE_GRAPPLES;
        this.level = 16;
        this.gems = rand(25) + 10;
        this.additionalXP = 50;
        this.drop = this.NO_DROP;
        this.horns.type = Horns.DRACONIC_X2;
        this.horns.value = 2;
        this.wings.type = Wings.BAT_LIKE_TINY;
        this.tail.type = Tail.DEMONIC;
        this.special1 = this.kissAttack;
        this.special2 = this.seduceAttack;
        this.special3 = this.whipAttack;
        this.drop = this.NO_DROP;
        this.checkMonster();
    }

}
