import { CombatBuff } from "./CombatBuff";

/**
 * Coded by aimozg on 01.09.2017.
 */

export class LizanBlowpipeDebuff extends CombatBuff {
    public static TYPE = LizanBlowpipeDebuff.register("Lizan Blowpipe", LizanBlowpipeDebuff);
    public constructor() {
        super(LizanBlowpipeDebuff.TYPE, 'str', 'tou', 'spe', 'sens');
    }
    public debuffStrSpe(): void {
        let power: number = 5;
        if (!this.host.isPureEnough(50)) {
            power = 10;
        }
        this.buffHost('str', -power, 'spe', -power);
    }
    public debuffTouSens(): void {
        let power: number = 5;
        if (!this.host.isPureEnough(50)) {
            power = 10;
        }
        this.buffHost('tou', -power, 'sens', power);
    }
}
