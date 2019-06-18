import { BaseBodyPart } from "./BaseBodyPart";

/**
 * Container class for the players neck
 * @since December 19, 2016
 * @author Stadler76
 */
export class Neck extends BaseBodyPart {
    public static NORMAL: number = 0; // normal human neck. neckLen = 2 inches
    public static DRACONIC: number = 1; // (western) dragon neck. neckLen = 2-30 inches
    public static COCKATRICE: number = 2;

    public type: number = Neck.NORMAL;
    public len: number = 2;
    public pos: boolean = false;
    public color: string = "no";

    private _nlMax: any[] = [];
    public get nlMax(): any[] { return this._nlMax; }

    public constructor() {
        super();
        this._nlMax[Neck.NORMAL] = 2;
        this._nlMax[Neck.DRACONIC] = 30;
    }

    public restore(): void {
        type = Neck.NORMAL;
        this.len = 2;
        this.pos = false;
        this.color = "no";
    }

    public setProps(p: Record<string, any>): void {
        if (p.hasOwnProperty('type')) type = p.type;
        if (p.hasOwnProperty('len')) this.len = p.len;
        if (p.hasOwnProperty('pos')) this.pos = p.pos;
        if (p.hasOwnProperty('color')) this.color = p.color;
    }

    public setAllProps(p: Record<string, any>): void {
        this.restore();
        this.setProps(p);
    }

    public modify(diff: number, newType: number = -1): void {
        if (newType !== -1) type = newType;

        if (this._nlMax[type] === undefined) { // Restore length and pos, if the type is not associated with a certain max length
            this.pos = false;
            this.len = 2;
            return;
        }

        this.len += diff;
        if (this.len < 2) this.len = 2;
        if (this.len > this._nlMax[type]) this.len = this._nlMax[type];
    }

    public isFullyGrown(): boolean {
        return this.len >= this._nlMax[type];
    }

    public canDye(): boolean {
        return type === Neck.COCKATRICE;
    }

    public hasDyeColor(_color: string): boolean {
        return this.color === _color;
    }

    public applyDye(_color: string): void {
        this.color = _color;
    }

    public toObject(): Record<string, any> {
        return {
            type,
            len: this.len,
            pos: this.pos,
            color: this.color
        };
    }
}
