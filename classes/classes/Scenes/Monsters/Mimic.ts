	/**
	 * ...
	 * @author ...
	 */
	export class Mimic extends Monster
	{
		
		public  won(hpVictory: boolean, pcCameWorms: boolean): void {
			game.mimicScene.mimicTentacle2();
		}
		
		public  defeated(hpVictory: boolean): void {
			game.mimicScene.killTheMimic();
		}
		
		
		private  mimicBite(): void {
			outputText("The creature lashes out at you, attempting to bite you! ");
			if (player.getEvasionRoll()) {
				outputText("Thankfully you're quick enough to avoid its gaping maw!");
			}
			else {
				outputText("Ow! The mouth rends your arm and it hurts like hell! ");
			var  damage: number = (10 + (str / 2) + rand(str / 3)) * (1 + (player.newGamePlusMod() * 0.3));
				damage = player.reduceDamage(damage);
				if (damage < 10) damage = 10;
				player.takeDamage(damage, true);
			}
			combatRoundOver();
		}
		
		protected  performCombatAction(): void
		{
			if (player.hasStatusEffect(StatusEffects.KnockedBack)) {
				outputText("The creature sits tight, being unable to reach you.");
				combatRoundOver();
				return;
			}
			
			if (rand(2) == 0) {
				eAttack();
				combatRoundOver();
			} else {
				mimicBite();
			}
		}
		
		public  Mimic(type: number)
		{
			this.a = "the ";
			this.short = "mimic";
			switch(type) {
				case 0:
					this.imageName = "mimic-stone";
					this.long = "This strange monster originally disguised as a huge block of grey stone covered in bizarre runes and symbols. Its surface appears to be grey and made of stone. There is a gaping maw with hundreds of teeth inside and a huge tongue lashing about.";
					break;
				case 1:
					this.imageName = "mimic-boob";
					this.long = "This strange monster originally disguised as a huge breast. Its surface appears to be pale, reminiscent of skin. There is a gaping maw where its nipple should be with hundreds of teeth inside and a tiny whippy tongue lashing about. Milky saliva seems to be leaking from its nightmarish mouth.";
					break;
				case 2:
					this.imageName = "mimic-cock";
					this.long = "This strange monster originally disguised as a huge penis. Its surface appears to be pale, reminiscent of skin. There is a gaping maw where its urethra should be with hundreds of teeth inside and a tiny whippy tongue lashing about. There are dozens of tentacles sprouting from its shaft.";
					break;
				case 3:
					this.imageName = "mimic-chest";
					this.long = "This strange monster originally disguised as a wooden chest. Its surface appears to be brown and made of wood. There is a gaping maw where the box and lid meet, with hundreds of teeth inside and a huge tongue lashing about.";
					break;
				default:
					this.imageName = "mimic";
			}
			this.race = "Mimic";
			if (type == 2) 
				this.createCock(80, 16, CockTypesEnum.HUMAN);
			else
				this.initedGenitals = true;
			this.balls = 0;
			this.ballSize = 0;
			if (type == 1)
				createBreastRow(BreastCup.JACQUES00);
			else
				createBreastRow(0);
			this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
			this.ass.analWetness = Ass.WETNESS_DRY;
			this.tallness = rand(24) + 25;
			this.hips.rating = Hips.RATING_BOYISH;
			this.butt.rating = Butt.RATING_TIGHT;
			if (type == 3)
				this.skin.tone = "brown";
			if (type == 1 || type == 2)
				this.skin.tone = "light";
			else
				this.skin.tone = "gray";
			this.hair.color = "none";
			this.hair.length = 0;
			this.pronoun1 = "it";
			this.pronoun2 = "it";
			this.pronoun3 = "its";
			initStrTouSpeInte(30, 45, 15, 5);
			initLibSensCor(45, 45, 100);
			this.weaponName = "mouth";
			this.weaponVerb = "bite";
			this.weaponAttack = 20 + player.level;
			if (type == 3) {
				this.armorName = "wooden surface";
				this.armorDef = 10;
			}
			if (type == 2 || type == 1) {
				this.armorName = "flesh";
				this.armorDef = 0;
			}
			else {
				this.armorName = "stone surface";
				this.armorDef = 25;
			}
			this.lust = 10;
			this.lustVuln = 0;
			this.temperment = TEMPERMENT_LUSTY_GRAPPLES;
			this.level = 6;
			this.gems = rand(30) + 11;
			this.drop = new WeightedDrop().
					add(consumables.PPHILTR,4).
					add(consumables.NUMBOIL,4).
					add(consumables.HUMMUS_,3).
					add(consumables.INCUBID,1).
					add(consumables.SUCMILK,1).
					add(consumables.REDUCTO,1);
			this.special1 = mimicBite;
			checkMonster();
		}
		
	}


