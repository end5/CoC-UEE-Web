import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";

/**
 * Item that boosts lactation.
 */
export class Lactaid extends Consumable {
    public constructor() {
        super("Lactaid", "Lactaid", "a pink bottle labelled \"Lactaid\"", ConsumableLib.DEFAULT_VALUE, "Judging by the name printed on this bottle, 'Lactaid' probably has an effect on the ability to lactate, and you doubt that effect is a reduction.");
    }
    public useItem(): boolean {
        this.clearOutput();
        this.player.slimeFeed();
        let i: number = 0;
        this.outputText("You gulp down the bottle of lactaid, easily swallowing the creamy liquid.");
        if (this.player.averageBreastSize() < 8) { // Bump up size!
            this.outputText("\n\n");
            if (this.player.breastRows.length === 1) this.player.growTits((1 + Lactaid.rand(5)), 1, true, 1);
            else this.player.growTits(1 + Lactaid.rand(2), this.player.breastRows.length, true, 1);
        }
        if (this.player.biggestLactation() < 1) { // Player doesn't lactate
            this.outputText("\n\nYou feel your " + this.player.nippleDescript(0) + "s become tight and engorged.  A single droplet of milk escapes each, rolling down the curves of your breasts.  <b>You are now lactating!</b>");
            for (i = 0; i < this.player.breastRows.length; i++)
                this.player.breastRows[i].lactationMultiplier += 2;
        }
        else { // Boost lactation
            this.outputText("\n\nMilk leaks from your " + this.player.nippleDescript(0) + "s in thick streams.  You're lactating even more!");
            for (i = 0; i < this.player.breastRows.length; i++)
                this.player.breastRows[i].lactationMultiplier += 1 + Lactaid.rand(10) / 10;
        }
        this.dynStats("lus", 10);
        if (Lactaid.rand(3) === 0) this.outputText(this.player.modFem(95, 1));
        return false;
    }
}
