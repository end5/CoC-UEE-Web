	
	export class PurityPeach extends Consumable 
	{
		private static  ITEM_VALUE: number = 10;
		
		public  PurityPeach() 
		{
			super("PurPeac", "PurPeac", "a pure peach", ITEM_VALUE, "This is a peach from Minerva's spring, yellowy-orange with red stripes all over it.");
		}
		
		public  useItem(): boolean
		{
			clearOutput();
			outputText("You bite into the sweet, juicy peach, feeling a sensation of energy sweeping through your limbs and your mind.  You feel revitalized, refreshed, and somehow cleansed.  ");
			player.changeFatigue(-15);
			player.HPChange(Math.round(player.maxHP() * 0.25), true);
			player.refillHunger(25);	
			
			return false;
		}
	}
