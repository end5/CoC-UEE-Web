
	export class DungeonMap extends BaseContent {
		//Declare those map variables. They're set in such a way that the map can be updated as flags change
		public  mapFactoryF1: any[];
		public  mapFactoryF2: any[];
		public  mapDeepcave: any[];
		public  mapStrongholdP1: any[];
		public  mapStrongholdP2: any[];
		public  mapDesertcave: any[];
		public  mapPhoenixtowerB1: any[];
		public  mapPhoenixtowerF1: any[];
		public  mapPhoenixtowerF2: any[];
		public  mapPhoenixtowerF3: any[];
		public  mapAnzupalaceB1: any[];
		public  mapAnzupalaceF1: any[];
		public  mapAnzupalaceF2: any[];
		public  mapAnzupalaceF3: any[];
		public  mapAnzupalaceF4: any[];
		public  mapHellcomplex: any[];
		public  mapDragoncityF1: any[];
		public  mapDragoncityB1: any[];

		//How to work with the refactored map:
		//-1 is wide empty space 1x3
		//-2 is narrow empty space 1x1
		//-3 is vertical passage (|)
		//-4 is horizontal passage (-)
		//-5 and -6 are locked passage. Only used for boolean checks (L)
		//The numbered rooms correspond to the room ID

		public  updateMap(): void {
			//Factory
			mapFactoryF1 = [ //Room 00-05 + 06
				"Factory, Floor 1",
				[-1, -2,  4, -2, -1],
				[-1, -2, -3, -2, -1],
				[ 5, -4,  2, -4,  3],
				[-1, -2, d1, -2, -1],
				[ 9, -4,  0, -4,  1],
				[-1, -2, -3, -2, -1]];
			mapFactoryF2 = [ //Room 06-08
				"Factory, Floor 2",
				[ 6, -4,  7],
				[d2, -2, -1],
				[ 8, -2, -1]];
			//Deep Cave
			mapDeepcave = [ //Room 10-16
				"Zetaz's Lair",
				[-1, -2, 16, -4, 15],
				[-1, -2, d3, -2, -3],
				[13, -4, 12, -4, 14],
				[-1, -2, -3, -2, -1],
				[-1, -2, 11, -2, -1],
				[-1, -2, -3, -2, -1],
				[-1, -2, 10, -2, -1],
				[-1, -2, -3, -2, -1]];
			//Lethice's Stronghold
			mapStrongholdP1 = [
				"Basilisk Cave",
				[-1, -2, "tunnel2", -4, -1],
				[-1, -2, -3, -2, -1],
				[-1, -2, "magpiehalls", -2, -1], //Will need to account for magpiehalln 
				[-1, -2, -3, -2, -1],
				[-1, -2, "antechamber", -4, "roomofmirrors"],
				[-1, -2, -3, -2, -1],
				["entrance", -4, "tunnel", -2, -1],
				[-3, -2, -1, -2, -1]];
			mapStrongholdP2 = [
				"Lethice's Keep",
				[-1, -2, -1, -2, "throneroom", -2, -1, -2, -1],
				[-1, -2, -1, -2, d5, -2, -1, -2, -1],
				[-1, -2, "northwestcourtyard", -4, "northcourtyard", -4, "northeastcourtyard", -2, -1],
				[-1, -2, -3, -2, -1, -2, -3, -2, -1],
				[-1, -4, "northwestwalk", -2, -1, -2, "northeastwalk", -4, -1],
				[-1, -2, -3, -2, -1, -2, -3, -2, -1],
				[-1, -2, "westwalk", -4, "courtyardsquare", -4, "eastwalk", -2, -1],
				[-1, -2, -3, -2, -1, -2, -3, -2, -1],
				[-1, -2, "southwestwalk", -2, -1, -2, "southeastwalk", -2, -1],
				[-1, -2, -3, -2, -1, -2, -3, -2, -1],
				[-1, -4, "southwestcourtyard", -4, "southcourtyard", -4, "southeastcourtyard", -4, -1],
				[-1, -2, -1, -2, -3, -2, -3, -2, -1],
				[-1, -2, -1, -2, "northentry", -2, "greatlift", -2, -1],
				[-1, -2, -1, -2, -3, -2, -1, -2, -1],
				[-1, -2, -1, -4, "edgeofkeep", -2, -1, -2, -1]];
			//Desert Cave
			mapDesertcave = [
				"Cave of the Sand Witches",
				[-1, -2, -1, -2, 38, -2, -1, -2, -1],
				[-1, -2, -1, -2, -3, -2, -1, -2, -1],
				[29, -2, 26, -2, 37, -2, 32, -4, 33],
				[-3, -2, -3, -2, d4, -2, -3, -2, -2],
				[28, -4, 25, -4, 24, -4, 31, -4, 34],
				[-3, -2, -3, -2, -3, -2, -2, -2, -3],
				[30, -2, 27, -2, 23, -2, 36, -4, 35],
				[-1, -2, -1, -2, -3, -2, -1, -2, -1]];
			//Phoenix Tower
			mapPhoenixtowerB1 = [
				"Tower of the Phoenix, Basement",
				[-1, -2, 20],
				[-1, -2, -1],
				[-1, -2, 18]];
			mapPhoenixtowerF1 = [
				"Tower of the Phoenix, Floor 1",
				[-1, -2, 19],
				[-1, -2, -3],
				[-1, -2, 17],
				[-1, -2, -3]];
			mapPhoenixtowerF2 = [
				"Tower of the Phoenix, Floor 2",
				[-1, -2, 21],
				[-1, -2, -1],
				[-1, -2, -1]];
			mapPhoenixtowerF3 = [
				"Tower of the Phoenix, Floor 3",
				[-1, -2, 22],
				[-1, -2, -1],
				[-1, -2, -1]];
			//Anzu's Palace
			mapAnzupalaceB1 = [
				"Anzu's Palace, Basement",
				[-1, -2, -1, -2, -1],
				[-1, -2, -1, -2, -1],
				[54, -4, 53, -2, -1]];
			mapAnzupalaceF1 = [
				"Anzu's Palace, Floor 1",
				[42, -2, -1, -2, 44],
				[-3, -2, -1, -2, -3],
				[41, -4, 40, -4, 43],
				[-1, -2, -3, -2, -1],
				[-1, -2, 39, -2, -1],
				[-1, -2, -3, -2, -1]];
			mapAnzupalaceF2 = [
				"Anzu's Palace, Floor 2",
				[-1, -2, 48, -2, -1],
				[-1, -2, -3, -2, -1],
				[46, -4, 45, -4, 47]];
			mapAnzupalaceF3 = [
				"Anzu's Palace, Floor 3",
				[-1, -2, -1, -2, -1],
				[-1, -2, -1, -2, -1],
				[50, -4, 49, -4, 51]];
			mapAnzupalaceF4 = [
				"Anzu's Palace, Roof",
				[-1, -2, -1, -2, -1],
				[-1, -2, -1, -2, -1],
				[-1, -2, 52, -2, -1]];
			//Hellhound Master Dungeon
			mapHellcomplex = [
				"Hellhound Complex",
				[74, -2, 75, -2, 73],
				[-3, -2, -3, -2, -3],
				[70, -4, 67, -4, 71],
				[-3, -2, -3, -2, -1],
				[69, -4, 66, -4, 72],
				[-1, -2, -3, -2, -1],
				[-1, -2, 65, -2, -1],
				[-1, -2, -3, -2, -1]];
			//Dragon City (Ember Quest)
			mapDragoncityF1 = [
				"Dragon City",
				[-1, -2, 59, -2, -1],
				[-1, -2, -3, -2, -3],
				[57, -4, 58, -2, 61],
				[-3, -2, -3, -2, -3],
				[56, -4, 55, -4, 60],
				[-1, -2, -3, -2, -1]];
			mapDragoncityB1 = [
				"Dragon City, Sewers",
				[-1, -2, 64, -2, -1],
				[-1, -2, -3, -2, -1],
				[62, -4, 63, -2, -1]];
		}

		public  get d1(): number { //Door that requires iron key
			return (player.hasKeyItem("Iron Key") >= 0 ? -3 : -5);
		}
		public  get d2(): number { //Door that requires supervisors key
			return (player.hasKeyItem("Supervisor's Key") >= 0 ? -3 : -5);
		}
		public  get d3(): number { //Door in Zetaz's lair
			return (flags[kFLAGS.ZETAZ_DOOR_UNLOCKED] > 0 ? -3 : -5);
		}
		public  get d4(): number { //Door in desert cave
			return (flags[kFLAGS.SANDWITCH_THRONE_UNLOCKED] > 0 ? -3 : -5);
		}
		public  get d5(): number {
			return (kGAMECLASS.lethicesKeep.unlockedThroneRoom() ? -3 : -5);
		}

		public  chooseRoomToDisplay(): void {
			updateMap();
			if (getGame().inRoomedDungeon) {
				if (getGame().inRoomedDungeonName == "BasiliskCave") buildMapDisplay(mapStrongholdP1);
				if (getGame().inRoomedDungeonName == "LethicesKeep") buildMapDisplay(mapStrongholdP2);
			}
			else if (kGAMECLASS.dungeonLoc >= 0 && kGAMECLASS.dungeonLoc < 10) { //Factory
				if (kGAMECLASS.dungeonLoc < 6 || kGAMECLASS.dungeonLoc == 9)
					 buildMapDisplay(mapFactoryF1);
				else buildMapDisplay(mapFactoryF2);
			}
			else if (kGAMECLASS.dungeonLoc >= 10 && kGAMECLASS.dungeonLoc < 17) //Zetaz's Lair
				buildMapDisplay(mapDeepcave);
			else if (kGAMECLASS.dungeonLoc >= 17 && kGAMECLASS.dungeonLoc < 23) { //Tower of the Phoenix
				switch(kGAMECLASS.dungeonLoc) {
					case 18:
					case 20: buildMapDisplay(mapPhoenixtowerB1); break;
					case 17:
					case 19: buildMapDisplay(mapPhoenixtowerF1); break;
					case 21: buildMapDisplay(mapPhoenixtowerF2); break;
					case 22: buildMapDisplay(mapPhoenixtowerF3); break;
					default: buildMapDisplay(mapPhoenixtowerF1);
				}
			}
			else if (kGAMECLASS.dungeonLoc >= 23 && kGAMECLASS.dungeonLoc < 39) //Desert Cave
				buildMapDisplay(mapDesertcave);
			else if (kGAMECLASS.dungeonLoc >= 39 && kGAMECLASS.dungeonLoc < 55) { //Anzu's Palace
				if (kGAMECLASS.dungeonLoc >= 39 && kGAMECLASS.dungeonLoc <= 44) buildMapDisplay(mapAnzupalaceF1);
				if (kGAMECLASS.dungeonLoc >= 45 && kGAMECLASS.dungeonLoc <= 48) buildMapDisplay(mapAnzupalaceF2);
				if (kGAMECLASS.dungeonLoc >= 49 && kGAMECLASS.dungeonLoc <= 51) buildMapDisplay(mapAnzupalaceF3);
				if (kGAMECLASS.dungeonLoc == 52) buildMapDisplay(mapAnzupalaceF4);
				if (kGAMECLASS.dungeonLoc == 53 || kGAMECLASS.dungeonLoc == 54) buildMapDisplay(mapAnzupalaceB1);
			}
			else if (kGAMECLASS.dungeonLoc >= 55 && kGAMECLASS.dungeonLoc < 65) { //Dragon City
				if (kGAMECLASS.dungeonLoc < 62)
					 buildMapDisplay(mapDragoncityF1);
				else buildMapDisplay(mapDragoncityB1);
			}
			else if (kGAMECLASS.dungeonLoc >= 65 && kGAMECLASS.dungeonLoc < 75)
				buildMapDisplay(mapHellcomplex);
		}

		public  buildMapDisplay(map: any[]): void {
			displayHeader(map[0] + "\n");
			outputText("<font face=\"Consolas, _typewriter\">");
		var  outerMapLength: number = map.length;
			for (var i: number = 1; i < outerMapLength; i++) {
			var  innerMapLength: number = map[i].length;
				for (var j: number = 0; j < innerMapLength; j++) {
					//Negative numbers are special
					if (map[i][j] is int && map[i][j] < 0) {
						switch(map[i][j]) {
							case -1: rawOutputText("   "); break;
							case -2: rawOutputText(" "); break;
							case -3: rawOutputText(" | "); break;
							case -4: rawOutputText("—"); break;
							case -5: rawOutputText(" L "); break;
							case -6: rawOutputText("L"); break;
						default:
							throw new IllegalOperationError("Unhandled negative value " + map[i][j]);
							break;
						}
					}
					else if (getGame().inDungeon && map[i][j] is int && map[i][j] >= 0) {
						switch(map[i][j]) {
							case getGame().dungeonLoc: rawOutputText("[<u>@</u>]"); break;
							case  5:
							case 18:
							case 20:
							case 53: rawOutputText("[<u>^</u>]"); break;
							case  6:
							case 17:
							case 22:
							case 52: rawOutputText("[<u>v</u>]"); break;
							case 19:
							case 21:
							case 40:
							case 45:
							case 49: rawOutputText("[<u>↕</u>]"); break;
							default: rawOutputText("[<u> </u>]");
						}
					}
					else if (getGame().inRoomedDungeon) {
						if (getGame().dungeons._currentRoom == map[i][j])
							 rawOutputText("[<u>@</u>]");
						else rawOutputText("[<u> </u>]");
					}
				} rawOutputText("\n");
			} outputText("</font>");
		}

		public  displayMap(): void {
			clearOutput();
			chooseRoomToDisplay();
			outputText("\n\n<b><u>Legend</u></b>");
			outputText("\n<font face=\"Consolas, _typewriter\">@</font> — Player Location");
			outputText("\n<font face=\"Consolas, _typewriter\">L</font> — Locked Door");
			outputText("\n<font face=\"Consolas, _typewriter\">^v↕</font> — Stairs");
			menu();
			addButton(0, "Close Map", playerMenu);
		}
	}

