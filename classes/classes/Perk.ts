	export class Perk
	{
		//constructor
		public  Perk(perk:PerkType,value1: number=0,value2: number=0,value3: number=0,value4: number=0)
		{
			_ptype = perk;
			this.value1 = value1;
			this.value2 = value2;
			this.value3 = value3;
			this.value4 = value4;
		}
		//data
		private  _ptype:PerkType;
		public  value1: number;
		public  value2: number;
		public  value3: number;
		public  value4: number;
		//MEMBER FUNCTIONS


		public  get ptype():PerkType
		{
			return _ptype;
		}

		public  get perkName(): string
		{
			return _ptype.name;
		}

		public  get perkDesc(): string
		{
			return _ptype.desc(this);
		}

		public  get perkLongDesc(): string
		{
			return _ptype.longDesc;
		}
	}

