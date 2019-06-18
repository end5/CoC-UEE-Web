/**
 * Coded by aimozg on 23.09.2017.
 */

export class CombatStrBuff extends CombatBuff {
	public static  TYPE:StatusEffectType = register("Combat Str Buff", CombatStrBuff);
	public  CombatStrBuff() {
		super(TYPE, "str");
	}
	public  applyEffect(strBuff: number): number {
		return buffHost("str", strBuff).str;
	}
}

