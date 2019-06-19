import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { StatusEffects } from "../../StatusEffects";

export class HerbalContraceptive extends Consumable {
    public constructor() {
        super("HrblCnt", "HrblCnt", "a bundle of verdant green leaves", ConsumableLib.DEFAULT_VALUE, "A small bundle of verdant green leaves.");
    }

    public useItem(): boolean {
        this.clearOutput();

        // Placeholder, sue me
        this.outputText("You chew on the frankly awfully bitter leaves as quickly as possible before swallowing them down.");

        this.player.createStatusEffect(StatusEffects.Contraceptives, 1, 48, 0, 0);

        return false;
    }
}
