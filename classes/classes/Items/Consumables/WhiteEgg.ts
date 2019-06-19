import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";

/**
 * @since March 31, 2018
 * @author Stadler76
 */
export class WhiteEgg extends Consumable {
    public static SMALL: number = 0;
    public static LARGE: number = 1;

    private large: boolean;

    public constructor(type: 0 | 1) {
        let id: string;
        let shortName: string;
        let longName: string;
        let description: string;
        let value: number;

        switch (type) {
            case WhiteEgg.SMALL:
                id = "WhiteEg";
                shortName = "WhiteEg";
                longName = "a milky-white egg";
                description = "This is an oblong egg, not much different from a chicken egg in appearance (save for the color)."
                    + " Something tells you it's more than just food.";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            case WhiteEgg.LARGE:
                id = "L.WhtEg";
                shortName = "L.WhtEg";
                longName = "a large white egg";
                description = "This is an oblong egg, not much different from an ostrich egg in appearance (save for the color)."
                    + " Something tells you it's more than just food.";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            default:
                throw new Error("White Egg initialized with incorrect value");
        }

        super(id, shortName, longName, value, description);
        this.large = type === WhiteEgg.LARGE;
    }

    public useItem(): boolean {
        this.clearOutput();
        let temp: number; // kGAMECLASS.temp was a great idea ... *cough, cough* ~Stadler76
        let temp2: number = 0;
        this.outputText("You devour the egg, momentarily sating your hunger.");
        if (!this.large) {
            // Grow nipples
            if (this.player.nippleLength < 3 && this.player.biggestTitSize() > 0) {
                this.outputText("\n\nYour nipples engorge, prodding hard against the inside of your [armor]."
                    + " Abruptly you realize they've gotten almost a quarter inch longer.");
                this.player.nippleLength += .2;
                this.dynStats("lus", 15);
            }
            this.player.refillHunger(20);
        }
        // LARGE
        else {
            // Grow nipples
            if (this.player.nippleLength < 3 && this.player.biggestTitSize() > 0) {
                this.outputText("\n\nYour nipples engorge, prodding hard against the inside of your [armor]."
                    + " Abruptly you realize they've grown more than an additional quarter-inch.");
                this.player.nippleLength += (WhiteEgg.rand(2) + 3) / 10;
                this.dynStats("lus", 15);
            }
            // NIPPLECUNTZZZ
            temp = this.player.breastRows.length;
            // Set nipplecunts on every row.
            while (temp > 0) {
                temp--;
                if (!this.player.breastRows[temp].fuckable && this.player.nippleLength >= 2) {
                    this.player.breastRows[temp].fuckable = true;
                    // Keep track of changes.
                    temp2++;
                }
            }
            // Talk about if anything was changed.
            if (temp2 > 0) {
                this.outputText("\n\nYour [allbreasts] tingle with warmth that slowly migrates to your nipples, filling them with warmth."
                    + " You pant and moan, rubbing them with your fingers."
                    + " A trickle of wetness suddenly coats your finger as it slips inside the nipple.  Shocked, you pull the finger free."
                    + " <b>You now have fuckable nipples!</b>");
            }
            this.player.refillHunger(60);
        }

        return false;
    }
}
