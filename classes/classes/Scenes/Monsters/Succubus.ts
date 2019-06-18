	
	export class Succubus extends AbstractSuccubus
	{
		
		public  succubusBarrage(): void {
			outputText("The succubus looks like as if she's running towards you. ");
			if (getEvasionRoll()) {
				outputText("With your efforts in running, you manage to run until she stops giving chase.");
			}
			else {
			var  damage: number = 0;
				outputText("Despite your sprint, it closes the distance and leaps on you, tearing and scratching. ");
				if (rand((player.str / 3) + 10) < ((str / 3) + 10)) {
					outputText("You try to shake her off, but she's too powerful and rains painful scratches and blows before pushing you onto the ground. You get up and get back to fighting. ");
					damage = (10 + str);
				}
				else {
					outputText("You bring your strength to bear and throw her off with only minor injuries. ");
					damage = Math.floor((5 + str) / 2);
				}
				player.takeDamage(damage, true);
			}
			combatRoundOver();
		}
		
		public  won(hpVictory: boolean, pcCameWorms: boolean): void {
			game.succubusScene.loseToSuccubus();
		}
		
		public  defeated(hpVictory: boolean): void {
			game.succubusScene.winAgainstSuccubus();
		}
		
		public  Succubus() 
		{
			this.a = "the ";
			this.short = "ivory succubus";
			this.imageName = "ivorysuccubus";
			this.long = "The succubus before you is a typical example of a lusty demon. Two horns protrude from her forehead, a pair of wings sprout from her back, and a spaded tail swishes about. She's completely nude, leaving her G-cup breasts and moist pussy open for you to see. From time to time, you can see her jiggling ass clearly inviting you. She doesn't appear to be wielding anything.";
			this.race = "Demon";
			this.createVagina(false, Vagina.WETNESS_WET, Vagina.LOOSENESS_NORMAL);
			this.createStatusEffect(StatusEffects.BonusVCapacity, 40, 0, 0, 0);
			createBreastRow(Appearance.breastCupInverse("G"));
			this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
			this.ass.analWetness = Ass.WETNESS_NORMAL;
			this.createStatusEffect(StatusEffects.BonusACapacity,30,0,0,0);
			this.tallness = 35 + rand(4);
			this.hips.rating = Hips.RATING_AMPLE+2;
			this.butt.rating = Butt.RATING_LARGE;
			this.skin.tone = "ivory";
			this.hair.color = "black";
			this.hair.length = 4;
			initStrTouSpeInte(25, 20, 35, 42);
			initLibSensCor(75, 45, 90);
			this.weaponName = "fists";
			this.weaponVerb="punch";
			this.armorName = "skin";
			this.lust = 50;
			this.temperment = TEMPERMENT_RANDOM_GRAPPLES;
			this.level = 3;
			this.gems = rand(5) + 5;
			this.drop = new WeightedDrop().
					add(consumables.INCUBID, 1).
					add(consumables.SUCMILK, 1).
					add(consumables.SDELITE, 1);
			this.special1 = kissAttack;
			this.special2 = seduceAttack;
			this.special3 = succubusBarrage;
			checkMonster();
		}
		
	}


