import { BaseContent } from "../../BaseContent";
import { XmasElf } from "./XmasElf";
import { XmasMisc } from "./XmasMisc";
import { XmasJackFrost } from "./XmasJackFrost";
import { XmasSnowAngel } from "./XmasSnowAngel";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { PerkLib } from "../../PerkLib";

export class XmasBase extends BaseContent {
    public xmasElf: XmasElf = new XmasElf();
    public xmasMisc: XmasMisc = new XmasMisc();
    public jackFrost: XmasJackFrost = new XmasJackFrost();
    public snowAngel: XmasSnowAngel = new XmasSnowAngel();

    public XmasBase() { }

    public isItHolidays(): boolean {
        return (this.date.date >= 25 && this.date.month == 11 || this.flags[kFLAGS.ITS_EVERY_DAY] > 0 || this.player.findPerk(PerkLib.AChristmasCarol) >= 0);
    }

}
