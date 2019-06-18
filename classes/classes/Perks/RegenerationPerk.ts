
	export class RegenerationPerk extends PerkType
	{
		
		public  desc(params:Perk = undefined): string
		{
			if (kGAMECLASS.flags[kFLAGS.HUNGER_ENABLED] > 0 && kGAMECLASS.player.hunger < 25) return "<b>DISABLED</b> - You are too hungry!";
			else return super.desc(params);
		}
		
		public  RegenerationPerk() 
		{
			super("Regeneration", "Regeneration",
				"Regenerates 2% of max HP/hour and 1% of max HP/round.",
				"You choose the 'Regeneration' perk, allowing you to heal 1% of max HP every round of combat and 2% of max HP every hour!");
		}
		
	}


