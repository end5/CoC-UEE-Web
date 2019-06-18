	/**
	 * ...
	 * @author Kitteh6660
	 */

	//Enchantment IDs
	/*
	 * 0: Nothing
	 * 1: Minimum lust
	 * 2: Fertility
	 * 3: Critical
	 * 4: Regeneration
	 * 5: HP
	 * 6: Attack power
	 * 7: Spell power
	 * 8: Purity 
	 * 9: Corruption 
	 
	 */
	
	export class JewelryLib
	{
		public static  MODIFIER_MINIMUM_LUST: number = 1;
		public static  MODIFIER_FERTILITY: number = 	2;
		public static  MODIFIER_CRITICAL: number = 	3;
		public static  MODIFIER_REGENERATION: number = 4;
		public static  MODIFIER_HP: number = 			5;
		public static  MODIFIER_ATTACK_POWER: number = 6;
		public static  MODIFIER_SPELL_POWER: number = 	7;
		public static  PURITY: number = 				8;
		public static  CORRUPTION: number = 			9;
		
		public static  DEFAULT_VALUE: number = 6;
		
		public static  NOTHING:Nothing = new Nothing();
		
		//Tier 1 rings
		public  CRIMRN1:Jewelry = new Jewelry("CrimRng", "L Crim.Ring", "lesser crimstone ring", "an enchanted crimstone ring", MODIFIER_MINIMUM_LUST, 10, 1000, "This ring is topped with crimstone. It is said that this will help to keep your desires burning. ","Ring");
		public  FERTRN1:Jewelry = new Jewelry("FertRng", "L Fert.Ring", "lesser fertite ring", "an enchanted fertite ring", MODIFIER_FERTILITY, 20, 1000, "This ring is topped with fertite. It is said that this will make you more virile and fertile. ","Ring");
		public  ICE_RN1:Jewelry = new Jewelry("Ice_Rng", "L Icst.Ring", "lesser icestone ring", "an enchanted icestone ring", MODIFIER_MINIMUM_LUST, -10, 2000, "This ring is topped with icestone. It is said that this will counter ever-burning desires. ","Ring");
		public  CRITRN1:Jewelry = new Jewelry("CritRng", "L Crit Ring", "lesser ring of criticality", "an enchanted topaz ring of criticality", MODIFIER_CRITICAL, 3, 1500, "This ring is topped with topaz gemstone. It is said that this will help you to focus and exploit your opponent's weak spots, allowing you to score critical hits more often. ","Ring");
		public  REGNRN1:Jewelry = new Jewelry("RegnRng", "L Regn.Ring", "lesser ring of regeneration", "an enchanted amethyst ring of regeneration", MODIFIER_REGENERATION, 2, 2000, "This ring is topped with amethyst gemstone. It is said that this will hasten your recovery. ","Ring");
		public  LIFERN1:Jewelry = new Jewelry("LifeRng", "L Life Ring", "lesser ring of life", "an enchanted emerald ring of life force", MODIFIER_HP, 30, 1000, "This ring is topped with emerald gemstone. It is said that this will make you feel a bit healthier. ","Ring");
		public  MYSTRN1:Jewelry = new Jewelry("MystRng", "L Mystic Ring", "lesser ring of mysticality", "an enchanted sapphire ring of mysticality", MODIFIER_SPELL_POWER, 20, 1500, "This ring is topped with sapphire gemstone. It is said that this will make your spells more powerful. ","Ring");
		public  POWRRN1:Jewelry = new Jewelry("PowrRng", "L Power Ring", "lesser ring of power", "an enchanted ruby ring of power", MODIFIER_ATTACK_POWER, 6, 1500, "This ring is topped with ruby gemstone. It is said that this will make you feel a bit powerful. ","Ring");
		
		//Tier 2 rings
		public  CRIMRN2:Jewelry = new Jewelry("CrimRn2", "Crim.Ring", "crimstone ring", "an enchanted crimstone ring", MODIFIER_MINIMUM_LUST, 15, 2000, "This ring is topped with crimstone. It is said that this will help to keep your desires burning. ","Ring");
		public  FERTRN2:Jewelry = new Jewelry("FertRn2", "Fert.Ring", "fertite ring", "an enchanted fertite ring", MODIFIER_FERTILITY, 30, 2000, "This ring is topped with fertite. It is said that this will make you more virile and fertile. ","Ring");
		public  ICE_RN2:Jewelry = new Jewelry("Ice_Rn2", "Icst.Ring", "icestone ring", "an enchanted icestone ring", MODIFIER_MINIMUM_LUST, -15, 4000, "This ring is topped with icestone. It is said that this will counter ever-burning desires. ","Ring");
		public  CRITRN2:Jewelry = new Jewelry("CritRn2", "Crit Ring", "ring of criticality", "an enchanted topaz ring of criticality", MODIFIER_CRITICAL, 5, 3000, "This ring is topped with topaz gemstone. It is said that this will help you to focus and exploit your opponent's weak spots, allowing you to score critical hits more often. ","Ring");
		public  REGNRN2:Jewelry = new Jewelry("RegnRn2", "Regn.Ring", "ring of regeneration", "an enchanted amethyst ring of regeneration", MODIFIER_REGENERATION, 3, 4000, "This ring is topped with amethyst gemstone. It is said that this will hasten your recovery. ","Ring");
		public  LIFERN2:Jewelry = new Jewelry("LifeRn2", "Life Ring", "ring of life", "an enchanted emerald ring of life force", MODIFIER_HP, 45, 2000, "This ring is topped with emerald gemstone. It is said that this will make you feel a bit healthier. ","Ring");
		public  MYSTRN2:Jewelry = new Jewelry("MystRn2", "Mystic Ring", "ring of mysticality", "an enchanted sapphire ring of mysticality", MODIFIER_SPELL_POWER, 30, 3000, "This ring is topped with sapphire gemstone. It is said that this will make your spells more powerful. ","Ring");
		public  POWRRN2:Jewelry = new Jewelry("PowrRn2", "Power Ring", "ring of power", "an enchanted ruby ring of power", MODIFIER_ATTACK_POWER, 9, 3000, "This ring is topped with ruby gemstone. It is said that this will make you feel a bit powerful. ","Ring");

		//Tier 3 rings
		public  CRIMRN3:Jewelry = new Jewelry("CrimRn3", "G Crim.Ring", "greater crimstone ring", "an enchanted crimstone ring", MODIFIER_MINIMUM_LUST, 20, 4000, "This ring is topped with crimstone. It is said that this will help to keep your desires burning. ","Ring");
		public  FERTRN3:Jewelry = new Jewelry("FertRn3", "G Fert.Ring", "greater fertite ring", "an enchanted fertite ring", MODIFIER_FERTILITY, 40, 4000, "This ring is topped with fertite. It is said that this will make you more virile and fertile. ","Ring");
		public  ICE_RN3:Jewelry = new Jewelry("Ice_Rn3", "G Icst.Ring", "greater icestone ring", "an enchanted icestone ring", MODIFIER_MINIMUM_LUST, -20, 8000, "This ring is topped with icestone. It is said that this will counter ever-burning desires. ","Ring");
		public  CRITRN3:Jewelry = new Jewelry("CritRn3", "G Crit Ring", "greater ring of criticality", "an enchanted topaz ring of criticality", MODIFIER_CRITICAL, 7, 6000, "This ring is topped with topaz gemstone. It is said that this will help you to focus and exploit your opponent's weak spots, allowing you to score critical hits more often. ","Ring");
		public  REGNRN3:Jewelry = new Jewelry("RegnRn3", "G Regn.Ring", "greater ring of regeneration", "an enchanted amethyst ring of regeneration", MODIFIER_REGENERATION, 4, 8000, "This ring is topped with amethyst gemstone. It is said that this will hasten your recovery. ","Ring");
		public  LIFERN3:Jewelry = new Jewelry("LifeRn3", "G Life Ring", "greater ring of life", "an enchanted emerald ring of life force", MODIFIER_HP, 60, 4000, "This ring is topped with emerald gemstone. It is said that this will make you feel a bit healthier. ","Ring");
		public  MYSTRN3:Jewelry = new Jewelry("MystRn3", "G Mystic Ring", "greater ring of mysticality", "an enchanted sapphire ring of mysticality", MODIFIER_SPELL_POWER, 40, 6000, "This ring is topped with sapphire gemstone. It is said that this will make your spells more powerful. ","Ring");
		public  POWRRN3:Jewelry = new Jewelry("PowrRn3", "G Power Ring", "greater ring of power", "an enchanted ruby ring of power", MODIFIER_ATTACK_POWER, 12, 6000, "This ring is topped with ruby gemstone. It is said that this will make you feel a bit powerful. ","Ring");
		
		//Untiered/Special
		public  PURERNG:Jewelry = new Jewelry("PureRng", "Purity Ring", "lesser purity ring", "an enchanted diamond ring of purity", PURITY, 10, 3000, "This diamond-topped ring symbolizes chastity and purity. When worn, it reduces minimum libido and makes it harder for you to get turned on. ","Ring");
		public  LTHCRNG:Jewelry = new Jewelry("LthcRng", "Lethic.Ring", "lethicite ring", "a glowing lethicite ring", CORRUPTION, 10, 5000, "This ring appears to be made of platinum with some lethicite crystal. Very expensive as lethicite is rare. ","Ring");
		
		//Normal ring
		public  DIAMRNG:Jewelry = new Jewelry("DiamRng", "Diam Ring", "gold and diamond ring", "a shining gold and diamond ring", 0, 0, 1000, "This shining ring is made of gold and topped with diamond. Truly expensive. ","Ring");
		public  GOLDRNG:Jewelry = new Jewelry("GoldRng", "Gold Ring", "gold ring", "a shining gold ring", 0, 0, 400, "This shining ring is made of gold. ","Ring");
		public  PLATRNG:Jewelry = new Jewelry("PlatRng", "Plat Ring", "platinum ring", "a shining platinum ring", 0, 0, 1000, "This shining ring is made of platinum, one of the rare precious metals. It looks expensive! ","Ring");
		public  SILVRNG:Jewelry = new Jewelry("SilvRng", "Silver Ring", "silver ring", "a normal silver ring", 0, 0, 200, "This ring looks like it's made of silver. ","Ring");
		
		/*private static function mk(id: string,shortName: string,name: string,longName: string,effectId: number,effectMagnitude: number,value: number,description: string,type: string,perk: string=""):Jewelry {
			return new Jewelry(id,shortName,name,longName,effectId,effectMagnitude,value,description,type,perk);
		}*/
		/*private static function mk2(id: string,shortName: string,name: string,longName: string,def: number,value: number,description: string,perk: string,
				playerPerk:PerkType,playerPerkV1: number,playerPerkV2: number,playerPerkV3: number,playerPerkV4: number,playerPerkDesc: string=undefined):ArmorWithPerk{
			return new ArmorWithPerk(id,shortName,name,longName,def,value,description,perk,
					playerPerk,playerPerkV1,playerPerkV2,playerPerkV3,playerPerkV4);
		}*/
		public  JewelryLib()
		{
		}
	}

