/**
 * Coded by aimozg on 28.07.2017.
 */

export class EvalPaletteProperty extends PaletteProperty{
	private  srcfn:Eval;

	public  EvalPaletteProperty(palette:Palette, name: string, defaultt:uint, lookupNames:/*String*/Array, expr: string) {
		super(palette,name,defaultt,lookupNames);
		this.srcfn = Eval.compile(expr);
	}

	public override function colorName(layerName: string, src: Record<string, any>): any {
		return srcfn.call(src);
	}
}

