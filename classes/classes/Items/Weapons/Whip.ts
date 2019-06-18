
	export class Whip extends Weapon
	{
		public  Whip(tier: number) 
		{
		var  ids: any[] = ["Whip   ", "Whip  1", "Whip  2"];
		var  eqptNames: any[] = ["coiled whip", "fine coiled whip", "masterwork coiled whip"];
		var  longNames: any[] = ["a coiled whip", "a fine coiled whip", "a masterwork coiled whip"];
			this.weightCategory = Weapon.WEIGHT_LIGHT;
			this.tier = tier;
			super(ids[tier], "Whip", eqptNames[tier], longNames[tier], "whip-crack", 5, 500, "A coiled length of leather designed to lash your foes into submission. There's a chance the bondage inclined might enjoy it!", ""); 
		}
		
	}

