
export class Rathazul extends NPCAwareContent implements TimeAwareInterface, Encounter {

//const RATHAZUL_DEBIMBO_OFFERED: number = 744;

	//Rathazul the Alchemist
	//Encounter, random text for potential uses, choices.
	//After he has crafted 3 things for the player, option to move into camp.
		private  game:CoC;

		public  Rathazul() {
			CoC.timeAwareClassAdd(this);
			//TODO inject this instead of using a global
			this.game = kGAMECLASS;
		}

		//Implementation of TimeAwareInterface
		public  timeChange(): boolean {
			if (flags[kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN] > 1) {
				flags[kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN]--;
				if (flags[kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN] < 1) flags[kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN] = 1;
				if (flags[kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN] > 300) flags[kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN] = 24;
			}
			if (flags[kFLAGS.RATHAZUL_CAMP_INTERACTION_COUNTDOWN] > 0) {
				flags[kFLAGS.RATHAZUL_CAMP_INTERACTION_COUNTDOWN]--;
				if (flags[kFLAGS.RATHAZUL_CAMP_INTERACTION_COUNTDOWN] < 0) flags[kFLAGS.RATHAZUL_CAMP_INTERACTION_COUNTDOWN] = 0;
			}
			return false;
		}

		public  timeChangeLarge(): boolean { return false; }
		//End of Interface Implementation

		public  returnToRathazulMenu(): void {
			if (player.hasStatusEffect(StatusEffects.CampRathazul)) campRathazul();
			else execEncounter();
		}

	public  encounterName(): string { return "rathazul"; }
		public  mixologyXP(): number {
			//Failsafe
			if (flags[kFLAGS.RATHAZUL_MIXOLOGY_XP] < 0)
				flags[kFLAGS.RATHAZUL_MIXOLOGY_XP] = 0;
			if (flags[kFLAGS.RATHAZUL_MIXOLOGY_XP] > 200)
				flags[kFLAGS.RATHAZUL_MIXOLOGY_XP] = 200;
			//In case you've ditched the second value of this status effect, remove this conditional completely (Stadler76)
			if (player.hasStatusEffect(StatusEffects.MetRathazul) && flags[kFLAGS.RATHAZUL_MIXOLOGY_XP] < 200 && flags[kFLAGS.RATHAZUL_MIXOLOGY_XP] < player.statusEffectv2(StatusEffects.MetRathazul) * 4)
				flags[kFLAGS.RATHAZUL_MIXOLOGY_XP] = player.statusEffectv2(StatusEffects.MetRathazul) * 4;
			return flags[kFLAGS.RATHAZUL_MIXOLOGY_XP];
		}

		public  addMixologyXP(amount:uint): void {
			mixologyXP(); //no-op to fix the flag just in time
			flags[kFLAGS.RATHAZUL_MIXOLOGY_XP] += amount;
			if (flags[kFLAGS.RATHAZUL_MIXOLOGY_XP] > 200)
				flags[kFLAGS.RATHAZUL_MIXOLOGY_XP] = 200;
		}
	public  encounterChance(): number { return !player.hasStatusEffect(StatusEffects.CampRathazul) ? 0.5 : 0; }
	public  execEncounter(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("encounter-rathazul"));
	if (flags[kFLAGS.MARBLE_PURIFICATION_STAGE] == 2 && player.hasStatusEffect(StatusEffects.MetRathazul)) {
		marblePurification.visitRathazulToPurifyMarbleAfterLaBovaStopsWorkin();
		return;
	}
var  offered: boolean;
	//Rat is definitely not sexy!
	if (player.lust > 30) dynStats("lus", -10);
	//Introduction
	if (player.hasStatusEffect(StatusEffects.MetRathazul)) {
		if (player.hasStatusEffect(StatusEffects.CampRathazul))
			 outputText("You walk over to Rathazul's corner of the camp.  He seems as busy as usual, with his nose buried deep in some tome or alchemical creation, but he turns to face you as soon as you walk within a few paces of him.\n\n");
		else outputText("You spy the familiar sight of the alchemist Rathazul's camp along the lake.  The elderly rat seems to be oblivious to your presence as he scurries between his equipment, but you know him well enough to bet that he is entirely aware of your presence.\n\n");
	}
	else {
		outputText("You encounter a hunched figure working as you come around a large bush.  Clothed in tattered robes that obscure most his figure, you can nonetheless see a rat-like muzzle protruding from the shadowy hood that conceals most of his form.  A simple glance behind him confirms your suspicions - this is some kind of rat-person.  He seems oblivious to your presence as he stirs a cauldron of viscous fluid with one hand; a neat stack of beakers and phials sit in the dirt to his left.  You see a smile break across his aged visage, and he says, \"<i>Come closer child.  I will not bite.</i>\"\n\nApprehensive of the dangers of this unknown land, you cautiously approach.\n\n\"<i>I am Rathazul the Alchemist.  Once I was famed for my miracle cures.  Now I idle by this lake, helpless to do anything but measure the increasing amounts of corruption that taint its waters,</i>\" he says as he pulls back his hood, revealing the entirety of his very bald and wrinkled head.\n\n");
		player.createStatusEffect(StatusEffects.MetRathazul,0,0,0,0);
	}
	//Camp offer!
	if (player.statusEffectv2(StatusEffects.MetRathazul) >= 3 && player.statusEffectv3(StatusEffects.MetRathazul) != 1 && player.isPureEnough(75)) {
		outputText("\"<i>You know, I think I might be able to do this worn-out world a lot more good from your camp than by wandering around this lake.  What do you say?</i>\" asks the rat.\n\n(Move Rathazul into your camp?)");
		doYesNo(rathazulMoveToCamp, rathazulMoveDecline);
		//Set rathazul flag that he has offered to move in (1 time offer)
		player.changeStatusValue(StatusEffects.MetRathazul,3,1);
		return;
	}
	offered = rathazulWorkOffer();
	if (!offered) {
		outputText("He sighs dejectedly, \"<i>I am not sure what I can do for you, youngling.  This world is fraught with unimaginable dangers, and you're just scratching the surface of them.</i>\"\n\nYou nod and move on, leaving the depressed alchemist to his sadness.");
		doNext(camp.returnToCampUseOneHour);
	}
}

private  rathazulMoveToCamp(): void {
	clearOutput();
	outputText(images.showImage("encounter-rathazul"));
	outputText("Rathazul smiles happily back at you and begins packing up his equipment.  He mutters over his shoulder, \"<i>It will take me a while to get my equipment moved over, but you head on back and I'll see you within the hour.  Oh my, yes.</i>\"\n\nHe has the look of someone experiencing hope for the first time in a long time.");
	player.createStatusEffect(StatusEffects.CampRathazul, 0, 0, 0, 0);
	doNext(camp.returnToCampUseOneHour);
}

private  rathazulMoveDecline(): void {
	clearOutput();
	outputText(images.showImage("encounter-rathazul"));
	outputText("Rathazul wheezes out a sigh, and nods.\n\n\"<i>Perhaps I'll still be of some use out here after all,</i>\" he mutters as he packs up his camp and prepares to head to another spot along the lake.");
	doNext(camp.returnToCampUseOneHour);
}

public  campRathazul(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("encounter-rathazul"));
	if (flags[kFLAGS.MARBLE_PURIFICATION_STAGE] == 2 && player.hasStatusEffect(StatusEffects.MetRathazul)) {
		marblePurification.visitRathazulToPurifyMarbleAfterLaBovaStopsWorkin();
		return;
	}
	if (flags[kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN] == 1 && flags[kFLAGS.RATHAZUL_SILK_ARMOR_TYPE] > 0) {
		collectSilkArmor();
		return;
	}
	//Special rathazul/follower scenes scenes
	if (rand(6) == 0 && flags[kFLAGS.RATHAZUL_CAMP_INTERACTION_COUNTDOWN] == 0) {
		flags[kFLAGS.RATHAZUL_CAMP_INTERACTION_COUNTDOWN] = 3;
		//Pure jojo
		if (flags[kFLAGS.JOJO_RATHAZUL_INTERACTION_COUNTER] == 0 && player.hasStatusEffect(StatusEffects.PureCampJojo) && flags[kFLAGS.JOJO_DEAD_OR_GONE] == 0) {
			finter.jojoOffersRathazulMeditation();
			return;
		}
		if (flags[kFLAGS.AMILY_MET_RATHAZUL] == 0 && flags[kFLAGS.AMILY_FOLLOWER] == 1 && amilyScene.amilyFollower()) {
			finter.AmilyIntroducesSelfToRathazul();
			return;
		}
		if (flags[kFLAGS.AMILY_MET_RATHAZUL] == 1 && flags[kFLAGS.AMILY_FOLLOWER] == 1 && amilyScene.amilyFollower()) {
			finter.amilyIngredientDelivery();
			return;
		}
		if (flags[kFLAGS.AMILY_MET_RATHAZUL] == 2 && flags[kFLAGS.AMILY_FOLLOWER] == 1 && amilyScene.amilyFollower()) {
			finter.amilyAsksAboutRathazulsVillage();
			return;
		}
	}
var  offered: boolean;
	//Rat is definitely not sexy!
	if (player.lust100 > 50) dynStats("lus", -1);
	if (player.lust100 > 65) dynStats("lus", -5);
	if (player.lust100 > 80) dynStats("lus", -5);
	if (player.lust100 > 90) dynStats("lus", -5);
	//Introduction
	outputText("Rathazul looks up from his equipment and gives you an uncertain smile.\n\n\"<i>Oh, don't mind me,</i>\" he says, \"<i>I'm just running some tests here.  Was there something you needed, " + player.short + "?</i>\"\n\n");
	//player.createStatusEffect(StatusEffects.metRathazul,0,0,0,0);
	offered = rathazulWorkOffer();
	if (!offered) {
		outputText("He sighs dejectedly, \"<i>I don't think there is.  Why don't you leave me be for a time, and I will see if I can find something to aid you.</i>\"");
		if (player.hasStatusEffect(StatusEffects.CampRathazul))
			 doNext(camp.campFollowers);
		else doNext(playerMenu);
	}
}

