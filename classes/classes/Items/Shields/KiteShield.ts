import { Shield } from "../Shield";

export class KiteShield extends Shield {
    public constructor(tier: number) {
        const ids = ["Kite Sh", "KiteSh1", "KiteSh2"];
        const eqptNames = ["kiteshield", "fine kiteshield", "masterwork kiteshield"];
        const longNames = ["a kiteshield", "a fine kiteshield", "a masterwork kiteshield"];
        super(ids[tier], "KiteShld", eqptNames[tier], longNames[tier], 10, 300, "A teardrop-shaped kiteshield made of durable wood.");
        this.weightCategory = Shield.WEIGHT_MEDIUM;
        this.tier = tier;
    }

}
