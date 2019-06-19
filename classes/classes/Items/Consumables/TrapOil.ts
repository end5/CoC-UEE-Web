import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";
import { StatusEffects } from "../../StatusEffects";
import { PerkLib } from "../../PerkLib";
import { Neck } from "../../BodyParts/Neck";
import { Eyes } from "../../BodyParts/Eyes";
import { Wings } from "../../BodyParts/Wings";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

/**
 * Antlion? transformative item.
 */
export class TrapOil extends Consumable {
    public constructor() {
        super("TrapOil", "TrapOil", "a vial of trap oil", ConsumableLib.DEFAULT_VALUE, "A round, opaque glass vial filled with a clear, viscous fluid.  It has a symbol inscribed on it, a circle with a cross and arrow pointing out of it in opposite directions.  It looks and smells entirely innocuous.");
    }

    public useItem(): boolean {
        const tfSource: string = "trapOil";
        let temp: number = 0;
        this.mutations.initTransformation([2, 3, 3]);
        this.clearOutput();
        this.outputText("You pour some of the oil onto your hands and ");
        if (this.player.cor < 30) this.outputText("hesitantly ");
        else if (this.player.cor > 70) this.outputText("eagerly ");
        this.outputText("rub it into your arms and chest.  The substance is warm, coating and ever so slightly numbing; it quickly sinks into your skin, leaving you feeling smooth and sleek.");

        // Speed Increase:
        if (this.player.spe100 < 100 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou feel fleet and lighter on your toes; you sense you could dodge, dart or skip away from anything.");
            this.dynStats("spe", 1);
        }
        // Strength Loss:
        else if (this.player.str100 > 40 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nA sense of helplessness settles upon you as your limbs lose mass, leaving you feeling weaker and punier.");
            this.dynStats("str", -1);
        }
        // Sensitivity Increase:
        if (this.player.sens100 < 70 && this.player.hasCock() && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nA light breeze brushes over you and your skin tingles.  You have become more sensitive to physical sensation.");
            this.dynStats("sen", 5);
        }
        // Libido Increase:
        if (this.player.lib100 < 70 && this.player.hasVagina() && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou feel your blood quicken and rise, and a desire to... hunt builds within you.");
            this.dynStats("lib", 2);
            if (this.player.lib100 < 30) this.dynStats("lib", 2);
        }
        // Body Mass Loss:
        if (this.player.thickness > 40 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou feel an odd tightening sensation in your midriff, as if you were becoming narrower and lither.  You frown downwards, and then turn your arms around, examining them closely.  Is it just you or have you lost weight?");
            this.player.modThickness(40, 3);
            this.changes++;
        }

        // Thigh Loss: (towards “girly”)
        if (this.player.hips.rating >= 10 && rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou touch your thighs speculatively.  It's not just your imagination; you've lost a bit of weight around your waist.");
            this.player.hips.rating--;
            if (this.player.hips.rating > 15) this.player.hips.rating -= 2 + rand(3);
            this.changes++;
        }
        // Thigh Gain: (towards “girly”)
        if (this.player.hips.rating < 6 && rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou touch your thighs speculatively.  You think you may have gained a little weight around your waist.");
            this.player.hips.rating++;
            this.changes++;
        }
        // Breast Loss: (towards A cup)
        if (this.player.biggestTitSize() > 1 && rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou gasp as you feel a compressing sensation in your chest and around your [fullChest].  The feeling quickly fades however, leaving you feeling like you have lost a considerable amount of weight from your upper body.");
            temp = 0;
            while (temp < this.player.bRows()) {
                if (this.player.breastRows[temp].breastRating > 70) this.player.breastRows[temp].breastRating -= rand(3) + 15;
                else if (this.player.breastRows[temp].breastRating > 50) this.player.breastRows[temp].breastRating -= rand(3) + 10;
                else if (this.player.breastRows[temp].breastRating > 30) this.player.breastRows[temp].breastRating -= rand(3) + 7;
                else if (this.player.breastRows[temp].breastRating > 15) this.player.breastRows[temp].breastRating -= rand(3) + 4;
                else this.player.breastRows[temp].breastRating -= 2 + rand(2);
                if (this.player.breastRows[temp].breastRating < 1) this.player.breastRows[temp].breastRating = 1;
                temp++;
            }
            this.changes++;
        }
        // Breast Gain: (towards A cup)
        if (this.player.biggestTitSize() < 1 || this.player.breastRows[0].breastRating < 1 && rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou feel a vague swelling sensation in your [fullChest], and you frown downwards.  You seem to have gained a little weight on your chest.  Not enough to stand out, but- you cup yourself carefully- certainly giving you the faintest suggestion of boobs.");
            this.player.breastRows[0].breastRating = 1;
            if (this.player.bRows() > 1) {
                temp = 1;
                while (temp < this.player.bRows()) {
                    if (this.player.breastRows[temp].breastRating < 1) this.player.breastRows[temp].breastRating = 1;
                    temp++;
                }
            }
            this.changes++;
        }
        // Penis Reduction towards 3.5 Inches:
        if (this.player.longestCockLength() >= 3.5 && this.player.hasCock() && rand(2) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou flinch and gasp as your " + this.player.multiCockDescriptLight() + " suddenly become");
            if (this.player.cockTotal() === 1) this.outputText("s");
            this.outputText(" incredibly sensitive and retract into your body.  Anxiously you pull down your underclothes to examine your nether regions.  To your relief ");
            if (this.player.cockTotal() === 1) this.outputText("it is");
            else this.outputText("they are");
            this.outputText(" still present, and as you touch ");
            if (this.player.cockTotal() === 1) this.outputText("it");
            else this.outputText("them");
            this.outputText(", the sensitivity fades, however - a blush comes to your cheeks - ");
            if (this.player.cockTotal() === 1) this.outputText("it seems");
            else this.outputText("they seem");
            this.outputText(" to have become smaller.");
            temp = 0;
            while (temp < this.player.cockTotal()) {
                if (this.player.cocks[temp].cockLength >= 3.5) {
                    // Shrink said cock
                    if (this.player.cocks[temp].cockLength < 6 && this.player.cocks[temp].cockLength >= 2.9) {
                        this.player.cocks[temp].cockLength -= .5;
                        if (this.player.cocks[temp].cockThickness * 6 > this.player.cocks[temp].cockLength) this.player.cocks[temp].cockThickness -= .2;
                        if (this.player.cocks[temp].cockThickness * 8 > this.player.cocks[temp].cockLength) this.player.cocks[temp].cockThickness -= .2;
                        if (this.player.cocks[temp].cockThickness < .5) this.player.cocks[temp].cockThickness = .5;
                    }
                    this.player.cocks[temp].cockLength -= 0.5;
                    this.player.increaseCock(temp, Math.round(this.player.cocks[temp].cockLength * 0.33) * -1);
                }
                temp++;
            }
            this.changes++;
        }
        // Testicle Reduction:
        if (this.player.balls > 0 && this.player.hasCock() && (this.player.ballSize > 1 || !this.player.hasStatusEffect(StatusEffects.Uniball)) && rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou feel a delicate tightening sensation around your [balls].  The sensation upon this most sensitive part of your anatomy isn't painful, but the feeling of your balls getting smaller is intense enough that you stifle anything more than a sharp intake of breath only with difficulty.");
            this.player.ballSize--;
            if (this.player.ballSize > 8) this.player.ballSize--;
            if (this.player.ballSize > 10) this.player.ballSize--;
            if (this.player.ballSize > 12) this.player.ballSize--;
            if (this.player.ballSize > 15) this.player.ballSize--;
            if (this.player.ballSize > 20) this.player.ballSize--;
            // Testicle Reduction final:
            if (this.player.ballSize < 1 && !this.player.hasStatusEffect(StatusEffects.Uniball)) {
                this.outputText("  You whimper as once again, your balls tighten and shrink.  Your eyes widen when you feel the gentle weight of your testicles pushing against the top of your [hips], and a few hesitant swings of your rear confirm what you can feel - you've tightened your balls up so much they no longer hang beneath your " + this.player.multiCockDescriptLight() + ", but press perkily upwards.  Heat ringing your ears, you explore your new sack with a careful hand.  You are deeply grateful you apparently haven't reversed puberty, but you discover that though you still have " + TrapOil.num2Text(this.player.balls) + ", your balls now look and feel like one: one cute, tight little sissy parcel, its warm, insistent pressure upwards upon the joining of your thighs a never-ending reminder of it.");
                // [Note: Balls description should no longer say “swings heavily beneath”.  For simplicity's sake sex scenes should continue to assume two balls]
                this.player.ballSize = 1;
                this.player.createStatusEffect(StatusEffects.Uniball, 0, 0, 0, 0);
            }
            else if (this.player.ballSize < 1) this.player.ballSize = 1;
            this.changes++;
        }
        // Anal Wetness Increase:
        if (this.player.ass.analWetness < 5 && rand(4) === 0 && this.changes < this.changeLimit) {
            if (this.player.ass.analWetness < 4) this.outputText("\n\nYour eyes widen in shock as you feel oily moisture bead out of your [asshole].  Your asshole has become wetter and more pliable.");
            // Anal Wetness Increase Final (always loose):
            else this.outputText("\n\nYou moan as clear, odorless oil dribbles out of your [asshole], this time in enough quantity to stain your [armor].  Your back passage feels incredibly sensitive, wet and accommodating.  Your ass is ready to be plowed by anything, and always will be.");
            this.player.ass.analWetness++;
            // buttChange(30,false,false,false);
            if (this.player.ass.analLooseness < 3) this.player.ass.analLooseness++;
            this.changes++;
            this.dynStats("sen", 2);
        }
        // Fertility Decrease:
        if (this.player.hasVagina() && rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nThe vague numbness in your skin sinks slowly downwards, and you put a hand on your lower stomach as the sensation centers itself there.  ");
            this.dynStats("sen", -2);
            // High fertility:
            if (this.player.fertility >= 30) this.outputText("It feels like your overcharged reproductive organs have simmered down a bit.");
            // Average fertility:
            else if (this.player.fertility >= 5) this.outputText("You feel like you have dried up a bit inside; you are left feeling oddly tranquil.");
            // [Low/No fertility:
            else {
                this.outputText("Although the numbness makes you feel serene, the trap oil has no effect upon your ");
                if (this.player.fertility > 0) this.outputText("mostly ");
                this.outputText("sterile system.");
                // [Low/No fertility + Trap/Corruption  >70:
                if (this.player.isCorruptEnough(70)) this.outputText("  For some reason the fact that you cannot function as nature intended makes you feel helpless and submissive.  Perhaps the only way to be a useful creature now is to find a dominant, fertile being willing to plow you full of eggs? You shake the alien, yet oddly alluring thought away.");
            }
            this.player.fertility -= 1 + rand(3);
            if (this.player.fertility < 4) this.player.fertility = 4;
            this.changes++;
        }
        // Male Effects
        if (this.player.gender === 1) {
            // Femininity Increase Final (max femininity allowed increased by +10):
            if (rand(4) === 0 && this.changes < this.changeLimit) {
                if (this.player.femininity < 70 && this.player.femininity >= 60) {
                    this.outputText("\n\nYou laugh as you feel your features once again soften, before stopping abruptly.  Your laugh sounded more like a girly giggle than anything else.  Feeling slightly more sober, you touch the soft flesh of your face prospectively.  The trap oil has changed you profoundly, making your innate maleness... difficult to discern, to say the least.  You suspect you could make yourself look even more like a girl now if you wanted to.");
                    if (this.player.findPerk(PerkLib.Androgyny) < 0) {
                        this.player.createPerk(PerkLib.Androgyny, 0, 0, 0, 0);
                        this.outputText("\n\n(<b>Perk Gained: Androgyny</b>)");
                    }
                    this.player.femininity += 10;
                    if (this.player.femininity > 70) this.player.femininity = 70;
                    this.changes++;
                }
                // Femininity Increase:
                else {
                    this.outputText("\n\nYour face softens as your features become more feminine.");
                    this.player.femininity += 10;
                    this.changes++;
                }
            }
            // Muscle tone reduction:
            if (this.player.tone > 20 && rand(4) === 0 && this.changes < this.changeLimit) {
                this.outputText("\n\nYou sink a finger into your arm inquiringly.  You seem to have lost some of your muscle definition, leaving you looking softer.");
                this.player.tone -= 10;
                this.changes++;
            }
        }
        // Female Effects
        else if (this.player.gender === 2) {
            // Masculinity Increase:
            if (this.player.femininity > 30 && rand(4) === 0 && this.changes < this.changeLimit) {
                this.player.femininity -= 10;
                if (this.player.femininity < 30) {
                    this.player.femininity = 30;
                    // Masculinity Increase Final (max masculinity allowed increased by +10):
                    this.outputText("\n\nYou laugh as you feel your features once again soften, before stopping abruptly.  Your laugh sounded more like a boyish crow than anything else.  Feeling slightly more sober, you touch the defined lines of your face prospectively.  The trap oil has changed you profoundly, making your innate femaleness... difficult to discern, to say the least.  You suspect you could make yourself look even more like a boy now if you wanted to.");
                    if (this.player.findPerk(PerkLib.Androgyny) < 0) {
                        this.player.createPerk(PerkLib.Androgyny, 0, 0, 0, 0);
                        this.outputText("\n\n(<b>Perk Gained: Androgyny</b>)");
                    }
                }
                else {
                    this.outputText("\n\nYour face becomes more set and defined as your features turn more masculine.");
                }
                this.changes++;
            }
            // Muscle tone gain:
            if (this.player.tone < 80 && rand(4) === 0 && this.changes < this.changeLimit) {
                this.outputText("\n\nYou flex your arm in interest.  Although you have become thinner, your muscles seem to have become more defined.");
                this.player.tone += 10;
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
        // Nipples Turn Black:
        if (!this.player.hasStatusEffect(StatusEffects.BlackNipples) && rand(6) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nA tickling sensation plucks at your nipples and you cringe, trying not to giggle.  Looking down you are in time to see the last spot of flesh tone disappear from your [nipples].  They have turned an onyx black!");
            this.player.createStatusEffect(StatusEffects.BlackNipples, 0, 0, 0, 0);
            this.changes++;
        }
        // Remove odd eyes
        if ((this.player.eyes.type === Eyes.FOUR_SPIDER_EYES || this.player.eyes.type == Eyes.SPIDER) && rand(2) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou blink and stumble, a wave of vertigo threatening to pull your " + this.player.feet() + " from under you.  As you steady and open your eyes, you realize something seems different.  Your vision is changed somehow. <b>Your arachnid eyes are gone! You have normal, humanoid eyes again.</b>");
            this.player.eyes.type = Eyes.HUMAN;
            this.player.eyes.count = 2;
            this.changes++;
        }
        // PC Trap Effects
        if (this.player.eyes.type !== Eyes.BLACK_EYES_SAND_TRAP && rand(4) === 0 && this.changes < this.changeLimit) {
            this.player.eyes.type = Eyes.BLACK_EYES_SAND_TRAP;
            // Eyes Turn Black:
            this.outputText("\n\nYou blink, and then blink again.  It feels like something is irritating your eyes.  Panic sets in as black suddenly blooms in the corner of your left eye and then your right, as if drops of ink were falling into them.  You calm yourself down with the thought that rubbing at your eyes will certainly make whatever is happening to them worse; through force of will you hold your hands behind your back and wait for the strange affliction to run its course.  The strange inky substance pools over your entire vision before slowly fading, thankfully taking the irritation with it.  As soon as it goes you stride quickly over to the stream and stare at your reflection.  <b>Your pupils, your irises, your entire eye has turned a liquid black</b>, leaving you looking vaguely like the many half insect creatures which inhabit these lands.  You find you are merely grateful the change apparently hasn't affected your vision.");
            this.changes++;
        }
        // Vagina Turns Black:
        if (this.player.hasVagina() && this.player.vaginaType() !== 5 && rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYour [vagina] feels... odd.  You undo your clothes and gingerly inspect your nether regions.  The tender pink color of your sex has disappeared, replaced with smooth, marble blackness starting at your lips and working inwards.");
            // (Wet:
            if (this.player.wetness() >= 3) this.outputText("  Your natural lubrication makes it gleam invitingly.");
            // (Corruption <50:
            if (this.player.cor < 50) this.outputText("  After a few cautious touches you decide it doesn't feel any different- it does certainly look odd, though.");
            else this.outputText("  After a few cautious touches you decide it doesn't feel any different - the sheer bizarreness of it is a big turn on though, and you feel it beginning to shine with anticipation at the thought of using it.");
            this.outputText("  <b>Your vagina is now ebony in color.</b>");
            this.dynStats("sen", 2, "lus", 10);
            this.player.vaginaType(5);
            this.changes++;
        }
        // Dragonfly Wings:
        if (this.player.wings.type !== Wings.GIANT_DRAGONFLY && rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou scream and fall to your knees as incredible pain snags at your shoulders, as if needle like hooks were being sunk into your flesh just below your shoulder blades.  After about five seconds of white hot, keening agony it is with almost sexual relief that something splits out of your upper back.  You clench the dirt as you slide what feel like giant leaves of paper into the open air.  Eventually the sensation passes and you groggily get to your feet.  You can barely believe what you can see by craning your neck behind you - <b>you've grown a set of four giant dragonfly wings</b>, thinner, longer and more pointed than the ones you've seen upon the forest bee girls, but no less diaphanous and beautiful.  You cautiously flex the new muscle groups in your shoulder blades and gasp as your new wings whirr and lift you several inches off the ground.  What fun this is going to be!");
            // Wings Fall Out: You feel a sharp pinching sensation in your shoulders and you cringe slightly.  Your former dragonfly wings make soft, papery sounds as they fall into the dirt behind you.
            this.changes++;
            this.player.wings.type = Wings.GIANT_DRAGONFLY;
        }
        if (this.changes === 0) {
            this.outputText("\n\nWell... that didn't amount to much.");
        }
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;

        return false;
    }
}
