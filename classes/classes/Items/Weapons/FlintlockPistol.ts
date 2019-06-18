
	export class FlintlockPistol extends Weapon
	{
		public  FlintlockPistol(tier: number) 
		{
		var  ids: any[] = ["Flintlk", "Flntlk1", "Flntlk2"];
		var  eqptNames: any[] = ["flintlock pistol", "fine flintlock pistol", "masterwork flintlock pistol"];
		var  longNames: any[] = ["a flintlock pistol", "a fine flintlock pistol", "a masterwork flintlock pistol"];
			this.weightCategory = Weapon.WEIGHT_LIGHT;
			this.tier = tier;
			super(ids[tier], "Flintlock", eqptNames[tier], longNames[tier], "shot", 14, 250, "A flintlock pistol. Pew pew pew. Can fire once before a reload is required and Speed has a factor in damage instead of Strength.", Weapon.PERK_RANGED); 
		}
		
	}

