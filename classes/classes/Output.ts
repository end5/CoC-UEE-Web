	
	/**
	 * Class to replace the old and somewhat outdated output-system, which mostly uses the include-file includes/engineCore.as
	 * @since  08.08.2016
	 * @author Stadler76
	 */
	export class Output implements GuiOutput
	{
		public static  MAX_BUTTON_INDEX: number = 14;
		

		private static  _instance:Output = new Output();
		private static  HISTORY_MAX: number = 20;

		public  Output()
		{
			if (_instance != undefined)
			{
				throw new Error("Output can only be accessed through Output.init()");
			}
		}

		public static  init():Output { return _instance; }

		protected  _currentText: string = "";
		protected  _history: any[] = [""];

		public  forceUpdate(): void { kGAMECLASS.forceUpdate(); }

		/**
		 * Passes the text through the parser and adds it to the output-buffer 
		 *
		 * If you want to clear the output before adding text, use clear(true) or just clear()
		 *
		 * @param   text    The text to be added
		 * @return  The instance of the class to support the 'Fluent interface' aka method-chaining
		 */
		public  text(text: string):GuiOutput
		{
			// This is cleaup in case someone hits the Data or new-game button when the event-test window is shown. 
			// It's needed since those buttons are available even when in the event-tester
			kGAMECLASS.mainView.hideTestInputPanel();

			text = kGAMECLASS.parser.recursiveParser(text);
			record(text);
			_currentText += text;

			return this;
		}

		/**
		 * Flushes the buffered output to the GUI aka displaying it
		 *
		 * This doesn't clear the output buffer, so you can add more text after that and flush it again.
		 * flush() always ends a method chain, so you need to start a new one.
		 * 
		 * <b>Note:</b> Calling this with open formatting tags can result in strange behaviour, 
		 * e.g. all text will be formatted instead of only a section.
		 */
		public  flush(): void
		{
			kGAMECLASS.mainViewManager.setText(_currentText);
			kGAMECLASS.credits.show();
		}

		/**
		 * Adds a formatted headline to the output-buffer
		 *
		 * @param	headLine    The headline to be formatted and added
		 * @return  The instance of the class to support the 'Fluent interface' aka method-chaining
		 */
		public  header(headLine: string):GuiOutput
		{
			return text(formatHeader(headLine));
		}

		/**
		 * Returns the formatted headline
		 *
		 * @param	headLine    The headline to be formatted
		 * @return  The formatted headline
		 */
		public  formatHeader(headLine: string): string
		{
			return "<font size=\"36\" face=\"Georgia\"><u>" + headLine + "</u></font>\n";
		}

		/**
		 * Clears the output-buffer
		 *
		 * @param   hideMenuButtons   Set this to true to hide the menu-buttons (rarely used)
		 * @return  The instance of the class to support the 'Fluent interface' aka method-chaining
		 */
		public  clear(hideMenuButtons: boolean = false):GuiOutput
		{
			if (hideMenuButtons) {
				forceUpdate();
				if (kGAMECLASS.gameState != 3) kGAMECLASS.mainView.hideMenuButton(MainView.MENU_DATA);
				kGAMECLASS.mainView.hideMenuButton(MainView.MENU_APPEARANCE);
				kGAMECLASS.mainView.hideMenuButton(MainView.MENU_LEVEL);
				kGAMECLASS.mainView.hideMenuButton(MainView.MENU_PERKS);
				kGAMECLASS.mainView.hideMenuButton(MainView.MENU_STATS);
			}
			nextEntry();
			_currentText = "";
			kGAMECLASS.mainView.hideMainText();
			kGAMECLASS.mainView.clearOutputText();
			kGAMECLASS.credits.clear();
			kGAMECLASS.mainView.showMainText(); //Hide and show to likely force clear stuck bold.
			return this;
		}

		/**
		 * Adds raw text to the output without passing it through the parser
		 *
		 * If you want to clear the output before adding raw text, use clear(true) or just clear()
		 * The second param `purgeText: boolean = false` is not supported anymore in favor of using clear() and will never return.
		 *
		 * @param   text    The text to be added to the output-buffer
		 * @return  The instance of the class to support the 'Fluent interface' aka method-chaining
		 */
		public  raw(text: string):Output
		{
			_currentText += text;
			record(text);
			//mainView.setOutputText(_currentText);
			return this;
		}

		/**
		 * Appends a raw text to history, appending to last entry
		 * @param text The text to be added to history
		 * @return this
		 */
		public  record(text: string):Output {
			if (_history.length==0) _history=[""];
			_history[_history.length-1] += text;
			return this;
		}
		/**
		 * Appends a new text entry to the history
		 * @param text The text to be added to history as a separate and complete entry
		 * @return this
		 */
		public  entry(text: string):Output {
			nextEntry();
			record(text);
			nextEntry();
			return this;
		}

		/**
		 * Finishes the history entry, starting a new one and removing old entries as
		 * history grows
		 * @return this
		 */
		public  nextEntry():Output {
			if (_history.length==0) _history=[""];
			if (_history[_history.length-1].length>0) _history.push("");
			while(_history.length > HISTORY_MAX) _history.shift();
			return this;
		}

		/**
		 * Clears current history enter -- removes everything recorded since last 'clearOutput', 'entry', or 'nextEntry'
		 * @return this
		 */
		public  clearCurrentEntry():Output {
			if (_history.length==0) _history=[""];
			_history[_history.length-1] = "";
			return this;
		}
		/**
		 * @return this
		 */
		public  clearHistory():Output {
			_history = [""];
			return this;
		}

		/**
		 * Displays all recorded history (with current text at the end), and scrolls to the bottom.
		 * @return this
		 */
		public  showHistory():Output
		{
			clear();
		var  txt: string = _history.join("<br>");
			nextEntry();
			raw(txt);
			clearCurrentEntry();
			// On the next animation frame
			setTimeout(function(): void {
				kGAMECLASS.mainView.scrollBar.value = kGAMECLASS.mainView.scrollBar.maximum;
			},0);
			return this;
		}
		
		/**
		 * Get the old stats variable from CoC. 
		 * @return legacy oldstats variable
		 */
		private  getOldStats(): Record<string, any> {
			return kGAMECLASS.oldStats;
		}
		
		public  showUpDown(): void {
		var  oldStats: Record<string, any> = getOldStats();
			
		function  _oldStatNameFor(statName: string): string {
				return 'old' + statName.charAt(0).toUpperCase() + statName.substr(1);
			}

		var  statName: string;
		var 	oldStatName: string;
		var  allStats: any[];

			allStats = ["str", "tou", "spe", "inte", "lib", "sens", "cor", "HP", "lust", "fatigue", "hunger"];

			for each(statName in allStats) {
				oldStatName = _oldStatNameFor(statName);

				if (kGAMECLASS.player[statName] > oldStats[oldStatName]) {
					kGAMECLASS.mainView.statsView.showStatUp(statName);
				}
				if (kGAMECLASS.player[statName] < oldStats[oldStatName]) {
					kGAMECLASS.mainView.statsView.showStatDown(statName);
				}
			}
		}
		
		public  buttonIsVisible(index: number): boolean {
			if ( index < 0 || index > MAX_BUTTON_INDEX ) {
				return undefined;
			}
			else {
				return kGAMECLASS.output.button(index).visible;
			}
		}
		
		public  buttonTextIsOneOf(index: number, possibleLabels: any[]): boolean {
		var  label: string;
		var  buttonText: string;

			buttonText = this.getButtonText(index);

			return (possibleLabels.indexOf(buttonText) != -1);
		}
		
		public  getButtonText(index: number): string {
		var  matches: any;

			if (index < 0 || index > MAX_BUTTON_INDEX) {
				return '';
			}
			else {
				return kGAMECLASS.output.button(index).labelText;
			}
		}
		
		/**
		 * Adds a button.
		 * @param	pos Determines the position. Starts at 0. (First row is 0-4, second row is 5-9, third row is 10-14.)
		 * @param	text Determines the text that will appear on button.
		 * @param	func1 Determines what function to trigger.
		 * @param	arg1 Pass argument #1 to func1 parameter.
		 * @param	arg2 Pass argument #1 to func1 parameter.
		 * @param	arg3 Pass argument #1 to func1 parameter.
		 * @param	toolTipText The text that will appear on tooltip when the mouse goes over the button.
		 * @param	toolTipHeader The text that will appear on the tooltip header. If not specified, it defaults to button text.
		 */
		public  addButton(pos: number, text: string = "", func1 = undefined, arg1: any = -9000, arg2: any = -9000, arg3: any = -9000, toolTipText: string = "", toolTipHeader: string = ""):CoCButton {
		var  btn:CoCButton = kGAMECLASS.output.button(pos);
			if (func1==undefined) {
				return btn.hide();
			}
		var  callback;

			//Removes sex-related button in SFW mode.
			if (kGAMECLASS.flags[kFLAGS.SFW_MODE] > 0) {
				if (text.indexOf("Sex") != -1 || text.indexOf("Threesome") != -1 ||  text.indexOf("Foursome") != -1 || text == "Watersports" || text == "Make Love" || text == "Use Penis" || text == "Use Vagina" || text.indexOf("Fuck") != -1 || text.indexOf("Ride") != -1 || (text.indexOf("Mount") != -1 && text.indexOf("Mountain") == -1) || text.indexOf("Vagina") != -1) {
					return btn.hide();
				}
			}
			callback = kGAMECLASS.createCallBackFunction(func1, arg1, arg2, arg3);

			btn.show(text,callback, toolTipText, toolTipHeader);
			flush();
			return btn;
		}
		
		public  addButtonDisabled(pos: number, text: string = "", toolTipText: string = "", toolTipHeader: string = ""):CoCButton {
		var  btn:CoCButton = kGAMECLASS.output.button(pos);
			//Removes sex-related button in SFW mode.
			if (kGAMECLASS.flags[kFLAGS.SFW_MODE] > 0) {
				if (text.indexOf("Sex") != -1 || text.indexOf("Threesome") != -1 ||  text.indexOf("Foursome") != -1 || text == "Watersports" || text == "Make Love" || text == "Use Penis" || text == "Use Vagina" || text.indexOf("Fuck") != -1 || text.indexOf("Ride") != -1 || (text.indexOf("Mount") != -1 && text.indexOf("Mountain") == -1) || text.indexOf("Vagina") != -1) {
					//trace("Button removed due to SFW mode.");
					return btn.hide();
				}
			}

			btn.showDisabled(text,toolTipText,toolTipHeader);
			return btn;
		}
		
		public  button(pos: number):CoCButton {
			return kGAMECLASS.mainView.bottomButtons[pos];
		}
		
		/**
		 * Removes a button.
		 * @param	arg The position to remove a button. (First row is 0-4, second row is 5-9, third row is 10-14.)
		 */
		public  removeButton(arg: any): void {
		var  buttonToRemove: number = 0;
			if (arg is String) {
				buttonToRemove = kGAMECLASS.mainView.indexOfButtonWithLabel( arg as String );
			}
			if (arg is Number) {
				if (arg < 0 || arg > MAX_BUTTON_INDEX) return;
				buttonToRemove = int(arg);
			}
			kGAMECLASS.mainView.hideBottomButton( buttonToRemove );
		}
		
		/**
		 * Hides all bottom buttons.
		 * 
		 * <b>Note:</b> Calling this with open formatting tags can result in strange behaviour, 
		 * e.g. all text will be formatted instead of only a section.
		 */
		public  menu(): void { //The newer, simpler menu - blanks all buttons so addButton can be used
			for (var i: number = 0; i <= MAX_BUTTON_INDEX; i++) {
				kGAMECLASS.mainView.hideBottomButton(i);
			}
			flush();
		}
		
		/**
		 * Clears all button and adds a 'Yes' and a 'No' button.
		 * @param	eventYes The event parser or function to call if 'Yes' button is pressed.
		 * @param	eventNo The event parser or function to call if 'No' button is pressed.
		 */
		public  doYesNo(eventYes, eventNo): void { //New typesafe version
			menu();
			addButton(0, "Yes", eventYes);
			addButton(1, "No", eventNo);
		}
		
		/**
		 * Clears all button and adds a 'Next' button.
		 * @param	event The event function to call if the button is pressed.
		 */
		public  doNext(event): void { //Now typesafe
			//Prevent new events in combat from automatically overwriting a game over. 
			if (kGAMECLASS.mainView.getButtonText(0).indexOf("Game Over") != -1) {
				return;
			}
			menu();
			addButton(0, "Next", event);
		}
		
		/**
		 * Used to update the display of statistics
		 */
		public  statScreenRefresh(): void {
			kGAMECLASS.mainView.statsView.show(); // show() method refreshes.
			kGAMECLASS.mainViewManager.refreshStats();
		}
		
		/**
		 * Show the stats pane. (Name, stats and attributes)
		 */
		public  showStats(): void {
			kGAMECLASS.mainView.statsView.show();
			kGAMECLASS.mainViewManager.refreshStats();
			kGAMECLASS.mainViewManager.tweenInStats();
		}
		
		/**
		 * Hide the stats pane. (Name, stats and attributes)
		 */
		public  hideStats(): void {
			if (!kGAMECLASS.mainViewManager.buttonsTweened) {
				kGAMECLASS.mainView.statsView.hide();
			}
			
			kGAMECLASS.mainViewManager.tweenOutStats();
		}
		
		/**
		 * Hide the top buttons.
		 */
		public  hideMenus(): void {
			kGAMECLASS.mainView.hideAllMenuButtons();
		}
		
		/**
		 * Hides the up/down arrow on stats pane.
		 */
		public  hideUpDown(): void {
			kGAMECLASS.mainView.statsView.hideUpDown();
			//Clear storage values so up/down arrows can be properly displayed
			kGAMECLASS.oldStats.oldStr = 0;
			kGAMECLASS.oldStats.oldTou = 0;
			kGAMECLASS.oldStats.oldSpe = 0;
			kGAMECLASS.oldStats.oldInte = 0;
			kGAMECLASS.oldStats.oldLib = 0;
			kGAMECLASS.oldStats.oldSens = 0;
			kGAMECLASS.oldStats.oldCor = 0;  
			kGAMECLASS.oldStats.oldHP = 0;
			kGAMECLASS.oldStats.oldLust = 0;
			kGAMECLASS.oldStats.oldFatigue = 0;
			kGAMECLASS.oldStats.oldHunger = 0;
		}
	}

