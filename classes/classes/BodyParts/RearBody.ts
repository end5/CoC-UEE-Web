
	/**
	 * Container class for the players rear body
	 * @since December 20, 2016
	 * @author Stadler76
	 */
	export class RearBody extends BaseBodyPart
	{
		public static  NONE: number            =   0;
		public static  DRACONIC_MANE: number   =   1;
		public static  DRACONIC_SPIKES: number =   2;
		public static  SHARK_FIN: number       =   3;

		public  type: number  = NONE;
		public  color: string = "no";

		public  restore(): void
		{
			type  = NONE;
			color = "no";
		}

		public  setProps(p: Record<string, any>): void
		{
			if (p.hasOwnProperty('type'))  type  = p.type;
			if (p.hasOwnProperty('color')) color = p.color;
		}

		public  setAllProps(p: Record<string, any>): void
		{
			restore();
			setProps(p);
		}

		public  canDye(): boolean
		{
			return type === DRACONIC_MANE;
		}

		public  hasDyeColor(_color: string): boolean
		{
			return color === _color;
		}

		public  applyDye(_color: string): void
		{
			color = _color;
		}

		public  toObject(): Record<string, any>
		{
			return {
				type:  type,
				color: color
			};
		}
	}

