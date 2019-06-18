
	export class Aiko extends BaseKitsune
	{
		private  castIllusion: number = 0;

		public  Aiko() {
			init();
		}

		/**
		 * Constructor code extracted into function to make use of the JIT compiler.
		 * Code in the constructor is always interpreted.
		 */
		private  init(): void
		{
			this.a = "";
			this.short = "Aiko";
			this.imageName = "aiko";
			if (game.flags[kFLAGS.AIKO_CORRUPTION] < 50 || game.flags[kFLAGS.AIKO_CORRUPTION_ACTIVE]==0)
				this.long = "Aiko stands before you, a little over 5’4 tall. She has a head of short silver-blond hair that ends above her shoulders, parted by two large, furry fox ears. "+(flags[kFLAGS.AIKO_BOSS_COMPLETE] > 0 ? "Eight":"Seven")+" luxurious fox tails sway behind her, the silky fur shimmering as they move. She wears a set of revealing blue and white robes, neatly pressed and hung off her features with care, her D-cup breasts bound by a cloth chest wrap that is just a little too tight. She sports a number of red “tattoos” adorning her face and body; the most prominent of which are the spiral-shaped patterns on her palms and buttocks, and a stylized lotus flower on her lower back.  She wields a longbow almost as tall as she is that she can summon and dismiss with a snap of her fingers, and stares you down with a determined fire in her glittering blue eyes.";
			else
				this.long = "Aiko stands before you, a little over 5’4 tall. She has a head of short, unkempt silver-blond hair that ends above her shoulders, parted by two large, furry fox ears. "+(flags[kFLAGS.AIKO_BOSS_COMPLETE] > 0 ? "Eight":"Seven")+" fox tails sway behind her, their fur shaggy and matted down. She wears a set of ragged, bloodied robes that show a lot of skin, her D-cup breasts haphazardly bound by a set of bandages in dire need of changing, and you can smell sex and violence on her even from here. She sports a number of red “tattoos” adorning her face and body; the most prominent of which are the spiral-shaped patterns on her palms and buttocks, and a stylized lotus flower on her lower back. She is wielding an over-sized bill-hook hatchet that she can summon and dismiss with a snap of her fingers, and stares you down with a maniacal fire in her crazed blue eyes."
			this.race = "Kitsune";
			this.createVagina(false, Vagina.WETNESS_NORMAL, Vagina.LOOSENESS_TIGHT);
			this.createStatusEffect(StatusEffects.BonusVCapacity, 200, 0, 0, 0);
			createBreastRow(Appearance.breastCupInverse("D"));
			this.ass.analLooseness = Ass.LOOSENESS_VIRGIN;
			this.ass.analWetness = Ass.WETNESS_DRY;
			this.createStatusEffect(StatusEffects.BonusACapacity,40,0,0,0);
			this.tallness = 64;
			this.hips.rating = Hips.RATING_AMPLE;
			this.butt.rating = Butt.RATING_AVERAGE+1;
			this.skin.tone = "light tan";			//might need to change to russet
			this.hair.color = "silver-blonde";
			this.hair.length = 10;
			initStrTouSpeInte(25, 30, 90, 100);
			initLibSensCor(40, 65, game.flags[kFLAGS.AIKO_CORRUPTION]);
			this.weaponName = (cor >= 50 && game.flags[kFLAGS.AIKO_CORRUPTION_ACTIVE]==1 ? "bill-hook hatchet" : "longbow");
			this.weaponVerb = (cor >= 50 && game.flags[kFLAGS.AIKO_CORRUPTION_ACTIVE]==1 ? "slash" : "shoot");
			this.armorName = (cor >= 50 && game.flags[kFLAGS.AIKO_CORRUPTION_ACTIVE]==1 ? "ragged, bloodied robes" : "revealing blue and white robes");
			this.armorDef = 16;
			this.bonusHP = 350;
			this.lust = 25;
			this.lustVuln = 0.4;
			this.temperment = (cor >= 50 && game.flags[kFLAGS.AIKO_CORRUPTION_ACTIVE]==1 ? TEMPERMENT_LOVE_GRAPPLES : TEMPERMENT_LUSTY_GRAPPLES);
			if (flags[kFLAGS.AIKO_BOSS_COMPLETE] >0) {			
				this.level = 28;
				this.tail.venom = 8;
			} else {
				this.level = 18;
				this.tail.venom = 7;
			}
			this.gems = rand(10) + 30;
			this.drop = new WeightedDrop(consumables.FOXJEWL, 1);
			this.tail.type = Tail.FOX;
			this.ears.type = Ears.FOX;
			checkMonster();
		}

		private  aikoBasic(): void
		{
		var  damage: number = int(str) + rand(15);
			outputText("Aiko nocks an arrow and lets it fly");
			
			//20% chance for double hit without block or evade chance
			if (rand(5) == 0) {
				outputText(", swiftly following it with another!  ");
				player.takeDamage(damage - rand(10), true);
				player.takeDamage(damage - rand(9), true);
				player.addCombatBuff("spe", -4);
				if (!player.hasStatusEffect(StatusEffects.IzmaBleed))
					player.createStatusEffect(StatusEffects.IzmaBleed, 2, 0, 0, 0);
				else (player.addStatusValue(StatusEffects.IzmaBleed, 1, 2));
			}
			//Determine if evaded
			else if (player.getEvasionRoll()) {
				outputText(", which disappears into the woods.");
			}
			//Armor blocked
			else if (player.armorDef > 4 && rand(3)==0) {
				outputText("! You shrink away from the impending impact, but it strikes at an angle, glancing off your [armor] and tumbling into the woods.  ");
				player.takeDamage(int(damage)-(player.armorDef*2), true);
			}
			//Direct hit
			else {
				outputText(" with deadly precision! It protrudes from your body painfully, making it somewhat difficult to move around.  ");
				player.takeDamage(damage, true);
				player.addCombatBuff("spe", -4);
				if (!player.hasStatusEffect(StatusEffects.IzmaBleed))
					player.createStatusEffect(StatusEffects.IzmaBleed, 2, 0, 0, 0);
				else
					player.addStatusValue(StatusEffects.IzmaBleed, 1, 1);
			}
			combatRoundOver();
		}
		
		private  aikoFoxfire(): void
		{
			outputText("Aiko moves her fingers through the air in a circle, conjuring up a pale blue flame. As she thrusts her palm forward, it rockets toward you like a missile, bursting on impact! The flames burn intensely as they engulf you, at the same time filling your body with a crippling pleasure that makes your skin flush red.  ");
		var  damage: number = 2*(str + rand(30));
			damage = player.takeDamage(damage, true);
			//player.takeLustDamage(15 + player.sens / 5
			player.takeLustDamage(15 + player.sens / 5, true);
			combatRoundOver();
		}
		
		private  aikoFireArrow(): void
		{
			outputText("Aiko nocks an arrow on her bow and lines up a shot, biting the end of her tongue as she focuses. As she lets it fly, the arrowhead sparks and then bursts into flame! The flaming obsidian tip pierces through your [armor] like a hot knife through butter, sinking into your flesh and forcing a pained cry from your throat.  ");
			player.takeDamage((this.hasStatusEffect(StatusEffects.AikoArcaneArcher)?2*(str + rand(40)):str + rand(40))+30, true);
			player.addCombatBuff("spe", -5);
			combatRoundOver();
		}
		
		private  aikoIllusion(): void
		{
			if (castIllusion < 1) {
				outputText("Aiko whispers an incantation in a strange language, and reality seems to be twisting and warping around her. This is going to make it much harder to hit her!\n\n");
				castIllusion += 2;
			} else {
				outputText("Aiko whispers her incantation again, and your already distorted perception of your surroundings is compounded. Coupled with sudden shifts in gravity, her illusory magic has you stumbling around drunkenly, struggling to keep Aiko in your sights. It’s going to be nearly impossible to hit her like this!\n\n");
				castIllusion += 2;
			}
			if (player.hasStatusEffect(StatusEffects.Illusion))
				player.addCombatBuff("spe", -3);
			resistIllusion();
			combatRoundOver();
		}
		
		private  resistIllusion(): void
		{
			//Resist: - successfully resisting deals small health & lust damage to Aiko
		var  resist: number = 0;
			if (player.inte < (50+player.level)) resist = Math.round(player.inte/55*30);
			else resist = 25;
			if (player.hasPerk(PerkLib.Whispered)) resist += 15;
			if (player.hasPerk(PerkLib.HistoryReligious) && player.isPureEnough(20)) resist += 15 - player.corAdjustedDown();
			if (rand(100) < resist) {
				outputText("As the world around you begins to twist, you push back the influence of her illusions with your mind! She lets out a small cry of pain, clutching her forehead, and curses audibly as she realizes that you resisted her magic.\n\n");
				if (player.hasStatusEffect(StatusEffects.Illusion)) {
					player.removeStatusEffect(StatusEffects.Illusion);
					player.addCombatBuff("spe", 3);
				}
			} else {
				if (player.hasStatusEffect(StatusEffects.Illusion)) {
					player.addCombatBuff("spe", -1);
				} else {
					player.createStatusEffect(StatusEffects.Illusion, 0, 0, 0, 0);
					addCombatBuff("spe", -7);
				}
			}	
		}
				
		//Corrupted Aiko Attacks
		private  aikoCorruptBasic(): void
		{
			outputText("<i>\“Hack! Slash! Maim! Kill! Isn’t it the fucking greatest?!\”</i> Aiko yells with a psychotic laugh as she strikes out at you with reckless abandon. \n\n<i>“\Lacerate! Eviscerate! Mutilate!”</i> Aiko chants with each reckless swing. <i>“Ever notice how all the best words end in -ate?!\”\n\n\“You know I’d bleed for you!”</i> she yells, grinning crazily as she hacks at you with her billhook. <i>“Now you’ll do the SAME!”</i>  ");
			
		var  dodge: number = player.speedDodge(this);
			if (dodge>0) {
				outputPlayerDodged(dodge);
			var  evasionResult: string = player.getEvasionReason(false); 
				//Determine if evaded
				if (evasionResult === EVASION_EVADE) {
					outputText("<i>\“Just hold still, I promise to make it hurt good!”</i> Aiko yells as using your skills at evading attacks, you anticipate and sidestep her ferocious attacks.");
				}
				//("Misdirection"
				else if (evasionResult === EVASION_MISDIRECTION) {
					outputText("<i>\“Just hold still, I promise to make it hurt good!”</i> Aiko yells as using Raphael's teachings, you anticipate and sidestep her ferocious attacks.");
				}
				//Determine if cat'ed
				else if (evasionResult === EVASION_FLEXIBILITY) {
					outputText("<i>\“Just hold still, I promise to make it hurt good!”</i> Aiko yells as with your incredible flexibility, you squeeze out of the way of her ferocious attacks.");
				}
				else if (evasionResult !== undefined) {
					outputText("<i>\“Just hold still, I promise to make it hurt good!”</i> Aiko yells as using your superior combat skills you dodge her ferocious attacks.\n");
				}
				//Parry with weapon
				else if (combatParry()) {
					outputText("<i>\“Just hold still, I promise to make it hurt good!”</i> Aiko yells as you parry her ferocious attacks with your [weapon].");
				}
				//Block with shield
				else if (combatBlock(true)) {
					outputText("<i>\“Just hold still, I promise to make it hurt good!”</i> Aiko yells as you block her ferocious attacks with your [shield].")
				}
			} else {
			var  damage: number = int(str) + rand(15);
				player.takeDamage(damage, true);
				player.addCombatBuff("spe", -4);
				if (!player.hasStatusEffect(StatusEffects.IzmaBleed))
					player.createStatusEffect(StatusEffects.IzmaBleed, 2, 0, 0, 0);
				else (player.addStatusValue(StatusEffects.IzmaBleed, 1, 1));
			}
			
			combatRoundOver();
		}
		
		private  aikoDarkFoxfire(): void 
		{
			outputText("Aiko moves her fingers through the air in a circle, conjuring up a corrupt purple flame. She twists her upper body into a batter’s stance and strikes it at you ferociously, making the fireball rocket toward you like a missile, bursting on impact! The flames burn intensely as they engulf you, but the more it burns, the more you start to LIKE it.  ");
			player.takeDamage(int(str/2) + rand(15), true);
			//if masochist, take more damage
			(player.hasPerk(PerkLib.Masochist) ?  player.takeLustDamage(15 + player.sens / 5) : player.takeLustDamage((10 + player.sens / 5)*2));
			combatRoundOver();
		}
		
		private  aikoTerrorize(): void
		{
			outputText("Aiko pauses and mutters an incantation, snapping her fingers in your direction. The edges of your vision blacken, and you suddenly find yourself beset on all sides by countless indescribable otherworldly horrors! Though your eyes cannot see them, your mind can somehow sense the eldritch abominations crowding in around you, threatening to engulf your very essence... ");
			//Resist: - successfully resisting deals small health & lust damage to Aiko
		var  resist: number = 0;
			if (player.inte < (50+player.level)) resist = Math.round(player.inte/55*30);
			else resist = 25;
			if (player.findPerk(PerkLib.Whispered) >= 0) resist += 35;
			else outputText("Some small part of you knows this can’t be real, but you’re too terrified to act right now!");
			if (player.findPerk(PerkLib.HistoryReligious) >= 0 && player.isPureEnough(20)) resist += 15 - player.corAdjustedDown();
			if (rand(100) < resist) {
				outputText("\n\nAiko murmurs her incantation, but as the darkness begins to close in on you, you push back the influence of her illusions with your mind! She lets out a yelp of pain, clutching her forehead, but then grins madly. <i>\“Think you’re pretty clever, huh?\”</i>");			
				if (player.hasStatusEffect(StatusEffects.Fear))
					player.removeStatusEffect(StatusEffects.Fear);
			} else {
				if (player.hasStatusEffect(StatusEffects.Fear))
					addCombatBuff("spe", -4);
				else
					createStatusEffect(StatusEffects.Fear, 0, 0, 0, 0);
				addCombatBuff("spe", -10);
			}
			
			combatRoundOver();
		}
		
		private  aikoTomahawk(): void
		{
			if (rand(3) == 1 || player.speedDodge(this)>0 || player.getEvasionRoll() || combatParry() || combatBlock(true)) {
				outputText("Aiko draws back and heaves her weapon at you with all her force! Thankfully, the shot goes wide, and the blade winds up lodged in a tree trunk instead of your chest. <i>“Don’t you fucking play hard to get with ME!”</i> she yells furiously, snapping her fingers and summoning the weapon back to her hands, still stomping the ground in anger.");
			} else {
				outputText("Aiko draws back and heaves her weapon at you with all her force! The wicked-looking blade scythes through the air, staggering you with the force of the hit! She laughs sadistically at your pained struggles to dislodge it, and with a snap of her fingers, it disappears in a puff of smoke, reappearing in her hand again.  ");
				player.takeDamage(int(str) + rand(15), true);
			}
			combatRoundOver();
		}
		
		/**
		 * Prints a text message that the user should report a bug.
		 *
		 * @param bugId a string to help developers find whatever triggered the bug
		 */
		private  reportABug(bugId: string): void {
			outputText("This is probably a bug. Please open a issue so it can be fixed - " + bugId);
		}

		private  aikoTease(): void
		{
		var  temp: number = rand(4);
			switch (temp) {
				case 0:
					outputText("Aiko turns around, brushing her tails to the side to expose her ample hindquarters, showing off the spiral-shaped tattoos on her juicy-looking cheeks and a lotus-flower tramp stamp. Her display sends blood rushing to your groin, making you lick your lips eagerly.  ");
					break;
				case 1:
					outputText("Aiko pauses for a moment, placing a hand on her taut abs and sliding her fingers downward slowly, coyly gazing deep into your eyes. Her tails fan out around her, curling around her limbs seductively, and she gives you a flirtatious leer as she watches your body tremble with desire.  ");
					break;
				case 2:
					outputText("Aiko takes a moment to stretch out her limber body, thrusting out her chest as she stretches her arms toward the sky. She spins girlishly, giving you a come-hither glare, and then bows forward to give you a good angle at her cleavage, packed tightly into her too-small chest wrap.  ");
					break;
				case 3:
					outputText("<i>“You know, we don’t have to fight... Wouldn’t you rather come pet my super fluffy tails?”</i> Aiko teases, running a hand along her tails and making them fan out around her seductively. You find yourself nodding before you can even think to stop yourself — yes, you <i>DO</i> want the fluffy tails!  ");
					break;

				default:
					reportABug("Aiko Tease");
					break;
			}
			
		var  lustDmg: number = 8 + int(player.sens / 5);
			player.takeLustDamage(lustDmg);
			combatRoundOver();
		}

		private  aikoIllusionLust(): void
		{
		var  x: number = rand(6);
		var  lustDmg: number = 11 + int(player.sens / 5);
			
			if (player.hasStatusEffect(StatusEffects.Illusion)) {
				outputText("A series of Aiko's illusions surround you! You try to find the real one but you're too slow! An arrow comes from the side, impaling you!  ");
				player.takeDamage(int(str/2) + rand(15), true);
				
				if (x === 0) {
						outputText("\n\nYou attack Aiko, but her figure was just an illusion! She appears behind you and rapidly shoots an arrow, she got you! But.... what has she done?! You feel a tingling sensation in your groin, the arrow was poisoned with some kind of lust-inducing venom!  ");
						
						if (!player.hasStatusEffect(StatusEffects.lustvenom)) {
							player.createStatusEffect(StatusEffects.lustvenom, 0, 0, 0, 0);
						}
				} else if (x === 1) {
						outputText("\n\n<i>“This is my realm... and in my realm... you get to feel good...”</i> her strange words entice you as you widen your eyes, you try to hit her but you always seem to miss. A mischievous grin comes from her figure as you feel something rubbing your crotch, is one of her tails! Oh damn, it feels so good!  ");
						player.takeLustDamage(lustDmg);
						
						if (player.hasStatusEffect(StatusEffects.Illusion)) {
							player.addCombatBuff("spe", -3);
						} else {
							player.createStatusEffect(StatusEffects.Illusion, 0, 0, 0, 0);
							addCombatBuff("spe", -7);
							castIllusion += 2;
						}
				} else {
					reportABug("Aiko Illusion");
				}
			}
			else if (x==3) {
				outputText("Aiko turns around, brushing her tails to the side to expose her ample hindquarters, showing off the spiral-shaped tattoos on her juicy-looking cheeks and a lotus-flower tramp stamp. Her display sends blood rushing to your groin, making you lick your lips eagerly.\n\n"
				+"Aiko pauses for a moment, placing a hand on her taut abs and sliding her fingers downward slowly, coyly gazing deep into your eyes. Her tails fan out around her, curling around her limbs seductively, and she gives you a flirtatious leer as she watches your body tremble with desire.  ");
				player.takeLustDamage(lustDmg*2);
			}
			else if (x==4) {
				outputText("Aiko devilishly looks at you, you find yourself surrounded by many Aikos! <i>“Would you like a reverse gangbang, big boy?”</i> all of the Aikos' seductively grab one bound breast and lower their pants, the tatoo on their pubic mounds drawing your attention to their most private parts.\n\n"
				+"In your distraction you don't notice the illusion Aiko has cast over you!  ");
				player.takeLustDamage(lustDmg * 2);
				
				if (player.hasStatusEffect(StatusEffects.Illusion)) {
					player.addCombatBuff("spe", -3);
				} else {
					player.createStatusEffect(StatusEffects.Illusion, 0, 0, 0, 0);
					addCombatBuff("spe", -7);
				}
			} else {
				outputText("Aiko takes a moment to stretch out her limber body, thrusting out her chest as she stretches her arms toward the sky. She spins girlishly, giving you a come-hither glare, and then bows forward to give you a good angle at her cleavage, packed tightly into her too-small chest wrap."
				+"\n\n<i>“You know, we don’t have to fight... Wouldn’t you rather come pet my super fluffy tails?”</i> Aiko teases, running a hand along her tails and making them fan out around her seductively. You find yourself nodding before you can even think to stop yourself—yes, you DO want the fluffy tails!  ");
			}
			
			player.takeLustDamage(lustDmg);
			combatRoundOver();
		}
		
		private  arcaneArcherActivate(): void
		{
			outputText("<i>“I'll show you my training as a guardian... can you stand my magic and my bow? Let's find out.”</i> she says. You almost take her words as a joke, but you can clearly see her determination, and she has the power to back up her demeanor!\n\nYou see her body enveloped by a golden aura, and sparks of yellow-white arc out from her from time to time, she looks a little frightening!\n\n");
			
			this.createStatusEffect(StatusEffects.AikoArcaneArcher, 0, 0, 0, 0);
			this.addCombatBuff("str", 10);
			this.addCombatBuff("spe", 10);
		}
		
		private  splinterLightningArrow(): void
		{
			outputText("Aiko summons her magic inside her bow and shoots to you a lighting arrow that splits into a multitude of dangerous sparks! They are too many and have too irregular movements, you can't dodge them! You are hit!\n\n"
			+"You fall to the ground, your legs giving in once the initial shock lets up.  ");
			player.addCombatBuff('str',-10);
			player.addCombatBuff('spe',-10);
			player.takeDamage(45+25/(rand(3)+1), true);
			
			if (!player.hasStatusEffect(StatusEffects.AikoLightningArrow))
				player.createStatusEffect(StatusEffects.AikoLightningArrow, 4, 0, 0, 0);
			else 
				player.addStatusValue(StatusEffects.AikoLightningArrow, 1, 3);
			
			combatRoundOver();
		}
		
		private  lightArrowCage(): void
		{
			outputText("Aiko groans with effort with her mouth closed and summons an incredible amount of arrows made of pure light! There are so many of 'em, you grit your teeth as you see you are completely surrounded by a cage of arrows ready to get you!\nThey all strike at once, converging on you at the center!  ");
			
			if (player.isCorruptEnough(40)) {
				outputText("\n\nDue to your high corruption, the light sears your skin and burns incredibly.  ");
				player.takeDamage(2*(80 + player.cor), true);
			} else {
				player.takeDamage(1.2*(80 + player.cor), true);
			}
			
			this.removeStatusEffect(StatusEffects.AikoArcaneArcher);
			combatRoundOver();
		}
		
		private  iceArrow(): void
		{
			outputText("Aiko rapidly shoots a flurry of arrow in an arc motion before her, they are made of pure ice, they leave a big trail of ice behind them, and as such are twice as dangerous!\n\n");
			
			if (this.getEvasionRoll()) {
				outputText("You narrowly avoid the barrage of arrows and watch as the last one whizzes past and embeds itself with a great thunk in a tree on the opposite end of the clearing, instantly freezing half the tree.");
			} else {
				outputText("You are hit by one of the frozen arrows, frost rapidly spreading over the skin surrounding the arrow [if (player.armor != ArmorLib.NOTHING)and chilling your armor]  ");
				player.addCombatBuff("spe", -15);
				player.takeDamage(str*2 + rand(40), true);
			}
			combatRoundOver();
		}
		
		private  arrowRain(): void
		{
		var  arrows: number = rand(4)+2;
			outputText("Aiko nocks a series of arrows made of pure light and shoots them into the air! The hailstorm of bolts come crashing down, impaling you "+arrows+" times! The arrows luckily are purely magical and vanish soon after.\n");
			for (var i: number = 0; i < arrows; i++) {
				player.takeDamage((str + rand(15)), true);
				outputText(" ");
			}
			combatRoundOver();
		}
		
		private  arrowBarrage(): void
		{
		var  arrows: number = rand(3)+3;
			outputText("Aiko lets loose a barrage of arrows and they strike you with the speed of a machine gun! You barely have the time to react, damn, she's fast! ");
			for (var i: number = 0; i < arrows; i++) {
				player.takeDamage((str + rand(10)), true);
				outputText(" ");
				player.addCombatBuff("spe", -2);
				if (!player.hasStatusEffect(StatusEffects.IzmaBleed))
					player.createStatusEffect(StatusEffects.IzmaBleed, 2, 0, 0, 0);
				else (player.addStatusValue(StatusEffects.IzmaBleed, 1, 1));
			}
			combatRoundOver();
		}
		
		private  hyperAttack1(): void
		{
			outputText("You notice Aiko is not attacking and seems to be preparing for something big! She bows her head over her bow, muttering an incantation below her breath, completely ignoring you for the moment.");
			this.createStatusEffect(StatusEffects.AikoHyper, 0, 0, 0, 0);
			combatRoundOver();
		}
		
		private  hyperAttack2(): void
		{
			outputText("You see Aiko gathering up an enormous amount of energy, she pulls back on the string of her bow, and as her golden aura extends outward, her tattoos begin to glow in an eerie light. She's up to something really dangerous as she aims at you. You can hear a faint whisper as she slowly draws the bow to it's absolute limit, <i>“With an arrow the focus of my heart, I cast away all mundane thoughts, and with this shaft of light in my hands...”</i> An arrow of the purest light you have ever seen materializes, nocked and ready to loose! \n\n");
			
			if (flags[kFLAGS.IN_COMBAT_USE_PLAYER_WAITED_FLAG] == 1) {
				outputText("<i>“I'll punish every demon in this world!”</i> As she finishes her incantation, she releases the string of her arrow and unleashes an immense beam of golden white light directly at you! It was a wise choice to stand back to see what was going on! You narrowly manage to dodge the attack by rolling away as you see the forest behind you completely obliterated. Aiko stands speechless before you, she clearly did not expected you to dodge her attack.");
			} else {
				outputText("<i>“I'll punish every demon in this world!”</i> As she finishes her incantation, she releases the string of her arrow and unleashes an immense beam of golden white light directly at you! Oh shit! You barely have the time to widen your eyes as you get blasted away by the enormous mass of energy who seems to obliterate you as you come crashing down to the floor, all of your body smoking.  ");
				player.addCombatBuff("spe", -20);
				player.addCombatBuff("str", -15);
				if (player.isPureEnough(20))
					player.takeDamage(250, true);
				else
					player.takeDamage(350, true);
				if (player.HP > 0)
					outputText("You barely manage to survive the blast, and find Aiko standing gaping at you.\n\n<i>“How did you... No way that is possible!!!”</i>\n\n[if (player.isPureEnough(20))Unless you truly are pure of heart, that should have obliterated you!]");
			}
			
			this.removeStatusEffect(StatusEffects.AikoArcaneArcher);
			this.removeStatusEffect(StatusEffects.AikoHyper);
			combatRoundOver();
		}
		
		protected  kitsuneSealAttack(): void
		{
		var  resist: number = calculateAttackResist();
		var  select: number = rand(5);

			if (select == 0) {
				sealPlayerAttack();
			} else if (select == 1) {
				sealPlayerTease();
			} else if (select == 2) {
				sealPlayerItems();
			} else if (select == 3) {
				sealPlayerMovement();
			}
			else {
				sealPlayerPhysicalSpecialSkills();
			}
			
			if (resist >= rand(100)) {
				resistSeal();
			}
			
			combatRoundOver();
		}
		
		private  kitsuneSealMagic(): void
		{
		var  resist: number = calculateAttackResist();
		var  select: number = rand(3);
			
			if (select == 0) {
				sealPlayerSpells();
			} else if (select == 1) {
				sealPlayerMovement();
			} else {
				sealPlayerMagicSpecialSkills();
			}
			
			if (resist >= rand(100)) {
				resistSeal();
			}
			
			combatRoundOver();
		}
		
		protected  handleFear(): boolean
		{
			if (game.flags[kFLAGS.AIKO_CORRUPTION] >= 50) {
				removeStatusEffect(StatusEffects.Fear);
				outputText("Aiko shudders in delight for a moment, then looks your way with a clear head.  <i>“I love that! You should do it more often!</i>”\n");
				return true;
			} else if (rand(3)==0) {
				removeStatusEffect(StatusEffects.Fear);
				outputText("Aiko shudders for a moment, then looks your way with a clear head and a frown.  <i>“I sure am glad for my training now... That was really scary!”</i>\n");
				return true;
			} else {
				return false;
			}
		}

		protected  handleBlind(): boolean
		{
			outputText("<i>“Your fancy tricks wont work on me Champion, I see right through them.”</i> Your blinding attack simply fades away before her magic.")
			return true;
		}
				
		protected  performCombatAction(): void
		{
			castIllusion--;
			if (player.hasStatusEffect(StatusEffects.lustvenom)) {
				player.takeLustDamage(5 + player.sens / 5);
				outputText("  You feel slightly more flushed from the poisoned arrow.\n\n");
			}
			if (player.hasStatusEffect(StatusEffects.Illusion))
				resistIllusion();
			
			if ((rand(12) == 0) && (!this.hasStatusEffect(StatusEffects.AikoArcaneArcher)))
			{
					arcaneArcherActivate();
			}
			
			//basic attack has 2x chance unless arcane archer active
		var  moves: any[] = [];
			if (game.flags[kFLAGS.AIKO_CORRUPTION] < 50 || game.flags[kFLAGS.AIKO_CORRUPTION_ACTIVE]==0) {
				moves = [aikoBasic, aikoFoxfire, aikoFireArrow, aikoIllusion, aikoIllusionLust, aikoTease];
				if (this.hasStatusEffect(StatusEffects.AikoArcaneArcher)) {
					moves.push(splinterLightningArrow, lightArrowCage, iceArrow, arrowRain, arrowBarrage, kitsuneSealAttack);
				} else {
					moves.push(aikoBasic);
				}
				if (player.hasStatusEffect(StatusEffects.Illusion)) {
					moves.push(kitsuneSealMagic);
				}
				
			} else {
				moves = [aikoCorruptBasic, aikoDarkFoxfire, aikoTerrorize, aikoTomahawk, aikoIllusionLust, aikoTease];
				if (this.hasStatusEffect(StatusEffects.AikoArcaneArcher)) {
					moves.push(splinterLightningArrow, iceArrow, arrowRain, arrowBarrage, kitsuneSealAttack);
				} else {
					moves.push(aikoCorruptBasic);
				}
				if (player.hasStatusEffect(StatusEffects.Illusion)) {
					moves.push(kitsuneSealMagic);
				}
			}
			
			if (this.hasStatusEffect(StatusEffects.AikoHyper))
				hyperAttack2();
			else if (rand(15) == 0 && this.hasStatusEffect(StatusEffects.AikoArcaneArcher))
				hyperAttack1();
			else
				moves[rand(moves.length)]();
		}

		public  defeated(hpVictory: boolean): void
		{
			if (player.hasStatusEffect(StatusEffects.lustvenom))
				player.removeStatusEffect(StatusEffects.lustvenom);
			if (player.hasStatusEffect(StatusEffects.Spar)) {
				game.forest.aikoScene.sparWithAikoWin();
			} else if (player.hasStatusEffect(StatusEffects.DomFight)) {
				game.forest.aikoScene.pcWinsDomFight();
			} else {
				game.forest.aikoScene.aikoLosesIntro();
			}
		}
		
		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			if (player.hasStatusEffect(StatusEffects.lustvenom)) 
				player.removeStatusEffect(StatusEffects.lustvenom);
			if (player.hasStatusEffect(StatusEffects.Spar)) {
				game.forest.aikoScene.sparWithAikoLose(this.lust100);
			} else if (player.hasStatusEffect(StatusEffects.DomFight)) {
				game.forest.aikoScene.pcLosesDomFight();
			} else {
				game.forest.aikoScene.aikoWinsIntro();
			}
		}
	}

