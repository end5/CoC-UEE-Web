
	export class CombatAbilities extends BaseContent
	{
		public  CombatAbilities() {}
		
		//------------
		// SPELLS
		//------------
		public  fireMagicLastTurn: number = -100;
		public  fireMagicCumulated: number = 0;
		
		//UTILS
		public  canUseMagic(): boolean {
			if (player.hasStatusEffect(StatusEffects.ThroatPunch)) return false;
			if (player.hasStatusEffect(StatusEffects.WebSilence)) return false;
			if (player.hasStatusEffect(StatusEffects.GooArmorSilence)) return false;
			return true;
		}
		
		public  getWhiteMagicLustCap(): number {
		var  whiteLustCap: number = player.maxLust() * 0.75;
			if (player.findPerk(PerkLib.Enlightened) >= 0 && player.isPureEnough(10)) whiteLustCap += (player.maxLust() * 0.1);
			if (player.findPerk(PerkLib.FocusedMind) >= 0) whiteLustCap += (player.maxLust() * 0.1);
			return whiteLustCap;
		}
		
		public  spellPerkUnlock(): void {
			if (flags[kFLAGS.SPELLS_CAST] >= 5 && player.findPerk(PerkLib.SpellcastingAffinity) < 0) {
				outputText("<b>You've become more comfortable with your spells, unlocking the Spellcasting Affinity perk and reducing fatigue cost of spells by 20%!</b>\n\n");
				player.createPerk(PerkLib.SpellcastingAffinity,20,0,0,0);
			}
			if (flags[kFLAGS.SPELLS_CAST] >= 15 && player.perkv1(PerkLib.SpellcastingAffinity) < 35) {
				outputText("<b>You've become more comfortable with your spells, further reducing your spell costs by an additional 15%!</b>\n\n");
				player.setPerkValue(PerkLib.SpellcastingAffinity,1,35);
			}
			if (flags[kFLAGS.SPELLS_CAST] >= 45 && player.perkv1(PerkLib.SpellcastingAffinity) < 50) {
				outputText("<b>You've become more comfortable with your spells, further reducing your spell costs by an additional 15%!</b>\n\n");
				player.setPerkValue(PerkLib.SpellcastingAffinity,1,50);
			}
		}
		
		public  isExhausted(cost: number, type: number, context: string = "", returnTo = undefined): boolean {
			//Spells & Magical Specials
			if ((type == 3 || (type == 1 && player.findPerk(PerkLib.BloodMage) < 0)) && player.fatigue + player.spellCost(cost) > player.maxFatigue()) {
				clearOutput();
				outputText("You are too tired to " + (context != "" ? context : "cast this spell") + ". ");
				if (type == 3 && player.hasPerk(PerkLib.BloodMage)) outputText(" Not even your 'Blood Mage' perk helps you with this spell. ");
				doNext(returnTo != undefined ? returnTo : magicMenu);
				return true;
			}
			//Physical Specials
			else if (type == 2 && player.fatigue + player.physicalCost(cost) > player.maxFatigue()) {
				clearOutput();
				outputText("You are too fatigued to " + (context != "" ? context : "perform this action") + "! ");
				doNext(returnTo != undefined ? returnTo : physicalSpecials);
				return true;
			}
			else {
				if (!isSilencedSpecial(true)) player.changeFatigue(cost, type);
				return false;
			}
		}
		
		public  isSilencedSpecial(checkOnly: boolean = false, returnTo = undefined, context: string = ""): boolean {
			if (player.hasStatusEffect(StatusEffects.ThroatPunch) || player.hasStatusEffect(StatusEffects.WebSilence)) {
				if (!checkOnly) {
					clearOutput();
					outputText("You cannot " + (context != "" ? context : "focus to use this ability") + " while you're having so much difficulty breathing.");
					doNext(returnTo != undefined ? returnTo : curry(combat.combatMenu, false));
				}
				return true;
			}
			return false;
		}
		
		//MENU
		public  magicMenu(): void {
			if (combat.inCombat && player.hasStatusEffect(StatusEffects.Sealed) && player.statusEffectv2(StatusEffects.Sealed) == 2) {
				clearOutput();
				outputText("You reach for your magic, but you just can't manage the focus necessary.  <b>Your ability to use magic was sealed, and now you've wasted a chance to attack!</b>\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			menu();
			clearOutput();
			outputText("What spell will you use?\n\n");
			//WHITE SHITZ			
			if (player.lust >= getWhiteMagicLustCap())
				outputText("You are far too aroused to focus on white magic.\n\n");
			else {
				if (player.hasStatusEffect(StatusEffects.KnowsCharge)) {
					if (!player.hasStatusEffect(StatusEffects.ChargeWeapon))
						addButton(0, "Charge W.", spellChargeWeapon).hint("The Charge Weapon spell will surround your weapon in electrical energy, causing it to do even more damage.  The effect lasts for the entire combat.  \n\nFatigue Cost: " + player.spellCost(15) + "", "Charge Weapon");
					else outputText("<b>Charge weapon is already active and cannot be cast again.</b>\n\n");
				}
				if (player.hasStatusEffect(StatusEffects.KnowsBlind)) {
					if (!monster.hasStatusEffect(StatusEffects.Blind))
						addButton(1, "Blind", spellBlind).hint("Blind is a fairly self-explanatory spell.  It will create a bright flash just in front of the victim's eyes, blinding them for a time.  However if they blink it will be wasted.  \n\nFatigue Cost: " + player.spellCost(20) + "");
					else outputText("<b>" + monster.capitalA + monster.short + " is already affected by blind.</b>\n\n");
				}
				if (player.hasStatusEffect(StatusEffects.KnowsWhitefire)) addButton(2, "Whitefire", spellWhitefire).hint("Whitefire is a potent fire based attack that will burn your foe with flickering white flames, ignoring their physical toughness and most armors.  \n\nFatigue Cost: " + player.spellCost(30) + "");
			}
			//BLACK MAGICSKS
			if (player.lust < 50)
				outputText("You aren't turned on enough to use any black magics.\n\n");
			else {
				if (player.hasStatusEffect(StatusEffects.KnowsArouse)) addButton(5, "Arouse", spellArouse).hint("The arouse spell draws on your own inner lust in order to enflame the enemy's passions.  \n\nFatigue Cost: " + player.spellCost(15) + "");
				if (player.hasStatusEffect(StatusEffects.KnowsHeal)) addButton(6, "Heal", spellHeal).hint("Heal will attempt to use black magic to close your wounds and restore your body, however like all black magic used on yourself, it has a chance of backfiring and greatly arousing you.  \n\nFatigue Cost: " + player.spellCost(20) + "");
				if (player.hasStatusEffect(StatusEffects.KnowsMight)) {
					if (!player.hasStatusEffect(StatusEffects.Might))
						addButton(7, "Might", spellMight).hint("The Might spell draws upon your lust and uses it to fuel a temporary increase in muscle size and power.  It does carry the risk of backfiring and raising lust, like all black magic used on oneself.  \n\nFatigue Cost: " + player.spellCost(25) + "");
					else outputText("<b>You are already under the effects of Might and cannot cast it again.</b>\n\n");
				}
				if (player.hasStatusEffect(StatusEffects.KnowsBlackfire)) addButton(8, "Blackfire", spellBlackfire).hint("Blackfire is the black magic variant of Whitefire. It is a potent fire based attack that will burn your foe with flickering black and purple flames, ignoring their physical toughness and most armors.\n\nFatigue Cost: " + player.spellCost(40) + "");
			}
			// JOJO ABILITIES -- kind makes sense to stuff it in here along side the white magic shit (also because it can't fit into M. Specials :|
			if (player.findPerk(PerkLib.CleansingPalm) >= 0 && player.isPureEnough(10)) {
				addButton(3, "C.Palm", spellCleansingPalm).hint("Unleash the power of your cleansing aura! More effective against corrupted opponents. Doesn't work on the pure.  \n\nFatigue Cost: " + player.spellCost(30) + "", "Cleansing Palm");
			}
			addButton(14, "Back", combat.combatMenu, false);
		}
		
		//WHITE SPELLS
		//(15) Charge Weapon – boosts your weapon attack value by 10 * player.spellMod till the end of combat.
		public  spellChargeWeapon(silent: boolean = false): void {
			if (silent) {
				player.createStatusEffect(StatusEffects.ChargeWeapon, 10 * player.spellMod(), 0, 0, 0);
				statScreenRefresh();
				return;
			}
			if (isExhausted(15, 1)) return;
			doNext(combat.combatMenu);
			if (monster is FrostGiant && player.hasStatusEffect(StatusEffects.GiantBoulder)) {
				(monster as FrostGiant).giantBoulderHit(2);
				getGame().combat.enemyTurn();
				return;
			}
			clearOutput();
			outputText("You utter words of power, summoning an electrical charge around your " + player.weaponName + ".  It crackles loudly, ensuring you'll do more damage with it for the rest of the fight.\n\n");
		var  temp: number = 10 * player.spellMod();
			if (temp > 100) temp = 100;
			player.createStatusEffect(StatusEffects.ChargeWeapon, temp, 0, 0, 0);
			flags[kFLAGS.SPELLS_CAST]++;
			spellPerkUnlock();
			getGame().combat.enemyTurn();
		}
		
		//(20) Blind – reduces your opponent's accuracy, giving an additional 50% miss chance to physical attacks.
		public  spellBlind(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, spellBlind)) return;
			clearOutput();
			if (isExhausted(20, 1)) return;
			doNext(combat.combatMenu);
			if (monsterTarget.hasStatusEffect(StatusEffects.Shell)) {
				outputText("As soon as your magic touches the multicolored shell around " + monsterTarget.a + monsterTarget.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
				flags[kFLAGS.SPELLS_CAST]++;
				spellPerkUnlock();
				getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget is JeanClaude)
			{
				outputText("Jean-Claude howls, reeling backwards before turning back to you, rage clenching his dragon-like face and enflaming his eyes. Your spell seemed to cause him physical pain, but did nothing to blind his lidless sight.");

				outputText("\n\n“<i>You think your hedge magic will work on me, intrus?</i>” he snarls. “<i>Here- let me show you how it’s really done.</i>” The light of anger in his eyes intensifies, burning a retina-frying white as it demands you stare into it...");
				
				if (rand(player.spe) >= 50 || rand(player.inte) >= 50)
				{
					outputText("\n\nThe light sears into your eyes, but with the discipline of conscious effort you escape the hypnotic pull before it can mesmerize you, before Jean-Claude can blind you.");

					outputText("\n\n“<i>You fight dirty,</i>” the monster snaps. He sounds genuinely outraged. “<i>I was told the interloper was a dangerous warrior, not a little [boy] who accepts duels of honour and then throws sand into his opponent’s eyes. Look into my eyes, little [boy]. Fair is fair.</i>”");
					
					monsterTarget.HP -= int(10+(player.inte/3 + rand(player.inte/2)) * player.spellMod());
				}
				else
				{
					outputText("\n\nThe light sears into your eyes and mind as you stare into it. It’s so powerful, so infinite, so exquisitely painful that you wonder why you’d ever want to look at anything else, at anything at- with a mighty effort, you tear yourself away from it, gasping. All you can see is the afterimages, blaring white and yellow across your vision. You swipe around you blindly as you hear Jean-Claude bark with laughter, trying to keep the monster at arm’s length.");

					outputText("\n\n“<i>The taste of your own medicine, it is not so nice, eh? I will show you much nicer things in there in time intrus, don’t worry. Once you have learnt your place.</i>”");
					
					player.createStatusEffect(StatusEffects.Blind, rand(4) + 1, 0, 0, 0);
				}
				if (monsterTarget is FrostGiant && player.hasStatusEffect(StatusEffects.GiantBoulder)) {
					(monsterTarget as FrostGiant).giantBoulderHit(2);
					getGame().combat.enemyTurn();
					return;
				}
				flags[kFLAGS.SPELLS_CAST]++;
				spellPerkUnlock();
				if (getGame().combat.countMonstersLeft() <= 0) doNext(combat.endHpVictory);
				else getGame().combat.enemyTurn();
				return;
			}
				clearOutput();
			outputText("You glare at " + monsterTarget.a + monsterTarget.short + " and point at " + monsterTarget.pronoun2 + ".  A bright flash erupts before " + monsterTarget.pronoun2 + "!\n");
			if (monsterTarget is LivingStatue)
			{
				// noop
			}
			else if (rand(3) != 0) {
				outputText(" <b>" + monsterTarget.capitalA + monsterTarget.short + " ");
				if (monsterTarget.plural && monsterTarget.short != "imp horde") outputText("are blinded!</b>");
				else outputText("is blinded!</b>");
				monsterTarget.createStatusEffect(StatusEffects.Blind,5*player.spellMod(),0,0,0);
				if (monsterTarget.short == "Isabella")
					if (getGame().isabellaFollowerScene.isabellaAccent()) outputText("\n\n\"<i>Nein! I cannot see!</i>\" cries Isabella.");
					else outputText("\n\n\"<i>No! I cannot see!</i>\" cries Isabella.");
				if (monsterTarget.short == "Kiha") outputText("\n\n\"<i>You think blindness will slow me down?  Attacks like that are only effective on those who don't know how to see with their other senses!</i>\" Kiha cries defiantly.");
				if (monsterTarget.short == "plain girl") {
					outputText("  Remarkably, it seems as if your spell has had no effect on her, and you nearly get clipped by a roundhouse as you stand, confused. The girl flashes a radiant smile at you, and the battle continues.");
					monsterTarget.removeStatusEffect(StatusEffects.Blind);
				}
			}
			else outputText(monsterTarget.capitalA + monsterTarget.short + " blinked!");	
			outputText("\n\n");
			flags[kFLAGS.SPELLS_CAST]++;
			spellPerkUnlock();
			getGame().combat.enemyTurn();
		}
		
		//(30) Whitefire – burns the enemy for 10 + int/3 + rand(int/2) * player.spellMod.		
		private  calcInfernoMod(damage: number): number {
			if (player.findPerk(PerkLib.RagingInferno) >= 0) {
			var  multiplier: number = 1;
				if (combat.combatRound - fireMagicLastTurn == 2) {
					outputText("Traces of your previously used fire magic are still here, and you use them to empower another spell!\n\n");
					switch(fireMagicCumulated) {
						case 0:
						case 1:
							multiplier = 1;
							break;
						case 2:
							multiplier = 1.2;
							break;
						case 3:
							multiplier = 1.35;
							break;
						case 4:
							multiplier = 1.45;
							break;
						default:
							multiplier = 1.5 + ((fireMagicCumulated - 5) * 0.05); //Diminishing returns at max, add 0.05 to multiplier.
					}
					damage = Math.round(damage * multiplier);
					fireMagicCumulated++;
					// XXX: Message?
				} else {
					if (combat.combatRound - fireMagicLastTurn > 2 && fireMagicLastTurn > 0)
						outputText("Unfortunately, traces of your previously used fire magic are too weak to be used.\n\n");
					fireMagicCumulated = 1;
				}
				fireMagicLastTurn = combat.combatRound;
			}
			return damage;
		}

		public  spellWhitefire(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, spellWhitefire)) return;
			clearOutput();
			if (isExhausted(30, 1)) return;
			doNext(combat.combatMenu);
			if (monsterTarget.hasStatusEffect(StatusEffects.Shell)) {
				outputText("As soon as your magic touches the multicolored shell around " + monsterTarget.a + monsterTarget.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
				flags[kFLAGS.SPELLS_CAST]++;
				spellPerkUnlock();
				getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget is Doppelganger)
			{
				(monsterTarget as Doppelganger).handleSpellResistance("whitefire");
				flags[kFLAGS.SPELLS_CAST]++;
				spellPerkUnlock();
				return;
			}
			if (monsterTarget is FrostGiant && player.hasStatusEffect(StatusEffects.GiantBoulder)) {
				(monsterTarget as FrostGiant).giantBoulderHit(2);
				getGame().combat.enemyTurn();
				return;
			}
				clearOutput();
			outputText("You narrow your eyes, focusing your mind with deadly intent.  You snap your fingers and " + monsterTarget.a + monsterTarget.short + " is enveloped in a flash of white flames!\n");
			temp = int(10 + (player.inte / 3 + rand(player.inte / 2)) * player.spellMod());
			//High damage to goes.
			temp = calcInfernoMod(temp);
			if (monsterTarget.short == "goo-girl") temp = Math.round(temp * 1.5);
			if (monsterTarget.short == "tentacle beast") temp = Math.round(temp * 1.2);
			outputText(monsterTarget.capitalA + monsterTarget.short + " takes <b><font color=\"" + mainViewManager.colorHpMinus() + "\">" + temp + "</font></b> damage.");
			//Using fire attacks on the goo]
			if (monsterTarget.short == "goo-girl") {
				outputText("  Your flames lick the girl's body and she opens her mouth in pained protest as you evaporate much of her moisture. When the fire passes, she seems a bit smaller and her slimy " + monsterTarget.skin.tone + " skin has lost some of its shimmer.");
				if (monsterTarget.findPerk(PerkLib.Acid) < 0) monsterTarget.createPerk(PerkLib.Acid,0,0,0,0);
			}
			if (monsterTarget.short == "Holli" && !monsterTarget.hasStatusEffect(StatusEffects.HolliBurning)) (monsterTarget as Holli).lightHolliOnFireMagically();
			outputText("\n\n");
		 	combat.checkAchievementDamage(temp);
			flags[kFLAGS.LAST_ATTACK_TYPE] = 2;
			flags[kFLAGS.SPELLS_CAST]++;
			spellPerkUnlock();
			monsterTarget.HP -= temp;
			if (combat.countMonstersLeft() <= 0) doNext(combat.endHpVictory);
			else getGame().combat.enemyTurn();
		}
		
		//BLACK SPELLS
		public  spellArouse(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, spellArouse)) return;
			if (isExhausted(15, 1)) return;
			doNext(combat.combatMenu);
			//This is now automatic - newRound arg defaults to true:	menuLoc = 0;
			if (monsterTarget is FrostGiant && player.hasStatusEffect(StatusEffects.GiantBoulder)) {
				(monsterTarget as FrostGiant).giantBoulderHit(2);
				getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget.hasStatusEffect(StatusEffects.Shell)) {
				outputText("As soon as your magic touches the multicolored shell around " + monsterTarget.a + monsterTarget.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
				flags[kFLAGS.SPELLS_CAST]++;
				spellPerkUnlock();
				getGame().combat.enemyTurn();
				return;
			}
			clearOutput();
			outputText("You make a series of arcane gestures, drawing on your own lust to inflict it upon your foe!\n");
			//Worms be immune
			if (monsterTarget.short == "worms") {
				outputText("The worms appear to be unaffected by your magic!");
				outputText("\n\n");
				flags[kFLAGS.SPELLS_CAST]++;
				spellPerkUnlock();
				doNext(playerMenu);
				if (monsterTarget.lust >= monsterTarget.maxLust()) doNext(combat.endLustVictory);
				else getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget.lustVuln == 0) {
				outputText("It has no effect!  Your foe clearly does not experience lust in the same way as you.\n\n");
				flags[kFLAGS.SPELLS_CAST]++;
				spellPerkUnlock();
				getGame().combat.enemyTurn();
				return;
			}
		var  lustDmg: number = monsterTarget.lustVuln * (player.inte/5*player.spellMod() + rand(monsterTarget.lib - monsterTarget.inte*2 + monsterTarget.cor)/5);
			if (monsterTarget.lust100 < 30) outputText(monsterTarget.capitalA + monsterTarget.short + " squirms as the magic affects " + monsterTarget.pronoun2 + ".  ");
			if (monsterTarget.lust100 >= 30 && monsterTarget.lust100 < 60) {
				if (monsterTarget.plural) outputText(monsterTarget.capitalA + monsterTarget.short + " stagger, suddenly weak and having trouble focusing on staying upright.  ");
				else outputText(monsterTarget.capitalA + monsterTarget.short + " staggers, suddenly weak and having trouble focusing on staying upright.  ");
			}
			if (monsterTarget.lust100 >= 60) {
				outputText(monsterTarget.capitalA + monsterTarget.short + "'");
				if (!monsterTarget.plural) outputText("s");
				outputText(" eyes glaze over with desire for a moment.  ");
			}
			if (monsterTarget.cocks.length > 0) {
				if (monsterTarget.lust100 >= 60 && monsterTarget.cocks.length > 0) outputText("You see " + monsterTarget.pronoun3 + " " + monsterTarget.multiCockDescriptLight() + " dribble pre-cum.  ");
				if (monsterTarget.lust100 >= 30 && monsterTarget.lust100 < 60 && monsterTarget.cocks.length == 1) outputText(monsterTarget.capitalA + monsterTarget.short + "'s " + monsterTarget.cockDescriptShort(0) + " hardens, distracting " + monsterTarget.pronoun2 + " further.  ");
				if (monsterTarget.lust100 >= 30 && monsterTarget.lust100 < 60 && monsterTarget.cocks.length > 1) outputText("You see " + monsterTarget.pronoun3 + " " + monsterTarget.multiCockDescriptLight() + " harden uncomfortably.  ");
			}
			if (monsterTarget.vaginas.length > 0) {
				if (monsterTarget.plural) {
					if (monsterTarget.lust100 >= 60 && monsterTarget.vaginas[0].vaginalWetness == Vagina.WETNESS_NORMAL) outputText(monsterTarget.capitalA + monsterTarget.short + "'s " + monsterTarget.vaginaDescript() + "s dampen perceptibly.  ");
					if (monsterTarget.lust100 >= 60 && monsterTarget.vaginas[0].vaginalWetness == Vagina.WETNESS_WET) outputText(monsterTarget.capitalA + monsterTarget.short + "'s crotches become sticky with girl-lust.  ");
					if (monsterTarget.lust100 >= 60 && monsterTarget.vaginas[0].vaginalWetness == Vagina.WETNESS_SLICK) outputText(monsterTarget.capitalA + monsterTarget.short + "'s " + monsterTarget.vaginaDescript() + "s become sloppy and wet.  ");
					if (monsterTarget.lust100 >= 60 && monsterTarget.vaginas[0].vaginalWetness == Vagina.WETNESS_DROOLING) outputText("Thick runners of girl-lube stream down the insides of " + monsterTarget.a + monsterTarget.short + "'s thighs.  ");
					if (monsterTarget.lust100 >= 60 && monsterTarget.vaginas[0].vaginalWetness == Vagina.WETNESS_SLAVERING) outputText(monsterTarget.capitalA + monsterTarget.short + "'s " + monsterTarget.vaginaDescript() + "s instantly soak " + monsterTarget.pronoun2 + " groin.  ");
				}
				else {
					if (monsterTarget.lust100 >= 60 && monsterTarget.vaginas[0].vaginalWetness == Vagina.WETNESS_NORMAL) outputText(monsterTarget.capitalA + monsterTarget.short + "'s " + monsterTarget.vaginaDescript() + " dampens perceptibly.  ");
					if (monsterTarget.lust100 >= 60 && monsterTarget.vaginas[0].vaginalWetness == Vagina.WETNESS_WET) outputText(monsterTarget.capitalA + monsterTarget.short + "'s crotch becomes sticky with girl-lust.  ");
					if (monsterTarget.lust100 >= 60 && monsterTarget.vaginas[0].vaginalWetness == Vagina.WETNESS_SLICK) outputText(monsterTarget.capitalA + monsterTarget.short + "'s " + monsterTarget.vaginaDescript() + " becomes sloppy and wet.  ");
					if (monsterTarget.lust100 >= 60 && monsterTarget.vaginas[0].vaginalWetness == Vagina.WETNESS_DROOLING) outputText("Thick runners of girl-lube stream down the insides of " + monsterTarget.a + monsterTarget.short + "'s thighs.  ");
					if (monsterTarget.lust100 >= 60 && monsterTarget.vaginas[0].vaginalWetness == Vagina.WETNESS_SLAVERING) outputText(monsterTarget.capitalA + monsterTarget.short + "'s " + monsterTarget.vaginaDescript() + " instantly soaks her groin.  ");
				}
			}
			monsterTarget.teased(lustDmg);
			outputText("\n\n");
			doNext(playerMenu);
			flags[kFLAGS.SPELLS_CAST]++;
			spellPerkUnlock();
			if (monsterTarget.lust >= monsterTarget.maxLust()) doNext(combat.endLustVictory);
			else getGame().combat.enemyTurn();
			return;	
		}
		public  spellHeal(): void {
			if (isExhausted(20, 3)) return;
			doNext(combat.combatMenu);
			if (monster is FrostGiant && player.hasStatusEffect(StatusEffects.GiantBoulder)) {
				(monster as FrostGiant).giantBoulderHit(2);
				getGame().combat.enemyTurn();
				return;
			}
			clearOutput();
			outputText("You focus on your body and its desire to end pain, trying to draw on your arousal without enhancing it.\n");
			//25% backfire!
		var  backfire: number = 25;
			if (player.findPerk(PerkLib.FocusedMind) >= 0) backfire = 15;
			if (rand(100) < backfire) {
				outputText("An errant sexual thought crosses your mind, and you lose control of the spell!  Your ");
				if (player.gender == 0) outputText(player.assholeDescript() + " tingles with a desire to be filled as your libido spins out of control.");
				if (player.gender == 1) {
					if (player.cockTotal() == 1) outputText(player.cockDescript(0) + " twitches obscenely and drips with pre-cum as your libido spins out of control.");
					else outputText(player.multiCockDescriptLight() + " twitch obscenely and drip with pre-cum as your libido spins out of control.");
				}
				if (player.gender == 2) outputText(player.vaginaDescript(0) + " becomes puffy, hot, and ready to be touched as the magic diverts into it.");
				if (player.gender == 3) outputText(player.vaginaDescript(0) + " and " + player.multiCockDescriptLight() + " overfill with blood, becoming puffy and incredibly sensitive as the magic focuses on them.");
				dynStats("lib", .25, "lus", 15);
			}
			else {
				temp = int((player.level + (player.inte / 1.5) + rand(player.inte)) * player.spellMod());
				outputText("You flush with success as your wounds begin to knit. ");
				player.HPChange(temp, true);
			}
			
			outputText("\n\n");
			flags[kFLAGS.SPELLS_CAST]++;
			spellPerkUnlock();
			if (player.lust >= player.maxLust()) doNext(combat.endLustLoss);
			else getGame().combat.enemyTurn();
			return;
		}

		//(25) Might – increases strength/toughness by 5 * player.spellMod, up to a 
		//maximum of 15, allows it to exceed the maximum.  Chance of backfiring 
		//and increasing lust by 15.
		public  spellMight(silent: boolean = false): void {
			
			if (silent)	{ // for Battlemage
				player.addStatusEffect(new MightBuff());
				return;
			}
			if (isExhausted(25, 1)) return;
			doNext(combat.combatMenu);
			if (monster is FrostGiant && player.hasStatusEffect(StatusEffects.GiantBoulder)) {
				(monster as FrostGiant).giantBoulderHit(2);
				getGame().combat.enemyTurn();
				return;
			}
			clearOutput();
			outputText("You flush, drawing on your body's desires to empower your muscles and toughen you up.\n\n");
			//25% backfire!
		var  backfire: number = 25;
			if (player.findPerk(PerkLib.FocusedMind) >= 0) backfire = 15;
			if (rand(100) < backfire) {
				outputText("An errant sexual thought crosses your mind, and you lose control of the spell!  Your ");
				if (player.gender == 0) outputText(player.assholeDescript() + " tingles with a desire to be filled as your libido spins out of control.");
				if (player.gender == 1) {
					if (player.cockTotal() == 1) outputText(player.cockDescript(0) + " twitches obscenely and drips with pre-cum as your libido spins out of control.");
					else outputText(player.multiCockDescriptLight() + " twitch obscenely and drip with pre-cum as your libido spins out of control.");
				}
				if (player.gender == 2) outputText(player.vaginaDescript(0) + " becomes puffy, hot, and ready to be touched as the magic diverts into it.");
				if (player.gender == 3) outputText(player.vaginaDescript(0) + " and " + player.multiCockDescriptLight() + " overfill with blood, becoming puffy and incredibly sensitive as the magic focuses on them.");
				dynStats("lib", .25, "lus", 15);
			}
			else {
				outputText("The rush of success and power flows through your body.  You feel like you can do anything!");
				player.addStatusEffect(new MightBuff());
			}
			outputText("\n\n");
			flags[kFLAGS.SPELLS_CAST]++;
			spellPerkUnlock();
			if (player.lust >= player.maxLust()) doNext(combat.endLustLoss);
			else getGame().combat.enemyTurn();
			return;
		}
		
		//Blackfire. A stronger but more costly version of Whitefire.
		public  spellBlackfire(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, spellBlackfire)) return;
			clearOutput();
			if (isExhausted(40, 1)) return;
			doNext(combat.combatMenu);
			if (monsterTarget.hasStatusEffect(StatusEffects.Shell)) {
				outputText("As soon as your magic touches the multicolored shell around " + monsterTarget.a + monsterTarget.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
				flags[kFLAGS.SPELLS_CAST]++;
				spellPerkUnlock();
				getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget is Doppelganger)
			{
				(monsterTarget as Doppelganger).handleSpellResistance("blackfire");
				flags[kFLAGS.SPELLS_CAST]++;
				spellPerkUnlock();
				return;
			}
			if (monsterTarget is FrostGiant && player.hasStatusEffect(StatusEffects.GiantBoulder)) {
				(monsterTarget as FrostGiant).giantBoulderHit(2);
				getGame().combat.enemyTurn();
				return;
			}
			//Backfire calculation
		var  backfire: number = 25;
			if (player.findPerk(PerkLib.FocusedMind) >= 0) backfire = 15;
			if (rand(100) < backfire) {
				clearOutput();
				outputText("You narrow your eyes, channeling your lust with deadly intent. An errant sexual thought crosses your mind, and you lose control of the spell! Your ");
				if (player.gender == 0) outputText(player.assholeDescript() + " tingles with a desire to be filled as your libido spins out of control.");
				if (player.gender == 1) {
					if (player.cockTotal() == 1) outputText(player.cockDescript(0) + " twitches obscenely and drips with pre-cum as your libido spins out of control.");
					else outputText(player.multiCockDescriptLight() + " twitch obscenely and drip with pre-cum as your libido spins out of control.");
				}
				if (player.gender == 2) outputText(player.vaginaDescript(0) + " becomes puffy, hot, and ready to be touched as the magic diverts into it.");
				if (player.gender == 3) outputText(player.vaginaDescript(0) + " and " + player.multiCockDescriptLight() + " overfill with blood, becoming puffy and incredibly sensitive as the magic focuses on them.");
				outputText("\n\n");
				dynStats("lib", 1, "lus", (rand(20) + 15)); //Git gud
			}
			else {
				clearOutput();
				outputText("You narrow your eyes, channeling your lust with deadly intent. You snap your fingers and " + monsterTarget.a + monsterTarget.short + " is enveloped in a flash of black and purple flames!\n");
				temp = int(30 + (player.inte / 3 + rand(player.inte / 2)) * player.spellMod());
				//High damage to goes.
				temp = calcInfernoMod(temp);
				if (monsterTarget.short == "goo-girl") temp = Math.round(temp * 1.5);
				if (monsterTarget.short == "tentacle beast") temp = Math.round(temp * 1.2);
				outputText(monsterTarget.capitalA + monsterTarget.short + " takes <b><font color=\"#800000\">" + temp + "</font></b> damage.");
				//Using fire attacks on goo
				if (monsterTarget.short == "goo-girl") {
					outputText("  Your flames lick the girl's body and she opens her mouth in pained protest as you evaporate much of her moisture. When the fire passes, she seems a bit smaller and her slimy " + monsterTarget.skin.tone + " skin has lost some of its shimmer.");
					if (monsterTarget.findPerk(PerkLib.Acid) < 0) monsterTarget.createPerk(PerkLib.Acid,0,0,0,0);
				}
				if (monsterTarget.short == "Holli" && !monsterTarget.hasStatusEffect(StatusEffects.HolliBurning)) (monsterTarget as Holli).lightHolliOnFireMagically();
				outputText("\n\n");
				combat.checkAchievementDamage(temp);
				flags[kFLAGS.LAST_ATTACK_TYPE] = 2;
				flags[kFLAGS.SPELLS_CAST]++;
				spellPerkUnlock();
				monsterTarget.HP -= temp;
			}
			if (player.lust >= player.maxLust()) doNext(combat.endLustLoss);
			else if (combat.countMonstersLeft() <= 0) doNext(combat.endHpVictory);
			else getGame().combat.enemyTurn();
		}
		
		//SPECIAL SPELLS
		public  spellCleansingPalm(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, spellCleansingPalm)) return;
			clearOutput();
			if (isExhausted(30, 1)) return;
			doNext(combat.combatMenu);
			if (monsterTarget.hasStatusEffect(StatusEffects.Shell)) {
				outputText("As soon as your magic touches the multicolored shell around " + monsterTarget.a + monsterTarget.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
				flags[kFLAGS.SPELLS_CAST]++;
				spellPerkUnlock();
				getGame().combat.enemyTurn();
				return;
			}
			
			if (monsterTarget.short == "Jojo")
			{
				// Not a completely corrupted monkmouse
				if (flags[kFLAGS.JOJO_STATUS] < 2)
				{
					outputText("You thrust your palm forward, sending a blast of pure energy towards Jojo. At the last second he sends a blast of his own against yours canceling it out\n\n");
					flags[kFLAGS.SPELLS_CAST]++;
					spellPerkUnlock();
					getGame().combat.enemyTurn();
					return;
				}
			}
			
			if (monsterTarget is LivingStatue)
			{
				outputText("You thrust your palm forward, causing a blast of pure energy to slam against the giant stone statue- to no effect!");
				flags[kFLAGS.SPELLS_CAST]++;
				spellPerkUnlock();
				getGame().combat.enemyTurn();
				return;
			}
				
		var  corruptionMulti: number = (monsterTarget.cor - 20) / 25;
			if (corruptionMulti > 1.5) {
				corruptionMulti = 1.5;
				corruptionMulti += ((monsterTarget.cor - 57.5) / 100); //The increase to multiplier is diminished.
			}
			
			temp = int((player.inte / 4 + rand(player.inte / 3)) * (player.spellMod() * corruptionMulti));
			
			if (temp > 0)
			{
				outputText("You thrust your palm forward, causing a blast of pure energy to slam against " + monsterTarget.a + monsterTarget.short + ", tossing");
				if ((monsterTarget as Monster).plural == true) outputText(" them");
				else outputText((monsterTarget as Monster).mfn(" him", " her", " it"));
				outputText(" back a few feet.\n\n");
				if (silly() && corruptionMulti >= 1.75) outputText("It's super effective!  ");
				outputText(monsterTarget.capitalA + monsterTarget.short + " takes <b><font color=\"#800000\">" + temp + "</font></b> damage.\n\n");
			}
			else
			{
				temp = 0;
				outputText("You thrust your palm forward, causing a blast of pure energy to slam against " + monsterTarget.a + monsterTarget.short + ", which they ignore. It is probably best you don’t use this technique against the pure.\n\n");
			}
			
			flags[kFLAGS.SPELLS_CAST]++;
			spellPerkUnlock();
			monsterTarget.HP -= temp;
			if (getGame().combat.countMonstersLeft() <= 0) doNext(combat.endHpVictory);
			else getGame().combat.enemyTurn();
		}
		
		//------------
		// TALISMAN
		//------------
		//Using the Talisman in combat
		public  dispellingSpell(): void {
			clearOutput();
			outputText("You gather energy in your Talisman and unleash the spell contained within.  An orange light appears and flashes briefly before vanishing. \n");
			//Remove player's effects
			if (player.hasStatusEffect(StatusEffects.ChargeWeapon)) {
				outputText("\nYour weapon no longer glows as your spell is dispelled.");
				player.removeStatusEffect(StatusEffects.ChargeWeapon);
			}
			if (player.hasStatusEffect(StatusEffects.Might)) {
				outputText("\nYou feel a bit weaker as your strength-enhancing spell wears off.");
				player.removeStatusEffect(StatusEffects.Might);
			}
			//Remove opponent's effects
			if (monster.hasStatusEffect(StatusEffects.ChargeWeapon)) {
				outputText("\nThe glow around " + monster.a + monster.short + "'s " + monster.weaponName + " fades completely.");
				monster.weaponAttack -= monster.statusEffectv1(StatusEffects.ChargeWeapon);
				monster.removeStatusEffect(StatusEffects.ChargeWeapon);
			}
			if (monster.hasStatusEffect(StatusEffects.Fear)) {
				outputText("\nThe dark illusion around " + monster.a + " " + monster.short + " finally dissipates, leaving " + monster.pronoun2 + " no longer fearful as " + monster.pronoun1 + " regains confidence.");
				monster.spe += monster.statusEffectv1(StatusEffects.Fear);
				monster.removeStatusEffect(StatusEffects.Fear);
			}
			if (monster.hasStatusEffect(StatusEffects.Illusion)) {
				outputText("\nThe reality around " + monster.a + " " + monster.short + " finally snaps back in place as " + monster.pronoun3 +" illusion spell fades.");
				monster.spe += monster.statusEffectv1(StatusEffects.Illusion);
				monster.removeStatusEffect(StatusEffects.Illusion);
			}
			if (monster.hasStatusEffect(StatusEffects.Might)) {
				outputText("\n" + monster.a + monster.short + " feels a bit weaker as " + monster.pronoun3 + " strength-enhancing spell wears off.");
				monster.str -= monster.statusEffectv1(StatusEffects.Might);
				monster.tou -= monster.statusEffectv2(StatusEffects.Might);
				monster.removeStatusEffect(StatusEffects.Might);
			}
			if (monster.hasStatusEffect(StatusEffects.Shell)) {
				outputText("\nThe magical shell around " + monster.a + " " + monster.short + " shatters!");
				monster.removeStatusEffect(StatusEffects.Shell);
			}
			outputText("\n");
			getGame().arianScene.clearTalisman();
			getGame().combat.enemyTurn();
		}
		
		public  healingSpell(): void {
			clearOutput();
			outputText("You gather energy in your Talisman and unleash the spell contained within.  A green aura washes over you and your wounds begin to close quickly. By the time the aura fully fades, you feel much better. ");
		var  temp: number = ((player.level * 5) + (player.inte / 1.5) + rand(player.inte)) * player.spellMod() * 1.5;
			player.HPChange(temp, true);
			getGame().arianScene.clearTalisman();
			getGame().combat.enemyTurn();
		}
		
		public  immolationSpell(): void {
			clearOutput();
			outputText("You gather energy in your Talisman and unleash the spell contained within.  A wave of burning flames gathers around " + monster.a + monster.short + ", slowly burning " + monster.pronoun2 + ". ");
		var  temp: number = int(75 + (player.inte / 2 + rand(player.inte)) * player.spellMod());
			temp = calcInfernoMod(temp);
			temp = combat.doDamage(temp, true, true);
			monster.createStatusEffect(StatusEffects.OnFire, 2 + rand(player.inte / 25), 0, 0, 0);
			if (monster.short == "goo girl") {
				outputText(" Your flames lick the girl's body and she opens her mouth in pained protest as you evaporate much of her moisture. When the fire passes, she seems a bit smaller and her slimy " + monster.skin.tone + " skin has lost some of its shimmer. ");
				if (monster.findPerk(PerkLib.Acid) < 0) monster.createPerk(PerkLib.Acid,0,0,0,0);
			}
			getGame().arianScene.clearTalisman();
			getGame().combat.enemyTurn();
		}

		public  lustReductionSpell(): void {
			clearOutput();
			outputText("You gather energy in your Talisman and unleash the spell contained within.  A pink aura washes all over you and as soon as the aura fades, you feel much less hornier.");
		var  temp: number = 30 + rand(player.inte / 5) * player.spellMod();
			dynStats("lus", -temp);
			outputText(" <b>(-" + temp + " lust)</b>\n\n");
			getGame().arianScene.clearTalisman();
			getGame().combat.enemyTurn();
		}
		
		public  shieldingSpell(): void {
			clearOutput();
			outputText("You gather energy in your Talisman and unleash the spell contained within.  A barrier of light engulfs you, before turning completely transparent.  Your defense has been increased.\n\n");
			player.createStatusEffect(StatusEffects.Shielding,0,0,0,0);
			getGame().arianScene.clearTalisman();
			getGame().combat.enemyTurn();
		}
		
		//------------
		// M. SPECIALS
		//------------
		public  magicalSpecials(): void {
			if (combat.inCombat && player.hasStatusEffect(StatusEffects.Sealed) && player.statusEffectv2(StatusEffects.Sealed) == 6) {
				clearOutput();
				outputText("You try to ready a special ability, but wind up stumbling dizzily instead.  <b>Your ability to use magical special attacks was sealed, and now you've wasted a chance to attack!</b>\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			menu();
		var  button: number = 0;
			//Berserk
			if (player.findPerk(PerkLib.Berzerker) >= 0) {
				addButton(button++, "Berserk", berzerk).hint("Throw yourself into a rage!  Greatly increases the strength of your weapon and increases lust resistance, but your armor defense is reduced to zero!");
			}
			//Lustzerk
			if (player.findPerk(PerkLib.Lustzerker) >= 0) {
				addButton(button++, "Lustserk", lustzerk).hint("Throw yourself into a lust rage!  Greatly increases the strength of your weapon and increases armor defense, but your lust resistance is halved!");
			}
			//Fire Breath
			if (player.findPerk(PerkLib.Dragonfire) >= 0) {
				addButton(button++, "DragonFire", dragonBreath).hint("Unleash fire from your mouth. This can only be done once a day. \n\nFatigue Cost: " + player.spellCost(20), "Dragon Fire");
			}
			if (player.findPerk(PerkLib.FireLord) >= 0) {
				addButton(button++, "Terra Fire", fireballuuuuu).hint("Unleash terrestrial fire from your mouth. \n\nFatigue Cost: 20", "Terra Fire");
			}
			if (player.findPerk(PerkLib.Hellfire) >= 0) {
				addButton(button++, "Hellfire", hellFire).hint("Unleash fire from your mouth. \n\nFatigue Cost: " + player.spellCost(20));
			}
			//Possess
			if (player.findPerk(PerkLib.Incorporeality) >= 0) {
				addButton(button++, "Possess", possess).hint("Attempt to temporarily possess a foe and force them to raise their own lusts. \n\nFatigue Cost: " + player.spellCost(10) + "");
			}
			//Whisper
			if (player.findPerk(PerkLib.Whispered) >= 0) {
				addButton(button++, "Whisper", superWhisperAttack).hint("Whisper and induce fear in your opponent. \n\nFatigue Cost: " + player.spellCost(10) + "");
			}
			//Kitsune Spells
			if (player.findPerk(PerkLib.CorruptedNinetails) >= 0) {
				addButton(button++, "C.FoxFire", corruptedFoxFire).hint("Unleash a corrupted purple flame at your opponent for high damage. Less effective against corrupted enemies. \n\nFatigue Cost: " + player.spellCost(35), "Corrupted FoxFire");
				addButton(button++, "Terror", kitsuneTerror).hint("Instill fear into your opponent with eldritch horrors. The more you cast this in a battle, the lesser effective it becomes. \n\nFatigue Cost: " + player.spellCost(20));
			}
			if (player.findPerk(PerkLib.EnlightenedNinetails) >= 0) {
				addButton(button++, "FoxFire", foxFire).hint("Unleash an ethereal blue flame at your opponent for high damage. More effective against corrupted enemies. \n\nFatigue Cost: " + player.spellCost(35));
				addButton(button++, "Illusion", kitsuneIllusion).hint("Warp the reality around your opponent, lowering their speed. The more you cast this in a battle, the lesser effective it becomes. \n\nFatigue Cost: " + player.spellCost(25));
			}
			if (player.canUseStare()) {
				if (!monster.hasStatusEffect(StatusEffects.BasiliskCompulsion)) {
					addButton(button++, "Stare", paralyzingStare).hint("Focus your gaze at your opponent, lowering their speed. The more you use this in a battle, the lesser effective it becomes. \n\nFatigue Cost: " + player.spellCost(20));
				} else {
					addDisabledButton(button++, "Stare", "Your opponent is already affected by your compulsion and its speed will slowly decay.");
				}
			}
			if (player.hasKeyItem("Arian's Charged Talisman") >= 0) {
				if (player.keyItemv1("Arian's Charged Talisman") == 1) addButton(button++, "Dispel", dispellingSpell);
				if (player.keyItemv1("Arian's Charged Talisman") == 2) addButton(button++, "Healing", healingSpell);
				if (player.keyItemv1("Arian's Charged Talisman") == 3) addButton(button++, "Immolation", immolationSpell);
				if (player.keyItemv1("Arian's Charged Talisman") == 4) addButton(button++, "Lust Reduce", lustReductionSpell);
				if (player.keyItemv1("Arian's Charged Talisman") == 5) addButton(button++, "Shielding", shieldingSpell);
			}
			addButton(14, "Back", combat.combatMenu, false);
		}
		
		public  berzerk(): void {
			clearOutput();
			if (player.hasStatusEffect(StatusEffects.Berzerking)) {
				outputText("You're already pretty goddamn mad!");
				doNext(magicalSpecials);
				return;
			}
			outputText("You roar and unleash your savage fury, forgetting about defense in order to destroy your foe!\n\n");
			player.createStatusEffect(StatusEffects.Berzerking, 0, 0, 0, 0);
			getGame().combat.enemyTurn();
		}
		
		public  lustzerk(): void {
			clearOutput();
			if(player.hasStatusEffect(StatusEffects.Lustzerking)) {
				clearOutput();
				outputText("You're already pretty goddamn mad and lustful!");
				doNext(magicalSpecials);
				return;
			}
			//This is now automatic - newRound arg defaults to true:	menuLoc = 0;
			clearOutput();
			outputText("You roar and unleash your lustful fury, forgetting about defense from any sexual attacks in order to destroy your foe!\n\n");
			player.createStatusEffect(StatusEffects.Lustzerking,0,0,0,0);
			getGame().combat.enemyTurn();
		}
		
		//Dragon Breath
		//Effect of attack: Damages and stuns the enemy for the turn you used this attack on, plus 2 more turns. High chance of success.
		public  dragonBreath(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, dragonBreath)) return;
			clearOutput();
			if (isExhausted(20, 1, "breathe fire")) return;
			//Not Ready Yet:
			if (player.hasStatusEffect(StatusEffects.DragonBreathCooldown)) {
				outputText("You try to tap into the power within you, but your burning throat reminds you that you're not yet ready to unleash it again...");
				doNext(curry(combat.combatMenu,false));
				return;
			}
			player.createStatusEffect(StatusEffects.DragonBreathCooldown,0,0,0,0);
		var  damage: number = int(player.level * 8 + 25 + rand(10));
			damage = calcInfernoMod(damage);
			if (player.hasStatusEffect(StatusEffects.DragonBreathBoost)) {
				player.removeStatusEffect(StatusEffects.DragonBreathBoost);
				damage *= 1.5;
			}
			//Shell
			if (monsterTarget.hasStatusEffect(StatusEffects.Shell)) {
				outputText("As soon as your magic touches the multicolored shell around " + monsterTarget.a + monsterTarget.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//Amily!
			if (monsterTarget.hasStatusEffect(StatusEffects.Concentration)) {
				clearOutput();
				outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.");
				getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget is LivingStatue)
			{
				outputText("The fire courses by the stone skin harmlessly. It does leave the surface of the statue glossier in its wake.");
				getGame().combat.enemyTurn();
				return;
			}
			outputText("Tapping into the power deep within you, you let loose a bellowing roar at your enemy, so forceful that even the environs crumble around " + monsterTarget.pronoun2 + ".  " + monsterTarget.capitalA + monsterTarget.short + " does " + monsterTarget.pronoun3 + " best to avoid it, but the wave of force is too fast.");
			if (monsterTarget.hasStatusEffect(StatusEffects.Sandstorm)) {
				outputText("  <b>Your breath is massively dissipated by the swirling vortex, causing it to hit with far less force!</b>");
				damage = Math.round(0.2 * damage);
			}
			//Miss: 
			if ((player.hasStatusEffect(StatusEffects.Blind) && rand(2) == 0) || (monsterTarget.spe - monsterTarget.spe > 0 && int(Math.random()*(((monsterTarget.spe-player.spe)/4)+80)) > 80)) {
				outputText("  Despite the heavy impact caused by your roar, " + monsterTarget.a + monsterTarget.short + " manages to take it at an angle and remain on " + monsterTarget.pronoun3 + " feet and focuses on you, ready to keep fighting.");
			}
			//Special enemy avoidances
			else if (monsterTarget.short == "Vala" && !monsterTarget.hasStatusEffect(StatusEffects.Stunned)) {
				outputText("Vala beats her wings with surprising strength, blowing the fireball back at you! ");		
				if (player.findPerk(PerkLib.Evade) >= 0 && rand(2) == 0) {
					outputText("You dive out of the way and evade it!");
				}
				else if (player.findPerk(PerkLib.Flexibility) >= 0 && rand(4) == 0) {
					outputText("You use your flexibility to barely fold your body out of the way!");
				}
				//Determine if blocked!
				else if (combat.combatBlock(true)) {
					outputText("You manage to block your own fire with your " + player.shieldName + "!");
				}
				else {
					damage = player.takeDamage(damage);
					outputText("Your own fire smacks into your face! <b>(<font color=\"#800000\">" + damage + "</font>)</b>");
				}
				outputText("\n\n");
			}
			//Goos burn
			else if (monsterTarget.short == "goo-girl") {
				outputText(" Your flames lick the girl's body and she opens her mouth in pained protest as you evaporate much of her moisture. When the fire passes, she seems a bit smaller and her slimy " + monsterTarget.skin.tone + " skin has lost some of its shimmer. ");
				if (monsterTarget.findPerk(PerkLib.Acid) < 0) monsterTarget.createPerk(PerkLib.Acid,0,0,0,0);
				damage = Math.round(damage * 1.5);
				damage = combat.doDamage(damage, true, false, monsterTarget);
				monsterTarget.createStatusEffect(StatusEffects.Stunned,0,0,0,0);
				outputText("<b>(<font color=\"#800000\">" + damage + "</font>)</b>\n\n");
			}
			else {
				if (monsterTarget.findPerk(PerkLib.Resolute) < 0) {
					outputText("  " + monsterTarget.capitalA + monsterTarget.short + " reels as your wave of force slams into " + monsterTarget.pronoun2 + " like a ton of rock!  The impact sends " + monsterTarget.pronoun2 + " crashing to the ground, too dazed to strike back.");
					monsterTarget.createStatusEffect(StatusEffects.Stunned,1,0,0,0);
				}
				else {
					outputText("  " + monsterTarget.capitalA + monsterTarget.short + " reels as your wave of force slams into " + monsterTarget.pronoun2 + " like a ton of rock!  The impact sends " + monsterTarget.pronoun2 + " staggering back, but <b>" + monsterTarget.pronoun1 + " ");
					if (!monsterTarget.plural) outputText("is ");
					else outputText("are");
					outputText("too resolute to be stunned by your attack.</b>");
				}
				damage = combat.doDamage(damage, true, true, monsterTarget);
			}
			outputText("\n\n");
		 	combat.checkAchievementDamage(damage);
			if (monsterTarget.short == "Holli" && !monsterTarget.hasStatusEffect(StatusEffects.HolliBurning)) (monsterTarget as Holli).lightHolliOnFireMagically();
			combat.combatRoundOver();
		}
		
		//* Terrestrial Fire
		public  fireballuuuuu(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, fireballuuuuu)) return;
			clearOutput();
			if (isExhausted(20, 1, "breathe fire")) return;
			//[Failure]
			//(high damage to self, +10 fatigue on top of ability cost)
			if (rand(5) == 0 || player.hasStatusEffect(StatusEffects.WebSilence)) {
				if (player.hasStatusEffect(StatusEffects.WebSilence)) outputText("You reach for the terrestrial fire, but as you ready to release a torrent of flame, it backs up in your throat, blocked by the webbing across your mouth.  It causes you to cry out as the sudden, heated force explodes in your own throat. ");
				else if (player.hasStatusEffect(StatusEffects.GooArmorSilence)) outputText("You reach for the terrestrial fire but as you ready the torrent, it erupts prematurely, causing you to cry out as the sudden heated force explodes in your own throat.  The slime covering your mouth bubbles and pops, boiling away where the escaping flame opens small rents in it.  That wasn't as effective as you'd hoped, but you can at least speak now. ");
				else outputText("You reach for the terrestrial fire, but as you ready to release a torrent of flame, the fire inside erupts prematurely, causing you to cry out as the sudden heated force explodes in your own throat. ");
				player.changeFatigue(10);
				player.takeDamage(10 + rand(20), true);
				outputText("\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			
		var  damage: number;
			damage = int(player.level * 10 + 45 + rand(10));
			damage = calcInfernoMod(damage);
			
			if (monsterTarget.hasStatusEffect(StatusEffects.Shell)) {
				outputText("As soon as your magic touches the multicolored shell around " + monsterTarget.a + monsterTarget.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//Amily!
			if (monsterTarget.hasStatusEffect(StatusEffects.Concentration)) {
				clearOutput();
				outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.");
				getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget is LivingStatue)
			{
				outputText("The fire courses by the stone skin harmlessly. It does leave the surface of the statue glossier in its wake.");
				getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget is Doppelganger)
			{
				(monsterTarget as Doppelganger).handleSpellResistance("fireball");
				flags[kFLAGS.SPELLS_CAST]++;
				spellPerkUnlock();
				return;
			}
			if (player.hasStatusEffect(StatusEffects.WebSilence)) {
				outputText("<b>The fire burns through the webs blocking your mouth!</b> ");
				player.removeStatusEffect(StatusEffects.WebSilence);
			}
			if (player.hasStatusEffect(StatusEffects.GooArmorSilence)) {
				outputText("<b>A growl rumbles from deep within as you charge the terrestrial fire, and you force it from your chest and into the slime.  The goop bubbles and steams as it evaporates, drawing a curious look from your foe, who pauses in her onslaught to lean in and watch.  While the tension around your mouth lessens and your opponent forgets herself more and more, you bide your time.  When you can finally work your jaw enough to open your mouth, you expel the lion's - or jaguar's? share of the flame, inflating an enormous bubble of fire and evaporated slime that thins and finally pops to release a superheated cloud.  The armored girl screams and recoils as she's enveloped, flailing her arms.</b> ");
				player.removeStatusEffect(StatusEffects.GooArmorSilence);
				damage += 25;
			}
			else outputText("A growl rumbles deep with your chest as you charge the terrestrial fire.  When you can hold it no longer, you release an ear splitting roar and hurl a giant green conflagration at your enemy. ");

			if (monsterTarget.short == "Isabella" && !monsterTarget.hasStatusEffect(StatusEffects.Stunned)) {
				outputText("Isabella shoulders her shield into the path of the emerald flames.  They burst over the wall of steel, splitting around the impenetrable obstruction and washing out harmlessly to the sides.\n\n");
				if (getGame().isabellaFollowerScene.isabellaAccent()) outputText("\"<i>Is zat all you've got?  It'll take more than a flashy magic trick to beat Izabella!</i>\" taunts the cow-girl.\n\n");
				else outputText("\"<i>Is that all you've got?  It'll take more than a flashy magic trick to beat Isabella!</i>\" taunts the cow-girl.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			else if (monsterTarget.short == "Vala" && !monsterTarget.hasStatusEffect(StatusEffects.Stunned)) {
				outputText("Vala beats her wings with surprising strength, blowing the fireball back at you! ");		
				if (player.findPerk(PerkLib.Evade) >= 0 && rand(2) == 0) {
					outputText("You dive out of the way and evade it!");
				}
				else if (player.findPerk(PerkLib.Flexibility) >= 0 && rand(4) == 0) {
					outputText("You use your flexibility to barely fold your body out of the way!");
				}
				else {
					//Determine if blocked!
					if (combat.combatBlock(true)) {
						outputText("You manage to block your own fire with your " + player.shieldName + "!");
						combat.combatRoundOver();
						return;
					}
					outputText("Your own fire smacks into your face! <b>(<font color=\"#800000\">" + damage + "</font>)</b>");
					player.takeDamage(damage);
				}
				outputText("\n\n");
			}
			else {
				//Using fire attacks on the goo]
				if (monsterTarget.short == "goo-girl") {
					outputText(" Your flames lick the girl's body and she opens her mouth in pained protest as you evaporate much of her moisture. When the fire passes, she seems a bit smaller and her slimy " + monsterTarget.skin.tone + " skin has lost some of its shimmer. ");
					if (monsterTarget.findPerk(PerkLib.Acid) < 0) monsterTarget.createPerk(PerkLib.Acid,0,0,0,0);
					damage = Math.round(damage * 1.5);
				}
				if (monsterTarget.hasStatusEffect(StatusEffects.Sandstorm)) {
					outputText("<b>Your breath is massively dissipated by the swirling vortex, causing it to hit with far less force!</b>  ");
					damage = Math.round(0.2 * damage);
				}
				outputText("<b>(<font color=\"#800000\">" + damage + "</font>)</b>\n\n");
				monsterTarget.HP -= damage;
				if (monsterTarget.short == "Holli" && !monsterTarget.hasStatusEffect(StatusEffects.HolliBurning)) (monsterTarget as Holli).lightHolliOnFireMagically();
			}
		 	combat.checkAchievementDamage(damage);
			if (getGame().combat.countMonstersLeft() <= 0) {
				doNext(combat.endHpVictory);
			}
			else getGame().combat.enemyTurn();
		}
		
		//Hellfire deals physical damage to completely pure foes, 
		//lust damage to completely corrupt foes, and a mix for those in between.  Its power is based on the PC's corruption and level.  Appearance is slightly changed to mention that the PC's eyes and mouth occasionally show flicks of fire from within them, text could possibly vary based on corruption.
		public  hellFire(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, hellFire)) return;
			clearOutput();
			if (isExhausted(20, 1, "breathe fire", magicalSpecials)) return;
		var  damage: number = (player.level * 8 + rand(10) + player.inte / 2 + player.cor / 5);
			damage = calcInfernoMod(damage);
			//Amily!
			if (monsterTarget.hasStatusEffect(StatusEffects.Concentration)) {
				clearOutput();
				outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget is LivingStatue)
			{
				outputText("The fire courses over the stone behemoths skin harmlessly. It does leave the surface of the statue glossier in its wake.");
				getGame().combat.enemyTurn();
				return;
			}
			
			if (!player.hasStatusEffect(StatusEffects.GooArmorSilence)) outputText("You take in a deep breath and unleash a wave of corrupt red flames from deep within.");
			
			if (player.hasStatusEffect(StatusEffects.WebSilence)) {
				outputText("<b>The fire burns through the webs blocking your mouth!</b> ");
				player.removeStatusEffect(StatusEffects.WebSilence);
			}
			if (player.hasStatusEffect(StatusEffects.GooArmorSilence)) {
				outputText("<b>A growl rumbles from deep within as you charge the terrestrial fire, and you force it from your chest and into the slime.  The goop bubbles and steams as it evaporates, drawing a curious look from your foe, who pauses in her onslaught to lean in and watch.  While the tension around your mouth lessens and your opponent forgets herself more and more, you bide your time.  When you can finally work your jaw enough to open your mouth, you expel the lion's - or jaguar's? share of the flame, inflating an enormous bubble of fire and evaporated slime that thins and finally pops to release a superheated cloud.  The armored girl screams and recoils as she's enveloped, flailing her arms.</b> ");
				player.removeStatusEffect(StatusEffects.GooArmorSilence);
				damage += 25;
			}
			if (monsterTarget.short == "Isabella" && !monsterTarget.hasStatusEffect(StatusEffects.Stunned)) {
				outputText("  Isabella shoulders her shield into the path of the crimson flames.  They burst over the wall of steel, splitting around the impenetrable obstruction and washing out harmlessly to the sides.\n\n");
				if (getGame().isabellaFollowerScene.isabellaAccent()) outputText("\"<i>Is zat all you've got?  It'll take more than a flashy magic trick to beat Izabella!</i>\" taunts the cow-girl.\n\n");
				else outputText("\"<i>Is that all you've got?  It'll take more than a flashy magic trick to beat Isabella!</i>\" taunts the cow-girl.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			else if (monsterTarget.short == "Vala" && !monsterTarget.hasStatusEffect(StatusEffects.Stunned)) {
				outputText("  Vala beats her wings with surprising strength, blowing the fireball back at you!  ");		
				if (player.findPerk(PerkLib.Evade) >= 0 && rand(2) == 0) {
					outputText("You dive out of the way and evade it!");
				}
				else if (player.findPerk(PerkLib.Flexibility) >= 0 && rand(4) == 0) {
					outputText("You use your flexibility to barely fold your body out of the way!");
				}
				else {
					damage = int(damage / 6);
					outputText("Your own fire smacks into your face, arousing you!");
					dynStats("lus", damage);
				}
				outputText("\n");
			}
			else {
				if (monsterTarget.inte < 10) {
					outputText("  Your foe lets out a shriek as their form is engulfed in the blistering flames.");
					damage = int(damage);
					outputText("<b>(<font color=\"#800000\">+" + damage + "</font>)</b>\n");
					monsterTarget.HP -= damage;
				}
				else {
					if (monsterTarget.lustVuln > 0) {
						outputText("  Your foe cries out in surprise and then gives a sensual moan as the flames of your passion surround them and fill their body with unnatural lust.");
						monsterTarget.teased(monsterTarget.lustVuln * damage / 6);
						outputText("\n");
					}
					else {
						outputText("  The corrupted fire doesn't seem to have effect on " + monsterTarget.a + monsterTarget.short + "!\n");
					}
				}
			}
			outputText("\n");
			if (monsterTarget.short == "Holli" && !monsterTarget.hasStatusEffect(StatusEffects.HolliBurning)) (monsterTarget as Holli).lightHolliOnFireMagically();
			if (combat.countMonstersLeft() <= 0) { 
				if (monster.HP < 1) {
					doNext(combat.endHpVictory);
				}
				else if (monster.lust100 >= 99) {
					doNext(combat.endLustVictory);
				}
			}
			else getGame().combat.enemyTurn();
		}
		
		//Possess
		public  possess(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, possess)) return;
			clearOutput();
			if (isExhausted(10, 1, "use this ability", magicalSpecials)) return;
			if (isSilencedSpecial(false, magicalSpecials, "focus to possess")) return;
			if (monsterTarget.short == "plain girl" || monsterTarget.findPerk(PerkLib.Incorporeality) >= 0) {
				outputText("With a smile and a wink, your form becomes completely intangible, and you waste no time in throwing yourself toward the opponent's frame.  Sadly, it was doomed to fail, as you bounce right off your foe's ghostly form.");
			}
			else if (monsterTarget is LivingStatue)
			{
				outputText("There is nothing to possess inside the golem.");
			}
			//Sample possession text (>79 int, perhaps?):
			else if ((!monsterTarget.hasCock() && !monsterTarget.hasVagina()) || monsterTarget.lustVuln == 0 || monsterTarget.inte == 0 || monsterTarget.inte > 100 + (player.newGamePlusMod() * 25)) {
				outputText("With a smile and a wink, your form becomes completely intangible, and you waste no time in throwing yourself into the opponent's frame.  Unfortunately, it seems ");
				if (monsterTarget.inte > 100 + (player.newGamePlusMod() * 25)) outputText("they were FAR more mentally prepared than anything you can handle, and you're summarily thrown out of their body before you're even able to have fun with them.  Darn, you muse.\n\n");
				else outputText("they have a body that's incompatible with any kind of possession.\n\n");
			}
			//Success!
			else if (player.inte >= (monsterTarget.inte - 10) + rand(21)) {
				outputText("With a smile and a wink, your form becomes completely intangible, and you waste no time in throwing yourself into your opponent's frame. Before they can regain the initiative, you take control of one of their arms, vigorously masturbating for several seconds before you're finally thrown out. Recorporealizing, you notice your enemy's blush, and know your efforts were somewhat successful.");
			var  damage: number = Math.round(player.inte/5) + rand(player.level) + player.level;
				monsterTarget.teased(monsterTarget.lustVuln * damage);
				outputText("\n\n");
			}
			//Fail
			else {
				outputText("With a smile and a wink, your form becomes completely intangible, and you waste no time in throwing yourself into the opponent's frame. Unfortunately, it seems they were more mentally prepared than you hoped, and you're summarily thrown out of their body before you're even able to have fun with them. Darn, you muse. Gotta get smarter.\n\n");
			}
			if (!combat.combatRoundOver()) getGame().combat.enemyTurn();
		}
		
		//Whisper 
		public  superWhisperAttack(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, superWhisperAttack)) return;
			clearOutput();
			if (isExhausted(10, 1, "focus this ability", magicalSpecials)) return;
			if (isSilencedSpecial(false, magicalSpecials, "speak to reach the enemy's mind")) return;
			if (monsterTarget.short == "pod" || monsterTarget.inte == 0) {
				clearOutput();
				outputText("You reach for the enemy's mind, but cannot find anything.  You frantically search around, but there is no consciousness as you know it in the room.\n\n");
				player.changeFatigue(1);
				getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget is LivingStatue)
			{
				outputText("There is nothing inside the golem to whisper to.");
				player.changeFatigue(1);
				getGame().combat.enemyTurn();
				return;
			}
			player.changeFatigue(10, 1);
			if (monsterTarget.hasStatusEffect(StatusEffects.Shell)) {
				outputText("As soon as your magic touches the multicolored shell around " + monsterTarget.a + monsterTarget.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget.findPerk(PerkLib.Focused) >= 0) {
				if (!monsterTarget.plural) outputText(monsterTarget.capitalA + monsterTarget.short + " is too focused for your whispers to influence!\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//Enemy too strong or multiplesI think you 
			if (player.inte < monsterTarget.inte || monsterTarget.plural) {
				outputText("You reach for your enemy's mind, but can't break through.\n");
				player.changeFatigue(10);
				getGame().combat.enemyTurn();
				return;
			}
			//[Failure] 
			if (rand(10) == 0) {
				outputText("As you reach for your enemy's mind, you are distracted and the chorus of voices screams out all at once within your mind. You're forced to hastily silence the voices to protect yourself.");
				player.changeFatigue(10);
				getGame().combat.enemyTurn();
				return;
			}
			outputText("You reach for your enemy's mind, watching as its sudden fear petrifies your foe.\n\n");
			monsterTarget.createStatusEffect(StatusEffects.Fear,1,0,0,0);
			getGame().combat.enemyTurn();
		}
		
		//Corrupted Fox Fire
		public  corruptedFoxFire(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, corruptedFoxFire)) return;
			clearOutput();
			if (isExhausted(35, 1, "use this ability", magicalSpecials)) return;
			if (isSilencedSpecial(false, magicalSpecials)) return;
			//Deals direct damage and lust regardless of enemy defenses.  Especially effective against non-corrupted targets.
			outputText("Holding out your palm, you conjure corrupted purple flame that dances across your fingertips.  You launch it at " + monsterTarget.a + monsterTarget.short + " with a ferocious throw, and it bursts on impact, showering dazzling lavender sparks everywhere.  ");

		var  dmg: number = int(10 + (player.inte / 3 + rand(player.inte / 2)) * player.spellMod());
			dmg = calcInfernoMod(dmg);
			if (monsterTarget.cor >= 66) dmg = Math.round(dmg * .66);
			else if (monsterTarget.cor >= 50) dmg = Math.round(dmg * .8);
			else if (monsterTarget.cor >= 25) dmg = Math.round(dmg * 1.0);
			else if (monsterTarget.cor >= 10) dmg = Math.round(dmg * 1.2);
			else dmg = Math.round(dmg * 1.3);
			//High damage to goes.
			if (monsterTarget.short == "goo-girl") temp = Math.round(temp * 1.5);
			//Using fire attacks on the goo]
			if (monsterTarget.short == "goo-girl") {
				outputText("Your flames lick the girl's body and she opens her mouth in pained protest as you evaporate much of her moisture. When the fire passes, she seems a bit smaller and her slimy " + monsterTarget.skin.tone + " skin has lost some of its shimmer.  ");
				if (monsterTarget.findPerk(PerkLib.Acid) < 0) monsterTarget.createPerk(PerkLib.Acid,0,0,0,0);
			}
			dmg = combat.doDamage(dmg, true, true, monsterTarget);
			outputText("\n\n");
			flags[kFLAGS.LAST_ATTACK_TYPE] = 2;
			flags[kFLAGS.SPELLS_CAST]++;
			spellPerkUnlock();
			if (getGame().combat.countMonstersLeft() <= 0) doNext(combat.endHpVictory);
			else getGame().combat.enemyTurn();
		}
		//Fox Fire
		public  foxFire(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, foxFire)) return;
			clearOutput();
			if (isExhausted(35, 1, "use this ability", magicalSpecials)) return;
			if (isSilencedSpecial(false, magicalSpecials)) return;
			if (monsterTarget.hasStatusEffect(StatusEffects.Shell)) {
				outputText("As soon as your magic touches the multicolored shell around " + monsterTarget.a + monsterTarget.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//Deals direct damage and lust regardless of enemy defenses.  Especially effective against corrupted targets.
			outputText("Holding out your palm, you conjure an ethereal blue flame that dances across your fingertips.  You launch it at " + monsterTarget.a + monsterTarget.short + " with a ferocious throw, and it bursts on impact, showering dazzling azure sparks everywhere.  ");
		var  dmg: number = int(10+(player.inte/3 + rand(player.inte/2)) * player.spellMod());
			dmg = calcInfernoMod(dmg);
			if (monsterTarget.cor < 33) dmg = Math.round(dmg * .66);
			else if (monsterTarget.cor < 50) dmg = Math.round(dmg * .8);
			else if (monsterTarget.cor < 75) dmg = Math.round(dmg * 1.0);
			else if (monsterTarget.cor < 90) dmg = Math.round(dmg * 1.2);
			else dmg = Math.round(dmg * 1.3); //30% more damage against very high corruption.
			//High damage to goes.
			if (monsterTarget.short == "goo-girl") temp = Math.round(temp * 1.5);
			//Using fire attacks on the goo]
			if (monsterTarget.short == "goo-girl") {
				outputText("Your flames lick the girl's body and she opens her mouth in pained protest as you evaporate much of her moisture. When the fire passes, she seems a bit smaller and her slimy " + monsterTarget.skin.tone + " skin has lost some of its shimmer.  ");
				if (monsterTarget.findPerk(PerkLib.Acid) < 0) monsterTarget.createPerk(PerkLib.Acid,0,0,0,0);
			}
			dmg = combat.doDamage(dmg, true, true, monsterTarget);
			outputText("\n\n");
			flags[kFLAGS.LAST_ATTACK_TYPE] = 2;
			flags[kFLAGS.SPELLS_CAST]++;
			spellPerkUnlock();
			if (getGame().combat.countMonstersLeft() <= 0) doNext(combat.endHpVictory);
			else getGame().combat.enemyTurn();
		}
		
		//Terror
		public  kitsuneTerror(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, kitsuneTerror)) return;
			clearOutput();
			//Fatigue Cost: 25
			if (isExhausted(20, 1, "use this ability", magicalSpecials)) return;
			if (isSilencedSpecial(false, magicalSpecials)) return;
			if (monsterTarget.hasStatusEffect(StatusEffects.Shell)) {
				outputText("As soon as your magic touches the multicolored shell around " + monsterTarget.a + monsterTarget.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget.short == "pod" || monsterTarget.inte == 0) {
				clearOutput();
				outputText("You reach for the enemy's mind, but cannot find anything.  You frantically search around, but there is no consciousness as you know it in the room.\n\n");
				player.changeFatigue(1);
				getGame().combat.enemyTurn();
				return;
			}
			player.changeFatigue(20,1);
			//Inflicts fear and reduces enemy SPD.
			outputText("The world goes dark, an inky shadow blanketing everything in sight as you fill " + monsterTarget.a + monsterTarget.short + "'s mind with visions of otherworldly terror that defy description.");
			//(succeed)
			if (player.inte / 10 + rand(20) + 1 > monsterTarget.inte / 10 + 10 + (monsterTarget.statusEffectv2(StatusEffects.Fear) * 2)) {
				outputText("  They cower in horror as they succumb to your illusion, believing themselves beset by eldritch horrors beyond their wildest nightmares.\n\n");
				//Create status effect and increment.
				if (monsterTarget.statusEffectv2(StatusEffects.Fear) > 0)
					monsterTarget.addStatusValue(StatusEffects.Fear, 2, 1)
				else
					monsterTarget.createStatusEffect(StatusEffects.Fear, 0, 1, 0, 0);
				monsterTarget.addStatusValue(StatusEffects.Fear, 1, 5);
				monsterTarget.spe -= 5;
				if (monsterTarget.spe < 1) monsterTarget.spe = 1;
			}
			else {
				outputText("  The dark fog recedes as quickly as it rolled in as they push back your illusions, resisting your hypnotic influence.");
				if (monsterTarget.statusEffectv2(StatusEffects.Fear) >= 4) outputText(" Your foe might be resistant by now.");
				outputText("\n\n");
			}
			getGame().combat.enemyTurn();
		}
		//Illusion
		public  kitsuneIllusion(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, kitsuneIllusion)) return;
			clearOutput();
			if (isExhausted(25, 1, "use this ability", magicalSpecials)) return;
			if (isSilencedSpecial(false, magicalSpecials)) return;
			if (monsterTarget.short == "pod" || monsterTarget.inte == 0) {
				clearOutput();
				outputText("In the tight confines of this pod, there's no use making such an attack!\n\n");
				player.changeFatigue(1);
				getGame().combat.enemyTurn();
				return;
			}
			player.changeFatigue(25,1);
			if (monsterTarget.hasStatusEffect(StatusEffects.Shell)) {
				outputText("As soon as your magic touches the multicolored shell around " + monsterTarget.a + monsterTarget.short + ", it sizzles and fades to nothing.  Whatever that thing is, it completely blocks your magic!\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//Decrease enemy speed and increase their susceptibility to lust attacks if already 110% or more
			outputText("The world begins to twist and distort around you as reality bends to your will, " + monsterTarget.a + monsterTarget.short + "'s mind blanketed in the thick fog of your illusions.");
			//Check for success rate. Maximum 100% with over 90 Intelligence difference between PC and monsterTarget. There are diminishing returns. The more you cast, the harder it is to apply another layer of illusion.
			if (player.inte/10 + rand(20) > monsterTarget.inte/10 + 9 + monsterTarget.statusEffectv1(StatusEffects.Illusion) * 2) {
			//Reduce speed down to -20. Um, are there many monsters with 110% lust vulnerability?
				outputText("  They stumble humorously to and fro, unable to keep pace with the shifting illusions that cloud their perceptions.\n\n");
				if (monsterTarget.statusEffectv1(StatusEffects.Illusion) > 0) monsterTarget.addStatusValue(StatusEffects.Illusion, 1, 1);
				else monsterTarget.createStatusEffect(StatusEffects.Illusion, 1, 0, 0, 0);
				if (monsterTarget.spe >= 0) monsterTarget.spe -= (20 - (monsterTarget.statusEffectv1(StatusEffects.Illusion) * 5));
				if (monsterTarget.lustVuln >= 1.1) monsterTarget.lustVuln += .1;
				if (monsterTarget.spe < 1) monsterTarget.spe = 1;
			}
			else {
				outputText("  Like the snapping of a rubber band, reality falls back into its rightful place as they resist your illusory conjurations.\n\n");
			}
			getGame().combat.enemyTurn();
		}
		
		//Stare
		public  paralyzingStare(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, paralyzingStare)) return;
		var  theMonster: string      = monsterTarget.a + monsterTarget.short;
		var  TheMonster: string      = monsterTarget.capitalA + monsterTarget.short;
		var  stareTraining: number   = Math.min(1, flags[kFLAGS.BASILISK_RESISTANCE_TRACKER] / 100);
		var  magnitude: number       = 16 + stareTraining * 8;
		var  bse:BasiliskSlowDebuff = monsterTarget.createOrFindStatusEffect(StatusEffects.BasiliskSlow) as BasiliskSlowDebuff;
		var  oldSpeed: number        = monsterTarget.spe;
		var  speedDiff: number          = 0;
		var  message: string         = "";

			output.clear();
			if (isExhausted(20, 1, "use this ability", magicalSpecials)) return;
			if (isSilencedSpecial(false, magicalSpecials, "talk to keep up the compulsion")) return;
			if (monsterTarget is EncapsulationPod || monsterTarget.inte == 0) {
				output.text("In the tight confines of this pod, there's no use making such an attack!\n\n");
				player.changeFatigue(1);
				getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget is TentacleBeast) {
				output.text("You try to find the beast's eyes to stare at them, but you soon realize, that it has none at all!\n\n");
				player.changeFatigue(1);
				getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget.findPerk(PerkLib.BasiliskResistance) >= 0) {
				output.text("You attempt to apply your paralyzing stare at " + theMonster + ", but you soon realize, that " + monsterTarget.pronoun1 + " is immune to your eyes, so you quickly back up.\n\n");
				player.changeFatigue(10, 1);
				getGame().combat.enemyTurn();
				return;
			}
			player.changeFatigue(20, 1);
			if (monsterTarget.hasStatusEffect(StatusEffects.Shell)) {
				output.text("As soon as your magic touches the multicolored shell around " + theMonster + ", it sizzles and fades to nothing. Whatever that thing is, it completely blocks your magic!\n\n");
				getGame().combat.enemyTurn();
				return;
			}

			output.text("You open your mouth and, staring at " + theMonster + ", uttering calming words to soothe " + monsterTarget.pronoun3 + " mind."
			           +"  The sounds bore into " + theMonster + "'s mind, working and buzzing at the edges of " + monsterTarget.pronoun3 + " resolve,"
			           +" suggesting, compelling, then demanding " + monsterTarget.pronoun2 + " to look into your eyes.  ");

			if (!monsterTarget.hasStatusEffect(StatusEffects.BasiliskCompulsion) && (monsterTarget.inte + 110 - stareTraining * 30 - player.inte < rand(100))) {
				//Reduce speed down to -16 (no training) or -24 (full training).
				message = TheMonster + " can't help " + monsterTarget.pronoun2 + "self... " + monsterTarget.pronoun1 + " glimpses your eyes. " + monsterTarget.Pronoun1
				        + " looks away quickly, but " + monsterTarget.pronoun1 + " can picture them in " + monsterTarget.pronoun3 + " mind's eye, staring in at "
				        + monsterTarget.pronoun3 + " thoughts, making " + monsterTarget.pronoun2 + " feel sluggish and unable to coordinate. Something about the"
				        + " helplessness of it feels so good... " + monsterTarget.pronoun1 + " can't banish the feeling that really, " + monsterTarget.pronoun1
				        + " wants to look into your eyes forever, for you to have total control over " + monsterTarget.pronoun2 + ". ";
				bse.applyEffect(magnitude);
				monsterTarget.createStatusEffect(StatusEffects.BasiliskCompulsion, magnitude * 0.75, 0, 0, 0);
				flags[kFLAGS.BASILISK_RESISTANCE_TRACKER] += 4;
				speedDiff = Math.round(oldSpeed - monsterTarget.spe);
				output.text(message + combat.getDamageText(speedDiff) + "\n\n");
			} else {
				output.text("Like the snapping of a rubber band, reality falls back into its rightful place as " + monsterTarget.a + monsterTarget.short + " escapes your gaze.\n\n");
				flags[kFLAGS.BASILISK_RESISTANCE_TRACKER] += 2;
			}
			getGame().combat.enemyTurn();
		}

		//------------
		// P. SPECIALS
		//------------
		public  addTailSlapButton(button: number): void {
			addButton(button, "Tail Slap", tailSlapAttack).hint("Set your tail ablaze in red-hot flames to whip your foe with it to hurt and burn them! \n\nFatigue Cost: " + player.physicalCost(30));
		}
		public  addTailWhipButton(button: number): void {
			addButton(button, "Tail Whip", tailWhipAttack).hint("Whip your foe with your tail to enrage them and lower their defense! \n\nFatigue Cost: " + player.physicalCost(15));
		}
		public  physicalSpecials(): void {
			if (getGame().urtaQuest.isUrta()) {
				getGame().urtaQuest.urtaSpecials();
				return;
			}
			if (getGame().inCombat && player.hasStatusEffect(StatusEffects.Sealed) && player.statusEffectv2(StatusEffects.Sealed) == 5) {
				clearOutput();
				outputText("You try to ready a special attack, but wind up stumbling dizzily instead.  <b>Your ability to use physical special attacks was sealed, and now you've wasted a chance to attack!</b>\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			menu();
		var  button: number = 0;
			//Anemone STINGZ!
			if (player.hair.type == 4) {
				addButton(button++, "AnemoneSting", anemoneSting).hint("Attempt to strike an opponent with the stinging tentacles growing from your scalp. Reduces enemy speed and increases enemy lust. \n\nNo Fatigue Cost", "Anemone Sting");
			}
			//Bitez
			if (player.face.type == Face.SHARK_TEETH) {
				addButton(button++, "Bite", bite).hint("Attempt to bite your opponent with your shark-teeth. \n\nFatigue Cost: " + player.physicalCost(25));
			}
			else if (player.face.type == Face.SNAKE_FANGS) {
				addButton(button++, "Bite", nagaBiteAttack).hint("Attempt to bite your opponent and inject venom. \n\nFatigue Cost: " + player.physicalCost(10));
			}
			else if (player.face.type == Face.SPIDER_FANGS) {
				addButton(button++, "Bite", spiderBiteAttack).hint("Attempt to bite your opponent and inject venom. \n\nFatigue Cost: " + player.physicalCost(10));
			}
			//Bow attack
			if (player.hasKeyItem("Bow") >= 0 || player.hasKeyItem("Kelt's Bow") >= 0) {
				addButton(button++, "Bow", fireBow).hint("Use a bow to fire an arrow at your opponent. \n\nFatigue Cost: " + player.physicalCost(25));
			}
			//Constrict
			if (player.lowerBody.type == LowerBody.NAGA) {
				addButton(button++, "Constrict", getGame().desert.nagaScene.nagaPlayerConstrict).hint("Attempt to bind an enemy in your long snake-tail. \n\nFatigue Cost: " + player.physicalCost(10));
			}
			//Kick attackuuuu
			else if (player.isTaur() || player.lowerBody.type == LowerBody.HOOFED || player.lowerBody.type == LowerBody.BUNNY || player.lowerBody.type == LowerBody.KANGAROO) {
				addButton(button++, "Kick", kick).hint("Attempt to kick an enemy using your powerful lower body. \n\nFatigue Cost: " + player.physicalCost(15));
			}
			//Gore if mino horns
			if (player.horns.type == Horns.COW_MINOTAUR && player.horns.value >= 6) {
				addButton(button++, "Gore", goreAttack).hint("Lower your head and charge your opponent, attempting to gore them on your horns. This attack is stronger and easier to land with large horns. \n\nFatigue Cost: " + player.physicalCost(15));
			}
			//Rams Attack - requires rams horns
			if (player.horns.type == Horns.RAM && player.horns.value >= 2) {
				addButton(button++, "Horn Stun", ramsStun).hint("Use a ramming headbutt to try and stun your foe. \n\nFatigue Cost: " + player.physicalCost(15));
			}
			//Upheaval - requires rhino horn
			if (player.horns.type == Horns.RHINO && player.horns.value >= 2 && player.face.type == Face.RHINO) {
				addButton(button++, "Upheaval", upheavalAttack).hint("Send your foe flying with your dual nose mounted horns. \n\nFatigue Cost: " + player.physicalCost(15));
			}
			//Infest if infested
			if (player.hasStatusEffect(StatusEffects.Infested) && player.statusEffectv1(StatusEffects.Infested) == 5 && player.hasCock()) {
				addButton(button++, "Infest", getGame().mountain.wormsScene.playerInfest).hint("The infest attack allows you to cum at will, launching a stream of semen and worms at your opponent in order to infest them. Unless your foe is very aroused they are likely to simply avoid it. Only works on males or herms. \n\nAlso great for reducing your lust. \n\nFatigue Cost: " + player.physicalCost(40));
			}
			//Kiss supercedes bite.
			if (player.hasStatusEffect(StatusEffects.LustStickApplied)) {
				addButton(button++, "Kiss", kissAttack).hint("Attempt to kiss your foe on the lips with drugged lipstick. It has no effect on those without a penis. \n\nNo Fatigue Cost");
			}
			switch (player.tail.type) {
				case Tail.BEE_ABDOMEN:
					addButton(button++, "Sting", playerStinger).hint("Attempt to use your venomous bee stinger on an enemy.  Be aware it takes quite a while for your venom to build up, so depending on your abdomen's refractory period, you may have to wait quite a while between stings.  \n\nVenom: " + Math.floor(player.tail.venom) + "/100\nVenom Cost: 25");
					break;
				case Tail.SPIDER_ABDOMEN:
					addButton(button++, "Web", PCWebAttack).hint("Attempt to use your abdomen to spray sticky webs at an enemy and greatly slow them down.  Be aware it takes a while for your webbing to build up.  \n\nWeb Amount: " + Math.floor(player.tail.venom) + "/100\nWeb Cost: 33");
					break;
				case Tail.SALAMANDER:
					addTailSlapButton(button++);
					addTailWhipButton(button++);
					break;
				case Tail.SHARK:
				case Tail.LIZARD:
				case Tail.KANGAROO:
				case Tail.RACCOON:
				case Tail.FERRET:
					addTailWhipButton(button++);
					break;
				case Tail.DRACONIC:
					addButton(button++, "Tail Slam", tailSlamAttack).hint("Slam your foe with your mighty dragon tail! This attack causes grievous harm and can stun your opponent or let it bleed. \n\nFatigue Cost: " + player.physicalCost(20));
					break;
				default:
					//Nothing here, move along.
			}
			if (player.shield != ShieldLib.NOTHING) {
				addButton(button++, "Shield Bash", shieldBash).hint("Bash your opponent with a shield. Has a chance to stun. Bypasses stun immunity. \n\nThe more you stun your opponent, the harder it is to stun them again. \n\nFatigue Cost: " + player.physicalCost(20));
			}
			addButton(14, "Back", combat.combatMenu, false);
		}
		
		public  anemoneSting(): void {
			clearOutput();
			//-sting with hair (combines both bee-sting effects, but weaker than either one separately):
			//Fail!
			//25% base fail chance
			//Increased by 1% for every point over PC's speed
			//Decreased by 1% for every inch of hair the PC has
		var  prob: number = 70;
			if (monster.spe > player.spe) prob -= monster.spe - player.spe;
			prob += player.hair.length;
			if (prob < rand(100)) {
				//-miss a sting
				if (monster.plural) outputText("You rush " + monster.a + monster.short + ", whipping your hair around to catch them with your tentacles, but " + monster.pronoun1 + " easily dodge.  Oy, you hope you didn't just give yourself whiplash.");
				else outputText("You rush " + monster.a + monster.short + ", whipping your hair around to catch it with your tentacles, but " + monster.pronoun1 + " easily dodges.  Oy, you hope you didn't just give yourself whiplash.");
			}	
			//Success!
			else {
				outputText("You rush " + monster.a + monster.short + ", whipping your hair around like a genie");
				outputText(", and manage to land a few swipes with your tentacles.  ");
				if (monster.plural) outputText("As the venom infiltrates " + monster.pronoun3 + " bodies, " + monster.pronoun1 + " twitch and begin to move more slowly, hampered half by paralysis and half by arousal.");
				else outputText("As the venom infiltrates " + monster.pronoun3 + " body, " + monster.pronoun1 + " twitches and begins to move more slowly, hampered half by paralysis and half by arousal.");
				//(decrease speed/str, increase lust)
				//-venom capacity determined by hair length, 2-3 stings per level of length
				//Each sting does 5-10 lust damage and 2.5-5 speed damage
			var  damage: number = 0;
				temp = 1 + rand(2);
				if (player.hair.length >= 12) temp += 1 + rand(2);
				if (player.hair.length >= 24) temp += 1 + rand(2);
				if (player.hair.length >= 36) temp += 1;
				while(temp > 0) {
					temp--;
					damage += 5 + rand(6);
				}
				damage += player.level * 1.5;
				monster.spe -= damage/2;
				damage = monster.lustVuln * damage;
				//Clean up down to 1 decimal point
				damage = round(damage,1);
				monster.teased(damage);
			}
			//New lines and moving on!
			outputText("\n\n");
			doNext(combat.combatMenu);
			if (!combat.combatRoundOver()) getGame().combat.enemyTurn();
		}
		
		//Mouf Attack
		public  bite(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, bite)) return;
			
			//Worms are special
			if (monsterTarget.short == "worms") {
				clearOutput();
				outputText("There is no way those are going anywhere near your mouth!\n\n");
				menu();
				addButton(0, "Next", combat.combatMenu, false);
				return;
			}
			if (isExhausted(25, 2, "use your shark-like jaws")) return;
			//Amily!
			if (monsterTarget.hasStatusEffect(StatusEffects.Concentration)) {
				clearOutput();
				outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			clearOutput();
			outputText("You open your mouth wide, your shark teeth extending out. Snarling with hunger, you lunge at your opponent, set to bite right into them!  ");
			if (player.hasStatusEffect(StatusEffects.Blind)) outputText("In hindsight, trying to bite someone while blind was probably a bad idea... ");
		var  damage: number = 0;
			//Determine if dodged!
			if ((player.hasStatusEffect(StatusEffects.Blind) && rand(3) != 0) || (monsterTarget.spe - player.spe > 0 && int(Math.random()*(((monsterTarget.spe-player.spe)/4)+80)) > 80)) {
				if (monsterTarget.spe - player.spe < 8) outputText(monsterTarget.capitalA + monsterTarget.short + " narrowly avoids your attack!");
				if (monsterTarget.spe - player.spe >= 8 && monsterTarget.spe-player.spe < 20) outputText(monsterTarget.capitalA + monsterTarget.short + " dodges your attack with superior quickness!");
				if (monsterTarget.spe - player.spe >= 20) outputText(monsterTarget.capitalA + monsterTarget.short + " deftly avoids your slow attack.");
				outputText("\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//Determine damage - str modified by enemy toughness!
			damage = int((player.str + 45) * (monsterTarget.damagePercent() / 100));
			
			//Deal damage and update based on perks
			if (damage > 0) {
				if (player.findPerk(PerkLib.HistoryFighter) >= 0) damage *= 1.1;
				if (player.jewelryEffectId == JewelryLib.MODIFIER_ATTACK_POWER) damage *= 1 + (player.jewelryEffectMagnitude / 100);
				if (player.countCockSocks("red") > 0) damage *= (1 + player.countCockSocks("red") * 0.02);
			}
			
			if (damage <= 0) {
				damage = 0;
				outputText("Your bite is deflected or blocked by " + monsterTarget.a + monsterTarget.short + ". ");
			}
			if (damage > 0 && damage < 10) {
				outputText("You bite doesn't do much damage to " + monsterTarget.a + monsterTarget.short + "! ");
			}
			if (damage >= 10 && damage < 20) {
				outputText("You seriously wound " + monsterTarget.a + monsterTarget.short + " with your bite! ");
			}
			if (damage >= 20 && damage < 30) {
				outputText("Your bite staggers " + monsterTarget.a + monsterTarget.short + " with its force. ");
			}
			if (damage >= 30) {
				outputText("Your powerful bite <b>mutilates</b> " + monsterTarget.a + monsterTarget.short + "! ");
			}
			if (damage > 0) damage = combat.doDamage(damage, true, true, monsterTarget);
			outputText("\n\n");
		 	combat.checkAchievementDamage(damage);
			//Kick back to main if no damage occured!
			if (getGame().combat.countMonstersLeft() > 0) {
				getGame().combat.enemyTurn();
			}
			else {
				if (monsterTarget.HP <= 0) doNext(combat.endHpVictory);
				else doNext(combat.endLustVictory);
			}
		}
		
		public  nagaBiteAttack(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, nagaBiteAttack)) return;
			clearOutput();
			//FATIIIIGUE
			if (player.fatigue + player.physicalCost(10) > player.maxFatigue()) {
				outputText("You just don't have the energy to bite something right now...");
				menu();
				addButton(0, "Next", combat.combatMenu, false);
				return;
			}
			player.changeFatigue(10,2);
			//Amily!
			if (monsterTarget.hasStatusEffect(StatusEffects.Concentration)) {
				outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.");
				getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget is LivingStatue)
			{
				outputText("Your fangs can't even penetrate the giant's flesh.");
				getGame().combat.enemyTurn();
				return;
			}
			//Works similar to bee stinger, must be regenerated over time. Shares the same poison-meter
		    if (rand(player.spe/2 + 40) + 20 > monsterTarget.spe/1.5 || monsterTarget.hasStatusEffect(StatusEffects.Constricted)) {
				//(if monster = demons)
				if (monsterTarget.short == "demons") outputText("You look at the crowd for a moment, wondering which of their number you should bite. Your glance lands upon the leader of the group, easily spotted due to his snakeskin cloak. You quickly dart through the demon crowd as it closes in around you and lunge towards the broad form of the leader. You catch the demon off guard and sink your needle-like fangs deep into his flesh. You quickly release your venom and retreat before he, or the rest of the group manage to react.");
				//(Otherwise) 
				else outputText("You lunge at the foe headfirst, fangs bared. You manage to catch " + monsterTarget.a + monsterTarget.short + " off guard, your needle-like fangs penetrating deep into " + monsterTarget.pronoun3 + " body. You quickly release your venom, and retreat before " + monsterTarget.pronoun1 + " manages to react.");
				//The following is how the enemy reacts over time to poison. It is displayed after the description paragraph,instead of lust
			var  oldMonsterStrength: number = monsterTarget.str;
			var  oldMonsterSpeed: number = monsterTarget.spe;
			var  effectTexts: any[] = [];
			var  strengthDiff: number = 0;
			var  speedDiff: number = 0;

				monsterTarget.str -= 5 + rand(5);
				monsterTarget.spe -= 5 + rand(5);
				if (monsterTarget.str < 1) monsterTarget.str = 1;
				if (monsterTarget.spe < 1) monsterTarget.spe = 1;

				strengthDiff = oldMonsterStrength - monsterTarget.str;
				speedDiff    = oldMonsterSpeed    - monsterTarget.spe;
				if (strengthDiff > 0)
					effectTexts.push(monsterTarget.pronoun3 + " strength by <b><font color=\"#800000\">" + strengthDiff + "</font></b>"); 
				if (speedDiff > 0)
					effectTexts.push(monsterTarget.pronoun3 + " speed by <b><font color=\"#800000\">" + speedDiff + "</font></b>"); 
				if (effectTexts.length > 0)
					outputText("\n\nThe poison reduced " + formatStringArray(effectTexts) + "!");
				if (monsterTarget.hasStatusEffect(StatusEffects.NagaVenom))
					monsterTarget.addStatusValue(StatusEffects.NagaVenom,1,1);
				else
					monsterTarget.createStatusEffect(StatusEffects.NagaVenom,1,0,0,0);
			}
			else {
		       outputText("You lunge headfirst, fangs bared. Your attempt fails horrendously, as " + monsterTarget.a + monsterTarget.short + " manages to counter your lunge, knocking your head away with enough force to make your ears ring.");
			}
			outputText("\n\n");
			if (getGame().combat.countMonstersLeft() <= 0) combat.combatRoundOver();
			else getGame().combat.enemyTurn();
		}
		
		public  spiderBiteAttack(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, spiderBiteAttack)) return;
			clearOutput();
			//FATIIIIGUE
			if (player.fatigue + player.physicalCost(10) > player.maxFatigue()) {
				outputText("You just don't have the energy to bite something right now...");
				menu();
				addButton(0, "Next", combat.combatMenu, false);
				return;
			}
			player.changeFatigue(10,2);
			//Amily!
			if (monsterTarget.hasStatusEffect(StatusEffects.Concentration)) {
				outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.");
				getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget is LivingStatue)
			{
				outputText("Your fangs can't even penetrate the giant's flesh.");
				getGame().combat.enemyTurn();
				return;
			}
			//Works similar to bee stinger, must be regenerated over time. Shares the same poison-meter
		    if (rand(player.spe/2 + 40) + 20 > monsterTarget.spe/1.5) {
				//(if monster = demons)
				if (monsterTarget.short == "demons") outputText("You look at the crowd for a moment, wondering which of their number you should bite. Your glance lands upon the leader of the group, easily spotted due to his snakeskin cloak. You quickly dart through the demon crowd as it closes in around you and lunge towards the broad form of the leader. You catch the demon off guard and sink your needle-like fangs deep into his flesh. You quickly release your venom and retreat before he, or the rest of the group manage to react.");
				//(Otherwise) 
				else {
					if (!monsterTarget.plural) outputText("You lunge at the foe headfirst, fangs bared. You manage to catch " + monsterTarget.a + monsterTarget.short + " off guard, your needle-like fangs penetrating deep into " + monsterTarget.pronoun3 + " body. You quickly release your venom, and retreat before " + monsterTarget.a + monsterTarget.pronoun1 + " manages to react.");
					else outputText("You lunge at the foes headfirst, fangs bared. You manage to catch one of " + monsterTarget.a + monsterTarget.short + " off guard, your needle-like fangs penetrating deep into " + monsterTarget.pronoun3 + " body. You quickly release your venom, and retreat before " + monsterTarget.a + monsterTarget.pronoun1 + " manage to react.");
				}
				//React
				if (monsterTarget.lustVuln == 0) outputText("  Your aphrodisiac toxin has no effect!");
				else {
					if (monsterTarget.plural) outputText("  The one you bit flushes hotly, though the entire group seems to become more aroused in sympathy to their now-lusty compatriot.");
					else outputText("  " + monsterTarget.mf("He","She") + " flushes hotly and " + monsterTarget.mf("touches his suddenly-stiff member, moaning lewdly for a moment.","touches a suddenly stiff nipple, moaning lewdly.  You can smell her arousal in the air."));
				var  lustDmg: number = 25 * monsterTarget.lustVuln;
					if (rand(5) == 0) lustDmg *= 2;
					monsterTarget.teased(lustDmg);
				}
			}
			else {
		       outputText("You lunge headfirst, fangs bared. Your attempt fails horrendously, as " + monsterTarget.a + monsterTarget.short + " manages to counter your lunge, pushing you back out of range.");
			}
			outputText("\n\n");
			if (getGame().combat.countMonstersLeft() <= 0) combat.combatRoundOver();
			else getGame().combat.enemyTurn();
		}
		
		public  fireBow(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, fireBow)) return;
			clearOutput();
			if (isExhausted(25, 2, "fire the bow")) return;
			if (monsterTarget.hasStatusEffect(StatusEffects.BowDisabled)) {
				outputText("You can't use your bow right now!");
				menu();
				addButton(0, "Next", combat.combatMenu, false);
				return;
			}
			player.changeFatigue(25, 2);
			//Amily!
			if (monsterTarget.hasStatusEffect(StatusEffects.Concentration)) {
				outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			if (player.hasStatusEffect(StatusEffects.KnockedBack) && monsterTarget is Mimic) {
				outputText("You remember how Kelt told something like \"<i>only fight massive targets that have no chance to dodge.</i>\" Well, looks like you've found one.  ");
			}
			//Prep messages vary by skill.
			if (player.statusEffectv1(StatusEffects.Kelt) < 30) {
				outputText("Fumbling a bit, you nock an arrow and fire!\n");
			}
			else if (player.statusEffectv1(StatusEffects.Kelt) < 50) {
				outputText("You pull an arrow and fire it at " + monsterTarget.a + monsterTarget.short + "!\n");
			}
			else if (player.statusEffectv1(StatusEffects.Kelt) < 80) {
				outputText("With one smooth motion you draw, nock, and fire your deadly arrow at your opponent!\n");
			}
			else if (player.statusEffectv1(StatusEffects.Kelt) <= 99) {
				outputText("In the blink of an eye you draw and fire your bow directly at " + monsterTarget.a + monsterTarget.short + ".\n");
			}
			else {
				outputText("You casually fire an arrow at " + monsterTarget.a + monsterTarget.short + " with supreme skill.\n");
				//Keep it from going over 100
				player.changeStatusValue(StatusEffects.Kelt, 1, 100);
			}
			// Practice makes perfect!
			if (player.statusEffectv1(StatusEffects.Kelt) < 100) {
				if (!player.hasStatusEffect(StatusEffects.Kelt))
					player.createStatusEffect(StatusEffects.Kelt, 0, 0, 0, 0);
				player.addStatusValue(StatusEffects.Kelt, 1, 1);
			}
			if (monsterTarget.hasStatusEffect(StatusEffects.Sandstorm) && rand(10) > 1) {
				outputText("Your shot is blown off target by the tornado of sand and wind.  Damn!\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//[Bow Response]
			if (monsterTarget.short == "Isabella" && !monsterTarget.hasStatusEffect(StatusEffects.Stunned)) {
				if (monsterTarget.hasStatusEffect(StatusEffects.Blind))
					outputText("Isabella hears the shot and turns her shield towards it, completely blocking it with her wall of steel.\n\n");
				else outputText("You arrow thunks into Isabella's shield, completely blocked by the wall of steel.\n\n");
				if (getGame().isabellaFollowerScene.isabellaAccent())
					outputText("\"<i>You remind me of ze horse-people.  They cannot deal vith mein shield either!</i>\" cheers Isabella.\n\n");
				else outputText("\"<i>You remind me of the horse-people.  They cannot deal with my shield either!</i>\" cheers Isabella.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//worms are immune
			if (monsterTarget.short == "worms") {
				outputText("The arrow slips between the worms, sticking into the ground.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//Vala miss chance!
			if (monsterTarget.short == "Vala" && rand(10) < 7 && !monsterTarget.hasStatusEffect(StatusEffects.Stunned)) {
				outputText("Vala flaps her wings and twists her body. Between the sudden gust of wind and her shifting of position, the arrow goes wide.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//Blind miss chance
			if (player.hasStatusEffect(StatusEffects.Blind)) {
				outputText("The arrow hits something, but blind as you are, you don't have a chance in hell of hitting anything with a bow.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//Miss chance 10% based on speed + 10% based on int + 20% based on skill
			if (monsterTarget.short != "pod" && player.spe / 10 + player.inte / 10 + player.statusEffectv1(StatusEffects.Kelt) / 5 + 60 < rand(101)) {
				outputText("The arrow goes wide, disappearing behind your foe.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//Hit!  Damage calc! 20 +
		var  damage: number = 0;
			damage = int(((20 + player.str / 3 + player.statusEffectv1(StatusEffects.Kelt) / 1.2) + player.spe / 3) * (monsterTarget.damagePercent() / 100));
			if (damage < 0) damage = 0;
			if (damage == 0) {
				if (monsterTarget.inte > 0)
					outputText(monsterTarget.capitalA + monsterTarget.short + " shrugs as the arrow bounces off them harmlessly.\n\n");
				else outputText("The arrow bounces harmlessly off " + monsterTarget.a + monsterTarget.short + ".\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget.short == "pod")
				outputText("The arrow lodges deep into the pod's fleshy wall");
			else if (monsterTarget.plural)
				outputText(monsterTarget.capitalA + monsterTarget.short + " look down at the arrow that now protrudes from one of " + monsterTarget.pronoun3 + " bodies");
			else outputText(monsterTarget.capitalA + monsterTarget.short + " looks down at the arrow that now protrudes from " + monsterTarget.pronoun3 + " body");
			if (player.findPerk(PerkLib.HistoryFighter) >= 0) damage *= 1.1;
			if (player.hasKeyItem("Kelt's Bow") >= 0) damage *= 1.3;
			damage = combat.doDamage(damage, true, false, monsterTarget);
			monsterTarget.lust -= 20;
			if (monsterTarget.lust < 0) monsterTarget.lust = 0;
			if (monsterTarget.HP <= 0) {
				if (monsterTarget.short == "pod")
					outputText(". ");
				else if (monsterTarget.plural)
					outputText(" and stagger, collapsing onto each other from the wounds you've inflicted on " + monsterTarget.pronoun2 + ". ");
				else outputText(" and staggers, collapsing from the wounds you've inflicted on " + monsterTarget.pronoun2 + ". ");
				outputText("<b>(<font color=\"#800000\">" + String(damage) + "</font>)</b>");
				outputText("\n\n");
			 	combat.checkAchievementDamage(damage);
				doNext(combat.endHpVictory);
				return;
			}
			else outputText(".  It's clearly very painful. <b>(<font color=\"#800000\">" + String(damage) + "</font>)</b>\n\n");
			flags[kFLAGS.LAST_ATTACK_TYPE] = 1;
		 	combat.checkAchievementDamage(damage);
			getGame().combat.enemyTurn();
		}
		
		public  kick(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, kick)) return;
			clearOutput();
			if (isExhausted(15, 2, "use a charge attack")) return;
			//Variant start messages!
			if (player.lowerBody.type == LowerBody.KANGAROO) {
				//(tail)
				if (player.tail.type == Tail.KANGAROO) outputText("You balance on your flexible kangaroo-tail, pulling both legs up before slamming them forward simultaneously in a brutal kick.  ");
				//(no tail) 
				else outputText("You balance on one leg and cock your powerful, kangaroo-like leg before you slam it forward in a kick.  ");
			}
			//(bunbun kick) 
			else if (player.lowerBody.type == LowerBody.BUNNY) outputText("You leap straight into the air and lash out with both your furred feet simultaneously, slamming forward in a strong kick.  ");
			//(centaur kick)
			else if (player.lowerBody.type == LowerBody.HOOFED || player.lowerBody.type == LowerBody.PONY || player.lowerBody.type == LowerBody.CLOVEN_HOOFED)
				if (player.isTaur()) outputText("You lurch up onto your backlegs, lifting your forelegs from the ground a split-second before you lash them out in a vicious kick.  ");
				//(bipedal hoof-kick) 
				else outputText("You twist and lurch as you raise a leg and slam your hoof forward in a kick.  ");

			if (flags[kFLAGS.PC_FETISH] >= 3) {
				outputText("You attempt to attack, but at the last moment your body wrenches away, preventing you from even coming close to landing a blow!  Ceraph's piercings have made normal attack impossible!  Maybe you could try something else?\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//Amily!
			if (monsterTarget.hasStatusEffect(StatusEffects.Concentration)) {
				outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//Blind
			if (player.hasStatusEffect(StatusEffects.Blind)) {
				outputText("You attempt to attack, but as blinded as you are right now, you doubt you'll have much luck!  ");
			}
			//Worms are special
			if (monsterTarget.short == "worms") {
				//50% chance of hit (int boost)
				if (rand(100) + player.inte/3 >= 50) {
					temp = int(player.str/5 - rand(5));
					if (temp == 0) temp = 1;
					outputText("You strike at the amalgamation, crushing countless worms into goo, dealing " + temp + " damage.\n\n");
					monsterTarget.HP -= temp;
					if (monsterTarget.HP <= 0) {
						doNext(combat.endHpVictory);
						return;
					}
				}
				//Fail
				else {
					outputText("You attempt to crush the worms with your reprisal, only to have the collective move its individual members, creating a void at the point of impact, leaving you to attack only empty air.\n\n");
				}
				getGame().combat.enemyTurn();
				return;
			}
		var  damage: number;
			//Determine if dodged!
			if ((player.hasStatusEffect(StatusEffects.Blind) && rand(2) == 0) || (monsterTarget.spe - player.spe > 0 && int(Math.random()*(((monsterTarget.spe-player.spe)/4)+80)) > 80)) {
				//Akbal dodges special education
				if (monsterTarget.short == "Akbal") outputText("Akbal moves like lightning, weaving in and out of your furious attack with the speed and grace befitting his jaguar body.\n");
				else {		
					outputText(monsterTarget.capitalA + monsterTarget.short + " manage");
					if (!monsterTarget.plural) outputText("s");
					outputText(" to dodge your kick!");
					outputText("\n\n");
				}
				getGame().combat.enemyTurn();
				return;
			}
			//Determine damage
			//Base:
			damage = player.str;
			//Leg bonus
			//Bunny - 20, Kangaroo - 35, 1 hoof = 30, 2 hooves = 40
			if (player.lowerBody.type == LowerBody.HOOFED || player.lowerBody.type == LowerBody.PONY || player.lowerBody.type == LowerBody.CLOVEN_HOOFED)
				damage += 30;
			else if (player.lowerBody.type == LowerBody.BUNNY) damage += 20;
			else if (player.lowerBody.type == LowerBody.KANGAROO) damage += 35;
			if (player.isTaur()) damage += 10;
			//Damage post processing!
			if (player.findPerk(PerkLib.HistoryFighter) >= 0) damage *= 1.1;
			if (player.jewelryEffectId == JewelryLib.MODIFIER_ATTACK_POWER) damage *= 1 + (player.jewelryEffectMagnitude / 100);
			if (player.countCockSocks("red") > 0) damage *= (1 + player.countCockSocks("red") * 0.02);
			//Reduce damage
			damage *= monsterTarget.damagePercent() / 100;
			//(None yet!)
			if (damage > 0) damage = combat.doDamage(damage, true, false, monsterTarget);
			
			//BLOCKED
			if (damage <= 0) {
				damage = 0;
				outputText(monsterTarget.capitalA + monsterTarget.short);
				if (monsterTarget.plural) outputText("'");
				else outputText("s");
				outputText(" defenses are too tough for your kick to penetrate!");
			}
			//LAND A HIT!
			else {
				outputText(monsterTarget.capitalA + monsterTarget.short);
				if (!monsterTarget.plural) outputText(" reels from the damaging impact! <b>(<font color=\"#800000\">" + damage + "</font>)</b>");
				else outputText(" reel from the damaging impact! <b>(<font color=\"#800000\">" + damage + "</font>)</b>");
			}
			if (damage > 0) {
				//Lust raised by anemone contact!
				if (monsterTarget.short == "anemone") {
					outputText("\nThough you managed to hit the anemone, several of the tentacles surrounding her body sent home jolts of venom when your swing brushed past them.");
					//(gain lust, temp lose str/spd)
					(monsterTarget as Anemone).applyVenom((1+rand(2)));
				}
			}
			outputText("\n\n");
		 	combat.checkAchievementDamage(damage);
			if (getGame().combat.countMonstersLeft() <= 0) combat.combatRoundOver();
			else getGame().combat.enemyTurn();
		}
		
		//Gore Attack - uses 15 fatigue!
		public  goreAttack(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, goreAttack)) return;
			clearOutput();
			if (isExhausted(15, 2, "use a charge attack")) return;
			//This is now automatic - newRound arg defaults to true:	menuLoc = 0;
			if (monsterTarget.short == "worms") {
				outputText("Taking advantage of your new natural weapons, you quickly charge at the freak of nature. Sensing impending danger, the creature willingly drops its cohesion, causing the mass of worms to fall to the ground with a sick, wet 'thud', leaving your horns to stab only at air.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
		var  damage: number = 0;
			//Amily!
			if (monsterTarget.hasStatusEffect(StatusEffects.Concentration)) {
				outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//Bigger horns = better success chance.
			//Small horns - 60% hit
			if (player.horns.value >= 6 && player.horns.value < 12) {
				temp = 60;
			}
			//bigger horns - 75% hit
			if (player.horns.value >= 12 && player.horns.value < 20) {
				temp = 75;
			}
			//huge horns - 90% hit
			if (player.horns.value >= 20) {
				temp = 80;
			}
			//Vala dodgy bitch!
			if (monsterTarget.short == "Vala") {
				temp = 20;
			}
			//Account for monster speed - up to -50%.
			temp -= monsterTarget.spe/2;
			//Account for player speed - up to +50%
			temp += player.spe/2;
			//Hit & calculation
			if (temp >= rand(100)) {
			var  horns: number = player.horns.value;
				if (player.horns.value > 40) player.horns.value = 40;
				damage = int(player.str + horns * 2 * (monsterTarget.damagePercent() / 100)); //As normal attack + horn length bonus
				//normal
				if (rand(4) > 0) {
					outputText("You lower your head and charge, skewering " + monsterTarget.a + monsterTarget.short + " on one of your bullhorns!  ");
				}
				//CRIT
				else {
					//doubles horn bonus damage
					damage *= 2;
					outputText("You lower your head and charge, slamming into " + monsterTarget.a + monsterTarget.short + " and burying both your horns into " + monsterTarget.pronoun2 + "! <b>Critical hit!</b>  ");
				}
				//Bonus damage for rut!
				if (player.inRut && monsterTarget.cockTotal() > 0) {
					outputText("The fury of your rut lent you strength, increasing the damage!  ");
					damage += 5;
				}
				//Bonus per level damage
				damage += player.level * 2;
				//Reduced by armor
				damage *= monsterTarget.damagePercent() / 100;
				if (damage < 0) damage = 5;
				//CAP 'DAT SHIT
				if (damage > player.level * 10 + 100) damage = player.level * 10 + 100;
				if (damage > 0) {
					if (player.findPerk(PerkLib.HistoryFighter) >= 0) damage *= 1.1;
					if (player.jewelryEffectId == JewelryLib.MODIFIER_ATTACK_POWER) damage *= 1 + (player.jewelryEffectMagnitude / 100);
					if (player.countCockSocks("red") > 0) damage *= (1 + player.countCockSocks("red") * 0.02);
					damage = combat.doDamage(damage, true, false, monsterTarget);
				}
				//Different horn damage messages
				if (damage < 20) outputText("You pull yourself free, dealing <b><font color=\"#080000\">" + damage + "</font></b> damage.");
				if (damage >= 20 && damage < 40) outputText("You struggle to pull your horns free, dealing <b><font color=\"#080000\">" + damage + "</font></b> damage.");
				if (damage >= 40) outputText("With great difficulty you rip your horns free, dealing <b><font color=\"#080000\">" + damage + "</font></b> damage.");
			}
			//Miss
			else {
				//Special vala changes
				if (monsterTarget.short == "Vala") {
					outputText("You lower your head and charge Vala, but she just flutters up higher, grabs hold of your horns as you close the distance, and smears her juicy, fragrant cunt against your nose.  The sensual smell and her excited moans stun you for a second, allowing her to continue to use you as a masturbation aid, but she quickly tires of such foreplay and flutters back with a wink.\n\n");
					dynStats("lus", 5);
				}
				else outputText("You lower your head and charge " + monsterTarget.a + monsterTarget.short + ", only to be sidestepped at the last moment!");
			}
			//New line before monster attack
			outputText("\n\n");
		 	combat.checkAchievementDamage(damage);
			flags[kFLAGS.LAST_ATTACK_TYPE] = 0;
			//Victory ORRRRR enemy turn.
			if (getGame().combat.countMonstersLeft() > 0) getGame().combat.enemyTurn();
			else {
				if (monsterTarget.HP <= 0) doNext(combat.endHpVictory);
				if (monsterTarget.lust >= monsterTarget.maxLust()) doNext(combat.endLustVictory);
			}
		}
		
		 // Fingers crossed I did ram attack right -Foxwells
		public  ramsStun(targetSelected: boolean = false, monsterTarget:Monster = undefined): void { // More or less copy/pasted from upheaval
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, ramsStun)) return; 
			if (isExhausted(15, 2, "use a charge attack")) return;
			clearOutput();
			if (monsterTarget.short == "worms") {
				outputText("Taking advantage of your new natural weapon, you quickly charge at the freak of nature. Sensing impending danger, the creature willingly drops its cohesion, causing the mass of worms to fall to the ground with a sick, wet 'thud', leaving your horns to stab only at air.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
		var  damage: number = 0;
			//Amily!
			if (monsterTarget.hasStatusEffect(StatusEffects.Concentration)) {
				outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//Bigger horns = better chance of not missing
			//Tiny horns - 30% hit
			if (player.horns.value < 6) {
				temp = 30;
			}
			//Small horns - 60% hit
			if (player.horns.value >= 6 && player.horns.value < 12) {
				temp = 60;
			}
			//bigger horns - 75% hit
			if (player.horns.value >= 12 && player.horns.value < 20) {
				temp = 75;
			}
			//huge horns - 90% hit
			if (player.horns.value >= 20) {
				temp = 80;
			}
			//Vala, who is a Fuckening
			if (monsterTarget.short == "Vala") {
				temp = 20;
			}
			//Account for monster speed - up to -50%.
			temp -= monsterTarget.spe/2;
			//Account for player speed - up to +50%
			temp += player.spe/2;
			//Hit & calculation
			if (temp >= rand(100)) {
				damage = int((player.str + ((player.spe * 0.2) + (player.level * 2)) * (monsterTarget.damagePercent() / 100)) * 0.7);
				if (damage < 0) damage = 5;
				//Normal
				outputText("You lower your horns towards your opponent. With a quick charge, you catch them off guard, sending them sprawling to the ground! ");
				//Critical
				if (combat.combatCritical()) {
					outputText("<b>Critical hit! </b>");
					damage *= 1.75;
				}
				//Capping damage
				if (damage > player.level * 10 + 100) damage = player.level * 10 + 100;
				if (damage > 0) {
					if (player.findPerk(PerkLib.HistoryFighter) >= 0) damage *= 1.1;
					if (player.jewelryEffectId == JewelryLib.MODIFIER_ATTACK_POWER) damage *= 1 + (player.jewelryEffectMagnitude / 100);
					if (player.countCockSocks("red") > 0) damage *= (1 + player.countCockSocks("red") * 0.02);
					//Rounding to a whole numbr
					damage = int(damage);
					damage = combat.doDamage(damage, true, false, monsterTarget);
				}
			// How likely you'll stun
			// Uses the same roll as damage except ensured unique
			if (!monsterTarget.hasStatusEffect(StatusEffects.Stunned) && temp >= rand(99)) {
				outputText("<b>Your impact also manages to stun " + monsterTarget.a + monsterTarget.short + "!</b> ");
				monsterTarget.createStatusEffect(StatusEffects.Stunned, 2, 0, 0, 0);
			}
				outputText("<b>(<font color=\"" + mainViewManager.colorHpMinus() + "\">" + damage + "</font>)</b>");
				outputText("\n\n");
			}
			//Miss
			else {
				//Special vala stuffs
				if (monsterTarget.short == "Vala") {
					outputText("You lower your head and charge Vala, but she just flutters up higher, grabs hold of your horns as you close the distance, and smears her juicy, fragrant cunt against your nose.  The sensual smell and her excited moans stun you for a second, allowing her to continue to use you as a masturbation aid, but she quickly tires of such foreplay and flutters back with a wink.\n\n");
					dynStats("lus", 5);
				}
				else outputText("You lower your horns towards your opponent. With a quick charge you attempt to knock them to the ground. They manage to dodge out of the way at the last minute, leaving you panting and annoyed.");
			}
			//We're done, enemy time
			outputText("\n\n");
			flags[kFLAGS.LAST_ATTACK_TYPE] = 0;
		 	combat.checkAchievementDamage(damage);
			//Victory/monster attack
			if (getGame().combat.countMonstersLeft() > 0) getGame().combat.enemyTurn();
			else {
				if (monsterTarget.HP <= 0) doNext(combat.endHpVictory);
				if (monsterTarget.lust >= monsterTarget.maxLust()) doNext(combat.endLustVictory);
			}
		}
		
		//Upheaval Attack
		public  upheavalAttack(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, upheavalAttack)) return;
			if (isExhausted(15, 2, "use a charge attack")) return;
			clearOutput();
			if (monsterTarget.short == "worms") {
				outputText("Taking advantage of your new natural weapon, you quickly charge at the freak of nature. Sensing impending danger, the creature willingly drops its cohesion, causing the mass of worms to fall to the ground with a sick, wet 'thud', leaving your horns to stab only at air.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
		var  damage: number = 0;
			//Amily!
			if (monsterTarget.hasStatusEffect(StatusEffects.Concentration)) {
				outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			temp = 80; // Basic chance. Just as minos with fully grown horns.
			//Vala dodgy bitch!
			if (monsterTarget.short == "Vala") {
				temp = 20;
			}
			//Account for monster speed - up to -50%.
			temp -= monsterTarget.spe/2;
			//Account for player speed - up to +50%
			temp += player.spe/2;
			//Hit & calculation
			if (temp >= rand(100)) {
				damage = int(player.str + (player.tou / 2) + (player.spe / 2) + (player.level * 2) * 1.2 * (monsterTarget.damagePercent() / 100)); //As normal attack + horn length bonus
				if (damage < 0) damage = 5;
				//Normal
				outputText("You hurl yourself towards the foe with your head low and jerk your head upward, every muscle flexing as you send your enemy flying. ");
				//Critical
				if (combat.combatCritical()) {
					outputText("<b>Critical hit! </b>");
					damage *= 1.75;
				}
				//CAP 'DAT SHIT
				if (damage > player.level * 10 + 100) damage = player.level * 10 + 100;
				if (damage > 0) {
					if (player.findPerk(PerkLib.HistoryFighter) >= 0) damage *= 1.1;
					if (player.jewelryEffectId == JewelryLib.MODIFIER_ATTACK_POWER) damage *= 1 + (player.jewelryEffectMagnitude / 100);
					if (player.countCockSocks("red") > 0) damage *= (1 + player.countCockSocks("red") * 0.02);
					//Round it off
					damage = int(damage);
					damage = combat.doDamage(damage, true, false, monsterTarget);
				}
				outputText("\n\n");
			}
			//Miss
			else {
				//Special vala changes
				if (monster.short == "Vala") {
					outputText("You lower your head and charge Vala, but she just flutters up higher, grabs hold of your horns as you close the distance, and smears her juicy, fragrant cunt against your nose.  The sensual smell and her excited moans stun you for a second, allowing her to continue to use you as a masturbation aid, but she quickly tires of such foreplay and flutters back with a wink.\n\n");
					dynStats("lus", 5);
				}
				else outputText("You hurl yourself towards the foe with your head low and snatch it upwards, hitting nothing but air.");
			}
			//New line before monster attack
			outputText("\n\n");
			flags[kFLAGS.LAST_ATTACK_TYPE] = 0;
		 	combat.checkAchievementDamage(damage);
			//Victory ORRRRR enemy turn.
			if (getGame().combat.countMonstersLeft() > 0) getGame().combat.enemyTurn();
			else {
				if (monster.HP <= 0) doNext(combat.endHpVictory);
				if (monster.lust >= monster.maxLust()) doNext(combat.endLustVictory);
			}
		}
		
		//Player sting attack
		public  playerStinger(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, playerStinger)) return;
			clearOutput();
			if (player.tail.venom < 25) {
				outputText("You do not have enough venom to sting right now!");
				doNext(physicalSpecials);
				return;
			}
			//Worms are immune!
			if (monsterTarget.short == "worms") {
				outputText("Taking advantage of your new natural weapons, you quickly thrust your stinger at the freak of nature. Sensing impending danger, the creature willingly drops its cohesion, causing the mass of worms to fall to the ground with a sick, wet 'thud', leaving you to stab only at air.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//Determine if dodged!
			//Amily!
			if (monsterTarget.hasStatusEffect(StatusEffects.Concentration)) {
				outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget.spe - player.spe > 0 && int(Math.random()*(((monsterTarget.spe-player.spe)/4)+80)) > 80) {
				if (monsterTarget.spe - player.spe < 8) outputText(monsterTarget.capitalA + monsterTarget.short + " narrowly avoids your stinger!\n\n");
				if (monsterTarget.spe - player.spe >= 8 && monsterTarget.spe-player.spe < 20) outputText(monsterTarget.capitalA + monsterTarget.short + " dodges your stinger with superior quickness!\n\n");
				if (monsterTarget.spe - player.spe >= 20) outputText(monsterTarget.capitalA + monsterTarget.short + " deftly avoids your slow attempts to sting " + monsterTarget.pronoun2 + ".\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//determine if avoided with armor.
			if (monsterTarget.armorDef - player.level >= 10 && rand(4) > 0) {
				outputText("Despite your best efforts, your sting attack can't penetrate " +  monsterTarget.a + monsterTarget.short + "'s defenses.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//Sting successful!
			outputText("Searing pain lances through " + monsterTarget.a + monsterTarget.short + " as you manage to sting " + monsterTarget.pronoun2 + "!  ");
			if (monsterTarget.plural) outputText("You watch as " + monsterTarget.pronoun1 + " stagger back a step and nearly trip, flushing hotly.");
			else outputText("You watch as " + monsterTarget.pronoun1 + " staggers back a step and nearly trips, flushing hotly.");
			//Tabulate damage!
		var  damage: number = 35 + rand(player.lib/10);
			//Level adds more damage up to a point (level 30)
			if (player.level < 10) damage += player.level * 3;
			else if (player.level < 20) damage += 30 + (player.level - 10) * 2;
			else if (player.level < 30) damage += 50 + (player.level - 20) * 1;
			else damage += 60;
			monsterTarget.teased(monsterTarget.lustVuln * damage);
			if (!monsterTarget.hasStatusEffect(StatusEffects.lustvenom)) monsterTarget.createStatusEffect(StatusEffects.lustvenom, 0, 0, 0, 0);
			//New line before monster attack
			outputText("\n\n");
			//Use tail mp
			player.tail.venom -= 25;
			//Kick back to main if no damage occured!
			if (getGame().combat.countMonstersLeft() > 0) getGame().combat.enemyTurn();
			else doNext(combat.endLustVictory);
		}
		
		public  PCWebAttack(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, PCWebAttack)) return;
			clearOutput();
			//Keep logic sane if this attack brings victory
			if (player.tail.venom < 33) {
				outputText("You do not have enough webbing to shoot right now!");
				doNext(physicalSpecials);
				return;
			}
			player.tail.venom-= 33;
			//Amily!
			if (monsterTarget.hasStatusEffect(StatusEffects.Concentration)) {
				outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			if (monsterTarget.short == "lizan rogue") {
				outputText("As your webbing flies at him the lizan flips back, slashing at the adhesive strands with the claws on his hands and feet with practiced ease.  It appears he's used to countering this tactic.");
				getGame().combat.enemyTurn();
				return;
			}
			//Blind
			if (player.hasStatusEffect(StatusEffects.Blind)) {
				outputText("You attempt to attack, but as blinded as you are right now, you doubt you'll have much luck!  ");
			}
			else outputText("Turning and clenching muscles that no human should have, you expel a spray of sticky webs at " + monsterTarget.a + monsterTarget.short + "!  ");
			//Determine if dodged!
			if ((player.hasStatusEffect(StatusEffects.Blind) && rand(2) == 0) || (monsterTarget.spe - player.spe > 0 && int(Math.random()*(((monsterTarget.spe-player.spe)/4)+80)) > 80)) {
				outputText("You miss " + monsterTarget.a + monsterTarget.short + " completely - ");
				if (monsterTarget.plural) outputText("they");
				else outputText(monsterTarget.mf("he","she") + " moved out of the way!\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			//Over-webbed
			if (monsterTarget.spe < 1) {
				if (!monsterTarget.plural) outputText(monsterTarget.capitalA + monsterTarget.short + " is completely covered in webbing, but you hose " + monsterTarget.mf("him","her") + " down again anyway.");
				else outputText(monsterTarget.capitalA + monsterTarget.short + " are completely covered in webbing, but you hose them down again anyway.");
			}
			//LAND A HIT!
			else {
				if (!monsterTarget.plural) outputText("The adhesive strands cover " + monsterTarget.a + monsterTarget.short + " with restrictive webbing, greatly slowing " + monsterTarget.mf("him","her") + ". ");
				else outputText("The adhesive strands cover " + monsterTarget.a + monsterTarget.short + " with restrictive webbing, greatly slowing " + monsterTarget.mf("him","her") + ". ");
				monsterTarget.spe -= 45;
				if (monsterTarget.spe < 0) monsterTarget.spe = 0;
			}
			awardAchievement("How Do I Shot Web?", kACHIEVEMENTS.COMBAT_SHOT_WEB);
			outputText("\n\n");
			if (monsterTarget.HP < 1 || monsterTarget.lust >= monsterTarget.maxLust()) combat.combatRoundOver();
			else getGame().combat.enemyTurn();
		}
		
		public  kissAttack(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, kissAttack)) return;
			clearOutput();
			if (player.hasStatusEffect(StatusEffects.Blind)) {
				outputText("There's no way you'd be able to find their lips while you're blind!");
				doNext(physicalSpecials);
				return;
			}
		var  attack: number = rand(6);
			switch(attack) {
				case 1:
					//Attack text 1:
					outputText("You hop up to " + monsterTarget.a + monsterTarget.short + " and attempt to plant a kiss on " + monsterTarget.pronoun3 + ".");
					break;
				//Attack text 2:
				case 2:
					outputText("You saunter up and dart forward, puckering your golden lips into a perfect kiss.");
					break;
				//Attack text 3: 
				case 3:
					outputText("Swaying sensually, you wiggle up to " + monsterTarget.a + monsterTarget.short + " and attempt to plant a nice wet kiss on " + monsterTarget.pronoun2 + ".");
					break;
				//Attack text 4:
				case 4:
					outputText("Lunging forward, you fly through the air at " + monsterTarget.a + monsterTarget.short + " with your lips puckered and ready to smear drugs all over " + monsterTarget.pronoun2 + ".");
					break;
				//Attack text 5:
				case 5:
					outputText("You lean over, your lips swollen with lust, wet with your wanting slobber as you close in on " + monsterTarget.a + monsterTarget.short + ".");
					break;
				//Attack text 6:
				default:
					outputText("Pursing your drug-laced lips, you close on " + monsterTarget.a + monsterTarget.short + " and try to plant a nice, wet kiss on " + monsterTarget.pronoun2 + ".");
					break;
			}
			//Dodged!
			if (monsterTarget.spe - player.spe > 0 && rand(((monsterTarget.spe - player.spe)/4)+80) > 80) {
				attack = rand(3);
				switch(attack) {
					//Dodge 1:
					case 1:
						if (monsterTarget.plural) outputText("  " + monsterTarget.capitalA + monsterTarget.short + " sees it coming and moves out of the way in the nick of time!\n\n");
						break;
					//Dodge 2:
					case 2:
						if (monsterTarget.plural) outputText("  Unfortunately, you're too slow, and " + monsterTarget.a + monsterTarget.short + " slips out of the way before you can lay a wet one on one of them.\n\n");
						else outputText("  Unfortunately, you're too slow, and " + monsterTarget.a + monsterTarget.short + " slips out of the way before you can lay a wet one on " + monsterTarget.pronoun2 + ".\n\n");
						break;
					//Dodge 3:
					default:
						if (monsterTarget.plural) outputText("  Sadly, " + monsterTarget.a + monsterTarget.short + " moves aside, denying you the chance to give one of them a smooch.\n\n");
						else outputText("  Sadly, " + monsterTarget.a + monsterTarget.short + " moves aside, denying you the chance to give " + monsterTarget.pronoun2 + " a smooch.\n\n");
						break;
				}
				getGame().combat.enemyTurn();
				return;
			}
			//Success but no effect:
			if (monsterTarget.lustVuln <= 0 || !monsterTarget.hasCock()) {
				if (monsterTarget.plural) outputText("  Mouth presses against mouth, and you allow your tongue to stick out to taste the saliva of one of their number, making sure to give them a big dose.  Pulling back, you look at " + monsterTarget.a + monsterTarget.short + " and immediately regret wasting the time on the kiss.  It had no effect!\n\n");
				else outputText("  Mouth presses against mouth, and you allow your tongue to stick to taste " + monsterTarget.pronoun3 + "'s saliva as you make sure to give them a big dose.  Pulling back, you look at " + monsterTarget.a + monsterTarget.short + " and immediately regret wasting the time on the kiss.  It had no effect!\n\n");
				getGame().combat.enemyTurn();
				return;
			}
			attack = rand(4);
		var  damage: number = 0;
			switch(attack) {
				//Success 1:
				case 1:
					if (monsterTarget.plural) outputText("  Success!  A spit-soaked kiss lands right on one of their mouths.  The victim quickly melts into your embrace, allowing you to give them a nice, heavy dose of sloppy oral aphrodisiacs.");
					else outputText("  Success!  A spit-soaked kiss lands right on " + monsterTarget.a + monsterTarget.short + "'s mouth.  " + monsterTarget.mf("He","She") + " quickly melts into your embrace, allowing you to give them a nice, heavy dose of sloppy oral aphrodisiacs.");
					damage = 15;
					break;
				//Success 2:
				case 2:
					if (monsterTarget.plural) outputText("  Gold-gilt lips press into one of their mouths, the victim's lips melding with yours.  You take your time with your suddenly cooperative captive and make sure to cover every bit of their mouth with your lipstick before you let them go.");
					else outputText("  Gold-gilt lips press into " + monsterTarget.a + monsterTarget.short + ", " + monsterTarget.pronoun3 + " mouth melding with yours.  You take your time with your suddenly cooperative captive and make sure to cover every inch of " + monsterTarget.pronoun3 + " with your lipstick before you let " + monsterTarget.pronoun2 + " go.");
					damage = 20;
					break;
				//CRITICAL SUCCESS (3)
				case 3:
					if (monsterTarget.plural) outputText("  You slip past " + monsterTarget.a + monsterTarget.short + "'s guard and press your lips against one of them.  " + monsterTarget.mf("He","She") + " melts against you, " + monsterTarget.mf("his","her") + " tongue sliding into your mouth as " + monsterTarget.mf("he","she") + " quickly succumbs to the fiery, cock-swelling kiss.  It goes on for quite some time.  Once you're sure you've given a full dose to " + monsterTarget.mf("his","her") + " mouth, you break back and observe your handwork.  One of " + monsterTarget.a + monsterTarget.short + " is still standing there, licking " + monsterTarget.mf("his","her") + " his lips while " + monsterTarget.mf("his","her") + " dick is standing out, iron hard.  You feel a little daring and give the swollen meat another moist peck, glossing the tip in gold.  There's no way " + monsterTarget.mf("he","she") + " will go soft now.  Though you didn't drug the rest, they're probably a little 'heated up' from the show.");
					else outputText("  You slip past " + monsterTarget.a + monsterTarget.short + "'s guard and press your lips against " + monsterTarget.pronoun3 + ".  " + monsterTarget.mf("He","She") + " melts against you, " + monsterTarget.pronoun3 + " tongue sliding into your mouth as " + monsterTarget.pronoun1 + " quickly succumbs to the fiery, cock-swelling kiss.  It goes on for quite some time.  Once you're sure you've given a full dose to " + monsterTarget.pronoun3 + " mouth, you break back and observe your handwork.  " + monsterTarget.capitalA + monsterTarget.short + " is still standing there, licking " + monsterTarget.pronoun3 + " lips while " + monsterTarget.pronoun3 + " dick is standing out, iron hard.  You feel a little daring and give the swollen meat another moist peck, glossing the tip in gold.  There's no way " + monsterTarget.pronoun1 + " will go soft now.");
					damage = 30;
					break;
				//Success 4:
				default:
					outputText("  With great effort, you slip through an opening and compress their lips against your own, lust seeping through the oral embrace along with a heavy dose of drugs.");
					damage = 12;
					break;
			}
			//Add status if not already drugged
			if (!monsterTarget.hasStatusEffect(StatusEffects.LustStick)) monsterTarget.createStatusEffect(StatusEffects.LustStick, 0, 0, 0, 0);
			//Else add bonus to round damage
			else monsterTarget.addStatusValue(StatusEffects.LustStick, 2, Math.round(damage / 10));
			//Deal damage
			monsterTarget.teased(monsterTarget.lustVuln * damage);
			outputText("\n\n");
			//Sets up for end of combat, and if not, goes to AI.
			if (!combat.combatRoundOver()) getGame().combat.enemyTurn();
		}
		
		//special attack: tail whip? could unlock button for use by dagrons too
		//tiny damage and lower monster armor by ~75% for one turn
		//hit
		public  tailWhipAttack(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, tailWhipAttack)) return;
			clearOutput();
			if (isExhausted(10, 2, "perform a tail whip")) return;
			//miss
			if ((player.hasStatusEffect(StatusEffects.Blind) && rand(2) == 0) || (monsterTarget.spe - player.spe > 0 && int(Math.random() * (((monsterTarget.spe-player.spe) / 4) + 80)) > 80)) {
				outputText("Twirling like a top, you swing your tail, but connect with only empty air.");
			}
			else {
				if (!monsterTarget.plural) outputText("Twirling like a top, you bat your opponent with your tail.  For a moment, " + monsterTarget.pronoun1 + " looks disbelieving, as if " + monsterTarget.pronoun3 + " world turned upside down, but " + monsterTarget.pronoun1 + " soon becomes irate and redoubles " + monsterTarget.pronoun3 + " offense, leaving large holes in " + monsterTarget.pronoun3 + " guard.  If you're going to take advantage, it had better be right away; " + monsterTarget.pronoun1 + "'ll probably cool off very quickly.");
				else outputText("Twirling like a top, you bat your opponent with your tail.  For a moment, " + monsterTarget.pronoun1 + " look disbelieving, as if " + monsterTarget.pronoun3 + " world turned upside down, but " + monsterTarget.pronoun1 + " soon become irate and redouble " + monsterTarget.pronoun3 + " offense, leaving large holes in " + monsterTarget.pronoun3 + " guard.  If you're going to take advantage, it had better be right away; " + monsterTarget.pronoun1 + "'ll probably cool off very quickly.");
				if (!monsterTarget.hasStatusEffect(StatusEffects.CoonWhip)) monsterTarget.createStatusEffect(StatusEffects.CoonWhip,0,0,0,0);
				temp = Math.round(monsterTarget.armorDef * .75);
				while(temp > 0 && monsterTarget.armorDef >= 1) {
					monsterTarget.armorDef--;
					monsterTarget.addStatusValue(StatusEffects.CoonWhip,1,1);
					temp--;
				}
				monsterTarget.addStatusValue(StatusEffects.CoonWhip,2,2);
				if (player.tail.type == Tail.RACCOON) monsterTarget.addStatusValue(StatusEffects.CoonWhip,2,2);
			}
			player.changeFatigue(15,2);
			outputText("\n\n");
			getGame().combat.enemyTurn();
		}
		
		public  tailSlamAttack(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, tailSlamAttack)) return;
			clearOutput();
			if (player.fatigue + player.physicalCost(20) > player.maxFatigue()) {
				outputText("You are too exhausted to perform a tail slam.");
				doNext(curry(combat.combatMenu,false));
				return;
			}
			player.changeFatigue(20, 2);

			//miss
			if ((player.hasStatusEffect(StatusEffects.Blind) && rand(2) === 0) || (monsterTarget.spe - player.spe > 0 && int(Math.random() * (((monsterTarget.spe - player.spe) / 4) + 80)) > 80)) {
				outputText("You swing your mighty tail, but your attack finds purchase on naught but the air.\n\n");
				getGame().combat.enemyTurn();
				return;
			}

			outputText("With a great sweep, you slam your [if (monsterTarget.plural)opponents|opponent] with your powerful tail."
			          +" [monsterTarget.capitalA][monsterTarget.short] [if (monsterTarget.plural)reel|reels] from the impact, knocked flat on [monsterTarget.pronoun3] bum,"
			          +" battered and bruised.\n");

		var  damage: number = 10 + (player.str / 1.1) + rand(player.str / 2);
			damage *= (monsterTarget.damagePercent() / 100);
			damage = combat.doDamage(damage, true, false, monsterTarget);
			outputText("Your assault is nothing short of impressive, dealing <b><font color=\"#800000\">" + damage + "</font></b> damage! ");

			// Stun chance
		var  chance: number = Math.floor(monsterTarget.statusEffectv1(StatusEffects.TimesBashed) + 1);
			if (chance > 10) chance = 10;
			if (!monsterTarget.hasStatusEffect(StatusEffects.Stunned) && !monsterTarget.hasPerk(PerkLib.Resolute) && rand(chance) === 0) {
				outputText("<b>The harsh blow also manages to stun [monsterTarget.a][monsterTarget.short]!</b> ");
				monsterTarget.createStatusEffect(StatusEffects.Stunned, 1, 0, 0, 0);
				if (!monsterTarget.hasStatusEffect(StatusEffects.TimesBashed))
					monsterTarget.createStatusEffect(StatusEffects.TimesBashed, 1, 0, 0, 0);
				else
					monsterTarget.addStatusValue(StatusEffects.TimesBashed, 1, 1);
			}

			//50% Bleed chance
			if (rand(2) == 0 && monsterTarget.armorDef < 10 && !monsterTarget.hasStatusEffect(StatusEffects.IzmaBleed)) {
				if (monsterTarget is LivingStatue) {
					outputText("Despite the rents you've torn in its stony exterior, the statue does not bleed.");
				} else {
					monsterTarget.createStatusEffect(StatusEffects.IzmaBleed, 3, 0, 0, 0);
					outputText("\n" + monsterTarget.capitalA + monsterTarget.short + " [if (monsterTarget.plural)bleed|bleeds] profusely from the many bloody punctures your tail spikes leave behind.");
				}
			}

			flags[kFLAGS.LAST_ATTACK_TYPE] = 0;
			combat.checkAchievementDamage(damage);
			outputText("\n\n");
			getGame().combat.enemyTurn();
		}
		
		public  tailSlapAttack(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, tailSlapAttack)) return;
			clearOutput();
			if (player.fatigue + player.physicalCost(30) > player.maxFatigue()) {
				outputText("You are too tired to perform a tail slap.");
				doNext(curry(combat.combatMenu,false));
				return;
			}
			outputText("With a simple thought you set your tail ablaze.");
			//miss
			if ((player.hasStatusEffect(StatusEffects.Blind) && rand(2) == 0) || (monsterTarget.spe - player.spe > 0 && int(Math.random() * (((monsterTarget.spe-player.spe) / 4) + 80)) > 80)) {
				outputText(" Twirling like a top, you swing your tail, but connect with only empty air.");
			}
			else {
				if(!monsterTarget.plural) outputText(" Twirling like a top, you bat your opponent with your tail.");
				else outputText(" Twirling like a top, you bat your opponents with your tail.");
			var  damage: number = int(10 + (player.inte / 3 + rand(player.inte / 2)) * 0.6 * player.spellMod());
				damage = calcInfernoMod(damage);
				damage += int((player.str) - rand(monsterTarget.tou) - monsterTarget.armorDef);
				damage = combat.doDamage(damage, true, false, monsterTarget);
				outputText("  Your tail slams against " + monsterTarget.a + monsterTarget.short + ", dealing <b><font color=\"#800000\">" + damage + "</font></b> damage! ");
				combat.checkAchievementDamage(damage);
			}
			player.changeFatigue(30,2);
			outputText("\n\n");
			getGame().combat.enemyTurn();
		}

		public  shieldBash(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (combat.targetSelectionNeeded(targetSelected, monsterTarget, shieldBash)) return;
			clearOutput();
			if (isExhausted(20, 2, "perform a shield bash")) return;
			outputText("You ready your [shield] and prepare to slam it towards " + monsterTarget.a + monsterTarget.short + ".  ");
			if ((player.hasStatusEffect(StatusEffects.Blind) && rand(2) == 0) || (monsterTarget.spe - player.spe > 0 && int(Math.random() * (((monsterTarget.spe-player.spe) / 4) + 80)) > 80)) {
				if (monsterTarget.spe - player.spe < 8) outputText(monsterTarget.capitalA + monsterTarget.short + " narrowly avoids your attack!");
				if (monsterTarget.spe - player.spe >= 8 && monsterTarget.spe-player.spe < 20) outputText(monsterTarget.capitalA + monsterTarget.short + " dodges your attack with superior quickness!");
				if (monsterTarget.spe - player.spe >= 20) outputText(monsterTarget.capitalA + monsterTarget.short + " deftly avoids your slow attack.");
				getGame().combat.enemyTurn();
				return;
			}
		var  damage: number = 10 + (player.str / 1.5) + rand(player.str / 2) + (player.shieldBlock * 2);
			if (player.findPerk(PerkLib.ShieldSlam) >= 0) damage *= 1.2;
			damage *= (monsterTarget.damagePercent() / 100);
		var  chance: number = Math.floor(monsterTarget.statusEffectv1(StatusEffects.TimesBashed) + 1);
			if (chance > 10) chance = 10;
			damage = combat.doDamage(damage, true, false, monsterTarget);
			outputText("Your [shield] slams against " + monsterTarget.a + monsterTarget.short + ", dealing <b><font color=\"#800000\">" + damage + "</font></b> damage! ");
			if (!monsterTarget.hasStatusEffect(StatusEffects.Stunned) && rand(chance) == 0) {
				outputText("<b>Your impact also manages to stun " + monsterTarget.a + monsterTarget.short + "!</b> ");
				monsterTarget.createStatusEffect(StatusEffects.Stunned, 1, 0, 0, 0);
				if (!monsterTarget.hasStatusEffect(StatusEffects.TimesBashed)) monsterTarget.createStatusEffect(StatusEffects.TimesBashed, player.findPerk(PerkLib.ShieldSlam) >= 0 ? 0.5 : 1, 0, 0, 0);
				else monsterTarget.addStatusValue(StatusEffects.TimesBashed, 1, player.findPerk(PerkLib.ShieldSlam) >= 0 ? 0.5 : 1);
			}
			flags[kFLAGS.LAST_ATTACK_TYPE] = 0;
			combat.checkAchievementDamage(damage);
			player.changeFatigue(20,2);
			outputText("\n\n");
			getGame().combat.enemyTurn();
		}
		
	}


