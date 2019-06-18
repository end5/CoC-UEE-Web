
	export class BreastRow implements Serializable
	{
		private static  LOGGER:ILogger = LoggerFactory.getLogger(BreastRow);
		
		private static  SERIALIZATION_VERSION: number = 1;
		private static  SERIALIZATION_UUID: string = "c862ee0a-5667-4fd3-a178-37a5e85c86d6";
		
		public  breasts: number = 2;
		public  nipplesPerBreast: number = 1;
		public  breastRating: number = BreastCup.FLAT;
		public  lactationMultiplier: number = 0;
		//Fullness used for lactation....if 75 or greater warning bells start going off!
		//If it reaches 100 it reduces lactation multiplier.
		public  milkFullness: number = 0;
		public  fullness: number = 0;
		public  fuckable: boolean = false;
		public  nippleCocks: boolean = false;

		public  validate(): string
		{
		var  error: string = "";
			error += Utils.validateNonNegativeNumberFields(this, "BreastRow.validate", [
					"breasts", "nipplesPerBreast", "breastRating", "lactationMultiplier",
					"milkFullness", "fullness"
			]);
			return error;
		}

		public  restore(): void
		{
			breasts = 2;
			nipplesPerBreast = 1;
			breastRating = BreastCup.FLAT;
			lactationMultiplier = 0;
			milkFullness = 0;
			fullness = 0;
			fuckable = false;
			nippleCocks = false;
		}

		public  setProps(p: Record<string, any>): void
		{
			if (p.hasOwnProperty('breasts'))             breasts             = p.breasts;
			if (p.hasOwnProperty('nipplesPerBreast'))    nipplesPerBreast    = p.nipplesPerBreast;
			if (p.hasOwnProperty('breastRating'))        breastRating        = p.breastRating;
			if (p.hasOwnProperty('lactationMultiplier')) lactationMultiplier = p.lactationMultiplier;
			if (p.hasOwnProperty('milkFullness'))        milkFullness        = p.milkFullness;
			if (p.hasOwnProperty('fullness'))            fullness            = p.fullness;
			if (p.hasOwnProperty('fuckable'))            fuckable            = p.fuckable;
			if (p.hasOwnProperty('nippleCocks'))         nippleCocks         = p.nippleCocks;
		}

		public  setAllProps(p: Record<string, any>): void
		{
			restore();
			setProps(p);
		}
		
		public  serialize(relativeRootObject: any): void 
		{
			relativeRootObject.breasts = this.breasts;
			relativeRootObject.breastRating = this.breastRating;
			relativeRootObject.nipplesPerBreast = this.nipplesPerBreast;
			relativeRootObject.lactationMultiplier = this.lactationMultiplier;
			relativeRootObject.milkFullness = this.milkFullness;
			relativeRootObject.fuckable = this.fuckable;
			relativeRootObject.fullness = this.fullness;
			relativeRootObject.nippleCocks = this.nippleCocks;
		}
		
		public  deserialize(relativeRootObject: any): void 
		{
			this.breasts = relativeRootObject.breasts;
			this.breastRating = relativeRootObject.breastRating;
			this.nipplesPerBreast = relativeRootObject.nipplesPerBreast;
			this.lactationMultiplier = relativeRootObject.lactationMultiplier;
			this.milkFullness = relativeRootObject.milkFullness;
			this.fuckable = relativeRootObject.fuckable;
			this.fullness = relativeRootObject.fullness;
			this.nippleCocks = relativeRootObject.nippleCocks;
		}
		
		public  upgradeSerializationVersion(relativeRootObject: any, serializedDataVersion: number): void 
		{
			switch (serializedDataVersion) {
				case 0:
					LOGGER.debug("Upgrading legacy breast row")
					
					// fix breasts without nipples
					if (relativeRootObject.nipplesPerBreast === 0) {
						LOGGER.warn("Breasts did not have any nipples, fixing...");
						relativeRootObject.nipplesPerBreast = 1;
					}
					
					// fix negative lactation muliplier
					if (relativeRootObject.lactationMultiplier < 0) {
						LOGGER.warn("Lactation multiplier was {0}, resetting to 0", relativeRootObject.lactationMultiplier);
						relativeRootObject.lactationMultiplier = 0;
					}
					
					// fix negative breast rating
					if (relativeRootObject.breastRating < 0) {
						LOGGER.warn("Breast rating was {0}, resetting to {1}", relativeRootObject.breastRating, BreastCup.FLAT);
						relativeRootObject.breastRating = BreastCup.FLAT;
					}
					
				default:
					/*
					 * The default block is left empty intentionally,
					 * this switch case operates by using fall through behavior.
					 */
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

