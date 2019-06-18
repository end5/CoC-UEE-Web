import { PerkType } from "../PerkType";
import { Perk } from "../Perk";

/**
 * Created by aimozg on 27.01.14.
 */

export class PiercedCrimstonePerk extends PerkType {

    public desc(params: Perk): string {
        return "Increases minimum lust by " + Math.round(params.value1) + ".";
    }

    public constructor() {
        super("Pierced: Crimstone", "Pierced: Crimstone",
            "You've been pierced with Crimstone and your lust seems to stay a bit higher than before.");
    }
}
