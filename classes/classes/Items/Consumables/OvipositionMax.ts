/**
 * Created by aimozg on 18.01.14.
 */

	export class OvipositionMax extends CustomOviElixir {
		
		public  OvipositionMax() {
			super("Ovi Max", "Ovi Max", "an enhanced hexagonal crystal bottle tagged with an image of an egg", 75, "This hexagonal crystal bottle is filled with a strange yellow fluid. A tag with a picture of a glowing egg is tied to the neck of the bottle, indicating it is somehow connected to egg-laying and you know it will be more potent.");
		}
		
		protected  doSpeedUp(incubation: number): number {
			return incubation - int(incubation * 0.5 + 15);
		}

		protected  canSpeedUp(): boolean {
			return game.player.pregnancyIncubation > 20;
			}

		protected  randEggCount(): number {
			return rand(4)+6;
			}

		protected  randBigEgg(): boolean {
			return rand(2)==0;
			}


	}

