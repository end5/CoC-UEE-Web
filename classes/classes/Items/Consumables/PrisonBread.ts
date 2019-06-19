import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";

export class PrisonBread extends Consumable {

    public constructor() {
        super("P.Bread", "P.Bread", "a stale loaf of prison bread", ConsumableLib.DEFAULT_VALUE, "An impossibly hard loaf of stale bread.  Despite its age, still quite nutritious.");
    }

    public canUse(): boolean {
        return true;
    }

    public useItem(): boolean {
        this.game.prison.prisonItemBread(false);
        return true;
    }

}
