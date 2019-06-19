import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";
import { Tail } from "../../BodyParts/Tail";
import { Neck } from "../../BodyParts/Neck";
import { Ears } from "../../BodyParts/Ears";
import { Skin } from "../../BodyParts/Skin";
import { Face } from "../../BodyParts/Face";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { StatusEffects } from "../../StatusEffects";
import { Eyes } from "../../BodyParts/Eyes";
import { Arms } from "../../BodyParts/Arms";
import { LowerBody } from "../../BodyParts/LowerBody";
import { PerkLib } from "../../PerkLib";

/**
 * @since March 26, 2018
 * @author Stadler76
 */
export class SweetGossamer extends Consumable {
    public static SPIDER: number = 0;
    public static DRIDER: number = 1;

    private type: number;

    public constructor(_type: 0 | 1) {
        let id: string;
        let shortName: string;
        let longName: string;
        let description: string;
        let value: number;

        switch (type) {
            case SweetGossamer.SPIDER:
                id = "S.Gossr";
                shortName = "S.Gossr";
                longName = "a bundle of pink, gossamer webbing";
                description = "These strands of gooey pink gossamer seem quite unlike the normal silk that spider-morphs produce."
                    + " It smells sweet and is clearly edible, but who knows what it might do to you?";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            case SweetGossamer.DRIDER:
                id = "B.Gossr";
                shortName = "B.Gossr";
                longName = "a bundle of black, gossamer webbing";
                description = "These strands of gooey black gossamer seem quite unlike the normal silk that driders produce."
                    + " It smells sweet and is clearly edible, but who knows what it might do to you?";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            default: // Remove this if someone manages to get SonarQQbe to not whine about a missing default ... ~Stadler76
                throw new Error("Sweet Gossamer. Wrong or no type passed to constructor.");
        }

        super(id, shortName, longName, value, description);
        this.type = _type;
    }

