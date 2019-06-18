import { Weapon } from "../Weapon";
import { int } from "../../Extra";

export class ScarredBlade extends Weapon {

    public constructor() {
        super("ScarBld", "ScarBlade", "scarred blade", "a scarred blade", "slash", 10, 1000, "This saber, made from lethicite-imbued metal, eagerly seeks flesh; it resonates with disdain and delivers deep, jagged wounds as it tries to bury itself in the bodies of others. It only cooperates with the corrupt.");
        this.weightCategory = Weapon.WEIGHT_MEDIUM;
    }

    public get attack(): number {
        let temp: number = 10 + int((this.game.player.corAdjustedUp() - 70) / 3);
        if (temp < 10) temp = 10;
        return temp;
    }

    public canUse(): boolean {
        if (this.game.player.isCorruptEnough(70)) return true;
        this.game.sheilaScene.rebellingScarredBlade(true);
        return false;
    }

}
