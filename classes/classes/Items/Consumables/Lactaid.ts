	/**
	 * Item that boosts lactation.
	 */
	export class Lactaid extends Consumable {
		public  Lactaid() {
			super("Lactaid","Lactaid", "a pink bottle labelled \"Lactaid\"", ConsumableLib.DEFAULT_VALUE, "Judging by the name printed on this bottle, 'Lactaid' probably has an effect on the ability to lactate, and you doubt that effect is a reduction.");
		}
		public  useItem(): boolean {
			clearOutput();
			player.slimeFeed();
		var  i: number = 0;
			outputText("You gulp down the bottle of lactaid, easily swallowing the creamy liquid.");
			if (player.averageBreastSize() < 8) { //Bump up size!
				outputText("\n\n");
				if (player.breastRows.length === 1) player.growTits((1 + rand(5)), 1, true, 1);
				else player.growTits(1 + rand(2), player.breastRows.length, true, 1);
			}
			if (player.biggestLactation() < 1) { //Player doesn't lactate
				outputText("\n\nYou feel your " + player.nippleDescript(0) + "s become tight and engorged.  A single droplet of milk escapes each, rolling down the curves of your breasts.  <b>You are now lactating!</b>");
				for (i = 0; i < player.breastRows.length; i++)
					player.breastRows[i].lactationMultiplier += 2;
			}
			else { //Boost lactation
				outputText("\n\nMilk leaks from your " + player.nippleDescript(0) + "s in thick streams.  You're lactating even more!");
				for (i = 0; i < player.breastRows.length; i++)
					player.breastRows[i].lactationMultiplier += 1 + rand(10) / 10;
			}
			dynStats("lus", 10);
			if (rand(3) === 0) outputText(player.modFem(95, 1));
			return false;
		}
	}

