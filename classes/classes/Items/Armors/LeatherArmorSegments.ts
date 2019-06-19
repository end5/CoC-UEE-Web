import { Armor } from "../Armor";

/**
 * Created by aimozg on 18.01.14.
 */

export class LeatherArmorSegments extends Armor {

    public constructor() {
        super("UrtaLta", "UrtaLta", "leather armor segments", "leather armor segments", 5, 76, undefined, "Light", true);
    }
    public removeText(): void {
        this.outputText("You have your old set of " + this.game.armors.LEATHRA.longName + " left over.  ");
    }

    public playerRemove(): Armor {
        super.playerRemove();
        return this.game.armors.LEATHRA;
    }
}
