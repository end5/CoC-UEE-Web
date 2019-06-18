
	/**
	 * ...
	 * @author ...
	 */
	export class FemaleSpiderMorph extends AbstractSpiderMorph
	{


		public  defeated(hpVictory: boolean): void
		{
			game.swamp.femaleSpiderMorphScene.defeatASpiderBitch();
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if (pcCameWorms){
				outputText("\n\nThe spider flashes a predatory grin while she waits it out...");
				doNext(game.combat.endLustLoss);
			} else {
				game.swamp.femaleSpiderMorphScene.loseToFemaleSpiderMorph();
			}
		}

		public  FemaleSpiderMorph()
		{
			this.a = "the ";
			this.short = "female spider-morph";
			this.imageName = "femalespidermorph";
			this.long = "The female spider-morph is completely nude, save for her thigh-high stockings and forearm-length gloves, which upon closer inspection, appear to be actually be part of her body - her exoskeleton.  Her exposed skin is pale as the full moon, save for the dusky skin of her nipples and the black-skinned delta of her sex.  Her breasts and ass are both full and well-rounded, and just above her ass-cheeks there's a bulbous spider-abdomen.  The spider-girl is currently eyeing you with a strange expression and her fangs bared.";
			this.race = "Spider-Morph";
			// this.plural = false;
			this.createVagina(false, Vagina.WETNESS_DROOLING, Vagina.LOOSENESS_LOOSE);
			this.createStatusEffect(StatusEffects.BonusVCapacity, 40, 0, 0, 0);
			createBreastRow(Appearance.breastCupInverse("E+"));
			this.ass.analLooseness = Ass.LOOSENESS_VIRGIN;
			this.ass.analWetness = Ass.WETNESS_DRY;
			this.createStatusEffect(StatusEffects.BonusACapacity,30,0,0,0);
			this.tallness = 7*12+6;
			this.hips.rating = Hips.RATING_CURVY+2;
			this.butt.rating = Butt.RATING_LARGE+1;
			this.lowerBody.type = LowerBody.CHITINOUS_SPIDER_LEGS;
			this.skin.tone = "dusky";
			this.hair.color = "red";
			this.hair.length = 13;
			initStrTouSpeInte(60, 50, 99, 99);
			initLibSensCor(35, 35, 20);
			this.weaponName = "dagger";
			this.weaponVerb="stab";
			this.weaponAttack = 15;
			this.armorName = "exoskeleton";
			this.armorDef = 14;
			this.armorPerk = "";
			this.armorValue = 50;
			this.bonusHP = 200;
			this.lust = 20;
			this.lustVuln = .6;
			this.temperment = TEMPERMENT_RANDOM_GRAPPLES;
			this.level = 13;
			this.gems = rand(10) + 10;
			this.drop = new WeightedDrop().add(consumables.S_GOSSR,5)
					.add(useables.T_SSILK,1)
					.add(undefined,4);
			this.tail.type = Tail.SPIDER_ABDOMEN;
			checkMonster();
		}
		
	}


