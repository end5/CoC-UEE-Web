import { Armor } from "../Armor";
import { int } from "../../Extra";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

/**
 * ...
 * @author Kitteh6660
 */
export class PureMaraeArmor extends Armor {
    public constructor() {
        super("DB.Armr", "D.B.Armor", "divine bark armor", "a suit of divine bark armor", 40, 1100, "This suit of armor is finely made from the white bark you've received from Marae as a reward.", "Heavy");
    }

    public get supportsBulge(): boolean { return true; }

    public get def(): number { return 40 - int(this.game.player.cor / 5); }

    public useText(): void {
        this.outputText("You strip yourself naked before you proceed to put on the armor. ");

        this.outputText("\n\nFirst, you clamber into the breastplate. ");
        if (this.getGame().player.isBiped()) // Some variants.
        {
            if (this.getGame().player.lowerBody.type == 0) this.outputText("Then you put your feet into your boots. With the boots fully equipped, you move on to the next piece. ");
            else this.outputText("Then you attempt to put your feet into your boots. You realize that the boots are designed for someone with normal feet. You have to modify the boots to fit and when you do put on your boots, your feet are exposed. ");
        }
        this.outputText("Next, you put on your reinforced bark bracers to protect your arms.\n\n");
        if (!this.getGame().player.isTaur()) {
            this.outputText("Last but not least, you put your silken loincloth on to cover your groin. You thank Rathazul for that and you know that you easily have access to your ");
            if (this.getGame().player.hasCock()) this.outputText(this.getGame().player.multiCockDescriptLight());
            if (this.getGame().player.hasCock() && this.getGame().player.hasVagina()) this.outputText(" and ");
            if (this.getGame().player.hasVagina()) this.outputText(this.getGame().player.vaginaDescript());
            // Genderless
            if (!this.getGame().player.hasCock() && !this.getGame().player.hasVagina()) this.outputText("groin");
            this.outputText(" should you need to. ");
            if (this.getGame().player.hasCock()) {
                if (this.getGame().player.biggestCockArea() >= 40 && this.getGame().player.biggestCockArea() < 100) {
                    this.outputText("Large bulge forms against your silken loincloth. ");
                }
                if (this.getGame().player.biggestCockArea() >= 100) {
                    this.outputText("Your manhood is too big to be concealed by your silken loincloth. Part of your " + this.getGame().player.cockDescriptShort(this.getGame().player.biggestCockIndex()) + " is visible. ");
                    if (this.getGame().player.cor < 33) this.outputText("You let out a sigh. ");
                    else if (this.getGame().player.cor >= 33 && this.getGame().player.cor < 66) this.outputText("You blush a bit, not sure how you feel. ");
                    else if (this.getGame().player.cor >= 66 || this.game.flags[kFLAGS.PC_FETISH] > 0) this.outputText("You admire how your manhood is visible. ");
                }
            }
            if (this.getGame().player.cor >= 66 || this.game.flags[kFLAGS.PC_FETISH] > 0) {
                this.outputText("You'd love to lift your loincloth and show off whenever you want to. ");
            }
        }
        else {
            this.outputText("Last but not least, you take a silken loincloth in your hand but stop short as you examine your tauric body. There is no way you could properly conceal your genitals! ");
            if (this.getGame().player.cor < 33) this.outputText("You let out a sigh. Being a centaur surely is inconvenient! ");
            else if (this.getGame().player.cor >= 33 && this.getGame().player.cor < 66) this.outputText("You blush a bit, not sure how you feel. ");
            else if (this.getGame().player.cor >= 66 || this.game.flags[kFLAGS.PC_FETISH] > 0) this.outputText("Regardless, you are happy with what you are right now. ");
            this.outputText("You leave the silken loincloth in your possessions for the time being.");
        }
        this.outputText("You are suited up and all good to go. ");
    }
}
