	
	export class HookedGauntlet extends Weapon
	{
		public  HookedGauntlet(tier: number, degrades: boolean = false)
		{
		var  ids: any[] = ["H.Gaunt", "H.Gaun1", "H.Gaun2", degrades ? "H.GaunO" : "H.Gaun3"];
		var  eqptNames: any[] = ["hooked gauntlets", "fine hooked gauntlets", "masterwork hooked gauntlets", degrades ? "obsidian-hooked gauntlets" : "epic hooked gauntlets"];
		var  longNames: any[] = ["a set of hooked gauntlets", "a set of fine hooked gauntlets", "a set of masterwork gauntlets", degrades ? "a set of obsidian-hooked gauntlets" : "a set of epic hooked gauntlets"];
			this.weightCategory = Weapon.WEIGHT_LIGHT;
			this.tier = tier;
			super(ids[tier], "H.Gaunt", eqptNames[tier], longNames[tier], "clawing punch", 8, 400, "These metal gauntlets are fitted with bone spikes and hooks shaped like shark teeth that are sure to tear at your foes flesh and cause them harm.", ""); 
		}
		
		public  get attack(): number {
		var  amt: number = _attack + (_tier * 2);
			if (game.player.hasPerk(PerkLib.IronFists)) amt += 2;
			if (game.player.hasPerk(PerkLib.IronFists2)) amt += 1;
			if (game.player.hasPerk(PerkLib.IronFists3)) amt += 1;
			return amt;
		}
		
	}

