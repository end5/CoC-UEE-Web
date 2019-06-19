import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { PerkLib } from "../../PerkLib";
import { rand } from "../../Extra";
import { Hair } from "../../BodyParts/Hair";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { CockTypesEnum } from "../../CockTypesEnum";
import { Neck } from "../../BodyParts/Neck";
import { Eyes } from "../../BodyParts/Eyes";
import { LowerBody } from "../../BodyParts/LowerBody";
import { Tail } from "../../BodyParts/Tail";
import { Wings } from "../../BodyParts/Wings";
import { Arms } from "../../BodyParts/Arms";
import { RearBody } from "../../BodyParts/RearBody";
import { Face } from "../../BodyParts/Face";
import { Ears } from "../../BodyParts/Ears";
import { StatusEffects } from "../../StatusEffects";

/**
 * @since March 26, 2018
 * @author Stadler76
 */
export class GoldenSeed extends Consumable {
    public static STANDARD: number = 0;
    public static ENHANCED: number = 1;

    private type: number;

    public constructor(_type: number) {
        let id: string;
        let shortName: string;
        let longName: string;
        let description: string;
        let value: number;

        switch (type) {
            case GoldenSeed.STANDARD:
                id = "GldSeed";
                shortName = "GoldenSeed";
                longName = "a golden seed";
                description = "This seed looks and smells absolutely delicious. Though it has an unusual color,"
                    + " the harpies prize these nuts as delicious treats. Eating one might induce some physical transformations.";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            case GoldenSeed.ENHANCED:
                id = "MagSeed";
                shortName = "MagSeed";
                longName = "a magically-enhanced golden seed";
                description = "This seed glows with power.  It's been enhanced by Lumi to unlock its full potential,"
                    + " allowing it to transform you more easily.";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            default: // Remove this if someone manages to get SonarQQbe to not whine about a missing default ... ~Stadler76
                throw new Error("GoldenSeed. Incorrect or no type was passed to constructor");
        }

        super(id, shortName, longName, value, description);
        this.type = _type;
    }

