	
	/**
	 * Moderate boost to HP.
	 * 
	 * Retro UTG stuff!
	 */
	export class HealPill extends Consumable 
	{
		public  HealPill() 
		{
			super("H. Pill", "Heal Pill", "a small healing pill", ConsumableLib.DEFAULT_VALUE, "A small healing pill that's guaranteed to heal you by a bit.");
		}
		
		public  useItem(): boolean
		{
		var  rand: number = Math.random() * 100;
			outputText("You pop the small pill into your mouth and swallow. ");
			
			if (player.HPChange(50 + player.tou, true)) {
				outputText("Some of your wounds are healed. ");
			}
			else
			{
				outputText("You feel an odd sensation. ");
			}
			
			if (rand < 70 && player.lib < 40) {
				outputText("You feel a sense of warmth spread through your erogenous areas.");
				dynStats("lib", 1);
			}
			
			if (rand >= 70 && rand <= 90) {
				outputText("Your body tingles and feels more sensitive.");
				dynStats("sens", 4);
			}
			
			if (rand > 90) {
				outputText("You shudder as a small orgasm passes through you. When you recover you actually feel more aroused.");
				dynStats("lus", 5);
			}
			
			return false;
		}
		
		public  getMaxStackSize(): number {
			return 5;
		}
	}

