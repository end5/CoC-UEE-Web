import { Consumable } from "../Consumable";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { BreastCup } from "../../lists/BreastCup";
import { CockTypesEnum } from "../../CockTypesEnum";
import { StatusEffects } from "../../StatusEffects";
import { Ears } from "../../BodyParts/Ears";
import { Antennae } from "../../BodyParts/Antennae";
import { ColorLists } from "../../lists/ColorLists";
import { Hair } from "../../BodyParts/Hair";
import { Face } from "../../BodyParts/Face";
import { Arms } from "../../BodyParts/Arms";
import { Tail } from "../../BodyParts/Tail";
import { Claws } from "../../BodyParts/Claws";
import { LowerBody } from "../../BodyParts/LowerBody";
import { Skin } from "../../BodyParts/Skin";
import { UnderBody } from "../../BodyParts/UnderBody";

/**
 * @since  30.11.2017
 * @author Coalsack
 * @author Stadler76
 */
export class RedRiverRoot extends Consumable {
    public constructor() {
        super(
            "RdRRoot",
            "R.R.Root",
            "a red river root",
            14,
            "A long, odd shaped root. It smells spicy but surprisingly tasty. Eating it would supposedly alter your body in unknown ways."
        );
    }

    public useItem(): boolean {
        const tfSource: string = "RedRiverRoot";
        let i: number;
        this.player.slimeFeed();
        this.mutations.initTransformation([2, 2, 4]);

        this.clearOutput();
        this.credits.authorText = "Coalsack";
        this.outputText("Having bought that odd-looking root on the bakery, you give it a try, only to face the mildly spicy taste"
            + " of the transformative. Still, it has a rich flavour and texture, but soon that becomes secondary,"
            + " as you realize that the foreign rhizome is changing your body!");

        if (this.player.spe < this.player.ngPlus(100) && this.changes < this.changeLimit && RedRiverRoot.rand(3) === 0) {
            this.outputText("\n\nAfter a momentaneous dizziness, you recover your stance,"
                + " and find your muscles becoming more nimble and prompt to run.");
            // +3 spe if less than 50
            if (this.player.spe < this.player.ngPlus(50)) this.dynStats("spe", 1);
            // +2 spe if less than 75
            if (this.player.spe < this.player.ngPlus(75)) this.dynStats("spe", 1);
            // +1 if above 75.
            this.dynStats("spe", 1);
        }

        // ------------- Sexual changes -------------
        // -Nipples reduction to 1 per tit.
        if (this.player.averageNipplesPerBreast() > 1 && this.changes < this.changeLimit && RedRiverRoot.rand(4) === 0) {
            this.outputText("\n\nA chill runs over your [allBreasts] and vanishes. You stick a hand under your [armor] and discover that your extra"
                + " nipples are missing! You're down to just one per [if (biggestTitSize < 1)'breast'|breast].");
            this.changes++;
            // Loop through and reset nipples
            for (i = 0; i < this.player.breastRows.length; i++) {
                this.player.breastRows[i].nipplesPerBreast = 1;
            }
        }

        // -Remove extra breast rows
        if (this.changes < this.changeLimit && this.player.breastRows.length > 1 && RedRiverRoot.rand(3) === 0 && !this.flags[kFLAGS.HYPER_HAPPY]) {
            this.mutations.removeExtraBreastRow(tfSource);
        }

        // -Butt > 5 - decrease butt size
        if (this.player.butt.rating > 5 && this.changes < this.changeLimit && RedRiverRoot.rand(4) === 0) {
            this.changes++;
            this.player.butt.rating--;
            this.outputText("\n\nA feeling of tightness starts in your [butt], increasing gradually. The sensation grows and grows, but as it does"
                + " your center of balance shifts. You reach back to feel yourself, and sure enough your [butt] is shrinking into a"
                + " more manageable size.");
        }

        if (this.player.isFemaleOrHerm()) {
            // Breasts > D cup - Decrease breast size by up to 3 cups
            if (this.player.biggestTitSize() > BreastCup.D && this.changes < this.changeLimit && RedRiverRoot.rand(3) === 0) {
                for (i = 0; i < this.player.breastRows.length; i++) {
                    if (this.player.breastRows[i].breastRating > BreastCup.D)
                        this.player.breastRows[i].breastRating -= 1 + RedRiverRoot.rand(3);
                }
                this.outputText("\n\nYour breasts feel tight[if (hasArmor), your [armor] feeling looser around your chest]. You watch in shock as your"
                    + " breast flesh rapidly diminishes, shrinking into your chest. They finally stop when they reach [breastcup] size."
                    + " You feel a little lighter.");
                this.dynStats("spe", 1);
                this.changes++;
            }

            // Breasts < B cup - Increase breast size by 1 cup
            if (this.player.smallestTitSize() < BreastCup.B && this.changes < this.changeLimit && RedRiverRoot.rand(3) === 0) {
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
            if (this.player.hips.rating > 12 && this.changes < this.changeLimit && RedRiverRoot.rand(3) === 0) {
                this.outputText("\n\nYou stumble a bit as the bones in your pelvis rearrange themselves painfully. Your hips have narrowed.");
                this.player.hips.rating -= 1 + RedRiverRoot.rand(3);
                this.changes++;
            }

            // Hips < 6 - increase hip size by 1-3 sizes
            if (this.player.hips.rating < 6 && this.changes < this.changeLimit && RedRiverRoot.rand(3) === 0) {
                this.outputText("\n\nYou stumble as you feel the bones in your hips grinding, expanding your hips noticeably.");
                this.player.hips.rating += 1 + RedRiverRoot.rand(3);
                this.changes++;
            }

            if (this.player.nippleLength > 1 && this.changes < this.changeLimit && RedRiverRoot.rand(3) === 0) {
                this.outputText("\n\nWith a sudden pinch your [nipples] get smaller and smaller,"
                    + " stopping when they are roughly half their previous size");
                this.player.nippleLength /= 2;
            }

            if (this.player.hasVagina() && this.player.vaginas[0].vaginalWetness < 3 && this.changes < this.changeLimit && RedRiverRoot.rand(4) === 0) {
                this.outputText("\n\nYour [cunt]'s internal walls feel a tingly wave of strange tightness which then transitions into a long"
                    + " stretching sensation, like you were made of putty. Experimentally, you slip a couple of fingers inside to find"
                    + " you've become looser and more pliable, ready to take those monster cocks.");
                this.player.vaginas[0].vaginalWetness++;
                this.changes++;
            }

            // Increase tone (up to 65)
            if (this.player.tone < 65 && RedRiverRoot.rand(3) === 0) {
                this.outputText(this.player.modTone(65, 2));
            }

            // Decrease thickness (down to 35)
            if (this.player.thickness > 35 && RedRiverRoot.rand(3) === 0) {
                this.outputText(this.player.modThickness(35, 5));
            }
        }

        if (this.player.isMale()) {
            // Breasts > B cup - decrease by 1 cup size
            if (this.player.biggestTitSize() > BreastCup.B && this.changes < this.changeLimit && RedRiverRoot.rand(3) === 0) {
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

            if (this.player.nippleLength > 1 && this.changes < this.changeLimit && RedRiverRoot.rand(3) === 0) {
                this.outputText("\n\nWith a sudden pinch your [nipples] get smaller and smaller,"
                    + " stopping when they are roughly half their previous size");
                this.player.nippleLength /= 2;
            }

            // Hips > 10 - decrease hip size by 1-3 sizes
            if (this.player.hips.rating > 10 && this.changes < this.changeLimit && RedRiverRoot.rand(3) === 0) {
                this.outputText("\n\nYou stumble a bit as the bones in your pelvis rearrange themselves painfully. Your hips have narrowed.");
                this.player.hips.rating -= 1 + RedRiverRoot.rand(3);
                this.changes++;
            }

            // Hips < 2 - increase hip size by 1-3 sizes
            if (this.player.hips.rating < 2 && this.changes < this.changeLimit && RedRiverRoot.rand(3) === 0) {
                this.outputText("\n\nYou stumble as you feel the bones in your hips grinding, expanding your hips noticeably.");
                this.player.hips.rating += 1 + RedRiverRoot.rand(3);
                this.changes++;
            }

            // Increase tone (up to 70)
            if (this.player.tone < 70 && RedRiverRoot.rand(3) === 0) {
                this.outputText(this.player.modTone(65, 2));
            }

            // Decrease thickness (down to 35)
            if (this.player.thickness > 35 && RedRiverRoot.rand(3) === 0) {
                this.outputText(this.player.modThickness(35, 5));
            }
        }

        if (this.player.isMaleOrHerm()) {
            // Cock -> Red Panda Cock
            if (this.player.hasCock() && this.player.cocks[0].cockType !== CockTypesEnum.RED_PANDA && RedRiverRoot.rand(3) === 0 && this.changes < this.changeLimit) {
                this.outputText("\n\nThe skin surrounding your penis folds, encapsulating it and turning itself into a protective sheath."
                    + " <b>You now have a red-panda cock!</b>");
                this.player.cocks[0].cockType = CockTypesEnum.RED_PANDA;
                this.changes++;
            }
            // Cock < 6 inches - increase by 1-2 inches
            if (this.player.shortestCockLength() < 6 && RedRiverRoot.rand(3) === 0 && this.changes < this.changeLimit) {
                const increment: number = this.player.increaseCock(this.player.shortestCockIndex(), 1 + RedRiverRoot.rand(2));
                this.outputText("Your [if (cocks > 1)shortest] cock fills to its normal size, but doesn’t just stop there. Your cock feels incredibly"
                    + " tight as a few more inches of length seem to pour out from your crotch."
                    + " Your cock has gained " + increment + " inches.");
                this.changes++;
            }

            // Shrink oversized cocks
            if (this.player.biggestCockLength() > 16 && RedRiverRoot.rand(3) === 0 && this.changes < this.changeLimit) {
                const idx: number = this.player.biggestCockIndex();
                this.outputText("\n\nYou feel a tightness in your groin like someone tugging on your shaft from behind you. Once the sensation"
                    + " fades you check [if (hasLowerGarment)inside your [lowergarment]|your [multicock]] and see that your"
                    + " [if (cocks > 1)largest] [cock] has shrunk to a slightly shorter length.");
                this.player.cocks[idx].cockLength -= (RedRiverRoot.rand(10) + 5) / 10;
                if (this.player.cocks[idx].cockThickness > 3) {
                    this.outputText(" Your " + this.player.cockDescript(idx) + " definitely got a bit thinner as well.");
                    this.player.cocks[idx].cockThickness -= (RedRiverRoot.rand(4) + 1) / 10;
                }
                this.changes++;
            }

            // Cock thickness <2 - Increase cock thickness
            if (this.player.smallestCockArea() < 10 && RedRiverRoot.rand(3) === 0 && this.changes < this.changeLimit) {
                this.outputText("[if (cocks > 1) One of your cocks|Your cock] feels swollen and heavy. With a firm, but gentle, squeeze, you confirm"
                    + " your suspicions. It is definitely thicker.");
                this.player.cocks[this.player.thinnestCockIndex()].thickenCock(1.5);
                this.changes++;
            }
        }

        // Remove additional cocks
        if (this.player.cocks.length > 1 && RedRiverRoot.rand(3) === 0 && this.changes < this.changeLimit) {
            this.player.removeCock(1, 1);
            this.outputText("\n\nYou have a strange feeling as your crotch tingles.  Opening your [armor],"
                + " <b>you realize that one of your cocks have vanished completely!</b>");
            this.changes++;
        }

        // Remove additional balls/remove uniball
        if ((this.player.balls > 0 || this.player.hasStatusEffect(StatusEffects.Uniball)) && RedRiverRoot.rand(3) === 0 && this.changes < this.changeLimit) {
            if (this.player.ballSize > 2) {
                if (this.player.ballSize > 5) this.player.ballSize -= 1 + RedRiverRoot.rand(3);
                this.player.ballSize -= 1;
                this.outputText("\n\nYour scrotum slowly shrinks, settling down at a smaller size. <b>Your " + this.player.ballsDescriptLight() + " ");
                if (this.player.balls === 1 || this.player.hasStatusEffect(StatusEffects.Uniball)) this.outputText("is smaller now.</b>");
                else this.outputText("are smaller now.</b>");
                this.changes++;
            }
            else if (this.player.balls > 2) {
                this.player.balls = 2;
                // I have no idea if Uniball status effect sets balls to 1 or not so here's a just in case.
                if (this.player.hasStatusEffect(StatusEffects.Uniball)) this.player.removeStatusEffect(StatusEffects.Uniball);
                this.outputText("\n\nYour scrotum slowly shrinks until they seem to have reached a normal size. <b>You can feel as if your extra balls fused together, leaving you with a pair of balls.</b>");
                this.changes++;
            }
            else if (this.player.balls === 1 || this.player.hasStatusEffect(StatusEffects.Uniball)) {
                this.player.balls = 2;
                if (this.player.hasStatusEffect(StatusEffects.Uniball)) this.player.removeStatusEffect(StatusEffects.Uniball);
                this.outputText("\n\nYour scrotum slowly shrinks, and you feel a great pressure release in your groin. <b>Your uniball has split apart, leaving you with a pair of balls.</b>");
                this.changes++;
            }
        }

        // Ovi perk loss
        if (RedRiverRoot.rand(5) === 0) {
            this.mutations.updateOvipositionPerk(tfSource);
        }

        // ------------- Physical changes -------------
        // Ears
        if (this.player.ears.type !== Ears.RED_PANDA && this.changes < this.changeLimit && RedRiverRoot.rand(3) === 0) {
            this.outputText("\n\n[if (bakeryTalkedRoot)The warned dizziness|A sudden dizziness] seems to overcome your head. Your ears tingle,"
                + " and you’re sure you can feel the flesh on them shifting, as you gradually have trouble hearing. A couple of minutes"
                + " later the feeling stops. Curious of what has changed you go to check yourself on the stream, only to find"
                + " that they’ve changed into cute, triangular ears, covered with white fur. <b>You’ve got red-panda ears!</b>");
            this.player.ears.type = Ears.RED_PANDA;
            this.changes++;
        }

        // Remove non-cockatrice antennae
        if (this.player.hasNonCockatriceAntennae() && this.changes < this.changeLimit && RedRiverRoot.rand(3) === 0) {
            this.outputText("\n\nThe pair of antennae atop your head start losing the ability of ‘feel’ your surroundings as the root takes"
                + " effect on them. Soon they recede on your head, and in a matter of seconds, it looks like they never were there.");
            this.player.antennae.type = Antennae.NONE;
            this.changes++;
        }

        // Restore eyes, if more than two
        if (this.player.eyes.count > 2 && this.changes < this.changeLimit && RedRiverRoot.rand(4) === 0) {
            this.outputText("\n\nYou lose your vision for a moment, staying where you are to prevent tripping and hurting yourself. Thankfully,"
                + " your sight returns shortly after, only that something feels…different. After checking your visage, you notice that"
                + " <b>you now have the normal set of two human-looking eyes!</b>");
            this.player.eyes.restore();
            this.changes++;
        }

        // Hair
        // store current states first
        const hasPandaHairColor: boolean = ColorLists.RED_PANDA_HAIR.indexOf(this.player.hair.color) !== -1;
        const hasNormalHair: boolean = this.player.hair.type === Hair.NORMAL;
        const oldHairType: number = this.player.hair.type;
        if ((!hasNormalHair || this.player.hair.length === 0 || !hasPandaHairColor) && this.changes < this.changeLimit && RedRiverRoot.rand(3) === 0) {
            this.player.hair.type = Hair.NORMAL;
            if (!hasPandaHairColor)
                this.player.hair.color = RedRiverRoot.randomChoice(ColorLists.RED_PANDA_HAIR);

            if (this.player.hair.length === 0) { // player is bald
                this.player.hair.length = 1;
                this.outputText("\n\nThe familiar sensation of hair returns to your head. After looking yourself on the stream, you confirm that your"
                    + " once bald head now has normal, short [hairColor] hair.");
            } else if (hasNormalHair && !hasPandaHairColor) { // 'wrong' hair color
                this.outputText("\n\nA mild tingling on your scalp makes your check yourself on the stream. Seems like the root is changing"
                    + " your hair this time, turning it into [hair].");
            } else { // player.hair.type !== Hair.NORMAL
                switch (oldHairType) {
                    case Hair.FEATHER:
                        this.outputText("\n\nShortly after their taste fades, the roots seem to have effect. Your scalp itches and as you scratch you"
                            + " see your feathered hair begin to shed, downy feathers falling from your head until you are bald."
                            + " Alarmed by this sudden change you quickly go to examine yourself in the nearby river, relief soon washing"
                            + " over you as new [hairColor] hair begins to rapidly grow. <b>You now have [hair]</b>!");
                        break;

                    /* [INTERMOD: xianxia]
                    case Hair.GORGON:
                        player.hair.length = 1;
                        outputText("\n\nAs you finish the root, the scaled critters on your head shake wildly in displeasure. Then, a sudden heat"
                                  +" envelopes your scalp. The transformative effects of your spicy meal make themselves notorious, as the"
                                  +" writhing mess of snakes start hissing uncontrollably. Many of them go rigid, any kind of life that they"
                                  +" could had taken away by the root effects. Soon all the snakes that made your hair are limp and lifeless.");
                        outputText("\n\nTheir dead bodies are separated from you head by a scorching sensation, and start falling to the ground,"
                                  +" turning to dust in a matter of seconds. Examining your head on the stream, you realize that you have"
                                  +" a normal, healthy scalp, though devoid of any kind of hair.");
                        outputText("\n\nThe effects don’t end here, though as the familiar sensation of hair returns to your head a moment later."
                                  +" After looking yourself on the stream again, you confirm that"
                                  +" <b>your once bald head now has normal, short [hairColor] hair</b>.");
                        break;
                    */

                    case Hair.GOO:
                        this.player.hair.length = 1;
                        this.outputText("\n\nAfter having consumed the root, a lock of gooey hair falls over your forehead. When you try to"
                            + " examine it, the bunch of goo falls to the ground and evaporates. As you tilt your head to see what happened,"
                            + " more and more patches of goo start falling from your head, disappearing on the ground with the same speed."
                            + " Soon, your scalp is devoid of any kind of goo, albeit entirely bald.");
                        this.outputText("\n\nNot for long, it seems, as the familiar sensation of hair returns to your head a moment later."
                            + " After looking yourself on the stream, you confirm that"
                            + " <b>your once bald head now has normal, short [hairColor] hair</b>.");
                        break;

                    default:
                        this.outputText("\n\nA mild tingling on your scalp makes your check yourself on the stream. Seems like the root is changing"
                            + " your hair this time, <b>turning it into [hair]</b>.");
                }
            }
            this.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] = 0;
            this.changes++;
        }

        // Face
        if (this.player.face.type !== Face.RED_PANDA && this.player.ears.type === Ears.RED_PANDA && this.player.hasFur() && this.changes < this.changeLimit && RedRiverRoot.rand(3) === 0) {
            this.outputText("\n\nNumbness comes to your cheekbones and jaw, while the rest of your head is overwhelmed by a tingling sensation."
                + " Every muscle on your face tenses and shifts, while the bones and tissue rearrange, radically changing the shape"
                + " of your head. You have troubles breathing as the changes reach your nose, but you manage to see as it changes into an"
                + " animalistic muzzle. You jaw joins it and your teeth sharpen a little, not to the point of being true menacing,"
                + " but gaining unequivocally the shape of those belonging on a little carnivore.");
            this.outputText("\n\nOnce you’re face and jaw has reshaped, fur covers the whole of your head. The soft sensation is quite pleasant."
                + " It has a russet-red coloration, that turns to white on your muzzle and cheeks."
                + " Small, rounded patches of white cover the area where your eyebrows were. <b>You now have a red-panda head!</b>");
            this.player.face.type = Face.RED_PANDA;
            this.changes++;
        }

        // Arms
        if (this.player.arms.type !== Arms.RED_PANDA && this.player.ears.type === Ears.RED_PANDA && this.player.tail.type === Tail.RED_PANDA && this.changes < this.changeLimit && RedRiverRoot.rand(3) === 0) {
            this.outputText("\n\nWeakness overcomes your arms, and no matter what you do, you can’t muster the strength to raise or move them."
                + " Sighing you attribute this to the consumption of that strange root. Sitting on the ground, you wait for the limpness to"
                + " end. As you do so, you realize that the bones at your hands are changing, as well as the muscles on your arms."
                + " They’re soon covered, from the shoulders to the tip of your digits, on a layer of soft, fluffy black-brown fur."
                + " Your hands gain pink, padded paws where your palms were once, and your nails become short claws,"
                + " not sharp enough to tear flesh, but nimble enough to make climbing and exploring much easier."
                + " <b>Your arms have become like those of  a red-panda!</b>");
            this.player.arms.setType(Arms.RED_PANDA, Claws.RED_PANDA);
        }

        // Legs
        if (this.player.lowerBody.type !== LowerBody.RED_PANDA && this.player.arms.type === Arms.RED_PANDA && this.changes < this.changeLimit && RedRiverRoot.rand(4) === 0) {
            if (this.player.isTaur()) {
                this.outputText("\n\nYou legs tremble, forcing you to lie on the ground, as they don't seems to answer you anymore."
                    + " A burning sensation in them is the last thing you remember before briefly blacking out. When it subsides and you"
                    + " finally awaken, you look at them again, only to see that you’ve left with a single set of digitigrade legs,"
                    + " and a much more humanoid backside. Soon enough, the feeling returns to your reformed legs, only to come with an"
                    + " itching sensation. A thick black-brown coat of fur sprouts from them. It’s soft and fluffy to the touch."
                    + " Cute pink paw pads complete the transformation. Seems like <b>you’ve gained a set of red-panda paws!</b>");
            } else if (this.player.isNaga()) {
                this.outputText("\n\nA strange feeling in your tail makes you have to lay on the ground. Then, the feeling becomes stronger, as you"
                    + " feel an increasing pain in the middle of your coils. You gaze at them for a second, only to realize that they’re"
                    + " dividing! In a matter of seconds, they’ve reformed into a more traditional set of legs, with the peculiarity being"
                    + " that they’re fully digitigrade in shape. Soon, every scale on them falls off to leave soft [skin] behind."
                    + " That doesn’t last long, because soon a thick coat of black-brown fur covers them. It feels soft and fluffy to the"
                    + " touch. Cute pink paw pads complete the transformation. Seems like <b>you’ve gained a set of red-panda paws!</b>");
            } else if (this.player.isGoo()) {
                this.outputText("\n\nThe blob that forms your lower body becomes suddenly rigid under the rhizome effects, forcing you to stay still"
                    + " until the transformation ends. Amazingly, what was once goo turns into flesh and skill in mere seconds, thus leaving"
                    + " you with a very human-like set of legs and feet.");
                this.outputText("\n\nIt doesn’t stop here as a feeling of unease forces you to sit on a nearby rock, as you feel something within your"
                    + " newly regained feet is changing. Numbness overcomes them, as muscles and bones change, softly shifting,"
                    + " melding and rearranging themselves. For a second you feel that they’re becoming goo again, but after a couple of"
                    + " minutes, they leave you with a set of digitigrade legs with pink pawpads, ending in short black claws and covered"
                    + " in a thick layer of black-brown fur. It feels quite soft and fluffy. <b>You’ve gained a set of red-panda paws!</b>");
            } else {
                this.outputText("\n\nA feeling of unease forces your to sit on a nearby rock, as you feel something within your [feet] is changing."
                    + " Numbness overcomes them, as muscles and bones change, softly shifting, melding and rearranging themselves."
                    + " After a couple of minutes, they leave you with a set of digitigrade legs with pink pawpads,"
                    + " ending in short black claws and covered in a thick layer of black-brown fur. It feels quite soft and fluffy."
                    + " <b>You’ve gained a set of red-panda paws!</b>");
            }
            this.player.lowerBody.type = LowerBody.RED_PANDA;
            this.player.lowerBody.legCount = 2;
            this.changes++;
        }

        // Tail
        if (this.player.tail.type !== Tail.RED_PANDA && this.changes < this.changeLimit && RedRiverRoot.rand(4) === 0) {
            if (this.player.hasMultiTails()) {
                this.outputText("\n\nYour tails seem to move on their own, tangling together in a single mass. Before you can ever feel it happening,"
                    + " you realize that they’re merging! An increased sensation of heat, not unlike the flavor of the roots,"
                    + " rushes through your body, and once that it fades, you realize that you now have a single tail.");
                this.outputText("\n\nThe process doesn’t stop here though, as the feel of that spicy root returns, but now the heat is felt only in"
                    + " your tail, as it shakes wildly while it elongates and becomes more bushy. Soon it has become almost as long as you."
                    + " A very thick mass of soft, fluffy furs covers it in a matter of seconds. It acquires a lovely ringed pattern of"
                    + " red-russet and copperish-orange.");
                this.outputText("\n\nWhen the effects finally subside, you decide to test the tail, making it coil around your body,"
                    + " realizing soon that you can control its movements with ease, and that its fur feels wonderful to the touch."
                    + " Anyways, <b>you now have a long, bushy, red-panda tail!</b>");
            } else if (this.player.tail.type === Tail.NONE) {
                this.outputText("\n\nFeeling an uncomfortable sensation on your butt, you stretch yourself, attributing it to having sat on a"
                    + " rough surface. A burning sensation runs through your body, similar to the one that you had after eating the root."
                    + " When it migrates to your back, your attention goes to a mass of fluff that has erupted from your backside."
                    + " Before you can check it properly, it seems to move on its own, following the heated sensation that now pulsates"
                    + " through your body, and when the heated pulses  seem to have stopped, it has become a long, fluffy tube");
                this.outputText("\n\nShortly after, the feel of that spicy root returns, but now the heat is felt only in your tail,"
                    + " which shakes wildly while it elongates and becomes more bushy. Soon it has become almost as long as you."
                    + " A very thick mass of soft, fluffy furs covers it in a matter of seconds. It acquires a lovely ringed pattern"
                    + " of red-russet and copperish-orange.");
                this.outputText("\n\nWhen the effects finally subside, you decide to test the tail, making it coil around your body,"
                    + " realizing soon that you can control its movements with ease, and that its fur feels wonderful at the touch."
                    + " Anyways, <b>you now have a long, bushy, red-panda tail!</b>");
            } else if ([Tail.BEE_ABDOMEN, Tail.SPIDER_ABDOMEN].indexOf(this.player.tail.type) !== -1) {
                this.outputText("\n\nYour insectile backside seems affected by the root properties, as your venom production suddenly stops."
                    + " The flesh within the abdomen retracts into your backside, the chiting covering falling, leaving exposed a layer"
                    + " of soft, bare skin. When the abdomen disappears, your left with a comically sized butt,"
                    + " that soon reverts to its usual size.");
                this.outputText("\n\nThe root keeps doing its thing, as you feel an uncomfortable sensation on your butt. A burning sensation runs"
                    + " through your body, similar to the one that you had after eating the root. When it migrates to your back,"
                    + " your attention goes to a mass of fluff that has erupted from your backside. Before you can check it properly,"
                    + " it seems to move on its own, following the heated sensation that now pulsates through your body,"
                    + " and when the heated pulses  seem to have stopped, it has become a long, fluffy tube,"
                    + " quite different from your former abdomen.");
                this.outputText("\n\nShortly after, the feel of that spicy root returns, but now the heat is felt only in your tail,"
                    + " which shakes wildly while it elongates and becomes more bushy. Soon it has become almost as long as you."
                    + " A very thick mass of soft, fluffy furs covers it in a matter of seconds."
                    + " It acquires a lovely ringed pattern of red-russet and copperish-orange.");
                this.outputText("\n\nWhen the effects finally subside, you decide to test the tail, making it coil around your body,"
                    + " realizing soon that you can control its movements with ease, and that its fur feels wonderful at the touch."
                    + " Anyways, <b>you now have a long, bushy, red-panda tail!</b>");
            } else {
                this.outputText("\n\nThe feel of that spicy root returns, but now the heat is felt on your tail, that shakes wildly while it elongates"
                    + " and becomes more bushy. Soon it has become almost as long as you. A very thick mass of soft, fluffy furs covers it"
                    + " in a matter of seconds. It acquires a lovely ringed pattern of red-russet and copperish-orange.");
                this.outputText("\n\nWhen the effects finally subside, you decide to test the tail, making it coil around your body,"
                    + " realizing soon that you can control their moves with easy, and that its fur feels wonderful at the touch."
                    + " Anyways, <b>you now have a long, bushy, red-panda tail!</b>");
            }
            this.player.tail.setAllProps({ type: Tail.RED_PANDA });
            this.changes++;
        }

        // SKin
        const setFurrySkin = (): void => {
            this.player.skin.type = Skin.FUR;
            this.player.skin.adj = "";
            this.player.skin.desc = "fur";
            this.player.skin.furColor = "russet";
            this.player.underBody.type = UnderBody.FURRY;
            this.player.copySkinToUnderBody({ furColor: "black" });
            this.changes++;
        };

        // Fix the underBody, if the skin is already furred
        if (this.player.skin.type === Skin.FUR && this.player.underBody.type !== UnderBody.FURRY && this.changes < this.changeLimit && RedRiverRoot.rand(3) === 0) {
            this.outputText("\n\nLooks, like the root has changed your fur colors."
                + " <b>You’re now covered from head to toe with russet-red fur with black fur on your underside!</b>");
            setFurrySkin();
        }

        if (this.player.skin.type !== Skin.FUR && this.player.arms.type === Arms.RED_PANDA && this.player.lowerBody.type === LowerBody.RED_PANDA && this.changes < this.changeLimit && RedRiverRoot.rand(4) === 0) {
            if (this.player.hasPlainSkin()) {
                if (["latex", "rubber"].indexOf(this.player.skin.adj) === -1) {
                    this.outputText("\n\nYou start to scratch your [skin], as an uncomfortable itching overcomes you. It’s quite annoying,"
                        + " like the aftermath of being bitten by a bug, only that it’s all over at the same time.");
                } else { // if rubbery
                    this.outputText("\n\nYour usually oily and rubbery skin suddenly feels a bit dry. Thinking that maybe the reason could be the dry"
                        + " weather in the wastelands, you rush to the stream, washing your skin in the refreshing water.");
                    this.outputText("\n\nIt has the opposite effect of the one you intended, and you watch as a layer of [skinTone] colored goopy"
                        + " rubber falls from your arm. Soon all the rubber on your arm melts off, leaving behind a layer of healthy,"
                        + " normal skin. The process continues over the rest of your body, and before you can react your body is covered"
                        + " in a layer of fresh new [skinTone] skin, the odd sensation fading.");
                    this.outputText("\n\nNot for long however, as an uncomfortable itching overcomes you. It’s quite annoying, like the aftermath"
                        + " of being bitten for a bug, only all over your body at the same time.");
                }
            }

            if (this.player.hasScales()) {
                this.outputText("\n\nThe layer of scales covering your body feels weird for a second, almost looking like they’re moving on they own,"
                    + " and that is when you realize that they changing!");
                this.outputText("\n\nThe feeling is quite odd, a bit of an itching from the place where they join your skin, that quickly becomes more"
                    + " intense as their transformation advances. Then a bunch of [skinTone] scales  fall from your arm. Soon all the scales"
                    + " on your arm fall off, leaving behind a layer of healthy, normal skin. The process continues overs the rest of"
                    + " your body, and before long you are covered in a layer of [skinTone] skin.");
                this.outputText("\n\nNot for long though, as an uncomfortable itching overcomes you. It’s quite annoying, like the aftermath of being"
                    + " bitten for a bug, only all over your body at the same time.");
            }

            if (this.player.hasGooSkin()) {
                this.outputText("\n\nYour usually wet and gooey skin suddenly a bit dry. Thinking that maybe the reason could be the dry weather"
                    + " in the wastelands, you rush to the stream, washing your skin on the refreshing water.");
                this.outputText("\n\nIt has the opposite effect of the one you intended, and you watch as a layer of [skinTone] colored slime falls"
                    + " from your arm. Alarmed, you try to put it back, but to no avail. Soon all the goo on your arm slides offleaving"
                    + " behind a layer of healthy, normal skin. The process continues over the rest of your body, and before you can react"
                    + " your body is covered in a layer of fresh new [skinTone] skin, the odd sensation fading as your core is expelled"
                    + " from your now perfectly solid body.");
                this.outputText("\n\nThis doesn’t last long though, as an uncomfortable itching overcomes you. It’s quite annoying,"
                    + " like the aftermath of being bitten for a bug, only all over your body  at the same time.");
            }

            this.outputText("\n\nSoon you realize that the sensation is coming from under your skin. After rubbing one of your arms in annoyance,"
                + " you feel something different, and when you lay your eyes on it, you realize that a patch of fur is growing over"
                + " your skin. Then you spot similar patches over your legs, chest and back. Fur grows over your body,"
                + " patches joining and closing over your skin, and in a matter of seconds, your entire body is covered with"
                + " a lovely coat of thick fur. The soft and fluffy sensation is quite pleasant to the touch.");
            this.outputText("\n<b>Seems like you’re now covered from head to toe with russet-red fur with black fur on your underside!</b>");
            setFurrySkin();
        }

        // FAILSAFE CHANGE
        if (this.changes === 0) {
            if (RedRiverRoot.rand(100) === 0) {
                this.outputText("\n\nSeems like nothing else happened. Maybe the root lost its effect?");
            } else {
                this.outputText("\n\nDespite how spicy it was, the root was nevertheless nutritious, as you can confirm by feeling how your body feels"
                    + " now much more invigorated.\n");
                this.player.HPChange(250, true);
                this.dynStats("lus", 3);
            }
        }

        this.player.refillHunger(20);
        this.game.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;
        return false;
    }
}
