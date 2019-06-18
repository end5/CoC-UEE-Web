/**
 * Created by aimozg on 09.01.14.
 */

	export class Weapon extends Useable //Equipable
	{
		public static  WEIGHT_LIGHT: string = "Light";
		public static  WEIGHT_MEDIUM: string = "Medium";
		public static  WEIGHT_HEAVY: string = "Heavy";
		
		public static  PERK_LARGE: string = "Large";
		public static  PERK_RANGED: string = "Ranged";
		public static  PERK_APHRODISIAC: string = "Aphrodisiac Weapon";
		
		protected  _verb: string;
		protected  _attack: number;
		protected  _perk: string;
		protected  _name: string;
		protected  _weight: string = WEIGHT_MEDIUM; //Defaults to medium
		protected  _tier: number = 0; //Defaults to 0.
		
		public  Weapon(id: string, shortName: string, name: string,longName: string, verb: string, attack: number, value: number = 0, description: string = undefined, perk: string = "") {
			super(id, shortName, longName, value, description);
			this._name = name;
			this._verb = verb;
			this._attack = attack;
			this._perk = perk;
		}
		
		public  get verb(): string { return _verb; }
		
		public  get attack(): number { return _attack + (_tier * 2); }
		
		public  get perk(): string { return _perk; }
		
		public  get name(): string { return _name; }
		
		public  get value(): number {
			return this._value * (1 + (_tier / 2));
		}
		
		public  get shortName(): string {
		var  sn: string = this._shortName;
			if (_tier > 0 && !isObsidian()) sn += "+" + _tier;
			if (isObsidian()) sn = "Ob." + sn; //For obsidian weapons, unless specified.
			return sn;
		}
		
		public  get description(): string {
		var  desc: string = _description;
			switch(_tier) {
				case 1:
					desc += " This weapon has been upgraded to be of fine quality.";
					break;
				case 2:
					desc += " This weapon has been upgraded to be of masterwork quality.";
					break;
				case 3:
					if (_degradable) desc += "This weapon has been enhanced with reinforced obsidian " + (isSharp() ? "lining its blade that could deliver sharper blows" : "spikes carefully attached to deliver more painful attacks") + ".";
					else desc += " This weapon has been upgraded to be of epic quality and takes on a more fearsome look.";
					break;
				default:
					desc += "";
			}
			//Type
			desc += "\n\nType: " + _weight + " Weapon ";
			if (perk == "Large") desc += "(Large)";
			else if (name.indexOf("staff") >= 0) desc += "(Staff)";
			else if (verb.indexOf("whip") >= 0) desc += "(Whip)";
			else if (verb.indexOf("punch") >= 0) desc += "(Gauntlet)";
			else if (verb == "shot") desc += "(Ranged)";
			else if (verb == "slash" || verb == "keen cut") desc += "(Sword)";
			else if (verb == "stab") desc += "(Dagger)";
			else if (verb == "smash") desc += "(Blunt)";
			//Attack
			desc += "\nAttack: " + String(attack);
			desc += appendStatsDifference(attack - (game.player.weapon.attack));
			//Value
			desc += "\nBase value: " + String(value);
			return desc;
		}
		
		public  useText(): void {
			outputText("You equip " + longName + ".  ");
			if (perk == "Large" && game.player.shield != ShieldLib.NOTHING && !(game.player.hasPerk(PerkLib.TitanGrip) && game.player.str >= 90)) {
				outputText("Because the weapon requires the use of two hands, you have unequipped your shield. ");
			}
		}
		
		public  canUse(): boolean {
			return true;
		}
		
		public  playerEquip():Weapon { //This item is being equipped by the player. Add any perks, etc. - This function should only handle mechanics, not text output
			if (perk == "Large" && game.player.shield != ShieldLib.NOTHING && !(game.player.hasPerk(PerkLib.TitanGrip) && game.player.str >= 90)) {
				game.inventory.unequipShield();
			}
			return this;
		}
		
		public  playerRemove():Weapon { //This item is being removed by the player. Remove any perks, etc. - This function should only handle mechanics, not text output
			return this;
		}
		
		public  removeText(): void {} //Produces any text seen when removing the armor normally
		
		public  getMaxStackSize(): number {
			return 1;
		}
		
		public  set tier(num: number): void {
			this._tier = num;
		}
		public  get tier(): number {
			return this._tier;
		}
		
		public  set weightCategory(newWeight: string): void {
			this._weight = newWeight;
		}
		public  get weightCategory(): string {
			return this._weight;
		}
		
		//For possible condition checking
		public  isObsidian(): boolean {
			return this.longName.toLowerCase().indexOf("obsidian") >= 0;
		}
		public  isSharp(): boolean {
			return (verb == "slash" || verb == "keen cut" || verb == "stab");
		}
		
		//For obsidian and breakable weapons.
		public  setDegradation(durability: number, weaponToDegradeInto:ItemType):Weapon {
			this._degradable = true;
			this._durability = durability;
			this._breaksInto = weaponToDegradeInto;
			return this;
		}
		
	}

