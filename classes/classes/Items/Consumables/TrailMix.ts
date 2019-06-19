import { Consumable } from "../Consumable";

/**
 * Nuts for berries.
 */
export class TrailMix extends Consumable {
    private static ITEM_VALUE: number = 20;
    public constructor() {
        super("TrailMx", "Trail Mix", "a pack of trail mix", TrailMix.ITEM_VALUE, "This mix of nuts, dried fruits and berries is lightweight, easy to store and very nutritious.");
    }

    public useItem(): boolean {
        this.outputText("You eat the trail mix. You got energy boost from it!");
        this.player.refillHunger(30);
        this.player.changeFatigue(-20);
        this.player.HPChange(Math.round(this.player.maxHP() * 0.1), true);

        return false;
    }
}
