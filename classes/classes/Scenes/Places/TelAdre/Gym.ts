import { TelAdreAbstractContent } from "./TelAdreAbstractContent";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { rand } from "../../../Extra";

export class Gym extends TelAdreAbstractContent {

    public gymDesc(): void {
        // PREGGO ALERT!
        if (this.flags[kFLAGS.PC_IS_A_GOOD_COTTON_DAD] + this.flags[kFLAGS.PC_IS_A_DEADBEAT_COTTON_DAD] == 0 && this.telAdre.cotton.pregnancy.isPregnant) {
            this.telAdre.cotton.cottonPregnantAlert();
            return;
        }
        this.spriteSelect(undefined);
        this.clearOutput();
        this.outputText("Even though Ingnam, your hometown, was a large, prosperous village, you never saw a gym before coming to Tel'Adre.  The structure itself has numerous architectural differences from the surrounding buildings: short, waist-high walls, an arched ceiling supported by simple columns, and a sand-covered floor.  Perhaps the only 'normal' rooms inside are the changing stands and bathrooms, which ");
        if (this.player.cor < 35) this.outputText("thankfully ");
        else if (this.flags[kFLAGS.PC_FETISH] > 0 || this.player.cor > 80) this.outputText("unfortunately ");
        this.outputText("have full sized walls to protect their users' privacy.  A breeze blows by, revealing that the open-air design provides great ventilation.  You note a wall of weights of different sizes and shapes, perfect for building muscle and bulking up.  There are also jogging tracks and even a full-sized, grass-covered track out back for centaurs to run on.  Though some of the equipment seems a bit esoteric in nature, you're sure you can make use of most of this stuff.\n\n");

        this.outputText("Though the gym sees heavy use by the city guard and various citizens, it's not too busy at present.");
        // (Add possible character descripts here)
        // (An extraordinarily well-muscled centaur male is by the weights, lifting some huge dumbbells and sweating like crazy.  In true centaur fashion, he's not wearing any clothes, but then again, male centaurs don't have much that regular clothes would hide.)
        // (There's a lizan girl jogging laps on one of the tracks.  She's quite thin, but her muscles have a lean definition to them.  She's wearing a one-piece, spandex leotard that hugs her tight ass and pert, b-cup breasts nicely.)
        this.outputText("  There's a centauress in a tank-top just inside the doorway with huge, rounded melons and perky nipples, but she merely coughs to get you to look up and says, \"<i>");
        if (this.flags[kFLAGS.LIFETIME_GYM_MEMBER] == 0) this.outputText("10 gems an hour to use the facilities here, or 500 for a life-time membership.</i>\"  She has her hands on her hips, and it looks you'll have to pay ten gems to actually get to use any of this stuff.");
        else this.outputText("Oh, welcome back " + this.player.short + ".  Have a nice workout!</i>\"");

        if (this.player.gems < 10 && this.flags[kFLAGS.LIFETIME_GYM_MEMBER] == 0) {
            this.outputText("\n\n<b>You reach into your pockets for the fee and come up empty.  It looks like you don't have enough money to use the equipment or meet anyone.  Damn!</b>");
            // (back to tel'adre streets)
            this.doNext(this.telAdre.telAdreMenu);
            return;
        }
        this.telAdre.lottie.lottieAppearance();
        if (this.flags[kFLAGS.LOPPE_MET] > 0 && this.flags[kFLAGS.LOPPE_DISABLED] == 0) {
            this.outputText("\n\nYou spot Loppe the laquine wandering around, towel slung over her shoulder.  When she sees you, she smiles and waves to you and you wave back.");
        }
        if (this.getGame().time.hours > 9 && this.getGame().time.hours <= 15) this.telAdre.heckel.heckelAppearance();
        this.gymMenu();
    }

