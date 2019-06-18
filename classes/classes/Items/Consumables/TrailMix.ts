	
	/**
	 * Nuts for berries.
	 */
	export class TrailMix extends Consumable 
	{
		private static  ITEM_VALUE: number = 20;
		public  TrailMix() 
		{
			super("TrailMx", "Trail Mix", "a pack of trail mix", ITEM_VALUE, "This mix of nuts, dried fruits and berries is lightweight, easy to store and very nutritious.");
		}
		
		public  useItem(): boolean
		{
			outputText("You eat the trail mix. You got energy boost from it!");
			player.refillHunger(30);
			player.changeFatigue(-20);
			player.HPChange(Math.round(player.maxHP() * 0.1), true);
			
			return false;
		}
	}

