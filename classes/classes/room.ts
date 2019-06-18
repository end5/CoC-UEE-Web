	/**
	 * ...
	 * @author Gedan
	 */
	export class room 
	{
		public  room() 
		{
			
		}
		
		public  RoomName: string; // Index name
		public  RoomDisplayName: string; // Header text
		
		public  NorthExit: string;
		public  NorthExitCondition;
		public  NorthExitTime: number = 0;
		
		public  EastExit: string;
		public  EastExitCondition;
		public  EastExitTime: number = 0;
		
		public  SouthExit: string;
		public  SouthExitCondition;
		public  SouthExitTime: number = 0;
		
		public  WestExit: string;
		public  WestExitCondition;
		public  WestExitTime: number = 0;
		
		public  RoomFunction;
	}
