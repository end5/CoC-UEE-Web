	/**
	 * Container class for the players lowerbody
	 * @since August 08, 2017
	 * @author Stadler76
	 */
	export class LowerBody
	{
		public static  HUMAN: number                 =   0;
		public static  HOOFED: number                =   1;
		public static  DOG: number                   =   2;
		public static  NAGA: number                  =   3;
		//public static const CENTAUR: number             =   4; //DEPRECATED - USE HOOFED + LEGCOUNT 4
		public static  DEMONIC_HIGH_HEELS: number    =   5;
		public static  DEMONIC_CLAWS: number         =   6;
		public static  BEE: number                   =   7;
		public static  GOO: number                   =   8;
		public static  CAT: number                   =   9;
		public static  LIZARD: number                =  10;
		public static  PONY: number                  =  11;
		public static  BUNNY: number                 =  12;
		public static  HARPY: number                 =  13;
		public static  KANGAROO: number              =  14;
		public static  CHITINOUS_SPIDER_LEGS: number =  15;
		public static  DRIDER: number                =  16;
		public static  FOX: number                   =  17;
		public static  DRAGON: number                =  18;
		public static  RACCOON: number               =  19;
		public static  FERRET: number                =  20;
		public static  CLOVEN_HOOFED: number         =  21;
		//public static const RHINO: number               =  22;
		public static  ECHIDNA: number               =  23;
		//public static const DEERTAUR: number            =  24; //DEPRECATED - USE CLOVEN HOOFED + LEGCOUNT 4
		public static  SALAMANDER: number            =  25;
		public static  WOLF: number                  =  26;
		public static  IMP: number                   =  27;
		public static  COCKATRICE: number            =  28;
		public static  RED_PANDA: number             =  29;

		public  type: number         = HUMAN;
		public  legCount: number     = 2;
		public  incorporeal: boolean = false;

		public  restore(): void
		{
			type        = HUMAN;
			legCount    = 2;
			incorporeal = false;
		}

		public  setProps(p: Record<string, any>): void
		{
			if (p.hasOwnProperty('type'))        type        = p.type;
			if (p.hasOwnProperty('legCount'))    legCount    = p.legCount;
			if (p.hasOwnProperty('incorporeal')) incorporeal = p.incorporeal;
		}

		public  setAllProps(p: Record<string, any>): void
		{
			restore();
			setProps(p);
		}
	}

