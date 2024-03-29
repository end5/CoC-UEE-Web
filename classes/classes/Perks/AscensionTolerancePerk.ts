import { PerkType } from "../PerkType";
import { Perk } from "../Perk";
import { CharCreation } from "../CharCreation";

export class AscensionTolerancePerk extends PerkType {

    public desc(params: Perk): string {
        return "(Rank: " + params.value1 + "/" + CharCreation.MAX_TOLERANCE_LEVEL + ") Increases corruption tolerance by " + params.value1 * 5 + " and reduces corruption requirement by " + params.value1 * 5 + ".";
    }

    public constructor() {
        super("Ascension: Corruption Tolerance", "Ascension: Corruption Tolerance", "", "Increases corruption tolerance by 5 per level and reduces corruption requirement by 5 per level.");
    }

    public keepOnAscension(respec: boolean = false): boolean {
        return true;
    }
}
