	
	export class Nothing extends Jewelry
	{
		public  Nothing()
		{
			super("nojewel", "nojewel", "nothing", "nothing", 0, 0, 0, "no jewelry", "ring");
		}
		
		public  playerRemove():Jewelry {
			return undefined; //There is nothing!
		}
	}
