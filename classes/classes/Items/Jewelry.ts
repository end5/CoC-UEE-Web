/**
 * Created by Kitteh6660 on 08.29.14.
 */

	export class Jewelry extends Useable
	{
		private  _effectId: number;
		private  _effectMagnitude: number;
		private  _perk: string;
		private  _name: string;

		public  Jewelry(id: string, shortName: string, name: string, longName: string, effectId: number, effectMagnitude: number, value: number = 0, description: string = undefined, type: string = "", perk: string = "")
		{
			super(id, shortName, longName, value, description);
			this._name = name;
			this._effectId = effectId;
			this._effectMagnitude = effectMagnitude;
			this._perk = perk;
		}

		public  get effectId(): number { return _effectId; }

		public  get effectMagnitude(): number { return _effectMagnitude; }
		
		public  get perk(): string { return _perk; }

		public  get name(): string { return _name; }
		
		public  get description(): string {
		var  desc: string = _description;
			//Type
			desc += "\n\nType: Ring ";
			//Special
			if (_effectId > 0){ desc += "\nSpecial: ";
			switch(_effectId) {
				case JewelryLib.MODIFIER_MINIMUM_LUST:
					if (_effectMagnitude >= 0)
						desc += "Increases minimum lust by " + _effectMagnitude + ".";
					else
						desc += "Reduces minimum lust by " + (-_effectMagnitude) + ".";
					break;
				case JewelryLib.MODIFIER_FERTILITY:
					desc += "Increases cum production by " + _effectMagnitude + "% and fertility by " + _effectMagnitude + ".";
					break;
				case JewelryLib.MODIFIER_CRITICAL:
					desc += "Increases critical chance by " + _effectMagnitude + "%.";
					break;
				case JewelryLib.MODIFIER_REGENERATION:
					desc += "Grants regeneration of " + _effectMagnitude + " HP per turn. Effect doubled outside of combat.";
					break;
				case JewelryLib.MODIFIER_HP:
					desc += "Increases maximum HP by " + _effectMagnitude + "."
					break;
				case JewelryLib.MODIFIER_ATTACK_POWER:
					desc += "Increases attack power by " + _effectMagnitude + "%."
					break;
				case JewelryLib.MODIFIER_SPELL_POWER:
					desc += "Increases spellpower by " + _effectMagnitude + "%, applies additively."
					break;
				case JewelryLib.PURITY:
					desc += "Slowly decreases the corruption of the wearer over time. Reduces minimum libido by " + _effectMagnitude + ".";
					break;
				case JewelryLib.CORRUPTION:
					desc += "Slowly corrupts the wearer over time.";
					break;
				default:
					desc += "You shouldn't see this line at all. Something must be wrong with the coding.";
				}
			}
			//Value
			desc += "\nBase value: " + String(value);
			return desc;
		}
		
		public  useText(): void {
			outputText("You equip " + longName + ".  ");
		}
		
		public  playerEquip():Jewelry { //This item is being equipped by the player. Add any perks, etc. - This function should only handle mechanics, not text output
			return this;
		}
		
		public  playerRemove():Jewelry { //This item is being removed by the player. Remove any perks, etc. - This function should only handle mechanics, not text output
			return this;
		}
		
		public  removeText(): void {} //Produces any text seen when removing the armor normally
	}

