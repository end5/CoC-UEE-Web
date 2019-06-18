
	export class Imp extends Monster
	{
		public  defeated(hpVictory: boolean): void
		{
			game.flags[kFLAGS.DEMONS_DEFEATED]++;
			if (hasStatusEffect(StatusEffects.KitsuneFight)) {
				game.forest.kitsuneScene.winKitsuneImpFight();
			} else {
				game.impScene.impVictory();
			}
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if (hasStatusEffect(StatusEffects.KitsuneFight)) {
				game.forest.kitsuneScene.loseKitsuneImpFight();
			} else if (pcCameWorms) {
				outputText("\n\nThe imp grins at your already corrupted state...");
				player.lust = player.maxLust();
				doNext(game.impScene.impRapesYou);
			} else {
				game.impScene.impRapesYou();
			}
		}
		
		protected  lustMagicAttack(): void {
			outputText("You see " + a + short + " make sudden arcane gestures at you!\n\n");
		var  lustDmg: number = player.lib / 10 + player.cor / 10 + 10;
			if (player.lust100 < 30) outputText("You feel strangely warm.  ");
			if (player.lust100 >= 30 && player.lust100 < 60) outputText("Blood rushes to your groin as a surge of arousal hits you, making your knees weak.  ");
			if (player.lust100 >= 60) outputText("Images of yourself fellating and fucking the imp assault your mind, unnaturally arousing you.  ");
			if (player.cocks.length > 0) {
				if (player.lust100 >= 60)
					outputText("You feel your " + player.multiCockDescriptLight() + " dribble pre-cum.");
				else if (player.lust100 >= 30 && player.cocks.length == 1)
					outputText("Your " + player.cockDescript(0) + " hardens, distracting you further.");
				else if (player.lust100 >= 30 && player.cocks.length > 1)
					outputText("Your " + player.multiCockDescriptLight() + " harden uncomfortably.");
				if (player.hasVagina()) outputText("  ");
			}
			if (player.lust100 >= 60 && player.hasVagina()) {
				switch (player.vaginas[0].vaginalWetness) {
					case Vagina.WETNESS_NORMAL:
						outputText("Your " + player.allVaginaDescript() + " dampen" + (player.vaginas.length > 1 ? "" : "s") + " perceptibly.");
						break;
					case Vagina.WETNESS_WET:
						outputText("Your crotch becomes sticky with girl-lust.");
						break;
					case Vagina.WETNESS_SLICK:
						outputText("Your " + player.allVaginaDescript() + " become" + (player.vaginas.length > 1 ? "" : "s") + " sloppy and wet.");
						break;
					case Vagina.WETNESS_DROOLING:
						outputText("Thick runners of girl-lube stream down the insides of your thighs.");
						break;
					case Vagina.WETNESS_SLAVERING:
						outputText("Your " + player.allVaginaDescript() + " instantly soak" + (player.vaginas.length > 1 ? "" : "s") + " your groin.");
						break;
					default: //Dry vaginas are unaffected
						
				}
			}
			player.takeLustDamage(lustDmg, true);
			if (player.lust >= player.maxLust())
				doNext(game.combat.endLustLoss);
			else doNext(game.playerMenu);
		}
		
		public  Imp(noInit: boolean=false)
		{
			if (noInit) return;
			//trace("Imp Constructor!");
			this.a = "the ";
			this.short = "imp";
			this.imageName = "imp";
			this.long = "An imp is short, only a few feet tall.  An unkempt mane of shaggy black hair hangs from his head, parted by two short curved horns.  His eyes are solid black, save for tiny red irises which glow with evil intent.  His skin is bright red, and unencumbered by clothing or armor, save for a small loincloth at his belt.  His feet are covered by tiny wooden sandals, and his hands tipped with sharp claws.  A pair of tiny but functional wings occasionally flap from his back.";
			this.race = "Imp";
			// this.plural = false;
			this.createCock(rand(2) + 11, 2.5, CockTypesEnum.DEMON);
			this.balls = 2;
			this.ballSize = 1;
			createBreastRow(0);
			this.ass.analLooseness = Ass.LOOSENESS_STRETCHED;
			this.ass.analWetness = Ass.WETNESS_NORMAL;
			this.tallness = rand(24) + 25;
			this.hips.rating = Hips.RATING_BOYISH;
			this.butt.rating = Butt.RATING_TIGHT;
			this.skin.tone = "red";
			this.hair.color = "black";
			this.hair.length = 5;
			initStrTouSpeInte(20, 10, 25, 12);
			initLibSensCor(45, 45, 100);
			this.weaponName = "claws";
			this.weaponVerb="claw-slash";
			this.armorName = "leathery skin";
			this.lust = 40;
			this.temperment = TEMPERMENT_LUSTY_GRAPPLES;
			this.level = 1;
			this.gems = rand(5) + 5;
			this.drop = new WeightedDrop().
					add(consumables.SUCMILK,3).
					add(consumables.INCUBID,3).
					add(consumables.IMPFOOD, 4).
					add(shields.WOODSHL, 1);
			this.special1 = lustMagicAttack;
			this.wings.type = Wings.IMP;
			checkMonster();
		}

	}