    public useItem(): boolean {
        let tfSource: string = "sweetGossamer";
        if (type === SweetGossamer.DRIDER) tfSource += "-drider";
        let temp: number;
        this.mutations.initTransformation([2, 2]);
        this.clearOutput();
        // Consuming Text
        if (type === SweetGossamer.SPIDER) this.outputText("You wad up the sweet, pink gossamer and eat it, finding it to be delicious and chewy, almost like gum.  Munching away, your mouth generates an enormous amount of spit until you're drooling all over yourself while you devour the sweet treat.");
        else if (type === SweetGossamer.DRIDER) this.outputText("You wad up the sweet, black gossamer and eat it, finding it to be delicious and chewy, almost like licorice.  Munching away, your mouth generates an enormous amount of spit until you're drooling all over yourself while you devour the sweet treat.");

        // *************
        // Stat Changes
        // *************
        // (If speed<70, increases speed)
        if (this.player.spe100 < 70 && this.changes < this.changeLimit && rand(3) === 0) {
            this.outputText("\n\nYour reflexes feel much faster. Experimentally, you make a grab at a fly on a nearby rock and quickly snatch it out of the air.  A compulsion to stuff it in your mouth and eat it surfaces, but you resist the odd desire.  Why would you ever want to do something like that?");
            this.dynStats("spe", 1.5);
        }
        // (If speed>80, decreases speed down to minimum of 80)
        if (this.player.spe100 > 80 && this.changes < this.changeLimit && rand(3) === 0) {
            this.outputText("\n\nYou feel like resting high in the trees and waiting for your unsuspecting prey to wander below so you can take them without having to exert yourself.  What an odd thought!");
            this.dynStats("spe", -1.5);
        }
        // (increases sensitivity)
        if (this.changes < this.changeLimit && rand(3) === 0) {
            this.outputText("\n\nThe hairs on your arms and legs stand up straight for a few moments, detecting the airflow around you. Touch appears to be more receptive from now on.");
            this.dynStats("sen", 1);
        }
        // (Increase libido)
        if (this.changes < this.changeLimit && rand(3) === 0) {
            this.outputText("\n\nYou suddenly feel slightly needier, and your loins stir in quiet reminder that they could be seen to. The aftertaste hangs on your tongue and your teeth.  You wish there had been more.");
            this.dynStats("lib", 1);
        }
        // (increase toughness to 60)
        if (this.changes < this.changeLimit && rand(3) === 0 && this.player.tou100 < 60) {
            this.outputText("\n\nStretching languidly, you realize you're feeling a little tougher than before, almost as if you had a full-body shell of armor protecting your internal organs.  How strange.  You probe at yourself, and while your " + this.player.skinFurScales() + " doesn't feel much different, the underlying flesh does seem tougher.");
            this.dynStats("tou", 1);
        }
        // (decrease strength to 70)
        if (this.player.str100 > 70 && rand(3) === 0) {
            this.outputText("\n\nLethargy rolls through you while you burp noisily.  You rub at your muscles and sigh, wondering why you need to be strong when you could just sew up a nice sticky web to catch your enemies.  ");
            if (this.player.spiderScore() < 4) this.outputText("Wait, you're not a spider, that doesn't make any sense!");
            else this.outputText("Well, maybe you should put your nice, heavy abdomen to work.");
            this.dynStats("str", -1);
        }
        // ****************
        // Sexual Changes
        // ****************
        // Increase venom recharge
        if (this.player.tail.type == Tail.SPIDER_ABDOMEN && this.player.tail.recharge < 25 && this.changes < this.changeLimit) {
            this.changes++;
            this.outputText("\n\nThe spinnerets on your abdomen twitch and drip a little webbing.  The entirety of its heavy weight shifts slightly, and somehow you know you'll produce webs faster now.");
            this.player.tail.recharge += 5;
        }
        // (tightens vagina to 1, increases lust/libido)
        if (this.player.hasVagina()) {
            if (this.player.looseness() > 1 && this.changes < this.changeLimit && rand(3) === 0) {
                this.outputText("\n\nWith a gasp, you feel your " + this.player.vaginaDescript(0) + " tightening, making you leak sticky girl-juice. After a few seconds, it stops, and you rub on your " + this.player.vaginaDescript(0) + " excitedly. You can't wait to try this out!");
                this.dynStats("lib", 2, "lus", 25);
                this.changes++;
                this.player.vaginas[0].vaginalLooseness--;
            }
        }
        // (tightens asshole to 1, increases lust)
        if (this.player.ass.analLooseness > 1 && this.changes < this.changeLimit && rand(3) === 0) {
            this.outputText("\n\nYou let out a small cry as your " + this.player.assholeDescript() + " shrinks, becoming smaller and tighter. When it's done, you feel much hornier and eager to stretch it out again.");
            this.dynStats("lib", 2, "lus", 25);
            this.changes++;
            this.player.ass.analLooseness--;
        }
        // [Requires penises]
        // (Thickens all cocks to a ratio of 1\" thickness per 5.5\"
        if (this.player.hasCock() && this.changes < this.changeLimit && rand(4) === 0) {
            // Use temp to see if any dicks can be thickened
            temp = 0;
            let counter = 0;
            while (counter < this.player.cockTotal()) {
                if (this.player.cocks[counter].cockThickness * 5.5 < this.player.cocks[counter].cockLength) {
                    this.player.cocks[counter].cockThickness += .1;
                    temp = 1;
                }
                counter++;
            }
            // If something got thickened
            if (temp == 1) {
                this.outputText("\n\nYou can feel your " + this.player.multiCockDescriptLight() + " filling out in your " + this.player.armorName + ". Pulling ");
                if (this.player.cockTotal() == 1) {
                    this.outputText("it");
                } else {
                    this.outputText("them");
                }

                this.outputText(" out, you look closely.  ");

                if (this.player.cockTotal() === 1) {
                    this.outputText("It's");
                } else {
                    this.outputText("They're");
                }

                this.outputText(" definitely thicker.");
                this.changes++;
            }
        }
        // [Increase to Breast Size] - up to Large DD
        if (this.player.smallestTitSize() < 6 && this.changes < this.changeLimit && rand(4) === 0) {
            this.outputText("\n\nAfter eating it, your chest aches and tingles, and your hands reach up to scratch at it unthinkingly.  Silently, you hope that you aren't allergic to it.  Just as you start to scratch at your " + this.player.breastDescript(this.player.smallestTitRow()) + ", your chest pushes out in slight but sudden growth.");
            this.player.breastRows[this.player.smallestTitRow()].breastRating++;
            this.changes++;
        }
        // [Increase to Ass Size] - to 11
        if (this.player.butt.rating < 11 && this.changes < this.changeLimit && rand(4) === 0) {
            this.outputText("\n\nYou look over your shoulder at your " + this.player.buttDescript() + " only to see it expand just slightly. You gape in confusion before looking back at the remaining silk in your hands. You finish it anyway. Dammit!");
            this.player.butt.rating++;
            this.changes++;
        }
        // Neck restore
        if (this.player.neck.type !== Neck.NORMAL && this.changes < this.changeLimit && rand(4) === 0) {
            this.mutations.restoreNeck(tfSource);
        }
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && rand(5) === 0) {
            this.mutations.restoreRearBody(tfSource);
        }
        // Ovi perk loss
        if (rand(5) === 0) {
            this.mutations.updateOvipositionPerk(tfSource);
        }

