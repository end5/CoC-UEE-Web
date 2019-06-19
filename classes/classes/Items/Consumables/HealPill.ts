import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";

/**
 * Moderate boost to HP.
 *
 * Retro UTG stuff!
 */
export class HealPill extends Consumable {
    public constructor() {
        super("H. Pill", "Heal Pill", "a small healing pill", ConsumableLib.DEFAULT_VALUE, "A small healing pill that's guaranteed to heal you by a bit.");
    }

    public useItem(): boolean {
        const rand: number = Math.random() * 100;
        this.outputText("You pop the small pill into your mouth and swallow. ");

        if (this.player.HPChange(50 + this.player.tou, true)) {
            this.outputText("Some of your wounds are healed. ");
        }
        else {
            this.outputText("You feel an odd sensation. ");
        }

        if (rand < 70 && this.player.lib < 40) {
            this.outputText("You feel a sense of warmth spread through your erogenous areas.");
            this.dynStats("lib", 1);
        }

        if (rand >= 70 && rand <= 90) {
            this.outputText("Your body tingles and feels more sensitive.");
            this.dynStats("sens", 4);
        }

        if (rand > 90) {
            this.outputText("You shudder as a small orgasm passes through you. When you recover you actually feel more aroused.");
            this.dynStats("lus", 5);
        }

        return false;
    }

    public getMaxStackSize(): number {
        return 5;
    }
}
