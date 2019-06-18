	
	/**
	 * Natural energy drink?
	 */
	export class IsabellaMilk extends Consumable 
	{
		public  IsabellaMilk() 
		{
			super("IzyMilk","IzyMilk", "a bottle of Isabella's milk", ConsumableLib.DEFAULT_VALUE, "This is a bottle of Isabella's milk.  Isabella seems fairly certain it will invigorate you.");
		}
		
		public  useItem(): boolean
		{
			player.slimeFeed();
			clearOutput();
			outputText("You swallow down the bottle of Isabella's milk.");
			if (player.fatigue > 0) outputText("  You feel much less tired! (-33 fatigue)");
			player.changeFatigue(-33);
			player.refillHunger(20);
			
			return false;
		}
	}

