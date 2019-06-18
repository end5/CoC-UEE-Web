/**
 * Container class for the players ears
 * @since August 08, 2017
 * @author Stadler76
 */
export class Ears {
    public static HUMAN: number = 0;
    public static HORSE: number = 1;
    public static DOG: number = 2;
    public static COW: number = 3;
    public static ELFIN: number = 4;
    public static CAT: number = 5;
    public static LIZARD: number = 6;
    public static BUNNY: number = 7;
    public static KANGAROO: number = 8;
    public static FOX: number = 9;
    public static DRAGON: number = 10;
    public static RACCOON: number = 11;
    public static MOUSE: number = 12;
    public static FERRET: number = 13;
    public static PIG: number = 14;
    public static RHINO: number = 15;
    public static ECHIDNA: number = 16;
    public static DEER: number = 17;
    public static WOLF: number = 18;
    public static SHEEP: number = 19;
    public static IMP: number = 20;
    public static COCKATRICE: number = 21;
    public static RED_PANDA: number = 22;

    public type: number = Ears.HUMAN;
    public value: number = 0;

    public restore(): void {
        type = Ears.HUMAN;
        this.value = 0;
    }

    public setProps(p: Record<string, any>): void {
        if (p.hasOwnProperty('type')) type = p.type;
        if (p.hasOwnProperty('value')) this.value = p.value;
    }

    public setAllProps(p: Record<string, any>): void {
        this.restore();
        this.setProps(p);
    }
}
