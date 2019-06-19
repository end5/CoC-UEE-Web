import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";
import { Hair } from "../../BodyParts/Hair";
import { Neck } from "../../BodyParts/Neck";
import { StatusEffects } from "../../StatusEffects";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { Wings } from "../../BodyParts/Wings";
import { RearBody } from "../../BodyParts/RearBody";
import { Antennae } from "../../BodyParts/Antennae";
import { Eyes } from "../../BodyParts/Eyes";
import { Face } from "../../BodyParts/Face";
import { Skin } from "../../BodyParts/Skin";
import { ColorLists } from "../../lists/ColorLists";
import { Ears } from "../../BodyParts/Ears";
import { PerkLib } from "../../PerkLib";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

/**
 * Goblin transformative item.
 */
export class GoblinAle extends Consumable {
    public constructor() {
        super("Gob.Ale", "Gob.Ale", "a flagon of potent goblin ale", ConsumableLib.DEFAULT_VALUE, "This sealed flagon of 'Goblin Ale' sloshes noisily with alcoholic brew.  Judging by the markings on the flagon, it's a VERY strong drink, and not to be trifled with.");
    }

    public useItem(): boolean {
        const tfSource: string = "goblinAle";
        this.player.slimeFeed();
        this.mutations.initTransformation([2, 3, 4, 5]);
        this.clearOutput();
        this.outputText("You drink the ale, finding it to have a remarkably smooth yet potent taste.  You lick your lips and sneeze, feeling slightly tipsy.");
        this.dynStats("lus", 15);
        // Stronger
        if (this.player.str100 > 50) {
            this.dynStats("str", -1);
            if (this.player.str100 > 70) this.dynStats("str", -1);
            if (this.player.str100 > 90) this.dynStats("str", -2);
            this.outputText("\n\nYou feel a little weaker, but maybe it's just the alcohol.");
        }
        /// Less tough
        if (this.player.tou100 > 50) {
            this.outputText("\n\nGiggling, you poke yourself, which only makes you giggle harder when you realize how much softer you feel.");
            this.dynStats("tou", -1);
            if (this.player.tou100 > 70) this.dynStats("tou", -1);
            if (this.player.tou100 > 90) this.dynStats("tou", -2);
        }
        // antianemone corollary:
        if (this.changes < this.changeLimit && this.player.hair.type === 4 && rand(2) === 0) {
            // -insert anemone hair removal into them under whatever criteria you like, though hair removal should precede abdomen growth; here's some sample text:
            this.outputText("\n\nAs you down the potent ale, your head begins to feel heavier - and not just from the alcohol!  Reaching up, you notice your tentacles becoming soft and somewhat fibrous.  Pulling one down reveals that it feels smooth, silky, and fibrous; you watch as it dissolves into many thin, hair-like strands.  <b>Your hair is now back to normal!</b>");
            this.player.hair.type = Hair.NORMAL;
            this.changes++;
        }
        // Shrink
        if (rand(2) === 0 && this.player.tallness > 48) {
            this.changes++;
            this.outputText("\n\nThe world spins, and not just from the strength of the drink!  Your viewpoint is closer to the ground.  How fun!");
            this.player.tallness -= (1 + rand(5));
        }
        // Speed boost
        if (rand(3) === 0 && this.player.spe100 < 50 && this.changes < this.changeLimit) {
            this.dynStats("spe", 1 + rand(2));
            this.outputText("\n\nYou feel like dancing, and stumble as your legs react more quickly than you'd think.  Is the alcohol slowing you down or are you really faster?  You take a step and nearly faceplant as you go off balance.  It's definitely both.");
        }
        // Neck restore
        if (this.player.neck.type != Neck.NORMAL && this.changes < this.changeLimit && rand(4) == 0) this.mutations.restoreNeck(tfSource);
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && rand(5) == 0) this.mutations.restoreRearBody(tfSource);
        // Ovi perk loss
        if (rand(5) === 0) {
            this.mutations.updateOvipositionPerk(tfSource);
        }
        // Restore arms to become human arms again
        if (rand(4) === 0) {
            this.mutations.restoreArms(tfSource);
        }
        // SEXYTIEMS
        // Multidick killa!
        if (this.player.cocks.length > 1 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\n");
            this.player.killCocks(1);
            this.changes++;
        }
        // Boost vaginal capacity without gaping
        if (this.changes < this.changeLimit && rand(3) === 0 && this.player.hasVagina() && this.player.statusEffectv1(StatusEffects.BonusVCapacity) < 40) {
            if (!this.player.hasStatusEffect(StatusEffects.BonusVCapacity)) this.player.createStatusEffect(StatusEffects.BonusVCapacity, 0, 0, 0, 0);
            this.player.addStatusValue(StatusEffects.BonusVCapacity, 1, 5);
            this.outputText("\n\nThere is a sudden... emptiness within your " + this.player.vaginaDescript(0) + ".  Somehow you know you could accommodate even larger... insertions.");
            this.changes++;
        }
        // Boost fertility
        if (this.changes < this.changeLimit && rand(4) === 0 && this.player.fertility < 40 && this.player.hasVagina()) {
            this.player.fertility += 2 + rand(5);
            this.changes++;
            this.outputText("\n\nYou feel strange.  Fertile... somehow.  You don't know how else to think of it, but you're ready to be a mother.");
        }
        // Shrink primary dick to no longer than 12 inches
        else if (this.player.cocks.length === 1 && rand(2) === 0 && this.changes < this.changeLimit && !this.flags[kFLAGS.HYPER_HAPPY]) {
            if (this.player.cocks[0].cockLength > 12) {
                this.changes++;
                let temp3: number = 0;
                this.outputText("\n\n");
                // Shrink said cock
                if (this.player.cocks[0].cockLength < 6 && this.player.cocks[0].cockLength >= 2.9) {
                    this.player.cocks[0].cockLength -= .5;
                    temp3 -= .5;
                }
                temp3 += this.player.increaseCock(0, (rand(3) + 1) * -1);
                this.player.lengthChange(temp3, 1);
            }
        }
        // GENERAL APPEARANCE STUFF BELOW
        // REMOVAL STUFF
        // Removes wings!
        if ((this.player.wings.type != Wings.NONE) && this.changes < this.changeLimit && rand(4) === 0) {
            if (this.player.rearBody.type == RearBody.SHARK_FIN) {
                this.outputText("\n\nYour back tingles, feeling lighter.  Something lands behind you with a 'thump', and when you turn to look, you"
                    + " see your fin has fallen off.  This might be the best (and worst) booze you've ever had!"
                    + "  <b>You no longer have a fin!</b>");
                this.player.rearBody.restore();
            } else {
                this.outputText("\n\nYour shoulders tingle, feeling lighter.  Something lands behind you with a 'thump', and when you turn to look you"
                    + " see your wings have fallen off.  This might be the best (and worst) booze you've ever had!"
                    + "  <b>You no longer have wings!</b>");
            }
            this.player.wings.restore();
            this.changes++;
        }
        // Removes antennae!
        if (this.player.antennae.type != Antennae.NONE && this.changes < this.changeLimit && rand(3) === 0) {
            this.mutations.removeAntennae();
        }
        // Remove odd eyes
        if (this.changes < this.changeLimit && rand(5) === 0 && this.player.eyes.type > Eyes.HUMAN) {
            if (this.player.eyes.type === Eyes.BLACK_EYES_SAND_TRAP) {
                this.outputText("\n\nYou feel a twinge in your eyes and you blink.  It feels like black cataracts have just fallen away from you, and you know without needing to see your reflection that your eyes have gone back to looking human.");
            }
            else {
                this.outputText("\n\nYou blink and stumble, a wave of vertigo threatening to pull your " + this.player.feet() + " from under you.  As you steady and open your eyes, you realize something seems different.  Your vision is changed somehow.");
                if (this.player.eyes.type === Eyes.FOUR_SPIDER_EYES || this.player.eyes.type === Eyes.SPIDER) this.outputText("  Yourarachnid eyes are gone!</b>");
                this.outputText("  <b>You have normal, humanoid eyes again.</b>");
            }
            this.player.eyes.type = Eyes.HUMAN;
            this.player.eyes.count = 2;
            this.changes++;
        }
        // -Remove extra breast rows
        if (this.changes < this.changeLimit && this.player.bRows() > 1 && rand(3) === 0) {
            this.mutations.removeExtraBreastRow(tfSource);
        }
        // Skin/fur
        if (!this.player.hasPlainSkin() && this.changes < this.changeLimit && rand(4) === 0 && this.player.face.type === Face.HUMAN) {
            if (this.player.hasFur()) this.outputText("\n\nYour fur itches incessantly, so you start scratching it.  It starts coming off in big clumps before the whole mess begins sloughing off your body.  In seconds, your skin is nude.  <b>You've lost your fur!</b>");
            if (this.player.hasScales()) this.outputText("\n\nYour scales itch incessantly, so you scratch at them.  They start falling off wholesale, leaving you standing in a pile of scales after only a few moments.  <b>You've lost your scales!</b>");
            if (this.player.hasGooSkin()) this.outputText("\n\nYour " + this.player.skin.desc + " itches incessantly, and as you scratch it shifts and changes, becoming normal human-like skin.  <b>Your skin is once again normal!</b>");
            this.player.skin.adj = "";
            this.player.skin.desc = "skin";
            this.player.skin.type = Skin.PLAIN;
            this.player.underBody.restore();
            this.changes++;
        }
        // skinTone
        if (ColorLists.GOBLIN_SKIN.indexOf(this.player.skin.tone) === -1 && this.changes < this.changeLimit && rand(2) === 0) {
            if (rand(10) !== 0) this.player.skin.tone = "dark green";
            else {
                if (rand(2) === 0) this.player.skin.tone = "pale yellow";
                else this.player.skin.tone = "grayish-blue";
            }
            this.player.arms.updateClaws(this.player.arms.claws.type);
            this.changes++;
            this.outputText("\n\nWhoah, that was weird.  You just hallucinated that your ");
            if (this.player.hasFur()) this.outputText("skin");
            else this.outputText(this.player.skin.desc);
            this.outputText(" turned " + this.player.skin.tone + ".  No way!  It's staying, it really changed color!");
            kGAMECLASS.rathazul.addMixologyXP(20);
        }
        // Face!
        if (this.player.face.type !== Face.HUMAN && this.changes < this.changeLimit && rand(4) === 0 && this.player.ears.type === Ears.ELFIN) {
            this.changes++;
            this.player.face.type = Face.HUMAN;
            this.outputText("\n\nAnother violent sneeze escapes you.  It hurt!  You feel your nose and discover your face has changed back into a more normal look.  <b>You have a human looking face again!</b>");
        }
        // Ears!
        if (this.player.ears.type !== Ears.ELFIN && this.changes < this.changeLimit && rand(3) === 0) {
            this.outputText("\n\nA weird tingling runs through your scalp as your " + this.player.hairDescript() + " shifts slightly.  You reach up to touch and bump <b>your new pointed elfin ears</b>.  You bet they look cute!");
            this.changes++;
            this.player.ears.type = Ears.ELFIN;
        }
        // Remove gills
        if (rand(4) === 0 && this.player.hasGills() && this.changes < this.changeLimit) {
            this.mutations.updateGills();
        }

