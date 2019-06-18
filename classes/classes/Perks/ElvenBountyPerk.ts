/**
 * Created by aimozg on 27.01.14.
 */

	export class ElvenBountyPerk extends PerkType
	{

		public  desc(params:Perk = undefined): string
		{
			return "Increases fertility by " + params.value2 + "% and cum production by " + params.value1 + "mLs.";
		}

		public  ElvenBountyPerk()
		{
			super("Elven Bounty", "Elven Bounty", "After your encounter with an elf, her magic has left you with increased fertility and virility.", undefined, true);
		}
	}

