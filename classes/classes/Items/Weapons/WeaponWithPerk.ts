import { Weapon } from "../Weapon";
import { PerkType } from "../../PerkType";
import { PerkLib } from "../../PerkLib";

export class WeaponWithPerk extends Weapon {
    private playerPerk: PerkType;
    private playerPerkV1: number;
    private playerPerkV2: number;
    private playerPerkV3: number;
    private playerPerkV4: number;

    public constructor(id: string, shortName: string, name: string, longName: string, verb: string, attack: number, value: number, description: string, perk: string, playerPerk: PerkType, playerPerkV1: number, playerPerkV2: number, playerPerkV3: number, playerPerkV4: number, playerPerkDesc: string = "") {
        super(id, shortName, name, longName, verb, attack, value, description, perk);
        this.playerPerk = playerPerk;
        this.playerPerkV1 = playerPerkV1;
        this.playerPerkV2 = playerPerkV2;
        this.playerPerkV3 = playerPerkV3;
        this.playerPerkV4 = playerPerkV4;
    }

    public playerEquip(): Weapon { // This item is being equipped by the player. Add any perks, etc.
        while (this.game.player.findPerk(this.playerPerk) >= 0) this.game.player.removePerk(this.playerPerk);
        this.game.player.createPerk(this.playerPerk, this.playerPerkV1, this.playerPerkV2, this.playerPerkV3, this.playerPerkV4);
        return super.playerEquip();
    }

    public playerRemove() { // This item is being removed by the player. Remove any perks, etc.
        while (this.game.player.findPerk(this.playerPerk) >= 0) this.game.player.removePerk(this.playerPerk);
        return super.playerRemove();
    }

    public get description(): string {
        let desc: string = super.description;
        // Perk
        desc += "\nSpecial: " + this.playerPerk.name;
        if (this.playerPerk == PerkLib.WizardsFocus) desc += " (+" + this.playerPerkV1 * 100 + "% Spell Power)";
        else if (this.playerPerkV1 > 0) desc += " (Magnitude: " + this.playerPerkV1 + ")";
        return desc;
    }

}
