/**
 * Created by aimozg on 09.01.14.
 */

	export class WeaponLib
	{
		public static  DEFAULT_VALUE: number = 6;

		public static  FISTS:Fists = new Fists();
		
		//Regular Weapons
		public  BLUNDR0:Weapon = new Blunderbuss(0); //Tier 0
		public  BLUNDR1:Weapon = new Blunderbuss(1); //Tier 1
		public  BLUNDR2:Weapon = new Blunderbuss(2); //Tier 2
		
		public  CLAYMR0:Weapon = new LargeClaymore(0); //Tier 0
		public  CLAYMR1:Weapon = new LargeClaymore(1); //Tier 1
		public  CLAYMR2:Weapon = new LargeClaymore(2); //Tier 2
		public  CLAYMRO:Weapon = new LargeClaymore(3, true).setDegradation(400, CLAYMR2); //Tier 3, obsidian
		
		public  CRSBOW0:Weapon = new Crossbow(0); //Tier 0
		public  CRSBOW1:Weapon = new Crossbow(1); //Tier 1
		public  CRSBOW2:Weapon = new Crossbow(2); //Tier 2
		
		public  DAGGER0:Weapon = new Dagger(0); //Tier 0
		public  DAGGER1:Weapon = new Dagger(1); //Tier 1
		public  DAGGER2:Weapon = new Dagger(2); //Tier 2
		public  DAGGERO:Weapon = new Dagger(3, true).setDegradation(200, DAGGER2); //Tier 3, obsidian
		
		public  FLAIL_0:Weapon = new Flail(0); //Tier 0
		public  FLAIL_1:Weapon = new Flail(1); //Tier 1
		public  FLAIL_2:Weapon = new Flail(2); //Tier 2
		public  FLAIL_O:Weapon = new Flail(3, true).setDegradation(200, FLAIL_2); //Tier 3, obsidian
		
		public  FLNTLK0:Weapon = new FlintlockPistol(0); //Tier 0
		public  FLNTLK1:Weapon = new FlintlockPistol(1); //Tier 1
		public  FLNTLK2:Weapon = new FlintlockPistol(2); //Tier 2
		
		public  S_GAUN0:Weapon = new SpikedGauntlet(0); //Tier 0
		public  S_GAUN1:Weapon = new SpikedGauntlet(1); //Tier 1
		public  S_GAUN2:Weapon = new SpikedGauntlet(2); //Tier 2
		public  S_GAUNO:Weapon = new SpikedGauntlet(3, true).setDegradation(200, S_GAUN2); //Tier 3, obsidian
		
		public  H_GAUN0:Weapon = new HookedGauntlet(0); //Tier 0
		public  H_GAUN1:Weapon = new HookedGauntlet(1); //Tier 1
		public  H_GAUN2:Weapon = new HookedGauntlet(2); //Tier 2
		public  H_GAUNO:Weapon = new HookedGauntlet(3, true).setDegradation(200, H_GAUN2); //Tier 3, obsidian
		
		public  HALBRD0:Weapon = new Halberd(0); //Tier 0, halberds currently restricted to Urta.
		public  HALBRD1:Weapon = new Halberd(1); //Tier 1
		public  HALBRD2:Weapon = new Halberd(2); //Tier 2
		public  HALBRDO:Weapon = new Halberd(3, true).setDegradation(200, HALBRD2); //Tier 3, obsidian
		
		public  KATANA0:Weapon = new Katana(0); //Tier 0
		public  KATANA1:Weapon = new Katana(1); //Tier 1
		public  KATANA2:Weapon = new Katana(2); //Tier 2
		public  KATANAO:Weapon = new Katana(3, true).setDegradation(200, KATANA2); //Tier 3, obsidian
		
		public  L__AXE0:Weapon = new LargeAxe(0); //Tier 0
		public  L__AXE1:Weapon = new LargeAxe(1); //Tier 1
		public  L__AXE2:Weapon = new LargeAxe(2); //Tier 2
		public  L__AXEO:Weapon = new LargeAxe(3, true).setDegradation(200, L__AXE2); //Tier 3, obsidian
		
		public  L_HAMR0:Weapon = new LargeHammer(0); //Tier 0
		public  L_HAMR1:Weapon = new LargeHammer(1); //Tier 1
		public  L_HAMR2:Weapon = new LargeHammer(2); //Tier 2
		public  L_HAMRO:Weapon = new LargeHammer(3, true).setDegradation(200, L_HAMR2); //Tier 3, obsidian
		
		public  MACE__0:Weapon = new Mace(0); //Tier 0
		public  MACE__1:Weapon = new Mace(1); //Tier 1
		public  MACE__2:Weapon = new Mace(2); //Tier 2
		public  MACE__O:Weapon = new Mace(3, true).setDegradation(200, MACE__2); //Tier 3, obsidian
		
		public  RIDING0:Weapon = new RidingCrop(0); //Tier 0
		public  RIDING1:Weapon = new RidingCrop(1); //Tier 1
		public  RIDING2:Weapon = new RidingCrop(2); //Tier 2
		
		public  SCIMTR0:Weapon = new Scimitar(0); //Tier 0
		public  SCIMTR1:Weapon = new Scimitar(1); //Tier 1
		public  SCIMTR2:Weapon = new Scimitar(2); //Tier 2
		public  SCIMTRO:Weapon = new Scimitar(3, true).setDegradation(200, SCIMTR2); //Tier 3, obsidian
		
		public  SPEAR_0:Weapon = new Spear(0); //Tier 0
		public  SPEAR_1:Weapon = new Spear(1); //Tier 1
		public  SPEAR_2:Weapon = new Spear(2); //Tier 2
		public  SPEAR_O:Weapon = new Spear(3, true).setDegradation(200, SPEAR_2); //Tier 3, obsidian
		
		public  WARHAM0:Weapon = new HugeWarhammer(0); //Tier 0
		public  WARHAM1:Weapon = new HugeWarhammer(1); //Tier 1
		public  WARHAM2:Weapon = new HugeWarhammer(2); //Tier 2
		public  WARHAMO:Weapon = new HugeWarhammer(3, true).setDegradation(200, WARHAM2); //Tier 3, obsidian
		
		public  WHIP__0:Weapon = new Whip(0); //Tier 0
		public  WHIP__1:Weapon = new Whip(1); //Tier 1
		public  WHIP__2:Weapon = new Whip(2); //Tier 2
		
		//Special, Unique Weapons
		public  BBSWORD:Weapon = new BrokenBeautifulSword(); //Pure Weapon Tier 0
		public  B_SWORD:Weapon = new BeautifulSword(); //Pure Weapon Tier 1
		public  DPSWORD:Weapon = new DivinePearlSword(); //Pure Weapon Tier 2
		
		public  B_SCARB:Weapon = new BrokenScarredBlade(); //Corrupt Weapon Tier 0
		public  U_SWORD:Weapon = new UglySword(); //Corrupt Weapon Tier 1
		public  SCARBLD:Weapon = new ScarredBlade(); //Corrupt Weapon Tier 2		
		
		public  RRAPIER:RaphaelsRapier = new RaphaelsRapier(); //Rapier Tier 1
		public  JRAPIER:JeweledRapier = new JeweledRapier(); //Rapier Tier 2
		public  MRAPIER:MidnightRapier = new MidnightRapier(); //Rapier Tier 3
		
		public  S_BLADE:Spellblade = new Spellblade(); //Spellblade Tier 1
		public  RSBLADE:RunedSpellblade = new RunedSpellblade(); //Spellblade Tier 2
		
		public  W_STAFF:WizardsStaff = new WizardsStaff(); //Staff Tier 1
		public  E_STAFF:EldritchStaff = new EldritchStaff(); //Staff Tier 2
		public  L_STAFF:LethiciteStaff = new LethiciteStaff(); //Staff Tier 3
		
		public  L_DAGR0:Weapon = new LustDagger(0); //Lust Dagger Tier 0
		public  L_DAGR1:Weapon = new LustDagger(1); //Lust Dagger Tier 1
		public  L_DAGR2:Weapon = new LustDagger(2); //Lust Dagger Tier 2
		
		//Currently not upgradable but they're special anyway.
		public  D_SPEAR:Weapon = new Weapon("D.Spear", "Drgn Spear", "dragoon spear", "a dragoon spear", "stab", 20, 2000, "A powerful-looking spear once wielded by the ancient dragons before the kobold invasion. You took this from the Kobold Broodmother in the arena.");
		public  HNTCANE:Weapon = new HuntsmansCane().setDegradation(25, undefined);
		public  KIHAAXE:Weapon = new KihasAxe();
		public  L_WHIP :Weapon = new LethicesWhip(); //Whip Tier 2
		public  SUCWHIP:Weapon = new Weapon("SucWhip","SucWhip","succubi whip","a succubi whip","sexy whipping",10,400,"This coiled length of midnight-black leather practically exudes lust. Though it looks like it could do a lot of damage, the feel of that slick leather impacting flesh is sure to inspire lust. However, it might slowly warp the mind of wielder."); //Whip Tier 1, bring masterwork whip for this one.
		
		//Unsorted Weapons
		public  PIPE   :Weapon = new Weapon("Pipe   ","Pipe","pipe","a pipe","smash",5,25,"This is a simple rusted pipe of unknown origins.  It's hefty and could probably be used as an effective bludgeoning tool.");
		public  PTCHFRK:Weapon = new Weapon("PtchFrk","Pitchfork","pitchfork","a pitchfork","stab",10,200,"This is a pitchfork.  Intended for farm work but also useful as stabbing weapon.");
		
		public  WeaponLib() {}
	}

