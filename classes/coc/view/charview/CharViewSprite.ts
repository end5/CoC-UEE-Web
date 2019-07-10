/**
 * Coded by aimozg on 06.08.2017.
 */

export class CharViewSprite {
	public  bmp:BitmapData;
	public  dx: number;
	public  dy: number;
	public  CharViewSprite(
			bmp:BitmapData,
			dx: number,
			dy: number
	) {
		this.bmp = bmp;
		this.dx = dx;
		this.dy = dy;
	}
}

