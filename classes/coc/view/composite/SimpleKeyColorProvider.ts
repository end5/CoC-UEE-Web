/**
 * Coded by aimozg on 06.01.2019.
 */
export class SimpleKeyColorProvider implements IKeyColorProvider {
	private  _keyColors: Record<string, any>;
	
	/**
	 * @param keyColors uint color24 -> uint color24
	 */
	public  SimpleKeyColorProvider(keyColors: Record<string, any>) {
		_keyColors = keyColors;
	}
	public  allKeyColorsFor(layerName: string): Record<string, any> {
		return _keyColors;
	}
}

