import { Weapon } from "../Weapon";

export class Scimitar extends Weapon {
    public constructor(tier: number, degrades: boolean = false) {
        const ids = ["Scimitr", "Scimtr1", "Scimtr2", degrades ? "ScimtrO" : "Scimitr3"];
        const eqptNames = ["scimitar", "fine scimitar", "masterwork scimitar", degrades ? "obsidian-bladed scimitar" : "epic scimitar"];
        const longNames = ["a scimitar", "a fine scimitar", "a masterwork scimitar", degrades ? "a scimitar lined with obsidian" : "an epic scimitar"];
        super(ids[tier], "Scimitar", eqptNames[tier], longNames[tier], "slash", 13, 500, "A vicious curved sword made for slashing. No doubt it'll easily cut through flesh.", "");
        this.weightCategory = Weapon.WEIGHT_MEDIUM;
        this.tier = tier;
    }

}
