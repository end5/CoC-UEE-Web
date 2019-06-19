import { CombatBuff } from "./CombatBuff";
import { rand } from "../../Extra";

export class CalledShotDebuff extends CombatBuff {

    public static TYPE = CalledShotDebuff.register("Called Shot", CalledShotDebuff);
    public constructor() {
        super(CalledShotDebuff.TYPE, 'spe');
    }

    protected apply(firstTime: boolean): void {
        this.buffHost('spe', -20 - rand(5));
    }
}
