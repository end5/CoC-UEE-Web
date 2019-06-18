	
	export class TowerShield extends Shield
	{
		public  TowerShield(tier: number)
		{
		var  ids: any[] = ["TowerSh", "TowerS1", "TowerS2"];
		var  eqptNames: any[] = ["tower shield", "fine tower shield", "masterwork tower shield"];
		var  longNames: any[] = ["a tower shield", "a fine tower shield", "a masterwork tower shield"];
			this.weightCategory = Shield.WEIGHT_HEAVY;
			this.tier = tier;
			super(ids[tier], "TowerShld", eqptNames[tier], longNames[tier], 16, 500, "A towering metal shield. It looks heavy! The weight of this shield might incite some penalties to accuracy.");
		}
		
		public  canUse(): boolean {
			if (game.player.str >= 40) return true;
			outputText("This shield is too heavy for you to hold effectively. Perhaps you should try again when you have at least 40 strength?");
			return false;
		}
	}

