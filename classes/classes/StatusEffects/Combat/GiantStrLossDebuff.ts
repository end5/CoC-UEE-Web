import { CombatBuff } from "./CombatBuff";

/**
 * Coded by aimozg on 01.09.2017.
 */

export class GiantStrLossDebuff extends CombatBuff {
    public static TYPE = GiantStrLossDebuff.register("GiantStrLoss", GiantStrLossDebuff);
    public constructor() {
        super(GiantStrLossDebuff.TYPE, 'str');
    }

    public applyEffect(magnitude: number): void {
        this.buffHost('str', -magnitude);
    }
}
