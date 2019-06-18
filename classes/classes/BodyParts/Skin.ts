import { Appearance } from "../Appearance";

/**
 * Container class for the players skin
 * @since December 27, 2016
 * @author Stadler76
 */
export class Skin {
    public static PLAIN: number = 0;
    public static FUR: number = 1;
    public static LIZARD_SCALES: number = 2;
    public static GOO: number = 3;
    public static UNDEFINED: number = 4; // DEPRECATED, silently discarded upon loading a saved game
    public static DRAGON_SCALES: number = 5;
    public static FISH_SCALES: number = 6; // NYI, for future use
    public static WOOL: number = 7;
    public static FEATHERED: number = 8;
    public static BARK: number = 9;
    public type: number = Skin.PLAIN;
    public tone: string = "albino";
    public desc: string = "skin";
    public adj: string = "";
    public furColor: string = "no";

    public setType(value: number): void {
        this.desc = Appearance.DEFAULT_SKIN_DESCS[value];
        type = value;
    }

    public skinFurScales(): string {
        let skinzilla: string = "";
        // Adjectives first!
        if (this.adj !== "")
            skinzilla += this.adj + ", ";

        // Fur handled a little differently since it uses haircolor
        skinzilla += this.isFluffy() ? this.furColor : this.tone;

        return skinzilla + " " + this.desc;
    }

    public description(noAdj: boolean = false, noTone: boolean = false): string {
        let skinzilla: string = "";

        // Adjectives first!
        if (!noAdj && this.adj !== "" && !noTone && this.tone !== "rough gray")
            skinzilla += this.adj + ", ";
        if (!noTone)
            skinzilla += this.tone + " ";

        // Fur handled a little differently since it uses haircolor
        skinzilla += this.isFluffy() ? "skin" : this.desc;

        return skinzilla;
    }

    public hasFur(): boolean {
        return type === Skin.FUR;
    }

    public hasWool(): boolean {
        return type === Skin.WOOL;
    }

    public hasFeathers(): boolean {
        return type === Skin.FEATHERED;
    }

    public isFurry(): boolean {
        return [Skin.FUR, Skin.WOOL].indexOf(type) !== -1;
    }

    public isFluffy(): boolean {
        return [Skin.FUR, Skin.WOOL, Skin.FEATHERED].indexOf(type) !== -1;
    }

    public restore(keepTone: boolean = true): void {
        type = Skin.PLAIN;
        if (!keepTone) this.tone = "albino";
        this.desc = "skin";
        this.adj = "";
        this.furColor = "no";
    }

    public setProps(p: Record<string, any>): void {
        if (p.hasOwnProperty('type')) type = p.type;
        if (p.hasOwnProperty('tone')) this.tone = p.tone;
        if (p.hasOwnProperty('desc')) this.desc = p.desc;
        if (p.hasOwnProperty('adj')) this.adj = p.adj;
        if (p.hasOwnProperty('furColor')) this.furColor = p.furColor;
    }

    public setAllProps(p: Record<string, any>, keepTone: boolean = true): void {
        this.restore(keepTone);
        this.setProps(p);
    }

    public toObject(): Record<string, any> {
        return {
            type,
            tone: this.tone,
            desc: this.desc,
            adj: this.adj,
            furColor: this.furColor
        };
    }
}