private  rathazulWorkOffer(): boolean {
	spriteSelect(SpriteDb.s_rathazul);
var  totalOffers: number = 0;
var  spoken: boolean = false;
	//These variables might go away at a point
var  showArmorMenu: boolean = false;
var  dyes: boolean = false;
var  purify: boolean = false;
var  philters: boolean = false;
var  alchemy: boolean = false;
var  debimbo: boolean = false;
var  reductos: boolean = false;
var  lethiciteDefense = undefined;

	mixologyXP(); //no-op to fix the flag just in time
	if (flags[kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN] == 1 && flags[kFLAGS.RATHAZUL_SILK_ARMOR_TYPE] > 0) {
		collectSilkArmor();
		return true;
	}
	if (flags[kFLAGS.MINERVA_PURIFICATION_RATHAZUL_TALKED] == 1 && flags[kFLAGS.MINERVA_PURIFICATION_PROGRESS] < 10) {
		purificationByRathazulBegin();
		return true;
	}
	if (player.hasItem(consumables.BLACKEG) || player.hasItem(consumables.L_BLKEG)) {
		flags[kFLAGS.PC_KNOWS_ABOUT_BLACK_EGGS] = 1;
		spoken = true;
		outputText("He eyes the onyx egg in your inventory and offers a little advice.  \"<i>Be careful with black eggs.  They can turn your skin to living latex or rubber.  The smaller ones are usually safer, but everyone reacts differently.  I'd get rid of them, if you want my opinion.</i>\"\n\n");
	}
	//Item crafting offer
	if (player.hasItem(useables.GREENGL)) { //Green Gel
		if (!player.hasStatusEffect(StatusEffects.RathazulArmor)) outputText("He pipes up with a bit of hope in his voice, \"<i>I can smell the essence of the tainted lake-slimes you've defeated, and if you'd let me, I could turn it into something a bit more useful to you.  You see, the slimes are filled with the tainted essence of the world-mother herself, and once the taint is burned away, the remaining substance remains very flexible but becomes nearly impossible to cut through.  With the gel of five defeated slimes I could craft you a durable suit of armor.</i>\"");
		else outputText("He pipes up with a bit of excitement in his voice, \"<i>With just five pieces of slime-gel I could make another suit of armor...</i>\"");
		spoken = true;
		if (player.hasItem(useables.GREENGL,5)) {
			showArmorMenu = true;
			totalOffers++;
		}
		else outputText("\nYou realize you're still a bit short of gel.\n");
		outputText("\n\n");
	}
	if (player.hasItem(useables.B_CHITN)) { //Bee Chitin
		outputText("The elderly rat looks at you intently and offers, \"<i>I see you've gathered a piece of chitin from the giant bees of the forests.  If you bring me five pieces I could probably craft it into some tough armor.</i>\"");
		spoken = true;
		if (player.hasItem(useables.B_CHITN, 5)) {
			showArmorMenu = true;
			totalOffers++;
		}
		else outputText("\nYou realize you're still a bit short of chitin.");
		outputText("\n\n");
	}
	if (player.hasItem(useables.T_SSILK) && flags[kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN] + flags[kFLAGS.RATHAZUL_SILK_ARMOR_TYPE] == 0) { //SPOIDAH
		showArmorMenu = true;
		spoken = true;
		totalOffers++;
		outputText("\"<i>Oooh, is that some webbing from a giant spider or spider-morph?  Most excellent!  With a little bit of alchemical treatment, it is possible I could loosen the fibers enough to weave them into something truly magnificent - armor, or even a marvelous robe,</i>\" offers Rathazul.\n\n");
	}
	if (player.hasItem(useables.D_SCALE)) { //Dragonscale
		showArmorMenu = true;
		totalOffers++;
		outputText("\"<i>Oooh, is that dragon scale? If you happen to have five of these, I can work them into armor,</i>\" Rathazul says.\n\n");
	}
	if (player.hasItem(useables.EBNFLWR)) { //Ebonbloom
		showArmorMenu = true;
		totalOffers++;
		outputText("Rathazul looks at the flower in your hand. \"<i>I haven’t seen one of these in years... maybe a decade by now. This is an Ebonbloom flower. They grow in the deep, dark caves that run below the land. Nobody knows how they grow, considering they're made of metal, but it gives them very unique properties.</i>\" He hands the flower back to you. \"<i>Can you get more of these? If you bring me ten blooms, I could make you some armor. Though, 8 should be enough for something lighter, and 3 for undergarments... I'll need 500 Gems, too.</i>\"\n\n");
	}
	if (player.hasItem(useables.LETHITE)) { //Lethicite Staff
		showArmorMenu = true;
		totalOffers++;
		outputText("Rathazul glances your way, back at his desk, then to you again, eyes falling on the Lethicite in your hands. \"<i>Lethicite? Where did you get that?</i>\" He keeps talking before you can reply, inevitably not actually caring much. \"<i>If you could get me five shards of about that size and a magical staff, I might be able to increase the staff's power for you.</i>\" His eyes glitter in excitement. You get the feeling he just really wants to work with the Lethicite.\n\n");
	}
	if (player.hasKeyItem("Tentacled Bark Plates") >= 0 || player.hasKeyItem("Divine Bark Plates") >= 0) //Marae bark armor
		showArmorMenu = true;
var  pCounter: number = 0;
	//Item purification offer
	if (player.hasItem(consumables.INCUBID)) pCounter++;
	if (player.hasItem(consumables.SUCMILK)) pCounter++;
	if (player.hasItem(consumables.SDELITE)) pCounter++;
	if (player.hasItem(consumables.LABOVA_)) pCounter++;
	if (player.hasItem(consumables.MINOCUM)) pCounter++;
	if (pCounter > 0) {
		if (pCounter == 1) 
			 outputText("The rat mentions, \"<i>I see you have at least one tainted item on you... for 20 gems I could remove most of the taint, making it a good deal safer to use.  Of course, who knows what kind of freakish transformations it would cause...</i>\"\n\n");
		else outputText("The rat mentions, \"<i>I see you have a number of demonic items on your person.  For 20 gems I could attempt to remove the taint from one of them, rendering it a good deal safer for consumption.  Of course it would not remove most of the transformative properties of the item...</i>\"\n\n");
		purify = true;
		spoken = true;
		totalOffers += pCounter;
	}
	if (player.gems >= 50) { //Offer dyes if offering something else
		outputText("Rathazul offers, \"<i>Since you have enough gems to cover the cost of materials for my dyes as well, you could buy one of my dyes for your hair.  ");
		if (player.statusEffectv2(StatusEffects.MetRathazul) >= 8) outputText("I should be able to make exotic-colored dyes if you're interested.  ");
		outputText("Or if you want some changes to your skin, I have skin oils and body lotions.  I will need 50 gems up-front.</i>\"\n\n");
		dyes = true;
		spoken = true;
		totalOffers++;
	}
	if (player.gems >= 100) { //Offer purity philter and numbing oil
		outputText("Rathazul offers, \"<i>I can make something for you. Something to counter the corruption of this realm and if you're feeling too sensitive, I have these oils. I'll need 100 gems up-front.</i>\"");
		philters = true;
		spoken = true;
		totalOffers++;
	}
	if (player.hasItem(consumables.BEEHONY)) { //Bee honey
		outputText("Rathazul offers, \"<i>If you're in need of a pure honey, I can distill the regular bee honey. You'll also need 20 gems up front.</i>\"\n\n");
		spoken = true;
		alchemy = true;
		totalOffers++;
	}
	if (player.statusEffectv2(StatusEffects.MetRathazul) >= 5) { //Pro Lactaid & Taurinum
		outputText("The rat mentions, \"<i>You know, I could make something new if you're willing to hand over two of vials labeled \"Equinum\", one vial of minotaur blood and one hundred gems. Or five bottles of Lactaid and two bottles of purified LaBova along with 250 gems.</i>\"\n\n");
		spoken = true;
		alchemy = true;
		totalOffers++;
	}
	if (player.hasStatusEffect(StatusEffects.CampRathazul) && player.statusEffectv2(StatusEffects.MetRathazul) >= 4) { //Reducto
		outputText("The rat hurries over to his supplies and produces a container of paste, looking rather proud of himself, \"<i>Good news everyone!  I've developed a paste you could use to shrink down any, ah, oversized body parts.  The materials are expensive though, so I'll need ");
		if (flags[kFLAGS.AMILY_MET_RATHAZUL] >= 2) outputText("50");
		else outputText("100");
		outputText(" gems for each jar of ointment you want. And if you're, ah, not feeling big enough, I've also developed a liquid that you inject. The materials are expensive too so it's the same price for each needle.</i>\"\n\n");
		totalOffers++;
		spoken = true;
		reductos = true;
	}
	if (player.keyItemv1("Marae's Lethicite") > 0 && !player.hasStatusEffect(StatusEffects.DefenseCanopy) && player.hasStatusEffect(StatusEffects.CampRathazul)) { //Vines
		outputText("His eyes widen in something approaching shock when he sees the Lethicite crystal you took from Marae.  Rathazul stammers, \"<i>By the goddess... that's the largest piece of lethicite I've ever seen.  I don't know how you got it, but there is immense power in those crystals.  If you like, I know a way we could use its power to grow a canopy of thorny vines that would hide the camp and keep away imps.  Growing such a defense would use a third of that lethicite's power.</i>\"\n\n");
		totalOffers++;
		spoken = true;
		lethiciteDefense = growLethiciteDefense;
	}
	if (player.hasStatusEffect(StatusEffects.CampRathazul)) {
		if (flags[kFLAGS.RATHAZUL_DEBIMBO_OFFERED] == 0 && (sophieBimbo.bimboSophie() || player.findPerk(PerkLib.BroBrains) >= 0 || player.findPerk(PerkLib.BimboBrains) >= 0 || player.findPerk(PerkLib.FutaFaculties) >= 0 || flags[kFLAGS.IZMA_BROFIED] > 0)) {
			rathazulDebimboOffer();
			return true;
		}
		else if (flags[kFLAGS.RATHAZUL_DEBIMBO_OFFERED] > 0) {
			outputText("You recall that Rathazul is willing to make something to cure bimbo liqueur for 250 gems and five Scholar's Teas.");
			if (player.hasItem(consumables.SMART_T,5) && player.gems >= 250) {
				totalOffers++;
				debimbo = true;
				alchemy = true;
			}
			else if (!player.hasItem(consumables.SMART_T,5)) outputText("  You should probably find some if you want that...");
			else outputText("  You need more gems to afford that, though.");
			outputText("\n\n");			
		}
		if (flags[kFLAGS.MINERVA_PURIFICATION_RATHAZUL_TALKED] == 2 && flags[kFLAGS.MINERVA_PURIFICATION_PROGRESS] < 10 && player.hasKeyItem("Rathazul's Purity Potion") < 0) { //Purification potion for Minerva
			outputText("The rodent alchemist suddenly looks at you in a questioning manner. \"<i>Have you had any luck finding those items? I need pure honey and at least two samples of other purifiers; your friend’s spring may grow the items you need.</i>\"");
			outputText("\n\n");	
		}
		if (player.hasItem(consumables.LACTAID, 5) && player.hasItem(consumables.P_LBOVA, 2)) {
			outputText("The rodent sniffs your possessions. \"<i>You know, I could make something with five bottles of Lactaid and two bottles of purified LaBova. I'll also need 250 gems.</i>\"");
			outputText("\n\n");
		}
	}
	if (totalOffers == 0 && spoken) {
		doNext(camp.returnToCampUseOneHour);
		return true;
	}
	if (totalOffers > 0) {
		outputText("Will you take him up on an offer or leave?");
		//In camp has no time passage if left
		menu();
	var  button: number = 5; //After the 8th button, the menus will dynamically fill in
		if (showArmorMenu) //Armour sub-menu
			 addButton(0, "Craft", rathazulArmorMenu).hint("Ask Rathazul to craft something for you.");
		else addButtonDisabled(0, "Craft", "You don't have sufficient materials that can be crafted.");
		if (dyes || philters || reductos) //Shop sub-menu
			 addButton(1, "Shop", rathazulShopMenu, dyes, philters, reductos, "Check Rathazul's wares.");
		else addButtonDisabled(1, "Shop", "You can't afford anything Rathazul has to offer.");
		if (purify) //Purification sub-menu
			 addButton(2, "Purify", purifySomething).hint("Ask him to purify any tainted potions.\n\nCost: 20 Gems.");
		else addButtonDisabled(2, "Purify", "You don't have any items that can be purified.");
		if (alchemy) //Alchemy sub-menu
			addButton(3, "Alchemy", rathazulAlchemyMenu).hint("Have Rathazul make something out of the ingredients you carry.");
		if (silly() && player.hasStatusEffect(StatusEffects.CampRathazul)) //Silly Mode: Straight-up kill Rathazul (He'll revive, this is silly mode. Just, no longer a follower) / I blame the Wikia Discord chat for this, they egged me on
			addButton(4, "Flirt", getThatRatAss).hint("Try to score with Rathazul.");
		if (lethiciteDefense != undefined) //These will be filled in
			addButton(button++, "Lethicite", lethiciteDefense).hint("Ask him if he can make use of that lethicite you've obtained from Marae.");
		if (player.hasStatusEffect(StatusEffects.CampRathazul))
			 addButton(14,"Leave", camp.campFollowers);
		else addButton(14, "Leave", camp.returnToCampUseOneHour);
		return true;
	}
	return false;
}
//------------ ARMOUR ------------
public  rathazulArmorMenu(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("rathazul-lab"));
	outputText("Which crafting project would you like to pursue with Rathazul?");
	menu();
	if (player.hasItem(useables.GREENGL, 5))
		 addButton(0, "GelArmor", craftOozeArmor);
	else addDisabledButton(0, "GelArmor", "He can make armor using 5 clumps of green gel.");
	if (player.hasItem(useables.B_CHITN, 5))
		 addButton(1, "BeeArmor", craftCarapace);
	else addDisabledButton(1, "BeeArmor", "He can make armor using 5 shards of chitinous plating.");
	if (player.hasItem(useables.T_SSILK) && flags[kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN] + flags[kFLAGS.RATHAZUL_SILK_ARMOR_TYPE] == 0)
		 addButton(2, "SpiderSilk", craftSilkArmor);
	else addDisabledButton(2, "SpiderSilk", "He can make armor or clothes using tough spider-silk.");
	if (player.hasItem(useables.D_SCALE, 2))
		 addButton(3, "Dragonscale", craftDragonscaleArmor);
	else addDisabledButton(3, "Dragonscale", "He can make armor or clothes using dragonscales.");
	if (player.hasItem(useables.LETHITE, 5) && player.hasItem(weapons.W_STAFF, 1))
		 addButton(4, "Lethicite", craftLethiciteStaff);
	else addDisabledButton(4, "Lethicite", "He can upgrade your wizard's staff if you bring him 5 chunks of lethicite.");
	if (player.hasKeyItem("Tentacled Bark Plates") >= 0)
		addButton(5, "T.Bark Armor", craftMaraeArmor, false);
	//no disabled button - you'll get directions when you'll get bark plates
	if (player.hasKeyItem("Divine Bark Plates") >= 0)
		addButton(6, "D.Bark Armor", craftMaraeArmor, true);
	//no disabled button - you'll get directions when you'll get bark plates
	if (player.hasItem(useables.EBNFLWR, 3))
		 addButton(7, "Ebonbloom", craftEbonweaveArmor);
	else addDisabledButton(7, "Ebonbloom", "He can make armor or clothes using Ebonblooms.\n\nCost: 500 Gems");
	addButton(14, "Back", returnToRathazulMenu);
}

