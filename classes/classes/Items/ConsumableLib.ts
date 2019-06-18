/**
 * Created by aimozg on 10.01.14.
 */

	export class ConsumableLib extends BaseContent {
//		public var consumableItems: any[] = [];
		public static  DEFAULT_VALUE: number = 6;
//		DEMONIC POTIONS
		//Tainted
		public  INCUBID:Consumable = new IncubiDraft(IncubiDraft.TAINTED);
		public  S_DREAM:Consumable = new SuccubisDream();
		public  SDELITE:Consumable = new SuccubisDelight(SuccubisDelight.TAINTED);
		public  SUCMILK:Consumable = new SuccubiMilk(SuccubiMilk.TAINTED);
		//Untainted
		public  P_DRAFT:Consumable = new IncubiDraft(IncubiDraft.PURIFIED);
		public  P_S_MLK:Consumable = new SuccubiMilk(SuccubiMilk.PURIFIED);
		public  PSDELIT:Consumable = new SuccubisDelight(SuccubisDelight.PURIFIED);
//		DYES
		public  AUBURND:HairDye = new HairDye("AuburnD", "Auburn");
		public  BLACK_D:HairDye = new HairDye("Black D", "Black");
		public  BLOND_D:HairDye = new HairDye("Blond D", "Blond");
		public  BLUEDYE:HairDye = new HairDye("BlueDye", "Blue");
		public  BROWN_D:HairDye = new HairDye("Brown D", "Brown");
		public  GRAYDYE:HairDye = new HairDye("GrayDye", "Gray");
		public  GREEN_D:HairDye = new HairDye("Green D", "Green");
		public  ORANGDY:HairDye = new HairDye("OrangDy", "Orange");
		public  PINKDYE:HairDye = new HairDye("PinkDye", "Pink");
		public  PURPDYE:HairDye = new HairDye("PurpDye", "Purple");
		public  RAINDYE:HairDye = new HairDye("RainDye", "Rainbow");
		public  RED_DYE:HairDye = new HairDye("Red Dye", "Red");
		public  RUSSDYE:HairDye = new HairDye("RussetD", "Russet");
		public  YELLODY:HairDye = new HairDye("YelloDy", "Yellow");
		public  WHITEDY:HairDye = new HairDye("WhiteDy", "White");
//		SKIN OILS
		public  DARK_OL:SkinOil = new SkinOil("DarkOil", "Dark");
		public  EBONYOL:SkinOil = new SkinOil("EbonyOl", "Ebony");
		public  FAIR_OL:SkinOil = new SkinOil("FairOil", "Fair");
		public  LIGHTOL:SkinOil = new SkinOil("LightOl", "Light");
		public  MAHOGOL:SkinOil = new SkinOil("MahogOl", "Mahogany");
		public  OLIVEOL:SkinOil = new SkinOil("OliveOl", "Olive");
		public  RUSS_OL:SkinOil = new SkinOil("RussOil", "Russet");
		public  RED__OL:SkinOil = new SkinOil("Red Oil", "Red");
		public  ORANGOL:SkinOil = new SkinOil("OranOil", "Orange");
		public  YELLOOL:SkinOil = new SkinOil("YeloOil", "Yellow");
		public  GREENOL:SkinOil = new SkinOil("GrenOil", "Green");
		public  WHITEOL:SkinOil = new SkinOil("WhitOil", "White");
		public  BLUE_OL:SkinOil = new SkinOil("BlueOil", "Blue");
		public  BLACKOL:SkinOil = new SkinOil("BlakOil", "Black");
		public  PURPLOL:SkinOil = new SkinOil("PurpOil", "Purple");
		public  SILVROL:SkinOil = new SkinOil("SlvrOil", "Silver");
		public  YELGROL:SkinOil = new SkinOil("YlGrOil", "Yellow Green");
		public  SPRGROL:SkinOil = new SkinOil("SpGrOil", "Spring Green");
		public  CYAN_OL:SkinOil = new SkinOil("CyanOil", "Cyan");
		public  OCBLUOL:SkinOil = new SkinOil("OBluOil", "Ocean Blue");
		public  ELVIOOL:SkinOil = new SkinOil("EVioOil", "Electric Violet");
		public  MAGENOL:SkinOil = new SkinOil("MagenOl", "Magenta");
		public  DPPNKOL:SkinOil = new SkinOil("DPnkOil", "Deep Pink");
		public  PINK_OL:SkinOil = new SkinOil("PinkOil", "Pink");
//		BODY LOTIONS
		public  CLEARLN:BodyLotion = new BodyLotion("ClearLn", "Clear", "smooth thick creamy liquid");
		public  ROUGHLN:BodyLotion = new BodyLotion("RoughLn", "Rough", "thick abrasive cream");
		public  SEXY_LN:BodyLotion = new BodyLotion("SexyLtn", "Sexy", "pretty cream like substance");
		public  SMTH_LN:BodyLotion = new BodyLotion("SmthLtn", "Smooth", "smooth thick creamy liquid");
//		EGGS
		//Small
		public  BLACKEG:Consumable = new BlackRubberEgg(BlackRubberEgg.SMALL);
		public  BLUEEGG:Consumable = new BlueEgg(BlueEgg.SMALL);
		public  BROWNEG:Consumable = new BrownEgg(BrownEgg.SMALL);
		public  PINKEGG:Consumable = new PinkEgg(PinkEgg.SMALL);
		public  PURPLEG:Consumable = new PurpleEgg(PurpleEgg.SMALL);
		public  WHITEEG:Consumable = new WhiteEgg(WhiteEgg.SMALL);
		//Large
		public  L_BLKEG:Consumable = new BlackRubberEgg(BlackRubberEgg.LARGE);
		public  L_BLUEG:Consumable = new BlueEgg(BlueEgg.LARGE);
		public  L_BRNEG:Consumable = new BrownEgg(BrownEgg.LARGE);
		public  L_PNKEG:Consumable = new PinkEgg(PinkEgg.LARGE);
		public  L_PRPEG:Consumable = new PurpleEgg(PurpleEgg.LARGE);
		public  L_WHTEG:Consumable = new WhiteEgg(WhiteEgg.LARGE);
		//Others
		public  DRGNEGG:Consumable = new EmberEgg();
		public  NPNKEGG:NeonPinkEgg = new NeonPinkEgg();

//		FOOD & BEVERAGES
		public  BC_BEER:BlackCatBeer = new BlackCatBeer();
		public  BHMTCUM:Consumable = new BehemothCum();
		public  BIMBOCH:BimboChampagne = new BimboChampagne();
		public  C_BREAD:Consumable = new CumBread();
		public  CCUPCAK:Consumable = new GiantChocolateCupcake();
		public  FISHFIL:Consumable = new FishFillet();
		public  FR_BEER:Consumable = new FrothyBeer();
		public  GODMEAD:Consumable = new GodMead();
		public  H_BISCU:Consumable = new HardBiscuits();
		public  IZYMILK:Consumable = new IsabellaMilk();
		public  M__MILK:Consumable = new MarbleMilk();
		public  MINOCUM:Consumable = new MinotaurCum(MinotaurCum.STANDARD);
		public  P_BREAD:Consumable = new PrisonBread();
		public  P_M_CUM:Consumable = new MinotaurCum(MinotaurCum.PURIFIED);
		public  P_WHSKY:PhoukaWhiskey = new PhoukaWhiskey();
		public  PROMEAD:Consumable = new ProMead();
		public  PURPEAC:Consumable = new PurityPeach();
		public  SHEEPMK:Consumable = new SheepMilk();
		public  S_WATER:Consumable = new SpringWater();
		public  TRAILMX:Consumable = new TrailMix();
		public  URTACUM:Consumable = new UrtaCum();
		public  W_PDDNG:Consumable = new WinterPudding();
//		GROWERS/SHRINKERS
		public  REDUCTO:Consumable = new Reducto();
		public  GROPLUS:Consumable = new GroPlus();
//		MAGIC BOOKS
		public  B__BOOK:Consumable = new BlackSpellBook();
		public  W__BOOK:Consumable = new WhiteSpellBook();
//		RARE ITEMS (Permanent effects, gives perks on consumption)
		public  BIMBOLQ:Consumable = new BimboLiqueur();
		public  BROBREW:Consumable = new BroBrew();
		public  HUMMUS2:Consumable = new SuperHummus();
		public  P_PEARL:Consumable = new PurePearl();
//		NON-TRANSFORMATIVE ITEMS
		public  AKBALSL:Consumable = new AkbalSaliva();
		public  C__MINT:Consumable = new Mint();
		public  CERUL_P:Consumable = new CeruleanPotion();
		public  CLOVERS:Consumable = new Clovis();
		public  COAL___:Consumable = new Coal();
		public  DEBIMBO:DeBimbo = new DeBimbo();
		public  EXTSERM:HairExtensionSerum = new HairExtensionSerum();
		public  F_DRAFT:Consumable = new LustDraft(LustDraft.ENHANCED);
		public  H_PILL:Consumable = new HealPill();
		public  HRBCNT:Consumable = new HerbalContraceptive();
		public  ICICLE_:Consumable = new IceShard();
		public  KITGIFT:KitsuneGift = new KitsuneGift();
		public  L_DRAFT:Consumable = new LustDraft(LustDraft.STANDARD);
		public  LACTAID:Consumable = new Lactaid();
		public  LUSTSTK:LustStick = new LustStick();
		public  MILKPTN:Consumable = new MilkPotion();
		public  NUMBOIL:Consumable = new NumbingOil();
		public  NUMBROX:Consumable = new NumbRocks();
		public  OVIELIX:OvipositionElixir = new OvipositionElixir();
		public  OVI_MAX:OvipositionMax = new OvipositionMax();
		public  PEPPWHT:Consumable = new PeppermintWhite();
		public  PPHILTR:Consumable = new PurityPhilter();
		public  PRNPKR :Consumable = new PrincessPucker();
		public  SENSDRF:Consumable = new SensitivityDraft();
		public  SMART_T:Consumable = new ScholarsTea();
		public  VITAL_T:Consumable = new VitalityTincture();
		public  W_STICK:WingStick = new WingStick();
//		TRANSFORMATIVE ITEMS
		public  B_GOSSR:Consumable = new SweetGossamer(SweetGossamer.DRIDER);
		public  BOARTRU:Consumable = new PigTruffle(true);
		public  DRAKHRT:EmberTFs = new EmberTFs(1);
		public  DRYTENT:Consumable = new ShriveledTentacle();
		public  ECHIDCK:Consumable = new EchidnaCake();
		public  ECTOPLS:Consumable = new Ectoplasm();
		public  EMBERBL:EmberTFs = new EmberTFs();
		public  EQUINUM:Consumable = new Equinum();
		public  FOXBERY:Consumable = new FoxBerry(FoxBerry.STANDARD);
		public  FRRTFRT:Consumable = new FerretFruit();
		public  FOXJEWL:Consumable = new FoxJewel(FoxJewel.STANDARD);
		public  GLDRIND:GoldenRind = new GoldenRind();
		public  GLDSEED:Consumable = new GoldenSeed(GoldenSeed.STANDARD);
		public  GOB_ALE:Consumable = new GoblinAle();
		public  HUMMUS_:Consumable = new RegularHummus();
		public  IMPFOOD:Consumable = new ImpFood();
		public  KANGAFT:Consumable = new KangaFruit(KangaFruit.STANDARD);
		public  LABOVA_:LaBova     = new LaBova(LaBova.STANDARD);
		public  MAGSEED:Consumable = new GoldenSeed(GoldenSeed.ENHANCED);
		public  MGHTYVG:Consumable = new KangaFruit(KangaFruit.ENHANCED);
		public  MOUSECO:Consumable = new MouseCocoa();
		public  MINOBLO:Consumable = new MinotaurBlood();
		public  MYSTJWL:Consumable = new FoxJewel(FoxJewel.MYSTIC);
		public  OCULUMA:Consumable = new OculumArachnae();
		public  P_LBOVA:Consumable = new LaBova(LaBova.PURIFIED);
		public  PIGTRUF:Consumable = new PigTruffle(false);
		public  PRFRUIT:Consumable = new PurpleFruit();
		public  PROBOVA:Consumable = new LaBova(LaBova.ENHANCED);
		public  RDRROOT:Consumable = new RedRiverRoot();
		public  REPTLUM:Consumable = new Reptilum();
		public  RHINOST:Consumable = new RhinoSteak();
		public  RINGFIG:Consumable = new RingtailFig();
		public  RIZZART:Consumable = new RizzaRoot();
		public  S_GOSSR:Consumable = new SweetGossamer(SweetGossamer.SPIDER);
		public  SALAMFW:Consumable = new Salamanderfirewater();
		public  SATYR_W:Consumable = new SatyrWine();
		public  SHARK_T:Consumable = new SharkTooth(false);  
		public  SNAKOIL:Consumable = new SnakeOil();
		public  TAURICO:Consumable = new Taurinum();
		public  TOTRICE:Consumable = new TonOTrice();
		public  TRAPOIL:Consumable = new TrapOil();
		public  TSCROLL:Consumable = new TatteredScroll();
		public  TSTOOTH:Consumable = new SharkTooth(true);
		public  VIXVIGR:Consumable = new FoxBerry(FoxBerry.ENHANCED);
		public  W_FRUIT:Consumable = new WhiskerFruit();
		public  WETCLTH:Consumable = new WetCloth();
		public  WOLF_PP:Consumable = new WolfPepper();
		public  UBMBOTT:Consumable = new UnlabeledBrownMilkBottle();
		//Bzzzzt! Bee honey ahoy!
		public  BEEHONY:Consumable = new BeeHoney(false, false);
		public  PURHONY:Consumable = new BeeHoney(true, false);
		public  SPHONEY:Consumable = new BeeHoney(false, true);
		//Canine puppers, I mean peppers
		public  CANINEP:Consumable = new CaninePepper(CaninePepper.STANDARD);
		public  LARGEPP:Consumable = new CaninePepper(CaninePepper.LARGE);
		public  DBLPEPP:Consumable = new CaninePepper(CaninePepper.DOUBLE);
		public  BLACKPP:Consumable = new CaninePepper(CaninePepper.BLACK);
		public  KNOTTYP:Consumable = new CaninePepper(CaninePepper.KNOTTY);
		public  BULBYPP:Consumable = new CaninePepper(CaninePepper.BULBY);

		public  LARGE_EGGS: any[] = [L_BLKEG,L_BLUEG,L_BRNEG,L_PNKEG,L_PRPEG,L_WHTEG];
		public  SMALL_EGGS: any[] = [BLACKEG,BLUEEGG,BROWNEG,PINKEGG,PURPLEG,WHITEEG];

		public  ConsumableLib() {}
	}

