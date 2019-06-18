
/**
 * Helper class to deal with the CoC class GUI dependency.
 * 
 * Source: any https://forums.adobe.com/message/4235833#4235833
 */
	export class StageLocator {
		//public static var instance:StageLocator;
		private static  _stage:Stage;
		
		public  StageLocator ($stage:Stage) {
			//instance = this;
			_stage = $stage;
		}
		public static  get stage():Stage { return _stage; }
	}
