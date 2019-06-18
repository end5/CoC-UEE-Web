//Side Dungeon: Hellhound Dungeon (Stub)
	
	use namespace kGAMECLASS;

	export class HellhoundComplex extends DungeonAbstractContent
	{
		public  HellhoundComplex() {}
		
		public  enterDungeonDev(): void {
			kGAMECLASS.inDungeon = true;
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_HELLHOUND_ENTRANCE;
			doNext(playerMenu);
		}
		public  exitDungeonDev(): void {
			kGAMECLASS.inDungeon = false;
			kGAMECLASS.dungeonLoc = 0;
			doNext(camp.returnToCampUseOneHour);
		}
		
		public  roomEntrance(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_HELLHOUND_ENTRANCE;
			clearOutput();
			outputText(images.showImage("location-hellhound-entrance"));
			outputText("<b><u>Entrance</u></b>\n");
			outputText("The interior of the fort is obviously just the outer fortifications of a much bigger complex that goes deep inside a cave system.");
			outputText("\n\nBehind you is a pair of large doors, obviously the way out.");
			dungeons.setDungeonButtons(roomCorridor1, exitDungeonDev, undefined, undefined);
		}
		
		public  roomCorridor1(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_HELLHOUND_CORRIDOR1;
			clearOutput();
			outputText(images.showImage("location-hellhound-corridor1"));
			outputText("<b><u>Corridor 1</u></b>\n");
			outputText("(Placeholder) A dark corridor leading the way between the lobby and the kennels.");
			outputText("There's another door leading deeper inside but it's locked, maybe you should going through the kennels?");
			dungeons.setDungeonButtons(undefined, roomEntrance, roomKennels, roomKitchen);
		}
		
		public  roomKitchen(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_HELLHOUND_KITCHEN;
			clearOutput();
			outputText(images.showImage("location-hellhound-kitchen"));
			outputText("<b><u>Kitchen</u></b>\n");
			dungeons.setDungeonButtons(undefined, undefined, roomCorridor1, undefined);
		}
		
		public  roomKennels(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_HELLHOUND_KENNELS;
			clearOutput();
			outputText(images.showImage("location-hellhound-kennels"));
			outputText("<b><u>Kennels</u></b>\n");
			outputText("(Placeholder) Full of cages where the hellhounds are sleeping. The door to the north leads to the pleasure pits and the door to the east leads back to the corridor.");
			dungeons.setDungeonButtons(roomPleasurePits, undefined, undefined, roomCorridor1);
		}
		
		public  roomPleasurePits(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_HELLHOUND_PLEASURE_PITS;
			clearOutput();
			outputText(images.showImage("location-hellhound-kennels"));
			outputText("<b><u>Pleasure Pits</u></b>\n");
			outputText("(Placeholder) Full of cages where the horny hellhounds romp about, fucking each other senselessly. The door to the east leads to another corridor.");
			outputText("\n\nYou may also have to fight a horde of hellhounds here. By Marae, it smells like corrupted cum" + (flags[kFLAGS.WATERSPORTS_ENABLED] > 0 ? " and of course, demonic piss" : "") + "!");
			dungeons.setDungeonButtons(roomLivingQuarters, roomKennels, undefined, roomCorridor2);
		}
		
		public  roomLivingQuarters(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_HELLHOUND_QUARTERS;
			clearOutput();
			outputText(images.showImage("location-living-quarters"));
			outputText("<b><u>Living Quarters</u></b>\n");
			outputText("(Placeholder) Full of bunk beds and footlockers. Also where the demons sleep.");
			outputText("\n\nMay contain a loot here.");
			dungeons.setDungeonButtons(undefined, roomPleasurePits, undefined, undefined);
		}
		
		public  roomCorridor2(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_HELLHOUND_CORRIDOR2;
			clearOutput();
			outputText(images.showImage("location-hellhound-corridor2"));
			outputText("<b><u>Corridor 2</u></b>\n");
			outputText("(Placeholder) Another dank corridor. The door to the west leads to the pleasure pits, the door to the east leads to the labs. The door to the south appears to be sealed.");
			outputText("\n\nThe door leading to the sanctum is to the north. This will be locked when the dungeon is completed and implemented.");
			dungeons.setDungeonButtons(roomInnerSanctum, roomCorridor1, roomPleasurePits, roomLab);
		}
		
		public  roomLab(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_HELLHOUND_LAB;
			clearOutput();
			outputText(images.showImage("location-hellhound-lab"));
			outputText("<b><u>Laboratory</u></b>\n");
			outputText("(Placeholder) A room where the demons conduct experiments on willing hellhounds but also the unwilling ones who were punished.");
			outputText("\n\nThis will also be where you fight the demon to get the key to unlock the Inner Sanctum.");
			dungeons.setDungeonButtons(roomStorage, undefined, roomCorridor2, undefined);
		}
		
		public  roomStorage(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_HELLHOUND_STORAGE;
			clearOutput();
			outputText(images.showImage("location-hellhound-storage"));
			outputText("<b><u>Storage</u></b>\n");
			dungeons.setDungeonButtons(undefined, roomLab, undefined, undefined);
		}
		
		public  roomInnerSanctum(): void {
			kGAMECLASS.dungeonLoc = DungeonCore.DUNGEON_HELLHOUND_INNER_SANCTUM;
			clearOutput();
			outputText(images.showImage("location-hellhound-lab"));
			outputText("<b><u>Inner Sanctum</u></b>\n");
			outputText("(Placeholder) The final room where the Hellhound Master resides. This is also where you will fight him.");
			dungeons.setDungeonButtons(undefined, roomCorridor2, undefined, undefined);
		}
		
	}

