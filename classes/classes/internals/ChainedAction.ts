
	/**
	 * Class for performing chained random actions (function/method calls) derived from ChainedDrop by aimozg 
	 * @since May 7, 2017
	 * @author Stadler76
	 */
	export class ChainedAction implements RandomAction 
	{
		private  actions: any[] = [];
		private  probs: any[] = [];
		private  defaultAction;

		public  ChainedAction(defaultAction = undefined) 
		{
			this.defaultAction = defaultAction;
		}

		public  add(action, prob: number):ChainedAction
		{
			if (prob < 0 || prob > 1) {
				CoC_Settings.error("Invalid probability value " + prob);
			}
			actions.push(action);
			probs.push(prob);
			return this;
		}

		public  elseAction(action):ChainedAction
		{
			this.defaultAction = action;
			return this;
		}

		public  exec(): void 
		{
			for (var i: number = 0; i < actions.length; i++) {
				if (Math.random() < probs[i]) {
					actions[i]();
					return;
				}
			}

			if (defaultAction != undefined)
				defaultAction();
		}
	}

