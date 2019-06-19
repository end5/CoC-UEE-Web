import { Consumable } from "../Consumable";
import { rand } from "../../Extra";
import { Horns } from "../../BodyParts/Horns";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

/**
 * Holiday festive item that might give you antlers.
 */
export class WinterPudding extends Consumable {

    public constructor() {
        super("W.Pddng", "W.Pudding", "a slice of winter pudding", 35, "A slice of delicious Winter Pudding. It smells delicious. \n\nNote: Eating this might cause antlers to grow from your head.");
    }

    public useItem(): boolean {
        const tfSource: string = "winterPudding";
        this.changes = 0;
        this.changeLimit = 2;
        this.outputText("You stuff the stodgy pudding down your mouth, the taste of brandy cream sauce and bitter black treacle sugar combining in your mouth.  You can tell by its thick spongy texture that it's far from good for you, so its exclusivity is more than likely for the best.");
        this.player.refillHunger(30);
        if (this.player.thickness < 100 || this.player.tone > 0) {
            // outputText("\n\nYou feel your waist protrude slightly.  Did you just put on a little weight?  It sure looks like it.");
            this.outputText(this.player.modTone(0, 2));
            this.outputText(this.player.modThickness(100, 2));
        }
        this.outputText("\n\nYou lick your lips clean, savoring the taste of the Winter Pudding.  You feel kinda antsy...");
        // [Decrease player tone by 5, Increase Lust by 20, Destroy item.]
        this.dynStats("lus", (10 + this.player.lib / 10), "scale", false);

        // [Optional, give the player antlers! (30% chance) Show this description if the player doesn't have horns already.]
        if (this.player.horns.value == 0 && rand(2) === 0) {
            this.outputText("\n\nYou hear the sound of cracking branches erupting from the tip of your skull.  Small bulges on either side of your head advance outwards in a straight line, eventually spreading out in multiple directions like a miniature tree.  Investigating the exotic additions sprouting from your head, the situation becomes clear.  <b>You've grown antlers!</b>");
            // [Player horn type changed to Antlers.]
            this.player.horns.type = Horns.ANTLERS;
            this.player.horns.value = 4 + rand(12);
            this.changes++;
        }
        // [Show this description instead if the player already had horns when the transformation occurred.]
        else if (this.player.horns.value > 0 && this.player.horns.type !== Horns.ANTLERS && rand(2) === 0) {
            this.outputText("\n\nYou hear the sound of cracking branches erupting from the tip of your skull.  The horns on your head begin to twist and turn fanatically, their texture and size morphing considerably until they resemble something more like trees than anything else.  Branching out rebelliously, you've come to the conclusion that <b>you've somehow gained antlers!</b>");
            // [Player horn type changed to Antlers.]
            this.player.horns.type = Horns.ANTLERS;
            this.player.horns.value = 4 + rand(12);
            this.changes++;
        }
        if (rand(5) === 0) this.mutations.updateOvipositionPerk(tfSource); // I doubt, that winterPudding will ever be affected, but well ... just in case
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;
        return false;
    }

}
