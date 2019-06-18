/**
 * Coded by aimozg on 23.09.2017.
 */

export class CombatInteBuff extends CombatBuff {
	public static  TYPE:StatusEffectType = register("Combat Inte Buff", CombatInteBuff);
	public  CombatInteBuff() {
		super(TYPE, "inte");
	}
	public  applyEffect(inteBuff: number): number {
		return buffHost("inte", inteBuff).inte;
	}
}