    private gymMenu(): void {
        this.menu();
        // Core gym interactions
        this.addButton(0, "ChangeRoom", this.telAdre.jasun.changingRoom).hint("Investigate the change room. Maybe you'll find somebody interesting?");
        this.addButton(1, "Jog", this.goJogging).hint("Jog on the track and improve your speed.");
        this.addButton(2, "LiftWeights", this.weightLifting).hint("Build up your strength with the weights.", "Lift Weight");
        // addButton(3, "Go Swimming", goSwimming);
        if (this.flags[kFLAGS.LIFETIME_GYM_MEMBER] == 0 && this.player.gems >= 500)
            this.addButton(4, "Life Member", this.buyGymLifeTimeMembership).hint("Buy lifetime membership for 500 gems? It could save you gems in the long run.", "Lifetime Membership");
        else if (this.flags[kFLAGS.LIFETIME_GYM_MEMBER] > 0)
            this.addButtonDisabled(4, "Life Member", "You already have the lifetime membership. So go ahead and use the facilities.", "Lifetime Membership");
        else
            this.addButtonDisabled(4, "Life Member", "You cannot afford to purchase the lifetime membership for the gym. You need 500 gems.", "Lifetime Membership");
        // NPCs
        if (this.flags[kFLAGS.PC_IS_A_DEADBEAT_COTTON_DAD] == 0 && this.telAdre.cotton.cottonsIntro()) this.addButton(5, this.flags[kFLAGS.COTTON_MET_FUCKED] > 0 ? "Cotton" : "Horsegirl", this.telAdre.cotton.cottonGreeting);
        if (this.getGame().time.hours > 9 && this.getGame().time.hours <= 15) this.addButton(6, this.flags[kFLAGS.MET_HECKEL] > 0 ? "Heckel" : "Hyena", this.telAdre.heckel.greetHeckel);
        if (this.telAdre.ifris.ifrisIntro()) this.addButton(7, this.flags[kFLAGS.MET_IFRIS] > 0 ? "Ifris" : "Demon-Girl", this.telAdre.ifris.approachIfris);
        this.addButton(8, this.flags[kFLAGS.LOTTIE_ENCOUNTER_COUNTER] > 0 ? "Lottie" : "Pig-Girl", this.telAdre.lottie.lottieAppearance(false));
        if (this.flags[kFLAGS.LOPPE_MET] > 0 && this.flags[kFLAGS.LOPPE_DISABLED] == 0) this.addButton(9, "Loppe", this.telAdre.loppe.loppeGenericMeetings);
        if (this.telAdre.pablo.pabloIntro() && this.flags[kFLAGS.PABLO_FREAKED_OUT_OVER_WORMS] != 1) this.addButton(10, this.flags[kFLAGS.PABLO_MET] > 0 ? "Pablo" : "Imp?", this.telAdre.pablo.approachPablo);
        this.addButton(14, "Leave", this.telAdre.telAdreMenu);
    }

    private buyGymLifeTimeMembership(): void {
        this.clearOutput();
        // [Buy LifeTime Membership]
        if (this.silly()) this.outputText("You tell \"<i>Shut up and take my gems!</i>\" as you pull out your gem-pouch. \n\n"); // Shut up and take my gems!
        this.outputText("You fish into your pouches and pull out 500 gems, dumping them into the centaur's hands.  Her eyes widen as she turns and trots towards a counter in the back.  She leans over as she counts, giving you a generous view down her low-cut top at the cleavage she barely bothers to conceal.");
        if (this.player.hasCock()) {
            this.outputText("  It brings a flush to your face that has nothing to do with exercise.  Maybe you'll be able to con her into some alone time later?");
            this.dynStats("lus", (10 + this.player.lib / 10));
        }
        this.flags[kFLAGS.LIFETIME_GYM_MEMBER] = 1;
        this.player.gems -= 500;
        this.statScreenRefresh();
        // [Bring up gym menu]
        this.gymMenu();
    }

