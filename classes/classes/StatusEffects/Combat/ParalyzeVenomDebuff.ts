
export class ParalyzeVenomDebuff extends CombatBuff {

	public static  TYPE:StatusEffectType = register("paralyze venom",ParalyzeVenomDebuff);
	public  ParalyzeVenomDebuff() {
		super(TYPE,'str','spe');
	}


	public  onRemove(): void {
		if (playerHost) {
			game.outputText("<b>You feel quicker and stronger as the paralyzation venom in your veins wears off.</b>\n\n");
		}
	}

	protected  apply(firstTime: boolean): void {
		buffHost('str',firstTime?-2:-3,'spe',firstTime?-2:-3);
	}

}

