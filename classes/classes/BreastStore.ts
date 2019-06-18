	
	export class BreastStore extends Utils implements SaveAwareInterface
	{
		private static  MAX_FLAG_VALUE: number				= 2999;
		private static  BREAST_STORE_VERSION_1: string	= "1";
		private static  LACTATION_BOOST: any[]          = [0, 0, 2, 3, 6, 9, 17]; //Disabled, None, Light, Moderate, Strong, Heavy, Epic

		public static  LACTATION_DISABLED: number			= 0;
		public static  LACTATION_NONE: number				= 1; //Full == (>= 50), Overfull == (>= 60 + 5 * _lactationLevel), Overload == (>= 60 + 20 * _lactationLevel)
		public static  LACTATION_LIGHT: number				= 2; //Full after 25 hours, overfull after 35 hours, overloaded after 50 hours
		public static  LACTATION_MODERATE: number			= 3; //Full after 17 hours, overfull after 25 hours, overloaded after 40 hours
		public static  LACTATION_STRONG: number			= 4; //Full after  9 hours, overfull after 15 hours, overloaded after 30 hours
		public static  LACTATION_HEAVY: number				= 5; //Full after  6 hours, overfull after 12 hours, overloaded after 27 hours
		public static  LACTATION_EPIC: number				= 6; //Full after  3 hours, overfull after  9 hours, overloaded after 24 hours

		private  _breastFlag: number;
		private  _cupSize: number							= 0;
		private  _fullness: number							= 0; //How much milk the breasts currently hold - use milkQuantity to decide how much milk is produced in a scene
																	//The milkIsFull and milkIsOverflowing functions let you know how much the NPC wants to be milked
		private  _lactation: number							= 0; //How fast the breasts refill with milk
		private  _nippleLength: number					= 0;
		private  _timesMilked: number						= 0; //How many times has this NPC been milked - only used internally
		private  _rows: number								= 0; //Number of rows of breasts. All assumed to be the same size

		public  preventLactationIncrease: number				= 0; //Control the points at which the lactation stops increasing or decreasing
		public  preventLactationDecrease: number				= 0;

		public  BreastStore(breastFlag: number) {
			_breastFlag = breastFlag;
			if (_breastFlag < 1 || _breastFlag > MAX_FLAG_VALUE) CoC_Settings.error("Error: BreastStore created with invalid flag value. BreastStore(" + breastFlag + ")");
		}

		//Implementation of SaveAwareInterface
		public  updateAfterLoad(game:CoC): void {
			if (_breastFlag < 1 || _breastFlag > MAX_FLAG_VALUE) return;
		var  flagData: any[] = String(game.flags[_breastFlag]).split("^");
			if (flagData.length < 9) {
				//Loading from a file that doesn't contain appropriate save data.
				//Values will either have to be assigned in Saves.unFuckSave() or by the first encounter with this NPC
				return;
			}
			//For now there's no need to check the version. If this class is ever updated to save more the version will become useful.
			rows						= int(flagData[1]);
			cupSize						= int(flagData[2]);
			lactationLevel				= int(flagData[3]);
			nippleLength				= Number(flagData[4]);
			_fullness					= int(flagData[5]);
			_timesMilked				= int(flagData[6]);
			preventLactationIncrease	= int(flagData[7]);
			preventLactationDecrease	= int(flagData[8]);
		}

		public  updateBeforeSave(game:CoC): void {
			if (_breastFlag < 1 || _breastFlag > MAX_FLAG_VALUE) return;
			game.flags[_breastFlag] = BREAST_STORE_VERSION_1 + "^" + rows + "^" + cupSize + "^" + lactationLevel + "^" + nippleLength + "^" + _fullness + "^" + _timesMilked
				+ "^" + preventLactationIncrease + "^" + preventLactationDecrease;
		}
		//End of Interface Implementation

		public static  breastDescript(size: number, lactation: number = 0): string {
			if (size < 1) return "flat breasts";
		var  descript: string = (rand(2) === 0 ? Appearance.breastSize(size) : ""); //Add a description of the breast size 50% of the time
			switch (rand(10)) {
				case 1:
					if (lactation > 2) return descript + "milk-udders";
					break;
				case 2:
					if (lactation > 1.5) descript += "milky ";
					if (size > 4) return descript + "tits";
					break;
				case 4:
				case 5:
				case 6:
					return descript + "tits";
				case 7:
					if (lactation >= 2.5) return descript + "udders";
					if (lactation >= 1) descript += "milk ";
					return descript + "jugs";
				case 8:
					if (size > 6) return descript + "love-pillows";
					return descript + "boobs";
				case 9:
					if (size > 6) return descript + "tits";
					break;
				default:
			}
			return descript + "breasts";
		}

		public  get cupSize(): number { return _cupSize; }

		public  set cupSize(value: number): void {
			if (value < BreastCup.FLAT) value = BreastCup.FLAT;
			if (value > BreastCup.ZZZ_LARGE) value = BreastCup.ZZZ_LARGE;
			_cupSize = value;
		}

		public  get lactationLevel(): number { return _lactation; }

		public  set lactationLevel(value: number): void {
			if (value < LACTATION_DISABLED) value = LACTATION_DISABLED;
			if (value > LACTATION_EPIC) value = LACTATION_EPIC;
			if (_lactation <= LACTATION_NONE && value >= LACTATION_LIGHT) { //Lactation is just starting - zero the other vars involved
				_fullness = 0;
				_timesMilked = 0;
			}
			_lactation = value;
		}

		public  advanceTime(): void {
			if (_lactation <= LACTATION_NONE) return;
			//Add to breastFullness and possibly adjust lactationLevel. Even when lactationLevel == LACTATION_NONE this is still doing something useful, adjusting _breastTimesMilked
			_fullness += LACTATION_BOOST[_lactation]; //Higher lactation means faster refill
			if (_fullness > 60 + 20 * LACTATION_BOOST[_lactation]) { //100 at LACTATION_LIGHT, 180 at LACTATION_EPIC - fullness over this value is overloaded, lactation may be reduced
				_fullness = 50; //This way fullness won't immediately hit the limit again
				if (_timesMilked >= 5) {
					_timesMilked -= 5; //If enough milkings have occured then don't reduce lactation level right away
				}
				else if (preventLactationDecrease !== _lactation) {
					_lactation--;
				}
			}
		}

		public  adj(): string {
			switch (_cupSize) {
				case BreastCup.FLAT:		return "non-existent";
				case BreastCup.A:			return "small";
				case BreastCup.B:
				case BreastCup.C:			return "palmable";
				case BreastCup.D:
				case BreastCup.DD:
				case BreastCup.DD_BIG:		return "sizeable";
				case BreastCup.E:
				case BreastCup.E_BIG:
				case BreastCup.EE:
				case BreastCup.EE_BIG:
				case BreastCup.F:
				case BreastCup.F_BIG:
				case BreastCup.FF:
				case BreastCup.FF_BIG:		return "huge";
				case BreastCup.G:
				case BreastCup.G_BIG:
				case BreastCup.GG:
				case BreastCup.GG_BIG:
				case BreastCup.H:
				case BreastCup.H_BIG:
				case BreastCup.HH:
				case BreastCup.HH_BIG:
				case BreastCup.I:
				case BreastCup.I_BIG:
				case BreastCup.II:
				case BreastCup.II_BIG:		return "gigantic";
				case BreastCup.J:
				case BreastCup.J_BIG:
				case BreastCup.JJ:
				case BreastCup.JJ_BIG:
				case BreastCup.K:
				case BreastCup.K_BIG:
				case BreastCup.KK:
				case BreastCup.KK_BIG:
				case BreastCup.L:
				case BreastCup.L_BIG:
				case BreastCup.LL:
				case BreastCup.LL_BIG:
				case BreastCup.M:
				case BreastCup.M_BIG:
				case BreastCup.MM:
				case BreastCup.MM_BIG:
				case BreastCup.MMM:
				case BreastCup.MMM_LARGE:	return "mammoth";
				default:
			}
			return("titanic");
		}

		public  canTitFuck(): boolean { return _cupSize >= BreastCup.C; }

		public  cup(): string { return Appearance.breastCup(_cupSize); } //The cup size alone

		public  description(useAdj: boolean = false, isMale: boolean = false): string {
			if (_cupSize === BreastCup.FLAT) return "flat" + (isMale ? " manly," : "") + " chest";
			return (useAdj ? adj() + " " : "") + cup() + " breasts";
		}

		public  breastDesc(): string {
			return breastDescript(cupSize, 0.5 * lactationLevel);
		}

		public  hasBreasts(): boolean { return _cupSize !== BreastCup.FLAT; }

		public  lactating(): boolean { return _lactation >= LACTATION_LIGHT; }

		public  milked(): boolean { //Returns true if this milking increased the NPC's lactationLevel
			_fullness = 0;
			_timesMilked++;
			if (preventLactationIncrease === _lactation) return false;
			switch (_lactation) { //With enough milking the lactation level increases
				case LACTATION_NONE: //If you suckle enough times the NPC will eventually start producing milk if they're set to LACTATION_NONE
					if (_timesMilked < 12) return false;
					break;
				case LACTATION_LIGHT:
					if (_timesMilked < 10) return false;
					break;
				case LACTATION_MODERATE:
					if (_timesMilked < 12) return false;
					break;
				case LACTATION_HEAVY:
					if (_timesMilked < 15) return false;
					break;
				case LACTATION_STRONG:
					if (_timesMilked < 20) return false;
					break;
				default: //No amount of suckling will increase lactation levels for this NPC
					return false;
			}
			//Only reach this point if the NPC has been milked enough times to justify increasing their milk production
			_timesMilked = 5;
			lactationLevel++;
			return true;
		}

		public  milkIsFull(): boolean { return (_lactation <= LACTATION_NONE ? 0 : _fullness >= 50); }

		public  milkIsOverflowing(): boolean {
			return (_lactation <= LACTATION_NONE ? 0 : _fullness >= 60 + 5 * LACTATION_BOOST[_lactation]); //Probably pretty desperate to be milked by this point
		}

		//At fullness == 50 the maximum amount of milk is produced. When overfull, lactation level is reduced and fullness drops to 50.
		//So a higher lactationLevel means more milk is produced and the breasts can stay full without drying up for longer. Will always return 0 if not lactating
		public  milkQuantity(): number
		{
			if (_lactation <= LACTATION_NONE) return 0;
			return 0.01 * Math.max(100, 2 * _fullness) * Number(20 * _rows * _cupSize * (_lactation - 1));
		}

		public  nippleDescript(tiny: string = "tiny", small: string = "prominent", large: string = "large", huge: string = "elongated", massive: string = "massive"): string
		{
			if (_nippleLength < 3) return tiny;
			if (_nippleLength < 10) return small;
			if (_nippleLength < 20) return large;
			if (_nippleLength < 32) return huge;
			return massive;
		}

		public  get nippleLength(): number { return _nippleLength; }

		public  set nippleLength(value: number): void {
			if (value < 0) value = 0;
			_nippleLength = 0.1 * Math.round(10 * value); //Ensure nipple length only goes to one decimal place
		}

		public  get rows(): number { return _rows; }

		public  set rows(value: number): void {
			if (value < 1) value = 1;
			_rows = value;
		}
	}	
