import { Consumable } from "../Consumable";
import { StatusEffects } from "../../StatusEffects";
import { PerkLib } from "../../PerkLib";

/**
 * Lower lust significantly but has a chance of inducing the masturbation preventing effect from minotaur.
 */
export class NumbRocks extends Consumable {
    private static ITEM_VALUE: number = 15;

    public constructor() {
        super("NumbRox", "Numb Rox", "a strange packet of candy called 'Numb Rocks'", NumbRocks.ITEM_VALUE, "This packet of innocuous looking 'candy' guarantees to reduce troublesome sensations and taste delicious.");
    }

    public useItem(): boolean {
        this.clearOutput();
        this.outputText("You pop open the package of numb rocks and dump it into your waiting mouth.  The strange candy fizzes and pops, leaving the nerves on your tongue feeling a bit deadened as you swallow the sweet mess.");

        if (this.player.lust >= 33) {
            this.outputText("\n\nThe numbness spreads through your body, bringing with it a sense of calm that seems to muffle your sexual urges.");
            this.player.lust -= 20 + NumbRocks.rand(40);
        }

        if (NumbRocks.rand(5) === 0) {
            if (!this.player.hasStatusEffect(StatusEffects.Dysfunction)) {
                this.outputText("\n\nUnfortunately, the skin of ");
                if (this.player.cockTotal() > 0) {
                    this.outputText(this.player.sMultiCockDesc());
                    if (this.player.hasVagina()) this.outputText(" and");
                    this.outputText(" ");
                }
                if (this.player.hasVagina()) {
                    if (!this.player.hasCock()) this.outputText("your ");
                    this.outputText(this.player.vaginaDescript(0) + " ");
                }
                if (!(this.player.hasCock() || this.player.hasVagina())) this.outputText(this.player.assholeDescript() + " ");
                this.outputText(" numbs up too.  You give yourself a gentle touch, but are quite disturbed when you realize you can barely feel it.  You can probably still fuck something to get off, but regular masturbation is out of the question...");
                this.player.createStatusEffect(StatusEffects.Dysfunction, 50 + NumbRocks.rand(100), 0, 0, 0);
            }
            else {
                this.outputText("\n\nSadly your groin becomes even more deadened to sensation.  You wonder how much longer you'll have to wait until you can please yourself again.");
                this.player.addStatusValue(StatusEffects.Dysfunction, 1, 50 + NumbRocks.rand(100));
            }
        }
        else if (NumbRocks.rand(4) === 0 && this.player.inte > 15) {
            this.outputText("\n\nNumbness clouds your mind, making you feel slow witted and dull.  Maybe these candies weren't such an exceptio... fantas... good idea.");
            this.dynStats("int", -(1 + NumbRocks.rand(5)));
        }
        if (this.player.findPerk(PerkLib.ThickSkin) < 0 && this.player.sens100 < 30 && NumbRocks.rand(4) === 0) {
            this.outputText("Slowly, ");
            if (this.player.hasPlainSkin()) this.outputText("your skin");
            else this.outputText("the skin under your " + this.player.skin.desc);
            this.outputText(" begins to feel duller, almost... thicker.  You pinch yourself and find that your epidermis feels more resistant to damage, almost like natural armor!\n<b>(Thick Skin - Perk Gained!)</b>");
            this.player.createPerk(PerkLib.ThickSkin, 0, 0, 0, 0);
        }
        this.outputText("\n\nAfter the sensations pass, your " + this.player.skin.desc + " feels a little less receptive to touch.");
        this.dynStats("sen", -3);
        if (this.player.sens < 1) this.player.sens = 1;
        this.player.refillHunger(20);

        return false;
    }
}
