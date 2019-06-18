	
	export class LizanRogue extends Monster
	{
		//1 - str
		//2 - tou
		//3 - spe
		//4 - sens
		public  blowGun(): void {
			if (player.getEvasionRoll()) {
				outputText("The lizan flings himself back.  In the air he puts a blowgun to his lips.  You move just in time to avoid the tiny dart.");
			}
			else {
				outputText("The lizan flings himself back.  In the air he puts his blowgun to his lips and fires a single dart into your neck.  As you pull it out your limbs begin to feel like wet noodles, it appears you’ve been poisoned.");
				(player.createOrFindStatusEffect(StatusEffects.LizanBlowpipe) as LizanBlowpipeDebuff).debuffStrSpe();
			}
			combatRoundOver();
		}
		
		public  immaHurtYouBadly(): void {
			if (player.getEvasionRoll()) {
				outputText("The lizan Rushes at you.  As you raise your [weapon] to defend yourself he dives to the side, using a blowgun to fire a single dart at you.  You somehow manage to dodge it.");
			}
			else {
				outputText("The lizan rushes at you.  As you raise your [weapon] to defend yourself he dives to the side, using his blowgun to fire a single stinging dart into your neck.  You pull out the dart and your skin begins to feel hypersensitive, you’re going to have trouble defending yourself");
				game.dynStats("tou", -5, "sens", 5);
				(player.createOrFindStatusEffect(StatusEffects.LizanBlowpipe) as LizanBlowpipeDebuff).debuffTouSens();
			}
			combatRoundOver();
		}
		
		public  wingstickThrow(): void {
			if (player.getEvasionRoll()) {
				outputText("The lizan zips to the side and you hear the whistle of something being thrown. You sidestep just in time to see a wingstick fly past.");
			}
			else {
				outputText("The lizan zips to the side and as you move to follow you feel something sharp cut across your body. He must have thrown something. ");
			var  damage: number = 40 + rand(60);
				player.takeDamage(damage, true);
			}
			combatRoundOver();
		}
				
		public  tongueAttack(): void {
			if (player.getEvasionRoll()) {
				outputText("All you see is a flash of pink and without even thinking you twist out of its way and watch the lizan’s long tongue snap back into his mouth.");
			}
			else {
				outputText("All you see is a flash of pink as the lizan’s long tongue hits your eyes. Some kind of chemical reaction causes your eyes to burn, you’ve been blinded!");
				if (!player.hasStatusEffect(StatusEffects.Blind)) player.createStatusEffect(StatusEffects.Blind, 1 + rand(2), 0, 0, 0)
			}
			combatRoundOver();
		}
		
		protected  chooseBlowpipe(): void {
			if (rand(2) == 0) blowGun();
			else immaHurtYouBadly();
		}
		
		public  defeated(hpVictory: boolean): void
		{
			game.bog.lizanScene.winAgainstLizan();
		}
		
		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			game.bog.lizanScene.loseToLizan();
		}
		
		private  SKIN_VARIATIONS: any[] = ["emerald", "azure", "scarlet", "violet", "obsidian", "amber", "silver"];
		
		public  LizanRogue() 
		{
		var  skinToneAdj: string = randomChoice(SKIN_VARIATIONS);
			this.skin.tone = skinToneAdj;
			this.skin.setType(Skin.LIZARD_SCALES);
			this.a = "the ";
			this.short = "lizan rogue";
			this.imageName = "lizanrogue";
			this.long = "A rogue lizan male stands before you, watching your every move with quick yellow eyes. His slim body is covered in glistening " + skin.tone + " scales. His strong tail swings back and forth as he shifts his weight, a fluid movement that hints at his speed.  He wears a simple loincloth to protect his modesty to which a small pack is belted.";
			this.race = "Lizan";
			// this.plural = false;
			createBreastRow(Appearance.breastCupInverse("flat"));
			this.createCock(8, 3, CockTypesEnum.LIZARD);
			this.createCock(8, 3, CockTypesEnum.LIZARD);
			this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
			this.ass.analWetness = Ass.WETNESS_MOIST;
			this.tallness = 60 + rand(10);
			this.hips.rating = Hips.RATING_BOYISH;
			this.butt.rating = Butt.RATING_TIGHT;
			this.skin.desc = "skin";
			this.hair.color = "black";
			this.hair.length = 15;
			initStrTouSpeInte(60, 70, 80, 55);
			initLibSensCor(20, 10, 0);
			this.weaponName = "claws";
			this.weaponVerb="claw";
			this.weaponAttack = 30;
			this.armorName = "loincloth";
			this.armorDef = 8;
			this.bonusHP = 350;
			this.lust = 20;
			this.lustVuln = .7;
			this.temperment = TEMPERMENT_LOVE_GRAPPLES;
			this.level = 16;
			this.gems = 10 + rand(50);
			this.drop = new WeightedDrop().add(consumables.REPTLUM, 5)
					.add(consumables.SMALL_EGGS, 2)
					.add(consumables.OVIELIX,2)
					.add(consumables.W_STICK,1);
			this.createPerk(PerkLib.Evade, 0, 0, 0, 0);
			this.createPerk(PerkLib.Precision, 0, 0, 0, 0);
			this.createPerk(PerkLib.Resistance, 0, 0, 0, 0);
			this.createPerk(PerkLib.Tactician, 0, 0, 0, 0);
			this.special1 = chooseBlowpipe;
			this.special2 = wingstickThrow;
			this.special3 = tongueAttack;
			checkMonster();
		}
		
	}


