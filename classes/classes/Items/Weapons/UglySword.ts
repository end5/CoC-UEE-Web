
	export class UglySword extends Weapon {
		
		public  UglySword() {
			this.weightCategory = Weapon.WEIGHT_MEDIUM;
			super("U.Sword", "U.Sword", "ugly sword", "an ugly sword", "slash", 7, 400, "This ugly sword is jagged and chipped, yet somehow perfectly balanced and unnaturally sharp. Its blade is black, and its material is of dubious origin.", "uglySword");
		}
		
		public  get attack(): number { 
		var  temp: number = 7 + int((game.player.corAdjustedUp() - 70) / 3)
			if (temp < 5) temp = 5;
			return temp; 
		}
		
		public  canUse(): boolean {
			if (game.player.isCorruptEnough(70)) return true;
			outputText("You grab hold of the handle of the sword only to have it grow burning hot. You're forced to let it go lest you burn yourself. Something within the sword must be disgusted. ");
			return false;
		}
	}

