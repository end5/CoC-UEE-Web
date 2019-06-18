
	/**
	 * Class for returning chained random choices derived from ChainedDrop by aimozg 
	 * @since March 7, 2018
	 * @author Stadler76
	 */
	export class ChainedChoice implements RandomChoice
	{
		private  choices: any[] = [];
		private  probs: any[] = [];
		private  defaultChoice: any;

		public  ChainedChoice(defaultChoice: any = undefined)
		{
			this.defaultChoice = defaultChoice;
		}

		public  add(item: any, prob: number):ChainedChoice
		{
			if (prob < 0 || prob > 1) {
				CoC_Settings.error("Invalid probability value "+prob);
			}
			choices.push(item);
			probs.push(prob);
			return this;
		}

		public  elseChoice(item: any):ChainedChoice
		{
			this.defaultChoice = item;
			return this;
		}

		public  choose(): any
		{
			for (var i: number = 0; i < choices.length; i++) {
				if (Math.random() < probs[i]) {
					return choices[i];
				}
			}

			return defaultChoice;
		}
	}

