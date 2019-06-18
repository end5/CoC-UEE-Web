
	 /**
	 * Class to handle the credits box
	 * @since  22.12.2017
	 * @author Stadler76
	 */
	export class Credits 
	{
		public  headline: string = 'Scene by:';
		public  authorText: string = '';
		public  modContent: boolean = false;

		private static  _instance:Credits = new Credits();

		public  Credits()
		{
			if (_instance != undefined)
			{
				throw new Error("Credits can only be accessed through Credits.init()");
			}
		}

		public static  init():Credits { return _instance; }

		protected  get creditsBox():TextField
		{
			return kGAMECLASS.mainView.creditsBox;
		}

		public  show(): void
		{
			creditsBox.htmlText = "";
			if (authorText !== '') creditsBox.htmlText += '<font face="Palatino Linotype"><b>' + headline + '</b> ' + authorText + '</font>\n';
			if (modContent) creditsBox.htmlText += '<font face="Palatino Linotype"><b>Mod Content</b></font>';
		}

		public  clear(): void
		{
			creditsBox.htmlText = '';
			headline = 'Scene by:';
			authorText = '';
			modContent = false;
		}
	}
