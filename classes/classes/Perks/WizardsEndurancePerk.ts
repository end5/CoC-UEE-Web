import { PerkType } from "../PerkType";
import { Perk } from "../Perk";

/**
 * Created by aimozg on 27.01.14.
 */

export class WizardsEndurancePerk extends PerkType {

    public desc(params: Perk): string {
        return "Reduces fatigue cost of spells by " + params.value1 + "%.";
    }

    public constructor() {
        super("Wizard's Endurance", "Wizard's Endurance",
            "Your spellcasting equipment makes it harder for spell-casting to fatigue you!");
    }

    public keepOnAscension(respec: boolean = false): boolean {
        return true;
    }
}
