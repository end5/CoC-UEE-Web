import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { Face } from "../../BodyParts/Face";
import { Tail } from "../../BodyParts/Tail";
import { Ears } from "../../BodyParts/Ears";
import { LowerBody } from "../../BodyParts/LowerBody";
import { rand } from "../../Extra";
import { PerkLib } from "../../PerkLib";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { ColorLists } from "../../lists/ColorLists";
import { Hair } from "../../BodyParts/Hair";
import { CockTypesEnum } from "../../CockTypesEnum";
import { Appearance } from "../../Appearance";
import { StatusEffects } from "../../StatusEffects";
import { Neck } from "../../BodyParts/Neck";
import { Skin } from "../../BodyParts/Skin";
import { UnderBody } from "../../BodyParts/UnderBody";
import { Arms } from "../../BodyParts/Arms";

/**
 * @since March 26, 2018
 * @author Stadler76
 */
export class FoxBerry extends Consumable {
    public static STANDARD: number = 0;
    public static ENHANCED: number = 1;

    private enhanced: boolean;

    public constructor(type: number) {
        let id: string;
        let shortName: string;
        let longName: string;
        let description: string;
        let value: number;

        switch (type) {
            case FoxBerry.STANDARD:
                id = "FoxBery";
                shortName = "Fox Berry";
                longName = "a fox berry";
                description = "This large orange berry is heavy in your hands. It may have gotten its name from its bright orange coloration."
                    + " You're certain it is no mere fruit.";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            case FoxBerry.ENHANCED:
                id = "VixVigr";
                shortName = "VixVigr";
                longName = 'a bottle labelled "Vixen\'s Vigor"';
                description = 'This small medicine bottle contains something called "Vixen\'s Vigor", supposedly distilled from common'
                    + ' fox-berries. It is supposed to be a great deal more potent, and a small warning label warns of "extra boobs",'
                    + ' whatever that means.';
                value = 30;
                break;

            default: // Remove this if someone manages to get SonarQQbe to not whine about a missing default ... ~Stadler76
                throw new Error("FoxBerry. Incorrect or no type passed to constructor");
        }

        super(id, shortName, longName, value, description);
        this.enhanced = type === FoxBerry.ENHANCED;
    }

