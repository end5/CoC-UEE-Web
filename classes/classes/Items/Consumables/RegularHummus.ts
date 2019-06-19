import { Consumable } from "../Consumable";
import { rand } from "../../Extra";
import { PerkLib } from "../../PerkLib";
import { Neck } from "../../BodyParts/Neck";
import { ColorLists } from "../../lists/ColorLists";
import { Ears } from "../../BodyParts/Ears";
import { Face } from "../../BodyParts/Face";
import { Tongue } from "../../BodyParts/Tongue";
import { Eyes } from "../../BodyParts/Eyes";
import { StatusEffects } from "../../StatusEffects";
import { Hair } from "../../BodyParts/Hair";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { Antennae } from "../../BodyParts/Antennae";
import { Horns } from "../../BodyParts/Horns";
import { Wings } from "../../BodyParts/Wings";
import { RearBody } from "../../BodyParts/RearBody";
import { Tail } from "../../BodyParts/Tail";
import { CockTypesEnum } from "../../CockTypesEnum";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

/**
 * Human transformative item.
 */
export class RegularHummus extends Consumable {
    private static ITEM_VALUE: number = 100;

    public constructor() {
        super("Hummus ", "Hummanus", "a jar of cheesy-looking hummus", RegularHummus.ITEM_VALUE, "This small clay jar contains a substance known as hummus. Given the label, it's probably going to help you regain lost humanity.");
    }

