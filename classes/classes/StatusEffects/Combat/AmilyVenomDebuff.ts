import { CombatBuff } from "./CombatBuff";
import { rand } from "../../Extra";

/**
 * Coded by aimozg on 24.08.2017.
 */

export class AmilyVenomDebuff extends CombatBuff {
    public static TYPE = AmilyVenomDebuff.register("Amily Venom", AmilyVenomDebuff);
    public constructor() {
        super(AmilyVenomDebuff.TYPE, 'str', 'spe');
    }

    protected apply(firstTime: boolean): void {
        this.buffHost('str', -2 - rand(5), 'spe', -2 - rand(5));
    }
}
