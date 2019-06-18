/**
 * Coded by aimozg on 01.09.2017.
 */

export class DriderIncubusVenomDebuff extends CombatBuff {
	public static  TYPE:StatusEffectType = register("Drider Incubus Venom",DriderIncubusVenomDebuff);
	public  DriderIncubusVenomDebuff() {
		super(TYPE,'str');
	}

	protected  apply(firstTime: boolean): void {
		// -5 perm -30 temp
		host.dynStats('str',-5);
		buffHost('str',-30);
	}
	public  onCombatRound(): void {
		//Chance to cleanse!
		if (host.findPerk(PerkLib.Medicine) >= 0 && rand(100) <= 14) {
			if (playerHost) game.outputText("You manage to cleanse the drider incubus venom from your system with your knowledge of medicine!\n\n");
			remove();
		}
	}
}


