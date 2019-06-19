import { Consumable } from "../Consumable";
import { PerkLib } from "../../PerkLib";

/**
 * Item that boost milk production.
 */
export class MilkPotion extends Consumable {
    private static ITEM_VALUE: number = 120;

    public constructor() {
        super("MilkPtn", "ProLactaid", "a bottle labelled \"Pro Lactaid\"", MilkPotion.ITEM_VALUE, "A bottle filled with white liquid which is distilled from Lactaid and LaBovas.  Rathazul mentioned that this potion will greatly improve your lactation. There's the possibility of permanently lactating, even if you're a male.");
    }

    public useItem(): boolean {
        this.clearOutput();
        this.player.slimeFeed();
        let i: number = 0;
        this.outputText("You drink the milk potion.  It tastes like milk.");
        // Player doesn't lactate
        if (this.player.biggestLactation() < 1) {
            this.outputText("\n\n");
            this.outputText("You feel your " + this.player.nippleDescript(0) + "s become tight and engorged.  A single droplet of milk escapes each, rolling down the curves of your breasts.  <b>You are now lactating!</b>");
            for (i = 0; i < this.player.breastRows.length; i++) {
                this.player.breastRows[i].lactationMultiplier += 5;
            }
        }
        // Boost lactation
        else {
            this.outputText("\n\n");
            this.outputText("Milk leaks from your " + this.player.nippleDescript(0) + "s in thick streams.  You're lactating even more!");
            for (i = 0; i < this.player.breastRows.length; i++) {
                this.player.breastRows[i].lactationMultiplier += 2 + MilkPotion.rand(30) / 10;
            }
        }
        // Grant perk or rank it up
        if (MilkPotion.rand(1) === 0 && this.player.findPerk(PerkLib.MilkMaid) < 0) {
            this.outputText("\n\n");
            this.outputText("You can feel something inside your " + this.player.chestDesc() + " as they feel more dense. Your entire body tingles with a strange feel. Somehow, you know you won't be able to stop lactating.\n");
            this.outputText("<b>Gained Perk: Milk Maid! (Your milk production is increased by 200mL and you won't stop lactating.)</b>");
            this.player.createPerk(PerkLib.MilkMaid, 1, 0, 0, 0);
        }
        else if (MilkPotion.rand(this.player.perkv1(PerkLib.MilkMaid)) === 0 && this.player.perkv1(PerkLib.MilkMaid) < 10) {
            this.outputText("\n\n");
            this.outputText("You can feel something inside your " + this.player.chestDesc() + " as they feel even more dense. Your entire body tingles with a strange feel. Seems like you're going to lactate more milk.\n");
            this.outputText("<b>Perk Ranked Up: Milk Maid! (Your milk production is increased by additional 100mL.)</b>");
            this.player.addPerkValue(PerkLib.MilkMaid, 1, 1);
        }
        else if (this.player.perkv1(PerkLib.MilkMaid) >= 10) {
            this.outputText("\n\n");
            this.outputText("You can feel something tingling inside your " + this.player.chestDesc() + " but nothing special happens. <b>Maybe you've already maxed out your permanent boost to lactation?</b>\n");
        }

        return false;
    }
}
