/*
   CoC Main File - This is what loads when the game begins. If you want to start understanding the structure of CoC,
   this is the place to start.
   First, we import all the classes from many different files across the codebase. It would be wise not to alter the
   order of these imports until more is known about what needs to load and when.
 */

	// BREAKING ALL THE RULES.
	
// This file contains most of the persistent gamestate flags.
	
	/*
	   One very important thing to know about descriptions in this game is that many words are based on hidden integer values.
	   These integers are compared to tables or queried directly to get the words used for particular parts of descriptions. For instance,
	   Ass below has variables for wetness, looseness, fullness, and virginity. You'll often find little tables like this
	   scattered through the code:
	   butt looseness
	   0 - virgin
	   1 - normal
	   2 - loose
	   3 - very loose
	   4 - gaping
	   5 - monstrous
	   Tracking down a full list of description variables, how their integer values translate to descriptions, and how to call them
	   would be a very useful task for anyone who wants to extend content using variables.
	   Further complicating this is that the code will also sometimes have a randomized list of words for certain things just to keep
	   the text from being too boring.
	 */
	
	// This line not necessary, but added because I'm pedantic like that.
	
// All the files below with Scenes loads the main content for the game.
	
	// Class based content? In my CoC?! It's more likely than you think!
	
	// All the imports below are for Flash.
	
	/****
	   classes.CoC: The Document class of Corruption of the Champions.
	 ****/
	
	// This class instantiates the game. If you create a new place/location/scene you'll likely have to add it into here.
	// Add in descriptions for the include statements. Many of the description text code is inside of these.
	// Suggest moving or removing old comments referencing things that aren't needed anymore.
	
	[SWF(width = "1000", height = "800", backgroundColor = "0x000000", pageTitle = "Corruption of Champions")]
	
	export class CoC extends MovieClip implements GuiInput
	{
		{
			/*
			 * This is a static initializer block, used as an ugly hack to setup
			 * logging before any of the class variables are initialized.
			 * This is done because they could log messages during construction.
			 */
			
			CoC.setUpLogging();
		}
		
		// Include the functions. ALL THE FUNCTIONS
		include "../../includes/debug.as";
		include "../../includes/eventParser.as";
		include "../../includes/engineCore.as";
		
		//Any classes that need to be made aware when the game is saved or loaded can add themselves to this array using saveAwareAdd.
		//	Once in the array they will be notified by Saves.as whenever the game needs them to write or read their data to the flags array.
		private static  _saveAwareClassList:Vector.<SaveAwareInterface> = new Vector.<SaveAwareInterface>();
		
		//Called by the saveGameObject function in Saves
		public static  saveAllAwareClasses(game:CoC): void
		{
			for (var sac: number = 0; sac < _saveAwareClassList.length; sac++)
				_saveAwareClassList[sac].updateBeforeSave(game);
		}
		
		//Called by the loadGameObject function in Saves
		public static  loadAllAwareClasses(game:CoC): void
		{
			for (var sac: number = 0; sac < _saveAwareClassList.length; sac++)
				_saveAwareClassList[sac].updateAfterLoad(game);
		}
		
		public static  saveAwareClassAdd(newEntry:SaveAwareInterface): void
		{
			_saveAwareClassList.push(newEntry);
		}
		
		//Any classes that need to be aware of the passage of time can add themselves to this array using timeAwareAdd.
		//	Once in the array they will be notified as each hour passes, allowing them to update actions, lactation, pregnancy, etc.
		private static  _timeAwareClassList:Vector.<TimeAwareInterface> = new Vector.<TimeAwareInterface>(); //Accessed by goNext function in eventParser
		private static  timeAwareLargeLastEntry: number = -1; //Used by the eventParser in calling timeAwareLarge
		private  playerEvent:PlayerEvents;
		
		public static  timeAwareClassAdd(newEntry:TimeAwareInterface): void
		{
			_timeAwareClassList.push(newEntry);
		}
		
		private static  doCamp; //Set by campInitialize, should only be called by playerMenu
		
		private static  campInitialize(passDoCamp): void
		{
			doCamp = passDoCamp;
		}
		
		// /
		private  _perkLib:PerkLib = new PerkLib(); // to init the static
		private  _statusEffects:StatusEffects = new StatusEffects(); // to init the static
		public  charCreation:CharCreation = new CharCreation();
		public  playerAppearance:PlayerAppearance = new PlayerAppearance();
		public  playerInfo:PlayerInfo = new PlayerInfo();
		public  saves:Saves = new Saves(gameStateDirectGet, gameStateDirectSet);
		public  perkTree:PerkTree = new PerkTree();
		// Items/
		public  mutations:Mutations = Mutations.init();
		public  consumables:ConsumableLib = new ConsumableLib();
		public  useables:UseableLib;
		public  weapons:WeaponLib = new WeaponLib();
		public  armors:ArmorLib = new ArmorLib();
		public  undergarments:UndergarmentLib = new UndergarmentLib();
		public  jewelries:JewelryLib = new JewelryLib();
		public  shields:ShieldLib = new ShieldLib();
		public  miscItems:MiscItemLib = new MiscItemLib();
		// Scenes/
		public  achievementList:Achievements = new Achievements();
		public  camp:Camp = new Camp(campInitialize);
		public  dreams:Dreams = new Dreams();
		public  dungeons:DungeonCore;
		public  equipmentUpgrade:ItemUpgrade = new ItemUpgrade();
		public  followerInteractions:FollowerInteractions = new FollowerInteractions();
		public  inventory:Inventory = new Inventory(saves);
		public  masturbation:Masturbation = new Masturbation();
		public  pregnancyProgress:PregnancyProgression;
		public  bimboProgress:BimboProgression = new BimboProgression();
		
		// Scenes/Areas/
		public  commonEncounters:CommonEncounters = new CommonEncounters(); // Common dependencies go first
		
		public  bog:Bog;
		public  desert:Desert;
		public  forest:Forest;
		public  deepWoods:DeepWoods;
		public  glacialRift:GlacialRift = new GlacialRift();
		public  highMountains:HighMountains;
		public  lake:Lake;
		public  mountain:Mountain;
		public  plains:Plains;
		public  swamp:Swamp;
		public  volcanicCrag:VolcanicCrag;
		
		public  exploration:Exploration = new Exploration(); //Goes last in order to get it working.
		// Scenes/Combat/
		public  combat:Combat = new Combat();
		// Scenes/Dungeons
		public  brigidScene:BrigidScene = new BrigidScene();
		public  lethicesKeep:LethicesKeep = new LethicesKeep();
		// Scenes/Explore/
		public  gargoyle:Gargoyle = new Gargoyle();
		public  lumi:Lumi = new Lumi();
		public  giacomoShop:Giacomo = new Giacomo();
		// Scenes/Monsters/
		public  demonSoldierScene:DemonSoldierScene = new DemonSoldierScene();
		public  goblinScene:GoblinScene = new GoblinScene();
		public  goblinSpecialScene:GoblinSpecialScene = new GoblinSpecialScene();
		public  goblinElderScene:PriscillaScene = new PriscillaScene();
		public  impScene:ImpScene;
		public  mimicScene:MimicScene = new MimicScene();
		public  succubusScene:SuccubusScene = new SuccubusScene();
		
		/**
		 * DO NOT REMOVE OR COMMENT OUT!
		 * 
		 * This definition causes the class to be compiled,
		 * so breaking changes will cause the build to fail.
		 */
		private  plantGirlScene:PlantGirlScene;
		/**
		 * DO NOT REMOVE OR COMMENT OUT!
		 * 
		 * This definition causes the class to be compiled,
		 * so breaking changes will cause the build to fail.
		 */
		private  goblinQueen:GoblinQueen;

		// Scenes/NPC/
		public  amilyScene:AmilyScene;
		public  anemoneScene:AnemoneScene;
		public  arianScene:ArianScene = new ArianScene();
		public  ceraphScene:CeraphScene = new CeraphScene();
		public  ceraphFollowerScene:CeraphFollowerScene = new CeraphFollowerScene();
		public  emberScene:EmberScene;
		public  exgartuan:Exgartuan = new Exgartuan();
		public  helFollower:HelFollower = new HelFollower();
		public  helScene:HelScene = new HelScene();
		public  helSpawnScene:HelSpawnScene = new HelSpawnScene();
		public  holliScene:HolliScene = new HolliScene();
		public  isabellaScene:IsabellaScene = new IsabellaScene();
		public  isabellaFollowerScene:IsabellaFollowerScene = new IsabellaFollowerScene();
		public  izmaScene:IzmaScene;
		public  jojoScene:JojoScene;
		public  joyScene:JoyScene = new JoyScene();
		public  kihaFollower:KihaFollower = new KihaFollower();
		public  kihaScene:KihaScene = new KihaScene();
		public  latexGirl:LatexGirl = new LatexGirl();
		public  marbleScene:MarbleScene;
		public  marblePurification:MarblePurification = new MarblePurification();
		public  milkWaifu:MilkWaifu = new MilkWaifu();
		public  raphael:Raphael = new Raphael();
		public  rathazul:Rathazul = new Rathazul();
		public  sheilaScene:SheilaScene = new SheilaScene();
		public  shouldraFollower:ShouldraFollower = new ShouldraFollower();
		public  shouldraScene:ShouldraScene = new ShouldraScene();
		public  sophieBimbo:SophieBimbo = new SophieBimbo();
		public  sophieFollowerScene:SophieFollowerScene = new SophieFollowerScene();
		public  sophieScene:SophieScene = new SophieScene();
		public  urta:UrtaScene = new UrtaScene();
		public  urtaHeatRut:UrtaHeatRut = new UrtaHeatRut();
		public  urtaPregs:UrtaPregs;
		public  valeria:Valeria = new Valeria();
		public  vapula:Vapula = new Vapula();
		// Scenes/Places/
		public  bazaar:Bazaar = new Bazaar();
		public  boat:Boat = new Boat();
		public  farm:Farm;
		public  owca:Owca = new Owca();
		public  telAdre:TelAdre;
		public  ingnam:Ingnam = new Ingnam();
		public  prison:Prison = new Prison();
		public  townRuins:TownRuins = new TownRuins();
		public  betaZone:BetaZone = new BetaZone();
		// Scenes/Seasonal/
		public  aprilFools:AprilFools = new AprilFools();
		public  fera:Fera = new Fera();
		public  thanksgiving:Thanksgiving = new Thanksgiving();
		public  valentines:Valentines = new Valentines();
		public  xmas:XmasBase = new XmasBase();
		// Scenes/Quests/
		public  urtaQuest:UrtaQuest = new UrtaQuest();
		
		public  mainMenu:MainMenu = new MainMenu();
		public  gameSettings:GameSettings = new GameSettings();
		public  debugMenu:DebugMenu = new DebugMenu();
		public  crafting:Crafting = new Crafting();
		
		// Force updates in Pepper Flash ahuehue
		private  _updateHack:Sprite = new Sprite();
		
		public  mainViewManager:MainViewManager = new MainViewManager();
		//Scenes in includes folder GONE! Huzzah!
		
		public  bindings:Bindings = new Bindings();
		public  output:Output = Output.init();
		public  credits:Credits = Credits.init();
		/****
		   This is used purely for bodges while we get things cleaned up.
		   Hopefully, anything you stick to this object can be removed eventually.
		   I only used it because for some reason the Flash compiler wasn't seeing
		   certain functions, even though they were in the same scope as the
		  function  calling them.
		 ****/
		
		public  mainView:MainView;
		
		public  parser:Parser;
		
		// ALL THE VARIABLES:
		// Declare the various global variables as class variables.
		// Note that they're set up in the constructor, not here.
		public  debug: boolean;
		public  ver: string;
		public  version: string;
		public  versionID:uint = 0;
		public  permObjVersionID:uint = 0;
		public  mobile: boolean;
		public  images:ImageManager;
		public  player:Player;
		public  player2:Player;
		public  monster:Monster;
		public  monster2:Monster;
		public  monster3:Monster;
		public  monster4:Monster;
		public  flags:DefaultDict;
		public  achievements:DefaultDict;
		private  _gameState: number;
		
		public  get gameState(): number
		{
			return _gameState;
		}
		public  time:Time;
		
		public  temp: number;
		public  args: any[];
		public  funcs: any[];
		public  oldStats: any; // I *think* this is a generic object
		public  inputManager:InputManager;
		
		public  kFLAGS_REF: any;
		public  kACHIEVEMENTS_REF: any;

		public  clearOutput(): void
		{
			output.clear(true);
		}

		public  rawOutputText(text: string): void
		{
			output.raw(text);
		}

		public  outputText(text: string): void
		{
			output.text(text);
		}

		public  displayHeader(string: string): void
		{
			output.text(output.formatHeader(string));
		}

		public  formatHeader(string: string): string
		{
			return output.formatHeader(string);
		}

		public  get inCombat(): boolean
		{
			return _gameState == 1;
		}
		
		public  set inCombat(value: boolean): void
		{
			_gameState = (value ? 1 : 0);
		}
		
		public  gameStateDirectGet(): number
		{
			return _gameState;
		}
		
		public  gameStateDirectSet(value: number): void
		{
			_gameState = value;
		}
		
		public  rand(max: number): number
		{
			return Utils.rand(max);
		}
		
		//System time
		public  date:Date = new Date();
		
		//Mod save version.
		public  modSaveVersion: number = 16;
		public  levelCap: number = 120;
		
		//dungeoneering variables (If it ain't broke, don't fix it)
		public  inDungeon: boolean = false;
		public  dungeonLoc: number = 0;
		
		// To save shitting up a lot of code...
		public  inRoomedDungeon: boolean = false;
		public  inRoomedDungeonResume = undefined;
		public  inRoomedDungeonName: string = "";
		
		public  timeQ: number = 0;
		public  campQ: boolean = false;
		
		private static  traceTarget:TraceTarget;
		
		private static  setUpLogging(): void
		{
			traceTarget = new TraceTarget();
			
			traceTarget.level = LogEventLevel.WARN;
			
			CONFIG::debug
			{
				traceTarget.level = LogEventLevel.DEBUG;
			}
			
			//Add date, time, category, and log level to the output
			traceTarget.includeDate = true;
			traceTarget.includeTime = true;
			traceTarget.includeCategory = true;
			traceTarget.includeLevel = true;
			
			// let the logging begin!
			Log.addTarget(traceTarget);
		}

		/**
		 * Create scenes that use the new pregnancy system. This method is public to allow for simple testing.
		 * @param pregnancyProgress Pregnancy progression to use for scenes, which they use to register themself
		 */
		public  createScenes(pregnancyProgression:PregnancyProgression): void {
			dungeons = new DungeonCore(pregnancyProgression);
			
			bog = new Bog(pregnancyProgression, output);
			mountain = new Mountain(pregnancyProgression, output);
			highMountains = new HighMountains(pregnancyProgression, output);
			volcanicCrag = new VolcanicCrag(pregnancyProgression, output);
			swamp = new Swamp(pregnancyProgression, output);
			plains = new Plains(pregnancyProgression, output);
			forest = new Forest(pregnancyProgression, output);
			deepWoods = new DeepWoods(forest);
			desert = new Desert(pregnancyProgression, output);
			
			telAdre = new TelAdre(pregnancyProgression);
			farm = new Farm(output);
			
			impScene = new ImpScene(pregnancyProgression, output);
			anemoneScene = new AnemoneScene(pregnancyProgression, output);
			marbleScene = new MarbleScene(pregnancyProgression, output);
			jojoScene = new JojoScene(pregnancyProgression, output);
			amilyScene = new AmilyScene(pregnancyProgression, output);
			izmaScene = new IzmaScene(pregnancyProgression, output);
			lake = new Lake(pregnancyProgression, output);

			// not assigned to a variable as it is self-registering, PregnancyProgress will keep a reference to the instance
			new PlayerCentaurPregnancy(pregnancyProgression, output);
			new PlayerBunnyPregnancy(pregnancyProgression, output, mutations);
			new PlayerBenoitPregnancy(pregnancyProgression, output);
			new PlayerOviElixirPregnancy(pregnancyProgression, output);
			
			emberScene = new EmberScene(pregnancyProgression);
			urtaPregs = new UrtaPregs(pregnancyProgression);
		}
		
		/**
		 * Create the main game instance.
		 * If a stage is injected it will be use instead of the one from the superclass.
		 *
		 * @param injectedStage if not undefined, it will be used instead of this.stage
		 */
		public  CoC(injectedStage:Stage = undefined)
		{
		var  stageToUse:Stage;
			
			if (injectedStage != undefined)
			{
				stageToUse = injectedStage;
			}
			else
			{
				stageToUse = this.stage;
			}
			
			// Cheatmode.
			kGAMECLASS = this;
			
			this.pregnancyProgress = new PregnancyProgression();
			createScenes(pregnancyProgress);
			
			useables = new UseableLib();
			
			this.kFLAGS_REF = kFLAGS;
			this.kACHIEVEMENTS_REF = kACHIEVEMENTS;
			// cheat for the parser to be able to find kFLAGS
			// If you're not the parser, DON'T USE THIS
			
			this.parser = new Parser(this, CoC_Settings);
			
			try
			{
				this.mainView = new MainView( /*this.model*/);
				if (GameSettings.charviewEnabled)
					this.mainView.charView.reload();
			}
			catch (e:Error)
			{
				throw Error(e.getStackTrace());
			}
			this.mainView.name = "mainView";
			this.mainView.addEventListener(Event.ADDED_TO_STAGE, Utils.curry(_postInit, stageToUse));
			stageToUse.addChild(this.mainView);
		}
		
		private  _postInit(stageToUse:DisplayObjectContainer, e:Event): void
		{
			// Hooking things to MainView.
			this.mainView.onNewGameClick = charCreation.newGameGo;
			this.mainView.onAppearanceClick = playerAppearance.appearance;
			this.mainView.onDataClick = saves.saveLoad;
			this.mainView.onLevelClick = playerInfo.levelUpGo;
			this.mainView.onPerksClick = playerInfo.displayPerks;
			this.mainView.onStatsClick = playerInfo.displayStats;
			this.mainView.onBottomButtonClick = function(i: number): void
			{
				output.record("<br>[" + output.button(i).labelText + "]<br>");
			};
			
			// Set up all the messy global stuff:
			
			// ******************************************************************************************
			
		var  mainView:MainView = this.mainView;

			/**
			 * Global Variables used across the whole game. I hope to whittle it down slowly.
			 */
			
			/**
			 * System Variables
			 * Debug, Version, etc
			 */
			debug = false; //DEBUG, used all over the place
			ver = "1.0.2_mod_1.4.17"; //Version NUMBER
			version = ver + " (<b>Prettah Level Up</b>)"; //Version TEXT
			
			//Indicates if building for mobile?
			mobile = false;
			
			this.images = new ImageManager(stageToUse.stage, mainView);
			this.inputManager = new InputManager(stageToUse.stage, mainView, false);
			include "../../includes/ControlBindings.as";
			
			//} endregion
			
			/**
			 * Player specific variables
			 * The player object and variables associated with the player
			 */
			//{ region PlayerVariables
			
			//The Player object, used everywhere
			player = new Player();
			player2 = new Player();
			playerEvent = new PlayerEvents();
			
			//Used in perk selection, mainly eventParser, input and engineCore
			//tempPerk = undefined;
			
			//Create monster, used all over the place
			monster = new Monster();
			//} endregion
			
			/**
			 * State Variables
			 * They hold all the information about item states, menu states, game states, etc
			 */
			//{ region StateVariables
			
			//User all over the place whenever items come up
			
			//The extreme flag state array. This needs to go. Holds information about everything, whether it be certain attacks for NPCs 
			//or state information to do with the game. 
			flags = new DefaultDict();
			achievements = new DefaultDict();
			
			/**
			 * Used everywhere to establish what the current game state is
			 * 0 = normal
			 * 1 = in combat
			 * 2 = in combat in grapple
			 * 3 = at start or game over screen
			 */
			_gameState = 0;
			
			/**
			 * Display Variables
			 * Variables that hold display information like number of days and all the current displayed text
			 */
			//{ region DisplayVariables
			
			//Holds the date and time display in the bottom left
			time = new Time();
			
			//The string holds all the "story" text, mainly used in engineCore
			//}endregion
			
			// These are toggled between by the [home] key.
			mainView.textBGTranslucent.visible = true;
			mainView.textBGWhite.visible = false;
			mainView.textBGTan.visible = false;
			
			// *************************************************************************************
			//Workaround.
			mainViewManager.registerShiftKeys();
			exploration.configureRooms();
			lethicesKeep.configureRooms();
			dungeons.map = new DungeonMap();
			
			temp = 0; //Fenoxo loves his temps
			
			//Used to set what each action buttons displays and does.
			args = [];
			funcs = [];
			
			//Used for stat tracking to keep up/down arrows correct.
			oldStats = {};
			oldStats.oldStr = 0;
			oldStats.oldTou = 0;
			oldStats.oldSpe = 0;
			oldStats.oldInte = 0;
			oldStats.oldSens = 0;
			oldStats.oldLib = 0;
			oldStats.oldCor = 0;
			oldStats.oldHP = 0;
			oldStats.oldLust = 0;
			oldStats.oldFatigue = 0;
			oldStats.oldHunger = 0;
			
			//model.maxHP = maxHP;
			
			// ******************************************************************************************
			
			mainView.aCb.items = [{label: "TEMP", perk: new Perk(PerkLib.Acclimation)}];
			mainView.aCb.addEventListener(Event.SELECT, playerInfo.changeHandler);
			
			//Register the classes we need to be able to serialize and reconstitute so
			// they'll get reconstituted into the correct class when deserialized
			registerClassAlias("Ass", Ass);
			registerClassAlias("Character", Character);
			registerClassAlias("Cock", Cock);
			registerClassAlias("CockTypesEnum", CockTypesEnum);
			registerClassAlias("Enum", Enum);
			registerClassAlias("Creature", Creature);
			registerClassAlias("ItemSlot", ItemSlot);
			registerClassAlias("KeyItem", KeyItem);
			registerClassAlias("Monster", Monster);
			registerClassAlias("Player", Player);
			registerClassAlias("StatusEffect", StatusEffect);
			registerClassAlias("Vagina", Vagina);
			
			//Hide sprites
			mainView.hideSprite();
			//Hide up/down arrows
			mainView.statsView.hideUpDown();
			
			this.addFrameScript(0, this.run);
		}
		
		public  run(): void
		{
			//Set up stage
			stage.focus = kGAMECLASS.mainView.mainText;
			mainView.eventTestInput.x = -10207.5;
			mainView.eventTestInput.y = -1055.1;
			mainViewManager.startUpButtons();
			saves.loadPermObject();
			mainViewManager.setTheme();
			mainView.setTextBackground(flags[kFLAGS.TEXT_BACKGROUND_STYLE]);
			//Now enter the main menu.
			mainMenu.mainMenu();
			
			this.stop();
			
			if (_updateHack)
			{
				_updateHack.name = "wtf";
				_updateHack.graphics.beginFill(0xFF0000, 1);
				_updateHack.graphics.drawRect(0, 0, 2, 2);
				_updateHack.graphics.endFill();
				
				stage.addChild(_updateHack);
				_updateHack.x = 999;
				_updateHack.y = 799;
			}
		}
		
		public  forceUpdate(): void
		{
			_updateHack.x = 999;
			_updateHack.addEventListener(Event.ENTER_FRAME, moveHackUpdate);
		}
		
		public  moveHackUpdate(e:Event): void
		{
			_updateHack.x -= 84;
			
			if (_updateHack.x < 0)
			{
				_updateHack.x = 0;
				_updateHack.removeEventListener(Event.ENTER_FRAME, moveHackUpdate);
			}
		}
		
		public  spriteSelect(choice: Record<string, any> = 0): void
		{
			// Inlined call from lib/src/coc/view/MainView.as
			// TODO: When flags goes away, if it goes away, replace this with the appropriate settings thing.
			if (choice <= 0 || choice == undefined || flags[kFLAGS.SHOW_SPRITES_FLAG] == 0)
			{
				mainViewManager.hideSprite();
			}
			else
			{
				if (choice is Class)
				{
					mainViewManager.showSpriteBitmap(SpriteDb.bitmapData(choice as Class));
				}
				else
				{
					mainViewManager.hideSprite();
				}
			}
		}
		
		// TODO remove once that GuiInput interface has been sorted
		public  addButton(pos: number, text: string = "", func1 = undefined, arg1: any = -9000, arg2: any = -9000, arg3: any = -9000, toolTipText: string = "", toolTipHeader: string = ""):CoCButton {
			return output.addButton(pos, text, func1, arg1, arg2, arg3, toolTipText, toolTipHeader);
		}
		
		// TODO remove once that GuiInput interface has been sorted
		public  menu(): void {
			output.menu();
		}
	}

