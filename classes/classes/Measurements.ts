	/**
	 * Class to make the measurement methods taken from PlayerAppearance globally accessible
	 * @since  19.08.2016
	 * @author Stadler76
	 */
	export class Measurements
	{
		public static  footInchOrMetres(inches: number, precision: number = 2): string
		{
			if (kGAMECLASS.flags[kFLAGS.USE_METRICS])
				return (Math.round(inches * 2.54) / Math.pow(10, precision)).toFixed(precision) + " metres";

			return Math.floor(inches / 12) + " foot " + inches % 12 + " inch";
		}

		public static  numInchesOrCentimetres(inches: number): string
		{
			if (inches < 1) return inchesOrCentimetres(inches);

		var  value: number = Math.round(inches);

			if (kGAMECLASS.flags[kFLAGS.USE_METRICS]) {
				value = Math.round(inches * 2.54);
				return Utils.num2Text(value) + (value === 1 ? " centimetre" : " centimetres");
			}

			if (inches % 12 === 0)
				return (inches === 12 ? "a foot" : Utils.num2Text(inches / 12) + " feet");

			return Utils.num2Text(value) + (value === 1 ? " inch" : " inches");
		}

		public static  inchesOrCentimetres(inches: number, precision: number = 1): string
		{
		var  value: number = Math.round(inchToCm(inches) * Math.pow(10, precision)) / Math.pow(10, precision);
		var  text: string = value + (kGAMECLASS.flags[kFLAGS.USE_METRICS] ? " centimetre" : " inch");

			if (value === 1) return text;

			return text + (kGAMECLASS.flags[kFLAGS.USE_METRICS] ? "s" : "es");
		}

		public static  shortSuffix(inches: number, precision: number = 1): string
		{
		var  value: number = Math.round(inchToCm(inches) * Math.pow(10, precision)) / Math.pow(10, precision);
			return value + (kGAMECLASS.flags[kFLAGS.USE_METRICS] ? "-cm" : "-inch");
		}

		public static  inchToCm(inches: number): number
		{
			return kGAMECLASS.flags[kFLAGS.USE_METRICS] ? inches * 2.54 : inches;
		}
	}

