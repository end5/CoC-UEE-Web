
	export class Camp extends NPCAwareContent {
		protected  set timeQ(value: number): void { kGAMECLASS.timeQ = value; }
		private  get campQ(): boolean { return kGAMECLASS.campQ; }
		private  set campQ(value: boolean): void { kGAMECLASS.campQ = value; }
		protected  hasItemInStorage(itype:ItemType): boolean { return kGAMECLASS.inventory.hasItemInStorage(itype); }

		public  Camp(campInitialize) {
			campInitialize(doCamp); //pass the doCamp function up to CoC. This way doCamp is private but the CoC class itself can call it
		}
		public  cabinProgress:CabinProgress = new CabinProgress();
		public  codex:Codex = new Codex();

		public  returnToCamp(timeUsed: number): void {
			clearOutput();
			if (timeUsed == 1) outputText("An hour passes...\n");
			else outputText(Num2Text(timeUsed) + " hours pass...\n");
			if (!getGame().inCombat) spriteSelect(undefined);
			hideMenus();
			timeQ = timeUsed;
			goNext(timeUsed, false);
		}
		public  returnToCampUseOneHour(): void { returnToCamp(1); } //Replacement for event number 13;
		public  returnToCampUseTwoHours(): void { returnToCamp(2); } //Replacement for event number 14;
		public  returnToCampUseFourHours(): void { returnToCamp(4); } //Replacement for event number 15;
		public  returnToCampUseEightHours(): void { returnToCamp(8); } //Replacement for event number 16;

	//SLEEP_WITH: number = 701;
	//Used to determine scenes if you choose to play joke on them. Should the variables be moved to flags?
	protected  izmaJoinsStream: boolean;
	protected  marbleJoinsStream: boolean;
	protected  heliaJoinsStream: boolean;
	protected  amilyJoinsStream: boolean;

private  doCamp(): void { //only called by playerMenu
	if (player.slotName != "VOID" && mainView.getButtonText(0) != "Game Over" && flags[kFLAGS.HARDCORE_MODE] > 0) //Force autosave on HARDCORE MODE! And level-up
		getGame().saves.saveGame(player.slotName);
	//Make sure gameState is cleared if coming from combat or giacomo
	getGame().inCombat = false;
	mainView.endCombatView();
	//There were some problems with buttons not being overwritten and bleeding into other scenes
	//No scenes should involve a button from a previous scene with a camp scene in the middle
	mainView.clearBottomButtons();
	mainView.showMenuButton( MainView.MENU_NEW_MAIN );
	//Prioritize clearing before setting room
	if (player.hasStatusEffect(StatusEffects.PostAkbalSubmission)) {
		player.removeStatusEffect(StatusEffects.PostAkbalSubmission);
		getGame().forest.akbalScene.akbalSubmissionFollowup();
		return;
	}
	if (player.hasStatusEffect(StatusEffects.PostAnemoneBeatdown)) {
		player.HPChange(Math.round(player.maxHP()/2),false);
		player.removeStatusEffect(StatusEffects.PostAnemoneBeatdown);
	}
	flags[kFLAGS.BONUS_ITEM_AFTER_COMBAT_ID] = ""; //clear out Izma's saved loot status
	if (flags[kFLAGS.HISTORY_PERK_SELECTED] == 0) { //history perk backup
		flags[kFLAGS.HISTORY_PERK_SELECTED] = 2;
		hideMenus();
		getGame().charCreation.chooseHistory();
		return;
	}
	fixFlags();
	//Update saves
	if (flags[kFLAGS.ERLKING_CANE_OBTAINED] == 0 && player.hasKeyItem("Golden Antlers") >= 0) {
		clearOutput();
		outputText(images.showImage("item-gAntlers"));
		outputText("Out of nowhere, a cane appears on your " + bedDesc() + ". It looks like it once belonged to the Erlking. Perhaps the cane has been introduced into the game and you've committed a revenge on the Erlking? Regardless, you take it anyway. ");
		flags[kFLAGS.ERLKING_CANE_OBTAINED] = 1;
		inventory.takeItem(weapons.HNTCANE, doCamp);
		return;
	}
	if (flags[kFLAGS.MOD_SAVE_VERSION] < kGAMECLASS.modSaveVersion) {
		promptSaveUpdate();
		return;
	}
	//Put player back in Ingnam, prison, or specific zones
	if (ingnam.inIngnam) { //Ingnam
		getGame().ingnam.menuIngnam();
		return;
	}
	if (prison.inPrison && flags[kFLAGS.PRISON_ENABLED] == true) { //prison
		getGame().prison.prisonRoom(true);
		return;
	}
	else if (prison.inPrison && flags[kFLAGS.PRISON_ENABLED] == false) {
		flags[kFLAGS.IN_PRISON] = 0;
		getGame().camp.returnToCamp(0); //just drop ya in camp I guess)
		return;
	}
	if (flags[kFLAGS.GRIMDARK_MODE] > 0) {
		getGame().dungeons.move(getGame().dungeons._currentRoom);
		return;
	}
	if (!marbleScene.marbleFollower()) {
		if (flags[kFLAGS.MARBLE_LEFT_OVER_CORRUPTION] == 1 && player.isPureEnough(40)) {
			hideMenus();
			marblePurification.pureMarbleDecidesToBeLessOfABitch();
			return;
		}
	}
	if (marbleScene.marbleFollower()) {
		//Cor < 50 / No corrupt: Jojo, Amily, or Vapula / Purifying Murble
		if (player.isPureEnough(50) && !campCorruptJojo() && !amilyScene.amilyCorrupt() && !vapulaSlave() && flags[kFLAGS.MARBLE_PURIFICATION_STAGE] == 0 && flags[kFLAGS.MARBLE_COUNTUP_TO_PURIFYING] >= 200 && player.findPerk(PerkLib.MarblesMilk) < 0) {
			hideMenus();
			marblePurification.BLUHBLUH();
			return;
		}
		if (flags[kFLAGS.MARBLE_PURIFICATION_STAGE] >= 5) {
			if (flags[kFLAGS.MARBLE_WARNED_ABOUT_CORRUPTION] == 0 && !player.isPureEnough(50)) {
				hideMenus();
				marblePurification.marbleWarnsPCAboutCorruption();
				return;
			}
			if (flags[kFLAGS.MARBLE_WARNED_ABOUT_CORRUPTION] == 1 && flags[kFLAGS.MARBLE_LEFT_OVER_CORRUPTION] == 0 && !player.isPureEnough(60)) {
				hideMenus();
				marblePurification.marbleLeavesThePCOverCorruption();
				return;
			}
		}
		if (flags[kFLAGS.MARBLE_RATHAZUL_COUNTER_1] == 1 && (time.hours == 6 || time.hours == 7)) {
			hideMenus();
			marblePurification.rathazulsMurbelReport();
			return;
		}
		if (flags[kFLAGS.MARBLE_RATHAZUL_COUNTER_2] == 1) {
			hideMenus();
			marblePurification.claraShowsUpInCampBECAUSESHESACUNT();
			return;
		}
	}
	if (arianFollower() && flags[kFLAGS.ARIAN_MORNING] == 1) {
		hideMenus();
		arianScene.wakeUpAfterArianSleep();
		return;
	}
	if (arianFollower() && flags[kFLAGS.ARIAN_EGG_EVENT] >= 30) {
		hideMenus();
		arianScene.arianEggingEvent();
		return;
	}
	if (arianFollower() && flags[kFLAGS.ARIAN_EGG_COUNTER] >= 24 && flags[kFLAGS.ARIAN_VAGINA] > 0) {
		hideMenus();
		arianScene.arianLaysEggs();
		return;
	}
	if (flags[kFLAGS.JOJO_BIMBO_STATE] >= 3 && flags[kFLAGS.JOY_NIGHT_FUCK] == 1) {
		joyScene.wakeUpWithJoyPostFuck();
		return;
	}
	if (flags[kFLAGS.EMBER_MORNING] > 0 && ((flags[kFLAGS.BENOIT_CLOCK_BOUGHT] > 0 && getGame().time.hours >= flags[kFLAGS.BENOIT_CLOCK_ALARM]) || (flags[kFLAGS.BENOIT_CLOCK_BOUGHT] <= 0 && getGame().time.hours >= 6))) {
		hideMenus();
		emberScene.postEmberSleep();
		return;
	}
	if (flags[kFLAGS.JACK_FROST_PROGRESS] > 0) {
		hideMenus();
		kGAMECLASS.xmas.jackFrost.processJackFrostEvent();
		return;
	}
	if (player.hasKeyItem("Super Reducto") < 0 && milkSlave() && player.hasStatusEffect(StatusEffects.CampRathazul) && player.statusEffectv2(StatusEffects.MetRathazul) >= 4) {
		hideMenus();
		milkWaifu.ratducto();
		return;
	}
	if (kGAMECLASS.xmas.xmasMisc.nieveHoliday() && getGame().time.hours == 6) {
		if (player.hasKeyItem("Nieve's Tear") >= 0 && flags[kFLAGS.NIEVE_STAGE] != 5) {
			kGAMECLASS.xmas.xmasMisc.returnOfNieve();
			hideMenus();
			return;
		}
		else if (flags[kFLAGS.NIEVE_STAGE] == 0) {
			hideMenus();
			kGAMECLASS.xmas.xmasMisc.snowLadyActive();
			return;
		}
		else if (flags[kFLAGS.NIEVE_STAGE] == 4) {
			hideMenus();
			kGAMECLASS.xmas.xmasMisc.nieveComesToLife();
			return;
		}
	}
	if (kGAMECLASS.helScene.followerHel()) {
		if (helFollower.isHeliaBirthday() && flags[kFLAGS.HEL_FOLLOWER_LEVEL] >= 2 && flags[kFLAGS.HELIA_BIRTHDAY_OFFERED] == 0) {
			hideMenus();
			helFollower.heliasBirthday();
			return;
		}
		if (kGAMECLASS.helScene.pregnancy.isPregnant) {
			switch (kGAMECLASS.helScene.pregnancy.eventTriggered()) {
				case 2: hideMenus();
						helSpawnScene.bulgyCampNotice();
						return;
				case 3: hideMenus();
						helSpawnScene.heliaSwollenNotice();
						return;
				case 4: hideMenus();
						helSpawnScene.heliaGravidity();
						return;
				default:
						if (kGAMECLASS.helScene.pregnancy.incubation == 0 && (getGame().time.hours == 6 || getGame().time.hours == 7)) {
							hideMenus();
							helSpawnScene.heliaBirthtime();
							return;
						}
			}
		}
	}
	if (flags[kFLAGS.HELSPAWN_AGE] == 1 && flags[kFLAGS.HELSPAWN_GROWUP_COUNTER] >= 7) {
		hideMenus();
		helSpawnScene.helSpawnGraduation();
		return;
	}
	if (getGame().time.hours >= 10 && getGame().time.hours <= 18 && (getGame().time.days % 20 == 0 || getGame().time.hours == 12) && flags[kFLAGS.HELSPAWN_DADDY] == 2 && helSpawnScene.helspawnFollower()) {
		hideMenus();
		helSpawnScene.maiVisitsHerKids();
		return;
	}
	if (getGame().time.hours == 6 && flags[kFLAGS.HELSPAWN_DADDY] == 1 && getGame().time.days % 30 == 0 && flags[kFLAGS.SPIDER_BRO_GIFT] == 0 && helSpawnScene.helspawnFollower()) {
		hideMenus();
		helSpawnScene.spiderBrosGift();
		return;
	}
	if (getGame().time.hours >= 10 && getGame().time.hours <= 18 && (getGame().time.days % 15 == 0 || getGame().time.hours == 12) && helSpawnScene.helspawnFollower() && flags[kFLAGS.HAKON_AND_KIRI_VISIT] == 0) {
		hideMenus();
		helSpawnScene.hakonAndKiriComeVisit();
		return;
	}
	if (flags[kFLAGS.HELSPAWN_AGE] == 2 && flags[kFLAGS.HELSPAWN_DISCOVER_BOOZE] == 0 && (rand(10) == 0 || flags[kFLAGS.HELSPAWN_GROWUP_COUNTER] == 6)) {
		hideMenus();
		helSpawnScene.helspawnDiscoversBooze();
		return;
	}
	if (flags[kFLAGS.HELSPAWN_AGE] == 2 && flags[kFLAGS.HELSPAWN_WEAPON] == 0 && flags[kFLAGS.HELSPAWN_GROWUP_COUNTER] >= 3 && getGame().time.hours >= 10 && getGame().time.hours <= 18) {
		hideMenus();
		helSpawnScene.helSpawnChoosesAFightingStyle();
		return;
	}
	if (flags[kFLAGS.HELSPAWN_AGE] == 2 && (getGame().time.hours == 6 || getGame().time.hours == 7) && flags[kFLAGS.HELSPAWN_GROWUP_COUNTER] >= 7 && flags[kFLAGS.HELSPAWN_FUCK_INTERRUPTUS] == 1) {
		helSpawnScene.helspawnAllGrownUp();
		return;
	}
	if ((sophieFollower() || bimboSophie()) && flags[kFLAGS.SOPHIE_DAUGHTER_MATURITY_COUNTER] == 1) {
		flags[kFLAGS.SOPHIE_DAUGHTER_MATURITY_COUNTER] = 0;
		sophieBimbo.sophieKidMaturation();
		hideMenus();
		return;
	}
	if (bimboSophie() && flags[kFLAGS.SOPHIE_BROACHED_SLEEP_WITH] == 0 && sophieScene.pregnancy.event >= 2) {
		hideMenus();
		sophieBimbo.sophieMoveInAttempt(); //Bimbo Sophie Move In Request!
		return;
	}
	if (!kGAMECLASS.xmas.xmasMisc.nieveHoliday() && getGame().time.hours == 6 && flags[kFLAGS.NIEVE_STAGE] > 0) {
		kGAMECLASS.xmas.xmasMisc.nieveIsOver();
		return;
	}
	if (flags[kFLAGS.PC_PENDING_PREGGERS] == 1) {
		kGAMECLASS.amilyScene.postBirthingEndChoices(); //Amily followup!
		flags[kFLAGS.PC_PENDING_PREGGERS] = 2;
		return;
	}
	if (timeQ > 0) {
		if (!campQ) {
			clearOutput();
			outputText("More time passes...\n");
			goNext(timeQ, false);
			return;
		}
		else {
			if (getGame().time.hours < 6 || getGame().time.hours > 20) doSleep();
			else rest();
			return;
		}
	}
	if (flags[kFLAGS.FUCK_FLOWER_KILLED] == 0 && flags[kFLAGS.CORRUPT_MARAE_FOLLOWUP_ENCOUNTER_STATE] > 0 && (flags[kFLAGS.IN_PRISON] == 0 && flags[kFLAGS.IN_INGNAM] == 0)) {
		if (flags[kFLAGS.FUCK_FLOWER_LEVEL] == 0 && flags[kFLAGS.FUCK_FLOWER_GROWTH_COUNTER] >= 8) {
			holliScene.getASprout();
			hideMenus();
			return;
		}
		if (flags[kFLAGS.FUCK_FLOWER_LEVEL] == 1 && flags[kFLAGS.FUCK_FLOWER_GROWTH_COUNTER] >= 7) {
			holliScene.fuckPlantGrowsToLevel2();
			hideMenus();
			return;
		}
		if (flags[kFLAGS.FUCK_FLOWER_LEVEL] == 2 && flags[kFLAGS.FUCK_FLOWER_GROWTH_COUNTER] >= 25) {
			holliScene.flowerGrowsToP3();
			hideMenus();
			return;
		}
		if (flags[kFLAGS.FUCK_FLOWER_LEVEL] == 3 && flags[kFLAGS.FUCK_FLOWER_GROWTH_COUNTER] >= 40) {
			holliScene.treePhaseFourGo(); //level 4 growth
			hideMenus();
			return;
		}
	}
	if (flags[kFLAGS.FUCK_FLOWER_LEVEL] >= 4 && flags[kFLAGS.FUCK_FLOWER_KILLED] == 0 && player.hasStatusEffect(StatusEffects.PureCampJojo) && flags[kFLAGS.JOJO_BIMBO_STATE] < 3) {
		holliScene.JojoTransformAndRollOut(); //Jojo treeflips!
		hideMenus();
		return;
	}
	if (amilyScene.amilyFollower() && !amilyScene.amilyCorrupt() && flags[kFLAGS.FUCK_FLOWER_LEVEL] >= 4 && flags[kFLAGS.FUCK_FLOWER_KILLED] == 0) {
		holliScene.amilyHatesTreeFucking(); //Amily flips out
		hideMenus();
		return;
	}
	if (flags[kFLAGS.FUCK_FLOWER_KILLED] == 1 && flags[kFLAGS.AMILY_TREE_FLIPOUT] == 1 && !amilyScene.amilyFollower() && flags[kFLAGS.AMILY_VISITING_URTA] == 0) {
		holliScene.amilyComesBack();
		flags[kFLAGS.AMILY_TREE_FLIPOUT] = 2;
		hideMenus();
		return;
	}
	if (player.hasStatusEffect(StatusEffects.CampAnemoneTrigger)) {
		player.removeStatusEffect(StatusEffects.CampAnemoneTrigger);
		anemoneScene.anemoneKidBirthPtII(); //anemone birth followup!
		hideMenus();
		return;
	}
	if (player.statusEffectv1(StatusEffects.Exgartuan) == 1 && (player.cockArea(0) < 100 || player.cocks.length == 0)) {
		exgartuanCampUpdate(); //Exgartuan clearing
		return;
	}
	else if (player.statusEffectv1(StatusEffects.Exgartuan) == 2 && player.biggestTitSize() < 12) {
		exgartuanCampUpdate(); //Exgartuan clearing
		return;
	}
	if (isabellaFollower() && flags[kFLAGS.ISABELLA_MILKED_YET] >= 10 && player.hasKeyItem("Breast Milker - Installed At Whitney's Farm") >= 0) {
		isabellaFollowerScene.milktasticLacticLactation(); //Izzys tits asplode
		hideMenus();
		return;
	}
	if (isabellaFollower() && flags[kFLAGS.VALARIA_AT_CAMP] > 0 && flags[kFLAGS.ISABELLA_VALERIA_SPARRED] == 0) {
		valeria.isabellaAndValeriaSpar(); //Isabella and Valeria sparring
		return;
	}
	if (flags[kFLAGS.ISABELLA_MURBLE_BLEH] == 1 && isabellaFollower() && player.hasStatusEffect(StatusEffects.CampMarble)) {
		isabellaFollowerScene.angryMurble(); //Marble meets follower izzy when moving in
		hideMenus();
		return;
	}
	if (player.pregnancyIncubation <= 280 && player.pregnancyType == PregnancyStore.PREGNANCY_COTTON && flags[kFLAGS.COTTON_KNOCKED_UP_PC_AND_TALK_HAPPENED] == 0 && (getGame().time.hours == 6 || getGame().time.hours == 7)) {
		kGAMECLASS.telAdre.cotton.goTellCottonShesAMomDad(); //Cotton preg freakout
		hideMenus();
		return;
	}
	if (bimboSophie() && hasItemInStorage(consumables.OVIELIX) && rand(5) == 0 && flags[kFLAGS.TIMES_SOPHIE_HAS_DRUNK_OVI_ELIXIR] == 0 && player.gender > 0) {
		sophieBimbo.sophieEggApocalypse(); //Bimbo Sophie finds ovi elixer in chest!
		hideMenus();
		return;
	}
	if (!kGAMECLASS.urtaQuest.urtaBusy() && flags[kFLAGS.AMILY_VISITING_URTA] == 0 && rand(10) == 0 && flags[kFLAGS.URTA_DRINK_FREQUENCY] >= 0 && flags[kFLAGS.URTA_BANNED_FROM_SCYLLA] == 0 && flags[kFLAGS.AMILY_NEED_TO_FREAK_ABOUT_URTA] == 1 && amilyScene.amilyFollower() && flags[kFLAGS.AMILY_FOLLOWER] == 1 && !amilyScene.pregnancy.isPregnant) {
		finter.amilyUrtaReaction(); //Amily + Urta freakout!
		hideMenus();
		return;
	}
	if (flags[kFLAGS.JOJO_FIXED_STATUS] == 1 && flags[kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO] == 0) {
		finter.findJojosNote(); //find jojo's note!
		hideMenus();
		return;
	}
	if (player.hasStatusEffect(StatusEffects.PureCampJojo) && inventory.hasItemInStorage(consumables.BIMBOLQ) && flags[kFLAGS.BIMBO_LIQUEUR_STASH_COUNTER_FOR_JOJO] >= 72 && flags[kFLAGS.JOJO_BIMBO_STATE] == 0) {
		joyScene.jojoPromptsAboutThief(); //Bimbo Jojo warning
		hideMenus();
		return;
	}
	if (player.hasStatusEffect(StatusEffects.PureCampJojo) && flags[kFLAGS.BIMBO_LIQUEUR_STASH_COUNTER_FOR_JOJO] >= 24 && flags[kFLAGS.JOJO_BIMBO_STATE] == 2) {
		joyScene.jojoGetsBimbofied(); //Jojo gets bimbo'ed!
		hideMenus();
		return;
	}
	if (flags[kFLAGS.JOJO_BIMBO_STATE] >= 3 && jojoScene.pregnancy.type == PregnancyStore.PREGNANCY_PLAYER && jojoScene.pregnancy.incubation == 0) {
		joyScene.joyGivesBirth(); //Joy gives birth!
		return;
	}
	if (flags[kFLAGS.RATHAZUL_CORRUPT_JOJO_FREAKOUT] == 0 && rand(5) == 0 && player.hasStatusEffect(StatusEffects.CampRathazul) && campCorruptJojo()) {
		finter.rathazulFreaksOverJojo(); //Rathazul freaks out about jojo
		hideMenus();
		return;
	}
	if (flags[kFLAGS.IZMA_MARBLE_FREAKOUT_STATUS] == 1) {
		izmaScene.newMarbleMeetsIzma(); //Izma/Marble freakout - marble moves in
		hideMenus();
		return;
	}
	if (flags[kFLAGS.IZMA_AMILY_FREAKOUT_STATUS] == 1) {
		izmaScene.newAmilyMeetsIzma(); //Izma/Amily freakout - Amily moves in
		hideMenus();
		return;
	}
	if (flags[kFLAGS.AMILY_NOT_FREAKED_OUT] == 0 && player.hasStatusEffect(StatusEffects.CampMarble) && flags[kFLAGS.AMILY_FOLLOWER] == 1 && amilyScene.amilyFollower() && marbleScene.marbleAtCamp()) {
		finter.marbleVsAmilyFreakout(); //Amily/Marble Freakout
		hideMenus();
		return;
	}
	//Amily and/or Jojo freakout about Vapula!!
	if (vapulaSlave() && ((player.hasStatusEffect(StatusEffects.PureCampJojo) && flags[kFLAGS.KEPT_PURE_JOJO_OVER_VAPULA] <= 0) || (amilyScene.amilyFollower() && !amilyScene.amilyCorrupt() && flags[kFLAGS.KEPT_PURE_AMILY_OVER_VAPULA] <= 0))) {
		if ((player.hasStatusEffect(StatusEffects.PureCampJojo)) && !(amilyScene.amilyFollower() && !amilyScene.amilyCorrupt()) && flags[kFLAGS.KEPT_PURE_JOJO_OVER_VAPULA] == 0) //Jojo but not Amily (Must not be bimbo!)
			vapula.mouseWaifuFreakout(false, true);
		else if ((amilyScene.amilyFollower() && !amilyScene.amilyCorrupt()) && !player.hasStatusEffect(StatusEffects.PureCampJojo) && flags[kFLAGS.KEPT_PURE_AMILY_OVER_VAPULA] == 0) //Amily but not Jojo
			vapula.mouseWaifuFreakout(true, false);
		else //Both
			vapula.mouseWaifuFreakout(true, true);
		hideMenus();
		return;
	}
	if (followerKiha() && flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] == 144) {
		kihaFollower.kihaTellsChildrenStory();
		return;
	}
	if (flags[kFLAGS.HEL_FOLLOWER_LEVEL] == 2 && kGAMECLASS.helScene.followerHel() && flags[kFLAGS.HEL_INTROS_LEVEL] == 0) {
		helFollower.helFollowersIntro(); //go through Helia's first time move in interactions if you haven't yet
		hideMenus();
		return;
	}
	if (flags[kFLAGS.HEL_INTROS_LEVEL] > 9000 && kGAMECLASS.helScene.followerHel() && isabellaFollower() && flags[kFLAGS.HEL_ISABELLA_THREESOME_ENABLED] == 0) {
		helFollower.angryHelAndIzzyCampHelHereFirst(); //if you've gone through Hel's first time actions and Issy moves in without being okay with threesomes
		hideMenus();
		return;
	}
	//Reset
	flags[kFLAGS.CAME_WORMS_AFTER_COMBAT] = 0;
	campQ = false;
	if (player.hasStatusEffect(StatusEffects.SlimeCravingOutput)) //clear stuff
		player.removeStatusEffect(StatusEffects.SlimeCravingOutput);
	flags[kFLAGS.PC_CURRENTLY_LUSTSTICK_AFFECTED] = 0; //reset luststick display status (see event parser)
	//Display Proper Buttons
	mainView.showMenuButton (MainView.MENU_APPEARANCE);
	mainView.showMenuButton (MainView.MENU_PERKS);
	mainView.showMenuButton (MainView.MENU_STATS);
	mainView.showMenuButton (MainView.MENU_DATA);
	showStats();
	//Change settings of new game buttons to go to main menu
	mainView.setMenuButton( MainView.MENU_NEW_MAIN, "Main Menu", kGAMECLASS.mainMenu.mainMenu );
	mainView.newGameButton.hint("Return to main menu.","Main Menu");
	hideUpDown(); //clear up/down arrows
	if (setLevelButton()) return; //level junk
	//Build main menu
	clearOutput();
	updateAchievements();
	//Player's camp image
	if (flags[kFLAGS.CAMP_BUILT_CABIN] > 0) outputText(images.showImage("camp-cabin"));
	else outputText(images.showImage("camp-tent"));
	if (isabellaFollower()) //Isabella upgrades camp level!
		outputText("Your campsite got a lot more comfortable once Isabella moved in.  Carpets cover up much of the barren ground, simple awnings tied to the rocks provide shade, and hand-made wooden furniture provides comfortable places to sit and sleep.  ");
	else { //live in-ness
		if (getGame().time.days < 10) outputText("Your campsite is fairly simple at the moment.  Your tent and bedroll are set in front of the rocks that lead to the portal.  You have a small fire pit as well.  ");
		if (getGame().time.days >= 10 && getGame().time.days < 20) outputText("Your campsite is starting to get a very 'lived-in' look.  The fire-pit is well defined with some rocks you've arranged around it, and your bedroll and tent have been set up in the area most sheltered by rocks.  ");
		if (getGame().time.days >= 20) {
			if (!isabellaFollower()) outputText("Your new home is as comfy as a camp site can be.  ");
			outputText("The fire-pit ");
			if (flags[kFLAGS.CAMP_BUILT_CABIN] > 0 && flags[kFLAGS.CAMP_CABIN_FURNITURE_BED] > 0) outputText("is ");
			else outputText("and tent are both ");
			outputText("set up perfectly, and in good repair.  ");
		}
	}
	if (getGame().time.days >= 20) outputText("You've even managed to carve some artwork into the rocks around the camp's perimeter.\n\n");
	if (flags[kFLAGS.CAMP_CABIN_PROGRESS] == 7) outputText("There's an unfinished wooden structure. As of right now, it's just frames nailed together.\n\n")
	if (flags[kFLAGS.CAMP_CABIN_PROGRESS] == 8) outputText("There's an unfinished cabin. It's currently missing windows and door.\n\n")
	if (flags[kFLAGS.CAMP_CABIN_PROGRESS] == 9) outputText("There's a nearly-finished cabin. It looks complete from the outside but inside, it's missing flooring.\n\n")
	if (flags[kFLAGS.CAMP_CABIN_PROGRESS] >= 10) outputText("Your cabin is situated near the edge of camp.\n\n")
	if (flags[kFLAGS.CLARA_IMPRISONED] > 0) marblePurification.claraCampAddition();
	//Nursery
	if (flags[kFLAGS.MARBLE_NURSERY_CONSTRUCTION] == 100 && player.hasStatusEffect(StatusEffects.CampMarble)) {
		outputText("Marble has built a fairly secure nursery amongst the rocks to house your ");
		if (flags[kFLAGS.MARBLE_KIDS] == 0) outputText("future children");
		else {
			outputText(num2Text(flags[kFLAGS.MARBLE_KIDS]) + " child");
			if (flags[kFLAGS.MARBLE_KIDS] > 1) outputText("ren");
		}
		outputText(".\n\n");
	}
	//HARPY ROOKERY
	if (flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] > 0) {
		//Small (1 mature daughter)
		if (flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] == 1) outputText("There's a smallish harpy nest that your daughter has built up with rocks piled high near the fringes of your camp.  It's kind of pathetic, but she seems proud of her accomplishment.  ");
		//Medium (2-3 mature daughters)
		else if (flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] <= 3) outputText("There's a growing pile of stones built up at the fringes of your camp.  It's big enough to be considered a small hill by this point, dotted with a couple small harpy nests just barely big enough for two.  ");
		//Big (4 mature daughters)
		else if (flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] <= 4) outputText("The harpy rookery at the edge of camp has gotten pretty big.  It's taller than most of the standing stones that surround the portal, and there's more nests than harpies at this point.  Every now and then you see the four of them managing a boulder they dragged in from somewhere to add to it.  ");
		//Large (5-10 mature daughters)
		else if (flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] <= 10) outputText("The rookery has gotten quite large.  It stands nearly two stories tall at this point, dotted with nests and hollowed out places in the center.  It's surrounded by the many feathers the assembled harpies leave behind.  ");
		//Giant (11-20 mature daughters)
		else if (flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] <= 20) outputText("A towering harpy rookery has risen up at the fringes of your camp, filled with all of your harpy brood.  It's at least three stories tall at this point, and it has actually begun to resemble a secure structure.  These harpies are always rebuilding and adding onto it.  ");
		//Massive (21-50 mature daughters)
		else if (flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] <= 50) outputText("A massive harpy rookery towers over the edges of your camp.  It's almost entirely built out of stones that are fit seamlessly into each other, with many ledges and overhangs for nests.  There's a constant hum of activity over there day or night.  ");
		//Immense (51+ Mature daughters)
		else outputText("An immense harpy rookery dominates the edge of your camp, towering over the rest of it.  Innumerable harpies flit around it, always working on it, assisted from below by the few sisters unlucky enough to be flightless.  ");
		outputText("\n\n");
	}
	//Traps
	if (player.hasStatusEffect(StatusEffects.DefenseCanopy)) outputText("A thorny tree has sprouted near the center of the camp, growing a protective canopy of spiky vines around the portal and your camp.  ");
	if (flags[kFLAGS.CAMP_WALL_PROGRESS] >= 20 && flags[kFLAGS.CAMP_WALL_PROGRESS] < 100) {
		if (flags[kFLAGS.CAMP_WALL_PROGRESS] / 20 == 0) outputText("A thick wooden wall has been erected to provide a small amount of defense.  ");
		else outputText("Thick wooden walls have been erected to provide some defense.  ");
	}
	else if (flags[kFLAGS.CAMP_WALL_PROGRESS] >= 100) {
		outputText("Thick wooden walls have been erected; they surround one half of your camp perimeter and provide good defense, leaving the another half open for access to the stream.  ");
		if (flags[kFLAGS.CAMP_WALL_GATE] > 0) outputText("A gate has been constructed in the middle of the walls; it gets closed at night to keep any invaders out.  ");
		if (flags[kFLAGS.CAMP_WALL_SKULLS] > 0) {
			if (flags[kFLAGS.CAMP_WALL_SKULLS] == 1) outputText("A single imp skull has been mounted near the gateway");
			else if (flags[kFLAGS.CAMP_WALL_SKULLS] >= 2 && flags[kFLAGS.CAMP_WALL_SKULLS] < 5) outputText("Few imp skulls have been mounted near the gateway");
			else if (flags[kFLAGS.CAMP_WALL_SKULLS] >= 5 && flags[kFLAGS.CAMP_WALL_SKULLS] < 15) outputText("Several imp skulls have been mounted near the gateway");
			else outputText("Many imp skulls decorate the gateway and wall, some even impaled on wooden spikes");
			outputText(" to serve as deterrence.  ");
			if (flags[kFLAGS.CAMP_WALL_SKULLS] == 1) outputText("There is currently one skull.  ");
			else outputText("There are currently " + num2Text(flags[kFLAGS.CAMP_WALL_SKULLS]) + " skulls.  ");
		}
		if (flags[kFLAGS.CAMP_WALL_STATUES] > 0) {
			if (flags[kFLAGS.CAMP_WALL_STATUES] == 1) output.text("Looking around the perimeter of your camp you spy a single marble imp statue.  ");
			else output.text("Dotted around and on the wall that surrounds your camp you spy " + num2Text(flags[kFLAGS.CAMP_WALL_STATUES]) + " marble imp statues.  ");
		}
		outputText("\n\n");
	}
	else outputText("You have a number of traps surrounding your makeshift home, but they are fairly simple and may not do much to deter a demon.  ");
	outputText("The portal shimmers in the background as it always does, looking menacing and reminding you of why you came.");
	if (flags[kFLAGS.ANT_KIDS] > 1000) outputText(" Really close to it there is a small entrance to the underground maze created by your ant children. And due to Phylla wish from time to time one of your children coming out this entrance to check on the situation near portal. You feel a little more safe now knowing that it will be harder for anyone to go near the portal without been noticed or...if someone came out of the portal.");
	outputText("\n\n");
	if (flags[kFLAGS.EMBER_CURRENTLY_FREAKING_ABOUT_MINOCUM] == 1) { //Ember's anti-minotaur crusade!
		//Modified Camp Description
		outputText("Since Ember began " + emberMF("his","her") + " 'crusade' against the minotaur population, skulls have begun to pile up on either side of the entrance to " + emberScene.emberMF("his","her") + " den.  There're quite a lot of them.\n\n");
	}
	if (flags[kFLAGS.FUCK_FLOWER_LEVEL] >= 4 && flags[kFLAGS.FUCK_FLOWER_KILLED] == 0) //dat tree!
		outputText("On the outer edges, half-hidden behind a rock, is a large, very healthy tree.  It grew fairly fast, but seems to be fully developed now.  Holli, Marae's corrupt spawn, lives within.\n\n");
	campFollowers(true); //display NPCs
	//MOUSEBITCH
	if (amilyScene.amilyFollower() && flags[kFLAGS.AMILY_FOLLOWER] == 1) {
		if (flags[kFLAGS.FUCK_FLOWER_LEVEL] >= 4 && flags[kFLAGS.FUCK_FLOWER_KILLED] == 0) outputText("Amily has relocated her grass bedding to the opposite side of the camp from the strange tree; every now and then, she gives it a suspicious glance, as if deciding whether to move even further.\n\n");
		else outputText("A surprisingly tidy nest of soft grasses and sweet-smelling herbs has been built close to your " + (flags[kFLAGS.CAMP_BUILT_CABIN] > 0 ? "cabin": "bedroll") + ". A much-patched blanket draped neatly over the top is further proof that Amily sleeps here. She changes the bedding every few days, to ensure it stays as nice as possible.\n\n");
	}
	campLoversMenu(true); //display Lovers
	campSlavesMenu(true); //display Slaves
	if (flags[kFLAGS.HUNGER_ENABLED] > 0 && player.hunger < 25) { //hunger check!
		outputText("<b>You have to eat something; your stomach is growling " + (player.hunger < 1 ? "painfully": "loudly") + ". </b>");
		if (player.hunger < 10) outputText("<b>You are getting thinner and you're losing muscles. </b>");
		if (player.hunger <= 0) outputText("<b>You are getting weaker due to starvation. </b>");
		outputText("\n\n");
	}
	if (player.lust >= player.maxLust()) { //the uber horny
		if (player.hasStatusEffect(StatusEffects.Dysfunction)) outputText("<b>You are debilitatingly aroused, but your sexual organs are so numbed the only way to get off would be to find something tight to fuck or get fucked...</b>\n\n");
		else if (flags[kFLAGS.UNABLE_TO_MASTURBATE_BECAUSE_CENTAUR] > 0 && player.isTaur()) outputText("<b>You are delibitatingly aroused, but your sex organs are so difficult to reach that masturbation isn't at the forefront of your mind.</b>\n\n");
		else {
			outputText("<b>You are debilitatingly aroused, and can think of doing nothing other than masturbating.</b>\n\n");
			//This once disabled the ability to rest, sleep or wait, but ir hasn't done that for many many builds
		}
	}
	//Set up rest stuff
	if (getGame().time.hours < 6 || getGame().time.hours > 20) { //night
		if (flags[kFLAGS.GAME_END] == 0) outputText("It is dark out, made worse by the lack of stars in the sky.  A blood-red moon hangs in the sky, seeming to watch you, but providing little light. It's far too dark to leave camp.\n\n"); //Lethice not defeated
		else { //Lethice defeated, proceed with weather
			switch(flags[kFLAGS.CURRENT_WEATHER]) {
				case 0:
				case 1: outputText("It is dark out. Stars dot the night sky. A blood-red moon hangs in the sky, seeming to watch you, but providing little light. It's far too dark to leave camp.\n\n"); break;
				case 2: outputText("It is dark out. The sky is covered by clouds and you could faintly make out the red spot in the clouds which is presumed to be the moon. It's far too dark to leave camp.\n\n"); break;
				case 3: outputText("It is dark out. The sky is covered by clouds raining water upon the ground. It's far too dark to leave camp.\n\n"); break;
				case 4: outputText("It is dark out. The sky is covered by clouds raining water upon the ground and occasionally the sky flashes with lightning. It's far too dark to leave camp.\n\n"); break;
				default:outputText("It is dark out. Stars dot the night sky. A blood-red moon hangs in the sky, seeming to watch you, but providing little light. It's far too dark to leave camp.\n\n");
			}
		}
		if (companionsCount() > 0 && !(getGame().time.hours > 4 && getGame().time.hours < 23))
			outputText("Your camp is silent as your companions are sleeping right now.\n");
	}
	else { //day time!
		if (flags[kFLAGS.GAME_END] > 0) { //Lethice defeated
			switch(flags[kFLAGS.CURRENT_WEATHER]) {
				case 0: outputText("The sun shines brightly, illuminating the now-blue sky. "); break;
				case 1: outputText("The sun shines brightly, illuminating the now-blue sky. Occasional clouds dot the sky, appearing to form different shapes. "); break;
				case 2: outputText("The sky is light gray as it's covered by the clouds. "); break;
				case 3: outputText("The sky is fairly dark as it's covered by the clouds that rain water upon the lands. "); break;
				case 4: outputText("The sky is dark as it's thick with dark grey clouds that rain and occasionally the sky flashes with lightning. "); break;
				default: outputText("The sky is black and flashing green 0's and 1's, seems like the weather is broken! "); break;
			}
		}
		if (getGame().time.hours == 19) {
			if (flags[kFLAGS.CURRENT_WEATHER] < 2) outputText("The sun is close to the horizon, getting ready to set. ");
			else outputText("Though you cannot see the sun, the sky near the horizon began to glow orange. ");
		}
		if (getGame().time.hours == 20) {
			if (flags[kFLAGS.CURRENT_WEATHER] < 2) outputText("The sun has already set below the horizon. The sky glows orange. ");
			else outputText("Even with the clouds, the sky near the horizon is glowing bright orange. The sun may have already set at this point. ");
		}
		outputText("It's light outside, a good time to explore and forage for supplies with which to fortify your camp.\n");
	}
	//Weather!
	if (flags[kFLAGS.CAMP_CABIN_PROGRESS] <= 0 && getGame().time.days >= 14) {
		flags[kFLAGS.CAMP_CABIN_PROGRESS] = 1; //unlock cabin
		clearOutput();
		outputText(images.showImage("camp-dream"));
		outputText("You realize that you have spent two weeks sleeping in tent every night. You think of something so you can sleep nicely and comfortably. Perhaps a cabin will suffice?");
		doNext(playerMenu);
		return;
	}
	if (flags[kFLAGS.NEW_GAME_PLUS_BONUS_UNLOCKED_HERM] == 0) {
		if (player.gender == Gender.HERM) {
			flags[kFLAGS.NEW_GAME_PLUS_BONUS_UNLOCKED_HERM] = 1; //unlock something in character creation
			outputText("\n\n<b>Congratulations! You have unlocked hermaphrodite option on character creation, accessible from New Game Plus!</b>");
			kGAMECLASS.saves.savePermObject(false);
		}
	}
	dynStats(); //workaround for #484 'statbars do not fit in their place'
	menu(); //menu
	addButton(0, "Explore", getGame().exploration.doExplore).hint("Explore to find new regions and visit any discovered regions.");
	addButton(1, "Places", places).hint("Visit any places you have discovered so far.").disableIf(placesKnown() <= 0, "You haven't discovered any places yet...");
	addButton(2, "Inventory", inventory.inventoryMenu).hint("The inventory allows you to use an item.  Be careful as this leaves you open to a counterattack when in combat.");
	addButton(3, "Stash", inventory.stash).hint("The stash allows you to store your items safely until you need them later.").disableIf(!inventory.showStash(), "You currently don't have any form of storage with you.");
	addButton(4, "Camp Actions", campActions).hint("Interact with the camp surroundings and also read your codex.");
	if (followersCount() > 0) addButton(5, "Followers", campFollowers).hint("Check up on any followers or companions who are joining you in or around your camp.  You'll probably just end up sleeping with them.");
	if (loversCount() > 0) addButton(6, "Lovers", campLoversMenu).hint("Check up on any lovers you have invited so far to your camp and interact with them.");
	if (slavesCount() > 0) addButton(7, "Slaves", campSlavesMenu).hint("Check up on any slaves you have received and interact with them.");
