
	export class SimpleUseable extends Useable 
	{
		//This class should be used for items which the player cannot consume, wear or use directly.
		//The useFunction or useText should describe the item or give a hint as to its purpose. After attempted use SimpleUseables return to the inventory automatically.
		private  canUseFunction;
		private  canUseText: string;
		
		public  SimpleUseable(id: string, shortName: string, longName: string, value: number, description: string, useText: string, useFunction = undefined) 
		{
			super(id, shortName, longName, value, description);
			canUseFunction = useFunction;
			canUseText = useText;
		}
		
		public  canUse(): boolean 
		{
			clearOutput();
			if (canUseFunction != undefined)
			{
				canUseFunction();
			}
			else
			{
				outputText(canUseText);
			}
			return false;
		}
	}

