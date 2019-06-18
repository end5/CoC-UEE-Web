
export class GnollSpearDebuff extends CombatBuff {
	public static  TYPE:StatusEffectType = register("Gnoll Spear",GnollSpearDebuff);
	public  GnollSpearDebuff() {
		super(TYPE,'spe');
	}


	protected  apply(firstTime: boolean): void {
		buffHost('spe', -15);
	}
}


