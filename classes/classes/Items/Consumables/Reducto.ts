/**
 * Created by aimozg on 11.01.14.
 */

	export class Reducto extends Consumable {
		
		public  Reducto() {
			super("Reducto", "Reducto", "a salve marked as 'Reducto'", 30, "This container full of paste can be used to shrink a body part down by a significant amount.");
		}

		public  canUse(): boolean {
			return true;
		}
		
//		override public function hasSubMenu(): boolean { return true; } //Only GroPlus and Reducto use this.
		
		public  useItem(): boolean {
		var  rdtBalls	= (game.player.balls > 0 && game.player.ballSize > 1 ? reductoBalls : undefined);
		var  rdtBreasts	= (game.player.breastRows.length > 0 && game.player.biggestTitSize() > 0 ? reductoBreasts : undefined);
		var  rdtButt	= (game.player.butt.rating > 1 ? reductoButt : undefined);
		var  rdtClit	= (game.player.vaginas.length > 0 && game.player.getClitLength() > 0.25 ? reductoClit : undefined);
		var  rdtCock	= (game.player.cockTotal() > 0 && game.player.biggestCockArea() > 6 ? reductoCock : undefined);
		var  rdtHips	= (game.player.hips.rating > 2 ? reductoHips : undefined);
		var  rdtNipples	= (game.player.nippleLength > 0.25 ? reductoNipples : undefined);
		var  rdtHorns	= (game.player.horns.value > 2 ? shrinkHorns : undefined);
			clearOutput();
			outputText("You ponder the paste in your hand and wonder what part of your body you would like to shrink.  What will you use it on?");
			kGAMECLASS.output.menu();
			kGAMECLASS.output.addButton(0, "Balls", rdtBalls);
			kGAMECLASS.output.addButton(1, "Breasts", rdtBreasts);
			kGAMECLASS.output.addButton(2, "Butt", rdtButt);
			kGAMECLASS.output.addButton(3, "Clit", rdtClit);
			kGAMECLASS.output.addButton(4, "Cock", rdtCock);
			kGAMECLASS.output.addButton(5, "Hips", rdtHips);
			kGAMECLASS.output.addButton(6, "Nipples", rdtNipples);
			kGAMECLASS.output.addButton(7, "Horns", rdtHorns);
			kGAMECLASS.output.addButton(14, "Nevermind", reductoCancel);
			return(true);
		}
		
		private  reductoBalls(): void {
			clearOutput();
			outputText("You smear the foul-smelling paste onto your " + game.player.sackDescript() + ".  It feels cool at first but rapidly warms to an uncomfortable level of heat.\n\n");
			game.player.ballSize -= Utils.rand(4) + 2;
			if (game.player.ballSize < 1) game.player.ballSize = 1;
			outputText("You feel your scrotum shift, shrinking down along with your " + game.player.ballsDescriptLight() + ".  Within a few seconds the paste has been totally absorbed and the shrinking stops.");
			game.dynStats("lib", -2, "lus", -10);
			game.inventory.itemGoNext();
		}
		
		private  reductoBreasts(): void {
			clearOutput();
			outputText("You smear the foul-smelling ointment all over your " + game.player.allBreastsDescript() + ", covering them entirely as the paste begins to get absorbed into your " + game.player.skin.desc + ".\n");
			game.player.shrinkTits(true);
			if (Utils.rand(2) == 0 && game.player.biggestTitSize() >= 1) {
				outputText("\nThe effects of the paste continue to manifest themselves, and your body begins to change again...");
				game.player.shrinkTits(true);
			}
			outputText("\nThe last of it wicks away into your skin, completing the changes.");
			game.dynStats("sen", -2, "lus", -5);
			game.inventory.itemGoNext();
		}
		
		private  reductoButt(): void {
			clearOutput();
			outputText("You smear the foul-smelling paste onto your " + game.player.buttDescript() + ".  It feels cool at first but rapidly warms to an uncomfortable level of heat.\n\n");
			if (game.player.butt.rating >= 15) {
				game.player.butt.rating -= (3 + int(game.player.butt.rating / 3));
				outputText("Within seconds you feel noticeably lighter, and a quick glance shows your ass is significantly smaller.");
			}
			else if (game.player.butt.rating >= 10) {
				game.player.butt.rating -= 3;
				outputText("You feel much lighter as your " + game.player.buttDescript() + " jiggles slightly, adjusting to its smaller size.");
			}
			else {
				game.player.butt.rating -= Utils.rand(3) + 1;
				if (game.player.butt.rating < 1) game.player.butt.rating = 1;
				outputText("After a few seconds your " + game.player.buttDescript() + " has shrunk to a much smaller size!");
			}
			game.dynStats("lib", -2, "lus", -10);
			game.inventory.itemGoNext();
		}
		
		private  reductoClit(): void {
			clearOutput();
			outputText("You carefully apply the paste to your " + game.player.clitDescript() + ", being very careful to avoid getting it on your " + game.player.vaginaDescript(0) + ".  It burns with heat as it begins to make its effects known...\n\n");
			game.player.setClitLength(game.player.getClitLength() / 1.7);
			//Set clitlength down to 2 digits in length
			game.player.setClitLength(int(game.player.getClitLength() * 100) / 100);
			outputText("Your " + game.player.clitDescript() + " shrinks rapidly, dwindling down to almost half its old size before it finishes absorbing the paste.");
			game.dynStats("sen", -2, "lus", -10);
			game.inventory.itemGoNext();
		}
		
		private  reductoCock(): void {
			clearOutput();
			if (game.player.cocks[0].cockType == CockTypesEnum.BEE) {
				outputText("The gel produces an odd effect when you rub it into your " + game.player.cockDescript(0) + ".  It actually seems to calm the need that usually fills you.  In fact, as your " + game.player.cockDescript(0) + " shrinks, its skin tone changes to be more in line with yours and the bee hair that covered it falls out.  <b>You now have a human cock!</b>");
				game.player.cocks[0].cockType = CockTypesEnum.HUMAN;
			}
			else {
				outputText("You smear the repulsive smelling paste over your " + game.player.multiCockDescriptLight() + ".  It immediately begins to grow warm, almost uncomfortably so, as your " + game.player.multiCockDescriptLight() + " begins to shrink.\n\n");
				if (game.player.cocks.length == 1) {
					outputText("Your " + game.player.cockDescript(0) + " twitches as it shrinks, disappearing steadily into your " + (game.player.hasSheath() ? "sheath" : "crotch") + " until it has lost about a third of its old size.");
					game.player.cocks[0].cockLength *= 2 / 3;
					game.player.cocks[0].cockThickness *= 2 / 3;
				}
				else { //MULTI
					outputText("Your " + game.player.multiCockDescriptLight() + " twitch and shrink, each member steadily disappearing into your " + (game.player.hasSheath() ? "sheath" : "crotch") + " until they've lost about a third of their old size.");
					for (var i: number = 0; i < game.player.cocks.length; i++) {
						game.player.cocks[i].cockLength		*= 2 / 3;
						game.player.cocks[i].cockThickness	*= 2 / 3;
					}
				}
			}
			game.dynStats("sen", -2, "lus", -10);
			game.inventory.itemGoNext();
		}
		
		private  reductoHips(): void {
			clearOutput();
			outputText("You smear the foul-smelling paste onto your [hips].  It feels cool at first but rapidly warms to an uncomfortable level of heat.\n\n");
			if (game.player.hips.rating >= 15) {
				game.player.hips.rating -= (3 + int(game.player.hips.rating / 3));
				outputText("Within seconds you feel noticeably lighter, and a quick glance at your hips shows they've gotten significantly narrower.");
			}
			else if (game.player.hips.rating >= 10) {
				game.player.hips.rating -= 3;
				outputText("You feel much lighter as your [hips] shift slightly, adjusting to their smaller size.");
			}
			else {
				game.player.hips.rating -= Utils.rand(3) + 1;
				if (game.player.hips.rating < 1) game.player.hips.rating = 1;
				outputText("After a few seconds your [hips] have shrunk to a much smaller size!");
			}
			game.dynStats("lib", -2, "lus", -10);
			game.inventory.itemGoNext();
		}
		
		private  reductoNipples(): void {
			clearOutput();
			outputText("You rub the paste evenly over your " + game.player.nippleDescript(0) + "s, being sure to cover them completely.\n\n");
			//Shrink
			if (game.player.nippleLength / 2 < 0.25) {
				outputText("Your nipples continue to shrink down until they stop at 1/4\" long.");
				game.player.nippleLength = 0.25;
			}
			else {
				outputText("Your " + game.player.nippleDescript(0) + "s get smaller and smaller, stopping when they are roughly half their previous size.");
				game.player.nippleLength /= 2;
			}
			game.dynStats("sen", -5, "lus", -5);
			game.inventory.itemGoNext();
		}
		
		public  shrinkHorns(): void {
			outputText("You doubt if the reducto is going to work but you apply the foul-smelling paste all over your horns anyways.\n\n");
			outputText("Incredibly, it works and you can feel your horns receding by an inch.")
			game.player.horns.value -= 1;
			game.inventory.itemGoNext();
		}
		
		private  reductoCancel(): void {
			clearOutput();
			outputText("You put the salve away.\n\n");
			game.inventory.returnItemToInventory(this);
		}
	}

