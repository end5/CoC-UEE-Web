
	export class Flail extends Weapon
	{
		public  Flail(tier: number, degrades: boolean = false) 
		{
		var  ids: any[] = ["Flail  ", "Flail 1", "Flail 2", degrades ? "Flail O" : "Flail 3"];
		var  eqptNames: any[] = ["flail", "fine flail", "masterwork flail", degrades ? "obsidian-spiked flail" : "epic flail"];
		var  longNames: any[] = ["a flail", "a fine flail", "a masterwork flail", degrades ? "a flail spiked with obsidian tips" : "an epic flail"];
			this.weightCategory = Weapon.WEIGHT_MEDIUM;
			this.tier = tier;
			super(ids[tier], "Flail", eqptNames[tier], longNames[tier], "smash", 10, 200, "This is a flail, a weapon consisting of a metal spiked ball attached to a stick by chain. Be careful with this as you might end up injuring yourself if you don't pay attention to the spiked ball.", ""); 
		}
		
	}

