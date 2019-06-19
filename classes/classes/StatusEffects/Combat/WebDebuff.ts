import { CombatBuff } from "./CombatBuff";

/**
 * Coded by aimozg on 22.08.2017.
 */

export class WebDebuff extends CombatBuff {
    public static TYPE = WebDebuff.register("Web", WebDebuff);
    public constructor() {
        super(WebDebuff.TYPE, 'spe');
    }

    protected apply(firstTime: boolean): void {
        this.buffHost('spe', -25);
    }
}
