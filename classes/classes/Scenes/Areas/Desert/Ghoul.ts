// By Foxwells
// Ghouls! Cuz wynaut? We already have one spirit entity.
// Will first appear as a normal hyena, first damaging turns them into ghost form. Like a Zoroark.
// Can't be lusted because they're, well, flesh-hungry ghosts. They don't wanna fuck.
// If win: Ghoul eats them (I PROMISE I don't have a vore fetish), PC suffers stat drop
// If lose: They poof away.

	
	export class Ghoul extends Monster {
	
		public  spellCostBlind: number = 8;
		public  spellCostGhoulMagic: number = 12;
		
		protected  hyenaBite(): void {
			if (this.hasStatusEffect(StatusEffects.Blind)) { //Blind
				outputText("The hyena lunges for you, aiming to bite you, but misses entirely due to its blindness!");
				combatRoundOver();
				return;
			}
			if (player.getEvasionRoll()) { //Evading
				outputText("The hyena lunges for you, aiming to bite you, but easily move out of the way.");
				combatRoundOver();
				return;
			}
			else { //Damage
				outputText("The hyena lunges for you, sinking its teeth into you. ");
			var  damage: number = (rand(10) + 5);
				damage = player.reduceDamage(damage);
				player.takeDamage(damage, true);
			}
			combatRoundOver();
		}
	
		protected  hyenaClaw(): void {
			if (this.hasStatusEffect(StatusEffects.Blind)) { //Blind
				outputText("The hyena slashes its paw at you, but misses due to its blindness!");
				combatRoundOver();
				return;
			}
			if (player.getEvasionRoll()) { //Evading
				outputText("The hyena slashes its paw at you, but you easily move out of the way.");
				combatRoundOver();
				return;
			}
			else { //Damage
				outputText("The hyena slashes its paw at you, raking down hard and causing you to yelp in pain. ");
			var  damage: number = (rand(5) + 5);
				damage = player.reduceDamage(damage);
				player.takeDamage(damage, true);
			}
			combatRoundOver();
		}
		
		protected  ghoulBlind(): void {
			if (fatigueLeft() >= spellCostBlind) {
				outputText("The ghoul glares and points at you! A bright flash erupts before you! ");
				if (rand(player.inte / 5) <= 4) {
					outputText("<b>You are blinded!</b>");
					player.createStatusEffect(StatusEffects.Blind, 1 + rand(3), 0, 0, 0);
				}
				else {
					outputText("You manage to blink in the nick of time!");
				}
				this.fatigue += spellCostBlind;
			}
			combatRoundOver();
		}
		
		protected  ghoulMagic(): void {
			if (fatigueLeft() >= spellCostGhoulMagic) {
				outputText("The ghoul chants out an incantation, and a dark alchemic circle forms around your feet. ");
				if (player.getEvasionRoll()) { //Evading
					outputText("You jump out of the circle before anything happens. Where you'd just been erupts in flames.");
					combatRoundOver();
					return;
				}
				else { //Damage
					outputText("Blackened flames burst from the circle, causing you to seize with pain as they scorch every inch of your body. ");
				var  damage: number = (rand(10) + 10);
					damage = player.reduceDamage(damage);
					player.takeDamage(damage, true);
				}
				this.fatigue += spellCostGhoulMagic;
			}
			combatRoundOver();
		}
		
		protected  performCombatAction(): void {
		var  chooser: number = rand(10);
			if (!game.combat.ghoulReveal) {
				if (chooser <= 5) hyenaClaw();
				else if (chooser >= 6) hyenaBite();
			} else if (game.combat.ghoulReveal) {
				if (chooser < 3 && fatigueLeft() >= spellCostGhoulMagic) ghoulMagic();
				else if (chooser >= 8 && fatigueLeft() >= spellCostBlind) ghoulBlind();
				else eAttack();
			}
		}
		
		public  defeated(hpVictory: boolean): void
		{
			game.combat.ghoulReveal = false;
			outputText("The ghoul lets out a furious screech as your attacks become too much to bear, and vanishes in a dusty cloud of sand. You're left staring at the spot, wondering if you just hallucinated everything that happened.");
			game.combat.cleanupAfterCombat();
		}
		
		public  won(hpVictory: boolean, pcCameWorms: boolean): void
		{
			game.combat.ghoulReveal = false;
			if(pcCameWorms){
				outputText("\nThe ghoul lets out a disgusted noise and vanishes without a word.");
				doNext(game.combat.endLustLoss);
			} else {
				game.desert.ghoulScene.ghoulWon();
			}
		}
		
		private  VIRGIN_VARIATIONS: any[] = [
			["true"],
			["false"]
		];
		
		private  HIP_VARIATIONS: any[] = [
			["boyish"],
			["slender"],
			["average"],
			["ample"],
			["curvy"],
			["fertile"],
			["inhumanly wide"]
		];
		
		private  BUTT_VARIATIONS: any[] = [
			["buttless"],
			["tight"],
			["average"],
			["noticeable"],
			["large"],
			["jiggly"],
			["expansive"],
			["huge"],
			["inconceivably big"]
		];
		
		private  LEG_VARIATIONS: any[] = [
			["lack of"],
			["human"],
			["hoofed"],
			["dog"],
			["naga"],
			["demonic high heels"],
			["demonic claws"],
			["bee"],
			["goo"],
			["cat"],
			["lizard"],
			["pony"],
			["bunny"],
			["harpy"],
			["kangaroo"],
			["chitinous spider legs"],
			["drider lower body"],
			["fox"],
			["dragon"],
			["raccoon"],
			["ferret"],
			["cloven hoofed"],
			["echidna"],
			["salamander"],
			["wolf"]
		];
		
		private  ARM_VARIATIONS: any[] = [
			["no"],
			["human"],
			["harpy"],
			["spider"],
			["predator"],
			["salamander"],
			["wolf"]
		];
		
		private  SKINCOLOUR_VARIATIONS: any[] = [
			["albino"],
			["aphotic blue-black"],
			["ashen grayish-blue"],
			["ashen"],
			["black"],
			["blue"],
			["brown"],
			["cerulean"],
			["dark green"],
			["dark"],
			["ebony"],
			["emerald"],
			["ghostly pale"],
			["gray"],
			["grayish-blue"],
			["green"],
			["indigo"],
			["light"],
			["milky white"],
			["olive"],
			["orange and black striped"],
			["orange"],
			["pale white"],
			["pale yellow"],
			["pale"],
			["pink"],
			["purple"],
			["red"],
			["rough gray"],
			["sable"],
			["sanguine"],
			["shiny black"],
			["silver"],
			["tan"],
			["white"]
		];
		
		private  SKINTYPE_VARIATIONS: any[] = [
			["skin"],
			["fur"],
			["lizard scales"],
			["goo"],
			["dragon scales"]
		];
		
		private  HAIRCOLOUR_VARIATIONS: any[] = [
			["auburn"],
			["black and orange"],
			["black and white spotted"],
			["black and yellow"],
			["black"],
			["blond"],
			["blonde"],
			["blue"],
			["brown"],
			["cerulean"],
			["dark blue"],
			["deep red"],
			["emerald"],
			["golden blonde"],
			["golden-blonde"],
			["gray"],
			["green"],
			["light blonde"],
			["midnight black"],
			["orange"],
			["pink"],
			["platinum blonde"],
			["purple"],
			["red"],
			["reddish-orange"],
			["sandy blonde"],
			["sandy brown"],
			["shiny black"],
			["silver blonde"],
			["silver-white"],
			["silver"],
			["transparent"],
			["white and black"],
			["white"]
		];
		
		private  HAIRTYPE_VARIATIONS: any[] = [
			["normal"],
			["feather"],
			["ghost"],
			["goo"],
			["anemone"],
			["quill"],
			["basilisk spine"],
			["basilisk plume"]
		];
		
		private  FACE_VARIATIONS: any[] = [
			["lack of"],
			["human"],
			["horse"],
			["dog"],
			["cow"],
			["minotaur"],
			["shark with shark teeth"],
			["snake with snake fangs"],
			["cat"],
			["lizard"],
			["bunny"],
			["kangaroo"],
			["spider with spider fangs"],
			["fox"],
			["dragon"],
			["raccoon mask"],
			["raccoon"],
			["mouse-like with buckteeth"],
			["mouse"],
			["ferret mask"],
			["ferret"],
			["pig"],
			["boar"],
			["rhino"],
			["echidna"],
			["deer"],
			["wolf"]
		];
		
		private  EARS_VARIATIONS: any[] = [
			["no"],
			["human"],
			["horse"],
			["dog"],
			["cow"],
			["elvin"],
			["cat"],
			["lizard"],
			["bunny"],
			["kangaroo"],
			["fox"],
			["dragon"],
			["raccoon"],
			["mouse"],
			["ferret"],
			["pig"],
			["rhino"],
			["echidna"],
			["deer"],
			["wolf"]
		];
		
		private  TONGUE_VARIATIONS: any[] = [
			["non-existant"],
			["human"],
			["snake"],
			["demonic"],
			["draconic"],
			["echidna"],
			["lizard"]
		];
		
		private  EYES_VARIATIONS: any[] = [
			["no"],
			["human"],
			["four spider"],
			["black Sand Trap"],
			["lizard"],
			["dragon"],
			["basilisk"],
			["wolf"]
		];
		
		private  WEAPON_VARIATIONS: any[] = [
			["sword"],
			["rapier"],
			["scimitar"],
			["katana"],
			["halberd"],
			["axe"],
			["dagger"]
		];
		
		private  ARMOR_VARIATIONS: any[] = [
			["Bee Armor"],
			["Chainmail Armor"],
			["Dragonscale Armor"],
			["Gel Armor"],
			["Leather Armor"],
			["Platemail Armor"],
			["Samurai Armor"],
			["Scalemail Armor"],
			["Spider-Silk Armor"],
			["Ballroom Dress"],
			["Leather Robes"],
			["Bondage Straps"],
			["Chainmail Bikini"],
			["Classy Suitclothes"],
			["Comfortable Clothes"],
			["Green Adventurer's Clothes"],
			["Kimono"],
			["Nurse's Outfit"],
			["Overalls"],
			["Robes"],
			["Rubber Outfit"],
			["Bodysuit"],
			["Slutty Swimwear"],
			["Spider-Silk Robes"],
			["Scandalously Seductive Armor"],
			["Wizard's Robes"],
			["Birthday Suit"]
		];
		
		private  TAIL_VARIATIONS: any[] = [
			["non-existant"],
			["horse"],
			["dog"],
			["demonic"],
			["cow"],
			["spider adbomen"],
			["bee abdomen"],
			["shark"],
			["cat"],
			["lizard"],
			["rabbit"],
			["harpy"],
			["kangaroo"],
			["fox"],
			["draconic"],
			["raccoon"],
			["mouse"],
			["ferret"],
			["behemoth"],
			["pig"],
			["scorpion"],
			["goat"],
			["rhino"],
			["echidna"],
			["deer"],
			["salamander"],
			["wolf"]
		];
		
		private  HORN_VARIATIONS: any[] = [
			["no"],
			["demon"],
			["cow"],
			["minotaur"],
			["2 draconic"],
			["4, 12-inch long draconic"],
			["antlers"],
			["goat"],
			["unicorn"],
			["rhino"]
		];
		
		private  WING_VARIATIONS: any[] = [
			["no"],
			["small, bee-like"],
			["large, bee-like"],
			["harpy"],
			["imp"],
			["large imp"],
			["tiny bat-like"],
			["large bat-like"],
			["shark fin"],
			["large, feathered"],
			["small, draconic"],
			["large, draconic"],
			["giant dragonfly"]
		];
		
		public  Ghoul() {
		var  vaginaVirgin: any[] = randomChoice(VIRGIN_VARIATIONS);
		var  hipRate: any[] = randomChoice(HIP_VARIATIONS);
		var  buttRate: any[] = randomChoice(BUTT_VARIATIONS);
		var  legType: any[] = randomChoice(LEG_VARIATIONS);
		var  armsType: any[] = randomChoice(ARM_VARIATIONS);
		var  skinColour: any[] = randomChoice(SKINCOLOUR_VARIATIONS);
		var  skinsType: any[] = randomChoice(SKINTYPE_VARIATIONS);
		var  hairColours: any[] = randomChoice(HAIRCOLOUR_VARIATIONS);
		var  hairTypes: any[] = randomChoice(HAIRTYPE_VARIATIONS);
		var  faceTypes: any[] = randomChoice(FACE_VARIATIONS);
		var  earTypes: any[] = randomChoice(EARS_VARIATIONS);
		var  tongueTypes: any[] = randomChoice(TONGUE_VARIATIONS);
		var  eyeTypes: any[] = randomChoice(EYES_VARIATIONS);
		var  weaponTypes: any[] = randomChoice(WEAPON_VARIATIONS);
		var  armorTypes: any[] = randomChoice(ARMOR_VARIATIONS);
		var  tailTypes: any[] = randomChoice(TAIL_VARIATIONS);
		var  hornTypes: any[] = randomChoice(HORN_VARIATIONS);
		var  wingTypes: any[] = randomChoice(WING_VARIATIONS);
			
			this.revealedDesc = "The ghoul is one of the more bizarre things you've seen, with a " + faceTypes[0] + " face, " + armsType[0] + " arms, and a " + legType[0] + " lower body. Its face is complete with " + eyeTypes[0] + " eyes and a " + tongueTypes[0] + " tongue. It also has " + wingTypes[0] + " wings, " + hornTypes[0] + " horns, and a " + tailTypes[0] + " tail above its [ass]. It has " + hairColours[0] + " " + hairTypes[0] + " hair, " + skinColour[0] + " " + skinsType[0] + ", " + hipRate[0] + " hips, and a " + buttRate[0] + " butt. It wields a " + weaponTypes[0] + " for a weapon and wears " + armorTypes[0] + " as armor.";
			
			this.a = "the ";
			this.short = "";
			this.imageName = "ghoul";
			this.long = "";
			this.race = "";
	
			if (rand(2) == 0) {
				this.createCock(rand(4) + 5, rand(2) + 1, CockTypesEnum.DISPLACER);
				this.balls = 2;
				this.ballSize = rand(2) + 1;
				this.createBreastRow();
			} else {
				this.createVagina(vaginaVirgin[0], rand(6) + 1, rand(7) + 1);
				this.createBreastRow(rand(5) + 1, rand(2) + 1);
			}
			this.ass.analLooseness = rand(4) + 1;
			this.ass.analWetness = rand(4) + 1;
			
			this.pronoun1 = "it";
			this.pronoun2 = "it";
			this.pronoun3 = "its";
			
			this.tallness = rand(18) + 59;
			this.hips.rating = rand(19) + 1;
			this.butt.rating = rand(19) + 1;
			this.lowerBody.type = rand(25) + 1;
			this.arms.type = rand(5) + 1;

			this.skin.tone = skinColour[0];
			this.skin.setType(rand(5));
			this.hair.length = rand(25);
			if (this.hair.length > 0) {
				this.hair.color = hairColours[0];
				this.hair.type = rand(7) + 1;
			} else {
				this.hair.type = Hair.NORMAL;
			}
			this.face.type = rand(23) + 1;
			this.ears.type = rand(19) + 1;
			this.tongue.type = rand(4) + 1;
			this.eyes.type = rand(5) + 1;

			initStrTouSpeInte(45,30,55,25);
			initLibSensCor(0,0,50);

			this.weaponName = weaponTypes[0];
			this.weaponVerb = "slash";
			this.weaponAttack = rand(4) + 2;

			this.armorName = armorTypes[0];
			this.armorDef = rand(5) + 2;

			this.bonusHP = 100;
			this.lust = 0;
			this.lustVuln = 0;
			this.temperment = TEMPERMENT_AVOID_GRAPPLES;
			this.fatigue = 0;

			this.level = 4;
			this.gems = rand(25) + 5;

			this.drop = new WeightedDrop(consumables.ECTOPLS, 1);

			this.tail.type = rand(26);
			this.horns.value = rand(4);
			if (this.horns.value > 0) {
				this.horns.type = rand(7) + 1;
			} else {
				this.horns.type = Horns.NONE;
			}
			this.wings.type = rand(13);
			this.antennae.type = rand(2);
			if (this.antennae.type == 2) {
				this.antennae.type = Antennae.BEE;
			} else {
				this.antennae.type = Antennae.NONE;
			}
			
			checkMonster();
		}
		
		private  revealedDesc: string = "";
			 
		public  get short(): string {
		var  str: string = "";
			if (game.combat.ghoulReveal) {
				str += "ghoul";
			} else if (!game.combat.ghoulReveal) {
				str += "hyena";
			}
			return str;
		}
				
		public  get long(): string {
			if (game.combat.ghoulReveal) {
				return revealedDesc
			} else {
				return "The hyena appears to be a regular spotted hyena, with pale brown fur covered in dark brown spots. Its forequarters are strong and muscular while its hindquarters are notably underdeveloped in comparison. It has a flat snout ending in a black nose, and curved, erect ears tipped in black. Its eyes watch you closely in case you try any sudden movements. There seem to be no other hyenas in sight, and you can't stop thinking about how odd it is that there's even a hyena in a desert.";
			}
		}
		public  get race(): string {
			if (game.combat.ghoulReveal) {
				return "Ghoul";
			} else {
				return "Hyena?";
			}
		}
	}

