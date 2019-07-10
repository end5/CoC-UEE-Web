/**
 * Coded by aimozg on 04.06.2017.
 */



[Style(name="fillColor", type="uint", format="Color", inherit="no")]
export class BitmapDataSprite extends Sprite {
	private static  LOGGER:ILogger = LoggerFactory.getLogger(BitmapDataSprite);
	public  BitmapDataSprite(options: Record<string, any> = undefined) {
		super();
		options = Utils.extend({},options);
		if (options) {
			_fillColor = UIUtils.convertColor(Utils.moveValue(options,'fillColor',_fillColor));
			_width = Utils.moveValue(options,'width',_width);
			_height = Utils.moveValue(options,'height',_height);
			if (_width || _height) setSize(_width,_height);
			_stretch = Utils.moveValue(options,'stretch',_stretch);
			_repeat = Utils.moveValue(options,'repeat',_repeat);
			bitmapClass = Utils.moveValue(options,'bitmapClass',undefined);
			bitmap = Utils.moveValue(options,'bitmap',_bitmap);
			for (var key: string in options) {
			if (options.hasOwnProperty(key)) {
			var  value: any = options[key];
						if (key in this) {
							this[key] = value;
						} else {
							LOGGER.warn("Unknown BitmapDataSprite property", key)
						}
				}
			}
		}
	}
	private  _bitmap:Bitmap   = undefined;
	private  _fillColor:uint  = 0;
	private  _width: number    = 0;
	private  _height: number   = 0;
	private  _stretch: boolean = false;
	private  _repeat: boolean  = false;
	public  set bitmapClass(value:Class): void {
		if (value as Class) bitmap = (new value()) as Bitmap;
		else bitmap = undefined;
	}
	public  get bitmapClass():Class {
		return undefined;
	}
	public  get bitmap():Bitmap {
		return _bitmap;
	}
	public  set bitmap(value:Bitmap): void {
		if (_bitmap == value) return;
		_bitmap = value;
		if (value) {
			if (_width == 0 || !stretch && !repeat) _width = value.width;
			if (_height == 0 || !stretch && !repeat) _height = value.height;
		}
		redraw();
	}
	public  get fillColor():uint {
		return _fillColor;
	}
	public  set fillColor(value:uint): void {
		if (_fillColor == value) return;
		_fillColor = value;
		redraw();
	}
	public  set width(value: number): void {
		setSize(value,_height);
	}
	public  set height(value: number): void {
		setSize(_width,value);
	}
	public  setSize(width: number, height: number): void {
		_width = width;
		_height = height;
		redraw();
		super.width = width;
		super.height = height;
	}
	public  get stretch(): boolean {
		return _stretch;
	}
	public  set stretch(value: boolean): void {
		if (_stretch == value) return;
		_stretch = value;
		redraw();
	}
	public  get repeat(): boolean {
		return _repeat;
	}
	public  set repeat(value: boolean): void {
		if (_repeat == value) return;
		_repeat = value;
		redraw();
	}
	private  redraw(): void {
		this.graphics.clear();
		if (bitmap) {
			if (stretch) {
			var  m:Matrix = new Matrix();
				m.scale(_width / bitmap.width, _height / bitmap.height);
				this.graphics.beginBitmapFill(bitmap.bitmapData, m, false, true);
			} else {
				this.graphics.beginBitmapFill(bitmap.bitmapData, undefined, repeat);
			}
			this.graphics.drawRect(0, 0, _width, _height);
			this.graphics.endFill();
		} else {
			this.graphics.beginFill(_fillColor, 1.0);
			this.graphics.drawRect(0, 0, _width, _height);
			this.graphics.endFill();
		}
	}
}

