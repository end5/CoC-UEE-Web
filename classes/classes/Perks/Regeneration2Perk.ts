
	export class Regeneration2Perk extends PerkType
	{
		
		public  desc(params:Perk = undefined): string
		{
			if (kGAMECLASS.flags[kFLAGS.HUNGER_ENABLED] > 0 && kGAMECLASS.player.hunger < 25) return "<b>DISABLED</b> - You are too hungry!";
			else return super.desc(params);
		}
		
		public  Regeneration2Perk() 
		{
			super("Regeneration 2", "Regeneration 2",
				"Regenerates further 2% of max HP/hour and 1% of max HP/round.",
				"You choose the 'Regeneration 2' perk, giving you an additional 1% of max HP per turn in combat and 2% of max HP per hour.");
		}
		
	}


