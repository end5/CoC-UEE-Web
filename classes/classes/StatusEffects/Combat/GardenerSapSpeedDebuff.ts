/**
 * Coded by aimozg on 01.09.2017.
 */

export class GardenerSapSpeedDebuff extends CombatBuff {
	public static  TYPE:StatusEffectType = register("Sap Speed",GardenerSapSpeedDebuff);
	public  GardenerSapSpeedDebuff() {
		super(TYPE,'spe');
	}

	protected  apply(firstTime: boolean): void {
		buffHost('spe',-host.spe*0.2);
	}
}


