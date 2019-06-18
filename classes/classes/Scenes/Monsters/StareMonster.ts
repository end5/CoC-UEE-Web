
	/**
	 * Class to categorize monsters with the stare ability
	 * @since  27.02.2018
	 * @author Stadler76
	 */
	export class StareMonster extends Monster
	{
		public static  speedReduce(player:Player, amount: number = 0): void
		{
		var  bse:BasiliskSlowDebuff = player.createOrFindStatusEffect(StatusEffects.BasiliskSlow) as BasiliskSlowDebuff;
			bse.applyEffect(amount);
		}
	}

