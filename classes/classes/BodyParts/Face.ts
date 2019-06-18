import { Creature } from "../Creature";
import { Eyes } from "./Eyes";

/**
 * Container class for the players face
 * @since August 08, 2017
 * @author Stadler76
 */
export class Face {
    public static HUMAN: number = 0;
    public static HORSE: number = 1;
    public static DOG: number = 2;
    public static COW_MINOTAUR: number = 3;
    public static SHARK_TEETH: number = 4;
    public static SNAKE_FANGS: number = 5;
    public static CATGIRL: number = 6;
    public static LIZARD: number = 7;
    public static BUNNY: number = 8;
    public static KANGAROO: number = 9;
    public static SPIDER_FANGS: number = 10;
    public static FOX: number = 11;
    public static DRAGON: number = 12;
    public static RACCOON_MASK: number = 13;
    public static RACCOON: number = 14;
    public static BUCKTEETH: number = 15;
    public static MOUSE: number = 16;
    public static FERRET_MASK: number = 17;
    public static FERRET: number = 18;
    public static PIG: number = 19;
    public static BOAR: number = 20;
    public static RHINO: number = 21;
    public static ECHIDNA: number = 22;
    public static DEER: number = 23;
    public static WOLF: number = 24;
    public static COCKATRICE: number = 25;
    public static BEAK: number = 26; // This is a placeholder for the next beaked face type, so feel free to refactor (rename)
    public static RED_PANDA: number = 27;
    public static CAT: number = 28;

    private _creature: Creature | undefined;
    public type: number = Face.HUMAN;

    public constructor(i_creature?: Creature) {
        this._creature = i_creature;
    }

    public setType(faceType: number, eyeType: number = NaN): void {
        type = faceType;

        if (this._creature === undefined) {
            return;
        }

        if (!isNaN(eyeType)) {
            this._creature.eyes.setType(eyeType);
            return;
        }

        switch (faceType) {
            case Face.CAT:
            case Face.CATGIRL:
                this._creature.eyes.setType(Eyes.CAT);
                break;

            default:
            // Empty default because SonarQQbe ...
        }
    }

    public restore(): void {
        type = Face.HUMAN;
    }

    public setProps(p: Record<string, any>): void {
        if (p.hasOwnProperty('type')) type = p.type;
    }

    public setAllProps(p: Record<string, any>): void {
        this.restore();
        this.setProps(p);
    }
}