    public useItem(): boolean {
        const tfSource: string = "foxTF";
        let temp: number;
        this.mutations.initTransformation([2, 2], this.enhanced ? 3 : 1);
        this.clearOutput();
        if (!this.enhanced) this.outputText("You examine the berry a bit, rolling the orangish-red fruit in your hand for a moment before you decide to take the plunge and chow down.  It's tart and sweet at the same time, and the flavors seem to burst across your tongue with potent strength.  Juice runs from the corners of your lips as you finish the tasty snack.");
        else this.outputText("You pop the cap on the enhanced \"Vixen's Vigor\" and decide to take a swig of it.  Perhaps it will make you as cunning as the crude fox Lumi drew on the front?");
        // Used for dick and boob TFs
        let counter: number = 0;

        if (this.player.face.type == Face.FOX && this.player.tail.type == Tail.FOX && this.player.ears.type == Ears.FOX && this.player.lowerBody.type == LowerBody.FOX && this.player.hasFur() && rand(3) === 0 && !this.player.hasPerk(PerkLib.TransformationResistance)) {
            if (this.flags[kFLAGS.FOX_BAD_END_WARNING] == 0) {
                this.outputText("\n\nYou get a massive headache and a craving to raid a henhouse.  Thankfully, both pass in seconds, but <b>maybe you should cut back on the vulpine items...</b>");
                this.flags[kFLAGS.FOX_BAD_END_WARNING] = 1;
            }
            else {
                this.outputText("\n\nYou scarf down the ");
                if (this.enhanced) this.outputText("fluid ");
                else this.outputText("berries ");
                this.outputText("with an uncommonly voracious appetite, taking particular enjoyment in the succulent, tart flavor.  As you carefully suck the last drops of ochre juice from your fingers, you note that it tastes so much more vibrant than you remember.  Your train of thought is violently interrupted by the sound of bones snapping, and you cry out in pain, doubling over as a flaming heat boils through your ribs.");
                this.outputText("\n\nWrithing on the ground, you clutch your hand to your chest, looking on in horror through tear-streaked eyes as the bones in your fingers pop and fuse, rearranging themselves into a dainty paw covered in coarse black fur, fading to a ruddy orange further up.  You desperately try to call out to someone - anyone - for help, but all that comes out is a high-pitched, ear-splitting yap.");
                if (this.player.tail.venom > 1) this.outputText("  Your tails thrash around violently as they begin to fuse painfully back into one, the fur bristling back out with a flourish.");
                this.outputText("\n\nA sharp spark of pain jolts through your spinal column as the bones shift themselves around, the joints in your hips migrating forward.  You continue to howl in agony even as you feel your intelligence slipping away.  In a way, it's a blessing - as your thoughts grow muddied, the pain is dulled, until you are finally left staring blankly at the sky above, tilting your head curiously.");
                this.outputText("\n\nYou roll over and crawl free of the " + this.player.armorName + " covering you, pawing the ground for a few moments before a pang of hunger rumbles through your stomach.  Sniffing the wind, you bound off into the wilderness, following the telltale scent of a farm toward the certain bounty of a chicken coop.");
                this.getGame().gameOver();
                return false;
            }
        }
        // [increase Intelligence, Libido and Sensitivity]
        if (this.changes < this.changeLimit && rand(3) === 0 && (this.player.lib100 < 80 || this.player.inte100 < 80 || this.player.sens100 < 80)) {
            this.outputText("\n\nYou close your eyes, smirking to yourself mischievously as you suddenly think of several new tricks to try on your opponents; you feel quite a bit more cunning.  The mental picture of them helpless before your cleverness makes you shudder a bit, and you lick your lips and stroke yourself as you feel your skin tingling from an involuntary arousal.");
            if (this.player.inte100 < 80) this.dynStats("int", 4);
            if (this.player.lib100 < 80) this.dynStats("lib", 1);
            if (this.player.sens100 < 80) this.dynStats("sen", 1);
            // gain small lust also
            this.dynStats("lus", 10);
        }
        // [decrease Strength] (to some floor) // I figured 15 was fair, but you're in a better position to judge that than I am.
        if (this.changes < this.changeLimit && rand(3) === 0 && this.player.str100 > 40) {
            this.outputText("\n\nYou can feel your muscles softening as they slowly relax, becoming a tad weaker than before.  Who needs physical strength when you can outwit your foes with trickery and mischief?  You tilt your head a bit, wondering where that thought came from.");
            this.dynStats("str", -1);
            if (this.player.str100 > 60) this.dynStats("str", -1);
            if (this.player.str100 > 80) this.dynStats("str", -1);
            if (this.player.str100 > 90) this.dynStats("str", -1);
        }
        // [decrease Toughness] (to some floor) // 20 or so was my thought here
        if (this.changes < this.changeLimit && rand(3) === 0 && this.player.tou100 > 30) {
            if (this.player.tou100 < 60) this.outputText("\n\nYou feel your skin becoming noticeably softer.  A gentle exploratory pinch on your arm confirms it - your supple skin isn't going to offer you much protection.");
            else this.outputText("\n\nYou feel your skin becoming noticeably softer.  A gentle exploratory pinch on your arm confirms it - your hide isn't quite as tough as it used to be.");
            this.dynStats("tou", -1);
            if (this.player.tou100 > 60) this.dynStats("tou", -1);
            if (this.player.tou100 > 80) this.dynStats("tou", -1);
            if (this.player.tou100 > 90) this.dynStats("tou", -1);
        }

        // [Change Hair Color: Golden-blonde or Reddish-orange]
        const fox_hair: any[] = ["golden blonde", "reddish-orange", "silver", "white", "red", "black"];
        if (!FoxBerry.InCollection(this.player.hair.color, fox_hair) && !FoxBerry.InCollection(this.player.hair.color, ColorLists.BASIC_KITSUNE_HAIR) && !FoxBerry.InCollection(this.player.hair.color, ColorLists.ELDER_KITSUNE) && this.changes < this.changeLimit && rand(4) === 0) {
            if (this.player.tail.type == Tail.FOX && this.player.tail.venom > 1)
                if (this.player.tail.venom < 9) this.player.hair.color = FoxBerry.randomChoice(ColorLists.BASIC_KITSUNE_HAIR);
                else this.player.hair.color = FoxBerry.randomChoice(ColorLists.ELDER_KITSUNE);
            else this.player.hair.color = FoxBerry.randomChoice(fox_hair);
            this.outputText("\n\nYour scalp begins to tingle, and you gently grasp a strand of hair, pulling it out to check it.  Your hair has become " + this.player.hair.color + "!");
        }
        // [Adjust hips toward 10 – wide/curvy/flared]
        if (this.changes < this.changeLimit && rand(3) === 0 && this.player.hips.rating !== 10) {
            // from narrow to wide
            if (this.player.hips.rating < 10) {
                this.outputText("\n\nYou stumble a bit as the bones in your pelvis rearrange themselves painfully.  Your waistline has widened into [hips]!");
                this.player.hips.rating++;
                if (this.player.hips.rating < 7) this.player.hips.rating++;
            }
            // from wide to narrower
            else {
                this.outputText("\n\nYou stumble a bit as the bones in your pelvis rearrange themselves painfully.  Your waistline has narrowed, becoming [hips].");
                this.player.hips.rating--;
                if (this.player.hips.rating > 15) this.player.hips.rating--;
            }
            this.changes++;
        }
        // [Remove tentacle hair]
        // required if the hair length change below is triggered
        if (this.changes < this.changeLimit && this.player.hair.type == 4 && rand(3) === 0) {
            // -insert anemone hair removal into them under whatever criteria you like, though hair removal should precede abdomen growth; here's some sample text:
            this.outputText("\n\nEerie flames of the jewel migrate up your body to your head, where they cover your [hair].  Though they burned nowhere else in their lazy orbit, your head begins to heat up as they congregate.  Fearful, you raise your hands to it just as the temperature peaks, but as you touch your hair, the searing heat is suddenly gone - along with your tentacles!  <b>Your hair is normal again!</b>");
            this.player.hair.type = Hair.NORMAL;
            this.changes++;
        }
        // [Adjust hair length toward range of 16-26 – very long to ass-length]
        if (this.player.hair.type !== 4 && (this.player.hair.length > 26 || this.player.hair.length < 16) && this.changes < this.changeLimit && rand(4) === 0) {
            if (this.player.hair.length < 16) {
                this.player.hair.length += 1 + rand(4);
                this.outputText("\n\nYou experience a tingling sensation in your scalp.  Feeling a bit off-balance, you discover your hair has lengthened, becoming " + FoxBerry.num2Text(Math.round(this.player.hair.length)) + " inches long.");
            }
            else {
                this.player.hair.length -= 1 + rand(4);
                this.outputText("\n\nYou experience a tingling sensation in your scalp.  Feeling a bit off-balance, you discover your hair has shed a bit of its length, becoming " + FoxBerry.num2Text(Math.round(this.player.hair.length)) + " inches long.");
            }
            this.changes++;
        }
        if (this.changes < this.changeLimit && rand(10) === 0) {
            this.outputText("\n\nYou sigh as the exotic flavor washes through you, and unbidden, you begin to daydream.  Sprinting through the thicket, you can feel the corners of your muzzle curling up into a mischievous grin.  You smell the scent of demons, and not far away either.  With your belly full and throat watered, now is the perfect time for a little bit of trickery.   As the odor intensifies, you slow your playful gait and begin to creep a bit more carefully.");
            this.outputText("\n\nSuddenly, you are there, at a demonic camp, and you spy the forms of an incubus and a succubus, their bodies locked together at the hips and slowly undulating, even in sleep.  You carefully prance around their slumbering forms and find their supplies.  With the utmost care, you put your razor-sharp teeth to work, and slowly, meticulously rip through their packs - not with the intention of theft, but with mischief.  You make sure to leave small holes in the bottom of each, and after making sure your stealth remains unbroken, you urinate on their hooves.");
            this.outputText("\n\nThey don't even notice, so lost in the subconscious copulation as they are.  Satisfied at your petty tricks, you scurry off into the night, a red blur amidst the foliage.");
            this.changes++;
            this.player.changeFatigue(-10);
        }

        // dog cocks!
        if (this.changes < this.changeLimit && rand(3) === 0 && this.player.dogCocks() < this.player.cocks.length) {
            const choices: any[] = [];
            counter = this.player.cockTotal();
            while (counter > 0) {
                counter--;
                // Add non-dog locations to the array
                if (this.player.cocks[counter].cockType !== CockTypesEnum.DOG) choices[choices.length] = counter;
            }
            if (choices.length !== 0) {
                const select: number = choices[rand(choices.length)];
                if (this.player.cocks[select].cockType == CockTypesEnum.HUMAN) {
                    this.outputText("\n\nYour " + this.player.cockDescript(select) + " clenches painfully, becoming achingly, throbbingly erect.  A tightness seems to squeeze around the base, and you wince as you see your skin and flesh shifting forwards into a canine-looking sheath.  You shudder as the crown of your " + this.player.cockDescript(select) + " reshapes into a point, the sensations nearly too much for you.  You throw back your head as the transformation completes, your " + Appearance.cockNoun(CockTypesEnum.DOG) + " much thicker than it ever was before.  <b>You now have a dog-cock.</b>");
                    this.player.cocks[select].cockThickness += .3;
                    this.dynStats("sen", 10, "lus", 5);
                }
                // Horse
                else if (this.player.cocks[select].cockType == CockTypesEnum.HORSE) {
                    this.outputText("\n\nYour " + Appearance.cockNoun(CockTypesEnum.HORSE) + " shrinks, the extra equine length seeming to shift into girth.  The flared tip vanishes into a more pointed form, a thick knotted bulge forming just above your sheath.  <b>You now have a dog-cock.</b>");
                    // Tweak length/thickness.
                    if (this.player.cocks[select].cockLength > 6) this.player.cocks[select].cockLength -= 2;
                    else this.player.cocks[select].cockLength -= .5;
                    this.player.cocks[select].cockThickness += .5;

                    this.dynStats("sen", 4, "lus", 5);
                }
                // Tentacular Tuesday!
                else if (this.player.cocks[select].cockType == CockTypesEnum.TENTACLE) {
                    this.outputText("\n\nYour " + this.player.cockDescript(select) + " coils in on itself, reshaping and losing its plant-like coloration as thickens near the base, bulging out in a very canine-looking knot.  Your skin bunches painfully around the base, forming into a sheath.  <b>You now have a dog-cock.</b>");
                    this.dynStats("sen", 4, "lus", 10);
                }
                // Misc
                else {
                    this.outputText("\n\nYour " + this.player.cockDescript(select) + " trembles, reshaping itself into a shiny red doggie-dick with a fat knot at the base.  <b>You now have a dog-cock.</b>");
                    this.dynStats("sen", 4, "lus", 10);
                }
                this.player.cocks[select].cockType = CockTypesEnum.DOG;
                this.player.cocks[select].knotMultiplier = 1.25;
                this.changes++;
            }

        }
        // Cum Multiplier Xform
        if (this.player.cumQ() < 5000 && rand(3) === 0 && this.changes < this.changeLimit && this.player.hasCock()) {
            temp = 2 + rand(4);
            // Lots of cum raises cum multiplier cap to 2 instead of 1.5
            if (this.player.hasPerk(PerkLib.MessyOrgasms)) temp += rand(10);
            this.player.cumMultiplier += temp;
            // Flavor text
            if (this.player.balls == 0) this.outputText("\n\nYou feel a churning inside your gut as something inside you changes.");
            if (this.player.balls > 0) this.outputText("\n\nYou feel a churning in your " + this.player.ballsDescriptLight() + ".  It quickly settles, leaving them feeling somewhat more dense.");
            this.outputText("  A bit of milky pre dribbles from your " + this.player.multiCockDescriptLight() + ", pushed out by the change.");
            this.changes++;
        }
        if (this.changes < this.changeLimit && this.player.balls > 0 && this.player.ballSize > 4 && rand(3) === 0) {
            this.outputText("\n\nYour [sack] gets lighter and lighter, the skin pulling tight around your shrinking balls until you can't help but check yourself.");
            if (this.player.ballSize > 10) this.player.ballSize -= 5;
            if (this.player.ballSize > 20) this.player.ballSize -= 4;
            if (this.player.ballSize > 30) this.player.ballSize -= 4;
            if (this.player.ballSize > 40) this.player.ballSize -= 4;
            if (this.player.ballSize > 50) this.player.ballSize -= 8;
            if (this.player.ballSize > 60) this.player.ballSize -= 8;
            if (this.player.ballSize <= 10) this.player.ballSize--;
            this.changes++;
            this.outputText("  You now have a [balls].");
        }
        // Sprouting more!
        if (this.changes < this.changeLimit && this.enhanced && this.player.bRows() < 4 && this.player.breastRows[this.player.bRows() - 1].breastRating > 1) {
            this.outputText("\n\nYour belly rumbles unpleasantly for a second as the ");
            if (!this.enhanced) this.outputText("berry ");
            else this.outputText("drink ");
            this.outputText("settles deeper inside you.  A second later, the unpleasant gut-gurgle passes, and you let out a tiny burp of relief.  Before you finish taking a few breaths, there's an itching below your " + this.player.allChestDesc() + ".  You idly scratch at it, but gods be damned, it hurts!  You peel off part of your " + this.player.armorName + " to inspect the unwholesome itch, ");
            if (this.player.biggestTitSize() >= 8) this.outputText("it's difficult to see past the wall of tits obscuring your view.");
            else this.outputText("it's hard to get a good look at.");
            this.outputText("  A few gentle prods draw a pleasant gasp from your lips, and you realize that you didn't have an itch - you were growing new nipples!");
            this.outputText("\n\nA closer examination reveals your new nipples to be just like the ones above in size and shape");
            if (this.player.breastRows[this.player.bRows() - 1].nipplesPerBreast > 1) this.outputText(", not to mention number");
            else if (this.player.hasFuckableNipples()) this.outputText(", not to mention penetrability");
            this.outputText(".  While you continue to explore your body's newest addition, a strange heat builds behind the new nubs. Soft, jiggly breastflesh begins to fill your cupped hands.  Radiant warmth spreads through you, eliciting a moan of pleasure from your lips as your new breasts catch up to the pair above.  They stop at " + this.player.breastCup(this.player.bRows() - 1) + "s.  <b>You have " + FoxBerry.num2Text(this.player.bRows() + 1) + " rows of breasts!</b>");
            this.player.createBreastRow();
            this.player.breastRows[this.player.bRows() - 1].breastRating = this.player.breastRows[this.player.bRows() - 2].breastRating;
            this.player.breastRows[this.player.bRows() - 1].nipplesPerBreast = this.player.breastRows[this.player.bRows() - 2].nipplesPerBreast;
            if (this.player.hasFuckableNipples()) this.player.breastRows[this.player.bRows() - 1].fuckable = true;
            this.player.breastRows[this.player.bRows() - 1].lactationMultiplier = this.player.breastRows[this.player.bRows() - 2].lactationMultiplier;
            this.dynStats("sen", 2, "lus", 30);
            this.changes++;
        }
        // Find out if tits are eligible for evening
        let tits: boolean = false;
        counter = this.player.bRows();
        while (counter > 1) {
            counter--;
            // If the row above is 1 size above, can be grown!
            if (this.player.breastRows[counter].breastRating <= (this.player.breastRows[counter - 1].breastRating - 1) && this.changes < this.changeLimit && rand(2) === 0) {
                if (tits) this.outputText("\n\nThey aren't the only pair to go through a change!  Another row of growing bosom goes through the process with its sisters, getting larger.");
                else {
                    const select2: number = rand(3);
                    if (select2 == 1) this.outputText("\n\nA faint warmth buzzes to the surface of your " + this.player.breastDescript(counter) + ", the fluttering tingles seeming to vibrate faster and faster just underneath your [skin].  Soon, the heat becomes uncomfortable, and that row of chest-flesh begins to feel tight, almost thrumming like a newly-stretched drum.  You " + this.player.nippleDescript(counter) + "s go rock hard, and though the discomforting feeling of being stretched fades, the pleasant, warm buzz remains.  It isn't until you cup your tingly tits that you realize they've grown larger, almost in envy of the pair above.");
                    else if (select2 == 2) this.outputText("\n\nA faintly muffled gurgle emanates from your " + this.player.breastDescript(counter) + " for a split-second, just before your flesh shudders and shakes, stretching your " + this.player.skinFurScales() + " outward with newly grown breast.  Idly, you cup your hands to your swelling bosom, and though it stops soon, you realize that your breasts have grown closer in size to the pair above.");
                    else {
                        this.outputText("\n\nAn uncomfortable stretching sensation spreads its way across the curves of your " + this.player.breastDescript(counter) + ", threads of heat tingling through your flesh.  It feels as though your heartbeat has been magnified tenfold within the expanding mounds, your [skin] growing flushed with arousal and your " + this.player.nippleDescript(counter) + " filling with warmth.  As the tingling heat gradually fades, a few more inches worth of jiggling breast spill forth.  Cupping them experimentally, you confirm that they have indeed grown to be a bit more in line with the size of the pair above.");
                    }
                }
                // Bigger change!
                if (this.player.breastRows[counter].breastRating <= (this.player.breastRows[counter - 1].breastRating - 3))
                    this.player.breastRows[counter].breastRating += 2 + rand(2);
                // Smallish change.
                else this.player.breastRows[counter].breastRating++;
                this.outputText("  You do a quick measurement and determine that your " + FoxBerry.num2Text2(counter + 1) + " row of breasts are now " + this.player.breastCup(counter) + "s.");

                if (!tits) {
                    tits = true;
                    this.changes++;
                }
                this.dynStats("sen", 2, "lus", 10);
            }
        }
        // HEAT!
        if (this.player.statusEffectv2(StatusEffects.Heat) < 30 && rand(6) === 0 && this.changes < this.changeLimit) {
            if (this.player.goIntoHeat(true)) {
                this.changes++;
            }
        }
        // Neck restore
        if (this.player.neck.type !== Neck.NORMAL && this.changes < this.changeLimit && rand(4) === 0) this.mutations.restoreNeck(tfSource);
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && rand(5) === 0) this.mutations.restoreRearBody(tfSource);
        // Ovi perk loss
        if (rand(5) === 0) this.mutations.updateOvipositionPerk(tfSource);
        // [Grow Fur]
        // FOURTH
        if ((this.enhanced || this.player.lowerBody.type == LowerBody.FOX) && !this.player.hasFur() && this.changes < this.changeLimit && rand(4) === 0) {
            let colorChoices: any[] = ["invalid color"]; // Failsafe ... should hopefully not happen (Stadler76)
            // from scales
            if (this.player.hasScales()) this.outputText("\n\nYour skin shifts and every scale stands on end, sending you into a mild panic.  No matter how you tense, you can't seem to flatten them again.  The uncomfortable sensation continues for some minutes until, as one, every scale falls from your body and a fine coat of fur pushes out.  You briefly consider collecting them, but when you pick one up, it's already as dry and brittle as if it were hundreds of years old.  <b>Oh well; at least you won't need to sun yourself as much with your new fur.</b>");
            // from skin
            else this.outputText("\n\nYour skin itches all over, the sudden intensity and uniformity making you too paranoid to scratch.  As you hold still through an agony of tiny tingles and pinches, fine, luxuriant fur sprouts from every bare inch of your skin!  <b>You'll have to get used to being furry...</b>");
            this.player.skin.type = Skin.FUR;
            this.player.skin.adj = "";
            this.player.skin.desc = "fur";
            if (this.player.kitsuneScore() >= 4)
                if (FoxBerry.InCollection(this.player.hair.color, FoxBerry.convertMixedToStringArray(ColorLists.BASIC_KITSUNE_FUR)) || FoxBerry.InCollection(this.player.hair.color, ColorLists.ELDER_KITSUNE))
                    colorChoices = [this.player.hair.color];
                else
                    if (this.player.tail.type == Tail.FOX && this.player.tail.venom == 9)
                        colorChoices = ColorLists.ELDER_KITSUNE;
                    else
                        colorChoices = ColorLists.BASIC_KITSUNE_FUR;
            else
                colorChoices = ColorLists.FOX_FUR;
            this.player.setFurColor(colorChoices, { type: UnderBody.FURRY }, true);
            this.changes++;
        }
        // [Grow Fox Legs]
        // THIRD
        if ((this.enhanced || this.player.ears.type == Ears.FOX) && this.player.lowerBody.type !== LowerBody.FOX && this.changes < this.changeLimit && rand(5) === 0) {
            // 4 legs good, 2 legs better
            if (this.player.isTaur()) this.outputText("\n\nYou shiver as the strength drains from your back legs.  Shaken, you sit on your haunches, forelegs braced wide to stop you from tipping over;  their hooves scrape the dirt as your lower body shrinks, dragging them backward until you can feel the upper surfaces of your hindlegs with their undersides.  A wave of nausea and vertigo overtakes you, and you close your eyes to shut out the sensations.  When they reopen, what greets them are not four legs, but only two... and those roughly in the shape of your old hindleg, except for the furry toes where your hooves used to be.  <b>You now have fox legs!</b>");
            // n*ga please
            else if (this.player.isNaga()) this.outputText("\n\nYour scales split at the waistline and begin to peel, shedding like old snakeskin.  If that weren't curious enough, the flesh - not scales - underneath is pink and new, and the legs it covers crooked into the hocks and elongated feet of a field animal.  As the scaly coating falls and you step out of it, walking of necessity on your toes, a fine powder blows from the dry skin.  Within minutes, it crumbles completely and is taken by the ever-moving wind.  <b>Your legs are now those of a fox!</b>");
            // other digitigrade
            else if (this.player.lowerBody.type == LowerBody.HOOFED || this.player.lowerBody.type == LowerBody.DOG || this.player.lowerBody.type == LowerBody.CAT || this.player.lowerBody.type == LowerBody.BUNNY || this.player.lowerBody.type == LowerBody.KANGAROO)
                this.outputText("\n\nYour legs twitch and quiver, forcing you to your seat.  As you watch, the ends shape themselves into furry, padded toes.  <b>You now have fox feet!</b>  Rather cute ones, actually.");
            // red drider bb gone
            else if (this.player.lowerBody.type == LowerBody.DRIDER) this.outputText("\n\nYour legs buckle under you and you fall, smashing your abdomen on the ground.  Though your control deserts and you cannot see behind you, still you feel the disgusting sensation of chitin loosening and sloughing off your body, and the dry breeze on your exposed nerves.  Reflexively, your legs cling together to protect as much of their now-sensitive surface as possible.  When you try to part them, you find you cannot.  Several minutes pass uncomfortably until you can again bend your legs, and when you do, you find that all the legs of a side bend together - <b>in the shape of a fox's leg!</b>");
            // goo home and goo to bed
            else if (this.player.isGoo()) this.outputText("\n\nIt takes a while before you notice that your gooey mounds have something more defined in them.  As you crane your body and shift them around to look, you can just make out a semi-solid mass in the shape of a crooked, animalistic leg.  You don't think much of it until, a few minutes later, you step right out of your swishing gooey undercarriage and onto the new foot.  The goo covering it quickly dries up, as does the part you left behind, <b>revealing a pair of dog-like fox legs!</b>");
            // reg legs, not digitigrade
            else {
                this.outputText("\n\nYour hamstrings tense painfully and begin to pull, sending you onto your face.  As you writhe on the ground, you can feel your thighs shortening and your feet stretching");
                if (this.player.lowerBody.type == LowerBody.BEE) this.outputText(", while a hideous cracking fills the air");
                this.outputText(".  When the spasms subside and you can once again stand, <b>you find that your legs have been changed to those of a fox!</b>");
            }
            this.player.lowerBody.type = LowerBody.FOX;
            this.player.lowerBody.legCount = 2;
            this.changes++;
        }
        // Grow Fox Ears]
        // SECOND
        if ((this.enhanced || this.player.tail.type == Tail.FOX) && this.player.ears.type !== Ears.FOX && this.changes < this.changeLimit && rand(4) === 0) {
            // from human/gob/liz ears
            if (this.player.ears.type == Ears.HUMAN || this.player.ears.type == Ears.ELFIN || this.player.ears.type == Ears.LIZARD) {
                this.outputText("\n\nThe sides of your face painfully stretch as your ears elongate and begin to push past your hairline, toward the top of your head.  They elongate, becoming large vulpine triangles covered in bushy fur.  <b>You now have fox ears.</b>");
            }
            // from dog/cat/roo ears
            else {
                this.outputText("\n\nYour ears change, shifting from their current shape to become vulpine in nature.  <b>You now have fox ears.</b>");
            }
            this.player.ears.type = Ears.FOX;
            this.changes++;
        }
        // [Grow Fox Tail](fairly common)
        // FIRST
        if (this.player.tail.type !== Tail.FOX && this.changes < this.changeLimit && rand(4) === 0) {
            // from no tail
            if (this.player.tail.type == Tail.NONE) this.outputText("\n\nA pressure builds on your backside.  You feel under your [armor] and discover a strange nodule growing there that seems to be getting larger by the second.  With a sudden flourish of movement, it bursts out into a long and bushy tail that sways hypnotically, as if it had a mind of its own.  <b>You now have a fox's tail!</b>");
            // from another type of tail
            else this.outputText("\n\nPain lances through your lower back as your tail shifts violently.  With one final aberrant twitch, it fluffs out into a long, bushy fox tail that whips around in an almost hypnotic fashion.  <b>You now have a fox's tail!</b>");
            this.player.tail.type = Tail.FOX;
            this.player.tail.venom = 1;
            this.changes++;
        }
        // [Grow Fox Face]
        // LAST - muzzlygoodness
        // should work from any face, including other muzzles
        if (this.player.hasFur() && this.player.face.type !== Face.FOX && this.changes < this.changeLimit && rand(5) === 0) {
            this.outputText("\n\nYour face pinches and you clap your hands to it.  Within seconds, your nose is poking through those hands, pushing them slightly to the side as new flesh and bone build and shift behind it, until it stops in a clearly defined, tapered, and familiar point you can see even without the aid of a mirror.  <b>Looks like you now have a fox's face.</b>");
            if (this.game.silly()) this.outputText("  And they called you crazy...");
            this.changes++;
            this.player.face.type = Face.FOX;
        }
        // Arms
        if (this.player.arms.type !== Arms.FOX && this.player.isFurry() && this.player.tail.type === Tail.FOX && this.player.lowerBody.type === LowerBody.FOX && rand(4) === 0 && this.changes < this.changeLimit) {
            this.outputText("\n\nWeakness overcomes your arms, and no matter what you do, you can’t muster the strength to raise or move them."
                + " Did the berry have some drug-like effects? Sitting on the ground, you wait for the limpness to end."
                + " As you do so, you realize that the bones at your hands are changing, as well as the muscles on your arms."
                + " They’re soon covered, from the shoulders to the tip of your digits, on a layer of soft,"
                + " fluffy [if (hasFurryUnderBody)[underBody.furColor]|[furColor]] fur. Your hands gain pink,"
                + " padded paws where your palms were once, and your nails become short claws, not sharp enough to tear flesh,"
                + " but nimble enough to make climbing and exploring easier."
                + " <b>Your arms have become like those of a fox!</b>");
            this.player.arms.setType(Arms.FOX);
            this.changes++;
        }
        if (this.player.tone > 40 && this.changes < this.changeLimit && rand(2) === 0) {
            this.outputText("\n\nMoving brings with it a little more jiggle than you're used to.  You don't seem to have gained weight, but your muscles seem less visible, and various parts of you are pleasantly softer.");
            this.player.tone -= 4;
        }
        if (this.changes == 0) {
            this.outputText("\n\nWell that didn't do much, but you do feel a little refreshed!");
            this.player.changeFatigue(-5);
        }
        this.player.refillHunger(15);
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;

        return false;
    }
}
