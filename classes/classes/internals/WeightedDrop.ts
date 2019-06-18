/**
 * Created by aimozg on 11.01.14.
 */
	export class WeightedDrop implements RandomDrop
	{
		private  items: any[] = [];
		private  sum: number = 0;
		public  WeightedDrop(first: any=undefined,firstWeight: number=0)
		{
			if (first != undefined){
				items.push([first,firstWeight]);
				sum += firstWeight;
			}
		}
		public  add(item: any,weight: number=1):WeightedDrop
		{
			items.push([item,weight]);
			sum += weight;
			return this;
		}
		public  addMany(weight: number,..._items):WeightedDrop
		{
			for each (var item: any in _items){
				items.push([item,weight]);
				sum += weight;
			}
			return this;
		}
		// you can pass your own random value from 0 to 1 (so you can use your own RNG)
		public  roll(): any
		{
		var  random: number = Math.random()*sum;
		var  item: any = undefined;
		var  items: any[] = this.items.slice(); 
			while (random > 0 && items.length > 0) {
			var  pair: any[] = items.shift();
				item = pair[0];
				random -= pair[1];
			}
			return item;
		}

		public  clone():WeightedDrop
		{
		var  other:WeightedDrop = new WeightedDrop();
			other.items = items.slice();
			other.sum = sum;
			return other;
		}
	}
