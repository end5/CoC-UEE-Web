/**
 * Container class for the players claws
 * @since November 08, 2017
 * @author Stadler76
 */
export class Claws {
    public static NORMAL: number = 0;
    public static LIZARD: number = 1;
    public static DRAGON: number = 2;
    public static SALAMANDER: number = 3;
    public static CAT: number = 4;
    public static DOG: number = 5;
    public static FOX: number = 6;
    public static MANTIS: number = 7; // NYI! Placeholder for Xianxia mod
    public static IMP: number = 8;
    public static COCKATRICE: number = 9;
    public static RED_PANDA: number = 10;
    public static FERRET: number = 11;

    public type: number = Claws.NORMAL;
    public tone: string = "";

    public restore(): void {
        type = Claws.NORMAL;
        this.tone = "";
    }

    public setProps(p: Record<string, any>): void {
        if (p.hasOwnProperty('type')) type = p.type;
        if (p.hasOwnProperty('tone')) this.tone = p.tone;
    }

    public setAllProps(p: Record<string, any>): void {
        this.restore();
        this.setProps(p);
    }
}
