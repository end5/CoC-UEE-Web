/****
 coc.view.MainView

 I have no real idea yet what eventTestInput is for,
 but its coordinates get tested for in places, and set in others.
 Perhaps some day I'll ask.

 It's for allowing people to test stuff in the parser. It gets moved into view, and you
 can enter stuff in the text window, which then gets fed through the parser.

 That's good to know.  Cheers.
 ****/






export class MainView extends Block {
	[Embed(source="../../../res/ui/CoCLogo.png")]
	public static  GameLogo:Class;
	[Embed(source="../../../res/ui/disclaimer-bg.png")]
	public static  DisclaimerBG:Class;
	[Embed(source="../../../res/ui/warning.png")]
	public static  Warning:Class;
	
	[Embed(source="../../../res/ui/background1.jpg")]
	public static  Background1:Class;
	[Embed(source="../../../res/ui/background2.png")]
	public static  Background2:Class;
	[Embed(source="../../../res/ui/background3.png")]
	public static  Background3:Class;
	[Embed(source="../../../res/ui/background4.png")]
	public static  Background4:Class;
	[Embed(source="../../../res/ui/backgroundKaizo.png")]
	public static  BackgroundKaizo:Class;
	public static  Backgrounds: any[] = [Background1, Background2, Background3, Background4, undefined, BackgroundKaizo];

	[Embed(source="../../../res/ui/button0.jpg")]
	public static  ButtonBackground0:Class;
	[Embed(source="../../../res/ui/button1.jpg")]
	public static  ButtonBackground1:Class;
	[Embed(source="../../../res/ui/button2.jpg")]
	public static  ButtonBackground2:Class;
	[Embed(source="../../../res/ui/button3.jpg")]
	public static  ButtonBackground3:Class;
	[Embed(source="../../../res/ui/button4.jpg")]
	public static  ButtonBackground4:Class;
	[Embed(source="../../../res/ui/button5.jpg")]
	public static  ButtonBackground5:Class;
	[Embed(source="../../../res/ui/button6.jpg")]
	public static  ButtonBackground6:Class;
	[Embed(source="../../../res/ui/button7.jpg")]
	public static  ButtonBackground7:Class;
	[Embed(source="../../../res/ui/button8.jpg")]
	public static  ButtonBackground8:Class;
	[Embed(source="../../../res/ui/button9.jpg")]
	public static  ButtonBackground9:Class;
	public static  ButtonBackgrounds: any[] = [
		ButtonBackground0,
		ButtonBackground1,
		ButtonBackground2,
		ButtonBackground3,
		ButtonBackground4,
		ButtonBackground5,
		ButtonBackground6,
		ButtonBackground7,
		ButtonBackground8,
		ButtonBackground9,
	];

	/*
	 * Feature switches
	 */
	
	/*
	 * Feature switch for sliding monster stat window.
	 * Was disabled due to main text view issues.
	 */
	private static  FEATURE_ANIMATED_MONSTER_STATS: boolean = false;

	// Menu button names.
	public static  MENU_NEW_MAIN: string   = 'newGame';
	public static  MENU_DATA: string       = 'data';
	public static  MENU_STATS: string      = 'stats';
	public static  MENU_LEVEL: string      = 'level';
	public static  MENU_PERKS: string      = 'perks';
	public static  MENU_APPEARANCE: string = 'appearance';


	public static  GAP: number   = 4;
	public static  BTN_W: number = 150;
	public static  BTN_H: number = 40;

	public static  SCREEN_W: number = 1000;
	public static  SCREEN_H: number = 800;

	public static  TOPROW_Y: number       = 0;
	public static  TOPROW_H: number       = 50;
	public static  TOPROW_NUMBTNS: number = 6;

	public static  STATBAR_W: number = 205;
	public static  STATBAR_Y: number = TOPROW_Y + TOPROW_H;
	public static  STATBAR_H: number = 600;

	/*
	 // I'd like to have the position calculable, but the borders are part of the bg picture so have to use magic numbers
	 public static  TEXTZONE_X: number = STATBAR_RIGHT; // left = statbar right
	 public static  TEXTZONE_Y: number = TOPROW_BOTTOM; // top = toprow bottom
	 public static  TEXTZONE_W: number = 770; // width = const
	 public static  TEXTZONE_H: number = SCREEN_H - TOPROW_H - BOTTOM_H; // height = screen height - toprow height - buttons height, so calculated later
	 */
	public static  TEXTZONE_X: number = 208; // left = const
	public static  TEXTZONE_Y: number = 52; // top = const
	public static  TEXTZONE_W: number = 769; // width = const
	public static  VSCROLLBAR_W: number = 15;
	public static  TEXTZONE_H: number = 602; // height = const

