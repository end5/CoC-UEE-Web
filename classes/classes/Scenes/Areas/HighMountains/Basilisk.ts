	
	/**
	 * ...
	 * @author ...
	 */
	export class Basilisk extends StareMonster 
	{
		//special 1: basilisk mental compulsion attack
		//(Check vs. Intelligence/Sensitivity, loss = recurrent speed loss each
		//round, one time lust increase):
		private  compulsion(): void {
			outputText("The basilisk opens its mouth and, staring at you, utters words in its strange, dry, sibilant tongue.  The sounds bore into your mind, working and buzzing at the edges of your resolve, suggesting, compelling, then demanding you look into the basilisk's eyes.  ");
			//Success:
			if (player.inte / 5 + rand(20) < 24 + player.newGamePlusMod() * 5) {
				//Immune to Basilisk?
				if (player.findPerk(PerkLib.BasiliskResistance) >= 0 || player.canUseStare() || player.hasKeyItem("Laybans") >= 0) {
					outputText("You can't help yourself... you glimpse the reptile's grey, slit eyes. However, no matter how much you look into the eyes, you do not see anything wrong. All you can see is the basilisk. The basilisk curses as he finds out that you're immune!");
				}
				else {
					outputText("You can't help yourself... you glimpse the reptile's grey, slit eyes. You look away quickly, but you can picture them in your mind's eye, staring in at your thoughts, making you feel sluggish and unable to coordinate. Something about the helplessness of it feels so good... you can't banish the feeling that really, you want to look in the basilisk's eyes forever, for it to have total control over you.");
					game.dynStats("lus", 3);
					//apply status here
					speedReduce(player, 20);
					player.createStatusEffect(StatusEffects.BasiliskCompulsion,0,0,0,0);
					flags[kFLAGS.BASILISK_RESISTANCE_TRACKER] += 2;
				}
			}
			//Failure:
			else {
				outputText("You concentrate, focus your mind and resist the basilisk's psychic compulsion.");
			}
			game.combat.combatRoundOver();
		}



		//Special 3: basilisk tail swipe (Small physical damage):
		private  basiliskTailSwipe(): void {
			outputText("The basilisk suddenly whips its tail at you, swiping your " + player.feet() + " from under you!  You quickly stagger upright, being sure to hold the creature's feet in your vision.  ");
			if (damage == 0) outputText("The fall didn't harm you at all.  ");
		var  damage: number = int((str + 20) - Math.random()*(player.tou+player.armorDef));
			damage = player.takeDamage(damage, true);			
			game.combat.combatRoundOver();
		}

		//basilisk physical attack: With lightning speed, the basilisk slashes you with its index claws!
		//Noun: claw

		protected  performCombatAction(): void
		{
		var  actionChoices:ChainedAction = new ChainedAction(eAttack);

			if (!player.hasStatusEffect(StatusEffects.BasiliskCompulsion) && !hasStatusEffect(StatusEffects.Blind))
				actionChoices.add(compulsion, 1 / 3);

			actionChoices.add(basiliskTailSwipe, 1 / 3);

			actionChoices.exec();
		}

		public  defeated(hpVictory: boolean): void
		{
			game.highMountains.basiliskScene.defeatBasilisk();
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if (pcCameWorms){
				outputText("\n\nThe basilisk smirks, but waits for you to finish...");
				doNext(game.combat.endLustLoss);
			} else {
				game.highMountains.basiliskScene.loseToBasilisk();
			}
		}
		
		public  get long(): string
		{
			if (player.hasPerk(PerkLib.BasiliskResistance) || player.canUseStare() || player.hasKeyItem("Laybans") >= 0) {
				return "You are fighting a basilisk!  The basilisk is a male reptilian biped standing a bit over 6' tall.  He has a thin but ropy build, his tightly muscled yellow underbelly the only part of his frame not covered in those deceptive, camouflaging grey-green scales.  A long, whip-like tail flits restlessly through the dirt behind his skinny legs, and sharp sickle-shaped index claws decorate each hand and foot.  His face has a cruel jaw, a blunt lizard snout and a crown of dull spines.";
			} else {
				return "You are fighting a basilisk!  From what you can tell while not looking directly at it, the basilisk is a male reptilian biped standing a bit over 6' tall.  He has a thin but ropy build, his tightly muscled yellow underbelly the only part of his frame not covered in those deceptive, camouflaging grey-green scales.  A long, whip-like tail flits restlessly through the dirt behind his skinny legs, and sharp sickle-shaped index claws decorate each hand and foot.  You don't dare to look at his face, but you have the impression of a cruel jaw, a blunt lizard snout and a crown of dull spines.";
			}
		}

		public  Basilisk()
		{
			this.a = "the ";
			this.short = "basilisk";
			this.imageName = "basilisk";
			this.long = ""; // Needs to be set to supress validation errors, but is handled by the override.
			this.race = "Basilisk";
			// this.plural = false;
			this.createCock(6,2);
			this.balls = 2;
			this.ballSize = 2;
			createBreastRow(0);
			this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
			this.ass.analWetness = Ass.WETNESS_DRY;
			this.createStatusEffect(StatusEffects.BonusACapacity,30,0,0,0);
			this.tallness = 6*12+2;
			this.hips.rating = Hips.RATING_SLENDER+1;
			this.butt.rating = Butt.RATING_AVERAGE;
			this.lowerBody.type = LowerBody.LIZARD;
			this.face.type = Face.LIZARD;
			this.ears.type = Ears.LIZARD;
			this.eyes.type = Eyes.BASILISK;
			this.hair.type = Hair.BASILISK_SPINES;
			this.skin.tone = "grey-green";
			this.skin.setType(Skin.LIZARD_SCALES);
			this.hair.color = "grey-green";
			this.hair.length = 2;
			initStrTouSpeInte(85, 70, 35, 70);
			initLibSensCor(50, 35, 60);
			this.weaponName = "claws";
			this.weaponVerb="claw";
			this.weaponAttack = 30;
			this.armorName = "scales";
			this.armorDef = 10;
			this.armorPerk = "";
			this.armorValue = 70;
			this.bonusHP = 200;
			this.lust = 30;
			this.lustVuln = .5;
			this.temperment = TEMPERMENT_RANDOM_GRAPPLES;
			this.level = 12;
			this.gems = rand(10) + 10;
			this.drop = new ChainedDrop().add(consumables.REPTLUM, 0.9)
					.elseDrop(useables.EBNFLWR);
			this.tail.type = Tail.LIZARD;
			this.tail.recharge = 0;
			this.createPerk(PerkLib.BasiliskResistance, 0, 0, 0, 0);
			checkMonster();
		}
		
	}


