/**
 * Created by aimozg on 18.01.14.
 */

	export class BimboSkirt extends ArmorWithPerk {
		
		public  BimboSkirt() {
			super("BimboSk","BimboSk","bimbo skirt","A skirt that looks like it belongs on a bimbo",1,50,"A tight, cleavage-inducing halter top and an extremely short miniskirt.  The sexual allure of this item is undoubtable.","Light", PerkLib.SluttySeduction,10,0,0,0,"Your delightfully slutty yet upbeat garb helps you seduce your foes!", undefined,0,0,0,0,"", false, false);
		}
		
		public  useText(): void { //Produces any text seen when equipping the armor normally
			
		var  wornUpper: boolean = (game.player.upperGarment != UndergarmentLib.NOTHING);
		var  wornLower: boolean = (game.player.lowerGarment != UndergarmentLib.NOTHING);
			
			if (wornLower && wornLower) {
				outputText("You look very awkward wearing " + game.player.lowerGarment.longName + " while putting your skirt on.");
				outputText(" You realize that you probably won't be able to seduce many of your foes in this ludicrous outfit. For a moment you consider taking your " + game.player.lowerGarment.longName + " off, but then decide against it.");
				return;
			}
		
			game.dynStats("lus", 5);
			
			if (!wornUpper) {
				if (game.player.biggestTitSize() >= 8) {
					outputText("The halter top clings tightly to your bustline, sending a shiver of pleasure through your body. You feel how your erect [nipples] protrude from the soft fabric of your beautiful dress, and the sensation makes you feel slightly dizzy. ");
					if (game.player.isLactating()) {
						outputText("You feel how the top of your dress becomes wet, as droplets of milk leak from your [nipples]. ");
					}
				}
				else if (game.player.biggestTitSize() >= 5) {
					outputText("The halter top clings to your bustline, sending a shiver of pleasure through your body. ");
					if (game.player.isLactating()) {
						outputText("You feel how the top of your dress becomes wet, as droplets of milk leak from your [nipples]. ");
					}
					game.dynStats("lus", 2);
				}
				else if (game.player.biggestTitSize() >= 2) {
					outputText("The halter top of your sluttish outfit snugly embraces your " + game.player.breastDescript(0) + ". The sensation of the soft fabric on your bare [nipples] makes you feel warm and sexy. ");
					if (game.player.isLactating()) {
						outputText("You feel how the top of your dress becomes wet, as droplets of milk leak from your [nipples]. ");
					}
					game.dynStats("lus", 5);
				}
				else if (game.player.biggestTitSize() >= 1) {
					outputText("You feel how the soft fabric of your dress caresses your " + game.player.breastDescript(0) + ". The sensation is very erotic and you touch your sensitive [nipples], feeling the spread of arousal. You idly notice that the halter top of your whorish dress is somewhat loose, and it would feel much better if your breasts were bigger and suppler. ");
					if (game.player.isLactating()) {
						outputText("You feel how the top of your dress becomes wet, as droplets of milk leak from your [nipples]. ");
					}
					game.dynStats("lus", 10);
				}
				else {
					outputText("You feel rather stupid putting the top part on like this, but you're willing to bear with it. As you put it on, you feel how the soft fabric of your dress touches your [nipples], making them erect.");
					game.dynStats("lus", 15);
				}
				outputText("\n\n");
				game.player.orgasm('Tits',false); 
			}
			
			if (!wornLower) {
				if (game.player.butt.rating < 8) {
					outputText("The sensation of tender fabric clinging to your [butt] arouses you immensely, as you smooth your skirt. ");
				}
				else {
					outputText("You can feel how the fine fabric of your sluttish skirt doesn't quite cover your [ass]");
					if (game.player.hips.rating > 8) {
						outputText(", and how the smooth skirt is stretched by your [hips]. ");
					}
					else outputText(". ");
				}
				if (game.player.hasCock()) {
					outputText("Your [cock] becomes erect under your obscene skirt, bulging unnaturally. ");
				}
				else if (game.player.hasVagina()) {
					switch (game.player.vaginas[0].vaginalWetness) {
						case 5:
							outputText("Your juice constantly escapes your [pussy] and spoils your sexy skirt. ");
							game.dynStats("lus", 5);
							break;
						case 4:
							outputText("A thin stream of your girl-cum escapes your [pussy] and spoils your skirt. ");
							game.dynStats("lus", 5);
							break;
						case 3:
							outputText("Your [pussy] becomes all tingly and wet under your slutty skirt. ");
							game.dynStats("lus", 5);
							break;
						default: //Move along
					}
				}
				if (game.player.gender == 0) {
					outputText("Despite your lack of features, you indeed feel arousal all over your body. ");
				}
				outputText("\n\n");
				game.player.orgasm('Anal', false);
				game.player.orgasm('Vaginal', false);
			}
			
			game.player.orgasm('Lips',false);
		}
	
		public  get supportsUndergarment(): boolean {
			return game.player.isPureEnough(10);
		}
		
		public  canUse(): boolean {
			
		var  wornUpper: boolean = game.player.upperGarment != UndergarmentLib.NOTHING;
		var  wornLower: boolean = game.player.lowerGarment != UndergarmentLib.NOTHING;
			
			if (!game.player.isPureEnough(10)) {
				if (wornUpper || wornLower) {
				var  output: string = "";
					output += "It would be awkward to put on " + longName + " when you're currently wearing ";
					if (wornUpper) {
						output += game.player.upperGarment.longName;
						wornUpper = true;
					}
					if (wornLower) {
						if (wornUpper) {
							output += " and ";
						}
						output += game.player.lowerGarment.longName;
					}
					output += ". You should consider removing them. You put it back into your inventory.";
					outputText(output);
					return false;
				}
				else 
					return true;
			}
			return true;
		}
	}
	
	

