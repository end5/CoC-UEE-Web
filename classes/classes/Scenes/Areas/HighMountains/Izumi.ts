
	export class Izumi extends Monster
	{
		// Set trace outout for this classes' content.
		private  combatDebug: boolean = true;
		
		public  Izumi() 
		{
			this.a = "";
			this.short = "Izumi";
			this.imageName = "izumi";
			this.long = "You're fighting the immense Oni, Izumi.  Standing around 9 feet tall and wielding little more than her fists, she is the picture of strength and power.  She is clad in a scandalous blue and white Kimono, the garment drawing your eyes to her humongous breasts, and her perfectly sculpted thighs.  A curious horn juts from her head, the texture of it almost lost amongst the rock lining the inside of the cave.\n\nA distinctly cocky grin is painted across her face, her undivided attention focused upon you.";
			this.race = "Oni";
			// this.plural = false;
			this.createVagina(false, Vagina.WETNESS_SLICK, Vagina.LOOSENESS_NORMAL);
			createBreastRow(Appearance.breastCupInverse("FF")); // The doc mentions her breasts would be around D/DD on a "normal human" so err, winging this shit
			this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
			this.ass.analWetness = Ass.WETNESS_DRY;
			this.tallness = 9*12+0;
			this.hips.rating = Hips.RATING_AVERAGE;
			this.butt.rating = Butt.RATING_TIGHT;
			this.skin.tone = "creamy-white";
			this.hair.color = "golden";
			this.hair.length = 25;
			initStrTouSpeInte(110, 90, 90, 80);
			initLibSensCor(30, 25, 15);
			this.weaponName = "fist";
			this.weaponVerb="punch";
			this.armorName = "silken kimono";
			this.bonusHP = 660;
			this.lust = 10;
			this.lustVuln = 0.33;
			this.temperment = TEMPERMENT_LOVE_GRAPPLES;
			this.level = 22;
			this.gems = 25 + rand(25);
			this.additionalXP = 75;
			this.drop = NO_DROP;
			checkMonster();
		}

		// Override won/lost calls
		public  defeated(hpVictory: boolean): void
		{
			this.cleanup();
			game.highMountains.izumiScenes.touchThatFluffyHorn();
		}
		
		// Monster won, not player, gg for descriptive method names
		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			flags[kFLAGS.IZUMI_TIMES_LOST_FIGHT]++;
			if (player.hasStatusEffect(StatusEffects.Titsmother))
			{
				this.cleanup();
				game.highMountains.izumiScenes.deathBySnuSnuIMeanGiantOniTits();
				return;
			}
			else
			{
				this.cleanup();
				game.highMountains.izumiScenes.fuckedUpByAFuckhugeOni();
				return;
			}
		}
		
		// Override combat AI
		protected  performCombatAction(): void
		{
			// Handle chokeslam mechanics
			if (player.hasStatusEffect(StatusEffects.Chokeslam))
			{
				//if (combatDebug) trace("ChokeSlam Rounds to Damage: " + player.statusEffectv1(StatusEffects.Chokeslam));
				
				player.addStatusValue(StatusEffects.Chokeslam,1,-1);
				
				if (player.statusEffectv1(StatusEffects.Chokeslam) <= 0)
				{
					chokeSlamDamage();
					cleanupChokeslam();
				}
				
				combatRoundOver();
				return;
			}
			
			// Handle groundpound
			if (player.hasStatusEffect(StatusEffects.Groundpound))
			{
				player.addStatusValue(StatusEffects.Groundpound,1,-1);
				
				if (player.statusEffectv1(StatusEffects.Groundpound) <= 0)
				{
					cleanupGroundpound();
				}
			}
			
			// Handle titsmother
			if (player.hasStatusEffect(StatusEffects.Titsmother))
			{
				combatRoundOver();
				return;
			}
			
			// Titsmother toggle; gonna need to play with this, it should only be used once per fight
			if ((this.HPRatio() <= 0.25) && !(hasStatusEffect(StatusEffects.UsedTitsmother)))
			{
				//if (combatDebug) trace("Using Titsmother!");
				titSmother();
				this.createStatusEffect(StatusEffects.UsedTitsmother, 0, 0, 0, 0);
				return;
			}
			else
			{
			var  actions: any[] = [straightJab, straightJab, straightJab, roundhouseKick, roundhouseKick, roundhouseKick, chokeSlam]; 
				
				if (!player.hasStatusEffect(StatusEffects.Groundpound))
				{
					actions.push(groundPound);
					actions.push(groundPound);
				}
				
				actions[rand(actions.length)]();
			}
		}
		
		// Remove any lingering effects from the player once combat is over
		public  cleanup(): void
		{
			//if (combatDebug) trace("Cleaning up lingering effects...");
			
			cleanupChokeslam();
			cleanupGroundpound();
			cleanupTitsmother();
		}
		
		// Quick punch at the player
		// Light damage
		public  straightJab(): void
		{
			outputText("Quick as a flash, Izumi lashes out with her free hand, aiming for your head.");

		var  damage: number = int((str + 175) - rand(player.tou) - player.armorDef);
			if (player.getEvasionRoll())
			{
				outputText("  You deftly dodge under the lightning-quick punch.");
			}
			else if (damage <= 0)
			{
				outputText("  You lash out and manage to deflect the blow before it can connect.");
			}
			else
			{
				outputText("  Her fist connects with your chin with a mighty crack, sending you sailing across the cave.  Izumi smirks at you as you");
				if (player.isNaga()) outputText(" raise back up onto your [legs]");
				else outputText(" stand");
				outputText(" and dust yourself off. ");
				
				player.takeDamage(damage, true);
			}
			combatRoundOver();
		}

		// Roundhouse Kick
		// Milkd lust increase
		public  roundhouseKick(): void
		{
			outputText("Izumi leaps backwards onto one foot, spinning around and unleashing a thundering roundhouse kick.  Luckily, you manage to duck just in time, avoiding what surely would have been a monstrously powerful blow.  Unfortunately, as Izumi’s leg scythes through the air over your head, you find your gaze naturally following the line of her thigh muscles until you’re staring directly up the fluttering folds of Izumi’s increasingly impractical kimono.\n\n");

			if (player.cor >= 50 || player.lib >= 50 || player.sens >= 50)
			{
				outputText("You fall backwards and stagger away, already feeling a flush of warmth colouring your cheeks, trying to drag your mind back to the fight and away from... other things.");

				player.takeLustDamage(10 + player.lib / 10, true);
			}
			else
			{
				outputText("You furrow a brow at the Oni's ineffectual attack, not entirely sure if she was intending to hurt you or turn you on.  Her thighs did look rather tantalizing though...");

				player.takeLustDamage(5 + player.lib / 20, true);
			}

			combatRoundOver();
		}
		
		// Bind player for 3 turns. If the player doesn't break out in time, they take huge damage.
		// On escape, Izumi takes some damage
		public  chokeSlam(): void
		{
			if (player.getEvasionRoll())
			{
				outputText("Izumi surges towards you, closing the distance between you within the blink of an eye. You narrowly avoid her crushing grip, twisting away from her grasp at the last moment.  The enormous Oni lets loose a deep, satisfied laugh.");
			}
			else
			{
				outputText("Izumi surges towards you, smashing aside your guard and seizing you by the throat in the blink of an eye.  Lifting you above her head, you can only struggle to breathe as the enormous Oni grins at you like some sort of prize.");
				player.createStatusEffect(StatusEffects.Chokeslam, 3, 0, 0, 0);
				
				//if (combatDebug) trace("Applied Chokeslam effect");
			}
			combatRoundOver();
		}
		
		// Struggle against izumi's chokeslam
		public  chokeSlamStruggle(): void
		{	
			clearOutput();
			
		var  brokeFree: boolean;
			
			if (rand(player.str) > this.str / 2)
			{
				brokeFree = true;
			}
			
			if (brokeFree)
			{
				//if (combatDebug) trace("Escaped from Chokeslam grapple");
				
				chokeSlamEscape();
				combatRoundOver();
			}
			else
			{
				outputText("Izumi's grip around your throat continues to strangle the breath from your lungs as she holds you aloft.  Your fingers tighten in turn around the Oni's wrist, fighting against her");
				if (player.str < 90) outputText(" immense");
				else outputText(" impressive"); 
				outputText(" strength, in an attempt to free yourself from her crushing embrace, without success.");
				
				player.takeDamage(75 + rand(15), true);
				doAI();
			}
		}
		
		// OH HEY ITS A THING
		public  chokeSlamWait(): void
		{
			clearOutput();
			
			outputText("Your feet dangle uselessly in the air as Izumi holds you aloft.  Why bother resisting?  She's just so <i>strong</i>, her fingers wrapped so completely around your neck...");
			player.takeDamage(75 + rand(15), true);
			
			if (flags[kFLAGS.PC_FETISH] >= 2)
			{
				outputText(" and to be honest, the grip isn't an entirely unpleasant experience, either.  If only Izumi would stop playing around and just <i>take you</i> already.");
				player.takeLustDamage(5, true);
			}
			else
			{
				outputText(".");
			}
			doAI();
		}
		
		// Player fails to escape from the chokeslam, and after 3 rounds gets nailed to the fuckin floor
		public  chokeSlamDamage(): void
		{
			outputText("With a grunt of effort, Izumi hauls you through the air, her iron-like grip around your throat providing the perfect anchor to propel you towards the ground.  Before you have a chance to react, the Oni drives you into the unforgiving stone lining the floor of the cave.\n\n");

			outputText("The hit is extreme enough to leave you dazed for a moment, splayed out across the floor.  When you rouse yourself back to full consciousness a few seconds later, the cave is still echoing with the sound of the impact, a testament to the strength of the Oni - and your resilience.");
			
		var  damage: number = int ((str + 225) - rand(player.tou) - player.armorDef);
			player.takeDamage(damage, true);
			
			combatRoundOver();
		}
		
		// Player escapes from the chokeslam attack
		public  chokeSlamEscape(): void
		{
		var  damage: number = 50 + rand(player.str);
			//if (combatDebug) trace("Escaping from Chokeslam!");
			
			outputText("Scrabbling desperately against her wrist, you narrow your eyes at the Oni woman’s superior expression,");
			if (player.isBiped()) outputText(" raise a [leg] and kick her roundly");
			else if (player.isNaga()) outputText(" raise your tail and slap her solidly");
			else outputText(" and slap her square");
			outputText(" in the face.  Izumi drops you, staggering back in surprise.  “Ow!”  She actually yelps, covering her face with her hands.\n\n");

			outputText("You drop to the ground and roll away, expecting some form of retribution.  Izumi glares at you from behind her hand for a moment, then snickers.  Slowly, she drops back into her fighting stance and gestures for your bout to continue.");
			outputText("<b>(<font color=\"#800000\">" + damage + "</font>)</b>")
			cleanupChokeslam();
			
			this.HP -= damage;
			
			combatRoundOver();
		}
		
		// Remove the effect post-combat
		public  cleanupChokeslam(): void
		{
			if (player.hasStatusEffect(StatusEffects.Chokeslam))
			{
				//trace("Removing chokeslam");
				
				player.removeStatusEffect(StatusEffects.Chokeslam);
			}
		}
		
		// Groundslam, does damage and slows the player if they don't dodge the hit
		public  groundPound(): void
		{
			outputText("Izumi raises one mighty foot and slams it to the ground with a victorious yell.  The ground itself actually shakes below your feet, threatening to knock you off balance.\n\n");
			
			if (player.getEvasionRoll()) // TODO: ensure this is correct
			{
				outputText("Leaping to the side, you manage to steady yourself against the wall, keeping your footing.");
			}
			else
			{
				outputText("The rumbling actually knocks you off your feet, sprawling on the ground and banging your head.  As the shaking subsides, you pull yourself upright, but you feel a little unsteady on your [feet] after the disorienting impact.");
				
			var  spdReducedBy: number = int(player.spe * 0.25);
				player.createStatusEffect(StatusEffects.Groundpound, 3, spdReducedBy, 0, 0);
				game.dynStats("spe-", spdReducedBy);
				
				//if (combatDebug) trace("Applying Groundslam slow");
			}
			
			combatRoundOver();
		}
		
		// Remove the effect post-combat, fixup stats
		public  cleanupGroundpound(): void
		{
			if (player.hasStatusEffect(StatusEffects.Groundpound))
			{
				// Can't use dynStats to achieve this, as it can give back more speed than we originally took away due to perks
				player.spe += player.statusEffectv2(StatusEffects.Groundpound);
				if (player.spe > player.getMaxStats("spe")) player.spe = player.getMaxStats("spe");
				
				player.removeStatusEffect(StatusEffects.Groundpound);
				
				//trace("Removing Groundpound slow effect");
			}
		}
		
		// Binding attack, mild lust increase per turn until the player breaks out. Not TOO hard to break out, though.
		// Attack will be used ONCE, when Izumi reaches ~25% hp.
		public  titSmother(): void
		{
			//if (combatDebug) trace("Titsmother attack!");
			
			// Attack will ALWAYS hit, but be relatively easy to break out of
			outputText("With a sudden burst of speed, the Oni woman bullrushes you, slapping aside your hasty defence.  You brace yourself for a powerful impact, but rather than strike you she instead thrusts her arm straight past your head.  Bemused, you turn your head to follow her fist, just in time to see her crook her elbow and yank you back towards her - hard.  Pulled right off your [feet] by the sudden strike, you slam");
			if (player.hasMuzzle()) outputText(" muzzle-");
			else outputText(" face-");
			outputText("first into Izumi - specifically, into her chest.  Shocked by suddenly having your face rammed into the pillowy soft expanse of Izumi’s bust, you rear back only to be slammed straight back into the mountainous expanse by Izumi’s arm.");
			
			player.createStatusEffect(StatusEffects.Titsmother, 0, 0, 0, 0);
			player.takeLustDamage((player.lib / 15) + 5 + rand(5), true);
			combatRoundOver();
		}
		
		// Remove the effect post-combat
		public  cleanupTitsmother(): void
		{
			if (player.hasStatusEffect(StatusEffects.Titsmother))
			{
				player.removeStatusEffect(StatusEffects.Titsmother);
				//if (combatDebug) trace("Removing Titsmother");
			}
		}
		
		// Struggle handler for titsmother attack
		public  titSmotherStruggle(): void
		{
			//if (combatDebug) trace("Titsmother Struggle");
			
		var  brokeFree: boolean;
			
			if (rand(player.str) > this.str / 4)
			{
				brokeFree = true;
			}
			
			if (brokeFree)
			{
				//if (combatDebug) trace("Broke free of Titsmother!");
				
				titSmotherEscape();
				combatRoundOver();
			}
			else
			{
				if (rand(2) == 0)
				{
					clearOutput();
					outputText("“Hah!  Say goodnight, ‘cause I’m going to choke the fight right out of you!”  She cries exuberantly, forcibly mashing your face into her bosom.  It would appear that she is trying to throttle you, but only having one hand is making the task difficult.  You can breathe just fine, but having your face forced into the constantly jostling mass of tit-flesh before you is distracting to say the least.\n\n");
					outputText("You scrabble desperately against Izumi’s grip, trying not to think about where you’re placing your hands, or how soft and pliant the flesh beneath you is, or any number of other upsetting little details - but to no avail.  Izumi’s grip is incredibly strong.  You hang there for a moment, trying to get your breath back for another attempt as Izumi jostles and presses against you from all sides.");
				}
				else
				{
					clearOutput();
					if (player.hasCock())
					{
						outputText("Assaulted by the sensation of being pressed against such warm flesh, you can already feel [eachCock] starting to stiffen against your will.  Your hardening erection");
						if (player.totalCocks() > 1) outputText("s");
						outputText(" just makes things even more unbearable, as the harder");
						if (player.totalCocks() > 1) outputText(" they get");
						else outputText(" it gets");
						outputText(", the more insistently your");
						if (player.totalCocks() > 1) outputText(" erections throb");
						else outputText(" erection throbs");
						outputText(", pressed up against Izumi’s stomach muscles.  Her muscles ripple and undulate as she struggles to keep you in her grip, abs flexing, bumping, encircling your insistent erection");
						if (player.totalCocks() > 1) outputText("s");
						outputText(", stimulating you even further.  You realize in a flash of panic that if you don’t get out of this soon, you may actually... ");
					}
					else
					{
						outputText("Izumi’s bust encloses you on all sides, leaving you feeling like you’re trapped in some kind of breast sarcophagus.  The heat radiating from the soft flesh combines with the scent of whatever strange drug Izumi had been smoking, now hanging around her like some heady perfume.");
					}
				}
				player.takeLustDamage(player.lib / 15 + 5 + rand(5), true);
				doAI();
			}
		}
		
		// Player breaks free of tiSmother and applies damage to Izumi
		public  titSmotherEscape(): void
		{
			//if (combatDebug) trace("Escaping TitSmother!");
			clearOutput();
			
			if (player.str < 90)
			{
				outputText("Straining with all your might, you still can’t quite manage to break Izumi’s grip, but you do manage to somehow slide upwards through the valley of her bust.  Izumi’s face looms into view, the enormous woman gritting her teeth as she attempts to crush the fight out of you.  In an act of desperation, you rear back and then knife forwards in a brutal headbutt.\n\n");
				outputText("“Ack!”  Your forehead connects with her chin in a collision that probably hurts you as much as her, judging by the searing pain that lances through your forehead as she drops you to the floor. Meanwhile, Izumi staggers back, rubbing at her chin.  “Ow.  That hurt, kid!”  She says reproachfully.  The two of you take a moment to shake the cobwebs from your heads before dropping back into your combat stances, a little more wary this time around.\n\n");
			}
			else
			{
				outputText("Locking your arms against Izumi’s shoulders, you heave with all your might against the musclebound Oni girl’s choke hold.  You can feel her arm straining to hold you, struggling to resist, giving ground....");
				
				if (player.isBiped()) 
				{
					outputText("  As soon as you can, you hike up your legs and place your feet firmly on Izumi’s stomach, adding your leg muscles to the effort.");
				}
				
				outputText("  Izumi grits her teeth and growls as she pulls with all her might, trying to force your limbs to give way, but to no avail - with a final thrust, Izumi lets out a yelp as you knock her arm aside and leap away.  Izumi rolls her arm around a little, massaging her shoulder as she regards you, thoughtfully.  Then she reaches up and fans at her face with one hand, grinning that suggestive grin.\n\n");
			}

			outputText("“Oh my,” she purrs, lasciviously. “Aren’t you the impressive one?  Keep surprising me like that and I might just forget about this handicap...” ");

			cleanupTitsmother();
		var  damage: number = (15 + rand(player.str));
			this.HP -= damage;
			outputText("<b>(<font color=\"#800000\">" + damage + "</font>)</b>");
			combatRoundOver();
		}
		
		// Wait handler for titsmother attack
		public  titSmotherWait(): void
		{
			clearOutput();
			
			//if (combatDebug) trace("Waiting during TitSmother");
			
			outputText("With your face crushed into the Oni's cleavage, you can't help but wonder; why bother resisting?  She's just so <i>strong</i>, and her breasts feel so lushious against your [face]...");
			
			player.takeLustDamage(player.lib / 10 + 5 + rand(5), true);
			
			if (flags[kFLAGS.PC_FETISH] >= 2)
			{
				outputText(" and to be honest, her grip isn't an entirely unpleasant experience, either.  If only Izumi would stop playing around and just <i>take you</i> already.");
				player.takeLustDamage(5, true);
			}
			else
			{
				outputText(".");
			}
			doAI();
		}
	}


