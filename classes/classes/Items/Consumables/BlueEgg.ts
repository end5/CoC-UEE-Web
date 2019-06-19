import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";

/**
 * @since March 31, 2018
 * @author Stadler76
 */
export class BlueEgg extends Consumable {
    public static SMALL: number = 0;
    public static LARGE: number = 1;

    private large: boolean;

    public constructor(type: number) {
        let id: string;
        let shortName: string;
        let longName: string;
        let description: string;
        let value: number;

        switch (type) {
            case BlueEgg.SMALL:
                id = "BlueEgg";
                shortName = "BlueEgg";
                longName = "a blue and white mottled egg";
                description = "This is an oblong egg, not much different from a chicken egg in appearance (save for the color)."
                    + " Something tells you it's more than just food.";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            case BlueEgg.LARGE:
                id = "L.BluEg";
                shortName = "L.BluEg";
                longName = "a large blue and white mottled egg";
                description = "This is an oblong egg, not much different from an ostrich egg in appearance (save for the color)."
                    + " Something tells you it's more than just food.";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            default: // Remove this if someone manages to get SonarQQbe to not whine about a missing default ... ~Stadler76
                throw new Error("BlueEgg. Incorrect or no type was passed to constructor");
        }

        super(id, shortName, longName, value, description);
        this.large = type === BlueEgg.LARGE;
    }

