	/**
	 * Defines a container to wrap a closure around a game function, associating the callable object
	 * with a string name representation of the action undertaken, a description, and the associated
	 * keyCodes that the action is triggered by.
	 * The keyCodes are stored here primarily for ease of display, as we have a handy refernece for
	 * a displayable function name AND the actual keyCodes the function uses. The actual interface used
	 * for incoming key code -> do action is internal to the InputManager instance.
	 * @author Gedan
	 */
	export class BoundControlMethod
	{
		private  _funcToCall;
		private  _shortName: string;
		private  _descript: string;
		
		private  _primaryKey: number;
		private  _secondaryKey: number;
		
		private  _index: number;
		
		/**
		 * Define a new bindable control method with "Unbound" keys.
		 * 	
		 * @param	func			The function closure used by this BoundControlMethod
		 * @param	name			The friendly name used for this BoundControlMethod
		 * @param	desc			A Description of what the BoundControlMethod does
		 * @param 	primaryKey		The primary bound key code
		 * @param	secondarykey 	The secondary bound key code
		 */
		public  BoundControlMethod(func, name: string, desc: string, index: number, primaryKey: number = -1, secondaryKey: number = -1) 
		{
			_funcToCall = func;
			_shortName = name;
			_descript = desc;
			_index = index;
			
			_primaryKey = primaryKey;
			_secondaryKey = secondaryKey;
		}
		
		/**
		 * Execute the wrapped BoundControlMethod. Uses an apply() call, so that arguments
		 * can be passed to the wrapped function.
		 * @param	... args	Args to pass to the wrapped function.
		 */
		public  ExecFunc(... args): void
		{
			_funcToCall.apply(undefined, args);
		}
		
		public  get Name(): string
		{
			return _shortName;
		}
		
		public  get Description(): string
		{
			return _descript;
		}
		
		public  get Func()
		{
			return _funcToCall;
		}
		
		public  get PrimaryKey(): number
		{
			return _primaryKey;
		}
		
		public  set PrimaryKey(keyCode: number): void
		{
			_primaryKey = keyCode;
		}
		
		public  get SecondaryKey(): number
		{
			return _secondaryKey;
		}
		
		public  set SecondaryKey(keyCode: number): void
		{
			_secondaryKey = keyCode;
		}
		
		public  get Index(): number
		{
			return _index;
		}
	}

