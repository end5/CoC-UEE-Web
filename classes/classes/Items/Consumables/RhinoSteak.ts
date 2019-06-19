import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";
import { Face } from "../../BodyParts/Face";
import { Neck } from "../../BodyParts/Neck";
import { Horns } from "../../BodyParts/Horns";
import { Ears } from "../../BodyParts/Ears";
import { LowerBody } from "../../BodyParts/LowerBody";
import { Wings } from "../../BodyParts/Wings";
import { RearBody } from "../../BodyParts/RearBody";
import { Skin } from "../../BodyParts/Skin";
import { Arms } from "../../BodyParts/Arms";
import { Antennae } from "../../BodyParts/Antennae";
import { Hair } from "../../BodyParts/Hair";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { CockTypesEnum } from "../../CockTypesEnum";
import { Tail } from "../../BodyParts/Tail";
import { StatusEffects } from "../../StatusEffects";

/**
 * @since  March 27, 2018
 * @author Stadler76
 */
export class RhinoSteak extends Consumable {
    public constructor() {
        super(
            "RhinoSt",
            "RhinoSt",
            "a rhino steak",
            ConsumableLib.DEFAULT_VALUE,
            "Despite the name, it doesn't come from any rhinoceros or a rhino-morph. We can guarantee you that no rhinoceros were harmed in the" +
            " production of this food.\n\nDISCLAIMER: We are not responsible if you find yourself altered."
        );
    }

