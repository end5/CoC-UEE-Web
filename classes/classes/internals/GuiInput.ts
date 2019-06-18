	/**
	 * Using 'Extract interface' to use GUI functions without having to drag the CoC class, and with it,
	 * the entire fucking game, into a unit test.
	 */
	public interface GuiInput 
	{
	function  addButton(pos: number, text: string = "", func1 = undefined, arg1: any = -9000, arg2: any = -9000, arg3: any = -9000, toolTipText: string = "", toolTipHeader: string = ""):CoCButton;
		
	function  menu(): void;
	}

