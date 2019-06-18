	
	export class Nothing extends Armor {
		
		public  Nothing() {
			super("nothing", "nothing", "nothing", "nothing", 0, 0, "nothing", "Light");
		}
		
		public  playerRemove():Armor {
			return undefined; //Player never picks up their underclothes
		}
	}

