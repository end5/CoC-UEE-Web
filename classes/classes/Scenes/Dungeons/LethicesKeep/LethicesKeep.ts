
	/**
	 * ...
	 * @author Gedan
	 */
	export class LethicesKeep extends BaseContent {
		private static  LOGGER:ILogger = LoggerFactory.getLogger(LethicesKeep);

		public  jeanClaude:JeanClaudeScenes = new JeanClaudeScenes();
		public  doppelganger:DoppelgangerScenes = new DoppelgangerScenes();
		public  incubusMechanic:IncubusMechanicScenes = new IncubusMechanicScenes();
		public  livingStatue:LivingStatueScenes = new LivingStatueScenes();
		public  succubusGardener:SuccubusGardenerScenes = new SuccubusGardenerScenes();
		public  hermCentaur:HermCentaurScenes = new HermCentaurScenes();
		public  driderIncubus:DriderIncubusScenes = new DriderIncubusScenes();
		public  minotaurKing:MinotaurKingScenes = new MinotaurKingScenes();
		public  lethice:LethiceScenes = new LethiceScenes();

		public  LethicesKeep() {}

		public  configureRooms(): void {
		var  tRoom:room;
			LOGGER.info("Setting up D3 rooms...");
			LOGGER.debug("Dungeons are {0}", kGAMECLASS.dungeons);
			if (kGAMECLASS.dungeons != undefined) LOGGER.debug("Rooms are {0}", kGAMECLASS.dungeons.rooms);
			//Entrance
			tRoom = new room();
			tRoom.RoomName = "entrance";
			tRoom.EastExit = "tunnel1";
			tRoom.RoomFunction = entranceRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//Tunnel 1
			tRoom = new room();
			tRoom.RoomName = "tunnel1";
			tRoom.NorthExit = "antechamber";
			tRoom.WestExit = "entrance";
			tRoom.RoomFunction = tunnel1RoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//Antechamber
			tRoom = new room();
			tRoom.RoomName = "antechamber";
			tRoom.NorthExit = "magpiehalls";
			tRoom.EastExit = "roomofmirrors";
			tRoom.SouthExit = "tunnel1";
			tRoom.RoomFunction = antechamberRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//Room of Mirrors
			tRoom = new room();
			tRoom.RoomName = "roomofmirrors";
			tRoom.WestExit = "antechamber";
			tRoom.RoomFunction = roomofmirrorsRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//Magpie Hall S
			tRoom = new room();
			tRoom.RoomName = "magpiehalls";
			tRoom.NorthExit = "tunnel2";
			tRoom.SouthExit = "antechamber";
			tRoom.RoomFunction = magpiehallsRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//Magpie Hall N
			tRoom = new room();
			tRoom.RoomName = "magpiehalln";
			tRoom.NorthExit = "tunnel2";
			tRoom.SouthExit = "antechamber";
			tRoom.RoomFunction = magpiehallnRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//Tunnel 2
			tRoom = new room();
			tRoom.RoomName = "tunnel2";
			tRoom.EastExit = "edgeofkeep";
			tRoom.SouthExit = "magpiehalln";
			tRoom.RoomFunction = tunnel2RoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//Edge of Keep
			tRoom = new room();
			tRoom.RoomName = "edgeofkeep";
			tRoom.NorthExit = "northentry";
			tRoom.WestExit = "tunnel2";
			tRoom.RoomFunction = edgeofkeepRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//North Entry
			tRoom = new room();
			tRoom.RoomName = "northentry";
			tRoom.NorthExit = "southcourtyard";
			tRoom.SouthExit = "edgeofkeep";
			tRoom.RoomFunction = northentryRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//South Courtyard
			tRoom = new room();
			tRoom.RoomName = "southcourtyard";
			tRoom.SouthExit = "northentry";
			tRoom.EastExit = "southeastcourtyard";
			tRoom.WestExit = "southwestcourtyard";
			tRoom.RoomFunction = southcourtyardRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//South West Courtyard
			tRoom = new room();
			tRoom.RoomName = "southwestcourtyard";
			tRoom.EastExit = "southcourtyard";
			tRoom.NorthExit = "southwestwalk";
			tRoom.RoomFunction = southwestcourtyardRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//South West Walk
			tRoom = new room();
			tRoom.RoomName = "southwestwalk";
			tRoom.NorthExit = "westwalk";
			tRoom.SouthExit = "southwestcourtyard";
			tRoom.RoomFunction = southwestwalkRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//West Walk
			tRoom = new room();
			tRoom.RoomName = "westwalk";
			tRoom.NorthExit = "northwestwalk";
			tRoom.EastExit = "courtyardsquare";
			tRoom.SouthExit = "southwestwalk";
			tRoom.RoomFunction = westwalkRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//North West Walk
			tRoom = new room();
			tRoom.RoomName = "northwestwalk";
			tRoom.NorthExit = "northwestcourtyard";
			tRoom.SouthExit = "westwalk";
			tRoom.RoomFunction = northwestwalkRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//North West Courtyard
			tRoom = new room();
			tRoom.RoomName = "northwestcourtyard";
			tRoom.EastExit = "northcourtyard";
			tRoom.SouthExit = "northwestwalk";
			tRoom.RoomFunction = northwestcourtyardRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//North Courtyard
			tRoom = new room();
			tRoom.RoomName = "northcourtyard";
			tRoom.EastExit = "northeastcourtyard";
			tRoom.WestExit = "northwestcourtyard";
			tRoom.NorthExit = "throneroom";
			tRoom.NorthExitCondition = unlockedThroneRoom;
			tRoom.RoomFunction = northcourtyardRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//North East Courtyard
			tRoom = new room();
			tRoom.RoomName = "northeastcourtyard";
			tRoom.SouthExit = "northeastwalk";
			tRoom.WestExit = "northcourtyard";
			tRoom.RoomFunction = northeastcourtyardRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//North East Walk
			tRoom = new room();
			tRoom.RoomName = "northeastwalk";
			tRoom.NorthExit = "northeastcourtyard";
			tRoom.SouthExit = "eastwalk";
			tRoom.RoomFunction = northeastwalkRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//East Walk
			tRoom = new room();
			tRoom.RoomName = "eastwalk";
			tRoom.NorthExit = "northeastwalk";
			tRoom.SouthExit = "southeastwalk";
			tRoom.WestExit = "courtyardsquare";
			tRoom.RoomFunction = eastwalkRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//South East Walk
			tRoom = new room();
			tRoom.RoomName = "southeastwalk";
			tRoom.NorthExit = "eastwalk";
			tRoom.SouthExit = "southeastcourtyard";
			tRoom.RoomFunction = southeastwalkRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//South East Courtyard
			tRoom = new room();
			tRoom.RoomName = "southeastcourtyard";
			tRoom.NorthExit = "southeastwalk";
			tRoom.SouthExit = "greatlift";
			tRoom.WestExit = "southcourtyard";
			tRoom.RoomFunction = southeastcourtyardRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//Courtyard Square
			tRoom = new room();
			tRoom.RoomName = "courtyardsquare";
			tRoom.EastExit = "eastwalk";
			tRoom.WestExit = "westwalk";
			tRoom.RoomFunction = courtyardsquareRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//Great Lift
			tRoom = new room();
			tRoom.RoomName = "greatlift";
			tRoom.NorthExit = "southeastcourtyard";
			tRoom.RoomFunction = greatliftRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
			//FINAL ROOM: Throne Room
			tRoom = new room();
			tRoom.RoomName = "throneroom";
			tRoom.SouthExit = "northcourtyard";
			tRoom.RoomFunction = throneRoomFunc;
			getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
		}
		//Entrance/Exit
		public  discoverD3(): void {
			flags[kFLAGS.D3_DISCOVERED] = 1;
			clearOutput();
			outputText(images.showImage("stronghold-entrance"));
			outputText("During your exploration, you come across a familiar looking patch of ground. In fact... you pull out Zetaz’s map, your eyes widening as they realize what you’ve just found: Lethice’s Keep. You follow a concealed trail past several harpy nests directly to an almost invisible cave entrance. You never would’ve found it without the map.");
			outputText("\n\n<b>You’ve discovered a hidden entrance to Lethice’s lair. It can be accessed from the Dungeons submenu in the future.</b>");
			outputText("\n\nDo you step inside, or wait until you’re better prepared?");
			menu();
			addButton(0, "Enter", enterD3);
			addButton(1, "Leave", camp.returnToCampUseOneHour);
		}

		public  enterD3(): void {
			kGAMECLASS.dungeons.setDungeonButtons(); //Ensures the top buttons are visible.
			menu(); //Clear bottom buttons
			inRoomedDungeon = true;
			inRoomedDungeonResume = getGame().dungeons.resumeFromFight;
			inRoomedDungeonName = "BasiliskCave";
			getGame().dungeons.move("entrance");
		}

		public  exitD3(): void {
			inRoomedDungeon = false;
			inRoomedDungeonResume = undefined;
			inRoomedDungeonName = "";
			if (flags[kFLAGS.GRIMDARK_MODE] > 0) {
				inRoomedDungeonResume = getGame().exploration.highmountainZoneFunc;
				inRoomedDungeonName = "GrimdarkMareth";
			}
			camp.returnToCampUseOneHour();
		}

		public  entranceRoomFunc(): boolean {
			outputText(images.showImage("stronghold-Entrance-room"));
			outputText("<b><u>Entrance Room</u></b>\n");
			outputText("The inside of this cave is damp and dark, but it bears signs of frequent use. The map you got from Zetaz matches the curves of this winding passage exactly. There can be no doubt that this is the place, even though his map ends a short distance into the tunnel. Either he knew it would be a linear path or was so familiar with the territory that he didn’t think it was worth writing down. You can go east, deeper into the mountain towards Lethice’s fortress, or leave to the west.");
			addButton(10, "Exit", exitD3);
			return false;
		}

		public  tunnel1RoomFunc(): boolean {
			outputText(images.showImage("stronghold-tunnel-1"));
			outputText("<b><u>Tunnel</u></b>\n");
			outputText("Winding back and forth, the tunnel gradually arcs west and north from here, sloping steeply upward in the latter direction. The upward sloping side must lead to Lethice’s fortress, supposedly at the top of the mountain. You’ll have to be careful down here. You doubt that such an entrance would be completely unguarded. As a matter of fact... you think you can see signs of worked stone to the north. You’re getting close to something.");
			return false;
		}

		public  antechamberRoomFunc(): boolean {
			outputText(images.showImage("stronghold-Antechamber"));
			outputText("<b><u>Antechamber</u></b>\n");
			outputText("You are standing in a large, gloomy lobby, lit by the drear yellow pulse of gas lamps. The walls, floor and distant ceiling are uniformly built from a dark, aged stone which serves to make the vault-like space shadowy and oppressive, despite its size. The floor has been polished a dull bronze by years of use and the distant sound of activity permeates the air; it has the atmosphere of a place which is thronged with people during rush hour but is for now as deserted as a school corridor during class hours. Something to be grateful for perhaps, but you should get a move on.");
			outputText("\n\nAhead is a large archway. Through it you can see some sort of dark screen set into a wall. On the right is a much smaller metal door, which looks like it might be a storage room.");
			return false;
		}

		public  roomofmirrorsRoomFunc(): boolean {
			outputText(images.showImage("stronghold-Mirrors-room"));
			outputText("<b><u>Room of Mirrors</u></b>\n");
			outputText("The metal door opens soundlessly onto a fairly large, unlit room, shabby and grey with disuse. It is cluttered with a great quantity of mirrors. Round hand mirrors are stacked on shelves, square wall mirrors are leant against walls, a large,");
			if (flags[kFLAGS.D3_MIRRORS_SHATTERED] == 1) outputText(" now shattered,");
			outputText(" ornate standing mirror dominates the center of the room, and a number of broken, jagged specimens are stacked near the back. They reflect the dull trappings of this place back at you emptily. You guess as self-centred a race as the demons probably has quite a large use for these.");
			
			if (player.hasKeyItem("Laybans") >= 0) outputText("\n\nThe place feels hollow and creepy, even after the ad hoc exorcism you performed here. There is no reason to linger.");
			else {
				outputText("\n\nNear the back, next to the broken stack is a white stand, displaying what appear to be a number of dark shades.");
				if (flags[kFLAGS.D3_ENTERED_MAGPIEHALL] == 1) outputText("  Your spirits rise. They look like they may very well be made of the same material as the screen in the basilisk hall.");
				if (player.inte >= 70 || player.sens >= 70) outputText("  Disquiet edges down your spine. Something about this place doesn’t feel right. The room seems faded at the corners, as if it’s not quite there.");
				addButton(2, "Glasses", doppelganger.getDemGlasses).hint("Take the interesting pair of glasses." + (flags[kFLAGS.D3_ENTERED_MAGPIEHALL] > 0 ? " This would certainly help you with traversing the hall full of basilisks." : ""));
			}
			return false;
		}

		public  magpiehallsRoomFunc(): boolean {
			if (flags[kFLAGS.D3_JEAN_CLAUDE_DEFEATED] == 0) outputText(images.showImage("stronghold-basilisks"));
			else outputText(images.showImage("stronghold-Magpie-hall"));
			outputText("<b><u>Magpie Hall</u></b>\n");
			if (flags[kFLAGS.D3_JEAN_CLAUDE_DEFEATED] == 0) {
				if (flags[kFLAGS.D3_ENTERED_MAGPIEHALL] == 0) {
					flags[kFLAGS.D3_ENTERED_MAGPIEHALL] = 1;
					outputText("You creep through the archway. The sound of movement and bustle is closer here; it seems to be coming from directly below you. Ahead is the screen, a large window made from tinted glass. Cautiously you peer through it. You have entered a vast hall, near the very top of it; this seems to be some sort of observation booth set high in the stone wall. It’s designed in the grand, classical tradition, fluted balustrades flanking the walls, each decorated at the top by a carved magpie in flight. Below is - well. You blink, trying to take it all in.\n\n");
					outputText("Many feet below the hall swarms with activity: tall, thin, grey-green reptiles sliding sinuously around each other and the long tables that run the length of the room. There must be hundreds, no, at least a thousand basilisks down there, carrying, analyzing, sorting the vast amount of junk the tables are heaped with.  ");
					if (flags[kFLAGS.BENOIT_AFFECTION] == 100) outputText("This can only be the hall that " + getGame().bazaar.benoit.benoitMF("Benoit", "Benoite") + " once worked in.  ");
					outputText("You get the fright of your life when you think you see a number of depthless pools of grey revolve up to meet yours- but they don’t freeze you, you note as you reflexively turn away. The tinted glass must carry some sort of anti-petrifying charm, and further it must be reflective on the other side, because no one below seems to realize you’re standing there. Relaxing a bit, you continue to absorb the massive room. At the end furthest away from you two huge piles have been created- one of eggs, a massed assortment of every color and size imaginable, and one of pure junk, presumably everything the basilisks have found whilst scavenging and considered worth keeping. The detritus of a dozen collapsed civilizations must be down there, collected for the demons’ perusal by their scaly custodians. Directly below you, you can see archways like the one you just passed under, through which the basilisks ebb and flow.\n\n");
					outputText("Your heartbeat quickens as you consider. There is a grid gantry running from where you are right around the room to the other side, where you can see a matching observation booth, presumably containing another exit. But it’s quite a distance, there are stairs leading down to the ground level, and outside the protective glass you would surely be spotted and apprehended");
					if (player.canFly()) outputText(", even if you tried to fly it");
					outputText(". Wouldn’t you? You can’t outrun the gaze of a thousand basilisks... could you?");
					if (player.hasKeyItem("Laybans") >= 0) outputText("  You take the Laybans out of your pouch and hold them up against the glass. It’s exactly as you hoped - they are made of the same material, and are almost certainly what the demons wear when they themselves interact with the basilisks. They would surely help you get across the hall, if you were crazy enough to try.");
				}
				else {
					outputText("Again you creep up to the tinted glass, again you take in the vast hall with the army of basilisks below hard at work, and again you stare out at the metal gantry, with the exit tantalizingly visible on the other side.");
					if (player.hasKeyItem("Laybans") < 0) outputText("  Are you going to try this?");
					else outputText("  You take the Laybans out of your pocket, turning them around in your hands as you consider. Are you going to try this?");
				}
				unlockCodexEntry("Basilisks", kFLAGS.CODEX_ENTRY_BASILISKS);
				menu();
				addButton(0, "Go!", jeanClaude.gogoFuckTheseBasilisks).hint("Just RUN! Run like the wind while avoiding the basilisks!");
				addButton(1, "Fall Back", fallbackFromMagpieHallS).hint("Retreat! You're not ready to face the basilisks yet.");
				return true;
			}
			outputText("You are back in the southern end of the Magpie Hall.  Without the bustle of activity below it is a gapingly empty and quiet place, the only sound the murmur of activity from elsewhere. There is a vast amount of collected junk below but it would take, well, an army of basilisks to sort through it to find anything worthwhile. You could check out the massive pile of eggs, though.");
			if (eggsAvailable() > 0)
				addButton(2, "Eggs", goToEggPile).hint("Inspect the nearby pile of eggs of varying colours.");
			return false;
		}

		private  BLACK: number = 1 << 0;
		private  BLUE: number = 1 << 1;
		private  WHITE: number = 1 << 2;
		private  PINK: number = 1 << 3;
		private  BROWN: number = 1 << 4;
		private  PURPLE: number = 1 << 5;

		private  eggsAvailable(): number {
		var  flagNum: number = flags[kFLAGS.D3_EGGS_AVAILABLE];
		var  eggs: number = 0;
			if (!(flagNum & BLACK)) eggs++;
			if (!(flagNum & BLUE)) eggs++;
			if (!(flagNum & WHITE)) eggs++;
			if (!(flagNum & PINK)) eggs++;
			if (!(flagNum & BROWN)) eggs++;
			if (!(flagNum & PURPLE)) eggs++;
			return eggs;
		}

		private  goToEggPile(): void {
			clearOutput();
			outputText(images.showImage("item-egg-pile"));
			outputText("You head down the stairs into the hall proper to inspect the ramble hoard of eggs the basilisks collected. They’re mostly unfertilised harpy ovum, but you quickly pick out a number of differently coloured transformative eggs stolen from Gods know who.");
			menu();
		var  flagNum: number = flags[kFLAGS.D3_EGGS_AVAILABLE];
			if (!(flagNum & BLACK)) addButton(0, "Black", takeEgg, BLACK);
			if (!(flagNum & BLUE)) addButton(1, "Blue", takeEgg, BLUE);
			if (!(flagNum & WHITE)) addButton(2, "White", takeEgg, WHITE);
			if (!(flagNum & PINK)) addButton(3, "Pink", takeEgg, PINK);
			if (!(flagNum & BROWN)) addButton(4, "Brown", takeEgg, BROWN);
			if (!(flagNum & PURPLE)) addButton(5, "Purple", takeEgg, PURPLE);
			addButton(14, "Back", getGame().dungeons.resumeFromFight);
		}

		public  takeEgg(eggMask: number): void {
		var  item:Consumable;
			if (eggMask == BLACK) item = consumables.L_BLKEG;
			if (eggMask == BLUE) item = consumables.L_BLUEG;
			if (eggMask == WHITE) item = consumables.L_WHTEG;
			if (eggMask == PINK) item = consumables.L_PNKEG;
			if (eggMask == BROWN) item = consumables.L_BRNEG;
			if (eggMask == PURPLE) item = consumables.L_PRPEG;
			//menuLoc = 9999;
			//Should actually be handled by the fallthrough of doNext(1) in the takeItem shit
			clearOutput();
			if (eggMask == BLACK) outputText(images.showImage("item-egg-black"));
			if (eggMask == BLUE) outputText(images.showImage("item-egg-blue"));
			if (eggMask == WHITE) outputText(images.showImage("item-egg-white"));
			if (eggMask == PINK) outputText(images.showImage("item-egg-pink"));
			if (eggMask == BROWN) outputText(images.showImage("item-egg-brown"));
			if (eggMask == PURPLE) outputText(images.showImage("item-egg-purple"));
			outputText("You pluck out " + item.longName + " ");
			flags[kFLAGS.D3_EGGS_AVAILABLE] += eggMask;
			inventory.takeItem(item, playerMenu); //playerMenu is equivalent to doNext(1)
		}

		public  fallbackFromMagpieHallS(): void {
			clearOutput();
			outputText(images.showImage("stronghold-Antechamber"));
			outputText("No, there has to be a better way.");
			if (player.hasKeyItem("Laybans") < 0 && player.inte >= 50) outputText("  Surely the demons themselves are not immune to the basilisks’ glares - the darkened screen is proof of that. How do they interact with the creatures, then? Maybe if you keep poking around, you might find an answer.");
			outputText("\n\nYou head back through the archway into the gloomy antechamber.");
			menu();
			addButton(1, "Next", getGame().dungeons.move, "antechamber");
		}

		public  magpiehallnRoomFunc(): boolean {
			if (flags[kFLAGS.D3_JEAN_CLAUDE_DEFEATED] == 0) outputText(images.showImage("stronghold-Magpie-locked"));
			else outputText(images.showImage("stronghold-Magpie-hall"));
			outputText("<b><u>Magpie Hall</u></b>\n");
			if (flags[kFLAGS.D3_JEAN_CLAUDE_DEFEATED] == 0) {
				outputText("You find yourself back in the small booth, with the locked door leading out into the Magpie Hall. Just like the one on the opposite side, there is a darkened screen here through which you can see hundreds of basilisks milling down below, sorting through the vast amount of junk and eggs they have collected from the mountainside. They don’t seem to have taken any extra precautions following your narrow escape of them- the gantry remains free of any guards, and the door on the other side looks open.");
				menu();
				addButton(0, "Go!", jeanClaude.gogoFuckTheseBasilisksNorth).hint("Just RUN! Run like the wind while avoiding the basilisks!");
				addButton(1, "Stronghold", getGame().dungeons.move, "tunnel2").hint("Retreat back to the tunnel.");
				return true;
			}
			outputText("You are back in the northern end of the Magpie Hall. Without the bustle of activity below it is a gapingly empty and quiet place, the only sound the murmur of activity from elsewhere. There is a vast amount of collected junk below but it would take, well, an army of basilisks to sort through it to find anything worthwhile. You could check out the massive pile of eggs, though.");
			if (eggsAvailable() > 0) addButton(2, "Eggs", goToEggPile).hint("Inspect the nearby pile of eggs of varying colours.");
			return false;
		}

		public  tunnel2RoomFunc(): boolean {
			inRoomedDungeonName = "BasiliskCave";
			outputText(images.showImage("stronghold-tunnel-2"));
			outputText("<b><u>Tunnel</u></b>\n");
			outputText("Light trickles in from the east. After all the trekking through these subterranean holes, you’ve got to be close to the mountain’s summit. You know that down the steeply sloped passage will take you back through the basilisks’ chamber if you want to leave the way you came, but a second trip through that crowded hall might be ill-advised. It’d be best to move forward into the sun.");
			return false;
		}

		public  edgeofkeepRoomFunc(): boolean {
			inRoomedDungeonName = "LethicesKeep";
			outputText(images.showImage("stronghold-Edge-of-Keep"));
			outputText("<b><u>Edge of Keep</u></b>\n");
			outputText("Standing on the edge of the mountain's summit, you can see Mareth for miles in all direction. It's fairly disconcerting to focus on long with the constant shifting and twisting of the wasted areas, but here and there you can pick out islands of stability in the ephemeral terrain. You blink your eyes to clear the nauseating landscape from your view and turn back to the way ahead. Lethice's fortress lies a short distance to the north, its walls tall and stout. The gates themselves hang open. Likely she didn't expect anyone to make it this far.");
			return false;
		}

		public  northentryRoomFunc(): boolean {
			outputText(images.showImage("stronghold-North-entry"));
			outputText("<b><u>North Entry</u></b>\n");
			outputText("You now stand in the archway that is the southern entrance to Lethice's headquarters. The place is built like a castle. You can't see too much from your shaded position, but the bricks that surround you are individual as big as horses. The gates themselves are crafted of wood that looks at least a century old, reinforced with bands of gleaming metal that you doubt will ever rust. A barren cliffside can be seen to the south, the demon queen's lair to the north.");
			return false;
		}

		public  southcourtyardRoomFunc(): boolean {
			outputText(images.showImage("stronghold-courtyard-South"));
			outputText("<b><u>South Courtyard</u></b>\n");
			outputText("Lethice's courtyard is surprisingly well-groomed for a place that's supposedly home to neverending debauchery and depravity. The paths are laid with interconnecting sandstone bricks that reflect the sun to give the place a gentle, amber glow, and lush, green grass lines the sides along with well-trimmed hedges. You could almost mistake this place for a churchyard if it wasn't for the faint sound of moans on the wind. The courtyard paths lead away east and west, while the gateway out hangs open to the south.");
			return false;			
		}

		public  southwestcourtyardRoomFunc(): boolean {
			outputText(images.showImage("stronghold-courtyard-SW"));
			outputText("<b><u>Southwest Courtyard</u></b>\n");
			outputText("Some of the nearby bushes are blooming, filling the air with their sweet scent, unlike any flowers you’ve encounter before. Their petals are a multitude of colors, and their scents, though laced with corruption, are as sweet and pleasant as anything you've had the pleasure of smelling. The path you're treading upon curves north and east from here along the thick, red walls. Vines seem to crowd the way to the north. There are no signs of any ramps or ladders to get to the battlements, but there is a doorway to the west marked as 'Forge Wing'. A notice declares it closed for repairs.");
			return false;
		}

		public  southwestwalkRoomFunc(): boolean {
			if (flags[kFLAGS.D3_GARDENER_DEFEATED] == 0) outputText(images.showImage("sGardener-encounter"));
			else outputText(images.showImage("stronghold-walk-SW"));
			outputText("<b><u>Southwest Walk</u></b>\n");
			outputText("The bushes surrounding the path have given way here to a mass of tentacles, some still bedecked in the flowers that surround the air. They twist and writhe but seem content to stay in their place for now. Besides, if you hang back along the edge of the walk, you should be out of their reach. The path heads north and south... if the wall of oily-looking tendrils leaves you alone.");
			if (flags[kFLAGS.D3_GARDENER_DEFEATED] == 0) {
				outputText("\n\nThe slick foilage parts just ahead, revealing a lissom leg clad in green hosiery that resembles the spiderwork patterns of leafy veins more than any garment. Its owner follows but a moment later, so perfectly, wonderfully shapely that you freeze in place, compelled by biology to take notice. Her expansive bosom, womanly hips, and gentle, soft curves invite you to fall into her embrace. Her lips, full and pouting, beckon for you to taste them. Her hair's lustrous shine glitters like an angler fish's lure, just out of reach and oh so foolish to pursue. The smooth, twists of her ram-like horns keep her coiffure stylish while simultaneously jolting you out of your reverie.");
				outputText("\n\nYou shake your head to regain your focus. This is a demon, and you won't fall for her tricks this easily");
				if (player.lust <= 75) //I'm not sure what this variation was supposed to point at specifically
					 outputText("!");
				else outputText(".... You grope yourself absentmindedly as you consider just how long you'll hold out before submitting. It won't be long.");
				outputText("\n\n<i>\"Why hello there,\"</i> the corrupt temptress says with a tone that's the auditory equivalent to a pat on the head. <i>\"You must be [name]. Did you come all this way just to join my garden?\"</i> The corner of the succubus' mouth curls ever so slightly, her lips gleaming invitingly. <i>\"Or perhaps you could be my first non-floral pet. Would you like that?\"</i> She arches her back to present her breasts to you, held aloft by their own incredible, perfect shape and framed by a skimpy underbust covering that only serves to highlight her hard, perky nipples. They gleam with moisture - milk you suppose.");
				outputText("\n\nShe smiles encouragingly. <i>\"What'll it be?\"</i>");
				menu();
				addButton(0, "Fight", startCombatImmediate, new SuccubusGardener()).hint("She's not going to take you today!");
				addButton(1, "Surrender", succubusGardener.surrenderToTheGardener).hint("Submit to the succubus? This will certainly lead to a bad end.");
				return true;
			}
			return false;
		}

		public  westwalkRoomFunc(): boolean {
			outputText(images.showImage("stronghold-walk-West"));
			outputText("<b><u>West Walk</u></b>\n");
			outputText("Pollen clings to you, released by the many flowering bushes in the area. They only grow thicker to the south, too. To the east, you can");
			if (flags[kFLAGS.D3_STATUE_DEFEATED] == 0) outputText(" see a massive statue with an immense hammer");
			else outputText(" a mound of rubble, the scattered remains of the animated statue that you slew");
			outputText(". The warm, sandstone bricks underfoot fork in a T-intersection, leading north, east, and south. The thick castle walls prevent passage to the west.");
			return false;
		}

		public  northwestwalkRoomFunc(): boolean {
			outputText(images.showImage("stronghold-walk-NW"));
			outputText("<b><u>Northwest Walk</u></b>\n");
			outputText("A narrow path splits from the sandstone thoroughfare towards a pair of double doors to the west. The craftsmanship of the carpenter who made them is on full display; intricate designs of dragons engaged in sexual positions of all kinds are carved around the outer edges of the frame while more mundane, eye-pleasing patterns decorate the center panels. Above, a sign designates this area as the library. Unfortunately the doors are sealed closed. Perhaps the library is not yet written.\n"
			+"You smirk at your own joke.\n\n");
			outputText("The courtyard itself continues much as it has elsewhere. The bushes to the south appear more unruly than elsewhere, but to the north there appears to be nothing but pleasant walking through this botanical paradise.");
			return false;
		}

		public  northwestcourtyardRoomFunc(): boolean {
			outputText(images.showImage("stronghold-courtyard-NW"));
			outputText("<b><u>Northwest Courtyard</u></b>\n");
			outputText("The courtyard comes to an abrupt end here, hemmed in by an impressively high stone wall to the north, high enough to shame the walls in the other cardinal directions. The path is also bounded in by stonework to the west, forcing it to curve to the east and south around a bush that has been tastelessly shaped to resemble a turgid prick. The demons even went so far as to trim ivory flowers into a contiguous path along one side, very much looking like a stream of arboreal spunk.");
			return false;
		}

		public  northcourtyardRoomFunc(): boolean {
			outputText(images.showImage("stronghold-courtyard-North"));
			outputText("<b><u>North Courtyard</u></b>\n");
			outputText("You stand before what can only be the entrance to Lethice’s throne room. It is unlabelled, but the immense door is unlike any you’ve seen in this world or the last. Constructed from some kind of pink-tinged metal and polished to a mirror sheen, this portal has had a lifetime of care poured into it. What’s more, intricate locking mechanisms overlap the edges of it, each one culminating in an intricately worked seal. Fortunately, each of the seals has been left over. Security must not be much of a concern for the demon queen at this point in time. ");
			if (flags[kFLAGS.D3_GARDENER_DEFEATED] > 0 && flags[kFLAGS.D3_CENTAUR_DEFEATED] > 0 && flags[kFLAGS.D3_STATUE_DEFEATED] > 0)
				 outputText("The seal appears to be broken. You could move north and attempt to defeat Lethice for once and for all. Or you can move east and west through the courtyard, if you like.");
			else outputText("If only the door would open. For some reason, it’s still sealed closed. You can still move east and west through the courtyard, if you like.");
			return false;
		}

		public  northeastcourtyardRoomFunc(): boolean {
			outputText(images.showImage("stronghold-courtyard-NE"));
			outputText("<b><u>Northeast Courtyard</u></b>\n");
			outputText("This particular corner of the courtyard feels remarkably cramped, even a little claustrophobic. To the north, a stone wall rises, dwarfing the smaller one to the east, and to make matters worse, the hedges to the southwest are high and square, virtually a wall in their own right. The only avenues of travel available are to the south or west, following the red sandstone bricks as they bend around the corner.");
			if (flags[kFLAGS.D3_CENTAUR_DEFEATED] == 0) {
				hermCentaur.encounterThePony();
				return true;
			} return false;
		}

		public  northeastwalkRoomFunc(): boolean {
			outputText(images.showImage("stronghold-walk-NE"));
			outputText("<b><u>Northeast Walk</u></b>\n");
			outputText("The air is pleasant and free here. Not even the corrupt nature of this place can stop you from enjoying this moment in the demon queen’s garden. Still, there is an aura of lingering danger here. The flowers smell pleasant but somehow off, and every now and again the breezes carry the sounds of whorish moans. An entryway in the east wall leads towards the barracks and mess, identified by a simple sign to the left of the imposing iron door frame. Fortunately, the door is barred and sealed. It seems you’ve come at a time when Lethice’s fortress is near empy. How fortunate for you.");
			return false;
		}

		public  eastwalkRoomFunc(): boolean {
			outputText(images.showImage("stronghold-walk-East"));
			outputText("<b><u>East Walk</u></b>\n");
			outputText("The smooth, almost flawlessly laid stones split into a T-intersection here, heading north, south, and west. The bushes that hem in the paths are likewise split, though they have been maintained with the same sense of care you’ve seen elsewhere in the garden. One particularly interesting shrub has been trimmed into the shape of a large bust, complete with erect nipples. You shake your head and glance west, where you can spot");
			if (flags[kFLAGS.D3_STATUE_DEFEATED] == 0) outputText(" a massive statue with an immense hammer.");
			else outputText(" a mound of rubble, the scattered remains of the animated statue that you slew.");
			return false;
		}

		public  southeastwalkRoomFunc(): boolean {
			outputText(images.showImage("stronghold-walk-SE"));
			outputText("<b><u>Southeast Walk</u></b>\n");
			outputText("Swarms of butterflies congregate on the flowering bushes here. At first, the sight seems beautiful, almost pristine. Then, you spot the endemic corruption that Lethice has spread through the lands. They aren’t just swarms of butterflies - they’re swarms of mating butterflies, crawling all over each other in a swarm of sweet-smelling pollen and fluttering wings. You had best move on. The path leads north and south.");
			return false;
		}

		public  southeastcourtyardRoomFunc(): boolean {
			outputText(images.showImage("stronghold-courtyard-SE"));
			outputText("<b><u>Southeast Courtyard</u></b>\n");
			outputText("Walking along the sandstone path, you're treated to a remarkably peaceful view. Up here, above the clouds the ring the mountain, it's almost too easy to let your guard down. A small hole in the southern wall of Lethice's fortress appears to the south. Peeking through, you can see machinery and some kind of lift suspended over the cliffside. That must be how the demons can come and go safely. You can continue to walk among the bushes to the north and west. An iron door to the east bears lettering denoting it as 'recreation'. A small placard explains that it's currently off limits due to renovations. Graffiti below complains about some contractor named Fenoxo delivering on his promised work schedule.");
			return false;
		}
		//9999 - Check this
		public  courtyardsquareRoomFunc(): boolean {
			outputText(images.showImage("stronghold-courtyard-square"));
			outputText("<b><u>Courtyard Square</u></b>\n");
			//Statue not exploded - mossy - 30’ high
			outputText("A circle of polished stone wraps around a colossus here in the center of the courtyard, ringed by cushioned benches that would be a delight to sit on were they not stained with bodily fluids of all colors and sexes. You didn’t think pink cum was possible, but the demons’ endless sexual creativity doesn’t seem to be bound by such notions. You can leave east and west from here.");
			if (flags[kFLAGS.D3_STATUE_DEFEATED] == 0) {
				outputText("\n\nWait... what’s that?");
				menu();
				addButton(0, "Next", livingStatue.encounter);
				return true;
			}
			outputText("Two disembodied, marble feet and a field of rubble are all that remains of the once proud statue that stood in the center of the courtyard. You dealt with the animated monstrosity but can’t help but feel a little shame at the destruction you’ve so openly wrought. Many of the bushes are torn in half by two ton slabs, and the path is scarred in a dozen places by chips and smashed divots. You can go east and west from here, if you move carefully around the more jagged pieces of stone.");
			return false;
		}

		public  greatliftRoomFunc(): boolean {
			outputText(images.showImage("stronghold-lift"));
			outputText("<b><u>Great Lift</u></b>\n");
			outputText("Intricate stonework supports this precarious platform as it juts from the side of Lethice's fortress, hanging over a sheer cliff that must go down for hundreds of feet. The harpies appear to have moved away from the area immediately below, whether by choice or by demonic action, though you can still spot a few of their nests in other places on the mountainside. A complicated looking machine sits on the side of the platform, attached to a cage that dangles over the edge, supported by a lowly metal cable. It must be some kind of mechanical lift - a way to come and go as one would please.");
			incubusMechanic.meetAtElevator();
			return false;
		}

		public  throneRoomFunc(): boolean {
			if (flags[kFLAGS.DRIDERINCUBUS_DEFEATED] == 0) { driderIncubus.encounterDriderIncbutt(); return true; }
			if (flags[kFLAGS.MINOTAURKING_DEFEATED] == 0) {	minotaurKing.encounterMinotaurKing(); return true; }
			if (flags[kFLAGS.LETHICE_DEFEATED] == 0) { lethice.encounterLethice(); return true; }
			else {
				outputText(images.showImage("stronghold-Throne-room"));
				outputText("<b><u>Throne Room</u></b>\n");
				outputText("The throne room is intricately designed. Purple carpet with red highlights line the floor from the door to the throne. The throne appears to be carved in marble and dotted with lethicite. Along the way, there are beautifully carved marble columns and cum fountains. You blush just by looking at the fountains. ");
				if (flags[kFLAGS.LETHICITE_ARMOR_TAKEN] <= 0 && player.newGamePlusMod() > 0) {
					outputText("\n\nThere is still a suit of lethicite armor Lethice worn when you battled her, in good condition. You could take it if you like. ");
					addButton(0, "Take Armor", lethice.takeLethiciteArmor).hint(armors.LTHCARM.description);
				}
			} return false;
		}
		public  unlockedThroneRoom(): boolean { return (flags[kFLAGS.D3_GARDENER_DEFEATED] > 0 && flags[kFLAGS.D3_CENTAUR_DEFEATED] > 0 && flags[kFLAGS.D3_STATUE_DEFEATED] > 0); }
	}

