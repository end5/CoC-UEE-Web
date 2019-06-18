	/**
	 * Class for returning weighted random choices derived from WeightedDrop by aimozg
	 * @since March 7, 2018
	 * @author Stadler76
	 */
	export class WeightedChoice implements RandomChoice
	{
		private  choices: any[] = [];
		private  sum: number = 0;

		public  WeightedChoice(first: any = undefined, firstWeight: number = 0)
		{
			if (first != undefined) {
				choices.push([first, firstWeight]);
				sum += firstWeight;
			}
		}

		public  add(choice: any, weight: number = 1):WeightedChoice
		{
			choices.push([choice, weight]);
			sum += weight;
			return this;
		}

		public  addMany(weight: number, ..._choices):WeightedChoice
		{
			for each (var choice: any in _choices){
				choices.push([choice, weight]);
				sum += weight;
			}
			return this;
		}

		public  choose(): any
		{
		var  random: number = Math.random() * sum;
		var  choice: any = undefined;
		var  choices: any[] = this.choices.slice();
			while (random > 0 && choices.length > 0) {
			var  pair: any[] = choices.shift();
				choice = pair[0];
				random -= pair[1];
			}
			return choice;
		}

		public  clone():WeightedChoice
		{
		var  other:WeightedChoice = new WeightedChoice();
			other.choices = choices.slice();
			other.sum = sum;
			return other;
		}
	}
