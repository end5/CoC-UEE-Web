import { Weapon } from "../Weapon";

export class RidingCrop extends Weapon {
    public constructor(tier: number) {
        const ids = ["RidingC", "Riding1", "Riding2"];
        const eqptNames = ["riding crop", "fine riding crop", "masterwork riding crop"];
        const longNames = ["a riding crop", "a fine riding crop", "a masterwork riding crop"];
        super(ids[tier], "RidingC", eqptNames[tier], longNames[tier], "whip-crack", 5, 50, "This riding crop appears to be made of black leather, and could be quite a painful (or exciting) weapon.", "");
        this.weightCategory = Weapon.WEIGHT_LIGHT;
        this.tier = tier;
    }

}
