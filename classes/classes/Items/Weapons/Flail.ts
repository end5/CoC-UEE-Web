import { Weapon } from "../Weapon";

export class Flail extends Weapon {
    public constructor(tier: number, degrades: boolean = false) {
        const ids = ["Flail  ", "Flail 1", "Flail 2", degrades ? "Flail O" : "Flail 3"];
        const eqptNames = ["flail", "fine flail", "masterwork flail", degrades ? "obsidian-spiked flail" : "epic flail"];
        const longNames = ["a flail", "a fine flail", "a masterwork flail", degrades ? "a flail spiked with obsidian tips" : "an epic flail"];
        super(ids[tier], "Flail", eqptNames[tier], longNames[tier], "smash", 10, 200, "This is a flail, a weapon consisting of a metal spiked ball attached to a stick by chain. Be careful with this as you might end up injuring yourself if you don't pay attention to the spiked ball.", "");
        this.weightCategory = Weapon.WEIGHT_MEDIUM;
        this.tier = tier;
    }

}
