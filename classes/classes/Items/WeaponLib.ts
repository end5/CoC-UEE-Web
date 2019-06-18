import { Fists } from "./Weapons/Fists";
import { Blunderbuss } from "./Weapons/Blunderbuss";
import { LargeClaymore } from "./Weapons/LargeClaymore";
import { Crossbow } from "./Weapons/Crossbow";
import { Dagger } from "./Weapons/Dagger";
import { Flail } from "./Weapons/Flail";
import { FlintlockPistol } from "./Weapons/FlintlockPistol";
import { SpikedGauntlet } from "./Weapons/SpikedGauntlet";
import { HookedGauntlet } from "./Weapons/HookedGauntlet";
import { Halberd } from "./Weapons/Halberd";
import { Katana } from "./Weapons/Katana";
import { LargeAxe } from "./Weapons/LargeAxe";
import { LargeHammer } from "./Weapons/LargeHammer";
import { Mace } from "./Weapons/Mace";
import { RidingCrop } from "./Weapons/RidingCrop";
import { Scimitar } from "./Weapons/Scimitar";
import { Spear } from "./Weapons/Spear";
import { HugeWarhammer } from "./Weapons/HugeWarhammer";
import { Whip } from "./Weapons/Whip";
import { BrokenBeautifulSword } from "./Weapons/BrokenBeautifulSword";
import { BeautifulSword } from "./Weapons/BeautifulSword";
import { DivinePearlSword } from "./Weapons/DivinePearlSword";
import { BrokenScarredBlade } from "./Weapons/BrokenScarredBlade";
import { UglySword } from "./Weapons/UglySword";
import { ScarredBlade } from "./Weapons/ScarredBlade";
import { RaphaelsRapier } from "./Weapons/RaphaelsRapier";
import { JeweledRapier } from "./Weapons/JeweledRapier";
import { MidnightRapier } from "./Weapons/MidnightRapier";
import { Spellblade } from "./Weapons/Spellblade";
import { RunedSpellblade } from "./Weapons/RunedSpellblade";
import { WizardsStaff } from "./Weapons/WizardsStaff";
import { EldritchStaff } from "./Weapons/EldritchStaff";
import { LethiciteStaff } from "./Weapons/LethiciteStaff";
import { LustDagger } from "./Weapons/LustDagger";
import { Weapon } from "./Weapon";
import { HuntsmansCane } from "./Weapons/HuntsmansCane";
import { KihasAxe } from "./Weapons/KihasAxe";
import { LethicesWhip } from "./Weapons/LethicesWhip";

/**
 * Created by aimozg on 09.01.14.
 */

export class WeaponLib {
    public static DEFAULT_VALUE: number = 6;

    public static FISTS = new Fists();

    // Regular Weapons
    public BLUNDR0 = new Blunderbuss(0); // Tier 0
    public BLUNDR1 = new Blunderbuss(1); // Tier 1
    public BLUNDR2 = new Blunderbuss(2); // Tier 2

    public CLAYMR0 = new LargeClaymore(0); // Tier 0
    public CLAYMR1 = new LargeClaymore(1); // Tier 1
    public CLAYMR2 = new LargeClaymore(2); // Tier 2
    public CLAYMRO = new LargeClaymore(3, true).setDegradation(400, this.CLAYMR2); // Tier 3, obsidian

    public CRSBOW0 = new Crossbow(0); // Tier 0
    public CRSBOW1 = new Crossbow(1); // Tier 1
    public CRSBOW2 = new Crossbow(2); // Tier 2

    public DAGGER0 = new Dagger(0); // Tier 0
    public DAGGER1 = new Dagger(1); // Tier 1
    public DAGGER2 = new Dagger(2); // Tier 2
    public DAGGERO = new Dagger(3, true).setDegradation(200, this.DAGGER2); // Tier 3, obsidian

    public FLAIL_0 = new Flail(0); // Tier 0
    public FLAIL_1 = new Flail(1); // Tier 1
    public FLAIL_2 = new Flail(2); // Tier 2
    public FLAIL_O = new Flail(3, true).setDegradation(200, this.FLAIL_2); // Tier 3, obsidian

    public FLNTLK0 = new FlintlockPistol(0); // Tier 0
    public FLNTLK1 = new FlintlockPistol(1); // Tier 1
    public FLNTLK2 = new FlintlockPistol(2); // Tier 2

    public S_GAUN0 = new SpikedGauntlet(0); // Tier 0
    public S_GAUN1 = new SpikedGauntlet(1); // Tier 1
    public S_GAUN2 = new SpikedGauntlet(2); // Tier 2
    public S_GAUNO = new SpikedGauntlet(3, true).setDegradation(200, this.S_GAUN2); // Tier 3, obsidian

    public H_GAUN0 = new HookedGauntlet(0); // Tier 0
    public H_GAUN1 = new HookedGauntlet(1); // Tier 1
    public H_GAUN2 = new HookedGauntlet(2); // Tier 2
    public H_GAUNO = new HookedGauntlet(3, true).setDegradation(200, this.H_GAUN2); // Tier 3, obsidian

    public HALBRD0 = new Halberd(0); // Tier 0, halberds currently restricted to Urta.
    public HALBRD1 = new Halberd(1); // Tier 1
    public HALBRD2 = new Halberd(2); // Tier 2
    public HALBRDO = new Halberd(3, true).setDegradation(200, this.HALBRD2); // Tier 3, obsidian

