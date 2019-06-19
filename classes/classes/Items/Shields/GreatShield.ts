import { Shield } from "../Shield";

export class GreatShield extends Shield {
    public constructor(tier: number) {
        const ids = ["GreatSh", "GrtShl1", "GrtShl2"];
        const eqptNames = ["greatshield", "fine greatshield", "masterwork greatshield"];
        const longNames = ["a greatshield", "a fine greatshield", "a masterwork greatshield"];
        super(ids[tier], "GreatShld", eqptNames[tier], longNames[tier], 10, 300, "A large, rectangular metal shield. It's a bit heavy.");
        this.weightCategory = Shield.WEIGHT_MEDIUM;
        this.tier = tier;
    }

}
