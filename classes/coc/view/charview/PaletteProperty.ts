/**
 * Coded by aimozg on 06.01.2019.
 */

export class PaletteProperty {
	public  name: string;
	private  palette:Palette;
	private  defaultt:uint;
	private  lookupNames:/*String*/Array;
	public  PaletteProperty(palette:Palette, name: string, defaultt:uint, lookupNames:/*String*/Array) {
		this.palette = palette;
		this.name = name;
		this.defaultt = defaultt;
		this.lookupNames = lookupNames.slice(0);
	}
	public  colorName(layerName: string, src: Record<string, any>): any {
		if (src is IColorNameProvider) return (src as IColorNameProvider).getKeyColor(layerName,name);
		if (name in src) return src[name];
		return undefined;
	}
	public  lookup(layerName: string,colorName: string):uint {
		if (colorName.charAt(0) == '$') return Color.convertColor(colorName.substr(1));
		for each (var ln: string in lookupNames) {
		var  lookup: Record<string, any> = palette.lookupObjects[ln];
			if (lookup && colorName in lookup) return Color.convertColor(lookup[colorName]);
		}
		return defaultt;
	}
	public  colorValue(layerName: string,src: Record<string, any>):uint {
	var  sv: string = String(colorName(layerName,src));
		return lookup(layerName,sv);
	}
}

