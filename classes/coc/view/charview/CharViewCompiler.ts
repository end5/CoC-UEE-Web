/**
 * Coded by aimozg on 27.08.2017.
 */

export class CharViewCompiler extends Compiler{
	private  charview:CharView;
	public  CharViewCompiler(charview:CharView) {
		this.charview = charview;
	}

	protected  unknownTag(tag: string, x:XML):Statement {
		switch (tag){
			case 'show':
				return new LayerPart(charview.composite, x.@part, true);
			case 'hide':
				return new LayerPart(charview.composite, x.@part, false);
		}
		return super.unknownTag(tag, x);
	}
}

