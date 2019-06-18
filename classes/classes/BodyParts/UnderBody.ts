import { Skin } from "./Skin";

/**
 * Container class for the players underbody
 * @since December 31, 2016
 * @author Stadler76
 */
export class UnderBody {
    public static NONE: number = 0;
    public static REPTILE: number = 1;
    public static DRAGON: number = 2; // Deprecated. Changed to 1 (UnderBody.REPTILE) upon loading a savegame
    public static FURRY: number = 3;
    public static NAGA: number = 4;
    public static WOOL: number = 5; // Deprecated. Changed to 3 (UnderBody.FURRY) upon loading a savegame
    public static COCKATRICE: number = 6;

    public type: number = UnderBody.NONE;
    public skin: Skin = new Skin();

    public skinDescription(...args: any): string { return this.skin.description.apply(undefined, args); }
    public skinFurScales(...args: any): string { return this.skin.skinFurScales.apply(undefined, args); }

    public restore(keepTone: boolean = true): void {
        type = UnderBody.NONE;
        this.skin.restore(keepTone);
    }

    public setProps(p: Record<string, any>): void {
        if (p.hasOwnProperty('type')) type = p.type;
        if (p.hasOwnProperty('skin')) this.skin.setProps(p.skin);
    }

    public setAllProps(p: Record<string, any>, keepTone: boolean = true): void {
        this.restore(keepTone);
        this.setProps(p);
    }

    public toObject(): Record<string, any> {
        return {
            type,
            skin: this.skin.toObject()
        };
    }
}
