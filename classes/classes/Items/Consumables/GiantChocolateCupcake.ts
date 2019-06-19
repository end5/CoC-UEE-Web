import { Consumable } from "../Consumable";

/**
 * What exactly, is not clear?
 */
export class GiantChocolateCupcake extends Consumable {
    private static ITEM_VALUE: number = 250;

    public constructor() {
        super("CCupcak", "CCupcak", "a gigantic, chocolate cupcake", GiantChocolateCupcake.ITEM_VALUE, "A gigantic, chocolate cupcake. You could easily get full from eating this!");
    }

    public useItem(): boolean {
        this.clearOutput();
        this.outputText("You look down at the massive chocolate cupcake and wonder just how you can possibly eat it all.  It fills the over-sized wrapper and bulges out over the top, somehow looking obscene even though it's merely a baked treat.  There is a single candle positioned atop its summit, and it bursts into flame as if by magic.  Eight red gumdrops ring the outer edge of the cupcake, illuminated by the flame.\n\n");
        this.outputText("You hesitantly take a bite.  It's sweet, as you'd expect, but there's also a slightly salty, chocolaty undercurrent of flavor.  Even knowing what the minotaur put in Maddie's mix, you find yourself grateful that this new creation doesn't seem to have any of his 'special seasonings'.  It wouldn't do to be getting drugged up while you're slowly devouring the massive, muffin-molded masterpiece. Before you know it, most of the cupcake is gone and you polish off the last chocolaty bites before licking your fingers clean.\n\n");
        this.outputText("Gods, you feel heavy!  You waddle slightly as your body begins thickening, swelling until you feel as wide as a house.  Lethargy spreads through your limbs, and you're forced to sit still a little while until you let out a lazy burp.\n\n");
        this.outputText("As you relax in your sugar-coma, you realize your muscle definition is fading away, disappearing until your " + this.player.skin.desc + " looks nearly as soft and spongy as Maddie's own.  You caress the soft, pudgy mass and shiver in delight, dimly wondering if this is how the cupcake-girl must feel all the time.");
        this.outputText(this.player.modTone(0, 100));
        this.outputText(this.player.modThickness(100, 100));
        this.player.refillHunger(100);

        return false;
    }
}
