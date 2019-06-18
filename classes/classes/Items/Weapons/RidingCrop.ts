
	export class RidingCrop extends Weapon
	{
		public  RidingCrop(tier: number) 
		{
		var  ids: any[] = ["RidingC", "Riding1", "Riding2"];
		var  eqptNames: any[] = ["riding crop", "fine riding crop", "masterwork riding crop"];
		var  longNames: any[] = ["a riding crop", "a fine riding crop", "a masterwork riding crop"];
			this.weightCategory = Weapon.WEIGHT_LIGHT;
			this.tier = tier;
			super(ids[tier], "RidingC", eqptNames[tier], longNames[tier], "whip-crack", 5, 50, "This riding crop appears to be made of black leather, and could be quite a painful (or exciting) weapon.", ""); 
		}
		
	}

