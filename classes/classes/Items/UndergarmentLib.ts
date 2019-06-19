import { Nothing } from "./Undergarments/Nothing";
import { Undergarment } from "./Undergarment";
import { UndergarmentWithPerk } from "./Undergarments/UndergarmentWithPerk";
import { PerkLib } from "../PerkLib";

/**
 * ...
 * @author Kitteh6660
 */

export class UndergarmentLib {
    public static DEFAULT_VALUE: number = 6;

    public static TYPE_UPPERWEAR: number = 0;
    public static TYPE_LOWERWEAR: number = 1;
    public static TYPE_FULLWEAR: number = 2;

    // public static const COMFORTABLE_UNDERCLOTHES:Undergarment = new ComfortableUnderclothes();
    public static NOTHING = new Nothing();

    // Upper
    public C_BRA = new Undergarment("C. Bra ", "C. Bra", "comfortable bra", "a pair of comfortable bra", UndergarmentLib.TYPE_UPPERWEAR, UndergarmentLib.DEFAULT_VALUE, "A generic pair of bra.");
    public DS_BRA = new Undergarment("DS. Bra", "D.Scale Bra", "dragonscale bra", "a pair of dragonscale bra", UndergarmentLib.TYPE_UPPERWEAR, 360, "This bra appears to be made of dragon scale. It's held together with leather straps for flexibility. Great for those on the primal side!");
    public LTX_BRA = new Undergarment("Ltx.Bra", "Latex Bra", "latex bra", "a pair of latex bra", UndergarmentLib.TYPE_UPPERWEAR, 250, "This bra is black and shiny, obviously made of latex. It's designed to fit snugly against your breasts.");
    public SS_BRA = new Undergarment("SS. Bra", "S.Silk Bra", "spider-silk bra", "a pair of spider-silk bra", UndergarmentLib.TYPE_UPPERWEAR, 1000, "This bra looks incredibly comfortable. It's as white as snow and finely woven with hundreds of strands of spider silk.");
    public EBNVEST = new Undergarment("EW Vest", "EW Vest", "Ebonweave vest", "an Ebonweave vest", UndergarmentLib.TYPE_UPPERWEAR, 900, "This vest is made of ebonweave, created using refined Ebonbloom petals. Elastic, form-fitting, and somewhat transparent, this comfortable vest will display your curves, masculine or feminine.");
    public EBNCRST = new Undergarment("EW Crst", "EW Corset", "Ebonweave corset", "an Ebonweave corset", UndergarmentLib.TYPE_UPPERWEAR, 900, "This corset is made of ebonweave, created using refined Ebonbloom petals. The ebonweave is elastic, making the corset surprisingly comfortable to wear, while displaying your bust down to the most subtle curves.");

