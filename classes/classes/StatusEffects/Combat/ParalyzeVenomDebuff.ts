import { CombatBuff } from "./CombatBuff";

export class ParalyzeVenomDebuff extends CombatBuff {

    public static TYPE = ParalyzeVenomDebuff.register("paralyze venom", ParalyzeVenomDebuff);
    public constructor() {
        super(ParalyzeVenomDebuff.TYPE, 'str', 'spe');
    }

    public onRemove(): void {
        if (this.playerHost) {
            ParalyzeVenomDebuff.game.outputText("<b>You feel quicker and stronger as the paralyzation venom in your veins wears off.</b>\n\n");
        }
    }

    protected apply(firstTime: boolean): void {
        this.buffHost('str', firstTime ? -2 : -3, 'spe', firstTime ? -2 : -3);
    }

}
