import { PerkType } from "../PerkType";
import { Perk } from "../Perk";
import { CharCreation } from "../CharCreation";

export class AscensionWisdomPerk extends PerkType {

    public desc(params: Perk): string {
        return "(Rank: " + params.value1 + "/" + CharCreation.MAX_WISDOM_LEVEL + ") Increases experience gained in battles by " + params.value1 * 10 + "%.";
    }

    public constructor() {
        super("Ascension: Wisdom", "Ascension: Wisdom", "", "Increases experience gains by 10% per level.");
    }

    public keepOnAscension(respec: boolean = false): boolean {
        return true;
    }
}
