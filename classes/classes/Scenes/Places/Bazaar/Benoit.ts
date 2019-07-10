import { BazaarAbstractContent } from "./BazaarAbstractContent";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { PregnancyStore } from "../../../PregnancyStore";
import { PerkLib } from "../../../PerkLib";
import { Eyes } from "../../../BodyParts/Eyes";
import { ItemType } from "../../../ItemType";
import { int, rand } from "../../../Extra";
import { Consumable } from "../../../Items/Consumable";
import { Hair } from "../../../BodyParts/Hair";
import { debug } from "console";
import { Horns } from "../../../BodyParts/Horns";
import { Tail } from "../../../BodyParts/Tail";
import { Ears } from "../../../BodyParts/Ears";
import { LowerBody } from "../../../BodyParts/LowerBody";
import { Wings } from "../../../BodyParts/Wings";

//  TIMES_IN_BENOITS: number = 562;
//  BENOIT_AFFECTION: number = 563;
//  BENOIT_EXPLAINED_SHOP: number = 564;
//  BENOIT_SUGGEST_UNLOCKED: number = 565;
//  BENOIT_1: number = 567;
//  BENOIT_2: number = 568;
//  BENOIT_3: number = 569;
//  BENOIT_TALKED_TODAY: number = 570;
//  BENOIT_TALKED_TO_PROPERLY: number = 571;
//  BENOIT_EGGS: number = 572;
//  BENOIT_TIMES_SEXED_FEMPCS: number = 573;
//  BENOIT_BIRTH_DELAY: number = 574;
//  BENOIT_WOMB_TALK_UNLOCKED: number = 575;
//  BENOIT_POST_FIRSTFUCK_TALK: number = 576;
//  BENOIT_TESTED_BASILISK_WOMB: number = 577;
//  BENOIT_GENERIC_EGGS: number = 632;
// (Shop open between 9:00 and 17:00)
export class Benoit extends BazaarAbstractContent {

    // Fen, you'll need a function to determine gendered pronouns and version of name for this character. I've formatted all the eligible places I found in the order of [male/female]. -Z
    public benoitMF(stringM: string, stringF: string): string {
        if (this.flags[kFLAGS.BENOIT_STATUS] == 1 || this.flags[kFLAGS.BENOIT_STATUS] == 2 || this.flags[kFLAGS.BENOIT_STATUS] == 3) return stringF;
        return stringM;
    }
    private benoitLover(): boolean {
        return this.flags[kFLAGS.BENOIT_TIMES_SEXED_FEMPCS] >= 2;
    }
    public benoitAffection(changes: number = 0): number {
        if (changes != 0) {
            this.flags[kFLAGS.BENOIT_AFFECTION] += changes;
            if (this.flags[kFLAGS.BENOIT_AFFECTION] > 100) this.flags[kFLAGS.BENOIT_AFFECTION] = 100;
            else if (this.flags[kFLAGS.BENOIT_AFFECTION] < 0) this.flags[kFLAGS.BENOIT_AFFECTION] = 0;
        }
        return this.flags[kFLAGS.BENOIT_AFFECTION];
    }

    private benoitKnocksUpPCCheck(): void {
        // Convert old basi's to real basi's!
        if (this.player.pregnancyType == PregnancyStore.PREGNANCY_BASILISK && this.player.findPerk(PerkLib.BasiliskWomb) >= 0) this.player.knockUpForce(PregnancyStore.PREGNANCY_BENOIT, this.player.pregnancyIncubation);
        // Knock up chances:
        if ((this.player.pregnancyType == PregnancyStore.PREGNANCY_OVIELIXIR_EGGS || this.player.findPerk(PerkLib.HarpyWomb) >= 0 || this.player.findPerk(PerkLib.Oviposition) >= 0 || this.player.findPerk(PerkLib.BasiliskWomb) >= 0) && (this.player.pregnancyIncubation == 0 || this.player.pregnancyType == PregnancyStore.PREGNANCY_OVIELIXIR_EGGS)) {
            if (this.player.findPerk(PerkLib.BasiliskWomb) >= 0 && this.flags[kFLAGS.BENOIT_TESTED_BASILISK_WOMB] == 1) {
                if (this.player.pregnancyType != PregnancyStore.PREGNANCY_OVIELIXIR_EGGS || this.player.pregnancyIncubation == 0) {
                    this.player.knockUp(PregnancyStore.PREGNANCY_BENOIT, PregnancyStore.INCUBATION_BASILISK);
                }
                if (this.player.pregnancyIncubation > 0) this.player.knockUpForce(PregnancyStore.PREGNANCY_BENOIT, this.player.pregnancyIncubation);
            }
            else {
                this.player.knockUp(PregnancyStore.PREGNANCY_BASILISK, PregnancyStore.INCUBATION_BASILISK);
            }
        }
    }

    /*
        Return the "heaviness" of the pregnancy
    */
    public benoitPreggers(): boolean {
        if (this.flags[kFLAGS.BENOIT_STATUS] == 0) return false;
        if (this.flags[kFLAGS.FEMOIT_EGGS] > 0) return true;
        return false;
    }

    public benoitRegularPreggers(): boolean {
        if (this.flags[kFLAGS.BENOIT_STATUS] == 0) return false;
        if (this.flags[kFLAGS.FEMOIT_EGGS] >= 1 && this.flags[kFLAGS.FEMOIT_EGGS] <= 4) return true;
        return false;
    }

    public benoitHeavyPreggers(): boolean {
        if (this.flags[kFLAGS.BENOIT_STATUS] == 0) return false;
        if (this.flags[kFLAGS.FEMOIT_EGGS] >= 5 && this.flags[kFLAGS.FEMOIT_EGGS] <= 8) return true;
        return false;
    }

    public benoitVeryHeavyPreggers(): boolean {
        if (this.flags[kFLAGS.BENOIT_STATUS] == 0) return false;
        if (this.flags[kFLAGS.FEMOIT_EGGS] >= 9 && this.flags[kFLAGS.FEMOIT_EGGS] <= 12) return true;
        return false;
    }

    public benoitExtremePreggers(): boolean {
        if (this.flags[kFLAGS.BENOIT_STATUS] == 0) return false;
        if (this.flags[kFLAGS.FEMOIT_EGGS] >= 13) return true;
        return false;
    }

    public benoitInClutch(): boolean {
        if (this.flags[kFLAGS.BENOIT_STATUS] == 0) return false;

        // Benoit enters "clutch" every 21 days, for 7 days
        const startDay: number = this.flags[kFLAGS.FEMOIT_NEXTDAY_EVENT];
        const currDay: number = this.getGame().time.days;
        const diffDays: number = (currDay - startDay) % 28;

        if (diffDays >= 21) return true;
        return false;
    }

    /*
    Cum to Clutch Equation:

    Benoite becomes pregnant with 1 egg by default.

    She can produce a max clutch of 16 eggs, and a PC can only make her pregnant with up to 12 eggs by cum quantity alone. Elven Bounty gives +1 to both min and max clutch size (so a PC with that perk will give her 2-13 eggs each time they fertilise her), Marae's Gift - Stud gives +2 to both min and max clutch size. These two perks stack.

    Every 200mls of cum the PC produces above the first 200mls equals 1 extra egg fertilised. So, producing 2 eggs requires 400mls, 3 eggs requires 600mls, etc, all the way to 12 eggs at 2400mls.

    1-4 Eggs equates to a Regular Pregnancy.
    5-8 Eggs equates to a Heavy Pregnancy.
    9-12 Eggs equates to a Very Heavy Pregnancy.
    13-16 Eggs equates to an Extremely Heavy Pregnancy.
    */
    public benoitKnockUp(): boolean {
        if (this.benoitPreggers()) return false;
        if (!this.benoitInClutch()) return false;

        // Calc the number of eggs
        let eggMod: number = 0;
        if (this.player.hasPerk(PerkLib.ElvenBounty)) eggMod += 1;
        if (this.player.hasPerk(PerkLib.MaraesGiftStud)) eggMod += 2;
        if (this.player.hasPerk(PerkLib.FerasBoonAlpha)) eggMod += 1;

        let numEggs: number = this.player.cumQ() / 200;
        const minEggs: number = 1 + eggMod;
        if (numEggs > 12) numEggs = 12;
        if (numEggs < minEggs) numEggs = minEggs;

        numEggs += eggMod;

        this.flags[kFLAGS.FEMOIT_EGGS] = numEggs;
        this.flags[kFLAGS.FEMOIT_INCUBATION] = 168;

        return true;
    }

    public clearBenoitPreggers(): void {
        if (this.flags[kFLAGS.FEMOIT_EGGS] != 0) {
            this.flags[kFLAGS.FEMOIT_EGGS_LAID] += this.flags[kFLAGS.FEMOIT_EGGS];
            this.flags[kFLAGS.FEMOIT_EGGS] = 0;
            this.flags[kFLAGS.FEMOIT_INCUBATION] = 0;
            this.flags[kFLAGS.FEMOIT_NEXTDAY_EVENT] = this.getGame().time.days; // Cycle "resets" based off birth day.
        }
    }

    public benoitOffspring(): number {
        return this.flags[kFLAGS.BENOIT_EGGS] + this.flags[kFLAGS.FEMOIT_EGGS_LAID];
    }

    public benoitBigFamily(): boolean {
        // You need a bassy womb, ...
        if (this.player.findPerk(PerkLib.BasiliskWomb) < 0)
            return false;

        // ... have laid at least 8 eggs by yourself ...
        if (this.flags[kFLAGS.BENOIT_EGGS] < 8)
            return false;

        // ... and at least 15 eggs produced in total (You and/or Benoite)
        return this.benoitOffspring() >= 15;
    }

    public setBenoitShop(setButtonOnly: boolean = false): void {
        if (this.getGame().time.hours >= 9 && this.getGame().time.hours <= 17) {
            if ((this.flags[kFLAGS.FEMOIT_NEXTDAY_EVENT_DONE] == 1 && this.getGame().time.days >= this.flags[kFLAGS.FEMOIT_NEXTDAY_EVENT]) || this.flags[kFLAGS.FEMOIT_NEXTDAY_EVENT_DONE] != 1) {
                if (this.flags[kFLAGS.TIMES_IN_BENOITS] == 0) {
                    if (!setButtonOnly) this.outputText("\n\nYou notice a large market stall wedged between two wagons, swaddled in carpets and overflowing with all manner of objects. On top of its looming fabric canopy is a wooden sign with the words \"<b>Geckos Garbidg</b>\" crudely scrawled upon them. You wonder what that's all about.");
                    else this.addButton(0, "Market Stall", this.benoitIntro);
                }
                else {
                    if (!setButtonOnly) this.outputText("\n\n" + this.benoitMF("Benoit", "Benoite") + " the basilisk's stall looks open for business. You could go see what's on offer.");
                    else this.addButton(0, this.benoitMF("Benoit", "Benoite"), this.benoitIntro);
                }
            }
        }
        else {
            this.addButtonDisabled(0, this.flags[kFLAGS.TIMES_IN_BENOITS] == 0 ? "Market Stall" : this.benoitMF("Benoit", "Benoite"), "The shop is currently closed. Come back later.\n\nHours of operation: 9am to 5pm");
        }
    }

    // Introduction Scenes
    public benoitIntro(): void {
        this.clearOutput();
        let suggestText: string = "";
        let suggest;
        let womb;
        if (this.flags[kFLAGS.TIMES_IN_BENOITS] == 0) {
            this.outputText("You cautiously approach the stall. The shadow thrown by its large, overhanging canopy makes it quite difficult to see into its interior, and getting inside is made even more hazardous by the sheer volume of objects which clutter the area around it and hang out of the shelves arranged along its wooden walls. Everything Mareth has ever created or distilled seems to be here - or at least, everything Mareth has ever thrown out. Pots, pans, ugly crockery, shelves stuffed with clothing, a spice rack bulging with all manner of suspect-looking potions... you imagine you could probably find anything you'd ever want in here - or something closely resembling it - if you looked hard enough.");
            this.outputText("\n\n\"<i>Allo?</i>\" says a raspy voice from further in the gloom. \"<i>'Oo is zair?</i>\" You can make out a counter constructed from crates, and a tall, thin shape behind it - a lizan, by the looks of his build and smooth scales. Something about his shape makes you feel uneasy, though... you shift further in to take a closer look at the stall owner. He's seated in the only area of his shop not taken up by junk, right next to a heap of rugs and robes, and has a fez perched on top of his blunt head. It's when he turns his grey slit eyes to you that you realize what is putting you on edge - it's a basilisk! Panic grips you as you try to wrench your eyes away... which you do, easily. Curious despite yourself, you look back tentatively. The creature's eyes seem oddly milky, and they seem to be staring beyond you. Realisation takes hold when you see the white stick balanced carefully on the counter's side.");
            this.outputText("\n\n\"<i>Yes, go ahead, stare,</i>\" says the basilisk in a long-suffering tone, making you jump. \"<i>It is a funny joke, yes? Believe me, I wake up laughing about it every morning. At least here zey stare. In ze mountains, zey are so embarrassed zey can't even look at me. Or at least I assume zey can't.</i>\" He straightens his back and sets his jaw. \"<i>'Owever, my slack-jawed friend, zis is not a freak show. Zis is Benoit's Spectacular Salvage Shop! So if you are not 'ere to buy or sell salvage... kindly piss off.</i>\"");

            this.outputText("\n\nYou wonder how a blind anything can make it in such a rough and ready place as the Bazaar, but then Benoit curls " + this.benoitMF("his", "her") + " claws protectively into what appears to be a pile of robes sitting next to " + this.benoitMF("him", "her") + ", which opens dark brown eyes and sets its muzzle on the counter, looking at you plaintively. The Alsatian buried within the cloth looks to you like a big softy, but you're willing to concede the point as made.");
        }
        else if (this.flags[kFLAGS.BENOIT_SUGGEST_UNLOCKED] == 0 && this.player.hasVagina() && (this.player.inHeat || this.player.pregnancyType == PregnancyStore.PREGNANCY_OVIELIXIR_EGGS || this.player.findPerk(PerkLib.HarpyWomb) >= 0 || this.player.findPerk(PerkLib.Oviposition) >= 0) && (this.player.pregnancyType == PregnancyStore.PREGNANCY_OVIELIXIR_EGGS || this.player.pregnancyIncubation == 0) && (this.flags[kFLAGS.BENOIT_STATUS] == 0 || this.flags[kFLAGS.BENOIT_STATUS] == 3)) {
            if (this.flags[kFLAGS.BENOIT_SUGGEST_UNLOCKED] == 0) this.benoitAndFemPCTalkAboutEggings();
            suggest = this.eggySuggest;
            suggestText = "Suggest";
        }
        else if (this.flags[kFLAGS.FEMOIT_NEXTDAY_EVENT_DONE] == 1 && this.flags[kFLAGS.FEMOIT_NEXTDAY_EVENT] <= this.getGame().time.days && this.flags[kFLAGS.BENOIT_STATUS] == 0) {
            this.femoitNextDayEvent();
        }
        else if (this.benoitInClutch() && this.flags[kFLAGS.FEMOIT_READY_FOR_EGGS] == 0 && (this.flags[kFLAGS.BENOIT_STATUS] == 1 || this.flags[kFLAGS.BENOIT_STATUS] == 2)) {
            this.flags[kFLAGS.FEMOIT_READY_FOR_EGGS]++;

            this.outputText("As you enter the stall Benoite looks up; though her blind, milky eyes make her harder to read, she looks excited. \"<i>Ah! [name]; it iz good you are here... I had hope zat you would come for a vizit today.</i>\"");

            this.outputText("\n\nShe stands up somewhat nervously, and you realize that her stomach is visibly bulging, her typical outfit straining slightly to cover the bulk of her midriff. She pats it with a timid sense of pride. \"<i>I am wiz clutch. My womb, it haz created eggz, and zey are ready to be fertilized. I... I could be a mother now. I-if I could find myzelf a willing partner...</i>\" She trembles, despite herself; it's clear that the idea of going from lone male to expectant mother in the space of a few days is a bit much for the basilisk.");

            this.outputText("\n\nYou ask if she's sure she's ready for this. Benoite stiffens her spine and draws herself up proudly. \"<i>I am ready. If it is your nerve zat is weak, well... I will be with eggs for anozer few days. After that, I won't be wizzem again for zome weeks. I can wait until you are ready, if you need.</i>\"");
        }
        else if (this.benoitPreggers() && this.flags[kFLAGS.FEMOIT_INCUBATION] < 0) {
            // Missed it by a week
            if (this.flags[kFLAGS.FEMOIT_INCUBATION] < -168) {
                this.outputText("When you enter the stall, you notice that Benoite's stomach is flat again. She gives you a toothy grin when you enter her stall. \"<i>I have good newz [name]! You are a fazer! " + String(this.flags[kFLAGS.FEMOIT_EGGS]) + " timez over in fact! Oh I wish zat you could have helped; but I was ztrong, ztrong enough get through it on my own.</i>\" she gushes, speaking at a mile-a-minute. She's clearly pleased with herself; and your virility.");

                this.outputText("\n\nShe takes a moment to compose herself, still giddy with the prospect of potentially finding the answer that could save her people; although the means might not be quite what she had in mind, she seems to be taking to the situation with gusto.");

                this.outputText("\n\nThe world continues on though, and she has a shop to run after all; especially if she wants to provide for the hungry mouths that will soon demand her attention.");

                this.outputText("\n\n\"<i>Zo [name],</i>\" she starts, still a hint of excited energy prevalent in her voice, \"<i>what can Benoite azzist you wiz?</i>\"");

                this.clearBenoitPreggers();
                this.flags[kFLAGS.FEMOIT_NEXTDAY_EVENT] -= 7;
            }
            else {
                this.femoitBirths();
                return;
            }
        }
        else if (!this.benoitInClutch() && !this.benoitPreggers() && (this.getGame().time.days - this.flags[kFLAGS.FEMOIT_NEXTDAY_EVENT] >= 30) && (this.flags[kFLAGS.BENOIT_STATUS] > 0)) {
            if (this.flags[kFLAGS.FEMOIT_FIRST_CLUTCH_MISSED] == 0) {
                this.flags[kFLAGS.FEMOIT_FIRST_CLUTCH_MISSED]++;
                this.outputText("When you enter the stall, you are greeted by the smell of something cooking. Investigating further brings you to the blind basilisk's small kitchen, where she is busy frying something. Her nose preoccupied with her meal, she doesn't realize you're approaching until you touch her shoulder, yelping in shock.");

                this.outputText("\n\n\"<i>Don't do zat!</i>\" she complains when she recognizes it's you. \"<i>I almost brained you with zis skittle.</i>\"");

                this.outputText("\n\nYou ask her what she's making.");

                this.outputText("\n\n\"<i>My lunch; an omelette,</i>\" she says.");

                this.outputText("\n\nYour eyes are drawn almost magnetically to her now flat-again stomach and the realization sinks in just where she got the eggs. You ask how she could have done such a thing.");

                // outputText("\n\n\"<i>What? Zey were never fertilised, so, waste not want not.</i>\" she shrugs. When you protest that they could have been her children, she gives you a blank look - though you imagine being blind helps a lot in that regard. \"</i>The, how you say, groinal bleeding of mammal girls could have been their children too; do they get upset about it?</i>\" she asks as a hint of mischievousness sneaks into her smirk. \"<i>Want some?</i>\" she innocently asks, offering you the skillet.");

                this.outputText("\n\n\"<i>Do what exza- oh. Ooh. Aha, mon Dieu, [name]!</i>\" Benoite chokes out between a mix of chortles and guffaws. \"<i>Non [name], I know what it iz zat you are zinking. Aha,</i>\" she continues whilst still half laughing, but manages to calm herself down after a short pause, trying to return to some degree of seriousness. \"<i>I am just hungry. I am, how you say, having a craving for zees strange items one of my zuppliers has been selling lately. 'Cheeken eggz'? I guess my body knowz what it needs to replenish zat which it has lost?</i>\"");

                this.outputText("\n\nShe pats her midriff and you start to put the pieces together. \"<i>Oh. Oooh,</i>\" you mumble back as a response.");

                // outputText("\n\nYou turn her offer down and explain you came here for something else.");
            }
            else {
                this.outputText("The flat-bellied basilisk is tucking away into a plate laden with a heavy omelette when you arrive.");
                this.outputText("\n\n\"<i>Ah, [name]! What can I azzist you wiz?</i>\"");
            }
        }
        else {
            // Subsequent Visit, Affection 0-10:
            if (this.benoitAffection() <= 10) this.outputText("Once again, you carefully enter the gloom of Benoit's salvage shop. The proprietor sniffs the air as you enter, and then looks at you sourly. \"<i>Well?</i>\" " + this.benoitMF("he", "she") + " rasps.");
            // Benoit reacts after fucking the PC.
            else if (this.flags[kFLAGS.BENOIT_TIMES_SEXED_FEMPCS] == 1 && this.flags[kFLAGS.BENOIT_POST_FIRSTFUCK_TALK] == 0)
                this.firstTimeAfterBoningEncounterBenoit();
            else if (this.benoitAffection() < 35) this.outputText("Once again, you carefully enter the gloom of Benoit's salvage shop. The proprietor sniffs the air as you enter, and then relaxes in " + this.benoitMF("his", "her") + " seat. \"<i>Allo again, " + this.player.short + ". What brings you 'ere?</i>\"");
            // Subsequent Visit, Affection 35+ but pre-lover/pre-fem:
            else {
                this.outputText("Once again, you carefully enter the gloom of " + this.benoitMF("Benoit", "Benoite") + "'s salvage shop. The proprietor sniffs the air as you enter, and then smiles widely. \"<i>If it isn't my favorite customer! Do not 'ang around out zere, [name]; please, come in and let us, 'ow you say, chew ze fat.</i>\"");

                // Preggers stuff
                if (this.benoitInClutch() && !this.benoitPreggers()) this.outputText("\n\nAn obvious bulge in the female basilisk's apron-clad belly signals the presence of new eggs. If you were to have sex with her in this state then there's a good chance she'll end up with a belly full of fertilized eggs.");
                else if (this.benoitRegularPreggers()) this.outputText("\n\nThe basilisk's belly bulges out, big as any pregnant woman back home. Her apron merely highlights the fact she's carrying the eggs you fathered.");
                else if (this.benoitHeavyPreggers()) this.outputText("\n\nBenoite's pregnancy is unmistakable, and the number of eggs she's carrying is quite impressive. Her apron is strained to the limit to contain her distended belly, and you wonder how she manages to tie it up each morning.");
                else if (this.benoitVeryHeavyPreggers()) this.outputText("\n\nThe basilisk's belly is hugely swollen with fertilized eggs, and you notice that she tries to avoid moving unless she has to. She's so bloated that she has given up trying to tie her apron on, and instead lets it flap idly on her engorged midriff.");
                else if (this.benoitExtremePreggers()) this.outputText("\n\nYou can hardly believe just how pregnant Benoite is - you wouldn't have imagined it was possible to carry that many fertilized eggs. She's practically immobile, and when she does get up and shuffle along, her belly nearly drags along the ground; it's that swollen with your young. Needless to say, practicality demands she goes around naked.");
            }
        }

        this.flags[kFLAGS.TIMES_IN_BENOITS]++;
        this.unlockCodexEntry("Basilisks", kFLAGS.CODEX_ENTRY_BASILISKS);

        this.menu();
        // Core buttons
        this.addButton(0, "Buy", this.benoitsBuyMenu);
        this.addButton(1, "Sell", this.benoitSellMenu);
        this.addButton(2, "Talk", this.talkToBenoit);
        this.addButton(14, "Leave", this.bazaar.enterTheBazaarAndMenu);
        // Feminize & Herminize
        if (this.flags[kFLAGS.FEMOIT_UNLOCKED] == 1 && this.flags[kFLAGS.BENOIT_STATUS] == 0)
            this.addButton(3, "Feminize", this.benoitFeminise);
        if (this.flags[kFLAGS.BENOIT_STATUS] > 0 && this.flags[kFLAGS.BENOIT_STATUS] < 3)
            this.addButton(3, "Herminize", this.benoitHerminise);
        // Basilisk Womb
        if (this.flags[kFLAGS.BENOIT_WOMB_TALK_UNLOCKED] == 1 && this.flags[kFLAGS.BENOIT_TESTED_BASILISK_WOMB] == 0 && [0, 3].indexOf(this.flags[kFLAGS.BENOIT_STATUS]) >= 0 && !this.player.hasPerk(PerkLib.BasiliskWomb))
            this.addButton(4, "Basil. Womb", this.tryToConvertToBassyWomb);
        // Suggest & sex
        if (this.flags[kFLAGS.BENOIT_SUGGEST_UNLOCKED] > 0 && this.player.hasVagina() && (this.flags[kFLAGS.BENOIT_STATUS] == 0 || this.flags[kFLAGS.BENOIT_STATUS] == 3))
            this.addButton(5, "Suggest", this.eggySuggest);
        if (this.player.hasCock() && this.flags[kFLAGS.BENOIT_STATUS] > 0 && this.player.lust >= 33)
            this.addButton(6, "Sex", (this.flags[kFLAGS.TIMES_FUCKED_FEMOIT] == 0 ? this.femoitFirstTimeYes : this.femoitSexIntro));
        if (this.flags[kFLAGS.BENOIT_EYES_TALK_UNLOCKED] == 1 && this.player.eyes.type != Eyes.BASILISK)
            this.addButton(7, "Basil. Eyes", this.convertToBassyEyes);
    }
    // Buy or Sell First Time, only if prelover/prefem: You ask him what the deal is with his shop.
    private buyOrSellExplanationFirstTime(): void {
        this.flags[kFLAGS.BENOIT_EXPLAINED_SHOP]++;
        this.outputText("\"<i>If you can see something you want in Benoit's Spectacular Salvage Shop, and you can walk away with it, it's yours,</i>\" replies Benoit, theatrically sweeping his claw to take in the entirety of his stall but almost knocking over a birdcage. \"<i>Assuming you can pay whatever I've decided it's worth, of course. If you want to unload your garbage 'ere? Zis is also fine. I cannot pay what ze fat cats in Tel'Adre can, though. Check back every day; ze Spectacular Salvage Shop always 'as new zings to sell.</i>\"");
    }

    public benoitsBuyMenu(): void {
        this.clearOutput();
        if (this.flags[kFLAGS.BENOIT_1] == 0) this.updateBenoitInventory();
        if (this.flags[kFLAGS.BENOIT_EXPLAINED_SHOP] == 0) this.buyOrSellExplanationFirstTime();
        let buyMod: number = 2;

        if (this.flags[kFLAGS.BENOIT_STATUS] != 0) {
            buyMod = 1.66;
            this.outputText("\"<i>Some may call zis junk,</i>\" says Benoite, indicating her latest wares. \"<i>Me... I call it garbage.</i>\"");
        }
        else {
            this.outputText("\"<i>Some may call zis junk,</i>\" says Benoit, indicating his latest wares. \"<i>Me... I call it garbage.</i>\"");
        }
        this.outputText("\n\n<b><u>" + this.benoitMF("Benoit", "Benoite") + "'s Prices</u></b>");
        this.outputText("\n" + ItemType.lookupItem(this.flags[kFLAGS.BENOIT_1]).longName + ": " + Math.round(buyMod * ItemType.lookupItem(this.flags[kFLAGS.BENOIT_1]).value));
        this.outputText("\n" + ItemType.lookupItem(this.flags[kFLAGS.BENOIT_2]).longName + ": " + Math.round(buyMod * ItemType.lookupItem(this.flags[kFLAGS.BENOIT_2]).value));
        this.outputText("\n" + ItemType.lookupItem(this.flags[kFLAGS.BENOIT_3]).longName + ": " + Math.round(buyMod * ItemType.lookupItem(this.flags[kFLAGS.BENOIT_3]).value));
        this.menu();
        this.addButton(0, this.flags[kFLAGS.BENOIT_1], this.benoitTransactBuy, 1);
        this.addButton(1, this.flags[kFLAGS.BENOIT_2], this.benoitTransactBuy, 2);
        this.addButton(2, this.flags[kFLAGS.BENOIT_3], this.benoitTransactBuy, 3);
        if (this.player.keyItemv1("Backpack") < 5) this.addButton(5, "Backpack", this.buyBackpack).hint("This backpack will allow you to carry more items.");
        if (this.flags[kFLAGS.BENOIT_PISTOL_BOUGHT] <= 0) this.addButton(6, "Flintlock", this.buyFlintlock);
        if (this.flags[kFLAGS.BENOIT_CLOCK_BOUGHT] <= 0 && this.flags[kFLAGS.CAMP_CABIN_FURNITURE_NIGHTSTAND] > 0) this.addButton(7, "Alarm Clock", this.buyAlarmClock).hint("This mechanical clock looks like it was originally constructed by the Goblins before the corruption spread throughout Mareth.");
        this.addButton(14, "Back", this.benoitIntro);
    }

    private benoitSellMenu(): void {
        this.clearOutput();
        if (this.flags[kFLAGS.BENOIT_EXPLAINED_SHOP] == 0)
            this.buyOrSellExplanationFirstTime();
        else
            this.outputText("\"<i>Let us feel what you are trying to palm off upon me zis time, zen,</i>\" sighs Benoit" + this.benoitMF("", "e") + ", sitting down and opening " + this.benoitMF("his", "her") + " hand to you.");
        let sellMod: number = 3;
        this.outputText("\n\n(You can shift-click to sell all items in a stack.)");
        if (this.flags[kFLAGS.BENOIT_EGGS] > 0 || this.flags[kFLAGS.BENOIT_STATUS] != 0) sellMod = 2;
        this.outputText("\n\n<b><u>Benoit" + this.benoitMF("", "e") + "'s Estimates</u></b>");
        this.menu();
        let totalItems: number = 0;
        for (let slot: number = 0; slot < 10; slot++) {
            if (this.player.itemSlots[slot].quantity > 0 && int(this.player.itemSlots[slot].itype.value / sellMod) >= 1) {
                this.outputText("\n" + int(this.player.itemSlots[slot].itype.value / sellMod) + " gems for " + this.player.itemSlots[slot].itype.longName + ".");
                this.addButton(slot, (this.player.itemSlots[slot].itype.shortName + " x" + this.player.itemSlots[slot].quantity), this.benoitSellTransact, slot, sellMod);
                totalItems += this.player.itemSlots[slot].quantity;
            }
        }
        if (totalItems > 1) this.addButton(12, "Sell All", this.benoitSellAllTransact, totalItems, sellMod);
        this.addButton(14, "Back", this.benoitIntro);
    }

    private benoitTransactBuy(slot: number = 1): void {
        this.clearOutput();
        let itype: ItemType;
        let buyMod: number = 2;

        if (this.flags[kFLAGS.BENOIT_STATUS] != 0) buyMod = 1.66;

        if (slot == 1) itype = ItemType.lookupItem(this.flags[kFLAGS.BENOIT_1]);
        else if (slot == 2) itype = ItemType.lookupItem(this.flags[kFLAGS.BENOIT_2]);
        else itype = ItemType.lookupItem(this.flags[kFLAGS.BENOIT_3]);
        if (this.player.gems < Math.round(buyMod * itype.value)) {
            this.outputText("You consider making a purchase, but you lack the gems to go through with it.");
            this.doNext(this.benoitsBuyMenu);
            return;
        }
        if (this.benoitLover()) this.outputText("After examining what you've picked out with " + this.benoitMF("his", "her") + " fingers, " + this.benoitMF("Benoit", "Benoite") + " hands it over and accepts your gems with a grin.");
        else this.outputText("After examining what you've picked out with " + this.benoitMF("his", "her") + " fingers, " + this.benoitMF("Benoit", "Benoite") + " hands it over, names the price and accepts your gems with a curt nod.\n\n");
        // (+3 Affection)
        this.benoitAffection(3);

        this.player.gems -= Math.round(buyMod * itype.value);
        this.statScreenRefresh();

        if (this.flags[kFLAGS.SHIFT_KEY_DOWN] == 1 && itype instanceof Consumable) {
            (itype as Consumable).useItem();
            this.doNext(this.benoitsBuyMenu);
        } else this.inventory.takeItem(itype, this.benoitsBuyMenu);
    }

