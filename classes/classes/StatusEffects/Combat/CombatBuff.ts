
export class CombatBuff extends TemporaryBuff{
	public  CombatBuff(stype:StatusEffectType, stat1: string, stat2: string ='', stat3: string ='', stat4: string ='') {
		super(stype, stat1, stat2, stat3, stat4);
	}

	public  onCombatEnd(): void {
		super.onCombatEnd();
		restore();
		remove();
	}
}

