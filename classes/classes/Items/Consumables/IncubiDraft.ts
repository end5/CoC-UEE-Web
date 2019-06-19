import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { PerkLib } from "../../PerkLib";
import { CockTypesEnum } from "../../CockTypesEnum";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { int } from "../../Extra";
import { Neck } from "../../BodyParts/Neck";

/**
 * @since March 31, 2018
 * @author Stadler76
 */
export class IncubiDraft extends Consumable {
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
            case IncubiDraft.TAINTED:
                id = "IncubiD";
                shortName = "IncubiD";
                longName = "an Incubi draft";
                description = "The cork-topped flask swishes with a slimy looking off-white fluid, purported to give incubi-like powers."
                    + " A stylized picture of a humanoid with a huge penis is etched into the glass.";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            case IncubiDraft.PURIFIED:
                id = "P.Draft";
                shortName = "P.Draft";
                longName = "an untainted Incubi draft";
                description = "The cork-topped flask swishes with a slimy looking off-white fluid, purported to give incubi-like powers."
                    + " A stylized picture of a humanoid with a huge penis is etched into the glass."
                    + " Rathazul has purified this to prevent corruption upon use.";
                value = 20;
                break;

            default: // Remove this if someone manages to get SonarQQbe to not whine about a missing default ... ~Stadler76
            throw new Error("IncubiDraft. Incorrect or no type was passed to constructor");
        }

        super(id, shortName, longName, value, description);
        this.tainted = type === IncubiDraft.TAINTED;
    }

    public useItem(): boolean {
        let tfSource: string = "incubiDraft";
        if (!this.tainted) tfSource += "-purified";
        let temp: number;
        this.player.slimeFeed();
        let temp2: number = 0;
        let temp3: number = 0;
        let rando: number = IncubiDraft.rand(100);
        if (this.player.hasPerk(PerkLib.HistoryAlchemist)) rando += 10;
        if (this.player.hasPerk(PerkLib.TransformationResistance)) rando -= 10;
        this.clearOutput();
        this.outputText("The draft is slick and sticky, ");
        if (this.player.cor <= 33) this.outputText("just swallowing it makes you feel unclean.");
        if (this.player.cor > 33 && this.player.cor <= 66) this.outputText("reminding you of something you just can't place.");
        if (this.player.cor > 66) this.outputText("deliciously sinful in all the right ways.");
        if (this.player.cor >= 90) this.outputText("  You're sure it must be distilled from the cum of an incubus.");
        // Lowlevel changes
        if (rando < 50) {
            if (this.player.cocks.length == 1) {
                if (this.player.cocks[0].cockType !== CockTypesEnum.DEMON) this.outputText("\n\nYour " + this.player.cockDescript(0) + " becomes shockingly hard.  It turns a shiny inhuman purple and spasms, dribbling hot demon-like cum as it begins to grow.");
                else this.outputText("\n\nYour " + this.player.cockDescript(0) + " becomes shockingly hard.  It dribbles hot demon-like cum as it begins to grow.");
                if (IncubiDraft.rand(4) === 0) temp = this.player.increaseCock(0, 3);
                else temp = this.player.increaseCock(0, 1);
                if (temp < .5) this.outputText("  It stops almost as soon as it starts, growing only a tiny bit longer.");
                if (temp >= .5 && temp < 1) this.outputText("  It grows slowly, stopping after roughly half an inch of growth.");
                if (temp >= 1 && temp <= 2) this.outputText("  The sensation is incredible as more than an inch of lengthened dick-flesh grows in.");
                if (temp > 2) this.outputText("  You smile and idly stroke your lengthening " + this.player.cockDescript(0) + " as a few more inches sprout.");
                if (this.tainted) this.dynStats("int", 1, "lib", 2, "sen", 1, "lus", 5 + temp * 3, "cor", 1);
                else this.dynStats("int", 1, "lib", 2, "sen", 1, "lus", 5 + temp * 3);
                if (this.player.cocks[0].cockType !== CockTypesEnum.DEMON) this.outputText("  With the transformation complete, your " + this.player.cockDescript(0) + " returns to its normal coloration.");
                else this.outputText("  With the transformation complete, your " + this.player.cockDescript(0) + " throbs in an almost happy way as it goes flaccid once more.");
            }
            if (this.player.cocks.length > 1) {
                temp = this.player.cocks.length;
                temp2 = 0;
                // Find shortest cock
                while (temp > 0) {
                    temp--;
                    if (this.player.cocks[temp].cockLength <= this.player.cocks[temp2].cockLength) {
                        temp2 = temp;
                    }
                }
                if (IncubiDraft.rand(4) === 0) temp3 = this.player.increaseCock(temp2, 3);
                else temp3 = this.player.increaseCock(temp2, 1);
                if (this.tainted) this.dynStats("int", 1, "lib", 2, "sen", 1, "lus", 5 + temp * 3, "cor", 1);
                else this.dynStats("int", 1, "lib", 2, "sen", 1, "lus", 5 + temp * 3);
                // Grammar police for 2 cocks
                if (this.player.cockTotal() == 2) this.outputText("\n\nBoth of your " + this.player.multiCockDescriptLight() + " become shockingly hard, swollen and twitching as they turn a shiny inhuman purple in color.  They spasm, dripping thick ropes of hot demon-like pre-cum along their lengths as your shortest " + this.player.cockDescript(temp2) + " begins to grow.");
                // For more than 2
                else this.outputText("\n\nAll of your " + this.player.multiCockDescriptLight() + " become shockingly hard, swollen and twitching as they turn a shiny inhuman purple in color.  They spasm, dripping thick ropes of hot demon-like pre-cum along their lengths as your shortest " + this.player.cockDescript(temp2) + " begins to grow.");

                if (temp3 < .5) this.outputText("  It stops almost as soon as it starts, growing only a tiny bit longer.");
                if (temp3 >= .5 && temp3 < 1) this.outputText("  It grows slowly, stopping after roughly half an inch of growth.");
                if (temp3 >= 1 && temp3 <= 2) this.outputText("  The sensation is incredible as more than an inch of lengthened dick-flesh grows in.");
                if (temp3 > 2) this.outputText("  You smile and idly stroke your lengthening " + this.player.cockDescript(temp2) + " as a few more inches sprout.");
                this.outputText("  With the transformation complete, your " + this.player.multiCockDescriptLight() + " return to their normal coloration.");
            }
            // NO CAWKS?
            if (this.player.cocks.length == 0) {
                this.outputText("\n\n");
                this.mutations.growDemonCock(1);
                if (this.tainted) this.dynStats("lib", 3, "sen", 5, "lus", 10, "cor", 3);
                else this.dynStats("lib", 3, "sen", 5, "lus", 10);
            }
            // TIT CHANGE 25% chance of shrinkage
            if (IncubiDraft.rand(4) === 0 && !this.flags[kFLAGS.HYPER_HAPPY]) {
                this.player.shrinkTits();
            }
        }
        // Mid-level changes
        if (rando >= 50 && rando < 93) {
            if (this.player.cocks.length > 1) {
                this.outputText("\n\nYour cocks fill to full-size... and begin growing obscenely.  ");
                temp = this.player.cocks.length;
                while (temp > 0) {
                    temp--;
                    temp2 = this.player.increaseCock(temp, IncubiDraft.rand(3) + 2);
                    temp3 = this.player.cocks[temp].thickenCock(1);
                    if (temp3 < .1) this.player.cocks[temp].cockThickness += .05;
                }
                this.player.lengthChange(temp2, this.player.cocks.length);
                // Display the degree of thickness change.
                if (temp3 >= 1) {
                    if (this.player.cocks.length == 1) this.outputText("\n\nYour cock spreads rapidly, swelling an inch or more in girth, making it feel fat and floppy.");
                    else this.outputText("\n\nYour cocks spread rapidly, swelling as they grow an inch or more in girth, making them feel fat and floppy.");
                }
                if (temp3 <= .5) {
                    if (this.player.cocks.length > 1) this.outputText("\n\nYour cocks feel swollen and heavy. With a firm, but gentle, squeeze, you confirm your suspicions. They are definitely thicker.");
                    else this.outputText("\n\nYour cock feels swollen and heavy. With a firm, but gentle, squeeze, you confirm your suspicions. It is definitely thicker.");
                }
                if (temp3 > .5 && temp2 < 1) {
                    if (this.player.cocks.length == 1) this.outputText("\n\nYour cock seems to swell up, feeling heavier. You look down and watch it growing fatter as it thickens.");
                    if (this.player.cocks.length > 1) this.outputText("\n\nYour cocks seem to swell up, feeling heavier. You look down and watch them growing fatter as they thicken.");
                }
                if (this.tainted) this.dynStats("lib", 3, "sen", 5, "lus", 10, "cor", 3);
                else this.dynStats("lib", 3, "sen", 5, "lus", 10);
            }
            if (this.player.cocks.length == 1) {
                this.outputText("\n\nYour cock fills to its normal size and begins growing... ");
                temp3 = this.player.cocks[0].thickenCock(1);
                temp2 = this.player.increaseCock(0, IncubiDraft.rand(3) + 2);
                this.player.lengthChange(temp2, 1);
                // Display the degree of thickness change.
                if (temp3 >= 1) {
                    if (this.player.cocks.length == 1) this.outputText("  Your cock spreads rapidly, swelling an inch or more in girth, making it feel fat and floppy.");
                    else this.outputText("  Your cocks spread rapidly, swelling as they grow an inch or more in girth, making them feel fat and floppy.");
                }
                if (temp3 <= .5) {
                    if (this.player.cocks.length > 1) this.outputText("  Your cocks feel swollen and heavy. With a firm, but gentle, squeeze, you confirm your suspicions. They are definitely thicker.");
                    else this.outputText("  Your cock feels swollen and heavy. With a firm, but gentle, squeeze, you confirm your suspicions. It is definitely thicker.");
                }
                if (temp3 > .5 && temp2 < 1) {
                    if (this.player.cocks.length == 1) this.outputText("  Your cock seems to swell up, feeling heavier. You look down and watch it growing fatter as it thickens.");
                    if (this.player.cocks.length > 1) this.outputText("  Your cocks seem to swell up, feeling heavier. You look down and watch them growing fatter as they thicken.");
                }
                if (this.tainted) this.dynStats("lib", 3, "sen", 5, "lus", 10, "cor", 3);
                else this.dynStats("lib", 3, "sen", 5, "lus", 10);
            }
            if (this.player.cocks.length == 0) {
                this.outputText("\n\n");
                this.mutations.growDemonCock(1);
                if (this.tainted) this.dynStats("lib", 3, "sen", 5, "lus", 10, "cor", 3);
                else this.dynStats("lib", 3, "sen", 5, "lus", 10);
            }
            // Shrink breasts a more
            // TIT CHANGE 50% chance of shrinkage
            if (IncubiDraft.rand(2) === 0 && !this.flags[kFLAGS.HYPER_HAPPY]) {
                this.player.shrinkTits();
            }
        }
        // High level change
        if (rando >= 93) {
            if (this.player.cockTotal() < 10) {
                if (IncubiDraft.rand(10) < int(this.player.cor / 25)) {
                    this.outputText("\n\n");
                    this.mutations.growDemonCock(IncubiDraft.rand(2) + 2);
                    if (this.tainted) this.dynStats("lib", 3, "sen", 5, "lus", 10, "cor", 5);
                    else this.dynStats("lib", 3, "sen", 5, "lus", 10);
                }
                else {
                    this.mutations.growDemonCock(1);
                }
                if (this.tainted) this.dynStats("lib", 3, "sen", 5, "lus", 10, "cor", 3);
                else this.dynStats("lib", 3, "sen", 5, "lus", 10);
            }
            if (!this.flags[kFLAGS.HYPER_HAPPY]) {
                this.player.shrinkTits();
                this.player.shrinkTits();
            }
        }
        // Neck restore
        if (this.player.neck.type !== Neck.NORMAL && this.changes < this.changeLimit && IncubiDraft.rand(4) === 0) {
            this.mutations.restoreNeck(tfSource);
        }
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && IncubiDraft.rand(5) === 0) {
            this.mutations.restoreRearBody(tfSource);
        }
        // Ovi perk loss
        if (IncubiDraft.rand(5) === 0) {
            this.mutations.updateOvipositionPerk(tfSource);
        }
        // Demonic changes - higher chance with higher corruption.
        if (IncubiDraft.rand(40) + this.player.cor / 3 > 35 && this.tainted) {
            this.mutations.demonChanges(tfSource);
        }
        if (IncubiDraft.rand(4) === 0 && this.tainted) this.outputText(this.player.modFem(5, 2));
        if (IncubiDraft.rand(4) === 0 && this.tainted) this.outputText(this.player.modThickness(30, 2));
        this.player.refillHunger(10);
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;

        return false;
    }
}