var  canFap: boolean = !player.hasStatusEffect(StatusEffects.Dysfunction) && (flags[kFLAGS.UNABLE_TO_MASTURBATE_BECAUSE_CENTAUR] == 0 && !player.isTaur());
	getGame().masturbation.setMasturbateButton();
	addButton(9, "Wait", doWait).hint("Wait for four hours.\n\nShift-click to wait until the night comes.");
	if (player.fatigue > 40 || player.HP / player.maxHP() <= .9) addButton(9, "Rest", rest).hint("Rest for four hours.\n\nShift-click to rest until fully healed or night comes.");
	if (getGame().time.hours >= 21 || getGame().time.hours < 6) addButton(9, "Sleep", doSleep).hint("Turn yourself in for the night.");
	if (isAprilFools())
		addButton(12, "Cash Shop", getGame().aprilFools.pay2WinSelection).hint("Need more gems? Want to buy special items to give you the edge? Purchase with real money!");
	//Remove buttons according to conditions
	if (getGame().time.hours >= 21 || getGame().time.hours < 6) {
		addDisabledButton(0, kGAMECLASS.output.getButtonText(0), "It's too dark outside. It wouldn't be a good idea to explore when danger lurks in every corner of darkness."); //Explore
		addDisabledButton(1, kGAMECLASS.output.getButtonText(1), "It's too dark outside. It wouldn't be a good idea to explore when danger lurks in every corner of darkness."); //Explore
		if (getGame().time.hours >= 23 || getGame().time.hours < 5) {
			addDisabledButton(4, kGAMECLASS.output.getButtonText(4), "You are too tired to perform any camp actions. All you can do right now is to sleep until morning."); //Camp Actions
			if (followersCount() > 0) addDisabledButton(5, kGAMECLASS.output.getButtonText(5), "Your followers are sleeping at the moment."); //Followers
			if (loversCount() > 0) addDisabledButton(6, kGAMECLASS.output.getButtonText(6), "Your lovers are sleeping at the moment."); //Followers
			if (slavesCount() > 0) addDisabledButton(7, kGAMECLASS.output.getButtonText(7), "Your slaves are sleeping at the moment. Even slaves need their sleepy times to recuperate."); //Followers
		}
	}
	if (player.lust >= player.maxLust() && canFap) {
		addDisabledButton(0, "Explore", "You are too aroused to consider leaving the camp. It wouldn't be a good idea to explore with all that tension bottled up inside you!"); //Explore
		addDisabledButton(1, "Places", "You are too aroused to consider leaving the camp. It wouldn't be a good idea to explore with all that tension bottled up inside you!"); //Explore
	}
	if (flags[kFLAGS.HUNGER_ENABLED] >= 1 && player.ballSize > (18 + (player.str / 2) + (player.tallness / 4))) {
		badEndGIANTBALLZ(); //Massive Balls Bad End (Realistic Mode only)
		return;
	}
	if (flags[kFLAGS.HUNGER_ENABLED] > 0 && player.hunger <= 0) {
		if (player.HP <= 0 && (player.str + player.tou) < 30) { //bad end at 0 HP!
			badEndHunger(); //Hunger Bad End
			return;
		}
	}
	if (player.minLust() >= player.maxLust() && !flags[kFLAGS.SHOULDRA_SLEEP_TIMER] <= 168 && !player.eggs() >= 20 && !player.hasStatusEffect(StatusEffects.BimboChampagne) && !player.hasStatusEffect(StatusEffects.Luststick) && player.jewelryEffectId != 1) {
		badEndMinLust(); //Min Lust Bad End (Must not have any removable/temporary min lust)
		return;
	}
}

public  hasCompanions(): boolean { return companionsCount() > 0; }
public  companionsCount(): number { return followersCount() + slavesCount() + loversCount(); }
public  followersCount(): number {
var  counter: number = 0;
	if (emberScene.followerEmber()) counter++;
	if (flags[kFLAGS.VALARIA_AT_CAMP] == 1 || player.armor == armors.GOOARMR) counter++;
	if (player.hasStatusEffect(StatusEffects.PureCampJojo)) counter++;
	if (player.hasStatusEffect(StatusEffects.CampRathazul)) counter++;
	if (followerShouldra()) counter++;
	if (sophieFollower() && flags[kFLAGS.FOLLOWER_AT_FARM_SOPHIE] == 0) counter++;
	if (helspawnFollower()) counter++;
	return counter;
}

public  slavesCount(): number {
var  counter: number = 0;
	if (latexGooFollower() && flags[kFLAGS.FOLLOWER_AT_FARM_LATEXY] == 0) counter++;
	if (vapulaSlave() && flags[kFLAGS.FOLLOWER_AT_FARM_VAPULA] == 0) counter++;
	if (campCorruptJojo() && flags[kFLAGS.FOLLOWER_AT_FARM_JOJO] == 0) counter++;
	if (amilyScene.amilyFollower() && amilyScene.amilyCorrupt() && flags[kFLAGS.FOLLOWER_AT_FARM_AMILY] == 0) counter++;
	if (bimboSophie() && flags[kFLAGS.FOLLOWER_AT_FARM_SOPHIE] == 0) counter++; //Bimbo Sophie
	if (ceraphIsFollower()) counter++;
	if (milkSlave() && flags[kFLAGS.FOLLOWER_AT_FARM_BATH_GIRL] == 0) counter++;
	return counter;
}

