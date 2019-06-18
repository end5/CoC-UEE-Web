import { Weapon } from "../Weapon";
import { PerkLib } from "../../PerkLib";

export class SpikedGauntlet extends Weapon {
    public constructor(tier: number, degrades: boolean = false) {
        const ids = ["S.Gaunt", "S.Gaun1", "S.Gaun2", degrades ? "S.GaunO" : "S.Gaun3"];
        const eqptNames = ["spiked gauntlet", "fine spiked gauntlet", "masterwork spiked gauntlet", degrades ? "obsidian-spiked gauntlet" : "epic spiked gauntlet"];
        const longNames = ["a spiked gauntlet", "a fine spiked gauntlet", "a masterwork spiked gauntlet", degrades ? "an obsidian-spiked gauntlet" : "an epic spiked gauntlet"];
        super(ids[tier], "S.Gaunt", eqptNames[tier], longNames[tier], "spiked punch", 5, 300, "This single metal gauntlet has the knuckles tipped with metal spikes. Though it lacks the damaging potential of other weapons, the sheer pain of its wounds has a chance of stunning your opponent.", "");
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
