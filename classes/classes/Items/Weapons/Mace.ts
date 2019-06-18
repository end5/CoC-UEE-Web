
	export class Mace extends Weapon
	{
		public  Mace(tier: number, degrades: boolean = false) 
		{
		var  ids: any[] = ["Mace   ", "Mace  1", "Mace  2", degrades ? "Mace  O" : "Mace  3"];
		var  eqptNames: any[] = ["mace", "fine mace", "masterwork mace", degrades ? "obsidian-spiked mace" : "epic mace"];
		var  longNames: any[] = ["a mace", "a fine mace", "a masterwork mace", degrades ? "a mace spiked with obsidian" : "an epic mace"];
			this.weightCategory = Weapon.WEIGHT_MEDIUM;
			this.tier = tier;
			super(ids[tier], "Mace", eqptNames[tier], longNames[tier], "smash", 9, 100, "This is a mace, designed to be able to crush against various defenses.", ""); 
		}
		
	}

