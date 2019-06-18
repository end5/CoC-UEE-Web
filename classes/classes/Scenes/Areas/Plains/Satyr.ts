
	export class Satyr extends Monster
	{
		//Attacks (Z)
		private  satyrAttack(): void {
			outputText("The satyr swings at you with one knuckled fist.  ");
			//Blind dodge change
			if (hasStatusEffect(StatusEffects.Blind) && rand(3) < 1) {
				outputText(capitalA + short + " completely misses you with a blind punch!\n");
			}
			//Evade: 
			else if (player.getEvasionRoll()) {
				outputText("He snarls as you duck his blow and it swishes harmlessly through the air.");
			}
			else {
			var  damage: number = int((str + weaponAttack) - rand(player.tou));
				if (damage > 0) {
					outputText("It feels like you just got hit with a wooden club! ");
					damage = player.takeDamage(damage, true);
				}
				else outputText("You successfully block it.");
			}
			combatRoundOver();
		}
				
		private  satyrBate(): void {
			outputText("He glares at you, panting while his tongue hangs out and begins to masturbate.  You can nearly see his lewd thoughts reflected in his eyes, as beads of pre form on his massive cock and begin sliding down the erect shaft.");
			//(small Libido based Lust increase, and increase lust)
			player.takeLustDamage((player.lib/5) +4, true);
			lust += 5;
			combatRoundOver();
		}
		
		public  satyrCharge(): void {
			outputText("Lowering his horns, the satyr digs his hooves on the ground and begins snorting; he's obviously up to something.  ");
			if (hasStatusEffect(StatusEffects.Blind) && rand(3) < 1) {
				outputText(capitalA + short + " completely misses you due to blindness!\n");
			}
			else {
			var  evade: string = player.getEvasionReason();
				if (evade == EVASION_EVADE) {
					outputText("He charges at you with a loud bleat, but using your evasive skills, you nimbly dodge and strike a vicious blow with your [weapon] in return that sends him crashing into the ground, hollering in pain. (5)");
					HP -= 5;
				}
				else if (evade == EVASION_FLEXIBILITY) {
					outputText("He charges at you with a loud bleat, but using your flexibility, you nimbly dodge and strike a vicious blow with your [weapon] in return that sends him crashing into the ground, hollering in pain. (5)");
					HP -= 5;
				}
				else if (evade == EVASION_MISDIRECTION) {
					outputText("He charges at you with a loud bleat, but using your misdirecting skills, you nimbly dodge and strike a vicious blow with your [weapon] in return that sends him crashing into the ground, hollering in pain. (5)");
					HP -= 5;
				}
				else if (evade == EVASION_SPEED || evade != undefined) {
					outputText("He charges at you with a loud bleat, but you nimbly dodge and strike a vicious blow with your [weapon] in return that sends him crashing into the ground, hollering in pain. (5)");
					HP -= 5;
				}
				else {
				var  damage: number = int((str + weaponAttack) - rand(player.tou));
					if (damage > 0) {
						outputText("He charges at you with a loud bleat, catching you off-guard and sending you flying into the ground.");
						if (player.findPerk(PerkLib.Resolute) < 0 && rand(2) == 0) {
							outputText("  The pain of the impact is so big you feel completely dazed, almost seeing stars.");
							player.createStatusEffect(StatusEffects.Stunned,0,0,0,0);
						}
						outputText(" ");
						damage = player.takeDamage(damage, true);
						//stun PC + hp damage if hit, hp damage dependent on str if miss
					}
					else outputText("He charges at you, but you successfully deflect it at the last second.");
				}
			}
			combatRoundOver();
		}
			
		private  bottleChug(): void {
			outputText("He whips a bottle of wine seemingly from nowhere and begins chugging it down, then lets out a bellowing belch towards you.  The smell is so horrible you cover your nose in disgust, yet you feel hot as you inhale some of the fetid scent.");
			//(damage PC lust very slightly and raise the satyr's lust.)
			player.takeLustDamage(player.lib/5, true);
			lust += 5;
			combatRoundOver();
		}
		
		//5:(Only executed at high lust) 
		private  highLustChugRape(): void {
			outputText("Panting with barely-contained lust, the Satyr charges at you and tries to ram you into the ground.  ");
			if (hasStatusEffect(StatusEffects.Blind) && rand(3) < 1) {
				outputText(capitalA + short + " completely misses you due to blindness!\n");
			}
			else if (player.getEvasionRoll()) {
				outputText("As he charges you, you grab him by the horns and spin around, sending him away.");
			}
			else {
				outputText("You fall with a <b>THUD</b> and the Satyr doesn't even bother to undress you before he begins rubbing his massive cock on your body until he comes, soiling your [armor] and " + player.skinFurScales() + " with slimy, hot cum.  As it rubs into your body, you shiver with unwanted arousal.");
				//large-ish sensitivity based lust increase if hit.)(This also relieves him of some of his lust, though not completely.)
				lust -= 50;
				player.takeLustDamage((player.sens/5+20), true);
			}
			combatRoundOver();
		}
		
		protected  performCombatAction(): void
		{
			if (lust >= 75 && rand(2) == 0) highLustChugRape();
			else if (lust < 75 && rand(2) == 0) {
				if (rand(2) == 0) satyrBate();
				else bottleChug();
			}
			else if (!hasStatusEffect(StatusEffects.Charged)) satyrCharge();
			else {
				satyrAttack();
				removeStatusEffect(StatusEffects.Charged);
			}
		}

		public  defeated(hpVictory: boolean): void
		{
			game.plains.satyrScene.defeatASatyr();
		}


		public  won(hpVictory: boolean,pcCameWorms: boolean): void
		{
			if (pcCameWorms) {
				outputText("\n\nThe satyr laughs heartily at your eagerness...");
				doNext(game.combat.endLustLoss);
			} else {
				game.plains.satyrScene.loseToSatyr();
			}
		}

		public  Satyr()
		{
			this.a = "a ";
			this.short = "satyr";
			this.imageName = "satyr";
			this.long = "From the waist up, your opponent is perfectly human, save his curling, goat-like horns and his pointed, elven ears.  His muscular chest is bare and glistening with sweat, while his coarsely rugged, masculine features are contorted into an expression of savage lust.  Looking at his waist, you notice he has a bit of a potbelly, no doubt the fruits of heavy drinking, judging by the almost overwhelming smell of booze and sex that emanates from him.  Further down you see his legs are the coarse, bristly-furred legs of a bipedal goat, cloven hooves pawing the ground impatiently, sizable manhood swaying freely in the breeze.";
			this.race = "Satyr";
			// this.plural = false;
			this.createCock(rand(13) + 14,1.5 + rand(20)/2,CockTypesEnum.HUMAN);
			this.balls = 2;
			this.ballSize = 2 + rand(13);
			this.cumMultiplier = 1.5;
			this.hoursSinceCum = this.ballSize * 10;
			createBreastRow(0);
			this.ass.analLooseness = Ass.LOOSENESS_STRETCHED;
			this.ass.analWetness = Ass.WETNESS_NORMAL;
			this.createStatusEffect(StatusEffects.BonusACapacity,20,0,0,0);
			this.tallness = rand(37) + 64;
			this.hips.rating = Hips.RATING_AVERAGE;
			this.butt.rating = Butt.RATING_AVERAGE+1;
			this.lowerBody.type = LowerBody.HOOFED;
			this.skin.tone = "tan";
			this.hair.color = randomChoice("black","brown");
			this.hair.length = 3+rand(20);
			this.face.type = Face.COW_MINOTAUR;
			initStrTouSpeInte(75, 70, 110, 70);
			initLibSensCor(60, 35, 45);
			this.weaponName = "fist";
			this.weaponVerb="punch";
			this.armorName = "thick fur";
			this.bonusHP = 300;
			this.lust = 20;
			this.lustVuln = 0.30;
			this.temperment = TEMPERMENT_LUSTY_GRAPPLES;
			this.level = 14;
			this.gems = rand(25) + 25;
			this.drop = new ChainedDrop().add(consumables.INCUBID,1/2);
			this.tail.type = Tail.COW;
			checkMonster();
		}
		
	}


