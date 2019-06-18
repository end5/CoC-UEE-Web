import { Weapon } from "../Weapon";

/**
 * Created by aimozg on 09.01.14.
 */

export class Fists extends Weapon {

    public constructor() {
        super("Fists  ", "Fists", "fists", "fists \n\nType: Weapon (Unarmed) \nAttack: 0 \nBase value: N/A", "punch", 0);
        this.weightCategory = Weapon.WEIGHT_LIGHT;
    }

    public useText(): void { } // No text for equipping fists

    public playerRemove() {
        return undefined;
    }

}