    private benoitSellTransact(slot: number, sellMod: number): void {
        this.clearOutput();
        if (this.benoitLover()) this.outputText("Benoit" + this.benoitMF("", "e") + " gives your object the briefest of goings-over with " + this.benoitMF("his", "her") + " fingers before stowing it away and handing over your gem reward with a trusting smile.");
        else this.outputText("Following a painstaking examination of what you've given " + this.benoitMF("him", "her") + " with his hands and nose, Benoit grudgingly accepts it and carefully counts out your reward.");
        if (this.flags[kFLAGS.SHIFT_KEY_DOWN] == 1) {
            while (this.player.itemSlots[slot].quantity > 0) {
                this.player.gems += int(this.player.itemSlots[slot].itype.value / sellMod);
                this.player.itemSlots[slot].removeOneItem();
                this.benoitAffection(1);
            }
        }
        else {
            this.player.gems += int(this.player.itemSlots[slot].itype.value / sellMod);
            this.player.itemSlots[slot].removeOneItem();
            // (+1 Affection)
            this.benoitAffection(1);
        }
        this.statScreenRefresh();
        this.doNext(this.benoitSellMenu);
    }

    private benoitSellAllTransact(totalItems: number, sellMod: number): void {
        this.clearOutput();
        let itemValue: number = 0;
        for (let slot: number = 0; slot < 10; slot++) {
            if (this.player.itemSlots[slot].quantity > 0 && int(this.player.itemSlots[slot].itype.value / sellMod) >= 1) {
                itemValue += this.player.itemSlots[slot].quantity * int(this.player.itemSlots[slot].itype.value / sellMod);
                this.player.itemSlots[slot].quantity = 0;
            }
        }
        if (this.benoitLover())
            this.outputText("Benoit" + this.benoitMF("", "e") + " gives your objects the briefest of goings-over with " + this.benoitMF("his", "her") + " fingers before stowing them away and handing over your " + Benoit.num2Text(itemValue) + " gem reward with a trusting smile.");
        else this.outputText("Following a painstaking examination of the items you've given him with his hands and nose, Benoit grudgingly accepts them and carefully counts out your " + Benoit.num2Text(itemValue) + " gem reward.");
        this.player.gems += itemValue;
        this.statScreenRefresh();
        // (+1 Affection per item)
        this.benoitAffection(totalItems);
        this.doNext(this.benoitIntro);
    }

    // All slots are reset each day.  Benoit buys items at 66% the rate Oswald does.
    public updateBenoitInventory(): void {
        let benoitSlot1Items: any[] = [];
        let benoitSlot2Items: any[] = [];
        let benoitSlot3Items: any[] = [];
        // Slot 1 Any one of the following: Incubus Draft, Minotaur Blood, Minotaur Cum, Equinuum, Black Pepper, Vitalitea, Scholar's Tea, Double Pepper
        benoitSlot1Items = [
            this.consumables.INCUBID.id,
            this.consumables.MINOBLO.id,
            this.consumables.MINOCUM.id,
            this.consumables.EQUINUM.id,
            this.consumables.BLACKPP.id,
            this.consumables.SMART_T.id,
            this.consumables.VITAL_T.id,
            this.consumables.DBLPEPP.id,
            this.consumables.REPTLUM.id,
        ];
        benoitSlot1Items.push(rand(3) == 0 ? this.consumables.PURHONY.id : this.consumables.BEEHONY.id);
        this.flags[kFLAGS.BENOIT_1] = Benoit.randomChoice(benoitSlot1Items);

        // If the player discarded a unique item, the first time they arrive at the Salvage Shop after a week has passed it will appear in Slot 1.
        if (rand(10) == 0) {
            this.flags[kFLAGS.BENOIT_1] = this.consumables.GODMEAD.id;
        }

        if (rand(100) >= 4) {
            // Slot 2 Any one of the following: Succubus Milk, Whisker Fruit, Wet Cloth, Golden Seed, LaBova, Snake Oil, Pink Gossamer, Black Gossamer
            benoitSlot2Items = [
                this.consumables.SUCMILK.id,
                this.consumables.W_FRUIT.id,
                this.consumables.WETCLTH.id,
                this.consumables.GLDSEED.id,
                this.consumables.LABOVA_.id,
                this.consumables.SNAKOIL.id,
                this.consumables.S_GOSSR.id,
                this.consumables.HUMMUS_.id,
                this.consumables.PIGTRUF.id,
                this.consumables.B_GOSSR.id,
            ];
        } else {
            // There is a 4% chance the following items will appear in Slot 2: Bimbo Liqueur, Large Pink Egg, Large Blue Egg, Bro Brew, T. Shark Tooth.
            benoitSlot2Items = [
                this.consumables.BIMBOLQ.id,
                this.consumables.L_PNKEG.id,
                this.consumables.L_BLUEG.id,
                this.consumables.BROBREW.id,
                this.consumables.TSTOOTH.id,
            ];
        }
        this.flags[kFLAGS.BENOIT_2] = Benoit.randomChoice(benoitSlot2Items);

        if (rand(100) >= 10) {
            // Slot 3 Any one of the following: Maid's Clothes, Wizard Robes, Tough Silk, Slutty Swimwear, Goo Chunk, Chitin Plate
            benoitSlot3Items = [
                this.armors.W_ROBES.id,
                this.armors.S_SWMWR.id,
                this.useables.GREENGL.id,
                this.useables.B_CHITN.id,
                this.useables.T_SSILK.id,
                this.useables.D_SCALE.id,
            ];
        } else {
            // There is a 10% chance the following items will appear in Slot 3: Bondage Straps, Nurse Outfit, Red Party Dress
            benoitSlot3Items = [
                this.armors.BONSTRP.id,
                this.armors.NURSECL.id,
                this.consumables.W_PDDNG.id,
            ];
        }
        this.flags[kFLAGS.BENOIT_3] = Benoit.randomChoice(benoitSlot3Items);
        // Slot 4 Herbal Contraceptive - 30 gems.  Only becomes available through PC fem path.  Reduces fertility by 90% for a week if taken.
    }

    private buyFlintlock(): void {
        this.clearOutput();
        this.outputText("You wander " + this.benoitMF("Benoit", "Benoite") + "'s shop for a good while as you're searching for something interesting until you spot something interesting.");
        this.outputText("\n\nYou walk over to pick up whatever caught your attention and show it to " + this.benoitMF("Benoit", "Benoite") + ". \"<i>Zis? I do know that zis a weapon and it originally belonged to a goblin from long time ago,</i>\" " + this.benoitMF("he", "she") + " says.");
        this.outputText("\n\nTime to test this weapon out. You aim the pistol at one of the empty tin cans and pull the trigger. A round launches from the pistol and hits the tin can, knocking it off shelf. " + this.benoitMF("Benoit", "Benoite") + " looks in surprise and says, \"<i>It works? 200 gems and it can be yours.</i>\"");
        this.outputText("\n\nDo you buy the gun? ");
        this.doYesNo(this.buyFlintlockConfirmation, this.benoitsBuyMenu);
    }
    private buyFlintlockConfirmation(): void {
        this.clearOutput();
        if (this.player.gems < 200) {
            this.outputText("You count out your gems and realize it's beyond your price range.");
            this.doNext(this.benoitsBuyMenu);
            return;
        }
        this.outputText("\"<i>Here you go. I have no need for zis,</i>\" " + this.benoitMF("Benoit", "Benoite") + " says.");
        this.flags[kFLAGS.BENOIT_PISTOL_BOUGHT]++;
        this.flags[kFLAGS.FLINTLOCK_PISTOL_AMMO] = 4;
        this.player.gems -= 200;
        this.statScreenRefresh();
        this.inventory.takeItem(this.weapons.FLNTLK0, this.benoitsBuyMenu);
    }

    private buyAlarmClock(): void {
        this.clearOutput();
        this.outputText("You wander " + this.benoitMF("Benoit", "Benoite") + "'s shop for a good while as you're searching for something interesting until you spot something interesting.");
        this.outputText("\n\nIt's a mechanical clock. It has a flip display and there are buttons on top of the clock for the purpose of setting time and alarm. You wind up the clock and the display flips, indicating that the clock works. Whoever constructed this clock must have been a genius, you would have even guessed a goblin constructed it before the corruption. You pick up the clock and show it to " + this.benoitMF("Benoit", "Benoite") + ".");
        this.outputText("\n\n\"<i>It works? I have no need for zis. 500 gems,</i>\" " + this.benoitMF("he", "she") + " says.");
        this.outputText("\n\nDo you buy the clock?");
        this.doYesNo(this.buyAlarmClockConfirmation, this.benoitsBuyMenu);
    }
    private buyAlarmClockConfirmation(): void {
        this.clearOutput();
        if (this.player.gems < 500) {
            this.outputText("You count out your gems and realize it's beyond your price range.");
            this.doNext(this.benoitsBuyMenu);
            return;
        }
        this.outputText("\"<i>Here you go. I have no need for zis,</i>\" " + this.benoitMF("Benoit", "Benoite") + " says.");
        this.outputText("\n\n<b>You can now set alarm. Go to your cabin to set the alarm. (And change the time when you'll wake up.)</b>");
        this.player.gems -= 500;
        this.statScreenRefresh();
        this.flags[kFLAGS.BENOIT_CLOCK_BOUGHT]++;
        this.flags[kFLAGS.BENOIT_CLOCK_ALARM] = 6;
        this.doNext(this.benoitsBuyMenu);
    }

    private buyBackpack(): void {
        this.clearOutput();
        this.outputText("You ask " + this.benoitMF("Benoit", "Benoite") + " if " + this.benoitMF("he", "she") + " has a backpack to spare.");
        this.outputText("\n\n\"<i>Yes. Zese come in three sizes. What will you pick?</i>\" " + this.benoitMF("he", "she") + " asks.");
        this.outputText("\n\n<b><u>Backpack Size and Pricings</u></b>");
        this.outputText("\nSmall: 200 gems, +3 inventory slots");
        this.outputText("\nMedium: 600 gems, +4 inventory slots");
        this.outputText("\nLarge: 1200 gems, +5 inventory slots");
        this.menu();
        if (this.player.keyItemv1("Backpack") < 3) this.addButton(0, "Small", this.buyBackpackConfirmation, 3, "Small", 200, "Grants additional three slots. \n\nCost: 200 gems");
        if (this.player.keyItemv1("Backpack") < 4) this.addButton(1, "Medium", this.buyBackpackConfirmation, 4, "Medium", 600, "Grants additional four slots. \n\nCost: 600 gems");
        if (this.player.keyItemv1("Backpack") < 5) this.addButton(2, "Large", this.buyBackpackConfirmation, 5, "Large", 1200, "Grants additional five slots. \n\nCost: 1200 gems");
        this.addButton(4, "Nevermind", this.benoitsBuyMenu);
    }
    private buyBackpackConfirmation(size: number = 3, sizeDesc: string = "Small", price: number = 200): void {
        this.clearOutput();
        if (this.player.gems < price) {
            this.outputText("You count out your gems and realize it's beyond your price range.");
            this.doNext(this.benoitsBuyMenu);
            return;
        }
        this.outputText("\"<i>Here you go. I have no need for zis,</i>\" " + this.benoitMF("Benoit", "Benoite") + " says.");
        if (this.player.hasKeyItem("Backpack") >= 0) {
            this.outputText("\n\n<b>(Key Item Upgraded: " + sizeDesc + " Backpack! You now have " + Benoit.num2Text(size - this.player.keyItemv1("Backpack")) + " extra inventory slots");
            this.player.addKeyValue("Backpack", 1, size - this.player.keyItemv1("Backpack"));
            this.outputText(" for a total of " + Benoit.num2Text(this.inventory.getMaxSlots()) + " slots.)</b>");
        }
        else {
            this.outputText("\n\n<b>(Key Item Gained: " + sizeDesc + " Backpack! You now have " + Benoit.num2Text(size) + " extra inventory slots");
            this.player.createKeyItem("Backpack", size, 0, 0, 0);
            this.outputText(" for a total of " + Benoit.num2Text(this.inventory.getMaxSlots()) + " slots.)</b>");
        }
        this.player.gems -= price;
        this.statScreenRefresh();
        this.doNext(this.benoitsBuyMenu);
    }

    // Talk
    private talkToBenoit(): void {
        this.clearOutput();

        // (+5 Affection per day if used)
        if (this.flags[kFLAGS.BENOIT_TALKED_TODAY] == 0) {
            this.flags[kFLAGS.BENOIT_TALKED_TODAY] = 1;
            this.benoitAffection(5);
        }
        if (this.flags[kFLAGS.BENOIT_BASIL_EYES_GRANTED] > 0 && this.player.hasKeyItem("Feathery hair-pin") < 0) {
            const hasSolidHair: boolean = (this.player.hair.type != Hair.GOO && this.player.hair.length > 0);
            this.credits.authorText = "MissBlackthorne";
            this.outputText("\"<i>Ah [name]! I 'ad been 'oping to speak wiz you.</i>\" your basilisk lover says with a toothy smile. \"<i>I 'ave a gift for "
                + "you... For all you 'ave done.</i>\" You notice the scales on " + this.benoitMF("Benoit", "Benoite") + "'s face turn a deeper green,"
                + " evidently blushing as " + this.benoitMF("he", "she") + " thrusts out a closed palm, gaze averted like a kid on Valentines Day."
                + " You place your hand out and feel something small fall into your palm. It tickles and feels cool."
                + " You look down at the trinket you have received, immediately surprised.");
            this.outputText("\n\nYou hold a silver hair pin, its shining exterior glittering in the light. Tiny scales are cast into the metal of the pin as"
                + " though it were the tail of a reptile, something that must have taken master craftsmanship to form so well. At the end is a ovoid"
                + " gemstone, a swirling grey pattern deep within it. You are reminded of the eyes of basilisks in the mountains, though this time,"
                + " you look at it because it is beautiful, rather than through compulsion. Under the gem is a plume of three delicate crimson"
                + " feathers, their soft fibres tickling your palm. Surely " + this.benoitMF("Benoit", "Benoite") + " didn't mean to give you such an"
                + " expensive looking item?!");
            this.outputText("\n\n\"<i>[name], nussing can pay for what you 'ave done for me, for my kind. Such an 'eirloom is paltry to zat.</i>\" "
                + this.benoitMF("Benoit", "Benoite") + " says softly, eyes closed. \"<i>It does not feel warped by ze demons, and I am 'oping it reminds"
                + " you of me in your travels.</i>\"");
            this.outputText("\n\nYou feel a blush creep across your [face] as you thank the blind basilisk, hugging " + this.benoitMF("him", "her")
                + " to you tight before you leave");
            if (hasSolidHair && this.player.cor < 55) { // Equip only, if you have hair and if it's not gooey.
                this.outputText(", slipping the pin into your [hair] as you exit the store.");
                // value1: hairPinIsEquipped, value2: just (re)equipped, but TF not triggered yet.
                this.player.createKeyItem("Feathery hair-pin", 1, 1, 0, 0);
            } else {
                this.outputText(".");
                this.player.createKeyItem("Feathery hair-pin", 0, 0, 0, 0);
            }
            this.outputText("\n\n(<b>Gained Key Item: Feathery hair-pin</b>)");
            this.doNext(this.camp.returnToCampUseOneHour);
            return;
        }
        if (this.benoitBigFamily() && this.player.inte >= 60 && this.flags[kFLAGS.BENOIT_EYES_TALK_UNLOCKED] == 0) {
            this.credits.authorText = "MissBlackthorne";
            this.outputText("You ask " + this.benoitMF("Benoit", "Benoite") + " how the petrifying effect of " + this.benoitMF("his", "her") + " brethrens gaze works,"
                + " is it something their eyes naturally do or type of sight? " + this.benoitMF("He", "She") + " stiffens for a moment before letting out a frustrated sigh.");

            this.outputText("\n\n\"<i>[name], you do know i am blind yes? Zis is not somesing to joke about.</i>\"");

            this.outputText("\n\nYou hurriedly tell your scaled lover that you didn't mean it in a cruel way, you were merely curious."
                + " After all, you've transformed yourself to become more basilisk like for " + this.benoitMF("him", "her")
                + " already, so you're curious if you could get even closer to being a true basilisk.");

            this.outputText("\n\nAfter a few moments " + this.benoitMF("Benoit", "Benoite") + " nods slightly.");
            this.outputText("\n\"<i>I see...are you sure about zis [name]? It is so reckless to experiment on your body like zis....But I suppose you have done so much for my folk,"
                + " zat if you wish to be one of us, i could look into it. Beware though, zey are dangerous, so while i shall do zis to thank you,"
                + " I do not wish to risk you becoming like ze others...Ze demons no doubt affected our gaze too, ze perverts...</i>\"");

            this.outputText("\n\nYou smile at the lizard's concern for you before leaving " + this.benoitMF("Benoit", "Benoite") + " to find a recipe in peace.");

            // toggle on "Basil. Eyes" from benoit's main menu.
            this.flags[kFLAGS.BENOIT_EYES_TALK_UNLOCKED] = 1;
            this.outputText("\n\n(<b>Basilisk Eyes option enabled in " + this.benoitMF("Benoit", "Benoite") + "'s menu!</b>)");
            this.doNext(this.camp.returnToCampUseOneHour);
            return;
        }
        // Basilisk Womb
        // Requires: Had sex with Benoit at least twice, have vagina, select talk
        if (((this.flags[kFLAGS.BENOIT_TIMES_SEXED_FEMPCS] > 2 && this.player.inte >= 60 && this.flags[kFLAGS.BENOIT_WOMB_TALK_UNLOCKED] == 0) || this.flags[kFLAGS.BENOIT_TIMES_SEXED_FEMPCS] == 2) && this.player.hasVagina()) {
            this.outputText("You ask " + this.benoitMF("Benoit", "Benoite") + " if " + this.benoitMF("he", "she") + " has ever thought about trying to do something to help his people's plight.");

            this.outputText("\n\nThe basilisk is silent for a time, running his claws along the counter pensively. \"<i>Yes,</i>\" " + this.benoitMF("he", "she") + " says eventually, in a quiet tone. \"<i>I 'ave. Away from ze mountains, I 'ave 'ad time to sink. I am not ze demons' slave anymore, and I am a funny joke of a basilisk anyway, so I 'ave often thought about... making certain zacrifices. If we 'ad just one female, away from zeir corruption, zen...</i>\" " + this.benoitMF("he", "she") + " trails off, sighing heavily before smiling ruefully at you. \"<i>Zose were ze kind of soughts I 'ad before I met you. Crazy, yes? Even more crazy to be still sinking zem when a good woman is giving me 'er love for no reason except through ze kindness of 'er 'art. Still... it is so frustrating, being able to sink clearly about zese sings and not being able to do anysing about it.</i>\"");

            if (this.player.inte >= 60) {
                this.outputText("\n\nYour mind wanders. You doubt that even if you wanted to you could turn into a basilisk proper, but you wonder if there's some kind of transformation that would allow a human womb to mimic that of another race.");
                this.outputText("\n\nBenoit answers warily. \"<i>A double dose of ovi-elixer, a bottle of reptilum, goblin ale and some basilisk blood would probably do... if you were so minded. But, [name], tell me you're not going to do somesing so reckless as experiment on your body?</i>\"");
                // toggle on "Bas. Womb" from benoit's main menu.
                this.flags[kFLAGS.BENOIT_WOMB_TALK_UNLOCKED] = 1;
                this.outputText("\n\n(<b>Basilisk Womb option enabled in Benoit's menu!</b>)");
            }
            else {
                this.outputText("\n\nYou rack your brain but can't think of anything that could help Benoit, so you end up simply sympathising with " + this.benoitMF("him", "her") + ". \"<i>Do not beat yourself up over it,</i>\" says the basilisk, touching the tips of your fingers and smiling warmly. \"<i>It is just foolishness. And anyway, I told you: we are a race of bastards. We are ze last guys who deserve someone sinking after us.</i>\"");
                // don't trigger event again until the PC is smart enough!
            }
            this.doNext(this.camp.returnToCampUseOneHour);
        }
        // First time Talk:
        else if (this.flags[kFLAGS.BENOIT_TALKED_TO_PROPERLY] == 0) {
            this.flags[kFLAGS.BENOIT_TALKED_TO_PROPERLY]++;
            this.outputText("You take a moment to look the strange merchant over. Although blind, " + this.benoitMF("he", "she") + " doesn't seem very old - " + this.benoitMF("he", "she") + " retains the tight, thin muscular frame of other basilisks you've seen, but looks to be slightly shorter and for all his proud, cruel profile seems slightly shabby around the edges. In what is presumably a nod towards civilized manners, " + this.benoitMF("he", "she") + " is wearing a pair of denim long johns as well as his fez, perched upon one of his head spines. You introduce yourself, and then decide to ask " + this.benoitMF("him", "her") + " about basilisks.");

            this.outputText("\n\n\"<i>We were a proud race once,</i>\" sighs Benoit. \"<i>A noble race, who carried our 'eads 'igh, and...</i>\" the blind basilisk bursts into throaty laughter, which eventually subsides into a coughing fit. You watch, bemused. \"<i>Hahaha! Aha. Sorry. No, we were always a race of egg-thieving bastards. The lizans,</i>\" " + this.benoitMF("he", "she") + " flicks his snout in the general direction of the bonfire with disdain, \"<i>absolutely 'ate us. Zey drove us to live in ze mountains, far away from zeir precious clutches, to live like savages. 'Ze family with ze evil eye over it', zat's what zey call us. Eh... in basilisk it's more snappy.</i>\" Benoit pauses, running his fingers over the counter ruminatively. \"<i>But it wasn't so bad, up zair. We kept ze harpies under control, and we collected scrap, sold it to zose who were brave enough to trade blindfolded. We've always been good at zat. Zen ze demons came to ze mountains.</i>\"");

            this.outputText("\n\nHe shrugs. \"<i>What were we going to do? Go down and throw ourselves on the mercy of the races 'oo despise us? Ze demons offered to set us high in zeir service, augment our natural abilities if we agreed to help zem. I suppose zey did, at zat.</i>\" Benoit scratches a long groove in his counter, trembling with anger. \"<i>By making us all male zey made sure we are always fixated on finding egg bearers, on keeping ze harpies down, and bringing scrap and statues to zem so zey don't do anysing worse to us. We are just a brainless natural defence to zem now, in zeir mountain hideaways. Don't go up ze mountain or ze evil basilisks will get you! Bastards. Bastards.</i>\" Benoit finishes mutilating the wood in front of " + this.benoitMF("him", "her") + " and sighs. \"<i>But zat is by ze by. Are you going to buy sumsing or not?</i>\"");
        }
        // First time Femoit talk
        else if (this.flags[kFLAGS.FEMOIT_TALKED_TO] == 0 && this.flags[kFLAGS.BENOIT_STATUS] != 0) {
            this.flags[kFLAGS.FEMOIT_TALKED_TO]++;
            this.outputText("You ask Benoite if she intends to go back to the mountains now. She laughs long and hard at this. One thing the transformation has certainly gifted her is an extraordinarily filthy laugh.");

            this.outputText("\n\n\"<i>Oh [name], you are so silly,</i>\" she says fondly. \"<i>'Ow long do you sink a blind female basilisk would last up zair, eh? If I was really lucky ze minotaurs would get me before ze demons did. No, I will stay ere. Ze uzzer basilisks, I cannot trust zem - zey are always exposed to ze corruption, some of zem even like it. I will lay eggs far away from zere, I will raise my children to be different; away from ze corruption and with equal numbers of males and females, it will be different. Zere are many empty places in zis world now zey can go to and be left alone.</i>\" She pauses. \"<i>Or at least zese sings will 'appen once I work up ze courage to find a, er, donor.</i>\"");

            if (!this.player.hasCock()) {
                this.outputText("You ask if she's had any thoughts on that front. \"<i>Not really,</i>\" Benoite sighs. \"<i>I 'ave many male customers but zey all 'ave - 'ow you say? Rough round edges. You now 'ow it is, [name], all men are pigs.</i>\" You both laugh at this. \"<i>I will find someone though, don't worry. As I said before...</i>\" she points two fingers at her blind eyes and then at the stall entrance. There's a distinct gleam in those cloudy grey depths you think would scare the hell out of most things with a penis. \"<i>I 'ave a purpose now.</i>\"");
            }
            else {
                this.outputText("\n\nYou ask if she's had any thoughts on that front. \"<i>Well, I do 'ave zis one customer 'oo seems very kind. And 'oo knows me a great deal better zan anyone else around 'ere,</i>\" Benoite mumbles, twiddling her fingers. \"<i>But zis person 'as already done a great deal for me, so I don't know if... per'aps zis is asking too much. I will find someone though, never fear. As I said before...</i>” Benoite points two fingers at her blind eyes and then at the stall entrance. There’s a distinct gleam in those cloudy grey depths you think would scare the hell out of most things with a penis. “<i>I ‘ave a purpose now.</i>");

                this.menu();
                this.doYesNo(this.femoitFirstTimeYes, this.femoitFirstTimeNo);
            }

            return;
        }
        else if (this.flags[kFLAGS.BENOIT_TALKED_TO_PROPERLY] != 0 && this.benoitAffection() >= 40 && this.flags[kFLAGS.FEMOIT_UNLOCKED] == 0) {
            this.femoitInitialTalk();
            this.doNext(this.camp.returnToCampUseOneHour);
            return;
        }
        // Subsequent Talk
        else {
            let choice: number;

            /* BUILD ZE CHOICES!*/
            const choices: any[] = [0, 1, 2, 3, 4, 5, 6, 7];
            // option 8 (cockatrice talk) only, if met harpies and basilisks before
            if (this.flags[kFLAGS.CODEX_ENTRY_HARPIES] > 0 && this.flags[kFLAGS.CODEX_ENTRY_BASILISKS] > 0) {
                choices[choices.length] = 8;
                if (this.flags[kFLAGS.COCKATRICES_UNLOCKED] <= 0) {
                    // higher chance, if not yet unlocked
                    choices[choices.length] = 8;
                }
            }
            // option 9 is non-lover non-fem only
            if (!this.benoitLover() && this.benoitMF("he", "she") == "he") choices[choices.length] = 9;
            // Special male benoit fucker only talks
            if (this.benoitLover() && this.benoitMF("he", "she") == "he" && this.player.hasVagina()) {
                choices[choices.length] = 10;
                choices[choices.length] = 11;
                choices[choices.length] = 12;
                choices[choices.length] = 13;
            }
            // Femoit specials
            if (this.flags[kFLAGS.BENOIT_STATUS] != 0) {
                choices.push(14);
                choices.push(15);
                if (this.benoitLover()) choices.push(16);
            }
            // trace("BENOIT CHOICE: " + choice);
            // Pick one and go!
            choice = choices[rand(choices.length)];
            // (Randomly generated)
            if (choice == 0) {
                this.outputText("You ask if all basilisks talk as " + this.benoitMF("he", "she") + " does.");
                this.outputText("\n\n\"<i>Only on zis side of ze mountain,</i>\" comes the reply. \"<i>Ze uzzer side are all stuck-up snobs who speak 'orribly. Zey are all pale and flabby too, and zeir cooking is terrible. Pwah!</i>\" " + this.benoitMF("He", "She") + " makes an exasperated gesture with a claw.");
            }
            else if (choice == 1) {
                this.outputText("You ask " + this.benoitMF("Benoit", "Benoite") + " about the dog.");
                this.outputText("\n\n\"<i>Pierre 'asn't been giving you trouble, as 'e? Big stupid mutt does not know 'is mouth from 'is arse. Which is why 'e checks so often,</i>\" says the basilisk fondly, rubbing the Alsatian behind his ear. \"<i>I found 'im prowling around eating scraps from ze food sellers when I first got ere; I sink 'e must 'ave belonged to anuzzer trader 'oo left " + this.benoitMF("him", "her") + " behind. I do not sink I could run this shop without " + this.benoitMF("him", "her") + " - every evening I go out into the wilds with " + this.benoitMF("him", "her") + " and 'unt down more salvage. 'Ee is so good at finding perfectly good sings other people 'ave left behind. Particularly cloze. 'E loves robes, Pierre. Don't you, boy?</i>\" Pierre whines.");
            }
            else if (choice == 2) {
                this.outputText("You ask " + this.benoitMF("him", "her") + " about the sign above the shop.");
                this.outputText("\n\n\"<i>It's good, isn't it?</i>\" the trader says proudly. \"<i>I got a catguy to do it when I first got 'ere and didn't know ze language so well. 'E suggested...</i>\" " + this.benoitMF("He", "She") + " spreads " + this.benoitMF("his", "her") + " claws expressively. \"<i>'Salamander's Salubrious Salvage'. Because, everyone likes salamanders, and once zey get in and realize I am not a salamander and it is just a play on words, zey would be so entranced by what I am selling zey would not care.</i>\" " + this.benoitMF("Benoit", "Benoite") + " taps the counter happily. \"<i>In gold print, too! It is a surprise it has not brought more customers in.</i>\"");
                this.outputText("\n\nYou decide not to disillusion the blind basilisk.");
            }
            else if (choice == 3) {
                this.outputText("You ask if " + this.benoitMF("he", "she") + " has always been blind.");
                this.outputText("\n\n\"<i>I don't know,</i>\" " + this.benoitMF("he", "she") + " says. \"<i>Ask me what red is.</i>\"");
                this.outputText("\n\nYou ask what red is.");
                this.outputText("\n\n\"<i>'Ow ze fuck should I know?</i>\" the basilisk replies, deadpan. \"<i>Stop asking stupid questions.</i>\"");
                this.outputText("\n\nYou decide not to pursue the subject.");
            }
            else if (choice == 4) {
                this.outputText("You ask " + this.benoitMF("Benoit", "Benoite") + " how " + this.benoitMF("he", "she") + " got into this line of work.");
                this.outputText("\n\n\"<i>I 'ave always worked with salvage,</i>\" " + this.benoitMF("he", "she") + " shrugs. \"<i>Back in ze mountains I worked in ze magpie room - obviously, because I was no good on ze outside. You can tell from ze weight of sings, and 'ow zey smell, what it is and 'ow much it is worth. More zan zat you can tell... what it meant to its last owner. Zat is ze true worse of an object.</i>\" " + this.benoitMF("He", "She") + " taps his claws on the counter, lost in thought. \"<i>Ze magpie room is amazing, [name], I wish I could show it to you. Such good acoustics, filled with ze sound and smell of a thousand pieces of junk - every day a new symphony. And 'oo would ever steal ze demons' treasures? You would 'ave to be mad to try to steal from a hall full of basilisks. Or blind.</i>\"");
                this.outputText("\n\n" + this.benoitMF("He", "She") + " laughs throatily, then sighs. \"<i>Ah, but it was rotten, really - always a sour note underneath everysing. A thousand basilisks, driven by nussing but greed and lust. I got sick of it, being stuck in zat place with zose thoughts, zat 'opeless cycle, and one day ran away. I took what I could carry and used zat to start up here. Away from ze mountains, I can zink clearly. I can say what ze uzzer basilisks only know at ze back of zeir minds.</i>\" " + this.benoitMF("Benoit", "Benoite") + " slams a fist into the counter, making you jump. \"<i>Don't ever make a deal with a demon, [name],</i>\" " + this.benoitMF("he", "she") + " says, voice thick with rage. \"<i>Even when you sink it is a win-win? Zey will still find a way to fuck you good.</i>\"");
                this.dynStats("cor", -1);
            }
            else if (choice == 5) {
                this.outputText("You ask Benoit if " + this.benoitMF("he", "she") + " can tell you anything about the Bazaar.");

                this.outputText("\n\n\"<i>You are really asking zis question to a blind person?</i>\" comes the reply. \"<i>Ok, I will tell you what I know, for what it is worth. Over zeir by ze fire, I know zeir are lizans having a good time, because zey shout insults when zey get really drunk. Zey would get violent with me I sink, if it weren't for Pierre. Zeir leader has a big problem with her male hormones, judging from ze way she smells.</i>\" " + this.benoitMF("He", "She") + " sniggers with a distinct lack of sympathy. \"<i>In ze uzzer direction, I can smell a lot of males together in one place. Smell like zey are doing something very macho - and a bit painful, from ze sound of zeir walk afterwards.</i>\" " + this.benoitMF("He", "She") + " points in the opposite direction. \"<i>Zerr are plenty of, ow you say, crumpets who work around here. Some of zem can do some pretty wild sings for you, for a fee. Or so I'm told.</i>\" " + this.benoitMF("He", "She") + " coughs.");
            }
            else if (choice == 6) {
                this.outputText("You ask " + this.benoitMF("Benoit", "Benoite") + " for any rumors going around.");
                // [Deep cave cleared:
                if (this.flags[kFLAGS.DEFEATED_ZETAZ] > 0) this.outputText("\n\n\"<i>Somesing strange did 'appen ze uzzer day, now you mention it,</i>\" " + this.benoitMF("he", "she") + " says, tapping a curved tooth. \"<i>I got a big group of imps in ere. I normally don't serve zem because zey are always stealing sings whilst one of zem is paying, but zese guys seemed too worked up to even sink about lifting ze shop - zey smelt of fear. Zey were buying lots of food and survival gear - one of zem kept going on and on about ze fact zey left \"<i>ze fairy</i>\" behind, until one of ze uzzers slapped 'im and said if 'ee didn't shut up, 'ee would be ze fairy.</i>\" " + this.benoitMF("Benoit", "Benoite") + " shrugs. \"<i>Nasty little sings. Tasty, though.</i>\"");
                // [Factory not cleared:
                else if (this.flags[kFLAGS.FACTORY_SHUTDOWN] <= 0) this.outputText("\n\n\"<i>Not anysing very interesting,</i>\" " + this.benoitMF("he", "she") + " shrugs. \"<i>I get a few customers from ze desert city, Tel'Adre, coming in 'ere in secret to pick up a few sings zey cannot find back 'ome. So zey are still a sing. You 'ave to wonder ow much longer zey can keep hiding, though.</i>\"");
                else {
                    // [Factory destroyed:
                    if (this.flags[kFLAGS.FACTORY_SHUTDOWN] == 2) {
                        this.outputText("\n\n\"<i>I don't know what is 'appening exactly,</i>\" " + this.benoitMF("he", "she") + " says, leaning over the counter. \"<i>But ze demons 'oo I trade with, zey seem very worked up about sumsing. Sumsing went wrong at one of zeir facilities, I sink. I also get a number of shark ladies coming in ere, asking if I sell fresh water. Zey also seem very unhappy.</i>\"");
                    }
                    else this.outputText("\n\n\"<i>I don't know what is 'appening exactly,</i>\" " + this.benoitMF("he", "she") + " says, leaning over the counter. \"<i>But ze demons 'oo I trade with, zey seem very worked up about somesing. Sumsing went wrong at one of zeir facilities, I sink. I also hear a number of passers-by talking about ze lake. Apparently it is much cleaner now; many are going back to use it for water. Now if only someone could make zose crazy cultists go away, eh?</i>\"");
                }
            }
            else if (choice == 7) {
                this.outputText("You ask if " + this.benoitMF("he", "she") + "'s ever had any trouble with the demons who frequent the Bazaar.");
                this.outputText("\n\n\"<i>Not really,</i>\" " + this.benoitMF("he", "she") + " replies. \"<i>I don't like zem, but zey are my main source of income. Zey are always coming in here to sell zeir fluids. The truth is it's worthless - I pour most of ze disgusting stuff away. But it is worth paying for zeir custom because zey are always buying many more potions. It isn't a good demon party unless you 'ave sprouted two new dicks and four new nipples for it, apparently. Always one of zem is asking if zey can 'do ze dinosaur' as way of payment. I 'ate zem so much.</i>\"");
                if (this.silly()) this.outputText("\n\nThe basilisk rubs Pierre behind the ear as " + this.benoitMF("he", "she") + " thinks. \"<i>I did once get a group of demons coming in ere, asking me what 'cheese omelette' is in basilisk. When I told zem, zey ran away laughing, shouting 'Zat is all you can say! Zat is all you can say!'</i>\" " + this.benoitMF("He", "She") + " shrugs, irritated. \"<i>Arseholes.</i>\"");
            }
            else if (choice == 8) {
                this.outputText("You ask [benoit name] what results when basilisks mate with harpies.");
                this.outputText("\n\n\"<i>Most of ze time? Basilisks,</i>\" [benoit ey] replies, carefully counting gems with [benoit eir] fingers."
                    + " \"<i>Some of ze time? 'Arpies. But ze arpies feed zeir basilisk children to zeir chicks if ze former do not get away"
                    + " in time, so it works out. Really, we are doing zem and ze world a favor by stealing zeir eggs - if we weren't around ze"
                    + " 'ole world would be drowned in guano by now.</i>\" Satisfied with the takings, [benoit ey] stows the money away underneath"
                    + " the counter. \"<i>Very rarely, you get cockatrices. Now ZEY are weird-looking.</i>\"");
                if (this.flags[kFLAGS.COCKATRICES_UNLOCKED] <= 0) {
                    this.outputText("\n\n<b>Perhaps you should try to find one of these elusive hybrids."
                        + " You suspect the high mountains would be the best place to look.</b>");
                    this.flags[kFLAGS.COCKATRICES_UNLOCKED] = 1;
                }
            }
            else if (choice == 9) {
                // non-lover non-fem only
                this.outputText("You ask if " + this.benoitMF("Benoit", "Benoite") + " really can tell who you are just by smell.");

                if (this.player.race == "human") this.outputText("\n\n\"<i>Certainly!</i>\" " + this.benoitMF("he", "she") + " smiles. \"<i>Ze smell of shaved monkey is distinctive. I get very few 'uman customers, you know.</i>\" The basilisk scratches " + this.benoitMF("his", "her") + " jaw absent-mindedly. \"<i>If you do not mind me saying so, [name], you also smell... different. Like you do not really belong 'ere. In ze nicest possible way, of course.</i>\"");
                else this.outputText("\n\n\"<i>Certainly!</i>\" " + this.benoitMF("he", "she") + " smiles. \"<i>Ze smell of shaved monkey is distinctive. I get very few 'uman customers, you know.</i>\" You look down at yourself, then back at the basilisk suspiciously, before saying you don't much look or feel human. \"<i>Oh, I do not doubt zat,</i>\" says the trader. \"<i>You 'umans and your flexible genes - zat makes you very alluring, as I am sure you 'ave already noticed, eh? I am sure somebody 'oo relied upon sight would not be able to tell you are 'uman. But 'oo you are underneath all zat, zat never changes, and I can smell zat. All you are doing really is dressing up as something else. If you wanted to, you could change back tomorrow, if you 'ad ze right ingredienns.</i>\"");
                // [(male Benoit only)
                if (this.benoitMF("he", "she") == "he") this.outputText(" There's a hint of longing jealousy in the basilisk's voice and when " + this.benoitMF("he", "she") + " lapses into silence you decide not to push the subject.");
            }
            // Male Benoit Lover Talk options
            // (Randomly generated.  Added to normal talk options after PC has had sex with Benoit two times or more regardless of womb quest.)
            else if (choice == 10) {
                this.outputText("You ask Benoit there is anything useful " + this.benoitMF("he", "she") + " can tell you about the demon strongholds.");

                this.outputText("\n\n\"<i>I'm afraid I cannot be very 'elpful zeir, [name],</i>\" " + this.benoitMF("he", "she") + " sighs. \"<i>Unless you want me to tell you what zey smell like. I do not sink you want to be knowing zis. Ze demons, zey were not much in ze business of telling us what zeir plans were, and zey did not much like 'anging around us, which is understandable.  Zair is every treasure you can ever imagine in ze magpie room, but zeir is no way you could ever get at zem unless you could work out some way of making many undreds of basilisks close zeir eyes at once.</i>\"");
            }
            else if (choice == 11) {
                this.outputText("You ask Benoit if " + this.benoitMF("he", "she") + " can suggest anything to help you fight his brethren in the high mountains.");
                this.outputText("\n\n\"<i>You could carry a mirror with you,</i>\" " + this.benoitMF("he", "she") + " says, pointing. \"<i>There's one over zair, isn't zair?</i>\" You report that it is cracked badly - at any rate, you're not carrying a bulky mirror up a mountain two or three times a day. \"<i>I will give it to you half price,</i>\" " + this.benoitMF("he", "she") + " says hopefully. \"<i>Sink 'ow useful it will be to check for transformations! You could get somebody else to carry it for you... ok, alright, so you don't want ze mirror. Most prey, my bruzzers are expecting zem to lash out in a panic. So use sings which do not involve approaching. We do not like magic or ranged sings, zey are too unpredictable - I suggest using zem.</i>\"");
            }
            else if (choice == 12) {
                this.outputText("\"<i>Gnoll.</i>\"");
                this.outputText("\n\n You make a gentle humming noise.");
                this.outputText("\n\n\"<i>Bee maiden,</i>\" says Benoit after a moment.");
                this.outputText("\n\nYou stamp your feet and snuffle and snort.");
                this.outputText("\n\n\"<i>Minotaur,</i>\" says Benoit immediately. You sigh - " + this.benoitMF("he", "she") + "'s too good at this game, and you're running out of creatures. Thinking briefly, you make a clop-clopping whilst slapping the counter, throwing in a bit of heavy breathing for good measure.");

                this.outputText("\n\n\"<i>What ze 'ell is zat supposed to be?</i>\" says Benoit, looking alarmed. You tell him it's a ");
                this.outputText("Unitaur.");
                this.outputText("\n\n\"<i>A what?</i>\"");

                this.outputText("\n\nYou explain that a Unitaur is like a white centaur, only it has a horse's face. It has massively strong human arms though, and it can cast magic better than anyone, and it can go faster than a cheetah, and... you can't help yourself and begin to giggle at the expression of terror that has emerged on Benoit's face.");

                this.outputText("\n\n\"<i>Oh, I see. You are pulling my tail. Very amusing.</i>\" You laugh even harder at the expression of wounded dignity which replaces the terror.");
            }
            else if (choice == 13) {
                this.outputText("You ask Benoit if " + this.benoitMF("he", "she") + " really, <b>really</b> can tell who you are just by smell.");

                this.outputText("\n\n\"<i>Well, of course I can,</i>\" " + this.benoitMF("he", "she") + " says teasingly. \"<i>When you end up smelling like someone else for several hours, it is a difficult sing to mistake. It is a memento of you and it reminds me of 'appiness; I wish I could smell zat way for longer. My sexy little shaved monkey.</i>\"");
            }
            else if (choice == 14) {
                this.outputText("You ask Benoite how she’s getting on with being the opposite sex. Benoite stops cleaning the tarnished silver plate in her hands to think.");

                this.outputText("\n\n“<i>It is... different,</i>” she says eventually, before laughing at the platitude. “<i>Ze ‘ole wizzing situation, zis is terrible for instance. I do not know [name], I am so busy during ze day and it ‘appened so suddenly, it is difficult to properly reflect. Sometimes I am sinking somesing, like ‘ow somesing smells, and zen I catch myself sinking... would Benoit ‘ave sought zat? Is my perception different because I ‘ave different ‘ormones swirling around my ‘ead?</i>” She turns the plate around in her hands absently. “<i>Zerr are... uzzer sings, too. Sometimes I am smelling a customer is finding me strange, and I realize I am doing somesing which is... male. Like, somesing I would never ‘ave sought about before, walking with feet splayed instead of in a line. A ‘undred and one sings to remember to not stand out. Zat is wearying.</i>”");

                if (this.benoitLover() && this.player.hasCock() && this.player.hasVagina()) this.outputText("\n\nShe smiles shyly at you. “<i>I am very lucky in one respect zo, because I ‘ave not ‘ad to resink what I find attractive to lie wizz you. Whatever you ‘ave between your legs you smell and feel female to me, and zat is a comfort.</i>”");
                else if (this.benoitLover() && this.player.hasCock() && !this.player.hasVagina()) {
                    this.outputText("She smiles shyly at you. “<i>One sing I ‘ave definitely ‘ad to resink is what I find attractive. I did not find ze male form attractive before, so for my body to... respond... when you are close, zat is when I most feel ze disconnect between my experience and what I am now. Per’aps zis is also why I ‘ave not sought about it too much; it is better just to rely on instinct.</i>”");
                    this.outputText("\n\nCharming, you say.");
                    this.outputText("\n\nBenoite grins wider at your affected hurt. “<i>Oh do not worry [name], you ‘ave a beautiful personality. And ow important exactly do you sink your personal appearance is to me?</i>”");
                }
                else {
                    this.outputText("\n\nShe smiles shyly at you. “<i>Listen to me, ow you say, riveting on. You I am guessing do not see what ze big fuss is- you ‘umans can chop and change whenever you feel like, so to speak. Must be nice.</i>”");
                    this.outputText("\n\nYou point out that your mutability is not always an advantage- it can be used against you, and this land is full of types who would be only too keen to do so.");
                    this.outputText("\n\nBenoite nods thoughtfully. “<i>I never sought about it like zat. Ze demons just love slaves zey can change wizzer a few potions, don’t zey? You are right [name], I will count my blessings in ze future.</i>”");
                }
            }
            else if (choice == 15) {
                this.outputText("\n\nYou ask Benoite if she isn’t worried that demon customers won’t notice what she is.");

                this.outputText("\n\n“<i>Zat is why I am wearing zis cunning disguise,</i>” she says, patting her large beret. She lowers her voice to a growl. “<i>And I talk like zis when I am serving zem. Grr. To be honest I do not sink I ‘ave to be worrying much,</i>” she goes on in her normal tone, tightening her apron. “<i>Most of ze demons 'oo come 'ere are not very bright, zey are not very interested in anysing except when zey are next banging zair bits together. Also I sink most mammals are 'aving trouble telling ze difference between male and female reptiles wizzout looking closely. Am I right?</i>” She grins her long, meandering smile at you and you take her point.");
            }
            else if (choice == 16) {
                this.outputText("You ask Benoite if she really can tell who you are just by smell.");

                this.outputText("\n\n“<i>Well, of course I can, zilly,</i>” she says teasingly. “<i>When you end up smelling like someone else for several hours, it is a difficult sing to mistake. It is a memento of you and it reminds me of appiness; I wish I could smell zat way for longer. My sexy little shaved monkey.</i>”");
            }

            // Hair pin talk
            if (this.player.hasKeyItem("Feathery hair-pin") >= 0 && (debug || this.flags[kFLAGS.BENOIT_HAIRPIN_TALKED_TODAY] == 0)) {
                this.doNext(this.benoitHairPinTalk);
                return;
            }
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    private benoitHairPinTalk(): void {
        // On a new page, since it may trigger the hair TF.
        this.clearOutput();
        this.credits.authorText = "MissBlackthorne";
        this.outputText("You ask " + this.benoitMF("Benoit", "Benoite") + " about the feathery hair-pin he gave to you.");
        this.outputText("\n\n\"<i>Ah, ze pin? It iz a 'eirloom from my mozzers side. I suspect it 'as simply been thrown down through generations, none"
            + " wanting sumsing zat was more complex zan a shiny object. I think it 'as escaped ze taint, simply because of zis. I kept it to sell,"
            + " but a better use 'as come for it. Maybe I am just sentimental, but I 'ope it reminds you of all you 'ave done for ze basilisks, and"
            + " for me.</i>\"");
        this.benoitHairPinTFCheck();
    }

    private benoitHairPinTFCheck(): void {
        if (this.player.cor < 30 && this.player.isFemaleOrHerm() && this.player.featheryHairPinEquipped() && [Hair.BASILISK_PLUME, Hair.GOO].indexOf(this.player.hair.type) == -1) {
            this.outputText("\n\nYou feel the hair pin " + this.benoitMF("Benoit", "Benoite") + " gave you heat up, a gentle warmth suffusing through your body."
                + " Something tells you that if you let it, this feminine hair piece will evoke some sort of change.");
            this.outputText("\n\nDo you let it?");
            this.menu();
            this.addButton(0, "No", this.benoitHairPinTFNo);
            this.addButton(1, "Yes", this.benoitHairPinTFYes);
            return;
        }

        this.benoitHairPinTalkFinal();
    }

    private benoitHairPinTFNo(): void {
        this.outputText("\n\nYou take out the hair pin for a while, the feeling fading as soon as you do so.");
        this.benoitHairPinTalkFinal();
    }

    private benoitHairPinTFYes(): void {
        this.outputText("\n\nYou let the feeling be, wondering what it will do. Soon your head begins to tickle and you reach up to scratch at it, only to be"
            + " surprised by the softness you feel. It reminds you of the down of baby chickens, velvety soft and slightly fluffy. You look at"
            + " yourself in a nearby puddle and gasp, where your hair once was, you now have red feathers, some longer and larger than others."
            + " This floppy but soft plume sits daintily on your head, reminding you of a ladies fascinator. You realise soon"
            + this.benoitMF(" that your hair has changed into a plume of feathers that, like legend is told, belongs to a female basilisk!",
                " that you have a plume, like a female basilisk!"));

        if (this.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] != 0)
            this.outputText("\n\n<b>Your hair is growing again and is now a plume of short red feathers.</b>");
        else
            this.outputText("\n\n<b>Your hair is now a plume of short red feathers.</b>");

        this.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] = 0;
        this.player.hair.length = 2;
        this.player.hair.color = "red";
        this.player.hair.type = Hair.BASILISK_PLUME;
        this.benoitHairPinTalkFinal();
    }

