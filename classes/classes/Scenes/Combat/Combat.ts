//Combat 2.0


	export class Combat extends BaseContent
	{
		public  Combat() {}
		
		public  combatAbilities:CombatAbilities = new CombatAbilities();
		public  combatTeases:CombatTeases = new CombatTeases();
		
		public  plotFight: boolean = false; //Used to restrict random drops from overlapping uniques
		public  combatRound: number = 0;
		
		//Used to display image of the enemy while fighting
		//Set once during beginCombat() to prevent it from changing every combat turn
		private  imageText: string = "";
		
		public  ghoulReveal: boolean = false;
		
		//If fighting multiple enemies.
		public  encounterShort: string = "";
		public  encounterLong: string = "";
		public  dropQueue: any[] = []; 
		
		public  get inCombat(): boolean {
			return getGame().inCombat;
		}
		
		public  set inCombat(mode: boolean): void {
			getGame().inCombat = mode;
		}
		
		//Victory & Loss
		public  endHpVictory(): void { 
			mainView.endCombatView();
			monster.defeated_(true);
		}
		public  endLustVictory(): void {
			mainView.endCombatView();
			monster.defeated_(false);
		}
		public  endHpLoss(): void {
			mainView.endCombatView();
			monster.won_(true,false);
		}
		public  endLustLoss(): void {
			mainView.endCombatView();
			if (player.hasStatusEffect(StatusEffects.Infested) && flags[kFLAGS.CAME_WORMS_AFTER_COMBAT] == 0) {
				flags[kFLAGS.CAME_WORMS_AFTER_COMBAT] = 1;
				getGame().mountain.wormsScene.infestOrgasm();
				monster.won_(false,true);
			} else {
				monster.won_(false,false);
			}
		}
		
		//Combat is over. Clear shit out and go to main. Also given different name to avoid conflicts with BaseContent.
		public  cleanupAfterCombat(nextFunc = undefined): void {
			combatAbilities.fireMagicLastTurn = -100;
			mainView.endCombatView();
			if (nextFunc == undefined) nextFunc = camp.returnToCampUseOneHour;
			if (prison.inPrison && prison.prisonCombatWinEvent != undefined) nextFunc = prison.prisonCombatWinEvent;
			if (inCombat) {
				//clear status
				clearStatuses();
				
				//reset the stored image for next monster
				imageText = "";
				
				//Clear itemswapping in case it hung somehow
				//No longer used:		itemSwapping = false;
				//Player won
				if (countMonstersLeft() <= 0) {
					if (monster.HP < 1) flags[kFLAGS.TOTAL_HP_VICTORIES]++;
					awardPlayer(nextFunc);
				}
				//Player lost
				else {
					if (monster.statusEffectv1(StatusEffects.Sparring) == 2) {
						outputText("The cow-girl has defeated you in a practice fight!");
						outputText("\n\nYou have to lean on Isabella's shoulder while the two of your hike back to camp.  She clearly won.");
						inCombat = false;
						player.HP = 1;
						doNext(nextFunc);
						return;
					}
					//Next button is handled within the minerva loss function
					if (monster.hasStatusEffect(StatusEffects.PeachLootLoss)) {
						inCombat = false;
						player.HP = 1;
						return;
					}
					if (monster.short == "Ember") {
						inCombat = false;
						player.HP = 1;
						doNext(nextFunc);
						return;
					}
					temp = rand(10) + 1 + Math.round(monster.level / 2);
					if (inDungeon) temp += 20 + monster.level * 2;
					//Increases gems lost in NG+.
					temp *= 1 + (player.newGamePlusMod() * 0.5);
					//Round gems.
					temp = Math.round(temp);
					//Keep gems from going below zero.
					if (temp > player.gems) temp = player.gems;
				var  timePasses: number = monster.handleCombatLossText(inDungeon, temp); //Allows monsters to customize the loss text and the amount of time lost
					player.gems -= temp;
					inCombat = false;
					if (prison.inPrison == false && flags[kFLAGS.PRISON_CAPTURE_CHANCE] > 0 && rand(100) < flags[kFLAGS.PRISON_CAPTURE_CHANCE] && (prison.trainingFeed.prisonCaptorFeedingQuestTrainingIsTimeUp() || !prison.trainingFeed.prisonCaptorFeedingQuestTrainingExists()) && (monster.short == "goblin" || monster.short == "goblin assassin" || monster.short == "imp" || monster.short == "imp lord" || monster.short == "imp warlord" || monster.short == "hellhound" || monster.short == "minotaur" || monster.short == "satyr" || monster.short == "gnoll" || monster.short == "gnoll spear-thrower" || monster.short == "basilisk")) {
						outputText("  You feel yourself being dragged and carried just before you black out.");
						doNext(prison.prisonIntro);
						return;
					}
					//BUNUS XPZ
					if (flags[kFLAGS.COMBAT_BONUS_XP_VALUE] > 0) {
						player.XP += flags[kFLAGS.COMBAT_BONUS_XP_VALUE];
						outputText("  Somehow you managed to gain " + flags[kFLAGS.COMBAT_BONUS_XP_VALUE] + " XP from the situation.");
						flags[kFLAGS.COMBAT_BONUS_XP_VALUE] = 0;
					}
					//Bonus lewts
					if (flags[kFLAGS.BONUS_ITEM_AFTER_COMBAT_ID] != "") {
						outputText("  Somehow you came away from the encounter with " + ItemType.lookupItem(flags[kFLAGS.BONUS_ITEM_AFTER_COMBAT_ID]).longName + ".\n\n");
						inventory.takeItem(ItemType.lookupItem(flags[kFLAGS.BONUS_ITEM_AFTER_COMBAT_ID]), createCallBackFunction(camp.returnToCamp, timePasses));
					}
					else doNext(createCallBackFunction(camp.returnToCamp, timePasses));
				}
			}
			//Not actually in combat
			else {
				doNext(nextFunc);
			}
			//Clear
			monster2 = undefined;
			monster3 = undefined;
			monster4 = undefined;
			encounterShort = "";
			encounterLong = "";
		}

		public  checkAchievementDamage(damage: number): void
		{
			flags[kFLAGS.ACHIEVEMENT_PROGRESS_TOTAL_DAMAGE] += damage;
			if (flags[kFLAGS.ACHIEVEMENT_PROGRESS_TOTAL_DAMAGE] >= 50000) kGAMECLASS.awardAchievement("Bloodletter", kACHIEVEMENTS.COMBAT_BLOOD_LETTER);
			if (damage >= 50) kGAMECLASS.awardAchievement("Pain", kACHIEVEMENTS.COMBAT_PAIN);
			if (damage >= 100) kGAMECLASS.awardAchievement("Fractured Limbs", kACHIEVEMENTS.COMBAT_FRACTURED_LIMBS);
			if (damage >= 250) kGAMECLASS.awardAchievement("Broken Bones", kACHIEVEMENTS.COMBAT_BROKEN_BONES);
			if (damage >= 500) kGAMECLASS.awardAchievement("Overkill", kACHIEVEMENTS.COMBAT_OVERKILL);
		}
		public  approachAfterKnockback(): void
		{
			clearOutput();
			outputText("You close the distance between you and " + monster.a + monster.short + " as quickly as possible.\n\n");
			while (player.hasStatusEffect(StatusEffects.KnockedBack)) {
				player.removeStatusEffect(StatusEffects.KnockedBack);
			}
			if (player.weapon is FlintlockPistol) {
				if (flags[kFLAGS.FLINTLOCK_PISTOL_AMMO] <= 0) {
					flags[kFLAGS.FLINTLOCK_PISTOL_AMMO] = 4;
					outputText("At the same time, you open the chamber of your pistol to reload the ammunition.  This takes up a turn.\n\n");
					enemyTurn();
					return;
				}
				else {
					outputText("At the same time, you fire a round at " + monster.short + ". ");
					attack();
					return;
				}
			}
			if (player.weapon is Blunderbuss) { //Dirty code, will put ammo later.
				outputText("At the same time, you fire a round at " + monster.short + ". ");
				attack();
				return;
			}
			if (player.weapon is Crossbow) {
				outputText("At the same time, you fire a bolt at " + monster.short + ". ");
				attack();
				return;
			}
			enemyTurn();
			return;
		}

		private  isPlayerSilenced(): boolean
		{
		var  temp: boolean = false;
			if (player.hasStatusEffect(StatusEffects.ThroatPunch)) temp = true;
			if (player.hasStatusEffect(StatusEffects.WebSilence)) temp = true;
			if (player.hasStatusEffect(StatusEffects.GooArmorSilence)) temp = true;
			if (player.hasStatusEffect(StatusEffects.WhipSilence)) temp = true;
			return temp;
		}

		private  isPlayerBound(): boolean 
		{
		var  temp: boolean = false;
			if (player.hasStatusEffect(StatusEffects.HarpyBind) || player.hasStatusEffect(StatusEffects.GooBind) || player.hasStatusEffect(StatusEffects.TentacleBind) || player.hasStatusEffect(StatusEffects.NagaBind) || monster.hasStatusEffect(StatusEffects.QueenBind) || monster.hasStatusEffect(StatusEffects.PCTailTangle)) temp = true;
			if (player.hasStatusEffect(StatusEffects.HolliConstrict)) temp = true;
			if (player.hasStatusEffect(StatusEffects.GooArmorBind)) temp = true;
			if (monster.hasStatusEffect(StatusEffects.MinotaurEntangled)) {
				outputText("\n<b>You're bound up in the minotaur lord's chains!  All you can do is try to struggle free!</b>");
				temp = true;
			}
			if (player.hasStatusEffect(StatusEffects.UBERWEB)) temp = true;
			if (player.hasStatusEffect(StatusEffects.Bound)) temp = true;
			if (player.hasStatusEffect(StatusEffects.Chokeslam)) temp = true;
			if (player.hasStatusEffect(StatusEffects.Titsmother)) temp = true;
			if (player.hasStatusEffect(StatusEffects.GiantGrabbed)) {
				outputText("\n<b>You're trapped in the giant's hand!  All you can do is try to struggle free!</b>");
				temp = true;
			}
			if (player.hasStatusEffect(StatusEffects.Tentagrappled)) {
				outputText("\n<b>The demonesses tentacles are constricting your limbs!</b>");
				temp = true;
			}
			if (player.hasStatusEffect(StatusEffects.YamataEntwine)) temp = true;
			return temp;
		}

		private  isPlayerStunned(): boolean 
		{
		var  temp: boolean = false;
			if (player.hasStatusEffect(StatusEffects.IsabellaStunned) || player.hasStatusEffect(StatusEffects.Stunned)) {
				outputText("\n<b>You're too stunned to attack!</b>  All you can do is wait and try to recover!");
				temp = true;
			}
			if (player.hasStatusEffect(StatusEffects.Whispered)) {
				outputText("\n<b>Your mind is too addled to focus on combat!</b>  All you can do is try and recover!");
				temp = true;
			}
			if (player.hasStatusEffect(StatusEffects.Confusion)) {
				outputText("\n<b>You're too confused</b> about who you are to try to attack!");
				temp = true;
			}
			return temp;
		}

		public  combatMenu(newRound: boolean = true): void { //If returning from a sub menu set newRound to false
			clearOutput();
			flags[kFLAGS.IN_COMBAT_USE_PLAYER_WAITED_FLAG] = 0;
			mainView.hideMenuButton(MainView.MENU_DATA);
			mainView.hideMenuButton(MainView.MENU_APPEARANCE);
			mainView.hideMenuButton(MainView.MENU_PERKS);
			hideUpDown();
			if (newRound) combatStatusesUpdate(); //Update Combat Statuses
			display();
		//This is now automatic - newRound arg defaults to true:	menuLoc = 0;
			if (combatRoundOver()) return;
			menu();
		var  attacks = normalAttack;
			//Standard menu before modifications.
			if (!isWieldingRangedWeapon())
				addButton(0, "Attack", attacks).hint("Attempt to attack the enemy with your " + player.weaponName + ".  Damage done is determined by your strength and weapon.");
			else if (player.weaponName.indexOf("staff") != -1)
				addButton(0, "M.Bolt", attacks).hint("Attempt to attack the enemy with magic bolt from your " + player.weaponName + ".  Damage done is determined by your intelligence, speed and weapon.", "Magic Bolt");
			else if (flags[kFLAGS.FLINTLOCK_PISTOL_AMMO] <= 0 && player.weaponName == "flintlock pistol")
				addButton(0, "Reload", attacks).hint("Your " + player.weaponName + " is out of ammo.  You'll have to reload it before attack.");
			else
				addButton(0, "Shoot", attacks).hint("Fire a round at your opponent with your " + player.weaponName + "!  Damage done is determined by your strength, speed and weapon.");
				
			addButton(1, "Tease", combatTeases.teaseAttack).hint("Attempt to make an enemy more aroused by striking a seductive pose and exposing parts of your body.");
			if (combatAbilities.canUseMagic()) addButton(2, "Spells", combatAbilities.magicMenu).hint("Opens your spells menu, where you can cast any spells you have learned.  Beware, casting spells increases your fatigue, and if you become exhausted you will be easier to defeat.");
			addButton(3, "Items", inventory.inventoryMenu).hint("The inventory allows you to use an item.  Be careful as this leaves you open to a counterattack when in combat.");
			addButton(4, "Run", runAway).hint("Choosing to run will let you try to escape from your enemy. However, it will be hard to escape enemies that are faster than you and if you fail, your enemy will get a free attack.");
			addButton(5, "P. Specials", combatAbilities.physicalSpecials).hint("Physical special attack menu.", "Physical Specials");
			addButton(6, "M. Specials", combatAbilities.magicalSpecials).hint("Mental and supernatural special attack menu.", "Magical Specials");
			addButton(7, "Wait", wait).hint("Take no action for this round.  Why would you do this?  This is a terrible idea.");
			if (monster.hasStatusEffect(StatusEffects.Level)) addButton(7, "Climb", wait).hint("Climb the sand to move away from the sand trap.");
			addButton(8, "Fantasize", fantasize).hint("Fantasize about your opponent in a sexual way.  Its probably a pretty bad idea to do this unless you want to end up getting raped.");
			//addButton(9, "Defend", defend).hint("Selecting defend will reduce the damage you take by 66 percent, but will not affect any lust incurred by your enemy's actions.");
			if (CoC_Settings.debugBuild && !debug) addButton(14, "Inspect", debugInspect).hint("Use your debug powers to inspect your enemy.");
			//Modify menus.
			if (monster.hasStatusEffect(StatusEffects.AttackDisabled)) {
				if (monster.short == "minotaur lord") {
					outputText("\n<b>Chained up as you are, you can't manage any real physical attacks!</b>");
					attacks = undefined;
				}
				else if (monster.short == "Lethice") {
					outputText("\n<b>Lethice's wings continue to flap and she keeps herself just out of reach.</b>");
					if (isWieldingRangedWeapon()) {
						outputText(" <b>Fortunately, you have a ranged weapon.</b>");
					}
					else {
						attacks = undefined;
					}
				}
			}
			//Knocked back
			if (player.hasStatusEffect(StatusEffects.KnockedBack))
			{
				outputText("\n<b>You'll need to close some distance before you can use any physical attacks!</b>");
				if (isWieldingRangedWeapon()) {
					if (flags[kFLAGS.FLINTLOCK_PISTOL_AMMO] <= 0 && player.weapon is FlintlockPistol) addButton(10, "Reload&Approach", approachAfterKnockback).hint("Reload your flintlock pistol while approaching.", "Reload and Approach");
					else addButton(10, "Fire&Approach", approachAfterKnockback).hint("Land a shot at your opponent and approach.", "Fire and Approach");
				}
				else addButton(0, "Approach", approachAfterKnockback).hint("Close some distance between you and your opponent.");
				if (player.hasKeyItem("Bow") >= 0 || player.hasKeyItem("Kelt's Bow") >= 0) addButton(5, "Bow", combatAbilities.fireBow);
			}
			//Disabled physical attacks
			if (monster.hasStatusEffect(StatusEffects.PhysicalDisabled)) {
				outputText("<b>  Even physical special attacks are out of the question.</b>");
				removeButton(5); //Removes physical special attack.
			}
			//Bound: Struggle or wait
			if (isPlayerBound()) {
				menu();
				addButton(0, "Struggle", struggle);
				addButton(1, "Wait", wait);
				if (player.hasStatusEffect(StatusEffects.UBERWEB)) {
					addButton(6, "M. Special", combatAbilities.magicalSpecials);
				}
				if (player.hasStatusEffect(StatusEffects.Bound)) {
					addButton(0, "Struggle", (monster as Ceraph).ceraphBindingStruggle);
					addButton(1, "Wait", (monster as Ceraph).ceraphBoundWait);
				}
				if (player.hasStatusEffect(StatusEffects.Chokeslam)) {
					addButton(0, "Struggle", (monster as Izumi).chokeSlamStruggle);
					addButton(1, "Wait", (monster as Izumi).chokeSlamWait);
				}
				if (player.hasStatusEffect(StatusEffects.Titsmother)) {
					addButton(0, "Struggle", (monster as Izumi).titSmotherStruggle);
					addButton(1, "Wait", (monster as Izumi).titSmotherWait);
				}
				if (player.hasStatusEffect(StatusEffects.Tentagrappled)) {
					addButton(0, "Struggle", (monster as SuccubusGardener).grappleStruggle);
					addButton(1, "Wait", (monster as SuccubusGardener).grappleWait);
				}
				if (player.hasStatusEffect(StatusEffects.YamataEntwine)) {
					addButton(0, "Struggle", (monster as Yamata).entwineStruggle);
					addButton(1, "Wait", (monster as Yamata).entwineWait);
				}
			}
			//Silence: Disables magic menu.
			if (isPlayerSilenced()) {
				removeButton(2);
			}
			//Stunned: Recover, lose 1 turn.
			if (isPlayerStunned()) {
				menu();
				addButton(0, "Recover", wait);
			}
			else if (monster.hasStatusEffect(StatusEffects.Constricted)) {
				menu();
				addButton(0, "Squeeze", getGame().desert.nagaScene.naggaSqueeze).hint("Squeeze some HP out of your opponent! \n\nFatigue Cost: " + player.physicalCost(20) + "");
				addButton(1, "Tease", getGame().desert.nagaScene.naggaTease);
				addButton(4, "Release", getGame().desert.nagaScene.nagaLeggoMyEggo);
			}
		}

		public  targetSelectionNeeded(targetSelected: boolean, target:Monster, action): boolean {
			if (targetSelected) {
				return false;
			}
			if (countMonstersLeft() == 1) {
				action(true, getOnlyMonsterLeft());
				return true;
			}
			else {
				targetSelectionMenu(action);
				return true;
			}
			
		}
		public  targetSelectionMenu(action): void {
			clearOutput();
			outputText("Which will you target?");
			menu();
			if (monster.HP > 0 && monster.lust < monster.maxLust()) addButton(0, capitalizeFirstLetter(monster.short), action, true, monster);
			if (monster2 != undefined && monster2.HP > 0 && monster2.lust < monster2.maxLust()) addButton(1, capitalizeFirstLetter(monster2.short), action, true, monster2);
			if (monster3 != undefined && monster3.HP > 0 && monster3.lust < monster3.maxLust()) addButton(2, capitalizeFirstLetter(monster3.short), action, true, monster3);
			if (monster4 != undefined && monster4.HP > 0 && monster4.lust < monster4.maxLust()) addButton(3, capitalizeFirstLetter(monster4.short), action, true, monster4);
			addButton(4, "Cancel", combatMenu, false);
		}
		
		public  countMonstersLeft(): number {
		var  amt: number = 0;
			if (monster.HP > 0 && monster.lust < monster.maxLust()) amt++;
			if (monster2 != undefined && monster2.HP > 0 && monster2.lust < monster2.maxLust()) amt++;
			if (monster3 != undefined && monster3.HP > 0 && monster3.lust < monster3.maxLust()) amt++;
			if (monster4 != undefined && monster4.HP > 0 && monster4.lust < monster4.maxLust()) amt++;
			return amt;
		}
		public  countMonstersTotal(): number {
		var  amt: number = 0;
			if (monster != undefined) amt++;
			if (monster2 != undefined) amt++;
			if (monster3 != undefined) amt++;
			if (monster4 != undefined) amt++;
			return amt;
		}
		public  getOnlyMonsterLeft():Monster { //In case if the first enemy is down and the other enemies are still standing.
			if (monster.HP > 0 && monster.lust < monster.maxLust()) return monster;
			if (monster2 != undefined && monster2.HP > 0 && monster2.lust < monster2.maxLust()) return monster2;
			if (monster3 != undefined && monster3.HP > 0 && monster3.lust < monster3.maxLust()) return monster3;
			if (monster4 != undefined && monster4.HP > 0 && monster4.lust < monster4.maxLust()) return monster4;
			return monster; //Fallback
		}
		
		public  enemyTurn(): void {
			if (monster.HP > 0 && monster.lust < monster.maxLust()) monster.doAI();
			if (monster2 != undefined && monster2.HP > 0 && monster2.lust < monster2.maxLust()) monster2.doAI();
			if (monster3 != undefined && monster3.HP > 0 && monster3.lust < monster3.maxLust()) monster3.doAI();
			if (monster4 != undefined && monster4.HP > 0 && monster4.lust < monster4.maxLust()) monster4.doAI();
		}
		
		private  normalAttack(): void {
			clearOutput();
			attack();
		}

		//TODO: Move packAttack and lustAttack to Monster.as?
		public  packAttack(): void {
			//Determine if dodged!
			if (player.spe - monster.spe > 0 && int(Math.random() * (((player.spe - monster.spe) / 4) + 80)) > 80) {
				outputText("You duck, weave, and dodge.  Despite their best efforts, the throng of demons only hit the air and each other.");
			}
			//Determine if evaded
			else if (player.findPerk(PerkLib.Evade) >= 0 && rand(100) < 10) {
				outputText("Using your skills at evading attacks, you anticipate and sidestep " + monster.a + monster.short + "' attacks.");
			}
			//("Misdirection"
			else if (player.findPerk(PerkLib.Misdirection) >= 0 && rand(100) < 15 && player.armorName == "red, high-society bodysuit") {
				outputText("Using Raphael's teachings, you anticipate and sidestep " + monster.a + monster.short + "' attacks.");
			}
			//Determine if cat'ed
			else if (player.findPerk(PerkLib.Flexibility) >= 0 && rand(100) < 6) {
				outputText("With your incredible flexibility, you squeeze out of the way of " + monster.a + monster.short + "' attacks.");
			}
			else {
				temp = int((monster.str + monster.weaponAttack) * (player.damagePercent() / 100)); //Determine damage - str modified by enemy toughness!
				if (temp <= 0) {
					temp = 0;
					if (!monster.plural)
						outputText("You deflect and block every " + monster.weaponVerb + " " + monster.a + monster.short + " throw at you.");
					else outputText("You deflect " + monster.a + monster.short + " " + monster.weaponVerb + ".");
				}
				else {
					if (temp <= 5)
						outputText("You are struck a glancing blow by " + monster.a + monster.short + "! ");
					else if (temp <= 10)
						outputText(monster.capitalA + monster.short + " wound you! ");
					else if (temp <= 20)
						outputText(monster.capitalA + monster.short + " stagger you with the force of " + monster.pronoun3 + " " + monster.weaponVerb + "s! ");
					else outputText(monster.capitalA + monster.short + " <b>mutilates</b> you with powerful fists and " + monster.weaponVerb + "s! ");
					takeDamage(temp, true);
				}
				outputText("\n");
			}
			combatRoundOver();
		}

		public  lustAttack(): void {
			if (player.lust < 35) {
				outputText("The " + monster.short + " press in close against you and although they fail to hit you with an attack, the sensation of their skin rubbing against yours feels highly erotic.");
			}
			else if (player.lust < 65) {
				outputText("The push of the " + monster.short + "' sweaty, seductive bodies sliding over yours is deliciously arousing and you feel your ");
				if (player.cocks.length > 0)
					outputText(player.multiCockDescriptLight() + " hardening ");
				else if (player.vaginas.length > 0) outputText(player.vaginaDescript(0) + " get wetter ");
				outputText("in response to all the friction.");
			}
			else {
				outputText("As the " + monster.short + " mill around you, their bodies rub constantly over yours, and it becomes harder and harder to keep your thoughts on the fight or resist reaching out to touch a well lubricated cock or pussy as it slips past.  You keep subconsciously moving your ");
				if (player.gender == 1) outputText(player.multiCockDescriptLight() + " towards the nearest inviting hole.");
				if (player.gender == 2) outputText(player.vaginaDescript(0) + " towards the nearest swinging cock.");
				if (player.gender == 3) outputText("aching cock and thirsty pussy towards the nearest thing willing to fuck it.");
				if (player.gender == 0) outputText("groin, before remember there is nothing there to caress.");
			}
		var  lustDmg: number = 10 + player.sens / 10;
			player.takeLustDamage(lustDmg, true);
			combatRoundOver();
		}

		private  wait(): void {
			//Gain fatigue if not fighting sand tarps
			if (!monster.hasStatusEffect(StatusEffects.Level)) player.changeFatigue( -5);
			flags[kFLAGS.IN_COMBAT_USE_PLAYER_WAITED_FLAG] = 1;
			if (monster.hasStatusEffect(StatusEffects.PCTailTangle)) {
				(monster as Kitsune).kitsuneWait();
			}
			else if (monster.hasStatusEffect(StatusEffects.Level)) {
				(monster as SandTrap).sandTrapWait();
			}
			else if (monster.hasStatusEffect(StatusEffects.MinotaurEntangled)) {
				clearOutput();
				outputText("You sigh and relax in the chains, eying the well-endowed minotaur as you await whatever rough treatment he desires to give.  His musky, utterly male scent wafts your way on the wind, and you feel droplets of your lust dripping down your thighs.  You lick your lips as you watch the pre-cum drip from his balls, eager to get down there and worship them.  Why did you ever try to struggle against this fate?\n\n");
			var  lustDmg: number = 30 + rand(5);
				player.takeLustDamage(lustDmg, true, false);
				enemyTurn();
			}
			else if (player.hasStatusEffect(StatusEffects.Whispered)) {
				clearOutput();
				outputText("You shake off the mental compulsions and ready yourself to fight!\n\n");
				player.removeStatusEffect(StatusEffects.Whispered);
				enemyTurn();
			}
			else if (player.hasStatusEffect(StatusEffects.HarpyBind)) {
				clearOutput();
				outputText("The brood continues to hammer away at your defenseless self. ");
				temp = 80 + rand(40);
				temp = takeDamage(temp, true);
				combatRoundOver();
			}
			else if (monster.hasStatusEffect(StatusEffects.QueenBind)) {
				(monster as HarpyQueen).ropeStruggles(true);
			}
			else if (player.hasStatusEffect(StatusEffects.GooBind)) {
				clearOutput();
				outputText("You writhe uselessly, trapped inside the goo girl's warm, seething body. Darkness creeps at the edge of your vision as you are lulled into surrendering by the rippling vibrations of the girl's pulsing body around yours.");
				temp = takeDamage(.35 * player.maxHP(), true);
				combatRoundOver();
			}
			else if (player.hasStatusEffect(StatusEffects.GooArmorBind)) {
				clearOutput();
				outputText("Suddenly, the goo-girl leaks half-way out of her heavy armor and lunges at you. You attempt to dodge her attack, but she doesn't try and hit you - instead, she wraps around you, pinning your arms to your chest. More and more goo latches onto you - you'll have to fight to get out of this.");
				player.addStatusValue(StatusEffects.GooArmorBind, 1, 1);
				if (player.statusEffectv1(StatusEffects.GooArmorBind) >= 5) {
					if (monster.hasStatusEffect(StatusEffects.Spar))
						getGame().valeria.pcWinsValeriaSparDefeat();
					else getGame().dungeons.heltower.gooArmorBeatsUpPC();
					return;
				}
				combatRoundOver();
			}
			else if (player.hasStatusEffect(StatusEffects.NagaBind)) {
				clearOutput();
				outputText("The naga's grip on you tightens as you relax into the stimulating pressure.");
				player.takeLustDamage(player.sens / 5 + 5, true);
				takeDamage(5 + rand(5));
				combatRoundOver();
			}
			else if (player.hasStatusEffect(StatusEffects.HolliConstrict)) {
				(monster as Holli).waitForHolliConstrict(true);
			}
			else if (player.hasStatusEffect(StatusEffects.TentacleBind)) {
				clearOutput();
				if (player.cocks.length > 0)
					outputText("The creature continues spiraling around your cock, sending shivers up and down your body. You must escape or this creature will overwhelm you!");
				else if (player.hasVagina())
					outputText("The creature continues sucking your clit and now has latched two more suckers on your nipples, amplifying your growing lust. You must escape or you will become a mere toy to this thing!");
				else outputText("The creature continues probing at your asshole and has now latched " + num2Text(player.totalNipples()) + " more suckers onto your nipples, amplifying your growing lust.  You must escape or you will become a mere toy to this thing!");
				player.takeLustDamage(8 + player.sens / 10, true);
				combatRoundOver();
			}
			else if (player.hasStatusEffect(StatusEffects.GiantGrabbed)) {
				clearOutput();
				(monster as FrostGiant).giantGrabFail(false);
			}
			else if (player.hasStatusEffect(StatusEffects.GiantBoulder)) {
				clearOutput();
				(monster as FrostGiant).giantBoulderMiss();
			}
			else if (player.hasStatusEffect(StatusEffects.IsabellaStunned)) {
				clearOutput();
				outputText("You wobble about for some time but manage to recover. Isabella capitalizes on your wasted time to act again.\n\n");
				player.removeStatusEffect(StatusEffects.IsabellaStunned);
				enemyTurn();
			}
			else if (player.hasStatusEffect(StatusEffects.Stunned)) {
				clearOutput();
				outputText("You wobble about, stunned for a moment.  After shaking your head, you clear the stars from your vision, but by then you've squandered your chance to act.\n\n");
				player.removeStatusEffect(StatusEffects.Stunned);
				enemyTurn();
			}
			else if (player.hasStatusEffect(StatusEffects.Confusion)) {
				clearOutput();
				outputText("You shake your head and file your memories in the past, where they belong.  It's time to fight!\n\n");
				player.removeStatusEffect(StatusEffects.Confusion);
				enemyTurn();
			}
			else if (monster is Doppelganger) {
				clearOutput();
				outputText("You decide not to take any action this round.\n\n");
				(monster as Doppelganger).handlePlayerWait();
				enemyTurn();
			}
			else {
				clearOutput();
				outputText("You decide not to take any action this round.\n\n");
				enemyTurn();
			}
		}

		private  struggle(): void {
			if (monster.hasStatusEffect(StatusEffects.MinotaurEntangled)) {
				clearOutput();
				if (player.str / 9 + rand(20) + 1 >= 15) {
					outputText("Utilizing every ounce of your strength and cunning, you squirm wildly, shrugging through weak spots in the chain's grip to free yourself!  Success!\n\n");
					monster.removeStatusEffect(StatusEffects.MinotaurEntangled);
					if (flags[kFLAGS.URTA_QUEST_STATUS] == 0.75) outputText("\"<i>No!  You fool!  You let her get away!  Hurry up and finish her up!  I need my serving!</i>\"  The succubus spits out angrily.\n\n");
					combatRoundOver();
				}
				//Struggle Free Fail*
				else {
					outputText("You wiggle and struggle with all your might, but the chains remain stubbornly tight, binding you in place.  Damnit!  You can't lose like this!\n\n");
					enemyTurn();
				}
			}
			else if (monster.hasStatusEffect(StatusEffects.PCTailTangle)) {
				(monster as Kitsune).kitsuneStruggle();
			}
			else if (player.hasStatusEffect(StatusEffects.HolliConstrict)) {
				(monster as Holli).struggleOutOfHolli();
			}
			else if (monster.hasStatusEffect(StatusEffects.QueenBind)) {
				(monster as HarpyQueen).ropeStruggles();
			}
			else if (player.hasStatusEffect(StatusEffects.GooBind)) {
				clearOutput();
				//[Struggle](successful) :
				if (rand(3) == 0 || rand(80) < player.str) {
					outputText("You claw your fingers wildly within the slime and manage to brush against her heart-shaped nucleus. The girl silently gasps and loses cohesion, allowing you to pull yourself free while she attempts to solidify.");
					player.removeStatusEffect(StatusEffects.GooBind);
				}
				//Failed struggle
				else {
					outputText("You writhe uselessly, trapped inside the goo girl's warm, seething body. Darkness creeps at the edge of your vision as you are lulled into surrendering by the rippling vibrations of the girl's pulsing body around yours. ");
					temp = takeDamage(Math.min(.15 * player.maxHP(), 100 * (1 + (player.newGamePlusMod() * 0.2))), true);
				}
				combatRoundOver();
			}
			else if (player.hasStatusEffect(StatusEffects.HarpyBind)) {
				(monster as HarpyMob).harpyHordeGangBangStruggle();
			}
			else if (player.hasStatusEffect(StatusEffects.GooArmorBind)) {
				(monster as GooArmor).struggleAtGooBind();
			}
			else if (player.hasStatusEffect(StatusEffects.UBERWEB)) {
				clearOutput();
				outputText("You claw your way out of the webbing while Kiha does her best to handle the spiders single-handedly!\n\n");
				player.removeStatusEffect(StatusEffects.UBERWEB);
				enemyTurn();
			}
			else if (player.hasStatusEffect(StatusEffects.NagaBind)) {
				clearOutput();
				if (rand(3) == 0 || rand(80) < player.str / 1.5) {
					outputText("You wriggle and squirm violently, tearing yourself out from within the naga's coils.");
					player.removeStatusEffect(StatusEffects.NagaBind);
				}
				else {
					outputText("The naga's grip on you tightens as you struggle to break free from the stimulating pressure.");
				var  lustDmg: number = player.sens / 10 + 2;
					player.takeLustDamage(lustDmg, true);
					takeDamage(7 + rand(5));
				}
				combatRoundOver();
			}
			else if (player.hasStatusEffect(StatusEffects.GiantGrabbed)) {
				(monster as FrostGiant).giantGrabStruggle();
			}
			else {
				clearOutput();
				outputText("You struggle with all of your might to free yourself from the tentacles before the creature can fulfill whatever unholy desire it has for you.\n");
				//33% chance to break free + up to 50% chance for strength
				if (rand(3) == 0 || rand(80) < player.str / 2) {
					outputText("As the creature attempts to adjust your position in its grip, you free one of your " + player.legs() + " and hit the beast in its beak, causing it to let out an inhuman cry and drop you to the ground smartly.\n\n");
					player.removeStatusEffect(StatusEffects.TentacleBind);
					monster.createStatusEffect(StatusEffects.TentacleCoolDown, 3, 0, 0, 0);
					enemyTurn();
				}
				//Fail to break free
				else {
					outputText("Despite trying to escape, the creature only tightens its grip, making it difficult to breathe.\n\n");
					takeDamage(5);
					if (player.cocks.length > 0)
						outputText("The creature continues spiraling around your cock, sending shivers up and down your body. You must escape or this creature will overwhelm you!");
					else if (player.hasVagina())
						outputText("The creature continues sucking your clit and now has latched two more suckers on your nipples, amplifying your growing lust. You must escape or you will become a mere toy to this thing!");
					else outputText("The creature continues probing at your asshole and has now latched " + num2Text(player.totalNipples()) + " more suckers onto your nipples, amplifying your growing lust.  You must escape or you will become a mere toy to this thing!");
					player.takeLustDamage(3 + player.sens / 10 + player.lib / 20, true);
					combatRoundOver();
				}
			}
		}

		private  debugInspect(): void {
			outputText(monster.generateDebugDescription());
			doNext(playerMenu);
		}

		//Fantasize
		public  fantasize(): void {
		var  lustDmg: number =  0;
			doNext(combatMenu);
			clearOutput();
			if (monster.short == "frost giant" && (player.hasStatusEffect(StatusEffects.GiantBoulder))) {
				lustDmg = 10 + rand(player.lib / 5 + player.cor / 8);
				player.takeLustDamage(lustDmg, true, false);
				(monster as FrostGiant).giantBoulderFantasize();
				enemyTurn();
				return;
			}
			if (player.armorName == "goo armor") {
				outputText("As you fantasize, you feel Valeria rubbing her gooey body all across your sensitive skin");
				if (player.gender > 0) outputText(" and genitals");
				outputText(", arousing you even further.\n");
				lustDmg = 25 + rand(player.lib/8+player.cor/8)
			}	
			else if (player.balls > 0 && player.ballSize >= 10 && rand(2) == 0) {
				outputText("You daydream about fucking " + monster.a + monster.short + ", feeling your balls swell with seed as you prepare to fuck " + monster.pronoun2 + " full of cum.\n");
				lustDmg = 5 + rand(player.lib/8+player.cor/8);
				outputText("You aren't sure if it's just the fantasy, but your " + player.ballsDescriptLight() + " do feel fuller than before...\n");
				player.hoursSinceCum += 50;
			}
			else if (player.biggestTitSize() >= 6 && rand(2) == 0) {
				outputText("You fantasize about grabbing " + monster.a + monster.short + " and shoving " + monster.pronoun2 + " in between your jiggling mammaries, nearly suffocating " + monster.pronoun2 + " as you have your way.\n");
				lustDmg = 5 + rand(player.lib/8+player.cor/8)
			}
			else if (player.biggestLactation() >= 6 && rand(2) == 0) {
				outputText("You fantasize about grabbing " + monster.a + monster.short + " and forcing " + monster.pronoun2 + " against a " + player.nippleDescript(0) + ", and feeling your milk let down.  The desire to forcefeed SOMETHING makes your nipples hard and moist with milk.\n");
				lustDmg = 5 + rand(player.lib/8+player.cor/8)
			}
			else {
				outputText("You fill your mind with perverted thoughts about " + monster.a + monster.short + ", picturing " + monster.pronoun2 + " in all kinds of perverse situations with you.\n");	
				lustDmg = 10+rand(player.lib/5+player.cor/8);		
			}
			if (lustDmg >= 20) outputText("The fantasy is so vivid and pleasurable you wish it was happening now.  You wonder if " + monster.a + monster.short + " can tell what you were thinking.\n\n");
			else outputText("\n");
			player.takeLustDamage(lustDmg, true, false);
			if (player.lust >= player.maxLust()) { //Bypasses Indefatigable perk.
				if (monster.short == "pod") {
					outputText("<b>You nearly orgasm, but the terror of the situation reasserts itself, muting your body's need for release.  If you don't escape soon, you have no doubt you'll be too fucked up to ever try again!</b>");
					player.lust = 99;
					player.takeLustDamage(-25, true);
					outputText("\n\n");
				}
				else {
					doNext(endLustLoss);
					return;
				}
			}
			enemyTurn();	
		}


		public  fatigueRecovery(): void {
			player.changeFatigue(-1);
			if (player.findPerk(PerkLib.EnlightenedNinetails) >= 0 || player.findPerk(PerkLib.CorruptedNinetails) >= 0) player.changeFatigue(-(1+rand(3)));
		}
		
		//ATTACK
		public  attack(targetSelected: boolean = false, monsterTarget:Monster = undefined): void {
			if (targetSelectionNeeded(targetSelected, monsterTarget, attack)) return;
			if (!player.hasStatusEffect(StatusEffects.FirstAttack)) {
				clearOutput();
				fatigueRecovery();
			}
			if (player.hasStatusEffect(StatusEffects.Sealed) && player.statusEffectv2(StatusEffects.Sealed) == 0 && !isWieldingRangedWeapon()) {
				outputText("You attempt to attack, but at the last moment your body wrenches away, preventing you from even coming close to landing a blow!  The kitsune's seals have made normal attack impossible!  Maybe you could try something else?\n\n");
				enemyTurn();
				return;
			}
			if ((flags[kFLAGS.PC_FETISH] >= 3 && (rand(3) > 0 || monster is Ceraph)) && !getGame().urtaQuest.isUrta() && !isWieldingRangedWeapon()) {
				outputText("You attempt to attack, but at the last moment your body wrenches away, preventing you from even coming close to landing a blow!  Ceraph's piercings have made normal attack impossible!  Maybe you could try something else?\n\n");
				enemyTurn();
				return;
			}
			if (player.hasStatusEffect(StatusEffects.TaintedMind) && !isWieldingRangedWeapon()) {
				(monsterTarget as DriderIncubus).taintedMindAttackAttempt();
				enemyTurn();
				return;
			}
			flags[kFLAGS.LAST_ATTACK_TYPE] = 0;
			//Reload
			if (player.weapon is FlintlockPistol) {
				if (flags[kFLAGS.FLINTLOCK_PISTOL_AMMO] <= 0) {
					flags[kFLAGS.FLINTLOCK_PISTOL_AMMO] = 4;
					outputText("You open the chamber of your pistol to reload the ammunition. This takes up a turn.\n\n");
					enemyTurn();
					return;
				}
				else flags[kFLAGS.FLINTLOCK_PISTOL_AMMO]--;
			}
			//Amily!
			if (monsterTarget.hasStatusEffect(StatusEffects.Concentration) && !isWieldingRangedWeapon()) {
				outputText("Amily easily glides around your attack thanks to her complete concentration on your movements.\n\n");
				enemyTurn();
				return;
			}
			if (monsterTarget.hasStatusEffect(StatusEffects.Level) && !player.hasStatusEffect(StatusEffects.FirstAttack) && !isWieldingRangedWeapon()) {
				outputText("It's all or nothing!  With a bellowing cry you charge down the treacherous slope and smite the sandtrap as hard as you can!  ");
				(monster as SandTrap).trapLevel(-4);
			}
			if (player.findPerk(PerkLib.DoubleAttack) >= 0 && player.spe >= 50 && flags[kFLAGS.DOUBLE_ATTACK_STYLE] < 2) {
				if (player.hasStatusEffect(StatusEffects.FirstAttack)) player.removeStatusEffect(StatusEffects.FirstAttack);
				else {
					//Always!
					if (flags[kFLAGS.DOUBLE_ATTACK_STYLE] == 0) player.createStatusEffect(StatusEffects.FirstAttack,0,0,0,0);
					//Alternate!
					else if (player.str < 61 && flags[kFLAGS.DOUBLE_ATTACK_STYLE] == 1) player.createStatusEffect(StatusEffects.FirstAttack,0,0,0,0);
				}
			}
			//"Brawler perk". Urta only. Thanks to Fenoxo for pointing this out... Even though that should have been obvious :<
			//Urta has fists and the Brawler perk. Don't check for that because Urta can't drop her fists or lose the perk!
			else if (getGame().urtaQuest.isUrta()) {
				if (player.hasStatusEffect(StatusEffects.FirstAttack)) {
					player.removeStatusEffect(StatusEffects.FirstAttack);
				}
				else {
					player.createStatusEffect(StatusEffects.FirstAttack,0,0,0,0);
					outputText("Utilizing your skills as a bareknuckle brawler, you make two attacks!\n");
				}
			}
			//Blind
			if (player.hasStatusEffect(StatusEffects.Blind)) {
				outputText("You attempt to attack, but as blinded as you are right now, you doubt you'll have much luck!  ");
			}
			if (monsterTarget is Basilisk && !(player.hasPerk(PerkLib.BasiliskResistance) || player.canUseStare() || player.hasKeyItem("Laybans") >= 0 || isWieldingRangedWeapon())) {
				if (monsterTarget.hasStatusEffect(StatusEffects.Blind))
					outputText("Blind basilisk can't use his eyes, so you can actually aim your strikes!  ");
				//basilisk counter attack (block attack, significant speed loss): 
				else if (player.inte / 5 + rand(20) < 25) {
					outputText("Holding the basilisk in your peripheral vision, you charge forward to strike it.  Before the moment of impact, the reptile shifts its posture, dodging and flowing backward skillfully with your movements, trying to make eye contact with you. You find yourself staring directly into the basilisk's face!  Quickly you snap your eyes shut and recoil backwards, swinging madly at the lizard to force it back, but the damage has been done; you can see the terrible grey eyes behind your closed lids, and you feel a great weight settle on your bones as it becomes harder to move.");
					StareMonster.speedReduce(player,20);
					player.removeStatusEffect(StatusEffects.FirstAttack);
					combatRoundOver();
					flags[kFLAGS.BASILISK_RESISTANCE_TRACKER] += 2;
					return;
				}
				//Counter attack fails: (random chance if PC int > 50 spd > 60; PC takes small physical damage but no block or spd penalty)
				else {
					outputText("Holding the basilisk in your peripheral vision, you charge forward to strike it.  Before the moment of impact, the reptile shifts its posture, dodging and flowing backward skillfully with your movements, trying to make eye contact with you. You twist unexpectedly, bringing your " + player.weaponName + " up at an oblique angle; the basilisk doesn't anticipate this attack!  ");
				}
			}
			if (monsterTarget is FrostGiant && player.hasStatusEffect(StatusEffects.GiantBoulder)) {
				(monsterTarget as FrostGiant).giantBoulderHit(0);
				enemyTurn();
				return;
			}
			//Worms are special
			if (monsterTarget.short == "worms") {
				//50% chance of hit (int boost)
				if (rand(100) + player.inte/3 >= 50) {
					temp = int(player.str/5 - rand(5));
					if (temp == 0) temp = 1;
					outputText("You strike at the amalgamation, crushing countless worms into goo, dealing <b><font color=\"" + mainViewManager.colorHpMinus() + "\">" + temp + "</font></b> damage.\n\n");
					doDamage(temp, true, false, monsterTarget);
					if (monster.HP <= 0) {
						doNext(endHpVictory);
						return;
					}
				}
				//Fail
				else {
					outputText("You attempt to crush the worms with your reprisal, only to have the collective move its individual members, creating a void at the point of impact, leaving you to attack only empty air.\n\n");
				}
				if (player.hasStatusEffect(StatusEffects.FirstAttack)) {
					attack(true, monsterTarget);
					return;
				}
				enemyTurn();
				return;
			}
			
		var  damage: number = 0;
			//Determine if dodged!
		var  dodgeChanceFactor: number = 80;
			//Handle War Dance dodge chance loss for enemys
			if (player.weapon === WeaponLib.FISTS && player.hasPerk(PerkLib.WarDance))
				dodgeChanceFactor /= 0.8; // -20% less chance for monsters to dodge you
			if ((player.hasStatusEffect(StatusEffects.Blind) && rand(2) == 0) || (monster.spe - player.spe > 0 && int(Math.random() * (((monsterTarget.spe-player.spe) / 4) + 80)) > dodgeChanceFactor)) {
				//Akbal dodges special education
				if (monsterTarget.short == "Akbal") outputText("Akbal moves like lightning, weaving in and out of your furious strikes with the speed and grace befitting his jaguar body.\n");
				else if (monsterTarget.short == "plain girl") outputText("You wait patiently for your opponent to drop her guard. She ducks in and throws a right cross, which you roll away from before smacking your " + player.weaponName + " against her side. Astonishingly, the attack appears to phase right through her, not affecting her in the slightest. You glance down to your " + player.weaponName + " as if betrayed.\n");
				else if (monsterTarget.short == "kitsune") {
					//Player Miss:
					outputText("You swing your [weapon] ferociously, confident that you can strike a crushing blow.  To your surprise, you stumble awkwardly as the attack passes straight through her - a mirage!  You curse as you hear a giggle behind you, turning to face her once again.\n\n");
				}
				else {
					if (player.weapon == weapons.HNTCANE && rand(2) == 0) {
						if (rand(2) == 0) outputText("You slice through the air with your cane, completely missing your enemy.");
						else outputText("You lunge at your enemy with the cane.  It glows with a golden light but fails to actually hit anything.");
					}
					if (monsterTarget.spe - player.spe < 8) outputText(monsterTarget.capitalA + monsterTarget.short + " narrowly avoids your attack!");
					if (monsterTarget.spe - player.spe >= 8 && monster.spe-player.spe < 20) outputText(monsterTarget.capitalA + monsterTarget.short + " dodges your attack with superior quickness!");
					if (monsterTarget.spe - player.spe >= 20) outputText(monsterTarget.capitalA + monsterTarget.short + " deftly avoids your slow attack.");
					outputText("\n");
					if (player.hasStatusEffect(StatusEffects.FirstAttack)) {
						attack(true, monsterTarget);
						return;
					}
					else outputText("\n");
				}
				enemyTurn();
				return;
			}
			//BLOCKED ATTACK:
			if (monsterTarget.hasStatusEffect(StatusEffects.Earthshield) && rand(4) == 0) {
				outputText("Your strike is deflected by the wall of sand, dirt, and rock!  Damn!\n");
				if (player.hasStatusEffect(StatusEffects.FirstAttack)) {
					attack(true, monsterTarget);
					return;
				}
				else outputText("\n");
				enemyTurn();
				return;
			}
			//------------
			// DAMAGE
			//------------
			//Determine damage
			//BASIC DAMAGE STUFF
			
			//Double Attack Hybrid Reductions
		var  getBase = function(init: number): number {
				if (player.findPerk(PerkLib.DoubleAttack) >= 0 && player.spe >= 50 && init > 61 + (player.newGamePlusMod() * 15) && flags[kFLAGS.DOUBLE_ATTACK_STYLE] == 0) {
					return 60.5 + (player.newGamePlusMod() * 15);
				} else return init;
			};
			
			// init value depending on weapon type
			if (isWieldingRangedWeapon()) {
				if (player.weaponName.indexOf("staff") != -1) damage = getBase.call(undefined, player.inte) + player.spe * 0.1;
				else damage = getBase.call(undefined, player.str) + player.spe * 0.2; // woudn't be better to use speed as base and int as extra?
			}
			else
				damage = getBase.call(undefined, player.str);
				
			if (player.findPerk(PerkLib.HoldWithBothHands) >= 0 && player.weapon != WeaponLib.FISTS && player.shield == ShieldLib.NOTHING && !isWieldingRangedWeapon()) damage += (player.str * 0.2);
			//Weapon addition!
			damage += player.weaponAttack;
			if (damage < 10) damage = 10;
			//Bonus sand trap damage!
			if (monsterTarget.hasStatusEffect(StatusEffects.Level)) damage = Math.round(damage * 1.75);
			// Handle War Dance extra damage
			if (player.weapon === WeaponLib.FISTS && player.hasPerk(PerkLib.WarDance))
				damage *= 1.15;
			//Determine if critical hit!
		var  crit: boolean = combatCritical();
			if (crit)
				damage *= 1.75;
			//Apply AND DONE!
			damage *= (monster.damagePercent(false, true) / 100);
			//Damage post processing!
			//Thunderous Strikes
			if (player.findPerk(PerkLib.ThunderousStrikes) >= 0 && player.str >= 80)
				damage *= 1.2;
				
			if (player.findPerk(PerkLib.ChiReflowMagic) >= 0) damage *= UmasShop.NEEDLEWORK_MAGIC_REGULAR_MULTI;
			if (player.findPerk(PerkLib.ChiReflowAttack) >= 0) damage *= UmasShop.NEEDLEWORK_ATTACK_REGULAR_MULTI;
			if (player.jewelryEffectId == JewelryLib.MODIFIER_ATTACK_POWER) damage *= 1 + (player.jewelryEffectMagnitude / 100);
			if (player.countCockSocks("red") > 0) damage *= (1 + player.countCockSocks("red") * 0.02);
			//One final round
			damage = Math.round(damage);
			
			//GHOUL REVEAL, HOPEFULLY
			if (!ghoulReveal && monsterTarget is Ghoul) {
				spriteSelect(SpriteDb.s_ghoul);
				outputText("Your " + kGAMECLASS.player.weaponName + " strikes the hyena, causing it to recoil and vanish in a cloud of sandy dust. You stumble back in surprise and look up to see a snarling, ghostly creature in the air. Your enemy wasn't a hyena. <b>It was a ghoul!</b>\n\n");
				if (silly()) outputText("<b>The wild Ghoul's illusion wore off!</b>\n\n");
				this.ghoulReveal = true;
			}
			
			//ANEMONE SHIT
			if (monsterTarget.short == "anemone" && !isWieldingRangedWeapon()) {
				//hit successful:
				//special event, block (no more than 10-20% of turns, also fails if PC has >75 corruption):
				if (rand(10) <= 1) {
					outputText("Seeing your " + player.weaponName + " raised, the anemone looks down at the water, angles her eyes up at you, and puts out a trembling lip.  ");
					if (player.cor < 75) {
						outputText("You stare into her hangdog expression and lose most of the killing intensity you had summoned up for your attack, stopping a few feet short of hitting her.\n");
						damage = 0;
						//Kick back to main if no damage occured!
						if (countMonstersLeft() > 0) {
							if (player.hasStatusEffect(StatusEffects.FirstAttack)) {
								attack(true, monsterTarget);
								return;
							}
							enemyTurn();
						}
						else {
							if (monster.HP <= 0) doNext(endHpVictory);
							else doNext(endLustVictory);
						}
						return;
					}
					else outputText("Though you lose a bit of steam to the display, the drive for dominance still motivates you to follow through on your swing.");
				}
			}

			// Have to put it before doDamage, because doDamage applies the change, as well as status effects and shit.
			if (monsterTarget is Doppelganger)
			{
				if (!monsterTarget.hasStatusEffect(StatusEffects.Stunned))
				{
					if (damage > 0 && player.findPerk(PerkLib.HistoryFighter) >= 0) damage *= 1.1;
					if (player.countCockSocks("red") > 0) damage *= (1 + player.countCockSocks("red") * 0.02);
					if (damage > 0) damage = doDamage(damage, false);
				
					(monsterTarget as Doppelganger).mirrorAttack(damage);
					return;
				}
				
				// Stunning the doppelganger should now "buy" you another round.
			}
			if (player.weapon == weapons.HNTCANE) {
				switch(rand(2)) {
					case 0:
						outputText("You swing your cane through the air. The light wood lands with a loud CRACK that is probably more noisy than painful. ");
						damage *= 0.5;
						break;
					case 1:
						outputText("You brandish your cane like a sword, slicing it through the air. It thumps against your adversary, but doesn’t really seem to harm them much. ");
						damage *= 0.5;
						break;
					default:
				}
			}
			if (damage > 0) {
				if (player.findPerk(PerkLib.HistoryFighter) >= 0) damage *= 1.1;
			}
			if (damage <= 0) {
				damage = 0;
				outputText("Your attacks are deflected or blocked by " + monsterTarget.a + monsterTarget.short + ".");
			}
			else {
				if (damage <= Math.min(monsterTarget.maxHP() * 0.1, 50))
					outputText("You struck a glancing blow on " + monsterTarget.a + monsterTarget.short + "! ");
				else if (damage <= Math.min(monsterTarget.maxHP() * 0.2, 100))
					outputText("You hit and wound " + monsterTarget.a + monsterTarget.short + "! ");
				else if (damage <= Math.min(monsterTarget.maxHP() * 0.3, 150))
					outputText("You stagger " + monsterTarget.a + monsterTarget.short + " with the force of your " + player.weaponVerb + "s! ");
				else 
					outputText("You <b>mutilate</b> " + monster.a + monsterTarget.short + " with your powerful " + player.weaponVerb + "! ");
				if (crit) outputText("<b>Critical hit! </b>");
				doDamage(damage, true, true, monsterTarget);
			}
			if (player.findPerk(PerkLib.BrutalBlows) >= 0 && player.str > 75) {
				if (monsterTarget.armorDef > 0) outputText("\nYour hits are so brutal that you damage " + monsterTarget.a + monsterTarget.short + "'s defenses!");
				if (monsterTarget.armorDef - 10 > 0) monsterTarget.armorDef -= 10;
				else monsterTarget.armorDef = 0;
			}
			//Damage weapon.
			if (player.weapon.isDegradable()) {
				flags[kFLAGS.WEAPON_DURABILITY_DAMAGE]++;
				if (flags[kFLAGS.WEAPON_DURABILITY_DAMAGE] >= player.weapon.durability) {
					//Text for weapon breaking
					if (player.weapon.isObsidian()) 
						outputText("\n<b>After sustained use, the obsidian that used to enhance your weapon has finally crumbled, leaving you with the masterwork weapon.</b>");
					else if (player.weapon == weapons.HNTCANE) 
						outputText("\n<b>The cane you're wielding finally snaps! It looks like you won't be able to use it anymore.</b>");
					//Set weapon accordingly	
					if (player.weapon.degradesInto != undefined)	player.setWeapon(player.weapon.degradesInto as Weapon);
					else player.setWeapon(WeaponLib.FISTS);
				}
			}
			if (damage > 0) {
				//Lust raised by anemone contact!
				if (monsterTarget.short == "anemone" && !isWieldingRangedWeapon()) {
					outputText("\nThough you managed to hit the anemone, several of the tentacles surrounding her body sent home jolts of venom when your swing brushed past them.");
					//(gain lust, temp lose str/spd)
					(monster as Anemone).applyVenom((1+rand(2)));
				}
				
				//Lust raising weapon bonuses
				if (monsterTarget.lustVuln > 0) {
					if (player.weaponPerk == "Aphrodisiac Weapon") {
						outputText("\n" + monster.capitalA + monsterTarget.short + " shivers as your weapon's 'poison' goes to work.");
						monsterTarget.teased(monster.lustVuln * (5 + player.cor / 10));
					}
					if (player.weapon is Whip && rand(2) == 0) {		
						if (!monsterTarget.plural) outputText("\n" + monsterTarget.capitalA + monsterTarget.short + " shivers and gets turned on from the whipping.");
						else outputText("\n" + monsterTarget.capitalA + monsterTarget.short + " shiver and get turned on from the whipping.");
						monsterTarget.teased(monster.lustVuln * (5 + player.cor / 12));
					}
					if (player.weapon == weapons.SUCWHIP) {
						if (player.cor < 60) dynStats("cor", .1);
						if (player.cor < 90) dynStats("cor", .05);
						if (!monsterTarget.plural) outputText("\n" + monsterTarget.capitalA + monsterTarget.short + " shivers and moans involuntarily from the whip's touches.");
						else outputText("\n" + monsterTarget.capitalA + monsterTarget.short + " shiver and moan involuntarily from the whip's touches.");
						monsterTarget.teased(monster.lustVuln * (20 + player.cor / 15));
						if (rand(2) == 0) {
							outputText(" You get a sexual thrill from it. ");
							player.takeLustDamage(1, true);
						}
					}
					if (player.weapon is LethicesWhip) {
						if (player.cor < 60) dynStats("cor", .1);
						if (player.cor < 90) dynStats("cor", .05);
						if (!monster.plural) outputText("\n" + monsterTarget.capitalA + monsterTarget.short + " shivers and moans involuntarily from the flaming whip's touches.");
						else outputText("\n" + monsterTarget.capitalA + monsterTarget.short + " shiver and moan involuntarily from the flaming whip's touches.");
						monsterTarget.teased(monster.lustVuln * (25 + player.cor / 10));
						if (rand(2) == 0) {
							outputText(" You get a sexual thrill from it. ");
							player.takeLustDamage(1, true);
						}
					}
				}
				//Weapon Procs!
				if (player.weapon is HugeWarhammer || player.weapon is SpikedGauntlet || player.weapon is HookedGauntlet) {
					//10% chance
					if (rand(10) == 0 && monsterTarget.findPerk(PerkLib.Resolute) < 0) {
						outputText("\n" + monsterTarget.capitalA + monsterTarget.short + " reels from the brutal blow, stunned.");
						if (!monster.hasStatusEffect(StatusEffects.Stunned)) monsterTarget.createStatusEffect(StatusEffects.Stunned,rand(2),0,0,0);
					}
					//50% Bleed chance
					if (player.weapon is HookedGauntlet && rand(2) == 0 && monsterTarget.armorDef < 10 && !monsterTarget.hasStatusEffect(StatusEffects.IzmaBleed))
					{
						if (monsterTarget is LivingStatue)
						{
							outputText("Despite the rents you've torn in its stony exterior, the statue does not bleed.");
						}
						else
						{
							monsterTarget.createStatusEffect(StatusEffects.IzmaBleed,3,0,0,0);
							if (monster.plural) outputText("\n" + monsterTarget.capitalA + monsterTarget.short + " bleed profusely from the many bloody gashes your hooked gauntlets leave behind.");
							else outputText("\n" + monsterTarget.capitalA + monsterTarget.short + " bleeds profusely from the many bloody gashes your hooked gauntlets leave behind.");
						}
					}
				}
				
			}
			
			if (monsterTarget is JeanClaude && !player.hasStatusEffect(StatusEffects.FirstAttack))
			{
				if (countMonstersLeft() <= 0) {
					// noop
				}
				if (player.lust100 <= 30)
				{
					outputText("\n\nJean-Claude doesn’t even budge when you wade into him with your [weapon].");
					outputText("\n\n“<i>Why are you attacking me, slave?</i>” he says. The basilisk rex sounds genuinely confused. His eyes pulse with hot, yellow light, reaching into you as he opens his arms, staring around as if begging the crowd for an explanation. “<i>You seem lost, unable to understand, lashing out at those who take care of you. Don’t you know who you are? Where you are?</i>” That compulsion in his eyes, that never-ending heat, it’s... it’s changing things. You need to finish this as fast as you can.");
				}
				else if (player.lust100 <= 50)
				{
					outputText("\n\nAgain your [weapon] thumps into Jean-Claude. Again it feels wrong. Again it sends an aching chime through you, that you are doing something that revolts your nature.");
					outputText("\n\n“<i>Why are you fighting your master, slave?</i>” he says. He is bigger than he was before. Or maybe you are smaller. “<i>You are confused. Put your weapon down- you are no warrior, you only hurt yourself when you flail around with it. You have forgotten what you were trained to be. Put it down, and let me help you.</i>” He’s right. It does hurt. Your body murmurs that it would feel so much better to open up and bask in the golden eyes fully, let it move you and penetrate you as it may. You grit your teeth and grip your [weapon] harder, but you can’t stop the warmth the hypnotic compulsion is building within you.");
				}
				else if (player.lust100 <= 80)
				{
					outputText("\n\n“<i>Do you think I will be angry at you?</i>” growls Jean-Claude lowly. Your senses feel intensified, his wild, musky scent rich in your nose. It’s hard to concentrate... or rather it’s hard not to concentrate on the sweat which runs down his hard, defined frame, the thickness of his bulging cocks, the assured movement of his powerful legs and tail, and the glow, that tantalizing, golden glow, which pulls you in and pushes so much delicious thought and sensation into your head…  “<i>I am not angry. You will have to be punished, yes, but you know that is only right, that in the end you will accept and enjoy being corrected. Come now, slave. You only increase the size of the punishment with this silliness.</i>”");
				}
				else
				{
					outputText("\n\nYou can’t... there is a reason why you keep raising your weapon against your master, but what was it? It can’t be that you think you can defeat such a powerful, godly alpha male as him. And it would feel so much better to supplicate yourself before the glow, lose yourself in it forever, serve it with your horny slut body, the only thing someone as low and helpless as you could possibly offer him. Master’s mouth is moving but you can no longer tell where his voice ends and the one in your head begins... only there is a reason you cling to like you cling onto your [weapon], whatever it is, however stupid and distant it now seems, a reason to keep fighting...");
				}
				
				player.takeLustDamage(25, true);
			}
			
			outputText("\n");
			if (isWieldingRangedWeapon()) flags[kFLAGS.LAST_ATTACK_TYPE] = 4;
			if (player.weaponName.indexOf("staff") != -1 && player.findPerk(PerkLib.StaffChanneling) >= 0) flags[kFLAGS.LAST_ATTACK_TYPE] = 2;
			checkAchievementDamage(damage);
			//Kick back to main if no damage occured!
			if (countMonstersLeft() > 0) {
				if (player.hasStatusEffect(StatusEffects.FirstAttack)) {
					attack(true, monsterTarget);
					return;
				}
				outputText("\n");
				enemyTurn();
			}
			else {
				if (monster.HP <= 0) doNext(endHpVictory);
				else doNext(endLustVictory);
			}
			
		}
		
		public  combatMiss(): boolean {
			return player.spe - monster.spe > 0 && int(Math.random() * (((player.spe - monster.spe) / 4) + 80)) > 80;
		}
		public  combatParry(): boolean {
			return player.findPerk(PerkLib.Parry) >= 0 && player.spe >= 50 && player.str >= 50 && rand(100) < ((player.spe - 50) / 5) && player.weapon != WeaponLib.FISTS;
			//trace("Parried!");
		}
		
		public  combatCritical(): boolean {
			return rand(100) <= getCritChance();
		}
		
		public  getCritChance(): number {
		var  critChance: number = 5;
			// Perception calculations
			if (player.hasPerk(PerkLib.ImprovedVision3)) {
				critChance += 10;
			} else if (player.hasPerk(PerkLib.ImprovedVision2)) {
				critChance += 7;
			} else if (player.hasPerk(PerkLib.ImprovedVision)) {
				critChance += 3;
			}
			// Special eyes calculations
			switch (player.eyes.type) {
				case Eyes.DRAGON: critChance += 8; break;
				case Eyes.CAT:    critChance += 5; break;
				case Eyes.SPIDER: critChance += 2; break;
				default: // The default is a lie!
			}
			if (player.eyes.count >= 4) {
				critChance += 2;
			}
			// Other calculations
			if (player.findPerk(PerkLib.Tactician) >= 0 && player.inte >= 50) critChance += (player.inte - 50) / 5;
			if (player.findPerk(PerkLib.Blademaster) >= 0 && (player.weaponVerb.search("slash") >= 0 || player.weaponVerb.search("cleave") >= 0 || player.weaponVerb == "keen cut") && player.shield == ShieldLib.NOTHING) critChance += 5;
			if (player.jewelry.effectId == JewelryLib.MODIFIER_CRITICAL) critChance += player.jewelry.effectMagnitude;
			return critChance;
		}

		public  combatBlock(doFatigue: boolean = false): boolean {
			//Set chance
		var  blockChance: number = 20 + player.shieldBlock + Math.floor((player.str - monster.str) / 5);
			if (player.findPerk(PerkLib.ShieldMastery) >= 0 && player.tou >= 50) blockChance += (player.tou - 50) / 5;
			if (blockChance < 10) blockChance = 10;
			//Fatigue limit
		var  fatigueLimit: number = player.maxFatigue() - player.physicalCost(10);
			if (blockChance >= (rand(100) + 1) && player.fatigue <= fatigueLimit && player.shieldName != "nothing") {
				if (doFatigue) player.changeFatigue(10, 2);
				return true;
			}
			else return false;
		}
		public  isWieldingRangedWeapon(): boolean {
			if (player.weapon is FlintlockPistol || player.weapon is Blunderbuss || player.weapon is Crossbow || (player.weaponName.indexOf("staff") != -1 && player.findPerk(PerkLib.StaffChanneling) >= 0)) return true;
			else return false;
		}

		/**
		 * Deal damage to opponent.
		 * @param	damage	The amount of damage dealt.
		 * @param	apply	If true, deducts HP from monster.
		 * @param	display	If true, displays the damage done.
		 * @return	damage	The amount of damage.
		 */
		public  doDamage(damage: number, apply: boolean = true, display: boolean = false, target:Monster = undefined): number {
			if (!target) target = monster;
			if (player.findPerk(PerkLib.Sadist) >= 0) {
				damage *= 1.2;
				player.takeLustDamage(3, true);
			}
			if (target.HP - damage <= 0) {
				/* No monsters use this perk, so it's been removed for now
				if (monster.findPerk(PerkLib.LastStrike) >= 0) doNext(monster.perk(monster.findPerk(PerkLib.LastStrike)).value1);
				else doNext(endHpVictory);
				*/
				doNext(endHpVictory);
			}
			
			// Uma's Massage Bonuses
		var  stat:StatusEffect = player.statusEffectByType(StatusEffects.UmasMassage);
			if (stat != undefined) {
				if (stat.value1 == UmasShop.MASSAGE_POWER) {
					damage *= stat.value2;
				}
			}
			
			damage = Math.round(damage);
			
			if (damage < 0) damage = 1;
			if (apply) target.HP -= damage;
			if (display) output.text(getDamageText(damage));
			//Isabella gets mad
			if (target.short == "Isabella") {
				flags[kFLAGS.ISABELLA_AFFECTION]--;
				//Keep in bounds
				if (flags[kFLAGS.ISABELLA_AFFECTION] < 0) flags[kFLAGS.ISABELLA_AFFECTION] = 0;
			}
			//Interrupt gigaflare if necessary.
			if (monster.hasStatusEffect(StatusEffects.Gigafire)) target.addStatusValue(StatusEffects.Gigafire, 1, damage);
			//Keep shit in bounds.
			if (monster.HP < 0) target.HP = 0;
			return damage;
		}

		public  takeDamage(damage: number, display: boolean = false): number {
			return player.takeDamage(damage, display);
		}

		public  getDamageText(damage: number): string
		{
		var  color: string;
			if (damage > 0)  color = mainViewManager.colorHpMinus();
			if (damage == 0) color = "#000080";
			if (damage < 0)  color = mainViewManager.colorHpPlus();
			return "<b>(<font color=\"" + color + "\">" + damage + "</font>)</b>";
		}

		public  finishCombat(): void
		{
		var  hpVictory: boolean = monster.HP < 1;
			if (hpVictory) {
				outputText("You defeat " + monster.a + monster.short + ".\n");
			} else {
				outputText("You smile as " + monster.a + monster.short + " collapses and begins masturbating feverishly.");
			}
			cleanupAfterCombat();
		}
		public  dropItem(monster:Monster, nextFunc = undefined): void {
			if (nextFunc == undefined) nextFunc = camp.returnToCampUseOneHour;
			if (monster.hasStatusEffect(StatusEffects.NoLoot)) {
				return;
			}
		var  itype:ItemType = monster.dropLoot();
			if (monster.short == "tit-fucked Minotaur") {
				itype = consumables.MINOCUM;
			}
			if (monster is Minotaur) {
				if (monster.weaponName == "axe") {
					if (rand(2) == 0) {
						//50% breakage!
						if (rand(2) == 0) {
							itype = weapons.L__AXE0;
							if (player.tallness < 78 && player.str < 90) {
								outputText("\nYou find a large axe on the minotaur, but it is too big for a person of your stature to comfortably carry.  ");
								if (rand(2) == 0) itype = undefined;
								else itype = consumables.SDELITE;
							}
							//Not too tall, dont rob of axe!
							else plotFight = true;
						}
						else outputText("\nThe minotaur's axe appears to have been broken during the fight, rendering it useless.  ");
					}
					else itype = consumables.MINOBLO;
				}
			}
			if (monster is BeeGirl) {
				//force honey drop if milked
				if (flags[kFLAGS.FORCE_BEE_TO_PRODUCE_HONEY] == 1) {
					if (rand(2) == 0) itype = consumables.BEEHONY;
					else itype = consumables.PURHONY;
					flags[kFLAGS.FORCE_BEE_TO_PRODUCE_HONEY] = 0;
				}
			}
			if (monster is Jojo && flags[kFLAGS.JOJO_STATUS] > 4) {
				if (rand(2) == 0) itype = consumables.INCUBID;
				else {
					if (rand(2) == 0) itype = consumables.B__BOOK;
					else itype = consumables.SUCMILK;
				}
			}
			if (monster is Harpy || monster is Sophie) {
				if (rand(10) == 0) itype = armors.W_ROBES;
				else if (rand(3) == 0 && player.findPerk(PerkLib.LuststickAdapted) >= 0) itype = consumables.LUSTSTK;
				else itype = consumables.GLDSEED;
			}
			//Chance of armor if at level 1 pierce fetish
			if (!plotFight && !(monster is Ember) && !(monster is Kiha) && !(monster is Hel) && !(monster is Isabella) && flags[kFLAGS.PC_FETISH] == 1 && rand(10) == 0 && !player.hasItem(armors.SEDUCTA, 1) && !getGame().ceraphFollowerScene.ceraphIsFollower()) {
				itype = armors.SEDUCTA;
			}

			if (!plotFight && rand(200) == 0 && player.level >= 7) itype = consumables.BROBREW;
			if (!plotFight && rand(200) == 0 && player.level >= 7) itype = consumables.BIMBOLQ;
			if (!plotFight && rand(1000) == 0 && player.level >= 7) itype = consumables.RAINDYE;
			//Chance of eggs if Easter!
			if (!plotFight && rand(6) == 0 && getGame().plains.bunnyGirl.isItEaster()) {
				temp = rand(13);
				if (temp == 0) itype =consumables.BROWNEG;
				if (temp == 1) itype =consumables.L_BRNEG;
				if (temp == 2) itype =consumables.PURPLEG;
				if (temp == 3) itype =consumables.L_PRPEG;
				if (temp == 4) itype =consumables.BLUEEGG;
				if (temp == 5) itype =consumables.L_BLUEG;
				if (temp == 6) itype =consumables.PINKEGG;
				if (temp == 7) itype =consumables.NPNKEGG;
				if (temp == 8) itype =consumables.L_PNKEG;
				if (temp == 9) itype =consumables.L_WHTEG;
				if (temp == 10) itype =consumables.WHITEEG;
				if (temp == 11) itype =consumables.BLACKEG;
				if (temp == 12) itype = consumables.L_BLKEG;
				flags[kFLAGS.ACHIEVEMENT_PROGRESS_EGG_HUNTER]++;
			}
			//Ring drops!
			if (!plotFight && rand(200) <= 0 + Math.min(6, Math.floor(monster.level / 10))) { //Ring drops!
			var  ringDropTable: any[] = [];
				ringDropTable.push(jewelries.SILVRNG);
				if (monster.level < 10) ringDropTable.push(jewelries.SILVRNG);
				if (monster.level < 15 && rand(2) == 0) ringDropTable.push(jewelries.SILVRNG);
				ringDropTable.push(jewelries.GOLDRNG);
				if (monster.level < 20) ringDropTable.push(jewelries.GOLDRNG);
				ringDropTable.push(jewelries.PLATRNG);
				if (rand(2) == 0) ringDropTable.push(jewelries.DIAMRNG);
				if (monster.level >= 15 && rand(4) == 0) ringDropTable.push(jewelries.LTHCRNG);
				if (monster.level >= 25 && rand(3) == 0) ringDropTable.push(jewelries.LTHCRNG);
				if (monster.level >= 1 && monster.level < 15) {
					ringDropTable.push(jewelries.CRIMRN1);
					ringDropTable.push(jewelries.FERTRN1);
					ringDropTable.push(jewelries.ICE_RN1);
					ringDropTable.push(jewelries.CRITRN1);
					ringDropTable.push(jewelries.REGNRN1);
					ringDropTable.push(jewelries.LIFERN1);
					ringDropTable.push(jewelries.MYSTRN1);
					ringDropTable.push(jewelries.POWRRN1);
				}
				if (monster.level >= 11 && monster.level < 25) {
					ringDropTable.push(jewelries.CRIMRN2);
					ringDropTable.push(jewelries.FERTRN2);
					ringDropTable.push(jewelries.ICE_RN2);
					ringDropTable.push(jewelries.CRITRN2);
					ringDropTable.push(jewelries.REGNRN2);
					ringDropTable.push(jewelries.LIFERN2);
					ringDropTable.push(jewelries.MYSTRN2);
					ringDropTable.push(jewelries.POWRRN2);
				}
				if (monster.level >= 21) {
					ringDropTable.push(jewelries.CRIMRN3);
					ringDropTable.push(jewelries.FERTRN3);
					ringDropTable.push(jewelries.ICE_RN3);
					ringDropTable.push(jewelries.CRITRN3);
					ringDropTable.push(jewelries.REGNRN3);
					ringDropTable.push(jewelries.LIFERN3);
					ringDropTable.push(jewelries.MYSTRN3);
					ringDropTable.push(jewelries.POWRRN3);
				}
			}
			//Bonus loot overrides others
			if (flags[kFLAGS.BONUS_ITEM_AFTER_COMBAT_ID] != "") {
				itype = ItemType.lookupItem(flags[kFLAGS.BONUS_ITEM_AFTER_COMBAT_ID]);
			}
			monster.handleAwardItemText(itype); //Each monster can now override the default award text
			if (itype != undefined) {
				if (inDungeon)
					inventory.takeItem(itype, playerMenu);
				else inventory.takeItem(itype, nextFunc);
			}
		}
		
		public  awardPlayer(nextFunc = undefined): void
		{
			if (nextFunc == undefined) nextFunc = camp.returnToCampUseOneHour; //Default to returning to camp.
			if (player.countCockSocks("gilded") > 0) {
				//trace( "awardPlayer found MidasCock. Gems bumped from: " + monster.gems );
			var  bonusGems: number = monster.gems * 0.15 + 5 * player.countCockSocks("gilded"); // int so AS rounds to whole numbers
				monster.gems += bonusGems;
				if (monster2 != undefined) monster2.gems += bonusGems;
				if (monster3 != undefined) monster3.gems += bonusGems;
				if (monster4 != undefined) monster4.gems += bonusGems;
				//trace( "to: " + monster.gems )
			}
			if (player.findPerk(PerkLib.HistoryFortune) >= 0) {
			var  bonusGems2: number = monster.gems * 0.15;
				monster.gems += bonusGems2;
				if (monster2 != undefined) monster2.gems += bonusGems2;
				if (monster3 != undefined) monster3.gems += bonusGems2;
				if (monster4 != undefined) monster4.gems += bonusGems2;
			}
			if (player.findPerk(PerkLib.HistoryWhore) >= 0) {
			var  bonusGems3: number = (monster.gems * 0.04) * player.teaseLevel;
				if (monster.lust >= monster.maxLust()) monster.gems += bonusGems3;
				if (monster2 != undefined && monster2.lust >= monster2.maxLust()) monster2.gems += bonusGems3;
				if (monster3 != undefined && monster3.lust >= monster3.maxLust()) monster3.gems += bonusGems3;
				if (monster4 != undefined && monster4.lust >= monster4.maxLust()) monster4.gems += bonusGems3;
			}
			if (player.findPerk(PerkLib.AscensionFortune) >= 0) {
				monster.gems *= Math.round(1 + (player.perkv1(PerkLib.AscensionFortune) * 0.1));
				if (monster2 != undefined) monster2.gems *= Math.round(1 + (player.perkv1(PerkLib.AscensionFortune) * 0.1));
				if (monster3 != undefined) monster3.gems *= Math.round(1 + (player.perkv1(PerkLib.AscensionFortune) * 0.1));
				if (monster4 != undefined) monster4.gems *= Math.round(1 + (player.perkv1(PerkLib.AscensionFortune) * 0.1));
			}
			//Sum up the gems.
		var  totalGems: number = monster.gems;
			if (monster2 != undefined) totalGems += monster2.gems;
			if (monster3 != undefined) totalGems += monster3.gems;
			if (monster4 != undefined) totalGems += monster4.gems;
			//And sum up the XP too!
		var  totalXP: number = monster.XP;
			if (monster2 != undefined) totalXP += monster2.XP;
			if (monster3 != undefined) totalXP += monster3.XP;
			if (monster4 != undefined) totalXP += monster4.XP;
			//Each monster can now override the default award text
			if (countMonstersTotal() == 1) {
				monster.handleAwardText();
			}
			else {
				outputText("\n\nYou gain " + totalXP + " XP and " + (totalGems == 1 ? "a single gem" : totalGems + " gems") + " across " + num2Text(countMonstersTotal()) + " defeated adversaries as you walk away from your victory.");
			}
			if (!inDungeon && !inRoomedDungeon && !prison.inPrison) { //Not in dungeons
				if (nextFunc != undefined) doNext(nextFunc);
				else doNext(playerMenu);
			}
			else {
				if (nextFunc != undefined) doNext(nextFunc);
				else doNext(playerMenu);
			}
			if (countMonstersTotal() == 1)
				dropItem(monster, nextFunc);
			else
				queueItemDrops(nextFunc, true);
			inCombat = false;
			player.gems += totalGems;
			player.XP += totalXP;
			mainView.statsView.showStatUp('xp');
			dynStats("lust", 0, "scale", false); //Forces up arrow.
		}

		public  queueItemDrops(nextFunc, newArray: boolean = false): void {
			if (newArray) {
				dropQueue.push(monster);
				if (monster2 != undefined) dropQueue.push(monster2);
				if (monster3 != undefined) dropQueue.push(monster3);
				if (monster4 != undefined) dropQueue.push(monster4);
			}
			if (dropQueue.length > 0) {
				dropItem(dropQueue[0], curry(queueItemDrops, nextFunc));
				dropQueue.splice(0, 1);
			}
			else {
				nextFunc();
			}
		}
		
		//Clear statuses
		public  clearStatuses(): void {
			player.clearStatuses();
			for (var a:/*StatusEffect*/Array=monster.statusEffects.slice(),n: number=a.length,i: number=0;i<n;i++) {
				// Using a copy of array because some effects will be removed
				a[i].onCombatEnd();
			}
		}
		//Update combat status effects
		private  combatStatusesUpdate(): void {
			//old outfit used for fetish cultists
		var  oldOutfit: string = "";
		var  changed: boolean = false;
			//Reset menuloc
		//This is now automatic - newRound arg defaults to true:	menuLoc = 0;
			hideUpDown();
			if (player.hasStatusEffect(StatusEffects.Sealed)) {
				//Countdown and remove as necessary
				if (player.statusEffectv1(StatusEffects.Sealed) > 0) {
					player.addStatusValue(StatusEffects.Sealed,1,-1);
					if (player.statusEffectv1(StatusEffects.Sealed) <= 0) player.removeStatusEffect(StatusEffects.Sealed);
					else outputText("<b>One of your combat abilities is currently sealed by magic!</b>\n\n");
				}
			}
			monster.combatRoundUpdate();
			//[Silence warning]
			if (player.hasStatusEffect(StatusEffects.ThroatPunch)) {
				player.addStatusValue(StatusEffects.ThroatPunch,1,-1);
				if (player.statusEffectv1(StatusEffects.ThroatPunch) >= 0) outputText("Thanks to Isabella's wind-pipe crushing hit, you're having trouble breathing and are <b>unable to cast spells as a consequence.</b>\n\n");
				else {
					outputText("Your wind-pipe recovers from Isabella's brutal hit.  You'll be able to focus to cast spells again!\n\n");
					player.removeStatusEffect(StatusEffects.ThroatPunch);
				}
			}
			if (player.hasStatusEffect(StatusEffects.GooArmorSilence)) {
				if (player.statusEffectv1(StatusEffects.GooArmorSilence) >= 2 || rand(20) + 1 + player.str/10 >= 15) {
					//if passing str check, output at beginning of turn
					outputText("<b>The sticky slop covering your mouth pulls away reluctantly, taking more force than you would expect, but you've managed to free your mouth enough to speak!</b>\n\n");
					player.removeStatusEffect(StatusEffects.GooArmorSilence);
				}
				else {
					outputText("<b>Your mouth is obstructed by sticky goo!  You are silenced!</b>\n\n");
					player.addStatusValue(StatusEffects.GooArmorSilence,1,1);
				}
			}
			if (player.hasStatusEffect(StatusEffects.LustStones)) {
				//[When witches activate the stones for goo bodies]
				if (player.isGoo()) {
					outputText("<b>The stones start vibrating again, making your liquid body ripple with pleasure.  The witches snicker at the odd sight you are right now.</b>");
				}
				//[When witches activate the stones for solid bodies]
				else {
					outputText("<b>The smooth stones start vibrating again, sending another wave of teasing bliss throughout your body.  The witches snicker at you as you try to withstand their attack.</b>");
				}
				player.takeLustDamage(player.statusEffectv1(StatusEffects.LustStones) + 4, true);
				outputText("\n\n");
			}
			if (player.hasStatusEffect(StatusEffects.WebSilence)) {
				if (player.statusEffectv1(StatusEffects.WebSilence) >= 2 || rand(20) + 1 + player.str/10 >= 15) {
					outputText("You rip off the webbing that covers your mouth with a cry of pain, finally able to breathe normally again!  Now you can cast spells!\n\n");
					player.removeStatusEffect(StatusEffects.WebSilence);
				}
				else {
					outputText("<b>Your mouth and nose are obstructed by sticky webbing, making it difficult to breathe and impossible to focus on casting spells.  You try to pull it off, but it just won't work!</b>\n\n");
					player.addStatusValue(StatusEffects.WebSilence,1,1);
				}
			}		
			if (player.hasStatusEffect(StatusEffects.HolliConstrict)) {
				outputText("<b>You're tangled up in Holli's verdant limbs!  All you can do is try to struggle free...</b>\n\n");
			}
			if (player.hasStatusEffect(StatusEffects.UBERWEB))
				outputText("<b>You're pinned under a pile of webbing!  You should probably struggle out of it and get back in the fight!</b>\n\n");
			if (player.hasStatusEffect(StatusEffects.Blind) && !monster.hasStatusEffect(StatusEffects.Sandstorm))
			{
				if (player.hasStatusEffect(StatusEffects.SheilaOil))
				{
					if (player.statusEffectv1(StatusEffects.Blind) <= 0) {
						outputText("<b>You finish wiping the demon's tainted oils away from your eyes; though the smell lingers, you can at least see.  Sheila actually seems happy to once again be under your gaze.</b>\n\n");
						player.removeStatusEffect(StatusEffects.Blind);
					}
					else {
						outputText("<b>You scrub at the oily secretion with the back of your hand and wipe some of it away, but only smear the remainder out more thinly.  You can hear the demon giggling at your discomfort.</b>\n\n");
						player.addStatusValue(StatusEffects.Blind,1,-1);
					}
				}
				else 
				{
					//Remove blind if countdown to 0
					if (player.statusEffectv1(StatusEffects.Blind) == 0) 
					{
						player.removeStatusEffect(StatusEffects.Blind);
						//Alert PC that blind is gone if no more stacks are there.
						if (!player.hasStatusEffect(StatusEffects.Blind))
						{
							outputText("<b>Your eyes have cleared and you are no longer blind!</b>\n\n");
						}
						else outputText("<b>You are blind, and many physical attacks will miss much more often.</b>\n\n");
					}
					else 
					{
						player.addStatusValue(StatusEffects.Blind,1,-1);
						outputText("<b>You are blind, and many physical attacks will miss much more often.</b>\n\n");
					}
				}
			}
			//Basilisk compulsion
			if (player.hasStatusEffect(StatusEffects.BasiliskCompulsion)) {
				StareMonster.speedReduce(player,15);
				//Continuing effect text: 
				outputText("<b>You still feel the spell of those grey eyes, making your movements slow and difficult, the remembered words tempting you to look into its eyes again. You need to finish this fight as fast as your heavy limbs will allow.</b>\n\n");
				flags[kFLAGS.BASILISK_RESISTANCE_TRACKER]++;
			}
			if (player.hasStatusEffect(StatusEffects.IzmaBleed)) {
				if (player.statusEffectv1(StatusEffects.IzmaBleed) <= 0) {
					player.removeStatusEffect(StatusEffects.IzmaBleed);
					outputText("<b>You sigh with relief; your bleeding has slowed considerably.</b>\n\n");
				}
				//Bleed effect:
				else {
				var  bleed: number = (2 + rand(4))/100;
					bleed *= player.HP;
					bleed = takeDamage(bleed);
					outputText("<b>You gasp and wince in pain, feeling fresh blood pump from your wounds. " + getDamageText(bleed) + "</b>\n\n");
				}
			}
			if (player.hasStatusEffect(StatusEffects.AcidSlap)) {
			var  slap: number = 3 + (player.maxHP() * 0.02);
				outputText("<b>Your muscles twitch in agony as the acid keeps burning you. <b>(<font color=\"" + mainViewManager.colorHpMinus() + "\">" + slap + "</font>)</b></b>\n\n");
			}
			if (player.findPerk(PerkLib.ArousingAura) >= 0 && monster.lustVuln > 0 && player.isCorruptEnough(70)) {
				if (monster.lust100 < 50) outputText("Your aura seeps into " + monster.a + monster.short + " but does not have any visible effects just yet.\n\n");
				else if (monster.lust100 < 60) {
					if (!monster.plural) outputText(monster.capitalA + monster.short + " starts to squirm a little from your unholy presence.\n\n");
					else outputText(monster.capitalA + monster.short + " start to squirm a little from your unholy presence.\n\n");
				}
				else if (monster.lust100 < 75) outputText("Your arousing aura seems to be visibly affecting " + monster.a + monster.short + ", making " + monster.pronoun2 + " squirm uncomfortably.\n\n");
				else if (monster.lust100 < 85) {
					if (!monster.plural) outputText(monster.capitalA + monster.short + "'s skin colors red as " + monster.pronoun1 + " inadvertently basks in your presence.\n\n");
					else outputText(monster.capitalA + monster.short + "' skin colors red as " + monster.pronoun1 + " inadvertently bask in your presence.\n\n");
				}
				else {
					if (!monster.plural) outputText("The effects of your aura are quite pronounced on " + monster.a + monster.short + " as " + monster.pronoun1 + " begins to shake and steal glances at your body.\n\n");
					else outputText("The effects of your aura are quite pronounced on " + monster.a + monster.short + " as " + monster.pronoun1 + " begin to shake and steal glances at your body.\n\n");
				}
				monster.lust += monster.lustVuln * (2 + rand(4));
			}
			if (player.hasStatusEffect(StatusEffects.Bound) && flags[kFLAGS.PC_FETISH] >= 2) {
				outputText("The feel of tight leather completely immobilizing you turns you on more and more.  Would it be so bad to just wait and let her play with you like this?");
				player.takeLustDamage(3, true);
				outputText("\n\n");
			}
			if (player.hasStatusEffect(StatusEffects.GooArmorBind)) {
				if (flags[kFLAGS.PC_FETISH] >= 2) {
					outputText("The feel of the all-encapsulating goo immobilizing your helpless body turns you on more and more.  Maybe you should just wait for it to completely immobilize you and have you at its mercy.");
					player.takeLustDamage(3, true);
				}
				else outputText("You're utterly immobilized by the goo flowing around you.  You'll have to struggle free!");
				outputText("\n\n");
			}
			if (player.hasStatusEffect(StatusEffects.HarpyBind)) {
				if (flags[kFLAGS.PC_FETISH] >= 2) {
					outputText("The harpies are holding you down and restraining you, making the struggle all the sweeter!");
					player.takeLustDamage(3, true);
					outputText("\n\n");
				}
				else outputText("You're restrained by the harpies so that they can beat on you with impunity.  You'll need to struggle to break free!\n\n");
			}
			if (player.hasStatusEffect(StatusEffects.NagaBind) && flags[kFLAGS.PC_FETISH] >= 2) {
				outputText("Coiled tightly by the naga and utterly immobilized, you can't help but become aroused thanks to your bondage fetish.");
				player.takeLustDamage(5, true);
				outputText("\n\n");
			}
			if (player.hasStatusEffect(StatusEffects.TentacleBind)) {
				outputText("You are firmly trapped in the tentacle's coils.  <b>The only thing you can try to do is struggle free!</b>\n\n");
				if (flags[kFLAGS.PC_FETISH] >= 2) {
					outputText("Wrapped tightly in the tentacles, you find it hard to resist becoming more and more aroused...");
					player.takeLustDamage(3, true);
					outputText("\n\n");
				}
			}
			if (player.hasStatusEffect(StatusEffects.DriderKiss)) {
				//(VENOM OVER TIME: WEAK)
				if (player.statusEffectv1(StatusEffects.DriderKiss) == 0) {
					outputText("Your heart hammers a little faster as a vision of the drider's nude, exotic body on top of you assails you.  It'll only get worse if she kisses you again...");
					player.takeLustDamage(8, true);
					outputText("\n\n");
				}
				//(VENOM OVER TIME: MEDIUM)
				else if (player.statusEffectv1(StatusEffects.DriderKiss) == 1) {
					outputText("You shudder and moan, nearly touching yourself as your ");
					if (player.gender > 0) outputText("loins tingle and leak, hungry for the drider's every touch.");
					else outputText("asshole tingles and twitches, aching to be penetrated.");
					outputText("  Gods, her venom is getting you so hot.  You've got to end this quickly!");
					player.takeLustDamage(15, true);
					outputText("\n\n");
				}
				//(VENOM OVER TIME: MAX)
				else {
					outputText("You have to keep pulling your hands away from your crotch - it's too tempting to masturbate here on the spot and beg the drider for more of her sloppy kisses.  Every second that passes, your arousal grows higher.  If you don't end this fast, you don't think you'll be able to resist much longer.  You're too turned on... too horny... too weak-willed to resist much longer...");
					player.takeLustDamage(25, true);
					outputText("\n\n");
				}
			}
			if (player.hasStatusEffect(StatusEffects.AikoLightningArrow)) {
				if (player.statusEffectv1(StatusEffects.AikoLightningArrow) <= 0) {
					player.removeStatusEffect(StatusEffects.AikoLightningArrow);
					outputText("<b>You feel stronger as Aiko's lightning finally fades, though the arrow is still lodged in your side.</b>\n\n");
					player.addCombatBuff('str',6);
					player.addCombatBuff('spe',6);
				}
				//Shock effect:
				else {
					outputText("You fall to one knee as Aiko's Lighting pulses through your limbs, Oh how this hurts...");
					player.takeDamage(15, true);
					outputText("\n\n");
				}
			}
			if (player.hasStatusEffect(StatusEffects.YamataEntwine)) {
				//Corrupting entwine effect:
				outputText("Yamata's serpentine hair continues to pump their corrupted flames into you!  ");
				player.takeDamage(8);
				player.takeLustDamage(7, true);
				player.dynStats("cor", 1);
				flags[kFLAGS.YAMATA_MASOCHIST]++;
			}
			//Harpy lip gloss
			if (player.hasCock() && player.hasStatusEffect(StatusEffects.Luststick) && (monster.short == "harpy" || monster.short == "Sophie")) {
				//Chance to cleanse!
				if (player.findPerk(PerkLib.Medicine) >= 0 && rand(100) <= 14) {
					outputText("You manage to cleanse the harpy lip-gloss from your system with your knowledge of medicine!\n\n");
					player.removeStatusEffect(StatusEffects.Luststick);
				}		
				else if (rand(5) == 0) {
					if (rand(2) == 0) outputText("A fantasy springs up from nowhere, dominating your thoughts for a few moments.  In it, you're lying down in a soft nest.  Gold-rimmed lips are noisily slurping around your " + player.cockDescript(0) + ", smearing it with her messy aphrodisiac until you're completely coated in it.  She looks up at you knowingly as the two of you get ready to breed the night away...\n\n");		
					else outputText("An idle daydream flutters into your mind.  In it, you're fucking a harpy's asshole, clutching tightly to her wide, feathery flanks as the tight ring of her pucker massages your " + player.cockDescript(0) + ".  She moans and turns around to kiss you on the lips, ensuring your hardness.  Before long her feverish grunts of pleasure intensify, and you feel the egg she's birthing squeezing against you through her internal walls...");
					player.takeLustDamage(20, true);
					outputText("\n\n");
				}
			}
			if (player.hasStatusEffect(StatusEffects.StoneLust)) {
				if (player.vaginas.length > 0) {
					if (player.lust100 < 40) outputText("You squirm as the smooth stone orb vibrates within you.");
					if (player.lust100 >= 40 && player.lust100 < 70) outputText("You involuntarily clench around the magical stone in your twat, in response to the constant erotic vibrations.");
					if (player.lust100 >= 70 && player.lust100 < 85) outputText("You stagger in surprise as a particularly pleasant burst of vibrations erupt from the smooth stone sphere in your " + player.vaginaDescript(0) + ".");
					if (player.lust100 >= 85) outputText("The magical orb inside of you is making it VERY difficult to keep your focus on combat, white-hot lust suffusing your body with each new motion.");
				}
				else {
					outputText("The orb continues vibrating in your ass, doing its best to arouse you.");
				}
				player.takeLustDamage(7 + int(player.sens)/10, true);
				outputText("\n\n");
			}
			if (player.hasStatusEffect(StatusEffects.KissOfDeath)) {
				//Effect 
				outputText("Your lips burn with an unexpected flash of heat.  They sting and burn with unholy energies as a puff of ectoplasmic gas escapes your lips.  That puff must be a part of your soul!  It darts through the air to the succubus, who slurps it down like a delicious snack.  You feel feverishly hot and exhausted...");
				player.takeLustDamage(5, true);
				takeDamage(15);	
				outputText("\n\n");
			}
			if (player.hasStatusEffect(StatusEffects.DemonSeed)) {
				outputText("You feel something shift inside you, making you feel warm.  Finding the desire to fight this... hunk gets harder and harder.\n\n");
				player.takeLustDamage((player.statusEffectv1(StatusEffects.DemonSeed) + int(player.sens/30) + int(player.lib/30) + int(player.cor/30)), true);
			}
			if (player.inHeat && player.vaginas.length > 0 && monster.totalCocks() > 0) {
				player.takeLustDamage((rand(player.lib/5) + 3 + rand(5)), true);
				outputText("Your " + player.vaginaDescript(0) + " clenches with an instinctual desire to be touched and filled.  ");
				outputText("If you don't end this quickly you'll give in to your heat.\n\n");
			}
			if (player.inRut && player.totalCocks() > 0 && monster.hasVagina()) {
				player.takeLustDamage((rand(player.lib/5) + 3 + rand(5)), true);
				if (player.totalCocks() > 1) outputText("Each of y");
				else outputText("Y");
				if (monster.plural) outputText("our " + player.multiCockDescriptLight() + " dribbles pre-cum as you think about plowing " + monster.a + monster.short + " right here and now, fucking " + monster.pronoun3 + " " + monster.vaginaDescript() + "s until they're totally fertilized and pregnant.\n\n");
				else outputText("our " + player.multiCockDescriptLight() + " dribbles pre-cum as you think about plowing " + monster.a + monster.short + " right here and now, fucking " + monster.pronoun3 + " " + monster.vaginaDescript() + " until it's totally fertilized and pregnant.\n\n");
			}
			if (player.hasStatusEffect(StatusEffects.TemporaryHeat)) {
				//Chance to cleanse!
				if (player.findPerk(PerkLib.Medicine) >= 0 && rand(100) <= 14) {
					outputText("You manage to cleanse the heat and rut drug from your system with your knowledge of medicine!\n\n");
					player.removeStatusEffect(StatusEffects.TemporaryHeat);
				}
				else {
					dynStats("lus", (player.lib/12 + 5 + rand(5)) * player.statusEffectv2(StatusEffects.TemporaryHeat));
					if (player.hasVagina()) {
						outputText("Your " + player.vaginaDescript(0) + " clenches with an instinctual desire to be touched and filled.  ");
					}
					else if (player.totalCocks() > 0) {
						outputText("Your " + player.cockDescript(0) + " pulses and twitches, overwhelmed with the desire to breed.  ");			
					}
					if (player.gender == 0) {
						outputText("You feel a tingle in your " + player.assholeDescript() + ", and the need to touch and fill it nearly overwhelms you.  ");
					}
					outputText("If you don't finish this soon you'll give in to this potent drug!\n\n");
				}
			}
			//Poison
			if (player.hasStatusEffect(StatusEffects.Poison)) {
				//Chance to cleanse!
				if (player.findPerk(PerkLib.Medicine) >= 0 && rand(100) <= 14) {
					outputText("You manage to cleanse the poison from your system with your knowledge of medicine!\n\n");
					player.removeStatusEffect(StatusEffects.Poison);
				}
				else {
					outputText("The poison continues to work on your body, wracking you with pain!\n\n");
					takeDamage(8+rand(player.maxHP()/20) * player.statusEffectv2(StatusEffects.Poison));
				}
			}
			//Bondage straps + bondage fetish
			if (flags[kFLAGS.PC_FETISH] >= 2 && player.armorName == "barely-decent bondage straps") {
				outputText("The feeling of the tight, leather straps holding tightly to your body while exposing so much of it turns you on a little bit more.");
				player.takeLustDamage(2, true);
				outputText("\n\n");
			}
			//Giant boulder
			if (player.hasStatusEffect(StatusEffects.GiantBoulder)) {
				outputText("<b>There is a large boulder coming your way. If you don't avoid it in time, you might take some serious damage.</b>\n\n");
			}
			//Drider Incubus' purple haze
			if (player.hasStatusEffect(StatusEffects.PurpleHaze)) {
				outputText("<b>The purple haze is filling your vision with unsubtle erotic imagery, arousing you.</b>");
				player.takeLustDamage(3, true);
				outputText("\n\n");
			}
			//Minotaur King's musk
			if (player.hasStatusEffect(StatusEffects.MinotaurKingMusk)) {
				outputText("<b>The smell of the minotaur pheronome is intense, turning you on. You should try to deal with him as soon as possible.</b>");
				player.takeLustDamage(2, true);
				outputText("\n\n");
			}
			//Minotaur King Touched
			if (player.hasStatusEffect(StatusEffects.MinotaurKingsTouch)) {
				outputText("<b>The residual cum from the Minotaur King continues to arouse you.</b>");
				player.takeLustDamage(1, true);
				outputText("\n\n");
			}
			//Pigby's Hands
			if (player.hasStatusEffect(StatusEffects.PigbysHands)) {
				player.takeLustDamage(3, true);
			}
			//Whip Silence
			if (player.hasStatusEffect(StatusEffects.WhipSilence)) {
				if (player.statusEffectv1(StatusEffects.WhipSilence) > 0) {
					outputText("<b>You are silenced by the burning cord wrapped around your neck. It's painful... and arousing too.</b> ");
					player.takeDamage(10 + rand(8), true);
					player.takeLustDamage(4, true);
					player.addStatusValue(StatusEffects.WhipSilence, 1, -1);
					outputText("\n\n");
				}
				else {
					outputText("The cord has finally came loose and falls off your neck. It dissipates immediately. You can cast spells again now!\n\n");
					player.removeStatusEffect(StatusEffects.WhipSilence);
				}
			}
			for (var a:/*StatusEffect*/Array=player.statusEffects.slice(),n: number=a.length,i: number=0;i<n;i++) {
				// Using a copy of array because some effects will be removed
				a[i].onCombatRound();
			}
			for (a=monster.statusEffects.slice(),n=a.length,i=0;i<n;i++) {
				a[i].onCombatRound();
			}
			regeneration(true);
			if (player.lust >= player.maxLust()) doNext(endLustLoss);
			if (player.HP <= 0) doNext(endHpLoss);
		}

		public  regeneration(combat: boolean = true): void {
		var  healingPercent: number = 0;
		var  healingBonus: number = 0;
			if (combat) {
				//Regeneration
				healingPercent = 0;
				if (player.hunger >= 25 || flags[kFLAGS.HUNGER_ENABLED] <= 0)
				{
					if (player.findPerk(PerkLib.Regeneration) >= 0) healingPercent += 1;
					if (player.findPerk(PerkLib.Regeneration2) >= 0) healingPercent += 1;
				}
				if (player.findPerk(PerkLib.LustyRegeneration) >= 0) healingPercent += 1;
				if (player.armor == armors.NURSECL) healingPercent += 1;
				if (player.armor == armors.GOOARMR) healingPercent += (getGame().valeria.valeriaFluidsEnabled() ? (flags[kFLAGS.VALERIA_FLUIDS] < 50 ? flags[kFLAGS.VALERIA_FLUIDS] / 25 : 2) : 2);
				if (player.jewelry.effectId == JewelryLib.MODIFIER_REGENERATION) healingBonus += player.jewelry.effectMagnitude;
				if (healingPercent > 5) healingPercent = 5;
				player.HPChange(Math.round(player.maxHP() * healingPercent / 100) + healingBonus, false);
			}
			else {
				//Regeneration
				healingPercent = 0;
				if (player.hunger >= 25 || flags[kFLAGS.HUNGER_ENABLED] <= 0)
				{
					if (player.findPerk(PerkLib.Regeneration) >= 0) healingPercent += 2;
					if (player.findPerk(PerkLib.Regeneration2) >= 0) healingPercent += 2;
				}
				if (player.armorName == "skimpy nurse's outfit") healingPercent += 2;
				if (player.armorName == "goo armor") healingPercent += (getGame().valeria.valeriaFluidsEnabled() ? (flags[kFLAGS.VALERIA_FLUIDS] < 50 ? flags[kFLAGS.VALERIA_FLUIDS] / 16 : 3) : 3);
				if (player.findPerk(PerkLib.LustyRegeneration) >= 0) healingPercent += 2;
				if (healingPercent > 10) healingPercent = 10;
				player.HPChange(Math.round(player.maxHP() * healingPercent / 100), false);
			}
		}
		
		public  beginCombat(monster_:Monster, plotFight_: boolean = false): void {
			combatRound = 0;
			plotFight = plotFight_;
			mainView.hideMenuButton( MainView.MENU_DATA );
			mainView.hideMenuButton( MainView.MENU_APPEARANCE );
			mainView.hideMenuButton( MainView.MENU_LEVEL );
			mainView.hideMenuButton( MainView.MENU_PERKS );
			mainView.hideMenuButton( MainView.MENU_STATS );
			showStats();
			//Flag the game as being "in combat"
			inCombat = true;
			monster = monster_;
			//Set image once, at the beginning of combat
			if (monster.imageName != "")
			{
			var  monsterName: string = "monster-" + monster.imageName;
				imageText = images.showImage(monsterName);
			} else imageText = "";
			
			//Reduce enemy def if player has precision!
			if (player.findPerk(PerkLib.Precision) >= 0 && player.inte >= 25) {
				if (monster.armorDef <= 10) monster.armorDef = 0;
				else monster.armorDef -= 10;
			}
			//Raises lust~ Not disabled because it's an item perk :3
			if (player.findPerk(PerkLib.WellspringOfLust) >= 0 && player.lust < 50) {
				player.lust = 50;
			}
			if (player.findPerk(PerkLib.Battlemage) >= 0 && player.lust >= 50 && !player.hasStatusEffect(StatusEffects.Might)) {
				combatAbilities.spellMight(true); // XXX: message?
			}
			if (player.findPerk(PerkLib.Spellsword) >= 0 && player.lust100 < combatAbilities.getWhiteMagicLustCap() && !player.hasStatusEffect(StatusEffects.ChargeWeapon)) {
				combatAbilities.spellChargeWeapon(true); // XXX: message?
			}
			if (!(monster is Doppelganger)) {
				monster.str *= 1 + player.ascensionFactor(0.25);
				monster.tou *= 1 + player.ascensionFactor(0.25);
				monster.spe *= 1 + player.ascensionFactor(0.25);
				monster.inte *= 1 + player.ascensionFactor(0.25);
			}
			monster.level += player.ascensionFactor(30);
			if (flags[kFLAGS.GRIMDARK_MODE] > 0) {
				monster.level = Math.round(Math.pow(monster.level, 1.4));
			}
			//Adjust lust vulnerability in New Game+.
			if (player.newGamePlusMod() == 1) monster.lustVuln *= 0.8;
			else if (player.newGamePlusMod() == 2) monster.lustVuln *= 0.65;
			else if (player.newGamePlusMod() == 3) monster.lustVuln *= 0.5;
			else if (player.newGamePlusMod() >= 4) monster.lustVuln *= 0.4;
			monster.HP = monster.maxHP();
			monster.XP = monster.totalXP();
			if (player.weapon is FlintlockPistol) flags[kFLAGS.FLINTLOCK_PISTOL_AMMO] = 4;
			if (player.weapon is Blunderbuss) flags[kFLAGS.FLINTLOCK_PISTOL_AMMO] = 12;
			if (prison.inPrison && prison.prisonCombatAutoLose) {
				dynStats("lus", player.maxLust(), "scale", false);
				doNext(endLustLoss);
				return;
			}
			doNext(playerMenu);
		}
		public  beginCombatImmediate(monster:Monster, _plotFight: boolean): void {
			beginCombat(monster, _plotFight);
			if (prison.inPrison && prison.prisonCombatAutoLose) endLustLoss();
			else playerMenu();
		}
		
		public  display(): void {
			mainView.updateCombatView();
			if (!monster.checkCalled){
				outputText("<B>/!\\BUG! Monster.checkMonster() is not called! Calling it now...</B>\n");
				monster.checkMonster();
			}
			if (monster.checkError != ""){
				outputText("<B>/!\\BUG! Monster is not correctly initialized! </B>"+
						monster.checkError+"</u></b>\n");
			}
		var  monsters: any[] = [monster, monster2, monster3, monster4];
		var  idx: number;
		var  math: number;
		var  hpDisplay: string;
		var  lustDisplay: string;
			//hpDisplay = "(<b>" + String(int(math * 1000) / 10) + "% HP</b>)";
			//imageText set in beginCombat()
			outputText(imageText);
			
			outputText("<b>You are fighting ");
			if (countMonstersTotal() == 1)
				outputText(monster.a + monster.short + ":</b> \n");
			else
				outputText(encounterShort + ":</b> \n");
			if (player.hasStatusEffect(StatusEffects.Blind)) {
				outputText("It's impossible to see anything!\n");
			}
			else {
				if (encounterLong != "") {
					outputText(encounterLong + "\n\n");
				}
				else {
					outputText(monster.long + "\n\n");
				}
				//Bonus sand trap stuff
				if (monster.hasStatusEffect(StatusEffects.Level)) {
					temp = monster.statusEffectv1(StatusEffects.Level);
					//[(new PG for PC height levels)PC level 4: 
					if (temp == 4) outputText("You are right at the edge of its pit.  If you can just manage to keep your footing here, you'll be safe.");
					else if (temp == 3) outputText("The sand sinking beneath your feet has carried you almost halfway into the creature's pit.");
					else outputText("The dunes tower above you and the hissing of sand fills your ears.  <b>The leering sandtrap is almost on top of you!</b>");
					//no new PG)
					outputText("  You could try attacking it with your " + player.weaponName + ", but that will carry you straight to the bottom.  Alternately, you could try to tease it or hit it at range, or wait and maintain your footing until you can clamber up higher.");
					outputText("\n\n");
				}
				if (countMonstersTotal() == 1) {
					math = monster.HPRatio();
					if (monster.plural) {
						if (math >= 1) outputText("You see " + monster.pronoun1 + " are in perfect health.  ");
						else if (math > .75) outputText("You see " + monster.pronoun1 + " aren't very hurt.  ");
						else if (math > .5) outputText("You see " + monster.pronoun1 + " are slightly wounded.  ");
						else if (math > .25) outputText("You see " + monster.pronoun1 + " are seriously hurt.  ");
						else outputText("You see " + monster.pronoun1 + " are unsteady and close to death.  ");
					}
					else {
						if (math >= 1) outputText("You see " + monster.pronoun1 + " is in perfect health.  ");
						else if (math > .75) outputText("You see " + monster.pronoun1 + " isn't very hurt.  ");
						else if (math > .5) outputText("You see " + monster.pronoun1 + " is slightly wounded.  ");
						else if (math > .25) outputText("You see " + monster.pronoun1 + " is seriously hurt.  ");
						else outputText("You see " + monster.pronoun1 + " is unsteady and close to death.  ");
					}
					showMonsterLust(monster);
				}
				else {
					for (idx = 0; idx < countMonstersTotal(); idx++) {
						math = monsters[idx].HPRatio();
						if (math >= 1) outputText("You see " + monsters[idx].a + monsters[idx].short + " is in perfect health. ");
						else if (math > .75) outputText("You see " + monsters[idx].a + monsters[idx].short + " isn't very hurt. ");
						else if (math > .5) outputText("You see " + monsters[idx].a + monsters[idx].short + " is slightly wounded. ");
						else if (math > .25) outputText("You see " + monsters[idx].a + monsters[idx].short + " is seriously hurt. ");
						else if (math > .0) outputText("You see " + monsters[idx].a + monsters[idx].short + " is unsteady and close to death. ");
						else outputText("You see " + monsters[idx].a + monsters[idx].short + " is incapacitated from all the damage done to " + monsters[idx].pronoun2 + ". ");
						showMonsterLust(monsters[idx]);
						outputText("\n");
					}
				}
				if (flags[kFLAGS.ENEMY_STATS_BARS_ENABLED] <= 0) {
					for (idx = 0; idx < countMonstersTotal(); idx++)
					if (monsters[idx] != undefined) {
						hpDisplay   = Math.floor(monsters[idx].HP) + " / " + monsters[idx].maxHP() + " (" + floor(monsters[idx].HPRatio() * 100, 1) + "%)";
						lustDisplay = Math.floor(monsters[idx].lust) + " / " + monsters[idx].maxLust();
						outputText("\n\n<b><u>" + capitalizeFirstLetter(monsters[idx].short) + "'s Stats</u></b>\n")
						outputText("Level: " + monsters[idx].level + "\n");
						outputText("HP: " + hpDisplay + "\n");
						outputText("Lust: " + lustDisplay + "\n");
					}
				}
			}
			if (debug){
				outputText("\n----------------------------\n");
				outputText(monster.generateDebugDescription());
			}
		}
		public  showMonsterLust(monster:Monster): void {
			//Entrapped
			if (monster.hasStatusEffect(StatusEffects.Constricted)) {
				outputText(monster.capitalA + monster.short + " is currently wrapped up in your tail-coils!  ");
			}
			//Venom stuff!
			if (monster.hasStatusEffect(StatusEffects.NagaVenom)) {
				if (monster.plural) {
					if (monster.statusEffectv1(StatusEffects.NagaVenom) <= 1) {
						outputText("You notice " + monster.pronoun1 + " are beginning to show signs of weakening, but there still appears to be plenty of fight left in " + monster.pronoun2 + ".  ");
					}
		    	    else {
						outputText("You notice " + monster.pronoun1 + " are obviously affected by your venom, " + monster.pronoun3 + " movements become unsure, and " + monster.pronoun3 + " balance begins to fade. Sweat begins to roll on " + monster.pronoun3 + " skin. You wager " + monster.pronoun1 + " are probably beginning to regret provoking you.  ");
					}
				}
				//Not plural
				else {
					if (monster.statusEffectv1(StatusEffects.NagaVenom) <= 1) {
						outputText("You notice " + monster.pronoun1 + " is beginning to show signs of weakening, but there still appears to be plenty of fight left in " + monster.pronoun2 + ".  ");
					}
		    	    else {
						outputText("You notice " + monster.pronoun1 + " is obviously affected by your venom, " + monster.pronoun3 + " movements become unsure, and " + monster.pronoun3 + " balance begins to fade. Sweat is beginning to roll on " + monster.pronoun3 + " skin. You wager " + monster.pronoun1 + " is probably beginning to regret provoking you.  ");
					}
				}
				
				monster.spe -= monster.statusEffectv1(StatusEffects.NagaVenom);
				monster.str -= monster.statusEffectv1(StatusEffects.NagaVenom);
				if (monster.spe < 1) monster.spe = 1;
				if (monster.str < 1) monster.str = 1;
			}
			if (monster.short == "harpy") {
				//(Enemy slightly aroused) 
				if (monster.lust100 >= 45 && monster.lust100 < 70) outputText("The harpy's actions are becoming more and more erratic as she runs her mad-looking eyes over your body, her chest jiggling, clearly aroused.  ");
				//(Enemy moderately aroused) 
				if (monster.lust100 >= 70 && monster.lust100 < 90) outputText("She stops flapping quite so frantically and instead gently sways from side to side, showing her soft, feathery body to you, even twirling and raising her tail feathers, giving you a glimpse of her plush pussy, glistening with fluids.");
				//(Enemy dangerously aroused) 
				if (monster.lust100 >= 90) outputText("You can see her thighs coated with clear fluids, the feathers matted and sticky as she struggles to contain her lust.");
			}
			else if (monster is Clara)
			{
				//Clara is becoming aroused
				if (monster.lust100 <= 40)	 {}
				else if (monster.lust100 <= 65) outputText("The anger in her motions is weakening.");
				//Clara is somewhat aroused
				else if (monster.lust100 <= 75) outputText("Clara seems to be becoming more aroused than angry now.");
				//Clara is very aroused
				else if (monster.lust100 <= 85) outputText("Clara is breathing heavily now, the signs of her arousal becoming quite visible now.");
				//Clara is about to give in
				else outputText("It looks like Clara is on the verge of having her anger overwhelmed by her lusts.");
			}
			//{Bonus Lust Descripts}
			else if (monster.short == "Minerva") {
				if (monster.lust100 < 40) {}
				//(40)
				else if (monster.lust100 < 60) outputText("Letting out a groan Minerva shakes her head, focusing on the fight at hand.  The bulge in her short is getting larger, but the siren ignores her growing hard-on and continues fighting.  ");
				//(60) 
				else if (monster.lust100 < 80) outputText("Tentacles are squirming out from the crotch of her shorts as the throbbing bulge grows bigger and bigger, becoming harder and harder... for Minerva to ignore.  A damp spot has formed just below the bulge.  ");
				//(80)
				else outputText("She's holding onto her weapon for support as her face is flushed and pain-stricken.  Her tiny, short shorts are painfully holding back her quaking bulge, making the back of the fabric act like a thong as they ride up her ass and struggle against her cock.  Her cock-tentacles are lashing out in every direction.  The dampness has grown and is leaking down her leg.");
			}
			else if (monster.short == "Cum Witch") {
				//{Bonus Lust Desc (40+)}
				if (monster.lust100 < 40) {}
				else if (monster.lust100 < 50) outputText("Her nipples are hard, and poke two visible tents into the robe draped across her mountainous melons.  ");
				//{Bonus Lust Desc (50-75)}
				else if (monster.lust100 < 75) outputText("Wobbling dangerously, you can see her semi-hard shaft rustling the fabric as she moves, evidence of her growing needs.  ");
				//{75+}
				if (monster.lust100 >= 75) outputText("Swelling obscenely, the Cum Witch's thick cock stands out hard and proud, its bulbous tip rustling through the folds of her fabric as she moves and leaving dark smears in its wake.  ");
				//(85+}
				if (monster.lust100 >= 85) outputText("Every time she takes a step, those dark patches seem to double in size.  ");
				//{93+}
				if (monster.lust100 >= 93) outputText("There's no doubt about it, the Cum Witch is dripping with pre-cum and so close to caving in.  Hell, the lower half of her robes are slowly becoming a seed-stained mess.  ");
				//{Bonus Lust Desc (60+)}
				if (monster.lust100 >= 70) outputText("She keeps licking her lips whenever she has a moment, and she seems to be breathing awfully hard.  ");
			}
			else if (monster.short == "Kelt") {
				//Kelt Lust Levels
				//(sub 50)
				if (monster.lust100 < 50) outputText("Kelt actually seems to be turned off for once in his miserable life.  His maleness is fairly flaccid and droopy.  ");
				//(sub 60)
				else if (monster.lust100 < 60) outputText("Kelt's gotten a little stiff down below, but he still seems focused on taking you down.  ");
				//(sub 70)
				else if (monster.lust100 < 70) outputText("Kelt's member has grown to its full size and even flared a little at the tip.  It bobs and sways with every movement he makes, reminding him how aroused you get him.  ");
				//(sub 80)
				else if (monster.lust100 < 80) outputText("Kelt is unabashedly aroused at this point.  His skin is flushed, his manhood is erect, and a thin bead of pre has begun to bead underneath.  ");
				//(sub 90)
				else if (monster.lust100 < 90) outputText("Kelt seems to be having trouble focusing.  He keeps pausing and flexing his muscles, slapping his cock against his belly and moaning when it smears his pre-cum over his equine underside.  ");
				//(sub 100) 
				else outputText("There can be no doubt that you're having quite the effect on Kelt.  He keeps fidgeting, dripping pre-cum everywhere as he tries to keep up the facade of fighting you.  His maleness is continually twitching and bobbing, dripping messily.  He's so close to giving in...");
			}
			else if (monster.short == "green slime") {
				if (monster.lust100 >= 45 && monster.lust100 < 65) outputText("A lump begins to form at the base of the figure's torso, where its crotch would be.  ");
				if (monster.lust100 >= 65 && monster.lust100 < 85) outputText("A distinct lump pulses at the base of the slime's torso, as if something inside the creature were trying to escape.  ");
				if (monster.lust100 >= 85 && monster.lust100 < 93) outputText("A long, thick pillar like a small arm protrudes from the base of the slime's torso.  ");
				if (monster.lust100 >= 93) outputText("A long, thick pillar like a small arm protrudes from the base of the slime's torso.  Its entire body pulses, and it is clearly beginning to lose its cohesion.  ");
			}
			else if (monster.short == "Sirius, a naga hypnotist") {
				if (monster.lust100 < 40) {}
				else if (monster.lust100 >= 40) outputText("You can see the tip of his reptilian member poking out of its protective slit. ");
				else if (monster.lust100 >= 60) outputText("His cock is now completely exposed and half-erect, yet somehow he still stays focused on your eyes and his face is inexpressive.  ");
				else outputText("His cock is throbbing hard, you don't think it will take much longer for him to pop.   Yet his face still looks inexpressive... despite the beads of sweat forming on his brow.  ");

			}
			else if (monster.short == "kitsune") {
				//Kitsune Lust states:
				//Low
				if (monster.lust100 > 30 && monster.lust100 < 50) outputText("The kitsune's face is slightly flushed.  She fans herself with her hand, watching you closely.");
				//Med
				else if (monster.lust100 > 30 && monster.lust100 < 75) outputText("The kitsune's cheeks are bright pink, and you can see her rubbing her thighs together and squirming with lust.");
				//High
				else if (monster.lust100 > 30) {
					//High (redhead only)
					if (monster.hair.color == "red") outputText("The kitsune is openly aroused, unable to hide the obvious bulge in her robes as she seems to be struggling not to stroke it right here and now.");
					else outputText("The kitsune is openly aroused, licking her lips frequently and desperately trying to hide the trail of fluids dripping down her leg.");
				}
			}
			else if (monster.short == "demons") {
				if (monster.lust100 > 30 && monster.lust100 < 60) outputText("The demons lessen somewhat in the intensity of their attack, and some even eye up your assets as they strike at you.");
				if (monster.lust100 >= 60 && monster.lust100 < 80) outputText("The demons are obviously steering clear from damaging anything you might use to fuck and they're starting to leave their hands on you just a little longer after each blow. Some are starting to cop quick feels with their other hands and you can smell the demonic lust of a dozen bodies on the air.");
				if (monster.lust100 >= 80) outputText(" The demons are less and less willing to hit you and more and more willing to just stroke their hands sensuously over you. The smell of demonic lust is thick on the air and part of the group just stands there stroking themselves openly.");
			}
			else if (monster.short == "Aiko") {
				if (monster.lust100 > 50 && monster.lust100 < 60) outputText("Aiko’s face is slightly pink from arousal. You can see her fidgeting in her stance once or twice, biting her lip slightly.  ");
				if (monster.lust100 >= 60 && monster.lust100 < 80) outputText("Aiko’s cheeks are a deep crimson, and she breaks stance frequently to fan herself, panting visibly.  ");
				if (monster.lust100 >= 80) outputText("Aiko’s knees are trembling with barely-restrained arousal, and you can see a small puddle forming at her feet as she takes a deep breath, trying to calm her flustered nerves.  ");
			}
			else if (monster.short == "Yamata") {
				if (monster.lust100 < 20) outputText("Yamata seems to be fairly calm and collected, in spite of her obviously deranged nature. A barely-restrained psychosis swims just under the surface, threatening to boil over at any moment."+(monster.lust100 > 10?" Is she getting stronger?":"")+"  ");
				if (monster.lust100 >= 20 && monster.lust100 < 40) outputText("Yamata is swaying a little with sadistic glee now, her psychotic grin wide and toothy. She occasionally twirls her sword around, cracking the joints in her neck from time to time and goading you into attacking. It seems like the more turned-on she becomes, the more powerful her attacks are.  ");
				if (monster.lust100 >= 40 && monster.lust100 < 60) outputText("Yamata’s movements have started to become reckless, but that only serves to make her even more dangerous. The psychotic flame in her eyes is now accompanied by a lusty gaze and an occasional lick of her lips. You’re sure of it now; the more turned-on she is, the more dangerous her attacks become.  ");
				if (monster.lust100 >= 60 && monster.lust100 < 80) outputText("Bloodlust is evident in Yamata’s eyes now, and it seems like she is subsisting on animalistic rage and adrenaline alone. Every swing is accompanied by hysterical laughter, and the smells of sex and violence emanating from her are overpowering. She’s getting more and more reckless with each swing! You should end this soon!  ");
				if (monster.lust100 >= 80) outputText("Yamata has whipped herself into a lustful berserk frenzy, lashing out with reckless abandon. All of her self control has been cast aside, and she’s putting everything she has into every attack now. If things keep going like this, she might even end up wearing herself out! Though it might be hard to hold out until she eventually burns out!  ");
			}
			else {
				if (monster.plural) {
					if (monster.lust100 > 50 && monster.lust100 < 60) outputText(monster.capitalA + monster.short + "' skin remains flushed with the beginnings of arousal.  ");
					if (monster.lust100 >= 60 && monster.lust100 < 70) outputText(monster.capitalA + monster.short + "' eyes constantly dart over your most sexual parts, betraying " + monster.pronoun3 + " lust.  ");
					if (monster.cocks.length > 0) {
						if (monster.lust100 >= 70 && monster.lust100 < 85) outputText(monster.capitalA + monster.short + " are having trouble moving due to the rigid protrusion in " + monster.pronoun3 + " groins.  ");
						if (monster.lust100 >= 85) outputText(monster.capitalA + monster.short + " are panting and softly whining, each movement seeming to make " + monster.pronoun3 + " bulges more pronounced.  You don't think " + monster.pronoun1 + " can hold out much longer.  ");
					}
					if (monster.vaginas.length > 0) {
						if (monster.lust100 >= 70 && monster.lust100 < 85) outputText(monster.capitalA + monster.short + " are obviously turned on, you can smell " + monster.pronoun3 + " arousal in the air.  ");
						if (monster.lust100 >= 85) outputText(monster.capitalA + monster.short + "' " + monster.vaginaDescript() + "s are practically soaked with their lustful secretions.  ");
					}
					if (monster.lust100 >= 100) outputText(monster.capitalA + monster.short + " are completely overwhelmed by " + monster.pronoun3 + " staggering arousal, being unable to fight back. ");
				}
				else {
					if (monster.lust100 > 50 && monster.lust100 < 60) outputText(monster.capitalA + monster.short + "'s skin remains flushed with the beginnings of arousal.  ");
					if (monster.lust100 >= 60 && monster.lust100 < 70) outputText(monster.capitalA + monster.short + "'s eyes constantly dart over your most sexual parts, betraying " + monster.pronoun3 + " lust.  ");
					if (monster.cocks.length > 0) {
						if (monster.lust100 >= 70 && monster.lust100 < 85) outputText(monster.capitalA + monster.short + " is having trouble moving due to the rigid protrusion in " + monster.pronoun3 + " groin.  ");
						if (monster.lust100 >= 85 && monster.lust100 < 100) outputText(monster.capitalA + monster.short + " is panting and softly whining, each movement seeming to make " + monster.pronoun3 + " bulge more pronounced.  You don't think " + monster.pronoun1 + " can hold out much longer.  ");
					}
					if (monster.vaginas.length > 0) {
						if (monster.lust100 >= 70 && monster.lust100 < 85) outputText(monster.capitalA + monster.short + " is obviously turned on, you can smell " + monster.pronoun3 + " arousal in the air.  ");
						if (monster.lust100 >= 85 && monster.lust100 < 100) outputText(monster.capitalA + monster.short + "'s " + monster.vaginaDescript() + " is practically soaked with " + monster.pronoun3 + " lustful secretions.  ");
					}
					if (monster.lust100 >= 100) outputText(monster.capitalA + monster.short + " is completely overwhelmed by " + monster.pronoun3 + " staggering arousal, being unable to fight back. ");
				}
			}
		}

		//VICTORY OR DEATH?
		public  combatRoundOver(): boolean { //Called after the monster's action. Given a different name to avoid conflicing with BaseContent.
			if (countMonstersTotal() > 0) outputText("\n");
			flags[kFLAGS.ENEMY_CRITICAL] = 0;
			if (!inCombat) return false;
			if (countMonstersLeft() <= 0) {
				if (monster.HP < 1) {
					doNext(endHpVictory);
					return true;
				}
				if (monster.lust >= monster.maxLust()) {
					doNext(endLustVictory);
					return true;
				}
			}
			if (monster.hasStatusEffect(StatusEffects.Level)) {
				if ((monster as SandTrap).trapLevel() <= 1) {
					getGame().desert.sandTrapScene.sandtrapmentLoss();
					return true;
				}
			}
			if (monster is StareMonster && player.spe <= 1) {
				doNext(endHpLoss);
				return true;
			}
			if (player.HP < 1) {
				doNext(endHpLoss);
				return true;
			}
			if (player.lust >= player.maxLust() && !player.hasPerk(PerkLib.Indefatigable)) {
				doNext(endLustLoss);
				return true;
			}
			combatRound++;
			doNext(playerMenu); //This takes us back to the combatMenu and a new combat round
			return false;
		}

		public  runAway(callHook: boolean = true): void {
			if (callHook && monster.onPcRunAttempt != undefined){
				monster.onPcRunAttempt();
				return;
			}
			clearOutput();
			if (inCombat && player.hasStatusEffect(StatusEffects.Sealed) && player.statusEffectv2(StatusEffects.Sealed) == 4) {
				clearOutput();
				outputText("You try to run, but you just can't seem to escape.  <b>Your ability to run was sealed, and now you've wasted a chance to attack!</b>\n\n");
				enemyTurn();
				return;
			}
			//Rut doesnt let you run from dicks.
			if (player.inRut && monster.totalCocks() > 0) {
				outputText("The thought of another male in your area competing for all the pussy infuriates you!  No way will you run!");
		//Pass false to combatMenu instead:		menuLoc = 3;
		//		doNext(combatMenu);
				menu();
				addButton(0, "Next", combatMenu, false);
				return;
			}
			if (monster.hasStatusEffect(StatusEffects.Level) && player.canFly()) {
				clearOutput();
				outputText("You flex the muscles in your back and, shaking clear of the sand, burst into the air!  Wasting no time you fly free of the sandtrap and its treacherous pit.  \"One day your wings will fall off, little ant,\" the snarling voice of the thwarted androgyne carries up to you as you make your escape.  \"And I will be waiting for you when they do!\"");
				inCombat = false;
				clearStatuses();
				doNext(camp.returnToCampUseOneHour);
				return;
			}
			if (monster.hasStatusEffect(StatusEffects.GenericRunDisabled) || getGame().urtaQuest.isUrta()) {
				outputText("You can't escape from this fight!");
		//Pass false to combatMenu instead:		menuLoc = 3;
		//		doNext(combatMenu);
				menu();
				addButton(0, "Next", combatMenu, false);
				return;
			}
			if (monster.hasStatusEffect(StatusEffects.Level) && monster.statusEffectv1(StatusEffects.Level) < 4) {
				outputText("You're too deeply mired to escape!  You'll have to <b>climb</b> some first!");
		//Pass false to combatMenu instead:		menuLoc = 3;
		//		doNext(combatMenu);
				menu();
				addButton(0, "Next", combatMenu, false);
				return;
			}
			if (monster.hasStatusEffect(StatusEffects.RunDisabled)) {
				outputText("You'd like to run, but you can't scale the walls of the pit with so many demonic hands pulling you down!");
		//Pass false to combatMenu instead:		menuLoc = 3;
		//		doNext(combatMenu);
				menu();
				addButton(0, "Next", combatMenu, false);
				return;
			}
			if (flags[kFLAGS.MINOTAUR_SONS_WASTED_TURN] == 1 && (monster.short == "minotaur gang" || monster.short == "minotaur tribe")) {
				flags[kFLAGS.MINOTAUR_SONS_WASTED_TURN] = 0;
				//(Free run away) 
				outputText("You slink away while the pack of brutes is arguing.  Once they finish that argument, they'll be sorely disappointed!");
				inCombat = false;
				clearStatuses();
				doNext(camp.returnToCampUseOneHour);
				return;
			}
			else if (monster.short == "minotaur tribe" && monster.HPRatio() >= 0.75) {
				outputText("There's too many of them surrounding you to run!");
		//Pass false to combatMenu instead:		menuLoc = 3;
		//		doNext(combatMenu);
				menu();
				addButton(0, "Next", combatMenu, false);
				return;
			}
			if (inDungeon || inRoomedDungeon) {
				outputText("You're trapped in your foe's home turf - there is nowhere to run!\n\n");
				enemyTurn();
				return;
			}
			if (prison.inPrison && !prison.prisonCanEscapeRun()) {
				addButton(0, "Next", combatMenu, false);
				return;
			}
			//Attempt texts!
			if (monster.short == "Marae") {
				outputText("Your boat is blocked by tentacles! ");
				if (!player.canFly()) outputText("You may not be able to swim fast enough. ");
				else outputText("You grit your teeth with effort as you try to fly away but the tentacles suddenly grab your " + player.legs() + " and pull you down. ");
				outputText("It looks like you cannot escape. ");
				enemyTurn();
				return;
			}
			if (monster.short == "Ember") {
				outputText("You take off");
				if (!player.canFly()) outputText(" running");
				else outputText(", flapping as hard as you can");
				outputText(", and Ember, caught up in the moment, gives chase.  ");
			}
			if (monster.short == "lizan rogue") {
				outputText("As you retreat the lizan doesn't even attempt to stop you. When you look back to see if he's still there you find nothing but the empty bog around you.");
				inCombat = false;
				clearStatuses();
				doNext(camp.returnToCampUseOneHour);
				return;
			}
			else if (player.canFly()) outputText("Gritting your teeth with effort, you beat your wings quickly and lift off!  ");	
			//Nonflying PCs
			else {
				//In prison!
				if (prison.inPrison) {
					outputText("You make a quick dash for the door and attempt to escape! ");
				}
				//Stuck!
				else if (player.hasStatusEffect(StatusEffects.NoFlee)) {
					if (monster.short == "goblin") outputText("You try to flee but get stuck in the sticky white goop surrounding you.\n\n");
					else outputText("You put all your skills at running to work and make a supreme effort to escape, but are unable to get away!\n\n");
					enemyTurn();
					return;
				}
				//Nonstuck!
				else outputText("You turn tail and attempt to flee!  ");
			}
				
			//Calculations
		var  escapeMod: number = 20 + monster.level * 3;
			if (debug) escapeMod -= 300;
			if (player.tail.type == Tail.RACCOON && player.ears.type == Ears.RACCOON && player.findPerk(PerkLib.Runner) >= 0) escapeMod -= 25;
			if (monster.hasStatusEffect(StatusEffects.Blind)) escapeMod -= 35;
			if (monster.hasStatusEffect(StatusEffects.Illusion)) escapeMod -= 20; // Not as much as blindness, but it also affects speed by itself.
			if (player.hasStatusEffect(StatusEffects.Blind) && (!player.canFly() || monster.canFly())) escapeMod += 35; // If you can fly you don't have to see where the sky is. But if your foe can fly too, it won't give you much.
			if (monster.hasStatusEffect(StatusEffects.Stunned)) escapeMod -= 50;
			//Big tits doesn't matter as much if ya can fly!
			if (player.canFly()) escapeMod -= 20;
			else {
				if (player.biggestTitSize() >= 35) escapeMod += 5;
				if (player.biggestTitSize() >= 66) escapeMod += 10;
				if (player.hips.rating >= 20) escapeMod += 5;
				if (player.butt.rating >= 20) escapeMod += 5;
				if (player.ballSize >= 24 && player.balls > 0) escapeMod += 5;
				if (player.ballSize >= 48 && player.balls > 0) escapeMod += 10;
				if (player.ballSize >= 120 && player.balls > 0) escapeMod += 10;
			}
			
			//ANEMONE OVERRULES NORMAL RUN
			if (monster.short == "anemone") {
				//Autosuccess - less than 60 lust
				if (player.lust100 < 60) {
					outputText("Marshalling your thoughts, you frown at the strange girl and turn to march up the beach.  After twenty paces inshore you turn back to look at her again.  The anemone is clearly crestfallen by your departure, pouting heavily as she sinks beneath the water's surface.");
					inCombat = false;
					clearStatuses();
					doNext(camp.returnToCampUseOneHour);
					return;
				}
				//Speed dependent
				else {
					//Success
					if (player.spe > rand(monster.spe+escapeMod)) {
						inCombat = false;
						clearStatuses();
						outputText("Marshalling your thoughts, you frown at the strange girl and turn to march up the beach.  After twenty paces inshore you turn back to look at her again.  The anemone is clearly crestfallen by your departure, pouting heavily as she sinks beneath the water's surface.");
						doNext(camp.returnToCampUseOneHour);
						return;
					}
					//Run failed:
					else {
						outputText("You try to shake off the fog and run but the anemone slinks over to you and her tentacles wrap around your waist.  <i>\"Stay?\"</i> she asks, pressing her small breasts into you as a tentacle slides inside your " + player.armorName + " and down to your nethers.  The combined stimulation of the rubbing and the tingling venom causes your knees to buckle, hampering your resolve and ending your escape attempt.");
						//(gain lust, temp lose spd/str)
						(monster as Anemone).applyVenom((4+player.sens/20));
						combatRoundOver();
						return;
					}
				}
			}
			if (monster is Mimic) {
				clearOutput();
				if (player.hasStatusEffect(StatusEffects.KnockedBack)) {
					outputText("It's not very difficult to run from the immobile creature.");
					inCombat = false;
					clearStatuses();
					doNext(camp.returnToCampUseOneHour);
				} else {
					if (player.spe > rand(monster.spe + escapeMod) || player.getEvasionRoll()) {
						outputText("You quickly bolt out from the creature's reach.");
						player.createStatusEffect(StatusEffects.KnockedBack, 0, 0, 0, 0);
						combatRoundOver();
					} else {
						outputText("You quickly bolt out from the creature, but the creature wraps its tentacles around your leg, preventing your escape.\n\n");
						enemyTurn();
					}
				}
				return;
			}
			//Ember is SPUCIAL
			if (monster.short == "Ember") {
				//GET AWAY
				if (player.spe > rand(monster.spe + escapeMod) || (player.findPerk(PerkLib.Runner) >= 0 && rand(100) < 50)) {
					if (player.findPerk(PerkLib.Runner) >= 0) outputText("Using your skill at running, y");
					else outputText("Y");
					outputText("You easily outpace the dragon, who begins hurling imprecations at you.  \"What the hell, [name], you weenie; are you so scared that you can't even stick out your punishment?\"");
					outputText("\n\nNot to be outdone, you call back, \"Sucks to you!  If even the mighty Last Ember of Hope can't catch me, why do I need to train?  Later, little bird!\"");
					inCombat = false;
					clearStatuses();
					doNext(camp.returnToCampUseOneHour);
				}
				//Fail: 
				else {
					outputText("Despite some impressive jinking, " + getGame().emberScene.emberMF("he", "she") + " catches you, tackling you to the ground.\n\n");
					enemyTurn();
				}
				return;
			}
			//SUCCESSFUL FLEE
			if (player.spe > rand(monster.spe + escapeMod)) {
				//Escape prison
				if (prison.inPrison) {
					outputText("You quickly bolt out of the main entrance and after hiding for a good while, there's no sign of " + monster.a + " " + monster.short + ". You sneak back inside to retrieve whatever you had before you were captured. ");
					inCombat = false;
					clearStatuses();
					prison.prisonEscapeSuccessText();
					doNext(prison.prisonEscapeFinalePart1);
					return;
				}
				//Fliers flee!
				else if (player.canFly()) outputText(monster.capitalA + monster.short + " can't catch you.");
				//sekrit benefit: if you have coon ears, coon tail, and Runner perk, change normal Runner escape to flight-type escape
				else if (player.tail.type == Tail.RACCOON && player.ears.type == Ears.RACCOON && player.findPerk(PerkLib.Runner) >= 0) {
					outputText("Using your running skill, you build up a head of steam and jump, then spread your arms and flail your tail wildly; your opponent dogs you as best " + monster.pronoun1 + " can, but stops and stares dumbly as your spastic tail slowly propels you several meters into the air!  You leave " + monster.pronoun2 + " behind with your clumsy, jerky, short-range flight.");
				}
				//Non-fliers flee
				else outputText(monster.capitalA + monster.short + " rapidly disappears into the shifting landscape behind you.");
				if (monster.short == "Izma") {
					outputText("\n\nAs you leave the tigershark behind, her taunting voice rings out after you.  \"<i>Oooh, look at that fine backside!  Are you running or trying to entice me?  Haha, looks like we know who's the superior specimen now!  Remember: next time we meet, you owe me that ass!</i>\"  Your cheek tingles in shame at her catcalls.");
				}
				if (monster is Ghoul) ghoulReveal = false;
				inCombat = false;
				clearStatuses();
				doNext(camp.returnToCampUseOneHour);
				return;
			}
			//Runner perk chance
			else if (player.findPerk(PerkLib.Runner) >= 0 && rand(100) < 50) {
				inCombat = false;
				outputText("Thanks to your talent for running, you manage to escape.");
				if (monster.short == "Izma") {
					outputText("\n\nAs you leave the tigershark behind, her taunting voice rings out after you.  \"<i>Oooh, look at that fine backside!  Are you running or trying to entice me?  Haha, looks like we know who's the superior specimen now!  Remember: next time we meet, you owe me that ass!</i>\"  Your cheek tingles in shame at her catcalls.");
				}
				clearStatuses();
				doNext(camp.returnToCampUseOneHour);
				return;
			}
			//FAIL FLEE
			else {
				if (monster.short == "Holli") {
					(monster as Holli).escapeFailWithHolli();
					return;
				}
				//Flyers get special failure message.
				if (player.canFly()) {
					if (monster.plural) outputText(monster.capitalA + monster.short + " manage to grab your " + player.legs() + " and drag you back to the ground before you can fly away!");
					else outputText(monster.capitalA + monster.short + " manages to grab your " + player.legs() + " and drag you back to the ground before you can fly away!");
				}
				//fail
				else if (player.tail.type == Tail.RACCOON && player.ears.type == Ears.RACCOON && player.findPerk(PerkLib.Runner) >= 0) outputText("Using your running skill, you build up a head of steam and jump, but before you can clear the ground more than a foot, your opponent latches onto you and drags you back down with a thud!");
				//Nonflyer messages
				else {
					//Huge balls messages
					if (player.balls > 0 && player.ballSize >= 24) {
						if (player.ballSize < 48) outputText("With your " + player.ballsDescriptLight() + " swinging ponderously beneath you, getting away is far harder than it should be.  ");
						else outputText("With your " + player.ballsDescriptLight() + " dragging along the ground, getting away is far harder than it should be.  ");
					}
					//FATASS BODY MESSAGES
					if (player.biggestTitSize() >= 35 || player.butt.rating >= 20 || player.hips.rating >= 20)
					{
						//FOR PLAYERS WITH GIANT BREASTS
						if (player.biggestTitSize() >= 35 && player.biggestTitSize() < 66)
						{
							if (player.hips.rating >= 20)
							{
								outputText("Your " + player.hipDescript() + " forces your gait to lurch slightly side to side, which causes the fat of your " + player.skin.tone + " ");
								if (player.butt.rating >= 20) outputText(player.buttDescript() + " and ");
								outputText(player.chestDesc() + " to wobble immensely, throwing you off balance and preventing you from moving quick enough to escape.");
							}
							else if (player.butt.rating >= 20) outputText("Your " + player.skin.tone + player.buttDescript() + " and " + player.chestDesc() + " wobble and bounce heavily, throwing you off balance and preventing you from moving quick enough to escape.");
							else outputText("Your " + player.chestDesc() + " jiggle and wobble side to side like the " + player.skin.tone + " sacks of milky fat they are, with such force as to constantly throw you off balance, preventing you from moving quick enough to escape.");
						}
						//FOR PLAYERS WITH MASSIVE BREASTS
						else if (player.biggestTitSize() >= 66) {
							if (player.hips.rating >= 20) {
								outputText("Your " + player.chestDesc() + " nearly drag along the ground while your " + player.hipDescript() + " swing side to side ");
								if (player.butt.rating >= 20) outputText("causing the fat of your " + player.skin.tone + player.buttDescript() + " to wobble heavily, ");
								outputText("forcing your body off balance and preventing you from moving quick enough to get escape.");
							}
							else if (player.butt.rating >= 20) outputText("Your " + player.chestDesc() + " nearly drag along the ground while the fat of your " + player.skin.tone + player.buttDescript() + " wobbles heavily from side to side, forcing your body off balance and preventing you from moving quick enough to escape.");
							else outputText("Your " + player.chestDesc() + " nearly drag along the ground, preventing you from moving quick enough to get escape.");
						}
						//FOR PLAYERS WITH EITHER GIANT HIPS OR BUTT BUT NOT THE BREASTS
						else if (player.hips.rating >= 20) {
							outputText("Your " + player.hipDescript() + " swing heavily from side to side ");
							if (player.butt.rating >= 20) outputText("causing your " + player.skin.tone + player.buttDescript() + " to wobble obscenely ");
							outputText("and forcing your body into an awkward gait that slows you down, preventing you from escaping.");
						}
						//JUST DA BOOTAH
						else if (player.butt.rating >= 20) outputText("Your " + player.skin.tone + player.buttDescript() + " wobbles so heavily that you're unable to move quick enough to escape.");
					}
					//NORMAL RUN FAIL MESSAGES
					else if (monster.plural) outputText(monster.capitalA + monster.short + " stay hot on your heels, denying you a chance at escape!");
					else outputText(monster.capitalA + monster.short + " stays hot on your heels, denying you a chance at escape!");
				}
			}
			outputText("\n\n");
			enemyTurn();
		}
		
	}