public  loversCount(): number {
var  counter: number = 0;
	if (arianScene.arianFollower()) counter++;
	if (followerHel()) counter++;
	if (flags[kFLAGS.IZMA_FOLLOWER_STATUS] == 1 && flags[kFLAGS.FOLLOWER_AT_FARM_IZMA] == 0) counter++; //Izma!
	if (isabellaFollower() && flags[kFLAGS.FOLLOWER_AT_FARM_ISABELLA] == 0) counter++;
	if (player.hasStatusEffect(StatusEffects.CampMarble) && flags[kFLAGS.FOLLOWER_AT_FARM_MARBLE] == 0) counter++;
	if (amilyScene.amilyFollower() && !amilyScene.amilyCorrupt()) counter++;
	if (followerKiha()) counter++;
	if (flags[kFLAGS.NIEVE_STAGE] == 5) counter++;
	if (flags[kFLAGS.ANT_WAIFU] > 0) counter++;
	return counter;
}
//----------------- COMPANIONS -----------------
public  campLoversMenu(descOnly: boolean = false): void {
	if (!descOnly) {
		hideMenus();
		spriteSelect(undefined);
		clearOutput();
		getGame().inCombat = false;
		menu();
	}
	if (isAprilFools() && flags[kFLAGS.DLC_APRIL_FOOLS] == 0 && !descOnly) {
		outputText(images.showImage("event-dlc"));
		getGame().aprilFools.DLCPrompt("Lovers DLC", "Get the Lovers DLC to be able to interact with them and have sex! Start families! The possibilities are endless!", "$4.99", doCamp);
		return;
	}
	//AMILY
	if (amilyScene.amilyFollower() && flags[kFLAGS.AMILY_FOLLOWER] == 1 && flags[kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO] == 0 && !descOnly) {
		outputText("Amily is currently strolling around your camp, ");
		temp = rand(6);
		if (temp == 0) {
			outputText("dripping water and stark naked from a bath in the stream");
			if (player.hasStatusEffect(StatusEffects.CampRathazul)) outputText(".  Rathazul glances over and immediately gets a nosebleed");
		}
		else if (temp == 1) outputText("slouching in the shade of some particularly prominent rocks, whittling twigs to create darts for her blowpipe");
		else if (temp == 2) outputText("dipping freshly-made darts into a jar of something that looks poisonous");
		else if (temp == 3) outputText("eating some of your supplies");
		else if (temp == 4) outputText("and she flops down on her nest to have a rest");
		else outputText("peeling the last strips of flesh off of an imp's skull and putting it on a particularly flat, sun-lit rock to bleach as a trophy");
		outputText(".\n\n");
		addButton(0, "Amily", amilyScene.amilyFollowerEncounter);
	}
	else if (flags[kFLAGS.AMILY_VISITING_URTA] == 1 || flags[kFLAGS.AMILY_VISITING_URTA] == 2) //Amily out freaking Urta?
		outputText("Amily's bed of grass and herbs lies empty, the mouse-woman still absent from her sojourn to meet your other lover.\n\n");
	//Arian
	if (arianScene.arianFollower()) {
		outputText("Arian's tent is here, if you'd like to go inside.\n\n");
		addButton(1, "Arian", arianScene.visitAriansHouse);
	}
	//Helia
	if (kGAMECLASS.helScene.followerHel()) {
		if (flags[kFLAGS.HEL_FOLLOWER_LEVEL] == 2) {
			//Hel @ Camp: Follower Menu
			if (getGame().time.hours <= 7) //6-7
				outputText("Hel is currently sitting at the edge of camp, surrounded by her scraps of armor, sword, and a few half-empty bottles of vodka.  By the way she's grunting and growling, it looks like she's getting ready to flip her shit and go running off into the plains in her berserker state.\n\n");
			else if (getGame().time.hours <= 17) //8a-5p
				outputText("Hel's out of camp at the moment, adventuring on the plains.  You're sure she'd be on hand in moments if you needed her, though.\n\n");
			else if (getGame().time.hours <= 19) //5-7
				outputText("Hel's out visiting her family in Tel'Adre right now, though you're sure she's only moments away if you need her.\n\n");
			else //7+
				outputText("Hel is fussing around her hammock, checking her gear and sharpening her collection of blades.  Each time you glance her way, though, the salamander puts a little extra sway in her hips and her tail wags happily.\n\n");
		}
		else if (flags[kFLAGS.HEL_FOLLOWER_LEVEL] == 1) {
			if (flags[kFLAGS.HEL_HARPY_QUEEN_DEFEATED] == 1) outputText("Hel has returned to camp, though for now she looks a bit bored.  Perhaps she is waiting on something.\n\n");
			else outputText("<b>You see the salamander Helia pacing around camp, anxiously awaiting your departure to the harpy roost. Seeing you looking her way, she perks up, obviously ready to get underway.</b>\n\n");
		}
		addButton(2, "Helia", helFollower.heliaFollowerMenu);
	}
	//Isabella
	if (isabellaFollower() && flags[kFLAGS.FOLLOWER_AT_FARM_ISABELLA] == 0) {
		if (getGame().time.hours >= 21 || getGame().time.hours <= 5) outputText("Isabella is sound asleep in her bunk and quietly snoring.");
		else if (getGame().time.hours == 6) outputText("Isabella is busy eating some kind of grain-based snack for breakfast.  The curly-haired cow-girl gives you a smile when she sees you look her way.");
		else if (getGame().time.hours == 7) outputText("Isabella, the red-headed cow-girl, is busy with a needle and thread, fixing up some of her clothes.");
		else if (getGame().time.hours == 8) outputText("Isabella is busy cleaning up the camp, but when she notices you looking her way, she stretches up and arches her back, pressing eight bullet-hard nipples into the sheer silk top she prefers to wear.");
		else if (getGame().time.hours == 9) outputText("Isabella is out near the fringes of your campsite.  She has her massive shield in one hand and appears to be keeping a sharp eye out for intruders or demons.  When she sees you looking her way, she gives you a wave.");
		else if (getGame().time.hours == 10) outputText("The cow-girl warrioress, Isabella, is sitting down on a chair and counting out gems from a strange pouch.  She must have defeated someone or something recently.");
		else if (getGame().time.hours == 11) outputText("Isabella is sipping from a bottle labelled 'Lactaid' in a shaded corner.  When she sees you looking she blushes, though dark spots appear on her top and in her skirt's middle.");
		else if (getGame().time.hours == 12) outputText("Isabella is cooking a slab of meat over the fire.  From the smell that's wafting this way, you think it's beef.  Idly, you wonder if she realizes just how much like her chosen food animal she has become.");
		else if (getGame().time.hours == 13) {
			outputText("Isabella ");
		var  izzyCreeps: any[] = [];
			//Build array of choices for izzy to talk to
			if (player.hasStatusEffect(StatusEffects.CampRathazul)) izzyCreeps[izzyCreeps.length] = 0;
			if (player.hasStatusEffect(StatusEffects.PureCampJojo)) izzyCreeps[izzyCreeps.length] = 1;
			if (amilyScene.amilyFollower() && flags[kFLAGS.AMILY_FOLLOWER] == 1 && flags[kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO] == 0) izzyCreeps[izzyCreeps.length] = 2;
			if (amilyScene.amilyFollower() && flags[kFLAGS.AMILY_FOLLOWER] == 2 && flags[kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO] == 0 && flags[kFLAGS.FOLLOWER_AT_FARM_AMILY] == 0) izzyCreeps[izzyCreeps.length] = 3;
			if (flags[kFLAGS.IZMA_FOLLOWER_STATUS] == 1 && flags[kFLAGS.FOLLOWER_AT_FARM_IZMA] == 0) izzyCreeps[izzyCreeps.length] = 4;
			//Base choice - book
			izzyCreeps[izzyCreeps.length] = 5;
			//Select!
		var  choice: number = rand(izzyCreeps.length);
			if (izzyCreeps[choice] == 0) outputText("is sitting down with Rathazul, chatting amiably about the weather.");
			else if (izzyCreeps[choice] == 1) outputText("is sitting down with Jojo, smiling knowingly as the mouse struggles to keep his eyes on her face.");
			else if (izzyCreeps[choice] == 2) outputText("is talking with Amily, sharing stories of the fights she's been in and the enemies she's faced down.  Amily seems interested but unimpressed.");
			else if (izzyCreeps[choice] == 3) outputText("is sitting down chatting with Amily, but the corrupt mousette is just staring at Isabella's boobs and masturbating.  The cow-girl is pretending not to notice.");
			else if (izzyCreeps[choice] == 4) outputText("is sitting down with Izma and recounting some stories, somewhat nervously.  Izma keeps flashing her teeth in a predatory smile.");
			else outputText("is sitting down and thumbing through a book.");
		}
		else if (getGame().time.hours == 14) outputText("Isabella is working a grindstone and sharpening her tools.  She even hones the bottom edge of her shield into a razor-sharp cutting edge.  The cow-girl is sweating heavily, but it only makes the diaphanous silk of her top cling more alluringly to her weighty chest.");
		else if (getGame().time.hours == 15) outputText("The warrior-woman, Isabella is busy constructing dummies of wood and straw, then destroying them with vicious blows from her shield.  Most of the time she finishes by decapitating them with the sharp, bottom edge of her weapon.  She flashes a smile your way when she sees you.");
		else if (getGame().time.hours == 16) outputText("Isabella is sitting down with a knife, the blade flashing in the sun as wood shavings fall to the ground.  Her hands move with mechanical, practiced rhythm as she carves a few hunks of shapeless old wood into tools or art.");
		else if (getGame().time.hours == 17) outputText("Isabella is sitting against one of the large rocks near the outskirts of your camp, staring across the wasteland while idly munching on what you assume to be a leg of lamb.  She seems lost in thought, though that doesn't stop her from throwing a wink and a goofy food-filled grin toward you.");
		else if (getGame().time.hours == 18) outputText("The dark-skinned cow-girl, Isabella, is sprawled out on a carpet and stretching.  She seems surprisingly flexible for someone with hooves and oddly-jointed lower legs.");
		else if (getGame().time.hours == 19) {
			if (flags[kFLAGS.ISABELLA_MILKED_YET] == -1) //Izzy Milked Yet flag = -1
				 outputText("Isabella has just returned from a late visit to Whitney's farm, bearing a few filled bottles and a small pouch of gems.");
			else outputText("Isabella was hidden behind a rock when you started looking for her, but as soon as you spot her in the darkness, she jumps, a guilty look flashing across her features.  She turns around and adjusts her top before looking back your way, her dusky skin even darker from a blush.  The cow-girl gives you a smile and walks back to her part of camp.  A patch of white decorates the ground where she was standing - is that milk?  Whatever it is, it's gone almost as fast as you see it, devoured by the parched, wasteland earth.");
		}
		else if (getGame().time.hours == 20) outputText("Your favorite chocolate-colored cowgirl, Isabella, is moving about, gathering all of her scattered belongings and replacing them in her personal chest.  She yawns more than once, indicating her readiness to hit the hay, but her occasional glance your way lets you know she wouldn't mind some company before bed.");
		else outputText("Isabella looks incredibly bored right now.");
		if (isabellaScene.totalIsabellaChildren() > 0) {
		var  babiesList: any[] = [];
			if (isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_BOYS) > 0) babiesList.push((isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_BOYS) == 1 ? "a" : num2Text(isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_BOYS))) + " human son" + (isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_BOYS) == 1 ? "" : "s"));
			if (isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_GIRLS) > 0) babiesList.push((isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_GIRLS) == 1 ? "a" : num2Text(isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_GIRLS))) + " human daughter" + (isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_GIRLS) == 1 ? "" : "s"));
			if (isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_HERMS) > 0) babiesList.push((isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_HERMS) == 1 ? "a" : num2Text(isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_HERMS))) + " human herm" + (isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_HERMS) == 1 ? "" : "s"));
			if (isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWGIRLS) > 0) babiesList.push((isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWGIRLS) == 1 ? "a" : num2Text(isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWGIRLS))) + " cow girl" + (isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWGIRLS) == 1 ? "" : "s"));
			if (isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWFUTAS) > 0) babiesList.push((isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWFUTAS) == 1 ? "a" : num2Text(isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWFUTAS))) + " cow herm" + (isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWFUTAS) == 1 ? "" : "s"));
			outputText("  Isabella has set up a small part of her \"corner\" in the camp as a nursery. She has sawn a " + (Math.ceil(isabellaScene.totalIsabellaChildren() / 2) == 1 ? "barrel" : "number of barrels") + " in half and lined " + (Math.ceil(isabellaScene.totalIsabellaChildren() / 2) == 1 ? "it" : "them") + " with blankets and pillows to serve as rocking cribs. "); 
			outputText("You have " + formatStringArray(babiesList) + " with her, all living here; unlike native Marethians, they will need years and years of care before they can go out into the world on their own.");
		}
		outputText("\n\n");
		addButton(3, "Isabella", isabellaFollowerScene.callForFollowerIsabella);
	}
	//Izma
	if (izmaFollower() && flags[kFLAGS.FOLLOWER_AT_FARM_IZMA] == 0) {
		if (flags[kFLAGS.IZMA_BROFIED] > 0) {
			if (rand(6) == 0 && camp.vapulaSlave() && flags[kFLAGS.VAPULA_HAREM_FUCK] > 0) outputText("Izmael is standing a short distance away with an expression of unadulterated joy on his face, Vapula knelt in front of him and fellating him with noisy enthusiasm.  The shark morph dreamily opens his eyes to catch you staring, and proceeds to give you a huge grin and two solid thumbs up.");
			else if (getGame().time.hours >= 6 && getGame().time.hours <= 12) outputText("You keep hearing the sound of objects hitting water followed by peals of male laughter coming from the stream. It sounds as if Izmael is throwing large rocks into the stream and finding immense gratification from the results. In fact, you’re pretty sure that’s exactly what he’s doing.");
			else if (getGame().time.hours <= 16) outputText("Izmael is a short distance away doing squat thrusts, his body working like a piston, gleaming with sweat. He keeps bobbing his head up to see if anybody is watching him.");
			else if (getGame().time.hours <= 19) outputText("Izmael is sat against his book chest, masturbating furiously without a care in the world. Eyes closed, both hands pumping his immense shaft, there is an expression of pure, childish joy on his face.");
			else if (getGame().time.hours <= 22) outputText("Izmael has built a fire and is flopped down next to it. You can’t help but notice that he’s used several of his books for kindling. His eyes are locked on the flames, mesmerized by the dancing light and heat.");
			else outputText("Izmael is currently on his bedroll, sleeping for the night.");
			outputText("\n\n");
			addButton(4, "Izmael", izmaScene.izmaelScene.izmaelMenu);
		}
		else {
			outputText("Neatly laid near the base of your own is a worn bedroll belonging to Izma, your tigershark lover. It's a snug fit for her toned body, though it has some noticeable cuts and tears in the fabric. Close to her bed is her old trunk, almost as if she wants to have it at arms length if anyone tries to rob her in her sleep.\n\n");
			switch(rand(3)) {
				case 0: outputText("Izma's lazily sitting on the trunk beside her bedroll, reading one of the many books from inside it. She smiles happily when your eyes linger on her, and you know full well she's only half-interested in it."); break;
				case 1: outputText("You notice Izma isn't around right now. She's probably gone off to the nearby stream to get some water. Never mind, she comes around from behind a rock, still dripping wet."); break;
				case 2: outputText("Izma is lying on her back near her bedroll. You wonder at first just why she isn't using her bed, but as you look closer you notice all the water pooled beneath her and the few droplets running down her arm, evidence that she's just returned from the stream."); break;
				default: //This line shouldn't happen, move along!
			}
			outputText("\n\n");
			addButton(4, "Izma", izmaScene.izmaFollowerMenu);
		}
	}
	//Kiha!
	if (followerKiha()) {
		if (getGame().time.hours < 7) //6-7
			outputText("Kiha is sitting near the fire, her axe laying across her knees as she polishes it.\n\n");
		else if (getGame().time.hours < 19) {
			if (kihaFollower.totalKihaChildren() > 0 && flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] > 160 && (flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] % 3 == 0 || getGame().time.hours == 17)) outputText("Kiha is breastfeeding her offspring right now.\n\n");
			else if (kihaFollower.totalKihaChildren() > 0 && flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] > 80 && flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] <= 160 && (flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] % 7 == 0 || getGame().time.hours == 17)) outputText("Kiha is telling stories to her draconic child" + (kihaFollower.totalKihaChildren() == 1 ? "" : "ren") + " right now.\n\n");
			else outputText("Kiha's out right now, likely patrolling for demons to exterminate.  You're sure a loud call could get her attention.\n\n");
		}
		else {
			if (kihaFollower.totalKihaChildren() > 0 && flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] > 160 && (flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] % 3 == 0 || getGame().time.hours == 20)) outputText("Kiha is breastfeeding her offspring right now.\n\n");
			else if (kihaFollower.totalKihaChildren() > 0 && flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] > 80 && flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] <= 160 && (flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] % 7 == 0 || getGame().time.hours == 20)) outputText("Kiha is telling stories to her draconic child" + (kihaFollower.totalKihaChildren() == 1 ? "" : "ren") + " right now.\n\n");
			else if (kihaFollower.totalKihaChildren() > 0 && flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] <= 80 && (flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] % 3 == 0 || getGame().time.hours == 20)) {
				outputText("Kiha is training her " + (kihaFollower.totalKihaChildren() == 1 ? "child to become a strong warrior" : "children to become strong warriors") + ". ");
				if (rand(2) == 0) outputText("Right now, she's teaching various techniques.\n\n");
				else outputText("Right now, she's teaching her child" + (kihaFollower.totalKihaChildren() == 1 ? "" : "ren") + " how to make use of axes.\n\n");
			}
			else {
				outputText("Kiha is utterly decimating a set of practice dummies she's set up out on the edge of camp.  All of them have crudely drawn horns. ");
				if (kihaFollower.totalKihaChildren() > 0 && (kihaFollower.totalKihaChildren() >= 2 || flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] <= 60)) outputText("Some of them are saved for her child" + (kihaFollower.totalKihaChildren() == 1 ? "" : "ren") + " to train on. ");
				outputText("Most of them are on fire.\n\n");
			}
		}
		addButton(5, "Kiha", kihaScene.encounterKiha);
	}
	//MARBLE
	if (player.hasStatusEffect(StatusEffects.CampMarble) && flags[kFLAGS.FOLLOWER_AT_FARM_MARBLE] === 0) {
		temp = rand(5);
		outputText("A second bedroll rests next to yours; a large two handed hammer sometimes rests against it, depending on whether or not its owner needs it at the time.  ");
		if (flags[kFLAGS.MARBLE_PURIFICATION_STAGE] === 4) //normal Murbles
			outputText("Marble isn’t here right now; she’s still off to see her family.");
		else if (flags[kFLAGS.MARBLE_KIDS] >= 1 && (getGame().time.hours === 19 || getGame().time.hours === 20)) { //requires at least 1 kid, time is just before sunset, this scene always happens at this time if the PC has at least one kid
			outputText("Marble herself is currently in the nursery, putting your ");
			if (flags[kFLAGS.MARBLE_KIDS] == 1) outputText("child");
			else outputText("children");
			outputText(" to bed.");
		}
		else if (getGame().time.hours === 6 || getGame().time.hours === 7) //at 6-7 in the morning, scene always displays at this time
			outputText("Marble is off in an open area to the side of your camp right now.  She is practicing with her large hammer, going through her daily training.");
		else if (getGame().time.hours >= 21 && !player.hasStatusEffect(StatusEffects.Infested)) { //after nightfall, scene always displays at this time unless PC is wormed
			outputText("Marble is hanging around her bedroll waiting for you to come to bed.  However, sometimes she lies down for a bit, and sometimes she paces next to it.");
			if (flags[kFLAGS.MARBLE_LUST] > 30) outputText("  She seems to be feeling antsy.");
		}
		else if (flags[kFLAGS.MARBLE_KIDS] > 0 && getGame().time.hours < 19 && getGame().time.hours > 7) {
			if (rand(2) === 0 && flags[kFLAGS.MARBLE_KIDS] > 5) //requires at least 6 kids, and no other parental characters in camp
				outputText("Marble is currently tending to your kids, but she looks a bit stressed out right now.  It looks like " + num2Text(flags[kFLAGS.MARBLE_KIDS]) + " might just be too many for her to handle on her own...");
			else if (rand(3) === 0 && flags[kFLAGS.MARBLE_KIDS] > 3) //requires at least 4 kids
				outputText("Marble herself is in the camp right now, telling a story about her travels around the world to her kids as they gather around her.  The children are completely enthralled by her words.  You can't help but smile.");
			else if (rand(3) === 0 && flags[kFLAGS.MARBLE_BOYS] > 1) //requires 2 boys
				outputText("Marble herself is currently refereeing a wrestling match between two of your sons.  It seems like it's a contest to see which one of them gets to go for a ride between her breasts in a game of <i>Bull Blasters</i>, while the loser has to sit on her shoulders.");
			//requires at least 2 kids
			else if (rand(3) === 0 && flags[kFLAGS.MARBLE_KIDS] - flags[kFLAGS.MARBLE_BOYS] > 1) outputText("Marble herself is involved in a play fight with two of your kids brandishing small sticks.  It seems that the <i>mommy monster</i> is terrorising the camp and needs to be stopped by the <i>Mighty Moo and her sidekick Bovine Lass</i>.");
			else if (rand(3) === 0 && flags[kFLAGS.MARBLE_KIDS] > 1) outputText("Marble herself is out right now; she's taken her kids to go visit Whitney.  You're sure though that she'll be back within the hour, so you could just wait if you needed her.");
			//requires at least 1 kid
			else {
				if (rand(2) === 0) {
					outputText("Marble herself is nursing ");
					if (flags[kFLAGS.MARBLE_KIDS] > 1) outputText("one of your cow-girl children");
					else outputText("your cow-girl child");
					outputText(" with a content look on her face.");
				}
				else {
					outputText("Marble herself is watching your kid");
					if (flags[kFLAGS.MARBLE_KIDS] > 0) outputText("s");
					outputText(" playing around the camp right now.");
				}
			}
		}
		//Choose one of these at random to display each hour
		else if (temp == 0) outputText("Marble herself has gone off to Whitney's farm to get milked right now.");
		else if (temp == 1) outputText("Marble herself has gone off to Whitney's farm to do some chores right now.");
		else if (temp == 2) outputText("Marble herself isn't at the camp right now; she is probably off getting supplies, though she'll be back soon enough.");
		else if (temp == 3) outputText("Marble herself is resting on her bedroll right now.");
		else if (temp == 4) outputText("Marble herself is wandering around the camp right now.");

		if (temp < 3) outputText("  You're sure she'd be back in moments if you needed her.");
		else outputText("Marble is out in the wilderness right now, searching for a relative."); //out getting family
		outputText("\n\n");
		if (flags[kFLAGS.MARBLE_PURIFICATION_STAGE] !== 4) addButton(6, "Marble", marbleScene.interactWithMarbleAtCamp).hint("Go to Marble the cowgirl for talk and companionship.");
	}
	//Nieve
	if (flags[kFLAGS.NIEVE_STAGE] == 5) {
		kGAMECLASS.xmas.xmasMisc.nieveCampDescs();
		outputText("\n\n");
		addButton(7, "Nieve", getGame().xmas.xmasMisc.approachNieve);
	}
	//Phylla
	if (flags[kFLAGS.ANT_WAIFU] > 0) {
		outputText("You see Phylla's anthill in the distance.  Every now and then you see");
		//If PC has children w/ Phylla:
		if (flags[kFLAGS.ANT_KIDS] > 0 && flags[kFLAGS.ANT_KIDS] <= 250) outputText(" one of your children exit the anthill to unload some dirt before continuing back down into the colony.  It makes you feel good knowing your offspring are so productive.");
		if (flags[kFLAGS.ANT_KIDS] > 250 && flags[kFLAGS.ANT_KIDS] <= 1000) outputText(" few of your many children exit the anthill to unload some dirt before vanishing back inside.  It makes you feel good knowing your offspring are so productive.");
		if (flags[kFLAGS.ANT_KIDS] > 1000) outputText(" some of your children exit the anthill using main or one of the additionally entrances to unload some dirt. Some of them instead of unloading dirt coming out to fulfill some other task that their mother gave them.  You feel a little nostalgic seeing how this former small colony grown to such a magnificent size.");
		else outputText(" Phylla appears out of the anthill to unload some dirt.  She looks over to your campsite and gives you an excited wave before heading back into the colony.  It makes you feel good to know she's so close.");
		outputText("\n\n");
		addButton(8,"Phylla", getGame().desert.antsScene.introductionToPhyllaFollower);
	}
	addButton(14, "Back", playerMenu);
}

