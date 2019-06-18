import { Weapon } from "../Weapon";

export class LethicesWhip extends Weapon {

    public constructor() {
        super("L. Whip", "L. Whip", "flaming whip", "a flaming whip once belonged to Lethice", "whip-crack", 16, 2000, "This whip once belonged to Lethice who was defeated at your hands. It gives off flames when you crack this whip.");
        this.weightCategory = Weapon.WEIGHT_LIGHT;
    }

}
