import { Useable } from "./Useable";
import { UndergarmentLib } from "./UndergarmentLib";
import { PerkLib } from "../PerkLib";

/**
 * Created by aimozg on 10.01.14.
 */

export class Armor extends Useable // Equipable
{
    public static WEIGHT_LIGHT: string = "Light";
    public static WEIGHT_MEDIUM: string = "Medium";
    public static WEIGHT_HEAVY: string = "Heavy";

    private _def: number;
    private _perk: string;
    protected _name: string;
    private _supportsBulge: boolean;
    private _supportsUndergarment: boolean;
    private _tier: number = 0; // Defaults to 0.

    public constructor(id: string, shortName: string, name: string, longName: string, def: number, value: number = 0, description?: string, perk: string = "", supportsBulge: boolean = false, supportsUndergarment: boolean = true) {
        super(id, shortName, longName, value, description);
        this._name = name;
        this._def = def;
        this._perk = perk;
        this._supportsBulge = supportsBulge;
        this._supportsUndergarment = supportsUndergarment;
    }

    public get def(): number { return this._def + this._tier; }

    public get perk(): string { return this._perk; }

    public get name(): string { return this._name; }

    public get supportsBulge(): boolean { return this._supportsBulge && this.game.player.modArmorName == ""; }
    // For most clothes if the modArmorName is set then it's Exgartuan's doing. The comfortable clothes are the exception, they override this function.

    public get supportsUndergarment(): boolean { return this._supportsUndergarment; }

    public get description(): string {
        let desc: string = this._description;
        switch (this._tier) {
            case 1:
                desc += " This armour has been upgraded to be of fine quality.";
                break;
            case 2:
                desc += " This armour has been upgraded to be of masterwork quality.";
                break;
            default:
                desc += "";
        }
        // Type
        desc += "\n\nType: ";
        if (this.perk == "Light" || this.perk == "Medium" || this.perk == "Heavy") {
            desc += "Armor (" + this.perk + ")";
        } else if (this.perk == "Adornment") desc += "Adornment ";
        else desc += "Clothing ";
        // Defense
        desc += "\nDefense: " + String(this.def);
        desc += this.appendStatsDifference(this.def - (this.game.player.armor.def));
        // Value
        desc += "\nBase value: " + String(this.value);
        return desc;
    }

    public canUse(): boolean {
        if (this.supportsUndergarment == false && (this.game.player.upperGarment != UndergarmentLib.NOTHING || this.game.player.lowerGarment != UndergarmentLib.NOTHING)) {
            let output: string = "";
            let wornUpper: boolean = false;

            output += "It would be awkward to put on " + this.longName + " when you're currently wearing ";
            if (this.game.player.upperGarment != UndergarmentLib.NOTHING) {
                output += this.game.player.upperGarment.longName;
                wornUpper = true;
            }

            if (this.game.player.lowerGarment != UndergarmentLib.NOTHING) {
                if (wornUpper) {
                    output += " and ";
                }
                output += this.game.player.lowerGarment.longName;
            }

            output += ". You should consider removing them. You put it back into your inventory.";

            this.outputText(output);
            return false;
        }
        return super.canUse();
    }

    public useText(): void {
        this.outputText("You equip " + this.longName + ".  ");
    }

    public playerEquip(): Armor { // This item is being equipped by the player. Add any perks, etc. - This function should only handle mechanics, not text output
        this.game.player.addToWornClothesArray(this);
        return this;
    }

    public playerRemove(): Armor | undefined { // This item is being removed by the player. Remove any perks, etc. - This function should only handle mechanics, not text output
        while (this.game.player.findPerk(PerkLib.BulgeArmor) >= 0) this.game.player.removePerk(PerkLib.BulgeArmor); // TODO remove this Exgartuan hack
        if (this.game.player.modArmorName.length > 0) this.game.player.modArmorName = "";
        return this;
    }

    public removeText(): void { } // Produces any text seen when removing the armor normally

    public getMaxStackSize(): number {
        return 1;
    }
}
