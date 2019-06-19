import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { Face } from "../../BodyParts/Face";
import { Tail } from "../../BodyParts/Tail";
import { LowerBody } from "../../BodyParts/LowerBody";
import { StatusEffects } from "../../StatusEffects";
import { rand } from "../../Extra";
import { PerkLib } from "../../PerkLib";
import { CockTypesEnum } from "../../CockTypesEnum";
import { Neck } from "../../BodyParts/Neck";
import { Appearance } from "../../Appearance";
import { CoC_Settings } from "../../CoC_Settings";
import { Vagina } from "../../Vagina";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { Eyes } from "../../BodyParts/Eyes";
import { Ears } from "../../BodyParts/Ears";
import { ColorLists } from "../../lists/ColorLists";
import { Skin } from "../../BodyParts/Skin";

/**
 * Equine transformative item.
 */
export class Equinum extends Consumable {
    public constructor() {
        super("Equinum", "Equinum", "a vial of Equinum", ConsumableLib.DEFAULT_VALUE, "This is a long flared vial with a small label that reads, \"<i>Equinum</i>\".  It is likely this potion is tied to horses in some way.");
    }

    public useItem(): boolean {
        const tfSource: string = "equinum";
        this.player.slimeFeed();
        // Temporary storage
        let temp: number = 0;
        let temp2: number = 0;
        let temp3: number = 0;
        this.mutations.initTransformation([2, 3]);

        // Set up output
        this.clearOutput();
        this.outputText("You down the potion, grimacing at the strong taste.");
        // CHANCE OF BAD END - 20% if face/tail/skin/cock are appropriate.
        if (this.player.hasFur() && this.player.face.type === Face.HORSE && this.player.tail.type === Tail.HORSE && this.player.lowerBody.type === LowerBody.HOOFED) {
            // WARNINGS
            // Repeat warnings
            if (this.player.hasStatusEffect(StatusEffects.HorseWarning) && rand(3) === 0) {
                if (this.player.statusEffectv1(StatusEffects.HorseWarning) === 0) this.outputText("<b>\n\nYou feel a creeping chill down your back as your entire body shivers, as if rejecting something foreign.  Maybe you ought to cut back on the horse potions.</b>");
                if (this.player.statusEffectv1(StatusEffects.HorseWarning) > 0) this.outputText("<b>\n\nYou wonder how many more of these you can drink before you become a horse...</b>");
                this.player.addStatusValue(StatusEffects.HorseWarning, 1, 1);
            }
            // First warning
            if (!this.player.hasStatusEffect(StatusEffects.HorseWarning)) {
                this.outputText("<b>\n\nWhile you drink the tasty potion, you realize how horse-like you already are, and wonder what else the potion could possibly change...</b>");
                this.player.createStatusEffect(StatusEffects.HorseWarning, 0, 0, 0, 0);
            }
            // Bad End
            if (rand(4) === 0 && this.player.hasStatusEffect(StatusEffects.HorseWarning) && this.player.findPerk(PerkLib.TransformationResistance) < 0) {
                // Must have been warned first...
                if (this.player.statusEffectv1(StatusEffects.HorseWarning) > 0) {
                    // If player has dicks check for horsedicks
                    if (this.player.cockTotal() > 0) {
                        // If player has horsedicks
                        if (this.player.countCocksOfType(CockTypesEnum.HORSE) > 0) {
                            this.outputText("\n\nSoon after you drink the Equinum, a burning sensation fills your chest. You have consumed too much of the potion, and the overdose starts to provoke dramatic changes in your body.  You collapse suddenly, twitching in pain as all the bones and muscles in your body break and reform. Eventually, you pass out from the strain you are put through.\n\nYou wake up after a few minutes. Once you get up on your legs, doubt fills your mind. You rush to a nearby pond and look down, nearly jumping when the reflection of a ");
                            if (this.player.gender === 0 || this.player.gender === 3) this.outputText("horse ");
                            if (this.player.gender === 1) this.outputText("stallion ");
                            if (this.player.gender === 2) this.outputText("mare ");
                            this.outputText(" with beautiful " + this.player.hair.color + " " + this.player.skin.desc + " covering its body gazes back up at you.  That's you, and yet the doubt in your mind remains. Strange images fill your mind, and you feel as if you have not always been a horse, but some kind of funny fur-less creature standing on two legs. Your equine mind rapidly dismisses that doubt as a daydream however, and you trot away, oblivious to who you once were.\n\n");
                            this.outputText("<b>One year later...</b>\n\nAs you graze upon the small plants that coat the open plains of your home, you hear a noise on your right side. As you raise your head to check where the noise comes from, preparing to run from a potential predator, you see a strange creature. It stands on its two feet, its furless pink skin appearing beneath its clothes.  With a start, you realize you can identify the strange creatures gender.  ");
                            if (this.player.gender === 0 || this.player.gender === 1) this.outputText("He is clearly a male, but you are somewhat confused as you can see not one but three bulges where his manhood would be.\n\n");
                            if (this.player.gender === 2) this.outputText("She is clearly a female, as you can see her six breasts jiggle as she walks towards you, small stains appearing on her shirt where her nipples are.\n\n");
                            if (this.player.gender === 3) this.outputText("You are somewhat confused as you can see a bulge near her thighs but also huge boobs jiggling as she walks, and you can't say if she's a male or female.\n\n");
                            this.outputText("As soon as you lay eyes on the creature, a wave of nostalgia overtakes you. Somehow, looking at that creature makes you sad, as if you forgot something important.\n\n\"<i>How strange to see a horse here all alone,</i>\" the creature muses, \"<i>In any case, you're still the least bizarre creature I've met here.  Not to mention the only one that hasn't tried to rape me,</i>\" it says with a sigh.\n\nYou answer with an interrogative whinny.\n\n\"<i>Hey, I've got an idea. I'll take you back to the camp. I'll feed you and in return you can help me complete my quest. What do you say?</i>\"\n\nInstinctively, you utter a happy and approving whinny.\n\nYou failed in your quest, losing your focus and more importantly, losing yourself.  But, even so, you found a new meaning to your life, and have a new chance to succeed where you once failed.");
                            this.getGame().gameOver();
                            return false;
                        }
                    }
                    // If player has no cocks
                    else {
                        this.outputText("\n\nSoon after you drink the Equinum, a burning sensation fills your chest. You have consumed too much of the drink, and the overdose starts to provoke dramatic changes in your body.  You collapse suddenly, twitching in pain as all the bones and all the muscles in your body break and reform. Eventually, you pass out from the strain you are put through.\n\nYou wake up after a few minutes. Once you get up on your legs, doubt fills your mind. You rush to a nearby pond and look down, nearly jumping when the reflection of a ");
                        if (this.player.gender === 0 || this.player.gender === 3) this.outputText("horse ");
                        if (this.player.gender === 1) this.outputText("stallion ");
                        if (this.player.gender === 2) this.outputText("mare ");
                        this.outputText("with beautiful " + this.player.hair.color + " " + this.player.skin.desc + " covering its body looks back at you.  That's you, and yet the doubt in your mind remains. Strange mental images fill your mind.  You feel as if you have not always been a horse, but some kind of funny fur-less creature standing on two legs. But your equine mind rapidly dismisses that doubt as a daydream, and you trot away, oblivious to who you once were.\n\n");
                        this.outputText("<b>One year after...</b>\n\nAs you graze small plants in the open plains that became your home, you hear a noise on your right side. As you raise your head to check where the noise comes from, preparing to run from a potential predator, you see a strange creature. It stands on two feet, its furless pink skin appearing beneath its clothes.  ");
                        if (this.player.gender === 0 || this.player.gender === 1) this.outputText("He is clearly a male, but you are somewhat confused as you can see not one but three bulges where his manhood would be.\n\n");
                        if (this.player.gender === 2) this.outputText("She is clearly a female, as you can see her six breasts jiggle as she walks towards you, small stains appearing on her shirt where her nipples are.\n\n");
                        if (this.player.gender === 3) this.outputText("You are somewhat confused as you can see a bulge near her thighs but also huge boobs jiggling as she walks, and you can't say if she's a male or female.\n\n");
                        this.outputText("As soon as you lay eyes on the creature, a wave of nostalgia overtakes you. Somehow, looking at that creature makes you sad, as if you forgot something important.\n\n\"<i>How strange to see a horse here all alone,</i>\" the creature muses, \"<i>In any case, you're still the least bizarre creature I've met here.  Not to mention the only one that hasn't tried to rape me,</i>\" it says with a sigh.\n\nYou answer with an interrogative whinny.\n\n\"<i>Hey, I've got an idea. I'll take you back to the camp. I'll feed you and in return you can help me to complete my quest. What do you say?</i>\"\n\nInstictively, you utter a happy and approving whinny.\n\nYou failed in your quest, losing you focus and more importantly, losing yourself.  But, even so, you found a new meaning to your life, and have a new chance to achieve what you once failed.");
                        this.getGame().gameOver();
                        return false;
                    }
                }
            }

        }
        // Stat changes first
        // STRENGTH
        if (rand(2) === 0) {
            // Maxxed
            if (this.player.str100 >= 60) {
                this.outputText("\n\nYou feel strong enough to single-handedly pull a fully-loaded wagon.");
            }
            // NOT MAXXED
            else {
                this.dynStats("str", 1);
                this.outputText("\n\nYour muscles clench and surge, making you feel as strong as a horse.");
            }
        }
        // TOUGHNESS
        if (rand(2) === 0) {
            // MAXXED ALREADY
            if (this.player.tou100 >= 75) {
                this.outputText("\n\nYour body is as tough and solid as a ");
                if (this.player.gender === 1 || this.player.gender === 3) this.outputText("stallion's.");
                else this.outputText("mare's.");
            }
            // NOT MAXXED
            else {
                this.dynStats("tou", 1.25);
                this.outputText("\n\nYour body suddenly feels tougher and more resilient.");
            }
        }
        // INTELLECT
        if (rand(3) === 0) {
            if (this.player.inte100 <= 5) {
                this.outputText("\n\nYou let out a throaty \"Neiiiigh\" as your animalistic instincts take over.");
            }
            if (this.player.inte100 < 10 && this.player.inte100 > 5) {
                this.dynStats("int", -1);
                this.outputText("\n\nYou smile vacantly as you drink the potion, knowing you're just a big dumb animal who loves to fuck.");
            }
            if (this.player.inte100 <= 20 && this.player.inte100 >= 10) {
                this.dynStats("int", -2);
                this.outputText("\n\nYou find yourself looking down at the empty bottle in your hand and realize you haven't thought ANYTHING since your first sip.");
            }
            if (this.player.inte100 <= 30 && this.player.inte100 > 20) {
                this.dynStats("int", -3);
                this.outputText("\n\nYou smile broadly as your cares seem to melt away.  A small part of you worries that you're getting dumber.");
            }
            if (this.player.inte100 <= 50 && this.player.inte100 > 30) {
                this.dynStats("int", -4);
                this.outputText("\n\nIt becomes harder to keep your mind focused as your intellect diminishes.");
            }
            if (this.player.inte100 > 50) {
                this.dynStats("int", -5);
                this.outputText("\n\nYour usually intelligent mind feels much more sluggish.");
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
        // Restore arms to become human arms again
        if (rand(4) === 0) {
            this.mutations.restoreArms(tfSource);
        }
        // Remove feathery hair
        this.mutations.removeFeatheryHair();
        //
        // SEXUAL CHARACTERISTICS
        //
        // MALENESS.
        if ((this.player.gender === 1 || this.player.gender === 3) && rand(1.5) === 0 && this.changes < this.changeLimit) {
            // If cocks that aren't horsified!
            if ((this.player.countCocksOfType(CockTypesEnum.HORSE) + this.player.countCocksOfType(CockTypesEnum.DEMON)) < this.player.cocks.length) {
                // Transform a cock and store it's index value to talk about it.
                // Single cock
                if (this.player.cocks.length === 1) {
                    temp = 0;
                    // Use temp3 to track whether or not anything is changed.
                    temp3 = 0;
                    if (this.player.cocks[0].cockType === CockTypesEnum.HUMAN) {
                        this.outputText("\n\nYour " + this.player.cockDescript(0) + " begins to feel strange... you pull down your pants to take a look and see it darkening as you feel a tightness near the base where your skin seems to be bunching up.  A sheath begins forming around your cock's base, tightening and pulling your cock inside its depths.  A hot feeling envelops your member as it suddenly grows into a horse penis, dwarfing its old size.  The skin is mottled brown and black and feels more sensitive than normal.  Your hands are irresistibly drawn to it, and you jerk yourself off, splattering cum with intense force.");
                        temp = this.player.addHorseCock();
                        temp2 = this.player.increaseCock(temp, rand(4) + 4);
                        temp3 = 1;
                        this.dynStats("lib", 5, "sen", 4, "lus", 35);
                    }
                    if (this.player.cocks[0].cockType === CockTypesEnum.DOG) {
                        temp = this.player.addHorseCock();
                        this.outputText("\n\nYour " + Appearance.cockNoun(CockTypesEnum.DOG) + " begins to feel odd... you pull down your clothes to take a look and see it darkening.  You feel a growing tightness in the tip of your " + Appearance.cockNoun(CockTypesEnum.DOG) + " as it flattens, flaring outwards.  Your cock pushes out of your sheath, inch after inch of animal-flesh growing beyond it's traditional size.  You notice your knot vanishing, the extra flesh pushing more horsecock out from your sheath.  Your hands are drawn to the strange new " + Appearance.cockNoun(CockTypesEnum.HORSE) + ", and you jerk yourself off, splattering thick ropes of cum with intense force.");
                        temp2 = this.player.increaseCock(temp, rand(4) + 4);
                        temp3 = 1;
                        this.dynStats("lib", 5, "sen", 4, "lus", 35);
                    }
                    if (this.player.cocks[0].cockType === CockTypesEnum.TENTACLE) {
                        temp = this.player.addHorseCock();
                        this.outputText("\n\nYour " + this.player.cockDescript(0) + " begins to feel odd... you pull down your clothes to take a look and see it darkening.  You feel a growing tightness in the tip of your " + this.player.cockDescript(0) + " as it flattens, flaring outwards.  Your skin folds and bunches around the base, forming an animalistic sheath.  The slick inhuman texture you recently had fades, taking on a more leathery texture.  Your hands are drawn to the strange new " + Appearance.cockNoun(CockTypesEnum.HORSE) + ", and you jerk yourself off, splattering thick ropes of cum with intense force.");
                        temp2 = this.player.increaseCock(temp, rand(4) + 4);
                        temp3 = 1;
                        this.dynStats("lib", 5, "sen", 4, "lus", 35);
                    }
                    if (this.player.cocks[0].cockType.Index > 4) {
                        this.outputText("\n\nYour " + this.player.cockDescript(0) + " begins to feel odd... you pull down your clothes to take a look and see it darkening.  You feel a growing tightness in the tip of your " + this.player.cockDescript(0) + " as it flattens, flaring outwards.  Your skin folds and bunches around the base, forming an animalistic sheath.  The slick inhuman texture you recently had fades, taking on a more leathery texture.  Your hands are drawn to the strange new " + Appearance.cockNoun(CockTypesEnum.HORSE) + ", and you jerk yourself off, splattering thick ropes of cum with intense force.");
                        temp = this.player.addHorseCock();
                        temp2 = this.player.increaseCock(temp, rand(4) + 4);
                        temp3 = 1;
                        this.dynStats("lib", 5, "sen", 4, "lus", 35);
                    }
                    if (temp3 === 1) this.outputText("  <b>Your penis has transformed into a horse's!</b>");
                }
                // MULTICOCK
                else {
                    this.dynStats("lib", 5, "sen", 4, "lus", 35);
                    temp = this.player.addHorseCock();
                    this.outputText("\n\nOne of your penises begins to feel strange.  You pull down your clothes to take a look and see the skin of your " + this.player.cockDescript(temp) + " darkening to a mottled brown and black pattern.");
                    if (temp === -1) {
                        CoC_Settings.error("");
                        this.clearOutput();
                        this.outputText("FUKKKK ERROR NO COCK XFORMED");
                    }
                    // Already have a sheath
                    if (this.player.countCocksOfType(CockTypesEnum.HORSE) > 1 || this.player.dogCocks() > 0) this.outputText("  Your sheath tingles and begins growing larger as the cock's base shifts to lie inside it.");
                    else this.outputText("  You feel a tightness near the base where your skin seems to be bunching up.  A sheath begins forming around your " + this.player.cockDescript(temp) + "'s root, tightening and pulling your " + this.player.cockDescript(temp) + " inside its depths.");
                    temp2 = this.player.increaseCock(temp, rand(4) + 4);
                    this.outputText("  The shaft suddenly explodes with movement, growing longer and developing a thick flared head leaking steady stream of animal-cum.");
                    this.outputText("  <b>You now have a horse-cock.</b>");
                }
                // Make cock thicker if not thick already!
                if (this.player.cocks[temp].cockThickness <= 2) this.player.cocks[temp].thickenCock(1);
                this.changes++;
            }
            // Players cocks are all horse-type - increase size!
            else {
                // single cock
                if (this.player.cocks.length === 1) {
                    temp2 = this.player.increaseCock(0, rand(3) + 1);
                    temp = 0;
                    this.dynStats("sen", 1, "lus", 10);
                }
                // Multicock
                else {
                    // Find smallest cock
                    // Temp2 = smallness size
                    // temp = current smallest
                    temp3 = this.player.cocks.length;
                    temp = 0;
                    while (temp3 > 0) {
                        temp3--;
                        // If current cock is smaller than saved, switch values.
                        if (this.player.cocks[temp].cockLength > this.player.cocks[temp3].cockLength) {
                            temp2 = this.player.cocks[temp3].cockLength;
                            temp = temp3;
                        }
                    }
                    // Grow smallest cock!
                    // temp2 changes to growth amount
                    temp2 = this.player.increaseCock(temp, rand(4) + 1);
                    this.dynStats("sen", 1, "lus", 10);
                }
                this.outputText("\n\n");
                if (temp2 > 2) this.outputText("Your " + this.player.cockDescript(temp) + " tightens painfully, inches of taut horse-flesh pouring out from your sheath as it grows longer.  Thick animal-pre forms at the flared tip, drawn out from the pleasure of the change.");
                if (temp2 > 1 && temp2 <= 2) this.outputText("Aching pressure builds within your sheath, suddenly releasing as an inch or more of extra dick flesh spills out.  A dollop of pre beads on the head of your enlarged " + this.player.cockDescript(temp) + " from the pleasure of the growth.");
                if (temp2 <= 1) this.outputText("A slight pressure builds and releases as your " + this.player.cockDescript(temp) + " pushes a bit further out of your sheath.");
                this.changes++;
            }
            // Chance of thickness + daydream
            if (rand(2) === 0 && this.changes < this.changeLimit && this.player.countCocksOfType(CockTypesEnum.HORSE) > 0) {
                temp3 = 0;
                temp2 = this.player.cocks.length;
                while (temp2 > 0) {
                    temp2--;
                    if (this.player.cocks[temp2].cockThickness <= this.player.cocks[temp3].cockThickness) {
                        temp3 = temp2;
                    }
                }
                temp = temp3;
                this.player.cocks[temp].thickenCock(.5);
                this.outputText("\n\nYour " + Appearance.cockNoun(CockTypesEnum.HORSE) + " thickens inside its sheath, growing larger and fatter as your veins thicken, becoming more noticeable.  It feels right");
                if (this.player.cor + this.player.lib < 50) this.outputText(" to have such a splendid tool.  You idly daydream about cunts and pussies, your " + Appearance.cockNoun(CockTypesEnum.HORSE) + " plowing them relentlessly, stuffing them pregnant with cum");
                if (this.player.cor + this.player.lib >= 50 && this.player.cor + this.player.lib < 80) this.outputText(" to be this way... You breath the powerful animalistic scent and fantasize about fucking centaurs night and day until their bellies slosh with your cum");
                if (this.player.cor + this.player.lib >= 75 && this.player.cor + this.player.lib <= 125) this.outputText(" to be a rutting stud.  You ache to find a mare or centaur to breed with.  Longing to spend your evenings plunging a " + Appearance.cockNoun(CockTypesEnum.HORSE) + " deep into their musky passages, dumping load after load of your thick animal-cum into them.  You'd be happy just fucking horsecunts morning, noon, and night.  Maybe somewhere there is a farm needing a breeder..");
                if (this.player.cor + this.player.lib > 125) this.outputText(" to whinny loudly like a rutting stallion.  Your " + Appearance.cockNoun(CockTypesEnum.HORSE) + " is perfect for fucking centaurs and mares.  You imagine the feel of plowing an equine pussy deeply, bottoming out and unloading sticky jets of horse-jizz into its fertile womb.  Your hand strokes your horsecock of its own accord, musky pre dripping from the flared tip with each stroke.  Your mind wanders to the thought of you with a harem of pregnant centaurs.");
                this.outputText(".");
                if (this.player.cor < 30) this.outputText("  You shudder in revulsion at the strange thoughts and vow to control yourself better.");
                if (this.player.cor >= 30 && this.player.cor < 60) this.outputText("  You wonder why you thought such odd things, but they have a certain appeal.");
                if (this.player.cor >= 60 && this.player.cor < 90) this.outputText("  You relish your twisted fantasies, hoping to dream of them again.");
                if (this.player.cor >= 90) this.outputText("  You flush hotly and give a twisted smile, resolving to find a fitting subject to rape and relive your fantasies.");
                this.dynStats("lib", .5, "lus", 10);
            }
            // Chance of ball growth if not 3" yet
            if (rand(2) === 0 && this.changes < this.changeLimit && this.player.ballSize <= 3 && this.player.countCocksOfType(CockTypesEnum.HORSE) > 0) {
                if (this.player.balls === 0) {
                    this.player.balls = 2;
                    this.player.ballSize = 1;
                    this.outputText("\n\nA nauseating pressure forms just under the base of your maleness.  With agonizing pain the flesh bulges and distends, pushing out a rounded lump of flesh that you recognize as a testicle!  A moment later relief overwhelms you as the second drops into your newly formed sack.");
                    this.dynStats("lib", 2, "lus", 5);
                }
                else {
                    this.player.ballSize++;
                    if (this.player.ballSize <= 2) this.outputText("\n\nA flash of warmth passes through you and a sudden weight develops in your groin.  You pause to examine the changes and your roving fingers discover your " + this.player.simpleBallsDescript() + " have grown larger than a human's.");
                    if (this.player.ballSize > 2) this.outputText("\n\nA sudden onset of heat envelops your groin, focusing on your " + this.player.sackDescript() + ".  Walking becomes difficult as you discover your " + this.player.simpleBallsDescript() + " have enlarged again.");
                    this.dynStats("lib", 1, "lus", 3);
                }
                this.changes++;
            }
        }
        // FEMALE
        if (this.player.gender === 2 || this.player.gender === 3) {
            // Single vag
            if (this.player.vaginas.length === 1) {
                if (this.player.vaginas[0].vaginalLooseness <= Vagina.LOOSENESS_GAPING && this.changes < this.changeLimit && rand(2) === 0) {
                    this.outputText("\n\nYou grip your gut in pain as you feel your organs shift slightly.  When the pressure passes, you realize your " + this.player.vaginaDescript(0) + " has grown larger, in depth AND size.");
                    this.player.vaginas[0].vaginalLooseness++;
                    this.changes++;
                }
                if (this.player.vaginas[0].vaginalWetness <= Vagina.WETNESS_NORMAL && this.changes < this.changeLimit && rand(2) === 0) {
                    this.outputText("\n\nYour " + this.player.vaginaDescript(0) + " moistens perceptably, giving off an animalistic scent.");
                    this.player.vaginas[0].vaginalWetness++;
                    this.changes++;
                }
            }
            // Multicooch
            else {
                // determine least wet
                // temp - least wet
                // temp2 - saved wetness
                // temp3 - counter
                temp = 0;
                temp2 = this.player.vaginas[temp].vaginalWetness;
                temp3 = this.player.vaginas.length;
                while (temp3 > 0) {
                    temp3--;
                    if (temp2 > this.player.vaginas[temp3].vaginalWetness) {
                        temp = temp3;
                        temp2 = this.player.vaginas[temp].vaginalWetness;
                    }
                }
                if (this.player.vaginas[temp].vaginalWetness <= Vagina.WETNESS_NORMAL && this.changes < this.changeLimit && rand(2) === 0) {
                    this.outputText("\n\nOne of your " + this.player.vaginaDescript(temp) + " moistens perceptably, giving off an animalistic scent.");
                    this.player.vaginas[temp].vaginalWetness++;
                    this.changes++;
                }
                // determine smallest
                // temp - least big
                // temp2 - saved looseness
                // temp3 - counter
                temp = 0;
                temp2 = this.player.vaginas[temp].vaginalLooseness;
                temp3 = this.player.vaginas.length;
                while (temp3 > 0) {
                    temp3--;
                    if (temp2 > this.player.vaginas[temp3].vaginalLooseness) {
                        temp = temp3;
                        temp2 = this.player.vaginas[temp].vaginalLooseness;
                    }
                }
                if (this.player.vaginas[0].vaginalLooseness <= Vagina.LOOSENESS_GAPING && this.changes < this.changeLimit && rand(2) === 0) {
                    this.outputText("\n\nYou grip your gut in pain as you feel your organs shift slightly.  When the pressure passes, you realize one of your " + this.player.vaginaDescript(temp) + " has grown larger, in depth AND size.");
                    this.player.vaginas[temp].vaginalLooseness++;
                    this.changes++;
                }
            }
            if (this.player.statusEffectv2(StatusEffects.Heat) < 30 && rand(2) === 0 && this.changes < this.changeLimit) {
                if (this.player.goIntoHeat(true)) {
                    this.changes++;
                }
            }

            if (!this.flags[kFLAGS.HYPER_HAPPY]) {
                if (rand(2) === 0 && this.changes < this.changeLimit) {
                    // Shrink B's!
                    // Single row
                    if (this.player.breastRows.length === 1) {
                        // Shrink if bigger than B cups
                        if (this.player.breastRows[0].breastRating > 3) {
                            temp = 1;
                            this.player.breastRows[0].breastRating--;
                            // Shrink again if huuuuge
                            if (this.player.breastRows[0].breastRating > 8) {
                                temp++;
                                this.player.breastRows[0].breastRating--;
                            }
                            // Talk about shrinkage
                            if (temp === 1) this.outputText("\n\nYou feel a weight lifted from you, and realize your " + this.player.breastDescript(0) + " have shrunk to a " + this.player.breastCup(0) + ".");
                            if (temp === 2) this.outputText("\n\nYou feel significantly lighter.  Looking down, you realize your breasts are MUCH smaller, down to " + this.player.breastCup(0) + "s.");
                            this.changes++;
                        }

                    }
                    // multiple
                    else {
                        // temp2 = amount changed
                        // temp3 = counter
                        temp2 = 0;
                        temp3 = this.player.breastRows.length;
                        if (this.player.biggestTitSize() > 3) this.outputText("\n");
                        while (temp3 > 0) {
                            temp3--;
                            if (this.player.breastRows[temp3].breastRating > 3) {
                                this.player.breastRows[temp3].breastRating--;
                                temp2++;
                                this.outputText("\n");
                                if (temp3 < this.player.breastRows.length - 1) this.outputText("...and y");
                                else this.outputText("Y");
                                this.outputText("our " + this.player.breastDescript(temp3) + " shrink, dropping to " + this.player.breastCup(temp3) + "s.");
                            }
                        }
                        if (temp2 === 2) this.outputText("\nYou feel so much lighter after the change.");
                        if (temp2 === 3) this.outputText("\nWithout the extra weight you feel particularly limber.");
                        if (temp2 >= 4) this.outputText("\nIt feels as if the weight of the world has been lifted from your shoulders, or in this case, your chest.");
                        if (temp2 > 0) this.changes++;
                    }
                }
            }
        }
        // NON - GENDER SPECIFIC CHANGES
        // Tail -> Ears -> Fur -> Face
        // Remove odd eyes
        if (this.changes < this.changeLimit && rand(5) === 0 && this.player.eyes.type > Eyes.HUMAN) {
            if (this.player.eyes.type === Eyes.BLACK_EYES_SAND_TRAP) {
                this.outputText("\n\nYou feel a twinge in your eyes and you blink.  It feels like black cataracts have just fallen away from you, and you know without needing to see your reflection that your eyes have gone back to looking human.");
            }
            else {
                this.outputText("\n\nYou blink and stumble, a wave of vertigo threatening to pull your " + this.player.feet() + " from under you.  As you steady and open your eyes, you realize something seems different.  Your vision is changed somehow.");
                if (this.player.eyes.type === Eyes.FOUR_SPIDER_EYES || this.player.eyes.type === Eyes.SPIDER) this.outputText("  Your arachnid eyes are gone!</b>");
                this.outputText("  <b>You have normal, humanoid eyes again.</b>");
            }
            this.player.eyes.type = Eyes.HUMAN;
            this.player.eyes.count = 2;
            this.changes++;
        }
        // HorseFace - Req's Fur && Ears
        if (this.player.face.type !== Face.HORSE && this.player.hasFur() && this.changes < this.changeLimit && rand(5) === 0 && this.player.ears.type === Ears.HORSE) {
            if (this.player.face.type === Face.DOG) this.outputText("\n\nMind-numbing pain shatters through you as you feel your facial bones rearranging.  You clutch at your face in agony as your skin crawls and shifts, your visage reshaping to replace your dog-like characteristics with those of a horse.  <b>You now have a horse's face.</b>");
            else this.outputText("\n\nMind-numbing pain shatters through you as you feel your facial bones breaking and shifting.  You clutch at yourself in agony as you feel your skin crawl and elongate under your fingers.  Eventually the pain subsides, leaving you with a face that seamlessly blends human and equine features.  <b>You have a very equine-looking face.</b>");
            this.changes++;
            this.player.face.type = Face.HORSE;
        }
        // Fur - if has horse tail && ears and not at changelimit
        if (!this.player.hasFur() && this.changes < this.changeLimit && rand(4) === 0 && this.player.tail.type === Tail.HORSE) {
            this.player.setFurColor(ColorLists.HORSE_FUR);
            if (this.player.hasPlainSkin()) this.outputText("\n\nAn itchy feeling springs up over every inch of your skin.  As you scratch yourself madly, you feel fur grow out of your skin until <b>you have a fine coat of " + this.player.skin.furColor + "-colored fur.</b>");
            if (this.player.hasScales()) {
                this.player.skin.desc = "fur";
                this.outputText("\n\nYour " + this.player.skin.tone + " scales begin to itch insufferably.  You reflexively scratch yourself, setting off an avalanche of discarded scales.  The itching intensifies as you madly scratch and tear at yourself, revealing a coat of " + this.player.skin.furColor + " " + this.player.skin.desc + ".  At last the itching stops as <b>you brush a few more loose scales from your new coat of " + this.player.skin.furColor + "-colored fur.</b>");
            }
            this.changes++;
            this.player.skin.type = Skin.FUR;
            this.player.skin.desc = "fur";
            this.player.underBody.restore(); // Restore the underbody for now
        }
        // Hooves - Tail
        if (this.player.lowerBody.type !== LowerBody.HOOFED && this.player.tail.type === Tail.HORSE && this.changes < this.changeLimit && rand(5) === 0) {
            this.changes++;
            if (this.player.lowerBody.type === LowerBody.HUMAN) this.outputText("\n\nYou stagger as your feet change, curling up into painful angry lumps of flesh.  They get tighter and tighter, harder and harder, until at last they solidify into hooves!");
            else if (this.player.lowerBody.type === LowerBody.DOG) this.outputText("\n\nYou stagger as your paws change, curling up into painful angry lumps of flesh.  They get tighter and tighter, harder and harder, until at last they solidify into hooves!");
            else if (this.player.lowerBody.type === LowerBody.NAGA) this.outputText("\n\nYou collapse as your sinuous snake-tail tears in half, shifting into legs.  The pain is immense, particularly in your new feet as they curl inward and transform into hooves!");
            // Catch-all
            else if (this.player.lowerBody.type > LowerBody.NAGA) this.outputText("\n\nYou stagger as your " + this.player.feet() + " change, curling up into painful angry lumps of flesh.  They get tighter and tighter, harder and harder, until at last they solidify into hooves!");
            else if (!this.player.hasFur()) this.outputText("  A fine coat of fur grows out below your waist, itching briefly as it fills in.");
            this.outputText("<b>  You now have hooves in place of your feet!</b>");
            this.player.lowerBody.type = LowerBody.HOOFED;
            this.player.lowerBody.legCount = 2;
            this.dynStats("spe", 1);
            this.changes++;
        }
        // Ears - requires tail
        if (this.player.ears.type !== Ears.HORSE && this.player.tail.type === Tail.HORSE && this.changes < this.changeLimit && rand(3) === 0) {
            if (this.player.ears.type === -1) this.outputText("\n\nTwo painful lumps sprout on the top of your head, forming into tear-drop shaped ears, covered with short fur.  ");
            if (this.player.ears.type === Ears.HUMAN) this.outputText("\n\nYour ears tug painfully on your face as they begin shifting, moving upwards to the top of your head and transforming into an upright animalistic ears.  ");
            if (this.player.ears.type === Ears.DOG) this.outputText("\n\nYour ears change shape, morphing into from their doglike shape into equine-like ears!  ");
            if (this.player.ears.type > Ears.DOG) this.outputText("\n\nYour ears change shape, morphing into teardrop-shaped horse ears!  ");
            this.player.ears.type = Ears.HORSE;
            this.player.ears.value = 0;
            this.outputText("<b>You now have horse ears.</b>");
            this.changes++;
        }
        // Tail - no-prereq
        if (this.player.tail.type !== Tail.HORSE && rand(2) === 0 && this.changes < this.changeLimit) {
            // no tail
            if (this.player.tail.type === 0) {
                this.outputText("\n\nThere is a sudden tickling on your ass, and you notice you have sprouted a long shiny horsetail of the same " + this.player.hair.color + " color as your hair.");
            }
            // if other animal tail
            if (this.player.tail.type > Tail.HORSE && this.player.tail.type <= Tail.COW) {
                this.outputText("\n\nPain lances up your " + this.player.assholeDescript() + " as your tail shifts and morphs disgustingly.  With one last wave of pain, it splits into hundreds of tiny filaments, transforming into a horsetail.");
            }
            // if bee/spider-butt.
            if ((this.player.tail.type > Tail.COW && this.player.tail.type < Tail.SHARK)) {
                this.outputText("\n\nYour insect-like abdomen bunches up as it begins shrinking, exoskeleton flaking off like a snake sheds its skin.  It bunches up until it is as small as a tennis ball, then explodes outwards, growing into an animalistic tail shape.  Moments later, it explodes into filaments of pain, dividing into hundreds of strands and turning into a shiny horsetail.");
            }
            if (this.player.tail.type >= Tail.SHARK) {
                this.outputText("\n\nPain lances up your " + this.player.assholeDescript() + " as your tail shifts and morphs disgustingly.  With one last wave of pain, it splits into hundreds of tiny filaments, transforming into a horsetail.");
            }
            this.outputText("  <b>You now have a horse-tail.</b>");
            this.player.tail.type = Tail.HORSE;
            this.player.tail.venom = 0;
            this.player.tail.recharge = 0;
            this.changes++;
        }
        // Remove gills
        if (rand(4) === 0 && this.player.hasGills() && this.changes < this.changeLimit) {
            this.mutations.updateGills();
        }

        if (rand(3) === 0) this.outputText(this.player.modTone(60, 1));
        // FAILSAFE CHANGE
        if (this.changes === 0) {
            this.outputText("\n\nInhuman vitality spreads through your body, invigorating you!\n");
            this.player.HPChange(20, true);
            this.dynStats("lus", 3);
        }
        this.player.refillHunger(15);
        this.game.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;
        return false;
    }
}
