/**
 * Created by aimozg on 18.01.14.
 */
	
	export class AbstractSuccubus extends Monster
	{
		protected  whipAttack(): void
		{
			if (hasStatusEffect(StatusEffects.WhipReady)) {
				//Blind dodge change
				if (hasStatusEffect(StatusEffects.Blind)) {
					outputText(capitalA + short + " swings her whip at you wildly, totally missing due to her blindness!!");
					combatRoundOver();
					return;
				}
				outputText("Grinning deviously, the succubus cracks her whip with expert skill, landing a painful blow on your ");
			var  temp: number = rand(6);
			var  damage: number;
			var  lustDmg: number;
				//Whip yo ass!
				if (temp == 0) {
					outputText("ass");
					damage = 4;
					lustDmg = 6 + int(player.sens / 20);
				}
				//Whip yo tits!
				if (temp == 1) {
					if (player.breastRows.length > 0 && player.biggestTitSize() > 0) outputText(player.allBreastsDescript() + "");
					else outputText("chest");
					damage = 9 - player.armor.def;
					if (damage <= 0) {
						outputText(" but you feel no pain thanks to your protection");
						damage = 0;
					}
					lustDmg = 4 + int(player.sens / 15);
				}
				//Whip yo groin
				if (temp == 2) {
				var  groinProtection: number = 0;
					//Take armor in account.
					if (player.armor != ArmorLib.NOTHING) {
						if (player.armor.perk == "Light") groinProtection = 1;
						else if (player.armor.perk == "Medium") groinProtection = 2;
						else groinProtection = 3;
						//Certain armor affects protection.
						if (player.armor == armors.BEEARMR || player.armor == armors.SSARMOR || player.armor == armors.DBARMOR || player.armor == armors.TBARMOR) groinProtection = 2; //The only thing protecting your groin is a loincloth.
						if (player.armor == armors.GOOARMR) groinProtection = 2; //Goo armor is soft and gooey so not complete protection.
						if (player.armor == armors.LTHCARM) groinProtection = 0; //Lethicite armor exposes your groin.
					}
					//Wearing armored undergarments? BONUS POINTS!
					if (player.lowerGarment != UndergarmentLib.NOTHING) {
						if (player.lowerGarment == undergarments.SS_LOIN || player.lowerGarment == undergarments.SSPANTY) groinProtection += 1;
						else if (player.lowerGarment == undergarments.DS_LOIN || player.lowerGarment == undergarments.DSTHONG) groinProtection += 2;
					}
					//Apply damage
					if (groinProtection >= 3) {
						outputText("groin but luckily you're wearing groin protection");
						damage = 0;
					}
					else {
						if (player.gender == 0) {
							outputText("groin");
							damage = 5;
							damage = int(damage / (groinProtection + 1)); 
						}
						if (player.gender == 1) {
							outputText("groin, dealing painful damage to your " + player.multiCockDescriptLight() + ", doubling you over in agony");
							damage = int((player.maxHP()) / 4);
							if (groinProtection > 0) {
								outputText("! Of course, it would have been worse if you didn't wear groin protection");
								damage = int(damage / (groinProtection + 1));
							}
							damage = player.reduceDamage(damage);
							if (damage < 20) damage = 10;
							lustDmg = -15;
						}
						if (player.gender == 2) {
							outputText("groin, making your " + player.vaginaDescript(0) + " sting with pain");
							damage = 10;
							lustDmg = -8;
						}
						if (player.gender == 3) {
							outputText("groin, dealing painful damage to your " + player.multiCockDescriptLight() + " and " + player.vaginaDescript(0) + ", doubling you over in agony");
							damage = int((player.maxHP()) / 3)
							if (groinProtection > 0) {
								outputText("! Of course, it would have been worse if you didn't wear groin protection");
								damage = int(damage / (groinProtection + 1));
							}
							damage = player.reduceDamage(damage);
							if (damage < 30) damage = 30;
							lustDmg = -20;
						}
					}
				}
				//Whip yo legs
				if (temp == 3) {
					outputText("legs");
					damage = 7;
				}
				//Whip yo arms
				if (temp == 4) {
					outputText("arms");
					damage = 8;
				}
				//Whip yo neck
				if (temp == 5) {
					outputText("neck (24)");
					damage = 24;
				}
				outputText("! ");
				player.takeDamage(damage, true);
				player.takeLustDamage(lustDmg, true);
			}
			else {
				outputText("The succubus flicks her wrist, allowing a whip-like cord to slither out from the palm of her clawed hand.  She cracks the whip experimentally, cackling with glee.");
				createStatusEffect(StatusEffects.WhipReady, 0, 0, 0, 0);
				str += 20;
				this.weaponName = "whip";
				this.weaponVerb = "brutal whip-crack";
			}
			combatRoundOver();
		}

		public  AbstractSuccubus()
		{
		}

		protected  kissAttack(): void
		{
			//[Kiss of Death Text]
			outputText("The succubus dances forwards, cocking her elbow back for a vicious strike.");
			//avoid!
			if (player.spe > spe && rand(4) == 0 || (player.findPerk(PerkLib.Evade) >= 0 && rand(4) == 0) || (player.findPerk(PerkLib.Misdirection) >= 0 && rand(4) == 0 && player.armorName == "red, high-society bodysuit")) {
				outputText("  You start to sidestep and realize it's a feint.   Ducking low, you slide under her real attack... a kiss?!  ");
				if (player.lust100 >= 70) outputText("  Maybe you shouldn't have bothered to move, it might have been fun.");
			}
			//get hit
			else {
				outputText("  You start to dodge to the side, but she shifts direction expertly and plants a wet kiss on your lips.  She spins and dodges away with a ballet dancer's grace, leaving you to wonder what just happened.  ");
				if (!player.hasStatusEffect(StatusEffects.KissOfDeath)) player.createStatusEffect(StatusEffects.KissOfDeath, 0, 0, 0, 0);
			}
			combatRoundOver();
		}

		protected  seduceAttack(): void
		{
		var  temp: number;
		var  lustDmg: number;
			//determine which method of teasing you use
			temp = rand(3);
			//Butt slap!
			if (temp == 0) {
				outputText(capitalA + short + " slaps her " + Appearance.buttDescriptionShort(this));
				if (butt.rating >= 10) {
					outputText(", making it jiggle delightfully.");
					//85% success rate for the jiggly girls
					if (rand(100) <= 95) {
						lustDmg = rand(butt.rating) + 10;
						outputText("\nThe display is quite arousing.");
					}
					else outputText("\nYou're unimpressed.\n\n");
				}
				else {
					outputText(".");
					//50%ish chance of success for the tight butted.
					if (rand(100) <= (70 + butt.rating * 2)) {
						lustDmg = rand(butt.rating) + 9;
						outputText("\nThe display is quite arousing.");
					}
					else outputText("\nYou're unimpressed.\n\n");
				}
			player.takeLustDamage(lustDmg, true);
			}
			//Jiggly-tits
			if (temp == 1 && breastRows[0].breastRating >= 2) {
				//rand(breastRating) + breastRows*BreastperRow
				//Single breast row
				if (breastRows.length == 1) {
					//50+ breastsize% success rate
					outputText(capitalA + short + " caresses some of her ample chest-flesh before shaking it from side to side enticingly.");
					if (lust100 >= 50) outputText("  " + pronoun2 + " hard nipples seem to demand your attention.");
					if (rand(100) <= (65 + biggestTitSize())) {
						outputText("\nThe display is quite arousing.");
						lustDmg = rand(breastRows[0].breastRating) + breastRows.length + 10;
					}
					else outputText("\nYou're unimpressed.\n\n");
				}
				if (breastRows.length > 1) {
					//50 + 10% per breastRow + breastSize%
					outputText(capitalA + short + " caresses " + pronoun2 + " some of her rows of ample chest-flesh before shaking it all from side to side enticingly.");
					if (lust100 >= 50) outputText(", your " + player.nippleDescript(0) + "s painfully visible.");
					else outputText(".");
					if (rand(100) <= (54 + (breastRows.length - 1) * 15 + breastRows[0].breastRating)) {
						outputText("\nThe display is quite arousing.");
						lustDmg = rand(breastRows[0].breastRating) + breastRows.length * breastRows[0].breasts + 5;
					}
					else outputText("\nYou're unimpressed.\n\n");
				}
			player.takeLustDamage(lustDmg, true);
			}
			//Genetals flash!
			if (temp == 2) {
				outputText(capitalA + short + " reaches down and strokes her moist lips.  She sighs and licks her fingers clean, giving you a smoldering gaze.");
				//Success = 50% + 10% times each cock/vagina
				//rand(vaginas*2 + cocks*2) + wetness and/or length/6
				if (rand(101) <= (65 + vaginas.length * 10 + cocks.length * 10)) {
					outputText("\nThe display is quite arousing.");
					lustDmg = rand(vaginas.length * 2 + cocks.length * 2) + 13;
				}
				else outputText("\nYou're unimpressed.\n\n");
			player.takeLustDamage(lustDmg, true);
			}
			combatRoundOver();
		}
	}

