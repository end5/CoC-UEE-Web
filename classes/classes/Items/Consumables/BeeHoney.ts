import { Consumable } from "../Consumable";
import { StatusEffects } from "../../StatusEffects";
import { Player } from "../../Player";
import { PregnancyStore } from "../../PregnancyStore";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { Utils } from "../../internals/Utils";
import { Antennae } from "../../BodyParts/Antennae";
import { Horns } from "../../BodyParts/Horns";
import { LowerBody } from "../../BodyParts/LowerBody";
import { Arms } from "../../BodyParts/Arms";
import { Neck } from "../../BodyParts/Neck";
import { rand } from "../../Extra";
import { PerkLib } from "../../PerkLib";
import { Tail } from "../../BodyParts/Tail";
import { Wings } from "../../BodyParts/Wings";
import { RearBody } from "../../BodyParts/RearBody";
import { CockTypesEnum } from "../../CockTypesEnum";

/**
 * Created by K.Quesom 11.06.14
 */

export class BeeHoney extends Consumable {
    private static PURE_HONEY_VALUE: number = 40;
    private static SPECIAL_HONEY_VALUE: number = 20;

    public constructor(pure: boolean, special: boolean) {
        let honeyName: string;
        let honeyLong: string;
        let honeyDesc: string;
        let honeyValue: number;
        if (special) {
            honeyName = "SpHoney";
            honeyLong = "a bottle of special bee honey";
            honeyDesc = "A clear crystal bottle of a dark brown fluid that you got from the bee handmaiden.  It gives off a strong sweet smell even though the bottle is still corked.";
            honeyValue = BeeHoney.SPECIAL_HONEY_VALUE;
        }
        else {
            honeyName = (pure ? "PurHony" : "BeeHony");
            honeyLong = (pure ? "a crystal vial filled with glittering honey" : "a small vial filled with giant-bee honey");
            honeyDesc = "This fine crystal vial is filled with a thick amber liquid that glitters " + (pure ? "" : "dully ") + "in the light.  You can smell a sweet scent, even though it is tightly corked.";
            honeyValue = (pure ? BeeHoney.PURE_HONEY_VALUE : 6);
        }
        super(honeyName, honeyName, honeyLong, honeyValue, honeyDesc);
    }

    public canUse(): boolean {
        if (this.value == BeeHoney.SPECIAL_HONEY_VALUE && this.getGame().player.statusEffectv1(StatusEffects.Exgartuan) == 1) { // Exgartuan doesn't like the special honey
            this.outputText("You uncork the bottle only to hear Exgartuan suddenly speak up.  <i>“Hey kid, this beautiful cock here doesn’t need any of that special bee shit.  Cork that bottle up right now or I’m going to make it so that you can’t drink anything but me.”</i>  You give an exasperated sigh and put the cork back in the bottle.");
            return false;
        }
        return true;
    }

