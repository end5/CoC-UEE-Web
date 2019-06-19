import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { StatusEffects } from "../../StatusEffects";
import { kACHIEVEMENTS } from "../../GlobalFlags/kACHIEVEMENTS";
import { rand } from "../../Extra";

/**
 * Alcoholic beverage.
 */
export class FrothyBeer extends Consumable {
    public constructor() {
        super("Fr Beer", "Fr Beer", "a mug of frothy beer", ConsumableLib.DEFAULT_VALUE, "A bottle of beer from The Black Cock.");
    }

    public useItem(): boolean {
        this.outputText("Feeling parched, you twist the metal cap from the clear green bottle and chug it down. ");
        this.dynStats("lus", 15);
        this.player.refillHunger(10, false);
        if (!this.player.hasStatusEffect(StatusEffects.Drunk)) {
            this.player.createStatusEffect(StatusEffects.Drunk, 2, 1, 1, 0);
            this.dynStats("str", 0.1);
            this.dynStats("inte", -0.5);
            this.dynStats("lib", 0.25);
        }
        else {
            this.player.addStatusValue(StatusEffects.Drunk, 2, 1);
            if (this.player.statusEffectv1(StatusEffects.Drunk) < 2) this.player.addStatusValue(StatusEffects.Drunk, 1, 1);
            if (this.player.statusEffectv2(StatusEffects.Drunk) === 2) {
                this.outputText("\n\n<b>You feel a bit drunk. Maybe you should cut back on the beers?</b>");
            }
            // Get so drunk you end up peeing! Genderless can still urinate.
            if (this.player.statusEffectv2(StatusEffects.Drunk) >= 3) {
                this.outputText("\n\nYou feel so drunk; your vision is blurry and you realize something's not feeling right. Gasp! You have to piss like a racehorse! You stumble toward the nearest bush");
                if (this.player.hasVagina() && !this.player.hasCock()) this.outputText(this.player.clothedOrNakedLower(", open up your [armor]") + " and release your pressure onto the ground. ");
                else this.outputText(this.player.clothedOrNakedLower(", open up your [armor]") + " and release your pressure onto the wall. ");
                this.outputText("It's like as if the floodgate has opened! ");
                this.game.awardAchievement("Urine Trouble", kACHIEVEMENTS.GENERAL_URINE_TROUBLE, true, true, false);
                this.game.awardAchievement("Smashed", kACHIEVEMENTS.GENERAL_SMASHED, true, true, false);
                this.outputText("\n\nIt seems to take forever but it eventually stops. You look down to see that your urine has been absorbed into the ground.");
                this.player.removeStatusEffect(StatusEffects.Drunk);
                this.game.cheatTime(1 / 12);
            }
        }

        if (this.player.tone < 70) this.player.modTone(70, rand(3));
        if (this.player.femininity > 30) this.player.modFem(30, rand(3));
        return false;
    }
}
