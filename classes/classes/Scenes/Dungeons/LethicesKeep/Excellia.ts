
	export class Excellia extends Monster
	{
		private  cowslutTeaseCocks(): void {
		var  sel: number = 0;
			if (player.hasCock()) {
				sel = rand(3);
				if (sel == 0) {
					outputText("Excellia crawls over to you while you’re distracted with her lord and wraps her arms around your waist, crushing her milk-swollen tits against your crotch. You can feel their warmth through your [armor], promising nothing but bliss in their embrace. When you push her away, you become aware of the rivers of milk she poured down your");
					if (player.isNaga())
						 outputText(" [leg]");
					else outputText(" [legs]");
					outputText(", a reminder of the woman’s insane fuckability.");
				}
				else if (sel == 1)
					 outputText("Turning about, the cow-slave aims her bubbly ass in your direction and lifts her tail, revealing both her dripping delta and the puckered star of her asshole. She looks back over her shoulder and sensuously slides her tongue across her gold-gilt lips, blowing you a pouty kiss once her mouth is suitably shiny. If she meant to distract you, she was at least partially successful.");
				else outputText("Excellia rises up onto her knees and arches her back to display her monumental mammaries, letting their chocolatey nipples jut accusingly in your direction. Her fingers travel to them, squeezing out thin flows of milk that she gathers and smears across each orb in turn, rubbing it into her skin like high-grade massage oil. When she’s finished, her tits are shining, and you’re a little hotter under the collar.");
				player.takeLustDamage(3 + (player.lib / 20) + rand(4), true);
			}
		}
		
		protected  performCombatAction(): void {
			if (rand(3) == 0) {
				cowslutTeaseCocks();
			}
			else {
				outputText("Excellia just stands and watches.");
			}
			combatRoundOver();
		}
		
		public  Excellia() {
			super();
			this.a = "";
			this.short = "Excellia";
			this.long = "";
			this.race = "Minotaur";
			this.tallness = 12 * 7;
			this.createVagina(false, 4, 4);
			this.createBreastRow(BreastCup.MMM_LARGE); //Mmm milk...
			this.balls = 0;
			this.ballSize = 0;
			this.hoursSinceCum = 0;
			this.horns.type = Horns.COW_MINOTAUR;
			this.horns.value = 7;
			this.tail.type = Tail.COW;
			this.hips.rating = Hips.RATING_FERTILE;
			this.butt.rating = Butt.RATING_EXPANSIVE;
			initStrTouSpeInte(40, 70, 45, 35);
			initLibSensCor(95, 25, 75);
			this.weaponName = "fists";
			this.weaponAttack = 20;
			this.weaponVerb = "swing";
			this.armorName = "flesh";
			this.armorDef = 15;
			this.bonusHP = 700;
			this.bonusLust = 100;
			this.gems = 75 + rand(50);
			this.level = 20;
			this.lust = 55;
			this.lustVuln = 0.55;
			this.additionalXP = 200;
			this.drop = NO_DROP;
			//drop = new WeightedDrop(consumables.PROMEAD,1);
			this.checkMonster();
		}
		
	}

