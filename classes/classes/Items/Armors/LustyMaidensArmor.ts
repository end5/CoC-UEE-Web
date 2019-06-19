import { Armor } from "../Armor";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { BreastCup } from "../../lists/BreastCup";
import { PerkLib } from "../../PerkLib";
import { Player } from "../../Player";
import { Monster } from "../../Monster";
import { Minotaur } from "../../Scenes/Areas/Mountain/Minotaur";
import { MinotaurMob } from "../../Scenes/Areas/HighMountains/MinotaurMob";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

/**
 * Created by aimozg on 11.01.14.
 */

export class LustyMaidensArmor extends Armor {

    public constructor() {
        super("LMArmor", "LMArmor", "lusty maiden's armor", "a bikini-like set of armor that could only belong to a lusty maiden", 6, 400, "This skimpy chain bikini barely qualifies as armor.  Indeed, the chain is made from links much finer and lighter than normal, so fine that it feels almost silken under your fingertips.  A simple seal in the g-string-like undergarment states, \"Virgins only.\" \nRequirements: breast size of at least DD-cups and be a female.", "Light", false, false);
    }

    public get def(): number {
        if (this.game.player.hasVirginVagina()) return 9 + this.game.flags[kFLAGS.BIKINI_ARMOR_BONUS];
        return 6 + this.game.flags[kFLAGS.BIKINI_ARMOR_BONUS];
    }

    public canUse(): boolean {
        if (!super.canUse()) {
            return false;
        }
        if (this.game.player.biggestTitSize() < BreastCup.A) { // {No titties}
            this.outputText("You slide the bikini top over your chest and buckle it into place, but the material hangs almost comically across your flat chest.  The cold chain dangles away from you, swaying around ridiculously before smacking, cold and hard into your [nipples].  This simply won't do - it doesn't fit you, and you switch back to your old armor.\n\n");
            return false;
        }
        if (this.game.player.biggestTitSize() < BreastCup.D) { // {Too small titties}
            this.outputText("You slide the bikini top over your chest, shivering when the cold chains catch on your nipples, stiffening them nicely. The material nicely accentuates your chest, but there's a definite problem.  Your [chest] aren't big enough!  Sure, they look nice done up in glittering silver and gold trim.  If only the metal wasn't hanging loosely around your underbust, flopping around whenever you move.  It doesn't even look that sexy on you!  You'll need a bigger chest to truly make use of this armor.  For now, you switch back to your old equipment.\n\n");
            return false;
        }
        this.outputText("You slide the bikini top over your more than ample chest, shivering at the touch of the cold metal on your sensitive nipples.  It stretches taut around each of your globes, and by the time you're snapping the narrow leather strap behind your back, the exotic metal bra has grown warm enough to make your chest tingle pleasantly.  Your hands find their way to your jiggling, gilded mounds and grab hold, fingers sinking into the shimmering flesh without meaning to.  Your nipples scrape along a diaphanous inner lining so pleasantly that a moan slips out of your mouth as you admire how your cleavage bulges out above the glittery cups.  A narrow band of steel with a shiny black leather thong underneath connects the two halfs of the top, padded for comfort but pulled away from you by the sheer size of your straining bosoms.");
        this.outputText("\n\nAs you examine the material, you realize that leather band isn't just padding.  It's as slippery as butter on grease and has a subtle indentation, one that would let it perfectly cushion something round, thick... and throbbing.  Your cheeks color when you catch yourself thinking of titfucking some beast while dressed in this outfit, taking a thick load of monster or dick-girl seed right over your cleavage, face, and hair.  You could even line it up with your mouth and drink down a few swallows if you wanted to.");
        this.outputText("\n\nYou shake your head and smile ruefully - maybe once you finish getting dressed!  There's still a bottom to put on, after all.  Regardless, one of your hands keeps coming to rest on your boob, idly groping and fondling your heavy tit whenever you have a free moment.  This sure is some fun armor!");
        this.game.dynStats("lus", 25, "scale", false);
        this.outputText("\n\nNow, the bottom is a leather thong and skirt combination.  The thong itself is leather dyed radiant white, with intricate gold filigree covering the front triangle.  On the back triangle, there's a similar pattern, though you could swear that from a distance the pattern looks a bit like arrows pointing towards where your [asshole] will be with golden sperm surrounding them. No, that has to be your imagination.  All this time in this strange land must really be getting to you!  Both pieces are molded to accentuate the female form, with a crease in the gusset that will rest over your vagina, ensuring ");
        if ((this.game.player.hasCock() && !this.game.player.hasSheath()) || this.game.player.balls > 0) {
            this.outputText("that it won't fit you ");
            if (this.game.player.hasCock()) this.outputText("or your " + this.game.player.multiCockDescriptLight());
            else this.outputText("or your [balls]");
            this.outputText(" at all!  <b>You put your old gear back on with a sigh</b>.");
            return false;
        }
        else if (!this.game.player.hasVagina()) {
            this.outputText("that it will dig uncomfortably into your featureless groin.  <b>You put your old gear back on with a sigh</b>.");
            return false;
        }
        this.outputText("your [vagina] is prominently displaying your camel-toe for all to see.");
        this.outputText("\n\nYou don't give it a second thought, sliding the white thong snugly into place.  Snug warmth slides right up against your mound, the perfectly formed crease slipping right into your labia, where it belongs, ");
        if (this.game.player.vaginas[0].virgin) {
            this.outputText("a tight seal over your chastity, displaying your womanly status while guarding your maidenhead at the same time.  A smug, smile tugs at the corners of your mouth - who would take your virginity when they can tit-fuck your tits or fuck your butt?");
            if (this.game.player.cor < 33) this.outputText("  Wait, that isn't right...");
        }
        else {
            this.outputText("a tight seal over your previously-claimed cunt.  Regret fills you when you realize you could have kept your chastity intact simply by servicing the lusty studs and monsters with your ass and tits.");
        }
        if (this.game.player.wetness() >= 3) this.outputText("  The moisture you normally drip seems to soak right into the gusset instead of running down your [legs] like normal, giving you a much more chaste appearance in spite of the lewd garments that even now seem to shape your femininity and [butt] into perfectly arousing shapes.");

        this.outputText("\n\nLast is the chain skirt - perhaps the easiest part to put on.  It's barely three inches long, such that it exposes your [butt] almost entirely, and when you bend over, fully.  The bottom of your vaginal crease can be spied as well, and should you desire to show yourself off, a simple stretch or tug would put you completely on display.  You wiggle about, watching the reflective material ripple almost hypnotically, one hand still on your boobs, mauling at your own tits with passion.  THIS is how a chaste champion should dress - perfectly modest but full of erotic energy to overwhelm her enemies with!\n\n");
        return true;
    }

