
	export class LargeAxe extends Weapon
	{
		public  LargeAxe(tier: number, degrades: boolean = false) 
		{
		var  ids: any[] = ["L. Axe ", "L. Axe1", "L. Axe2", degrades ? "L. AxeO" : "L. Axe3"];
		var  eqptNames: any[] = ["large axe", "fine large axe", "masterwork large axe", degrades ? "obsidian-reinforced large axe" : "epic large axe"];
		var  longNames: any[] = ["an axe", "a fine axe", "a masterwork axe", degrades ? "an obsidian-reinforced axe" : "an epic axe"];
			this.weightCategory = Weapon.WEIGHT_HEAVY;
			this.tier = tier;
			super(ids[tier], "L. Axe", eqptNames[tier], longNames[tier] + " large enough for a minotaur", "cleave", 15, 100, "This massive axe once belonged to a minotaur. It'd be hard for anyone smaller than a giant to wield effectively. The axe is double-bladed and deadly-looking. Requires height of 6'6\" or 80 strength.", Weapon.PERK_LARGE); 
		}
		
	}

