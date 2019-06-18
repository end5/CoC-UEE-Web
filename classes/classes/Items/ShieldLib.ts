	/**
	 * ...
	 * @author Kitteh6660
	 */
	
	export class ShieldLib 
	{
		public static  DEFAULT_VALUE: number = 6;
		
		public static  NOTHING:Nothing = new Nothing();
		
		//Regular Shields
		public  WOODSHL:Shield = new WoodenShield();
		
		public  BUCKLR0:Shield = new Buckler(0);
		public  BUCKLR1:Shield = new Buckler(1);
		public  BUCKLR2:Shield = new Buckler(2);
		
		public  GRTSHL0:Shield = new GreatShield(0);
		public  GRTSHL1:Shield = new GreatShield(1);
		public  GRTSHL2:Shield = new GreatShield(2);
		
		public  KITESH0:Shield = new KiteShield(0);
		public  KITESH1:Shield = new KiteShield(1);
		public  KITESH2:Shield = new KiteShield(2);
		
		public  TOWRSH0:Shield = new TowerShield(0);
		public  TOWRSH1:Shield = new TowerShield(1);
		public  TOWRSH2:Shield = new TowerShield(2);
		
		//Special Shields
		public  DRGNSHL:Shield = new DragonShellShield(false);
		public  RUNESHL:Shield = new DragonShellShield(true);

		public  ShieldLib() {}
	}


