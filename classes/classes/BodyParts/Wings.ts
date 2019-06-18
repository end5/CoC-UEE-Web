import { BaseBodyPart } from "./BaseBodyPart";

/**
 * Container class for the players wings
 * @since May 01, 2017
 * @author Stadler76
 */
export class Wings extends BaseBodyPart {
    public static NONE: number = 0;
    public static BEE_LIKE_SMALL: number = 1;
    public static BEE_LIKE_LARGE: number = 2;
    public static HARPY: number = 4;
    public static IMP: number = 5;
    public static BAT_LIKE_TINY: number = 6;
    public static BAT_LIKE_LARGE: number = 7;
    public static SHARK_FIN: number = 8; // Deprecated, moved to the rearBody slot.
    public static FEATHERED_LARGE: number = 9;
    public static DRACONIC_SMALL: number = 10;
    public static DRACONIC_LARGE: number = 11;
    public static GIANT_DRAGONFLY: number = 12;
    public static IMP_LARGE: number = 13;
    public static FAERIE_SMALL: number = 14; // currently for monsters only
    public static FAERIE_LARGE: number = 15; // currently for monsters only

    public type: number = Wings.NONE;
    public color: string = "no";
    public color2: string = "no";

    /**
     * Returns a string that describes, what the actual color number (=id) is for.
     * e. g.: Dragon Wings main color => "membranes" and secondary color => "bones"
     * @param   id  The 'number' of the chosen color (main = color, secondary = color2)
     * @return  The resulting description string
     */
    public getColorDesc(id: number): string {
        switch (type) {
            case Wings.DRACONIC_SMALL:
            case Wings.DRACONIC_LARGE:
                switch (id) {
                    case Wings.COLOR_ID_MAIN:
                        return "membranes";

                    case Wings.COLOR_ID_2ND:
                        return "bones";

                    default:
                        return "";
                }

            default:
                return "";
        }
    }

    public restore(): void {
        type = Wings.NONE;
        this.color = "no";
        this.color2 = "no";
    }

    public setProps(p: Record<string, any>): void {
        if (p.hasOwnProperty('type')) type = p.type;
        if (p.hasOwnProperty('color')) this.color = p.color;
        if (p.hasOwnProperty('color2')) this.color2 = p.color2;
    }

    public setAllProps(p: Record<string, any>): void {
        this.restore();
        this.setProps(p);
    }

    public canDye(): boolean {
        return [Wings.HARPY, Wings.FEATHERED_LARGE].indexOf(type) !== -1;
    }

    public hasDyeColor(_color: string): boolean {
        return this.color === _color;
    }

    public applyDye(_color: string): void {
        this.color = _color;
    }

    public canOil(): boolean {
        return [Wings.DRACONIC_SMALL, Wings.DRACONIC_LARGE].indexOf(type) !== -1;
    }

    public hasOilColor(_color: string): boolean {
        return this.color === _color;
    }

    public applyOil(_color: string): void {
        this.color = _color;
    }

    public canOil2(): boolean {
        return [Wings.DRACONIC_SMALL, Wings.DRACONIC_LARGE].indexOf(type) !== -1;
    }

    public hasOil2Color(_color2: string): boolean {
        return this.color2 === _color2;
    }

    public applyOil2(_color2: string): void {
        this.color2 = _color2;
    }
}
