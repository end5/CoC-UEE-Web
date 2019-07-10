/**
 * Coded by aimozg on 28.07.2017.
 */


export class KeyColor {
	private  _src:uint;
	private  _base: string;
	private  tfs:/*String*/Array;
	public  KeyColor(src:uint, base: string, tf: string) {
		this._src  = src;
		this._base = base;
		if (tf) this.tfs = tf.split(";");
		else this.tfs = [];
	}
	public  transform(baseValue:uint):uint {
	var  hsl: any = Color.toHsl(baseValue);
		for each (var tf: string in tfs) {
		var  fn: any[]               = tf.match(/^(\w+)\(([\d.,-]+)\)/);
		var  fname: string           = fn ? fn[1] : undefined;
		var  values:/*Number*/Array = fn ? fn[2].split(",") : [];
			switch (fname) {
				case "shift":
				case "h":
					hsl.h = hsl.h + values[0];
					break;
				case "shiftTo":
				case "hto":
					if (hsl.h > values[0]) {
						hsl.h -= values[1];
					} else {
						hsl.h += values[2];
					}
					break;
				case "saturate":
				case "s":
					hsl.s += values[0];
					break;
				case "desaturate":
					hsl.s -= values[0];
					break;
				case "darken":
					hsl.l -= values[0];
					break;
				case "lighten":
				case "l":
					hsl.l += values[0];
					break;
				default:
					trace("Error: invalid color transform '" + tf + "'");
					break;
			}
			hsl.h = hsl.h % 360;
			while (hsl.h < 0) hsl.h += 360;
			hsl.s = Utils.boundFloat(0, hsl.s, 100);
			hsl.l = Utils.boundFloat(0, hsl.l, 100);
			
		}
		return Color.fromHsl(hsl);
	}
	public  get src():uint {
		return _src;
	}
	public  get base(): string {
		return _base;
	}
}

