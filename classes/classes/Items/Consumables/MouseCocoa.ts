import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";
import { StatusEffects } from "../../StatusEffects";
import { PregnancyStore } from "../../PregnancyStore";
import { Neck } from "../../BodyParts/Neck";
import { Ears } from "../../BodyParts/Ears";
import { Tail } from "../../BodyParts/Tail";
import { Face } from "../../BodyParts/Face";
import { Skin } from "../../BodyParts/Skin";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

// special attack - bite?
// tooth length counter starts when you get teef, mouse bite gets more powerful over time as teeth grow in
// hit
// You sink your prominent incisors deep into your foe.  They're not as sharp as a predator's, but even a mouse bites when threatened, and you punch quite a large hole.
// miss
// You attempt to turn and bite your foe, but " + monster.pronoun1 + " pulls back deftly and your jaws close on empty air.

// perk - fuck if i know
// maybe some pregnancy-accelerating thing

/**
 * Mouse transformative item.
 */
export class MouseCocoa extends Consumable {
    public constructor() {
        super("MouseCo", "MouseCo", "a handful of mouse cocoa", ConsumableLib.DEFAULT_VALUE, "A handful of rare aromatic beans with sharp creases in the middle, making them look like small mouse ears.  Allegedly very popular and plentiful before the mice-folk were wiped out.");
    }

