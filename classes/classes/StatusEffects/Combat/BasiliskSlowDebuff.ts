import { CombatBuff } from "./CombatBuff";

export class BasiliskSlowDebuff extends CombatBuff {
    public static TYPE = BasiliskSlowDebuff.register("BasiliskSlow", BasiliskSlowDebuff);
    public constructor() {
        super(BasiliskSlowDebuff.TYPE, 'spe');
    }

    public applyEffect(amount: number): void {
        this.buffHost('spe', -amount, 'scale', false, 'max', false);
    }
}
