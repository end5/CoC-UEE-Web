
	export class Katana extends Weapon
	{
		public  Katana(tier: number, degrades: boolean = false) 
		{
		var  ids: any[] = ["Katana ", "Katana1", "Katana2", degrades ? "KatanaO" : "Katana3"];
		var  eqptNames: any[] = ["katana", "fine katana", "masterwork katana", degrades ? "obsidian-lined katana" : "epic katana"];
		var  longNames: any[] = ["a katana", "a fine katana", "a masterwork katana", degrades ? "an obsidian-lined katana" : "an epic katana"];
			this.weightCategory = Weapon.WEIGHT_MEDIUM;
			this.tier = tier;
			super(ids[tier], "Katana", eqptNames[tier], longNames[tier], "keen cut", 10, 500, "A curved bladed weapon that cuts through flesh with the greatest of ease.", ""); 
		}
		
	}