    public useItem(): boolean {
        const tfSource: string = "mouseCocoa";
        let temp: number = 0;

        this.mutations.initTransformation([2, 3, 3]);
        this.clearOutput();
        // use:
        this.outputText("You pop several of the beans in your mouth and suck; they immediately reward you by giving up an oily, chocolatey flavor with a hint of bitterness.  For several minutes you ");
        if (!this.player.isTaur()) this.outputText("sit and ");
        this.outputText("enjoy the taste.");

        // stat changes:
        // lose height + gain speed (42" height floor, no speed ceiling but no speed changes without height change)
        if (this.player.tallness >= 45 && this.changes < this.changeLimit && rand(3) === 0) {
            // not horse
            if (!this.player.isTaur()) this.outputText("\n\nYou tap your [feet] idly against the rock you sit upon as you enjoy the treat; it takes several minutes before you realize you don't reach as far down as you did when you sat down!  In shock, you jerk upright and leap off, nearly falling forward as your body moves more responsively than before!  Experimentally, you move in place as you look down at your now-closer [feet]; the sensation of a more compact agility stays with you.");
            // horse
            else this.outputText("\n\nYou trot idly in place as you eat, moving quicker and quicker as you become increasingly bored; on one step, the ground sneaks up on you and you hit it sharply, expecting a few more inches before contact!  Looking down, you notice better resolution than before - you can make out the dirt a bit more clearly.  It looks like you just shed some height, but... you're feeling too jittery to care.  You just want to run around.");
            this.dynStats("spe", 1);
            this.player.tallness--;
            if (this.player.tallness > 60) this.player.tallness--;
            if (this.player.tallness > 70) this.player.tallness--;
            if (this.player.tallness > 80) this.player.tallness--;
            if (this.player.tallness > 90) this.player.tallness -= 2;
            if (this.player.tallness > 100) this.player.tallness -= 2;
            this.changes++;
        }
        // lose tough
        if (this.player.tou100 > 50 && this.changes < this.changeLimit && rand(3) === 0) {
            this.outputText("\n\nYou feel a bit less sturdy, both physically and mentally.  In fact, you'd prefer to have somewhere to hide for the time being, until your confidence returns.  The next few minutes are passed in a mousey funk - even afterward, you can't quite regain the same sense of invincibility you had before.");
            this.dynStats("tou", -1);
            if (this.player.tou100 >= 75) this.dynStats("tou", -1);
            if (this.player.tou100 >= 90) this.dynStats("tou", -1);
        }

        // SEXYYYYYYYYYYY
        // vag-anal capacity up for non-goo (available after PC < 5 ft; capacity ceiling reasonable but not horse-like or gooey)
        if (this.player.tallness < 60 && (this.player.analCapacity() < 100 || (this.player.vaginalCapacity() < 100 && this.player.hasVagina())) && this.changes < this.changeLimit && rand(3) === 0) {
            this.outputText("\n\nYour ");
            if (this.player.vaginalCapacity() < 100 && this.player.hasVagina()) this.outputText("[vagina]");
            else this.outputText("[asshole]");
            this.outputText(" itches, and you shyly try to scratch it, looking around to see if you're watched.  ");
            if (this.player.isTaur()) this.outputText("Backing up to a likely rock, you rub your hindquarters against it, only to be surprised when you feel your hole part smoothly against the surface, wider than you're used to!");
            else this.outputText("Slipping a hand in your [armor], you rub vigorously; your hole opens more easily and your fingers poke in farther than you're used to!");
            this.outputText("  It feels unusual - not bad, really, but definitely weird.  You can see how it would come in handy, now that you're smaller than most prospective partners, but... shaking your head, you ");
            if (this.player.isTaur()) this.outputText("back away from your erstwhile sedimentary lover");
            else this.outputText("pull your hand back out");
            this.outputText(".");
            // adds some lust
            this.dynStats("lus", 10 + this.player.sens / 5);
            if (this.player.vaginalCapacity() < 100 && this.player.hasVagina()) {
                if (!this.player.hasStatusEffect(StatusEffects.BonusVCapacity)) this.player.createStatusEffect(StatusEffects.BonusVCapacity, 0, 0, 0, 0);
                this.player.addStatusValue(StatusEffects.BonusVCapacity, 1, 5);
            }
            else {
                if (!this.player.hasStatusEffect(StatusEffects.BonusACapacity)) this.player.createStatusEffect(StatusEffects.BonusACapacity, 0, 0, 0, 0);
                this.player.addStatusValue(StatusEffects.BonusACapacity, 1, 5);
            }
            this.changes++;
        }
        // fem fertility up and heat (suppress if pregnant)
        // not already in heat (add heat and lust)
        if (this.player.statusEffectv2(StatusEffects.Heat) < 30 && rand(2) === 0 && this.changes < this.changeLimit) {

            const intensified: boolean = this.player.inHeat;
            if (this.player.goIntoHeat(false)) {
                if (intensified) {
                    const consumables: ConsumableLib = this.game.consumables;
                    this.outputText("\n\nYour womb feels achingly empty, and your temperature shoots up.  Try as you might, you can't stop fantasizing about being filled with semen, drenched inside and out with it, enough to make a baker's dozen offspring.  ");
                    // [(no mino cum in inventory)]
                    if (!this.player.hasItem(consumables.MINOCUM)) {
                        this.outputText("<b>Your heat has intensified as much as your fertility has increased, which is a considerable amount!</b>");
                    }
                    else if (this.player.lust < this.player.maxLust() || this.player.isTaur()) this.outputText("You even pull out a bottle of minotaur jism and spend several minutes considering the feasibility of pouring it directly in your [vagina], but regain your senses as you're unsealing the cap, setting it aside.  <b>Still, your heat is more intense than ever and your increasingly-fertile body is practically begging for dick - it'll be hard to resist any that come near!</b>");
                    // (mino cum in inventory and non-horse, 100 lust)
                    else {
                        this.outputText("Desperately horny, you pull out your bottle of minotaur jism and break the seal in two shakes, then lie down with your hips elevated and upend it over your greedy vagina.  The gooey seed pours into you, and you orgasm fitfully, shaking and failing to hold the bottle in place as it coats your labia.  <b>As a hazy doze infiltrates your mind, you pray the pregnancy takes and dream of the sons you'll bear with your increasingly fertile body... you're going to go insane if you don't get a baby in you</b>.");
                        // (consumes item, increment addiction/output addict message, small chance of mino preg, reduce lust)]");
                        this.player.minoCumAddiction(5);
                        this.player.knockUp(PregnancyStore.PREGNANCY_MINOTAUR, PregnancyStore.INCUBATION_MINOTAUR, 175);
                        this.player.consumeItem(consumables.MINOCUM);
                    }
                }
                else {
                    this.outputText("\n\nYour insides feel... roomy.  Accommodating, even.  You could probably carry a whole litter of little [name]s right now.  Filled with a sudden flush of desire, you look around furtively for any fertile males.  With a shake of your head, you try to clear your thoughts, but daydreams of being stuffed with seed creep right back in - it looks like your body is intent on probing the limits of your new fertility.  <b>You're in heat, and pregnable in several senses of the word!</b>");

                    // Also make a permanent nudge.
                    this.player.fertility++;
                }
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
        // bodypart changes:
        // gain ears
        if (this.player.ears.type !== Ears.MOUSE && this.changes < this.changeLimit && rand(4) === 0) {
            this.outputText("\n\nYour ears ");
            if (this.player.ears.type === Ears.HORSE || this.player.ears.type === Ears.COW || this.player.ears.type === Ears.DOG || this.player.ears.type === Ears.BUNNY || this.player.ears.type === Ears.KANGAROO) this.outputText("shrink suddenly");
            else this.outputText("pull away from your head");
            this.outputText(", like they're being pinched, and you can distinctly feel the auricles taking a rounded shape through the pain.  Reaching up to try and massage away their stings, <b>you're not terribly surprised when you find a pair of fuzzy mouse's ears poking through your " + this.player.hairDescript() + ".</b>");
            this.player.ears.type = Ears.MOUSE;
            this.changes++;
        }
        // gain tail
        // from no tail
        if (this.player.ears.type === Ears.MOUSE && this.player.tail.type !== Tail.MOUSE && this.changes < this.changeLimit && rand(4) === 0) {
            // from other tail
            if (this.player.tail.type > Tail.NONE) {
                this.outputText("\n\nYour tail clenches and itches simultaneously, leaving you wondering whether to cry out or try to scratch it.  The question is soon answered as the pain takes the forefront; looking backward is a horrible strain, but when you manage it, you can see your old appendage ");
                if (this.player.tail.type === Tail.HORSE) this.outputText("elongating");
                else this.outputText("compressing");
                this.outputText(" into a long, thin line.  With a shudder, it begins to shed until it's completely, starkly nude.  <b>Your new mouse tail looks a bit peaked.</b>");
            }
            else this.outputText("\n\nA small nub pokes from your backside, and you turn to look at it.  When you do, your neck aches as if whiplashed, and you groan as your spine shifts smoothly downward like a rope being pulled, growing new vertebra behind it and expanding the nub into a naked, thin, tapered shape.  <b>Rubbing at your sore neck, you stare at your new mouse tail.</b>");
            this.player.tail.type = Tail.MOUSE;
            this.changes++;
        }
        // get teeth - from human, bunny, coonmask, or other humanoid teeth faces
        if (this.player.ears.type === Ears.MOUSE && (this.player.face.type === Face.HUMAN || this.player.face.type === Face.SHARK_TEETH || this.player.face.type === Face.BUNNY || this.player.face.type === Face.SPIDER_FANGS || this.player.face.type === Face.RACCOON_MASK) && rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nYour teeth grind on their own, and you feel a strange, insistent pressure just under your nose.  As you open your mouth and run your tongue along them, you can feel ");
            if (this.player.face.type !== Face.HUMAN) this.outputText("the sharp teeth receding and ");
            this.outputText("your incisors lengthening.  It's not long before they're twice as long as their neighbors and the obvious growth stops, but the pressure doesn't go away completely.  <b>Well, you now have mouse incisors and your face aches a tiny bit - wonder if they're going to keep growing?</b>");
            this.player.face.type = Face.BUCKTEETH;
            this.changes++;
        }
        // get mouse muzzle from mouse teeth or other muzzle
        if (this.player.hasFur() && this.player.face.type !== Face.MOUSE && (this.player.face.type !== Face.HUMAN || this.player.face.type !== Face.SHARK_TEETH || this.player.face.type !== Face.BUNNY || this.player.face.type !== Face.SPIDER_FANGS || this.player.face.type !== Face.RACCOON_MASK) && rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nA wave of light-headedness hits you, and you black out.  In your unconsciousness, you dream of chewing - food, wood, cloth, paper, leather, even metal... whatever you can fit in your mouth, even if it doesn't taste like anything much.  For several minutes you just chew and chew your way through a parade of ordinary objects, savoring the texture of each one against your teeth, until finally you awaken.  Your teeth work, feeling longer and more prominent than before, and you hunt up your reflection.  <b>Your face has shifted to resemble a mouse's, down to the whiskers!</b>");
            this.player.face.type = Face.MOUSE;
            this.changes++;
        }
        // get fur
        if ((!this.player.hasFur() || (this.player.hasFur() && (this.player.skin.furColor !== "brown" && this.player.skin.furColor !== "white"))) && this.changes < this.changeLimit && rand(4) === 0) {
            // from skinscales
            if (!this.player.hasFur()) {
                this.outputText("\n\nYour " + this.player.skinFurScales() + " itch");
                if (!this.player.hasPlainSkin()) this.outputText("es");
                this.outputText(" all over");
                if (this.player.tail.type > Tail.NONE) this.outputText(", except on your tail");
                this.outputText(".  Alarmed and suspicious, you tuck in your hands, trying to will yourself not to scratch, but it doesn't make much difference.  Tufts of ");
                temp = rand(10);
                if (temp < 8) {
                    this.outputText("brown");
                    this.player.skin.furColor = "brown";
                }
                else {
                    this.outputText("white");
                    this.player.skin.furColor = "white";
                }
                this.outputText(" fur begin to force through your skin");
                if (this.player.hasScales()) this.outputText(", pushing your scales out with little pinches");
                this.outputText(", resolving the problem for you.  <b>You now have fur.</b>");
            }
            // from other color fur
            else {
                this.outputText("\n\nYour fur stands on end, as if trying to leap from your body - which it does next.  You watch, dumb with shock, as your covering deserts you, but it's quickly replaced with another layer of ");
                temp = rand(10);
                if (temp < 8) {
                    this.outputText("brown");
                    this.player.skin.furColor = "brown";
                }
                else {
                    this.outputText("white");
                    this.player.skin.furColor = "white";
                }
                this.outputText(" fuzz coming in behind it that soon grows to full-fledged fur.");
            }
            this.player.skin.adj = "";
            this.player.skin.desc = "fur";
            this.player.skin.type = Skin.FUR;
            this.player.underBody.restore(); // Restore the underbody for now
            this.changes++;
        }
        this.player.refillHunger(10);
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;

        return false;
    }
}
