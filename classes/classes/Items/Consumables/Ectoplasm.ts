import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";
import { CockTypesEnum } from "../../CockTypesEnum";
import { Neck } from "../../BodyParts/Neck";
import { Hair } from "../../BodyParts/Hair";
import { Skin } from "../../BodyParts/Skin";
import { PerkLib } from "../../PerkLib";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

/**
 * Ghost transformative item.
 */
export class Ectoplasm extends Consumable {
    public constructor() {
        super("EctoPls", "EctoPls", "a bottle of ectoplasm", ConsumableLib.DEFAULT_VALUE, "The green-tinted, hardly corporeal substance flows like a liquid inside its container. It makes you feel... uncomfortable, as you observe it.");
    }

    public useItem(): boolean {
        const tfSource: string = "ectoplasm";
        this.player.slimeFeed();
        this.clearOutput();
        this.outputText("You grimace and uncork the bottle, doing your best to ignore the unearthly smell drifting up to your nostrils. Steeling yourself, you raise the container to your lips and chug the contents, shivering at the feel of the stuff sliding down your throat.  Its taste, at least, is unexpectedly pleasant.  Almost tastes like oranges.");
        this.mutations.initTransformation([2, 3]);
        // Effect script 1:  (higher intelligence)
        if (this.player.inte100 < 100 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou groan softly as your head begins pounding something fierce.  Wincing in pain, you massage your temples as the throbbing continues, and soon, the pain begins to fade; in its place comes a strange sense of sureness and wit.");
            this.dynStats("int", 1);
            if (this.player.inte100 < 50) this.dynStats("int", 1);
        }
        // Effect script 2:  (lower sensitivity)
        if (this.player.sens100 >= 20 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nWoah, what the... you pinch your " + this.player.skinFurScales() + " to confirm your suspicions; the ghostly snack has definitely lowered your sensitivity.");
            this.dynStats("sen", -2);
            if (this.player.sens100 >= 75) this.dynStats("sen", -2);
        }
        // Effect script 3:  (higher libido)
        if (this.player.lib100 < 100 && rand(3) === 0 && this.changes < this.changeLimit) {
            // ([if libido >49]
            if (this.player.lib100 < 50) this.outputText("\n\nIdly, you drop a hand to your crotch as");
            else this.outputText("\n\nWith a substantial amount of effort, you resist the urge to stroke yourself as");
            this.outputText(" a trace amount of the ghost girl's lust is transferred into you.  How horny IS she, you have to wonder...");
            this.dynStats("lib", 1);
            if (this.player.lib100 < 50) this.dynStats("lib", 1);
        }
        // Effect script a:  (human wang)
        if (this.player.hasCock() && this.changes < this.changeLimit) {
            if (rand(3) === 0 && this.player.cocks[0].cockType !== CockTypesEnum.HUMAN) {
                this.outputText("\n\nA strange tingling begins behind your " + this.player.cockDescript(0) + ", slowly crawling up across its entire length.  While neither particularly arousing nor uncomfortable, you do shift nervously as the feeling intensifies.  You resist the urge to undo your " + this.player.armorName + " to check, but by the feel of it, your penis is shifting form.  Eventually the transformative sensation fades, <b>leaving you with a completely human penis.</b>");
                this.player.cocks[0].cockType = CockTypesEnum.HUMAN;
                this.changes++;
            }
        }
        // Neck restore
        if (this.player.neck.type != Neck.NORMAL && this.changes < this.changeLimit && rand(4) == 0) this.mutations.restoreNeck(tfSource);
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && rand(5) == 0) this.mutations.restoreRearBody(tfSource);
        // Ovi perk loss
        if (rand(5) === 0) {
            this.mutations.updateOvipositionPerk(tfSource);
        }
        // Appearnace Change
        // Hair
        if (rand(4) === 0 && this.changes < this.changeLimit && this.player.hair.type !== Hair.GHOST) {
            this.outputText("\n\nA sensation of weightlessness assaults your scalp. You reach up and grab a handful of hair, confused. Your perplexion only heightens when you actually feel the follicles becoming lighter in your grasp, before you can hardly tell you're holding anything.  Plucking a strand, you hold it up before you, surprised to see... it's completely transparent!  You have transparent hair!");
            this.player.hair.type = Hair.GHOST;
            this.changes++;
        }
        // Skin
        if (rand(4) === 0 && this.changes < this.changeLimit && (this.player.skin.tone !== "sable" && this.player.skin.tone !== "white")) {
            if (rand(2) === 0) {
                this.outputText("\n\nA warmth begins in your belly, slowly spreading through your torso and appendages. The heat builds, becoming uncomfortable, then painful, then nearly unbearable. Your eyes unfocus from the pain, and by the time the burning sensation fades, you can already tell something's changed. You raise a hand, staring at the milky-white flesh. Your eyes are drawn to the veins in the back of your hand, darkening to a jet black as you watch. <b>You have white skin, with black veins!</b>");
                this.player.skin.tone = "white";
                this.player.skin.adj = "milky";
                this.player.skin.desc = "skin";
                this.player.skin.type = Skin.PLAIN;
            }
            else {
                this.outputText("\n\nA warmth begins in your belly, slowly spreading through your torso and appendages. The heat builds, becoming uncomfortable, then painful, then nearly unbearable. Your eyes unfocus from the pain, and by the time the burning sensation fades, you can already tell something's changed. You raise a hand, staring at the sable flesh. Your eyes are drawn to the veins in the back of your hand, brightening to an ashen tone as you watch.  <b>You have black skin, with white veins!</b>");
                this.player.skin.tone = "sable";
                this.player.skin.adj = "ashen";
                this.player.skin.desc = "skin";
                this.player.skin.type = Skin.PLAIN;
            }
            this.player.underBody.restore();
            this.player.arms.updateClaws(this.player.arms.claws.type);
            this.changes++;
        }
        // Legs
        if (this.player.hasPerk(PerkLib.Incorporeality) && !this.player.lowerBody.incorporeal) {
            // Silently fix, if the player has the perk but the legs aren't incorporeal.
            this.player.lowerBody.incorporeal = true;
        }
        if (this.changes < this.changeLimit && !this.player.hasPerk(PerkLib.Incorporeality) && (this.player.skin.tone === "white" || this.player.skin.tone === "sable") && this.player.hair.type === Hair.GHOST) {
            // (ghost-legs!  Absolutely no problem with regular encounters, though! [if you somehow got this with a centaur it'd probably do nothing cuz you're not supposed to be a centaur with ectoplasm ya dingus])
            this.outputText("\n\nAn otherworldly sensation begins in your belly, working its way to your [hips]. Before you can react, your [legs]"
                + " begin to tingle, and you fall on your rump as a large shudder runs through them. As you watch, your lower body shimmers,"
                + " becoming ethereal, wisps rising from the newly ghost-like [legs]. You manage to rise, surprised to find your new,"
                + " ghostly form to be as sturdy as its former corporeal version. Suddenly, like a dam breaking,"
                + " fleeting visions and images flow into your head, never lasting long enough for you to concentrate on one."
                + " You don't even realize it, but your arms fly up to your head, grasping your temples as you groan in pain."
                + " As fast as the mental bombardment came, it disappears, leaving you with a surprising sense of spiritual superiority."
                + "  <b>You have ghost legs!</b>\n\n");
            this.outputText("<b>(Gained Perk:  Incorporeality</b>)");
            this.player.createPerk(PerkLib.Incorporeality, 0, 0, 0, 0);
            this.player.lowerBody.incorporeal = true;
        }
        // Effect Script 8: 100% chance of healing
        if (this.changes === 0) {
            this.outputText("You feel strangely refreshed, as if you just gobbled down a bottle of sunshine.  A smile graces your lips as vitality fills you.  ");
            this.player.HPChange(this.player.level * 5 + 10, true);
        }
        // Incorporeality Perk Text:  You seem to have inherited some of the spiritual powers of the residents of the afterlife!  While you wouldn't consider doing it for long due to its instability, you can temporarily become incorporeal for the sake of taking over enemies and giving them a taste of ghostly libido.

        // Sample possession text (>79 int, perhaps?):  With a smile and a wink, your form becomes completely intangible, and you waste no time in throwing yourself into your opponent's frame. Before they can regain the initiative, you take control of one of their arms, vigorously masturbating for several seconds before you're finally thrown out. Recorporealizing, you notice your enemy's blush, and know your efforts were somewhat successful.
        // Failure:  With a smile and a wink, your form becomes completely intangible, and you waste no time in throwing yourself into the opponent's frame. Unfortunately, it seems they were more mentally prepared than you hoped, and you're summarily thrown out of their body before you're even able to have fun with them. Darn, you muse. Gotta get smarter.
        this.player.refillHunger(20);
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;

        return false;
    }
}
