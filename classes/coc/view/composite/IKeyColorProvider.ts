/**
 * Coded by aimozg on 06.01.2019.
 */
public interface IKeyColorProvider {
	/**
	 * @return uint color24 -> uint color24
	 */
function  allKeyColorsFor(layerName: string): Record<string, any>;
}

