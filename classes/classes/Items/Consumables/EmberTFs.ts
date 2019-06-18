
	/**
	 * Moved out of classes.Scenes.NPCs.EmberScene
	 * @since December 11, 2016
	 * @author Stadler76
	 */
	export class EmberTFs extends Consumable 
	{
		public  EmberTFs(type: number = 0) 
		{
		var  id: string;
		var  shortName: string;
		var  longName: string;
		var  description: string;
		var  value: number;

			switch (type) {
				case 1:
					id = "DrakHrt";
					shortName = "DrakeHeart";
					longName = "a drake's heart's flower";
					description = "A rare, beautiful flower.  It could make an exquisite perfume.  According to a legend, dragons give this flower to the ones they intend to court.";
					value = 50;
					break;
				default:
					id = "EmberBl";
					shortName = "EmberBlood";
					longName = "Embers's blood";
					description = "Ember's dragon blood.  Can't be bought or sold. Immediately consumed. >>>Should not see me.<<<";
					value = 0;
			}

			super(id, shortName, longName, value, description);
		}

		public  useItem(): boolean
		{
		var  tfSource: string = "EmberTFs-" + shortName;
		var  temp: number;
		var  drakesHeart: boolean = tfSource == "EmberTFs-DrakeHeart";
			mutations.initTransformation(undefined, 2);

			if (drakesHeart) {
				output.text("You bring the flower up to your nose and smell it. It has exquisite smell."
				           +" You suddenly have the strange desire to eat it. You pop the flower into your mouth and chew."
				           +" It tastes like vanilla somehow. Before you know it, you're undergoing changes.");
			}

			//Gain Dragon Dick
			if (changes < changeLimit && player.countCocksOfType(CockTypesEnum.DRAGON) < player.totalCocks() && rand(3) == 0) {
				temp = 0;
			var  choices: any[] = [];
			var  select: number;
				temp = player.cockTotal();
				//Build an array of all the locations for TF'able cocks.
				while (temp > 0) {
					temp--;
					if (player.cocks[temp].cockType != CockTypesEnum.DRAGON) choices[choices.length] = temp;
				}
				//Randomly choose one of those locations
				select = choices[rand(choices.length)];
				output.text("\n\nYour " + player.cockDescript(select) + " tingles as pins and needles sweep across it.  You pull open your [armor] to watch as it changes; the tip elongates and tapers, like a spear; a series of ridges form along the shaft, giving it an almost segmented look, and a prominent knot swells at its base.  You can't resist stroking it, until it begins dripping pre; ");
				if (player.sens100 >= 50) output.text("however, it's not until you press on your new, sensitive knot that you manage to blow your load and enjoy the last few spasms of pleasure as it finally finishes changing.");
				else output.text("but you sternly rein in your hands and tuck them into your armpits as the arousing changes run their course.");
				output.text("  <b>You now have a dragon penis.</b>");
				//lose lust if sens>=50, gain lust if else
				getGame().dynStats("sen", 10, "lus", 10);
				changes++;
				//Apply the TF
				player.cocks[select].cockType = CockTypesEnum.DRAGON;
				player.cocks[select].knotMultiplier = 1.3;
			}
			//-Remove extra breast rows
			if (changes < changeLimit && player.breastRows.length > 1 && rand(3) == 0 && !flags[kFLAGS.HYPER_HAPPY]) {
				mutations.removeExtraBreastRow(tfSource);
			}
			if (rand(5) == 0) mutations.updateOvipositionPerk(tfSource);
			//Gain Dragon Head
			if (changes < changeLimit && rand(3) === 0 && player.face.type !== Face.DRAGON && flags[kFLAGS.EMBER_ROUNDFACE] === 0) {
				output.text("\n\nYou scream as your face is suddenly twisted; your facial bones begin rearranging themselves under your skin, restructuring into a long, narrow muzzle.  Spikes of agony rip through your jaws as your teeth are brutally forced from your gums, giving you new rows of fangs - long, narrow and sharp.  Your jawline begins to sprout strange growths; small spikes grow along the underside of your muzzle, giving you an increasingly inhuman visage.\n\nFinally, the pain dies down, and you look for a convenient puddle to examine your changed appearance.\n\nYour head has turned into a reptilian muzzle, with small barbs on the underside of the jaw.  <b>You now have a dragon's face.</b>");
				player.face.type = Face.DRAGON;
				changes++;
			}
			//-Existing horns become draconic, max of 4, max length of 1'
			if (!player.hasDragonHorns(true) && changes < changeLimit && rand(5) == 0)
				mutations.gainDraconicHorns(tfSource);
			//Gain Dragon Ears
			if (changes < changeLimit && rand(3) == 0 && player.ears.type != Ears.DRAGON) {
				player.ears.type = Ears.DRAGON;
				output.text("\n\nA prickling sensation suddenly fills your ears; unpleasant, but hardly painful.  It grows and grows until you can't stand it any more, and reach up to scratch at them.  To your surprise, you find them melting away like overheated candles.  You panic as they fade into nothingness, leaving you momentarily deaf and dazed, stumbling around in confusion.  Then, all of a sudden, hearing returns to you.  Gratefully investigating, you find you now have a pair of reptilian ear-holes, one on either side of your head.  A sudden pain strikes your temples, and you feel bony spikes bursting through the sides of your head, three on either side, which are quickly sheathed in folds of skin to resemble fins.  With a little patience, you begin to adjust these fins just like ears to aid your hearing.  <b>You now have dragon ears!</b>");
				changes++;
			}
			//Gain Dragon Tongue
			if (changes < changeLimit && rand(3) == 0 && player.tongue.type != Tongue.DRACONIC) {
				output.text("\n\nYour tongue suddenly falls out of your mouth and begins undulating as it grows longer.  For a moment it swings wildly, completely out of control; but then settles down and you find you can control it at will, almost like a limb.  You're able to stretch it to nearly 4 feet and retract it back into your mouth to the point it looks like a normal human tongue.  <b>You now have a draconic tongue.</b>");
				player.tongue.type = Tongue.DRACONIC;
				changes++;
				//Note: This type of tongue should be eligible for all things you can do with demon tongue... Dunno if it's best attaching a boolean just to change the description or creating a whole new tongue type.
			}
			//(Pending Tongue Masturbation Variants; if we ever get around to doing that.)
			//Gain Dragon Scales
			if (!player.hasDragonScales() && changes < changeLimit && rand(3) == 0) {
				output.text("\n\nPrickling discomfort suddenly erupts all over your body, like every last inch of your skin has suddenly developed"
				           +" pins and needles.  You scratch yourself, hoping for relief; and when you look at your hands you notice small fragments"
				           +" of your [skinFurScales] hanging from your fingers.  Nevertheless you continue to scratch yourself, and when you're"
				           +" finally done, you look yourself over. New shield-like scales have grown to replace your peeled off [skinFurScales]."
				           +" They are smooth and look nearly as tough as iron.");
				player.skin.setProps({type: Skin.DRAGON_SCALES, adj: "tough", desc: "shield-shaped dragon scales"});
				//def bonus of scales
				player.underBody.type = UnderBody.REPTILE;
				player.copySkinToUnderBody({       // copy the main skin props to the underBody skin ...
					desc: "ventral dragon scales"  // ... and only override the desc
				});
				output.text("  <b>Your body is now covered in [skinTone], shield-shaped dragon scales with [underBody.skinTone] ventral scales"
				           +" covering your underside.</b>");
			}
			//<mod name="Reptile eyes" author="Stadler76">
			//Gain Dragon Eyes
			if (player.eyes.type != Eyes.DRAGON && player.hasDragonScales() && player.ears.type == Ears.DRAGON && player.hasDragonHorns() && changes < changeLimit && rand(4) == 0) {
				if (player.hasReptileEyes())
					output.text("\n\nYour eyes change slightly in their appearance.");
				else
				{
					output.text("\n\nYou feel a sudden surge of pain in your eyes as they begin to reshape. Your pupils begin to elongate becoming vertically slitted and your irises change their color, too.");
					output.text("\nAs the pain passes, you examine your eyes in a nearby puddle. You look into your new prideful, fierce dragon eyes with vertically slitted pupils and burning orange irises.");
					output.text("  They glitter even in the darkness. With a few tears remaining, the look is a bit blurry. Wanting to get a clearer look at them, you blink your remaining tears away and suddenly you realize, that you just did that with your second set of eyelids.");
				}
				output.text("  <b>You now have fierce dragon eyes.</b>");
				player.eyes.type = Eyes.DRAGON;
				changes++;
			}
			//</mod>
			//Gain Dragon Legs
			if (player.lowerBody.type != LowerBody.DRAGON && changes < changeLimit && rand(3) == 0) {
				//(if drider)
				if (player.lowerBody.type == LowerBody.DRIDER)
					output.text("\n\nA disquieting feeling ripples through your arachnid abdomen, and you find yourself losing control of your body from the waist down.  Your spidery legs flail madly as your abdomen visibly swells, chitin cracking ominously as the pressure builds up inside of you... and then explodes!  You wipe the gore from your face in disgust, wondering why you feel no pain.  Rolling over, you see that, caked with spider-slime, you now have a new pair of legs, human-like save for the scales and the bestial paws that serve as feet.  <b>You now have dragon feet.</b>");
				//(If naga)
				else if (player.isNaga()) {
					output.text("\n\nYou fall on your face to the ground, hissing and screeching in pain - it feels like someone has grabbed the tip of your tail, pulled it viciously straight, and is now splitting it up the middle with a knife!  Paralyzed from the waist down, you claw desperately at the earth to try and alleviate the pain, and can only think to thank your lucky stars when it fades away.  Looking down where your tail was, though the scales remain, you realize you've become a biped again, your new feet sporting bestial claws on their toes.  <b>You now have dragon feet.</b>");
				}
				//(If Goo)
				else if (player.isGoo()) {
					output.text("\n\nA strange tingling sensation fills you, and you watch as your gooey blob of a body begins to ripple and shudder; you try to make it stop, but you can't control it.  Before your eyes, it shapes itself into the appearance of legs, the colored slime growing denser and thicker, the surface membrane texturing itself to look like scales.  Before you've quite realized what's happened, the slime has set like water freezing, leaving you with humanoid legs once again, though tipped with claws and very reptilian in appearance.  <b>You now have dragon feet.</b>");
				}
				//(If hoofed legs)
				else if (player.lowerBody.type == LowerBody.HOOFED) {
					output.text("\n\nYou bellow in pain as your legs break and reform and your hooves seem to suddenly explode, the bones within twisting themselves into monstrous three-toed appendages, more like those of some terrible lizard-thing than anything else. <b>You now have dragon feet.</b>");
				}
				//(if centaur)
				else if (player.isTaur()) {
					output.text("\n\nYou cry out as spasms of pain suddenly rip through your quadrupedal body, bringing you crashing onto the ground.  Words cannot define the agony as muscles and bones twist and shift and collapse violently.  When it's all over, you stagger upright, finding yourself standing on two legs again.  Though covered in scales and with the paws of some monster lizard instead of feet, they otherwise look like your old human legs.  <b>You now have dragon feet.</b>");
				}
				//(If non-hoofed legs)
				else {
					output.text("\n\nYou scream in agony as you feel the bones in your feet suddenly break and restructure themselves, toes fusing together, bone swelling out of the merged masses of flesh.  When the pain is over, you realize that you still stand atop human-looking legs, but your feet have become like those of some bipedal reptilian killer, with powerful claws meant for gripping the ground. <b>You now have dragon feet.</b>");
				}
				player.lowerBody.type = LowerBody.DRAGON;
				player.lowerBody.legCount = 2;
				changes++;
			}
			//Gain Dragon Tail
			if (player.tail.type !== Tail.DRACONIC && changes < changeLimit && rand(3) === 0) {
				//(If no tail)
				if (player.tail.type === Tail.NONE) {
					output.text("\n\nA sudden dull, throbbing pain in your [butt] forces your hands to it; you can feel an ominous lump over your"
					           +" tail bone, swelling bigger and bigger with every heartbeat.  All of a sudden, it seems to explode,"
					           +" jutting out and around until it hovers near your ankles, the skin under your flesh hard and scaly."
					           +"  <b>You have grown a dragon tail; long, thick and muscular, yet flexible.</b>");
				//(If tail)
				} else {
					output.text("\n\nAn icy sensation fills your behind as your tail suddenly goes curiously numb.  Twisting your head around,"
					           +" you watch as it melts and transforms into a reptilian appendage, one thick and muscular, long and flexible,"
					           +" tapering to a tip adorned with wicked spikes."
					           +"  <b>You now have a dragon tail.</b>");
				}
				player.tail.type = Tail.DRACONIC;
				changes++
			}
			/*
			 //9999 - prolly not gonna do this!
			 Tail Slam Attack Effects:
			 Deals ⅓ normal damage, but pierces 30 defense (stacks with perks) and has a (strength / 2) chance of stunning the opponent that turn.
			 Note: Dunno how much defense critters usually have, but this is meant as a surprise attack of sorts, so it pierces a good amount of it.
			 Tail Slam Attack Description:
			 You spin around quickly, whipping your tail spikes at [enemy].

			 Hit: Your tail slams against it/" + emberMF("him","her") + " with brutal force, the spikes on the tip extending to puncture flesh.
			 Miss: Unfortunately, you lose your sense of depth as you whirl, and the tip swings harmlessly through the air in front of your target.
			 */
			//Grow Dragon Wings
			if ((player.wings.type != Wings.DRACONIC_LARGE || player.rearBody.type == RearBody.SHARK_FIN) && changes < changeLimit && rand(3) == 0) {
				if (player.wings.type == Wings.NONE) {
					output.text("\n\nYou double over as waves of pain suddenly fill your shoulderblades; your back feels like it's swelling, flesh and muscles ballooning.  A sudden sound of tearing brings with it relief and you straighten up.  Upon your back now sit small, leathery wings, not unlike a bat's. <b>You now have small dragon wings.  They're not big enough to fly with, but they look adorable.</b>");
					player.wings.type = Wings.DRACONIC_SMALL;
				}
				//(If Small Dragon Wings Present)
				else if (player.wings.type == Wings.DRACONIC_SMALL) {
					output.text("\n\nA not-unpleasant tingling sensation fills your wings, almost but not quite drowning out the odd, tickly feeling as they swell larger and stronger.  You spread them wide - they stretch further than your arms do - and beat them experimentally, the powerful thrusts sending gusts of wind, and almost lifting you off your feet.  <b>You now have fully-grown dragon wings, capable of winging you through the air elegantly!</b>");
					player.wings.type = Wings.DRACONIC_LARGE;
				}
				else if (player.rearBody.type == RearBody.SHARK_FIN) {
					output.text("\n\nA sensation of numbness suddenly fills your fin.  When it does away, it feels... different.  Looking back, you realize that it has been replaced by new, small wings, ones that you can only describe as draconic.  <b>Your shark-like fin has changed into dragon wings.</b>");
					player.rearBody.restore();
					player.wings.type = Wings.DRACONIC_SMALL;
				}
				//(If other wings present)
				else {
					output.text("\n\nA sensation of numbness suddenly fills your wings.  When it dies away, they feel... different.  Looking back, you realize that they have been replaced by new, small wings, ones that you can only describe as draconic.  <b>Your wings have changed into dragon wings.</b>");
					player.wings.type = Wings.DRACONIC_SMALL;
				}
				if (["", "no"].indexOf(player.wings.color) !== -1 || ["", "no"].indexOf(player.wings.color2) !== -1) {
					player.wings.color = player.skin.tone;
					player.wings.color2 = player.skin.tone;
				}
				changes++;
			}
			// <mod name="BodyParts.RearBody" author="Stadler76">
			//Gain Dragon Rear Body
			if (!drakesHeart && !player.hasDragonRearBody() && (player.hasDragonNeck() || flags[kFLAGS.EMBER_ROUNDFACE] == 1) && player.dragonScore() >= 4 && player.hasDraconicBackSide() && changes < changeLimit && rand(3) == 0) {
			var  emberRear: number = player.fetchEmberRearBody();
				switch (emberRear) {
					case RearBody.DRACONIC_MANE:
						// if (player.hair.length == 0) // Let's simply ignore baldness here for now. It wouldn't affect the PCs mane anyway.
						outputText("\n\nYou feel a sudden tingle just above your spine. Eager to see, what is the cause of it you bend your"
						          +" [if (hasDragonNeck)draconic neck|tail] to take a closer look at it. Looking at your"
						          +" [if (hasDragonNeck)back|tail] you see tiny splotches of hair beginning to grow out of your scaly skin. The hair"
						          +" grows longer and the splotches grow until they slowly merge to a vertical strip right above your spine.");
						outputText("\n\nTracing your spine, a mane of hair has grown; starting at the base of your neck and continuing down your"
						          +" tail, ending on the tip of your tail in a small tuft. It is the same color as the hair on your head,"
						          +" but shorter and denser; it has grown in a thick vertical strip, maybe two inches wide. It reminds you vaguely"
						          +" of a horse's mane. <b>You now have a hairy mane on your rear.</b>");
						player.rearBody.setAllProps({
							type:  RearBody.DRACONIC_MANE,
							color: player.hair.color
						});
						break;

					case RearBody.DRACONIC_SPIKES:
						// Teh spiky mane, similar to the hairy one.
						outputText("\n\nYou feel a sudden pain coming from your spine. Eager to see, what is the cause of it you bend your"
						          +" [if (hasDragonNeck)draconic neck|tail] to take a closer look at it. You watch your [if (hasDragonNeck)back|tail]"
						          +" in growing pain as small bulges start emerging from your spine, growing bigger and bigger, until you feel a"
						          +" sudden burst of pain, when small spikes begin to break through your skin. Hardly bearing the growing pain you"
						          +" continue watching them slowly growing longer curving backwards until finally the pain has ceased.");
						outputText("\n\nTracing your spine, a row of short steel-gray and curved backwards spikes protrude; starting at the base of"
						          +" your neck and continuing down your tail, ending on the tip of your tail. They've grown in a thick vertical"
						          +" strip, maybe an inch wide and two inches high. It reminds you very vaguely of a horse's mane.");
						outputText("  <b>Your rear is now decorated with a row of curved spikes.</b>");
						player.rearBody.setAllProps({type: RearBody.DRACONIC_SPIKES});
						break;

					default:
						// this should hopefully never happen
						// trace("Invalid Ember rearBody: " + emberRear);
				}
			}
			// </mod>
			//Restore non dragon neck
			if (player.neck.type != Neck.DRACONIC && changes < changeLimit && rand(4) == 0)
				mutations.restoreNeck(tfSource);
			//Gain Dragon Neck
			//public function hasDraconicBackSide(): boolean { return hasDragonWings(true) && skinType == Skin.DRACONIC && hasReptileTail() && hasReptileArms() && hasReptileLegs(); }
			//If you are considered a dragon-morph and if your backside is dragon-ish enough, your neck is eager to allow you to take a look at it, right? ;-)
			if (!drakesHeart && !player.hasDragonNeck() && player.dragonScore() >= 6 && player.hasDraconicBackSide() && player.face.type == Face.DRAGON && changes < changeLimit) {
				mutations.restoreNeck(tfSource + "-forceRestoreNeck");
			var  nlChange: number = 4 + rand(5);
				if (!player.hasNormalNeck()) { // Note: hasNormalNeck checks the length, not the type!
					player.neck.modify(nlChange);
					outputText("\n\nWith less pain than the last time your neck grows a few more inches reaching " + player.neck.len + " inches.");
				} else {
					player.neck.modify(nlChange, Neck.DRACONIC);
					// Growing a dragon neck may be limited to Ember's blood only in the future.
					outputText("\n\nAfter you have finished " + (drakesHeart ? "eating the flower" : "drinking Ember's dragon blood") + " you start feeling a sudden pain in your neck. Your skin stretches and your spine grows a bit. Your neck has grown a few inches longer than that of a normal human reaching " + player.neck.len + " inches.");
				}
				if (player.hasDragonNeck() && !player.neck.pos) {
					outputText("\n\nAfter the enlongation has finally ceased, your spine begins to readjust its position on your head until its settled at the backside of your head. After that you want to try out your new draconic neck and begin to bend your neck finding that you can bend it at ease like a snake can bend its tail. Eager to see, how you look from behind you quickly turn your head around. Staring at your magnificent draconic rear your mouth and eyes open wide in astonishment. You muster your tail, your backside fully covered in scales and finally, you unfold your wings. This is the first time, you can see every single scale of them. You look at them from all sides, flapping them slowly, just to watch them moving.");
					outputText("  <b>You now have a fully grown dragon neck.</b>");
					player.neck.pos = true;
				}
				changes++;
			}
			// <mod name="Predator arms" author="Stadler76">
			//Gain Dragon Arms (Derived from Arms.SALAMANDER)
			if (player.arms.type != Arms.PREDATOR && player.hasDragonScales() && player.lowerBody.type == LowerBody.DRAGON && changes < changeLimit && rand(3) == 0) {
				output.text("\n\nYou scratch your biceps absentmindedly, but no matter how much you scratch, you can't get rid of the itch.  After a longer moment of ignoring it you finally glance down in irritation, only to discover that your arms former appearance has changed into those of some reptilian killer with shield-shaped " + player.skin.tone + " scales and powerful, thick, curved steel-gray claws replacing your fingernails.");
				output.text("\n<b>You now have dragon arms.</b>");
				player.arms.setType(Arms.PREDATOR, Claws.DRAGON);
				changes++
			}
			//Claw transition
			if (player.arms.type == Arms.PREDATOR && player.hasDragonScales() && player.arms.claws.type != Claws.DRAGON && changes < changeLimit && rand(3) == 0) {
				output.text("\n\nYour [claws] change  a little to become more dragon-like.");
				player.arms.updateClaws(Claws.DRAGON);
				output.text(" <b>You now have [claws].</b>");
				changes++
			}
			// </mod>
			//Get Dragon Breath (Tainted version)
			//Can only be obtained if you are considered a dragon-morph, once you do get it though, it won't just go away even if you aren't a dragon-morph anymore.

			if (player.dragonScore() >= 4 && changes < changeLimit && player.findPerk(PerkLib.Dragonfire) < 0) {
				output.text("\n\nYou feel something awakening within you... then a sudden sensation of choking grabs hold of your throat, sending you to your knees as you clutch and gasp for breath.  It feels like there's something trapped inside your windpipe, clawing and crawling its way up.  You retch and splutter and then, with a feeling of almost painful relief, you expel a bellowing roar from deep inside of yourself... with enough force that clods of dirt and shattered gravel are sent flying all around.  You look at the small crater you have literally blasted into the landscape with a mixture of awe and surprise.");
				output.text("\n\nIt seems " + (drakesHeart ? "the flower" : "Ember's dragon blood") + " has awaked some kind of power within you... your throat and chest feel very sore, however; you doubt you can force out more than one such blast before resting.  (<b>Gained Perk: Dragonfire!</b>)");
				player.createPerk(PerkLib.Dragonfire, 0, 0, 0, 0);
				if (getGame().emberScene.emberAffection() >= 75 && !drakesHeart) output.text("\n\nEmber immediately dives back in to soothe your battered throat and mouth with another kiss.");
				changes++;
			}
			if (player.dragonScore() >= 4 && rand(3) == 0 && player.gender > 0 && (drakesHeart || player.hasCock() && getGame().emberScene.emberHasVagina() || player.hasVagina() && getGame().emberScene.emberHasCock())) {
				output.text("\n\nA sudden swell of lust races through your ");
				if (player.hasCock()) {
					output.text(player.cockDescript(0));
					if (player.hasVagina()) output.text(" and ");
				}
				if (player.hasVagina()) output.text(player.vaginaDescript());
				output.text(", making you wish " + (drakesHeart ? "you had a dragon to go with." : "Ember hadn't run you off") + ".  All you can think about now is fucking " + (drakesHeart ? "a dragon-morph" : getGame().emberScene.emberMF("him", "her")) + "; ");
				if (player.hasCock() && (getGame().emberScene.emberHasVagina() || drakesHeart)) {
					if (drakesHeart) {
						output.text("filling a womb with your seed and fertilizing those eggs");
					}
					else {
						output.text("filling her womb with your seed and fertilizing her eggs");
						if (player.hasVagina() && (getGame().emberScene.emberHasCock() || drakesHeart)) output.text(" even while ");
					}
				}
				if (player.hasVagina() && (getGame().emberScene.emberHasCock() || drakesHeart)) {
					output.text("taking that hard, spurting cock inside your own " + player.vaginaDescript(0));
				}
				output.text("... too late, you realize that <b>" + (drakesHeart ? "the flower" : "Ember's blood") + " has sent your draconic body into ");
				if (player.hasCock() && (getGame().emberScene.emberHasVagina() || drakesHeart) && (rand(2) == 0 || !player.hasVagina())) { //If hermaphrodite, the chance is 50/50.
					output.text("rut");
					
					player.goIntoRut(false);
				}
				else {
					output.text("heat");
					
					player.goIntoHeat(false);
				}
				output.text("</b>.");
			}
			flags[kFLAGS.TIMES_TRANSFORMED] += changes;
			return false;
		}
	}


