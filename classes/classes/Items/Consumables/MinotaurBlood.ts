import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";
import { CockTypesEnum } from "../../CockTypesEnum";
import { Neck } from "../../BodyParts/Neck";
import { LowerBody } from "../../BodyParts/LowerBody";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { Vagina } from "../../Vagina";
import { Appearance } from "../../Appearance";
import { StatusEffects } from "../../StatusEffects";
import { Ears } from "../../BodyParts/Ears";
import { Face } from "../../BodyParts/Face";
import { Tail } from "../../BodyParts/Tail";
import { Horns } from "../../BodyParts/Horns";
import { PerkLib } from "../../PerkLib";

/**
 * Minotaur transformative item.
 */
export class MinotaurBlood extends Consumable {
    public constructor() {
        super("MinoBlo", "MinoBlo", "a vial of Minotaur blood", ConsumableLib.DEFAULT_VALUE, "You've got a scratched up looking vial full of bright red minotaur blood.  Any time you move it around it seems to froth up, as if eager to escape.");
    }

    public useItem(): boolean {
        const tfSource: string = "minotaurBlood";
        this.player.slimeFeed();
        this.mutations.initTransformation([2, 3, 3], 1, 2);
        // Temporary storage
        let temp: number = 0;
        let temp2: number = 0;
        let temp3: number = 0;
        // Set up output
        this.clearOutput();
        this.outputText("You drink the bubbling red fluid, tasting the tangy iron after-taste.");
        // STATS
        // Strength h
        if (rand(3) === 0 && this.changes < this.changeLimit) {
            // weaker characters gain more
            if (this.player.str100 <= 50) {
                this.outputText("\n\nPainful aches ripple through your body, flooding you with pain as your muscles flex and bulge, growing much stronger and more well-defined.");
                // very weak players gain more
                if (this.player.str100 <= 20) this.dynStats("str", 3);
                else this.dynStats("str", 2);
            }
            // stronger characters gain less
            else {
                // small growth if over 75
                if (this.player.str100 >= 75) this.dynStats("str", .5);
                // faster from 50-75
                else this.dynStats("str", 1);
                this.outputText("\n\nYour muscles grow tighter, bulging outwards powerfully as you get even stronger!");
            }
            // Chance of speed drop
            if (rand(2) === 0 && this.player.str100 > 50) {
                this.outputText("\n\nYou begin to feel that the size of your muscles is starting to slow you down.");
                this.dynStats("spe", -1);
            }
        }
        // Toughness (chance of - sensitivity)
        if (rand(3) === 0 && this.changes < this.changeLimit) {
            // weaker characters gain more
            if (this.player.tou100 <= 50) {
                this.outputText("\n\nYour hide... skin... whatever... you can feel it getting tougher as it thickens perceptibly.");
                // very weak players gain more
                if (this.player.tou100 <= 20) this.dynStats("tou", 3);
                else this.dynStats("tou", 2);
            }
            // stronger characters gain less
            else {
                // small growth if over 75
                if (this.player.tou100 >= 75) this.dynStats("tou", .5);
                // faster from 50-75
                else this.dynStats("tou", 1);
                this.outputText("\n\nYour tough hide grows slightly thicker.");
            }
            // chance of less sensitivity
            if (rand(2) === 0 && this.player.sens100 > 10) {
                if (this.player.tou100 > 75) {
                    this.outputText("\n\nIt becomes much harder to feel anything through your leathery skin.");
                    this.dynStats("sen", -3);
                }
                if (this.player.tou100 <= 75 && this.player.tou100 > 50) {
                    this.outputText("\n\nThe level of sensation from your skin diminishes noticeably.");
                    this.dynStats("sen", -2);
                }
                if (this.player.tou100 <= 50) {
                    this.outputText("\n\nYour sense of touch diminishes due to your tougher hide.");
                    this.dynStats("sen", -3);
                }
            }
        }
        // SEXUAL
        // Boosts ball size MORE than equinum :D:D:D:D:D:D:
        if (this.changes < this.changeLimit && rand(2) === 0 && this.player.ballSize <= 5 && this.player.countCocksOfType(CockTypesEnum.HORSE) > 0) {
            // Chance of ball growth if not 3" yet
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
        // +hooves
        if (this.player.lowerBody.type !== LowerBody.HOOFED) {
            if (this.changes < this.changeLimit && rand(3) === 0) {
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
        }
        if (!this.flags[kFLAGS.HYPER_HAPPY]) {
            // Kills vagina size (and eventually the whole vagina)
            if (this.player.vaginas.length > 0) {
                if (this.player.vaginas[0].vaginalLooseness > Vagina.LOOSENESS_TIGHT) {
                    // tighten that bitch up!
                    this.outputText("\n\nYour " + this.player.vaginaDescript(0) + " clenches up painfully as it tightens up, becoming smaller and tighter.");
                    this.player.vaginas[0].vaginalLooseness--;
                }
                else {
                    this.outputText("\n\nA tightness in your groin is the only warning you get before your <b>" + this.player.vaginaDescript(0) + " disappears forever</b>!");
                    if (this.player.cocks.length === 0) {
                        this.outputText("  Strangely, your clit seems to have resisted the change, and is growing larger by the moment... shifting into the shape of a small ribbed minotaur-like penis!  <b>You now have a horse-cock!</b>");
                        this.player.createCock();
                        this.player.cocks[0].cockLength = this.player.getClitLength() + 2;
                        this.player.cocks[0].cockThickness = 1;
                        this.player.cocks[0].cockType = CockTypesEnum.HORSE;
                        this.player.setClitLength(.25);
                    }
                    // Goodbye womanhood!
                    this.player.removeVagina(0, 1);

                }
                this.changes++;
            }
            // -Remove extra breast rows
            if (this.changes < this.changeLimit && this.player.bRows() > 1 && rand(3) === 0) {
                this.mutations.removeExtraBreastRow(tfSource);
            }
            // Shrink boobages till they are normal
            else if (rand(2) === 0 && this.changes < this.changeLimit && this.player.breastRows.length > 0) {
                // Single row
                if (this.player.breastRows.length === 1) {
                    // Shrink if bigger than B cups
                    if (this.player.breastRows[0].breastRating >= 1) {
                        temp = 1;
                        this.player.breastRows[0].breastRating--;
                        // Shrink again if huuuuge
                        if (this.player.breastRows[0].breastRating > 8) {
                            temp++;
                            this.player.breastRows[0].breastRating--;
                        }
                        // Talk about shrinkage
                        if (temp === 1) this.outputText("\n\nYou feel a weight lifted from you, and realize your " + this.player.breastDescript(0) + " have shrunk to " + this.player.breastCup(0) + "s.");
                        if (temp === 2) this.outputText("\n\nYou feel significantly lighter.  Looking down, you realize your breasts are MUCH smaller, down to " + this.player.breastCup(0) + "s.");
                        this.changes++;
                    }

                }
                // multiple
                else {
                    // temp2 = amount changed
                    // temp3 = counter
                    temp = 0;
                    temp2 = 0;
                    temp3 = 0;
                    if (this.player.biggestTitSize() >= 1) this.outputText("\n");
                    while (temp3 < this.player.breastRows.length) {
                        if (this.player.breastRows[temp3].breastRating >= 1) {
                            this.player.breastRows[temp3].breastRating--;
                            temp2++;
                            this.outputText("\n");
                            // If this isn't the first change...
                            if (temp2 > 1) this.outputText("...and y");
                            else this.outputText("Y");
                            this.outputText("our " + this.player.breastDescript(temp3) + " shrink, dropping to " + this.player.breastCup(temp3) + "s.");
                        }
                        temp3++;
                    }
                    if (temp2 === 2) this.outputText("\nYou feel so much lighter after the change.");
                    if (temp2 === 3) this.outputText("\nWithout the extra weight you feel particularly limber.");
                    if (temp2 >= 4) this.outputText("\nIt feels as if the weight of the world has been lifted from your shoulders, or in this case, your chest.");
                    if (temp2 > 0) this.changes++;
                }
            }
        }
        // Boosts cock size up to 36"x5".
        if (this.changes < this.changeLimit && rand(2) === 0 && this.player.cocks.length > 0) {
            let selectedCock: number = -1;
            for (let i: number = 0; i < this.player.cocks.length; i++) {
                if (this.player.cocks[i].cockType === CockTypesEnum.HORSE && (this.player.cocks[i].cockLength < 36 || this.player.cocks[i].cockThickness < 5)) {
                    selectedCock = i;
                    break;
                }
            }

            // Length first
            if (selectedCock !== -1) {
                // Thickness too if small enough
                if (this.player.cocks[selectedCock].cockThickness < 5) {
                    // Increase by 2 + rand(8), and store the actual amount in temp
                    temp = this.player.increaseCock(selectedCock, 2 + rand(8));
                    temp += this.player.cocks[selectedCock].thickenCock(1);
                    // Comment on length changes
                    if (temp > 6) this.outputText("\n\nGasping in sudden pleasure, your " + this.player.cockDescript(selectedCock) + " surges free of its sheath, emerging with over half a foot of new dick-flesh.");
                    if (temp <= 6 && temp >= 3) this.outputText("\n\nYou pant in delight as a few inches of " + this.player.cockDescript(selectedCock) + " pop free from your sheath, the thick new horse-flesh still slick and sensitive.");
                    if (temp < 3) this.outputText("\n\nGroaning softly, you feel a pleasurable change in your groin.  Looking down, you see [oneCock] grow slightly longer.");
                    // Add a blurb about thickness...
                    this.outputText("  To your delight and surprise, you discover it has grown slightly thicker as well!");
                }
                // Just length...
                else {
                    // Increase by 2 + rand(8), and store the actual amount in temp
                    temp = this.player.increaseCock(selectedCock, 2 + rand(8));
                    // Comment on length changes
                    if (temp > 6) this.outputText("\n\nGasping in sudden pleasure, your " + this.player.cockDescript(selectedCock) + " surges free of its sheath, emerging with over half a foot of new dick-flesh.");
                    if (temp <= 6 && temp >= 3) this.outputText("\n\nYou pant in delight as a few inches of " + this.player.cockDescript(selectedCock) + " pop free from your sheath, the thick new horse-flesh still slick and sensitive.");
                    if (temp < 3) this.outputText("\n\nGroaning softly, you feel a pleasurable change in your groin.  Looking down, you see [oneCock] grow slightly longer.");
                }
                this.changes++;
            }
        }
        // Morph dick to horsediiiiick
        if (this.player.cocks.length > 0 && rand(2) === 0 && this.changes < this.changeLimit) {
            let selectedCockValue: number = -1; // Changed as selectedCock and i caused duplicate var warnings
            for (let indexI: number = 0; indexI < this.player.cocks.length; indexI++) {
                if (this.player.cocks[indexI].cockType !== CockTypesEnum.HORSE) {
                    selectedCockValue = indexI;
                    break;
                }
            }

            if (selectedCockValue !== -1) {
                // Text for humandicks or others
                if (this.player.cocks[selectedCockValue].cockType === CockTypesEnum.HUMAN || this.player.cocks[selectedCockValue].cockType.Index > 2) this.outputText("\n\nYour " + this.player.cockDescript(selectedCockValue) + " begins to feel strange... you pull down your pants to take a look and see it darkening as you feel a tightness near the base where your skin seems to be bunching up.  A sheath begins forming around your cock's base, tightening and pulling your cock inside its depths.  A hot feeling envelops your member as it suddenly grows into a horse penis, dwarfing its old size.  The skin is mottled brown and black and feels more sensitive than normal.  Your hands are irresistibly drawn to it, and you jerk yourself off, splattering cum with intense force.");
                // Text for dogdicks
                if (this.player.cocks[selectedCockValue].cockType === CockTypesEnum.DOG) this.outputText("\n\nYour " + Appearance.cockNoun(CockTypesEnum.DOG) + " begins to feel odd...  You pull down your clothes to take a look and see it darkening.  You feel a growing tightness in the tip of your " + Appearance.cockNoun(CockTypesEnum.DOG) + " as it flattens, flaring outwards.  Your cock pushes out of your sheath, inch after inch of animal-flesh growing beyond its traditional size.  You notice your knot vanishing, the extra flesh pushing more fresh horsecock out from your sheath.  <b>Your hands are drawn to the strange new " + Appearance.cockNoun(CockTypesEnum.HORSE) + "</b>, and you jerk yourself off, splattering thick ropes of cum with intense force.");
                this.player.cocks[selectedCockValue].cockType = CockTypesEnum.HORSE;
                this.player.increaseCock(selectedCockValue, 4);
                this.dynStats("lib", 5, "sen", 4, "lus", 35);
                this.outputText("<b>  You now have a");
                if (this.player.countCocksOfType(CockTypesEnum.HORSE) > 1) this.outputText("nother");
                this.outputText(" horse-penis.</b>");
                this.changes++;
            }
        }

        // Males go into rut
        if (rand(4) === 0) {
            this.player.goIntoRut(true);
        }

        // Anti-masturbation status
        if (rand(4) === 0 && this.changes < this.changeLimit && !this.player.hasStatusEffect(StatusEffects.Dysfunction)) {
            if (this.player.cocks.length > 0) this.outputText("\n\nYour " + this.player.cockDescript(0) + " tingles abruptly, then stops.  Worried, you reach down to check it, only to discover that it feels... numb.  It will be very hard to masturbate like this.");
            else if (this.player.hasVagina()) this.outputText("\n\nYour " + this.player.vaginaDescript(0) + " tingles abruptly, then stops.  Worried, you reach down to check it, only to discover that it feels... numb.  It will be very hard to masturbate like this.");
            if (this.player.cocks.length > 0 || this.player.hasVagina()) {
                this.player.createStatusEffect(StatusEffects.Dysfunction, 96, 0, 0, 0);
                this.changes++;
            }
        }
        // Appearance shit:
        // Tail, Ears, Hooves, Horns, Height (no prereq), Face
        // +height up to 9 foot
        if (this.changes < this.changeLimit && rand(1.7) === 0 && this.player.tallness < 108) {
            temp = rand(5) + 3;
            // Slow rate of growth near ceiling
            if (this.player.tallness > 90) temp = Math.floor(temp / 2);
            // Never 0
            if (temp === 0) temp = 1;
            // Flavor texts.  Flavored like 1950's cigarettes. Yum.
            if (temp < 5) this.outputText("\n\nYou shift uncomfortably as you realize you feel off balance.  Gazing down, you realize you have grown SLIGHTLY taller.");
            if (temp >= 5 && temp < 7) this.outputText("\n\nYou feel dizzy and slightly off, but quickly realize it's due to a sudden increase in height.");
            if (temp === 7) this.outputText("\n\nStaggering forwards, you clutch at your head dizzily.  You spend a moment getting your balance, and stand up, feeling noticeably taller.");
            this.player.tallness += temp;
            this.changes++;
        }
        // Face change, requires Ears + Height + Hooves
        if (this.player.ears.type === Ears.COW && this.player.lowerBody.type === LowerBody.HOOFED && this.player.tallness >= 90
            && this.changes < this.changeLimit && rand(3) === 0) {
            if (this.player.face.type !== Face.COW_MINOTAUR) {
                this.outputText("\n\nBones shift and twist painfully as your visage twists and morphs to resemble that of the beast whose blood you now drink.  <b>You now have a minotaur-like face.</b>");
                this.changes++;
                this.player.face.type = Face.COW_MINOTAUR;
            }
        }
        // +mino horns require ears/tail
        if (this.changes < this.changeLimit && rand(3) === 0 && this.player.ears.type === Ears.COW && this.player.tail.type === Tail.COW) {
            temp = 1;
            // New horns or expanding mino horns
            if (this.player.horns.type === Horns.COW_MINOTAUR || this.player.horns.type === Horns.NONE) {
                // Get bigger if player has horns
                if (this.player.horns.type === Horns.COW_MINOTAUR) {
                    // Fems horns don't get bigger.
                    if (this.player.vaginas.length > 0) {
                        if (this.player.horns.value > 4) {
                            this.outputText("\n\nYou feel a pressure in your head around your horns, but they don't grow any larger.  ");
                            this.outputText("Your headache clears as lust washes through you unnaturally.  You feel as if you haven't cum in months.");
                            this.player.hoursSinceCum += 200;
                            this.dynStats("lus", 20);
                        }
                        else {
                            this.outputText("\n\nYour small horns get a bit bigger, stopping as medium sized nubs.");
                            this.player.horns.value += 3;
                        }
                        this.changes++;
                    }
                    // Males horns get 'uge.
                    else {
                        temp = 1 + rand(3);
                        this.player.horns.value += temp;
                        if (temp === 0) this.changes--;
                        if (temp === 1) this.outputText("\n\nAn aching pressure builds in your temples as you feel your horns push another inch of length from your skull.  ");
                        if (temp === 2) this.outputText("\n\nA powerful headache momentarily doubles you over.  With painful slowness, you feel your horns push another two inches of length out from your brow, gradually thickening as they grow.  ");
                        if (temp === 3) this.outputText("\n\nAgony overwhelms you as a headache of terrifying intensity sweeps through your skull.  You squeeze your eyes shut from the pain, but it does little to help.  The torture intensifies before finally diminishing as you feel an inch or two of new horn force its way out of your forehead.  The headache remains despite this, and desperate for relief, you grab hold of your horns and tug, pulling another inch of new horn free.  At last the pain fades, leaving you with significantly enhanced head-spikes.  ");
                        if (this.player.horns.value < 3) this.outputText("They are the size of tiny nubs.");
                        if (this.player.horns.value >= 3 && this.player.horns.value < 6) this.outputText("They are similar to what you would see on a young bull.");
                        if (this.player.horns.value >= 6 && this.player.horns.value < 12) this.outputText("They look like the horns on a grown bull, big enough and dangerous enough to do some damage.");
                        if (this.player.horns.value >= 12 && this.player.horns.value < 20) this.outputText("They are large and wicked looking.");
                        if (this.player.horns.value >= 20) this.outputText("They are huge, heavy, and tipped with dangerous points.");
                        // boys get a cum refill sometimes
                        if (rand(2) === 0 && this.changes < this.changeLimit) {
                            this.outputText("  Your headache clears as lust washes through you unnaturally.  You feel as if you haven't cum in months.");
                            this.player.hoursSinceCum += 200;
                            this.dynStats("lus", 20);
                        }
                        this.changes++;
                    }
                }
                // If no horns yet..
                else {
                    this.outputText("\n\nWith painful pressure, the skin on your forehead splits around two tiny nub-like horns, similar to those you would see on the cattle back in your homeland.");
                    this.player.horns.type = Horns.COW_MINOTAUR;
                    this.player.horns.value = 2;
                    this.changes++;
                }
            }
            // Not mino horns, change to cow-horns
            if (this.player.horns.type === Horns.DEMON || this.player.horns.type > Horns.COW_MINOTAUR) {
                this.outputText("\n\nYour horns vibrate and shift as if made of clay, reforming into two horns with a bovine-like shape.");
                this.player.horns.type = Horns.COW_MINOTAUR;
                this.changes++;
            }
        }
        // +cow ears	- requires tail
        if (this.player.ears.type !== Ears.COW && this.changes < this.changeLimit && this.player.tail.type === Tail.COW && rand(2) === 0) {
            this.outputText("\n\nYou feel your ears tug on your scalp as they twist shape, becoming oblong and cow-like.  <b>You now have cow ears.</b>");
            this.player.ears.type = Ears.COW;
            this.changes++;
        }
        // +cow tail
        if (this.changes < this.changeLimit && rand(2) === 0 && this.player.tail.type !== Tail.COW) {
            if (this.player.tail.type === Tail.NONE) this.outputText("\n\nYou feel the flesh above your " + this.player.buttDescript() + " knotting and growing.  It twists and writhes around itself before flopping straight down, now shaped into a distinctly bovine form.  You have a <b>cow tail</b>.");
            else {
                if (this.player.tail.type < Tail.SPIDER_ABDOMEN || this.player.tail.type > Tail.BEE_ABDOMEN) {
                    this.outputText("\n\nYour tail bunches uncomfortably, twisting and writhing around itself before flopping straight down, now shaped into a distinctly bovine form.  You have a <b>cow tail</b>.");
                }
                // insect
                if (this.player.tail.type === Tail.SPIDER_ABDOMEN || this.player.tail.type === Tail.BEE_ABDOMEN) {
                    this.outputText("\n\nYour insect-like abdomen tingles pleasantly as it begins shrinking and softening, chitin morphing and reshaping until it looks exactly like a <b>cow tail</b>.");
                }
            }
            this.player.tail.type = Tail.COW;
            this.changes++;
        }
        // Remove gills
        if (rand(4) === 0 && this.player.hasGills() && this.changes < this.changeLimit) {
            this.mutations.updateGills();
        }

        if (this.changes < this.changeLimit && rand(4) === 0 && ((this.player.ass.analWetness > 0 && this.player.findPerk(PerkLib.MaraesGiftButtslut) < 0) || this.player.ass.analWetness > 1)) {
            this.outputText("\n\nYou feel a tightening up in your colon and your [asshole] sucks into itself.  You feel sharp pain at first but that thankfully fades.  Your ass seems to have dried and tightened up.");
            this.player.ass.analWetness--;
            if (this.player.ass.analLooseness > 1) this.player.ass.analLooseness--;
            this.changes++;
        }
        // Give you that mino build!
        if (rand(4) === 0) this.outputText(this.player.modFem(5, 10));
        if (rand(4) === 0) this.outputText(this.player.modTone(85, 3));
        if (rand(4) === 0) this.outputText(this.player.modThickness(70, 4));
        // Default
        if (this.changes === 0) {
            this.outputText("\n\nMinotaur-like vitality surges through your body, invigorating and arousing you!\n");
            if (this.player.balls > 0) {
                this.outputText("Your balls feel as if they've grown heavier with the weight of more sperm.\n");
                this.player.hoursSinceCum += 200;
            }
            this.player.HPChange(50, true);
            this.dynStats("lus", 50);
        }
        this.player.refillHunger(25);
        this.game.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;
        return false;
    }
}
