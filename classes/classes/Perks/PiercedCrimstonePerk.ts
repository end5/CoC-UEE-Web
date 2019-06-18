/**
 * Created by aimozg on 27.01.14.
 */

	export class PiercedCrimstonePerk extends PerkType
	{

		public  desc(params:Perk = undefined): string
		{
			return "Increases minimum lust by " + Math.round(params.value1) + ".";
		}

		public  PiercedCrimstonePerk()
		{
			super("Pierced: Crimstone", "Pierced: Crimstone",
					"You've been pierced with Crimstone and your lust seems to stay a bit higher than before.");
		}
	}

