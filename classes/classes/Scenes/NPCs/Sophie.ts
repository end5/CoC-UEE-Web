
	/**
	 * ...
	 * @author Fake-Name
	 */


	export class Sophie extends Harpy
	{
		//Combat Attacks
		//ON DICK'ED PCz
		//Kiss (Only used on males) - +10 lust on kiss.  25% chance
		//per round of increasing lust by 20.  Repeat kisses add
		//+20 lust.  Each kiss adds 2 hours to length of status
		//affect.
		private  sophieKissAttack(): void {
			game.sophieBimbo.sophieSprite();
			outputText("Sophie bobs and weaves as she closes the distance between you in an instant.  ");
			//Blind dodge change
			if (hasStatusEffect(StatusEffects.Blind) && rand(3) < 2) {
				outputText(capitalA + short + " looks like she's trying to kiss you, but it's easy to avoid the blind harpy!\n");
				return;
			}
			//Determine if dodged!
			if (player.spe - spe > 0 && int(Math.random()*(((player.spe-spe)/4) +80)) > 80) {
				outputText("Sophie changes direction in a flash, trying to slip inside your guard, but you manage to sidestep the incredibly fast harpy's attack.\n");
				return;
			}
			//Determine if evaded
			if (player.findPerk(PerkLib.Evade) >= 0 && rand(100) < 10) {
				outputText("Using your skills at evading attacks, you anticipate and sidestep " + a + short + "'s attack.\n");
				return;
			}
			if (player.findPerk(PerkLib.Misdirection) >= 0 && rand(100) < 10 && player.armorName == "red, high-society bodysuit") {
				outputText("Using Raphael's teachings and the movement afforded by your bodysuit, you anticipate and sidestep " + a + short + "'s attack.\n");
				return;
			}
			//Determine if cat'ed
			if (player.findPerk(PerkLib.Flexibility) >= 0 && rand(100) < 6) {
				outputText("With your incredible flexibility, you squeeze out of the way of " + a + short + "");
				outputText("'s attack.\n");
				return;
			}
			//YOU GOT HIT SON
			outputText("Before you can react, she gives you a chaste peck on the lips.  The harpy pulls back with a sultry smile, watching you expectantly.");
			
			//Already affected by it
			if (player.hasStatusEffect(StatusEffects.Luststick)) {
				outputText("  Blood rushes to " + player.sMultiCockDesc() + " as you grow so hard so fast that it hurts.  ");
				game.sophieScene.luststickApplication(2);
				player.takeLustDamage(12+player.lib/10, true);
				if (player.lust100 < 70) outputText("The drugged lip-gloss is starting to get to you!\n");
				else if (player.lust100 < 80) outputText("Her curvy thighs look so inviting.  You barely stop yourself before you climb in between them!\n");
				else if (player.lust100 < 90) outputText("A trickle of pre-cum leaks from " + player.sMultiCockDesc() + ".  Sophie coos, \"<i>Why don't you give in and let mommy Sophie drain out all that juicy cum?</i>\"\n");
				else if (player.lust100 < 100) outputText(player.SMultiCockDesc() + " twitches and bounces in time with your heartbeat, practically pulling you towards Sophie's gaping, pink-linked snatch.\n");
				else outputText("So horny.  You need to copulate - no, fuck - right NOW.  Your hand touches your " + player.cockDescript(0) + " and you swoon, pumping your hips lewdly as you submit.\n");
			}
			else {
				outputText("  Your whole body blushes as your lips tingle with some unnatural sensation.  Her lips were drugged!  Your whole body flushes as arousal begins to course through your veins.  ");
				game.sophieScene.luststickApplication(2);
				player.takeLustDamage(8+player.lib/10, true);
				if (player.lust100 < 70) outputText("The drugged lip-gloss is starting to get to you!\n");
				else if (player.lust100 < 80) outputText("Her curvy thighs look so inviting.  You barely stop yourself before you climb in between them!\n");
				else if (player.lust100 < 90) outputText("A trickle of pre-cum leaks from " + player.sMultiCockDesc() + ".  Sophie coos, \"<i>Why don't you give in and let mommy Sophie drain out all that juicy cum?</i>\"\n");
				else if (player.lust100 < 100) outputText(player.SMultiCockDesc() + " twitches and bounces in time with your heartbeat, practically pulling you towards Sophie's gaping, pink-linked snatch.\n");
				else outputText("So horny.  You need to copulate - no, fuck - right NOW.  Your hand touches your " + player.cockDescript(0) + " and you swoon, pumping your hips lewdly as you submit.\n");
			}
		}
		
		//Harpy-Boating (Only used on males)
		//Takes off and flies directly at PC, locking her hips 
		//around PC's torso and smothering the PC with breasts 
		//for a few moments.
		//Easily dodged with evade or flexibility.
		private  sophieHarpyBoatsPC(): void {
			game.sophieBimbo.sophieSprite();
			outputText(capitalA + short + " flaps her wings and launches herself forwards with her talons up.  ");
			//Blind dodge change
			if (hasStatusEffect(StatusEffects.Blind) && rand(3) < 2) {
				outputText(capitalA + short + "'s talons are easy to avoid thanks to her blindness!\n");
				return;
			}
			//Determine if dodged!
			if (player.spe - spe > 0 && int(Math.random()*(((player.spe-spe)/4) +80)) > 80) {
				outputText(a + short + "'s movements are incredibly fast but you manage to sidestep them.\n");
				return;
			}
			//Determine if evaded
			if (player.findPerk(PerkLib.Evade) >= 0 && rand(100) < 60) {
				outputText("Using your skills at evading attacks, you determine " + a + short + " is aiming for your upper body and slide under the attack.\n");
				return;
			}
			if (player.findPerk(PerkLib.Misdirection) >= 0 && rand(100) < 40 && player.armorName == "red, high-society bodysuit") {
				outputText("Using Raphael's teachings and the movement afforded by your bodysuit, you anticipate and sidestep " + a + short + "'s attack.\n");
				return;
			}
			//Determine if cat'ed
			if (player.findPerk(PerkLib.Flexibility) >= 0 && rand(100) < 40) {
				outputText("With your incredible flexibility, you squeeze out of the way of " + a + short + "");
				outputText("'s attack.\n");
				return;
			}
			//YOU GOT HIT SON
			outputText("She hits you hard, nearly bowling you over.  Thankfully, her talons passed to either side of your torso.  They lock together behind your back and your face is pulled tightly into Sophie's smotheringly large mounds!");
			if (rand(2) == 0) outputText("  She jiggles them around you pleasantly and coos, \"<i>Don't fight it baby.  Just let your body do what comes naturally.</i>\"\n");
			else outputText("  She runs her long fingernails through your hair as she whispers, \"<i>Why fight it?  I'll make you feel so good.  Just relax and play with momma Sophie's tits.</i>\"\n");
			player.takeLustDamage(13 + player.sens/10, true);
		}
		
		//Compulsion (Male Only)
		private  sophieCompulsionAttack(): void {
			game.sophieBimbo.sophieSprite();
			outputText("Sophie spreads her thick thighs and slips four fingers into her slippery sex.  She commands, \"<i>Touch yourself for me.  Be a good pet and masturbate for me.</i>\"  ");
			//Autosucceeds if player inte < 40
			//autofails if player inte > 80
			//Player fails:
			if (player.inte < 40 || (player.inte < 80 && rand(40) > (player.inte - 40))) {
				outputText("You moan out loud as your arms move of their own volition.  They reach inside your " + player.armorName + " and stroke " + player.sMultiCockDesc() + ", caress the tip, and continue to fondle you a few moments.");
				outputText("Even after regaining control of your limbs, you're left far more turned on by the ordeal.");
				player.takeLustDamage(15 + player.cor/20 + player.lib/20, true);
			}
			//Player resists
			else {
				outputText("You can feel her words carrying the force of a magical compulsion behind them, but you focus your willpower and overcome it.");
			}
		}
		
		//ON FEMALE PCz
		//Talons (Female Only)
		//High damage attack easily avoided by evade/flexibility.
		private  talonsSophie(): void {
			game.sophieBimbo.sophieSprite();
			outputText("Sophie pulls her leg up, cocking her thigh dangerously.  Look out!  ");
		var  damage: number = 0;
			//Blind dodge change
			if (hasStatusEffect(StatusEffects.Blind) && rand(3) < 2) {
				outputText(capitalA + short + "'s talons are easy to avoid thanks to her blindness!\n");
				return;
			}
			//Determine if dodged!
			if (player.spe - spe > 0 && int(Math.random()*(((player.spe-spe)/4) +80)) > 80) {
				outputText(a + short + "'s tears through the air, but you manage to just barely dodge it.\n");
				return;
			}
			//Determine if evaded
			if (player.findPerk(PerkLib.Evade) >= 0 && rand(100) < 60) {
				outputText("Using your skills at evading attacks, you watch " + a + short + " and deftly sidestep her brutal talons.\n");
				return;
			}
			if (player.findPerk(PerkLib.Misdirection) >= 0 && rand(100) < 30 && player.armorName == "red, high-society bodysuit") {
				outputText("Using Raphael's teachings and the movement afforded by your bodysuit, you anticipate and sidestep " + a + short + "'s attack.\n");
				return;
			}
			//Determine if cat'ed
			if (player.findPerk(PerkLib.Flexibility) >= 0 && rand(100) < 40) {
				outputText("With your incredible flexibility, you squeeze out of the way of " + a + short + "");
				outputText("'s attack.\n");
				return;
			}
			outputText("Her leg lashes forwards, lightning-quick, and tears bloody gashes into your " + player.skin.desc + " with her razor-sharp talons! ");
			//Determine damage - str modified by enemy toughness!
			damage = int((str + weaponAttack) - Math.random()*(player.tou) - player.armorDef);
			if (damage < 0) damage = 0;
			damage += 40;
			damage = player.takeDamage(damage);
			outputText("(" + damage + ")\n");
			
		}
		//Batter (Female Only)
		//Batters PC with wings – 4x attack impossible to dodge.*/
		private  batterAttackSophie(): void {
			game.sophieBimbo.sophieSprite();
		var  damage: number = 0;
			outputText("Sophie comes at you in a flurry of beating wings!  There's no way to dodge the flurry of strikes!\n");
			
			//Determine damage - str modified by enemy toughness!
			damage = int((str) - Math.random()*(player.tou) - player.armorDef);
			if (damage < 0) damage = 0;
			damage = player.takeDamage(damage);
			outputText("Her left primary wing batters your head! (" + damage + ")\n");
			//Determine damage - str modified by enemy toughness!
			damage = int((str) - Math.random()*(player.tou) - player.armorDef);
			if (damage < 0) damage = 0;
			damage = player.takeDamage(damage);
			outputText("Her right, wing-like arm slaps at your torso! (" + damage + ")\n");
			//Determine damage - str modified by enemy toughness!
			damage = int((str) - Math.random()*(player.tou) - player.armorDef);
			if (damage < 0) damage = 0;
			damage = player.takeDamage(damage);
			outputText("Her other feathery arm punches at your shoulder! (" + damage + ")\n");
			//Determine damage - str modified by enemy toughness!
			damage = int((str) - Math.random()*(player.tou) - player.armorDef);
			if (damage < 0) damage = 0;
			damage = player.takeDamage(damage);
			outputText("Her right wing slams into the other side of your head! (" + damage + ")\n");
		}

		protected  performCombatAction(): void
		{
			//Sophie has special AI in harpySophie.as
			game.sophieBimbo.sophieSprite();
		var  select: number = 1;
		var  rando: number = 1;
//Update attacks for girls/neuters
			if (!player.hasCock() || hasStatusEffect(StatusEffects.BimboBrawl)) {
				//Talons
				special1 = talonsSophie;
				//Batter
				special2 = batterAttackSophie;
				//Clear
				special3 = undefined;
			}
			//Dicks ahoy
			else {
				//kiss
				special1 = sophieKissAttack;
				//harpy-boating
				special2 = sophieHarpyBoatsPC;
				//compulsion
				special3 = sophieCompulsionAttack;
			}
			select = rand(4);
			if (select == 0) {
				eAttack();
				combatRoundOver();
				return;
			}
			if (player.hasCock() && !hasStatusEffect(StatusEffects.BimboBrawl)) rando = 1 + rand(3);
			else rando = 1 + rand(2);
			if (rando == 1) special1();
			if (rando == 2) special2();
			if (rando == 3) special3();
			combatRoundOver();
		}

		public  defeated(hpVictory: boolean): void
		{
			if (hasStatusEffect(StatusEffects.BimboBrawl))
				game.sophieFollowerScene.beatUpDebimboSophie();
			else
				game.sophieScene.sophieLostCombat();
		}

		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if (hasStatusEffect(StatusEffects.BimboBrawl))
				game.sophieFollowerScene.debimboSophieBeatsYouUp();
			else if (pcCameWorms) {
				outputText("\n\nYour foe seems disgusted by the display and leaves you to recover alone...");
				game.combat.cleanupAfterCombat();
			} else {
				game.sophieScene.sophieWonCombat();
			}
		}

		public  Sophie()
		{
			super(true);
			//trace("Sophie Constructor!");
		
			this.a = "";
			this.short = "Sophie";
			this.imageName = "sophie";
			this.long = "Sophie is approximately the size of a normal human woman, not counting the large feathery wings that sprout from her back.  Her face is gorgeous, with large rounded eyes and glimmering amber lip-gloss painted on her lush, kissable lips.  In spite of her beauty, it's clear from the barely discernible laugh lines around her mouth that she's been around long to enough to have quite a few children.  Her feathers are light pink, though the downy plumage that comprises her 'hair' is brighter than the rest.  She moves with practiced grace despite the large, jiggling breasts that hang from her chest.  Judging from her confident movements, she's an experienced fighter.";
			this.race = "Harpy";
			// this.plural = false;
			this.createVagina(false, Vagina.WETNESS_DROOLING, Vagina.LOOSENESS_GAPING_WIDE);
			this.createStatusEffect(StatusEffects.BonusVCapacity, 40, 0, 0, 0);
			createBreastRow(Appearance.breastCupInverse("DD"));
			this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
			this.ass.analWetness = Ass.WETNESS_DRY;
			this.createStatusEffect(StatusEffects.BonusACapacity,10,0,0,0);
			this.tallness = 5*12+5;
			this.hips.rating = Hips.RATING_INHUMANLY_WIDE;
			this.butt.rating = Butt.RATING_EXPANSIVE;
			this.skin.tone = "pink";
			this.skin.type = Skin.PLAIN;
			this.skin.desc = "feathers";
			this.hair.color = "pink";
			this.hair.length = 16;
			initStrTouSpeInte(55, 40, 110, 60);
			initLibSensCor(60, 50, 60);
			this.weaponName = "talons";
			this.weaponVerb="slashing talons";
			this.weaponAttack = 20;
			this.armorName = "feathers";
			this.armorDef = 5;
			this.bonusHP = 250;
			this.lust = 10;
			this.lustVuln = .3;
			this.temperment = TEMPERMENT_RANDOM_GRAPPLES;
			this.level = 11;
			this.gems = 20 + rand(25);
			this.drop = new ChainedDrop().add(armors.W_ROBES,1/10)
					.elseDrop(consumables.GLDSEED);
			this.wings.type = Wings.FEATHERED_LARGE;
			this.special1 = harpyUberCharge;
			this.special2 = harpyTease;
			checkMonster();
		}

	}


