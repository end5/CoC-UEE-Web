
export class MonsterStatsView extends Block {
	private static  LOGGER:ILogger = LoggerFactory.getLogger(StatsView);
	[Embed(source = "../../../res/ui/sidebar1.png")]
	public static  SidebarBg1:Class;
	[Embed(source = "../../../res/ui/sidebar2.png")]
	public static  SidebarBg2:Class;
	[Embed(source = "../../../res/ui/sidebar3.png")]
	public static  SidebarBg3:Class;
	[Embed(source = "../../../res/ui/sidebar4.png")]
	public static  SidebarBg4:Class;
	[Embed(source = "../../../res/ui/sidebarKaizo.png")]
	public static  SidebarBgKaizo:Class;
	public static  SidebarBackgrounds: any[] = [SidebarBg1, SidebarBg2, SidebarBg3, SidebarBg4, undefined, SidebarBgKaizo];
	public static  ValueFontOld: string    = 'Lucida Sans Typewriter';
	public static  ValueFont: string       = 'Palatino Linotype';

	private  sideBarBG:BitmapDataSprite;
	private  nameText:TextField;
	private  coreStatsText:TextField;
	private  combatStatsText:TextField;
	private  levelBar:StatBar;
	private  genderBar:StatBar;
	private  raceBar:StatBar;

	private  hpBar:StatBar;
	private  lustBar:StatBar;
	private  fatigueBar:StatBar;
	public  toolTipHeader: string;
	public  toolTipText: string;
	public  moved: boolean = false;
	private  allStats: any[];

	/* [INTERMOD: xianxia]
	private  spiritstonesBar:StatBar;
	*/

	public  MonsterStatsView(mainView:MainView) {
		super({
			x           : MainView.MONSTER_X,
			y           : MainView.MONSTER_Y,
			width       : MainView.MONSTER_W,
			height      : MainView.MONSTER_H,
			layoutConfig: {
				//padding: MainView.GAP,
				type: 'flow',
				direction: 'column',
				ignoreHidden: true
				//gap: 1
			}
		});
	const  LABEL_FORMAT: Record<string, any> = {
			font:'Times New Roman, _serif',
			align:'center',
			bold:true,
			size:22
		};
		StatBar.setDefaultOptions({
			barColor: '#600000',
			width: innerWidth
		});
		sideBarBG = addBitmapDataSprite({
			width  : MainView.MONSTER_W,
			height : MainView.MONSTER_H,
			stretch: true
		}, {ignore: true});
		nameText      = addTextField({
			width: MainView.MONSTER_W,
			height: 30,
			defaultTextFormat: {
				font : 'Times New Roman, _serif',
				size : 24,
				align: 'center',
				bold : true,
				underline: true
			}
		});
		coreStatsText = addTextField({
			text: '◄ General Info ►',
			width: MainView.MONSTER_W - 8,
			height: 30,
			defaultTextFormat: LABEL_FORMAT
		},{before:1});
		addElement(levelBar = new StatBar({
			statName: "Level:",
			hasBar  : false
		}));
		addElement(raceBar = new StatBar({
			statName: "Race:",
			hasBar  : false
		}));
		addElement(genderBar = new StatBar({
			statName: "Gender:",
			hasBar  : false
		}));

		combatStatsText = addTextField({
			text: '◄ Combat Stats ►',
			width: MainView.MONSTER_W - 8,
			height: 30,
			defaultTextFormat: LABEL_FORMAT
		},{before:1});
		addElement(hpBar = new StatBar({
			statName: "HP:",
			barColor: '#00c000',
			showMax : true
		}));
		addElement(lustBar = new StatBar({
			statName   : "Lust:",
			barColor   : '#c02020',
			minBarColor: '#c00000',
			hasMinBar  : true,
			showMax    : true
		}));
		addElement(fatigueBar = new StatBar({
			statName: "Fatigue:",
			showMax: true
		}));
		/* [INTERMOD: xianxia]
		addElement(manaBar = new StatBar({
			statName: "Mana:",
			barColor: '#0000c0',
			showMax : true
		}));
		*/
		allStats = [];
		///////////////////////////
		for (var ci: number = 0, cn: number = this.numElements; ci < cn; ci++) {
		var  e:StatBar = this.getElementAt(ci) as StatBar;
			if (e) allStats.push(e);
		}
		this.addEventListener(MouseEvent.ROLL_OVER, this.hover);
		this.addEventListener(MouseEvent.ROLL_OUT, this.dim);
	}


	public  show(): void {
		this.visible = true;
	}

	public  hide(): void {
		this.visible = false;
	}
	
	public  hideUpDown(): void {
	var  ci: number, cc: number = this.allStats.length;
		for (ci = 0; ci < cc; ++ci) {
		var  c:StatBar = this.allStats[ci];
			c.isUp        = false;
			c.isDown      = false;
		}
	}
	
	public  hover(event:MouseEvent = undefined): void {
			if (this.alpha)
				this.alpha = 0.5;
	}

