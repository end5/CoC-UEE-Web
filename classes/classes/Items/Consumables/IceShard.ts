import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";

/**
 * A refreshing icicle.
 */
export class IceShard extends Consumable {
    public constructor() {
        super("Icicle ", "Icicle", "an ice shard", ConsumableLib.DEFAULT_VALUE, "An icicle that seems to be incapable of melting.  It numbs your hands as you hold it. ");
    }

    public useItem(): boolean {
        this.clearOutput();
        this.outputText("You give the icicle a tentative lick, careful not to stick your tongue to it. It tastes refreshing, like cool, clear glacier water.  The ice readily dissolves against the heat of your mouth as you continue to lick away at it.  Before long, the icicle has dwindled into a sliver small enough to pop into your mouth.  As the pinprick of ice melts you slide your chilled tongue around your mouth, savoring the crisp feeling.\n\n");
        if (rand(2) === 0 && (this.player.str100 < 75 || this.player.tou100 < 75)) {
            this.outputText("The rush of cold tenses your muscles and fortifies your body, making you feel hardier than ever.  ");
            if (this.player.str100 < 75) this.dynStats("str", ((1 + rand(5)) / 5));
            if (this.player.tou100 < 75) this.dynStats("tou", ((1 + rand(5)) / 5));
        }
        if (rand(2) === 0 && (this.player.spe100 > 25)) {
            this.outputText("You feel a chill spread through you; when it passes, you feel more slothful and sluggish.  ");
            if (this.player.spe100 > 25) this.dynStats("spe", -((1 + rand(5)) / 5));
        }
        if (rand(2) === 0) {
            this.outputText("You also feel a little numb all over, in more ways than one...  ");
            this.dynStats("lib", -((1 + rand(2)) / 2));
            this.dynStats("sen", -((1 + rand(2)) / 2));
        }
        this.player.refillHunger(5);

        return false;
    }
}
