import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand, int } from "../../Extra";
import { Antennae } from "../../BodyParts/Antennae";
import { Horns } from "../../BodyParts/Horns";
import { Wings } from "../../BodyParts/Wings";
import { RearBody } from "../../BodyParts/RearBody";
import { Tongue } from "../../BodyParts/Tongue";
import { Eyes } from "../../BodyParts/Eyes";
import { LowerBody } from "../../BodyParts/LowerBody";
import { CockTypesEnum } from "../../CockTypesEnum";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { Skin } from "../../BodyParts/Skin";
import { UnderBody } from "../../BodyParts/UnderBody";
import { Ears } from "../../BodyParts/Ears";
import { Tail } from "../../BodyParts/Tail";
import { Hair } from "../../BodyParts/Hair";
import { Face } from "../../BodyParts/Face";
import { Neck } from "../../BodyParts/Neck";

/**
 * Wolf transformative item.
 *
 * @author Foxwells
 */
export class WolfPepper extends Consumable {
    public constructor() {
        super("Wolf Pp", "Wolf Pp", "a Wolf Pepper", ConsumableLib.DEFAULT_VALUE, "The pepper is shiny and black, bulbous at the base but long and narrow at the tip. It has a fuzzy feel to it and it smells spicy. Somehow, you know it's different from the usual Canine Peppers you see.");
    }