public  campSlavesMenu(descOnly: boolean = false): void {
	if (!descOnly) {
		hideMenus();
		spriteSelect(undefined);
		clearOutput();
		getGame().inCombat = false;
		menu();
	}
	if (isAprilFools() && flags[kFLAGS.DLC_APRIL_FOOLS] == 0 && !descOnly) {
		outputText(images.showImage("event-dlc"));
		getGame().aprilFools.DLCPrompt("Slaves DLC", "Get the Slaves DLC to be able to interact with them. Show them that you're dominating!", "$4.99", doCamp);
		return;
	}
	if (latexGooFollower() && flags[kFLAGS.FOLLOWER_AT_FARM_LATEXY] == 0) {
		outputText(flags[kFLAGS.GOO_NAME] + " lurks in a secluded section of rocks, only venturing out when called for or when she needs to gather water from the stream.\n\n");
		addButton(0, flags[kFLAGS.GOO_NAME], latexGirl.approachLatexy);
	}
	if (milkSlave() && flags[kFLAGS.FOLLOWER_AT_FARM_BATH_GIRL] == 0) {
		outputText("Your well-endowed, dark-skinned milk-girl is here.  She flicks hopeful eyes towards you whenever she thinks she has your attention.\n\n");
		addButton(1, flags[kFLAGS.MILK_NAME], milkWaifu.milkyMenu);
	}
	//Ceraph
	if (ceraphIsFollower()) addButton(5, "Ceraph", ceraphFollowerScene.ceraphFollowerEncounter);
	//Vapula
	if (vapulaSlave() && flags[kFLAGS.FOLLOWER_AT_FARM_VAPULA] == 0) {
		vapula.vapulaSlaveFlavorText();
		outputText("\n\n");
		addButton(6, "Vapula", vapula.callSlaveVapula);
	}
	//Modified Camp/Follower List Description:
	if (amilyScene.amilyFollower() && flags[kFLAGS.AMILY_FOLLOWER] == 2 && flags[kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO] == 0 && flags[kFLAGS.FOLLOWER_AT_FARM_AMILY] == 0) {
		outputText("Sometimes you hear a faint moan from not too far away. No doubt the result of your slutty toy mouse playing with herself.\n\n");
		addButton(10, "Amily", amilyScene.amilyFollowerEncounter);
	}
	//JOJO
	if (campCorruptJojo() && flags[kFLAGS.FOLLOWER_AT_FARM_JOJO] == 0) { //if Jojo is corrupted, add him to the masturbate menu.
		outputText("From time to time you can hear movement from around your camp, and you routinely find thick puddles of mouse semen.  You are sure Jojo is here if you ever need to sate yourself.\n\n");
		addButton(11, "Jojo", jojoScene.corruptCampJojo).hint("Call your corrupted pet into camp in order to relieve your desires in a variety of sexual positions?  He's ever so willing after your last encounter with him.");
	}
	//Bimbo Sophie
	if (bimboSophie() && flags[kFLAGS.FOLLOWER_AT_FARM_SOPHIE] == 0) {
		sophieBimbo.sophieCampLines();
		addButton(12, "Sophie", sophieBimbo.approachBimboSophieInCamp);
	}
	addButton(14, "Back", playerMenu);
}

public  campFollowers(descOnly: boolean = false): void {
	if (!descOnly) {
		hideMenus();
		spriteSelect(undefined);
		clearOutput();
		getGame().inCombat = false;
		//ADD MENU FLAGS/INDIVIDUAL FOLLOWER TEXTS
		menu();
	}
	//Ember
	if (emberScene.followerEmber()) {
		emberScene.emberCampDesc();
		addButton(0, "Ember", emberScene.emberCampMenu).hint("Check up on Ember the dragon-" + (flags[kFLAGS.EMBER_ROUNDFACE] == 0 ? "morph" : flags[kFLAGS.EMBER_GENDER] == 1 ? "boy" : "girl" ) + "");
	}
	//Sophie
	if (sophieFollower() && flags[kFLAGS.FOLLOWER_AT_FARM_SOPHIE] == 0) {
		if (rand(5) == 0) outputText("Sophie is sitting by herself, applying yet another layer of glittering lip gloss to her full lips.\n\n");
		else if (rand(4) == 0) outputText("Sophie is sitting in her nest, idly brushing out her feathers.  Occasionally, she looks up from her work to give you a sultry wink and a come-hither gaze.\n\n");
		else if (rand(3) == 0) outputText("Sophie is fussing around in her nest, straightening bits of straw and grass, trying to make it more comfortable.  After a few minutes, she flops down in the middle and reclines, apparently satisfied for the moment.\n\n");
		else if (rand(2) == 0 || flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] == 0) {
			if (flags[kFLAGS.SOPHIE_BIMBO] > 0) outputText("Your platinum-blonde harpy, Sophie, is currently reading a book - a marked change from her bimbo-era behavior.  Occasionally, though, she glances up from the page and gives you a lusty look.  Some things never change....\n\n");
			else outputText("Your pink harpy, Sophie, is currently reading a book.  She seems utterly absorbed in it, though you question how she obtained it.  Occasionally, though, she'll glance up from the pages to shoot you a lusty look.\n\n");
		}
		else {
			outputText("Sophie is sitting in her nest, ");
			if (flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] < 5) {
				outputText("across from your daughter");
				if (flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] > 1) outputText("s");
			}
			else outputText("surrounded by your daughters");
			outputText(", apparently trying to teach ");
			if (flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] == 1) outputText("her");
			else outputText("them");
			outputText(" about hunting and gathering techniques.  Considering their unusual upbringing, it can't be as easy for them...\n\n");
		}
		addButton(1, "Sophie", sophieFollowerScene.followerSophieMainScreen).hint("Check up on Sophie the harpy.");
	}
	//Pure Jojo
	if (player.hasStatusEffect(StatusEffects.PureCampJojo)) {
		if (flags[kFLAGS.JOJO_BIMBO_STATE] >= 3) {
			outputText("Joy's tent is set up in a quiet corner of the camp, close to a boulder. Inside the tent, you can see a chest holding her belongings, as well as a few clothes and books spread about her bedroll. ");
			if (flags[kFLAGS.JOJO_LITTERS] > 0 && getGame().time.hours >= 16 && getGame().time.hours < 19) outputText("You spot the little mice you had with Joy playing about close to her tent.");
			else outputText("Joy herself is nowhere to be found, she's probably out frolicking about or sitting atop the boulder.");
			outputText("\n\n");
			addButton(2, "Joy", joyScene.approachCampJoy).hint("Go find Joy around the edges of your camp and meditate with her or have sex with her.");
		}
		else {
			outputText("There is a small bedroll for Jojo near your own");
			if (flags[kFLAGS.CAMP_BUILT_CABIN] > 0) outputText(" cabin");
			if (!(getGame().time.hours > 4 && getGame().time.hours < 23)) outputText(" and the mouse is sleeping on it right now.\n\n");
			else outputText(", though the mouse is probably hanging around the camp's perimeter.\n\n");
			addButton(2, "Jojo", jojoScene.jojoCamp).hint("Go find Jojo around the edges of your camp and meditate with him or talk about watch duty.");
		}
	}
	if (helspawnFollower()) //Helspawn
		addButton(3, flags[kFLAGS.HELSPAWN_NAME], helSpawnScene.helspawnsMainMenu);
	//RATHAZUL
	if (player.hasStatusEffect(StatusEffects.CampRathazul)) { //if rathazul has joined the camp
		if (flags[kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN] <= 1) {
			outputText("Tucked into a shaded corner of the rocks is a bevy of alchemical devices and equipment.  ");
			if (!(getGame().time.hours > 4 && getGame().time.hours < 23)) outputText("The alchemist is absent from his usual work location. He must be sleeping right now.");
			else outputText("The alchemist Rathazul looks to be hard at work with his chemicals, working on who knows what.");
			if (flags[kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN] == 1) outputText("  Some kind of spider-silk-based equipment is hanging from a nearby rack.  <b>He's finished with the task you gave him!</b>");
			outputText("\n\n");
		}
		else outputText("Tucked into a shaded corner of the rocks is a bevy of alchemical devices and equipment.  The alchemist Rathazul looks to be hard at work on the silken equipment you've commissioned him to craft.\n\n");
		addButton(4, "Rathazul", kGAMECLASS.rathazul.returnToRathazulMenu).hint("Visit with Rathazul to see what alchemical supplies and services he has available at the moment.");
	}
	else {
		if (flags[kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN] == 1) {
			outputText("There is a note on your ");
			if (flags[kFLAGS.CAMP_BUILT_CABIN] > 0) outputText("bed inside your cabin.");
			else outputText("bedroll");
			outputText(". It reads: \"<i>Come see me at the lake. I've finished your spider-silk ");
			switch(flags[kFLAGS.RATHAZUL_SILK_ARMOR_TYPE]) {
				case 1: outputText("armor"); break;
				case 2: outputText("robes"); break;
				case 3: outputText("bra"); break;
				case 4: outputText("panties"); break;
				case 5: outputText("loincloth"); break;
				default:outputText("robes");
			}
			outputText(". -Rathazul</i>\".\n\n");
		}
	}
	if (followerShouldra()) //Shouldra
		addButton(5, "Shouldra", shouldraFollower.shouldraFollowerScreen).hint("Talk to Shouldra. She is currently residing in your body.");
	//Valeria
	if (flags[kFLAGS.VALARIA_AT_CAMP] == 1) addButton(6, "Valeria", valeria.valeriaFollower).hint("Visit Valeria the goo-girl. You can even take and wear her as goo armor if you like.");
	if (player.armor == armors.GOOARMR) addButtonDisabled(6, "Valeria", "You are currently wearing Valeria. Unequip from your Inventory menu if you want to interact with her.");
	addButton(14,"Back",playerMenu);
}
//----------------- CAMP ACTIONS -----------------
private  campActions(): void {
	hideMenus();
	menu();
	clearOutput();
	outputText(images.showImage("camp-campfire"));
	outputText("What would you like to do?")
	addButton(0, "SwimInStream", swimInStream).hint("Swim in stream and relax to pass time.", "Swim In Stream");
	addButton(1, "ExaminePortal", examinePortal).hint("Examine the portal. This scene is placeholder.", "Examine Portal"); //Examine portal
	if (getGame().time.hours == 19) addButton(2, "Watch Sunset", watchSunset).hint("Watch the sunset and relax."); //Relax and watch at the sunset
	else if (getGame().time.hours >= 20 && flags[kFLAGS.LETHICE_DEFEATED] > 0) addButton(2, "Stargaze", watchStars).hint("Look at the starry night sky."); //Stargaze. Only available after Lethice is defeated
	else addButtonDisabled(2, "Watch Sky", "The option to watch sunset is available at 7pm.");

	if (flags[kFLAGS.CAMP_CABIN_PROGRESS] > 0 && flags[kFLAGS.CAMP_CABIN_PROGRESS] < 10) addButton(3, "Build Cabin", cabinProgress.initiateCabin).hint("Work on your cabin."); //Work on cabin
	if (flags[kFLAGS.CAMP_CABIN_PROGRESS] >= 10 || flags[kFLAGS.CAMP_BUILT_CABIN] >= 1) addButton(3, "Enter Cabin", cabinProgress.initiateCabin).hint("Enter your cabin."); //Enter cabin for furnish
	addButton(4, "Read Codex", codex.accessCodexMenu).hint("Read any codex entries you have unlocked.");
	if (player.hasKeyItem("Carpenter's Toolbox") >= 0 && flags[kFLAGS.CAMP_WALL_PROGRESS] < 100 && getCampPopulation() >= 4) addButton(5, "Build Wall", buildCampWallPrompt).hint("Build a wall around your camp to defend from the imps." + (flags[kFLAGS.CAMP_WALL_PROGRESS] >= 20 ? "\n\nProgress: " + (flags[kFLAGS.CAMP_WALL_PROGRESS]/20) + "/5 complete": "") + "");
	if (player.hasKeyItem("Carpenter's Toolbox") >= 0 && flags[kFLAGS.CAMP_WALL_PROGRESS] >= 100 && flags[kFLAGS.CAMP_WALL_GATE] <= 0) addButton(5, "Build Gate", buildCampGatePrompt).hint("Build a gate to complete your camp defense.");
	if (flags[kFLAGS.CAMP_WALL_PROGRESS] >= 100 && player.hasItem(useables.IMPSKLL, 1)) addButton(6, "AddImpSkull", promptHangImpSkull).hint("Add an imp skull to decorate the wall and to serve as deterrent for imps.", "Add Imp Skull");
	if (flags[kFLAGS.LETHICE_DEFEATED] > 0) addButton(7, "Ascension", promptAscend).hint("Perform an ascension? This will restart your adventures with your levels, items, and gems carried over. The game will also get harder.");
	addButton(14, "Back", playerMenu);
}

private  swimInStream(): void {
var  izmaJoinsStream: boolean = false;
var  marbleJoinsStream: boolean = false;
var  heliaJoinsStream: boolean = false;
var  amilyJoinsStream: boolean = false;
var  emberJoinsStream: boolean = false;
var  rathazulJoinsStream: boolean = false; //rare, 10% chance
var  prankChooser: number = rand(3);
	clearOutput();
	outputText("You ponder over the nearby stream that's flowing. Deciding you'd like a dip, ");
	if (player.armorName == "slutty swimwear") outputText("you are going to swim while wearing just your swimwear. ");
	else outputText("you strip off your [armor] until you are completely naked. ");
   if (player.hasCock() && player.hasVagina()) outputText(images.showImage("camp-stream-herm"));
   else if (player.hasVagina()) outputText(images.showImage("camp-stream-female"));
   else outputText(images.showImage("camp-stream-male"));
	outputText("You step into the flowing waters. You shiver at first but you step in deeper. Incredibly, it's not too deep. ");
	if (player.tallness < 60) outputText("Your feet aren't even touching the riverbed. ");
	if (player.tallness >= 60 && player.tallness < 72) outputText("Your feet are touching the riverbed and your head is barely above the water. ");
	if (player.tallness >= 72) outputText("Your feet are touching touching the riverbed and your head is above water. You bend down a bit so you're at the right height. ");
	outputText("\n\nYou begin to swim around and relax. ");
	if (rand(2) == 0 && camp.izmaFollower()) {
		outputText("\n\nYour tiger-shark beta, Izma, joins you. You are frightened at first when you saw the fin protruding from the water and the fin approaches you! ");
		outputText("As the fin approaches you, the familiar figure comes up. \"<i>I was going to enjoy my daily swim, alpha,</i>\" she says.");
		izmaJoinsStream = true; //Izma!
	}
	if (rand(2) == 0 && camp.followerHel() && flags[kFLAGS.HEL_CAN_SWIM]) {
		outputText("\n\nHelia, your salamander lover, joins in for a swim. \"<i>Hey, lover mine!</i>\" she says. As she enters the waters, the water seems to become warmer until it begins to steam like a sauna.");
		heliaJoinsStream = true; //Helia!
	}
	if (rand(2) == 0 && camp.marbleFollower() && flags[kFLAGS.MARBLE_PURIFICATION_STAGE] != 4) {
		outputText("\n\nYour cow-girl lover Marble strips herself naked and joins you. \"<i>Sweetie, you enjoy swimming, don't you?</i>\" she says.");
		marbleJoinsStream = true; //Marble!
	}
	if (rand(2) == 0 && camp.amilyFollower() && flags[kFLAGS.AMILY_FOLLOWER] == 1 && flags[kFLAGS.AMILY_OWNS_BIKINI] > 0) {
		outputText("\n\nYour mouse-girl lover Amily is standing at the riverbank. She looks flattering in her bikini")
		if (flags[kFLAGS.AMILY_WANG_LENGTH] > 0) outputText(", especially when her penis is exposed")
		outputText(". She walks into the waters and swims.  ")
		amilyJoinsStream = true; //Amily! (Must not be corrupted and must have given Slutty Swimwear)
	}
	if (rand(4) == 0 && camp.followerEmber()) {
		outputText("\n\nYou catch a glimpse of Ember taking a daily bath.")
		emberJoinsStream = true; //Ember
	}
	if (rand(10) == 0 && player.hasStatusEffect(StatusEffects.CampRathazul)) {
		outputText("\n\nYou spot Rathazul walking into the shallow section of stream, most likely taking a bath to get rid of the smell.")
		rathazulJoinsStream = true; //Rathazul (RARE)
	}
	if (prankChooser == 0 && (camp.izmaFollower() || (camp.followerHel() && flags[kFLAGS.HEL_CAN_SWIM]) || camp.marbleFollower() || (camp.amilyFollower() && flags[kFLAGS.AMILY_FOLLOWER] == 1 && flags[kFLAGS.AMILY_OWNS_BIKINI] > 0)) ) {
		outputText("\n\nYou could play some pranks by making the water curiously warm. Do you?")
		doYesNo(swimInStreamPrank1, swimInStreamFinish); //Pranks!
		return;
	}
	else {
		doNext(swimInStreamFinish);
	}
}

private  swimInStreamPrank1(): void {
var  pranked: boolean = false;
var  prankRoll: number = 1;
	//How many people joined!
	if (izmaJoinsStream) prankRoll++;
	if (marbleJoinsStream) prankRoll++;
	if (heliaJoinsStream) prankRoll++;
	if (amilyJoinsStream) prankRoll++
	if (prankRoll > 4) prankRoll = 4;
	//Play joke on them!
	clearOutput();
	outputText("You look around to make sure no one is looking then you smirk and you can feel yourself peeing. When you're done, you swim away.  ")
	if (rand(prankRoll) == 0 && camp.izmaFollower() && pranked == false && izmaJoinsStream == true) {
		outputText("\n\nIzma just swims over, unaware of the warm spot you just created. \"<i>Who've pissed in the stream?</i>\" she growls. You swim over to her and tell her that you admit you did pee in the stream. \"<i>Oh, alpha! What a naughty alpha you are,</i>\" she grins, her shark-teeth clearly visible.");
		pranked = true;
	}
	if (rand(prankRoll) == 0 && (camp.followerHel() && flags[kFLAGS.HEL_CAN_SWIM]) && pranked == false && heliaJoinsStream == true) {
		outputText("\n\nHelia swims around until she hits the warm spot you just created. \"<i>Heyyyyyyy,</i>\" the salamander yells towards you. She comes towards you and asks \"<i>Did you just piss in the stream?</i>\" after which you sheepishly chuckle and tell her that you admit it. Yes, you've done it. \"<i>I knew it! Oh, you're naughty, lover mine!</i>\" she says.");
		pranked = true;
	}
	if (rand(prankRoll) == 0 && camp.marbleFollower() && pranked == false && marbleJoinsStream == true) {
		outputText("\n\nMarble is oblivious to the warm spot and when she swims over, she yells \"<i>Hey, sweetie! Did you just urinate in the stream?</i>\" You sheepishly smile and admit that yes, you did it. She says, \"<i>You're naughty, you know, sweetie!</i>\"");
		pranked = true;
	}

	if (pranked == false) outputText("  No one managed to swim past where you left the warm spot before it dissipated. You feel a bit disappointed and just go back to swimming.");
	else outputText("  You feel accomplished from the prank and resume swimming. ");
	awardAchievement("Urine Trouble", kACHIEVEMENTS.GENERAL_URINE_TROUBLE);
	doNext(swimInStreamFinish);
}

private  swimInStreamFap(): void {
	clearOutput()
	doNext(swimInStreamFinish);
}

private  swimInStreamFinish(): void {
	clearOutput();
	if (flags[kFLAGS.FACTORY_SHUTDOWN] == 2 && player.cor < 50) {
		outputText("You feel a bit dirtier after swimming in the tainted waters. \n\n");
		dynStats("cor", 0.5); //Blown up factory? Corruption gains
		dynStats("lust", 15, "scale", true);
	}
	outputText("Eventually, you swim back to the riverbank and dry yourself off");
	if (player.armorName != "slutty swimwear") outputText(" before you re-dress yourself in your " + player.armorName);
	outputText(".")
	doNext(camp.returnToCampUseOneHour);
}

private  examinePortal(): void {
	clearOutput();
	outputText(images.showImage("camp-portal"));
	if (flags[kFLAGS.CAMP_PORTAL_PROGRESS] <= 0) {
		outputText("You walk over to the portal, reminded by how and why you came. You wonder if you can go back to Ingnam. You start by picking up a small pebble and throw it through the portal. It passes through the portal. As you walk around the portal, you spot the pebble at the other side. Seems like you can't get back right now.");
		flags[kFLAGS.CAMP_PORTAL_PROGRESS] = 1;
		doNext(camp.returnToCampUseOneHour);
		return;
	}
	else outputText("You walk over to the portal, reminded by how and why you came. You let out a sigh, knowing you can't return to Ingnam.");
	doNext(playerMenu);
}

private  watchSunset(): void {
	clearOutput();
	outputText(images.showImage("camp-watch-sunset"));
	outputText("You pick a location where the sun is clearly visible from that particular spot and sit down. The sun is just above the horizon, ready to set. It's such a beautiful view. \n\n");
var  randText: number = rand(3);
	//Childhood nostalgia GO!
	if (randText == 0) {
		if (player.cor < 33) {
			outputText("A wave of nostalgia washes over you as you remember your greatest moments from your childhood.");
			dynStats("cor", -1, "lib", -1, "lust", -30, "scale", false);
		}
		if (player.cor >= 33 && player.cor < 66) {
			outputText("A wave of nostalgia washes over you as you remember your greatest moments from your childhood. Suddenly, your memories are somewhat twisted from some of the perverted moments. You shake your head and just relax.");
			dynStats("cor", -0.5, "lib", -1, "lust", -20, "scale", false);
		}
		if (player.cor >= 66) {
			outputText("A wave of nostalgia washes over you as you remember your greatest moments from your childhood. Suddenly, your memories twist into some of the dark and perverted moments. You chuckle at that moment but you shake your head and focus on relaxing.");
			dynStats("cor", 0, "lib", -1, "lust", -10, "scale", false);
		}
	}
	//Greatest moments GO!
	if (randText == 1) {
		if (player.cor < 33) {
			outputText("You reflect back on your greatest adventures and how curiosity got the best of you. You remember some of the greatest places you discovered.");
			dynStats("lust", -30, "scale", false);
		}
		if (player.cor >= 33 && player.cor < 66) {
			outputText("You reflect back on your greatest adventures. Of course, some of them involved fucking and getting fucked by the denizens of Mareth. You suddenly open your eyes from the memory and just relax, wondering why you thought of that in the first place.");
			dynStats("lust", -20, "scale", false);
		}
		if (player.cor >= 66) {
			outputText("You reflect back on your greatest adventures. You chuckle at the moments you were dominating and the moments you were submitting. You suddenly open your eyes from the memory and just relax.");
			dynStats("lust", -10, "scale", false);
		}
	}
	//Greatest moments GO!
	if (randText >= 2) {
		outputText("You think of what you'd like to ");
		if (rand(2) == 0) outputText("do");
		else outputText("accomplish");
		outputText(" before you went through the portal. You felt a bit sad that you didn't get to achieve your old goals.");
		dynStats("lust", -30, "scale", false);

	}
	outputText("\n\nAfter the thought, you spend a good while relaxing and watching the sun setting. By now, the sun has already set below the horizon. The sky is glowing orange after the sunset. It looks like you could explore more for a while.")
	doNext(camp.returnToCampUseOneHour);
}

