import { CombatBuff } from "./CombatBuff";

/**
 * Coded by aimozg on 23.09.2017.
 */

export class CombatSpeBuff extends CombatBuff {
    public static TYPE = CombatSpeBuff.register("Combat Spe Buff", CombatSpeBuff);
    public constructor() {
        super(CombatSpeBuff.TYPE, "spe");
    }
    public applyEffect(speBuff: number): number {
        return this.buffHost("spe", speBuff).spe;
    }
}
