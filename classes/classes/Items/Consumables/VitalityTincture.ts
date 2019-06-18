	
	/**
	 * Item that increases STR and/or VIT
	 */
	export class VitalityTincture extends Consumable
	{
		private static  ITEM_VALUE: number = 15;
		
		public  VitalityTincture()
		{
			super("Vital T", "Vitality T.", "a vitality tincture", ITEM_VALUE, "This potent tea is supposedly good for the strengthening the body.");
		}
		
		public  useItem(): boolean
		{
		var  temp: number = 0;
			
			player.slimeFeed();
			clearOutput();
			outputText("You down the contents of the bottle. The liquid is thick and tastes remarkably like cherries. Within moments, you feel much more fit and healthy.");
			//str change
			temp = rand(3);
			game.dynStats("str", temp);
			//Garunteed toughness if no str
			if (temp === 0) {
				temp = rand(3);
				if (temp === 0) {
					temp = 1;
				}
			}
			else
			{
				temp = rand(3);
			}
			//tou change
			game.dynStats("tou", temp);
			//Chance of fitness change
			if (player.HPChange(50, false)) {
				outputText("  Any aches, pains and bruises you have suffered no longer hurt and you feel much better.");
			}
			
			if (rand(3) === 0) {
				outputText(player.modTone(95, 3));
			}
			player.refillHunger(10);
			
			return false;
		}
	}

