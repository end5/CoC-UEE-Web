/**
 * Coded by aimozg on 11.07.2017.
 */

class CompositeLayer {
	private  _name: string;
	private  src:BitmapData;
	private  dst:BitmapData;
	private  keyColors: Record<string, any>;// uint color24 -> uint color24
	private  dirty: boolean = true;
	public  dx: number;
	public  dy: number;

	public  get width(): number {
		return src.width;
	}
	public  get height(): number {
		return src.height;
	}

	public  CompositeLayer(name: string, src:BitmapData, dx: number, dy: number) {
		this._name     = name;
		this.src       = src;
		this.dx = dx;
		this.dy = dy;
		this.dst       = new BitmapData(src.width, src.height,true,0);
		this.keyColors = {};
		this.dst.draw(src);
	}


	public  get name(): string {
		return _name;
	}
	public  setKeyColors(newKeyColors: Record<string, any>): void {
		for (var kc: string in keyColors) {
			if (!(kc in newKeyColors)) {
				dirty = true;
				delete keyColors[kc];
			}
		}
		for (kc in newKeyColors) {
			if (!(kc in keyColors) || keyColors[kc] != newKeyColors[kc]) {
				dirty         = true;
				keyColors[kc] = newKeyColors[kc];
			}
		}
	}

	public  draw():BitmapData {
		if (dirty) doUpdate();
		return dst;
	}

	private  doUpdate(): void {
	var  kc: Record<string, any> = keyColors;
		for (var y:uint = 0, height: number = src.height; y < height; y++) {
			for (var x:uint = 0, width: number = src.width; x < width; x++) {
			var  pix:uint = src.getPixel32(x, y);
			var  alpha:uint = pix&0xff000000;
			var  rgb:uint = pix&0x00ffffff;
				if (rgb in kc) rgb = kc[rgb]&0x00ffffff;
				dst.setPixel32(x, y, alpha|rgb);
			}
		}
	}
}

