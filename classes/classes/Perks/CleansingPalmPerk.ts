
	export class CleansingPalmPerk extends PerkType
	{

		public  desc(params:Perk = undefined): string
		{
			if (!player.isPureEnough(10)) return "<b>DISABLED</b> - Corruption too high!";
			else return super.desc(params);
		}

		public  CleansingPalmPerk()
		{
			super("Cleansing Palm", "Cleansing Palm", "A ranged fighting technique of Jojo’s order, allows you to blast your enemies with waves of pure spiritual energy, weakening them and hurting the corrupt.");
		}
	}

