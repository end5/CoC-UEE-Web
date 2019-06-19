import { Shield } from "../Shield";

export class TowerShield extends Shield {
    public constructor(tier: number) {
        const ids = ["TowerSh", "TowerS1", "TowerS2"];
        const eqptNames = ["tower shield", "fine tower shield", "masterwork tower shield"];
        const longNames = ["a tower shield", "a fine tower shield", "a masterwork tower shield"];
        super(ids[tier], "TowerShld", eqptNames[tier], longNames[tier], 16, 500, "A towering metal shield. It looks heavy! The weight of this shield might incite some penalties to accuracy.");
        this.weightCategory = Shield.WEIGHT_HEAVY;
        this.tier = tier;
    }

    public canUse(): boolean {
        if (this.game.player.str >= 40) return true;
        this.outputText("This shield is too heavy for you to hold effectively. Perhaps you should try again when you have at least 40 strength?");
        return false;
    }
}