    public useItem(): boolean {
        this.clearOutput();
        let temp: number; // kGAMECLASS.temp was a great idea ... *cough, cough* ~Stadler76
        let temp2: number = 0;
        let temp3: number = 0;
        this.outputText("You devour the egg, momentarily sating your hunger.");
        if (!this.large) {
            // Kill pussies!
            if (this.player.vaginas.length > 0) {
                this.outputText("\n\nYour vagina clenches in pain, doubling you over.  You slip a hand down to check on it, only to feel the slit growing smaller and smaller until it disappears, taking your clit with it! <b> Your vagina is gone!</b>");
                this.player.setClitLength(.5);
                this.player.removeVagina(0, 1);
            }
            // Dickz
            if (this.player.cocks.length > 0) {
                // Multiz
                if (this.player.cocks.length > 1) {
                    this.outputText("\n\nYour " + this.player.multiCockDescript() + " fill to full-size... and begin growing obscenely.");
                    temp = this.player.cocks.length;
                    while (temp > 0) {
                        temp--;
                        temp2 = this.player.increaseCock(temp, rand(3) + 2);
                        temp3 = this.player.cocks[temp].thickenCock(1);
                    }
                    this.player.lengthChange(temp2, this.player.cocks.length);
                    // Display the degree of thickness change.
                    if (temp3 >= 1) {
                        if (this.player.cocks.length == 1) this.outputText("\n\nYour " + this.player.multiCockDescriptLight() + " spreads rapidly, swelling an inch or more in girth, making it feel fat and floppy.");
                        else this.outputText("\n\nYour " + this.player.multiCockDescriptLight() + " spread rapidly, swelling as they grow an inch or more in girth, making them feel fat and floppy.");
                    }
                    if (temp3 <= .5) {
                        if (this.player.cocks.length > 1) this.outputText("\n\nYour " + this.player.multiCockDescriptLight() + " feel swollen and heavy. With a firm, but gentle, squeeze, you confirm your suspicions. They are definitely thicker.");
                        else this.outputText("\n\nYour " + this.player.multiCockDescriptLight() + " feels swollen and heavy. With a firm, but gentle, squeeze, you confirm your suspicions. It is definitely thicker.");
                    }
                    if (temp3 > .5 && temp2 < 1) {
                        if (this.player.cocks.length == 1) this.outputText("\n\nYour " + this.player.multiCockDescriptLight() + " seems to swell up, feeling heavier. You look down and watch it growing fatter as it thickens.");
                        if (this.player.cocks.length > 1) this.outputText("\n\nYour " + this.player.multiCockDescriptLight() + " seem to swell up, feeling heavier. You look down and watch them growing fatter as they thicken.");
                    }
                    this.dynStats("lib", 1, "sen", 1, "lus", 20);
                }
                // SINGLEZ
                if (this.player.cocks.length == 1) {
                    this.outputText("\n\nYour " + this.player.multiCockDescriptLight() + " fills to its normal size... and begins growing... ");
                    temp3 = this.player.cocks[0].thickenCock(1);
                    temp2 = this.player.increaseCock(0, rand(3) + 2);
                    this.player.lengthChange(temp2, 1);
                    // Display the degree of thickness change.
                    if (temp3 >= 1) {
                        if (this.player.cocks.length == 1) this.outputText("  Your " + this.player.multiCockDescriptLight() + " spreads rapidly, swelling an inch or more in girth, making it feel fat and floppy.");
                        else this.outputText("  Your " + this.player.multiCockDescriptLight() + " spread rapidly, swelling as they grow an inch or more in girth, making them feel fat and floppy.");
                    }
                    if (temp3 <= .5) {
                        if (this.player.cocks.length > 1) this.outputText("  Your " + this.player.multiCockDescriptLight() + " feel swollen and heavy. With a firm, but gentle, squeeze, you confirm your suspicions. They are definitely thicker.");
                        else this.outputText("  Your " + this.player.multiCockDescriptLight() + " feels swollen and heavy. With a firm, but gentle, squeeze, you confirm your suspicions. It is definitely thicker.");
                    }
                    if (temp3 > .5 && temp2 < 1) {
                        if (this.player.cocks.length == 1) this.outputText("  Your " + this.player.multiCockDescriptLight() + " seems to swell up, feeling heavier. You look down and watch it growing fatter as it thickens.");
                        if (this.player.cocks.length > 1) this.outputText("  Your " + this.player.multiCockDescriptLight() + " seem to swell up, feeling heavier. You look down and watch them growing fatter as they thicken.");
                    }
                    this.dynStats("lib", 1, "sen", 1, "lus", 20);
                }

            }
            this.player.refillHunger(20);
        }
        // LARGE
        else {
            // New lines if changes
            if (this.player.bRows() > 1 || this.player.butt.rating > 5 || this.player.hips.rating > 5 || this.player.hasVagina()) this.outputText("\n\n");
            // Kill pussies!
            if (this.player.vaginas.length > 0) {
                this.outputText("Your vagina clenches in pain, doubling you over.  You slip a hand down to check on it, only to feel the slit growing smaller and smaller until it disappears, taking your clit with it!\n\n");
                if (this.player.bRows() > 1 || this.player.butt.rating > 5 || this.player.hips.rating > 5) this.outputText("  ");
                this.player.setClitLength(.5);
                this.player.removeVagina(0, 1);
            }
            // Kill extra boobages
            if (this.player.bRows() > 1) {
                this.outputText("Your back relaxes as extra weight vanishes from your chest.  <b>Your lowest " + this.player.breastDescript(this.player.bRows() - 1) + " have vanished.</b>");
                if (this.player.butt.rating > 5 || this.player.hips.rating > 5) this.outputText("  ");
                // Remove lowest row.
                this.player.removeBreastRow((this.player.bRows() - 1), 1);
            }
            // Ass/hips shrinkage!
            if (this.player.butt.rating > 5) {
                this.outputText("Muscles firm and tone as you feel your " + this.player.buttDescript() + " become smaller and tighter.");
                if (this.player.hips.rating > 5) this.outputText("  ");
                this.player.butt.rating -= 2;
            }
            if (this.player.hips.rating > 5) {
                this.outputText("Feeling the sudden burning of lactic acid in your " + this.player.hipDescript() + ", you realize they have slimmed down and firmed up some.");
                this.player.hips.rating -= 2;
            }
            // Shrink tits!
            if (this.player.biggestTitSize() > 0) {
                this.player.shrinkTits();
            }
            if (this.player.cocks.length > 0) {
                // Multiz
                if (this.player.cocks.length > 1) {
                    this.outputText("\n\nYour " + this.player.multiCockDescript() + " fill to full-size... and begin growing obscenely.  ");
                    temp = this.player.cocks.length;
                    while (temp > 0) {
                        temp--;
                        temp2 = this.player.increaseCock(temp, rand(3) + 5);
                        temp3 = this.player.cocks[temp].thickenCock(1.5);
                    }
                    this.player.lengthChange(temp2, this.player.cocks.length);
                    // Display the degree of thickness change.
                    if (temp3 >= 1) {
                        if (this.player.cocks.length == 1) this.outputText("\n\nYour " + this.player.multiCockDescriptLight() + " spreads rapidly, swelling an inch or more in girth, making it feel fat and floppy.");
                        else this.outputText("\n\nYour " + this.player.multiCockDescriptLight() + " spread rapidly, swelling as they grow an inch or more in girth, making them feel fat and floppy.");
                    }
                    if (temp3 <= .5) {
                        if (this.player.cocks.length > 1) this.outputText("\n\nYour " + this.player.multiCockDescriptLight() + " feel swollen and heavy. With a firm, but gentle, squeeze, you confirm your suspicions. They are definitely thicker.");
                        else this.outputText("\n\nYour " + this.player.multiCockDescriptLight() + " feels swollen and heavy. With a firm, but gentle, squeeze, you confirm your suspicions. It is definitely thicker.");
                    }
                    if (temp3 > .5 && temp2 < 1) {
                        if (this.player.cocks.length == 1) this.outputText("\n\nYour " + this.player.multiCockDescriptLight() + " seems to swell up, feeling heavier. You look down and watch it growing fatter as it thickens.");
                        if (this.player.cocks.length > 1) this.outputText("\n\nYour " + this.player.multiCockDescriptLight() + " seem to swell up, feeling heavier. You look down and watch them growing fatter as they thicken.");
                    }
                    this.dynStats("lib", 1, "sen", 1, "lus", 20);
                }
                // SINGLEZ
                if (this.player.cocks.length == 1) {
                    this.outputText("\n\nYour " + this.player.multiCockDescriptLight() + " fills to its normal size... and begins growing...");
                    temp3 = this.player.cocks[0].thickenCock(1.5);
                    temp2 = this.player.increaseCock(0, rand(3) + 5);
                    this.player.lengthChange(temp2, 1);
                    // Display the degree of thickness change.
                    if (temp3 >= 1) {
                        if (this.player.cocks.length == 1) this.outputText("  Your " + this.player.multiCockDescriptLight() + " spreads rapidly, swelling an inch or more in girth, making it feel fat and floppy.");
                        else this.outputText("  Your " + this.player.multiCockDescriptLight() + " spread rapidly, swelling as they grow an inch or more in girth, making them feel fat and floppy.");
                    }
                    if (temp3 <= .5) {
                        if (this.player.cocks.length > 1) this.outputText("  Your " + this.player.multiCockDescriptLight() + " feel swollen and heavy. With a firm, but gentle, squeeze, you confirm your suspicions. They are definitely thicker.");
                        else this.outputText("  Your " + this.player.multiCockDescriptLight() + " feels swollen and heavy. With a firm, but gentle, squeeze, you confirm your suspicions. It is definitely thicker.");
                    }
                    if (temp3 > .5 && temp2 < 1) {
                        if (this.player.cocks.length == 1) this.outputText("  Your " + this.player.multiCockDescriptLight() + " seems to swell up, feeling heavier. You look down and watch it growing fatter as it thickens.");
                        if (this.player.cocks.length > 1) this.outputText("  Your " + this.player.multiCockDescriptLight() + " seem to swell up, feeling heavier. You look down and watch them growing fatter as they thicken.");
                    }
                    this.dynStats("lib", 1, "sen", 1, "lus", 20);
                }
            }
            this.player.refillHunger(60);
        }
        if (rand(3) === 0) {
            if (this.large) this.outputText(this.player.modFem(0, 8));
            else this.outputText(this.player.modFem(5, 3));
        }

        return false;
    }
}