	public static  SPRITE_W: number = 80;
	public static  SPRITE_H: number = 80;
	public static  SPRITE_X: number = GAP;
	public static  SPRITE_Y: number = SCREEN_H - SPRITE_H - GAP;

	public static  CREDITS_X: number = GAP;
	public static  CREDITS_Y: number = STATBAR_Y + STATBAR_H + GAP;
	public static  CREDITS_W: number = STATBAR_W - GAP;
	public static  CREDITS_H: number = SPRITE_Y - CREDITS_Y;

	public static  TOPROW_W: number = STATBAR_W + 2 * GAP + TEXTZONE_W;

	public static  BOTTOM_X: number         = STATBAR_W + GAP;
	public static  BOTTOM_COLS: number      = 5;
	public static  BOTTOM_ROWS: number      = 3;
	public static  BOTTOM_BUTTON_COUNT: number = BOTTOM_COLS * BOTTOM_ROWS;
	public static  BOTTOM_H: number         = (GAP + BTN_H) * BOTTOM_ROWS;
	public static  BOTTOM_W: number         = TEXTZONE_W;
	public static  BOTTOM_HGAP: number      = (BOTTOM_W - BTN_W * BOTTOM_COLS) / (2 * BOTTOM_COLS);
	public static  BOTTOM_Y: number         = SCREEN_H - BOTTOM_H;
	public static  MONSTER_X: number        = TEXTZONE_X + TEXTZONE_W + GAP;
	public static  MONSTER_Y: number        = TEXTZONE_Y;
	public static  MONSTER_W: number        = 200;
	public static  MONSTER_H: number        = TEXTZONE_H;


	private  blackBackground:BitmapDataSprite;
	public  textBGTranslucent:BitmapDataSprite;
	public  textBGWhite:BitmapDataSprite;
	public  textBGTan:BitmapDataSprite;
	public  background:BitmapDataSprite;
	public  sprite:BitmapDataSprite;

	public  mainText:TextField;
	public  nameBox:TextField;
	public  creditsBox:TextField;
	public  eventTestInput:TextField;
	public  aCb:ComboBox;
	public  monsterStatsView:MonsterStatsView;


	public  toolTipView:ToolTipView;
	public  statsView:StatsView;
	public  sideBarDecoration:Sprite;

	private  _onBottomButtonClick;//(index: number)=>void
	public  bottomButtons: any[];
	private  currentActiveButtons: any[];
	private  allButtons: any[];
	private  topRow:Block;
	public  newGameButton:CoCButton;
	public  dataButton:CoCButton;
	public  statsButton:CoCButton;
	public  levelButton:CoCButton;
	public  perksButton:CoCButton;
	public  appearanceButton:CoCButton;
	public  scrollBar:TextFieldVScroll;

	protected  callbacks: Record<string, any> = {};
	protected  options: Record<string, any>;

