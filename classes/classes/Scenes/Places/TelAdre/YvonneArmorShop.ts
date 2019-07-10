import { Shop } from "./Shop";
import { SpriteDb } from "../../../display/SpriteDb";
import { kGAMECLASS } from "../../../GlobalFlags/kGAMECLASS";
import { ItemUpgrade } from "../../ItemUpgrade";
import { ItemType } from "../../../ItemType";
import { Armor } from "../../../Items/Armor";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";

export class YvonneArmorShop extends Shop {
    public constructor() {
        super();
        this.sprite = SpriteDb.s_yvonne;
    }

    // const YVONNE_FUCK_COUNTER: number = 437;

    protected inside(): void {
        this.clearOutput();
        this.outputText("The interior of the armory is blisteringly hot, filled with intense heat from the massive forge dominating the far side of the shop.  The bellows are blowing hard as a tall german-shepherd woman works the forge.  Incredibly, she's wearing nothing aside from a ragged leather apron.  It bulges from the front, barely containing her obscene proportions as it protects them from the heat of her forge.  She pulls a piece of metal from the forge and strikes it a few times with a hammer bigger than your head, then tosses it in a bucket filled with water, steam boiling out of it from the hot metal.  At last, the sweating forgemistress notices you and turns around, her breasts jiggling wildly.\n\n");
        this.outputText("\"<i>What can I make for you?  Platemail?  Or something that breathes a little easier?</i>\" Yvonne asks, fanning herself.");
        this.menu();
        this.addItemBuyButton(this.armors.CHBIKNI);
        this.addItemBuyButton(this.armors.FULLCHN);
        this.addItemBuyButton(this.armors.FULLPLT);
        this.addItemBuyButton(this.armors.INDECST);
        this.addItemBuyButton(this.armors.LTHRROB);
        this.addItemBuyButton(this.armors.SCALEML);
        this.addItemBuyButton(this.armors.SAMUARM);
        this.addItemBuyButton(this.shields.BUCKLR0);
        this.addItemBuyButton(this.shields.KITESH0);
        this.addItemBuyButton(this.shields.GRTSHL0);
        this.addItemBuyButton(this.shields.TOWRSH0);

        if (this.player.hasKeyItem("Dragon Eggshell") >= 0) {
            this.outputText("\n\nThough the pieces on display have their arguable attractions, none of them really interest you.  Yvonne taps her foot impatiently.  \"<i>Well, I could make you something to order... if you have any decent materials, cutie.  200 gems.</i>\"");
            if (this.player.gems < 200) {
                this.outputText("\n\nYou can't afford that!");
            }
            else {
                this.addButton(11, "Eggshell", kGAMECLASS.emberScene.getSomeStuff);
            }
        }
        this.addButton(12, "Upgrade", this.getGame().equipmentUpgrade.equipmentUpgradeMenu, ItemUpgrade.TELADRE_ARMOUR_SHOP, this.inside);
        this.addButton(13, "Flirt", this.yvonneFlirt);
        this.addButton(14, "Leave", this.telAdre.telAdreMenu);
    }

    protected confirmBuy(itype: ItemType, priceOverride: number = -1, keyItem: string = ""): void {
        this.spriteSelect(64);
        this.clearOutput();
        if (itype instanceof Armor) {
            this.outputText("Yvonne gives you a serious look, then nods.  She pulls the armor off a rack and makes a few adjustments, banging away with her massive hammer to ensure a perfect fit.  The entire time, she's oblivious to the movements of her massive breasts, accidentally exposing her impressive nipples multiple times.\n\n");
            this.outputText("She finishes and turns to you, smiling broadly, \"<i>Now, that will be " + itype.value + " gems, unless you want to change your mind?</i>\"");
        }
        else {
            this.outputText("Yvonne gives you a serious look, then nods.  She pulls the shield off a rack and shows it to you.\n\n");
            this.outputText("She smiles broadly, \"<i>Now, that will be " + itype.value + " gems, unless you want to change your mind?</i>\"");
        }
        super.confirmBuy(itype);
    }

