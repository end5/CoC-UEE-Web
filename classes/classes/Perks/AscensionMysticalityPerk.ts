import { PerkType } from "../PerkType";
import { Perk } from "../Perk";
import { CharCreation } from "../CharCreation";

export class AscensionMysticalityPerk extends PerkType {

    public desc(params: Perk): string {
        return "(Rank: " + params.value1 + "/" + CharCreation.MAX_MYSTICALITY_LEVEL + ") Increases spell effect multiplier by " + params.value1 * 5 + "% multiplicatively.";
    }

    public constructor() {
        super("Ascension: Mysticality", "Ascension: Mysticality", "", "Increases spell effect multiplier by 5% per level, multiplicatively.");
    }

    public keepOnAscension(respec: boolean = false): boolean {
        return true;
    }
}