private  craftOozeArmor(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("item-gelArmor"));
	outputText("Rathazul takes the green gel from you and drops it into an empty cauldron.  With speed well beyond what you'd expect from such an elderly creature, he nimbly unstops a number of vials and pours them into the cauldron.  He lets the mixture come to a boil, readying a simple humanoid-shaped mold from what you had thought was piles of junk material.  In no time at all, he has cast the boiling liquid into the mold, and after a few more minutes he cracks it open, revealing a suit of glistening armor.\n\n");
	player.destroyItems(useables.GREENGL, 5);
	player.addStatusValue(StatusEffects.MetRathazul, 2, 1);
	inventory.takeItem(armors.GELARMR, returnToRathazulMenu);
	if (!player.hasStatusEffect(StatusEffects.RathazulArmor)) player.createStatusEffect(StatusEffects.RathazulArmor,0,0,0,0);
}

private  craftCarapace(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("item-chitinArmor"));
	outputText("The rat takes the scales and works on his bench for an hour while you wait.  Once he has finished, Rathazul is beaming with pride, \"<i>I think you'll be pleased. Go ahead and take a look.</i>\"\n\nHe hands you the armor.  ");
	outputText("The plates shine and shimmer like black steel.  He has used the yellow chitin to add accents and embroidery to the plates with a level of detail and craftsmanship rarely seen back home. A yellow fur neck lining has been fashioned from hairs found on the pieces.  The armor includes a breastplate, shoulder guards, full arm guards, and knee high boots.  You notice there are no pants.  As you turn to ask him where the pants are, you see him scratching his head and hastily rustling in drawers.  He mutters under his breath, \"<i>I'm sorry, I'm sorry, I got so focused on working on the pauldrons that I forgot to make any leg coverings!  Here, this should look good with it, and it won't restrict your movements.</i>\"  He hands you a silken loincloth");
	if (player.mf("m", "f") == "f") outputText(" with stockings and garters");
	outputText(".  He still manages to look somewhat pleased with himself in spite of the blunder, even bragging a little bit, \"<i>Let me show you the different lengths of string I used.</i>\"\n\n");
	if (player.cockTotal() > 0 && player.biggestCockArea() >= 40) outputText("The silken material does little to hide the bulge of your groin, if anything it looks a little lewd.  Rathazul mumbles and looks away, shaking his head.\n\n");
	if (player.biggestTitSize() >= 8) outputText("Your " + player.biggestBreastSizeDescript() + " barely fit into the breastplate, leaving you displaying a large amount of jiggling cleavage.\n\n");
	player.destroyItems(useables.B_CHITN, 5);
	player.addStatusValue(StatusEffects.MetRathazul, 2, 1);
	inventory.takeItem(armors.BEEARMR, returnToRathazulMenu);
}

private  craftSilkArmor(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("rathazul-lab"));
	outputText("You hand the bundled webbing to Rathazul carefully, lest you damage the elderly mouse.  He gives you a bemused smile and snatches the stuff from your grasp while he mutters, \"<i>I'm not falling apart you know.</i>\"\n\n");
	//(Not enough webs: 
	if (!player.hasItem(useables.T_SSILK, 5)) {
		outputText("The rat shakes his head and hands it back to you.  \"<i>This isn't enough for me to make anything with.  I'll need at least five bundles of this stuff total, so you'll need to find more,</i>\" he explains.\n\n");
		//(optional spider bonus:
		if (player.tail.type == Tail.SPIDER_ABDOMEN) {
			outputText("You show him your spider-like abdomen in response, offering to produce more webbing for him.  Rathazul chuckles dryly, a sound that reminds you of hot wind rushing through a dead valley.  \"<i>Dear child, this would never do.  Silk this tough can only be produced by a true-born spider.  No matter how you change yourself, you'll always be a human at heart.</i>\"\n\n");
			outputText("The old rat shakes his head and adds, \"<i>Well, now that I think about it, the venom of a red widow might be able to transform you until you are a spider to the core, but I have absolutely no idea what that would do to you.  If you ever try such a dangerous, reckless idea, let me know.  I want to have my notebooks handy, for SCIENCE!</i>\"\n\n");
		}
		if (player.hasItem(useables.T_SSILK, 2)) {
			outputText("\"<i>But this should be enough for undergarments if you want and I will need 500 gems up front,</i>\" Rathazul adds.");
			if (player.gems < 500) {
				outputText("  <b>Wait... you don't even have 500 gems.  Damn.</b>");
				doNext(returnToRathazulMenu);
				return;
			}
			doYesNo(commissionSilkArmorForReal,declineSilkArmorCommish);
			return;
		}
		doNext(returnToRathazulMenu);
		return;
	}
	outputText("The rat limps over to his equipment, spider-silk in hand.  With efficient, practiced motions, he runs a few tests.  As he finishes, he sighs and explains, \"<i>This will be harder than I thought.  The webbing is highly resistant to most of my alchemic reagents.  To even begin to work with such material I will need a number of rare, expensive elements.  I would need 500 gems to even start such a project.</i>\"\n\n");
	outputText("You can't help but sigh when he names such a sizable figure.  Do you give him the 500 gems and spider-silk in order for him to create you a garment?");
	if (player.gems < 500) {
		outputText("  <b>Wait... you don't even have 500 gems.  Damn.</b>");
		doNext(returnToRathazulMenu);
		return;
	}
	doYesNo(commissionSilkArmorForReal,declineSilkArmorCommish);
}
private  commissionSilkArmorForReal(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("rathazul-lab"));
	outputText("You sort 500 gems into a pouch and toss them to Rathazul, along with the rest of the webbing.  The wizened alchemist snaps the items out of the air with lightning-fast movements and goes to work immediately.  He bustles about with enormous energy, invigorated by the challenging task before him.  It seems Rathazul has completely forgotten about you, but as you turn to leave, he calls out, \"<i>What did you want me to make?  A mage's robe or some nigh-impenetrable armor?  Or undergarments if you want.</i>\"\n\n");
	menu();
	if (player.hasItem(useables.T_SSILK, 5)) {
		addButton(0, "Armor", chooseArmorOrRobes, 1, undefined, undefined, armors.SSARMOR.description);
		addButton(1, "Robes", chooseArmorOrRobes, 2, undefined, undefined, armors.SS_ROBE.description);
	}
	else {
		addDisabledButton(0, "Armor", "You must have 5 bundles of silk to make it.");
		addDisabledButton(1, "Robes", "You must have 5 bundles of silk to make it.");
	}
	addButton(2, "Bra", chooseArmorOrRobes, 3, undefined, undefined, undergarments.SS_BRA.description);
	addButton(3, "Panties", chooseArmorOrRobes, 4, undefined, undefined, undergarments.SSPANTY.description);
	addButton(4, "Loincloth", chooseArmorOrRobes, 5, undefined, undefined, undergarments.SS_LOIN.description);
	addButton(14, "Nevermind", declineSilkArmorCommish);
}
private  declineSilkArmorCommish(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("encounter-rathazul"));
	outputText("You take the silk back from Rathazul and let him know that you can't spend 500 gems on a project like that right now.  He sighs, giving you a crestfallen look and a slight nod of his hooded muzzle.");
	doNext(returnToRathazulMenu);
}
public  chooseArmorOrRobes(robeType: number): void {
	spriteSelect(SpriteDb.s_rathazul);
	if (robeType == 1 || robeType == 2)
		 player.destroyItems(useables.T_SSILK, 5); //Armor or robes
	else player.destroyItems(useables.T_SSILK, 2); //Undergarments
	player.gems -= 500;
	statScreenRefresh();
	clearOutput();
	outputText("Rathazul grunts in response and goes back to work.  ");
	if (player.hasStatusEffect(StatusEffects.CampRathazul))
		 outputText("You turn back to the center of your camp");
	else outputText("You head back to your camp");
	outputText(", wondering if the old rodent will actually deliver the wondrous item that he's promised you.");
	flags[kFLAGS.RATHAZUL_SILK_ARMOR_TYPE] = robeType;
	flags[kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN] = 24;
	doNext(camp.returnToCampUseOneHour);
}
private  collectSilkArmor(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText("Rathazul beams and announces, \"<i>Good news everyone!  Your ");
	if (flags[kFLAGS.RATHAZUL_SILK_ARMOR_TYPE] == 1)
		 outputText("armor");
	else if (flags[kFLAGS.RATHAZUL_SILK_ARMOR_TYPE] == 2)
		 outputText("robe");
	else outputText("undergarment");
	outputText(" is finished!</i>\"\n\n");
var  itype:ItemType;
	switch(flags[kFLAGS.RATHAZUL_SILK_ARMOR_TYPE]) {
		case 1: //Armor
			outputText(images.showImage("item-silkArmor"));
			outputText("A glittering white suit of armor sits atop a crude armor rack, reflecting the light that plays across its surface beautifully.  You definitely didn't expect anything like this!  It looks nearly identical to a set of light platemail, though instead of having a cold metal surface, the armor feels slightly spongy, with just a little bit of give in it.\n\n");
			outputText("While you marvel at the strange equipment, Rathazul explains, \"<i>When you said you wanted armor, I realized I could skip a few of the alchemical processes used to soften material.  The savings let me acquire a cheap metal set of armor to use as a base, and I molded half the armor around each piece, then removed it and created the outer, defensive layers with the rest of the webbing.  Unfortunately, I didn't have enough silk for a solid codpiece, but I did manage to make a you thin loincloth from the leftover scraps  - for modesty.</i>\"\n\n");
			itype = armors.SSARMOR;
			break;
		case 2: //Robes
			outputText(images.showImage("item-silkRobes"));
			outputText("Hanging from a small rack is a long, flowing robe.  It glitters brightly in the light, the pearl-white threads seeming to shimmer and shine with every ripple the breeze blows through the soft fabric.  You run your fingers over the silken garment, feeling the soft material give at your touch.  There's a hood with a golden border embroidered around the edge.  For now, it hangs limply down the back, but it would be easy to pull up in order to shield the wearer's eyes from harsh sunlight or rainy drizzle.  The sleeves match the cowl, circled with intricate threads laid out in arcane patterns.\n\n");
			outputText("Rathazul gingerly takes down the garment and hands it to you.  \"<i>Don't let the softness of the material fool you.  This robe is tougher than many armors, and the spider-silk's properties may even help you in your spell-casting as well.</i>\"\n\n");
			itype = armors.SS_ROBE;
			break;
		case 3: //Bra
			outputText(images.showImage("item-silkBra"));
			outputText("On a table is a pair of white bra.  It glitters brightly in the light, the pearl-white threads seeming to shimmer and shine with every ripple the breeze blows through the soft fabric.  You run your fingers over the silken garment, feeling the soft material give at your touch.  \n\n");
			outputText("Rathazul gingerly takes the garment and hands it to you.  \"<i>Don't let the softness of the material fool you.  These bras are very durable and should be comfortable as well.</i>\"\n\n");
			itype = undergarments.SS_BRA;
			break;
		case 4: //Panties
			outputText(images.showImage("item-silkPanties"));
			outputText("On a table is a pair of white panties.  It glitters brightly in the light, the pearl-white threads seeming to shimmer and shine with every ripple the breeze blows through the soft fabric.  You run your fingers over the silken garment, feeling the soft material give at your touch.  \n\n");
			outputText("Rathazul gingerly takes the garment and hands it to you.  \"<i>Don't let the softness of the material fool you.  These panties are very durable and should be comfortable as well.</i>\"\n\n");
			itype = undergarments.SSPANTY;
			break;
		case 5: //Loincloth
			outputText(images.showImage("item-silkLoincloth"));
			outputText("On a table is a white loincloth.  It glitters brightly in the light, the pearl-white threads seeming to shimmer and shine with every ripple the breeze blows through the soft fabric.  You run your fingers over the silken garment, feeling the soft material give at your touch.  \n\n");
			outputText("Rathazul gingerly takes the garment and hands it to you.  \"<i>Don't let the softness of the material fool you.  This loincloth is very durable and should be comfortable as well.</i>\"\n\n");
			itype = undergarments.SS_LOIN;
			break;
		default:
			outputText("Something bugged! Please report this bug to Kitteh6660.");
			itype = armors.SS_ROBE;
	}
	//Reset counters
	player.addStatusValue(StatusEffects.MetRathazul,2,1);
	flags[kFLAGS.RATHAZUL_SILK_ARMOR_TYPE] = 0;
	flags[kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN] = 0;
	inventory.takeItem(itype, returnToRathazulMenu);
}