    // [Flirt]
    private yvonneFlirt(): void {
        this.spriteSelect(64);
        this.clearOutput();
        this.outputText("You step closer, glancing from her bulging, barely contained tits to her pouting lips and expressive, violet eyes.  A shock of sweat-matted auburn hair obscures part of her face, but the tall, buxom blacksmith nervously brushes it aside as she watches.  Once you're close enough to touch, you quietly and sincerely proclaim, \"<i>You're the most beautiful piece of craftsmanship in this entire store.</i>\"");
        this.outputText("\n\nYvonne steps back, and you swear you can see a blush blooming through her fur, a fiery glow of embarrassment that spreads to the upper curve of her immense mammaries.  She folds her arms over her apron, unintentionally smushing those gigantic tits closer together and deepening her cleavage into a canyon. An immense sigh causes the plush plateau to sway pendulously as Yvonne answers, \"<i>");
        this.dynStats("lus", (10 + this.player.lib / 10));

        // Brain no want to work out the boolean logic shit here, broken out to ensure it will work as intended.
        if (this.player.cockTotal() === 0) {
            this.outputText("Sorry, but you don't look like you'd be much fun.");
            this.outputText("</i>\"");
            this.doNext(this.inside);
            return;
        }
        else if (this.player.tallness > 65 && !this.flags[kFLAGS.LOW_STANDARDS_FOR_ALL]) {
            this.outputText("Sorry, but you don't look like you'd be much fun.");
            this.outputText("</i>\"");
            this.doNext(this.inside);
            return;
        }
        else if (this.player.cockThatFits(75) === -1 && !this.flags[kFLAGS.LOW_STANDARDS_FOR_ALL]) {
            this.outputText("Sorry, but you don't look like you'd be much fun.");
            this.outputText("</i>\"");
            this.doNext(this.inside);
            return;
        }

        if (this.flags[kFLAGS.YVONNE_FUCK_COUNTER] === 0) {
            this.outputText("Well, I could use a quick fuck.  If you meant what you said, go change the sign to say 'out' please.");
        } else {
            this.outputText("You want to go again, huh?  I do love working up a sweat...");
        }
        this.outputText("</i>\"");
        // [Fuck] [Nevermind]
        this.menu();
        this.addButton(0, "Fuck Her", this.fuckYvonneInZeBlacksmith);
        this.addButton(1, "Nevermind", this.backOutOfYvonneFuck);
    }

    // [Nevermind]
    private backOutOfYvonneFuck(): void {
        this.spriteSelect(64);
        this.clearOutput();
        this.outputText("You politely decline, not wanting to interrupt her work.  Yvonne sighs and begins to pump the bellows, muttering, \"<i>Then you'd better be buying something!</i>\"");
        this.doNext(this.inside);
    }

