/**
 * Container class for the players tongue
 * @since August 08, 2017
 * @author Stadler76
 */
export class Tongue {
    public static HUMAN: number = 0;
    public static SNAKE: number = 1;
    public static DEMONIC: number = 2;
    public static DRACONIC: number = 3;
    public static ECHIDNA: number = 4;
    public static LIZARD: number = 5;
    public static CAT: number = 6;

    public type: number = Tongue.HUMAN;

    public restore(): void {
        type = Tongue.HUMAN;
    }

    public setProps(p: Record<string, any>): void {
        if (p.hasOwnProperty('type')) type = p.type;
    }

    public setAllProps(p: Record<string, any>): void {
        this.restore();
        this.setProps(p);
    }
}
