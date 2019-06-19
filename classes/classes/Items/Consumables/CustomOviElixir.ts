import { Consumable } from "../Consumable";
import { PregnancyStore } from "../../PregnancyStore";
import { OvipositionMax } from "./OvipositionMax";
import { PerkLib } from "../../PerkLib";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { StatusEffects } from "../../StatusEffects";
import { int } from "../../Extra";

/**
 * Created by aimozg on 01.04.2017.
 */
// Oviposition Elixer!
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

    public constructor(id: string, shortName: string, longName: string, value: number, description: string) {
        super(id, shortName, longName, value, description);
    }

    public canUse(): boolean {
        if (this.game.player.hasVagina()) return true;
        this.outputText("You pop the cork and prepare to drink the stuff, but the smell nearly makes you gag.  You cork it hastily.\n\n");
        return false;
    }

    public useItem(): boolean {
        this.game.player.slimeFeed();
        this.outputText("You pop the cork and gulp down the thick greenish fluid.  The taste is unusual and unlike anything you've tasted before.");
        if (this.game.player.pregnancyType == PregnancyStore.PREGNANCY_GOO_STUFFED) {
            this.outputText("\n\nFor a moment you feel even more bloated than you already are.  That feeling is soon replaced by a dull throbbing pain.  It seems that with Valeria's goo filling your womb the ovielixir is unable to work its magic on you.");
            return (false);
        }
        if (this.game.player.pregnancyType == PregnancyStore.PREGNANCY_WORM_STUFFED) {
            this.outputText("\n\nFor a moment you feel even more bloated than you already are.  That feeling is soon replaced by a dull throbbing pain.  It seems that with the worms filling your womb the ovielixir is unable to work its magic on you.");
            return (false);
        }
        const incubation: number = this.game.player.pregnancyIncubation;
        if (incubation == 0) { // If the player is not pregnant, get preggers with eggs!
            this.outputText("\n\nThe elixir has an immediate effect on your belly, causing it to swell out slightly as if pregnant.  You guess you'll be laying eggs sometime soon!");
            this.createPregnancy(CustomOviElixir.rand(6), this.randBigEgg(), this.randEggCount());
            return (false);
        }
        let changeOccurred: boolean = false;
        if (this.game.player.pregnancyType == PregnancyStore.PREGNANCY_OVIELIXIR_EGGS) { // If player already has eggs, chance of size increase!
            if (this instanceof OvipositionMax && !this.player.hasPerk(PerkLib.Oviposition) && !this.canSpeedUp()) {
                this.outputText("\n\nYou start to feel a bit of a rumble. You look down at your belly, and it seems to have started a slight twitch,"
                    + " and then stops. You take a look at the empty ovimax bottle for information when suddenly your womb lurches forward"
                    + " and your stomach starts to slightly expand. Dropping the ovimax bottle to the ground, you moan as your bury your face"
                    + " in the parched earth, a silent scream leaving your mouth as the rumbling in your tummy is turning more violent,"
                    + " and more painful...and then it stops completely. You shudder in the fetal position,"
                    + " waiting for another seizure that didn't come. Maybe you should stop drinking these things.");

                // raises chance to gain the Oviposition perk due to overdosing. 1/3 per overdose.
                // Would happen, when actually laying those eggs.
                this.flags[kFLAGS.OVIMAX_OVERDOSE]++;
            }
            if (this.game.player.hasStatusEffect(StatusEffects.Eggs)) {
                // If eggs are small, chance of increase!
                if (this.game.player.statusEffectv2(StatusEffects.Eggs) == 0) {
                    // 1 in 2 chance!
                    if (this.randDoIncEggSize()) {
                        this.game.player.addStatusValue(StatusEffects.Eggs, 2, 1);
                        this.outputText("\n\nYour pregnant belly suddenly feels heavier and more bloated than before.  You wonder what the elixir just did.");
                        changeOccurred = true;
                    }
                }
                // Chance of quantity increase!
                const bonus: number = this.bonusEggQty();
                if (bonus > 0) {
                    this.outputText("\n\nA rumble radiates from your uterus as it shifts uncomfortably and your belly gets a bit larger.");
                    this.game.player.addStatusValue(StatusEffects.Eggs, 3, bonus);
                    changeOccurred = true;
                }
            }
        }
        if (!changeOccurred && this.canSpeedUp()) { // If no changes, speed up pregnancy.
            this.outputText("\n\nYou gasp as your pregnancy suddenly leaps forwards, your belly bulging outward a few inches as it gets closer to time for birthing.");
            let newIncubation: number = this.doSpeedUp(incubation);
            if (newIncubation < 2) newIncubation = 2;
            this.game.player.knockUpForce(this.game.player.pregnancyType, newIncubation);
            // trace("Pregger Count New total:" + incubation);
        }
        return (false);
    }

    protected doSpeedUp(incubation: number): number {
        return incubation - int(incubation * 0.3 + 10);
    }

    protected canSpeedUp(): boolean {
        return this.game.player.pregnancyIncubation > 20 && this.game.player.pregnancyType != PregnancyStore.PREGNANCY_BUNNY;
    }

    protected bonusEggQty(): number {
        return CustomOviElixir.rand(2) == 0 ? CustomOviElixir.rand(4) + 1 : 0;
    }

    protected randDoIncEggSize(): boolean {
        return CustomOviElixir.rand(3) == 0;
    }

    protected randEggCount(): number {
        return CustomOviElixir.rand(3) + 5;
    }

    protected randBigEgg(): boolean {
        return false;
    }

    public createPregnancy(type: number, big: boolean, quantity: number): void {
        this.game.player.knockUp(PregnancyStore.PREGNANCY_OVIELIXIR_EGGS, PregnancyStore.INCUBATION_OVIELIXIR_EGGS, 1, 1);
        this.game.player.createStatusEffect(StatusEffects.Eggs, type, big ? 1 : 0, quantity, 0);
    }
}
