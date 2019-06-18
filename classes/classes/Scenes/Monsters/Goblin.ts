
	export class Goblin extends Monster
	{
		protected  goblinDrugAttack(): void {
		var  temp2: number = rand(2);
		var  multiplier: number = 1; //Higher tier goblins have powerful potions.
			if (short == "goblin assassin") multiplier += 0.2;
			if (short == "goblin shaman") multiplier += 0.4;
			if (short == "goblin warrior") multiplier += 0.5;
			if (short == "goblin elder") multiplier += 1;
			multiplier += player.newGamePlusMod() * 0.5;
			if (short == "Tamani") temp2 = rand(5);
			if (short == "Tamani's daughters") temp2 = rand(5);
		var  color: string = "";
			if (temp2 == 0) color = "red";
			if (temp2 == 1) color = "green";
			if (temp2 == 2) color = "blue";
			if (temp2 == 3) color = "white";
			if (temp2 == 4) color = "black";
			//Throw offensive potions at the player
			if (color != "blue") {
				if (short == "Tamani's daughters") outputText("Tamani uncorks a glass bottle full of " + color + " fluid and swings her arm, flinging a wave of fluid at you.");
				else outputText(capitalA + short + " uncorks a glass bottle full of " + color + " fluid and swings her arm, flinging a wave of fluid at you.");
			}
			//Drink blue pots
			else {
				if (short == "Tamani's daughters") {
					outputText("Tamani pulls out a blue vial and uncaps it, then douses the mob with the contents.");
					if (HPRatio() < 1) {
						outputText("  Though less effective than ingesting it, the potion looks to have helped the goblins recover from their wounds!\n");
						addHP(80 * multiplier);
					}
					else outputText("  There doesn't seem to be any effect.\n");			
					outputText("\n");
				}
				else {
					outputText(capitalA + short + " pulls out a blue vial and uncaps it, swiftly downing its contents.");
					if (HPRatio() < 1) {
						outputText("  She looks to have recovered from some of her wounds!\n");
						addHP((maxHP() / 4) * multiplier);
						if (short == "Tamani") addHP((maxHP() / 4) * multiplier);
					}
					else outputText("  There doesn't seem to be any effect.\n");
					combatRoundOver();
				}
				return;
			}
			//Dodge chance!
			if ((player.findPerk(PerkLib.Evade) >= 0 && rand(10) <= 3) || (rand(100) < player.spe/5)) {
				outputText("\nYou narrowly avoid the gush of alchemic fluids!\n");
			}
			else {
				//Get hit!
				if (color == "red") {
					//Temporary heat
					outputText("\nThe red fluids hit you and instantly soak into your skin, disappearing.  Your skin flushes and you feel warm.  Oh no...\n");
					if (!player.hasStatusEffect(StatusEffects.TemporaryHeat)) player.createStatusEffect(StatusEffects.TemporaryHeat, 0, multiplier, 0, 0);
				}
				else if (color == "green") {
					//Green poison
					outputText("\nThe greenish fluids splash over you, making you feel slimy and gross.  Nausea plagues you immediately - you have been poisoned!\n");
					if (!player.hasStatusEffect(StatusEffects.Poison)) player.createStatusEffect(StatusEffects.Poison, 0, multiplier, 0, 0);
				}
				else if (color == "white") {
					//sticky flee prevention
					outputText("\nYou try to avoid it, but it splatters the ground around you with very sticky white fluid, making it difficult to run.  You'll have a hard time escaping now!\n");
					if (!player.hasStatusEffect(StatusEffects.NoFlee)) player.createStatusEffect(StatusEffects.NoFlee, 0, 0, 0, 0);
				}
				else if (color == "black") {
					//Increase fatigue
					outputText("\nThe black fluid splashes all over you and wicks into your skin near-instantly.  It makes you feel tired and drowsy.\n");
					player.changeFatigue(10 + rand(25) * multiplier);
				}
			}
			if (!plural) combatRoundOver();
			else outputText("\n");
		}
		protected  goblinTeaseAttack(): void {
		var  det: number = rand(3);
			if (short == "goblin" || short == "goblin assassin") {
				if (det == 0) outputText(capitalA + short + " runs her hands along her leather-clad body and blows you a kiss. \"<i>Why not walk on the wild side?</i>\" she asks.");
				if (det == 1) outputText(capitalA + short + " grabs her heel and lifts it to her head in an amazing display of flexibility.  She caresses her snatch and gives you a come hither look.");
				if (det == 2) outputText(capitalA + short + " bends over, putting on a show and jiggling her heart-shaped ass at you.  She looks over her shoulder and sucks on her finger, batting her eyelashes.");
			}
			else if (short == "goblin warrior") {
				if (det == 0) outputText(capitalA + short + " runs her hands along her metal-clad body and blows you a kiss. \"<i>Why not walk on the wild side?</i>\" she asks.");
				if (det == 1) outputText(capitalA + short + " grabs her heel and lifts it to her head in an amazing display of flexibility despite the armor she's wearing.  She caresses her snatch and gives you a come hither look.");
				if (det == 2) outputText(capitalA + short + " bends over, putting on a show and jiggling her heart-shaped ass at you.  She looks over her shoulder and sucks on her finger, batting her eyelashes.");
			}
			else if (short == "goblin shaman") {
				if (det == 0) outputText(capitalA + short + " runs her hands along her leather-clad body and blows you a kiss. \"<i>Why not walk on the wild side?</i>\" she asks.");
				if (det == 1) outputText(capitalA + short + " grabs her heel and lifts it to her head in an amazing display of flexibility.  She lifts her loincloth and caresses her snatch and gives you a come hither look.");
				if (det == 2) outputText(capitalA + short + " bends over, putting on a show and jiggling her heart-shaped ass at you.  She looks over her shoulder and sucks on her finger, batting her eyelashes.");
			}
			else if (short == "goblin elder") {
				if (det == 0) outputText(capitalA + short + " runs her hands along her bone-clad body and blows you a kiss. \"<i>Why not walk on the wild side?</i>\" she asks.");
				if (det == 1) outputText(capitalA + short + " grabs her heel and lifts it to her head in an amazing display of flexibility.  She lifts her loincloth and caresses her snatch and gives you a come hither look.");
				if (det == 2) outputText(capitalA + short + " bends over, putting on a show and jiggling her heart-shaped ass at you.  She looks over her shoulder and sucks on her finger, batting her eyelashes.");
			}
		var  lustDmg: number = rand(player.lib / 10) + 8;
			if (short == "goblin assassin") lustDmg *= 1.4;
			if (short == "goblin warrior") lustDmg *= 1.6;
			if (short == "goblin shaman") lustDmg *= 1.6;
			if (short == "goblin elder") lustDmg *= 2;
			outputText("  The display distracts you long enough to prevent you from taking advantage of her awkward pose, leaving you more than a little flushed.");
			player.takeLustDamage(lustDmg, true);
			outputText("\n\n");
			combatRoundOver();
		}
		
		public  defeated(hpVictory: boolean): void
		{
			game.goblinScene.gobboRapeIntro();
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if (player.gender == 0 || flags[kFLAGS.SFW_MODE] > 0) {
				outputText("You collapse in front of the goblin, too wounded to fight.  She giggles and takes out a tube of lipstick smearing it whorishly on your face.  You pass into unconsciousness immediately.  It must have been drugged.");
				game.combat.cleanupAfterCombat();
			} else if (pcCameWorms) {
				outputText("\n\nThe goblin's eyes go wide and she turns to leave, no longer interested in you.");
				player.orgasm('Generic');
				doNext(game.combat.cleanupAfterCombat);
			} else {
				game.goblinScene.goblinRapesPlayer();
			}
		}

		public  Goblin(noInit: boolean=false)
		{
			if (noInit) return;
			this.a = "the ";
			this.short = "goblin";
			this.imageName = "goblin";
			this.long = "The goblin before you is a typical example of her species, with dark green skin, pointed ears, and purple hair that would look more at home on a punk-rocker.  She's only about three feet tall, but makes up for it with her curvy body, sporting hips and breasts that would entice any of the men in your village were she full-size.  There isn't a single scrap of clothing on her, just lewd leather straps and a few clinking pouches.  She does sport quite a lot of piercings – the most noticeable being large studs hanging from her purple nipples.  Her eyes are fiery red, and practically glow with lust.  This one isn't going to be satisfied until she has her way with you.  It shouldn't be too hard to subdue such a little creature, right?";
			this.race = "Goblin";
			this.createVagina(false, Vagina.WETNESS_DROOLING, Vagina.LOOSENESS_NORMAL);
			this.createStatusEffect(StatusEffects.BonusVCapacity, 40, 0, 0, 0);
			createBreastRow(Appearance.breastCupInverse("E"));
			this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
			this.ass.analWetness = Ass.WETNESS_DRY;
			this.createStatusEffect(StatusEffects.BonusACapacity,30,0,0,0);
			this.tallness = 35 + rand(4);
			this.hips.rating = Hips.RATING_AMPLE+2;
			this.butt.rating = Butt.RATING_LARGE;
			this.skin.tone = "dark green";
			this.hair.color = "purple";
			this.hair.length = 4;
			initStrTouSpeInte(12, 13, 35, 42);
			initLibSensCor(45, 45, 60);
			this.weaponName = "fists";
			this.weaponVerb="tiny punch";
			this.armorName = "leather straps";
			this.lust = 50;
			this.temperment = TEMPERMENT_RANDOM_GRAPPLES;
			this.level = 1;
			this.gems = rand(5) + 5;
			this.drop = new WeightedDrop().
					add(consumables.GOB_ALE,5).
					addMany(1,consumables.L_DRAFT,
							consumables.PINKDYE,
							consumables.BLUEDYE,
							consumables.ORANGDY,
							consumables.PURPDYE);
			this.special1 = goblinDrugAttack;
			this.special2 = goblinTeaseAttack;
			checkMonster();
		}

	}


