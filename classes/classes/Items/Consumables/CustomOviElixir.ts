/**
 * Created by aimozg on 01.04.2017.
 */
//Oviposition Elixer!
/* Notes on StatusEffects.Eggs
 v1 = egg type.
 v2 = size - 0 for normal, 1 for large
 v3 = quantity
 EGG TYPES-
 0 - brown - ass expansion
 1 - purple - hip expansion
 2 - blue - vaginal removal and/or growth of existing maleness
 3 - pink - dick removal and/or fertility increase.
 4 - white - breast growth.  If lactating increases lactation.
 5 - rubbery black
 */
export class CustomOviElixir extends Consumable {

	public  CustomOviElixir(id: string, shortName: string, longName: string, value: number, description: string) {
		super(id, shortName, longName, value, description);
	}

	public  canUse(): boolean {
		if (game.player.hasVagina()) return true;
		outputText("You pop the cork and prepare to drink the stuff, but the smell nearly makes you gag.  You cork it hastily.\n\n");
		return false;
	}

	public  useItem(): boolean {
		game.player.slimeFeed();
		outputText("You pop the cork and gulp down the thick greenish fluid.  The taste is unusual and unlike anything you've tasted before.");
		if (game.player.pregnancyType == PregnancyStore.PREGNANCY_GOO_STUFFED) {
			outputText("\n\nFor a moment you feel even more bloated than you already are.  That feeling is soon replaced by a dull throbbing pain.  It seems that with Valeria's goo filling your womb the ovielixir is unable to work its magic on you.");
				return(false);
		}
		if (game.player.pregnancyType == PregnancyStore.PREGNANCY_WORM_STUFFED) {
			outputText("\n\nFor a moment you feel even more bloated than you already are.  That feeling is soon replaced by a dull throbbing pain.  It seems that with the worms filling your womb the ovielixir is unable to work its magic on you.");
				return(false);
		}
	const  incubation: number = game.player.pregnancyIncubation;
		if (incubation == 0) { //If the player is not pregnant, get preggers with eggs!
			outputText("\n\nThe elixir has an immediate effect on your belly, causing it to swell out slightly as if pregnant.  You guess you'll be laying eggs sometime soon!");
			createPregnancy(rand(6),randBigEgg(), randEggCount());
				return(false);
		}
	var  changeOccurred: boolean = false;
		if (game.player.pregnancyType == PregnancyStore.PREGNANCY_OVIELIXIR_EGGS) { //If player already has eggs, chance of size increase!
			if (this is OvipositionMax && !player.hasPerk(PerkLib.Oviposition) && !canSpeedUp()) {
				outputText("\n\nYou start to feel a bit of a rumble. You look down at your belly, and it seems to have started a slight twitch,"
				          +" and then stops. You take a look at the empty ovimax bottle for information when suddenly your womb lurches forward"
				          +" and your stomach starts to slightly expand. Dropping the ovimax bottle to the ground, you moan as your bury your face"
				          +" in the parched earth, a silent scream leaving your mouth as the rumbling in your tummy is turning more violent,"
				          +" and more painful...and then it stops completely. You shudder in the fetal position,"
				          +" waiting for another seizure that didn't come. Maybe you should stop drinking these things.");

				// raises chance to gain the Oviposition perk due to overdosing. 1/3 per overdose.
				// Would happen, when actually laying those eggs.
				flags[kFLAGS.OVIMAX_OVERDOSE]++;
			}
			if (game.player.hasStatusEffect(StatusEffects.Eggs)) {
				//If eggs are small, chance of increase!
				if (game.player.statusEffectv2(StatusEffects.Eggs) == 0) {
					//1 in 2 chance!
					if (randDoIncEggSize()) {
						game.player.addStatusValue(StatusEffects.Eggs, 2, 1);
						outputText("\n\nYour pregnant belly suddenly feels heavier and more bloated than before.  You wonder what the elixir just did.");
						changeOccurred = true;
					}
				}
				//Chance of quantity increase!
			const  bonus: number = bonusEggQty();
				if (bonus>0) {
					outputText("\n\nA rumble radiates from your uterus as it shifts uncomfortably and your belly gets a bit larger.");
					game.player.addStatusValue(StatusEffects.Eggs, 3, bonus);
					changeOccurred = true;
				}
			}
		}
		if (!changeOccurred && canSpeedUp()) { //If no changes, speed up pregnancy.
			outputText("\n\nYou gasp as your pregnancy suddenly leaps forwards, your belly bulging outward a few inches as it gets closer to time for birthing.");
		var  newIncubation: number = doSpeedUp(incubation);
			if (newIncubation < 2) newIncubation = 2;
			game.player.knockUpForce(game.player.pregnancyType, newIncubation);
			//trace("Pregger Count New total:" + incubation);
		}
			return(false);
	}

	protected  doSpeedUp(incubation: number): number {
		return incubation - int(incubation * 0.3 + 10);
	}

	protected  canSpeedUp(): boolean {
		return game.player.pregnancyIncubation > 20 && game.player.pregnancyType != PregnancyStore.PREGNANCY_BUNNY;
	}

	protected  bonusEggQty(): number {
		return rand(2) == 0 ? rand(4) + 1 : 0;
	}

	protected  randDoIncEggSize(): boolean {
		return rand(3) == 0;
	}

	protected  randEggCount(): number {
		return rand(3) + 5;
	}

	protected  randBigEgg(): boolean {
		return false;
	}

	public  createPregnancy(type: number, big: boolean, quantity: number): void {
		game.player.knockUp(PregnancyStore.PREGNANCY_OVIELIXIR_EGGS, PregnancyStore.INCUBATION_OVIELIXIR_EGGS, 1, 1);
		game.player.createStatusEffect(StatusEffects.Eggs, type, big?1:0, quantity, 0);
	}
}

