	
	/**
	 * Imp transformative item
	 * 
	 * fucking overhauled by Foxwells who was depressed by the sorry state of imp food
	 */
	export class ImpFood extends Consumable 
	{
		public  ImpFood() 
		{
			super("ImpFood", "ImpFood", "a parcel of imp food", ConsumableLib.DEFAULT_VALUE, "This is a small parcel of reddish-brown bread stuffed with some kind of meat.  It smells delicious.");
		}
		
		public  useItem(): boolean {
		var  tfSource: string = "impFood";
		var  temp: number = 0;
			mutations.initTransformation([2, 2]);
			clearOutput();
			if (player.cocks.length > 0) {
				outputText("The food tastes strange and corrupt - you can't really think of a better word for it, but it's unclean.");
				player.refillHunger(20);
				if (player.cocks[0].cockLength < 12 && changes < changeLimit) {
					temp = player.increaseCock(0, rand(2) + 2);
					outputText("\n\n");
					player.lengthChange(temp, 1);
					changes++;
				}
				outputText("\n\nInhuman vitality spreads through your body, invigorating you!\n");
				player.HPChange(30 + player.tou / 3, true);
				dynStats("lus", 3, "cor", 1);
				//Red or orange skin!
				if (rand(30) === 0 && ColorLists.IMP_SKIN.indexOf(player.skin.tone) === -1) {
					if (player.hasFur()) outputText("\n\nUnderneath your fur, your skin ");
					else outputText("\n\nYour " + player.skin.desc + " ");
					player.skin.tone = randomChoice(ColorLists.IMP_SKIN);
					outputText("begins to lose its color, fading until you're as white as an albino.  Then, starting at the crown of your head, a reddish hue rolls down your body in a wave, turning you completely " + player.skin.tone + ".");
					player.arms.updateClaws(player.arms.claws.type);
					kGAMECLASS.rathazul.addMixologyXP(20);
				}
			}
			else {
				outputText("The food tastes... corrupt, for lack of a better word.\n");
				player.refillHunger(20);
				player.HPChange(20 + player.tou / 3, true);
				dynStats("lus", 3, "cor", 1);
			}
			//Red or orange skin!
			if (rand(5) === 0 && ColorLists.IMP_SKIN.indexOf(player.skin.tone) === -1 && changes < changeLimit) {
				if (player.hasFur()) outputText("\n\nUnderneath your fur, your skin ");
				else outputText("\n\nYour " + player.skin.desc + " ");
				player.skin.tone = randomChoice(ColorLists.IMP_SKIN);
				outputText("begins to lose its color, fading until you're as white as an albino.  Then, starting at the crown of your head, a reddish hue rolls down your body in a wave, turning you completely " + player.skin.tone + ".");
				dynStats("cor", 2);
				player.skin.type = Skin.PLAIN;
				player.arms.updateClaws(player.arms.claws.type);
				kGAMECLASS.rathazul.addMixologyXP(20);
				changes++;
			}

			//Shrinkage!
			if (rand(2) === 0 && player.tallness > 42 && changes < changeLimit) {
				outputText("\n\nYour skin crawls, making you close your eyes and shiver.  When you open them again the world seems... different.  After a bit of investigation, you realize you've become shorter!");
				player.tallness -= 1 + rand(3);
				changes++;
			}
			
			//Imp wings - I just kinda robbed this from demon changes ~Foxwells
			if (rand(3) == 0 && changes < changeLimit && player.wings.type != Wings.IMP_LARGE && player.isCorruptEnough(25)) {
				//grow smalls to large
				if (player.wings.type === Wings.IMP && player.isCorruptEnough(50)) {
					outputText("\n\n");
					outputText("Your small imp wings stretch and grow, tingling with the pleasure of being attached to such a tainted body. You stretch over your shoulder to stroke them as they unfurl, turning into large imp-wings. <b>Your imp wings have grown!</b>");
					player.wings.type = Wings.IMP_LARGE;
				}
				else if (player.rearBody.type === RearBody.SHARK_FIN) {
					outputText("\n\n");
					outputText("The muscles around your shoulders bunch up uncomfortably, changing to support the new bat-like wings growing from your back. You twist your head as far as you can for a look and realize your fin has changed into imp-wings!");
					player.rearBody.restore();
					player.wings.type = Wings.IMP;
				}
				//No wings
				else if (player.wings.type === Wings.NONE) {
					outputText("\n\n");
					outputText("A knot of pain forms in your shoulders as they tense up.  With a surprising force, a pair of small imp wings sprout from your back, ripping a pair of holes in the back of your " + player.armorName + ".  <b>You now have imp wings.</b>");
					player.wings.type = Wings.IMP;
				}
				//Other wing types
				else {
					outputText("\n\n");
					outputText("The muscles around your shoulders bunch up uncomfortably, changing to support your wings as you feel their weight increasing.  You twist your head as far as you can for a look and realize they've changed into ");
					if ([Wings.BEE_LIKE_SMALL, Wings.HARPY, Wings.DRACONIC_SMALL, Wings.IMP].indexOf(player.wings.type) !== -1) {
						outputText("small ");
						player.wings.type = Wings.IMP;
					}
					else {
						outputText("large ");
						player.wings.type = Wings.IMP_LARGE;
					}
					outputText("<b>imp-wings!</b>");
				}
				dynStats("cor", 2);
				changes++;
			}
			
			//Imp tail, because that's a unique thing from what I see?
			if (player.tail.type !== Tail.IMP && changes < changeLimit && rand(3) === 0) {
				if (player.tail.type !== Tail.NONE) {
					outputText("\n\n");
					if (player.tail.type === Tail.SPIDER_ABDOMEN || player.tail.type === Tail.BEE_ABDOMEN) outputText("You feel a tingling in your insectile abdomen as it stretches, narrowing, the exoskeleton flaking off as it transforms into an imp's tail, complete with a round fluffed end. ");
					else outputText("You feel a tingling in your tail. You are amazed to discover it has shifted into an imp tail, complete with a fluffy end. ");
					outputText("<b>Your tail is an imp tail!</b>");
				}
				else {
					outputText("\n\nA pain builds in your backside, growing more and more pronounced. The pressure suddenly disappears with a loud ripping and tearing noise. <b>You realize you now have an imp tail</b>... complete with fluffed end.");
				}
				dynStats("cor", 2);
				player.tail.type = Tail.IMP;
				changes++;
			}
			
			//Feets, needs red/orange skin and tail
			if (["red", "orange"].indexOf(player.skin.tone) !== -1 && player.tail.type === Tail.IMP && player.lowerBody.type !== LowerBody.IMP && rand(3) === 0 && changes < changeLimit) {
				outputText("\n\nEvery muscle and sinew below your hip tingles and you begin to stagger. Seconds after you sit down, pain explodes in your " + player.feet() + ". Something hard breaks through your sole from the inside out as your " + player.feet() + " splinter and curve cruelly. The pain slowly diminishes and your eyes look along a skinny, human leg that splinters at the foot into three long claw with a smaller back one for balance. When you relax, your feet grip the ground easily. <b>Your lower body is now that of an imp.</b>");
				player.lowerBody.type = LowerBody.IMP;
				player.lowerBody.legCount = 2;
				dynStats("cor", 2);
				changes++;
		}
			
			//Imp ears, needs red/orange skin and horns
			if (player.horns.type === Horns.IMP && ["red", "orange"].indexOf(player.skin.tone) !== -1 && player.ears.type !== Ears.IMP && rand(3) === 0 && changes < changeLimit) {
				outputText("\n\nYour head suddenly pulses in pain, causing you to double over and grip at it. You feel your ears elongate and curl in slightly, ending at points not much unlike elves. These, however, jut out of the side of your head and are coned, focusing on every sound around you. A realization strikes you. <b>Your ears are now that of an imp!</b>");
				player.ears.type = Ears.IMP;
				dynStats("cor", 2);
				changes++;
		}
			
			//Horns, because why not?
			if ((player.horns.value === 0 || player.horns.type !== Horns.IMP) && changes < changeLimit && rand(2) === 0) {
				if (player.horns.value === 0) {
					outputText("\n\nA small pair of pointed imp horns erupt from your forehead. They look kind of cute. <b>You have horns!</b>");
				}
				else {
					outputText("\n\n");
					outputText("Your horns shift, turning into two pointed imp horns.");
				}
				player.horns.value = 2;
				player.horns.type = Horns.IMP;
				dynStats("cor", 2);
				changes++;
			}
			
			//Imp claws, needs orange/red skin. Also your hands turn human.
			if (["red", "orange"].indexOf(player.skin.tone) !== -1 && player.arms.claws.type !== Claws.IMP && rand(3) === 0 && changes < changeLimit) {
				if (player.arms.type !== Arms.HUMAN) {
					outputText("\n\nYour arms twist and mangle, warping back into human-like arms. But that, you realize, is just the beginning.");
				}
				if (player.arms.claws.type === Claws.NORMAL) {
					outputText("\n\nYour hands suddenly ache in pain, and all you can do is curl them up to you. Against your body, you feel them form into three long claws, with a smaller one replacing your thumb but just as versatile. <b>You have imp claws!</b>");
				} else { //has claws
					outputText("\n\nYour claws suddenly begin to shift and change, starting to turn back into normal hands. But just before they do, they stretch out into three long claws, with a smaller one coming to form a pointed thumb. <b>You have imp claws!</b>");
				}
				player.arms.setType(Arms.PREDATOR, Claws.IMP);
				dynStats("cor", 2);
				changes++;
			}
			
			//Changes hair to red/dark red, shortens it, sets it normal
			if (["red", "dark red"].indexOf(player.hair.color) === -1 && rand(3) === 0 && changes < changeLimit) {
				outputText("\n\nYour hair suddenly begins to shed, rapidly falling down around you before it's all completely gone. Just when you think things are over, more hair sprouts from your head, slightly curled and color different.");
				if (rand(2) !== 0) {
					player.hair.color = "red";
				} else {
					player.hair.color = "dark red";
				}
				outputText(" <b>You now have " + player.hair.color + "</b>");
				if (player.hair.type !== Hair.NORMAL) {
					outputText("<b> human</b>");
				}
				outputText("<b> hair!</b>");
				player.hair.type = Hair.NORMAL;
				player.hair.length = 1;
				changes++;
			}
			
			//Shrink titties
			if (player.biggestTitSize() > 0 && changes < changeLimit && rand(3) === 0 && !flags[kFLAGS.HYPER_HAPPY]) {
			var  temp2: number = 0;
			var  temp3: number = 0;
				//temp3 stores how many rows are changed
				for (var k: number = 0; k < player.breastRows.length; k++) {
					//If this row is over threshhold
					if (player.breastRows[k].breastRating > temp2) {
						//Big change
						if (player.breastRows[k].breastRating > 10) {
							player.breastRows[k].breastRating -= 2 + rand(3);
							if (temp3 === 0) outputText("\n\nThe " + player.breastDescript(0) + " on your chest wobble for a second, then tighten up, losing several cup-sizes in the process!");
							else outputText(" The change moves down to your " + num2Text2(k + 1) + " row of " + player.breastDescript(0) + ". They shrink greatly, losing a couple cup-sizes.");
						}
						//Small change
						else {
							player.breastRows[k].breastRating -= 1;
							if (temp3 === 0) outputText("\n\nAll at once, your sense of gravity shifts. Your back feels a sense of relief, and it takes you a moment to realize your " + player.breastDescript(k) + " have shrunk!");
							else outputText(" Your " + num2Text2(k + 1) + " row of " + player.breastDescript(k) + " gives a tiny jiggle as it shrinks, losing some off its mass.");
						}
						//Increment changed rows
						temp3++;
					}
				}
				changes++;
			}
			
			//Remove spare titties
			if (player.bRows() > 1 && rand(3) === 0 && changes < changeLimit && !flags[kFLAGS.HYPER_HAPPY]) {
				mutations.removeExtraBreastRow(tfSource);
			}
			
			//Free extra nipple removal service
			if (player.averageNipplesPerBreast() > 1 && rand(3) === 0 && changes < changeLimit) {
				outputText("\n\nA strange burning sensation fills your breasts, and you look in your " + player.armorName + " to see your extra nipples are gone! <b>You've lost your extra nipples!</b>");
				dynStats("sen", -3);
				for(var x: number = 0; x < player.bRows(); x++)
				{
					player.breastRows[x].nipplesPerBreast = 1;
				}
				changes++;
			}
			
			//Neck restore
			if (player.neck.type != Neck.NORMAL && changes < changeLimit && rand(4) == 0) mutations.restoreNeck(tfSource);
			//Rear body restore
			if (player.hasNonSharkRearBody() && changes < changeLimit && rand(5) == 0) mutations.restoreRearBody(tfSource);
			//Ovi perk loss
			if (rand(5) === 0 && changes < changeLimit) {
				mutations.updateOvipositionPerk(tfSource);
			}
			
			//You lotta imp? Time to turn male!
			//Unless you're one of the hyper happy assholes I guess
			//For real tho doesn't seem like female imps exist? Guess they're goblins
			if (player.impScore() >= 4 && changes < changeLimit && !flags[kFLAGS.HYPER_HAPPY]) {
				if (player.bRows() > 1) {
					outputText("\n\nYou stumble back when your center of balance shifts, and though you adjust before you can fall over, you're left to watch in awe as your extra breasts shrink down, disappearing completely into your body. The nipples even fade away until they're gone completely. <b>You've lost your extra breasts due to being an imp!</b>");
					player.breastRows.length = 1;
				}
				if (player.biggestTitSize() > 0) {
					outputText("\n\nAll at once, your sense of gravity shifts. Your back feels a sense of relief, and it takes you a moment to realize your breasts have gone flat! <b>You've lost your breasts due to being an imp!</b>");
					player.breastRows[0].breastRating = 0;
				}
				if (player.averageNipplesPerBreast() > 1) {
					outputText("\n\nA strange burning sensation fills your breasts, and you look in your " + player.armorName + " to see your extra nipples are gone! <b>You've lost your extra nipples due to being an imp!</b>");
					for(var z: number = 0; z < player.bRows(); z++)
					{
						player.breastRows[z].nipplesPerBreast = 1;
					}
				}
				if (player.nippleLength > 0.25) {
					outputText("\n\nA strange burning sensation fills you, and you look in your " + player.armorName + " to see your nipples have shrunk! <b>Your nipples have shrunk due to being an imp!</b>");
					player.nippleLength = 0.25;
				}
				if (player.hasVagina()) {
					outputText("\n\nA sudden pain in your groin brings you to your knees. You move your armor out of the way and watch as your cunt seals up, vanishing from your body entirely. <b>Your cunt has gone away due to being an imp!</b>");
					player.removeVagina();
				}
				if (!player.hasCock()) {
					outputText("\n\nPressure builds between your legs, and you barely get your armor off in time to watch a cock grow out of you. <b>You've grown a cock due to being an imp!</b>");
					player.createCock();
					player.cocks[0].cockLength = 12;
					player.cocks[0].cockThickness = 2;
					player.cocks[0].cockType = CockTypesEnum.HUMAN;
				}
				if (player.balls === 0) {
					outputText("\n\nA strange, unpleasant pressure forms between your thighs. You take off your armor and see that you've grown balls. <b>You've grown balls due to being an imp!</b>");
					player.balls = 2;
					player.ballSize = 2;
				}
				changes++;
				dynStats("cor", 20);
			}
			game.flags[kFLAGS.TIMES_TRANSFORMED] += changes;
			return false;
		}
	}