private  craftDragonscaleArmor(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("rathazul-lab"));
	outputText("The rat looks at the sheets of dragon scales you're carrying and says, \"<i>I could work these into armor. Or if you want, undergarments. I have the necessary supplies.</i>\"");
	menu();
	if (player.hasItem(useables.D_SCALE, 5)) {
		addButton(0, "Armor", craftDragonscaleArmorForReal, 0, undefined, undefined, armors.DSCLARM.description);
		addButton(1, "Robe", craftDragonscaleArmorForReal, 1, undefined, undefined, armors.DSCLROB.description);
	}
	else {
		outputText("\n\nYou realize you're still a bit short on dragonscales for the armor but you can have undergarments made instead.");
		addDisabledButton(0, "Armor", "You must have 5 sheets of dragonscales to make it.");
		addDisabledButton(1, "Robes", "You must have 5 sheets of dragonscales to make it.");
	}
	addButton(2, "Bra", craftDragonscaleArmorForReal, 2, undefined, undefined, undergarments.DS_BRA.description);
	addButton(3, "Thong", craftDragonscaleArmorForReal, 3, undefined, undefined, undergarments.DSTHONG.description);
	addButton(4, "Loincloth", craftDragonscaleArmorForReal, 4, undefined, undefined, undergarments.DS_LOIN.description);
	addButton(14, "Nevermind", rathazulArmorMenu);
}
private  craftDragonscaleArmorForReal(type: number = 0): void {
	spriteSelect(SpriteDb.s_rathazul);
	if (type == 0 || type == 1)
		 player.destroyItems(useables.D_SCALE, 5); //Armor or robes
	else player.destroyItems(useables.D_SCALE, 2); //Undergarments
	clearOutput();
var  itype:ItemType;
	switch(type) {
		case 0: //Armor
			outputText(images.showImage("item-dragonscalearmor"));
			outputText("The rat takes the scales and works on his bench for an hour while you wait.  Once he has finished, Rathazul is beaming with pride, \"<i>I think you'll be pleased. Go ahead and take a look.</i>\"\n\nHe hands you the armor.  ");
			outputText("The armor is red and the breastplate has nicely decorated pauldrons to give an imposing looks. You touch the armor and feel the scaly texture. \"<i>It's quite flexible and should offer very good protection,</i>\" Rathazul says.");
			itype = armors.DSCLARM;
			break;
		case 1: //Robes
			outputText(images.showImage("item-dragonscalerobes"));
			outputText("The rat takes the scales and works on his bench for an hour while you wait.  Once he has finished, Rathazul is beaming with pride, \"<i>I think you'll be pleased. Go ahead and take a look.</i>\"\n\nHe hands you the robes.  ");
			outputText("The robe is red and appears to be textured with scales.  You touch the robes and feel the scaly texture. \"<i>It's quite flexible and should offer very good protection,</i>\" Rathazul says.");
			itype = armors.DSCLROB;
			break;
		case 2: //Bra
			outputText(images.showImage("item-dragonscalebra"));
			outputText("The rat takes the scales and works on his bench for an hour while you wait.  Once he has finished, Rathazul is beaming with pride, \"<i>I think you'll be pleased. Go ahead and take a look.</i>\"\n\nHe hands you the bra.  ");
			outputText("It's nicely textured with dragon scales. \"<i>I've used leather straps to maintain the flexibility. It should be comfortable and protective,</i>\" Rathazul says.");
			itype = undergarments.DS_BRA;
			break;
		case 3: //Thong
			outputText(images.showImage("item-dragonscalethong"));
			outputText("The rat takes the scales and works on his bench for an hour while you wait.  Once he has finished, Rathazul is beaming with pride, \"<i>I think you'll be pleased. Go ahead and take a look.</i>\"\n\nHe hands you the thong.  ");
			outputText("It's nicely textured with dragon scales. \"<i>I've used leather straps to maintain the flexibility. It should be comfortable and protective,</i>\" Rathazul says.");
			itype = undergarments.DSTHONG;
			break;
		case 4: //Loincloth
			outputText(images.showImage("item-dragonscaleloincloth"));
			outputText("The rat takes the scales and works on his bench for an hour while you wait.  Once he has finished, Rathazul is beaming with pride, \"<i>I think you'll be pleased. Go ahead and take a look.</i>\"\n\nHe hands you the loincloth.  ");
			outputText("It's nicely textured with dragon scales. \"<i>I've used leather straps to maintain the flexibility. It should be comfortable and protective,</i>\" Rathazul says.");
			itype = undergarments.DS_LOIN;
			break;
		default:
			outputText("Something bugged! Please report this bug to Kitteh6660.");
			itype = armors.DSCLARM;
			break;
	}
	player.addStatusValue(StatusEffects.MetRathazul, 2, 1);
	inventory.takeItem(itype, returnToRathazulMenu);
}

public  craftLethiciteStaff(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("rathazul-lab"));
	player.destroyItems(useables.LETHITE, 5);
	player.destroyItems(weapons.W_STAFF, 1);
		outputText("You present Rathazul the Wizard's Staff and pieces of Lethicite. He sets the staff aside and looks over the Lethicite in awe. You stifle a laugh at his expression. You'd think he'd never seen pieces Lethicite before. He jumps at your noise, nearly dropping the Lethicite in the process. He scrambles to keep them in his paws and looks up at you once they're secured against his chest. \"<i>Right,</i>\" he breathes. \"<i>I will see what I can do.</i>\" He then grabs the staff and ushers away, leaving you to sit and wait for him to be done.");
		outputText("\n\nAn hour of worrying noises and concerning clouds of smoke later, and Rathazul comes back to you, covered in purple dust. He tries to shake some of it off, but gets cut short by coughing. You pat his back and ask if he's okay.\n\n\"<i>Fine, fine,</i>\" he mumbles in reply. \"<i>Just fine... Nothing a thorough washing can't resolve.</i>\" He holds out the staff for you. \"<i>Here. I was able to infuse the Lethicite with the staff. Be careful with it. I'm not making a new one until I clear out my lungs.</i>\"\n\nAs soon as you take the staff, he turns away and begins to head toward the river, grumbling to himself.");
		menu();
		addButton(0,"Next",takethatStuff);
}

private  takethatStuff(): void {
	clearOutput();
	outputText(images.showImage("item-lStaff"));
	outputText("You look over the staff. It's topped by a glowing orb of Lethicite whose corruption seems to have seeped down into the rest of the staff. The staff's surface is smooth and hard, nothing of the wood it was made of before. It's no longer a pale brown, but a metallic purple, and");
	if (player.cor < 33) outputText(" seems to ooze corruption. You suppress a shudder. In your pure hands, though, you're confident it will only be used for good.\n\n");
	else if (player.cor >= 33 && player.cor < 66) outputText(" brims with corruption. You take a slow breath to steady yourself. You're holding a strongly influential weapon. In the wrong hands, it could easily corrupt someone, but you're sure you can control it.\n\n");
	else if (player.cor >= 66 && player.cor <= 100) outputText(" radiates corruption. You breathe, feeling its power flow through you and relishing in the sensation. When you open your eyes, you find yourself smiling. You and this staff are going to get along get well.\n\n");
	player.addStatusValue(StatusEffects.MetRathazul, 2, 1);
	inventory.takeItem(weapons.L_STAFF, returnToRathazulMenu);
}

public  craftEbonweaveArmor(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("rathazul-lab"));
	outputText("The rat looks at the Ebonbloom flowers you have and says, \"<i>I could work these into armor. Or if you want, undergarments. I have the necessary supplies. I'll need 500 Gems, though.</i>\"");
	if (player.gems < 500) {
		outputText("\n\n<b>Wait... you don't have 500 gems. Damn.</b>");
		doNext(returnToRathazulMenu);
		return;
	}
	else {
		menu();
		if (player.hasItem(useables.EBNFLWR, 10)) {
			addButton(0, "Armor", craftEbonweaveArmorForReal, 0, undefined, undefined, armors.EBNARMR.description);
			addButton(1, "Jacket", craftEbonweaveArmorForReal, 1, undefined, undefined, armors.EBNJACK.description);
			addButton(2, "Robe", craftEbonweaveArmorForReal, 2, undefined, undefined, armors.EBNROBE.description);
		}
		else {
			outputText("\n\nYou realize you're still a bit short on Ebonbloom for the robes and armor, but you can have indecent robes or undergarments made instead.");
			addDisabledButton(0, "Armor", "You must have 10 Ebonblooms to make it.");
			addDisabledButton(1, "Jacket", "You must have 10 Ebonblooms to make it.");
			addDisabledButton(2, "Robe", "You must have 10 Ebonblooms to make it.");
		}
		if (player.hasItem(useables.EBNFLWR, 8))
			addButton(3, "IndecRo", craftEbonweaveArmorForReal, 3, undefined, undefined, armors.EBNIROB.description);
		else {
			outputText("\n\nYou realize you're still a bit short on Ebonbloom for the indecent robes, but you can have undergarments made instead.");
			addDisabledButton(3, "IndecRo", "You must have 8 Ebonbloom to make it.");
		}
		addButton(5, "Vest", craftEbonweaveArmorForReal, 4, undefined, undefined, undergarments.EBNVEST.description);
		addButton(6, "Corset", craftEbonweaveArmorForReal, 5, undefined, undefined, undergarments.EBNCRST.description);
		addButton(7, "Jockstrap", craftEbonweaveArmorForReal, 6, undefined, undefined, undergarments.EBNJOCK.description);
		addButton(8, "Thong", craftEbonweaveArmorForReal, 7, undefined, undefined, undergarments.EBNTHNG.description);
		addButton(9, "Loincloth", craftEbonweaveArmorForReal, 8, undefined, undefined, undergarments.EBNCLTH.description);
		//Rune Armor
		addButton(10, "RuneStrap", craftEbonweaveArmorForReal, 9, undefined, undefined, undergarments.EBNRJCK.description);
		addButton(11, "RuneThong", craftEbonweaveArmorForReal, 10, undefined, undefined, undergarments.EBNRTNG.description);
		addButton(12, "RuneCloth", craftEbonweaveArmorForReal, 11, undefined, undefined, undergarments.EBNRLNC.description);
		addButton(14, "Nevermind", rathazulArmorMenu);
	}
}

