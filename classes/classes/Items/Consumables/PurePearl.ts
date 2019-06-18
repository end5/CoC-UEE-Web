
	export class PurePearl extends Consumable
	{
		private static  ITEM_VALUE: number = 1000;
		
		public  PurePearl() 
		{
			super("P.Pearl","P.Pearl", "a pure pearl", ITEM_VALUE, "Marae gave you this pure pearl as a reward for shutting down the demonic factory.")
		}
		
		public  useItem(): boolean {
			clearOutput();
			if (player.findPerk(PerkLib.PurityBlessing) >= 0) {
				outputText("As you're about to cram the pearl into your mouth, your instincts remind you that you shouldn't waste the pearl since you already have the perk. You put it back into your pack. ");
				
			var  inventory:Inventory = game.inventory;
			var  consumables:ConsumableLib = game.consumables;
				
				inventory.takeItem(consumables.P_PEARL, inventory.inventoryMenu);
				return false;
			}
			
			outputText("You cram the pearl in your mouth and swallow it like a giant pill with some difficulty.  Surprisingly there is no discomfort, only a cool calming sensation that springs up from your core.");
			game.dynStats("lib", -5, "lus", -25, "cor", -10);
			player.createPerk(PerkLib.PurityBlessing, 0, 0, 0, 0);
			
			return false;
		}
	}

