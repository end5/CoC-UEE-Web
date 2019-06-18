
	export class EnlightenedPerk extends PerkType
	{

		public  desc(params:Perk = undefined): string
		{
			if (!player.isPureEnough(10)) return "<b>DISABLED</b> - Corruption too high!";
			else return super.desc(params);
		}

		public  EnlightenedPerk()
		{
			super("Enlightened", "Enlightened", "Jojo’s tutelage has given you a master’s focus and you can feel the universe in all its glory spread out before you. You’ve finally surpassed your teacher.");
		}
	}

