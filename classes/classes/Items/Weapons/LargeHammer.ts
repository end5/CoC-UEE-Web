/**
 * Created by aimozg on 10.01.14.
 */

	export class LargeHammer extends Weapon 
	{
		public  LargeHammer(tier: number, degrades: boolean = false) 
		{
		var  ids: any[] = ["L.Hammr", "L.Hamr1", "L.Hamr2", degrades ? "L.HamrO" : "L.Hamr3"];
		var  eqptNames: any[] = ["large hammer", "fine large hammer", "masterwork large hammer", degrades ? "obsidian-spiked large hammer" : "epic large hammer"];
		var  longNames: any[] = ["Marble's large hammer", "a fine, large hammer", "a masterwork, large hammer", degrades ? "an obsidian-spiked large hammer" : "an epic, large hammer"];
			this.weightCategory = Weapon.WEIGHT_HEAVY;
			this.tier = tier;
			super(ids[tier], "L.Hammer", eqptNames[tier], longNames[tier], "smash", 16, 90, "This two-handed warhammer looks pretty devastating. You took it from Marble after she refused your advances.", Weapon.PERK_LARGE); 
		}
		
		public  canUse(): boolean {
			if (game.player.tallness >= 60) return true;
			outputText("This hammer is too large for you to wield effectively. ");
			return false;
		}
		
	}

