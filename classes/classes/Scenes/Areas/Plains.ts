/* Created by aimozg on 06.01.14 */

	use namespace kGAMECLASS;

	export class Plains extends BaseContent implements IExplorable {
		public  bunnyGirl:BunnyGirl = new BunnyGirl();
		public  gnollScene:GnollScene = new GnollScene();
		public  gnollSpearThrowerScene:GnollSpearThrowerScene = new GnollSpearThrowerScene();
		public  satyrScene:SatyrScene;

		public  Plains(pregnancyProgression:PregnancyProgression, output:GuiOutput) {
			this.satyrScene = new SatyrScene(pregnancyProgression, output);
		}

		public  isDiscovered(): boolean { return flags[kFLAGS.TIMES_EXPLORED_PLAINS] > 0; }
		public  discover(): void {
			flags[kFLAGS.TIMES_EXPLORED_PLAINS] = 1;
			outputText(images.showImage("area-plains"));
			outputText("You find yourself standing in knee-high grass, surrounded by flat plains on all sides.  Though the mountain, forest, and lake are all visible from here, they seem quite distant.\n\n<b>You've discovered the plains!</b>");
			doNext(camp.returnToCampUseOneHour);
		}

		private  _explorationEncounter:Encounter = undefined;
		public  get explorationEncounter():Encounter {
		const  game:CoC = kGAMECLASS;
		const  fn:FnHelpers = Encounters.fn;
			return _explorationEncounter ||= Encounters.group(game.commonEncounters, {
				name  : "sheila_xp3",
				chance: Encounters.ALWAYS,
				when  : function (): boolean {
					return flags[kFLAGS.SHEILA_DEMON] == 0
						   && flags[kFLAGS.SHEILA_XP] == 3
						   && getGame().time.hours == 20
						   && flags[kFLAGS.SHEILA_CLOCK] >= 0;
				},
				call  : game.sheilaScene.sheilaXPThreeSexyTime
			}, {
				name: "candy_cane",
				when: function (): boolean {
					return isHolidays() && date.fullYear > flags[kFLAGS.CANDY_CANE_YEAR_MET];
				},
				call: game.xmas.xmasMisc.candyCaneTrapDiscovery
			}, {
				name: "polar_pete",
				when: function (): boolean {
					return isHolidays() && date.fullYear > flags[kFLAGS.POLAR_PETE_YEAR_MET];
				},
				call: game.xmas.xmasMisc.polarPete
			}, {
				name: "niamh",
				when: function (): boolean {
					return flags[kFLAGS.NIAMH_MOVED_OUT_COUNTER] == 1
				},
				call: game.telAdre.niamh.niamhPostTelAdreMoveOut
			}, {
				name  : "owca",
				chance: 0.3,
				when  : function (): boolean {
					return flags[kFLAGS.OWCA_UNLOCKED] == 0;
				},
				mods  : [fn.ifLevelMin(8)],
				call  : game.owca.gangbangVillageStuff
			}, {
				name: "bazaar",
				when: function (): boolean {
					return flags[kFLAGS.BAZAAR_ENTERED] == 0;
				},
				call: game.bazaar.findBazaar
			}, {
				name  : "helXizzy",
				chance: 0.2,
				when  : function (): boolean {
					return flags[kFLAGS.ISABELLA_CAMP_APPROACHED] != 0
						   && flags[kFLAGS.ISABELLA_MET] != 0
						   && flags[kFLAGS.HEL_FUCKBUDDY] == 1
						   && flags[kFLAGS.ISABELLA_ANGRY_AT_PC_COUNTER] == 0
						   && !kGAMECLASS.isabellaFollowerScene.isabellaFollower()
						   && (player.tallness <= 78 || flags[kFLAGS.ISABELLA_OKAY_WITH_TALL_FOLKS])
				},
				call  : helXIzzy
			}, {
				name  : "ovielix",
				call  : findOviElix,
				chance: 0.5
			}, {
				name  : "kangaft",
				call  : findKangaFruit,
				chance: 0.5
			}, {
				name  : "gnoll",
				chance: 0.5,
				call  : gnollSpearThrowerScene.gnoll2Encounter
			}, {
				name  : "gnoll2",
				chance: 0.5,
				call  : gnollScene.gnollEncounter
			}, {
				name: "bunny",
				call: bunnyGirl.bunnbunbunMeet
			}, {
				name: "isabella",
				when: function (): boolean {
					return flags[kFLAGS.ISABELLA_PLAINS_DISABLED] == 0
				},
				call: game.isabellaScene.isabellaGreeting
			}, {
				name  : "helia",
				chance: function (): number {
					return flags[kFLAGS.HEL_REDUCED_ENCOUNTER_RATE] ? 0.75 : 1.5;
				},
				when  : function (): boolean {
					return !kGAMECLASS.helScene.followerHel();
				},
				call  : game.helScene.encounterAJerkInThePlains
			}, {
				name: "satyr",
				call: satyrScene.satyrEncounter
			}, {
				name: "sheila",
				when: function (): boolean {
					return flags[kFLAGS.SHEILA_DISABLED] == 0 && flags[kFLAGS.SHEILA_CLOCK] >= 0
				},
				call: game.sheilaScene.sheilaEncounterRouter
			});
		}
		public  explore(): void {
			clearOutput();
			flags[kFLAGS.TIMES_EXPLORED_PLAINS]++;
			explorationEncounter.execEncounter();
		}

		private  helXIzzy(): void {
			if (flags[kFLAGS.HEL_ISABELLA_THREESOME_ENABLED] == 0)
				kGAMECLASS.helScene.salamanderXIsabellaPlainsIntro(); //Hell/Izzy threesome intro
			else if (flags[kFLAGS.HEL_ISABELLA_THREESOME_ENABLED] == 1)
				kGAMECLASS.helScene.isabellaXHelThreeSomePlainsStart(); //Propah threesomes here!
		}

		private  findKangaFruit(): void {
			outputText(images.showImage("item-kFruit"));
			outputText("While exploring the plains you come across a strange-looking plant.  As you peer at it, you realize it has some fruit you can get at.  ");
			inventory.takeItem(consumables.KANGAFT, camp.returnToCampUseOneHour);
		}

		private  findOviElix(): void {
			outputText(images.showImage("item-oElixir"));
			outputText("While exploring the plains you nearly trip over a discarded, hexagonal bottle.  ");
			inventory.takeItem(consumables.OVIELIX, camp.returnToCampUseOneHour);
		}

		private  walkingPlainsStatBoost(): void {
			clearOutput();
			outputText(images.showImage("area-plains"));
			outputText("You run through the endless plains for an hour, finding nothing.\n\n");
			//Chance of boost == 50%
			if (rand(2) == 0) {
				if (rand(2) == 0 && player.tou100 < 50) { //50/50 toughness/speed
					outputText("The long run has made you tougher.");
					dynStats("tou", .5, "lib", -1);
				}
				else if (player.spe100 < 50) { //Speed
					outputText("The long run has made you quicker.");
					dynStats("spe", .5, "lib", -1);
				}
			}
			doNext(camp.returnToCampUseOneHour);
		}
	}

