	
	/**
	 * Triggers heat or rut and increases anal capacity.
	 */
	export class Coal extends Consumable 
	{
		public  Coal() 
		{
			super("Coal   ","Coal", "two pieces of coal", ConsumableLib.DEFAULT_VALUE, "These two pieces of coal may look ordinary but it makes you wonder what happens when you rub them.");
		}
		
		public  useItem(): boolean
		{
			changes = 0;
			clearOutput();
			outputText("You handle the coal rocks experimentally and they crumble to dust in your hands!  You cough as you breathe in the cloud, sputtering and wheezing.  After a minute of terrible coughing, you recover and realize there's no remaining trace of the rocks, not even a sooty stain on your hands!");
			//Try to go into intense heat
			if (player.goIntoHeat(true, 2)) {
				changes++;
			}
			//Males go into rut
			else if (player.goIntoRut(true)) {
				changes++;
			}
			else {
				//Boost anal capacity without gaping
				if (player.statusEffectv1(StatusEffects.BonusACapacity) < 80) {
					if (!player.hasStatusEffect(StatusEffects.BonusACapacity)) player.createStatusEffect(StatusEffects.BonusACapacity, 0, 0, 0, 0);
					player.addStatusValue(StatusEffects.BonusACapacity, 1, 5);
					outputText("\n\nYou feel... more accommodating somehow.  Your " + player.assholeDescript() + " is tingling a bit, and though it doesn't seem to have loosened, it has grown more elastic.");
					changes++;
				}
				else {
					outputText("\n\nYour whole body tingles for a moment but it passes.  It doesn't look like the coal can do anything to you at this point.");
				}
			}
			
			return false;
		}		
	}
