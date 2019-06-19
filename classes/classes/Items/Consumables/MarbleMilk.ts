import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { StatusEffects } from "../../StatusEffects";
import { PerkLib } from "../../PerkLib";
import { rand } from "../../Extra";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

/**
 * Milk with restorative and addictive properties.
 */
export class MarbleMilk extends Consumable {
    public constructor() {
        super("M. Milk", "M. Milk", "a clear bottle of milk from Marble", ConsumableLib.DEFAULT_VALUE, "A clear bottle of milk from Marble's breasts. It smells delicious.");
    }

    public useItem(): boolean {
        this.player.slimeFeed();
        // Bottle of Marble's milk - item
        // Description: "A clear bottle of milk from Marble's breasts.  It smells delicious.  "
        this.clearOutput();
        // Text for when the player uses the bottle:
        // [before the player is addicted, Addiction < 30]
        if (this.player.statusEffectv2(StatusEffects.Marble) < 30 && this.player.statusEffectv3(StatusEffects.Marble) === 0) this.outputText("You gulp down the bottle's contents; Marble makes some good tasting milk.\n\n");
        // [before the player is addicted, Addiction < 50]
        else if (this.player.statusEffectv3(StatusEffects.Marble) <= 0) this.outputText("You gulp down the bottle's contents; Marble makes some really good tasting milk.\n\n");
        else if (this.player.statusEffectv3(StatusEffects.Marble) > 0) {
            // [player is completely addicted]
            if (this.player.findPerk(PerkLib.MarblesMilk) >= 0) this.outputText("You gulp down the bottle's contents; it's no substitute for the real thing, but it's a nice pick me up.\n\n");
            else {
                // [player is no longer addicted]
                if (this.player.findPerk(PerkLib.MarbleResistant) >= 0) this.outputText("You gulp down the bottle's contents; you're careful not to get too attached to the taste.\n\n");
                // [player is addicted]
                else this.outputText("You gulp down the bottle's contents; you really needed that.\n\n");
            }
        }
        // Increases addiction by 5, up to a max of 50 before the player becomes addicted, no max after the player is addicted.
        kGAMECLASS.marbleScene.marbleStatusChange(0, 5);
        // Does not apply the 'Marble's Milk' effect
        // Purge withdrawl
        if (this.player.hasStatusEffect(StatusEffects.MarbleWithdrawl)) {
            this.player.removeStatusEffect(StatusEffects.MarbleWithdrawl);
            this.game.dynStats("tou", 5, "int", 5);
            this.outputText("You no longer feel the symptoms of withdrawal.\n\n");
        }
        // Heals the player 70-100 health
        this.player.HPChange(70 + rand(31), true);
        // Restores a portion of fatigue (once implemented)
        this.player.changeFatigue(-25);
        // If the player is addicted, this item negates the withdrawal effects for a few hours (suggest 6), there will need to be a check here to make sure the withdrawal effect doesn't reactivate while the player is under the effect of 'Marble's Milk'.
        if (this.player.hasStatusEffect(StatusEffects.BottledMilk)) {
            this.player.addStatusValue(StatusEffects.BottledMilk, 1, (6 + rand(6)));
        }
        else this.player.createStatusEffect(StatusEffects.BottledMilk, 12, 0, 0, 0);
        this.player.refillHunger(20);

        return false;
    }
}
