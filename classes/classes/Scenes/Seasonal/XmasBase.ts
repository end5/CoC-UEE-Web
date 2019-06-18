	
	export class XmasBase extends BaseContent
	{
		public  xmasElf:XmasElf = new XmasElf();
		public  xmasMisc:XmasMisc = new XmasMisc();
		public  jackFrost:XmasJackFrost = new XmasJackFrost();
		public  snowAngel:XmasSnowAngel = new XmasSnowAngel();
		
		public  XmasBase() {}
		
		public  isItHolidays(): boolean {
			return (date.date >= 25 && date.month == 11 || flags[kFLAGS.ITS_EVERY_DAY] > 0 || player.findPerk(PerkLib.AChristmasCarol) >= 0);
		}
		
	}

