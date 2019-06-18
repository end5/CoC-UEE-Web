

	export class DungeonCore extends BaseContent {
		public  rooms: any[] = [];
		public  _currentRoom: string; //I don't think we'll need to save/load this, as we're not gonna allow saving in the dungeon, and it'll be overwritten by calling enterD3();
//		Dungeon constants
		//Factory
		public static  DUNGEON_FACTORY_FOYER: number			=  0;
		public static  DUNGEON_FACTORY_BREAK_ROOM: number		=  1;
		public static  DUNGEON_FACTORY_PUMP_ROOM: number		=  2;
		public static  DUNGEON_FACTORY_FURNACE_ROOM: number	=  3;
		public static  DUNGEON_FACTORY_REPAIR_CLOSET: number	=  4;
		public static  DUNGEON_FACTORY_MAIN_CHAMBER: number	=  5;
		public static  DUNGEON_FACTORY_FOREMANS_OFFICE: number	=  6;
		public static  DUNGEON_FACTORY_PUMP_CONTROL: number	=  7;
		public static  DUNGEON_FACTORY_STORE_ROOM: number		=  8;
		public static  DUNGEON_FACTORY_BATHROOM: number		=  9;
		//Deep Cave
		public static  DUNGEON_CAVE_ENTRANCE: number			= 10;
		public static  DUNGEON_CAVE_TUNNEL: number				= 11;
		public static  DUNGEON_CAVE_GATHERING_HALL: number		= 12;
		public static  DUNGEON_CAVE_FUNGUS_CAVERN: number		= 13;
		public static  DUNGEON_CAVE_TORTURE_ROOM: number		= 14;
		public static  DUNGEON_CAVE_SECRET_TUNNEL: number		= 15;
		public static  DUNGEON_CAVE_ZETAZ_CHAMBER: number		= 16;
		//Phoenix Tower
		public static  DUNGEON_HEL_GUARD_HALL: number			= 17;
		public static  DUNGEON_HEL_WINE_CELLAR: number			= 18;
		public static  DUNGEON_HEL_STAIR_WELL: number			= 19;
		public static  DUNGEON_HEL_DUNGEON: number				= 20;
		public static  DUNGEON_HEL_MEZZANINE: number			= 21;
		public static  DUNGEON_HEL_THRONE_ROOM: number			= 22;
		//Desert Cave
		public static  DUNGEON_WITCH_ENTRANCE_GATEWAY: number	= 23;
		public static  DUNGEON_WITCH_CAVERNOUS_COMMONS: number	= 24;
		public static  DUNGEON_WITCH_WEST_WARRENS_MAIN: number	= 25;
		public static  DUNGEON_WITCH_CHILDRENS_PLAYROOM: number= 26;
		public static  DUNGEON_WITCH_PREGNANT_LUST_ROOM: number= 27;
		public static  DUNGEON_WITCH_WEST_WARRENS_WEST: number	= 28;
		public static  DUNGEON_WITCH_NURSERY: number			= 29;
		public static  DUNGEON_WITCH_PHARMACY: number			= 30;
		public static  DUNGEON_WITCH_EAST_WARRENS_MAIN: number	= 31;
		public static  DUNGEON_WITCH_SLEEPING_CHAMBER: number	= 32;
		public static  DUNGEON_WITCH_BATH_ROOM: number			= 33;
		public static  DUNGEON_WITCH_EAST_WARRENS_EAST: number	= 34;
		public static  DUNGEON_WITCH_CUM_WITCH_BEDROOM: number	= 35;
		public static  DUNGEON_WITCH_CUM_WITCH_OFFICE: number	= 36;
		public static  DUNGEON_WITCH_SACRIFICIAL_ALTAR: number	= 37;
		public static  DUNGEON_WITCH_THRONE_ROOM: number		= 38;
		//Anzu's Palace
		public static  DUNGEON_ANZU_OUTSIDE: number			= 39;
		public static  DUNGEON_ANZU_HALL_FLOOR1: number 		= 40;
		public static  DUNGEON_ANZU_LIVING_ROOM: number 		= 41;
		public static  DUNGEON_ANZU_BATHROOM: number 			= 42;
		public static  DUNGEON_ANZU_DINING_ROOM: number 		= 43;
		public static  DUNGEON_ANZU_KITCHEN: number 			= 44;
		public static  DUNGEON_ANZU_HALL_FLOOR2: number		= 45;
		public static  DUNGEON_ANZU_BEDROOM: number 			= 46;
		public static  DUNGEON_ANZU_LIBRARY: number 			= 47;
		public static  DUNGEON_ANZU_MULTIUSE_ROOM: number 		= 48;
		public static  DUNGEON_ANZU_HALL_FLOOR3: number 		= 49;
		public static  DUNGEON_ANZU_PALACE_VAULTS: number 		= 50;
		public static  DUNGEON_ANZU_ALCHEMY_ROOM: number 		= 51;
		public static  DUNGEON_ANZU_ROOF: number 				= 52;
		public static  DUNGEON_ANZU_BASEMENT: number 			= 53;
		public static  DUNGEON_ANZU_ARMORY: number 			= 54;
		//Dragon City
		public static  DUNGEON_DRAGON_CITY_SQUARE: number      = 55;
		public static  DUNGEON_DRAGON_HOUSING_DISTRICT: number = 56;
		public static  DUNGEON_DRAGON_BATHS: number            = 57;
		public static  DUNGEON_DRAGON_ARENA: number            = 58;
		public static  DUNGEON_DRAGON_LIBRARY: number          = 59;
		public static  DUNGEON_DRAGON_CITY_HALL_FRONT: number  = 60;
		public static  DUNGEON_DRAGON_CITY_HALL: number        = 61;
		public static  DUNGEON_DRAGON_SEWERS_WEST: number      = 62;
		public static  DUNGEON_DRAGON_SEWERS_EAST: number      = 63;
		public static  DUNGEON_DRAGON_BREEDING_DEN: number     = 64;
		//Hellhound Dungeon
		public static  DUNGEON_HELLHOUND_ENTRANCE: number      = 65;
		public static  DUNGEON_HELLHOUND_CORRIDOR1: number     = 66;
		public static  DUNGEON_HELLHOUND_CORRIDOR2: number     = 67;
		public static  DUNGEON_HELLHOUND_CORRIDOR3: number     = 68;
		public static  DUNGEON_HELLHOUND_KENNELS: number       = 69;
		public static  DUNGEON_HELLHOUND_PLEASURE_PITS: number = 70;
		public static  DUNGEON_HELLHOUND_LAB: number           = 71;
		public static  DUNGEON_HELLHOUND_KITCHEN: number       = 72;
		public static  DUNGEON_HELLHOUND_STORAGE: number       = 73;
		public static  DUNGEON_HELLHOUND_QUARTERS: number      = 74;
		public static  DUNGEON_HELLHOUND_INNER_SANCTUM: number = 75;

		public  DungeonCore(pregnancyProgression:PregnancyProgression) {
			this.desertcave = new DesertCave(pregnancyProgression);
		}
		//Register dungeons
		public  factory:Factory = new Factory;
		public  deepcave:DeepCave = new DeepCave;
		public  desertcave:DesertCave;
		public  hellcomplex:HellhoundComplex = new HellhoundComplex;
		public  dragoncity:DragonCity = new DragonCity;
		public  heltower:HelDungeon = new HelDungeon;
		public  palace:AnzuPalace = new AnzuPalace;
		public  cabin:YourCabin = new YourCabin;

		public  map:DungeonMap;

		public  checkRoom(): void {
			//Cabin
			if (kGAMECLASS.dungeonLoc === -10) cabin.enterCabin();
			//Factory
			if (kGAMECLASS.dungeonLoc === DUNGEON_FACTORY_FOYER) factory.roomLobby();
			if (kGAMECLASS.dungeonLoc === DUNGEON_FACTORY_BREAK_ROOM) factory.roomBreakRoom();
			if (kGAMECLASS.dungeonLoc === DUNGEON_FACTORY_PUMP_ROOM) factory.roomPumpRoom();
			if (kGAMECLASS.dungeonLoc === DUNGEON_FACTORY_FURNACE_ROOM) factory.roomFurnaceRoom();
			if (kGAMECLASS.dungeonLoc === DUNGEON_FACTORY_REPAIR_CLOSET) factory.roomRepairCloset();
			if (kGAMECLASS.dungeonLoc === DUNGEON_FACTORY_MAIN_CHAMBER) factory.roomMainChamber();
			if (kGAMECLASS.dungeonLoc === DUNGEON_FACTORY_FOREMANS_OFFICE) factory.roomForemanOffice();
			if (kGAMECLASS.dungeonLoc === DUNGEON_FACTORY_PUMP_CONTROL) factory.roomControlRoom();
			if (kGAMECLASS.dungeonLoc === DUNGEON_FACTORY_STORE_ROOM) factory.roomPremiumStorage();
			if (kGAMECLASS.dungeonLoc === DUNGEON_FACTORY_BATHROOM) factory.roomBathroom();
			//Deep Cave
			if (kGAMECLASS.dungeonLoc === DUNGEON_CAVE_ENTRANCE) deepcave.roomEntrance();
			if (kGAMECLASS.dungeonLoc === DUNGEON_CAVE_TUNNEL) deepcave.roomTunnel();
			if (kGAMECLASS.dungeonLoc === DUNGEON_CAVE_GATHERING_HALL) deepcave.roomGatheringHall();
			if (kGAMECLASS.dungeonLoc === DUNGEON_CAVE_FUNGUS_CAVERN) deepcave.roomFungusCavern();
			if (kGAMECLASS.dungeonLoc === DUNGEON_CAVE_TORTURE_ROOM) deepcave.roomTortureRoom();
			if (kGAMECLASS.dungeonLoc === DUNGEON_CAVE_SECRET_TUNNEL) deepcave.roomSecretPassage();
			if (kGAMECLASS.dungeonLoc === DUNGEON_CAVE_ZETAZ_CHAMBER) deepcave.roomZetazChamber();
			//Tower of the Phoenix (Helia's Quest)
			if (kGAMECLASS.dungeonLoc === DUNGEON_HEL_GUARD_HALL) heltower.roomGuardHall();
			if (kGAMECLASS.dungeonLoc === DUNGEON_HEL_WINE_CELLAR) heltower.roomCellar();
			if (kGAMECLASS.dungeonLoc === DUNGEON_HEL_STAIR_WELL) heltower.roomStairwell();
			if (kGAMECLASS.dungeonLoc === DUNGEON_HEL_DUNGEON) heltower.roomDungeon();
			if (kGAMECLASS.dungeonLoc === DUNGEON_HEL_MEZZANINE) heltower.roomMezzanine();
			if (kGAMECLASS.dungeonLoc === DUNGEON_HEL_THRONE_ROOM) heltower.roomThroneRoom();
			//Desert Cave
			if (kGAMECLASS.dungeonLoc === DUNGEON_WITCH_ENTRANCE_GATEWAY) desertcave.roomEntrance();
			if (kGAMECLASS.dungeonLoc === DUNGEON_WITCH_CAVERNOUS_COMMONS) desertcave.roomCaveCommons();
			if (kGAMECLASS.dungeonLoc === DUNGEON_WITCH_WEST_WARRENS_MAIN) desertcave.roomWestHall1();
			if (kGAMECLASS.dungeonLoc === DUNGEON_WITCH_CHILDRENS_PLAYROOM) desertcave.roomPlayRoom();
			if (kGAMECLASS.dungeonLoc === DUNGEON_WITCH_PREGNANT_LUST_ROOM) desertcave.roomLustRoom();
			if (kGAMECLASS.dungeonLoc === DUNGEON_WITCH_WEST_WARRENS_WEST) desertcave.roomWestHall2();
			if (kGAMECLASS.dungeonLoc === DUNGEON_WITCH_NURSERY) desertcave.roomNursery();
			if (kGAMECLASS.dungeonLoc === DUNGEON_WITCH_PHARMACY) desertcave.roomPharmacy();
			if (kGAMECLASS.dungeonLoc === DUNGEON_WITCH_EAST_WARRENS_MAIN) desertcave.roomEastHall1();
			if (kGAMECLASS.dungeonLoc === DUNGEON_WITCH_SLEEPING_CHAMBER) desertcave.roomSleepingChamber();
			if (kGAMECLASS.dungeonLoc === DUNGEON_WITCH_BATH_ROOM) desertcave.roomBathroom();
			if (kGAMECLASS.dungeonLoc === DUNGEON_WITCH_EAST_WARRENS_EAST) desertcave.roomEastHall2();
			if (kGAMECLASS.dungeonLoc === DUNGEON_WITCH_CUM_WITCH_BEDROOM) desertcave.roomCumWitchBedroom();
			if (kGAMECLASS.dungeonLoc === DUNGEON_WITCH_CUM_WITCH_OFFICE) desertcave.roomCumWitchOffice();
			if (kGAMECLASS.dungeonLoc === DUNGEON_WITCH_SACRIFICIAL_ALTAR) desertcave.roomSacrificalAltar();
			if (kGAMECLASS.dungeonLoc === DUNGEON_WITCH_THRONE_ROOM) desertcave.roomSandMotherThrone();
			//Anzu's Palace
			if (kGAMECLASS.dungeonLoc === DUNGEON_ANZU_OUTSIDE) palace.roomEntrance();
			if (kGAMECLASS.dungeonLoc === DUNGEON_ANZU_HALL_FLOOR1) palace.roomFoyer();
			if (kGAMECLASS.dungeonLoc === DUNGEON_ANZU_LIVING_ROOM) palace.roomLivingRoom();
			if (kGAMECLASS.dungeonLoc === DUNGEON_ANZU_BATHROOM) palace.roomBathroom();
			if (kGAMECLASS.dungeonLoc === DUNGEON_ANZU_DINING_ROOM) palace.roomDiningRoom();
			if (kGAMECLASS.dungeonLoc === DUNGEON_ANZU_KITCHEN) palace.roomKitchen();
			if (kGAMECLASS.dungeonLoc === DUNGEON_ANZU_HALL_FLOOR2) palace.roomHallFloor2();
			if (kGAMECLASS.dungeonLoc === DUNGEON_ANZU_BEDROOM) palace.roomBedroom();
			if (kGAMECLASS.dungeonLoc === DUNGEON_ANZU_LIBRARY) palace.roomLibrary();
			if (kGAMECLASS.dungeonLoc === DUNGEON_ANZU_MULTIUSE_ROOM) palace.roomMultiuse();
			if (kGAMECLASS.dungeonLoc === DUNGEON_ANZU_HALL_FLOOR3) palace.roomHallFloor3();
			if (kGAMECLASS.dungeonLoc === DUNGEON_ANZU_PALACE_VAULTS) palace.roomVault();
			if (kGAMECLASS.dungeonLoc === DUNGEON_ANZU_ALCHEMY_ROOM) palace.roomAlchemyRoom();
			if (kGAMECLASS.dungeonLoc === DUNGEON_ANZU_ROOF) palace.roomRoof();
			if (kGAMECLASS.dungeonLoc === DUNGEON_ANZU_BASEMENT) palace.roomBasement();
			if (kGAMECLASS.dungeonLoc === DUNGEON_ANZU_ARMORY) palace.roomArmory();
			//Hellhound Complex
			if (kGAMECLASS.dungeonLoc === DUNGEON_HELLHOUND_ENTRANCE) hellcomplex.roomEntrance();
			if (kGAMECLASS.dungeonLoc === DUNGEON_HELLHOUND_CORRIDOR1) hellcomplex.roomCorridor1();
			if (kGAMECLASS.dungeonLoc === DUNGEON_HELLHOUND_CORRIDOR2) hellcomplex.roomCorridor2();
			if (kGAMECLASS.dungeonLoc === DUNGEON_HELLHOUND_KENNELS) hellcomplex.roomKennels();
			if (kGAMECLASS.dungeonLoc === DUNGEON_HELLHOUND_PLEASURE_PITS) hellcomplex.roomPleasurePits();
			if (kGAMECLASS.dungeonLoc === DUNGEON_HELLHOUND_LAB) hellcomplex.roomLab();
			if (kGAMECLASS.dungeonLoc === DUNGEON_HELLHOUND_KITCHEN) hellcomplex.roomKitchen();
			if (kGAMECLASS.dungeonLoc === DUNGEON_HELLHOUND_STORAGE) hellcomplex.roomStorage();
			if (kGAMECLASS.dungeonLoc === DUNGEON_HELLHOUND_INNER_SANCTUM) hellcomplex.roomInnerSanctum();
			//Dragon City
			if (kGAMECLASS.dungeonLoc === DUNGEON_DRAGON_CITY_SQUARE) dragoncity.roomCitySquare();
			if (kGAMECLASS.dungeonLoc === DUNGEON_DRAGON_HOUSING_DISTRICT) dragoncity.roomHousingDistrict();
			if (kGAMECLASS.dungeonLoc === DUNGEON_DRAGON_BATHS) dragoncity.roomBaths();
			if (kGAMECLASS.dungeonLoc === DUNGEON_DRAGON_ARENA) dragoncity.roomArena();
			if (kGAMECLASS.dungeonLoc === DUNGEON_DRAGON_LIBRARY) dragoncity.roomLibrary();
			if (kGAMECLASS.dungeonLoc === DUNGEON_DRAGON_CITY_HALL_FRONT) dragoncity.roomCityHallFront();
			if (kGAMECLASS.dungeonLoc === DUNGEON_DRAGON_CITY_HALL) dragoncity.roomCityHall();
			if (kGAMECLASS.dungeonLoc === DUNGEON_DRAGON_SEWERS_WEST) dragoncity.roomSewerWest();
			if (kGAMECLASS.dungeonLoc === DUNGEON_DRAGON_SEWERS_EAST) dragoncity.roomSewerEast();
			if (kGAMECLASS.dungeonLoc === DUNGEON_DRAGON_BREEDING_DEN) dragoncity.roomSewerBreedingDen();
		}

		public  checkFactoryClear(): boolean {
			return (flags[kFLAGS.FACTORY_SHUTDOWN] > 0 && flags[kFLAGS.FACTORY_SUCCUBUS_DEFEATED] > 0 && flags[kFLAGS.FACTORY_INCUBUS_DEFEATED] > 0 && flags[kFLAGS.FACTORY_OMNIBUS_DEFEATED] > 0);
		}
		public  checkDeepCaveClear(): boolean {
			return (flags[kFLAGS.ZETAZ_IMP_HORDE_DEFEATED] > 0 && flags[kFLAGS.ZETAZ_FUNGUS_ROOM_DEFEATED] > 0 && flags[kFLAGS.FREED_VALA] === 1 && player.hasKeyItem("Zetaz's Map") >= 0);
		}
		public  checkSandCaveClear(): boolean {
			return ((flags[kFLAGS.ESSRAYLE_ESCAPED_DUNGEON] > 0 || flags[kFLAGS.MET_ESSY] === 0) && (flags[kFLAGS.SAND_WITCHES_FRIENDLY] > 0 || flags[kFLAGS.SAND_WITCHES_COWED] > 0));
		}
		public  checkPhoenixTowerClear(): boolean {
			return (flags[kFLAGS.HARPY_QUEEN_EXECUTED] !== 0 && flags[kFLAGS.HEL_HARPIES_DEFEATED] > 0 && flags[kFLAGS.HEL_PHOENIXES_DEFEATED] > 0 && flags[kFLAGS.HEL_BRIGID_DEFEATED] > 0);
		}
		public  checkLethiceStrongholdClear(): boolean {
			return (flags[kFLAGS.D3_MIRRORS_SHATTERED] > 0 && flags[kFLAGS.D3_JEAN_CLAUDE_DEFEATED] > 0 && flags[kFLAGS.D3_GARDENER_DEFEATED] > 0 && flags[kFLAGS.D3_CENTAUR_DEFEATED] > 0 && flags[kFLAGS.LETHICE_DEFEATED] > 0);
		}
		public  checkDragonCityClear(): boolean {
			return false; //Will be worked on
		}

		public  enterFactory(): void {
			factory.enterDungeon();
		}
		public  canFindDeepCave(): boolean {
			return flags[kFLAGS.DISCOVERED_DUNGEON_2_ZETAZ] === 0 && flags[kFLAGS.FACTORY_SHUTDOWN] > 0;
		}
		public  enterDeepCave(): void {
			deepcave.enterDungeon();
		}
		public  enterAnzuPalace(): void {
			palace.enterDungeon();
		}

		public  navigateToRoom(roomFunc = undefined, timeToPass: number = 1/12): void {
			cheatTime(timeToPass);
			roomFunc();
		}

		//Set the top buttons for use while in dungeons
		public  setTopButtons(): void { //Set top buttons.
			mainView.setMenuButton (MainView.MENU_NEW_MAIN, "Main Menu", kGAMECLASS.mainMenu.mainMenu);
			mainView.showMenuButton (MainView.MENU_APPEARANCE);
			mainView.showMenuButton (MainView.MENU_PERKS);
			mainView.showMenuButton (MainView.MENU_STATS);
			mainView.hideMenuButton (MainView.MENU_DATA);
			mainView.showMenuButton (MainView.MENU_NEW_MAIN);
			if ((player.XP >= (player.level) * 100 && player.level < kGAMECLASS.levelCap) || player.perkPoints > 0 || player.statPoints > 0) {
				if (player.XP < player.level * 100 || player.level >= kGAMECLASS.levelCap) {
					if (player.statPoints > 0) mainView.setMenuButton (MainView.MENU_LEVEL, "Stat Up");
					else mainView.setMenuButton (MainView.MENU_LEVEL, "Perk Up");
				}
				else {
					mainView.setMenuButton (MainView.MENU_LEVEL, "Level Up");
					if (flags[kFLAGS.AUTO_LEVEL] > 0) {
						getGame().playerInfo.levelUpGo();
						return;
					}
				}
				mainView.showMenuButton (MainView.MENU_LEVEL);
				mainView.statsView.showLevelUp();
			}
			else {
				mainView.hideMenuButton (MainView.MENU_LEVEL);
				mainView.statsView.hideLevelUp();
			}
		}

		/**
		 * Set the buttons for use in dungeons. The parameters can be used to connect to rooms
		 * @param	northFunction
		 * @param	southFunction
		 * @param	westFunction
		 * @param	eastFunction
		 */
		public  setDungeonButtons(northFunction = undefined, southFunction = undefined, westFunction = undefined, eastFunction = undefined): void {
			statScreenRefresh();
			hideUpDown();
			spriteSelect(undefined);
			menu();
			if (northFunction !== undefined) addButton(6, "North", navigateToRoom, northFunction);
			if (southFunction !== undefined) addButton(11, "South", navigateToRoom, southFunction);
			if (westFunction !== undefined) addButton(10, "West", navigateToRoom, westFunction);
			if (eastFunction !== undefined) addButton(12, "East", navigateToRoom, eastFunction);
			getGame().masturbation.setMasturbateButton(true);
			addButton(13, "Inventory", inventory.inventoryMenu).hint("The inventory allows you to use an item.  Be careful as this leaves you open to a counterattack when in combat.");
			addButton(14, "Map", map.displayMap).hint("View the map of this dungeon.");
			setTopButtons();
			palace.setAnzuButton();
		}

		//Dungeon 3 & Grimdark Stuff
		public  resumeFromFight(): void {
			move(_currentRoom);
		}

		public  generateRoomMenu(tRoom:room): void {
			statScreenRefresh();
			hideUpDown();
			spriteSelect(undefined);
			setTopButtons();
			if (tRoom.NorthExit !== undefined && tRoom.NorthExit.length > 0) {
				if (tRoom.NorthExitCondition === undefined || tRoom.NorthExitCondition()) addButton(6, "North", move, tRoom.NorthExit, 1/12);
			}
			if (tRoom.EastExit !== undefined && tRoom.EastExit.length > 0) {
				if (tRoom.EastExitCondition === undefined || tRoom.EastExitCondition()) addButton(12, "East", move, tRoom.EastExit, 1/12);
			}
			if (tRoom.SouthExit !== undefined && tRoom.SouthExit.length > 0) {
				if (tRoom.SouthExitCondition === undefined || tRoom.SouthExitCondition()) addButton(11, "South", move, tRoom.SouthExit, 1/12);
			}
			if (tRoom.WestExit !== undefined && tRoom.WestExit.length > 0) {
				if (tRoom.WestExitCondition === undefined || tRoom.WestExitCondition()) addButton(10, "West", move, tRoom.WestExit, 1/12);
			}
			addButton(13, "Inventory", inventory.inventoryMenu);
			addButton(14, "Map", kGAMECLASS.dungeons.map.displayMap);
			getGame().masturbation.setMasturbateButton(true);
		}

		public  move(roomName: string, timeToPass: number = 0): void {
		//	trace("Entering room", roomName);
			cheatTime(timeToPass);
			clearOutput();
			if (rooms[roomName] === undefined) {
				clearOutput();
				outputText("Error: Couldn't find the room indexed as: " + roomName);
				menu();
				return;
			}
		var  tRoom:room = rooms[roomName];
			if (tRoom.RoomFunction === undefined) {
				outputText("Error: Room entry function for room indexed as '" + roomName + "' was not set.");
				return;
			}
			menu();
			if (!tRoom.RoomFunction()) generateRoomMenu(tRoom);
			_currentRoom = roomName;
		}
	}

