import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";

/**
 * @since March 31, 2018
 * @author Stadler76
 */
export class PinkEgg extends Consumable {
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
            case PinkEgg.SMALL:
                id = "PinkEgg";
                shortName = "PinkEgg";
                longName = "a pink and white mottled egg";
                description = "This is an oblong egg, not much different from a chicken egg in appearance (save for the color)."
                    + " Something tells you it's more than just food.";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            case PinkEgg.LARGE:
                id = "L.PnkEg";
                shortName = "L.PnkEg";
                longName = "a large pink and white mottled egg";
                description = "This is an oblong egg, not much different from an ostrich egg in appearance (save for the color)."
                    + " Something tells you it's more than just food.";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            default: // Remove this if someone manages to get SonarQQbe to not whine about a missing default ... ~Stadler76
                throw new Error("Pink Egg. Incorrect or no type was passed to constructor");
        }

        super(id, shortName, longName, value, description);
        this.large = type === PinkEgg.LARGE;
    }

    public useItem(): boolean {
        this.clearOutput();
        this.outputText("You devour the egg, momentarily sating your hunger.\n\n");
        if (!this.large) {
            // Remove a dick
            if (this.player.cocks.length > 0) {
                this.player.killCocks(1);
                this.outputText("\n\n");
            }
            // remove balls
            if (this.player.balls > 0) {
                if (this.player.ballSize > 15) {
                    this.player.ballSize -= 8;
                    this.outputText("Your scrotum slowly shrinks, settling down at a MUCH smaller size.  <b>Your " + this.player.ballsDescriptLight() + " are much smaller.</b>\n\n");
                }
                else {
                    this.player.balls = 0;
                    this.player.ballSize = 1;
                    this.outputText("Your scrotum slowly shrinks, eventually disappearing entirely!  <b>You've lost your balls!</b>\n\n");
                }
            }
            // Fertility boost
            if (this.player.vaginas.length > 0 && this.player.fertility < 40) {
                this.outputText("You feel a tingle deep inside your body, just above your " + this.player.vaginaDescript(0) + ", as if you were becoming more fertile.\n\n");
                this.player.fertility += 5;
            }
            this.player.refillHunger(20);
        }
        // LARGE
        else {
            // Remove a dick
            if (this.player.cocks.length > 0) {
                this.player.killCocks(-1);
                this.outputText("\n\n");
            }
            if (this.player.balls > 0) {
                this.player.balls = 0;
                this.player.ballSize = 1;
                this.outputText("Your scrotum slowly shrinks, eventually disappearing entirely!  <b>You've lost your balls!</b>\n\n");
            }
            // Fertility boost
            if (this.player.vaginas.length > 0 && this.player.fertility < 70) {
                this.outputText("You feel a powerful tingle deep inside your body, just above your " + this.player.vaginaDescript(0) + ". Instinctively you know you have become more fertile.\n\n");
                this.player.fertility += 10;
            }
            this.player.refillHunger(60);
        }
        if (rand(3) === 0) {
            if (this.large) this.outputText(this.player.modFem(100, 8));
            else this.outputText(this.player.modFem(95, 3));
        }

        return false;
    }
}
