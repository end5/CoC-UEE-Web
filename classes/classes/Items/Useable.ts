/**
 * Created by aimozg on 09.01.14.
 */

	/**
	 * Represent item that can be used but does not necessarily disappears on use. Direct subclasses should overrride
	 * "useItem" method.
	 */
	export class Useable extends ItemType {
		
		public  Useable(id: string, shortName: string = undefined, longName: string = undefined, value: number = 0, description: string = undefined) {
			super(id, shortName, longName, value, description);
		}
		
		public  get game():CoC{
			return kGAMECLASS;
		}
		public  getGame():CoC{
			return kGAMECLASS;
		}

		public  clearOutput(): void{
			kGAMECLASS.clearOutput();
		}
		public  outputText(text: string): void {
			kGAMECLASS.outputText(text);
		}
		
		public  set description(newDesc: string): void {
			this._description = newDesc;
		}
		
		public  get description(): string {
		var  desc: string = _description;
			//Type
			desc += "\n\nType: ";
			if (shortName == "Condom" || shortName == "GldStat") desc += "Miscellaneous";
			else if (shortName == "Debug Wand") desc += "Miscellaneous (Cheat Item)";
			else desc += "Material";
			//Value
			desc += "\nBase value: " + String(value);
			return desc;
		}
		
		public  canUse(): boolean { return game.prison.prisonCanUseItem(this); } //If an item cannot be used it should provide some description of why not
		
		public  useItem(): boolean {
			CoC_Settings.errorAMC("Useable", "useItem", id);
			return(false);
		}
		
		public  useText(): void {} //Produces any text seen when using or equipping the item normally

		
	}

