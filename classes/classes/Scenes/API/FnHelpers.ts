import { BaseContent } from "../../BaseContent";
import { Encounters } from "./Encounters";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

/**
 * Created by aimozg on 28.03.2017.
 */

export class FnHelpers extends BaseContent {
    public static FN: FnHelpers = new FnHelpers();
    /**
     * @param chances An array of chances or chance functions
     * @return A function returning product of chances. If encountered, 0 beats INFINITY
     */
    public product(chances: any[]) {
        const saved: any[] = chances.concat([]);
        return () => {
            let rslt: number = 1;
            for (let i: number = 0; i < saved.length; i++) {
                const o: any = Encounters.convertChance(saved[i]);
                if (o <= 0) return 0;
                rslt *= o;
            }
            return rslt;
        };
    }

    /**
     * @param chance Number | Boolean | Function(): number|Boolean
     * @return Function returning 0 if `chance` is not 0, 1 otherwise
     */
    public not(chance: any) {
        return () => {
            const c: any = (typeof chance === 'function') ? chance() : chance;
            return Encounters.convertChance(c) ? 0 : 1;
        };
    }
    /**
     * @param chances Array of [Number | Boolean | Function(): number|Boolean]
     * @return Function returning 1 iff all chances are not 0, 0 if any is 0
     */
    public all(...chances: any[]) {
        return () => {
            for (const chance of chances) {
                let c: any = chance;
                if (typeof c === 'function') c = c();
                if (!Encounters.convertChance(c)) return 0;
            }
            return 1;
        };
    }
    /**
     * @param chances Array of [Number | Boolean | Function(): number|Boolean]
     * @return Function returning 1 iff all chances are 0, 0 if any is 1
     */
    public none(...chances: any[]) {
        return () => {
            for (const chance of chances) {
                let c: any = chance;
                if (typeof c === 'function') c = c();
                if (Encounters.convertChance(c)) return 0;
            }
            return 1;
        };
    }
    /**
     * @param chances Array of [Number | Boolean | Function(): number|Boolean]
     * @return Function returning 0 iff all chances are 0, 1 if any is not 0
     */
    public any(...chances: any[]) {
        return () => {
            for (const chance of chances) {
                let c: any = chance;
                if (typeof c === 'function') c = c();
                if (Encounters.convertChance(c)) return 1;
            }
            return 0;
        };
    }
    /**
     * @return Function returning `iftrue` if player is at least `level` or at least `daysPerLevel`*`level` days have passed, `iffalse` otherwise
     */
    public ifLevelMin(level: number, daysPerLevel: number = 6, iftrue: any = 1, iffalse: any = 0) {
        return () => {
            return (this.player.level >= level || this.time.days >= level * daysPerLevel) ? iftrue : iffalse;
        };
    }
    /**
     * @return Function returning Number, linearly dependent on player level: any - at levleA: valueA
     * - at levelB: valueB
     * - in levelA..levelB: linearly interpolated value
     * - if bound==true (default), for levels < levelA returns valueA, for levels > levelB returns valueB
     * - if bound==false, continues the interpolation outside the levelA..levelB interval,
     * optionally capped between min and max
     */
    public lineByLevel(
        levelA: number,
        levelB: number,
        valueA: number,
        valueB: number,
        bound: boolean = true,
        min: number = Number.NEGATIVE_INFINITY,
        max: number = Number.POSITIVE_INFINITY
    ) {
        return () => {
            return this.lerp(this.player.level, levelA, levelB, valueA, valueB, bound, min, max);
        };
    }

    /**
     * A linear interpolation of values xA..xB to yA..yB
     * - if bound==true (default), for x < xA returns xA, for x > xB returns xB
     * - if bound==false, continues the interpolation outside the xA..xB interval,
     * optionally capped between min and max
     */
    public lerp(
        x: number, xA: number, xB: number, yA: number, yB: number,
        bound: boolean = true, min: number = Number.NEGATIVE_INFINITY, max: number = Number.POSITIVE_INFINITY
    ): number {
        if (bound) {
            if (x <= xA) return yA;
            if (x >= xB) return yB;
        }
        if (xA == xB) return (yA + yB) / 2;
        const y: number = yA + (x - xA) * (yB - yA) / (xB - xA);
        return Math.min(max, Math.max(min, y));
    }

    /**
     * Solves
     *   a * ln(x1 - c) + b = y1
     *   a * ln(x2 - c) + b = y2 = (y3 + y1) / 2
     *   a * ln(x3 - c) + b = y3
     * for a,b,c
     * @return Object{a: number,b: number,c: number}
     */
    public buildLogScaleABC(x1: number, x2: number, x3: number, y1: number, y3: number): Record<string, any> {
        const dy: number = (y3 - y1) / 2;
        /*
         * subtract one equation from another
         * y3 - y2 = a * ln[(x3 - c) / (x2 - c)]
         * y2 - y1 = a * ln[(x2 - c) / (x1 - c)]
         * (x2 - c) / (x1 - c) = (x3 - c) / (x2 - c) = exp(dy / a)
         * x & c part reduces into c*(2*x2 - x1 - x3) = x2*x2 - x1*x3
         */
        const c: number = (x2 * x2 - x1 * x3) / (2 * x2 - x1 - x3);
        const a: number = dy / Math.log((x2 - c) / (x1 - c));
        const b: number = y1 - a * Math.log(x1 - c);
        return { a, b, c };
    }

    /**
     * @param abc Object{a: number,b: number,c: number}
     * @return a * ln(x - c) + b, clamped into [min..max]
     */
    public logScale(x: number, abc: Record<string, any>, min: number = Number.NEGATIVE_INFINITY, max: number = Number.POSITIVE_INFINITY): number {
        const y: number = abc.a * Math.log(x - abc.c) + abc.b;
        return Math.min(max, Math.max(min, y));
    }

    /**
     * @return Function returning `iftrue` if current time (in hours) is between `minimum` (0-23, INCLUSIVELY) and `maximum` (0-24, EXCLUSIVELY)
     */
    public ifTimeOfDay(minimum: number, maximum: number, iftrue: any = 1, iffalse: any = 0) {
        return () => {
            const hours: number = this.time.hours;
            return (hours >= minimum && hours < maximum) ? iftrue : iffalse;
        };
    }

    /**
     * @return Function returning `iftrue` if NG+ level is at least `minimum`, `iffalse` otherwise
     */
    public ifNGplusMin(minimum: number, iftrue: any = 1, iffalse: any = 0) {
        return () => {
            return this.flags[kFLAGS.NEW_GAME_PLUS_LEVEL] > 0 ? iftrue : iffalse;
        };
    }

    public ifPregnantWith(pregnancyType: number, iftrue: any = 1, iffalse: any = 0) {
        return () => {
            return this.player.pregnancyIncubation > 1 && this.player.pregnancyType == pregnancyType ? iftrue : iffalse;
        };
    }
}
