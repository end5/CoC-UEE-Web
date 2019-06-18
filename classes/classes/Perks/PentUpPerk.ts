/**
 * Created by aimozg on 27.01.14.
 */

	export class PentUpPerk extends PerkType
	{

		public  desc(params:Perk = undefined): string
		{
			return "Increases minimum lust by " + Math.round(params.value1) + " and makes you more vulnerable to seduction.";
		}

		public  PentUpPerk()
		{
			super("Pent Up","Pent Up", "Increases minimum lust and makes you more vulnerable to seduction");
		}
	}

