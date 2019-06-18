import { PerkType } from "../PerkType";
import { Perk } from "../Perk";

/**
 * Created by aimozg on 27.01.14.
 */

export class PiercedFertitePerk extends PerkType {

    public desc(params: Perk): string {
        return "Increases cum production by " + Math.round(2 * params.value1) + "% and fertility by " + Math.round(params.value1) + ".";
    }

    public constructor() {
        super("Pierced: Fertite", "Pierced: Fertite",
            "You've been pierced with Fertite and any male or female organs have become more fertile.");
    }
}
