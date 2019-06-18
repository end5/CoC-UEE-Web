
	export class MaleSpiderMorph extends AbstractSpiderMorph
	{


		public  defeated(hpVictory: boolean): void
		{
			game.swamp.maleSpiderMorphScene.defeatSpiderBoy();
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if (pcCameWorms){
				outputText("\n\nThe spider flashes a predatory grin while she waits it out...");
				doNext(game.combat.endLustLoss);
			} else {
				game.swamp.maleSpiderMorphScene.loseToMaleSpiderMorph();
			}
		}

		public  MaleSpiderMorph()
		{
			this.a = "the ";
			this.short = "male spider-morph";
			this.imageName = "malespidermorph";
			this.long = "The male spider-morph is completely nude, save for his thigh-high stockings and forearm-length gloves, which upon closer inspection, appear to be actually be part of his body - his exoskeleton.  His exposed skin is pale as the full moon, save for the dusk of his nipples and a patch of jet-black that spreads out over his groin, glossing the male's foreskinned cock and dangling sack in glistening ebon.  His ass is small but well-rounded, with a weighty spider-abdomen hanging from just above.  The spider-man is currently eyeing you with a strange expression and his fangs bared.";
			this.race = "Spider-Morph";
			// this.plural = false;
			this.createCock(6,2);
			this.balls = 2;
			this.ballSize = 2;
			createBreastRow(0);
			this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
			this.ass.analWetness = Ass.WETNESS_DRY;
			this.createStatusEffect(StatusEffects.BonusACapacity,40,0,0,0);
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
			this.armorValue = 70;
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
			this.tail.recharge = 0;
			checkMonster();
		}
		
	}


