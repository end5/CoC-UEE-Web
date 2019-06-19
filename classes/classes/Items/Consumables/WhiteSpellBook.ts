import { Consumable } from "../Consumable";
import { StatusEffects } from "../../StatusEffects";

/**
 * A spellbook that teaches the player one the following spells: 'Charge Weapon', 'Blind' or 'Whitefire'.
 * May also raise int.
 */
export class WhiteSpellBook extends Consumable {
    private static ITEM_VALUE: number = 40;

    public constructor() {
        super("W. Book", "W. Book", "a small book with a pristine white cover", WhiteSpellBook.ITEM_VALUE, "This white book is totally unmarked, and the cover is devoid of any lettering or title.  A shiny brass clasp keeps the covers closed until you are ready to read it.");
    }

    public useItem(): boolean {
        this.clearOutput();
        this.outputText("You open the white tome, and discover it to be an instructional book on the use of white magic.  Most of it is filled with generic information about white magic - how it is drawn for mental focus, is difficult to use when tired or aroused, and can be used to create and control energy.  In no time at all you've read the whole thing, but it disappears into thin air before you can put it away.");
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
        if (this.player.inte100 >= 25 && !this.player.hasStatusEffect(StatusEffects.KnowsCharge)) {
            this.outputText("\n\nYou blink in surprise, assaulted by the knowledge of a <b>new spell: Charge Weapon.</b>");
            this.player.createStatusEffect(StatusEffects.KnowsCharge, 0, 0, 0, 0);
            return false;
        }
        // Smart enough for arouse and doesnt have it
        if (this.player.inte100 >= 30 && !this.player.hasStatusEffect(StatusEffects.KnowsBlind)) {
            this.outputText("\n\nYou blink in surprise, assaulted by the knowledge of a <b>new spell: Blind.</b>");
            this.player.createStatusEffect(StatusEffects.KnowsBlind, 0, 0, 0, 0);
            return false;
        }
        // Smart enough for arouse and doesnt have it
        if (this.player.inte100 >= 40 && !this.player.hasStatusEffect(StatusEffects.KnowsWhitefire)) {
            this.outputText("\n\nYou blink in surprise, assaulted by the knowledge of a <b>new spell: Whitefire.</b>");
            this.player.createStatusEffect(StatusEffects.KnowsWhitefire, 0, 0, 0, 0);
        }

        return false;
    }
}
