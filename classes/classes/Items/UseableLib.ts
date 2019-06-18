/**
 * Created by aimozg on 10.01.14.
 */

	use namespace kGAMECLASS;

	export class UseableLib extends BaseContent
	{
		public  UseableLib() {}
		
		//MATERIALS
		public  B_CHITN:SimpleUseable = new SimpleUseable("B.Chitn", "B.Chitn", "a large shard of chitinous plating", 6,
			"A perfect piece of black chitin from a bee-girl. It still has some fuzz on it.",
			"You look over the chitin carefully, but cannot find a use for it. Maybe someone else will know how to use it.");
		public  GREENGL:SimpleUseable = new SimpleUseable("GreenGl", "GreenGl", "a clump of green gel", 6,
			"This tough substance has no obvious use that you can discern.",
			"You examine the gel thoroughly, noting it is tough and resiliant, yet extremely pliable. Somehow, you know eating it would not be a good idea.");
		public  T_SSILK:SimpleUseable = new SimpleUseable("T.SSilk", "T.SSilk", "a bundle of tough spider-silk", 6,
			"This bundle of fibrous silk is incredibly tough and strong, though somehow not sticky in the slightest. You have no idea how to work these tough little strands into anything usable.  Perhaps one of this land's natives might have an idea?",
			"You look over the tough webbing, confusion evident in your expression. There's really nothing practical you can do with these yourself. It might be best to find someone more familiar with the odd materials in this land to see if they can make sense of it.");
		public  D_SCALE:SimpleUseable = new SimpleUseable("D.Scale", "Dragonscale", "a freshly-shed dragonscale", 45, 
			"This sheet of dragon scale is incredibly strong and flexible.  No dragons were seriously harmed in the acquisition of this item.", 
			"You look over the sheet of dragon scale. You've seen various legends about how the scales of a dragon can be worked into tough armor or used in alchemy.");
		public  LETHITE:SimpleUseable = new SimpleUseable("Lethite", "Lethicite", "a chunk of lethicite", 1000, 
			"A chunk of lethicite. It's very rare, as lethicite is only produced when a mortal becomes a demon and cums their souls out. A demon's favourite treat.",
			"You examine the purple crystal. It must be lethicite. You know that the demons like to consume them, but you're sure there might be a use for it.");
		public  EBNFLWR:SimpleUseable = new SimpleUseable("E.Flower", "E.Flower", "an Ebonbloom flower", 600,
			"Grey metallic flowers that are known to bloom in the deepest caves below the mountains.",
			"You look over the Ebonbloom flower. It's rather pretty, outside of the fact that it reflects sunlight and blinds you. They're rare, so you're sure you could sell it if you wanted, though you can't help but wonder if there's another use for it.");
		public  OBSHARD:SimpleUseable = new SimpleUseable("ObShard", "Ob.Shard", "a shard of obsidian", 200,
			"A small shard of obsidian. Formed from rapidly-cooling lava, it's a volcanic glass that is known to be very sharp albeit fragile.",
			"You look over the shard of obsidian, holding the shard with care. It's rather shiny, easily reflecting the sunlight. Knowing how sharp the shard is, you could find someone who could work it into some deadly weapons.");
		//WALL DECOR
		public  IMPSKLL:SimpleUseable = new SimpleUseable("ImpSkll", "ImpSkull", "an imp skull", 25, 
			"A skull taken from a slain imp.",
			"You look at the imp skull.  A pair of horns protrude from the skull.  You admire the overall frame of the skull yet you find no obvious uses for it.");
		//MISCELLANEOUS
		public  CONDOM :SimpleUseable = new SimpleUseable("Condom ", "Condom", "a packet of condom", 6,
			"This wrapper contains a latex condom that can be worn over penis. It's designed to prevent pregnancy most of the time. Can be used in certain sex scenes.",
			"You look at the unopened packet of condom.  If applicable, you can use the condom to prevent pregnancy most of the time.");
		public  GLDSTAT:SimpleUseable = new SimpleUseable("GldStat", "GldStat", "a golden statue", 600,
			"An intricate golden idol of an androgynous humanoid figure with nine long tails.  It probably had some spiritual significance to its owner.",
			"", kGAMECLASS.forest.kitsuneScene.kitsuneStatue);
		//CHEAT ITEM
		public  DBGWAND:DebugWand = new DebugWand();
	}

