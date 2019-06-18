	
	export class PregnancyStore extends Object
	{
		//Pregancy types. Both butt and normal. Each type represents the father of this baby.
		public static  PREGNANCY_IMP: number                   =   1;
		public static  PREGNANCY_MINOTAUR: number              =   2;
		public static  PREGNANCY_COCKATRICE: number            =   3;
		public static  PREGNANCY_MOUSE: number                 =   4;
		public static  PREGNANCY_OVIELIXIR_EGGS: number        =   5; //Also caused by Phoenixes apparently
		public static  PREGNANCY_HELL_HOUND: number            =   6;
		public static  PREGNANCY_CENTAUR: number               =   7;
		public static  PREGNANCY_MARBLE: number                =   8;
		public static  PREGNANCY_BUNNY: number                 =   9;
		public static  PREGNANCY_ANEMONE: number               =  10;
		public static  PREGNANCY_AMILY: number                 =  11;
		public static  PREGNANCY_IZMA: number                  =  12;
		public static  PREGNANCY_SPIDER: number                =  13;
		public static  PREGNANCY_BASILISK: number              =  14;
		public static  PREGNANCY_DRIDER_EGGS: number           =  15;
		public static  PREGNANCY_GOO_GIRL: number              =  16;
		public static  PREGNANCY_EMBER: number                 =  17;
		public static  PREGNANCY_BENOIT: number                =  18;
		public static  PREGNANCY_SATYR: number                 =  19;
		public static  PREGNANCY_COTTON: number                =  20;
		public static  PREGNANCY_URTA: number                  =  21;
		public static  PREGNANCY_SAND_WITCH: number            =  22;
		public static  PREGNANCY_FROG_GIRL: number             =  23;
		public static  PREGNANCY_FAERIE: number                =  24; //Indicates you are carrying either a phouka or faerie baby. Which one is determined by the PREGNANCY_CORRUPTION flag
		public static  PREGNANCY_PLAYER: number                =  25; //The player is the father. Will be used when an NPC is able to have children from multiple different fathers.
		public static  PREGNANCY_BEE_EGGS: number              =  26;
		public static  PREGNANCY_SANDTRAP_FERTILE: number      =  27;
		public static  PREGNANCY_SANDTRAP: number              =  28;
		public static  PREGNANCY_JOJO: number                  =  29; //So we can track them separately from other mouse pregnancies
		public static  PREGNANCY_KELT: number                  =  30; //So we can track them separately from other centaur pregnancies
		public static  PREGNANCY_TAOTH: number                 =  31;
		public static  PREGNANCY_GOO_STUFFED: number           =  32; //Used to fill the player's ass and/or vagina when Valeria has a goo girl take up residence. This prevents any other
																	   //form of pregnancy from taking hold. Does not respond to ovielixirs.
		public static  PREGNANCY_WORM_STUFFED: number          =  33; //Used to fill the player's vagina when the worms take up residence. This prevents any other form of
																	   //pregnancy from taking hold. Does not respond to ovielixirs.
		public static  PREGNANCY_MINERVA: number				=  34;
		public static  PREGNANCY_BEHEMOTH: number				=  35;
		public static  PREGNANCY_PHOENIX: number				=  36;
		public static  PREGNANCY_ANDY: number                  =  37; //This is functionally the same as Satyr but less corrupt. 10% chance of fauns, if ever implemented.
		
		public static  PREG_NOT_PREGANT: number                =   0; //The PREG_* consts are returned by the size function
		public static  PREG_NO_SIGNS_UNKNOWN: number           =   1; //NPC has conceived but doesn’t know she’s pregnant, no visible signs
		public static  PREG_NO_SIGNS_KNOWN: number             =   2; //NPC is in the first trimester, knows she’s pregnant
		public static  PREG_START_BULGE: number                =   3; //NPC is in the first trimester, belly is just starting to bulge
		public static  PREG_SWOLLEN: number                    =   4; //NPC is in the second trimester, belly is small but definitely swollen
		public static  PREG_SIZEABLE: number                   =   5; //NPC is in the second trimester, belly is now sizable
		public static  PREG_BLATANT: number                    =   6; //NPC is in the third trimester, belly is blatantly bulging
		public static  PREG_FULL_TERM: number                  =   7; //NPC is in the third trimester, belly is big as it will get for a normal pregnancy
		public static  PREG_OVERDUE: number                    =   8; //NPC is overdue. Usually means a centaur baby, twins or some similar condition. Effectively looks 10 months pregnant
		public static  PREG_VERY_OVERDUE: number               =   9; //NPC is very overdue. Probably triplets or more. Effectively looks 11 months pregnant
//Old Value, replaced in Saves.unFuckSave()		public static const PREGNANCY_BUTT_BEE: number              =   2;
//Old Value, replaced in Saves.unFuckSave()		public static const PREGNANCY_BUTT_DRIDER: number           =   3;
//Old Value, replaced in Saves.unFuckSave()		public static const PREGNANCY_BUTT_SANDTRAP_FERTILE: number =   4;
//Old Value, replaced in Saves.unFuckSave()		public static const PREGNANCY_BUTT_SANDTRAP: number         =   5; //Sandtrap did not have fertilized eggs

		public static  INCUBATION_IMP: number                  = 432; //Time for standard imps. Imp lords, Ceraph, Lilium and the imp horde cause slightly faster pregnancies
		public static  INCUBATION_MINOTAUR: number             = 432;
		public static  INCUBATION_MOUSE: number                = 350;
		public static  INCUBATION_OVIELIXIR_EGGS: number       =  50;
		public static  INCUBATION_HELL_HOUND: number           = 352;
		public static  INCUBATION_CENTAUR: number              = 420;
		public static  INCUBATION_MARBLE: number               = 368;
		public static  INCUBATION_BUNNY_BABY: number           = 200;
		public static  INCUBATION_BUNNY_EGGS: number           = 808; //High time indicates neon egg pregnancy
		public static  INCUBATION_ANEMONE: number              = 256;
		public static  INCUBATION_IZMA: number                 = 300;
		public static  INCUBATION_SPIDER: number               = 400;
		public static  INCUBATION_BASILISK: number             = 250;
		public static  INCUBATION_COCKATRICE: number           = 225;
		public static  INCUBATION_DRIDER: number               = 400;
		public static  INCUBATION_GOO_GIRL: number             =  85;
		public static  INCUBATION_EMBER: number                = 336;
		public static  INCUBATION_SATYR: number                = 160;
		public static  INCUBATION_COTTON: number               = 350;
		public static  INCUBATION_URTA: number                 = 515;
		public static  INCUBATION_SAND_WITCH: number           = 360;
		public static  INCUBATION_FROG_GIRL: number            =  30;
		public static  INCUBATION_FAERIE: number               = 200;
		public static  INCUBATION_BEE: number                  =  48;
		public static  INCUBATION_SANDTRAP: number             =  42;
		public static  INCUBATION_HARPY: number                = 168;
		public static  INCUBATION_SHIELA: number               =  72;
		public static  INCUBATION_SALAMANDER: number           = 336;
		public static  INCUBATION_MINERVA: number           	= 216; 
		public static  INCUBATION_BEHEMOTH: number           	=1440; //Sorry Behemoth, but Isabella wins.
		public static  INCUBATION_PHOENIX: number           	= 168; 
		public static  INCUBATION_KIHA: number                 = 336;
		public static  INCUBATION_ISABELLA: number             =2160; //Longest pregnancy ever. 
		
		private static  MAX_FLAG_VALUE: number                 = 2999;
		private static  PREG_TYPE_MASK: number                 = 0x0000FFFF; //Should be safe with 65535 different pregnancy types
		private static  PREG_NOTICE_MASK: number               = 0x7FFF0000; //Use upper half to store the latest stages of pregnancy the player has noticed
		
		private  _pregnancyTypeFlag: number;
		private  _pregnancyIncubationFlag: number;
		private  _buttPregnancyTypeFlag: number;
		private  _buttPregnancyIncubationFlag: number;
		private  _pregnancyEventValue:Vector.< Vector.<int> >; //Using a vector of vectors so that each different pregnancy type can have its own set of events
		private  _buttPregnancyEventValue:Vector.< Vector.<int> >;
		
		//All the flags are passed through the constructor so that they can be different in every class that uses PregnancyStore but the pregnancy code remains the same
		public  PregnancyStore(pregType: number, pregInc: number, buttPregType: number, buttPregInc: number) {
			_pregnancyTypeFlag = pregType;
			_pregnancyIncubationFlag = pregInc;
			_buttPregnancyTypeFlag = buttPregType;
			_buttPregnancyIncubationFlag = buttPregInc;
			_pregnancyEventValue = new Vector.< Vector.<int> >();
			_buttPregnancyEventValue = new Vector.< Vector.<int> >();
			if (pregType < 0 || pregType > MAX_FLAG_VALUE || pregInc < 0 || pregInc > MAX_FLAG_VALUE || buttPregType < 0 || buttPregType > MAX_FLAG_VALUE || buttPregInc < 0 || buttPregInc > MAX_FLAG_VALUE || pregType == buttPregType || pregInc == buttPregInc) {
				CoC_Settings.error("Error: PregnancyStore created with invalid values for its flags. PregnancyStore(" + pregType + ", " + pregInc + ", " + buttPregType + ", " + buttPregInc + ")");
			}
		}
	
		public  get type(): number { return (_pregnancyTypeFlag == 0 ? 0 : kGAMECLASS.flags[_pregnancyTypeFlag] & PREG_TYPE_MASK); }

		public  get incubation(): number { return (_pregnancyIncubationFlag == 0 ? 0 : kGAMECLASS.flags[_pregnancyIncubationFlag]); }

		public  get buttType(): number { return (_buttPregnancyTypeFlag == 0 ? 0 : kGAMECLASS.flags[_buttPregnancyTypeFlag] & PREG_TYPE_MASK); }

		public  get buttIncubation(): number { return (_buttPregnancyIncubationFlag == 0 ? 0 : kGAMECLASS.flags[_buttPregnancyIncubationFlag]); }
		
		public  get isPregnant(): boolean { return type != 0; } //At birth the incubation can be zero so a check vs. type is safer

		public  get isButtPregnant(): boolean { return buttType != 0; } //At birth the incubation can be zero so a check vs. type is safer
		
		/* Using this function adds a series of events which happen during the pregnancy. They must be added in descending order (ex. 500, 450, 350, 225, 100, 25)
		   to work properly. For NPCs who have multiple pregnancy types each type has its own set of events. Events can be used to see how far along the NPC
		   is in her pregnancy with the event property. They can also be checked using the eventTriggered() function. This checks to see which was the latest event
		   the player noticed. The eventTriggered() function only triggers once per event per pregnancy. */
		public  addPregnancyEventSet(pregType: number, ... pregStage): void
		{
		var  pregVector:Vector.<int> = new Vector.<int>(pregStage.length + 2);
			pregVector[0] = pregType; //First element is the pregnancy type
			for (var i: number = 0; i < pregStage.length; i++) pregVector[i + 1] = pregStage[i];
			pregVector[pregVector.length - 1] = -1; //Make last element -1 to ensure there is always a match
			_pregnancyEventValue.push(pregVector);
		}

		//Same as addPregnancyEventSet, but for butts
		public  addButtPregnancyEventSet(buttPregType: number, ... buttPregStage): void
		{
		var  pregVector:Vector.<int> = new Vector.<int>(buttPregStage.length + 1);
			pregVector[0] = buttPregType; //First element is the butt pregnancy type
			for (var i: number = 0; i < buttPregStage.length; i++) pregVector[i + 1] = buttPregStage[i];
			pregVector[pregVector.length - 1] = -1; //Make last element -1 to ensure there is always a match
			_buttPregnancyEventValue.push(pregVector);
		}
		
		public  knockUp(newPregType: number = 0, newPregIncubation: number = 0): void
		{
			if (!isPregnant) knockUpForce(newPregType, newPregIncubation);
		}
		
		public  knockUpForce(newPregType: number = 0, newPregIncubation: number = 0): void
		{
			if (_pregnancyTypeFlag == 0 || _pregnancyIncubationFlag == 0) return; //Check that these variables were provided by the containing class
			if (newPregType != 0) newPregType = (kGAMECLASS.flags[_pregnancyTypeFlag] & PREG_NOTICE_MASK) + newPregType;
				//If a pregnancy 'continues' an existing pregnancy then do not change the value for last noticed stage
			kGAMECLASS.flags[_pregnancyTypeFlag] = newPregType;
			kGAMECLASS.flags[_pregnancyIncubationFlag] = (newPregType == 0 ? 0 : newPregIncubation); //Won't allow incubation time without pregnancy type
		}
	
		public  buttKnockUp(newPregType: number = 0, newPregIncubation: number = 0): void
		{
			if (!isButtPregnant) buttKnockUpForce(newPregType, newPregIncubation);
		}
		
		public  buttKnockUpForce(newPregType: number = 0, newPregIncubation: number = 0): void
		{
			if (_buttPregnancyTypeFlag == 0 || _buttPregnancyIncubationFlag == 0) return; //Check that these variables were provided by the containing class
			if (newPregType != 0) newPregType = (kGAMECLASS.flags[_buttPregnancyTypeFlag] & PREG_NOTICE_MASK) + newPregType;
				//If a pregnancy 'continues' an existing pregnancy then do not change the value for last noticed stage
			kGAMECLASS.flags[_buttPregnancyTypeFlag] = newPregType;
			kGAMECLASS.flags[_buttPregnancyIncubationFlag] = (newPregType == 0 ? 0 : newPregIncubation); //Won't allow incubation time without pregnancy type
		}

		//The containing class is responsible for calling pregnancyAdvance, usually once per timeChange()
		public  pregnancyAdvance(): void //Separate function so it can be called more often than timeChange if neccessary
		{
			if (incubation != 0) {
				kGAMECLASS.flags[_pregnancyIncubationFlag]--;
				if (kGAMECLASS.flags[_pregnancyIncubationFlag] < 0) kGAMECLASS.flags[_pregnancyIncubationFlag] = 0;
			}
			if (buttIncubation != 0) {
				kGAMECLASS.flags[_buttPregnancyIncubationFlag]--;
				if (kGAMECLASS.flags[_buttPregnancyIncubationFlag] < 0) kGAMECLASS.flags[_buttPregnancyIncubationFlag] = 0;
			}
		}

		/* Many NPCs go through several events during their pregnancies. This function returns the latest event the NPC qualifies for.
		   When the NPC is not pregnant this always returns 0, when pregnant it will return at least 1. The further along the NPC is the larger the value. Each NPC
		   is free to have as many event as desired. They must be added using the addPregnancyEventSet function and are unique to each pregnancy type. */
		public  get event(): number
		{
		var  pregType: number = type;
			if (pregType == 0) return 0; //Not pregnant
		var  incubationValue: number = incubation;
		var  pregEventVector:Vector.<int> = undefined;
			for (var i: number = 0; i < _pregnancyEventValue.length; i++) {
				pregEventVector = _pregnancyEventValue[i];
				if (pregEventVector[0] == pregType) {
					for (var j: number = 1; j < pregEventVector.length; j++) { //Skip element zero, the pregnancy type
						if (incubationValue > pregEventVector[j]) return j; //Will always find a value that is < incubationValue as last value is -1
					}
				}
			}
			return 1; //If there are no pregnancy events for this type of pregnancy then return 1
		}
		
		//The same event system as for vaginal pregnacies, but for butts
		public  get buttEvent(): number
		{
		var  pregType: number = buttType;
			if (pregType == 0) return 0; //Not pregnant
		var  incubationValue: number = buttIncubation;
		var  pregEventVector:Vector.<int> = undefined;
			for (var i: number = 0; i < _buttPregnancyEventValue.length; i++) {
				pregEventVector = _buttPregnancyEventValue[i];
				if (pregEventVector[0] == pregType) {
					for (var j: number = 1; j < pregEventVector.length; j++) { //Skip element zero, the pregnancy type
						if (incubationValue > pregEventVector[j]) return j; //Will always find a value that is < incubationValue as last value is -1
					}
				}
			}
			return 1; //If there are no pregnancy events for this type of pregnancy then return 1
		}

		//Returns either zero - for no change - or the value of the new pregnancy event which the player has not yet noticed
		//This function updates the noticed pregnancy event, so it only triggers once per event per pregnancy.
		public  eventTriggered(): number
		{
		var  currentStage: number = event;
		var  lastNoticed: number = kGAMECLASS.flags[_pregnancyTypeFlag] & PREG_NOTICE_MASK;
			if (currentStage * 65536 == lastNoticed) return 0; //Player has already noticed this stage
			kGAMECLASS.flags[_pregnancyTypeFlag] = (kGAMECLASS.flags[_pregnancyTypeFlag] & PREG_TYPE_MASK) + (currentStage * 65536);
				//Strip off the old noticed value by ANDing with PREG_TYPE_MASK
			return currentStage;
		}

		//Same as eventTriggered, but for butts
		public  buttEventTriggered(): number
		{
		var  currentStage: number = buttEvent;
		var  lastNoticed: number = kGAMECLASS.flags[_buttPregnancyTypeFlag] & PREG_NOTICE_MASK;
			if (currentStage * 65536 == lastNoticed) return 0; //Player has already noticed this stage
			kGAMECLASS.flags[_buttPregnancyTypeFlag] = (kGAMECLASS.flags[_buttPregnancyTypeFlag] & PREG_TYPE_MASK) + (currentStage * 65536);
				//Strip off the old noticed value by ANDing with PREG_TYPE_MASK
			return currentStage;
		}

		public  get size(): number {
			//This function exists to provide consistency across different NPC's pregnancies. This is most useful when trying to write descriptions of different belly sizes
			//in threesomes, where the author might not be familiar with how the different pregnancy events relate to belly size.
			return PREG_NOT_PREGANT;
		}
	}

