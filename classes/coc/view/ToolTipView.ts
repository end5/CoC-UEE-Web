
	export class ToolTipView extends Block {
		[Embed(source='../../../res/ui/tooltip.png')]
		public static  tooltipBg:Class;
		public 
			bg:Sprite,
			ln:Sprite,
			hd:TextField,
			tf:TextField;

		public  ToolTipView(mainView:MainView) {
			super();

			this.bg = addBitmapDataSprite({
				x:0, y:0,
				width:350,height:239,stretch: true,
				bitmapClass: tooltipBg
			});
			this.ln = addBitmapDataSprite({
				x:15,y:40,
				width:320,height:1,fillColor:'#000000'
			});
			this.hd = addTextField({
				x:15,y:15,
				width:316,height:25.35,
				multiline:true,
				wordWrap:false,
				embedFonts:true,
				defaultTextFormat:{
					size: 18,
					font: CoCButton.BUTTON_LABEL_FONT_NAME
				}
			});
			this.tf = addTextField({
				x:15,y:40,
				width:316,height:176,
				multiline:true,wordWrap:true,
				defaultTextFormat:{
					size:15
				}
			});
		}

		public  showForButton(button:DisplayObject): void {
		var  bx: number = button.x,
				by: number = button.y;

			bx = (bx >= 688 ? 680: bx);
			this.x = bx - 13;
		var  y: number = by - this.height - 2;
			if (y < 0) y = by + button.height + 6;
			this.y = y;

			this.visible = true;
		}


		public  showForMonster(button:DisplayObject): void {
		var  bx: number = button.x,
				by: number = button.y;
			this.x = bx + 450;
			this.y = by + 50;
			this.visible = true;
		}
		

		public  hide(): void {
			this.visible = false;
		}

		public  set header(newText: string): void {
			this.hd.htmlText = newText || '';
		}

		public  get header(): string {
			return this.hd.htmlText;
		}
		
		public  set text(newText: string): void {
			this.tf.htmlText = newText || '';
		}

		public  get text(): string {
			return this.tf.htmlText;
		}
	}

