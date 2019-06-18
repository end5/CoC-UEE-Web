/**
 * Coded by aimozg on 24.08.2017.
 */

export class AmilyVenomDebuff extends CombatBuff {
	public static  TYPE:StatusEffectType = register("Amily Venom",AmilyVenomDebuff);
	public  AmilyVenomDebuff() {
		super(TYPE,'str','spe');
	}

	protected  apply(firstTime: boolean): void {
		buffHost('str', -2 - rand(5),'spe', -2 - rand(5));
	}
}

