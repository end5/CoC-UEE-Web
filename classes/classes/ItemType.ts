/**
 * Created by aimozg on 09.01.14.
 */

	export class ItemType extends Utils
	{
		private static  ITEM_LIBRARY:Dictionary = new Dictionary();
		private static  ITEM_SHORT_LIBRARY:Dictionary = new Dictionary();
		public static  NOTHING:ItemType = new ItemType("NOTHING!");

		/**
		 * Looks up item by <b>ID</b>.
		 * @param	id 7-letter string that identifies an item.
		 * @return  ItemType
		 */
		public static  lookupItem(id: string):ItemType{
			return ITEM_LIBRARY[id];
		}

		/**
		 * Looks up item by <b>shortName</b>.
		 * @param	shortName The short name that was displayed on buttons.
		 * @return  ItemType
		 */
		public static  lookupItemByShort(shortName: string):ItemType{
			return ITEM_SHORT_LIBRARY[shortName];
		}

		public static  getItemLibrary():Dictionary
		{
			return ITEM_LIBRARY;
		}

		private  _id: string;
		protected  _shortName: string;
		protected  _longName: string;
		protected  _description: string;
		protected  _value: number;

		protected  _degradable: boolean = false; //True indicates degrades in durability.
		protected  _durability: number = 0; //If it's greater than 0, when threshold is crossed, it will cause item to break.
		protected  _breaksInto:ItemType = undefined; //If the weapon breaks, turns into the specific item or vanish into nothing.
		
		/**
		 * Short name to be displayed on buttons
		 */
		public  get shortName(): string
		{
			return _shortName;
		}

		/**
		 * A full name of the item, to be described in text
		 */
		public  get longName(): string
		{
			return _longName;
		}

		/**
		 * Item base price
		 */
		public  get value(): number
		{
			return _value;
		}

		/**
		 * Detailed description to use on tooltips
		 */
		public  get description(): string
		{
			return _description;
		}

		/**
		 * 7-character unique (across all the versions) string, representing that item type.
		 */
		public  get id(): string
		{
			return _id;
		}

		public  ItemType(_id: string,_shortName: string=undefined,_longName: string=undefined,_value: number=0,_description: string=undefined)
		{

			this._id = _id;
			this._shortName = _shortName || _id;
			this._longName = _longName || this.shortName;
			this._description = _description || this.longName;
			this._value = _value;
			if (ITEM_LIBRARY[_id] != undefined) {
				CoC_Settings.error("Duplicate itemid "+_id+", old item is "+(ITEM_LIBRARY[_id] as ItemType).longName);
			}
			if (ITEM_SHORT_LIBRARY[this.shortName] != undefined){
				CoC_Settings.error("WARNING: Item with duplicate shortname: '"+_id+"' and '"+(ITEM_SHORT_LIBRARY[this.shortName] as ItemType)._id+"' share "+this.shortName);
			}
			ITEM_LIBRARY[_id] = this;
			ITEM_SHORT_LIBRARY[this.shortName] = this;
		}

		protected  appendStatsDifference(diff: number): string {
			if (diff > 0)
				return " (<font color=\"#007f00\">+" + String(Math.abs(diff)) + "</font>)";
			else if (diff < 0)
				return " (<font color=\"#7f0000\">-" + String(Math.abs(diff)) + "</font>)";
			else
				return "";
		}

		public  toString(): string
		{
			return "\""+_id+"\"";
		}
		
		public  getMaxStackSize(): number {
			return 5;
		}
		
		//Durability & Degradation system
		public  isDegradable(): boolean {
			return this._degradable;
		}
		
		public  set durability(newValue: number): void {
			if (newValue > 0) this._degradable = true;
			this._durability = newValue;
		}
		public  get durability(): number {
			return this._durability;
		}
		
		public  set degradesInto(newValue:ItemType): void {
			this._breaksInto = newValue;
		}
		public  get degradesInto():ItemType {
			return this._breaksInto;
		}
	}