	public  dim(event:MouseEvent = undefined): void {
			if (this.alpha)
				this.alpha = 1;
	}

	public  statByName(statName: string):StatBar {
		switch (statName.toLowerCase()) {
			case 'hp':
				return hpBar;
			/* [INTERMOD: xianxia]
			case 'wrath':
				return wrathBar;
			*/
			case 'lust':
				return lustBar;
			case 'fatigue':
				return fatigueBar;
			case 'level':
				return levelBar;
			case 'race':
				return raceBar;
			case 'gender':
				return genderBar;
			/* [INTERMOD: xianxia]
			case 'mana':
				return manaBar;
			case 'soulforce':
				return soulforceBar;
			*/
			/* [INTERMOD: xianxia]
			case 'spiritstones':
				return spiritstonesBar;
			*/
			default:
				return undefined;
		}
	}
	public  showStatUp(statName: string): void {
	var  stat:StatBar = statByName(statName);
		if (stat) stat.isUp        = true;
		else LOGGER.error("Cannot showStatUp "+statName);
	}

	public  showStatDown(statName: string): void {
	var  stat:StatBar = statByName(statName);
		if (stat) stat.isDown      = true;
		else LOGGER.error("[ERROR] Cannot showStatDown "+statName);
	}
	
	public  refreshStats(game:CoC): void {
	var  monster:Monster            = game.monster;
		nameText.htmlText     = "<b>" + Utils.capitalizeFirstLetter(monster.short) + "</b>";
		levelBar.value        = monster.level;
		raceBar.valueText     = monster.race;
		genderBar.valueText   = monster.plural ? "Multiple" : monster.genderText("Male", "Female", "Herm", "???");
		hpBar.maxValue        = monster.maxHP();
		animateBarChange(hpBar, monster.HP);
		lustBar.maxValue      = monster.maxLust();
		lustBar.minValue      = monster.minLust();
		animateBarChange(lustBar, monster.lust);
		fatigueBar.maxValue   = monster.maxFatigue();
		animateBarChange(fatigueBar, monster.fatigue);
		/* [INTERMOD: xianxia]
		manaBar.maxValue 	  = player.maxMana();
		manaBar.value    	  = player.mana;
		*/
		toolTipHeader = "Details";
		toolTipText = monster.generateTooltip();
		invalidateLayout();
	}

	public  setBackground(bitmapClass:Class): void {
		sideBarBG.bitmapClass = bitmapClass;
	}
	
	public  setTheme(font: string, textColor:uint, barAlpha: number): void {
	var  dtf:TextFormat;
	var  shadowFilter:DropShadowFilter = new DropShadowFilter();
		
		for each(var e:StatBar in allStats) {
			dtf = e.valueLabel.defaultTextFormat;
			dtf.color = textColor;
			dtf.font = font;
			e.valueLabel.defaultTextFormat = dtf;
			e.valueLabel.setTextFormat(dtf);
			dtf = e.nameLabel.defaultTextFormat;
			dtf.color = textColor;
			e.nameLabel.defaultTextFormat = dtf;
			e.nameLabel.setTextFormat(dtf);
			
			if (e.bar) {
				e.bar.alpha = barAlpha;
				
				if (e.bar.filters.length < 1) {
					e.bar.filters = [shadowFilter];
				}
			}
			
			if (e.minBar) {
				e.minBar.alpha = (1 - (1 - barAlpha) / 2); // 2 times less transparent than bar
			}
		}
		
		for each(var tf:TextField in [nameText,coreStatsText,combatStatsText]) {
			dtf = tf.defaultTextFormat;
			dtf.color = textColor;
			tf.defaultTextFormat = dtf;
			tf.setTextFormat(dtf);
		}
		
	}
	
	public  animateBarChange(bar:StatBar, newValue: number): void {
		if (kGAMECLASS.flags[kFLAGS.ANIMATE_STATS_BARS] == 0) {
			bar.value = newValue;
			return;
		}
	var  oldValue: number = bar.value;
		//Now animate the bar.
	var  tmr:Timer = new Timer(32, 30);
		tmr.addEventListener(TimerEvent.TIMER, kGAMECLASS.createCallBackFunction(stepBarChange, bar, [oldValue, newValue, tmr]));
		tmr.start();
	}
	
	private  stepBarChange(bar:StatBar, args: any[]): void {
	var  originalValue: number = args[0]; 
	var  targetValue: number = args[1]; 
	var  timer:Timer = args[2];
		bar.value = originalValue + (((targetValue - originalValue) / timer.repeatCount) * timer.currentCount);
		if (timer.currentCount >= timer.repeatCount) bar.value = targetValue;
		if (bar == hpBar) bar.bar.fillColor = Color.fromRgbFloat((1 - (bar.value / bar.maxValue)) * 0.8, (bar.value / bar.maxValue) * 0.8, 0);
	}
	
	public  hint(toolTipText: string = "",toolTipHeader: string=""): void {
			this.toolTipText   = toolTipText;
			this.toolTipHeader = toolTipHeader;
	}
}

