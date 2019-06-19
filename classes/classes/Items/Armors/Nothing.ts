import { Armor } from "../Armor";

export class Nothing extends Armor {

    public constructor() {
        super("nothing", "nothing", "nothing", "nothing", 0, 0, "nothing", "Light");
    }

    public playerRemove() {
        return undefined; // Player never picks up their underclothes
    }
}
