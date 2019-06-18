
	/**
	 * ...
	 * @author ...
	 */
	export class GnollSpearThrower extends Monster 
	{
		private  hyenaPhysicalAttack(): void {
		var  damage: number = 0;
			//return to combat menu when finished
			doNext(game.playerMenu);
			//Blind dodge change
			if (hasStatusEffect(StatusEffects.Blind) && rand(3) < 2) {
				outputText(capitalA + short + " completely misses you with a blind attack!\n");
				//See below, removes the attack count once it hits rock bottom.
				if (statusEffectv1(StatusEffects.Attacks) == 0) removeStatusEffect(StatusEffects.Attacks);
				//Count down 1 attack then recursively call the function, chipping away at it.
				if (statusEffectv1(StatusEffects.Attacks) - 1 >= 0) {
					addStatusValue(StatusEffects.Attacks,1,-1);
					eAttack();
				}
				return;
			}
			//Determine if dodged!
			if (player.spe - spe > 0 && int(Math.random()*(((player.spe-spe)/4) +80)) > 80) {
				outputText("You see the gnoll's black lips pull back ever so slightly and the powerful muscles in her shapely thighs tense moments before she charges.  With a leap you throw yourself to the side, feeling the wind and fury pass through where you had just been standing.  You gracefully turn to face the hyena as she does the same, knowing that could have been very bad.");
				return;
			}
			//Determine if evaded
			if (player.findPerk(PerkLib.Evade) >= 0 && rand(100) < 10) {
				outputText("Using your skills at evading attacks, you anticipate and sidestep " + a + short + "'s attack.\n");
				//See below, removes the attack count once it hits rock bottom.
				if (statusEffectv1(StatusEffects.Attacks) == 0) removeStatusEffect(StatusEffects.Attacks);
				//Count down 1 attack then recursively call the function, chipping away at it.
				if (statusEffectv1(StatusEffects.Attacks) - 1 >= 0) {
					addStatusValue(StatusEffects.Attacks,1,-1);
					eAttack();
				}
				return;
			}
			//("Misdirection"
			if (player.findPerk(PerkLib.Misdirection) >= 0 && rand(100) < 10 && player.armorName == "red, high-society bodysuit") {
				outputText("Using Raphael's teachings, you anticipate and sidestep " + a + short + "' attacks.\n");
				//See below, removes the attack count once it hits rock bottom.
				if (statusEffectv1(StatusEffects.Attacks) == 0) removeStatusEffect(StatusEffects.Attacks);
				//Count down 1 attack then recursively call the function, chipping away at it.
				if (statusEffectv1(StatusEffects.Attacks) - 1 >= 0) {
					addStatusValue(StatusEffects.Attacks,1,-1);
					eAttack();
				}
				return;
			}
			//Determine if cat'ed
			if (player.findPerk(PerkLib.Flexibility) >= 0 && rand(100) < 6) {
				outputText("With your incredible flexibility, you squeeze out of the way of " + a + short + "");
				if (plural) outputText("' attacks.\n");
				else outputText("'s attack.\n");
				//See below, removes the attack count once it hits rock bottom.
				if (statusEffectv1(StatusEffects.Attacks) == 0) removeStatusEffect(StatusEffects.Attacks);
				//Count down 1 attack then recursively call the function, chipping away at it.
				if (statusEffectv1(StatusEffects.Attacks) - 1 >= 0) {
					addStatusValue(StatusEffects.Attacks,1,-1);
					eAttack();
				}
				return;
			}
			//Determine damage - str modified by enemy toughness!
			damage = int((str + weaponAttack) - Math.random()*(player.tou) - player.armorDef);
			if (damage <= 0) {
				damage = 0;
				//Due to toughness or amor...
				if (rand(player.armorDef + player.tou) < player.armorDef) outputText("The gnoll before you suddenly charges, almost too fast to see.  Twin fists slam into your " + player.armorName + " with enough force to stagger you, but the force is absorbed without doing any real damage.  As jaws powerful enough to crush bone flash at your neck, you are able to twist to the side, letting the furious hyena slip by you.");
				else outputText("You deflect and block every " + weaponVerb + " " + a + short + " throws at you.");
			}
			else {
				if (damage < 10) outputText("The gnoll runs forward, fury in her dark eyes as twin fists glance off your chest.  The glancing blow sends her off balance and the flashing ivory jaws barely miss your throat.  You push back, stumbling away from the furious hyena.");
				else outputText("The gnoll rushes forward, almost too fast to detect before twin fists slam into your torso.  Before you can recover, ivory jaws flash before your eyes and you feel the sharp teeth start to clamp onto the " + player.skin.desc + " of your neck.  Blinding pain causes you to fling yourself backwards, away from the teeth and drawing angry scrapes as you escape the jaws.  You roll away before picking yourself up, the hyena moving confidently towards you as you try to shake off the pain from the blow.");
			}
			if (damage > 0) {
				if (short == "fetish zealot") {
					outputText("\nYou notice that some kind of unnatural heat is flowing into your body from the wound");
					if (player.inte > 50) outputText(", was there some kind of aphrodisiac on the knife?");
					else outputText(".");
					player.takeLustDamage((player.lib/20 + rand(4) +1), true);
				}
				if (lustVuln > 0 && player.armorName == "barely-decent bondage straps") {
					if (!plural) outputText("\n" + capitalA + short + " brushes against your exposed skin and jerks back in surprise, coloring slightly from seeing so much of you revealed.");
					else outputText("\n" + capitalA + short + " brush against your exposed skin and jerk back in surprise, coloring slightly from seeing so much of you revealed.");
					lust += 5 * lustVuln;
				}
			}
			outputText(" ");
			if (damage > 0) damage = player.takeDamage(damage, true);
			statScreenRefresh();
			outputText("\n");
			combatRoundOver();
		}
		
		//<Writers note: I recommend that the javelin have a chance to greatly decrease speed for the remaining battle.  I am writing the flavor text for this event if you choose to include it>
		private  hyenaJavelinAttack(): void {
		var  damage: number = 0;
		var  slow: number = 0;
			//<Hyena Attack 2 – Javelin – Unsuccessful – Dodged>
			//Blind dodge change
			if (hasStatusEffect(StatusEffects.Blind) && rand(3) < 2) {
				outputText("The gnoll pulls a javelin from behind her and throws it at you, but blind as she is, it goes wide.");
			}
			//Determine if dodged!
			else if (player.spe - spe > 0 && int(Math.random()*(((player.spe-spe)/4) +80)) > 80) {
				outputText("The gnoll pulls a long, dark wooden javelin from over her shoulder.  Her spotted arm strikes forward, launching the missile through the air.  The spear flashes through the distance towards your vulnerable form.  Even as you see doom sailing towards you, a primal instinct to duck pulls you down, and you feel the wind from the massive missile as it passes close to your ear.");
			}
			//Determine if evaded
			else if (player.findPerk(PerkLib.Evade) >= 0 && rand(100) < 10) {
				outputText("Using your skills at evading attacks, you anticipate and sidestep " + a + short + "'s thrown spear.\n");
			}
			//("Misdirection"
			else if (player.findPerk(PerkLib.Misdirection) >= 0 && rand(100) < 10 && player.armorName == "red, high-society bodysuit") {
				outputText("Using Raphael's teachings, you anticipate and sidestep " + a + short + "' thrown spear.\n");
			}
			//Determine if cat'ed
			else if (player.findPerk(PerkLib.Flexibility) >= 0 && rand(100) < 6) {
				outputText("With your incredible flexibility, you squeeze out of the way of " + a + short + "'s thrown spear.");
			}
			//<Hyena Attack 2 – Javelin – Unsuccessful – Absorbed>
			else if (player.armorDef > 10 && rand(2) == 0) {
				outputText("The gnoll pulls a long, dark wooden javelin from over her shoulder.  Her spotted arm strikes forward, launching the missile through the air.  The spear flashes through the air but hits at an angle, sliding off your " + player.armorName + " without doing any damage.  It disappears into the grass.");
			}
			else if (player.findPerk(PerkLib.Resolute) >= 0 && player.tou >= 75) {
				outputText("You resolutely ignore the spear, brushing the blunted tip away when it hits you.\n");
			}
			//<Hyena Attack 2 – Javelin – Successful – Player Entangled>
			else if (rand(3) >= 1) {
				outputText("The gnoll pulls a long, black javelin from over her shoulder.  Her spotted arm strikes forward, launching the missile through the air.  You attempt to dive to the side, but are too late.  The powerful shaft slams, hard, into your back.  Pain radiates from the powerful impact.  Instead of piercing you, however, the tip seems to explode into a sticky goo that instantly bonds with your " + player.armorName + ".  The four foot, heavy shaft pulls down on you awkwardly, catching at things and throwing your balance off.  You try to tug the javelin off of you but find that it has glued itself to you.  It will take time and effort to remove; making it impossible to do while a dominant hyena stalks you. ");
				player.createOrFindStatusEffect(StatusEffects.GnollSpear);
				damage = player.takeDamage(25+rand(20), true);
			}
			//<Hyena Attack 2 – Javelin – Successful – Player Not Entangled>
			else {
				
				outputText("The gnoll pulls a long, dark wooden javelin from over her shoulder.  Her spotted arm strikes forward, launching the missile through the air.  The javelin flashes through the intervening distance, slamming into your chest.  The blunted tip doesn't skewer you, but pain radiates from the bruising impact. ");
				damage = player.takeDamage(25+rand(20), true);
			}
			combatRoundOver();
		}
		
		//<Writer's Note: With the third attack, I intend that the damage be increased based on the breast size of the player.  Thus, the text will vary if the player is flat-chested as indicated by colored text.>
		private  hyenaSnapKicku(): void {
		var  damage: number = 0;
			//Blind dodge change
			if (hasStatusEffect(StatusEffects.Blind) && rand(3) < 2) {
				outputText("The gnoll tries to catch you with a brutal snap-kick, but blind as she is, she completely misses.");
			}
			//Determine if dodged!
			else if (player.spe - spe > 0 && int(Math.random()*(((player.spe-spe)/4) +80)) > 80) {
				outputText("The gnoll grins at you before striding forward and pivoting.  A spotted leg snaps up and out, flashing through the air towards your " + player.chestDesc() + ".  You step back just in time, robbing the blow of force.  The paw lightly strikes your torso before the female hyena springs back, glaring at you.");
			}
			//Determine if evaded
			else if (player.findPerk(PerkLib.Evade) >= 0 && rand(100) < 10) {
				outputText("Using your skills at evading attacks, you anticipate and sidestep " + a + short + "'s snap-kick.\n");
			}
			//("Misdirection"
			else if (player.findPerk(PerkLib.Misdirection) >= 0 && rand(100) < 10 && player.armorName == "red, high-society bodysuit") {
				outputText("Using Raphael's teachings, you anticipate and sidestep " + a + short + "' snap-kick.\n");
			}
			//Determine if cat'ed
			else if (player.findPerk(PerkLib.Flexibility) >= 0 && rand(100) < 6) {
				outputText("With your incredible flexibility, you squeeze out of the way of " + a + short + "'s snap-kick.");
			}
			//Determine damage - str modified by enemy toughness!
			else {
				damage = player.biggestTitSize();
				if (damage > 20) damage = 20;
				damage += int(str - Math.random()*(player.tou) - player.armorDef);
				//No damage
				if (damage <= 0) {
					outputText("The gnoll tries to catch your " + player.chestDesc() + " with a snap-kick, but you manage to block the vicious blow.");
				}
				//<Hyena Attack 3 – Snap Kick – Successful>
				else {
					outputText("A glint enters the dark eyes of the gnoll before she strides forward and pivots.  A long, spotted leg snaps up and out to slam against your " + player.chestDesc());
					if (player.biggestTitSize() >= 1) outputText(", sending a wave of pain through the sensitive flesh");
					outputText(".  A small, traitorous part of you can't help but notice a flash of long, dark flesh beneath her loincloth even as you stagger back from the impact. ");
					player.takeLustDamage(2, true);
					player.takeDamage(damage, true);
				}
			}
			combatRoundOver();
		}
		
		private  hyenaArousalAttack(): void {
			//Success = cor+lib > rand(150)
		var  chance: number = rand(150);
			//<Hyena Attack 4 – Arousal Attack – Highly Successful>
			if (player.cor + player.lib > chance + 50) {
				outputText("A wry grin spreads across the gnoll's face before she sprints towards you.  Too fast to follow, she flies forward, and you desperately brace for an impact that doesn't come.  Instead of striking you, two spotted paws clamp behind your neck and pull your head down, planting your face against her leather loincloth.  A powerful, musky smell burns in your nose and the feel of firm flesh behind the flimsy leather leaves a tingling sensation along your face.  She holds you there, pressed against her groin for several moments, desire growing deep within your body, before you find the strength and will to pull away.  The amazon grins, letting you stumble back as you try to fight off the feel of her body.\n\n");
				player.takeLustDamage((25 + player.lib/20 + player.sens/5), true);
			}
			//<Hyena Attack 4 – Arousal Attack – Mildly Successful>
			else if (20 + player.cor + player.lib > chance) {
				outputText("A lazy grin spreads across the gnoll's face before she sprints towards you.  Too fast to follow, she flies forward, and you desperately brace for an impact that doesn't come.  Instead of striking you, two spotted paws clamp behind your neck and pull your head down, planting your face against her leather loincloth.  A powerful, musky smell burns in your nose and the feel of firm flesh behind the flimsy leather leaves a tingling sensation along your face.  Instinctively, you tear away from the hold, stumbling away from the sensations filling your mind, though some desire remains kindled within you.");
				player.takeLustDamage((15 + player.lib/20 + player.sens/5), true);
			}
			//<Hyena Attack 4 – Arousal Attack – Unsuccessful>
			else {
				outputText("A knowing glint fills the dark eyes of the gnoll before she sprints forward.  Your muscles tense as she reaches you and starts to lock two spotted paws behind your neck.  She pulls you down towards her musky crotch, but just as you brush her loincloth, you twist away.  The hyena snarls in frustration, and you're left wondering if that was her idea of foreplay.");
			}
			combatRoundOver();
		}

		public  eAttack(): void
		{
		var  damage: number = 0;
//return to combat menu when finished
			doNext(game.playerMenu);
//Blind dodge change
			if (hasStatusEffect(StatusEffects.Blind) && rand(3) < 2) {
				outputText(capitalA + short + " completely misses you with a blind attack!\n");
				//See below, removes the attack count once it hits rock bottom.
				if (statusEffectv1(StatusEffects.Attacks) == 0) removeStatusEffect(StatusEffects.Attacks);
				//Count down 1 attack then recursively call the function, chipping away at it.
				if (statusEffectv1(StatusEffects.Attacks) - 1 >= 0) {
					addStatusValue(StatusEffects.Attacks, 1, -1);
					eAttack();
				}
			}
//Determine if dodged!
			if (player.spe - spe > 0 && int(Math.random() * (((player.spe - spe) / 4) + 80)) > 80) {
				outputText("You see the gnoll's black lips pull back ever so slightly and the powerful muscles in her shapely thighs tense moments before she charges.  With a leap you throw yourself to the side, feeling the wind and fury pass through where you had just been standing.  You gracefully turn to face the hyena as she does the same, knowing that could have been very bad.");
			}
//Determine if evaded
			if (player.findPerk(PerkLib.Evade) >= 0 && rand(100) < 10) {
				outputText("Using your skills at evading attacks, you anticipate and sidestep " + a + short + "'s attack.\n");
				//See below, removes the attack count once it hits rock bottom.
				if (statusEffectv1(StatusEffects.Attacks) == 0) removeStatusEffect(StatusEffects.Attacks);
				//Count down 1 attack then recursively call the function, chipping away at it.
				if (statusEffectv1(StatusEffects.Attacks) - 1 >= 0) {
					addStatusValue(StatusEffects.Attacks, 1, -1);
					eAttack();
				}
			}
//("Misdirection"
			if (player.findPerk(PerkLib.Misdirection) >= 0 && rand(100) < 10 && player.armorName == "red, high-society bodysuit") {
				outputText("Using Raphael's teachings, you anticipate and sidestep " + a + short + "' attacks.\n");
				//See below, removes the attack count once it hits rock bottom.
				if (statusEffectv1(StatusEffects.Attacks) == 0) removeStatusEffect(StatusEffects.Attacks);
				//Count down 1 attack then recursively call the function, chipping away at it.
				if (statusEffectv1(StatusEffects.Attacks) - 1 >= 0) {
					addStatusValue(StatusEffects.Attacks, 1, -1);
					eAttack();
				}
			}
//Determine if cat'ed
			if (player.findPerk(PerkLib.Flexibility) >= 0 && rand(100) < 6) {
				outputText("With your incredible flexibility, you squeeze out of the way of " + a + short + "");
				if (plural) outputText("' attacks.\n");
				else outputText("'s attack.\n");
				//See below, removes the attack count once it hits rock bottom.
				if (statusEffectv1(StatusEffects.Attacks) == 0) removeStatusEffect(StatusEffects.Attacks);
				//Count down 1 attack then recursively call the function, chipping away at it.
				if (statusEffectv1(StatusEffects.Attacks) - 1 >= 0) {
					addStatusValue(StatusEffects.Attacks, 1, -1);
					eAttack();
				}
			}
//Determine damage - str modified by enemy toughness!
			damage = int((str + weaponAttack) - Math.random() * (player.tou) - player.armorDef);
			
			if (damage <= 0) {
				damage = 0;
				//Due to toughness or amor...
				if (rand(player.armorDef + player.tou) < player.armorDef) outputText("The gnoll before you suddenly charges, almost too fast to see.  Twin fists slam into your " + player.armorName + " with enough force to stagger you, but the force is absorbed without doing any real damage.  As jaws powerful enough to crush bone flash at your neck, you are able to twist to the side, letting the furious hyena slip by you.");
				else outputText("You deflect and block every " + weaponVerb + " " + a + short + " throws at you.");
			}
			else {
				if (damage < 10) outputText("The gnoll runs forward, fury in her dark eyes as twin fists glance off your chest.  The glancing blow sends her off balance and the flashing ivory jaws barely miss your throat.  You push back, stumbling away from the furious hyena.");
				else outputText("The gnoll rushes forward, almost too fast to detect before twin fists slam into your torso.  Before you can recover, ivory jaws flash before your eyes and you feel the sharp teeth start to clamp onto the " + player.skin.desc + " of your neck.  Blinding pain causes you to fling yourself backwards, away from the teeth and drawing angry scrapes as you escape the jaws.  You roll away before picking yourself up, the hyena moving confidently towards you as you try to shake off the pain from the blow.");
			}
			if (damage > 0) {
				if (short == "fetish zealot") {
					outputText("\nYou notice that some kind of unnatural heat is flowing into your body from the wound");
					if (player.inte > 50) outputText(", was there some kind of aphrodisiac on the knife?");
					else outputText(".");
					game.dynStats("lus", (player.lib / 20 + rand(4) + 1));
				}
				if (lustVuln > 0 && player.armorName == "barely-decent bondage straps") {
					if (!plural) outputText("\n" + capitalA + short + " brushes against your exposed skin and jerks back in surprise, coloring slightly from seeing so much of you revealed.");
					else outputText("\n" + capitalA + short + " brush against your exposed skin and jerk back in surprise, coloring slightly from seeing so much of you revealed.");
					lust += 5 * lustVuln;
				}
			}
			outputText(" ");
			if (damage > 0) damage = player.takeDamage(damage, true);
			statScreenRefresh();
			outputText("\n");
			combatRoundOver();
		}

		public  defeated(hpVictory: boolean): void
		{
			if (short == "alpha gnoll") {
				game.clearOutput();
				outputText("The gnoll alpha is defeated!  You could use her for a quick, willing fuck to sate your lusts before continuing on.  Hell, you could even dose her up with that succubi milk you took from the goblin first - it might make her even hotter.  Do you?");
				kGAMECLASS.output.menu();
				kGAMECLASS.output.addButton(0,"Fuck",	game.urtaQuest.winRapeHyenaPrincess);
				kGAMECLASS.output.addButton(1,"Succ Milk", game.urtaQuest.useSuccubiMilkOnGnollPrincesses);
				kGAMECLASS.output.addButton(4,"Leave",game.urtaQuest.urtaNightSleep);
			} else {
				game.plains.gnollSpearThrowerScene.hyenaVictory();
			}
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if (short == "alpha gnoll"){
				game.urtaQuest.loseToGnollPrincessAndGetGangBanged();
			} else if (pcCameWorms){
				outputText("\n\nYour foe doesn't seem put off enough to leave...");
				doNext(game.combat.endLustLoss);
			} else {
				game.plains.gnollSpearThrowerScene.hyenaSpearLossAnal();
			}
		}

		public  GnollSpearThrower()
		{
			this.a = "the ";
			this.short = "gnoll spear-thrower";
			this.imageName = "gnollspearthrower";
			this.long = "You are fighting a gnoll.  An amalgam of voluptuous, sensual lady and snarly, pissed off hyena, she clearly intends to punish you for trespassing.  Her dark-tan, spotted hide blends into a soft cream-colored fur covering her belly and two D-cup breasts, leaving two black nipples poking through the fur.  A crude loincloth is tied around her waist, obscuring her groin from view.  A leather strap cuts between her heavy breasts, holding a basket of javelins on her back.  Large, dish-shaped ears focus on you, leaving no doubt that she can hear every move you make.  Sharp, dark eyes are locked on your body, filled with aggression and a hint of lust.";
			this.race = "Gnoll";
			// this.plural = false;
			this.createVagina(false, Vagina.WETNESS_DROOLING, Vagina.LOOSENESS_LOOSE);
			createBreastRow(Appearance.breastCupInverse("D"));
			this.ass.analLooseness = Ass.LOOSENESS_STRETCHED;
			this.ass.analWetness = Ass.WETNESS_DRY;
			this.createStatusEffect(StatusEffects.BonusACapacity,25,0,0,0);
			this.tallness = 72;
			this.hips.rating = Hips.RATING_AMPLE;
			this.butt.rating = Butt.RATING_TIGHT;
			this.skin.tone = "tawny";
			this.skin.setType(Skin.FUR);
			this.hair.color = "black";
			this.hair.length = 22;
			initStrTouSpeInte(85, 60, 100, 50);
			initLibSensCor(65, 45, 60);
			this.weaponName = "teeth";
			this.weaponVerb="bite";
			this.weaponAttack = 0;
			this.weaponPerk = "";
			this.weaponValue = 25;
			this.armorName = "skin";
			this.armorDef = 2;
			this.bonusHP = 250;
			this.lust = 30;
			this.lustVuln = .35;
			this.temperment = TEMPERMENT_RANDOM_GRAPPLES;
			this.level = 10;
			this.gems = 10 + rand(5);
			this.drop = new ChainedDrop().add(consumables.GROPLUS,1/5).add(consumables.INCUBID,1/2).elseDrop(consumables.BROWN_D);
			this.special1 = hyenaJavelinAttack;
			this.special2 = hyenaSnapKicku;
			this.special3 = hyenaArousalAttack;
			checkMonster();
		}
	}

