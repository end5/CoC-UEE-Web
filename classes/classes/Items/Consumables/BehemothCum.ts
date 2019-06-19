import { Consumable } from "../Consumable";

export class BehemothCum extends Consumable {
    private static ITEM_VALUE: number = 15;

    public constructor() {
        super("BhmtCum", "BhmtCum", "a sealed bottle of behemoth cum", BehemothCum.ITEM_VALUE, "This bottle of behemoth cum looks thick and viscous.  You suspect that it might boost your strength and toughness.  It also has delicious taste.");
    }

    public useItem(): boolean {
        this.clearOutput();
        this.outputText("You uncork the bottle and drink the behemoth cum; it tastes great and by the time you've finished drinking, you feel a bit stronger. ");
        this.dynStats("str", 0.5, "tou", 0.5, "lus", 5 + (this.player.cor / 5));
        this.player.HPChange(Math.round(this.player.maxHP() * .25), true);
        this.player.slimeFeed();
        this.player.refillHunger(25);
        this.player.orgasm('Lips', false);

        return false;
    }

    public getMaxStackSize(): number {
        return 5;
    }
}
