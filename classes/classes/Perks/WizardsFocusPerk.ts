import { PerkType } from "../PerkType";
import { Perk } from "../Perk";

/**
 * Created by aimozg on 27.01.14.
 */

export class WizardsFocusPerk extends PerkType {

    public desc(params: Perk): string {
        return "Increases your spell effect modifier by " + params.value1 * 100 + "%.";
    }

    public constructor() {
        super("Wizard's Focus", "Wizard's Focus",
            "Your wizard's staff grants you additional focus, reducing the use of fatigue for spells.");
    }

    public keepOnAscension(respec: boolean = false): boolean {
        return true;
    }
}
