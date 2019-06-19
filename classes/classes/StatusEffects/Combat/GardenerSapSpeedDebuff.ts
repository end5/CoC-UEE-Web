import { CombatBuff } from "./CombatBuff";

/**
 * Coded by aimozg on 01.09.2017.
 */

export class GardenerSapSpeedDebuff extends CombatBuff {
    public static TYPE = GardenerSapSpeedDebuff.register("Sap Speed", GardenerSapSpeedDebuff);
    public constructor() {
        super(GardenerSapSpeedDebuff.TYPE, 'spe');
    }

    protected apply(firstTime: boolean): void {
        this.buffHost('spe', -this.host.spe * 0.2);
    }
}
