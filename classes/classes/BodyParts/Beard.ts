	/**
	 * Container class for the players beard
	 * @since August 08, 2017
	 * @author Stadler76
	 */
	export class Beard
	{
		public static  NORMAL: number      =    0;
		public static  GOATEE: number      =    1;
		public static  CLEANCUT: number    =    2;
		public static  MOUNTAINMAN: number =    3;

		public  style: number  = NORMAL;
		public  length: number = 0;

		public  restore(): void
		{
			style  = NORMAL;
			length = 0;
		}

		public  setProps(p: Record<string, any>): void
		{
			if (p.hasOwnProperty('style'))  style  = p.style;
			if (p.hasOwnProperty('length')) length = p.length;
		}

		public  setAllProps(p: Record<string, any>): void
		{
			restore();
			setProps(p);
		}
	}

