/* Created by Kitteh6660. Volcanic Crag is a new endgame area with level 25 encounters
 * Currently a Work in Progress
 * This zone was mentioned in Glacial Rift doc */

	use namespace kGAMECLASS;

	export class VolcanicCrag extends BaseContent implements IExplorable {
		public  behemothScene:BehemothScene;
		/* [INTERMOD:8chan]
		 public  volcanicGolemScene:VolcanicGolemScene           = new VolcanicGolemScene();
		 public  corruptedSandWitchScene:CorruptedSandWitchScene = new CorruptedSandWitchScene();
		 */
		public  VolcanicCrag(pregnancyProgression:PregnancyProgression, output:GuiOutput) {
			this.behemothScene = new BehemothScene(pregnancyProgression, output);
		}

		public  isDiscovered(): boolean { return flags[kFLAGS.DISCOVERED_VOLCANO_CRAG] > 0; }

		public  discover(): void {
			flags[kFLAGS.DISCOVERED_VOLCANO_CRAG] = 1;
			outputText(images.showImage("area-vulcaniccrag"));
			outputText("You walk for some time, roaming the hard-packed and pink-tinged earth of the demon-realm of Mareth. As you progress, you can feel the air getting warm. It gets hotter as you progress until you finally stumble across a blackened landscape. You reward yourself with a sight of the endless series of a volcanic landscape. Crags dot the landscape.\n\n");
			outputText("<b>You've discovered the Volcanic Crag!</b>");
			doNext(camp.returnToCampUseTwoHours);
		}

	private  _explorationEncounter:Encounter = undefined;
	public  get explorationEncounter():Encounter {
		return _explorationEncounter ||= Encounters.group(kGAMECLASS.commonEncounters, {
			name  : "aprilfools",
			when  : function (): boolean {
				return isAprilFools() && flags[kFLAGS.DLC_APRIL_FOOLS] == 0;
			},
			chance: Encounters.ALWAYS,
			call  : cragAprilFools
		}, {
			name  : "behemoth",
			chance: 1,
			call  : behemothScene.behemothIntro
		}, {
			name: "drakesheart",
			call: lootDrakHrt
			/* [INTERMOD: 8chan]
		}, {
			name: "golem",
			when: function (): boolean {
				return flags[kFLAGS.DESTROYEDVOLCANICGOLEM] != 1;
			},
			call: volcanicGolemScene.volcanicGolemIntro
		}, {
			name: "witch",
			call: corruptedSandWitchScene.corrWitchIntro
			*/
		}, {
			name: "obsidianshard",
			chance: 0.2,
			call: lootObsidianShard
		}, {
			name: "walk",
			call: walk
		});
	}
		public  explore(): void {
			flags[kFLAGS.DISCOVERED_VOLCANO_CRAG]++;
			doNext(playerMenu);
			explorationEncounter.execEncounter();
		}

		private  lootDrakHrt(): void {
			clearOutput();
			outputText(images.showImage("item-dHeart"));
			outputText("While you're minding your own business, you spot a flower. You walk over to it, pick it up and smell it. By Marae, it smells amazing! It looks like Drake's Heart as the legends foretold. Now the question is, how did the flower survive the extreme cold anyway? ");
			inventory.takeItem(consumables.DRAKHRT, camp.returnToCampUseOneHour);
		}

		private  lootObsidianShard(): void {
			clearOutput();
			outputText(images.showImage("item-dHeart"));
			outputText("While you're minding your own business, something shiny dazes you momentarily and you turn your head to spot the shining object. You walk over to it, pick it up and look it over. It's dark purple and smooth-feeling, moving your fingers confirm that. ");
			if (player.inte <= rand(80)) {
				outputText("Unfortunately, you cut your fingers over the sharp edge and you quickly jerk your fingers back painfully, looking at the minor bleeding cut that formed on your finger. Ouch! ");
				player.takeDamage(Math.max(5, player.maxHP() / 50), false);
			}
			outputText("You do know that the obsidian shard is very sharp, maybe someone can use it to create deadly weapons?");
			inventory.takeItem(useables.OBSHARD, camp.returnToCampUseOneHour);
		}
		
		private  walk(): void {
			clearOutput();
			outputText(images.showImage("area-volcaniccrag"));
			outputText("You spend one hour exploring the infernal landscape but you don't manage to find anything interesting.");
			dynStats("sen", .5);
			doNext(camp.returnToCampUseOneHour);
		}

		private  cragAprilFools(): void {
			outputText(images.showImage("event-dlc"));
			getGame().aprilFools.DLCPrompt("Extreme Zones DLC", "Get the Extreme Zones DLC to be able to visit Glacial Rift and Volcanic Crag and discover the realms within!", "$4.99");
		}
	}

