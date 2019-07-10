/**
 * Coded by aimozg on 06.06.2017.
 */

export class UIUtils {
	public  UIUtils() {
	}
	public static  convertColor(input: Record<string, any>):uint {
		return Color.convertColor(input);
	}
	public static  convertTextFormat(input: Record<string, any>):TextFormat {
		if (input is TextFormat) return input as TextFormat;
	var  tf:TextFormat = new TextFormat();
		setProperties(tf,input,{
			'color':Color.convertColor
		});
		return tf;
	}
	public static  convertSize(value: Record<string, any>,ref100pc: number): number {
		if (value is Number) return Number(value);
		value = ''+value;
		if (value.indexOf('%') == value.length-1) {
			return Number(value.substr(0,value.length-1))*ref100pc/100;
		}
		return Number(value);
	}
	public static  setProperties(e: Record<string, any>,options: Record<string, any>,special: Record<string, any>=undefined): Record<string, any> {
		if (options) for (var key: string in options) {
			if (options.hasOwnProperty(key) && key in e) {
			var  spc = special ? special[key] as Function : undefined;
			var  value: any     = options[key];
				e[key] = spc != undefined ? spc(value) : value;
			}
		}
		return e;
	}

}

