/* Created by aimozg on 06.01.14 */

	use namespace kGAMECLASS;

	export class Mountain extends BaseContent implements IExplorable {
		public  hellHoundScene:HellHoundScene;
		public  infestedHellhoundScene:InfestedHellhoundScene = new InfestedHellhoundScene();
		public  minotaurScene:MinotaurScene;
		public  wormsScene:WormsScene = new WormsScene();
		public  salon:Salon = new Salon();

		public  Mountain(pregnancyProgression:PregnancyProgression, output:GuiOutput) {
			this.minotaurScene = new MinotaurScene(pregnancyProgression, output);
			this.hellHoundScene = new HellHoundScene(pregnancyProgression, output);
		}

		public  isDiscovered(): boolean { return flags[kFLAGS.TIMES_EXPLORED_MOUNTAIN] > 0; }
		public  discover(): void {
			flags[kFLAGS.TIMES_EXPLORED_MOUNTAIN] = 1;
			outputText(images.showImage("area-mountain"));
			outputText("Thunder booms overhead, shaking you out of your thoughts.  High above, dark clouds encircle a distant mountain peak.  You get an ominous feeling in your gut as you gaze up at it.\n\n<b>You've discovered the Mountain!</b>");
			doNext(camp.returnToCampUseOneHour);
		}
		//Explore Mountain
		private  _explorationEncounter:Encounter = undefined;
		public  get explorationEncounter():Encounter {
		const  game:CoC = kGAMECLASS;
		const  fn:FnHelpers = Encounters.fn;
			if (_explorationEncounter == undefined) _explorationEncounter =
					Encounters.group(game.commonEncounters.withImpGob, {
						name: "salon",
						when: fn.not(salon.isDiscovered),
						call: salon.hairDresser
					}, {
						name: "mimic",
						when: fn.ifLevelMin(3),
						call: curry(game.mimicScene.mimicTentacleStart,2)
					}, {
						name: "highmountains",
						when: function (): boolean {
							return !game.highMountains.isDiscovered() && (player.level >= 5 || flags[kFLAGS.TIMES_EXPLORED_MOUNTAIN] >= 40);
						},
						call: game.highMountains.discover
					}, {
						name: "snowangel",
						when: function(): boolean {
							return isHolidays()
								&& player.gender > 0
								&& flags[kFLAGS.GATS_ANGEL_DISABLED] == 0
								&& flags[kFLAGS.GATS_ANGEL_GOOD_ENDED] == 0
								&& (flags[kFLAGS.GATS_ANGEL_QUEST_BEGAN] > 0
								&& player.hasKeyItem("North Star Key") < 0)
						},
						call: game.xmas.snowAngel.gatsSpectacularRouter
					}, {
						name:"jackfrost",
						when: function (): boolean {
							return isHolidays() && flags[kFLAGS.JACK_FROST_YEAR] < date.fullYear && silly();
						},
						call: game.xmas.jackFrost.meetJackFrostInTheMountains
					}, {
						name:"hellhound",
						call:hellHoundScene.hellhoundEncounter,
						mods:[game.commonEncounters.furriteMod]
					}, {
						name:"infhhound",
						when: function(): boolean {
							return player.hasStatusEffect(StatusEffects.WormsOn);
						},
						chance:function (): number {
							return player.hasStatusEffect(StatusEffects.WormsHalf) ? 0.25 : 0.5;
						},
						call:infestedHellhoundScene.infestedHellhoundEncounter,
						mods:[game.commonEncounters.furriteMod]
					}, {
						name:"worms1",
						when: function(): boolean {
							return !player.hasStatusEffect(StatusEffects.WormsOn)
								&& !player.hasStatusEffect(StatusEffects.WormsOff);
						},
						call: wormsScene.wormToggle
					}, {
						name:"worms2",
						chance: function (): number {
							return player.hasStatusEffect(StatusEffects.WormsHalf) ? 0.5 : 1;
						},
						when: function (): boolean {
							return player.hasStatusEffect(StatusEffects.WormsOn)
								&& (!player.hasStatusEffect(StatusEffects.Infested) ||
									!player.hasStatusEffect(StatusEffects.MetWorms))
						},
						call: wormsScene.wormEncounter
					}, {
						name:"minotaur",
						chance:minotaurChance,
						call:minotaurRouter,
						mods:[game.commonEncounters.furriteMod]
					}, {
						name:"factory",
						when:function(): boolean {
							return flags[kFLAGS.MARAE_QUEST_START] >= 1 && flags[kFLAGS.FACTORY_FOUND] <= 0;
						},
						call: game.dungeons.enterFactory
					}, {
						name:"ceraph",
						chance:0.3,
						when:function (): boolean {
							return !game.ceraphFollowerScene.ceraphIsFollower();
								/* [INTERMOD:8chan]
									&& flags[kFLAGS.CERAPH_KILLED] == 0 */
								//	&& game.fetishManager.compare(FetishManager.FETISH_EXHIBITION);
								},
						call:ceraphFn,
						mods:[fn.ifLevelMin(2)]
					}, {
						name:"hhound_master",
						chance:2,
						when:function(): boolean {
							//Requires canine face, [either two dog dicks, or a vag and pregnant with a hellhound], at least two other hellhound features (black fur, dog legs, dog tail), and corruption >=60
						var  check1: boolean = player.face.type == Face.DOG && player.cor >= 60;
						var  check2: boolean = player.dogCocks() >= 2
								|| (player.hasVagina() && player.pregnancyType == PregnancyStore.PREGNANCY_HELL_HOUND);
						var  check3: number = (player.tail.type == Tail.DOG ? 1 : 0)
								+ (player.lowerBody.type == LowerBody.DOG ? 1 : 0)
								+ (player.hair.color == "midnight black" ? 1 : 0);
						var  check4a: boolean = flags[kFLAGS.HELLHOUND_MASTER_PROGRESS] == 0;
						var  check4b: boolean = flags[kFLAGS.HELLHOUND_MASTER_PROGRESS] == 1
								&& player.hasKeyItem("Marae's Lethicite") >= 0
								&& player.keyItemv2("Marae's Lethicite") < 3;
							return flags[kFLAGS.HELLHOUND_MASTER_PROGRESS] < 3
								&& check1
								&& check2
								&& check3
								&& (check4a || check4b);
						},
						call:hellHoundScene.HellHoundMasterEncounter
					}, {
						name:"hike",
						chance:0.2,
						call:hike
					});
			return _explorationEncounter
		}
		public  explore(): void {
			flags[kFLAGS.TIMES_EXPLORED_MOUNTAIN]++;
		var  chooser: number;
			explorationEncounter.execEncounter();
		}
		//Rarer 'nice' Ceraph encounter
		public  ceraphFn(): void {
			//Overlaps half the old encounters once pierced
			if (rand(3) == 0
				/* [INTERMOD:8chan]
				&& kGAMECLASS.fetishManager.compare(FetishManager.FETISH_EXHIBITION)
				else */
				&& flags[kFLAGS.PC_FETISH] > 0 /**/
			) getGame().ceraphScene.friendlyNeighborhoodSpiderManCeraph();
			else getGame().ceraphScene.encounterCeraph();
		}

		public  minotaurChance(): number {
			if (player.findPerk(PerkLib.MinotaurCumAddict) >= 0) return 3;
			if (flags[kFLAGS.MINOTAUR_CUM_ADDICTION_STATE] > 0) return 2;
			return 1;
		}

		private  minotaurRouter(): void {
			spriteSelect(SpriteDb.s_minotaur);
			if (flags[kFLAGS.TIMES_EXPLORED_MOUNTAIN] % 16 == 0 && player.findPerk(PerkLib.MinotaurCumAddict) >= 0 && rand(3) == 0 && flags[kFLAGS.ADDICTIONS_ENABLED] > 0)
				minotaurScene.minoAddictionBadEndEncounter(); //Every 16 explorations chance at mino bad-end!
			else {
				if (!player.hasStatusEffect(StatusEffects.TF2) && player.level <= 1 && player.str <= 40) {
					clearOutput();
					if (silly()) { //Ideally, this should occur the first time the player would normally get an auto-rape encounter with the minotaur. The idea is to give a breather encounter to serve as a warning of how dangerous the mountain is
						outputText("Crossing over the treacherous mountain paths, you walk past an ominous cave.  The bones and the smell of death convince you to hasten your pace.  However, as you walk by, you hear a deep bellow and a snort as a monstrous man with a bull's head steps out.  With hell in his eyes and a giant ax in his hand, he begins to approach you in clear rage.  As he comes out into the light, you see that he is completely naked and sports a monstrous erection as angry as the minotaur himself, freely leaking a steady stream of pre-cum as he stalks you.\n\n");
						outputText("You stumble in your attempt to escape and realize that you are completely helpless.  The minotaur towers over you and heaves his ax for a <i>coup de grace</i>.  As he readies the blow, a monstrous explosion rocks the entire mountainside, causing the bull-man to stumble before he can finish you off. You look around, bewildered, trying to understand this strange new turn of events, and notice a group of maybe half a dozen people approaching from further up the path.  They appear to be a motley crew clad in blue and carrying monstrous weapons.  The tallest man holds a weapon made of multiple rotating tubes, and begins spinning the barrels.  A second later, while screaming in a language you do not understand, a rain of lead begins shredding the minotaur into a cloud of blood and flesh.\n\n");
						outputText("An equally imposing black man with a patch over one eye begins firing canisters at the beast, which explode violently.  \"<i>Ya ragged-arsed beast man!</i>\" he taunts.  \"<i>Ye should pick on someone yer own size, BOY-O! HEHEHE!</i>\"\n");
						outputText(images.showImage("encounter-stranger"));
						outputText("Coming up the path next is a freak of a person clad in a contained shiny suit with a weapon that burns with flame.  He freely walks into the explosions and gunfire and begins igniting the beast.\n\n");
						outputText("\"<i>MRPHHUMFHRUFH!!!!! HUMFHUFMMRUF!</i>\" the freak mumbles through his mask.\n\n");
						outputText("\"<i>I like me steak well done, ye crazy bugger!</i>\" yells the black man.\n\n");
						outputText("The beast collapses in a charred and bloody heap.   As you stand back up, you hear a strange noise behind you.  You turn around to find a well-dressed man wearing a ski mask and smoking a cigarette.  \"<i>Don't you know ze mountains are dangereuse,</i>\" the man says with a thick accent.  \"<i>You will get FUCKED up here if you are not careful.</i>\"\n\n");
						outputText("You thank the man and his team, but they brush off your gratitude.  \"<i>Non, non!</i>\" the man with the accent says.  \"<i>As zey say, everyone gets ONE.</i>\" With that, he touches the watch on his wrist and disappears.  The rest of the group continues on their way.\n\n");
						outputText("As they leave, the giant with the chain gun yells in a horribly accented manner, \"<i>YOU LEAVE SANDVICH ALONE! SANDVICH IS MINE!</i>\"\n\n");
						outputText("With that, another hail of bullets break the scene as they walk away, leaving you safe from the minotaur, but utterly baffled as to what in hell just happened.");
					}
					else {
						outputText(images.showImage("monster-minotaur"));
						outputText("Crossing over the treacherous mountain paths, you walk past an ominous cave.  The bones and the smell of death convince you to hasten your pace.  However, as you walk by, you hear a deep bellow and a snort as a monstrous man with a bull's head steps out.  With hell in his eyes and a giant ax in his hand, he begins to approach you in clear rage.  As he comes out into the light, you see that he is completely naked and sports a monstrous erection as angry as the minotaur himself, freely leaking a steady stream of pre-cum as he stalks you.\n\n");
						outputText("You stumble in your attempt to escape and realize that you are completely helpless.  The minotaur towers over you and heaves his ax for a <i>coup de grace</i>.  As he readies the blow, another beast-man slams into him from the side.  The two of them begin to fight for the honor of raping you, giving you the opening you need to escape.  You quietly sneak away while they fight – perhaps you should avoid the mountains for now?\n\n");
						dynStats("lib", -1);
					}
					player.createStatusEffect(StatusEffects.TF2, 0, 0, 0, 0);
					doNext(camp.returnToCampUseOneHour);
				}
				else if (!player.hasStatusEffect(StatusEffects.MinoPlusCowgirl) || rand(10) == 0) {
					clearOutput();
					//Mino gangbang
					if (flags[kFLAGS.HAS_SEEN_MINO_AND_COWGIRL] == 1 && player.cowScore() >= 4 && player.lactationQ() >= 200 && player.biggestTitSize() >= 3 && player.minotaurAddicted()) { //PC must be a cowmorph (horns, legs, ears, tail, lactating, breasts at least C-cup) / Must be addicted to minocum
						outputText("As you pass a shadowy cleft in the mountainside, you hear the now-familiar call of a cowgirl echoing from within.  Knowing what's in store, you carefully inch closer and peek around the corner.\n\n");
						outputText("Two humanoid shapes come into view, both with pronounced bovine features - tails, horns and hooves instead of feet.  Their genders are immediately apparent due to their stark nudity.  The first is the epitome of primal femininity, with a pair of massive, udder-like breasts and wide child-bearing hips. The other is the pinnacle of masculinity, with a broad, muscular chest, a huge horse-like penis and a heavy set of balls more appropriate on a breeding stud than a person.  You have once again stumbled upon a cow-girl engaging in a not-so-secret rendezvous with her minotaur lover.");
						unlockCodexEntry("Minotaurs", kFLAGS.CODEX_ENTRY_MINOTAURS, false, true);
						unlockCodexEntry("Lacta Bovines/Cowgirl", kFLAGS.CODEX_ENTRY_LABOVINES, false, true);
						outputText("\n\nYou settle in behind an outcropping, predicting what comes next.  You see the stark silhouettes of imps and goblins take up similar positions around this makeshift theatre, this circular clearing surrounded on the edge by boulders and nooks where all manner of creatures might hide. You wonder if they're as eager for the upcoming show as you are.  The heady scent of impending sex rises in the air... and with it comes something masculine, something that makes your stomach rumble in anticipation.  The mouth-watering aroma of fresh minotaur cum wafts up to your nose, making your whole body quiver in need.  Your [vagOrAss] immediately ");
						if (player.hasVagina()) outputText("dampens");
						else outputText("twinges");
						outputText(", aching to be filled");
						if (player.hasCock()) outputText(", while [eachCock] rises to attention, straining at your [armor]");
						outputText(".\n");
						outputText(images.showImage("minotaur-cumslut"));
						outputText("You can barely see it from your vantage point, but you can imagine it: the semi-transparent pre-cum dribbling from the minotaur's cumslit, oozing down onto your tongue.  Your entire body shivers at the thought, whether from disgust or desire you aren't sure.  You imagine your lips wrapping around that large equine cock, milking it for all of its delicious cum.  Your body burns hot like the noonday sun at the thought, hot with need, with envy at the cow-girl, but most of all with arousal.\n\n");
						outputText("Snapping out of your imaginative reverie, you turn your attention back to the show. You wonder if you could make your way over there and join them, or if you should simply remain here and watch, as you have in the past.");
						menu();
						addButton(0, "Join", minotaurScene.joinBeingAMinoCumSlut);
						addButton(1, "Watch", minotaurScene.watchAMinoCumSlut);
					}
					else {
						flags[kFLAGS.HAS_SEEN_MINO_AND_COWGIRL] = 1;
						if (!player.hasStatusEffect(StatusEffects.MinoPlusCowgirl))
							 player.createStatusEffect(StatusEffects.MinoPlusCowgirl, 0, 0, 0, 0);
						else player.addStatusValue(StatusEffects.MinoPlusCowgirl, 1, 1);
						outputText("As you pass a shadowy cleft in the mountainside, you hear the sounds of a cow coming out from it. Wondering how a cow got up here, but mindful of this land's dangers, you cautiously sneak closer and peek around the corner.\n\n");
						outputText("What you see is not a cow, but two large human-shaped creatures with pronounced bovine features -- tails, horns, muzzles, and hooves instead of feet. They're still biped, however, and their genders are obvious due to their stark nudity. One has massive, udder-like breasts and wide hips, the other a gigantic, horse-like dong and a heavy set of balls more appropriate to a breeding stud than a person. You've stumbled upon a cow-girl and a minotaur.\n\n");
						unlockCodexEntry("Minotaurs", kFLAGS.CODEX_ENTRY_MINOTAURS, false, true);
						unlockCodexEntry("Lacta Bovines/Cowgirl", kFLAGS.CODEX_ENTRY_LABOVINES, false, true);
						outputText("A part of your mind registers bits of clothing tossed aside and the heady scent of impending sex in the air, but your attention is riveted on the actions of the pair. The cow-girl turns and places her hands on a low ledge, causing her to bend over, her ample ass facing the minotaur. The minotaur closes the distance between them in a single step.\n\n");
						outputText("She bellows, almost moaning, as the minotaur grabs her cushiony ass-cheeks with both massive hands. Her tail raises to expose a glistening wet snatch, its lips already parted with desire. She moos again as his rapidly hardening bull-cock brushes her crotch. You can't tear your eyes away as he positions himself, his flaring, mushroom-like cock-head eliciting another moan as it pushes against her nether lips.\n");
						outputText(images.showImage("minotaur-cumslut-encounter"));
						outputText("With a hearty thrust, the minotaur plunges into the cow-girl's eager fuck-hole, burying himself past one -- two of his oversized cock's three ridge rings. She screams in half pain, half ecstasy and pushes back, hungry for his full length. After pulling back only slightly, he pushes deeper, driving every inch of his gigantic dick into his willing partner who writhes in pleasure, impaled exactly as she wanted.\n\n");
						outputText("The pair quickly settles into a rhythm, punctuated with numerous grunts, groans, and moans of sexual excess. To you it's almost a violent assault sure to leave both of them bruised and sore, but the cow-girl's lolling tongue and expression of overwhelming desire tells you otherwise. She's enjoying every thrust as well as the strokes, gropes, and seemingly painful squeezes the minotaur's powerful hands deliver to her jiggling ass and ponderous tits. He's little better, his eyes glazed over with lust as he continues banging the fuck-hole he found and all but mauling its owner.");
						doNext(minotaurScene.continueMinoVoyeurism);
					}
				}
				else if (flags[kFLAGS.MINOTAUR_CUM_ADDICTION_STATE] == 3 && rand(2) == 0 && player.inte / 10 + rand(20) < 15) //Cum addictus interruptus!  LOL HARRY POTTERFAG
					minotaurScene.minoAddictionFuck(); //Withdrawl auto-fuck!
				else if (rand(5) == 0 && player.level >= 10) {
					clearOutput();
					outputText(images.showImage("monster-minotaurlord"));
					outputText("Minding your own business, you walk along the winding paths.  You take your time to enjoy the view until you see a shadow approaching you.  You turn around to see a minotaur!  However, he is much bigger than the other minotaurs you've seen.  You estimate him to be eleven feet tall and he's wielding a chain-whip.  He's intent on raping you!");
					startCombat(new MinotaurLord()); //Rare Minotaur Lord
				}
				else minotaurScene.getRapedByMinotaur(true);
			}
		}

		private  hike(): void {
			clearOutput();
			outputText(images.showImage("area-mountain"));
			if (player.cor < 90) {
				outputText("Your hike in the mountains, while fruitless, reveals pleasant vistas and provides you with good exercise and relaxation.");
				dynStats("tou", .25, "spe", .5, "lus", player.lib / 10 - 15);
			}
			else {
				outputText("During your hike into the mountains, your depraved mind keeps replaying your most obcenely warped sexual encounters, always imagining new perverse ways of causing pleasure.\n\nIt is a miracle no predator picked up on the strong sexual scent you are emitting.");
				dynStats("tou", .25, "spe", .5, "lib", .25, "lus", player.lib / 10);
			}
			doNext(camp.returnToCampUseOneHour);
		}

		private  findOre(): void { //Not used. Doubt if it will ever be added
		var  ore: number = rand(3); //0 = copper, 1 = tin, 2 = iron
		}
	}

