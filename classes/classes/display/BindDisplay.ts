	
	/**
	 * Defines a composite display object of all the seperate components required to display a 
	 * single BoundControlMethod, its associated primary and secondary bindings with the buttons
	 * used to bind methods to new keys.
	 * @author Gedan
	 */
	export class BindDisplay extends Block
	{
		// Object components and settings
		private  _nameLabel:TextField;
		private  _buttons: any[] = [];
		
		/**
		 * Create a new composite object, initilizing the label to be used for display, as well as the two
		 * buttons used for user interface.
		 * 
		 * @param	maxWidth	Defines the maximum available width that the control can consume for positining math
		 * @param	buttons		Defines the number of buttons to be generated
		 */
		public  BindDisplay(maxWidth: number, maxHeight: number = 40, buttons: number = 2) 
		{
			layoutConfig = {
				type: Block.LAYOUT_FLOW,
				cols: 1 + buttons,
				setWidth: true
			};
			width = maxWidth;
			height = maxHeight;
			_nameLabel = addTextField( {
				text:"THIS IS SOME KINDA CRAZY LABEL",
				width: 440,
				defaultTextFormat: {
					font: 'Times New Roman',
					size: 20,
					align: 'right'
				}
			});
			for (var i: number = 0; i < buttons; i++) {
			var  button:CoCButton = new CoCButton({
					width: (buttons <= 2 ? MainView.BTN_W : MainView.BTN_W * (2 / buttons)),
					labelText: 'Unbound',
					bitmapClass: MainView.ButtonBackground0,
					callback: undefined
				})
				_buttons.push(button);
				addElement(button);
			}
		}
		
		public  addButton(label: string, cb):CoCButton {
		var  button:CoCButton = new CoCButton({
				labelText: label,
				bitmapClass: MainView.ButtonBackground0,
				callback: cb
			})
			_buttons.push(button);
			addElement(button);
			return button;
		}
		
		public  get htmlText(): string { return _nameLabel.htmlText; }
		public  set htmlText(value: string): void { _nameLabel.htmlText = value; }
		
		public  get buttons(): any[] { return _buttons; }
		public  get label():TextField { return _nameLabel; }
	}

