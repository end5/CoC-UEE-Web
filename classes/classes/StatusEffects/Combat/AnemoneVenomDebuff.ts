import { CombatBuff } from "./CombatBuff";

export class AnemoneVenomDebuff extends CombatBuff {
    public static TYPE = AnemoneVenomDebuff.register("Anemone Venom", AnemoneVenomDebuff);
    public constructor() {
        super(AnemoneVenomDebuff.TYPE, 'str', 'spe');
    }

    public applyEffect(str: number): void {
        this.host.takeLustDamage((2 * str), true);
        this.buffHost('str', -str, 'spe', -str);
    }
}
