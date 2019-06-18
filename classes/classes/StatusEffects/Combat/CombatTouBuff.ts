/**
 * Coded by aimozg on 23.09.2017.
 */

export class CombatTouBuff extends CombatBuff {
	public static  TYPE:StatusEffectType = register("Combat Tou Buff", CombatTouBuff);
	public  CombatTouBuff() {
		super(TYPE, "tou");
	}
	public  applyEffect(touBuff: number): number {
		return buffHost("tou", touBuff).tou;
	}
}

