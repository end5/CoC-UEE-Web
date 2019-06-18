	/* Deepwoods area found when exploring the Forest */
	export class DeepWoods extends BaseContent implements IExplorable {
		private  forest:Forest;

		/**
		 * Create a new deepwoods instance for exploring.
		 * 
		 * The constructor will fail if the forest is not valid. This fail-fast
		 * behaviour is used because explore() is only called much later, making it harder
		 * to figure out what happened.
		 * @param	forest the forest to use for encounters
		 * @throws ArgumentError if the forest is undefined or undefined
		 */
		public  DeepWoods(forest:Forest)
		{
			if (forest === undefined) {
				throw ArgumentError("Forest cannot be undefined");
			}
			
			this.forest = forest;
		}

		public  isDiscovered(): boolean {
			//TODO refactor all areas to use class fields as counters
			return player.hasStatusEffect(StatusEffects.ExploredDeepwoods);
		}

		public  discover(): void {
			player.createStatusEffect(StatusEffects.ExploredDeepwoods, 0, 0, 0, 0);
			clearOutput();
			outputText(images.showImage("area-deepwoods"));
			outputText("After exploring the forest so many times, you decide to really push it, and plunge deeper and deeper into the woods.  The further you go the darker it gets, but you courageously press on.  The plant-life changes too, and you spot more and more lichens and fungi, many of which are luminescent.  Finally, a wall of tree-trunks as wide as houses blocks your progress.  There is a knot-hole like opening in the center, and a small sign marking it as the entrance to the 'Deepwoods'.  You don't press on for now, but you could easily find your way back to explore the Deepwoods.\n\n<b>Deepwoods exploration unlocked!</b>");
			doNext(camp.returnToCampUseOneHour);
		}

		public  explore(): void {
			clearOutput();
			//Increment deepwoods exploration counter
			player.addStatusValue(StatusEffects.ExploredDeepwoods, 1, 1);
			deepwoodsEncounter.execEncounter();
		}

		private  deepwoodsWalkFn(): void {
			clearOutput();
			outputText(images.showImage("area-deepwoods"));
			outputText("You enjoy a peaceful walk in the deepwoods.  It gives you time to think over the recent, disturbing events.");
			dynStats("tou", .5, "int", 1);
			doNext(camp.returnToCampUseOneHour);
		}

		public  tentacleBeastDeepwoodsEncounterFn(): void { //Oh noes, tentacles!
			if (player.gender > 0) flags[kFLAGS.GENDERLESS_CENTAUR_MADNESS] = 0;
			//Tentacle avoidance chance due to dangerous plants
			if (player.hasKeyItem("Dangerous Plants") >= 0 && player.inte / 2 > rand(50)) {
//				trace("TENTACLE'S AVOIDED DUE TO BOOK!");
				clearOutput();
				outputText(images.showImage("item-dPlants"));
				outputText("Using the knowledge contained in your 'Dangerous Plants' book, you determine a tentacle beast's lair is nearby, do you continue?  If not you could return to camp.\n\n");
				menu();
				addButton(0,"Continue", forest.tentacleBeastScene.encounter);
				addButton(4, "Leave", camp.returnToCampUseOneHour);
			}
			else forest.tentacleBeastScene.encounter();
		}

		private  _deepwoodsEncounter:Encounter = undefined;
		public  get deepwoodsEncounter():Encounter { //late init because it references getGame()
			return _deepwoodsEncounter ||= Encounters.group(kGAMECLASS.commonEncounters, {
				name: "kitsune",
				call: forest.kitsuneScene
			}, /*{ // [INTERMOD:8chan]
				name: "dullahan",
				call: dullahanScene
			}, */{
				name: "akbal",
				call: forest.akbalScene
			}, {
				name: "tamani",
				call: forest.tamaniScene
			}, {
				name: "faerie",
				call: forest.faerie
			}, {
				name: "erlking",
				call: forest.erlkingScene
			}, {
				name: "fera",
				call: getGame().fera
			}, {
				name: "lumber",
				call: getGame().camp.cabinProgress.forestEncounter
			}, {
				name  : "glade",
				call  : forest.corruptedGlade,
				chance: 2
			}, {
				name: "tentabeast",
				call: tentacleBeastDeepwoodsEncounterFn,
				when: Encounters.fn.ifLevelMin(2)
			}, {
				name: "dungeon",
				call: getGame().dungeons.enterDeepCave,
				when: getGame().dungeons.canFindDeepCave
			}, {
				name  : "walk",
				call  : deepwoodsWalkFn,
				chance: 0.01
			}, {
				name: "aiko",
				call: forest.aikoScene,
				when: function (): boolean {
					return (player.level > 16 
						&& flags[kFLAGS.AIKO_TIMES_MET] < 4 
						&& flags[kFLAGS.AIKO_BALL_RETURNED] != 2);
				}
			});
		}
	}

