/**
 * Created by aimozg on 31.01.14.
 */

	export class StatusEffectType
	{
			private static  STATUSAFFECT_LIBRARY:Dictionary = new Dictionary();
		private  arity: number;

			public static  lookupStatusEffect(id: string):StatusEffectType{
				return STATUSAFFECT_LIBRARY[id];
			}

			public static  getStatusEffectLibrary():Dictionary
			{
				return STATUSAFFECT_LIBRARY;
			}

			private  _id: string;

			/**
			 * Unique perk id, should be kept in future game versions
			 */
			public  get id(): string
			{
				return _id;
			}

		private  _secClazz:Class;

		/**
		 * @param id Unique status effect id; should persist between game version
		 * @param clazz Class to create instances of
		 * @param arity Class constructor arity: 0: new clazz(), 1: new clazz(thiz:StatusEffectType)
		 */
			public  StatusEffectType(id: string,clazz:Class,arity: number)
			{
				this._id = id;
				this.arity = arity;
				this._secClazz = clazz;
				if (STATUSAFFECT_LIBRARY[id] != undefined) {
					CoC_Settings.error("Duplicate status affect "+id);
				}
				STATUSAFFECT_LIBRARY[id] = this;
				if (!(arity >=0 && arity <= 1)) throw new Error("Unsupported status effect '"+id+"' constructor arity "+arity);
			}

		public  create(value1: number, value2: number, value3: number, value4: number):StatusEffect {
		var  sec:StatusEffect;
			if (arity == 0) sec = new _secClazz();
			else if (arity == 1) sec = new _secClazz(this);
			sec.value1 = value1;
			sec.value2 = value2;
			sec.value3 = value3;
			sec.value4 = value4;
			return sec;
		}


			public  toString(): string
			{
				return "\""+_id+"\"";
			}
		}

