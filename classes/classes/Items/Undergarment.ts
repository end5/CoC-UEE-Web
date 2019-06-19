import { Useable } from "./Useable";
import { UndergarmentLib } from "./UndergarmentLib";

/**
 * @author Kitteh6660
 */
export class Undergarment extends Useable // Equipable
{
    private _type: number;
    private _perk: string;
    private _name: string;

    public constructor(id: string, shortName: string, name: string, longName: string, undergarmentType: number, value: number = 0, description?: string, perk: string = "") {
        super(id, shortName, longName, value, description);
        this._type = undergarmentType;
        this._name = name;
        this._perk = perk;
    }

    public get type(): number { return this._type; }

    public get perk(): string { return this._perk; }

    public get name(): string { return this._name; }

    public useText(): void {
        this.outputText("You equip " + this.longName + ".  ");
    }

    public get description(): string {
        let desc: string = this._description;
        let diff: number = 0;
        desc += "\n\nType: Undergarment ";
        if (type == 0) desc += "(Upper)";
        else if (type == 1) desc += "(Lower)";
        else if (type == 2) desc += "(Full)";
        // Defense
        if (type == UndergarmentLib.TYPE_LOWERWEAR) diff = this.armorDef - (this.game.player.lowerGarment.armorDef);
        else diff = this.armorDef - (this.game.player.upperGarment.armorDef);
        if (this.armorDef > 0 || diff != 0) desc += "\nDefense: " + String(this.armorDef);
        desc += this.appendStatsDifference(diff);
        // Sexiness
        if (type == UndergarmentLib.TYPE_LOWERWEAR) diff = this.sexiness - (this.game.player.lowerGarment.sexiness);
        else diff = this.sexiness - (this.game.player.upperGarment.sexiness);
        if (this.sexiness > 0 || diff != 0) desc += "\nSexiness: " + String(this.sexiness);
        desc += this.appendStatsDifference(diff);
        // Value
        desc += "\nBase value: " + String(this.value);
        // Naga wearable?
        if (type == 1 && this.perk == "NagaWearable" && this.game.player.isNaga()) desc += "\nNagas aren't restricted from wearing this type of lower undergarment.";
        return desc;
    }

    public get armorDef(): number {
        switch (this.name) {
            case "spider-silk bra":
            case "spider-silk loincloth":
            case "spider-silk panties":
                return 1;
            case "dragonscale bra":
            case "dragonscale loincloth":
            case "dragonscale thong":
                return 2;
            case "Ebonweave vest":
            case "Ebonweave corset":
            case "Ebonweave jockstrap":
            case "Ebonweave thong":
            case "Ebonweave loincloth":
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
            case "spider-silk bra":
            case "spider-silk loincloth":
            case "spider-silk panties":
            case "dragonscale bra":
            case "dragonscale loincloth":
            case "dragonscale thong":
                return 1;
            case "fundoshi":
            case "fur loincloth":
            case "Ebonweave vest":
            case "Ebonweave corset":
            case "Ebonweave jockstrap":
            case "Ebonweave thong":
            case "Ebonweave loincloth":
                return 2;
            case "latex bra":
            case "latex shorts":
            case "latex thong":
            case "stockings and garters":
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

    public playerEquip(): Undergarment { // This item is being equipped by the player. Add any perks, etc. - This function should only handle mechanics, not text output
        return this;
    }

    public playerRemove(): Undergarment | undefined { // This item is being removed by the player. Remove any perks, etc. - This function should only handle mechanics, not text output
        return this;
    }

    public removeText(): void { } // Produces any text seen when removing the undergarment normally

    public getMaxStackSize(): number {
        return 5;
    }

}
