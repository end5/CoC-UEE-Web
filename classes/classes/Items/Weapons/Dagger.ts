import { Weapon } from "../Weapon";

export class Dagger extends Weapon {
    public constructor(tier: number, degrades: boolean = false) {
        const ids = ["Dagger ", "Dagger1", "Dagger2", degrades ? "DaggerO" : "Dagger3"];
        const eqptNames = ["dagger", "fine dagger", "masterwork dagger", degrades ? "obsidian dagger" : "epic dagger"];
        const longNames = ["a short dagger", "a fine dagger", "a masterwork dagger", degrades ? "an obsidian-bladed dagger" : "an epic dagger"];
        super(ids[tier], "Dagger", eqptNames[tier], longNames[tier], "stab", 3, 150, "A small blade easily held in one hand. Lightweight and easy to conceal, it's the preferred weapon among the stealthy type. Has increased critical chance.", "");
        this.weightCategory = Weapon.WEIGHT_LIGHT;
        this.tier = tier;
    }

}
