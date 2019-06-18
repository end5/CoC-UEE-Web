/**
 * Created by aimozg on 31.01.14.
 */

export class CombatStatusEffect extends StatusEffect
{

	public  CombatStatusEffect(stype:StatusEffectType)
	{
		super(stype);
	}

	public  onCombatEnd(): void {
		remove();
	}
}

