import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { CockTypesEnum } from "../../CockTypesEnum";
import { Appearance } from "../../Appearance";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { Neck } from "../../BodyParts/Neck";
import { Tail } from "../../BodyParts/Tail";
import { LowerBody } from "../../BodyParts/LowerBody";
import { Arms } from "../../BodyParts/Arms";
import { Claws } from "../../BodyParts/Claws";
import { Eyes } from "../../BodyParts/Eyes";
import { Face } from "../../BodyParts/Face";
import { Ears } from "../../BodyParts/Ears";
import { ColorLists } from "../../lists/ColorLists";
import { Skin } from "../../BodyParts/Skin";

/**
 * Salamander transformative item.
 */
export class Salamanderfirewater extends Consumable {
    public constructor() {
        super("SalamFW", "SalamFW", "a hip flask of Salamander Firewater", ConsumableLib.DEFAULT_VALUE, "This hip flask contains high-proof beverage called 'Salamander Firewater', which one sip can make your throat feel like it been set on fire.  What would happen if you drink the contents of the whole flask?");
    }

    public useItem(): boolean {
        const tfSource: string = "salamanderfirewater";
        this.player.slimeFeed();
        // init variables
        let temp2: number = 0;
        this.mutations.initTransformation([2, 3, 4]);
        // clear screen
        this.clearOutput();
        this.outputText("You uncork the hip flask and drink it down.  The taste is actually quite good, like an alcohol but with a little fire within.  Just as you expected, it makes you feel all hot and ready to take whole world head on.");

        // Statistical changes:
        // -Reduces speed down to 70.
        if (this.player.spe100 > 70 && this.changes < this.changeLimit && Salamanderfirewater.rand(4) === 0) {
            this.outputText("\n\nYou start to feel sluggish.  Lying down and enjoying liquor might make you feel better.");
            this.dynStats("spe", -1);
        }
        // -Reduces intelligence down to 60.
        if (this.player.inte100 > 60 && this.changes < this.changeLimit && Salamanderfirewater.rand(4) === 0) {
            this.outputText("\n\nYou start to feel a bit dizzy, but the sensation quickly passes.  Thinking hard on it, you mentally brush away the fuzziness that seems to permeate your brain and determine that this firewater may have actually made you dumber.  It would be best not to drink too much of it.");
            this.dynStats("int", -1);
        }
        // -Raises libido up to 90.
        if (this.player.lib100 < 90 && this.changes < this.changeLimit && Salamanderfirewater.rand(3) === 0) {
            this.outputText("\n\nA knot of fire in your gut doubles you over but passes after a few moments.  As you straighten you can feel the heat seeping into you, ");
            // (DICK)
            if (this.player.cocks.length > 0 && (this.player.gender !== 3 || Salamanderfirewater.rand(2) === 0)) {
                this.outputText("filling ");
                if (this.player.cocks.length > 1) this.outputText("each of ");
                this.outputText("your " + this.player.multiCockDescriptLight() + " with the desire to breed.  You get a bit hornier when you realize your sex-drive has gotten a boost.");
            }
            // (COOCH)
            else if (this.player.hasVagina()) this.outputText("puddling in your " + this.player.vaginaDescript(0) + ".  An instinctive desire to mate spreads through you, increasing your lust and boosting your sex-drive.");
            // (TARDS)
            else this.outputText("puddling in your featureless crotch for a split-second before it slides into your " + this.player.assDescript() + ".  You want to be fucked, filled, and perhaps even gain a proper gender again.  Through the lust you realize your sex-drive has been permanently increased.");
            this.dynStats("lib", 2);
        }
        // -Raises toughness up to 90.
        // (+3 to 50, +2 to 70, +1 to 90)
        if (this.player.tou100 < 90 && this.changes < this.changeLimit && Salamanderfirewater.rand(3) === 0) {
            // (+3)
            if (this.player.tou100 < 50) {
                this.outputText("\n\nYour body and skin both thicken noticeably.  You pinch your " + this.player.skin.desc + " experimentally and marvel at how much tougher it is now.");
                this.dynStats("tou", 3);
            }
            // (+2)
            else if (this.player.tou100 < 70) {
                this.outputText("\n\nYou grin as you feel your form getting a little more solid.  It seems like your whole body is toughening up quite nicely, and by the time the sensation goes away, you feel ready to take a hit.");
                this.dynStats("tou", 2);
            }
            // (+1)
            else {
                this.outputText("\n\nYou snarl happily as you feel yourself getting even tougher.  It's a barely discernible difference, but you can feel your " + this.player.skin.desc + " getting tough enough to make you feel invincible.");
                this.dynStats("tou", 1);
            }
        }
        // -Raises strength to 80.
        if (this.player.str100 < 80 && Salamanderfirewater.rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nWhile heat builds in your muscles, their already-potent mass shifting slightly as they gain even more strength than before.");
            this.dynStats("str", 1);
        }
        // Sexual Changes:
        // -Lizard dick - first one
        if (this.player.countCocksOfType(CockTypesEnum.LIZARD) === 0 && this.player.cockTotal() > 0 && this.changes < this.changeLimit && Salamanderfirewater.rand(4) === 0) {
            // Find the first non-lizzy dick
            for (temp2 = 0; temp2 < this.player.cocks.length; temp2++) {
                // Stop loopahn when dick be found
                if (this.player.cocks[temp2].cockType !== CockTypesEnum.LIZARD) break;
            }
            this.outputText("\n\nA slow tingle warms your groin.  Before it can progress any further, you yank back your " + this.player.armorName + " to investigate.  Your " + this.player.cockDescript(temp2) + " is changing!  It ripples loosely from ");
            if (this.player.hasSheath()) this.outputText("sheath ");
            else this.outputText("base ");
            this.outputText("to tip, undulating and convulsing as its color lightens, darkens, and finally settles on a purplish hue.  Your " + Appearance.cockNoun(CockTypesEnum.HUMAN) + " resolves itself into a bulbous form, with a slightly pointed tip.  The 'bulbs' throughout its shape look like they would provide an interesting ride for your sexual partners, but the perverse, alien pecker ");
            if (this.player.cor < 33) this.outputText("horrifies you.");
            else if (this.player.cor < 66) this.outputText("is a little strange for your tastes.");
            else {
                this.outputText("looks like it might be more fun to receive than use on others.  ");
                if (this.player.hasVagina()) this.outputText("Maybe you could find someone else with one to ride?");
                else this.outputText("Maybe you should test it out on someone and ask them exactly how it feels?");
            }
            this.outputText("  <b>You now have a bulbous, lizard-like cock.</b>");
            // Actually xform it nau
            if (this.player.hasSheath()) {
                this.player.cocks[temp2].cockType = CockTypesEnum.LIZARD;
                if (!this.player.hasSheath()) this.outputText("\n\nYour sheath tightens and starts to smooth out, revealing ever greater amounts of your " + this.player.cockDescript(temp2) + "'s lower portions.  After a few moments <b>your groin is no longer so animalistic – the sheath is gone.</b>");
            }
            else this.player.cocks[temp2].cockType = CockTypesEnum.LIZARD;
            this.changes++;
            this.dynStats("lib", 3, "lus", 10);
        }
        // (CHANGE OTHER DICK)
        // Requires 1 lizard cock, multiple cocks
        if (this.player.cockTotal() > 1 && this.player.countCocksOfType(CockTypesEnum.LIZARD) > 0 && this.player.cockTotal() > this.player.countCocksOfType(CockTypesEnum.LIZARD) && Salamanderfirewater.rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nA familiar tingle starts in your crotch, and before you can miss the show, you pull open your " + this.player.armorName + ".  As if operating on a cue, ");
            for (temp2 = 0; temp2 < this.player.cocks.length; temp2++) {
                // Stop loopahn when dick be found
                if (this.player.cocks[temp2].cockType !== CockTypesEnum.LIZARD) break;
            }
            if (this.player.cockTotal() === 2) this.outputText("your other dick");
            else this.outputText("another one of your dicks");
            this.outputText(" starts to change into the strange reptilian shape you've grown familiar with.  It warps visibly, trembling and radiating pleasurable feelings back to you as the transformation progresses.  ");
            if (this.player.cumQ() < 50) this.outputText("pre-cum oozes from the tip");
            else if (this.player.cumQ() < 700) this.outputText("Thick pre-cum rains from the tip");
            else this.outputText("A wave of pre-cum splatters on the ground");
            this.outputText(" from the pleasure of the change.  In moments <b>you have a bulbous, lizard-like cock.</b>");
            // (REMOVE SHEATH IF NECESSARY)
            if (this.player.hasSheath()) {
                this.player.cocks[temp2].cockType = CockTypesEnum.LIZARD;
                if (!this.player.hasSheath()) this.outputText("\n\nYour sheath tightens and starts to smooth out, revealing ever greater amounts of your " + this.player.cockDescript(temp2) + "'s lower portions.  After a few moments <b>your groin is no longer so animalistic – the sheath is gone.</b>");
            }
            else this.player.cocks[temp2].cockType = CockTypesEnum.LIZARD;
            this.changes++;
            this.dynStats("lib", 3, "lus", 10);
        }
        // -Breasts vanish to 0 rating if male
        if (this.player.biggestTitSize() >= 1 && this.player.gender === 1 && this.changes < this.changeLimit && Salamanderfirewater.rand(3) === 0) {
            // (HUEG)
            if (this.player.biggestTitSize() > 8) {
                this.outputText("\n\nThe flesh on your chest tightens up, losing nearly half its mass in the span of a few seconds.  With your center of balance shifted so suddenly, you stagger about trying not to fall on your ass.  You catch yourself and marvel at the massive change in breast size.");
                // Half tit size
            }
            // (NOT HUEG < 4)
            else this.outputText("\n\nIn an instant, your chest compacts in on itself, consuming every ounce of breast-flesh.  You're left with a  smooth, masculine torso, though your nipples remain.");
            // (BOTH – no new PG)
            this.outputText("  With the change in weight and gravity, you find it's gotten much easier to move about.");
            // Loop through behind the scenes and adjust all tits.
            for (temp2 = 0; temp2 < this.player.breastRows.length; temp2++) {
                if (this.player.breastRows[temp2].breastRating > 8) this.player.breastRows[temp2].breastRating /= 2;
                else this.player.breastRows[temp2].breastRating = 0;
            }
            // (+2 speed)
            this.dynStats("lib", 2);
            this.changes++;
        }
        // -Nipples reduction to 1 per tit.
        if (this.player.averageNipplesPerBreast() > 1 && this.changes < this.changeLimit && Salamanderfirewater.rand(4) === 0) {
            this.outputText("\n\nA chill runs over your " + this.player.allBreastsDescript() + " and vanishes.  You stick a hand under your " + this.player.armorName + " and discover that your extra nipples are missing!  You're down to just one per ");
            if (this.player.biggestTitSize() < 1) this.outputText("'breast'.");
            else this.outputText("breast.");
            this.changes++;
            // Loop through and reset nipples
            for (temp2 = 0; temp2 < this.player.breastRows.length; temp2++) {
                this.player.breastRows[temp2].nipplesPerBreast = 1;
            }
        }
        // Increase player's breast size, if they are big DD or smaller
        if (this.player.smallestTitSize() < 6 && this.player.gender === 2 && this.changes < this.changeLimit && Salamanderfirewater.rand(4) === 0) {
            this.outputText("\n\nAfter eating it, your chest aches and tingles, and your hands reach up to scratch at it unthinkingly.  Silently, you hope that you aren't allergic to it.  Just as you start to scratch at your " + this.player.breastDescript(this.player.smallestTitRow()) + ", your chest pushes out in slight but sudden growth.");
            this.player.breastRows[this.player.smallestTitRow()].breastRating++;
            this.changes++;
        }
        // -Remove extra breast rows
        if (this.changes < this.changeLimit && this.player.breastRows.length > 1 && Salamanderfirewater.rand(3) == 0 && !this.flags[kFLAGS.HYPER_HAPPY]) {
            this.mutations.removeExtraBreastRow(tfSource);
        }
        // Neck restore
        if (this.player.neck.type != Neck.NORMAL && this.changes < this.changeLimit && Salamanderfirewater.rand(4) === 0) {
            this.mutations.restoreNeck(tfSource);
        }
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && Salamanderfirewater.rand(5) == 0) {
            this.mutations.restoreRearBody(tfSource);
        }
        // Ovi perk loss
        if (Salamanderfirewater.rand(5) === 0) {
            this.mutations.updateOvipositionPerk(tfSource);
        }
        // Physical changes:
        // Tail - 1st gain reptilian tail, 2nd unlocks enhanced with fire tail whip attack
        if (this.player.tail.type !== Tail.LIZARD && this.player.tail.type !== Tail.SALAMANDER && this.changes < this.changeLimit && Salamanderfirewater.rand(3) === 0) {
            // No tail
            if (this.player.tail.type === Tail.NONE) this.outputText("\n\nYou drop onto the ground as your spine twists and grows, forcing the flesh above your " + this.player.assDescript() + " to bulge out.  New bones form, one after another, building a tapered, prehensile tail onto the back of your body.  <b>You now have a reptilian tail!</b>");
            // Yes tail
            else this.outputText("\n\nYou drop to the ground as your tail twists and grows, changing its shape in order to gradually taper to a point.  It flicks back and forth, prehensile and totally under your control.  <b>You now have a reptilian tail.</b>");
            this.player.tail.type = Tail.LIZARD;
            this.changes++;
        }
        if (this.player.tail.type === Tail.LIZARD && this.changes < this.changeLimit && Salamanderfirewater.rand(3) === 0) {
            this.outputText("\n\nYou feel a strange heating sensation in your tail and when you grab your own tail, you can see that it retains the same shape though the color changes to red. It becomes hotter to the touch and you let go of your tail before it gets too hot. For a brief moment it tip ignite with a red-colored flame that with as little as your merely thought vanish moment later.  Still you somehow know you can set ablaze any part or whole your tail at any moment and even use it to burn enemies after lashing them with your tail.  <b>You now have a salamander tail!</b>");
            this.player.tail.type = Tail.SALAMANDER;
            this.changes++;
        }
        // Legs
        if (this.player.lowerBody.type !== LowerBody.SALAMANDER && this.player.tail.type === Tail.SALAMANDER && this.changes < this.changeLimit && Salamanderfirewater.rand(3) === 0) {
            // Hooves -
            if (this.player.lowerBody.type === LowerBody.HOOFED) this.outputText("\n\nYou scream in agony as you feel your hooves crack and break apart, beginning to rearrange.  Your legs change to a digitigrade shape while your feet grow claws and shift to have three toes on the front and a smaller toe on the heel.");
            // TAURS -
            else if (this.player.isTaur()) this.outputText("\n\nYour lower body is wracked by pain!  Once it passes, you discover that you're standing on digitigrade legs with salamander-like claws.");
            // feet types -
            else if (this.player.lowerBody.type === LowerBody.HUMAN || this.player.lowerBody.type === LowerBody.DOG || this.player.lowerBody.type === LowerBody.DEMONIC_HIGH_HEELS || this.player.lowerBody.type === LowerBody.DEMONIC_CLAWS || this.player.lowerBody.type === LowerBody.BEE || this.player.lowerBody.type === LowerBody.CAT || this.player.lowerBody.type === LowerBody.LIZARD) this.outputText("\n\nYou scream in agony as you feel the bones in your legs break and begin to rearrange. They change to a digitigrade shape while your feet grow claws and shift to have three toes on the front and a smaller toe on the heel.");
            // Else –
            else this.outputText("\n\nPain rips through your " + this.player.legs() + ", morphing and twisting them until the bones rearrange into a digitigrade configuration.  The strange legs have three-toed, clawed feet, complete with a small vestigial claw-toe on the back for added grip.");
            this.outputText("  <b>You have salamander legs and claws!</b>");
            this.player.lowerBody.type = LowerBody.SALAMANDER;
            this.player.lowerBody.legCount = 2;
            this.changes++;
        }
        // Arms
        if (this.player.arms.type !== Arms.SALAMANDER && this.player.lowerBody.type === LowerBody.SALAMANDER && this.changes < this.changeLimit && Salamanderfirewater.rand(3) === 0) {
            this.outputText("\n\nYou scratch your biceps absentmindedly, but no matter how much you scratch, you can't get rid of the itch.  After a longer moment of ignoring it you finally glance down in irritation, only to discover that your arms former appearance has changed into those of a salamander with leathery, red scales and short, fiery-red claws replacing your fingernails.  <b>You now have salamander arms.</b>");
            this.player.arms.setType(Arms.SALAMANDER, Claws.SALAMANDER);
            this.changes++;
        }
        // Remove odd eyes
        if (this.changes < this.changeLimit && Salamanderfirewater.rand(4) === 0 && this.player.eyes.type > Eyes.HUMAN) {
            if (this.player.eyes.type === Eyes.BLACK_EYES_SAND_TRAP) {
                this.outputText("\n\nYou feel a twinge in your eyes and you blink.  It feels like black cataracts have just fallen away from you, and you know without needing to see your reflection that your eyes have gone back to looking human.");
            }
            else {
                this.outputText("\n\nYou blink and stumble, a wave of vertigo threatening to pull your " + this.player.feet() + " from under you.  As you steady and open your eyes, you realize something seems different.  Your vision is changed somehow.");
                if (this.player.eyes.type === Eyes.FOUR_SPIDER_EYES || this.player.eyes.type === Eyes.SPIDER) this.outputText(" <b>Your arachnid eyes are gone!</b>");
                this.outputText(" <b>You have normal, humanoid eyes again.</b>");
            }
            this.player.eyes.type = Eyes.HUMAN;
            this.player.eyes.count = 2;
            this.changes++;
        }
        // Human face
        if (this.player.face.type !== Face.HUMAN && this.changes < this.changeLimit && Salamanderfirewater.rand(4) === 0) {
            this.outputText("\n\nSudden agony sweeps over your " + this.player.faceDescript() + ", your visage turning hideous as bones twist and your jawline shifts. The pain slowly vanishes, leaving you weeping into your fingers. When you pull your hands away you realize you've been left with a completely normal, human face.");
            this.player.face.type = Face.HUMAN;
            this.changes++;
        }
        // Human ears
        if (this.player.face.type === Face.HUMAN && this.player.ears.type !== Ears.HUMAN && this.changes < this.changeLimit && Salamanderfirewater.rand(4) === 0) {
            this.outputText("\n\nOuch, your head aches! It feels like your ears are being yanked out of your head, and when you reach up to hold your aching noggin, you find they've vanished! Swooning and wobbling with little sense of balance, you nearly fall a half-dozen times before <b>a pair of normal, human ears sprout from the sides of your head.</b> You had almost forgotten what human ears felt like!");
            this.player.ears.type = Ears.HUMAN;
            this.changes++;
        }
        // -Skin color change
        if (ColorLists.SALAMANDER_SKIN.indexOf(this.player.skin.tone) < 0 && this.changes < this.changeLimit && Salamanderfirewater.rand(4) === 0) {
            this.changes++;
            this.outputText("\n\nIt takes a while for you to notice, but <b>");
            if (this.player.hasFur()) this.outputText("the skin under your " + this.player.skin.furColor + " " + this.player.skin.desc + " has ");
            else this.outputText("your " + this.player.skin.desc + (this.player.skin.desc.indexOf("scales") !== -1 ? " have " : " has "));
            this.player.skin.tone = Salamanderfirewater.randomChoice(ColorLists.SALAMANDER_SKIN);
            this.player.arms.updateClaws(this.player.arms.claws.type);
            this.outputText("changed to become " + this.player.skin.tone + " colored.</b>");
        }
        // Change skin to normal
        if (!this.player.hasPlainSkin() && this.player.ears.type === Ears.HUMAN && Salamanderfirewater.rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nA slowly-building itch spreads over your whole body, and as you idly scratch yourself, you find that your " + this.player.skinFurScales());
            this.outputText(" " + (this.player.hasScales() ? "are" : "is") + " falling to the ground, revealing flawless skin below.  <b>You now have normal skin.</b>");
            this.player.skin.type = Skin.PLAIN;
            this.player.skin.desc = "skin";
            this.player.skin.adj = "";
            this.player.underBody.restore();
            this.changes++;
        }
        // Removing gills
        if (Salamanderfirewater.rand(4) === 0 && this.player.hasGills() && this.changes < this.changeLimit) {
            this.mutations.updateGills();
        }
        // FAILSAFE CHANGE
        if (this.changes === 0) {
            this.outputText("\n\nInhuman vitality spreads through your body, invigorating you!\n");
            this.player.HPChange(100, true);
            this.dynStats("lus", 5);
        }
        this.player.refillHunger(20);
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;

        return false;
    }
}
