import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";
import { Neck } from "../../BodyParts/Neck";
import { CockTypesEnum } from "../../CockTypesEnum";
import { Ears } from "../../BodyParts/Ears";
import { Tail } from "../../BodyParts/Tail";
import { LowerBody } from "../../BodyParts/LowerBody";
import { Face } from "../../BodyParts/Face";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

export class PigTruffle extends Consumable {

    public constructor(boar: boolean) {
        super(boar ? "BoarTru" : "PigTruf", boar ? "BoarTruffle" : "PigTruffle", boar ? "a boar truffle" : "a pigtail truffle", ConsumableLib.DEFAULT_VALUE, boar ? "It’s clear where this fungus gets its name. A small, curly sprig resembling a pig’s tail can be seen jutting out of it. Now that it’s been enhanced by Lumi, it’s larger and fuzzier than it was before, almost like a peach." : "It’s clear where this fungus gets its name. A small, curly sprig resembling a pig’s tail can be seen jutting out of it.");
    }

    public useItem(): boolean {
        this.pigTruffle(this.id == "BoarTru");
        return false;
    }

    public pigTruffle(boar: boolean): void {
        let tfSource: string = "pigTruffle";
        if (boar) tfSource += "-boar";

        this.mutations.initTransformation([2, 2, 3], boar ? 2 : 1);
        this.outputText("You take a bite into the pigtail truffle. It oddly tastes like bacon. You eventually finish eating. ");
        this.player.refillHunger(20);
        // -----------------------
        // SIZE MODIFICATIONS
        // -----------------------
        // Increase thickness
        if (rand(3) === 0 && this.changes < this.changeLimit && this.player.thickness < 75) {
            this.outputText(this.player.modThickness(75, 3));
            this.changes++;
        }
        // Decrease muscle tone
        if (rand(3) === 0 && this.changes < this.changeLimit && this.player.gender >= 2 && this.player.tone > 20) {
            this.outputText(this.player.modTone(20, 4));
            this.changes++;
        }
        // Increase hip rating
        if (rand(3) === 0 && this.changes < this.changeLimit && this.player.gender >= 2 && this.player.hips.rating < 15) {
            this.outputText("\n\nYour gait shifts slightly to accommodate your widening " + this.player.hipDescript() + ". The change is subtle, but they're definitely broader.");
            this.player.hips.rating++;
            this.changes++;
        }
        // Increase ass rating
        if (rand(3) === 0 && this.changes < this.changeLimit && this.player.butt.rating < 12) {
            this.outputText("\n\nWhen you stand back, up your [ass] jiggles with a good bit of extra weight.");
            this.player.butt.rating++;
            this.changes++;
        }
        // Increase ball size if you have balls.
        if (rand(3) === 0 && this.changes < this.changeLimit && this.player.balls > 0 && this.player.ballSize < 4) {
            if (this.player.ballSize < 3)
                this.outputText("\n\nA flash of warmth passes through you and a sudden weight develops in your groin. You pause to examine the changes and your roving fingers discover your " + (this.player.balls == 4 ? "quartette" : "duo") + " of [balls] have grown larger than a human’s.");
            else
                this.outputText("\n\nA sudden onset of heat envelops your groin, focusing on your ballsack. Walking becomes difficult as you discover your " + (this.player.balls == 4 ? "quartette" : "duo") + " of testicles have enlarged again.");
            this.player.ballSize++;
            this.changes++;
        }
        // Neck restore
        if (this.player.neck.type !== Neck.NORMAL && this.changes < this.changeLimit && rand(4) === 0) {
            this.mutations.restoreNeck(tfSource);
        }
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && rand(5) === 0) this.mutations.restoreRearBody(tfSource);
        // Ovi perk loss
        if (rand(5) === 0) this.mutations.updateOvipositionPerk(tfSource);
        // -----------------------
        // TRANSFORMATIONS
        // -----------------------
        // Gain pig cock, independent of other pig TFs.
        if (rand(4) === 0 && this.changes < this.changeLimit && this.player.hasCockNotOfType(CockTypesEnum.PIG)) {
            if (this.player.cocks.length == 1) { // Single cock
                this.outputText("\n\nYou feel an uncomfortable pinching sensation in your [cock]. " + this.player.clothedOrNakedLower("You pull open your [armor]", "You look down at your exposed groin") + ", watching as it warps and changes. As the transformation completes, you’re left with a shiny, pinkish red pecker ending in a prominent corkscrew at the tip. <b>You now have a pig penis!</b>");
                this.player.cocks[0].cockType = CockTypesEnum.PIG;
            }
            else { // Multiple cocks
                this.outputText("\n\nYou feel an uncomfortable pinching sensation in one of your cocks. You pull open your [armor], watching as it warps and changes. As the transformation completes, you’re left with a shiny pinkish red pecker ending in a prominent corkscrew at the tip. <b>You now have a pig penis!</b>");
                this.player.setFirstCockNotOfType(CockTypesEnum.PIG);
            }
            this.changes++;
        }
        // Gain pig ears!
        if (rand(boar ? 3 : 4) === 0 && this.changes < this.changeLimit && this.player.ears.type !== Ears.PIG) {
            this.outputText("\n\nYou feel a pressure on your ears as they begin to reshape. Once the changes finish, you flick them about experimentally, <b>and you’re left with pointed, floppy pig ears.</b>");
            this.player.ears.type = Ears.PIG;
            this.changes++;
        }
        // Gain pig tail if you already have pig ears!
        if (rand(boar ? 2 : 3) === 0 && this.changes < this.changeLimit && this.player.ears.type == Ears.PIG && this.player.tail.type !== Tail.PIG) {
            if (this.player.tail.type > 0) // If you have non-pig tail.
                this.outputText("\n\nYou feel a pinching sensation in your [tail] as it begins to warp in change. When the sensation dissipates, <b>you are left with a small, curly pig tail.</b>");
            else // If you don't have a tail.
                this.outputText("\n\nYou feel a tug at the base of your spine as it lengthens ever so slightly. Looking over your shoulder, <b>you find that you have sprouted a small, curly pig tail.</b>");
            this.player.tail.type = Tail.PIG;
            this.changes++;
        }
        // Gain pig tail even when centaur, needs pig ears.
        if (rand(boar ? 2 : 3) === 0 && this.changes < this.changeLimit && this.player.ears.type == Ears.PIG && this.player.tail.type !== Tail.PIG && this.player.isTaur() && (this.player.lowerBody.type == LowerBody.HOOFED || this.player.lowerBody.type == LowerBody.PONY)) {
            this.outputText("\n\nThere is a tingling in your [tail] as it begins to warp and change. When the sensation dissipates, <b>you are left with a small, curly pig tail.</b> This new, mismatched tail looks a bit odd on your horse lower body.");
            this.player.tail.type = Tail.PIG;
            this.changes++;
        }
        // Turn your lower body into pig legs if you have pig ears and tail.
        if (rand(boar ? 3 : 4) === 0 && this.changes < this.changeLimit && this.player.ears.type == Ears.PIG && this.player.tail.type == Tail.PIG && this.player.lowerBody.type !== LowerBody.CLOVEN_HOOFED) {
            if (this.player.isTaur()) // Centaur
                this.outputText("\n\nYou scream in agony as a horrible pain racks your entire bestial lower half. Unable to take it anymore, you pass out. When you wake up, you’re shocked to find that you no longer have the animal's lower body. Instead, you only have two legs. They are digitigrade and end in cloven hooves. <b>You now have pig legs!</b>");
            else if (this.player.lowerBody.type == LowerBody.NAGA) // Naga
                this.outputText("\n\nYou scream in agony as a horrible pain racks the entire length of your snake-like coils. Unable to take it anymore, you pass out. When you wake up, you’re shocked to find that you no longer have the lower body of a snake. Instead, you only have two legs. They are digitigrade and end in cloven hooves. <b>You now have pig legs!</b>");
            else // Bipedal
                this.outputText("\n\nYou scream in agony as the bones in your legs break and rearrange. Once the pain subsides, you inspect your legs, finding that they are digitigrade and ending in cloven hooves. <b>You now have pig legs!</b>");
            this.player.lowerBody.type = LowerBody.CLOVEN_HOOFED;
            this.player.lowerBody.legCount = 2;
            this.changes++;
        }
        // Gain pig face when you have the first three pig TFs.
        if (rand(boar ? 2 : 3) === 0 && this.changes < this.changeLimit && this.player.ears.type == Ears.PIG && this.player.tail.type == Tail.PIG && this.player.lowerBody.type == LowerBody.CLOVEN_HOOFED && (this.player.face.type !== Face.PIG && this.player.face.type !== Face.BOAR)) {
            this.outputText("\n\nYou cry out in pain as the bones in your face begin to break and rearrange. You rub your face furiously in an attempt to ease the pain, but to no avail. As the sensations pass, you examine your face in a nearby puddle. <b>You nearly gasp in shock at the sight of your new pig face!</b>");
            this.player.face.type = Face.PIG;
            this.changes++;
        }
        // Gain boar face if you have pig face.
        if (rand(3) === 0 && this.changes < this.changeLimit && this.player.ears.type == Ears.PIG && this.player.tail.type == Tail.PIG && this.player.lowerBody.type == LowerBody.CLOVEN_HOOFED && this.player.face.type == Face.PIG) {
            this.outputText("\n\nYou cry out in pain as the bones in your face begin to break and rearrange. You rub your face furiously in an attempt to ease the pain, but to no avail. Your bottom teeth ache as well. What’s happening to you? As the sensations pass, you examine your face in a nearby puddle. <b>You nearly gasp in shock at the sight of your new tusky boar face!</b>");
            this.player.face.type = Face.BOAR;
            this.changes++;
        }
        // Change skin colour
        if (rand(boar ? 3 : 4) === 0 && this.changes < this.changeLimit) {
            const skinToBeChosen: string = PigTruffle.randomChoice(boar ? ["dark brown", "brown", "brown"] : ["pink", "tan", "sable"]);
            this.outputText("\n\nYour skin tingles ever so slightly as you skin’s color changes before your eyes. As the tingling diminishes, you find that your skin has turned " + skinToBeChosen + ".");
            this.player.skin.tone = skinToBeChosen;
            this.player.arms.updateClaws(this.player.arms.claws.type);
            this.getGame().rathazul.addMixologyXP(20);
            this.changes++;
        }
        if (this.changes == 0) {
            this.outputText("\n\nOddly, you do not feel any changes. Perhaps you're lucky? Or not.");
        }
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;
    }

}
