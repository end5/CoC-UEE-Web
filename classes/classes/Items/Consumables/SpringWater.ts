import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";

export class SpringWater extends Consumable {
    public constructor() {
        super("S.Water", "SpringWtr", "a waterskin filled with spring water", ConsumableLib.DEFAULT_VALUE, "A waterskin full of purified water from Minerva's spring.  It's clean and clear, with a faint sweet scent to it.  You're sure it would be a very refreshing drink.");
    }

    public useItem(): boolean {
        this.player.slimeFeed();
        this.clearOutput();
        this.outputText("The water is cool and sweet to the taste, and every swallow makes you feel calmer, cleaner, and refreshed.  You drink until your thirst is quenched, feeling purer in both mind and body. ");
        // -30 fatigue, -2 libido, -10 lust]
        this.player.changeFatigue(-10);
        this.dynStats("lus", -25, "cor", (-3 - rand(2)), "scale", false);
        this.player.HPChange(20 + (5 * this.player.level) + rand(5 * this.player.level), true);
        this.player.refillHunger(10);
        if (this.player.cor > 50) this.dynStats("cor", -1);
        if (this.player.cor > 75) this.dynStats("cor", -1);

        return false;
    }
}
