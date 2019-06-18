import { Useable } from "./Useable";
import { ShieldLib } from "./ShieldLib";
import { PerkLib } from "../PerkLib";
import { ItemType } from "../ItemType";

/**
 * Created by aimozg on 09.01.14.
 */

export class Weapon extends Useable // Equipable
{
    public static WEIGHT_LIGHT: string = "Light";
    public static WEIGHT_MEDIUM: string = "Medium";
    public static WEIGHT_HEAVY: string = "Heavy";

    public static PERK_LARGE: string = "Large";
    public static PERK_RANGED: string = "Ranged";
    public static PERK_APHRODISIAC: string = "Aphrodisiac Weapon";

    protected _verb: string;
    protected _attack: number;
    protected _perk: string;
    protected _name: string;
    protected _weight: string = Weapon.WEIGHT_MEDIUM; // Defaults to medium
    protected _tier: number = 0; // Defaults to 0.

    public constructor(id: string, shortName: string, name: string, longName: string, verb: string, attack: number, value: number = 0, description?: string, perk: string = "") {
        super(id, shortName, longName, value, description);
        this._name = name;
        this._verb = verb;
        this._attack = attack;
        this._perk = perk;
    }

    public get verb() { return this._verb; }

    public get attack() { return this._attack + (this._tier * 2); }

    public get perk() { return this._perk; }

    public get name() { return this._name; }

    public get value() {
        return this._value * (1 + (this._tier / 2));
    }

    public get shortName() {
        let sn: string = this._shortName;
        if (this._tier > 0 && !this.isObsidian()) sn += "+" + this._tier;
        if (this.isObsidian()) sn = "Ob." + sn; // For obsidian weapons, unless specified.
        return sn;
    }

    public get description() {
        let desc: string = this._description;
        switch (this._tier) {
            case 1:
                desc += " This weapon has been upgraded to be of fine quality.";
                break;
            case 2:
                desc += " This weapon has been upgraded to be of masterwork quality.";
                break;
            case 3:
                if (this._degradable) desc += "This weapon has been enhanced with reinforced obsidian " + (this.isSharp() ? "lining its blade that could deliver sharper blows" : "spikes carefully attached to deliver more painful attacks") + ".";
                else desc += " This weapon has been upgraded to be of epic quality and takes on a more fearsome look.";
                break;
            default:
                desc += "";
        }
        // Type
        desc += "\n\nType: " + this._weight + " Weapon ";
        if (this.perk == "Large") desc += "(Large)";
        else if (this.name.indexOf("staff") >= 0) desc += "(Staff)";
        else if (this.verb.indexOf("whip") >= 0) desc += "(Whip)";
        else if (this.verb.indexOf("punch") >= 0) desc += "(Gauntlet)";
        else if (this.verb == "shot") desc += "(Ranged)";
        else if (this.verb == "slash" || this.verb == "keen cut") desc += "(Sword)";
        else if (this.verb == "stab") desc += "(Dagger)";
        else if (this.verb == "smash") desc += "(Blunt)";
        // Attack
        desc += "\nAttack: " + String(this.attack);
        desc += this.appendStatsDifference(this.attack - (this.game.player.weapon.attack));
        // Value
        desc += "\nBase value: " + String(this.value);
        return desc;
    }

    public useText(): void {
        this.outputText("You equip " + this.longName + ".  ");
        if (this.perk == "Large" && this.game.player.shield != ShieldLib.NOTHING && !(this.game.player.hasPerk(PerkLib.TitanGrip) && this.game.player.str >= 90)) {
            this.outputText("Because the weapon requires the use of two hands, you have unequipped your shield. ");
        }
    }

    public canUse(): boolean {
        return true;
    }

    public playerEquip(): Weapon { // This item is being equipped by the player. Add any perks, etc. - This function should only handle mechanics, not text output
        if (this.perk == "Large" && this.game.player.shield != ShieldLib.NOTHING && !(this.game.player.hasPerk(PerkLib.TitanGrip) && this.game.player.str >= 90)) {
            this.game.inventory.unequipShield();
        }
        return this;
    }

    public playerRemove(): Weapon | undefined { // This item is being removed by the player. Remove any perks, etc. - This function should only handle mechanics, not text output
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

    // For possible condition checking
    public isObsidian(): boolean {
        return this.longName.toLowerCase().indexOf("obsidian") >= 0;
    }
    public isSharp(): boolean {
        return (this.verb == "slash" || this.verb == "keen cut" || this.verb == "stab");
    }

    // For obsidian and breakable weapons.
    public setDegradation(durability: number, weaponToDegradeInto?: ItemType): Weapon {
        this._degradable = true;
        this._durability = durability;
        this._breaksInto = weaponToDegradeInto;
        return this;
    }

}