        // ***************
        // Appearance Changes
        // ***************
        // (Ears become pointed if not human)
        if (this.player.ears.type !== Ears.HUMAN && this.player.ears.type !== Ears.ELFIN && rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYour ears twitch once, twice, before starting to shake and tremble madly.  They migrate back towards where your ears USED to be, so long ago, finally settling down before twisting and stretching, changing to become <b>new, pointed elfin ears.</b>");
            this.player.ears.type = Ears.ELFIN;
            this.changes++;
        }
        // (Fur/Scales fall out)
        if (!this.player.hasPlainSkin() && (this.player.ears.type == Ears.HUMAN || this.player.ears.type == Ears.ELFIN) && rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nA slowly-building itch spreads over your whole body, and as you idly scratch yourself, you find that your " + this.player.skinFurScales() + " ");
            if (this.player.hasScales()) this.outputText("are");
            else this.outputText("is");
            this.outputText(" falling to the ground, revealing flawless, almost pearly-white skin underneath.  <b>You now have pale white skin.</b>");
            this.player.skin.tone = "pale white";
            this.player.skin.adj = "";
            this.player.skin.type = Skin.PLAIN;
            this.player.skin.desc = "skin";
            this.player.underBody.restore();
            this.player.arms.updateClaws(this.player.arms.claws.type);
            this.changes++;
        }
        // (Gain human face)
        if (this.player.hasPlainSkin() && (this.player.face.type !== Face.SPIDER_FANGS && this.player.face.type !== Face.HUMAN) && this.changes < this.changeLimit && rand(4) === 0) {
            this.outputText("\n\nWracked by pain, your face slowly reforms into a perfect human shape.  Awed by the transformation, you run your fingers delicately over the new face, marvelling at the change.  <b>You have a human face again!</b>");
            this.player.face.type = Face.HUMAN;
            this.changes++;
        }
        // -Remove breast rows over 2.
        if (this.changes < this.changeLimit && this.player.bRows() > 2 && rand(3) === 0 && !this.flags[kFLAGS.HYPER_HAPPY]) {
            this.mutations.removeExtraBreastRow(tfSource);
        }
        // -Nipples reduction to 1 per tit.
        if (this.player.averageNipplesPerBreast() > 1 && this.changes < this.changeLimit && rand(4) === 0) {
            this.outputText("\n\nA chill runs over your " + this.player.allBreastsDescript() + " and vanishes.  You stick a hand under your " + this.player.armorName + " and discover that your extra nipples are missing!  You're down to just one per ");
            if (this.player.biggestTitSize() < 1) this.outputText("'breast'.");
            else this.outputText("breast.");
            this.changes++;
            // Loop through and reset nipples
            for (temp = 0; temp < this.player.breastRows.length; temp++) {
                this.player.breastRows[temp].nipplesPerBreast = 1;
            }
        }
        // Nipples Turn Black:
        if (!this.player.hasStatusEffect(StatusEffects.BlackNipples) && rand(6) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nA tickling sensation plucks at your nipples and you cringe, trying not to giggle.  Looking down you are in time to see the last spot of flesh tone disappear from your [nipples].  They have turned an onyx black!");
            this.player.createStatusEffect(StatusEffects.BlackNipples, 0, 0, 0, 0);
            this.changes++;
        }
        // eyes!
        if (this.player.hasPlainSkin() && !this.player.hasSpiderEyes() && rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou suddenly get the strangest case of double vision; you stumble and blink around, clutching your face,"
                + " but you draw your hands back when you poke yourself in the eye. Wait, those fingers were on your forehead!"
                + " You tentatively run your fingertips across your forehead, not quite believing what you felt."
                + " <b>There's now a pair of eyes on your forehead, positioned just above your normal ones!</b>"
                + " This will take some getting used to!");
            this.dynStats("int", 5);
            this.player.eyes.setType(Eyes.SPIDER);
            this.changes++;
        }
        // (Gain spider fangs)
        if (this.player.face.type == Face.HUMAN && this.player.hasPlainSkin() && this.changes < this.changeLimit && rand(4) === 0) {
            this.outputText("\n\nTension builds within your upper gum, just above your canines.  You open your mouth and prod at the affected area, pricking your finger on the sharpening tooth.  It slides down while you're touching it, lengthening into a needle-like fang.  You check the other side and confirm your suspicions.  <b>You now have a pair of pointy spider-fangs, complete with their own venom!</b>");
            this.player.face.type = Face.SPIDER_FANGS;
            this.changes++;
        }
        // (Arms to carapace-covered arms)
        if (this.player.arms.type !== Arms.SPIDER && this.changes < this.changeLimit && rand(4) === 0) {
            this.outputText("\n\n");
            // (Bird pretext)
            if (this.player.arms.type == Arms.HARPY) this.outputText("The feathers covering your arms fall away, leaving them to return to a far more human appearance.  ");
            this.outputText("You watch, spellbound, while your forearms gradually become shiny.  The entire outer structure of your arms tingles while it divides into segments, <b>turning the " + this.player.skinFurScales() + " into a shiny black carapace</b>.  You touch the onyx exoskeleton and discover to your delight that you can still feel through it as naturally as your own skin.");
            this.player.arms.setType(Arms.SPIDER);
            this.changes++;
        }
        if (rand(4) === 0 && this.changes < this.changeLimit && this.player.lowerBody.type !== LowerBody.DRIDER && this.player.lowerBody.type !== LowerBody.CHITINOUS_SPIDER_LEGS) {
            this.mutations.restoreLegs(tfSource);
        }
        // Drider butt
        if (type === SweetGossamer.DRIDER && this.player.findPerk(PerkLib.SpiderOvipositor) < 0 && this.player.isDrider() && this.player.tail.type == Tail.SPIDER_ABDOMEN && this.changes < this.changeLimit && rand(3) === 0 && (this.player.hasVagina || rand(2) === 0)) {
            this.outputText("\n\nAn odd swelling sensation floods your spider half.  Curling your abdomen underneath you for a better look, you gasp in recognition at your new 'equipment'!  Your semi-violent run-ins with the swamp's population have left you <i>intimately</i> familiar with the new appendage.  <b>It's a drider ovipositor!</b>  A few light prods confirm that it's just as sensitive as any of your other sexual organs.  You idly wonder what laying eggs with this thing will feel like...");
            this.outputText("\n\n(<b>Perk Gained:  Spider Ovipositor - Allows you to lay eggs in your foes!</b>)");
            // V1 - Egg Count
            // V2 - Fertilized Count
            this.player.createPerk(PerkLib.SpiderOvipositor, 0, 0, 0, 0);
            // Opens up drider ovipositor scenes from available mobs. The character begins producing unfertilized eggs in their arachnid abdomen. Egg buildup raises minimum lust and eventually lowers speed until the player has gotten rid of them.  This perk may only be used with the drider lower body, so your scenes should reflect that.
            // Any PC can get an Ovipositor perk, but it will be much rarer for characters without vaginas.
            // Eggs are unfertilized by default, but can be fertilized:
            // -female/herm characters can fertilize them by taking in semen; successfully passing a pregnancy check will convert one level ofunfertilized eggs to fertilized, even if the PC is already pregnant.
            // -male/herm characters will have a sex dream if they reach stage three of unfertilized eggs; this will represent their bee/drider parts drawing their own semen from their body to fertilize the eggs, and is accompanied by a nocturnal emission.
            // -unsexed characters cannot currently fertilize their eggs.
            // Even while unfertilized, eggs can be deposited inside NPCs - obviously, unfertilized eggs will never hatch and cannot lead to any egg-birth scenes that may be written later.
            this.changes++;
        }
        // (Normal Biped Legs -> Carapace-Clad Legs)
        if (((type === SweetGossamer.DRIDER && this.player.lowerBody.type !== LowerBody.DRIDER && this.player.lowerBody.type !== LowerBody.CHITINOUS_SPIDER_LEGS) || (type !== 1 && this.player.lowerBody.type !== LowerBody.CHITINOUS_SPIDER_LEGS)) && (!this.player.isGoo() && !this.player.isNaga() && !this.player.isTaur()) && this.changes < this.changeLimit && rand(4) === 0) {
            this.outputText("\n\nStarting at your " + this.player.feet() + ", a tingle runs up your " + this.player.legs() + ", not stopping until it reaches your thighs.  From the waist down, your strength completely deserts you, leaving you to fall hard on your " + this.player.buttDescript() + " in the dirt.  With nothing else to do, you look down, only to be mesmerized by the sight of black exoskeleton creeping up a perfectly human-looking calf.  It crests up your knee to envelop the joint in a many-faceted onyx coating.  Then, it resumes its slow upward crawl, not stopping until it has girded your thighs in glittery, midnight exoskeleton.  From a distance it would look almost like a black, thigh-high boot, but you know the truth.  <b>You now have human-like legs covered in a black, arachnid exoskeleton.</b>");
            this.player.lowerBody.type = LowerBody.CHITINOUS_SPIDER_LEGS;
            this.player.lowerBody.legCount = 2;
            this.changes++;
        }
        // (Tail becomes spider abdomen GRANT WEB ATTACK)
        if (this.player.tail.type !== Tail.SPIDER_ABDOMEN && (this.player.lowerBody.type == LowerBody.CHITINOUS_SPIDER_LEGS || this.player.lowerBody.type == LowerBody.DRIDER) && this.player.arms.type == Arms.SPIDER && rand(4) === 0) {
            this.outputText("\n\n");
            // (Pre-existing tails)
            if (this.player.tail.type > Tail.NONE) this.outputText("Your tail shudders as heat races through it, twitching violently until it feels almost as if it's on fire.  You jump from the pain at your " + this.player.buttDescript() + " and grab at it with your hands.  It's huge... and you can feel it hardening under your touches, firming up until the whole tail has become rock-hard and spherical in shape.  The heat fades, leaving behind a gentle warmth, and you realize your tail has become a spider's abdomen!  With one experimental clench, you even discover that it can shoot webs from some of its spinnerets, both sticky and non-adhesive ones.  That may prove useful.  <b>You now have a spider's abdomen hanging from above your " + this.player.buttDescript() + "!</b>\n\n");
            // (No tail)
            else this.outputText("A burst of pain hits you just above your " + this.player.buttDescript() + ", coupled with a sensation of burning heat and pressure.  You can feel your " + this.player.skinFurScales() + " tearing as something forces its way out of your body.  Reaching back, you grab at it with your hands.  It's huge... and you can feel it hardening under your touches, firming up until the whole tail has become rock-hard and spherical in shape.  The heat fades, leaving behind a gentle warmth, and you realize your tail has become a spider's abdomen!  With one experimental clench, you even discover that it can shoot webs from some of its spinnerets, both sticky and non-adhesive ones.  That may prove useful.  <b>You now have a spider's abdomen hanging from above your " + this.player.buttDescript() + "!</b>");
            this.player.tail.type = Tail.SPIDER_ABDOMEN;
            this.player.tail.venom = 5;
            this.player.tail.recharge = 5;
            this.changes++;
        }
        // (Drider Item Only: Carapace-Clad Legs to Drider Legs)
        if (type === SweetGossamer.DRIDER && this.player.lowerBody.type == LowerBody.CHITINOUS_SPIDER_LEGS && rand(4) === 0 && this.player.tail.type == Tail.SPIDER_ABDOMEN) {
            this.outputText("\n\nJust like when your legs changed to those of a spider-morph, you find yourself suddenly paralyzed below the waist.  Your dark, reflective legs splay out and drop you flat on your back.   Before you can sit up, you feel tiny feelers of pain mixed with warmth and tingling running through them.  Terrified at the thought of all the horrible changes that could be wracking your body, you slowly sit up, expecting to find yourself turned into some incomprehensible monstrosity from the waist down.  As if to confirm your suspicions, the first thing you see is that your legs have transformed into eight long, spindly legs.  Instead of joining directly with your hips, they now connect with the spider-like body that has sprouted in place of where your legs would normally start.  Your abdomen has gotten even larger as well.  Once the strength returns to your new, eight-legged lower body, you struggle up onto your pointed 'feet', and wobble around, trying to get your balance.  As you experiment with your new form, you find you're even able to twist the spider half of your body down between your legs in an emulation of your old, bipedal stance.  That might prove useful should you ever want to engage in 'normal' sexual positions, particularly since your " + this.player.buttDescript() + " is still positioned just above the start of your arachnid half.  <b>You're now a drider.</b>");
            this.player.lowerBody.type = LowerBody.DRIDER;
            this.player.lowerBody.legCount = 8;
            this.changes++;
        }
        // Remove gills
        if (rand(4) === 0 && this.player.hasGills() && this.changes < this.changeLimit) {
            this.mutations.updateGills();
        }

        if (this.changes == 0) {
            this.outputText("\n\nThe sweet silk energizes you, leaving you feeling refreshed.");
            this.player.changeFatigue(-33);
        }
        this.player.refillHunger(5);
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;

        return false;
    }
}
