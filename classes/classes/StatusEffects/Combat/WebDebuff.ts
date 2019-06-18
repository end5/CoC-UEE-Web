/**
 * Coded by aimozg on 22.08.2017.
 */

export class WebDebuff extends CombatBuff{
	public static  TYPE:StatusEffectType = register("Web",WebDebuff);
	public  WebDebuff() {
		super(TYPE, 'spe');
	}

	protected  apply(firstTime: boolean): void {
		buffHost('spe',-25);
	}
}

