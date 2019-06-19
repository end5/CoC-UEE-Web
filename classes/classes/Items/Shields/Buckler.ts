import { Shield } from "../Shield";

export class Buckler extends Shield {
    public constructor(tier: number) {
        const ids = ["Buckler", "Bucklr1", "Bucklr2"];
        const eqptNames = ["wooden buckler", "fine buckler", "masterwork buckler"];
        const longNames = ["a wooden buckler", "a fine, reinforced buckler", "a masterwork, metal buckler"];
        super(ids[tier], "Buckler", eqptNames[tier], longNames[tier], 6, 50, "A small, " + (tier < 2 ? tier == 1 ? "reinforced, wooden" : "wooden" : "metal") + " rounded shield that's light and easy to hold. Doesn't offer much protection but it's better than nothing.");
        this.weightCategory = Shield.WEIGHT_LIGHT;
        this.tier = tier;
    }

}
