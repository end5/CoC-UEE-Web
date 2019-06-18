	
	export class PregnancyProgression extends BaseContent
	{
		private static  LOGGER:ILogger = LoggerFactory.getLogger(PregnancyProgression);
		
		/**
		 * This sensing variable is used by tests to detect if
		 * the vaginal birth code has been called. This is used for pregnancies
		 * that do not provide any other means of detection (e.g. counter variables).
		 */
		public  senseVaginalBirth:Vector.<int>;
		
		/**
		 * This sensing variable is used by tests to detect if
		 * the anal birth code has been called. This is used for pregnancies
		 * that do not provide any other means of detection (e.g. counter variables).
		 */
		public  senseAnalBirth:Vector.<int>;
		
		
		/**
		 * Map pregnancy type to the class that contains the matching scenes.
		 * Currently only stores player pregnancies.
		 */
		private  vaginalPregnancyScenes:Dictionary;
		
		/**
		 * Map pregnancy type to the class that contains the matching scenes.
		 * Currently only stores player pregnancies.
		 */
		private  analPregnancyScenes:Dictionary;
		
		public  PregnancyProgression() {
			this.senseVaginalBirth = new Vector.<int>();
			this.senseAnalBirth = new Vector.<int>();
			
			this.vaginalPregnancyScenes = new Dictionary();
			this.analPregnancyScenes = new Dictionary();
		}
		
		/**
		 * Record a call to a vaginal birth function.
		 * This method is used for testing.
		 * @param	pregnancyType to record
		 */
		public  detectVaginalBirth(pregnancyType: number): void {
			senseVaginalBirth.push(pregnancyType);
		}
		
		/**
		 * Record a call to a anal birth function.
		 * This method is used for testing.
		 * @param	pregnancyType to record
		 */
		public  detectAnalBirth(pregnancyType: number): void
		{
			senseAnalBirth.push(pregnancyType);
		}
		
		/**
		 * Register a scene for vaginal pregnancy. The registered scene will be used for pregnancy
		 * progression and birth.
		 * <b>Note:</b> Currently only the player is supported as the mother.
		 * 
		 * @param	pregnancyTypeMother The creature that is the mother
		 * @param	pregnancyTypeFather The creature that is the father
		 * @param	scenes The scene to register for the combination
		 * @return true if an existing scene was overwritten
		 * @throws ArgumentError If the mother is not the player
		 */
		public  registerVaginalPregnancyScene(pregnancyTypeMother: number, pregnancyTypeFather: number, scenes:VaginalPregnancy): boolean {
			if (pregnancyTypeMother !== PregnancyStore.PREGNANCY_PLAYER) {
				LOGGER.error("Currently only the player is supported as mother");
				throw new ArgumentError("Currently only the player is supported as mother");
			}
			
		var  previousReplaced: boolean = false;
			
			if (hasRegisteredVaginalScene(pregnancyTypeMother, pregnancyTypeFather)) {
				previousReplaced = true;
				LOGGER.warn("Vaginal scene registration for mother {0}, father {1} will be replaced.", pregnancyTypeMother, pregnancyTypeFather);
			}
			
			vaginalPregnancyScenes[pregnancyTypeFather] = scenes;
			LOGGER.debug("Mapped pregancy scene {0} to mother {1}, father {2}", scenes, pregnancyTypeMother, pregnancyTypeFather);
			
			return previousReplaced;
		}
		
		/**
		 * Register a scene for anal pregnancy. The registered scene will be used for pregnancy
		 * progression and birth.
		 * <b>Note:</b> Currently only the player is supported as the mother.
		 * 
		 * @param	pregnancyTypeMother The creature that is the mother
		 * @param	pregnancyTypeFather The creature that is the father
		 * @param	scenes The scene to register for the combination
		 * @return true if an existing scene was overwritten
		 * @throws ArgumentError If the mother is not the player
		 */
		public  registerAnalPregnancyScene(pregnancyTypeMother: number, pregnancyTypeFather: number, scenes:AnalPregnancy): boolean
		{
			if (pregnancyTypeMother !== PregnancyStore.PREGNANCY_PLAYER) {
				LOGGER.error("Currently only the player is supported as mother");
				throw new ArgumentError("Currently only the player is supported as mother");
			}
			
		var  previousReplaced: boolean = false;
			
			if (hasRegisteredAnalScene(pregnancyTypeMother, pregnancyTypeFather)) {
				previousReplaced = true;
				LOGGER.warn("Anal scene registration for mother {0}, father {1} will be replaced.", pregnancyTypeMother, pregnancyTypeFather);
			}
			
			analPregnancyScenes[pregnancyTypeFather] = scenes;
			LOGGER.debug("Mapped anal pregancy scene {0} to mother {1}, father {2}", scenes, pregnancyTypeMother, pregnancyTypeFather);
			
			return previousReplaced;
		}
		
		/**
		 * Check if the given vaginal pregnancy combination has a registered scene.
		 * @param	pregnancyTypeMother The creature that is the mother
		 * @param	pregnancyTypeFather The creature that is the father
		 * @return true if a scene is registered for the combination
		 */
		public  hasRegisteredVaginalScene(pregnancyTypeMother: number, pregnancyTypeFather: number): boolean {
			// currently only player pregnancies are supported
			if (pregnancyTypeMother !== PregnancyStore.PREGNANCY_PLAYER) {
				return false;
			}
			
			return pregnancyTypeFather in vaginalPregnancyScenes;
		}
		
		/**
		 * Check if the given anal pregnancy combination has a registered scene.
		 * @param	pregnancyTypeMother The creature that is the mother
		 * @param	pregnancyTypeFather The creature that is the father
		 * @return true if a scene is registered for the combination
		 */
		public  hasRegisteredAnalScene(pregnancyTypeMother: number, pregnancyTypeFather: number): boolean
		{
			// currently only player pregnancies are supported
			if (pregnancyTypeMother !== PregnancyStore.PREGNANCY_PLAYER) {
				return false;
			}
			
			return pregnancyTypeFather in analPregnancyScenes;
		}
		
		/**
		 * Update the current vaginal and anal pregnancies (if any). Updates player status and outputs messages related to pregnancy or birth. 
		 * @return true if the output needs to be updated
		 */
		public  updatePregnancy(): boolean
		{
		var  displayedUpdate: boolean = false;
		var  pregText: string = "";
			if ((player.pregnancyIncubation <= 0 && player.buttPregnancyIncubation <= 0) ||
				(player.pregnancyType === 0 && player.buttPregnancyType === 0)) {
				return false;
			}

			displayedUpdate = cancelHeat();
			
			if (player.pregnancyIncubation > 0 && player.pregnancyIncubation < 2) player.knockUpForce(player.pregnancyType, 1);
			//IF INCUBATION IS VAGINAL
			if (player.pregnancyIncubation > 1) {
				displayedUpdate = updateVaginalPregnancy(displayedUpdate);
			}
			//IF INCUBATION IS ANAL
			if (player.buttPregnancyIncubation > 1) {
				displayedUpdate = updateAnalPregnancy(displayedUpdate);
			}
			
			amilyPregnancyFailsafe();
			
			if (player.pregnancyIncubation === 1) {
				displayedUpdate = updateVaginalBirth(displayedUpdate);
			}
			
			if (player.buttPregnancyIncubation === 1) {
				displayedUpdate = updateAnalBirth(displayedUpdate);
			}

			return displayedUpdate;
		}
		
		private  cancelHeat(): boolean 
		{
			if (player.inHeat) {
				outputText("\nYou calm down a bit and realize you no longer fantasize about getting fucked constantly.  It seems your heat has ended.\n");
				//Remove bonus libido from heat
				dynStats("lib", -player.statusEffectv2(StatusEffects.Heat));
				
				if (player.lib < 10) {
					player.lib = 10;
				}
				
				statScreenRefresh();
				player.removeStatusEffect(StatusEffects.Heat);
				
				return true;
			}
			
			return false;
		}
		
		private  updateVaginalPregnancy(displayedUpdate: boolean): boolean
		{
			if (hasRegisteredVaginalScene(PregnancyStore.PREGNANCY_PLAYER, player.pregnancyType)) {
			var  scene:VaginalPregnancy = vaginalPregnancyScenes[player.pregnancyType] as VaginalPregnancy;
				LOGGER.debug("Updating pregnancy for mother {0}, father {1} by using class {2}", PregnancyStore.PREGNANCY_PLAYER, player.pregnancyType, scene);
				return scene.updateVaginalPregnancy();
			} else {
				LOGGER.debug("Could not find a mapped vaginal pregnancy for mother {0}, father {1} - using legacy pregnancy progression", PregnancyStore.PREGNANCY_PLAYER, player.pregnancyType);;
			}
			
			return displayedUpdate;
		}
		
		private  updateAnalPregnancy(displayedUpdate: boolean): boolean 
		{
		var  analPregnancyType: number = player.buttPregnancyType;
			
			if (hasRegisteredAnalScene(PregnancyStore.PREGNANCY_PLAYER, analPregnancyType)) {
			var  scene:AnalPregnancy = analPregnancyScenes[analPregnancyType] as AnalPregnancy;
				LOGGER.debug("Updating anal pregnancy for mother {0}, father {1} by using class {2}", PregnancyStore.PREGNANCY_PLAYER, analPregnancyType, scene);
				return scene.updateAnalPregnancy() || displayedUpdate;
			} else {
				LOGGER.debug("Could not find a mapped anal pregnancy for mother {0}, father {1} - using legacy pregnancy progression", PregnancyStore.PREGNANCY_PLAYER, analPregnancyType);
			}
			
			return displayedUpdate;
		}

		/**
		 * Changes pregnancy type to Mouse if Amily is in a invalid state.
		 */
		private  amilyPregnancyFailsafe(): void 
		{
			//Amily failsafe - converts PC with pure babies to mouse babies if Amily is corrupted
			if (player.pregnancyIncubation === 1 && player.pregnancyType === PregnancyStore.PREGNANCY_AMILY) 
			{
				if (flags[kFLAGS.AMILY_FOLLOWER] === 2 || flags[kFLAGS.AMILY_CORRUPTION] > 0) {
					player.knockUpForce(PregnancyStore.PREGNANCY_MOUSE, player.pregnancyIncubation);
				}
			}
			
			//Amily failsafe - converts PC with pure babies to mouse babies if Amily is with Urta
			if (player.pregnancyIncubation === 1 && player.pregnancyType === PregnancyStore.PREGNANCY_AMILY) 
			{
				if (flags[kFLAGS.AMILY_VISITING_URTA] === 1 || flags[kFLAGS.AMILY_VISITING_URTA] === 2) {
					player.knockUpForce(PregnancyStore.PREGNANCY_MOUSE, player.pregnancyIncubation);
				}
			}
			
			//Amily failsafe - converts PC with pure babies to mouse babies if PC is in prison.
			if (player.pregnancyIncubation === 1 && player.pregnancyType === PregnancyStore.PREGNANCY_AMILY) 
			{
				if (prison.inPrison) {
					player.knockUpForce(PregnancyStore.PREGNANCY_MOUSE, player.pregnancyIncubation);
				}
			}
		}
		
		/**
		 * Check is the player has a vagina and create one if missing.
		 */
		private  createVaginaIfMissing(): void {
			PregnancyUtils.createVaginaIfMissing(output, player);
		}
		
		private  updateVaginalBirth(displayedUpdate: boolean): boolean 
		{
			if (hasRegisteredVaginalScene(PregnancyStore.PREGNANCY_PLAYER, player.pregnancyType)) {
			var  scene:VaginalPregnancy = vaginalPregnancyScenes[player.pregnancyType] as VaginalPregnancy;
				LOGGER.debug("Updating vaginal birth for mother {0}, father {1} by using class {2}", PregnancyStore.PREGNANCY_PLAYER, player.pregnancyType, scene);
				scene.vaginalBirth();
				
				// TODO find a cleaner way to solve this
				// ignores Benoit pregnancy because that is a special case
				if (player.pregnancyType !== PregnancyStore.PREGNANCY_BENOIT) {
					giveBirth();
				}
			} else {
				LOGGER.debug("Could not find a mapped vaginal pregnancy scene for mother {0}, father {1} - using legacy pregnancy progression", PregnancyStore.PREGNANCY_PLAYER, player.pregnancyType);;
			}
			
			// TODO find a better way to do this
			// due to non-conforming pregancy code
			if (player.pregnancyType === PregnancyStore.PREGNANCY_BENOIT && player.pregnancyIncubation === 3) {
				return displayedUpdate;
			}
			
			player.knockUpForce();
			
			return true;
		}
		
		/**
		 * Updates fertility and tracks number of births. If the player has birthed
		 * enough children, gain the broodmother perk.
		 */
		public  giveBirth(): void
		{
			//TODO remove this once new Player calls have been removed
		var  player:Player = kGAMECLASS.player;
			
			if (player.fertility < 15) {
				player.fertility++;
			}
			
			if (player.fertility < 25) {
				player.fertility++;
			}
			
			if (player.fertility < 40) {
				player.fertility++;
			}
			
			if (!player.hasStatusEffect(StatusEffects.Birthed)) {
				player.createStatusEffect(StatusEffects.Birthed,1,0,0,0);
			} else {
				player.addStatusValue(StatusEffects.Birthed,1,1);
				
				if (player.findPerk(PerkLib.BroodMother) < 0 && player.statusEffectv1(StatusEffects.Birthed) >= 10) {
					output.text("\n<b>You have gained the Brood Mother perk</b> (Pregnancies progress twice as fast as a normal woman's).\n");
					player.createPerk(PerkLib.BroodMother,0,0,0,0);
				}
			}
		}

		private  updateAnalBirth(displayedUpdate: boolean): boolean 
		{
		var  analPregnancyType: number = player.buttPregnancyType;
			
			if (hasRegisteredAnalScene(PregnancyStore.PREGNANCY_PLAYER, analPregnancyType)) {
			var  scene:AnalPregnancy = analPregnancyScenes[analPregnancyType] as AnalPregnancy;
				LOGGER.debug("Updating anal birth for mother {0}, father {1} by using class {2}", PregnancyStore.PREGNANCY_PLAYER, analPregnancyType, scene);
				scene.analBirth();
				displayedUpdate = true;
			} else {
				LOGGER.debug("Could not find a mapped anal pregnancy scene for mother {0}, father {1} - using legacy pregnancy progression", PregnancyStore.PREGNANCY_PLAYER, analPregnancyType);
			}
			
			player.buttKnockUpForce();
			
			return displayedUpdate;
		}
	}

