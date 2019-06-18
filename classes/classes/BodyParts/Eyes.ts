/**
 * Container class for the players eyes
 * @since August 08, 2017
 * @author Stadler76
 */
export class Eyes {
    public static HUMAN: number = 0;
    public static FOUR_SPIDER_EYES: number = 1; // DEPRECATED, USE Eyes.SPIDER AND EYECOUNT = 4
    public static BLACK_EYES_SAND_TRAP: number = 2;
    public static LIZARD: number = 3;
    public static DRAGON: number = 4; // Slightly different description/TF and *maybe* in the future(!) grant different perks/combat abilities
    public static BASILISK: number = 5;
    public static WOLF: number = 6;
    public static SPIDER: number = 7;
    public static COCKATRICE: number = 8;
    public static CAT: number = 9;

    public type: number = Eyes.HUMAN;
    public count: number = 2;

    public setType(eyeType: number, eyeCount: number = NaN): void {
        type = eyeType;

        if (!isNaN(eyeCount)) {
            this.count = eyeCount;
            return;
        }

        switch (eyeType) {
            case Eyes.FOUR_SPIDER_EYES:
            case Eyes.SPIDER:
                type = Eyes.SPIDER; // Failsafe just in case ...
                this.count = 4;
                break;

            default:
                this.count = 2;
        }
    }

    public restore(): void {
        type = Eyes.HUMAN;
        this.count = 2;
    }

    public setProps(p: Record<string, any>): void {
        if (p.hasOwnProperty('type')) type = p.type;
        if (p.hasOwnProperty('count')) this.count = p.count;
    }

    public setAllProps(p: Record<string, any>): void {
        this.restore();
        this.setProps(p);
    }
}