    public useItem(): boolean {
        const tfSource: string = "BeeHoney";
        const player: Player = this.getGame().player;
        const pure: boolean = (this.value == BeeHoney.PURE_HONEY_VALUE);
        const special: boolean = (this.value == BeeHoney.SPECIAL_HONEY_VALUE);
        this.mutations.initTransformation([2, 2, 2]);
        this.clearOutput();
        player.slimeFeed();
        // Drink text
        if (special) {
            this.outputText("You uncork the bottle and pour the incredibly strong smelling concentrated honey down your throat.  Its taste is also mighty intense.  All at once you feel the effects of the substance start to course through your body.");
        }
        else { // Text for normal or pure
            this.outputText("Opening the crystal vial, you are greeted by a super-concentrated wave of sweet honey-scent.  It makes you feel lightheaded.  You giggle and lick the honey from your lips, having drank down the syrupy elixir without a thought.");
        }
        player.refillHunger(15);
        if ((pure || special) && player.pregnancyType == PregnancyStore.PREGNANCY_FAERIE) { // Pure or special honey can reduce the corruption of a phouka baby
            if (this.getGame().flags[kFLAGS.PREGNANCY_CORRUPTION] > 1) { // Child is phouka, hates pure honey
                this.outputText("\n\nYou feel queasy and want to throw up.  There's a pain in your belly and you realize the baby you're carrying didn't like that at all.  Then again, maybe pure honey is good for it.");
            }
            else if (this.getGame().flags[kFLAGS.PREGNANCY_CORRUPTION] < 1) { // Child is faerie, loves pure honey
                this.outputText("\n\nA warm sensation starts in your belly and runs all through your body.  It's almost as if you're feeling music and you guess your passenger enjoyed the meal.");
            }
            else { // Child is on the line, will become a faerie with this drink
                this.outputText("\n\nAt first you feel your baby struggle against the honey, then it seems to grow content and enjoy it.");
            }
            this.getGame().flags[kFLAGS.PREGNANCY_CORRUPTION]--;
            if (pure) return (false); // No transformative effects for the player because the pure honey was absorbed by the baby - Special honey will keep on giving
        }
        // Corruption reduction
        if (this.changes < this.changeLimit && pure) { // Special honey will also reduce corruption, but uses different text and is handled separately
            this.outputText("\n\n");
            this.changes++;
            if (player.cor > 80) this.outputText("Your head aches, as if thunder was echoing around your skull.  ");
            else if (player.cor > 60) this.outputText("You feel a headache forming just behind your eyes.  In no time flat it reaches full strength.  ");
            else if (player.cor > 40) this.outputText("A wave of stinging pain slices through your skull.  ");
            else if (player.cor > 20) this.outputText("A prickling pain spreads throughout your skull.  ");
            else this.outputText("You feel a mildly unpleasant tingling inside your skull.  ");
            if (player.cor > 0) this.outputText("It quickly passes, leaving you more clearheaded");
            this.getGame().dynStats("cor", -(1 + (player.cor / 20)));
            // Libido Reduction
            if (player.cor > 0 && this.changes < this.changeLimit && Utils.rand(1.5) == 0 && player.lib100 > 40) {
                this.outputText(" and settling your overcharged sex-drive a bit.");
                this.getGame().dynStats("lib", -3, "lus", -20);
                this.changes++;
            }
            else if (player.cor > 0) this.outputText(".");
        }
        // bee item corollary:
        if (this.changes < this.changeLimit && player.hair.type == 4 && Utils.rand(2) == 0) {
            // -insert anemone hair removal into them under whatever criteria you like, though hair removal should precede abdomen growth; here's some sample text:
            this.outputText("\n\nAs you down the sticky-sweet honey, your head begins to feel heavier.  Reaching up, you notice your tentacles becoming soft and somewhat fibrous.  Pulling one down reveals that it feels and smells like the honey you just ate; you watch as it dissolves into many thin strands coated in the sugary syrup.  <b>Your hair is back to normal (well, once you wash the honey out)!</b>");
            player.hair.type = 0;
            this.changes++;
        }
        // (removes tentacle hair status, restarts hair growth if not prevented by reptile status)
        // Intelligence Boost
        if (this.changes < this.changeLimit && Utils.rand(2) == 0 && player.inte100 < 80) {
            this.getGame().dynStats("int", 0.1 * (80 - player.inte100));
            this.outputText("\n\nYou spend a few moments analyzing the taste and texture of the honey's residue, feeling awfully smart.");
        }
        // Sexual Stuff
        // No idears
        // Appearance Stuff
        // Hair Color
        if (this.changes < this.changeLimit && (player.hair.color != "shiny black" && player.hair.color != "black and yellow") && player.hair.length > 10 && Utils.rand(5) == 0) {
            this.outputText("\n\nYou feel your scalp tingling, and you grab your hair in a panic, pulling a strand forward.  ");
            if (Utils.rand(9) == 0) player.hair.color = "black and yellow";
            else player.hair.color = "shiny black";
            this.outputText("Your hair is now " + player.hair.color + ", just like a bee-girl's!");
            this.changes++;
        }
        // Hair Length
        if (this.changes < this.changeLimit && player.hair.length < 25 && Utils.rand(3) == 0) {
            this.outputText("\n\nFeeling a bit off-balance, you discover your hair has lengthened, ");
            player.hair.length += Utils.rand(4) + 1;
            this.outputText("becoming " + this.getGame().player.hairDescript() + ".");
            this.changes++;
        }
        // -Remove extra breast rows
        if (this.changes < this.changeLimit && player.bRows() > 2 && Utils.rand(3) == 0 && !this.getGame().flags[kFLAGS.HYPER_HAPPY]) {
            this.mutations.removeExtraBreastRow(tfSource);
        }
        // Antennae
        if (this.changes < this.changeLimit && player.antennae.type == Antennae.NONE && player.horns.value == 0 && Utils.rand(3) == 0) {
            this.outputText("\n\nYour head itches momentarily as two floppy antennae sprout from your " + this.getGame().player.hairDescript() + ".");
            player.antennae.type = Antennae.BEE;
            this.changes++;
        }
        // Horns
        if (this.changes < this.changeLimit && player.horns.value > 0 && Utils.rand(3) == 0) {
            player.horns.value = 0;
            player.horns.type = Horns.NONE;
            this.outputText("\n\nYour horns crumble, falling apart in large chunks until they flake away to nothing.");
            this.changes++;
        }
        // Bee Legs
        if (this.changes < this.changeLimit && player.lowerBody.type != LowerBody.BEE && Utils.rand(4) == 0) {
            this.outputText("\n\nYour legs tremble with sudden unbearable pain, as if they're being ripped apart from the inside out and being stitched together again all at once.  You scream in agony as you hear bones snapping and cracking.  A moment later the pain fades and you are able to turn your gaze down to your beautiful new legs, covered in shining black chitin from the thigh down, and downy yellow fuzz along your upper thighs.");
            player.lowerBody.type = LowerBody.BEE;
            player.lowerBody.legCount = 2;
            this.changes++;
        }
        // (Arms to carapace-covered arms)
        if (player.arms.type !== Arms.BEE && this.changes < this.changeLimit && Utils.rand(4) === 0) {
            this.outputText("\n\n");
            if (player.arms.type === Arms.SPIDER) {
                this.outputText("On your upper arms slowly starting to grown yellow fuzz making them looks more like those of bee.");
            } else {
                // (Bird pretext)
                if (player.arms.type === Arms.HARPY) {
                    this.outputText("The feathers covering your arms fall away, leaving them to return to a far more human appearance.  ");
                }
                this.outputText("You watch, spellbound, while your forearms gradually become shiny.  The entire outer structure of your arms tingles"
                    + " while it divides into segments, <b>turning the [skinFurScales] into a shiny black carapace</b>.  A moment later the"
                    + " pain fades and you are able to turn your gaze down to your beautiful new arms, covered in shining black chitin from"
                    + " the upper arm down, and downy yellow fuzz along your upper arm.");
            }
            player.arms.setType(Arms.BEE);
            this.changes++;
        }
        // -Nipples reduction to 1 per tit.
        if (player.averageNipplesPerBreast() > 1 && this.changes < this.changeLimit && Utils.rand(4) == 0) {
            this.outputText("\n\nA chill runs over your " + player.allBreastsDescript() + " and vanishes.  You stick a hand under your " + player.armorName + " and discover that your extra nipples are missing!  You're down to just one per ");
            if (player.biggestTitSize() < 1) this.outputText("'breast'.");
            else this.outputText("breast.");
            this.changes++;
            // Loop through and reset nipples
            for (const breastRow of player.breastRows) {
                breastRow.nipplesPerBreast = 1;
            }
        }
        // Neck restore
        if (player.neck.type != Neck.NORMAL && this.changes < this.changeLimit && rand(4) == 0) this.mutations.restoreNeck(tfSource);
        // Rear body restore
        if (player.hasNonSharkRearBody() && this.changes < this.changeLimit && rand(5) == 0) this.mutations.restoreRearBody(tfSource);
        // Lose reptile oviposition!
        if (rand(4) == 0) this.mutations.updateOvipositionPerk(tfSource);
        // Gain bee oviposition!
        if (this.changes < this.changeLimit && player.findPerk(PerkLib.BeeOvipositor) < 0 && player.tail.type == Tail.BEE_ABDOMEN && Utils.rand(2) == 0) {
            this.outputText("\n\nAn odd swelling starts in your insectile abdomen, somewhere along the underside.  Curling around, you reach back to your extended, bulbous bee part and run your fingers along the underside.  You gasp when you feel a tender, yielding slit near the stinger.  As you probe this new orifice, a shock of pleasure runs through you, and a tubular, black, semi-hard appendage drops out, pulsating as heavily as any sexual organ.  <b>The new organ is clearly an ovipositor!</b>  A few gentle prods confirm that it's just as sensitive; you can already feel your internals changing, adjusting to begin the production of unfertilized eggs.  You idly wonder what laying them with your new bee ovipositor will feel like...");
            this.outputText("\n\n(<b>Perk Gained:  Bee Ovipositor - Allows you to lay eggs in your foes!</b>)");
            player.createPerk(PerkLib.BeeOvipositor, 0, 0, 0, 0);
            this.changes++;
        }
        // Bee butt - 66% lower chance if already has a tail
        if (this.changes < this.changeLimit && player.tail.type != Tail.BEE_ABDOMEN && (player.tail.type == Tail.NONE || Utils.rand(1.5) == 0) && Utils.rand(4) == 0) {
            if (player.tail.type > Tail.NONE) this.outputText("\n\nPainful swelling just above your " + this.getGame().player.buttDescript() + " doubles you over, and you hear the sound of your tail dropping off onto the ground!  Before you can consider the implications, the pain gets worse, and you feel your backside bulge outward sickeningly, cracking and popping as a rounded bee-like abdomen grows in place of your old tail.  It grows large enough to be impossible to hide, and with a note of finality, your stinger slides free with an audible 'snick'.");
            else this.outputText("\n\nPainful swelling just above your " + this.getGame().player.buttDescript() + " doubles you over.  It gets worse and worse as the swollen lump begins to protrude from your backside, swelling and rounding with a series of pops until you have a bulbous abdomen hanging just above your butt.  The whole thing is covered in a hard chitinous material, and large enough to be impossible to hide.  You sigh as your stinger slides into place with a 'snick', finishing the transformation.  <b>You have a bee's abdomen.</b>");
            player.tail.type = Tail.BEE_ABDOMEN;
            player.tail.venom = 10;
            player.tail.recharge = 2;
            this.changes++;
        }
        // Venom Increase
        if (this.changes < this.changeLimit && player.tail.type == Tail.BEE_ABDOMEN && player.tail.recharge < 15 && Utils.rand(2)) {
            if (player.tail.recharge < 5) player.tail.recharge += 1;
            if (player.tail.recharge < 10) player.tail.recharge += 1;
            if (player.tail.recharge < 15) player.tail.recharge += 1;
            player.tail.venom += 50;
            if (player.tail.venom > 100) player.tail.venom = 100;
            this.outputText("\n\nYour abdomen swells with vitality and a drop of venom escapes your stinger as it begins producing it in slightly larger quantities.");
            this.changes++;
        }
        // Wings
        // Grow bigger bee wings!
        if (this.changes < this.changeLimit && player.wings.type == Wings.BEE_LIKE_SMALL && Utils.rand(4)) {
            this.changes++;
            player.wings.type = Wings.BEE_LIKE_LARGE;
            this.outputText("\n\nYour wings tingle as they grow, filling out until they are large enough to lift you from the ground and allow you to fly!  <b>You now have large bee wings!</b>  You give a few experimental flaps and begin hovering in place, a giddy smile plastered on your face by the thrill of flight.");
        }

        // Grow new bee wings if player has none.
        if (this.changes < this.changeLimit && (player.wings.type == Wings.NONE || player.rearBody.type == RearBody.SHARK_FIN) && Utils.rand(4)) {
            if (player.rearBody.type == RearBody.SHARK_FIN) {
                this.outputText("\n\nYou feel an itching on your large back-fin as something begins growing there.  You twist and contort yourself,"
                    + " trying to scratch and bring yourself relief, and failing miserably.  A sense of relief erupts from you as you feel"
                    + " something new grow out from your fin.  You hastily remove the top portion of your " + player.armorName
                    + " and marvel as a pair of small bee-like wings sprout from your back, replacing the fin that once grew there."
                    + "  Tenderly flexing your new muscles, you find you can flap them quite fast.  Unfortunately you can't seem to flap"
                    + " your little wings fast enough to fly, but they would certainly slow a fall.  A few quick modifications to your "
                    + player.armorName + " later and you are ready to continue your journey with <b>your new bee wings</b>.");
                player.rearBody.restore();
            } else {
                this.outputText("\n\nYou feel an itching between your shoulder-blades as something begins growing there."
                    + "  You twist and contort yourself, trying to scratch and bring yourself relief, and failing miserably."
                    + "  A sense of relief erupts from you as you feel something new grow out from your body.  You hastily remove the top"
                    + " portion of your " + player.armorName + " and marvel as a pair of small bee-like wings sprout from your back."
                    + "  Tenderly flexing your new muscles, you find you can flap them quite fast.  Unfortunately you can't seem to flap"
                    + " your little wings fast enough to fly, but they would certainly slow a fall.  A few quick modifications to your "
                    + player.armorName + " later and you are ready to continue your journey with <b>your new bee wings</b>.");
            }
            this.changes++;
            player.wings.type = Wings.BEE_LIKE_SMALL;
        }
        // Melt demon wings!
        if (this.changes < this.changeLimit && (player.wings.type == Wings.BAT_LIKE_TINY || player.wings.type == Wings.BAT_LIKE_LARGE)) {
            this.changes++;
            this.outputText("\n\nYour demonic wings ripple, jelly-like.  Worried, you crane back to look, and to your horror, they're melting away!  Runnels of amber honey trail down the wings' edges, building into a steady flow.  <b>In a moment, the only remnant of your wings is a puddle of honey in the dirt</b>.  Even that is gone in seconds, wicked into the dry soil.");
            player.wings.type = Wings.NONE;
        }
        // Remove gills!
        if (Utils.rand(4) == 0 && player.hasGills() && this.changes < this.changeLimit) this.mutations.updateGills();

        if (special) { // All the speical honey effects occur after any normal bee transformations (if the player wasn't a full bee morph)
            // Cock growth multiplier.
            let mult: number = 1.0;
            if (player.hasCock()) {
                if (player.cocks[0].cArea() >= 140) mult -= 0.2;
                if (player.cocks[0].cArea() >= 180) mult -= 0.2;
                if (player.cocks[0].cArea() >= 220) mult -= 0.2;
                if (player.cocks[0].cArea() >= 260) mult -= 0.2;
                if (player.cocks[0].cArea() >= 300) mult -= 0.1;
                if (player.cocks[0].cArea() >= 400) mult -= 0.1; // Cock stops growing at that point.
            }
            // Begin TF
            if (!player.hasCock()) {
                this.outputText("\n\nYou double over in pain as the effects start to concentrate into your groin.  You need to get release, but what you’ve got just isn’t cutting it.  You fall to the ground and grab at your crotch, trying desperately to get the release you need.  Finally, it happens.  With a sudden burst of intense relief and sexual satisfaction, a new human looking penis bursts from your skin and sprays your seed all over the ground in front of you.  When you’re able to recover and take a look at your new possession.  <b>You now have an eight inch long human cock that is very sensitive to stimulation.</b>");
                player.createCock();
                player.cocks[0].cockLength = Utils.rand(3) + 8;
                player.cocks[0].cockThickness = 2;
                player.orgasm('Dick');
                this.getGame().dynStats("sen", 10);
            }
            else if (player.cocks.length > 1) {
                const biggest: number = player.biggestCockIndex();
                this.outputText("\n\nThe effects of the honey move towards your groin, and into your " + player.multiCockDescriptLight() + ", causing them to stand at attention.  They quiver for a moment, and feel rather itchy.  Suddenly you are overwhelmed with pleasure as <b>your " + player.cockDescript(biggest) + " is absorbed into your " + player.cockDescript(0) + "!</b>  You grab onto the merging cock and pump it with your hands as it increases in size and you cum in pleasure.  Your " + player.cockDescript(0) + " seems a lot more sensitive now...");
                player.cocks[0].cockLength += 5 * Math.sqrt(0.2 * player.cocks[biggest].cArea());
                player.cocks[0].cockThickness += Math.sqrt(0.2 * player.cocks[biggest].cArea());
                player.removeCock(biggest, 1);
                player.orgasm('Dick');
                this.getGame().dynStats("sen", 5);
            }
            else if (player.cocks[0].cArea() < 100) {
                this.outputText("\n\nYour " + player.cockDescript(0) + " suddenly becomes rock hard and incredibly sensitive to the touch.  You pull away your " + player.armorName + ", and start to masturbate furiously as it rapidly swells in size.  When the change finally finishes, you realize that your " + player.cockDescript(0) + " has both grown much longer and wider!  <b>");
                if (player.cocks[0].cArea() <= 20)
                    this.outputText("It now swings as low as your knees!");
                else if (player.cocks[0].cArea() <= 50)
                    this.outputText("While erect, your massive member fills the lower half of your vision.");
                else this.outputText("Your member is now simply huge, you wonder what in the world could actually take your massive size now?");
                this.outputText("</b>");
                player.cocks[0].cockLength += (Utils.rand(3) + 4) * mult; // 4 to 6 inches in length
                player.cocks[0].cockThickness += (0.1 * Utils.rand(5) + 0.5) * mult; // 0.5 to 1 inches in thickness
                this.getGame().dynStats("sen", 5);
            }
            else if (player.cocks[0].cockType != CockTypesEnum.BEE && player.race == "bee-morph") {
                this.outputText("\n\nYour huge member suddenly starts to hurt, especially the tip of the thing.  At the same time, you feel your length start to get incredibly sensitive and the base of your shaft starts to itch.  You tear off your " + player.armorName + " and watch in fascination as your " + player.cockDescript(0) + " starts to change.  The shaft turns black, while becoming hard and smooth to the touch, while the base develops a mane of four inch long yellow bee hair.  As the transformation continues, your member grows even larger than before.  However, it is the tip that keeps your attention the most, as a much finer layer of short yellow hairs grow around it.  Its appearance isn’t the thing that you care about right now, it is the pain that is filling it.\n\n");
                this.outputText("It is entirely different from the usual feeling you get when you’re cock grows larger from imbibing transformative substances.  When the changes stop, the tip is shaped like a typical human mushroom cap covered in fine bee hair, but it feels nothing like what you’d expect a human dick to feel like.  Your whole length is incredibly sensitive, and touching it gives you incredible stimulation, but you’re sure that no matter how much you rub it, you aren’t going to cum by yourself.  You want cool honey covering it, you want tight walls surrounding it, you want to fertilize hundreds of eggs with it.  These desires are almost overwhelming, and it takes a lot of will not to just run off in search of the bee girl that gave you that special honey right now.  This isn’t good.\n\n");
                this.outputText("<b>You now have a bee cock!</b>");
                player.cocks[0].cockType = CockTypesEnum.BEE;
                player.cocks[0].cockLength += 5 * mult;
                player.cocks[0].cockThickness += 1 * mult;
                this.getGame().dynStats("sen", 15);
            }
            else {
                if (mult > 0) {
                    this.outputText("\n\nThe effects of the honey don’t seem to focus on your groin this time, but you still feel your " + player.cockDescript(0) + " grow slightly under your " + player.armorName + ".");
                    player.cocks[0].cockLength += (0.1 * Utils.rand(10) + 1) * mult;
                    player.cocks[0].cockThickness += (0.1 * Utils.rand(2) + 0.1) * mult;
                }
                else {
                    this.outputText("\n\nThe effects of the honey don’t seem to focus on your groin this time and you have a feeling that your " + player.cockDescript(0) + " hasn't grown at all! Perhaps you've reached the upper limit of cock growth from special honey?");
                }
                this.getGame().dynStats("sen", 3);
            }
            if (player.cor >= 5) {
                this.outputText("\n\nYour mind feels surprisingly clear of the twisted thoughts that have plagued it as of late, but you find yourself feeling more and more aroused than usual.");
                const corLoss: number = Math.min(0.1 * player.cor + 5, player.cor);
                this.getGame().dynStats("cor", -corLoss, "lib", corLoss); // Lose corruption and gains that much libido
            }
            else {
                this.outputText("\n\nYou find your mind is drifting to the thought of using your member to fertilize hundreds and hundreds of eggs every day.  You shake your head, the bizarre fantasy catching you completely off guard.");
                this.getGame().dynStats("cor=", 0, "lib", 5);
            }
            if (player.femininity >= 60 || player.femininity <= 40) {
                this.outputText("\n\nYour face shifts in shape, becoming more androgynous.");
                if (player.femininity >= 60)
                    player.femininity -= 3;
                else player.femininity += 3;
            }
            this.getGame().dynStats("lust", 0.2 * player.lib + 5);
        }
        this.game.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;
        return (false);
    }
}
