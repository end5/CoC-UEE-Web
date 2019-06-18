import { Weapon } from "../Weapon";

export class Blunderbuss extends Weapon {
    public constructor(tier: number) {
        const ids = ["Blunder", "Blundr1", "Blundr2"];
        const eqptNames = ["blunderbuss", "fine blunderbuss", "masterwork blunderbuss"];
        const longNames = ["a blunderbuss", "a fine blunderbuss", "a masterwork blunderbuss"];
        super(ids[tier], "Blndrbss", eqptNames[tier], longNames[tier], "shot", 16, 600, "This is a blunderbuss, a two-handed gun. It's effective at short range but poor at long range. Reload is required after each shot. Speed has factor in damage rather than Strength.", Weapon.PERK_RANGED);
        this.weightCategory = Weapon.WEIGHT_MEDIUM;
        this.tier = tier;
    }

}
