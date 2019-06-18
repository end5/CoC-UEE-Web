	/**
	 * Container class for the players ears
	 * @since August 08, 2017
	 * @author Stadler76
	 */
	export class Horns
	{
		public static  NONE: number                     =   0;
		public static  DEMON: number                    =   1;
		public static  COW_MINOTAUR: number             =   2;
		public static  DRACONIC_X2: number              =   3;
		public static  DRACONIC_X4_12_INCH_LONG: number =   4;
		public static  ANTLERS: number                  =   5;
		public static  GOAT: number                     =   6;
		public static  UNICORN: number                  =   7;
		public static  RHINO: number                    =   8;
		public static  SHEEP: number                    =   9;
		public static  RAM: number                      =  10;
		public static  IMP: number                      =  11;

		public  type: number  = NONE;
		/** horns length or number depending on the type */
		public  value: number = 0;

		public  restore(): void
		{
			type  = NONE;
			value = 0;
		}

		public  setProps(p: Record<string, any>): void
		{
			if (p.hasOwnProperty('type'))  type  = p.type;
			if (p.hasOwnProperty('value')) value = p.value;
		}

		public  setAllProps(p: Record<string, any>): void
		{
			restore();
			setProps(p);
		}
	}

