import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";
import { PerkLib } from "../../PerkLib";
import { Vagina } from "../../Vagina";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { Neck } from "../../BodyParts/Neck";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

/**
 * @since March 31, 2018
 * @author Stadler76
 */
export class SuccubiMilk extends Consumable {
    public static TAINTED: number = 0;
    public static PURIFIED: number = 1;

    private tainted: boolean;

    public constructor(type: number) {
        let id: string;
        let shortName: string;
        let longName: string;
        let description: string;
        let value: number;

        switch (type) {
            case SuccubiMilk.TAINTED:
                id = "SucMilk";
                shortName = "SucMilk";
                longName = "a bottle of Succubi milk";
                description = 'This milk-bottle is filled to the brim with a creamy white milk of dubious origin.'
                    + ' A pink label proudly labels it as "<i>Succubi Milk</i>".'
                    + ' In small text at the bottom of the label it reads: "<i>To bring out the succubus in YOU!</i>"';
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            case SuccubiMilk.PURIFIED:
                id = "P.S.Mlk";
                shortName = "P.S.Mlk";
                longName = "";
                description = 'This milk-bottle is filled to the brim with a creamy white milk of dubious origin.'
                    + ' A pink label proudly labels it as "<i>Succubi Milk</i>".'
                    + ' In small text at the bottom of the label it reads: "<i>To bring out the succubus in YOU!</i>"'
                    + ' Purified by Rathazul to prevent corruption.';
                value = 20;
                break;

            default: // Remove this if someone manages to get SonarQQbe to not whine about a missing default ... ~Stadler76
                throw new Error('SuccubiMilk. Incorrect or no type passed to constructor');
        }

        super(id, shortName, longName, value, description);
        this.tainted = type === SuccubiMilk.TAINTED;
    }

