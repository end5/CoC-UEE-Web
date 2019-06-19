import { CombatBuff } from "./CombatBuff";

export class GnollSpearDebuff extends CombatBuff {
    public static TYPE = GnollSpearDebuff.register("Gnoll Spear", GnollSpearDebuff);
    public constructor() {
        super(GnollSpearDebuff.TYPE, 'spe');
    }

    protected apply(firstTime: boolean): void {
        this.buffHost('spe', -15);
    }
}