    public useItem(): boolean {
        const tfSource: string = "regularHummus";
        let temp: number = 0;

        this.mutations.initTransformation([2, 2]);
        this.clearOutput();
        this.outputText("You crack open the small clay jar to reveal a lightly colored paste that smells surprisingly delicious. You begin eating it with your fingers, wishing all the while for some crackers...");
        this.player.refillHunger(10);
        if (this.player.humanScore() > 4) {
            this.outputText("\n\nYou blink and the world twists around you. You feel more like yourself than you have in a while, but exactly how isn't immediately apparent. Maybe you should take a look at yourself?");
        }
        else {
            this.outputText("\n\nYou cry out as the world spins around you. You're aware of your entire body sliding and slipping, changing and morphing, but in the sea of sensation you have no idea exactly what's changing. You nearly black out, and then it's over. Maybe you had best have a look at yourself and see what changed?");
        }
        // -----------------------
        // MAJOR TRANSFORMATIONS
        // -----------------------
        // 1st priority: Change lower body to bipedal.
        if (rand(4) === 0 && this.changes < this.changeLimit) {
            this.mutations.restoreLegs(tfSource);
        }
        // Remove Oviposition Perk
        if (rand(5) === 0) {
            this.mutations.updateOvipositionPerk(tfSource);
        }
        // Remove ghost legs
        if (this.player.lowerBody.incorporeal && this.changes < this.changeLimit && rand(4) === 0) {
            this.outputText("\n\nYou feel a strange sensation in your [legs] as they start to feel more solid. They become more opaque until finally, you can no longer see through your [legs].");
            this.player.lowerBody.incorporeal = false;
            this.changes++;
        }
        // Remove Incorporeality Perk, if not permanent
        if (this.player.hasPerk(PerkLib.Incorporeality) && this.player.perkv4(PerkLib.Incorporeality) === 0 && this.changes < this.changeLimit && rand(4) === 0) {
            this.outputText("\n\nYour body somehow feels more solid, more substantial than it did a moment ago, and the constant hum of ghostly spiritual imagery in your mind's eye has vanished as well. You concentrate for a few seconds, trying to push yourself back into an incorporeal state, but you just can't seem to do it anymore. \n<b>(Perk Lost: Incorporeality!)</b>");
            this.player.removePerk(PerkLib.Incorporeality);
            this.changes++;
        }
        // Restore neck
        if (this.player.neck.type != Neck.NORMAL && this.changes < this.changeLimit && rand(5) == 0)
            this.mutations.restoreNeck(tfSource);
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && rand(5) == 0) this.mutations.restoreRearBody(tfSource);
        // -Skin color change – light, fair, olive, dark, ebony, mahogany, russet
        if (ColorLists.HUMAN_SKIN.indexOf(this.player.skin.tone) === -1 && this.changes < this.changeLimit && rand(5) === 0) {
            this.changes++;
            this.outputText("\n\nIt takes a while for you to notice, but <b>");
            if (this.player.hasFur()) this.outputText("the skin under your " + this.player.skin.furColor + " " + this.player.skin.desc);
            else this.outputText("your " + this.player.skin.desc);
            this.outputText(" has changed to become ");
            this.player.skin.tone = RegularHummus.randomChoice(ColorLists.HUMAN_SKIN);
            this.outputText(this.player.skin.tone + " colored.</b>");
            this.player.underBody.skin.tone = this.player.skin.tone;
            this.player.arms.updateClaws(this.player.arms.claws.type);
        }
        // Change skin to normal
        if (!this.player.hasPlainSkin() && (this.player.ears.type === Ears.HUMAN || this.player.ears.type === Ears.ELFIN) && rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nA slowly-building itch spreads over your whole body, and as you idly scratch yourself, you find that your " + this.player.skinFurScales() + " ");
            if (this.player.hasScales()) this.outputText("are");
            else this.outputText("is");
            this.outputText(" falling to the ground, revealing flawless skin below.  <b>You now have normal skin.</b>");

            this.player.skin.restore();
            this.player.underBody.restore();
            this.changes++;
        }
        // Restore arms to become human arms again
        if (rand(4) === 0) {
            this.mutations.restoreArms(tfSource);
        }
        // -----------------------
        // MINOR TRANSFORMATIONS
        // -----------------------
        // -Human face
        if (this.player.face.type !== Face.HUMAN && this.changes < this.changeLimit && rand(4) === 0) {
            this.outputText("\n\nSudden agony sweeps over your " + this.player.faceDescript() + ", your visage turning hideous as bones twist and your jawline shifts. The pain slowly vanishes, leaving you weeping into your fingers. When you pull your hands away you realize you've been left with a completely normal, human face.");
            this.player.face.type = Face.HUMAN;
            this.changes++;
        }
        // -Human tongue
        if (this.player.tongue.type !== Tongue.HUMAN && this.changes < this.changeLimit && rand(4) === 0) {
            this.outputText("\n\nYou feel something strange inside your face as your tongue shrinks and recedes until it feels smooth and rounded.  <b>You realize your tongue has changed back into human tongue!</b>");
            this.player.tongue.type = Tongue.HUMAN;
            this.changes++;
        }
        // Remove odd eyes
        if (this.changes < this.changeLimit && rand(5) === 0 && this.player.eyes.type !== Eyes.HUMAN) {
            if (this.player.eyes.type === Eyes.BLACK_EYES_SAND_TRAP) {
                this.outputText("\n\nYou feel a twinge in your eyes and you blink. It feels like black cataracts have just fallen away from you, and you know without needing to see your reflection that your eyes have gone back to looking human.");
            }
            else {
                this.outputText("\n\nYou blink and stumble, a wave of vertigo threatening to pull your " + this.player.feet() + " from under you. As you steady and open your eyes, you realize something seems different. Your vision is changed somehow.");
                if (this.player.eyes.type === Eyes.FOUR_SPIDER_EYES || this.player.eyes.type === Eyes.SPIDER) this.outputText(" <b>Your arachnid eyes are gone!</b>");
                this.outputText(" <b>You have normal, humanoid eyes again.</b>");
            }
            this.player.eyes.type = Eyes.HUMAN;
            this.player.eyes.count = 2;
            this.changes++;
        }
        // -Gain human ears (If you have human face)
        if ((this.player.ears.type !== Ears.HUMAN && this.player.face.type === Face.HUMAN) && this.changes < this.changeLimit && rand(4) === 0) {
            this.outputText("\n\nOuch, your head aches! It feels like your ears are being yanked out of your head, and when you reach up to hold your aching noggin, you find they've vanished! Swooning and wobbling with little sense of balance, you nearly fall a half-dozen times before <b>a pair of normal, human ears sprout from the sides of your head.</b> You had almost forgotten what human ears felt like!");
            this.player.ears.type = Ears.HUMAN;
            this.changes++;
        }
        // Removes gills
        if (rand(4) === 0 && this.player.hasGills() && this.changes < this.changeLimit) {
            this.mutations.updateGills();
        }
        // Nipples Turn Back:
        if (this.player.hasStatusEffect(StatusEffects.BlackNipples) && this.changes < this.changeLimit && rand(3) === 0) {
            this.mutations.removeBlackNipples(tfSource);
        }
        // Hair turns normal
        if (this.changes < this.changeLimit && this.player.hair.type !== Hair.NORMAL && rand(3) === 0) {
            this.outputText("\n\nYou run a hand along the top of your head as you feel your scalp tingle, and feel something weird. You pull your hand away and look at the nearest reflective surface. <b>Your hair is normal again!</b>");
            this.player.hair.type = Hair.NORMAL;
            if (this.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] !== 0) this.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] = 0;
            this.changes++;
        }
        // Restart hair growth, if hair's normal but growth isn't on. Or just over turning hair normal. The power of rng.
        if (this.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] !== 0 && this.changes < this.changeLimit && rand(3) === 0) {
            this.outputText("\n\nYou feel an itching sensation in your scalp as you realize the change. <b>Your hair is growing normally again!</b>");
            // Turn hair growth on.
            this.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] = 0;
            this.player.hair.type = Hair.NORMAL;
            this.changes++;
        }
        // -----------------------
        // EXTRA PARTS REMOVAL
        // -----------------------
        // Removes antennae
        if (this.player.antennae.type !== Antennae.NONE && rand(3) === 0 && this.changes < this.changeLimit) {
            this.mutations.removeAntennae();
        }
        // Removes horns
        if (this.changes < this.changeLimit && (this.player.horns.type !== Horns.NONE || this.player.horns.value !== 0) && rand(5) === 0) {
            this.outputText("\n\nYour ");
            if (this.player.horns.type === Horns.UNICORN || this.player.horns.type === Horns.RHINO) this.outputText("horn");
            else this.outputText("horns");
            this.outputText(" crumble, falling apart in large chunks until they flake away to nothing.");
            this.player.horns.value = 0;
            this.player.horns.type = Horns.NONE;
            this.changes++;
        }
        // Removes wings
        if ((this.player.wings.type !== Wings.NONE || this.player.rearBody.type == RearBody.SHARK_FIN) && rand(5) === 0 && this.changes < this.changeLimit) {
            this.mutations.removeWings(tfSource);
        }
        // Removes tail
        if (this.player.tail.type !== Tail.NONE && rand(5) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou feel something shifting in your backside. Then something detaches from your backside and it falls onto the ground.  <b>You no longer have a tail!</b>");
            this.player.tail.type = Tail.NONE;
            this.player.tail.venom = 0;
            this.player.tail.recharge = 5;
            this.changes++;
        }
        // Increase height up to 4ft 10in.
        if (rand(2) === 0 && this.changes < this.changeLimit && this.player.tallness < 58) {
            temp = rand(5) + 3;
            // Flavor texts.  Flavored like 1950's cigarettes. Yum.
            if (temp < 5) this.outputText("\n\nYou shift uncomfortably as you realize you feel off balance.  Gazing down, you realize you have grown SLIGHTLY taller.");
            if (temp >= 5 && temp < 7) this.outputText("\n\nYou feel dizzy and slightly off, but quickly realize it's due to a sudden increase in height.");
            if (temp === 7) this.outputText("\n\nStaggering forwards, you clutch at your head dizzily.  You spend a moment getting your balance, and stand up, feeling noticeably taller.");
            this.player.tallness += temp;
            this.changes++;
        }
        // Decrease height down to a maximum of 6ft 2in.
        if (rand(2) === 0 && this.changes < this.changeLimit && this.player.tallness > 74) {
            this.outputText("\n\nYour skin crawls, making you close your eyes and shiver.  When you open them again the world seems... different.  After a bit of investigation, you realize you've become shorter!\n");
            this.player.tallness -= 3 + rand(5);
            this.changes++;
        }
        // -----------------------
        // SEXUAL TRANSFORMATIONS
        // -----------------------
        // Remove additional cocks
        if (this.player.totalCocks() > 1 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.player.killCocks(1);
            this.outputText("\n\nYou have a strange feeling as your crotch tingles.  Opening your " + this.player.armorName + ", <b>you realize that one of your cocks have vanished completely!</b>");
            this.changes++;
        }
        // Remove additional balls/remove uniball
        if ((this.player.balls > 0 || this.player.hasStatusEffect(StatusEffects.Uniball)) && rand(3) === 0 && this.changes < this.changeLimit) {
            if (this.player.ballSize > 2) {
                if (this.player.ballSize > 5) this.player.ballSize -= 1 + rand(3);
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
            else kGAMECLASS.doNothing(); // Basically, you rolled this because you have ball/s, but don't fit any of the above. Failsafe for weirdness.
        }
        // Change cock back to normal
        if (this.player.hasCock() && this.changes < this.changeLimit) {
            let temp2: number = 0;
            let temp3: number = 0;
            // Select first non-human cock
            temp = this.player.cocks.length;
            while (temp > 0 && temp2 === 0) {
                temp--;
                // Store cock index if not a human cock and exit loop
                if (this.player.cocks[temp].cockType !== CockTypesEnum.HUMAN) {
                    temp3 = temp;
                    // Kicking out of the while loop
                    temp2 = 1000;
                }
            }
            if (rand(3) === 0 && this.player.cocks[temp3].cockType !== CockTypesEnum.HUMAN) {
                this.outputText("\n\nA strange tingling begins behind your " + this.player.cockDescript(temp3) + ", slowly crawling up across its entire length.  While neither particularly arousing nor uncomfortable, you do shift nervously as the feeling intensifies.  You resist the urge to undo your " + this.player.armorName + " to check, but by the feel of it, your penis is shifting form.  Eventually the transformative sensation fades, <b>leaving you with a completely human penis.</b>");
                this.player.cocks[temp3].cockType = CockTypesEnum.HUMAN;
                this.changes++;
            }
            else kGAMECLASS.doNothing(); // If you entered but all your dicks are human
        }
        // Shrink oversized cocks
        if (this.player.hasCock() && this.player.biggestCockLength() > 7 && rand(3) === 0 && this.changes < this.changeLimit) {
            const idx: number = this.player.biggestCockIndex();
            if (this.player.cocks.length === 1) this.outputText("\n\nYou feel a tingling sensation as your cock shrinks to a smaller size!");
            else this.outputText("\n\nYou feel a tingling sensation as the largest of your cocks shrinks to a smaller size!");
            this.player.cocks[idx].cockLength -= (rand(10) + 2) / 10;
            if (this.player.cocks[idx].cockThickness > 1) {
                this.outputText(" Your " + this.player.cockDescript(idx) + " definitely got a bit thinner as well.");
                this.player.cocks[idx].cockThickness -= (rand(4) + 1) / 10;
            }
            this.changes++;
        }
        // Remove additional breasts
        if (this.changes < this.changeLimit && this.player.breastRows.length > 1 && rand(3) === 0) {
            this.mutations.removeExtraBreastRow(tfSource);
        }
        // Remove extra nipples
        if (this.player.averageNipplesPerBreast() > 1 && rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nA tightness arises in your nipples as three out of four on each breast recede completely, the leftover nipples migrating to the middle of your breasts.  <b>You are left with only one nipple on each breast.</b>");
            for (let x: number = 0; x < this.player.bRows(); x++) {
                this.player.breastRows[x].nipplesPerBreast = 1;
            }
            this.changes++;
        }
        // Shrink tits!
        if (this.changes < this.changeLimit && rand(3) === 0 && this.player.biggestTitSize() > 4) {
            this.player.shrinkTits();
            this.changes++;
        }
        // Change vagina back to normal
        if (this.changes < this.changeLimit && rand(3) === 0 && this.player.vaginaType() === 5 && this.player.hasVagina()) {
            this.outputText("\n\nSomething invisible brushes against your sex, making you twinge.  Undoing your clothes, you take a look at your vagina and find that it has turned back to its natural flesh colour.");
            this.player.vaginaType(0);
            this.changes++;
        }
        // Reduce wetness down to a minimum of 2
        if (this.changes < this.changeLimit && rand(3) === 0 && this.player.hasVagina() && this.player.vaginas[0].vaginalWetness > 2) {
            this.outputText("\n\nThe constant flow of fluids that sluice from your " + this.player.vaginaDescript(0) + " slow down, leaving you feeling a bit less like a sexual slip-'n-slide.");
            this.player.vaginas[0].vaginalWetness--;
            this.changes++;
        }
        // Fertility Decrease:
        if (this.player.hasVagina() && this.player.fertility > 10 && rand(3) === 0 && this.changes < this.changeLimit) {
            // High fertility:
            if (this.player.fertility >= 30) this.outputText("\n\nIt feels like your overcharged reproductive organs have simmered down a bit.");
            // Average fertility:
            else this.outputText("\n\nYou feel like you have dried up a bit inside; you are left feeling oddly tranquil.");
            this.player.fertility -= 1 + rand(3);
            if (this.player.fertility < 10) this.player.fertility = 10;
            this.changes++;
        }
        // Cum Multiplier Decrease:
        if (this.player.hasCock() && this.player.cumMultiplier > 5 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou feel a strange tingling sensation in your ");
            if (this.player.balls > 0) this.outputText("balls");
            else this.outputText("groin");
            this.outputText(" as you can feel the density reducing. You have a feeling you're going to produce less cum now.");
            this.player.cumMultiplier -= (1 + (rand(20) / 10));
            if (this.player.cumMultiplier < 1) this.player.cumMultiplier = 1; // How would this even happen o_O
            this.changes++;
        }
        // Anal wetness decrease
        if (this.player.ass.analWetness > 0 && rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nAn uncomfortable, suction-esque feeling suddenly starts in your [ass], and leaves things feeling drier than before. <b>Your asshole is slightly less wet.</b>");
            this.player.ass.analWetness--;
            this.changes++;
        }
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;

        return false;
    }
}
