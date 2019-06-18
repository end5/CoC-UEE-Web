/**
 * Created by aimozg on 09.01.14.
 */

/**
	 * An item, that is consumed by player, and disappears after use. Direct subclasses should override "doEffect" method
	 * and NOT "useItem" method.
	 */
	export class Consumable extends Useable
	{
		protected  get mutations():Mutations { return kGAMECLASS.mutations; }
		protected  get changes(): number { return mutations.changes; }
		protected  set changes(val: number): void { mutations.changes = val; }
		protected  get changeLimit(): number { return mutations.changeLimit; }
		protected  set changeLimit(val: number): void { mutations.changeLimit = val; }

		protected  get output():Output { return kGAMECLASS.output; }
		protected  get credits():Credits { return kGAMECLASS.credits; }
		protected  get player():Player { return kGAMECLASS.player; }
		protected  get prison():Prison { return kGAMECLASS.prison; }
		protected  get flags():DefaultDict { return kGAMECLASS.flags; }
		protected  get camp():Camp { return kGAMECLASS.camp; }
		protected  tfChance(min: number, max: number): boolean { return mutations.tfChance(min, max); }
		protected  doNext(eventNo): void { kGAMECLASS.output.doNext(eventNo); }

		public  Consumable(id: string, shortName: string = undefined, longName: string = undefined, value: number = 0, description: string = undefined) {
			super(id, shortName, longName, value, description);
		}

		public  get description(): string {
		var  desc: string = _description;
			//Type
			desc += "\n\nType: Consumable ";
			if (shortName == "Wingstick") desc += "(Thrown)";
			if (shortName == "S.Hummus") desc += "(Cheat Item)";
			if (shortName == "BroBrew" || shortName == "BimboLq" || shortName == "P.Pearl") desc += "(Rare Item)";
			if (longName.indexOf("dye") >= 0) desc += "(Dye)";
			if (longName.indexOf("egg") >= 0) desc += "(Egg)";
			if (longName.indexOf("book") >= 0) desc += "(Magic Book)";
			//Value
			desc += "\nBase value: " + String(value);
			return desc;
		}
		
		/**
		 * Delegate function for legacy 'Mutations.as' code.
		 * @param	... args stat change parameters
		 */
		protected  dynStats(... args): void {
			game.dynStats.apply(undefined, args);
		}
		
		public  getMaxStackSize(): number {
			return 10;
		}
	}

