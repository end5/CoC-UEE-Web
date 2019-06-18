	
	/**
	 * Contains pregnancy progression and birth scenes for a Player impregnated by sandtrap.
	 */
	export class PlayerSandTrapPregnancy implements AnalPregnancy
	{
		private  pregnancyProgression:PregnancyProgression;
		private  output:GuiOutput;
		
		/**
		 * Create a new sandtrap pregnancy for the player. Registers pregnancy for sandtrap.
		 * @param	pregnancyProgression instance used for registering pregnancy scenes
		 * @param	output instance for gui output
		 */
		public  PlayerSandTrapPregnancy(pregnancyProgression:PregnancyProgression, output:GuiOutput) 
		{
			this.output = output;
			this.pregnancyProgression = pregnancyProgression;
			
			pregnancyProgression.registerAnalPregnancyScene(PregnancyStore.PREGNANCY_PLAYER, PregnancyStore.PREGNANCY_SANDTRAP, this);
		}
		
		/**
		 * @inheritDoc
		 */
		public  updateAnalPregnancy(): boolean 
		{
			//TODO remove this once new Player calls have been removed
		var  player:Player = kGAMECLASS.player;
		var  displayedUpdate: boolean = false;
			
			if (player.buttPregnancyIncubation === 36) {
				output.text("<b>\nYour bowels make a strange gurgling noise and shift uneasily.  You feel ");
				output.text("increasingly empty, as though some obstructions inside you were being broken down.");
				output.text("</b>\n");
				
				player.buttKnockUpForce();
				
				displayedUpdate = true;
			}
			
			return displayedUpdate;
		}
		
		/**
		 * @inheritDoc
		 */
		public  analBirth(): void 
		{
			// there is no birth, since the sand trap was not fertile
		}
	}

