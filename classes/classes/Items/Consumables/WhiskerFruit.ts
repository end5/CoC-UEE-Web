import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { Tongue } from "../../BodyParts/Tongue";
import { rand } from "../../Extra";
import { CockTypesEnum } from "../../CockTypesEnum";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { Ears } from "../../BodyParts/Ears";
import { Tail } from "../../BodyParts/Tail";
import { Appearance } from "../../Appearance";
import { Neck } from "../../BodyParts/Neck";
import { Face } from "../../BodyParts/Face";
import { LowerBody } from "../../BodyParts/LowerBody";
import { Arms } from "../../BodyParts/Arms";
import { Skin } from "../../BodyParts/Skin";
import { ColorLists } from "../../lists/ColorLists";
import { UnderBody } from "../../BodyParts/UnderBody";
import { Eyes } from "../../BodyParts/Eyes";

/**
 * Feline transformative item.
 */
export class WhiskerFruit extends Consumable {
    public constructor() {
        super("W.Fruit", "W.Fruit", "a piece of whisker-fruit", ConsumableLib.DEFAULT_VALUE, "This small, peach-sized fruit has tiny whisker-like protrusions growing from the sides.");
    }

    public useItem(): boolean {
        let temp: number = 0;
        let tfSource: string = "catTransformation";

        if (this.player.hasReptileScales() && this.player.hasDragonWings() && this.player.tongue.type === Tongue.DRACONIC)
            tfSource = "catTransformation-dragonne";
        let temp2: number = 0;
        let temp3: number = 0;
        this.mutations.initTransformation([2, 2, 3]);
        // Text go!
        this.clearOutput();
        this.outputText("You take a bite of the fruit and gulp it down. It's thick and juicy and has an almost overpowering sweetness. Nevertheless, it is delicious and you certainly could use a meal.  You devour the fruit, stopping only when the hard, nubby pit is left; which you toss aside.");
        // Speed raises up to 75
        if (this.player.spe100 < 75 && rand(3) === 0 && this.changes < this.changeLimit) {
            // low speed
            if (this.player.spe100 <= 30) {
                this.outputText("\n\nYou feel... more balanced, sure of step. You're certain that you've become just a little bit faster.");
                this.dynStats("spe", 2);
            }
            // medium speed
            else if (this.player.spe100 <= 60) {
                this.outputText("\n\nYou stumble as you shift position, surprised by how quickly you move. After a moment or two of disorientation, you adjust. You're certain that you can run faster now.");
                this.dynStats("spe", 1);
            }
            // high speed
            else {
                this.outputText("\n\nYou pause mid-step and crouch. Your leg muscles have cramped up like crazy. After a few moments, the pain passes and you feel like you could chase anything down.");
                this.dynStats("spe", .5);
            }
        }
        // Strength raises to 40
        if (this.player.str100 < 40 && rand(3) === 0 && this.changes < this.changeLimit) {
            if (rand(2) === 0) this.outputText("\n\nYour muscles feel taut, like a coiled spring, and a bit more on edge.");
            else this.outputText("\n\nYou arch your back as your muscles clench painfully.  The cramp passes swiftly, leaving you feeling like you've gotten a bit stronger.");
            this.dynStats("str", 1);
        }
        // Strength ALWAYS drops if over 60
        // Does not add to change total
        else if (this.player.str100 > 60 && rand(2) === 0) {
            this.outputText("\n\nShivers run from your head to your toes, leaving you feeling weak.  Looking yourself over, your muscles seemed to have lost some bulk.");
            this.dynStats("str", -2);
        }
        // Toughness drops if over 50
        // Does not add to change total
        if (this.player.tou100 > 50 && rand(2) === 0) {
            this.outputText("\n\nYour body seems to compress momentarily, becoming leaner and noticeably less tough.");
            this.dynStats("tou", -2);
        }
        // Intelliloss
        if (rand(4) === 0 && this.changes < this.changeLimit) {
            // low intelligence
            if (this.player.inte100 < 15) this.outputText("\n\nYou feel like something is slipping away from you but can't figure out exactly what's happening.  You scrunch up your " + this.player.faceDescript() + ", trying to understand the situation.  Before you can reach any kind of conclusion, something glitters in the distance, distracting your feeble mind long enough for you to forget the problem entirely.");
            // medium intelligence
            else if (this.player.inte100 < 50) {
                this.outputText("\n\nYour mind feels somewhat sluggish, and you wonder if you should just lie down ");
                if (rand(2) === 0) {
                    this.outputText("somewhere and ");
                    temp = rand(3);
                    if (temp === 0) this.outputText("toss a ball around or something");
                    else if (temp === 1) this.outputText("play with some yarn");
                    else if (temp === 2) this.outputText("take a nap and stop worrying");
                }
                else this.outputText("in the sun and let your troubles slip away");
                this.outputText(".");
            }
            // High intelligence
            else this.outputText("\n\nYou start to feel a bit dizzy, but the sensation quickly passes.  Thinking hard on it, you mentally brush away the fuzziness that seems to permeate your brain and determine that this fruit may have actually made you dumber.  It would be best not to eat too much of it.");
            this.dynStats("int", -1);
        }
        // Libido gain
        if (this.player.lib100 < 80 && this.changes < this.changeLimit && rand(4) === 0) {
            // Cat dicked folks
            if (this.player.countCocksOfType(CockTypesEnum.CAT) > 0) {
                temp = this.player.findFirstCockType(CockTypesEnum.CAT);
                this.outputText("\n\nYou feel your " + this.player.cockDescript(temp) + " growing hard, the barbs becoming more sensitive. You gently run your hands down them and imagine the feeling of raking the insides of a cunt as you pull.  The fantasy continues, and after ejaculating and hearing the female yowl with pleasure, you shake your head and try to drive off the image.  ");
                if (this.player.cor < 33) this.outputText("You need to control yourself better.");
                else if (this.player.cor < 66) this.outputText("You're not sure how you feel about the fantasy.");
                else this.outputText("You hope to find a willing partner to make this a reality.");
            }
            // Else –
            else {
                this.outputText("\n\nA rush of tingling warmth spreads through your body as it digests the fruit.  You can feel your blood pumping through your extremities, making them feel sensitive and surprisingly sensual.  It's going to be hard to resist getting ");
                if (this.player.lust100 > 60) this.outputText("even more ");
                this.outputText("turned on.");
            }
            this.dynStats("lib", 1, "sen", .25);
        }

        // Sexual changes would go here if I wasn't a tard.
        // Heat
        if (rand(4) === 0 && this.changes < this.changeLimit) {
            const intensified: boolean = this.player.inHeat;

            if (this.player.goIntoHeat(false)) {
                if (intensified) {
                    if (rand(2) === 0) this.outputText("\n\nThe itch inside your " + this.player.vaginaDescript(0) + " is growing stronger, and you desperately want to find a nice cock to massage the inside.");
                    else this.outputText("\n\nThe need inside your " + this.player.vaginaDescript(0) + " grows even stronger.  You desperately need to find a mate to 'scratch your itch' and fill your womb with kittens.  It's difficult NOT to think about a cock slipping inside your moist fuck-tunnel, and at this point you'll have a hard time resisting ANY male who approaches.");
                }
                else {
                    this.outputText("\n\nThe interior of your " + this.player.vaginaDescript(0) + " clenches tightly, squeezing with reflexive, aching need.  Your skin flushes hot ");
                    if (this.player.hasFur()) this.outputText("underneath your fur ");
                    this.outputText("as images and fantasies ");
                    if (this.player.cor < 50) this.outputText("assault ");
                    else this.outputText("fill ");
                    this.outputText(" your mind.  Lithe cat-boys with their perfect, spine-covered cocks line up behind you, and you bend over to present your needy pussy to them.  You tremble with the desire to feel the exotic texture of their soft barbs rubbing your inner walls, smearing your " + this.player.vaginaDescript(0) + " with their cum as you're impregnated.  Shivering, you recover from the fantasy and pull your fingers from your aroused sex.  <b>It would seem you've gone into heat!</b>");
                }
                this.changes++;
            }
        }

        // Shrink the boobalies down to A for men or C for girls.
        if (this.changes < this.changeLimit && rand(4) === 0 && !this.flags[kFLAGS.HYPER_HAPPY]) {
            temp2 = 0;
            temp3 = 0;
            // Determine if shrinkage is required
            // and set temp2 to threshold
            if (!this.player.hasVagina() && this.player.biggestTitSize() > 2) temp2 = 2;
            else if (this.player.biggestTitSize() > 4) temp2 = 4;
            // IT IS!
            if (temp2 > 0) {
                // temp3 stores how many rows are changed
                temp3 = 0;
                for (let k: number = 0; k < this.player.breastRows.length; k++) {
                    // If this row is over threshhold
                    if (this.player.breastRows[k].breastRating > temp2) {
                        // Big change
                        if (this.player.breastRows[k].breastRating > 10) {
                            this.player.breastRows[k].breastRating -= 2 + rand(3);
                            if (temp3 === 0) this.outputText("\n\nThe " + this.player.breastDescript(0) + " on your chest wobble for a second, then tighten up, losing several cup-sizes in the process!");
                            else this.outputText("  The change moves down to your " + WhiskerFruit.num2Text2(k + 1) + " row of " + this.player.breastDescript(0) + ". They shrink greatly, losing a couple cup-sizes.");
                        }
                        // Small change
                        else {
                            this.player.breastRows[k].breastRating -= 1;
                            if (temp3 === 0) this.outputText("\n\nAll at once, your sense of gravity shifts.  Your back feels a sense of relief, and it takes you a moment to realize your " + this.player.breastDescript(k) + " have shrunk!");
                            else this.outputText("  Your " + WhiskerFruit.num2Text2(k + 1) + " row of " + this.player.breastDescript(k) + " gives a tiny jiggle as it shrinks, losing some off its mass.");
                        }
                        // Increment changed rows
                        temp3++;
                    }
                }
            }
            // Count that tits were shrunk
            if (temp3 > 0) this.changes++;
        }
        // Cat dangly-doo.
        if (this.player.cockTotal() > 0 && this.player.countCocksOfType(CockTypesEnum.CAT) < this.player.cockTotal() && (this.player.ears.type === Ears.CAT || rand(3) > 0) && (this.player.tail.type === Tail.CAT || rand(3) > 0) && this.changes < this.changeLimit && rand(4) === 0) {
            // loop through and find a non-cat wang.
            let i = 0;
            for (; i < (this.player.cockTotal()) && this.player.cocks[i].cockType === CockTypesEnum.CAT; i++) { }
            this.outputText("\n\nYour " + this.player.cockDescript(i) + " swells up with near-painful arousal and begins to transform.  It turns pink and begins to narrow until the tip is barely wide enough to accommodate your urethra.  Barbs begin to sprout from its flesh, if you can call the small, fleshy nubs barbs. They start out thick around the base of your " + Appearance.cockNoun(CockTypesEnum.HUMAN) + " and shrink towards the tip. The smallest are barely visible. <b>Your new feline dong throbs powerfully</b> and spurts a few droplets of cum.  ");
            if (!this.player.hasSheath()) {
                this.outputText("Then, it begins to shrink and sucks itself inside your body.  Within a few moments, a fleshy sheath is formed.");
                if (this.player.balls > 0) this.outputText("  Thankfully, your balls appear untouched.");
            }
            else this.outputText("Then, it disappears back into your sheath.");
            this.player.cocks[i].cockType = CockTypesEnum.CAT;
            this.changes++;
        }
        // Cat penorz shrink
        if (this.player.countCocksOfType(CockTypesEnum.CAT) > 0 && rand(3) === 0 && this.changes < this.changeLimit && !this.flags[kFLAGS.HYPER_HAPPY]) {
            // loop through and find a cat wang.
            temp = 0;
            let j = 0;
            for (; j < (this.player.cockTotal()); j++) {
                if (this.player.cocks[j].cockType === CockTypesEnum.CAT && this.player.cocks[j].cockLength > 6) {
                    temp = 1;
                    break;
                }
            }
            if (temp === 1) {
                // lose 33% size until under 10, then lose 2" at a time
                if (this.player.cocks[j].cockLength > 16) {
                    this.outputText("\n\nYour " + this.player.cockDescript(j) + " tingles, making your sheath feel a little less tight.  It dwindles in size, losing a full third of its length and a bit of girth before the change finally stops.");
                    this.player.cocks[j].cockLength *= .66;
                }
                else if (this.player.cocks[j].cockLength > 6) {
                    this.outputText("\n\nYour " + this.player.cockDescript(j) + " tingles and withdraws further into your sheath.  If you had to guess, you'd say you've lost about two inches of total length and perhaps some girth.");
                    this.player.cocks[j].cockLength -= 2;
                }
                if (this.player.cocks[j].cockLength / 5 < this.player.cocks[j].cockThickness && this.player.cocks[j].cockThickness > 1.25) this.player.cocks[j].cockThickness = this.player.cocks[j].cockLength / 6;
                // Check for any more!
                temp2 = 0;
                j++;
                for (j; j < this.player.cocks.length; j++) {
                    // Found another cat wang!
                    if (this.player.cocks[j].cockType === CockTypesEnum.CAT) {
                        // Long enough - change it
                        if (this.player.cocks[j].cockLength > 6) {
                            if (this.player.cocks[j].cockLength > 16)
                                this.player.cocks[j].cockLength *= .66;
                            else if (this.player.cocks[j].cockLength > 6)
                                this.player.cocks[j].cockLength -= 2;
                            // Thickness adjustments
                            if (this.player.cocks[j].cockLength / 5 < this.player.cocks[j].cockThickness && this.player.cocks[j].cockThickness > 1.25) this.player.cocks[j].cockThickness = this.player.cocks[j].cockLength / 6;
                            temp2 = 1;
                        }
                    }
                }
                // (big sensitivity boost)
                this.outputText("  Although the package is smaller, it feels even more sensitive – as if it retained all sensation of its larger size in its smaller form.");
                this.dynStats("sen", 5);
                // Make note of other dicks changing
                if (temp2 === 1) this.outputText("  Upon further inspection, all your " + Appearance.cockNoun(CockTypesEnum.CAT) + "s have shrunk!");
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
        // Body type changes.  Teh rarest of the rare.
        // Catgirl-face -> cat-morph-face
        if (this.player.face.type === Face.CATGIRL &&
            this.player.tongue.type === Tongue.CAT &&
            this.player.ears.type === Ears.CAT &&
            this.player.tail.type === Tail.CAT &&
            this.player.lowerBody.type === LowerBody.CAT &&
            this.player.arms.type === Arms.CAT &&
            (this.player.hasFur() || (this.player.hasReptileScales() && this.player.dragonneScore() >= 4)) &&
            rand(5) === 0 && this.changes < this.changeLimit
        ) {
            this.outputText("\n\nMind-numbing pain courses through you as you feel your facial bones rearranging."
                + " You clutch at your face in agony as your skin crawls and shifts, your visage reshaping to replace your facial"
                + " characteristics with those of a feline along with a muzzle, a cute cat-nose and whiskers.");
            this.outputText("\n<b>You now have a cat-face.</b>");
            this.player.face.type = Face.CAT;
            this.changes++;
        }
        // DA EARZ
        if (this.player.ears.type !== Ears.CAT && rand(5) === 0 && this.changes < this.changeLimit) {
            // human to cat:
            if (this.player.ears.type === Ears.HUMAN) {
                if (rand(2) === 0) this.outputText("\n\nThe skin on the sides of your face stretches painfully as your ears migrate upwards, towards the top of your head. They shift and elongate a little, fur growing on them as they become feline in nature. <b>You now have cat ears.</b>");
                else this.outputText("\n\nYour ears begin to tingle. You reach up with one hand and gently rub them. They appear to be growing fur. Within a few moments, they've migrated up to the top of your head and increased in size. The tingling stops and you find yourself hearing noises in a whole new way. <b>You now have cat ears.</b>");
            }
            // non human to cat:
            else {
                if (rand(2) === 0) this.outputText("\n\nYour ears change shape, morphing into pointed, feline ears!  They swivel about reflexively as you adjust to them.  <b>You now have cat ears.</b>");
                else this.outputText("\n\nYour ears tingle and begin to change shape. Within a few moments, they've become long and feline.  Thanks to the new fuzzy organs, you find yourself able to hear things that eluded your notice up until now. <b>You now have cat ears.</b>");
            }
            this.player.ears.type = Ears.CAT;
            this.changes++;
        }
        // DA TAIL (IF ALREADY HAZ URZ)
        if (this.player.tail.type !== Tail.CAT && this.player.ears.type === Ears.CAT && rand(5) === 0 && this.changes < this.changeLimit) {
            if (this.player.tail.type === Tail.NONE) {
                temp = rand(3);
                if (temp === 0) this.outputText("\n\nA pressure builds in your backside. You feel under your " + this.player.armorName + " and discover an odd bump that seems to be growing larger by the moment. In seconds it passes between your fingers, bursts out the back of your clothes and grows most of the way to the ground. A thick coat of fur springs up to cover your new tail. You instinctively keep adjusting it to improve your balance. <b>You now have a cat-tail.</b>");
                if (temp === 1) this.outputText("\n\nYou feel your backside shift and change, flesh molding and displacing into a long, flexible tail! <b>You now have a cat tail.</b>");
                if (temp === 2) this.outputText("\n\nYou feel an odd tingling in your spine and your tail bone starts to throb and then swell. Within a few moments it begins to grow, adding new bones to your spine. Before you know it, you have a tail. Just before you think it's over, the tail begins to sprout soft, glossy " + this.player.skin.furColor + " fur. <b>You now have a cat tail.</b>");
            }
            else this.outputText("\n\nYou pause and tilt your head... something feels different.  Ah, that's what it is; you turn around and look down at your tail as it starts to change shape, narrowing and sprouting glossy fur. <b>You now have a cat tail.</b>");
            this.player.tail.type = Tail.CAT;
            this.changes++;
        }
        // Da paws (if already haz ears & tail)
        if (this.player.tail.type === Tail.CAT && this.player.ears.type === Ears.CAT && rand(5) === 0 && this.changes < this.changeLimit && this.player.lowerBody.type !== LowerBody.CAT) {
            // hoof to cat:
            if (this.player.lowerBody.type === LowerBody.HOOFED) {
                this.outputText("\n\nYou feel your hooves suddenly splinter, growing into five unique digits. Their flesh softens as your hooves reshape into furred cat paws. <b>You now have cat paws.</b>");
                if (this.player.isTaur()) this.outputText("  You feel woozy and collapse on your side.  When you wake, you're no longer a centaur and your body has returned to a humanoid shape.");
            }
            // Goo to cat
            else if (this.player.lowerBody.type === LowerBody.GOO) {
                this.outputText("\n\nYour lower body rushes inward, molding into two leg-like shapes that gradually stiffen up.  In moments they solidify into digitigrade legs, complete with soft, padded cat-paws.  <b>You now have cat-paws!</b>");
            }
            // non hoof to cat:
            else this.outputText("\n\nYou scream in agony as you feel the bones in your " + this.player.feet() + " break and begin to rearrange. When the pain fades, you feel surprisingly well-balanced. <b>You now have cat paws.</b>");
            this.player.lowerBody.type = LowerBody.CAT;
            this.player.lowerBody.legCount = 2;
            this.changes++;
        }
        // TURN INTO A FURRAH!  OH SHIT
        if (this.player.tail.type === Tail.CAT && this.player.ears.type === Ears.CAT && rand(5) === 0 && this.changes < this.changeLimit && this.player.lowerBody.type === LowerBody.CAT && !this.player.hasFur()) {
            this.outputText("\n\nYour " + this.player.skin.desc + " begins to tingle, then itch. ");
            this.player.skin.type = Skin.FUR;
            this.player.skin.desc = "fur";
            this.player.setFurColor(ColorLists.CAT_FUR, { type: UnderBody.FURRY }, true);
            this.outputText("You reach down to scratch your arm absent-mindedly and pull your fingers away to find strands of " + this.player.skin.furColor + " fur. Wait, fur?  What just happened?! You spend a moment examining yourself and discover that <b>you are now covered in glossy, soft fur.</b>");
            this.changes++;
        }
        // Fix old cat faces without cat-eyes.
        if (this.player.hasCatFace() && !this.player.hasCatEyes() && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nFor a moment your sight shifts as the ambient light suddenly turns extremely bright, almost blinding you."
                + " You walk around disoriented until the luminosity fades back to normal."
                + " You run to a puddle of water to check your reflection and quickly notice your pupils have become cat-like.");
            this.outputText("\n<b>You now have cat-eyes!</b>");
            this.player.eyes.setType(Eyes.CAT);
            this.changes++;
        }
        // CAT-FACE!  FULL ON FURRY!  RAGE AWAY NEKOZ
        if (this.player.tail.type === Tail.CAT && this.player.ears.type === Ears.CAT && this.player.lowerBody.type === LowerBody.CAT && !this.player.hasCatFace() && rand(5) === 0 && this.changes < this.changeLimit) {
            // Gain cat face, replace old face
            this.outputText("\n\nYou feel your canines changing, elongating into sharp dagger-like teeth capable of causing severe injuries."
                + " Funnily, your face remained relatively human even after the change. You purr at the change, giving you a cute look."
                + "[if (hasCatEyes == false)\nFor a moment your sight shifts as the ambient light suddenly turns extremely bright,"
                + " almost blinding you. You walk around disoriented until the luminosity fades back to normal."
                + " You run to a puddle of water to check your reflection and quickly notice your pupils have become cat-like.]");
            this.outputText("\n<b>You now have the face of a cat-" + this.player.mf("boy", "girl") + "!</b>");
            this.player.face.setType(Face.CATGIRL);
            this.changes++;
        }
        // Cat-tongue
        if (this.player.hasCatFace() && this.player.tongue.type !== Tongue.CAT && rand(5) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYour tongue suddenly feel weird. You try to stick it out to see whats going on and discover it changed to look"
                + " similar to the tongue of a cat. At least you will be able to groom yourself properly with <b>your new cat tongue</b>.");
            this.player.tongue.type = Tongue.CAT;
            this.changes++;
        }
        // Arms
        if (this.player.arms.type !== Arms.CAT && this.player.isFurry() && this.player.tail.type === Tail.CAT && this.player.lowerBody.type === LowerBody.CAT && rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nWeakness overcomes your arms, and no matter what you do, you can’t muster the strength to raise or move them."
                + " Did the fruit have some drug-like effects? Sitting on the ground, you wait for the limpness to end."
                + " As you do so, you realize that the bones at your hands are changing, as well as the muscles on your arms."
                + " They’re soon covered, from the shoulders to the tip of your digits, on a layer of soft,"
                + " fluffy [if (hasFurryUnderBody)[underBody.furColor]|[furColor]] fur. Your hands gain pink,"
                + " padded paws where your palms were once, and your nails become long, thin, curved claws,"
                + " sharp enough to tear flesh and nimble enough to make climbing and exploring easier."
                + " <b>Your arms have become like those of a cat!</b>");
            this.player.arms.setType(Arms.CAT);
            this.changes++;
        }
        // Remove gills
        if (rand(4) === 0 && this.player.hasGills() && this.changes < this.changeLimit) {
            this.mutations.updateGills();
        }
        // FAILSAFE CHANGE
        if (this.changes === 0) {
            this.outputText("\n\nInhuman vitality spreads through your body, invigorating you!\n");
            this.player.HPChange(50, true);
            this.dynStats("lus", 3);
        }
        if (this.changes < this.changeLimit) {
            if (rand(2) === 0) this.outputText(this.player.modThickness(5, 2));
            if (rand(2) === 0) this.outputText(this.player.modTone(76, 2));
            if (this.player.gender < 2) if (rand(2) === 0) this.outputText(this.player.modFem(65, 1));
            else this.outputText(this.player.modFem(85, 2));
        }
        this.player.refillHunger(20);
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;

        return false;
    }
}
