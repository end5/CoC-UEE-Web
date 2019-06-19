import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";

export class SheepMilk extends Consumable {
    public constructor() {
        super("SheepMk", "SheepMk", "a bottle of sheep milk", ConsumableLib.DEFAULT_VALUE, "This bottle of sheep milk is said to have corruption-fighting properties.  It may be useful.");
    }

    public useItem(): boolean {
        this.player.slimeFeed();
        this.clearOutput();
        this.outputText("You gulp the bottle's contents, and its sweet taste immediately invigorates you, making you feel calm and concentrated");
        // -30 fatigue, -2 libido, -10 lust]
        this.player.changeFatigue(-30);
        this.dynStats("lib", -.25, "lus", -10, "cor", -0.5);
        this.player.refillHunger(20);

        return false;
    }
}