private  craftEbonweaveArmorForReal(type: number = 0): void {
	spriteSelect(SpriteDb.s_rathazul);
	if (type == 0 || type == 1 || type == 2)
		 player.destroyItems(useables.EBNFLWR, 10); //Armor, robes, jacket
	else if (type == 3)
		 player.destroyItems(useables.EBNFLWR, 8); //Indecent robes
	else player.destroyItems(useables.EBNFLWR, 3); //Undergarments
	player.gems -= 500;
	clearOutput();
var  itype:ItemType;
	switch(type) {
		case 0: //Armor
			outputText(images.showImage("item-ebonArmor"));
			outputText("Rathazul takes the flowers, nods slightly, then gets to work. You decide to take a walk in the meantime.\n\nWhen you come back, you notice something unusual. ");
			outputText("Laid out near Rathazul's workbench is a set of platemail, almost invisible due to its lack of shine. You approach the workbench and notice that the surface of the grey metal appears to have an oily texture. The armor is laid out in two layers- a lower layer made of smooth yet resilient ebonweave cloth, and an outer layer of ebonweave plating. Picking up one of the pieces of platemail, you notice that the plate is thin and the armor itself very light.\n\n");
			outputText("Curious of its strength, you take a knife from Rathazul's tools and experimentally hit the breastplate. After a few whacks, the knife is blunted, but the plate shows no damage. Rathazul wasn’t exaggerating when he told you about the unique properties Ebonbloom has... Assembling the full set to start putting it on, you realize that as light as the armor is, it'll restrict your movements as much as any set of platemail would. You call a thanks to Rathazul and collect your new armor.");
			itype = armors.EBNARMR;
			break;
		case 1: //Jacket
			outputText(images.showImage("item-ebonJacket"));
			outputText("Rathazul takes the flowers, nods slightly, then gets to work. You decide to take a walk in the meantime.\n\nWhen you come back, you notice something unusual. ");
			outputText("Laid out beside Rathazul’s workbench is a longcoat next to a breastplate. Both items are a greasy dark gray. Nearby, there is a similarly colored shirt and a pair of pants on a small rack. You approach the workbench and notice that the surface of the leather has an oily texture. The long coat has a much more natural texture to it than the breastplate. It’s made of leather-- that much, you’re certain, and yet it doesn’t seem like it should be. Perhaps Rathazul bonded the Ebonbloom into a normal jacket, altering the leather’s properties. The breastplate is even stranger. It feels like metal, yet is spongy. It bends slightly under your fingers and fills up when your remove your hand. You spot a knife nearby and take it, experimentally try to cut the breastplate. Nothing happens. Even after a few increasingly vigorous attempts, the plate has no marks. You think this armor will work very well. You thank Rathazul and collect your new armor.");
			itype = armors.EBNJACK;
			break;
		case 2: //Robes
			outputText(images.showImage("item-ebonRobe"));
			outputText("Rathazul takes the flowers, nods slightly, then gets to work. You decide to take a walk in the meantime.\n\nWhen you come back, you notice something unusual. ");
			outputText("Hanging on Rathazul’s rack is a long, flowing robe. The dark gray cloth ripples in the wind, but shines in the light as metal would. You run your fingers over the robe, feeling the soft material give at your touch. You also note a hood at the top. It hangs limply down the backside of the robe, but it’d be easy to pull up to shield your eyes from harsh sunlight or rain. Beyond the physical aspects, you can feel a magical power flow through this robe. You get the feeling the power will be quite helpful when casting magic. You thank Rathazul and collect your new robe.");
			itype = armors.EBNROBE;
			break;
		case 3: //Indecent Robes
			outputText(images.showImage("item-ebonRobent"));
			outputText("Rathazul takes the flowers, nods slightly, then gets to work. You decide to take a walk in the meantime.\n\nWhen you come back, you notice something unusual. ");
			outputText("Hanging Rathazul’s rack is a long, flowing robe. The dark gray cloth ripples in the wind, but shines in the light as metal would. Upon closer inspection, you realize that the robe is more of a longcoat, meant to display your chest and groin. You run your fingers over the dark gray garment, feeling the soft material give at your touch. You also note a hood at the top. It hangs limply down the back, but it could be pulled up to shield your eyes from harsh sunlight or rain. Moving your hands through the coat, you find a layer of ebonweave straps lining the inside, likely to keep the front of the robe open and prevent it from disrupting your balance. The straps are so subtle that you doubt you’ll even notice them while wearing the robe. Beyond the physical elements, though, you can feel a magical power flow through the coat. The power gives you the impression that it will be very useful when casting spells. You thank Rathazul and collect your new robe.");
			itype = armors.EBNIROB;
			break;
		case 4: //Vest
			outputText(images.showImage("item-ebonVest"));
			outputText("Rathazul takes the flowers, nods slightly, then gets to work. You decide to take a walk in the meantime.\n\nWhen you come back, you notice something unusual. ");
			outputText("Hanging on Rathazul's rack is a vest. As you inspect it, you notice the dark gray cloth has an oily sheen. You run your hand over the garment and see see that the fabric is smoother than Ingnam's finest cloth. And yet, it has a strange slickness to it unlike any fabric you know of. You also note the vest is elastic, allowing it to fit your form regardless of how large your assets are. You thank Rathazul and collect your new vest.");
			itype = undergarments.EBNVEST;
			break;
		case 5: //Corset
			outputText(images.showImage("item-ebonCorset"));
			outputText("Rathazul takes the flowers, nods slightly, then gets to work. You decide to take a walk in the meantime.\n\nWhen you come back, you notice something unusual. ");
			outputText("Hanging on Rathazul's rack is a corset. As you inspect it, you notice the dark gray cloth has an oily sheen. You run your hand over the garment and see see that the fabric is smoother than Ingnam's finest cloth. And yet, it has a strange slickness to it unlike any fabric you know of. You also note the corset is elastic, allowing it to fit your form regardless of how large your assets are. You thank Rathazul and collect your new corset.");
			itype = undergarments.EBNCRST;
			break;
		case 6: //Jockstrap
			outputText(images.showImage("item-ebonJockstrap"));
			outputText("Rathazul takes the flowers, nods slightly, then gets to work. You decide to take a walk in the meantime.\n\nWhen you come back, you notice something unusual. ");
			outputText("Hanging on Rathazul's rack is a jockstrap. As you inspect it, you notice the dark gray cloth has an oily sheen. You run your hand over the garment and see see that the fabric is smoother than Ingnam's finest cloth. And yet, it has a strange slickness to it unlike any fabric you know of. You also note the jockstrap is elastic, allowing it to fit your form regardless of how large your assets are. You thank Rathazul and collect your new jockstrap.");
			itype = undergarments.EBNJOCK;
			break;
		case 7: //Thong
			outputText(images.showImage("item-ebonThong"));
			outputText("Rathazul takes the flowers, nods slightly, then gets to work. You decide to take a walk in the meantime.\n\nWhen you come back, you notice something unusual. ");
			outputText("Hanging on Rathazul's rack is a thong. As you inspect it, you notice the dark gray cloth has an oily sheen. You run your hand over the garment and see see that the fabric is smoother than Ingnam's finest cloth. And yet, it has a strange slickness to it unlike any fabric you know of. You also note the thong is elastic, allowing it to fit your form regardless of how large your assets are. You thank Rathazul and collect your new thong.");
			itype = undergarments.EBNTHNG;
			break;
		case 8: //Loincloth
			outputText(images.showImage("item-ebonLoincloth"));
			outputText("Rathazul takes the flowers, nods slightly, then gets to work. You decide to take a walk in the meantime.\n\nWhen you come back, you notice something unusual. ");
			outputText("Hanging on Rathazul's rack is a loincloth. As you inspect it, you notice the dark gray cloth has an oily sheen. You run your hand over the garment and see see that the fabric is smoother than Ingnam's finest cloth. And yet, it has a strange slickness to it unlike any fabric you know of. You also note the loincloth is elastic, allowing it to fit your form regardless of how large your assets are. You thank Rathazul and collect your new loincloth.");
			itype = undergarments.EBNCLTH;
			break;
		case 9: //Rune Jockstrap
			outputText(images.showImage("item-ebonJockstrapune"));
			outputText("Rathazul takes the flowers, nods slightly, then gets to work. You decide to take a walk in the meantime.\n\nWhen you come back, you notice something unusual. ");
			outputText("Hanging on Rathazul's rack is a jockstrap. As you inspect it, you notice the dark gray cloth has an oily sheen. Adorning the cup is a rune seething with black magic. ");
			if (player.hasStatusEffect(StatusEffects.KnowsArouse)) {
			outputText("You blush, recognizing the rune to represent lust. ");
			}
			outputText("You run your hand over the garment and see see that the fabric is smoother than Ingnam's finest cloth. And yet, it has a strange slickness to it unlike any fabric you know of. You also note the jockstrap is elastic, allowing it to fit your form regardless of how large your assets are. You thank Rathazul and collect your new jockstrap.");
			itype = undergarments.EBNRJCK;
			break;
		case 10: //Rune Thong
			outputText(images.showImage("item-ebonThongune"));
			outputText("Rathazul takes the flowers, nods slightly, then gets to work. You decide to take a walk in the meantime.\n\nWhen you come back, you notice something unusual. ");
			outputText("Hanging on Rathazul's rack is a thong. As you inspect it, you notice the dark gray cloth has an oily sheen. Adorning the front is a rune seething with black magic. ");
			if (player.hasStatusEffect(StatusEffects.KnowsArouse)) {
			outputText("You blush, recognizing the rune to represent lust. ");
			}
			outputText("You run your hand over the garment and see see that the fabric is smoother than Ingnam's finest cloth. And yet, it has a strange slickness to it unlike any fabric you know of. You also note the thong is elastic, allowing it to fit your form regardless of how large your assets are. You thank Rathazul and collect your new thong.");
			itype = undergarments.EBNRTNG;
			break;
		case 11: //Rune Loincloth
			outputText(images.showImage("item-ebonLoinclothune"));
			outputText("Rathazul takes the flowers, nods slightly, then gets to work. You decide to take a walk in the meantime.\n\nWhen you come back, you notice something unusual. ");
			outputText("Hanging on Rathazul's rack is a loincloth. As you inspect it, you notice the dark gray cloth has an oily sheen. Adorning the front is a rune seething with black magic. ");
			if (player.hasStatusEffect(StatusEffects.KnowsArouse)) {
			outputText("You blush, recognizing the rune to represent lust. ");
			}
			outputText("You run your hand over the garment and see see that the fabric is smoother than Ingnam's finest cloth. And yet, it has a strange slickness to it unlike any fabric you know of. You also note the loincloth is elastic, allowing it to fit your form regardless of how large your assets are. You thank Rathazul and collect your new loincloth.");
			itype = undergarments.EBNRLNC;
			break;
		default:
			outputText("Something bugged! Please report this bug to Kitteh6660.");
			itype = armors.EBNARMR;
			break;
	}
	player.addStatusValue(StatusEffects.MetRathazul, 2, 1);
	inventory.takeItem(itype, returnToRathazulMenu);
}

private  craftMaraeArmor(divine: boolean = false): void {
	clearOutput();
	outputText(images.showImage("rathazul-lab"));
	if (!divine) {
		outputText("You show him the pieces of thick bark with tentacles attached. \n\n \"<i>My, my. That's definitely the strangest thing I've ever seen. But as you've requested, I'll make armor for you,</i>\" the old rat says. He takes the pile of bark, taking care to avoid touching the still-alive tentacles. He works on his bench for an hour while you wait. \n\n")
		outputText("Once he has finished, Rathazul is beaming with both pride and shame, \"<i>I think you'll be pleased. Go ahead and take a look. I'm not working on this type of armor again. I nearly got surprised by tentacles.</i>\"\n\nHe hands you the armor. \n\n")
		menu();
		addButton(0,"Next",takethatMarmorC);
	}
	else {
		outputText("You show him the pieces of glowing white thick bark attached. \n\n \"<i>My, my. I heard a voice from Marae instructing me to make the armor for you,</i>\" the old rat says. He takes the pile of bark and works on his bench for an hour while you wait. \n\n")
		outputText("Once he has finished, Rathazul is beaming with both pride and shame, \"<i>I think you'll be pleased. Go ahead and take a look. I'm not working on this type of armor again. It took me many attempts to bend the bark plates to get them right.</i>\"\n\nHe hands you the armor. \n\n")
		menu();
		addButton(0,"Next",takethatMarmorD);
	}
}

private  takethatMarmorC(): void {
		clearOutput();
		outputText(images.showImage("item-bArmor-corrupt"));
		outputText("The plates are white like snow. Green tentacles grow from the shoulderpads. The armor includes a breastplate, pauldrons, full arm guards, and knee-high boots. You realize the armor is missing pants. \n\n");
		outputText("\"<i>Something wrong? Nothing to protect your modesty? Surprise!</i>\"  He hands you a silken loincloth");
		if (player.mf("m", "f") == "f") outputText(" with stockings and garters");
		outputText(". You thank him for the armor.\n\n");
		if (player.cockTotal() > 0 && player.biggestCockArea() >= 40) outputText("The silken material does little to hide the bulge of your groin, if anything it looks a little lewd.  Rathazul mumbles and looks away, shaking his head.\n\n");
		if (player.biggestTitSize() >= 8) outputText("Your " + player.biggestBreastSizeDescript() + " barely fit into the breastplate, leaving you displaying a large amount of jiggling cleavage.\n\n");
		player.removeKeyItem("Tentacled Bark Plates");
		inventory.takeItem(armors.TBARMOR, returnToRathazulMenu);
}