    public playerEquip(): Armor {
        while (this.game.player.findPerk(PerkLib.SluttySeduction) >= 0) this.game.player.removePerk(PerkLib.SluttySeduction);
        if (this.game.player.hasVirginVagina()) {
            this.game.player.createPerk(PerkLib.SluttySeduction, 10 + this.game.flags[kFLAGS.BIKINI_ARMOR_BONUS], 0, 0, 0);
        }
        else {
            this.game.player.createPerk(PerkLib.SluttySeduction, 6 + this.game.flags[kFLAGS.BIKINI_ARMOR_BONUS], 0, 0, 0);
        }
        return super.playerEquip();
    }

    public playerRemove() {
        while (this.game.player.findPerk(PerkLib.SluttySeduction) >= 0) this.game.player.removePerk(PerkLib.SluttySeduction);
        return super.playerRemove();
    }

    // "Chaste" Paizuri - works for most foes with penises.
    public lustyMaidenPaizuri(player?: Player, monster?: Monster): void {
        if (player == undefined) player = this.game.player;
        if (monster == undefined) monster = this.game.monster;
        this.clearOutput();
        this.outputText("You make sure " + monster.a + monster.short + " is comfortably lying down, " + monster.pronoun3 + " " + monster.cockDescriptShort(0) + " exposed to the air");
        if (monster.lust100 < 50) this.outputText(", soft and not yet ready.  You purr throatily as you touch the burgeoning boner, tracing your thumb across the sensitive urethral bulge.  It pulses slowly at your touch, and the base begins to fill with blood, thickening against your palm.  You splay your remaining fingers just under the " + monster.cockHead() + ", tickling around the glans until that too is flooding with blood, expanding under your caresses until it slowly lifts away from " + monster.pronoun3 + " abdomen.");
        else if (monster.lust100 < 100) this.outputText(", nicely turgid but quite ready to feel the sensuous pleasure of your girls' tight squeeze.  You lean over the defeated foe and kiss the rod just under the " + monster.cockHead() + ", smiling when it expands under your slow kisses.  Your fingers move up to play with the sensitive, urethral bulge that runs along the underside, and in no time, " + monster.a + monster.short + " is hard as a rock, so ready that " + monster.pronoun3 + " member is lifting up on its own.");
        else this.outputText(", bouncing with each beat of " + monster.pronoun3 + " heart, thick beads of pre dribbling from " + monster.pronoun3 + " tip as you bat " + monster.pronoun3 + " hands away before " + monster.pronoun1 + " can waste the load " + monster.pronoun1 + "'s saved up for you.");
        this.outputText("\n\nYour own moistness has risen to uncomfortable levels, and the sticky seal of your g-string's curvy front panel slips oh-so-slightly across your hot, hard clitty, something that makes your [legs] weak and your arms quake.  The leather fold on the front of your undergarments is so slippery that each movement has it shifting and shuffling across your nethers, a tiny bit at a time.  Already, you have your [butt] up in the air, shaking it back and forth for more of the delicious friction.  The motion only exacerbates the jiggling your [chest] are doing inside their tight containment.  " + monster.capitalA + monster.short + "'s head tilts up to watch, an unashamedly lusty look overtaking " + monster.pronoun3 + " features as " + monster.pronoun1 + " enjoys the inadvertent show you're giving.");

        this.outputText("\n\n\"<i>Such lascivious behavior!  I'll have to make sure you're thoroughly purified,</i>\" you state matter-of-factly with a feigned serious look on your blushing [face].  To put proof to your taunt, you grab the throbbing shaft by the base and aim it straight up, dropping your [chest] down on either side.  The slippery, self-lubricating leather that joins the cups of your sexy, chainmail bra together loops over the top of the " + monster.cockDescriptShort(0) + " to properly restrain it, pinned in the slick, sweaty valley you call your cleavage.  It thrums happily against your [skin] when you compress the jiggly flesh around it, leaning down to let it feel pleasure that rivals any pussy, no matter how wet or skilled.");

        this.outputText("\n\nYou smile at your defeated foe as you begin to bob over " + monster.pronoun2 + ", and you find more words coming from your lips without meaning to speak.  \"<i>That's better.  You really shouldn't go around trying to fuck everyone like that!  Pussies are ");
        if (!player.hasVirginVagina()) this.outputText("a gift too fine for a selfish brute like you");
        else this.outputText("sacred and to be shared only with a cherished loved one");
        this.outputText("!  Now, I'm going to squeeze all the impure thoughts out of you through your cock, so you just lie there and focus on letting them out all over my breasts.</i>\"");

        this.outputText("\n\n" + monster.capitalA + monster.short + " nods solemnly while " + monster.pronoun3 + " eyes half-cross from pleasure.  You bottom out around " + monster.pronoun3 + " base");
        if (monster.balls > 0) this.outputText(" and fondle " + monster.pronoun3 + " balls one-handed, squeezing the virile orbs to try and coax more of " + monster.pronoun3 + " dirty, perverted thoughts to distill into salty seed");
        else if (monster.short == "anemone") this.outputText(" and stroke " + monster.pronoun3 + " taint, even brushing over the featureless spot where an asshole would be, if she had one, to try and coax more of " + monster.pronoun3 + " dirty, perverted thoughts to distill into salty seed");
        else this.outputText(" and stroke " + monster.pronoun3 + " taint, even brushing close to " + monster.pronoun3 + " asshole to try and coax more of " + monster.pronoun3 + " dirty, perverted thoughts to distill into salty seed");
        this.outputText(".  A startled moan slips out of " + monster.pronoun3 + " lips, but you're just getting warmed up.  You dive down onto " + monster.pronoun3 + " " + monster.cockDescriptShort(0) + ", taking the " + monster.cockHead() + " straight into your mouth with a smooth gulp.");
        if (monster.cockArea(0) >= 80) this.outputText("  It's so big and strong that it pushes right into your throat, stretching out your neck in the shape of the intruding cock.");
        this.outputText("  The strong, pulsing cock feels so good inside your mouth, like it belongs there, and you can't help but think that you're doing a good deed by helping " + monster.a + monster.short + " empty every last perverse desire onto your purifying breasts.");

        this.outputText("\n\nUp and down, up and down, you slide across the expansive member with unhurried, slow strokes, each time making your [chest] bounce beautifully.  Your [nipples] are so hard");
        if (player.hasFuckableNipples() || player.lactationQ() >= 100) this.outputText(", dripping,");
        this.outputText(" and sensitive, scraping around the nebulous inner lining of your bikini and occasionally catching on the metal that feels even warmer than normal.  Behind you, your [butt] is bouncing happily to the rhythm your corruption-devouring breasts have set, the thong digging tightly into your [vagina] in the most exquisite way.  You feel so hot and sensual, but still secure in the knowledge that you won't have to worry about such a creature ravaging your ");
        if (player.hasVirginVagina()) this.outputText("maidenhead");
        else this.outputText("sloppy gash");
        this.outputText(".  Still, you're not sure how much hotter you can get before you're cumming all over your g-string, letting your own dark thoughts seep into your magical underwear.");

        this.outputText("\n\nBelow you, " + monster.a + monster.short + " is moaning out loud and roughly thrusting " + monster.pronoun3 + " hips to meet your every motion, their tip expanding slightly in your mouth as " + monster.pronoun3 + " passion mounts.  You pull back");
        if (monster.cockArea(0) >= 80) this.outputText(" with a messy cough to clear your throat");
        this.outputText(" and tease, \"<i>Oh, you're going to cum already, aren't you?  Well, go ahead then.</i>\"  You pump your [chest] faster against the twitching rod and smile when a thick bead of pre sloughs off into your squishy boobs, smearing across your [skin].  You kiss it, licking the dollop that slips out of the dilating cum-slit before commanding, \"<i>Cum for me, " + monster.mf("boy", "girl") + ".  Let it allll out.</i>\"");
        this.outputText("\n\n" + monster.capitalA + monster.short + " groans and shakes");
        if (monster.balls > 0) this.outputText(", " + monster.pronoun3 + " balls pumping and bouncing in " + monster.pronoun3 + " sack");
        this.outputText(", " + monster.pronoun3 + " urethra swollen with the heavy load about to explode out of it.  \"<i>Drain out all that nasty jizz,</i>\" you quip as you bottom your breasts down on " + monster.pronoun2 + " and slurp the quivering cock-head into your sperm-hungry lips.  Salty warmth fires in a long rope into your well-prepared mouth and over your tongue.  The blissed out look on your captive foe's face combined with the feel of " + monster.pronoun2 + " giving up all " + monster.pronoun3 + " naughty thoughts thanks to your cleavage gets you so fucking hot that your [hips] begin to shake spastically.");
        this.outputText("\n\nYou do your best to hold on to the pumping cock while it fires spastic ropes into your mouth, but the way your undies are digging into your [vagina] and grinding across your [clit], you simply lack the control to keep it up.  You throw back your head and cry out ecstatically, taking the next ejaculation in a long line across your cheek, up your nose, and onto your forehead.  Again and again, long ropes of tainted jizz spatter all over your face, dripping messily over the exposed tops of your teats.  You lick your lips while you cream the inside of your [armor] with girlish love-goo, feeling such immense pleasure at letting your own impure desires out into the armor.  More jets, weaker than the early ones, crest from the bouncing cock-tip to fall weakly over your well-slicked mammaries.");
        this.outputText("\n\nYou seize " + monster.a + monster.short + " by " + monster.pronoun3 + " base and jerk " + monster.pronoun2 + " off with quick, sharp little strokes, commanding, \"<i>All of it!  Give me all of your lusts and cruel desires!</i>\".  " + monster.mf("His", "Her") + " back arches as " + monster.pronoun3 + " orgasm redoubles, and fresh ropes begin to spout out again, ensuring your face and breasts are soaked with the sloppy spooge.  It runs in moist, warm rivulets into your concealing top, and what doesn't drip down, you compulsively rub into your skin, feeling a positively healthy glow from the feeling.  You don't free the " + monster.cockDescriptShort(0) + " from your chesty embrace until every single drop is splattered all over you, and when you do, you leave a thoroughly wiped-out " + monster.short + " behind you.");

        this.outputText("\n\nThe stink of sperm slowly fades as you move, almost seeming to absorb into your skin.  It leaves you with a healthy glow and a surety to your movements, sure that your revealing armor is going to protect you.");
        // Slimefeed, minus slight corruption if PC is a virgin, raise sensitivity
        player.slimeFeed();
        this.game.flags[kFLAGS.BIKINI_ARMOR_BONUS] += 2;
        if (this.game.flags[kFLAGS.BIKINI_ARMOR_BONUS] > 8) this.game.flags[kFLAGS.BIKINI_ARMOR_BONUS] = 8;
        player.orgasm('Vaginal');
        this.game.dynStats("sen", 2);
        if (player.hasVirginVagina()) this.game.dynStats("cor", -1);
        // If minotaur, increase addiction slightly.
        if (monster instanceof Minotaur || monster instanceof MinotaurMob) player.minoCumAddiction(3);
        if (monster.short == "Ceraph") this.game.flags[kFLAGS.CERAPH_BEATEN_AND_RAPED_COUNTER]++;
        // Usable on: Imps, Minotaurs, Satyrs, Incubus Mechanic, Anemones, Spider Guys, Akbal, Drider, Fetish Zealot, Sand Trap, Very Corrupt Jojo (Maybe slight decorruption to him), Ceraph, Red Kitsune if cock out.
        if (this.game.inCombat)
            this.game.combat.cleanupAfterCombat();
        else kGAMECLASS.output.doNext(this.game.camp.returnToCampUseOneHour);
    }
}
