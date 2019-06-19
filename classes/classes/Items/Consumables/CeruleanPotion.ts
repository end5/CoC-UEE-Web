import { Consumable } from "../Consumable";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { StatusEffects } from "../../StatusEffects";

/**
 * Item that triggers succubus events.
 */
export class CeruleanPotion extends Consumable {
    private static ITEM_VALUE: number = 75;

    public constructor() {
        super("Cerul P", "Cerulean P.", "a cerulean-tinted potion", CeruleanPotion.ITEM_VALUE, "This is a mysterious bottle filled with a sky-blue liquid that sloshes gently inside.  Supposedly it will make you irresistible, though to what or who you cannot say.");
    }

    public useItem(): boolean {
        this.player.slimeFeed();
        // Repeat genderless encounters
        this.clearOutput();
        if (this.player.gender === 0 && this.flags[kFLAGS.CERULEAN_POTION_NEUTER_ATTEMPTED] > 0) {
            this.outputText("You take another sip of the Cerulean Potion.  You find it soothing and become very excited about the possibility of another visit from the succubus.");
        }
        else if (this.player.gender === 3 && this.flags[kFLAGS.CERULEAN_SUCCUBUS_HERM_COUNTER] > 0) {
            this.outputText("With anticipation, you chug down another bottle of the Cerulean Potion. A warm sensation radiates out from your stomach as you feel the potion course through your body.");
        }
        // All else
        else {
            this.outputText("The liquid tastes rather bland and goes down easily. ");
            // Special repeat texts
            if (this.player.hasStatusEffect(StatusEffects.RepeatSuccubi)) this.outputText("You look forwards to tonight's encounter.");
            // First timer huh?
            else this.outputText("You do not notice any real effects.  Did the merchant con you?");
        }
        if (this.player.hasStatusEffect(StatusEffects.SuccubiNight)) {
            if (this.player.statusEffectv1(StatusEffects.SuccubiNight) < 3) this.player.addStatusValue(StatusEffects.SuccubiNight, 1, 1);
        }
        else this.player.createStatusEffect(StatusEffects.SuccubiNight, 1, 0, 0, 0);
        this.player.refillHunger(20);

        return false;
    }
}
