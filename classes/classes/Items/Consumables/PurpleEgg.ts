import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";

/**
 * @since March 31, 2018
 * @author Stadler76
 */
export class PurpleEgg extends Consumable {
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
            case PurpleEgg.SMALL:
                id = "PurplEg";
                shortName = "PurplEg";
                longName = "a purple and white mottled egg";
                description = "This is an oblong egg, not much different from a chicken egg in appearance (save for the color)."
                    + " Something tells you it's more than just food.";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            case PurpleEgg.LARGE:
                id = "L.PrpEg";
                shortName = "L.PrpEg";
                longName = "a large purple and white mottled egg";
                description = "This is an oblong egg, not much different from an ostrich egg in appearance (save for the color)."
                    + " Something tells you it's more than just food.";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            default: // Remove this if someone manages to get SonarQQbe to not whine about a missing default ... ~Stadler76
                throw new Error('Purple Egg. Incorrect or no type was passed to constructor');
        }

        super(id, shortName, longName, value, description);
        this.large = type === PurpleEgg.LARGE;
    }

    public useItem(): boolean {
        this.clearOutput();
        this.outputText("You devour the egg, momentarily sating your hunger.\n\n");
        if (!this.large || this.player.hips.rating > 20) {
            this.outputText("You stumble as you feel your [hips] widen, altering your gait slightly.");
            this.player.hips.rating++;
            this.player.refillHunger(20);
        } else {
            this.outputText("You stagger wildly as your hips spread apart, widening by inches."
                + " When the transformation finishes you feel as if you have to learn to walk all over again.");
            this.player.hips.rating += 2 + PurpleEgg.rand(2);
            this.player.refillHunger(60);
        }
        if (PurpleEgg.rand(3) === 0) {
            if (this.large)
                this.outputText(this.player.modThickness(80, 8));
            else
                this.outputText(this.player.modThickness(80, 3));
        }

        return false;
    }
}
