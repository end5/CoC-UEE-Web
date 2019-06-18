/**
 * Created by aimozg on 18.01.14.
 */
	
	export class Utils extends Object
	{
		private static  LOGGER:ILogger = LoggerFactory.getLogger(Utils);
		
		private static  NUMBER_WORDS_NORMAL: any[]		= ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
		private static  NUMBER_WORDS_CAPITAL: any[]		= ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
		private static  NUMBER_WORDS_POSITIONAL: any[]	= ["zeroth", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];

		/**
		 * Default RNG instance. Uses Utils.rand internally.
		 */
		public static  DEFAULT_RNG:RandomNumberGenerator = new ActionScriptRNG();
		
		public  Utils()
		{
		}
		
		// curryFunction(f,args1)(args2)=f(args1.concat(args2))
		// e.g. curryFunction(f,x,y)(z,w) = f(x,y,z,w)
		public static  curry(func,...args)
		{
			if (func == undefined) CoC_Settings.error("carryFunction(undefined,"+args+")");
			return function (...args2): any{
				return func.apply(undefined,args.concat(args2));
			};
		}
		public static  bindThis(func,thiz: Record<string, any>) {
			return function(...args2): any {
				return func.apply(thiz,args2);
			}
		}
		public static  formatStringArray(stringList: any[]): string { //Changes an array of values into "1", "1 and 2" or "1, (x, )y and z"
			switch (stringList.length) {
				case  0: return "";
				case  1: return stringList[0];
				case  2: return stringList[0] + " and " + stringList[1];
				default:
			}
		var  concat: string = stringList[0];
			for (var x: number = 1; x < stringList.length - 1; x++) concat += ", " + stringList[x];
			return concat + " and " + stringList[stringList.length - 1];
		}
		public static  stringOr(input: any,def: string=""): string {
			return (input is String) ? input : def;
		}
		public static  intOr(input: any,def: number=0): number {
			return (input is int) ? input :
					(input is Number) ? input|0 : def;
		}
		public static  numberOr(input: any,def: number=0): number {
			return (input is Number) ? input : def;
		}
		public static  objectOr(input: any,def: Record<string, any>=undefined): Record<string, any> {
			return (input is Object && input !== undefined) ? input : def;
		}
		public static  boundInt(min: number, x: number, max: number): number {
			return x < min ? min : x > max ? max : x;
		}
		public static  boundFloat(min: number, x: number, max: number): number {
			if (!isFinite(x)) return min;
			return x < min ? min : x > max ? max : x;
		}
		public static  ipow(base: number,exponent: number): number {
			if (exponent<0) return 0;
		var  x: number=1;
			while(exponent-->0) x*=base;
			return x;
		}
		/**
		 * Round (value) to (decimals) decimal digits
		 */
		public static  round(value: number,decimals: number=0): number {
			if (decimals<=0) return Math.round(value);
		var  factor: number = ipow(10,decimals);
			return Math.round(value*factor)/factor;
		}
		/**
		 * Round (value) up to (decimals) decimal digits
		 */
		public static  ceil(value: number,decimals: number=0): number {
			if (decimals<=0) return Math.ceil(value);
		var  factor: number = ipow(10,decimals);
			return Math.ceil(value*factor)/factor;
		}
		/**
		 * Round (value) down to (decimals) decimal digits
		 */
		public static  floor(value: number,decimals: number=0): number {
			if (decimals<=0) return Math.floor(value);
		var  factor: number = ipow(10,decimals);
			return Math.floor(value*factor)/factor;
		}
		/**
		 * Deleting obj[key] with default.
		 *
		 * If `key` in `obj`: return `obj[key]` and delete `obj[key]`
		 * Otherwise return `defaultValue`
		 */
		public static  moveValue(obj: Record<string, any>,key: string,defaultValue: any): any {
			if (key in obj) {
				defaultValue = obj[key];
				delete obj[key];
			}
			return defaultValue;
		}
		/**
		 * Performs a shallow copy of properties from `src` to `dest`, then from `srcRest` to `dest`
		 * A `hasOwnProperties` check is performed.
		 */
		public static  extend(dest: Record<string, any>, src: Record<string, any>, ...srcRest: any[]): Record<string, any> {
			srcRest.unshift(src);
			for each(src in srcRest) {
				for (var k: string in src) {
					if (src.hasOwnProperty(k)) dest[k] = src[k];
				}
			}
			return dest;
		}
		/**
		 * Returns a shallow copy of `src` ownProperties
		 */
		public static  shallowCopy(src: Record<string, any>): Record<string, any> {
			return copyObject({},src);
		}
		/**
		 * Performs a shallow copy of properties from `src` to `dest`.
		 * If `properties` is supplied, only listed properties are copied.
		 * If not, all ownProperties of `src` are copied.
		 *
		 * @param properties array of property descriptors: any <ul><li><code>key: string</code>
		 *     =&gt; <code>dest[key] = src.key]</code></li>
		 *     <li><code>[dkey: string, skey: string]</code>
		 *     =&gt; <code>dest[dkey] = src[skey]</code>
		 *     <li>object with properties: any         <ul><li><code>skey: string, dkey: string</code> or <code>key: string</code></li>
		 *         <li>(optional) <code>'default': any|Function</code> to provide default value.
		 *         If function, called with no arguments</li></ul>
		 * </ul>
		 * @return dest
		 */
		public static  copyObject(dest: Record<string, any>, src: Record<string, any>,...properties: any[]): Record<string, any> {
			return copyObjectEx(dest, src, properties, true);
		}
		/**
		 * @see Utils.copyObject
		 * @param forward if true, use <code>dest[dkey]</code> and <code>src[skey]</code>.
		 * if false, use <code>dest[skey]</code> and <code>src[dkey]</code>.
		 * This option is useful when you have one set of descriptors to use it in both directions
		 * @param ignoreErrors If assignment throws an error, continue to next property.
		 * @return dest
		 */
		public static  copyObjectEx(dest: Record<string, any>, src: Record<string, any>, properties: any[], forward: boolean = true, ignoreErrors: boolean = false): Record<string, any> {
			if (properties.length == 0) return extend(dest,src);
			for each (var pd: any in properties) {
			var  skey: string,dkey: string,v: any;
			var  def: any,hasDefault: boolean=false;
				if (pd is String) {
					skey = pd;
					dkey = pd;
				} else if (pd is Array) {
					if (pd.length==2) {
						if (forward) {
							dkey = pd[0];
							skey = pd[1];
						}else {
							dkey = pd[1];
							skey = pd[0];
						}
					} 
				} else if (pd is Object) {
					if ("key" in pd) {
						skey = dkey = pd.key;
					} else if ("skey" in pd && "dkey" in pd) {
						skey = pd.skey;
						dkey = pd.dkey;
					} else {
						LOGGER.warn("Missing 'key' or 'skey'+'dkey' in property descriptor {0}", pd);
						continue;
					}
					if (!forward) {
						// we can't do it in the assignment below because of the check
					var  tmp: string = skey;
						skey = dkey;
						dkey = tmp;
					}
					if ("default" in pd) {
						def = pd["default"];
						hasDefault = true;
					}
				}
				if (skey in src) {
					v = src[skey];
				} else if (hasDefault) {
					if (def is Function) v = def();
					else v = def();
				} else continue;
				try {
					dest[dkey] = v;
				} catch (e:Error) {
					if (!ignoreErrors) throw e;
				}
			}
			return dest;
		}
		/**
		 * [ [key1,value1], [key2, value2], ... ] -> { key1: value1, key2: value2, ... }
		 */
		public static  createMapFromPairs(src: any[]): Record<string, any> {
			return multipleMapsFromPairs(src)[0];
		}
		/**
		 * [ [key1, value1_1, value1_2, ...],
		 *   [key2, value2_1, value2_2, ...], ... ]
		 *   ->
		 * [ { key1: value1_1,
		 *     key2: value2_1, ...
		 *   }, {
		 *     key1: value1_2,
		 *     key2: value2_2, ...
		 *   }, ... ]
		 */
		public static  multipleMapsFromPairs(src: any[]): any[] {
		var  results: any[] = [{}];
			for each(var tuple: any[] in src) {
				while (results.length < tuple.length-1) results.push({});
			var  key: any = tuple[0];
				for (var i: number = 1; i<tuple.length; i++) results[i-1][key] = tuple[i];
			}
			return results;
		}

		/**
		 * Convert a mixed array to an array of strings
		 *
		 * Some string lists (color lists for example) may contain strings and arrays containing 2+ strings.
		 * e. g.: ["blue", "green", ["black", "white", "gray"], ["red", "orange"], "blue"]
		 * With this method such an array would be converted to contain only string.
		 * So the above example would return: any ["blue", "green", "black, white and gray", "red and orange", "blue"]
		 *
		 * @param   list  An array with mixed strings and arrays of strings
		 * @return  An array of strings
		 */
		public static  convertMixedToStringArray(list: any[]): any[]
		{
		var  returnArray: any[] = [];
			for (var i: string in list)
				returnArray.push((list[i] is Array) ? formatStringArray(list[i]) : list[i]);

			return returnArray;
		}

		public static  isObject(val: any): boolean
		{
			return typeof val == "object" && val != undefined;
		}

		public static  num2Text(number: number): string {
			if (number >= 0 && number <= 10) return NUMBER_WORDS_NORMAL[number];
			return number.toString();
		}
		
		public static  num2Text2(number: number): string {
			if (number < 0) return number.toString(); //Can't really have the -10th of something
			if (number <= 10) return NUMBER_WORDS_POSITIONAL[number];
			
			return number.toString() + "th";
		}
		
		public static  Num2Text(number: number): string {
			if (number >= 0 && number <= 10) return NUMBER_WORDS_CAPITAL[number];
			return number.toString();
		}
		
		public static  addComma(num: number): string{
		var  str: string = "";
			if (num <= 0) return "0";
			while (num>0){
			var  tmp:uint = num % 1000;
				str = ( num > 999 ?"," + (tmp < 100 ? ( tmp < 10 ? "00": "0"): ""): "") + tmp + str;
				num = num / 1000;
			}
			return str;
		}
		
		public static  capitalizeFirstLetter(string: string): string {
			return (string.substr(0, 1).toUpperCase() + string.substr(1));
		}
		
		/**
		 * Basically, you pass an arbitrary-length list of arguments, and it returns one of them at random. Accepts any type.
		 * Can also accept a *single* array of items, in which case it picks from the array instead.
		 * This lets you pre-construct the argument, to make things cleaner
		 * 
		 * @param	...args arguments to pick from
		 * @return a randomly selected argument
		 */
		public static  randomChoice(...args): any
		{
		var  tar: any[];
			
			if (args.length == 1 && args[0] is Array) tar = args[0];
			else if (args.length > 1) tar = args;
			else throw new Error("RandomInCollection could not determine usage pattern.");
			
			return tar[rand(tar.length)];
		}
		
		/**
		 * Utility function to search for a specific value within a target array or collection of values.
		 * Collection can be supplied either as an existing array or as varargs: any ex: 	InCollection(myValue, myArray)
		 * 		InCollection(myValue, myPossibleValue1, myPossibleValue2, myPossibleValue3)
		 * @param	tar			Target value to search for
		 * @param	... args	Collection to look in
		 * @return				Boolean true/false if found/not found.
		 */
		public static  InCollection(tar: any, ... args): boolean
		{
			if (args.length == 0) return false;
			
		var  collection: any;
			
			for (var ii: number = 0; ii < args.length; ii++)
			{
				collection = args[ii];
				
				if (!(collection is Array))
				{
					if (tar == collection) return true;
				}
				else
				{
					for (var i: number = 0; i < collection.length; i++)
					{
						if (tar == collection[i]) return true;
					}
				}
			}
			
			return false;
		}
		
		/**
		 * Generate a random number from 0 to max - 1 inclusive.
		 * @param	max the upper limit for the generated number
		 * @return a number from 0 to max - 1 inclusive
		 */
		public static  rand(max: number): number
		{
			return int(Math.random() * max);
		}
		public static  trueOnceInN(n: number): boolean
		{
			return Math.random()*n < 1;
		}

		public static  validateNonNegativeNumberFields(o: Record<string, any>, func: string, nnf: any[]): string
		{
		var  error: string = "";
		var  propExists: boolean;
		var  fieldRef: any;
			for each (var field: string in nnf) {
				try {
				var  value: any = Eval.eval(o, field);
					if (value === undefined || !(value is Number)) error += "Misspelling in "+func+".nnf: '"+field+"'. ";
					else if (value === undefined) error += "Null '"+field+"'. ";
					else if (value < 0) error += "Negative '"+field+"'. ";
				} catch (e:Error) {
					error += "Error calling eval on '"+func+"': "+e.message+". ";
				}
			}
			return error;
		}
		
		public static  validateNonEmptyStringFields(o: Record<string, any>, func: string, nef: any[]): string
		{
		var  error: string = "";
		var  propExists: boolean;
		var  fieldRef: any;
			for each (var field: string in nef) {
				try {
				var  value: any = Eval.eval(o, field);
					if (value === undefined || !(value is String)) error += "Misspelling in " + func + ".nef: '" + field + "'. ";
					else if (value == undefined) error += "Null '" + field + "'. ";
					else if (value == "") error += "Empty '" + field + "'. ";
				} catch (e:Error) {
					error += "Error calling eval on '"+func+"': "+e.message+". ";
				}
			}
			return error;
		}
		/**
		 * numberOfThings(0,"brain") = "no brains"
		 * numberOfThings(1,"head") = "one head"
		 * numberOfThings(2,"tail") = "2 tails"
		 * numberOfThings(3,"hoof","hooves") = "3 hooves"
		 */
		public static  numberOfThings(n: number, name: string, pluralForm: string = undefined): string
		{
			pluralForm = pluralForm || (name + "s");
			if (n == 0) return "no " + pluralForm;
			if (n == 1) return "one " + name;
			return n + " " + pluralForm;
		}
		public static  repeatString(s: string,n: number): string {
		var  rslt: string = "";
			while (n-->0) rslt += s;
			return rslt;
		}
		public static  trimLeft(s: string): string {
			return s.replace(/^\s+/g,'');
		}
		public static  trimRight(s: string): string {
			return s.replace(/\s+$/g,'');
		}
		public static  trimSides(s: string): string {
			return trimLeft(trimRight(s));
		}
	}