	public  charView:CharView;
	public  MainView() {
		super();
		addElement(blackBackground = new BitmapDataSprite({
			bitmapClass: ButtonBackground2,
			x          : -SCREEN_W,
			width      : SCREEN_W,
			height     : SCREEN_H,
			y          : -SCREEN_H,
			fillColor  : '#000000'
		}), {});
		addElement(background = new BitmapDataSprite({
			bitmapClass: Background1,
			width      : SCREEN_W,
			height     : SCREEN_H,
			fillColor  : 0,
			repeat     : true
		}));
		addElement(topRow = new Block({
			width  : TOPROW_W,
			height : TOPROW_H,
			layoutConfig: {
				type   : 'grid',
				cols   : 6,
				padding: GAP
			}
		}));
		topRow.addElement(newGameButton = new CoCButton({
			labelText  : 'New Game',
			toolTipText: "Start a new game.",
			bitmapClass: ButtonBackground1
		}));
		topRow.addElement(dataButton = new CoCButton({
			labelText  : 'Data',
			toolTipText: "Save or load your files.",
			bitmapClass: ButtonBackground2
		}));
		topRow.addElement(statsButton = new CoCButton({
			labelText  : 'Stats',
			toolTipText: "View your stats.",
			bitmapClass: ButtonBackground3
		}));
		topRow.addElement(levelButton = new CoCButton({
			labelText  : 'Level Up',
			bitmapClass: ButtonBackground4
		}));
		topRow.addElement(perksButton = new CoCButton({
			labelText  : 'Perks',
			toolTipText: "View your perks.",
			bitmapClass: ButtonBackground5
		}));
		topRow.addElement(appearanceButton = new CoCButton({
			labelText  : 'Appearance',
			toolTipText: "View your detailed appearance.",
			bitmapClass: ButtonBackground6
		}));
		addElement(textBGTranslucent = new BitmapDataSprite( {
			alpha    : 0.4,
			fillColor: '#FFFFFF',
			x        : TEXTZONE_X,
			y        : TEXTZONE_Y,
			width    : TEXTZONE_W,
			height   : TEXTZONE_H
		}));
		addElement(textBGWhite = new BitmapDataSprite({
			fillColor: '#FFFFFF',
			x        : TEXTZONE_X,
			y        : TEXTZONE_Y,
			width    : TEXTZONE_W,
			height   : TEXTZONE_H
		}));
		addElement(textBGTan = new BitmapDataSprite({
			fillColor: '#EBD5A6',
			x        : TEXTZONE_X,
			y        : TEXTZONE_Y,
			width    : TEXTZONE_W,
			height   : TEXTZONE_H
		}));
		mainText       = addTextField({
			multiline        : true,
			wordWrap         : true,
			x                : TEXTZONE_X,
			y                : TEXTZONE_Y,
			width            : TEXTZONE_W - VSCROLLBAR_W,
			height           : TEXTZONE_H,
			mouseEnabled     : true,
			defaultTextFormat: {
				size: 20
			}
		});
		creditsBox = addTextField({
			multiline        : true,
			wordWrap         : true,
			x                : CREDITS_X,
			y                : CREDITS_Y,
			width            : CREDITS_W,
			height           : CREDITS_H,
			mouseEnabled     : true,
			defaultTextFormat: {
				size: 16,
				font: 'Arial'
			}
		});
		scrollBar = new TextFieldVScroll(mainText);
		UIUtils.setProperties(scrollBar,{
			name: "scrollBar",
			direction: "vertical",
			x: mainText.x + mainText.width,
			y: mainText.y,
			height: mainText.height,
			width: VSCROLLBAR_W
		});
		addElement(scrollBar);
		nameBox        = addTextField({
			border      : true,
			background  : '#FFFFFF',
			type        : 'input',
			visible     : false,
			width       : 160,
			height      : 25,
			defaultTextFormat: {
				size: 16,
				font: 'Arial'
			}
		});
		eventTestInput = addTextField({
			type             : 'input',
			background       : '#FFFFFF',
			border           : 'true',
			visible          : false,
			text             : 'Paste event text & codes here.',
			x                : TEXTZONE_X,
			y                : TEXTZONE_Y,
			width            : TEXTZONE_W - VSCROLLBAR_W - GAP,
			height           : TEXTZONE_H - GAP,
			defaultTextFormat: {
				size: 16,
				font: 'Arial'
			}
		});
		addElement(sprite = new BitmapDataSprite({
			x      : SPRITE_X,
			y      : SPRITE_Y,
			stretch: true
		}));
		// Init subviews.
		this.statsView = new StatsView(this/*, this.model*/);
		this.statsView.y = STATBAR_Y;
		this.statsView.hide();
		this.addElement(this.statsView);

		this.monsterStatsView = new MonsterStatsView(this);
		this.monsterStatsView.hide();
		this.addElement(this.monsterStatsView);


		this.formatMiscItems();

		this.allButtons = [];

		createBottomButtons();
	var  button:CoCButton;
		for each (button in [newGameButton, dataButton, statsButton, levelButton, perksButton, appearanceButton]) {
			this.allButtons.push(button);
		}
		this.toolTipView = new ToolTipView(this/*, this.model*/);
		this.toolTipView.hide();
		this.addElement(this.toolTipView);

		// hook!
		hookBottomButtons();
		hookAllButtons();
		this.width  = SCREEN_W;
		this.height = SCREEN_H;
		this.scaleX = 1;
		this.scaleY = 1;
		charView         = new CharView();
		charView.name    = "charview";
		charView.x       = 0;
		charView.y       = TEXTZONE_Y;
		charView.visible = false;
		addElement(charView);
	}

