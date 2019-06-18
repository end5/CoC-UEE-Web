import { Weapon } from "../Weapon";

export class Spear extends Weapon {
    public constructor(tier: number, degrades: boolean = false) {
        const ids = ["Spear  ", "Spear 1", "Spear 2", degrades ? "Spear O" : "Spear 3"];
        const eqptNames = ["deadly spear", "fine spear", "masterwork spear", degrades ? "obsidian-tipped spear" : "epic spear"];
        const longNames = ["a deadly spear", "a fine, deadlier spear", "a masterwork, even deadlier spear", degrades ? "an obsidian-tipped spear" : "an epic, deadliest spear"];
        super(ids[tier], "Spear", eqptNames[tier], longNames[tier], "piercing stab", 8, 450, "A staff with a sharp blade at the tip designed to pierce through the toughest armor. This would ignore most armors.", "");
        this.weightCategory = Weapon.WEIGHT_MEDIUM;
        this.tier = tier;
    }

}
