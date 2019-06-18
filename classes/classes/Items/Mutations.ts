	
	/**
	 * This class performs the various mutations on the player, transforming one or more
	 * aspects of their appearance.
	 * @since July 8, 2016
	 * @author Stadler76
	 */
	export class Mutations extends BaseContent 
	{
		private static  _instance:Mutations = new Mutations();

		public  Mutations()
		{
			if (_instance !== undefined)
			{
				throw new Error("Mutations can only be accessed through Mutations.init()");
			}
		}

		public static  init():Mutations { return _instance; }

		private static  LOGGER:ILogger = LoggerFactory.getLogger(Mutations);

		public  changes: number = 0;
		public  changeLimit: number = 1;

		private  _lizardSkinToneChoices:WeightedChoice = undefined;
		public  get lizardSkinToneChoices():WeightedChoice
		{
			if (_lizardSkinToneChoices === undefined) {
				_lizardSkinToneChoices = new WeightedChoice()
					// -> 10% * 1/2 =  5%
					.add(["purple", "deep pink"],     5) 
					.add(["silver", "light gray"],    5)
					// -> 90% * 1/5 = 18%
					.add(["red",    "orange"],       18)
					.add(["green",  "yellow green"], 18)
					.add(["white",  "light gray"],   18)
					.add(["blue",   "ocean blue"],   18)
					.add(["black",  "dark gray"],    18);
			}

			return _lizardSkinToneChoices;
		}

		/**
		 * Wrapper around rand(x) === 0 with a min and max value scaling with the changes value
		 * @param   min  The minimum roll
		 * @param   max  The maximum roll
		 * @return  true, on success of the 'roll', false otherwise
		 * @author  Stadler76
		 */
		public  tfChance(min: number, max: number): boolean
		{
			return rand(Math.min(min + changes, max)) === 0;
		}

		/**
		 * Initializes the transformation. Meaning: changes is set to 0 and the initial changeLimit is being determined.
		 * This is done by performing rolls, applying modifiers from Perks and enforcing the minimum number of changes.
		 * changeLimit is an internal value that controls the maximum amount of changes per use of a transformative.
		 * @param   rolls             An array of the rolls to randomly increase the changeLimit. e. g.: [2, 3, 4]
		 * @param   startChangeLimit  The initial changeLimit to start with before rolls or perks
		 * @param   minChangeLimit    The enforced minimum changeLimit, i.e. at least this many changes may be performed
		 * @author  Stadler76
		 */
		public  initTransformation(rolls: any[] = undefined, startChangeLimit: number = 1, minChangeLimit: number = 1): void
		{
			changes = 0;
			changeLimit = startChangeLimit;

			if (player.hasPerk(PerkLib.HistoryAlchemist))
				changeLimit++;
			if (player.hasPerk(PerkLib.TransformationResistance))
				changeLimit--;

			if (rolls is Array && rolls.length > 0) {
				for each (var roll: number in rolls) {
					if (rand(roll) === 0) {
						changeLimit++;
					}
				}
			}

			if (changeLimit < minChangeLimit) {
				changeLimit = minChangeLimit;
			}
		}

		public  restoreArms(tfSource: string): number
		{
			LOGGER.debug("called restoreArms(\"{0}\")", tfSource);
			
		var  message: string = "";

			if (tfSource == "gooGasmic") {
				// skin just turned gooey. Now lets fix unusual arms.
			var  hasClaws: boolean = player.arms.claws.type != Claws.NORMAL;

				message = "\n\n";
				if (player.arms.type == Arms.HARPY) {
					message += "The feathers on your arms melt back into your now gooey skin.";
					if (hasClaws) message += " Additionally your now gooey claws melt back into your fingers.";
				} else if (hasClaws) {
					message += "Your now gooey claws melt back into your fingers.";
				}

				if (hasClaws) message += " Well, who cares, gooey claws aren't very useful in combat to begin with.";
				if (hasClaws || player.arms.type == Arms.HARPY) output.text(message + "  <b>You have normal human arms again.</b>");

				player.arms.restore();
				return 1;
			}


			if (changes < changeLimit && player.arms.type != Arms.HUMAN) {
				if ([Arms.HARPY, Arms.SPIDER, Arms.SALAMANDER].indexOf(player.arms.type) >= 0)
					message += "\n\nYou scratch at your biceps absentmindedly, but no matter how much you scratch, it isn't getting rid of the itch.";

				switch (player.arms.type) {
					case Arms.HARPY:
						message += "  Glancing down in irritation, you discover that your feathery arms are shedding their feathery coating."
						          +"  The wing-like shape your arms once had is gone in a matter of moments, leaving [skinfurscales] behind.";
						break;

					case Arms.SPIDER:
						message += "  Glancing down in irritation, you discover that your arms' chitinous covering is flaking away."
						          +"  The glossy black coating is soon gone, leaving [skinfurscales] behind.";
						break;

					case Arms.SALAMANDER:
						message += "  Glancing down in irritation, you discover that your once scaly arms are shedding their scales and that"
						          +" your claws become normal human fingernails again.";
						break;

					case Arms.PREDATOR:
						switch (player.skin.type) {
							case Skin.GOO:
								if (player.arms.claws.type != Claws.NORMAL)
									message += "\n\nYour gooey claws melt into your fingers."
									          +" Well, who cares, gooey claws aren't very useful in combat to begin with.";
								break;
							case Skin.PLAIN:
							case Skin.FUR:
							case Skin.LIZARD_SCALES:
								message += "\n\nYou feel a sudden tingle in your [claws] and then you realize,"
								          +" that they have become normal human fingernails again.";
								break;
							default: //Move along
						}
						break;

					default:
						message += "\n\nYour unusual arms change more and more until they are normal human arms, leaving [skinfurscales] behind.";
				}
				output.text(message + "  <b>You have normal human arms again.</b>");
				player.arms.restore();
				changes++;
				return 1;
			}

			return 0;
		}

		public  restoreLegs(tfSource: string): boolean
		{
			LOGGER.debug("called restoreLegs(\"{0}\")", tfSource);
			
		var  doRestore: boolean = false;
		var  tsParts: any[] = tfSource.split("-");
			tfSource = tsParts[0];

			//(Centaurs -> Normal Human Legs)
			if (player.isTaur()) {
				outputText("\n\nYour quadrupedal hind-quarters seizes, overbalancing your surprised front-end and causing you to stagger and fall to your side.  Pain lances throughout, contorting your body into a tightly clenched ball of pain while tendons melt and bones break, melt, and regrow.  When it finally stops, <b>you look down to behold your new pair of human legs</b>!");
				doRestore = true;
			}

			//(Goo -> Normal Human Legs)
			if (player.isGoo()) {
				outputText("\n\nYour lower body rushes inward, molding into two leg-like shapes that gradually stiffen up.  In moments they solidify into normal-looking legs, complete with regular, human feet.  <b>You now have normal feet!</b>");
				doRestore = true;
			}

			//(Naga -> Normal Human Legs)
			if (player.isNaga()) {
				outputText("\n\nYou collapse as your sinuous snake-tail tears in half, shifting into legs.  The pain is immense, particularly where your new feet are forming.  <b>You have human legs again.</b>");
				doRestore = true;
			}

			//(Drider -> Normal Human Legs)
			if (tfSource != "sweetGossamer" && player.isDrider()) {
				outputText("\n\nYour legs buckle under you and you fall, smashing your abdomen on the ground."
				          +"  Though your control deserts and you cannot see behind you,"
				          +" still you feel the disgusting sensation of chitin loosening and sloughing off your body,"
				          +" and the dry breeze on your exposed nerves."
				          +"  Reflexively, your legs cling together to protect as much of their now-sensitive surface as possible."
				          +"  When you try to part them, you find you cannot."
				          +"  Several minutes pass uncomfortably until you can again bend your legs,"
				          +" and when you do, you find that all the legs of a side bend together.");
				outputText("  <b>You have human legs again.</b>");
				doRestore = true;
			}

			//(Non-human -> Normal Human Legs)
			if (tfSource == "regularHummus" && player.isBiped() && player.lowerBody.type != LowerBody.HUMAN) {
				outputText("\n\nYou collapse as your legs shift and twist.  By the time the pain subsides, you notice that you have normal legs and normal feet.  <b>You now have normal feet!</b>");
				doRestore = true;
			}

			if (doRestore) {
				player.lowerBody.type = LowerBody.HUMAN;
				player.lowerBody.legCount = 2;
				changes++;
				return true;
			}

			return false;
		}

		public  restoreNeck(tfSource: string): boolean
		{
			LOGGER.debug("called restoreNeck(\"{0}\")", tfSource);
			
		var  tsParts: any[] = tfSource.split("-");
			if (tsParts.length > 1 && tsParts[0] != "reptilum") // probably later dracolisks would get an elongated neck, too (shorter than the dragon version)
				tfSource = tsParts[0];

		var  forceRestore: boolean = tsParts.indexOf("forceRestoreNeck") != -1;

			switch (player.neck.type) {
				case Neck.DRACONIC:
					if (tfSource == "EmberTFs" || (!forceRestore && player.dragonScore() >= 11))
						return false;

					outputText("\n\n<b>Your draconic neck[if (neckPos) and its position on your head revert|reverts] to its normal"
					          +" [if (neckPos)position and] length.</b> ");
					break;

				case Neck.COCKATRICE:
					if (tfSource == "TonOTrice" || (!forceRestore && player.cockatriceScore() >= 7))
						return false;

					outputText("\n\nYou neck starts to tingle and the feathers that decorate your neck begin to fall out until"
					          +" <b>you're left with a normal neck!</b>");
					break;

				default:
					player.neck.restore(); // Restore leftovers. Failsafe!
					return false;
			}

			if (!forceRestore) changes++;
			player.neck.restore();
			return true;
		}

		public  restoreRearBody(tfSource: string): boolean
		{
			LOGGER.debug("called restoreRearBody(\"{0}\")", tfSource);
			
		var  tsParts: any[] = tfSource.split("-");
			tfSource = tsParts[0];

		var  forceRestore: boolean = tsParts.indexOf("forceRestoreRearBody") != -1;

			switch (player.rearBody.type) {
				case RearBody.SHARK_FIN:
					if (tfSource == "sharkTooth" || (!forceRestore && player.sharkScore() >= 3))
						return false;

					outputText("A wave of tightness spreads through your back, and it feels as if someone is stabbing a dagger into your spine."
					          +" After a moment the pain passes, though your fin is gone!");
					break;

				case RearBody.DRACONIC_MANE:
				case RearBody.DRACONIC_SPIKES:
					if (tfSource == "EmberTFs" || (!forceRestore && player.dragonScore() >= 11))
						return false;

					if (player.rearBody.type == RearBody.DRACONIC_MANE)
						outputText("\n\nYou feel a tingling just above your spine. Your glimpse at your back and see hair falling down from it."
						          +" First in strands, then in bigger and bigger chunks until"
						          +" <b>your hairy draconic mane has completely disappeared.</b>");
					else
						outputText("\n\nYour spine starts to make painful cracking sounds and you feel something retracting back into your rear."
						          +" Soon after the pain ceased the skin above your spine fuses and closes the holes where your spikes once were."
						          +" <b>The spikes on your rear have disappeared.</b>");
					break;

				default:
					player.rearBody.restore();
					return false;
			}

			if (!forceRestore) changes++;
			player.rearBody.restore();
			return true;
		}

		public  removeFeatheryHair(): boolean
		{
			if (changes < changeLimit && player.hair.type == Hair.FEATHER && rand(4) == 0) {
				//(long):
				if (player.hair.length >= 6) outputText("\n\nA lock of your downy-soft feather-hair droops over your eye.  Before you can blow the offending down away, you realize the feather is collapsing in on itself.  It continues to curl inward until all that remains is a normal strand of hair.  <b>Your hair is no longer feathery!</b>");
				//(short)
				else outputText("\n\nYou run your fingers through your downy-soft feather-hair while you await the effects of the item you just ingested.  While your hand is up there, it detects a change in the texture of your feathers.  They're completely disappearing, merging down into strands of regular hair.  <b>Your hair is no longer feathery!</b>");
				player.hair.type = Hair.NORMAL;
				changes++;
				return true;
			}

			return false;
		}

		/**
		 * Removes antennae and display different loss texts depending on the type, if any.
		 * @param	inline  If true, display a short inline text (No bold part, no line breaks)
		 * @return	true:   lost them, false: no change
		 * @author	Stadler76
		 */
		public  removeAntennae(inline: boolean = false): boolean
		{
			if (player.antennae.type == Antennae.NONE)
				return false;

			if (inline) {
				switch (player.antennae.type) {
					case Antennae.COCKATRICE:
					case Antennae.BEE:
					default:
						outputText(" Antennae pop free, and float lightly down towards the floor. ");
				}
			} else {
				switch (player.antennae.type) {
					case Antennae.COCKATRICE:
						outputText("\n\nYou feel your antennae like feathers shrivel at the root, the pair of soft quills falling softly to the"
						          +" ground as your pores close.");
						outputText("\n<b>You’ve lost your antennae like feathers!</b>");
						break;

					case Antennae.BEE:
						outputText("\n\nYour [hair] itches so you give it a scratch, only to have your antennae fall to the ground. What a relief.");
						outputText("\n<b>You've lost your antennae!</b>");
						break;

					default: // should not happen, but just in case ... (Stadler76)
						outputText("\n\nThe muscles in your brow clench tightly, and you feel a tremendous pressure on your upper forehead."
						          +" When it passes, you touch yourself and discover <b>your antennae have vanished</b>!");
				}
			}

			player.antennae.type = Antennae.NONE;
			changes++;
			return true;
		}

		/**
		 * Removes wings and optionally the shark-fin, too.
		 * @param	tfSource        The method- or classname plus additional info seperated by the '-'-character
		 * @param	removeSharkFin  If true (the default), remove the shark-fin, too.
		 * @return	true: lost them, false: no change
		 * @author	Stadler76
		 */
		public  removeWings(tfSource: string, removeSharkFin: boolean = true): boolean
		{
		var  changed: boolean = false;

			LOGGER.debug("called removeWings(\"{0}\"{1})", tfSource, removeSharkFin ? "" : ", false");

			if (removeSharkFin && player.rearBody.type === RearBody.SHARK_FIN) {
				outputText("\n\nA wave of tightness spreads through your back, and it feels as if someone is stabbing a dagger into your spine."
				          +" <b>After a moment the pain passes, though your fin is gone!</b>");
				player.rearBody.restore();
				changed = true;
			}

			if (player.wings.type !== Wings.NONE) {
				outputText("\n\nA wave of tightness spreads through your back, and it feels as if someone is stabbing a dagger into each of your"
				          +" shoulder-blades."
				          +" <b>After a moment the pain passes, though your wings are gone!</b>");
				player.wings.restore();
				changed = true;
			}

			if (changed) {
				changes++;
			}

			return changed;
		}

		public  removeBassyHair(): boolean
		{
			// Failsafe, duh
			if ([Hair.BASILISK_PLUME, Hair.BASILISK_SPINES].indexOf(player.hair.type) == -1) return false;

			if (player.hair.type == Hair.BASILISK_PLUME) {
				// TF blurb derived from losing feathery hair
				//(long):
				if (player.hair.length >= 5)
					outputText("\n\nA lock of your feathery plume droops over your eye.  Before you can blow the offending down away,"
					          +" you realize the feather is collapsing in on itself."
					          +" It continues to curl inward until all that remains is a normal strand of hair.");
				//(short)
				else
					outputText("\n\nYou run your fingers through your feathery plume while you await the effects of the item you just ingested."
					          +" While your hand is up there, it detects a change in the texture of your feathers.  They're completely disappearing,"
					          +" merging down into strands of regular hair.");

					outputText("\n\n<b>Your hair is no longer feathery!</b>");
			} else {
				outputText("\n\nYou feel a tingling on your scalp. You reach up to your basilisk spines to find out what is happening. The moment"
					          +" your hand touches a spine, it comes loose and falls in front of you. One after another the other spines fall out,"
					          +" until all the spines that once decorated your head now lay around you, leaving you with a bald head.");

				outputText("\n\n<b>You realize, that you'll grow normal human hair again!</b>");
				flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] = 0;
				player.hair.length = 0;
			}
			player.hair.type = Hair.NORMAL;
			changes++;
			return true;
		}

		public  removeBlackNipples(tfSource: string): boolean
		{
			LOGGER.debug("called removeBlackNipples(\"{0}\")", tfSource);

			if (!player.hasStatusEffect(StatusEffects.BlackNipples))
				return false;

			outputText("\n\nSomething invisible brushes against your [nipple], making you twitch.  Undoing your clothes, you take a look at your"
			          +" chest and find that your nipples have turned back to their natural flesh colour.");
			player.removeStatusEffect(StatusEffects.BlackNipples);
			changes++;
			return true;
		}

		public  newLizardSkinTone(): any[]
		{
			return lizardSkinToneChoices.choose();
		}

		public  newCockatriceColors(): any[]
		{
			return randomChoice(ColorLists.COCKATRICE);
		}

		public  lizardHairChange(tfSource: string): number
		{
		var  hairPinID: number = player.hasKeyItem("Feathery hair-pin");
			LOGGER.debug("called lizardHairChange(\"{0}\")", tfSource);

			switch (tfSource) {
				case "reptilum-lizan":
				case "reptilum-dragonewt":
					//-Hair stops growing!
					if (flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] == 0) {
						output.text("\n\nYour scalp tingles oddly.  In a panic, you reach up to your [hair], but thankfully it appears unchanged.");
						output.text("\n\n(<b>Your hair has stopped growing.</b>)");
						changes++;
						flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] = 1;
						return -1; // --> hair growth stopped
					}
					return 0;

				case "PlayerEvents-benoitHairPin":
				case "reptilum-basilisk":
				case "reptilum-dracolisk":
					if (player.hair.type == Hair.BASILISK_PLUME && player.cor < 65) return 0;

					if (player.isFemaleOrHerm() && player.cor < 15 && player.featheryHairPinEquipped() && player.isBasilisk()) {
					var  benoitMFText: string = getGame().bazaar.benoit.benoitMF(
							" your hair has changed into a plume of feathers that, like legend is told, belongs to a female basilisk!",
							" you have a plume, like a female basilisk!"
						);

						if (player.hair.type == Hair.GOO)
							output.text("\n\nYour gooey hair begins to fall out in globs, eventually leaving you with a bald head.");

						output.text("\n\nYour head begins to tickle and you reach up to scratch at it, only to be surprised by the softness you feel."
						           +" It reminds you of the down of baby chickens, velvety soft and slightly fluffy. You look at yourself in a nearby"
						           +" puddle and gasp, [if (hairlength <= 0) where your hair once was] you now have red feathers,"
						           +" some longer and larger than others. This floppy but soft plume sits daintily on your head,"
						           +" reminding you of a ladies fascinator. You realise soon that" + benoitMFText);

						if (flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] != 0)
							output.text("\n\n<b>Your hair is growing again and is now a plume of short red feathers.</b>");
						else
							output.text("\n\n<b>Your hair is now a plume of short red feathers.</b>");

						flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] = 0;
						player.hair.length = 2;
						player.hair.color = "red";
						player.hair.type = Hair.BASILISK_PLUME;
						player.keyItems[hairPinID].value2 = 0;
						changes++;
						return 1; // --> gained basilisk hair (plume)
					}

					if (player.cor >= 65 && player.hair.type != Hair.BASILISK_SPINES && player.hasLizardScales() && player.hasReptileFace()) {
						// Corrupted Basilisk
						if (player.hair.length > 0 && [Hair.GOO, Hair.BASILISK_PLUME].indexOf(player.hair.type) == -1) {
							output.text("\n\nYour scalp feels tight and hot, causing you to run a hand through your [hair] to rub at it gingerly.");

							if (player.featheryHairPinEquipped())
								output.text("\n\nThe pin in your hair heats up to the point where you have to pull it free and toss it to the ground,"
								           +" it sizzling against the earth.");

							output.text("\n\nTo your shock a handful of your [hair] comes loose, exposing the [skinFurScales] beneath. You wonder why"
							           +" this is happening to you but realise it must be the potion, lizards don't tend to have hair after all."
							           +" You continue to rub at your scalp, the cool air against your slowly revealed skin a welcome relief."
							           +" After several minutes of this, you're certain you've shed all your hair. When you think it's all over,"
							           +" you feel an uncomfortable pressure build, your scalp morphing and changing as you grimace."
							           +" When the sensation finally fades you rush to look at yourself in a puddle. Where you once had hair,"
							           +" you now have a crown of dull reptilian spines!");

						}

						// Female Basilisk to Corrupted Basilisk
						if (player.hair.length > 0 && player.hair.type == Hair.BASILISK_PLUME) {
							output.text("\n\nA sudden sharp pain drills through your skull, a pressure forming across your scalp."
							           +" If you didn't know any better you'd think you were being plucked!");

							if (player.featheryHairPinEquipped())
								output.text("\n\nThe pin in your hair heats up to the point where you have to pull it free and toss it to the ground,"
								           +" it sizzling against the earth.");

							output.text("\n\nYou clutch your head as you feel the feathers on your head push out further, thickening up as they do so."
							           +" The soft vane seems to fall from the spine of the feathers, stripping them bare as the red fluff falls to"
							           +" the floor. Soon the tips of the feathers follow, leaving some rather alien looking spines behind. Your head"
							           +" throbs with dull pain as the transformation seems to end and you go to look at your reflection in a nearby"
							           +" puddle. Your once magnificent plume has turned into a dull crown of spines, like that of the corrupt"
							           +" basilisk of the mountains. As you mourn the loss of your feathered hair, you notice your spines move with"
							           +" your emotions, their sensitive tips picking up on the breeze as they lower closer to your skull.");
						}

						// Corrupted basilisk with gooey or no hair (bald)
						if (player.hair.type == Hair.GOO || player.hair.length <= 0) {
							if (player.hair.type == Hair.GOO)
								output.text("\n\nYour gooey hair begins to fall out in globs, eventually leaving you with a bald head.");

							if (player.featheryHairPinEquipped())
								output.text("\n\nThe pin in your hair heats up to the point where you have to pull it free and toss it to the ground,"
								           +" it sizzling against the earth.");

							output.text("\n\nYour scalp feels tight, as though the skin is shifting and morphing."
							           +" You let out groan as you grip your head, praying for the pain to subside quickly. Pressure builds,"
							           +" your head feeling ready to split. As the sensation fades you're left wondering what just happened and you"
							           +" run to look at yourself in a nearby puddle.");
						}

						// Finalize Corrupted Basilisk TFs
						player.hair.color = player.skin.tone;                   // hairColor always set to player.skin.tone
						player.hair.type = Hair.BASILISK_SPINES;               // hairType set to basilisk spines
						player.hair.length = 2;                                // hairLength set to 2 (inches, displayed as ‘short’)
						flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] = 1; // Hair growth stops
						changes++;
						output.text("\n\n<b>Where your hair would be, you now have a crown of dull reptilian spines!</b>");

						if (player.featheryHairPinEquipped())
							output.text("\n\nYou place the hair-pin in your inventory, no longer able to wear it.");
						else if (hairPinID >= 0)
							output.text("\n\nYour thoughts wander to the hair-pin while you adjust to your new [hair]. You probably won't be able to"
							           +" wear it while you're this tainted.");

						if (hairPinID >= 0) {                                 // hair-pin set to unequipped
							player.keyItems[hairPinID].value1 = 0;
							player.keyItems[hairPinID].value2 = 0;
						}
						if (tfSource == "PlayerEvents-benoitHairPin") output.text("\n");
						return 1;
					}
					return 0;

				default:
					return 0;
			}
		}

		/**
		 * Updates the perk Oviposition depending on the class/method stored in tfSource, that called it.
		 * @param	tfSource	The method- or classname plus additional info seperated by the '-'-character
		 * @return	-1: lost the perk, 0: no change, 1: gained the perk
		 * @author	Stadler76
		 */
		public  updateOvipositionPerk(tfSource: string): number
		{
			LOGGER.debug("called updateOvipositionPerk(\"{0}\")", tfSource);

		var  tsParts: any[] = tfSource.split("-");
			if (tsParts.length > 1 && ["goldenSeed", "catTransformation"].indexOf(tsParts[0]) == -1)
				tfSource = tsParts[0];

			// First things first :)
			if (player.findPerk(PerkLib.BasiliskWomb) >= 0) {
				if (player.findPerk(PerkLib.Oviposition) >= 0)
					return 0; // we already have it => no change

				// Basilisk Womb but no Oviposition? Fix, whats broken
				outputText("\n\nDeep inside yourself there is a change.  It makes you feel a little woozy, but passes quickly."
				          +"  Beyond that, you aren't sure exactly what just happened, but you are sure it originated from your basilisk womb.\n");
				outputText("(<b>Perk Gained: Oviposition</b>)");

				player.createPerk(PerkLib.Oviposition, 0, 0, 0, 0);
				return 1; // true => gained Oviposition Perk
			}

			if (changes >= changeLimit) return 0;

			// Note, that we don't do the score checks anymore. That was just an ugly workaround and we don't want to do that again!
			switch(tfSource) {
				case "EmberTFs":
				case "snakeOil":
				case "goldenSeed-HarpyWomb":
				//case "catTransformation-dragonne": // Keep it? Maybe later.
				// TFs with minor changes. Just in case, we change our mind or if we intend to upgrade them.
				case "winterPudding":
				case "rizzaRootEffect":
					return 0; // Don't change it. So we're done, yay!

				case "reptilum":
				case "echidnaTFs":
				case "TonOTrice":
					if (player.findPerk(PerkLib.Oviposition) >= 0) return 0;
					outputText("\n\nDeep inside yourself there is a change.  It makes you feel a little woozy, but passes quickly."
					          +"  Beyond that, you aren't sure exactly what just happened, but you are sure it originated from your womb.\n");
					outputText("(<b>Perk Gained: Oviposition</b>)");

					player.createPerk(PerkLib.Oviposition, 0, 0, 0, 0);
					changes++;
					return 1; // Gained it
					break;

				default:
					if (player.findPerk(PerkLib.Oviposition) < 0) return 0;
					if (player.lizardScore() >= 8) return 0; // Still high, so don't remove Oviposition yet!
					if (tfSource != "superHummus") {
						outputText("\n\nAnother change in your uterus ripples through your reproductive systems."
						          +"  Somehow you know you've lost a little bit of reptilian reproductive ability.\n");
						outputText("(<b>Perk Lost: Oviposition</b>)\n");
					}
					player.removePerk(PerkLib.Oviposition);
					return -1; // Lost it
			}
		}

		public  updateGills(newGillType: number = Gills.NONE): number
		{
			LOGGER.debug("Called updateGills(\"{0}\")", newGillType);

		var  oldgillType: number = player.gills.type;
			if (player.gills.type == newGillType) return 0; // no change

			player.gills.type = newGillType;
			changes++;

			// for now, we only have anemone gills on the chest
			switch (newGillType) {
				case Gills.NONE:
					if (oldgillType == Gills.ANEMONE) {
						output.text("\n\nYour chest itches, and as you reach up to scratch it, you realize your gills have withdrawn into your"
						           +" skin.");
					} else { // losing fish gills
						output.text("\n\nYou feel your gills tighten, the slits seeming to close all at once. As you let out a choked gasp your"
						           +" gills shrink into nothingness, leaving only smooth skin behind. Seems you won't be able to stay in the water"
						           +" quite so long anymore.");
					}
					output.text("  <b>You no longer have gills!</b>");
					return -1; // Gills lost

				case Gills.ANEMONE:
					if (oldgillType == Gills.FISH) {
						output.text("\n\nYou feel your gills tighten, the slits seeming to close all at once. As you let out a choked gasp your"
						           +" gills shrink into nothingness, leaving only smooth skin behind. When you think it's over you feel something"
						           +" emerge from under your neck, flowing down over your chest and brushing your nipples. You look in surprise as"
						           +" your new feathery gills finish growing out, a film of mucus forming over them shortly after.");
					} else { // if no gills
						output.text("\n\nYou feel a pressure in your lower esophageal region and pull your garments down to check the area."
						           +" Before your eyes a pair of feathery gills start to push out of the center of your chest,"
						           +" just below your neckline, parting sideways and draping over your " + player.nippleDescript(0) + "s."
						           +" They feel a bit uncomfortable in the open air at first, but soon a thin film of mucus covers them and you"
						           +" hardly notice anything at all. You redress carefully.");
					}
					output.text("\n\n<b>You now have feathery gills!</b>");
					return 1; // Gained gills or gillType changed

				case Gills.FISH:
					if (oldgillType == Gills.ANEMONE) {
						output.text("\n\nYou feel your gills tingle, a vague numbness registering across their feathery exterior. You watch in awe as"
						           +" your gill's feathery folds dry out and fall off like crisp autumn leaves. The slits of your gills then"
						           +" rearrange themselves, becoming thinner and shorter, as they shift to the sides of your neck. They now close in"
						           +" a way that makes them almost invisible. As you run a finger over your neck you feel little more than several"
						           +" small raised lines where they meet your skin.");
					} else { // if no gills
						output.text("\n\nYou feel a sudden tingle on your neck. You reach up to it to feel, whats the source of it. When you touch"
						           +" your neck, you feel that it begins to grow several narrow slits which slowly grow longer. After the changes"
						           +" have stopped you quickly head to a nearby puddle to take a closer look at your neck. You realize,"
						           +" that your neck has grown gills allowing you to breathe under water as if you were standing on land.");
					}
					output.text("\n\n<b>You now have fish like gills!</b>");
					return 1; // Gained gills or gillType changed

				default:
					player.gills.type = oldgillType;
					changes--;
					LOGGER.error("Unimplemented new gillType (\"{0}\") used", newGillType);
					return 0; // failsafe, should hopefully never happen
			}
		}

		public  gainSnakeTongue(): boolean
		{
			if (player.tongue.type != Tongue.SNAKE && changes < changeLimit) {
				if (player.tongue.type == Tongue.HUMAN) {
					outputText("\n\nYour taste-buds start aching as they swell to an uncomfortably large size. "
					          +"Trying to understand what in the world could have provoked such a reaction, you bring your hands up to your mouth, "
					          +"your tongue feeling like it's trying to push its way past your lips.");
					outputText("  The soreness stops and you stick out your tongue to try and see what would have made it feel the way it did. "
					          +"As soon as you stick your tongue out you realize that it sticks out much further than it did before, "
					          +"and now appears to have split at the end, creating a forked tip.");
					outputText("  <b>The scents in the air are much more noticeable to you with your snake-like tongue.</b>");
				} else {
					outputText("\n\nYour inhuman tongue shortens, pulling tight in the very back of your throat.");
					outputText("  After a moment the bunched-up tongue-flesh begins to flatten out, then extend forwards.");
					outputText("  By the time the transformation has finished, <b>your tongue has changed into a long, forked snake-tongue.</b>");
				}
				player.tongue.type = Tongue.SNAKE;
				dynStats("sen", 5);
				changes++;
				return true;
			}

			return false;
		}

		public  gainLizardTongue(): boolean
		{
			if (player.tongue.type != Tongue.LIZARD) {
				outputText("\n\nYour tongue goes numb, making your surprised noise little more than a gurgle as your tongue flops comically. ");
				switch (player.tongue.type) {
					case Tongue.SNAKE:
						outputText("\nSlowly your tongue swells, thickening up until it's about as thick as your thumb, while staying quite "
					              +" flexible. You drool, your tongue lolling out of your mouth as you slowly begin to regain control of your forked"
					              +" organ. When you retract your tongue however, you are shocked to find it is much longer than it used to be,"
					              +" now a foot long. As you cram your newly shifted appendage back in your mouth, you feel a sudden SNAP,"
					              +" and on inspection, find you've snapped off your fangs! Well, you suppose you needed the room anyway.");
						break;

					case Tongue.DEMONIC:
						outputText("\nYour tongue gently shrinks down, the thick appendage remaining flexible but getting much smaller. There's"
					              +" little you can do but endure the weird pinching feeling as your tongue eventually settles at being a foot long."
					              +" The pinching sensation continues as the tip of your tongue morphs, becoming a distinctly forked shape."
					              +" As you inspect your tongue you slowly regain control, retracting it into your mouth, the forked tips picking up"
					              +" on things you couldn't taste before.");
						break;

					case Tongue.DRACONIC:
						outputText("\nYour tongue rapidly shrinks down, the thick appendage remaining flexible but getting much smaller. There's"
					              +" little you can do but endure the weird pinching feeling as your tongue eventually settles at being a foot long."
					              +" The pinching sensation continues as the tip of your tongue morphs, becoming a distinctly forked shape."
					              +" As you inspect your tongue you slowly regain control, retracting it into your mouth, the forked tips picking up"
					              +" on things you couldn't taste before.");
						break;

					case Tongue.ECHIDNA:
						outputText("\nSlowly your tongue swells, thickening up until it’s about as thick as your thumb, while staying long."
					              +" The tip pinches making you wince, morphing into a distinctly forked shape. As you inspect your tongue you slowly"
					              +" regain control, retracting it into your mouth, the forked tips picking up on things you couldn't taste before.");
						break;

					default:
						outputText("\nSlowly your tongue swells, thickening up until it’s about as thick as your thumb, filling your mouth as you"
					              +" splutter. It begins lengthening afterwards, continuing until it hangs out your mouth, settling at 1 foot long."
					              +" The tip pinches making you wince, morphing into a distinctly forked shape. As you inspect your tongue you slowly"
					              +" regain control, retracting it into your mouth, the forked tips picking up on things you couldn't taste before.");
				}
				outputText("\n\n<b>You now have a lizard tongue!</b>");
				player.tongue.type = Tongue.LIZARD;
				dynStats("sen", 5); // Sensitivy gain since its forked
				changes++;
			}

			return false;
		}

		public  gainDraconicHorns(tfSource: string): void
		{
			LOGGER.debug("called gainDraconicHorns(\"{0}\")", tfSource);

		var  tsParts: any[] = tfSource.split("-");
		var  race: string;

			if (tsParts[0] == "EmberTFs")
				race = "dragon";
			else if (tsParts[0] == "reptilum" && tsParts.length > 1)
				race = tsParts[1];
			else
				throw new Error("Unimplemented tfSource: '" + tfSource + "' used in gainDraconicHorns!");

			//No dragon horns yet.
			if (player.horns.type != Horns.DRACONIC_X2 && player.horns.type != Horns.DRACONIC_X4_12_INCH_LONG) {
				//Already have horns
				if (player.horns.value > 0) {
					//High quantity demon horns
					if (player.horns.type == Horns.DEMON && player.horns.value > 4) {
						outputText("\n\nYour horns condense, twisting around each other and merging into larger, pointed protrusions.  By the time they finish you have four draconic-looking horns, each about twelve inches long.");
						player.horns.value = 12;
						player.horns.type = Horns.DRACONIC_X4_12_INCH_LONG;
					}
					else {
						outputText("\n\nYou feel your horns changing and warping, and reach back to touch them.  They have a slight curve and a gradual taper.  They must look something like the horns the dragons in your village's legends always had.");
						player.horns.type = Horns.DRACONIC_X2;
						if (player.horns.value > 13) {
							outputText("  The change seems to have shrunken the horns, they're about a foot long now.");
							player.horns.value = 12;
						}

					}
					changes++;
				}
				//No horns
				else {
					//-If no horns, grow a pair
					outputText("\n\nWith painful pressure, the skin on the sides of your forehead splits around two tiny nub-like horns.  They're angled back in such a way as to resemble those you saw on the dragons in your village's legends.  A few inches of horn sprout from your head before stopping.  <b>You have about four inches of dragon-like horn.</b>");
					player.horns.value = 4;
					player.horns.type = Horns.DRACONIC_X2;

					changes++;
				}
			}
			//ALREADY DRAGON
			else {
				if (player.horns.type == Horns.DRACONIC_X2) {
					if (player.horns.value < 12) {
						if (rand(3) == 0) {
							outputText("\n\nYou get a headache as an inch of fresh horn escapes from your pounding skull.");
							player.horns.value += 1;
						}
						else {
							outputText("\n\nYour head aches as your horns grow a few inches longer.  They get even thicker about the base, giving you a menacing appearance.");
							player.horns.value += 3 + rand(3);
						}
						if (player.horns.value >= 12) outputText("  <b>Your horns settle down quickly, as if they're reached their full size.</b>");
						changes++;
					}
					//maxxed out, new row
					else {
						//--Next horn growth adds second row and brings length up to 12\"
						outputText("\n\nA second row of horns erupts under the first, and though they are narrower, they grow nearly as long as your first row before they stop.  A sense of finality settles over you.  <b>You have as many horns as a " + race + " can grow.</b>");
						player.horns.type = Horns.DRACONIC_X4_12_INCH_LONG;
						changes++;
					}
				}
			}
		}

		public  demonChanges(tfSource: string): void
		{
			LOGGER.debug("called demonChanges(\"{0}\")", tfSource);

			//Change tail if already horned.
			if (player.tail.type !== Tail.DEMONIC && player.horns.value > 0) {
				if (player.tail.type !== Tail.NONE) {
					outputText("\n\n");
					if (player.tail.type == Tail.SPIDER_ABDOMEN || player.tail.type == Tail.BEE_ABDOMEN) outputText("You feel a tingling in your insectile abdomen as it stretches, narrowing, the exoskeleton flaking off as it transforms into a flexible demon-tail, complete with a round spaded tip.  ");
					else outputText("You feel a tingling in your tail.  You are amazed to discover it has shifted into a flexible demon-tail, complete with a round spaded tip.  ");
					outputText("<b>Your tail is now demonic in appearance.</b>");
				}
				else outputText("\n\nA pain builds in your backside... growing more and more pronounced.  The pressure suddenly disappears with a loud ripping and tearing noise.  <b>You realize you now have a demon tail</b>... complete with a cute little spade.");
				dynStats("cor", 4);
				player.tail.type = Tail.DEMONIC;
				changes++;
			}
			//grow horns!
			if (player.horns.value == 0 || (rand(player.horns.value + 3) === 0)) {
				if (player.horns.value < 12 && (player.horns.type == Horns.NONE || player.horns.type == Horns.DEMON)) {
					outputText("\n\n");
					if (player.horns.value == 0) {
						outputText("A small pair of demon horns erupts from your forehead.  They actually look kind of cute.  <b>You have horns!</b>");
					}
					else outputText("Another pair of demon horns, larger than the last, forms behind the first row.");
					if (player.horns.type == Horns.NONE) player.horns.type = Horns.DEMON;
					player.horns.value++;
					player.horns.value++;
					dynStats("cor", 3);
				}
				//Text for shifting horns
				else if (player.horns.type > Horns.DEMON) {
					outputText("\n\n");
					outputText("Your horns shift, shrinking into two small demonic-looking horns.");
					player.horns.value = 2;
					player.horns.type = Horns.DEMON;
					dynStats("cor", 3);
				}
				changes++;
			}
			//Nipples Turn Back:
			if (player.hasStatusEffect(StatusEffects.BlackNipples) && rand(3) === 0) {
				removeBlackNipples(tfSource);
			}
			//remove fur
			if ((player.face.type !== Face.HUMAN || !player.hasPlainSkin()) && rand(3) === 0) {
				//Remove face before fur!
				if (player.face.type !== Face.HUMAN) {
					outputText("\n\n");
					outputText("Your visage twists painfully, returning to a more normal human shape, albeit with flawless skin.  <b>Your face is human again!</b>");
					player.face.type = Face.HUMAN;
				}
				//De-fur
				else if (!player.hasPlainSkin()) {
					outputText("\n\n");
					if (player.hasFur()) outputText("Your skin suddenly feels itchy as your fur begins falling out in clumps, <b>revealing inhumanly smooth skin</b> underneath.");
					if (player.hasScales()) outputText("Your scales begin to itch as they begin falling out in droves, <b>revealing your inhumanly smooth " + player.skin.tone + " skin</b> underneath.");
					player.skin.type = Skin.PLAIN;
					player.skin.desc = "skin";
					player.underBody.restore();
				}
				changes++;
			}
			//Demon tongue
			if (player.tongue.type == Tongue.SNAKE && rand(3) === 0) {
				outputText("\n\nYour snake-like tongue tingles, thickening in your mouth until it feels more like your old human tongue, at least for the first few inches.  It bunches up inside you, and when you open up your mouth to release it, roughly two feet of tongue dangles out.  You find it easy to move and control, as natural as walking.  <b>You now have a long demon-tongue.</b>");
				player.tongue.type = Tongue.DEMONIC;
				changes++;
			}
			//foot changes - requires furless
			if (player.hasPlainSkin() && rand(4) === 0) {
				//Males/genderless get clawed feet
				if (player.gender <= 1 || (player.gender == 3 && player.mf("m", "f") == "m")) {
					if (player.lowerBody.type !== LowerBody.DEMONIC_CLAWS) {
						outputText("\n\n");
						outputText("Every muscle and sinew below your hip tingles and you begin to stagger. Seconds after you sit down, pain explodes in your " + player.feet() + ". Something hard breaks through your sole from the inside out as your toes splinter and curve cruelly. The pain slowly diminishes and your eyes look along a human leg that splinters at the foot into a claw with sharp black nails. When you relax, your feet grip the ground easily. <b>Your feet are now formed into demonic claws.</b>");
						player.lowerBody.type = LowerBody.DEMONIC_CLAWS;
						player.lowerBody.legCount = 2;
					}
				}
				//Females/futa get high heels
				else if (player.lowerBody.type !== LowerBody.DEMONIC_HIGH_HEELS) {
					outputText("\n\n");
					outputText("Every muscle and sinew below your hip tingles and you begin to stagger. Seconds after you sit down, pain explodes in your " + player.feet() + ". Something hard breaks through your sole from the inside out. The pain slowly diminishes and your eyes look along a human leg to a thin and sharp horn protruding from the heel. When you relax, your feet are pointing down and their old posture is only possible with an enormous effort. <b>Your feet are now formed into demonic high-heels.</b> Tentatively you stand up and try to take a few steps. To your surprise you feel as if you were born with this and stride vigorously forward, hips swaying.");
					player.lowerBody.type = LowerBody.DEMONIC_HIGH_HEELS;
					player.lowerBody.legCount = 2;
				}
				changes++;
			}
			//Grow demon wings
			if ((player.wings.type !== Wings.BAT_LIKE_LARGE || player.rearBody.type == RearBody.SHARK_FIN) && rand(8) === 0 && player.isCorruptEnough(50)) {
				//grow smalls to large
				if (player.wings.type == Wings.BAT_LIKE_TINY && player.cor >= (75 - player.corruptionTolerance())) {
					outputText("\n\n");
					outputText("Your small demonic wings stretch and grow, tingling with the pleasure of being attached to such a tainted body.  You stretch over your shoulder to stroke them as they unfurl, turning into full-sized demon-wings.  <b>Your demonic wings have grown!</b>");
					player.wings.type = Wings.BAT_LIKE_LARGE;
				}
				else if (player.rearBody.type == RearBody.SHARK_FIN) {
					outputText("\n\nThe muscles around your shoulders bunch up uncomfortably, changing to support the new bat-like wings growing from"
					          +" your back.  You twist your head as far as you can for a look"
					          +" and realize your fin has changed into small bat-like demon-wings!");
					player.rearBody.restore();
					player.wings.type = Wings.BAT_LIKE_TINY;
				}
				//No wings
				else if (player.wings.type == Wings.NONE) {
					outputText("\n\n");
					outputText("A knot of pain forms in your shoulders as they tense up.  With a surprising force, a pair of small demonic wings sprout from your back, ripping a pair of holes in the back of your " + player.armorName + ".  <b>You now have tiny demonic wings</b>.");
					player.wings.type = Wings.BAT_LIKE_TINY;
				}
				//Other wing types
				else {
					outputText("\n\n");
					outputText("The muscles around your shoulders bunch up uncomfortably, changing to support your wings as you feel their weight increasing.  You twist your head as far as you can for a look and realize they've changed into ");
					if ([Wings.BEE_LIKE_SMALL, Wings.HARPY, Wings.IMP, Wings.DRACONIC_SMALL].indexOf(player.wings.type) !== -1) {
						outputText("small ");
						player.wings.type = Wings.BAT_LIKE_TINY;
					}
					else {
						outputText("large ");
						player.wings.type = Wings.BAT_LIKE_LARGE;
					}
					outputText("<b>bat-like demon-wings!</b>");
				}
				changes++;
			}
		}

		public  growDemonCock(growCocks: number): void
		{
			temp = 0;
			while (growCocks > 0) {
				player.createCock();
				//trace("COCK LENGTH: " + player.cocks[length - 1].cockLength);
				player.cocks[player.cocks.length - 1].cockLength = rand(3) + 4;
				player.cocks[player.cocks.length - 1].cockThickness = .75;
				//trace("COCK LENGTH: " + player.cocks[length - 1].cockLength);
				growCocks--;
				temp++;
			}
			outputText("\n\nYou shudder as a pressure builds in your crotch, peaking painfully as a large bulge begins to push out from your body.  ");
			if (temp == 1) {
				outputText("The skin seems to fold back as a fully formed demon-cock bursts forth from your loins, drizzling hot cum everywhere as it orgasms.  In time it fades to a more normal coloration and human-like texture.  ");
			}
			else {
				outputText("The skin bulges obscenely, darkening and splitting around " + num2Text(temp) + " of your new dicks.  For an instant they turn a demonic purple and dribble in thick spasms of scalding demon-cum.  After, they return to a more humanoid coloration.  ");
			}
			if (temp > 4) outputText("Your tender bundle of new cocks feels deliciously sensitive, and you cannot stop yourself from wrapping your hands around the slick demonic bundle and pleasuring them.\n\nNearly an hour later, you finally pull your slick body away from the puddle you left on the ground.  When you look back, you notice it has already been devoured by the hungry earth.");
			player.orgasm('Dick');
		}

		public  removeExtraBreastRow(tfSource: string): void
		{
			LOGGER.debug("called removeExtraBreastRow(\"{0}\")", tfSource);
			
			if (player.breastRows.length <= 1) {
				return;
			}
			
			outputText("\n\nYou stumble back when your center of balance shifts, and though you adjust before you can fall over, you're left to watch"
			          +" in awe as your bottom-most [lastbreasts] shrink down, disappearing completely into your [if (breastrows >= 3)abdomen|chest]."
			          +" The [lastnipples] even fade until nothing but [if (isFluffy)[furColor] [skinDesc]|[skinTone] [skinDesc]] remains."
			          +" <b>You've lost a row of breasts!</b>");
					  
			if (tfSource !== "regularHummus") {
				dynStats("sen", -5);
			}
			
			player.removeBreastRow(player.breastRows.length - 1, 1);
			changes++;
		}
	}

