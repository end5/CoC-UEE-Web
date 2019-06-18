/**
 * Container class for the players gills
 * @since November 07, 2017
 * @author Stadler76
 */
export class Gills {
    public static NONE: number = 0;
    public static ANEMONE: number = 1;
    public static FISH: number = 2;

    public type: number = Gills.NONE;

    public restore(): void {
        type = Gills.NONE;
    }

    public setProps(p: Record<string, any>): void {
        if (p.hasOwnProperty('type')) type = p.type;
    }

    public setAllProps(p: Record<string, any>): void {
        this.restore();
        this.setProps(p);
    }
}
