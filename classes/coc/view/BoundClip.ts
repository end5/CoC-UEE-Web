/**
 * Coded by aimozg on 02.12.2017.
 */

export class BoundClip extends MovieClip{
	public static  nextContent:Sprite;
	public  BoundClip() {
		if (nextContent != undefined) {
			addChild(nextContent);
		}
	}
	
}

