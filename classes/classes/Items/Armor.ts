/**
 * Created by aimozg on 10.01.14.
 */

	export class Armor extends Useable //Equipable
	{
		public static  WEIGHT_LIGHT: string = "Light";
		public static  WEIGHT_MEDIUM: string = "Medium";
		public static  WEIGHT_HEAVY: string = "Heavy";
		
		private  _def: number;
		private  _perk: string;
		private  _name: string;
		private  _supportsBulge: boolean;
		private  _supportsUndergarment: boolean;
		private  _tier: number = 0; //Defaults to 0.
		
		public  Armor(id: string, shortName: string, name: string, longName: string, def: number, value: number = 0, description: string = undefined, perk: string = "", supportsBulge: boolean = false, supportsUndergarment: boolean = true) {
			super(id, shortName, longName, value, description);
			this._name = name;
			this._def = def;
			this._perk = perk;
			_supportsBulge = supportsBulge;
			_supportsUndergarment = supportsUndergarment;
		}
		
		public  get def(): number { return _def + _tier; }
		
		public  get perk(): string { return _perk; }
		
		public  get name(): string { return _name; }
		
		public  get supportsBulge(): boolean { return _supportsBulge && game.player.modArmorName == ""; }
			//For most clothes if the modArmorName is set then it's Exgartuan's doing. The comfortable clothes are the exception, they override this function.
		
		public  get supportsUndergarment(): boolean { return _supportsUndergarment; }
		
		public  get description(): string {
		var  desc: string = _description;
			switch(_tier) {
				case 1:
					desc += " This armour has been upgraded to be of fine quality.";
					break;
				case 2:
					desc += " This armour has been upgraded to be of masterwork quality.";
					break;
				default:
					desc += "";
			}
			//Type
			desc += "\n\nType: ";
			if (perk == "Light" || perk == "Medium" || perk == "Heavy") {
				desc += "Armor (" + perk + ")";
			} else if (perk == "Adornment") desc += "Adornment ";
			else desc += "Clothing ";
			//Defense
			desc += "\nDefense: " + String(def);
			desc += appendStatsDifference(def - (game.player.armor.def));
			//Value
			desc += "\nBase value: " + String(value);
			return desc;
		}
		
		public  canUse(): boolean {
			if (this.supportsUndergarment == false && (game.player.upperGarment != UndergarmentLib.NOTHING || game.player.lowerGarment != UndergarmentLib.NOTHING)) {
			var  output: string = "";
			var  wornUpper: boolean = false;

				output += "It would be awkward to put on " + longName + " when you're currently wearing ";
				if (game.player.upperGarment != UndergarmentLib.NOTHING) {
					output += game.player.upperGarment.longName;
					wornUpper = true;
				}

				if (game.player.lowerGarment != UndergarmentLib.NOTHING) {
					if (wornUpper) {
						output += " and ";
					}
					output += game.player.lowerGarment.longName;
				}

				output += ". You should consider removing them. You put it back into your inventory.";

				outputText(output);
				return false;
			}
			return super.canUse();
		}

		public  useText(): void {
			outputText("You equip " + longName + ".  ");
		}
		
		public  playerEquip():Armor { //This item is being equipped by the player. Add any perks, etc. - This function should only handle mechanics, not text output
			game.player.addToWornClothesArray(this);
			return this;
		}
		
		public  playerRemove():Armor { //This item is being removed by the player. Remove any perks, etc. - This function should only handle mechanics, not text output
			while (game.player.findPerk(PerkLib.BulgeArmor) >= 0) game.player.removePerk(PerkLib.BulgeArmor); //TODO remove this Exgartuan hack
			if (game.player.modArmorName.length > 0) game.player.modArmorName = "";
			return this;
		}
		
		public  removeText(): void {} //Produces any text seen when removing the armor normally
		
		public  getMaxStackSize(): number {
			return 1;
		}
	}

