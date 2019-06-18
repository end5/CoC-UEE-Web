	/**
	 * Container class for the players antennae
	 * @since November 08, 2017
	 * @author Stadler76
	 */
	export class Antennae
	{
		public static  NONE: number       =   0;
		public static  BEE: number        =   2;
		public static  COCKATRICE: number =   3;

		public  type: number = NONE;

		public  restore(): void
		{
			type = NONE;
		}

		public  setProps(p: Record<string, any>): void
		{
			if (p.hasOwnProperty('type')) type = p.type;
		}

		public  setAllProps(p: Record<string, any>): void
		{
			restore();
			setProps(p);
		}
	}

