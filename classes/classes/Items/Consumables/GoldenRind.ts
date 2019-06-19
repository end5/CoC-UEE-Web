import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { Neck } from "../../BodyParts/Neck";
import { rand } from "../../Extra";
import { Ears } from "../../BodyParts/Ears";
import { Tail } from "../../BodyParts/Tail";
import { Horns } from "../../BodyParts/Horns";
import { Skin } from "../../BodyParts/Skin";
import { UnderBody } from "../../BodyParts/UnderBody";
import { Face } from "../../BodyParts/Face";
import { LowerBody } from "../../BodyParts/LowerBody";
import { CockTypesEnum } from "../../CockTypesEnum";
import { Appearance } from "../../Appearance";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

/**
 * Golden Rind/Deer TF, part of the Wild Hunt by Frogapus
 * @author Kitteh6660
 */
export class GoldenRind extends Consumable {

    public constructor() {
        super("GldRind", "GoldenRind", "a golden rind", ConsumableLib.DEFAULT_VALUE, "This shimmering, citrus peel is shaped like a corkscrew and smells sweet and sour at the same time.");
    }

    public useItem(): boolean {
        const tfSource: string = "deerTFs";
        this.outputText("You pop the sliver of fruit in your mouth, delighting in the sweetness and tanginess as you chew it.  A burst of lime-like tartness slaps your senses, and you feel an answering tingle further down in your body.");
        this.player.refillHunger(10);
        this.mutations.initTransformation([2, 3], 2);
        // Main TFs
        if (this.player.neck.type != Neck.NORMAL && this.changes < this.changeLimit && rand(4) == 0) // neck restore
            this.mutations.restoreNeck(tfSource);
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && rand(5) == 0) // rear body restore
            this.mutations.restoreRearBody(tfSource);
        if (rand(5) == 0) // ovi perk loss
            this.mutations.updateOvipositionPerk(tfSource);
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.ears.type != Ears.DEER) {
            if (this.player.ears.type == -1) this.outputText("\n\nTwo painful lumps sprout on the top of your head, forming into tear-drop shaped ears, covered with short fur.  ");
            if (this.player.ears.type == Ears.HUMAN) this.outputText("\n\nYour ears tug painfully on your face as they begin shifting, moving upwards to the top of your head and transforming into an upright animalistic ears.  ");
            if (this.player.ears.type == Ears.DOG) this.outputText("\n\nYour ears change shape, morphing into from their doglike shape into deer-like ears!  ");
            if (this.player.ears.type > Ears.DOG) this.outputText("\n\nYour ears change shape, morphing into teardrop-shaped deer ears!  ");
            this.outputText("<b>You now have deer ears.</b>");
            this.player.ears.type = Ears.DEER; // gain deer ears
            this.changes++;
        }
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.ears.type == Ears.DEER && this.player.tail.type != Tail.DEER) {
            this.outputText("\n\nYou feel a tightening just above your ass, as if a massive hand was pinching you.  It releases with a curious “pomf”-ing noise.  You turn this way and that, finally managing to crane your neck to see your <b>fluffy, flicking deer tail.</b>");
            this.player.tail.type = Tail.DEER; // gain deer tail
            this.changes++;
        }
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.horns.type == Horns.NONE) {
            this.outputText("\n\nYou feel an immense pressure from your forehead, and you reach up, feeling the nubs of two new horns.");
            this.player.horns.type = Horns.ANTLERS; // gain deer horns AKA antlers
            this.player.horns.value = 1;
            this.changes++;
        }
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.horns.value > 0 && this.player.horns.type != Horns.ANTLERS) {
            this.outputText("\n\nYou feel a strange twisting sensation from your horns as they extend outwards.  You reach up to feel them and realize that you’ve now got <b>pronged, stag-like horns.</b>");
            this.player.horns.type = Horns.ANTLERS; // gain deer horns AKA antlers
            this.player.horns.value = 4;
            this.changes++;
        }
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.horns.type == Horns.ANTLERS && this.player.horns.value < 30) {
            this.outputText("\n\nYou feel a strange twisting sensation from your antlers as they extend and split outwards.  You reach up to feel them and realize that your antlers are now even more branched out.");
            if (this.player.horns.value < 20 && rand(2) == 0) this.player.horns.value += (1 + rand(4));
            this.player.horns.value++; // increase points on deer antlers
            this.outputText("  After counting the number of points you have on your antlers, <b>you have " + this.player.horns.value + " points.</b>");
            if (this.player.horns.value >= 30) this.outputText("<b>  It seems that your antlers can't get any more pointier.</b>");
            this.changes++;
        }
        if (rand(4) == 0 && this.changes < this.changeLimit && this.player.horns.value > 0 && !this.player.hasFur()) {
            this.outputText("\n\nFor a moment, it looks like a ray of sunlight has shimmered through the canopy. You blink and realize that your fur has become dappled, with lighter, sun-speckled spots highlighting it.");
            this.player.skin.type = Skin.FUR; // gain fur
            this.player.skin.adj = "";
            this.player.skin.desc = "fur";
            this.player.skin.furColor = "brown";
            this.player.underBody.type = UnderBody.FURRY;
            this.player.copySkinToUnderBody({ furColor: "white" });
            this.changes++;
        }
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.ears.type == Ears.DEER && (this.player.face.type != Face.HUMAN && this.player.face.type != Face.DEER)) {
            this.outputText("\n\nYour face grows warm as suddenly your vision is engulfed in smoke, coughing and beating the smoke back you noticed a marked change in your features. Touching yourself you confirm you have a <b>normal human shaped face once again</b>.");
            this.player.face.type = Face.HUMAN; // change face to human
            this.changes++;
        }
        if (rand(4) == 0 && this.changes < this.changeLimit && this.player.hasFur() && this.player.ears.type == Ears.DEER && this.player.tail.type == Tail.DEER && this.player.face.type != Face.DEER) {
            this.outputText("\n\nYou feel a grinding noise from your jaw, and a massive pressure in your sinuses, as your cheeks pinch in, followed immediately by a pointing of the lower half of your face.  You frantically (and gently) feel your face, discovering, to your surprise, that you’ve <b>gained the delicate facial features of a deer.</b>");
            this.player.face.type = Face.DEER; // gain deer face
            this.changes++;
        }
        if (rand(4) == 0 && this.changes < this.changeLimit && this.player.ears.type == Ears.DEER && this.player.tail.type == Tail.DEER && this.player.hasFur() && this.player.lowerBody.type != LowerBody.CLOVEN_HOOFED) {
            if (this.player.lowerBody.type == LowerBody.HOOFED)
                this.outputText("\n\nYou feel a sharp stinging sensation from your hooves, accompanied by a loud CRACK.  You look down in alarm, prancing from one hooved foot to another, realizing that your solid, heavy hooves have been replaced with delicate, cloven hooves.  You squint, also noting a subtle thinness across your legs in general--if you had to guess, you’d hazard that you’re looking <b>more deer-like than horse-like</b>.");
            else this.outputText("\n\nYou feel a strange tightness from your feet and nearly topple over as your balance shifts.  You’re balancing on your toes for some reason.  You look down in amazement as your legs slim and lengthen, your feet elongating and darkening at the ends until you’re balancing on <b>two, graceful deer legs</b>.");
            this.player.lowerBody.type = LowerBody.CLOVEN_HOOFED; // change legs to cloven hooves
            if (!this.player.isTaur() && !this.player.isBiped()) this.player.lowerBody.legCount = 2;
            this.changes++;
        }
        // Genital Changes
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.cocks.length > 0) { // morph dick to horsediiiiick
            let selectedCockValue: number = -1; // changed as selectedCock and i caused duplicate var warnings
            for (let indexI: number = 0; indexI < this.player.cocks.length; indexI++) {
                if (this.player.cocks[indexI].cockType != CockTypesEnum.HORSE) { selectedCockValue = indexI; break; }
            }
            if (selectedCockValue != -1) {
                if (this.player.cocks[selectedCockValue].cockType == CockTypesEnum.HUMAN || this.player.cocks[selectedCockValue].cockType.Index > 2) // text for humandicks or others
                    this.outputText("\n\nYour " + this.player.cockDescript(selectedCockValue) + " begins to feel strange... you pull down your pants to take a look and see it darkening as you feel a tightness near the base where your skin seems to be bunching up.  A sheath begins forming around your cock's base, tightening and pulling your cock inside its depths.  A hot feeling envelops your member as it suddenly grows into a horse penis, dwarfing its old size.  The skin is mottled brown and black and feels more sensitive than normal.  Your hands are irresistibly drawn to it, and you jerk yourself off, splattering cum with intense force.");
                if (this.player.cocks[selectedCockValue].cockType == CockTypesEnum.DOG) // text for dogdicks
                    this.outputText("\n\nYour " + Appearance.cockNoun(CockTypesEnum.DOG) + " begins to feel odd...  You pull down your clothes to take a look and see it darkening.  You feel a growing tightness in the tip of your " + Appearance.cockNoun(CockTypesEnum.DOG) + " as it flattens, flaring outwards.  Your cock pushes out of your sheath, inch after inch of animal-flesh growing beyond its traditional size.  You notice your knot vanishing, the extra flesh pushing more fresh horsecock out from your sheath.  <b>Your hands are drawn to the strange new " + Appearance.cockNoun(CockTypesEnum.HORSE) + "</b>, and you jerk yourself off, splattering thick ropes of cum with intense force.");
                this.player.cocks[selectedCockValue].cockType = CockTypesEnum.HORSE;
                this.player.increaseCock(selectedCockValue, 4);
                this.dynStats("lib", 5, "sen", 4, "lus", 35);
                this.outputText("<b>  You now have a");
                if (this.player.countCocksOfType(CockTypesEnum.HORSE) > 1) this.outputText("nother");
                this.outputText(" horse-penis.</b>");
                this.changes++;
            }
        }
        // Body thickness/tone changes
        if (rand(3) == 0 && this.player.tone > 20) {
            if (this.player.tone > 50) this.player.modTone(20, 2 + rand(3));
            else this.player.modTone(20, 2);
        }
        if (rand(3) == 0 && this.player.thickness > 20) {
            if (this.player.thickness > 50) this.player.modThickness(20, 2 + rand(3));
            else this.player.modThickness(20, 2);
        }
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;
        return false;
    }
}