	/*override public function get width(): number {
		return 1000;
	}
	public  get height(): number {
		return 800;
	}
	public  get scaleX(): number {
		return 1;
	}*/
//////// Initialization methods. /////////

	protected  formatMiscItems(): void {
		// this.mainText = this.getChildByName("mainText");

//		this.nameBox.maxChars = 54;

		this.sideBarDecoration = getElementByName("statsBarMarker") as Sprite;

		this.aCb               = new ComboBox();
		this.aCb.width         = 200;
		this.aCb.scaleY        = 1.1;
		this.aCb.move(-1250, -1550);
		this.aCb.defaultLabel = "Choose a perk";
		this.addChild(this.aCb);

		this.hideSprite();
	}

	// Removes the need for some code in input.as and InitializeUI.as.

	// This creates the bottom buttons,
	// positions them,
	// and also assigns their index to a bottomIndex property on them.
	protected  createBottomButtons(): void {
	var  b:Sprite,
			bi: number, r: number, c: number,
			button:CoCButton;

		this.bottomButtons = [];

		//var originalTextFormat:TextFormat = this.toolTipView.hd.getTextFormat();
//		var buttonFont:Font  = new ButtonLabelFont();
		for (bi = 0; bi < BOTTOM_BUTTON_COUNT; ++bi) {
			r = (bi / BOTTOM_COLS) << 0;
			c = bi % BOTTOM_COLS;

//			b.x      = BUTTON_X_OFFSET + c * BUTTON_X_DELTA;
//			b.y      = BUTTON_Y_OFFSET + r * BUTTON_Y_DELTA;
//			b.width  = BUTTON_REAL_WIDTH;   //The button symbols are actually 135 wide
//			b.height = BUTTON_REAL_HEIGHT; //and 38 high. Not sure why the difference here.

			button = new CoCButton({
				bitmapClass: ButtonBackgrounds[bi % 10],
				visible    : false,
				x          : BOTTOM_X + BOTTOM_HGAP + c * (BOTTOM_HGAP * 2 + BTN_W),
				y          : BOTTOM_Y + r * (GAP + BTN_H)
			});
			button.preCallback = (function(i: number){
				return function(b:CoCButton): void{
					if (_onBottomButtonClick !== undefined) {
						_onBottomButtonClick(i);
					}
				};
			})(bi);
			this.bottomButtons.push(button);
			this.addElement(button);
		}
		this.allButtons = this.allButtons.concat(this.bottomButtons);
	}

	protected  hookBottomButtons(): void {
	var  bi:Sprite;
		for each(bi in this.bottomButtons) {
			bi.addEventListener(MouseEvent.CLICK, this.executeBottomButtonClick);
		}
	}

	protected  hookAllButtons(): void {
	var  b:Sprite;
		for each(b in this.allButtons) {
			hookButton(b);
		}
	}
	
	public  hookButton(b:Sprite): void {
		b.mouseChildren = false;
		b.addEventListener(MouseEvent.ROLL_OVER, this.hoverButton);
		b.addEventListener(MouseEvent.ROLL_OUT, this.dimButton);
	}

	public  hookMonster(b:Sprite): void {
		b.mouseChildren = false;
		b.addEventListener(MouseEvent.ROLL_OVER, this.hoverMonster);
		b.addEventListener(MouseEvent.ROLL_OUT, this.dimButton);
	}

	//////// Internal(?) view update methods ////////

	public  showBottomButton(index: number, label: string, callback = undefined, toolTipViewText: string = '', toolTipViewHeader: string = ''):CoCButton {
	var  button:CoCButton = this.bottomButtons[index] as CoCButton;

		if (!button) return undefined;
		return button.show(label,callback,toolTipViewText,toolTipViewHeader);
	}

	public  showBottomButtonDisabled(index: number, label: string, toolTipViewText: string = '', toolTipViewHeader: string = ''):CoCButton {
	var  button:CoCButton = this.bottomButtons[index] as CoCButton;

		if (!button) return undefined;
		return button.showDisabled(label,toolTipViewText,toolTipViewHeader);
	}

	public  hideBottomButton(index: number):CoCButton {
	var  button:CoCButton = this.bottomButtons[index] as CoCButton;
		// Should error.
		if (!button) return undefined;
		return button.hide();
	}

