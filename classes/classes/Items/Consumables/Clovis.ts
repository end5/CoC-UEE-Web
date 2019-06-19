import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";
import { Neck } from "../../BodyParts/Neck";
import { RearBody } from "../../BodyParts/RearBody";
import { Ears } from "../../BodyParts/Ears";
import { Tail } from "../../BodyParts/Tail";
import { LowerBody } from "../../BodyParts/LowerBody";
import { Horns } from "../../BodyParts/Horns";
import { Skin } from "../../BodyParts/Skin";
import { UnderBody } from "../../BodyParts/UnderBody";
import { Hair } from "../../BodyParts/Hair";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

/**
 * Sheep transformative item.
 *
 * @author written by MissBlackthorne and coded by Foxwells
 */
export class Clovis extends Consumable {
    public constructor() {
        super("Clovis", "Clovis", "a bottle of Clovis", ConsumableLib.DEFAULT_VALUE, "This bottle is in the shape of a 4-leaf-clover and contains a soft pink potion. An image of a sheep is on the label along with text, \"<i>Clovis - to help you to live in clover</i>\".");
    }

    public useItem(): boolean {
        const tfSource: string = "clovis";
        this.mutations.initTransformation([2, 2]);
        this.outputText("You open the bottle of Clovis, its sweet smell making you feel carefree. You drink the contents and relax to the sensation it brings, feeling like you're being cuddled by a big fluffy cloud.");
        // Stat changes!
        if (this.player.inte > 90 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.dynStats("int", -(rand(1) + 1));
            this.outputText("\n\nThe sense of calm the potion gives you slowly fades into dopey bliss. You haven't a care in the world, not even the fact that you've got a little dumber.");
        }
        if (rand(3) === 0 && this.changes < this.changeLimit) {
            this.dynStats("tou", rand(1) + 1);
            this.outputText("\n\nYou feel a wave of stubborn pride wash over you as you finish the potion. You’re sure nothing could stop you now, not even the demons.");
        }
        if (this.player.spe < 75 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.dynStats("spe", rand(2) + 1);
            this.outputText("\n\nYou feel oddly compelled to jump from rock to rock across a nearby stream, a sense of sure footedness and increased agility deep within you. To your surprise, you make it across with no trouble. The damp and uneven rocks are barely a challenge to your increased speed.");
        }
        if (rand(3) === 0 && this.changes < this.changeLimit) {
            this.dynStats("sens", -(rand(1) + 1));
            this.outputText("\n\nYou feel less sensitive to the touch, a slight numbness pervading your body as if truly wrapped in cotton wool. The numbness eventually fades, leaving you now less affected by the lusty touches of your foes.");
        }
        if (rand(3) === 0 && this.changes < this.changeLimit) {
            this.dynStats("cor", -(rand(3) + 2));
            this.outputText("\n\nYou close your eyes as your mind becomes clearer, a purging white searing through your being. It envelops you in its fluffy softness as it chases out the taint, first burning but then soothing. As you open your eyes, you feel you have regained some of your purity that this perverted realm seeks to claim.");
            this.changes++;
        }
        if (this.player.tallness > 67 && rand(2) === 0 && this.changes < this.changeLimit) {
            this.player.tallness -= (1 + rand(4));
            this.outputText("\n\nYou blink as you feel your center of gravity shift lower. You look down and realize the ground is closer now. You appear to have gotten shorter!");
            this.changes++;
        }
        if (this.player.butt.rating < 6 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.player.butt.rating += (1 + rand(1));
            if (this.player.butt.rating > 6) {
                this.player.butt.rating = 6;
            }
            this.outputText("\n\nYou feel your clothes tighten around your [butt], your behind expanding. Thankfully, it stops before your clothes can't handle it. As you run your hand over the tight fabric, you can't help but grope the now plumper flesh.");
        }
        // Neck restore
        if (this.player.neck.type != Neck.NORMAL && this.changes < this.changeLimit && rand(4) == 0)
            this.mutations.restoreNeck(tfSource);
        // Rear body restore
        if (this.player.rearBody.type != RearBody.NONE && this.changes < this.changeLimit && rand(5) == 0) this.mutations.restoreRearBody(tfSource);
        if (this.player.ears.type !== Ears.SHEEP && rand(3) === 0 && this.changes < this.changeLimit) {
            if (this.player.ears.type === -1) { this.outputText("\n\nTwo painful nubs begin sprouting from your head, growing out in a tear-drop shape and flopping over. To top it off, wool coats them."); } else { this.outputText("\n\nYou feel your ears shift and elongate, becoming much floppier. They take on a more tear drop shape, flopping at the side of your head cutely as a light coat of downy wool forms on them."); }
            this.player.ears.type = Ears.SHEEP;
            this.player.ears.value = 2;
            this.outputText(" <b>You now have sheep ears!</b>");
            this.changes++;
        }
        if (this.player.tail.type !== Tail.SHEEP && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou feel the flesh above your [butt] knotting and changing. It twists and writhes around itself, lengthening before flopping straight down. With a slight poof, a coat of soft and fluffy wool coats it, your new tail taking on the wooly appearance of a sheep's.");
            this.player.tail.type = Tail.SHEEP;
            this.outputText(" <b>You now have a sheep's tail!</b>");
            this.changes++;
        }
        if (this.player.lowerBody.type !== LowerBody.CLOVEN_HOOFED && this.player.tail.type === Tail.SHEEP && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou feel a strange tightness from your feet and nearly topple over as your balance shifts. You're balancing on your toes for some reason. You look down in amazement as your legs slim and shorten, your feet elongating and darkening at the ends, all morphing until you're balancing on two sheep legs, complete with cute little hooves.");
            this.player.lowerBody.type = LowerBody.CLOVEN_HOOFED;
            this.player.lowerBody.legCount = 2;
            this.outputText(" <b>You now have sheep hooves!</b>");
            this.changes++;
        }
        if (this.player.horns.type !== Horns.SHEEP && this.player.horns.type !== Horns.RAM && this.player.ears.type === Ears.SHEEP && rand(3) === 0 && this.changes < this.changeLimit) {
            if (this.player.horns.type !== Horns.NONE) {
                this.outputText("\n\nYou feel your horns suddenly crumble, falling apart in large chunks until they flake away into nothing.");
            }
            this.outputText("\n\nYou grip your head as a surge of pain hits you. A pair of horns slowly emerge from your skull, curling out and forward in a half circle. The ribbed curls remind you of the horns of the sheep back in Ingnam. <b>You now have sheep horns!</b>");
            this.player.horns.type = Horns.SHEEP;
            this.player.horns.value = 1;
            this.changes++;
        }
        if (rand(3) === 0 && this.changes < this.changeLimit && this.player.lowerBody.legCount === 2 && this.player.lowerBody.type === LowerBody.CLOVEN_HOOFED && this.player.horns.type === Horns.SHEEP && this.player.tail.type === Tail.SHEEP && this.player.ears.type === Ears.SHEEP && !this.player.hasWool()) {
            const sheepWoolColors: any[] = [
                "white",
                "black",
                "gray",
                "silver",
                "brown",
                "moorit"
            ];
            if (!this.player.hasFur()) {
                this.outputText("\n\nWith an almost audible \*POMF\*, a soft fleece erupts from your body. The fleece covers all of your midsection and thighs, thick and fluffy. It doesn't fully hide your sexual features, instead obscuring them in an enticing manner. You can't help but run your hands over your soft, " + this.player.skin.furColor + " wool, reveling in plushness. <b>You now have sheep wool!</b>");
            } else {
                this.outputText("\n\nYou feel your fur suddenly stand on end, every follicle suddenly detaching and leaving your skin bare. As you stand with a pile of shed fur around your feet, you feel your skin tingle, and you're sure it isn't from the cold. With an almost audible \*POMF\*, a soft fleece erupts from your body. The fleece covers all of your midsection and thighs, thick and fluffy. It doesn't fully hide your sexual features, instead obscuring them in an enticing manner. You can't help but run your hands over your soft, " + this.player.skin.furColor + " wool, reveling in plushness. <b>You now have sheep wool!</b>");
            }
            this.player.skin.type = Skin.WOOL;
            this.player.skin.desc = "wool";
            this.player.setFurColor(sheepWoolColors, {
                type: UnderBody.FURRY
            }, true);
            this.changes++;
        }
        if (this.player.horns.type === Horns.SHEEP && this.player.hasWool() && this.player.femininity <= 45 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou feel a familiar pain in your head. Your horns are growing! More ribbed horn emerges from your scalp, your horns slowly curling around fully as they thicken. Once a full ring of horn is complete they lengthen until the pointed ends face forward, tucked under your ears. You run your fingers over your curled horns in awe. These could seriously do some damage! Or at least stun your foes. <b>You now have the horns of a ram!</b>");
            this.player.horns.type = Horns.RAM;
            this.player.horns.value = 2;
            this.changes++;
        }
        if (this.player.horns.type === Horns.RAM && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou groan and clutch your head as your horns stretch out, becoming even longer.");
            this.player.horns.type = Horns.RAM;
            this.player.horns.value += (1 + rand(3));
            this.changes++;
        }
        if (this.player.hasWool() && this.player.hair.type !== Hair.WOOL && this.player.femininity >= 65 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYour hair suddenly poofs out as if you had filled it with static. You attempt to smooth it down, but you can't seem to straighten it out properly. It keeps bouncing back in a cushion-like manner. You in a nearby puddle. Your hair is now much thicker, it having become rather curly and bouffant like the wool of a sheep. You realize that <b>you now have woolen hair!</b>");
            this.player.hair.type = Hair.WOOL;
            this.changes++;
        }
        if (this.player.hips.rating < 10 && this.player.femininity >= 65 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou grip your hips as they shift, getting wider and altering your stance. Your hips seem much more fitting for a sheep now, all big and cuddly.");
            this.player.hips.rating += (rand(1) + 1);
            if (this.player.hips.rating > 10) {
                this.player.hips.rating = 10;
            }
            this.changes++;
        }
        if (this.player.breastRows[0].breastRating < 5 && this.player.femininity >= 65 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.player.breastRows[0].breastRating += (rand(1) + 1);
            if (this.player.breastRows[0].breastRating > 5) {
                this.player.breastRows[0].breastRating = 5;
            }
            this.outputText("\n\nYour breasts feel constrained and painful against your top as they grow larger by the moment, finally stopping as they reach " + this.player.breastCup(0) + "-cup. You rub the tender orbs as you get used to your larger breast flesh.");
            this.changes++;
        }
        this.game.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;
        return false;
    }
}
