	/**
	 * ...
	 * @since August 06, 2017
	 * @author Stadler76
	 */
	export class BaseBodyPart 
	{
		public static  COLOR_ID_MAIN: number = 1;
		public static  COLOR_ID_2ND: number  = 2;

		public  getColorDesc(id: number): string
		{
			return "";
		}

		public  canDye(): boolean
		{
			return false;
		}

		public  hasDyeColor(_color: string): boolean
		{
			return true;
		}

		public  applyDye(_color: string): void {}

		public  canOil(): boolean
		{
			return false;
		}

		public  hasOilColor(_color: string): boolean
		{
			return true;
		}

		public  applyOil(_color: string): void {}

		public  canOil2(): boolean
		{
			return false;
		}

		public  hasOil2Color(_color2: string): boolean
		{
			return true;
		}

		public  applyOil2(_color2: string): void {}
	}

