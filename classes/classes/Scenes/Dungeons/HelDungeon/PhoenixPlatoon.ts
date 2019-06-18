
	export class PhoenixPlatoon extends Monster
	{
		//ATTACK ONE: SPARTAN RUSH
		public  phoenixPlatoonRush(): void {
			outputText("You fall back under a hail of scimitar attacks.  The sheer number of phoenixes attacking is bad enough, but their attacks are perfectly coordinated, leaving virtually no room for escape or maneuver without getting hit!\n");
			//(Effect: Multiple medium-damage attacks)
			//(Effect: Multiple light attacks)
			createStatusEffect(StatusEffects.Attacks,2+rand(3),0,0,0);
			eAttack();
			combatRoundOver();
		}

		//ATTACK TWO: FIRE BREATH
		public  phoenixPlatoonFireBreath(): void {
			outputText("Suddenly, the shield wall parts, revealing a single member of the platoon, a particularly muscular girl with a raging erection.  Before you can consider what's going on, she rears back and huffs at you.  To your horror, a great gout of fire erupts from her mouth, rolling towards you.  You dive, but are still caught partially in the inferno.");
			//(Effect: One heavy-damage attack)
		var  damage: number = 100 + rand(50);
			damage = player.takeDamage(damage, true);
			combatRoundOver();
		}
		//ATTACK THREE: LUSTBANG GRENADE
		public  phoenixPlatoonLustbang(): void {
			outputText("\"<i>LUSTBANG OUT!</i>\" one of the rear-most phoenixes shouts, causing all the other warriors to duck down behind their shields.  Oh, shit!  A large glass sphere rolls out from the shield wall, and immediately explodes in a great pink cloud.  You cough and wave your arms, but by the time the cloud has dissipated, you feel lightheaded and lusty, barely able to resist the urge to throw yourself at the phoenixes and beg for their cocks and cunts.");
			//(Effect: Large lust increase)
			player.takeLustDamage(40, true);
			combatRoundOver();
		}

		public  phoenixPlatoonAI(): void {
			if (!hasStatusEffect(StatusEffects.Platoon)) {
				phoenixPlatoonRush();
				createStatusEffect(StatusEffects.Platoon,0,0,0,0);
			}
			else if (statusEffectv1(StatusEffects.Platoon) == 0) {
				phoenixPlatoonFireBreath();
				addStatusValue(StatusEffects.Platoon,1,1);
			}
			else {
				phoenixPlatoonLustbang()
				removeStatusEffect(StatusEffects.Platoon);
			}
		}
		
		protected  performCombatAction(): void
		{
			phoenixPlatoonAI();
		}
		
		public  defeated(hpVictory: boolean): void
		{
			game.dungeons.heltower.phoenixPlatoonLosesToPC();
		}
		
		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			game.dungeons.heltower.phoenixPlatoonMurdersPC();
		}
		
		public  PhoenixPlatoon()
		{
			this.a = "the ";
			this.short = "phoenix platoon";
			this.imageName = "phoenixmob";
			this.long = "You are faced with a platoon of heavy infantry, all armed to the teeth and protected by chain vests and shields. They look like a cross between salamander and harpy, humanoid save for crimson wings, scaled feet, and long fiery tails. They stand in a tight-knit shield wall, each phoenix protecting herself and the warrior next to her with their tower-shield. Their scimitars cut great swaths through the room as they slowly advance upon you.";
			this.race = "Phoenixes";
			this.plural = true;
			this.pronoun1 = "they";
			this.pronoun2 = "them";
			this.pronoun3 = "their";
			this.createCock();
			this.balls = 2;
			this.ballSize = 1;
			this.cumMultiplier = 3;
			this.createVagina(false, Vagina.WETNESS_SLAVERING, Vagina.LOOSENESS_LOOSE);
			createBreastRow(Appearance.breastCupInverse("D"));
			this.ass.analLooseness = Ass.LOOSENESS_STRETCHED;
			this.ass.analWetness = Ass.WETNESS_DRY;
			this.tallness = rand(8) + 70;
			this.hips.rating = Hips.RATING_AMPLE+2;
			this.butt.rating = Butt.RATING_LARGE;
			this.lowerBody.type = LowerBody.LIZARD;
			this.skin.tone = "red";
			this.hair.color = "black";
			this.hair.length = 15;
			initStrTouSpeInte(70, 60, 120, 40);
			initLibSensCor(40, 45, 50);
			this.weaponName = "spears";
			this.weaponVerb="stab";
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
			this.horns.type = Horns.DRACONIC_X2;
			this.horns.value = 2;
			this.tail.type = Tail.HARPY;
			this.wings.type = Wings.FEATHERED_LARGE;
			this.drop = NO_DROP;
			checkMonster();
		}
		
	}


