import { Consumable } from "../Consumable";
import { Skin } from "../../BodyParts/Skin";
import { Ears } from "../../BodyParts/Ears";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

/**
 * Created by K.Quesom 11.06.14
 */

export class RizzaRoot extends Consumable {
    public constructor() {
        super(
            "RizzaRt",
            "Rizza Root",
            "a tube of rizza root strands",
            10,
            "A small ceramic tube full of fine red root strands. They smell something like citrus fruit."
        );
    }

    public useItem(): boolean {
        const tfSource: string = "rizzaRootEffect";
        this.mutations.initTransformation([2, 3, 4]);
        this.clearOutput();
        this.outputText("You chew on the thin red roots. They have a rubbery texture and the taste is something like"
            + " lemons and oranges mixed together.  The roots dry out your mouth as you chew them but at the same time they cause a cooling"
            + " and numbing sensation that’s rather pleasant.");
        if (this.changes < this.changeLimit && !this.player.hasPlainSkin() && RizzaRoot.rand(6) === 0) {
            if (this.player.hasFur()) {
                this.outputText("\n\nYour fur itches incessantly, so you start scratching it. It starts coming off in big clumps before the whole mess"
                    + " begins sloughing off your body.  In seconds, your skin is hairless, or nearly so."
                    + " <b>You've lost your fur!</b>");
            } else if (this.player.hasScales()) {
                this.outputText("\n\nYour scales itch incessantly, so you scratch at them.  They start falling off wholesale,"
                    + " leaving you standing in a pile of scales after only a few moments."
                    + " <b>You've lost your scales!</b>");
            } else if (this.player.hasGooSkin()) {
                this.outputText("\n\nYour [skinDesc] itches incessantly, and as you scratch it shifts and changes, becoming normal human-like skin."
                    + " <b>Your skin is once again normal!</b>");
            }
            this.player.skin.desc = "skin";
            this.player.skin.type = Skin.PLAIN;
            this.changes += 2;
        }
        if (this.changes < this.changeLimit && this.player.ears.type !== Ears.ELFIN && RizzaRoot.rand(4) == 0) {
            this.player.ears.type = Ears.ELFIN;
            this.changes++;
            this.outputText("\n\nA weird tingling runs through your scalp as your [hair] shifts slightly."
                + " You reach up and your hand bumps against <b>your new pointed elfin ears</b>.  You bet they look cute!");
        }
        if (RizzaRoot.rand(5) === 0) {
            this.mutations.updateOvipositionPerk(tfSource); // I doubt, that this will ever be affected, but well ... just in case
        }
        if (this.changes < this.changeLimit && this.player.tallness < 108) {
            this.player.tallness += this.changeLimit - this.changes + RizzaRoot.rand(2); // Add remaining changes as additional height
            if (this.player.tallness > 108) {
                this.player.tallness = 108;
            }
            this.outputText("\n\nA shiver runs down your spine.  You realize that it, along with the rest of your frame, is now a bit taller.");
        }
        else if (this.player.tallness >= 108) {
            this.outputText("\n\nYou don’t feel anything happening along your spine.  Perhaps this is as tall as the rizza root can make you.");
        }
        this.game.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;

        return false;
    }
}
