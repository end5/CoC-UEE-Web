import { CombatBuff } from "./CombatBuff";

/**
 * Coded by aimozg on 24.08.2017.
 */

export class MightBuff extends CombatBuff {
    public static TYPE = MightBuff.register("Might", MightBuff);
    public constructor() {
        super(MightBuff.TYPE, 'str', 'tou');
    }

    protected apply(firstTime: boolean): void {
        let buff: number = 10 * this.host.spellMod();
        if (buff > 100) buff = 100;
        this.buffHost('str', buff, 'tou', buff, 'scale', false, 'max', false);
    }

}
