	
	export class AscensionWisdomPerk extends PerkType
	{
		
		public  desc(params:Perk = undefined): string
		{
			return "(Rank: " + params.value1 + "/" + CharCreation.MAX_WISDOM_LEVEL + ") Increases experience gained in battles by " + params.value1 * 10 + "%.";
		}

		public  AscensionWisdomPerk() 
		{
			super("Ascension: Wisdom", "Ascension: Wisdom", "", "Increases experience gains by 10% per level.");
		}
		
		public  keepOnAscension(respec: boolean = false): boolean 
		{
			return true;
		}		
	}


