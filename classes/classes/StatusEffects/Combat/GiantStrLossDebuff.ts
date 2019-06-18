/**
 * Coded by aimozg on 01.09.2017.
 */

export class GiantStrLossDebuff extends CombatBuff {
	public static  TYPE:StatusEffectType = register("GiantStrLoss",GiantStrLossDebuff);
	public  GiantStrLossDebuff() {
		super(TYPE,'str');
	}

	public  applyEffect(magnitude: number): void {
		buffHost('str', -magnitude);
	}
}


