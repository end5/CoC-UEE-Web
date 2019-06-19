import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

export class FishFillet extends Consumable {
    public constructor() {
        super("FishFil", "FishFil", "a fish fillet", ConsumableLib.DEFAULT_VALUE, "A perfectly cooked piece of fish.  You're not sure what type of fish is, since you're fairly certain \"delicious\" is not a valid species.");
    }

    public useItem(): boolean {
        this.clearOutput();
        if (!this.getGame().inCombat) this.outputText("You sit down and unwrap your fish fillet. It's perfectly flaky, allowing you to break it off in bite-sized chunks.  The salty meal disappears quickly, and your stomach gives an appreciative gurgle.");
        // (In combat?)
        else this.outputText("You produce the fish fillet from your bag.  Rather than unwrap it and savor the taste as you normally would, you take a large bite out of it, leaf wrapping and all.  In no time your salty meal is gone, your stomach giving an appreciative gurgle.  ");

        // Increase HP by quite a bit!)
        // (Slight chance at increasing Toughness?)
        // (If lake has been tainted, +1 Corruption?)
        if (this.flags[kFLAGS.FACTORY_SHUTDOWN] == 2) this.dynStats("cor", 0.5);
        if (this.flags[kFLAGS.FACTORY_SHUTDOWN] == 1) this.dynStats("cor", -0.1);
        this.dynStats("cor", 0.1);
        this.player.HPChange(Math.round(this.player.maxHP() * .25), true);
        this.player.refillHunger(30);

        return false;
    }
}
