
	export class Halberd extends Weapon
	{
		
		public  Halberd(tier: number, degrades: boolean = false) 
		{
		var  ids: any[] = ["Halberd", "Halbrd1", "Halbrd2", degrades ? "HalbrdO" : "Halbrd3"];
		var  eqptNames: any[] = ["halberd", "fine halberd", "masterwork halberd", degrades ? "obsidian-bladed halberd" : "epic halberd"];
		var  longNames: any[] = ["a halberd", "a fine halberd", "a masterwork halberd", degrades ? "an obsidian-bladed halberd" : "an epic halberd"];
			this.weightCategory = Weapon.WEIGHT_HEAVY;
			this.tier = tier;
			super(ids[tier], "Halberd", eqptNames[tier], longNames[tier], "slash", 11, 750, "Resembling a spear with a blade at the end, it's a long-reach melee weapon that can hit from a reasonable distance.", Weapon.PERK_LARGE); 
		}
		
	}

