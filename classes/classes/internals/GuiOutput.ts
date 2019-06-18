	
	/**
	 * Minimal interface to allow output to the GUI. This interface is used to break the dependencies that would
	 * get dragged in when using the Output class directly.
	 */
	public interface GuiOutput 
	{
	function  text(text: string):GuiOutput;
		
	function  flush(): void;
		
	function  header(headLine: string):GuiOutput;
		
	function  clear(hideMenuButtons: boolean = false):GuiOutput;
	}

