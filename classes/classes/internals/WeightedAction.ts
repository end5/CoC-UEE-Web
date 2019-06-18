	/**
	 * Class for performing weighted random actions (function/method calls) derived from WeightedDrop by aimozg
	 * @since May 7, 2017
	 * @author Stadler76
	 */
	export class WeightedAction implements RandomAction 
	{
		private  actions: any[] = [];
		private  sum: number = 0;

		public  WeightedAction(first = undefined, firstWeight: number = 0)
		{
			if (first != undefined) {
				actions.push([first,firstWeight]);
				sum += firstWeight;
			}
		}

		public  add(action, weight: number = 1):WeightedAction
		{
			actions.push([action, weight]);
			sum += weight;
			return this;
		}

		public  addMany(weight: number, ..._actions):WeightedAction
		{
			for each (var action in _actions) {
				actions.push([action, weight]);
				sum += weight;
			}
			return this;
		}

		public  exec(): void
		{
		var  random: number = Math.random()*sum;
		var  action = undefined;
		var  actions: any[] = this.actions.slice();
			while (random > 0 && actions.length > 0) {
			var  pair: any[] = actions.shift();
				action = pair[0];
				random -= pair[1];
			}

			if (action != undefined)
				action();
		}

		public  clone():WeightedAction
		{
		var  other:WeightedAction = new WeightedAction();
			other.actions = actions.slice();
			other.sum = sum;
			return other;
		}
	}

