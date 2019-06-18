
	/**
	 * Container class for the players skin
	 * @since December 27, 2016
	 * @author Stadler76
	 */
	export class Skin 
	{
		public static  PLAIN: number         =   0;
		public static  FUR: number           =   1;
		public static  LIZARD_SCALES: number =   2;
		public static  GOO: number           =   3;
		public static  UNDEFINED: number     =   4; // DEPRECATED, silently discarded upon loading a saved game
		public static  DRAGON_SCALES: number =   5;
		public static  FISH_SCALES: number   =   6; // NYI, for future use
		public static  WOOL: number          =   7;
		public static  FEATHERED: number     =   8;
		public static  BARK: number          =   9;
		public  type: number = PLAIN;
		public  tone: string = "albino";
		public  desc: string = "skin";
		public  adj: string = "";
		public  furColor: string = "no";

		public  setType(value: number): void
		{
			desc = Appearance.DEFAULT_SKIN_DESCS[value];
			type = value;
		}

		public  skinFurScales(): string
		{
		var  skinzilla: string = "";
			//Adjectives first!
			if (adj !== "")
				skinzilla += adj + ", ";

			//Fur handled a little differently since it uses haircolor
			skinzilla += isFluffy() ? furColor : tone;

			return skinzilla + " " + desc;
		}

		public  description(noAdj: boolean = false, noTone: boolean = false): string
		{
		var  skinzilla: string = "";

			//Adjectives first!
			if (!noAdj && adj !== "" && !noTone && tone !== "rough gray")
				skinzilla += adj + ", ";
			if (!noTone)
				skinzilla += tone + " ";

			//Fur handled a little differently since it uses haircolor
			skinzilla += isFluffy() ? "skin" : desc;

			return skinzilla;
		}

		public  hasFur(): boolean
		{
			return type === FUR;
		}

		public  hasWool(): boolean
		{
			return type === WOOL;
		}

		public  hasFeathers(): boolean
		{
			return  type === FEATHERED;
		}

		public  isFurry(): boolean
		{
			return [FUR, WOOL].indexOf(type) !== -1;
		}

		public  isFluffy(): boolean
		{
			return [FUR, WOOL, FEATHERED].indexOf(type) !== -1;
		}

		public  restore(keepTone: boolean = true): void
		{
			type = PLAIN;
			if (!keepTone) tone = "albino";
			desc = "skin";
			adj  = "";
			furColor = "no";
		}

		public  setProps(p: Record<string, any>): void
		{
			if (p.hasOwnProperty('type')) type = p.type;
			if (p.hasOwnProperty('tone')) tone = p.tone;
			if (p.hasOwnProperty('desc')) desc = p.desc;
			if (p.hasOwnProperty('adj'))  adj  = p.adj;
			if (p.hasOwnProperty('furColor')) furColor = p.furColor;
		}

		public  setAllProps(p: Record<string, any>, keepTone: boolean = true): void
		{
			restore(keepTone);
			setProps(p);
		}

		public  toObject(): Record<string, any>
		{
			return {
				type:     type,
				tone:     tone,
				desc:     desc,
				adj:      adj,
				furColor: furColor
			};
		}
	}

