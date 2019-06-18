//Dungeon 1: Factory

	use namespace kGAMECLASS;

	export class Factory extends DungeonAbstractContent {
		public  Factory() {}

		public  secretarialSuccubus:SecretarialSuccubusScene = new SecretarialSuccubusScene();
		//Incubus Mechanic would be in this line but this is in Lethice Dungeon
		public  omnibusOverseer:OmnibusOverseerScene = new OmnibusOverseerScene();
		//EVENTS
		public  enterDungeon(): void {
			clearOutput();
			outputText(images.showImage("dungeon-entrance-factory"));
			kGAMECLASS.inDungeon = true;
			//Shutdown state
			if (flags[kFLAGS.FACTORY_SHUTDOWN] == 2) outputText("Rounding a bend in the mountainous foothills, you stumble upon a large, rusted and eerily silent iron structure with a number of tall gray smokestacks.  A bevy of green-tinged copper pipes stem from the rear of the building, climbing up the steep mountainside toward a jagged hole in its face.  Most of these are cracked open along their seams and both the pipes and mountainside are glazed with pink tinted runoff.");
			else if (flags[kFLAGS.FACTORY_SHUTDOWN] == 1) outputText("Rounding a bend in the mountainous foothills, you stumble upon a large, rusted and eerily silent iron structure with a number of tall gray smokestacks.  A bevy of green-tinged copper pipes stem from the rear of the building, climbing up the steep mountainside and disappearing into a hole in its face.");
			else outputText("Rounding a bend in the mountainous foothills, you stumble upon a large and rusted iron structure belching cloying pink smoke from its tall smokestacks.  A bevy of green-tinged copper pipes stem from the rear of the building, climbing up the steep mountainside and disappearing into a hole in its face.  It must be some kind of demonic factory, though you've no idea what they could be pumping out.  High atop the roof, you spy a huge water tower fed by smaller pipes that run down the building's side and off in the direction of the lake.  ");
			//Generic text
			outputText("\n\nThere are no windows to the hellish factory, with only a single iron door adorning the front wall. ");
			if (flags[kFLAGS.FACTORY_SHUTDOWN] == 0) outputText("If you go inside there will undoubtedly be many demons to fight and little chance to escape. Death or worse awaits should you fall into their hands.");
			outputText("\n\nDo you enter the factory or leave?");
			if (flags[kFLAGS.FACTORY_FOUND] < 1) {
				outputText("\n\n<b>The factory is now accessible from the 'Dungeons' submenu inside 'Places' menu.</b>");
				flags[kFLAGS.FACTORY_FOUND] = 1
			}
			menu();
			addButton(0, "Enter", roomLobby);
			addButton(14, "Leave", exitDungeon);
		}
		private  exitDungeon(): void {
			kGAMECLASS.inDungeon = false;
			clearOutput();
			outputText(images.showImage("dungeon-entrance-factory"));
			outputText("You slip out the door and disappear, heading back towards your camp, leaving the hellish factory behind.");
			doNext(camp.returnToCampUseOneHour);	
		}

		private  checkDoor1(): void {
			clearOutput();
			if (player.hasKeyItem("Iron Key") < 0) {
				outputText(images.showImage("factory-door-iron"));
				outputText("The door is locked with a key that is not in your possession.");
				doNext(roomLobby);
				return;
			}
			else roomPumpRoom();
		}
		private  checkDoor2(): void {
			clearOutput();
			if (player.hasKeyItem("Supervisor's Key") < 0) {
				outputText(images.showImage("factory-door-supervisor"));
				outputText("The door is locked with a key that is not in your possession.");
				doNext(roomForemanOffice);
				return;
			}
			else roomPremiumStorage();
		}
		private  checkStairs(): boolean {
			clearOutput();
			if (flags[kFLAGS.NEW_GAME_PLUS_LEVEL] >= 2 && (flags[kFLAGS.FACTORY_INCUBUS_DEFEATED] + flags[kFLAGS.FACTORY_INCUBUS_BRIBED] <= 0)) {
				outputText(images.showImage("factory-door-glass"));
				outputText("The glass door is locked! You have a feeling you should confront the incubus first.");
				if (silly()) outputText("\n\nNo, you can't break it down! Locked doors are indestructible!");
				doNext(roomMainChamber);
				return false;
			}
			else {
				roomForemanOffice();
				return true;
			}
		}
		private  checkExit(): boolean {
			clearOutput();
			if (flags[kFLAGS.NEW_GAME_PLUS_LEVEL] >= 3 && flags[kFLAGS.FACTORY_OMNIBUS_DEFEATED] <= 0) {
				outputText(images.showImage("factory-door-exit"));
				outputText("The metal door is locked! Looks like you won't be able to get out until you defeat whoever runs the factory.");
				doNext(roomLobby);
				return false;
			}
			else {
				exitDungeon();
				return true;
			}
		}

		private  unlockDoor(): void {
			clearOutput();
			outputText("With a click, the padlock disengages and the door is now unlocked! Do you proceed?");
			flags[kFLAGS.GRIMDARK_FACTORY_DOOR_UNLOCKED] = 1;
			doYesNo(roomForemanOffice, roomMainChamber);
		}

		private  takeIronKey(): void {
			clearOutput();
			outputText(images.showImage("item-key-iron"));
			outputText("You take the <b>Iron Key</b> to keep with your other important items.");
			player.createKeyItem("Iron Key",0,0,0,0);
			doNext(roomBreakRoom);
		}
		private  takeSupervisorKey(): void {
			clearOutput();
			if (flags[kFLAGS.GRIMDARK_MODE] == 0) {
				outputText(images.showImage("item-key-silver"));
				outputText("You search the desk and find a silver key labelled 'Supervisor'.\n\nYou take the <b>Supervisor Key</b> to keep with your other important items.");
			}
			else {
				outputText(images.showImage("item-key-silver-II"));
				outputText("You search the desk and find two keys. One is a silver key labelled 'Supervisor' and another looks like it would unlock a gate.\n\nYou take the <b>Supervisor Key</b> and <b>Gate Key</b> to keep with your other important items.");
				player.createKeyItem("Gate Key - Deepwoods", 0, 0, 0, 0);
			}
			player.createKeyItem("Supervisor's Key", 0, 0, 0, 0);
			doNext(roomForemanOffice);
		}
		
		private  takeGroPlus(): void {
			clearOutput();
			flags[kFLAGS.FACTORY_TAKEN_GROPLUS]++
			outputText(images.showImage("item-gro-plus"));
			inventory.takeItem(consumables.GROPLUS, roomPremiumStorage);
		}
		private  takeLactaid(): void {
			clearOutput();
			flags[kFLAGS.FACTORY_TAKEN_LACTAID]++
			outputText(images.showImage("item-lactaid"));
			inventory.takeItem(consumables.LACTAID, roomPremiumStorage);
		}

		private  drinkCoffee(): void {
			clearOutput();
			spriteSelect(SpriteDb.s_mrsCoffee);
			outputText(images.showImage("item-coffee"));
			outputText("You take a sip of the rich creamy coffee and suddenly feel refreshed. As you replace the coffeepot, the busty coffee-maker comes to life, grabbing her thick dusky nipples and squeezing out a trickle of scaldingly hot liquid. You can see her eyes roll up into her head from what you assume to be pleasure as she automatically refills the missing coffee, mouth open with ecstasy.  Her movements gradually slow as she quivers almost imperceptibly. A contented smile graces her features as immobility overtakes her, freezing her back in place.  You wonder if 'Mrs. Coffee' was created, or a victim of this place's dark master.");
			dynStats("lus", 1);
			player.HPChange(35, false);
			player.refillHunger(10);
			doNext(roomBreakRoom);
		}
		private  buildCockMilker(): void {
			clearOutput();
			outputText(images.showImage("factory-milking-cock"));
			outputText("You puzzle out how to build a fully functional cock-milker from the spare parts here and assemble it.\n\nYou gained a <b>Cock Milker</b>!");
			outputText("\n\nYou'll need a little help to use it though.");
			player.createKeyItem("Cock Milker",0,0,0,0);
			flags[kFLAGS.FACTORY_MILKER_BUILT] = 1;
			doNext(roomRepairCloset);
		}
		private  buildBreastMilker(): void {
			clearOutput();
			outputText(images.showImage("factory-milking-breasts"));
			outputText("You puzzle out how to build a fully functional breast-milker from the spare parts here and assemble it.\n\nYou gained a <b>Breast Milker</b>!");
			outputText("\n\nYou'll need a little help to use it though.");
			player.createKeyItem("Breast Milker",0,0,0,0);
			flags[kFLAGS.FACTORY_MILKER_BUILT] = 1
			doNext(roomRepairCloset);
		}

		private  doTensionRelease(): void {
			clearOutput();
			if (!player.hasStatusEffect(StatusEffects.TensionReleased)) { //First time...
				if (player.hasVagina() && player.hasCock()) outputText(images.showImage("factory-tension-herm"));
				else if (player.hasVagina() && !player.hasCock()) outputText(images.showImage("factory-tension-female"));
				else outputText(images.showImage("factory-tension-male"));
				outputText("You nod and step forwards, allowing her to hook up a modified harness and inject you with the demonic concoction.  In no time heat boils through your veins, pooling on your chest and crotch.  ");
				if (player.biggestTitSize() < 10) {
					player.growTits(1, (2+rand(3)), true, 1);
					outputText("  ");
				}
				outputText("You glance over to the pile of glistening entwined bodies as they writhe in pleasure, and find yourself drawn in to the mass.  You spend the next four hours suckling tainted breast milk, fucking gaping pussies, and doing your damnedest to milk as much cum from the dick-girls around you.  Eventually the drugs work their way out of your system, leaving you to recover on the floor.  Cum, milk, and sweat drip from your nude form as you try to clean up and get dressed.");
				player.orgasm('Tits');
				dynStats("int", -2, "lib", 4, "cor", 4);
				player.slimeFeed();
				player.createStatusEffect(StatusEffects.TensionReleased,0,0,0,0);
			}
			else { //Second/third times...
				if (player.statusEffectv1(StatusEffects.TensionReleased) == 0) { //2nd time
					if (player.hasVagina() && player.hasCock()) outputText(images.showImage("factory-tension-herm"));
					else if (player.hasVagina() && !player.hasCock()) outputText(images.showImage("factory-tension-female"));
					else outputText(images.showImage("factory-tension-male"));
					outputText("You eagerly put on the modified harness and let them inject you with more of those body-altering chemicals.  As they fill you with artificial lust and desire, you cry out and beg for more.  They oblige you and give you a larger dose than the first time.  ");
					if (player.cocks.length > 0) { //Grow dick!
						player.lengthChange(player.increaseCock(0, 5), player.cocks.length);
						if (player.averageCockLength() >= 9 && player.averageCockThickness() < 2) {
							outputText("You feel yourself gain in thickness as well, to match your new length.  ");
							temp = player.cocks.length;
							while(temp > 0) {
								temp--;
								if (player.cocks[temp].cockThickness < 2) player.cocks[temp].cockThickness++;
							}
						}
						else if (player.averageCockLength() >= 15 && player.averageCockThickness() < 3) {
							outputText("You feel yourself gain in thickness as well, to match your new length.  ");
							temp = player.cocks.length;
							while(temp > 0) {
								temp--;
								if (player.cocks[temp].cockThickness < 3) player.cocks[temp].cockThickness++;
							}
						}
					}
					if (player.breastRows.length == 0) { //if player has 0 bewbs
						player.createBreastRow(); //grow chest
						outputText("Your chest tingles, revealing a pair of pink nipples on your new mammory glands.  ");
					}
					player.growTits(1, (2+rand(3)), true, 1);
					outputText("  ");
					outputText("Your " + player.nippleDescript(0) + "s ");
					if (player.cocks.length > 0) outputText("and " + player.multiCockDescript());
					outputText(" become rock hard, leaking fluids constantly.  ");
					if (player.cocks.length > 0 && player.vaginas.length == 0) //MALE
						outputText("Glancing over into the sea of sex, you find yourself drawn to the nearest pussy, as if it was the only thing in the world to matter.  You lose track of the time as you fuck hard dozens of gaping cunts, each of them overflowing with cum from all participants in this infernal orgy.  ");
					if (player.vaginas.length > 0 && player.cocks.length == 0) { //FEMALE
						outputText("As you enter the sex-crazed crowd, you notice several \"girls\" with demonic cocks bloated by the use of drugs, getting drawn to you by the scent of your dripping wet " + player.vaginaDescript(0) + ". Sitting on the floor, you spread your legs wide, facing the nearest one with an inviting lewd moan, while you hungrily grab another cum-covered cock, that just filled up an obscenely wide gaping vagina, to suck it.  You are soon penetrated and fucked hard and deep, one huge infernal dick after another, as they all cum into you in turn. ");
						player.cuntChange(150, true);
					}
					if (player.vaginas.length > 0 && player.cocks.length > 0) //HERM
						outputText("You feel your " + player.multiCockDescript() + " getting milked by many wet holes, though you are too busy sucking cocks and moaning in ecstasy to notice who they belong to.  ");
					outputText("The next eight hours are lost to your desires as you cum over and over, feeling mind-shattering pleasure.  You recover a while on the floor, soaked with a mixture of milk, cum, and pussy-juice.  Getting dressed is a bit troublesome with the recent changes, but you manage to squeeze back into your " + player.armorName + ".  You walk away while still feeling horny, and the moaning of the girls behind you doesn't help.  Maybe you could stay for another round...");
					player.orgasm('Generic');
					dynStats("int", -2, "lib", 4, "cor", 4);
					player.createStatusEffect(StatusEffects.TensionReleased,0,0,0,0);
					player.addStatusValue(StatusEffects.TensionReleased,1,1);
					player.slimeFeed();
				}
				else { //3rd time, move on to bad end!
					doBadEndTension();
					return;
				}
			}
			doNext(roomMainChamber);
		}
		//Factory finale
		private  factoryShutdown(): void {
			clearOutput();
			outputText(images.showImage("factory-closed-shutdown"));
			outputText("You resolve to shut down the factory, then destroy the controls.  You spend a few moments making sure you aren't about to do something disastrous.  A few deep breaths calm your nerves, letting you focus on pressing the correct buttons.  The constant thrumming of the machinery slowly dies down, closely followed by a chorus of disappointed moans.  You step over to the window and watch as the captives come out of their drug induced sex-comas.  A great deal of them gather up and leave, though you are unsure what their destination is.  A few seem to be gathering back around the equipment, and puzzling out how to operate it.  Maybe they liked being here..."); 
			outputText("\n\nYou remember to destroy the controls. You pick up a nearby large wrench and repeatedly smash the controls. Finally, you throw the wrench at the exposed spinning gears, causing it to jam and dislodge.")
			flags[kFLAGS.FACTORY_SHUTDOWN] = 1;
			doNext(roomControlRoom);
		}
		private  factoryOverload(): void {
			clearOutput();
			outputText(images.showImage("factory-closed-overload"));
			outputText("You resolve to shut down the factory by overloading the storage tanks, rendering much of the equipment inoperable and difficult to repair.  With a quick twist of a knob, you override the pressure vents for the storage tanks.  Within minutes, you hear the sounds of popping rivets and straining pumps.  You look out over the factory floor and watch as many of the pipes fracture, dripping seed over the moaning captives.  Smoke rises from pumps as they short out and overheat.  The entire building shudders as a massive blast echoes from somewhere to the west.  A high pitched whine fills the building as the last motors shriek and die.  The captives slowly start to come to as the flood of drugs and artificial pleasure come to a stop.  Many break down and cry, others begin unhooking themselves and exploring their surroundings.  You watch with interest as many of them rally together and make for an exit.   The remaining survivors begin scavenging parts from the machinery and puzzling out how to use it.  Perhaps they liked it here.");
			outputText("\n\nYou remember to destroy the controls. You pick up a nearby large wrench and repeatedly smash the controls. Finally, you throw the wrench at the exposed spinning gears, causing it to jam and dislodge.")
			flags[kFLAGS.FACTORY_SHUTDOWN] = 2;
			doNext(roomControlRoom);
		}
		//BAD ENDS
		public  doBadEndGeneric(): void {
			clearOutput();
			outputText("You crack your sleep-fuzzed eyes, blinking at the sudden light as you try to get your bearings and remember where you are.  A nearby voice is moaning like a bitch in heat, or a drunk slut.  You giggle a bit at the thought as you work at focusing your eyes.  You feel warm and happy, particularly in your chest and groin.  The cobwebs of sleep clear from your mind with agonizing slowness, but you find it hard to worry about with how warm and wonderful you feel.  It's almost like hot wet mouths are latched onto your crotch and breasts, licking and sucking in perfect rhythm.  ");
			if (player.cocks.length == 0 || player.biggestTitSize() <= 1) {
				outputText("A small inner voice pipes up to remind you that you don't have ");
				if (player.cocks.length == 0) {
					outputText("anything in your groin to suck on");
					if (player.biggestTitSize() <= 1) outputText(" or ");
				}
				if (player.biggestTitSize() <= 1) outputText("any adornments on your chest");
				outputText(".  That voice trails off as that feeling of perfect pleasure and rightness sweeps it away with the last remnants of sleep.\n\n");
			}
			else outputText("A small inner voice tries to warn you of something, only to be swept away in the feelings of perfect pleasure and rightness that wash away the last remnants of your sleep.\n\n");
			outputText("You realize that the moaning voice is your own, and find that the thought just turns you on more.\n\n");
			outputText("'<i>You're such a horny slut!</i>' echoes a voice in your head.  You want to nod and smile, but are prevented by something.  You realize you're strapped into some kind of chair and harness so securely that you can't even move.  Tiny soothing fingers massage your temples, rubbing away the fears that moments ago threatened to interrupt your pleasure.  You can see a ");
			if (player.totalBreasts() == 2) outputText("pair of ");
			else outputText("multitude of ");
			outputText(" clear hoses coming away from your cow-like chest udders.  ");
			if (player.biggestLactation() <= 1.5) outputText("Creamy white milk is flowing in a steady stream up the tubes and away from you.");
			else outputText("The hoses bulge obscenely as they struggle to keep up with the torrents of creamy-white milk you're producing.");
			outputText(images.showImage("badend-factory"));
			outputText("Even more wanton moans erupt from your disobedient lips now that you know what's going on.  You're not just a horny slut.  You're a horny cow-slut who's getting off on having her tits pumped.  The massage you're getting feels so good once you realize that.\n\n"); 
			outputText("A snap echoes through the pumping room, nearly drowned out by the moans of the other milk-sluts around you.  You look around as you realize the band to restrain your head has been unlatched.  You take advantage of your newfound freedom and look around.  Rows and rows of other girls are there, just like you.  Almost all of them have bigger tits and fuller milk-tubes.  In addition, they all have enormous members that would drag on the floor were it not for the gigantic tubes encapsulating each and every one.  ");
			outputText("The girl next to you squirms and cums, wriggling inside her harness as waves of sticky goop are pumped down her cock-tube into a floor-socket.  She just keeps going and going, making you wonder how she can make so much of the stuff.  As the sight excites you, the pleasure in your own crotch redoubles.  Looking down thanks to your newfound freedom, you see your own giant encapsulated member; though not as large as your neighbor's, it still looks and feels wonderful.\n\n"); 
			outputText("The lining of the tube squeezes and massages your trapped prick expertly, even as those hands continue to work on your mind.  Some part of you suspects that your thoughts are being manipulated, but the carnal pleasure you are experiencing is so amazing that you have no intention of resisting. If being a cumslut for your sexy demonic masters is what it takes, so be it. Cramming a massive demon-cock in your throat, getting a few others up your holes to keep you pregnant all the time, and being their busty hermaphrodite breeding tool would be your joy and privilege.  ");
			if (player.hasStatusEffect(StatusEffects.CampMarble))
				 outputText("As if reading your thoughts, the hands stop massaging, and their owner snaps their fingers. You see Marble step in front of you, wearing an odd set of pink panties with a dick-like protrusion sticking out the front of them.  At the command of the figure behind you, she presents the panty-cock to you.  Happy to be of service, you spread your jaws and engulf as much of the great penis-like thing as you can, while the figure behind you moves around and takes Marble in the ass.  You continue to suck on the pink flesh until you feel it pour some kind of unholy load into your stomach.  Gurgling in pleasure, you start cumming yourself, all the while appeasing your demonic masters by servicing your once lover.\n\n");
			else outputText("As if reading your thoughts, the hands stop massaging, and their owner comes in front of you, presenting you with a meaty, throbbing cock.  Happy to be of service, you spread your jaws and engulf as much of the great penis as you can, until you feel it pouring his unholy load into your stomach.  Gurgling in pleasure, you start cumming yourself, all the while attending to one or more of your demonic masters.\n\n");
			outputText("<b>This kind of treatment continues for a few days, until sucking, fucking and getting fucked is the only thing you desire. As your mind is now broken, injections are no longer necessary to keep you in a perfect pleasure state. After a month, they even untie you, since you are now their complete cum-puppet, eager only to please and obey.</b>");
			//The style on this part wasn't up to par with the rest, so I rewrote some of it, while keeping the meaning
			getGame().gameOver();
		}

		public  doBadEndTension(): void {
			if (player.hasVagina() && player.hasCock()) outputText(images.showImage("factory-tension-herm"));
			else if (player.hasVagina() && !player.hasCock()) outputText(images.showImage("factory-tension-female"));
			else outputText(images.showImage("factory-tension-male"));
			outputText("Desperate for more of the demon-drugs, you slide into the now-familiar harness and let the needles sink into your skin.   Panting in lust, you beg for them increase the dosage again.   Desire burns through your veins as the cocktail surges through them");
			if (player.cocks.length > 0) {
				outputText(", filling your " + player.multiCockDescriptLight());
				outputText(" with sensation");
				if (player.cockTotal() == 1) outputText("s");
				outputText(" as ");
				if (player.cocks.length > 1) outputText("they");
				else outputText("it");
				outputText(" grow");
				if (player.cocks.length == 1) outputText("s");
				outputText(" massive and engorged.  ");
			}
			else outputText(".  ");
			outputText("Your " + player.nippleDescript(0) + "s throb, becoming hard, puffy, and starting to dribble milk.  ");
			if (player.vaginas.length > 0) outputText("Your pussy is instantaneously soaked, filling the air with the scent of sex.  ");
			outputText("The desire for more of the drugs battles with your need to fuck and be fucked, until a small functioning part of your brain realizes it'll be easier to get sex than to get more of the drug.  You pull free and throw yourself into the mass of sweaty bodies, losing yourself in the salty tang of sweat and sex, pleasing nipples, clits, and cocks with your hands, and giving and receiving as much pleasure as you can.  You're in heaven.  Vaguely you realize time is passing, but it is a secondary concern next to the idea of having another groin-soaking orgasm.   You fuck and suck until you pass out from delirium.");
			dynStats("int", -25, "lus", -75, "cor", 2);
			doNext(BadEndTension);
		}
		public  BadEndTension(): void {
			clearOutput();
			outputText(images.showImage("badend-tension"));
			outputText("In time you wake, your body aching both from the exertion and a desire for more.  On one hand you had a mission here, but why fight and struggle with danger and loneliness when you could be high on sex and cumming near-constantly?  You cuddle up to an exhausted girl and decide to wait for the drug-mistresses to give you another turn in the pile.  One of them turns, as if noticing your train of thought, and wheels over a breast-pump.  She hooks it up to your still-leaking nipples and you ");
			if (player.biggestLactation() >= 3) outputText("moo");
			else outputText("cry");
			outputText(" with happiness, promising another dose to you if you are a good cow for her.");
			dynStats("int", -75, "lib", 100, "cor", 3);
			getGame().gameOver();
		}
		//ROOMS
		public  roomLobby(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_FACTORY_FOYER;
			clearOutput();
			outputText(images.showImage("factory-foyer"));
			outputText("<b><u>The Factory Foyer</u></b>\n");
			outputText("The door swings shut behind you with an ominous 'creeeeeaaaaaaak' followed by a loud 'SLAM'.  Glancing around, you find yourself in some kind of stylish foyer, complete with works of art and a receptionist's desk.  Looking closer at the paintings on the wall quickly reveals their tainted and demonic nature: One appears at first to be a painting of a beautiful smiling woman, except you notice dripping tentacles coiling around the hem of her dress.  Behind the receptionist's desk, the second painting is even less discreet, openly depicting a number of imps gang-raping a vaguely familiar-looking woman.  Luckily, whatever demon is employed as the receptionist is away at the moment.  Behind the desk on the northern wall stands a secure-looking iron door.  On the western wall, is a door. A sign on the door indicates that it leads to the factory restroom.  On the eastern wall is a simple wooden door, though the color of the wood itself is far darker and redder than any of the hard woods from your homeland.  Behind you to the south is the rusty iron entry door.");
			dungeons.setDungeonButtons(checkDoor1, undefined, roomBathroom, roomBreakRoom);
			addButton(11, "Leave", checkExit);
		}
		public  roomBreakRoom(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_FACTORY_BREAK_ROOM;
			clearOutput();
			outputText(images.showImage("factory-break-room"));
			outputText("<b><u>Break Room</u></b>\n");
			outputText("Stepping through the dark red doorway, you wander into an expansive break room. Tables surrounded by crude wooden chairs fill most of the floor space. Along the far eastern wall sits a small counter, complete with a strange ebony sculpture of a busty woman with 'Mrs. Coffee' printed on the side. Below the sculpture is a pot of steaming hot coffee, giving off an invigoratingly rich smell.");
			dungeons.setDungeonButtons(undefined, undefined, roomLobby, undefined);
			if (flags[kFLAGS.FACTORY_SUCCUBUS_DEFEATED] > 0) {
				if (player.hasKeyItem("Iron Key") < 0) {
					outputText("  It seems your opponent dropped a small iron key as she fled.");
					addButton(0, "Iron Key", takeIronKey).hint("Pick up the iron key. It looks like it might unlock the door in this factory.");
				}
				addButton(1, "Coffee", drinkCoffee).hint("Drink some coffee.");
				spriteSelect(SpriteDb.s_mrsCoffee);
			}
			else secretarialSuccubus.encounterSuccubus();
		}
		public  roomPumpRoom(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_FACTORY_PUMP_ROOM;
			clearOutput();
			outputText(images.showImage("factory-pump-room"));
			outputText("<u><b>Pump Room</b></u>\n");
			if (flags[kFLAGS.FACTORY_SHUTDOWN] < 1)
				 outputText("As you step through the iron door, a cacophony of thrumming mechanical noise assaults your ears.  Coppery pipes arch overhead, riveted into spiked iron brackets that hang from the ceiling in twisted pairs.  The constant thrum-thrum-thrum of concealed pumps and mechanisms makes it difficult to hear anything, but you swear you can make out the faint sounds of sexual pleasure emanating from the northwest side of the room.  Investigating further, you spot a door along the west wall of the room that appears to be the source of the licentious sounds.  The vibrations of all the machinery are strongest along the east walls, indicating the possible site of this hellish place's power-plant. There is a door on the east wall and a door on the north.  To the south is a solid iron door that leads back to the lobby.");
			else outputText("As you step through the iron door, silence is the only noise you hear.  Coppery pipes arch overhead, riveted into spiked iron brackets that hang from the ceiling in twisted pairs.  The near-complete silence of the place unnerves you, but allows you to make out the faint sounds of sexual pleasure emanating from northwest side of the room.  Investigating further, you spot a door along the west wall of the room that appears to be the source of the licentious sounds.\nThere are two other doors, one along the east wall and one on the north.  To the south is a solid iron door that leads back to the lobby.");
			dungeons.setDungeonButtons(roomRepairCloset, roomLobby, roomMainChamber, roomFurnaceRoom);	
		}
		public  roomFurnaceRoom(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_FACTORY_FURNACE_ROOM;
			clearOutput();
			outputText(images.showImage("factory-furnace-room"));
			outputText("<b><u>Furnace Room</u></b>\n")
			if (flags[kFLAGS.FACTORY_SHUTDOWN] <= 0)
				 outputText("The air inside this room is hot enough to coat your " + player.skin.tone + " " + player.skin.desc + " in a fine sheen of sweat.  The eastern side of the chamber is more machine than wall, a solid mass of iron piping covered in small metal blast-doors through which fuel is to be fed.  A small transparent plate is riveted into the wall, allowing you to see some kind of pink crystalline fuel being burned by purple-white fire.  The few visible controls and gauges don't seem to be linked into anything important, and the machinery looks far too durable to damage with what you have.  The only exit is a heavy iron door on the west wall.  ");
			else outputText("Despite the machinery being shut down, the air in this room is still hot enough to coat your " + player.skin.tone + " " + player.skin.desc + " in a fine sheen of sweat.  The eastern side of the chamber is more machine than wall, a solid mass of iron piping covered in small metal blast-doors through which fuel is to be fed.  A small transparent plate is riveted into the wall, allowing you to see some the ashes of a previous fuel source.  The few visible controls and gauges don't seem to be linked into anything important, and the machinery looks far too durable to damage with what you have.  The only exit is a heavy iron door on the west wall.  ");
			dungeons.setDungeonButtons(undefined, undefined, roomPumpRoom, undefined);
			if (flags[kFLAGS.FACTORY_INCUBUS_DEFEATED] <= 0) //incubus is ALLLLIVE
				getGame().lethicesKeep.incubusMechanic.encounterIncubusFactory();
		}
		public  roomRepairCloset(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_FACTORY_REPAIR_CLOSET;
			clearOutput();
			outputText(images.showImage("factory-repair-closet"));
			outputText("<b><u>Repair Closet</u></b>\n");
			outputText("As you carefully slip inside the room, you note with some relief that it seems to be an empty storage closet. The room is tiny, barely 6' by 8' and almost entirely empty.  The one piece of furniture inside the closet is a simple wooden cabinet, placed against the far wall.  ")
			dungeons.setDungeonButtons(undefined, roomPumpRoom, undefined, undefined);
			if (flags[kFLAGS.FACTORY_MILKER_BUILT] > 0) outputText("The shelves are empty.  ");
			else {
				outputText("The shelves of the cabinet hold various pieces of pump machinery, probably used to repair complete machines further into the factory.  ");
				if (player.inte >= 40) {
					outputText("You realize there are enough pieces here to put together a breast-milking pump or a cock-milker.  ");
					if (player.hasKeyItem("Cock Milker") >= 0)
						 outputText("\nYou already have a cock milker.\n");
					else addButton(1, "Cock Milker", buildCockMilker);
					if (player.hasKeyItem("Breast Milker") >= 0)
						 outputText("\nYou already have a breast milker.\n");
					else addButton(0, "Breast Milker", buildBreastMilker);
				}
			}
			outputText("The only exit is back to the south.");
		}
		public  roomMainChamber(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_FACTORY_MAIN_CHAMBER;
			clearOutput();
			outputText(images.showImage("factory-main-chamber"));
			outputText("<b><u>Main Chamber</u></b>\n");
			dungeons.setDungeonButtons(undefined, undefined, undefined, roomPumpRoom);
			if (flags[kFLAGS.FACTORY_SHUTDOWN] <= 0) {
				outputText("This cavernous chamber is filled with a cacophony of sexual moans.  Rows of harnesses are spaced evenly throughout this room, nearly all of them filled with delirious-looking humans.  Each is over-endowed with huge breasts and a penis of elephantine proportions.  The source of their delirium hangs down from the ceiling - groups of hoses that end with needles buried deep into the poor 'girls' flesh, pumping them full of demonic chemicals.  Constant sucking and slurping noises emanate from nipple and cock pumps as they keep the victims in a state of near-constant orgasm.  ");
				if (player.cor < 50) outputText("You wish you could free them, but it would take the better part of a day to get them all free.  It'd be better to find the control room and shut down the infernal machinery.  ");
				else outputText("You wish you had some machinery like this for yourself.  It looks so fun!  Still, you suppose you should find the control panel to shut this down and free these people.  ");
				outputText("There is a doorway to the east marked with an 'exit' sign above it.  Along the southern wall is a stairwell that leads up to some kind of foreman's office.  Perhaps the controls are in there?");
			}
			else { //dungeon shut down
				outputText("The chamber is significantly emptier since you've shut down this factory.  Roughly half the girls appear to have left.  The rest seem to be pre-occupied by fucking each other in a massive orgy.  A few enterprising ladies have found leather outfits and appear to be helping to manually administer the chemical cocktails to those engaged in rampant sexual exploits.  It seems some of them preferred a life of near-constant orgasm to their freedom.  There is a door to the east marked as 'EXIT', and a stairwell along the south wall that leads to an overseer's office.");
				outputText("\n\nOne of the leather-clad ladies steps over and offers, 'Would you like a dose?  You look like you need to relieve some tension...");
				addButton(0, "Tension", doTensionRelease);
			}
			addButton(5, "Upstairs", checkStairs);
		}
		public  roomForemanOffice(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_FACTORY_FOREMANS_OFFICE;
			clearOutput();
			outputText(images.showImage("factory-foreman-office"));
			outputText("<b><u>Foreman's Office</u></b>\n");
			outputText("This office provides an excellent view of the 'factory floor' through a glass wall along the north side.  Towards the south side of the room is a simple desk with an even simpler chair behind it.  The desk's surface is clear of any paperwork, and only has a small inkwell and quill on top of it.  There are a few statues of women and men posted at the corners of the room.  All are nude and appear to be trapped in mid-orgasm.  You wonder if they're statues or perhaps some kind of perverted petrified art.  The north has a glass door leading back to the factory.  There are two other doors, both made of very solid looking metal.  One is on the east wall and another is on the south, behind the desk.  The one behind the desk is marked 'Premium Storage' (though it appears to be locked).");
			dungeons.setDungeonButtons(undefined, checkDoor2, undefined, roomControlRoom);
			addButton(7, "Downstairs", roomMainChamber)
			if (flags[kFLAGS.FACTORY_OMNIBUS_DEFEATED] <= 0)
				omnibusOverseer.encounterOmnibus();
			else {
				if (player.hasKeyItem("Supervisor's Key") < 0)
					addButton(0, "Desk", takeSupervisorKey).hint("Check the desk for something.");
			}
		}
		public  roomControlRoom(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_FACTORY_PUMP_CONTROL;
			clearOutput();
			outputText(images.showImage("factory-control-room"));
			outputText("<b><u>Pump Control Room</u></b>\n");
			outputText("This room is little more than a closet in reality.  There is a simple set of mechanical controls on a finely crafted terminal against the far wall.  ")
			if (flags[kFLAGS.FACTORY_SHUTDOWN] <= 0) {
				outputText("You spend a moment looking over them, and realize you have three options to deal with this place.\n\n");
				outputText("-You could close the storage vent valves and overload the fluid storage systems.  The storage tanks along the back portion of the building would rupture, releasing thousands of gallons of tainted fluids into the surrounding area, but the facility's systems would suffer catastrophic failures and shut down forever.\n");
				//(Consequences - lake goddess becomes tainted!)
				outputText("-You could perform a system shutdown and then smash the controls.  It'd let the girls go and keep the factory shut down in the short term.  However most of the equipment would be undamaged and the place could be re-opened without too much work on the demons' part.\n");
				//(Consequences - If Marcus is a demon he takes over running the factory forever.  If not, nothing bad happens)
				outputText("-You could leave the equipment to continue running.  After all, the girls downstairs did seem to be enjoying themselves...\n");
				//(Consequences - Marcus takes over if demonic choice taken, if not he shuts down the equipment & things continue as per #3)
			}
			else outputText("The controls are now inoperable due to the damage your actions have caused.");
			dungeons.setDungeonButtons(undefined, undefined, roomForemanOffice, undefined);
			if (flags[kFLAGS.FACTORY_SHUTDOWN] <= 0) {
				addButton(0, "Valves", factoryOverload).hint("Overload the valves. This may have unintended consequences but the factory will suffer catastrophe and shut down forever.");
				addButton(1, "Shutdown", factoryShutdown).hint("Shut down the factory safely. This may seem like a safe bet but it leaves the factory vulnerable to the possibility of being re-opened.");
			}
		}
		public  roomPremiumStorage(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_FACTORY_STORE_ROOM;
			clearOutput();
			outputText(images.showImage("factory-storage"));
			outputText("<b><u>Premium Products</u></b>\n");
			outputText("This store room is filled with a few opened crates, meant to store the various substances in the factory.  It looks as if the current overseer has allowed supplies to run low, as there is not much to be gleaned from this meager stash.\n");
			dungeons.setDungeonButtons(roomForemanOffice, undefined, undefined, undefined);
			if (flags[kFLAGS.FACTORY_TAKEN_LACTAID] > 0) {
				if (flags[kFLAGS.FACTORY_TAKEN_LACTAID] < 5) {
					outputText("There is a crate with " + num2Text(5 - flags[kFLAGS.FACTORY_TAKEN_LACTAID]) + " bottles of something called 'Lactaid' inside.\n");
					addButton(0, "Lactaid", takeLactaid);
				}
			}
			else {
				outputText("There is an unopened crate with five bottles of something called 'Lactaid' inside.\n\n");
				addButton(0, "Lactaid", takeLactaid);
			}
			if (flags[kFLAGS.FACTORY_TAKEN_GROPLUS] > 0) {
				if (flags[kFLAGS.FACTORY_TAKEN_GROPLUS] < 5) {
					outputText("There is a crate with " + num2Text(5 - flags[kFLAGS.FACTORY_TAKEN_GROPLUS]) + " bottles of something called 'Gro+' inside.\n");
					addButton(1, "GroPlus", takeGroPlus);
				}
			}
			else {
				outputText("There is an unopened crate with five bottles of something called 'Gro+' inside.\n\n");
				addButton(1, "GroPlus", takeGroPlus);
			}
		}
		public  roomBathroom(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_FACTORY_BATHROOM;
			clearOutput();
			outputText(images.showImage("factory-washroom"));
			outputText("<b><u>Washroom</u></b>\n");
			outputText("This room is fairly clean. At one of the walls, there is a row of four sinks. Opposite side, there are few bathroom stalls. Three urinals are mounted against one of the walls. You'd guess even the demons need to use the bathroom.");
			dungeons.setDungeonButtons(undefined, undefined, undefined, roomLobby);
//			outputText("Do you use?")
//			addButton(2, "Use", useBathroom);
		}
	}
