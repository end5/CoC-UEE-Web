import { Consumable } from "../Consumable";

export class PurityPeach extends Consumable {
    private static ITEM_VALUE: number = 10;

    public constructor() {
        super("PurPeac", "PurPeac", "a pure peach", PurityPeach.ITEM_VALUE, "This is a peach from Minerva's spring, yellowy-orange with red stripes all over it.");
    }

    public useItem(): boolean {
        this.clearOutput();
        this.outputText("You bite into the sweet, juicy peach, feeling a sensation of energy sweeping through your limbs and your mind.  You feel revitalized, refreshed, and somehow cleansed.  ");
        this.player.changeFatigue(-15);
        this.player.HPChange(Math.round(this.player.maxHP() * 0.25), true);
        this.player.refillHunger(25);

        return false;
    }
}
