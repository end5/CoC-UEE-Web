import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";
import { StatusEffects } from "../../StatusEffects";
import { Neck } from "../../BodyParts/Neck";
import { Tail } from "../../BodyParts/Tail";
import { Ears } from "../../BodyParts/Ears";
import { PerkLib } from "../../PerkLib";
import { ColorLists } from "../../lists/ColorLists";
import { UnderBody } from "../../BodyParts/UnderBody";
import { Face } from "../../BodyParts/Face";
import { Skin } from "../../BodyParts/Skin";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

/**
 * @since March 31, 2018
 * @author Stadler76
 */
export class FoxJewel extends Consumable {
    public static STANDARD: number = 0;
    public static MYSTIC: number = 1;

    private mystic: boolean;

    public constructor(type: number) {
        let id: string;
        let shortName: string;
        let longName: string;
        let description: string;
        let value: number;

        switch (type) {
            case FoxJewel.STANDARD:
                id = "FoxJewl";
                shortName = "Fox Jewel";
                longName = "a fox jewel";
                description = "A shining teardrop-shaped jewel.  An eerie blue flame dances beneath the surface.";
                value = ConsumableLib.DEFAULT_VALUE;
                break;

            case FoxJewel.MYSTIC:
                id = "MystJwl";
                shortName = "MystJwl";
                longName = "a mystic jewel";
                description = "The flames within this jewel glow brighter than before, and have taken on a sinister purple hue."
                    + " It has been enhanced to increase its potency, allowing it to transform you more easily,"
                    + " but may have odd side-effects...";
                value = 20;
                break;

            default: // Remove this if someone manages to get SonarQQbe to not whine about a missing default ... ~Stadler76
                throw new Error("FoxJewel. Incorrect or no type was passed to constructor");
        }

        super(id, shortName, longName, value, description);
        this.mystic = type === FoxJewel.MYSTIC;
    }

