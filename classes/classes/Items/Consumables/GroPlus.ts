/**
 * Created by aimozg on 11.01.14.
 */

	export class GroPlus extends Consumable {
		
		public  GroPlus() {
			super("GroPlus", "GroPlus", "a needle filled with Gro+", 50, "This is a small needle with a reservoir full of blue liquid.  A faded label marks it as 'GroPlus'.  Its purpose seems obvious.");
		}

		public  canUse(): boolean {
			return true;
		}
		
//		override public function hasSubMenu(): boolean { return true; } //Only GroPlus and Reducto use this.
		
		public  useItem(): boolean {
		var  gpBalls	= (game.player.balls > 0 ? growPlusBalls : undefined);
		var  gpBreasts	= (game.player.breastRows.length > 0 ? growPlusBreasts : undefined);
		var  gpClit		= (game.player.vaginas.length > 0 ? growPlusClit : undefined);
		var  gpCock		= (game.player.cockTotal() > 0 ? growPlusCock : undefined);
		var  gpNipples	= (game.player.totalNipples() > 0 ? growPlusNipples : undefined);
			clearOutput();
			outputText("You ponder the needle in your hand knowing it will enlarge the injection site.  What part of your body will you use it on?  ");
			kGAMECLASS.output.menu();
			kGAMECLASS.output.addButton(0, "Balls", gpBalls);
			kGAMECLASS.output.addButton(1, "Breasts", gpBreasts);
			kGAMECLASS.output.addButton(2, "Clit", gpClit);
			kGAMECLASS.output.addButton(3, "Cock", gpCock);
			kGAMECLASS.output.addButton(4, "Nipples", gpNipples);
			kGAMECLASS.output.addButton(14, "Nevermind", growPlusCancel);
			return(true);
		}
		
		private  growPlusBalls(): void {
			clearOutput();
			game.player.slimeFeed();
			outputText("You sink the needle deep into your " + game.player.sackDescript() + ".  It hurts like hell, but you push down the plunger and the pain vanishes as the needles contents flow into you.\n\n");
			//1 in 4 BIG growth.
			if (Utils.rand(4) == 0) {
				outputText("You feel a trembling in your " + game.player.ballsDescriptLight() + " as the chemicals start to go to work.  You can tell they're going to be VERY effective.\n");
				game.player.ballSize += Utils.rand(4) + 2;
				outputText("They shift, stretching your " + game.player.sackDescript() + " tight as they gain inches of size.  You step to steady yourself as your center of balance shifts due to your newly enlarged " + game.player.ballsDescriptLight() + ".  ");
			}
			else {
				game.player.ballSize += Utils.rand(2) + 1;
				outputText("You feel your testicles shift, pulling the skin of your " + game.player.sackDescript() + " a little bit as they grow to " + game.player.ballsDescriptLight() + ".  ");
			}
			if (game.player.ballSize > 10) outputText("Walking gets even tougher with the swollen masses between your legs.  Maybe this was a bad idea.");
			game.dynStats("lus", 10);
			game.inventory.itemGoNext();
		}

		private  growPlusBreasts(): void {
			clearOutput();
			game.player.slimeFeed();
			outputText("You sink the needle into the flesh of your " + game.player.allBreastsDescript() + " injecting each with a portion of the needle.\n\n");
			if (game.player.breastRows.length == 1)
				game.player.growTits(Utils.rand(5) + 1, 1, true, 1);
			else
				game.player.growTits(Utils.rand(2) + 1, game.player.breastRows.length, true, 1);
			game.dynStats("lus", 10);
			game.inventory.itemGoNext();
		}

		private  growPlusClit(): void {
			clearOutput();
			game.player.slimeFeed();
			outputText("You sink the needle into your clit, nearly crying with how much it hurts.  You push down the plunger and the pain vanishes as your clit starts to grow.\n\n");
			game.player.changeClitLength(1);
			outputText("Your " + game.player.clitDescript() + " stops growing after an inch of new flesh surges free of your netherlips.  It twitches, feeling incredibly sensitive.");
			game.dynStats("sen", 2, "lus", 10);
			game.inventory.itemGoNext();
		}

		private  growPlusCock(): void {
			clearOutput();
			game.player.slimeFeed();
			outputText("You sink the needle into the base of your " + game.player.multiCockDescriptLight() + ".  It hurts like hell, but as you depress the plunger, the pain vanishes, replaced by a tingling pleasure as the chemicals take effect.\n\n");
			if (game.player.cocks.length == 1) {
				outputText("Your " + game.player.cockDescript(0) + " twitches and thickens, pouring more than an inch of thick new length from your ");
				game.player.increaseCock(0, 4);
				game.player.cocks[0].cockLength += 1; // This was forcing "what was said" to match "what actually happened" no matter what increase/growCock /actually/ did.
				game.player.cocks[0].cockThickness += 0.5; // And growCock never actually touched thickness. Nor does the new version. Thickness mod was stripped out entirely.
			}
			//MULTI
			else {
				outputText("Your " + game.player.multiCockDescriptLight() + " twitch and thicken, each member pouring out more than an inch of new length from your ");
				for (var i: number = 0; i < game.player.cocks.length; i++) {
					game.player.increaseCock(i, 2);
					game.player.cocks[i].cockLength += 1;
					game.player.cocks[i].cockThickness += 0.5;
				}
			}
			if (game.player.hasSheath())
				outputText("sheath.");
			else outputText("crotch.");
			game.dynStats("sen", 2, "lus", 10);
			game.inventory.itemGoNext();
		}

		private  growPlusNipples(): void {
			clearOutput();
			game.player.slimeFeed();
			outputText("You sink the needle into each of your " + game.player.nippleDescript(0) + "s in turn, dividing the fluid evenly between them.  Though each injection hurts, the pain is quickly washed away by the potent chemical cocktail.\n\n");
		//Grow nipples
			outputText("Your nipples engorge, prodding hard against the inside of your " + game.player.armorName + ".  Abruptly you realize they've grown more than an additional quarter-inch.\n\n");
			game.player.nippleLength += (Utils.rand(2) + 3) / 10;
			game.dynStats("lus", 15);
			//NIPPLECUNTZZZ
			if (!game.player.hasFuckableNipples() && Utils.rand(4) == 0) {
			var  nowFuckable: boolean = false;
				for (var x: number = 0; x < game.player.breastRows.length; x++) {
					if (!game.player.breastRows[x].fuckable && game.player.nippleLength >= 2) {
						game.player.breastRows[x].fuckable = true;
						nowFuckable = true;
					}
				}
				//Talk about if anything was changed.
				if (nowFuckable) outputText("Your " + game.player.allBreastsDescript() + " tingle with warmth that slowly migrates to your nipples, filling them with warmth.  You pant and moan, rubbing them with your fingers.  A trickle of wetness suddenly coats your finger as it slips inside the nipple.  Shocked, you pull the finger free.  <b>You now have fuckable nipples!</b>\n\n");
			}
			game.inventory.itemGoNext();
		}

		private  growPlusCancel(): void {
			clearOutput();
			outputText("You put the vial away.\n\n");
			game.inventory.returnItemToInventory(this);
		}
	}

