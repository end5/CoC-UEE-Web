import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";

/**
 * Natural energy drink?
 */
export class IsabellaMilk extends Consumable {
    public constructor() {
        super("IzyMilk", "IzyMilk", "a bottle of Isabella's milk", ConsumableLib.DEFAULT_VALUE, "This is a bottle of Isabella's milk.  Isabella seems fairly certain it will invigorate you.");
    }

    public useItem(): boolean {
        this.player.slimeFeed();
        this.clearOutput();
        this.outputText("You swallow down the bottle of Isabella's milk.");
        if (this.player.fatigue > 0) this.outputText("  You feel much less tired! (-33 fatigue)");
        this.player.changeFatigue(-33);
        this.player.refillHunger(20);

        return false;
    }
}
