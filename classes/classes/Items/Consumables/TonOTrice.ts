import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";
import { Gender } from "../../lists/Gender";
import { PerkLib } from "../../PerkLib";
import { StatusEffects } from "../../StatusEffects";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { BreastCup } from "../../lists/BreastCup";
import { CockTypesEnum } from "../../CockTypesEnum";
import { Appearance } from "../../Appearance";
import { Antennae } from "../../BodyParts/Antennae";
import { Face } from "../../BodyParts/Face";
import { Ears } from "../../BodyParts/Ears";
import { Horns } from "../../BodyParts/Horns";
import { Arms } from "../../BodyParts/Arms";
import { LowerBody } from "../../BodyParts/LowerBody";
import { Hair } from "../../BodyParts/Hair";
import { Eyes } from "../../BodyParts/Eyes";
import { UnderBody } from "../../BodyParts/UnderBody";
import { Tongue } from "../../BodyParts/Tongue";
import { Claws } from "../../BodyParts/Claws";
import { Neck } from "../../BodyParts/Neck";
import { RearBody } from "../../BodyParts/RearBody";
import { Skin } from "../../BodyParts/Skin";
import { Tail } from "../../BodyParts/Tail";
import { Wings } from "../../BodyParts/Wings";

/**
 * @since  26.05.2017
 * @author Stadler76
 */
export class TonOTrice extends Consumable {

    public constructor() {
        super(
            "ToTrice",
            "Ton o' Trice",
            "a ton o' trice",
            ConsumableLib.DEFAULT_VALUE,
            "It’s a small bottle of thick turquoise liquid labelled ‘Ton o’ Trice’. The label shows an avian creature with a thick reptilian" +
            " tail and bright coloured plumage playfully flying around the text."
        );
    }

