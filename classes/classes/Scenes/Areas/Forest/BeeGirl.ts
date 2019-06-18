
	export class BeeGirl extends Monster {

		public  defeated(hpVictory: boolean): void {
			game.forest.beeGirlScene.beeGirlPCVictory(hpVictory);
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if (pcCameWorms) {
				outputText("\n\nThe bee-girl goes white and backs away with a disgusted look on her face.\n\n");
				game.combat.cleanupAfterCombat();
			}
			else {
				game.forest.beeGirlScene.beeRapesYou();
			}
		}
		
		private  beeStingAttack(): void {
			//Blind dodge change
			if (hasStatusEffect(StatusEffects.Blind)) {
				outputText(capitalA + short + " completely misses you with a blind sting!!");
				combatRoundOver();
				return;
			}
			//Determine if dodged!
			if (player.spe - spe > 0 && int(Math.random() * (((player.spe - spe) / 4) + 80)) > 80) {
				if (player.spe - spe < 8) outputText("You narrowly avoid " + a + short + "'s stinger!");
				if (player.spe - spe >= 8 && player.spe - spe < 20) outputText("You dodge " + a + short + "'s stinger with superior quickness!");
				if (player.spe - spe >= 20) outputText("You deftly avoid " + a + short + "'s slow attempts to sting you.");
				combatRoundOver();
				return;
			}
			//determine if avoided with armor.
			if (player.armorDef >= 10 && rand(4) > 0) {
				outputText("Despite her best efforts, " + a + short + "'s sting attack can't penetrate your armor.");
				combatRoundOver();
				return;
			}
			//Sting successful!  Paralize or lust?
			//Lust 50% of the time
			if (rand(2) == 0) {
				outputText("Searing pain lances through you as " + a + short + " manages to sting you!  You stagger back a step and nearly trip, flushing hotly.  ");
				outputText("Oh no!  You've been injected with some kind of aphrodisiac.  You've got to keep focused, you can't think about... fucking... ");
				if (player.gender == 1) outputText("or dripping honey-slicked cunts beckoning you. ");
				if (player.gender == 2) outputText("planting your aching sex over her face while you lick her sweet honeypot. ");
				if (player.gender == 3) outputText("or cocks, tits, and puffy nipples. ");
			var  lustDmg: number = 25;
				player.takeLustDamage(lustDmg, true);
				if (player.lust100 > 60) {
					outputText(" You shake your head and struggle to stay focused,");
					if (player.gender == 1 || player.gender == 3) outputText(" but it's difficult with the sensitive bulge in your groin.");
					if (player.gender == 2) outputText(" but can't ignore the soaking wetness in your groin.");
					if (player.sens100 > 50) outputText("  The sensitive nubs of your nipples rub tightly under your " + player.armorName + ".");
				}
				else outputText(" You shake your head and clear the thoughts from your head, focusing on the task at hand.");
				if (!player.hasStatusEffect(StatusEffects.lustvenom)) player.createStatusEffect(StatusEffects.lustvenom, 0, 0, 0, 0);
			}
			//Paralise the other 50%!
			else {
				outputText("Searing pain lances through you as " + a + short + " manages to sting you!  You stagger back a step and nearly trip, finding it hard to move yourself.");
			var  paralyze:ParalyzeVenomDebuff = player.statusEffectByType(StatusEffects.ParalyzeVenom) as ParalyzeVenomDebuff;
				if (paralyze) {
					outputText("  It's getting much harder to move, you're not sure how many more stings like that you can take!");
				} else {
					paralyze = new ParalyzeVenomDebuff();
					player.addStatusEffect(paralyze);
					outputText("  You've fallen prey to paralyzation venom!  Better end this quick!");
				}
				paralyze.increase();
			}
			if (player.lust >= player.maxLust())
				doNext(game.combat.endLustLoss);
			else doNext(game.playerMenu);
		}

		public  BeeGirl()
		{
			super();
			this.a = "a ";
			this.short = "bee-girl";
			this.imageName = "beegirl";
			this.long = "A bee-girl buzzes around you, filling the air with intoxicatingly sweet scents and a buzz that gets inside your head.  She has a humanoid face with small antennae, black chitin on her arms and legs that looks like shiny gloves and boots, sizable breasts, and a swollen abdomen tipped with a gleaming stinger.";
			this.race = "Bee-Morph";
			this.createVagina(false, Vagina.WETNESS_SLAVERING, Vagina.LOOSENESS_GAPING);
			createBreastRow(Appearance.breastCupInverse("DD"));
			this.ass.analLooseness = Ass.LOOSENESS_STRETCHED;
			this.ass.analWetness = Ass.WETNESS_NORMAL;
			this.tallness = rand(14) + 59;
			this.hips.rating = Hips.RATING_CURVY+3;
			this.butt.rating = Butt.RATING_EXPANSIVE;
			this.lowerBody.type = LowerBody.BEE;
			this.skin.tone = "yellow";
			this.hair.color = randomChoice("black","black and yellow");
			this.hair.length = 6;
			initStrTouSpeInte(30, 30, 30, 20);
			initLibSensCor(60, 55, 0);
			this.weaponName = "chitin-plated fist";
			this.weaponVerb="armored punch";
			this.armorName = "chitin";
			this.armorDef = 9;
			this.lust = 20 + rand(40);
			this.lustVuln = 0.9;
			this.temperment = TEMPERMENT_LOVE_GRAPPLES;
			this.level = 4;
			this.gems = rand(15) + 1;
			this.drop = new ChainedDrop().add(consumables.OVIELIX, 1 / 10)
					.add(consumables.W__BOOK, 1 / 10)
					.add(consumables.BEEHONY, 1 / 2)
					.elseDrop(useables.B_CHITN);
			this.antennae.type = Antennae.BEE;
			this.wings.type = Wings.BEE_LIKE_SMALL;
			this.tail.type = Tail.BEE_ABDOMEN;
			this.tail.venom = 100;
			this.special1 = beeStingAttack;
			checkMonster();
		}

	}


