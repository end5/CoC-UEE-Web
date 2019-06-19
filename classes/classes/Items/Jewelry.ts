import { Useable } from "./Useable";
import { JewelryLib } from "./JewelryLib";

/**
 * Created by Kitteh6660 on 08.29.14.
 */

export class Jewelry extends Useable {
    private _effectId: number;
    private _effectMagnitude: number;
    private _perk: string;
    private _name: string;

    public constructor(id: string, shortName: string, name: string, longName: string, effectId: number, effectMagnitude: number, value: number = 0, description?: string, type: string = "", perk: string = "") {
        super(id, shortName, longName, value, description);
        this._name = name;
        this._effectId = effectId;
        this._effectMagnitude = effectMagnitude;
        this._perk = perk;
    }

    public get effectId(): number { return this._effectId; }

    public get effectMagnitude(): number { return this._effectMagnitude; }

    public get perk(): string { return this._perk; }

    public get name(): string { return this._name; }

    public get description(): string {
        let desc: string = this._description;
        // Type
        desc += "\n\nType: Ring ";
        // Special
        if (this._effectId > 0) {
            desc += "\nSpecial: ";
            switch (this._effectId) {
                case JewelryLib.MODIFIER_MINIMUM_LUST:
                    if (this._effectMagnitude >= 0)
                        desc += "Increases minimum lust by " + this._effectMagnitude + ".";
                    else
                        desc += "Reduces minimum lust by " + (-this._effectMagnitude) + ".";
                    break;
                case JewelryLib.MODIFIER_FERTILITY:
                    desc += "Increases cum production by " + this._effectMagnitude + "% and fertility by " + this._effectMagnitude + ".";
                    break;
                case JewelryLib.MODIFIER_CRITICAL:
                    desc += "Increases critical chance by " + this._effectMagnitude + "%.";
                    break;
                case JewelryLib.MODIFIER_REGENERATION:
                    desc += "Grants regeneration of " + this._effectMagnitude + " HP per turn. Effect doubled outside of combat.";
                    break;
                case JewelryLib.MODIFIER_HP:
                    desc += "Increases maximum HP by " + this._effectMagnitude + ".";
                    break;
                case JewelryLib.MODIFIER_ATTACK_POWER:
                    desc += "Increases attack power by " + this._effectMagnitude + "%.";
                    break;
                case JewelryLib.MODIFIER_SPELL_POWER:
                    desc += "Increases spellpower by " + this._effectMagnitude + "%, applies additively.";
                    break;
                case JewelryLib.PURITY:
                    desc += "Slowly decreases the corruption of the wearer over time. Reduces minimum libido by " + this._effectMagnitude + ".";
                    break;
                case JewelryLib.CORRUPTION:
                    desc += "Slowly corrupts the wearer over time.";
                    break;
                default:
                    desc += "You shouldn't see this line at all. Something must be wrong with the coding.";
            }
        }
        // Value
        desc += "\nBase value: " + String(this.value);
        return desc;
    }

    public useText(): void {
        this.outputText("You equip " + this.longName + ".  ");
    }

    public playerEquip(): Jewelry { // This item is being equipped by the player. Add any perks, etc. - This function should only handle mechanics, not text output
        return this;
    }

    public playerRemove(): Jewelry | undefined { // This item is being removed by the player. Remove any perks, etc. - This function should only handle mechanics, not text output
        return this;
    }

    public removeText(): void { } // Produces any text seen when removing the armor normally
}
