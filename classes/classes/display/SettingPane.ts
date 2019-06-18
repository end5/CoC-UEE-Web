
	/**
	 * Provides a scrollable container for game settings.
	 * @author Kitteh6660
	 */
	export class SettingPane extends ScrollPane
	{	
		private  _stage:Stage;
		
		private  _content:Block;
		private  _contentChildren: number;

		private  _initialized: boolean = false;
		
		/**
		 * Initiate the BindingPane, setting the stage positioning and reference back to the input manager
		 * so we can generate function callbacks later.
		 * 
		 * @param	xPos			X position on the stage for the top-left corner of the ScrollPane
		 * @param	yPos			Y position on the stage for the top-left corner of the ScrollPane
		 * @param	width			Fixed width of the containing ScrollPane
		 * @param	height			Fixed height of the containing ScrollPane
		 */
		public  SettingPane(xPos: number, yPos: number, width: number, height: number)
		{
			move(xPos,yPos);
			setSize(width,height);
			// Initiate a new container for content that will be placed in the scroll pane
			_content = new Block({layoutConfig:{
				type: Block.LAYOUT_FLOW,
				direction: 'column',
				gap: 4
			}});
			_content.name = "controlContent";
			_content.addEventListener(Block.ON_LAYOUT,function(e:Event): void{
				if (content) {
					update();
				}
			});
			_contentChildren = 0;

			// Hook into some stuff so that we can fix some bugs that ScrollPane has
			this.addEventListener(Event.ADDED_TO_STAGE, addedToStage);
			this.content.addChild(_content);
		}
		
		/**
		 * Cleanly get us a reference to the stage to add/remove other event listeners
		 * @param	e
		 */
		private  addedToStage(e:Event): void
		{
			this.removeEventListener(Event.ADDED_TO_STAGE, addedToStage);
			this.addEventListener(Event.REMOVED_FROM_STAGE, removedFromStage);
			
			_stage = this.stage;
			
			_stage.addEventListener(MouseEvent.MOUSE_WHEEL, mouseScrollEvent);
		}
		
		private  removedFromStage(e:Event): void
		{
			this.removeEventListener(Event.REMOVED_FROM_STAGE, removedFromStage);
			this.addEventListener(Event.ADDED_TO_STAGE, addedToStage);
			
			_stage.removeEventListener(MouseEvent.MOUSE_WHEEL, mouseScrollEvent);
		}
		
		private  mouseScrollEvent(e:MouseEvent): void
		{
			this._vScrollbar.value += -( e.delta * 8 );
			update();
		}
		
		public  get initialized(): boolean { return _initialized; }
		public  set initialized(bool: boolean): void { _initialized = bool; }

		public  addHelpLabel():TextField {
			// Add a nice little instructional field at the top of the display.
		var  _textFormatLabel:TextFormat = new TextFormat();
			_textFormatLabel.size = 20;
			// Make the help label.
		var  helpLabel:TextField = new TextField();
			helpLabel.name = "helpLabel";
			helpLabel.x = 10;
			helpLabel.width = this.width - 40;
			helpLabel.defaultTextFormat = _textFormatLabel;
			helpLabel.multiline = true;
			helpLabel.wordWrap = true;
			helpLabel.autoSize = TextFieldAutoSize.LEFT; // With multiline enabled, this SHOULD force the textfield to resize itself vertically dependent on content.
			_content.addElement(helpLabel);
			return helpLabel;
		}
		
		public  addOrUpdateToggleSettings(label: string, args: any[]):BindDisplay {
		var  i: number;
		var  numberOfArgs: number = args.length;
			if (_content.getElementByName(label) != undefined) {
			var  existingSetting:BindDisplay = _content.getElementByName(label) as BindDisplay;
				for (i = 0; i < numberOfArgs; i++) {
					if (args[i] is String) {
						if (args[i] == "overridesLabel") {
							existingSetting.htmlText = args[i-1][2];
							existingSetting.buttons[i].hide();
						}
						continue;
					}
					existingSetting.buttons[i].disableIf(args[i][3]);
					if (args[i][3]) existingSetting.htmlText = "<b>" + label + ": " + colourifyText(args[i][0]) + "</b>\n<font size=\"14\">" + args[i][2] + "</font>";
				}
				return existingSetting;
			}
			else {
				_contentChildren++;
			var  newSetting:BindDisplay = new BindDisplay(this.width - 20, 55, args.length);
				newSetting.name = label;
				newSetting.label.multiline = true;
				newSetting.label.wordWrap = true;
				newSetting.htmlText = "<b>" + label + ":</b>\n";
				for (i = 0; i < numberOfArgs; i++) {
					if (args[i] is String) {
						if (args[i] == "overridesLabel") {
							newSetting.htmlText = args[i-1][2];
							newSetting.buttons[i].hide();
						}
					}
					else {
						newSetting.buttons[i].labelText = args[i][0];
						newSetting.buttons[i].callback = generateCallback(args[i][1]);
						newSetting.buttons[i].disableIf(args[i][3]);
						if (args[i][3]) newSetting.htmlText = "<b>" + label + ": " + colourifyText(args[i][0]) + "</b>\n<font size=\"14\">" + args[i][2] + "</font>";
					}
				}
				_content.addElement(newSetting);
				return newSetting;
			}
		}
		
		private  generateCallback(func) {
			return func;
		}
		
		private  colourifyText(text: string): string {
			if (text.toLowerCase() == "on" || text.toLowerCase() == "enabled") {
				text = "<font color=\"#008000\">" + text + "</font>";
			}
			else if (text.toLowerCase() == "off" || text.toLowerCase() == "disabled") {
				text = "<font color=\"#800000\">" + text + "</font>";
			}
			else if (text.toLowerCase() == "choose" || text.toLowerCase() == "enable") {
				text = "";
			}
			return text;
		}
	}

