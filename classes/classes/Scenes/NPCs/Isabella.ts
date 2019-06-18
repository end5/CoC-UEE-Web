
	export class Isabella extends Monster
	{

		//IZZY AI:

		//Isabella Combat texttttttsss
		public  isabellaAttack(): void {
			//[Standard attack]
			outputText("Isabella snorts and lowers a shield a moment before she begins to charge towards you. Her hooves tear huge divots out of the ground as she closes the distance with surprising speed!  ");

			//Blind dodge change
			if (hasStatusEffect(StatusEffects.Blind) && rand(3) < 2) {
				outputText("Isabella blindly tries to charge at you, but misses completely.\n");
			}
			//Determine if dodged!
			else if (player.spe - spe > 0 && int(Math.random()*(((player.spe-spe)/4) +80)) > 80) {
				outputText("You duck aside at the last moment, relying entirely on your speed.\n");
			}
			//Determine if evaded
			else if (player.findPerk(PerkLib.Evade) >= 0 && rand(100) < 10) {
				outputText("You easily evade her incredibly linear attack.\n");
			}
			//("Misdirection"
			else if (player.findPerk(PerkLib.Misdirection) >= 0 && rand(100) < 10 && player.armorName == "red, high-society bodysuit") {
				outputText("You easily misdirect her and step aside at the last moment.\n");
			}
			//Determine if cat'ed
			else if (player.findPerk(PerkLib.Flexibility) >= 0 && rand(100) < 6) {
				outputText("You throw yourself out of the way with cat-like agility at the last moment, avoiding her attack.\n");
			}
			else {
			var  damage: number;
				damage = Math.round(weaponAttack + str + (game.isabellaScene.isabellaSparIntensity() * 1.5) + 20);
				damage = player.reduceDamage(damage);
				if (damage < 0) {
					outputText("You brace yourself and catch her shield in both hands, dragging through the dirt as you slow her charge to a stop.  She gapes down, completely awestruck by the show of power.");
				}
				else {
					outputText("She's coming too fast to dodge, and you're forced to try to stop her.  It doesn't work.  Isabella's shield hits you hard enough to ring your ears and knock you onto your back with bruising force. ");
					outputCritical();
					damage = player.takeDamage(damage, true);
					outputText("\n");
				}
			}
			combatRoundOver();
		}

		public  isabellaStun(): void {
			//[Stunning Impact]
			outputText("Isabella spins her shield back at you in a potent, steel-assisted backhand.  ");

			//Blind dodge change
			if (hasStatusEffect(StatusEffects.Blind) && rand(3) < 2) {
				outputText("Isabella blindly tries to charge at you, but misses completely.\n");
			}
			//Determine if dodged!
			else if (player.spe - spe > 0 && int(Math.random()*(((player.spe-spe)/4) +80)) > 80) {
				outputText("You duck aside at the last moment, relying entirely on your speed.\n");
			}
			//Determine if evaded
			else if (player.findPerk(PerkLib.Evade) >= 0 && rand(100) < 10) {
				outputText("You easily evade her incredibly linear attack.\n");
			}
			//("Misdirection"
			else if (player.findPerk(PerkLib.Misdirection) >= 0 && rand(100) < 10 && player.armorName == "red, high-society bodysuit") {
				outputText("You easily misdirect her and step aside at the last moment.\n");
			}
			//Determine if cat'ed
			else if (player.findPerk(PerkLib.Flexibility) >= 0 && rand(100) < 6) {
				outputText("You bend backward with cat-like agility to avoid her attack.\n");
			}
			else {
			var  damage: number = 0;
				damage = Math.round(weaponAttack + str + game.isabellaScene.isabellaSparIntensity());
				damage = player.reduceDamage(damage);
				if (damage < 0) {
					outputText("You deflect her blow away, taking no damage.\n");
					damage = 0;
				}
				else if (player.findPerk(PerkLib.Resolute) >= 0 && player.tou >= 75 && (game.isabellaScene.isabellaSparIntensity() < 30 || rand(2) == 0)) {
					outputText("You resolutely ignore the blow thanks to your immense toughness.\n");
					damage = 0;
				}
				else {
					outputText("You try to avoid it, but her steely attack connects, rocking you back.  You stagger about while trying to get your bearings, but it's all you can do to stay on your feet.  <b>Isabella has stunned you!</b> ");
					if (player.findPerk(PerkLib.Resolute) >= 0) outputText("<b>Not even your 'Resolute' perk helps this time! </b>");
					outputCritical();
					damage = player.takeDamage(damage, true);
					outputText("\n");
					player.createStatusEffect(StatusEffects.IsabellaStunned,0,0,0,0);
				}
			}
			combatRoundOver();
		}

		public  isabellaThroatPunch(): void {
			outputText("Isabella punches out from behind her shield in a punch aimed right at your throat!  ");

			//Blind dodge change
			if (hasStatusEffect(StatusEffects.Blind) && rand(3) < 2) {
				outputText("Isabella blindly tries to charge at you, but misses completely.\n");
			}
			//Determine if dodged!
			else if (player.spe - spe > 0 && int(Math.random()*(((player.spe-spe)/4) +80)) > 80) {
				outputText("You duck aside at the last moment, relying entirely on your speed.\n");
			}
			//Determine if evaded
			else if (player.findPerk(PerkLib.Evade) >= 0 && rand(100) < 10) {
				outputText("You easily evade her incredibly linear attack.\n");
			}
			//("Misdirection"
			else if (player.findPerk(PerkLib.Misdirection) >= 0 && rand(100) < 10 && player.armorName == "red, high-society bodysuit") {
				outputText("You easily misdirect her and step aside at the last moment.\n");
			}
			//Determine if cat'ed
			else if (player.findPerk(PerkLib.Flexibility) >= 0 && rand(100) < 6) {
				outputText("You bend backward with cat-like agility to avoid her attack.\n");
			}
			else {
			var  damage: number;
				damage = Math.round(str + game.isabellaScene.isabellaSparIntensity());
				damage = player.reduceDamage(damage);
				if (damage <= 0) {
					outputText("You manage to block her with your own fists.\n");
				}
				else if (player.findPerk(PerkLib.Resolute) >= 0 && player.tou >= 75 && (game.isabellaScene.isabellaSparIntensity() < 30 || rand(2) == 0)) {
					outputText("You resolutely ignore the blow thanks to your immense toughness.\n");
				}
				else {
					outputText("You try your best to stop the onrushing fist, but it hits you square in the throat, nearly collapsing your windpipe entirely.  Gasping and sputtering, you try to breathe, and while it's difficult, you manage enough to prevent suffocation. <b>It will be impossible to focus to cast a spell in this state!</b> ");
					if (player.findPerk(PerkLib.Resolute) >= 0) outputText("<b>Not even your 'Resolute' perk helps this time! </b>");
					outputCritical();
					damage = player.takeDamage(damage, true);
					outputText("\n");
					player.createStatusEffect(StatusEffects.ThroatPunch,2,0,0,0);
				}
			}
			combatRoundOver();
		}

		//[Milk Self-Heal]
		public  drankMalkYaCunt(): void {
			outputText("Isabella pulls one of her breasts out of her low-cut shirt and begins to suckle at one of the many-tipped nipples. Her cheeks fill and hollow a few times while you watch with spellbound intensity.  She finishes and tucks the weighty orb away, blushing furiously.  The quick drink seems to have reinvigorated her, and watching it has definitely aroused you.");
			HP += 100 + (player.newGamePlusMod() * 100) + (game.isabellaScene.isabellaSparIntensity() * 2);
			lust += Math.round(maxLust() * 0.05);
			player.takeLustDamage((10+player.lib/20), true);
			combatRoundOver();
		}

		protected  performCombatAction(): void
		{
			//-If below 70% HP, 50% chance of milk drinking
			if (HPRatio() < .7 && rand(3) == 0) drankMalkYaCunt();
			//if PC has spells and isn't silenced, 1/3 chance of silence.
			else if (player.hasSpells() && !player.hasStatusEffect(StatusEffects.ThroatPunch) && rand(3) == 0) {
				isabellaThroatPunch();
			}
			//if PC isn't stunned, 1/4 chance of stun
			else if (!player.hasStatusEffect(StatusEffects.IsabellaStunned) && rand(4) == 0) {
				isabellaStun();
			}
			else isabellaAttack();
		}

		public  defeated(hpVictory: boolean): void
		{
			game.isabellaScene.defeatIsabella();
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if (pcCameWorms){
				outputText("\n\n\"<i>Ick,</i>\" Isabella tuts as she turns to leave...");
				game.combat.cleanupAfterCombat();
			} else {
				game.isabellaScene.isabellaDefeats();
			}
		}

		public  Isabella()
		{
			this.a = "";
			this.short = "Isabella";
			this.imageName = "isabella";
			this.long = "Isabella is a seven foot tall, red-headed tower of angry cow-girl.  She's snarling at you from behind her massive shield, stamping her hooves in irritation as she prepares to lay into you.  Her skin is dusky, nearly chocolate except for a few white spots spattered over her body.  She wears a tight silk shirt and a corset that barely supports her bountiful breasts, but it's hard to get a good look at them behind her giant shield.";
			this.race = "Cow-Girl";
			// this.plural = false;
			this.createVagina(false, Vagina.WETNESS_DROOLING, Vagina.LOOSENESS_GAPING);
			this.createStatusEffect(StatusEffects.BonusVCapacity, 45, 0, 0, 0);
			createBreastRow(Appearance.breastCupInverse("EE+"));
			this.ass.analLooseness = Ass.LOOSENESS_VIRGIN;
			this.ass.analWetness = Ass.WETNESS_DRY;
			this.createStatusEffect(StatusEffects.BonusACapacity,38,0,0,0);
			this.tallness = 7*12+6;
			this.hips.rating = Hips.RATING_CURVY+2;
			this.butt.rating = Butt.RATING_LARGE+1;
			this.skin.tone = "dusky";
			this.hair.color = "red";
			this.hair.length = 13;
			initStrTouSpeInte(70, 98, 75, 65);
			initLibSensCor(65, 25, 40);
			this.weaponName = "giant shield";
			this.weaponVerb="smash";
			this.weaponAttack = 15;
			this.armorName = "giant shield";
			this.armorDef = 8;
			this.armorPerk = "";
			this.armorValue = 70;
			this.bonusHP = 700;
			this.lust = 30;
			this.lustVuln = .35;
			this.temperment = TEMPERMENT_RANDOM_GRAPPLES;
			this.level = 15;
			this.gems = rand(5) + 20;
			this.tail.type = Tail.COW;
			this.tail.recharge = 0;
			this.drop = NO_DROP;
			this.applySparIntensity(game.isabellaScene.isabellaSparIntensity(), 15, 2, 2, 50);
			checkMonster();
		}
		
	}


