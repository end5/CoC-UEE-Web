import { Consumable } from "../Consumable";

/**
 * Item that increases STR and/or VIT
 */
export class VitalityTincture extends Consumable {
    private static ITEM_VALUE: number = 15;

    public constructor() {
        super("Vital T", "Vitality T.", "a vitality tincture", VitalityTincture.ITEM_VALUE, "This potent tea is supposedly good for the strengthening the body.");
    }

    public useItem(): boolean {
        let temp: number = 0;

        this.player.slimeFeed();
        this.clearOutput();
        this.outputText("You down the contents of the bottle. The liquid is thick and tastes remarkably like cherries. Within moments, you feel much more fit and healthy.");
        // str change
        temp = VitalityTincture.rand(3);
        this.game.dynStats("str", temp);
        // Garunteed toughness if no str
        if (temp === 0) {
            temp = VitalityTincture.rand(3);
            if (temp === 0) {
                temp = 1;
            }
        }
        else {
            temp = VitalityTincture.rand(3);
        }
        // tou change
        this.game.dynStats("tou", temp);
        // Chance of fitness change
        if (this.player.HPChange(50, false)) {
            this.outputText("  Any aches, pains and bruises you have suffered no longer hurt and you feel much better.");
        }

        if (VitalityTincture.rand(3) === 0) {
            this.outputText(this.player.modTone(95, 3));
        }
        this.player.refillHunger(10);

        return false;
    }
}