private  takethatMarmorD(): void {
		clearOutput();
		outputText(images.showImage("item-bArmor-pure"));
		outputText("The plates are white like snow. The armor includes a breastplate, pauldrons, full arm guards, and knee-high boots. You notice there are no pants.  As you turn to ask him where the pants are, you see him scratching his head and hastily rustling in drawers.  He mutters under his breath, \"<i>I'm sorry, I'm sorry, I got so focused on working on the pauldrons that I forgot to make any leg coverings!  Here, this should look good with it, and it won't restrict your movements.</i>\"  He hands you a silken loincloth");
		if (player.mf("m", "f") == "f") outputText(" with stockings and garters");
		outputText(".  He still manages to look somewhat pleased with himself in spite of the blunder, even bragging a little bit, \"<i>Let me show you the different lengths of string I used.</i>\"\n\n");
		if (player.cockTotal() > 0 && player.biggestCockArea() >= 40) outputText("The silken material does little to hide the bulge of your groin, if anything it looks a little lewd.  Rathazul mumbles and looks away, shaking his head.\n\n");
		if (player.biggestTitSize() >= 8) outputText("Your " + player.biggestBreastSizeDescript() + " barely fit into the breastplate, leaving you displaying a large amount of jiggling cleavage.\n\n");
		player.removeKeyItem("Divine Bark Plates");
		inventory.takeItem(armors.DBARMOR, returnToRathazulMenu);
}
//------------ SHOP ------------
private  rathazulShopMenu(dyes: boolean = false, philters: boolean = false, reductos: boolean = false): void {
	if (dyes) { //Dyes
		addButton(0, "Hair Dyes", buyDyes).hint("Ask him to make a dye for you. \n\nCost: 50 Gems.");
		addButton(1, "Skin Oils", buyOils).hint("Ask him to make a skin oil for you. \n\nCost: 50 Gems.");
		addButton(2, "Body Lotions", buyLotions).hint("Ask him to make a body lotion for you. \n\nCost: 50 Gems.");
	}
	else {
		addButtonDisabled(0, "Hair Dyes", "You can't afford to buy dyes. \n\n50 gems required.");
		addButtonDisabled(1, "Skin Oils", "You can't afford to buy oil. \n\n50 gems required.");
		addButtonDisabled(2, "Body Lotions", "You can't afford to buy lotions. \n\n50 gems required.");
	}
	if (reductos) { //Reducto & GroPlus
		addButton(3, "Reducto", buyReducto);
		addButton(4, "GroPlus", buyGroPlus);
	}
	else {
		addButtonDisabled(3, "Reducto", "Rathazul isn't currently producing this item.");
		addButtonDisabled(4, "GroPlus", "Rathazul isn't currently producing this item.");
	}
	if (philters) { //Philters
		addButton(5, consumables.H_PILL.shortName, buyPuritySomething, consumables.H_PILL);
		addButton(6, consumables.PPHILTR.shortName, buyPuritySomething, consumables.PPHILTR);
		addButton(7, consumables.NUMBOIL.shortName, buyPuritySomething, consumables.NUMBOIL);
	}
	else {
		addButtonDisabled(5, consumables.H_PILL.shortName, "You can't afford to buy this.\n\n100 gems required.");
		addButtonDisabled(6, consumables.PPHILTR.shortName, "You can't afford to buy this.\n\n100 gems required.");
		addButtonDisabled(7, consumables.NUMBOIL.shortName, "You can't afford to buy this.\n\n100 gems required.");
	}
	addButton(14, "Back", returnToRathazulMenu);
}
//Hair dyes
private  buyDyes(fromPage2: boolean = false): void {
	clearOutput();
	outputText(images.showImage("rathazul-dyes"));
	spriteSelect(SpriteDb.s_rathazul);
	if (!fromPage2) {
		outputText("Rathazul smiles and pulls forth several vials of colored fluids.  Which type of dye would you like?");
		outputText("\n\n<b>(-50 Gems)</b>");
		player.gems -= 50;
		statScreenRefresh();
	}
	menu();
	addButton(0, "Auburn", buyDye, consumables.AUBURND);
	addButton(1, "Black", buyDye, consumables.BLACK_D);
	addButton(2, "Blond", buyDye, consumables.BLOND_D);
	addButton(3, "Brown", buyDye, consumables.BROWN_D);
	// Button 4: Next
	addButton(5, "Red", buyDye, consumables.RED_DYE);
	addButton(6, "White", buyDye, consumables.WHITEDY);
	addButton(7, "Gray", buyDye, consumables.GRAYDYE);
	if (player.statusEffectv2(StatusEffects.MetRathazul) >= 8) {
		addButton(4, "Next", buyDyesPage2);
		addButton(8, "Blue", buyDye, consumables.BLUEDYE);
		// Button 9 left empty in case, we add a third page here
		addButton(10, "Green", buyDye, consumables.GREEN_D);
		addButton(11, "Orange", buyDye, consumables.ORANGDY);
		addButton(12, "Yellow", buyDye, consumables.YELLODY);
		addButton(13, "Purple", buyDye, consumables.PURPDYE);
	}
	addButton(14, "Nevermind", buyDyeNevermind);
}
private  buyDyesPage2(): void {
	clearOutput();
	outputText(images.showImage("rathazul-dyes"));
	if (player.statusEffectv2(StatusEffects.MetRathazul) < 8) { // Failsafe, should probably never happen (Stadler76)
		buyDyes(true);
		return;
	}
	spriteSelect(SpriteDb.s_rathazul);
	menu();
	addButton(0, "Pink", buyDye, consumables.PINKDYE);
	addButton(1, "Russet", buyDye, consumables.RUSSDYE);
	if (player.statusEffectv2(StatusEffects.MetRathazul) >= 12)
		addButton(2, "Rainbow", buyDye, consumables.RAINDYE);
	addButton(4, "Previous", buyDyes, true);
	// Button 9 left empty in case, we add a third page here
	addButton(14, "Nevermind", buyDyeNevermind);
}
private  buyDye(dye:ItemType): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	inventory.takeItem(dye, returnToRathazulMenu);
	outputText(images.showImage("item-dye"));
	statScreenRefresh();
	addMixologyXP(4);
	player.addStatusValue(StatusEffects.MetRathazul, 2, 1);
}
private  buyDyeNevermind(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("encounter-rathazul"));
	outputText("You change your mind about the dye, and Rathazul returns your gems.\n\n<b>(+50 Gems)</b>");
	player.gems += 50;
	statScreenRefresh();
	doNext(returnToRathazulMenu);
}
//Skin Oils
private  buyOils(fromPage2: boolean = false): void {
	clearOutput();
	outputText(images.showImage("rathazul-oils"));
	spriteSelect(SpriteDb.s_rathazul);
	if (!fromPage2) {
		outputText("Rathazul smiles and pulls forth several bottles of skin oil.  Which type of skin oil would you like?");
		outputText("\n\n<b>(-50 Gems)</b>");
		player.gems -= 50;
		statScreenRefresh();
	}
	menu();
	addButton(0, "Dark", buyOil, consumables.DARK_OL);
	addButton(1, "Ebony", buyOil, consumables.EBONYOL);
	addButton(2, "Fair", buyOil, consumables.FAIR_OL);
	addButton(3, "Light", buyOil, consumables.LIGHTOL);
	if (mixologyXP() >= 80)
		addButton(4, "Next", buyOilsPage2);
	addButton(5, "Mahogany", buyOil, consumables.MAHOGOL);
	addButton(6, "Olive", buyOil, consumables.OLIVEOL);
	addButton(7, "Russet", buyOil, consumables.RUSS_OL);
	if (mixologyXP() >= 50) {
		addButton(8, "Red", buyOil, consumables.RED__OL);
		// Button 9 left empty in case, we add a third page here
		addButton(10, "Green", buyOil, consumables.GREENOL);
		addButton(11, "White", buyOil, consumables.WHITEOL);
		addButton(12, "Blue", buyOil, consumables.BLUE_OL);
		addButton(13, "Black", buyOil, consumables.BLACKOL);
	}
	addButton(14, "Nevermind", buyOilNevermind);
}
private  buyOilsPage2(): void {
	clearOutput();
	outputText(images.showImage("rathazul-oils"));
	if (mixologyXP() < 80) { //Failsafe, should probably never happen (Stadler76)
		buyOils(true);
		return;
	}
	spriteSelect(SpriteDb.s_rathazul);
	menu();
	addButton(0, "Purple", buyOil, consumables.PURPLOL);
	addButton(1, "Silver", buyOil, consumables.SILVROL);
	if (mixologyXP() >= 100) {
		addButton(2, "Orange", buyOil, consumables.ORANGOL);
		addButton(3, "Yellow", buyOil, consumables.YELLOOL);
	}
	addButton(4, "Previous", buyOils, true);
	if (mixologyXP() >= 120) { //Rathazul discovers mixing blue and green ... wow!! o.O
		addButton(5, "Yellow Green", buyOil, consumables.YELGROL);
		addButton(6, "Spring Green", buyOil, consumables.SPRGROL);
		addButton(7, "Cyan", buyOil, consumables.CYAN_OL);
		addButton(8, "Ocean Blue", buyOil, consumables.OCBLUOL);
	}	// Button 9 left empty in case, we add a third page here
	if (mixologyXP() >= 150) { //Rathazul discovers mixing blue and red ... oh my gawd!!! o.O
		addButton(10, "Electric Violet", buyOil, consumables.ELVIOOL);
		addButton(11, "Magenta", buyOil, consumables.MAGENOL);
		addButton(12, "Deep Pink", buyOil, consumables.DPPNKOL);
		addButton(13, "Pink", buyOil, consumables.PINK_OL);
	}
	addButton(14, "Nevermind", buyOilNevermind);
}
private  buyOil(oil:ItemType): void {
	clearOutput();
	spriteSelect(SpriteDb.s_rathazul);
	inventory.takeItem(oil, returnToRathazulMenu);
	outputText(images.showImage("item-oil"));
	statScreenRefresh();
	addMixologyXP(4);
	player.addStatusValue(StatusEffects.MetRathazul, 2, 1);
}
private  buyOilNevermind(): void {
	clearOutput();
	outputText(images.showImage("encounter-rathazul"));
	spriteSelect(SpriteDb.s_rathazul);
	outputText("You change your mind about the oil, and Rathazul returns your gems.\n\n<b>(+50 Gems)</b>");
	player.gems += 50;
	statScreenRefresh();
	doNext(returnToRathazulMenu);
}
//Body Lotions
private  buyLotions(): void {
	clearOutput();
	outputText(images.showImage("rathazul-lotions"));
	spriteSelect(SpriteDb.s_rathazul);
	outputText("Rathazul smiles and pulls forth several vials of body lotion.  Which type of body lotion would you like?");
	outputText("\n\n<b>(-50 Gems)</b>");
	player.gems -= 50;
	statScreenRefresh();
	menu();
	addButton(0, "Clear", buyLotion, consumables.CLEARLN);
	addButton(1, "Rough", buyLotion, consumables.ROUGHLN);
	addButton(2, "Sexy", buyLotion, consumables.SEXY_LN);
	addButton(3, "Smooth", buyLotion, consumables.SMTH_LN);
	addButton(14, "Nevermind", buyLotionNevermind);
}
private  buyLotion(lotion:ItemType): void {
	clearOutput();
	spriteSelect(SpriteDb.s_rathazul);
	inventory.takeItem(lotion, returnToRathazulMenu);
	outputText(images.showImage("item-lotion"));
	statScreenRefresh();
	addMixologyXP(4);
	player.addStatusValue(StatusEffects.MetRathazul, 2, 1);
}
private  buyLotionNevermind(): void {
	clearOutput();
	outputText(images.showImage("encounter-rathazul"));
	spriteSelect(SpriteDb.s_rathazul);
	outputText("You change your mind about the lotion, and Rathazul returns your gems.\n\n<b>(+50 Gems)</b>");
	player.gems += 50;
	statScreenRefresh();
	doNext(returnToRathazulMenu);
}
//Reducto
private  buyReducto(): void {
	clearOutput();
	spriteSelect(SpriteDb.s_rathazul);
var  cost: number = (flags[kFLAGS.AMILY_MET_RATHAZUL] >= 2 ? 50 : 100);
	if (player.gems >= cost) {
		outputText("Rathazul hands you the Reducto with a nod before returning to his work.\n\n");
		player.gems -= cost;
		inventory.takeItem(consumables.REDUCTO, returnToRathazulMenu);
		outputText(images.showImage("item-reducto"));
		statScreenRefresh();
		addMixologyXP(4);
		player.addStatusValue(StatusEffects.MetRathazul, 2, 1);
	}
	else {
		outputText(images.showImage("encounter-rathazul"));
		outputText("\"<i>I'm sorry, but you lack the gems I need to make the trade,</i>\" apologizes Rathazul.");
		doNext(returnToRathazulMenu);
	}
}
//GroPlus
private  buyGroPlus(): void {
	clearOutput();
	spriteSelect(SpriteDb.s_rathazul);
var  cost: number = (flags[kFLAGS.AMILY_MET_RATHAZUL] >= 2 ? 50 : 100);
	if (player.gems >= cost) {
		outputText(images.showImage("item-gro-plus"));
		outputText("Rathazul hands you the GroPlus with a nod before returning to his work.\n\n");
		player.gems -= cost;
		inventory.takeItem(consumables.GROPLUS, returnToRathazulMenu);
		statScreenRefresh();
		addMixologyXP(4);
		player.addStatusValue(StatusEffects.MetRathazul, 2, 1);
	}
	else {
		outputText("\"<i>I'm sorry, but you lack the gems I need to make the trade,</i>\" apologizes Rathazul.");
		doNext(returnToRathazulMenu);
	}
}

