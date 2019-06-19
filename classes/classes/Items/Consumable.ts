import { Useable } from "./Useable";
import { Mutations } from "./Mutations";
import { Output } from "../Output";
import { Credits } from "../Credits";
import { Player } from "../Player";
import { Prison } from "../Scenes/Places/Prison";
import { Camp } from "../Scenes/Camp";
import { kGAMECLASS } from "../GlobalFlags/kGAMECLASS";

/**
 * Created by aimozg on 09.01.14.
 */

/**
 * An item, that is consumed by player, and disappears after use. Direct subclasses should override "doEffect" method
 * and NOT "useItem" method.
 */
export class Consumable extends Useable {
    protected get mutations(): Mutations { return kGAMECLASS.mutations; }
    protected get changes() { return this.mutations.changes; }
    protected set changes(val) { this.mutations.changes = val; }
    protected get changeLimit() { return this.mutations.changeLimit; }
    protected set changeLimit(val) { this.mutations.changeLimit = val; }

    protected get output(): Output { return kGAMECLASS.output; }
    protected get credits(): Credits { return kGAMECLASS.credits; }
    protected get player(): Player { return kGAMECLASS.player; }
    protected get prison(): Prison { return kGAMECLASS.prison; }
    protected get flags() { return kGAMECLASS.flags; }
    protected get camp(): Camp { return kGAMECLASS.camp; }
    protected tfChance(min: number, max: number): boolean { return this.mutations.tfChance(min, max); }
    protected doNext(eventNo: any): void { kGAMECLASS.output.doNext(eventNo); }

    public constructor(id: string, shortName?: string, longName?: string, value: number = 0, description?: string) {
        super(id, shortName, longName, value, description);
    }

    public get description(): string {
        let desc: string = this._description;
        // Type
        desc += "\n\nType: Consumable ";
        if (this.shortName == "Wingstick") desc += "(Thrown)";
        if (this.shortName == "S.Hummus") desc += "(Cheat Item)";
        if (this.shortName == "BroBrew" || this.shortName == "BimboLq" || this.shortName == "P.Pearl") desc += "(Rare Item)";
        if (this.longName.indexOf("dye") >= 0) desc += "(Dye)";
        if (this.longName.indexOf("egg") >= 0) desc += "(Egg)";
        if (this.longName.indexOf("book") >= 0) desc += "(Magic Book)";
        // Value
        desc += "\nBase value: " + String(this.value);
        return desc;
    }

    /**
     * Delegate function for legacy 'Mutations.as' code.
     * @param	... args stat change parameters
     */
    protected dynStats(...args: any): void {
        this.game.dynStats.apply(undefined, args);
    }

    public getMaxStackSize(): number {
        return 10;
    }
}
