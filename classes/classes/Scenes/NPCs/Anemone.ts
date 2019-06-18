
	export class Anemone extends Monster
	{


		public  eAttack(): void
		{
			outputText("Giggling playfully, the anemone launches several tentacles at you.  Most are aimed for your crotch, but a few attempt to caress your chest and face.\n");
			super.eAttack();
		}

		public  eOneAttack(): number
		{
			applyVenom(rand(4 + player.sens / 20) + 1);
			return 1;
		}

		//Apply the effects of AnemoneVenom()
		public  applyVenom(str: number = 1): void
		{
			//First application
		var  ave:AnemoneVenomDebuff = player.createOrFindStatusEffect(StatusEffects.AnemoneVenom) as AnemoneVenomDebuff;
			ave.applyEffect(str);
		}


		public  defeated(hpVictory: boolean): void
		{
			game.anemoneScene.defeatAnemone();
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if (pcCameWorms){
				outputText("\n\nYour foe doesn't seem to mind at all...");
				doNext(game.combat.endLustLoss);
			} else {
				game.anemoneScene.loseToAnemone();
			}
		}

		public  outputAttack(damage: number): void
		{
			outputText("You jink and dodge valiantly but the tentacles are too numerous and coming from too many directions.  A few get past your guard and caress your skin, leaving a tingling, warm sensation that arouses you further.");
		}

		public  Anemone()
		{
			this.a = "the ";
			this.short = "anemone";
			this.imageName = "anemone";
			this.long = "The anemone is a blue androgyne humanoid of medium height and slender build, with colorful tentacles sprouting on her head where hair would otherwise be.  Her feminine face contains two eyes of solid color, lighter than her skin.  Two feathery gills sprout from the middle of her chest, along the line of her spine and below her collarbone, and drape over her pair of small B-cup breasts.  Though you wouldn't describe her curves as generous, she sways her girly hips back and forth in a way that contrasts them to her slim waist quite attractively.  Protruding from her groin is a blue shaft with its head flanged by diminutive tentacles, and below that is a dark-blue pussy ringed by small feelers.  Further down are a pair of legs ending in flat sticky feet; proof of her aquatic heritage.  She smiles broadly and innocently as she regards you from her deep eyes.";
			this.race = "Anemone";
			// this.plural = false;
			this.createCock(7,1,CockTypesEnum.ANEMONE);
			this.createVagina(false, Vagina.WETNESS_SLICK, Vagina.LOOSENESS_LOOSE);
			this.createStatusEffect(StatusEffects.BonusVCapacity, 5, 0, 0, 0);
			createBreastRow(Appearance.breastCupInverse("B"));
			this.ass.analLooseness = Ass.LOOSENESS_NORMAL;
			this.ass.analWetness = Ass.WETNESS_DRY;
			this.createStatusEffect(StatusEffects.BonusACapacity,10,0,0,0);
			this.tallness = 5*12+5;
			this.hips.rating = Hips.RATING_CURVY;
			this.butt.rating = Butt.RATING_NOTICEABLE;
			this.skin.tone = "purple";
			this.hair.color = "purplish-black";
			this.hair.length = 20;
			this.hair.type = Hair.ANEMONE;
			initStrTouSpeInte(40, 20, 40, 50);
			initLibSensCor(55, 35, 50);
			this.weaponName = "tendrils";
			this.weaponVerb="tentacle";
			this.weaponAttack = 5;
			this.armorName = "clammy skin";
			this.bonusHP = 120;
			this.lust = 30;
			this.lustVuln = .9;
			this.temperment = TEMPERMENT_RANDOM_GRAPPLES;
			this.level = 4;
			this.gems = rand(5) + 1;
			this.drop = new WeightedDrop(consumables.DRYTENT, 1);
			checkMonster();
		}
		
	}


