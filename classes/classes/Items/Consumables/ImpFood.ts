import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";
import { ColorLists } from "../../lists/ColorLists";
import { Skin } from "../../BodyParts/Skin";
import { Wings } from "../../BodyParts/Wings";
import { RearBody } from "../../BodyParts/RearBody";
import { Tail } from "../../BodyParts/Tail";
import { LowerBody } from "../../BodyParts/LowerBody";
import { Horns } from "../../BodyParts/Horns";
import { Ears } from "../../BodyParts/Ears";
import { Claws } from "../../BodyParts/Claws";
import { Arms } from "../../BodyParts/Arms";
import { Hair } from "../../BodyParts/Hair";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { Neck } from "../../BodyParts/Neck";
import { CockTypesEnum } from "../../CockTypesEnum";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

/**
 * Imp transformative item
 *
 * fucking overhauled by Foxwells who was depressed by the sorry state of imp food
 */
export class ImpFood extends Consumable {
    public constructor() {
        super("ImpFood", "ImpFood", "a parcel of imp food", ConsumableLib.DEFAULT_VALUE, "This is a small parcel of reddish-brown bread stuffed with some kind of meat.  It smells delicious.");
    }

    public useItem(): boolean {
        const tfSource: string = "impFood";
        let temp: number = 0;
        this.mutations.initTransformation([2, 2]);
        this.clearOutput();
        if (this.player.cocks.length > 0) {
            this.outputText("The food tastes strange and corrupt - you can't really think of a better word for it, but it's unclean.");
            this.player.refillHunger(20);
            if (this.player.cocks[0].cockLength < 12 && this.changes < this.changeLimit) {
                temp = this.player.increaseCock(0, rand(2) + 2);
                this.outputText("\n\n");
                this.player.lengthChange(temp, 1);
                this.changes++;
            }
            this.outputText("\n\nInhuman vitality spreads through your body, invigorating you!\n");
            this.player.HPChange(30 + this.player.tou / 3, true);
            this.dynStats("lus", 3, "cor", 1);
            // Red or orange skin!
            if (rand(30) === 0 && ColorLists.IMP_SKIN.indexOf(this.player.skin.tone) === -1) {
                if (this.player.hasFur()) this.outputText("\n\nUnderneath your fur, your skin ");
                else this.outputText("\n\nYour " + this.player.skin.desc + " ");
                this.player.skin.tone = ImpFood.randomChoice(ColorLists.IMP_SKIN);
                this.outputText("begins to lose its color, fading until you're as white as an albino.  Then, starting at the crown of your head, a reddish hue rolls down your body in a wave, turning you completely " + this.player.skin.tone + ".");
                this.player.arms.updateClaws(this.player.arms.claws.type);
                kGAMECLASS.rathazul.addMixologyXP(20);
            }
        }
        else {
            this.outputText("The food tastes... corrupt, for lack of a better word.\n");
            this.player.refillHunger(20);
            this.player.HPChange(20 + this.player.tou / 3, true);
            this.dynStats("lus", 3, "cor", 1);
        }
        // Red or orange skin!
        if (rand(5) === 0 && ColorLists.IMP_SKIN.indexOf(this.player.skin.tone) === -1 && this.changes < this.changeLimit) {
            if (this.player.hasFur()) this.outputText("\n\nUnderneath your fur, your skin ");
            else this.outputText("\n\nYour " + this.player.skin.desc + " ");
            this.player.skin.tone = ImpFood.randomChoice(ColorLists.IMP_SKIN);
            this.outputText("begins to lose its color, fading until you're as white as an albino.  Then, starting at the crown of your head, a reddish hue rolls down your body in a wave, turning you completely " + this.player.skin.tone + ".");
            this.dynStats("cor", 2);
            this.player.skin.type = Skin.PLAIN;
            this.player.arms.updateClaws(this.player.arms.claws.type);
            kGAMECLASS.rathazul.addMixologyXP(20);
            this.changes++;
        }

        // Shrinkage!
        if (rand(2) === 0 && this.player.tallness > 42 && this.changes < this.changeLimit) {
            this.outputText("\n\nYour skin crawls, making you close your eyes and shiver.  When you open them again the world seems... different.  After a bit of investigation, you realize you've become shorter!");
            this.player.tallness -= 1 + rand(3);
            this.changes++;
        }

        // Imp wings - I just kinda robbed this from demon changes ~Foxwells
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.wings.type != Wings.IMP_LARGE && this.player.isCorruptEnough(25)) {
            // grow smalls to large
            if (this.player.wings.type === Wings.IMP && this.player.isCorruptEnough(50)) {
                this.outputText("\n\n");
                this.outputText("Your small imp wings stretch and grow, tingling with the pleasure of being attached to such a tainted body. You stretch over your shoulder to stroke them as they unfurl, turning into large imp-wings. <b>Your imp wings have grown!</b>");
                this.player.wings.type = Wings.IMP_LARGE;
            }
            else if (this.player.rearBody.type === RearBody.SHARK_FIN) {
                this.outputText("\n\n");
                this.outputText("The muscles around your shoulders bunch up uncomfortably, changing to support the new bat-like wings growing from your back. You twist your head as far as you can for a look and realize your fin has changed into imp-wings!");
                this.player.rearBody.restore();
                this.player.wings.type = Wings.IMP;
            }
            // No wings
            else if (this.player.wings.type === Wings.NONE) {
                this.outputText("\n\n");
                this.outputText("A knot of pain forms in your shoulders as they tense up.  With a surprising force, a pair of small imp wings sprout from your back, ripping a pair of holes in the back of your " + this.player.armorName + ".  <b>You now have imp wings.</b>");
                this.player.wings.type = Wings.IMP;
            }
            // Other wing types
            else {
                this.outputText("\n\n");
                this.outputText("The muscles around your shoulders bunch up uncomfortably, changing to support your wings as you feel their weight increasing.  You twist your head as far as you can for a look and realize they've changed into ");
                if ([Wings.BEE_LIKE_SMALL, Wings.HARPY, Wings.DRACONIC_SMALL, Wings.IMP].indexOf(this.player.wings.type) !== -1) {
                    this.outputText("small ");
                    this.player.wings.type = Wings.IMP;
                }
                else {
                    this.outputText("large ");
                    this.player.wings.type = Wings.IMP_LARGE;
                }
                this.outputText("<b>imp-wings!</b>");
            }
            this.dynStats("cor", 2);
            this.changes++;
        }

