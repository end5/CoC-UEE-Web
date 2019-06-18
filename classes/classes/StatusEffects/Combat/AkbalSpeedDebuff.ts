/**
 * Coded by aimozg on 22.08.2017.
 */

export class AkbalSpeedDebuff extends CombatBuff {
	public static  TYPE:StatusEffectType = register("Akbal Speed",AkbalSpeedDebuff);
	public  AkbalSpeedDebuff() {
		super(TYPE,'spe');
	}


	protected  apply(firstTime: boolean): void {
		buffHost('spe', -host.spe / 5);
	}
}