    private weightLifting(): void {
        this.clearOutput();
        // Too tired?  Fuck off.
        if (this.player.fatigue > this.player.maxFatigue() - 25) {
            this.outputText("<b>There's no way you could exercise right now - you're exhausted!</b>  ");
            if (this.flags[kFLAGS.LIFETIME_GYM_MEMBER] == 0) this.outputText("It'd be better to save your money and come back after you've rested.");
            this.doNext(this.telAdre.telAdreMenu);
            return;
        }
        // Deduct gems if not a full member.
        if (this.flags[kFLAGS.LIFETIME_GYM_MEMBER] == 0) {
            this.player.gems -= 10;
            this.statScreenRefresh();
        }
        // [Lift Weights] +25 fatigue!
        this.player.changeFatigue(25);
        // TEXTS!
        this.outputText("You walk up to the weights and begin your workout.  ");
        // (< 25 str)
        if (this.player.str100 < 25) this.outputText("You have to start out on the smaller weights to the left side of the rack due to your strength, but even so, you manage to work up a good burn and a modest sweat.");
        // (< 40 str)
        else if (this.player.str100 < 40) this.outputText("You heft a few of the weights and select some of the ones just to the left of the middle.  It doesn't take you long to work up a sweat, but you push on through a variety of exercises that leave your body feeling sore and exhausted.");
        // (< 60 str)
        else if (this.player.str100 < 60) this.outputText("You smile when you grip a few of the heavier weights on the rack and start to do some lifts.  With a start, you realize you're probably stronger now than Ingnam's master blacksmith, Ben.  Wow!  This realization fuels you to push yourself even harder, and you spend nearly an hour doing various strength-building exercises with the weights.");
        // (<80 str)
        else if (this.player.str100 < 80) this.outputText("You confidently grab the heaviest dumbbells in the place and heft them.  It doesn't take long for you to work up a lather of sweat and feel the burn thrumming through your slowly tiring form.  The workout takes about an hour, but you feel you made some good progress today.");
        // (<90)
        else if (this.player.str100 < 90) this.outputText("You grab the heaviest weights they have and launch into an exercise routine that leaves you panting from exertion.  Setting the weights aside, you flex and marvel at yourself – you could probably arm wrestle a minotaur or two and come out victorious!");
        // (else)
        else this.outputText("This place barely has anything left to challenge you, but you take the heaviest weights you can get your mitts on and get to it.  By the time an hour has passed, you've worked up a good sweat, but without heavier weights you probably won't get any stronger.");
        // Stat changes HERE!
        if (this.player.str100 < 90) this.dynStats("str", .5);
        if (this.player.tou100 < 40) this.dynStats("tou", .3);
        // Body changes here
        // Muscleness boost!
        this.outputText(this.player.modTone(85, 5 + rand(5)));
        this.promptShowers();
    }

