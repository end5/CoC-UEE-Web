
	export class KiteShield extends Shield
	{
		public  KiteShield(tier: number) 
		{
		var  ids: any[] = ["Kite Sh", "KiteSh1", "KiteSh2"];
		var  eqptNames: any[] = ["kiteshield", "fine kiteshield", "masterwork kiteshield"];
		var  longNames: any[] = ["a kiteshield", "a fine kiteshield", "a masterwork kiteshield"];
			this.weightCategory = Shield.WEIGHT_MEDIUM;
			this.tier = tier;
			super(ids[tier], "KiteShld", eqptNames[tier], longNames[tier], 10, 300, "A teardrop-shaped kiteshield made of durable wood.");
		}
		
	}

