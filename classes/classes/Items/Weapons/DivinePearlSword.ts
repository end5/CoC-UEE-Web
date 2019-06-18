import { Weapon } from "../Weapon";

/**
 * Created by aimozg on 10.01.14.
 */

export class DivinePearlSword extends Weapon {

    public constructor() {
        super("DPSword", "DPSword", "divine pearl sword", "a holy pearl-enhanced sword", "slash", 11, 2000, "This beautiful sword shines brilliantly in the light, showing the flawless craftsmanship of its blade. The pommel and guard are heavily decorated in gold, brass and pure pearls. Some craftsman clearly poured his heart and soul into this blade while this sword had been infused with the purity of the pearl and reinforced by a master forge.", "holySword");
        this.weightCategory = Weapon.WEIGHT_MEDIUM;
    }

    public get attack(): number {
        let temp: number = 11 + (10 - this.game.player.cor / 3);
        if (temp < 10) temp = 10;
        return temp;
    }

    public canUse(): boolean {
        if (this.game.player.isPureEnough(35)) return true;
        this.outputText("You grab hold of the handle of the sword only to have it grow burning hot.  You're forced to let it go lest you burn yourself.  Something within the sword must be displeased.  ");
        return false;
    }
}