private  buyPuritySomething(item:ItemType): void {
	player.gems -= 100;
	statScreenRefresh();
	inventory.takeItem(item, returnToRathazulMenu);
	if (item == consumables.H_PILL) outputText(images.showImage("item-hPill"));
	else if (item == consumables.PPHILTR) outputText(images.showImage("item-pPhiltr"));
	else if (item == consumables.NUMBOIL) outputText(images.showImage("item-numbOil"));
	addMixologyXP(4);
	player.addStatusValue(StatusEffects.MetRathazul, 2, 1);
}
//------------ PURIFY ------------
private  purifySomething(): void {
	clearOutput();
	spriteSelect(SpriteDb.s_rathazul);
	outputText("Rathazul asks, \"<i>What would you like me to purify?</i>\"");
	menu();
	//Item purification offer
	if (player.hasItem(consumables.INCUBID))
		addButton(0, "Incubi Draft", rathazulPurifyItem, consumables.INCUBID, consumables.P_DRAFT);
	if (player.hasItem(consumables.SUCMILK))
		addButton(1, "SuccubiMilk", rathazulPurifyItem, consumables.SUCMILK, consumables.P_S_MLK);
	if (player.hasItem(consumables.SDELITE))
		addButton(2, "S. Delight", rathazulPurifyItem, consumables.SDELITE, consumables.PSDELIT);
	if (player.hasItem(consumables.LABOVA_))
		addButton(3, "LaBova", rathazulPurifyItem, consumables.LABOVA_, consumables.P_LBOVA);
	if (player.hasItem(consumables.MINOCUM))
		addButton(4, "MinoCum", rathazulPurifyItem, consumables.MINOCUM, consumables.P_M_CUM);
	addButton(14, "Back", returnToRathazulMenu);
}
private  rathazulPurifyItem(itype:ItemType, result:ItemType): void {
	if (player.gems < 20) {
		outputText("Rathazul says, \"<i>You do not have enough gems for that service.</i>\"");
		doNext(returnToRathazulMenu);
		return;
	}
	if (!debug) player.destroyItems(itype, 1);
	inventory.takeItem(result, returnToRathazulMenu);
	outputText(images.showImage("item-purity"));
	player.gems -= 20;
	statScreenRefresh();
	addMixologyXP(8);
	player.addStatusValue(StatusEffects.MetRathazul, 2, 1);
}
//For Minerva purification
public  purificationByRathazulBegin(): void {
	clearOutput();
	outputText(images.showImage("rathazul-lab"));
	outputText("Hoping the rodent-morph alchemist can assist you, you waste no time in approaching him. Rathazul looks up when he sees you, raising an eye curiously. \"<i>Is something the matter, " + player.short + "?</i>\"");
	outputText("\n\nYou nod, and ask him if he knows anything about either killing pests or purifying the corruption from people as well as objects. At his bemused expression, you explain about Minerva and her conditions, repeating your query if he could possibly help you. Rathazul looks downcast and shakes his head.");
	outputText("\n\n\"<i>I am afraid that I have never truly succeeded in my efforts to create a potion to purify the corrupted themselves.</i>\" The rat alchemist explains sadly. \"<i>The problem is there is very little, if anything, in this world that is capable of removing corruption from a consumer... But, I do have a theoretical recipe. If you can just find me some foodstuffs that would lower corruption and soothe the libido, and bring them to me, then I might be able to complete it. I can suggest pure giant bee honey as one, but I need at least two other items that can perform at least one of those effects. You said that the spring was able to keep your friend's corruption in check? Maybe some of the plants that grow there would be viable; bring me some samples, and a fresh dose of pure honey, and we’ll see what I can do.</i>\" He proclaims, managing to shake off his old depression and sound determined.");
	outputText("\n\nWith that in mind, you walk away from him; gathering the items that could cure Minerva is your responsibility.");
	flags[kFLAGS.MINERVA_PURIFICATION_RATHAZUL_TALKED] = 2;
	doNext(camp.returnToCampUseOneHour);
}

private  rathazulMakesPurifyPotion(): void {
	clearOutput();
	player.destroyItems(consumables.PURHONY, 1);
	player.destroyItems(consumables.C__MINT, 1);
	player.destroyItems(consumables.PURPEAC, 1);
	outputText(images.showImage("item-purePotion"));
	outputText("You hurry over to Rathazul, and tell him you have the items you think he needs. His eyes widen in shock as you show them to him, and he immediately snatches them from you without a word, hurrying over to his alchemical equipment. You watch, uncertain of what he’s doing, as he messes around with it, but within minutes he has produced a strange-looking potion that he brings back to you.");
	outputText("\n\n\"<i>Have her swallow this, and it should kill the parasite within her at the very least.</i>\"");
	outputText("\n\nYou take it gratefully, but can’t help asking what he means by ‘should’.");
	outputText("\n\nRathazul shrugs helplessly. \"<i>This formula is untested; its effects are unpredictable... But, surely it cannot make things worse?</i>\"");
	outputText("\n\nYou concede he has a point and take the potion; all you need to do now is give it to Minerva and hope for the best.");
	player.createKeyItem("Rathazul's Purity Potion", 0, 0, 0, 0);
	menu();
	addButton(0, "Next", campRathazul);
}
//------------ ALCHEMY ------------
private  rathazulAlchemyMenu(): void {
	menu();
	if (player.hasItem(consumables.BEEHONY)) //Distill Honey
		 addButton(0, "Distill Honey", rathazulMakesPureHoney).hint("Ask him to distill a vial of bee honey into a pure honey. \n\nCost: 25 Gems \nNeeds 1 vial of Bee Honey");
	else addButtonDisabled(0, "Distill Honey", "You don't have any bee honey to be distilled.");
	if (flags[kFLAGS.RATHAZUL_DEBIMBO_OFFERED] > 0) { //Debimbo
		if (player.hasItem(consumables.SMART_T,5) && player.gems >= 250)
			 addButton(1, "Debimbo", makeADeBimboDraft).hint("Ask Rathazul to make a debimbofying potion for you. \n\nCost: 250 Gems \nNeeds 5 Scholar Teas.");
		else addButtonDisabled(1, "Debimbo", "You don't have everything needed for this item. \n\nCost: 250 Gems \nNeeds 5 Scholar Teas.");
	}
	else addButtonDisabled(1, "Debimbo", "Rathazul sees no reason to make this. Maybe if someone's a bimbo in this camp...");
	//Purification Potion for Minerva
	if (flags[kFLAGS.MINERVA_PURIFICATION_RATHAZUL_TALKED] == 2 && flags[kFLAGS.MINERVA_PURIFICATION_PROGRESS] < 10) {
		if ((player.hasItem(consumables.PURHONY, 1) || player.hasItem(consumables.PPHILTR, 1)) && player.hasItem(consumables.C__MINT, 1) && player.hasItem(consumables.PURPEAC, 1) && player.hasKeyItem("Rathazul's Purity Potion") < 0)
			addButton(2, "Pure Potion", rathazulMakesPurifyPotion).hint("Ask him to brew a purification potion for Minerva.");
		else if (player.hasKeyItem("Rathazul's Purity Potion") >= 0)
			 addButtonDisabled(2, "Pure Potion", "You already have the potion made. Bring it to Minerva.");
		else addButtonDisabled(2, "Pure Potion", "You don't have the ingredients needed to make the purification potion. \n\nNeeds 1 Pure Honey or Pure Philter, 1 Calm Mint, 1 Pure Peach.");
	}
	//Special Transformations
	if (player.statusEffectv2(StatusEffects.MetRathazul) >= 5) {
		if (player.gems >= 250 && player.hasItem(consumables.LACTAID, 5) && player.hasItem(consumables.P_LBOVA, 2)) //Pro Lactaid
			 addButton(5, "ProLactaid", rathazulMakesMilkPotion).hint("Ask him to brew a special lactation potion. \n\nCost: 250 Gems \nNeeds 5 Lactaids and 2 Purified LaBovas.");
		else addButtonDisabled(5, "ProLactaid", "You don't have everything needed for this item. \n\nCost: 250 Gems \nNeeds 5 Lactaids and 2 Purified LaBovas.");
		if (player.gems >= 100 && player.hasItem(consumables.EQUINUM, 2) && player.hasItem(consumables.MINOBLO, 1)) //Taurinum
			 addButton(6, "Taurinum", rathazulMakesTaurPotion).hint("Ask him to brew a special potion that could aid in becoming a centaur. \n\nCost: 100 Gems \nNeeds 2 Equinum and 1 Minotaur Blood.");
		else addButtonDisabled(6, "Taurinum", "You don't have everything needed for this item. \n\nCost: 100 Gems \nNeeds 2 Equinum and 1 Minotaur Blood.");
	}
	else {
		addButtonDisabled(5, "ProLactaid", "Rathazul doesn't know how to make this yet. Try buying more from him.");
		addButtonDisabled(6, "Taurinum", "Rathazul doesn't know how to make this yet. Try buying more from him.");
	}
	if (player.statusEffectv2(StatusEffects.MetRathazul) >= 5 && flags[kFLAGS.TIMES_ENCOUNTERED_COCKATRICES] > 0) {
		if (player.gems >= 100 && player.hasItem(consumables.REPTLUM, 1) && player.hasItem(consumables.GLDSEED, 1))
			 addButton(7, "Ton o' Trice", rathazulMakesCockatricePotion).hint("Ask him to brew a special potion that could aid in becoming a cockatrice. \n\nCost: 100 Gems \nNeeds 1 Reptilum and 1 Golden Seed.");
		else addButtonDisabled(7, "Ton o' Trice", "You don't have everything needed for this item.\n\nCost: 100 Gems\nNeeds 1 Reptilum and 1 Golden Seed.");
	}
	else addButtonDisabled(7, "Ton o' Trice", "Rathazul doesn't know how to make this yet. Try buying more from him.");
	if (player.statusEffectv2(StatusEffects.MetRathazul) >= 5) {
		if (player.gems >= 100 && player.hasItem(consumables.S_GOSSR, 2) && player.hasItem(consumables.HUMMUS_, 1))
			 addButton(8, "Oculum A.", rathazulMakesEyePotion).hint("Ask him to brew a special potion that could grant you a second set of eyes. \n\nCost: 100 Gems\nNeeds 2 Sweet Gossamers and 1 Hummanus.", "Oculum Arachnae");
		else addButtonDisabled(8, "Oculum A.", "You don't have everything needed for this item.\n\nCost: 100 Gems\nNeeds 2 Sweet Gossamers and 1 Hummanus.", "Oculum Arachnae");
	}
	else addButtonDisabled(8, "Oculum A.", "Rathazul doesn't know how to make this yet. Try buying more from him.", "Oculum Arachnae");
	addButton(14, "Back", returnToRathazulMenu);
}

private  rathazulDebimboOffer(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("rathazul-lab"));
	if (flags[kFLAGS.RATHAZUL_DEBIMBO_OFFERED] == 0) {
		if (sophieBimbo.bimboSophie()) {
			outputText("Rathazul glances your way as you approach his lab, a thoughtful expression on his age-lined face.  \"<i>Tell me, [name], do you truly enjoy having that vacuous idiot around, lusting after you at all hours of the day?</i>\" he asks, shaking his head in frustration.  \"<i>She's clearly been subjected to the effects of Bimbo Liqueur, which as you can plainly see are quite indeed potent.  However, like most things in Mareth, it can be countered - at least partially.</i>\"  Rathazul folds his long, clawed fingers together, his tail lashing behind him as he thinks.  \"<i>Perhaps with a sufficient quantity of something called Scholar's Tea... I could counter the stupefying effects of the elixir... oh my, yes... hmm...</i>\"  Rathazul nods, stroking at the few long wisps of fur that hang from his chin.");
			outputText("\n\nYou await");
			if (silly()) outputText(" getGoodPost()"); // C# await joke ;_; http://msdn.microsoft.com/en-gb/library/hh156528.aspx
			outputText(" further clarification, but the old rat just stands there, staring off into space.  Coughing politely, you reacquire his attention, causing him to jump.");
			outputText("\n\n\"<i>Oh?  Nmm, YES, bimbos, that's right!  As I was saying, five Scholar's Teas along with 250 gems for other reagents should give me all I need to create a bimbo-beating brew!  Oh my, the alliteration!  How absurd.</i>\"  Rathazul chuckles slowly, wiping a drop from his eye before he looks back at you fiercely, \"<i>It is a worthwhile goal - no creature should be subjected to a reduced intellect.  Let me know when you have acquired what is needed.</i>\"");
		}
		else if (flags[kFLAGS.IZMA_BROFIED] > 0) outputText("\n\nRathazul glances your way as you approach his lab, a thoughtful expression on his age-lined face.  \"<i>I see Izma...el appears to be exhibiting his bro behaviors as if he's completely different. Did you change him? If you ever need me to reverse the effects, bring me five scholar teas and 250 gems. I'm sure you'll also need Bimbo Liqueur along with my debimbofying solution.</i>\"");
		else {
			//Notification if the PC is the one bimbo'ed*
			if (player.findPerk(PerkLib.BimboBrains) >= 0 || player.findPerk(PerkLib.FutaFaculties) >= 0) {
				outputText("\n\nRathazul glances your way as you approach his lab, a thoughtful expression on his age-lined face.  \"<i>Tell me [name], do you truly enjoy living your life under the debilitating effects of that cursed potion?  Even now the spark of intelligence has all but left from your eyes.  Do you even understand what I'm saying?</i>\"");
				outputText("\n\nYou twirl a lock of hair around your finger and giggle.  This silly old rat thinks you're like, dumb and stuff!  He just doesn't know how great it is to have a rocking body and a sex-drive that's always ready to suck and fuck.  It's so much fun!  You look back at the rat, realizing you haven't answered him yet, feeling a bit embarrassed as he sighs in disappointment.");
				outputText("\n\n\"<i>Child, please... bring me five Scholar's Teas and 250 gems for reagents, then I can fix you!  I can help you!  Just... get the tea!</i>\" the alchemist pleads, counting off to five on his clawed fingers for extra emphasis while shaking his gem pouch profusely.  You bite your lower lip— he seems really really mad about this or something.  Maybe you should like, get the tea?");
			}
			else if (player.findPerk(PerkLib.BroBrains) >= 0) outputText("\n\nRathazul glances your way as you approach his lab, a thoughtful expression on his age-lined face.  \"<i>I see you happen to have drank a can of Bro Brew in the past. If you ever need me to restore your intelligence capabilities, bring me five scholar teas and 250 gems. Thanks Marae you're not a bimbo; that would have been worse.</i>\"");
		}
		flags[kFLAGS.RATHAZUL_DEBIMBO_OFFERED]++;
	}
	menu();
	addButton(0,"Next",campRathazul);
}
//Creation Of The Draft: any
private  makeADeBimboDraft(): void {
	clearOutput();
	outputText(images.showImage("item-debimbo"));
	spriteSelect(SpriteDb.s_rathazul);
	outputText("Rathazul takes the teas and the gems into his wizened palms, shuffling the glittering jewels into a pouch and the teas into a large decanter.  He promptly sets the combined brews atop a flame and shuffles over to his workbench, where he picks up numerous pouches and vials of every color and description, adding them to the mix one after the other.  The mixture roils and bubbles atop the open flame like a monstrous, eerie thing, but quickly simmers down to a quiet boil.  Rathazul leaves it going for a while, stirring occasionally as he pulls out a smaller vial.  Once most of the excess liquid has evaporated, he pours the concoction into the glass container and corks it, holding it up to the light to check its coloration.");
	outputText("\n\n\"<i>That <b>should</b> do,</i>\" he mutters to himself.  Rathazul turns, carefully handing you the mixture.  \"<i>This should counter the mental-inhibiting effects of the Bimbo Liqueur, but I have no idea to what extent those who imbibe it will retain of their time spent as a bimbo...</i>\"\n\n");
	//Take items
	player.gems -= 250;
	player.consumeItem(consumables.SMART_T,5);
	statScreenRefresh();
	addMixologyXP(8);
	player.addStatusValue(StatusEffects.MetRathazul, 2, 1);
	inventory.takeItem(consumables.DEBIMBO, returnToRathazulMenu);
}
//Turn several ingredients into a special potion/consumable.
private  rathazulMakesPureHoney(): void {
	clearOutput();
	outputText(images.showImage("rathazul-lab"));
	if (player.gems < 25) {
		outputText("\"<i>I'm sorry but you don't have the gems for this service,</i>\" Rathazul says.");
		doNext(returnToRathazulMenu);
		return;
	}
	player.destroyItems(consumables.BEEHONY, 1);
	player.gems -= 25;
	statScreenRefresh();
	outputText("You hand over a vial of bee honey and the 25 gems.");
	outputText("\n\n\"<i>I'll see what I can do,</i>\" he says as he takes the bee honey and begin brewing something. ");
	menu();
	addButton(0,"Next",takethatHoney);
}
private  takethatHoney(): void {
	clearOutput();
	outputText(images.showImage("item-honey-pure"));
	outputText("A few minutes later, he comes back with the crystal vial that contains glittering liquid.  \"<i>It's ready. The honey should be pure now,</i>\" he says. He hands you over the vial of honey and goes back to working.  ");
	addMixologyXP(8);
	player.addStatusValue(StatusEffects.MetRathazul, 2, 1);
	inventory.takeItem(consumables.PURHONY, returnToRathazulMenu);
}

