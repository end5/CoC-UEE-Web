
	export class DemonPack extends Monster
	{


		protected  performCombatAction(): void
		{
			//Demon pack has different AI
			if (rand(2) == 0)
				special1();
			else special2();
		}

		public  defeated(hpVictory: boolean): void
		{
			clearOutput();
			if (hpVictory) {
				outputText("You strike out and the last of the demons tumbles to the ground with a thud. You stand there for a second surrounded by dead or unconscious demons feeling like a god of battle. Then you realize that if a god of battle does exist he lives on a demonic plane like this, so to avoid insulting him you take your hands off your hips and your " + player.legs() + " off the head of the demon leader before you start to search the bodies.");
				game.dynStats("lus", 1);
			} else {
				outputText("The demons stop attacking, and reach out to touch your body. Some are already masturbating like it's the only thing in the world and you know that right now, if you wanted to, you could make each and every one of them fuck you.");
			}
			if (hasStatusEffect(StatusEffects.phyllafight)) {
				doNext(game.desert.antsScene.consolePhylla);
			} else if (hpVictory || flags[kFLAGS.SFW_MODE] > 0){
				game.combat.cleanupAfterCombat();
			} else {
				outputText("  Do you rape them?");
				kGAMECLASS.output.doYesNo(rapeDemons, game.combat.cleanupAfterCombat);
			}
		}

		private  rapeDemons(): void{
			clearOutput();
			outputText("You open your arms and step into the throng of eager demons. They jump eagerly to touch you, becoming more and more lust-frenzied every second. You take the nearest demon and throw it to the ground and without a moment's thought the rest of the group leap to join you in a thoughtless madness of lust...");
			doNext(game.desert.oasis.oasisSexing);
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			clearOutput();
			if (player.gender == 0){
				if (hpVictory) {
					outputText("You collapse before the demons, who laugh at your utter lack of male or female endowments, beating you until you pass out.");
				} else {
					outputText("You offer yourself to the demons, who promptly begin laughing at your lack of endowments.  They fall on you as one, beating you into unconsciousness.");
				}
				game.combat.cleanupAfterCombat();
			} else if (flags[kFLAGS.SFW_MODE] > 0) {
				outputText("Because SFW mode is enabled, this scene is disabled.");
				game.combat.cleanupAfterCombat();
			} else if (hpVictory){
				outputText("The demons finally beat you down and you collapse onto the sand of the oasis. Almost immediately you feel demonic hands pressing and probing your prone form. You hear the leader of the group say something in a strange tongue but you have a feeling you know what it means. The demons dive onto your inert body with intent and begin to press themselves against you...");
				doNext(game.desert.oasis.oasisSexing);
			} else {
				outputText("You struggle to keep your mind on the fight and fail to do so. ");
				if (pcCameWorms){
					outputText("\n\nThe demons joke and smile, obviously unconcerned with your state.\n\n");
				}
				if (player.cocks.length > 0) {
					if (player.cockTotal() > 1) outputText("Each of y");
					else outputText("Y");
					outputText("our " + player.multiCockDescriptLight() + " throbs ");
					if (player.hasVagina()) outputText(" and your ");
				}
				if (player.vaginas.length > 0) {
					if (!player.hasCock()) outputText("Your ");
					outputText(player.vaginaDescript(0) + " burns ");
				}
				outputText("with arousal.  You make a grab for the nearest demon and catch a handful of jiggly breast. You try desperately to use your other arm to pull her closer to slake your thirst but you both go tumbling to the ground. The demonic leader laughs out loud and the rest of the tribe falls on you, grabbing for anything it can find.");
				doNext(game.desert.oasis.oasisSexing);
			}
		}


		public  teased(lustDelta: number): void
		{
			outputText("\n");
			if (lustDelta == 0) outputText("\n" + capitalA + short + " seems unimpressed.");
			else if (lustDelta > 0 && lustDelta < 5) outputText("The demons lessen somewhat in the intensity of their attack, and some even eye up your assets as they strike at you.");
			else if (lustDelta >= 5 && lustDelta < 10) outputText("The demons are obviously steering clear from damaging anything you might use to fuck and they're starting to leave their hands on you just a little longer after each blow. Some are starting to cop quick feels with their other hands and you can smell the demonic lust of a dozen bodies on the air.");
			else if (lustDelta >= 10) outputText("The demons are less and less willing to hit you and more and more willing to just stroke their hands sensuously over you. The smell of demonic lust is thick on the air and part of the group just stands there stroking themselves openly.");
			applyTease(lustDelta);
		}

		public  DemonPack()
		{
			//trace("DemonPack Constructor!");
			this.a = "the ";
			this.short = "demons";
			this.imageName = "demonmob";
			this.long= "The group is composed of roughly twenty tan-skinned demons, mostly humanoid in shape with many and varied corruptions across the mob. You see demonic high heels, twisting horns and swinging cocks of all shapes and sizes. There even seems to be a bull head in there somewhere. You also make out plenty of breasts ranging from tiny ones to a pair that requires a second person to carry them, and with those breasts a wide range of pussies, dripping and dry, sometimes nestled below some form of demonic dick.  The small tribe carries no weapons and what little clothing they wear is well-shredded, except for one hefty male wearing a cloak of what appears to be snakeskin across his broad shoulders." + (game.silly() ? "  You spot an odd patch that reads, \"<i>41st Engineer Company: Vaginal Clearance</i>\" on his shoulder." : "");
			this.race = "Demons";
			this.plural = true;
			this.pronoun1 = "they";
			this.pronoun2 = "them";
			this.pronoun3 = "their";
			this.createCock(18,2);
			this.createCock(18,2,CockTypesEnum.DEMON);
			this.balls = 2;
			this.ballSize = 1;
			this.cumMultiplier = 3;
			// this.hoursSinceCum = 0;
			this.createVagina(false, Vagina.WETNESS_SLICK, Vagina.LOOSENESS_LOOSE);
			createBreastRow(0);
			this.ass.analLooseness = Ass.LOOSENESS_STRETCHED;
			this.ass.analWetness = Ass.WETNESS_SLIME_DROOLING;
			this.tallness = rand(8) + 70;
			this.hips.rating = Hips.RATING_AMPLE+2;
			this.butt.rating = Butt.RATING_LARGE;
			this.skin.tone = "red";
			this.hair.color = "black";
			this.hair.length = 15;
			initStrTouSpeInte(80, 10, 10, 5);
			initLibSensCor(50, 60, 80);
			this.weaponName = "claws";
			this.weaponVerb="claw";
			this.armorName = "demonic skin";
			this.bonusHP = 200;
			this.lust = 30;
			this.temperment = TEMPERMENT_LOVE_GRAPPLES;
			this.level = 6;
			this.gems = rand(25) +10;
			this.drop = new WeightedDrop().addMany(1,
							consumables.SUCMILK,
							consumables.INCUBID,
							consumables.OVIELIX,
							consumables.B__BOOK);
			this.special1 = game.combat.packAttack;
			this.special2 = game.combat.lustAttack;
			this.tail.type = Tail.DEMONIC;
			this.horns.type = Horns.DEMON;
			this.horns.value = 2;
			checkMonster();
		}

	}


