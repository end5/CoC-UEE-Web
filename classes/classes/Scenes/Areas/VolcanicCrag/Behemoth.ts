	
	export class Behemoth extends Monster
	{
		public  tailWhip(): void {
			outputText("The behemoth charges at you, pivoting to swing his spiked tail as his muscles flex.  ");
			if (player.getEvasionRoll()) {
				outputText("Luckily, you leap back in time to dodge and he lets out a low chuckle.  \"Not bad,\" he says, and it's hard not to flush at his husky voice.");
				combatRoundOver();
				return;
			}
			else {
				outputText("You're too slow and the impact leaves you bruised and bleeding, the spines scraping your body.  You're lucky it's not deeper, but that really hurts!  <b>Your defense has been reduced!</b>  ");
			var  damage: number = str + level;
				damage = player.reduceDamage(damage)
				player.takeDamage(damage, true);
			}
			if (hasStatusEffect(StatusEffects.TailWhip)) addStatusValue(StatusEffects.TailWhip, 1, 5);
			else createStatusEffect(StatusEffects.TailWhip, 5, 0, 0, 0);
			combatRoundOver();
		}
		
		public  tease(): void {
			outputText("\"Want a piece of this?\" the behemoth says, and you avert your eyes as he flips up his loincloth, his huge cock alluring under the red silk and gold chains.");
			player.takeLustDamage(10 + (player.cor / 10) + (player.lib / 10), true);
			combatRoundOver();
		}
		
		public  defeated(hpVictory: boolean): void {
			game.volcanicCrag.behemothScene.winAgainstBehemoth();
		}
		
		public  won(hpVictory: boolean, pcCameWorms: boolean): void {
			if (pcCameWorms){
				outputText("\n\nYour opponent doesn't seem to care.");
				doNext(game.combat.endLustLoss);
			} else {
				game.volcanicCrag.behemothScene.loseToBehemoth();
			}
		}
		
		public  Behemoth() 
		{
			this.a = "the ";
			this.short = "Behemoth";
			this.imageName = "behemoth";
			this.long = "Before you stands a hulking behemoth, about nine feet tall, with a feline face and long forward-pointing horns that leave him looking even larger. The hair on his head is black, though it quickly transitions into a blond mane that follows along his back and to his tail, and the rest of his muscular body is covered with purple fur. Dark spines protrude from his back, and though he carries no weaponry and wears only an elegant red loincloth, his fierce claws leave him plenty intimidating.";
			this.race = "Behemoth";
			// this.plural = false;
			this.createCock(18, 2.5, CockTypesEnum.HUMAN);
			this.balls = 2;
			this.ballSize = 3;
			this.cumMultiplier = 25;
			createBreastRow(Appearance.breastCupInverse("flat"));
			this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
			this.ass.analWetness = Ass.WETNESS_NORMAL;
			this.tallness = 9*12;
			this.hips.rating = Hips.RATING_BOYISH;
			this.butt.rating = Butt.RATING_TIGHT;
			this.skin.tone = "purple";
			this.skin.setType(Skin.FUR);
			this.hair.color = "black";
			this.hair.length = 8;
			this.ears.type = Ears.ELFIN;
			this.face.type = Face.CAT;
			this.horns.value = 7;
			this.horns.type = Horns.DRACONIC_X2
			this.lowerBody.type = LowerBody.CAT
			this.tail.type = Tail.BEHEMOTH
			initStrTouSpeInte(125, 100, 80, 105);
			initLibSensCor(35, 15, 15);
			this.weaponName = "claws";
			this.weaponVerb="claw";
			this.weaponAttack = 30;
			this.armorName = "loincloth";
			this.armorDef = 4;
			this.bonusHP = 800;
			this.lust = 15;
			this.lustVuln = 0.3;
			this.temperment = TEMPERMENT_LUSTY_GRAPPLES;
			this.level = 25;
			this.gems = 60 + rand(30);
			this.drop = NO_DROP;
			this.special1 = tailWhip;
			this.special2 = tease;
			//this.special3 = aerialRave;
			checkMonster();
		}
		
	}


