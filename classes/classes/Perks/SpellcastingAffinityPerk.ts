import { PerkType } from "../PerkType";
import { Perk } from "../Perk";

/**
 * Created by aimozg on 27.01.14.
 */

export class SpellcastingAffinityPerk extends PerkType {

    public desc(params: Perk): string {
        return "Reduces spell costs by " + params.value1 + "%.";
    }

    public constructor() {
        super("Spellcasting Affinity", "Spellcasting Affinity", "Reduces spell costs.");
    }
}
