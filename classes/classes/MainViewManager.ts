//The code that is responsible for managing MainView.





	export class MainViewManager extends BaseContent
	{
		//Interface flags
		public  registeredShiftKey: boolean = false;

		public static  textColorArray: any[] = [0, 0, 0, 0xc0c0c0, 0xc0c0c0, 0, 0, 0, 0, 0];
		public static  darkThemes: any[] = [false, false, false, false, true, false, false, false, false, false];
		public static  barAlphaArray: any[]  = [0.4, 0.4, 0.5, 1, 1, 1, 1, 1, 1, 1];

		public  statsHidden: boolean = false;
		public  buttonsTweened: boolean = false;

		public  MainViewManager()
		{

		}

		//------------
		// SHOW/HIDE
		//------------
		public  isDarkTheme(): boolean {
			return darkThemes[flags[kFLAGS.BACKGROUND_STYLE]];
		}
		public  isDarkText(): boolean {
			return isDarkTheme() && !mainView.textBGTan.visible && !mainView.textBGWhite.visible;
		}
		public  colorHpMinus(): string {
			return isDarkText() ? '#ff0000' : '#800000';
		}
		public  colorHpPlus(): string {
			return isDarkText() ? '#00ff00' : '#008000';
		}

		public  setTheme(): void {
			//Set background
			mainView.background.bitmapClass = MainView.Backgrounds[flags[kFLAGS.BACKGROUND_STYLE]];
			mainView.statsView.setBackground(StatsView.SidebarBackgrounds[flags[kFLAGS.BACKGROUND_STYLE]]);
			mainView.monsterStatsView.setBackground(MonsterStatsView.SidebarBackgrounds[flags[kFLAGS.BACKGROUND_STYLE]]);
			mainView.monsterStatsView2.setBackground(MonsterStatsView.SidebarBackgrounds[flags[kFLAGS.BACKGROUND_STYLE]]);
			mainView.monsterStatsView3.setBackground(MonsterStatsView.SidebarBackgrounds[flags[kFLAGS.BACKGROUND_STYLE]]);
			mainView.monsterStatsView4.setBackground(MonsterStatsView.SidebarBackgrounds[flags[kFLAGS.BACKGROUND_STYLE]]);
			//Set font
			mainView.statsView.setTheme((flags[kFLAGS.USE_OLD_FONT] > 0) ? StatsView.ValueFontOld : StatsView.ValueFont,
					textColorArray[flags[kFLAGS.BACKGROUND_STYLE]],
					barAlphaArray[flags[kFLAGS.BACKGROUND_STYLE]]);
			mainView.monsterStatsView.setTheme((flags[kFLAGS.USE_OLD_FONT] > 0) ? StatsView.ValueFontOld : StatsView.ValueFont, 
					textColorArray[flags[kFLAGS.BACKGROUND_STYLE]],
					barAlphaArray[flags[kFLAGS.BACKGROUND_STYLE]]);
			mainView.monsterStatsView2.setTheme((flags[kFLAGS.USE_OLD_FONT] > 0) ? StatsView.ValueFontOld : StatsView.ValueFont, 
					textColorArray[flags[kFLAGS.BACKGROUND_STYLE]],
					barAlphaArray[flags[kFLAGS.BACKGROUND_STYLE]]);
			mainView.monsterStatsView3.setTheme((flags[kFLAGS.USE_OLD_FONT] > 0) ? StatsView.ValueFontOld : StatsView.ValueFont, 
					textColorArray[flags[kFLAGS.BACKGROUND_STYLE]],
					barAlphaArray[flags[kFLAGS.BACKGROUND_STYLE]]);
			mainView.monsterStatsView4.setTheme((flags[kFLAGS.USE_OLD_FONT] > 0) ? StatsView.ValueFontOld : StatsView.ValueFont, 
					textColorArray[flags[kFLAGS.BACKGROUND_STYLE]],
					barAlphaArray[flags[kFLAGS.BACKGROUND_STYLE]]);
		}

		public  hideSprite(): void {
			// Inlined from lib/src/coc/view/MainView.as
			mainView.sprite.visible = false;
		}
		public  showSpriteBitmap(bmp:BitmapData): void {
			if (!bmp) return;
		var  element:BitmapDataSprite = mainView.sprite;
			element.visible = true;
		var  scale: number = 80 / bmp.height;
			element.scaleX = scale;
			element.scaleY = scale;
			element.graphics.clear();
			element.graphics.beginBitmapFill(bmp,undefined,false,false);
			element.graphics.drawRect(0, 0, bmp.width, bmp.height);
			element.graphics.endFill();
		var  shadow:DropShadowFilter = new DropShadowFilter();
			shadow.strength = 0.4;
			if (!isDarkTheme()) {
				if (element.filters.length < 1) {
					element.filters = [shadow];
				}
			}
			else {
				element.filters = [];
			}
		}
		//------------
		// REFRESH
		//------------
		public  refreshStats(): void {
			if ((flags[kFLAGS.HUNGER_ENABLED] > 0 || prison.inPrison) && flags[kFLAGS.URTA_QUEST_STATUS] != 0.75 && flags[kFLAGS.USE_OLD_INTERFACE] <= 0) {
				mainView.statsView.toggleHungerBar(true);
			} else {
				mainView.statsView.toggleHungerBar(false);
			}
			mainView.monsterStatsView.refreshStats(getGame(), getGame().monster);
			if (getGame().monster2 != undefined) mainView.monsterStatsView2.refreshStats(getGame(), getGame().monster2);
			if (getGame().monster3 != undefined) mainView.monsterStatsView3.refreshStats(getGame(), getGame().monster3);
			if (getGame().monster4 != undefined) mainView.monsterStatsView4.refreshStats(getGame(), getGame().monster4);
			mainView.statsView.refreshStats(getGame());
			//Set theme!
			setTheme();
		}
		public  showPlayerDoll(reload: boolean=false): void {
			//tweenOutStats();
			if (reload) mainView.charView.reload("external");
			mainView.charView.setCharacter(player);
			mainView.charView.redraw();
			mainView.charView.visible = true;
			if(/*flags[kFLAGS.CHARVIEW_STYLE]*/0 < 1){
				mainView.charView.x = 0;
				mainView.charView.y = 0;
				BoundClip.nextContent = mainView.charView;
				outputText("<img src='coc.view::BoundClip' align='left' id='charview'/>");
			} else {
				mainView.charView.x = 208 + 796 + 4; //TEXTZONE_X + TEXTZONE_W + GAP
				mainView.charView.y = 52; // TEXTZONE_Y;
				mainView.addElement(mainView.charView);
			}
		}
		public  hidePlayerDoll(): void {
			mainView.charView.visible = false;
			//tweenInStats();
		}

		//Show/hide stats bars.
		public  tweenInStats(): void {
		var  t:Timer = new Timer(20, 21);
			if (!statsHidden) return;
			statsHidden = false;
			t.addEventListener(TimerEvent.TIMER, function(): void {
				mainView.statsView.x += 10;
				mainView.statsView.alpha += 0.05;
			});
			t.addEventListener(TimerEvent.TIMER_COMPLETE, function (): void {
				mainView.statsView.x     = 0;
				mainView.statsView.alpha = 1;
			});
			t.start();
		}
		public  tweenOutStats(): void {
		var  t:Timer = new Timer(20, 21);
			if (statsHidden) return;
			statsHidden = true;
			t.addEventListener(TimerEvent.TIMER, function(): void {
				mainView.statsView.x -= 10;
				mainView.statsView.alpha -= 0.05;
				if (mainView.statsView.alpha < 0) mainView.statsView.alpha = 0;
			});
			t.addEventListener(TimerEvent.TIMER_COMPLETE, function (): void {
				mainView.statsView.x     = -200;
				mainView.statsView.alpha = 0;
			});
			t.start();
		}

		//Animate buttons for startup!
		public  startUpButtons(): void {
			if (buttonsTweened) return;
			buttonsTweened = true;
			for (var i: number = 0; i < 15; i++) {
				mainView.bottomButtons[i].y += 140;
			}
		var  t:Timer = new Timer(1000, 1);
			t.addEventListener(TimerEvent.TIMER, tweenButtonsIn);
			t.start();
		}
		private  tweenButtonsIn(e:TimerEvent = undefined): void {
		var  t:Timer = new Timer(20, 28);
			t.addEventListener(TimerEvent.TIMER, moveButtonsIn);
			t.start();
		}
		private  moveButtonsIn(e:TimerEvent): void {
			for (var i: number = 0; i < 15; i++) {
				mainView.bottomButtons[i].y -= 5;
			}
		}

		//Allows shift key.
		public  registerShiftKeys(): void {
			if (!registeredShiftKey) {
				mainView.stage.addEventListener(KeyboardEvent.KEY_DOWN, keyPressed);
				mainView.stage.addEventListener(KeyboardEvent.KEY_UP, keyReleased);
				registeredShiftKey = true;
			}
		}

		public  keyPressed(event:KeyboardEvent): void {
			if (event.keyCode == Keyboard.SHIFT) {
				flags[kFLAGS.SHIFT_KEY_DOWN] = 1;
			}
		}
		public  keyReleased(event:KeyboardEvent): void {
			if (event.keyCode == Keyboard.SHIFT) {
				flags[kFLAGS.SHIFT_KEY_DOWN] = 0;
			}
		}
		public  traceSelf(): string {
		function  chdump(obj:DisplayObject, depth: number, alpha: number, visible: boolean, scaleX: number, scaleY: number): string {

			var  s: string = repeatString("  ", depth);

			var  className: string = getQualifiedClassName(obj)
						.replace("coc.view::", "<coc>::")
						.replace("spark.components::", "<s>::")
						.replace("spark.skins.spark::", "<spark>::")
						.replace("flash.display::", "<f>::")
						.replace("flash.text::", "<ft>::")
						.replace("flash.text.engine::", "<fte>::");
				s += className + " '" + obj.name + "' ";

				s += "xy=(" + (obj.x | 0) + "," + (obj.y | 0) + ") ";

			var  smar: string = "";
			var  spad: string = "";
				/*var uio:UIComponent = obj as UIComponent;
				 if (uio) {
				 spad = uio.getStyle("paddingTop") + "," + uio.getStyle("paddingRight") +
				 "," + uio.getStyle("paddingBottom") + "," + uio.getStyle("paddingLeft");
				 if (spad == "0,0,0,0") spad = ""; else spad = ", pad=[" + spad + "]";
				 /!*smar = uio.getStyle("marginTop")+","+uio.getStyle("marginRight")+
				 ","+uio.getStyle("marginBottom")+","+uio.getStyle("marginLeft");
				 if (smar == "0,0,0,0") smar = ""; else smar=", mar=["+smar+"]";*!/
				 }*/
				s += "sz=" + (obj.width | 0) + "x" + (obj.height | 0) + spad + smar;

				alpha             = alpha * obj.alpha;
				visible           = visible && obj.visible;
				scaleX            = scaleX * obj.scaleX;
				scaleY            = scaleY * obj.scaleY;
			var  salpha: string = "";
			var  svis: string   = "";
			var  ssx: string    = "";
			var  ssy: string    = "";
				if (alpha != 1.0) {
					salpha += ", a=" + obj.alpha;
					if (alpha != obj.alpha) salpha += "=" + alpha;
				}
				if (!visible) {
					svis += ", v=" + obj.visible;
					if (visible != obj.visible) svis += "=" + visible;
				}
				if (scaleX != 1.0 || obj.scaleX != 1.0) {
					ssx += ", sx=" + obj.scaleX;
					if (scaleX != obj.scaleX) ssx += "=" + scaleX;
				}
				if (scaleY != 1.0 || obj.scaleY != 1.0) {
					ssy += ", sy=" + obj.scaleY;
					if (scaleY != obj.scaleY) ssy += "=" + scaleY;
				}
				s += salpha + svis + ssx + ssy;

				/*var txt:IDisplayText = obj as IDisplayText;
				 if (txt) {
				var  ts: string = txt.text;
				 if (ts.length > 20) ts = ts.substr(0, 17) + "...";
				 s += ", txt='" + ts.replace(/[\r\n\t\0]/g, ' ') + "'";
				 }*/

			var  doc:DisplayObjectContainer = obj as DisplayObjectContainer;
				if (doc /*&& !(obj is Label) && !(obj is ComboBox) && !(obj is TextArea) && !(obj is TextInput)*/) {
				var  i: number, n: number = doc.numChildren, rslt: string;
					rslt             = "\n" + s;
					for (i = 0; i < n; i++) {
					var  child:DisplayObject = doc.getChildAt(i);
						/*if (!(child is TextLine)) {*/
						rslt += chdump(child, depth + 1, alpha, visible, scaleX, scaleY);
						/*}*/
					}
					return rslt;
				} else {
					return "\n" + s;
				}
			}
		var  obj:Stage = getGame().stage;
			return chdump(obj, 0, obj.alpha, obj.visible, obj.scaleX, obj.scaleY);
		}
		public  setText(_currentText: string): void {
		var  fmt:TextFormat = mainView.mainText.defaultTextFormat;
			if (flags[kFLAGS.CUSTOM_FONT_SIZE] != 0) fmt.size = flags[kFLAGS.CUSTOM_FONT_SIZE];
			fmt.color = isDarkText() ? 0xc0c0c0 : 0;

			mainView.mainText.defaultTextFormat = fmt;
			mainView.setOutputText(_currentText);
		}
	}
