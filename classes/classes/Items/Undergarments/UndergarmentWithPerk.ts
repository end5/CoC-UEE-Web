	

	//Ebonweave makin me code new shit -w- ~Foxwells
	
	export class UndergarmentWithPerk extends Undergarment {
		private  _type: number;
		private  _perk: string;
		private  _name: string;
		private  playerPerk:PerkType;
		private  playerPerkV1: number;
		private  playerPerkV2: number;
		private  playerPerkV3: number;
		private  playerPerkV4: number;
		
		public  UndergarmentWithPerk(id: string, shortName: string, name: string, longName: string, undergarmentType: number, value: number, description: string, playerPerk:PerkType, playerPerkV1: number, playerPerkV2: number, playerPerkV3: number, playerPerkV4: number, playerPerkDesc: string = "", perk: string = "") {
			super(id, shortName, name, longName, undergarmentType, value, description, perk);
			this._type = undergarmentType;
			this._name = name;
			this._perk = perk;
			this.playerPerk = playerPerk;
			this.playerPerkV1 = playerPerkV1;
			this.playerPerkV2 = playerPerkV2;
			this.playerPerkV3 = playerPerkV3;
			this.playerPerkV4 = playerPerkV4;
		}
		
		public  get type(): number { return _type; }
		
		public  get perk(): string { return _perk; }
		
		public  get name(): string { return _name; }
		
		public  useText(): void {
			outputText("You equip " + longName + ". ");
		}
		
		public  playerEquip():Undergarment { //This item is being equipped by the player. Add any perks, etc.
			while (game.player.findPerk(playerPerk) >= 0) game.player.removePerk(playerPerk);
			game.player.createPerk(playerPerk, playerPerkV1, playerPerkV2, playerPerkV3, playerPerkV4);
			return super.playerEquip();
		}
		
		public  playerRemove():Undergarment { //This item is being removed by the player. Remove any perks, etc.
			while (game.player.findPerk(playerPerk) >= 0) game.player.removePerk(playerPerk);
			return super.playerRemove();
		}
		
		public  removeText(): void {} //Produces any text seen when removing the undergarment normally
		
		public  get description(): string {
		var  desc: string = super.description;
			//Perk
			desc += "\nSpecials: " + playerPerk.name;
			if (playerPerk == PerkLib.WizardsEndurance) desc += " (-" + playerPerkV1 + "% Spell Cost)";
			else if (playerPerk == PerkLib.WellspringOfLust) {
				if (game.player.lust < 50) {
					desc += " (+" + (50 - game.player.lust) + " lust)";
				}
			}
			else if (playerPerkV1 > 0) desc += " (Magnitude: " + playerPerkV1 + ")";
			return desc;
		}
		
		public  get armorDef(): number {
			switch(this.name) {
				case "runed Ebonweave jockstrap":
				case "runed Ebonweave thong":
				case "runed Ebonweave loincloth":
					return 3;
				default:
					return 0;
			}
		}
		
		public  get sexiness(): number {
			switch(this.name) {
				case "runed Ebonweave jockstrap":
				case "runed Ebonweave thong":
				case "runed Ebonweave loincloth":
					return 3;
				default:
					return 0;
			}
		}
		
		public  canUse(): boolean {
			if (!game.player.armor.supportsUndergarment) {
				outputText("It would be awkward to put on undergarments when you're currently wearing your type of clothing. You should consider switching to different clothes. You put it back into your inventory.");
				return false;
			}
			if (type == UndergarmentLib.TYPE_LOWERWEAR) {
				if (game.player.isBiped() || game.player.isGoo()) {
					return true; //It doesn't matter what leg type you have as long as you're biped.
				}
				else if (game.player.isTaur() || game.player.isDrider()) {
					outputText("Your form makes it impossible to put on any form of lower undergarments. You put it back into your inventory.");
					return false;
				}
				else if (game.player.isNaga()) {
					if (perk != "NagaWearable") {
						outputText("It's impossible to put on this undergarment as it's designed for someone with two legs. You put it back into your inventory.");
						return false;
					}
					else return true;
				}
			}
			return true;
		}
		
	}

