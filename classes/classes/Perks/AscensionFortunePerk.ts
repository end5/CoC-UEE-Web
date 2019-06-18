import { PerkType } from "../PerkType";
import { Perk } from "../Perk";

export class AscensionFortunePerk extends PerkType {

    public desc(params: Perk): string {
        return "(Rank: " + params.value1 + ") Increases gems gained in battles by " + params.value1 * 10 + "%.";
    }

    public constructor() {
        super("Ascension: Fortune", "Ascension: Fortune", "", "Increases gems gains by 10% per level.");
    }

    public keepOnAscension(respec: boolean = false): boolean {
        return true;
    }
}
