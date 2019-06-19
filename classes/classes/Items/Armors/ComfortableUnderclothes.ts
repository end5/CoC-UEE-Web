import { Armor } from "../Armor";

/**
 * Created by aimozg on 10.01.14.
 */

export class ComfortableUnderclothes extends Armor {

    public constructor() {
        super("c.under", "c.under", "comfortable underclothes", "comfortable underclothes", 0, 0, "comfortable underclothes", "Light");
    }

    public playerRemove() {
        return undefined; // Player never picks up their underclothes
    }
}
