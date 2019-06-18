/**
 * Created by aimozg on 10.01.14.
 */

	export class SimpleConsumable extends Consumable {
		private  effect;
		
		/**
		 * @param effect Function(player:Player)
		 */
		public  SimpleConsumable(id: string, shortName: string, longName: string, effect, value: number = 0, description: string = undefined) {
			super(id, shortName, longName, value, description);
			this.effect = effect;
		}
		
		public  useItem(): boolean {
			clearOutput();
			effect(player);
			return(false); //Any normal consumable does not have a sub-menu. Return false so that the inventory runs the itemDoNext function after useItem.
		}
	}

