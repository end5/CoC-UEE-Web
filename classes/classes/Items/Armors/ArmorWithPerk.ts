import { Armor } from "../Armor";
import { PerkType } from "../../PerkType";
import { PerkLib } from "../../PerkLib";

/**
 * Created by aimozg on 18.01.14.
 */

export class ArmorWithPerk extends Armor {
    private playerPerk: PerkType;
    private playerPerkV1: number;
    private playerPerkV2: number;
    private playerPerkV3: number;
    private playerPerkV4: number;
    private playerPerk2: PerkType | undefined;
    private playerPerk2V1: number;
    private playerPerk2V2: number;
    private playerPerk2V3: number;
    private playerPerk2V4: number;

    public constructor(id: string, shortName: string, name: string, longName: string, def: number, value: number, description: string, perk: string, playerPerk: PerkType, playerPerkV1: number, playerPerkV2: number, playerPerkV3: number, playerPerkV4: number, playerPerkDesc: string = "", playerPerk2?: PerkType, playerPerk2V1: number = 0, playerPerk2V2: number = 0, playerPerk2V3: number = 0, playerPerk2V4: number = 0, playerPerk2Desc: string = "", supportsBulge: boolean = false, supportsUndergarment: boolean = true) {
        super(id, shortName, name, longName, def, value, description, perk, supportsBulge, supportsUndergarment);
        this.playerPerk = playerPerk;
        this.playerPerkV1 = playerPerkV1;
        this.playerPerkV2 = playerPerkV2;
        this.playerPerkV3 = playerPerkV3;
        this.playerPerkV4 = playerPerkV4;
        this.playerPerk2 = playerPerk2;
        this.playerPerk2V1 = playerPerk2V1;
        this.playerPerk2V2 = playerPerk2V2;
        this.playerPerk2V3 = playerPerk2V3;
        this.playerPerk2V4 = playerPerk2V4;
    }

    public playerEquip(): Armor { // This item is being equipped by the player. Add any perks, etc.
        while (this.game.player.findPerk(this.playerPerk) >= 0) this.game.player.removePerk(this.playerPerk);
        this.game.player.createPerk(this.playerPerk, this.playerPerkV1, this.playerPerkV2, this.playerPerkV3, this.playerPerkV4);
        if (this.playerPerk2 != undefined && this.game.player.findPerk(this.playerPerk2) >= 0) this.game.player.removePerk(this.playerPerk2);
        if (this.playerPerk2 != undefined) this.game.player.createPerk(this.playerPerk2, this.playerPerk2V1, this.playerPerk2V2, this.playerPerk2V3, this.playerPerk2V4);
        return super.playerEquip();
    }

    public playerRemove(): Armor | undefined { // This item is being removed by the player. Remove any perks, etc.
        while (this.game.player.findPerk(this.playerPerk) >= 0) this.game.player.removePerk(this.playerPerk);
        if (this.playerPerk2 != undefined && this.game.player.findPerk(this.playerPerk2) >= 0) this.game.player.removePerk(this.playerPerk2);
        return super.playerRemove();
    }

    public get description(): string {
        let desc: string = super.description;
        // Perk
        desc += "\nSpecials: " + this.playerPerk.name;
        if (this.playerPerk == PerkLib.WizardsEndurance) desc += " (-" + this.playerPerkV1 + "% Spell Cost)";
        else if (this.playerPerkV1 > 0) desc += " (Magnitude: " + this.playerPerkV1 + ")";
        // Second perk
        if (this.playerPerk2 != undefined) {
            desc += "\n" + this.playerPerk2.name;
            if (this.playerPerk2 == PerkLib.WizardsEndurance) desc += " (-" + this.playerPerk2V1 + "% Spell Cost)";
            else if (this.playerPerk2V1 > 0) desc += " (Magnitude: " + this.playerPerk2V1 + ")";
        }
        return desc;
    }

    /*
            public  equipEffect(player:Player, output: boolean): void
            {
                if (player.findPerk(playerPerk) < 0)
                    player.createPerk(playerPerk,playerPerkV1,playerPerkV2,playerPerkV3,playerPerkV4);
            }

            public  unequipEffect(player:Player, output: boolean): void
            {
                while(player.findPerk(playerPerk) >= 0) player.removePerk(playerPerk);
            }
    */
}
