import { CombatBuff } from "./CombatBuff";

/**
 * Coded by aimozg on 22.08.2017.
 */

export class AkbalSpeedDebuff extends CombatBuff {
    public static TYPE = AkbalSpeedDebuff.register("Akbal Speed", AkbalSpeedDebuff);
    public constructor() {
        super(AkbalSpeedDebuff.TYPE, 'spe');
    }

    protected apply(firstTime: boolean): void {
        this.buffHost('spe', -this.host.spe / 5);
    }
}
