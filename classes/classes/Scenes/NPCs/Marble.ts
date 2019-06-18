
	export class Marble extends Monster
	{
		private  marbleSpecialAttackOne(): void {
			//Special1: Heavy overhead swing, high chance of being avoided with evasion, does heavy damage if it hits.
		var  damage: number = 0;
			//Blind dodge change
			if (hasStatusEffect(StatusEffects.Blind)) {
				outputText("Marble unwisely tries to make a massive swing while blinded, which you are easily able to avoid.");
				combatRoundOver();
				return;
			}
			//Determine if dodged!
			if (player.spe - spe > 0 && int(Math.random()*(((player.spe-spe)/4) +80)) > 60) {
				outputText("You manage to roll out of the way of a massive overhand swing.");
				combatRoundOver();
				return;
			}
			//Determine if evaded
			if (player.findPerk(PerkLib.Evade) >= 0 && rand(100) < 60) {
				outputText("You easily sidestep as Marble tries to deliver a huge overhand blow.");
				combatRoundOver();
				return;
			}
			//Determine damage - str modified by enemy toughness!
			damage = int((str + 20 + weaponAttack) - Math.random()*(player.tou) - player.armorDef);
			if (damage <= 0) {
				damage = 0;
				//Due to toughness or amor...
				outputText("You somehow manage to deflect and block Marble's massive overhead swing.");
			}
			if (damage > 0) {
				outputText("You are struck by a two-handed overhead swing from the enraged cow-girl.  ");
				damage = player.takeDamage(damage, true);
			}
			statScreenRefresh();
			combatRoundOver();
		}
		private  marbleSpecialAttackTwo(): void {
			//Special2: Wide sweep; very high hit chance, does low damage.
		var  damage: number = 0;
			//Blind dodge change
			if (hasStatusEffect(StatusEffects.Blind)) {
				outputText("Marble makes a wide sweeping attack with her hammer, which is difficult to avoid even from a blinded opponent.\n");
			}
			//Determine if evaded
			if (player.findPerk(PerkLib.Evade) >= 0 && rand(100) < 10) {
				outputText("You barely manage to avoid a wide sweeping attack from marble by rolling under it.");
				combatRoundOver();
				return;
			}
			//Determine damage - str modified by enemy toughness!
			damage = int((str + 40 + weaponAttack) - Math.random()*(player.tou) - player.armorDef);
			damage /= 2;
			if (damage <= 0) {
				damage = 0;
				//Due to toughness or amor...
				outputText("You easily deflect and block the damage from Marble's wide swing.");
			}
			outputText("Marble easily hits you with a wide, difficult to avoid swing.  ");
			if (damage > 0) player.takeDamage(damage, true);
			statScreenRefresh();
			combatRoundOver();
		}

		public  defeated(hpVictory: boolean): void
		{
			game.marbleScene.marbleFightWin();
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			game.marbleScene.marbleFightLose();
		}

		public  Marble()
		{
			//trace("Marble Constructor!");
			this.a = "";
			this.short = "Marble";
			this.imageName = "marble";
			this.long = "Before you stands a female humanoid with numerous cow features, such as medium-sized cow horns, cow ears, and a cow tail.  She is very well endowed, with wide hips and a wide ass.  She stands over 6 feet tall.  She is using a large two handed hammer with practiced ease, making it clear she is much stronger than she may appear to be.";
			this.race = "Cow-Girl";
			// this.plural = false;
			this.createVagina(false, Vagina.WETNESS_NORMAL, Vagina.LOOSENESS_NORMAL);
			createBreastRow(Appearance.breastCupInverse("F"));
			this.ass.analLooseness = Ass.LOOSENESS_VIRGIN;
			this.ass.analWetness = Ass.WETNESS_DRY;
			this.tallness = 6*12+4;
			this.hips.rating = Hips.RATING_CURVY;
			this.butt.rating = Butt.RATING_LARGE;
			this.lowerBody.type = LowerBody.HOOFED;
			this.skin.tone = "pale";
			this.hair.color = "brown";
			this.hair.length = 13;
			initStrTouSpeInte(75, 70, 35, 40);
			initLibSensCor(25, 45, 40);
			this.weaponName = "large hammer";
			this.weaponVerb="hammer-blow";
			this.weaponAttack = 10;
			this.armorName = "tough hide";
			this.armorDef = 5;
			this.temperment = TEMPERMENT_RANDOM_GRAPPLES;
			this.level = 7;
			this.gems = rand(5) + 25;
			this.drop = new WeightedDrop(weapons.L_HAMR0, 1);
			this.tail.type = Tail.COW;
			this.special1 = marbleSpecialAttackOne;
			this.special2 = marbleSpecialAttackTwo;
			checkMonster();
		}

	}


