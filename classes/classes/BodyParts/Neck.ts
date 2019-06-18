	/**
	 * Container class for the players neck
	 * @since December 19, 2016
	 * @author Stadler76
	 */
	export class Neck extends BaseBodyPart
	{
		public static  NORMAL: number     =   0; // normal human neck. neckLen = 2 inches
		public static  DRACONIC: number   =   1; // (western) dragon neck. neckLen = 2-30 inches
		public static  COCKATRICE: number =   2;

		public  type: number  = NORMAL;
		public  len: number   = 2;
		public  pos: boolean  = false;
		public  color: string = "no";

		private  _nlMax: any[] = [];
		public  get nlMax(): any[] { return _nlMax; }

		public  Neck()
		{
			_nlMax[NORMAL]   =  2;
			_nlMax[DRACONIC] = 30;
		}

		public  restore(): void
		{
			type  = NORMAL;
			len   = 2;
			pos   = false;
			color = "no";
		}

		public  setProps(p: Record<string, any>): void
		{
			if (p.hasOwnProperty('type'))  type  = p.type;
			if (p.hasOwnProperty('len'))   len   = p.len;
			if (p.hasOwnProperty('pos'))   pos   = p.pos;
			if (p.hasOwnProperty('color')) color = p.color;
		}

		public  setAllProps(p: Record<string, any>): void
		{
			restore();
			setProps(p);
		}

		public  modify(diff: number, newType: number = -1): void
		{
			if (newType !== -1) type = newType;

			if (_nlMax[type] === undefined) { // Restore length and pos, if the type is not associated with a certain max length
				pos = false;
				len = 2;
				return;
			}

			len += diff;
			if (len < 2)  len = 2;
			if (len > _nlMax[type]) len = _nlMax[type];
		}

		public  isFullyGrown(): boolean
		{
			return len >= _nlMax[type];
		}

		public  canDye(): boolean
		{
			return type === COCKATRICE;
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
				len:   len,
				pos:   pos,
				color: color
			};
		}
	}

