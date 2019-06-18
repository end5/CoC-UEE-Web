	
	export class ScarredBlade extends Weapon
	{
		
		public  ScarredBlade() 
		{
			this.weightCategory = Weapon.WEIGHT_MEDIUM;
			super("ScarBld", "ScarBlade", "scarred blade", "a scarred blade", "slash", 10, 1000, "This saber, made from lethicite-imbued metal, eagerly seeks flesh; it resonates with disdain and delivers deep, jagged wounds as it tries to bury itself in the bodies of others. It only cooperates with the corrupt.");
		}
		
		public  get attack(): number { 
		var  temp: number = 10 + int((game.player.corAdjustedUp() - 70) / 3)
			if (temp < 10) temp = 10;
			return temp; 
		}
		
		public  canUse(): boolean {
			if (game.player.isCorruptEnough(70)) return true;
			game.sheilaScene.rebellingScarredBlade(true);
			return false;
		}
		
	}


