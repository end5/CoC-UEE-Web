	
	/**
	 * Honey based alcoholic beverage.
	 */
	export class ProMead extends Consumable 
	{
		public  ProMead() 
		{
			super("ProMead", "ProMead", "a pint of premium god\'s mead", ConsumableLib.DEFAULT_VALUE, undefined);
		}
		
		public  useItem(): boolean
		{
			clearOutput();
			outputText("You take a hearty swig of mead, savoring the honeyed taste on your tongue.  Emboldened by the first drink, you chug the remainder of the horn\'s contents in no time flat.  You wipe your lips, satisfied, and let off a small belch as you toss the empty horn aside.");
			dynStats("lib",1,"cor",-1);
			outputText("\n\nYou feel suddenly invigorated by the potent beverage, like you could take on a whole horde of barbarians or giants and come out victorious!");
			player.HPChange(Math.round(player.maxHP()), false);
			dynStats("lus=", 20 + rand(6));
			if(rand(3) === 0) {
				outputText("\n\nThe alcohol fills your limbs with vigor, making you feel like you could take on the world with just your fists!");
				if(game.silly()) {
					outputText("  Maybe you should run around shirtless, drink, and fight!  Saxton Hale would be proud.");
				}
				dynStats("str",1);
			}
			else
			{
				outputText("\n\nYou thump your chest and grin - your foes will have a harder time taking you down while you\'re fortified by liquid courage.");
				dynStats("tou",1);
			}
			
			return false;
		}
		
		public  getMaxStackSize(): number {
			return 5;
		}
	}

