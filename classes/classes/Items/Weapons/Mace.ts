import { Weapon } from "../Weapon";

export class Mace extends Weapon {
    public constructor(tier: number, degrades: boolean = false) {
        const ids = ["Mace   ", "Mace  1", "Mace  2", degrades ? "Mace  O" : "Mace  3"];
        const eqptNames = ["mace", "fine mace", "masterwork mace", degrades ? "obsidian-spiked mace" : "epic mace"];
        const longNames = ["a mace", "a fine mace", "a masterwork mace", degrades ? "a mace spiked with obsidian" : "an epic mace"];
        super(ids[tier], "Mace", eqptNames[tier], longNames[tier], "smash", 9, 100, "This is a mace, designed to be able to crush against various defenses.", "");
        this.weightCategory = Weapon.WEIGHT_MEDIUM;
        this.tier = tier;
    }

}
