	
	export class AscensionMysticalityPerk extends PerkType
	{
		
		public  desc(params:Perk = undefined): string
		{
			return "(Rank: " + params.value1 + "/" + CharCreation.MAX_MYSTICALITY_LEVEL + ") Increases spell effect multiplier by " + params.value1 * 5 + "% multiplicatively.";
		}

		public  AscensionMysticalityPerk() 
		{
			super("Ascension: Mysticality", "Ascension: Mysticality", "", "Increases spell effect multiplier by 5% per level, multiplicatively.");
		}
		
		public  keepOnAscension(respec: boolean = false): boolean 
		{
			return true;
		}		
	}


