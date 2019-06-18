import { PerkType } from "../PerkType";
import { Perk } from "../Perk";

/**
 * Created by aimozg on 27.01.14.
 */

export class PiercedIcestonePerk extends PerkType {

    public desc(params: Perk): string {
        return "Reduces minimum lust by " + Math.round(params.value1) + ".";
    }

    public constructor() {
        super("Pierced: Icestone", "Pierced: Icestone",
            "You've been pierced with Icestone and your lust seems to stay a bit lower than before.");
    }
}