private  watchStars(): void {
	clearOutput();
	outputText(images.showImage("camp-watch-stars"));
	outputText("You pick a location not far from your " + homeDesc() + " and lay on the ground, looking up at the starry night sky.");
	outputText("\n\nEver since the fall of Lethice, the stars are visible.");
	outputText("\n\nYou relax and point at various constellations.");
var  consellationChoice: number = rand(4);
	switch(consellationChoice) {
		case 0: outputText("\n\nOne of them even appears to be phallic. You blush at the arrangement."); break;
		case 1: outputText("\n\nOne of them even appears to be arranged like breasts. You blush at the arrangement."); break;
		case 2: outputText("\n\nOne of the constellations have the stars arranged to form the shape of a centaur. Interesting."); break;
		case 3: outputText("\n\nAh, the familiar Big Dipper. Wait a minute... you remember that constellation back in Ingnam. You swear the star arrangements are nearly the same."); break;
		default:outputText("\n\nSomehow, one of them spells out \"ERROR\". Maybe you should let Kitteh6660 know?");
	}
	outputText("\n\nYou let your mind wander and relax.");
	dynStats("lus", -15, "scale", false);
	doNext(camp.returnToCampUseOneHour);
}
//----------------- REST -----------------
public  rest(): void {
	campQ = true;
	clearOutput();
var  multiplier: number = 1.0;
var  fatRecovery: number = 4; //fatigue recovery
var  hpRecovery: number = 10;

	if (player.findPerk(PerkLib.Medicine) >= 0) hpRecovery *= 1.5;
	if (flags[kFLAGS.CAMP_BUILT_CABIN] > 0 && flags[kFLAGS.CAMP_CABIN_FURNITURE_BED] > 0 && !prison.inPrison && !ingnam.inIngnam) multiplier += 0.5;
	if (player.hasStatusEffect(StatusEffects.MarbleWithdrawl)) //Marble withdrawal
		multiplier /= 2;
	if (flags[kFLAGS.HUNGER_ENABLED] > 0 && player.hunger < 25) //hungry
		multiplier /= 2;
	if (timeQ == 0) {
	var  hpBefore: number = player.HP;
		if (flags[kFLAGS.SHIFT_KEY_DOWN] > 0) { //rest until fully healed, midnight or hunger wake
			while (player.HP < player.maxHP() || player.fatigue > 0) {
				timeQ += 1;
				player.HPChange(hpRecovery * multiplier, false); //no display since it is meant to be full rest anyway
				player.changeFatigue( -fatRecovery * multiplier); 
				if (timeQ + getGame().time.hours == 24 || flags[kFLAGS.HUNGER_ENABLED] > 0 && player.hunger < 5) break;
			}
			if (timeQ == 0) timeQ = 1;
			if (timeQ > 21 - getGame().time.hours) timeQ = 21 - getGame().time.hours;
		}
		else {
			timeQ = Math.min(4, 21 - getGame().time.hours);
			player.HPChange(timeQ * hpRecovery * multiplier, false);
			player.changeFatigue(timeQ * -fatRecovery * multiplier); 
		}
		if (flags[kFLAGS.CAMP_BUILT_CABIN] > 0 && flags[kFLAGS.CAMP_CABIN_FURNITURE_BED] > 0 && !prison.inPrison && !ingnam.inIngnam) {
			if (timeQ != 1) outputText("You head into your cabin to rest. You lie down on your bed to rest for " + num2Text(timeQ) + " hours.\n");
			else outputText("You head into your cabin to rest. You lie down on your bed to rest for an hour.\n");
		}
		else {
			if (timeQ != 1) outputText("You lie down to rest for " + num2Text(timeQ) + " hours.\n");
			else outputText("You lie down to rest for an hour.\n");
		}
		if (player.hasStatusEffect(StatusEffects.MarbleWithdrawl)) { //Marble withdrawal
			outputText("\nYour rest is very troubled, and you aren't able to settle down.  You get up feeling tired and unsatisfied, always thinking of Marble's milk.\n");
			dynStats("tou", -.1, "int", -.1);
		}
		if (player.hasCock() && player.cocks[0].cockType == CockTypesEnum.BEE) //bee cock
			outputText("\nThe desire to find the bee girl that gave you this cursed " + player.cockDescript(0) + " and have her spread honey all over it grows with each passing minute\n");
		if (player.armor == armors.GOOARMR && flags[kFLAGS.VALERIA_FLUIDS] <= 0 && valeria.valeriaFluidsEnabled()) //starved goo armor
			outputText("\nYou feel the fluid-starved goo rubbing all over your groin as if Valeria wants you to feed her.\n");
		if (flags[kFLAGS.HUNGER_ENABLED] > 0 && player.hunger < 25) //hungry
			outputText("\nYou have difficulty resting as you toss and turn with your stomach growling.\n");
		player.HPChangeNotify(player.HP - hpBefore);
	}
	else {
		clearOutput();
		outputText(images.showImage("camp-resting"));
		if (timeQ != 1) outputText("You continue to rest for " + num2Text(timeQ) + " more hours.\n");
		else outputText("You continue to rest for another hour.\n");
	}
	goNext(timeQ, true);
}
//----------------- WAIT -----------------
public  doWait(): void {
	campQ = true;
	clearOutput();
	outputText(images.showImage("camp-waiting"));
	//Fatigue recovery
var  fatRecovery: number = 2;

	if (player.findPerk(PerkLib.SpeedyRecovery) >= 0) fatRecovery *= 1.5;
	if (player.findPerk(PerkLib.ControlledBreath) >= 0) fatRecovery *= 1.1;
	if (timeQ == 0) {
		timeQ = 4;
		if (flags[kFLAGS.SHIFT_KEY_DOWN] > 0) timeQ = 21 - getGame().time.hours;
		outputText("You wait " + num2Text(timeQ) + " hours...\n");
		if (player.hasStatusEffect(StatusEffects.MarbleWithdrawl)) { //Marble withdrawl
			outputText("\nYour time spent waiting is very troubled, and you aren't able to settle down.  You get up feeling tired and unsatisfied, always thinking of Marble's milk.\n");
			//Fatigue
			fatRecovery /= 2;
			player.changeFatigue(-fatRecovery * timeQ);
		}
		if (player.hasCock() && player.cocks[0].cockType == CockTypesEnum.BEE) //bee cock
			outputText("\nThe desire to find the bee girl that gave you this cursed " + player.cockDescript(0) + " and have her spread honey all over it grows with each passing minute\n");
		if (player.armor == armors.GOOARMR && flags[kFLAGS.VALERIA_FLUIDS] <= 0) //starved goo armor
			outputText("\nYou feel the fluid-starved goo rubbing all over your groin as if Valeria wants you to feed her.\n");
		//REGULAR HP/FATIGUE RECOVERY
		else player.changeFatigue(-fatRecovery * timeQ); //fatigue
	}
	else {
		if (timeQ != 1) outputText("You continue to wait for " + num2Text(timeQ) + " more hours.\n");
		else outputText("You continue to wait for another hour.\n");
	}
	goNext(timeQ, true);
}
//----------------- SLEEP -----------------
public  doSleep(clrScreen: boolean = true): void {
	if (kGAMECLASS.urta.pregnancy.incubation == 0 && kGAMECLASS.urta.pregnancy.type == PregnancyStore.PREGNANCY_PLAYER && getGame().time.hours >= 20 && getGame().time.hours < 2) {
		urtaPregs.preggoUrtaGivingBirth();
		return;
	}
	campQ = true;
	if (timeQ == 0) {
		getGame().time.minutes = 0;
	var  wakeTime: number = 6;
		if (flags[kFLAGS.BENOIT_CLOCK_ALARM] > 0 && flags[kFLAGS.IN_PRISON] === 0 && (flags[kFLAGS.SLEEP_WITH] === "Ember" || flags[kFLAGS.SLEEP_WITH] === 0)) wakeTime += (flags[kFLAGS.BENOIT_CLOCK_ALARM] - 6);
		timeQ = calculateHoursUntilHour(wakeTime);
		if (player.slotName != "VOID" && player.autoSave && mainView.getButtonText( 0 ) != "Game Over") //autosave stuff
			getGame().saves.saveGame(player.slotName);
		if (clrScreen) clearOutput(); //clear screen
		if (prison.inPrison) {
			outputText("You curl up on a slab, planning to sleep for " + num2Text(timeQ) + " hour");
			if (timeQ > 1) outputText("s");
			outputText(". ");
			sleepRecovery(true);
			goNext(timeQ, true);
			return;
		}
		/******************************************************************/
		/*						ONE TIME SPECIAL EVENTS					  */
		/******************************************************************/
		//HEL SLEEPIES!
		if (helFollower.helAffection() >= 70 && flags[kFLAGS.HEL_REDUCED_ENCOUNTER_RATE] == 0 && flags[kFLAGS.HEL_FOLLOWER_LEVEL] == 0) {
			getGame().dungeons.heltower.heliaDiscovery();
			sleepRecovery(false);
			return;
		}
		//Shouldra xgartuan fight
		if (player.hasCock() && followerShouldra() && player.statusEffectv1(StatusEffects.Exgartuan) == 1) {
			if (flags[kFLAGS.SHOULDRA_EXGARTUDRAMA] == 0) {
				shouldraFollower.shouldraAndExgartumonFightGottaCatchEmAll();
				sleepRecovery(false);
				return;
			}
			else if (flags[kFLAGS.SHOULDRA_EXGARTUDRAMA] == 3) {
				shouldraFollower.exgartuMonAndShouldraShowdown();
				sleepRecovery(false);
				return;
			}
		}
		if (player.hasCock() && followerShouldra() && flags[kFLAGS.SHOULDRA_EXGARTUDRAMA] == -0.5) {
			shouldraFollower.keepShouldraPartIIExgartumonsUndeatH();
			sleepRecovery(false);
			return;
		}
		/******************************************************************/
		/*						SLEEP WITH SYSTEM GOOOO					  */
		/******************************************************************/
		if (flags[kFLAGS.CAMP_BUILT_CABIN] > 0 && flags[kFLAGS.CAMP_CABIN_FURNITURE_BED] > 0 && (flags[kFLAGS.SLEEP_WITH] == "" || flags[kFLAGS.SLEEP_WITH] == "Marble")) outputText("You enter your cabin to turn yourself in for the night. ")
		//Marble Sleepies
		if (marbleScene.marbleAtCamp() && player.hasStatusEffect(StatusEffects.CampMarble) && flags[kFLAGS.SLEEP_WITH] == "Marble" && flags[kFLAGS.FOLLOWER_AT_FARM_MARBLE] == 0) {
			outputText(images.showImage("camp-sleep-marble"));
			if (marbleScene.marbleNightSleepFlavor()) {
				sleepRecovery(false);
				return;
			}
		}
		else if (flags[kFLAGS.SLEEP_WITH] == "Arian" && arianScene.arianFollower()) {
			outputText(images.showImage("camp-sleep-arian"));
			arianScene.sleepWithArian();
			return;
		}
		else if (flags[kFLAGS.SLEEP_WITH] == "Ember" && flags[kFLAGS.EMBER_AFFECTION] >= 75 && followerEmber()) {
			if (flags[kFLAGS.TIMES_SLEPT_WITH_EMBER] > 3) {
				if (flags[kFLAGS.EMBER_GENDER] == 2) outputText(images.showImage("camp-sleep-ember-female"));
				else outputText(images.showImage("camp-sleep-ember-male"));
				outputText("You curl up next to Ember, planning to sleep for " + num2Text(timeQ) + " hour. Ember drapes one of " + emberScene.emberMF("his", "her") + " wing over you, keeping you warm. ");
			}
			else {
				emberScene.sleepWithEmber();
				return;
			}
		}
		else if (flags[kFLAGS.JOJO_BIMBO_STATE] >= 3 && jojoScene.pregnancy.isPregnant && jojoScene.pregnancy.event == 4 && player.hasCock() && flags[kFLAGS.SLEEP_WITH] == 0) {
			joyScene.hornyJoyIsPregnant();
			return;
		}
		else if (flags[kFLAGS.SLEEP_WITH] == "Sophie" && (bimboSophie() || sophieFollower()) && flags[kFLAGS.FOLLOWER_AT_FARM_SOPHIE] == 0) {
			//Night Time Snuggle Alerts!*
			outputText(images.showImage("camp-sleep-sophie"));
			//(1) 
			if (rand(4) == 0) {
				outputText("You curl up next to Sophie, planning to sleep for " + num2Text(timeQ) + " hour");
				if (timeQ > 1 ) outputText("s");
				outputText(".  She wraps her feathery arms around you and nestles her chin into your shoulder.  Her heavy breasts cushion flat against your back as she gives you a rather chaste peck on the cheek and drifts off towards dreamland...");
			}
			//(2) 
			else if (rand(3) == 0) {
				outputText("While you're getting ready for bed, you see that Sophie has already beaten you there.  She's sprawled out on her back with her arms outstretched, making little beckoning motions towards the valley of her cleavage.  You snuggle in against her, her pillowy breasts supporting your head and her familiar heartbeat drumming you to sleep for " + num2Text(timeQ) + " hour");
				if (timeQ > 1) outputText("s");
				outputText(".");
			}
			//(3)
			else if (rand(2) == 0) {
				outputText("As you lay down to sleep for " + num2Text(timeQ) + " hour");
				if (timeQ > 1) outputText("s");
				outputText(", you find the harpy-girl, Sophie, snuggling herself under her blankets with you.  She slips in between your arms and guides your hands to her enormous breasts, her backside already snug against your loins.  She whispers, \"<i>Something to think about for next morning...  Sweet dreams.</i>\" as she settles in for the night.");
			}
			//(4)
			else {
				outputText("Sophie climbs under the sheets with you when you go to sleep, planning on resting for " + num2Text(timeQ) + " hour");
				if (timeQ > 1) outputText("s");
				outputText(".  She sleeps next to you, just barely touching you.  You rub her shoulder affectionately before the two of you nod off.");
			}
			outputText("\n");
		}
		else {
			if (flags[kFLAGS.SLEEP_WITH] == "Helia" && kGAMECLASS.helScene.followerHel()) {
				outputText(images.showImage("camp-sleep-helia"));
				outputText("You curl up next to Helia, planning to sleep for " + num2Text(timeQ) + " ");
			}
			//Normal sleep message
			else outputText("You curl up, planning to sleep for " + num2Text(timeQ) + " ");
			if (timeQ == 1) outputText("hour.\n");
			else outputText("hours.\n");
		}
		sleepRecovery(true);
	}
	else {
		clearOutput();
		if (timeQ != 1) outputText("You lie down to resume sleeping for the remaining " + num2Text(timeQ) + " hours.\n");
		else outputText("You lie down to resume sleeping for the remaining hour.\n");
	}
	goNext(timeQ, true);
}
//For shit that breaks normal sleep processing
public  sleepWrapper(): void {
var  wakeTime: number = 6;
	if (flags[kFLAGS.BENOIT_CLOCK_ALARM] > 0 && (flags[kFLAGS.SLEEP_WITH] === "Ember" || flags[kFLAGS.SLEEP_WITH] === 0)) wakeTime += (flags[kFLAGS.BENOIT_CLOCK_ALARM] - 6);
	timeQ = calculateHoursUntilHour(wakeTime);
	clearOutput();
	if (timeQ != 1) outputText("You lie down to resume sleeping for the remaining " + num2Text(timeQ) + " hours.\n");
	else outputText("You lie down to resume sleeping for the remaining hour.\n");
	sleepRecovery(true);
	goNext(timeQ, true);
}

public  calculateHoursUntilHour(targetHour: number): number {
var  currentHour: number = getGame().time.hours;
var  amount: number = 0;
	while (currentHour != targetHour) {
		currentHour++;
		amount++;
		if (currentHour >= 24) currentHour = 0;
	}
	return amount;
}
public  sleepRecovery(display: boolean = false): void {
var  multiplier: number = 1.0;
var  fatRecovery: number = 20;
var  hpRecovery: number = 20;
	if (flags[kFLAGS.CAMP_BUILT_CABIN] > 0 && flags[kFLAGS.CAMP_CABIN_FURNITURE_BED] > 0 && (flags[kFLAGS.SLEEP_WITH] == "" || flags[kFLAGS.SLEEP_WITH] == "Marble"))
		multiplier += 0.5;
	if (flags[kFLAGS.HUNGER_ENABLED] > 0) {
		if (player.hunger < 25) {
			outputText("\nYou have difficulty sleeping as your stomach is growling loudly.\n");
			multiplier *= 0.5;
		}
	}
	if (player.hasStatusEffect(StatusEffects.MarbleWithdrawl)) { //Marble withdrawl
		if (display) outputText("\nYour sleep is very troubled, and you aren't able to settle down.  You get up feeling tired and unsatisfied, always thinking of Marble's milk.\n");
		multiplier *= 0.5;
		dynStats("tou", -.1, "int", -.1);
	}
	else if (flags[kFLAGS.MINOTAUR_CUM_ADDICTION_STATE] == 3) { //Mino withdrawal
		if (display) outputText("\nYou spend much of the night tossing and turning, aching for a taste of minotaur cum.\n");
		multiplier *= 0.75;
	}
	if (player.hasCock() && player.cocks[0].cockType == CockTypesEnum.BEE) //bee cock
		outputText("\nThe desire to find the bee girl that gave you this cursed " + player.cockDescript(0) + " and have her spread honey all over it grows with each passing minute\n");
	if (player.armor == armors.GOOARMR && flags[kFLAGS.VALERIA_FLUIDS] <= 0) //Starved goo armor
		outputText("\nYou feel the fluid-starved goo rubbing all over your groin as if Valeria wants you to feed her.\n");
	player.HPChange(timeQ * hpRecovery * multiplier, display); //REGULAR HP/FATIGUE RECOVERY
	player.changeFatigue(-(timeQ * fatRecovery * multiplier)); //Fatigue
}
//Bad End if your balls are too big. Only happens in Realistic Mode
public  badEndGIANTBALLZ(): void {
	clearOutput();
	outputText(images.showImage("badend-hBalls"));
	outputText("You suddenly fall over due to your extremely large " + player.ballsDescriptLight() + ".  You struggle to get back up but the size made it impossible.  Panic spreads throughout your mind and your heart races.\n\n")
	outputText("You know that you can't move and you're aware that you're going to eventually starve to death.")
	menu();
	if (player.hasItem(consumables.REDUCTO, 1)) {
		outputText("\n\nFortunately, you have some Reducto.  You can shrink your balls and get back to your adventures!")
		addButton(1, "Reducto", applyReductoAndEscapeBadEnd);
	}
	if (player.hasStatusEffect(StatusEffects.CampRathazul)) {
		outputText("\n\nYou could call for Rathazul to help you.")
		addButton(2, "Rathazul", callRathazulAndEscapeBadEnd);		
	}
	if (shouldraFollower.followerShouldra()) {
		outputText("\n\nYou could call for Shouldra to shrink your monstrous balls.")
		addButton(3, "Shouldra", shouldraFollower.shouldraReductosYourBallsUpInsideYa, true);		
	}
	else getGame().gameOver();
}
private  applyReductoAndEscapeBadEnd(): void {
	clearOutput();
	outputText(images.showImage("item-reducto"));
	outputText("You smear the foul-smelling paste onto your " + player.sackDescript() + ".  It feels cool at first but rapidly warms to an uncomfortable level of heat.\n\n");
	player.ballSize -= (4 + rand(6));
	if (player.ballSize < 1) player.ballSize = 1;
	if (player.ballSize > 18 + (player.str / 2) + (player.tallness / 4))
		player.ballSize = 17 + (player.str / 2) + (player.tallness / 4);
	outputText("You feel your scrotum shift, shrinking down along with your " + player.ballsDescriptLight() + ".  ");
	outputText("Within a few seconds the paste has been totally absorbed and the shrinking stops.  ");
	dynStats("lib", -2, "lus", -10);
	player.consumeItem(consumables.REDUCTO, 1);
	doNext(camp.returnToCampUseOneHour);
}
private  callRathazulAndEscapeBadEnd(): void {
	clearOutput();
	outputText(images.showImage("rathazul-himself"));
	outputText("You shout as loud as you can to call Rathazul.  Your call is answered as the alchemist walks up to you.\n\n");
	outputText("\"<i>My, my... Look at yourself! Don't worry, I can help, </i>\" he says.  He rushes to his alchemy equipment and mixes ingredients.  He returns to you with a Reducto.\n\n")
	outputText("He rubs the paste all over your massive balls. It's incredibly effective. \n\n")
	player.ballSize -= (4 + rand(6));
	if (player.ballSize < 1) player.ballSize = 1;
	if (player.ballSize > 18 + (player.str/2) + (player.tallness / 4)) player.ballSize = 16 + (player.str/2) + (player.tallness / 4)
	outputText("You feel your scrotum shift, shrinking down along with your " + player.ballsDescriptLight() + ".  ");
	outputText("Within a few seconds the paste has been totally absorbed and the shrinking stops.  ");
	outputText("\"<i>Try not to make your balls bigger. If it happens, make sure you have Reducto,</i>\" he says.  He returns to his alchemy equipment, working on who knows what.\n\n")
	doNext(camp.returnToCampUseOneHour);
}
//Bad End if you starved to death
public  badEndHunger(): void {
	clearOutput();
	outputText(images.showImage("badend-starve"));
	player.hunger = 0.1; //for Easy Mode/Debug Mode
	outputText("Too weak to be able to stand up, you collapse onto the ground. Your vision blurs as the world around you finally fades to black. ");
	if (companionsCount() > 0) {
		outputText("\n\n");
		if (companionsCount() > 1) outputText("Your companions gather to mourn over your passing.");
		else outputText("Your fellow companion mourns over your passing.");
	}
	player.HP = 0;
	getGame().gameOver();
	removeButton(1); //can't continue, you're dead!
}
//Bad End if you have 100 min lust
public  badEndMinLust(): void {
	clearOutput();
	outputText(images.showImage("badend-masti"));
	outputText("The thought of release overwhelms you. You frantically remove your " + player.armorName + " and begin masturbating furiously.  The first orgasm hits you but the desire persists.  You continue to masturbate but unfortunately, no matter how hard or how many times you orgasm, your desires will not go away.  Frustrated, you keep masturbating furiously but you are unable to stop.  Your minimum lust is too high.  No matter how hard you try, you cannot even satisfy your desires.");
	outputText("\n\nYou spend the rest of your life masturbating, unable to stop.");
	player.orgasm('Generic');
	getGame().gameOver();
	removeButton(1); //can't wake up, must load
}

public  allNaturalSelfStimulationBeltContinuation(): void {
	clearOutput();
	outputText(images.showImage("masti-stimBelt-allNatural"));
	outputText("In shock, you scream as you realize the nodule has instantly grown into a massive, organic dildo. It bottoms out easily and rests against your cervix as you recover from the initial shock of its penetration. As the pangs subside, the infernal appendage begins working itself. It begins undulating in long, slow strokes. It takes great care to adjust itself to fit every curve of your womb. Overwhelmed, your body begins reacting against your conscious thought and slowly thrusts your pelvis in tune to the thing.\n\n");
	outputText("As suddenly as it penetrated you, it shifts into a different phase of operation. It buries itself as deep as it can and begins short, rapid strokes. The toy hammers your insides faster than any man could ever hope to do. You orgasm immediately and produce successive climaxes. Your body loses what motor control it had and bucks and undulates wildly as the device pistons your cunt without end. You scream at the top of your lungs. Each yell calls to creation the depth of your pleasure and lust.\n\n");
	outputText("The fiendish belt shifts again. It buries itself as deep as it can go and you feel pressure against the depths of your womanhood. You feel a hot fluid spray inside you. Reflexively, you shout, \"<b>IT'S CUMMING! IT'S CUMMING INSIDE ME!</b>\" Indeed, each push of the prodding member floods your box with juice. It cums... and cums... and cums... and cums...\n\n");
	outputText("An eternity passes, and your pussy is sore. It is stretched and filled completely with whatever this thing shoots for cum. It retracts itself from your hole and you feel one last pang of pressure as your body now has a chance to force out all of the spunk that it cannot handle. Ooze sprays out from the sides of the belt and leaves you in a smelly, sticky mess. You feel the belt's tension ease up as it loosens. The machine has run its course. You immediately pass out.");
	player.slimeFeed();
	player.orgasm('Vaginal');
	dynStats("lib", 1, "sen", (-0.5));
	doNext(camp.returnToCampUseOneHour);
}
public  allNaturalSelfStimulationBeltBadEnd(): void {
	spriteSelect(SpriteDb.s_giacomo);
	clearOutput();
	outputText(images.showImage("badend-stimBelt"));
	outputText("Whatever the belt is, whatever it does, it no longer matters to you.  The only thing you want is to feel the belt and its creature fuck the hell out of you, day and night.  You quickly don the creature again and it begins working its usual lustful magic on your insatiable little box.  An endless wave of orgasms take you.  All you now know is the endless bliss of an eternal orgasm.\n\n");
	outputText("Your awareness hopelessly compromised by the belt and your pleasure, you fail to notice a familiar face approach your undulating form.  It is the very person who sold you this infernal toy.  The merchant, Giacomo.\n\n");
	outputText("\"<i>Well, well,</i>\" Giacomo says.  \"<i>The Libertines are right.  The creature's fluids are addictive. This poor " + player.mf("man", "woman") + " is a total slave to the beast!</i>\"\n\n");
	outputText("Giacomo contemplates the situation as you writhe in backbreaking pleasure before him.  His sharp features brighten as an idea strikes him.\n\n");
	outputText("\"<i>AHA!</i>\" the hawkish purveyor cries.  \"<i>I have a new product to sell! I will call it the 'One Woman Show!'</i>\"\n\n");
	outputText("Giacomo cackles smugly at his idea.  \"<i>Who knows how much someone will pay me for a live " + player.mf("man", "woman") + " who can't stop cumming!</i>\"\n\n");
	outputText("Giacomo loads you up onto his cart and sets off for his next sale.  You do not care.  You do not realize what has happened.  All you know is that the creature keeps cumming and it feels... sooooo GODDAMN GOOD!");
	getGame().gameOver();
}
//Returns true as soon as any known dungeon is found
private  dungeonFound(): boolean {
	if (flags[kFLAGS.DISCOVERED_DUNGEON_2_ZETAZ] > 0) return true;
	if (flags[kFLAGS.FACTORY_FOUND] > 0) return true;
	if (flags[kFLAGS.DISCOVERED_WITCH_DUNGEON] > 0) return true;
	if (flags[kFLAGS.D3_DISCOVERED] > 0) return true;
	if (kGAMECLASS.dungeons.checkPhoenixTowerClear()) return true;
	return false;
}

