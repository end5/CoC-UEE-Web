
	export class GreenSlime extends Monster
	{
		
		public  defeated(hpVictory: boolean): void
		{
			game.lake.greenSlimeScene.slimeVictory();
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if (pcCameWorms) {
				outputText("\n\nThe slime doesn't even seem to notice.\n\n");
			}
			doNext(game.lake.greenSlimeScene.slimeLoss);
		}
		
		private  lustAttack(): void {
			outputText("The creature surges forward slowly with a swing that you easily manage to avoid.  You notice traces of green liquid spurt from the creature as it does, forming a thin mist that makes your skin tingle with excitement when you inhale it.");
			player.takeLustDamage(player.lib / 10 + 8, true);
			doNext(game.playerMenu);
		}
		
		private  lustReduction(): void {
			outputText("The creature collapses backwards as its cohesion begins to give out, and the faint outline of eyes and a mouth form on its face.  Its chest heaves as if it were gasping, and the bolt upright erection it sports visibly quivers and pulses before relaxing slightly.");
			lust -= 13;
			doNext(game.playerMenu);
		}
		
		public  GreenSlime()
		{
			//trace("GreenSlime Constructor!");
			this.a = "a ";
			this.short = "green slime";
			this.imageName = "greenslime";
			this.long = "The green slime has a normally featureless face that sits on top of wide shoulders that sprout into thick, strong arms.  Its torso fades into an indistinct column that melds into the lump of ooze on the ground that serves as a makeshift form of locomotion.";
			this.race = "Slime";
			// this.plural = false;
			this.createCock(18, 2, CockTypesEnum.HUMAN);
			this.cumMultiplier = 3;
			this.hoursSinceCum = 20;
			this.pronoun1 = "it";
			this.pronoun2 = "it";
			this.pronoun3 = "its";
			createBreastRow(0);
			this.ass.analLooseness = Ass.LOOSENESS_STRETCHED;
			this.ass.analWetness = Ass.WETNESS_SLIME_DROOLING;
			this.tallness = rand(8) + 80;
			this.hips.rating = Hips.RATING_AMPLE;
			this.butt.rating = Butt.RATING_LARGE;
			this.lowerBody.type = LowerBody.GOO;
			this.skin.tone = "green";
			initStrTouSpeInte(25, 20, 10, 5);
			initLibSensCor(50, 60, 20);
			this.weaponName = "hands";
			this.weaponVerb="slap";
			this.armorName = "gelatinous skin";
			this.bonusHP = 30;
			this.lust = 30;
			this.temperment = TEMPERMENT_LOVE_GRAPPLES;
			this.level = 2;
			this.gems = rand(5) + 1;
			this.drop = new ChainedDrop().add(weapons.PIPE, 1 / 10)
					.add(consumables.WETCLTH, 1 / 2)
					.elseDrop(useables.GREENGL);
			this.special1 = lustReduction;
			this.special2 = lustAttack;
			this.special3 = lustAttack;
			checkMonster();
		}

	}


