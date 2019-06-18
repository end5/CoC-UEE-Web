	
	export class PrisonBread extends Consumable 
	{
		
		public  PrisonBread() {
			super("P.Bread", "P.Bread", "a stale loaf of prison bread", ConsumableLib.DEFAULT_VALUE, "An impossibly hard loaf of stale bread.  Despite its age, still quite nutritious.");
		}
		
		public  canUse(): boolean {
			return true;
		}
		
		public  useItem(): boolean {
			game.prison.prisonItemBread(false);
			return true;
		}
		
	}