        // Imp tail, because that's a unique thing from what I see?
        if (this.player.tail.type !== Tail.IMP && this.changes < this.changeLimit && rand(3) === 0) {
            if (this.player.tail.type !== Tail.NONE) {
                this.outputText("\n\n");
                if (this.player.tail.type === Tail.SPIDER_ABDOMEN || this.player.tail.type === Tail.BEE_ABDOMEN) this.outputText("You feel a tingling in your insectile abdomen as it stretches, narrowing, the exoskeleton flaking off as it transforms into an imp's tail, complete with a round fluffed end. ");
                else this.outputText("You feel a tingling in your tail. You are amazed to discover it has shifted into an imp tail, complete with a fluffy end. ");
                this.outputText("<b>Your tail is an imp tail!</b>");
            }
            else {
                this.outputText("\n\nA pain builds in your backside, growing more and more pronounced. The pressure suddenly disappears with a loud ripping and tearing noise. <b>You realize you now have an imp tail</b>... complete with fluffed end.");
            }
            this.dynStats("cor", 2);
            this.player.tail.type = Tail.IMP;
            this.changes++;
        }

        // Feets, needs red/orange skin and tail
        if (["red", "orange"].indexOf(this.player.skin.tone) !== -1 && this.player.tail.type === Tail.IMP && this.player.lowerBody.type !== LowerBody.IMP && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nEvery muscle and sinew below your hip tingles and you begin to stagger. Seconds after you sit down, pain explodes in your " + this.player.feet() + ". Something hard breaks through your sole from the inside out as your " + this.player.feet() + " splinter and curve cruelly. The pain slowly diminishes and your eyes look along a skinny, human leg that splinters at the foot into three long claw with a smaller back one for balance. When you relax, your feet grip the ground easily. <b>Your lower body is now that of an imp.</b>");
            this.player.lowerBody.type = LowerBody.IMP;
            this.player.lowerBody.legCount = 2;
            this.dynStats("cor", 2);
            this.changes++;
        }

