	/**
	 * Generic input manager
	 * I feel sick writing some of these control functors; rather than having some form of queryable game state
	 * we're checking for the presence (and sometimes, the label contents) of UI elements to determine what state
	 * the game is currently in.
	 * @author Gedan
	 */
	export class InputManager 
	{
		private static  LOGGER:ILogger = LoggerFactory.getLogger(InputManager);
		// Declaring some consts for clarity when using some of the InputManager methods
		public static  PRIMARYKEY: boolean = true;
		public static  SECONDARYKEY: boolean = false;
		public static  NORMALCONTROL: boolean = false;
		public static  CHEATCONTROL: boolean = true;
		public static  UNBOUNDKEY: number = -1;
		
		private  _stage:Stage;
		private  _debug: boolean;

		private  _defaultControlMethods: Record<string, any> = new Object();
		private  _defaultAvailableControlMethods: number = 0;
		private  _defaultKeysToControlMethods: Record<string, any> = new Object();
		
		// Basically, an associative list of Names -> Control Methods
		private  _controlMethods: Record<string, any> = new Object();
		private  _availableControlMethods: number = 0;

		// A list of cheat control methods that we can throw incoming keycodes against at will
		private  _cheatControlMethods: any[] = new Array();
		private  _availableCheatControlMethods: number = 0;
		
		// The primary lookup method for finding what method an incoming keycode should belong too
		// Sparse array of keyCode -> BoundControlMethod.Name, used to look into _controlMethods
		private  _keysToControlMethods: Record<string, any> = new Object();
		
		// Visual shit
		private  _mainView:MainView;
		private  _mainText:TextField;

		// A new UI element that we can embed buttons into to facilitate key rebinding
		private  _bindingPane:BindingPane;
		
		// A flag to determine if we're listening for keyCodes to execute, or keyCodes to bind a method against
		private  _bindingMode: boolean;
		private  _bindingFunc: string;
		private  _bindingSlot: boolean;
		
		/**
		 * Init the InputManager. Attach the keyboard event listener to the stage and prepare the subobjects for usage.
		 * @param	stage	Reference to core stage on which to add display objects
		 * @param	_mainView
		 * @param	debug	Emit debugging trace statements
		 */
		public  InputManager(stage:Stage,
									 _mainView: MainView,
									 debug: boolean = true)
		{
			_bindingMode = false;
			_debug = debug;
			
			_stage = stage;
			this._mainView = _mainView;
			_availableControlMethods = 0;
			_availableCheatControlMethods = 0;
			
			_stage.addEventListener(KeyboardEvent.KEY_DOWN, this.KeyHandler);
			
			_mainText = _mainView.mainText as TextField;

			_bindingPane = new BindingPane(this, _mainText.x, _mainText.y, _mainText.width + 16, _mainText.height);
		}
		
		/**
		 * Mode toggle - keyboard events recieved by the input manager will be used to associated the incoming keycode
		 * with a new bound control method, removing the keycode from *other* bindings and updating data as appropriate.
		 * Displays a message indicating the player should do the needful.
		 * @param	funcName	BoundControlMethod name that they key is going to be associated with. Set by a button
		 * 						callback function generated in BindingPane
		 * @param	isPrimary	Specifies if the incoming bind will replace/set the primary or secondary bind for a control.
		 */
		public  ListenForNewBind(funcName: string, isPrimary: boolean = true): void
		{
			if (_debug)
			{
			var  slot: string = "";
				
				if (isPrimary)
				{
					slot = "Primary";
				}
				else
				{
					slot = "Secondary";
				}
				
				LOGGER.debug("Listening for a new " + slot + " bind for " + funcName);
			}
			
			_bindingMode = true;
			_bindingFunc = funcName;
			_bindingSlot = isPrimary;
			
			_mainText.htmlText = "<b>Hit the key that you want to bind " + funcName + " to!</b>";
			
			// hide some buttons that will fuck shit up
			_mainView.hideCurrentBottomButtons();
			
			HideBindingPane();
		}
		
		/**
		 * Mode toggle - return to normal keyboard event listening mechanics. Shows the binding display again.
		 */
		public  StopListenForNewBind(): void
		{
			_bindingMode = false;
			_mainView.showCurrentBottomButtons();
			DisplayBindingPane();
		}
		
		/**
		 * Add a new action that can be associated with incoming key codes.
		 * This will mostly be static after first being initialized, this pattern was just easier to capture references
		 * to the required game functions without having to make the InputManager truely global or doing any namespacing
		 * shenanigans.
		 * The closure can be declared with the rest of the game code, in the namespace where the functions are available,
		 * and still work inside this object.
		 * @param	name		Name to associate the BoundControlMethod with
		 * @param	desc		A description of the activity that the BoundControlMethod does. (Unused, but implemented)
		 * @param	func		A function object that defines the BoundControlMethods action
		 * @param	isCheat		Differentiates between a cheat method (not displayed in the UI) and normal controls.
		 */
		public  AddBindableControl(name: string, desc: string, func, isCheat: boolean = false): void
		{
			if (isCheat)
			{
				_cheatControlMethods.push(new BoundControlMethod(func, name, desc, _availableCheatControlMethods++));
			}
			else
			{
				_controlMethods[name] = new BoundControlMethod(func, name, desc, _availableControlMethods++);
			}
		}
		
		/**
		 * Set either the primary or secondary binding for a target control method to a given keycode.
		 * @param	keyCode		The keycode to bind the method to.
		 * @param	funcName	The name of the associated BoundControlMethod
		 * @param	isPrimary	Specifies the primary or secondary binding slot
		 */
		public  BindKeyToControl(keyCode: number, funcName: string, isPrimary: boolean = true): void
		{
			for (var key: string in _controlMethods)
			{
				// Find the method we want to bind the incoming key to
				if (funcName == key)
				{
					// Check if the incoming key is already bound to *something* and if it is, remove the bind.
					this.RemoveExistingKeyBind(keyCode);
					
					// If we're binding the primary key of the method...
					if (isPrimary)
					{
						// If the primary key of the method is already bound, removing the existing bind
						if (_controlMethods[key].PrimaryKey != InputManager.UNBOUNDKEY)
						{
							delete _keysToControlMethods[_controlMethods[key].PrimaryKey];
						}
						
						// Add the new bind
						_keysToControlMethods[keyCode] = key;
						_controlMethods[key].PrimaryKey = keyCode;
						return;
					}
					// We're doing the secondary key of the method
					else
					{
						// If the secondary key is already bound, remove the existing bind
						if (_controlMethods[key].SecondaryKey != InputManager.UNBOUNDKEY)
						{
							delete _keysToControlMethods[_controlMethods[key].SecondaryKey];
						}
						
						// Add the new bind
						_keysToControlMethods[keyCode] = key;
						_controlMethods[key].SecondaryKey = keyCode;
						return;
					}
				}
			}
			
			if (_debug) LOGGER.debug("Failed to bind control method [" + funcName + "] to keyCode [" + keyCode + "]");
		}
		
		/**
		 * Remove an existing key from a BoundControlMethod, if present, and shuffle the remaining key as appropriate
		 * @param	keyCode		The keycode to remove.
		 */
		public  RemoveExistingKeyBind(keyCode: number): void
		{
			// If the key is already bound to a method, remove it from that method
			if (_keysToControlMethods[keyCode] != undefined)
			{
				if (_controlMethods[_keysToControlMethods[keyCode]].PrimaryKey == keyCode)
				{
					_controlMethods[_keysToControlMethods[keyCode]].PrimaryKey = _controlMethods[_keysToControlMethods[keyCode]].SecondaryKey;
					_controlMethods[_keysToControlMethods[keyCode]].SecondaryKey = InputManager.UNBOUNDKEY;
				}
				else if (_controlMethods[_keysToControlMethods[keyCode]].SecondaryKey == keyCode)
				{
					_controlMethods[_keysToControlMethods[keyCode]].SecondaryKey = InputManager.UNBOUNDKEY;
				}
			}
		}
		
		/**
		 * The core event handler we attach to the stage to capture incoming keyboard events.
		 * @param	e		KeyboardEvent data
		 */
		public  KeyHandler(e:KeyboardEvent): void
		{
			if (_debug) LOGGER.debug("Got key input " + e.keyCode);
			
			// Ignore key input during certain phases of gamestate
			if (_mainView.eventTestInput.x == 207.5)
			{
				return;
			}
			
			if (_mainView.nameBox.visible && _stage.focus == _mainView.nameBox)
			{
				return;
			}
			
			// If we're not in binding mode, listen for key inputs to act on
			if (_bindingMode == false)
			{
				// Made it this far, process the key and call the relevant (if any) function
				this.ExecuteKeyCode(e.keyCode);
			}
			// Otherwise, we're listening for a new keycode from the player
			else
			{
				BindKeyToControl(e.keyCode, _bindingFunc, _bindingSlot);
				StopListenForNewBind();
			}
		}
		
		/**
		 * Execute the BoundControlMethod's wrapped function associated with the given KeyCode
		 * @param	keyCode		The KeyCode for which we wish to execute the BoundControlMethod for.
		 */
		private  ExecuteKeyCode(keyCode: number): void
		{
			if (_keysToControlMethods[keyCode] != undefined)
			{
				if (_debug) LOGGER.debug("Attempting to exec func [" + _controlMethods[_keysToControlMethods[keyCode]].Name + "]");
				
				_controlMethods[_keysToControlMethods[keyCode]].ExecFunc();
			}
			
			for (var i: number = 0; i < _cheatControlMethods.length; i++)
			{
				_cheatControlMethods[i].ExecFunc(keyCode);
			}
		}
		
		/**
		 * Hide the mainText object and scrollbar, ensure the binding ScrollPane is up to date with the latest
		 * data and then show the binding scrollpane.
		 */
		public  DisplayBindingPane(): void
		{
			_mainText.visible = false;

			_bindingPane.functions = this.GetAvailableFunctions();
			_bindingPane.ListBindingOptions();
			
			_mainText.parent.addChild(_bindingPane);
			_bindingPane.update();
		}
		
		/**
		 * Hide the binding ScrollPane, and re-display the mainText object + Scrollbar.
		 */
		public  HideBindingPane(): void
		{
			_mainText.visible = true;
			_bindingPane.parent.removeChild(_bindingPane);
		}
		
		/**
		 * Register the current methods, and their associated bindings, as the defaults.
		 * TODO: Finish this shit off
		 */
		public  RegisterDefaults(): void
		{
			for (var key: string in _controlMethods)
			{
				_defaultControlMethods[key] = new BoundControlMethod(
					_controlMethods[key].Func,
					_controlMethods[key].Name,
					_controlMethods[key].Description,
					_controlMethods[key].Index,
					_controlMethods[key].PrimaryKey,
					_controlMethods[key].SecondaryKey);
			}
			
			// Elbullshito mode -- 126 is the maximum keycode in as3 we're likely to see
			for (var i: number = 0; i <= 126; i++)
			{
				if (_keysToControlMethods[i] != undefined)
				{
					_defaultKeysToControlMethods[i] = _keysToControlMethods[i];
				}
			}
		}
		
		/**
		 * Reset the bound keys to the defaults previously registered.
		 */
		public  ResetToDefaults(): void
		{
			for (var key: string in _controlMethods)
			{
				_controlMethods[key] = new BoundControlMethod(
					_defaultControlMethods[key].Func,
					_defaultControlMethods[key].Name,
					_defaultControlMethods[key].Description,
					_defaultControlMethods[key].Index,
					_defaultControlMethods[key].PrimaryKey,
					_defaultControlMethods[key].SecondaryKey);
			}
			
			// Elbullshito mode -- 126 is the maximum keycode in as3 we're likely to see
			for (var i: number = 0; i <= 126; i++)
			{
				if (_defaultKeysToControlMethods[i] != undefined)
				{
					_keysToControlMethods[i] = _defaultKeysToControlMethods[i];
				}
			}
		}
		
		/**
		 * Get an array of the available functions.
		 * @return	Array of available BoundControlMethods.
		 */
		public  GetAvailableFunctions(): any[]
		{
		var  funcs: any[] = new Array();
			
			for (var key: string in _controlMethods)
			{
				if (_debug) LOGGER.debug(key);
				funcs.push(_controlMethods[key]);
			}
			funcs.sortOn( ["Index"], [Array.NUMERIC] );
			
			return funcs;
		}
		

		/**
		 * Get an array of the currently active keyCodes.
		 * @return	Array of active keycodes.
		 */
		public  GetControlMethods(): any[]
		{
		var  buttons: any[] = new Array();
			for (var key: any in _keysToControlMethods)
			{
				buttons.push(key);
			}
			
			return buttons;
		}

		/**
		 * Clear all currently bound keys.
		 */
		public  ClearAllBinds(): void
		{
			for (var key: string in _controlMethods)
			{
				_controlMethods[key].PrimaryKey = InputManager.UNBOUNDKEY;
				_controlMethods[key].SecondaryKey = InputManager.UNBOUNDKEY;
			}
			
			_keysToControlMethods = new Object();
		}
		
		/**
		 * Load bindings from a source "Object" retrieved from a game save file.
		 * @param	source	Source object to enumerate for binding data.
		 */
		public  LoadBindsFromObj(source: Record<string, any>): void
		{
			this.ClearAllBinds();
			
			for (var key: string in source)
			{
			var  pKeyCode: number = source[key].PrimaryKey;
			var  sKeyCode: number = source[key].SecondaryKey;
				
				if (pKeyCode != InputManager.UNBOUNDKEY)
				{
					this.BindKeyToControl(pKeyCode, key, InputManager.PRIMARYKEY);
				}
				
				if (sKeyCode != InputManager.UNBOUNDKEY)
				{
					this.BindKeyToControl(sKeyCode, key, InputManager.SECONDARYKEY);
				}
			}
		}
		
		/**
		 * Create an associative object that can serialise the bindings to the users save file.
		 * @return	Dynamic object of control bindings.
		 */
		public  SaveBindsToObj(): Record<string, any>
		{
		var  controls: Record<string, any> = new Object();
			
			for (var key: string in _controlMethods)
			{
				if (_debug) LOGGER.debug(key);
			var  ctrlObj: any = new Object();
				ctrlObj.PrimaryKey = _controlMethods[key].PrimaryKey;
				ctrlObj.SecondaryKey = _controlMethods[key].SecondaryKey;
				
				controls[key] = ctrlObj;
			}
			
			return controls;
		}
	}
	
	/**
	 * List of known bound keyboard methods
	 * 
	 * Some of the methods use an undefined "Event" parameter to pass into the actual UI components...
	 * ... strip this out and instead modify the handlers on the execution end to have a default undefined parameter?
	 * 
	 * ** Bypass handler if mainView.eventTestInput.x == 270.5
	 * ** Bypass handler if mainView.nameBox.visible && stage.focus == mainView.nameBox
	 * 
	 * 38	-- UpArrow			-- Cheat code for Humus stage 1
	 * 40	-- DownArrow		-- Cheat code for Humus stage 2
	 * 37 	-- LeftArrow		-- Cheat code for Humus stage 3
	 * 39	-- RightArrow		-- Cheat code for Humus stage 4 IF str > 0, not gameover, give humus
	 * 
	 * 83	-- s				-- Display stats if main menu button displayed
	 * 76	-- l				-- Level up if level up button displayed
	 * 112	-- F1				-- Quicksave to slot 1 if menu_data displayed
	 * 113	-- F2				-- Quicksave slot 2
	 * 114	-- F3				-- Quicksave slot 3
	 * 115	-- F4				-- Quicksave slot 4
	 * 116	-- F5				-- Quicksave slot 5
	 * 
	 * 117	-- F6				-- Quickload slot 1
	 * 118	-- F7				-- Quickload slot 2
	 * 119	-- F8				-- Quickload slot 3
	 * 120	-- F9				-- Quickload slot 4
	 * 121	-- F10				-- Quickload slot 5
	 * 
	 * 8	-- Backspace		-- Go to "Main" menu if in game
	 * 68	-- d				-- Open saveload if in game
	 * 65	-- a				-- Open apperance if in game
	 * 78	-- n				-- "no" if button index 1 displays no		<--
	 * 89	-- y				-- "yes" if button index 0 displays yes		<-- These two seem akward
	 * 80	-- p				-- display perks if in game
	 * 
	 * 13/32 -- Enter/Space		-- if button index 0,4,5,9 or 14 has text of (nevermind, abandon, next, return, back, leave, resume) execute it
	 * 
	 * 36	-- Home				-- Cycle the background of the maintext area
	 * 
	 * 49	-- 1				-- Execute button index 0 if visisble
	 * 50	-- 2				-- ^ index 1
	 * 51	-- 3				-- ^ index 2
	 * 52	-- 4				-- ^ index 3
	 * 53	-- 5				-- ^ index 4
	 * 54/81-- 6/q				-- ^ index 5
	 * 55/87-- 7/w				-- ^ index 6
	 * 56/69-- 8/e				-- ^ index 7
	 * 57/82-- 9/r				-- ^ index 8
	 * 48/84-- 0/t				-- ^ index 9
	 * 
	 * 68	-- ???				-- ??? Unknown, theres a conditional check for the button, but no code is ever executed
	 */