    // Lower
    public C_LOIN = new Undergarment("C. Loin", "C. Loin", "comfortable loincloth", "a pair of comfortable loincloth", UndergarmentLib.TYPE_LOWERWEAR, UndergarmentLib.DEFAULT_VALUE, "A generic pair of loincloth.", "NagaWearable");
    public C_PANTY = new Undergarment("C.Panty", "C.Panties", "comfortable panties", "a pair of comfortable panties", UndergarmentLib.TYPE_LOWERWEAR, UndergarmentLib.DEFAULT_VALUE, "A generic pair of panties.");
    public DS_LOIN = new Undergarment("DS.Loin", "D.Scale Loin", "dragonscale loincloth", "a dragonscale loincloth", UndergarmentLib.TYPE_LOWERWEAR, 360, "This loincloth appears to be made of dragonscale and held together with a leather strap that goes around your waist. Great for those on the wild side!", "NagaWearable");
    public DSTHONG = new Undergarment("DSPanty", "D.Scale Thong", "dragonscale thong", "a pair of dragonscale thong", UndergarmentLib.TYPE_LOWERWEAR, 360, "This thong appears to be made of dragonscale and held together with a leather strap that goes around your waist. Great for those on the wild side!");
    public FUNDOSH = new Undergarment("Fundosh", "Fundoshi", "fundoshi", "a fundoshi", UndergarmentLib.TYPE_LOWERWEAR, 20, "This Japanese-styled undergarment resembles a cross between a thong and a loincloth.");
    public FURLOIN = new Undergarment("FurLoin", "FurLoin", "fur loincloth", "a front and back set of loincloths", UndergarmentLib.TYPE_LOWERWEAR, UndergarmentLib.DEFAULT_VALUE, "A pair of loincloths to cover your crotch and butt.  Typically worn by people named 'Conan'. ", "NagaWearable");
    public GARTERS = new Undergarment("Garters", "Garters", "stockings and garters", "a pair of stockings and garters", UndergarmentLib.TYPE_LOWERWEAR, UndergarmentLib.DEFAULT_VALUE, "These pairs of stockings, garters and lingerie are perfect for seducing your partner!");
    public LTXSHRT = new Undergarment("LtxShrt", "LatexShorts", "latex shorts", "a pair of latex shorts", UndergarmentLib.TYPE_LOWERWEAR, 300, "These shorts are black and shiny, obviously made of latex. It's designed to fit snugly against your form.");
    public LTXTHNG = new Undergarment("LtxThng", "LatexThong", "latex thong", "a pair of latex thong", UndergarmentLib.TYPE_LOWERWEAR, 300, "This thong is black and shiny, obviously made of latex. It's designed to fit snugly against your form.");
    public SS_LOIN = new Undergarment("SS.Loin", "S.Silk Loin", "spider-silk loincloth", "a spider-silk loincloth", UndergarmentLib.TYPE_LOWERWEAR, 1000, "This loincloth looks incredibly comfortable. It's as white as snow and finely woven with hundreds of strands of spider silk.", "NagaWearable");
    public SSPANTY = new Undergarment("SSPanty", "S.Silk Panty", "spider-silk panties", "a pair of spider-silk panties", UndergarmentLib.TYPE_LOWERWEAR, 1000, "These panties look incredibly comfortable. It's as white as snow and finely woven with hundreds of strands of spider silk.");
    public EBNJOCK = new Undergarment("EWStrap", "Ebon Jock", "Ebonweave jockstrap", "an Ebonweave jockstrap", UndergarmentLib.TYPE_LOWERWEAR, 900, "This jock is ebonweave, made of refined Ebonbloom petals. It’s comfortable and elastic, providing support while containing assets of any size.");
    public EBNTHNG = new Undergarment("EWThong", "Ebon Thong", "Ebonweave thong", "an Ebonweave thong", UndergarmentLib.TYPE_LOWERWEAR, 900, "This thong is made of ebonweave, designed to fit snugly around your form. Thanks to alchemic treatments, it’s elastic enough to hold assets of any size.");
    public EBNCLTH = new Undergarment("EWCloth", "Ebon Loin", "Ebonweave loincloth", "an Ebonweave loincloth", UndergarmentLib.TYPE_LOWERWEAR, 900, "This loincloth is made of ebonweave, designed to fit snugly around your form. Thanks to alchemic treatments, it’s elastic enough to hold assets of any size.", "NagaWearable");
    public EBNRJCK = new UndergarmentWithPerk("RnStrap", "Rune Jock", "runed Ebonweave jockstrap", "a runed Ebonweave jockstrap", UndergarmentLib.TYPE_LOWERWEAR, 1200, "This jock is ebonweave, made of refined Ebonbloom petals. Adorning the pouch is a rune of lust, glowing with dark magic.",
        PerkLib.WellspringOfLust, 0, 0, 0, 0, "At the beginning of combat, lust raises to black magic threshold if lust is below black magic threshold.");
    public EBNRTNG = new UndergarmentWithPerk("RnThong", "Rune Thong", "runed Ebonweave thong", "a runed Ebonweave thong", UndergarmentLib.TYPE_LOWERWEAR, 1200, "This thong is made of ebonweave, designed to fit snugly around your form. Adorning the front is a rune of lust, glowing with dark magic.",
        PerkLib.WellspringOfLust, 0, 0, 0, 0, "At the beginning of combat, lust raises to black magic threshold if lust is below black magic threshold.");
    public EBNRLNC = new UndergarmentWithPerk("RnCloth", "Rune Loin", "runed Ebonweave loincloth", "a runed Ebonweave loincloth", UndergarmentLib.TYPE_LOWERWEAR, 1200, "This loincloth is made of ebonweave, designed to fit snugly around your form. Adorning the front is a rune of lust, glowing with dark magic.",
        PerkLib.WellspringOfLust, 0, 0, 0, 0, "At the beginning of combat, lust raises to black magic threshold if lust is below black magic threshold.", "NagaWearable");

}
