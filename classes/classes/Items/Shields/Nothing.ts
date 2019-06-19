import { Shield } from "../Shield";

export class Nothing extends Shield {
    public constructor() {
        super("noshild", "noshield", "nothing", "nothing", 0, 0, "no shield", "shield");
        this.weightCategory = Shield.WEIGHT_LIGHT;
    }

    public playerRemove() {
        return undefined; // There is nothing!
    }
}