    // Fuck yo dog shit we full-on wolf bitches now -Foxwells
    public useItem(): boolean {
        const tfSource: string = "wolfPepper";
        let temp: number = 0; // best variable name ever!
        let temp2: number = 0;
        let temp3: number = 0;
        let crit: number = 1;
        this.mutations.initTransformation([2, 2]);
        this.clearOutput();
        this.credits.authorText = "Foxwells";
        this.outputText("The pepper has an uncomfortable texture to it, being covered in soft fuzz like it's a peach but somewhat crunchy like any other pepper. Its spiciness makes you nearly spit it out, and you're left sniffling after.");
        if (rand(100) < 15) {
            crit = int(Math.random() * 20) / 10 + 2;
            this.outputText(" Maybe it was a bit too spicy... The pepper seemed far more ripe than what you'd expect.");
        }
        // STAT CHANGES - TOU SPE INT RANDOM CHANCE, LIB LUST COR ALWAYS UPPED
        this.dynStats("lib", 1 + rand(2), "lus", 5 + rand(10), "cor", 1 + rand(5));
        this.outputText("\n\nYou lick your lips after you finish. That spiciness hit you in more ways than one.");
        if (this.player.tou100 < 70 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.dynStats("tou", (1 * crit));
            if (crit > 1) this.outputText("\n\nYou roll your shoulders and tense your arms experimentally. You feel more durable, and your blood seems to run through you more clearly. You know you have more endurance.");
            else this.outputText("\n\nYour muscles feel denser and more durable. Not so much that feel stronger, but you feel like you can take more hits.");
        }
        if (this.player.spe100 > 30 && rand(7) === 0 && this.changes < this.changeLimit) {
            this.dynStats("spe", (-1 * crit));
            if (crit > 1) this.outputText("\n\nThe pepper's strong taste makes you take a couple steps back and lean against the nearest solid object. You don't feel like you'll be moving very fast anymore.");
            else this.outputText("\n\nYou stumble forward, but manage to catch yourself. Still, though, you feel somewhat slower.");
        }
        if (this.player.inte100 < 60 && rand(7) === 0 && this.changes < this.changeLimit) {
            this.dynStats("int", (1 * crit));
            this.outputText("\n\nThe spiciness makes your head twirl, but you manage to gather yourself. A strange sense of clarity comes over you in the aftermath, and you feel ");
            if (crit > 1) this.outputText("a lot ");
            this.outputText("smarter somehow.");
        }
        // MUTATIONZZZZZ
        // PRE-CHANGES: become biped, remove horns, remove wings, give human tongue, remove claws, remove antennea
        // no claws
        if (rand(4) === 0) {
            this.player.arms.claws.restore();
        }
        // remove antennae
        if (this.player.antennae.type !== Antennae.NONE && rand(3) === 0 && this.changes < this.changeLimit) {
            this.mutations.removeAntennae();
        }
        // remove horns
        if ((this.player.horns.type !== Horns.NONE || this.player.horns.value > 0) && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou feel your horns crumble, falling apart in large chunks until they flake away into nothing.");
            this.player.horns.value = 0;
            this.player.horns.type = Horns.NONE;
            this.changes++;
        }
        // remove wings
        if ((this.player.wings.type !== Wings.NONE || this.player.rearBody.type == RearBody.SHARK_FIN) && rand(3) === 0 && this.changes < this.changeLimit) {
            if (this.player.rearBody.type == RearBody.SHARK_FIN) {
                this.outputText("\n\nA wave of tightness spreads through your back, and it feels as if someone is stabbing a dagger into your spine."
                    + " After a moment the pain passes, though your fin is gone!");
                this.player.rearBody.restore();
            } else {
                this.outputText("\n\nA wave of tightness spreads through your back, and it feels as if someone is stabbing a dagger into each of your"
                    + " shoulder-blades. After a moment the pain passes, though your wings are gone!");
            }
            this.player.wings.restore();
            this.changes++;
        }
        // give human tongue
        if (this.player.tongue.type !== Tongue.HUMAN && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou lick the roof of your mouth, noticing that your tongue feels different. It then hits you-- <b>You have a human tongue!</b>");
            this.player.tongue.type = Tongue.HUMAN;
            this.changes++;
        }
        // remove non-wolf eyes
        if (this.changes < this.changeLimit && rand(3) === 0 && this.player.eyes.type !== Eyes.HUMAN && this.player.eyes.type !== Eyes.WOLF) {
            if (this.player.eyes.type === Eyes.BLACK_EYES_SAND_TRAP) {
                this.outputText("\n\nYou feel a twinge in your eyes and you blink. It feels like black cataracts have just fallen away from you, and you know without needing to see your reflection that your eyes have gone back to looking human.");
            } else {
                this.outputText("\n\nYou blink and stumble, a wave of vertigo threatening to pull your " + this.player.feet() + " from under you. As you steady and open your eyes, you realize something seems different. Your vision is changed somehow.");
                if (this.player.eyes.type === Eyes.FOUR_SPIDER_EYES || this.player.eyes.type == Eyes.SPIDER) this.outputText(" Your arachnid eyes are gone!");
                this.outputText("  <b>You have normal, human eyes.</b>");
            }
            this.player.eyes.type = Eyes.HUMAN;
            this.player.eyes.count = 2;
            this.changes++;
        }
        // normal legs
        if (this.player.lowerBody.type !== LowerBody.WOLF && rand(4) === 0) {
            this.mutations.restoreLegs(tfSource);
        }
        // normal arms
        if (rand(4) === 0) {
            this.mutations.restoreArms(tfSource);
        }
        // remove feather hair
        if (rand(4) === 0) {
            this.mutations.removeFeatheryHair();
        }
        // remove basilisk hair
        if (rand(4) === 0) {
            this.mutations.removeBassyHair();
        }
        // MUTATIONZ AT ANY TIME: wolf dick, add/decrease breasts, decrease breast size if above D
        // get a wolf dick
        // if ya genderless we give ya a dick cuz we nice like that
        if (this.player.gender === 0 && this.player.cocks.length === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou double over as a pain fills your groin, and you take off your " + this.player.armorName + " just in time to watch a bulge push out of your body. The skin folds back and bunches up into a sheath, revealing a red, knotted wolf cock drooling pre-cum underneath it. You take a shuddering breath as the pain dies down, leaving you with only a vague sense of lust and quiet admiration for your new endowment. <b>You now have a wolf cock.</b>");
            this.player.createCock();
            this.player.cocks[0].cockLength = rand(4) + 4;
            this.player.cocks[0].cockThickness = rand(2);
            this.player.cocks[0].knotMultiplier = 1.5;
            this.player.cocks[0].cockType = CockTypesEnum.WOLF;
            this.dynStats("lib", 3, "sen", 2, "lus", 25);
            this.changes++;
        }
        // if ya got a dick that's ok too we'll change it to wolf
        if (this.player.hasCock()) { // shamelessly copy/pasted from dog cock
            if (this.player.wolfCocks() < this.player.cocks.length && this.changes < this.changeLimit && rand(2) === 0) {
                // Select first non-wolf cock
                temp = this.player.cocks.length;
                temp2 = 0;
                while (temp > 0 && temp2 === 0) {
                    temp--;
                    // Store cock index if not a wolfCock and exit loop
                    if (this.player.cocks[temp].cockType !== CockTypesEnum.WOLF) {
                        temp3 = temp;
                        // kicking out of the loop
                        temp2 = 1000;
                    }
                }
                // Using generic description because what's even the point of multiple descriptions--
                if (this.player.cocks[temp3].cockType.Index > 4) {
                    this.outputText("\n\nYour " + this.player.cockDescript(temp3) + " trembles, resizing and reshaping itself into a shining, red wolf cock with a fat knot at the base. <b>You now have a wolf cock.</b>");
                    this.dynStats("sen", 3, "lus", 5 * crit);
                    if (this.player.cocks[temp3].cockType === CockTypesEnum.HORSE) { // horses get changes
                        if (this.player.cocks[temp3].cockLength > 6) this.player.cocks[temp3].cockLength -= 2;
                        else this.player.cocks[temp3].cockLength -= .5;
                        this.player.cocks[temp3].cockThickness += .5;
                    }
                }
                this.player.cocks[temp3].cockType = CockTypesEnum.WOLF;
                this.player.cocks[temp3].knotMultiplier = 1.5;
                this.player.cocks[temp3].thickenCock(2);
                this.changes++;
            }
        }
        // titties for those who got titties
        // wolfs have 8 nips so, 4 rows max. fen has no power here I'm making a wolf not a dog.
        // tbh also shamelessly copy/pasted from dog and adjusted according
        if (this.player.breastRows.length > 0 && this.player.breastRows.length <= 4) {
            if (this.player.breastRows[0].breastRating > 0) {
                if (this.player.breastRows.length < 4 && rand(2) === 0 && this.changes < this.changeLimit) {
                    this.player.createBreastRow();
                    // Store temp to the index of the newest row
                    temp = this.player.breastRows.length - 1;
                    // Breasts are too small to grow a new row, so they get bigger first
                    if (this.player.breastRows[0].breastRating <= this.player.breastRows.length) {
                        this.outputText("\n\nYour " + this.player.breastDescript(0) + " feel constrained and painful against your top as they grow larger by the moment, finally stopping as they reach ");
                        this.player.breastRows[0].breastRating += 1;
                        this.outputText(this.player.breastCup(0) + " size.");
                        this.changes++;
                    }
                    // Had 1 row to start
                    if (this.player.breastRows.length === 2 && this.changes < this.changeLimit) {
                        // 1 size below primary breast row
                        this.player.breastRows[temp].breastRating = this.player.breastRows[0].breastRating - 1;
                        if (this.player.breastRows[0].breastRating - 1 === 0) this.outputText("\n\nA second set of breasts forms under your current pair, stopping while they are still fairly flat and masculine looking.");
                        else this.outputText("\n\nA second set of breasts bulges forth under your current pair, stopping as they reach " + this.player.breastCup(temp) + "s.");
                        this.outputText(" A sensitive nub grows on the summit of each new tit, becoming a new nipple.");
                        this.dynStats("sen", 2, "lus", 5);
                        this.changes++;
                    }
                    // Many breast Rows - requires larger primary tits
                    if (this.player.breastRows.length > 2 && this.player.breastRows[0].breastRating > this.player.breastRows.length && this.changes < this.changeLimit) {
                        this.dynStats("sen", 2, "lus", 5);
                        // New row's size = the size of the row above -1
                        this.player.breastRows[temp].breastRating = this.player.breastRows[temp - 1].breastRating - 1;
                        // If second row are super small but primary row is huge it could go negative.
                        // This corrects that problem.
                        if (this.player.breastRows[temp].breastRating < 0) this.player.breastRows[temp].breastRating = 0;
                        if (this.player.breastRows[temp - 1].breastRating < 0) this.player.breastRows[temp - 1].breastRating = 0;
                        if (this.player.breastRows[temp].breastRating === 0) this.outputText("\n\nYour abdomen tingles and twitches as a new row of breasts sprouts below the others. Your new breasts stay flat and masculine, not growing any larger.");
                        else this.outputText("\n\nYour abdomen tingles and twitches as a new row of " + this.player.breastCup(temp) + " " + this.player.breastDescript(temp) + " sprouts below your others.");
                        this.outputText(" A sensitive nub grows on the summit of each new tit, becoming a new nipple.");
                        this.changes++;
                    }
                    // Extra sensitive if crit
                    if (crit > 1) {
                        if (crit > 2) {
                            this.outputText(" You heft your new chest experimentally, exploring the new flesh with tender touches. Your eyes nearly roll back in your head from the intense feelings.");
                            this.dynStats("sen", 8, "lus", 15);
                        } else {
                            this.outputText(" You touch your new nipples with a mixture of awe and desire, the experience arousing beyond measure. You squeal in delight, nearly orgasming, but in time finding the willpower to stop yourself.");
                            this.dynStats("sen", 4, "lus", 10);
                        }
                    }

                }
                // If already has max breasts
                else if (rand(2) === 0) {
                    // Check for size mismatches, and move closer to spec
                    temp = this.player.breastRows.length;
                    temp2 = 0;
                    let evened: boolean = false;
                    // Check each row, and if the row above or below it is
                    while (temp > 1 && temp2 === 0) {
                        temp--;
                        if (this.player.breastRows[temp].breastRating + 1 < this.player.breastRows[temp - 1].breastRating) {
                            if (!evened) {
                                evened = true;
                                this.outputText("\n");
                            }
                            this.outputText("\nYour ");
                            if (temp === 0) this.outputText("first ");
                            if (temp === 1) this.outputText("second ");
                            if (temp === 2) this.outputText("third ");
                            if (temp === 3) this.outputText("fourth ");
                            if (temp > 3) this.outputText("");
                            this.outputText("row of " + this.player.breastDescript(temp) + " grows larger, as if jealous of the jiggling flesh above.");
                            temp2 = (this.player.breastRows[temp - 1].breastRating) - this.player.breastRows[temp].breastRating - 1;
                            if (temp2 > 4) temp2 = 4;
                            if (temp2 < 1) temp2 = 1;
                            this.player.breastRows[temp].breastRating += temp2;
                        }
                    }
                }
            }
        }
        // Remove breast rows if over 4
        if (this.changes < this.changeLimit && this.player.bRows() > 4 && rand(3) === 0) {
            this.mutations.removeExtraBreastRow(tfSource);
        }
        // Grow breasts if has vagina and has no breasts/nips
        else if (this.player.hasVagina() && this.player.bRows() === 0 && this.player.breastRows[0].breastRating === 0 && this.player.nippleLength === 0 && rand(2) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYour chest tingles uncomfortably as your center of balance shifts. <b>You now have a pair of D-cup breasts.</b>");
            this.outputText(" A sensitive nub grows on the summit of each tit, becoming a new nipple.");
            this.player.createBreastRow();
            this.player.breastRows[0].breastRating = 4;
            this.player.breastRows[0].breasts = 2;
            this.player.nippleLength = 0.25;
            this.dynStats("sen", 4, "lus", 6);
            this.changes++;
        }
        // Shrink breasts if over D-cup
        if (this.changes < this.changeLimit && rand(3) === 0 && !this.flags[kFLAGS.HYPER_HAPPY]) {
            temp2 = 0;
            temp3 = 0;
            // Determine if shrinking is required
            if (this.player.biggestTitSize() > 4) temp2 = 4;
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
                            else this.outputText(" The change moves down to your " + WolfPepper.num2Text2(k + 1) + " row of " + this.player.breastDescript(0) + ". They shrink greatly, losing a couple cup-sizes.");
                        }
                        // Small change
                        else {
                            this.player.breastRows[k].breastRating -= 1;
                            if (temp3 === 0) this.outputText("\n\nAll at once, your sense of gravity shifts. Your back feels a sense of relief, and it takes you a moment to realize your " + this.player.breastDescript(k) + " have shrunk!");
                            else this.outputText(" Your " + WolfPepper.num2Text2(k + 1) + " row of " + this.player.breastDescript(k) + " gives a tiny jiggle as it shrinks, losing some off its mass.");
                        }
                        // Increment changed rows
                        temp3++;
                    }
                }
            }
            // Count shrinking
            if (temp3 > 0) this.changes++;
        }
        // MUTATIONZ LEVEL 1: fur, stop hair growth, ears, tail
        // Gain fur
        if (rand(5) === 0 && this.changes < this.changeLimit && !this.player.hasFur()) {
            const wolfFurColors: any[] = [
                "white",
                "gray",
                "dark gray",
                "light gray",
                "black",
                "light brown",
                "sandy brown",
                "golden",
                "silver",
                "brown",
                "auburn",
                ["black", "gray"],
                ["black", "brown"],
                ["black", "silver"],
                ["black", "auburn"],
                ["white", "gray"],
                ["white", "silver"],
                ["white", "golden"],
            ];
            this.outputText("\n\nYour " + this.player.skin.desc + " begins to tingle, then itch. ");
            this.player.skin.type = Skin.FUR;
            this.player.skin.desc = "fur";
            this.player.setFurColor(wolfFurColors, {
                type: UnderBody.FURRY
            }, true);
            this.outputText("You reach down to scratch your arm absent-mindedly and pull your fingers away to find strands of " + this.player.skin.furColor + " fur. You stare at it. Fur. Wait, you just grew fur?! What happened?! Your mind reeling, you do know one thing for sure: <b>you now have fur!</b>");
            this.changes++;
        }
        // Ears time
        if (rand(3) === 0 && this.player.ears.type !== Ears.WOLF && this.changes < this.changeLimit) {
            if (this.player.ears.type === -1) this.outputText("\n\nTwo painful nubs begin sprouting from your head, growing and opening into canine ears. ");
            if (this.player.ears.type === Ears.HUMAN) this.outputText("\n\nThe skin on the sides of your face stretches painfully as your ears migrate upwards, towards the top of your head. They shift and elongate, becoming canine in nature. ");
            if (this.player.ears.type === Ears.HORSE) this.outputText("\n\nYour equine ears twist as they transform into canine versions. ");
            if (this.player.ears.type === Ears.DOG) this.outputText("\n\nYour dog ears widen out, curving and becoming more aware of your surroundings. ");
            if (this.player.ears.type > Ears.WOLF) this.outputText("\n\nYour ears transform, becoming more canine in appearance. ");
            this.player.ears.type = Ears.WOLF;
            this.player.ears.value = 2;
            this.outputText("<b>You now have wolf ears.</b>");
            this.changes++;
        }
        // Wolf tail
        if (rand(3) === 0 && this.changes < this.changeLimit && this.player.tail.type !== Tail.WOLF) {
            if (this.player.tail.type === Tail.NONE) this.outputText("\n\nA pressure builds on your backside. You feel under your clothes and discover an odd, thick bump that seems to be growing larger by the moment. In seconds it passes between your fingers, bursts out the back of your clothes, and grows most of the way to the ground. A nushy coat of fur springs up to cover your new tail.  ");
            if (this.player.tail.type === Tail.HORSE) this.outputText("\n\nYou feel a tightness in your rump, matched by the tightness with which the strands of your tail clump together. In seconds they fuse into a single, thick tail, rapidly sprouting bushy fur. ");
            if (this.player.tail.type === Tail.DEMONIC) this.outputText("\n\nThe tip of your tail feels strange. As you pull it around to check on it, the spaded tip disappears, quickly replaced by a bushy coat of fur over the entire surface of your tail. Your tail thickens with it. ");
            if (this.player.tail.type >= Tail.COW) this.outputText("\n\nYou feel your backside shift and change, flesh molding and displacing into a thick, bushy tail. ");
            this.changes++;
            this.player.tail.type = Tail.WOLF;
            this.outputText("<b>You now have a wolf tail!</b>");
        }
        // Sets hair normal
        if (this.player.hair.type !== Hair.NORMAL && this.changes < this.changeLimit && rand(3) === 0) {
            this.outputText("\n\nYou reach up and feel the top of your head as it begins to tingle. You put a hand on the top of your head and slowly pull it down. Chunks of your " + this.player.hairDescript() + " come with, replaced by a set of normal, human hair.");
            this.player.hair.type = Hair.NORMAL;
            this.changes++;
        }
        // MUTATIONZ LEVEL 2: fur->arms fur+tail+ears->face stophair->nohair fur+tail->legs
        // gain wolf face
        if (this.player.face.type !== Face.WOLF && this.player.ears.type === Ears.WOLF && this.player.tail.type === Tail.WOLF && this.player.hasFur() && rand(5) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou screech in pain as the bones of your face begin to rearrange themselves. Your [skinFurScales] practically melts off you, dropping onto the ground with heavy streams of blood. You put your hands to your face, writhing, blackness covering your vision as pain overwhelms you. But as quickly as it came, it stops, and you pull your shaking hands from your face. You scramble to the nearest reflective surface. <b>You have a wolf's face!</b>");
            this.player.face.type = Face.WOLF;
            this.changes++;
        }
        // legz
        if (this.player.lowerBody.legCount === 2 && this.player.lowerBody.type !== LowerBody.WOLF && this.player.tail.type === Tail.WOLF && this.player.skin.type === Skin.FUR && rand(4) === 0 && this.changes < this.changeLimit) {
            // Hooman feets
            if (this.player.lowerBody.type === LowerBody.HUMAN) this.outputText("\n\nYou stumble and fall, howling in pain as your legs and feet break apart and reform into wolf-like legs and paws. The worst of the pain eventually passes, but you're still left whimpering for a while. <b>You now have paws!</b>");
            // Hooves -> Paws
            else if (this.player.lowerBody.type === LowerBody.HOOFED) this.outputText("\n\nYou feel your hooves suddenly splinter, growing into five unique digits. Their flesh softens as your hooves reshape into furred paws. <b>You now have paws!</b>");
            else this.outputText("\n\nYour lower body is suddenly wracked by pain, causing you to collapse onto the ground in agony. Once it passes, you discover that you're standing on fur-covered paws. <b>You now have paws!</b>");
            this.player.lowerBody.type = LowerBody.WOLF;
            this.changes++;
        }
        // MUTATIONZ LEVEL 3: face->eyes
        if (this.player.eyes.type !== Eyes.WOLF && this.player.face.type === Face.WOLF && rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou feel a sudden surge of pain in your face as your eyes begin to change. You close them and feel something wet slide under your eyelids. You jump in surprise. The feeling's gone, but now the distance is a blurred view, and greens seem to be mixed with yellows.");
            this.outputText("\n\nYou turn to a nearby reflective surface to investigate. Your eyes have massive amber irises and are dipped into your face, hiding any sign of your sclera. Blackness surrounds them and emphasise the wolfish shape of your face. You blink a few times as you stare at your reflection. <b>You now have wolf eyes!</b> Your peripherals and night vision has probably improved, too.");
            this.player.eyes.type = Eyes.WOLF;
            this.changes++;
        }
        // MISC CRAP
        // Neck restore
        if (this.player.neck.type != Neck.NORMAL && this.changes < this.changeLimit && rand(4) == 0) this.mutations.restoreNeck(tfSource);
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && rand(5) == 0) this.mutations.restoreRearBody(tfSource);
        // Ovi perk loss
        if (rand(5) === 0) {
            this.mutations.updateOvipositionPerk(tfSource);
        }
        if (rand(3) === 0) {
            this.outputText(this.player.modTone(100, 4));
        }
        if (rand(3) === 0) {
            this.outputText(this.player.modThickness(75, 3));
        }
        this.player.refillHunger(10);
        this.game.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;
        return false;
    }
}
