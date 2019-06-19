import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";
import { CockTypesEnum } from "../../CockTypesEnum";
import { Appearance } from "../../Appearance";
import { StatusEffects } from "../../StatusEffects";
import { PerkLib } from "../../PerkLib";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { Neck } from "../../BodyParts/Neck";
import { LowerBody } from "../../BodyParts/LowerBody";
import { Arms } from "../../BodyParts/Arms";
import { Claws } from "../../BodyParts/Claws";
import { Tail } from "../../BodyParts/Tail";
import { Eyes } from "../../BodyParts/Eyes";
import { Ears } from "../../BodyParts/Ears";
import { Skin } from "../../BodyParts/Skin";
import { UnderBody } from "../../BodyParts/UnderBody";
import { Face } from "../../BodyParts/Face";
import { Tongue } from "../../BodyParts/Tongue";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

/**
 * Reptile transformativ item.
 */
export class Reptilum extends Consumable {
    public constructor() {
        super("Reptlum", "Reptilum", "a vial of Reptilum", ConsumableLib.DEFAULT_VALUE, "This is a rounded bottle with a small label that reads, \"<i>Reptilum</i>\".  It is likely this potion is tied to reptiles in some way.");
    }

    public useItem(): boolean {
        let tfSource: string = "reptilum";
        if (this.player.hasDragonWingsAndFire())
            tfSource += this.player.isBasilisk() ? "-dracolisk" : "-dragonewt";
        else
            tfSource += this.player.isBasilisk() ? "-basilisk" : "-lizan";
        // if (player.isTaur()) tfSource += "-taur";
        this.player.slimeFeed();
        // init variables
        let temp2: number = 0;
        this.mutations.initTransformation([2, 2, 3, 4]);
        // clear screen
        this.clearOutput();
        this.outputText("You uncork the vial of fluid and drink it down.  The taste is sour, like a dry wine with an aftertaste not entirely dissimilar to alcohol.  Instead of the warmth you'd expect, it leaves your throat feeling cold and a little numb.");

        // Statistical changes:
        // -Reduces speed down to 50.
        if (this.player.spe > this.player.ngPlus(50) && this.changes < this.changeLimit && rand(4) === 0) {
            this.outputText("\n\nYou start to feel sluggish and cold.  Lying down to bask in the sun might make you feel better.");
            this.dynStats("spe", -1);
        }
        // -Reduces sensitivity.
        if (this.player.sens100 > 20 && this.changes < this.changeLimit && rand(3) === 0) {
            this.outputText("\n\nThe sensation of prickly pins and needles moves over your body, leaving your senses a little dulled in its wake.");
            this.dynStats("sen", -1);
        }
        // Raises libido greatly to 50, then somewhat to 75, then slowly to 100.
        if (this.player.lib100 < 100 && this.changes < this.changeLimit && rand(3) === 0) {
            this.outputText("\n\nA knot of fire in your gut doubles you over but passes after a few moments.  As you straighten you can feel the heat seeping into you, ");
            // (DICK)
            if (this.player.cocks.length > 0 && (this.player.gender !== 3 || rand(2) === 0)) {
                this.outputText("filling ");
                if (this.player.cocks.length > 1) this.outputText("each of ");
                this.outputText("your " + this.player.multiCockDescriptLight() + " with the desire to breed.  You get a bit hornier when you realize your sex-drive has gotten a boost.");
            }
            // (COOCH)
            else if (this.player.hasVagina()) this.outputText("puddling in your " + this.player.vaginaDescript(0) + ".  An instinctive desire to mate and lay eggs spreads through you, increasing your lust and boosting your sex-drive.");
            // (TARDS)
            else this.outputText("puddling in your featureless crotch for a split-second before it slides into your " + this.player.assDescript() + ".  You want to be fucked, filled, and perhaps even gain a proper gender again.  Through the lust you realize your sex-drive has been permanently increased.");
            // +3 lib if less than 50
            if (this.player.lib100 < 50) this.dynStats("lib", 1);
            // +2 lib if less than 75
            if (this.player.lib100 < 75) this.dynStats("lib", 1);
            // +1 if above 75.
            this.dynStats("lib", 1);
        }
        // -Raises toughness to 70
        // (+3 to 40, +2 to 55, +1 to 70)
        if (this.player.tou < this.player.ngPlus(70) && this.changes < this.changeLimit && rand(3) === 0) {
            // (+3)
            if (this.player.tou < this.player.ngPlus(40)) {
                this.outputText("\n\nYour body and skin both thicken noticeably.  You pinch your " + this.player.skin.desc + " experimentally and marvel at how much tougher your hide has gotten.");
                this.dynStats("tou", 3);
            }
            // (+2)
            else if (this.player.tou < this.player.ngPlus(55)) {
                this.outputText("\n\nYou grin as you feel your form getting a little more solid.  It seems like your whole body is toughening up quite nicely, and by the time the sensation goes away, you feel ready to take a hit.");
                this.dynStats("tou", 2);
            }
            // (+1)
            else {
                this.outputText("\n\nYou snarl happily as you feel yourself getting even tougher.  It's a barely discernible difference, but you can feel your " + this.player.skin.desc + " getting tough enough to make you feel invincible.");
                this.dynStats("tou", 1);
            }
        }

        // Sexual Changes:
        // -Lizard dick - first one
        if (this.player.countCocksOfType(CockTypesEnum.LIZARD) === 0 && this.player.cockTotal() > 0 && this.changes < this.changeLimit && this.tfChance(2, 4)) {
            // Find the first non-lizzy dick
            temp2 = this.player.findFirstCockNotOfType(CockTypesEnum.LIZARD);
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
        if (this.player.cockTotal() > 1 && this.player.countCocksOfType(CockTypesEnum.LIZARD) > 0 && this.player.hasCockNotOfType(CockTypesEnum.LIZARD) && this.tfChance(2, 4) && this.changes < this.changeLimit) {
            this.outputText("\n\nA familiar tingle starts in your crotch, and before you can miss the show, you pull open your " + this.player.armorName + ".  As if operating on a cue, ");
            temp2 = this.player.findFirstCockNotOfType(CockTypesEnum.LIZARD);
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
        // -Grows second lizard dick if only 1 dick
        if (this.player.countCocksOfType(CockTypesEnum.LIZARD) === 1 && this.player.cocks.length === 1 && this.tfChance(2, 4) && this.changes < this.changeLimit) {
            this.outputText("\n\nA knot of pressure forms in your groin, forcing you off your " + this.player.feet() + " as you try to endure it.  You examine the affected area and see a lump starting to bulge under your " + this.player.skin.desc + ", adjacent to your " + this.player.cockDescript(0) + ".  The flesh darkens, turning purple");
            if (this.player.isFurryOrScaley())
                this.outputText(" and shedding " + this.player.skin.desc);
            this.outputText(" as the bulge lengthens, pushing out from your body.  Too surprised to react, you can only pant in pain and watch as the fleshy lump starts to take on a penis-like appearance.  <b>You're growing a second lizard-cock!</b>  It doesn't stop growing until it's just as long as its brother and the same shade of shiny purple.  A dribble of cum oozes from its tip, and you feel relief at last.");

            this.player.createCock();
            this.player.cocks[1].cockType = CockTypesEnum.LIZARD;
            this.player.cocks[1].cockLength = this.player.cocks[0].cockLength;
            this.player.cocks[1].cockThickness = this.player.cocks[0].cockThickness;
            this.changes++;
            this.dynStats("lib", 3, "lus", 10);
        }
        // --Worms leave if 100% lizard dicks?
        // Require mammals?
        if (this.player.countCocksOfType(CockTypesEnum.LIZARD) === this.player.cockTotal() && this.changes < this.changeLimit && this.player.hasStatusEffect(StatusEffects.Infested)) {
            this.outputText("\n\nLike rats from a sinking ship, worms escape from your body in a steady stream.  Surprisingly, the sensation is remarkably pleasant, similar to the pleasure of sexual release in a way.  Though they seem inexhaustible, the tiny, cum-slimed invertebrates slow to a trickle.  The larger worm-kin inside you stirs as if disturbed from a nap, coming loose from whatever moorings it had attached itself to in the interior of your form.  It slowly works its way up your urethra, stretching to an almost painful degree with every lurching motion.  Your dick bloats out around the base, stretched like the ovipositor on a bee-girl in order to handle the parasitic creature, but thankfully, the ordeal is a brief one.");
            if (this.player.balls > 1) this.outputText("  The remaining " + Reptilum.num2Text(this.player.balls - 1) + " slither out the pre-stretched holes with ease, though the last one hangs from your tip for a moment before dropping to the ground.");
            this.outputText("  The white creature joins its kin on the ground and slowly slithers away.  Perhaps they prefer mammals? In any event, <b>you are no longer infected with worms</b>.");
            this.player.removeStatusEffect(StatusEffects.Infested);
            this.changes++;
        }
        // -Breasts vanish to 0 rating if male
        if (this.player.biggestTitSize() >= 1 && this.player.gender === 1 && this.changes < this.changeLimit && this.tfChance(2, 3)) {
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
        // -Lactation stoppage.
        if (this.player.biggestLactation() >= 1 && this.changes < this.changeLimit && this.tfChance(2, 4)) {
            if (this.player.totalNipples() === 2) this.outputText("\n\nBoth of your");
            else this.outputText("\n\nAll of your many");
            this.outputText(" nipples relax.  It's a strange feeling, and you pull back your top to touch one.  It feels fine, though there doesn't seem to be any milk leaking out.  You give it a squeeze and marvel when nothing ");
            if (this.player.hasFuckableNipples()) this.outputText("but sexual fluid ");
            this.outputText("escapes it.  <b>You are no longer lactating.</b>  That makes sense, only mammals lactate!  Smiling, you muse at how much time this will save you when cleaning your gear.");
            if (this.player.findPerk(PerkLib.Feeder) >= 0 || this.player.hasStatusEffect(StatusEffects.Feeder)) {
                this.outputText("\n\n(<b>Feeder perk lost!</b>)");
                this.player.removePerk(PerkLib.Feeder);
                this.player.removeStatusEffect(StatusEffects.Feeder);
            }
            this.changes++;
            // Loop through and reset lactation
            for (temp2 = 0; temp2 < this.player.breastRows.length; temp2++) {
                this.player.breastRows[temp2].lactationMultiplier = 0;
            }
        }
        // -Nipples reduction to 1 per tit.
        if (this.player.averageNipplesPerBreast() > 1 && this.changes < this.changeLimit && this.tfChance(2, 4)) {
            this.outputText("\n\nA chill runs over your " + this.player.allBreastsDescript() + " and vanishes.  You stick a hand under your " + this.player.armorName + " and discover that your extra nipples are missing!  You're down to just one per ");
            if (this.player.biggestTitSize() < 1) this.outputText("'breast'.");
            else this.outputText("breast.");
            this.changes++;
            // Loop through and reset nipples
            for (temp2 = 0; temp2 < this.player.breastRows.length; temp2++) {
                this.player.breastRows[temp2].nipplesPerBreast = 1;
            }
        }
        // -Remove extra breast rows
        if (this.changes < this.changeLimit && this.player.breastRows.length > 1 && this.tfChance(2, 3) && !this.flags[kFLAGS.HYPER_HAPPY]) {
            this.mutations.removeExtraBreastRow(tfSource);
        }
        // -VAGs
        if (this.player.hasVagina() && this.tfChance(3, 5) && this.player.lizardScore() > 3) {
            this.mutations.updateOvipositionPerk(tfSource); // does all the magic, nuff said!
        }

        // Physical changes:
        // -Existing horns become draconic, max of 4, max length of 1'
        if (!this.player.hasDragonHorns(true) && this.changes < this.changeLimit && this.tfChance(3, 5)) {
            this.mutations.gainDraconicHorns(tfSource);
        }

        // Neck restore
        if (this.player.neck.type != Neck.NORMAL && this.changes < this.changeLimit && this.tfChance(2, 4)) this.mutations.restoreNeck(tfSource);
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && this.tfChance(3, 5)) this.mutations.restoreRearBody(tfSource);
        // -Hair changes
        if (this.changes < this.changeLimit && this.tfChance(2, 4)) {
            this.mutations.lizardHairChange(tfSource);
        }
        // Remove beard!
        if (this.player.hasBeard() && this.changes < this.changeLimit && this.tfChance(2, 3)) {
            this.outputText("\n\nYour " + this.player.beardDescript() + " feels looser and looser until finally, your beard falls out.  ");
            this.outputText("(<b>You no longer have a beard!</b>)");
            this.player.beard.length = 0;
            this.player.beard.style = 0;
        }
        // Big physical changes:
        // -Legs – Draconic, clawed feet
        if (this.player.lowerBody.type !== LowerBody.LIZARD && this.changes < this.changeLimit && this.tfChance(3, 5)) {
            // Hooves -
            if (this.player.lowerBody.type === LowerBody.HOOFED) this.outputText("\n\nYou scream in agony as you feel your hooves crack and break apart, beginning to rearrange.  Your legs change to a digitigrade shape while your feet grow claws and shift to have three toes on the front and a smaller toe on the heel.");
            // TAURS -
            else if (this.player.isTaur()) this.outputText("\n\nYour lower body is wracked by pain!  Once it passes, you discover that you're standing on digitigrade legs with lizard-like claws.");
            // feet types -
            else if (this.player.lowerBody.type === LowerBody.HUMAN || this.player.lowerBody.type === LowerBody.DOG || this.player.lowerBody.type === LowerBody.DEMONIC_HIGH_HEELS || this.player.lowerBody.type === LowerBody.DEMONIC_CLAWS || this.player.lowerBody.type === LowerBody.BEE || this.player.lowerBody.type === LowerBody.CAT || this.player.lowerBody.type === LowerBody.LIZARD) this.outputText("\n\nYou scream in agony as you feel the bones in your legs break and begin to rearrange. They change to a digitigrade shape while your feet grow claws and shift to have three toes on the front and a smaller toe on the heel.");
            // Else –
            else this.outputText("\n\nPain rips through your " + this.player.legs() + ", morphing and twisting them until the bones rearrange into a digitigrade configuration.  The strange legs have three-toed, clawed feet, complete with a small vestigial claw-toe on the back for added grip.");
            this.outputText("  <b>You have reptilian legs and claws!</b>");
            this.player.lowerBody.type = LowerBody.LIZARD;
            this.player.lowerBody.legCount = 2;
            this.changes++;
        }
        // <mod name="Predator arms" author="Stadler76">
        // Gain predator arms
        if (this.player.arms.type !== Arms.PREDATOR && this.player.hasReptileScales() && this.player.lowerBody.type === LowerBody.LIZARD && this.changes < this.changeLimit && this.tfChance(2, 3)) {
            this.player.arms.setType(Arms.PREDATOR, Claws.LIZARD);
            this.outputText("\n\nYou scratch your biceps absentmindedly, but no matter how much you scratch, you can't get rid of the itch.  After a longer moment of ignoring it you finally glance down in irritation, only to discover that your arms former appearance has changed into those of some reptilian killer with " + this.player.skinFurScales() + " and short " + this.player.arms.claws.tone + " claws replacing your fingernails.");
            this.outputText("\n<b>You now have reptilian arms.</b>");
            this.changes++;
        }
        // Claw transition
        if (this.player.arms.type === Arms.PREDATOR && this.player.hasLizardScales() && this.player.arms.claws.type !== Claws.LIZARD && this.changes < this.changeLimit && this.tfChance(2, 3)) {
            this.outputText("\n\nYour [claws] change a little to become reptilian.");
            this.player.arms.updateClaws(Claws.LIZARD);
            this.outputText(" <b>You now have [claws].</b>");
            this.changes++;
        }
        // </mod>
        // -Tail – sinuous lizard tail
        if (this.player.tail.type !== Tail.LIZARD && this.player.lowerBody.type === LowerBody.LIZARD && this.changes < this.changeLimit && this.tfChance(3, 5)) {
            // No tail
            if (this.player.tail.type === Tail.NONE) this.outputText("\n\nYou drop onto the ground as your spine twists and grows, forcing the flesh above your " + this.player.assDescript() + " to bulge out.  New bones form, one after another, building a tapered, prehensile tail onto the back of your body.  <b>You now have a reptilian tail!</b>");
            // Yes tail
            else this.outputText("\n\nYou drop to the ground as your tail twists and grows, changing its shape in order to gradually taper to a point.  It flicks back and forth, prehensile and totally under your control.  <b>You now have a reptilian tail.</b>");
            this.player.tail.type = Tail.LIZARD;
            this.changes++;
        }
        // Remove odd eyes
        if (this.changes < this.changeLimit && this.tfChance(3, 5) && this.player.eyes.type !== Eyes.HUMAN && !this.player.hasReptileEyes()) {
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
        // -Ears become smaller nub-like openings?
        if (this.player.ears.type !== Ears.LIZARD && this.player.tail.type === Tail.LIZARD && this.player.lowerBody.type === LowerBody.LIZARD && this.changes < this.changeLimit && this.tfChance(3, 5)) {
            this.outputText("\n\nTightness centers on your scalp, pulling your ears down from their normal, fleshy shape into small, scaley bumps with holes in their centers.  <b>You have reptilian ears!</b>");
            this.player.ears.type = Ears.LIZARD;
            this.changes++;
        }
        // -Scales – color changes to red, green, white, blue, or black.  Rarely: purple or silver.
        if (!this.player.hasLizardScales() && this.player.ears.type === Ears.LIZARD && this.player.tail.type === Tail.LIZARD && this.player.lowerBody.type === LowerBody.LIZARD && this.changes < this.changeLimit && this.tfChance(3, 5)) {
            // (fur)
            const newSkinTones: any[] = this.mutations.newLizardSkinTone();
            if (this.player.hasFur()) {
                this.player.skin.tone = newSkinTones[0];
                this.player.arms.updateClaws(this.player.arms.claws.type);
                this.outputText("\n\nYou scratch yourself, and come away with a large clump of " + this.player.skin.furColor + " fur.  Panicked, you look down"
                    + " and realize that your fur is falling out in huge clumps.  It itches like mad, and you scratch your body"
                    + " relentlessly, shedding the remaining fur with alarming speed.  Underneath the fur your skin feels incredibly"
                    + " smooth, and as more and more of the stuff comes off, you discover a seamless layer of " + this.player.skin.tone
                    + " scales covering most of your body.  The rest of the fur is easy to remove.");
            }
            else if (this.player.hasNonLizardScales()) {
                this.outputText("\n\nPrickling discomfort suddenly erupts all over your body, like every last inch of your skin has suddenly"
                    + " developed pins and needles.  You scratch yourself, hoping for relief; and when you look at your hands you notice"
                    + " small fragments of your " + this.player.skinFurScales() + " hanging from your fingers.  Nevertheless you continue to"
                    + " scratch yourself, and when you're finally done, you look yourself over. New scales have grown to replace your"
                    + " peeled off [skinFurScales].");
                this.player.skin.tone = newSkinTones[0];
                this.player.arms.updateClaws(this.player.arms.claws.type);
            }
            // (no fur)
            else {
                this.outputText("\n\nYou idly reach back to scratch yourself and nearly jump out of your " + this.player.armorName + " when you hit"
                    + " something hard.  A quick glance down reveals that scales are growing out of your " + this.player.skin.tone + " skin with"
                    + " alarming speed.  As you watch, the surface of your skin is covered in smooth scales.  They interlink together so"
                    + " well that they may as well be seamless.  You peel back your " + this.player.armorName + " and the transformation has"
                    + " already finished on the rest of your body.");
                this.player.skin.tone = newSkinTones[0];
                this.player.arms.updateClaws(this.player.arms.claws.type);
            }
            this.player.skin.setProps({
                type: Skin.LIZARD_SCALES,
                adj: "",
                desc: "scales"
            });
            this.player.underBody.type = UnderBody.REPTILE;
            this.player.copySkinToUnderBody({ // copy the main skin props to the underBody skin ...
                desc: "ventral scales",  // ... and only override the desc
                tone: newSkinTones[1]    // ... and the color (tone)
            });
            this.outputText("\n\n<b>You're covered from head to toe in shiny " + this.player.skin.tone + " scales with [underBody.skinFurScales] on your underside.</b>");
            kGAMECLASS.rathazul.addMixologyXP(20);
            this.changes++;
        }
        // -Lizard-like face.
        if (this.player.face.type !== Face.LIZARD && this.player.hasReptileScales() && this.player.ears.type === Ears.LIZARD && this.player.tail.type === Tail.LIZARD && this.player.lowerBody.type === LowerBody.LIZARD && this.changes < this.changeLimit && this.tfChance(3, 5)) {
            this.outputText("\n\nTerrible agony wracks your " + this.player.faceDescript() + " as bones crack and shift.  Your jawbone rearranges while your cranium shortens.  The changes seem to last forever; once they've finished, no time seems to have passed.  Your fingers brush against your toothy snout as you get used to your new face.  It seems <b>you have a toothy, reptilian visage now.</b>");
            this.player.face.type = Face.LIZARD;
        }
        // -Lizard tongue
        if (this.player.tongue.type === Tongue.SNAKE && this.changes < this.changeLimit && rand(10) < 6) {
            // Higher (60%) chance to be 'fixed' if old variant
            this.mutations.gainLizardTongue();
        }

        if ([Tongue.LIZARD, Tongue.SNAKE].indexOf(this.player.tongue.type) === -1 && this.player.hasReptileFace() && this.changes < this.changeLimit && this.tfChance(2, 3)) {
            this.mutations.gainLizardTongue();
        }
        // -Remove Gills
        if (this.tfChance(2, 4) && this.player.hasGills() && this.changes < this.changeLimit) {
            this.mutations.updateGills();
        }
        // <mod name="Reptile eyes" author="Stadler76">
        // -Lizard eyes
        if (!this.player.hasLizardEyes() && this.player.face.type === Face.LIZARD && this.player.hasReptileScales() && this.player.ears.type === Ears.LIZARD && this.changes < this.changeLimit && this.tfChance(2, 4)) {
            if (this.player.hasReptileEyes())
                this.outputText("\n\nYour eyes change slightly in their appearance.  ");
            else {
                this.outputText("\n\nYou feel a sudden surge of pain in your eyes as they begin to reshape. Your pupils begin to elongate becoming vertically slitted and your irises change their color, too.");
                this.outputText("\nAs the pain passes, you examine your eyes in a nearby puddle. You look into your new eyes with vertically slitted pupils surrounded by green-yellowish irises. With a few tears remaining, the look is a bit blurry. Wanting to get a clearer look at them, you blink your remaining tears away and suddenly you realize, that you just did that with your second set of eyelids.\n");
            }
            this.outputText("<b>You now have lizard eyes.</b>");
            this.player.eyes.type = Eyes.LIZARD;
            this.changes++;
        }
        // </mod>
        // FAILSAFE CHANGE
        if (this.changes === 0) {
            this.outputText("\n\nInhuman vitality spreads through your body, invigorating you!\n");
            this.player.HPChange(50, true);
            this.dynStats("lus", 3);
        }
        this.player.refillHunger(20);
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;

        return false;
    }
}
