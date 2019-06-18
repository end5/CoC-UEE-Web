/**
 * Coded by aimozg on 24.08.2017.
 */

export class MightBuff extends CombatBuff {
	public static  TYPE:StatusEffectType = register("Might",MightBuff);
	public  MightBuff() {
		super(TYPE,'str','tou');
	}

	protected  apply(firstTime: boolean): void {
	var  buff: number = 10 * host.spellMod();
		if (buff > 100) buff = 100;
		buffHost('str',buff,'tou',buff,'scale',false,'max',false);
	}

}

