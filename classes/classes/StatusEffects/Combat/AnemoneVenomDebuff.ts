
export class AnemoneVenomDebuff extends CombatBuff {
	public static  TYPE:StatusEffectType = register("Anemone Venom",AnemoneVenomDebuff);
	public  AnemoneVenomDebuff() {
		super(TYPE,'str','spe');
	}

	public  applyEffect(str: number): void {
		host.takeLustDamage((2 * str), true);
		buffHost('str', -str,'spe',-str);
	}
}


