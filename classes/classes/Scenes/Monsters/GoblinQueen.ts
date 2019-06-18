	
	/**
	 * An unused monster. Still included in the build to detect breaking changes to this class.
	 */
	export class GoblinQueen extends Goblin
	{
		public  GoblinQueen() 
		{
			this.a = "the ";
			this.short = "goblin queen";
			this.imageName = "goblinqueen";
			this.long = "The goblin before you stands nearly four feet tall. Her ears appear to be pierced more times than the amount of piercings a typical goblin has. Her hair is dark green and her skin color is a vibrant yellow, a sheer rarity. She’s unlike most of the goblins you’ve seen. She’s wielding a staff in her right hand. In addition to the straps covering her body, she’s wearing a necklace seemingly carved with what looks like shark teeth. She's wielding a glowing sword in her right hand and a shield in her left hand. ";
			this.race = "Goblin";
			this.createVagina(false, Vagina.WETNESS_DROOLING, Vagina.LOOSENESS_NORMAL);
			this.createStatusEffect(StatusEffects.BonusVCapacity, 40, 0, 0, 0);
			createBreastRow(Appearance.breastCupInverse("FF"));
			this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
			this.ass.analWetness = Ass.WETNESS_DRY;
			this.createStatusEffect(StatusEffects.BonusACapacity,30,0,0,0);
			this.tallness = 47;
			this.hips.rating = Hips.RATING_AMPLE+2;
			this.butt.rating = Butt.RATING_LARGE;
			this.skin.tone = "dark green";
			this.hair.color = "dark green";
			this.hair.length = 4;
			initStrTouSpeInte(85, 65, 70, 100);
			initLibSensCor(55, 35, 65);
			this.weaponName = "sword";
			this.weaponVerb = "slash";
			this.weaponAttack = 14;
			this.armorName = "fur loincloth";
			this.armorDef = 6;
			this.fatigue = 0;
			this.bonusHP = 275;
			this.lust = 35;
			this.lustVuln = 0.4;
			this.temperment = TEMPERMENT_RANDOM_GRAPPLES;
			this.level = 14;
			this.gems = rand(15) + 15;
			this.drop = new WeightedDrop().
					add(consumables.GOB_ALE,5).
					add(weapons.W_STAFF,1).
					add(new FurLoincloth(),1).
					add(game.jewelries.MYSTRN1,1).
					addMany(1,consumables.L_DRAFT,
							consumables.PINKDYE,
							consumables.BLUEDYE,
							consumables.ORANGDY,
							consumables.GREEN_D,
							consumables.PURPDYE);
			this.special1 = goblinDrugAttack;
			this.special2 = goblinTeaseAttack;
			this.special3 = undefined; // FIXME this was 'castspell'
			checkMonster();
		}
	}

