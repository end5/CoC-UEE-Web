/**
 * Created by aimozg on 10.01.14.
 */

	export class BeautifulSword extends Weapon {
		
		public  BeautifulSword() {
			this.weightCategory = Weapon.WEIGHT_MEDIUM;
			super("B.Sword", "B.Sword", "beautiful sword", "a beautiful shining sword", "slash", 7, 400, "This beautiful sword shines brilliantly in the light, showing the flawless craftsmanship of its blade. The pommel and guard are heavily decorated in gold and brass.  Some craftsman clearly poured his heart and soul into this blade.", "holySword");
		}
		
		public  get attack(): number { 
		var  temp: number = 7 + (10 - game.player.cor / 3);
			if (temp < 5) temp = 5;
			return temp; 
		}
		
		public  canUse(): boolean {
			if (game.player.isPureEnough(35)) return true;
			outputText("You grab hold of the handle of the sword only to have it grow burning hot.  You're forced to let it go lest you burn yourself.  Something within the sword must be displeased.  ");
			return false;
		}
	}

