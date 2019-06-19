import { StatusEffect } from "../StatusEffect";
import { StatusEffectType } from "../StatusEffectType";

/**
 * Created by aimozg on 31.01.14.
 */

export class CombatStatusEffect extends StatusEffect {

    public constructor(stype: StatusEffectType) {
        super(stype);
    }

    public onCombatEnd(): void {
        this.remove();
    }
}
