import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";
import { Hair } from "../../BodyParts/Hair";
import { Arms } from "../../BodyParts/Arms";
import { Eyes } from "../../BodyParts/Eyes";
import { Skin } from "../../BodyParts/Skin";
import { Ears } from "../../BodyParts/Ears";
import { Tail } from "../../BodyParts/Tail";
import { LowerBody } from "../../BodyParts/LowerBody";
import { CockTypesEnum } from "../../CockTypesEnum";
import { Tongue } from "../../BodyParts/Tongue";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { Face } from "../../BodyParts/Face";
import { PerkLib } from "../../PerkLib";
import { Gender } from "../../lists/Gender";
import { Neck } from "../../BodyParts/Neck";
import { StatusEffects } from "../../StatusEffects";

/**
 * @since  March 27, 2018
 * @author Stadler76
 */
export class EchidnaCake extends Consumable {
    public constructor() {
        super(
            "EchidCk",
            "EchidCk",
            "an echidna cake",
            ConsumableLib.DEFAULT_VALUE,
            "Try our special cake, a favorite among the echidna-morphs!\n\nDISCLAIMER: We are not responsible if you find yourself altered."
        );
    }

    public useItem(): boolean {
        const tfSource: string = "echidnaTFs";
        let i: number = 0;
        let temp: number;
        this.mutations.initTransformation(undefined, 3);
        this.player.refillHunger(40);
        // Stats Changes
        // ------------
        // None at the moment

        // Normal TFs
        // ------------
        if (rand(4) == 0 && this.changes < this.changeLimit && this.player.hair.type != Hair.NORMAL && this.player.hair.type != Hair.QUILL) {
            this.outputText("\n\nYour scalp feels really strange, but the sensation is brief. You feel your hair, and you immediately notice the change. <b>It would seem that your hair is normal again!</b>");
            this.player.hair.type = Hair.NORMAL;
            this.changes++;
        }
        if (rand(4) == 0 && this.changes < this.changeLimit && this.player.arms.type == Arms.HARPY) {
            this.outputText("\n\nYour arm feathers fall out completely, <b>leaving only the " + this.player.skinFurScales() + " underneath.</b>");
            this.player.arms.type = Arms.HUMAN;
            this.changes++;
        }
        // Remove gills
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.hasGills()) this.mutations.updateGills();

        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.eyes.type == Eyes.FOUR_SPIDER_EYES || this.player.eyes.type == Eyes.SPIDER) {
            this.outputText("\n\nYour eyes start throbbing painfully, your sight in them eventually going dark. You touch your head to inspect your eyes, only to find out that they have changed. <b>You have human eyes now!</b>");
            this.player.eyes.type = Eyes.HUMAN;
            this.player.eyes.count = 2;
            this.changes++;
        }
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.averageNipplesPerBreast() > 4) {
            this.outputText("\n\nA tightness arises in your nipples as three out of four on each breast recede completely, the leftover nipples migrating to the middle of your breasts. <b>You are left with only one nipple on each breast.</b>");
            for (i = 0; i < this.player.breastRows.length; i++) {
                this.player.breastRows[i].nipplesPerBreast = 1;
            }
            this.changes++;
        }
        // Main TFs
        // ------------
        // Change to fur
        if (rand(3) == 0 && this.changes < this.changeLimit && !this.player.hasFur()) {
            this.outputText("\n\nYou shiver, feeling a bit cold. Just as you begin to wish for something to cover up with, it seems your request is granted; <b>fur begins to grow all over your body!</b> You tug at the tufts in alarm, but they're firmly rooted and... actually pretty soft. Huh. ");
            this.player.skin.adj = "";
            this.player.skin.desc = "fur";
            this.player.skin.type = Skin.FUR;
            this.player.skin.furColor = "brown";
            this.player.underBody.restore(); // Restore the underbody for now
            this.changes++;
        }
        // Gain Echidna ears
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.ears.type != Ears.ECHIDNA) {
            this.outputText("\n\n");
            switch (this.player.ears.type) {
                case Ears.LIZARD:
                    this.outputText("You feel a strange itching in your reptilian ears. As you scratch them, you can feel their scales flaking away, leaving you with smooth, rounded holes for ears.");
                    break;
                default:
                    this.outputText("Tightness centers on your scalp, pulling your ears down from their normal shape into small bumps with holes in their centers.");
            }
            this.outputText(" <b>You now have echidna ears!</b>");
            this.player.ears.type = Ears.ECHIDNA;
            this.changes++;
        }
        // Gain Echidna tail
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.ears.type == Ears.ECHIDNA && this.player.tail.type != Tail.ECHIDNA) {
            this.outputText("\n\n");
            switch (this.player.tail.type) {
                case Tail.NONE:
                    this.outputText("You feel a brief pinch at the base of your spine. Reaching behind yourself, you find that a small stump has formed above your [ass], just barely enough to qualify as a tail.");
                    break;
                case Tail.HARPY:
                    this.outputText("You feel a soft tingle as your tail feathers fall out one by one, leaving you with just a little stump for a tail.");
                    break;
                case Tail.RABBIT:
                    this.outputText("Your tiny, poofy bunny tail begins to feel chilly as its fur falls out in clumps, leaving you with just a little stump for a tail.");
                    break;
                case Tail.COW:
                    this.outputText("Your ropey cow tail begins to feel chilly as all of its fur falls out. It becomes tight as the majority of the tail’s length recedes into your body, leaving you with just a little stump for a tail.");
                    break;
                case Tail.CAT:
                    this.outputText("Your long cat tail begins to feel chilly as all of its fur falls out. It becomes tight as the majority of the tail’s length recedes into your body, leaving you with just a little stump for a tail.");
                    break;
                case Tail.DOG:
                    this.outputText("Your wagging dog tail begins to feel chilly as all of its fur falls out. It becomes tight as the majority of the tail’s length recedes into your body, leaving you with just a little stump for a tail.");
                    break;
                case Tail.KANGAROO:
                    this.outputText("Your tapered kangaroo tail begins to feel chilly as all of its fur falls out. It becomes tight as the majority of the tail’s length recedes into your body, leaving you with just a little stump for a tail.");
                    break;
                case Tail.LIZARD:
                case Tail.DRACONIC:
                    this.outputText("Your long, tapered tail becomes tight as the majority of the tail’s length recedes into your body, leaving you with just a little stump for a tail. You now have an echidna tail!");
                    break;
                case Tail.FOX:
                    this.outputText("Your swishing fox tail begins to feel chilly as all of its fur falls out. It becomes tight as the majority of the tail’s length recedes into your body, leaving you with just a little stump for a tail.");
                    break;
                case Tail.RACCOON:
                    this.outputText("Your ringed raccoon tail begins to feel chilly as all of its fur falls out. It becomes tight as the majority of the tail’s length recedes into your body, leaving you with just a little stump for a tail.");
                    break;
                case Tail.HORSE:
                    if (this.player.isTaur()) this.outputText("Your shiny horse tail begins to feel chilly as all of its fur falls out. It becomes tight as the majority of the tail’s length recedes into your body, leaving you with just a little stump for a tail. This new, mismatched tail looks a bit odd on your horse lower body.");
                    else this.outputText("Your shiny horse tail begins to feel chilly as all of its fur falls out. It becomes tight as the majority of the tail’s length recedes into your body, leaving you with just a little stump for a tail.");
                    break;
                case Tail.MOUSE:
                    this.outputText("Your bald mouse tail becomes tight as the majority of the tail’s length recedes into your body, leaving you with just a little stump for a tail.");
                    break;
                case Tail.FERRET:
                    this.outputText("Your tapered ferret tail begins to feel chilly as all of its fur falls out. It becomes tight as the majority of the tail’s length recedes into your body, leaving you with just a little stump for a tail.");
                    break;
                case Tail.RHINO:
                    this.outputText("The tip of your long rhino tail begins to itch as the fur begins to fall out. The entire length of your tail becomes tight as the majority of the tail’s length recedes into your body, leaving you with just a little stump for a tail.");
                    break;
                default: // Catch-all
                    this.outputText("You groan as you feel your tail shifting and reforming. By the time the sensation is over, you find that you have a little stump for a tail.");
            }
            this.outputText(" <b>You now have an echidna tail!</b>");
            this.player.tail.type = Tail.ECHIDNA;
            this.changes++;
        }
        // Gain Echidna legs
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.ears.type == Ears.ECHIDNA && this.player.tail.type && Tail.ECHIDNA && this.player.lowerBody.type != LowerBody.ECHIDNA) {
            this.outputText("\n\n");
            switch (this.player.lowerBody.type) {
                // Irregular lower body type
                case LowerBody.NAGA:
                    this.outputText("You collapse to the ground, a sharp pain encompassing your serpentine tail. The pain quickly becomes so severe that you black out on the spot. Eventually you awake to find that you no longer have the lower body of a snake. You have two legs again, and your feet look a lot like your old human feet. The only difference is that your toes are clawed, and the bottoms of your feet padded.");
                    break;
                case LowerBody.GOO:
                    this.outputText("You collapse to the ground, a sharp pain encompassing your amorphous lower half. The pain quickly becomes so severe that you black out on the spot. Eventually you awake to find that you no longer have a gooey lower body. You have two legs again, and your feet look a lot like your old human feet. The only difference is that your toes are clawed, and the bottoms of your feet padded.");
                    break;
                // Regular lower body type (Bipedal)
                case LowerBody.HUMAN:
                    this.outputText("You feel a sharp stinging at your toenails that only grows worse by the second. As you inspect your aching toes, you’re shocked to see that your toenails are lengthening, eventually becoming fierce claws. It would seem that the bottoms of your feet have changed as well. They’ve become padded!");
                    break;
                case LowerBody.HOOFED:
                case LowerBody.CLOVEN_HOOFED:
                    this.outputText("You nearly drop to the ground as a fuzzy sensation erupts at your hooves. Have they gone to sleep? As you inspect your feet, you find that they are no longer hooved! In fact, they look a lot like your old human feet. The only difference is that your toes are clawed, and the bottoms of your feet padded.");
                    break;
                case LowerBody.HARPY:
                case LowerBody.DEMONIC_CLAWS:
                case LowerBody.DEMONIC_HIGH_HEELS:
                case LowerBody.LIZARD:
                case LowerBody.DRAGON:
                    this.outputText("Your feet feel strange, almost as if they’ve fallen asleep. What’s wrong with them? You take a look, and you’re shocked to see that your feet have changed. In fact, they look a lot like your old human feet. The only difference is that your toes are clawed, and the bottoms of your feet padded.");
                    break;
                case LowerBody.CAT:
                case LowerBody.DOG:
                case LowerBody.FOX:
                case LowerBody.KANGAROO:
                case LowerBody.BUNNY:
                case LowerBody.RACCOON:
                case LowerBody.FERRET:
                    this.outputText("Ow! What’s wrong with your paws? They hurt! You sit down, taking a moment to inspect your aching paws. What’s this? It would appear that they’ve changed! In fact, they look a lot like your old human feet. The only difference is that your toes are clawed, and the bottoms of your feet padded.");
                    break;
                default: // Catch-all
                    this.outputText("Your feet feel strange, almost as if they’ve fallen asleep. What’s wrong with them? You take a look, and you’re shocked to see that your feet have changed. In fact, they look a lot like your old human feet. The only difference is that your toes are clawed, and the bottoms of your feet padded.");
            }
            this.outputText(" <b>They actually look like the feet of an echidna!</b>");
            this.player.lowerBody.type = LowerBody.ECHIDNA;
            this.player.lowerBody.legCount = 2;
            this.changes++;
        }
        // Gain Echidna cock
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.hasCock() && this.player.countCocksOfType(CockTypesEnum.ECHIDNA) < this.player.cockTotal()) {
            this.outputText("\n\n");
            if (this.player.cockTotal() == 1) this.outputText("Your [cock] suddenly becomes rock hard out of nowhere. You " + this.player.clothedOrNakedLower("pull it out from your [armor], right in the middle of the food tent, watching", "watch") + " as it begins to shift and change. It becomes pink in color, and you feel a pinch at the head as it splits to become four heads. " + (this.player.hasSheath() ? "" : "The transformation finishes off with a fleshy sheath forming at the base.") + " It ejaculates before going limp, retreating into your sheath.");
            else this.outputText("One of your penises begins to feel strange. You " + this.player.clothedOrNakedLower("pull the offending cock out from your [armor], right in the middle of the food tent, watching", "watch") + " as it begins to shift and change. It becomes pink in color, and you feel a pinch at the head as it splits to become four heads. " + (this.player.hasSheath() ? "" : "The transformation finishes off with a fleshy sheath forming at the base.") + " It ejaculates before going limp, retreating into your sheath.");
            this.outputText(" <b>You now have an echidna penis!</b>");
            for (i = 0; i < this.player.cocks.length; i++) {
                if (this.player.cocks[i].cockType != CockTypesEnum.ECHIDNA) {
                    this.player.cocks[i].cockType = CockTypesEnum.ECHIDNA;
                    break;
                }
            }
            this.changes++;
        }
        // Gain Echidna tongue
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.echidnaScore() >= 2 && this.player.tongue.type != Tongue.ECHIDNA) {
            this.outputText("\n\nYou feel an uncomfortable pressure in your tongue as it begins to shift and change. Within moments, you are able to behold your long, thin tongue. It has to be at least a foot long. <b>You now have an echidna tongue!</b>");
            this.player.tongue.type = Tongue.ECHIDNA;
            this.changes++;
        }
        // Gain quill hair
        if (rand(4) == 0 && this.changes < this.changeLimit && this.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] == 1 && this.player.hair.type == Hair.NORMAL) {
            this.outputText("\n\nYour scalp begins to tingle as your hair falls out in clumps, leaving you with a bald head. You aren’t bald for long, though. An uncomfortable pressure racks the entirety of your scalp as hard quills begin to sprout from your hair pores. Their growth stops as they reach shoulder length. <b>You now have quills in place of your hair!</b>");
            this.player.hair.type = Hair.QUILL;
            this.changes++;
        }
        // Gain Echidna face if you have the right conditions.
        if (rand(4) == 0 && this.changes < this.changeLimit && this.player.hasFur() && this.player.ears.type == Ears.ECHIDNA && this.player.tail.type == Tail.ECHIDNA && this.player.tongue.type == Tongue.ECHIDNA) {
            this.outputText("You groan loudly as the bones in your face begin to reshape and rearrange. Most notable, you feel your mouth lengthening into a long, thin snout. <b>You now have an echidna face!</b>");
            this.player.face.type = Face.ECHIDNA;
            this.changes++;
        }
        // Other Changes
        // ------------
        // Hair stops growing
        if (rand(4) == 0 && this.changes < this.changeLimit && this.player.echidnaScore() >= 2 && this.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] == 0) {
            this.outputText("\n\nYour scalp tingles oddly. In a panic, you reach up to your " + this.player.hairDescript() + ", but thankfully it appears unchanged.\n");
            this.outputText("(<b>Your hair has stopped growing.</b>)");
            this.changes++;
            this.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD]++;
        }

        // Sexual changes
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.hasCock() && this.player.cumMultiplier < 25) {
            temp = 1 + rand(4);
            // Lots of cum raises cum multiplier cap to 2 instead of 1.5
            if (this.player.findPerk(PerkLib.MessyOrgasms) >= 0) temp += rand(10);
            temp *= 0.1;
            this.player.cumMultiplier += temp;
            // Flavor text
            if (this.player.balls == 0) this.outputText("\n\nYou feel a churning inside your gut as something inside you changes.");
            if (this.player.balls > 0) this.outputText("\n\nYou feel a churning in your " + this.player.ballsDescriptLight() + ". It quickly settles, leaving them feeling somewhat more dense.");
            this.outputText(" A bit of milky pre dribbles from your " + this.player.multiCockDescriptLight() + ", pushed out by the change.");
            this.changes++;
        }
        if (rand(3) == 0 && this.changes < this.changeLimit && this.player.gender == Gender.MALE && this.player.averageBreastSize() > 2 && this.flags[kFLAGS.HYPER_HAPPY] == 0) {
            this.outputText("\n\nYou cup your tits as they begin to tingle strangely. You can actually feel them getting smaller in your hands!");
            this.player.shrinkTits();
            this.changes++;
        }
        // Neck restore
        if (this.player.neck.type != Neck.NORMAL && this.changes < this.changeLimit && rand(4) == 0) this.mutations.restoreNeck(tfSource);
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && rand(5) == 0) this.mutations.restoreRearBody(tfSource);
        // Ovi perk gain
        if (rand(4) == 0 && this.changes < this.changeLimit && this.player.echidnaScore() >= 3 && this.player.hasVagina() && this.player.findPerk(PerkLib.Oviposition) < 0) {
            this.mutations.updateOvipositionPerk(tfSource);
        }
        if (rand(3) == 0 && (rand(2) == 0 || !this.player.inHeat) && this.player.hasVagina() && this.player.statusEffectv2(StatusEffects.Heat) < 30) {
            this.player.goIntoHeat(true);
        }
        // Thickness and hip modifier
        if (rand(2) == 0 && this.player.thickness < 90) {
            this.player.modThickness(90, 2);
        }
        if (rand(2.4) == 0 && this.changes < this.changeLimit && this.player.hasVagina() && this.player.mf("m", "f") == "f" && this.player.hips.rating < 14) {
            this.outputText("\n\nAfter finishing, you find that your gait has changed. Did your [hips] widen?");
            this.player.hips.rating++;
            this.changes++;
        }
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;

        return false;
    }

}
