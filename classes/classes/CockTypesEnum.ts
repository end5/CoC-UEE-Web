	
	export class CockTypesEnum extends Enum
	{
		{initEnum(CockTypesEnum);}
		
		/* Cock types
		 * 0 - human
		 * 1 - horse
		 * 2 - dog
		 * 3 - demon
		 * 4 - tentacle?
		 * 5 - CAT
		 * 6 - Lizard/Naga?
		 * 7 - ANEMONE!
		 * 8 - ugliest wang ever (kangaroo)
		 * 9 - dragon
		 * 10 - displacer
		 * 11 - Fox	
		
		 Group Types used for general description code (eventually)
		 * human  	- obvious
		 * mammal 	- obvious again
		 * super 	- supernatural types
		 * tentacle - only one tentacle!
		 * reptile	- make a guess
		 * seaworld - Anything in the water
		 * other	- doesn't fit anywhere else
		 */
		public static  HUMAN:CockTypesEnum = new CockTypesEnum("human");
		public static  HORSE:CockTypesEnum = new CockTypesEnum("mammal");
		public static  DOG:CockTypesEnum = new CockTypesEnum("mammal");
		public static  DEMON:CockTypesEnum = new CockTypesEnum("super");
		public static  TENTACLE:CockTypesEnum = new CockTypesEnum("tentacle");
		public static  CAT:CockTypesEnum = new CockTypesEnum("mammal");
		public static  LIZARD:CockTypesEnum = new CockTypesEnum("reptile");
		public static  ANEMONE:CockTypesEnum = new CockTypesEnum("seaworld");
		public static  KANGAROO:CockTypesEnum = new CockTypesEnum("mammal");
		public static  DRAGON:CockTypesEnum = new CockTypesEnum("reptile");
		public static  DISPLACER:CockTypesEnum = new CockTypesEnum("other");
		public static  FOX:CockTypesEnum = new CockTypesEnum("mammal");
		public static  BEE:CockTypesEnum = new CockTypesEnum("insect");
		public static  PIG:CockTypesEnum = new CockTypesEnum("mammal");
		public static  AVIAN:CockTypesEnum = new CockTypesEnum("avian");
		public static  RHINO:CockTypesEnum = new CockTypesEnum("mammal");
		public static  ECHIDNA:CockTypesEnum = new CockTypesEnum("mammal");
		public static  WOLF:CockTypesEnum = new CockTypesEnum("mammal");
		public static  RED_PANDA:CockTypesEnum = new CockTypesEnum("mammal");
		public static  FERRET:CockTypesEnum = new CockTypesEnum("mammal");
		public static  UNDEFINED:CockTypesEnum = new CockTypesEnum("");
		
	function  CockTypesEnum(i_group: string = "") { _group = i_group; }
		private  _group: string;
		
		public  get Group(): string 
		{
			return _group;
		}
		
		public static  ParseConstant(i_constantName: string, i_caseSensitive: boolean = false):CockTypesEnum
		{
			return CockTypesEnum(Enum.ParseConstant(CockTypesEnum, i_constantName, i_caseSensitive));
		}
		
		public static  ParseConstantByIndex(i_constantIndex: number = 0):CockTypesEnum
		{
			return CockTypesEnum(Enum.ParseConstantByIndex(CockTypesEnum, i_constantIndex));
		}
		
	}