    public useItem(): boolean {
        let tfSource: string = "succubiMilk";
        if (!this.tainted) tfSource += "-purified";
        let temp: number;
        this.player.slimeFeed();
        let temp2: number = 0;
        let temp3: number = 0;
        let rando: number = rand(100);
        if (this.player.hasPerk(PerkLib.HistoryAlchemist)) rando += 10;
        if (this.player.hasPerk(PerkLib.TransformationResistance)) rando -= 10;
        this.clearOutput();
        if (this.player.cor < 35) this.outputText("You wonder why in the gods' names you would drink such a thing, but you have to admit, it is the best thing you have ever tasted.");
        if (this.player.cor >= 35 && this.player.cor < 70) {
            this.outputText("You savor the incredible flavor as you greedily gulp it down.");
            if (this.player.gender == 2 || this.player.gender == 3) {
                this.outputText("  The taste alone makes your " + this.player.vaginaDescript(0) + " feel ");
                if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_DRY) this.outputText("tingly.");
                if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_NORMAL) this.outputText("wet.");
                if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_WET) this.outputText("sloppy and wet.");
                if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_SLICK) this.outputText("sopping and juicy.");
                if (this.player.vaginas[0].vaginalWetness >= Vagina.WETNESS_DROOLING) this.outputText("dripping wet.");
            }
            else if (this.player.hasCock()) this.outputText("  You feel a building arousal, but it doesn't affect your cock.");
        }
        if (this.player.cor >= 70) {
            this.outputText("You pour the milk down your throat, chugging the stuff as fast as you can.  You want more.");
            if (this.player.gender == 2 || this.player.gender == 3) {
                this.outputText("  Your " + this.player.vaginaDescript(0));
                if (this.player.vaginas.length > 1) this.outputText(" quiver in orgasm, ");
                if (this.player.vaginas.length == 1) this.outputText(" quivers in orgasm, ");
                if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_DRY) this.outputText("becoming slightly sticky.");
                if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_NORMAL) this.outputText("leaving your undergarments sticky.");
                if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_WET) this.outputText("wet with girlcum.");
                if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_SLICK) this.outputText("staining your undergarments with cum.");
                if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_DROOLING) this.outputText("leaving cunt-juice trickling down your leg.");
                if (this.player.vaginas[0].vaginalWetness >= Vagina.WETNESS_SLAVERING) this.outputText("spraying your undergarments liberally with slick girl-cum.");
                this.player.orgasm('Vaginal');
            }
            else if (this.player.gender !== 0) {
                if (this.player.cocks.length == 1) this.outputText("  You feel a strange sexual pleasure, but your " + this.player.multiCockDescript() + " remains unaffected.");
                else this.outputText("  You feel a strange sexual pleasure, but your " + this.player.multiCockDescript() + " remain unaffected.");
            }
        }
        if (this.tainted) this.dynStats("spe", 1, "lus", 3, "cor", 1);
        else this.dynStats("spe", 1, "lus", 3);
        // Breast growth (maybe cock reduction!)
        if (rando <= 75) {
            // Temp stores the level of growth...
            temp = 1 + rand(3);
            if (this.player.breastRows.length > 0) {
                if (this.player.breastRows[0].breastRating < 2 && rand(3) === 0) temp++;
                if (this.player.breastRows[0].breastRating < 5 && rand(4) === 0) temp++;
                if (this.player.breastRows[0].breastRating < 6 && rand(5) === 0) temp++;
            }
            this.outputText("\n\n");
            this.player.growTits(temp, this.player.breastRows.length, true, 3);
            if (this.player.breastRows.length == 0) {
                this.outputText("A perfect pair of B cup breasts, complete with tiny nipples, form on your chest.");
                this.player.createBreastRow();
                this.player.breastRows[0].breasts = 2;
                this.player.breastRows[0].nipplesPerBreast = 1;
                this.player.breastRows[0].breastRating = 2;
                this.outputText("\n");
            }
            if (!this.flags[kFLAGS.HYPER_HAPPY]) {
                // Shrink cocks if you have them.
                if (this.player.cocks.length > 0) {
                    temp = 0;
                    temp2 = this.player.cocks.length;
                    temp3 = 0;
                    // Find biggest cock
                    while (temp2 > 0) {
                        temp2--;
                        if (this.player.cocks[temp].cockLength <= this.player.cocks[temp2].cockLength) temp = temp2;
                    }
                    // Shrink said cock
                    if (this.player.cocks[temp].cockLength < 6 && this.player.cocks[temp].cockLength >= 2.9) {
                        this.player.cocks[temp].cockLength -= .5;
                        temp3 -= .5;
                        if (this.player.cocks[temp].cockThickness * 6 > this.player.cocks[temp].cockLength) this.player.cocks[temp].cockThickness -= .2;
                        if (this.player.cocks[temp].cockThickness * 8 > this.player.cocks[temp].cockLength) this.player.cocks[temp].cockThickness -= .2;
                        if (this.player.cocks[temp].cockThickness < .5) this.player.cocks[temp].cockThickness = .5;
                    }
                    temp3 += this.player.increaseCock(temp, (rand(3) + 1) * -1);
                    this.outputText("\n\n");
                    this.player.lengthChange(temp3, 1);
                    if (this.player.cocks[temp].cockLength < 2) {
                        this.outputText("  ");
                        this.player.killCocks(1);
                    }
                }
            }
        }
        if (this.player.vaginas.length == 0 && (rand(3) === 0 || (rando > 75 && rando < 90))) {
            this.player.createVagina();
            this.player.vaginas[0].vaginalLooseness = Vagina.LOOSENESS_TIGHT;
            this.player.vaginas[0].vaginalWetness = Vagina.WETNESS_NORMAL;
            this.player.vaginas[0].virgin = true;
            this.player.setClitLength(.25);
            if (this.player.fertility <= 5) this.player.fertility = 6;
            this.outputText("\n\nAn itching starts in your crotch and spreads vertically.  You reach down and discover an opening.  You have grown a <b>new " + this.player.vaginaDescript(0) + "</b>!");
        }
        // Increase pussy wetness or grow one!!
        else if (rando > 75 && rando < 90) {
            // Shrink cawk
            if (this.player.cocks.length > 0 && !this.flags[kFLAGS.HYPER_HAPPY]) {
                this.outputText("\n\n");
                temp = 0;
                temp2 = this.player.cocks.length;
                // Find biggest cock
                while (temp2 > 0) {
                    temp2--;
                    if (this.player.cocks[temp].cockLength <= this.player.cocks[temp2].cockLength) temp = temp2;
                }
                // Shrink said cock
                if (this.player.cocks[temp].cockLength < 6 && this.player.cocks[temp].cockLength >= 2.9) {
                    this.player.cocks[temp].cockLength -= .5;
                }
                temp3 = this.player.increaseCock(temp, -1 * (rand(3) + 1));
                this.player.lengthChange(temp3, 1);
                if (this.player.cocks[temp].cockLength < 3) {
                    this.outputText("  ");
                    this.player.killCocks(1);
                }
            }
            if (this.player.vaginas.length > 0) {
                this.outputText("\n\n");
                // 0 = dry, 1 = wet, 2 = extra wet, 3 = always slick, 4 = drools constantly, 5 = female ejaculator
                if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_SLAVERING) {
                    if (this.player.vaginas.length == 1) this.outputText("Your " + this.player.vaginaDescript(0) + " gushes fluids down your leg as you spontaneously orgasm.");
                    else this.outputText("Your " + this.player.vaginaDescript(0) + "s gush fluids down your legs as you spontaneously orgasm, leaving a thick puddle of pussy-juice on the ground.  It is rapidly absorbed by the earth.");
                    this.player.orgasm('Vaginal');
                    if (this.tainted) this.dynStats("cor", 1);
                }
                if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_DROOLING) {
                    if (this.player.vaginas.length == 1) this.outputText("Your pussy feels hot and juicy, aroused and tender.  You cannot resist as your hands dive into your " + this.player.vaginaDescript(0) + ".  You quickly orgasm, squirting fluids everywhere.  <b>You are now a squirter</b>.");
                    if (this.player.vaginas.length > 1) this.outputText("Your pussies feel hot and juicy, aroused and tender.  You cannot resist plunging your hands inside your " + this.player.vaginaDescript(0) + "s.  You quiver around your fingers, squirting copious fluids over yourself and the ground.  The fluids quickly disappear into the dirt.");
                    this.player.orgasm('Vaginal');
                    if (this.tainted) this.dynStats("cor", 1);
                }
                if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_SLICK) {
                    if (this.player.vaginas.length == 1) this.outputText("You feel a sudden trickle of fluid down your leg.  You smell it and realize it's your pussy-juice.  Your " + this.player.vaginaDescript(0) + " now drools lubricant constantly down your leg.");
                    if (this.player.vaginas.length > 1) this.outputText("You feel sudden trickles of fluids down your leg.  You smell the stuff and realize it's your pussies-juices.  They seem to drool lubricant constantly down your legs.");
                }
                if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_WET) {
                    this.outputText("You flush in sexual arousal as you realize how moist your cunt-lips have become.  Once you've calmed down a bit you realize they're still slick and ready to fuck, and always will be.");
                }
                if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_NORMAL) {
                    if (this.player.vaginas.length == 1) this.outputText("A feeling of intense arousal passes through you, causing you to masturbate furiously.  You realize afterwards that your " + this.player.vaginaDescript(0) + " felt much wetter than normal.");
                    else this.outputText("A feeling of intense arousal passes through you, causing you to masturbate furiously.  You realize afterwards that your " + this.player.vaginaDescript(0) + " were much wetter than normal.");
                }
                if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_DRY) {
                    this.outputText("You feel a tingling in your crotch, but cannot identify it.");
                }
                temp = this.player.vaginas.length;
                while (temp > 0) {
                    temp--;
                    if (this.player.vaginas[temp].vaginalWetness < Vagina.WETNESS_SLAVERING) this.player.vaginas[temp].vaginalWetness++;
                }
            }
        }
        if (rando >= 90) {
            if (!this.tainted || this.player.skin.tone == "blue" || this.player.skin.tone == "purple" || this.player.skin.tone == "indigo" || this.player.skin.tone == "shiny black") {
                if (this.player.vaginas.length > 0) {
                    this.outputText("\n\nYour heart begins beating harder and harder as heat floods to your groin.  You feel your clit peeking out from under its hood, growing larger and longer as it takes in more and more blood.");
                    if (this.player.getClitLength() > 3 && !this.player.hasPerk(PerkLib.BigClit)) this.outputText("  After some time it shrinks, returning to its normal aroused size.  You guess it can't get any bigger.");
                    if (this.player.getClitLength() > 5 && this.player.hasPerk(PerkLib.BigClit)) this.outputText("  Eventually it shrinks back down to its normal (but still HUGE) size.  You guess it can't get any bigger.");
                    if (((this.player.hasPerk(PerkLib.BigClit)) && this.player.getClitLength() < 6)
                        || this.player.getClitLength() < 3) {
                        temp = 2; // minimum growth
                        if (this.player.hasPerk(PerkLib.BigClit)) temp += 2;
                        this.player.changeClitLength((rand(4) + temp) / 10);
                    }
                    this.dynStats("sen", 3, "lus", 8);
                }
                else {
                    this.player.createVagina();
                    this.player.vaginas[0].vaginalLooseness = Vagina.LOOSENESS_TIGHT;
                    this.player.vaginas[0].vaginalWetness = Vagina.WETNESS_NORMAL;
                    this.player.vaginas[0].virgin = true;
                    this.player.setClitLength(.25);
                    this.outputText("\n\nAn itching starts in your crotch and spreads vertically.  You reach down and discover an opening.  You have grown a <b>new " + this.player.vaginaDescript(0) + "</b>!");
                }
            }
            else {
                temp = rand(10);
                if (temp == 0) this.player.skin.tone = "shiny black";
                if (temp == 1 || temp == 2) this.player.skin.tone = "indigo";
                if (temp == 3 || temp == 4 || temp == 5) this.player.skin.tone = "purple";
                if (temp > 5) this.player.skin.tone = "blue";
                this.outputText("\n\nA tingling sensation runs across your skin in waves, growing stronger as <b>your skin's tone slowly shifts, darkening to become " + this.player.skin.tone + " in color.</b>");
                this.player.arms.updateClaws(this.player.arms.claws.type);
                if (this.tainted) this.dynStats("cor", 1);
                else this.dynStats("cor", 0);
                kGAMECLASS.rathazul.addMixologyXP(20);
            }
        }
        // Neck restore
        if (this.player.neck.type !== Neck.NORMAL && this.changes < this.changeLimit && rand(4) === 0) {
            this.mutations.restoreNeck(tfSource);
        }
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && rand(5) === 0) {
            this.mutations.restoreRearBody(tfSource);
        }
        // Ovi perk loss
        if (rand(5) === 0) {
            this.mutations.updateOvipositionPerk(tfSource);
        }
        // Demonic changes - higher chance with higher corruption.
        if (rand(40) + this.player.cor / 3 > 35 && this.tainted) {
            this.mutations.demonChanges(tfSource);
        }
        if (this.tainted) {
            this.outputText(this.player.modFem(100, 2));
            if (rand(3) === 0) this.outputText(this.player.modTone(15, 2));
        }
        else {
            this.outputText(this.player.modFem(90, 1));
            if (rand(3) === 0) this.outputText(this.player.modTone(20, 2));
        }
        this.player.refillHunger(20);
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;

        return false;
    }
}