private  farmFound(): boolean {
	//Returns true as soon as any known dungeon is found
	if (player.hasStatusEffect(StatusEffects.MetWhitney) && player.statusEffectv1(StatusEffects.MetWhitney) > 1) {
		if (flags[kFLAGS.FARM_DISABLED] == 0) return true;
		if (player.isCorruptEnough(70) && player.level >= 12 && getGame().farm.farmCorruption.corruptFollowers() >= 2 && flags[kFLAGS.FARM_CORRUPTION_DISABLED] == 0) return true;
	}
	if (flags[kFLAGS.FARM_CORRUPTION_STARTED]) return true;
	return false;
}
//----------------- PLACES MENU -----------------
private  placesKnown(): boolean {
	if (placesCount() > 0) return true; //returns true as soon as any known place is found
	return false;
}

public  placesCount(): number {
var  places: number = 0;
	if (flags[kFLAGS.BAZAAR_ENTERED] > 0) places++;
	if (player.hasStatusEffect(StatusEffects.BoatDiscovery)) places++;
	if (flags[kFLAGS.FOUND_CATHEDRAL] > 0) places++;
	if (flags[kFLAGS.FACTORY_FOUND] > 0 || flags[kFLAGS.DISCOVERED_DUNGEON_2_ZETAZ] > 0 || flags[kFLAGS.DISCOVERED_WITCH_DUNGEON] > 0) places++;
	if (farmFound()) places++; 
	if (flags[kFLAGS.OWCA_UNLOCKED] > 0) places++;
	if (player.hasStatusEffect(StatusEffects.HairdresserMeeting)) places++;
	if (player.statusEffectv1(StatusEffects.TelAdre) >= 1) places++;
	if (flags[kFLAGS.AMILY_VILLAGE_ACCESSIBLE] > 0) places++;
	if (flags[kFLAGS.MET_MINERVA] >= 4) places++;
	if (flags[kFLAGS.PRISON_CAPTURE_COUNTER] > 0) places++;
	return places;
}
//All cleaned up!
public  places(): boolean {
	hideMenus();
	clearOutput();
	outputText(images.showImage("camp-pathfinder"));
	outputText("Which place would you like to visit?");

	menu(); //build menu
	if (flags[kFLAGS.BAZAAR_ENTERED] > 0) addButton(0, "Bazaar", kGAMECLASS.bazaar.enterTheBazaar).hint("Visit the Bizarre Bazaar where the demons and corrupted beings hang out.");
	if (player.hasStatusEffect(StatusEffects.BoatDiscovery)) addButton(1, "Boat", kGAMECLASS.boat.boatExplore).hint("Get on the boat and explore the lake. \n\nRecommended level: 4");
	if (flags[kFLAGS.FOUND_CATHEDRAL] > 0) {
		if (flags[kFLAGS.GAR_NAME] === 0) addButton(2, "Cathedral", kGAMECLASS.gargoyle.gargoylesTheShowNowOnWBNetwork).hint("Visit the ruined cathedral you've recently discovered.");
		else addButton(2, "Cathedral", kGAMECLASS.gargoyle.returnToCathedral).hint("Visit the ruined cathedral where " + flags[kFLAGS.GAR_NAME] + " resides.");
	}
	if (dungeonFound()) addButton(3, "Dungeons", dungeons).hint("Delve into dungeons.");
	if (flags[kFLAGS.AIKO_TIMES_MET] > 3) addButton(4, "Great Tree", kGAMECLASS.forest.aikoScene.encounterAiko).hint("Visit the Great Tree in the Deep Woods where Aiko lives.");
	if (farmFound()) addButton(5, "Farm", kGAMECLASS.farm.farmExploreEncounter).hint("Visit Whitney's farm.");
	if (flags[kFLAGS.OWCA_UNLOCKED] === 1) addButton(6, "Owca", kGAMECLASS.owca.gangbangVillageStuff).hint("Visit the sheep village of Owca, known for its pit where a person is hung on the pole weekly to be gang-raped by the demons.");
	if (flags[kFLAGS.MET_MINERVA] >= 4) addButton(7, "Oasis Tower", kGAMECLASS.highMountains.minervaScene.encounterMinerva).hint("Visit the ruined tower in the high mountains where Minerva resides.");
	if (player.hasStatusEffect(StatusEffects.HairdresserMeeting)) addButton(8, "Salon", kGAMECLASS.mountain.salon.salonGreeting).hint("Visit the salon for hair services.");
	if (player.statusEffectv1(StatusEffects.TelAdre) >= 1) addButton(9, "Tel'Adre", kGAMECLASS.telAdre.telAdreMenu).hint("Visit the city of Tel'Adre in desert, easily recognized by the massive tower.");
	if (flags[kFLAGS.AMILY_VILLAGE_ACCESSIBLE] > 0) addButton(10, "Town Ruins", kGAMECLASS.townRuins.exploreVillageRuin).hint("Visit the village ruins.");
	if (flags[kFLAGS.PRISON_CAPTURE_COUNTER] > 0) addButton(11, "Prison", kGAMECLASS.prison.prisonIntro, false, undefined, undefined, "Return to the prison and continue your life as Elly's slave.");
	if (debug) addButton(12, "Ingnam", kGAMECLASS.ingnam.returnToIngnam).hint("Return to Ingnam for debugging purposes. Night-time event weirdness might occur. You have been warned!");
	if (achievements[kACHIEVEMENTS.STORY_FINALBOSS] > 0 && (getGame().achievementList.achievementsEarned / getGame().achievementList.achievementsTotal) >= 0.6 && debug) addButton(13, "Beta Zone", getGame().betaZone.betaZoneEntry).hint("Enter the secret Beta Zone, home of the cut, unfinished and subpar content.\n\nNote: Contains a lot of metaness and fourth wall-breaking moments.");
	addButton(14, "Back", playerMenu);
	return true;
}

private  dungeons(): void {
	menu();
	if (flags[kFLAGS.FACTORY_FOUND] > 0) //turn on dungeon 1
		addButton(0, "Factory", getGame().dungeons.factory.enterDungeon).hint("Visit the demonic factory in the mountains." + (flags[kFLAGS.FACTORY_SHUTDOWN] > 0 ? "\n\nYou've managed to shut down the factory." : "The factory is still running. Marae wants you to shut down the factory!") + (kGAMECLASS.dungeons.checkFactoryClear() ? "\n\nCLEARED!" : ""));
	if (flags[kFLAGS.DISCOVERED_DUNGEON_2_ZETAZ] > 0) //turn on dungeon 2
		addButton(1, "Deep Cave", getGame().dungeons.deepcave.enterDungeon).hint("Visit the cave you've found in the Deepwoods." + (flags[kFLAGS.DEFEATED_ZETAZ] > 0 ? "\n\nYou've defeated Zetaz, your old rival." : "") + (kGAMECLASS.dungeons.checkDeepCaveClear() ? "\n\nCLEARED!" : ""));
	if (flags[kFLAGS.D3_DISCOVERED] > 0) //turn on dungeon 3
		addButton(2, "Stronghold", kGAMECLASS.lethicesKeep.enterD3).hint("Visit the stronghold in the high mountains that belongs to Lethice, the demon queen." + (flags[kFLAGS.LETHICE_DEFEATED] > 0 ? "\n\nYou have defeated Lethice and put an end to the demonic threats. Congratulations, you've beaten the main story!" : "") + (kGAMECLASS.dungeons.checkLethiceStrongholdClear() ? "\n\nCLEARED!" : ""));
	//Side dungeons
	if (flags[kFLAGS.DISCOVERED_WITCH_DUNGEON] > 0) addButton(5, "Desert Cave", getGame().dungeons.desertcave.enterDungeon).hint("Visit the cave you've found in the desert." + (flags[kFLAGS.SAND_WITCHES_COWED] + flags[kFLAGS.SAND_WITCHES_FRIENDLY] > 0 ? "\n\nFrom what you've known, this is the source of the Sand Witches." : "") + (kGAMECLASS.dungeons.checkSandCaveClear() ? "\n\nCLEARED!" : ""));
	if (kGAMECLASS.dungeons.checkPhoenixTowerClear()) addButton(6, "Phoenix Tower", getGame().dungeons.heltower.returnToHeliaDungeon).hint("Re-visit the tower you went there as part of Helia's quest." + (kGAMECLASS.dungeons.checkPhoenixTowerClear() ? "\n\nYou've helped Helia in the quest and resolved the problems. \n\nCLEARED!" : ""));
		//Fetish Church?
		//if (debug) addButton(7, "H.Hound Cmplx", getGame().dungeons.hellcomplex.enterDungeonDev).hint("For testing purposes only.", "Hellhound Complex");
	//Non-hostile dungeons
	if (flags[kFLAGS.ANZU_PALACE_UNLOCKED] > 0) addButton(10, "Anzu's Palace", getGame().dungeons.palace.enterDungeon).hint("Visit the palace in the Glacial Rift where Anzu the avian deity resides.");
	addButton(14, "Back", places);
}
//Update Exgartuan stuff
private  exgartuanCampUpdate(): void {
	if (player.hasStatusEffect(StatusEffects.Exgartuan)) {
		if (player.statusEffectv1(StatusEffects.Exgartuan) == 1 && (player.cockArea(0) < 100 || player.cocks.length == 0)) {
			clearOutput();
			outputText(images.showImage("camp-exgartuan-urine"));
			outputText("<b>You suddenly feel the urge to urinate, and stop over by some bushes.  It takes wayyyy longer than normal, and once you've finished, you realize you're alone with yourself for the first time in a long time.");
			if (player.hasCock()) outputText("  Perhaps you got too small for Exgartuan to handle?</b>\n");
			else outputText("  It looks like the demon didn't want to stick around without your manhood.</b>\n");
			player.removeStatusEffect(StatusEffects.Exgartuan); //if too small dick, remove him
			awardAchievement("Urine Trouble", kACHIEVEMENTS.GENERAL_URINE_TROUBLE, true);
		}
		else if (player.statusEffectv1(StatusEffects.Exgartuan) == 2 && player.biggestTitSize() < 12) {
			clearOutput();
			outputText(images.showImage("camp-exgartuan-milk"));
			outputText("<b>Black milk dribbles from your " + player.nippleDescript(0) + ".  It immediately dissipates into the air, leaving you feeling alone.  It looks like you became too small for Exgartuan!\n</b>");
			player.removeStatusEffect(StatusEffects.Exgartuan); //tit removal
		}
	}
	doNext(playerMenu);
}
//Wake up from a bad end
public  wakeFromBadEnd(): void {
	clearOutput();
	outputText(images.showImage("camp-nightmare"));
	outputText("No, it can't be.  It's all just a dream!  You've got to wake up!");
	outputText("\n\nYou wake up and scream.  You pull out a mirror and take a look at yourself.  Yep, you look normal again.  That was the craziest dream you ever had.");
	if (flags[kFLAGS.TIMES_BAD_ENDED] >= 2) //FOURTH WALL BREAKER
		outputText("\n\nYou mumble to yourself \"<i>Another goddamn bad-end.</i>\"");
	if (marbleFollower()) outputText("\n\n\"<i>Are you okay, sweetie?</i>\" Marble asks.  You assure her that you're fine; you've just had a nightmare.");
	if (flags[kFLAGS.HUNGER_ENABLED] > 0) player.hunger = 40;
	if (flags[kFLAGS.HUNGER_ENABLED] >= 1 && player.ballSize > (18 + (player.str / 2) + (player.tallness / 4))) {
		outputText("\n\nYou realize the consequences of having oversized balls and you NEED to shrink it right away. Reducto will do.");
		player.ballSize = (14 + (player.str / 2) + (player.tallness / 4));
	}
	if (flags[kFLAGS.EASY_MODE_ENABLE_FLAG] > 0 || debug) outputText("\n\n\nYou get up, still feeling confused from the nightmares.");
	else outputText("\n\n\nYou get up, still feeling traumatized from the nightmares.");
	getGame().time.days++; //skip time forward
	if (flags[kFLAGS.BENOIT_CLOCK_BOUGHT] > 0) getGame().time.hours = flags[kFLAGS.BENOIT_CLOCK_ALARM];
	else getGame().time.hours = 6;
	//Set so you're in camp
	inDungeon = false;
	inRoomedDungeon = false;
	inRoomedDungeonResume = undefined;
	combat.clearStatuses();
	getGame().inCombat = false;
	//Restore stats
	player.HP = player.maxHP();
	player.fatigue = 0;
	statScreenRefresh();
	//PENALTY!
var  penaltyMultiplier: number = 1;
	penaltyMultiplier += flags[kFLAGS.GAME_DIFFICULTY] * 0.5;
	if (flags[kFLAGS.EASY_MODE_ENABLE_FLAG] > 0 || debug) penaltyMultiplier = 0;
	//Deduct XP and gems
	player.gems -= int((player.gems / 10) * penaltyMultiplier);
	player.XP -= int((player.level * 10) * penaltyMultiplier);
	if (player.gems < 0) player.gems = 0;
	if (player.XP < 0) player.XP = 0;
	//Deduct attributes
	if (player.str100 > 20) dynStats("str", Math.ceil(-player.str * 0.02) * penaltyMultiplier);
	if (player.tou100 > 20) dynStats("tou", Math.ceil(-player.tou * 0.02) * penaltyMultiplier);
	if (player.spe100 > 20) dynStats("spe", Math.ceil(-player.spe * 0.02) * penaltyMultiplier);
	if (player.inte100 > 20) dynStats("inte", Math.ceil(-player.inte * 0.02) * penaltyMultiplier);
	menu();
	addButton(0, "Next", playerMenu);
}
//Camp wall
private  buildCampWallPrompt(): void {
	clearOutput();
	if (flags[kFLAGS.CAMP_WALL_PROGRESS] <= 20) outputText(images.showImage("camp-wall-partI"));
	else if (flags[kFLAGS.CAMP_WALL_PROGRESS] <= 40) outputText(images.showImage("camp-wall-partII"));
	else if (flags[kFLAGS.CAMP_WALL_PROGRESS] <= 60) outputText(images.showImage("camp-wall-partIII"));
	else outputText(images.showImage("camp-wall-partIV"));
	if (player.fatigue >= player.maxFatigue() - 50) {
		outputText("You are too exhausted to work on your camp wall!");
		doNext(doCamp);
		return;
	}
	if (flags[kFLAGS.CAMP_WALL_PROGRESS] == 0) {
		outputText("A feeling of unrest grows within you as the population of your camp is growing. Maybe it's time you build a wall to secure the perimeter?\n\n");
		flags[kFLAGS.CAMP_WALL_PROGRESS] = 1;
	}
	else {
		if (flags[kFLAGS.CAMP_WALL_PROGRESS] <= 20) 
		outputText("You can continue work on building the wall that surrounds your camp.\n\n");
		outputText("Segments complete: " + Math.floor(flags[kFLAGS.CAMP_WALL_PROGRESS] / 20) + "/5\n\n");
	}
	kGAMECLASS.camp.cabinProgress.checkMaterials();
	outputText("\n\nIt will cost 50 nails, 50 stones and 100 wood to work on a segment of the wall.\n\n");
	if (flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] >= 100 && player.keyItemv1("Carpenter's Toolbox") >= 50 && flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] >= 50) doYesNo(buildCampWall, doCamp);
	else {
		outputText("\n<b>Unfortunately, you do not have sufficient resources.</b>");
		doNext(doCamp);
	}
}

private  buildCampWall(): void {
var  helpers: number = 0;
var  helperArray: any[] = [];
	if (marbleFollower()) {
		helperArray.push("Marble");
		helpers++;
	}
	if (followerHel()) {
		helperArray.push("Helia");
		helpers++;
	}
	if (followerKiha()) {
		helperArray.push("Kiha");
		helpers++;
	}
	flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] -= 50;
	flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] -= 100;
	player.addKeyValue("Carpenter's Toolbox", 1, -50);
	clearOutput();
	if (flags[kFLAGS.CAMP_WALL_PROGRESS] == 1) {
		outputText(images.showImage("item-carpentersBook"));
		outputText("You pull out a book titled \"Carpenter's Guide\" and flip pages until you come across instructions on how to build a wall. You spend minutes looking at the instructions and memorize the procedures.");
		flags[kFLAGS.CAMP_WALL_PROGRESS] = 20;
	}
	else {
		outputText("You remember the procedure for building a wall.");
		flags[kFLAGS.CAMP_WALL_PROGRESS] += 20;
	}
	outputText("\n\nYou dig four holes, six inches deep and one foot wide each, before putting up wood posts, twelve feet high and one foot thick each. You take the wood from supplies, saw the wood and cut them into planks before nailing them to the wooden posts.");
	if (helpers > 0) {
		outputText("\n\n" + formatStringArray(helperArray));
		outputText(" " + (helpers == 1 ? "assists" : "assist") + " you with building the wall, helping to speed up the process and make construction less fatiguing.");
	}
	//Gain fatigue
var  fatigueAmount: number = 100;
	fatigueAmount -= player.str / 5;
	fatigueAmount -= player.tou / 10;
	fatigueAmount -= player.spe / 10;
	if (player.findPerk(PerkLib.IronMan) >= 0) fatigueAmount -= 20;
	fatigueAmount /= (helpers + 1);
	if (fatigueAmount < 15) fatigueAmount = 15;
	player.changeFatigue(fatigueAmount);
	if (helpers >= 2) {
		outputText("\n\nThanks to your assistants, the construction takes only one hour!");
		doNext(camp.returnToCampUseOneHour);
	}
	else if (helpers == 1) {
		outputText("\n\nThanks to your assistant, the construction takes only two hours.");
		doNext(camp.returnToCampUseTwoHours);
	}
	else {
		outputText("\n\nIt's " + (fatigueAmount >= 75 ? "a daunting" : "an easy") + " task but you eventually manage to finish building a segment of the wall for your camp!");
		doNext(camp.returnToCampUseFourHours);
	}
	if (flags[kFLAGS.CAMP_WALL_PROGRESS] >= 100) {
		outputText("\n\n<b>Well done! You have finished the wall! You can build a gate and decorate wall with imp skulls to further deter whoever might try to come and rape you.</b>");
		output.flush();
	}
}
//Camp gate
private  buildCampGatePrompt(): void {
	clearOutput();
	if (player.fatigue >= player.maxFatigue() - 50) {
		outputText("You are too exhausted to work on your camp wall!");
		doNext(doCamp);
		return;
	}
	outputText(images.showImage("camp-wall-gate"));
	outputText("You can build a gate to further secure your camp by having it closed at night.\n\n");
	kGAMECLASS.camp.cabinProgress.checkMaterials();
	outputText("\n\nIt will cost 100 nails, 100 stones and 100 wood to build a gate.\n\n");
	if (flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] >= 100 && player.keyItemv1("Carpenter's Toolbox") >= 100 && flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] >= 100)
		doYesNo(buildCampGate, doCamp);
	else {
		outputText("\n<b>Unfortunately, you do not have sufficient resources.</b>");
		doNext(doCamp);
	}
}

private  buildCampGate(): void {
var  helpers: number = 0;
var  helperArray: any[] = [];
	if (marbleFollower()) {
		helperArray.push("Marble");
		helpers++;
	}
	if (followerHel()) {
		helperArray.push("Helia");
		helpers++;
	}
	if (followerKiha()) {
		helperArray.push("Kiha");
		helpers++;
	}
	flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] -= 100;
	flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] -= 100;
	player.addKeyValue("Carpenter's Toolbox", 1, -100);
	clearOutput();
	outputText(images.showImage("item-carpentersBook"));
	outputText("You pull out a book titled \"Carpenter's Guide\" and flip pages until you come across instructions on how to build a gate that can be opened and closed. You spend minutes looking at the instructions and memorize the procedures.");
	flags[kFLAGS.CAMP_WALL_GATE] = 1;
	outputText("\n\nYou take the wood from supplies, saw the wood and cut them into planks before nailing them together. ");
	if (helpers > 0) {
		outputText("\n\n" + formatStringArray(helperArray));
		outputText(" " + (helpers == 1 ? "assists" : "assist") + " you with building the gate, helping to speed up the process and make construction less fatiguing. ");
	}
	outputText("\n\nYou eventually finish building the gate.");
	//Gain fatigue
var  fatigueAmount: number = 100;
	fatigueAmount -= player.str / 5;
	fatigueAmount -= player.tou / 10;
	fatigueAmount -= player.spe / 10;
	if (player.findPerk(PerkLib.IronMan) >= 0) fatigueAmount -= 20;
	fatigueAmount /= (helpers + 1);
	if (fatigueAmount < 15) fatigueAmount = 15;
	player.changeFatigue(fatigueAmount);
	doNext(camp.returnToCampUseOneHour);
}

private  promptHangImpSkull(): void {
	clearOutput();
	outputText(images.showImage("item-impSkull"));
	if (flags[kFLAGS.CAMP_WALL_SKULLS] >= 100) {
		outputText("There is no room; you have already hung a total of 100 imp skulls! No imp shall dare approaching you at night!");
		doNext(doCamp);
		return;
	}
	outputText("Would you like to hang the skull of an imp onto wall? ");
	if (flags[kFLAGS.CAMP_WALL_SKULLS] > 0) outputText("There " + (flags[kFLAGS.CAMP_WALL_SKULLS] == 1 ? "is" : "are") + " currently " + num2Text(flags[kFLAGS.CAMP_WALL_SKULLS]) + " imp skull" + (flags[kFLAGS.CAMP_WALL_SKULLS] == 1 ? "" : "s") + " hung on the wall, serving to deter any imps who might try to rape you.");
	doYesNo(hangImpSkull, doCamp);
}

private  hangImpSkull(): void {
	clearOutput();
	outputText(images.showImage("camp-wall-skull"));
	outputText("You hang the skull of an imp on the wall. ");
	player.consumeItem(useables.IMPSKLL, 1);
	flags[kFLAGS.CAMP_WALL_SKULLS]++;
	outputText("There " + (flags[kFLAGS.CAMP_WALL_SKULLS] == 1 ? "is" : "are") + " currently " + num2Text(flags[kFLAGS.CAMP_WALL_SKULLS]) + " imp skull" + (flags[kFLAGS.CAMP_WALL_SKULLS] == 1 ? "" : "s") + " hung on the wall, serving to deter any imps who might try to rape you.");
	doNext(doCamp);
}

public  homeDesc(): string {
var  textToChoose: string;
	if (flags[kFLAGS.CAMP_BUILT_CABIN] > 0 && flags[kFLAGS.CAMP_CABIN_FURNITURE_BED] > 0) textToChoose = "cabin";
	else textToChoose = "tent";
	return textToChoose;
}
public  bedDesc(): string {
var  textToChoose: string;
	if (flags[kFLAGS.CAMP_BUILT_CABIN] > 0 && flags[kFLAGS.CAMP_CABIN_FURNITURE_BED] > 0) textToChoose = "bed";
	else textToChoose = "bedroll";
	return textToChoose;
}

