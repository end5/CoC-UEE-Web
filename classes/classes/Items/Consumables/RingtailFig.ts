import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { Face } from "../../BodyParts/Face";
import { Neck } from "../../BodyParts/Neck";
import { Tail } from "../../BodyParts/Tail";
import { LowerBody } from "../../BodyParts/LowerBody";
import { Ears } from "../../BodyParts/Ears";
import { Skin } from "../../BodyParts/Skin";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

/**
 * Raccoon transformative item.
 */
export class RingtailFig extends Consumable {
    public constructor() {
        super("RingFig", "RingFig", "a ringtail fig", ConsumableLib.DEFAULT_VALUE, "A dried fig with two lobes and thin dark rings just below its stem.  The skin is wrinkly and it looks vaguely like a bulging scrotum.");
    }

    public useItem(): boolean {
        const tfSource: string = "ringtailFig";
        this.mutations.initTransformation([2, 3, 3]);
        this.clearOutput();
        // eat it:
        this.outputText("You split the fruit and scoop out the pulp, eating it greedily.  It's sweet and slightly gritty with seeds, and you quickly finish both halves.");

        // stat gains:
        // gain speed to ceiling of 80
        if (this.player.spe100 < 80 && RingtailFig.rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou twitch and turn your head this way and that, feeling a bit more alert.  This will definitely help when defending your personal space from violators.");
            if (this.player.spe100 < 40) this.dynStats("spe", 1);
            this.dynStats("spe", 1);
        }
        // gain sensitivity
        if (this.player.sens100 < 80 && RingtailFig.rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nThe wrinkled rind suddenly feels alarmingly distinct in your hands, and you drop the remnants of the fruit.  Wonderingly, you touch yourself with a finger - you can feel even the lightest pressure on your " + this.player.skinFurScales() + " much more clearly now!");
            if (this.player.sens100 < 60) this.dynStats("sen", 2);
            this.dynStats("sen", 2);
        }
        // lose toughness to floor of 50
        if (RingtailFig.rand(4) === 0 && this.player.tou100 > 50 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou find yourself wishing you could just sit around and eat all day, and spend a while lazing about and doing nothing before you can rouse yourself to get moving.");
            if (this.player.tou100 > 75) this.dynStats("tou", -1);
            this.dynStats("tou", -1);
        }

        // Sex stuff
        if (this.player.hasCock()) {
            // gain ball size
            if (this.player.balls > 0 && this.player.ballSize < 15 && RingtailFig.rand(4) === 0 && this.changes < this.changeLimit) {
                this.outputText("\n\nYour [balls] inflate, stretching the skin of your sack.  Exposing them, you can see that they've grown several inches!  How magical!");
                this.player.ballSize += 2 + RingtailFig.rand(3);
                this.dynStats("lib", 1);
            }
        }
        // gain balls up to 2 (only if full-coon face and fur; no dick required)
        if (this.player.balls === 0 && this.player.hasFur() && this.player.face.type === Face.RACCOON && RingtailFig.rand(3) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nAs you eat, you contemplate your masked appearance; it strikes you that you're dangerously close to the classic caricature of a thief.  Really, all it would take is a big, nondescript sack and a hurried gait and everyone would immediately think the worst of you.  In a brief fit of pique, you wish you had such a bag to store your things in, eager to challenge a few assumptions.  A few minutes into that line of thought, a twisting ache in your lower gut bends you double, and you expose yourself hurriedly to examine the region.  As you watch, a balloon of flesh forms on your crotch, and two lumps migrate from below your navel down into it.  <b>Looks like you have a sack, after all.</b>");
            this.player.balls = 2;
            this.player.ballSize = 1;
            this.changes++;
        }
        // gain thickness or lose tone or whatever - standard message
        if (RingtailFig.rand(4) === 0 && this.player.thickness < 80 && this.changes < this.changeLimit) {
            this.outputText(this.player.modThickness(80, 2));
            this.changes++;
        }
        // Neck restore
        if (this.player.neck.type != Neck.NORMAL && this.changes < this.changeLimit && RingtailFig.rand(4) == 0) this.mutations.restoreNeck(tfSource);
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && RingtailFig.rand(5) == 0) this.mutations.restoreRearBody(tfSource);
        // Ovi perk loss
        if (RingtailFig.rand(5) === 0) {
            this.mutations.updateOvipositionPerk(tfSource);
        }
        // bodypart changes:
        if (this.player.tail.type !== Tail.RACCOON && RingtailFig.rand(4) === 0 && this.changes < this.changeLimit) {
            // grow da tail
            // from no tail:
            if (this.player.tail.type === Tail.NONE) {
                this.outputText("\n\nPain shivers through your spine and forces you onto the ground; your body locks up despite your attempt to rise again.  You can feel a tug on your spine from your backside, as if someone is trying to pull it out!  Several nodules form along your back, growing into new vertebrae and pushing the old ones downward and into your [armor].  An uncomfortable pressure grows there, as whatever development is taking place fights to free itself from the constriction.  Finally the shifting stops, and you're able to move again; the first thing you do is loosen your bottoms, allowing a matted tail to slide out.  <b>It twitches involuntarily, fluffing out into a ringed raccoon tail!</b>");
            }
            // from other tail:
            else {
                this.outputText("\n\nYour tail goes rigid with pain, and soon your body follows.  It feels as though your spine is trying to push the growth off of your body... barely, you manage to turn your head to see almost exactly that!  A new ringed, fluffy tail is growing in behind its predecessor, dark bands after light.  Soon it reaches full length and a tear comes to your eye as your old tail parts from its end and drops to the ground like overripe fruit, dissolving.  <b>You now have a raccoon tail!</b>");
            }
            this.player.tail.type = Tail.RACCOON;
            this.changes++;
        }
        // gain fur
        if ((this.player.lowerBody.type === LowerBody.RACCOON && this.player.ears.type === Ears.RACCOON) && !this.player.hasFur() && this.changes < this.changeLimit && RingtailFig.rand(4) === 0) {
            this.outputText("\n\nYou shiver, feeling a bit cold.  Just as you begin to wish for something to cover up with, it seems your request is granted; thick, bushy fur begins to grow all over your body!  You tug at the tufts in alarm, but they're firmly rooted and... actually pretty soft.  Huh.  ");
            this.player.skin.type = Skin.FUR;
            this.player.skin.adj = "";
            this.player.skin.desc = "fur";
            this.player.skin.furColor = "gray";
            this.player.underBody.restore(); // Restore the underbody for now
            this.outputText("<b>You now have a warm coat of " + this.player.skin.furColor + " raccoon fur!</b>");
            this.changes++;
        }
        // gain coon ears
        if (this.player.tail.type === Tail.RACCOON && this.player.ears.type !== Ears.RACCOON && RingtailFig.rand(4) === 0 && this.changes < this.changeLimit) {
            // from dog, kangaroo, bunny, other long ears
            if (this.player.ears.type === Ears.DOG || this.player.ears.type === Ears.BUNNY || this.player.ears.type === Ears.KANGAROO) this.outputText("\n\nYour ears compress, constricting your ear canal momentarily.  You shake your head to get sound back, and reach up to touch the auricles, to find a pair of stubby egg-shaped ears in their place.  <b>You now have raccoon ears!</b>");
            // from cat, horse, cow ears
            else if (this.player.ears.type === Ears.HORSE || this.player.ears.type === Ears.COW || this.player.ears.type === Ears.CAT) this.outputText("\n\nYour ears tingle.  Huh.  Do they feel a bit rounder at the tip now?  <b>Looks like you have raccoon ears.</b>");
            // from human, goblin, lizard or other short ears
            else this.outputText("\n\nYour ears prick and stretch uncomfortably, poking up through your " + this.player.hairDescript() + ".  Covering them with your hands, you feel them shaping into little eggdrop ornaments resting atop your head.  <b>You have raccoon ears!</b>");
            this.player.ears.type = Ears.RACCOON;
            this.changes++;
        }
        // gain feet-coon
        if (this.player.ears.type === Ears.RACCOON && this.player.lowerBody.type !== LowerBody.RACCOON && this.changes < this.changeLimit && RingtailFig.rand(4) === 0) {
            // from naga non-feet (gain fatigue and lose lust)
            if (this.player.isNaga()) {
                this.outputText("\n\nYour body straightens and telescopes suddenly and without the length of your snake half to anchor you, you're left with your face in the dirt.  A shuffling and scraping of falling scales sounds and a terrible cramp takes you as your back half continues migrating, subducting under your [butt] and making you feel extremely bloated.  As your once prominent tail dwindles to roughly the length of your torso, a sickly ripping noise fills your head and it bursts apart, revealing two new legs!  The tattered snake-skin continues melding into your groin as you examine the fuzzy legs and long-toed, sensitive feet.  <b>Looks like you now have raccoon hind-paws...</b> and an upset stomach.");
                this.dynStats("lus", -30);
                this.player.changeFatigue(5);
            }
            // from amoeba non-feet
            else if (this.player.isGoo()) this.outputText("\n\nYour gooey undercarriage begins to boil violently, and before you can do anything, it evaporates!  Left sitting on just the small pad of sticky half-dried slime that comprises your [butt], a sudden bulge under you is enough to push you onto your back.  Wondering idly and unable to see what's happening, you close your eyes and try to focus on what sensations you can feel from your lower body.  You feel... a swell of expansion, followed by weak muscles trying to contract for the first time, pulling flimsy, folded limbs apart and laying them flat.  As your attention wanders downward, you feel toes wiggling - far longer toes than you remember.  For several minutes you lie still and test muscles gingerly as your body solidifes, but when you can finally move again and look at your legs properly, what you see surprises you very little.  <b>You have fuzzy legs and a pair of long-toed raccoon paws!</b>");
            // from hooves or hard feet, including centaurs and bees
            else if (this.player.lowerBody.type === LowerBody.HOOFED || this.player.lowerBody.type === LowerBody.BEE || this.player.lowerBody.type === LowerBody.PONY || this.player.lowerBody.type === LowerBody.CHITINOUS_SPIDER_LEGS || this.player.isTaur()) {
                this.outputText("\n\nYour [feet] feel very... wide, all of a sudden.  You clop around experimentally, finding them far less responsive and more cumbersome than usual.  On one step, one of your feet ");
                if (this.player.lowerBody.type === LowerBody.HOOFED || this.player.lowerBody.type === LowerBody.PONY) this.outputText("pops right out of its hoof just in time");
                else this.outputText("comes loose inside its long boot, and you pull it free with irritation only");
                this.outputText(" for you to set it back down on a sharp rock!  Biting off a curse, you examine the new bare foot.  It looks much like a human's, except for the nearly-twice-as-long toes.  You find you can even use them to pick things up; the sharp rock is dropped into your hand and tossed far away.  The shed [foot] is quickly joined on the ground by its complement, revealing more long toes.  ");
                if (this.player.isTaur()) this.outputText("For a few minutes you amuse yourself with your four prehensile feet... you even make up a game that involves juggling a stone under your body by tossing it between two feet while balancing on the others.  It's only a short while, however, before your lower stomach grumbles and a searing pain makes you miss your catch.  Anticipating what will happen, you lie down carefully and close your eyes, biting down on a soft wad of cloth.  The pain quickly returns and drives you into unconsciousness, and when you awaken, your back legs are gone.  ");
                this.outputText("<b>You now have two fuzzy, long-toed raccoon legs.</b>");
            }
            // from human, demon, paw feet
            else {
                this.outputText("\n\nYour toes wiggle of their own accord, drawing your attention.  Looking down, you can see them changing from their current shape, stretching into oblongs.  When they finish, your foot appears humanoid, but with long, prehensile toes!  ");
                if ((this.player.lowerBody.type === LowerBody.HUMAN || this.player.lowerBody.type === LowerBody.DEMONIC_HIGH_HEELS || this.player.lowerBody.type === LowerBody.DEMONIC_CLAWS) && !this.player.hasFur()) this.outputText("The sensation of walking around on what feels like a second pair of hands is so weird that you miss noticing the itchy fur growing in over your legs...  ");
                this.outputText("<b>You now have raccoon paws!</b>");
            }
            this.player.lowerBody.type = LowerBody.RACCOON;
            this.player.lowerBody.legCount = 2;
            this.changes++;
        }
        // gain half-coon face (prevented if already full-coon)
        if (this.player.face.type !== Face.RACCOON_MASK && this.player.face.type !== Face.RACCOON && RingtailFig.rand(4) === 0 && this.changes < this.changeLimit) {
            // from human/naga/shark/bun face
            if (this.player.face.type === Face.HUMAN || this.player.face.type === Face.SHARK_TEETH || this.player.face.type === Face.SNAKE_FANGS || this.player.face.type === Face.BUNNY) {
                this.outputText("\n\nA sudden wave of exhaustion passes over you, and your face goes partially numb around your eyes.  ");
                // (nagasharkbunnies)
                if (this.player.face.type === Face.SHARK_TEETH || this.player.face.type === Face.SNAKE_FANGS || this.player.face.type === Face.BUNNY) {
                    this.outputText("Your prominent teeth chatter noisily at first, then with diminishing violence, until you can no longer feel them jutting past the rest!  ");
                }
                this.outputText("Shaking your head a bit, you wait for your energy to return, then examine your appearance.  ");
                // (if player skinTone = ebony/black/ebony with tats and no fur/scales or if black/midnight fur or if black scales
                if (((this.player.skin.tone === "ebony" || this.player.skin.tone === "black") && (this.player.hasPlainSkin() || this.player.hasGooSkin())) || ((this.player.hair.color === "black" || this.player.hair.color === "midnight") && this.player.isFurryOrScaley())) {
                    this.outputText("Nothing seems different at first.  Strange... you look closer and discover a darker, mask-line outline on your already inky visage.  <b>You now have a barely-visible raccoon mask.</b>");
                }
                else this.outputText("A dark, almost black mask shades the " + this.player.skinFurScales() + " around your eyes and over the topmost portion of your nose, lending you a criminal air!  <b>You now have a raccoon mask!</b>");
            }
            // from snout (will not overwrite full-coon snout but will overwrite others)
            else {
                this.outputText("\n\nA sudden migraine sweeps over you and you clutch your head in agony as your nose collapses back to human dimensions.  A worrying numb spot grows around your eyes, and you entertain several horrible premonitions until it passes as suddenly as it came.  Checking your reflection in your water barrel, you find ");
                // [(if black/midnight fur or if black scales)
                if (((this.player.hair.color === "black" || this.player.hair.color === "midnight") && this.player.isFurryOrScaley())) this.outputText("your face apparently returned to normal shape, albeit still covered in " + this.player.skinFurScales() + ".  You look closer and discover a darker, mask-line outline on your already inky visage.  <b>You now have a barely-visible raccoon mask on your otherwise normal human face.</b>");
                else if ((this.player.skin.tone === "ebony" || this.player.skin.tone === "black") && (this.player.hasPlainSkin() || this.player.hasGooSkin())) this.outputText("your face apparently returned to normal shape.  You look closer and discover a darker, mask-line outline on your already inky visage.  <b>You now have a barely-visible raccoon mask on your normal human face.</b>");
                else this.outputText("your face returned to human dimensions, but shaded by a black mask around the eyes and over the nose!  <b>You now have a humanoid face with a raccoon mask!</b>");
            }
            this.player.face.type = Face.RACCOON_MASK;
            this.changes++;
        }
        // gain full-coon face (requires half-coon and fur)
        // from humanoid - should be the only one possible
        else if (this.player.face.type === Face.RACCOON_MASK && this.player.lowerBody.type === LowerBody.RACCOON && this.player.hasFur() && RingtailFig.rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYour face pinches with tension, and you rub the bridge of your nose to release it.  The action starts a miniature slide in your bone structure, and your nose extends out in front of you!  You shut your eyes, waiting for the sinus pressure to subside, and when you open them, a triangular, pointed snout dotted with whiskers and capped by a black nose greets you!  <b>You now have a raccoon's face!</b>");
            // from muzzleoid - should not be possible, but included if things change
            // Your face goes numb, and you can see your snout shifting into a medium-long, tapered shape.  Closing your eyes, you rub at your forehead to try and get sensation back into it; it takes several minutes before full feeling returns.  <b>When it does, you look again at yourself and see a raccoon's pointy face, appointed with numerous whiskers and a black nose!</b>
            this.changes++;
            this.player.face.type = Face.RACCOON;
        }
        // fatigue damage (only if face change was not triggered)
        else if (RingtailFig.rand(2) === 0 && this.changes < this.changeLimit && (this.player.face.type !== Face.RACCOON_MASK && this.player.face.type !== Face.RACCOON)) {
            this.outputText("\n\nYou suddenly feel tired and your eyelids are quite heavy.  Checking your reflection, you can see small dark rings have begun to form under your eyes.");
            this.player.changeFatigue(10);
            this.changes++;
        }
        if (this.changes === 0) {
            this.outputText("\n\nYawning, you figure you could really use a nap.");
            this.player.changeFatigue(5);
        }
        this.player.refillHunger(30);
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;

        return false;
    }
}
