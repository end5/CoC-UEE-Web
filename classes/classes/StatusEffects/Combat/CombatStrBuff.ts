import { CombatBuff } from "./CombatBuff";

/**
 * Coded by aimozg on 23.09.2017.
 */

export class CombatStrBuff extends CombatBuff {
    public static TYPE = CombatStrBuff.register("Combat Str Buff", CombatStrBuff);
    public constructor() {
        super(CombatStrBuff.TYPE, "str");
    }
    public applyEffect(strBuff: number): number {
        return this.buffHost("str", strBuff).str;
    }
}
