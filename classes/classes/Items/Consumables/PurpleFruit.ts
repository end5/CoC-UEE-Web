import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";

/**
 * A purple fruit from Essrayle.
 */
export class PurpleFruit extends Consumable {
    public constructor() {
        super("PrFruit", "PrFruit", "a purple fruit", ConsumableLib.DEFAULT_VALUE, "This sweet-smelling produce looks like an eggplant, but feels almost squishy, and rubbery to the touch. Holding it to your ear, you think you can hear some fluid sloshing around inside.");
    }

    public useItem(): boolean {
        let temp: number = 0;

        this.player.slimeFeed();
        this.clearOutput();
        this.outputText("You bite into the fruit Essrayle gave you with little hesitation.  It's amazingly sweet, with a texture that's rather gummy.  The juice is a candied grape syrup that fills your cheeks and flows down your throat with far more fluid than the size of the plant should allow.  You hastily devour the entire thing, unable to stop yourself once you've started.");
        this.outputText("\n\nA tingling warmth shifts to a roaring inferno in your veins, your heart-rate spiking abruptly.  The intensity of it almost makes your body feel molten!  But, as quickly as it came, the sensation fades into merely a pleasing warmth that settles in your chest.");
        if (this.player.averageNipplesPerBreast() < 4) {
            this.outputText("  At first you think nothing has changed, but a second look confirms that your breasts now sport the same quartet of cow-like nipples the bovine plant-girl bears.");
            if (this.player.nippleLength < 4) this.player.nippleLength = 4;
            temp = this.player.bRows();
            while (temp > 0) {
                temp--;
                this.player.breastRows[temp].nipplesPerBreast = 4;
            }
        }
        // [Player gains quad nipples, milk production and libido way up]
        this.dynStats("lib", 5);
        this.player.boostLactation(3 * this.player.bRows());
        this.player.refillHunger(30);

        return false;
    }
}
