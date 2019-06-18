/**
 * Created by aimozg on 18.01.14.
 */

	export class ArmorWithPerk extends Armor {
		private  playerPerk:PerkType;
		private  playerPerkV1: number;
		private  playerPerkV2: number;
		private  playerPerkV3: number;
		private  playerPerkV4: number;
		private  playerPerk2:PerkType;
		private  playerPerk2V1: number;
		private  playerPerk2V2: number;
		private  playerPerk2V3: number;
		private  playerPerk2V4: number;
		
		public  ArmorWithPerk(id: string, shortName: string,name: string, longName: string, def: number, value: number, description: string, perk: string, playerPerk:PerkType, playerPerkV1: number, playerPerkV2: number, playerPerkV3: number, playerPerkV4: number, playerPerkDesc: string = "", playerPerk2:PerkType = undefined, playerPerk2V1: number = 0, playerPerk2V2: number = 0, playerPerk2V3: number = 0, playerPerk2V4: number = 0, playerPerk2Desc: string = "", supportsBulge: boolean = false, supportsUndergarment: boolean = true) {
			super(id, shortName, name, longName, def, value, description, perk, supportsBulge, supportsUndergarment);
			this.playerPerk = playerPerk;
			this.playerPerkV1 = playerPerkV1;
			this.playerPerkV2 = playerPerkV2;
			this.playerPerkV3 = playerPerkV3;
			this.playerPerkV4 = playerPerkV4;
			this.playerPerk2 = playerPerk2;
			this.playerPerk2V1 = playerPerk2V1;
			this.playerPerk2V2 = playerPerk2V2;
			this.playerPerk2V3 = playerPerk2V3;
			this.playerPerk2V4 = playerPerk2V4;
		}
		
		public  playerEquip():Armor { //This item is being equipped by the player. Add any perks, etc.
			while (game.player.findPerk(playerPerk) >= 0) game.player.removePerk(playerPerk);
			game.player.createPerk(playerPerk, playerPerkV1, playerPerkV2, playerPerkV3, playerPerkV4);
			if (playerPerk2 != undefined && game.player.findPerk(playerPerk2) >= 0) game.player.removePerk(playerPerk2);
			if (playerPerk2 != undefined) game.player.createPerk(playerPerk2, playerPerk2V1, playerPerk2V2, playerPerk2V3, playerPerk2V4);
			return super.playerEquip();
		}
		
		public  playerRemove():Armor { //This item is being removed by the player. Remove any perks, etc.
			while (game.player.findPerk(playerPerk) >= 0) game.player.removePerk(playerPerk);
			if (playerPerk2 != undefined && game.player.findPerk(playerPerk2) >= 0) game.player.removePerk(playerPerk2);
			return super.playerRemove();
		}

		public  get description(): string {
		var  desc: string = super.description;
			//Perk
			desc += "\nSpecials: " + playerPerk.name;
			if (playerPerk == PerkLib.WizardsEndurance) desc += " (-" + playerPerkV1 + "% Spell Cost)";
			else if (playerPerkV1 > 0) desc += " (Magnitude: " + playerPerkV1 + ")";
			//Second perk
			if (playerPerk2 != undefined) {
				desc += "\n" + playerPerk2.name;
				if (playerPerk2 == PerkLib.WizardsEndurance) desc += " (-" + playerPerk2V1 + "% Spell Cost)";
				else if (playerPerk2V1 > 0) desc += " (Magnitude: " + playerPerk2V1 + ")";
			}
			return desc;
		}
		
/*
		public  equipEffect(player:Player, output: boolean): void
		{
			if (player.findPerk(playerPerk) < 0)
				player.createPerk(playerPerk,playerPerkV1,playerPerkV2,playerPerkV3,playerPerkV4);
		}

		public  unequipEffect(player:Player, output: boolean): void
		{
			while(player.findPerk(playerPerk) >= 0) player.removePerk(playerPerk);
		}
*/
	}

