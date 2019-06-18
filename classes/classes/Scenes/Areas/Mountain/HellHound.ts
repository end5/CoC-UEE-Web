
	export class HellHound extends Monster
	{
		protected  hellhoundFire(): void {
			//Blind dodge change
			if(hasStatusEffect(StatusEffects.Blind)) {
				outputText(capitalA + short + " completely misses you with a wave of dark fire! Thank the gods it's blind!");
				combatRoundOver();
				return;
			}
			/*if(player.hasStatusEffect(StatusEffects.Web_dash_Silence)) {
				outputText("You reach inside yourself to breathe flames, but as you ready to release a torrent of fire, it backs up in your throat, blocked by the webbing across your mouth.  It causes you to cry out as the sudden, heated force explodes in your own throat.\n");
				changeFatigue(10);
				takeDamage(10+rand(20));
				monster.doAI();
				return;
			}*/
			if(player.findPerk(PerkLib.Evade) >= 0 && player.spe >= 35 && rand(3) != 0) {
				outputText("Both the hellhound's heads breathe in deeply before blasting a wave of dark fire at you.  You easily avoid the wave, diving to the side and making the most of your talents at evasion.");
			}
			else if(player.findPerk(PerkLib.Misdirection) >= 0 && rand(100) < 20 && player.armorName == "red, high-society bodysuit") {
				outputText("Using Raphael's teachings and the movement afforded by your bodysuit, you anticipate and sidestep " + a + short + "'s fire.\n");
			}
			else if(player.findPerk(PerkLib.Flexibility) >= 0 && player.spe > 30 && rand(10) != 0) {
				outputText("Both the hellhound's heads breathe in deeply before blasting a wave of dark fire at you.  You twist and drop with incredible flexibility, watching the fire blow harmlessly overhead.");
			}
			else {
				//Determine the damage to be taken
			var  temp: number = 15 + rand(10);
				outputText("Both the hellhound's heads breathe in deeply before blasting a wave of dark fire at you. While the flames don't burn much, the unnatural heat fills your body with arousal. ");
				player.takeDamage(temp, true);
				player.takeLustDamage(20+(player.sens/10), true);
				statScreenRefresh();
				if(player.HP <= 0) {
					doNext(game.combat.endHpLoss);
					return;
				}
				if(player.lust >= player.maxLust()) {
					doNext(game.combat.endLustLoss);
					return;
				}		
			}
			doNext(game.playerMenu);
		}
		protected  hellhoundScent(): void {
			if(player.hasStatusEffect(StatusEffects.NoFlee)) {
				if(spe == 100) {
					hellhoundFire();
					return;
				}
				else {
					outputText("The hellhound sniffs your scent again, seemingly gaining more and more energy as he circles faster around you.");
					spe = 100;	
				}
			}
			else {
				spe += 40;
				outputText("The hellhound keeps his four eyes on you as he sniffs the ground where you were moments ago. He raises his heads back up and gives you a fiery grin - he seems to have acquired your scent!  It'll be hard to get away now...");
				player.createStatusEffect(StatusEffects.NoFlee,0,0,0,0);
			}
			combatRoundOver();
		}
		

		public  defeated(hpVictory: boolean): void
		{
			clearOutput();
			if (hpVictory) {
				outputText("The hellhound's flames dim and the heads let out a whine before the creature slumps down, defeated and nearly unconscious.");
			} else {
				outputText("Unable to bear hurting you anymore, the hellhound's flames dim as he stops his attack. The two heads look at you, whining plaintively.  The hellhound slowly pads over to you and nudges its noses at your crotch.  It seems he wishes to pleasure you.\n\n");
			}
			kGAMECLASS.output.menu();
			
			kGAMECLASS.output.addButtonDisabled(0, "Fuck it", "Ride his twin cocks. This scene requires you to have vagina and sufficient arousal. This scene can not accommodate naga body.");
			kGAMECLASS.output.addButtonDisabled(1, "Lick", "Make him use his tongues. This scene requires you to have genitals and sufficient arousal. This scene requires lust victory.");
			
			if (player.lust >= 33 && !player.isGenderless()) {
				if (player.hasVagina() && !player.isNaga()) {
					kGAMECLASS.output.addButton(0, "Fuck it", game.mountain.hellHoundScene.hellHoundPropahRape).hint("Those twin knotted cocks look so rather tantalizing. Ride his twin cocks.");
				}
				if (!hpVictory) {
					kGAMECLASS.output.addButton(1, "Lick", game.mountain.hellHoundScene.hellHoundGetsRaped).hint("Make him use his tongues. Two heads are better than one, so to speak.");
				}
			}
			
			kGAMECLASS.output.addButton(14, "Leave", game.combat.cleanupAfterCombat);
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if(pcCameWorms){
				outputText("\n\nThe hellhound snorts and leaves you to your fate.");
				doNext(game.combat.cleanupAfterCombat);
			} else {
				game.mountain.hellHoundScene.hellhoundRapesPlayer();
			}
		}

		public  HellHound(noInit: boolean=false)
		{
			if (noInit) return;
			//trace("HellHound Constructor!");
			this.a = "the ";
			this.short = "hellhound";
			this.imageName = "hellhound";
			this.long = "It looks like a large demon on all fours with two heads placed side-by-side. The heads are shaped almost like human heads, but they have dog ears on the top and have a long dog snout coming out where their mouths and noses would be.  Its eyes and mouth are filled with flames and its hind legs capped with dog paws, but its front ones almost look like human hands.  Its limbs end in large, menacing claws. A thick layer of dark fur covers his entire body like armor.  Both heads look at you hungrily as the hellhound circles around you. You get the feeling that reasoning with this beast will be impossible.";
			this.race = "Hellhound";
			// this.plural = false;
			this.createCock(8,2,CockTypesEnum.DOG);
			this.createCock(8,2,CockTypesEnum.DOG);
			this.balls = 2;
			this.ballSize = 4;
			this.cumMultiplier = 5;
			// this.hoursSinceCum = 0;
			this.createBreastRow();
			this.createBreastRow();
			this.createBreastRow();
			this.ass.analLooseness = Ass.LOOSENESS_NORMAL;
			this.ass.analWetness = Ass.WETNESS_NORMAL;
			this.tallness = 47;
			this.hips.rating = Hips.RATING_AVERAGE;
			this.butt.rating = Butt.RATING_AVERAGE+1;
			this.lowerBody.type = LowerBody.DOG;
			this.skin.tone = "black";
			this.skin.setType(Skin.FUR);
			this.hair.color = "red";
			this.hair.length = 3;
			initStrTouSpeInte(55, 60, 40, 1);
			initLibSensCor(95, 20, 100);
			this.weaponName = "claws";
			this.weaponVerb="claw";
			this.weaponAttack = 10;
			this.armorName = "thick fur";
			this.lust = 25;
			this.temperment = TEMPERMENT_LOVE_GRAPPLES;
			this.level = 5;
			this.gems = 10+rand(10);
			this.drop = new WeightedDrop()
					.add(consumables.CANINEP, 6)
					.add(consumables.WOLF_PP, 1)
					.addMany(2,
						consumables.BULBYPP,
						consumables.KNOTTYP,
						consumables.BLACKPP,
						consumables.DBLPEPP,
						consumables.LARGEPP);
			this.tail.type = Tail.DOG;
			this.special1 = hellhoundFire;
			this.special2 = hellhoundScent;
			checkMonster();
		}

	}


