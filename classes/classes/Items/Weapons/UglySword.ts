import { Weapon } from "../Weapon";
import { int } from "../../Extra";

export class UglySword extends Weapon {

    public constructor() {
        super("U.Sword", "U.Sword", "ugly sword", "an ugly sword", "slash", 7, 400, "This ugly sword is jagged and chipped, yet somehow perfectly balanced and unnaturally sharp. Its blade is black, and its material is of dubious origin.", "uglySword");
        this.weightCategory = Weapon.WEIGHT_MEDIUM;
    }

    public get attack(): number {
        let temp: number = 7 + int((this.game.player.corAdjustedUp() - 70) / 3);
        if (temp < 5) temp = 5;
        return temp;
    }

    public canUse(): boolean {
        if (this.game.player.isCorruptEnough(70)) return true;
        this.outputText("You grab hold of the handle of the sword only to have it grow burning hot. You're forced to let it go lest you burn yourself. Something within the sword must be disgusted. ");
        return false;
    }
}