    private goJogging(): void {
        this.clearOutput();
        // Too tired?  Fuck off.
        if (this.player.fatigue > this.player.maxFatigue() - 30) {
            this.outputText("<b>There's no way you could exercise right now - you're exhausted!</b>  ");
            if (this.flags[kFLAGS.LIFETIME_GYM_MEMBER] == 0) this.outputText("It'd be better to save your money and come back after you've rested.");
            this.doNext(this.telAdre.telAdreMenu);
            return;
        }
        // Deduct gems if not a full member.
        if (this.flags[kFLAGS.LIFETIME_GYM_MEMBER] == 0) {
            this.player.gems -= 10;
            this.statScreenRefresh();
        }
        // [Jogging] +30 fatigue!
        this.player.changeFatigue(30);
        // Text!
        this.outputText("You hit the jogging track, ");
        // (<25 tou)
        if (this.player.tou100 < 25) this.outputText("but you get so winded you have to stop after a few minutes.  Determined to improve, you force yourself to stay at a fast walk until you can run again.");
        // (<40 tou)
        else if (this.player.tou100 < 40) this.outputText("but your performance isn't that great.  You nearly stop jogging a few times but manage to push through until you're completely exhausted.");
        // (<60 tou)
        else if (this.player.tou100 < 60) this.outputText("and you do quite well.  You jog around for nearly an hour, working up a healthy lather of sweat.  Even your " + this.player.legs() + " tingle and burn with exhaustion.");
        // (<80 tou)
        else if (this.player.tou100 < 80) this.outputText("and it doesn't faze you in the slightest.  You run lap after lap at a decent clip, working yourself until you're soaked with sweat and fairly tired.");
        // (<90 tou)
        else if (this.player.tou100 < 90) this.outputText("and you have a terrific time.  You can keep yourself just below your sprinting speed for the entire time, though you work up a huge amount of sweat in the process.");
        // else)
        else this.outputText("and it barely challenges you.  You run at a sprint half the time and still don't feel like you're improving in the slightest.  Still, you do manage to burn a lot of calories.");
        // Stat changes HERE!
        if (this.player.spe100 < 40) this.dynStats("spe", .3);
        if (this.player.tou100 < 90) this.dynStats("tou", .5);

        // If butt is over 15 guaranteed reduction
        if (this.player.butt.rating >= 15) {
            this.outputText("\n\nAll that running must have done some good, because your " + this.player.buttDescript() + " feels a little less bouncy.");
            this.player.butt.rating--;
        }
        else {
            if (this.player.butt.rating >= 10 && rand(3) == 0) {
                this.outputText("\n\nThe jogging really helped trim up your " + this.player.buttDescript() + ".");
                this.player.butt.rating--;
            }
            else if (this.player.butt.rating >= 5 && rand(3) == 0) {
                this.outputText("\n\nYour " + this.player.buttDescript() + " seems to have gotten a little bit more compact from the work out.");
                this.player.butt.rating--;
            }
            else if (this.player.butt.rating > 1 && rand(4) == 0) {
                this.outputText("\n\nYour " + this.player.buttDescript() + " seems to have gotten a little bit more compact from the work out.");
                this.player.butt.rating--;
            }
        }// If hips is over 15 guaranteed reduction
        if (this.player.hips.rating >= 15) {
            this.outputText("\n\nIt feels like your " + this.player.hipDescript() + " have shed some pounds and narrowed.");
            this.player.hips.rating--;
        }
        else {
            if (this.player.hips.rating >= 10 && rand(3) == 0) {
                this.outputText("\n\nIt feels like your " + this.player.hipDescript() + " have shed some pounds and narrowed.");
                this.player.hips.rating--;
            }
            else if (this.player.hips.rating >= 5 && rand(3) == 0) {
                this.outputText("\n\nIt feels like your " + this.player.hipDescript() + " have shed some pounds and narrowed.");
                this.player.hips.rating--;
            }
            else if (this.player.hips.rating > 1 && rand(4) == 0) {
                this.outputText("\n\nIt feels like your " + this.player.hipDescript() + " have shed some pounds and narrowed.");
                this.player.hips.rating--;
            }
        }

        // Thickness decrease!
        this.outputText(this.player.modThickness(1, 5 + rand(2)));
        // Muscleness boost!
        this.outputText(this.player.modTone(100, 2 + rand(4)));
        this.promptShowers();
    }

    private promptShowers(): void {
        this.outputText("\n\nDo you want to hit the showers before you head back to camp?");
        if (this.flags[kFLAGS.BROOKE_MET] == 1) {
            this.menu();
            if (this.flags[kFLAGS.DISABLED_SEX_MACHINE] == 0) {
                this.addButton(0, "\"Showers\"", this.telAdre.sexMachine.exploreShowers);
                this.addButton(1, "Showers", this.telAdre.brooke.repeatChooseShower);
                this.addButton(4, "Leave", this.camp.returnToCampUseOneHour);
            }
            else {
                this.doYesNo(this.telAdre.brooke.repeatChooseShower, this.camp.returnToCampUseOneHour);
            }
        }
        else this.doYesNo(this.telAdre.sexMachine.exploreShowers, this.camp.returnToCampUseOneHour);
    }
}
