import { Consumable } from "../Consumable";
import { StatusEffects } from "../../StatusEffects";

/**
 * Increases sensitivity.
 */
export class SensitivityDraft extends Consumable {
    private static ITEM_VALUE: number = 15;

    public constructor() {
        super("SensDrf", "SensDraft", "a bottle of sensitivity draft", SensitivityDraft.ITEM_VALUE, "This carefully labelled potion is a 'Sensitivity Draft', and if the diagrams are any indication, it will make your body more sensitive.");
    }

    public useItem(): boolean {
        this.player.slimeFeed();
        this.clearOutput();
        this.outputText("You pop the cork on this small vial and drink down the clear liquid.  It makes your lips and tongue tingle strangely, letting you feel each globule of spit in your mouth and each breath of air as it slides past your lips.");

        if (this.player.hasStatusEffect(StatusEffects.Dysfunction)) {
            this.outputText("\n\nThankfully, the draft invigorates your groin, replacing the numbness with waves of raw sensation.  It seems your crotch is back to normal and <b>you can masturbate again!</b>");
            this.player.removeStatusEffect(StatusEffects.Dysfunction);
        }
        if (SensitivityDraft.rand(4) === 0 && !this.player.hasStatusEffect(StatusEffects.LustyTongue)) {
            this.outputText("The constant tingling in your mouth grows and grows, particularly around your lips, until they feel as sensitive as ");
            if (this.player.hasVagina()) this.outputText("your");
            else this.outputText("a woman's");
            this.outputText(" lower lips.  You'll have to be careful not to lick them!");
            // (Lustytongue status)
            this.player.createStatusEffect(StatusEffects.LustyTongue, 25, 0, 0, 0);
        }
        this.outputText("\n\nAfter the wave of sensation passes, your " + this.player.skin.desc + " feels a little more receptive to touch.  ");
        if (this.player.lust100 > 70 || this.player.lib100 > 70) {
            this.outputText("You shiver and think of how much better it'll make sex and masturbation.");
        }
        else this.outputText("You worry it'll make it harder to resist the attentions of a demon.");
        this.dynStats("sen", 10, "lus", 5);
        this.player.refillHunger(5);

        return false;
    }
}
