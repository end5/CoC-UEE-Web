import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";

export class CumBread extends Consumable {

    public constructor() {
        super("C.Bread", "C.Bread", "a bowl of cum with bread pieces floating in it", ConsumableLib.DEFAULT_VALUE, "A bowl of cum with pieces of bread floating in it.  Eating this would take the edge off your hunger but damage your dignity.");
    }

    public canUse(): boolean {
        return true;
    }

    public useItem(): boolean {
        this.game.prison.prisonItemBread(true, true);
        return true;
    }

}