        // Imp ears, needs red/orange skin and horns
        if (this.player.horns.type === Horns.IMP && ["red", "orange"].indexOf(this.player.skin.tone) !== -1 && this.player.ears.type !== Ears.IMP && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYour head suddenly pulses in pain, causing you to double over and grip at it. You feel your ears elongate and curl in slightly, ending at points not much unlike elves. These, however, jut out of the side of your head and are coned, focusing on every sound around you. A realization strikes you. <b>Your ears are now that of an imp!</b>");
            this.player.ears.type = Ears.IMP;
            this.dynStats("cor", 2);
            this.changes++;
        }

        // Horns, because why not?
        if ((this.player.horns.value === 0 || this.player.horns.type !== Horns.IMP) && this.changes < this.changeLimit && rand(2) === 0) {
            if (this.player.horns.value === 0) {
                this.outputText("\n\nA small pair of pointed imp horns erupt from your forehead. They look kind of cute. <b>You have horns!</b>");
            }
            else {
                this.outputText("\n\n");
                this.outputText("Your horns shift, turning into two pointed imp horns.");
            }
            this.player.horns.value = 2;
            this.player.horns.type = Horns.IMP;
            this.dynStats("cor", 2);
            this.changes++;
        }

        // Imp claws, needs orange/red skin. Also your hands turn human.
        if (["red", "orange"].indexOf(this.player.skin.tone) !== -1 && this.player.arms.claws.type !== Claws.IMP && rand(3) === 0 && this.changes < this.changeLimit) {
            if (this.player.arms.type !== Arms.HUMAN) {
                this.outputText("\n\nYour arms twist and mangle, warping back into human-like arms. But that, you realize, is just the beginning.");
            }
            if (this.player.arms.claws.type === Claws.NORMAL) {
                this.outputText("\n\nYour hands suddenly ache in pain, and all you can do is curl them up to you. Against your body, you feel them form into three long claws, with a smaller one replacing your thumb but just as versatile. <b>You have imp claws!</b>");
            } else { // has claws
                this.outputText("\n\nYour claws suddenly begin to shift and change, starting to turn back into normal hands. But just before they do, they stretch out into three long claws, with a smaller one coming to form a pointed thumb. <b>You have imp claws!</b>");
            }
            this.player.arms.setType(Arms.PREDATOR, Claws.IMP);
            this.dynStats("cor", 2);
            this.changes++;
        }

        // Changes hair to red/dark red, shortens it, sets it normal
        if (["red", "dark red"].indexOf(this.player.hair.color) === -1 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYour hair suddenly begins to shed, rapidly falling down around you before it's all completely gone. Just when you think things are over, more hair sprouts from your head, slightly curled and color different.");
            if (rand(2) !== 0) {
                this.player.hair.color = "red";
            } else {
                this.player.hair.color = "dark red";
            }
            this.outputText(" <b>You now have " + this.player.hair.color + "</b>");
            if (this.player.hair.type !== Hair.NORMAL) {
                this.outputText("<b> human</b>");
            }
            this.outputText("<b> hair!</b>");
            this.player.hair.type = Hair.NORMAL;
            this.player.hair.length = 1;
            this.changes++;
        }

        // Shrink titties
        if (this.player.biggestTitSize() > 0 && this.changes < this.changeLimit && rand(3) === 0 && !this.flags[kFLAGS.HYPER_HAPPY]) {
            const temp2: number = 0;
            let temp3: number = 0;
            // temp3 stores how many rows are changed
            for (let k: number = 0; k < this.player.breastRows.length; k++) {
                // If this row is over threshhold
                if (this.player.breastRows[k].breastRating > temp2) {
                    // Big change
                    if (this.player.breastRows[k].breastRating > 10) {
                        this.player.breastRows[k].breastRating -= 2 + rand(3);
                        if (temp3 === 0) this.outputText("\n\nThe " + this.player.breastDescript(0) + " on your chest wobble for a second, then tighten up, losing several cup-sizes in the process!");
                        else this.outputText(" The change moves down to your " + ImpFood.num2Text2(k + 1) + " row of " + this.player.breastDescript(0) + ". They shrink greatly, losing a couple cup-sizes.");
                    }
                    // Small change
                    else {
                        this.player.breastRows[k].breastRating -= 1;
                        if (temp3 === 0) this.outputText("\n\nAll at once, your sense of gravity shifts. Your back feels a sense of relief, and it takes you a moment to realize your " + this.player.breastDescript(k) + " have shrunk!");
                        else this.outputText(" Your " + ImpFood.num2Text2(k + 1) + " row of " + this.player.breastDescript(k) + " gives a tiny jiggle as it shrinks, losing some off its mass.");
                    }
                    // Increment changed rows
                    temp3++;
                }
            }
            this.changes++;
        }

