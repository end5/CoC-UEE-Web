import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

/**
 * @since March 26, 2018
 * @author Stadler76
 */
export class LustDraft extends Consumable {
    public static STANDARD: number = 0;
    public static ENHANCED: number = 1;

    private fuck: boolean;

    public constructor(type: number) {
        let id: string;
        let shortName: string;
        let longName: string;
        let description: string;
        let value: number;

        switch (type) {
            case LustDraft.STANDARD:
                id = "L.Draft";
                shortName = "LustDraft";
                longName = "a vial of roiling bubble-gum pink fluid";
                description = 'This vial of bright pink fluid bubbles constantly inside the glass, as if eager to escape.'
                    + ' It smells very sweet, and has "Lust" inscribed on the side of the vial.';
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            case LustDraft.ENHANCED:
                id = "F.Draft";
                shortName = "FuckDraft";
                longName = 'a vial of roiling red fluid labeled "Fuck Draft"';
                description = 'This vial of red fluid bubbles constantly inside the glass, as if eager to escape.'
                    + ' It smells very strongly, though its odor is difficult to identify.'
                    + '  The word "Fuck" is inscribed on the side of the vial.';
                value = 20;
                break;

            default: // Remove this if someone manages to get SonarQQbe to not whine about a missing default ... ~Stadler76
                throw new Error("LustDraft. Incorrect or no type was passed to constructor");
        }

        super(id, shortName, longName, value, description);
        this.fuck = type === LustDraft.ENHANCED;
    }

    public useItem(): boolean {
        this.player.slimeFeed();
        this.clearOutput();
        this.outputText("You drink the " + (this.fuck ? "red" : "pink") + " potion, and its unnatural warmth immediately flows to your groin.");
        this.dynStats("lus", (30 + LustDraft.rand(this.player.lib / 10)), "scale", false);

        // Heat/Rut for those that can have them if "fuck draft"
        if (this.fuck) {
            // Try to go into intense heat.
            this.player.goIntoHeat(true, 2);
            // Males go into rut
            this.player.goIntoRut(true);
        }
        // ORGAZMO
        if (this.player.lust >= this.player.maxLust() && !kGAMECLASS.inCombat) {
            this.outputText("\n\nThe arousal from the potion overwhelms your senses and causes you to spontaneously orgasm."
                + " You rip off your [armor] and look down as your "
                + "[if (hasCock)[cocks] erupt[if (cocks == 1)s] in front of you, liberally spraying the ground around you. "
                + "[if (hasVagina)At the same time your ]" // Had to do this, since parser-weirdness with [if (hasCock && hasVagina)]
                + "]"
                + "[if (hasVagina)[vagina] soaks your thighs. ]"
                + "[if (isGenderless)body begins to quiver with orgasmic bliss. ]"
                + "Once you've had a chance to calm down, you notice that the explosion of pleasure you just experienced"
                + " has rocked you to your core. You are a little hornier than you were before.");
            // increase player libido, and maybe sensitivity too?
            this.player.orgasm('Generic');
            this.dynStats("lib", 2, "sen", 1);
        }
        if (this.player.lust > this.player.maxLust()) this.player.lust = this.player.maxLust();
        this.outputText("\n\n");
        this.player.refillHunger(5);
        return false;
    }
}
