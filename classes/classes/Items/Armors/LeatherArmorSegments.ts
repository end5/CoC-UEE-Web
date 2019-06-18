/**
 * Created by aimozg on 18.01.14.
 */

	export class LeatherArmorSegments extends Armor {
		
		public  LeatherArmorSegments() {
			super("UrtaLta", "UrtaLta", "leather armor segments", "leather armor segments", 5, 76, undefined, "Light", true);
		}
		public  removeText(): void {
			outputText("You have your old set of " + game.armors.LEATHRA.longName + " left over.  ");
		}
		
		public  playerRemove():Armor {
			super.playerRemove();
			return game.armors.LEATHRA;
		}
	}