        // Remove spare titties
        if (this.player.bRows() > 1 && rand(3) === 0 && this.changes < this.changeLimit && !this.flags[kFLAGS.HYPER_HAPPY]) {
            this.mutations.removeExtraBreastRow(tfSource);
        }

        // Free extra nipple removal service
        if (this.player.averageNipplesPerBreast() > 1 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nA strange burning sensation fills your breasts, and you look in your " + this.player.armorName + " to see your extra nipples are gone! <b>You've lost your extra nipples!</b>");
            this.dynStats("sen", -3);
            for (let x: number = 0; x < this.player.bRows(); x++) {
                this.player.breastRows[x].nipplesPerBreast = 1;
            }
            this.changes++;
        }

        // Neck restore
        if (this.player.neck.type != Neck.NORMAL && this.changes < this.changeLimit && rand(4) == 0) this.mutations.restoreNeck(tfSource);
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && rand(5) == 0) this.mutations.restoreRearBody(tfSource);
        // Ovi perk loss
        if (rand(5) === 0 && this.changes < this.changeLimit) {
            this.mutations.updateOvipositionPerk(tfSource);
        }

        // You lotta imp? Time to turn male!
        // Unless you're one of the hyper happy assholes I guess
        // For real tho doesn't seem like female imps exist? Guess they're goblins
        if (this.player.impScore() >= 4 && this.changes < this.changeLimit && !this.flags[kFLAGS.HYPER_HAPPY]) {
            if (this.player.bRows() > 1) {
                this.outputText("\n\nYou stumble back when your center of balance shifts, and though you adjust before you can fall over, you're left to watch in awe as your extra breasts shrink down, disappearing completely into your body. The nipples even fade away until they're gone completely. <b>You've lost your extra breasts due to being an imp!</b>");
                this.player.breastRows.length = 1;
            }
            if (this.player.biggestTitSize() > 0) {
                this.outputText("\n\nAll at once, your sense of gravity shifts. Your back feels a sense of relief, and it takes you a moment to realize your breasts have gone flat! <b>You've lost your breasts due to being an imp!</b>");
                this.player.breastRows[0].breastRating = 0;
            }
            if (this.player.averageNipplesPerBreast() > 1) {
                this.outputText("\n\nA strange burning sensation fills your breasts, and you look in your " + this.player.armorName + " to see your extra nipples are gone! <b>You've lost your extra nipples due to being an imp!</b>");
                for (let z: number = 0; z < this.player.bRows(); z++) {
                    this.player.breastRows[z].nipplesPerBreast = 1;
                }
            }
            if (this.player.nippleLength > 0.25) {
                this.outputText("\n\nA strange burning sensation fills you, and you look in your " + this.player.armorName + " to see your nipples have shrunk! <b>Your nipples have shrunk due to being an imp!</b>");
                this.player.nippleLength = 0.25;
            }
            if (this.player.hasVagina()) {
                this.outputText("\n\nA sudden pain in your groin brings you to your knees. You move your armor out of the way and watch as your cunt seals up, vanishing from your body entirely. <b>Your cunt has gone away due to being an imp!</b>");
                this.player.removeVagina();
            }
            if (!this.player.hasCock()) {
                this.outputText("\n\nPressure builds between your legs, and you barely get your armor off in time to watch a cock grow out of you. <b>You've grown a cock due to being an imp!</b>");
                this.player.createCock();
                this.player.cocks[0].cockLength = 12;
                this.player.cocks[0].cockThickness = 2;
                this.player.cocks[0].cockType = CockTypesEnum.HUMAN;
            }
            if (this.player.balls === 0) {
                this.outputText("\n\nA strange, unpleasant pressure forms between your thighs. You take off your armor and see that you've grown balls. <b>You've grown balls due to being an imp!</b>");
                this.player.balls = 2;
                this.player.ballSize = 2;
            }
            this.changes++;
            this.dynStats("cor", 20);
        }
        this.game.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;
        return false;
    }
}
