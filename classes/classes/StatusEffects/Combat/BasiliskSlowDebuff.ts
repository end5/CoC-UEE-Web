
export class BasiliskSlowDebuff extends CombatBuff {
	public static  TYPE:StatusEffectType = register("BasiliskSlow",BasiliskSlowDebuff);
	public  BasiliskSlowDebuff() {
		super(TYPE,'spe');
	}

	public  applyEffect(amount: number): void {
		buffHost('spe', -amount, 'scale', false, 'max', false);
	}
}