    // [Fuck]
    private fuckYvonneInZeBlacksmith(): void {
        this.spriteSelect(64);
        this.clearOutput();
        // X = cock that fits!
        let x: number = this.player.cockThatFits(75);
        if (x < 0) {
            x = 0;
        }
        // Used for the new cock stuff
        const y: number = x + 1;
        this.outputText("You walk over to the door and find a sign hanging in front of the window.  The side facing indoors has 'out' on it.  There's also a 'closed' sign hanging to the side of the doorframe.  You take the simple wood plaque in hand and flip it over - can't have anybody walking in on your sexual hijinks, can you?");
        this.outputText("\n\nA fuzzy, calloused hand grabs you by the scuff of the neck, lifts you off the ground and pushes you against the wall, slamming you into it forcefully enough that some weapons hanging nearby rattle dangerously.  A hot puff of breath hits your cheek, Yvonne's wet, canine nose bumping against your ear as she pants in your face.  She closes, and you feel her bare, sweat-soaked breasts sliding up and down your back, holding you up as firmly as her iron grip.  Yvonne's long, smooth tongue licks you from collarbone to chin, lapping up the sweat that's already starting to bead, the heat of the simmering forge-fires and your companion's well-warmed, powerful frame long since getting to you.");
        this.outputText("\n\nA distinctly feminine scent wafts up to your nostrils, intermingled with the blacksmith's own pungent body-odor, strong enough to make your head swim.  Yvonne's free hand begins removing your [armor], the blacksmith's confident motions suggesting she's had plenty of experience at this.  The aroma of the super-stacked bitch's estrus increases to the point where it nearly overpowers her salty sweat-smell, her nipples pressing hard into your back.  [EachCock] grows hard from the forceful attention, pinned between the wall and your belly.  Finished with your gear, Yvonne nips your neck and says, \"<i>Nice package, ");
        if (this.player.cockArea(x) < 20) {
            this.outputText("runt");
        } else if (this.player.cockArea(x) < 40) {
            this.outputText(this.player.mf("boy", "girl"));
        } else if (this.player.cockArea(x) < 60) {
            this.outputText("big " + this.player.mf("boy", "girl"));
        } else {
            this.outputText(this.player.mf("stud", "breeder"));
        }
        this.outputText(".</i>\"");
        this.outputText("\n\nThe forge-mistress abruptly releases you and steps away, the supporting cushion of her breasts no longer there to help balance you.  After a moment of confused stumbling, you catch yourself and turn around, curious as to just what the buxom bitch is doing.");
        this.outputText("\n\nYvonne is on the ground on all fours.  Her tail is sticking nearly straight up, waving back and forth excitedly as she presents her curvy rump to you.  Surprisingly, her ass is much less muscular than her upper body, with a pair of pillowy buttcheeks that nearly conceal her soaked cunny from view.  You aren't sure if it's lubricant from her arousal, or sweat from working the forge all day, but Yvonne's thighs are absolutely drenched with moisture; a veritable slip n' slide of wetness that beckons you to bury your bone in the canine's feminine entrance.  She glances back over her shoulder, a submissive glint in her eyes as she begs, \"<i>Come on, be my alpha.  This bitch needs a hot, wet fuck.  Do it!</i>\"  What an odd dichotomy - one moment she's throwing you around, the next, begging to be mounted.  For all her power, it seems Yvonne still wants to be taken as a meek bitch.");
        this.outputText("\n\nYou sidle up to the larger woman and begin aligning [oneCock] with her mammoth buns, the sweltering, pheromone-laced stink pouring from her body making it difficult not to fall on top of her and rut.  Her huge tits are squished against the floor, squeezing out obscenely to either side of the blacksmith's lithe, muscular torso.  When you push inside, her slick wet cunt squeezes your [cock " + y + "] powerfully but affectionately.  Her potent vaginal muscles work your [cock " + y + "] over, tightly embracing your turgid dickflesh as you begin to fuck her properly, plowing her sweat and love-juice soaked folds even while you struggle to reach up for her incredible breasts.");
        this.outputText("\n\nYou get a handhold on the soft chest-flesh and begin to massage at what you can find, releasing appreciative moans from your partner.  Unfortunately, her furiously-wagging tail bludgeons you across the nose over and over, and you're forced to block it with one arm so that you can ream her snatch unimpeded by the woman's canine instincts.  She growls, but doesn't stop you.  You can see the muscles in her arms quivering, shaking, struggling to maintain her posture in spite of the overwhelming pleasure your [cock " + y + "] is inflicting upon her poor womanhood.");
        this.outputText("\n\nA shiver runs through the dog-morph's entire body, culminating in a cock-wringing contraction that ripples through her cunt, milking you with her slippery twat.  It works, and you lean over her prostrate form as you bottom out inside her, her sweat-matted fur smearing your face with her scent as you cum.  ");
        if (this.player.hasKnot(x)) {
            this.outputText("Your knot fills, locking you inside her, securely blocking any escape for the jizz you're now filling her depths with.  Yvonne sighs dreamily, \"<i>Just right...</i>\" while spunk slides into her birth canal to infiltrate her womb.[if (cumQuantity > 500) \"  The pearly goop spatters into her womb with egg-inseminating force, filling her beyond her wildest expectations.\"][if (cumQuantity > 1000) \"  The blacksmith cries out in pain and pleasure, her belly rounding with your liquid, taking on a more pregnant, stuffed-silly look.\"][if (cumQuantity > 2000) \"  Thanks to your knot, not a single drop escapes, and soon Yvonne's belly is as fat as her tits, cum-bloated in the extreme, a sloshing auburn tub packed with ivory sperm.\"]");
        } else {
            this.outputText("Your jizz bubbles out to fill her depths, the spunk surging through her as it moves towards her womb.  Yvone sighs dreamily, \"<i>Ahhhh...</i>\" while you empty your [balls] inside her unprotected womanhood.[if (cumQuantity > 500) \"  The pearly goop spatters into her uterus with egg-inseminating force, filling the bitch beyond her wildest expectations.\"][if (cumQuantity > 1000)  The blacksmith cries out in pain and pleasure, her belly rounding with your liquid, looking positively pregnant.  Her twat begins to dribble sperm, creampied beyond belief.][if (cumQuantity > 2000) \"  Unfortunately, as your virility makes itself known, Yvonne's body hits its limit, and jets of ivory spooge squirt from all sides of her cunny, dribbling into a pearly puddle on the floor.\"]");
        }
        // still no new pg
        this.outputText("  With a thoroughly cream-stuffed twat beneath you, you ");
        if (this.player.hasKnot(x)) {
            this.outputText("pop");
        } else {
            this.outputText("pull");
        }
        this.outputText(" out, accompanied by a exhalation of female pleasure.");
        this.outputText("\n\nYvonne staggers up on her footpaws, groaning the whole time, a trail of white dribbling on the floor behind her.  Her tail wags happily, and she grabs you, pulling you into her sweaty bosom as she affectionately squeezes your [butt].  You aren't released until you feel dizzy, half-suffocated by her preponderance of breast-tissues and potent pheromones.");
        this.outputText("\n\nYvonne tosses you your gear, and you dress in a daze.  Before you've completely finished, she's pushing you out into the street, covered in sex-stink and stumbling over your own [feet].  She calls out after you, \"<i>Thanks babe, I gotta mop this mess up!</i>\"");
        this.player.orgasm();
        this.dynStats("sen", -1);
        this.flags[kFLAGS.YVONNE_FUCK_COUNTER]++;
        this.doNext(this.camp.returnToCampUseOneHour);
    }
}