    public useItem(): boolean {
        let tfSource: string = "goldenSeed";
        if (this.player.hasPerk(PerkLib.HarpyWomb)) tfSource += "-HarpyWomb";
        let temp: number;
        // 'type' refers to the variety of seed.
        // 0 == standard.
        // 1 == enhanced - increase change limit and no pre-reqs for TF
        this.mutations.initTransformation([2, 2], type === GoldenSeed.ENHANCED ? 3 : 1);
        // Generic eating text:
        this.clearOutput();
        this.outputText("You pop the nut into your mouth, chewing the delicious treat and swallowing it quickly.  No wonder harpies love these things so much!");
        // ****************
        // Stats:
        // ****************
        // -Speed increase to 100.
        if (this.player.spe100 < 100 && rand(3) === 0) {
            if (this.player.spe100 >= 75) this.outputText("\n\nA familiar chill runs down your spine. Your muscles feel like well oiled machinery, ready to snap into action with lightning speed.");
            else this.outputText("\n\nA chill runs through your spine, leaving you feeling like your reflexes are quicker and your body faster.");
            // Speed gains diminish as it rises.
            if (this.player.spe100 < 40) this.dynStats("spe", .5);
            if (this.player.spe100 < 75) this.dynStats("spe", .5);
            this.dynStats("spe", .5);
        }
        // -Toughness decrease to 50
        if (this.player.tou100 > 50 && rand(3) === 0 && this.changes < this.changeLimit) {
            if (rand(2) === 0) this.outputText("\n\nA nice, slow warmth rolls from your gut out to your limbs, flowing through them before dissipating entirely. As it leaves, you note that your body feels softer and less resilient.");
            else this.outputText("\n\nYou feel somewhat lighter, but consequently more fragile.  Perhaps your bones have changed to be more harpy-like in structure?");
            this.dynStats("tou", -1);
        }
        // antianemone corollary:
        if (this.changes < this.changeLimit && this.player.hair.type == 4 && rand(2) === 0) {
            // -insert anemone hair removal into them under whatever criteria you like, though hair removal should precede abdomen growth; here's some sample text:
            this.outputText("\n\nAs you down the seed, your head begins to feel heavier.  Reaching up, you notice your tentacles becoming soft and somewhat fibrous.  Pulling one down reveals that it feels soft and fluffy, almost feathery; you watch as it dissolves into many thin, feathery strands.  <b>Your hair is now like that of a harpy!</b>");
            this.player.hair.type = Hair.FEATHER;
            this.changes++;
        }
        // -Strength increase to 70
        if (this.player.str100 < 70 && rand(3) === 0 && this.changes < this.changeLimit) {
            // (low str)
            if (this.player.str100 < 40) this.outputText("\n\nShivering, you feel a feverish sensation that reminds you of the last time you got sick. Thankfully, it passes swiftly, leaving slightly enhanced strength in its wake.");
            // (hi str – 50+)
            else this.outputText("\n\nHeat builds in your muscles, their already-potent mass shifting slightly as they gain even more strength.");
            // Faster until 40 str.
            if (this.player.str100 < 40) this.dynStats("str", .5);
            this.dynStats("str", .5);
        }
        // -Libido increase to 90
        if ((this.player.lib100 < 90 || rand(3) === 0) && rand(3) === 0 && this.changes < this.changeLimit) {
            if (this.player.lib100 < 90) this.dynStats("lib", 1);
            // (sub 40 lib)
            if (this.player.lib100 < 40) {
                this.outputText("\n\nA passing flush colors your " + this.player.faceDescript() + " for a second as you daydream about sex. You blink it away, realizing the item seems to have affected your libido.");
                if (this.player.hasVagina()) this.outputText(" The moistness of your " + this.player.vaginaDescript() + " seems to agree.");
                else if (this.player.hasCock()) this.outputText(" The hardness of " + this.player.sMultiCockDesc() + " seems to agree.");
                this.dynStats("lus", 5);
            }
            // (sub 75 lib)
            else if (this.player.lib100 < 75) this.outputText("\n\nHeat, blessed heat, works through you from head to groin, leaving you to shudder and fantasize about the sex you could be having right now.\n\n");
            // (hi lib)
            else if (this.player.lib100 < 90) this.outputText("\n\nSexual need courses through you, flushing your skin with a reddish hue while you pant and daydream of the wondrous sex you should be having right now.\n\n");
            // (90+)
            else this.outputText("\n\nYou groan, something about the seed rubbing your libido in just the right way to make you horny. Panting heavily, you sigh and fantasize about the sex you could be having.\n\n");
            // (fork to fantasy)
            if (this.player.lib100 >= 40) {
                this.dynStats("lus", (this.player.lib / 5 + 10));
                // (herm – either or!)
                // Cocks!
                if (this.player.hasCock() && (this.player.gender !== 3 || rand(2) === 0)) {
                    // (male 1)
                    if (rand(2) === 0) {
                        this.outputText("In your fantasy you're winging through the sky, " + this.player.sMultiCockDesc() + " already hard and drizzling with male moisture while you circle an attractive harpy's nest. Her plumage is as blue as the sky, her eyes the shining teal of the sea, and legs splayed in a way that shows you how ready she is to be bred. You fold your wings and dive, wind whipping through your " + this.player.hairDescript() + " as she grows larger and larger. With a hard, body-slapping impact you land on top of her, plunging your hard, ready maleness into her hungry box. ");
                        if (this.player.cockTotal() > 1) {
                            this.outputText("The extra penis");
                            if (this.player.cockTotal() > 2) this.outputText("es rub ");
                            else this.outputText("rubs ");
                            this.outputText("the skin over her taut, empty belly, drooling your need atop her.  ");
                            this.outputText("You jolt from the vision unexpectedly, finding your " + this.player.sMultiCockDesc() + " is as hard as it was in the dream. The inside of your " + this.player.armorName + " is quite messy from all the pre-cum you've drooled. Perhaps you can find a harpy nearby to lie with.");
                        }
                    }
                    // (male 2)
                    else {
                        this.outputText("In your fantasy you're lying back in the nest your harem built for you, stroking your dick and watching the sexy bird-girl spread her thighs to deposit another egg onto the pile. The lewd moans do nothing to sate your need, and you beckon for another submissive harpy to approach. She does, her thick thighs swaying to show her understanding of your needs. The bird-woman crawls into your lap, sinking down atop your shaft to snuggle it with her molten heat. She begins kissing you, smearing your mouth with her drugged lipstick until you release the first of many loads. You sigh, riding the bliss, secure in the knowledge that this 'wife' won't let up until she's gravid with another egg. Then it'll be her sister-wife's turn. The tightness of " + this.player.sMultiCockDesc() + " inside your " + this.player.armorName + " rouses you from the dream, reminding you that you're just standing there, leaking your need into your gear.");
                    }
                }
                // Cunts!
                else if (this.player.hasVagina()) {
                    // (female 1)
                    if (rand(2) === 0) {
                        this.outputText("In your fantasy you're a happy harpy mother, your womb stretched by the sizable egg it contains. The surging hormones in your body arouse you again, and you turn to the father of your children, planting a wet kiss on his slobbering, lipstick-gilt cock. The poor adventurer writhes, hips pumping futilely in the air. He's been much more agreeable since you started keeping his cock coated with your kisses. You mount the needy boy, fantasizing about that first time when you found him near the portal, in the ruins of your old camp. The feeling of your stiff nipples ");
                        if (this.player.hasFuckableNipples()) this.outputText("and pussy leaking over ");
                        else if (this.player.biggestLactation() >= 1.5) this.outputText("dripping milk inside ");
                        else this.outputText("rubbing inside ");
                        this.outputText("your " + this.player.armorName + " shocks you from the dream, leaving you with nothing but the moistness of your loins for company. Maybe next year you'll find the mate of your dreams?");
                    }
                    // (female 2)
                    else {
                        this.outputText("In your fantasy you're sprawled on your back, thick thighs splayed wide while you're taken by a virile male. The poor stud was wandering the desert all alone, following some map, but soon you had his bright red rod sliding between your butt-cheeks, the pointed tip releasing runnels of submission to lubricate your loins. You let him mount your pussy before you grabbed him with your powerful thighs and took off. He panicked at first, but the extra blood flow just made him bigger. He soon forgot his fear and focused on the primal needs of all males – mating with a gorgeous harpy. You look back at him and wink, feeling his knot build inside you. Your aching, tender " + this.player.nippleDescript(0) + "s pull you out of the fantasy as they rub inside your " + this.player.armorName + ". Maybe once your quest is over you'll be able to find a shy, fertile male to mold into the perfect cum-pump.");
                    }
                }
            }
        }
        // ****************
        //   Sexual:
        // ****************
        // -Grow a cunt (guaranteed if no gender)
        if (this.player.gender == 0 || (!this.player.hasVagina() && this.changes < this.changeLimit && rand(3) === 0)) {
            this.changes++;
            // (balls)
            if (this.player.balls > 0) this.outputText("\n\nAn itch starts behind your " + this.player.ballsDescriptLight() + ", but before you can reach under to scratch it, the discomfort fades. A moment later a warm, wet feeling brushes your " + this.player.sackDescript() + ", and curious about the sensation, <b>you lift up your balls to reveal your new vagina.</b>");
            // (dick)
            else if (this.player.hasCock()) this.outputText("\n\nAn itch starts on your groin, just below your " + this.player.multiCockDescriptLight() + ". You pull your manhood aside to give you a better view, and you're able to watch as <b>your skin splits to give you a new vagina, complete with a tiny clit.</b>");
            // (neither)
            else this.outputText("\n\nAn itch starts on your groin and fades before you can take action. Curious about the intermittent sensation, <b>you peek under your " + this.player.armorName + " to discover your brand new vagina, complete with pussy lips and a tiny clit.</b>");
            this.player.createVagina();
            this.player.setClitLength(.25);
            this.dynStats("sen", 10);
        }
        // -Remove extra breast rows
        if (this.changes < this.changeLimit && this.player.breastRows.length > 1 && rand(3) === 0 && !this.flags[kFLAGS.HYPER_HAPPY]) {
            this.mutations.removeExtraBreastRow(tfSource);
        }
        // -Shrink tits if above DDs.
        // Cannot happen at same time as row removal
        else if (this.changes < this.changeLimit && this.player.breastRows.length == 1 && rand(3) === 0 && this.player.breastRows[0].breastRating >= 7 && !this.flags[kFLAGS.HYPER_HAPPY]) {
            this.changes++;
            // (Use standard breast shrinking mechanism if breasts are under 'h')
            if (this.player.breastRows[0].breastRating < 19) {
                this.player.shrinkTits();
            }
            // (H+)
            else {
                this.player.breastRows[0].breastRating -= (4 + rand(4));
                this.outputText("\n\nYour chest pinches tight, wobbling dangerously for a second before the huge swell of your bust begins to shrink into itself. The weighty mounds jiggle slightly as they shed cup sizes like old, discarded coats, not stopping until they're " + this.player.breastCup(0) + "s.");
            }
        }
        // -Grow tits to a B-cup if below.
        if (this.changes < this.changeLimit && this.player.breastRows[0].breastRating < 2 && rand(3) === 0) {
            this.changes++;
            this.outputText("\n\nYour chest starts to tingle, the " + this.player.skin.desc + " warming under your " + this.player.armorName + ". Reaching inside to feel the tender flesh, you're quite surprised when it puffs into your fingers, growing larger and larger until it settles into a pair of B-cup breasts.");
            if (this.player.breastRows[0].breastRating < 1) this.outputText("  <b>You have breasts now!</b>");
            this.player.breastRows[0].breastRating = 2;
        }
        // Change cock if you have a penis.
        if (this.changes < this.changeLimit && this.player.hasCock() && this.player.countCocksOfType(CockTypesEnum.AVIAN) < this.player.cockTotal() && rand(type === GoldenSeed.ENHANCED ? 4 : 10) === 0) { // 2.5x chance if magic seed.
            this.changes++;
            this.outputText("\n\nYou feel a strange tingling sensation in your cock as erection forms. You " + this.player.clothedOrNakedLower("open up your " + this.player.armorName + " and", "") + " look down to see " + (this.player.cockTotal() == 1 ? "your cock" : "one of your cocks") + " shifting! By the time the transformation's complete, you notice it's tapered, red, and ends in a tip. When you're not aroused, your cock rests nicely in a newly-formed sheath. <b>You now have an avian penis!</b>");
            for (const cock of this.player.cocks) {
                if (cock.cockType !== CockTypesEnum.AVIAN) {
                    cock.cockType = CockTypesEnum.AVIAN;
                    break;
                }
            }
        }
        // Neck restore
        if (this.player.neck.type !== Neck.NORMAL && this.changes < this.changeLimit && rand(4) === 0) this.mutations.restoreNeck(tfSource);
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && rand(5) === 0) this.mutations.restoreRearBody(tfSource);
        // Ovi perk
        if (rand(5) === 0) this.mutations.updateOvipositionPerk(tfSource);
        // ****************
        // General Appearance:
        // ****************
        // -Femininity to 85
        if (this.player.femininity < 85 && this.changes < this.changeLimit && rand(3) === 0) {
            this.changes++;
            this.outputText(this.player.modFem(85, 3 + rand(5)));
        }
        // -Skin color change – tan, olive, dark, light
        if ((this.player.skin.tone !== "tan" && this.player.skin.tone !== "olive" && this.player.skin.tone !== "dark" && this.player.skin.tone !== "light") && this.changes < this.changeLimit && rand(5) === 0) {
            this.changes++;
            this.outputText("\n\nIt takes a while for you to notice, but <b>");
            if (this.player.hasFur()) this.outputText("the skin under your " + this.player.hair.color + " " + this.player.skin.desc);
            else this.outputText("your " + this.player.skin.desc);
            this.outputText(" has changed to become ");
            temp = rand(4);
            if (temp == 0) this.player.skin.tone = "tan";
            else if (temp == 1) this.player.skin.tone = "olive";
            else if (temp == 2) this.player.skin.tone = "dark";
            else if (temp == 3) this.player.skin.tone = "light";
            this.outputText(this.player.skin.tone + " colored.</b>");
            this.player.arms.updateClaws(this.player.arms.claws.type);
        }
        // -Grow hips out if narrow.
        if (this.player.hips.rating < 10 && this.changes < this.changeLimit && rand(3) === 0) {
            this.outputText("\n\nYour gait shifts slightly to accommodate your widening " + this.player.hipDescript() + ". The change is subtle, but they're definitely broader.");
            this.player.hips.rating++;
            this.changes++;
        }
        // -Narrow hips if crazy wide
        if (this.player.hips.rating >= 15 && this.changes < this.changeLimit && rand(3) === 0) {
            this.outputText("\n\nYour gait shifts inward, your " + this.player.hipDescript() + " narrowing significantly. They remain quite thick, but they're not as absurdly wide as before.");
            this.player.hips.rating--;
            this.changes++;
        }
        // -Big booty
        if (this.player.butt.rating < 8 && this.changes < this.changeLimit && rand(3) === 0) {
            this.player.butt.rating++;
            this.changes++;
            this.outputText("\n\nA slight jiggle works through your rear, but instead of stopping it starts again. You can actually feel your " + this.player.armorName + " being filled out by the growing cheeks. When it stops, you find yourself the proud owner of a " + this.player.buttDescript() + ".");
        }
        // -Narrow booty if crazy huge.
        if (this.player.butt.rating >= 14 && this.changes < this.changeLimit && rand(4) === 0) {
            this.changes++;
            this.player.butt.rating--;
            this.outputText("\n\nA feeling of tightness starts in your " + this.player.buttDescript() + ", increasing gradually. The sensation grows and grows, but as it does your center of balance shifts. You reach back to feel yourself, and sure enough your massive booty is shrinking into a more manageable size.");
        }
        // -Body thickness to 25ish
        if (this.player.thickness > 25 && this.changes < this.changeLimit && rand(3) === 0) {
            this.outputText(this.player.modThickness(25, 3 + rand(4)));
            this.changes++;
        }
        // Remove odd eyes
        if (this.changes < this.changeLimit && rand(5) === 0 && this.player.eyes.type > Eyes.HUMAN) {
            if (this.player.eyes.type == Eyes.BLACK_EYES_SAND_TRAP) {
                this.outputText("\n\nYou feel a twinge in your eyes and you blink.  It feels like black cataracts have just fallen away from you, and you know without needing to see your reflection that your eyes have gone back to looking human.");
            }
            else {
                this.outputText("\n\nYou blink and stumble, a wave of vertigo threatening to pull your " + this.player.feet() + " from under you.  As you steady and open your eyes, you realize something seems different.  Your vision is changed somehow.");
                if (this.player.eyes.type == Eyes.FOUR_SPIDER_EYES || this.player.eyes.type == Eyes.SPIDER) this.outputText("  Your arachnid eyes are gone!</b>");
                this.outputText("  <b>You have normal, humanoid eyes again.</b>");
            }
            this.player.eyes.type = Eyes.HUMAN;
            this.player.eyes.count = 2;
            this.changes++;
        }
        // ****************
        // Harpy Appearance:
        // ****************
        // -Harpy legs
        if (this.player.lowerBody.type !== LowerBody.HARPY && this.changes < this.changeLimit && (type === GoldenSeed.ENHANCED || this.player.tail.type == Tail.HARPY) && rand(4) === 0) {
            // (biped/taur)
            if (!this.player.isGoo()) this.outputText("\n\nYour " + this.player.legs() + " creak ominously a split-second before they go weak and drop you on the ground. They go completely limp, twisting and reshaping before your eyes in ways that make you wince. Your lower body eventually stops, but the form it's settled on is quite thick in the thighs. Even your " + this.player.feet() + " have changed.  ");
            // goo
            else this.outputText("\n\nYour gooey undercarriage loses some of its viscosity, dumping you into the puddle that was once your legs. As you watch, the fluid pulls together into a pair of distinctly leg-like shapes, solidifying into a distinctly un-gooey form. You've even regained a pair of feet!  ");
            this.player.lowerBody.type = LowerBody.HARPY;
            this.player.lowerBody.legCount = 2;
            this.changes++;
            // (cont)
            this.outputText("While humanoid in shape, they have two large, taloned toes on the front and a single claw protruding from the heel. The entire ensemble is coated in " + this.player.hair.color + " feathers from ankle to hip, reminding you of the bird-women of the mountains. <b>You now have harpy legs!</b>");
        }
        // -Feathery Tail
        if (this.player.tail.type !== Tail.HARPY && this.changes < this.changeLimit && (type === GoldenSeed.ENHANCED || this.player.wings.type == Wings.FEATHERED_LARGE) && rand(4) === 0) {
            // (tail)
            if (this.player.tail.type > Tail.NONE) this.outputText("\n\nYour tail shortens, folding into the crack of your " + this.player.buttDescript() + " before it disappears. A moment later, a fan of feathers erupts in its place, fluffing up and down instinctively every time the breeze shifts. <b>You have a feathery harpy tail!</b>");
            // (no tail)
            else this.outputText("\n\nA tingling tickles the base of your spine, making you squirm in place. A moment later, it fades, but a fan of feathers erupts from your " + this.player.skin.desc + " in its place. The new tail fluffs up and down instinctively with every shift of the breeze. <b>You have a feathery harpy tail!</b>");
            this.player.tail.type = Tail.HARPY;
            this.changes++;
        }
        // -Propah Wings
        if (this.player.wings.type == Wings.NONE && this.changes < this.changeLimit && (type === GoldenSeed.ENHANCED || this.player.arms.type == Arms.HARPY) && rand(4) === 0) {
            this.outputText("\n\nPain lances through your back, the muscles knotting oddly and pressing up to bulge your " + this.player.skin.desc + ". It hurts, oh gods does it hurt, but you can't get a good angle to feel at the source of your agony. A loud crack splits the air, and then your body is forcing a pair of narrow limbs through a gap in your " + this.player.armorName + ". Blood pumps through the new appendages, easing the pain as they fill out and grow. Tentatively, you find yourself flexing muscles you didn't know you had, and");
            this.player.wings.setProps({
                type: Wings.FEATHERED_LARGE,
                color: this.player.hasFur() ? this.player.skin.furColor : this.player.hair.color
            });
            this.outputText(" <b>you're able to curve the new growths far enough around to behold your brand new, " + this.player.wings.color + " wings.</b>");
            this.changes++;
        }
        // -Remove old wings
        if (([Wings.NONE, Wings.FEATHERED_LARGE].indexOf(this.player.wings.type) == -1 || this.player.rearBody.type == RearBody.SHARK_FIN) && this.changes < this.changeLimit && rand(4) === 0) {
            if (this.player.rearBody.type == RearBody.SHARK_FIN) {
                this.outputText("\n\nSensation fades from your large fin slowly but surely, leaving it a dried out husk that breaks off to fall on the"
                    + " ground. Your back closes up to conceal the loss, as smooth and unbroken as the day you entered the portal.");
                this.player.rearBody.restore();
            } else {
                this.outputText("\n\nSensation fades from your [wings] slowly but surely, leaving them dried out husks that break off to fall on the"
                    + " ground. Your back closes up to conceal the loss, as smooth and unbroken as the day you entered the portal.");
            }
            this.player.wings.restore();
            this.changes++;
        }
        // -Feathery Arms
        if (this.player.arms.type !== Arms.HARPY && this.changes < this.changeLimit && (type === GoldenSeed.ENHANCED || this.player.hair.type === Hair.FEATHER) && rand(4) === 0) {
            this.outputText("\n\nYou smile impishly as you lick the last bits of the nut from your teeth, but when you go to wipe your mouth, instead of the usual texture of your " + this.player.skin.desc + " on your lips, you feel feathers! You look on in horror while more of the avian plumage sprouts from your " + this.player.skin.desc + ", covering your forearms until <b>your arms look vaguely like wings</b>. Your hands remain unchanged thankfully. It'd be impossible to be a champion without hands! The feathery limbs might help you maneuver if you were to fly, but there's no way they'd support you alone.");
            this.changes++;
            this.player.arms.setType(Arms.HARPY);
        }
        // -Feathery Hair
        if (this.player.hair.type !== Hair.FEATHER && this.changes < this.changeLimit && (type === GoldenSeed.ENHANCED || this.player.face.type == Face.HUMAN) && rand(4) === 0) {
            this.outputText("\n\nA tingling starts in your scalp, getting worse and worse until you're itching like mad, the feathery strands of your hair tickling your fingertips while you scratch like a dog itching a flea. When you pull back your hand, you're treated to the sight of downy fluff trailing from your fingernails. A realization dawns on you - you have feathers for hair, just like a harpy!");
            this.player.hair.type = Hair.FEATHER;
            this.changes++;
        }
        // -Human face
        if (this.player.face.type !== Face.HUMAN && this.changes < this.changeLimit && (type === GoldenSeed.ENHANCED || (this.player.ears.type == Ears.HUMAN || this.player.ears.type == Ears.ELFIN)) && rand(4) === 0) {
            this.outputText("\n\nSudden agony sweeps over your " + this.player.faceDescript() + ", your visage turning hideous as bones twist and your jawline shifts. The pain slowly vanishes, leaving you weeping into your fingers. When you pull your hands away you realize you've been left with a completely normal, human face.");
            this.player.face.type = Face.HUMAN;
            this.changes++;
        }
        // -Gain human ears (keep elf ears)
        if ((this.player.ears.type !== Ears.HUMAN && this.player.ears.type !== Ears.ELFIN) && this.changes < this.changeLimit && rand(4) === 0) {
            this.outputText("\n\nOuch, your head aches! It feels like your ears are being yanked out of your head, and when you reach up to hold your aching noggin, you find they've vanished! Swooning and wobbling with little sense of balance, you nearly fall a half-dozen times before <b>a pair of normal, human ears sprout from the sides of your head.</b> You had almost forgotten what human ears felt like!");
            this.player.ears.type = Ears.HUMAN;
            this.changes++;
        }
        // Remove gills
        if (rand(4) === 0 && this.player.hasGills() && this.changes < this.changeLimit) this.mutations.updateGills();
        // SPECIAL:
        // Harpy Womb – All eggs are automatically upgraded to large, requires legs + tail to be harpy.
        if (this.player.findPerk(PerkLib.HarpyWomb) < 0 && this.player.lowerBody.type == LowerBody.HARPY && this.player.tail.type == Tail.HARPY && rand(4) === 0 && this.changes < this.changeLimit) {
            this.player.createPerk(PerkLib.HarpyWomb, 0, 0, 0, 0);
            this.outputText("\n\nThere's a rumbling in your womb, signifying that some strange change has taken place in your most feminine area. No doubt something in it has changed to be more like a harpy. (<b>You've gained the Harpy Womb perk! All the eggs you lay will always be large so long as you have harpy legs and a harpy tail.</b>)");
            this.changes++;
        }
        if (this.changes < this.changeLimit && rand(4) === 0 && ((this.player.ass.analWetness > 0 && this.player.findPerk(PerkLib.MaraesGiftButtslut) < 0) || this.player.ass.analWetness > 1)) {
            this.outputText("\n\nYou feel a tightening up in your colon and your [asshole] sucks into itself.  You feel sharp pain at first but that thankfully fades.  Your ass seems to have dried and tightened up.");
            this.player.ass.analWetness--;
            if (this.player.ass.analLooseness > 1) this.player.ass.analLooseness--;
            this.changes++;
        }
        // Nipples Turn Back:
        if (this.player.hasStatusEffect(StatusEffects.BlackNipples) && this.changes < this.changeLimit && rand(3) === 0) {
            this.mutations.removeBlackNipples(tfSource);
        }
        // Debugcunt
        if (this.changes < this.changeLimit && rand(3) === 0 && this.player.vaginaType() == 5 && this.player.hasVagina()) {
            this.outputText("\n\nSomething invisible brushes against your sex, making you twinge.  Undoing your clothes, you take a look at your vagina and find that it has turned back to its natural flesh colour.");
            this.player.vaginaType(0);
            this.changes++;
        }
        if (this.changes == 0) this.outputText("\n\nAside from being a tasty treat, it doesn't seem to do anything to you this time.");
        this.player.refillHunger(10);
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;

        return false;
    }
}
