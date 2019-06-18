	/**
	 * Container class for the players tail
	 * @since November 05, 2017
	 * @author Stadler76
	 */
	export class Tail
	{
		public static  NONE: number           =   0;
		public static  HORSE: number          =   1;
		public static  DOG: number            =   2;
		public static  DEMONIC: number        =   3;
		public static  COW: number            =   4;
		public static  SPIDER_ABDOMEN: number =   5;
		public static  BEE_ABDOMEN: number    =   6;
		public static  SHARK: number          =   7;
		public static  CAT: number            =   8;
		public static  LIZARD: number         =   9;
		public static  RABBIT: number         =  10;
		public static  HARPY: number          =  11;
		public static  KANGAROO: number       =  12;
		public static  FOX: number            =  13;
		public static  DRACONIC: number       =  14;
		public static  RACCOON: number        =  15;
		public static  MOUSE: number          =  16;
		public static  FERRET: number         =  17;
		public static  BEHEMOTH: number       =  18;
		public static  PIG: number            =  19;
		public static  SCORPION: number       =  20;
		public static  GOAT: number           =  21;
		public static  RHINO: number          =  22;
		public static  ECHIDNA: number        =  23;
		public static  DEER: number           =  24;
		public static  SALAMANDER: number     =  25;
		public static  WOLF: number           =  26;
		public static  SHEEP: number          =  27;
		public static  IMP: number            =  28;
		public static  COCKATRICE: number     =  29;
		public static  RED_PANDA: number      =  30;

		public  type: number     = NONE;
		/** Tail venom is a 0-100 slider used for tail attacks. Recharges per hour. */
		public  venom: number    = 0;
		/** Tail recharge determines how fast venom/webs comes back per hour. */
		public  recharge: number = 5;

		public  restore(): void
		{
			type     = NONE;
			venom    = 0;
			recharge = 5;
		}

		public  setProps(p: Record<string, any>): void
		{
			if (p.hasOwnProperty('type'))     type     = p.type;
			if (p.hasOwnProperty('venom'))    venom    = p.venom;
			if (p.hasOwnProperty('recharge')) recharge = p.recharge;
		}

		public  setAllProps(p: Record<string, any>): void
		{
			restore();
			setProps(p);
		}
	}

