import { Weapon } from "../Weapon";
import { PerkLib } from "../../PerkLib";

export class HookedGauntlet extends Weapon {
    public constructor(tier: number, degrades: boolean = false) {
        const ids = ["H.Gaunt", "H.Gaun1", "H.Gaun2", degrades ? "H.GaunO" : "H.Gaun3"];
        const eqptNames = ["hooked gauntlets", "fine hooked gauntlets", "masterwork hooked gauntlets", degrades ? "obsidian-hooked gauntlets" : "epic hooked gauntlets"];
        const longNames = ["a set of hooked gauntlets", "a set of fine hooked gauntlets", "a set of masterwork gauntlets", degrades ? "a set of obsidian-hooked gauntlets" : "a set of epic hooked gauntlets"];
        super(ids[tier], "H.Gaunt", eqptNames[tier], longNames[tier], "clawing punch", 8, 400, "These metal gauntlets are fitted with bone spikes and hooks shaped like shark teeth that are sure to tear at your foes flesh and cause them harm.", "");
        this.weightCategory = Weapon.WEIGHT_LIGHT;
        this.tier = tier;
    }

    public get attack(): number {
        let amt: number = this._attack + (this._tier * 2);
        if (this.game.player.hasPerk(PerkLib.IronFists)) amt += 2;
        if (this.game.player.hasPerk(PerkLib.IronFists2)) amt += 1;
        if (this.game.player.hasPerk(PerkLib.IronFists3)) amt += 1;
        return amt;
    }

}
