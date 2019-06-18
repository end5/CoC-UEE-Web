	
	export class SpikedGauntlet extends Weapon 
	{
		public  SpikedGauntlet(tier: number, degrades: boolean = false)
		{
		var  ids: any[] = ["S.Gaunt", "S.Gaun1", "S.Gaun2", degrades ? "S.GaunO" : "S.Gaun3"];
		var  eqptNames: any[] = ["spiked gauntlet", "fine spiked gauntlet", "masterwork spiked gauntlet", degrades ? "obsidian-spiked gauntlet" : "epic spiked gauntlet"];
		var  longNames: any[] = ["a spiked gauntlet", "a fine spiked gauntlet", "a masterwork spiked gauntlet", degrades ? "an obsidian-spiked gauntlet" : "an epic spiked gauntlet"];
			this.weightCategory = Weapon.WEIGHT_LIGHT;
			this.tier = tier;
			super(ids[tier], "S.Gaunt", eqptNames[tier], longNames[tier], "spiked punch", 5, 300, "This single metal gauntlet has the knuckles tipped with metal spikes. Though it lacks the damaging potential of other weapons, the sheer pain of its wounds has a chance of stunning your opponent.", ""); 
		}
		
		public  get attack(): number {
		var  amt: number = _attack + (_tier * 2);
			if (game.player.hasPerk(PerkLib.IronFists)) amt += 2;
			if (game.player.hasPerk(PerkLib.IronFists2)) amt += 1;
			if (game.player.hasPerk(PerkLib.IronFists3)) amt += 1;
			return amt;
		}
		
	}

