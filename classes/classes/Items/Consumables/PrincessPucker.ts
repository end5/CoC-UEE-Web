	
	export class PrincessPucker extends Consumable 
	{
		public  PrincessPucker() 
		{
			super("PrnsPkr", "P.Pucker", "a vial of pinkish fluid", ConsumableLib.DEFAULT_VALUE, "A vial filled with a viscous pink liquid. A label reads \"Princess Pucker\".");
		}
		
		public  useItem(): boolean
		{
			clearOutput();
			
			outputText("You uncork the bottle, and sniff it experimentally.  The fluid is slightly pink, full of flecks of gold, and smelling vaguely of raspberries.  Princess Gwynn said it was drinkable.\n\n");

			outputText("You down the bottle, hiccuping a bit at the syrupy-sweet raspberry flavor.  Immediately following the sweet is a bite of sour, like sharp lime.  You pucker your lips, and feel your head clear a bit from the intensity of flavor.  You wonder what Gwynn makes this out of.\n\n");

			outputText("Echoing the sensation in your head is an answering tingle in your body.  The sudden shock of citrusy sour has left you slightly less inclined to fuck, a little more focused on your priorities.\n\n");
			
			if (rand(2) === 0)
			{
				dynStats("lus-", 20, "lib-", 2);
			}
			else
			{
				dynStats("lus-", 20, "sen-", 2);
			}
			
			if (player.hair.color !== "pink")
			{
				if (rand(5) === 0)
				{
					outputText("A slight tingle across your scalp draws your attention to your hair.  It seems your " + player.hair.color + " is rapidly gaining a distinctly pink hue, growing in from the roots!\n\n");
					player.hair.color = "pink";
				}
			}
			player.refillHunger(15);
			
			return false;
		}
	}

