﻿
	// import classes.CoC;
	
	export class Parser
	{
		private static  LOGGER:ILogger = LoggerFactory.getLogger(Parser);
		
		private  _ownerClass: any;			// main game class. Variables are looked-up in this class.
		private  _settingsClass: any;		// global static class used for shoving conf vars around

		public  sceneParserDebug: boolean = false;

		public  mainParserDebug: boolean = false;
		public  lookupParserDebug: boolean = false;
		public  conditionalDebug: boolean = false;
		public  printCcntentDebug: boolean = false;
		public  printConditionalEvalDebug: boolean = false;
		public  printIntermediateParseStateDebug: boolean = false;
		public  logErrors: boolean = true;


		public  Parser(ownerClass: any, settingsClass: any)
		{
			this._ownerClass = ownerClass;
			this._settingsClass = settingsClass;
		}

		/*
		Parser Syntax:

		// Querying simple PC stat nouns:
			[noun]

		Conditional statements:
		// Simple if statement:
			[if (condition) OUTPUT_IF_TRUE]
		// If-Else statement
			[if (condition) OUTPUT_IF_TRUE | OUTPUT_IF_FALSE]
			// Note - Implicit else indicated by presence of the "|"

		// Object aspect descriptions
			[object aspect]
			// gets the description of aspect "aspect" of object/NPC/PC "object"
			// Eventually, I want this to be able to use introspection to access class attributes directly
			// Maybe even manipulate them, though I haven't thought that out much at the moment.

		// Gender Pronoun Weirdness:
		// PRONOUNS: The parser uses Elverson/Spivak Pronouns specifically to allow characters to be written with non-specific genders.
		// http://en.wikipedia.org/wiki/Spivak_pronoun
		//
		// Cheat Table:
		//           | Subject    | Object       | Possessive Adjective | Possessive Pronoun | Reflexive         |
		// Agendered | ey laughs  | I hugged em  | eir heart warmed     | that is eirs       | ey loves emself   |
		// Masculine | he laughs  | I hugged him | his heart warmed     | that is his        | he loves himself  |
		// Feminine  | she laughs | I hugged her | her heart warmed     | that is hers       | she loves herself |



		[screen (SCREEN_NAME) | screen text]
			// creates a new screen/page.

		[button (SCREEN_NAME)| button_text]
			// Creates a button which jumps to SCREEN_NAME when clicked

		*/


		// this.parserState is used to store the scene-parser state.
		// it is cleared every time recursiveParser is called, and then any scene tags are added
		// as parserState["sceneName"] = "scene content"

		public  parserState: Record<string, any> = new Object();

		// provides singleArgConverters
		include "./singleArgLookups.as";

		// Does lookup of single argument tags ("[cock]", "[armor]", etc...) in singleArgConverters
		// Supported variables are the options listed in the above
		// singleArgConverters object. If the passed argument is found in the above object,
		// the corresponding anonymous function is called, and it's return-value is returned.
		// If the arg is not present in the singleArgConverters object, an error message is
		// returned.
		// ALWAYS returns a string
		private  convertSingleArg(arg: string): string
		{
		var  argResult: string = undefined;
		var  capitalize: boolean = isUpperCase(arg.charAt(0));

		var  argLower: string;
			argLower = arg.toLowerCase()
			if (argLower in singleArgConverters)
			{
				//if (logErrors) trace("WARNING: Found corresponding anonymous function");
				argResult = singleArgConverters[argLower]();

				if (lookupParserDebug) LOGGER.warn("WARNING: Called, return = ", argResult);

				if (capitalize)
					argResult = capitalizeFirstWord(argResult);

				return argResult;
			}
			else
			{

				// ---------------------------------------------------------------------------------
				// TODO: Get rid of this shit.
				// UGLY hack to patch legacy functionality in TiTS
				// This needs to go eventually

			var  descriptorArray: any[] = arg.split(".");

				obj = this.getObjectFromString(this._ownerClass, descriptorArray[0]);
				if (obj == undefined)		// Completely bad tag
				{
					if (lookupParserDebug || logErrors) LOGGER.warn("WARNING: Unknown subject in " + arg);
					return "<b>!Unknown subject in \"" + arg + "\"!</b>";
				}
				if (obj.hasOwnProperty("getDescription") && arg.indexOf(".") > 0)
				{
					return obj.getDescription(descriptorArray[1], "");
				}
				// end hack
				// ---------------------------------------------------------------------------------


				if (lookupParserDebug) LOGGER.warn("WARNING: Lookup Arg = ", arg);
			var  obj: any;
				obj = this.getObjectFromString(this._ownerClass, arg);
				if (obj != undefined)
				{
					if (obj is Function)
					{
						if (lookupParserDebug) LOGGER.warn("WARNING: Found corresponding function in owner class");
						return obj();
					}
					else
					{
						if (lookupParserDebug) LOGGER.warn("WARNING: Found corresponding aspect in owner class");
						return String(obj); 	// explicit cast probably not needed
					}
				}
				else
				{
					if (lookupParserDebug || logErrors) LOGGER.warn("WARNING: No lookup found for", arg, " search result is: ", obj);
					return "<b>!Unknown tag \"" + arg + "\"!</b>";
				}
			}

		}


		// provides twoWordNumericTagsLookup and twoWordTagsLookup, which use
		// cockLookups/cockHeadLookups, and rubiLookups/arianLookups respectively
		include "./doubleArgLookups.as";



		private  convertDoubleArg(inputArg: string): string
		{
		var  argResult: string = undefined;

		var  thing: any;

		var  argTemp: any[] = inputArg.split(" ");
			if (argTemp.length != 2)
			{
				if (logErrors) LOGGER.warn("WARNING: Not actually a two word tag! " + inputArg);
				return "<b>!Not actually a two-word tag!\"" + inputArg + "\"!</b>"
			}
		var  subject: string = argTemp[0];
		var  aspect: any = argTemp[1];
		var  subjectLower: string = argTemp[0].toLowerCase();
		var  aspectLower: any = argTemp[1].toLowerCase();

			if (lookupParserDebug) LOGGER.warn("WARNING: Doing lookup for subject", subject, " aspect ", aspect);

			// Figure out if we need to capitalize the resulting text
		var  capitalize: boolean = isUpperCase(aspect.charAt(0));


			// Only perform lookup in twoWordNumericTagsLookup if aspect can be cast to a valid number

			if ((subjectLower in twoWordNumericTagsLookup) && !isNaN(Number(aspect)))
			{
				aspectLower = Number(aspectLower);

				if (lookupParserDebug) LOGGER.warn("WARNING: Found corresponding anonymous function");
				argResult = twoWordNumericTagsLookup[subjectLower](aspectLower);
				if (capitalize)
					argResult = capitalizeFirstWord(argResult);
				if (lookupParserDebug) LOGGER.warn("WARNING: Called two word numeric lookup, return = ", argResult);
				return argResult;
			}

			// aspect isn't a number. Look for subject in the normal twoWordTagsLookup
			if (subjectLower in twoWordTagsLookup)
			{
				if (aspectLower in twoWordTagsLookup[subjectLower])
				{

					if (lookupParserDebug) LOGGER.warn("WARNING: Found corresponding anonymous function");
					argResult = twoWordTagsLookup[subjectLower][aspectLower]();
					if (capitalize)
						argResult = capitalizeFirstWord(argResult);
					if (lookupParserDebug) LOGGER.warn("WARNING: Called two word lookup, return = ", argResult);
					return argResult;
				}
				else
				{
					if (logErrors) LOGGER.warn("WARNING: Unknown aspect in two-word tag. Arg: " + inputArg + " Aspect: " + aspectLower);
					return "<b>!Unknown aspect in two-word tag \"" + inputArg + "\"! ASCII Aspect = \"" + aspectLower + "\"</b>";
				}

			}



			if (lookupParserDebug) LOGGER.warn("WARNING: trying to look-up two-word tag in parent")

			// ---------------------------------------------------------------------------------
			// TODO: Get rid of this shit.
			// UGLY hack to patch legacy functionality in TiTS
			// This needs to go eventually

		var  descriptorArray: any[] = subject.split(".");

			thing = this.getObjectFromString(this._ownerClass, descriptorArray[0]);
			if (thing == undefined)		// Completely bad tag
			{
				if (logErrors) LOGGER.warn("WARNING: Unknown subject in " + inputArg);
				return "<b>!Unknown subject in \"" + inputArg + "\"!</b>";
			}
			if (thing.hasOwnProperty("getDescription") && subject.indexOf(".") > 0)
			{
				if (argTemp.length > 1) {
					return thing.getDescription(descriptorArray[1], aspect);
				}
				else {
					return thing.getDescription(descriptorArray[1], "");
				}
			}
			// end hack
			// ---------------------------------------------------------------------------------

		var  aspectLookup: any = this.getObjectFromString(this._ownerClass, aspect);

			if (thing != undefined)
			{
				if (thing is Function)
				{
					if (lookupParserDebug) LOGGER.warn("WARNING: Found corresponding function in owner class");
					return thing(aspect);
				}
				else if (thing is Array)
				{
				var  indice: number = Number(aspectLower);
					if (isNaN(indice))
					{
						if (logErrors) LOGGER.warn("WARNING: Cannot use non-number as indice to Array. Arg " + inputArg + " Subject: " + subject + " Aspect: " + aspect); 
						return "<b>Cannot use non-number as indice to Array \"" + inputArg + "\"! Subject = \"" + subject + ", Aspect = " + aspect + "\</b>";
					}
					else
						return thing[indice]
				}
				else if (thing is Object)
				{

					if (thing.hasOwnProperty(aspectLookup))
						return thing[aspectLookup]

					else if (thing.hasOwnProperty(aspect))
						return thing[aspect]
					else
					{
						if (logErrors) LOGGER.warn("WARNING: Record<string, any> does not have aspect as a member. Arg: " + inputArg + " Subject: " + subject + " Aspect:" + aspect + " or " + aspectLookup);
						return "<b>Object does not have aspect as a member \"" + inputArg + "\"! Subject = \"" + subject + ", Aspect = " + aspect + " or " + aspectLookup + "\</b>";
					}
				}
				else
				{
					// This will work, but I don't know why you'd want to
					// the aspect is just ignored
					if (lookupParserDebug) LOGGER.warn("WARNING: Found corresponding aspect in owner class");
					return String(thing);
				}
			}




			if (lookupParserDebug || logErrors) LOGGER.warn("WARNING: No lookup found for", inputArg, " search result is: ", thing);
			return "<b>!Unknown subject in two-word tag \"" + inputArg + "\"! Subject = \"" + subject + ", Aspect = " + aspect + "\</b>";
			// return "<b>!Unknown tag \"" + arg + "\"!</b>";

			return argResult;
		}





		// Provides the conditionalOptions object
		include "./conditionalConverters.as";

		// converts a single argument to a conditional to
		// the relevant value, either by simply converting to a Number, or
		// through lookup in the above conditionalOptions oject, and then calling the
		// relevant function
		// Realistally, should only return either boolean or numbers.
		private  convertConditionalArgumentFromStr(arg: string): any
		{
			// convert the string contents of a conditional argument into a meaningful variable.
		var  argLower: any = arg.toLowerCase()
		var  argResult: any = -1;

			// Note: Case options MUST be ENTIRELY lower case. The comparaison string is converted to
			// lower case before the switch:case section

			// Try to cast to a number. If it fails, go on with the switch/case statement.
			if (!isNaN(Number(arg)))
			{
				if (printConditionalEvalDebug) LOGGER.warn("WARNING: Converted to float. Number = ", Number(arg))
				return Number(arg);
			}
			if (argLower in conditionalOptions)
			{
				if (printConditionalEvalDebug) LOGGER.warn("WARNING: Found corresponding anonymous function");
				argResult = conditionalOptions[argLower]();
				if (printConditionalEvalDebug) LOGGER.warn("WARNING: Called, return = ", argResult);
				return argResult;
			}


		var  obj: any = this.getObjectFromString(this._ownerClass, arg);

			if (printConditionalEvalDebug) LOGGER.warn("WARNING: Looked up ", arg, " in ", this._ownerClass, "Result was:", obj);
			if (obj != undefined)
			{
				if (printConditionalEvalDebug) LOGGER.warn("WARNING: Found corresponding function for conditional argument lookup.");

				if (obj is Function)
				{
					if (printConditionalEvalDebug) LOGGER.warn("WARNING: Found corresponding function in owner class");
					argResult = Number(obj());
					return argResult;
				}
				else
				{
					if (printConditionalEvalDebug) LOGGER.warn("WARNING: Found corresponding aspect in owner class");
					argResult = Number(obj);
					return argResult;
				}
			}
			else
			{
				if (printConditionalEvalDebug || logErrors) LOGGER.warn("WARNING: No lookups found!");
				return undefined
			}


			if (printConditionalEvalDebug || LogErrors) LOGGER.warn("WARNING: Could not convert to number. Evaluated ", arg, " as", argResult)
			return argResult;
		}


		// Evaluates the conditional section of an if-statement.
		// Does the proper parsing and look-up of any of the special nouns
		// which can be present in the conditional
		private  evalConditionalStatementStr(textCond: string): boolean
		{
			// Evaluates a conditional statement:
			// (varArg1 [conditional] varArg2)
			// varArg1 & varArg2 can be either numbers, or any of the
			// strings in the "conditionalOptions" object above.
			// numbers (which are in string format) are converted to a Number type
			// prior to comparison.

			// supports multiple comparison operators:
			// "=", "=="  - Both are Equals or equivalent-to operators
			// "<", ">    - Less-Than and Greater-Than
			// "<=", ">=" - Less-than or equal, greater-than or equal
			// "!="       - Not equal

			// proper, nested parsing of statements is a WIP
			// and not supported at this time.


		var  isExp:RegExp = /([\w\.]+)\s?(==|=|!=|<|>|<=|>=)\s?([\w\.]+)/;
		var  expressionResult: Record<string, any> = isExp.exec(textCond);
			if (!expressionResult)
			{
			var  condArg: any = convertConditionalArgumentFromStr(textCond);
				if (condArg != undefined)
				{
					if (printConditionalEvalDebug) LOGGER.warn("WARNING: Conditional \"", textCond, "\" Evaluated to: \"", condArg, "\"")
					return condArg
				}
				else
				{
					if (logErrors) LOGGER.warn("WARNING: Invalid conditional! \"(", textCond, ")\" Conditionals must be in format:")
					if (logErrors) LOGGER.warn("WARNING:  \"({statment1} (==|=|!=|<|>|<=|>=) {statement2})\" or \"({valid variable/function name})\". ")
					return false
				}
			}
			if (printConditionalEvalDebug) LOGGER.warn("WARNING: Expression = ", textCond, "Expression result = [", expressionResult, "], length of = ", expressionResult.length);

		var  condArgStr1: string    = expressionResult[1];
		var  operator: string       = expressionResult[2];
		var  condArgStr2: string    = expressionResult[3];

		var  retVal: boolean = false;

		var  condArg1: any = convertConditionalArgumentFromStr(condArgStr1);
		var  condArg2: any = convertConditionalArgumentFromStr(condArgStr2);

			//Perform check
			if (operator == "=")
				retVal = (condArg1 == condArg2);
			else if (operator == ">")
				retVal = (condArg1 > condArg2);
			else if (operator == "==")
				retVal = (condArg1 == condArg2);
			else if (operator == "<")
				retVal = (condArg1 < condArg2);
			else if (operator == ">=")
				retVal = (condArg1 >= condArg2);
			else if (operator == "<=")
				retVal = (condArg1 <= condArg2);
			else if (operator == "!=")
				retVal = (condArg1 != condArg2);
			else
				retVal = (condArg1 != condArg2);


			if (printConditionalEvalDebug) LOGGER.warn("WARNING: Check: " + condArg1 + " " + operator + " " + condArg2 + " result: " + retVal);

			return retVal;
		}

		// Splits the result from an if-statement.
		// ALWAYS returns an array with two strings.
		// if there is no else, the second string is empty.
		private  splitConditionalResult(textCtnt: string): any[]
		{
			// Splits the conditional section of an if-statemnt in to two results:
			// [if (condition) OUTPUT_IF_TRUE]
			//                 ^ This Bit   ^
			// [if (condition) OUTPUT_IF_TRUE | OUTPUT_IF_FALSE]
			//                 ^          This Bit            ^
			// If there is no OUTPUT_IF_FALSE, returns an empty string for the second option.
			if (conditionalDebug) LOGGER.warn("WARNING: ------------------4444444444444444444444444444444444444444444444444444444444-----------------------")
			if (conditionalDebug) LOGGER.warn("WARNING: Split Conditional input string: ", textCtnt)
			if (conditionalDebug) LOGGER.warn("WARNING: ------------------4444444444444444444444444444444444444444444444444444444444-----------------------")


		var  ret: any[] = new Array("", "");


		var  i: number;

		var  sectionStart: number = 0;
		var  section: number = 0;
		var  nestLevel: number = 0;

			for (i = 0; i < textCtnt.length; i += 1)
			{
				switch (textCtnt.charAt(i))
				{
					case "[":    //Statement is nested one level deeper
						nestLevel += 1;
						break;

					case "]":    //exited one level of nesting.
						nestLevel -= 1;
						break;

					case "|":                  // At a conditional split
						if (nestLevel == 0)   // conditional split is only valid in this context if we're not in a nested bracket.
						{
							if (section == 1)  // barf if we hit a second "|" that's not in brackets
							{
								if (this._settingsClass.haltOnErrors) throw new Error("Nested IF statements still a WIP")
								ret = ["<b>Error! Too many options in if statement!</b>",
									"<b>Error! Too many options in if statement!</b>"];
							}
							else
							{
								ret[section] = textCtnt.substring(sectionStart, i);
								sectionStart = i + 1
								section += 1
							}
						}
						break;

					default:
						break;
				}

			}
			ret[section] = textCtnt.substring(sectionStart, textCtnt.length);


			if (conditionalDebug) LOGGER.warn("WARNING: ------------------5555555555555555555555555555555555555555555555555555555555-----------------------")
			if (conditionalDebug) LOGGER.warn("WARNING: Outputs: ", ret)
			if (conditionalDebug) LOGGER.warn("WARNING: ------------------5555555555555555555555555555555555555555555555555555555555-----------------------")

			return ret;
		}



		// Called to evaluate a if statment string, and return the evaluated result.
		// Returns an empty string ("") if the conditional rvaluates to false, and there is no else
		// option.
		private  parseConditional(textCtnt: string, depth: number): string
		{
			// NOTE: enclosing brackets are *not* included in the actual textCtnt string passed into this function
			// they're shown in the below examples simply for clarity's sake.
			// And because that's what the if-statements look like in the raw string passed into the parser
			// The brackets are actually removed earlier on by the recParser() step.

			// parseConditional():
			// Takes the contents of an if statement:
			// [if (condition) OUTPUT_IF_TRUE]
			// [if (condition) OUTPUT_IF_TRUE | OUTPUT_IF_FALSE]
			// splits the contents into an array as such:
			// ["condition", "OUTPUT_IF_TRUE"]
			// ["condition", "OUTPUT_IF_TRUE | OUTPUT_IF_FALSE"]
			// Finally, evalConditionalStatementStr() is called on the "condition", the result
			// of which is used to determine which content-section is returned
			//


			// TODO: (NOT YET) Allows nested condition parenthesis, because I'm masochistic


			// POSSIBLE BUG: A actual statement starting with "if" could be misinterpreted as an if-statement
			// It's unlikely, but I *could* see it happening.
			// I need to do some testing
			// ~~~~Fake-Name


			if (conditionalDebug) LOGGER.warn("WARNING: ------------------2222222222222222222222222222222222222222222222222222222222-----------------------")
			if (conditionalDebug) LOGGER.warn("WARNING: If input string: ", textCtnt)
			if (conditionalDebug) LOGGER.warn("WARNING: ------------------2222222222222222222222222222222222222222222222222222222222-----------------------")


		var  ret: any[] = new Array("", "", "");	// first string is conditional, second string is the output

		var  i: number = 0;
		var  parenthesisCount: number = 0;

			//var ifText;
		var  conditional: any;
		var  output: any;

		var  condStart: number = textCtnt.indexOf("(");

			if (condStart != -1)		// If we have any open parenthesis
			{
				for (i = condStart; i < textCtnt.length; i += 1)
				{
					if (textCtnt.charAt(i) == "(")
					{
						parenthesisCount += 1;
					}
					else if (textCtnt.charAt(i) == ")")
					{
						parenthesisCount -= 1;
					}
					if (parenthesisCount == 0)	// We've found the matching closing bracket for the opening bracket at textCtnt[condStart]
					{
						// Pull out the conditional, and then evaluate it.
						conditional = textCtnt.substring(condStart+1, i);
						conditional = evalConditionalStatementStr(conditional);

						// Make sure the contents of the if-statement have been evaluated to a plain-text string before trying to
						// split the base-level if-statement on the "|"
						output = textCtnt.substring(i+1, textCtnt.length)

						// And now do the actual splitting.
						output = splitConditionalResult(output);

						// LOTS of debugging
						if (conditionalDebug) LOGGER.warn("WARNING: prefix = '", ret[0], "' conditional = ", conditional, " content = ", output);
						if (conditionalDebug) LOGGER.warn("WARNING: -0--------------------------------------------------");
						if (conditionalDebug) LOGGER.warn("WARNING: Content Item 1 = ", output[0])
						if (conditionalDebug) LOGGER.warn("WARNING: -1--------------------------------------------------");
						if (conditionalDebug) LOGGER.warn("WARNING: Item 2 = ", output[1]);
						if (conditionalDebug) LOGGER.warn("WARNING: -2--------------------------------------------------");

						if (conditional)
							return recParser(output[0], depth);
						else
							return recParser(output[1], depth);

					}
				}
			}
			else
			{
				if (this._settingsClass.haltOnErrors) throw new Error("Invalid if statement!", textCtnt);
				return "<b>Invalid IF Statement</b>" + textCtnt;
			}
			return "";
		}


		// ---------------------------------------------------------------------------------------------------------------------------------------
		// SCENE PARSING ---------------------------------------------------------------------------------------------------------------
		// ---------------------------------------------------------------------------------------------------------------------------------------


		// attempt to return function "inStr" that is a member of "localThis"
		// Properly handles nested classes/objects, e.g. localThis.herp.derp
		// is returned by getFuncFromString(localThis, "herp.derp");
		// returns the relevant function if it exists, undefined if it does not.
		private  getObjectFromString(localThis: Record<string, any>, inStr: string): any
		{
			if (inStr in localThis)
			{
				if (lookupParserDebug) LOGGER.warn("WARNING: item: ", inStr, " in: ", localThis);
				return localThis[inStr];
			}

			if (inStr.indexOf('.') > 0) // *should* be > -1, but if the string starts with a dot, it can't be a valid reference to a nested class anyways.
			{
			var  localReference: string;
			var  itemName: string;
				localReference = inStr.substr(0, inStr.indexOf('.'));
				itemName = inStr.substr(inStr.indexOf('.')+1);

				// Debugging, what debugging?
				if (lookupParserDebug) LOGGER.warn("WARNING: localReference = ", localReference);
				if (lookupParserDebug) LOGGER.warn("WARNING: itemName = ", itemName);
				if (lookupParserDebug) LOGGER.warn("WARNING: localThis = \"", localThis, "\"");
				if (lookupParserDebug) LOGGER.warn("WARNING: dereferenced = ", localThis[localReference]);

				// If we have the localReference as a member of the localThis, call this function again to further for
				// the item itemName in localThis[localReference]
				// This allows arbitrarily-nested data-structures, by recursing over the . structure in inStr
				if (localReference in localThis)
				{
					if (lookupParserDebug) LOGGER.warn("WARNING: have localReference:", localThis[localReference]);
					return getObjectFromString(localThis[localReference], itemName);
				}
				else
				{
					return undefined;
				}

			}

			if (lookupParserDebug) LOGGER.warn("WARNING: item: ", inStr, " NOT in: ", localThis);

			return undefined;

		}



		private  getSceneSectionToInsert(inputArg: string): string
		{
		var  argResult: string = undefined;


		var  argTemp: any[] = inputArg.split(" ");
			if (argTemp.length != 2)
			{
				return "<b>!Not actually a valid insertSection tag:!\"" + inputArg + "\"!</b>";
			}
		var  callName: string = argTemp[0];
		var  sceneName: any = argTemp[1];
		var  callNameLower: string = argTemp[0].toLowerCase();

			if (sceneParserDebug) LOGGER.warn("WARNING: Doing lookup for sceneSection tag:", callName, " scene name: ", sceneName);

			// this should have been checked before calling.
			if (callNameLower != "insertsection")
				throw new Error("Wat?");



			if (sceneName in this.parserState)
			{
				if (sceneParserDebug) LOGGER.warn("WARNING: Have sceneSection \""+sceneName+"\". Parsing and setting up menu");

				buttonNum = 0;		// Clear the button number, so we start adding buttons from button 0

				// Split up into multiple variables for debugging (it was crashing at one point. Separating the calls let me delineate what was crashing)
			var  tmp1: string = this.parserState[sceneName];
			var  tmp2: string = recParser(tmp1, 0);			// we have to actually parse the scene now
				//var tmp3: string = Showdown.makeHtml(tmp2)


				return ""; //Fuck Showdown
				//return tmp3;			// and then stick it on the display

				//if (sceneParserDebug) trace("WARNING: Scene contents: \"" + tmp1 + "\" as parsed: \"" + tmp2 + "\"")
			}
			else
			{
				return "Insert sceneSection called with unknown arg \""+sceneName+"\". falling back to the debug pane";

			}
		}





		private  buttonNum: number;


		// TODO: Make failed scene button lookups fail in a debuggable manner!

		// Parser button event handler
		// This is the event bound to all button events, as well as the function called
		// to enter the parser's cached scenes. If you pass recursiveParser a set of scenes including a scene named
		// "startup", the parser will not exit normally, and will instead enter the "startup" scene at the completion of parsing the
		// input string.
		//
		// the passed seneName string is preferentially looked-up in the cached scene array, and if there is not a cached scene of name sceneName
		// in the cache, it is then looked for as a member of _ownerClass.
		// if the function name is not found in either context, an error *should* be thrown, but at the moment,
		// it just returns to the debugPane
		//
		public  enterParserScene(sceneName: string): string
		{
		var  ret: string = "";

			if (sceneParserDebug) LOGGER.warn("WARNING: Entering parser scene: \""+sceneName+"\"");
			if (sceneParserDebug) LOGGER.warn("WARNING: Do we have the scene name? ", sceneName in this.parserState)
			if (sceneName == "exit")
			{
				if (sceneParserDebug) LOGGER.warn("WARNING: Enter scene called to exit");
				// TODO:
				// This needs to change to something else anyways. I need to add the ability to
				// tell the parser where to exit to at some point
				_ownerClass.debugPane();
			}
			else if (sceneName in this.parserState)
			{
				if (sceneParserDebug) LOGGER.warn("WARNING: Have scene \""+sceneName+"\". Parsing and setting up menu");
				_ownerClass.menu();

				buttonNum = 0;		// Clear the button number, so we start adding buttons from button 0

			var  tmp1: string = this.parserState[sceneName];
			var  tmp2: string = recParser(tmp1, 0);		// we have to actually parse the scene now
				
				if (sceneParserDebug) LOGGER.warn("WARNING: Scene contents after markdown: \"" + ret + "\"");
				
				ret = tmp2;
			}
			else if (this.getObjectFromString(_ownerClass, sceneName) != undefined)
			{
				if (sceneParserDebug) LOGGER.warn("WARNING: Have function \""+sceneName+"\" in this!. Calling.");
				this.getObjectFromString(_ownerClass, sceneName)();
			}
			else
			{
				LOGGER.warn("WARNING: Enter scene called with unknown arg/function \""+sceneName+"\". falling back to the debug pane");
				_ownerClass.doNext(_ownerClass.debugPane);
			}
			return ret
		}

		// Parses the contents of a scene tag, shoves the unprocessed text in the scene object (this.parserState)
		// under the proper name.
		// Scenes tagged as such:
		//
		// [sceneName | scene contents blaugh]
		//
		// This gets placed in this.parserState so this.parserState["sceneName"] == "scene contents blaugh"
		//
		// Note that parsing of the actual scene contents is deferred untill it's actually called for display.
		private  parseSceneTag(textCtnt: string): void
		{
		var  sceneName: string;
		var  sceneCont: string;

			sceneName = textCtnt.substring(textCtnt.indexOf(' ') ,textCtnt.indexOf('|'));
			sceneCont = textCtnt.substr(textCtnt.indexOf('|')+1);

			sceneName = stripStr(sceneName);
			if (sceneParserDebug) LOGGER.warn("WARNING: Adding scene with name \"" + sceneName + "\"")

			// Cleanup the scene content from spurious leading and trailing space.
			sceneCont = trimStr(sceneCont, "\n");
			sceneCont = trimStr(sceneCont, "	");


			this.parserState[sceneName] = stripStr(sceneCont);

		}

		// Evaluates the contents of a button tag, and instantiates the relevant button
		// Current syntax:
		//
		// [button function_name | Button Name]
		// where "button" is a constant string, "function_name" is the name of the function pressing the button will call,
		// and "Button Name" is the text that will be shown on the button.
		// Note that the function name cannot contain spaces (actionscript requires this), and is case-sensitive
		// "Button name" can contain arbitrary spaces or characters, excepting "]", "[" and "|"
		private  parseButtonTag(textCtnt: string): void
		{
			// TODO: Allow button positioning!

		var  arr: any[] = textCtnt.split("|")
			if (arr.len > 2)
			{
				if (this._settingsClass.haltOnErrors) throw new Error("");
				throw new Error("Too many items in button")
			}

		var  buttonName: string = stripStr(arr[1]);
		var  buttonFunc: string = stripStr(arr[0].substring(arr[0].indexOf(' ')));
			//trace("WARNING: adding a button with name\"" + buttonName + "\" and function \"" + buttonFunc + "\"");
			_ownerClass.addButton(buttonNum, buttonName, this.enterParserScene, buttonFunc);
			buttonNum += 1;
		}

		// pushes the contents of the passed string into the scene list object if it's a scene, or instantiates the named button if it's a button
		// command and returns an empty string.
		// if the contents are not a button or scene contents, returns the contents.
		private  evalForSceneControls(textCtnt: string): string
		{


			if (sceneParserDebug) LOGGER.warn("WARNING: Checking for scene tags.");
			if (textCtnt.toLowerCase().indexOf("screen") == 0)
			{
				if (sceneParserDebug) LOGGER.warn("WARNING: It's a scene");
				parseSceneTag(textCtnt);
				return "";
			}
			else if (textCtnt.toLowerCase().indexOf("button") == 0)
			{
				if (sceneParserDebug) LOGGER.warn("WARNING: It's a button add statement");
				parseButtonTag(textCtnt);
				return "";
			}
			return textCtnt;
		}


		private  isIfStatement(textCtnt: string): boolean
		{
			return textCtnt.toLowerCase().indexOf("if") == 0;
		}

		private  isSpeechStatement(textCtnt: string): boolean
		{
			return textCtnt.toLowerCase().indexOf("say: ") == 0;
		}

		private  parseSpeech(textCtnt: string): string{
			return "\u201c<i>" + textCtnt.substring(5,textCtnt.length + 1) + "</i>\u201d";
		}
		
		// Called to determine if the contents of a bracket are a parseable statement or not
		// If the contents *are* a parseable, it calls the relevant function to evaluate it
		// if not, it simply returns the contents as passed
		private  parseNonIfStatement(textCtnt: string, depth: number): string
		{

		var  retStr: string = "";
			if (printCcntentDebug) LOGGER.warn("WARNING: Parsing content string: ", textCtnt);


			if (mainParserDebug) LOGGER.warn("WARNING: Not an if statement")
				// Match a single word, with no leading or trailing space
		var  singleWordTagRegExp:RegExp = /^[\w\.]+$/;
		var  doubleWordTagRegExp:RegExp = /^[\w\.]+\s[\w\.]+$/;

			if (mainParserDebug) LOGGER.warn("WARNING: string length = ", textCtnt.length);

			if (textCtnt.toLowerCase().indexOf("insertsection") == 0)
			{
				if (sceneParserDebug) LOGGER.warn("WARNING: It's a scene section insert tag!");
				retStr = this.getSceneSectionToInsert(textCtnt)
			}
			else if (singleWordTagRegExp.exec(textCtnt))
			{
				if (mainParserDebug) LOGGER.warn("WARNING: It's a single word!");
				retStr += convertSingleArg(textCtnt);
			}
			else if (doubleWordTagRegExp.exec(textCtnt))
			{
				if (mainParserDebug) LOGGER.warn("WARNING: Two-word tag!")
				retStr += convertDoubleArg(textCtnt);
			}
			else
			{
				if (mainParserDebug) LOGGER.warn("WARNING: Cannot parse content. What?", textCtnt)
				retStr += "<b>!Unknown multi-word tag \"" + retStr + "\"!</b>";
			}

			return retStr;
		}



		// Actual internal parser function.
		// textCtnt is the text you want parsed, depth is a number that reflects the current recursion depth
		// You pass in the string you want parsed, and the parsed result is returned as a string.
		private  recParser(textCtnt: string, depth: number): string
		{
			if (mainParserDebug) LOGGER.warn("WARNING: Recursion call", depth, "---------------------------------------------+++++++++++++++++++++")
			if (printIntermediateParseStateDebug) LOGGER.warn("WARNING: Parsing contents = ", textCtnt)
			// Depth tracks our recursion depth
			// Basically, we need to handle things differently on the first execution, so we don't mistake single-word print-statements for
			// a tag. Therefore, every call of recParser increments depth by 1

			depth += 1;
			textCtnt = String(textCtnt);
			if (textCtnt.length == 0)	// Short circuit if we've been passed an empty string
				return "";

		var  i: number = 0;

		var  bracketCnt: number = 0;

		var  lastBracket: number = -1;

		var  retStr: string = "";

			do
			{
				lastBracket = textCtnt.indexOf("[", lastBracket+1);
				if (textCtnt.charAt(lastBracket-1) == "\\")
				{
					// LOGGER.warn("WARNING: bracket is escaped 1", lastBracket);
				}
				else if (lastBracket != -1)
				{
					// LOGGER.warn("WARNING: need to parse bracket", lastBracket);
					break;
				}

			} while (lastBracket != -1)


			if (lastBracket != -1)		// If we have any open brackets
			{
				for (i = lastBracket; i < textCtnt.length; i += 1)
				{
					if (textCtnt.charAt(i) == "[")
					{
						if (textCtnt.charAt(i-1) != "\\")
						{
							//LOGGER.warn("WARNING: bracket is not escaped - 2");
							bracketCnt += 1;
						}
					}
					else if (textCtnt.charAt(i) == "]")
					{
						if (textCtnt.charAt(i-1) != "\\")
						{
							//LOGGER.warn("WARNING: bracket is not escaped - 3");
							bracketCnt -= 1;
						}
					}
					if (bracketCnt == 0)	// We've found the matching closing bracket for the opening bracket at textCtnt[lastBracket]
					{
					var  prefixTmp: string, postfixTmp: string;

						// Only prepend the prefix if it actually has content.
						prefixTmp = textCtnt.substring(0, lastBracket);
						if (mainParserDebug) LOGGER.warn("WARNING: prefix content = ", prefixTmp);
						if (prefixTmp)
							retStr += prefixTmp
						// We know there aren't any brackets in the section before the first opening bracket.
						// therefore, we just add it to the returned string


					var  tmpStr: string = textCtnt.substring(lastBracket+1, i);
						tmpStr = evalForSceneControls(tmpStr);
						// evalForSceneControls swallows scene controls, so they won't get parsed further now.
						// therefore, you could *theoretically* have nested scene pages, though I don't know WHY you'd ever want that.

						if (isIfStatement(tmpStr))
						{
							if (conditionalDebug) LOGGER.warn("WARNING: early eval as if")
							retStr += parseConditional(tmpStr, depth)
							if (conditionalDebug) LOGGER.warn("WARNING: ------------------0000000000000000000000000000000000000000000000000000000000000000-----------------------")
							//LOGGER.warn("WARNING: Parsed Ccnditional - ", retStr)
						}
						else if (isSpeechStatement(tmpStr))
						{
							retStr += parseSpeech(recParser(tmpStr,depth));
						}
						else if (tmpStr)
						{

							if (printCcntentDebug) LOGGER.warn("WARNING: Parsing bracket contents = ", tmpStr);
							retStr += parseNonIfStatement(recParser(tmpStr, depth), depth);

						}

						// First parse into the text in the brackets (to resolve any nested brackets)
						// then, eval their contents, in case they're an if-statement or other control-flow thing
						// I haven't implemented yet

						// Only parse the trailing string if it has brackets in it.
						// if not, we need to just return the string as-is.
						// Parsing the trailing string if it doesn't have brackets could lead to it being
						// incorrectly interpreted as a multi-word tag (and shit would asplode and shit)

						postfixTmp = textCtnt.substring(i+1, textCtnt.length);
						if (postfixTmp.indexOf("[") != -1)
						{
							if (printCcntentDebug) LOGGER.warn("WARNING: Need to parse trailing text", postfixTmp)
							retStr += recParser(postfixTmp, depth);	// Parse the trailing text (if any)
							// Note: This leads to LOTS of recursion. Since we basically call recParser once per
							// tag, it means that if a body of text has 30 tags, we'll end up recursing at least
							// 29 times before finishing.
							// Making this tail-call reursive, or just parsing it flatly may be a much better option in
							// the future, if this does become an issue.
						}
						else
						{
							if (printCcntentDebug) LOGGER.warn("WARNING: No brackets in trailing text", postfixTmp)
							retStr += postfixTmp;
						}

						return retStr;
						// and return the parsed string
					}
				}
			}
			else
			{
				// DERP. We should never have brackets around something that ISN'T a tag intended to be parsed. Therefore, we just need
				// to determine what type of parsing should be done do the tag.
				if (printCcntentDebug) LOGGER.warn("WARNING: No brackets present in text passed to recParse", textCtnt);


				retStr += textCtnt;

			}

			return retStr;
		}


		// Main parser function.
		// textCtnt is the text you want parsed, depth is a number, which should be 0
		// or not passed at all.
		// You pass in the string you want parsed, and the parsed result is returned as a string.
		public  recursiveParser(contents: string): string
		{
			if (mainParserDebug) LOGGER.warn("WARNING: ------------------ Parser called on string -----------------------");
			// Eventually, when this goes properly class-based, we'll add a period, and have this.parserState.

			// Reset the parser's internal state, since we're parsing a new string:
			this.parserState = new Object();

		var  ret: string = "";
			// Run through the parser
			contents = contents.replace(/\r\n?|\\n/g, "\n")
			ret = recParser(contents, 0);
			if (printIntermediateParseStateDebug) LOGGER.warn("WARNING: Parser intermediate contents = ", ret)
			// Currently, not parsing text as markdown by default because it's fucking with the line-endings.

			// Convert quotes to prettyQuotes
			ret = this.makeQuotesPrettah(ret);

			// cleanup escaped brackets
			ret = ret.replace(/\\\]/g, "]")
			ret = ret.replace(/\\\[/g, "[")

			// And repeated spaces (this has to be done after markdown processing)
			ret = ret.replace(/  +/g, " ");

			// Finally, if we have a parser-based scene. enter the "startup" scene.
			if ("startup" in this.parserState)
			{
				ret = enterParserScene("startup");

				// HORRIBLE HACK
				// since we're initially called via a outputText command, the content of the first page's text will be overwritten
				// when we return. Therefore, in a horrible hack, we return the contents of mainTest.htmlText as the ret value, so
				// the outputText call overwrites the window content with the exact same content.

				LOGGER.warn("Returning: {0}", ret);
			}

			return ret
		}

		// ---------------------------------------------------------------------------------------------------------------------------------------
		// ---------------------------------------------------------------------------------------------------------------------------------------
		// ---------------------------------------------------------------------------------------------------------------------------------------

		// Make shit look nice

		private  makeQuotesPrettah(inStr: string): string
		{

			inStr = inStr.replace(/(\w)'(\w)/g,										"$1\u2019$2")	// Apostrophes
			             .replace(/(^|[\r\n 	\.\!\,\?])"([a-zA-Z<>\.\!\,\?])/g,	"$1\u201c$2")	// Opening doubles
			             .replace(/([a-zA-Z<>\.\!\,\?])"([\r\n 	\.\!\,\?]|$)/g,		"$1\u201d$2")	// Closing doubles
			             .replace(/--/g,  											"\u2014");		// em-dashes
			return inStr;
		}


		// ---------------------------------------------------------------------------------------------------------------------------------------
		// ---------------------------------------------------------------------------------------------------------------------------------------
		// ---------------------------------------------------------------------------------------------------------------------------------------

		// Stupid string utility functions, because actionscript doesn't have them (WTF?)

		public  stripStr(str: string): string
		{
			return trimStrBack(trimStrFront(str, " "), " ");
			return trimStrBack(trimStrFront(str, "	"), "	");
		}

		public  trimStr(str: string, char: string = " "): string
		{
			return trimStrBack(trimStrFront(str, char), char);
		}

		public  trimStrFront(str: string, char: string = " "): string
		{
			char = stringToCharacter(char);
			if (str.charAt(0) == char) {
				str = trimStrFront(str.substring(1), char);
			}
			return str;
		}

		public  trimStrBack(str: string, char: string = " "): string
		{
			char = stringToCharacter(char);
			if (str.charAt(str.length - 1) == char) {
				str = trimStrBack(str.substring(0, str.length - 1), char);
			}
			return str;
		}
		public  stringToCharacter(str: string): string
		{
			if (str.length == 1)
			{
				return str;
			}
			return str.slice(0, 1);
		}


		public  isUpperCase(char: string): boolean
		{
			if (!isNaN(Number(char)))
			{
				return false;
			}
			else if (char == char.toUpperCase())
			{
				return true;
			}
			return false;
		}

		public  capitalizeFirstWord(str: string): string
		{

			str = str.charAt(0).toUpperCase()+str.slice(1);
			return str;
		}

	}