        // Nipples Turn Back:
        if (this.player.hasStatusEffect(StatusEffects.BlackNipples) && this.changes < this.changeLimit && rand(3) === 0) {
            this.mutations.removeBlackNipples(tfSource);
        }
        // Debugcunt
        if (this.changes < this.changeLimit && rand(3) === 0 && this.player.vaginaType() === 5 && this.player.hasVagina()) {
            this.outputText("\n\nSomething invisible brushes against your sex, making you twinge.  Undoing your clothes, you take a look at your vagina and find that it has turned back to its natural flesh colour.");
            this.player.vaginaType(0);
            this.changes++;
        }
        if (this.changes < this.changeLimit && rand(4) === 0 && ((this.player.ass.analWetness > 0 && this.player.findPerk(PerkLib.MaraesGiftButtslut) < 0) || this.player.ass.analWetness > 1)) {
            this.outputText("\n\nYou feel a tightening up in your colon and your [asshole] sucks into itself.  You feel sharp pain at first but that thankfully fades.  Your ass seems to have dried and tightened up.");
            this.player.ass.analWetness--;
            if (this.player.ass.analLooseness > 1) this.player.ass.analLooseness--;
            this.changes++;
        }
        if (this.changes < this.changeLimit && rand(3) === 0) {
            if (rand(2) === 0) this.player.modFem(85, 3);
            if (rand(2) === 0) this.player.modThickness(20, 3);
            if (rand(2) === 0) this.player.modTone(15, 5);
        }
        this.player.refillHunger(15);
        this.game.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;
        return false;
    }
}
