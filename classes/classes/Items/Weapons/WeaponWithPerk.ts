	
	export class WeaponWithPerk extends Weapon {
		private  playerPerk:PerkType;
		private  playerPerkV1: number;
		private  playerPerkV2: number;
		private  playerPerkV3: number;
		private  playerPerkV4: number;
		
		public  WeaponWithPerk(id: string, shortName: string, name: string, longName: string, verb: string, attack: number, value: number, description: string, perk: string, playerPerk:PerkType, playerPerkV1: number, playerPerkV2: number, playerPerkV3: number, playerPerkV4: number, playerPerkDesc: string = "")
		{
			super(id, shortName, name, longName, verb, attack, value, description, perk);
			this.playerPerk = playerPerk;
			this.playerPerkV1 = playerPerkV1;
			this.playerPerkV2 = playerPerkV2;
			this.playerPerkV3 = playerPerkV3;
			this.playerPerkV4 = playerPerkV4;
		}
		
		public  playerEquip():Weapon { //This item is being equipped by the player. Add any perks, etc.
			while (game.player.findPerk(playerPerk) >= 0) game.player.removePerk(playerPerk);
			game.player.createPerk(playerPerk, playerPerkV1, playerPerkV2, playerPerkV3, playerPerkV4);
			return super.playerEquip();
		}
		
		public  playerRemove():Weapon { //This item is being removed by the player. Remove any perks, etc.
			while (game.player.findPerk(playerPerk) >= 0) game.player.removePerk(playerPerk);
			return super.playerRemove();
		}
		
		public  get description(): string {
		var  desc: string = super.description;
			//Perk
			desc += "\nSpecial: " + playerPerk.name;
			if (playerPerk == PerkLib.WizardsFocus) desc += " (+" + playerPerkV1 * 100 + "% Spell Power)";
			else if (playerPerkV1 > 0) desc += " (Magnitude: " + playerPerkV1 + ")";
			return desc;
		}
		
	}

