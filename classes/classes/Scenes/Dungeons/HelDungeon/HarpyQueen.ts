
	export class HarpyQueen extends Monster
	{
		public  harpyQueenAI(): void {
			if (rand(4) == 0) eldritchRopes();
			else if (rand(2) == 0) lustSpikeAttack();
			else windSlamAttack();
		}
		//ATTACK ONE: ELDRITCH ROPES
		public  eldritchRopes(): void {
			outputText("The Harpy Queen flicks her left wrist at you. Before you can blink, ropes of white-hot magic hurtle toward you. You manage to duck and dodge a few of them, but a pair still grab your wrists, pulling painfully at your arms.");
			//(Effect: Grab + Physical Damage)
		var  damage: number = 25 + rand(10);
			damage = player.takeDamage(damage, true);
			createStatusEffect(StatusEffects.QueenBind,0,0,0,0);
			combatRoundOver();
		}

		public  ropeStruggles(wait: boolean = false): void {
			clearOutput();
			//Struggle Fail: 
			if (rand(10) > 0 && player.str/5 + rand(20) < 23 || wait) {
				outputText("You give a mighty try, but cannot pull free of the magic ropes!  The Harpy Queen laughs uproariously, pulling at your arms harder.");
				if (player.findPerk(PerkLib.Juggernaut) < 0 && armorPerk != "Heavy") {var damage: number = 25 + rand(10);
				damage = player.takeDamage(damage, true);
				}
			}
			else {
				outputText("With supreme effort, you pull free of the magic ropes, causing the queen to tumble to her hands and knees.");
				removeStatusEffect(StatusEffects.QueenBind);
			}
			combatRoundOver();
		}

		//ATTACK TWO: LUST SPIKE
		public  lustSpikeAttack(): void {
			outputText("The Harpy Queen draws a strange arcane circle in the air, lines of magic remaining wherever the tip of her staff goes.  You try to rush her, but the circle seems to have created some kind of barrier around her.  You can only try to force it open - but too late!  A great pink bolt shoots out of the circle, slamming into your chest.  You suddenly feel light-headed and so very, very horny...");
			//(Effect: Heavy Lust Damage)
			player.takeLustDamage(40, true);
			combatRoundOver();
		}

		//ATTACK THREE: Wind Slam!
		public  windSlamAttack(): void {
			outputText("The queen swings her arm at you and, despite being a few feet away, you feel a kinetic wall slam into you, and you go flying - right into the harpy brood!  You feel claws, teeth and talons dig into you, but you're saved by a familiar pair of scaled arms.  \"<i>Get back in there!</i>\" Helia shouts, throwing you back into the battle!");
			//(Effect; Heavy Damage)
		var  damage: number = 100 + rand(50);
			damage = player.takeDamage(damage, true);
			combatRoundOver();
		}
		
		protected  performCombatAction(): void
		{
			harpyQueenAI();
		}

		public  defeated(hpVictory: boolean): void
		{
			game.dungeons.heltower.harpyQueenDefeatedByPC();
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			game.dungeons.heltower.harpyQueenBeatsUpPCBadEnd();
		}

		public  HarpyQueen()
		{
			this.a = "the ";
			this.short = "Harpy Queen";
			this.imageName = "harpyqueen";
			this.long = "You face the Harpy Queen, a broodmother of epic proportions - literally.  Her hips are amazingly wide, thrice her own width at the least, and the rest of her body is lushly voluptuous, with plush, soft thighs and a tremendous butt.  Her wide wings beat occasionally, sending ripples through her jiggly body.  She wields a towering whitewood staff in one hand, using the other to cast eldritch spells.";
			this.race = "Harpy";
			// this.plural = false;
			this.createVagina(false, Vagina.WETNESS_SLAVERING, Vagina.LOOSENESS_LOOSE);
			createBreastRow(Appearance.breastCupInverse("D"));
			this.ass.analLooseness = Ass.LOOSENESS_STRETCHED;
			this.ass.analWetness = Ass.WETNESS_DRY;
			this.tallness = rand(8) + 70;
			this.hips.rating = Hips.RATING_AMPLE+2;
			this.butt.rating = Butt.RATING_LARGE;
			this.lowerBody.type = LowerBody.HARPY;
			this.skin.tone = "red";
			this.skin.type = Skin.PLAIN;
			this.skin.desc = "feathers";
			this.hair.color = "black";
			this.hair.length = 15;
			initStrTouSpeInte(70, 60, 120, 40);
			initLibSensCor(40, 45, 50);
			this.weaponName = "eldritch staff";
			this.weaponVerb="thwack";
			this.weaponAttack = 20;
			this.armorName = "armor";
			this.armorDef = 20;
			this.bonusHP = 1000;
			this.lust = 20;
			this.lustVuln = .15;
			this.temperment = TEMPERMENT_LOVE_GRAPPLES;
			this.level = 20;
			this.gems = rand(25) +160;
			this.additionalXP = 50;
			this.tail.type = Tail.HARPY;
			this.wings.type = Wings.FEATHERED_LARGE;
			this.drop = NO_DROP;
			this.createPerk(PerkLib.ImprovedSelfControl, 0, 0, 0, 0);
			checkMonster();
		}
		
	}