    public useItem(): boolean {
        let tfSource: string = "foxJewel";
        if (this.mystic) tfSource += "-mystic";
        this.mutations.initTransformation([2, 2, 3], this.mystic ? 3 : 1);
        this.clearOutput();
        if (this.mystic) this.outputText("You examine the jewel for a bit, rolling it around in your hand as you ponder its mysteries.  You hold it up to the light with fascinated curiosity, watching the eerie purple flame dancing within.  Without warning, the gem splits down the center, dissolving into nothing in your hand.  As the pale lavender flames swirl around you, the air is filled with a sickly sweet scent that drips with the bitter aroma of licorice, filling you with a dire warmth.");
        else this.outputText("You examine the jewel for a bit, rolling it around in your hand as you ponder its mysteries.  You hold it up to the light with fascinated curiosity, watching the eerie blue flame dancing within.  Without warning, the gem splits down the center, dissolving into nothing in your hand.  As the pale azure flames swirl around you, the air is filled with a sweet scent that drips with the aroma of wintergreen, sending chills down your spine.");

        // **********************
        // BASIC STATS
        // **********************
        // [increase Intelligence, Libido and Sensitivity]
        if (this.player.inte100 < 100 && this.changes < this.changeLimit && ((this.mystic && rand(2) === 0) || (!this.mystic && rand(4) === 0))) {
            this.outputText("\n\nYou close your eyes, smirking to yourself mischievously as you suddenly think of several new tricks to try on your opponents; you feel quite a bit more cunning.  The mental image of them helpless before your cleverness makes you shudder a bit, and you lick your lips and stroke yourself as you feel your skin tingling from an involuntary arousal.");
            // Raise INT, Lib, Sens. and +10 LUST
            this.dynStats("int", 2, "lib", 1, "sen", 2, "lus", 10);
        }
        // [decrease Strength toward 15]
        if (this.player.str100 > 15 && this.changes < this.changeLimit && ((this.mystic && rand(2) === 0) || (!this.mystic && rand(3) === 0))) {
            this.outputText("\n\nYou can feel your muscles softening as they slowly relax, becoming a tad weaker than before.  Who needs physical strength when you can outwit your foes with trickery and mischief?  You tilt your head a bit, wondering where that thought came from.");
            this.dynStats("str", -1);
            if (this.player.str100 > 70) this.dynStats("str", -1);
            if (this.player.str100 > 50) this.dynStats("str", -1);
            if (this.player.str100 > 30) this.dynStats("str", -1);
        }
        // [decrease Toughness toward 20]
        if (this.player.tou100 > 20 && this.changes < this.changeLimit && ((this.mystic && rand(2) === 0) || (!this.mystic && rand(3) === 0))) {
            // from 66 or less toughness
            if (this.player.tou100 <= 66) this.outputText("\n\nYou feel your " + this.player.skinFurScales() + " becoming noticeably softer.  A gentle exploratory pinch on your arm confirms it - your " + this.player.skinFurScales() + " won't offer you much protection.");
            // from 66 or greater toughness
            else this.outputText("\n\nYou feel your " + this.player.skinFurScales() + " becoming noticeably softer.  A gentle exploratory pinch on your arm confirms it - your hide isn't quite as tough as it used to be.");
            this.dynStats("tou", -1);
            if (this.player.tou100 > 66) this.dynStats("tou", -1);
        }
        if (this.mystic && this.changes < this.changeLimit && rand(2) === 0 && this.player.cor < 100) {
            if (this.player.cor < 33) this.outputText("\n\nA sense of dirtiness comes over you, like the magic of this gem is doing some perverse impropriety to you.");
            else if (this.player.cor < 66) this.outputText("\n\nA tingling wave of sensation rolls through you, but you have no idea what exactly just changed.  It must not have been that important.");
            else this.outputText("\n\nThoughts of mischief roll across your consciousness, unbounded by your conscience or any concern for others.  You should really have some fun - who cares who it hurts, right?");
            this.dynStats("cor", 1);
        }

        // **********************
        // MEDIUM/SEXUAL CHANGES
        // **********************
        // [adjust Femininity toward 50]
        // from low to high
        // Your facial features soften as your body becomes more androgynous.
        // from high to low
        // Your facial features harden as your body becomes more androgynous.
        if (((this.mystic && rand(2) === 0) || (!this.mystic && rand(4) === 0)) && this.changes < this.changeLimit && this.player.femininity !== 50) {
            this.outputText(this.player.modFem(50, 2));
            this.changes++;
        }
        // [decrease muscle tone toward 40]
        if (this.player.tone >= 40 && this.changes < this.changeLimit && ((this.mystic && rand(2) === 0) || (!this.mystic && rand(4) === 0))) {
            this.outputText("\n\nMoving brings with it a little more jiggle than you're used to.  You don't seem to have gained weight, but your muscles seem less visible, and various parts of you are pleasantly softer.");
            this.player.tone -= 2 + rand(3);
            this.changes++;
        }

        // [Adjust hips toward 10 – wide/curvy/flared]
        // from narrow to wide
        if (this.player.hips.rating < 10 && ((this.mystic && rand(2) === 0) || (!this.mystic && rand(3) === 0)) && this.changes < this.changeLimit) {
            this.player.hips.rating++;
            if (this.player.hips.rating < 7) this.player.hips.rating++;
            if (this.player.hips.rating < 4) this.player.hips.rating++;
            this.outputText("\n\nYou stumble a bit as the bones in your pelvis rearrange themselves painfully.  Your hips have widened nicely!");
            this.changes++;
        }
        // from wide to narrower
        if (this.player.hips.rating > 10 && ((this.mystic && rand(2) === 0) || (!this.mystic && rand(3) === 0)) && this.changes < this.changeLimit) {
            this.player.hips.rating--;
            if (this.player.hips.rating > 14) this.player.hips.rating--;
            if (this.player.hips.rating > 19) this.player.hips.rating--;
            if (this.player.hips.rating > 24) this.player.hips.rating--;
            this.outputText("\n\nYou stumble a bit as the bones in your pelvis rearrange themselves painfully.  Your hips have narrowed.");
            this.changes++;
        }

        // [Adjust hair length toward range of 16-26 – very long to ass-length]
        if ((this.player.hair.length < 16 || this.player.hair.length > 26) && ((this.mystic && rand(2) === 0) || (!this.mystic && rand(3) === 0)) && this.changes < this.changeLimit) {
            // from short to long
            if (this.player.hair.length < 16) {
                this.player.hair.length += 3 + rand(3);
                this.outputText("\n\nYou experience a tingling sensation in your scalp.  Feeling a bit off-balance, you discover your hair has lengthened, becoming " + this.player.hairDescript() + ".");
            }
            // from long to short
            else {
                this.player.hair.length -= 3 + rand(3);
                this.outputText("\n\nYou experience a tingling sensation in your scalp.  Feeling a bit off-balance, you discover your hair has shed a bit of its length, becoming " + this.player.hairDescript() + ".");
            }
            this.changes++;
        }
        // [Increase Vaginal Capacity] - requires vagina, of course
        if (this.player.hasVagina() && ((this.mystic && rand(2) === 0) || (!this.mystic && rand(3) === 0)) && this.player.statusEffectv1(StatusEffects.BonusVCapacity) < 200 && this.changes < this.changeLimit) {
            this.outputText("\n\nA gurgling sound issues from your abdomen, and you double over as a trembling ripple passes through your womb.  The flesh of your stomach roils as your internal organs begin to shift, and when the sensation finally passes, you are instinctively aware that your " + this.player.vaginaDescript(0) + " is a bit deeper than it was before.");
            if (!this.player.hasStatusEffect(StatusEffects.BonusVCapacity)) {
                this.player.createStatusEffect(StatusEffects.BonusVCapacity, 0, 0, 0, 0);
            }
            this.player.addStatusValue(StatusEffects.BonusVCapacity, 1, 10 + rand(10));
            this.changes++;
        }
        else if (((this.mystic && rand(2) === 0) || (!this.mystic && rand(3) === 0)) && this.player.statusEffectv1(StatusEffects.BonusACapacity) < 150 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou feel... more accommodating somehow.  Your " + this.player.assholeDescript() + " is tingling a bit, and though it doesn't seem to have loosened, it has grown more elastic.");
            if (!this.player.hasStatusEffect(StatusEffects.BonusACapacity)) {
                this.player.createStatusEffect(StatusEffects.BonusACapacity, 0, 0, 0, 0);
            }
            this.player.addStatusValue(StatusEffects.BonusACapacity, 1, 10 + rand(10));
            this.changes++;
        }
        // [Vag of Holding] - rare effect, only if PC has high vaginal looseness
        else if (this.player.hasVagina() && ((this.mystic) || (!this.mystic && rand(5) === 0)) && this.player.statusEffectv1(StatusEffects.BonusVCapacity) >= 200 && this.player.statusEffectv1(StatusEffects.BonusVCapacity) < 8000 && this.changes < this.changeLimit) {
            this.outputText("\n\nYou clutch your stomach with both hands, dropping to the ground in pain as your internal organs begin to twist and shift violently inside you.  As you clench your eyes shut in agony, you are overcome with a sudden calm.  The pain in your abdomen subsides, and you feel at one with the unfathomable infinity of the universe, warmth radiating through you from the vast swirling cosmos contained within your womb.");
            if (this.game.silly()) this.outputText("  <b>Your vagina has become a universe unto itself, capable of accepting colossal insertions beyond the scope of human comprehension!</b>");
            else this.outputText("  <b>Your vagina is now capable of accepting even the most ludicrously sized insertions with no ill effects.</b>");
            this.player.changeStatusValue(StatusEffects.BonusVCapacity, 1, 8000);
            this.changes++;
        }

        // **********************
        // BIG APPEARANCE CHANGES
        // **********************
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
        // [Grow Fox Tail]
        if (this.player.tail.type !== Tail.FOX && this.changes < this.changeLimit && ((this.mystic && rand(2) === 0) || (!this.mystic && rand(4) === 0))) {
            // if PC has no tail
            if (this.player.tail.type == Tail.NONE) {
                this.outputText("\n\nA pressure builds on your backside.  You feel under your " + this.player.armorName + " and discover a strange nodule growing there that seems to be getting larger by the second.  With a sudden flourish of movement, it bursts out into a long and bushy tail that sways hypnotically, as if it has a mind of its own.  <b>You now have a fox-tail.</b>");
            }
            // if PC has another type of tail
            else if (this.player.tail.type !== Tail.FOX) {
                this.outputText("\n\nPain lances through your lower back as your tail shifts and twitches violently.  With one final aberrant twitch, it fluffs out into a long, bushy fox tail that whips around in an almost hypnotic fashion.  <b>You now have a fox-tail.</b>");
            }
            this.player.tail.type = Tail.FOX;
            this.player.tail.venom = 1;
            this.changes++;
        }
        if (!this.mystic && this.player.ears.type == Ears.FOX && this.player.tail.type == Tail.FOX && this.player.tail.venom == 8 && rand(3) === 0) {
            this.outputText("\n\nYou have the feeling that if you could grow a ninth tail you would be much more powerful, but you would need to find a way to enhance one of these gems or meditate with one to have a chance at unlocking your full potential.");
        }
        // [Grow Addtl. Fox Tail]
        // (rare effect, up to max of 8 tails, requires PC level and int*10 = number of tail to be added)
        else if (this.player.tail.type == Tail.FOX && this.player.tail.venom < 8 && this.player.tail.venom + 1 <= this.player.level && this.player.tail.venom + 1 <= this.player.inte / 10 && this.changes < this.changeLimit && ((this.mystic && rand(2) === 0) || (!this.mystic && rand(3) === 0))) {
            // if PC has 1 fox tail
            if (this.player.tail.venom == 1) {
                this.outputText("\n\nA tingling pressure builds on your backside, and your bushy tail begins to glow with an eerie, ghostly light.  With a crackle of electrical energy, your tail splits into two!  <b>You now have a pair of fox-tails.</b>");
                // increment tail by 1
            }
            // else if PC has 2 or more fox tails
            else {
                this.outputText("\n\nA tingling pressure builds on your backside, and your bushy tails begin to glow with an eerie, ghostly light.  With a crackle of electrical energy, one of your tails splits in two, giving you " + FoxJewel.num2Text(this.player.tail.venom + 1) + "!  <b>You now have a cluster of " + FoxJewel.num2Text(this.player.tail.venom + 1) + " fox-tails.</b>");
                // increment tail by 1
            }
            this.player.tail.venom++;
            this.changes++;
        }
        // [Grow 9th tail and gain Corrupted Nine-tails perk]
        else if (this.mystic && rand(4) === 0 && this.changes < this.changeLimit && this.player.tail.type == Tail.FOX && this.player.tail.venom == 8 && this.player.level >= 9 && this.player.ears.type == Ears.FOX && this.player.inte >= 90) {
            this.outputText("Your bushy tails begin to glow with an eerie, ghostly light, and with a crackle of electrical energy, split into nine tails. <b>You are now a nine-tails!</b>");
            if (!this.player.hasPerk(PerkLib.CorruptedNinetails) && (!this.player.hasPerk(PerkLib.EnlightenedNinetails) || this.player.perkv4(PerkLib.EnlightenedNinetails) > 0)) {
                this.outputText("<b>  But something is wrong... The cosmic power radiating from your body feels... tainted somehow."
                    + " The corruption pouring off your body feels... good.</b>"
                    + "\n\nYou have the inexplicable urge to set fire to the world, just to watch it burn."
                    + " With your newfound power, it's a goal that is well within reach."
                    + "\n\n(Perk Gained: Corrupted Nine-tails - Grants two magical special attacks.)");
                this.player.createPerk(PerkLib.CorruptedNinetails);
            }
            this.dynStats("lib", 2, "lus", 10, "cor", 10);
            this.player.tail.venom = 9;
            this.changes++;
        }

        // [Grow Fox Ears]
        if (this.player.tail.type == Tail.FOX && ((this.mystic && rand(2) === 0) || (!this.mystic && rand(4) === 0)) && this.player.ears.type !== Ears.FOX && this.changes < this.changeLimit) {
            // if PC has non-animal ears
            if (this.player.ears.type == Ears.HUMAN) this.outputText("\n\nThe sides of your face painfully stretch as your ears morph and begin to migrate up past your hairline, toward the top of your head.  They elongate, becoming large vulpine triangles covered in bushy fur.  You now have fox ears.");
            // if PC has animal ears
            else this.outputText("\n\nYour ears change shape, shifting from their current shape to become vulpine in nature.  You now have fox ears.");
            this.player.ears.type = Ears.FOX;
            this.changes++;
        }
        // [Change Hair Color: Golden-blonde, SIlver Blonde, White, Black, Red]
        if (((this.mystic && rand(2) === 0) || (!this.mystic && rand(4) === 0)) && this.changes < this.changeLimit && !FoxJewel.InCollection(this.player.hair.color, ColorLists.BASIC_KITSUNE_HAIR) && !FoxJewel.InCollection(this.player.hair.color, ColorLists.ELDER_KITSUNE)) {
            if (this.player.tail.type == Tail.FOX && this.player.tail.venom == 9) this.player.hair.color = FoxJewel.randomChoice(ColorLists.ELDER_KITSUNE);
            else this.player.hair.color = FoxJewel.randomChoice(ColorLists.BASIC_KITSUNE_HAIR);
            this.outputText("\n\nYour scalp begins to tingle, and you gently grasp a strand, pulling it forward to check it.  Your hair has become the same " + this.player.hair.color + " as a kitsune's!");
            this.changes++;
        }
        const tone = this.mystic ? ColorLists.KITSUNE_SKIN_MYSTIC : ColorLists.KITSUNE_SKIN;
        // [Change Skin Type: remove fur or scales, change skin to Tan, Olive, or Light]
        let theFurColor: string = this.player.skin.furColor;
        if (this.player.hasFur() && this.player.underBody.type == UnderBody.FURRY && this.player.skin.furColor !== this.player.underBody.skin.furColor)
            theFurColor = this.player.skin.furColor + " and " + this.player.underBody.skin.furColor;

        if ((this.player.hasFur()
            && this.player.face.type != Face.FOX
            && !FoxJewel.InCollection(theFurColor, FoxJewel.convertMixedToStringArray(ColorLists.BASIC_KITSUNE_FUR))
            && !FoxJewel.InCollection(theFurColor, ColorLists.ELDER_KITSUNE)
            && !FoxJewel.InCollection(theFurColor, ["orange and white", "black and white", "red and white", "tan", "brown"])
        )
            || this.player.hasScales() && ((this.mystic) || (!this.mystic && rand(2) === 0))) {
            this.outputText("\n\nYou begin to tingle all over your [skin], starting as a cool, pleasant sensation but gradually worsening until you are furiously itching all over.");
            if (this.player.hasFur()) this.outputText("  You stare in horror as you pull your fingers away holding a handful of " + this.player.skin.furColor + " fur!  Your fur sloughs off your body in thick clumps, falling away to reveal patches of bare, " + this.player.skin.tone + " skin.");
            else if (this.player.hasScales()) this.outputText("  You stare in horror as you pull your fingers away holding a handful of dried up scales!  Your scales continue to flake and peel off your skin in thick patches, revealing the tender " + this.player.skin.tone + " skin underneath.");
            this.outputText("  Your skin slowly turns raw and red under your severe scratching, the tingling sensations raising goosebumps across your whole body.  Over time, the itching fades, and your flushed skin resolves into a natural-looking ");
            this.player.skin.type = Skin.PLAIN;
            this.player.skin.adj = "";
            this.player.skin.desc = "skin";
            this.player.underBody.restore();
            if (!FoxJewel.InCollection(this.player.skin.tone, tone)) this.player.skin.tone = FoxJewel.randomChoice(tone);
            this.outputText(this.player.skin.tone + " complexion.");
            this.outputText("  <b>You now have [skin]!</b>");
            this.player.arms.updateClaws(this.player.arms.claws.type);
            this.changes++;
        }
        // Change skin tone if not changed you!
        else if (!FoxJewel.InCollection(this.player.skin.tone, tone) && this.changes < this.changeLimit && ((this.mystic && rand(2) === 0) || (!this.mystic && rand(3) === 0))) {
            this.outputText("\n\nYou feel a crawling sensation on the surface of your skin, starting at the small of your back and spreading to your extremities, ultimately reaching your face.  Holding an arm up to your face, you discover that <b>you now have ");
            this.player.skin.tone = FoxJewel.randomChoice(tone);
            this.outputText("[skin]!</b>");
            this.player.arms.updateClaws(this.player.arms.claws.type);
            this.changes++;
        }
        // [Change Skin Color: add "Tattoos"]
        // From Tan, Olive, or Light skin tones
        else if (false && FoxJewel.InCollection(this.player.skin.tone, tone) && this.changes < this.changeLimit) {
            this.outputText("You feel a crawling sensation on the surface of your skin, starting at the small of your back and spreading to your extremities, ultimately reaching your face.  You are caught by surprise when you are suddenly assaulted by a blinding flash issuing from areas of your skin, and when the spots finally clear from your vision, an assortment of glowing tribal tattoos adorns your [skin].  The glow gradually fades, but the distinctive ");
            if (this.mystic) this.outputText("angular");
            else this.outputText("curved");
            this.outputText(" markings remain, as if etched into your skin.");
            this.changes++;
            // 9999 - pending tats system
        }
        // Nipples Turn Back:
        if (!this.player.hasFur() && this.player.hasStatusEffect(StatusEffects.BlackNipples) && this.changes < this.changeLimit && rand(3) === 0) {
            this.mutations.removeBlackNipples(tfSource);
        }
        // Debugcunt
        if (!this.player.hasFur() && this.changes < this.changeLimit && rand(3) === 0 && this.player.vaginaType() == 5 && this.player.hasVagina()) {
            this.outputText("\n\nSomething invisible brushes against your sex, making you twinge.  Undoing your clothes, you take a look at your vagina and find that it has turned back to its natural flesh colour.");
            this.player.vaginaType(0);
            this.changes++;
        }
        // Kitsunes should have normal arms and legs. exspecially skinny arms with claws are somewhat weird (Stadler76).
        if (this.player.hasPlainSkin() && rand(4) === 0) this.mutations.restoreArms(tfSource);
        if (this.player.hasPlainSkin() && rand(4) === 0) this.mutations.restoreLegs(tfSource);

        if (this.changes == 0) {
            this.outputText("\n\nOdd.  You don't feel any different.");
        }
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;

        return false;
    }
}