private  promptAscend(): void {
	clearOutput();
	outputText(images.showImage("event-question"));
	outputText("Are you sure you want to ascend? This will restart the game and put you into ");
	if (flags[kFLAGS.NEW_GAME_PLUS_LEVEL] == 0) outputText("<b>New Game+</b>");
	else if (flags[kFLAGS.NEW_GAME_PLUS_LEVEL] == 1) outputText("<b>New Game++</b>");
	else if (flags[kFLAGS.NEW_GAME_PLUS_LEVEL] == 2) outputText("<b>New Game+++</b>");
	else outputText("<b>New Game+" + (flags[kFLAGS.NEW_GAME_PLUS_LEVEL] + 1) + "</b>");
	outputText(". Your items, level, and attributes except Corruption will be carried over into new playthrough. You'll revert back to human completely but you'll get to keep ears, horns, and tail transformations, if any. You'll also retain your name and gender.");
	outputText("\n\n<b>Proceed?</b>");
	doYesNo(ascendForReal, campActions);
}
//Sorted alphabetically
private  totalChildrenForAscension(): number {
var  amount: number = 0;
	amount += flags[kFLAGS.AMILY_BIRTH_TOTAL] + flags[kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS]; //Amily
	amount += flags[kFLAGS.BEHEMOTH_CHILDREN]; //Behemoth
	amount += flags[kFLAGS.BENOIT_EGGS] + flags[kFLAGS.FEMOIT_EGGS_LAID]; //Benoit(e)
	amount += flags[kFLAGS.COTTON_KID_COUNT]; //Cotton
	amount += flags[kFLAGS.EDRYN_NUMBER_OF_KIDS]; //Edryn
	amount += emberScene.emberChildren(); //Ember
	amount += isabellaScene.totalIsabellaChildren(); //Isabella
	amount += izmaScene.totalIzmaChildren(); //Izma
	amount += joyScene.getTotalLitters(); //Jojo/Joy
	amount += flags[kFLAGS.KELLY_KIDS]; //Kelly
	amount += kihaFollower.totalKihaChildren(); //Kiha
	amount += flags[kFLAGS.LOPPE_KIDS]; //Loppe
	amount += flags[kFLAGS.LYNNETTE_BABY_COUNT]; //Lynnette
	amount += flags[kFLAGS.MARBLE_KIDS]; //Marble
	amount += flags[kFLAGS.MINERVA_CHILDREN]; //Minerva
	amount += Math.pow(flags[kFLAGS.ANT_KIDS] + flags[kFLAGS.PHYLLA_DRIDER_BABIES_COUNT], 0.4); //Phylla, at 5000 ant children it would count as 30 other kids
	amount += flags[kFLAGS.SHEILA_JOEYS] + flags[kFLAGS.SHEILA_IMPS]; //Sheila
	amount += sophieBimbo.sophieChildren(); //Sophie
	amount += (flags[kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS] / 4); //Tamani
	amount += urtaPregs.urtaKids(); //Urta
	return amount;
}
private  ascendForReal(): void {
	//Check performance!
var  performancePoints: number = 0;
	performancePoints += companionsCount(); //companions
	//Dungeons
	if (kGAMECLASS.dungeons.checkFactoryClear()) performancePoints++;
	if (kGAMECLASS.dungeons.checkDeepCaveClear()) performancePoints++;
	if (kGAMECLASS.dungeons.checkLethiceStrongholdClear()) performancePoints++;
	if (kGAMECLASS.dungeons.checkSandCaveClear()) performancePoints++;
	if (kGAMECLASS.dungeons.checkPhoenixTowerClear()) performancePoints += 2;
	//Quests
	if (flags[kFLAGS.MARBLE_PURIFIED] > 0) performancePoints += 2;
	if (flags[kFLAGS.MINERVA_PURIFICATION_PROGRESS] >= 10) performancePoints += 2;
	if (flags[kFLAGS.URTA_QUEST_STATUS] > 0) performancePoints += 2;
	if (player.findPerk(PerkLib.Enlightened) >= 0) performancePoints += 1;
	if (flags[kFLAGS.CORRUPTED_MARAE_KILLED] > 0 || flags[kFLAGS.PURE_MARAE_ENDGAME] >= 2) performancePoints += 1;
	performancePoints += Math.sqrt(totalChildrenForAscension()); //children
	player.ascensionPerkPoints += performancePoints; //sum up ascension perk points!
	player.knockUpForce(); //clear pregnancy
	//Scene GO!
	clearOutput();
	if (marbleFollower() && flags[kFLAGS.MARBLE_KIDS] >= 7) outputText(images.showImage("camp-ascending-marble"));
	else if (flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] >= 7) outputText(images.showImage("camp-ascending-sophie"));
	else if (flags[kFLAGS.AMILY_BIRTH_TOTAL] + flags[kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS] > 12) outputText(images.showImage("camp-ascending-amily"));
	else if (urtaPregs.urtaKids() >= 7) outputText(images.showImage("camp-ascending-urta"));
	else if (player.cor >= 75) outputText(images.showImage("camp-ascending-corrupt"));
	else if (flags[kFLAGS.MET_OTTERGIRL] >= 12 && player.hasCock()) outputText(images.showImage("camp-ascending-callu"));
	else outputText(images.showImage("camp-watch-stars"));
	outputText("It's time for you to ascend. You walk to the center of the camp, announce that you're going to ascend to a higher plane of existence, and lay down. ");
	if (companionsCount() == 1) outputText("\n\nYour fellow companion comes to witness.");
	else if (companionsCount() > 1) outputText("\n\nYour fellow companions come to witness.");
	outputText("\n\nYou begin to glow; you can already feel yourself leaving your body and you announce your departure.");
	if (marbleFollower()) outputText("\n\n\"<i>Sweetie, I'm going to miss you. See you in the next playthrough,</i>\" Marble says, tears leaking from her eyes.");
	outputText("\n\nThe world around you slowly fades to black and stars dot the endless void. <b>You have ascended.</b>");
	doNext(kGAMECLASS.charCreation.ascensionMenu);
}

public  setLevelButton(): boolean {
	if ((player.XP >= player.requiredXP() && player.level < kGAMECLASS.levelCap) || player.perkPoints > 0 || player.statPoints > 0) {
		if (player.XP < player.requiredXP() || player.level >= kGAMECLASS.levelCap) {
			if (player.statPoints > 0) {
				mainView.setMenuButton (MainView.MENU_LEVEL, "Stat Up");
				mainView.levelButton.toolTipTextInstance = "Distribute your stats points. \n\nYou currently have " + String(player.statPoints) + ".";
			}
			else {
				mainView.setMenuButton (MainView.MENU_LEVEL, "Perk Up");
				mainView.levelButton.toolTipTextInstance = "Spend your perk points on a new perk. \n\nYou currently have " + String(player.perkPoints) + ".";
			}
		}
		else {
			mainView.setMenuButton (MainView.MENU_LEVEL, "Level Up");
			mainView.levelButton.toolTipTextInstance = "Level up to increase your maximum HP by 15 and gain 5 attribute points and 1 perk points.";
			if (flags[kFLAGS.AUTO_LEVEL] > 0) {
				kGAMECLASS.playerInfo.levelUpGo();
				return true; //true indicates that you should be routed to level-up
			}
		}
		mainView.showMenuButton (MainView.MENU_LEVEL);
		mainView.statsView.showLevelUp();
		if (player.str >= player.getMaxStats("str") && player.tou >= player.getMaxStats("tou") && player.inte >= player.getMaxStats("int") && player.spe >= player.getMaxStats("spe") && (player.perkPoints <= 0 || kGAMECLASS.playerInfo.buildPerkList().length <= 0) && (player.XP < player.requiredXP() || player.level >= kGAMECLASS.levelCap))
			mainView.statsView.hideLevelUp();
	}
	else {
		mainView.hideMenuButton( MainView.MENU_LEVEL );
		mainView.statsView.hideLevelUp();
	}
	return false;
}
//------------ Camp population ------------
public  getCampPopulation(): number {
var  pop: number = 0; //once you enter Mareth, this will increase to 1
	if (flags[kFLAGS.IN_INGNAM] <= 0) pop++; //you count toward the population!
	pop += companionsCount();
	//Misc check!
	if (ceraphIsFollower()) pop--; //Ceraph doesn't stay in your camp
	if (player.armorName == "goo armor") pop++; //include Valeria if you're wearing her
	if (flags[kFLAGS.CLARA_IMPRISONED] > 0) pop++;
	if (flags[kFLAGS.ANEMONE_KID] > 0) pop++;
	if (flags[kFLAGS.FUCK_FLOWER_LEVEL] >= 4) pop++;
	//						 Children check!
	/******************************************************************/
	/*							Followers							  */
	/******************************************************************/
	if (followerEmber() && emberScene.emberChildren() > 0) pop += emberScene.emberChildren();
	//Jojo's offsprings don't stay in your camp; they will join with Amily's litters as well
	if (sophieFollower()) {
		if (flags[kFLAGS.SOPHIE_DAUGHTER_MATURITY_COUNTER] > 0) pop++;
		if (flags[kFLAGS.SOPHIE_ADULT_KID_COUNT]) pop += flags[kFLAGS.SOPHIE_ADULT_KID_COUNT];
	}
	/******************************************************************/
	/*							Lovers								  */
	/******************************************************************/
	//Amily's offsprings don't stay in your camp
	//Helia can only have 1 child: Helspawn. She's included in companions count
	if (isabellaFollower() && isabellaScene.totalIsabellaChildren() > 0) pop += isabellaScene.totalIsabellaChildren();
	if (izmaFollower() && izmaScene.totalIzmaChildren() > 0) pop += izmaScene.totalIzmaChildren();
	if (followerKiha() && kihaFollower.totalKihaChildren() > 0) pop += kihaFollower.totalKihaChildren();
	if (marbleFollower() && flags[kFLAGS.MARBLE_KIDS] > 0) pop += flags[kFLAGS.MARBLE_KIDS];
	if (flags[kFLAGS.ANT_WAIFU] > 0 && (flags[kFLAGS.ANT_KIDS] > 0 || flags[kFLAGS.PHYLLA_DRIDER_BABIES_COUNT] > 0)) pop += (flags[kFLAGS.ANT_KIDS] + flags[kFLAGS.PHYLLA_DRIDER_BABIES_COUNT]);
	return pop; //return number!
}

private  fixFlags(): void {
	if (player.hasStatusEffect(StatusEffects.MetMarae)) {
		flags[kFLAGS.MET_MARAE] = 1 //Marae
		player.removeStatusEffect(StatusEffects.MetMarae);		
	}
	if (player.hasStatusEffect(StatusEffects.MaraesQuestStart)) {
		flags[kFLAGS.MARAE_QUEST_START] = 1
		player.removeStatusEffect(StatusEffects.MaraesQuestStart);
	}
	if (player.hasStatusEffect(StatusEffects.MaraeComplete)) {
		flags[kFLAGS.MARAE_QUEST_COMPLETE] = 1
		player.removeStatusEffect(StatusEffects.MaraeComplete);		
	}
	if (player.hasStatusEffect(StatusEffects.MaraesLethicite)) {
		player.createKeyItem("Marae's Lethicite", 3, 0, 0, 0);
		player.removeStatusEffect(StatusEffects.MaraesLethicite);
	}
	if (player.hasStatusEffect(StatusEffects.FactorySuccubusDefeated)) {
		flags[kFLAGS.FACTORY_SUCCUBUS_DEFEATED] = 1; //Factory Demons
		player.removeStatusEffect(StatusEffects.FactorySuccubusDefeated);
	}
	if (player.hasStatusEffect(StatusEffects.FactoryIncubusDefeated)) {
		flags[kFLAGS.FACTORY_OMNIBUS_DEFEATED] = 1;
		player.removeStatusEffect(StatusEffects.FactoryIncubusDefeated);
	}
	if (player.hasStatusEffect(StatusEffects.FactoryOmnibusDefeated)) {
		flags[kFLAGS.FACTORY_OMNIBUS_DEFEATED] = 1;
		player.removeStatusEffect(StatusEffects.FactoryOmnibusDefeated);
	}
	if (player.hasStatusEffect(StatusEffects.FoundFactory)) {
		flags[kFLAGS.FACTORY_FOUND] = 1; //Factory Variables
		player.removeStatusEffect(StatusEffects.FoundFactory);
	}
	if (player.hasStatusEffect(StatusEffects.IncubusBribed)) {
		flags[kFLAGS.FACTORY_INCUBUS_BRIBED] = 1;
		player.removeStatusEffect(StatusEffects.IncubusBribed);
	}
	if (player.hasStatusEffect(StatusEffects.DungeonShutDown)) {
		flags[kFLAGS.FACTORY_SHUTDOWN] = 1;
		player.removeStatusEffect(StatusEffects.DungeonShutDown);
	}
	if (player.hasStatusEffect(StatusEffects.FactoryOverload)) {
		flags[kFLAGS.FACTORY_SHUTDOWN] = 2;
		player.removeStatusEffect(StatusEffects.FactoryOverload);
	}
	if (player.hasStatusEffect(StatusEffects.TakenLactaid)) {
		flags[kFLAGS.FACTORY_TAKEN_LACTAID] = 5 - (player.statusEffectv1(StatusEffects.TakenLactaid))
		player.removeStatusEffect(StatusEffects.TakenLactaid);
	}
	if (player.hasStatusEffect(StatusEffects.TakenGroPlus)) {
		flags[kFLAGS.FACTORY_TAKEN_GROPLUS] = 5 - (player.statusEffectv1(StatusEffects.TakenGroPlus))
		player.removeStatusEffect(StatusEffects.TakenGroPlus);
	}
	if (kGAMECLASS.dungeons.checkPhoenixTowerClear()) flags[kFLAGS.CLEARED_HEL_TOWER] = 1;
}
private  promptSaveUpdate(): void {
	clearOutput();
	outputText(images.showImage("event-floppy"));
	if (flags[kFLAGS.MOD_SAVE_VERSION] < 2) {
		flags[kFLAGS.MOD_SAVE_VERSION] = 2;
		outputText("<b><u>CAUTION</u></b>\n");
		outputText("It appears that you are importing your save from vanilla CoC.");
		outputText("\n\nIf you're planning to save over your original save file, please stop to think. If you overwrite the save file from original game, it will no longer be backwards compatible with the original CoC.");
		outputText("\n\nI suggest you create separate save files. I recommend you use slots 10-14 for saving your progress in this mod.");
		outputText("\n\nWithout further ado, enjoy everything CoC: Unofficial Expanded Edition has to offer!");
		doNext(doCamp);
		return;
	}
	if (flags[kFLAGS.MOD_SAVE_VERSION] == 2) {
		flags[kFLAGS.MOD_SAVE_VERSION] = 3;
		outputText("Starting in version 0.8 of this mod, achievements are now awarded. To ensure that you don't have to go through scenes again on new savefile, achievements will be awarded depending on flags.");
		outputText("\n\nSome achievements, however, will require you to do it again.");
		updateAchievements();
		outputText("\n\nAchievements are saved in a special savefile so no matter what savefile you're on, any earned achievements will be added to that special savefile.");
		doNext(doCamp);
		return;
	}
	if (flags[kFLAGS.MOD_SAVE_VERSION] == 3) {
		//Reclaim flags for future use
		flags[kFLAGS.GIACOMO_MET] = 0;
		flags[kFLAGS.GIACOMO_NOTICES_WORMS] = 0;
		flags[kFLAGS.PHOENIX_ENCOUNTERED] = 0;
		flags[kFLAGS.PHOENIX_WANKED_COUNTER] = 0;
		flags[kFLAGS.MOD_SAVE_VERSION] = 4;
		doCamp();
		return;
	}
	if (flags[kFLAGS.MOD_SAVE_VERSION] == 4) {
		flags[kFLAGS.MOD_SAVE_VERSION] = 5;
		if (flags[kFLAGS.KELT_KILLED] > 0 && player.statusEffectv1(StatusEffects.Kelt) <= 0) {
			clearOutput();
			outputText("Due to a bug where your bow skill got reset after you've slain Kelt, your bow skill got reset. Fortunately, this is now fixed. As a compensation, your bow skill is now instantly set to 100!");
			if (player.statusEffectv1(StatusEffects.Kelt) <= 0) player.createStatusEffect(StatusEffects.Kelt, 100, 0, 0, 0);
			doNext(doCamp);
			return;
		}
		doCamp();
		return;
	}
	if (flags[kFLAGS.MOD_SAVE_VERSION] == 5) {
		flags[kFLAGS.MOD_SAVE_VERSION] = 6;
		if (player.armorName == "revealing fur loincloths" || player.armorName == "comfortable underclothes" || player.weaponName == "dragon-shell shield") {
			clearOutput();
			outputText("Due to a bit of restructing regarding equipment, any reclassified equipment (eggshell shield and fur loincloth) that was equipped are now unequipped.");
			if (player.armorName == "comfortable underclothes") player.setArmor(ArmorLib.NOTHING);
			if (player.armorName == "revealing fur loincloths") inventory.takeItem(player.setArmor(ArmorLib.COMFORTABLE_UNDERCLOTHES), promptSaveUpdate);
			if (player.weaponName == "dragon-shell shield") inventory.takeItem(player.setWeapon(WeaponLib.FISTS), promptSaveUpdate);
			doNext(doCamp);
			return;
		}
		doCamp();
		return;
	}
	if (flags[kFLAGS.MOD_SAVE_VERSION] == 6) {
		flags[kFLAGS.MOD_SAVE_VERSION] = 7;
		flags[kFLAGS.D1_OMNIBUS_KILLED] = flags[kFLAGS.CORRUPTED_GLADES_DESTROYED];
		flags[kFLAGS.CORRUPTED_GLADES_DESTROYED] = 0; //reclaimed
		if (player.armor == armors.GOOARMR) flags[kFLAGS.VALERIA_FLUIDS] = 100;
		doCamp();
		return;
	}
	if (flags[kFLAGS.MOD_SAVE_VERSION] == 7) {
		flags[kFLAGS.MOD_SAVE_VERSION] = 8;
		//Move and reclaim flag
		flags[kFLAGS.LETHICITE_ARMOR_TAKEN] = flags[kFLAGS.JOJO_ANAL_CATCH_COUNTER];
		flags[kFLAGS.JOJO_ANAL_CATCH_COUNTER] = 0;
		doCamp();
		return;
	}
	if (flags[kFLAGS.MOD_SAVE_VERSION] == 8) {
		flags[kFLAGS.MOD_SAVE_VERSION] = 9;
		if (!player.hasFur()) {
			doCamp(); //No fur? Return to camp
			return;
		}
		clearOutput();
		outputText("Starting in version 1.3 of the mod, fur colour is now separate from hair colour. So as a one-time offer, you can now choose fur colour!");
		furColorSelection1(); //update fur
		return;
	}
	if (flags[kFLAGS.MOD_SAVE_VERSION] == 9) {
		flags[kFLAGS.MOD_SAVE_VERSION] = 10;
		if (flags[kFLAGS.MARAE_LETHICITE] > 0 && player.hasKeyItem("Marae's Lethicite") >= 0) {
			player.removeKeyItem("Marae's Lethicite"); //remove the old
			player.createKeyItem("Marae's Lethicite", flags[kFLAGS.MARAE_LETHICITE], 0, 0, 0);
			flags[kFLAGS.MARAE_LETHICITE] = 0; //reclaim the flag
		}
	}
	if (flags[kFLAGS.MOD_SAVE_VERSION] == 10) {
		flags[kFLAGS.MOD_SAVE_VERSION] = 11;
		if (flags[kFLAGS.EMBER_SPAR_VICTORIES] > 0) {
			outputText("Due to the official release of Lethice, you can now fight her again! Be prepared to face Drider Incubus and Minotaur King beforehand!");
			flags[kFLAGS.EMBER_SPAR_VICTORIES] = 0; //reclaim the flag and display message
			doNext(doCamp);
			return;
		}
	}
	if (flags[kFLAGS.MOD_SAVE_VERSION] == 11) {
		flags[kFLAGS.MOD_SAVE_VERSION] = 12;
		flags[kFLAGS.GRIMDARK_MODE] = 0;
	}
	if (flags[kFLAGS.MOD_SAVE_VERSION] == 12) {
		flags[kFLAGS.MOD_SAVE_VERSION] = 13;
		if (flags[kFLAGS.CAMP_CABIN_PROGRESS] > 5) //decrement by 2 so that values 6 and 7 are used and progress ends at 10, not 12
			flags[kFLAGS.CAMP_CABIN_PROGRESS] -= 2;
	}
	if (flags[kFLAGS.MOD_SAVE_VERSION] == 13) {
		flags[kFLAGS.MOD_SAVE_VERSION] = 14;
		flags[kFLAGS.SANDWITCH_SERVICED] = flags[2295];
		flags[kFLAGS.JOJO_STATUS] = flags[2296];
		//Reclaim those flags
		flags[2295] = 0;
		flags[2296] = 0;
	}
	if (flags[kFLAGS.MOD_SAVE_VERSION] == 14) {
		flags[kFLAGS.MOD_SAVE_VERSION] = 15;
		//Reclaim those flags
		flags[2194] = 0;
		flags[254] = 0;
		flags[255] = 0;
	}
	if (flags[kFLAGS.MOD_SAVE_VERSION] == 15) {
		flags[kFLAGS.MOD_SAVE_VERSION] = 16;
	}
	doCamp();
}

private  furColorSelection1(): void {
	menu();
	addButton(0, "Brown", chooseFurColorSaveUpdate, "brown");
	addButton(1, "Chocolate", chooseFurColorSaveUpdate, "chocolate");
	addButton(2, "Auburn", chooseFurColorSaveUpdate, "auburn");
	addButton(3, "Orange", chooseFurColorSaveUpdate, "orange");
	addButton(4, "Next", furColorSelection2); //next
	addButton(5, "Caramel", chooseFurColorSaveUpdate, "caramel");
	addButton(6, "Peach", chooseFurColorSaveUpdate, "peach");
	addButton(7, "Sandy Brown", chooseFurColorSaveUpdate, "sandy brown");
	addButton(8, "Golden", chooseFurColorSaveUpdate, "golden");
}
private  furColorSelection2(): void {
	menu();
	addButton(0, "Midnight black", chooseFurColorSaveUpdate, "midnight black");
	addButton(1, "Black", chooseFurColorSaveUpdate, "black");
	addButton(2, "Dark gray", chooseFurColorSaveUpdate, "dark gray");
	addButton(3, "Gray", chooseFurColorSaveUpdate, "gray");

	addButton(5, "Light gray", chooseFurColorSaveUpdate, "light gray");
	addButton(6, "Silver", chooseFurColorSaveUpdate, "silver");
	addButton(7, "White", chooseFurColorSaveUpdate, "white");
	addButton(9, "Previous", furColorSelection1); //previous
	addButton(10, "Orange&White", chooseFurColorSaveUpdate, "orange and white");
	addButton(11, "Brown&White", chooseFurColorSaveUpdate, "brown and white");
	addButton(12, "Black&White", chooseFurColorSaveUpdate, "black and white");
	addButton(13, "Gray&White", chooseFurColorSaveUpdate, "gray and white");
}

private  chooseFurColorSaveUpdate(color: string): void {
	clearOutput();
	outputText("You now have " + color + " fur. You will be returned to your camp now and you can continue your usual gameplay.");
	player.skin.furColor = color;
	doNext(doCamp);
}
//Updates save. Done to ensure your save doesn't get screwed up
private  updateSaveFlags(): void {
	flags[kFLAGS.MOD_SAVE_VERSION] = kGAMECLASS.modSaveVersion;
var  startOldIds: number = 1195;
var  startNewIds: number = 2001;
var  current: number = 0;
var  target: number = 65;
	while (current < target) {
		//trace(flags[startOldIds + current])
		if (flags[startOldIds + current] != 0) {
			flags[startNewIds + current] = flags[startOldIds + current];
			flags[startOldIds + current] = 0;
		}
		current++;
	}
	if (player.ass.analLooseness > 0 && flags[kFLAGS.TIMES_ORGASMED] <= 0) flags[kFLAGS.TIMES_ORGASMED] = 1;
	clearOutput();
	outputText(images.showImage("event-floppy"));
	outputText("Your save file has been updated by changing the variables used in this mod from old flag position to new flag position.\n\n")
	outputText("As you know, the base game update tends to change flags and that may screw up saves when mod gets updated.\n\n")
	outputText("Unfortunately, I can't guarantee if every flags are retained. You may have lost some furniture or may have lost cabin. I'm sorry if this happens. Your codex entries are still unlocked, don't worry. And if your cabin is built, don't worry, it's still intact and you can re-construct furniture again.\n\n")
	if (flags[kFLAGS.CAMP_BUILT_CABIN] > 0) {
		outputText("As a compensation, here's 50 wood and 150 nails to re-construct your furniture.\n\n")
		flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] += 50;
		if (player.hasKeyItem("Carpenter's Toolbox") >= 0) player.addKeyValue("Carpenter's Toolbox", 1, 150);
	}
	outputText("Don't worry. Just save the game and you're good to go. I, Kitteh6660, will work out the bugs from time to time, while also bringing in cool new stuff!")
	doNext(doCamp);
}

