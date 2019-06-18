
	export class Ass implements Serializable
	{
		private static  SERIALIZATION_VERSION: number = 1;
		private static  SERIALIZATION_UUID: string = "0a3bd267-6ce0-4fed-a81b-53a4ccd6c17d";
		
		public static  WETNESS_DRY: number            =   0;
		public static  WETNESS_NORMAL: number         =   1;
		public static  WETNESS_MOIST: number          =   2;
		public static  WETNESS_SLIMY: number          =   3;
		public static  WETNESS_DROOLING: number       =   4;
		public static  WETNESS_SLIME_DROOLING: number =   5;

		public static  LOOSENESS_VIRGIN: number       =   0;
		public static  LOOSENESS_TIGHT: number        =   1;
		public static  LOOSENESS_NORMAL: number       =   2;
		public static  LOOSENESS_LOOSE: number        =   3;
		public static  LOOSENESS_STRETCHED: number    =   4;
		public static  LOOSENESS_GAPING: number       =   5;
		
		//data
		//butt wetness
		public  analWetness: number = 0;
		/*butt looseness
		0 - virgin
		1 - normal
		2 - loose
		3 - very loose
		4 - gaping
		5 - monstrous*/
		public  analLooseness: number = 0;
		//Used to determine thickness of knot relative to normal thickness
		//Used during sex to determine how full it currently is.  For multi-dick sex.
		public  fullness: number = 0;
		public  virgin: boolean = true; //Not used at the moment.
		
		public  validate(): string {
		var  error: string = "";
			error += Utils.validateNonNegativeNumberFields(this, "Ass.validate",[
					"analWetness", "analLooseness", "fullness"
			]);
			return error;
		}
		
		public  serialize(relativeRootObject: any): void 
		{
			relativeRootObject.analLooseness = this.analLooseness;
			relativeRootObject.analWetness = this.analWetness;
			relativeRootObject.fullness = this.fullness;
		}
		
		public  deserialize(relativeRootObject: any): void 
		{
			this.analLooseness = relativeRootObject.analLooseness;
			this.analWetness = relativeRootObject.analWetness;
			this.fullness = relativeRootObject.fullness;
		}
		
		public  upgradeSerializationVersion(relativeRootObject: any, serializedDataVersion: number): void 
		{
			// nothing to upgrade yet
		}
		
		public  currentSerializationVerison(): number 
		{
			return SERIALIZATION_VERSION;
		}
		
		public  serializationUUID(): string 
		{
			return SERIALIZATION_UUID;
		}
	}

