/**
 * Coded by aimozg on 06.01.2019.
 */

export class Palette implements IKeyColorProvider {
	private  _keyColorsList:/*KeyColor*/Array = [];
	private  _lookupObjects: Record<string, any>            = {}; // { dict_name => { color_name => color_string } }
	private  _paletteProps:/*PaletteProperty*/Array = [];
	private  _character: Record<string, any>                      = undefined;
	private  _cachedKeyColors: Record<string, any>                = {};
	public  addKeyColor(src:uint,base: string,tf: string): void {
		this._keyColorsList.push(new KeyColor(src,base,tf));
	}
	public  addLookups(name: string,lookup: Record<string, any>): void {
		_lookupObjects[name] = lookup;
	}
	public  addPaletteProperty(pp:PaletteProperty): void {
		this._paletteProps.push(pp);
	}
	/**
	 * @param propToColor { prop_name -> color_value }
	 * @return { key_color -> actual_color }
	 */
	protected  keyColorsFromProperties(propToColor: Record<string, any>): Record<string, any> {
	var  keyColorsMap: Record<string, any> = {};
		for each (var color:KeyColor in _keyColorsList) {
			keyColorsMap[color.src] = color.transform(propToColor[color.base]);
		}
		return keyColorsMap;
	}
	public  set character(value: Record<string, any>): void {
		_character       = value;
		_cachedKeyColors = {};
	}
	public  get keyColorsList(): any[] {
		return _keyColorsList;
	}
	public  get lookupObjects(): Record<string, any> {
		return _lookupObjects;
	}
	// { key_color -> actual_color }
	public  allKeyColorsFor(layerName: string): Record<string, any> {
		if (!_cachedKeyColors[layerName]) {
		var  props: Record<string, any> = {};
			for each (var property:PaletteProperty in _paletteProps) {
				props[property.name] = property.colorValue(layerName, _character);
			}
			_cachedKeyColors[layerName] = keyColorsFromProperties(props);
		}
		return _cachedKeyColors[layerName];
	}
	public  lookupColor(layername: string, propname: string, colorname: string):uint {
		for each (var property:PaletteProperty in _paletteProps) {
			if (property.name == propname) return property.lookup(layername, colorname);
		}
		return 0xfff000e0;
	}
}

