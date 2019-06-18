	
	export class AkbalSaliva extends Consumable 
	{
		public  AkbalSaliva() 
		{
			super("AkbalSl","AkbalSlv", "a vial of Akbal's saliva", ConsumableLib.DEFAULT_VALUE,"This corked vial of Akbal's saliva is said to contain healing properties. ");
		}
		
		public  useItem(): boolean
		{
			outputText("You uncork the vial and chug down the saliva.  ");
			player.HPChange((player.maxHP() / 4), true);
			player.refillHunger(5);
			
			return false;
		}
		
		public  getMaxStackSize(): number {
			return 5;
		}
	}

