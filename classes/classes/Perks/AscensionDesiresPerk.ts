	
	export class AscensionDesiresPerk extends PerkType
	{
		
		public  desc(params:Perk = undefined): string
		{
			return "(Rank: " + params.value1 + "/" + CharCreation.MAX_DESIRES_LEVEL + ") Increases maximum lust by " + params.value1 * 5 + ".";
		}
		
		public  AscensionDesiresPerk() 
		{
			super("Ascension: Desires", "Ascension: Desires", "", "Increases maximum lust by 5 per level.");
		}
		
		public  keepOnAscension(respec: boolean = false): boolean 
		{
			return true;
		}
	}


