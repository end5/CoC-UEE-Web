import { Armor } from "../Armor";
import { int } from "../../Extra";
import { UndergarmentLib } from "../UndergarmentLib";

export class LethiciteArmor extends Armor {
    public constructor() {
        super("LthcArm", "Lthc. Armor", "lethicite armor", "a suit of glowing purple lethicite armor", 28, 3000, "This is a suit of lethicite armor. It's all purple and it seems to glow. The pauldrons are spiky to give this armor an imposing appearance. It doesn't seem to cover your crotch and nipples though. It appears to be enchanted to never break and you highly doubt the demons might be able to eat it!", "Heavy");
    }

    public get def(): number { return 20 + int(this.game.player.cor / 10); }

    public useText(): void {
        this.outputText("You " + this.game.player.clothedOrNaked("strip yourself naked before you ") + "proceed to put on the strange, purple crystalline armor. ");
        if (this.game.player.cor < 33) this.outputText("You hesitate at how the armor will expose your groin but you proceed to put it on anyway. ");
        if (this.game.player.cor >= 33 && this.getGame().player.cor < 66) this.outputText("You are not sure about the crotch-exposing armor. ");
        if (this.game.player.cor >= 66) this.outputText("You are eager to show off once you get yourself suited up. ");
        // Put on breastplate
        this.outputText("\n\nFirst, you clamber into the breastplate. It has imposing, spiked pauldrons to protect your shoulders. The breastplate shifts to accommodate your [chest] and when you look down, your [nipples] are exposed. ");
        if (this.game.player.biggestLactation() >= 4) this.outputText("A bit of milk gradually flows over your breastplate. ");
        // Put on leggings
        if (this.game.player.isBiped()) {
            this.outputText("\n\nNext, you slip into the leggings. By the time you get the leggings fully adjusted, you realize that the intricately-designed opening gives access to your groin! ");
            if (this.game.player.hasCock() && this.game.player.lowerGarment == UndergarmentLib.NOTHING) this.outputText("Your " + this.game.player.multiCockDescriptLight() + " hang" + (this.game.player.cocks.length == 1 ? "s" : "") + " freely. ");
            if (this.game.player.cor < 33) { // Low corruption
                if (this.game.player.lowerGarment != UndergarmentLib.NOTHING) this.outputText("Good thing you have your " + this.game.player.lowerGarment + " on!");
                else this.outputText("You blush with embarrassment. ");
            }
            else if (this.game.player.cor >= 33 && this.game.player.cor < 66) { // Medium corruption
                if (this.game.player.lowerGarment != UndergarmentLib.NOTHING) this.outputText("You are unsure about whether you should keep your " + this.game.player.lowerGarment + " on or not.");
                else this.outputText("You are unsure how you feel about your crotch being exposed to the world.");
            }
            else if (this.game.player.cor >= 66) { // High corruption
                if (this.game.player.lowerGarment != UndergarmentLib.NOTHING) this.outputText("You ponder over taking off your undergarments.");
                else this.outputText("You delight in having your nether regions open to the world.");
            }
            this.outputText(" Then, you slip your feet into the 'boots'; they aren't even covering your feet. You presume they were originally designed for demons, considering how the demons either have high-heels or clawed feet.");
        }
        else {
            this.outputText("\n\nThe leggings are designed for someone with two legs so you leave them into your pack.");
        }
        // Finishing touches
        this.outputText("\n\nFinally, you put the bracers on to protect your arms. Your fingers are still exposed so you can still get a good grip.");
        this.outputText("\n\nYou are ready to set off on your adventures!\n\n");
    }
}
