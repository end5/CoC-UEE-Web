/**
 * Created by aimozg on 26.01.14.
 */


	export class PerkType extends BaseContent
	{
		private static  PERK_LIBRARY:Dictionary = new Dictionary();

		public static  lookupPerk(id: string):PerkType{
			return PERK_LIBRARY[id];
		}

		public static  getPerkLibrary():Dictionary
		{
			return PERK_LIBRARY;
		}

		private  _id: string;
		private  _name: string;
		private  _desc: string;
		private  _longDesc: string;
		private  _keepOnAscension: boolean;
		public  defaultValue1: number = 0;
		public  defaultValue2: number = 0;
		public  defaultValue3: number = 0;
		public  defaultValue4: number = 0;

		/**
		 * Unique perk id, should be kept in future game versions
		 */
		public  get id(): string
		{
			return _id;
		}

		/**
		 * Perk short name, could be changed in future game versions
		 */
		public  get name(): string
		{
			return _name;
		}

		/**
		 * Short description used in perk listing
		 */
		public  desc(params:Perk=undefined): string
		{
			return _desc;
		}

		/**
		 * Long description used when offering perk at levelup
		 */
		public  get longDesc(): string
		{
			return _longDesc;
		}

		public  keepOnAscension(respec: boolean = false): boolean
		{
			if (_keepOnAscension)
				return true;

			return _longDesc != _desc && !respec; // dirty condition
		}

		public  PerkType(id: string,name: string,desc: string,longDesc: string = undefined,keepOnAscension: boolean = false)
		{
			this._id = id;
			this._name = name;
			this._desc = desc;
			this._longDesc = longDesc || _desc;
			this._keepOnAscension = keepOnAscension;
			if (PERK_LIBRARY[id] != undefined) {
				CoC_Settings.error("Duplicate perk id "+id+", old perk is "+(PERK_LIBRARY[id] as PerkType)._name);
			}
			PERK_LIBRARY[id] = this;
		}


		public  toString(): string
		{
			return "\""+_id+"\"";
		}

		/**
		 * Array of: any {
		 *   fn: (Player)=>Boolean,
		 *   text: string,
		 *   type: string
		 *   // additional depending on type
		 * }
		 */
		public  requirements: any[] = [];

		/**
		 * @return "requirement1, requirement2, ..."
		 */
		public  allRequirementDesc(): string {
		var  s: any[] = [];
			for each (var c: Record<string, any> in requirements) {
				if (c.text) s.push(c.text);
			}
			return s.join(", ");
		}
		public  available(player:Player): boolean {
			for each (var c: Record<string, any> in requirements) {
				if (!c.fn(player)) return false;
			}
			return true;
		}

		public  requireCustomFunction(playerToBoolean, requirementText: string, internalType: string = "custom"):PerkType {
			requirements.push({
				fn  : playerToBoolean,
				text: requirementText,
				type: numberernalType
			});
			return this;
		}

		public  requireLevel(value: number):PerkType {
			requirements.push({
				fn  : fnRequireAttr("level", value),
				text: "Level " + value,
				type: "level",
				value: value
			});
			return this;
		}
		public  requireStr(value: number):PerkType {
			requirements.push({
				fn  : fnRequireAttr("str", value),
				text: "Strength " + value,
				type: "attr",
				attr: "str",
				value: value
			});
			return this;
		}
		public  requireTou(value: number):PerkType {
			requirements.push({
				fn  : fnRequireAttr("tou", value),
				text: "Toughness " + value,
				type: "attr",
				attr: "tou",
				value: value
			});
			return this;
		}
		public  requireSpe(value: number):PerkType {
			requirements.push({
				fn  : fnRequireAttr("spe", value),
				text: "Speed " + value,
				type: "attr",
				attr: "spe",
				value: value
			});
			return this;
		}
		public  requireInt(value: number):PerkType {
			requirements.push({
				fn  : fnRequireAttr("inte", value),
				text: "Intellect " + value,
				type: "attr",
				attr: "inte",
				value: value
			});
			return this;
		}
		public  requireWis(value: number):PerkType {
			requirements.push({
				fn  : fnRequireAttr("wis", value),
				text: "Wisdom " + value,
				type: "attr",
				attr: "wis",
				value: value
			});
			return this;
		}
		public  requireLib(value: number):PerkType {
			requirements.push({
				fn  : fnRequireAttr("lib", value),
				text: "Libido " + value,
				type: "attr",
				attr: "lib",
				value: value
			});
			return this;
		}
		public  requireCor(value: number):PerkType {
			requirements.push({
				fn  : function(player:Player): boolean {
					return player.isCorruptEnough(value);
				},
				text: "Corruption &gt; " + value,
				type: "attr-gt",
				attr: "cor",
				value: value
			});
			return this;
		}
		public  requireLibLessThan(value: number):PerkType {
			requirements.push({
				fn  : function(player:Player): boolean {
					return player.lib < value;
				},
				text: "Libido &lt; " + value,
				type: "attr-lt",
				attr: "lib",
				value: value
			});
			return this;
		}
		public  requireNGPlus(value: number):PerkType {
			requirements.push({
				fn  : function(player:Player): boolean {
					return player.newGamePlusMod() >= value;
				},
				text: "New Game+ " + value,
				type: "ng+",
				value: value
			});
			return this;
		}
		/* [INTREMOD: xianxia]
		public  requirePrestigeJobSlot():PerkType {
			requirements.push({
				fn  : function(player:Player): boolean {
					return player.maxPrestigeJobs() > 0;
				},
				text: "Free Prestige Job Slot",
				type: "prestige"
			});
			return this;
		}
		*/
		public  requireHungerEnabled():PerkType {
			requirements.push({
				fn  : function(player:Player): boolean {
					return kGAMECLASS.flags[kFLAGS.HUNGER_ENABLED] > 0;
				},
				text: "Hunger enabled",
				type: "hungerflag"
			});
			return this;
		}
		public  requireMinLust(value: number):PerkType {
			requirements.push({
				fn  : function(player:Player): boolean {
					return player.minLust() >= value;
				},
				text: "Min. Lust "+value,
				type: "minlust",
				value: value
			});
			return this;
		}
		/* [INTERMOD: xianxia]
		public  requireMaxSoulforce(value: number):PerkType {
			requirements.push({
				fn  : function(player:Player): boolean {
					return player.maxSoulforce() >= value;
				},
				text: "Max. Soulforce "+value,
				type: "soulforce",
				value: value
			});
			return this;
		}
		*/
		private  fnRequireAttr(attrname: string,value: number) {
			return function(player:Player): boolean {
				return player[attrname] >= value;
			};
		}
		public  requireStatusEffect(effect:StatusEffectType, text: string):PerkType {
			requirements.push({
				fn  : function (player:Player): boolean {
					return player.hasStatusEffect(effect);
				},
				text: text,
				type: "effect",
				effect: effect
			});
			return this;
		}
		public  requirePerk(perk:PerkType):PerkType {
			requirements.push({
				fn  : function (player:Player): boolean {
					return player.findPerk(perk) >= 0;
				},
				text: perk.name,
				type: "perk",
				perk: perk
			});
			return this;
		}
		public  requireAnyPerk(...perks: any[]):PerkType {
			if (perks.length == 0) throw ("Incorrect call of requireAnyPerk() - should NOT be empty");
		var  text: any[] = [];
			for each (var perk:PerkType in perks) {
				text.push(perk.allRequirementDesc());
			}
			requirements.push({
				fn  : function (player:Player): boolean {
					for each (var perk:PerkType in perks) {
						if (player.findPerk(perk) >= 0) return true;
					}
					return false;
				},
				text: text.join(" or "),
				type: "anyperk",
				perks: perks
			});
			return this;
		}
	}