    public KATANA0 = new Katana(0); // Tier 0
    public KATANA1 = new Katana(1); // Tier 1
    public KATANA2 = new Katana(2); // Tier 2
    public KATANAO = new Katana(3, true).setDegradation(200, this.KATANA2); // Tier 3, obsidian

    public L__AXE0 = new LargeAxe(0); // Tier 0
    public L__AXE1 = new LargeAxe(1); // Tier 1
    public L__AXE2 = new LargeAxe(2); // Tier 2
    public L__AXEO = new LargeAxe(3, true).setDegradation(200, this.L__AXE2); // Tier 3, obsidian

    public L_HAMR0 = new LargeHammer(0); // Tier 0
    public L_HAMR1 = new LargeHammer(1); // Tier 1
    public L_HAMR2 = new LargeHammer(2); // Tier 2
    public L_HAMRO = new LargeHammer(3, true).setDegradation(200, this.L_HAMR2); // Tier 3, obsidian

    public MACE__0 = new Mace(0); // Tier 0
    public MACE__1 = new Mace(1); // Tier 1
    public MACE__2 = new Mace(2); // Tier 2
    public MACE__O = new Mace(3, true).setDegradation(200, this.MACE__2); // Tier 3, obsidian

    public RIDING0 = new RidingCrop(0); // Tier 0
    public RIDING1 = new RidingCrop(1); // Tier 1
    public RIDING2 = new RidingCrop(2); // Tier 2

    public SCIMTR0 = new Scimitar(0); // Tier 0
    public SCIMTR1 = new Scimitar(1); // Tier 1
    public SCIMTR2 = new Scimitar(2); // Tier 2
    public SCIMTRO = new Scimitar(3, true).setDegradation(200, this.SCIMTR2); // Tier 3, obsidian

    public SPEAR_0 = new Spear(0); // Tier 0
    public SPEAR_1 = new Spear(1); // Tier 1
    public SPEAR_2 = new Spear(2); // Tier 2
    public SPEAR_O = new Spear(3, true).setDegradation(200, this.SPEAR_2); // Tier 3, obsidian

    public WARHAM0 = new HugeWarhammer(0); // Tier 0
    public WARHAM1 = new HugeWarhammer(1); // Tier 1
    public WARHAM2 = new HugeWarhammer(2); // Tier 2
    public WARHAMO = new HugeWarhammer(3, true).setDegradation(200, this.WARHAM2); // Tier 3, obsidian

    public WHIP__0 = new Whip(0); // Tier 0
    public WHIP__1 = new Whip(1); // Tier 1
    public WHIP__2 = new Whip(2); // Tier 2

    // Special, Unique Weapons
    public BBSWORD = new BrokenBeautifulSword(); // Pure Weapon Tier 0
    public B_SWORD = new BeautifulSword(); // Pure Weapon Tier 1
    public DPSWORD = new DivinePearlSword(); // Pure Weapon Tier 2

    public B_SCARB = new BrokenScarredBlade(); // Corrupt Weapon Tier 0
    public U_SWORD = new UglySword(); // Corrupt Weapon Tier 1
    public SCARBLD = new ScarredBlade(); // Corrupt Weapon Tier 2

    public RRAPIER: RaphaelsRapier = new RaphaelsRapier(); // Rapier Tier 1
    public JRAPIER: JeweledRapier = new JeweledRapier(); // Rapier Tier 2
    public MRAPIER: MidnightRapier = new MidnightRapier(); // Rapier Tier 3

    public S_BLADE: Spellblade = new Spellblade(); // Spellblade Tier 1
    public RSBLADE: RunedSpellblade = new RunedSpellblade(); // Spellblade Tier 2

    public W_STAFF: WizardsStaff = new WizardsStaff(); // Staff Tier 1
    public E_STAFF: EldritchStaff = new EldritchStaff(); // Staff Tier 2
    public L_STAFF: LethiciteStaff = new LethiciteStaff(); // Staff Tier 3

    public L_DAGR0 = new LustDagger(0); // Lust Dagger Tier 0
    public L_DAGR1 = new LustDagger(1); // Lust Dagger Tier 1
    public L_DAGR2 = new LustDagger(2); // Lust Dagger Tier 2

    // Currently not upgradable but they're special anyway.
    public D_SPEAR = new Weapon("D.Spear", "Drgn Spear", "dragoon spear", "a dragoon spear", "stab", 20, 2000, "A powerful-looking spear once wielded by the ancient dragons before the kobold invasion. You took this from the Kobold Broodmother in the arena.");
    public HNTCANE = new HuntsmansCane().setDegradation(25, undefined);
    public KIHAAXE = new KihasAxe();
    public L_WHIP = new LethicesWhip(); // Whip Tier 2
    public SUCWHIP = new Weapon("SucWhip", "SucWhip", "succubi whip", "a succubi whip", "sexy whipping", 10, 400, "This coiled length of midnight-black leather practically exudes lust. Though it looks like it could do a lot of damage, the feel of that slick leather impacting flesh is sure to inspire lust. However, it might slowly warp the mind of wielder."); // Whip Tier 1, bring masterwork whip for this one.

    // Unsorted Weapons
    public PIPE = new Weapon("Pipe   ", "Pipe", "pipe", "a pipe", "smash", 5, 25, "This is a simple rusted pipe of unknown origins.  It's hefty and could probably be used as an effective bludgeoning tool.");
    public PTCHFRK = new Weapon("PtchFrk", "Pitchfork", "pitchfork", "a pitchfork", "stab", 10, 200, "This is a pitchfork.  Intended for farm work but also useful as stabbing weapon.");
}
