import { Weapon } from "../Weapon";

/**
 * Created by aimozg on 10.01.14.
 */

export class LargeClaymore extends Weapon {
    public constructor(tier: number, degrades: boolean = false) {
        const ids = ["Claymor", "Claymr1", "Claymr2", degrades ? "ClaymrO" : "Claymr3"];
        const eqptNames = ["large claymore", "fine claymore", "masterwork claymore", degrades ? "obsidian-lined claymore" : "epic claymore"];
        const longNames = ["a large claymore", "a fine claymore", "a masterwork claymore", degrades ? "an obsidian-bladed claymore" : "an epic claymore"];
        super(ids[tier], "L.Claymore", eqptNames[tier], longNames[tier], "cleaving sword-slash", 15, 1000, "A massive sword that a very strong warrior might use. Requires 40 strength to use.", Weapon.PERK_LARGE);
        this.weightCategory = Weapon.WEIGHT_HEAVY;
        this.tier = tier;
    }

    public canUse(): boolean {
        if (this.game.player.str >= 40) return true;
        this.outputText("You aren't strong enough to handle such a heavy weapon! ");
        return false;
    }

}
