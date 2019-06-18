	/**
	 * Quick hacky method to wrap new content in a class-based structure
	 * BaseContent acts as an access wrapper around CoC, enabling children of BaseContent to interact with
	 * function instances/properties of CoC in the same manner older content does with the minimal amount
	 * of modification.
	 * Also this means we might start being able to get IDE autocomplete shit working again! Huzzah!
	 * @author Gedan
	 */
	export class BaseContent extends Utils
	{
		public  BaseContent()
		{
			
		}
		protected  getGame():CoC
		{
			return kGAMECLASS;
		}

		protected  cheatTime(time: number, needNext: boolean = false): void
		{
			kGAMECLASS.cheatTime(time, needNext);
		}

		protected  get output():Output
		{
			return kGAMECLASS.output;
		}

		protected  get credits():Credits
		{
			return kGAMECLASS.credits;
		}

		protected  get timeQ(): number
		{
			return kGAMECLASS.timeQ;
		}

		protected  get camp():Camp {
			return kGAMECLASS.camp;
		}
		
		protected  get ingnam():Ingnam {
			return kGAMECLASS.ingnam;
		}
		
		protected  get prison():Prison {
			return kGAMECLASS.prison;
		}
		
		protected  get lethicesKeep():LethicesKeep {
			return kGAMECLASS.lethicesKeep;
		}

		protected  get combat():Combat
		{
			return kGAMECLASS.combat;
		}

		protected  get mutations():Mutations
		{
			return kGAMECLASS.mutations;
		}

		public  goNext(time: number,defNext: boolean): boolean
		{
			return kGAMECLASS.goNext(time,defNext);
		}
		
		protected  awardAchievement(title: string, achievement: number, display: boolean = true, nl: boolean = false, nl2: boolean = true): void
		{
			return kGAMECLASS.awardAchievement(title, achievement, display, nl, nl2);
		}
		
		protected  unlockCodexEntry(title: string, codexEntry: number, nlBefore: boolean = true, nlAfter: boolean = false): void
		{
			return kGAMECLASS.unlockCodexEntry(title, codexEntry, nlBefore, nlAfter);
		}
		
		//SEASONAL EVENTS!
		protected  isHalloween(): boolean {
			return kGAMECLASS.fera.isItHalloween();
		}

		protected  isValentine(): boolean {
			return kGAMECLASS.valentines.isItValentine();
		}

		protected  isHolidays(): boolean {
			return kGAMECLASS.xmas.isItHolidays();
		}

		protected  isEaster(): boolean {
			return kGAMECLASS.plains.bunnyGirl.isItEaster();
		}

		protected  isThanksgiving(): boolean {
			return kGAMECLASS.thanksgiving.isItThanksgiving();
		}

		protected  isAprilFools(): boolean {
			return kGAMECLASS.aprilFools.isItAprilFools();
		}
		
		protected  get date():Date
		{
			return kGAMECLASS.date;
		}

		//Curse you, CoC updates!
		protected  get inDungeon(): boolean
		{
			return kGAMECLASS.inDungeon;
		}
		protected  set inDungeon(v: boolean): void
		{
			kGAMECLASS.inDungeon = v;
		}
		
		protected  get inRoomedDungeon(): boolean
		{
			return kGAMECLASS.inRoomedDungeon;
		}
		protected  set inRoomedDungeon(v: boolean): void
		{
			kGAMECLASS.inRoomedDungeon = v;
		}
		
		protected  get inRoomedDungeonResume()
		{
			return kGAMECLASS.inRoomedDungeonResume;
		}
		protected  set inRoomedDungeonResume(v): void
		{
			kGAMECLASS.inRoomedDungeonResume = v;
		}

		protected  get inRoomedDungeonName(): string
		{
			return kGAMECLASS.inRoomedDungeonName;
		}
		protected  set inRoomedDungeonName(v: string): void
		{
			kGAMECLASS.inRoomedDungeonName = v;
		}
		
		/**
		 * Displays the sprite on the lower-left corner.
		 * Can accept frame index or SpriteDb.s_xxx (class extends Bitmap)
		 * */
		protected  spriteSelect(choice: Record<string, any> = 0): void
		{
			kGAMECLASS.spriteSelect(choice);
		}
		
		/** Refreshes the stats panel. */
		protected  statScreenRefresh(): void
		{
			kGAMECLASS.output.statScreenRefresh();
		}
		
		/** Displays the stats panel. */
		protected  showStats(): void
		{
			kGAMECLASS.output.showStats();
		}

		/** Hide the stats panel. */
		protected  hideStats(): void
		{
			kGAMECLASS.output.hideStats();
		}
		
		/** Hide the up/down arrows. */
		protected  hideUpDown(): void
		{
			kGAMECLASS.output.hideUpDown();
		}

		/** Create a function that will pass one argument. */
		protected  createCallBackFunction(func, arg: any, arg2: any = undefined, arg3: any = undefined)
		{
			return kGAMECLASS.createCallBackFunction(func, arg, arg2, arg3);
		}

		protected  doSFWloss(): boolean {
			return kGAMECLASS.doSFWloss();
		}
		
		protected  isPeaceful(): boolean {
			return kGAMECLASS.isPeaceful();
		}
		
		/**
		 * Start a new combat.
		 * @param	monster_ The new monster to be initialized.
		 * @param	plotFight_ Determines if the fight is important. Also prevents randoms from overriding uniques.
		 */
		protected  startCombat(monster_:Monster,plotFight_: boolean=false): void{
			kGAMECLASS.combat.beginCombat(monster_, plotFight_);
		}
		
		protected  startCombatImmediate(monster:Monster, _plotFight: boolean = false): void
		{
			kGAMECLASS.combat.beginCombatImmediate(monster, _plotFight);
		}

		protected  displayHeader(text: string): void
		{
			kGAMECLASS.output.header(text);
		}
		
		// Needed in a few rare cases for dumping text coming from a source that can't properly escape it's brackets
		// (Mostly traceback printing, etc...)
		protected  rawOutputText(text: string): void
		{
			kGAMECLASS.output.raw(text);
		}

		protected  outputText(output: string): void
		{
			kGAMECLASS.output.text(output);
		}
		
		protected  clearOutput(): void
		{
			kGAMECLASS.output.clear();
			kGAMECLASS.mainView.clearOutputText();
		}

		protected  doNext(eventNo): void //Now typesafe
		{
			kGAMECLASS.output.doNext(eventNo);
		}
		
		/**
		 * Hides all bottom buttons.
		 * 
		 * <b>Note:</b> Calling this with open formatting tags can result in strange behaviour, 
		 * e.g. all text will be formatted instead of only a section.
		 */
		protected  menu(): void
		{
			kGAMECLASS.output.menu();
		}

		protected  hideMenus(): void
		{
			kGAMECLASS.output.hideMenus();
		}
		
		protected  doYesNo(eventYes, eventNo): void { //Now typesafe
			kGAMECLASS.output.doYesNo(eventYes, eventNo);
		}

		protected  addButton(pos: number, text: string = "", func1 = undefined, arg1: any = -9000, arg2: any = -9000, arg3: any = -9000, toolTipText: string = "", toolTipHeader: string = ""):CoCButton
		{
			return kGAMECLASS.output.addButton(pos, text, func1, arg1, arg2, arg3, toolTipText, toolTipHeader);
		}
		
		protected  addButtonDisabled(pos: number, text: string = "", toolTipText: string = "", toolTipHeader: string = ""):CoCButton
		{
			return kGAMECLASS.output.addButtonDisabled(pos, text, toolTipText, toolTipHeader);
		}
		protected  addDisabledButton(pos: number, text: string = "", toolTipText: string = "", toolTipHeader: string = ""):CoCButton
		{
			return kGAMECLASS.output.addButtonDisabled(pos, text, toolTipText, toolTipHeader);
		}
		protected  button(pos: number):CoCButton
		{
			return kGAMECLASS.output.button(pos);
		}
		
		protected  removeButton(arg: any): void
		{
			kGAMECLASS.output.removeButton(arg);
		}
		
		protected  openURL(url: string): void{
			return kGAMECLASS.openURL(url);
		}
		
		/**
		 * Apply statmods to the player. dynStats wraps the regular stats call, but supports "named" arguments of the form: any 		"statname", value.
		 * Exclusively supports either long or short stat names with a single call.
		 * "str", "lib" "lus", "cor" etc
		 * "strength, "libido", lust", "corruption"
		 * Specify the stat you wish to modify and follow it with the value.
		 * Separate each stat and value with a comma, and each stat/value pair, again, with a comma.
		 * eg: dynStats("str", 10, "lust" -100); will add 10 to str and subtract 100 from lust
		 * Also support operators could be appended with + - * /=
		 * eg: dynStats("str+", 1, "tou-", 2, "spe*", 1.1, "int/", 2, "cor=", 0)
		 *     will add 1 to str, subtract 2 from tou, increase spe by 10%, decrease int by 50%, and set cor to 0
		 * 
		 * @param	... args
		 * @return Object of (newStat-oldStat) with keys str, tou, spe, int, lib, sen, lus, cor
		 */
		protected  dynStats(... args): Record<string, any>
		{
			// Bullshit to unroll the incoming array
			return kGAMECLASS.dynStats.apply(undefined, args);
		}

		protected  silly(): boolean
		{
			return kGAMECLASS.silly();
		}
		
		protected  playerMenu(): void { 
			kGAMECLASS.mainMenu.hideMainMenu();
			kGAMECLASS.playerMenu();
		}
		
		protected  get player():Player
		{
			return kGAMECLASS.player;
		}
		
		/**
		 * This is alias for player.
		 */
		protected  get pc():Player
		{
			return kGAMECLASS.player;
		}
		
		protected  set player(val:Player): void
		{
			kGAMECLASS.player = val;
		}
		
		protected  get player2():Player
		{
			return kGAMECLASS.player2;
		}
		
		protected  set player2(val:Player): void
		{
			kGAMECLASS.player2 = val;
		}
		
		protected  get debug(): boolean
		{
			return kGAMECLASS.debug;
		}
		
		protected  set debug(val: boolean): void
		{
			kGAMECLASS.debug = val;
		}
		
		protected  get ver(): string
		{
			return kGAMECLASS.ver;
		}
		
		protected  set ver(val: string): void
		{
			kGAMECLASS.ver = val;
		}
		
		protected  get images():ImageManager
		{
			return kGAMECLASS.images;
		}
		
		protected  set images(val:ImageManager): void
		{
			kGAMECLASS.images = val;
		}
		
		protected  get monster():Monster { return kGAMECLASS.monster; }
		protected  get monster2():Monster { return kGAMECLASS.monster2; }
		protected  get monster3():Monster { return kGAMECLASS.monster3; }
		protected  get monster4():Monster { return kGAMECLASS.monster4; }
		
		/**
		 * This is alias for monster.
		 */
		protected  get enemy():Monster { return kGAMECLASS.monster; }
		protected  get enemy2():Monster { return kGAMECLASS.monster2; }
		protected  get enemy3():Monster { return kGAMECLASS.monster3; }
		protected  get enemy4():Monster { return kGAMECLASS.monster4; }
		
		protected  set monster(val:Monster): void { kGAMECLASS.monster = val; }
		protected  set monster2(val:Monster): void { kGAMECLASS.monster2 = val; }
		protected  set monster3(val:Monster): void { kGAMECLASS.monster3 = val; }
		protected  set monster4(val:Monster): void { kGAMECLASS.monster4 = val; }

		protected  get consumables():ConsumableLib{
			return kGAMECLASS.consumables;
		}
		protected  get useables():UseableLib{
			return kGAMECLASS.useables;
		}
		protected  get weapons():WeaponLib{
			return kGAMECLASS.weapons;
		}
		protected  get armors():ArmorLib{
			return kGAMECLASS.armors;
		}
		protected  get jewelries():JewelryLib{
			return kGAMECLASS.jewelries;
		}
		protected  get shields():ShieldLib{
			return kGAMECLASS.shields;
		}
		protected  get undergarments():UndergarmentLib{
			return kGAMECLASS.undergarments;
		}
		protected  get inventory():Inventory{
			return kGAMECLASS.inventory;
		}
		
		protected  get time():Time
		{
			return kGAMECLASS.time;
		}
		
		protected  set time(val:Time): void
		{
			kGAMECLASS.time = val;
		}
		
		protected  get temp(): number
		{
			return kGAMECLASS.temp;
		}
		
		protected  set temp(val: number): void
		{
			kGAMECLASS.temp = val;
		}
		
		protected  get args(): any[]
		{
			return kGAMECLASS.args;
		}
		
		protected  set args(val: any[]): void
		{
			kGAMECLASS.args = val;
		}
		
		protected  get funcs(): any[]
		{
			return kGAMECLASS.funcs;
		}
		
		protected  set funcs(val: any[]): void
		{
			kGAMECLASS.funcs = val;
		}
		
		protected  get mainView():MainView
		{
			return kGAMECLASS.mainView;
		}

		protected  get mainViewManager():MainViewManager
		{
			return kGAMECLASS.mainViewManager;
		}
		
		protected  get flags():DefaultDict
		{
			return kGAMECLASS.flags;
		}
		
		protected  set flags(val:DefaultDict): void
		{
			kGAMECLASS.flags = val;
		}
		
		protected  get achievements():DefaultDict
		{
			return kGAMECLASS.achievements;
		}
		
		protected  set achievements(val:DefaultDict): void
		{
			kGAMECLASS.achievements = val;
		}
		
		protected  showStatDown(arg: string): void
		{
			kGAMECLASS.mainView.statsView.showStatDown(arg);
		}
		
		protected  showStatUp(arg: string): void
		{
			kGAMECLASS.mainView.statsView.showStatUp(arg);
		}
		
				
		/**
		 * PRIMO BULLSHIT FUNCTION ACCESS
		 */
		// Need to work out a better way of doing this -- I THINK maybe treating external functions as a string and calling
		// addButton like "addButton(0, "thing", "thisFunc");" might be a way to do it -- check if Func var is a Func type in this.addbutton args
		// if it is, pass it into kGAMECLASS, if it isn't, check if string. If it is, use the string to pull the func from kGAMECLASS
		// before passing it into addbutton etc.
		// Going the string route also makes it... not awful to call into other content classes too - split string on . and chain
		// lookups into objects ie "umasShop.firstVisitPart1" -> kGAMECLASS["umasShop"].["firstVisitPart1"]()
		// @aimozg: but kGAMECLASS.umasShop.firstVisistPart1 instead of String is compile-time safe.
		// Clearly this isn't going to fly long term, but it's... functional for now.

	}


