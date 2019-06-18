
	export class Naga extends Monster
	{

		//2a)  Ability -  Poison Bite - poisons player
		protected  nagaPoisonBiteAttack(): void {
			//(Deals damage over 4-5 turns, invariably reducing 
			//your speed. It wears off once combat is over.)
			outputText("The naga strikes with the speed of a cobra, sinking her fangs into your flesh!  ");
		var  venom:NagaVenomDebuff = player.statusEffectByType(StatusEffects.NagaVenom) as NagaVenomDebuff;
			if (!venom) {
				outputText("The venom's effects are almost instantaneous; your vision begins to blur and it becomes increasingly harder to stand.");
				player.addStatusEffect(new NagaVenomDebuff());
			}
			else {
				outputText("The venom's effects intensify as your vision begins to blur and it becomes increasingly harder to stand.");
				venom.increase();
			}
			combatRoundOver();
		}
		
		//2b)  Ability - Constrict - entangles player, raises lust 
		//every turn until you break free
		protected  nagaConstrict(): void {
			outputText("The naga draws close and suddenly wraps herself around you, binding you in place! You can't help but feel strangely aroused by the sensation of her scales rubbing against your body. All you can do is struggle as she begins to squeeze tighter!");
			player.createStatusEffect(StatusEffects.NagaBind,0,0,0,0); 
			if (player.findPerk(PerkLib.Juggernaut) < 0 && armorPerk != "Heavy") {player.takeDamage(2+rand(4));
			}
			combatRoundOver();
		}
		
		//2c) Abiliy - Tail Whip - minus ??? HP 
		//(base it on toughness?)
		protected  nagaTailWhip(): void {
			outputText("The naga tenses and twists herself forcefully.  ");
			//[if evaded]
			if ((player.findPerk(PerkLib.Evade) && rand(6) == 0)) {
				outputText("You see her tail whipping toward you and evade it at the last second. You quickly roll back onto your feet.");
			}
			else if (player.findPerk(PerkLib.Misdirection) >= 0 && rand(100) < 10 && player.armorName == "red, high-society bodysuit") {
				outputText("Using Raphael's teachings and the movement afforded by your bodysuit, you anticipate and sidestep " + a + short + "'s tail-whip.");
			}
			else if (player.spe > rand(300)) {
				outputText("You see her tail whipping toward you and jump out of the way at the last second. You quickly roll back onto your feet.");
			}
			else {
				outputText("Before you can even think, you feel a sharp pain at your side as the naga's tail slams into you and shoves you into the sands. You pick yourself up, wincing at the pain in your side. ");
			var  damage: number = 10;
				if (player.armorDef < 10) damage += 10 - player.armorDef;
				damage += rand(3);
				damage = player.takeDamage(damage, true);
			}
			combatRoundOver();
		}
		
		public  defeated(hpVictory: boolean): void
		{
			game.desert.nagaScene.nagaRapeChoice();
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if (pcCameWorms){
				outputText("\n\nThe naga's eyes go wide and she turns to leave, no longer interested in you.");
				player.orgasm('Generic');
				doNext(game.combat.cleanupAfterCombat);
			} else {
				game.desert.nagaScene.nagaFUCKSJOOOOOO();
			}
		}

		public  Naga(noInit: boolean = false)
		{
			if (noInit) return;
			//trace("Naga Constructor!");
			this.a = "the ";
			this.short = "naga";
			this.imageName = "naga";
			this.long = "You are fighting a naga. She resembles a beautiful and slender woman from the waist up, with dark hair hanging down to her neck. Her upper body is deeply tanned, while her lower body is covered with shiny scales, striped in a pattern reminiscent of the dunes around you. Instead of bifurcating into legs, her hips elongate into a snake's body which stretches far out behind her, leaving a long and curving trail in the sand.  She's completely naked, with her round C-cup breasts showing in plain sight. In her mouth you can see a pair of sharp, venomous fangs and a long forked tongue moving rapidly as she hisses at you.";
			this.race = "Naga";
			// this.plural = false;
			this.createVagina(false, Vagina.WETNESS_SLAVERING, Vagina.LOOSENESS_NORMAL);
			this.createStatusEffect(StatusEffects.BonusVCapacity, 40, 0, 0, 0);
			createBreastRow(Appearance.breastCupInverse("C"));
			this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
			this.ass.analWetness = Ass.WETNESS_DRY;
			this.createStatusEffect(StatusEffects.BonusACapacity,10,0,0,0);
			this.tallness = 5*12+10;
			this.hips.rating = Hips.RATING_AMPLE+2;
			this.butt.rating = Butt.RATING_LARGE;
			this.lowerBody.type = LowerBody.NAGA;
			this.skin.tone = "mediterranean-toned";
			this.hair.color = "brown";
			this.hair.length = 16;
			initStrTouSpeInte(28, 20, 35, 42);
			initLibSensCor(55, 55, 40);
			this.weaponName = "fist";
			this.weaponVerb="punch";
			this.weaponAttack = 3;
			this.armorName = "scales";
			this.armorDef = 5;
			this.lust = 30;
			this.temperment = TEMPERMENT_RANDOM_GRAPPLES;
			this.level = 2;
			this.gems = rand(5) + 8;
			this.drop = new WeightedDrop().
					add(undefined,1).
					add(consumables.REPTLUM,5).
					add(consumables.SNAKOIL, 4).
					add(armors.NAGASLK,1);
			this.special1 = nagaPoisonBiteAttack;
			this.special2 = nagaConstrict;
			this.special3 = nagaTailWhip;
			checkMonster();
		}

	}


