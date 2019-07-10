import { TelAdreAbstractContent } from "./TelAdreAbstractContent";
import { TimeAwareInterface } from "../../../TimeAwareInterface";
import { VaginalPregnancy } from "../../VaginalPregnancy";
import { PregnancyStore } from "../../../PregnancyStore";
import { PregnancyProgression } from "../../PregnancyProgression";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { CoC } from "../../../CoC";
import { rand } from "../../../Extra";
import { SpriteDb } from "../../../display/SpriteDb";
import { PerkLib } from "../../../PerkLib";
import { StatusEffects } from "../../../StatusEffects";
import { kGAMECLASS } from "../../../GlobalFlags/kGAMECLASS";

export class Cotton extends TelAdreAbstractContent implements TimeAwareInterface, VaginalPregnancy {

    // 176 TIMES HAD YOGA
    // 177 MET/FUCKED - 0 = never met.  1 = met but not fucked. 2 = fucked
    // 24"x3" wang
    // COTTON_PREGNANCY_INCUBATION: number = 673;
    // COTTON_PREGNANCY_TYPE: number = 674;
    // COTTON_KID_COUNT: number = 675;
    // COTTON_OLDEST_KID_AGE: number = 676;
    // COTTON_OLDEST_KID_GENDER: number = 702
    // PC_IS_A_DEADBEAT_COTTON_DAD: number = 677;
    // PC_IS_A_GOOD_COTTON_DAD: number = 678;
    // COTTON_HERBS_OFF: number = 679;
    // COTTON_CONTRACEPTION_TALK: number = 680;
    // COTTON_KNOCKED_UP_PC_AND_TALK_HAPPENED: number = 681;

    public pregnancy: PregnancyStore;

    public constructor(pregnancyProgression: PregnancyProgression) {
        super();
        this.pregnancy = new PregnancyStore(kFLAGS.COTTON_PREGNANCY_TYPE, kFLAGS.COTTON_PREGNANCY_INCUBATION, 0, 0);
        this.pregnancy.addPregnancyEventSet(PregnancyStore.PREGNANCY_PLAYER, 300, 200, 100, 40);
        // Event: 0 (= not pregnant),  1,   2,   3,  4,  5 (< 40)
        CoC.timeAwareClassAdd(this);

        pregnancyProgression.registerVaginalPregnancyScene(PregnancyStore.PREGNANCY_PLAYER, PregnancyStore.PREGNANCY_COTTON, this);
    }

    // Implementation of TimeAwareInterface
    public timeChange(): boolean {
        this.pregnancy.pregnancyAdvance();
        if (this.flags[kFLAGS.COTTON_KID_COUNT] > 0 && this.getGame().time.hours == 23) this.flags[kFLAGS.COTTON_OLDEST_KID_AGE]++;
        // trace("\nCotton time change: Time is " + getGame().time.hours + ", incubation: " + pregnancy.incubation + ", event: " + pregnancy.event);
        return false;
    }

    public timeChangeLarge(): boolean {
        if (this.getGame().time.hours == 6 && this.flags[kFLAGS.COTTON_BREAKFAST_CLUB] == 1 && this.player.biggestLactation() >= 2) {
            this.flags[kFLAGS.COTTON_BREAKFAST_CLUB] = 0;
            this.nomSomeTitMilkCereal();
            return true;
        }
        return false;
    }
    // End of Interface Implementation

    private pregCottonChance(bonusMult: number = 1): void {
        // No preg if already preg!
        if (this.pregnancy.isPregnant) return;

        // Okay, we have a chance!  Run the numbers!
        // Herbs off?  Good chances!
        if (this.flags[kFLAGS.COTTON_HERBS_OFF] > 0) {
            if (rand(5) == 0 || this.player.cumQ() > rand(1000) || this.player.virilityQ() >= 0.5) {
                this.pregnancy.knockUpForce(PregnancyStore.PREGNANCY_PLAYER, PregnancyStore.INCUBATION_COTTON);
            }
        }
        // HERBS ON - LESS CHANCE
        else {
            // First kid is lucky!
            if (this.flags[kFLAGS.COTTON_KID_COUNT] == 0) {
                if (rand(5) == 0 || this.player.cumQ() * this.player.virilityQ() >= rand(1000)) {
                    this.pregnancy.knockUpForce(PregnancyStore.PREGNANCY_PLAYER, PregnancyStore.INCUBATION_COTTON);
                }
            }
            // NOT FIRST KID - LESS LUCKY!
            else if (this.player.cumQ() * this.player.virilityQ() >= rand(1000)) {
                this.pregnancy.knockUpForce(PregnancyStore.PREGNANCY_PLAYER, PregnancyStore.INCUBATION_COTTON);
            }
        }
    }
    private cottonPregPCChance(): void {
        // No kids yet - lucky!
        if (this.flags[kFLAGS.COTTON_KID_COUNT] == 0 && this.flags[kFLAGS.COTTON_HERBS_OFF] == 0) {
            this.player.knockUp(PregnancyStore.PREGNANCY_COTTON, PregnancyStore.INCUBATION_COTTON, 600);
        }
        else {
            if (this.flags[kFLAGS.COTTON_HERBS_OFF] == 0) this.player.knockUp(PregnancyStore.PREGNANCY_COTTON, PregnancyStore.INCUBATION_COTTON, 1000);
            else this.player.knockUp(PregnancyStore.PREGNANCY_COTTON, PregnancyStore.INCUBATION_COTTON, 100);
        }
    }

    // ToC
    // Cotton Pregnancy

    // Been told of naga book quest?

    public cottonsIntro(): boolean {
        if (this.getGame().time.hours >= 12 && this.getGame().time.hours <= 18) {
            // Gym intro scene (haven't met):
            if (this.flags[kFLAGS.COTTON_MET_FUCKED] == 0) this.outputText("\n\nYou see a tall, busty horse-girl doing some stretches over on a nearby mat.  Even from this far away, you can tell from the bulge in her pants that she's no ordinary 'girl'.");
            // Gym intro scene (met, haven't had sex):
            else if (this.flags[kFLAGS.COTTON_MET_FUCKED] == 1) this.outputText("\n\nYou spot Cotton, the busty hermaphrodite horse-girl, doing her yoga on a nearby mat.");
            // Gym intro scene (met, have had sex):
            else this.outputText("\n\nYou spot Cotton, the busty hermaphrodite horse-girl, doing her yoga on a nearby mat. She gives you a wink, a smile and a little wave.");
            // There!
            return true;
        }
        // Not There!
        return false;
    }

    public cottonGreeting(): void {
        this.spriteSelect(SpriteDb.s_cotton);
        this.clearOutput();
        this.outputText(this.images.showImage("cotton-greeting"));
        if (this.flags[kFLAGS.LIFETIME_GYM_MEMBER] == 0) this.outputText("The centauress sees you starting for the horse-girl and says, \"<i>Go ahead and talk, but if you want to work out with her I'll have to charge you.</i>\"\n\n");
        // Greeting (first time):
        if (this.flags[kFLAGS.COTTON_MET_FUCKED] == 0) {
            this.flags[kFLAGS.COTTON_MET_FUCKED] = 1;
            this.outputText("You wander over to the equine on the mat, curious as to what she's doing.  She stretches out on her mat, spine flexed.  Her head cranes backwards to see you approach.  \"<i>Oh, hi there!</i>\" She grins an upside-down grin at you and finishes her stretch before standing up.  ");
            // (If PC height is greater than 6'6</i>\"
            if (this.player.tallness > 78) this.outputText("Despite her impressive stature, you still look down on her.");
            // (If PC height is in between:
            else if (this.player.tallness >= 76) this.outputText("She's roughly your height, which is rather impressive in itself.");
            // (If PC height is under 6'4</i>\":
            else this.outputText("She is truly tall, and you have to look up to her.");
            this.outputText("  She's garbed in a white and pink form-fitting tank top along with a pair of black skintight pants that come down to about her mid-shin.  The pants do absolutely nothing to hide the enormous bulge in her crotch, if anything they only enhance it.  Her dark brown skin seems smooth and hairless, unlike most equines you've met, and her red mane of hair falls just past her shoulders, though it's currently pulled back into an efficient ponytail.\n\n");

            // (If player has a Centaur or Naga body, replace last line with:
            if (this.player.isTaur() || this.player.isNaga()) {
                /*outputText("\"<i>I'd love to teach you, but I'm afraid I don't know any good routines for your... body type. Sorry, pet.</i>\"");
                //Back to gym!
                doNext(13);
                return;*/
                this.centaurNagaBodyBookStuff();
                return;
            }
            this.outputText("\"<i>Hey, I'm Cotton, what can I do you for?</i>\" she says in a friendly manner.  You also give your name, and explain you were curious as to what she was doing.  \"<i>Oh, this? Just doing some yoga.</i>\"  Judging by your quizzical look, she continues, \"<i>Yoga is like an exercise routine for your body and soul.  When the body is happy and healthy, the mind and soul follow.  It's a very relaxing and... sensual exercise.  Would you like to try it?</i>\"");
            // [Yes] [No]
            this.doYesNo(this.acceptYoga, this.turnDownYogaWifCottonFirstTime);
        }
        // Met before
        else {
            if (this.pregnancy.event == 5) {
                this.cottonPopsOutAKid();
                return;
            }
            // (If Centaur or Naga)
            if (this.player.isTaur() || this.player.isNaga()) {
                /*outputText("You approach Cotton, who gives you a friendly smile. \"<i>Hey, there little pet. I'm afraid I don't know any good stretches for your body... Maybe some other time.</i>\"");
                doNext(13);
                return;*/
                this.centaurNagaBodyBookStuff();
            }
            else this.cottonGreetingCommonEnd();
        }
    }

    private cottonGreetingCommonEnd(): void {
        if (this.player.pregnancyIncubation <= 225 && this.player.pregnancyType == PregnancyStore.PREGNANCY_COTTON) {
            // Lamaze Class*
            // Approach Cotton, PC visibly pregnant (at least 2nd trimester, or whatever is equivalent in CoC-land)
            this.outputText("As you approach Cotton, she smiles and looks at your round belly.  \"<i>Hey there my pet, I'm afraid in your condition, yoga is out of the question... but we can do some special stretches and lamaze, just get dressed as usual.</i>\"");

            this.outputText("Do you want to engage in yoga lamaze with her?");
        }
        else {
            switch (this.pregnancy.event) {
                case 1: this.outputText("You approach Cotton, who, to your surprise, is just polishing off what must have been the largest glazed pastry you've ever seen.  You notice muffin wrappers and other evidence of baked goods near her workout mat as well.  You ask if Cotton's been feeling a bit peckish recently... you correct yourself and ask if Cotton's been starving recently.");
                        this.outputText("\n\nShe 'haruumphs' a little bit and licks her fingers clean.  \"<i>I've just been craving pastries...  Besides, I'm in the gym every day, it's not going to ruin my figure,</i>\" she waves a hand dismissively. \"<i>Anyway, if you want to work out, just get changed and come back.</i>\"");
                        break;
                case 2: this.outputText("Cotton waves as you approach, happy to see you as always.  As you get nearer, you can see a very distinctive bump in her previously washboard-flat belly; if you weren't well aware of her pregnancy, you'd think that her overeating was catching up with her.  The bulge isn't enough to force her to change clothes just yet, but her outfit must be getting tighter.  You ask how she's feeling, patting your own belly to clue her in what you're referring too.");
                        this.outputText("\n\n\"<i>Hungry, again.  I think I'll take another trip to the bakery after this,</i>\" she replies with a wistful look in her eyes.  \"<i>Anyway, if you want to work out, just change and come on back.</i>\"");
                        break;
                case 3: this.outputText("You approach Cotton, who smiles and waves.  Her belly now bulges forward, unmistakably pregnant.  Her former tank top is gone, now replaced by a kind of maternity shirt, which shows off the belly even more.  The yoga pants remain, however, though they hang a bit lower than usual.  Strangely, you notice she's sucking on a lollipop, and ask her about it.");
                        this.outputText("\n\n\"<i>Oh, it just cuts down on the nausea.  Plus I think this little rascal,</i>\" she rubs her belly a bit, \"<i>has a sweet tooth.  Or maybe it's just me. Anyway, just change and come back if you want to work out, pet.</i>\"");
                        break;
                case 4: this.outputText("Cotton smiles and greets you as you approach.  Gone is her usual top, instead she's chosen to show off her enormous, round brown belly with an incredibly short white tank top which might be confused with a bra if you didn't know any better.  Though you'd imagine her movement would be quite limited, she actually moves with her usual grace... until her belly collides with a row of water bottles set out on a nearby table, knocking them to the ground.");
                        this.outputText("\n\nYou ask if maybe she should be at home right now, putting her hooves up and relaxing.  She shakes her head and says, \"<i>Oh no I'm fine.  I've got students to teach, and I don't have to do much strenuous activity myself, so don't worry.  Anyway, if you want a lesson, just get changed and come on back.</i>\"");
                        break;
                default:
                    this.outputText("You approach Cotton, who smiles and says, \"<i>Hey there my little pet, if you'd like a work out, just get changed and come on back.</i>\"\n\nDo you want to engage in yoga with her?");
            }
        }
        this.cottonMenu();
    }

    private cottonMenu(): void {
        this.menu();
        this.addButton(0, "Yoga", this.acceptYoga);
        if (this.flags[kFLAGS.COTTON_KID_COUNT] > 0) this.addButton(1, "Visit Kids", this.visitCottonKids);
        if (this.pregnancy.isPregnant || this.flags[kFLAGS.COTTON_KID_COUNT] >= 1) this.addButton(2, "Herbs", this.cottonContraceptionToggle);
        this.addButton(4, "Leave", this.turnDownYogaWifCottonFirstTime);
    }

    private centaurNagaBodyBookStuff(): void {
        this.spriteSelect(SpriteDb.s_cotton);
        // Havent been told about the book yet?
        if (this.flags[kFLAGS.COTTON_UNUSUAL_YOGA_BOOK_TRACKER] == 0) {
            this.outputText("\"<i>I'd love to teach you, but I'm afraid I don't know any good routines for your... body type. Sorry, pet...</i>\" she trails off, as if considering something, and then turns back to you, saying, \"<i>Actually, I think I might know where you could find a book of exercises that would work for you. A traveling salesman came by once, and I saw it in his wares, a book of advanced yoga techniques, aimed at the more exotically shaped denizens of Mareth. I didn't pick it up, of course, because I didn't need it. But if you could find the salesman and bring the book back to me, I'd most definitely be able to coach you.</i>\"");
            // (Adds Yoga Book to Giacomo's inventory under Books)
            this.flags[kFLAGS.COTTON_UNUSUAL_YOGA_BOOK_TRACKER]++;
            this.doNext(this.camp.returnToCampUseOneHour);
        }
        // Come back wtih book first time
        else if (this.flags[kFLAGS.COTTON_UNUSUAL_YOGA_BOOK_TRACKER] == 1 && this.player.hasKeyItem("Yoga Guide") >= 0) {
            this.outputText("\"<i>Have you retrieved the book I mentioned?</i>\" You nod and hand the leather-bound book over to her. She grins and flicks through the pages. \"<i>Oooh, yes I thought as much... Mm-hm... Oh my, nagas can stretch like that?</i>\" Suddenly remembering you're here, she says, \"<i>I'll study this quickly. Come back later and I'll be able to give you a great workout.</i>\"");
            this.flags[kFLAGS.COTTON_UNUSUAL_YOGA_BOOK_TRACKER]++;
            this.doNext(this.camp.returnToCampUseOneHour);
        }
        // Been told about the book but dont have it.
        else if (this.flags[kFLAGS.COTTON_UNUSUAL_YOGA_BOOK_TRACKER] == 1) {
            this.outputText("\"<i>Have you retrieved the book I mentioned?</i>\" You shake your head sadly, and she sighs. \"<i>Well, until you do there's not much I can do for you.</i>\"");
            this.doNext(this.camp.returnToCampUseOneHour);
        }
        // First time with book
        else if (this.flags[kFLAGS.COTTON_UNUSUAL_YOGA_BOOK_TRACKER] == 2) {
            // (On approach with Centaur/Naga body first time after giving the book)
            this.outputText("You approach Cotton, who gives you an exuberant grin. \"<i>I've read through the book and I'm pretty confident I can coach you now. What do you say we give it a go? I've arranged for some proper yoga clothes for you. Well, really just the top, but that's what matters for you, isn't it?</i>\"\n\n");
            this.outputText("Do you want to engage in Yoga with her?");
            this.flags[kFLAGS.COTTON_UNUSUAL_YOGA_BOOK_TRACKER]++;
            this.cottonMenu();
        }
        else this.cottonGreetingCommonEnd();
    }

