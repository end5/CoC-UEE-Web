import { Consumable } from "../Consumable";

/**
 * Item that increases INT
 */
export class ScholarsTea extends Consumable {
    private static ITEM_VALUE: number = 15;

    public constructor() {
        super("Smart T", "Scholars T.", "a cup of scholar's tea", ScholarsTea.ITEM_VALUE, "This powerful brew supposedly has mind-strengthening effects.");
    }

    public useItem(): boolean {
        this.player.slimeFeed();
        this.clearOutput();
        this.outputText("Following the merchant's instructions, you steep and drink the tea. Its sharp taste fires up your palate and in moments, you find yourself more alert and insightful. As your mind wanders, a creative, if somewhat sordid, story comes to mind. It is a shame that you do not have writing implements as you feel you could make a coin or two off what you have conceived. The strange seller was not lying about the power of the tea.");
        if (ScholarsTea.rand(3) === 0) {
            this.outputText(this.player.modTone(15, 1));
        }
        // Now NERFED!
        if (this.player.inte100 < 40) {
            this.game.dynStats("int", 1.5 + ScholarsTea.rand(4));
        }
        else if (this.player.inte100 < 60) {
            this.game.dynStats("int", 1 + ScholarsTea.rand(3));
        }
        else if (this.player.inte100 < 80) {
            this.game.dynStats("int", 0.5 + ScholarsTea.rand(2));
        }
        else {
            this.game.dynStats("int", 0.2 + ScholarsTea.rand(2));
        }

        this.player.refillHunger(10);

        return false;
    }
}