	public  hideCurrentBottomButtons(): void {
		this.currentActiveButtons = [];

		for (var i: number = 0; i < BOTTOM_BUTTON_COUNT; i++) {
		var  button:CoCButton = this.bottomButtons[i] as CoCButton;

			if (button.visible == true) {
				this.currentActiveButtons.push(i);
				button.visible = false;
			}
		}
	}

	public  showCurrentBottomButtons(): void {
		if (!this.currentActiveButtons) return;
		if (currentActiveButtons.length == 0) return;

		for (var i: number = 0; i < currentActiveButtons.length; i++) {
		var  btnIdx: number       = currentActiveButtons[i];
		var  button:CoCButton = this.bottomButtons[btnIdx] as CoCButton;

			button.visible = true;
		}
	}

	//////// Internal event handlers ////////

	protected  executeBottomButtonClick(event:Event): void {
		this.toolTipView.hide();
	}

	protected  hoverButton(event:MouseEvent): void {
	var  button:CoCButton;

		button = event.target as CoCButton;

		if (button && button.visible && button.toolTipTextInstance) {
			this.toolTipView.header = button.toolTipHeaderInstance;
			this.toolTipView.text   = button.toolTipTextInstance;
			this.toolTipView.showForButton(button);
		}
		else {
			this.toolTipView.hide();
		}
	}

	protected  dimButton(event:MouseEvent): void {
		this.toolTipView.hide();
	}

	protected  hoverMonster(event:MouseEvent): void {
	var  monster:MonsterStatsView;
		monster = event.target as MonsterStatsView;

		if (monster && monster.visible && monster.toolTipText) {
			this.toolTipView.header = monster.toolTipHeader;
			this.toolTipView.text   = monster.toolTipText;
			this.toolTipView.showForMonster(monster);
		}
		else {
			this.toolTipView.hide();
		}
	}

	//////// Bottom Button Methods ////////

	// TODO: Refactor button set-up code to use callback and toolTipViewText here.
	public  setButton(index: number, label: string = '', callback = undefined, toolTipViewText: string = ''): void {
		if (index < 0 || index >= BOTTOM_BUTTON_COUNT) {
			//trace("MainView.setButton called with out of range index:", index);
			// throw new RangeError();
			return;
		}

		if (label) {
			this.showBottomButton(index, label, callback, toolTipViewText);
		}
		else {
			this.hideBottomButton(index);
		}
	}

	// There was one case where the label needed to be set but I could not determine from context whether the button should be shown or not...
	public  setButtonText(index: number, label: string): void {
		this.bottomButtons[index].labelText = label;
	}

	public  hasButton(labelText: string): boolean {
		return this.indexOfButtonWithLabel(labelText) !== -1;
	}

	public  indexOfButtonWithLabel(labelText: string): number {
	var  i: number;

		for (i = 0; i < this.bottomButtons.length; ++i) {
			if (this.getButtonText(i) === labelText)
				return i;
		}

		return -1;
	}

	public  clearBottomButtons(): void {
	var  i: number;
		for (i = 0; i < BOTTOM_BUTTON_COUNT; ++i) {
			this.setButton(i);
		}
	}

	public  getButtonText(index: number): string {
//			var matches: any;

		if (index < 0 || index > BOTTOM_BUTTON_COUNT) {
			return '';
		}
		else {
			return this.bottomButtons[index].labelText;
		}
	}

	public  clickButton(index: number): void {
		this.bottomButtons[index].click();
	}

	// This function checks if the button at index has text
	// that matches at least one of the possible texts passed as an argument.
	public  buttonTextIsOneOf(index: number, possibleLabels: any[]): boolean {
		return (possibleLabels.indexOf(this.getButtonText(index)) != -1);
	}

	public  buttonIsVisible(index: number): boolean {
		if (index < 0 || index > BOTTOM_BUTTON_COUNT) {
			return undefined;
		} else {
			return this.bottomButtons[index].visible;
		}
	}


	//////// Menu Button Methods ////////

	protected  getMenuButtonByName(name: string):CoCButton {
		switch (name) {
			case MENU_NEW_MAIN:
				return newGameButton;
			case MENU_DATA:
				return dataButton;
			case MENU_STATS:
				return statsButton;
			case MENU_LEVEL:
				return levelButton;
			case MENU_PERKS:
				return perksButton;
			case MENU_APPEARANCE:
				return appearanceButton;
			default:
				return undefined;
		}
	}

