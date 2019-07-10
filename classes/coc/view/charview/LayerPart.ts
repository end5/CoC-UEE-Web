/**
 * Coded by aimozg on 27.07.2017.
 */

export class LayerPart extends Statement {
	private  name: string;
	private  image:CompositeImage;
	private  visible: boolean;
	private  _prefix: boolean;

	public  LayerPart(image:CompositeImage, name: string, visible: boolean) {
		this.image = image;
		this.visible = visible;
		this.name = name;
	var  pp: any[] = name.match(/([^\/]+\/)\*/);
		if (pp) {
			this._prefix = true;
			this.name = pp[1];
		}
	}

	public  execute(context:ExecContext): void {
		if (_prefix) {
			image.setMultiVisibility(name,visible);
		} else {
			image.setVisibility(name, visible);
		}
	}
}

