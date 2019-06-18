	
	export class AscensionEndurancePerk extends PerkType
	{
		
		public  desc(params:Perk = undefined): string
		{
			return "(Rank: " + params.value1 + "/" + CharCreation.MAX_ENDURANCE_LEVEL + ") Increases maximum fatigue by " + params.value1 * 5 + ".";
		}
		
		public  AscensionEndurancePerk() 
		{
			super("Ascension: Endurance", "Ascension: Endurance", "", "Increases maximum fatigue by 5 per level.");
		}
		
		public  keepOnAscension(respec: boolean = false): boolean 
		{
			return true;
		}		
	}


