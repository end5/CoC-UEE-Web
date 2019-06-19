import { Undergarment } from "../Undergarment";

export class Nothing extends Undergarment {
    public constructor() {
        super("nounder", "nounder", "nothing", "nothing", -1, 0, "nothing", "light");
    }

    public playerRemove() {
        return undefined; // Player never picks up their underclothes
    }
}
