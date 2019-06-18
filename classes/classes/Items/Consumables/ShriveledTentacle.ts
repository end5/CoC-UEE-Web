	
	/**
	 * Tentacle transformative item.
	 */
	export class ShriveledTentacle extends Consumable 
	{
		public  ShriveledTentacle() 
		{
			super("DryTent","DryTent", "a shriveled tentacle", ConsumableLib.DEFAULT_VALUE, "A dried tentacle from one of the lake anemones.  It's probably edible, but the stingers are still a little active.");
		}
		
		public  useItem(): boolean
		{
		var  tfSource: string = "shriveledTentacle";
		var  temp: number = 0;
			mutations.initTransformation([2, 3]);
			clearOutput();
			outputText("You chew on the rubbery tentacle; its texture and taste are somewhat comparable to squid, but the half-dormant nematocysts cause your mouth to tingle sensitively.");

			//possible use effects:
			//- toughess up, sensitivity down
			if (rand(3) === 0 && player.tou100 < 50 && changes < changeLimit) {
				outputText("\n\nYour skin feels clammy and a little rubbery.  You touch yourself experimentally and notice that you can barely feel the pressure from your fingertips.  Consumed with curiosity, you punch yourself lightly in the arm; the most you feel is a dull throb!");
				dynStats("tou", 1, "sen", -1);
			}
			//- speed down
			if (rand(3) === 0 && player.spe100 > 40 && changes < changeLimit) {
				outputText("\n\nA pinprick sensation radiates from your stomach down to your knees, as though your legs were falling asleep.  Wobbling slightly, you stand up and take a few stumbling steps to work the blood back into them.  The sensation fades, but your grace fails to return and you stumble again.  You'll have to be a little more careful moving around for a while.");
				dynStats("spe", -1);
			}
			//- corruption increases by 1 up to low threshold (~20)
			if (rand(3) === 0 && player.cor < 20 && changes < changeLimit) {
				outputText("\n\nYou shiver, a sudden feeling of cold rushing through your extremities.");
				changes++;
				dynStats("cor", 1);
			}
			//-always increases lust by a function of sensitivity
			//"The tingling of the tentacle

			//Neck restore
			if (player.neck.type != Neck.NORMAL && changes < changeLimit && rand(4) == 0) mutations.restoreNeck(tfSource);
			//Rear body restore
			if (player.hasNonSharkRearBody() && changes < changeLimit && rand(5) == 0) mutations.restoreRearBody(tfSource);
			//Ovi perk loss
			if (rand(5) === 0) {
				mutations.updateOvipositionPerk(tfSource);
			}
			
			//physical changes:
			//- may randomly remove bee abdomen, if present; always checks and does so when any changes to hair might happen
			if (rand(4) === 0 && changes < changeLimit && player.tail.type === Tail.BEE_ABDOMEN) {
				outputText("\n\nAs the gentle tingling of the tentacle's remaining venom spreads through your body, it begins to collect and intensify above the crack of your butt.  Looking back, you notice your abdomen shivering and contracting; with a snap, the chitinous appendage parts smoothly from your backside and falls to the ground.  <b>You no longer have a bee abdomen!</b>\n\n");
				player.tail.type = Tail.NONE;
				changes++;
			}
			//-may randomly remove bee wings:
			if (rand(4) === 0 && (player.wings.type === Wings.BEE_LIKE_SMALL || player.wings.type === Wings.BEE_LIKE_LARGE) && changes < changeLimit) {
				outputText("\n\nYour wings twitch and flap involuntarily.  You crane your neck to look at them as best you are able; from what you can see, they seem to be shriveling and curling up.  They're starting to look a lot like they did when they first popped out, wet and new.  <b>As you watch, they shrivel all the way, then recede back into your body.</b>");
				player.wings.type = Wings.NONE;
				changes++;
			}
			//-hair morphs to anemone tentacles, retains color, hair shrinks back to med-short('shaggy') and stops growing, lengthening treatments don't work and goblins won't cut it, but more anemone items can lengthen it one level at a time
			if (player.gills.type === Gills.ANEMONE && player.hair.type !== 4 && changes < changeLimit && rand(5) === 0) {
				outputText("\n\nYour balance slides way off, and you plop down on the ground as mass concentrates on your head.  Reaching up, you give a little shriek as you feel a disturbingly thick, squirming thing where your hair should be.  Pulling it down in front of your eyes, you notice it's still attached to your head; what's more, it's the same color as your hair used to be.  <b>You now have squirming tentacles in place of hair!</b>  As you gaze at it, a gentle heat starts to suffuse your hand.  The tentacles must be developing their characteristic stingers!  You quickly let go; you'll have to take care to keep them from rubbing on your skin at all hours.  On the other hand, they're quite short and you find you can now flex and extend them as you would any other muscle, so that shouldn't be too hard.  You settle on a daring, windswept look for now.");
				player.hair.type = 4;
				player.hair.length = 5;
				if (flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] === 0) {
					outputText("  <b>(Your hair has stopped growing.)</b>");
					flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] = 1;
				}
				changes++;
				changes++;
				changes++;
				//(reset hair to 'shaggy', add tentacle hair status, stop hair growth)
				//appearance screen: replace 'hair' with 'tentacle-hair'
			}
			
			//-feathery gills sprout from chest and drape sensually over nipples (cumulative swimming power boost with fin, if swimming is implemented)
			if (rand(5) === 0 && player.gills.type !== Gills.ANEMONE && player.skin.tone === "aphotic blue-black" && changes < changeLimit) {
				mutations.updateGills(Gills.ANEMONE);
			}
			
			//-[aphotic] skin tone (blue-black)
			if (rand(5) === 0 && changes < changeLimit && player.skin.tone !== "aphotic blue-black") {
				outputText("\n\nYou absently bite down on the last of the tentacle, then pull your hand away, wincing in pain.  How did you bite your finger so hard?  Looking down, the answer becomes obvious; <b>your hand, along with the rest of your skin, is now the same aphotic color as the dormant tentacle was!</b>");
				player.skin.tone = "aphotic blue-black";
				player.arms.updateClaws(player.arms.claws.type);
				kGAMECLASS.rathazul.addMixologyXP(20);
				changes++;
			}
			//-eat more, grow more 'hair':
			if (player.hair.type === Hair.ANEMONE && player.hair.length < 36 &&
					rand(2) === 0 && changes < changeLimit) {
				temp = 5 + rand(3);
				player.hair.length += temp;
				outputText("\n\nAs you laboriously chew the rubbery dried anemone, your head begins to feel heavier.  Using your newfound control, you snake one of your own tentacles forward; holding it out where you can see it, the first thing you notice is that it appears quite a bit longer.  <b>Your head-tentacles are now " + num2Text(temp) + " inches longer!</b>");
				//(add one level of hairlength)
				changes++;
			}
			player.refillHunger(20);
			flags[kFLAGS.TIMES_TRANSFORMED] += changes;
			
			return false;
		}
	}

