import { Undergarment } from "../Undergarment";
import { PerkType } from "../../PerkType";
import { PerkLib } from "../../PerkLib";
import { UndergarmentLib } from "../UndergarmentLib";

// Ebonweave makin me code new shit -w- ~Foxwells

export class UndergarmentWithPerk extends Undergarment {
    private playerPerk: PerkType;
    private playerPerkV1: number;
    private playerPerkV2: number;
    private playerPerkV3: number;
    private playerPerkV4: number;

    public constructor(id: string, shortName: string, name: string, longName: string, undergarmentType: number, value: number, description: string, playerPerk: PerkType, playerPerkV1: number, playerPerkV2: number, playerPerkV3: number, playerPerkV4: number, playerPerkDesc: string = "", perk: string = "") {
        super(id, shortName, name, longName, undergarmentType, value, description, perk);
        this.playerPerk = playerPerk;
        this.playerPerkV1 = playerPerkV1;
        this.playerPerkV2 = playerPerkV2;
        this.playerPerkV3 = playerPerkV3;
        this.playerPerkV4 = playerPerkV4;
    }

    public useText(): void {
        this.outputText("You equip " + this.longName + ". ");
    }

    public playerEquip(): Undergarment { // This item is being equipped by the player. Add any perks, etc.
        while (this.game.player.findPerk(this.playerPerk) >= 0) this.game.player.removePerk(this.playerPerk);
        this.game.player.createPerk(this.playerPerk, this.playerPerkV1, this.playerPerkV2, this.playerPerkV3, this.playerPerkV4);
        return super.playerEquip();
    }

    public playerRemove() { // This item is being removed by the player. Remove any perks, etc.
        while (this.game.player.findPerk(this.playerPerk) >= 0) this.game.player.removePerk(this.playerPerk);
        return super.playerRemove();
    }

    public removeText(): void { } // Produces any text seen when removing the undergarment normally

    public get description(): string {
        let desc: string = super.description;
        // Perk
        desc += "\nSpecials: " + this.playerPerk.name;
        if (this.playerPerk == PerkLib.WizardsEndurance) desc += " (-" + this.playerPerkV1 + "% Spell Cost)";
        else if (this.playerPerk == PerkLib.WellspringOfLust) {
            if (this.game.player.lust < 50) {
                desc += " (+" + (50 - this.game.player.lust) + " lust)";
            }
        }
        else if (this.playerPerkV1 > 0) desc += " (Magnitude: " + this.playerPerkV1 + ")";
        return desc;
    }

    public get armorDef(): number {
        switch (this.name) {
            case "runed Ebonweave jockstrap":
            case "runed Ebonweave thong":
            case "runed Ebonweave loincloth":
                return 3;
            default:
                return 0;
        }
    }

    public get sexiness(): number {
        switch (this.name) {
            case "runed Ebonweave jockstrap":
            case "runed Ebonweave thong":
            case "runed Ebonweave loincloth":
                return 3;
            default:
                return 0;
        }
    }

    public canUse(): boolean {
        if (!this.game.player.armor.supportsUndergarment) {
            this.outputText("It would be awkward to put on undergarments when you're currently wearing your type of clothing. You should consider switching to different clothes. You put it back into your inventory.");
            return false;
        }
        if (type == UndergarmentLib.TYPE_LOWERWEAR) {
            if (this.game.player.isBiped() || this.game.player.isGoo()) {
                return true; // It doesn't matter what leg type you have as long as you're biped.
            }
            else if (this.game.player.isTaur() || this.game.player.isDrider()) {
                this.outputText("Your form makes it impossible to put on any form of lower undergarments. You put it back into your inventory.");
                return false;
            }
            else if (this.game.player.isNaga()) {
                if (this.perk != "NagaWearable") {
                    this.outputText("It's impossible to put on this undergarment as it's designed for someone with two legs. You put it back into your inventory.");
                    return false;
                }
                else return true;
            }
        }
        return true;
    }

}
