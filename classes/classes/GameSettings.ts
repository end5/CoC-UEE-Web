	/**
	 * ...
	 * @author ...
	 */
	export class GameSettings extends BaseContent
	{
		private static  _charviewEnabled: boolean = false;
		
		private  lastDisplayedPane:SettingPane;
		private  initializedPanes: boolean = false;
		
		private  panes: any[] = [];
		
		private static  PANES_CONFIG: any[] = [
			["settingPaneGameplay", "Gameplay Settings", "You can adjust gameplay experience such as game difficulty and NPC standards."], 
			["settingPaneInterface", "Interface Settings", "You can customize aspects of the interface to your liking."], 
			["settingPaneFetish", "Fetish Settings", "You can turn on or off weird and extreme fetishes."]
		];
		
		public  GameSettings() {}

		public static  get charviewEnabled(): boolean { return _charviewEnabled; }
		public static  set charviewEnabled(newValue: boolean): void { _charviewEnabled = newValue; }
		
		public  configurePanes(): void {
			//Gameplay Settings
			for (var i: number = 0; i < PANES_CONFIG.length; i++) {
			var  pane:SettingPane = new SettingPane(getGame().mainView.mainText.x, getGame().mainView.mainText.y, getGame().mainView.mainText.width + 16, getGame().mainView.mainText.height);
				pane.name = PANES_CONFIG[i][0];
			var  hl:TextField = pane.addHelpLabel();
				hl.htmlText = kGAMECLASS.formatHeader(PANES_CONFIG[i][1]) + PANES_CONFIG[i][2] + "\n\n";
				setOrUpdateSettings(pane);
				panes.push(pane);
			}
			//All done!
			initializedPanes = true;
		}

		private  setOrUpdateSettings(pane:SettingPane): void {
			if (pane.name == PANES_CONFIG[0][0]) { //Gameplay
				pane.addOrUpdateToggleSettings("Game Difficulty", [
					["Choose", difficultySelectionMenu, getDifficultyText(), false],
					"overridesLabel"
				]);
				pane.addOrUpdateToggleSettings("Debug Mode", [
					["ON", createCallBackFunction(toggleDebug, true), "Items will not be consumed by use, fleeing always succeeds, and bad-ends can be ignored.", debug == true],
					["OFF", createCallBackFunction(toggleDebug, false), "Items consumption will occur as normal.", debug == false]
				]);
				pane.addOrUpdateToggleSettings("Silly Mode", [
					["ON", createCallBackFunction(toggleFlagSetting, kFLAGS.SILLY_MODE_ENABLE_FLAG, true), "Crazy, nonsensical, and possibly hilarious things may occur.", flags[kFLAGS.SILLY_MODE_ENABLE_FLAG] == true],
					["OFF", createCallBackFunction(toggleFlagSetting, kFLAGS.SILLY_MODE_ENABLE_FLAG, false), "You're an incorrigible stick-in-the-mud with no sense of humor.", flags[kFLAGS.SILLY_MODE_ENABLE_FLAG] == false]
				]);
				pane.addOrUpdateToggleSettings("Low Standards", [
					["ON", createCallBackFunction(toggleFlagSetting, kFLAGS.LOW_STANDARDS_FOR_ALL, true), "NPCs ignore body type preferences. Not gender preferences though; you still need the right hole.", flags[kFLAGS.LOW_STANDARDS_FOR_ALL] == true],
					["OFF", createCallBackFunction(toggleFlagSetting, kFLAGS.LOW_STANDARDS_FOR_ALL, false), "NPCs have body-type preferences.", flags[kFLAGS.LOW_STANDARDS_FOR_ALL] == false]
				]);
				pane.addOrUpdateToggleSettings("Hyper Happy", [
					["ON", createCallBackFunction(toggleFlagSetting, kFLAGS.HYPER_HAPPY, true), "Only reducto and humus shrink endowments. Incubus draft doesn't affect breasts, and succubi milk doesn't affect cocks.", flags[kFLAGS.HYPER_HAPPY] == true],
					["OFF", createCallBackFunction(toggleFlagSetting, kFLAGS.HYPER_HAPPY, false), "Male enhancement potions shrink female endowments, and vice versa.", flags[kFLAGS.HYPER_HAPPY] == false]
				]);
				pane.addOrUpdateToggleSettings("Automatic Leveling", [
					["ON", createCallBackFunction(toggleFlagSetting, kFLAGS.AUTO_LEVEL, true), "Leveling up is done automatically once you accumulate enough experience.", flags[kFLAGS.AUTO_LEVEL] == true],
					["OFF", createCallBackFunction(toggleFlagSetting, kFLAGS.AUTO_LEVEL, false), "Leveling up is done manually by pressing 'Level Up' button.", flags[kFLAGS.AUTO_LEVEL] == false]
				]);
				pane.addOrUpdateToggleSettings("SFW Mode", [
					["ON", createCallBackFunction(toggleFlagSetting, kFLAGS.SFW_MODE, true), "SFW mode is enabled. You won't see sex scenes nor will you get raped.", flags[kFLAGS.SFW_MODE] == true],
					["OFF", createCallBackFunction(toggleFlagSetting, kFLAGS.SFW_MODE, false), "SFW mode is disabled. You'll see sex scenes.", flags[kFLAGS.SFW_MODE] == false]
				]);
				pane.addOrUpdateToggleSettings("Prison", [
					["ON", createCallBackFunction(toggleFlagSetting, kFLAGS.PRISON_ENABLED, true), "The prison can be accessed.\nWARNING: The prison is very buggy and may break your game. Enter it at your own risk!", flags[kFLAGS.PRISON_ENABLED] == true],
					["OFF", createCallBackFunction(toggleFlagSetting, kFLAGS.PRISON_ENABLED, false), "The prison cannot be accessed.", flags[kFLAGS.PRISON_ENABLED] == false]
				]);
				pane.addOrUpdateToggleSettings("Enable Survival", [
					["Enable", enableSurvivalPrompt, "Survival mode is already enabled.", flags[kFLAGS.HUNGER_ENABLED] >= 0.5]
				]);
				pane.addOrUpdateToggleSettings("Enable Realistic", [
					["Enable", enableRealisticPrompt, "Realistic mode is already enabled.", flags[kFLAGS.HUNGER_ENABLED] >= 1]
				]);
				pane.update();
			}
			else if (pane.name == PANES_CONFIG[1][0]) { //Interface
				pane.addOrUpdateToggleSettings("Main Background", [
					["Choose", menuMainBackground, "", false]
				]);
				pane.addOrUpdateToggleSettings("Text Background", [
					["Choose", menuTextBackground, "", false]
				]);
				pane.addOrUpdateToggleSettings("Font Size", [
					["Adjust", fontSettingsMenu, "<b>Font Size: " + (flags[kFLAGS.CUSTOM_FONT_SIZE] || 20) + "</b>", false],
					"overridesLabel"
				]);
				pane.addOrUpdateToggleSettings("Sidebar Font", [
					["New", createCallBackFunction(toggleFlagSetting, kFLAGS.USE_OLD_FONT, false), "Palatino Linotype will be used. This is the current font.", flags[kFLAGS.USE_OLD_FONT] == false],
					["Old", createCallBackFunction(toggleFlagSetting, kFLAGS.USE_OLD_FONT, true), "Lucida Sans Typewriter will be used. This is the old font.", flags[kFLAGS.USE_OLD_FONT] == true]
				]);
				pane.addOrUpdateToggleSettings("Sprites", [
					["Off", createCallBackFunction(toggleFlagSetting, kFLAGS.SHOW_SPRITES_FLAG, 0), "There are only words. Nothing else.", flags[kFLAGS.SHOW_SPRITES_FLAG] == 0],
					["Old", createCallBackFunction(toggleFlagSetting, kFLAGS.SHOW_SPRITES_FLAG, 1), "You like to look at pretty pictures. Old, 8-bit sprites will be shown.", flags[kFLAGS.SHOW_SPRITES_FLAG] == 1],
					["New", createCallBackFunction(toggleFlagSetting, kFLAGS.SHOW_SPRITES_FLAG, 2), "You like to look at pretty pictures. New, 16-bit sprites will be shown.", flags[kFLAGS.SHOW_SPRITES_FLAG] == 2]
				]);
				pane.addOrUpdateToggleSettings("Character Appearance Sprite", [
					["ON", createCallBackFunction(toggleCharView, true), "Sprite for your character appearance is enabled.", charviewEnabled == true],
					["OFF", createCallBackFunction(toggleCharView, false), "Sprite for your character appearance is disabled.", charviewEnabled == false]
				]);
				pane.addOrUpdateToggleSettings("Image Pack", [
					["ON", createCallBackFunction(toggleFlagSetting, kFLAGS.IMAGEPACK_ENABLED, true), "Image pack is currently enabled.", flags[kFLAGS.IMAGEPACK_ENABLED] == true],
					["OFF", createCallBackFunction(toggleFlagSetting, kFLAGS.IMAGEPACK_ENABLED, false), "Images from image pack won't be shown.", flags[kFLAGS.IMAGEPACK_ENABLED] == false]
				]);
				pane.addOrUpdateToggleSettings("Animate Stats Bars", [
					["ON", createCallBackFunction(toggleFlagSetting, kFLAGS.ANIMATE_STATS_BARS, true), "The stats bars and numbers will be animated if changed.", flags[kFLAGS.ANIMATE_STATS_BARS] == true],
					["OFF", createCallBackFunction(toggleFlagSetting, kFLAGS.ANIMATE_STATS_BARS, false), "The stats will not animate. Basically classic.", flags[kFLAGS.ANIMATE_STATS_BARS] == false]
				]);
				pane.addOrUpdateToggleSettings("Show Enemy Stats Bars", [
					["ON", createCallBackFunction(toggleFlagSetting, kFLAGS.ENEMY_STATS_BARS_ENABLED, true), "Opponent's stat bars will be displayed in combat.", flags[kFLAGS.ENEMY_STATS_BARS_ENABLED] == true],
					["OFF", createCallBackFunction(toggleFlagSetting, kFLAGS.ENEMY_STATS_BARS_ENABLED, false), "Opponent's stat bars will not be displayed in combat, and classic enemy info display will be used.", flags[kFLAGS.ENEMY_STATS_BARS_ENABLED] == false]
				]);
				pane.addOrUpdateToggleSettings("Time Format", [
					["12-hour", createCallBackFunction(toggleFlagSetting, kFLAGS.USE_12_HOURS, true), "Time will be shown in 12-hour format. (AM/PM)", flags[kFLAGS.USE_12_HOURS] == true],
					["24-hour", createCallBackFunction(toggleFlagSetting, kFLAGS.USE_12_HOURS, false), "Time will be shown in 24-hour format.", flags[kFLAGS.USE_12_HOURS] == false]
				]);
				pane.addOrUpdateToggleSettings("Measurements", [
					["Metric", createCallBackFunction(toggleFlagSetting, kFLAGS.USE_METRICS, true), "Various measurements will be shown in metrics. (Centimeters, meters)", flags[kFLAGS.USE_METRICS] == true],
					["Imperial", createCallBackFunction(toggleFlagSetting, kFLAGS.USE_METRICS, false), "Various measurements will be shown in imperial units. (Inches, feet)", flags[kFLAGS.USE_METRICS] == false]
				]);
				pane.addOrUpdateToggleSettings("Quicksave Confirmation", [
					["ON", createCallBackFunction(toggleFlagSetting, kFLAGS.DISABLE_QUICKSAVE_CONFIRM, false), "Quicksave confirmation dialog is enabled.", flags[kFLAGS.DISABLE_QUICKSAVE_CONFIRM] == false],
					["OFF", createCallBackFunction(toggleFlagSetting, kFLAGS.DISABLE_QUICKSAVE_CONFIRM, true), "Quicksave confirmation dialog is disabled.", flags[kFLAGS.DISABLE_QUICKSAVE_CONFIRM] == true]
				]);
				pane.addOrUpdateToggleSettings("Quickload Confirmation", [
					["ON", createCallBackFunction(toggleFlagSetting, kFLAGS.DISABLE_QUICKLOAD_CONFIRM, false), "Quickload confirmation dialog is enabled.", flags[kFLAGS.DISABLE_QUICKLOAD_CONFIRM] == false],
					["OFF", createCallBackFunction(toggleFlagSetting, kFLAGS.DISABLE_QUICKLOAD_CONFIRM, true), "Quickload confirmation dialog is disabled.", flags[kFLAGS.DISABLE_QUICKLOAD_CONFIRM] == true]
				]);
				pane.update();
			}
			else if (pane.name == PANES_CONFIG[2][0]) { //Fetishes
				pane.addOrUpdateToggleSettings("Watersports (Urine)", [
					["ON", createCallBackFunction(toggleFlagSetting, kFLAGS.WATERSPORTS_ENABLED, true), "Watersports are enabled. You kinky person.", flags[kFLAGS.WATERSPORTS_ENABLED] == true],
					["OFF", createCallBackFunction(toggleFlagSetting, kFLAGS.WATERSPORTS_ENABLED, false), "You won't see watersports scenes.", flags[kFLAGS.WATERSPORTS_ENABLED] == false]
				]);
				pane.addOrUpdateToggleSettings("Addictions", [
					["ON", createCallBackFunction(toggleFlagSetting, kFLAGS.ADDICTIONS_ENABLED, true), "You can get addicted to certain substances such as Marble's Milk and Minotaur Cum.", flags[kFLAGS.ADDICTIONS_ENABLED] == true],
					["OFF", createCallBackFunction(toggleFlagSetting, kFLAGS.ADDICTIONS_ENABLED, false), "You cannot get addicted at all. Doesn't remove existing addictions, you'll need to cure them first.", flags[kFLAGS.ADDICTIONS_ENABLED] == false]
				]);
				pane.addOrUpdateToggleSettings("Worms", [
					["ON", createCallBackFunction(setWorms, true, false), "You have chosen to encounter worms as you find the mountains.", player.hasStatusEffect(StatusEffects.WormsOn) && !player.hasStatusEffect(StatusEffects.WormsHalf)],
					["ON (Half)", createCallBackFunction(setWorms, true, true), "You have chosen to encounter worms as you find the mountains, albeit at reduced rate.", player.hasStatusEffect(StatusEffects.WormsHalf)],
					["OFF", createCallBackFunction(setWorms, false, false), "You have chosen not to encounter worms.", player.hasStatusEffect(StatusEffects.WormsOff)],
				]);
				pane.update();
			}
		}
		
		public  enterSettings(): void {
			kGAMECLASS.saves.savePermObject(false);
			getGame().mainMenu.hideMainMenu();
			hideMenus();
			if (!initializedPanes) configurePanes();
			clearOutput();
			disableHardcoreCheatSettings();
			displaySettingPane(panes[0]);
			setButtons();
		}
		public  exitSettings(): void {
			kGAMECLASS.saves.savePermObject(false);
			hideSettingPane();
			getGame().mainMenu.mainMenu();
		}
		
		private  setButtons(): void {
			menu();
			addButton(0, "Gameplay", displaySettingPane, panes[0]);
			addButton(1, "Interface", displaySettingPane, panes[1]);
			addButton(2, "Fetishes", displaySettingPane, panes[2]);
			addButton(4, "Controls", displayControls);
			addButton(10, "Debug Info", enterDebugPane);
			addButton(14, "Back", exitSettings);
			for (var i: number = 0; i < panes.length; i++) {
				if (lastDisplayedPane == panes[i]) {
					addButtonDisabled(i, mainView.bottomButtons[i].labelText);
				}
			}
		}
		
		private  displaySettingPane(pane:SettingPane): void {
			hideSettingPane();
			lastDisplayedPane = pane;
			mainView.mainText.visible = false;
			mainView.addChild(pane);
			pane.update();
			setButtons();
		}
		private  hideSettingPane(): void {
			mainView.mainText.visible = true;
			if (lastDisplayedPane != undefined && lastDisplayedPane.parent != undefined) lastDisplayedPane.parent.removeChild(lastDisplayedPane);
		}
		
		private  enterDebugPane(): void {
			hideSettingPane();
			kGAMECLASS.debugPane();
		}
		
		//------------
		// GAMEPLAY
		//------------
		private  getDifficultyText(): string {
		var  text: string = "<b>Difficulty: ";
			switch(flags[kFLAGS.GAME_DIFFICULTY]) {
				case 0:
					if (flags[kFLAGS.EASY_MODE_ENABLE_FLAG]) text += "<font color=\"#008000\">Easy</font></b>\n<font size=\"14\">Combat is easier and bad-ends can be ignored.</font>";
					else text += "<font color=\"#808000\">Normal</font></b>\n<font size=\"14\">No opponent stats modifiers. You can resume from bad-ends with penalties.</font>";
					break;
				case 1:
					text += "<font color=\"#800000\">Hard</font></b>\n<font size=\"14\">Opponent has 25% more HP and does 15% more damage. Bad-ends can ruin your game.</font>";
					break;
				case 2:
					text += "<font color=\"#C00000\">Nightmare</font></b>\n<font size=\"14\">Opponent has 50% more HP and does 30% more damage.</font>";
					break;
				case 3:
					text += "<font color=\"#FF0000\">Extreme</font></b>\n<font size=\"14\">Opponent has 100% more HP and does more 50% damage.</font>";
					break;
				default:
					text += "Something derped with the coding!";
			}
			return text;
		}
		public  disableHardcoreCheatSettings(): void {
			if (flags[kFLAGS.HARDCORE_MODE] > 0) {
				outputText("<font color=\"#ff0000\">Hardcore mode is enabled. Cheats are disabled.</font>\n\n");
				debug = false;
				flags[kFLAGS.EASY_MODE_ENABLE_FLAG] = 0;
				flags[kFLAGS.HYPER_HAPPY] = 0;
				flags[kFLAGS.LOW_STANDARDS_FOR_ALL] = 0;
			}
			if (flags[kFLAGS.GRIMDARK_MODE] > 0) {
				debug = false;
				flags[kFLAGS.EASY_MODE_ENABLE_FLAG] = 0;
				flags[kFLAGS.GAME_DIFFICULTY] = 3;
			}
		}

		private  difficultySelectionMenu(): void {
			hideSettingPane();
			clearOutput();
			outputText("You can choose a difficulty to set how hard battles will be.\n");
			outputText("\n<b>Easy:</b> -50% damage, can ignore bad-ends.");
			outputText("\n<b>Normal:</b> No stats changes.");
			outputText("\n<b>Hard:</b> +25% HP, +15% damage.");
			outputText("\n<b>Nightmare:</b> +50% HP, +30% damage.");
			outputText("\n<b>Extreme:</b> +100% HP, +50% damage.");
			menu();
			addButton(0, "Easy", chooseDifficulty, -1);
			addButton(1, "Normal", chooseDifficulty, 0);
			addButton(2, "Hard", chooseDifficulty, 1);
			addButton(3, "Nightmare", chooseDifficulty, 2);
			addButton(4, "EXTREME", chooseDifficulty, 3);
			addButton(14, "Back", displaySettingPane, lastDisplayedPane);
		}
		private  chooseDifficulty(difficulty: number = 0): void {
			if (difficulty < 0) {
				flags[kFLAGS.EASY_MODE_ENABLE_FLAG] = -difficulty;
				flags[kFLAGS.GAME_DIFFICULTY] = 0;
			}
			else {
				flags[kFLAGS.EASY_MODE_ENABLE_FLAG] = 0;
				flags[kFLAGS.GAME_DIFFICULTY] = difficulty;
			}
			setOrUpdateSettings(lastDisplayedPane);
			displaySettingPane(lastDisplayedPane);
		}

		private  setWorms(enabled: boolean, half: boolean): void {
			//Clear status effects
			if (player.hasStatusEffect(StatusEffects.WormsOn)) player.removeStatusEffect(StatusEffects.WormsOn);
			if (player.hasStatusEffect(StatusEffects.WormsHalf)) player.removeStatusEffect(StatusEffects.WormsHalf);
			if (player.hasStatusEffect(StatusEffects.WormsOff)) player.removeStatusEffect(StatusEffects.WormsOff);
			//Set status effects
			if (enabled) {
				player.createStatusEffect(StatusEffects.WormsOn, 0, 0, 0, 0);
				if (half) player.createStatusEffect(StatusEffects.WormsHalf, 0, 0, 0, 0);
			}
			else {
				player.createStatusEffect(StatusEffects.WormsOff, 0, 0, 0, 0);
			}
			setOrUpdateSettings(lastDisplayedPane);
		}

		//Survival Mode
		public  enableSurvivalPrompt(): void {
			hideSettingPane();
			clearOutput();
			outputText("Are you sure you want to enable Survival Mode?\n\n");
			outputText("You will NOT be able to turn it off! (Unless you reload immediately.)");
			doYesNo(enableSurvivalForReal, createCallBackFunction(displaySettingPane, lastDisplayedPane));
		}
		public  enableSurvivalForReal(): void {
			clearOutput();
			outputText("Survival mode is now enabled.");
			player.hunger = 80;
			flags[kFLAGS.HUNGER_ENABLED] = 0.5;
			doNext(createCallBackFunction(displaySettingPane, lastDisplayedPane));
		}

		//Realistic Mode
		public  enableRealisticPrompt(): void {
			hideSettingPane();
			clearOutput();
			outputText("Are you sure you want to enable Realistic Mode?\n\n");
			outputText("You will NOT be able to turn it off! (Unless you reload immediately.)");
			doYesNo(enableRealisticForReal, createCallBackFunction(displaySettingPane, lastDisplayedPane));
		}
		public  enableRealisticForReal(): void {
			clearOutput();
			outputText("Realistic mode is now enabled.")
			flags[kFLAGS.HUNGER_ENABLED] = 1;
			doNext(createCallBackFunction(displaySettingPane, lastDisplayedPane));
		}

		//------------
		// INTERFACE
		//------------
		public  menuMainBackground(): void {
			hideSettingPane();
			clearOutput();
			outputText("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae turpis nec ipsum fermentum pellentesque. Nam consectetur euismod diam. Proin vitae neque in massa tempor suscipit eget at mi. In hac habitasse platea dictumst. Morbi laoreet erat et sem hendrerit mattis. Cras in mauris vestibulum nunc fringilla condimentum. Nam sed arcu non ipsum luctus dignissim a eget ante. Curabitur dapibus neque at elit iaculis, ac aliquam libero dapibus. Sed non lorem diam. In pretium vehicula facilisis. In euismod imperdiet felis, vitae ultrices magna cursus at. Vivamus orci urna, fringilla ac elementum eu, accumsan vel nunc. Donec faucibus dictum erat convallis efficitur. Maecenas cursus suscipit magna, id dapibus augue posuere ut.\n\n");
			menu();
			addButton(0, "Map (Default)", setMainBackground, 0);
			addButton(1, "Parchment", setMainBackground, 1);
			addButton(2, "Marble", setMainBackground, 2);
			addButton(3, "Obsidian", setMainBackground, 3);
			addButton(4, "Night Mode", setMainBackground, 4, undefined, undefined, "Good if you're playing at night to make the game easier on your eyes.");
			if (flags[kFLAGS.GRIMDARK_BACKGROUND_UNLOCKED] > 0) addButton(5, "Grimdark", setMainBackground, 9);
			else addButtonDisabled(5, "Grimdark", "Defeat Lethice once in Grimdark mode to unlock this background!");
			addButton(14, "Back", displaySettingPane, lastDisplayedPane);
		}
		public  setMainBackground(type: number): void {
			flags[kFLAGS.BACKGROUND_STYLE]           = type;
			mainView.background.bitmapClass          = MainView.Backgrounds[flags[kFLAGS.BACKGROUND_STYLE]];
			mainView.statsView.setBackground(StatsView.SidebarBackgrounds[flags[kFLAGS.BACKGROUND_STYLE]]);
			menuMainBackground();
		}
		
		public  menuTextBackground(): void {
			hideSettingPane();
			clearOutput();
			outputText("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae turpis nec ipsum fermentum pellentesque. Nam consectetur euismod diam. Proin vitae neque in massa tempor suscipit eget at mi. In hac habitasse platea dictumst. Morbi laoreet erat et sem hendrerit mattis. Cras in mauris vestibulum nunc fringilla condimentum. Nam sed arcu non ipsum luctus dignissim a eget ante. Curabitur dapibus neque at elit iaculis, ac aliquam libero dapibus. Sed non lorem diam. In pretium vehicula facilisis. In euismod imperdiet felis, vitae ultrices magna cursus at. Vivamus orci urna, fringilla ac elementum eu, accumsan vel nunc. Donec faucibus dictum erat convallis efficitur. Maecenas cursus suscipit magna, id dapibus augue posuere ut.\n\n");
			menu();
			addButton(0, "Normal", chooseTextBackground, 0);
			addButton(1, "White", chooseTextBackground, 1);
			addButton(2, "Tan", chooseTextBackground, 2);
			addButton(3, "Clear", chooseTextBackground, -1);
			addButton(4, "Back", displaySettingPane, lastDisplayedPane);
		}
		private  chooseTextBackground(type: number): void {
			flags[kFLAGS.TEXT_BACKGROUND_STYLE] = type;
			mainView.setTextBackground(flags[kFLAGS.TEXT_BACKGROUND_STYLE]);
		}

		//Needed for keys
		public  cycleBackground(): void {
			flags[kFLAGS.TEXT_BACKGROUND_STYLE]++;
			if (flags[kFLAGS.TEXT_BACKGROUND_STYLE] > 2) {
				flags[kFLAGS.TEXT_BACKGROUND_STYLE] = 0;
			}
			mainView.setTextBackground(flags[kFLAGS.TEXT_BACKGROUND_STYLE]);
		}
		
		public  cycleQuality(): void {
			if (mainView.stage.quality == StageQuality.LOW) mainView.stage.quality = StageQuality.MEDIUM;
			else if (mainView.stage.quality == StageQuality.MEDIUM) mainView.stage.quality = StageQuality.HIGH;
			else if (mainView.stage.quality == StageQuality.HIGH) mainView.stage.quality = StageQuality.LOW;
		}

		public  toggleDebug(selection: boolean): void { 
			debug = selection;
			setOrUpdateSettings(lastDisplayedPane);
		}
		public  toggleCharView(selection: boolean): void { 
			charviewEnabled = selection;
			setOrUpdateSettings(lastDisplayedPane);
		}
		
		public  toggleFlagSetting(flag: number, selection: number): void { 
			flags[flag] = selection; 
			setOrUpdateSettings(lastDisplayedPane);
		}
		
		//------------
		// FONT SIZE
		//------------
		public  fontSettingsMenu(): void {
			hideSettingPane();
			clearOutput();
			outputText("Font size is currently set at " + (flags[kFLAGS.CUSTOM_FONT_SIZE] > 0 ? flags[kFLAGS.CUSTOM_FONT_SIZE] : 20) +  ".\n\n");
			outputText("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae turpis nec ipsum fermentum pellentesque. Nam consectetur euismod diam. Proin vitae neque in massa tempor suscipit eget at mi. In hac habitasse platea dictumst. Morbi laoreet erat et sem hendrerit mattis. Cras in mauris vestibulum nunc fringilla condimentum. Nam sed arcu non ipsum luctus dignissim a eget ante. Curabitur dapibus neque at elit iaculis, ac aliquam libero dapibus. Sed non lorem diam. In pretium vehicula facilisis. In euismod imperdiet felis, vitae ultrices magna cursus at. Vivamus orci urna, fringilla ac elementum eu, accumsan vel nunc. Donec faucibus dictum erat convallis efficitur. Maecenas cursus suscipit magna, id dapibus augue posuere ut.\n\n");
			menu();
			addButton(0, "Smaller Font", adjustFontSize, -1);
			addButton(1, "Larger Font", adjustFontSize, 1);
			addButton(2, "Reset Size", adjustFontSize, 0);
			addButton(4, "Back", displaySettingPane, lastDisplayedPane);
		}
		public  adjustFontSize(change: number): void {
		var  fmt:TextFormat = mainView.mainText.getTextFormat();
			if (fmt.size == undefined) fmt.size = 20;
			fmt.size = (fmt.size as Number) + change;
			if (change == 0) fmt.size = 20;
			if ((fmt.size as Number) < 14) fmt.size = 14;
			if ((fmt.size as Number) > 32) fmt.size = 32;
			mainView.mainText.setTextFormat(fmt);
			flags[kFLAGS.CUSTOM_FONT_SIZE] = fmt.size;
			setOrUpdateSettings(lastDisplayedPane);
			fontSettingsMenu();
		}

		//------------
		// CONTROLS
		//------------
		public  displayControls(): void {
			hideSettingPane();
			mainView.hideAllMenuButtons();
			getGame().inputManager.DisplayBindingPane();
			menu();
			addButton(0, "Reset Ctrls", resetControls);
			addButton(1, "Clear Ctrls", clearControls);
			addButton(4, "Back", hideControls);
		}
		public  hideControls(): void {
			getGame().inputManager.HideBindingPane();
			displaySettingPane(lastDisplayedPane);
		}

		public  resetControls(): void {
			getGame().inputManager.HideBindingPane();
			clearOutput();
			outputText("Are you sure you want to reset all of the currently bound controls to their defaults?");
			doYesNo(resetControlsYes, displayControls);
		}
		public  resetControlsYes(): void {
			getGame().inputManager.ResetToDefaults();
			clearOutput();
			outputText("Controls have been reset to defaults!\n\n");
			doNext(displayControls);
		}

		public  clearControls(): void {
			getGame().inputManager.HideBindingPane();
			clearOutput();
			outputText("Are you sure you want to clear all of the currently bound controls?");
			doYesNo(clearControlsYes, displayControls);
		}
		public  clearControlsYes(): void {
			getGame().inputManager.ClearAllBinds();
			clearOutput();
			outputText("Controls have been cleared!");
			doNext(displayControls);
		}
	}

