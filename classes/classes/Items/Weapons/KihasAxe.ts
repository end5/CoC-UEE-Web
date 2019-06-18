import { Weapon } from "../Weapon";

export class KihasAxe extends Weapon {

    public constructor() {
        super("KihaAxe", "Greataxe", "fiery double-bladed axe", "a fiery double-bladed axe", "fiery cleave", 20, 1000, "This large, double-bladed axe matches Kiha's axe. It's constantly flaming.", Weapon.PERK_LARGE);
        this.weightCategory = Weapon.WEIGHT_HEAVY;
    }

}
