	
	export class Nothing extends Shield
	{
		public  Nothing()
		{
			this.weightCategory = Shield.WEIGHT_LIGHT;
			super("noshild", "noshield", "nothing", "nothing", 0, 0, "no shield", "shield");
		}
		
		public  playerRemove():Shield {
			return undefined; //There is nothing!
		}
	}