//Unique NPCs killed
public  getUniqueKills(): number {
var  count: number = 0;
	if (flags[kFLAGS.D1_OMNIBUS_KILLED] > 0) count++;
	if (flags[kFLAGS.ZETAZ_DEFEATED_AND_KILLED] > 0) count++;
	if (flags[kFLAGS.HARPY_QUEEN_EXECUTED] > 0) count++;
	if (flags[kFLAGS.KELT_KILLED] > 0) count++;
	if (flags[kFLAGS.JOJO_DEAD_OR_GONE] == 2) count++;
	if (flags[kFLAGS.CORRUPTED_MARAE_KILLED] > 0) count++;
	if (flags[kFLAGS.FUCK_FLOWER_KILLED] > 0) count++;
	if (flags[kFLAGS.TAMANI_BAD_ENDED] > 0) count++;
	//Lethice Keep encounters
	if (flags[kFLAGS.D3_GARDENER_DEFEATED] == 3) count++;
	if (flags[kFLAGS.D3_CENTAUR_DEFEATED] == 1) count++;
	if (flags[kFLAGS.D3_MECHANIC_FIGHT_RESULT] == 1) count++;
	if (flags[kFLAGS.DRIDERINCUBUS_KILLED] > 0) count++;
	if (flags[kFLAGS.MINOTAURKING_KILLED] > 0) count++;
	if (flags[kFLAGS.LETHICE_KILLED] > 0) count++;
	return count;
}

//Total NPCs killed
public  getTotalKills(): number {
var  count: number = 0;
	count += getUniqueKills();
	count += flags[kFLAGS.IMPS_KILLED];
	count += flags[kFLAGS.GOBLINS_KILLED];
	count += flags[kFLAGS.TENTACLE_BEASTS_KILLED];
	count += flags[kFLAGS.HELLHOUNDS_KILLED];
	count += flags[kFLAGS.MINOTAURS_KILLED];
	count += flags[kFLAGS.WORMS_MASS_KILLED];
	return count;
}

private  updateAchievements(): void {
	//Story
	awardAchievement("Newcomer", kACHIEVEMENTS.STORY_NEWCOMER);
	if (flags[kFLAGS.MARAE_QUEST_COMPLETE] > 0) awardAchievement("Marae's Savior", kACHIEVEMENTS.STORY_MARAE_SAVIOR);
	if (player.hasKeyItem("Zetaz's Map") >= 0) awardAchievement("Revenge at Last", kACHIEVEMENTS.STORY_ZETAZ_REVENGE);
	if (flags[kFLAGS.LETHICE_DEFEATED] > 0) awardAchievement("Demon Slayer", kACHIEVEMENTS.STORY_FINALBOSS);
	//Areas
	if (flags[kFLAGS.TIMES_EXPLORED_FOREST] > 0 && flags[kFLAGS.TIMES_EXPLORED_LAKE] > 0 && flags[kFLAGS.TIMES_EXPLORED_DESERT] > 0 && flags[kFLAGS.TIMES_EXPLORED_MOUNTAIN] > 0 && flags[kFLAGS.TIMES_EXPLORED_PLAINS] > 0 && flags[kFLAGS.TIMES_EXPLORED_SWAMP] > 0 && player.hasStatusEffect(StatusEffects.ExploredDeepwoods) && flags[kFLAGS.DISCOVERED_HIGH_MOUNTAIN] > 0 && flags[kFLAGS.BOG_EXPLORED] > 0 && flags[kFLAGS.DISCOVERED_GLACIAL_RIFT] > 0)
		awardAchievement("Explorer", kACHIEVEMENTS.ZONE_EXPLORER);
	if (placesCount() >= 10) awardAchievement("Sightseer", kACHIEVEMENTS.ZONE_SIGHTSEER);
	if (flags[kFLAGS.TIMES_EXPLORED] >= 1) awardAchievement("Where am I?", kACHIEVEMENTS.ZONE_WHERE_AM_I);
	if (flags[kFLAGS.TIMES_EXPLORED_DESERT] >= 100) awardAchievement("Dehydrated", kACHIEVEMENTS.ZONE_DEHYDRATED);
	if (flags[kFLAGS.TIMES_EXPLORED_FOREST] >= 100) awardAchievement("Forest Ranger", kACHIEVEMENTS.ZONE_FOREST_RANGER);
	if (flags[kFLAGS.TIMES_EXPLORED_LAKE] >= 100) awardAchievement("Vacationer", kACHIEVEMENTS.ZONE_VACATIONER);
	if (flags[kFLAGS.TIMES_EXPLORED_MOUNTAIN] >= 100) awardAchievement("Mountaineer", kACHIEVEMENTS.ZONE_MOUNTAINEER);
	if (flags[kFLAGS.TIMES_EXPLORED_PLAINS] >= 100) awardAchievement("Rolling Hills", kACHIEVEMENTS.ZONE_ROLLING_HILLS);
	if (flags[kFLAGS.TIMES_EXPLORED_SWAMP] >= 100) awardAchievement("Wet All Over", kACHIEVEMENTS.ZONE_WET_ALL_OVER);
	if (player.statusEffectv1(StatusEffects.ExploredDeepwoods) >= 100) awardAchievement("We Need to Go Deeper", kACHIEVEMENTS.ZONE_WE_NEED_TO_GO_DEEPER);
	if (flags[kFLAGS.DISCOVERED_HIGH_MOUNTAIN] >= 100) awardAchievement("Light-headed", kACHIEVEMENTS.ZONE_LIGHT_HEADED);
	if (flags[kFLAGS.BOG_EXPLORED] >= 100) awardAchievement("All murky", kACHIEVEMENTS.ZONE_ALL_MURKY);
	if (flags[kFLAGS.DISCOVERED_GLACIAL_RIFT] >= 100) awardAchievement("Frozen", kACHIEVEMENTS.ZONE_FROZEN);
	if (flags[kFLAGS.DISCOVERED_VOLCANO_CRAG] >= 100) awardAchievement("Roasted", kACHIEVEMENTS.ZONE_ROASTED);
	//Places
	if (player.statusEffectv1(StatusEffects.BoatDiscovery) >= 15) awardAchievement("Sea Legs", kACHIEVEMENTS.ZONE_SEA_LEGS);
	if (player.statusEffectv1(StatusEffects.MetWhitney) >= 30) awardAchievement("Farmer", kACHIEVEMENTS.ZONE_FARMER);
	if (flags[kFLAGS.AMILY_VILLAGE_EXPLORED] >= 15) awardAchievement("Archaeologist", kACHIEVEMENTS.ZONE_ARCHAEOLOGIST);
	//Levels
	if (player.level >= 2) awardAchievement("Level up!", kACHIEVEMENTS.LEVEL_LEVEL_UP);
	if (player.level >= 5) awardAchievement("Novice", kACHIEVEMENTS.LEVEL_NOVICE);
	if (player.level >= 10) awardAchievement("Apprentice", kACHIEVEMENTS.LEVEL_APPRENTICE);
	if (player.level >= 15) awardAchievement("Journeyman", kACHIEVEMENTS.LEVEL_JOURNEYMAN);
	if (player.level >= 20) awardAchievement("Expert", kACHIEVEMENTS.LEVEL_EXPERT);
	if (player.level >= 30) awardAchievement("Master", kACHIEVEMENTS.LEVEL_MASTER);
	if (player.level >= 45) awardAchievement("Grandmaster", kACHIEVEMENTS.LEVEL_GRANDMASTER);
	if (player.level >= 60) awardAchievement("Illustrious", kACHIEVEMENTS.LEVEL_ILLUSTRIOUS);
	if (player.level >= 90) awardAchievement("Overlord", kACHIEVEMENTS.LEVEL_OVERLORD);
	if (player.level >= 120) awardAchievement("Are you a god?", kACHIEVEMENTS.LEVEL_ARE_YOU_A_GOD);
	//Population
	if (getCampPopulation() >= 2) awardAchievement("My First Companion", kACHIEVEMENTS.POPULATION_FIRST);
	if (getCampPopulation() >= 5) awardAchievement("Hamlet", kACHIEVEMENTS.POPULATION_HAMLET);
	if (getCampPopulation() >= 10) awardAchievement("Village", kACHIEVEMENTS.POPULATION_VILLAGE);
	if (getCampPopulation() >= 25) awardAchievement("Town", kACHIEVEMENTS.POPULATION_TOWN);
	if (getCampPopulation() >= 100) awardAchievement("City", kACHIEVEMENTS.POPULATION_CITY);
	if (getCampPopulation() >= 250) awardAchievement("Metropolis", kACHIEVEMENTS.POPULATION_METROPOLIS);
	if (getCampPopulation() >= 500) awardAchievement("Megalopolis", kACHIEVEMENTS.POPULATION_MEGALOPOLIS);
	if (getCampPopulation() >= 1000) awardAchievement("City-State", kACHIEVEMENTS.POPULATION_CITY_STATE);
	if (getCampPopulation() >= 2500) awardAchievement("Kingdom", kACHIEVEMENTS.POPULATION_KINGDOM);
	if (getCampPopulation() >= 5000) awardAchievement("Empire", kACHIEVEMENTS.POPULATION_EMPIRE);
	//Time
	if (getGame().time.days >= 30) awardAchievement("It's been a month", kACHIEVEMENTS.TIME_MONTH);
	if (getGame().time.days >= 180) awardAchievement("Half-year", kACHIEVEMENTS.TIME_HALF_YEAR);
	if (getGame().time.days >= 365) awardAchievement("Annual", kACHIEVEMENTS.TIME_ANNUAL);
	if (getGame().time.days >= 730) awardAchievement("Biennial", kACHIEVEMENTS.TIME_BIENNIAL);
	if (getGame().time.days >= 1095) awardAchievement("Triennial", kACHIEVEMENTS.TIME_TRIENNIAL);
	if (getGame().time.days >= 1825) awardAchievement("In for the long haul", kACHIEVEMENTS.TIME_LONG_HAUL);
	if (getGame().time.days >= 3650) awardAchievement("Decade", kACHIEVEMENTS.TIME_DECADE);
	if (getGame().time.days >= 36500) awardAchievement("Century", kACHIEVEMENTS.TIME_CENTURY);
	//Dungeons
var  dungeonsCleared: number = 0;
	if (kGAMECLASS.dungeons.checkFactoryClear()) {
		awardAchievement("Shut Down Everything", kACHIEVEMENTS.DUNGEON_SHUT_DOWN_EVERYTHING);
		dungeonsCleared++;
	}
	if (kGAMECLASS.dungeons.checkDeepCaveClear()) {
		awardAchievement("You're in Deep", kACHIEVEMENTS.DUNGEON_YOURE_IN_DEEP);
		dungeonsCleared++;
	}
	if (kGAMECLASS.dungeons.checkSandCaveClear()) {
		awardAchievement("Friend of the Sand Witches", kACHIEVEMENTS.DUNGEON_SAND_WITCH_FRIEND);
		dungeonsCleared++;
	}
	if (kGAMECLASS.dungeons.checkLethiceStrongholdClear()) {
		awardAchievement("End of Reign", kACHIEVEMENTS.DUNGEON_END_OF_REIGN);
		dungeonsCleared++;
	}
	if (kGAMECLASS.dungeons.checkPhoenixTowerClear()) {
		awardAchievement("Fall of the Phoenix", kACHIEVEMENTS.DUNGEON_PHOENIX_FALL);
		dungeonsCleared++;
		if (flags[kFLAGS.TIMES_ORGASMED] <= 0 && flags[kFLAGS.MOD_SAVE_VERSION] == kGAMECLASS.modSaveVersion)
			awardAchievement("Extremely Chaste Delver", kACHIEVEMENTS.DUNGEON_EXTREMELY_CHASTE_DELVER);
	}
	if (dungeonsCleared >= 1) awardAchievement("Delver", kACHIEVEMENTS.DUNGEON_DELVER);
	if (dungeonsCleared >= 3) awardAchievement("Delver Apprentice", kACHIEVEMENTS.DUNGEON_DELVER_APPRENTICE);
	if (dungeonsCleared >= 5) awardAchievement("Delver Master", kACHIEVEMENTS.DUNGEON_DELVER_MASTER);
	//Fashion
	if (player.armor == armors.W_ROBES && player.weapon == weapons.W_STAFF)
		awardAchievement("Wannabe Wizard", kACHIEVEMENTS.FASHION_WANNABE_WIZARD);
	if (player.previouslyWornClothes.length >= 10)
		awardAchievement("Cosplayer", kACHIEVEMENTS.FASHION_COSPLAYER);
	if ((player.armor == armors.RBBRCLT || player.armor == armors.BONSTRP || player.armor == armors.NURSECL) && (player.weapon == weapons.RIDING0 || player.weapon == weapons.WHIP__0 || player.weapon == weapons.SUCWHIP || player.weapon == weapons.L_WHIP))
		awardAchievement("Dominatrix", kACHIEVEMENTS.FASHION_DOMINATRIX);
	if (player.armor != ArmorLib.NOTHING && player.lowerGarment == UndergarmentLib.NOTHING && player.upperGarment == UndergarmentLib.NOTHING)
		awardAchievement("Going Commando", kACHIEVEMENTS.FASHION_GOING_COMMANDO);
	if (player.jewelry.value >= 1000)
		awardAchievement("Bling Bling", kACHIEVEMENTS.FASHION_BLING_BLING);
	//Wealth
	if (player.gems >= 1000) awardAchievement("Rich", kACHIEVEMENTS.WEALTH_RICH);
	if (player.gems >= 10000) awardAchievement("Hoarder", kACHIEVEMENTS.WEALTH_HOARDER);
	if (player.gems >= 100000) awardAchievement("Gem Vault", kACHIEVEMENTS.WEALTH_GEM_VAULT);
	if (player.gems >= 1000000) awardAchievement("Millionaire", kACHIEVEMENTS.WEALTH_MILLIONAIRE);
	//Combat
	if (player.hasStatusEffect(StatusEffects.KnowsCharge) && player.hasStatusEffect(StatusEffects.KnowsBlind) && player.hasStatusEffect(StatusEffects.KnowsWhitefire) && player.hasStatusEffect(StatusEffects.KnowsArouse) && player.hasStatusEffect(StatusEffects.KnowsHeal) && player.hasStatusEffect(StatusEffects.KnowsMight))
		awardAchievement("Wizard", kACHIEVEMENTS.COMBAT_WIZARD);
	//Realistic
	if (flags[kFLAGS.ACHIEVEMENT_PROGRESS_FASTING] >= 168 && flags[kFLAGS.HUNGER_ENABLED] > 0) awardAchievement("Fasting", kACHIEVEMENTS.REALISTIC_FASTING)
	//Holidays
	if (flags[kFLAGS.NIEVE_STAGE] == 5) awardAchievement("The Lovable Snowman", kACHIEVEMENTS.HOLIDAY_CHRISTMAS_III);
	if (flags[kFLAGS.ACHIEVEMENT_PROGRESS_EGG_HUNTER] >= 10) awardAchievement("Egg Hunter", kACHIEVEMENTS.HOLIDAY_EGG_HUNTER);
	//General
	if (flags[kFLAGS.DEMONS_DEFEATED] >= 25 && getGame().time.days >= 10) awardAchievement("Portal Defender", kACHIEVEMENTS.GENERAL_PORTAL_DEFENDER);
	if (flags[kFLAGS.LETHICE_KILLED] == 2) awardAchievement("Off With Her Head!", kACHIEVEMENTS.GENERAL_OFF_WITH_HER_HEAD);
	//Check how many NPCs got bad-ended
	if (getUniqueKills() >= 3) awardAchievement("Bad Ender", kACHIEVEMENTS.GENERAL_BAD_ENDER);
	//Transformations
	if (flags[kFLAGS.TIMES_TRANSFORMED] >= 1) awardAchievement("What's Happening to Me?", kACHIEVEMENTS.GENERAL_WHATS_HAPPENING_TO_ME);
	if (flags[kFLAGS.TIMES_TRANSFORMED] >= 10) awardAchievement("Transformer", kACHIEVEMENTS.GENERAL_TRANSFORMER);
	if (flags[kFLAGS.TIMES_TRANSFORMED] >= 25) awardAchievement("Shapeshifty", kACHIEVEMENTS.GENERAL_SHAPESHIFTY);
	if (flags[kFLAGS.TIMES_MASTURBATED] >= 1) awardAchievement("Fapfapfap", kACHIEVEMENTS.GENERAL_FAPFAPFAP);
	if (flags[kFLAGS.TIMES_MASTURBATED] >= 10) awardAchievement("Faptastic", kACHIEVEMENTS.GENERAL_FAPTASTIC);
	if (flags[kFLAGS.TIMES_MASTURBATED] >= 100) awardAchievement("Master-bation", kACHIEVEMENTS.GENERAL_FAPSTER);
	//Usual stuff
	if (player.armorName == "goo armor") awardAchievement("Goo Armor", kACHIEVEMENTS.GENERAL_GOO_ARMOR);
	if (helspawnFollower()) awardAchievement("Helspawn", kACHIEVEMENTS.GENERAL_HELSPAWN);
	if (flags[kFLAGS.URTA_KIDS_MALES] + flags[kFLAGS.URTA_KIDS_FEMALES] + flags[kFLAGS.URTA_KIDS_HERMS] > 0) awardAchievement("Urta's True Lover", kACHIEVEMENTS.GENERAL_URTA_TRUE_LOVER);
	if (flags[kFLAGS.CORRUPTED_MARAE_KILLED] > 0) awardAchievement("Godslayer", kACHIEVEMENTS.GENERAL_GODSLAYER);
	if (followersCount() >= 7) awardAchievement("Follow the Leader", kACHIEVEMENTS.GENERAL_FOLLOW_THE_LEADER);
	if (loversCount() >= 8) awardAchievement("Gotta Love 'Em All", kACHIEVEMENTS.GENERAL_GOTTA_LOVE_THEM_ALL);
	if (slavesCount() >= 4) awardAchievement("Meet Your " + player.mf("Master", "Mistress") , kACHIEVEMENTS.GENERAL_MEET_YOUR_MASTER);
	if (followersCount() + loversCount() + slavesCount() >= 19) awardAchievement("All Your People are Belong to Me", kACHIEVEMENTS.GENERAL_ALL_UR_PPLZ_R_BLNG_2_ME);
	if (flags[kFLAGS.MANSION_VISITED] >= 3) awardAchievement("Freeloader", kACHIEVEMENTS.GENERAL_FREELOADER);
	if (player.perks.length >= 20) awardAchievement("Perky", kACHIEVEMENTS.GENERAL_PERKY);
	if (player.perks.length >= 35) awardAchievement("Super Perky", kACHIEVEMENTS.GENERAL_SUPER_PERKY);
	if (player.perks.length >= 50) awardAchievement("Ultra Perky", kACHIEVEMENTS.GENERAL_ULTRA_PERKY);
	if (player.str >= 50 && player.tou >= 50 && player.spe >= 50 && player.inte >= 50) awardAchievement("Jack of All Trades", kACHIEVEMENTS.GENERAL_STATS_50);
	if (player.str >= 100 && player.tou >= 100 && player.spe >= 100 && player.inte >= 100) awardAchievement("Incredible Stats", kACHIEVEMENTS.GENERAL_STATS_100);
	if (flags[kFLAGS.ACHIEVEMENT_PROGRESS_SCHIZOPHRENIA] >= 4) awardAchievement("Schizophrenic", kACHIEVEMENTS.GENERAL_SCHIZO);
	if (flags[kFLAGS.ACHIEVEMENT_PROGRESS_CLEAN_SLATE] >= 2) awardAchievement("Clean Slate", kACHIEVEMENTS.GENERAL_CLEAN_SLATE);
	if (flags[kFLAGS.ACHIEVEMENT_PROGRESS_IM_NO_LUMBERJACK] >= 100) awardAchievement("I'm No Lumberjack", kACHIEVEMENTS.GENERAL_IM_NO_LUMBERJACK);
	if (flags[kFLAGS.ACHIEVEMENT_PROGRESS_DEFORESTER] >= 100) awardAchievement("Deforester", kACHIEVEMENTS.GENERAL_DEFORESTER);
	if (flags[kFLAGS.ACHIEVEMENT_PROGRESS_HAMMER_TIME] >= 300) awardAchievement("Hammer Time", kACHIEVEMENTS.GENERAL_HAMMER_TIME);
	if (flags[kFLAGS.ACHIEVEMENT_PROGRESS_SCAVENGER] >= 200) awardAchievement("Nail Scavenger", kACHIEVEMENTS.GENERAL_NAIL_SCAVENGER);
	if (flags[kFLAGS.ACHIEVEMENT_PROGRESS_YABBA_DABBA_DOO] >= 100) awardAchievement("Yabba Dabba Doo", kACHIEVEMENTS.GENERAL_YABBA_DABBA_DOO);
	if (flags[kFLAGS.ACHIEVEMENT_PROGRESS_ANTWORKS] >= 200) awardAchievement("AntWorks", kACHIEVEMENTS.GENERAL_ANTWORKS);
	if (flags[kFLAGS.CAMP_CABIN_FURNITURE_BED] >= 1 && flags[kFLAGS.CAMP_CABIN_FURNITURE_NIGHTSTAND] >= 1 && flags[kFLAGS.CAMP_CABIN_FURNITURE_DRESSER] >= 1 && flags[kFLAGS.CAMP_CABIN_FURNITURE_TABLE] >= 1 && flags[kFLAGS.CAMP_CABIN_FURNITURE_CHAIR1] >= 1 && flags[kFLAGS.CAMP_CABIN_FURNITURE_CHAIR2] >= 1 && flags[kFLAGS.CAMP_CABIN_FURNITURE_BOOKSHELF] >= 1 && flags[kFLAGS.CAMP_CABIN_FURNITURE_DESK] >= 1 && flags[kFLAGS.CAMP_CABIN_FURNITURE_DESKCHAIR] >= 1)
		awardAchievement("Home Sweet Home", kACHIEVEMENTS.GENERAL_HOME_SWEET_HOME);
	if (flags[kFLAGS.CAMP_WALL_GATE] > 0) awardAchievement("Make Mareth Great Again", kACHIEVEMENTS.GENERAL_MAKE_MARETH_GREAT_AGAIN);
	if (flags[kFLAGS.CAMP_WALL_STATUES] >= 100) awardAchievement("Terracotta Impy", kACHIEVEMENTS.GENERAL_TERRACOTTA_IMPY);
	if (Math.ceil(player.tallness) >= 132) awardAchievement("Up to Eleven", kACHIEVEMENTS.GENERAL_UP_TO_11);
	if (player.hasStatusEffect(StatusEffects.PureCampJojo)) awardAchievement("Up to Eleven", kACHIEVEMENTS.GENERAL_JOJOS_BIZARRE_ADVENTURE);
	//Check how many NPCs are dedicked
var  NPCsDedicked: number = 0;
	if (flags[kFLAGS.IZMA_NO_COCK] > 0) NPCsDedicked++;
	if (flags[kFLAGS.CERAPH_HIDING_DICK] > 0) NPCsDedicked++;
	if (flags[kFLAGS.RUBI_ADMITTED_GENDER] > 0 && flags[kFLAGS.RUBI_COCK_SIZE] <= 0) NPCsDedicked++;
	if (flags[kFLAGS.BENOIT_STATUS] == 1 || flags[kFLAGS.BENOIT_STATUS] == 2) NPCsDedicked++;
	if (flags[kFLAGS.ARIAN_HEALTH] > 0 && flags[kFLAGS.ARIAN_COCK_SIZE] <= 0) NPCsDedicked++;
	if (flags[kFLAGS.KATHERINE_UNLOCKED] > 0 && flags[kFLAGS.KATHERINE_DICK_COUNT] <= 0) NPCsDedicked++;
	if (flags[kFLAGS.MET_KITSUNES] > 0 && flags[kFLAGS.redheadIsFuta] == 0) NPCsDedicked++;
	if (flags[kFLAGS.KELT_BREAK_LEVEL] == 4) NPCsDedicked++;
	if (NPCsDedicked >= 3) awardAchievement("Dick Banisher", kACHIEVEMENTS.GENERAL_DICK_BANISHER);
	if (NPCsDedicked >= 7) awardAchievement("You Bastard!", kACHIEVEMENTS.GENERAL_YOU_BASTARD); //take that, dedickers!
}

}

