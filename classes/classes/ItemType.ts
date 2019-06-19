import { Utils } from "./internals/Utils";
import { CoC_Settings } from "./CoC_Settings";

/**
 * Created by aimozg on 09.01.14.
 */

export class ItemType extends Utils {
    private static ITEM_LIBRARY = new Dictionary();
    private static ITEM_SHORT_LIBRARY = new Dictionary();
    public static NOTHING: ItemType = new ItemType("NOTHING!");

    /**
     * Looks up item by <b>ID</b>.
     * @param	id 7-letter string that identifies an item.
     * @return  ItemType
     */
    public static lookupItem(id: string) {
        return ItemType.ITEM_LIBRARY[id];
    }

    /**
     * Looks up item by <b>shortName</b>.
     * @param	shortName The short name that was displayed on buttons.
     * @return  ItemType
     */
    public static lookupItemByShort(shortName: string) {
        return ItemType.ITEM_SHORT_LIBRARY[shortName];
    }

    public static getItemLibrary() {
        return ItemType.ITEM_LIBRARY;
    }

    private _id: string;
    protected _shortName: string;
    protected _longName: string;
    protected _description: string;
    protected _value: number;

    protected _degradable: boolean = false; // True indicates degrades in durability.
    protected _durability: number = 0; // If it's greater than 0, when threshold is crossed, it will cause item to break.
    protected _breaksInto: ItemType | undefined = undefined; // If the weapon breaks, turns into the specific item or vanish into nothing.

    /**
     * Short name to be displayed on buttons
     */
    public get shortName(): string {
        return this._shortName;
    }

    /**
     * A full name of the item, to be described in text
     */
    public get longName(): string {
        return this._longName;
    }

    /**
     * Item base price
     */
    public get value(): number {
        return this._value;
    }

    /**
     * Detailed description to use on tooltips
     */
    public get description(): string {
        return this._description;
    }

    /**
     * 7-character unique (across all the versions) string, representing that item type.
     */
    public get id(): string {
        return this._id;
    }

    public constructor(_id: string, _shortName?: string, _longName?: string, _value: number = 0, _description?: string) {
        super();
        this._id = _id;
        this._shortName = _shortName || _id;
        this._longName = _longName || this.shortName;
        this._description = _description || this.longName;
        this._value = _value;
        if (ItemType.ITEM_LIBRARY[_id] != undefined) {
            CoC_Settings.error("Duplicate itemid " + _id + ", old item is " + (ItemType.ITEM_LIBRARY[_id] as ItemType).longName);
        }
        if (ItemType.ITEM_SHORT_LIBRARY[this.shortName] != undefined) {
            CoC_Settings.error("WARNING: Item with duplicate shortname: '" + _id + "' and '" + (ItemType.ITEM_SHORT_LIBRARY[this.shortName] as ItemType)._id + "' share " + this.shortName);
        }
        ItemType.ITEM_LIBRARY[_id] = this;
        ItemType.ITEM_SHORT_LIBRARY[this.shortName] = this;
    }

    protected appendStatsDifference(diff: number): string {
        if (diff > 0)
            return " (<font color=\"#007f00\">+" + String(Math.abs(diff)) + "</font>)";
        else if (diff < 0)
            return " (<font color=\"#7f0000\">-" + String(Math.abs(diff)) + "</font>)";
        else
            return "";
    }

    public toString(): string {
        return "\"" + this._id + "\"";
    }

    public getMaxStackSize(): number {
        return 5;
    }

    // Durability & Degradation system
    public isDegradable(): boolean {
        return this._degradable;
    }

    public set durability(newValue) {
        if (newValue > 0) this._degradable = true;
        this._durability = newValue;
    }
    public get durability() {
        return this._durability;
    }

    public set degradesInto(newValue) {
        this._breaksInto = newValue;
    }
    public get degradesInto() {
        return this._breaksInto;
    }
}

