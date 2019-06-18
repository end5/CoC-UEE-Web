	
	/**
	 * Contains pregnancy progression and birth scenes for a Player impregnated by Benoit.
	 */
	export class PlayerBenoitPregnancy implements VaginalPregnancy
	{
		private  output:GuiOutput;
		private  pregnancyProgression:PregnancyProgression;
		
		/**
		 * Create a new Benoit pregnancy for the player. Registers pregnancy for Benoit.
		 * @param	pregnancyProgression instance used for registering pregnancy scenes
		 * @param	output instance for gui output
		 */
		public  PlayerBenoitPregnancy(pregnancyProgression:PregnancyProgression, output:GuiOutput) 
		{
			// needed as an instance variable for refactor test code (detectVaginalBirth)
			this.pregnancyProgression = pregnancyProgression;
			this.output = output;
			
			pregnancyProgression.registerVaginalPregnancyScene(PregnancyStore.PREGNANCY_PLAYER, PregnancyStore.PREGNANCY_BENOIT, this);
		}
		
		/**
		 * @inheritDoc
		 */
		public  updateVaginalPregnancy(): boolean 
		{
			//TODO remove this once new Player calls have been removed
		var  player:Player = kGAMECLASS.player;
		var  displayedUpdate: boolean = false;
			
			if (player.pregnancyIncubation === 185) {
				output.text("\n<b>Your belly grumbles as if empty, even though you ate not long ago.  Perhaps with all the exercise you're getting you just need to eat a little bit more.</b>\n");
				
				displayedUpdate = true;
			}
			
			if (player.pregnancyIncubation === 160) {
				output.text("\n<b>Your belly looks a little pudgy");
				
				if (player.thickness > 60 && player.tone < 40) {
					output.text(" even for you");
				}
				
				output.text(", maybe you should cut back on all the food you've been consuming lately?</b>\n");
				
				displayedUpdate = true;	
			}
			
			if (player.pregnancyIncubation === 140) {
				output.text("\n<b>Your belly is definitely getting bigger, and no matter what you do, you can't seem to stop yourself from eating at the merest twinge of hunger.  The only explanation you can come up with is that you've gotten pregnant during your travels.  Hopefully it won't inconvenience your adventuring.</b>\n");
				
				displayedUpdate = true;
			}
			
			if (player.pregnancyIncubation === 110) {
				output.text("\n<b>Your belly has gotten nice and big, perhaps as big as you remember the bellies of the pregnant women back home being.  The elders always did insist on everyone doing their part to keep the population high enough to sustain the loss of a champion every year.  You give yourself a little hug, getting a surge of happiness from your hormone-addled body.  Pregnancy sure is great!</b>\n");
				displayedUpdate = true;
			}
			
			if (player.pregnancyIncubation === 72) {
				output.text("\n<b>The huge size of your pregnant belly constantly impedes your movement, but the constant squirming and shaking of your unborn offspring makes you pretty sure you won't have to carry them much longer.  A sense of motherly pride wells up in your breast - you just know you'll have such wonderful babies.");
				
				if (player.cor < 50) {
					output.text("  You shudder and shake your head, wondering why you're thinking such unusual things.");
				}
				
				output.text("</b>\n");
				
				displayedUpdate = true;
			}
			
			if (player.pregnancyIncubation === 32 || player.pregnancyIncubation === 64 || player.pregnancyIncubation === 85 || player.pregnancyIncubation === 150) {
				//Increase lactation!
				if (player.biggestTitSize() >= 3 && player.mostBreastsPerRow() > 1 && player.biggestLactation() >= 1 && player.biggestLactation() < 2) {
					output.text("\nYour breasts feel swollen with all the extra milk they're accumulating.\n");
					player.boostLactation(.5);
					
					displayedUpdate = true;
				}
				
				if (player.biggestTitSize() >= 3 && player.mostBreastsPerRow() > 1 && player.biggestLactation() > 0 && player.biggestLactation() < 1) {
					output.text("\nDrops of breastmilk escape your nipples as your body prepares for the coming birth.\n");
					player.boostLactation(.5);
					
					displayedUpdate = true;
				}
				
				//Lactate if large && not lactating
				if (player.biggestTitSize() >= 3 && player.mostBreastsPerRow() > 1 && player.biggestLactation() === 0) {
					output.text("\n<b>You realize your breasts feel full, and occasionally lactate</b>.  It must be due to the pregnancy.\n");
					player.boostLactation(1);
					
					displayedUpdate = true;
				}
				
				//Enlarge if too small for lactation
				if (player.biggestTitSize() === 2 && player.mostBreastsPerRow() > 1) {
					output.text("\n<b>Your breasts have swollen to C-cups,</b> in light of your coming pregnancy.\n");
					player.growTits(1, 1, false, 3);
					
					displayedUpdate = true;
				}
				
				//Enlarge if really small!
				if (player.biggestTitSize() === 1 && player.mostBreastsPerRow() > 1) {
					output.text("\n<b>Your breasts have grown to B-cups,</b> likely due to the hormonal changes of your pregnancy.\n");
					player.growTits(1, 1, false, 3);
					
					displayedUpdate = true;
				}
			}
			
			if (!incubationReset()) {
				vaginalBirth();
			}
			
			return displayedUpdate;
		}
		
		/**
		 * @inheritDoc
		 */
		public  vaginalBirth(): void 
		{
			//TODO remove this once new Player calls have been removed
		var  player:Player = kGAMECLASS.player;

			if (incubationReset() || player.pregnancyIncubation > 2) {
				return;
			}
			
			
			pregnancyProgression.detectVaginalBirth(PregnancyStore.PREGNANCY_BASILISK);
			
			player.knockUpForce(); //Clear Pregnancy
			pregnancyProgression.giveBirth();
			kGAMECLASS.bazaar.benoit.popOutBenoitEggs();
		}
		
		private  incubationReset(): boolean {
			//TODO remove this once new Player calls have been removed
		var  player:Player = kGAMECLASS.player;
			
			if (player.pregnancyIncubation <= 2) {
				if (kGAMECLASS.time.hours !== 5 && kGAMECLASS.time.hours !== 6) {
					player.knockUpForce(player.pregnancyType, 3); //Make sure eggs are only birthed early in the morning
					return true;
				}
			}
			
			return false;
		}
	}

