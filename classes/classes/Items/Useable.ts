import { ItemType } from "../ItemType";
import { CoC } from "../CoC";
import { CoC_Settings } from "../CoC_Settings";
import { kGAMECLASS } from "../GlobalFlags/kGAMECLASS";

/**
 * Created by aimozg on 09.01.14.
 */

/**
 * Represent item that can be used but does not necessarily disappears on use. Direct subclasses should overrride
 * "useItem" method.
 */
export class Useable extends ItemType {

    public constructor(id: string, shortName?: string, longName?: string, value: number = 0, description?: string) {
        super(id, shortName, longName, value, description);
    }

    public get game(): CoC {
        return kGAMECLASS;
    }
    public getGame(): CoC {
        return kGAMECLASS;
    }

    public clearOutput(): void {
        kGAMECLASS.clearOutput();
    }
    public outputText(text: string): void {
        kGAMECLASS.outputText(text);
    }

    public set description(newDesc) {
        this._description = newDesc;
    }

    public get description() {
        let desc: string = this._description;
        // Type
        desc += "\n\nType: ";
        if (this.shortName == "Condom" || this.shortName == "GldStat") desc += "Miscellaneous";
        else if (this.shortName == "Debug Wand") desc += "Miscellaneous (Cheat Item)";
        else desc += "Material";
        // Value
        desc += "\nBase value: " + String(this.value);
        return desc;
    }

    public canUse(): boolean { return this.game.prison.prisonCanUseItem(this); } // If an item cannot be used it should provide some description of why not

    public useItem(): boolean {
        CoC_Settings.errorAMC("Useable", "useItem", this.id);
        return (false);
    }

    public useText(): void { } // Produces any text seen when using or equipping the item normally

}
