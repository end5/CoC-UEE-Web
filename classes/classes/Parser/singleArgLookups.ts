﻿

		// Lookup dictionary for converting any single argument brackets into it's corresponding string
		// basically [armor] results in the "[armor]" segment of the string being replaced with the
		// results of the corresponding anonymous function, in this case: function(): any {return player.armorName;}
		// tags not present in the singleArgConverters object return an error message.
		//
		//Calls are now made through kGAMECLASS rather than thisPtr. This allows the compiler to detect if/when a function is inaccessible.
		
		public  singleArgConverters: Record<string, any> =
		{
				// all the errors related to trying to parse stuff if not present are
				// already handled in the various *Descript() functions.
				// no need to duplicate them.

				// Note: all key strings MUST be ENTIRELY lowercase.

				"agility"					: function(): any { return "[Agility]"; },
				"allbreasts"				: function(): any { return kGAMECLASS.player.allBreastsDescript(); },
				"alltits"				    : function(): any { return kGAMECLASS.player.allBreastsDescript(); },
				"armor"						: function(): any { return kGAMECLASS.player.armorName;},
				"armorname"					: function(): any { return kGAMECLASS.player.armorName;},
				"ass"						: function(): any { return kGAMECLASS.player.buttDescript();},
				"asshole"					: function(): any { return kGAMECLASS.player.assholeDescript(); },
				"assholeorpussy"			: function(): any { return kGAMECLASS.player.assholeOrPussy(); },
				"balls"						: function(): any { return kGAMECLASS.player.ballsDescriptLight(); },
				"bodytype"					: function(): any { return kGAMECLASS.player.bodyType(); },
				"boyfriend"					: function(): any { return kGAMECLASS.player.mf("boyfriend", "girlfriend"); },
				"breasts"					: function(): any { return kGAMECLASS.player.breastDescript(0); },
				"lastbreasts"				: function(): any { return kGAMECLASS.player.breastDescript(-1); },
				"butt"						: function(): any { return kGAMECLASS.player.buttDescript();},
				"butthole"					: function(): any { return kGAMECLASS.player.assholeDescript();},
				"chest"						: function(): any { return kGAMECLASS.player.chestDesc(); },
				"claws"						: function(): any { return kGAMECLASS.player.clawsDescript(); },
				"clit"						: function(): any { return kGAMECLASS.player.clitDescript(); },
				"cock"						: function(): any { return kGAMECLASS.player.cockDescript(0);},
				"cockhead"					: function(): any { return kGAMECLASS.player.cockHead(0);},
				"cocks"						: function(): any { return kGAMECLASS.player.multiCockDescriptLight(); },
				"cunt"						: function(): any { return kGAMECLASS.player.vaginaDescript(); },
				"eachcock"					: function(): any { return kGAMECLASS.player.sMultiCockDesc();},
				"eachcockuc"				: function(): any { return kGAMECLASS.player.SMultiCockDesc();},
				"evade"						: function(): any { return "[Evade]"; },
				"extraeyes"					: function(): any { return kGAMECLASS.player.extraEyesDescript();},
				"extraeyesshort"			: function(): any { return kGAMECLASS.player.extraEyesDescriptShort();},
				"eyes"						: function(): any { return kGAMECLASS.player.eyesDescript();},
				"eyecount"					: function(): any { return kGAMECLASS.player.eyes.count;},
				"face"						: function(): any { return kGAMECLASS.player.faceDescript(); },
				"feet"						: function(): any { return kGAMECLASS.player.feet(); },
				"foot"						: function(): any { return kGAMECLASS.player.foot(); },
				"fullchest"					: function(): any { return kGAMECLASS.player.allChestDesc(); },
				"furcolor"					: function(): any { return kGAMECLASS.player.skin.furColor; },
				"hair"						: function(): any { return kGAMECLASS.player.hairDescript(); },
				"haircolor"					: function(): any { return kGAMECLASS.player.hair.color; },
				"hairorfur"					: function(): any { return kGAMECLASS.player.hairOrFur(); },
				"hairorfurcolors"			: function(): any { return kGAMECLASS.player.hairOrFurColors; },
				"hairorfurcolor"			: function(): any { return kGAMECLASS.player.hairOrFurColor(); },
				"hand"						: function(): any { return kGAMECLASS.player.handsDescript(false); },
				"hands"						: function(): any { return kGAMECLASS.player.handsDescript(true); },
				"he"						: function(): any { return kGAMECLASS.player.mf("he", "she"); },
				"he2"						: function(): any { return kGAMECLASS.player2.mf("he", "she"); },
				"him"						: function(): any { return kGAMECLASS.player.mf("him", "her"); },
				"him2"						: function(): any { return kGAMECLASS.player2.mf("him", "her"); },
				"himself"					: function(): any { return kGAMECLASS.player.mf("himself", "herself"); },
				"herself"					: function(): any { return kGAMECLASS.player.mf("himself", "herself"); },
				"hips"						: function(): any { return kGAMECLASS.player.hipDescript();},
				"his"						: function(): any { return kGAMECLASS.player.mf("his", "her"); },
				"his2"						: function(): any { return kGAMECLASS.player2.mf("his", "her"); },
				"horns"						: function(): any { return kGAMECLASS.player.hornDescript(); },
				"leg"						: function(): any { return kGAMECLASS.player.leg(); },
				"legcounttext"				: function(): any { return Utils.num2Text(kGAMECLASS.player.lowerBody.legCount); },
				"legcounttextuc"			: function(): any { return Utils.Num2Text(kGAMECLASS.player.lowerBody.legCount); },
				"legs"						: function(): any { return kGAMECLASS.player.legs(); },
				"lowergarment"				: function(): any { return kGAMECLASS.player.lowerGarmentName; },
				"malespersons"				: function(): any { return kGAMECLASS.player.mf("males", "persons"); },
				"man"						: function(): any { return kGAMECLASS.player.mf("man", "woman"); },
				"men"						: function(): any { return kGAMECLASS.player.mf("men", "women"); },
				"malefemaleherm"			: function(): any { return kGAMECLASS.player.maleFemaleHerm(); },
				"master"					: function(): any { return kGAMECLASS.player.mf("master","mistress"); },
				"misdirection"				: function(): any { return "[Misdirection]"; },
				"multicock"					: function(): any { return kGAMECLASS.player.multiCockDescriptLight(); },
				"multicockdescriptlight"	: function(): any { return kGAMECLASS.player.multiCockDescriptLight(); },
				"name"						: function(): any { return kGAMECLASS.player.short;},
				"neck"						: function(): any { return kGAMECLASS.player.neckDescript(); },
				"neckcolor"					: function(): any { return kGAMECLASS.player.neck.color;},
				"nipple"					: function(): any { return kGAMECLASS.player.nippleDescript(0);},
				"nipples"					: function(): any { return kGAMECLASS.player.nippleDescript(0) + "s";},
				"lastnipple"				: function(): any { return kGAMECLASS.player.nippleDescript(-1);},
				"lastnipples"				: function(): any { return kGAMECLASS.player.nippleDescript(-1) + "s";},
				"onecock"					: function(): any { return kGAMECLASS.player.oMultiCockDesc();},
				"pg"						: function(): any { return "\n\n";},
				"pussy"						: function(): any { return kGAMECLASS.player.vaginaDescript(); },
				"race"						: function(): any { return kGAMECLASS.player.race; },
				"rearbody"					: function(): any { return kGAMECLASS.player.rearBodyDescript(); },
				"rearbodycolor"				: function(): any { return kGAMECLASS.player.rearBody.color; },
				"sack"						: function(): any { return kGAMECLASS.player.sackDescript(); },
				"sheath"					: function(): any { return kGAMECLASS.player.sheathDescript(); },
				"shield"					: function(): any { return kGAMECLASS.player.shieldName; },
				"skin"						: function(): any { return kGAMECLASS.player.skinDescript(); },
				"skin.noadj"				: function(): any { return kGAMECLASS.player.skinDescript(true); },
				"skindesc"					: function(): any { return kGAMECLASS.player.skin.desc; },
				"skinfurscales"				: function(): any { return kGAMECLASS.player.skinFurScales(); },
				"skintone"					: function(): any { return kGAMECLASS.player.skin.tone; },
				"tallness"					: function(): any { return Measurements.footInchOrMetres(kGAMECLASS.player.tallness); },
				"tits"						: function(): any { return kGAMECLASS.player.breastDescript(0); },
				"lasttits"					: function(): any { return kGAMECLASS.player.breastDescript(-1); },
				"breastcup"					: function(): any { return kGAMECLASS.player.breastCup(0); },
				"lastbreastcup"				: function(): any { return kGAMECLASS.player.breastCup(-1); },
				"tongue"					: function(): any { return kGAMECLASS.player.tongueDescript(); },
				"underbody.skinfurscales"	: function(): any { return kGAMECLASS.player.underBody.skinFurScales(); },
				"underbody.skintone"		: function(): any { return kGAMECLASS.player.underBody.skin.tone; },
				"underbody.furcolor"		: function(): any { return kGAMECLASS.player.underBody.skin.furColor; },
				"uppergarment"				: function(): any { return kGAMECLASS.player.upperGarmentName; },
				"vag"						: function(): any { return kGAMECLASS.player.vaginaDescript(); },
				"vagina"					: function(): any { return kGAMECLASS.player.vaginaDescript(); },
				"vagorass"					: function(): any { return (kGAMECLASS.player.hasVagina() ? kGAMECLASS.player.vaginaDescript() : kGAMECLASS.player.assholeDescript()); },
				"weapon"					: function(): any { return kGAMECLASS.player.weaponName;},
				"weaponname"				: function(): any { return kGAMECLASS.player.weaponName; },
				"latexyname"				: function(): any { return kGAMECLASS.flags[kFLAGS.GOO_NAME]; },
				"bathgirlname"				: function(): any { return kGAMECLASS.flags[kFLAGS.MILK_NAME]; },
				"cockplural"				: function(): any { return (kGAMECLASS.player.cocks.length == 1) ? "cock" : "cocks"; },
				"dickplural"				: function(): any { return (kGAMECLASS.player.cocks.length == 1) ? "dick" : "dicks"; },
				"headplural"				: function(): any { return (kGAMECLASS.player.cocks.length == 1) ? "head" : "heads"; },
				"prickplural"				: function(): any { return (kGAMECLASS.player.cocks.length == 1) ? "prick" : "pricks"; },
				"boy"						: function(): any { return kGAMECLASS.player.mf("boy", "girl"); },
				"guy"						: function(): any { return kGAMECLASS.player.mf("guy", "girl"); },
				"wings"						: function(): any { return kGAMECLASS.player.wingsDescript(); },
				"wingcolor"					: function(): any { return kGAMECLASS.player.wings.color; },
				"wingcolor2"				: function(): any { return kGAMECLASS.player.wings.color2; },
				"wingcolordesc"				: function(): any { return kGAMECLASS.player.wings.getColorDesc(BaseBodyPart.COLOR_ID_MAIN); },
				"wingcolor2desc"			: function(): any { return kGAMECLASS.player.wings.getColorDesc(BaseBodyPart.COLOR_ID_2ND); },
				"tail"						: function(): any { return kGAMECLASS.player.tailDescript(); },
				"onetail"					: function(): any { return kGAMECLASS.player.oneTailDescript(); },

				//Monster strings
				"monster.short"				: function(): any { return kGAMECLASS.monster.short; },
				"monster.a"					: function(): any { return kGAMECLASS.monster.a; },
				"monster.capitala"			: function(): any { return kGAMECLASS.monster.capitalA; },
				"monster.pronoun1"			: function(): any { return kGAMECLASS.monster.pronoun1; },
				"monster.pronoun1caps"		: function(): any { return kGAMECLASS.monster.Pronoun1; },
				"monster.pronoun2"			: function(): any { return kGAMECLASS.monster.pronoun2; },
				"monster.pronoun2caps"		: function(): any { return kGAMECLASS.monster.Pronoun2; },
				"monster.pronoun3"			: function(): any { return kGAMECLASS.monster.pronoun3; },
				"monster.pronoun3caps"		: function(): any { return kGAMECLASS.monster.Pronoun3; },

				//Prisoner
				"captortitle"				: function(): any { return kGAMECLASS.prison.prisonCaptor.captorTitle; },
				"captorname"				: function(): any { return kGAMECLASS.prison.prisonCaptor.captorName; },
				"captorhe"					: function(): any { return kGAMECLASS.prison.prisonCaptor.captorPronoun1; },
				"captorhim"					: function(): any { return kGAMECLASS.prison.prisonCaptor.captorPronoun2; },
				"captorhis"					: function(): any { return kGAMECLASS.prison.prisonCaptor.captorPronoun3; }
				
		}