/**
 * Coded by aimozg on 11.07.2017.
 * Contains code from: any * TinyColor v1.4.1 by Brian Grinstead, MIT License
 */

export class Color {
    public static INVALID_COLOR: uint = 0x1ee00ee;
    public Color() {
    }
    public static convertColor(input: Record<string, any>): uint {
        return convertColorEx(input, false);
    }
    public static convertColor32(input: Record<string, any>): uint {
        return convertColorEx(input, true);
    }
    public static convertColorEx(input: Record<string, any>, alpha: boolean): uint {
        var s: string = input as String;
        if (s) return parseColorString(s);
        if (input is Number) return uint(input);
        if (!input) return INVALID_COLOR;
        if ('r' in input && 'g' in input && 'b' in input) {
            var r: number = input.r;
            var g: number = input.g;
            var b: number = input.b;
            var a: number = ('a' in input) ? input.a : 1.0;
            if (r <= 1 && g <= 1 && b <= 1 && a <= 1) return alpha ? fromArgbFloat(a, r, g, b) : fromRgbFloat(r, g, b);
            return alpha ? fromArgb(a, r, g, b) : fromRgb(r, g, b);
        }
        return INVALID_COLOR;
    }
    public static fromArgb(a: uint, r: uint, g: uint, b: uint): uint {
        return ((a & 0xff) << 24) | ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff);
    }
    public static fromRgb(r: uint, g: uint, b: uint): uint {
        return ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff);
    }
    public static fromArgbFloat(a: number, r: number, g: number, b: number): uint {
        return fromArgb(a * 255, r * 255, g * 255, b * 255);
    }
    public static fromRgbFloat(r: number, g: number, b: number): uint {
        return fromRgb(r * 255, g * 255, b * 255);
    }
    public static parseColorString(s: string, alpha: boolean = false): uint {
        var a: any[];
        if ((a = s.match(/^(?:0x|\$|#)([a-fA-F0-9]{8})$/))) {
            x = parseInt(a[1], 16);
            return alpha ? x : (x & 0x00ffffff);
        }
        var x: uint;
        if ((a = s.match(/^(?:0x|\$|#)([a-fA-F0-9]{6})$/))) {
            x = parseInt(a[1], 16);
        } else if ((a = s.match(/^(?:0x|\$|#)([a-fA-F0-9]{3})$/))) {
            var rgb12: uint = parseInt(a[1], 16);
            x = ((rgb12 & 0xf00) << (5 - 2) |
                (rgb12 & 0xf00) << (4 - 2) |
                (rgb12 & 0x0f0) << (3 - 1) |
                (rgb12 & 0x0f0) << (2 - 1) |
                (rgb12 & 0x00f) << (1 - 0) |
                (rgb12 & 0x00f) << (0 - 0));
        } else if ((a = s.match(/^hsl\((\d+),(\d+),(\d+)\)$/))) {
            x = fromHsl({ h: a[1], s: a[2], l: a[3] });
        } else {
            return INVALID_COLOR;
        }
        return alpha ? 0xff000000 | x : x;
    }
    public static toHsl(color: uint): Record<string, any> {
        var a: number = ((color >> 24) & 0xff) / 255.0;
        var r: number = ((color >> 16) & 0xff) / 255.0;
        var g: number = ((color >> 8) & 0xff) / 255.0;
        var b: number = ((color >> 0) & 0xff) / 255.0;

        var max: number = Math.max(r, g, b), min: number = Math.min(r, g, b);
        var h: number, s: number, l: number = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        }
        else {
            var d: number = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
                default: //It's there to shut up that Sonarcloud code smell.
            }

            h /= 6;
        }

        return { h: h * 360, s: s * 100, l: l * 100, a: a / 255.0 };
    }
    public static fromHsl(hsl: Record<string, any>): uint {
        var r: number, g: number, b: number;

        var h: number = Utils.boundFloat(0, hsl.h / 360, 1);
        var s: number = Utils.boundFloat(0, hsl.s / 100, 1);
        var l: number = Utils.boundFloat(0, hsl.l / 100, 1);

        function hue2rgb(p: number, q: number, t: number): number {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        if (s === 0) {
            r = g = b = l; // achromatic
        }
        else {
            var q: number = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p: number = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        if ('a' in hsl) return fromArgbFloat(hsl.a, r, g, b);
        return fromRgbFloat(r, g, b);
    }
    public static darken(color: uint, amount: number = 10): uint {
        var hsl: Record<string, any> = toHsl(color);
        hsl.l = Utils.boundFloat(0, hsl.l - amount, 100);
        return fromHsl(hsl);
    }
    public static lighten(color: uint, amount: number = 10): uint {
        var hsl: Record<string, any> = toHsl(color);
        hsl.l = Utils.boundFloat(0, hsl.l + amount, 100);
        return fromHsl(hsl);
    }
}

