
	export class Marae extends Monster
	{
		
		//Corrupted Marae's specials
		public  tentacleAttack(): void {
			outputText("You spot barrage of tentacles coming your way! You attempt to dodge your way out ");
		var  evade: string = player.getEvasionReason();
			if (evade == EVASION_SPEED)
			{
				outputText("and you successfully dodge her tentacles!");
			}
			else if (evade != undefined)
			{
				outputText("and you successfully dodge her tentacles thanks to your superior evasion!");
			}
			else
			{
				outputText("but you fail and get hit instead! The feel of the tentacles left your groin slightly warmer. ");
			var  damage: number = ((str + 100) + rand(50))
				player.takeLustDamage(rand(5) + 5, true);
				damage = player.reduceDamage(damage);
				player.takeDamage(damage, true);
			}
			combatRoundOver();
		}
		
		public  tentacleRape(): void {
			
			outputText("You spot barrage of tentacles coming your way! The tentacles are coming your way, aiming for your groin! ");
		var  evade: string = player.getEvasionReason();
			if (evade == EVASION_SPEED)
			{
				outputText("You manage to successfully run from her tentacles! ");
			}
			else if (evade != undefined)
			{
				outputText("You manage to avoid her tentacles thanks to your superior evasion!");
			}
			else
			{
				outputText("You attempt to slap away the tentacles but it's too late! The tentacles tickle your groin and you can feel your [ass] being teased! \"<i>You know you want me!</i>\" Marae giggles. ");
			var  lustDmg: number = (20 + rand(player.cor / 10) + rand(player.sens / 5) + rand(player.lib / 10) + rand(10)) * (player.lustPercent() / 100);
				player.takeLustDamage(lustDmg, true, false);
				
			}
			combatRoundOver();
		}
		
		//Pure Marae's specials
		public  smite(): void {
			outputText("Marae mouths a chant. The clouds gather and quickly darkens. <b>It looks like a lightning might strike you!</b>");
			createStatusEffect(StatusEffects.Uber, 1, 0, 0, 0);
			combatRoundOver();
		}
		public  smiteHit(): void {
			if (game.flags[kFLAGS.IN_COMBAT_USE_PLAYER_WAITED_FLAG] == 1) {
				outputText("You look up in the sky to see the lightning incoming! Thanks to your preparedness, you manage to leap away before the lightning hits you! ");
			}
			else {
				outputText("Without warning, the lightning hits you! Surge of electricity rushes through you painfully. ");
				if (player.cor >= 50) outputText("The intensity of the pain is unbearable. ");
			var  damage: number = 100 + str + (player.corAdjustedDown() * 5);
				damage = player.reduceDamage(damage);
				player.takeDamage(damage, true);
			}
			if (hasStatusEffect(StatusEffects.Uber)) removeStatusEffect(StatusEffects.Uber);
			combatRoundOver();
		}
		
		public  defeated(hpVictory: boolean): void
		{
			game.boat.marae.winAgainstMarae();
		}
		
		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			game.boat.marae.loseAgainstMarae();
		}
		
		public  doAI(): void {
			if (hasStatusEffect(StatusEffects.Stunned)) {
				outputText("Your foe is too dazed from your last hit to strike back!")
				if (hasStatusEffect(StatusEffects.Uber)) {
					outputText(" You've managed to interrupt her smite attack!");
					removeStatusEffect(StatusEffects.Uber);
				}
				if (statusEffectv1(StatusEffects.Stunned) <= 0) removeStatusEffect(StatusEffects.Stunned);
				else addStatusValue(StatusEffects.Stunned, 1, -1);
				combatRoundOver();
				return;
			}
			if (hasStatusEffect(StatusEffects.Fear)) {
				game.outputText("\"<i>You think I'm afraid of anything? Foolish mortal.</i>\" Marae snarls.\n\n");
				removeStatusEffect(StatusEffects.Fear);
			}
		var  chooser: number = rand(10);
			if (hasStatusEffect(StatusEffects.Uber)) {
				smiteHit();
				return;
			}
			if (chooser < 4) {
				eAttack();
				return
			}
			else if (game.flags[kFLAGS.FACTORY_SHUTDOWN] == 1) {
				if (chooser >= 4 && chooser < 7) eAttack();
				if (chooser >= 7 && chooser < 10) smite();
			}
			else if (game.flags[kFLAGS.FACTORY_SHUTDOWN] == 2) {
				if (chooser >= 4 && chooser < 7) tentacleAttack();
				if (chooser >= 7 && chooser < 10) tentacleRape();
			}
		}
		
		public  getAscensionHP(hp: number): number
		{
			return hp * (1 + player.ascensionFactor(0.55)); // +55% per NG+-level --> = +2640 per level then
		}

		public  Marae() 
		{
			//A brief summary of the opponent.
			this.a = "";
			this.short = "Marae";
			this.imageName = "marae";
			if (game.flags[kFLAGS.FACTORY_SHUTDOWN] == 2) {
				this.long = "This being is known as the goddess of Mareth. She is corrupted due to the aftermath of the factory valves being blown up. She's white all over and textured with bark. The \"flower\" below her belly button resembles more of a vagina than a flower. Her G-cup sized breasts jiggle with every motion."
				this.createVagina(false, Vagina.WETNESS_DROOLING, Vagina.LOOSENESS_NORMAL);
				createBreastRow(Appearance.breastCupInverse("G"));
			}
			else {
				this.long = "This being is known as the goddess of Mareth. She is no longer corrupted thanks to your actions at the factory. She's white all over and textured with bark. Her breasts are modestly sized."
				this.createVagina(false, Vagina.WETNESS_WET, Vagina.LOOSENESS_NORMAL);
				createBreastRow(Appearance.breastCupInverse("DD"));
			}
			//Declare appearance.
			this.race = "Deity";
			this.ass.analLooseness = 1;
			this.ass.analWetness = 1;
			this.tallness = 10 * 12;
			this.hips.rating = 10;
			this.butt.rating = 8;
			this.skin.tone = "white";
			this.skin.setType(Skin.PLAIN);
			this.hair.color = "green";
			this.hair.length = 36;
			//Set stats.
			this.level = 85;
			initStrTouSpeInte(200, 150, 100, 150);
			initLibSensCor(25, 25, 0);
			this.weaponName = "fists";
			this.weaponVerb="wrathful punch";
			this.weaponAttack = 50;
			this.weaponPerk = "";
			this.weaponValue = 25;
			this.armorName = "bark";
			this.armorDef = 30;
			this.bonusHP = 4750;
			this.bonusLust = 100;
			this.lust = 30;
			this.lustVuln = .07;
			this.temperment = TEMPERMENT_RANDOM_GRAPPLES;
			this.additionalXP = 2500;
			this.drop = NO_DROP;
			this.gems = 1000;
			//Alter Marae's stats based on factory shutdown method.
			if (game.flags[kFLAGS.FACTORY_SHUTDOWN] == 2) {
				this.level -= 10;
				this.str -= 50;
				this.spe -= 30;
				this.inte -= 40;
				this.lib += 45;
				this.cor = 100;
				this.weaponName = "tentacles";
				this.weaponVerb = "slap";
				this.weaponAttack -= 10;
			}
			if (game.flags[kFLAGS.FACTORY_SHUTDOWN] == 1) {
				this.bonusHP += 2700;
				this.additionalXP += 500;
				if (game.flags[kFLAGS.MINERVA_TOWER_TREE] > 0) {
					this.level += 14;
					this.bonusHP += 1000;
					this.weaponAttack += 10;
					this.tou += 25;
					this.inte += 25;
				}
			}
			this.level += player.newGamePlusMod() * 30; //New Game+ tier increments levels by 60 as opposed to 30.
			if (game.flags[kFLAGS.FACTORY_SHUTDOWN] == 1) {
				this.additionalXP += 500;
			}
			if (game.flags[kFLAGS.FACTORY_SHUTDOWN] == 1) {
				this.special1 = smite;
			}
			if (game.flags[kFLAGS.FACTORY_SHUTDOWN] == 2) {
				this.special1 = tentacleAttack;
				this.special2 = tentacleRape;
			}
			this.createPerk(PerkLib.Tank, 0, 0, 0, 0);
			this.createPerk(PerkLib.Tank2, 0, 0, 0, 0);
			this.createPerk(PerkLib.ImprovedSelfControl, 0, 0, 0, 0);
			checkMonster();
		}
		
	}