    // (If No)
    private turnDownYogaWifCottonFirstTime(): void {
        this.spriteSelect(SpriteDb.s_cotton);
        this.clearOutput();
        this.outputText("\"<i>That's all right, to each their own.  I'll be here if you ever change your mind.</i>\"  With that, Cotton returns to her mat and continues stretching in various poses.\n\n");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // (If Yes. Improves muscle tone up to 50, speed and feminine features.)
    private acceptYoga(): void {
        this.spriteSelect(SpriteDb.s_cotton);
        this.clearOutput();
        this.outputText(this.images.showImage("cotton-yoga"));
        if (this.player.fatigueLeft() < 20) {
            this.outputText("You're way too tired to do any yoga right now.");
            this.doNext(this.telAdre.telAdreMenu);
            return;
        }
        if (this.flags[kFLAGS.LIFETIME_GYM_MEMBER] == 0 && this.player.gems < 10) {
            this.outputText("Before you can start the yogo the centauress steps in and says, \"<i>Ten gems for gym fees.</i>\"\n\nYou fish around in your pouches, but you just don't have enough.  Maybe some other time!");
            this.doNext(this.camp.returnToCampUseOneHour);
            return;
        }
        if (this.flags[kFLAGS.LIFETIME_GYM_MEMBER] == 0) {
            this.player.gems -= 10;
            this.statScreenRefresh();
            this.outputText("The centauress collects ten gems for gym fees before the two of you can get into it.\n\n");
        }
        // (Yes) LAMAZE
        if (this.player.pregnancyIncubation <= 225 && this.player.pregnancyType == PregnancyStore.PREGNANCY_COTTON) {
            this.outputText("You change into your yoga clothes and approach Cotton, saying you'd love a lamaze class. Cotton smiles and sets up a mat for you, then sits down, urging you to sit in front of her.  You do so, feeling the bulge in her pants pressing against your rump, and her breasts at your back.  You spend the next fifteen minutes doing breathing exercises like this, and another fifteen minutes doing stretches on an exercise ball.  As you're working out, Cotton presses her body against yours, running her hands around your swollen belly at every opportunity.\n\n");

            // CHAT STUFF!
            this.cottonChat();

            this.outputText("Once you're done and about to hit the showers, Cotton pulls you aside and says with a grin, \"<i>Up for some post-workout exercises?</i>\"");
            // [Shower Sex (Fuck Her) (As Male or Herm only)] [Shower Sex (Get Fucked)] [Tantric Sex (Only if Speed is 50+)] [Leave]
            this.menu();
            if (this.player.hasCock()) {
                this.addButton(0, "Fuck Her", this.fuckCottonInShowerRepeat);
            } else {
                this.addDisabledButton(0, "Fuck Her", "This scene requires you to have cock.");
            }
            if (!this.player.isGenderless()) {
                this.addButton(1, "Get Fucked", this.cottonFucksYouInShowerRepeat);
            } else {
                this.addDisabledButton(1, "Get Fucked", "This scene requires you to have genitals.");
            }
            if ((this.player.spe >= 50 || this.player.findPerk(PerkLib.Flexibility)) && !this.player.isTaur()) {
                this.addButton(2, "Tantric Sex", this.cottonTantricSex);
            } else {
                this.addDisabledButton(2, "Tantric Sex", "This scene requires you to have enough flexibility. It does not accommodate taurs.");
            }
            this.addButton(14, "Leave", this.leaveCotton);
        }
        // First time
        else if (this.flags[kFLAGS.TIMES_HAD_YOGA] == 0) {
            this.outputText("\"<i>Good, good, you won't regret it. First things first, pet, let's get you out of that dreadful clothing.</i>\"  She leads you to the lockers and helps you strip out of your " + this.player.armorName + ".");
            if (this.player.gender == 3) this.outputText("  She spies your crotch and smiles, \"<i>Oh, best of both worlds, are we? Well you're in good company then.</i>\"");
            // (If PC is male:
            else if (this.player.hasCock()) this.outputText("  She cradles your " + this.player.cockDescript(0) + " and smiles at you, \"<i>Well, we might find a use for that later.</i>\"");
            // (If PC is female:
            else if (this.player.hasVagina()) this.outputText("  She pats your groin and says, \"<i>Y'know, I know some good exercises that really work the vaginal muscles... perhaps we'll talk about that later.</i>\"");
            this.outputText("\n\n");

            this.outputText("She then helps you into an outfit identical to her own and you both return to the gym proper.\n\n");

            this.outputText("She instructs you to lay on the mat, and you do. She proceeds to talk you through several poses, and hovers over you to correct your positioning here or there with a soft touch. Several times she bends over you, and her enormous bosom gets right in your face. At one point she stands over your head and you accidentally get a face full of her musky crotch. After about a half hour of this, the arousal and fatigue is too much and you explain you have to quit for now.\n\n");
            this.dynStats("lus", (10 + this.player.lib / 10 + this.player.sens / 20));

            this.outputText("\"<i>Oh, that's too bad. But you've done pretty good for a beginner,</i>\" she helps you up off the mat and pats you gently on the back. \"<i>Want to hit the showers then?</i>\" Despite having done little more than stretching, you find you are sweating quite a bit... but something makes you wonder if her idea of hitting the shower is the same as yours.");
            // [Shower] or [Leave]
            this.menu();
            this.addButton(0, "Shower", this.cottonShowerFunTimes);
            this.addButton(14, "Leave", this.leaveAfterYoga);
        }
        // (Repeat Encounter (Didn't have sex))
        // Done yoga > 0 && met type = 1
        else if (this.flags[kFLAGS.COTTON_MET_FUCKED] == 1 && this.flags[kFLAGS.TIMES_HAD_YOGA] > 0) {
            this.outputText("You change into your yoga clothes and approach Cotton, saying you'd love another yoga workout. Cotton smiles and sets up a mat for you. You spend the next half an hour trying different poses and stretches while she corrects you, sometimes pressing her body against yours to show you how it's done.\n\n");

            this.outputText("Once you're done and about to hit the showers, Cotton pulls you aside and says, \"<i>I know you weren't comfortable with our shower before, so I won't join you this time. But if you ever change your mind, just say the word.</i>\"");
            // [Shower Sex (Fuck Her)] [Shower Sex (Get Fucked)] [Tantric Sex (Only if Speed is 50+)] [Leave]
            this.menu();
            if (this.player.hasCock()) {
                this.addButton(0, "Fuck Her", this.fuckCottonInShowerRepeat);
            } else {
                this.addDisabledButton(0, "Fuck Her", "This scene requires you to have cock.");
            }
            if (!this.player.isGenderless()) {
                this.addButton(1, "Get Fucked", this.cottonFucksYouInShowerRepeat);
            } else {
                this.addDisabledButton(1, "Get Fucked", "This scene requires you to have genitals.");
            }
            if ((this.player.spe >= 50 || this.player.findPerk(PerkLib.Flexibility)) && !this.player.isTaur()) {
                this.addButton(2, "Tantric Sex", this.cottonTantricSex);
            } else {
                this.addDisabledButton(2, "Tantric Sex", "This scene requires you to have enough flexibility. It does not accommodate taurs.");
            }
            this.addButton(14, "Leave", this.leaveCotton);
        }
        // (Repeat Encounter (Had Sex))
        else {
            // (For Centaur Bodies: )
            if (this.player.isTaur()) this.outputText("You change into your yoga clothes (just the tank top, really), and approach Cotton, saying you'd love a yoga workout. Cotton smiles and sets up a large mat for you. You spend the next half hour trying different poses and stretches, mostly dealing with your upper half but occasionally requiring you to stretch out your legs or lay down. As you work out, Cotton presses her body against yours under the pretense of showing you how it's done, but really just to press her tits and crotch up against you.\n\n");
            // (For Naga Bodies: )
            else if (this.player.isNaga()) this.outputText("You change into your yoga clothes (just the tank top, really), and approach Cotton, saying you'd love a yoga workout. Cotton smiles and sets up a large mat for you. You spend the next half hour trying different poses and stretches, a lot of which involves coiling in certain ways, or creating shapes with your snake-like body. Cotton seems genuinely impressed at your range of flexibility. As you work out, she presses her body against yours under the pretense of showing you how it's done, but really just to press her tits and crotch up against you.\n\n");
            // (For Humanoid Bodies: )
            else this.outputText("You change into your yoga clothes and approach Cotton, saying you'd love a yoga workout. Cotton smiles and sets up a mat for you. You spend the next half hour trying different poses, including everything from simple stretches to awkward contortions. As you work out, Cotton presses her body against yours under the pretense of showing you how it's done, but really just to press her tits and crotch up against you.\n\n");

            // CHAT STUFF!
            this.cottonChat();

            this.outputText("Once you're done and about to hit the showers, Cotton pulls you aside and says with a grin, \"<i>Up for some post-workout exercises?</i>\"");
            // [Shower Sex (Fuck Her) (As Male or Herm only)] [Shower Sex (Get Fucked)] [Tantric Sex (Only if Speed is 50+)] [Leave]
            if (this.player.hasCock()) {
                this.addButton(0, "Fuck Her", this.fuckCottonInShowerRepeat);
            } else {
                this.addDisabledButton(0, "Fuck Her", "This scene requires you to have cock.");
            }
            if (!this.player.isGenderless()) {
                this.addButton(1, "Get Fucked", this.cottonFucksYouInShowerRepeat);
            } else {
                this.addDisabledButton(1, "Get Fucked", "This scene requires you to have genitals.");
            }
            if ((this.player.spe >= 50 || this.player.findPerk(PerkLib.Flexibility)) && !this.player.isTaur()) {
                this.addButton(2, "Tantric Sex", this.cottonTantricSex);
            } else {
                this.addDisabledButton(2, "Tantric Sex", "This scene requires you to have enough flexibility. It does not accommodate taurs.");
            }
            this.addButton(14, "Leave", this.leaveCotton);
        }
        // (Increases muscle tone up to 50, speed and feminine features.)
        this.player.modTone(52, 1);
        this.flags[kFLAGS.TIMES_HAD_YOGA]++;
        this.player.changeFatigue(20);
        this.dynStats("spe", 1, "lus", (5 + this.player.lib / 20 + this.player.sens / 20));
    }

    private cottonChat(): void {
        this.spriteSelect(SpriteDb.s_cotton);
        const chats: any[] = [];
        // Urta chance
        if (this.flags[kFLAGS.TIMES_FUCKED_URTA] > 0)
            chats[chats.length] = 1;
        // Edryn chance
        if (this.player.hasStatusEffect(StatusEffects.Edryn))
            chats[chats.length] = 2;
        // (Scylla chat)
        if (this.flags[kFLAGS.NUMBER_OF_TIMES_MET_SCYLLA] > 0)
            chats[chats.length] = 2;
        // VALA
        if (this.flags[kFLAGS.FREED_VALA] != 0)
            chats[chats.length] = 3;
        // (Jojo chat)
        if (this.flags[kFLAGS.JOJO_STATUS] > 0)
            chats[chats.length] = 4;
        const choice: number = chats[rand(chats.length)];

        // (Urta Chat)
        if (choice == 1) {
            // (If you've rejected Urta's love or left her)
            if (this.flags[kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY] < 0 || this.flags[kFLAGS.URTA_PC_LOVE_COUNTER] < 0) this.outputText("While you're doing your stretches, you find yourself chatting about the folks of Tel'Adre. \"<i>Urta?</i>\" Cotton says, \"<i>She's a good woman, but she's been pretty depressed lately.</i>\" Your yoga partner scowls at you, and presses you into an uncomfortable pose, \"<i>I hear you upset her. The poor girl has had an awfully cruel life.  I hope you didn't make it any worse for her.</i>\"\n\n");
            // (If you've accepted Urta's love)
            else if (kGAMECLASS.urta.urtaLove()) this.outputText("While you're doing your stretches, you find yourself chatting about the folks of Tel'Adre. \"<i>Urta?</i>\" Cotton says, \"<i>She's a good woman. I hear you two have been quite the couple lately.</i>\" You blush. \"<i>No need to be embarrassed, from what I hear you've been a good influence on her. She's not nearly as high-strung or stressed anymore. Whatever you're doing with her, keep it up, pet.</i>\"\n\n");
            // (If Urta's relationship with PC is low, so she's still uncomfortable with her body)
            else this.outputText("While you're doing your stretches, you find yourself chatting about the folks of Tel'Adre. \"<i>Urta?</i>\" Cotton says, \"<i>She's a good woman. A bit high strung sometimes, but she's got a lot on her plate keeping us all safe here. I'd invite her 'round for some yoga, maybe to help her relax, but I don't think it's really her thing.</i>\"\n\n");
        }
        // (Edryn chat)
        else if (choice == 2) {
            // (If Edryn has been knocked up, and PC rejected it)
            if (this.flags[kFLAGS.EDRYN_NEVER_SEE_AGAIN] > 0) this.outputText("While you're doing your stretches, you find yourself chatting about the folks of Tel'Adre. \"<i>Edryn?</i>\" Cotton says, \"<i>I hear you knocked her up, then left her with the kid. Well, I think she'll make a great mom by herself, but really pet, what were you thinking? It was awfully cruel of you.</i>\" The rest of the workout is filled with more painful stretches, and Cotton assists you more roughly than normal.\n\n");
            // (If Edryn has been knocked up, and PC didn't reject it)
            else if (this.flags[kFLAGS.EDRYN_NUMBER_OF_KIDS] > 0) this.outputText("While you're doing your stretches, you find yourself chatting about the folks of Tel'Adre. \"<i>Edryn?</i>\" Cotton says and giggles, \"<i>I hear you knocked her up, good on you. I think she'll make a great mom, and you " + this.player.mf("a great dad", "as well") + ".</i>\"  She gives you a kiss on the cheek and continues the stretches.\n\n");
            // (If Edryn hasn't been knocked up)
            else this.outputText("While you're doing your stretches, you find yourself chatting about the folks of Tel'Adre. \"<i>Edryn?</i>\" Cotton says, \"<i>I've seen her around the Wet Bitch late at night. I hear she sells herself for money, though I've never purchased her services. She's a good guardswoman though. Saves a lot of lives.</i>\"\n\n");
        }
        // (Scylla chat)
        else if (choice == 3) {
            // (if Scylla hasn't formed support group)
            if (this.flags[kFLAGS.NUMBER_OF_TIMES_MET_SCYLLA] < 5 && this.flags[kFLAGS.NUMBER_OF_TIMES_MET_SCYLLA] > 0) this.outputText("While you're doing your stretches, you find yourself chatting about the folks of Tel'Adre. \"<i>Scylla?</i>\" Cotton says, \"<i>She's the oddly dressed woman at the Wet Bitch, right? Can't say I know much about her. She's so secretive.</i>\"\n\n");
            // (if Scylla has formed support group)
            else if (this.flags[kFLAGS.NUMBER_OF_TIMES_MET_SCYLLA] >= 5) this.outputText("While you're doing your stretches, you find yourself chatting about the folks of Tel'Adre. \"<i>Scylla?</i>\" Cotton says, \"<i>I hear she formed an addiction support group. Good on her, there's a lot of people in and around town who need help. I'm glad she's stepping up.</i>\"\n\n");
        }
        // (Vala chat)
        else if (choice == 4) {
            // (Only if Vala has been freed)
            if (this.flags[kFLAGS.FREED_VALA] != 0) this.outputText("While you're doing your stretches, you find yourself chatting about the folks of Tel'Adre. \"<i>Vala?</i>\" Cotton says, \"<i>That's the new waitress at the Wet Bitch, right? She's cute. A shame what she's gone through. Sometimes I wish we could wipe out every last imp.</i>\"\n\n");
        }
        // (Jojo chat)
        else if (choice == 5) {
            // (If Jojo hasn't been corrupted)
            if (this.flags[kFLAGS.JOJO_STATUS] == 1) {
                this.outputText("While you're doing your stretches, you find yourself chatting about the folks of Tel'Adre and beyond. \"<i>Jojo?</i>\" Cotton says, \"<i>You know Jojo too? I met him a while back. He taught me the finer points of meditation, which I incorporate into my yoga. Here, let's try.</i>\" You spend the rest of the workout in meditative poses, and by the time you're done, you feel... lighter somehow.\n\n");
                this.dynStats("cor", -1);
            }
            // (If Jojo has been corrupted)
            else if (this.flags[kFLAGS.JOJO_STATUS] > 1) this.outputText("While you're doing your stretches, you find yourself chatting about the folks of Tel'Adre. \"<i>Jojo?</i>\" Cotton says, \"<i>You know Jojo too? I met him a while back. He taught me the finer points of meditation. I haven't seen him much lately, though. I wonder where he's gone to.</i>\" You smile inwardly, knowing exactly where he's gone to.\n\n");
        }
    }
    // (If Leave)
    private leaveAfterYoga(): void {
        this.spriteSelect(SpriteDb.s_cotton);
        this.clearOutput();
        this.outputText("\"<i>Suit yourself. You can run around all stinky, meanwhile I'm going to go wash. Feel free to drop by later for some more yoga if you'd like.</i>\"  With that, Cotton heads off to the showers and you leave the gym.\n\n");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // (If Shower)
    private cottonShowerFunTimes(): void {
        this.spriteSelect(SpriteDb.s_cotton);
        let option1;
        let option2;
        this.clearOutput();
        this.outputText("\"<i>Perfect! Let's go,</i>\" she takes you by the arm and leads you back into the lockers, and then into the nearby showers, which are apparently unisex. You both strip down and turn on a shower head. After a few moments of scrubbing up, you give your shower buddy a surreptitious glance.\n\n");

        this.outputText("Without the clothes on, you can see her body is quite well toned. Not overly muscular, but you can easily make out the muscles on her belly. She sports a belly ring, and each nipple has a barbell piercing. Looking a bit lower, you finally take in her equine cock. It's quite large, at least a foot long flaccid, as it is now. You wonder how big it gets... She catches you looking and gives you a devilish grin.\n\n");

        this.outputText("\"<i>Well? Care for a little... post-workout stretching?</i>\"");
        // [Fuck Her (Male or Herm only)] [Get Fucked] [Service her] [Refuse]
        if (this.player.hasCock()) {
            this.addButton(0, "Fuck Her", this.cottonFirstTimeFuckHer);
        } else {
            this.addDisabledButton(0, "Fuck Her", "This scene requires you to have cock.");
        }
        if (!this.player.isGenderless()) {
            this.addButton(1, "Get Fucked", this.cottonFucksYou);
        } else {
            this.addDisabledButton(1, "Get Fucked", "This scene requires you to have genitals.");
        }
        this.addButton(3, "ServiceHer", this.serviceFirstTimeCotton);
        this.addButton(14, "Refuse", this.refuseFirstTimeCotton);
    }

    // (Fuck Her)
    private cottonFirstTimeFuckHer(): void {
        this.spriteSelect(SpriteDb.s_cotton);
        this.flags[kFLAGS.COTTON_MET_FUCKED] = 2;
        this.clearOutput();
        this.outputText(this.images.showImage("cotton-first-fuck"));
        let x: number = this.player.cockThatFits(100);
        if (x < 0) x = 0;
        this.outputText("Needing no encouragement, you step behind the large horse herm and push her under the stream of water. \"<i>Oh, taking the lead are we?</i>\" She laughs, \"<i>Please, by all means, my little pet.</i>\"\n\n");

        this.outputText("You push her shoulders down so that she's bent over, water rushing down her back, around her tail and down her crack. You kneel and press your face into the crevasse, taking in her musky equine scent before taking your first taste of her cunt. It tastes mildly of sweat, but it's a salty-sweet taste that most certainly agrees with your taste buds. You take another taste, then another, and before long your tongue is ravashing her pussy, dipping into and around its folds, exploring like an adventurer in search of gold. Cotton gasps and groans as you go, her arms resting against the wall, propping her up.\n\n");

        this.outputText("Her pussy quivers and trembles around your tongue. You can tell she's so close to orgasm... but that's not what you want right now.  With a small amount of regret, you pull back from her delicious snatch, wipe the water and juices from your face and stand, stroking your " + this.player.cockDescript(x) + " to full attention and pressing it against her ready hole. Grasping her hips firmly, you whisper dirty words into your horse lover's ear before slowly thrusting in. Cotton gives an ever-so-slight whinny and a gasp, her body moving back into yours.\n\n");

        this.outputText("The water pouring on you heats up, and you see Cotton's hand on the temperature controls. Steam billows around the two of you, and your already hot bodies run hotter. You thrust, she thrusts back. You lean down, groping her large tits while you fuck. Her legs tremble and quake threatening to give out any moment.\n\n");

        this.outputText("After several minutes of this, you just can't take it anymore and your " + this.player.cockDescript(x) + " explodes within her, coating her insides with your seed, and as you do you feel Cotton's pussy clamp down on you tightly, working every last drop out of you. Her own cock explodes, coating the wall and floor beneath you in her musky scent. Nearly exhausted, you collapse on top of Cotton momentarily while you catch your breath. The two of you sink down to the shower floor, letting the hot water wash away the evidence of your love making.\n\n");

        this.outputText("After another minute, you pull your flaccid cock out of your horse lover's hole and take the moment to carefully wash the both of you up.\n\n");

        this.outputText("Your 'post-workout stretch' and shower done, the two of you dry off, redress and leave the gym. Cotton takes you by the arm and says, \"<i>That was great, pet. Come by the gym anytime. I'll be waiting.</i>\"  Then, she heads back home.  With a little grin on your face, you do the same.\n\n");
        this.pregCottonChance();
        this.player.orgasm('Dick');
        this.dynStats("sen", -1);
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    // (Get fucked, as Male)
    private cottonFucksYou(): void {
        this.spriteSelect(SpriteDb.s_cotton);
        this.flags[kFLAGS.COTTON_MET_FUCKED] = 2;
        this.clearOutput();
        this.outputText(this.images.showImage("cotton-fucks-you"));
        this.player.slimeFeed();
        if (this.player.gender == 1) {
            this.outputText("You nod your head in assent. Noticing you didn't take the initiative, Cotton smiles and moves behind you, pushing you under your own shower spray. \"<i>Don't worry, my little pet, let Cotton take care of everything...</i>\" She gets a handful of soap and gently rubs your back, massaging the soap in while relaxing your muscles. You lean forward resting your arms and torso against the wall in front of you.\n\n");

            this.outputText("Cotton smiles, continuing to massage the soap in until she gets to your buttocks. There, she gets another handful of soap and presses it into your crack, gently soaping you up from taint to tailbone. Then she carefully inserts one finger into your " + this.player.assholeDescript() + " then two, three and before long her entire hand is exploring your depths. She giggles and withdraws her hand, \"<i>My my, such an eager little ass you have, my pet.</i>\"\n\n");

            this.outputText("She reaches between her legs and lifts her cock, letting it rest on the small of your back while she wets it down with water from the shower and strokes it to its full length. You feel it inching across your back, growing hotter and harder. With a glance back, you estimate it must be at least two feet long! You gulp and put your head down, clenching your teeth for the inevitable.\n\n");

            this.outputText("\"<i>Oh now pet, don't be so scared,</i>\" Cotton whispers into your ear, then lifts her cock from your back and places it at your " + this.player.assholeDescript() + ". She reaches forwards and you hear the squeak of the temperature nozzle being turned. Seconds later, the water pouring down on you gets hotter, causing your whole body to heat up in response. Using this time, Cotton presses forwards, her equine cock invading your " + this.player.assholeDescript() + " like a charging army. She thrusts in and out slowly, being careful not to hurt you.");
            this.player.buttChange(72, true, true, false);
            this.outputText("\n\n");

            this.outputText("Before long you find yourself moaning beneath her, your " + this.player.assholeDescript() + " clenching and unclenching uncontrollably. \"<i>Ooh, my little pet likes it now, hmmm?</i>\" She whispers into your ear and nibbles on it ever-so-slightly. You can't help but give a breathless \"<i>Yes</i>\" in response. Cotton giggles and speeds up her thrusts. You find yourself pushing back into her, urging her to go deeper and deeper. Your own dick is completely limp in the presence of this godly cock, but tingles with pleasure and anticipation.\n\n");

            this.outputText("After a few minutes of this, neither of you can take much more. Both of you give a deep moan of orgasmic pleasure as your " + this.player.assholeDescript() + " clenches and you feel your equine lover's cock twitch and spasm within you, flooding your hole with her hot seed. Your own limp member shudders with orgasm, but instead of spurting, it leaks a small torrent of cum right down onto the floor.");
            if (this.player.cumQ() >= 1000) this.outputText("  You nearly clog the drain with all the spooge leaking from your flaccid shaft.");
            this.outputText("\n\n");

            this.outputText("The two of you slip down onto the floor, right into your puddle of cum, letting the water rinse you off for the time being. After a minute, Cotton pulls her now flaccid (but still impressive) cock from your rear, which gapes open for several minutes afterward, and proceeds to clean the both of you up.\n\n");

            this.outputText("Your 'post-workout stretch' and shower done, the two of you dry off, redress and leave the gym. Cotton takes you by the arm and says, \"<i>That was great, little pet. Come by the gym anytime. I'll be waiting.</i>\"  Then, she heads back home.  With a little grin on your face, you do the same.\n\n");
            this.player.orgasm('Anal');
            this.dynStats("sen", 2);
        }
        // (Get fucked, as Female)
        else if (this.player.gender == 2) {
            this.outputText("You nod your head in assent. Noticing you didn't take the initiative, Cotton smiles and moves behind you, pushing you under your own shower spray. \"<i>Don't worry, my little pet, let Cotton take care of everything...</i>\" She gets a handful of soap and gently rubs your back, massaging the soap in while relaxing your muscles. You lean forward resting your arms and torso against the wall in front of you.\n\n");

            this.outputText("Cotton smiles, continuing to massage the soap in until she gets to your rear. There, she gets another handful of soap and presses it into your crevasse, gently soaping you up from " + this.player.clitDescript() + " to tailbone. Then she carefully inserts one finger into your pussy, then two, three, and before long her entire hand is exploring your most personal depths. She giggles and withdraws her hand, \"<i>My my, such an eager little cunt you have, my pet.</i>\"\n\n");

            this.outputText("She reaches between her legs and lifts her cock, letting it rest on the small of your back while she wets it down with water from the shower and strokes it to its full length. You feel it inching across your back, growing hotter and harder. With a glance back, you estimate it must be at least two feet long! You gulp and put your head down, clenching your teeth for the inevitable.\n\n");

            this.outputText("\"<i>Oh now pet, don't be so scared,</i>\" Cotton whispers into your ear, then lifts her cock from your back and places it at your " + this.player.vaginaDescript(0) + ". She reaches forwards and you hear the squeak of the temperature nozzle being turned. Seconds later, the water pouring down on you gets hotter, causing your whole body to heat up in response. Using this time, Cotton presses forwards, her equine cock invading your " + this.player.vaginaDescript(0) + " like a charging army. She thrusts in and out slowly, being careful not to hurt you.");
            this.player.cuntChange(72, true, true, false);
            this.outputText("\n\n");

            this.outputText("Before long you find yourself moaning beneath her, your cunt clenching and unclenching uncontrollably. \"<i>Ooh, my little pet likes it now, hmmm?</i>\" She whispers into your ear and nibbles on it ever-so-slightly. You can't help but give a breathless \"<i>Yes</i>\" in response. Cotton giggles and speeds up her thrusts. You find yourself pushing back into her, urging her to go deeper and deeper. Your clit twinges with pleasure after every thrust.\n\n");

            this.outputText("After a few minutes of this, neither of you can take much more. Both of you give a deep moan of orgasmic pleasure as your pussy clenches and you feel your equine lover's cock twitch and spasm within you, flooding your hole with her hot seed. You gasp and reflexively arch your back, moaning into the shower walls.\n\n");

            this.outputText("The two of you slip down onto the floor, letting the water rinse you off for the time being. After a minute, Cotton pulls her now flaccid (but still impressive) cock from your folds, which gapes open for several minutes afterward, and proceeds to clean the both of you up.\n\n");

            this.outputText("Your 'post-workout stretch' and shower done, the two of you dry off, redress and leave the gym. Cotton takes you by the arm and says, \"<i>That was great, little pet. Come by the gym anytime. I'll be waiting.</i>\"  Then, she heads back home.  With a little grin on your face, you do the same.");
            this.player.orgasm('Vaginal');
            this.dynStats("sen", -1);
            this.cottonPregPCChance();
        }
        // (Get fucked, as Herm)
        else {
            this.outputText("You nod your head in assent. Noticing you didn't take the initiative, Cotton smiles and moves behind you, pushing you under your own shower spray. \"<i>Don't worry, my little pet, let Cotton take care of everything...</i>\" She gets a handful of soap and gently rubs your back, massaging the soap in while relaxing your muscles. You lean forward resting your arms and torso against the wall in front of you.\n\n");

            this.outputText("Cotton smiles, continuing to massage the soap in until she gets to your rear. There, she gets another handful of soap and presses it into your crevasse, gently soaping you up from " + this.player.clitDescript() + " to tailbone. Then she carefully inserts one finger into your pussy, then two, three, and before long her entire hand is exploring your most personal depths. She giggles and withdraws her hand, \"<i>My my, such an eager little cunt you have, my pet.</i>\"\n\n");

            this.outputText("She reaches between her legs and lifts her cock, letting it rest on the small of your back while she wets it down with water from the shower and strokes it to its full length. You feel it inching across your back, growing hotter and harder. With a glance back, you estimate it must be at least two feet long! You gulp and put your head down, clenching your teeth for the inevitable.\n\n");

            this.outputText("\"<i>Oh now pet, don't be so scared,</i>\" Cotton whispers into your ear, then lifts her cock from your back and places it at your " + this.player.vaginaDescript() + ". She reaches forwards and you hear the squeak of the temperature nozzle being turned. Seconds later, the water pouring down on you gets hotter, causing your whole body to heat up in response. Using this time, Cotton presses forwards, her equine cock invading your " + this.player.vaginaDescript() + " like a charging army. She thrusts in and out slowly, being careful not to hurt you.");
            this.player.cuntChange(72, true, true, false);
            this.outputText("\n\n");

            this.outputText("Before long you find yourself moaning beneath her, your cunt clenching and unclenching uncontrollably. \"<i>Ooh, my little pet likes it now, hmmm?</i>\" She whispers into your ear and nibbles on it ever-so-slightly. You can't help but give a breathless \"<i>Yes</i>\" in response. Cotton giggles and speeds up her thrusts. You find yourself pushing back into her, urging her to go deeper and deeper. Your " + this.player.clitDescript() + " twinges with pleasure after every thrust, and your own " + this.player.cockDescript(0) + " is completely limp in the presence of this godly cock, but still it tingles with pleasure and anticipation.\n\n");

            this.outputText("After a few minutes of this, neither of you can take much more. Both of you give a deep moan of orgasmic pleasure as your pussy clenches and you feel your equine lover's cock twitch and spasm within you, flooding your hole with her hot seed. You gasp and reflexively arch your back, moaning into the shower walls while your own limp member shudders with orgasm, but instead of spurting, it leaks a small torrent of cum right down onto the floor.\n\n");

            this.outputText("The two of you slip down onto the floor, letting the water rinse you off for the time being. After a minute, Cotton pulls her now flaccid (but still impressive) cock from your folds, which gapes open for several minutes afterward, and proceeds to clean the both of you up.\n\n");

            this.outputText("Your 'post-workout stretch' and shower done, the two of you dry off, redress and leave the gym. Cotton takes you by the arm and says, \"<i>That was great, little pet. Come by the gym anytime. I'll be waiting.</i>\"  Then, she heads back home.  With a little grin on your face, you do the same.\n\n");
            this.player.orgasm('Vaginal');
            this.dynStats("sen", -1);
            this.cottonPregPCChance();
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    // (Service her, any gender)
    private serviceFirstTimeCotton(): void {
        this.spriteSelect(SpriteDb.s_cotton);
        this.flags[kFLAGS.COTTON_MET_FUCKED] = 2;
        this.player.slimeFeed();
        this.clearOutput();
        this.outputText(this.images.showImage("cotton-first-time-give-her-blowjob"));
        this.outputText("You meekly nod your head in assent, staring at her cock. \"<i>Ooh, interested in that, are we? Well, I wouldn't want to disappoint my little pet.</i>\" She steps back a bit and lets you get under her shower spray before pushing you into a kneeling position. Running a hand along the length of her equine member, she pulls it up until you're face to face with it. \"<i>How about you get it nice and ready to go first?</i>\"\n\n");

        this.outputText("Nodding, you gulp and grasp her cock, feeling along its warm semi-rigid length. You get it under the spray of water and rub gently, letting it harden. You occasionally glance up at Cotton, to make sure you're doing ok, and she just smiles back at you, wordlessly urging you to continue.\n\n");

        this.outputText("Leaning forward you give it a tentative lick along the side, and, to your surprise, find it to be quite sweet and pleasant. You lick again, then again, stroking it dutifully as you do so. It's not long until it's fully erect, at least two feet long by your estimate. Rather than be intimidated, you're spurred on! After all, you've got a lot of cock to suck and only so much time.\n\n");

        this.outputText("You pull your head back slightly and lick the head of Cotton's dick, its flat head a daunting task indeed. You open your mouth wide and take in the tip, swirling your tongue around the edge, teasing your lover's urethra until she's gasping slightly. Then you ease down the length of her impressive member, your tongue undulating the underside as it goes deeper into your mouth, then down your throat. You bob and suck and lick.\n\n");

        this.outputText("Cotton heaves forwards, pressing her hands against the wall behind you, \"<i>Almost... almost...</i>\" she whispers. You'd grin if you could, but find it's rather difficult with a mouthful of cock. So instead you keep at it, bobbing on the dick in front of you. It doesn't take much longer. You feel the horse-girl tense, her cock stiffening in your mouth. You pull back, releasing your mouth's grip on the cock just as it explodes in a torrent of cum, coating your face and torso.\n\n");

        this.outputText("You gulp it down, mildly surprised at how sweet it tastes. Taking two fingers you collect some of the cum deposited on your face and lick it off, then you carefully lick Cotton's rapidly shrinking member, until not a drop of cum remains.\n\n");

        this.outputText("Cotton helps you up and gives you a warm kiss, tasting her own seed in your mouth. Wordlessly, you finish your shower, redress and head out of the gym. Cotton takes you by the arm and says, \"<i>That was great, little pet. Come by the gym anytime. I'll be waiting.</i>\"  Then, she heads back home.  With a little grin on your face, you do the same.");
        this.dynStats("sen", 1, "lus", (10 + this.player.lib / 20 + this.player.sens / 20));
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    // (If Refuse)
    private refuseFirstTimeCotton(): void {
        this.spriteSelect(SpriteDb.s_cotton);
        this.clearOutput();
        this.outputText("She looks at you a little sad, \"<i>You certain pet? Well, all right. But you don't know what you're missing.</i>\" The two of you continue your shower with no funny business, then redress and leave the gym. Cotton stops you before you go too far and says, \"<i>Hey, if you want to stop by the gym later for some more yoga, I'd be happy to help.</i>\" Then she heads off down the street, and you head back to camp.");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // (Shower Sex, Fuck Her)
    private fuckCottonInShowerRepeat(): void {
        this.flags[kFLAGS.COTTON_MET_FUCKED] = 2;
        this.spriteSelect(SpriteDb.s_cotton);
        this.clearOutput();
        this.outputText(this.images.showImage("cotton-shower-fuck-repeat"));
        let x: number = this.player.cockThatFits(60);
        if (x < 0) x = 0;

        /*OLD ORIGINAL REPEAT SHOWER SEX
        outputText("You decide to take her up on her offer, pulling her into the showers and quickly disrobing. Seeing the look on your face, she does too, and quickly enters the showers, turning only one shower-head on. She turns around and grabs you, pulling you into an embrace as you kiss under the steaming water. Both your cocks stir, rising and rubbing together while you make out.\n\n");

        outputText("Finally breaking the kiss, you reach down and hook your arm under one of her legs, lifting her leg up while you position your rock hard member at her pussy. She leans forward to kiss again as you thrust forwards, causing her to moan into your mouth. You thrust in and out while her horse-cock bounces between the two of you, only adding to the excitement.\n\n");

        outputText("After several minutes, the hot shower, hot woman and hot sex are just too much for you, and give one last thrust, pushing your bodies forward to slam against the wall. It's clearly too much for Cotton as well, as she groans out in orgasmic ecstasy. Her cock, sandwiched between you, tenses and explodes just as yours does, covering Cotton in cum inside and out.\n\n");

        outputText("After a moment you pull out, share a deep kiss, and wash each other up before redressing and leaving the gym.");
        */
        // (Repeat Fuck Her, for centaurs)
        if (this.player.isTaur()) {
            this.outputText("You decide to take her up on her offer and lead her into the showers, quickly disrobing and turning on an available shower-head. Cotton strips as well and you pull her under the stream of water, letting your horse body remain out of the water for now, sharing a kiss as steam begins to form around you. She runs a hand through your " + this.player.hairDescript() + " and grips the back of your neck, ");
            if (this.pregnancy.event > 1) this.outputText("pulling you gently towards her bulging belly, which you can't help but put your hands against as you kiss her. The bulge is firm and solid, almost a drum of solid muscle, and you caress it as you and the mare-morph make out, eliciting soft murmurs of appreciation for your efforts.\n\n");
            else this.outputText("pulling you closer.\n\n");

            // (If PC has one cock)
            if (this.player.cockArea(x) >= 100) {
                if (this.player.cockTotal() == 1) this.outputText("You feel your " + this.player.cockDescript(x) + " stirring beneath your large body, while Cotton's remains curiously limp.  While her cock dangles, yours strains for attention.");
                // (If PC has multiple cocks)
                else if (this.player.cockTotal() > 1) this.outputText("You feel your " + this.player.multiCockDescriptLight() + " stirring beneath your large body, while Cotton's remains curiously limp.  While her cock dangles, your group of cocks strains for attention.");
            }
            else {
                if (this.player.cockTotal() == 1) this.outputText("You feel your " + this.player.cockDescript(x) + " stirring beneath your large body, while you watch Cotton's do the same. Her cock rubs against your stomach while yours strains for attention.");
                // (If PC has multiple cocks)
                else if (this.player.cockTotal() > 1) this.outputText("You feel your " + this.player.multiCockDescriptLight() + " stirring beneath your large body, while you watch Cotton's do the same. Her cock rubs against your stomach while your group of cocks strains for attention.");
            }
            // (If PC has a pussy, add the following)
            if (this.player.hasVagina()) this.outputText("  Meanwhile, your " + this.player.vaginaDescript(0) + " behind you moistens both from the steam and from arousal, and your " + this.player.clitDescript() + " aches, craving attention.");
            this.outputText("\n\n");

            // (If PC has breasts)
            if (this.player.biggestTitSize() >= 2) {
                this.outputText("Cotton leans down, groping your " + this.player.biggestBreastSizeDescript() + ", taking one " + this.player.nippleDescript(0) + " into her mouth and sucking it greedily.");
                // (and if PC is lactating)
                if (this.player.biggestLactation() >= 1) {
                    this.outputText("  Her efforts are soon rewarded as milk begins seeping from your " + this.player.nippleDescript(0) + ". Cotton's eyes turn up to your face in surprise, but she doesn't remove her mouth, instead taking the time to gulp down your tasty milk. It isn't long before she draws back, wipes her mouth and practically tackles your other breast, eager to drain it of its precious cargo. You can't help but moan as a draining sensation overwhelms you. After a moment, Cotton pulls away and smacks her lips. \"<i>That is some tasty, tasty milk, pet, I might have to taste you more often.</i>\"");
                    this.flags[kFLAGS.COTTON_BREAKFAST_CLUB] = 1;
                }
                // (else is PC is not lactating)
                else this.outputText("  Cotton soon switches to the other breast, teasing your " + this.player.nippleDescript(0) + " with her talented tongue.");
                this.outputText("\n\n");
            }

            this.outputText("Suitably turned on now, you look around and drag one of the nearby benches from the changing rooms into the showers and pull it under the water. Cotton grins, understanding what you plan to do with it, and gets onto all fours on top of it. You walk over the bench, getting your body under the spray of water, and get your cock into position. Your fellow equine lover helps with the fine movement, placing your cock at her entrance while giving your underside a reassuring pat. You slowly push forward, and Cotton bites her lip, again giving a reassuring pat.");
            // (If player has two cocks, add)
            if (this.player.cockTotal() == 2) this.outputText("  With a slight grin, you begin poking your extra dick at Cotton's other hole. You hear an indignant grunt, followed by a sigh, and feel her hands on your member, guiding it all the way into her hole.");
            // (If the player has more cocks, add)
            else if (this.player.cockTotal() > 2) this.outputText("  The rest of your cocks jiggle and bob, rubbing up against her thighs and butt wildly.");
            // (If player is too big, add)
            if (this.player.cockArea(x) > 70) this.outputText("  Though you are far too big for her, you make sure to stuff her as much as you can. Her cunt, big as it is, squeezes tightly on your " + this.player.cockDescript(x) + ". She shivers and quakes, and leans against the bench, gripping your forelegs for support. You thrust your overly large tool inside her over and over, stretching her already not-insignificant cunt even wider. Her tongue actually rolls out of her snout, lolling to the side while her eyes roll up into her head, lost in the pleasure. Her body rocks with an orgasm while you piston away under the spray of water.");
            // (if player is too small (under 4</i>\")
            else if (this.player.cocks[x].cockLength < 4) {
                this.outputText("  Her approval wavers and you hear from below you, \"<i>Is it in yet?</i>\" Your face flushes red and you confirm it is, looking down with embarrassment. Cotton rubs one of your forelegs reassuringly and says, \"<i>");
                if (this.pregnancy.event > 1) this.outputText("Don't worry pet, it's plenty adequate for me.  And you've got to admit,</i>\" she smirks, rubbing her round belly, \"<i>It gets the job done, doesn't it?");
                else this.outputText("Don't worry pet, it's plenty adequate for me.");
                this.outputText("</i>\" Letting a little smile cross your lips, you push your " + this.player.cockDescript(x) + " fully into her, not a big accomplishment for one of your size, but still enough to make you feel good.");
            }
            // (if none of the above, add)
            else this.outputText("  You piston back and forth, and though Cotton's cunt is sizable, it's able to grip you tightly. Your equine lover moans and grasps at your chest, eventually seizing your leg for support, though she leans backwards.");
            this.outputText("\n\n");

            this.outputText("You keep this up for a while, fatigue not really an issue with a body of your size and shape. Cotton, meanwhile, gasps for breath audibly and has taken to laying her front half down on the bench, her ass right up in the air. She strokes your forelegs lovingly, showing she's still ready for more.  ");
            if (this.player.cockArea(x) >= 100) this.outputText("Oblivious to you, her own limp cock leaks cum down onto the bench as an orgasm rocks her body.");
            else if (this.pregnancy.event > 1) this.outputText("Oblivious to you, her own cock twitches and spasms, letting loose a spray of cum across her swollen, pregnant belly, breasts and the bench as an orgasm rocks her body.");
            else this.outputText("Oblivious to you, her own cock twitches and spasms, letting loose a spray of cum across her belly, breasts and the bench as an orgasm rocks her body.");
            // (If player is too big, add)
            if (this.player.cockArea(x) > 70) this.outputText("  Even with all the pounding you've been doing, you can't fit your entire girth into her, but she doesn't care. Her eyes seem to roll back and forth like it's hard to focus, and her tongue drips water, sweat and saliva onto her body. She's panting for breath and you are able to make out faint, \"<i>Oh gods, oh gods</i>\" over the running water. Were you able to see her toned stomach, you're sure you could see the outline of your " + this.player.cockDescript(x) + " in it. Her back arches under the shower, her red hair messily draped around her face and bench, and she bites her lip as another orgasm rocks her body.");
            this.outputText("\n\n");

            this.outputText("Finally you just can't take any more. You give one last thrust into your partner and audibly gasp in relief as an orgasm rolls across your body, hitting your nerves with bolts of ecstatic lightning.");
            // (If PC has a pussy)
            if (this.player.hasVagina()) this.outputText("  Your " + this.player.cockDescript(x) + " erupts inside Cotton's warm cunt which clenches you tightly, while your own femme sex twinges and clenches on air, drooling juices down your legs.");
            // (else)
            else this.outputText("   Your " + this.player.cockDescript(x) + " erupts inside Cotton's warm cunt which clenches you tightly.");
            // (regardless or above, add)
            this.outputText("  You give a couple more token thrusts and pull out. As you do, ");
            if (this.player.cumQ() < 200) this.outputText("cum begins to seep from her folds");
            else if (this.player.cumQ() < 700) this.outputText("a gush of cum escapes from Cotton's folds");
            else if (this.player.cumQ() < 1200) this.outputText("a small torrent of cum escapes from Cotton's folds");
            else if (this.player.cumQ() < 2000) this.outputText("cum surges from her abused hole");
            else this.outputText("a massive flood of cum escapes from her cunt");
            this.outputText(", immediately getting washed towards the drain.\n\n");

            this.outputText("You both bask in the afterglow for a few moments before you stand up and help Cotton up. You return to the task of cleaning yourselves, sensually washing each other's private areas. Yoga, sex and cleanup done, you get dressed and leave the gym, giving Cotton's hand a final squeeze before departing.");
        }
        // (Repeat fuck her, for nagas)
        else if (this.player.isNaga()) {
            this.outputText("You decide to take her up on her offer and lead her into the showers, quickly disrobing and turning on an available shower-head. Cotton strips as well and you pull her under the stream of water, sharing a kiss as steam begins to form around you. She runs a hand through your " + this.player.hairDescript() + " and grips the back of your neck, ");
            if (this.pregnancy.event > 1) this.outputText("pulling you gently towards her bulging belly, which you can't help but put your hands against as you kiss her. The bulge is firm and solid, almost a drum of solid muscle, and you caress it as you and the mare-morph make out, eliciting soft murmurs of appreciation for your efforts.");
            else this.outputText("pulling you closer.\n\n");

            if (this.player.cockArea(x) >= 100) {
                // (If PC has one cock)
                if (this.player.cockTotal() == 1) this.outputText("  You feel your " + this.player.cockDescript(x) + " stirring beneath you, slowly coming to attention, though Cotton's remains curiously limp.  Your " + this.player.cockHead(x) + " rubs against her belly, sending ripples of pleasure up your spine.");
                // (If PC has multiple cocks)
                else if (this.player.cockTotal() > 1) this.outputText("  You feel your " + this.player.multiCockDescriptLight() + " stirring beneath you, slowly coming to attention, though Cotton's remains curiously limp.  The group of cocks rubs together as you make out, sending ripples of pleasure up your spine.");
            }
            else {
                // (If PC has one cock)
                if (this.player.cockTotal() == 1) this.outputText("You feel your " + this.player.cockDescript(x) + " stirring beneath you, slowly coming to attention alongside Cotton's equine member.  The two rub together as you make out, sending ripples of pleasure up your spine.");
                // (If PC has multiple cocks)
                else if (this.player.cockTotal() > 1) this.outputText("You feel your " + this.player.multiCockDescriptLight() + " stirring beneath you, slowly coming to attention alongside Cotton's equine member. The group of cocks rubs together as you make out, sending ripples of pleasure up your spine.");
            }
            // (If PC has a pussy, add the following)
            if (this.player.hasVagina()) this.outputText("Your " + this.player.vaginaDescript(0) + " meanwhile moistens both from the water and from arousal, and your " + this.player.clitDescript() + " aches, craving attention.");
            this.outputText("\n\n");

            // (If PC has breasts)
            if (this.player.biggestTitSize() >= 2) {
                this.outputText("Cotton leans down, groping your " + this.player.biggestBreastSizeDescript() + ", taking one " + this.player.nippleDescript(0) + " into her mouth and sucking it greedily.");
                // (and if PC is lactating)
                if (this.player.biggestLactation() >= 1) {
                    this.outputText("  Her efforts are soon rewarded as milk begins seeping from your " + this.player.nippleDescript(0) + ". Cotton's eyes turn up to your face in surprise, but she doesn't remove her mouth, instead taking the time to gulp down your tasty milk. It isn't long before she draws back, wipes her mouth and practically tackles your other breast, eager to drain it of its precious cargo. You can't help but moan as a draining sensation overwhelms you. After a moment, Cotton pulls away and smacks her lips. \"<i>That is some tasty, tasty milk, pet, I might have to taste you more often.</i>\"");
                    this.flags[kFLAGS.COTTON_BREAKFAST_CLUB] = 1;
                }
                // (else is PC is not lactating)
                else this.outputText("  Cotton soon switches to the other breast, teasing your " + this.player.nippleDescript(0) + " with her talented tongue.");
                this.outputText("\n\n");
            }

            this.outputText("Suitably turned on now, you coil your body around Cotton's torso, with your tail spreading her legs apart while you place your " + this.player.cockDescript(x) + " at her pussy. You slowly push in, and Cotton bites her lip, looking at you in approval.");
            // (If player has two cocks, add)
            if (this.player.cockTotal() == 2) this.outputText("  With a slight grin, you position your extra dick at Cotton's other hole. She quirks her eyebrow and a look of panic momentarily crosses her face, but you push forward anyway. Cotton's eyes roll up briefly and her lip quivers.");
            // (If the player has more cocks, add)
            else if (this.player.cockTotal() > 2) this.outputText("  The rest of your cocks strain, aching for holes to fill. With none available, they throb as they rub against Cotton's smooth skin.");
            // (If player is too big, add)
            if (this.player.cockArea(x) > 70) this.outputText("  Though you are far too big for her, you make sure to stuff her as much as you can. Her cunt, big as it is, squeezes tightly on your " + this.player.cockDescript(x) + ". She shivers and quakes, and leans against the shower wall, gripping the shower-head for support. You thrust your overly large tool inside her over and over, stretching her already not insignificant cunt even wider. Her tongue actually rolls out of her snout, lolling to the side while her eyes roll up into her head, lost in the pleasure. Her body rocks with an orgasm while you piston away under the spray of water.");
            // (if player is too small (under 4</i>\") add)
            else if (this.player.cocks[x].cockLength < 4) {
                this.outputText("  Her approval wavers and she asks, \"<i>Is it in yet?</i>\" Your face flushes red and you confirm it is, looking down with embarrassment. Cotton lifts your chin and gives you a kiss, \"<i>");
                if (this.pregnancy.event > 1) this.outputText("Don't worry pet, it's plenty adequate for me.  And you've got to admit,</i>\" she smirks, rubbing her round belly, \"<i>It gets the job done, doesn't it?");
                else this.outputText("Don't worry pet, it's plenty adequate for me.");
                this.outputText("</i>\" Giving her a little smile, you push your " + this.player.cockDescript(x) + " fully into her, not a big accomplishment for one of your size, but still enough to give you a little smile.");
            }
            // (otherwise add)
            else this.outputText("  You piston back and forth, and though Cotton's cunt is sizeable, it's able to grip you tightly. Your equine lover moans and grasps at your chest, eventually seizing your shoulder for support, though she leans backwards.");
            this.outputText("\n\n");

            this.outputText("You keep this up for a while, before fatigue takes over. You carefully lay Cotton down in the spray of water, coiling your body under her so her rear end is up in the air, hooves resting on the ground, and continue your work unhindered. She kisses your lips, neck, and whatever she can get her mouth on.  ");
            if (this.player.cockArea(x) >= 100) this.outputText("Her own cock, still limp, visibly twitches and begins leaking cum onto her belly as an orgasm rocks her body.");
            else if (this.pregnancy.event > 1) this.outputText("Her own cock twitches and spasms, letting loose a spray of cum across her swollen, pregnant belly, breasts and face as an orgasm rocks her body.");
            else this.outputText("Her own cock twitches and spasms, letting loose a spray of cum across her belly, breasts and face as an orgasm rocks her body.");
            // (If player is too big, add)
            if (this.player.cockArea(x) > 70) this.outputText("  Even in this pseudo-missionary position you can't stuff your entire enormous girth into her, but she doesn't care. Her eyes seem to roll back and forth like it's hard to focus, and her tongue drips water, sweat and saliva onto her body. She's panting for breath and you are able to make out faint, \"<i>Oh gods, oh gods</i>\" over the running water. You can even make out the shape of your cock in Cotton's toned stomach, pumping back and forth, which brings a smile to your face. Her back arches under the shower, her hair messily spread out beneath her and she bites her lip as another orgasm rocks her body.");
            this.outputText("\n\n");

            this.outputText("Finally you just can't take anymore. You give one last thrust into your partner and audibly gasp in relief as an orgasm rolls across your body, hitting your nerves with bolts of ecstatic lightning.");
            // (If PC has a pussy)
            if (this.player.hasVagina()) this.outputText("  Your " + this.player.cockDescript(x) + " erupts inside Cotton's warm cunt, which clenches you tightly, while your own femme sex twinges and clenches on air, drooling juices down your legs.");
            // (else)
            else this.outputText("  Your " + this.player.cockDescript(x) + " erupts inside Cotton's warm cunt, which clenches you tightly.");
            // (regardless or above, add)
            this.outputText("  You give a couple more token thrusts and pull out. As you do, ");
            if (this.player.cumQ() < 200) this.outputText("cum begins to seep from her folds");
            else if (this.player.cumQ() < 700) this.outputText("a gush of cum escapes from Cotton's folds");
            else if (this.player.cumQ() < 1200) this.outputText("a small torrent of cum escapes from Cotton's folds");
            else if (this.player.cumQ() < 2000) this.outputText("cum surges from her abused hole");
            else this.outputText("a massive flood of cum escapes from her cunt");
            this.outputText(", immediately getting washed towards the drain.\n\n");

            this.outputText("You both bask in the afterglow for a few moments before you slither into an upright position and help Cotton up. You return to the task of cleaning yourselves, sensually washing each other's private areas. Yoga, sex and cleanup done, you get dressed and leave the gym, giving Cotton's hand a final squeeze before departing.");
        }
        // (Repeat Fuck Her, for humanoid bodies)
        else {
            this.outputText("You decide to take her up on her offer and lead her into the showers, quickly disrobing and turning on an available shower-head. Cotton strips as well and you pull her under the stream of water, sharing a kiss as steam begins to form around you. She runs a hand through your " + this.player.hairDescript() + " and grips the back of your neck, ");
            if (this.pregnancy.event > 1) this.outputText("pulling you gently towards her bulging belly, which you can't help but put your hands against as you kiss her. The bulge is firm and solid, almost a drum of solid muscle, and you caress it as you and the mare-morph make out, eliciting soft murmurs of appreciation for your efforts.");
            else this.outputText("pulling you closer.");

            if (this.player.cockArea(x) >= 100) {
                // (If PC has one cock)
                if (this.player.cockTotal() == 1) this.outputText("  You feel your " + this.player.cockDescript(x) + " stirring beneath you, slowly coming to attention, though Cotton's remains curiously limp.  Your " + this.player.cockHead(x) + " rubs against her belly, sending ripples of pleasure up your spine.");
                // (If PC has multiple cocks)
                else if (this.player.cockTotal() > 1) this.outputText("  You feel your " + this.player.multiCockDescriptLight() + " stirring beneath you, slowly coming to attention, though Cotton's remains curiously limp.  The group of cocks rubs together as you make out, sending ripples of pleasure up your spine.");
                // (If PC has a pussy, add the following)
            }
            else {
                // (If PC has one cock)
                if (this.player.cockTotal() == 1) this.outputText("  You feel your " + this.player.cockDescript(x) + " stirring beneath you, slowly coming to attention alongside Cotton's equine member. The two rub together as you make out, sending ripples of pleasure up your spine.");
                // (If PC has multiple cocks)
                else if (this.player.cockTotal() > 1) this.outputText("  You feel your " + this.player.multiCockDescriptLight() + " stirring beneath you, slowly coming to attention alongside Cotton's equine member. The group of cocks rubs together as you make out, sending ripples of pleasure up your spine.");
                // (If PC has a pussy, add the following)
            }

            if (this.player.hasVagina()) this.outputText("  Your " + this.player.vaginaDescript(0) + " moistens both from the water and from arousal, and your " + this.player.clitDescript() + " aches, craving attention.");
            this.outputText("\n\n");

            // (If PC has breasts)
            if (this.player.biggestTitSize() >= 2) {
                this.outputText("Cotton leans down, groping your " + this.player.biggestBreastSizeDescript() + ", taking one " + this.player.nippleDescript(0) + " into her mouth and sucking it greedily.");
                // (and if PC is lactating)
                if (this.player.biggestLactation() >= 1) {
                    this.outputText("  Her efforts are soon rewarded as milk begins seeping from your " + this.player.nippleDescript(0) + ". Cotton's eyes turn up to your face in surprise but she doesn't remove her mouth, instead taking the time to gulp down your tasty milk. It isn't long before she draws back, wipes her mouth and practically tackles your other breast, eager to drain it of its precious cargo. You can't help but moan as a draining sensation overwhelms you. After a moment, Cotton pulls away and smacks her lips. \"<i>That is some tasty, tasty milk, pet, I might have to taste you more often.</i>\"");
                    this.flags[kFLAGS.COTTON_BREAKFAST_CLUB] = 1;
                }
                // (else is PC is not lactating)
                else this.outputText("  Cotton soon switches to the other breast, teasing your " + this.player.nippleDescript(0) + " with her talented tongue.");
                this.outputText("\n\n");
            }

            this.outputText("Suitably turned on now, you reach down and hook your arm under one of Cotton's legs, lifting it up while you position your " + this.player.cockDescript(x) + " at her pussy. You slowly push in, and Cotton bites her lip, looking at you in approval.");
            // (If player has two cocks, add)
            if (this.player.cockTotal() == 2) this.outputText("  With a slight grin, you position your other dick at Cotton's other hole. She quirks her eyebrow and a look of panic momentarily crosses her face, but you push forward anyway. Cotton's eyes roll up briefly and her lip quivers.");
            // (If the player has more cocks, add)
            if (this.player.cockTotal() > 2) this.outputText("  The rest of your cocks strain, aching for holes to fill. With none available, they throb as they rub against Cotton's smooth skin.");
            // (If player is too big, add)
            if (this.player.cockArea(x) > 70) this.outputText("  Though you are far too big for her, you make sure to stuff her as much as you can. Her cunt, big as it is, squeezes tightly on your " + this.player.cockDescript(x) + ". She shivers and quakes, and leans against the shower wall, gripping the shower-head for support. You thrust your overly large tool inside her over and over, stretching her already not-insignificant cunt even wider. Her tongue actually rolls out of her snout, lolling to the side while her eyes roll up into her head, lost in the pleasure. Her body rocks with an orgasm while you piston away under the spray of water.");
            // (if player is too small (under 4</i>\") add)
            else if (this.player.cocks[x].cockLength < 4) {
                this.outputText("  Her approval wavers and she asks, \"<i>Is it in yet?</i>\" Your face flushes red and you confirm it is, looking down in embarrassment. Cotton lifts your chin and gives you a kiss, \"<i>");
                if (this.pregnancy.event > 1) this.outputText("Don't worry pet, it's plenty adequate for me.  And you've got to admit,</i>\" she smirks, rubbing her round belly, \"<i>It gets the job done, doesn't it?");
                else this.outputText("Don't worry pet, it's plenty adequate for me.");
                this.outputText("</i>\" Giving her a little smile, you push your " + this.player.cockDescript(x) + " fully into her, not a big accomplishment for one of your size, but still enough to give you a little smile.");
            }
            // (otherwise add)
            else this.outputText("You piston back and forth, and though Cotton's cunt is sizeable, it's able to grip you tightly. Your equine lover moans and grasps at your chest, eventually seizing your shoulder for support, though she leans backwards.");
            this.outputText("\n\n");

            this.outputText("You keep this up for a while before fatigue takes over. You carefully lay Cotton down in the spray of water and continue your work unhindered. She kisses your lips, neck, and whatever she can get her mouth on.  ");
            if (this.player.cockArea(x) >= 100) this.outputText("Her own cock, still limp, visibly twitches and begins leaking cum onto her belly as an orgasm rocks her body.");
            else if (this.pregnancy.event > 1) this.outputText("Her own cock twitches and spasms, loosing a spray of cum across her swollen, pregnant belly, breasts and face as an orgasm rocks her body.");
            else this.outputText("Her own cock twitches and spasms, letting loose a spray of cum across her belly, breasts and face as an orgasm rocks her body.");
            // (If player is too big, add)
            if (this.player.cockArea(x) > 70) this.outputText("  Even in the missionary position you can't stuff your entire enormous girth into her, but she doesn't care. Her eyes seem to roll back and forth like it's hard to focus, and her tongue drips water, sweat and saliva onto her body. She's panting for breath and you are able to make out faint, \"<i>Oh gods, oh gods</i>\" over the running water. You can even make out the shape of your cock in Cotton's toned stomach, pumping back and forth, which brings a smile to your face. Her back arches under the shower, her hair messily spread out beneath her and she bites her lip as another orgasm rocks her body.");
            this.outputText("\n\n");

            this.outputText("Finally you just can't take any more. You give one last thrust into your partner and audibly gasp in relief as an orgasm rolls across your body, hitting your nerves with bolts of ecstatic lightning.");
            // (If PC has a pussy)
            if (this.player.hasVagina()) this.outputText("  Your " + this.player.cockDescript(x) + " erupts inside Cotton's warm cunt, which clenches you tightly while your own femme sex twinges and clenches on air, drooling juices down your legs.");
            // (else)
            else this.outputText("  Your " + this.player.cockDescript(x) + " erupts inside Cotton's warm cunt, which clenches you tightly.");
            // (regardless or above, add)
            this.outputText("  You give a couple more token thrusts and pull out. As you do, ");
            if (this.player.cumQ() < 200) this.outputText("cum begins to seep from her folds");
            else if (this.player.cumQ() < 700) this.outputText("a gush of cum escapes from Cotton's folds");
            else if (this.player.cumQ() < 1200) this.outputText("a small torrent of cum escapes from Cotton's folds");
            else if (this.player.cumQ() < 2000) this.outputText("cum surges from her abused hole");
            else this.outputText("a massive flood of cum escapes from her cunt");
            this.outputText(", immediately getting washed towards the drain.\n\n");

            this.outputText("You both bask in the afterglow for a few moments before you stand up to an upright position and help Cotton up. You return to the task of cleaning yourselves, sensually washing each other's private areas. Yoga, sex and cleanup done, you get dressed and leave the gym, giving Cotton's hand a final squeeze before departing.");
        }
        this.pregCottonChance();
        this.player.orgasm('Dick');
        this.dynStats("sen", -1);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // (Shower Sex, Get Fucked as Male or Herm)
    private cottonFucksYouInShowerRepeat(): void {
        this.spriteSelect(SpriteDb.s_cotton);
        this.player.slimeFeed();
        this.flags[kFLAGS.COTTON_MET_FUCKED] = 2;
        this.clearOutput();
        this.outputText(this.images.showImage("cotton-shower-fucks-you-repeat"));
        /*OLD SEX SCENES HERE
        if (player.hasCock() && (player.gender != 3 || rand(2) == 0)) {
            outputText("You decide to take her up on her offer, and she pulls you towards the showers, quickly disrobing the both of you. She turns only one shower-head on and pulls you into an embrace underneath the rapidly heating stream. Cotton's cock stirs between you, and though yours tingles, it remains limp in her presence.\n\n");

            outputText("Finally breaking the kiss, Cotton reaches down and hooks her arms under both your legs. You quickly wrap your arms around her neck as she lifts you off the ground. You carefully grip her with your legs as she uses one arm to position her dick at your waiting entrance. You give her a kiss just as she presses into you, and moan into her mouth. She gives a couple careful thrusts before her free hand returns to holding you.\n\n");

            outputText("At this angle she can't quite get her entire girth into you, but that doesn't matter, as it feels absolutely exquisite.");
            player.buttChange(72,true,true,false);
            outputText("  You take turns kissing each other's necks and nibbling each other's ears while she thrusts in and out. And after several minutes neither of you can take much more. She gives one last thrust, pulling you down further onto her cock as it explodes within you. Your whole body shudders with orgasmic energy and you bury your head into her neck, stifling a scream.\n\n");

            outputText("After a moment, Cotton pulls you up, letting her shrinking member flop to the floor, and sets you down. Only now you notice your flaccid cock also came at some point, covering both your bodies in seed. You share a deep kiss again and wash each other up before redressing and leaving the gym.\n\n");
            player.orgasm('Anal');
            dynStats("sen", 1);
        }
        //(Shower Sex, Get Fucked as Female)
        else {
            outputText("You decide to take her up on her offer, and she pulls you towards the showers, quickly disrobing the both of you. She turns only one shower-head on and pulls you into an embrace underneath the rapidly heating stream. Cotton's cock stirs between you, and your " + player.vaginaDescript() + " burns with anticipation.\n\n");

            outputText("Finally breaking the kiss, Cotton reaches down and hooks her arms under both your legs. You quickly wrap your arms around her neck as she lifts you off the ground. You carefully grip her with your legs as she uses one arm to position her dick at your waiting entrance. You give her a kiss just as she presses into you, and moan into her mouth. She gives a couple careful thrusts before her free hand returns to holding you.");
            player.cuntChange(72,true,true,false);
            outputText("\n\n");

            outputText("At this angle she can't quite get her entire girth into you, but that doesn't matter, as it feels absolutely exquisite. You take turns kissing each other's necks and nibbling each other's ears while she thrusts in and out. And after several minutes neither of you can take much more. She gives one last thrust, pulling you down further onto her cock as it explodes within you. Your whole body shudders with orgasmic energy and you bury your head into her neck, stifling a scream.\n\n");

            outputText("After a moment, Cotton pulls you up, letting her shrinking member flop to the floor, and sets you down. You share a deep kiss again and wash each other up before redressing and leaving the gym.");
            player.orgasm('Vaginal');
            dynStats("sen", -1);
        }*/
        // (Repeat get fucked, for centaurs)
        if (this.player.isTaur()) {
            this.outputText("You decide to take her up on her offer and she pulls you towards the showers, quickly disrobing you forcibly and then herself. She turns only one shower-head on and pulls you into an embrace underneath the rapidly heating water. She kisses up your neck and playfully bites you with a grin.");
            // (If PC has a penis, no vagina)
            if (this.player.gender == 1) this.outputText("  Your " + this.player.cockDescript(0) + " tingles betwixt your legs, but remains limp in the presence of Cotton's impressive member.");
            // (If PC has a penis and vagina)
            else if (this.player.gender == 3) this.outputText("  Your " + this.player.cockDescript(0) + " tingles betwixt your legs, but remains limp in the presence of Cotton's impressive member, while your " + this.player.vaginaDescript(0) + " moistens almost immediately from the steam and arousal.");
            // (If PC has a vagina and no penis)
            else if (this.player.gender == 2) this.outputText("  Your " + this.player.vaginaDescript(0) + " moistens almost immediately as you make out, both from the steam and your increasing arousal.");
            // (If PC is genderless)
            else this.outputText("  A deep aching burns within you, a need your body is ill-equipped to process, but still your nipples harden and you find your " + this.player.assholeDescript() + " puckering in anticipation.");
            this.outputText("\n\n");

            // (If PC has breasts)
            if (this.player.biggestTitSize() >= 2) {
                this.outputText("Cotton's kisses lead down to your " + this.player.biggestBreastSizeDescript() + ", where she takes one " + this.player.nippleDescript(0) + " into her mouth, sucking it greedily and teasing it masterfully.");
                // (and if PC is lactating)
                if (this.player.biggestLactation() >= 1) {
                    this.outputText("  Her efforts are soon rewarded as milk begins seeping from your " + this.player.nippleDescript(0) + ". Cotton's eyes turn up to your face in surprise, but she doesn't remove her mouth, instead taking the time to gulp down your tasty milk. It isn't long before she draws back, wipes her mouth and practically tackles your other breast, eager to drain it of its precious cargo. You can't help but moan as the draining sensation overwhelms you. After a moment, Cotton pulls away and smacks her lips. \"<i>That is some tasty, tasty milk, little pet.  I simply must have you for breakfast sometime.</i>\"");
                    this.flags[kFLAGS.COTTON_BREAKFAST_CLUB] = 1;
                }
                // (else is PC is not lactating)
                else this.outputText("  Cotton soon switches to the other breast, teasing your " + this.player.nippleDescript(0) + " with her talented tongue.");
                this.outputText("\n\n");
            }

            this.outputText("She continues kissing down your belly, reaching your centaur body. She makes you turn around so your rear end is in the spray of water with her.");
            // (If PC has a large penis, bigger than Cotton's capacity, add)
            if (this.player.hasCock()) {
                if (this.player.cockArea(0) > 70) this.outputText("  \"<i>Oh my, what's this?</i>\" She puts a hand under your enormous, yet embarrassingly limp cock and lifts it slightly. \"<i>My little pet has such a big dick... Just how I like it. Perhaps next time I'll get to try it out... but not today, hm? This is all about you right now.</i>\"");
                // (If PC has a penis under 4</i>\", add)
                else if (this.player.longestCockLength() < 4) this.outputText("  \"<i>Awww, what's this?</i>\" She puts a hand under your embarrassingly small and limp cock and lifts it slightly. \"<i>It's so cute and tiny. And it certainly knows its place. Only room for one cock right now, not that this is much of a cock.</i>\" She giggles and plants a kiss on the tip, \"<i>It is cute though. I love it.</i>\"");
                // (If PC has a penis neither large or small, add)
                else this.outputText("Cotton puts a hand under your embarrassingly limp cock and smiles, \"<i>You know how to show a girl you like her... There's only room for one cock right now.</i>\"");
            }
            // (If PC has a vagina)
            if (this.player.hasVagina()) this.outputText("  Spying your " + this.player.vaginaDescript(0) + ", Cotton smiles and flicks your " + this.player.clitDescript() + " teasingly before slipping two fingers inside your folds and bringing them to her mouth, licking them clean. \"<i>Mmm... I love the taste of your juices, pet...</i>\"");
            // (if PC is genderless)
            if (this.player.gender == 0) this.outputText("  She places a hand on your bare crotch and quirks an eyebrow. \"<i>Well this is new... Certainly not bad though.</i>\" She runs a hand along your bare mound, which somehow manages to send ripples of pleasure up your spine.");
            this.outputText("\n\n");

            this.outputText("Cotton continues the kisses down to your " + this.player.legs() + " and stands, dragging over a bench from the locker room before standing on it and giving your " + this.player.buttDescript() + " a good smack. You turn back and give her a coy look, which she returns and gives your flank another smack.");
            this.outputText("  She takes a moment to get some water from the shower over your rear end before pressing her cock against your " + this.player.assholeOrPussy() + ", slipping it in gently, careful not to go too quick. You moan slightly and blush, whispering back at her, urging her to continue.");
            // (Stretch and appropriate virginity check)
            if (this.player.hasVagina()) this.player.cuntChange(72, true, true, false);
            else this.player.buttChange(72, true, true, false);
            this.outputText("\n\n");

            this.outputText("At this angle, she easily slips her entire length and girth into you, letting her balls slap against your crotch with a smack. She smacks your backside over and over while she thrusts, and you find yourself laying back on your centaur body in a blissful trance.  ");

            if (this.pregnancy.event > 1) {
                this.outputText("Cotton leans her gravid bulge heavily onto your back, bending over as best she can to whisper into her ear.  \"<i>Mmm... how do you like this? Knowing you're being fucked like a woman by a woman?  A woman carrying your child, no less?  Because I like this a lot - this is so kinky, to me... oh, I'm gonna fuck the shit out of you, just like you fucked this baby into me.</i>\" She croons, even as she continues to thrust.  ");
            }
            this.outputText("Your body shivers and quakes as a miniature orgasm rockets through you, somehow making your whole body more sensitive. Your powerful partner grips you close, her jet black cock pistoning in and out of your hole. You gleefully tease and play with your nipples, eager for sweet release in some form or another.\n\n");

            this.outputText("Unable to take any more, Cotton gives one last thrust. As she pulls your body backwards onto her cock further, something of a cross between a whinny and a moan escapes her lips. A full orgasm rocks through your body, like lightning striking every nerve. Your back arches, your legs almost giving out on you, and even biting your lip doesn't stifle the long, deep moan from escaping your lips. Your equine lover's cock erupts in you, coating your insides with her hot, sticky seed, which even now begins to leak from your hole around the invading cock.\n\n");

            this.outputText("Exhausted, Cotton gets down from the bench and returns to the spray of water. Her cum leaks from your abused hole and your legs are quivering so much you nearly collapse. Your partner steadies you, however, and you regain your footing quickly. You return to the task of cleaning yourselves, sensually washing each other's most intimate areas, with Cotton giving your centaur body a proper cleaning. Yoga, sex and cleanup done, you get dressed and leave the gym, giving Cotton's hand a final squeeze before departing.");
        }
        // (Repeat get fucked for humanoids and nagas)
        else {
            this.outputText("You decide to take her up on her offer, and she pulls you towards the showers, quickly disrobing you forcibly and then herself. She turns only one shower-head on and pulls you into an embrace underneath the rapidly heating water. She kisses up your neck and playfully bites you with a grin.");
            // (If PC has a penis, no vagina)
            if (this.player.gender == 1) this.outputText("  Your " + this.player.cockDescript(0) + " tingles beneath you, but remains limp in the presence of Cotton's impressive member.");
            // (If PC has a penis and vagina)
            else if (this.player.gender == 3) this.outputText("  Your " + this.player.cockDescript(0) + " tingles beneath you, but remains limp in the presence of Cotton's impressive member while your " + this.player.vaginaDescript(0) + " moistens almost immediately from the steam and arousal.");
            // (If PC has a vagina and no penis)
            else if (this.player.gender == 2) this.outputText("  Your " + this.player.vaginaDescript(0) + " moistens almost immediately as you make out, both from the steam and your increasing arousal.");
            // (If PC is genderless)
            else this.outputText("  A deep aching burns within you, a need your body is ill-equipped to process, but still your nipples harden and you find your " + this.player.assholeDescript() + " puckering in anticipation.");
            this.outputText("\n\n");

            // (If PC has breasts)
            if (this.player.biggestTitSize() >= 2) {
                this.outputText("Cotton's kisses lead down to your " + this.player.biggestBreastSizeDescript() + ", where she takes one " + this.player.nippleDescript(0) + " into her mouth, sucking it greedily and teasing it masterfully.");
                // (and if PC is lactating)
                if (this.player.biggestLactation() >= 1) {
                    this.outputText("  Her efforts are soon rewarded as milk begins seeping from your " + this.player.nippleDescript(0) + ". Cotton's eyes turn up to your face in surprise, but she doesn't remove her mouth, instead taking the time to gulp down your tasty milk. It isn't long before she draws back, wipes her mouth and practically tackles your other breast, eager to drain it of its precious cargo. You can't help but moan as a draining sensation overwhelms you. After a moment, Cotton pulls away and smacks her lips. \"<i>That is some tasty, tasty milk, little pet.  I simply must have you for breakfast...</i>\"");
                    this.flags[kFLAGS.COTTON_BREAKFAST_CLUB] = 1;
                }
                // (else is PC is not lactating)
                else this.outputText("  Cotton soon switches to the other breast, teasing your " + this.player.nippleDescript(0) + " with her talented tongue.");
                this.outputText("\n\n");
            }

            this.outputText("She continues kissing a trail down your belly and to your crotch.");
            if (this.player.hasCock()) {
                // (If PC has a large penis, bigger than Cotton's capacity, add)
                if (this.player.biggestCockArea() > 70) this.outputText("  \"<i>Oh my, what's this?</i>\" She puts a hand under your enormous, yet embarrassingly limp cock and lifts it slightly. \"<i>My little pet has such a big dick... Just how I like it. Perhaps next time I'll get to try it out... but not today, hm? This is all about you right now.</i>\"");
                // (If PC has a penis under 4</i>\", add)
                if (this.player.longestCockLength() < 4) this.outputText("  \"<i>Awww, what's this?</i>\" She puts a hand under your embarrassingly small and limp cock and lifts it slightly. \"<i>It's so cute and tiny. And it certainly knows its place. Only room for one cock right now, not that this is much of a cock.</i>\" She giggles and plants a kiss on the tip, \"<i>It is cute though. I love it.</i>\"");
                // (If PC has a penis neither large or small, add)
                else this.outputText("  Cotton puts a hand under your embarrassingly limp cock and smiles, \"<i>You know how to show a girl you like her... There's only room for one cock right now.</i>\"");
            }
            // (If PC has a vagina)
            if (this.player.hasVagina()) this.outputText("  Spying your " + this.player.vaginaDescript(0) + ", Cotton smiles and flicks your " + this.player.clitDescript() + " teasingly before slipping two fingers inside your folds and bringing them to her mouth, licking them clean. \"<i>Mmm... I love the taste of your juices, pet...</i>\"");
            // (if PC is genderless)
            if (this.player.gender == 0) this.outputText("  She places a hand on your bare crotch and quirks an eyebrow. \"<i>Well this is new... Certainly not bad though.</i>\" She runs a hand along your bare mound, which somehow manages to send ripples of pleasure up your spine.");
            this.outputText("\n\n");

            // (If Naga body)
            if (this.player.isNaga()) {
                this.outputText("Cotton continues the kisses down to your " + this.player.legs() + ", and stands, grabbing you by the waist and lifting you up off the ground.  ");
                if (this.pregnancy.event > 1) this.outputText("Moving quickly, you wrap your arms around Cotton's neck and coil your body around her waist, just below her round, pregnant belly, and down one leg.  You can feel her swollen midriff rubbing against the scales on your serpentine half with each motion you make.");
                else this.outputText("Moving quickly, you wrap your arms around Cotton's neck and coil your body around her waist and down one leg.");
            }
            // (If Humanoid body)
            else {
                this.outputText("Cotton continues the kisses down to your " + this.player.legs() + " and stands, hooking an arm underneath each of your legs and lifting you up off the ground.  ");
                if (this.pregnancy.event > 1) this.outputText("Moving quickly, you wrap your arms and legs around Cotton so you don't fall over, carefully avoiding her pregnant belly, which is no mean feat. Her belly is pressed into yours, letting you feel the solid weight of it, gentle kicks from your unborn child within.");
                else this.outputText("Moving quickly, you wrap your arms and legs around Cotton so you don't fall over.");
            }
            this.outputText("  She gives you a quick kiss and moves her cock to your " + this.player.assholeOrPussy() + ", slipping it in gently, careful not to go too quick. You give her a submissive, but encouraging kiss, and whisper in her ear, urging her to continue.");
            // (Stretch and appropriate virginity check)
            if (this.player.hasVagina()) this.player.cuntChange(72, true, true, false);
            else this.player.buttChange(72, true, true, false);
            this.outputText("\n\n");

            this.outputText("She can't quite fit her entire girth into you at this angle, but that doesn't matter as it feels absolutely exquisite. You take turns kissing each other's necks and nibbling on each other's ears while she thrusts in and out.  ");
            if (this.pregnancy.event > 1) {
                this.outputText("Cotton leans her gravid bulge heavily into your belly, bending over as best she can to whisper into her ear.  \"<i>Mmm... how do you like this? Knowing you're being fucked like a woman by a woman?  A woman carrying your child, no less?  Because I like this a lot - this is so kinky, to me... oh, I'm gonna fuck the shit out of you, just like you fucked this baby into me.</i>\" She croons, even as she continues to thrust.  ");
            }
            this.outputText("Your body shivers and quakes as a miniature orgasm rockets through you, somehow making your whole body more sensitive.  ");
            this.outputText("Your powerful partner holds you close, her jet black cock pistoning in and out of your hole. You feel safe in her arms, secure in a way you rarely feel elsewhere. You wrap your arms more tightly around her, hugging Cotton close and biting your lip, stifling your moans and groans of passion.\n\n");

            this.outputText("Unable to take any more, Cotton gives one last thrust, pulling your body down onto her cock and giving a whinny of a moan. A full orgasm rocks through your body, like lightning striking every nerve. Your back arches, pressing your chest into Cotton's prodigious bosom and even biting your lip doesn't stifle the long, deep moan from escaping your lips. Your equine lover's cock erupts in you, coating your insides with her hot, sticky seed, which even now begins to leak from your hole around the invading cock.\n\n");

            this.outputText("Exhausted, Cotton sets you down on the shower floor under the spray of water, though cum leaks from your abused hole and your " + this.player.legs() + " quivering so much you nearly collapse. Your partner steadies you, however, and you regain your footing quickly. You return to the task of cleaning yourselves, sensually washing each other's most intimate areas. Yoga, sex and cleanup done, you get dressed and leave the gym, giving Cotton's hand a final squeeze before departing.");
        }
        if (this.player.hasVagina()) this.cottonPregPCChance();
        this.player.orgasm('Generic');
        this.dynStats("sen", -1);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // (Tantric Sex)
    public cottonTantricSex(): void {
        this.spriteSelect(SpriteDb.s_cotton);
        this.clearOutput();
        this.outputText(this.images.showImage("cotton-tantric-sex"));
        this.player.slimeFeed();
        this.flags[kFLAGS.COTTON_MET_FUCKED] = 2;
        // OLD TANTRIC SMEX
        /*outputText("You decide to ask instead about using yoga to blow off some steam. She grins, \"<i>I know just what you need. It's called tantric sex, and I think you're just limber and quick enough to try it.</i>\"\n\n");

        outputText("She leads you to a private room in the gym and sets up a larger mat. She disrobes and you do the same. She sits on the mat and you sit opposite her. You spend a couple minutes just breathing, exploring your partner's body with your eyes only. Then Cotton slips her legs outwards, and leans backwards, letting her enormous member to waggle freely in the air. She curls a finger at you, and gives you your instructions.\n\n");

        outputText("You stand and straddle her hips, facing her, carefully lowering yourself down onto her length. You take your time, matching your breathing with hers, until you're completely impaled. Then you stretch your legs out behind your partner and also lean back. You both gyrate your hips as your bodies glisten with a light sheen of sweat.");
        player.buttChange(72,true,true,false);
        outputText("\n\n");

        outputText("After several minutes of this you switch positions, with Cotton leaning forward and grabbing you under the waist while you curl your legs under you. Then Cotton pulls herself up into a kneeling position while still inside you, pushing your head and shoulders down onto the mat and your legs up into the ceiling. Several more positions later, your breathing is a little ragged but still in sync, and it's clear neither of you can take much more of this.\n\n");

        outputText("With one last pose, you both stand, Cotton grabs your hips and you lean down to grab your ankles. Your whole body shivers with sexual energy, feeling like it's on fire with orgasmic light as your equine lover gives one final thrust into you and explodes, her own body shivering and shuddering. Unable to remain standing any longer, you flop down onto the mat, letting Cotton's seed slowly leak out of you, while Cotton lays down next to you, equally exhausted.\n\n");

        outputText("\"<i>I must say, my little pet, you are the best yoga partner I've had in a long time.</i>\" You share a kiss and take a moment to rest before heading to the showers and then heading home.");*/
        // NU HOTNESSSSS
        // (Tantric Sex ONLY available for humanoids and naga, still requires 50+ Speed)
        this.outputText("Knowing full well what she plans for the showers, you instead ask about more \"<i>advanced</i>\" forms of yoga. With a certain coy emphasis on advanced. She grins, \"<i>I know just what you mean. It's called tantric sex, and I think you're just limber and quick enough to try it.</i>\"\n\n");

        this.outputText("She leads you to a private area in the gym, a large room where one side of the wall is covered in mirrors with a long bar across it. You'd guess this room is used for dance lessons, or other activities that require large amounts of space. She sets up a large mat on the floor, big enough for the both of you to sit on and then some, and proceeds to strip. \"<i>It's best to do this naked... we don't want our clothing to block our spiritual energies. Or, y'know, other things,</i>\" she says with a light laugh. You nod and strip down as well.\n\n");

        this.outputText("Cotton sits on one end of the mat, crossing her hooved feet under her in the traditional meditative position. You sit on the other side and do the same. \"<i>Now we match our breathing, little pet. In, and out. Each breath brings our spirits closer to each other.</i>\" You inhale deeply, and she does the same. Then out. This continues for minutes, just breathing, until in one exhalation you feel a shiver run down your spine.\n\n");

        this.outputText("\"<i>And our spirits are joined... for now,</i>\" she laughs and runs her hands along her upper torso, and in a weird, sort of detached way, you feel it. You touch your chest, rubbing a " + this.player.nippleDescript(0) + " experimentally, and you see Cotton visibly shiver and give you an approving nod. Whatever she did... you can feel what she feels, however faintly, and vice-versa!\n\n");

        this.outputText("\"<i>Now comes the yoga portion of this little workout,</i>\" she says as she uncurls her legs, spreading them wide and long on the mat. She bends her knees and leans back, propping herself up on her arms. Her jet-black equine cock stands at full attention, pulsing steadily. \"<i>Come sit down on my cock, pet, and we'll get this party started right.</i>\"\n\n");

        this.outputText("Gulping slightly, you stand and approach her. Cotton runs a hand along her member, causing you to shiver with the");
        if (this.player.hasCock()) this.outputText(" familiar");
        else this.outputText(" alien");
        this.outputText(" sensations on an unfamiliar part of your body... well, her body. You stand over her hips and slowly lower yourself down, impaling your " + this.player.assholeOrPussy() + " on her meaty tool. In addition to the beautiful sensation of being filled, you also get the sensation of warm, tight constriction on your phantom cock.");
        // (for Naga Body, add)
        if (this.player.isNaga()) this.outputText("  You impale yourself fully, settling down and sitting on her lap, stretching your snake-like body out behind and to one side of her, with your arms propping you up as you lean back.");
        // (for Humanoid Body, add)
        else this.outputText("  You impale yourself fully, settling down and sitting on her lap, mimicking her pose with your legs stretched out behind her and your arms propping you up as you lean back.");
        this.outputText("\n\n");

        this.outputText("Though there's no real thrusting or vulgar movements of any kind, the feelings are intense, likely heightened by your tantric link. You can simultaneously feel Cotton's long equine cock pulse within you, as well as feel your own " + this.player.assholeOrPussy() + " clamping down on a cock that is not your own.");
        if (this.player.hasVagina()) this.player.cuntChange(72, true, true, false);
        else this.player.buttChange(72, true, true, false);
        // (If PC has a penis, add)
        if (this.player.hasCock()) this.outputText("  Meanwhile, your own " + this.player.cockDescript(0) + " hangs limply in front of you, tingling with arousal, but unable to harden. Cotton gives it a pat and says, \"<i>Worry not, pet, there's only room for one cock right now, but I'll want it some other time.</i>\"");
        this.outputText("\n\n");

        this.outputText("\"<i>Now let's move on to the Lotus,</i>\" Cotton says, and sits up.");
        // (Naga body, add)
        if (this.player.isNaga()) this.outputText("  You do the same, curling your arms around your partner while your lower body coils around her midsection. Cotton pulls her legs in as well, and it almost looks like you're both sitting normally, if it weren't for you being on her lap with her dick up inside you.");
        // (Humanoid body, add)
        else this.outputText("  You do the same and curl your arms and legs around your partner. Cotton pulls her legs in as well, and it almost looks like you're both sitting cross legged if it weren't for you being on her lap with her dick up inside you.");
        this.outputText("  You take this opportunity to bury your face in Cotton's prodigious bosom, taking one black, perky nipple into your mouth, then the other. You can actually feel your own tongue on phantom nipples, flicking and teasing you mercilessly. You relinquish your hold on the nipples and pull back slightly, your saliva forming a slight bridge from nipple to lip.\n\n");

        // (If PC has breasts)
        if (this.player.biggestTitSize() >= 2) {
            this.outputText("Cotton returns the favor, her short-snouted mouth latching on to one " + this.player.nippleDescript(0) + " and sucking it relentlessly. The sensations you get from this are, if anything, greater than normal. Your nipples feel like they're on fire, with every molecule aching to be touched, licked, sucked and teased.");
            // (If PC is lactating, add)
            if (this.player.biggestLactation() >= 1) {
                this.outputText("  You feel a familiar sensation welling up in your breasts as milk begins pouring into Cotton's mouth. She grins as best she can without letting go of your tit, eagerly drinking down your milk. In yet another moment of trepidation, you realize you can taste your own milk slipping over Cotton's tongue. You smack your lips. It tastes sweet and creamy, and oh-so warm. Cotton moves to your next nipple, letting the first dribble milk onto the both of you. Again Cotton sucks on your " + this.player.nippleDescript(0) + " for a moment before it begins dispensing its precious cargo into her mouth. You taste every gulp, each one sweeter than the next, before Cotton pulls back and smacks her lips together. \"<i>You taste so sweet, pet. I simply must have you around for breakfast...</i>\"");
                this.flags[kFLAGS.COTTON_BREAKFAST_CLUB] = 1;
            }
            // (else if PC is not lactating)
            else this.outputText("  She quickly switches to the other nipple, her tongue expertly teasing and tantalizing it before pulling away once more.");
            this.outputText("\n\n");
        }

        this.outputText("\"<i>One last pose, pet, the head game.</i>\"  She grips your " + this.player.hipDescript() + " and stands up in one fluid motion. You quickly latch on to her, making sure you don't fall. Cotton's cock shifts with the motion, going slightly deeper and you reflexively clench, which you feel on your phantom cock. \"<i>Now we just lay you down...</i>\" You gulp and release your hold on Cotton's neck, slowly letting yourself lean backwards. The cock shifts within you, feeling so strange and alien as you move down. Finally your head hits the floor, so you curve your neck slightly, letting your shoulders and head rest on the mat.\n\n");

        // (for Naga bodies)
        if (this.player.isNaga()) this.outputText("Cotton takes a firm grip on your hips and ass, making sure you don't slip, so you carefully uncoil your body and slip it between Cotton's legs, then coiling it around her waist, chest, and between her breasts. The feeling is quite intense, though at this angle Cotton's cock doesn't fit completely inside you.");
        // (for Humanoid bodies)
        else this.outputText("Cotton takes a firm grip on your hips and ass, making sure you don't slip, so you carefully extend your " + this.player.legs() + " out, then over and around Cotton's arms, only pausing to make sure she has a decent grip on your new position, and rest both of your feet on your equine lover's shoulders. The feeling is quite intense and unique, though at this angle Cotton's cock doesn't fit completely inside you.");
        this.outputText("\n\n");

        this.outputText("Now comes the thrusting. Or rather, gyrating. Cotton begins making small circular motions with her hips, letting her cock thrust ever-so-slightly in and out of you. Despite the subtle motions, combined with the tantric link you're in complete and utter bliss. Soon, you too are gyrating your hips the best you can.\n\n");

        this.outputText("It doesn't take much longer for the sensations to consume you, feeling yourself both getting fucked and fucking at the same time. Lightning fires through every nerve in your body as an orgasm begins to overtake you. Cotton doesn't look far behind. As your body begins to tremble and arch, so too does hers.");
        // (If PC has a penis)
        if (this.player.hasCock()) this.outputText("  Your " + this.player.cockDescript(0) + " twitches and tingles, releasing its pent up seed in a dribbling torrent down your belly and chest, right into your face and pooling around your head.");
        // (If PC has a vagina)
        if (this.player.hasVagina()) this.outputText("  Your " + this.player.vaginaDescript(0) + " shivers and clamps down hard on the invading cock, pulsing and milking it as it unloads directly into your womb.");
        // (If PC doesn't have a vagina)
        else this.outputText("  Your " + this.player.assholeDescript() + " shivers and clamps down hard on the invading cock, pulsing and milking it as it unloads directly into your intestines.");
        // (regardless of above, add)
        this.outputText("  Lightning arcs from nerve to nerve, in both of your bodies. You can feel every sensation Cotton feels. In that moment, you feel perfectly as one. You aren't simply getting fucked by Cotton. You are simultaneously Cotton fucking yourself, as is she.");
        this.outputText("\n\n");

        this.outputText("Then in a flash, it's gone. The lightning subsided, you both collapse sideways onto the floor, panting. The tantric link is apparently gone, and you suddenly feel very alone. Cotton, seemingly sensing this, pulls out and curls up next to you, cuddling you until the sudden feeling of loss dissipates.\n\n");

        this.outputText("After a few minutes, you feel your strength ebbing back into you and you get up. Cotton does the same, and you both spend the time to clean the mat of the results of your escapades, before retreating to the showers to clean each other up. Once that's over, you both leave the gym hand-in-hand, with Cotton giving your hand a final squeeze before you depart to your camp.");
        this.player.orgasm('Generic');
        this.dynStats("tou", .25, "spe", .25, "lib", -.25, "sen", -.25);
        if (this.player.hasVagina()) this.cottonPregPCChance();
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // (Leave)
    private leaveCotton(): void {
        this.spriteSelect(SpriteDb.s_cotton);
        this.clearOutput();
        this.outputText("You thank Cotton for her time, shower and head back to camp.");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // New repeating scene where Cotton visit's the PC at camp
    // (Cotton appears in camp event, triggered by having Cotton
    // drink from a lactating character. Character must still be
    // lactating.)
    public nomSomeTitMilkCereal(): void {
        this.spriteSelect(SpriteDb.s_cotton);
        this.outputText(this.images.showImage("cotton-visits-you-at-camp-drinks-all-your-milk-the-asshole"));
        // (Add to Sleep screen under the sunrise line.)
        this.outputText("\nAs you awaken you hear a rustling from the bushes around your camp.\n\n");

        // (Event proper)
        this.outputText("You quickly arise and ready your weapon, prepared for anything to come through the brush. After a moment, a large dark shape bursts through the bushes. You're about to strike when you recognize the figure! It's Cotton from the gym in Tel'Adre! Rather than her normal yoga outfit, she's wearing a tight brown shirt and loose brown pants, along with a backpack slung across one shoulder.\n\n");

        this.outputText("The horse girl holds up her hands in a nonthreatening manner. \"<i>Whoa there, pet. I just came by to join you for breakfast.</i>\" You sigh and put your weapon away. \"<i>Jumpy huh?</i>\" she says, looking around your camp. \"<i>You've got a pretty good setup here. I don't know why you don't just move into Tel'Adre. I've got a nice little place we could share... But no matter.</i>\"\n\n");

        this.outputText("You invite her over to your bedroll and sit down. She follows suit and removes her backpack, digging through it for a minute, retrieving a clay bowl and a large brown bag. She opens the bag and pours out a bowlful of grains and oats. \"<i>Normally I just eat my breakfast raw... but today I want to try something a little different.</i>\"");

        this.outputText("Cotton sets the bowl down in your lap and pulls down the front of your " + this.player.armorName + ", exposing your " + this.player.chestDesc() + " to the cool morning breeze. A shiver runs down your spine and your nipples immediately begin to harden, as if knowing what this equine girl has in mind. Cotton leans down and wraps her lips around one " + this.player.nippleDescript(0) + ", sucking sensually and flicking the tip with her tongue.\n\n");

        this.outputText("You feel the familiar sensation of fluids being drawn from you, and soon Cotton is suckling from your milky tit. She relinquishes her hold on the teat, smacks her lips, and brings the bowl up to your breast. With the other hand, she grabs your " + this.player.nippleDescript(0) + " and breast firmly, pulling and squeezing it. Delicious white milk begins squirting from the ducts of your breast, dribbling and spraying into the bowl of grains. You can't help but moan, squirming in your seat as your tit is ruthlessly milked.\n\n");

        this.outputText("Cotton gives the breast one last lick and moves on to the next. In no time, that one too is spraying a copious amount of milk into the bowl. The sensation is amazing, being milked by hand. So intimate and personal. Your body quakes and trembles as little earthquakes shake across your breasts and down your body. Your mouth forms an O and you let out little moans of pleasure as the boobgasm rolls throughout your body.\n\n");

        this.outputText("Just like that, Cotton's hand leaves your breast, though the hot and aroused feeling doesn't leave. You open your eyes and look at her. She gives you a smile and takes a bite of grains.\n\n");

        this.outputText("\"<i>Mmm, you are so tasty, pet,</i>\" she trills, \"<i>Here, try a bite.</i>\" She lifts a spoon full of grain, oats and milk to your mouth. You hesitantly take a bite and can't help but smile. The sweet, smooth taste of your milk perfectly complements the grains. You munch on it and swallow, and have another bite.\n\n");

        this.outputText("You chat about inconsequential things, mostly the Tel'Adre rumor mill, while you both eat from the bowl. When it's completely gone, Cotton licks out the bowl and packs everything up.\n\n");

        this.outputText("\"<i>Thanks, pet, that was delicious. I'll be sure to stop by another time so we can share a meal. Feel free to come by the gym too. We can get a little more... personal.</i>\" She kisses you on the cheek, and then departs back towards Tel'Adre.");

        // (Event should increase lust (by 10?), or maybe reduce it if the player has the Feeder perk. Should also increase the character's lactation rating, or at least prevent it from decaying.)
        this.dynStats("lib", -0.5, "sen", -.5, "lus", -5);
        this.player.boostLactation(0.05);
        // You've now been milked, reset the timer for that
        if (this.player.hasStatusEffect(StatusEffects.Feeder)) {
            this.player.addStatusValue(StatusEffects.Feeder, 1, 1);
            this.player.changeStatusValue(StatusEffects.Feeder, 2, 0);
        }
        this.doNext(this.playerMenu);
    }

    // COTTON PREGNANCY
    /*2. Preggo my Eggo!
    PC Pregnancy: Should be about as long as Centaur pregnancy?
    Cotton Pregnancy: Should be about as long as Edryn pregnancy? Cotton should be about as fertile as (maybe less fertile than) Edryn.
    Has Had Child with Cotton: Birth text changes depending on if you've given birth to one of Cotton's kids before. This covers only children birthed by the PC.
    Total Children with Cotton: Covers both kids birthed by Cotton and the PC.
    Eldest Child Age: Interactions with your children depend on the age of your eldest kid.*/

    // Champion, I'm PREGGERS!
    // Like the Edryn scene, when you enter the Gym after knocking Cotton up, she will immediately approach you about it.
    public cottonPregnantAlert(): void {
        this.clearOutput();
        this.outputText("As you enter the gym, keen to work out (in one way or another), you spot Cotton in her usual area.  She's pacing around, and a worried look is plastered across her face. When she sees you, she smiles a little and approaches you. Whatever it is, it clearly can't wait.");
        // -Next-
        this.menu();
        this.addButton(0, "Next", this.cottonPregnantAlertII);
    }

    private cottonPregnantAlertII(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("cotton-you-got-her-preggo"));
        this.outputText("\"<i>Hello, pet,</i>\" she says, and you notice worry in her voice.  There are slight bags under her eyes, and her crimson ponytail is a little unkempt, with hair jutting out at odd angles.  Something clearly has her frazzled.");
        this.outputText("\n\n\"<i>I'll just come right out with it. I went to the Covenant today...  I'm pregnant,</i>\" she says, matter-of-factly, \"<i>and it's yours.</i>\"");
        this.outputText("\n\n\"<i>I'd been taking some herbs to counteract pregnancy, but I guess it was just no match for you.");
        if (this.flags[kFLAGS.EDRYN_NUMBER_OF_KIDS] > 0 || (this.telAdre.edryn.pregnancy.isPregnant && this.flags[kFLAGS.EDRYN_PREGNANT_AND_NOT_TOLD_PC_YET] != 0)) this.outputText("  Should have figured as much after you got Edryn pregnant.");
        this.outputText("</i>\"  She wrenches her hands nervously and looks you in the eye. The cool, confident yoga instructor has clearly melted away, revealing the real her.  \"<i>I know we're not serious, but ");
        if (this.flags[kFLAGS.EDRYN_NEVER_SEE_AGAIN] == 0) this.outputText("you'll stick with me through this, right?");
        else this.outputText("you won't abandon me like you did Edryn, will you?");
        this.outputText("</i>\"");
        // [Leave Her] [Stay]
        this.menu();
        this.addButton(0, "Stay", this.beAGoodCottonDad);
        this.addButton(1, "Leave Her", this.beABadCottonDad);
    }
    // (Leave Her)*
    private beABadCottonDad(): void {
        this.clearOutput();
        this.outputText("You shake your head.  You certainly can't deal with a kid.  You tell her point blank that you want nothing to do with the child.  Tears well up in her eyes, and her mouth opens and closes several times, without a single sound coming out.");
        this.outputText("\n\nAfter a moment, she squares her jaw, and a determined look comes over her face.  The confident woman you first met seems to reappear.  She wipes the tears from each eye, and states, \"<i>Fine then.  I can do this on my own.</i>\"");
        this.outputText("\n\nShe turns to walk away, then stops, swivels back towards you ");
        if (this.flags[kFLAGS.EDRYN_NEVER_SEE_AGAIN] == 0) this.outputText("and slaps you as hard as she can");
        else this.outputText("and punches you as hard as she can");
        this.outputText(". \"<i>Fuck you 'pet'.");
        if (this.flags[kFLAGS.EDRYN_NEVER_SEE_AGAIN] > 0) this.outputText("  That was for Edryn too.");
        this.outputText("</i>\"  With that, she turns on her hoof and leaves.");
        // bold
        this.outputText("<b>(Cotton will no longer speak with you.)</b>");
        this.flags[kFLAGS.PC_IS_A_DEADBEAT_COTTON_DAD] = 1;
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    // (Stay)*
    private beAGoodCottonDad(): void {
        this.clearOutput();
        this.outputText("You take her by the shoulders and nod.  You confirm that of course you'll be there for her, whatever she needs.");
        this.outputText("\n\nA smile spreads across her face and she hugs you, squeezing tightly, \"<i>Oh thank Marae.  I don't expect you to just pack up and move in, I'm totally fine with our current arrangement, but just having you around for emotional support would be wonderful.</i>\"");
        this.outputText("\n\nShe plants a kiss on your lips, and returns to the yoga section of the gym.");
        this.flags[kFLAGS.PC_IS_A_GOOD_COTTON_DAD] = 1;
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    // Alternate Approach Cotton Scenes*
    // (New scenes to show off Cotton's pregnancy)
    // ORIGINAL:
    // Cotton First-Time Birth*
    private cottonPopsOutAKid(): void {
        let kid: number = 0;
        // (Replaces Yoga session)
        this.clearOutput();
        this.outputText(this.images.showImage("cotton-giving-birth"));
        if (this.flags[kFLAGS.COTTON_KID_COUNT] == 0) {
            this.outputText("Cotton is waiting at her usual spot, sipping casually from a bottle of water, her hugely rounded, brown-skinned orb of a belly exposed as it has been since she outgrew her maternity shirt.  She winces and rubs her belly with a grimace as you approach, which prompts you to ask if she's been feeling all right.");
            this.outputText("\n\n\"<i>Just a little stomach pain,</i>\" she says casually, \"<i>I probably pulled something again.  This little foal has been murder on my muscles.  I'll be fine, lets start on your warm up stretches, shall we?</i>\"  You nod, not entirely convinced, but you get down on the mat and begin stretching.");
            this.outputText("\n\nYou're only minutes into your stretches when, with a sudden cry of pain from the equine herm, a gush of water spills forth from between Cotton's legs.  She looks down in a panic, nearly doubling over with her arms wrapped around her belly.  \"<i>Oh my god, the baby's coming!</i>\" she cries out, panic tinging her voice.");
            this.outputText("\n\nYou quickly move to support her, asking what you can do to help.");
            this.outputText("\n\n\"<i>Well I wanted to do a home birth,</i>\" her voice strains for a moment, \"<i>But that's out of the window now.  We need someplace quiet and private.  There's no time to go to the doctor's...</i>\"  Her breath is heavy now, but with measured gasps.");
            this.outputText("\n\nMind racing, you ask if she can make it to the pool.  You think you remember hearing something about it being easier to give birth in water or something.");
            this.outputText("\n\n\"<i>That's fine,</i>\" she responds quickly.  \"<i>");
            // {Silly Mode:}
            if (this.silly()) this.outputText("As long as the cube shark isn't there.  ");
            this.outputText("Let's go.</i>\"");
            // (Depending on PC height:
            if (this.player.tallness < 60) this.outputText("She wraps an arm around your neck");
            else if (this.player.tallness < 70) this.outputText("She places a hand on your shoulder");
            else if (this.player.tallness < 86) this.outputText("She wraps an arm around your midsection");
            else this.outputText("She wraps an arm around your waist");
            this.outputText(" for stability as she waddles off in the direction of the pool entrance.  You hasten along as quickly as you dare, doing your best to support your laboring lover.  The pool comes into sight with welcome quickness, and you gently help her into the water before pulling off her pants and tossing them onto the stone floor with a wet <i>shlop</i>.  Positioning yourself behind her, where her huge masculine endowments won't obstruct you, you tell Cotton to get ready to push...");
            this.outputText("\n\nLong minutes pass; though Cotton is clearly in pain, you can't help but note that this birth is honestly progressing much faster and smoother than it would for a human, and try to bolster Cotton's spirits by telling her this.");
            this.outputText("\n\n\"<i>Hah, my people are tough.  This is,</i>\" she strains for a moment, \"<i>nothing.</i>\"");
            this.outputText("\n\nAssuring her that she's doing fine, you take a breath and duck back down under the water to closely examine her.  Your eyes and fingers quickly confirm the speed of her progress, and you excitedly surface to tell her that you can see the head; one or two more good pushes, and the baby will be out.  Seemingly strengthened by this, she nods, takes a few quick breaths and pushes as hard as she can.  The strain shows on her face, with her normal brown skin darkening to a purple momentarily.");
            this.outputText("\n\nYou plunge your hands into the water as Cotton lets out a strangled scream, muscles unclenching in the wake of her final push.  As you do so, you find Cotton's baby thrust fully from its former home in the herm's belly into your hands, and you hasten to pull it to the surface.  With a great splash, you bring the baby out of the water, which causes it to suck in its first breath and make its first cry.  You just stand there in the water, smiling stupidly at your newborn foal, holding it close to you.");
            this.outputText("\n\nCotton tries to peer backwards.  \"<i>Is everything all right? Is it OK?</i>\" she asks, concern in her voice.");
            this.outputText("\n\nEverything is just fine, you tell her, unable to look up.  The two of you are the parents of a new, healthy ");

            if (rand(3) == 0) kid = 1;
            else if (rand(2) == 0) kid = 2;
            else kid = 3;
            this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] = kid;
            if (kid == 1) this.outputText("male");
            else if (kid == 2) this.outputText("female");
            else this.outputText("herm");
            this.outputText(" foal.");

            this.outputText("\n\nCotton turns and <i>awww's</i> as she catches sight of her ");
            if (kid == 1) this.outputText("son");
            else this.outputText("daughter");
            this.outputText(" for the first time.  Though you don't want to let ");
            if (kid != 1) this.outputText("her");
            else this.outputText("him");
            this.outputText(" go, you relinquish your grasp as Cotton's arms sweep ");
            if (kid != 1) this.outputText("her");
            else this.outputText("him");
            this.outputText(" up.  With one hand she lifts up her top, exposing her large brown nipples, and pulls the child to one, where it latches on and suckles like a pro.  You just watch, ready to look away if Cotton asks, but she seems too preoccupied with nursing her new baby to pay much attention to you.");
            this.outputText("\n\nYou climb out of the pool and help the mother of your child do the same.  Cotton heads into the locker room, quickly finding her locker and retrieving a fresh set of clothes while you fetch a towel and help dry her off - a trickier prospect than you'd think, given you have to take turns juggling the baby to do so.  Once the hungry child has had its fill and dozes off into a milk-induced coma, she re-dresses and says, \"<i>Let's go get this guy tucked in proper.</i>\"");
            this.outputText("\n\nYou nod your head in agreement, curious to see what kind of place Cotton lives in, and indicate she should lead the way there.  She does so, taking you to a modest apartment sandwiched in between a tailor's shop and the local deli.  Once inside, she leads you into what can only be the nursery, a colorful, dazzling room decorated in pastel pinks, blues and purples.");
            this.outputText("\n\nYou smile at the decor and tell Cotton that she's been busy; still, it looks lovely.");
            this.outputText("\n\n\"<i>Oh thanks pet,</i>\" she says with a smile.  \"<i>I don't know if I've ever told you, but I had a couple of kids a few years back.  Twins.  Boy they were rambunctious little devils.  Couldn't sit still,</i>\" she smiles wistfully.  \"<i>This was actually their room, once upon a time.  I touched it up of course.</i>\"");
            this.outputText("\n\nSo, Cotton's been a parent before? You ask if she was the mother or the father.");
            this.outputText("\n\n\"<i>Oh, I was the 'daddy', I guess,</i>\" she laughs a little at the word.  \"<i>Their mother was from my home village.  We moved into Tel'Adre together after the demons came.  One thing led to another, and we had two bundles of joy not long after.</i>\"");
            this.outputText("\n\nYou ask what the mother was; another horse-morph like Cotton herself?  Maybe a centaur?  And woman, or herm?");
            this.outputText("\n\n\"<i>Oh, she was a morph like me, most of my village was.  Female, of course.  Hermaphrodites like me weren't especially common back then, though I'm proud to say I'm all natural!");
            if (kid == 3) this.outputText("  I guess it runs in the family.");
            this.outputText("</i>\"");

            this.outputText("\n\nYou nod your head in understanding.  Then, delicately, you comment that Cotton doesn't seem to be in a relationship with her old sweetheart anymore.  Did the relationship simply not work out, or...?");

            this.outputText("\n\nCotton thinks about this for a moment, then replies with, \"<i>Let's just say we found ourselves pulling apart, and she moved on to greener pastures.  Left me with the kids, though I wouldn't have had it any other way.  I still see her sometimes around Tel'Adre.  There's no real bad blood there, but we won't be getting together for tea any time soon.</i>\"");
            this.outputText("\n\nYou thank Cotton for being willing to tell you about things like this.  Then, to change the subject, you ask what happened to her twins - also, what were they, in terms of gender?");
            this.outputText("\n\nCotton replies, \"<i>Oh, a boy and a girl.  Fraternal twins.  They're out there somewhere.  Left Tel'Adre last year to search for other settlements and try and fight the demons.  I get a letter every now and then, coming in from the odd trader, but I haven't seen them in so long.</i>\"  You see tears forming in her eyes.  She obviously worries about them.");
            this.outputText("\n\nShe wipes the tears away and waves a hand, \"<i>But anyway, let's get this little ");
            if (kid < 2) this.outputText("guy");
            else this.outputText("girl");
            this.outputText(" situated.</i>\"  She takes the bundle from you, retrieves a fresh clean blanket, and within seconds has ");
            if (kid != 1) this.outputText("her");
            else this.outputText("him");
            this.outputText(" expertly swaddled.  Cotton sets the child in the crib and stands back to admire her handiwork. You step up beside her and wrap an appreciative arm around her waist, telling her that she's done a wonderful job.");
            this.outputText("\n\n\"<i>Oh no, pet,</i>\" she whispers back, \"<i>This baby was all you.</i>\"  You smile at her, call her a flatterer, and then kiss her.  You ask if she needs any more help setting things up.  \"<i>No, don't worry about a thing, everything's been taken care of.  But we can sit here a little longer if you want.</i>\"");
            this.outputText("\n\nYou tell her you'd like that, taking a seat nearby with the 'mother' of your child and watching as your baby foal sleeps soundly.  Eventually, though, you have to leave, and politely excuse yourself to head back to camp.");
            this.pregnancy.knockUpForce(); // Clear Pregnancy
            this.flags[kFLAGS.COTTON_KID_COUNT]++;
            if (this.flags[kFLAGS.COTTON_KID_COUNT] == 1) this.flags[kFLAGS.COTTON_OLDEST_KID_AGE] = 1;
            this.doNext(this.camp.returnToCampUseOneHour);
        }
        // Cotton Repeat Births*
        // (Replaces the Approach scenes)
        else {
            this.outputText("As you head towards Cotton, you realize something about her is different; the swollen bulge of her late pregnancy is gone!  You ask her if everything is all right.");
            this.outputText("\n\n\"<i>Oh, everything is wonderful, little pet.  You actually just missed it, I felt some familiar sensations, so I went home.  My water broke just as I was opening the door.  I had it right there in the nursery.  You're the proud new daddy of a baby ");
            if (rand(3) == 0) kid = 1;
            else if (rand(2) == 0) kid = 2;
            else kid = 3;
            if (kid == 1) this.outputText("boy");
            else if (kid == 2) this.outputText("girl");
            else this.outputText("herm");
            this.outputText("!</i>\" she says happily, pulling you into a hug.  \"<i>We could go see ");
            if (kid != 1) this.outputText("her");
            else this.outputText("him");
            this.outputText(" if you like, ");
            if (kid != 1) this.outputText("she");
            else this.outputText("he");
            this.outputText("'s at the daycare here, I wanted to keep a close eye on ");
            if (kid != 1) this.outputText("her");
            else this.outputText("him");
            this.outputText(" today.</i>\"");

            this.outputText("\n\nYou tell her that you would like to see ");
            if (kid != 1) this.outputText("her");
            else this.outputText("him");
            this.outputText(", if Cotton thinks that won't upset ");
            if (kid != 1) this.outputText("her");
            else this.outputText("him");
            this.outputText(".");

            this.outputText("\n\n\"<i>Oh of course not. It'll do ");
            if (kid != 1) this.outputText("her");
            else this.outputText("him");
            this.outputText(" good to see ");
            if (kid != 1) this.outputText("her");
            else this.outputText("him");
            this.outputText(" daddy,</i>\" she says, and leads you down a corridor and into a room marked \"<i>DAYCARE</i>\".  As soon as the door opens, you're assaulted by the laughs and giggles of kids playing.");

            this.outputText("\n\nA young bunny-girl sees Cotton and says, \"<i>Oh!  I wasn't expecting you back so soon.  ");
            if (kid != 1) this.outputText("She");
            else this.outputText("He");
            this.outputText("'s just down for a nap right now.  Would you like to see ");
            if (kid != 1) this.outputText("her");
            else this.outputText("him");
            this.outputText("?</i>\"  You both nod your heads in the affirmative, and are taken to an off-room.  It's dark, but there's a crib just by the door, and you can make out a slumbering baby with its mother's horse ears twitching as it dreams whatever babies dream.");

            this.outputText("\n\nNot wanting to wake ");
            if (kid != 1) this.outputText("her");
            else this.outputText("him");
            this.outputText(", you look ");
            if (kid != 1) this.outputText("her");
            else this.outputText("him");
            this.outputText(" over and then back out of the room, content with the knowledge that you'll get to spend more time with ");
            if (kid != 1) this.outputText("her");
            else this.outputText("him");
            this.outputText(" later.  The two of you head back out to the main section of the gym, while Cotton slaps you on the back, \"<i>We sure do make 'em good, don't we?  Anyway, if you want to work out, just get changed and come on back.</i>\"");
            this.pregnancy.knockUpForce(); // Clear Pregnancy
            this.flags[kFLAGS.COTTON_KID_COUNT]++;
            if (this.flags[kFLAGS.COTTON_KID_COUNT] == 1) this.flags[kFLAGS.COTTON_OLDEST_KID_AGE] = 1;

            // Cotton menu here
            this.cottonMenu();
        }
    }

    // Contraception Toggle
    // First Time
    // Play this scene the first time Contraception is toggled
    // Cotton must be pregnant or have CottonKids =>1 to activate this option
    private cottonContraceptionToggle(): void {
        this.clearOutput();
        // REPEATS
        if (this.flags[kFLAGS.COTTON_CONTRACEPTION_TALK] > 0) {
            this.repeatContraceptionToggleCotton();
            return;
        }
        this.outputText("You ask the ");
        if (this.pregnancy.isPregnant) this.outputText("pregnant ");
        this.outputText("she-stallion if she's still taking her contraceptive herbs.");

        this.outputText("\n\nCotton nods, but then visibly thinks about it for a moment.  \"<i>I am, though I guess it hasn't been any match for you, hm?  You're too ");
        // (Cottonpreg:
        if (this.player.gender != 3 || this.pregnancy.isPregnant) this.outputText("virile");
        else this.outputText("fertile");
        this.outputText("; you actually broke right through the protection they were supposed to give me from ending up a mommy or a daddy.  I may as well not be taking them at all when I'm with you, don't you think?</i>\" she concludes.");

        this.outputText("\n\nYou admit that kind of makes sense to you, but it's not as if you're guaranteed to get through their protection, right?\n\n\"<i>");
        if (this.flags[kFLAGS.COTTON_KID_COUNT] < 3) this.outputText("Well that's true,</i>\" she admits.  \"<i>But I leave it up to you, pet.");
        else this.outputText("Well, considering the brood we have, they've already proven pretty useless, haven't they?   So, while I'll keep taking them if you want me to, I don't see much point in it.");
        this.outputText("</i>\"");

        this.flags[kFLAGS.COTTON_CONTRACEPTION_TALK] = 1;
        // [Stop Taking] [Keep Taking]
        this.menu();
        this.addButton(0, "Stop Taking", this.tellCottonStopEatingHorsePills);
        this.addButton(1, "Keep Taking", this.tellCottonToKeepFiringBlanksAsshole);
    }

    // [=Stop Taking=]
    private tellCottonStopEatingHorsePills(): void {
        this.clearOutput();
        this.outputText("You tell Cotton that, if they're going to be that useless to her, and she doesn't mind the idea of potentially having more kids, she has your permission to stop taking them.");
        this.outputText("\n\nShe nods and says, \"<i>Starting tomorrow I'll go ahead and stop, then.</i>\"");
        this.outputText("\n\nYou thank her for understanding you and change the subject.");

        // Display Cotton options
        // Starting from next day, Cotton fertility & potency are set to Unherbed levels - 80% chance of getting pregnant, 50% chance of impregnating PC (boosted to 80-100% if PC is in heat)?
        this.flags[kFLAGS.COTTON_HERBS_OFF] = 1;
        this.cottonMenu();
    }

    // [=Keep Taking=]
    private tellCottonToKeepFiringBlanksAsshole(): void {
        this.clearOutput();
        this.outputText("You tell Cotton you'd rather not force her to have any more kids, so she should keep taking the herbs; in your opinion, imperfect protection is better than no protection.");

        this.outputText("\n\nCotton nods, \"<i>All right then.  As they say, better safe than ");
        if (!this.silly()) this.outputText("sorry");
        else this.outputText("overrun by a herd of little horsefolk");
        this.outputText(", right?</i>\"");

        this.outputText("\n\nYou thank her for understanding you and change the subject, ready to discuss other matters.");
        // Display Cotton options
        // Cotton remains at contraception fertility levels
        this.flags[kFLAGS.COTTON_HERBS_OFF] = 0;
        this.cottonMenu();
    }

    // Turn On
    private repeatContraceptionToggleCotton(): void {
        this.clearOutput();
        // Play this scene if Contraception chosen when Cotton Contraception is turned off
        if (this.flags[kFLAGS.COTTON_HERBS_OFF] == 1) {
            this.outputText("You tell Cotton that, while you know it's not a perfect solution, you want her to start taking her herbs again.");
            this.flags[kFLAGS.COTTON_HERBS_OFF] = 0;
            this.outputText("\n\nCotton nods, \"<i>All right then.  As they say, better safe than ");
            if (!this.silly()) this.outputText("sorry");
            else this.outputText("overrun by a herd of little horsefolk");
            this.outputText(", right?</i>\"");

            this.outputText("\n\nYou thank her for understanding you and change the subject, ready to discuss other matters.");
        }
        // Turn Off
        // Play this scene on subsequent deactivations of Cotton Contraception
        else {
            this.outputText("You tell Cotton that you're ready for her to go off her herbs again if she wants to.");
            this.outputText("\n\nShe nods and says, \"<i>Starting tomorrow I'll go ahead and stop, then.</i>\"");
            this.outputText("\n\nYou thank her for understanding you and change the subject.");
            // Next day triggers Unherbed Cotton
            this.flags[kFLAGS.COTTON_HERBS_OFF] = 1;
        }
        this.cottonMenu();
    }

    // PC Pregnancy*
    // Telling Cotton*
    // This scene plays automatically the first time the PC reaches stage 2 of Cotton Pregnancy.
    public goTellCottonShesAMomDad(): void {
        this.clearOutput();
        this.outputText("Convinced that Cotton is the father of the child in your womb, at daybreak, you pack your usual things and head off to Tel'Adre.  Stopping in at the gym, you ask for directions to Cotton's place, and then make your way there.");
        this.outputText("\n\nIt turns out that Cotton lives in a small apartment, away from the main section of town, sandwiched between a somewhat shabby-looking tailor shop and a small, but very well-kept deli.  You muster your courage and then knock insistently at the door.  \"<i>Coming, coming! -Yawn- Who is it at this time of morning?</i>\" Cotton calls from inside, pulling open the door with a disgruntled look on her sleepy features.  She blinks in surprise to see you standing there, while you apologize for disturbing her so early.  Still, you have something important to discuss with her, you explain, and then ask her if you can come in.");
        this.outputText("\n\n\"<i>Ah... sure, pet.  I was just about to have breakfast anyway; join me?</i>\" she asks, politely, holding the door open and indicating you can come in.  You thank her, and follow her to the kitchen.  There, the pajama-wearing horse-morph pours two bowls full of mixed oats & grains, adding some milk before offering one to you.  You thank her and tuck in ravenously, noting you've been craving this stuff.  Cotton watches you eat with a little perturbation, but quietly eats her own bowl.  When you are both finished, she gently clears her throat.  \"<i>So, what brings you here, my little pet?  It can't have been just to have breakfast with me,</i>\" she notes.");

        this.outputText("\n\nYou tell her that's correct.  Pushing your seat back, you place a hand gently on your swelling belly and tell her that the two of you evidently weren't as careful as you could have been.  Cotton's really left her mark on you, recently.");
        this.outputText("\n\nCotton looks puzzled, for a few seconds, then realisation hits her.  \"<i>Holy... you're pregnant? I'm going to be a daddy?</i>\"");
        this.outputText("\n\nYou tell her you're pretty sure that's the case.");
        this.outputText("\n\n\"<i>I... oh, wow... what are we going to do?</i>\" she asks, slumped in her chair.");

        this.outputText("\n\nYou tell her that's mostly up to her; does she want this baby?  Does she still want you?");
        this.outputText("\n\n\"<i>Yes!</i>\" Cotton explodes.  \"<i>What kind of woman do you think I am?  That I'd abandon my child, or the mother of my child?</i>\"  She looks thoughtful for a moment, then says, \"<i>I think... Yes, don't worry about a thing.  I'll have everything ready by the time you're ready to pop, my little pet.</i>\"  She places a hand upon your belly, whispering, \"<i>And my littlest pet.</i>\"  She moves her hand up to her chin, now apparently deep in thought, her mind no doubt going through all the preparations that need to be taken care of.");

        this.outputText("\n\nYou thank her for breakfast and politely excuse yourself.  It's clear that she's got quite a bit of work ahead of her, and you've got to get back.  You exit the little apartment, closing the door softly behind you, and strike off back towards camp.");
        this.flags[kFLAGS.COTTON_KNOCKED_UP_PC_AND_TALK_HAPPENED] = 1;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Birthing*
    public vaginalBirth(): void {
        this.outputText("\nYou wake up suddenly to strong pains and pressures in your gut.  As your eyes shoot wide open, you look down to see your belly absurdly full and distended.  ");
        if (this.player.vaginas.length == 0) {
            this.outputText("You feel a terrible pressure in your groin... then an incredible pain accompanied by the rending of flesh.  You look down and behold a vagina. ");
            this.player.createVagina();
        }
        this.outputText("You can feel movement underneath the skin, and watch as it bulges and shifts as another living being moves independently inside you.");
        this.outputText("\n\nOddly, there's no pain as you sit up and spread your [legs] in a birthing stance.  A wave of peace and tranquility descends over you, reminding you of your yoga sessions with Cotton.  You take a deep breath and push as hard as you can, pausing only to take small gasps for air.  You feel a sudden pressure against your cervix as your child begins to push its way through little by little.");
        this.outputText("\n\nYou aren't left waiting long, as you see its head emerging from inside you.  Little equine ears top its head, and its face has only the barest hint of a snout.  The torso comes next, more uncomfortable than the head, but still there is no pain.  Finally, with one last push, your child's lower body slips from you in a gush of afterbirth.");
        this.outputText("\n\nThe child struggles on the ground for a moment before you pick it up and bring it to your teat.  It quickly latches on, suckling like there's no tomorrow.  You take this opportunity to sit back and examine the fruit of your loins.  Congratulations, it's a ");
        const kid: number = rand(3) + 1;
        if (kid == 1) this.outputText("boy");
        else if (kid == 2) this.outputText("girl");
        else this.outputText("hermaphrodite");
        this.outputText("!  Like ");
        if (kid == 1) this.outputText("his");
        else this.outputText("her");
        this.outputText(" 'father', ");
        if (kid == 1) this.outputText("he");
        else this.outputText("she");
        this.outputText("'s hairless except on ");
        if (kid == 1) this.outputText("his");
        else this.outputText("her");
        this.outputText(" head, where there's a light sprinkling of dark hair.  ");
        if (kid == 1) this.outputText("His");
        else this.outputText("Her");
        this.outputText(" feet end in tiny pristine hooves, and a little brush of a tail extends from ");
        if (kid == 1) this.outputText("his");
        else this.outputText("her");
        this.outputText(" backside.");

        this.outputText("\n\nYou gently caress your new child, and to your surprise its tiny little fingers latch on to your finger, making it look enormous by comparison.  Its grip is not strong, of course, but you can't bring yourself to pull your hand away. You spend the next hour or so just sitting like that as your child suckles, until it's finally had enough and drifts off to sleep.");

        this.outputText("\n\nLooking around your camp, you know you can't take care of such a child here. Not with how often you're away and with the ever-looming threat of demon invasion.  With this in mind you stand, careful not to wake your new ");
        if (kid == 1) this.outputText("son");
        else this.outputText("daughter");
        this.outputText(", bundle ");
        if (kid == 1) this.outputText("him");
        else this.outputText("her");
        this.outputText(" up good and tight, get dressed, and head off towards Tel'Adre.");

        this.outputText("\n\nThe guards at the gate look at you a little oddly at first, but when you show them your little bundle of joy, they \"<i>oooh</i>\" and \"<i>aaah</i>\", crowding around to get a better look.  They speak in whispering babytalk, cautious not to wake ");
        if (kid == 1) this.outputText("him");
        else this.outputText("her");
        this.outputText(".  Eventually they remember you're here and disperse, waving you inside.  As you look back, you see one guard light up a cigar and pass others around.");

        this.outputText("You trek through the town, eventually finding Cotton's apartment nuzzled in between a tailor's shop and a deli.  You only have to wait a moment after knocking before seeing the familiar face of your yoga instructor and lover.  At first she looks surprised to see you, then her eyes fall upon the little bundle of joy held in your arms.  Her hazel eyes go wide and she stifles a squee of excitement.");
        // [Instead: If you've dumped Cotton]
        if (this.flags[kFLAGS.PC_IS_A_DEADBEAT_COTTON_DAD] > 0) {
            this.outputText("\n\nHer excitement diminishes as she looks up at you, glaring.  \"<i>I suppose you can't take care of this one either?</i>\"  You nod, explaining the dangers of being Champion.  She nods her head, \"<i>Of course I won't turn away my ");
            if (kid == 1) this.outputText("son");
            else this.outputText("daughter");
            this.outputText(".  She takes the child from you, holding ");
            if (kid == 1) this.outputText("him");
            else this.outputText("her");
            this.outputText(" close with practiced grace.");

            this.outputText("\n\n\"<i>I don't expect I'll see you again, [name],</i>\" she says.  You're surprised she actually uses your name.  \"<i>I still think you're an asshole but... take care of yourself.</i>\"  She doesn't look you in the eye, her gaze firmly on the child held in her arms.  Cotton simply nods absently to herself, then closes the door on you.");
            this.outputText("\n\nWith a sigh, you begin your long walk back to camp.");
        }
        // [First Child with Cotton?]
        else if (this.flags[kFLAGS.COTTON_KID_COUNT] == 0) {
            this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] = kid;
            this.outputText("\n\nAfter pulling you into a quick awkward hug, she ushers you inside and into a large nursery room painted with pastel pinks, blues and purples. You explain you can't keep the child with you, and Cotton nods understandably. \"<i>");
            if (kid == 1) this.outputText("He'll");
            else this.outputText("She'll");
            this.outputText(" be so happy here, pet, I promise you.  I'm an excellent momma, or daddy, as the case may be.  I don't know if I've ever told you, but I had a couple of kids a few years back.  Twins.  Boy they were rambunctious little devils.  Couldn't sit still,</i>\" she smiles wistfully.");

            this.outputText("\n\nSo, Cotton's been a parent before? You ask if she was the mother or the father.");

            this.outputText("\n\n\"<i>Oh, I was the 'daddy', I guess,</i>\" she laughs a little at the word.  \"<i>Their mother was from my home village.  We moved into Tel'Adre together after the demons came.  One thing led to another, and we had two bundles of joy not long after.</i>\"");

            this.outputText("\n\nYou ask what the mother was; another horse-morph like Cotton herself? Maybe a centaur?  Woman, or herm?");

            this.outputText("\n\n\"<i>Oh, she was a morph like me, most of my village was. Female, of course. Hermaphrodites like me weren't especially common back then, though I'm proud to say I'm all natural!");
            // if child is Herm:
            if (kid == 3) this.outputText("  I guess it runs in the family.");
            this.outputText("</i>\"");

            this.outputText("\n\nYou nod your head in understanding.  Then, delicately, you comment that Cotton doesn't seem to be in a relationship with her old sweetheart anymore.  Did the relationship simply not work out, or...?");

            this.outputText("\n\nCotton thinks about this for a moment, then replies with, \"<i>Let's just say we found ourselves pulling apart, and she moved on to greener pastures.  Left me with the kids, though I wouldn't have had it any other way. I still see her sometimes around Tel'Adre.  There's no real bad blood there, but we won't be getting together for tea any time soon.</i>\"");

            this.outputText("\n\nYou thank Cotton for being willing to tell you about things like this.  Then, to change the subject, you ask what happened to her twins - also, what were they, in terms of gender?");

            this.outputText("\n\nCotton replies, \"<i>Oh, a boy and a girl. Fraternal twins.  They're out there somewhere.  Left Tel'Adre last year to search for other settlements and try and fight the demons.  I get a letter every now and then, coming in from the odd trader, but I haven't seen them in so long.</i>\"  You see tears forming in her eyes.  She obviously worries about them.");

            this.outputText("\n\nShe wipes the tears away and waves a hand, \"<i>But anyway, let's get this little ");
            if (kid == 1) this.outputText("guy");
            else this.outputText("girl");
            this.outputText(" situated.</i>\"  She takes the bundle from you, retrieves a fresh clean blanket, and within seconds has ");
            if (kid == 1) this.outputText("him");
            else this.outputText("her");
            this.outputText(" expertly swaddled.  Cotton sets the child in the crib and stands back to admire her handiwork. You step up beside her and wrap an appreciative arm around her waist, telling her that she's done a wonderful job.");

            this.outputText("\n\n\"<i>Oh no, pet,</i>\" she whispers back, \"<i>This baby was all you.</i>\"  You smile at her, call her a flatterer, and then kiss her.  You ask if she needs any more help setting things up.  \"<i>No, don't worry about a thing, everything's been taken care of.  But we can sit here a little longer if you want.</i>\"");

            this.outputText("\n\nYou tell her you'd like that, taking a seat nearby with the 'father' of your child and watching as your baby foal sleeps soundly. Eventually, though, you have to leave, and politely excuse yourself to head back to camp.");
        }
        // [Additional Kids]
        else {
            this.outputText("\n\nAfter pulling you into a quick, awkward hug, she ushers you inside and into the nursery and its familiar pastel pinks, blues and purples. \"<i>Oh ");
            if (kid == 1) this.outputText("he");
            else this.outputText("she");
            this.outputText("'s so cute, pet.  We sure do make 'em good.  ");
            if (kid == 1) this.outputText("He");
            else this.outputText("She");
            this.outputText("'ll just love it here with ");
            if (kid == 1) this.outputText("his");
            else this.outputText("her");
            this.outputText(" family,</i>\" Cotton declares.  You nod your head, then ask if Cotton will be okay looking after one more child?");

            this.outputText("\n\n\"<i>Are you kidding pet?  The more the merrier,</i>\" she laughs quietly.  \"<i>Just get me a few more and we've got ourselves a sports team.</i>\"");

            this.outputText("\n\nYou smirk and tap her playfully on the nose, pointing out that if she's not a little more careful, you may just give her that sports team after all.");

            this.outputText("\n\n\"<i>Me be careful?  It takes two to tango, how about you stop being such a beautiful piece of ass?</i>\" she jokes, grabbing your [butt] playfully.");

            this.outputText("\n\nYou smirk back and grab Cotton's bulge, giving it a gentle squeeze and saying maybe she should stop letting it do the thinking for her... but then again, you'd be missing out too if she did, wouldn't you?");

            this.outputText("\n\n\"<i>It does the best thinking for me, I'd say.  It did get us these gorgeous children, didn't it?</i>\" she jokes to you.");

            this.outputText("\n\nYes it did, you admit.  You give Cotton a slap on the ass and tell her to take care of herself and your brood, telling her that you need to get back to camp.");

            this.outputText("\n\n\"<i>Of course, pet,</i>\" she says, taking the bundle from you.  She quickly swaddles it, and settles it down in the crib before giving your forehead a kiss goodbye.  You give your equine lover one last cuddle, and then set off back to camp. You've another busy day ahead, after all.");
        }
        this.outputText("\n");
        this.flags[kFLAGS.COTTON_KID_COUNT]++;
        if (this.flags[kFLAGS.COTTON_KID_COUNT] == 1) this.flags[kFLAGS.COTTON_OLDEST_KID_AGE] = 1;
        this.player.knockUpForce(); // Clear Pregnancy
    }

    public updateVaginalPregnancy(): boolean {
        let displayedUpdate: boolean = false;

        if (this.player.pregnancyIncubation === 320) {
            this.outputText("\n<b>You realize your belly has gotten bigger. Maybe you should cut back on all the strange food.  Though you do have odd cravings for oats and grain.</b>\n");
            displayedUpdate = true;
        }
        else if (this.player.pregnancyIncubation === 280) {
            this.outputText("\n<b>Your belly is getting more noticeably distended. You are probably pregnant. The strong hankerings for oats and grains give you a very obvious clue as to who the 'father' might be.</b>\n");
            displayedUpdate = true;
        }
        else if (this.player.pregnancyIncubation === 225) {
            this.outputText("\n<b>The unmistakable bulge of pregnancy is visible in your tummy.  You stroke the orb and wonder with a half-grin if you'll have a daughter who takes after her 'daddy'.</b>\n");
            displayedUpdate = true;
        }
        else if (this.player.pregnancyIncubation === 165) {
            this.outputText("\n<b>The sudden impact of a tiny kick from inside your womb startles you.  Moments later it happens again, making you gasp.  The baby inside you really must be equine in nature; she's already got quite a wicked kick on her.</b>\n");
            displayedUpdate = true;
        }
        else if (this.player.pregnancyIncubation === 105) {
            this.outputText("\n<b>You're already as big as any pregnant woman back home. Considering that what you're carrying is technically a foal, you wonder just how much bigger you're going to get...</b>\n");
            displayedUpdate = true;
        }
        else if (this.player.pregnancyIncubation === 80) {
            this.outputText("\n<b>Your swollen stomach would bring queries about the possibility of twins back in Ingnam.  However, you can only feel one strong heart beating away inside your stretched midriff.  Cotton's foal is definitely growing up healthy...\n\nYou're glad, but a little worried about giving birth.</b>\n");
            displayedUpdate = true;
        }
        else if (this.player.pregnancyIncubation === 50) {
            this.outputText("\n<b>Your belly is painfully distended and swollen; you feel like you're going to burst before you get much bigger.  You find yourself pacing around restlessly in the night, like the expectant mares back in the village.  You're anxious to finally give birth, as much to get this heavy baby out of you as to finally be able to cuddle your child.</b>\n");
            displayedUpdate = true;
        }
        // Tits
        if (this.player.pregnancyIncubation === 32 || this.player.pregnancyIncubation === 64 || this.player.pregnancyIncubation === 85 || this.player.pregnancyIncubation === 150) {
            displayedUpdate = true;
            // Increase lactation!
            if (this.player.biggestTitSize() >= 3 && this.player.mostBreastsPerRow() > 1 && this.player.biggestLactation() >= 1 && this.player.biggestLactation() < 2) {
                this.outputText("\nYour breasts feel swollen with all the extra milk they're accumulating.  You wonder just what kind of creature they're getting ready to feed.\n");
                this.player.boostLactation(.5);
            }
            if (this.player.biggestTitSize() >= 3 && this.player.mostBreastsPerRow() > 1 && this.player.biggestLactation() > 0 && this.player.biggestLactation() < 1) {
                this.outputText("\nDrops of breastmilk escape your nipples as your body prepares for the coming birth.\n");
                this.player.boostLactation(.5);
            }
            // Lactate if large && not lactating
            if (this.player.biggestTitSize() >= 3 && this.player.mostBreastsPerRow() > 1 && this.player.biggestLactation() === 0) {
                this.outputText("\n<b>You realize your breasts feel full, and occasionally lactate</b>.  It must be due to the pregnancy.\n");
                this.player.boostLactation(1);
            }
            // Enlarge if too small for lactation
            if (this.player.biggestTitSize() === 2 && this.player.mostBreastsPerRow() > 1) {
                this.outputText("\n<b>Your breasts have swollen to C-cups,</b> in light of your coming pregnancy.\n");
                this.player.growTits(1, 1, false, 3);
            }
            // Enlarge if really small!
            if (this.player.biggestTitSize() === 1 && this.player.mostBreastsPerRow() > 1) {
                this.outputText("\n<b>Your breasts have grown to B-cups,</b> likely due to the hormonal changes of your pregnancy.\n");
                this.player.growTits(1, 1, false, 3);
            }
        }

        return displayedUpdate;
    }

    // Visit Kids*
    // Visit Kids Option
    // Present amongst ordinary Cotton options before Yoga
    // Requires PC has at least one CottonKid
    private visitCottonKids(): void {
        this.clearOutput();
        this.outputText("You tell Cotton that, if it's okay with her, you'd like to skip exercising today; you were hoping that you could visit your ");
        if (this.flags[kFLAGS.COTTON_KID_COUNT] == 1) this.outputText("kid");
        else this.outputText("kids");
        this.outputText(", instead? Cotton's eyes widen in surprise before a happy grin splits her face.  \"<i>Sure, pet, all you had to do was ask!  Give me a minute to get my stuff, and then we'll go and see ");
        if (this.flags[kFLAGS.COTTON_KID_COUNT] == 1) {
            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] == 1) this.outputText("him");
            else this.outputText("her");
        }
        else this.outputText("them");
        this.outputText(", all right?</i>\"  You nod your head and watch as the equine yoga instructor busies herself gathering her few daily belongings, then follow her as she heads back home, eager to see how your ");
        if (this.flags[kFLAGS.COTTON_KID_COUNT] == 1) {
            this.outputText("child is");
        }
        else this.outputText("children are");
        this.outputText(" doing.");

        const scene: number = rand(4);
        // Play randomly chosen scene from list below
        // Peek-a-boo
        if (scene == 0) {
            this.outputText("\n\nYour ");
            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("baby girl is");
            else this.outputText("baby boy is");
            this.outputText(" sitting up in ");
            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
            else this.outputText("his");
            this.outputText(" crib when you both enter, cooing happily and babbling like babies do, clearly happy in ");
            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
            else this.outputText("his");

            this.outputText(" own little way to see you.  Cotton smiles at you, \"<i>Watch this; ");
            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("she");
            else this.outputText("he");
            this.outputText(" loves this game,</i>\" she tells you, and then slowly kneels before the crib.  \"<i>Hello, my little sweet, hellooo.</i>\"  Cotton coos, patting the ");
            if (this.flags[kFLAGS.COTTON_KID_COUNT] == 1) this.outputText("baby");
            else this.outputText("babies");
            this.outputText(" on the nose and babbling to ");

            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] == 1) this.outputText("him");
            else this.outputText("her");

            this.outputText(" in that way that parents of small children tend to do.  When the little ");
            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] == 1) this.outputText("colt");
            else this.outputText("filly");
            this.outputText(" foal is giggling merrily, Cotton slowly cover her eyes with her hands.  \"<i>Where's the baby? Where's the little baby?</i>\" she asks, then quickly uncovers her eyes, adopting an exaggerated expression of surprise.  \"<i>Why, there ");
            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] == 1) this.outputText("he");
            else this.outputText("she");
            this.outputText(" is!</i>\"  She gasps, making the baby laugh in delight.  She repeats this several times, the baby enjoying it thoroughly.  You ask Cotton if you can try, and she agrees; ");
            this.outputText("your baby seems");
            this.outputText(" a little surprised to see you, but that doesn't stop ");

            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
            else this.outputText("him");
            this.outputText(" from laughing just as hard at you as ");
            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] == 1) this.outputText("he");
            else this.outputText("she");
            this.outputText(" did at Cotton.  Feeling a little left out, Cotton rejoins you and you start playing peek-a-boo together, much to the baby's delight.");

            // [Additional Kids:
            if (this.flags[kFLAGS.COTTON_KID_COUNT] > 1) {
                this.outputText("\n\nYour other ");
                if (this.flags[kFLAGS.COTTON_KID_COUNT] == 2) this.outputText("baby is");
                else this.outputText("babies are");
                this.outputText(" clearly enjoying it just as much as your first-born, giggling and clapping at yours and Cotton's antics, even clumsily trying to mimic the game themselves.");
            }
            this.outputText("\n\nEventually, though, ");
            if (this.flags[kFLAGS.COTTON_KID_COUNT] == 1) {
                if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("she grows tired");
                else this.outputText("he grows tired");
            }
            else this.outputText("they grow tired");
            this.outputText(" and, still giggling, settle");
            if (this.flags[kFLAGS.COTTON_KID_COUNT] == 1) this.outputText("s");
            this.outputText(" down to sleep.  You and Cotton fuss over ");
            if (this.flags[kFLAGS.COTTON_KID_COUNT] == 1) {
                if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
                else this.outputText("him");
            }
            else this.outputText("them");

            this.outputText(", tucking ");
            if (this.flags[kFLAGS.COTTON_KID_COUNT] == 1) {
                if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
                else this.outputText("him");
            }
            else this.outputText("them");
            this.outputText(" in and mussing ");
            if (this.flags[kFLAGS.COTTON_KID_COUNT] == 1) {
                if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
                else this.outputText("his");
            }
            else this.outputText("their");
            this.outputText(" hair gently, but watch until ");
            if (this.flags[kFLAGS.COTTON_KID_COUNT] == 1) {
                if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("she goes");
                else this.outputText("he goes");
            }
            else this.outputText("they go");
            this.outputText(" to sleep.  You share a smile with your equine lover, kiss your ");
            if (this.flags[kFLAGS.COTTON_KID_COUNT] == 1) {
                this.outputText("kid on the cheek");
            }
            else this.outputText("kids on the cheeks");
            this.outputText(", kiss her on the lips, and then quietly leave Cotton's house to head back to camp.");
        }
        // Little Angel
        else if (scene == 1) {
            this.outputText("\n\nHowever, it turns out that ");
            if (this.flags[kFLAGS.COTTON_KID_COUNT] == 1) this.outputText("your baby is");
            else this.outputText("all your children are");
            this.outputText(" fast asleep.  Rather than disturb ");
            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
            else this.outputText("him");
            this.outputText(", Cotton simply leans over the crib, gently stroking a cheek with a soft smile on her lips.  \"<i>I'd forgotten what it was like to be a parent... it's hard work, but it's definitely rewarding.</i>\"  She gives you a sidelong look.  \"<i>I can't say that this is exactly what I expected of our little relationship... but I'm not complaining.</i>\"");

            this.outputText("\n\nYou can't resist a playful smirk and tell Cotton that she's a flatterer, giving her a quick kiss on the cheek before heading back to camp, leaving Cotton and the ");
            if (this.flags[kFLAGS.COTTON_KID_COUNT] == 1) this.outputText("baby");
            else this.outputText("babies");
            this.outputText(" to get some rest together.");
        }
        // Breastfeeding
        else if (scene == 2) {
            // If player lactates, display \"<i>Stay Quiet</i>\" or \"<i>Feed</i>\" options; otherwise, skip straight to Stay Quiet option
            this.outputText("\n\nAt the sight of Cotton, your ");
            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("daughter");
            else this.outputText("son");
            this.outputText(" starts to wail and cry, the mare looking tired.  \"<i>Oh, you're hungry again my little one?  All right, all right, mommy will get your milk, just give me a moment...</i>\"");
            if (this.flags[kFLAGS.COTTON_KID_COUNT] > 1) this.outputText("  Fortunately, your other kids don't seem to be hungry, so it's just the one who needs feeding.");

            // (If PC lactates:
            if (this.player.lactationQ() >= 50) {
                this.outputText("  You could probably offer to nurse your ");
                if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] != 1) this.outputText("daughter");
                else this.outputText("son");
                this.outputText(" for the poor mare-morph, rather than letting her use a bottle, or whatever she's going to do.");
                // [Feed] [Stay Quiet]
                this.menu();
                this.addButton(0, "Feed", this.feedYourCottonKids);
                this.addButton(1, "Stay Quiet", this.letCottonFeedKids);
            }
            else {
                this.menu();
                this.addButton(0, "Next", this.letCottonFeedKids);
            }
            return;
        }
        // Cuddlebug
        else {
            this.outputText("\n\nYour ");
            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("daughter");
            else this.outputText("son");
            this.outputText(" stares up at you with eyes wide and wet, sniffling audibly as ");
            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("she");
            else this.outputText("he");
            this.outputText(" makes tiny little sobs.  \"<i>Aw, looks like somebody was lonely,</i>\" Cotton coos, then gives you a meaningful nudge.  Realising she wants you to hold your child, you step forward and gently lift ");
            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
            else this.outputText("he");
            this.outputText(" up into your arms, commenting on what a big, heavy ");
            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("girl");
            else this.outputText("he");
            this.outputText("'s getting to be.  The baby is scared and hesitant, and bursts into tears at first, but you croon and shush ");
            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
            else this.outputText("he");
            this.outputText(" gently, holding the foal close to your ");
            this.outputText("[chest] and rocking ");
            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
            else this.outputText("him");
            this.outputText(" back and forwards; soon enough, the foal's cooing and snuggling eagerly against you as you cuddle ");
            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
            else this.outputText("him");
            this.outputText(".");

            this.outputText("\n\nYou murmur soft nothings to your child, telling them how brave and healthy they are, and assuring them that you know they'll grow up to be big and strong, gently ruffling the foal's hair, an act that makes ");
            if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
            else this.outputText("his");
            this.outputText(" little ears flick in the most adorable manner.  So caught up are you in cuddling your child that you don't notice Cotton until she has her arms wrapped around you, leaning her head against you as she embraces the pair of you.");

            this.outputText("\n\nYou hold your child close and allow yourself to be embraced in turn, simply enjoying the moment of closeness, as odd as your relationship may be.  Eventually, the foal drifts off to sleep in your embrace and you quietly tell Cotton that she needs to let go.  Instead, she playfully squeezes you and whispers, \"<i>Mine...</i>\" in your ear.  Turning your neck, you look into her eyes, whereupon she gives you a soft, playful grin and lets you go, allowing you to put the sleepy foal back to bed.  She just smiles at you without saying a word, and you nod your head and excuse yourself without a word.");
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Feed
    private feedYourCottonKids(): void {
        this.clearOutput();
        this.outputText("You interrupt Cotton by pointing out that you have breasts full of milk; you'd be happy to nurse the little ");
        if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("filly ");
        else this.outputText("cotton ");
        this.outputText(" for her, if she wants.");

        this.outputText("\n\nCotton blinks at you in surprise before giving you a relieved and admiring smile.  \"<i>Thank you, pet - besides, a little bonding time would do you both some good,</i>\"  she states.  Gently she picks the little horse-morph up before handing ");
        if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
        else this.outputText("he");
        this.outputText(" to you, by which time you have already exposed your [chest].");

        this.outputText("\n\nYou carefully take your child from Cotton's hands, feeling ");
        if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
        else this.outputText("his");
        this.outputText(" weight in your arms, before bringing ");

        if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
        else this.outputText("him");

        this.outputText(" in close");
        this.outputText(".  At first, the baby is confused and whimpers quietly in fear, but ");

        if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
        else this.outputText("his");

        this.outputText(" presence and weight make your boobs start releasing their sweet cargo.  As the scent of milk fills the air, the baby's instincts take over and it brings its little face in to first nuzzle your [nipple], and then finally close ");
        if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
        else this.outputText("his");
        this.outputText(" lips around it.");

        this.outputText("\n\nYou let out a quiet moan of appreciation as the child - <b>your</b> child - starts to suckle, gently bringing her in as close as you can.  You start to slowly rock ");
        if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
        else this.outputText("him");
        this.outputText(" back and forth, quietly starting to sing whatever dredges of lullabies you can remember overhearing from the nursing mothers back in your own village in Ingnam.  You can feel ");
        if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
        else this.outputText("his");
        this.outputText(" little heart beating inside ");
        if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
        else this.outputText("his");
        this.outputText(" breast, and you wonder if ");
        if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("she");
        else this.outputText("he");
        this.outputText(" can hear your heart inside of yours.");

        this.outputText("\n\nCotton smiles, moving behind you and putting her hands on your shoulders, remarking, \"<i>You're just a regular milk-machine, aren't you?  Good thing too, our child");
        if (this.flags[kFLAGS.COTTON_KID_COUNT] == 1) this.outputText(" needs");
        else this.outputText("ren need");
        this.outputText(" all the energy they can get.</i>\" Her hands begin to massage your shoulders and back, kneading the flesh, helping you to relax.");

        this.outputText("\n\nEventually the child releases its hold on your nipple and lets out a huge yawn for such a little thing.  Its eyelids drift closed and it settles in its blanket for a long milk-fueled nap.  You gently rock the child, still singing softly, and then quietly tell Cotton that her baby is a little angel.");

        this.outputText("\n\nShe smiles and replies, \"<i>Enjoy that while it lasts, pet.  Sooner than you think they'll be tearing across the house, more rambunctious than anything you've seen.</i>\"");

        this.outputText("\n\nYou sigh and admit that's true.  However, right now, ");
        if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("she");
        else this.outputText("he");
        this.outputText(" is just a sleepy little thing who needs to go to bed, you tell her, and you gently put the baby back in ");
        if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
        else this.outputText("his");
        this.outputText(" crib to get some sleep.  You recover your breasts and ask if Cotton will be okay looking after them now, or if you should stick around and help out a little longer?");

        this.outputText("\n\n\"<i>I'll be fine, don't worry about a thing. You get home, get some rest, and keep those milk jugs full, eh?</i>\" she laughs.");

        this.outputText("\n\nYou kiss your equine lover, ruffle the sleeping child's hair, and quietly head back to camp, leaving Cotton to take care of things.");
        this.dynStats("lus", -10);
        // You've now been milked, reset the timer for that
        if (this.player.hasStatusEffect(StatusEffects.Feeder)) {
            this.player.addStatusValue(StatusEffects.Feeder, 1, 1);
            this.player.changeStatusValue(StatusEffects.Feeder, 2, 0);
        }
        this.player.boostLactation(0.5);

        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Stay Quiet
    private letCottonFeedKids(): void {
        this.clearOutput();
        this.outputText("You quietly watch on as Cotton removes her top, exposing her dark-skinned breasts topped by chocolatey nipples.  Your child coos and giggles, knowing it's feeding time, its little underdeveloped hands reaching for the breast hungrily.  She smiles and brings the foal up to the breast, where it latches on and begins suckling hungrily.");

        this.outputText("\n\nThe two of you sit and watch the child feed with wild abandon, silently enjoying each other's company.  \"<i>It amazes me how much milk these little guys can pack away,</i>\" Cotton remarks with a smile.");

        this.outputText("\n\nWell, you say, they need their milk to grow up big, strong, and sexy, just like Cotton herself.  You grin and squeeze the muscular tightness of Cotton's ass as you finish saying this.");

        this.outputText("\n\nYou notice Cotton can't help but let out a quiet moan from time to time as the child slurps and suckles.  She does her best to hide it, but not well enough.  Soon, though, you see the child growing more sluggish.  Eventually it lets out a big yawn and a prompt \"<i>UURP</i>\", before settling down in its blanket for a nap.");

        this.outputText("\n\nCotton holds it for another minute, then hands it off to you, so that she can get dressed. You slowly rock your child in your arms, humming a soothing tune.  The child you're holding looks so different to the babies back in Ingnam...");

        this.outputText("\n\nCotton slips on her normal tank top and looks down appreciatively at the child in your arms. \"<i>How about you put ");
        if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her down for her nap, hm pet?</i>\"");
        else this.outputText("him down for his nap, hm pet?</i>\"");

        this.outputText("\n\nYou nod your head to her and gently place the sleepy baby back in ");
        if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
        else this.outputText("his");
        this.outputText(" crib.  You ruffle ");
        if (this.flags[kFLAGS.COTTON_OLDEST_KID_GENDER] >= 2) this.outputText("her");
        else this.outputText("his");
        this.outputText(" hair and tell Cotton that she makes some gorgeous little foals.  She just nods and gives your shoulder a little squeeze, content to watch in silence for a moment.");

        this.outputText("\n\nEventually, and apologetically, you tell her that you have to go; places to go, monsters to fight, she knows how it is.  She nods, understanding, and you give her a quick kiss before departing back to camp.");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

}
