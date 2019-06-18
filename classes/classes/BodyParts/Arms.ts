import { Creature } from "../Creature";
import { Claws } from "./Claws";

/**
 * Container class for the players arms
 * @since November 07, 2017
 * @author Stadler76
 */
export class Arms {
    public static HUMAN: number = 0;
    public static HARPY: number = 1;
    public static SPIDER: number = 2;
    public static BEE: number = 3;
    public static PREDATOR: number = 4;
    public static SALAMANDER: number = 5;
    public static WOLF: number = 6;
    public static COCKATRICE: number = 7;
    public static RED_PANDA: number = 8;
    public static FERRET: number = 9;
    public static CAT: number = 10;
    public static DOG: number = 11;
    public static FOX: number = 12;

    private _creature: Creature | undefined;
    public type: number = Arms.HUMAN;
    public claws: Claws = new Claws();

    public constructor(i_creature?: Creature) {
        this._creature = i_creature;
    }

    public setType(armType: number, clawType: number = Claws.NORMAL): void {
        type = armType;

        switch (armType) {
            case Arms.PREDATOR: this.updateClaws(clawType); break;
            case Arms.SALAMANDER: this.updateClaws(Claws.SALAMANDER); break;
            case Arms.COCKATRICE: this.updateClaws(Claws.COCKATRICE); break;
            case Arms.RED_PANDA: this.updateClaws(Claws.RED_PANDA); break;
            case Arms.FERRET: this.updateClaws(Claws.FERRET); break;
            case Arms.CAT: this.updateClaws(Claws.CAT); break;
            case Arms.DOG: this.updateClaws(Claws.DOG); break;
            case Arms.FOX: this.updateClaws(Claws.FOX); break;

            case Arms.HUMAN:
            case Arms.HARPY:
            case Arms.SPIDER:
            case Arms.BEE:
            case Arms.WOLF:
            default: this.updateClaws(clawType);
        }
    }

    public updateClaws(clawType: number = Claws.NORMAL): string {
        let clawTone: string = "";
        const oldClawTone: string = this.claws.tone;

        switch (clawType) {
            case Claws.DRAGON: clawTone = "steel-gray"; break;
            case Claws.SALAMANDER: clawTone = "fiery-red"; break;
            case Claws.LIZARD:
                if (this._creature === undefined)
                    break;
                // See http://www.bergenbattingcenter.com/lizard-skins-bat-grip/ for all those NYI! lizard skin colors
                // I'm still not that happy with these claw tones. Any suggestion would be nice.
                switch (this._creature.skin.tone) {
                    case "red": clawTone = "reddish"; break;
                    case "green": clawTone = "greenish"; break;
                    case "white": clawTone = "light-gray"; break;
                    case "blue": clawTone = "bluish"; break;
                    case "black": clawTone = "dark-gray"; break;
                    case "purple": clawTone = "purplish"; break;
                    case "silver": clawTone = "silvery"; break;
                    case "pink": clawTone = "pink"; break;
                    case "orange": clawTone = "orangey"; break;
                    case "yellow": clawTone = "yellowish"; break;
                    case "desert-camo": clawTone = "pale-yellow"; break; // NYI!
                    case "gray-camo": clawTone = "gray"; break; // NYI!
                    default: clawTone = "gray"; break;
                }
                break;
            case Claws.IMP:
                if (this._creature !== undefined)
                    clawTone = this._creature.skin.tone;
                break;
            default:
                clawTone = "";
        }

        this.claws.type = clawType;
        this.claws.tone = clawTone;

        return oldClawTone;
    }

    public restore(): void {
        type = Arms.HUMAN;
        this.claws.restore();
    }

    public setProps(p: Record<string, any>): void {
        if (p.hasOwnProperty('type')) type = p.type;
        if (p.hasOwnProperty('claws')) this.claws.setProps(p.claws);
    }

    public setAllProps(p: Record<string, any>): void {
        this.restore();
        this.setProps(p);
    }
}
