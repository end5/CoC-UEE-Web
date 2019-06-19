import { Consumable } from "../Consumable";
import { Utils } from "../../internals/Utils";

/**
 * Created by aimozg on 11.01.14.
 */

export class WingStick extends Consumable {

    public constructor() {
        super("W.Stick", "Wingstick", "a wingstick", 16, "A tri-bladed throwing weapon.  Though good for only a single use, it's guaranteed to do high damage if it hits.  Inflicts 40 to 100 base damage, affected by strength.");
    }

    public canUse(): boolean {
        if (this.game.inCombat) return true;
        this.outputText("There's no one to throw it at!");
        return false;
    }

    public useItem(): boolean {
        this.clearOutput();
        this.outputText("You toss a wingstick at your foe!  It flies straight and true, almost as if it has a mind of its own as it arcs towards " + this.game.monster.a + this.game.monster.short + "!\n");
        if (this.game.monster.spe - 80 > Utils.rand(100) + 1) { // 1% dodge for each point of speed over 80
            this.outputText("Somehow " + this.game.monster.a + this.game.monster.short + "'");
            if (!this.game.monster.plural) this.outputText("s");
            this.outputText(" incredible speed allows " + this.game.monster.pronoun2 + " to avoid the spinning blades!  The deadly device shatters when it impacts something in the distance.");
        }
        else { // Not dodged
            const damage: number = 40 + Utils.rand(61) + (this.game.player.str * 2);
            this.outputText(this.game.monster.capitalA + this.game.monster.short + " is hit with the wingstick!  It breaks apart as it lacerates " + this.game.monster.pronoun2 + ". <b>(<font color=\"#800000\">" + damage + "</font>)</b>");
            this.game.monster.HP -= damage;
            if (this.game.monster.HP < 0) this.game.monster.HP = 0;
        }
        return (false);
    }

    public getMaxStackSize(): number {
        return 20;
    }
}
