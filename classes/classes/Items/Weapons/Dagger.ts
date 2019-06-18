
	export class Dagger extends Weapon
	{
		public  Dagger(tier: number, degrades: boolean = false) 
		{
		var  ids: any[] = ["Dagger ", "Dagger1", "Dagger2", degrades ? "DaggerO" : "Dagger3"];
		var  eqptNames: any[] = ["dagger", "fine dagger", "masterwork dagger", degrades ? "obsidian dagger" : "epic dagger"];
		var  longNames: any[] = ["a short dagger", "a fine dagger", "a masterwork dagger", degrades ? "an obsidian-bladed dagger" : "an epic dagger"];
			this.weightCategory = Weapon.WEIGHT_LIGHT;
			this.tier = tier;
			super(ids[tier], "Dagger", eqptNames[tier], longNames[tier], "stab", 3, 150, "A small blade easily held in one hand. Lightweight and easy to conceal, it's the preferred weapon among the stealthy type. Has increased critical chance.", ""); 
		}
		
	}

