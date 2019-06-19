import { Jewelry } from "../Jewelry";

export class Nothing extends Jewelry {
    public constructor() {
        super("nojewel", "nojewel", "nothing", "nothing", 0, 0, 0, "no jewelry", "ring");
    }

    public playerRemove() {
        return undefined; // There is nothing!
    }
}
