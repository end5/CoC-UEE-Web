	
	/**
	 * Minotaur transformative item.
	 */
	export class MinotaurBlood extends Consumable 
	{
		public  MinotaurBlood() 
		{
			super("MinoBlo","MinoBlo", "a vial of Minotaur blood", ConsumableLib.DEFAULT_VALUE, "You've got a scratched up looking vial full of bright red minotaur blood.  Any time you move it around it seems to froth up, as if eager to escape.");
		}
		
		public  useItem(): boolean
		{
		var  tfSource: string = "minotaurBlood";
			player.slimeFeed();
			mutations.initTransformation([2, 3, 3], 1, 2);
			//Temporary storage
		var  temp: number = 0;
		var  temp2: number = 0;
		var  temp3: number = 0;
			//Set up output
			clearOutput();
			outputText("You drink the bubbling red fluid, tasting the tangy iron after-taste.");
			//STATS
			//Strength h
			if (rand(3) === 0 && changes < changeLimit) {
				//weaker characters gain more
				if (player.str100 <= 50) {
					outputText("\n\nPainful aches ripple through your body, flooding you with pain as your muscles flex and bulge, growing much stronger and more well-defined.");
					//very weak players gain more
					if (player.str100 <= 20) dynStats("str", 3);
					else dynStats("str", 2);
				}
				//stronger characters gain less
				else {
					//small growth if over 75
					if (player.str100 >= 75) dynStats("str", .5);
					//faster from 50-75
					else dynStats("str", 1);
					outputText("\n\nYour muscles grow tighter, bulging outwards powerfully as you get even stronger!");
				}
				//Chance of speed drop
				if (rand(2) === 0 && player.str100 > 50) {
					outputText("\n\nYou begin to feel that the size of your muscles is starting to slow you down.");
					dynStats("spe", -1);
				}
			}
			//Toughness (chance of - sensitivity)
			if (rand(3) === 0 && changes < changeLimit) {
				//weaker characters gain more
				if (player.tou100 <= 50) {
					outputText("\n\nYour hide... skin... whatever... you can feel it getting tougher as it thickens perceptibly.");
					//very weak players gain more
					if (player.tou100 <= 20) dynStats("tou", 3);
					else dynStats("tou", 2);
				}
				//stronger characters gain less
				else {
					//small growth if over 75
					if (player.tou100 >= 75) dynStats("tou", .5);
					//faster from 50-75
					else dynStats("tou", 1);
					outputText("\n\nYour tough hide grows slightly thicker.");
				}
				//chance of less sensitivity
				if (rand(2) === 0 && player.sens100 > 10) {
					if (player.tou100 > 75) {
						outputText("\n\nIt becomes much harder to feel anything through your leathery skin.");
						dynStats("sen", -3);
					}
					if (player.tou100 <= 75 && player.tou100 > 50) {
						outputText("\n\nThe level of sensation from your skin diminishes noticeably.");
						dynStats("sen", -2);
					}
					if (player.tou100 <= 50) {
						outputText("\n\nYour sense of touch diminishes due to your tougher hide.");
						dynStats("sen", -3);
					}
				}
			}
			//SEXUAL
			//Boosts ball size MORE than equinum :D:D:D:D:D:D:
			if (changes < changeLimit && rand(2) === 0 && player.ballSize <= 5 && player.countCocksOfType(CockTypesEnum.HORSE) > 0) {
				//Chance of ball growth if not 3" yet
				if (player.balls === 0) {
					player.balls = 2;
					player.ballSize = 1;
					outputText("\n\nA nauseating pressure forms just under the base of your maleness.  With agonizing pain the flesh bulges and distends, pushing out a rounded lump of flesh that you recognize as a testicle!  A moment later relief overwhelms you as the second drops into your newly formed sack.");
					dynStats("lib", 2, "lus", 5);
				}
				else {
					player.ballSize++;
					if (player.ballSize <= 2) outputText("\n\nA flash of warmth passes through you and a sudden weight develops in your groin.  You pause to examine the changes and your roving fingers discover your " + player.simpleBallsDescript() + " have grown larger than a human's.");
					if (player.ballSize > 2) outputText("\n\nA sudden onset of heat envelops your groin, focusing on your " + player.sackDescript() + ".  Walking becomes difficult as you discover your " + player.simpleBallsDescript() + " have enlarged again.");
					dynStats("lib", 1, "lus", 3);
				}
				changes++;
			}
			//Neck restore
			if (player.neck.type != Neck.NORMAL && changes < changeLimit && rand(4) == 0) mutations.restoreNeck(tfSource);
			//Rear body restore
			if (player.hasNonSharkRearBody() && changes < changeLimit && rand(5) == 0) mutations.restoreRearBody(tfSource);
			//Ovi perk loss
			if (rand(5) === 0) {
				mutations.updateOvipositionPerk(tfSource);
			}
			//Restore arms to become human arms again
			if (rand(4) === 0) {
				mutations.restoreArms(tfSource);
			}
			//+hooves
			if (player.lowerBody.type !== LowerBody.HOOFED) {
				if (changes < changeLimit && rand(3) === 0) {
					if (player.lowerBody.type === LowerBody.HUMAN) outputText("\n\nYou stagger as your feet change, curling up into painful angry lumps of flesh.  They get tighter and tighter, harder and harder, until at last they solidify into hooves!");
					else if (player.lowerBody.type === LowerBody.DOG) outputText("\n\nYou stagger as your paws change, curling up into painful angry lumps of flesh.  They get tighter and tighter, harder and harder, until at last they solidify into hooves!");
					else if (player.lowerBody.type === LowerBody.NAGA) outputText("\n\nYou collapse as your sinuous snake-tail tears in half, shifting into legs.  The pain is immense, particularly in your new feet as they curl inward and transform into hooves!");
					//Catch-all
					else if (player.lowerBody.type > LowerBody.NAGA) outputText("\n\nYou stagger as your " + player.feet() + " change, curling up into painful angry lumps of flesh.  They get tighter and tighter, harder and harder, until at last they solidify into hooves!");
					else if (!player.hasFur()) outputText("  A fine coat of fur grows out below your waist, itching briefly as it fills in.");
					outputText("<b>  You now have hooves in place of your feet!</b>");
					player.lowerBody.type = LowerBody.HOOFED;
					player.lowerBody.legCount = 2;
					dynStats("spe", 1);
					changes++;
				}
			}
			if (!flags[kFLAGS.HYPER_HAPPY])
			{
				//Kills vagina size (and eventually the whole vagina)
				if (player.vaginas.length > 0) {
					if (player.vaginas[0].vaginalLooseness > Vagina.LOOSENESS_TIGHT) {
						//tighten that bitch up!
						outputText("\n\nYour " + player.vaginaDescript(0) + " clenches up painfully as it tightens up, becoming smaller and tighter.");
						player.vaginas[0].vaginalLooseness--;
					}
					else {
						outputText("\n\nA tightness in your groin is the only warning you get before your <b>" + player.vaginaDescript(0) + " disappears forever</b>!");
						if (player.cocks.length === 0) {
							outputText("  Strangely, your clit seems to have resisted the change, and is growing larger by the moment... shifting into the shape of a small ribbed minotaur-like penis!  <b>You now have a horse-cock!</b>");
							player.createCock();
							player.cocks[0].cockLength = player.getClitLength() + 2;
							player.cocks[0].cockThickness = 1;
							player.cocks[0].cockType = CockTypesEnum.HORSE;
							player.setClitLength(.25);
						}
						//Goodbye womanhood!
						player.removeVagina(0, 1);

					}
					changes++;
				}
				//-Remove extra breast rows
				if (changes < changeLimit && player.bRows() > 1 && rand(3) === 0) {
					mutations.removeExtraBreastRow(tfSource);
				}
				//Shrink boobages till they are normal
				else if (rand(2) === 0 && changes < changeLimit && player.breastRows.length > 0) {
					//Single row
					if (player.breastRows.length === 1) {
						//Shrink if bigger than B cups
						if (player.breastRows[0].breastRating >= 1) {
							temp = 1;
							player.breastRows[0].breastRating--;
							//Shrink again if huuuuge
							if (player.breastRows[0].breastRating > 8) {
								temp++;
								player.breastRows[0].breastRating--;
							}
							//Talk about shrinkage
							if (temp === 1) outputText("\n\nYou feel a weight lifted from you, and realize your " + player.breastDescript(0) + " have shrunk to " + player.breastCup(0) + "s.");
							if (temp === 2) outputText("\n\nYou feel significantly lighter.  Looking down, you realize your breasts are MUCH smaller, down to " + player.breastCup(0) + "s.");
							changes++;
						}

					}
					//multiple
					else {
						//temp2 = amount changed
						//temp3 = counter
						temp = 0;
						temp2 = 0;
						temp3 = 0;
						if (player.biggestTitSize() >= 1) outputText("\n");
						while (temp3 < player.breastRows.length) {
							if (player.breastRows[temp3].breastRating >= 1) {
								player.breastRows[temp3].breastRating--;
								temp2++;
								outputText("\n");
								//If this isn't the first change...
								if (temp2 > 1) outputText("...and y");
								else outputText("Y");
								outputText("our " + player.breastDescript(temp3) + " shrink, dropping to " + player.breastCup(temp3) + "s.");
							}
							temp3++;
						}
						if (temp2 === 2) outputText("\nYou feel so much lighter after the change.");
						if (temp2 === 3) outputText("\nWithout the extra weight you feel particularly limber.");
						if (temp2 >= 4) outputText("\nIt feels as if the weight of the world has been lifted from your shoulders, or in this case, your chest.");
						if (temp2 > 0) changes++;
					}
				}
			}
			//Boosts cock size up to 36"x5".
			if (changes < changeLimit && rand(2) === 0 && player.cocks.length > 0) {
			var  selectedCock: number = -1;
				for (var i: number = 0; i < player.cocks.length; i++)
				{
					if (player.cocks[i].cockType === CockTypesEnum.HORSE && (player.cocks[i].cockLength < 36 || player.cocks[i].cockThickness < 5))
					{
						selectedCock = i;
						break;
					}
				}
				
				//Length first
				if (selectedCock !== -1) {
					//Thickness too if small enough
					if (player.cocks[selectedCock].cockThickness < 5) {
						//Increase by 2 + rand(8), and store the actual amount in temp
						temp = player.increaseCock(selectedCock, 2 + rand(8));
						temp += player.cocks[selectedCock].thickenCock(1);
						//Comment on length changes
						if (temp > 6) outputText("\n\nGasping in sudden pleasure, your " + player.cockDescript(selectedCock) + " surges free of its sheath, emerging with over half a foot of new dick-flesh.");
						if (temp <= 6 && temp >= 3) outputText("\n\nYou pant in delight as a few inches of " + player.cockDescript(selectedCock) + " pop free from your sheath, the thick new horse-flesh still slick and sensitive.");
						if (temp < 3) outputText("\n\nGroaning softly, you feel a pleasurable change in your groin.  Looking down, you see [oneCock] grow slightly longer.");
						//Add a blurb about thickness...
						outputText("  To your delight and surprise, you discover it has grown slightly thicker as well!");
					}
					//Just length...
					else {
						//Increase by 2 + rand(8), and store the actual amount in temp
						temp = player.increaseCock(selectedCock, 2 + rand(8));
						//Comment on length changes
						if (temp > 6) outputText("\n\nGasping in sudden pleasure, your " + player.cockDescript(selectedCock) + " surges free of its sheath, emerging with over half a foot of new dick-flesh.");
						if (temp <= 6 && temp >= 3) outputText("\n\nYou pant in delight as a few inches of " + player.cockDescript(selectedCock) + " pop free from your sheath, the thick new horse-flesh still slick and sensitive.");
						if (temp < 3) outputText("\n\nGroaning softly, you feel a pleasurable change in your groin.  Looking down, you see [oneCock] grow slightly longer.");
					}
					changes++;
				}
			}
			//Morph dick to horsediiiiick
			if (player.cocks.length > 0 && rand(2) === 0 && changes < changeLimit) {
			var  selectedCockValue: number = -1; //Changed as selectedCock and i caused duplicate var warnings
				for (var indexI: number = 0; indexI < player.cocks.length; indexI++)
				{
					if (player.cocks[indexI].cockType !== CockTypesEnum.HORSE)
					{
						selectedCockValue = indexI;
						break;
					}
				}
				
				if (selectedCockValue !== -1) {
					//Text for humandicks or others
					if (player.cocks[selectedCockValue].cockType === CockTypesEnum.HUMAN || player.cocks[selectedCockValue].cockType.Index > 2) outputText("\n\nYour " + player.cockDescript(selectedCockValue) + " begins to feel strange... you pull down your pants to take a look and see it darkening as you feel a tightness near the base where your skin seems to be bunching up.  A sheath begins forming around your cock's base, tightening and pulling your cock inside its depths.  A hot feeling envelops your member as it suddenly grows into a horse penis, dwarfing its old size.  The skin is mottled brown and black and feels more sensitive than normal.  Your hands are irresistibly drawn to it, and you jerk yourself off, splattering cum with intense force.");
					//Text for dogdicks
					if (player.cocks[selectedCockValue].cockType === CockTypesEnum.DOG) outputText("\n\nYour " + Appearance.cockNoun(CockTypesEnum.DOG) + " begins to feel odd...  You pull down your clothes to take a look and see it darkening.  You feel a growing tightness in the tip of your " + Appearance.cockNoun(CockTypesEnum.DOG) + " as it flattens, flaring outwards.  Your cock pushes out of your sheath, inch after inch of animal-flesh growing beyond its traditional size.  You notice your knot vanishing, the extra flesh pushing more fresh horsecock out from your sheath.  <b>Your hands are drawn to the strange new " + Appearance.cockNoun(CockTypesEnum.HORSE) + "</b>, and you jerk yourself off, splattering thick ropes of cum with intense force.");
					player.cocks[selectedCockValue].cockType = CockTypesEnum.HORSE;
					player.increaseCock(selectedCockValue, 4);
					dynStats("lib", 5, "sen", 4, "lus", 35);
					outputText("<b>  You now have a");
					if (player.countCocksOfType(CockTypesEnum.HORSE) > 1) outputText("nother")
					outputText(" horse-penis.</b>");
					changes++;
				}
			}
			
			//Males go into rut
			if (rand(4) === 0) {
				player.goIntoRut(true);
			}
			
			//Anti-masturbation status
			if (rand(4) === 0 && changes < changeLimit && !player.hasStatusEffect(StatusEffects.Dysfunction)) {
				if (player.cocks.length > 0) outputText("\n\nYour " + player.cockDescript(0) + " tingles abruptly, then stops.  Worried, you reach down to check it, only to discover that it feels... numb.  It will be very hard to masturbate like this.");
				else if (player.hasVagina()) outputText("\n\nYour " + player.vaginaDescript(0) + " tingles abruptly, then stops.  Worried, you reach down to check it, only to discover that it feels... numb.  It will be very hard to masturbate like this.");
				if (player.cocks.length > 0 || player.hasVagina()) {
					player.createStatusEffect(StatusEffects.Dysfunction, 96, 0, 0, 0);
					changes++;
				}
			}
			//Appearance shit:
			//Tail, Ears, Hooves, Horns, Height (no prereq), Face
			//+height up to 9 foot
			if (changes < changeLimit && rand(1.7) === 0 && player.tallness < 108) {
				temp = rand(5) + 3;
				//Slow rate of growth near ceiling
				if (player.tallness > 90) temp = Math.floor(temp / 2);
				//Never 0
				if (temp === 0) temp = 1;
				//Flavor texts.  Flavored like 1950's cigarettes. Yum.
				if (temp < 5) outputText("\n\nYou shift uncomfortably as you realize you feel off balance.  Gazing down, you realize you have grown SLIGHTLY taller.");
				if (temp >= 5 && temp < 7) outputText("\n\nYou feel dizzy and slightly off, but quickly realize it's due to a sudden increase in height.");
				if (temp === 7) outputText("\n\nStaggering forwards, you clutch at your head dizzily.  You spend a moment getting your balance, and stand up, feeling noticeably taller.");
				player.tallness += temp;
				changes++;
			}
			//Face change, requires Ears + Height + Hooves
			if (player.ears.type === Ears.COW && player.lowerBody.type === LowerBody.HOOFED && player.tallness >= 90
					&& changes < changeLimit && rand(3) === 0) {
				if (player.face.type !== Face.COW_MINOTAUR) {
					outputText("\n\nBones shift and twist painfully as your visage twists and morphs to resemble that of the beast whose blood you now drink.  <b>You now have a minotaur-like face.</b>");
					changes++;
					player.face.type = Face.COW_MINOTAUR;
				}
			}
			//+mino horns require ears/tail
			if (changes < changeLimit && rand(3) === 0 && player.ears.type === Ears.COW && player.tail.type === Tail.COW) {
				temp = 1;
				//New horns or expanding mino horns
				if (player.horns.type === Horns.COW_MINOTAUR || player.horns.type === Horns.NONE) {
					//Get bigger if player has horns
					if (player.horns.type === Horns.COW_MINOTAUR) {
						//Fems horns don't get bigger.
						if (player.vaginas.length > 0) {
							if (player.horns.value > 4) {
								outputText("\n\nYou feel a pressure in your head around your horns, but they don't grow any larger.  ");
								outputText("Your headache clears as lust washes through you unnaturally.  You feel as if you haven't cum in months.");
								player.hoursSinceCum += 200;
								dynStats("lus", 20);
							}
							else {
								outputText("\n\nYour small horns get a bit bigger, stopping as medium sized nubs.");
								player.horns.value += 3;
							}
							changes++;
						}
						//Males horns get 'uge.
						else {
							temp = 1 + rand(3);
							player.horns.value += temp;
							if (temp === 0) changes--;
							if (temp === 1) outputText("\n\nAn aching pressure builds in your temples as you feel your horns push another inch of length from your skull.  ");
							if (temp === 2) outputText("\n\nA powerful headache momentarily doubles you over.  With painful slowness, you feel your horns push another two inches of length out from your brow, gradually thickening as they grow.  ");
							if (temp === 3) outputText("\n\nAgony overwhelms you as a headache of terrifying intensity sweeps through your skull.  You squeeze your eyes shut from the pain, but it does little to help.  The torture intensifies before finally diminishing as you feel an inch or two of new horn force its way out of your forehead.  The headache remains despite this, and desperate for relief, you grab hold of your horns and tug, pulling another inch of new horn free.  At last the pain fades, leaving you with significantly enhanced head-spikes.  ");
							if (player.horns.value < 3) outputText("They are the size of tiny nubs.");
							if (player.horns.value >= 3 && player.horns.value < 6) outputText("They are similar to what you would see on a young bull.");
							if (player.horns.value >= 6 && player.horns.value < 12) outputText("They look like the horns on a grown bull, big enough and dangerous enough to do some damage.");
							if (player.horns.value >= 12 && player.horns.value < 20) outputText("They are large and wicked looking.");
							if (player.horns.value >= 20) outputText("They are huge, heavy, and tipped with dangerous points.");
							//boys get a cum refill sometimes
							if (rand(2) === 0 && changes < changeLimit) {
								outputText("  Your headache clears as lust washes through you unnaturally.  You feel as if you haven't cum in months.");
								player.hoursSinceCum += 200;
								dynStats("lus", 20);
							}
							changes++;
						}
					}
					//If no horns yet..
					else {
						outputText("\n\nWith painful pressure, the skin on your forehead splits around two tiny nub-like horns, similar to those you would see on the cattle back in your homeland.");
						player.horns.type = Horns.COW_MINOTAUR;
						player.horns.value = 2;
						changes++;
					}
				}
				//Not mino horns, change to cow-horns
				if (player.horns.type === Horns.DEMON || player.horns.type > Horns.COW_MINOTAUR) {
					outputText("\n\nYour horns vibrate and shift as if made of clay, reforming into two horns with a bovine-like shape.");
					player.horns.type = Horns.COW_MINOTAUR;
					changes++;
				}
			}
			//+cow ears	- requires tail
			if (player.ears.type !== Ears.COW && changes < changeLimit && player.tail.type === Tail.COW && rand(2) === 0) {
				outputText("\n\nYou feel your ears tug on your scalp as they twist shape, becoming oblong and cow-like.  <b>You now have cow ears.</b>");
				player.ears.type = Ears.COW;
				changes++;
			}
			//+cow tail
			if (changes < changeLimit && rand(2) === 0 && player.tail.type !== Tail.COW) {
				if (player.tail.type === Tail.NONE) outputText("\n\nYou feel the flesh above your " + player.buttDescript() + " knotting and growing.  It twists and writhes around itself before flopping straight down, now shaped into a distinctly bovine form.  You have a <b>cow tail</b>.");
				else {
					if (player.tail.type < Tail.SPIDER_ABDOMEN || player.tail.type > Tail.BEE_ABDOMEN) {
						outputText("\n\nYour tail bunches uncomfortably, twisting and writhing around itself before flopping straight down, now shaped into a distinctly bovine form.  You have a <b>cow tail</b>.");
					}
					//insect
					if (player.tail.type === Tail.SPIDER_ABDOMEN || player.tail.type === Tail.BEE_ABDOMEN) {
						outputText("\n\nYour insect-like abdomen tingles pleasantly as it begins shrinking and softening, chitin morphing and reshaping until it looks exactly like a <b>cow tail</b>.");
					}
				}
				player.tail.type = Tail.COW;
				changes++;
			}
			// Remove gills
			if (rand(4) === 0 && player.hasGills() && changes < changeLimit) {
				mutations.updateGills();
			}

			if (changes < changeLimit && rand(4) === 0 && ((player.ass.analWetness > 0 && player.findPerk(PerkLib.MaraesGiftButtslut) < 0) || player.ass.analWetness > 1)) {
				outputText("\n\nYou feel a tightening up in your colon and your [asshole] sucks into itself.  You feel sharp pain at first but that thankfully fades.  Your ass seems to have dried and tightened up.");
				player.ass.analWetness--;
				if (player.ass.analLooseness > 1) player.ass.analLooseness--;
				changes++;
			}
			//Give you that mino build!
			if (rand(4) === 0) outputText(player.modFem(5, 10));
			if (rand(4) === 0) outputText(player.modTone(85, 3));
			if (rand(4) === 0) outputText(player.modThickness(70, 4));
			//Default
			if (changes === 0) {
				outputText("\n\nMinotaur-like vitality surges through your body, invigorating and arousing you!\n");
				if (player.balls > 0) {
					outputText("Your balls feel as if they've grown heavier with the weight of more sperm.\n");
					player.hoursSinceCum += 200;
				}
				player.HPChange(50, true);
				dynStats("lus", 50);
			}
			player.refillHunger(25);
			game.flags[kFLAGS.TIMES_TRANSFORMED] += changes;
			return false;
		}
	}

