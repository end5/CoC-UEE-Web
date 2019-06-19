import { Consumable } from "../Consumable";
import { StatusEffects } from "../../StatusEffects";

/**
 * A spellbook that teaches the player one the following spells: 'Arouse', 'Heal' or 'Might'.
 * May also raise int.
 */
export class BlackSpellBook extends Consumable {
    private static ITEM_VALUE: number = 40;

    public constructor() {
        super("B. Book", "B. Book", "a small book with a midnight-black cover", BlackSpellBook.ITEM_VALUE, "This solid black book is totally unmarked, saved for a blood red clasp that holds the covers closed until you are ready to read it.  The pages are edged with gold, like some of the fancy books in the monastery back home.");
    }

    public useItem(): boolean {
        this.clearOutput();
        this.outputText("You open the small black book, and discover it to be an instructional book on the use of black magic.  Most of it is filled with generic information about black magic - how it is drawn from emotions (typically lust), and how it has the power to affect bodies and emotions.  It also warns against using it on oneself, as it is difficult to draw on your emotions while meddling with your own body.  In no time at all you've read the whole thing, but it disappears into thin air before you can put it away.");
        if (this.player.inte100 < 30) {
            this.outputText("\n\nYou feel greatly enlightened by your time spent reading.");
            this.dynStats("int", 4);
        }
        else if (this.player.inte100 < 60) {
            this.outputText("\n\nSpending some time reading was probably good for you, and you definitely feel smarter for it.");
            this.dynStats("int", 2);
        }
        else if (this.player.inte100 < 80) {
            this.outputText("\n\nAfter reading the small tome your already quick mind feels invigorated.");
            this.dynStats("int", 1);
        }
        else {
            this.outputText("\n\nThe contents of the book did little for your already considerable intellect.");
            this.dynStats("int", .6);
        }
        // Smart enough for arouse and doesnt have it
        if (this.player.inte >= 25 && !this.player.hasStatusEffect(StatusEffects.KnowsArouse)) {
            this.outputText("\n\nYou blink in surprise, assaulted by the knowledge of a <b>new spell: Arouse.</b>");
            this.player.createStatusEffect(StatusEffects.KnowsArouse, 0, 0, 0, 0);
            return false;
        }
        // Smart enough for arouse and doesnt have it
        if (this.player.inte >= 30 && !this.player.hasStatusEffect(StatusEffects.KnowsHeal)) {
            this.outputText("\n\nYou blink in surprise, assaulted by the knowledge of a <b>new spell: Heal.</b>");
            this.player.createStatusEffect(StatusEffects.KnowsHeal, 0, 0, 0, 0);
            return false;
        }
        // Smart enough for arouse and doesnt have it
        if (this.player.inte >= 40 && !this.player.hasStatusEffect(StatusEffects.KnowsMight)) {
            this.outputText("\n\nYou blink in surprise, assaulted by the knowledge of a <b>new spell: Might.</b>");
            this.player.createStatusEffect(StatusEffects.KnowsMight, 0, 0, 0, 0);
        }
        // Smart enough for blackfire and doesnt have it
        if (this.player.inte >= 50 && !this.player.hasStatusEffect(StatusEffects.KnowsBlackfire)) {
            this.outputText("\n\nYou blink in surprise, assaulted by the knowledge of a <b>new spell: Blackfire.</b>");
            this.player.createStatusEffect(StatusEffects.KnowsBlackfire, 0, 0, 0, 0);
        }
        return false;
    }
}
