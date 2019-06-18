/**
 * Created by aimozg on 10.01.14.
 */

	export class LargeClaymore extends Weapon 
	{
		public  LargeClaymore(tier: number, degrades: boolean = false) 
		{
		var  ids: any[] = ["Claymor", "Claymr1", "Claymr2", degrades ? "ClaymrO" : "Claymr3"];
		var  eqptNames: any[] = ["large claymore", "fine claymore", "masterwork claymore", degrades ? "obsidian-lined claymore" : "epic claymore"];
		var  longNames: any[] = ["a large claymore", "a fine claymore", "a masterwork claymore", degrades ? "an obsidian-bladed claymore" : "an epic claymore"];
			this.weightCategory = Weapon.WEIGHT_HEAVY;
			this.tier = tier;
			super(ids[tier], "L.Claymore", eqptNames[tier], longNames[tier], "cleaving sword-slash", 15, 1000, "A massive sword that a very strong warrior might use. Requires 40 strength to use.", Weapon.PERK_LARGE); 
		}
		
		public  canUse(): boolean {
			if (game.player.str >= 40) return true;
			outputText("You aren't strong enough to handle such a heavy weapon! ");
			return false;
		}
		
	}