private  rathazulMakesMilkPotion(): void {
	clearOutput();
	outputText(images.showImage("rathazul-lab"));
	if (player.gems < 250) {
		outputText("\"<i>I'm sorry but you don't have the gems for this service,</i>\" Rathazul says.");
		doNext(returnToRathazulMenu);
		return;
	}
	else if (!(player.hasItem(consumables.LACTAID, 5) && player.hasItem(consumables.P_LBOVA, 2))) {
		outputText("\"<i>I'm sorry but you don't have the materials I need. I need five bottles of Lactaid and two bottles of purified LaBova,</i>\" Rathazul says.");
		doNext(returnToRathazulMenu);
		return;
	}
	player.destroyItems(consumables.LACTAID, 5);
	player.destroyItems(consumables.P_LBOVA, 2);
	player.gems -= 250;
	statScreenRefresh();
	outputText("You hand over the ingredients and 250 gems.");
	outputText("\n\n\"<i>I'll see what I can do,</i>\" he says as he takes the ingredients and begin brewing something. ");
	menu();
	addButton(0,"Next",takethatMotion);
}
private  takethatMotion(): void {
	clearOutput();
	outputText(images.showImage("item-lactaid-pro"));
	outputText("A few minutes later, he comes back with the potion.  \"<i>It's ready. If you have some issues with lactation or you want to produce milk forever, drink this. Keep in mind that it might be irreversible,</i>\" he says. He hands you over the potion and goes back to working.  ");
	addMixologyXP(8);
	player.addStatusValue(StatusEffects.MetRathazul,2,1);
	inventory.takeItem(consumables.MILKPTN, returnToRathazulMenu);
}

private  rathazulMakesTaurPotion(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("rathazul-lab"));
	if (player.gems < 100) {
		outputText("\"<i>I'm sorry but you don't have the gems for this service,</i>\" Rathazul says.");
		doNext(returnToRathazulMenu);
		return;
	}
	else if (!(player.hasItem(consumables.EQUINUM, 2) && player.hasItem(consumables.MINOBLO, 1))) {
		outputText("\"<i>I'm sorry but you don't have the materials I need. I need two vials of Equinum and one vial of minotaur blood,</i>\" Rathazul says.");
		doNext(returnToRathazulMenu);
		return;
	}
	player.destroyItems(consumables.EQUINUM, 2);
	player.destroyItems(consumables.MINOBLO, 1);
	player.gems -= 100;
	statScreenRefresh();
	outputText("You hand over two vials of Equinum, one vial of Minotaur Blood and one hundred gems to Rathazul, which he gingerly takes them and proceeds to make a special potion for you.");
	menu();
	addButton(0,"Next",takethatTaurico);
}
private  takethatTaurico(): void {
	clearOutput();
	outputText(images.showImage("item-taurico"));
	outputText("After a while, the rat hands you a vial labeled \"Taurinum\" and nods.");
	addMixologyXP(8);
	player.addStatusValue(StatusEffects.MetRathazul, 2, 1);
	inventory.takeItem(consumables.TAURICO, returnToRathazulMenu);
}

private  rathazulMakesEyePotion(): void
{
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("rathazul-lab"));
	if (player.gems < 100) {
		outputText("\"<i>I'm sorry but you don't have the gems for this service,</i>\" Rathazul says.");
		doNext(returnToRathazulMenu);
		return;
	}
	else if (!(player.hasItem(consumables.S_GOSSR, 2) && player.hasItem(consumables.HUMMUS_, 1))) {
		outputText("\"<i>I'm sorry but you don't have the materials I need. I need two strands of Sweet Gossamer and one vial of Hummanus,</i>\" Rathazul says.");
		doNext(returnToRathazulMenu);
		return;
	}
	player.destroyItems(consumables.S_GOSSR, 2);
	player.destroyItems(consumables.HUMMUS_, 1);
	player.gems -= 100;
	statScreenRefresh();
	outputText("You hand over two strands of Sweet Gossamer, one vial of Hummanus and one hundred gems to Rathazul, which he gingerly takes them and proceeds to make a special potion for you.");
	menu();
	addButton(0, "Next", takethatOculum);
}

private  takethatOculum(): void
{
	clearOutput();
	outputText(images.showImage("item-taurico"));
	outputText("After a while, the rat hands you a vial labeled \"Oculum Arachnae\" and nods.");
	addMixologyXP(8);
	player.addStatusValue(StatusEffects.MetRathazul, 2, 1);
	inventory.takeItem(consumables.OCULUMA, returnToRathazulMenu);
}

private  rathazulMakesCockatricePotion(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("rathazul-lab"));
	if (player.gems < 100) {
		outputText("\"<i>I'm sorry but you don't have the gems for this service,</i>\" Rathazul says.");
		doNext(returnToRathazulMenu);
		return;
	}
	else if (!(player.hasItem(consumables.REPTLUM, 1) && player.hasItem(consumables.GLDSEED, 1))) {
		outputText("\"<i>I'm sorry but you don't have the materials I need. I need one vial of Reptilum and one golden seed,</i>\" Rathazul says.");
		doNext(returnToRathazulMenu);
		return;
	}
	player.destroyItems(consumables.REPTLUM, 1);
	player.destroyItems(consumables.GLDSEED, 1);
	player.gems -= 100;
	statScreenRefresh();
	outputText("You hand over one vial of Reptilum, one golden seed and one hundred gems to Rathazul, which he gingerly takes them and proceeds to make a special potion for you.");
	menu();
	addButton(0,"Next",takethatTotrice);
}
private  takethatTotrice(): void {
	clearOutput();
	outputText(images.showImage("item-totrice"));
	outputText("After a while, the rat hands you a bottle labeled \"Ton o' Trice\" and nods.");
	addMixologyXP(8);
	player.addStatusValue(StatusEffects.MetRathazul, 2, 1);
	inventory.takeItem(consumables.TOTRICE, returnToRathazulMenu);
}

private  growLethiciteDefense(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("encounter-rathazul"));
	outputText("Rathazul asks, \"<i>Are you absolutely sure?  Growing this thorn canopy as a defense will use one third of the crystal's power.</i>\"\n\n(Do you have Rathazul use the crystal to grow a defensive canopy?)");
	doYesNo(growLethiciteDefenseYesYesYes, growLethiciteDefenseGuessNot);
}
private  growLethiciteDefenseYesYesYes(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("rathazul-canopy"));
	outputText("Rathazul nods and produces a mallet and chisel from his robes.  With surprisingly steady hands for one so old, he holds the chisel against the crystal and taps it, easily cracking off a large shard.  Rathazul gathers it into his hands before slamming it down into the dirt, until only the smallest tip of the crystal is visible.  He produces vials of various substances from his robe, as if by magic, and begins pouring them over the crystal.  In a few seconds, he finishes, and runs back towards his equipment.\n\n\"<i>You may want to take a step back,</i>\" he warns, but before you have a chance to do anything, a thick trunk covered in thorny vines erupts from the ground.  Thousands of vine-like branches split off the main trunk as it reaches thirty feet in the air, radiating away from the trunk and intertwining with their neighbors as they curve back towards the ground.  In the span of a few minutes, your camp gained a thorn tree and a thick mesh of barbed vines preventing access from above.");
	player.createStatusEffect(StatusEffects.DefenseCanopy, 0, 0, 0, 0);
	player.addKeyValue("Marae's Lethicite", 1, -1);
	doNext(playerMenu);
}
private  growLethiciteDefenseGuessNot(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("encounter-rathazul"));
	outputText("Rathazul nods sagely, \"<i>That may be wise.  Perhaps there will be another use for this power.</i>\"");
	doNext(returnToRathazulMenu);
}

private  getThatRatAss(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("rathazul-lab"));
	outputText("You slide over to Rathazul's spot in camp and wink at him, saying, \"<i>Hey cutie, do you have 11 protons? Cause your sodium fine.</i>\"\n\n");
	outputText("Rathazul looks up from the whatever it is he's working on and blinks wearily. \"<i>What?</i>\"\n\n");
	outputText("\"<i>Oh, nothing.</i>\" You let out a soft laugh. \"<i>Just that we have chemistry, so I think it's time we try some biology.</i>\"\n\n");
	outputText("There's a moment of silence, then he coughs. \"<i>I-I'm sorry, what are you trying to say?</i>\" There's a glimmer of a plea in his eyes, asking you to stop.\n\n");
	outputText("No way. You are getting what you came here for. You puff your chest and declare, \"<i>I wanna fuck you.</i>\"\n\n");
	doNext(getThatRatAss2);
}
private  getThatRatAss2(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("rathazul-accident"));
	outputText("\"<i>Oh... Ohhhh no...</i>\" He takes a couple steps back, mumbling, \"<i>No, no no no no no no, no, no...</i>\" His eyes glaze over and his steps grow uncoordinated as his soul seems to leave his body. \"<i>No, no, no... No... No...</i>\"\n\n");
	outputText("His foot steps in a bowl and he slips, crashing into the ground. His head slams into a rock along the way. You hear something crack that sounds like it shouldn't. You drop to all fours and put your hand on his shoulder, shouting his name. He doesn't respond. You put a hand to his neck. His pulse has stopped, and there is blood gathering around his head.\n\n");
	outputText("You get up and very slowly back away. You have no idea what just happened, but you are sure of one thing-- You need to get out of here.\n\n");
	doNext(getThatRatAss3);
}
private  getThatRatAss3(): void {
	spriteSelect(SpriteDb.s_rathazul);
	clearOutput();
	outputText(images.showImage("encounter-rathazul"));
	outputText("An hour later, you muster up the courage to return to the scene of your crime. Much to your surprise, though, there is no scene. Rathazul is back on his feet, though distinctly avoiding looking at you. All he's offered is a note on the ground. You pick it up and read it.\n\n");
	outputText("\"<i>No. And please do not as me that again.\n- Rathazul</i>\"\n\n");
	outputText("Sheesh, what a drama queen. A simple \"No thanks\" would've been fine. You toss the note aside with a huff and turn back to camp.\n\n");
	outputText("Still though, thinking about that rat ass gets you turned on...");
	dynStats("lus", 10);
	doNext(camp.returnToCampUseOneHour);
}
}

