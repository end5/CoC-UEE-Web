
	export class MinotaurKing extends Monster {
		private  _milkDrinks: number = 0;
		private  _orgasms: number = 0;
		private  _lastRoundStun: boolean = false;
		private  _lastSpellCastCount: number;

		public  MinotaurKing() {
			super();
			this.a = "the ";
			this.short = "minotaur king";
			this.long = "";
			this.race = "Minotaur";
			this.tallness = 12 * 14;
			this.createCock(24,5,CockTypesEnum.HORSE);
			this.createBreastRow(0);
			this.balls = 2;
			this.ballSize = 4;
			this.hoursSinceCum = 9999;
			this.horns.type = Horns.COW_MINOTAUR;
			this.horns.value = 24;
			this.tail.type = Tail.COW;
			this.hips.rating = Hips.RATING_SLENDER;
			this.butt.rating = Butt.RATING_TIGHT;
			initStrTouSpeInte(100,100,50,60);
			initLibSensCor(66,10,100);
			this.weaponName = "axe";
			this.weaponAttack = 50;
			this.weaponVerb = "swing";
			this.armorName = "rags";
			this.armorDef = 60;
			this.bonusHP = 850;
			this.gems = 75 + rand(50);
			this.level = 22;
			this.lustVuln = 0.05;
			this.additionalXP = 200;
			this.drop = NO_DROP;
			drop = new WeightedDrop(consumables.PROMEAD,1);
			this.checkMonster();
			this._lastSpellCastCount = flags[kFLAGS.SPELLS_CAST];
		}

		public  get long(): string {
		var  str: any = undefined;
			if (!_orgasms == 0) {
				str = "Positioned between you and the Demon Queen is an opponent of singular size and stature - the Minotaur King. He is a beast beyond measure, covered in shaggy fur and a few scraps of leather that do nothing to hide the pillar of flared cuntplow between his legs. In his hands is a gigantic axe, though he seems loathe to use it, preferring to rely on the erotic scent emanating from between his legs. He smells virile, strong, and more alluring than you’d expect. You’d best be careful not to dwell on it.";
			}
			else {
				str = "Still standing between you and the Demon Queen, the Minotaur King is breathing heavily. His cock is slathered with the residue of his own potent orgasm. His immense, 14 foot tall form hunches slightly as he stares at you, one hand still clutching to his axe. Driving him back to his peak would undoubtedly push him even beyond his considerable endurance. The only problem is that alluring <i>aroma</i> that surrounds him, suffusing the air with the scent of sweaty bedroom romps and sizzling pleasure. You better finish him quick.";
				if (lust100 < 40)
					str += "\n\nBeneath his legs is a favorite slut, Excellia by name. She stays just out of his way, showcasing the curvaceous nature of her figure and the ripeness of her sex, occasionally running her fingers across a strange tattoo laid upon her belly. You’d best keep your attentions on the fight ahead.";
				else if (lust100 < 80)
					str += "\n\nBeneath his legs is the fallen form of his favored slut, Excellia. He steps carefully around the insensate cow-girl but never lets her out of arm’s reach, his eyes flicking to the moistness of her sex from time to time.";
				else 
					str += "\n\nBeneath his legs is the creampied form of his favored slut, Excellia. Milk-white cum puddles between her spread legs, matched only by the sheen of leaking lactose on her lewdly-jutting nipples. Her lord never lets her fallen form out of arm’s reach, just in case he needs a drink.";
				if (_milkDrinks != 0) {
					if (_milkDrinks == 1)
						 str += "\n\n<b>The King has been glancing appreciatively in your direction ever since he took a drink from his slave-slut’s nipples. Perhaps he’s more vulnerable to baser needs...</b>";
					else if (_milkDrinks < 10)
						 str += "\n\n<b>The King’s nostrils flare as he stares at you. It’s clear that with every drink he takes from his slave-slut’s nipples, he becomes more receptive to your advances.</b>";
					else str += "\n\n<b>The King's belly looks swollen, clearly full of the milk of his slut. It looks like he won't be able to drink any more milk.</b>";
				}
			}
			if (game.monster2 != undefined && game.monster2.HP <= 0) {
				str += "\n\n<b>Excellia appears to be unconscious due to the injuries you've inflicted to her. It looks like the minotaur won't be able to drink any more milk.</b>";
			}
			return str;
		}

		public  defeated(hpVictory: boolean): void {
			if (_orgasms == 0 && !hpVictory) {
				lustDump();
				combatRoundOver();
				return;
			}
			if (hpVictory && _milkDrinks < 10 && game.monster2.HP > 0) {
				hpRestore();
				combatRoundOver();
				return;
			}
			game.lethicesKeep.minotaurKing.theKingIsDeadLongLiveTheKing(hpVictory);
		}
		public  won(hpVictory: boolean, pcCameWorms: boolean): void { game.lethicesKeep.minotaurKing.hailToTheKingBaby(hpVictory,pcCameWorms); }

		public  get orgasms(): number { return _orgasms; }

		protected  performCombatAction(): void {
		var  atks: any[] = undefined;
			if (_lastRoundStun) {
				_lastRoundStun = false;
				if (player.hasStatusEffect(StatusEffects.Stunned)) {
					dickslap();
					return;
				}
			}
			if (_lastSpellCastCount != flags[kFLAGS.SPELLS_CAST]) {
				_lastSpellCastCount = flags[kFLAGS.SPELLS_CAST];
				headbutt();
			}
			else {
				atks = [backhand,battleaxe,minoPheromones];
				atks[rand(atks.length)]();
			}
			combatRoundOver();
		}

		private  backhand(): void {
			outputText("Feinting with his axe, the Minotaur King flings a powerful backhand in your direction.");
		var  damage: number = str + weaponAttack - rand(player.tou);
		var  evade: string = player.getEvasionReason();
			if (damage <= 0 || evade === EVASION_SPEED || evade === EVASION_FLEXIBILITY || evade === EVASION_UNHINDERED)
				outputText(" Luckily, you dodge aside.");
			else if (evade === EVASION_EVADE)
				outputText(" Luckily, you evade.");
			else if (evade === EVASION_MISDIRECTION)
				outputText(" Luckily, you misdirect his attack.");
			else {
				outputText(" Damn, that hurts! ");
				damage = player.takeDamage(damage, true);
			}
		}

		private  headbutt(): void {
			outputText("<i>“Settle down,”</i> the brute growls, moments before attempting to slam his forehead into your own.");
		var  damage: number = (((str + weaponAttack) / 2) - rand(player.tou)) * (1 + (player.newGamePlusMod() * 0.3));
		var  evade: string = player.getEvasionReason();
			if (damage <= 0 || evade == EVASION_SPEED || evade == EVASION_FLEXIBILITY || evade == EVASION_UNHINDERED)
				outputText(" Luckily, you dodge aside.");
			else if (evade == EVASION_EVADE)
				outputText(" Luckily, you evade.");
			else if (evade == EVASION_MISDIRECTION)
				outputText(" Luckily, you misdirect his attack.");
			else {
				_lastRoundStun = true;
				outputText(" He impacts with stunning force, leaving you reeling! ");
				damage = player.takeDamage(damage, true);
				if (player.findPerk(PerkLib.Resolute) < 0) {
					outputText(" <b>You're left stunned by the force of the blow!</b>");
					player.createStatusEffect(StatusEffects.Stunned,0,0,0,0);
				}
			}
		}

		private  dickslap(): void {
			outputText("Before you can completely regain your wits, the brute is on you, easily holding your hand in one hand while he none-too-gently smacks his cock into your face, dragging his musky member back and forth across your cheeks before finally breaking contact.");
			if (_orgasms > 0) {
				outputText(" Strands of his");
				if (player.findPerk(PerkLib.MinotaurCumAddict) >= 0)
					 outputText(" god-like");
				outputText(" spunk hang from your nose until your tongue lashes out to collect them.");
				if (player.findPerk(PerkLib.MinotaurCumAddict) >= 0)
					 outputText(" Delicious.");
				else outputText(" Why did you do that? And why did it feel so good.");
			}
			player.takeLustDamage(15 + player.lib / 20, true);
		}

		private  battleaxe(): void {
			outputText("The Minotaur King carries his axe as if it weighed no more than a feather, brandishing it back and forth with such casual movements that you barely register his swing");
		var  damage: number = str + weaponAttack - rand(player.tou);
			if (damage <= 0 || player.getEvasionRoll())
				outputText(" in time to avoid it.");
			else {
				outputText(". By the time you notice, it’s too late. ");
				damage = player.takeDamage(damage, true);
			}
		}

		private  hpRestore(): void {
			HP = maxHP();
			lustVuln += 0.15;
			lust += 2;
			_milkDrinks++;
			outputText("Staggering back, the King wastes no time in appropriating his willing slave, lifting her up to his face as easily as one might heft a stein of fresh-brewed beer. One of her huge tits easily fits against the oversized minotaur’s lips, and you see him noisily gulping down a quick, milky pick-me-up. By the time he finishes, his wounds are closing, but his cock is twitching and leaking pre-cum like water from a sieve.");
			outputText("\n\n<b>He looks like he’d be easier to arouse. Whatever’s in her milk may restore his wounds, but leave him vulnerable to his animalistic needs.</b>");
			if (_milkDrinks >= 10) outputText("\n\n<b>It looks like the King's belly has completely swollen, too full to take any more milk.</b>");
		}

		private  minoPheromones(): void {
			outputText("The minotaur smiles at you and lifts his loincloth, flicking it at you.  Thick ropes of pre-cum fly through the air, ");
			if (rand(3) == 0) {
				outputText("slapping into your face before you can react!  You wipe the slick snot-like stuff out of your eyes and nose, ");
				if (player.lust100 > 75) {
					outputText("swallowing it into your mouth without thinking.  ");
					player.takeLustDamage(15 + player.lib / 10, true);
				}
				else {
					outputText("feeling your heart beat with desire as your tongue licks the residue from your lips.  ");
					player.takeLustDamage(7.5 + player.lib / 20, true);
				}
			}
			else outputText("right past your head.  ");
			outputText("The animalistic scent of it seems to get inside you, the musky aroma burning a path of liquid heat to your groin.");
			player.takeLustDamage(15 + player.lib / 20, true);
			if (player.findPerk(PerkLib.MinotaurCumAddict) >= 0 || flags[kFLAGS.MINOTAUR_CUM_ADDICTION_STATE] >= 2) {
				if (rand(2) == 0)
					 outputText("\n<b>You shiver with need, wanting nothing more than to bury your face under that loincloth and slurp out every drop of goopey goodness.</b>");
				else outputText("\n<b>You groan and lick your lips over and over, craving the taste of him in your mouth.</b>");
				player.takeLustDamage(5 + rand(5), true);
			}
		}

		public  lustDump(): void {
			_orgasms++;
			outputText("The incredibly-aroused minotaur staggers, then looks down at the log of tumescence between his legs. It’s twitching, bouncing in the air with every beat of his heart. It must ache to be that hard, to be so full of lust it looks ready to erupt. One of his hands reaches toward it, and he drops to one knee. Have you done it? Have you defeated the brute once and for all?");
			outputText("\n\nA monstrous hand closes around Excellia’s torso, lifting her into the air. The curvy cow-slut does the only thing she can in such a situation - she moos and spreads her legs, a gleeful smile plastered across her excited visage. The Minotaur King doesn’t wait a second, impaling her on the spot, sliding what looks like three feet of virile cock deep into his favorite slut. His balls slap against her bulging belly once he’s fully inside, getting a coating of pussy-juice for their trouble.");
			outputText("\n\nThe brute fucks her casually, using her like little more than a super-sized sex-toy. Every sheath-hilting clap of hips to ass sends jiggles through the nubile slave. Flecks of pussy-juice and pre-cum froth around the entrance to her gaped cunt while stray droplets slick the floor below. It’s a bestial mating, the kind that leaves no room for words on either partner’s face. The kind that has the cow-girl quivering and shaking in the throes of indescribable ecstasy, rendered incapable of something as simple as moaning.");
			outputText("\n\nExcellia’s master joins her a second later. There’s little change in the sound of his grunts. You wouldn’t even know if it wasn’t for the sudden ballooning of her belly and the cascade of cum between her legs, coating her lord’s legs in a veneer of lusty white. The amount of spunk is absolutely gobsmacking. You watch in awe as Excellia’s formerly taut belly stretches into a gravid dome. She looks like she could give birth any moment now, yet there’s nothing in her womb but gallon upon gallon of tainted minotaur spunk.");
			if (player.findPerk(PerkLib.MinotaurCumAddict) >= 0)
				outputText(" You’re jealous. All that cum must feel exquisite!");
			outputText("\n\nWhatever spell this forceful mating cast, it breaks the moment Excellia slides off her lord’s still-hard phallus. You close your mouth and ready your grip on your [weapon] as the Minotaur King straightens, breathing heavily. He looks a little woozy for the effort, but still good to fight. Maybe if you can bring him back to the peak, he’ll fall for good?");
			lust = 0;
			game.monster2.lust = 50;
		}

		protected  handleStun(): boolean {
			outputText("It only takes the muscled monarch a moment to recover from the stun. It looks like he’s too much of a juggernaught to be stopped by those kinds of hits. ");
			removeStatusEffect(StatusEffects.Stunned);
			return true;
		}
	}

