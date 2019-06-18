
	export class Vagina implements Serializable
	{
		private static  SERIALIZATION_VERSION: number = 1;
		private static  SERIALIZATION_UUID: string = "cfe61f89-7ab6-4e4b-83aa-33f738dd2f05";
		
		public static  HUMAN: number                     =   0;
		public static  EQUINE: number                    =   1;
		public static  BLACK_SAND_TRAP: number           =   5;

		public static  WETNESS_DRY: number               =   0;
		public static  WETNESS_NORMAL: number            =   1;
		public static  WETNESS_WET: number               =   2;
		public static  WETNESS_SLICK: number             =   3;
		public static  WETNESS_DROOLING: number          =   4;
		public static  WETNESS_SLAVERING: number         =   5;

		public static  LOOSENESS_TIGHT: number           =   0;
		public static  LOOSENESS_NORMAL: number          =   1;
		public static  LOOSENESS_LOOSE: number           =   2;
		public static  LOOSENESS_GAPING: number          =   3;
		public static  LOOSENESS_GAPING_WIDE: number     =   4;
		public static  LOOSENESS_LEVEL_CLOWN_CAR: number =   5;

		public static  DEFAULT_CLIT_LENGTH: number = 0.5;
		private static  LOGGER:ILogger = LoggerFactory.getLogger(Vagina);
		
		//constructor
		public  Vagina(vaginalWetness: number = 1, vaginalLooseness: number = 0, virgin: boolean = false, clitLength: number = DEFAULT_CLIT_LENGTH)
		{
			this.virgin=virgin;
			this.vaginalWetness=vaginalWetness;
			this.vaginalLooseness=vaginalLooseness;
			this.clitLength = clitLength;
			this.recoveryProgress = 0;
		}
		//data
		//Vag wetness
		public  vaginalWetness: number = 1;
		/*Vag looseness
		0 - virgin
		1 - normal
		2 - loose
		3 - very loose
		4 - gaping
		5 - monstrous*/
		public  vaginalLooseness: number = 0;
		//Type
		//0 - Normal
		//5 - Black bugvag
		public  type: number = 0;
		public  virgin: boolean = true;
		//Used during sex to determine how full it currently is.  For multi-dick sex.
		public  fullness: number = 0;
		public  labiaPierced: number = 0;
		public  labiaPShort: string = "";
		public  labiaPLong: string = "";		
		public  clitPierced: number = 0;
		public  clitPShort: string = "";
		public  clitPLong: string = "";
		public  clitLength: number;
		public  recoveryProgress: number;

		public  validate(): string
		{
		var  error: string = "";
			error += Utils.validateNonNegativeNumberFields(this, "Vagina.validate", [
				"vaginalWetness", "vaginalLooseness", "type",
				"fullness", "labiaPierced", "clitPierced", "clitLength", "recoveryProgress"
			]);
			if (labiaPierced) {
				if (labiaPShort == "") error += "Labia pierced but labiaPShort = ''. ";
				if (labiaPLong == "") error += "Labia pierced but labiaPLong = ''. ";
			} else {
				if (labiaPShort != "") error += "Labia not pierced but labiaPShort = '" + labiaPShort + "'. ";
				if (labiaPLong != "") error += "Labia not pierced but labiaPLong = '" + labiaPShort + "'. ";
			}
			if (clitPierced) {
				if (clitPShort == "") error += "Clit pierced but labiaPShort = ''. ";
				if (clitPLong == "") error += "Clit pierced but labiaPLong = ''. ";
			} else {
				if (clitPShort != "") error += "Clit not pierced but labiaPShort = '" + labiaPShort + "'. ";
				if (clitPLong != "") error += "Clit not pierced but labiaPLong = '" + labiaPShort + "'. ";
			}
			return error;
		}
		
		/**
		 * Wetness factor used for calculating capacity.
		 * 
		 * @return wetness factor based on wetness
		 */
		public  wetnessFactor(): number {
			return 1 + vaginalWetness / 10;
		}
		
		private  baseCapacity(bonusCapacity: number): number {
			return bonusCapacity + 8 * vaginalLooseness * vaginalLooseness;
		}
		
		/**
		 * The capacity of the vagina, calculated using looseness and wetness.
		 * 
		 * @param bonusCapacity extra space to add
		 * @return the total capacity, with all factors considered.
		 */
		public  capacity(bonusCapacity: number = 0): number {
			return baseCapacity(bonusCapacity) * wetnessFactor();
		}
		
		//TODO call this in the setter? With new value > old value check?
		/**
		 * Resets the recovery counter.
		 * The counter is used for looseness recovery over time, a reset usualy occurs when the looseness increases.
		 */
		public  resetRecoveryProgress(): void {
			this.recoveryProgress = 0;
		}
		
		/**
		 * Try to stretch the vagina with the given cock area.
		 * 
		 * @param cArea the area of the cock doing the stretching
		 * @param hasFeraMilkingTwat true if the player has the given Perk
		 * @return true if the vagina was stretched
		 */
		public  stretch(cArea: number, bonusCapacity: number = 0, hasFeraMilkingTwat: boolean = false): boolean {
		var  stretched: boolean = false;
			LOGGER.debug("Vaginal stretch check, cock area {0} vs vagina capacity {1}", cArea, capacity(bonusCapacity));
			if (!hasFeraMilkingTwat || vaginalLooseness <= Vagina.LOOSENESS_NORMAL) {
				//cArea > capacity = autostreeeeetch.
				if (cArea >= capacity(bonusCapacity)) {
					vaginalLooseness++;
					stretched = true;
				}
				//If within top 10% of capacity, 50% stretch
				else if (cArea >= .9 * capacity(bonusCapacity) && Utils.rand(2) == 0) {
					vaginalLooseness++;
					stretched = true;
				}
				//if within 75th to 90th percentile, 25% stretch
				else if (cArea >= .75 * capacity(bonusCapacity) && Utils.rand(4) == 0) {
					vaginalLooseness++;
					stretched = true;
				}
			}
			if (vaginalLooseness > Vagina.LOOSENESS_LEVEL_CLOWN_CAR) vaginalLooseness = Vagina.LOOSENESS_LEVEL_CLOWN_CAR;
			if (hasFeraMilkingTwat && vaginalLooseness > Vagina.LOOSENESS_LOOSE) vaginalLooseness = Vagina.LOOSENESS_LOOSE;

			if (virgin) {
				virgin = false;
			}
			
			return stretched;
		}
		
		public  serialize(relativeRootObject: any): void 
		{
			LOGGER.debug("Serializing vagina...");
			relativeRootObject.type = this.type;
			relativeRootObject.vaginalWetness = this.vaginalWetness;
			relativeRootObject.vaginalLooseness = this.vaginalLooseness;
			relativeRootObject.fullness = this.fullness;
			relativeRootObject.virgin = this.virgin;
			relativeRootObject.labiaPierced = this.labiaPierced;
			relativeRootObject.labiaPShort = this.labiaPShort;
			relativeRootObject.labiaPLong = this.labiaPLong;
			relativeRootObject.clitPierced = this.clitPierced;
			relativeRootObject.clitPShort = this.clitPShort;
			relativeRootObject.clitPLong = this.clitPLong;
			relativeRootObject.clitLength = this.clitLength;
			relativeRootObject.recoveryProgress = this.recoveryProgress;
		}
		
		public  deserialize(relativeRootObject: any): void 
		{
			this.vaginalWetness = relativeRootObject.vaginalWetness;
			this.vaginalLooseness = relativeRootObject.vaginalLooseness;
			this.fullness = relativeRootObject.fullness;
			this.virgin = relativeRootObject.virgin;
			this.type = relativeRootObject.type;
			
			this.labiaPierced = relativeRootObject.labiaPierced;
			this.labiaPShort = relativeRootObject.labiaPShort;
			this.labiaPLong = relativeRootObject.labiaPLong;
			this.clitPierced = relativeRootObject.clitPierced;
			this.clitPShort = relativeRootObject.clitPShort;
			this.clitPLong = relativeRootObject.clitPLong;
			this.clitLength = relativeRootObject.clitLength;
			
			this.recoveryProgress = relativeRootObject.recoveryProgress;
		}
		
		public  upgradeSerializationVersion(relativeRootObject: any, serializedDataVersion: number): void 
		{
			switch(serializedDataVersion) {
				case 0:
					LOGGER.info("Loaded legacy save format for {0}, upgrading...", this);
					
					if (relativeRootObject.type === undefined) {
						relativeRootObject.type = 0;
						LOGGER.warn("Vagina type not set, setting to {0}", relativeRootObject.type);
					}
					
					if (relativeRootObject.labiaPierced === undefined) {
						LOGGER.warn("Labia pierced not set, resetting labia and clit data");
						relativeRootObject.labiaPierced = 0;
						relativeRootObject.labiaPShort = "";
						relativeRootObject.labiaPLong = "";
						relativeRootObject.clitPierced = 0;
						relativeRootObject.clitPShort = "";
						relativeRootObject.clitPLong = "";
					}
					
					if(relativeRootObject.clitLength === undefined) {
						relativeRootObject.clitLength = Vagina.DEFAULT_CLIT_LENGTH;
						LOGGER.warn("Clit length was not loaded, setting to default({0})", relativeRootObject.clitLength);
					}
					
					if(relativeRootObject.recoveryProgress === undefined) {
						relativeRootObject.recoveryProgress = 0;
						LOGGER.warn("Stretch counter was not loaded, setting to {0}", relativeRootObject.recoveryProgress);
					}
			}
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