	////////

	public  setMenuButton(name: string, label: string = '', callback = undefined): void {
	var  button:CoCButton = this.getMenuButtonByName(name);

		if (!button) {
			throw new ArgumentError("MainView.setMenuButton: Invalid menu button name: " + String(name));
		}

		if (label) {
			button.labelText     = label;
			button.toolTipHeaderInstance = label;
		}

		if (callback != undefined) {
			button.callback = callback;
		}
	}

	public  set onNewGameClick(callback): void {
		this.newGameButton.callback = callback;
	}

	public  set onDataClick(callback): void {
		this.dataButton.callback = callback;
	}

	public  set onStatsClick(callback): void {
		this.statsButton.callback = callback;
	}

	public  set onLevelClick(callback): void {
		this.levelButton.callback = callback;
	}

	public  set onPerksClick(callback): void {
		this.perksButton.callback = callback;
	}

	public  set onAppearanceClick(callback): void {
		this.appearanceButton.callback = callback;
	}

	public  set onBottomButtonClick(value): void {
		_onBottomButtonClick = value;
	}
	public  showMenuButton(name: string): void {
	var  button:CoCButton = this.getMenuButtonByName(name);
		button.visible       = true;
	}

	public  hideMenuButton(name: string): void {
	var  button:CoCButton = this.getMenuButtonByName(name);
		button.visible       = false;
	}

	public  showAllMenuButtons(): void {
		this.showMenuButton(MENU_NEW_MAIN);
		this.showMenuButton(MENU_DATA);
		this.showMenuButton(MENU_STATS);
		this.showMenuButton(MENU_LEVEL);
		this.showMenuButton(MENU_PERKS);
		this.showMenuButton(MENU_APPEARANCE);
	}

	public  hideAllMenuButtons(): void {
		this.hideMenuButton(MENU_NEW_MAIN);
		this.hideMenuButton(MENU_DATA);
		this.hideMenuButton(MENU_STATS);
		this.hideMenuButton(MENU_LEVEL);
		this.hideMenuButton(MENU_PERKS);
		this.hideMenuButton(MENU_APPEARANCE);
	}

	public  menuButtonIsVisible(name: string): boolean {
		return this.getMenuButtonByName(name).visible;
	}

	public  menuButtonHasLabel(name: string, label: string): boolean {
		return this.getMenuButtonByName(name).labelText == label;
	}


	//////// misc... ////////

	public  invert(): void {
		this.blackBackground.visible = !this.blackBackground.visible;
	}

	public  clearOutputText(): void {
		this.mainText.htmlText = '';
		this.scrollBar.draw();
	}

	/**
	 * @param text A HTML text to append. Should not contain unclosed tags
	 */
	public  appendOutputText(text: string): void {
		this.mainText.htmlText += text;
		this.scrollBar.draw();
	}

	/**
	 * @param text A HTML text to append. Should not contain unclosed tags
	 */
	public  setOutputText(text: string): void {
		// Commenting out for now, because this is annoying to see flooding the trace.
		// trace("MainView#setOutputText(): This is never called in the main outputText() function.  Possible bugs that were patched over by updating text manually?");
		this.mainText.htmlText = text;
		this.scrollBar.draw();
	}

	public  hideSprite(): void {
		this.sprite.visible = false;
	}

	public  showTestInputPanel(): void {
		this.eventTestInput.x = 207.5;
		this.eventTestInput.y = 55.1;

		this.mainText.visible = false;

		this.eventTestInput.selectable = true;
//		this.eventTestInput.type       = TextFieldType.INPUT;
		this.eventTestInput.visible    = true;

		this.scrollBar.value = this.eventTestInput.y;

	}

	public  hideTestInputPanel(): void {

		this.eventTestInput.x = -10207.5;
		this.eventTestInput.y = -1055.1;

		this.mainText.visible = true;


		this.eventTestInput.selectable = false;
//		this.eventTestInput.type       = TextFieldType.DYNAMIC;
		this.eventTestInput.visible    = false;

		this.scrollBar.value = this.mainText.y;

	}
	
