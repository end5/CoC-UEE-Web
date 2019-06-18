/**
 * Coded by aimozg on 01.09.2017.
 */

export class LizanBlowpipeDebuff extends CombatBuff {
	public static  TYPE:StatusEffectType = register("Lizan Blowpipe", LizanBlowpipeDebuff);
	public  LizanBlowpipeDebuff() {
		super(TYPE, 'str', 'tou', 'spe', 'sens');
	}
	public  debuffStrSpe(): void {
	var  power: number = 5;
		if (!host.isPureEnough(50)) {
			power = 10;
		}
		buffHost('str', -power, 'spe', -power);
	}
	public  debuffTouSens(): void {
	var  power: number = 5;
		if (!host.isPureEnough(50)) {
			power = 10;
		}
		buffHost('tou', -power, 'sens', power);
	}
}


