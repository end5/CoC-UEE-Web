import { Weapon } from "../Weapon";

export class BrokenScarredBlade extends Weapon {

    public constructor() {
        super("B.ScarB", "B.ScarBlade", "broken scarred blade", "a broken scarred blade", "slash", 12, 1000, "This saber, made from lethicite-imbued metal, seems to no longer seek flesh; whatever demonic properties in this weapon is gone now but it's still an effective weapon.");
        this.weightCategory = Weapon.WEIGHT_LIGHT;
        this.tier = 0;
    }

}
