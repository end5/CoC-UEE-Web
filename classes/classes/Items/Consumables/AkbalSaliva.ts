import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";

export class AkbalSaliva extends Consumable {
    public constructor() {
        super("AkbalSl", "AkbalSlv", "a vial of Akbal's saliva", ConsumableLib.DEFAULT_VALUE, "This corked vial of Akbal's saliva is said to contain healing properties. ");
    }

    public useItem(): boolean {
        this.outputText("You uncork the vial and chug down the saliva.  ");
        this.player.HPChange((this.player.maxHP() / 4), true);
        this.player.refillHunger(5);

        return false;
    }

    public getMaxStackSize(): number {
        return 5;
    }
}
