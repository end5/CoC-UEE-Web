	/**
	 * ...
	 * @author Fake-Name
	 */
	export class CoC_Settings
	{
		private static  LOGGER:ILogger = LoggerFactory.getLogger(CoC_Settings);

		public static  debugBuild: boolean = CONFIG::debug;

		// Horrible static abuse FTW
		public static  haltOnErrors: boolean = false;
		private static  bufferSize: number = 50;

		/**
		 * trace("ERROR "+description);
		 * If haltOnErrors=true, throws Error
		 */
		public static  error(description: string=""): void {
			LOGGER.error("ERROR "+description);
			if (haltOnErrors) throw Error(description);
		}

		/**
		 * trace("ERROR Abstract method call: "+clazz+"."+method+"(). "+description);
		 * If haltOnErrors=true, throws Error
		 */
		public static  errorAMC(clazz: string,method: string,description: string=""): void{
			error("Abstract method call: "+clazz+"."+method+"(). "+description);
		}
		
		public  CoC_Settings() {}
		
	}

