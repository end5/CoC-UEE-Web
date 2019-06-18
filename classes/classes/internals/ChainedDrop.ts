/**
 * Created by aimozg on 11.01.14.
 */

	export class ChainedDrop implements RandomDrop
	{
		private  items: any[] = [];
		private  probs: any[] = [];
		private  defaultItem: any;
		public  ChainedDrop(defaultItem: any = undefined)
		{
			this.defaultItem = defaultItem;
		}
		public  add(item: any,prob: number):ChainedDrop{
			if (prob<0 || prob>1){
				CoC_Settings.error("Invalid probability value "+prob);
			}
			items.push(item);
			probs.push(prob);
			return this;
		}
		public  elseDrop(item: any):ChainedDrop{
			this.defaultItem = item;
			return this;
		}

		public  roll(): any
		{
			for (var i: number = 0; i<items.length; i++){
				if (Math.random()<probs[i]) return items[i];
			}
			return defaultItem;
		}
	}

