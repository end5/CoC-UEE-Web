import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

/**
 * Spider eyes transformative item
 */
export class OculumArachnae extends Consumable {
    public constructor() {
        super(
            "Oculum",
            "Oculum A.",
            "a jar of Oculum Arachnae",
            ConsumableLib.DEFAULT_VALUE,
            "This is a small glass jar containing a viscous light-orange fluid with a small label that reads, \"<i>Oculum Arachnae</i>\"." +
            " It is likely this potion is tied to arachnids in some way."
        );
    }

    public useItem(): boolean {
        this.mutations.initTransformation([3]);
        this.player.slimeFeed();
        this.clearOutput();
        this.outputText("You eat the fluid and lick the rest from your fingers. It tastes a bit like roasted cheese with blueberry marmalade.");
        if (this.changeLimit > 0 && rand(3) === 0 && this.player.eyes.count < 4) {
            this.outputText("\n\nYou suddenly get the strangest case of double vision; you stumble and blink around, clutching your face,"
                + " but you draw your hands back when you poke yourself in the eye. Wait, those fingers were on your forehead!"
                + " You tentatively run your fingertips across your forehead, not quite believing what you felt."
                + " <b>There's now a pair of eyes on your forehead, positioned just above your normal ones!</b>"
                + " This will take some getting used to!");
            this.player.eyes.count = 4;
            this.game.flags[kFLAGS.TIMES_TRANSFORMED]++;
            return false;
        }
        // If we got here, then no changes happened
        this.outputText("\n\nThe cheesy sweetness energizes you, leaving you feeling refreshed.");
        this.player.changeFatigue(-33);
        return false;
    }
}
