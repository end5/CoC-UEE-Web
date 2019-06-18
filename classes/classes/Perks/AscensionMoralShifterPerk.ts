	
	export class AscensionMoralShifterPerk extends PerkType
	{
		
		public  desc(params:Perk = undefined): string
		{
			return "(Rank: " + params.value1 + "/" + CharCreation.MAX_MORALSHIFTER_LEVEL + ") Increases corruption gains and losses by " + params.value1 * 20 + "%.";
		}

		public  AscensionMoralShifterPerk() 
		{
			super("Ascension: Moral Shifter", "Ascension: Moral Shifter", "", "All corruption gains and losses are increased by 20% per level.");
		}
		
		public  keepOnAscension(respec: boolean = false): boolean 
		{
			return true;
		}		
	}



