
	export class Crossbow extends Weapon
	{
		public  Crossbow(tier: number) 
		{
		var  ids: any[] = ["Crossbw", "Crsbow1", "Crsbow2"];
		var  eqptNames: any[] = ["crossbow", "fine crossbow", "masterwork crossbow"];
		var  longNames: any[] = ["a crossbow", "a fine crossbow", "a masterwork crossbow"];
			this.weightCategory = Weapon.WEIGHT_MEDIUM;
			this.tier = tier;
			super(ids[tier], "Crossbow", eqptNames[tier], longNames[tier], "shot", 11, 200, "This weapon fires bolts at your enemies with the pull of a lever. Speed has factor in damage rather than Strength.", Weapon.PERK_RANGED); 
		}
		
	}

