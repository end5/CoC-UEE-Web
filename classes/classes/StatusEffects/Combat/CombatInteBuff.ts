import { CombatBuff } from "./CombatBuff";

/**
 * Coded by aimozg on 23.09.2017.
 */

export class CombatInteBuff extends CombatBuff {
    public static TYPE = CombatInteBuff.register("Combat Inte Buff", CombatInteBuff);
    public constructor() {
        super(CombatInteBuff.TYPE, "inte");
    }
    public applyEffect(inteBuff: number): number {
        return this.buffHost("inte", inteBuff).inte;
    }
}
