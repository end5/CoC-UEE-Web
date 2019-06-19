import { CombatBuff } from "./CombatBuff";

/**
 * Coded by aimozg on 23.09.2017.
 */

export class CombatTouBuff extends CombatBuff {
    public static TYPE = CombatTouBuff.register("Combat Tou Buff", CombatTouBuff);
    public constructor() {
        super(CombatTouBuff.TYPE, "tou");
    }
    public applyEffect(touBuff: number): number {
        return this.buffHost("tou", touBuff).tou;
    }
}
