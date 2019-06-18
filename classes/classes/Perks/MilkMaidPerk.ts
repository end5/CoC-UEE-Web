	
	export class MilkMaidPerk extends PerkType
	{
		
		public  desc(params:Perk = undefined): string
		{
			return "(Rank: " + params.value1 + "/10) Increases milk production by " + (200 + (params.value1 * 100)) + "mL.";
		}
		
		public  MilkMaidPerk() 
		{
			super("Milk Maid", "Milk Maid", "Increases milk production by ---mL. Allows you to lactate perpetually.");
		}
	}

