
	export class IncubusMechanic extends Monster {
		
		public  defeated(hpVictory: boolean): void
		{
			if (flags[kFLAGS.D3_DISCOVERED] == 0)
			{
				defeatedInDungeon1(hpVictory);
			}
			else
			{
				defeatedInDungeon3(hpVictory);
			}
		}
		
		private  defeatedInDungeon1(hpVictory: boolean): void {
			clearOutput();
			kGAMECLASS.output.menu();
			if (hpVictory)
				outputText("You smile in satisfaction as the " + short + " collapses, unable to continue fighting.");
			else outputText("You smile in satisfaction as the " + short + " collapses, masturbating happily.");
			outputText("  Now would be the perfect opportunity to put his tool to use...\n\nWhat do you do?");
			if (flags[kFLAGS.NEW_GAME_PLUS_LEVEL] >= 2 && flags[kFLAGS.FACTORY_INCUBUS_BRIBED] == 0) outputText("\n\n<b>You swear you can hear a clicking sound coming from the west.</b>");
			
			if (!player.isGenderless()) {
				kGAMECLASS.output.addButton(0, "Rape", game.lethicesKeep.incubusMechanic.doRapeIncubus).hint(player.hasCock() ? "Fuck his butt." : "Ride him vaginally.");
			} else {
				kGAMECLASS.output.addButtonDisabled(0, "Rape", "This scene requires you to have genitals.");
			}
			kGAMECLASS.output.addButton(1, "Service Him", game.lethicesKeep.incubusMechanic.doOralIncubus).hint("Service the incubus orally.");
			kGAMECLASS.output.addButton(2, "AnalRide", game.lethicesKeep.incubusMechanic.doRideIncubusAnally).hint("Ride him anally.");
			if (player.hasVagina() && player.biggestTitSize() >= 4 && player.armor == armors.LMARMOR) kGAMECLASS.output.addButton(3, "B.Titfuck", (player.armor as LustyMaidensArmor).lustyMaidenPaizuri, player, this);
			// no disabled button for this option
			kGAMECLASS.output.addButton(14, "Leave", game.combat.cleanupAfterCombat);
		}
		
		private  defeatedInDungeon3(hpVictory: boolean): void
		{
			game.lethicesKeep.incubusMechanic.beatDaMechanic(hpVictory);
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if (flags[kFLAGS.D3_DISCOVERED] == 0)
			{
				wonInDungeon1(hpVictory, pcCameWorms);
			}
			else
			{
				wonInDungeon3(hpVictory, pcCameWorms);
			}
		}
		
		private  wonInDungeon1(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if (pcCameWorms){
				outputText("\n\nYour foe doesn't seem to care...");
				doNext(game.combat.endLustLoss);
			} else {
				game.lethicesKeep.incubusMechanic.doLossIncubus();
			}
		}
		
		private  wonInDungeon3(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if (flags[kFLAGS.LETHICE_DEFEATED] > 0) game.lethicesKeep.incubusMechanic.doLossIncubus();
			else game.lethicesKeep.incubusMechanic.mechanicFuckedYouUp(hpVictory, pcCameWorms);
		}
		
		private  cockTripAttack(): void {
			if (hasStatusEffect(StatusEffects.Blind)) { //Blind dodge change
				outputText(capitalA + short + " suddenly grows it's dick to obscene lengths and tries to trip you with it.  Thankfully he's so blind he wasn't aiming anywhere near you!");
				game.combat.combatRoundOver();
				return;
			}
			outputText("The incubus lunges forward in a clumsy attack that you start to side-step, only to feel something grip behind your " + player.buttDescript() + " and pull your " + player.legs() + " out from under you.");
			if ((player.spe-30) > rand(60)) {
				outputText("  You spin as you fall, twisting your " + player.legs() + " free and springing back to your " + player.feet() + " unharmed.");
			}
			else { //Fall down go boom
				outputText("  You land hard on your ass, momentarily stunned as the demonic cock-tentacle curls around your " + player.legs() + ", smearing them with oozing demonic fluids.");
				if (player.lust100 >= 80 || player.cor >= 80) {
					outputText("  Moaning with desire, you lick your lips as you slide your well-lubricated " + player.legs() + " free.  You gather a dollop of cum and lick it seductively, winking at the incubus and hoping to make him cave into his desire.");
					player.takeLustDamage(13, true);
					game.dynStats("cor", 1);
				}
				else if (player.lust100 >= 50 || player.cor >= 50) {
					outputText("  Blushing at the scent and feel of cum on your " + player.legs() + ", you twist and pull free.  You find yourself wondering what this demon's dick would taste like.");
					player.takeLustDamage(8 + player.cor / 20, true);
				}
				else {
					outputText("  Disgusted, you pull away from the purplish monstrosity, the act made easier by your well-slimed " + player.legs() + ".");
					player.takeLustDamage(5 + player.cor / 20, true);
				}
				player.takeDamage(5);
			}
			outputText("\nThe incubus gives an overconfident smile as his cock retracts away from you, returning to its normal size.");
			game.combat.combatRoundOver();
		}
		
		private  spoogeAttack(): void {
			if (hasStatusEffect(StatusEffects.Blind)) { //Blind dodge change
				outputText(capitalA + short + " pumps and thrusts his hips lewdly before cumming with intense force in your direction!  Thankfully his aim was off due to the blindness currently affect him.");
				game.combat.combatRoundOver();
				return;
			}
			outputText("Your demonic foe places his hands behind his head and lewdly pumps and thrusts his hips at you.  Your eyes open wide as a globule of cum erupts from the demon-prick and flies right at you.  ");
			if (player.shield is DragonShellShield && rand(2) == 0)
			{
				outputText("Your shield managed to absorb the attack!")
				combatRoundOver();
				return;
			}
			outputText("You do your best to dodge, but some still lands on your ");
			switch (rand(3)) {
				case 0: //Face
					outputText("face.  The gooey demon-seed oozes and slides over you with a mind of its own, forcing its way into your mouth and nose!  You can feel it moving around inside you, doing its best to prepare you for its master.");
					game.dynStats("lus", 3);
					if (!player.hasStatusEffect(StatusEffects.DemonSeed))
						player.createStatusEffect(StatusEffects.DemonSeed, 5, 0, 0, 0);
					else player.addStatusValue(StatusEffects.DemonSeed, 1, 7);
					player.slimeFeed();
					break;
				case 1: //Chest
					if (player.hasFuckableNipples()) {
						outputText(allBreastsDescript() + ".  The gooey demon-seed oozes and slides over you with a mind of its own, forcing its way into your open nipples.  You can feel it moving around inside you, doing its best to prepare you for its master.");
						game.dynStats("lus", 3);
						if (!player.hasStatusEffect(StatusEffects.DemonSeed))
							player.createStatusEffect(StatusEffects.DemonSeed, 5, 0, 0, 0);
						else player.addStatusValue(StatusEffects.DemonSeed, 1, 8);
						player.slimeFeed();
					}
					else outputText(allBreastsDescript() + ".  Thankfully it doesn't seem to have much effect.");
					break;
				default: //Crotch
					if (player.vaginas.length > 0) {
						outputText("crotch.  The gooey demon-seed oozes and slides over you with a mind of its own, forcing its way past your " + player.armorName + " and into your " + player.vaginaDescript(0) + ".  You can feel it moving around inside you, doing its best to prepare you for its master.");
						game.dynStats("lus", 3);
						if (!player.hasStatusEffect(StatusEffects.DemonSeed))
							player.createStatusEffect(StatusEffects.DemonSeed, 5, 0, 0, 0);
						else player.addStatusValue(StatusEffects.DemonSeed, 1, 8);
						player.slimeFeed();
					}
					else outputText("crotch.  Thankfully, it doesn't seem to have much effect.");
			}
			game.combat.combatRoundOver();
			lust -= 10;
			if (lust < 0) lust = 10;
		}
		
		public  IncubusMechanic() {
			this.a = "the ";
			this.short = "incubus mechanic";
			this.imageName = "incubusmechanic";
			this.long = "The demon before you is clad only in cut-off denim overalls.  Covered in stains of oil and other strange fluids, they appear to be in pretty rough shape.  There is a large hole ripped in the crotch, allowing the demon's foot-long member to hang free.  His skin is light purple and perfect, contrasting with the slovenly appearance of his clothing.  His face is rugged and handsome, topped with a simple black ponytail and two large horns that sprout from his forehead like twisted tree-trunks.  He wears a narrow goatee on his chin that is kept skillfully braided.  A cocky smile always seems to grace his features, giving him an air of supreme confidence.";
			this.race = "Demon";
			// this.plural = false;
			this.createCock(12,1.75,CockTypesEnum.DEMON);
			this.balls = 2;
			this.ballSize = 2;
			this.cumMultiplier = 3;
			// this.hoursSinceCum = 0;
			createBreastRow(0);
			this.ass.analLooseness = Ass.LOOSENESS_STRETCHED;
			this.ass.analWetness = Ass.WETNESS_SLIME_DROOLING;
			this.tallness = rand(9) + 70;
			this.hips.rating = Hips.RATING_AMPLE;
			this.butt.rating = Butt.RATING_TIGHT;
			this.lowerBody.type = LowerBody.DEMONIC_CLAWS;
			this.skin.tone = "light purple";
			this.hair.color = "black";
			this.hair.length = 12;
			initStrTouSpeInte(65, 40, 45, 85);
			initLibSensCor(80, 70, 80);
			this.weaponName = "claws";
			this.weaponVerb="claw";
			this.weaponAttack = 10;
			this.weaponPerk = "";
			this.weaponValue = 150;
			this.armorName = "demonic skin";
			this.armorDef = 10;
			this.bonusHP = 150;
			this.lust = 50;
			this.lustVuln = .5;
			this.temperment = TEMPERMENT_LOVE_GRAPPLES;
			this.level = 8;
			this.drop = new WeightedDrop(consumables.GROPLUS, 1);
			this.gems = rand(25) + 10;
			this.additionalXP = 50;
			if (flags[kFLAGS.D3_MECHANIC_LAST_GREET] > 0) {
				this.gems += rand(25) + 50;
				this.additionalXP += 50;
				this.level += 13;
				this.bonusHP += 225;
				this.str += 25;
				this.tou += 20;
				this.spe += 15;
				this.inte += 20;
				this.weaponAttack += 5;
				this.HP = maxHP();
			}
			this.special1 = cockTripAttack;
			this.special2 = spoogeAttack;
			this.tail.type = Tail.DEMONIC;
			this.wings.type = Wings.BAT_LIKE_TINY;
			checkMonster();
		}
	}

