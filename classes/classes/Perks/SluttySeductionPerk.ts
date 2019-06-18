/**
 * Created by aimozg on 27.01.14.
 */

	export class SluttySeductionPerk extends PerkType
	{

		public  desc(params:Perk = undefined): string
		{
			return "Increases odds of successfully teasing and lust damage of successful teases by " + params.value1 + " points."
		}

		public  SluttySeductionPerk()
		{
			super("Slutty Seduction", "Slutty Seduction",
					"Your armor allows you access to 'Seduce', an improved form of 'Tease'.");
		}
		
		public  keepOnAscension(respec: boolean = false): boolean 
		{
			return true;
		}		
	}

