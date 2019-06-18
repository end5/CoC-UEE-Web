import { Weapon } from "../Weapon";

export class Halberd extends Weapon {

    public constructor(tier: number, degrades: boolean = false) {
        const ids = ["Halberd", "Halbrd1", "Halbrd2", degrades ? "HalbrdO" : "Halbrd3"];
        const eqptNames = ["halberd", "fine halberd", "masterwork halberd", degrades ? "obsidian-bladed halberd" : "epic halberd"];
        const longNames = ["a halberd", "a fine halberd", "a masterwork halberd", degrades ? "an obsidian-bladed halberd" : "an epic halberd"];
        super(ids[tier], "Halberd", eqptNames[tier], longNames[tier], "slash", 11, 750, "Resembling a spear with a blade at the end, it's a long-reach melee weapon that can hit from a reasonable distance.", Weapon.PERK_LARGE);
        this.weightCategory = Weapon.WEIGHT_HEAVY;
        this.tier = tier;
    }

}
