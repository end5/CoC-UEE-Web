	
	/**
	 * Factory to create loggers for classes.
	 */
	export class LoggerFactory 
	{
		/**
		 * Symbols that cannot be used in a category name
		 */
		public static  ILLEGAL_SYMBOLS: string = "[]~$^&\/(){}<>+=`!#%?,:;'\"@";
		
		private static  PACKAGE_DELIMITER:RegExp = /::/g;
		private static  PACKAGE_DELIMITER_REPLACEMENT: string = ".";
		
		public  LoggerFactory() 
		{
			throw new IllegalOperationError("This class cannot be instantiated.");
		}
		
		/**
		 * Create a logger for the given class. Loggers are cached by mx.logging.Log, so using the same Class
		 * multiple times will return the same logger instance.
		 * @param	clazz to create a logger for
		 * @return a new logger for the class
		 */
		public static  getLogger(clazz:Class):ILogger {
		var  sanitizedFQN: string = getQualifiedClassName(clazz).replace(PACKAGE_DELIMITER, PACKAGE_DELIMITER_REPLACEMENT);
			return Log.getLogger(sanitizedFQN);
		}
	}

