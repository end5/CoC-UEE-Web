import { Consumable } from "../Consumable";

export class UrtaCum extends Consumable {
    private static ITEM_VALUE: number = 15;

    public constructor() {
        super("UrtaCum", "UrtaCum", "a sealed bottle of Urta's cum", UrtaCum.ITEM_VALUE, "This bottle of Urta's cum looks thick and viscous.  It's quite delicious.");
    }

    public useItem(): boolean {
        this.clearOutput();
        this.outputText("You uncork the bottle and drink the vulpine cum; it tastes great. Urta definitely produces good-tasting cum!");
        this.dynStats("sens", 1, "lus", 5 + (this.player.cor / 5));
        this.player.HPChange(Math.round(this.player.maxHP() * .25), true);
        this.player.slimeFeed();
        this.player.refillHunger(25);
        this.player.orgasm('Lips', false);

        return false;
    }
}
