import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { Skin } from "../../BodyParts/Skin";
import { rand } from "../../Extra";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

/**
 * @since March 31, 2018
 * @author Stadler76
 */
export class BlackRubberEgg extends Consumable {
    public static SMALL: number = 0;
    public static LARGE: number = 1;

    private large: boolean;

    public constructor(type: number) {
        let id: string;
        let shortName: string;
        let longName: string;
        let description: string;
        let value: number;

        switch (type) {
            case BlackRubberEgg.SMALL:
                id = "BlackEg";
                shortName = "BlackEg";
                longName = "a rubbery black egg";
                description = "This is an oblong egg, not much different from a chicken egg in appearance (save for the color)."
                    + " Something tells you it's more than just food.";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            case BlackRubberEgg.LARGE:
                id = "L.BlkEg";
                shortName = "L.BlkEg";
                longName = "a large rubbery black egg";
                description = "This is an oblong egg, not much different from an ostrich egg in appearance (save for the color)."
                    + " Something tells you it's more than just food."
                    + " For all you know, it could turn you into rubber!";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            default: // Remove this if someone manages to get SonarQQbe to not whine about a missing default ... ~Stadler76
                throw new Error("BlackRubberEgg. Incorrect or no type was passed to constructor");
        }

        super(id, shortName, longName, value, description);
        this.large = type === BlackRubberEgg.LARGE;
    }

    public useItem(): boolean {
        this.clearOutput();
        this.outputText("You devour the egg, momentarily sating your hunger.");
        // Small
        if (!this.large) {
            // Change skin to normal if not flawless!
            if ((this.player.skin.adj !== "smooth" && this.player.skin.adj !== "latex" && this.player.skin.adj !== "rubber") || this.player.skin.desc !== "skin") {
                this.outputText("\n\nYour " + this.player.skin.desc + " tingles delightfully as it ");
                if (this.player.hasPlainSkin()) this.outputText(" loses its blemishes, becoming flawless smooth skin.");
                if (this.player.hasFur()) this.outputText(" falls out in clumps, revealing smooth skin underneath.");
                if (this.player.hasScales()) this.outputText(" begins dropping to the ground in a pile around you, revealing smooth skin underneath.");
                if (this.player.hasGooSkin()) this.outputText(" shifts and changes into flawless smooth skin.");
                this.player.skin.desc = "skin";
                this.player.skin.adj = "smooth";
                if (this.player.skin.tone == "rough gray") this.player.skin.tone = "gray";
                this.player.skin.type = Skin.PLAIN;
                this.player.underBody.restore();
                this.player.arms.updateClaws(this.player.arms.claws.type);
            }
            // chance of hair change
            else {
                // If hair isn't rubbery/latex yet
                if (this.player.hair.color.indexOf("rubbery") == -1 && this.player.hair.color.indexOf("latex-textured") && this.player.hair.length !== 0) {
                    // if skin is already one...
                    if (this.player.skin.desc == "skin" && this.player.skin.adj == "rubber") {
                        this.outputText("\n\nYour scalp tingles and your " + this.player.hairDescript() + " thickens, the strands merging into ");
                        this.outputText(" thick rubbery hair.");
                        this.player.hair.color = "rubbery " + this.player.hair.color;
                        this.dynStats("cor", 2);
                    }
                    if (this.player.skin.desc == "skin" && this.player.skin.adj == "latex") {
                        this.outputText("\n\nYour scalp tingles and your " + this.player.hairDescript() + " thickens, the strands merging into ");
                        this.outputText(" shiny latex hair.");
                        this.player.hair.color = "latex-textured " + this.player.hair.color;
                        this.dynStats("cor", 2);
                    }
                }
            }
            this.player.refillHunger(20);
        }
        // Large
        if (this.large) {
            // Change skin to latex if smooth.
            if (this.player.skin.desc == "skin" && this.player.skin.adj == "smooth") {
                this.outputText("\n\nYour already flawless smooth skin begins to tingle as it changes again.  It becomes shinier as its texture changes subtly.  You gasp as you touch yourself and realize your skin has become ");
                if (rand(2) === 0) {
                    this.player.skin.desc = "skin";
                    this.player.skin.adj = "latex";
                    this.outputText("a layer of pure latex.  ");
                }
                else {
                    this.player.skin.desc = "skin";
                    this.player.skin.adj = "rubber";
                    this.outputText("a layer of sensitive rubber.  ");
                }
                this.flags[kFLAGS.PC_KNOWS_ABOUT_BLACK_EGGS] = 1;
                if (this.player.cor < 66) this.outputText("You feel like some kind of freak.");
                else this.outputText("You feel like some kind of sexy " + this.player.skin.desc + " love-doll.");
                this.dynStats("spe", -3, "sen", 8, "lus", 10, "cor", 2);
            }
            // Change skin to normal if not flawless!
            if ((this.player.skin.adj !== "smooth" && this.player.skin.adj !== "latex" && this.player.skin.adj !== "rubber") || this.player.skin.desc !== "skin") {
                this.outputText("\n\nYour " + this.player.skin.desc + " tingles delightfully as it ");
                if (this.player.hasPlainSkin()) this.outputText(" loses its blemishes, becoming flawless smooth skin.");
                if (this.player.hasFur()) this.outputText(" falls out in clumps, revealing smooth skin underneath.");
                if (this.player.hasScales()) this.outputText(" begins dropping to the ground in a pile around you, revealing smooth skin underneath.");
                if (this.player.hasGooSkin()) this.outputText(" shifts and changes into flawless smooth skin.");
                this.player.skin.desc = "skin";
                this.player.skin.adj = "smooth";
                if (this.player.skin.tone == "rough gray") this.player.skin.tone = "gray";
                this.player.skin.type = Skin.PLAIN;
                this.player.underBody.restore();
                this.player.arms.updateClaws(this.player.arms.claws.type);
            }
            // chance of hair change
            else {
                // If hair isn't rubbery/latex yet
                if (this.player.hair.color.indexOf("rubbery") == -1 && this.player.hair.color.indexOf("latex-textured") && this.player.hair.length !== 0) {
                    // if skin is already one...
                    if (this.player.skin.adj == "rubber" && this.player.skin.desc == "skin") {
                        this.outputText("\n\nYour scalp tingles and your " + this.player.hairDescript() + " thickens, the strands merging into ");
                        this.outputText(" thick rubbery hair.");
                        this.player.hair.color = "rubbery " + this.player.hair.color;
                        this.dynStats("cor", 2);
                    }
                    if (this.player.skin.adj == "latex" && this.player.skin.desc == "skin") {
                        this.outputText("\n\nYour scalp tingles and your " + this.player.hairDescript() + " thickens, the strands merging into ");
                        this.outputText(" shiny latex hair.");
                        this.player.hair.color = "latex-textured " + this.player.hair.color;
                        this.dynStats("cor", 2);
                    }
                }
            }
            this.player.refillHunger(60);
        }

        return false;
    }
}
