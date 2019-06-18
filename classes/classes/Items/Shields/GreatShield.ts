
	export class GreatShield extends Shield
	{
		public  GreatShield(tier: number) 
		{
		var  ids: any[] = ["GreatSh", "GrtShl1", "GrtShl2"];
		var  eqptNames: any[] = ["greatshield", "fine greatshield", "masterwork greatshield"];
		var  longNames: any[] = ["a greatshield", "a fine greatshield", "a masterwork greatshield"];
			this.weightCategory = Shield.WEIGHT_MEDIUM;
			this.tier = tier;
			super(ids[tier], "GreatShld", eqptNames[tier], longNames[tier], 10, 300, "A large, rectangular metal shield. It's a bit heavy.");
		}
		
	}

