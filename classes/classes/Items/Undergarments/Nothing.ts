
	export class Nothing extends Undergarment
	{
		public  Nothing() {
			super("nounder", "nounder", "nothing", "nothing", -1, 0, "nothing", "light");
		}
		
		public  playerRemove():Undergarment {
			return undefined; //Player never picks up their underclothes
		}
	}
