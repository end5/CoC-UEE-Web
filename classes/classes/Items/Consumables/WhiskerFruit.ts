	
	/**
	 * Feline transformative item.
	 */
	export class WhiskerFruit extends Consumable 
	{
		public  WhiskerFruit() 
		{
			super("W.Fruit","W.Fruit", "a piece of whisker-fruit", ConsumableLib.DEFAULT_VALUE, "This small, peach-sized fruit has tiny whisker-like protrusions growing from the sides.");
		}
		
		public  useItem(): boolean
		{
		var  temp: number = 0;
		var  tfSource: string = "catTransformation";
			
			if (player.hasReptileScales() && player.hasDragonWings() && player.tongue.type === Tongue.DRACONIC)
				tfSource = "catTransformation-dragonne";
		var  temp2: number = 0;
		var  temp3: number = 0;
			mutations.initTransformation([2, 2, 3]);
			//Text go!
			clearOutput();
			outputText("You take a bite of the fruit and gulp it down. It's thick and juicy and has an almost overpowering sweetness. Nevertheless, it is delicious and you certainly could use a meal.  You devour the fruit, stopping only when the hard, nubby pit is left; which you toss aside.");
			//Speed raises up to 75
			if (player.spe100 < 75 && rand(3) === 0 && changes < changeLimit) {
				//low speed
				if (player.spe100 <= 30) {
					outputText("\n\nYou feel... more balanced, sure of step. You're certain that you've become just a little bit faster.");
					dynStats("spe", 2);
				}
				//medium speed
				else if (player.spe100 <= 60) {
					outputText("\n\nYou stumble as you shift position, surprised by how quickly you move. After a moment or two of disorientation, you adjust. You're certain that you can run faster now.");
					dynStats("spe", 1);
				}
				//high speed
				else {
					outputText("\n\nYou pause mid-step and crouch. Your leg muscles have cramped up like crazy. After a few moments, the pain passes and you feel like you could chase anything down.");
					dynStats("spe", .5);
				}
			}
			//Strength raises to 40
			if (player.str100 < 40 && rand(3) === 0 && changes < changeLimit) {
				if (rand(2) === 0) outputText("\n\nYour muscles feel taut, like a coiled spring, and a bit more on edge.");
				else outputText("\n\nYou arch your back as your muscles clench painfully.  The cramp passes swiftly, leaving you feeling like you've gotten a bit stronger.");
				dynStats("str", 1);
			}
			//Strength ALWAYS drops if over 60
			//Does not add to change total
			else if (player.str100 > 60 && rand(2) === 0) {
				outputText("\n\nShivers run from your head to your toes, leaving you feeling weak.  Looking yourself over, your muscles seemed to have lost some bulk.");
				dynStats("str", -2);
			}
			//Toughness drops if over 50
			//Does not add to change total
			if (player.tou100 > 50 && rand(2) === 0) {
				outputText("\n\nYour body seems to compress momentarily, becoming leaner and noticeably less tough.");
				dynStats("tou", -2);
			}
			//Intelliloss
			if (rand(4) === 0 && changes < changeLimit) {
				//low intelligence
				if (player.inte100 < 15) outputText("\n\nYou feel like something is slipping away from you but can't figure out exactly what's happening.  You scrunch up your " + player.faceDescript() + ", trying to understand the situation.  Before you can reach any kind of conclusion, something glitters in the distance, distracting your feeble mind long enough for you to forget the problem entirely.");
				//medium intelligence
				else if (player.inte100 < 50) {
					outputText("\n\nYour mind feels somewhat sluggish, and you wonder if you should just lie down ");
					if (rand(2) === 0) {
						outputText("somewhere and ");
						temp = rand(3);
						if (temp === 0) outputText("toss a ball around or something");
						else if (temp === 1) outputText("play with some yarn");
						else if (temp === 2) outputText("take a nap and stop worrying");
					}
					else outputText("in the sun and let your troubles slip away");
					outputText(".");
				}
				//High intelligence
				else outputText("\n\nYou start to feel a bit dizzy, but the sensation quickly passes.  Thinking hard on it, you mentally brush away the fuzziness that seems to permeate your brain and determine that this fruit may have actually made you dumber.  It would be best not to eat too much of it.");
				dynStats("int", -1);
			}
			//Libido gain
			if (player.lib100 < 80 && changes < changeLimit && rand(4) === 0) {
				//Cat dicked folks
				if (player.countCocksOfType(CockTypesEnum.CAT) > 0) {
					temp = player.findFirstCockType(CockTypesEnum.CAT);
					outputText("\n\nYou feel your " + player.cockDescript(temp) + " growing hard, the barbs becoming more sensitive. You gently run your hands down them and imagine the feeling of raking the insides of a cunt as you pull.  The fantasy continues, and after ejaculating and hearing the female yowl with pleasure, you shake your head and try to drive off the image.  ");
					if (player.cor < 33) outputText("You need to control yourself better.");
					else if (player.cor < 66) outputText("You're not sure how you feel about the fantasy.");
					else outputText("You hope to find a willing partner to make this a reality.");
				}
				//Else –
				else {
					outputText("\n\nA rush of tingling warmth spreads through your body as it digests the fruit.  You can feel your blood pumping through your extremities, making them feel sensitive and surprisingly sensual.  It's going to be hard to resist getting ");
					if (player.lust100 > 60) outputText("even more ");
					outputText("turned on.");
				}
				dynStats("lib", 1, "sen", .25);
			}
			
			//Sexual changes would go here if I wasn't a tard.
			//Heat
			if (rand(4) === 0 && changes < changeLimit) 
			{
			var  intensified: boolean = player.inHeat;
        
				if (player.goIntoHeat(false)) 
				{
					if (intensified) 
					{
						if (rand(2) === 0) outputText("\n\nThe itch inside your " + player.vaginaDescript(0) + " is growing stronger, and you desperately want to find a nice cock to massage the inside.");
						else outputText("\n\nThe need inside your " + player.vaginaDescript(0) + " grows even stronger.  You desperately need to find a mate to 'scratch your itch' and fill your womb with kittens.  It's difficult NOT to think about a cock slipping inside your moist fuck-tunnel, and at this point you'll have a hard time resisting ANY male who approaches.");
					}
					else 
					{
						outputText("\n\nThe interior of your " + player.vaginaDescript(0) + " clenches tightly, squeezing with reflexive, aching need.  Your skin flushes hot ");
						if (player.hasFur()) outputText("underneath your fur ");
						outputText("as images and fantasies ");
						if (player.cor < 50) outputText("assault ");
						else outputText("fill ");
						outputText(" your mind.  Lithe cat-boys with their perfect, spine-covered cocks line up behind you, and you bend over to present your needy pussy to them.  You tremble with the desire to feel the exotic texture of their soft barbs rubbing your inner walls, smearing your " + player.vaginaDescript(0) + " with their cum as you're impregnated.  Shivering, you recover from the fantasy and pull your fingers from your aroused sex.  <b>It would seem you've gone into heat!</b>");
					}
					changes++;
				}
			}
			
			//Shrink the boobalies down to A for men or C for girls.
			if (changes < changeLimit && rand(4) === 0 && !flags[kFLAGS.HYPER_HAPPY]) {
				temp2 = 0;
				temp3 = 0;
				//Determine if shrinkage is required
				//and set temp2 to threshold
				if (!player.hasVagina() && player.biggestTitSize() > 2) temp2 = 2;
				else if (player.biggestTitSize() > 4) temp2 = 4;
				//IT IS!
				if (temp2 > 0) {
					//temp3 stores how many rows are changed
					temp3 = 0;
					for (var k: number = 0; k < player.breastRows.length; k++) {
						//If this row is over threshhold
						if (player.breastRows[k].breastRating > temp2) {
							//Big change
							if (player.breastRows[k].breastRating > 10) {
								player.breastRows[k].breastRating -= 2 + rand(3);
								if (temp3 === 0) outputText("\n\nThe " + player.breastDescript(0) + " on your chest wobble for a second, then tighten up, losing several cup-sizes in the process!");
								else outputText("  The change moves down to your " + num2Text2(k + 1) + " row of " + player.breastDescript(0) + ". They shrink greatly, losing a couple cup-sizes.");
							}
							//Small change
							else {
								player.breastRows[k].breastRating -= 1;
								if (temp3 === 0) outputText("\n\nAll at once, your sense of gravity shifts.  Your back feels a sense of relief, and it takes you a moment to realize your " + player.breastDescript(k) + " have shrunk!");
								else outputText("  Your " + num2Text2(k + 1) + " row of " + player.breastDescript(k) + " gives a tiny jiggle as it shrinks, losing some off its mass.");
							}
							//Increment changed rows
							temp3++;
						}
					}
				}
				//Count that tits were shrunk
				if (temp3 > 0) changes++;
			}
			//Cat dangly-doo.
			if (player.cockTotal() > 0 && player.countCocksOfType(CockTypesEnum.CAT) < player.cockTotal() && (player.ears.type === Ears.CAT || rand(3) > 0) && (player.tail.type === Tail.CAT || rand(3) > 0) && changes < changeLimit && rand(4) === 0) {
				//loop through and find a non-cat wang.
				for (var i: number = 0; i < (player.cockTotal()) && player.cocks[i].cockType === CockTypesEnum.CAT; i++) { }
				outputText("\n\nYour " + player.cockDescript(i) + " swells up with near-painful arousal and begins to transform.  It turns pink and begins to narrow until the tip is barely wide enough to accommodate your urethra.  Barbs begin to sprout from its flesh, if you can call the small, fleshy nubs barbs. They start out thick around the base of your " + Appearance.cockNoun(CockTypesEnum.HUMAN) + " and shrink towards the tip. The smallest are barely visible. <b>Your new feline dong throbs powerfully</b> and spurts a few droplets of cum.  ");
				if (!player.hasSheath()) {
					outputText("Then, it begins to shrink and sucks itself inside your body.  Within a few moments, a fleshy sheath is formed.");
					if (player.balls > 0) outputText("  Thankfully, your balls appear untouched.");
				}
				else outputText("Then, it disappears back into your sheath.");
				player.cocks[i].cockType = CockTypesEnum.CAT;
				changes++;
			}
			//Cat penorz shrink
			if (player.countCocksOfType(CockTypesEnum.CAT) > 0 && rand(3) === 0 && changes < changeLimit && !flags[kFLAGS.HYPER_HAPPY]) {
				//loop through and find a cat wang.
				temp = 0;
				for (var j: number = 0; j < (player.cockTotal()); j++) {
					if (player.cocks[j].cockType === CockTypesEnum.CAT && player.cocks[j].cockLength > 6) {
						temp = 1;
						break;
					}
				}
				if (temp === 1) {
					//lose 33% size until under 10, then lose 2" at a time
					if (player.cocks[j].cockLength > 16) {
						outputText("\n\nYour " + player.cockDescript(j) + " tingles, making your sheath feel a little less tight.  It dwindles in size, losing a full third of its length and a bit of girth before the change finally stops.");
						player.cocks[j].cockLength *= .66;
					}
					else if (player.cocks[j].cockLength > 6) {
						outputText("\n\nYour " + player.cockDescript(j) + " tingles and withdraws further into your sheath.  If you had to guess, you'd say you've lost about two inches of total length and perhaps some girth.");
						player.cocks[j].cockLength -= 2;
					}
					if (player.cocks[j].cockLength / 5 < player.cocks[j].cockThickness && player.cocks[j].cockThickness > 1.25) player.cocks[j].cockThickness = player.cocks[j].cockLength / 6;
					//Check for any more!
					temp2 = 0;
					j++;
					for (j; j < player.cocks.length; j++) {
						//Found another cat wang!
						if (player.cocks[j].cockType === CockTypesEnum.CAT) {
							//Long enough - change it
							if (player.cocks[j].cockLength > 6) {
								if (player.cocks[j].cockLength > 16)
									player.cocks[j].cockLength *= .66;
								else if (player.cocks[j].cockLength > 6)
									player.cocks[j].cockLength -= 2;
								//Thickness adjustments
								if (player.cocks[j].cockLength / 5 < player.cocks[j].cockThickness && player.cocks[j].cockThickness > 1.25) player.cocks[j].cockThickness = player.cocks[j].cockLength / 6;
								temp2 = 1;
							}
						}
					}
					//(big sensitivity boost)
					outputText("  Although the package is smaller, it feels even more sensitive – as if it retained all sensation of its larger size in its smaller form.");
					dynStats("sen", 5);
					//Make note of other dicks changing
					if (temp2 === 1) outputText("  Upon further inspection, all your " + Appearance.cockNoun(CockTypesEnum.CAT) + "s have shrunk!");
					changes++;
				}
			}
			//Neck restore
			if (player.neck.type != Neck.NORMAL && changes < changeLimit && rand(4) == 0) mutations.restoreNeck(tfSource);
			//Rear body restore
			if (player.hasNonSharkRearBody() && changes < changeLimit && rand(5) == 0) mutations.restoreRearBody(tfSource);
			//Ovi perk loss
			if (rand(5) === 0) {
				mutations.updateOvipositionPerk(tfSource);
			}
			//Body type changes.  Teh rarest of the rare.
			// Catgirl-face -> cat-morph-face
			if (player.face.type === Face.CATGIRL &&
				player.tongue.type === Tongue.CAT &&
				player.ears.type === Ears.CAT &&
				player.tail.type === Tail.CAT &&
				player.lowerBody.type === LowerBody.CAT &&
				player.arms.type === Arms.CAT &&
				(player.hasFur() || (player.hasReptileScales() && player.dragonneScore() >= 4)) &&
				rand(5) === 0 && changes < changeLimit
			) {
				outputText("\n\nMind-numbing pain courses through you as you feel your facial bones rearranging."
				          +" You clutch at your face in agony as your skin crawls and shifts, your visage reshaping to replace your facial"
				          +" characteristics with those of a feline along with a muzzle, a cute cat-nose and whiskers.");
				outputText("\n<b>You now have a cat-face.</b>");
				player.face.type = Face.CAT;
				changes++;
			}
			//DA EARZ
			if (player.ears.type !== Ears.CAT && rand(5) === 0 && changes < changeLimit) {
				//human to cat:
				if (player.ears.type === Ears.HUMAN) {
					if (rand(2) === 0) outputText("\n\nThe skin on the sides of your face stretches painfully as your ears migrate upwards, towards the top of your head. They shift and elongate a little, fur growing on them as they become feline in nature. <b>You now have cat ears.</b>");
					else outputText("\n\nYour ears begin to tingle. You reach up with one hand and gently rub them. They appear to be growing fur. Within a few moments, they've migrated up to the top of your head and increased in size. The tingling stops and you find yourself hearing noises in a whole new way. <b>You now have cat ears.</b>");
				}
				//non human to cat:
				else {
					if (rand(2) === 0) outputText("\n\nYour ears change shape, morphing into pointed, feline ears!  They swivel about reflexively as you adjust to them.  <b>You now have cat ears.</b>");
					else outputText("\n\nYour ears tingle and begin to change shape. Within a few moments, they've become long and feline.  Thanks to the new fuzzy organs, you find yourself able to hear things that eluded your notice up until now. <b>You now have cat ears.</b>");
				}
				player.ears.type = Ears.CAT;
				changes++;
			}
			//DA TAIL (IF ALREADY HAZ URZ)
			if (player.tail.type !== Tail.CAT && player.ears.type === Ears.CAT && rand(5) === 0 && changes < changeLimit) {
				if (player.tail.type === Tail.NONE) {
					temp = rand(3);
					if (temp === 0) outputText("\n\nA pressure builds in your backside. You feel under your " + player.armorName + " and discover an odd bump that seems to be growing larger by the moment. In seconds it passes between your fingers, bursts out the back of your clothes and grows most of the way to the ground. A thick coat of fur springs up to cover your new tail. You instinctively keep adjusting it to improve your balance. <b>You now have a cat-tail.</b>");
					if (temp === 1) outputText("\n\nYou feel your backside shift and change, flesh molding and displacing into a long, flexible tail! <b>You now have a cat tail.</b>");
					if (temp === 2) outputText("\n\nYou feel an odd tingling in your spine and your tail bone starts to throb and then swell. Within a few moments it begins to grow, adding new bones to your spine. Before you know it, you have a tail. Just before you think it's over, the tail begins to sprout soft, glossy " + player.skin.furColor + " fur. <b>You now have a cat tail.</b>");
				}
				else outputText("\n\nYou pause and tilt your head... something feels different.  Ah, that's what it is; you turn around and look down at your tail as it starts to change shape, narrowing and sprouting glossy fur. <b>You now have a cat tail.</b>");
				player.tail.type = Tail.CAT;
				changes++;
			}
			//Da paws (if already haz ears & tail)
			if (player.tail.type === Tail.CAT && player.ears.type === Ears.CAT && rand(5) === 0 && changes < changeLimit && player.lowerBody.type !== LowerBody.CAT) {
				//hoof to cat:
				if (player.lowerBody.type === LowerBody.HOOFED) {
					outputText("\n\nYou feel your hooves suddenly splinter, growing into five unique digits. Their flesh softens as your hooves reshape into furred cat paws. <b>You now have cat paws.</b>");
					if (player.isTaur()) outputText("  You feel woozy and collapse on your side.  When you wake, you're no longer a centaur and your body has returned to a humanoid shape.");
				}
				//Goo to cat
				else if (player.lowerBody.type === LowerBody.GOO) {
					outputText("\n\nYour lower body rushes inward, molding into two leg-like shapes that gradually stiffen up.  In moments they solidify into digitigrade legs, complete with soft, padded cat-paws.  <b>You now have cat-paws!</b>");
				}
				//non hoof to cat:
				else outputText("\n\nYou scream in agony as you feel the bones in your " + player.feet() + " break and begin to rearrange. When the pain fades, you feel surprisingly well-balanced. <b>You now have cat paws.</b>");
				player.lowerBody.type = LowerBody.CAT;
				player.lowerBody.legCount = 2;
				changes++;
			}
			//TURN INTO A FURRAH!  OH SHIT
			if (player.tail.type === Tail.CAT && player.ears.type === Ears.CAT && rand(5) === 0 && changes < changeLimit && player.lowerBody.type === LowerBody.CAT && !player.hasFur()) {
				outputText("\n\nYour " + player.skin.desc + " begins to tingle, then itch. ");
				player.skin.type = Skin.FUR;
				player.skin.desc = "fur";
				player.setFurColor(ColorLists.CAT_FUR, {type: UnderBody.FURRY}, true);
				outputText("You reach down to scratch your arm absent-mindedly and pull your fingers away to find strands of " + player.skin.furColor + " fur. Wait, fur?  What just happened?! You spend a moment examining yourself and discover that <b>you are now covered in glossy, soft fur.</b>");
				changes++;
			}
			// Fix old cat faces without cat-eyes.
			if (player.hasCatFace() && !player.hasCatEyes() && rand(3) === 0 && changes < changeLimit) {
				outputText("\n\nFor a moment your sight shifts as the ambient light suddenly turns extremely bright, almost blinding you."
				          +" You walk around disoriented until the luminosity fades back to normal."
				          +" You run to a puddle of water to check your reflection and quickly notice your pupils have become cat-like.");
				outputText("\n<b>You now have cat-eyes!</b>");
				player.eyes.setType(Eyes.CAT);
				changes++;
			}
			//CAT-FACE!  FULL ON FURRY!  RAGE AWAY NEKOZ
			if (player.tail.type === Tail.CAT && player.ears.type === Ears.CAT && player.lowerBody.type === LowerBody.CAT && !player.hasCatFace() && rand(5) === 0 && changes < changeLimit) {
				//Gain cat face, replace old face
				outputText("\n\nYou feel your canines changing, elongating into sharp dagger-like teeth capable of causing severe injuries."
				          +" Funnily, your face remained relatively human even after the change. You purr at the change, giving you a cute look."
				          +"[if (hasCatEyes == false)\nFor a moment your sight shifts as the ambient light suddenly turns extremely bright,"
				          +" almost blinding you. You walk around disoriented until the luminosity fades back to normal."
				          +" You run to a puddle of water to check your reflection and quickly notice your pupils have become cat-like.]");
				outputText("\n<b>You now have the face of a cat-" + player.mf("boy", "girl") + "!</b>");
				player.face.setType(Face.CATGIRL);
				changes++;
			}
			// Cat-tongue
			if (player.hasCatFace() && player.tongue.type !== Tongue.CAT && rand(5) === 0 && changes < changeLimit) {
				outputText("\n\nYour tongue suddenly feel weird. You try to stick it out to see whats going on and discover it changed to look"
				          +" similar to the tongue of a cat. At least you will be able to groom yourself properly with <b>your new cat tongue</b>.");
				player.tongue.type = Tongue.CAT;
				changes++;
			}
			//Arms
			if (player.arms.type !== Arms.CAT && player.isFurry() && player.tail.type === Tail.CAT && player.lowerBody.type === LowerBody.CAT && rand(4) === 0 && changes < changeLimit)
			{
				outputText("\n\nWeakness overcomes your arms, and no matter what you do, you can’t muster the strength to raise or move them."
				          +" Did the fruit have some drug-like effects? Sitting on the ground, you wait for the limpness to end."
				          +" As you do so, you realize that the bones at your hands are changing, as well as the muscles on your arms."
				          +" They’re soon covered, from the shoulders to the tip of your digits, on a layer of soft,"
				          +" fluffy [if (hasFurryUnderBody)[underBody.furColor]|[furColor]] fur. Your hands gain pink,"
				          +" padded paws where your palms were once, and your nails become long, thin, curved claws,"
				          +" sharp enough to tear flesh and nimble enough to make climbing and exploring easier."
				          +" <b>Your arms have become like those of a cat!</b>");
				player.arms.setType(Arms.CAT);
				changes++;
			}
			// Remove gills
			if (rand(4) === 0 && player.hasGills() && changes < changeLimit) {
				mutations.updateGills();
			}
			//FAILSAFE CHANGE
			if (changes === 0) {
				outputText("\n\nInhuman vitality spreads through your body, invigorating you!\n");
				player.HPChange(50, true);
				dynStats("lus", 3);
			}
			if (changes < changeLimit) {
				if (rand(2) === 0) outputText(player.modThickness(5, 2));
				if (rand(2) === 0) outputText(player.modTone(76, 2));
				if (player.gender < 2) if (rand(2) === 0) outputText(player.modFem(65, 1));
				else outputText(player.modFem(85, 2));
			}
			player.refillHunger(20);
			flags[kFLAGS.TIMES_TRANSFORMED] += changes;
			
			return false;
		}
	}

