	
	/**
	 * Item that increases INT
	 */
	export class ScholarsTea extends Consumable
	{
		private static  ITEM_VALUE: number = 15;
		
		public  ScholarsTea()
		{
			super("Smart T", "Scholars T.", "a cup of scholar's tea", ITEM_VALUE, "This powerful brew supposedly has mind-strengthening effects.");
		}
		
		public  useItem(): boolean
		{
			player.slimeFeed();
			clearOutput();
			outputText("Following the merchant's instructions, you steep and drink the tea. Its sharp taste fires up your palate and in moments, you find yourself more alert and insightful. As your mind wanders, a creative, if somewhat sordid, story comes to mind. It is a shame that you do not have writing implements as you feel you could make a coin or two off what you have conceived. The strange seller was not lying about the power of the tea.");
			if (rand(3) === 0) {
				outputText(player.modTone(15, 1));
			}
			//Now NERFED!
			if (player.inte100 < 40) {
				game.dynStats("int", 1.5 + rand(4));
			}
			else if (player.inte100 < 60) {
				game.dynStats("int", 1 + rand(3));
			}
			else if (player.inte100 < 80) {
				game.dynStats("int", 0.5 + rand(2));
			}
			else {
				game.dynStats("int", 0.2 + rand(2));
			}
			
			player.refillHunger(10);
			
			return false;
		}
	}

