/**
 * Coded by aimozg on 23.09.2017.
 */

export class CombatSpeBuff extends CombatBuff {
	public static  TYPE:StatusEffectType = register("Combat Spe Buff", CombatSpeBuff);
	public  CombatSpeBuff() {
		super(TYPE, "spe");
	}
	public  applyEffect(speBuff: number): number {
		return buffHost("spe", speBuff).spe;
	}
}