    public useItem(): boolean {
        const tfSource: string = "rhinoTFs";
        let temp: number;
        this.mutations.initTransformation(undefined, 3);
        this.player.refillHunger(40);
        // Stats Changes
        // ------------
        if (rand(3) == 0 && this.player.str100 < 100) {
            if (this.player.str100 < 50) {
                this.outputText("\n\nShivering, you feel a feverish sensation that reminds you of the last time you got sick. Thankfully, it passes swiftly, leaving slightly enhanced strength in its wake.");
                this.dynStats("str", .5);
            }
            else {
                this.outputText("\n\nHeat builds in your muscles, their already-potent mass shifting slightly as they gain even more strength.");
            }
            this.dynStats("str", .5);
        }
        if (rand(3) == 0 && this.player.tou100 < 100) {
            this.outputText("\n\nYou thump your chest and grin - your foes will have a harder time taking you down while you're fortified by liquid courage.");
            this.dynStats("tou", 1);
        }
        if (rand(2) == 0 && this.player.spe100 > 80 && this.player.str100 >= 50) {
            this.outputText("\n\nYou begin to feel that the size of your muscles is starting to slow you down.");
            this.dynStats("spe", -1);
        }
        if (rand(3) == 0 && this.player.tou100 < 50 && this.changes < this.changeLimit) {
            this.outputText("\n\nYour skin feels clammy and a little rubbery. You touch yourself experimentally and notice that you can barely feel the pressure from your fingertips. Consumed with curiosity, you punch yourself lightly in the arm; the most you feel is a dull throb!");
            this.dynStats("sen", -1);
        }
        if (rand(3) == 0 && this.player.inte > 15 && this.player.face.type == Face.RHINO && this.player.horns.value == 2) {
            this.outputText("\n\nYou shake your head and struggle to gather your thoughts, feeling a bit slow.");
            this.dynStats("int", -1);
        }
        if (rand(3) == 0 && this.player.rhinoScore() >= 2 && (rand(2) == 0 || !this.player.inRut) && this.player.hasCock()) {
            this.player.goIntoRut(true);
        }
        // Neck restore
        if (this.player.neck.type != Neck.NORMAL && this.changes < this.changeLimit && rand(4) == 0) this.mutations.restoreNeck(tfSource);
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && rand(5) == 0) this.mutations.restoreRearBody(tfSource);
        // Ovi perk loss
        if (rand(5) == 0) this.mutations.updateOvipositionPerk(tfSource);
        // Special TFs
        // ------------
        if (rand(4) == 0 && this.changes < this.changeLimit && this.player.horns.type != Horns.UNICORN && this.player.ears.type == Ears.HORSE && (this.player.lowerBody.type == LowerBody.HOOFED || this.player.lowerBody.type == LowerBody.CLOVEN_HOOFED || this.player.horseScore() >= 3)) {
            this.outputText("\n\nYou begin to feel an annoying tingling sensation at the top of your head. Reaching up to inspect it you find the <b>sharp nub of a horn protruding from the center of your forehead</b> and growing. Once it's complete you estimate it to be about six inches long.");
            this.player.horns.type = Horns.UNICORN;
            this.player.horns.value = 6;
            this.changes++;
        }
        if (rand(4) == 0 && this.changes < this.changeLimit && this.player.horns.type == Horns.UNICORN && this.player.horns.value > 0 && this.player.horns.value < 12) {
            this.outputText("\n\nYou begin to feel an intense pinching sensation in your central horn as it pushes out, growing longer and larger. You reach up and find <b>it has developed its own cute little spiral,</b> you estimate it to be about a foot long, two inches thick and very sturdy, a very useful natural weapon.");
            this.player.horns.value = 12;
            this.changes++;
        }
        // Normal TFs
        // ------------
        // Removes wings
        if (rand(4) == 0 && this.changes < this.changeLimit && (this.player.wings.type != Wings.NONE || this.player.rearBody.type == RearBody.SHARK_FIN)) {
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
        // Fur/scales fall out
        if (rand(4) == 0 && this.changes < this.changeLimit && (!this.player.hasPlainSkin() || this.player.skin.tone != "gray" || this.player.skin.adj != "tough")) {
            this.outputText("\n\n");
            switch (this.player.skin.type) {
                case Skin.PLAIN:
                    this.outputText("You feel an itchy sensation as your skin thickens, <b>becoming tough gray skin</b>.");
                    break;
                case Skin.FUR:
                    this.outputText("You feel an itching sensation as your fur beings to fall off in clumps, <b>revealing tough gray skin</b> beneath it.");
                    break;
                case Skin.LIZARD_SCALES:
                case Skin.DRAGON_SCALES:
                case Skin.FISH_SCALES:
                    this.outputText("You feel an odd rolling sensation as your scales begin to shift, spreading and reforming as they grow and disappear, <b>becoming tough gray skin</b>.");
                    break;
                case Skin.GOO:
                    this.outputText("You feel an itchy sensation as your gooey skin solidifies and thickens, <b>becoming tough gray skin</b>.");
                    break;
                default:
                    this.outputText("You feel an itchy sensation as your skin thickens, <b>becoming tough gray skin</b>.");
            }
            this.player.skin.tone = "gray";
            this.player.skin.adj = "tough";
            this.player.skin.type = Skin.PLAIN;
            this.player.skin.desc = "skin";
            this.player.underBody.restore();
            this.player.arms.updateClaws(this.player.arms.claws.type);
            this.changes++;
        }
        // Arms change to regular
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.arms.type != Arms.HUMAN) {
            switch (this.player.arms.type) {
                case Arms.HARPY:
                    this.outputText("\n\nYou scratch at your biceps absentmindedly, but no matter how much you scratch, it isn't getting rid of the itch. Glancing down in irritation, you discover that your feathery arms are shedding their feathery coating. The wing-like shape your arms once had is gone in a matter of moments, leaving " + this.player.skin.desc + " behind.");
                    break;
                case Arms.SPIDER:
                    this.outputText("\n\nYou scratch at your biceps absentmindedly, but no matter how much you scratch, it isn't getting rid of the itch. Glancing down in irritation, you discover that your arms' chitinous covering is flaking away. The glossy black coating is soon gone, leaving " + this.player.skin.desc + " behind.");
                    break;
                default:
            }
            this.player.arms.restore();
            this.changes++;
        }
        // Change legs to normal
        if (rand(4) == 0 && this.changes < this.changeLimit && this.player.lowerBody.type != LowerBody.HUMAN) {
            if (this.player.isBiped()) this.outputText("You feel an odd sensation in your [feet]. Your [feet] shift and you hear bones cracking as they reform into normal human feet.");
            this.player.lowerBody.type = LowerBody.HUMAN;
            this.player.lowerBody.legCount = 2;
            this.changes++;
        }
        // Removes antennaes!
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.antennae.type > Antennae.NONE) {
            this.mutations.removeAntennae();
        }
        // Hair turns back to normal
        if (rand(4) == 0 && this.changes < this.changeLimit && this.player.hair.type != Hair.NORMAL) {
            switch (this.player.hair.type) {
                case Hair.FEATHER:
                    if (this.player.hair.length >= 6) this.outputText("\n\nA lock of your downy-soft feather-hair droops over your eye. Before you can blow the offending down away, you realize the feather is collapsing in on itself. It continues to curl inward until all that remains is a normal strand of hair. <b>Your hair is no longer feathery!</b>");
                    else this.outputText("\n\nYou run your fingers through your downy-soft feather-hair while you await the effects of the item you just ingested. While your hand is up there, it detects a change in the texture of your feathers. They're completely disappearing, merging down into strands of regular hair. <b>Your hair is no longer feathery!</b>");
                    break;
                case Hair.GOO:
                    this.outputText("\n\nYour gooey hair begins to fall out in globs, eventually leaving you with a bald head. Your head is not left bald for long, though. Within moments, a full head of hair sprouts from the skin of your scalp. <b>Your hair is normal again!</b>");
                    break;
                case Hair.GHOST:
                    break;
                case Hair.ANEMONE:
                    this.outputText("\n\nYou feel something strange going in on your head. You reach your hands up to feel your tentacle-hair, only to find out that the tentacles have vanished and replaced with normal hair. <b>Your hair is normal again!</b>");
                    break;
                default:
                // This shouldn't happen, moving along...
            }
            this.changes++;
            this.player.hair.type = Hair.NORMAL;
            this.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] = 0;
        }
        // Restart hair growth
        if (rand(3) == 0 && this.changes < this.changeLimit && this.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] > 0) {
            this.outputText("\n\nYou feel an itching sensation in your scalp as you realize the change. <b>Your hair is growing normally again!</b>");
            this.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] = 0;
            this.changes++;
        }
        // Remove gills
        if (rand(4) == 0 && this.changes < this.changeLimit && this.player.hasGills()) this.mutations.updateGills();
        // Rhino TFs
        // ------------
        // Change a cock to rhino.
        if (rand(4) == 0 && this.changes < this.changeLimit && this.player.hasCock() && this.player.countCocksOfType(CockTypesEnum.RHINO) < this.player.cockTotal()) {
            if (this.player.cockTotal() == 1) this.outputText("\n\nYou feel a stirring in your loins as your cock grows rock hard. ");
            else this.outputText("\n\nOne of your penises begins to feel strange. ");
            this.outputText("You " + this.player.clothedOrNakedLower("pull it out from your [armor]", "lean over") + ", right there in the center of The Black Cock, to take a look. You watch as the skin of your cock becomes a smooth, tough pink colored phallus. It takes on a long and narrow shape with an oval shaped bulge along the center. You feel a tightness near the base where your skin seems to be bunching up. A sheath begins forming around your flared rhino cock’s root, tightening as your stiff rhino dick elongates and settles, the thick flared head leaking a steady stream of funky animal-cum. <b>You now have a rhino-dick.</b>");
            for (const cock of this.player.cocks) {
                if (cock.cockType != CockTypesEnum.RHINO) {
                    cock.cockType = CockTypesEnum.RHINO;
                    break;
                }
            }
            this.dynStats("lus", 20);
            this.changes++;
        }
        // Change ears to rhino
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.ears.type != Ears.RHINO) {
            this.outputText("\n\nYou feel an odd uncomfortable sensation in your ears. Reaching up you find your ears shifting into an open tube shape, once they’re done you flick them around, enjoying the sensation of your new ears swishing through the air. <b>You now have rhino ears.</b>");
            this.player.ears.type = Ears.RHINO;
            this.changes++;
        }
        // Change face to rhino
        if (rand(4) == 0 && this.changes < this.changeLimit && this.player.ears.type == Ears.RHINO && this.player.skin.tone == "gray" && this.player.face.type != Face.RHINO) {
            this.outputText("\n\nYour face suddenly goes numb. You begin to hear bone cracking as you vision suddenly shifts as you face stretches out and thickens. When your face is done growing you can see the edges of your elongated mouth and noise in the center of your field of vision. They barely impede your vision though. <b>You now have a rhino face.</b>");
            this.player.face.type = Face.RHINO;
            this.changes++;
        }
        // Change tail to rhino
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.isBiped() && this.player.tail.type != Tail.RHINO) {
            if (this.player.tail.type > 0) this.outputText("\n\nYou [tail] suddenly goes numb. Looking back you see it changing, twisting and reforming into a long ropy tail with a little " + this.player.skin.furColor + " tuft at the end. <b>You now have a rhino tail.</b>");
            else this.outputText("\n\nYou feel an odd itchy sensation just above your [ass]. Twisting around to inspect it you find a long ropy tail with a little " + this.player.skin.furColor + " tuft on the end. <b>You now have a rhino tail.</b>");
            this.player.tail.type = Tail.RHINO;
            this.changes++;
        }
        // Gain rhino horns
        // Tier 1
        if (rand(4) == 0 && this.changes < this.changeLimit && this.player.face.type == Face.RHINO && this.player.horns.type != Horns.RHINO) {
            this.outputText("\n\nYou begin to feel an annoying tingling sensation at the top of your head. Reaching up to inspect it you find the sharp nub of a horn protruding from the center of your forehead and growing. Once it's complete you estimate it to be about six inches long. If it were sharper and a little longer it would make a useful natural weapon.");
            this.player.horns.value = 1;
            this.player.horns.type = Horns.RHINO;
            this.changes++;
        }
        // Tier 2
        if (rand(4) == 0 && this.changes < this.changeLimit && this.player.face.type == Face.RHINO && this.player.horns.type == Horns.RHINO && this.player.horns.value == 1) {
            this.outputText("\n\nYou begin to feel an annoying tingling sensation at the edge of your nose, above your field of vision. Reaching up you feel the sharp edge of a curved horn growing out the edge of your face. The itchy tingle continues as you feel both of your horns become sharp and tall. You estimate your older horn to be a mere seven inches and your new horn to be around a foot long. They’ll be useful natural weapons.");
            this.outputText("\n<b>(Gained physical special: Upheaval! Any time you lose your rhino face or horns, you will lose this ability.)</b>");
            this.player.horns.value = 2;
            this.player.horns.type = Horns.RHINO;
            this.changes++;
        }
        // Other Changes
        // ------------
        // Increase cock size of non-rhino up to 10 inches.
        let cocksAffected: number = 0;
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.hasCock() && this.player.smallestCockLength() < 10 && this.player.cockTotal() - this.player.countCocksOfType(CockTypesEnum.RHINO) > 0) {
            cocksAffected = 0;
            for (let i = 0; i < this.player.cockTotal(); i++) {
                if (this.player.cocks[i].cockType == CockTypesEnum.RHINO && this.player.cocks[i].cockLength >= 10) continue; // Skip over if rhino cock.
                temp = this.player.increaseCock(this.player.smallestCockIndex(), rand(2) + 1);
                this.dynStats("lib", 0.5, "lus", 3);
                cocksAffected++;
            }
            this.outputText("\n\n");
            this.player.lengthChange(temp!, cocksAffected);
            this.changes++;
        }
        // Increase girth of rhino cock.
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.hasCock() && this.player.countCocksOfType(CockTypesEnum.RHINO) > 0) {
            cocksAffected = 0;
            for (let i = 0; i < this.player.cockTotal(); i++) {
                if (this.player.cocks[i].cockType == CockTypesEnum.RHINO && this.player.cocks[i].cockThickness < 3) {
                    this.player.cocks[i].thickenCock(0.5);
                    this.dynStats("lib", 0.5, "lus", 3);
                    break;
                }
            }
            this.changes++;
        }
        // Increase length of rhino cock.
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.hasCock() && this.player.countCocksOfType(CockTypesEnum.RHINO) > 0) {
            cocksAffected = 0;
            for (let i = 0; i < this.player.cockTotal(); i++) {
                if (this.player.cocks[i].cockType == CockTypesEnum.RHINO && this.player.cocks[i].cockLength < 18) {
                    temp = this.player.increaseCock(i, 1 + rand(2));
                    this.outputText("\n\n");
                    this.player.lengthChange(temp, 1);
                    this.dynStats("lib", 0.5, "lus", 3);
                    break;
                }
            }
            this.changes++;
        }
        // Grow balls
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.balls > 0 && this.player.ballSize < 4) {
            if (this.player.ballSize <= 2) this.outputText("\n\nA flash of warmth passes through you and a sudden weight develops in your groin. You pause to examine the changes and your roving fingers discover your " + this.player.simpleBallsDescript() + " have grown larger than a human's.");
            if (this.player.ballSize > 2) this.outputText("\n\nA sudden onset of heat envelops your groin, focusing on your " + this.player.sackDescript() + ". Walking becomes difficult as you discover your " + this.player.simpleBallsDescript() + " have enlarged again.");
            this.dynStats("lib", 1, "lus", 3);
            this.player.ballSize++;
            this.changes++;
        }
        // Boost vaginal capacity without gaping
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.hasVagina() && this.player.statusEffectv1(StatusEffects.BonusVCapacity) < 40) {
            if (!this.player.hasStatusEffect(StatusEffects.BonusVCapacity)) this.player.createStatusEffect(StatusEffects.BonusVCapacity, 0, 0, 0, 0);
            this.player.addStatusValue(StatusEffects.BonusVCapacity, 1, 5);
            this.outputText("\n\nThere is a sudden... emptiness within your " + this.player.vaginaDescript(0) + ". Somehow you know you could accommodate even larger... insertions.");
            this.changes++;
        }
        // Boost anal capacity without gaping
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.hasVagina() && this.player.statusEffectv1(StatusEffects.BonusVCapacity) < 60) {
            if (this.player.statusEffectv1(StatusEffects.BonusACapacity) < 60) {
                if (!this.player.hasStatusEffect(StatusEffects.BonusACapacity)) this.player.createStatusEffect(StatusEffects.BonusACapacity, 0, 0, 0, 0);
                this.player.addStatusValue(StatusEffects.BonusACapacity, 1, 5);
                this.outputText("\n\nYou feel... more accommodating somehow. Your " + this.player.assholeDescript() + " is tingling a bit, and though it doesn't seem to have loosened, it has grown more elastic.");
                this.changes++;
            }
        }
        // Gain height
        if (rand(2) == 0 && this.changes < this.changeLimit && this.player.tallness < 102) {
            temp = rand(5) + 3;
            // Slow rate of growth near ceiling
            if (this.player.tallness > 90) temp = Math.floor(temp / 2);
            // Constrain height growth
            if (temp == 0) temp = 1; // Never 0
            if (temp > 6) temp = 6; // Constrain growth to 6 inches
            // Flavor texts. Flavored like 1950's cigarettes. Yum.
            if (temp < 3) this.outputText("\n\nYou shift uncomfortably as you realize you feel off balance. Gazing down, you realize you have grown SLIGHTLY taller.");
            if (temp >= 3 && temp < 6) this.outputText("\n\nYou feel dizzy and slightly off, but quickly realize it's due to a sudden increase in height.");
            if (temp == 6) this.outputText("\n\nStaggering forwards, you clutch at your head dizzily. You spend a moment getting your balance, and stand up, feeling noticeably taller.");
            this.player.tallness += temp;
            this.changes++;
        }
        // Gain muscle tone
        if (rand(2) == 0 && this.player.tone < 80) {
            if (this.player.tone < 50) this.player.modTone(80, 2 + rand(2));
            else this.player.modTone(80, 1 + rand(2));
        }
        // Gain thickness
        if (rand(2) == 0 && this.player.thickness < 80) {
            if (this.player.thickness < 50) this.player.modThickness(80, 2 + rand(2));
            else this.player.modThickness(80, 1 + rand(2));
        }
        // Slow hair production
        if (rand(3) == 0 && this.changes < this.changeLimit && this.flags[kFLAGS.INCREASED_HAIR_GROWTH_SERUM_TIMES_APPLIED] > 0) {
            this.outputText("\n\nYou feel a tingling sensation in your scalp. After a few seconds it stops… that was odd.");
            this.flags[kFLAGS.INCREASED_HAIR_GROWTH_SERUM_TIMES_APPLIED] = 0;
            this.changes++;
        }
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;

        return false;
    }
}
