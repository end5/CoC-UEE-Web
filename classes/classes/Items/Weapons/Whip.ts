import { Weapon } from "../Weapon";

export class Whip extends Weapon {
    public constructor(tier: number) {
        const ids = ["Whip   ", "Whip  1", "Whip  2"];
        const eqptNames = ["coiled whip", "fine coiled whip", "masterwork coiled whip"];
        const longNames = ["a coiled whip", "a fine coiled whip", "a masterwork coiled whip"];
        super(ids[tier], "Whip", eqptNames[tier], longNames[tier], "whip-crack", 5, 500, "A coiled length of leather designed to lash your foes into submission. There's a chance the bondage inclined might enjoy it!", "");
        this.weightCategory = Weapon.WEIGHT_LIGHT;
        this.tier = tier;
    }
}
