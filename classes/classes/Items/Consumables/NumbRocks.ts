	
	/**
	 * Lower lust significantly but has a chance of inducing the masturbation preventing effect from minotaur.
	 */
	export class NumbRocks extends Consumable 
	{
		private static  ITEM_VALUE: number = 15;
		
		public  NumbRocks() 
		{
			super("NumbRox","Numb Rox", "a strange packet of candy called 'Numb Rocks'", ITEM_VALUE, "This packet of innocuous looking 'candy' guarantees to reduce troublesome sensations and taste delicious.");
		}
		
		public  useItem(): boolean
		{
			clearOutput();
			outputText("You pop open the package of numb rocks and dump it into your waiting mouth.  The strange candy fizzes and pops, leaving the nerves on your tongue feeling a bit deadened as you swallow the sweet mess.");

			if (player.lust >= 33) {
				outputText("\n\nThe numbness spreads through your body, bringing with it a sense of calm that seems to muffle your sexual urges.");
				player.lust -= 20 + rand(40);
			}
			
			if (rand(5) === 0) {
				if (!player.hasStatusEffect(StatusEffects.Dysfunction)) {
					outputText("\n\nUnfortunately, the skin of ");
					if (player.cockTotal() > 0) {
						outputText(player.sMultiCockDesc());
						if (player.hasVagina()) outputText(" and");
						outputText(" ");
					}
					if (player.hasVagina()) {
						if (!player.hasCock()) outputText("your ");
						outputText(player.vaginaDescript(0) + " ");
					}
					if (!(player.hasCock() || player.hasVagina())) outputText(player.assholeDescript() + " ");
					outputText(" numbs up too.  You give yourself a gentle touch, but are quite disturbed when you realize you can barely feel it.  You can probably still fuck something to get off, but regular masturbation is out of the question...");
					player.createStatusEffect(StatusEffects.Dysfunction, 50 + rand(100), 0, 0, 0);
				}
				else {
					outputText("\n\nSadly your groin becomes even more deadened to sensation.  You wonder how much longer you'll have to wait until you can please yourself again.");
					player.addStatusValue(StatusEffects.Dysfunction, 1, 50 + rand(100));
				}
			}
			else if (rand(4) === 0 && player.inte > 15) {
				outputText("\n\nNumbness clouds your mind, making you feel slow witted and dull.  Maybe these candies weren't such an exceptio... fantas... good idea.");
				dynStats("int", -(1 + rand(5)));
			}
			if (player.findPerk(PerkLib.ThickSkin) < 0 && player.sens100 < 30 && rand(4) === 0) {
				outputText("Slowly, ");
				if (player.hasPlainSkin()) outputText("your skin");
				else outputText("the skin under your " + player.skin.desc);
				outputText(" begins to feel duller, almost... thicker.  You pinch yourself and find that your epidermis feels more resistant to damage, almost like natural armor!\n<b>(Thick Skin - Perk Gained!)</b>");
				player.createPerk(PerkLib.ThickSkin, 0, 0, 0, 0);
			}
			outputText("\n\nAfter the sensations pass, your " + player.skin.desc + " feels a little less receptive to touch.");
			dynStats("sen", -3);
			if (player.sens < 1) player.sens = 1;
			player.refillHunger(20);	
			
			return false;
		}
	}

