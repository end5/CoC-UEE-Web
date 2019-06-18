import { Weapon } from "../Weapon";

/**
 * Created by aimozg on 10.01.14.
 */

export class LargeHammer extends Weapon {
    public constructor(tier: number, degrades: boolean = false) {
        const ids = ["L.Hammr", "L.Hamr1", "L.Hamr2", degrades ? "L.HamrO" : "L.Hamr3"];
        const eqptNames = ["large hammer", "fine large hammer", "masterwork large hammer", degrades ? "obsidian-spiked large hammer" : "epic large hammer"];
        const longNames = ["Marble's large hammer", "a fine, large hammer", "a masterwork, large hammer", degrades ? "an obsidian-spiked large hammer" : "an epic, large hammer"];
        super(ids[tier], "L.Hammer", eqptNames[tier], longNames[tier], "smash", 16, 90, "This two-handed warhammer looks pretty devastating. You took it from Marble after she refused your advances.", Weapon.PERK_LARGE);
        this.weightCategory = Weapon.WEIGHT_HEAVY;
        this.tier = tier;
    }

    public canUse(): boolean {
        if (this.game.player.tallness >= 60) return true;
        this.outputText("This hammer is too large for you to wield effectively. ");
        return false;
    }

}
