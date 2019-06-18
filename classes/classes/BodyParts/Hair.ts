/**
 * Container class for the players hair
 * @since August 08, 2017
 * @author Stadler76
 */
export class Hair {
    public static NORMAL: number = 0;
    public static FEATHER: number = 1;
    public static GHOST: number = 2;
    public static GOO: number = 3;
    public static ANEMONE: number = 4;
    public static QUILL: number = 5;
    public static BASILISK_SPINES: number = 6;
    public static BASILISK_PLUME: number = 7;
    public static WOOL: number = 8;
    public static LEAF: number = 9;

    public type: number = Hair.NORMAL;
    public color: string = "no";
    public length: number = 0;

    public restore(): void {
        type = Hair.NORMAL;
        this.color = "no";
        length = 0;
    }

    public setProps(p: Record<string, any>): void {
        if (p.hasOwnProperty('type')) type = p.type;
        if (p.hasOwnProperty('color')) this.color = p.color;
        if (p.hasOwnProperty('length')) length = p.length;
    }

    public setAllProps(p: Record<string, any>): void {
        this.restore();
        this.setProps(p);
    }
}
