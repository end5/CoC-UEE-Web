/**
 * Created by aimozg on 09.01.14.
 */

	export class Fists extends Weapon {
		
		public  Fists() {
			this.weightCategory = Weapon.WEIGHT_LIGHT;
			super("Fists  ", "Fists", "fists", "fists \n\nType: Weapon (Unarmed) \nAttack: 0 \nBase value: N/A", "punch", 0);
		}
		
		public  useText(): void {} //No text for equipping fists

		public  playerRemove():Weapon {
			return undefined;
		}
		
	}

