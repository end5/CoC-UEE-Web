import { CombatBuff } from "./CombatBuff";
import { PerkLib } from "../../PerkLib";
import { rand } from "../../Extra";

/**
 * Coded by aimozg on 01.09.2017.
 */

export class DriderIncubusVenomDebuff extends CombatBuff {
    public static TYPE = DriderIncubusVenomDebuff.register("Drider Incubus Venom", DriderIncubusVenomDebuff);
    public constructor() {
        super(DriderIncubusVenomDebuff.TYPE, 'str');
    }

    protected apply(firstTime: boolean): void {
        // -5 perm -30 temp
        this.host.dynStats('str', -5);
        this.buffHost('str', -30);
    }
    public onCombatRound(): void {
        // Chance to cleanse!
        if (this.host.findPerk(PerkLib.Medicine) >= 0 && rand(100) <= 14) {
            if (this.playerHost) DriderIncubusVenomDebuff.game.outputText("You manage to cleanse the drider incubus venom from your system with your knowledge of medicine!\n\n");
            this.remove();
        }
    }
}
