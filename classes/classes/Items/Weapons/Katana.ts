import { Weapon } from "../Weapon";

export class Katana extends Weapon {
    public constructor(tier: number, degrades: boolean = false) {
        const ids = ["Katana ", "Katana1", "Katana2", degrades ? "KatanaO" : "Katana3"];
        const eqptNames = ["katana", "fine katana", "masterwork katana", degrades ? "obsidian-lined katana" : "epic katana"];
        const longNames = ["a katana", "a fine katana", "a masterwork katana", degrades ? "an obsidian-lined katana" : "an epic katana"];
        super(ids[tier], "Katana", eqptNames[tier], longNames[tier], "keen cut", 10, 500, "A curved bladed weapon that cuts through flesh with the greatest of ease.", "");
        this.weightCategory = Weapon.WEIGHT_MEDIUM;
        this.tier = tier;
    }

}
