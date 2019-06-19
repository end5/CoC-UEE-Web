import { ComfortableUnderclothes } from "./Armors/ComfortableUnderclothes";
import { Nothing } from "./Armors/Nothing";
import { Armor } from "./Armor";
import { BimboSkirt } from "./Armors/BimboSkirt";
import { ArmorWithPerk } from "./Armors/ArmorWithPerk";
import { PerkLib } from "../PerkLib";
import { ComfortableClothes } from "./Armors/ComfortableClothes";
import { NagaSilkDress } from "./Armors/NagaSilkDress";
import { SluttySwimwear } from "./Armors/SluttySwimwear";
import { BeeArmor } from "./Armors/BeeArmor";
import { PureMaraeArmor } from "./Armors/PureMaraeArmor";
import { GooArmor } from "./Armors/GooArmor";
import { InquisitorsCorset } from "./Armors/InquisitorsCorset";
import { InquisitorsRobes } from "./Armors/InquisitorsRobes";
import { LeatherArmorSegments } from "./Armors/LeatherArmorSegments";
import { LustyMaidensArmor } from "./Armors/LustyMaidensArmor";
import { LethiciteArmor } from "./Armors/LethiciteArmor";
import { MaraeArmor } from "./Armors/MaraeArmor";
import { SeductiveArmor } from "./Armors/SeductiveArmor";
import { SeductiveArmorUntrapped } from "./Armors/SeductiveArmorUntrapped";
import { Gown } from "./Armors/Gown";

/**
 * Created by aimozg on 10.01.14.
 */

export class ArmorLib {
    public static COMFORTABLE_UNDERCLOTHES = new ComfortableUnderclothes();
    public static NOTHING = new Nothing();

    // Clothing
    public ADVCLTH = new Armor("AdvClth", "G. Clothes", "green adventurer's clothes", "a green adventurer's outfit, complete with pointed cap", 2, 200, "A set of comfortable green adventurer's clothes.  It even comes complete with a pointy hat!", "Light");
    public B_DRESS = new Armor("B.Dress", "Long Dress", "long ballroom dress patterned with sequins", "a ballroom dress patterned with sequins", 0, 1200, "A long ballroom dress patterned with sequins.  Perfect for important occasions.", "Medium");
    public BIMBOSK = new BimboSkirt();
    public BONSTRP = new ArmorWithPerk("BonStrp", "BonStrp", "barely-decent bondage straps", "a set of bondage straps", 0, 600, "These leather straps and well-placed hooks are actually designed in such a way as to be worn as clothing.  While they technically would cover your naughty bits, virtually every other inch of your body would be exposed.", "Light",
        PerkLib.SluttySeduction, 10, 0, 0, 0, "Your fetishy bondage outfit allows you access to an improved form of 'Tease'.", undefined, 0, 0, 0, 0, "", false, false);
    public C_CLOTH = new ComfortableClothes();
    public CLSSYCL = new Armor("ClssyCl", "Suitclothes", "classy suitclothes", "a set of classy suit-clothes", 1, 400, "A set of classy suitclothes.", "Light");
    public KIMONO = new Armor("Kimono ", "Kimono ", "kimono", "a traditional kimono", 2, 500, "This is a type of robes also known as kimono traditionally worn by the people of the far East. It's pretty elegant.", "Light");
    public LTHRPNT = new Armor("LthrPnt", "T.Lthr Pants", "white silk shirt and tight leather pants", "a pair of leather pants and a white silk shirt", 0, 450, "A flowing silk shirt and tight black leather pants.  Suave!", "Light");
    public M_ROBES = new Armor("M.Robes", "Robes", "modest robes", "a set of modest robes", 0, 120, "A set of modest robes, not dissimilar from what the monks back home would wear.", "Light");
    public NAGASLK = new NagaSilkDress();
    public NURSECL = new ArmorWithPerk("NurseCl", "NurseCl", "skimpy nurse's outfit", "a nurse's outfit", 0, 800, "This borderline obscene nurse's outfit would barely cover your hips and crotch.  The midriff is totally exposed, and the white top leaves plenty of room for cleavage.  A tiny white hat tops off the whole ensemble.  It would grant a small regeneration to your HP.", "Light",
        PerkLib.SluttySeduction, 8, 0, 0, 0, "Your fetishy nurse outfit allows you access to an improved form of 'Tease'.");
    public OVERALL = new Armor("Overall", "Overalls", "white shirt and overalls", "a white shirt and overalls", 0, 60, "A simple white shirt and overalls.", "Light", true);
    public R_BDYST = new Armor("R.BdySt", "R.BdySt", "red, high-society bodysuit", "a red bodysuit for high society", 1, 1200, "A high society bodysuit. It is as easy to mistake it for ballroom apparel as it is for boudoir lingerie. The thin transparent fabric is so light and airy that it makes avoiding blows a second nature.", "Light", true, false);
    public RBBRCLT = new ArmorWithPerk("RbbrClt", "Rbbr Fetish", "rubber fetish clothes", "a set of revealing rubber fetish clothes", 3, 1000, "A revealing set of fetish-wear.  Upgrades your tease attack with the \"Slutty Seduction\" perk.", "Light",
        PerkLib.SluttySeduction, 8, 0, 0, 0, "Your fetishy rubberwear allows you access to 'Seduce', an improved form of 'Tease'.", undefined, 0, 0, 0, 0, "", true, false);
    public S_SWMWR = new SluttySwimwear();
    public T_BSUIT = new ArmorWithPerk("T.BSuit", "Bodysuit", "semi-transparent bodysuit", "a semi-transparent, curve-hugging bodysuit", 0, 1300, "A semi-transparent bodysuit. It looks like it will cling to all the curves of your body.", "Light",
        PerkLib.SluttySeduction, 7, 0, 0, 0, "Your clingy transparent bodysuit allows you access to 'Seduce', an improved form of 'Tease'.");
    public TUBETOP = new Armor("TubeTop", "Tube Top", "tube top and short shorts", "a snug tube top and VERY short shorts", 0, 80, "A clingy tube top and VERY short shorts.", "Light");