	public  showMainText(): void {
		this.setTextBackground();
		this.mainText.visible = true;
		this.scrollBar.activated = true;
	}
	public  hideMainText(): void {
		this.clearTextBackground();
		this.resetTextFormat();
		this.mainText.visible = false;
		this.scrollBar.activated = false;
	}
	public  resetTextFormat(): void {
	var  normalFormat:TextFormat = new TextFormat();
		normalFormat.font = "Times New Roman, serif";
		normalFormat.bold = false;
		normalFormat.italic = false;
		normalFormat.underline = false;
		normalFormat.bullet = false;
		normalFormat.size = kGAMECLASS.flags[kFLAGS.CUSTOM_FONT_SIZE] || 20;
		this.mainText.defaultTextFormat = normalFormat;
	}
	
	public  clearTextBackground(): void {
		this.textBGTranslucent.visible = false;
		this.textBGWhite.visible = false;
		this.textBGTan.visible = false;
	}
	public  setTextBackground(selection: number = -1): void {
		clearTextBackground();
		if (selection == 0) this.textBGTranslucent.visible = true;
		if (selection == 1) this.textBGWhite.visible = true;
		if (selection == 2) this.textBGTan.visible = true;
	}
	
	public  promptCharacterName(): void {
		this.nameBox.visible = true;
		this.nameBox.width = 165
		this.nameBox.text = "";
		this.nameBox.maxChars = 16;
	}
	public  moveCombatView(event:TimerEvent = undefined): void{
		this.mainText.width -= 10;
		this.scrollBar.x -= 10;
		//this.scrollBar.x -= 200;
		this.textBGTan.width -= 10;
		//this.textBGTan.x -= 200;
		this.textBGWhite.width -= 10;
		//this.textBGWhite.x -= 200;
		this.textBGTranslucent.width -= 10;
		//this.textBGTranslucent.x -= 200;
		this.monsterStatsView.x -= 10;
		this.monsterStatsView.refreshStats(kGAMECLASS);

	
	}
	
	public  moveCombatViewBack(event:TimerEvent = undefined): void{
		this.mainText.width += 10;
		this.scrollBar.x +=  10;
		//this.scrollBar.x -= 200;
		this.textBGTan.width +=  10 ;
		//this.textBGTan.x -= 200;
		this.textBGWhite.width +=  10;
		//this.textBGWhite.x -= 200;
		this.textBGTranslucent.width +=  10;
		//this.textBGTranslucent.x -= 200;
		this.monsterStatsView.x+=  10;

	
	}

	public  endCombatView(): void{
		if (!monsterStatsView.moved) return;
		else monsterStatsView.moved = false;
		
		if (FEATURE_ANIMATED_MONSTER_STATS) {
		var  tmr:Timer = new Timer(30, 20);
			tmr.addEventListener(TimerEvent.TIMER, moveCombatViewBack);
			tmr.start();
		}else{
			nonCombatView();
		}

		this.monsterStatsView.hide();
	}
	
	private  nonCombatView(): void {
		this.mainText.x = TEXTZONE_X;
		this.mainText.width = TEXTZONE_W;
		this.scrollBar.x = TEXTZONE_X + TEXTZONE_W;
		this.textBGTan.width = TEXTZONE_W;
		this.textBGWhite.width = TEXTZONE_W;
		this.textBGTranslucent.width = TEXTZONE_W;
		this.monsterStatsView.x = MONSTER_X;
	}

	public  updateCombatView(): void {
		if (kGAMECLASS.flags[kFLAGS.ENEMY_STATS_BARS_ENABLED] <= 0) return; //Cancel if disabled 
		monsterStatsView.show();
		if (monsterStatsView.moved) return;
		else monsterStatsView.moved = true;
		
		if (FEATURE_ANIMATED_MONSTER_STATS) {
		var  tmr:Timer = new Timer(30, 20);
			tmr.addEventListener(TimerEvent.TIMER, moveCombatView);
			tmr.start();
		}else{
			combatView();
		}
	}
	
	private  combatView(): void {
		this.mainText.x = TEXTZONE_X;
		this.mainText.width = TEXTZONE_W - MONSTER_W;
		this.scrollBar.x = TEXTZONE_X + TEXTZONE_W - MONSTER_W;
		this.textBGTan.width = TEXTZONE_W - MONSTER_W;
		this.textBGWhite.width = TEXTZONE_W - MONSTER_W;
		this.textBGTranslucent.width = TEXTZONE_W - MONSTER_W;
		this.monsterStatsView.x = MONSTER_X - MONSTER_W;
		this.monsterStatsView.refreshStats(kGAMECLASS);
	}
}