    private benoitHairPinTalkFinal(): void {
        this.dynStats("cor", -(this.player.featheryHairPinEquipped() ? 10 : 5));
        this.flags[kFLAGS.BENOIT_HAIRPIN_TALKED_TODAY] = 1;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Male Benoit x Female PC Interactions
    // First talk
    // Requires: PC has oviposition/ovi-elixered/in heat, Affection 35+
    private benoitAndFemPCTalkAboutEggings(): void {
        this.clearOutput();
        this.flags[kFLAGS.BENOIT_SUGGEST_UNLOCKED] = 1;
        this.outputText("" + this.benoitMF("Benoit", "Benoite") + " seems very on edge today. " + this.benoitMF("He", "She") + " paces up and down, returns your greeting with a stiff nod, and fiddles endlessly with the stock in reach of " + this.benoitMF("his", "her") + " counter as you search for a topic. You ask if there's something wrong.");

        this.outputText("\n\n\"<i>Nuzzing!</i>\" " + this.benoitMF("he", "she") + " barks angrily. " + this.benoitMF("He", "She") + " coughs. \"<i>Nussing,</i>\" " + this.benoitMF("he", "she") + " says in a calmer tone. You wait. \"<i>It's just... ze way your body is right now,</i>\" " + this.benoitMF("he", "she") + " says eventually. \"<i>It...speaks to me. But zis is my problem,</i>\" " + this.benoitMF("he", "she") + " goes on, straightening " + this.benoitMF("his", "her") + " neck and nervously tapping " + this.benoitMF("his", "her") + " claws on the counter. \"<i>And I am not myself if I cannot control myself. Please, [name], ask your questions.</i>\" You look at the sad, proud basilisk and wonder when exactly the last time " + this.benoitMF("he", "she") + " got laid was.");

        this.outputText("\n\n(\"<i>Suggest</i>\" option added to " + this.benoitMF("Benoit", "Benoite") + "'s menu.)");
    }

    // Suggest:
    private eggySuggest(): void {
        this.clearOutput();
        if (this.flags[kFLAGS.BENOIT_TESTED_BASILISK_WOMB] == .5) {
            this.suggestSexAfterBasiWombed(true);
            return;
        }
        if (this.flags[kFLAGS.BENOIT_TIMES_SEXED_FEMPCS] > 0) {
            if (this.player.isTaur()) {
                this.outputText("You silently reach across the counter to squeeze " + this.benoitMF("his", "her") + " hands again. " + this.benoitMF("Benoit", "Benoite") + " grins with deep affection at you and, hand in hand, the two of you quietly debunk to the store room again.");
                this.outputText("\n\nOnce again, you carefully inch your blind charge to a clear cranny and push " + this.benoitMF("him", "her") + " against a wooden wall, standing back to slowly peel off your [armor]. You grin as you ostentatiously drop each piece onto the packed earth, allowing " + this.benoitMF("him", "her") + " to guess what it is by the sound it makes. " + this.benoitMF("His", "Her") + " breathing comes heavier as your undergarments make a feathery sound as they fall. As you take " + this.benoitMF("his", "her") + " hands and lay them upon your naked skin, you think about how you want to go about this.");
            }
            else {
                this.outputText("You silently reach across the counter to squeeze " + this.benoitMF("his", "her") + " hands again. " + this.benoitMF("Benoit", "Benoite") + " beams at you and, hand in hand and without a word, the two of you depart to the store room again.");

                this.outputText("\n\nOnce again, you carefully inch your blind charge to a clear cranny and push " + this.benoitMF("him", "her") + " against a wooden wall, standing back to slowly peel off your [armor]. You grin as you ostentatiously drop each piece onto the packed earth, allowing " + this.benoitMF("him", "her") + " to guess what it is by the sound it makes. " + this.benoitMF("His", "Her") + " breathing comes heavier as your undergarments make a feathery sound as they fall. As you take " + this.benoitMF("his", "her") + " hands and lay them upon your naked skin, you think about how you want to go about this.");
            }
            this.menu();
            this.addButton(0, "Let " + this.benoitMF("Him", "Her") + "", this.repeatSexWithBenoitLetHim);
            this.addButton(1, "Take Charge", this.repeatBenoitFuckTakeCharge);
            return;
        }
        this.flags[kFLAGS.BENOIT_TIMES_SEXED_FEMPCS]++;
        if (this.player.isTaur()) {
            // Suggest:
            this.outputText("You reach your fingers across the counter and lightly touch " + this.benoitMF("Benoit", "Benoite") + "'s hands, saying you don't mind working out a few natural urges, if " + this.benoitMF("he", "she") + "'s in the mood.");
            this.outputText("\n\n“You- I- what?” " + this.benoitMF("he", "she") + " replies, looking slightly stunned. “You don't? Are you...I don't know if...” you reach across and squeeze " + this.benoitMF("Benoit", "Benoite") + "'s hands until " + this.benoitMF("his", "her") + " nervous babble dies out and hesitantly, " + this.benoitMF("he", "she") + " squeezes back. Still holding " + this.benoitMF("his", "her") + " hand, you move behind the crates and then gently lead " + this.benoitMF("him", "her") + " behind the stall's canopy.");
            this.outputText("\n\nWhat passes for " + this.benoitMF("Benoit", "Benoite") + "'s back office is perfect for your purposes; the two wagons between which " + this.benoitMF("his", "her") + " stall is sandwiched close together here and the triangular space is filled with crates and unsorted salvage. You carefully inch your blind charge to a clear cranny and push " + this.benoitMF("him", "her") + " against a wooden wall, standing back to slowly peel off your " + this.player.armorName + ". You grin as you ostentatiously drop each piece onto the packed earth, allowing " + this.benoitMF("him", "her") + " to guess what it is by the sound it makes. " + this.benoitMF("His", "Her") + " breathing comes heavier as your undergarments make a feathery sound as they fall.");
            this.outputText("\n\n“Zis will sound strange,” says " + this.benoitMF("Benoit", "Benoite") + " in a thick voice, “But- would you mind if I just touched you a bit first? All I know about you is ze sound of your voice.” You acquiesce and draw close, taking " + this.benoitMF("his", "her") + " hands once again and gently laying them upon you. You sigh as, holding " + this.benoitMF("his", "her") + " index claws back, " + this.benoitMF("he", "she") + " begins to move them slowly up and down.");
            this.outputText("\n\n" + this.benoitMF("His", "Her") + " warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel like you're being read like a book in Braille. “Good Gods,” " + this.benoitMF("he", "she") + " murmurs as " + this.benoitMF("his", "her") + " hands lead back onto your flanks. “Good Gods!” " + this.benoitMF("he", "she") + " cries out as " + this.benoitMF("he", "she") + " follows you all the way back to your mighty, powerful rear. “I knew you were a 'taur because of all ze stomping,” " + this.benoitMF("he", "she") + " says, rubbing your side back and forth in wonder. “But to know it and actually feel it, zey are somesing very different.” " + this.benoitMF("He", "She") + " sighs. “I 'ope you do not mind zis being a bit... awkward, but I am guessing you are probably used to zat by now, yes?”");
            // Herm:
            if (this.player.gender == 3) {
                this.outputText("\n\n" + this.benoitMF("His", "Her") + " hands travel down your behind until, with a sharp intake of breath, " + this.benoitMF("he", "she") + " touches [oneCock]. “Aren't you just full of surprises,” " + this.benoitMF("he", "she") + " says dryly. After a pause, " + this.benoitMF("he", "she") + " slowly wraps " + this.benoitMF("his", "her") + " dry, smooth grasp around your semi-erect cock and moves it up and down, rubbing and coiling you until you are straining.");
                // [cock 10 inches or less:
                if (this.player.longestCockLength() <= 10) this.outputText(" Although this is evidently an uncanny experience for " + this.benoitMF("him", "her") + ", " + this.benoitMF("he", "she") + " does manage a cocky smile as " + this.benoitMF("his", "her") + " hand moves around your male sex. “Mine is bigger,” " + this.benoitMF("he", "she") + " teases. Unable to reward " + this.benoitMF("his", "her") + " cheek from where " + this.benoitMF("he", "she") + " is, you simply snort and shuffle your hooves, impatient now with need.");
                // [cock  >10 inches:
                else this.outputText(" This is evidently an uncanny experience for " + this.benoitMF("him", "her") + ", the alien nature of it deepening as " + this.benoitMF("his", "her") + " hands moves around your male sex. “Oly Gods [name], you are a monster,” " + this.benoitMF("he", "she") + " says thickly. You smile and stamp your hooves, impatient now with need.");
            }
            this.outputText("\n\n" + this.benoitMF("His", "Her") + " hands trail upwards, moving over your bestial behind, exploring your soft flesh until " + this.benoitMF("he", "she") + " touches your lips. You close your eyes and sigh as " + this.benoitMF("he", "she") + " slowly parts them with " + this.benoitMF("his", "her") + " smooth fingers and slides into your [vagina]. Although " + this.benoitMF("his", "her") + " breath is becoming increasingly heavy " + this.benoitMF("he", "she") + " also seems genuinely curious about you; with surprising gentleness " + this.benoitMF("his", "her") + " fingers travel over and around your moistening sex, exploring your every fold, working deeper and deeper as " + this.benoitMF("he", "she") + " does. You let " + this.benoitMF("him", "her") + " know what pleases you by sighing when " + this.benoitMF("he", "she") + " touches a sweet spot, moving deliberately with " + this.benoitMF("his", "her") + " finger's motions so " + this.benoitMF("he", "she") + " may give them better attention. " + this.benoitMF("He", "She") + " soon finds your [clit], beginning to bulge with need; slowly " + this.benoitMF("he", "she") + " circles it and then flicks at it, gently frigging you.");
            // [In heat:]
            if (this.player.inHeat) this.outputText(" By now your vagina is practically gushing, your bodies' own deep seated pheromone need stoked to blazing heights by the basilisk's gentle, painstaking exploration of your body. You cannot stop thrusting yourself against " + this.benoitMF("his", "her") + " soaked hand, announcing how badly you want this with heavy moans.");

            this.outputText("\n\nThe scent of your arousal is in the air and as " + this.benoitMF("Benoit", "Benoite") + " breathes it in " + this.benoitMF("his", "her") + " own breath comes heavier. " + this.benoitMF("His", "Her") + " erection bulges in " + this.benoitMF("his", "her") + " long johns and you decide it's time for you to take charge; you back up, butting " + this.benoitMF("him", "her") + " insistently with your powerful body until you have " + this.benoitMF("him", "her") + " pinned against a space upon the opposite wall. You watch " + this.benoitMF("him", "her") + " over your shoulder as " + this.benoitMF("he", "she") + " unbuckles himself and lets " + this.benoitMF("his", "her") + " trousers fall. Stoked by the pheromones simmering off your body, " + this.benoitMF("his", "her") + " long, thin purple erection is straining and " + this.benoitMF("he", "she") + " arches " + this.benoitMF("his", "her") + " back and opens " + this.benoitMF("his", "her") + " mouth as you flare your [butt] and press yourself against it. You know just from looking at " + this.benoitMF("his", "her") + " intense arousal you're going to have to go slow to stop " + this.benoitMF("him", "her") + " from shooting " + this.benoitMF("his", "her") + " bolt straight away; with a wicked smile your partner can't see, you suppose such is your effect on " + this.benoitMF("him", "her") + " it may not even matter if " + this.benoitMF("he", "she") + " does. Still, as " + this.benoitMF("he", "she") + " lays " + this.benoitMF("his", "her") + " hands upon your flanks, and you lean back with a sigh and slowly slide " + this.benoitMF("his", "her") + " length into your moistened [vagina] as gently as you can.");
            this.player.cuntChange(12, true, true, false);
            this.outputText("\n\nBenoit's dick is incredibly smooth and you move down onto it with incredible, slick ease. Rather than burying yourself onto it straight away you stop with only a third of it in your wet depths and slowly bring it out of you, dipping yourself slowly. You stop with " + this.benoitMF("his", "her") + " sensitive head just inside and work your [hips] around deliberately, sighing as it rotates slowly around your slick walls. " + this.benoitMF("Benoit", "Benoite") + " moans dryly and you feel " + this.benoitMF("his", "her") + " body tense; immediately you stop your movements and wait, only gradually beginning to gyrate and thrust again when " + this.benoitMF("he", "she") + " has calmed down. You slide more of " + this.benoitMF("him", "her") + " into you when you bend forwards again, this time leaving only " + this.benoitMF("his", "her") + " base outside of you; you sigh as you feel " + this.benoitMF("him", "her") + " creeping further into your moist depths. " + this.benoitMF("He", "She") + " makes a bestial noise and tries to thrust himself into you and upon you; tutting mockingly, you pull yourself away from " + this.benoitMF("him", "her") + " and stop moving until, with what is evidently a huge force of will, the basilisk calms himself, backs himself against the wall and allows you to work " + this.benoitMF("him", "her") + ".");

            // [Small capacity:
            if (this.player.vaginalCapacity() <= 30) this.outputText("\n\nYou slide back down onto " + this.benoitMF("him", "her") + ", cooing this time as you feel " + this.benoitMF("him", "her") + " bottom out with several inches of " + this.benoitMF("him", "her") + " still outside of you. " + this.benoitMF("His", "Her") + " thin, long length could not be more perfect for your tight sex; " + this.benoitMF("he", "she") + " rubs your walls up and down as you dreamily thrust in and out of " + this.benoitMF("his", "her") + " body, sending waves of pleasure flowing through you.");
            // Large capacity:
            else this.outputText("\n\nYou slide back down onto " + this.benoitMF("him", "her") + ", cooing this time as your groin meets " + this.benoitMF("his", "her") + " muscled thighs with a wet kiss, your sex swallowing " + this.benoitMF("his", "her") + " cock whole. You begin to ride " + this.benoitMF("him", "her") + " hard and slow, bending " + this.benoitMF("his", "her") + " cock upwards to push at your sensitive walls, waves of pleasure starting to flow through you.");

            this.outputText("\n\nYou keep at this slow ride for what feels like hours, stopping and starting, pulling and pushing deliberately to keep the basilisk you have backed into a corner under your control. The pace of the fuck is clearly agonising for " + this.benoitMF("Benoit", "Benoite") + "; " + this.benoitMF("he", "she") + " pants, tenses and gasps to the wet movement of your [vagina], " + this.benoitMF("his", "her") + " face and chest red with extreme arousal, but " + this.benoitMF("he", "she") + " lets you stay in control, eventually unable to do anything but lie back and let you have your way with " + this.benoitMF("him", "her") + ".");
            // [Lactation:
            if (this.player.lactationQ() >= 50) this.outputText(" The slow, sensual sex is enough for you to begin to bead milk from your sensitive [nipples]; you moan as the flow intensifies until you are instinctively kneading your [chest], spurting your sweet, warm fluids onto the floor. " + this.benoitMF("Benoit", "Benoite") + " starts in genuine amazement at the sound. “Mammals are so damn weird,” " + this.benoitMF("he", "she") + " mutters, making you giggle.");

            this.outputText("\n\nYour lust ratchets up as " + this.benoitMF("his", "her") + " warm hands continue to move over your behind, and at last losing your discipline you begin to thrust into " + this.benoitMF("him", "her") + " with abandon, eager now for your peak. " + this.benoitMF("Benoit", "Benoite") + " pants as you really begin to fuck " + this.benoitMF("him", "her") + " and thrusts with you; the wetness of your arousal spatters against " + this.benoitMF("his", "her") + " thighs as your body slaps into the basilisk's tight muscles. " + this.benoitMF("He", "She") + " makes a harsh, bestial noise when " + this.benoitMF("he", "she") + " cums; " + this.benoitMF("his", "her") + " blind eyes roll as " + this.benoitMF("he", "she") + " clutches your back and shoots surge after surge of cum into your churning depths. The warmth of " + this.benoitMF("his", "her") + " jizz and " + this.benoitMF("his", "her") + " helpless bucking thrust you to your own orgasm; irrepressible pulses of pleasure overwhelm your mind and you can do nothing for long minutes except cry and squeal against the basilisk, clutching " + this.benoitMF("him", "her") + " back as you work " + this.benoitMF("his", "her") + " dick for every last drop.");
            if (this.player.gender == 3) this.outputText(" [EachCock] thickens and spurts in sympathy to your female high, spattering the floor with white paint.");
        }
        else {
            this.outputText("You reach your fingers across the counter and lightly touch " + this.benoitMF("Benoit", "Benoite") + "'s hands, saying you don't mind working out a few natural urges, if " + this.benoitMF("he", "she") + "'s in the mood.");

            this.outputText("\n\n\"<i>You - I - what?</i>\" " + this.benoitMF("he", "she") + " replies, looking slightly stunned. \"<i>You don't? Are you... I do not know if...</i>\" You reach across and squeeze " + this.benoitMF("Benoit", "Benoite") + "'s hands until " + this.benoitMF("his", "her") + " nervous babble dies out and hesitantly, " + this.benoitMF("he", "she") + " squeezes back. Still holding " + this.benoitMF("his", "her") + " hand, you move behind the crates and then gently lead " + this.benoitMF("him", "her") + " behind the stall's canopy.");

            this.outputText("\n\nWhat passes for " + this.benoitMF("Benoit", "Benoite") + "'s back office is perfect for your purposes; the two wagons between which " + this.benoitMF("his", "her") + " stall is sandwiched close together here and the triangular space is filled with crates and unsorted salvage. You carefully inch your blind charge to a clear cranny and push " + this.benoitMF("him", "her") + " against a wooden wall, standing back to slowly peel off your [armor]. You grin as you ostentatiously drop each piece onto the packed earth, allowing " + this.benoitMF("him", "her") + " to guess what it is by the sound it makes. " + this.benoitMF("His", "Her") + " breathing comes heavier as your undergarments make a feathery sound as they fall.");

            this.outputText("\n\n\"<i>Zis will sound strange,</i>\" says " + this.benoitMF("Benoit", "Benoite") + " in a low, thick voice, \"<i>But - would you mind if I just touched you a bit first? All I know about you is your smell and ze sound of your voice.</i>\" You acquiesce and draw close, taking " + this.benoitMF("his", "her") + " hands once again and gently laying them upon your body. You sigh as, holding " + this.benoitMF("his", "her") + " index claws back, " + this.benoitMF("he", "she") + " begins to move them slowly up and down.");

            // [Demon:
            if (this.player.horns.value > 0 && this.player.horns.type == Horns.DEMON && this.player.tail.type == Tail.DEMONIC && this.player.demonScore() >= 3) this.outputText("\n\n" + this.benoitMF("His", "Her") + " warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. " + this.benoitMF("He", "She") + " touches your horns and pauses; " + this.benoitMF("he", "she") + " reaches around, finds and grips your tail, running " + this.benoitMF("his", "her") + " pads up to the spaded point. \"<i>So,</i>\" " + this.benoitMF("he", "she") + " says quietly. \"<i>You are one of zem.</i>\" " + this.benoitMF("He", "She") + " is silent for a while before finding a warm smile. \"<i>But I am being silly. I know you are different inside.</i>\"");
            // [Dog enough for ears and tail:
            else if (this.player.ears.type == Ears.DOG && this.player.tail.type == Tail.DOG && this.player.dogScore() >= 3) this.outputText("\n\n" + this.benoitMF("His", "Her") + " warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. " + this.benoitMF("He", "She") + " grins as " + this.benoitMF("he", "she") + " finds your floppy ears and outright laughs when " + this.benoitMF("he", "she") + " reaches around and touches your tail. \"<i>I like dogs, but not ZAT much, [name],</i>\" " + this.benoitMF("he", "she") + " laughs.");
            // [Cat/Bunny enough for ditto:
            else if (this.player.catScore() >= 3 && this.player.tail.type == Tail.CAT && this.player.ears.type == Ears.CAT) this.outputText("\n\n" + this.benoitMF("His", "Her") + " warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. " + this.benoitMF("He", "She") + " grins as " + this.benoitMF("he", "she") + " finds your ears, outright laughs when " + this.benoitMF("he", "she") + " reaches around and touches your soft tail. \"<i>I always wondered why Pierre gets all excited when 'e sees you,</i>\" " + this.benoitMF("he", "she") + " chuckles huskily.");
            // [Avian with wings and feet:
            else if (this.player.lowerBody.type == LowerBody.HARPY && this.player.wings.type == Wings.FEATHERED_LARGE) this.outputText("\n\n" + this.benoitMF("His", "Her") + " warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. " + this.benoitMF("He", "She") + " finds your wings and follows them up as far as " + this.benoitMF("he", "she") + " can reach, making you twitch as " + this.benoitMF("he", "she") + " caresses your delicate pinfeathers; " + this.benoitMF("he", "she") + " carefully shifts " + this.benoitMF("his", "her") + " feet forward to touch at your own clawed toes. \"<i>So,</i>\" " + this.benoitMF("he", "she") + " sighs, a smile playing on " + this.benoitMF("his", "her") + " lips as " + this.benoitMF("he", "she") + " touches your shoulder. \"<i>What is in front of me is a terrible 'arpy. Come from ze skies to ravish me.</i>\"");
            // [Reptile/Naga:
            else if (this.player.hasReptileScales() && (this.player.lizardScore() >= 3 || this.player.nagaScore() >= 3) || this.player.dragonScore() >= 3) this.outputText("\n\n" + this.benoitMF("His", "Her") + " warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. " + this.benoitMF("He", "She") + " starts slightly when " + this.benoitMF("he", "she") + " touches your scales, and then caresses the reptilian parts of your body with increasing interest. \"<i>I cannot believe I did not realize you were a sister of ze scales,</i>\" " + this.benoitMF("he", "she") + " says huskily. \"<i>Zat is very... interesting.</i>\" You can see real arousal in the tense lines of " + this.benoitMF("his", "her") + " face now.");
            // [Bee:
            else if ((this.player.wings.type == Wings.BEE_LIKE_SMALL || this.player.wings.type == Wings.BEE_LIKE_LARGE) && this.player.lowerBody.type == LowerBody.BEE) this.outputText("\n\n" + this.benoitMF("His", "Her") + " warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. " + this.benoitMF("He", "She") + " finds your diaphanous wings and follows them up as far as " + this.benoitMF("he", "she") + " can reach, " + this.benoitMF("his", "her") + " grip on your sensitive membranes making you twitch a bit; then " + this.benoitMF("he", "she") + " sends " + this.benoitMF("his", "her") + " hands trailing down your carapace-armored limbs. \"<i>I sought you just liked wearing big boots,</i>\" " + this.benoitMF("he", "she") + " murmurs. \"<i>But zis is actually a part of you? 'Ow... interesting.</i>\"");
            // [Centaur:
            else if (this.player.isTaur()) this.outputText("\n\n" + this.benoitMF("His", "Her") + " warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. \"<i>Good Gods,</i>\" " + this.benoitMF("he", "she") + " murmurs as " + this.benoitMF("his", "her") + " hands lead back onto your flanks. \"<i>Good Gods!</i>\" " + this.benoitMF("he", "she") + " cries out as " + this.benoitMF("he", "she") + " follows you all the way back to your mighty, powerful rear. \"<i>I knew you were a centaur because of all ze clopping,</i>\" " + this.benoitMF("he", "she") + " says, rubbing your flank back and forth in wonder. \"<i>But to know it and actually feel it, zey are very different.</i>\" " + this.benoitMF("He", "She") + " sighs. \"<i>Zis is going to be a bit... awkward, but I am guessing you are all too used to zat by now, yes?</i>\"");
            else if (this.player.isDrider()) this.outputText("\n\n" + this.benoitMF("His", "Her") + " warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. \"<i>Good Gods,</i>\" " + this.benoitMF("he", "she") + " murmurs as " + this.benoitMF("his", "her") + " hands lead back onto your tough exoskeleton. \"<i>Good Gods!</i>\" " + this.benoitMF("he", "she") + " cries out as " + this.benoitMF("he", "she") + " follows your bulging abdomen all the way back to your spinnerets. \"<i>I knew you were a spider because of all ze click-clacking,</i>\" " + this.benoitMF("he", "she") + " says, " + this.benoitMF("his", "her") + " fingers feeling around one of your intricate, many-jointed legs in wonder. \"<i>But to know it and actually feel it, zey are very different.</i>\"");
            // [Slime:
            else if (this.player.isGoo()) this.outputText("\n\n" + this.benoitMF("His", "Her") + " warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. \"<i>I knew you were different from ze squishy sounds you made,</i>\" " + this.benoitMF("he", "she") + " murmurs as " + this.benoitMF("his", "her") + " hands sink into your soft, amorphous mass. \"<i>But zis is...good Gods, zis is strange. And zis doesn't 'urt you at all?</i>\" " + this.benoitMF("he", "she") + " asks incredulously as " + this.benoitMF("he", "she") + " gently pokes a finger into you. You answer " + this.benoitMF("his", "her") + " question by giggling. \"<i>Zat must come in very useful,</i>\" " + this.benoitMF("he", "she") + " says, shaking " + this.benoitMF("his", "her") + " head in wonder. You push yourself slowly up " + this.benoitMF("his", "her") + " arms and tell " + this.benoitMF("him", "her") + " " + this.benoitMF("he", "she") + " has no idea.");
            // [Fox:
            else if ((this.player.foxScore() >= 4 || this.player.kitsuneScore() >= 4) && this.player.ears.type == Ears.FOX && this.player.tail.type == Tail.FOX) {
                if (this.player.tail.venom <= 1) this.outputText("\n\n" + this.benoitMF("His", "Her") + " warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. " + this.benoitMF("He", "She") + " grins as " + this.benoitMF("he", "she") + " finds your perky ears, outright laughs when " + this.benoitMF("he", "she") + " reaches around and touches your fluffy tail. \"<i>I always wondered why Pierre gets all excited when 'e sees you,</i>\" " + this.benoitMF("he laughs", "she giggles") + ".");
                else this.outputText("\n\n" + this.benoitMF("His", "Her") + " warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. " + this.benoitMF("He", "She") + " grins as " + this.benoitMF("he", "she") + " finds your perky ears and outright laughs when " + this.benoitMF("he", "she") + " reaches around and touches your fluffy tails. \"<i>You didn't do zis just to trick me, did you [name]?</i>\" " + this.benoitMF("he laughs", "she giggles") + ".");
            }
            else this.outputText("\n\n" + this.benoitMF("His", "Her") + " warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. \"<i>You 'umans are so squishy, fuzzy and 'ot,</i>\" " + this.benoitMF("he", "she") + " says huskily. \"<i>'Ow can you stand it?</i>\"");
            if (this.player.hasCock()) {
                this.outputText("\n\n" + this.benoitMF("His", "Her") + " hands travel downwards until, with a sharp intake of breath, " + this.benoitMF("he", "she") + " touches [oneCock]. \"<i>Aren't you just full of surprises,</i>\" " + this.benoitMF("he", "she") + " says dryly. After a pause, " + this.benoitMF("he", "she") + " slowly wraps " + this.benoitMF("his", "her") + " smooth hand around your semi-erect cock and moves it up and down, rubbing and coiling you until you are straining.");
                if (this.player.cocks[this.player.biggestCockIndex()].cockLength < 10) this.outputText(" Although this is evidently an uncanny experience for " + this.benoitMF("him", "her") + ", " + this.benoitMF("he", "she") + " does manage a cocky smile as " + this.benoitMF("his", "her") + " hand moves along your male sex. \"<i>Mine is bigger,</i>\" " + this.benoitMF("he", "she") + " teases. You reward " + this.benoitMF("his", "her") + " cheek by doing some feeling yourself, grasping and pinching at " + this.benoitMF("his", "her") + " tight, supple behind through " + this.benoitMF("his", "her") + " trousers, making " + this.benoitMF("him", "her") + " gasp as you move into " + this.benoitMF("him", "her") + ".");
                else this.outputText(" This is evidently an uncanny experience for " + this.benoitMF("him", "her") + ", the alien nature of it deepening as " + this.benoitMF("his", "her") + " hands moves along your male sex. \"<i>'Oly Gods, [name]; you are a monster,</i>\" " + this.benoitMF("he", "she") + " says thickly. You smile and decide it's time to do some feeling yourself; you grasp and pinch at " + this.benoitMF("his", "her") + " tight, supple behind through " + this.benoitMF("his", "her") + " trousers, making " + this.benoitMF("him", "her") + " gasp as you move into " + this.benoitMF("him", "her") + ".");
            }
            this.outputText("\n\n" + this.benoitMF("His", "Her") + " hands trail further down, moving into your inner thighs, exploring your soft flesh until " + this.benoitMF("he", "she") + " touches your lips. You close your eyes and sigh as " + this.benoitMF("he", "she") + " slowly parts them with " + this.benoitMF("his", "her") + " smooth fingers and slides into your [vagina]. Although " + this.benoitMF("his", "her") + " breath is becoming increasingly heavy " + this.benoitMF("he", "she") + " also seems genuinely curious about you; with surprising gentleness " + this.benoitMF("his", "her") + " fingers travel over and around your moistening sex, exploring your every fold, working deeper and deeper as " + this.benoitMF("he", "she") + " does. You let " + this.benoitMF("him", "her") + " know what pleases you by sighing when " + this.benoitMF("he", "she") + " touches a sweet spot, moving deliberately with " + this.benoitMF("his", "her") + " finger's motions so " + this.benoitMF("he", "she") + " may give them better attention. " + this.benoitMF("He", "She") + " soon finds your [clit], beginning to bulge with need; slowly " + this.benoitMF("he", "she") + " circles it and then flicks at it, gently frigging you.");
            if (this.player.inHeat) this.outputText(" By now your vagina is practically gushing, your body's own deep-seated pheromone need stoked to blazing heights by the basilisk's gentle, painstaking exploration. You cannot stop yourself thrusting against " + this.benoitMF("his", "her") + " soaked hand, announcing how badly you want this with heavy moans.");

            this.outputText("\n\nThe scent of your arousal is in the air and as " + this.benoitMF("Benoit", "Benoite") + " inhales it, " + this.benoitMF("his", "her") + " own breath comes heavier. " + this.benoitMF("His", "Her") + " erection bulges in " + this.benoitMF("his", "her") + " long johns and you decide it's time for you to take charge; you push " + this.benoitMF("him", "her") + " against the wall, unbuckle " + this.benoitMF("him", "her") + " and let " + this.benoitMF("his", "her") + " trousers fall. Stoked by the pheromones simmering off your body, " + this.benoitMF("his", "her") + " long, thin, purple erection is straining and " + this.benoitMF("he", "she") + " arches " + this.benoitMF("his", "her") + " back and opens " + this.benoitMF("his", "her") + " mouth as you lay a hand on it. You know just from looking at " + this.benoitMF("his", "her") + " straining prick you're going to have to go slow for " + this.benoitMF("him", "her") + " not to shoot " + this.benoitMF("his", "her") + " bolt straight away; with a wicked smile your partner can't see, you suppose that such is your body's effect on " + this.benoitMF("him", "her") + " it may not even matter if " + this.benoitMF("he", "she") + " does. As lost as the horny lizan is to the haze of " + this.benoitMF("his", "her") + " pleasure, you remind " + this.benoitMF("him", "her") + " of reality the best way you know how, guiding " + this.benoitMF("his", "her") + " hands to your [hips] and with a sigh, slowly sliding " + this.benoitMF("his", "her") + " length into your moistened [vagina] with as much grace as your eagerness can stand.");

            this.player.cuntChange(14, true, true, false);

            this.outputText("\n\nBenoit's dick is incredibly smooth and you move down onto it with slick ease. Rather than burying yourself onto it straight away, you stop with only a third of it in your wet depths and bring it out of you, dipping yourself slowly. You stop with " + this.benoitMF("his", "her") + " sensitive head just inside and work your thighs around deliberately, sighing as it rotates around your slick walls. " + this.benoitMF("Benoit", "Benoite") + " moans and you feel " + this.benoitMF("his", "her") + " body tense; immediately you halt your movements and wait, only gradually beginning to gyrate and thrust again when " + this.benoitMF("he", "she") + " has calmed down. You slide more inside when you bend forwards again, this time leaving only " + this.benoitMF("his", "her") + " base outside of you; a sigh rolls from you as you feel " + this.benoitMF("him", "her") + " creeping further into your moist depths. " + this.benoitMF("He", "She") + " makes a bestial noise and tries to thrust himself into you and upon you; tutting mockingly, you pull yourself away from " + this.benoitMF("him", "her") + " and stop moving until, with what is evidently a huge force of will, the basilisk calms himself, backs himself against the wall and allows you to work " + this.benoitMF("him", "her") + ".");

            if (this.player.vaginalCapacity() < 15) this.outputText("\n\nYou slide back down onto " + this.benoitMF("him", "her") + ", cooing this time as you feel " + this.benoitMF("him", "her") + " bottom out with several inches still outside. " + this.benoitMF("His", "Her") + " thin member could not be more perfect for your tight sex; " + this.benoitMF("he", "she") + " rubs your walls up and down as you dreamily thrust in and out of " + this.benoitMF("his", "her") + " body, sending waves of pleasure washing through you.");
            else this.outputText("\n\nYou slide back down onto " + this.benoitMF("him", "her") + ", cooing this time as your groin meets " + this.benoitMF("his", "her") + " muscular thighs with a wet kiss, your sex swallowing " + this.benoitMF("his", "her") + " cock whole. You begin to ride " + this.benoitMF("him", "her") + " hard and slow, bending " + this.benoitMF("his", "her") + " cock upwards to push at your sensitive walls, waves of pleasure starting to wash through you.");

            this.outputText("\n\nYou keep at this for what feels like hours, stopping and starting, pulling and pushing deliberately to keep the basilisk you have backed into a corner under your control. The pace of the fuck is clearly agonising for " + this.benoitMF("Benoit", "Benoite") + "; " + this.benoitMF("he", "she") + " pants, tenses and gasps to the wet movement of your [vagina], " + this.benoitMF("his", "her") + " face and chest heaving with extreme arousal, but " + this.benoitMF("he", "she") + " lets you stay in command, eventually giving up on anything but lying back and letting you have your way with " + this.benoitMF("him", "her") + ". To give " + this.benoitMF("him", "her") + " something to do, you grab " + this.benoitMF("his", "her") + " hands and lay them upon your [chest]; after exploring your flesh for a time, " + this.benoitMF("he", "she") + " finds your [nipple]s and begins to knead them, placing each nub between two fingers and rubbing them insistently.");
            if (this.player.lactationQ() > 100) {
                this.outputText(" You moan as your breasts reward " + this.benoitMF("his", "her") + " attention with spurts of milk; " + this.benoitMF("he", "she") + " starts in genuine amazement when they ");
                if (!this.player.isTaur()) this.outputText("hit " + this.benoitMF("him", "her") + " in the face");
                else this.outputText("trickle over " + this.benoitMF("his", "her") + " fingers");
                this.outputText(". \"<i>Mammals are so damn weird,</i>\" " + this.benoitMF("he", "she") + " mutters, making you giggle.");
            }
            this.outputText("\n\nYour lust ratchets up as " + this.benoitMF("his", "her") + " warm hands continue to move, and at last losing your discipline you thrust into " + this.benoitMF("him", "her") + " with abandon, eager now for your peak. " + this.benoitMF("Benoit", "Benoite") + " pants as you really begin to fuck " + this.benoitMF("him", "her") + " and begins to thrust with you; you clutch " + this.benoitMF("his", "her") + " neck and bite into " + this.benoitMF("his", "her") + " shoulder as you pound into each other, the wetness of your arousal spattering against " + this.benoitMF("his", "her") + " thighs as your body slaps into the basilisk's tight muscles. " + this.benoitMF("He", "She") + " makes a harsh, bestial noise when " + this.benoitMF("he", "she") + " cums; " + this.benoitMF("his", "her") + " blind eyes roll as " + this.benoitMF("he", "she") + " clutches your back and shoots surge after surge of cum into your churning depths. The warmth of " + this.benoitMF("his", "her") + " jizz and " + this.benoitMF("his", "her") + " helpless bucking thrust you to your own orgasm; irrepressible pulses of pleasure overwhelm your mind and you can do nothing for long minutes except cry and squeal on top of the basilisk, clutching " + this.benoitMF("him", "her") + " back as you work " + this.benoitMF("his", "her") + " dick for every last drop of cum.");
            if (this.player.hasCock()) {
                if (!this.player.isTaur()) this.outputText(" Stuck between your two burning bodies, y");
                else this.outputText("Y");
                this.outputText("our " + this.player.cockDescript(0) + " spurts in sympathy to your female high, soaking ");
                if (!this.player.isTaur()) this.outputText("both of you");
                else this.outputText("the dry dirt");
                this.outputText(" with white.");
            }
        }
        this.outputText("\n\nEventually, the two of you part, dripping your mixed fluids as you step back. \"<i>Phew!</i>\" " + this.benoitMF("Benoit", "Benoite") + " says after " + this.benoitMF("he", "she") + "'s managed to catch " + this.benoitMF("his", "her") + " breath. \"<i>That was... somesing. Mademoiselle, you are... amazing.</i>\" You find yourself laughing at " + this.benoitMF("his", "her") + " slightly shell-shocked expression, and the light, happy sound seems to bring " + this.benoitMF("him", "her") + " around a bit. " + this.benoitMF("He", "She") + " brushes your shoulder as " + this.benoitMF("he", "she") + " walks past you, feeling around the stock room until " + this.benoitMF("he", "she") + " finds a chest of drawers. " + this.benoitMF("He", "She") + " opens a compartment and withdraws a small woollen bag, stuffed with pungent green leaves.");
        this.outputText("\n\n\"<i>Ze shark ladies are always coming up from ze lake to sell me zis,</i>\" " + this.benoitMF("he", "she") + " says. \"<i>It is a very effective, 'ow you say, 'counter septic'?");
        this.player.orgasm('Generic');
        if ((this.player.pregnancyType == PregnancyStore.PREGNANCY_OVIELIXIR_EGGS || this.player.findPerk(PerkLib.HarpyWomb) >= 0 || this.player.findPerk(PerkLib.Oviposition) >= 0) && (this.player.pregnancyIncubation == 0 || this.player.pregnancyType == PregnancyStore.PREGNANCY_OVIELIXIR_EGGS)) {
            this.outputText(" I would not inflict my children upon you. Ere, take as much as you like.</i>\"");
            this.menu();
            this.addButton(0, "Take It", this.takeBenoitsContraceptives);
            this.addButton(14, "Leave", this.dontTakeEggtraceptives);
        }
        else {
            this.outputText(" I cannot give you babies unless you 'ave eggs. I guess I should think a bit more before I go digging for things...</i>\"");
            // , but if your body goes into 'eat again and you are afraid of 'aving... unwanted experiences... I can sell it to you.</i>\"]
            this.doNext(this.camp.returnToCampUseOneHour);

        }

    }

    private takeBenoitsContraceptives(): void {
        this.clearOutput();
        this.outputText("You gladly accept the herbal contraceptive and push it into your mouth, enjoying the pleasantly sharp, citrus flavour.");
        //  \"<i>I can sell you ze stuff too,</i>\" he says, twiddling his claws.  \"<i>If you want.</i>\"
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // No:
    private dontTakeEggtraceptives(): void {
        this.clearOutput();
        this.outputText("You smile and say you don't mind carrying and laying a few basilisk eggs. \"<i>You... you don't?</i>\" " + this.benoitMF("he", "she") + " says hesitantly. " + this.benoitMF("He", "She") + " faces you and for a moment looks like " + this.benoitMF("he", "she") + "'s going to say something else; but then " + this.benoitMF("he", "she") + " shakes " + this.benoitMF("his", "her") + " head and puts the bag back into the drawer.");
        // \"<i>Well...if you are sure.  I can sell you ze stuff if you ever change your mind.</i>\"
        this.outputText("\n\nIn the warm afterglow you redress at leisure before leading " + this.benoitMF("him", "her") + " back inside the shop and, after squeezing " + this.benoitMF("his", "her") + " hand, take your leave.");
        // [Herbal Contraceptive added to slot 4 of shop]
        // Standard basilisk preg odds
        this.benoitKnocksUpPCCheck();
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Subsequent visit to the shop:
    private firstTimeAfterBoningEncounterBenoit(): void {
        this.clearOutput();
        // Set a flag here to make sure it only happens once.
        this.flags[kFLAGS.BENOIT_POST_FIRSTFUCK_TALK] = 1;
        this.outputText("A strange, faint noise is emanating from the salvage shop. It's only when you duck cautiously into the stall proper that you realize it's the sound of a basilisk humming. " + this.benoitMF("Benoit", "Benoite") + " stops to sniff the air when you come in, immediately puts down the mug " + this.benoitMF("he", "she") + " is polishing, and beckons you inside.");

        this.outputText("\n\n\"<i>'Allo again, [name]</i>\"!</i>\" " + this.benoitMF("he", "she") + " says brightly. \"<i>'Ow pleasant it is to see you. 'Ow are we zis very fine day?</i>\" There's something imperceptibly different about " + this.benoitMF("Benoit", "Benoite") + " today and it takes you a moment to work out what it is. " + this.benoitMF("He", "She") + " doesn't seem quite as shabby as " + this.benoitMF("he", "she") + " did before; " + this.benoitMF("his", "her") + " scales gleam dully and you wonder if " + this.benoitMF("he", "she") + "'s taken a bath recently. There's something else, too.");

        this.outputText("\n\n\"<i>Zis? No. Of course not!</i>\" " + this.benoitMF("he", "she") + " says, when you ask if " + this.benoitMF("he", "she") + "'s wearing the navy tie just for you. \"<i>Is zere somesing wrong with a basilisk wanting to look 'is best? Anyway, I am taking it off now. It is very silly, I see zis now. Now... what is it zat mademoiselle is after?</i>\" You try not to laugh at this display and consider what it is you're here for.");
        // [defaults to regular 30+ affection visit afterwards]
    }

    // Let " + benoitMF("him","her") + "(not for horses):
    private repeatSexWithBenoitLetHim(): void {
        this.clearOutput();
        if (this.player.isTaur()) {
            this.outputText("\n\nFor the moment you don't do anything; you simply stand back and let " + this.benoitMF("his", "her") + " hands slowly move across your frame. One of " + this.benoitMF("his", "her") + " hands comes to rest upon your [nipples]; as " + this.benoitMF("he", "she") + " gently teases and kneads the soft, sensitive flesh " + this.benoitMF("his", "her") + " other hand drift downwards, across your belly, around your waist and down your velvety back. Although " + this.benoitMF("he", "she") + " is familiar with your frame by now " + this.benoitMF("Benoit", "Benoite") + " never seems to stop being enthralled by your body; there is an unconscious frown of concentration on " + this.benoitMF("his", "her") + " face as " + this.benoitMF("his", "her") + " smooth hands move across your warm skin, as if " + this.benoitMF("he", "she") + " were mapping you in " + this.benoitMF("his", "her") + " mind's eye.");
            this.outputText("\n\nThis slow, gentle pressure is all very well, but you can't help but wonder if you can't awaken something a bit more bestial in the timid basilisk. The thought of making " + this.benoitMF("him", "her") + " lose " + this.benoitMF("his", "her") + " self-control over you makes you grin, and tenderly but firmly you put your hands on " + this.benoitMF("his", "her") + " claws and tell " + this.benoitMF("him", "her") + " to stop. " + this.benoitMF("He", "She") + " looks at you in puzzlement. Smiling, you begin to give " + this.benoitMF("him", "her") + " some of " + this.benoitMF("his", "her") + " own treatment; your hands drift softly over " + this.benoitMF("his", "her") + " tight, smooth flesh, working down " + this.benoitMF("his", "her") + " flat stomach until they reach " + this.benoitMF("his", "her") + " long johns. You slowly unbuckle them and let them fall, releasing " + this.benoitMF("his", "her") + " long, thin erection. With one hand you circle the base gently; even touching this least sensitive part of " + this.benoitMF("his", "her") + " dick makes " + this.benoitMF("him", "her") + " grunt with need, the thump of " + this.benoitMF("his", "her") + " heart reverberating through " + this.benoitMF("his", "her") + " scales, and " + this.benoitMF("he", "she") + " involuntarily thrusts forwards, trying to get more of your hand upon " + this.benoitMF("him", "her") + ". Again, you tell " + this.benoitMF("him", "her") + " to be still. You continue to almost-masturbate " + this.benoitMF("him", "her") + ", your one hand rubbing the very base of " + this.benoitMF("his", "her") + " cock and the lips from which it thrusts, whilst you very gently sway your powerful back hips, your [vagina] beginning to moisten at the sight of the basilisk's intense arousal. The scent of your sex is in the air and the fact you cannot reach back and do anything about it only intensifies your excitement. " + this.benoitMF("Benoit", "Benoite") + " is clenching " + this.benoitMF("his", "her") + " pointed teeth, trembling slightly like a pipe about to burst, " + this.benoitMF("his", "her") + " tail thrashing fitfully as you ponderously turn and lead your rump into " + this.benoitMF("him", "her") + ", smearing your essence over " + this.benoitMF("his", "her") + " incredibly receptive nostrils. All " + this.benoitMF("he", "she") + " can smell is your own arousal as you begin to talk huskily, saying you've been a naughty girl playing in the mountains, you've teased and run away and mocked every creature you've found but now a big bad basilisk has got you cornered, and what is the big bad basilisk going to do now it's got this naughty girl all to itself...?");

            this.outputText("\n\nBenoit surges forwards, grasps you by the [butt], turns and pinions you to the wall. Your laughs turn to gasps as with an almost pained growl, " + this.benoitMF("Benoit", "Benoite") + " thrusts himself straight into your moist twat. You can only clutch at the wall of the wagon as " + this.benoitMF("he", "she") + " begins to fuck you with abandon, pushing your human front forwards as " + this.benoitMF("he", "she") + " levers your [hips] upwards with each thrust. " + this.benoitMF("He", "She") + " is clumsy with lust as well as blind, uncaring of anything but the need to clench your body and hilt himself in your depths, unable to take hold of himself with your pussy juices coating " + this.benoitMF("his", "her") + " nose and burning an unstoppable path to " + this.benoitMF("his", "her") + " brain. " + this.benoitMF("His", "Her") + " pheromone driven callousness and the discomfort of the wood against your hands ");
            if (this.player.biggestTitSize() >= 1) this.outputText("and [fullChest] ");
            this.outputText("augments the roughness of the fuck and you find yourself getting carried along with it, thrusting your powerful rump back against the basilisk and clenching " + this.benoitMF("him", "her") + " deeper into you, delighting in " + this.benoitMF("his", "her") + " firm, dense mass pounding into you. Your [vagina] dribbles juices around " + this.benoitMF("his", "her") + " impatient, straining dick, practically foaming as " + this.benoitMF("his", "her") + " smooth length rubs forcefully all along your sensitive tunnel.");
            this.player.cuntChange(14, true, true, false);

            this.outputText("\n\nThe rough sex knocks the breath and sense out of you and you are dizzy with it by the time you reach your high, gasping and making guttural noises as " + this.benoitMF("Benoit", "Benoite") + "'s thumping makes your pussy clench and spasm around " + this.benoitMF("him", "her") + ". " + this.benoitMF("He", "She") + " joins in with a thick, breathless growl, and you feel surge after surge of cum flood your depths with warmth. After you have finished thrashing against each other you stay where you are, gathering your breath on each other. It takes you a while to realize " + this.benoitMF("he", "she") + " hasn't gone soft, and is still embedded firmly within you; your mixed fluids are dripping down your thighs and your musk is still in the air. " + this.benoitMF("He", "She") + " grins at you and gives you a tiny thrust, making you bite your lip; ejaculating seems to have only taken the slightest edge off the rut you've induced in " + this.benoitMF("him", "her") + ". “You did not sink you would get away zat easily, did you?” " + this.benoitMF("he", "she") + " growls softly.");

            this.outputText("\n\nHe pulls out of you, trailing threads of semen as " + this.benoitMF("he", "she") + " goes, before slowly turning you around, painstakingly feeling around for a clear space with " + this.benoitMF("his", "her") + " feet, and then putting you down, gently but firmly positioning you on your lower body. " + this.benoitMF("His", "Her") + " hands descend upon your [butt]; grinning, you poke it outwards invitingly, sighing with mock frustration as the blind basilisk painstakingly lines up " + this.benoitMF("his", "her") + " next shot with your drooling, sticky sex.");

            this.outputText("\n\nWhen " + this.benoitMF("he", "she") + " slides into you " + this.benoitMF("he", "she") + " does so with virtually no resistance whatsoever; the two of you have turned your pussy into an inviting, gooey sleeve. ");
            // [Tight:
            if (this.player.vaginalCapacity() < 30) this.outputText("You don't mind; your tight sex is a perfect fit for " + this.benoitMF("his", "her") + " smooth, thin dick, and you work with " + this.benoitMF("him", "her") + " as " + this.benoitMF("he", "she") + " thrusts, pulling and pushing your walls in time with " + this.benoitMF("his", "her") + " length, your lubrication allowing " + this.benoitMF("him", "her") + " to quickly increase the tempo until the two of you are once again bucking against each other gleefully, your fluids spattering against each other.");
            // Loose:
            else this.outputText("Although " + this.benoitMF("he", "she") + " is long " + this.benoitMF("he", "she") + " barely even touches the sides of your encompassing twat. The sensation isn't great for you until " + this.benoitMF("he", "she") + " really starts to go to town, ramming into you with all " + this.benoitMF("he", "she") + "'s got, beating a wet staccato against your [butt], pushing against your [clit] as " + this.benoitMF("he", "she") + " sheaths himself in you. Your fluids begin to dribble onto your hooves as your slick pleasure button bulges with increasing delight.");
            this.outputText("\n\nThe difference in the position makes " + this.benoitMF("his", "her") + " dick bend into you at a different angle, stroking a neglected spot which soon has you gasping with need. " + this.benoitMF("Benoit", "Benoite") + " is not as maddened as " + this.benoitMF("he", "she") + " was the first time, and " + this.benoitMF("he", "she") + " has the composure to draw himself out; " + this.benoitMF("he", "she") + " slows himself down and then back up again, fucking you magisterially, withdrawing himself almost all the way out of you before slamming firmly back in, stopping whilst hilted in you until you beg and moan for " + this.benoitMF("him", "her") + " to continue. You give yourself up to the dominant rut you've awoken in " + this.benoitMF("him", "her") + ", thrusting back into " + this.benoitMF("him", "her") + " as you are fucked up to a second ecstatic height and then a third; everything disappearing underneath a timeless red haze, of having your [butt] in the air and being given what a mare needs.");

            this.outputText("\n\nWhen " + this.benoitMF("Benoit", "Benoite") + " finally cums " + this.benoitMF("he", "she") + " sounds almost pained; " + this.benoitMF("his", "her") + " aching cock delivers another load into your already packed womb, semen dribbling and spurting onto the floor. You work " + this.benoitMF("his", "her") + " dick for as long as you can until it finally droops out of your abused cunt. Finally you sit up, turn around and cuddle into the basilisk, who pools onto the floor and responds tentatively.");

            this.outputText("\n\n“Zat was... wow,” " + this.benoitMF("he", "she") + " manages. With " + this.benoitMF("his", "her") + " dick wrung of every last drop of " + this.benoitMF("his", "her") + " seed you can see " + this.benoitMF("he", "she") + " is returning to himself, and " + this.benoitMF("his", "her") + " hand around your waist is cautious. “Was zat... all right for you? I do not know if... I get zese smells in my 'ead and zen...” You answer " + this.benoitMF("him", "her") + " by kissing " + this.benoitMF("him", "her") + " on the cheek and saying with teasing huskiness that it was good, but maybe next time " + this.benoitMF("he", "she") + " shouldn't hold back so much. " + this.benoitMF("He", "She") + " grins at this. You spend a bit more time cuddling whilst recovering from the intense fuck, before finally clambering to your feet. Your final act before dressing and taking your leave is to faintly brush your scent across " + this.benoitMF("Benoit", "Benoite") + "'s nose again, telling " + this.benoitMF("him", "her") + " you expect " + this.benoitMF("him", "her") + " to be ready and primed the next time this naughty girl pays a visit. " + this.benoitMF("He", "She") + " doesn't respond- maybe " + this.benoitMF("he", "she") + " is still privately ashamed about losing " + this.benoitMF("his", "her") + " cool over you- but you can tell by the lines of " + this.benoitMF("his", "her") + " face and the way " + this.benoitMF("his", "her") + " head moves unconsciously to follow your path out of " + this.benoitMF("his", "her") + " shop that " + this.benoitMF("him", "her") + " not being aroused by you isn't something you're ever going to have to worry about.");
        }
        else {
            this.outputText("For the moment you don't do anything; you simply stand back and let " + this.benoitMF("his", "her") + " hands slowly move across your frame. One of " + this.benoitMF("his", "her") + " hands comes to rest upon your " + this.player.nippleDescript(0) + "; as " + this.benoitMF("he", "she") + " gently teases and kneads the soft, sensitive flesh " + this.benoitMF("his", "her") + " other hand drift downwards, across your belly, around over the crack of your [butt] then down to cup your behind. Although " + this.benoitMF("he", "she") + " is familiar with your frame by now, " + this.benoitMF("Benoit", "Benoite") + " never seems to stop being enthralled by your body; there is an unconscious frown of concentration on " + this.benoitMF("his", "her") + " face as " + this.benoitMF("his", "her") + " smooth hands move across your warm skin, as if " + this.benoitMF("he", "she") + " were mapping you in " + this.benoitMF("his", "her") + " mind's eye.");

            this.outputText("\n\nThis slow, gentle pressure is all very well, but you can't help but wonder if you can't awaken something a bit more bestial in the timid basilisk. The thought of making " + this.benoitMF("him", "her") + " lose " + this.benoitMF("his", "her") + " self-control over you causes you to grin, unseen, and tenderly but firmly you put your hands on " + this.benoitMF("his", "her") + " claws and tell " + this.benoitMF("him", "her") + " to stop. " + this.benoitMF("He", "She") + " looks at you in puzzlement as you shift your bodies around, your hands sliding over " + this.benoitMF("his", "her") + " shoulders and chest as you change position so that it is you with your back to the wall. " + this.benoitMF("He", "She") + " begins to move " + this.benoitMF("his", "her") + " hands again and you tut mockingly, telling " + this.benoitMF("him", "her") + " to be still for now. Smiling, you begin to give " + this.benoitMF("him", "her") + " some of " + this.benoitMF("his", "her") + " own treatment; your hands drift softly over " + this.benoitMF("his", "her") + " tight, smooth flesh, working down " + this.benoitMF("his", "her") + " washboard stomach until they reach " + this.benoitMF("his", "her") + " long johns. You slowly unbuckle them and let them fall, releasing " + this.benoitMF("his", "her") + " long, thin erection. With one hand you circle the base gently; even touching this least sensitive part of " + this.benoitMF("his", "her") + " dick makes " + this.benoitMF("him", "her") + " grunt with need, the thump of " + this.benoitMF("his", "her") + " heart reverberating through " + this.benoitMF("his", "her") + " scales, and " + this.benoitMF("he", "she") + " involuntarily thrusts forwards, trying to get more of your hand upon " + this.benoitMF("him", "her") + ". Again, you tell " + this.benoitMF("him", "her") + " to be still. You continue to almost-masturbate " + this.benoitMF("him", "her") + ", your one hand rubbing the very base of " + this.benoitMF("his", "her") + " cock and the slit from which it thrusts, whilst with the other you reach down and touch your own slickening [vagina]. You moan exaggeratedly as you dip first one finger and then two into your honey pot, gently frigging your [clit] until you are in full spate, dripping your fluids onto the packed earth beneath you. " + this.benoitMF("Benoit", "Benoite") + " is clenching " + this.benoitMF("his", "her") + " pointed teeth, trembling slightly like a pipe about to burst, as you lift your coated fingers up and smear your essence over " + this.benoitMF("his", "her") + " incredibly receptive nostrils. " + this.benoitMF("His", "Her") + " tail thrashes fitfully as you continue to torment " + this.benoitMF("his", "her") + " dick, just barely touching " + this.benoitMF("his", "her") + " purple tip before returning to " + this.benoitMF("his", "her") + " base. All " + this.benoitMF("he", "she") + " can smell is your own arousal as you begin to talk huskily, saying you've been a naughty girl playing in the mountains, you've teased and mocked and run away from every creature you've found but now a big bad basilisk has got you cornered, and what is the big bad basilisk going to do now it's got this naughty girl all to itself...?");

            this.outputText("\n\nBenoit surges forward, grasps you by the [butt] and pinions you to the wall. Your laughs turn to gasps as " + this.benoitMF("he", "she") + " lifts your teasing hands upwards, pinning them out of the way with the mass of " + this.benoitMF("his", "her") + " body and with an almost pained growl, thrusts himself straight into your moist twat. You can only clutch at " + this.benoitMF("his", "her") + " back as " + this.benoitMF("he", "she") + " begins to fuck you with complete abandon, smacking your back into the wall of the wagon and levering your [hips] upwards with each thrust. " + this.benoitMF("He", "She") + " is clumsy with lust as well as blind, uncaring of anything but the need to clench your body and hilt himself in your depths, unable to take hold of himself with your pussy juices coating " + this.benoitMF("his", "her") + " nose and burning an unstoppable path to " + this.benoitMF("his", "her") + " brain. " + this.benoitMF("His", "Her") + " pheromone-driven callousness and the discomfort of the wood rubbing against your back and butt augments the roughness of the fuck and you find yourself getting carried along with it, wrapping your thighs around the basilisk's thin waist and clenching " + this.benoitMF("him", "her") + " deeper into you, delighting in " + this.benoitMF("his", "her") + " firm, dense mass pounding into you. Your [vagina] dribbles juices around " + this.benoitMF("his", "her") + " impatient, straining dick, practically foaming as " + this.benoitMF("his", "her") + " smooth length rubs forcefully all along your sensitive tunnel.");

            this.outputText("\n\nThe rough sex knocks the breath and sense out of you and you are dizzy with it by the time you reach your high, gasping and making guttural noises as " + this.benoitMF("Benoit", "Benoite") + "'s thumping makes your pussy clench and spasm around " + this.benoitMF("him", "her") + ". " + this.benoitMF("He", "She") + " joins in with a thick, breathless growl, and you feel surge after surge of cum flood your depths with warmth. After you have finished thrashing against each other, you stay still, gathering your breath on each other. It takes you a while to realize " + this.benoitMF("he", "she") + " hasn't gone soft, that " + this.benoitMF("his", "her") + " prick is still embedded firmly within you; your mixed fluids are dripping down your thighs and your musk is still in the air. " + this.benoitMF("He", "She") + " grins at you and gives you a tiny thrust, making you bite your lip; ejaculating seems to have only taken the slightest edge off the rut you've induced in " + this.benoitMF("him", "her") + ". \"<i>You did not sink you would get away zat easily, did you?</i>\" " + this.benoitMF("he", "she") + " growls softly.");

            this.outputText("\n\nHe pulls out of you, trailing threads of semen as " + this.benoitMF("he", "she") + " goes, before slowly turning you around, painstakingly feeling around for a clear space with " + this.benoitMF("his", "her") + " feet, and then putting you down, gently but firmly positioning you on your hands and ");
            if (this.player.isBiped()) this.outputText("knees");
            else this.outputText("lower body");
            this.outputText(". " + this.benoitMF("His", "Her") + " hands descend upon your [butt]; grinning, you poke it outwards invitingly, sighing with affected frustration as the blind basilisk painstakingly lines up " + this.benoitMF("his", "her") + " next shot with your drooling, sticky sex.");

            this.outputText("\n\nWhen " + this.benoitMF("he", "she") + " slides into you " + this.benoitMF("he", "she") + " does so with virtually no resistance whatsoever; the two of you have turned your pussy into an inviting, gooey sleeve. ");
            if (this.player.vaginalCapacity() < 30) this.outputText("You don't mind; your tight sex is a perfect fit for " + this.benoitMF("his", "her") + " smooth, thin dick, and you work with " + this.benoitMF("him", "her") + " as " + this.benoitMF("he", "she") + " thrusts, pulling and pushing your walls in time with " + this.benoitMF("his", "her") + " length, your lubrication allowing " + this.benoitMF("him", "her") + " to quickly increase the tempo until the two of you are once again bucking against each other gleefully, your fluids spattering against each other.");
            else this.outputText("Although " + this.benoitMF("he", "she") + " is long, " + this.benoitMF("he", "she") + " barely even touches the sides of your encompassing twat. The sensation isn't great for you until " + this.benoitMF("he", "she") + " really starts to go to town, ramming into you with all " + this.benoitMF("he", "she") + "'s got, beating a wet staccato against your [butt]. You send a hand roaming back around and begin to finger your [clit] as " + this.benoitMF("he", "she") + " sheaths himself in you, " + this.benoitMF("his", "her") + " fluids running down your fingers as you work your slick, bulging pleasure button with increasing delight.");
            this.player.cuntChange(10, true, true, false);
            this.outputText(" The difference in the position makes " + this.benoitMF("his", "her") + " dick bend into you at an angle, stroking a neglected spot which soon has you gasping with need. " + this.benoitMF("Benoit", "Benoite") + " is not as maddened as " + this.benoitMF("he", "she") + " was the first time, and " + this.benoitMF("he", "she") + " has the composure to draw himself out; " + this.benoitMF("he", "she") + " slows himself down and then back up again, fucking you magisterially, withdrawing himself almost completely before slamming firmly back in, stopping whilst hilted in you until you beg and moan for " + this.benoitMF("him", "her") + " to continue. You give yourself up to the dominant rut you've awoken in " + this.benoitMF("him", "her") + ", thrusting back into " + this.benoitMF("him", "her") + " as you are fucked up to a second ecstatic height and then a third; everything disappearing underneath a timeless red haze, of being on your hands and knees with your [butt] in the air and being given what a female animal needs.");

            this.outputText("\n\nWhen " + this.benoitMF("Benoit", "Benoite") + " finally cums " + this.benoitMF("he", "she") + " sounds almost pained; " + this.benoitMF("his", "her") + " aching cock delivers another load into your already packed womb, semen dribbling and spurting onto the floor. You work " + this.benoitMF("his", "her") + " dick for as long as you can until it finally droops out of your abused cunt. Finally you crawl into a sitting position and cuddle into the basilisk, who pools onto the floor and responds tentatively.");

            this.outputText("\n\n\"<i>Zat was... wow,</i>\" " + this.benoitMF("he", "she") + " manages. With " + this.benoitMF("his", "her") + " dick wrung of every last drop of " + this.benoitMF("his", "her") + " seed you can see " + this.benoitMF("he", "she") + " is returning to himself, and " + this.benoitMF("his", "her") + " hand on your shoulder is cautious. \"<i>Was zat... alright for you? I do not know if... I get zese smells in my 'ead and zen...</i>\" You answer " + this.benoitMF("him", "her") + " by kissing " + this.benoitMF("him", "her") + " on the cheek and saying with teasing huskiness that it was good, but perhaps next time " + this.benoitMF("he", "she") + " shouldn't hold back so much. " + this.benoitMF("He", "She") + " grins at this. You spend a bit more time cuddling whilst recovering from the intense fuck, before finally clambering to your feet. Your final act before dressing and taking your leave is to dip a lazy finger into your cunt and faintly brush your scent across " + this.benoitMF("Benoit", "Benoite") + "'s nose again, telling " + this.benoitMF("him", "her") + " you expect " + this.benoitMF("him", "her") + " to be ready and primed the next time this naughty girl pays a visit. " + this.benoitMF("He", "She") + " doesn't respond - maybe " + this.benoitMF("he", "she") + " is still privately ashamed about losing " + this.benoitMF("his", "her") + " cool over you - but you can tell by the lines of " + this.benoitMF("his", "her") + " face and the way " + this.benoitMF("his", "her") + " head moves unconsciously to follow your path out of " + this.benoitMF("his", "her") + " shop that " + this.benoitMF("him", "her") + " not being aroused by you isn't something you're ever going to have to worry about.");
        }
        this.flags[kFLAGS.BENOIT_TIMES_SEXED_FEMPCS]++;
        this.benoitKnocksUpPCCheck();
        this.benoitAffection(2);
        this.player.orgasm('Vaginal');
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Take charge:
    private repeatBenoitFuckTakeCharge(): void {
        this.clearOutput();
        if (this.player.isTaur()) {
            this.outputText("\n\nFor the moment you don't do anything; you simply stand back and let " + this.benoitMF("his", "her") + " hands slowly move across your frame. One of " + this.benoitMF("his", "her") + " hands comes to rest upon your [nipple]; as " + this.benoitMF("he", "she") + " gently teases and kneads the soft, sensitive flesh " + this.benoitMF("his", "her") + " other hand drift downwards, across your belly, then slowly back along your vast equine frame. Although " + this.benoitMF("he", "she") + " is familiar with your frame by now " + this.benoitMF("Benoit", "Benoite") + " never seems to stop being enthralled by your body; there is an unconscious frown of concentration on " + this.benoitMF("his", "her") + " face as " + this.benoitMF("his", "her") + " smooth hands move across your warm skin, as if " + this.benoitMF("he", "she") + " were mapping you in " + this.benoitMF("his", "her") + " mind's eye.");

            // [Herm:
            if (this.player.isTaur()) this.outputText("\n\n" + this.benoitMF("His", "Her") + " hands travel downwards until, with a small grin, " + this.benoitMF("he", "she") + " finds what " + this.benoitMF("he", "she") + " knows is there. " + this.benoitMF("He", "She") + " wraps " + this.benoitMF("his", "her") + " dry, smooth grasp around your semi-erect cock and moves it up and down, rubbing and coiling you until you are straining. You close your eyes and sigh, enjoying the masterful treatment that both of you can only feel, not see.");

            this.outputText("\n\n" + this.benoitMF("His", "Her") + " hands trail upwards, moving over your bestial behind, exploring your soft flesh until " + this.benoitMF("he", "she") + " touches your lips. You close your eyes and sigh as " + this.benoitMF("he", "she") + " slowly parts them with " + this.benoitMF("his", "her") + " smooth fingers and slides into your [vagina]. Although " + this.benoitMF("his", "her") + " breath is becoming increasingly heavy " + this.benoitMF("he", "she") + " also seems genuinely curious about you; with surprising gentleness " + this.benoitMF("his", "her") + " fingers travel over and around your moistening sex, exploring your every fold, working deeper and deeper as " + this.benoitMF("he", "she") + " does. You let " + this.benoitMF("him", "her") + " know what pleases you by sighing when " + this.benoitMF("he", "she") + " touches a sweet spot, moving deliberately with " + this.benoitMF("his", "her") + " finger's motions so " + this.benoitMF("he", "she") + " may give them better attention. " + this.benoitMF("He", "She") + " soon finds your [clit], beginning to bulge with need; slowly " + this.benoitMF("he", "she") + " circles it and then flicks at it, gently frigging you.");
            if (this.player.inHeat) this.outputText(" By now your vagina is practically gushing, your bodies' own deep seated pheromone need stoked to blazing heights by the basilisk's gentle, painstaking exploration of your body. You cannot stop thrusting yourself against " + this.benoitMF("his", "her") + " soaked hand, announcing how badly you want this with heavy moans.");

            this.outputText("\n\nThe scent of your arousal is in the air and as " + this.benoitMF("Benoit", "Benoite") + " breathes it in " + this.benoitMF("his", "her") + " own breath comes heavier. " + this.benoitMF("His", "Her") + " erection bulges in " + this.benoitMF("his", "her") + " long johns and you decide it's time for you to take charge; you back up, butting " + this.benoitMF("him", "her") + " insistently with your powerful body until you have " + this.benoitMF("him", "her") + " pinned against a space upon the opposite wall. You watch " + this.benoitMF("him", "her") + " over your shoulder as " + this.benoitMF("he", "she") + " unbuckles himself and lets " + this.benoitMF("his", "her") + " trousers fall. Stoked by the pheromones simmering off your body, " + this.benoitMF("his", "her") + " long, thin purple erection is straining and " + this.benoitMF("he", "she") + " arches " + this.benoitMF("his", "her") + " back and opens " + this.benoitMF("his", "her") + " mouth as you flare your [butt] and press yourself against it. You know just from looking at " + this.benoitMF("his", "her") + " intense arousal you're going to have to go slow to stop " + this.benoitMF("him", "her") + " from shooting " + this.benoitMF("his", "her") + " bolt straight away; with a wicked smile your partner can't see, you suppose such is your effect on " + this.benoitMF("him", "her") + " it may not even matter if " + this.benoitMF("he", "she") + " does. Still, as " + this.benoitMF("he", "she") + " lays " + this.benoitMF("his", "her") + " hands upon your flanks, and with a sigh you lead back and slowly slide " + this.benoitMF("his", "her") + " length into your moistened [vagina], it is as gently as you can.");

            this.outputText("\n\nBenoit's dick is incredibly smooth and you move down onto it with incredible, slick ease. Rather than burying yourself onto it straight away you stop with only a third of it in your wet depths and slowly bring it out of you, dipping yourself slowly. You stop with " + this.benoitMF("his", "her") + " sensitive head just inside and work your [hips] around deliberately, sighing as it rotates slowly around your slick walls. " + this.benoitMF("Benoit", "Benoite") + " moans dryly and you feel " + this.benoitMF("his", "her") + " body tense; immediately you stop your movements and wait, only gradually beginning to gyrate and thrust again when " + this.benoitMF("he", "she") + " has calmed down. You slide more of " + this.benoitMF("him", "her") + " into you when you bend forwards again, this time leaving only " + this.benoitMF("his", "her") + " base outside of you; you sigh as you feel " + this.benoitMF("him", "her") + " creeping further into your moist depths. " + this.benoitMF("He", "She") + " makes a bestial noise and tries to thrust himself into you and upon you; tutting mockingly, you pull yourself away from " + this.benoitMF("him", "her") + " and stop moving until, with what is evidently a huge force of will, the basilisk calms himself, backs himself against the wall and allows you to work " + this.benoitMF("him", "her") + ".");

            this.outputText("\n\n");
            // [Small capacity:]
            if (this.player.vaginalCapacity() < 30) this.outputText("You slide back down onto " + this.benoitMF("him", "her") + ", cooing this time as you feel " + this.benoitMF("him", "her") + " bottom out with several inches of " + this.benoitMF("him", "her") + " still outside of you. " + this.benoitMF("His", "Her") + " thin, long length could not be more perfect for your tight sex; " + this.benoitMF("he", "she") + " rubs your walls up and down as you dreamily thrust in and out of " + this.benoitMF("his", "her") + " body, sending waves of pleasure flowing through you.");
            // Large capacity:
            else this.outputText("You slide back down onto " + this.benoitMF("him", "her") + ", cooing this time as your groin meets " + this.benoitMF("his", "her") + " muscular thighs with a wet kiss, your sex swallowing " + this.benoitMF("his", "her") + " cock whole. You begin to ride " + this.benoitMF("him", "her") + " hard and slow, bending " + this.benoitMF("his", "her") + " cock upwards to push at your sensitive walls, waves of pleasure starting to flow through you.");

            this.outputText("\n\nYou keep at this slow ride for what feels like hours, stopping and starting, pulling and pushing deliberately to keep the basilisk you have backed into a corner under your control. The pace of the fuck is clearly agonising for " + this.benoitMF("Benoit", "Benoite") + "; " + this.benoitMF("he", "she") + " pants, tenses and gasps to the wet movement of your [vagina], " + this.benoitMF("his", "her") + " face and chest red with extreme arousal, but " + this.benoitMF("he", "she") + " lets you stay in control, eventually unable to do anything but lie back and let you have your way with " + this.benoitMF("him", "her") + ".");
            this.player.cuntChange(14, true, true, false);
            // [Lactation:
            if (this.player.lactationQ() >= 50) this.outputText(" The slow, sensual sex is enough for you to begin to bead milk from your sensitive [nipples]; you moan as the flow intensifies until you are instinctively kneading your [chest], spurting your sweet, warm fluids onto the floor. " + this.benoitMF("Benoit", "Benoite") + " starts in genuine amazement at the sound. “Mammals are so damn weird,” " + this.benoitMF("he", "she") + " mutters, making you giggle.");

            this.outputText("\n\nYour lust ratchets up as " + this.benoitMF("his", "her") + " warm hands continue to move over your behind, and at last losing your discipline you begin to thrust into " + this.benoitMF("him", "her") + " with abandon, eager now for your peak. " + this.benoitMF("Benoit", "Benoite") + " pants as you really begin to fuck " + this.benoitMF("him", "her") + " and thrusts with you; the wetness of your arousal spatters against " + this.benoitMF("his", "her") + " thighs as your body slaps into the basilisk's tight muscles. " + this.benoitMF("He", "She") + " makes a harsh, bestial noise when " + this.benoitMF("he", "she") + " cums; " + this.benoitMF("his", "her") + " blind eyes roll as " + this.benoitMF("he", "she") + " clutches your back and shoots surge after surge of cum into your churning depths. The warmth of " + this.benoitMF("his", "her") + " jizz and " + this.benoitMF("his", "her") + " helpless bucking thrust you to your own orgasm; irrepressible pulses of pleasure overwhelm your mind and you can do nothing for long minutes except cry and squeal against the basilisk, clutching " + this.benoitMF("him", "her") + " back as you work " + this.benoitMF("his", "her") + " dick for every last drop.");
            // [Herm:
            if (this.player.hasCock()) this.outputText(" [EachCock] thickens and spurts in sympathy to your female high, spattering the floor with white paint.");

            this.outputText("\n\nYou puddle onto the packed earth floor and cuddle for a while, holding each other as you bask in the afterglow, silently listening to the far away bustle and clatter of the carnival.");

            this.outputText("\n\n“I am not really sure what I did to deserve you,” says " + this.benoitMF("Benoit", "Benoite") + " eventually, " + this.benoitMF("his", "her") + " voice barely above a raspy murmur in " + this.benoitMF("his", "her") + " throat. You give " + this.benoitMF("him", "her") + " a playful dig in the ribs and say you're only in it for the counter sceptic. " + this.benoitMF("He", "She") + " grins and the two of you get up, get dressed, and go your separate ways.");
        }
        else {
            this.outputText("For the moment you don't do anything; you simply stand back and let " + this.benoitMF("his", "her") + " hands slowly move across your frame. One of " + this.benoitMF("his", "her") + " hands comes to rest upon your " + this.player.nippleDescript(0) + "; as " + this.benoitMF("he", "she") + " gently teases and kneads the soft, sensitive flesh " + this.benoitMF("his", "her") + " other hand drift downwards, across your belly, around over the crack of your [butt] then down to cup your behind. Although " + this.benoitMF("he", "she") + " is familiar with your frame by now " + this.benoitMF("Benoit", "Benoite") + " never seems to stop being enthralled by your body; there is an unconscious frown of concentration on " + this.benoitMF("his", "her") + " face as " + this.benoitMF("his", "her") + " smooth hands move across your warm skin, as if " + this.benoitMF("he", "she") + " were mapping you in " + this.benoitMF("his", "her") + " mind's eye.");

            if (this.player.hasCock()) this.outputText("\n\n" + this.benoitMF("His", "Her") + " hands travel downwards until, with a small grin, " + this.benoitMF("he", "she") + " finds what " + this.benoitMF("he", "she") + " knows is there. " + this.benoitMF("He", "She") + " wraps " + this.benoitMF("his", "her") + " dry, smooth grasp around your semi-erect cock and moves it up and down, rubbing and coiling you until you are straining. You decide it's time to do some feeling yourself; you grasp and pinch at " + this.benoitMF("his", "her") + " tight, supple behind through " + this.benoitMF("his", "her") + " trousers, making " + this.benoitMF("him", "her") + " gasp as you move into " + this.benoitMF("him", "her") + ".");

            // begin copypasta
            this.outputText("" + this.benoitMF("His", "Her") + " hands trail further down, moving into your inner thighs, exploring your soft flesh until " + this.benoitMF("he", "she") + " touches your lips. You close your eyes and sigh as " + this.benoitMF("he", "she") + " slowly parts them with " + this.benoitMF("his", "her") + " smooth fingers and slides into your [vagina]. Although " + this.benoitMF("his", "her") + " breath is becoming increasingly heavy " + this.benoitMF("he", "she") + " also seems genuinely curious about you; with surprising gentleness " + this.benoitMF("his", "her") + " fingers travel over and around your moistening sex, exploring your every fold, working deeper and deeper as " + this.benoitMF("he", "she") + " does. You let " + this.benoitMF("him", "her") + " know what pleases you by sighing when " + this.benoitMF("he", "she") + " touches a sweet spot, moving deliberately with " + this.benoitMF("his", "her") + " finger's motions so " + this.benoitMF("he", "she") + " may give them better attention. " + this.benoitMF("He", "She") + " soon finds your [clit], beginning to bulge with need; slowly " + this.benoitMF("he", "she") + " circles it and then flicks at it, gently frigging you.");
            if (this.player.inHeat) this.outputText(" By now your vagina is practically gushing, your body's own deep-seated pheromone need stoked to blazing heights by the basilisk's gentle, painstaking exploration. You cannot stop yourself thrusting against " + this.benoitMF("his", "her") + " soaked hand, announcing how badly you want this with heavy moans.");

            this.outputText("\n\nThe scent of your arousal is in the air and as " + this.benoitMF("Benoit", "Benoite") + " inhales it, " + this.benoitMF("his", "her") + " own breath comes heavier. " + this.benoitMF("His", "Her") + " erection bulges in " + this.benoitMF("his", "her") + " long johns and you decide it's time for you to take charge; you push " + this.benoitMF("him", "her") + " against the wall, unbuckle " + this.benoitMF("him", "her") + " and let " + this.benoitMF("his", "her") + " trousers fall. Stoked by the pheromones simmering off your body, " + this.benoitMF("his", "her") + " long, thin, purple erection is straining and " + this.benoitMF("he", "she") + " arches " + this.benoitMF("his", "her") + " back and opens " + this.benoitMF("his", "her") + " mouth as you lay a hand on it. You know just from looking at " + this.benoitMF("his", "her") + " straining prick you're going to have to go slow for " + this.benoitMF("him", "her") + " not to shoot " + this.benoitMF("his", "her") + " bolt straight away; with a wicked smile your partner can't see, you suppose that such is your body's effect on " + this.benoitMF("him", "her") + " it may not even matter if " + this.benoitMF("he", "she") + " does. Still, as you once again lay " + this.benoitMF("his", "her") + " hands upon you, brace " + this.benoitMF("him", "her") + " against the wall and, with a sigh, slowly slide " + this.benoitMF("his", "her") + " length into your moistened [vagina], it is as gently as your eagerness can stand.");
            this.player.cuntChange(10, true, true, false);

            this.outputText("\n\nBenoit's dick is incredibly smooth and you move down onto it with slick ease. Rather than burying yourself onto it straight away, you stop with only a third of it in your wet depths and bring it out of you, dipping yourself slowly. You stop with " + this.benoitMF("his", "her") + " sensitive head just inside and work your [hips] around deliberately, sighing as it rotates around your slick walls. " + this.benoitMF("Benoit", "Benoite") + " moans and you feel " + this.benoitMF("his", "her") + " body tense; immediately you halt your movements and wait, only gradually beginning to gyrate and thrust again when " + this.benoitMF("he", "she") + " has calmed down. You slide more inside when you bend forwards again, this time leaving only " + this.benoitMF("his", "her") + " base outside of you; a sigh rolls from you as you feel " + this.benoitMF("him", "her") + " creeping further into your moist depths. " + this.benoitMF("He", "She") + " makes a bestial noise and tries to thrust himself into you and upon you; tutting mockingly, you pull yourself away from " + this.benoitMF("him", "her") + " and stop moving until, with what is evidently a huge force of will, the basilisk calms himself, backs himself against the wall and allows you to work " + this.benoitMF("him", "her") + ".");

            // [Small capacity:
            if (this.player.vaginalCapacity() < 30) this.outputText("\n\nYou slide back down onto " + this.benoitMF("him", "her") + ", cooing this time as you feel " + this.benoitMF("him", "her") + " bottom out with several inches still outside. " + this.benoitMF("His", "Her") + " thin member could not be more perfect for your tight sex; " + this.benoitMF("he", "she") + " rubs your walls up and down as you dreamily thrust in and out of " + this.benoitMF("his", "her") + " body, sending waves of pleasure washing through you.");
            else this.outputText("\n\nYou slide back down onto " + this.benoitMF("him", "her") + ", cooing this time as your groin meets " + this.benoitMF("his", "her") + " muscled thighs with a wet kiss, your sex swallowing " + this.benoitMF("his", "her") + " cock whole. You begin to ride " + this.benoitMF("him", "her") + " hard and slow, bending " + this.benoitMF("his", "her") + " cock upwards to push at your sensitive walls, waves of pleasure starting to wash through you.");

            this.outputText("\n\nYou keep at this for what feels like hours, stopping and starting, pulling and pushing deliberately to keep the basilisk you have backed into a corner under your control. The pace of the fuck is clearly agonising for " + this.benoitMF("Benoit", "Benoite") + "; " + this.benoitMF("he", "she") + " pants, tenses and gasps to the wet movement of your [vagina], " + this.benoitMF("his", "her") + " face and chest heaving with extreme arousal, but " + this.benoitMF("he", "she") + " lets you stay in command, eventually giving up on anything but lying back and letting you have your way with " + this.benoitMF("him", "her") + ". To give " + this.benoitMF("him", "her") + " something to do, you grab " + this.benoitMF("his", "her") + " hands and lay them upon your [chest]; after exploring your flesh for a time, " + this.benoitMF("he", "she") + " finds your [nipple]s and begins to knead them, placing each nub between two fingers and rubbing them insistently.");
            // [Lactation:
            if (this.player.lactationQ() > 100) {
                this.outputText(" You moan as your breasts reward " + this.benoitMF("his", "her") + " attention with spurts of milk; " + this.benoitMF("he", "she") + " starts in genuine amazement when they ");
                if (!this.player.isTaur()) this.outputText("hit " + this.benoitMF("him", "her") + " in the face");
                else this.outputText("trickle over " + this.benoitMF("his", "her") + " fingers");
                this.outputText(". \"<i>Mammals are so damn weird,</i>\" " + this.benoitMF("he", "she") + " mutters, making you giggle.");
            }

            this.outputText("\n\nYour lust ratchets up as " + this.benoitMF("his", "her") + " warm hands continue to move, and at last losing your discipline you thrust into " + this.benoitMF("him", "her") + " with abandon, eager now for your peak. " + this.benoitMF("Benoit", "Benoite") + " pants as you really begin to fuck " + this.benoitMF("him", "her") + " and begins to thrust with you; you clutch " + this.benoitMF("his", "her") + " neck and bite into " + this.benoitMF("his", "her") + " shoulder as you pound into each other, the wetness of your arousal spattering against " + this.benoitMF("his", "her") + " thighs as your body slaps into the basilisk's tight muscles. " + this.benoitMF("He", "She") + " makes a harsh, bestial noise when " + this.benoitMF("he", "she") + " cums; " + this.benoitMF("his", "her") + " blind eyes roll as " + this.benoitMF("he", "she") + " clutches your back and shoots surge after surge of cum into your churning depths. The warmth of " + this.benoitMF("his", "her") + " jizz and " + this.benoitMF("his", "her") + " helpless bucking thrust you to your own orgasm; irrepressible pulses of pleasure overwhelm your mind and you can do nothing for long minutes except cry and squeal on top of the basilisk, clutching " + this.benoitMF("him", "her") + " back as you work " + this.benoitMF("his", "her") + " dick for every last drop of cum.");
            if (this.player.hasCock()) {
                // [(not horse)
                if (!this.player.isTaur()) this.outputText(" Stuck between your two burning bodies, y");
                else this.outputText("Y");
                this.outputText("our " + this.player.cockDescript(0) + " spurts in sympathy to your female high, soaking ");
                if (!this.player.isTaur()) this.outputText("both of you");
                else this.outputText("the dry dirt");
                this.outputText(" with white.");
            }

            this.outputText("\n\nYou puddle onto the packed earth floor and cuddle for a while, holding each other as you bask in the afterglow, silently listening to the far away bustle and clatter of the carnival.");

            this.outputText("\n\n\"<i>I am not really sure what I did to deserve you,</i>\" says " + this.benoitMF("Benoit", "Benoite") + " eventually, " + this.benoitMF("his", "her") + " voice barely above a raspy murmur in " + this.benoitMF("his", "her") + " throat. You give " + this.benoitMF("him", "her") + " a playful dig in the ribs and say you're only in it for the counter sceptic. " + this.benoitMF("He", "She") + " grins and the two of you get up, get dressed, and go your separate ways.");
        }
        this.benoitKnocksUpPCCheck();
        this.benoitAffection(2);
        this.flags[kFLAGS.BENOIT_TIMES_SEXED_FEMPCS]++;
        this.player.orgasm('Vaginal');
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Feathery hair-pin
    public equipUnequipHairPin(): void {
        const keyItemNum: number = this.player.hasKeyItem("Feathery hair-pin");
        if (keyItemNum < 0) return;

        this.clearOutput();
        this.credits.authorText = "MissBlackthorne";
        if (this.player.keyItemv1("Feathery hair-pin") > 0) {
            // unequip it
            if (this.player.hair.length > 0)
                this.outputText("You take the feathery hair-pin " + this.benoitMF("Benoit", "Benoite") + " gave to you out of your " + this.player.hairDescript()
                    + " and put it back into your inventory.");
            else
                this.outputText("You remove the feathery hair-pin " + this.benoitMF("Benoit", "Benoite") + " gave to you from your bald head and put it back into"
                    + " your inventory. It was surprisingly easy.");
            this.player.keyItems[keyItemNum].value1 = 0; // not equipped
            this.player.keyItems[keyItemNum].value2 = 0; // if its not equipped it won't trigger any TF, right? ^^
        } else {
            // equip it
            if (this.player.hair.type == Hair.GOO)
                this.outputText("You try to slide the hair pin into your " + this.player.hairDescript() + ", but their semi-liquid state isn't enough to hold it in"
                    + " place. The pin falls to the ground with a wet splat the moment you let it go. With a sigh you clean it up and then you put"
                    + " it back.");
            else if (this.player.cor >= 55)
                this.outputText("You go to slide the hair-pin into your " + this.player.hairDescript() + ", but the moment it touches your scalp it heats up,"
                    + " causing you to drop it in shock. Seems it doesn't want you dirty its purity... you pick it up and put it back into your"
                    + " inventory for now.");
            else {
                if (this.player.hair.length > 0)
                    this.outputText("You slide the hair-pin " + this.benoitMF("Benoit", "Benoite") + " gave you into your " + this.player.hairDescript()
                        + ", briefly admiring yourself in a nearby puddle before returning to your adventures.");
                else
                    this.outputText("You take the feathery hair-pin " + this.benoitMF("Benoit", "Benoite") + " gave to you out of your inventory and then you press"
                        + " it onto your bald head. To your surprise it sticks to your head as though you had hair to hold it in place.");

                this.player.keyItems[keyItemNum].value1 = 1; // equipped
                this.player.keyItems[keyItemNum].value2 = 1; // just equipped it, but it didn't trigger the TF(-event) so far
            }
        }
        this.outputText("\n");
        this.doNext(this.inventory.checkKeyItems);
    }

    // Basilisk Eyes
    private convertToBassyEyes(): void {
        const eyesGranted: number = this.flags[kFLAGS.BENOIT_BASIL_EYES_GRANTED] + 1;
        this.clearOutput();
        this.credits.authorText = "MissBlackthorne";
        if (eyesGranted <= 1) { // First time
            this.outputText("You tell [benoit name] that you've weighed up the pros and cons and that you want to become more of a basilisk. [benoit Ey]"
                + " nods as [benoit ey] feels [benoit eir] way across the counter before rummaging about underneath.");
            this.outputText("\n\n\"<i>I 'ave found a way to transform your eyes, but I 'ave no idea if it will even work."
                + " Ze one oo told me about zis was insistent zat ze recipe relies on you being a basilisk enough already.</i>\"");
            this.outputText("\n\nAs the blind basilisk begins to pull out bottle after bottle from under the counter, you wonder what [benoit ey] means.");
            this.outputText("\n\n\"<i> 'Opefully, you 'aving birthed so many will be enough.</i>\" [benoit ey] mutters as [benoit ey] pulls out a large bowl. "
                + "[benoit Ey] begins to sloppily pour several measures from the bottles into the bowl, stirring it now and then with a wooden spoon."
                + " The mixture seems to be a flat matte grey when [benoit ey] stops. Placing [benoit eir] palm over the bowl "
                + "[benoit ey] cuts it open with a claw, hissing at the pain as droplets of blood fall in with a small splash. "
                + "[benoit Ey] brings a finger to one of [benoit eir] milky eyes, wiping a tear drop from it before letting that slide down into the mixture too.");
            this.outputText("\n\nAs [benoit name] goes to fetch a cloth to cover the cut, you watch in awe as the once matte mixture takes on a wet sheen, like an endless grey seeing pool."
                + " It reminds you of the eyes of the basilisks in the mountains and flinch away before realising how silly that is.");
            this.outputText("\n\n\"<i>Are you going to drink it zen? Or am I to close my shop all day for nuzzing?</i>\" [benoit name] says, startling you,"
                + " having not noticed the blind basilisk return, being that you were so fixated on the mixture.");
            this.outputText("\n\nWith a swift nod you grab the bowl, draining it before realising your non-verbal response. You groan,"
                + " the mixture thick on your tongue though not tasting overly foul. Your eyelids feel heavy, like they were made of stone."
                + " You tell [benoit name] you think you need to rest for a moment, the basilisk now hurrying you to a corner of store room where a pile of fabrics are. "
                + "[benoit Ey] helps you onto them as you lay back and your eyes close.");
            this.doNext(this.convertToBassyEyesPageTwo);
            return;
        } else {
            this.outputText("You tell [benoit name], that you've lost the basilisk eyes and ask [benoit em], if "
                + "[benoit ey] could grant them to you again.");
            if (eyesGranted == 2) { // Second time
                this.outputText("\n\n[benoit name] says: \"<i>Oh, you’ve lost zem?"
                    + " Not what I expected to hear today, but very well [name]. I shall make ze potion...</i>\" ");
            } else if (eyesGranted >= 3 && eyesGranted < 6) { // Third time and later
                this.outputText("\n\n[benoit name] says: \"<i>You’ve lost zem again?"
                    + " Not what I expected to hear today, but very well [name]. I shall make ze potion...</i>\" ");
            } else /*if (eyesGranted >= 6)*/ { // Sixth time and later
                this.outputText("\n\n[benoit name] says: \"<i>You’ve lost zem again?"
                    + " You should be more careful not to lose zem so often [name]!</i>\" ");
            }
            this.outputText("[benoit name] pads over to the section of the counter, pulling out bottles again");
            if (eyesGranted >= 6) this.outputText(", grumbling as [benoit ey] does");
            this.outputText(".\n\"<i>Here we go... For ze " + Benoit.num2Text2(eyesGranted) + " time</i>\", [benoit ey] mumbles, though you can tell, [benoit ey]'s not mad");
            this.outputText(eyesGranted < 6 ? "." : ", simply tired of making the potion so often. Maybe you should be a bit more careful in the future?");
            this.outputText("\n\nWithin minutes a bowl is slid to you, a familiar grey mixture sloshing within. You drain the bowl and move to lay down.");
            this.outputText("\n\nWhen you wake you open your eyes slowly, waiting to adjust. You thank [benoit name] for [benoit eir] help with a small kiss on the snout"
                + " before leaving, once again feeling the compulsion to look deep into the grey orbs of basilisks fade as you catch your reflection in the mirror.");
        }
        this.convertToBassyEyesFinal();
    }

    private convertToBassyEyesPageTwo(): void {
        this.clearOutput();
        this.credits.authorText = "MissBlackthorne";
        this.outputText("When you wake, you open your eyes and cry out, quickly closing them again. Gods it's bright! [benoit name] rushes over to you and places a hand on your shoulder.");
        this.outputText("\n\n\"<i>What iz it? Did somesing 'appen? You're not 'urt are you?</i>\" [benoit ey] says in an increasing worry. You put your hand to "
            + "[benoit eirs] and say that you're fine, everything was just a little bright. You open your eyes again, this time slowly, letting your eyes adjust."
            + " You ask the basilisk if [benoit ey] could get you a mirror, curious if the potion has worked. "
            + "[benoit Ey] rushes off with a nod and comes back with a small hand mirror.");
        this.outputText("\n\n\"<i>Well?</i>\"");
        this.outputText("\n\nYour eyes widen as you look in the mirror, the grey reptilian orbs staring back at you catching you off guard. They're absolutely mesmerising,"
            + " the swirling greys and wet sheen parted by a thin black slit of a pupil. While you feel you could look into their depths forever,"
            + " you don't feel any kind of compulsion like when you look into other basilisk's eyes. Somehow you think you'll be immune to their gaze from now on,"
            + " though it does make sense. After all, why would a basilisk ever try to use their gaze on one another?");
        this.outputText("\n\nYou smile and put down the mirror, sharing that it worked and thanking [benoit name] with a kiss on the tip of [benoit eir] scaled snout. "
            + "[benoit Eir] scales colour a deeper grey-green, waving a hand in a nonchalant gesture.");
        this.outputText("\n\n\"<i>It was nussing, a gift from me to you, for all you've done.</i>\" [benoit ey] says shyly before returning to a more normal business like demeanor."
            + " You are subsequently shoo’ed from the store, though not without a sticky but loving lick to the cheek from the basilisk.");
        this.convertToBassyEyesFinal();
    }

    private convertToBassyEyesFinal(): void {
        this.player.eyes.type = Eyes.BASILISK;
        this.outputText("\n\n(<b>Your eyes are now basilisk eyes!</b>)");
        this.flags[kFLAGS.BENOIT_BASIL_EYES_GRANTED]++;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Bas. Womb (not for horses)
    private tryToConvertToBassyWomb(): void {
        this.clearOutput();
        // [Ingredients not in inventory: ]
        // A double dose of ovi-elixer, a bottle of reptilum, goblin ale and some basilisk blood would probably do...
        if (!(this.player.hasItem(this.consumables.OVIELIX, 2) && this.player.hasItem(this.consumables.REPTLUM) && this.player.hasItem(this.consumables.GOB_ALE))) {
            this.outputText("You don't have the necessary ingredients to attempt this yet. You recall " + this.benoitMF("Benoit", "Benoite") + " mentioning that you would need Reptilum, two Ovi Elixirs, and Goblin Ale.");
            this.doNext(this.benoitIntro);
        }
        /*else if (player.isTaur()) {
            outputText("\"<i>Forgive me, [name],</i>\" Benoit says, clearly troubled, as you begin hauling out the ingredients and announcing your plan.  \"<i>I sink your body is already stressed enough wis 'aving to pump so little blood so far... I would razer you not take furzer risks on my account until your form is more... compact.  I cannot be a part of zis... 'owever much I would like to.  You mean too much to me, you see.</i>\"");
            outputText("\n\nLeft speechless by " + benoitMF("his","her") + " frankness, you can only sweep the items back into your bag.");
            //return to shop menu
            doNext(benoitIntro);
        }*/
        // Ingredients in inventory:
        else {
            this.player.consumeItem(this.consumables.OVIELIX, 2);
            this.player.consumeItem(this.consumables.REPTLUM);
            this.player.consumeItem(this.consumables.GOB_ALE);
            this.outputText("You ferret out the ingredients you have collected and begin to bang them onto the counter in front of " + this.benoitMF("Benoit", "Benoite") + ", telling " + this.benoitMF("him", "her") + " that you've got what " + this.benoitMF("he", "she") + " needs. Pierre barks excitedly at the noise.");

            this.outputText("\n\n\"<i>And what is zat?</i>\" the basilisk says, bewildered. You explain you can whip something up which will give you a basilisk womb - and hence, female basilisk kids. " + this.benoitMF("Benoit", "Benoite") + " opens " + this.benoitMF("his", "her") + " mouth then closes it again; it takes " + this.benoitMF("him", "her") + " a while to properly compute these words. \"<i>But... but zat is completely impossible, [name]!</i>\" " + this.benoitMF("he", "she") + " says eventually, wringing " + this.benoitMF("his", "her") + " hands. \"<i>'Ow do you know you won't just poison yourself? Or, or turn yourself into a newt or somesing? Please... don't 'urt... I should never 'ave said...</i>\" " + this.benoitMF("He", "She") + " lapses into silence as you grab a pewter bowl from a nearby shelf and a wooden spoon from a container full of old utensils, and begin to mix the various ingredients together. You pour the ovi-elixers into the goblin ale, beating them together until a fairly unpleasant sulfuric smell fills the close market stall. Carefully you dribble the reptilum in whilst continuing to stir, until the smell changes to that of cooking sherry. You frown at the mixture. It feels like it's missing something... Casually, you ask " + this.benoitMF("Benoit", "Benoite") + " to open " + this.benoitMF("his", "her") + " hand to you, whilst plucking a kitchen knife from the utensil container. " + this.benoitMF("He", "She") + " barks in pain as you run the blade across " + this.benoitMF("his", "her") + " palm and then hold " + this.benoitMF("his", "her") + " hand firmly over the bowl. Drops of dark red blossom into the mixture, and as you carefully stir the potion turns a green-grey color: the color of " + this.benoitMF("Benoit", "Benoite") + "'s scales.");

            this.outputText("\n\n\"<i>You 'ave been in ze sun too long [name],</i>\" says the basilisk harshly, clutching " + this.benoitMF("his", "her") + " hand. \"<i>Go 'ave a lie down and zen resink drinking whatever it is you 'ave just concocted. I never asked for you to try zis.</i>\" You feel a moment of doubt... but no, you've poured good ingredients into this and you sure as hell aren't going to wimp out now. You give " + this.benoitMF("Benoit", "Benoite") + "'s uninjured hand a reassuring squeeze and say with as much confidence as you can muster that you know what you're doing. With that, you cup the bowl, and with only a moment's hesitation, drink deeply.");

            this.outputText("\n\nThe mixture has a lingering bite of mint overlaying the all-consuming burn of alcohol; you are reminded vaguely of the sticky liqueurs that populated the recesses of cupboards back home. You smack your lips and plonk the bowl back down with deliberate loudness after you have finished; " + this.benoitMF("Benoit", "Benoite") + " clutches the counter tensely as you wait. You haven't died straight away, so that's a positive... an immense gurgle comes from your belly and you double over as your insides shift and the contents of your gut churn. The sensation is not painful exactly but you feel like you've lost all control of your insides; you clutch your sides and try to breathe levelly as your stomach turns upside down and makes a sound like trapped gas. Eventually you feel something like a bubble form just below your gut; slowly your insides settle as the bubble grows larger and larger, until the sensation slowly fades. Cautiously you walk back and forth a few times, before poking your tummy.");
            // [No oviposition:
            if (this.player.findPerk(PerkLib.Oviposition) < 0) this.outputText(" You feel slightly bloated, but otherwise fine; you sense that you can lay eggs of your own volition now.");
            else this.outputText("You feel slightly bloated, but otherwise fine; you sense that were you to get impregnated by basilisk seed, the eggs you produce would be pure basilisk.");

            this.outputText("\n\n\"<i>[name]?</i>\" says " + this.benoitMF("Benoit", "Benoite") + " nervously. \"<i>Are you all right? Shall I call ze sawbones? I will call ze sawbones. 'E is mostly good at taking people apart and putting zem back togezzer again, but I am sure 'e can give you a good purgative if we rush...</i>\" You toy with the idea of staging a dramatic allergic reaction, but deciding not to fray " + this.benoitMF("his", "her") + " nerves any further you tell " + this.benoitMF("him", "her") + " you feel absolutely fine. Indeed, stroking your belly, you are almost certain that it worked.");

            this.outputText("\n\n\"<i>Really?</i>\" The basilisk is off " + this.benoitMF("his", "her") + " feet and around the counter faster than you gave " + this.benoitMF("him", "her") + " credit for. \"<i>You are not just high from ze goblin ale?</i>\" " + this.benoitMF("He", "She") + " holds you around the waist and breathes you in slowly. \"<i>You... you are not joking.</i>\" " + this.benoitMF("He", "She") + " sounds shell-shocked. \"<i>You really did it. You... really did mean to do zis.</i>\"");

            // put some tag here to track dis shit.
            this.flags[kFLAGS.BENOIT_TESTED_BASILISK_WOMB] = .5;

            // [Lust 30 or more:
            if (this.player.lust >= 33) {
                this.outputText(" You grin and say you're not sure it worked, but you suppose there's only one real way of finding out...");
                if (this.player.tallness <= 78 && !this.player.isTaur()) this.outputText(" The basilisk is still for a moment, and then with a sudden surge of movement, grabs you by the waist and hoists you over " + this.benoitMF("his", "her") + " shoulder. You squeal in mock terror as " + this.benoitMF("he", "she") + " hauls you as fast as " + this.benoitMF("he", "she") + " can into the back room, knocking over half " + this.benoitMF("his", "her") + " stock as " + this.benoitMF("he", "she") + " does.");
                else this.outputText(" The basilisk is still for a moment, and then with a sudden surge of movement, grabs you by the waist and frenetically attempts to hoist you over " + this.benoitMF("his", "her") + " shoulder. You are far too big for " + this.benoitMF("him", "her") + " though; after several valiant attempts, " + this.benoitMF("he", "she") + " collapses against a shelf. Laughing, you pick the stricken, panting reptile up, hoist " + this.benoitMF("him", "her") + " over your own shoulder, and navigate a path into the back room.");
                this.doNext(this.createCallBackFunction(this.suggestSexAfterBasiWombed, false));
                return;
            }
            else this.outputText(" You grin and say you're not even sure it worked... but you'll be back at some point to try it out, and " + this.benoitMF("he", "she") + "'d better be ready for when you do. You gently pry yourself out of " + this.benoitMF("his", "her") + " grip and leave as deliberately as you can, aware of the beguiling, invisible scent you are leaving for the stunned, silent basilisk to simmer in.");
            this.doNext(this.camp.returnToCampUseOneHour);
        }
    }

    private suggestSexAfterBasiWombed(later: boolean = true): void {
        this.clearOutput();
        // Subsequent \"<i>Suggest</i>\" if initial sex option not taken:
        if (later) {
            this.outputText("You smile coquettishly and ask if " + this.benoitMF("he", "she") + "'s interested in taking your new body for a... test drive. ");
            // (6'6 or less:
            if (this.player.tallness <= 78 && !this.player.isTaur()) this.outputText("The basilisk is still for a moment, and then with a sudden surge of movement, grabs you by the waist and hoists you over " + this.benoitMF("his", "her") + " shoulder. You squeal in mock terror as " + this.benoitMF("he", "she") + " hauls you as fast as " + this.benoitMF("he", "she") + " can into the back room, knocking over half " + this.benoitMF("his", "her") + " stock as " + this.benoitMF("he", "she") + " does.");
            else this.outputText("The basilisk is still for a moment, and then with a sudden surge of movement, grabs you by the waist and frenetically attempts to hoist you over " + this.benoitMF("his", "her") + " shoulder. You are far too big for " + this.benoitMF("him", "her") + " though; after several valiant attempts, " + this.benoitMF("he", "she") + " collapses against a shelf. Laughing, you pick the stricken, panting reptile up, hoist " + this.benoitMF("him", "her") + " over your own shoulder, and navigate a path into the back room.");
            this.outputText("\n\n");
        }
        if (!this.player.isTaur()) {
            // Both go to: [>6'6:
            if (this.player.tallness > 78) this.outputText("You haul your lizard boy into the cramped space of the backroom before gently setting " + this.benoitMF("him", "her") + " down. Now that your gut has settled you feel imbued with an odd, ripe sensation; your belly bulges ever-so-slightly with unfertilized eggs and you feel red, soft and ready. You begin to disrobe eagerly; having recovered himself slightly, " + this.benoitMF("Benoit", "Benoite") + " shrugs out of " + this.benoitMF("his", "her") + " trousers, reaching out to you before stopping. Grinning kindly at the emasculated basilisk, you lower yourself onto the floor, spread your [hips] casually and then ask if " + this.benoitMF("he", "she") + " see... smells anything interesting.");
            else this.outputText("" + this.benoitMF("Benoit", "Benoite") + " staggers into the back room, bumping into several things as " + this.benoitMF("he", "she") + " sets you down, thankfully onto a clear space on the ground. " + this.benoitMF("He", "She") + " leans into you, " + this.benoitMF("his", "her") + " weight pushing you onto the ground, hands flying over your [armor], fumbling off clasps and belts when " + this.benoitMF("he", "she") + " finds them. Now that your gut has settled you feel imbued with an odd, ripe sensation; your belly bulges ever-so-slightly with unfertilized eggs and you feel red, soft and ready. You work with " + this.benoitMF("him", "her") + ", wriggling out of your clothes and ripping " + this.benoitMF("his", "her") + " own trousers off, spreading your [hips] eagerly as " + this.benoitMF("his", "her") + " long, smooth prick springs to attention.");

            this.outputText("\n\nThe basilisk needs no further invitation. In a moment " + this.benoitMF("he", "she") + " is upon you, " + this.benoitMF("his", "her") + " tight, muscled chest pressed against your [chest], " + this.benoitMF("his", "her") + " flat stomach rubbing over your own fertile belly and the head of " + this.benoitMF("his", "her") + " dick pushed against your moist lips.");
            if (this.player.hasCock()) this.outputText(" " + this.benoitMF("He", "She") + " deliberately rubs himself up and down your body, and the [cock] trapped between your warm bodies quickly hardens against the warm, smooth friction.");
            this.outputText(" Despite " + this.benoitMF("his", "her") + " blindness, " + this.benoitMF("he", "she") + " slides straight into your moist depths, making you coo as " + this.benoitMF("his", "her") + " hard, smooth spur glides across your sensitive walls, slowly bringing himself out before thrusting himself in again, working more and more of " + this.benoitMF("his", "her") + " length into you. Never quite able to control himself around your body, it's obvious in the strain in " + this.benoitMF("his", "her") + " face and the raggedness of " + this.benoitMF("his", "her") + " breath against your skin that " + this.benoitMF("he", "she") + " is exercising every restraint " + this.benoitMF("he", "she") + " has not to fuck you into the ground; " + this.benoitMF("he", "she") + " pushes " + this.benoitMF("his", "her") + " dick upwards with each return thrust to bump deliberately against your [clit], sending irresistible spasms of pleasure chiming through you. Pushed inexorably upwards you curl an arm around " + this.benoitMF("his", "her") + " neck, kiss " + this.benoitMF("his", "her") + " nose and grit your teeth, then whisper into " + this.benoitMF("his", "her") + " ear to stop holding back. " + this.benoitMF("Benoit", "Benoite") + " pauses for a moment to gather " + this.benoitMF("his", "her") + " breath, hilted entirely in your wet cunt, then hooks " + this.benoitMF("his", "her") + " hips around yours, entrapping you around " + this.benoitMF("his", "her") + " body, before beginning to fuck your softened, ripe body like a jackhammer. " + this.benoitMF("He", "She") + " pounds into you with everything " + this.benoitMF("he", "she") + "'s got, clenching you as your gushing [vagina] deliriously spatters fluids across your entwined bodies. Lost in rut now, " + this.benoitMF("Benoit", "Benoite") + " licks your face with " + this.benoitMF("his", "her") + " long tongue, the soft, sticky pressure against your reddened cheeks only seeming to make the contrasting sensation of " + this.benoitMF("his", "her") + " long prick taking you deep even more overwhelming.");
            this.player.cuntChange(14, true, true, false);

            this.outputText("\n\nYou cannot stop yourself from screaming as your orgasm hits, your pussy clenching and wringing " + this.benoitMF("Benoit", "Benoite") + "'s smooth dick as " + this.benoitMF("he", "she") + " continues to slam himself into you until " + this.benoitMF("he", "she") + " can take your milking no longer and cums in sympathy, clutching you as " + this.benoitMF("he", "she") + " fountains thick, warm cum into your fertile depths. Having your lower body held in place like this makes your orgasm all the more overpowering; you wriggle futilely against the basilisk's strong legs, unable to thrash away the unbearable pleasure.");

            this.outputText("\n\nAfter minutes of being locked in orgasm together, you finally ride the last of it out. You stay entwined for the moment, your hands roaming over each other as you enjoy the afterglow.");

            this.outputText("\n\n\"<i>Do you sink it will really work?</i>\" says " + this.benoitMF("Benoit", "Benoite") + " eventually, " + this.benoitMF("his", "her") + " voice so low it is barely above a murmur. \"<i>What if I can only give you males?</i>\" The thought has already occurred to you, but right now you are feeling in a playful mood. " + this.benoitMF("His", "Her") + " dick is still inside you and has barely softened, despite the volume of cum it is plugging into you; grinning, you push into " + this.benoitMF("his", "her") + " chest and slide your legs over " + this.benoitMF("him", "her") + " until you are on top of " + this.benoitMF("him", "her") + ". You very slowly work your hips in a circular motion, back and forth, deliberately working the cock wedged inside of you until it starts to inexorably harden again; " + this.benoitMF("Benoit", "Benoite") + " closes " + this.benoitMF("his", "her") + " eyes and grunts as you abuse " + this.benoitMF("his", "her") + " aching sex. Not willing to let " + this.benoitMF("him", "her") + " simply sit back and take it, you slide your grip around " + this.benoitMF("his", "her") + " wrists and silently place them on your [nipples]. " + this.benoitMF("He", "She") + " dumbly gets to work, gingerly moving " + this.benoitMF("his", "her") + " hands, " + this.benoitMF("his", "her") + " fingers pressing deep into your flesh. As " + this.benoitMF("he", "she") + " brushes and squeezes you softly tell " + this.benoitMF("him", "her") + " that whether or not you are able to give birth to female basilisks, " + this.benoitMF("he", "she") + "'s the father to your children now, and that mommy needs - you thrust your hips as far as you can, bending " + this.benoitMF("his", "her") + " dick backwards to make your point - service. Lots and lots of service. Driven by your words and your merciless sex, " + this.benoitMF("Benoit", "Benoite") + " closes " + this.benoitMF("his", "her") + " eyes, squeezes your nipples between " + this.benoitMF("his", "her") + " fingers and helplessly orgasms a second time, spurting one or two more gobs of cum into you before " + this.benoitMF("his", "her") + " cock flexes fruitlessly against your sopping walls.");

            this.outputText("\n\nHaving milked your stud entirely dry, you dismount, clean yourself up and get dressed. Before you can leave, " + this.benoitMF("Benoit", "Benoite") + " feels around and pulls you into a tight hug.");

            this.outputText("\n\n\"<i>Bring ze eggs 'ere,</i>\" " + this.benoitMF("he", "she") + " says huskily. \"<i>'Owever zey turn out, I would be honored to raise ze shildren of such a woman as you.</i>\" You give " + this.benoitMF("him", "her") + " a playful punch and say " + this.benoitMF("he", "she") + " may regret those words when " + this.benoitMF("he", "she") + "'s got a dozen tiny, scaly yous tearing up " + this.benoitMF("his", "her") + " shop. You part and take your leave, " + this.benoitMF("his", "her") + " hoarse, slightly scared laughter in your ears.");
        }
        else {
            this.outputText("You haul your lizard boy into the cramped space of the backroom before gently setting " + this.benoitMF("him", "her") + " down. Now that your gut has settled, you feel imbued with an odd, ripe sensation; your horse belly bulges ever so slightly with unfertilized eggs and you feel red, soft and ready. You begin to shrug your clothes off eagerly; having recovered himself slightly " + this.benoitMF("Benoit", "Benoite") + " shrugs out of " + this.benoitMF("his", "her") + " trousers, reaching out to you before stopping, blushing furiously. Grinning kindly at the emasculated basilisk, you lower yourself onto the floor, flare your [hips] casually and then ask if " + this.benoitMF("he", "she") + " see... smells anything interesting.");
            this.outputText("\n\nThe basilisk needs no further invitation. In a moment " + this.benoitMF("he", "she") + " is upon you, " + this.benoitMF("his", "her") + " tight, muscled chest is pressed against your [ass], " + this.benoitMF("his", "her") + " hands moving over your own fertile belly and the head of " + this.benoitMF("his", "her") + " dick pushed against your moist [vagina].");
            // [Herm:
            if (this.player.hasCock()) this.outputText(" " + this.benoitMF("He", "She") + " deliberately moves " + this.benoitMF("his", "her") + " hand over [oneCock] before trapping it in " + this.benoitMF("his", "her") + " warm grasp.  It quickly hardens against " + this.benoitMF("his", "her") + " warm, smooth friction.");
            this.outputText(" Used to your body now despite " + this.benoitMF("his", "her") + " blindness, " + this.benoitMF("he", "she") + " slides straight into your moist depths, making you coo as " + this.benoitMF("his", "her") + " hard, smooth spur glides across your sensitive walls, slowly bringing himself out before thrusting himself in again, working more and more of " + this.benoitMF("his", "her") + " long length into you.  Never quite able to control himself around your body, it's obvious in the strain of the muscles pressed against you and the raggedness of " + this.benoitMF("his", "her") + " breath upon your skin that " + this.benoitMF("he", "she") + " is exercising every restraint " + this.benoitMF("he", "she") + " has not to fuck you into the ground; " + this.benoitMF("he", "she") + " pushes " + this.benoitMF("his", "her") + " dick downwards with each return thrust to bump deliberately against your [clit], sending irresistible spasms of pleasure chiming through you. You slowly move forwards until your arms are braced against the wall, before gritting over your shoulder to " + this.benoitMF("him", "her") + " to stop holding back. " + this.benoitMF("Benoit", "Benoite") + " pauses for a moment to gather " + this.benoitMF("his", "her") + " breath, hilted entirely in your wet cunt, then hooks " + this.benoitMF("his", "her") + " strong arms around your back end, entrapping you around " + this.benoitMF("his", "her") + " body, before beginning to fuck your softened, ripe body like a jackhammer. " + this.benoitMF("He", "She") + " pounds into you with everything " + this.benoitMF("he", "she") + "'s got, clenching you as your gushing [vagina] deliriously spatters fluids across your entwined bodies.");
            this.player.cuntChange(14, true, true, false);

            this.outputText("\n\nYou cannot stop yourself from screaming as your orgasm hits, your pussy clenching and wringing " + this.benoitMF("Benoit", "Benoite") + "'s smooth dick as " + this.benoitMF("he", "she") + " continues to slam himself into you until " + this.benoitMF("he", "she") + " cannot take your milking any longer and cums in sympathy, clutching you as " + this.benoitMF("he", "she") + " fountains thick, warm cum into your fertile depths. Having your lower body held in place like this makes your orgasm all the more overpowering; you wriggle futilely against the basilisk's strong legs, unable to thrash away the unbearable pleasure.");

            this.outputText("\n\nAfter what seems like hours of being locked in orgasm together, you finally ride the last of it out. You stay entwined for the moment, your hands roaming over each other as you enjoy the afterglow.");

            this.outputText("\n\n“Do you sink it will really work?” says " + this.benoitMF("Benoit", "Benoite") + " eventually, " + this.benoitMF("his", "her") + " voice so low it is barely above a murmur. “What if I can only give you males?” The thought has already occurred to you, but you are feeling in a playful mood. " + this.benoitMF("His", "Her") + " dick is still inside you and has barely softened, despite the volume of cum it is plugging into you; grinning, you push backwards, sitting yourself down so that " + this.benoitMF("he", "she") + " is trapped under your bestial weight. You look over your shoulder and lock eyes with " + this.benoitMF("him", "her") + " as you very slowly work your powerful hips in a circular motion, back and forth, deliberately working the cock wedged inside of you until it starts to inexorably harden again; " + this.benoitMF("Benoit", "Benoite") + " closes " + this.benoitMF("his", "her") + " eyes and grunts as you abuse " + this.benoitMF("his", "her") + " aching sex. You softly tell " + this.benoitMF("him", "her") + " as you wring " + this.benoitMF("him", "her") + " that whether or not you are able to give birth to female basilisks, " + this.benoitMF("he", "she") + "'s the father to your children now and that mommy needs- you thrust your hips as far forwards as you can, bending " + this.benoitMF("his", "her") + " dick backwards to make your point - service. Lots and lots of service. Driven by your words and your merciless sex, " + this.benoitMF("Benoit", "Benoite") + " closes " + this.benoitMF("his", "her") + " eyes, clutches your flanks and helplessly orgasms a second time, spurting one or two more gobs of cum into you before " + this.benoitMF("his", "her") + " cock flexes fruitlessly against your sopping walls.");

            this.outputText("\n\nHaving milked your stud entirely dry, you get to your hooves, clean yourself up and get dressed. Before you can leave, " + this.benoitMF("Benoit", "Benoite") + " feels around and pulls your upper half into a tight hug.");

            this.outputText("\n\n“Bring ze eggs ere,” " + this.benoitMF("he", "she") + " says huskily. “Owever zey turn out, I would be honored to raise ze shildren of such a woman as you.” You give " + this.benoitMF("him", "her") + " a playful punch and say " + this.benoitMF("he", "she") + " may regret those words when " + this.benoitMF("he", "she") + "'s got a dozen tiny scaly yous tearing up " + this.benoitMF("his", "her") + " shop. You part and take your leave, " + this.benoitMF("his", "her") + " hoarse, slightly scared laughter in your ears.");
        }
        this.flags[kFLAGS.BENOIT_TESTED_BASILISK_WOMB] = 1;
        this.benoitKnocksUpPCCheck();
        // (Oviposition perk added)
        this.player.createPerk(PerkLib.BasiliskWomb, 0, 0, 0, 0);
        this.outputText("\n\n(<b>Perk Unlocked: Basilisk Womb - You can now give birth to female basilisks.</b>)");
        if (this.player.findPerk(PerkLib.Oviposition) < 0) {
            this.player.createPerk(PerkLib.Oviposition, 0, 0, 0, 0);
            this.outputText("\n(<b>Perk Unlocked: Oviposition - You will now regularly lay unfertilized eggs.</b>)");
        }
        if (this.player.pregnancyType == PregnancyStore.PREGNANCY_BASILISK) this.player.knockUpForce(PregnancyStore.PREGNANCY_BENOIT, this.player.pregnancyIncubation);
        this.doNext(this.camp.returnToCampUseOneHour);
        this.player.orgasm('Vaginal');
        this.dynStats("sen", -2);
    }

    // PC laying
    // happens only at night, after all other night events
    // PC lays 2 eggs per 10 points of Fertility they have
    public popOutBenoitEggs(): void {
        if (this.player.vaginas.length == 0) {
            this.outputText("\nYou feel a terrible pressure in your groin... then an incredible pain accompanied by the rending of flesh. <b>You look down and behold a new vagina</b>.\n");
            this.player.createVagina();
        }
        this.outputText("\nA sudden pressure in your belly rouses you, making you moan softly in pain as you feel your womb rippling and squeezing, the walls contracting around the ripe eggs inside you. You drag yourself from your bedding, divesting yourself of your lower clothes and staggering out into the middle of the camp. Squatting upright, you inhale deeply and start to concentrate.");

        this.outputText("\n\nA thick, green slime begins to flow from your stretched netherlips, splatting wetly onto the ground below you and quickly soaking into the dry earth. You settle easily into the rhythm of pushing with your contractions and breathing deeply when they ebb. The eggs inside you move quickly, lubricated by the strange slime that cushioned them in your womb; sized and shaped just right, the pressure of their passage stretches you in the most delightful way, your [clit] growing erect ");
        if (this.player.hasCock()) this.outputText("and [eachCock] starting to leak pre-cum ");
        this.outputText("as you find yourself being moved to climax by the birthing. You see no point in resisting and reach down to begin fiddling with yourself, moaning in pain-spiked pleasure as the stimulus overwhelms you. With an orgasmic cry, you release your eggs into the world amidst a gush of femcum");
        if (this.player.hasCock()) this.outputText(" and a downpour of semen");
        this.outputText(".");

        this.outputText("\n\nWhen you find yourself able to stand, you examine what it is you have birthed: " + Benoit.num2Text(Math.floor(this.player.totalFertility() / 10)) + " large, jade-colored eggs, the unmistakable shape of reptile eggs. You pick one up and hold it gently against your ear; inside, you can hear a little heart, beating strong and quick; " + this.benoitMF("Benoit", "Benoite") + "'s child and yours. You place the egg back down and gather them all up, moving them closer to the campfire to warm while you recover from your exertions.");

        this.outputText("\n\nWhen the light of day breaks, you gather your newly laid clutch and set off for " + this.benoitMF("Benoit", "Benoite") + "'s shop. The blind basilisk is asleep when you arrive, forcing you to bang loudly on " + this.benoitMF("his", "her") + " door to wake " + this.benoitMF("him", "her") + " up.");

        this.outputText("\n\n\"<i>What is it?!</i>\" " + this.benoitMF("he", "she") + " snarls, displaying " + this.benoitMF("his", "her") + " fangs when " + this.benoitMF("he", "she") + " pops " + this.benoitMF("his", "her") + " head irritably out of the door. " + this.benoitMF("He", "She") + " stops and inhales through " + this.benoitMF("his", "her") + " nose, starting lightly when " + this.benoitMF("he", "she") + " recognizes your scent. \"<i>Oops! [name], I am zo sorry, I did not think it would be you. But why are you here at such an early hour?</i>\"");

        this.outputText("\n\nYou smile at your blind lover and tell " + this.benoitMF("him", "her") + " that " + this.benoitMF("he", "she") + "'s a father");
        if (this.flags[kFLAGS.BENOIT_EGGS] > 0) this.outputText(" once more");
        this.outputText(". Well, " + this.benoitMF("he", "she") + " will be when this ");
        if (this.flags[kFLAGS.BENOIT_EGGS] > 0) this.outputText("latest ");
        this.outputText("clutch hatches, anyway.");

        // First Time:
        if (this.flags[kFLAGS.BENOIT_EGGS] == 0) {
            this.outputText("\n\nHe beams with joy, then looks confused. \"<i>But... why have you brought zem 'ere?</i>\" " + this.benoitMF("he", "she") + " questions.");

            this.outputText("\n\nYou explain that you don't feel your camp is safe enough to keep them there, and " + this.benoitMF("Benoit", "Benoite") + " nods. \"<i>Yes, I can see your point... come, give zem 'ere, and I shall look after them for ze both of us.</i>\"");

            this.outputText("\n\nHe opens the door and offers " + this.benoitMF("his", "her") + " hand to help lead you in. " + this.benoitMF("He", "She") + " feels around the clutter of " + this.benoitMF("his", "her") + " store room until " + this.benoitMF("he", "she") + " finds what " + this.benoitMF("he", "she") + "'s looking for: a battered old basket stuffed with a soft pillow. You raise an eyebrow at the liberal amounts of dog hair the pillow is covered with and " + this.benoitMF("Benoit", "Benoite") + " coughs apologetically.");

            this.outputText("\n\n\"<i>'E isn't 'appy about me taking 'is bed, but to 'ell wizzim; 'e always gets is 'air on everysing anyway.</i>\" You spend some time arranging the eggs where they will be safe and warm. Although you know they can't be, " + this.benoitMF("Benoit", "Benoite") + "'s blind eyes seem to be fixed upon the brood when you have finished.");

            this.outputText("\n\n\"<i>And zese eggs are different?</i>\" " + this.benoitMF("he", "she") + " says hesitantly. \"<i>I - we will 'ave... daughters?</i>\" You shrug and say even if they aren't female, at least " + this.benoitMF("he", "she") + "'ll have some sons " + this.benoitMF("he", "she") + " can keep away from the mountain. " + this.benoitMF("He", "She") + " sets " + this.benoitMF("his", "her") + " jaw and nods.");

            this.outputText("\n\n\"<i>If zis works, [name], you 'ave done my people a service I cannot repay. Even if it doesn't, to do zis for me is...</i>\" " + this.benoitMF("he", "she") + " gestures futilely as words fail " + this.benoitMF("him", "her") + ". \"<i>All zis time I 'ave been trading potions, I could 'ave done it myself, and I never did. Per'aps I sought I was too much a man or somesing. Pah! I was a coward, a cringing coward. You 'ad ze idea, you 'ad ze courage, you 'ad ze strength, and because of zat, my people 'ave a chance. Sank you.</i>\" " + this.benoitMF("He", "She") + " sounds slightly choked, and stops for a moment. \"<i>It is very, very little, but for you I buy and sell sings at zeir true value. If zeir is anysing I can do for you, ever, please just say.</i>\" You are slightly embarrassed by " + this.benoitMF("his", "her") + " effusiveness and mumble something. Perhaps aware of the awkwardness, " + this.benoitMF("Benoit", "Benoite") + " gestures to the corner where " + this.benoitMF("he", "she") + " has put together a serviceable stove from scrap.\n\n\"<i>'Ungry?</i>\"");
            this.outputText("\n\nYou linger long enough to share breakfast with " + this.benoitMF("him", "her") + ", and then return to camp.");
        }
        // Subsequent:
        else {
            this.outputText("\n\nBenoit smiles proudly. \"<i>I cannot zank you enough for zis. Do not worry, I shall keep zem as safe as I ave ze ozzeir clutches.</i>\"\n");
        }
        this.player.orgasm('Vaginal');
        this.player.knockUpForce(); // Clear Pregnancy
        this.flags[kFLAGS.BENOIT_EGGS] += Math.floor(this.player.totalFertility() / 10);
        // doNext(1);
    }

    // Feminising

    // Opening Talk
    // Requires: Affection 40+, Have already talked to Benoit at least once, have not had sex with Benoit
    public femoitInitialTalk(): void {
        this.clearOutput();

        this.outputText("You ask " + this.benoitMF("Benoit", "Benoite") + " if " + this.benoitMF("he", "she") + " has ever thought about trying to do something to help " + this.benoitMF("his", "her") + " people's plight.");

        this.outputText("\n\nThe basilisk is silent for a time, running " + this.benoitMF("his", "her") + " claws along the counter pensively. \"<i>Yes,</i>\" " + this.benoitMF("he", "she") + " says eventually, in a quiet tone. \"<i>I 'ave. Away from ze mountains, I 'ave 'ad time to sink. I am not ze demons' slave anymore, and I am a funny joke of a basilisk anyway, so I 'ave often thought about making certain... zacrifices. If we 'ad just one female, away from zeir corruption, zen...</i>\" " + this.benoitMF("he", "she") + " tails off, shrugging unhappily. \"<i>But I just torment myself sinking about zis, [name]. Ze demons made us very resistant to change. I would need somesing very powerful for me to become... somesing useful.</i>\"");

        /*
            if (player.hasItem(consumables.BIMBOLQ))
            {
                outputText("\n\nA certain pink, effervescent liqueur suddenly feels very heavy in your pouch.  That would certainly be powerful enough to give Benoit what " + benoitMF("he","she") + " wants... along with a lot of side effects.");

                outputText("\n\n(\"<i>Bimbofy</i>\" option added to " + benoitMF("Benoit's","Benoite's") + " menu.)");

                flags[kFLAGS.BIMBO_FEMOIT_UNLOCKED] = 1;
            }
            */

        if (this.player.inte >= 60) {
            this.outputText("\n\nYou reckon that even a resistant creature could be made to transform to the opposite sex, with a strong enough potion, and ask " + this.benoitMF("Benoit", "Benoite") + " about it.");

            this.outputText("\n\n\"<i>Well... if you got a double dose of purified zuccubus milk, a large pink egg, zome ovi-elixir and some reptilum, you could probably do it...</i>\"");

            this.outputText("\n\n(\"<i>Feminize</i>\" option added to " + this.benoitMF("Benoit", "Benoite") + "'s menu.)");

            this.flags[kFLAGS.FEMOIT_UNLOCKED] = 1;
        }
        else {
            this.outputText("\n\nYou rack your brain but can't think of anything that could help " + this.benoitMF("Benoit", "Benoite") + ", so end up simply sympathising with " + this.benoitMF("him", "her") + ". \"<i>Do not beat yourself up over it,</i>\" says the basilisk, with a smile. \"<i>It is a foolish dream. And anyway, I told you: we are a race of bastards. We are ze last guys who deserve someone sinking after us.</i>\"");
        }
    }

    // Feminise

    public benoitFeminise(): void {
        this.clearOutput();

        // Ingredients not in inventory
        if (!this.player.hasItem(this.consumables.P_S_MLK, 2) || !this.player.hasItem(this.consumables.L_PNKEG) || !this.player.hasItem(this.consumables.OVIELIX) || !this.player.hasItem(this.consumables.REPTLUM)) {
            this.outputText("You don't have the necessary ingredients to attempt this yet.");
            this.outputText("\n\n<b>(Requires 2x Purified Succubus Milk, 1x Large Pink Egg, 1x Ovi Elixir, 1x Reptilium.)</b>");
            this.output.flush();
        }
        else {
            this.player.destroyItems(this.consumables.P_S_MLK, 2);
            this.player.destroyItems(this.consumables.L_PNKEG, 1);
            this.player.destroyItems(this.consumables.OVIELIX, 1);
            this.player.destroyItems(this.consumables.REPTLUM, 1);

            this.outputText("You ferret out the ingredients you have collected and begin to bang them onto the counter in front of " + this.benoitMF("Benoit", "Benoite") + ", telling " + this.benoitMF("him", "her") + " that you've got what " + this.benoitMF("he", "she") + " needs. Pierre barks excitedly at the noise.");

            this.outputText("\n\n\"<i>I - what?</i>\" the basilisk says, bewildered. \"<i>But... [name], zat was just fantasy! I was not expecting you to...</i>\" " + this.benoitMF("He", "She") + " lapses into silence as you grab a pewter bowl from a nearby shelf and a wooden spoon from a container full of old utensils, and begin to mix the various ingredients together. You crack the egg against the bowl and then beat it into the milk; the goop takes on a pink cake-mix texture until you pour in the ovi-elixir, which thins it as well as filling the close market stall with a rather bad, sulfuric smell. Carefully you drip in the reptilum whilst continuing to stir; eventually the liquid in front of you takes on a livid lime color. When the scent changes to that of cooking sherry you stop and step back to admire your handiwork, before pushing the bowl gently across the counter until it touches the basilisk's claws. " + this.benoitMF("He", "She") + " slowly clasps " + this.benoitMF("his", "her") + " fingers around it, staring blindly into the concoction.");

            this.outputText("\n\n\"<i>And you sink zis will actually work?</i>\" " + this.benoitMF("he", "she") + " says eventually. \"<i>Zat it will... change me?</i>\" You honestly have no idea - and you're quite glad " + this.benoitMF("Benoit", "Benoite") + " can't see the color of it - but you tell " + this.benoitMF("him", "her") + " as confidently as you can that it will. " + this.benoitMF("He", "She") + " sighs raggedly, " + this.benoitMF("his", "her") + " claws trembling slightly. \"<i>Oh well, what is the worst that it could do - make me deaf?</i>\" A look of horror settles on " + this.benoitMF("his", "her") + " face as the words leave " + this.benoitMF("his", "her") + " mouth, but " + this.benoitMF("he", "she") + " manages to shake the thought away and lifts the bowl to " + this.benoitMF("his", "her") + " lips. \"<i>Sante,</i>\" " + this.benoitMF("he", "she") + " manages with a small smile, and then drinks.");

            this.outputText("\n\nYou watch as the potion slides into " + this.benoitMF("his", "her") + " mouth and down " + this.benoitMF("his", "her") + " gullet. When it is all gone " + this.benoitMF("he", "she") + " sets the bowl down and licks " + this.benoitMF("his", "her") + " lips thoughtfully.");

            this.outputText("\n\n\"<i>Well... not ze worst sing I have ever tasted,</i>\" " + this.benoitMF("he", "she") + " says. \"<i>It could 'ave used more alcoh-hol zo. Uh. Uhhhhhhh...</i>\" " + this.benoitMF("He", "She") + " clenches the desk as a tremendous gurgling sound emanates from " + this.benoitMF("his", "her") + " gut. Pierre whines, and unconsciously both you and the dog back away from the basilisk as " + this.benoitMF("he", "she") + " begins to twitch and spasm. There is a grinding noise as " + this.benoitMF("his", "her") + " bones begin to shift; although " + this.benoitMF("he", "she") + " is holding onto the counter as hard as " + this.benoitMF("he", "she") + " can, " + this.benoitMF("he", "she") + " cannot stop knocking bottles and trinkets onto the floor as " + this.benoitMF("his", "her") + " flesh begins to move. " + this.benoitMF("His", "Her") + " torso sucks in, a great deal of mass moving downwards; the sound of long johns giving at the seams trades with an unpleasant cracking and popping sound as " + this.benoitMF("his", "her") + " shoulders shift inwards. There is a sprouting sound as iridescent red feathers emerge upon " + this.benoitMF("his", "her") + " crown; below " + this.benoitMF("his", "her") + " clenched teeth and eyes, " + this.benoitMF("his", "her") + " jaw line softens and moves upwards. The basilisk's now slighter front bulges faintly, and with that the transformation stops, or at least the transformation you can readily observe. Judging by the way " + this.benoitMF("his", "her") + " gut continues to groan and the way " + this.benoitMF("he", "she") + " continues to clutch the wooden surface hard enough to leave yet more claw marks, something fairly significant is happening in the ruins of " + this.benoitMF("Benoit", "Benoite") + "'s long johns.");

            this.outputText("\n\n\"<i>Zut. Fucking. Alors,</i>\" the basilisk manages at last. The creature's voice has gone up by several octaves; although it is still deep, it now sounds rather... husky. \"<i>Zat was almost as bad as zat time I tried goblin food. Is... is zat me?</i>\" " + this.benoitMF("Benoit", "Benoite") + " puts a claw to " + this.benoitMF("his", "her") + "... no, her throat in a panic. Her hands then roam downwards and upwards, each new protuberance and crevice discovered amplifying her disquiet. \"<i>Zis... zis can't be real,</i>\" she mutters. \"<i>Zis can't actually 'ave 'appened...</i>\" She turns as if to try and shake herself out of a dream, and knocks over a pile of books with her behind. Your one salient thought as you watch is that whatever else you've managed to do to the blind basilisk, she certainly has it going on now. She stands in the fairly impressive mess the two of you have created wringing her hands, apparently unwilling to move her new physique around for fear of knocking over even more of the stock.");

            this.outputText("\n\n\"<i>C... could you come back tomorrow?</i>\" says " + this.benoitMF("Benoit", "Benoite") + " unevenly. \"<i>Zis is... I need some time to get my 'ead around zis.</i>\" You put the books back on the counter, scratch a terrified-looking Pierre behind the ear, and take your leave.");

            this.flags[kFLAGS.FEMOIT_NEXTDAY_EVENT] = this.getGame().time.days + 1;
            this.flags[kFLAGS.FEMOIT_NEXTDAY_EVENT_DONE] = 1;

            this.menu();
            this.doNext(this.camp.returnToCampUseOneHour);
        }
    }

    public femoitNextDayEvent(): void {
        this.clearOutput();

        this.flags[kFLAGS.BENOIT_STATUS] = 1;
        this.flags[kFLAGS.FEMOIT_NEXTDAY_EVENT_DONE] = 2;

        this.outputText("A strange, faint sound is emanating from the salvage shop. It's only when you duck cautiously into the stall proper that you realize it's the sound of a basilisk humming. " + this.benoitMF("Benoit", "Benoite") + " stops to sniff the air when you come in, immediately puts down the mug she is polishing, and beckons you inside.");

        this.outputText("\n\n\"<i>[name]!</i>\" she says brightly. \"<i>Do not be standing around zere! Come in, I want to talk to you.</i>\" You work your way to the counter and take her in. She is wearing a beret instead of a fez, and an apron over her front, which combine to more or less disguise her new feathers and small, ornamental chest bumps. However it is easy, or at least it is to you, to notice in the basilisk's jaw-line and considerable new hips and butt that her gender has definitely changed... you can only assume that her sex has as well, concealed under that apron. She doesn't seem to mind you checking her out, or maybe she just doesn't realize. You ask how Ben- you stop.");

        this.outputText("\n\n\"<i>You can call me Benoite. Ben - oy,</i>\" she says, smiling. \"<i>Zat is easy to adapt to, yes? And I am fine. Better zan fine; your potion worked perfectly. I feel like I 'ave a new life now - before I was a sad excuse of a basilisk, going nowhere. Now I 'ave a purpose. A raison d'etre. Also, being female 'as made me realize 'ow badly zis place needs a clean. I get more customers now!</i>\"");

        this.outputText("\n\nShe leans across the counter, her smile fading. \"<i> Seriously, [name], you 'ave done my people a service I cannot repay. I can lay eggs, zere can be more female basilisks, away from Lethice and 'er thugs. All zis time I 'ave been trading potions, I could 'ave done it myself, and I never did. Per'aps I sought I was too much a man or somesing. Pah! I was a coward, a cringing coward. You forced me to decide, and because of zat, my people 'ave a chance. Sank you. </i>\"");

        this.outputText("\n\nShe sounds slightly choked, and stops for a moment. \"<i> It is very, very little, but for you I buy and sell sings at zeir true value. If zere is anysing I can do for you, ever, please just say. </i>\" You are slightly embarrassed by her effusiveness and mumble something along the lines of it being all her doing. Perhaps aware of this, Benoite sits back down, hatches her fingers and smiles at you primly. \"<i> Now... is " + this.player.mf("sir", "madam") + " buying or selling? </i>\" ");

        // [Benoite buys at same rate Oswald does and sells at a 33% discount]
    }

    // Benoite Interactions

    public femoitFirstTimeNo(): void {
        this.clearOutput();
        this.outputText("You let her down as kindly as you can.");
        this.outputText("\n\n“<i>No, you are right,</i>” she says in a casual tone, although the color is still very high in her scales. “<i>It would be way too weird zat, wouldn’t it? I will find someone though, never fear. As I said before...</i>” Benoite points two fingers at her blind eyes and then at the stall entrance. There’s a distinct gleam in those cloudy grey depths you think would scare the hell out of most things with a penis. “<i>I ‘ave a purpose now.</i>”");
        this.outputText("\n\nCatching a subtle tone of dissapointment in Benoite's voice, you bid her a quick farewell and head back to camp, deciding to give her some time to recover.");
        this.menu();
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public femoitFirstTimeYes(): void {
        this.flags[kFLAGS.TIMES_FUCKED_FEMOIT]++;

        this.clearOutput();
        this.outputText("Smiling, you reach across the counter and squeeze Benoite's hands until her nervous babble dies out and she smiles back. Still holding her hand, you move behind the crates and then gently lead her behind the stall's canopy.");

        this.outputText("\n\nWhat passes for Benoite's back office is perfect for your purposes; the two wagons between which her stall is sandwiched close together here and the triangular space is filled with crates and unsorted salvage. You carefully inch your blind charge to a clear cranny and push her against a wooden wall, leaning into her as you gently undo her apron. The excited bustle, thump and clatter of the carnival sounds like it's coming from a million miles away.");

        this.outputText("\n\n\"<i>Zis is so weird,</i>\" she mumbles as you drop the garment onto the packed dirt and slowly move your hands up her smooth body to take her beret; you can't imagine what's going through her head, but looking into Benoite's snub lizard face and cloudy grey eyes, you can only agree with the sentiment. Still... your eyes are drawn to her softer jaw line, her swollen chest and her bright feathers. The fact that you did this to her, literally emasculated her and that she now wants you to take her, touches something deep and you eagerly begin to peel off your [armor], blood rushing to your groin. ");

        this.outputText("\n\n\"<i>Zis will sound strange,</i>\" says Benoite in a shivery voice, as you eventually stand before her naked, \"<i>But... would you mind if I just touched you a bit first? All I know about you is ze sound of your voice.</i>\" You acquiesce and draw close, sighing as she gently lays her hands upon you, holding her index claws back as she begins to move them slowly up and down.");

        if (this.player.isTaur()) this.outputText("\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. \"<i>Good Gods,</i>\" she murmurs as her hands lead back onto your flanks. \"<i>Good Gods!</i>\" she cries out as she follows you all the way back to your mighty, powerful rear. \"<i>I knew you were a centaur because of all ze clopping,</i>\" she says, rubbing your side back and forth in wonder. \"<i>But to know it and actually feel it, zey are very different.</i>\" She sighs. \"<i>Zis is going to be... awkward, but I guess you are probably used to zat by now, yes?</i>\"");
        else if (this.player.isDrider()) this.outputText("\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. \"<i>Good Gods,</i>\" she murmurs as her hands lead back onto your abdomen. \"<i>Good Gods!</i>\" she cries out as she follows your bulging abdomen all the way back to your spinnerets. \"<i>I knew you were a spider because of all ze click clacking,</i>\" she says, her fingers feeling around one of your intricate, many-jointed legs in wonder . \"<i>But to know it and actually feel it, zey are very different.</i>\"");
        else if (this.player.demonScore() > 4) this.outputText("\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. She touches your horns and pauses; she reaches around, finds and grips your tail, running her grasp up to the spaded point. \"<i>So,</i>\" she says quietly. \"<i>You are one of zem.</i>\" She is silent for a while before finding a warm smile. \"<i>But I am being zilly. I know you are different inside.</i>\"");
        else if (this.player.dogScore() >= 4 && this.player.ears.type == 2 && this.player.tail.type == 2) this.outputText("\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. She grins as she finds your floppy ears and outright laughs when she reaches around and touches your tail. \"<i>I like dogs but not ZAT much, [name],</i>\" she giggles. \"<i>No wonder Pierre 'as been acting jealous recently.</i>\"");
        else if ((this.player.bunnyScore() >= 4 && this.player.ears.type == 7 && this.player.tail.type == 10) || (this.player.catScore() >= 4 && this.player.ears.type == 5 && this.player.tail.type == 8)) this.outputText("\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. She grins as she finds your ears, outright laughs when she reaches around and touches your soft tail. \"<i>I always wondered why Pierre gets all excited when 'e sees you,</i>\" she giggles.");
        else if (this.player.harpyScore() >= 4 && this.player.wings.type != 0 && this.player.arms.type == 1) this.outputText("\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. She finds your wings and follows them up as far as she can reach; she carefully shifts her feet forward to touch at your own clawed toes. \"<i>So zis is what irony is,</i>\" she murmurs, a smile playing on her lips as she touches your shoulder. \"<i>My saviour is an 'arpy, come to ravish me.</i>\"");
        else if (this.player.beeScore() >= 4 && this.player.wings.type != 0 && this.player.lowerBody.type == 7) this.outputText("\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. She finds your diaphanous wings and follows them up as far as she can reach, her grip on your sensitive membranes making you twitch a bit; then she sends her hands trailing down your carapace-armored limbs. \"<i>I always sought you just liked wearing big boots,</i>\" she murmurs. \"<i>But zis is actually a part of you? 'Ow... interesting.</i>\"");
        else if (this.player.gooScore() >= 4 && this.player.hasGooSkin()) this.outputText("\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. \"<i>I knew you were different from ze squishy sounds you made,</i>\" she murmurs as her hands sink into your soft, amorphous mass. \"<i>But zis is... good Gods, zis is strange. And zis doesn't 'urt you at all?</i>\" she asks incredulously as she gently pokes a finger into you. You answer her question by laughing. \"<i>Zat must come in very useful,</i>\" she says. You push yourself slowly up her arms and tell her she has no idea.");
        else if (this.player.hasScales()) this.outputText("\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. She starts slightly when she touches your scales, and then caresses the reptilian parts of your body with increasing interest. \"<i>You didn't do zis just for me, did you [name]?</i>\" she murmurs. \"<i>I 'ave to admit - it feels very good.</i>\"");
        // [Fox:
        else if ((this.player.foxScore() >= 4 || this.player.kitsuneScore() >= 4) && this.player.ears.type == Ears.FOX && this.player.tail.type == Tail.FOX) {
            if (this.player.tail.venom <= 1) this.outputText("\n\n" + this.benoitMF("His", "Her") + " warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. " + this.benoitMF("He", "She") + " grins as " + this.benoitMF("he", "she") + " finds your perky ears, outright laughs when " + this.benoitMF("he", "she") + " reaches around and touches your fluffy tail. \"<i>I always wondered why Pierre gets all excited when 'e sees you,</i>\" " + this.benoitMF("he laughs", "she giggles") + ".");
            else this.outputText("\n\n" + this.benoitMF("His", "Her") + " warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. " + this.benoitMF("He", "She") + " grins as " + this.benoitMF("he", "she") + " finds your perky ears and outright laughs when " + this.benoitMF("he", "she") + " reaches around and touches your fluffy tails. \"<i>You didn't do zis just to trick me, did you [name]?</i>\" " + this.benoitMF("he laughs", "she giggles") + ".");
        }
        else this.outputText("\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you're being read like a book. \"<i>You 'umans are so squishy, fuzzy and 'ot,</i>\" she giggles huskily. \"<i>'Ow can you stand it?</i>\"");

        this.outputText("\n\nBenoite's hands travel down your torso until, with a sharp intake of breath, she touches your [cock]. After a pause, she slowly wraps her dry, smooth grasp around your semi-erect cock and moves it up and down, rubbing and coiling you until you are straining.");
        if (this.player.biggestCockLength() <= 10) this.outputText(" Although this is evidently an uncanny experience for her, she does manage a cocky smile as her hand moves around your sex. \"<i>Mine " + (this.flags[kFLAGS.BENOIT_STATUS] < 3 ? "was" : "is") + " bigger,</i>\" she teases. You reward her cheek by doing some feeling yourself, grasping her large, supple behind, making her squeak as you move into her.");
        else this.outputText(" This is evidently an uncanny experience for her, the alien nature of it deepening as her hands moves around your sex. \"<i>'Oly Gods, [name]; you are a monster,</i>\" she says thickly. You smile and decide it's time to do some feeling yourself; you grasp her large, supple behind, making her squeak as you move into her.");

        this.outputText("\n\nThe scent of your arousal is in the air and as Benoite inhales it in her own breath comes heavier. Still grasping her butt, you spread her hips to reveal her genital slit, gleaming with wetness. Bracing her against the wall, you press your [cock] against her ready sex. \"<i>Please be gentle,</i>\" says a husky, nervous voice below you. You respond by slowly pushing open her lips and sliding your head into her warmth.");

        this.outputText("Benoite's pussy is virginally tight and you go as slowly as you can, lightly moving your hips as you work more of your length in. Sharp claws grasp your back as you feel resistance that gives as you push more of yourself in; blood trickles down your shaft to drip onto the floor. You keep working her slowly, withdrawing almost completely before sinking yourself in, using your head on the outward pull to tease at the clit hidden in her folds. Benoite seems almost frozen by what's happening; she simply clutches at your back, breathing heavily and allowing you to do all the work. You don't mind; whatever her mind is thinking her body is responding to your methodical treatment, her lips widening and slick moisture oiling your dick as you press into that tight, graspingly tight tunnel.");
        if (this.player.biggestCockLength() < 15 && this.player.balls == 0) this.outputText(" Eventually you manage to hilt yourself entirely in her depths, your stomach pressing against her own tight belly.");
        else if (this.player.biggestCockLength() < 15 && this.player.balls > 0) this.outputText(" Eventually you manage to hilt yourself in her depths, your [balls] pressing into her sex as your stomach bumps into her own tight belly.");
        else if (this.player.biggestCockLength() >= 15 && this.player.balls == 0) this.outputText(" Eventually you manage to bottom out, your dick pressed against her cervix.");
        else if (this.player.biggestCockLength() >= 15 && this.player.balls > 0) this.outputText(" Eventually you manage to bottom out, your dick pressed against her cervix, your [balls] swinging heavily below your shaft.");
        this.outputText(" Staying like that for a moment, you slowly withdraw almost all of the way out before pushing all the way in again, continuing the process, your grunts melding with Benoite's soft moans at the almost-agonizingly slow sex, exercising all the self-restraint you have not to begin pounding away at the basilisk's deliciously tight cunt. Occasionally you pause at the deepest moment, waiting for your blood to cool down and letting Benoite get used to the sensation of being fully stuffed by you.");

        this.outputText("\n\nSlowly, eventually, Benoite gets into it, her frozen limbs thawing to your loving, careful movement. Beginning to pant, she moves her powerful hips with you, trying to draw your dick further into her. Gratefully you begin to pick up the pace, thrusting into her with increasing force. Her claws grip your back painfully as she pushes herself into you, the soft leather of her chest bumps squeezing into your [fullChest].");
        if (this.player.isLactating()) this.outputText(" The pressure and arousal makes your [nipples] dribble milk, spattering fluids across both of your chests.");
        this.outputText(" Soon the two of you are thrashing into each other, Benoite moaning huskily as you batter her against the wagon wall, both seeking your peak together, each pushing the other a bit further upwards. Your world is lost to everything but the warm tightness around your [cock] and the pressure against your chest.");

        this.outputText("\n\nBenoite howls as she orgasms, clutching you for dear life as she pushes as much of herself into you as she can. The contractions around your cock are too much and with a bestial, wordless sound, you cum. Your mind superseded by everything but that all-conquering animal imperative to breed, you hilt as much of yourself in Benoite, pushing as much of your seed upwards as you can, delivering rope after rope of cum until it dribbles out of her, dripping onto the floor to mingle with her blood.");

        this.outputText("\n\nEventually you pulse your last drop and return to yourself; slowly you lower Benoite to her feet. She staggers slightly and clutches a stack of crates for support, your cum still beading out of her.");

        this.outputText("\n\n\"<i>Phew!</i>\" she says after she's managed to catch her breath. \"<i>That was... somesing.</i>\" You're slightly worried you went a bit too far with her, but when she has recovered herself a bit she advances on you with a wide, blissed-out grin. She feels around until she finds your hands. You suppose the done thing at this point is to kiss her, but you're not entirely sure how to do that. As you hesitate, she opens her mouth, unrolls her long tongue and licks your face. The sensation is warm and sticky and you find yourself laughing at the strange tenderness of the gesture. ");

        this.outputText("\n\n\"<i>Sank you for zat, [name],</i>\" she says huskily. \"<i>Of course, I will need you to do zat again if it doesn't take. And again, once ze first clutch is done. Basically we will be doing zis a lot. Purely for ze purpose of procreation, you understand.</i>\" Grinning, you lead her back inside the shop and after squeezing her hand, take your leave.");

        this.player.orgasm('Dick');
        this.benoitKnockUp();
        this.menu();
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Subsequent Sex
    // Requires: Benoite not pregnant
    public femoitSexIntro(): void {
        this.clearOutput();
        this.outputText("Once again, you take Benoite's hand and lead her into the back room. Your free hand roams underneath her apron as you carefully pick out a path through the junk and Benoite is swiftly in on the game too; her fingers slide downwards to pinch and fondle at her favorite parts of you. By the time you make it into the storage space you are practically falling over each other, laughing as you fumble off each other's clothes.");
        this.flags[kFLAGS.TIMES_FUCKED_FEMOIT]++;
        if (!this.benoitPreggers()) {
            this.outputText("\n\nBenoite's fingers travel down your sides as you lift her apron off her, her warm, smooth touch eventually falling upon your [cock]; already aware of every inch of you she rubs and coils you expertly, softly pumping you until your flesh is straining in her grasp. She circles a feather-light touch around your [cockHead] with one finger ever so gently, grinning slyly as she does. Grunting with need, you push her insistently down onto the packed soil, shaking out of the last of your underclothes; Benoite spreads her thighs for you, her genital lips widened and moist with readiness.");
            if (this.benoitInClutch()) this.outputText(" Her stomach bulges with clutch and the air is thick with female musk; the sight and smell of overwhelming ripeness speaks to your body in a way which bypasses your higher cognition entirely, sending you growling on top her, barely even hearing her giggle.");

            this.outputText("\n\nYou cup her large, supple behind and push into her wet opening, sighing as you reach a comfortable depth before slowly sliding in and out. Benoite's hands move over you, reminding herself of you with dry, smooth pressure as you find a slow, silky rhythm. The basilisk arches her back and moans hoarsely as you push more and more of your wick into her depths; she moves with you, wriggling her body to gently work your [cock] this way and that to enhance your sensation.");

            this.outputText("\n\n");
            if (this.player.biggestCockLength() < 15) this.outputText("Soon you are hilting yourself in her depths, making her gasp as you slap into her.");
            else this.outputText("Soon you are bottoming out in her, making her gasp as your hulking length spreads her wide.");
            this.outputText(" You quickly pick up the pace as you enter rut, thrusting into your basilisk lover with red-flecked abandon, her powerful thighs working with yours to make each return plunge into her warm depths more gratifying than the last.");

            this.outputText("\n\n");
            if (!this.player.isTaur()) {
                this.outputText("Eventually, sweat dripping off you, you grab her thighs and heave them upwards so that you can really go to town, drawing yourself almost all the way out of her before smacking back into her,");
                if (!this.benoitInClutch()) this.outputText(" your stomach beating out a slapping rhythm against her own flat abdomen. ");
                else this.outputText(" your stomach beating out a slapping rhythm against her bulging, gravid abdomen. ");
            }
            this.outputText("Benoite moans, squeals and eventually screams to your exertions, her fluids spurting and spattering against your groin");
            if (this.player.balls > 0) this.outputText(" and [balls]. You tumble over your peak as her cunt suddenly tightens around yours, sending surge after surge of cum into her fertile depths, your body seized in a rictus of pleasure.");
            if (this.player.cumQ() >= 2500) this.outputText(" The quantity of it is such that it quickly dribbles back out around your cock and pools on the floor.");

            this.outputText("\n\nAfter you have both rode out the last of your mutual orgasm you lie for a time on the floor tangled together, enjoying the feeling of your smooth, scaly lover.");

            this.outputText("\n\n\"<i>Big, zilly stud,</i>\" she says fondly, as she moves her hands, painting a picture of you in this moment she can hold on the walls of her mind for days to come. Eventually, you get up, redress and quietly take your leave. In your haze you manage to feel glad that she didn't leave quite so many claw marks on your back this time.");

            this.benoitKnockUp();
            this.player.orgasm('Dick');
        }
        else if (this.benoitRegularPreggers() && (!this.player.isTaur() || (this.player.isTaur() && (this.player.tallness * (5 / 6) < this.player.cocks[this.player.longestCock()].cockLength)))) {
            this.clearOutput();
            this.outputText("Once you are both in the usual spot, neither of you waste any time undressing. The pregnant basilisk stands there, staring blindly at you, and waiting for you to make the first move, tongue occasionally flicking past her lips to nervously wet them.");

            this.outputText("\n\nYou use this opportunity to examine your reptilian lover more closely, stepping forward and reaching out with your hands. You gently trail your fingers across her jawline, then reach up and softly ruffle the feathery crest on her head, making her coo appreciatively. Your fingers slide down the lines of her body to cup and stroke her small, rounded chest, and then inexorably continue onwards to the hard, round, swollen mass that is her egg-laden belly. You place your palms flat against the distended orb, feeling the pressure that the sizable clutch is exerting on the interior of her womb, massaging her sides and making her moan softly; you'd almost swear you can hear her eggs softly clicking as you move them against each other.");

            this.outputText("\n\n\"<i>Enough foreplay; I sought zat we were going to fuck?</i>\" she playfully reprimands, and you smirk and nod your head, knowing guiltily that she can't see it. Nimbly you skip around behind her, catching her tail and rubbing it affectionately against your cheek, then tell her to find something sturdy to support her; you want her to kneel down against it.");

            this.outputText("\n\n\"<i>So, zat is what you 'ave in mind? Kinky " + this.player.mf("boy", "girl") + "...</i>\" Benoite replies. Her long tongue flickers out to dart across your other cheek, and then she carefully lowers herself to the ground, making herself comfortable and groaning softly with relief. \"<i>I must say, zat is much more better on my poor feet... all zese eggs are 'eavy, you know?</i>\"");

            this.outputText("\n\nYou cup her buttocks, squeezing the delightfully full, feminine globes, and promise her that she'll forget all about the weight of her eggs soon enough.");

            this.outputText("\n\n\"<i>Promises, promises,</i>\" is the cheeky retort you get, which prompts you to playfully slap her right asscheek with your hand. Your [cock] is already beginning to swell with arousal, and you tantalizingly brush it against the outer lips of Benoite's pussy, sliding it back and forth and occasionally bumping its tip into her swollen belly. Soon, it's hard as a rock, and slick with both pre-cum and Benoite's feminine equivalent. The genderbent reptilian moans and growls in the back of her throat, arching her magnificent ass towards you to make it easier for you to tantalise her, your hands instinctively moving to grope and squeeze her luscious cheeks.");

            this.outputText("\n\n\"<i>Enough with ze teasing, put ze damn thing in already!</i>\" she barks at you. She lifts one hand off of the ground and begins to rub and squeeze her chest in frustrated pleasure.");

            this.outputText("\n\nDeciding you've had enough foreplay, you take a moment to properly position yourself and begin sliding gently into her cool, silky depths, trying to keep calm even as you work yourself deeper and deeper inside her.");
            if (this.player.biggestCockLength() < 15) this.outputText(" Soon you are hilting yourself in her depths, making her gasp as you slap into her.");
            else this.outputText(" Soon you are bottoming out in her, making her gasp as your hulking length spreads her wide.");

            this.outputText("\n\nYou take a momentary pause to properly reposition yourself, placing your hands on Benoite's butt for assistance in balancing and causing her to place her free hand back on the ground, and then you begin to thrust. She groans and gasps as you slide yourself back and forth inside her, doing her best to meet your thrusts with her own, egg-laden belly sliding back and forth across the floor, the stimulation on her stretched, sensitive scales adding to her pleasure, her tail beating a tattoo of lust against your back.");

            this.outputText("\n\n\"<i>Yez! Yez, oh, yez! This iz zo good, [name]! Oh, fuck... I sink zat I am...</i>\" You feel her rippling, squeezing pussy clenching tighter and tighter around you, striving to milk you dry. \"<i>...I em c-c-cumming!</i>\" she cries out as climax ripples through her, belly jiggling against you as the pleasure makes her whole body quiver and shake. She moans and growls throatily, then gives a gasp of relief, audibly spent...");

            this.outputText("\n\nBut you're not done yet, as enticing a display as that was, and so you continue to thrust, the juices from Benoite's orgasm making your cock wonderfully slick and easy to slide into her. Weak-kneed and overstimulated from her recent orgasm, the basilisk can only mewl and groan in equal parts pleasure and desperation. She strives to massage and milk your cock with her wet cunt, aching to have you fill her with more of your potent seed. The sight of her like this, her belly swollen with your fertilized clutch, down on her hands and knees and anxious to be bred anyway, is ultimately too much to resist and you find yourself exploding into the reptilian woman's snatch, triggering a second orgasm as your cum spurts inside her.");
            if (this.player.cumQ() >= 2500) this.outputText(" Because her womb is already so jam-packed with eggs, the bulk of your deposit simply oozes messily back out of her, leaving her well and truly creampied.");

            this.outputText("\n\nNow it is your turn to slump down in a spent state, though you retain enough control to avoid adding any more weight to your already heavy lover. The two of you remain there in the backgroom, gathering up your strength, letting the musk of your carnal pleasure roll over your still forms.");

            this.outputText("\n\nBenoite stirs first. \"<i>Mmm... I guess being so pregnant is not such a bad sing if it means we can have sex like zis...</i>\" she murmurs, though it's quite obvious she intends for you to hear her. With a groan of effort, she heaves herself back upright. \"<i>Come back and see me any time, lover-" + this.player.mf("boy", "girl") + ",</i>\" she tells you. \"<i>But don't sink zat you need me to be pregnant to give me a good time, okay?</i>\" Benoite smirks, striding across the floor and giving you a hand up before delicately flicking her tongue across your lips in a reptilian kiss.");

            this.outputText("\n\nYou redress yourself, give the trader a hand getting back to the front of the shop without knocking anything over - she may be familiar with her shop, but her distended belly still gives her problems - and then head back to camp.");
            this.player.orgasm('Dick');
        }
        else if (this.benoitVeryHeavyPreggers() || this.benoitExtremePreggers()) {
            this.clearOutput();
            if (this.player.isTaur()) {
                this.outputText("\"<i>No. Non! Absolutely non!</i>\" Benoite insists. \"<i>You are my amazing stallion, [name], but... it is simply too much. Wis all zis weight on me, zere is simply no way we can do it.</i>\"");

                this.outputText("\n\nShe places a hand on you, working it up to your face cautiously until she's holding your cheek. \"<i>Truly, I am sorry. I am eager to see you again, my 'andsome 'orse... once our children are walking on their own feet.</i>\"");
            }
            else {
                if (this.flags[kFLAGS.FEMOIT_SPOONED] == 0) {
                    this.flags[kFLAGS.FEMOIT_SPOONED]++;
                    this.outputText("Benoite seems to peer at you, then places her clawed hand gently on her belly. \"<i>And I sought my eyes were the ones that didn't work... You can surely see how big I am, yes? Do you really sink you could carry me for the sex? Because there is no way I can let you sit on my lap with all zese eggs in me.</i>\"");

                    this.outputText("\n\nYou assure her that you know a position that will work just fine, if she's willing to try.");

                    this.outputText("\n\nThe egg-laden reptilian woman visibly thinks it over, then shrugs. \"<i>Well, I guess I'm willing to try if you are.</i>\" She smirks softly. \"<i>Drat zese 'ormonez; I am too 'orny for my own good.</i>\"");
                }
                else {
                    this.outputText("Benoite smirks at you. \"<i>Well, I guess ze last time was enjoyable enough. Come, then; I am horny and you arrived in time to scratch my itch.</i>\"");
                }

                this.outputText("\n\nShe turns around slowly and waddles into the private part of her shop, tail waving over her admirable butt.");

                this.outputText("\n\nFortunately, Benoite sleeps in her shop these days, so you don't have to help her waddle far before she collapses gratefully into her bedding. \"<i>Zut alors, I am such a 'og...</i>\" she murmurs, hands trying desperately to measure her huge belly. While she is doing that, you slip out of your [armor] and then quietly climb into the bed beside her.");

                this.outputText("\n\nShe starts in shock as your arms wrap around her waist. \"<i>Do not sneak up on me like zat!</i>\" she complains, her tail slapping forcefully against your [ass] to emphasize her point. You apologize, but neither of you really mean what you're saying and you both know that. You snuggle in close to your reptilian lover, pressing yourself against her back, feeling her cool scales against your [skinFurScales]. Your roving hands caress her chest, making her croon at the attention, and are then drawn magnetically to her impossibly pregnant stomach.");

                this.outputText("\n\nIt's huge and heavy, solid like a rock, the scaly skin stretched so taut over the eggs inside you're certain you can actually feel them through her skin. There are too many of them jam-packed in there to actually move, though, signaling just how remarkably gravid Benoite is. Your examinations are cut off when Benoite suddenly grinds her ass insistently against your crotch. \"<i>Ze snuggling is nice, lovair, but I am in ze mood for somesing a leetle more... active,</i>\" the basilisk comments, her tone light and airy.");

                this.outputText("\n\nYou feign offence, asking if it's so wrong for you to take such pride in having such a wonderfully, majestically fertile lover, caressing her distended belly with gentle sweeping strokes, sliding your fingers across her sensitive skin. The basilisk moans softly, shivering with pleasure at the sensation, her tail sliding up to caress your [hips]. \"<i>You are such a flatterer,</i>\" she tells you. \"<i>Mmm... but I must confess zat zis is quite nice also...</i>\" she emphasizes her point by wriggling back against you, doing her best to nestle against your body.");

                this.outputText("\n\nOne hand continues to trace circles across her egg-laden womb, even as you move the other down to gently cup and squeeze her full bottom, rubbing the base of her tail before creeping down in between her legs. Dampness meets your probing fingers, letting you know your efforts have been rewarded, and you decide to give Benoite something a little more intense. Your [cock] begins to poke into the she-lizard's luscious ass, making her laugh that oh-so-filthy laugh of hers. \"<i>And 'ere I sought zat you were just wanting to snuggle? Well, come on z'en, my lovair; if you sink you know 'ow to use zat properly?</i>\"");

                this.outputText("\n\nYou hold onto her swollen stomach as you maneuver your cock up under her ass, seeking her feminine orifice. After a few moments, you find yourself properly aligned and begin to gently push yourself in, being careful and patient to ensure that you are not hurting your lover in her most delicate of conditions. She gasps and sighs as you reach a comfortable depth inside her dripping cunt; too heavy to really move herself, she must submissively take each and every thrust and release as you slide yourself in and out, working yourself progressively deeper inside of her.");

                if (this.player.biggestCockLength() < 15) this.outputText("\n\nSoon you are hilting yourself in her depths, making her gasp as you slap into her.");
                else this.outputText("\n\nSoon you are bottoming out in her, making her gasp as your hulking length spreads her wide.");

                this.outputText("\n\nWith a surprising amount of languidness, you gently rock yourself back and forth inside of her, slowly drawing yourself out and then sliding back inside. The basilisk's belly leaves her at your mercy, and you take full advantage of that, playing with her small nipples (after all, what other purpose do they have besides being used for her pleasure?) and stroking her belly. She hisses and coos, but remains immobile; living proof of your virility, your sheer masculine potency. Your hands cannot reach far enough to encompass all of her belly, so heavy is she with your offspring, and this merely spurs your pride and your arousal. Only the need to avoid injuring her or her precious cargo keeps you from rutting her like a wild animal... though her desperate cries as she begs you to go faster, to do it harder, help quench the urges. She is yours, totally and utterly, and you will have her as you want her.");

                this.outputText("\n\nSeeing that her pleas aren't getting her anywhere, Benoite manages to fight past her lust to try a different tack. \"<i>C-Come on! Is zis ze cock zat knocked me up? Ze virile fuckstick zat made all zese eggs?</i>\" She grinds her crotch into you as best she can, her slick cunt hungrily squeezing your intruding cock. \"<i>I am not ze nervous leetle virgin anymore, [name]; I am ze expectant mozzair. Give me your cum; let me be warm and full of your seed again! Zat is, if you have ze balls to do eet?</i>\" she coos");
                if (this.player.balls == 0) this.outputText(" with a smile, knowing damn well you don't, literally");
                this.outputText(".");

                this.outputText("\n\nYou can't resist it anymore; you slide yourself home in one final forceful thrust and cum, eliciting a delighted squawk from Benoite as jizz thunders from your cock into her depths, her own orgasm lost amidst the cascade of fluids churning and seething into her. With her womb as jam-packed as it is, incapable of holding any more, the pressure just sends everything spurting back out of her cunt, drenching the pair of you in your seed. Finally, your orgasm ends and you sigh in unison with her.");

                this.outputText("\n\n\"<i>Now zat is what I am talking about,</i>\" Benoite sighs softly. \"<i>...I may 'ave to close ze shop early today.</i>\"");

                this.outputText("\n\nIn the end, it doesn't come to that, but it takes you quite a while to help Benoite get up, clean her off, tidy up the mess you made, and otherwise get her presentable again. She gives you one of her reptilian kisses in appreciation, and sends you home again. ");

                this.player.orgasm('Dick');
            }
        }

        this.menu();
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Benoite Gives Birth
    public femoitBirths(): void {
        this.clearOutput();
        this.outputText("As you enter Benoite's stall, you hear the sounds of gasps of pain from the backroom, mingling with the sounds of stock being knocked around. You race through and find Benoite, completely naked, leaning against a table and groaning in anguish, her tail slashing wildly through the air behind her. \"<i>[name]! It.. it iz good zat you are here. Ze eggs! Zey come!</i>\"");

        this.outputText("\n\nShe lets out a howl of pain, claws digging deeply into the scarred wood of the tough old table she's leaning on, her huge belly hanging heavily over the floor. Instinct motivates you to help the soon-to-be mother of your children, and you dart around behind her.");

        // (First time:
        if (this.flags[kFLAGS.FEMOIT_HELPED_LAY] == 0) {
            this.outputText("\n\nYou ask if she can think of any way for you to help her.");

            this.outputText("\n\n\"<i>Just catch ze eggs, and try to make zis stop hurting so much!</i>\" the basilisk whines, claws audibly carving into tough old wood. She looks on the verge of hysteria. \"<i>Why did I sink zis was a great idea? Fuck my race, </i>nuzzing<i> is worth zis amount of pain!</i>\"");
        }
        else {
            this.outputText("\n\nRemembering what you did before leaves you with no doubt as to how you can help.");

            this.outputText("\n\nLooking around, you easily find an array of scrap and lost clothing, which you quickly assemble into a crude nest underneath the laboring basilisk. It's not much, but it'll give you a place to put the eggs");
            if (this.benoitVeryHeavyPreggers() || this.benoitExtremePreggers()) this.outputText("... which is good, because you can tell there're a lot of them coming");
            this.outputText(". That done, you squat down behind Benoite, keeping your head down to avoid having it slapped by her swishing tail, and reach up between her legs. She promptly lets out a shriek.");

            if (this.flags[kFLAGS.FEMOIT_HELPED_LAY] == 1) {
                this.outputText("\"<i>What's the matter?</i>\" you blurt, alarmed.");

                this.outputText("\"<i>You... you 'ave cold 'ands!</i>\" she squeals, shuddering in displeasure.");
            }
            else {
                this.outputText("\"<i>What have I told you about warming zose hands?</i>\" she snaps angrily.");
            }
        }
        this.flags[kFLAGS.FEMOIT_HELPED_LAY]++;

        this.outputText("\n\nYou apologize, but don't take your hands away; instead, you start to rub her netherlips, feeling how dilated they are and trying to gauge how close she is to laying. You occasionally rub the underside of her straining, swollen stomach in an effort to provide some comfort. Her labor is progressing fast; you're certain she'll start delivery soon.");

        this.outputText("\n\n\"<i>At least basilisks - Oh! - lay eggs!</i>\" she pants. \"<i>It iz easier zan trying to push out a baby...</i>\" she winces as another contraction visibly ripples across her belly. \"<i>It still 'urts like 'ell, though.</i>\"");

        this.outputText("\n\nYou encourage her to breathe deeply, to try and focus on pushing in time with the contractions. Benoite groans but does as you instruct, and within moments she is gritting her teeth as the unmistakable form of an egg bulges from her pussy");
        if (this.silly()) this.outputText(". It's shaped like a complex rhomboidal polygon with 15 sides.");
        else this.outputText(", the smoothly curved peak of a jade egg beginning to crest.");
        this.outputText(" With a strangled cry of orgasm tinged with pained relief, Benoite pushes it from her passage into your hands. Slick with juices, the egg makes for quite a handful and you find yourself struggling to safely cradle it within your grasp. You quickly place it into the makeshift next at her feet.");

        if (this.flags[kFLAGS.FEMOIT_EGGS] >= 2) {
            this.outputText("\n\nFrom the continued distension of Benoite's midriff, though, it's obvious that this clutch contains multiple eggs. She groans at the prospect, but continues to breathe and push.");

            if (this.benoitRegularPreggers()) {
                this.outputText("\n\nHer labors are over quickly; the clutch isn't that big, and her muscles are already well prepared. Soon, she's squatting over a pile of" + Benoit.num2Text(this.flags[kFLAGS.FEMOIT_EGGS]) + " eggs.");
            }
            else if (this.benoitHeavyPreggers()) {
                this.outputText("\n\nThanks to the shape of her eggs and the fact she's already properly dilated, the rest of the clutch comes relatively quickly. It's a pretty decent brood of children, you feel; " + Benoit.num2Text(this.flags[kFLAGS.FEMOIT_EGGS]) + " eggs, all told.");
            }
            else if (this.benoitVeryHeavyPreggers()) {
                this.outputText("\n\nYou're glad that giving birth is easier for Benoite than it would be for a mammal, as she needs all the help she can get. Her huge stomach proves that she wasn't merely putting on weight as egg after egg pushes out of her stretched cunt. By the time she's flat as a board again, you've counted her offspring; " + Benoit.num2Text(this.flags[kFLAGS.FEMOIT_EGGS]) + " eggs, each with a baby basilisk still growing inside it.");
            }
            else if (this.benoitExtremePreggers()) {
                this.outputText("\n\nBenoite groans and moans like she's dying, but somehow finds the strength to soldier on as egg after egg after egg slides from her well-stuffed womb. For a moment you wonder just how many she's got in there, but the cascade finally comes to an end; with a great deal of relief on both your parts. While Benoite gasps for breath from her labors, you busy yourself counting your brood... " + Benoit.num2Text(this.flags[kFLAGS.FEMOIT_EGGS]) + " eggs!");
            }
        }

        this.outputText("\n\nLaying done, Benoite heaves a great sigh of relief. \"<i>Sank goodness zat's over,</i>\" she declares, even as she sinks to her knees, careful to avoid crushing the egg");
        if (this.flags[kFLAGS.FEMOIT_EGGS] > 1) this.outputText("s");
        this.outputText(" she just laid. You nod from behind her, and cautiously move around to give her a hug. She is a very, very brave woman, and an even braver man for making the decision to do this in the first place.");

        this.outputText("\n\n\"<i>Flattery,</i>\" Benoite declares in her husky voice, a hint of a reptilian blush in her crest, suddenly flush against her head. \"<i>Now, let us see ze fruits of zis crazy union, shall we?</i>\" With your help, she repositions herself so that she can start feeling at the contents of your 'nest', allowing her to touch and count the numbers of her clutch.");

        if (this.benoitRegularPreggers()) this.outputText(" She sighs softly. \"<i>A small clutch, this is... normal for my people, yes, but not very good for my mission, is it? Still, a small step to freedom is still a step.</i>\" She manages to smile. \"<i>My children will be free, and that is something to celebrate.</i>\"");
        else if (this.benoitHeavyPreggers()) this.outputText(" \"<i>My, a nice big clutch we had together, didn't we?</i>\" she smiles, proudly. \"<i>Yes, these will be strong children, I zink.</i>\"");
        else if (this.benoitVeryHeavyPreggers()) this.outputText(" \"<i>...Wow, you're quite ze stud, aren't you?</i>\" Benoite says, giving a throaty growl of lust. \"<i>I chose well when I decided to let you fertilize my eggs... so many eggs, too.</i>\"");
        else if (this.benoitExtremePreggers()) this.outputText(" The basilisk stops after her counting, visibly stunned. She recounts her eggs again, and then again, shaking her head in amazement. \"<i>Incredible... simply, incredible. I didn't think it was possible for one woman to lay zo many eggs! Zut alors!</i>\" A sudden look of horrified realization washes over her features. \"<i>I'm going to be run off my feet with all zese little monsters, aren't I?</i>\" she murmurs to herself.");

        this.outputText("\n\nYou ask if Benoite will be alright now.");

        this.outputText("\n\nThe basilisk looks at you and smirks. \"<i>I am not so fragile, [name]. I can move like my old self again, and don't worry, I 'ave got somewhere nice and warm and safe picked out already.</i>\" She pinches your [ass], making you jump.");

        this.outputText("\n\nYou insist on helping Benoite put the egg");
        if (this.flags[kFLAGS.FEMOIT_EGGS] > 1) this.outputText("s");
        this.outputText(" away safely, though, and the blind reptilian clearly appreciates the help. Leaving her to admire her new clutch you head back to camp.");

        this.clearBenoitPreggers();

        this.menu();
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Herminise Benoite.
    public benoitHerminise(): void {
        this.clearOutput();

        // Ingredients not in inventory
        if (!this.player.hasItem(this.consumables.P_DRAFT, 2) || !this.player.hasItem(this.consumables.PSDELIT) || !this.player.hasItem(this.consumables.REPTLUM)) {
            this.outputText("You don't have the necessary ingredients to attempt this yet.");
            this.outputText("\n\n<b>(Requires 2x Purified Incubi Draft, 1x Purified Succubi's Delight, 1x Reptilium.)</b>");
            this.output.flush();
        }
        else {
            this.player.destroyItems(this.consumables.P_DRAFT, 2);
            this.player.destroyItems(this.consumables.PSDELIT, 1);
            this.player.destroyItems(this.consumables.REPTLUM, 1);

            this.outputText("You tell her that she could use a new penis, just like her old form.");

            this.outputText("\n\nYou ferret out the ingredients you have collected and begin to bang them onto the counter in front of Benoite, telling her that you've got what she needs. Pierre barks excitedly at the noise.");

            this.outputText("\n\n\"<i>Zis a good idea.</i>\" the basilisk says. \"<i>Zat way, I can still lay eggs and you get to lay eggs.</i>\" She lapses into silence as you grab a glass bottle from a nearby shelf and a wooden spoon from a container full of old utensils, and begin to mix the various ingredients together. You pour the liquids into the glass bottle. Carefully you drip in the reptilum whilst continuing to stir and; eventually the liquid in front of you takes on a livid lime color. You shake the bottle to get it well-mixed. When the scent changes to that of cooking sherry you stop and step back to admire your handiwork, before pushing the bowl gently across the counter until it touches the basilisk's claws. She slowly clasps her fingers around it, staring blindly into the concoction.");

            this.outputText("\n\nYou instruct her to drink the concoction. She nods and slowly drinks the concoction until the bottle is empty. \"<i>I can feel it...</i>\" she slowly mutters. A bulge starts to form under her robes. \"<i>Ohhh... It is coming!</i>\" she announces. She opens her robes to reveal her new reptilian prick and a set of balls just above her vagina. \"<i>Thank you. Wis that, I can help you to lay some eggs,</i>\" she says.");

            this.outputText("\n\nYou assure her that she can do it someday when you're ready.");
            this.flags[kFLAGS.BENOIT_STATUS] = 3; // Hermaphrodite Benoite.

            this.menu();
            this.doNext(this.camp.returnToCampUseOneHour);
        }
    }
}
