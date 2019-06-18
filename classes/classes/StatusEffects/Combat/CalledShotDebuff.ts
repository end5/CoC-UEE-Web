
export class CalledShotDebuff extends CombatBuff {

	public static  TYPE:StatusEffectType = register("Called Shot",CalledShotDebuff);
	public  CalledShotDebuff() {
		super(TYPE,'spe');
	}


	protected  apply(firstTime: boolean): void {
		buffHost('spe', -20 - rand(5));
	}
}

