import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { Neck } from "../../BodyParts/Neck";
import { Face } from "../../BodyParts/Face";
import { Eyes } from "../../BodyParts/Eyes";
import { Tail } from "../../BodyParts/Tail";
import { Gills } from "../../BodyParts/Gills";
import { Skin } from "../../BodyParts/Skin";
import { Wings } from "../../BodyParts/Wings";
import { RearBody } from "../../BodyParts/RearBody";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

export class SharkTooth extends Consumable {

    public constructor(tiger: boolean) {
        super(tiger ? "TSTooth" : "Shark.T", tiger ? "TSTooth" : "Shark.T", tiger ? "a glowing tiger shark tooth" : "a sharp shark tooth", ConsumableLib.DEFAULT_VALUE, tiger ? "This looks like a normal shark tooth, though with an odd purple glow." : "A glinting white tooth, very sharp and intimidating.");
    }

    public useItem(): boolean {
        this.sharkTooth(this.id == "TSTooth" ? 1 : 0);
        return false;
    }

    public sharkTooth(type: number): void {
        let tfSource: string = "sharkTooth";
        if (type == 1) tfSource += "-tigershark";
        this.mutations.initTransformation([2, 2], 2);
        this.clearOutput();
        if (type == 0) this.outputText("You have no idea why, but you decide to eat the pointed tooth. To your surprise, it's actually quite brittle, turning into a fishy-tasting dust. You figure it must just be a tablet made to look like a shark's tooth.");
        else if (type == 1) this.outputText("You have no idea why, but you decide to eat the pointed, glowing tooth. To your surprise, it's actually quite brittle, crumbling into a fishy-tasting dust. Maybe it's just a tablet made to look like a shark's tooth.");
        // STATS
        // Increase strength 1-2 points (Up to 50) (60 for tiger)
        if (((this.player.str100 < 60 && type == 1) || this.player.str100 < 50) && SharkTooth.rand(3) === 0) {
            this.dynStats("str", 1 + SharkTooth.rand(2));
            this.outputText("\n\nA painful ripple passes through the muscles of your body.  It takes you a few moments, but you quickly realize you're a little bit stronger now.");
        }
        // Increase Speed 1-3 points (Up to 75) (100 for tigers)
        if (((this.player.spe100 < 100 && type == 1) || this.player.spe100 < 75) && SharkTooth.rand(3) === 0) {
            this.dynStats("spe", 1 + SharkTooth.rand(3));
            this.outputText("\n\nShivering without warning, you nearly trip over yourself as you walk.  A few tries later you realize your muscles have become faster.");
        }
        // Reduce sensitivity 1-3 Points (Down to 25 points)
        if (this.player.sens100 > 25 && SharkTooth.rand(1.5) === 0 && this.changes < this.changeLimit) {
            this.dynStats("sen", (-1 - SharkTooth.rand(3)));
            this.outputText("\n\nIt takes a while, but you eventually realize your body has become less sensitive.");
        }
        // Increase Libido 2-4 points (Up to 75 points) (100 for tigers)
        if (((this.player.lib100 < 100 && type == 1) || this.player.lib100 < 75) && SharkTooth.rand(3) === 0 && this.changes < this.changeLimit) {
            this.dynStats("lib", (1 + SharkTooth.rand(3)));
            this.outputText("\n\nA blush of red works its way across your skin as your sex drive kicks up a notch.");
        }
        // Decrease intellect 1-3 points (Down to 40 points)
        if (this.player.inte100 > 40 && SharkTooth.rand(3) === 0 && this.changes < this.changeLimit) {
            this.dynStats("int", -(1 + SharkTooth.rand(3)));
            this.outputText("\n\nYou shake your head and struggle to gather your thoughts, feeling a bit slow.");
        }
        // Smexual stuff!
        // -TIGGERSHARK ONLY: Grow a cunt (guaranteed if no gender)
        if (type == 1 && (this.player.gender == 0 || (!this.player.hasVagina() && this.changes < this.changeLimit && SharkTooth.rand(3) === 0))) {
            this.changes++;
            // (balls)
            if (this.player.balls > 0) this.outputText("\n\nAn itch starts behind your " + this.player.ballsDescriptLight() + ", but before you can reach under to scratch it, the discomfort fades. A moment later a warm, wet feeling brushes your " + this.player.sackDescript() + ", and curious about the sensation, <b>you lift up your balls to reveal your new vagina.</b>");
            // (dick)
            else if (this.player.hasCock()) this.outputText("\n\nAn itch starts on your groin, just below your " + this.player.multiCockDescriptLight() + ". You pull the manhood aside to give you a better view, and you're able to watch as <b>your skin splits to give you a new vagina, complete with a tiny clit.</b>");
            // (neither)
            else this.outputText("\n\nAn itch starts on your groin and fades before you can take action. Curious about the intermittent sensation, <b>you peek under your " + this.player.armorName + " to discover your brand new vagina, complete with pussy lips and a tiny clit.</b>");
            this.player.createVagina();
            this.player.setClitLength(.25);
            this.dynStats("sen", 10);
        }
        // WANG GROWTH - TIGGERSHARK ONLY
        if (type == 1 && (!this.player.hasCock()) && this.changes < this.changeLimit && SharkTooth.rand(3) === 0) {
            // Genderless:
            if (!this.player.hasVagina()) this.outputText("\n\nYou feel a sudden stabbing pain in your featureless crotch and bend over, moaning in agony. Your hands clasp protectively over the surface - which is swelling in an alarming fashion under your fingers! Stripping off your clothes, you are presented with the shocking site of once-smooth flesh swelling and flowing like self-animate clay, resculpting itself into the form of male genitalia! When the pain dies down, you are the proud owner of a new human-shaped penis");
            // Female:
            else this.outputText("\n\nYou feel a sudden stabbing pain just above your " + this.player.vaginaDescript() + " and bend over, moaning in agony. Your hands clasp protectively over the surface - which is swelling in an alarming fashion under your fingers! Stripping off your clothes, you are presented with the shocking site of once-smooth flesh swelling and flowing like self-animate clay, resculpting itself into the form of male genitalia! When the pain dies down, you are the proud owner of not only a " + this.player.vaginaDescript() + ", but a new human-shaped penis");
            if (this.player.balls == 0) {
                this.outputText(" and a pair of balls");
                this.player.balls = 2;
                this.player.ballSize = 2;
            }
            this.outputText("!");
            this.player.createCock(7, 1.4);
            this.dynStats("lib", 4, "sen", 5, "lus", 20);
            this.changes++;
        }
        // (Requires the player having two testicles)
        if (type == 1 && (this.player.balls == 0 || this.player.balls == 2) && this.player.hasCock() && this.changes < this.changeLimit && SharkTooth.rand(3) === 0) {
            if (this.player.balls == 2) {
                this.outputText("\n\nYou gasp in shock as a sudden pain racks your abdomen. Within seconds, two more testes drop down into your " + this.player.sackDescript() + ", your skin stretching out to accommodate them. Once the pain clears, you examine <b>your new quartet of testes.</b>");
                this.player.balls = 4;
            }
            else if (this.player.balls == 0) {
                this.outputText("\n\nYou gasp in shock as a sudden pain racks your abdomen. Within seconds, two balls drop down into a new sack, your skin stretching out to accommodate them. Once the pain clears, you examine <b>your new pair of testes.</b>");
                this.player.balls = 2;
                this.player.ballSize = 2;
            }
            this.dynStats("lib", 2, "sen", 3, "lus", 10);
            this.changes++;
        }
        // -Remove extra breast rows
        if (this.changes < this.changeLimit && this.player.breastRows.length > 1 && SharkTooth.rand(3) === 0 && !this.flags[kFLAGS.HYPER_HAPPY]) {
            this.mutations.removeExtraBreastRow(tfSource);
        }
        // Neck restore
        if (this.player.neck.type !== Neck.NORMAL && this.changes < this.changeLimit && SharkTooth.rand(4) === 0) this.mutations.restoreNeck(tfSource);
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && SharkTooth.rand(5) === 0) this.mutations.restoreRearBody(tfSource);
        // Ovi perk loss
        if (SharkTooth.rand(5) === 0) this.mutations.updateOvipositionPerk(tfSource);
        // Transformations:
        // Mouth TF
        if (this.player.face.type !== Face.SHARK_TEETH && SharkTooth.rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\n");
            if (this.player.face.type > Face.HUMAN && this.player.face.type < Face.SHARK_TEETH) this.outputText("Your " + this.player.faceDescript() + " explodes with agony, reshaping into a more human-like visage.  ");
            this.player.face.type = Face.SHARK_TEETH;
            this.outputText("You firmly grasp your mouth, an intense pain racking your oral cavity. Your gums shift around and the bones in your jaw reset. You blink a few times wondering what just happened. You move over to a puddle to catch sight of your reflection, and you are thoroughly surprised by what you see. A set of retractable shark fangs have grown in front of your normal teeth, and your face has elongated slightly to accommodate them!  They even scare you a little.\n(Gain: 'Bite' special attack)");
            this.changes++;
        }
        // Remove odd eyes
        if (this.changes < this.changeLimit && SharkTooth.rand(5) === 0 && this.player.eyes.type !== Eyes.HUMAN) {
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
        // Tail TF
        if (this.player.tail.type !== Tail.SHARK && SharkTooth.rand(3) === 0 && this.changes < this.changeLimit) {
            this.changes++;
            if (this.player.tail.type == Tail.NONE) this.outputText("\n\nJets of pain shoot down your spine, causing you to gasp in surprise and fall to your hands and knees. Feeling a bulging at the end of your back, you lower your " + this.player.armorName + " down just in time for a fully formed shark tail to burst through. You swish it around a few times, surprised by how flexible it is. After some modifications to your clothing, you're ready to go with your brand new shark tail.");
            else this.outputText("\n\nJets of pain shoot down your spine into your tail.  You feel the tail bulging out until it explodes into a large and flexible shark-tail.  You swish it about experimentally, and find it quite easy to control.");
            this.player.tail.type = Tail.SHARK;
        }
        // Gills TF
        if (this.player.gills.type !== Gills.FISH && this.player.tail.type == Tail.SHARK && this.player.face.type == Face.SHARK_TEETH && this.changes < this.changeLimit && SharkTooth.rand(3) === 0)
            this.mutations.updateGills(Gills.FISH);
        // Hair
        if (this.player.hair.color !== "silver" && SharkTooth.rand(4) === 0 && this.changes < this.changeLimit) {
            this.changes++;
            this.outputText("\n\nYou feel a tingling in your scalp and reach up to your head to investigate. To your surprise, your hair color has changed into a silvery color, just like that of a shark girl!");
            this.player.hair.color = "silver";
        }
        // Skin
        if (((this.player.skin.tone !== "rough gray" && this.player.skin.tone !== "orange and black striped") || !this.player.hasPlainSkin()) && SharkTooth.rand(7) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\n");
            if (this.player.isFurryOrScaley()) this.outputText("Your " + this.player.skin.desc + " falls out, collecting on the floor and exposing your supple skin underneath.  ");
            else if (this.player.hasGooSkin()) this.outputText("Your gooey skin solidifies, thickening up as your body starts to solidify into a more normal form. ");
            else if (type == 0) this.outputText("Your skin itches and tingles becoming slightly rougher and turning gray.  ");
            if (type == 0) {
                this.outputText("You abruptly stop moving and gasp sharply as a shudder goes up your entire frame. Your skin begins to shift and morph, growing slightly thicker and changing into a shiny grey color. Your skin now feels oddly rough too, comparable to that of a marine mammal. You smile and run your hands across your new shark skin.");
                this.player.skin.type = Skin.PLAIN;
                this.player.skin.desc = "skin";
                this.player.skin.tone = "rough gray";
                this.player.underBody.restore();
                this.player.arms.updateClaws(this.player.arms.claws.type);
                this.getGame().rathazul.addMixologyXP(20);
                this.changes++;
            }
            else {
                this.outputText("Your skin begins to tingle and itch, before rapidly shifting to a shiny orange color, marked by random black stripes. You take a quick look in a nearby pool of water, to see your skin has morphed in appearance and texture to become more like a tigershark!");
                this.player.skin.type = Skin.PLAIN;
                this.player.skin.desc = "skin";
                this.player.skin.tone = "orange and black striped";
                this.player.underBody.restore();
                this.player.arms.updateClaws(this.player.arms.claws.type);
                kGAMECLASS.rathazul.addMixologyXP(20);
                this.changes++;
            }
        }
        // FINZ R WINGS
        if ((this.player.wings.type !== Wings.NONE || this.player.rearBody.type !== RearBody.SHARK_FIN) && this.changes < this.changeLimit && SharkTooth.rand(3) === 0) {
            this.outputText("\n\n");
            if (this.player.wings.type !== Wings.NONE) this.outputText("Your wings fold into themselves, merging together with your back.  ");
            this.outputText("You groan and slump down in pain, almost instantly regretting eating the tooth. You start sweating profusely and panting loudly, feeling the space between your shoulder blades shifting about. You hastily remove your " + this.player.armorName + " just in time before a strange fin-like structure bursts from in-between your shoulders. You examine it carefully and make a few modifications to your " + this.player.armorName + " to accommodate your new fin.");
            this.player.rearBody.type = RearBody.SHARK_FIN;
            this.player.wings.restore();
            this.changes++;
        }
        if (this.changes == 0) {
            this.outputText("\n\nNothing happened.  Weird.");
        }
        this.player.refillHunger(5);
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;
    }

}
