	
	export class ImpOverlord extends Imp
	{
		public  spellCostCharge: number = 6;
		public  spellCostBlind: number = 8;
		public  spellCostWhitefire: number = 12;
		public  spellCostArouse: number = 6;
		public  spellCostHeal: number = 8;
		public  spellCostMight: number = 10;
		
		public  castSpell(): void {
		var  spellChooser: number = rand(6);
			//Makes sure to not stack spell effects.
			if (lust100 < 50) spellChooser = rand(3);
			if (lust100 > 75) spellChooser = rand(3) + 3;
			if (spellChooser == 0 && hasStatusEffect(StatusEffects.ChargeWeapon)) {
				spellChooser = rand(5) + 1;
			}
			if (spellChooser == 5 && hasStatusEffect(StatusEffects.Might)) {
				spellChooser = rand(5);
				if (spellChooser == 0 && hasStatusEffect(StatusEffects.ChargeWeapon)) spellChooser++;
			}
			//Spell time!
			//Charge Weapon
			if (spellChooser == 0 && fatigue <= (maxFatigue() - spellCostCharge)) {
				outputText("The imp utters word of power, summoning an electrical charge around his scimitar. <b>It looks like he'll deal more physical damage now!</b>");
				createStatusEffect(StatusEffects.ChargeWeapon, 25, 0, 0, 0);
				this.weaponAttack += 25;
				fatigue += spellCostCharge;
			}
			//Blind
			else if (spellChooser == 1 && fatigue <= (maxFatigue() - spellCostBlind)) {
				outputText("The imp glares at you and points at you! A bright flash erupts before you!  ");
				if (rand(player.inte / 5) <= 4) {
					outputText("<b>You are blinded!</b>");
					player.createStatusEffect(StatusEffects.Blind, 1 + rand(3), 0, 0, 0);
				}
				else {
					outputText("You manage to blink in the nick of time!");
				}
				fatigue += spellCostBlind;
			}
			//Whitefire
			else if (spellChooser == 2 && fatigue <= (maxFatigue() - spellCostWhitefire)) {
				outputText("The imp narrows his eyes and focuses his mind with deadly intent. He snaps his fingers and you are enveloped in a flash of white flames!  ");
			var  damage: number = inte + rand(50);
				if (player.isGoo()) {
					damage *= 1.5;
					outputText("It's super effective!  ");
				}
				player.takeDamage(damage, true);
				fatigue += spellCostWhitefire;
			}
			//Arouse
			else if (spellChooser == 3 && fatigue <= (maxFatigue() - spellCostArouse)) {
				outputText("He makes a series of arcane gestures, drawing on his lust to inflict it upon you! ");
			var  lustDmg: number = (inte / 5) + rand(10);
				player.takeLustDamage(lustDmg, true);
				fatigue += spellCostArouse;
			}
			//Heal
			else if (spellChooser == 4 && fatigue <= (maxFatigue() - spellCostHeal)) {
				outputText("He focuses on his body and his desire to end pain, trying to draw on his arousal without enhancing it.");
			var  temp: number = int((inte / (2 + rand(3))) * (maxHP() / 50));
				outputText("He flushes with success as his wounds begin to knit! <b>(<font color=\"#008000\">+" + temp + "</font>)</b>.");
				addHP(temp);
				fatigue += spellCostHeal;
			}
			//Might
			else if (spellChooser == 5 && fatigue <= (maxFatigue() - spellCostMight)) {
				outputText("He flushes, drawing on his body's desires to empower his muscles and toughen his up.");
				outputText("The rush of success and power flows through his body.  He feels like he can do anything!");
				createStatusEffect(StatusEffects.Might, 20, 20, 0, 0);
				fatigue += spellCostMight;
			}
			combatRoundOver();
		}
		
		//Imp Fire
		protected  impFire(): void
		{
			outputText("The imp mutters something to himself. Before you have time to react the demonic creature's hand is filled with a bright red fire that he hurls at you.  The flames lick at your body leaving a painful burn on your torso, as well as an arousing heat in your groin. ");
			//[-HP // +Lust(minor)]
		var  damage: number = 80 + rand(20);
			player.takeDamage(damage, true);
		var  lustDmg: number = 20 + player.cor / 10;
			player.takeLustDamage(lustDmg, true);
			combatRoundOver();
		}

		//Lust Attack
		protected  impLordLustAttack(): void
		{
			outputText("Lowering his loincloth the imp reveals his inhumanly thick shaft.  He smirks and licks his lips as he gives his cock a squeeze, milking a few beads of clear pre from the tip.  You shake your head and try to ignore your growing need.");
			//[+Lust]
		var  lustDmg: number = 15 + player.lib / 5 + player.cor / 5;
			player.takeLustDamage(lustDmg, true);
			combatRoundOver();
		}

		//Lust and Light Attack
		protected  impLordLustAttack2(): void
		{
			outputText("Reaching into his satchel the devilish creature pulls out a leather riding crop.  He quickly rushes forward, but somehow manages to get behind you.  Before you can react the imp lashes out, striking your [butt] twice with the riding crop.  The strikes leave a slight burning feeling, as well as a strange sense of arousal. ");
		var  damage: number = 12 + rand(25);
			player.takeDamage(damage, true);
			//[-HP(minor) // +Lust]
		var  lustDmg: number = 25 + player.sens / 4 + player.cor / 10;
			player.takeLustDamage(lustDmg, true);
			combatRoundOver();
		}
		
		//Cum cannon!
		protected  impLordCumCannon(): void 
		{
			outputText("He moves his loincloth aside and strokes his demonic member quickly. Within moments, he fires a torrent of cum towards you! ");
			lust -= 20;
			fatigue += 15;
			if (lust < 0) lust = 0;
			if (player.getEvasionRoll()) {
				outputText("You manage to dodge his corrupted cum thanks to your reaction!");
				combatRoundOver();
				return;
			}
			else if (player.shieldName == "dragon-shell shield" && rand(3) == 0) {
				outputText("The shield managed to absorb the cum!");
				combatRoundOver();
				return;
			}
			else {
				outputText("The cum lands on you, staining your [armor] and the cum even gets on your [skinfurscales]! You feel aroused from his cum.");
				player.slimeFeed();
			var  lustDmg: number = 30 + player.sens / 4 + player.cor / 10;
				player.takeLustDamage(lustDmg, true);
			}
			combatRoundOver();
		}
		
		public  clawAttack(): void {
			outputText("The imp overlord suddenly charges at you with his claws ready! ");
			if (player.getEvasionRoll()) {
				outputText("You manage to avoid his claws thanks to your reaction!");
				combatRoundOver();
				return;
			}
			else {
				outputText("The imp manages to swipe you! You let out a cry in pain. ");
			var  damage: number = rand(50) + str + weaponAttack;
				damage = player.reduceDamage(damage);
				if (damage < 20) damage = 20;
				player.takeDamage(damage, true);
			}
			combatRoundOver();
		}

		public  doubleAttack(): void {
			outputText("The imp overlord suddenly charges at you with his claws ready and scimitar raised! ");
			if (player.getEvasionRoll()) {
				outputText("You manage to dodge his deadly attack!");
				combatRoundOver();
				return;
			}
			else {
				outputText("The imp manages to slash you with his scimitar and his deadly claws!");
			var  damage: number = rand(100) + (str * 1.5) + weaponAttack;
				damage = player.reduceDamage(damage);
				if (damage < 30) damage = 30; //Min-cap damage.
				if (damage >= 50) {
					outputText("You let out a cry in pain and you swear you could see your wounds bleeding. ");
					player.createStatusEffect(StatusEffects.IzmaBleed, 2, 0, 0, 0);
				}
				else {
					outputText("Thankfully the wounds aren't that serious. ");
				}
				player.takeDamage(damage, true);
			}
			combatRoundOver();
		}
		
		protected  performCombatAction(): void
		{
		var  choices: any[] = [castSpell, impFire, impLordLustAttack2, impLordLustAttack, clawAttack, doubleAttack, eAttack];
			choices[rand(choices.length)]();
		}
		
		public  defeated(hpVictory: boolean): void
		{
			game.flags[kFLAGS.DEMONS_DEFEATED]++;
			game.impScene.defeatImpLord();
		}

		public  won(hpVictory: boolean,pcCameWorms: boolean): void
		{
			game.impScene.loseToAnImpLord(true);
		}
		
		public  ImpOverlord() 
		{
			super(true);
			this.a = "the ";
			this.short = "imp overlord";
			this.imageName = "impoverlord";
			this.long = "The greater imp has an angular face, complete with curved nose and burnt red skin typical of imps.  He has a black hair on his head and his eyes are deep black.  Just above his long pointed ears are two curved bovine horns.  While still short, he's much taller than the average imp, being nearly four feet tall, and extremely well-muscled.  A pair of powerful wings extends out from his shoulders, however, you suspect he wouldn't be able to fly for long due to his extreme bulk.  A thick coating of fur starts at his well toned hips and works its way down his powerful legs.  His legs end in a pair of oddly jointed, demonic hooves.  His demonic figure is completed by a thin tail that has an arrowhead shaped tip.  Glowing veins line his body, giving him a mystical appearance. \n\nHe is wearing shark-teeth necklace and a suit of armor cleverly fashioned from bee-chitin. The precum-stained loincloth does little to cover his large demonic member and his butt is exposed to the world. He’s wielding a scimitar in his right hand and he doesn’t appear to be wielding anything else, suggesting that he also attacks with claws.";
			this.race = "Imp";
			// this.plural = false;
			// Imps now only have demon dicks.
			// Not sure if I agree with this, I can imagine the little fuckers abusing the
			// shit out of any potions they can get their hands on.
			this.createCock(rand(2) +12,2.5,CockTypesEnum.DEMON);
			this.balls = 2;
			this.ballSize = 1;
			this.cumMultiplier = 3;
			this.hoursSinceCum = 20;
			createBreastRow(0);
			this.ass.analLooseness = Ass.LOOSENESS_STRETCHED;
			this.ass.analWetness = Ass.WETNESS_NORMAL;
			this.tallness = rand(14) + 40;
			this.hips.rating = Hips.RATING_BOYISH;
			this.butt.rating = Butt.RATING_TIGHT;
			this.lowerBody.type = LowerBody.HOOFED;
			this.skin.tone = "red";
			initStrTouSpeInte(100, 95, 85, 66);
			initLibSensCor(55, 35, 100);
			this.weaponName = "scimitar";
			this.weaponVerb="slash";
			this.weaponAttack = 30;
			this.armorName = "sexy black chitin armor-plating";
			this.armorDef = 20;
			this.bonusHP = 600;
			this.lust = 30;
			this.lustVuln = .3;
			this.fatigue = 0;
			this.temperment = TEMPERMENT_LUSTY_GRAPPLES;
			this.level = 21;
			this.gems = rand(25) + 55;
			this.drop = new WeightedDrop().
					add(consumables.MINOBLO,3).
					add(consumables.LABOVA_,3).
					add(consumables.INCUBID,12).
					add(consumables.SUCMILK,12).
					add(weapons.SCIMTR0, 1).
					add(armors.BEEARMR, 1);
			this.wings.type = Wings.IMP_LARGE;
			checkMonster();
		}
		
	}


