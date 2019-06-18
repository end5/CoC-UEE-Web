	
	export class AscensionVirilityPerk extends PerkType
	{
		
		public  desc(params:Perk = undefined): string
		{
			return "(Rank: " + params.value1 + "/" + CharCreation.MAX_VIRILITY_LEVEL + ") Increases base virility rating by " + params.value1 * 5 + ".";
		}
		
		public  AscensionVirilityPerk() 
		{
			super("Ascension: Virility", "Ascension: Virility", "", "Increases base virility rating by 5 per level.");
		}
		
		public  keepOnAscension(respec: boolean = false): boolean 
		{
			return true;
		}		
	}


