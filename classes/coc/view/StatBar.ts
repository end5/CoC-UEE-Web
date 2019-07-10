/**
 * Coded by aimozg on 06.06.2017.
 */


export class StatBar extends Block {
	[Embed(source="../../../res/ui/StatsBarBottom.png")]
	public static  StatsBarBottom:Class;
	[Embed(source = "../../../res/ui/arrow-up.png")]
	public static  ArrowUp:Class;
	[Embed(source = "../../../res/ui/arrow-down.png")]
	public static  ArrowDown:Class;

	private static  factoryReset(): Record<string, any> {
		return {
			width      : 200,
			height     : 28,
			minValue   : 0,
			maxValue   : 100,
			value      : 0,
			statName   : "",
			showMax    : false,
			isUp       : false,
			isDown     : false,
			hasGauge   : true,
			hasBar     : true,
			hasMinBar  : false,
			hasShadow  : true,
			barAlpha   : 0.4,
			barHeight  : 1.0, // relative to height
			barColor   : '#0000ff',
			minBarColor: '#8080ff',
			bgColor    : undefined
		};
	}
	private static  DEFAULT_OPTIONS: Record<string, any>     = factoryReset();
	public static  setDefaultOptions(options: Record<string, any>): void {
		Utils.extend(DEFAULT_OPTIONS,options);
	}
	public static  resetDefaultOptions(): void {
		DEFAULT_OPTIONS = factoryReset();
	}

	private  _bar:BitmapDataSprite;
	private  _minBar:BitmapDataSprite;
	private  _bgBar:BitmapDataSprite;
	private  _arrowUp:BitmapDataSprite;
	private  _arrowDown:BitmapDataSprite;
	private  _nameLabel:TextField;
	private  _valueLabel:TextField;
	private  _minValue: number;
	private  _maxValue: number;
	private  _value: number;
	private  _showMax: boolean;
	private  get arrowSz(): number {
		return this.height-2;
	}

	public  StatBar(options: Record<string, any>) {
		super();
		options          = Utils.extend({},DEFAULT_OPTIONS, options);
	var  myWidth: number = options.width;
	var  myHeight: number = options.height;
	var  arrowSz: number  = myHeight - 2;
	var  barWidth: number = myWidth - arrowSz - 2;
		if (options.hasBar) {
		var  barX: number = 1;
		var  barHeight: number = myHeight*options.barHeight;
		var  barY: number = myHeight - barHeight;
			if (options.bgColor != undefined) {
				_bgBar = addBitmapDataSprite({
					x:barX,y:barY,
					alpha:options.barAlpha,
					fillColor:options.bgColor,
					width:barWidth,
					height:barHeight
				})
			}
			_bar = addBitmapDataSprite({
				x        : barX,
				y        : barY,
				alpha    : options.barAlpha,
				fillColor: options.barColor,
				width    : 0,
				height   : barHeight
			});
			if (options.hasMinBar) {
				_minBar = addBitmapDataSprite({
					x        : barX,
					y        : barY,
					alpha    : options.barAlpha,
					fillColor: options.minBarColor,
					width    : 0,
					height   : barHeight
				});
			}
			if (options.hasGauge) {
				/*gauge=*/
				addBitmapDataSprite({
					x          : 0,
					y          : myHeight - 10,
					width      : barWidth+2,
					height     : 10,
					stretch    : true,
					bitmapClass: StatsBarBottom
				});
			}
			if (options.hasShadow) {
				this.applyShadow();
			}
		}
		_nameLabel  = addTextField({
			x                : 6, y: 4,
			width: barWidth,
			height           : myHeight - 4,
			defaultTextFormat: {
				font: 'Palatino Linotype, serif',
				size: 15,
				bold: true
			}
		});
		_valueLabel = addTextField({
			x                : 0, y: myHeight-30,
			width: barWidth,
			height           : 30,
			defaultTextFormat: {
				font : 'Palatino Linotype, serif',
				size : 22,
				align: 'right',
				bold : true
			}
		});
		_arrowUp = addBitmapDataSprite({
			bitmapClass: ArrowUp,
			width: arrowSz,
			height: arrowSz,
			stretch: true,
			x          : myWidth - arrowSz - 1,
			y: 1,
			visible: false
		});
		_arrowDown = addBitmapDataSprite({
			bitmapClass: ArrowDown,
			width: arrowSz,
			height: arrowSz,
			stretch: true,
			x          : myWidth - arrowSz - 1,
			y: 1,
			visible: false
		});
		UIUtils.setProperties(this,options);
		update();
	}

	public  get minValue(): number {
		return _minValue;
	}
	public  set minValue(value: number): void {
		_minValue = value;
		update();
	}
	public  get maxValue(): number {
		return _maxValue;
	}
	public  set maxValue(value: number): void {
		_maxValue = value;
		if (showMax) renderValue();
		update();
	}
	private  renderValue(): void {
		valueText = '' + Math.floor(value) + (showMax ? '/' + Math.floor(maxValue) : '');
	}
	public  get value(): number {
		return _value;
	}
	public  set value(value: number): void {
		_value    = value;
		renderValue();
		update();
	}
	public  get valueText(): string {
		return _valueLabel ? _valueLabel.text : value + '';
	}
	public  set valueText(value: string): void {
		if (_valueLabel) _valueLabel.text = value;
	}
	public  update(): void {
		if (_bar) {
			_bar.width = maxValue > 0 ?
					Utils.boundFloat(0, value, maxValue) * (width - arrowSz-2) / maxValue : 0;
		}
		if (_minBar) {
			_minBar.width = maxValue > 0 ?
					Utils.boundFloat(0, minValue, maxValue) * (width - arrowSz-2) / maxValue : 0;
		}
	}
	public  get showMax(): boolean {
		return _showMax;
	}
	public  set showMax(value: boolean): void {
		_showMax = value;
		renderValue();
	}
	public  get isUp(): boolean {
		return _arrowUp.visible;
	}
	public  set isUp(value: boolean): void {
		_arrowUp.visible = value;
		if (value) _arrowDown.visible = false;
	}
	public  get isDown(): boolean {
		return _arrowDown.visible;
	}
	public  set isDown(value: boolean): void {
		_arrowDown.visible = value;
		if (value) _arrowUp.visible = false;
	}
	public  get statName(): string {
		return _nameLabel.text;
	}
	public  set statName(value: string): void {
		_nameLabel.text = value;
	}

	public  get bar():BitmapDataSprite {
		return _bar;
	}
	public  get minBar():BitmapDataSprite {
		return _minBar;
	}
	public  get nameLabel():TextField {
		return _nameLabel;
	}
	public  get valueLabel():TextField {
		return _valueLabel;
	}
	public  get arrowUp():BitmapDataSprite {
		return _arrowUp;
	}
	public  get arrowDown():BitmapDataSprite {
		return _arrowDown;
	}
}

