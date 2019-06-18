	
	export class AscensionFertilityPerk extends PerkType
	{
		
		public  desc(params:Perk = undefined): string
		{
			return "(Rank: " + params.value1 + "/" + CharCreation.MAX_FERTILITY_LEVEL + ") Increases base fertility by " + params.value1 * 5 + ".";
		}
		
		public  AscensionFertilityPerk() 
		{
			super("Ascension: Fertility", "Ascension: Fertility", "", "Increases fertility rating by 5 per level.");
		}
		
		public  keepOnAscension(respec: boolean = false): boolean 
		{
			return true;
		}		
	}


