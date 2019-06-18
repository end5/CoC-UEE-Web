	/**
	 * Container class for the players udder
	 * @since January 19, 2018
	 * @author NoahTheGoodra
	 */
    export class Udder
	{
		/** Udder hasUdder a bool value that says if the player has an undder */
		public  hasUdder: boolean = false;
		/** Udder fullness is a 0-100 slider used for how full the udder is. Recharges per hour. */
		public  fullness: number = 0;
		/** Udder refill determines how fast milk comes back per hour. */
		public  refill: number = 5;


		public  restore(): void
		{
			hasUdder = false;
			fullness = 0;
			refill = 5;
		}

		public  setProps(p: Record<string, any>): void
		{
			if (p.hasOwnProperty('hasUdder')) hasUdder = p.hasUdder;
			if (p.hasOwnProperty('fullness')) fullness = p.fullness;
			if (p.hasOwnProperty('refill'))   refill   = p.refill;
		}

		public  setAllProps(p: Record<string, any>): void
		{
			restore();
			setProps(p);
		}

		public  toObject(): Record<string, any>
		{
			return {
				hasUdder: hasUdder,
				fullness: fullness,
				refill:   refill
			};
		}
	}

