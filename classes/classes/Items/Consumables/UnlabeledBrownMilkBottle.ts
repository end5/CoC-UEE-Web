import { Consumable } from "../Consumable";

export class UnlabeledBrownMilkBottle extends Consumable {
    public constructor() {
        super("UBMBottle", "UBM Bottle", "Unlabled Brown Milk Bottle", 1000, "");
    }

    public useItem(): boolean {
        this.clearOutput();
        if (!this.player.udder.hasUdder) {
            if (this.player.isMale()) {
                this.outputText("You're staggered briefly as the area above your genitals swells, quickly ballooning up into a singular hefty sac.  Your skin tingles as matching rows of teats sprout from it, leaving you with a perfectly good udder.");
            }
            if (this.player.isFemale()) {
                this.outputText("You're staggered briefly as the patch of skin between your legs swells, quickly ballooning up into a singular hefty sac.  Your skin tingles as matching rows of teats sprout from it, leaving you with a perfectly good udder.");
            }
            this.player.udder.hasUdder = true;
        } else {
            if (this.player.udder.fullness >= 1000) {
                this.outputText("You feel your udder empty itself because it cant hold anymore milk.");
                this.player.udder.fullness = 0;
            } else {
                this.outputText("You feel your udder lightly gurgle and fill with a small amount of milk.");
                this.player.udder.fullness += 10;
            }
        }
        return false;
    }
}
