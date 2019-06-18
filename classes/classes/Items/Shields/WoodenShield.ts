/**
 * ...
 * @author Melchi ...
 */
	
	export class WoodenShield extends Shield
	{
		
		public  WoodenShield() 
		{
			this.weightCategory = Shield.WEIGHT_LIGHT;
			super("WoodShl", "WoodShld", "wood shield", "a wooden shield", 6, 10, "A crude wooden shield. It doesn't look very sturdy");
		}
		
	}

