import { Consumable } from "../Consumable";

/**
 * Polly wants a cracker?
 */
export class HardBiscuits extends Consumable {
    private static ITEM_VALUE: number = 5;

    public constructor() {
        super("H.Bisct", "H.Biscuits", "a pack of hard biscuits", HardBiscuits.ITEM_VALUE, "These biscuits are tasteless, but they can stay edible for an exceedingly long time.");
    }

    public useItem(): boolean {
        this.outputText("You eat the flavorless biscuits. It satisfies your hunger a bit, but not much else.");
        this.player.refillHunger(15);

        return false;
    }
}