    public useItem(): boolean {
        const tfSource: string = "TonOTrice";
        let i: number;
        this.player.slimeFeed();
        this.mutations.initTransformation([2, 2, 3, 4]);

        this.clearOutput();
        this.credits.authorText = "MissBlackthorne";
        this.outputText("You drink the slimy concoction, grimacing as it reaches your tongue. At first you’re shocked you don’t gag but once you taste"
            + " the mixture you realise it's not so bad, almost having a hint of almond behind that thick texture.");

        if (this.player.spe < this.player.ngPlus(100) && this.changes < this.changeLimit && rand(3) == 0) {
            this.outputText("\n\nYou stumble as you shift position, surprised by how quickly you move. After a moment or two of disorientation,"
                + " you adjust. You’re certain that you can run faster now.");
            // +3 spe if less than 50
            if (this.player.spe < this.player.ngPlus(50)) this.dynStats("spe", 1);
            // +2 spe if less than 75
            if (this.player.spe < this.player.ngPlus(75)) this.dynStats("spe", 1);
            // +1 if above 75.
            this.dynStats("spe", 1);
        }

        if (this.player.tou > this.player.ngPlus(80) && this.changes < this.changeLimit && rand(4) == 0) {
            this.outputText("\n\nYou feel yourself become a little more delicate, as though you can’t handle quite so strong hits anymore. Then again,"
                + " who needs to withstand a blow when you can just move with the speed of the wind and dodge it?");
            this.dynStats("tou", -1);

        }

        // -Reduces sensitivity.
        if (this.player.sens > 20 && this.changes < this.changeLimit && rand(3) == 0) {
            this.outputText("\n\nThe sensation of prickly pins and needles moves over your body, leaving your senses a little dulled in its wake.");
            this.dynStats("sen", -1);
        }

        // Raises libido greatly to 50, then somewhat to 75, then slowly to 100.
        if (this.player.lib < 100 && this.changes < this.changeLimit && rand(3) == 0) {
            this.outputText("\n\nA knot of fire in your gut doubles you over but passes after a few moments. As you straighten you can feel the heat"
                + " seeping into you, ");
            // (DICK)
            if (this.player.cocks.length > 0 && (this.player.gender != Gender.HERM || rand(2) == 0)) {
                this.outputText("filling [if (cocks > 1)each of] your [cocks] with the desire to breed. You get a bit hornier when you realize your"
                    + " sex-drive has gotten a boost.");
            }
            // (COOCH)
            else if (this.player.hasVagina()) {
                this.outputText("puddling in your [vagina]. An instinctive desire to mate and lay eggs spreads through you, increasing your lust and"
                    + " boosting your sex-drive.");
            }
            // (TARDS)
            else {
                this.outputText("puddling in your featureless crotch for a split-second before it slides into your [ass].  You want to be fucked,"
                    + " filled, and perhaps even gain a proper gender again.  Through the lust you realize your sex-drive has been"
                    + " permanently increased.");
            }
            // +3 lib if less than 50
            if (this.player.lib < 50) this.dynStats("lib", 1);
            // +2 lib if less than 75
            if (this.player.lib < 75) this.dynStats("lib", 1);
            // +1 if above 75.
            this.dynStats("lib", 1);
        }

        // Sexual changes

        // -Lactation stoppage.
        if (this.player.biggestLactation() >= 1 && this.changes < this.changeLimit && rand(4) == 0) {
            this.outputText("\n\n[if (totalNipples == 2)Both of your|All of your many] nipples relax. It's a strange feeling, and you pull back your"
                + " top to touch one. It feels fine, though there doesn't seem to be any milk leaking out.  You give it a squeeze and marvel"
                + " when nothing [if (hasNippleCunts)but sexual fluid] escapes it. <b>You are no longer lactating.</b> That makes sense,"
                + " only mammals lactate!  Smiling, you muse at how much time this will save you when cleaning your gear.");
            if (this.player.findPerk(PerkLib.Feeder) >= 0 || this.player.hasStatusEffect(StatusEffects.Feeder)) {
                this.outputText("\n\n(<b>Feeder perk lost!</b>)");
                this.player.removePerk(PerkLib.Feeder);
                this.player.removeStatusEffect(StatusEffects.Feeder);
            }
            this.changes++;
            // Loop through and reset lactation
            for (i = 0; i < this.player.breastRows.length; i++) {
                this.player.breastRows[i].lactationMultiplier = 0;
            }
        }

        // -Nipples reduction to 1 per tit.
        if (this.player.averageNipplesPerBreast() > 1 && this.changes < this.changeLimit && rand(4) == 0) {
            this.outputText("\n\nA chill runs over your [allBreasts] and vanishes. You stick a hand under your [armor] and discover that your extra"
                + " nipples are missing! You're down to just one per [if (biggestTitSize < 1)'breast'|breast].");
            this.changes++;
            // Loop through and reset nipples
            for (i = 0; i < this.player.breastRows.length; i++) {
                this.player.breastRows[i].nipplesPerBreast = 1;
            }
        }

        // -Remove extra breast rows
        if (this.changes < this.changeLimit && this.player.breastRows.length > 1 && rand(3) == 0 && !this.flags[kFLAGS.HYPER_HAPPY]) {
            this.mutations.removeExtraBreastRow(tfSource);
        }

        // -Butt > 5 - decrease butt size
        if (this.player.butt.rating > 5 && this.changes < this.changeLimit && rand(4) == 0) {
            this.changes++;
            this.player.butt.rating--;
            this.outputText("\n\nA feeling of tightness starts in your [butt], increasing gradually. The sensation grows and grows, but as it does"
                + " your center of balance shifts. You reach back to feel yourself, and sure enough your [butt] is shrinking into a"
                + " more manageable size.");
        }

        if (this.player.isFemaleOrHerm()) {
            // Breasts > D cup - Decrease breast size by up to 3 cups
            if (this.player.isFemaleOrHerm() && this.player.biggestTitSize() > BreastCup.D && this.changes < this.changeLimit && rand(3) == 0) {
                for (i = 0; i < this.player.breastRows.length; i++) {
                    if (this.player.breastRows[i].breastRating > BreastCup.D)
                        this.player.breastRows[i].breastRating -= 1 + rand(3);
                }
                this.outputText("\n\nYour breasts feel tight[if (hasArmor), your [armor] feeling looser around your chest]. You watch in shock as your"
                    + " breast flesh rapidly diminishes, shrinking into your chest. They finally stop when they reach [breastcup] size."
                    + " You feel a little lighter.");
                this.dynStats("spe", 1);
                this.changes++;
            }

            // Breasts < B cup - Increase breast size by 1 cup
            if (this.player.isFemaleOrHerm() && this.player.smallestTitSize() < BreastCup.B && this.changes < this.changeLimit && rand(3) == 0) {
                for (i = 0; i < this.player.breastRows.length; i++) {
                    if (this.player.breastRows[i].breastRating < BreastCup.B)
                        this.player.breastRows[i].breastRating++;
                }
                this.outputText("\n\nYour breasts feel constrained and painful against your top as they grow larger by the moment, finally stopping as"
                    + " they reach [breastcup] size. You rub the tender orbs as you get used to your larger breast flesh.");
                this.dynStats("lib", 1);
                this.changes++;
            }

            // Hips > 12 - decrease hip size by 1-3 sizes
            if (this.player.hips.rating > 12 && this.changes < this.changeLimit && rand(3) == 0) {
                this.outputText("\n\nYou stumble a bit as the bones in your pelvis rearrange themselves painfully. Your hips have narrowed.");
                this.player.hips.rating -= 1 + rand(3);
                this.changes++;
            }

            // Hips < 6 - increase hip size by 1-3 sizes
            if (this.player.hips.rating < 6 && this.changes < this.changeLimit && rand(3) == 0) {
                this.outputText("\n\nYou stumble as you feel the bones in your hips grinding, expanding your hips noticeably.");
                this.player.hips.rating += 1 + rand(3);
                this.changes++;
            }

            if (this.player.nippleLength > 1 && this.changes < this.changeLimit && rand(3) == 0) {
                this.outputText("\n\nWith a sudden pinch your [nipples] get smaller and smaller,"
                    + " stopping when they are roughly half their previous size");
                this.player.nippleLength /= 2;
            }

            if (this.player.hasVagina() && this.player.vaginas[0].vaginalWetness < 3 && this.changes < this.changeLimit && rand(4) == 0) {
                this.outputText("\n\nYour [cunt]'s internal walls feel a tingly wave of strange tightness which then transitions into a long"
                    + " stretching sensation, like you were made of putty. Experimentally, you slip a couple of fingers inside to find"
                    + " you've become looser and more pliable, ready to take those monster cocks. Or better yet, to lay eggs.");
                this.player.vaginas[0].vaginalWetness++;
                this.changes++;
            }

            // Increase tone (up to 65)
            if (this.player.tone < 65 && rand(3) == 0) {
                this.outputText(this.player.modTone(65, 2));
            }

            // Decrease thickness (down to 35)
            if (this.player.thickness > 35 && rand(3) == 0) {
                this.outputText(this.player.modThickness(35, 5));
            }

            if (rand(5) == 0 && this.player.cockatriceScore() > 3) {
                this.mutations.updateOvipositionPerk(tfSource); // does all the magic, nuff said!
            }
        }

        if (this.player.isMale()) {
            // Breasts > B cup - decrease by 1 cup size
            if (this.player.biggestTitSize() > BreastCup.B && this.changes < this.changeLimit && rand(3) == 0) {
                for (i = 0; i < this.player.breastRows.length; i++) {
                    if (this.player.breastRows[i].breastRating > BreastCup.B)
                        this.player.breastRows[i].breastRating--;
                }
                this.outputText("\n\nYour breasts feel tight[if (hasArmor), your [armor] feeling looser around your chest]. You watch in shock as your"
                    + " breast flesh rapidly diminishes, shrinking into your chest. They finally stop when they reach [breastcup] size."
                    + " You feel a little lighter.");
                this.dynStats("spe", 1);
                this.changes++;
            }

            if (this.player.nippleLength > 1 && this.changes < this.changeLimit && rand(3) == 0) {
                this.outputText("\n\nWith a sudden pinch your [nipples] get smaller and smaller,"
                    + " stopping when they are roughly half their previous size");
                this.player.nippleLength /= 2;
            }

            // Hips > 10 - decrease hip size by 1-3 sizes
            if (this.player.hips.rating > 10 && this.changes < this.changeLimit && rand(3) == 0) {
                this.outputText("\n\nYou stumble a bit as the bones in your pelvis rearrange themselves painfully. Your hips have narrowed.");
                this.player.hips.rating -= 1 + rand(3);
                this.changes++;
            }

            // Hips < 2 - increase hip size by 1-3 sizes
            if (this.player.hips.rating < 2 && this.changes < this.changeLimit && rand(3) == 0) {
                this.outputText("\n\nYou stumble as you feel the bones in your hips grinding, expanding your hips noticeably.");
                this.player.hips.rating += 1 + rand(3);
                this.changes++;
            }

            // Increase tone (up to 70)
            if (this.player.tone < 70 && rand(3) == 0) {
                this.outputText(this.player.modTone(65, 2));
            }

            // Decrease thickness (down to 35)
            if (this.player.thickness > 35 && rand(3) == 0) {
                this.outputText(this.player.modThickness(35, 5));
            }
        }

        if (this.player.isMaleOrHerm()) {
            // Cock < 6 inches - increase by 1-2 inches
            if (this.player.shortestCockLength() < 6 && rand(3) == 0 && this.changes < this.changeLimit) {
                const increment: number = this.player.increaseCock(this.player.shortestCockIndex(), 1 + rand(2));
                this.outputText("Your [if (cocks > 1)shortest] cock fills to its normal size, but doesn’t just stop there. Your cock feels incredibly"
                    + " tight as a few more inches of length seem to pour out from your crotch."
                    + " Your cock has gained " + increment + " inches.");
                this.changes++;
            }

            // Shrink oversized cocks
            if (this.player.biggestCockLength() > 16 && rand(3) == 0 && this.changes < this.changeLimit) {
                const idx: number = this.player.biggestCockIndex();
                this.outputText("\n\nYou feel a tightness in your groin like someone tugging on your shaft from behind you. Once the sensation"
                    + " fades you check [if (hasLowerGarment)inside your [lowergarment]|your [multicock]] and see that your"
                    + " [if (cocks > 1)largest] [cock] has shrunk to a slightly shorter length.");
                this.player.cocks[idx].cockLength -= (rand(10) + 5) / 10;
                if (this.player.cocks[idx].cockThickness > 3) {
                    this.outputText(" Your " + this.player.cockDescript(idx) + " definitely got a bit thinner as well.");
                    this.player.cocks[idx].cockThickness -= (rand(4) + 1) / 10;
                }
                this.changes++;
            }

            // Cock thickness <2 - Increase cock thickness
            if (this.player.smallestCockArea() < 10 && rand(3) == 0 && this.changes < this.changeLimit) {
                this.outputText("[if (cocks > 1) One of your cocks|Your cock] feels swollen and heavy. With a firm, but gentle, squeeze, you confirm"
                    + " your suspicions. It is definitely thicker.");
                this.player.cocks[this.player.thinnestCockIndex()].thickenCock(1.5);
                this.changes++;
            }
        }

        // -Lizard dick - first one
        if (this.player.countCocksOfType(CockTypesEnum.LIZARD) == 0 && this.player.cockTotal() > 0 && this.changes < this.changeLimit && rand(4) == 0) {
            // Find the first non-lizzy dick
            for (i = 0; i < this.player.cocks.length; i++) {
                // Stop loopahn when dick be found
                if (this.player.cocks[i].cockType !== CockTypesEnum.LIZARD) break;
            }
            this.outputText("\n\nA slow tingle warms your groin.  Before it can progress any further, you yank back your [armor] to investigate."
                + "  Your " + this.player.cockDescript(i) + " is changing!  It ripples loosely from [if (hasSheath)sheath|base] to tip,"
                + " undulating and convulsing as its color lightens, darkens, and finally settles on a purplish hue."
                + "  Your " + Appearance.cockNoun(CockTypesEnum.HUMAN) + " resolves itself into a bulbous form, with a slightly pointed tip."
                + "  The 'bulbs' throughout its shape look like they would provide an interesting ride for your sexual partners,"
                + " but the perverse, alien pecker ");
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
                this.player.cocks[i].cockType = CockTypesEnum.LIZARD;
                if (!this.player.hasSheath())
                    this.outputText("\n\nYour sheath tightens and starts to smooth out, revealing ever greater amounts of your "
                        + this.player.cockDescript(i) + "'s lower portions.  After a few moments"
                        + " <b>your groin is no longer so animalistic – the sheath is gone.</b>");
            }
            else this.player.cocks[i].cockType = CockTypesEnum.LIZARD;
            this.changes++;
            this.dynStats("lib", 3, "lus", 10);
        }
        // (CHANGE OTHER DICK)
        // Requires 1 lizard cock, multiple cocks
        if (this.player.cockTotal() > 1 && this.player.countCocksOfType(CockTypesEnum.LIZARD) > 0 && this.player.cockTotal() > this.player.countCocksOfType(CockTypesEnum.LIZARD) && rand(4) == 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nA familiar tingle starts in your crotch, and before you can miss the show, you pull open your [armor]."
                + "  As if operating on a cue, ");
            for (i = 0; i < this.player.cocks.length; i++) {
                // Stop loopahn when dick be found
                if (this.player.cocks[i].cockType !== CockTypesEnum.LIZARD) break;
            }
            if (this.player.cockTotal() == 2) this.outputText("your other dick");
            else this.outputText("another one of your dicks");
            this.outputText(" starts to change into the strange reptilian shape you've grown familiar with.  It warps visibly, trembling and radiating"
                + " pleasurable feelings back to you as the transformation progresses.  ");
            if (this.player.cumQ() < 50) this.outputText("pre-cum oozes from the tip");
            else if (this.player.cumQ() < 700) this.outputText("Thick pre-cum rains from the tip");
            else this.outputText("A wave of pre-cum splatters on the ground");
            this.outputText(" from the pleasure of the change.  In moments <b>you have a bulbous, lizard-like cock.</b>");
            // (REMOVE SHEATH IF NECESSARY)
            if (this.player.hasSheath()) {
                this.player.cocks[i].cockType = CockTypesEnum.LIZARD;
                if (!this.player.hasSheath())
                    this.outputText("\n\nYour sheath tightens and starts to smooth out, revealing ever greater amounts of your "
                        + this.player.cockDescript(i) + "'s lower portions.  After a few moments"
                        + " <b>your groin is no longer so animalistic – the sheath is gone.</b>");
            }
            else this.player.cocks[i].cockType = CockTypesEnum.LIZARD;
            this.changes++;
            this.dynStats("lib", 3, "lus", 10);
        }

        // --Worms leave if 100% lizard dicks?
        // Require mammals?
        if (this.player.countCocksOfType(CockTypesEnum.LIZARD) == this.player.cockTotal() && this.changes < this.changeLimit && this.player.hasStatusEffect(StatusEffects.Infested)) {
            this.outputText("\n\nLike rats from a sinking ship, worms escape from your body in a steady stream.  Surprisingly, the sensation is"
                + " remarkably pleasant, similar to the pleasure of sexual release in a way.  Though they seem inexhaustible, the tiny,"
                + " cum-slimed invertebrates slow to a trickle.  The larger worm-kin inside you stirs as if disturbed from a nap, coming"
                + " loose from whatever moorings it had attached itself to in the interior of your form.  It slowly works its way up your"
                + " urethra, stretching to an almost painful degree with every lurching motion. Your dick bloats out around the base,"
                + " stretched like the ovipositor on a bee-girl in order to handle the parasitic creature,"
                + " but thankfully, the ordeal is a brief one.");
            if (this.player.balls > 1)
                this.outputText("  The remaining " + TonOTrice.num2Text(this.player.balls - 1) + " slither out the pre-stretched holes with ease,"
                    + " though the last one hangs from your tip for a moment before dropping to the ground.");
            this.outputText("  The white creature joins its kin on the ground and slowly slithers away.  Perhaps they prefer mammals? In any event,"
                + " <b>you are no longer infected with worms</b>.");
            this.player.removeStatusEffect(StatusEffects.Infested);
            this.changes++;
        }

        // Increase height up to 5ft 7in.
        if (this.player.tallness < 67 && this.changes < this.changeLimit && rand(5) == 0) {
            this.outputText("\n\nYou shift uncomfortably as you realize you feel off balance."
                + " Gazing down, you realize you have grown SLIGHTLY taller.");
            this.player.tallness += rand(3) + 1;
            this.changes++;
        }

        // Decrease height down to a maximum of 6ft 8in.
        if (this.player.tallness > 80 && this.changes < this.changeLimit && rand(5) == 0) {
            this.outputText("\n\nYour skin crawls, making you close your eyes and shiver. When you open them again the world seems... different."
                + " After a bit of investigation, you realize you've become shorter!");
            this.player.tallness -= rand(3) + 1;
            this.changes++;
        }

        // Physical changes:
        // Removes other antennae
        if (this.player.hasNonCockatriceAntennae() && rand(3) == 0 && this.changes < this.changeLimit) {
            this.mutations.removeAntennae();
        }
        // Gain antennae like feathers
        if (this.player.antennae.type == Antennae.NONE && this.player.face.type == Face.COCKATRICE && this.player.ears.type == Ears.COCKATRICE && rand(3) == 0 && this.changes < this.changeLimit) {
            // Other antennae types are handled above! (Stadler76)
            this.outputText("\n\nYour forehead suddenly itches, making you run your fingers through your hairline as you try to scratch. Under your"
                + " roving fingertips you feel your pores stretch as the shaft of one of your feathers gets thicker and sturdier. A sudden"
                + " pressure builds and then fades, making you groan as you hold your head tight. You tentatively run your fingers over the"
                + " two spots where the feeling originated, only to feel the body of a long, soft and extravagant quill like feather on each"
                + " side. While sturdy enough to support themselves these " + this.player.hair.color + " feathers flop daintily as you move."
                + " They seem to move with your eyebrows, helping convey your expressions.");
            this.outputText("\n<b>You’ve got antennae like eyebrow feathers!</b>");
            this.player.antennae.type = Antennae.COCKATRICE;
            this.changes++;
        }
        // Removes horns
        if (this.changes < this.changeLimit && (this.player.horns.type != Horns.NONE || this.player.horns.value != 0) && rand(5) == 0) {
            this.outputText("\n\nYour ");
            if (this.player.horns.type == Horns.UNICORN || this.player.horns.type == Horns.RHINO) this.outputText("horn");
            else this.outputText("horns");
            this.outputText(" crumble, falling apart in large chunks until they flake away to nothing.");
            this.player.horns.value = 0;
            this.player.horns.type = Horns.NONE;
            this.changes++;
        }

        // Face TF
        if (this.player.face.type != Face.COCKATRICE && this.player.arms.type == Arms.COCKATRICE && this.player.lowerBody.type == LowerBody.COCKATRICE && this.changes < this.changeLimit && rand(3) == 0) {
            this.outputText("\n\nYour head is suddenly wracked with pain. You throw back your head and scream in agony as you feel your skull’s"
                + " structure shifting, reforming into something... different. Your lower face elongates, your nose and lips fusing into the"
                + " new upper half of your mouth while your jaw soon catches it up as they both harden. Your larger upper lip curves over"
                + " your lower, ending in a pointed tip as it changes colour to a shade of yellow. Small feathers rapidly sprout from your"
                + " skin, covering it in " + (this.player.hasCockatriceSkin() ? this.player.skin.furColor : this.player.hair.color) + " feathers. Once your face"
                + " stops it’s rapid transformation you run your hands over your face. You have a beak like muzzle,"
                + " though instead of sharp edges, the lips are firm and rubbery, allowing you the same amount of facial expression as"
                + " before while being solid enough to crack open seeds and nuts like that of a bird.");
            this.outputText("\n<b>You have a cockatrice face!</b>");
            this.player.face.type = Face.COCKATRICE;
            this.changes++;
        }
        // Hair TF
        if (this.player.hair.type != Hair.FEATHER && this.changes < this.changeLimit && rand(4) == 0) {
            this.outputText("\n\nA tingling starts in your scalp, getting worse and worse until you're itching like mad, the feathery strands of your"
                + " hair tickling your fingertips while you scratch like a dog itching a flea. When you pull back your hand, you're treated"
                + " to the sight of downy fluff trailing from your [claws]. A realization dawns on you - <b>you have feathers for hair,"
                + " just like a harpy!</b>");
            this.player.hair.type = Hair.FEATHER;
            this.changes++;
        }
        // Eye TF
        if (this.player.eyes.type != Eyes.COCKATRICE && this.player.face.type == Face.COCKATRICE && this.player.underBody.type == UnderBody.COCKATRICE && this.player.ears.type == Ears.COCKATRICE && this.changes < this.changeLimit && rand(3) == 0) {
            this.outputText("\n\nYour eyes suddenly burn, tears streaming down your cheeks. Your irises grow, taking up your entire eye as a spiderweb"
                + " of light blue crawls across your now vibrant blue eyes, looking like lightning strikes. Your pupils rapidly grow to"
                + " match, elongating into slit like shapes, similar to that of a feline. When your eyes stop watering you finally get a"
                + " look at yourself. Your eyes are now the same as that of the cockatrice you met in the mountains! Your excitement over"
                + " this causes your pupils to widen into large circles, giving you a cute and excited look. Seems you won’t be able to have"
                + " much of a poker face anymore.");
            this.outputText("\n<b>You now have cockatrice eyes!</b>");
            this.player.eyes.type = Eyes.COCKATRICE;
            this.player.eyes.count = 2;
        }
        // Lizard tongue TF
        if (this.player.tongue.type != Tongue.LIZARD && this.player.face.type == Face.COCKATRICE && this.changes < this.changeLimit && rand(3) == 0) {
            this.mutations.gainLizardTongue();
        }
        // Ears TF
        if (this.player.ears.type != Ears.COCKATRICE && this.player.face.type == Face.COCKATRICE && this.changes < this.changeLimit && rand(3) == 0) {
            this.outputText("\n\nA prickling sensation suddenly fills your ears; unpleasant, but hardly painful. It grows and grows until you can't"
                + " stand it any more, and reach up to scratch at them. To your surprise, you find them melting away like overheated"
                + " candles. You panic as they fade into nothingness, leaving you momentarily deaf and dazed, stumbling around in confusion."
                + " Then, all of a sudden, hearing returns to you.  Gratefully investigating, you find you now have a pair of avian"
                + " ear-holes, one on either side of your head. A sudden pain strikes your temples, and you feel long feathers sprout from"
                + " the side you your head, the longest being vertical while the 3 shorter ones come out at a 1 o'clock, 2 o'clock and"
                + " 3 o'clock angle. With a little patience, you begin to adjust these feathers just like ears to aid your hearing.");
            this.outputText("\n<b>You now have cockatrice ears!</b>");
            this.player.ears.type = Ears.COCKATRICE;
            this.changes++;
        }
        // Arm TF
        if (this.player.arms.type != Arms.COCKATRICE && this.changes < this.changeLimit && rand(4) == 0) {
            this.outputText("\n\nPrickling discomfort suddenly erupts all over your body, like every last inch of your skin has suddenly developed"
                + " pins and needles. You scratch yourself, hoping for relief; but soon notice lumps forming under the skin as your lower"
                + " arm begins to shed. A coat of " + (this.player.hasCockatriceSkin() ? this.player.skin.furColor : this.player.hair.color) + " feathers sprouts"
                + " from your skin, covering your upper arm and shoulder entirely, ending at your elbow in a fluffy cuff."
                + " A few long feathers decorate your elbows like vestigial wings. Your lower arm however as grown a layer thick leathery"
                + " scales and dangerous looking talons tip your fingers. As suddenly as the itching came it fades, leaving you to marvel"
                + " over your new arms.");
            this.outputText("\n<b>You now have cockatrice arms!</b>");
            this.player.arms.setType(Arms.COCKATRICE, Claws.COCKATRICE);
            this.changes++;
        }
        // Neck loss, if not cockatrice neck
        if (this.player.neck.type != Neck.COCKATRICE && this.changes < this.changeLimit && rand(4) == 0)
            this.mutations.restoreNeck(tfSource);
        // Rear body restore
        if (this.player.rearBody.type != RearBody.NONE && this.changes < this.changeLimit && rand(5) == 0) this.mutations.restoreRearBody(tfSource);
        // Body TF
        if (!this.player.hasCockatriceSkin() && this.player.face.type == Face.COCKATRICE && this.changes < this.changeLimit && rand(3) == 0) {
            this.mutations.restoreNeck(tfSource + "-forceRestoreNeck");
            const colorChoice: any[] = this.mutations.newCockatriceColors();
            this.outputText("\n\nYour body feels hot and your skin feels tight, making you fall to your knees in a bout of lightheadedness."
                + " You kneel there panting as the pressure increases, sweat dripping from your brow. You don’t know how long you can take"
                + " this and soon you drift into unconsciousness.");
            this.outputText("\nWhen you awaken you check yourself to see what has changed now that the overwhelming pressure has left your body."
                + " The first thing you notice is feathers, lots and lots of feathers that now cover your body in a downy layer."
                + " Around your neck a ruff of soft fluffy feathers has formed like that of an exotic bird. As you look down to your [chest]"
                + " you see that from your chest to your groin you are covered in a layer of " + colorChoice[2] + " scales.");
            this.outputText("\n<b>Your body is now covered in scales and feathers!</b>");

            this.player.skin.setAllProps({
                type: Skin.LIZARD_SCALES,
                furColor: colorChoice[0], // Primary feather color
                tone: colorChoice[2],
                desc: "scales"
            });
            this.player.underBody.setAllProps({
                type: UnderBody.COCKATRICE,
                skin: {
                    type: Skin.FEATHERED,
                    furColor: colorChoice[1], // Secondary feather color
                    tone: colorChoice[2],
                    desc: "feathers"
                }
            });
            this.player.neck.setAllProps({
                type: Neck.COCKATRICE,
                color: colorChoice[1]
            });
            this.changes++;
        }
        // Neck TF, if not already TFed from Body TF above
        if (this.player.neck.type != Neck.COCKATRICE && this.player.hasCockatriceSkin() && this.player.face.type == Face.COCKATRICE && this.changes < this.changeLimit && rand(3) == 0) {
            const colorChoice: any[] = this.mutations.newCockatriceColors();
            this.mutations.restoreNeck(tfSource);
            this.outputText("\n\nYour neck starts to tingle and [secondary furcolor] feathers begin to grow out of it one after another until a ruff"
                + " of soft fluffy feathers has formed like that of an exotic bird.");
            this.outputText("\n<b>You now have a cockatrice neck!</b>");
            this.player.neck.setAllProps({
                type: Neck.COCKATRICE,
                color: colorChoice[1]
            });
            this.changes++;
        }
        // Leg TF
        if (this.player.lowerBody.type != LowerBody.COCKATRICE && this.changes < this.changeLimit && rand(4) == 0) {
            this.outputText("\n\nYou scream in agony as you feel the bones in your feet suddenly break and restructure themselves,"
                + " becoming digitigrade. These strange new legs have three-toed, clawed feet, complete with a small vestigial claw-toe on"
                + " the back for added grip, yet from hip to knee are covered with a layer of "
                + (this.player.hasCockatriceSkin() ? this.player.skin.furColor : this.player.hair.color) + " feathers that end in a cuff.");
            this.outputText("\n<b>You have cockatrice legs!</b>");
            this.player.lowerBody.type = LowerBody.COCKATRICE;
            this.player.lowerBody.legCount = 2;
            this.changes++;
        }
        // Tail TF
        if (this.player.tail.type != Tail.COCKATRICE && this.changes < this.changeLimit && rand(4) == 0) {
            this.outputText("\n\nA sudden dull, throbbing pain in your [butt] forces your hands to it; you can feel an ominous lump over your tail"
                + " bone, swelling bigger and bigger with every heartbeat.  All of a sudden, it seems to explode, jutting out and around"
                + " until it hovers near your ankles. The skin beneath your fingers is covered in feathers but terminates about an inch"
                + " later in a 'v'shape, giving way to " + this.player.skin.tone + " scales.");
            this.outputText("\n<b>You now have a cockatrice tail!</b>");
            this.player.tail.type = Tail.COCKATRICE;
            this.player.tail.recharge = 5;
            this.player.tail.venom = 0;
            this.changes++;
        }
        // Wings TF
        if (this.player.wings.type != Wings.FEATHERED_LARGE && this.player.arms.type == Arms.COCKATRICE && this.changes < this.changeLimit && rand(4) == 0) {
            this.outputText("\n");
            if (this.player.wings.type != Wings.NONE) {
                this.outputText("\nSensation fades from your [wings] slowly but surely, leaving them dried out husks that break off to fall on the"
                    + " ground. Your back closes up to conceal the loss, as smooth and unbroken as the day you entered the portal.");
            }
            this.player.wings.setProps({
                type: Wings.FEATHERED_LARGE,
                color: this.player.isFluffy() || this.player.hasCockatriceSkin() ? this.player.skin.furColor : this.player.hair.color
            });
            this.outputText("\nPain lances through your back, the muscles knotting oddly and pressing up to bulge your skin. It hurts, oh gods does"
                + " it hurt, but you can’t get a good angle to feel at the source of your agony. A loud crack splits the air, and then your"
                + " body is forcing a pair of narrow limbs through a gap in your comfortable clothes. Blood pumps through the new"
                + " appendages, easing the pain as they fill out and grow. Tentatively, you find yourself flexing muscles you didn’t know"
                + " you had, and <b>you’re able to curve the new growths far enough around to behold your brand new, "
                + this.player.wings.color + " wings</b>.");
            this.changes++;
        }

        // FAILSAFE CHANGE
        if (this.changes == 0) {
            this.outputText("\n\nInhuman vitality spreads through your body, invigorating you!\n");
            this.player.HPChange(50, true);
            this.dynStats("lus", 3);
        }

        this.player.refillHunger(20);
        this.game.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;
        return false;
    }
}
