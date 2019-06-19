import { Consumable } from "../Consumable";

/**
 * Oil that reduces sensitivity.
 */
export class NumbingOil extends Consumable {
    private static ITEM_VALUE: number = 100;

    public constructor() {
        super("NumbOil", "Numb Oil", "a bottle of numbing oil", NumbingOil.ITEM_VALUE, "This bottle feels a bit warm to the touch. From the look of the label on the bottle of oil, you suspect this will make you less sensitive.");
    }

    public useItem(): boolean {
        this.outputText("You open the bottle and begin pouring the oil all over your body.\r\r");
        if (this.player.sens100 < 20) {
            this.outputText("Your skin tingles slightly, and afterwords, you feel less sensitive than before.");
        }

        if (this.player.sens100 >= 20 && this.player.sens100 < 40) {
            this.outputText("Your skin burns a bit, but eventually the burning fades away, leaving your skin less sensitive than before.");
        }

        if (this.player.sens100 >= 40 && this.player.sens100 < 60) {
            this.outputText("Your skin burns and itches unbearably for several minutes, but eventually returns to normal. You feel less sensitive than before.");
        }

        if (this.player.sens100 >= 60) {
            this.outputText("As you finish rubbing the oil into your skin, you fall gasping to your knees. It feels like someone lit you on fire, and that the fire is made of biting ants. You write in agony for a few minutes until the sensations fade. You feel slightly less sensitive than before.");
        }

        const senLoss: number = 5 + Math.floor(this.player.sens);
        this.dynStats("sen", -senLoss);

        return false;
    }
}
