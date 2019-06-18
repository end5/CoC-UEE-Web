import { Weapon } from "../Weapon";

export class Crossbow extends Weapon {
    public constructor(tier: number) {
        const ids = ["Crossbw", "Crsbow1", "Crsbow2"];
        const eqptNames = ["crossbow", "fine crossbow", "masterwork crossbow"];
        const longNames = ["a crossbow", "a fine crossbow", "a masterwork crossbow"];
        super(ids[tier], "Crossbow", eqptNames[tier], longNames[tier], "shot", 11, 200, "This weapon fires bolts at your enemies with the pull of a lever. Speed has factor in damage rather than Strength.", Weapon.PERK_RANGED);
        this.weightCategory = Weapon.WEIGHT_MEDIUM;
        this.tier = tier;
    }

}
