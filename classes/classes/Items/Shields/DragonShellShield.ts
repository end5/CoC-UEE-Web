import { Shield } from "../Shield";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

/**
 * Created by aimozg on 10.01.14.
 */

export class DragonShellShield extends Shield {

    public constructor(upgraded: boolean) {
        const id: string = upgraded ? "RDgnShl" : "DrgnShl";
        const sname: string = upgraded ? "RDgnShl" : "DrgnShl";
        const ename: string = upgraded ? "runed dragon-shell shield" : "dragon-shell shield";
        const lname: string = upgraded ? "a dragon-shell shield with rune markings" : "a dragon-shell shield";
        const tier: number = upgraded ? 1 : 0;
        super(id, sname, ename, lname, 14, 1500, "", Shield.PERK_ABSORPTION);
        this.weightCategory = Shield.WEIGHT_MEDIUM;
    }

    public get shortName(): string { // Don't display +1 for runed shield.
        return this._shortName;
    }

    public get description(): string {
        let desc: string = this.game.flags[kFLAGS.EMBER_HATCHED] > 0 ? "A durable shield that has been forged from the dragon eggshell Ember gave you for maxing out " + this.game.emberScene.emberMF("his", "her") + " affection." : "A durable shield that has been forged from the remains of the dragon egg you found in the swamp.";
        desc += " Absorbs any fluid attacks you can catch, rendering them useless.";
        if (this.tier > 0) desc += " This shield has since been enhanced and now intricate glowing runes surround the edges in addition to more imposing spiky appearance.";
        // Type
        desc += "\n\nType: Shield";
        // Block Rating
        desc += "\nBlock: " + String(this.block);
        // Value
        desc += "\nBase value: " + String(this.value);
        return desc;
    }

    public useText(): void { // Produces any text seen when equipping the armor normally
        if (this.game.flags[kFLAGS.TIMES_EQUIPPED_EMBER_SHIELD] == 0) {
            this.clearOutput();
            this.outputText("Turning the sturdy shield over in inspection, you satisfy yourself as to its craftsmanship and adjust the straps to fit your arm snugly.  You try a few practice swings, but find yourself overbalancing at each one due to the deceptive lightness of the material.  Eventually, though, you pick up the knack of putting enough weight behind it to speed it through the air while thrusting a leg forward to stabilize yourself, and try bashing a nearby rock with it.  You smile with glee as ");
            if (this.game.player.str < 80) this.outputText("bits and pieces from the surface of the");
            else this.outputText("huge shards of the shattered");
            this.outputText(" rock are sent flying in all directions.");
            this.outputText("\n\nAfter a few more practice bashes and shifts to acquaint yourself with its weight, you think you're ready to try facing an enemy with your new protection.  One last thing... taking off the shield and turning it straps-down, you spit onto the surface.  Satisfyingly, the liquid disappears into the shell as soon as it touches.");
        }
        else {
            this.outputText("You equip " + this.longName + ".  ");
        }
        this.game.flags[kFLAGS.TIMES_EQUIPPED_EMBER_SHIELD]++;
    }

}
