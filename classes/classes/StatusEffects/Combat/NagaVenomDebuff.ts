import { CombatBuff } from "./CombatBuff";
import { rand } from "../../Extra";
import { PerkLib } from "../../PerkLib";

export class NagaVenomDebuff extends CombatBuff {

    public static TYPE = NagaVenomDebuff.register("Naga Venom", NagaVenomDebuff);
    public constructor() {
        super(NagaVenomDebuff.TYPE, 'spe');
    }

    protected apply(first: boolean): void {
        const debuff: any = this.buffHost('spe', first ? -3 : -2);
        if (debuff.spe == 0) this.host.takeDamage(5 + rand(5));
        this.host.takeDamage(5 + rand(5));
    }

    public onCombatRound(): void {
        // Chance to cleanse!
        if (this.host.hasPerk(PerkLib.Medicine) && rand(100) <= 14) {
            if (this.playerHost) NagaVenomDebuff.game.outputText("You manage to cleanse the naga venom from your system with your knowledge of medicine!\n\n");
            this.remove();
            return;
        }
        const debuff: any = this.buffHost('spe', -2);
        if (debuff.spe == 0) this.host.takeDamage(5);
        this.host.takeDamage(2);
        if (this.playerHost) NagaVenomDebuff.game.outputText("You wince in pain and try to collect yourself, the naga's venom still plaguing you.\n\n");
    }
}
