
	export class SpiderMorphMob extends Monster
	{
		//==============================
		// SPOIDAH HORDE COMBAT SHIZZLE HERE!
		//==============================
		private  spiderStandardAttack(): void {
			//SPIDER HORDE ATTACK - Miss (guaranteed if turns 1-3 and PC lost to Kiha)
			if (hasStatusEffect(StatusEffects.MissFirstRound) || player.getEvasionRoll()) {
				removeStatusEffect(StatusEffects.MissFirstRound);
				outputText("A number of spiders rush at you, trying to claw and bite you.  You manage to beat them all back, though, with some literal covering fire from Kiha.");
			}
			//SPIDER HORDE ATTACK - Hit
			else {
				outputText("A number of spiders rush at you, trying to claw and bite you.  You manage to knock most of them away, but a few nasty hits manage to punch through your [armorName].  ");
				//Determine damage - str modified by enemy toughness!
			var  damage: number = int((str + weaponAttack) - rand(player.tou) - player.armorDef) + 20;
				if (damage > 0) damage = player.takeDamage(damage);
				if (damage <= 0) {
					damage = 0;
					if (rand(player.armorDef + player.tou) < player.armorDef) outputText("You absorb and deflect every " + weaponVerb + " with your " + player.armorName + ".");
					else outputText("You deflect and block every " + weaponVerb + " " + a + short + " throws at you.");
				}
				else if (damage < 6) outputText("You are struck a glancing blow by " + a + short + "! ");
				else if (damage < 11) outputText(capitalA + short + " wounds you! ");
				else if (damage < 21) outputText(capitalA + short + " staggers you with the force of " + pronoun3 + " " + weaponVerb + "! ");
				else if (damage > 20) {
					outputText(capitalA + short + " <b>mutilate");
					outputText("</b> you with " + pronoun3 + " powerful " + weaponVerb + "! ");
				}
				if (damage > 0) outputText("<b>(<font color=\"#800000\">" + damage + "</font>)</b>")
				else outputText("<b>(<font color=\"#000080\">" + damage + "</font>)</b>")
				if (damage > 0) {
					if (lustVuln > 0 && player.armorName == "barely-decent bondage straps") {
						if (!plural) outputText("\n" + capitalA + short + " brushes against your exposed skin and jerks back in surprise, coloring slightly from seeing so much of you revealed.");
						else outputText("\n" + capitalA + short + " brush against your exposed skin and jerk back in surprise, coloring slightly from seeing so much of you revealed.");
						lust += 10 * lustVuln;
					}
				}
				statScreenRefresh();
			}
			kihaSPOIDAHAI();
		}

		//SPIDER HORDE WEB - Hit
		private  spoidahHordeWebLaunchahs(): void {
			//SPIDER HORDE WEB - Miss (guaranteed if turns 1-3 and PC lost to Kiha)
			if (hasStatusEffect(StatusEffects.MissFirstRound) || player.getEvasionRoll()) {
				outputText("One of the driders launches a huge glob of webbing right at you!  Luckily, Kiha manages to burn it out of the air with a well-timed gout of flame!");
				combatRoundOver();
			}
			else {
				outputText("Some of the spiders and driders launch huge globs of wet webbing right at you, hitting you in the torso!  You try to wiggle out, but it's no use; you're stuck like this for now.  Though comfortingly, the driders' open stance and self-satisfaction allow Kiha to blast them in the side with a huge conflagration!");
				//(PC cannot attack or use spells for one turn; can use Magical Special and Possess)
				player.createStatusEffect(StatusEffects.UBERWEB,0,0,0,0);
				HP -= 250;
				combatRoundOver();
			}
		}

		private  kihaSPOIDAHAI(): void {
			outputText("[pg]");
			game.spriteSelect(SpriteDb.s_kiha);
			outputText("While they're tangled up with you, however, Kiha takes the opportunity to get in a few shallow swings with her axe, to the accompaniment of crunching chitin.");
			//horde loses HP
			HP -= 50;
			combatRoundOver();
		}

		protected  performCombatAction(): void
		{
			game.spriteSelect(SpriteDb.s_kiha);
			if (rand(2) == 0 || player.hasStatusEffect(StatusEffects.UBERWEB)) spiderStandardAttack();
			else spoidahHordeWebLaunchahs();
		}


		public  defeated(hpVictory: boolean): void
		{
			game.kihaFollower.beatSpiderMob();
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if (pcCameWorms){
				outputText("\n\nThe spiders smile to one at another as they watch your display, then close in...");
				doNext(game.combat.endLustLoss);
			} else {
				game.kihaFollower.loseToSpiderMob();
			}
		}

		public  SpiderMorphMob()
		{
			this.a = "the ";
			this.short = "mob of spiders-morphs";
			this.imageName = "spidermorphmob";
			this.long = "You are fighting a horde of spider-morphs!  A group of some two-dozen spiders and driders approaches you, all baring their teeth.  A pair of large, powerful driders lead the group, their corrupt, lusty stares sending shivers up your spine.  While "+(player.level <= 13?"you'd never face such a large horde on your own":"you could probably handle them alone") +", you have a powerful ally in this fight - the dragoness Kiha!";
			this.race = "Spider-Morphs & Driders";
			this.plural = true;
			this.pronoun1 = "they";
			this.pronoun2 = "them";
			this.pronoun3 = "their";
			this.createCock(9,2,CockTypesEnum.HUMAN);
			this.balls = 2;
			this.ballSize = 1;
			this.cumMultiplier = 3;
			// this.hoursSinceCum = 0;
			this.createVagina(false, Vagina.WETNESS_SLICK, Vagina.LOOSENESS_LOOSE);
			createBreastRow(0);
			this.ass.analLooseness = Ass.LOOSENESS_STRETCHED;
			this.ass.analWetness = Ass.WETNESS_SLIME_DROOLING;
			this.tallness = rand(8) + 70;
			this.hips.rating = Hips.RATING_AMPLE+2;
			this.butt.rating = Butt.RATING_LARGE;
			this.skin.tone = "red";
			this.hair.color = "black";
			this.hair.length = 15;
			initStrTouSpeInte(60, 50, 99, 99);
			initLibSensCor(35, 35, 20);
			this.weaponName = "claws";
			this.weaponVerb="claws";
			this.armorName = "chitin";
			this.bonusHP = 1200;
			this.lustVuln = .2;
			this.temperment = TEMPERMENT_LOVE_GRAPPLES;
			this.level = 18;
			this.gems = rand(25) +40;
			this.special1 = game.combat.packAttack;
			this.special2 = game.combat.lustAttack;
			this.tail.type = Tail.SPIDER_ABDOMEN;
			this.drop = NO_DROP;
			checkMonster();
		}
		
	}


