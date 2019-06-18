
export class NagaVenomDebuff extends CombatBuff {

	public static  TYPE:StatusEffectType = register("Naga Venom",NagaVenomDebuff);
	public  NagaVenomDebuff() {
		super(TYPE,'spe');
	}

	protected  apply(first: boolean): void {
	var  debuff: any = buffHost('spe',first?-3:-2);
		if (debuff.spe == 0) host.takeDamage(5+rand(5));
		host.takeDamage(5+rand(5));
	}

	public  onCombatRound(): void {
		//Chance to cleanse!
		if (host.hasPerk(PerkLib.Medicine) && rand(100) <= 14) {
			if (playerHost) game.outputText("You manage to cleanse the naga venom from your system with your knowledge of medicine!\n\n");
			remove();
			return;
		}
	var  debuff: any = buffHost('spe',-2);
		if (debuff.spe == 0) host.takeDamage(5);
		host.takeDamage(2);
		if (playerHost) game.outputText("You wince in pain and try to collect yourself, the naga's venom still plaguing you.\n\n");
	}
}

