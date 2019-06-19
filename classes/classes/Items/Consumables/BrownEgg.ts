import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";

/**
 * @since March 31, 2018
 * @author Stadler76
 */
export class BrownEgg extends Consumable {
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
            case BrownEgg.SMALL:
                id = "BrownEg";
                shortName = "BrownEg";
                longName = "a brown and white mottled egg";
                description = "This is an oblong egg, not much different from a chicken egg in appearance (save for the color)."
                    + " Something tells you it's more than just food.";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            case BrownEgg.LARGE:
                id = "L.BrnEg";
                shortName = "L.BrnEg";
                longName = "a large brown and white mottled egg";
                description = "This is an oblong egg, not much different from an ostrich egg in appearance (save for the color)."
                    + " Something tells you it's more than just food.";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            default: // Remove this if someone manages to get SonarQQbe to not whine about a missing default ... ~Stadler76
                throw new Error("BrownEgg. Incorrect or no type was passed to constructor");
        }

        super(id, shortName, longName, value, description);
        this.large = type === BrownEgg.LARGE;
    }

    public useItem(): boolean {
        this.clearOutput();
        this.outputText("You devour the egg, momentarily sating your hunger.\n\n");
        if (!this.large) {
            this.outputText("You feel a bit of additional weight on your backside as your [butt] gains a bit more padding.");
            this.player.butt.rating++;
            this.player.refillHunger(20);
        } else {
            this.outputText("Your [butt] wobbles, nearly throwing you off balance as it grows much bigger!");
            this.player.butt.rating += 2 + rand(3);
            this.player.refillHunger(60);
        }
        if (rand(3) === 0) {
            if (this.large)
                this.outputText(this.player.modThickness(100, 8));
            else
                this.outputText(this.player.modThickness(95, 3));
        }

        return false;
    }
}
