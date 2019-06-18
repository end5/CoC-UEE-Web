import { Weapon } from "../Weapon";

/**
 * Created by aimozg on 10.01.14.
 */

export class BeautifulSword extends Weapon {

    public constructor() {
        super("B.Sword", "B.Sword", "beautiful sword", "a beautiful shining sword", "slash", 7, 400, "This beautiful sword shines brilliantly in the light, showing the flawless craftsmanship of its blade. The pommel and guard are heavily decorated in gold and brass.  Some craftsman clearly poured his heart and soul into this blade.", "holySword");
        this.weightCategory = Weapon.WEIGHT_MEDIUM;
    }

    public get attack(): number {
        let temp: number = 7 + (10 - this.game.player.cor / 3);
        if (temp < 5) temp = 5;
        return temp;
    }

    public canUse(): boolean {
        if (this.game.player.isPureEnough(35)) return true;
        this.outputText("You grab hold of the handle of the sword only to have it grow burning hot.  You're forced to let it go lest you burn yourself.  Something within the sword must be displeased.  ");
        return false;
    }
}
