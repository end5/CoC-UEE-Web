	
	export class Achievements extends BaseContent
	{
		public  achievementsEarned: number = 0;
		public  achievementsTotal: number = 0;
		
		public  Achievements() {}
		
		private  addAchievement(title: string, achievement: any, descLocked: string, descUnlocked: string = "", isShadow: boolean = false): void {
			//If not specified, default to the locked description.
			if (descUnlocked == "") descUnlocked = descLocked;
			if (isShadow && achievements[achievement] <= 0) return;
			//Set text if unlocked or not.
		var  stringToPut: string = "";
			stringToPut += "<li><b>" + title + ":</b> ";
			if (achievements[achievement] > 0) {
				stringToPut += "<font color=\"#008000\">Unlocked</font> - " + descUnlocked;
				achievementsEarned++;
			}
			else {
				stringToPut += "<font color=\"#800000\">Locked</font> - " + descLocked;
			}
			//Shadow flair? Add that.
			if (isShadow) {
				stringToPut += " - <font color=\"#660066\">Shadow Achievement</font>";
			}
			stringToPut += "</li>";
			outputText(stringToPut);
			achievementsTotal++;
		}
		
		private  titleAchievementSection(title: string): void {
			outputText("\n<b><u>" + title + "</u></b>\n");
		}
		
		public  achievementsScreen(): void {
			getGame().mainMenu.hideMainMenu();
			achievementsEarned = 0;
			achievementsTotal = 0;
			clearOutput();
			getGame().displayHeader("Achievements");
			outputText("Note: Some achievements are contradictory and may require multiple playthroughs to obtain every achievement.\n");
			titleAchievementSection("Storyline"); //4 achievements
			addAchievement("Newcomer", kACHIEVEMENTS.STORY_NEWCOMER, "Enter the realm of Mareth.");
			addAchievement("Marae's Savior", kACHIEVEMENTS.STORY_MARAE_SAVIOR, "Complete Marae's quest.");
			addAchievement("Revenge at Last", kACHIEVEMENTS.STORY_ZETAZ_REVENGE, "Defeat Zetaz and obtain the map.");
			addAchievement("Demon Slayer", kACHIEVEMENTS.STORY_FINALBOSS, "Defeat Lethice.");
			
			titleAchievementSection("Zones"); //17/20 achievements
			addAchievement("Explorer", kACHIEVEMENTS.ZONE_EXPLORER, "Discover every zone.");
			addAchievement("Sightseer", kACHIEVEMENTS.ZONE_SIGHTSEER, "Discover every place.");
			addAchievement("Where am I?", kACHIEVEMENTS.ZONE_WHERE_AM_I, "Explore for the first time.");
			addAchievement("Forest Ranger", kACHIEVEMENTS.ZONE_FOREST_RANGER, "Explore the forest 100 times.");
			addAchievement("Vacationer", kACHIEVEMENTS.ZONE_VACATIONER, "Explore the lake 100 times.");
			addAchievement("Dehydrated", kACHIEVEMENTS.ZONE_DEHYDRATED, "Explore the desert 100 times.");
			addAchievement("Mountaineer", kACHIEVEMENTS.ZONE_MOUNTAINEER, "Explore the mountains 100 times.");
			addAchievement("Rolling Hills", kACHIEVEMENTS.ZONE_ROLLING_HILLS, "Explore the plains 100 times.");
			addAchievement("Wet All Over", kACHIEVEMENTS.ZONE_WET_ALL_OVER, "Explore the swamp 100 times.");
			addAchievement("We Need to Go Deeper", kACHIEVEMENTS.ZONE_WE_NEED_TO_GO_DEEPER, "Explore the deepwoods 100 times.");
			addAchievement("Light-headed", kACHIEVEMENTS.ZONE_LIGHT_HEADED, "Explore the high mountains 100 times.");
			addAchievement("All Murky", kACHIEVEMENTS.ZONE_ALL_MURKY, "Explore the bog 100 times.");
			addAchievement("Frozen", kACHIEVEMENTS.ZONE_FROZEN, "Explore the glacial rift 100 times.");
			//addAchievement("Roasted", kACHIEVEMENTS.ZONE_ROASTED, "Explore the volcanic crag 100 times.");
			addAchievement("Archaeologist", kACHIEVEMENTS.ZONE_ARCHAEOLOGIST, "Explore the town ruins 15 times.");
			addAchievement("Farmer", kACHIEVEMENTS.ZONE_FARMER, "Visit Whitney's farm 30 times.");
			addAchievement("Sea-Legs", kACHIEVEMENTS.ZONE_SEA_LEGS, "Use the lake boat 15 times.");
			
			titleAchievementSection("Levels"); //10 achievements
			addAchievement("Level up!", kACHIEVEMENTS.LEVEL_LEVEL_UP, "Get to level 2.");
			addAchievement("Novice", kACHIEVEMENTS.LEVEL_NOVICE, "Get to level 5.");
			addAchievement("Apprentice", kACHIEVEMENTS.LEVEL_APPRENTICE, "Get to level 10.");
			addAchievement("Journeyman", kACHIEVEMENTS.LEVEL_JOURNEYMAN, "Get to level 15.");
			addAchievement("Expert", kACHIEVEMENTS.LEVEL_EXPERT, "Get to level 20.");
			addAchievement("Master", kACHIEVEMENTS.LEVEL_MASTER, "Get to level 30.");
			addAchievement("Grandmaster", kACHIEVEMENTS.LEVEL_GRANDMASTER, "Get to level 45.");
			addAchievement("Illustrious", kACHIEVEMENTS.LEVEL_ILLUSTRIOUS, "Get to level 60.");
			addAchievement("Overlord", kACHIEVEMENTS.LEVEL_OVERLORD, "Get to level 90.");
			addAchievement("Are you a god?", kACHIEVEMENTS.LEVEL_ARE_YOU_A_GOD, "Get to the level cap of 120.", "Get to the level cap of 120. (Your powers would have surpassed Marae's by now.)", true);
			
			titleAchievementSection("Population"); //10 achievements
			addAchievement("My First Companion", kACHIEVEMENTS.POPULATION_FIRST, "Have a camp population of 2.");
			addAchievement("Hamlet", kACHIEVEMENTS.POPULATION_HAMLET, "Have a camp population of 5.");
			addAchievement("Village", kACHIEVEMENTS.POPULATION_VILLAGE, "Have a camp population of 10.");
			addAchievement("Town", kACHIEVEMENTS.POPULATION_TOWN, "Have a camp population of 25.");
			addAchievement("City", kACHIEVEMENTS.POPULATION_CITY, "Have a camp population of 100.");
			addAchievement("Metropolis", kACHIEVEMENTS.POPULATION_METROPOLIS, "Have a camp population of 250.");
			addAchievement("Megalopolis", kACHIEVEMENTS.POPULATION_MEGALOPOLIS, "Have a camp population of 500.");
			addAchievement("City-State", kACHIEVEMENTS.POPULATION_CITY_STATE, "Have a camp population of 1,000.", "", true);
			addAchievement("Kingdom", kACHIEVEMENTS.POPULATION_KINGDOM, "Have a camp population of 2,500.", "", true);
			addAchievement("Empire", kACHIEVEMENTS.POPULATION_EMPIRE, "Have a camp population of 5,000.", "", true);
			
			titleAchievementSection("Time"); //9/10 achievements
			addAchievement("It's been a month", kACHIEVEMENTS.TIME_MONTH, "Get to day 30.");
			addAchievement("Half-year", kACHIEVEMENTS.TIME_HALF_YEAR, "Get to day 180.");
			addAchievement("Annual", kACHIEVEMENTS.TIME_ANNUAL, "Get to day 365. (1 year)");
			addAchievement("Biennial", kACHIEVEMENTS.TIME_BIENNIAL, "Get to day 730. (2 years)");
			addAchievement("Triennial", kACHIEVEMENTS.TIME_TRIENNIAL, "Get to day 1,095. (3 years)");
			addAchievement("In for the long haul", kACHIEVEMENTS.TIME_LONG_HAUL, "Get to day 1,825. (5 years)");
			addAchievement("Decade", kACHIEVEMENTS.TIME_DECADE, "Get to day 3,650. (10 years)", "Get to day 3,650. (10 years! Okay, you can stop now.)", true);
			addAchievement("Century", kACHIEVEMENTS.TIME_CENTURY, "Get to day 36,500. (100 years)", "Get to day 36,500. (100 years! It's time to stop playing. Go outside. Please.)", true);
			addAchievement("Time Traveller", kACHIEVEMENTS.TIME_TRAVELLER, "Get to day 36,500+ by tampering with save", "", true);
			
			titleAchievementSection("Dungeons"); //10 achievements
			addAchievement("Delver", kACHIEVEMENTS.DUNGEON_DELVER, "Clear any dungeon.");
			addAchievement("Delver Apprentice", kACHIEVEMENTS.DUNGEON_DELVER, "Clear 3 dungeons.");
			addAchievement("Delver Master", kACHIEVEMENTS.DUNGEON_DELVER_MASTER, "Clear every dungeon in the game.");
			addAchievement("Shut Down Everything", kACHIEVEMENTS.DUNGEON_SHUT_DOWN_EVERYTHING, "Clear the Factory.");
			addAchievement("You're in Deep", kACHIEVEMENTS.DUNGEON_YOURE_IN_DEEP, "Fully clear the Deep Cave.");
			addAchievement("End of Reign", kACHIEVEMENTS.DUNGEON_END_OF_REIGN, "Fully clear the Lethice Stronghold.");
			addAchievement("Friend of the Sand Witches", kACHIEVEMENTS.DUNGEON_SAND_WITCH_FRIEND, "Fully clear the Desert Cave.");
			addAchievement("Fall of the Phoenix", kACHIEVEMENTS.DUNGEON_PHOENIX_FALL, "Clear the Tower of the Phoenix.");
			addAchievement("Accomplice", kACHIEVEMENTS.DUNGEON_ACCOMPLICE, "Watch Helia kill the Harpy Queen.", "", true);
			addAchievement("Extremely Celibate Delver", kACHIEVEMENTS.DUNGEON_EXTREMELY_CHASTE_DELVER, "Complete Phoenix Tower without ever orgasming from the beginning.", "", true);
			
			titleAchievementSection("Fashion"); //5 achievements
			addAchievement("Wannabe Wizard", kACHIEVEMENTS.FASHION_WANNABE_WIZARD, "Equip wizard robes and magic staff.");
			addAchievement("Cosplayer", kACHIEVEMENTS.FASHION_COSPLAYER, "Wear 10 different clothings/armors.");
			addAchievement("Dominatrix", kACHIEVEMENTS.FASHION_DOMINATRIX, "Wear any form of kinky clothing and wield any form of whip.");
			addAchievement("Going Commando", kACHIEVEMENTS.FASHION_GOING_COMMANDO, "Wear no undergarments while wearing any clothes or armours.");
			addAchievement("Bling Bling", kACHIEVEMENTS.FASHION_BLING_BLING, "Wear jewelry that is valued over 1,000 gems.");
			
			titleAchievementSection("Wealth"); //4/5 achievements
			addAchievement("Rich", kACHIEVEMENTS.WEALTH_RICH, "Have 1,000 gems.");
			addAchievement("Hoarder", kACHIEVEMENTS.WEALTH_HOARDER, "Have 10,000 gems.");
			addAchievement("Gem Vault", kACHIEVEMENTS.WEALTH_GEM_VAULT, "Have 100,000 gems.");
			addAchievement("Millionaire", kACHIEVEMENTS.WEALTH_MILLIONAIRE, "Have 1,000,000 gems.", "Have 1,000,000 gems. What are you going to spend these gems on?", true);
			addAchievement("Item Vault", kACHIEVEMENTS.WEALTH_ITEM_VAULT, "Fill up your inventory (10 slots), chest, jewelry box, dresser, and all racks.");
			
			titleAchievementSection("Combat"); //8/10 achievements
			addAchievement("Wizard", kACHIEVEMENTS.COMBAT_WIZARD, "Learn all black and white spells from spell books.");
			addAchievement("Cum Cannon", kACHIEVEMENTS.COMBAT_CUM_CANNON, "Cum in the middle of battle.");
			addAchievement("How Do I Shot Web?", kACHIEVEMENTS.COMBAT_SHOT_WEB, "Fire your webbings at your opponent.");
			addAchievement("Pain", kACHIEVEMENTS.COMBAT_PAIN, "Deal 50 damage in one hit.");
			addAchievement("Fractured Limbs", kACHIEVEMENTS.COMBAT_FRACTURED_LIMBS, "Deal 100 damage in one hit.");
			addAchievement("Broken Bones", kACHIEVEMENTS.COMBAT_BROKEN_BONES, "Deal 250 damage in one hit.");
			addAchievement("Overkill", kACHIEVEMENTS.COMBAT_OVERKILL, "Deal 500 damage in one hit."); //Actually POSSIBLE
			addAchievement("Damage Sponge", kACHIEVEMENTS.COMBAT_DAMAGE_SPONGE, "Take a total of 10,000 damage.");
			addAchievement("Bloodletter", kACHIEVEMENTS.COMBAT_BLOOD_LETTER, "Deal a total of 50,000 damage.");
			
			titleAchievementSection("Seasonal Events"); //10 achievements
			addAchievement("Egg Hunter", kACHIEVEMENTS.HOLIDAY_EGG_HUNTER, "Find 10 eggs as random drops during Easter event.", "", true);
			addAchievement("Happy Birthday, Helia!", kACHIEVEMENTS.HOLIDAY_HELIA_BIRTHDAY, "Participate into Helia's birthday event. (August)", "", true);
			addAchievement("Thankslutting", kACHIEVEMENTS.HOLIDAY_THANKSGIVING_I, "Meet the Piggy-Slut (Thanksgiving)", "", true);
			addAchievement("Gobble Gobble", kACHIEVEMENTS.HOLIDAY_THANKSGIVING_II, "Meet the Cockgobbler (Thanksgiving)", "", true);
			addAchievement("Pump-kin-kin-kin", kACHIEVEMENTS.HOLIDAY_HALLOWEEN_I, "Find the pumpkin (Halloween)", "", true);
			addAchievement("Fera's Wonderland", kACHIEVEMENTS.HOLIDAY_HALLOWEEN_II, "Free Fera/Visit her wonderland (Halloween)", "", true);
			addAchievement("Naughty or Nice", kACHIEVEMENTS.HOLIDAY_CHRISTMAS_I, "Meet the X-mas Elf (Christmas)", "", true);
			addAchievement("A Christmas Carol", kACHIEVEMENTS.HOLIDAY_CHRISTMAS_II, "Complete Carol's mini-quest (Christmas)", "", true);
			addAchievement("The Lovable Snowman", kACHIEVEMENTS.HOLIDAY_CHRISTMAS_III, "Have Nieve as lover (Christmas/Winter)", "", true);
			addAchievement("Will You Be My Valentine?", kACHIEVEMENTS.HOLIDAY_VALENTINE, "Visit the Wet Bitch during Valentine's day. (Valentine)", "", true);
			
			titleAchievementSection("Survival/Realistic Mode"); //4/5 achievements
			addAchievement("Tastes Like Chicken", kACHIEVEMENTS.REALISTIC_TASTES_LIKE_CHICKEN, "Refill your hunger for the first time.");
			addAchievement("Champion Needs Food Badly", kACHIEVEMENTS.REALISTIC_CHAMPION_NEEDS_FOOD, "Instantly refill your hunger from 0 to 100 in one go.");
			//addAchievement("Gourmand", kACHIEVEMENTS.REALISTIC_GOURMAND, "Refill hunger from 5 different sources.");
			addAchievement("Glutton", kACHIEVEMENTS.REALISTIC_GLUTTON, "Eat while hunger is above 90.");
			addAchievement("Fasting", kACHIEVEMENTS.REALISTIC_FASTING, "Keep hunger below 25 for a week but don't let it reach 0.");
			
			titleAchievementSection("Challenges"); //5 achievements
			addAchievement("The Ultimate Noob", kACHIEVEMENTS.CHALLENGE_ULTIMATE_NOOB, "Defeat Lethice at level 1.");
			addAchievement("The Mundane Champion", kACHIEVEMENTS.CHALLENGE_ULTIMATE_MUNDANE, "Defeat Lethice without having the knowledge of any spells.");
			addAchievement("The Celibate Hero", kACHIEVEMENTS.CHALLENGE_ULTIMATE_CELIBATE, "Finish the main story without ever having sex or masturbating.");
			addAchievement("Pacifist", kACHIEVEMENTS.CHALLENGE_PACIFIST, "Finish the main storyline without beating and killing anybody.", "Finish the main storyline without beating and killing anybody. Frisk would be so proud of you.");
			addAchievement("Speedrunner", kACHIEVEMENTS.CHALLENGE_SPEEDRUN, "Finish the main story within 30 days or less. Must not be on New Game+.");
			
			titleAchievementSection("General"); //Loads of achievements
			addAchievement("Portal Defender", kACHIEVEMENTS.GENERAL_PORTAL_DEFENDER, "Defeat 25 demons and sleep 10 times.");
			addAchievement("Bad Ender", kACHIEVEMENTS.GENERAL_BAD_ENDER, "Cause or witness 3 Bad Ends to various NPCs.");
			addAchievement("Game Over!", kACHIEVEMENTS.GENERAL_GAME_OVER, "Get a Bad End.");
			addAchievement("Urine Trouble", kACHIEVEMENTS.GENERAL_URINE_TROUBLE, "Urinate at least once in the realm of Mareth.");
			addAchievement("Smashed", kACHIEVEMENTS.GENERAL_SMASHED, "Get so drunk that you end up urinating.", "", true);
			addAchievement("What's Happening to Me?", kACHIEVEMENTS.GENERAL_WHATS_HAPPENING_TO_ME, "Transform for the first time.");
			addAchievement("Transformer", kACHIEVEMENTS.GENERAL_TRANSFORMER, "Transform 10 times.");
			addAchievement("Shapeshifty", kACHIEVEMENTS.GENERAL_SHAPESHIFTY, "Transform 25 times.");
			addAchievement("Fapfapfap", kACHIEVEMENTS.GENERAL_FAPFAPFAP, "Masturbate for the first time.");
			addAchievement("Faptastic", kACHIEVEMENTS.GENERAL_FAPTASTIC, "Masturbate 10 times.");
			addAchievement("Master-bation", kACHIEVEMENTS.GENERAL_FAPSTER, "Masturbate 100 times.");
			
			addAchievement("Helspawn", kACHIEVEMENTS.GENERAL_HELSPAWN, "Have Helia give birth to Helspawn and raise her until adulthood.");
			addAchievement("Goo Armor", kACHIEVEMENTS.GENERAL_GOO_ARMOR, "Wear the goo armor.");
			addAchievement("Urta's True Lover", kACHIEVEMENTS.GENERAL_URTA_TRUE_LOVER, "Complete Urta's infertility quest then have her give birth to a baby fox.");
			addAchievement("Dress-tacular", kACHIEVEMENTS.GENERAL_DRESSTACULAR, "Give Rubi every outfit available.");
			addAchievement("Godslayer", kACHIEVEMENTS.GENERAL_GODSLAYER, "Defeat corrupted Marae.", "", true);
			addAchievement("Follow the Leader", kACHIEVEMENTS.GENERAL_FOLLOW_THE_LEADER, "Get every follower in the game.");
			addAchievement("Gotta Love 'Em All", kACHIEVEMENTS.GENERAL_GOTTA_LOVE_THEM_ALL, "Get every lover in the game. (Nieve optional)");
			addAchievement("Meet Your " + player.mf("Master", "Mistress"), kACHIEVEMENTS.GENERAL_MEET_YOUR_MASTER, "Get every slave in the game. (Corrupt Jojo & Amily, and Bimbo Sophie optional.)");
			addAchievement("Slaver", kACHIEVEMENTS.GENERAL_MEET_YOUR_MASTER_TRUE, "Get every slave in the game, including corrupt Jojo and Amily, and Bimbo Sophie.", "", true);
			addAchievement("All Your People are Belong to Me", kACHIEVEMENTS.GENERAL_ALL_UR_PPLZ_R_BLNG_2_ME, "Obtain every follower, lover, and slave. (Excluding mutual exclusivity)");
			addAchievement("Scholar", kACHIEVEMENTS.GENERAL_SCHOLAR, "Fill out all codex entries available in the game.");
			addAchievement("Freeloader", kACHIEVEMENTS.GENERAL_FREELOADER, "Visit the Kitsune's mansion 3 times.");
			addAchievement("Schizophrenic", kACHIEVEMENTS.GENERAL_SCHIZO, "Go between pure and corrupt 4 times. (Threshold of 20 and 80 corruption)");
			addAchievement("Clean Slate", kACHIEVEMENTS.GENERAL_CLEAN_SLATE, "Go from 100 corruption to zero for the first time.");
			addAchievement("Perky", kACHIEVEMENTS.GENERAL_PERKY, "Have at least 20 perks.");
			addAchievement("Super Perky", kACHIEVEMENTS.GENERAL_SUPER_PERKY, "Have at least 35 perks.");
			addAchievement("Ultra Perky", kACHIEVEMENTS.GENERAL_ULTRA_PERKY, "Have at least 50 perks.");
			addAchievement("Jack of All Trades", kACHIEVEMENTS.GENERAL_STATS_50, "Have at least 50 of each stat. (Libido, sensitivity, corruption optional)");
			addAchievement("Incredible Stats", kACHIEVEMENTS.GENERAL_STATS_100, "Have at least 100 of each stat. (Libido, sensitivity, corruption optional)");
			addAchievement("Like Chuck Norris", kACHIEVEMENTS.GENERAL_LIKE_CHUCK_NORRIS, "Defeat the Frost Giant without any equipment.", "Defeat the Frost Giant without any equipment. Way to be a badass!");
			addAchievement("Tentacle Beast Slayer", kACHIEVEMENTS.GENERAL_TENTACLE_BEAST_SLAYER, "Slay your first Tentacle Beast.");
			addAchievement("Hammer Time", kACHIEVEMENTS.GENERAL_HAMMER_TIME, "Buy a total of 300 nails.");
			addAchievement("Nail Scavenger", kACHIEVEMENTS.GENERAL_NAIL_SCAVENGER, "Scavenge a total of 200 nails from the library wreckage");
			addAchievement("I'm No Lumberjack", kACHIEVEMENTS.GENERAL_IM_NO_LUMBERJACK, "Buy a total of 100 wood.");
			addAchievement("Deforester", kACHIEVEMENTS.GENERAL_DEFORESTER, "Cut down 100 wood pieces.");
			addAchievement("Yabba Dabba Doo", kACHIEVEMENTS.GENERAL_YABBA_DABBA_DOO, "Buy a total of 100 stones.");
			addAchievement("AntWorks", kACHIEVEMENTS.GENERAL_ANTWORKS, "Gather a total of 200 stones with Phylla help.");
			addAchievement("Home Sweet Home", kACHIEVEMENTS.GENERAL_HOME_SWEET_HOME, "Finish the cabin and complete it with furnishings.");
			addAchievement("Getaway", kACHIEVEMENTS.GENERAL_GETAWAY, "Spend the night outside your camp.");
			addAchievement("My Tent's (not) Better Than Yours", kACHIEVEMENTS.GENERAL_MY_TENT_NOT_BETTER, "Sleep in Arian's tent.");
			addAchievement("Divine Intervention", kACHIEVEMENTS.GENERAL_MINERVA_PURIFICATION, "Complete Minerva's purification process.", "", true);
			addAchievement("Fencer", kACHIEVEMENTS.GENERAL_FENCER, "Complete rapier training from Raphael.", "", true);
			addAchievement("Now You're Fucking With Portals", kACHIEVEMENTS.GENERAL_FUCK_WITH_PORTALS, "Engage in portal sex with Ceraph.", "", true);
			addAchievement("Getting Wood", kACHIEVEMENTS.GENERAL_GETTING_WOOD, "Punch a tree until wood falls out... Wait, what?", "", true);
			addAchievement("Dick Banisher", kACHIEVEMENTS.GENERAL_DICK_BANISHER, "Remove cocks from at least three dedickable NPCs. Don't you think they'll miss having their own cocks?", "", true);
			addAchievement("You Bastard", kACHIEVEMENTS.GENERAL_YOU_BASTARD, "Perform something only someone who's evil would do. Like corrupting NPCs or removing dick from at least 7 dedickable NPCs.", "", true);
			addAchievement("Up to Eleven", kACHIEVEMENTS.GENERAL_UP_TO_11, "Take your height up to 11 feet.");
			addAchievement("Off With Her Head!", kACHIEVEMENTS.GENERAL_OFF_WITH_HER_HEAD, "You've managed to behead Lethice and show her head to the demons!", "", true);
			addAchievement("NOOOOOOOOOOOO!", kACHIEVEMENTS.GENERAL_NOOOOOOO, "You've managed to kill yourself before Lethice takes you as her slave.", "", true);
			addAchievement("Make Mareth Great Again", kACHIEVEMENTS.GENERAL_MAKE_MARETH_GREAT_AGAIN, "Build a wall around your camp to defend from those pesky imps.");
			addAchievement("Terracotta Impy", kACHIEVEMENTS.GENERAL_TERRACOTTA_IMPY, "You've placed 100 imp statues around your camp wall. No, bassy. Bad bassy! Baaad Mr. Bassy!!!", "", true);
			addAchievement("Kaizo Trap", kACHIEVEMENTS.GENERAL_KAIZO_TRAP, "Fall victim to a Kaizo Trap. Basically, you got a bad end right after your victory!", "", true);
			addAchievement("The Hunter Becomes the Hunted", kACHIEVEMENTS.GENERAL_HUNTER_IS_HUNTED, "Turn the tables against Erlking.");
			addAchievement("Allahu Akbal", kACHIEVEMENTS.GENERAL_ALLAHU_AKBAL, "Submit to Akbal until you receive the associated perks.");
			addAchievement("Dining In", kACHIEVEMENTS.GENERAL_DINING_IN, "Eat any food at The Black Cock.");
			addAchievement("Prisoner", kACHIEVEMENTS.GENERAL_PRISONER, "Get captured and sent to the Prison.", "", true);
			addAchievement("Jojo's Bizarre Adventure", kACHIEVEMENTS.GENERAL_JOJOS_BIZARRE_ADVENTURE, "Have Jojo in your camp, through either methods.");
			
			doNext(getGame().mainMenu.mainMenu);
			addButton(1, "" + achievementsEarned + "/" + achievementsTotal + " earned", kGAMECLASS.doNothing).hint("This is how many achievements you have obtained in the game so far.", "Total Achievements Earned");
		}
		
	}


