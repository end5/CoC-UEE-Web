import { Useable } from "./Useable";

/**
 * Created by Kitteh6660 on 01.29.15.
 */
/**
 * ...
 * @author Kitteh6660
 */

export class Shield extends Useable // Equipable
{
    public static WEIGHT_LIGHT: string = "Light";
    public static WEIGHT_MEDIUM: string = "Medium";
    public static WEIGHT_HEAVY: string = "Heavy";

    public static PERK_ABSORPTION: string = "Absorption";

    private _block: number;
    private _perk: string;
    private _name: string;
    private _weight: string = Shield.WEIGHT_MEDIUM; // Defaults to medium
    private _tier: number = 0;

    public constructor(id: string, shortName: string, name: string, longName: string, block: number, value: number = 0, description?: string, perk: string = "") {
        super(id, shortName, longName, value, description);
        this._name = name;
        this._block = block;
        this._perk = perk;
    }

    public get block(): number { return this._block + (this._tier * 2); }

    public get perk(): string { return this._perk; }

    public get name(): string { return this._name; }

    public get value(): number {
        return this._value * (1 + (this._tier / 2));
    }

    public get shortName(): string {
        let sn: string = this._shortName;
        if (this._tier > 0) sn += "+" + this._tier;
        return sn;
    }

    public get description(): string {
        let desc: string = this._description;
        let diff: number = 0;
        switch (this._tier) {
            case 1:
                desc += " This shield has been upgraded to be of fine quality.";
                break;
            case 2:
                desc += " This shield has been upgraded to be of masterwork quality.";
                break;
            default:
                desc += "";
        }
        // Type
        desc += "\n\nType: Shield";
        // Block Rating
        desc += "\nBlock: " + String(this.block);
        diff = this.block - (this.game.player.shield.block);
        if (diff > 0)
            desc += " (<font color=\"#00d000\">+" + String(Math.abs(diff)) + "</font>)";
        else if (diff < 0)
            desc += " (<font color=\"#d00000\">-" + String(Math.abs(diff)) + "</font>)";
        // Value
        desc += "\nBase value: " + String(this.value);
        return desc;
    }

    public useText(): void {
        this.outputText("You equip " + this.longName + ".  ");
    }

    public canUse(): boolean {
        if (this.game.player.weaponPerk == "Large") {
            this.outputText("Your current weapon requires two hands. Unequip your current weapon or switch to one-handed before equipping this shield. ");
            return false;
        }
        return true;
    }

    public playerEquip(): Shield { // This item is being equipped by the player. Add any perks, etc. - This function should only handle mechanics, not text output
        return this;
    }

    public playerRemove(): Shield | undefined { // This item is being removed by the player. Remove any perks, etc. - This function should only handle mechanics, not text output
        return this;
    }

    public removeText(): void { } // Produces any text seen when removing the armor normally

    public getMaxStackSize(): number {
        return 1;
    }

    public set tier(num) {
        this._tier = num;
    }
    public get tier() {
        return this._tier;
    }

    public set weightCategory(newWeight) {
        this._weight = newWeight;
    }
    public get weightCategory() {
        return this._weight;
    }
}
