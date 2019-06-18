	
	export class Phoenix extends Monster
	{
		protected  doubleSlash(): void {
			outputText("You fall back under a hail of feints and jabs as your enemy darts at you, swinging furiously. The sheer number of blows the phoenix lays against you is incredible, forcing you backwards as you try to deflect the flurry of deadly strikes.  ");
			if (player.getEvasionRoll()) {
				outputText("You are able to parry one of her blows with enough force to push her back, giving you a little more breathing room.");
			}
			if (combatBlock(true)) {
				outputText("You are able to raise your " + player.shieldName + " in time to block the phoenix's blows.");
			}
			else {
				outputText("Seeing an opening, the phoenix forces her way through your guard with a quick pair of powerful strikes. ");
				//Get hit
			var  damage: number = str + weaponAttack + rand(80);
				damage = player.reduceDamage(damage);
				player.takeDamage(damage, true);
				//Get hit again
				damage = str + weaponAttack + rand(80);
				damage = player.reduceDamage(damage);
				player.takeDamage(damage, true);
			}
			combatRoundOver();
		}
		
		protected  phoenixFireBreath(): void {
			if (!hasStatusEffect(StatusEffects.Uber)) {
				outputText("Suddenly the phoenix disengages from you and loops through the air, giving out a loud cry before she starts to barrel down at you. She’s clearly building up for something, so you’d better wait until she makes her move if you want a chance to dodge!");
				createStatusEffect(StatusEffects.Uber, 0, 0, 0, 0);
			}
			else {
				if (flags[kFLAGS.IN_COMBAT_USE_PLAYER_WAITED_FLAG] == 1) {
					outputText("You dive to the ground just as the phoenix breathes a great gout of flame at you. The fire blooms over your back, singeing your [armor], but doesn’t harm you. As she swoops low you see the phoenix scowl, looking quite disappointed, but it’s clear she isn’t done yet!");
				}
				//MASSIVE DAMAGE!
				else {
					outputText("As she zooms over you a great gout of flame erupts from the phoenix’s mouth! You dive out of the way, but all too late. The wall of fire rolls over you as you leap through it, the brief contact with the inferno searing both you and your " + player.armorName + " badly. ");
				var  damage: number = str + weaponAttack + 300 + rand(250);
					damage = player.reduceDamage(damage);
					player.takeDamage(damage, true);
				}
				removeStatusEffect(StatusEffects.Uber);
			}
			combatRoundOver();
		}
		
		protected  lustBang(): void {
			outputText("\"<i>Here, CATCH!</i>\" The phoenix shouts, lobbing a small, circular canister at you before ducking behind her sturdy shield. Oh shit!");
			if (player.getEvasionRoll()) {
				outputText("Luckily, the metal cylinder bounces off the uneven terrain of the mountain, giving you just enough time to dive away as a huge cloud of pink erupts into the air. The phoenix glances around her shield, face darkening as she sees you readying yourself for another strike instead of writhing on the ground in an oversensitive pile of lust.");
			}
			else {
				outputText("You cough and hack, waving your arms to try and dissipate the fog, but by the time the cloud has faded you feel lightheaded and lusty. Your");
				if (player.hasCock()) outputText("shaft quickly engorges inside your armour, already leaking precum down your leg");
				if (player.hasCock() && player.hasVagina()) outputText("whilst your");
				if (player.hasVagina()) outputText("thighs are suddenly soaked by a torrent of girlcum as your body reacts to the potent chemicals");
				outputText(".");
			var  lustDmg: number = 30 + rand(30);
				player.takeLustDamage(lustDmg, true);
			}
			combatRoundOver();
		}
		
		protected  performCombatAction(): void
		{
		var  choice: number = rand(4);
			if (hasStatusEffect(StatusEffects.Uber)) {
				phoenixFireBreath();
				return;
			}
			switch (choice) {
				case 0:
					eAttack();
					break;
				case 1:
					doubleSlash();
					break;
				case 2:
					phoenixFireBreath();
					break;
				case 3:
					lustBang();
					break;
				default:
					eAttack();
			}
		}
		
		public  defeated(hpVictory: boolean): void
		{
			game.highMountains.phoenixScene.winAgainstPhoenix();
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if (pcCameWorms) {
				outputText("\n\nYour foe doesn't seem disgusted enough to leave...");
				doNext(game.combat.endLustLoss);
			} else {
				game.highMountains.phoenixScene.loseToPhoenix();
			}
		}
		
		public  Phoenix() 
		{
			this.a = "the ";
			this.short = "phoenix";
			this.imageName = "phoenix";
			this.long = "The figure facing you is one of the dangerous hybrids of the Salamander and Harpy races; a Phoenix created by the self proclaimed harpy \"Queen\". Her appearance is close to a normal, crimson-feathered harpy, save for a few noticeable additions. Wings larger than a normal harpy’s sprout from her back, probably to make up for the fact that the usual harpy armwings fade into scaled forearms, an obvious marker of her Salamander parentage. Her lower body is much the same, feather-covered hips and thighs merging with scales around the knee and ending in a clawed lizard foot; not to mention the long, fiery tail that swishes to and from behind her as she circles you. \n\nStanding perhaps six and a half feet tall, her large breasts strain against the tarnished metal of her vest, just as her ample hips threaten to burst free from her tight loincloth. A half-erect lizard cock pokes out pushing the cloth to one side and allowing for a clear view of her slick, puffy pussy just below it. Her scimitar cuts great swaths through the air as she darts through the air above you, taking full advantage of the open space you find yourselves in.";
			this.race = "Phoenix";
			// this.plural = false;
			this.createCock(8, 1.2, CockTypesEnum.LIZARD);
			this.createVagina(false, Vagina.WETNESS_SLICK, Vagina.LOOSENESS_LOOSE);
			this.createStatusEffect(StatusEffects.BonusVCapacity, 40, 0, 0, 0);
			createBreastRow(Appearance.breastCupInverse("D"));
			this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
			this.ass.analWetness = Ass.WETNESS_MOIST;
			this.createStatusEffect(StatusEffects.BonusACapacity,20,0,0,0);
			this.tallness = 6 * 12 + 6;
			this.tail.type = Tail.LIZARD;
			this.hips.rating = Hips.RATING_CURVY;
			this.butt.rating = Butt.RATING_JIGGLY;
			this.lowerBody.type = LowerBody.HARPY;
			this.skin.tone = "light";
			this.skin.type = Skin.LIZARD_SCALES;
			this.skin.desc = "crimson";
			this.hair.color = "red";
			this.hair.length = 16;
			initStrTouSpeInte(100, 70, 100, 65);
			initLibSensCor(50, 30, 45);
			this.weaponName = "scimitar and shield";
			this.weaponVerb="slash";
			this.weaponAttack = 30;
			this.armorName = "chainmail and loincloth";
			this.armorDef = 26;
			this.bonusHP = 750;
			this.lust = 10;
			this.lustVuln = .7;
			this.temperment = TEMPERMENT_RANDOM_GRAPPLES;
			this.level = 23;
			this.gems = 30 + rand(25);
			this.drop = new ChainedDrop().add(weapons.SCIMTR0,1/20)
					.add(useables.EBNFLWR, 1/10)
					.elseDrop(NO_DROP);
			this.wings.type = Wings.HARPY;
			this.special1 = doubleSlash;
			this.special2 = phoenixFireBreath;
			this.special3 = lustBang;
			checkMonster();
		}
		
	}


