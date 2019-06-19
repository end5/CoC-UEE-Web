import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { SpriteDb } from "../../display/SpriteDb";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

/**
 * Item that increases breast size and lactation.
 */
export class TatteredScroll extends Consumable {
    public constructor() {
        super("TScroll", "TScroll", "a tattered scroll", ConsumableLib.DEFAULT_VALUE, "This tattered scroll is written in strange symbols, yet you have the feeling that if you tried to, you could decipher it.");
    }

    public useItem(): boolean {
        let temp: number = 0;

        this.clearOutput();
        this.outputText("Your wobbly " + this.player.legs() + " give out underneath you as your body's willpower seems to evaporate, your mouth reading the words on the scroll with a backwards sounding sing-song voice.\n\n");
        if (this.player.hair.color === "sandy blonde") {
            this.outputText("Your mouth forms a smile of its own volition, reading, \"<i>Tresed eht retaw llahs klim ruoy.</i>\"\n\n");
            if (this.player.breastRows.length === 0 || this.player.biggestTitSize() === 0) {
                this.outputText("You grow a perfectly rounded pair of C-cup breasts!  ");
                if (this.player.breastRows.length === 0) this.player.createBreastRow();
                this.player.breastRows[0].breasts = 2;
                this.player.breastRows[0].breastRating = 3;
                if (this.player.breastRows[0].nipplesPerBreast < 1) this.player.breastRows[0].nipplesPerBreast = 1;
                this.dynStats("sen", 2, "lus", 1);
            }
            if (this.player.biggestTitSize() > 0 && this.player.biggestTitSize() < 3) {
                this.outputText("Your breasts suddenly balloon outwards, stopping as they reach a perfectly rounded C-cup.  ");
                this.player.breastRows[0].breastRating = 3;
                this.dynStats("sen", 1, "lus", 1);
            }
            if (this.player.averageNipplesPerBreast() < 1) {
                this.outputText("A dark spot appears on each breast, rapidly forming into a sensitive nipple.  ");
                temp = this.player.breastRows.length;
                while (temp > 0) {
                    temp--;
                    // If that breast didnt have nipples reset length
                    if (this.player.breastRows[temp].nipplesPerBreast < 1) this.player.nippleLength = .2;
                    this.player.breastRows[temp].nipplesPerBreast = 1;
                }
                this.dynStats("sen", 2, "lus", 1);
            }
            if (this.player.biggestLactation() > 0) {
                this.outputText("A strong pressure builds in your chest, painful in its intensity.  You yank down your top as ");
                if (this.player.biggestLactation() < 2) this.outputText("powerful jets of milk spray from your nipples, spraying thick streams over the ground.  You moan at the sensation and squeeze your tits, hosing down the tainted earth with an offering of your milk.  You blush as the milk ends, quite embarrassed with your increased milk production.  ");
                if (this.player.biggestLactation() >= 2 && this.player.biggestLactation() <= 2.6) this.outputText("eruptions of milk squirt from your nipples, hosing thick streams everywhere.  The feeling of the constant gush of fluids is very erotic, and you feel yourself getting more and more turned on.  You start squeezing your breasts as the flow diminishes, anxious to continue the pleasure, but eventually all good things come to an end.  ");
                if (this.player.biggestLactation() > 2.6 && this.player.biggestLactation() < 3) this.outputText("thick hoses of milk erupt from your aching nipples, forming puddles on the ground.  You smile at how well you're feeding the earth, your milk coating the ground faster than it can be absorbed.  The constant lactation is pleasurable... in a highly erotic way, and you find yourself moaning and pulling on your nipples, your hands completely out of control.  In time you realize the milk has stopped, and even had time to soak into the dirt.  You wonder at your strange thoughts and pull your hands from your sensitive nipples.  ");

                if (this.player.biggestLactation() >= 3) this.outputText("you drop to your knees and grab your nipples.  With a very sexual moan you begin milking yourself, hosing out huge quantities of milk.  You pant and grunt, offering as much of your milk as you can.  It cascades down a hill in a small stream, and you can't help but blush with pride... and lust.  The erotic pleasures build as you do your best to feed the ground all of your milk.  You ride the edge of orgasm for an eternity, milk everywhere.  When you come to, you realize you're kneeling there, tugging your dry nipples.  Embarrassed, you stop, but your arousal remains.  ");
                if (this.player.biggestLactation() < 3) {
                    this.player.boostLactation(.7);
                    this.outputText("Your breasts feel fuller... riper... like your next milking could be even bigger.  ");
                }
                this.dynStats("lib", 1, "sen", 4, "lus", 15);
            }
            if (this.player.biggestLactation() === 0) {
                this.outputText("A pleasurable release suddenly erupts from your nipples!  Twin streams of milk are spraying from your breasts, soaking into the ground immediately.  It stops all too soon, though a voice in your head assures you that you can lactate quite often now.  ");
                this.player.boostLactation(1);
                this.dynStats("lib", .5, "sen", 1, "lus", 10);
            }
            this.outputText("\n\nYour mouth curls into a sick smile and, with a voice that isn't your own, speaks, \"<i>I ALWAYS get what I want, dear...</i>\"");
            this.doNext(this.camp.returnToCampUseOneHour);
        }
        else {
            this.outputText("Your mouth forms a smile of its own volition, reading, \"<i>nuf erutuf rof riah ydnas, nus tresed eht sa ydnas.</i>\"\n\nYou feel a tingling in your scalp, and realize your hair has become a sandy blonde!");
            this.player.hair.color = "sandy blonde";
            this.outputText("\n\nYour mouth curls with a sick smile, speaking with a voice that isn't your own, \"<i>I ALWAYS get what I want, dear...</i>\"");
            this.doNext(this.camp.returnToCampUseOneHour);
        }
        if (!kGAMECLASS.inCombat) {
            // RAEP
            this.game.spriteSelect(SpriteDb.s_sandwich);
            this.outputText("\n\nYou hear the soft impact of clothes hitting the ground behind you, and turn to see that the sand witch has found you! You cannot resist a peek at your uninvited guest, beholding a curvy dark-skinned beauty, her form dominated by a quartet of lactating breasts.  Somewhere in your lust-fogged mind you register the top two as something close to double-Ds, and her lower pair to be about Cs.  She smiles and leans over you, pushing you to the ground violently.\n\nShe turns around and drops, planting her slick honey-pot firmly against your mouth.  Her scent is strong, overpowering in its intensity.  Your tongue darts out for a taste and finds a treasure trove of sticky sweetness.  Instinctively you tongue-fuck her, greedily devouring her cunny-juice, shoving your tongue in as far as possible while suckling her clit.  Dimly you feel the milk spattering over you, splashing off you and into the cracked earth.  Everywhere the milk touches feels silky smooth and sensitive, and your hands begin stroking your body, rubbing it in as the witch sprays more and more of it.  You lose track of time, orgasming many times, slick and sticky with sexual fluids.");
            this.player.orgasm('Generic');
            this.dynStats("lib", 1, "sen", 5);
            this.player.slimeFeed();
        }

        return false;
    }
}
