import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { PerkLib } from "../../PerkLib";
import { StatusEffects } from "../../StatusEffects";
import { Utils } from "../../internals/Utils";

/**
 * Created by aimozg on 11.01.14.
 */

export class LustStick extends Consumable {

    public constructor() {
        super("LustStk", "LustStk", "a tube of golden lipstick", ConsumableLib.DEFAULT_VALUE, "This tube of golden lipstick is used by harpies to keep males aroused.  It has aphrodisiac properties on anyone with male genitalia and is most effective when applied to the lips or groin.");
    }

    public canUse(): boolean {
        if (this.game.player.hasCock() && this.game.player.findPerk(PerkLib.LuststickAdapted) < 0) {
            this.outputText("You look at the tube of lipstick, but get the idea it would be a pretty bad idea to smear a thick coating of cock-hardening aphrodisiacs over your own lips.  ");
            return false;
        }
        return true;
    }

    public useItem(): boolean {
        if (this.game.player.hasStatusEffect(StatusEffects.LustStickApplied)) {
            this.game.player.addStatusValue(StatusEffects.LustStickApplied, 1, Utils.rand(12) + 12);
            this.outputText("You carefully open the sweet-smelling tube and smear the lipstick over the coat you already have on your lips.  <b>No doubt another layer will make it last even longer!</b>  ");
            this.outputText("You finish and pucker your lips, feeling fairly sexy with your new, thicker makeup on.\n\n");
        }
        else {
            this.game.player.createStatusEffect(StatusEffects.LustStickApplied, 24, 0, 0, 0);
            this.outputText("You carefully open the sweet-smelling tube and smear the lipstick over your lips.  ");
            if (this.game.player.hasCock()) this.outputText("It tingles a little, but the drugs have little to no effect on you now.");
            else this.outputText("Honestly, it amazes you that something as little as a kiss can make a man putty in your hands.");
            this.outputText("  You finish and pucker your lips, feeling fairly sexy with your new makeup on.\n\n");
        }
        this.game.dynStats("lus", 1);
        return (false);
    }
}