    // Armour
    public BEEARMR = new BeeArmor();
    public CHBIKNI = new ArmorWithPerk("ChBikni", "Chn Bikini", "revealing chainmail bikini", "a chainmail bikini", 2, 700, "A revealing chainmail bikini that barely covers anything.  The bottom half is little more than a triangle of metal and a leather thong.", "Light",
        PerkLib.SluttySeduction, 5, 0, 0, 0, "Your revealing chain bikini allows you access to 'Seduce', an improved form of 'Tease'.", undefined, 0, 0, 0, 0, "", false, false);
    public DBARMOR = new PureMaraeArmor();
    public DSCLARM = new Armor("DSclArm", "D.Scale Armor", "dragonscale armor", "a suit of dragonscale armor", 18, 900, "This armor is cleverly fashioned from dragon scales. It offers high protection while at the same time, quite flexible.", "Medium");
    public DSCLROB = new ArmorWithPerk("DSclRob", "D.Scale Robes", "dragonscale robes", "a dragonscale robes", 9, 900, "This robe is expertly made from dragon scales. It offers high protection while being lightweight and should be comfortable to wear all day.", "Light",
        PerkLib.WizardsEndurance, 20, 0, 0, 0);
    public EBNARMR = new ArmorWithPerk("EWPlate", "EW Plate", "Ebonweave Platemail", "a set of Ebonweave Platemail", 27, 3000, "The armor is made of ebonweave, created using refined Ebonbloom petals. The armor consists of two layers: an outer of ebonweave plating and an inner of arrow-proof ebonweave cloth.", "Heavy",
        PerkLib.WizardsEndurance, 15, 0, 0, 0);
    public EBNJACK = new ArmorWithPerk("EWJackt", "EW Jacket", "Ebonweave Jacket", "an Ebonweave Jacket", 18, 3000, "This outfit is made of ebonweave, created using refined Ebonbloom petals. The outfit consists of a leather-like jacket, a mesh breastplate, and a set of arrow-proof clothing.", "Medium",
        PerkLib.WizardsEndurance, 15, 0, 0, 0);
    public EBNROBE = new ArmorWithPerk("EW Robe", "EW Robe", "Ebonweave Robe", "an Ebonweave Robe", 9, 3000, "This robe is made of ebonweave, a material created using refined Ebonbloom petals. This robe is comfortable, yet more protective than chainmail. It has a mystical aura to it.", "Medium",
        PerkLib.WizardsEndurance, 30, 0, 0, 0);
    public EBNIROB = new ArmorWithPerk("EWIRobe", "EW I.Robe", "indecent Ebonweave Robe", "an indecent Ebonweave Robe", 6, 3000, "More of a longcoat than a robe, this outfit is crafted from refined Ebonbloom petals. Discrete straps centered around the belt keep the front open.", "Light",
        PerkLib.WizardsEndurance, 30, 0, 0, 0, "",
        PerkLib.SluttySeduction, 5, 0, 0, 0, "Your revealing robes allow you access to 'Seduce', an improved form of 'Tease'.", true);
    public FULLCHN = new Armor("FullChn", "Full Chain", "full-body chainmail", "a full suit of chainmail armor", 8, 150, "This full suit of chainmail armor covers its wearer from head to toe in protective steel rings.", "Medium");
    public FULLPLT = new Armor("FullPlt", "Full Plate", "full platemail", "a suit of full-plate armor", 21, 250, "A highly protective suit of steel platemail.  It would be hard to find better physical protection than this.", "Heavy");
    public GELARMR = new Armor("GelArmr", "GelArmr", "glistening gel-armor plates", "a suit of gel armor", 10, 150, "This suit of interlocking plates is made from a strange green material.  It feels spongy to the touch but is amazingly resiliant.", "Heavy");
    public GOOARMR = new GooArmor();
    public I_CORST = new InquisitorsCorset();
    public I_ROBES = new InquisitorsRobes();
    public INDECST = new ArmorWithPerk("IndecSt", "Indec StAr", "practically indecent steel armor", "a suit of practically indecent steel armor", 5, 800, "This suit of steel 'armor' has two round disks that barely cover the nipples, a tight chainmail bikini, and circular butt-plates.", "Medium",
        PerkLib.SluttySeduction, 6, 0, 0, 0, "Your incredibly revealing steel armor allows you access to 'Seduce', an improved form of 'Tease'.");
    public LEATHRA = new Armor("LeathrA", "LeathrA", "leather armor segments", "a set of leather armor", 5, 76, "This is a suit of well-made leather armor.  It looks fairly rugged.", "Light");
    public URTALTA = new LeatherArmorSegments();
    public LMARMOR = new LustyMaidensArmor();
    public LTHCARM = new LethiciteArmor();
    public LTHRROB = new Armor("LthrRob", "Lthr Robes", "black leather armor surrounded by voluminous robes", "a suit of black leather armor with voluminous robes", 6, 100, "This is a suit of flexible leather armor with a voluminous set of concealing black robes.", "Light");
    public TBARMOR = new MaraeArmor();
    public SAMUARM = new Armor("SamuArm", "Samu.Armor", "samurai armor", "a suit of samurai armor", 18, 300, "This suit of armor is originally worn by the Samurai, the warriors from the far East.", "Heavy");
    public SCALEML = new Armor("ScaleMl", "Scale Mail", "scale-mail armor", "a set of scale-mail armor", 12, 170, "This suit of scale-mail covers the entire body with layered steel scales, providing flexibility and protection.", "Heavy");
    public SEDUCTA = new SeductiveArmor();
    public SEDUCTU = new SeductiveArmorUntrapped();
    public SS_ROBE = new ArmorWithPerk("SS.Robe", "SS.Robes", "spider-silk robes", "a spider-silk robes", 6, 950, "This robe looks incredibly comfortable.  It's made from alchemically enhanced spider-silk, and embroidered with what looks like magical glyphs around the sleeves and hood.", "Light",
        PerkLib.WizardsEndurance, 30, 0, 0, 0);
    public SSARMOR = new Armor("SSArmor", "SS.Armor", "spider-silk armor", "a suit of spider-silk armor", 25, 950, "This armor is as white as the driven snow.  It's crafted out of thousands of strands of spider-silk into an impenetrable protective suit.  The surface is slightly spongy, but so tough you wager most blows would bounce right off.", "Heavy");
    public W_ROBES = new ArmorWithPerk("W.Robes", "W.Robes", "wizard's robes", "a wizard's robes", 1, 50, "These robes appear to have once belonged to a female wizard.  They're long with a slit up the side and full billowing sleeves.  The top is surprisingly low cut.  Somehow you know wearing it would aid your spellcasting.", "Light",
        PerkLib.WizardsEndurance, 25, 0, 0, 0);
    public FRSGOWN = new Gown();
}
