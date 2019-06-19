import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";

/**
 * Honey based alcoholic beverage.
 */
export class ProMead extends Consumable {
    public constructor() {
        super("ProMead", "ProMead", "a pint of premium god\'s mead", ConsumableLib.DEFAULT_VALUE, undefined);
    }

    public useItem(): boolean {
        this.clearOutput();
        this.outputText("You take a hearty swig of mead, savoring the honeyed taste on your tongue.  Emboldened by the first drink, you chug the remainder of the horn\'s contents in no time flat.  You wipe your lips, satisfied, and let off a small belch as you toss the empty horn aside.");
        this.dynStats("lib", 1, "cor", -1);
        this.outputText("\n\nYou feel suddenly invigorated by the potent beverage, like you could take on a whole horde of barbarians or giants and come out victorious!");
        this.player.HPChange(Math.round(this.player.maxHP()), false);
        this.dynStats("lus=", 20 + rand(6));
        if (rand(3) === 0) {
            this.outputText("\n\nThe alcohol fills your limbs with vigor, making you feel like you could take on the world with just your fists!");
            if (this.game.silly()) {
                this.outputText("  Maybe you should run around shirtless, drink, and fight!  Saxton Hale would be proud.");
            }
            this.dynStats("str", 1);
        }
        else {
            this.outputText("\n\nYou thump your chest and grin - your foes will have a harder time taking you down while you\'re fortified by liquid courage.");
            this.dynStats("tou", 1);
        }

        return false;
    }

    public getMaxStackSize(): number {
        return 5;
    }
}
