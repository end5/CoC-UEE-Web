import { Weapon } from "../Weapon";

export class LustDagger extends Weapon {
    public constructor(tier: number) {
        const ids = ["L.Daggr", "L.Dagr1", "L.Dagr2"];
        const eqptNames = ["lust-enchanted dagger", "fine lust-enchanted dagger", "masterwork lust-enchanted dagger"];
        const longNames = ["an aphrodisiac-coated dagger", "a fine aphrodisiac-coated dagger", "a masterwork aphrodisiac-coated dagger"];
        super(ids[tier], "L.Dagger", eqptNames[tier], longNames[tier], "stab", 3, 40, "A dagger with a short blade in a wavy pattern.  Its edge seems to have been enchanted to always be covered in a light aphrodisiac to arouse anything cut with it.", Weapon.PERK_APHRODISIAC);
        this.weightCategory = Weapon.WEIGHT_LIGHT;
        this.tier = tier;
    }

}
