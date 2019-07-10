/**
 * Coded by aimozg on 10.07.2017.
 */


export class CompositeImage {
	private  list:/*CompositeLayer*/Array;
	private  visibility: Record<string, any>;
	private  bmp:BitmapData;
	public  get width(): number {
		return bmp.width;
	}
	public  get height(): number {
		return bmp.height;
	}

	public  CompositeImage(width:uint, height:uint) {
		list       = [];
		visibility = {};
		bmp        = new BitmapData(width, height,true,0);
	}
	public  addLayer(name: string, src:BitmapData, dx: number,dy: number,visible: boolean = true): void {
		if (name in visibility) removeLayer(name);
		list.unshift(new CompositeLayer(name, src,dx,dy));
		visibility[name] = visible;
	}
	public  removeLayer(name: string): void {
		for (var i: number = 0; i < list.length; i++) {
			if (list[i].name == name) {
				list.splice(i, 1);
				delete visibility[name];
				break;
			}
		}
	}
	public  replaceLayer(name: string, src:BitmapData, dx: number, dy: number): void {
		for (var i: number = 0; i < list.length; i++) {
			if (list[i].name == name) {
				list[i] = new CompositeLayer(name, src, dx, dy);
			}
		}
	}
	public  setMultiVisibility(prefix: string, visible: boolean): void {
		for (var key: string in visibility) {
			if (key.indexOf(prefix)==0) visibility[key] = visible;
		}
	}
	public  setVisibility(name: string, visible: boolean): void {
		visibility[name] = visible;
	}
	public  hideAll(): void {
		for each (var layer:CompositeLayer in list) {
			visibility[layer.name] = false;
		}
	}
	public  draw(keyColorProvider:IKeyColorProvider):BitmapData {
		bmp.fillRect(bmp.rect, 0);
		for each (var layer:CompositeLayer in list) {
			if (visibility[layer.name]) {
				layer.setKeyColors(keyColorProvider.allKeyColorsFor(layer.name));
			var  sx: number = 0,sy: number = 0;
			var  sw: number = layer.width;
			var  sh: number = layer.height;
			var  dx: number = layer.dx;
			var  dy: number = layer.dy;
				if (dx<0) {
					sx = -dx;
					dx = 0;
				}
				if (dy<0) {
					sy = -dy;
					dy = 0;
				}
				if (dx + sw > width) sw = width - dx;
				if (dy + sh > height) sh = height - dy;
				bmp.copyPixels(layer.draw(),
						new Rectangle(sx,sy,sw,sh),
						new Point(dx,dy),undefined,undefined,true);
			}
		}
		return bmp;
	}
}





