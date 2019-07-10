﻿import { BaseContent } from "../../../BaseContent";
import { TimeAwareInterface } from "../../../TimeAwareInterface";
import { PregnancyStore } from "../../../PregnancyStore";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { CoC } from "../../../CoC";
import { rand } from "../../../Extra";
import { SpriteDb } from "../../../display/SpriteDb";
import { DemonPack } from "./DemonPack";
import { StatusEffects } from "../../../StatusEffects";
import { TentacleBeast } from "../Forest/TentacleBeast";
import { Minotaur } from "../Mountain/Minotaur";
import { Gnoll } from "../Plains/Gnoll";
import { CockTypesEnum } from "../../../CockTypesEnum";
import { Tongue } from "../../../BodyParts/Tongue";
import { kGAMECLASS } from "../../../GlobalFlags/kGAMECLASS";
import { Vagina } from "../../../Vagina";
import { PerkLib } from "../../../PerkLib";
import { kACHIEVEMENTS } from "../../../GlobalFlags/kACHIEVEMENTS";

/**
 * Created by aimozg on 05.01.14.
 */

export class AntsScene extends BaseContent implements TimeAwareInterface {

    //  ANTS_PC_FAILED_PHYLLA: number = 467;
    //  ANT_COLONY_KEPT_HIDDEN: number = 468;
    //  PC_READY_FOR_ANT_COLONY_CHALLENGE: number = 469;
    //  PHYLLA_SAVED: number = 470;
    //  MET_ANT_ARENA: number = 471;
    //  ANT_ARENA_WINS: number = 472;
    //  ANT_ARENA_LOSSES: number = 473;
    //  ANTS_PC_BEAT_GNOLL: number = 474;
    //  ANTS_PC_LOST_TO_GNOLL: number = 475;
    //  MET_ANT_ARENA_GNOLL: number = 476;

    //  PHYLLA_CAPACITY: number = 873;
    //  ANT_KIDS: number = 874;
    //  ANT_WAIFU: number = 875;
    //  PHYLLA_STAY_HOME: number = 876;

    //  PHYLLA_CAMP_VISITS: number = 877;
    //  DAYS_PHYLLA_IN_CAMP: number = 878;
    //  PHYLLA_EGG_LAYING: number = 879;

    //  PHYLLA_BLOWJOBS: number = 880;
    //  TALKED_WITH_PHYLLA_ABOUT_HISTORY: number = 881;
    //  TIMES_LINKED_BJ_SUCK: number = 882;
    //  PHYLLA_FUCKS: number = 883;
    //  TIMES_CORRUPT_MALE_ANT_ORGY: number = 884;
    //  TIMES_CORRUPT_FEMALE_ANT_ORGY: number = 885;
    //  PHYLLA_TIMES_DRIDER_EGG_LAYED: number = 886;
    //  DAYS_PHYLLA_HAS_SPENT_BIRTHING: number = 887;
    //  ANTS_BIRTHED_FROM_LICKING: number = 888;
    //  PHYLLA_COOLDOWN: number = 889;
    //  TIMES_EGG_IMPREGNATING_PHYLLA: number = 890;
    //  PHYLLA_DRIDER_INCUBATION: number = 891;
    //  PHYLLA_DRIDER_BABIES_COUNT: number = 894;
    //  PHYLLA_INHERITED_KNOWLEDGE: number = 900;
    //  PHYLLA_IZMA_TALK: number = 901;

    //  DIDNT_FUCK_PHYLLA_ON_RECRUITMENT: number = 925;

    public pregnancy: PregnancyStore;

    public constructor() {
        super();
        this.pregnancy = new PregnancyStore(kFLAGS.PHYLLA_VAGINAL_PREGNANCY_TYPE, kFLAGS.PHYLLA_DRIDER_INCUBATION, 0, 0);
        CoC.timeAwareClassAdd(this);
    }

    // Implementation of TimeAwareInterface
    public timeChange(): boolean {
        this.pregnancy.pregnancyAdvance();
        // trace("\nPhylla time change: Time is " + getGame().time.hours + ", incubation: " + pregnancy.incubation + ", event: " + pregnancy.event);
        if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] > 0 && rand(5) == 0 && this.flags[kFLAGS.ANT_KIDS] < 5000) this.flags[kFLAGS.ANT_KIDS]++;
        if (this.getGame().time.hours > 23) {
            // The pregnancyStore doesn't handle Phylla's ant eggs because they are continuous. The regular egg production is all handled here.
            if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] > 0) this.flags[kFLAGS.DAYS_PHYLLA_HAS_SPENT_BIRTHING]++;
            if (this.flags[kFLAGS.PHYLLA_GEMS_HUNTED_TODAY] > 0) this.flags[kFLAGS.PHYLLA_GEMS_HUNTED_TODAY] = 0;
            if (this.flags[kFLAGS.PHYLLA_STONES_HUNTED_TODAY] > 0) this.flags[kFLAGS.PHYLLA_STONES_HUNTED_TODAY] = 0;
            if (this.phyllaWaifu()) this.flags[kFLAGS.DAYS_PHYLLA_IN_CAMP]++;
        }
        return false;
    }

    public timeChangeLarge(): boolean {
        return false;
    }
    // End of Interface Implementation

    public phyllaWaifu(): boolean {
        return this.flags[kFLAGS.ANT_WAIFU] > 0;
    }

    public antColonyEncounter(): void {
        // WAIFU GET!
        // trace("ANT WINS: " + flags[kFLAGS.ANT_ARENA_WINS] + " ANT LOSSES: " + flags[kFLAGS.ANT_ARENA_LOSSES]);
        if (this.flags[kFLAGS.ANT_ARENA_WINS] - this.flags[kFLAGS.ANT_ARENA_LOSSES] >= 2 && this.flags[kFLAGS.ANT_ARENA_WINS] >= 4 && this.player.gender > 0 && this.flags[kFLAGS.PHYLLA_GEMS_HUNTED_TODAY] === 0) {
            if (this.flags[kFLAGS.PHYLLA_STAY_HOME] > 0) {
                this.bumpIntoTheAntColonyAfterStayHomePhylla();
            } else {
                this.antGirlGoodEnd();
            }
        } else if (this.flags[kFLAGS.PC_READY_FOR_ANT_COLONY_CHALLENGE] === 1) {
            this.antColonyChallenge();
        } else if (this.flags[kFLAGS.PHYLLA_SAVED] == 1) {
            this.enterTheColony();
        } else {
            this.firstAntColonyEncounter();
        }
    }

    private phyllaCapacity(): number {
        return this.flags[kFLAGS.PHYLLA_CAPACITY];
    }

    // First Encounter
    // [Explore Desert]
    private firstAntColonyEncounter(): void {
        this.clearOutput();
        this.spriteSelect(SpriteDb.s_phylla);
        this.outputText("While traversing an unfamiliar part of this desert wasteland, ");
        if (this.player.cor > 75 && this.player.lust100 > 50) this.outputText(" looking for something to slake your unquenchable lusts, ");
        this.outputText("you come across an abandoned merchant's cart.  The cart looks eerily disheveled, with a majority of its contents strewn about the sand.  Whoever or whatever deserted this thing did so in a hurry, and for seemingly no reason. Curious, you decide to inspect it for anything worthwhile.");
        this.outputText("\n\nSuddenly a loud crash erupts from inside the cart.  Instinctually you dive behind some large rocks, quickly re-evaluating the cart's dereliction.  The crash is followed by a clattering of sounds as if someone is stumbling around from within.");
        this.outputText("\n\nYou watch as a creature awkwardly climbs out the back of the wooden mess. As you've never seen anything like her before, you hold your position, deciding to watch before assessing the potential threat.  Quietly and stealthily, you shift position to get a better view of this ransacker.");
        this.outputText("\n\nYour eyes widen and your mouth hangs agape when you realize she has four arms!  Her two primary arms are attached at her shoulders, where you would expect, but a smaller set is attached to the sides of what you assume is her ribcage, just below the armpit.  All of her arms and legs are covered in shiny black chitin; the joints of her body seem to interlock with each other, giving her a very insectile appearance.");
        this.outputText("\n\nShe has an extremely lean and muscular frame, albeit one with wide, girly hips.  The muscles on her torso are clearly visible, though the coverings on her appendages make it impossible to assess the underlying body.  You feel safe in assuming she's fairly strong, however - judging by how she upturns the cart with ease to look under it!  She sports a slightly feminine face with thin lips and two completely emerald-green eyes.  You watch as she holds up trinkets and knick-knacks; curiously examining them at first, then indifferently discarding them.");
        this.outputText("\n\nHer abdomen seems to bend and bob with her hips as she rummages through the broken cart.  Every now and then she pulls a crude sundial from a carrying pouch about her hips and checks it laboriously against a flat surface, as if she's on some kind of deadline.");
        this.outputText("\n\nHer second set of arms blocks you from getting a full view of her chest, preventing determination of her cup size.  Though, you do get several pleasing partial views while she ransacks the cart...  Wearing almost no clothing probably isn't uncommon for her, judging how open she is with her nudity.  Her tan skin looks smooth as the sun glints off her black chitin plates. A small loincloth does its best to cover her genitalia, but with the gusting desert wind, the small garment is nearly useless.  The lips of her vagina appear to be as smooth as the rest of her skin, with no signs of hair - not surprising, when you consider her insect-like appearance.");
        this.outputText("\n\nHer short sandy-brown hair seems to be unkempt and in tangles, although a tarnished golden tiara with dangling gems catches the sunlight and gives the hair some style.  You wonder if she found the tiara while searching the cart, or if she had it before.");
        this.outputText("\n\nAs you consider your options, a group of demons crests the sand dune directly across from you.  Like you, they seem just as confused at the sight of the strange girl.  Unlike you, they make no effort to hide.  Once they see the ant-girl is alone, they quickly descend on the cart; the poor girl is taken completely by surprise.  Clearly she's never faced such a large group of demons before. The cracked flower vase she's holding her in hands shakes visibly as horror etches itself on her face.");
        this.outputText("\n\nYou could watch from where you're hiding, or you could play the hero and step in.");
        // [Keep Hidden]
        // [Play Hero]
        this.menu();
        this.addButton(0, "Play Hero", this.playHero);
        this.addButton(1, "Keep Hidden", this.keepHidden);
    }

    // ►[Keep Hidden]
    private keepHidden(): void {
        this.flags[kFLAGS.ANT_COLONY_KEPT_HIDDEN] = 1;
        // If Male/Female/Herm and Corruption & Libido Under 40 OR If Unsexed Leads to - If Under 40
        // If Male/[Use Dick - Herm] and Corruption & Libido Over 41 Leads to - If Over 41 - Male
        // If Female/[Use Vagina - Herm] and Corruption & Libido Over 41 Leads to - If  Over 41 - Female
        this.clearOutput();
        this.spriteSelect(SpriteDb.s_oasis_demons);
        // If Under 40
        if ((this.player.lib100 < 41 && this.player.lust100 < 50) || !this.player.isCorruptEnough(66) || this.player.gender == 0) {
            this.outputText("After seeing the large pack of demons you decide it's best not to act.  You yourself are in no condition to help the poor creature, and knowing full well what comes after demons 'subdue' their prey, you don't want to stick around either.  You glance over and realize the skirmish has already started.  It's too late to really help her anyway, you argue to yourself, plus she's covered in muscle.");
            this.outputText("\n\nAssuring yourself that she'll be fine, you take the opportunity to flee while the demons are distracted, heading back to camp.  Leaving the ant-girl to her fate.");
            // [End of Event]
            this.doNext(this.camp.returnToCampUseOneHour);
            return;
        }
        // ►(If Over 41 - Male)
        else if (this.player.hasCock()) {
            this.outputText(this.images.showImage("ants-desert-male-firstencounter"));
            this.outputText("You know exactly what's going to happen once the demons 'subdue' their prey.  The growing throbbing in your loins begs for release, and you quickly and quietly take off your " + this.player.armorName + ", making sure the demons don't notice you.  You might as well watch the show as you're not gonna be able to leave unnoticed until the demons are done anyways.");
            this.outputText("\n\nWatching from your hiding spot you start to stroke your " + this.player.cockDescript(0) + ".");
            // Start Dick Size Check
            const x: number = this.player.biggestCockIndex();
            // If player can auto-fallatio:
            if (this.player.cocks[x].cockLength >= 20) this.outputText("  Licking the head of your [cock " + (x + 1) + "] in anticipation of what's to come only adds to your growing lust.");
            // If player cock size tiny:
            else if (this.player.cockArea(x) < 6) this.outputText("  Though your cock isn't the most impressive, it's 'got it where it counts' and you intend to make the most of it.  You lovingly tease yourself until you're fully erect; running your fingers down the ridge causes a bead of pre-cum to form on your tip.");
            // If player cock size normal:
            else if (this.player.cockArea(x) < 12) this.outputText("  You hold your cock like the hilt of a sword and start to pump your shaft slowly.  Your breathing becomes heavier and labored, as you stroke yourself with mounting passion.");
            // If player cock size large:
            else if (this.player.cockArea(x) < 30) this.outputText("  The fear of having your cock give away your position quickly passes through your mind, but it's too late now.  The only way out of this is to cum, so you might as well enjoy it.  You firmly grasp your cock and start jacking off, hoping that you'll finish sooner rather than later.");
            // If player cock size MASSIVE:
            else this.outputText("  The towering meat log jutting from your crotch gives away your 'hiding' spot, but the demons don't seem to mind, as they're too busy with their new toy.  You doubt even if they did care that any of them would be able to satisfy you. You wrap your arms around your fully erect cock and start to pump, hoping to release your load soon.");

            this.outputText("\n\nThe ant looks like she's trying to resist, waving all four of her arms wildly and tossing whatever she can get her hands on at the demons.  After a quick, one-sided skirmish, the demons pacify her.");
            this.outputText("\n\nAn extremely handsome and well-endowed demon stands in front of her and presses his cock against her thin lips.  The ant pulls her head back in surprise, and looks confused.  Apparently she's never sucked a dick before - the thought sends a little thrill through you, and you wish briefly that it were your own penis pointing at her demure mouth.");
            this.outputText("\n\nOnce the demon realizes she's not getting the picture he grabs her hair and pushes his dick into her face, smearing her lips and cheek with his pre-cum.  As the girl still refuses to welcome his cock, he next grabs her neck and chokes her until she gasps for air.  Seizing the opportunity he shoves his dick deep into her throat.");
            this.outputText("\n\nYou're sure the ant would have screamed had her mouth and throat not been stuffed full of demon dick.  You can see the look of pleasure on the demon's face as he exhales.  The struggling ant-girl still hasn't given up hope of escape.  She tries again to wiggle free, but two more of the demons holding her take their cocks and place one each upper hand, forcing her to start stroking with their own.  The other arms become playthings of two female demons, who shove her smaller hands into their cunts.  After a few pumps she starts to get the idea; although you can tell she's obviously not experienced, she does her best to please all five demons at once.  The rest of the crowd watches from the sidelines, pleasuring their own genitalia.");
            this.outputText("\n\nThe demon getting the blowjob roars out in pleasure, then removes his cock from her mouth; the ant coughs up a small amount of the demon's bubbling seed, dribbling it on her chin and breasts.");
            this.outputText("\n\nGriping half-heartedly at how 'unfair' it is that he should cum first, the male demons in her upper hands decide to finish themselves off, abandoning technique and pistoning her hands up and down their shafts, then spilling their hot semen on the ant's breasts and face, to mingle with the first's.  The female demons begin making out with each other sloppily at the sight of the spilled seed, dipping their fingers in it and reaching between each others' thighs.  They rub their clits and lips as the ant's hands thrusting inside them overwhelms them, and with loud moans they finish in unison.  All five step back, allowing the rest of the demons who've been waiting to take their turn.");
            this.outputText("\n\nWatching from the rocky outcrop that hides you, you stroke [eachCock] with mounting excitement, running your hand up and down the shaft and picking up speed as you watch the demons cum one after another.  Seeing this girl get used as a cum depository is way hotter then what you imagined it would be.");
            this.outputText("\n\nRight when you're getting close to cumming yourself, you witness one of the demons flipping her onto her backside.  She quickly curls up like a spider, pulling all of her limbs inward and curling her abdomen up to her chest, in a vain attempt to protect her womanhood.  The demon says something to his friends you can't quite hear; the way some of the finished participants jump to obey gives you your first clue that here stands the leader of the group.  The subordinates help the scared ant 'open up', pulling her abdomen away from her stomach and spreading her legs apart; the main demon then places his massive meat musket on the lips of her vagina.  You can see her body, aroused by the musky seed and the sexual treatment, has already given its answer independent of her will; sunlight glints off the wetness between her legs.");
            this.outputText("\n\nThe leader drags his demonic head up and down along her slit, waiting for her libido to overwhelm her resistance to the idea.  You hear a very strange series of clicks that sounds like the last pleading of this poor rape victim.  Could she be a virgin?  With an audible scoff, the demon shoves his demonic member inside.");
            this.outputText("\n\nThe girl writhes and contorts but the other demons hold her firm, laughing at her discomfort.  There's no doubt in your mind now as to her virgin status, and your strokes pick up more speed.  You watch, rapt, as the first demon finishes inside her, eyes rolling back in his head.  Almost immediately, he's replaced by another, pride of place satisfied and the girl's now-despoiled vagina open to all.  One of the female demons sees her semen-spattered mouth no longer in use and places herself over the ant-girl's face.  Again, the ant fails to start pleasuring her captor immediately, either over-stimulated by the demon currently inside her or completely defeated by the loss of her virginity and resigned to being used like a toy.  The female demon grabs her victim by the sticky brown-and-now-white hair and shoves the ant's face into her cunt, then coos, pleased by the new sensations, and wraps a spaded tail around the girl's neck to lock her face there.  The demoness reaches down and, locating the ant's smaller set of hands, guides them up to her large, swollen clit and begins stimulating herself.");
            this.outputText("\n\nYou're almost ready to blow your load when a hermaphrodite demon with what must easily be a 20-inch prick steps up to the plate.");
            this.outputText("\n\nThe hermaphrodite struggles to cram itself inside the ant-girl and eventually succeeds.  With each stomach-contorting thrust you hear the ant's muffled moans of pain and ecstasy from between the legs of the female demon.  The hermaphrodite quickens his thrusts and, in turn, you keep speed.  With near-precision timing, you and the demon finish together.  " + this.player.SMultiCockDesc() + " throbs and a wave of euphoria washes over you.  Groaning in pleasure you release your ");
            // [no new PG, Start Cum Check
            if (this.player.cumQ() < 100) this.outputText("sizable");
            else if (this.player.cumQ() < 1000) this.outputText("huge");
            else if (this.player.cumQ() < 10000) this.outputText("massive");
            else this.outputText("titanic");
            this.outputText(" load.  Once you can refocus your eyes, you see the hermaphrodite pull out, and as it does a burst of cum sprays out of the ant-morph's vagina as her stomach deflates slightly.  She's been filled with so much corrupt seed that it's stretched her belly to the point it resembles a third-trimester pregnancy.");
            this.outputText("\n\nYour body satisfied, you drift off.  When you awaken much later, the demons and the ant seem to have moved on, thankfully without noticing you.  You put your armor back on and return to camp.");
            // [End of Event]
            // maybe lower libido and raise corruption, huh
            this.player.orgasm('Dick');
            this.dynStats("sen", -1, "cor", 3);
        }
        // ►If Over 41 - Female
        else {
            this.outputText(this.images.showImage("ants-desert-female-firstencounter"));
            this.outputText("Watching from your hiding spot, you consider what's going to happen and feel your pussy immediately moisten.  Your practiced hands move with deftness, slipping into your [armor].");
            this.outputText("\n\nFeeling your heat through your [armor], you quickly and quietly strip, every now and then glancing down to make sure you're not seen.  Once you're completely nude, you find a nice vantage point to view the impending rape.  By the time you've gotten yourself ready, you realize the demons have already started.");
            this.outputText("\n\nRunning your hands over your breasts, you pinch your [nipple] and give a soft coo, careful to keep your voice down.  Alas, your body's reactions start to overwhelm your senses and you slowly begin to forget that you're even trying to hide.");

            // Unique Prerequisites
            // If PC is lactating:
            if (this.player.lactationQ() > 100) this.outputText("  You feel your warm milk flow out of your hardened areola, as your body begs to release its sweet nectar.");
            // If PC has dick(s):
            if (this.player.hasCock()) this.outputText("  Feeling [eachCock] throb between your legs, you run one of your hands down your chest and start to stroke lovingly.");

            this.outputText("\n\nBlood still concentrating on your crotch, you set your fingers atop your vagina, resting lightly on your [clit], then rub the lips of your labia until your juices start to dribble down your legs.  In a slow circular motion you start to massage your clit as you watch the scene unfold before you.");
            this.outputText("\n\nOne of the demons is forcing his sizable cock down the helpless ant-girl's throat, while two more have begun to jerk themselves off using her upper hands as masturbation aids and yet another pair, female this time, force the ant to finger them.  You can clearly discern their moans and grunts even from your hiding place.  Hoping the mob won't hear you over the sounds already being made, you slide a finger inside yourself and add your moans to theirs.");
            this.outputText("\n\nThe demons force their new cum dumpster into a doggy-style position, laughing at her discomfort.  One of the many hermaphroditic demons distinguishes himself from the others as he grows erect, aided by a subservient who had been and still is trying to suck his impressive demonic cock; this demon saunters up to the ant-morph and licks his lips.  The hermaphrodite lifts the ant's chitinous abdomen and exposes her cunt; the ant-morph, who had all but given up struggling to free herself, suddenly starts to squirm again as her womanhood is exposed.");
            this.outputText("\n\nThe demon looks surprised briefly, then smiles devilishly as a sudden realization strikes.  Massaging his pendulous breasts with one hand, the demon begins to tease the ant's pussy with his demonic cock, a monstrous member at least 20 inches in length, dragging the huge head up and down the girl's entrance.  The ant, alarmed, begins to protest with a series of clicks and frantic flails, but when one of the female demons waiting on the sidelines sees the open mouth, she steps up and slides her cunt across the ant's face, quieting her.  Taking his cue from the demoness, the teasing hermaphrodite suddenly shoves his demonic dick, balls deep, into the ant's wet pussy.  You can see the stomach of the ant contort as the demon starts to pump, and both demons slap their hands together in a high five, clearly pleased with themselves.  The herm quickly yields to the pleasure, setting his jaw and pounding rapidly, and you slip several fingers inside yourself as you imagine what his cock must feel like.");
            this.outputText("\n\nThe hermaphrodite demon pumps faster and faster, building to release.  With a groan that even you can hear, he gives one magnificent back-arching thrust and releases his seed into the ant-girl's womb.  With a heavy sigh of satisfaction, the hermaphrodite's cock flops out of the ant along with a dribbling trail of cum and a little blood.");
            this.outputText("\n\nOnly now do you realize that the ant must have been struggling to preserve her virginity!  A little envious of the ant for having such a magnificent cock as her first, you jill yourself less and less carefully; you're close to your own climax, but try your best to hold out until the demonic group have all finished in turn.  By the time the third demon has ejaculated inside the ant-morph and the dribble of spunk from her used hole has increased to a rivulet, however, it's too much for you to withstand.  You begin rubbing your clit with one hand as your other seeks out your g-spot inside your drooling cunny.");
            this.outputText("\n\nWhen the next demon lines its cock up with the ant's vagina, you slip your fingers deep inside yourself.  Watching as the demon pumps, slowly at first but with mounting passion, you mimic his rhythm, imagining him inside you instead.  Your other hand's experienced fingers work quickly over your clit.  As your thoughts focus on your own fantasy, you see the demon throw back his head and give one final powerful thrust.  In answer, you pound your own fingers deep into your pussy, hitting your g-spot by sheerest luck.  Together you and the demon climax in blissful moans.  He yields his place to the next, while you yield your consciousness to the glow of sexual satisfaction and fall asleep.");
            this.outputText("\n\nWhen you awaken from the refreshing doze, you sit up and look from your hiding spot.  You must have been out longer than you thought, because the demons seem to have moved on.  All that's left is the ant-morph, lying in and still oozing a puddle of tainted semen, with hymen and possibly mind broken by the demonic orgy.  You quickly get dressed and head back to camp.");
            // [End of Event]
            // lib down, corr up
            this.player.orgasm('Vaginal');
            this.dynStats("sen", -1, "cor", 3);
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // ►[Play Hero]
    private playHero(): void {
        this.clearOutput();
        this.spriteSelect(SpriteDb.s_oasis_demons);
        // ►Introduction to Combat
        this.outputText("As the demons bear down on the ant-girl, you burst from your hiding place, raising your [weapon] to the air and uttering an impressive war cry.  Nobody, ant or otherwise, is getting raped if you have any say in the matter!");
        this.outputText("\n\nYou are now fighting demons!");
        this.startCombat(new DemonPack());
        this.monster.createStatusEffect(StatusEffects.phyllafight, 0, 0, 0, 0);
        this.doNext(this.playerMenu);
    }

    // ►Console ant-morph
    // After whuppin' demons!
    public consolePhylla(): void {
        this.clearOutput();
        this.spriteSelect(SpriteDb.s_phylla);
        this.outputText(this.images.showImage("ant-desesrt-console-phylla"));
        this.outputText("As the demons flee over the dunes, you gather your thoughts and survey the chaotic scene.  The woman you saved has taken refuge under the ruined cart, trying to conceal herself.  Her upper torso, at least, is 'hidden' inside it, but her large abdomen and black legs jut outward, giving away her poor attempts at stealth.  ");
        if (this.player.lib >= 50) this.outputText("After taking an eyeful of her smooth, enticing pussy, revealed in her current position by the inadequacies of her loincloth, y");
        else this.outputText("Y");
        this.outputText("ou walk over and tap on her shaking abdomen.  To your surprise, what you thought was skin is actually a series of skin-toned armor plates; very rigid and rougher than actual skin.  The ant flinches at your touch and shoots her head up, looking about wildly.  You watch as her large, almond-shaped eyes dart around, making absolutely certain that it's safe to come out of hiding.");

        this.outputText("\n\nSlowly, she crawls out from the back of the cart and stands facing you.  You guess she's about five and half-ish feet tall, and you can now make out her pair of perfectly firm B-cup breasts.  Curiously, her nipples are hard and stick out at least half an inch.  The interest excited by your examination must show on your face, as she blushes and quickly covers her breasts with her two larger arms - while the smaller ones hold her loin cloth in place.");
        this.outputText("\n\nNot wanting to be any ruder, you attempt to introduce yourself, but the ant-morph just tilts her head in incomprehension.  You begin a pantomime of physical gestures to convey who you are and why you're here, and after a minute or so of looking ridiculous, you suddenly see something click in the ant-morph's brain.  With amazing speed, she jumps on you, and before you can react, she plants a firm kiss right on your lips.  Your protest dies on your lips as a sudden rush of images floods your consciousness.");

        this.outputText("\n\nIt's as if your mind is being assaulted by memories that are not your own.  You see a large hill deep in the desert and an extensive network of dark caves.  Day flashes to night in your mind as you see silhouetted figures emerging from the hill and one stalking off into the wilderness.  When these last images fade from your mind, you feel a tug on your consciousness, as though you are trying very hard to recall a memory you had forgotten long ago. The tug quickly becomes a pull and within seconds you feel your own memories conjured up. The most important moments of your life are brought to the forefront of your mind's eye: flashes of your home, friends, and family; your mission and entry into this land; your humble campsite and the variety of monsters you've defeated; each is pulled from your mind in turn.  This sudden transfer of information is almost too much for you to handle, and right as you're about to pass out the ant-girl breaks the kiss.");
        this.outputText("\n\nYou stagger backwards and almost fall over completely, but the ant manages to catch you. Though she herself is thin, her four arms are surprisingly strong; they do little to help the disorientation, even so.  The world spins round and round as you struggle to shake off your vertigo and the girl lowers you to the ground.  Once your thoughts are collected enough to at least sit up unassisted, you find your new friend standing in front of you with a huge smile.  You feel an odd kinship from her, as though you've known her your whole life.  That can't be right; you shake your head again trying to clear your mind.  The female... ant-morph breaks into a sprint away from you and the cart, before you can ask her what just happened.  You would attempt to pursue, but she's very quick and you can yet hardly stand upright.  She leaves you surrounded by useless trinkets in a barren part of the desert and completely stunned as to what just transpired.  Although, looking around, you think you have a better idea of where you might be in the desert - you may even know how to find that large anthill you saw when the ant-morph kissed you.  Unconsciously you whisper a name quietly under your breath as you picture the scene: \"<i>Phylla...</i>\"");
        this.outputText("\n\nYou exhale a loud sigh.  This land is still full of surprises, even after all you've seen.");
        this.flags[kFLAGS.PHYLLA_SAVED] = 1;
        this.combat.cleanupAfterCombat();
    }

    // [Enter The Colony]
    // (Explore the Desert)
    private enterTheColony(): void {
        this.clearOutput();
        this.spriteSelect(SpriteDb.s_antguards);
        this.outputText(this.images.showImage("ant-desert-colony"));
        this.outputText("Wandering in the desert with your new, strangely eidetic memory, it's not long until you come across the large anthill.  If it hadn't been for the visions that were projected into your mind, you'd never have guessed anything like it could be hidden in such a harsh environment.  As you approach the hill, you get the familiar feeling you're being watched.");
        this.outputText("\n\nNearing the crest, you're taken by surprise as three large ants burst out of the sand via a cleverly-concealed trapdoor.  They're much bigger than the girl you saved but seem just as muscular and, except for their large almond shaped eyes and smaller noses, appear roughly human.  They have narrow jaw lines and much sharper cheek structures, making for very masculine faces.  Where the female's abdomen was skin-toned and seemed to have large angular plates, these ants have completely smooth black abdomens.  Two of them hold makeshift spears with obsidian tips in all four hands, while the other is using a very old and very blunt short sword.  These two quickly surround you, holding you at spear-point. The one with the short sword steps forward, almost pressing his face into yours as he sniffs you.  Over his shoulder, the spear-carrying ant in front of you makes a series of clicking noises to the others.  They appear annoyed, but lower their weapons.  All three walk over to the trapdoor and the two spear-bearing ants lift it.  The one with the short sword beckons you to follow him as he descends.");
        this.outputText("\n\nAs you climb down into the crepuscular cave system after your escort, the only light seems to be emitted from some kind of bioluminescent fungus that coats the walls. Your journey into the vast caverns and twisted caves of the colony leaves you very disoriented.  Luckily for you, your guide seems to know exactly where he's going; as you turn a sharp corner, you enter a massive excavated cave.  What you see therein is a complex network of tunnels in almost every direction and ants of all shapes and sizes going about their daily routine.  You would guess this is the central hub of this colony.");
        this.outputText("\n\nIn the middle of this massive hub, sitting on a 'throne' of sorts, is the only other female ant-morph you've seen in Mareth.  You're suddenly overcome with a feeling of deja vu, as if you've been here before... as if you've <b>lived</b> here before.  The 'queen', as your mind persists in regarding her, is much larger than any of the other ants; on top of that, her abdomen is almost twice the size of her own body!  As your guide leads you to meet her she arches her back and all her muscles tense up, but your uncertainty quickly evaporates as she relaxes; a small flood of clear gel and a small cylindrical egg emerges from the orifice on the end of her abdomen.  The egg is quickly gathered up by another ant emerging from one of the many tunnels and just as quickly carried back into it. The sword-bearing soldier gestures you toward the large female, then disappears into the caves. She looks you over, scanning you up and down.");
        this.outputText("\n\n\"<i>I am Queen Chylla.  Do you understand this?  Qu-een.  It's only recently I've learned this pathetic thing you call by the name of language.</i>\"  Her tone is that of a monarch being forced to address a peasant.  Clearly she doesn't think highly of you or your intelligence.  ");
        // [(corruption < 40)
        if (this.player.isPureEnough(40)) this.outputText("\"<i>'Champion', you've been sent to this land to resist the demons and your efforts thus far, insignificant though they be, have not escaped my gaze.  ");
        else this.outputText("\"<i>Despite your obvious taint, you seem to have retained your valor as the 'Champion' you proclaim yourself to be, and not as a rutting beast.  Something to be admired, for sure.  ");
        this.outputText("In saving my daughter, Phylla...</i>\"  She pauses and gestures, and the four-armed girl you saved from the demon horde walks slowly and shyly out of a nearby tunnel to stand next to her mother.  'Phylla' looks very embarrassed and is blushing deeply, avoiding eye contact from both of you by looking at the ground as Queen Chylla continues her dry monologue.  \"<i>... you have been chosen to become her potential...'mate'; much to my dismay.</i>\"  Wait, mate?  \"<i>My daughter has shown me how you saved her from the demons that inhabit this land.  Perhaps you were just lucky and caught them with their cocks in their hands while her back was turned?</i>\"");
        this.outputText("\n\nThe queen pauses momentarily, staring daggers at her daughter.  Chylla's gaze then darts to you, looking for all the world as if her knowledge were firsthand and her question rhetorical.  Phylla seems to shrink even further and continues to stare at the floor, not daring to rouse her mother's ire.");
        this.outputText("\n\nThe imperial address stops just long enough for you to notice another egg spilling out of the queen's abdomen.  She takes a deep breath and continues, as if nothing just happened.  \"<i>Though I do not expect you to truly understand the opportunity you've been given, I will now explain how the trials for my daughter's hand will work.</i>\"");
        this.outputText("\n\nChylla stands upright, and you see her muscles strain to lift her large abdomen.  Surprisingly, she's easily over 10 feet tall and is an impressive and very regal figure even with her distended backside - though, you suspect, not an agile one.");

        this.outputText("\n\n\"<i>We've captured some of the fiercest creatures from this land; mainly for study, but they can also serve as combatants in challenges. I've constructed an arena, of sorts.  It's there you must defeat these beasts in single combat. I will warn you now, many of my own warriors have attempted the trials and none of them have succeeded; some have even perished.</i>\"");
        this.outputText("\n\nShe pauses to let that sink in, as though hoping that it might deter you.");

        this.outputText("\n\n\"<i>When you're ready, make your way to the arena.  Good luck; I believe you will need it.</i>\"");
        this.outputText("\n\nThe ant queen gives you a dismissive wave with one of her larger arms, giving you reason to think her good will is anything but.  As you turn to leave, your eye catches Phylla's and she shyly smiles at you.  Her mother sees this and delivers a final, cryptic warning.  \"<i>One last thing before you depart, 'Champion'.  Should you fail, the consequences, for you, will be... dire.</i>\"");
        this.outputText("\n\nAs you mull over this ominous message, your guide reappears and leads you back through the maze of tunnels, to the exit of the colony.  You leave the anthill behind and head to camp, considering your best course of action.");
        this.flags[kFLAGS.PC_READY_FOR_ANT_COLONY_CHALLENGE] = 1;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // The Challenges
    private antColonyChallenge(): void {
        this.clearOutput();
        this.spriteSelect(SpriteDb.s_antguards);
        this.outputText(this.images.showImage("ant-desert-colony"));
        // (Random Encounter in the Desert)
        // Leads to - Introduction First Time
        // Leads to - Introduction Subsequent Times
        // Introduction First Time
        if (this.flags[kFLAGS.MET_ANT_ARENA] == 0) {
            this.outputText("Unbidden, your feet return you to the anthill from before; a soldier peers from under a trapdoor at you when you arrive, then swings it open wide and beckons you to descend.  As you enter the colony, you find that only one path is lit with the bioluminescent fungus, leading you down a predetermined route.  Even with the low light, it's still hard to see exactly where you're going, and you find yourself holding your hands out, like a blinded man, to make sure you don't walk into a wall.  You can hear scurrying and unintelligible chattering echoing from darkened hallways as you descend deeper into the colony.  Just as you convince yourself you've taken a wrong turn and consider turning around, you stumble onto a sharp curve in the path.  Bright light issues from beyond it.");
            this.outputText("\n\nYou guard your eyes and turn the corner.  As your pupils adjust you realized you've walked into yet another huge cavern that's been hollowed out by the ants.  The entire ceiling is covered with a huge patch of fungus, making it almost as bright as high noon.  Your eyes widen as you see an underground auditorium!  Though it appears to have been recently adapted to serve as a colosseum, the fixtures of the oval arena seem to be carved out of the very bedrock of the desert.  Looking up reveals a honeycomb-like series of stands and tunnels leading higher and higher.  This colosseum could easily fit hundreds of people, if not thousands.  As you step out into the cavern, you are greeted by a thin male ant-morph holding a clipboard in two hands and black charcoal sticks in the others. Glancing down to the clipboard you see many words - names, presumably - and all of them seem to have lines through them.  Two of them even have crude skulls next to them!  The last name on the list happens to be yours.  He notices you attempting to read the other names on his list and he pulls the clipboard to his chest.");
            this.outputText("\n\n\"<i>You mind?!  Can't imagine what the Princess sees in you,</i>\" he mutters, more to himself than to you.  He pauses to look you up and down.  Judging skill based on appearance seems to be common for this race.");
            // Silly Mode:
            if (this.silly()) this.outputText("\n\n\"<i>Oh, I'm sorry; you're not on the list.</i>\"  You tell him that if your name doesn't appear on the list quickly, he'll find himself on the side of the road with nothing but his ass to sell to get back here.");
            // Else if strength over 50:
            else if (this.player.str > 50) this.outputText("\n\n\"<i>Well, you certainly look the part.  But you're going to need more than brute strength to win here.</i>\"");
            // Else if intelligence over 50:
            else if (this.player.inte > 50) this.outputText("\n\nYou make a witty quip about how he might be making puppy eyes at someone who saved him from a horde of giant demon cocks, too, but he doesn't receive it well.");
            this.outputText("  After a moment he looks down and scribbles something on his chart.");
            this.outputText("\n\n\"<i>So, we're ready to start when you are.</i>\"");
            this.flags[kFLAGS.MET_ANT_ARENA]++;
        }
        // Introduction Subsequent Times
        else {
            this.outputText("Your feet bring you back to the ant colony and the guard motions you down the only lit tunnel once more.  You enter the colosseum, and as you step out into the cavern, you are greeted, again, by a thin male ant-morph holding a clipboard.  He looks up at you.");
            this.outputText("\n\n\"<i>Oh good, you're here.  I was beginning to think you were a coward.</i>\"  Before you can respond to his insult, he cuts you off.  \"<i>We're ready to start when you are.  Let's hope you survive longer than the last guy.</i>\"");
        }
        // [Fight] [Leave]
        this.menu();
        this.addButton(0, "Fight", this.antColiseumFight);
        this.addButton(14, "Leave", this.leaveAntColony);
    }

    // ►[Leave]
    private leaveAntColony(): void {
        this.clearOutput();
        this.outputText("Deciding to better prepare yourself first, you inform the thin fight manager that you will return later.  You leave the colony, heading back to camp.");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    private antColiseumFight(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("ant-desert-coliseum"));
        // ►[Fight #1]
        if (this.flags[kFLAGS.ANT_ARENA_WINS] + this.flags[kFLAGS.ANT_ARENA_LOSSES] == 0) {
            // (Tentacle Beast - Intro)
            this.spriteSelect(SpriteDb.s_tentacleMonster);
            this.outputText("You tell the fight manager you're ready.  He nods and leads you down into one of the two staging areas of the arena.  You watch through the bars as the stadium fills quickly.  Although pretty much every ant face looks identical to you, the larger ones who are clearly warriors stand in stark contrast with the smaller ones that must be the workers - or maybe they're just younger; you can't tell.  Watching them gather for the impending fight, you confirm the suspicion you formed when you first saw the queen's chamber: every ant-morph except the princess and the queen is male!  Gazing out into the crowd you spot the two royal personages sitting in a special area that appears to be reserved for them.  The shy princess's gaze nervously drifts toward your room and for a moment your eyes meet.");
            this.outputText("\n\nAs you raise a hand to wave, you're stopped as you hear the sounds of a shambling and banging from across the arena.  A large silhouetted beast is poked and prodded into the staging area across from you. You narrow your eyes, trying to get a glimpse of your opponent. As you do, the gates of the staging areas drop and a very angry and enraged tentacle beast thrashes out into the center of the arena.");
            this.outputText("\n\nYou're fighting a tentacle beast!");
            this.startCombat(new TentacleBeast());
            this.monster.createStatusEffect(StatusEffects.NoLoot, 0, 0, 0, 0);
        }
        // ►[Fight #2]
        else if (this.flags[kFLAGS.ANT_ARENA_WINS] + this.flags[kFLAGS.ANT_ARENA_LOSSES] == 1) {
            // ►(Minotaur - Intro)
            this.spriteSelect(SpriteDb.s_minotaur);
            this.outputText("When you arrive in the colosseum, you tell the fight manager you're ready; he nods and leads you down into one of the two staging areas for the arena.  You watch through the bars as the stadium fills almost to capacity, still resistant to the idea of so many ants living right under the sands; there must be hundreds.  Gazing out into the cheering crowd, you spot the royal family sitting in their reserved area.  The princess waves at you excitedly with two of her arms, but her mother grabs them and lowers them.  Chylla herself looks as regal and reserved as ever.  You catch the queen smiling at you, but there's something wicked behind the smile.  Before you can contemplate what it might be, the gates raise on both sides of the colosseum and you are pushed out.");
            this.outputText("\n\nYou're now fighting a minotaur and it's wielding a Giant Axe!  You quickly put two and two together and realize Chylla has set you up by arming the minotaur!  You brace yourself as the beastman charges you, roaring wildly.");
            this.startCombat(new Minotaur(true));
            this.monster.createStatusEffect(StatusEffects.NoLoot, 0, 0, 0, 0);
        }
        // ►[Fight #3]
        else {
            // (Gnoll - Intro)
            this.spriteSelect(SpriteDb.s_club_gnoll);
            if (this.flags[kFLAGS.MET_ANT_ARENA_GNOLL] == 0) this.outputText("With due ceremony, the manager leads you down to one of the staging areas for the arena.  You watch through the bars as the stadium fills far past capacity.  There must be a thousand ants here... maybe even the whole colony.  Gazing out into the crowd, you pick out the royal seating and in it, Princess Phylla.  The princess is in much finer attire than you're used to seeing - her chest is actually covered by a fine red and blue dress and her hair is combed, framing her face nicely.  Her mother is nowhere to be seen, and you can tell that Phylla is taking full advantage.  She waves and cheers for you just like the crowd is and, perhaps by her orchestration, you hear the crowd pick up a chant in your name.  Seeing Phylla chant with them makes you feel invigorated.  As the gates raise, you charge out into the center of the arena, roaring your finest battle cry; your opponent is taken somewhat aback but finds resolve and braces for your charge.");
            // ►(Gnoll - Intro Repeat - for people that lost once)
            else this.outputText("You move through the network of tunnels and caves and come to the colosseum once more.  You are greeted by the event manager and he ushers you down to one of the staging areas for the arena.  The noise intensifies as the colosseum fills to the brim with spectators; Phylla herself is up in her box waving to you.  You look across the arena floor and the gnoll at the other side of the arena seems just as excited to fight as you are.  The gates open and you charge each other!");
            this.outputText("\n\nYou're fighting a gnoll!");
            this.flags[kFLAGS.MET_ANT_ARENA_GNOLL]++;
            this.startCombat(new Gnoll());
            this.monster.createStatusEffect(StatusEffects.NoLoot, 0, 0, 0, 0);
        }
        this.monster.createStatusEffect(StatusEffects.PhyllaFight, 0, 0, 0, 0);
        this.doNext(this.playerMenu);
    }

    // (Tentacle Beast - Win) Standard Tentacle Beast Win Scene. (Again we're going to need to adapt the ending so the PC does not go back to camp.)
    public phyllaTentacleDefeat(): void {
        this.clearOutput();
        this.spriteSelect(SpriteDb.s_antguards);
        this.outputText("\n\nAs you leave the arena, you are met by Princess Phylla and a large group of warrior ants; the princess is looking at the ground and twiddling her lower set of thumbs.  As you clear your throat to announce yourself she jumps and makes a strange noise that sounds like a mix between a click and 'EEP!'.  She blushes and looks at the ground again, searching for something to say.");
        this.outputText("\n\n\"<i>I'm happy you won,</i>\" she finally manages, more to the rocky earth than to you.  \"<i>Let me help you recover, I mean, if you want...</i>\"");
        this.outputText("\n\nYou give her a nod and she sets to work. She nervously dresses your wounds by using some strange paste and strips of cloth.  You try to make small talk but find it awkward under heavy guard.  Clearly you're still not welcome here.  Once Phylla's done, all but one of the guards disappear with her into the tunnels.");
        this.outputText("\n\nYou recognize the remaining guard as the guide from your first time here. At least, so you think - the only distinguishing factor is the old rusty blade he holds.  He waits patiently as you redress, then leads you out of the colony.");
        // (Player Recovers 10 Fatigue)
        this.player.changeFatigue(10);
        // (+1 Win Score)
        this.flags[kFLAGS.ANT_ARENA_WINS]++;
        this.combat.cleanupAfterCombat();
    }

    // ►(Tentacle Beast - Loss) Standard Tentacle Beast Loss Scene.
    public phyllaTentaclePCLoss(): void {
        this.clearOutput();
        this.spriteSelect(SpriteDb.s_antguards);
        this.outputText("After your defeat in the arena, you set off to leave but are stopped.  Princess Phylla is standing with a troupe of armed guards by the exit, holding a vial of clear liquid.  She doesn't look like she wants to give it to you but she extends it to you all the same.");
        this.outputText("\n\n\"<i>You lost... so you have to drink this.  I mean... I'm sorry.</i>\"");
        this.outputText("\n\nYou look at the vial inquisitively but the warriors don't look like they're going to budge until you consume the liquid.  You uncork the bottle and drink the whole thing, like a shot.  Remarkably it doesn't taste like anything.  The clear liquid is a little more viscous than water, but doesn't have much else in the way of texture.  Though you were expecting something awful to happen to you, you don't even feel any different.  As you hand back the empty bottle, the guards part to let you leave.  Although, oddly, you find yourself not really wanting to, you shake your head and return to camp.");
        // (+1 Loss Score)
        this.flags[kFLAGS.ANT_ARENA_LOSSES]++;
        if (this.flags[kFLAGS.ANT_ARENA_LOSSES] > 3) {
            this.antastrophyBadEnd();
            return;
        }
        this.combat.cleanupAfterCombat();
    }

    // ►(Minotaur- Win)
    public phyllaBeatAMino(): void {
        this.clearOutput();
        this.spriteSelect(SpriteDb.s_antguards);
        this.outputText("As you exit the arena, amidst the cheers and roars of the crowd, you are met by Princess Phylla and slightly fewer guards than the last time.  She sees you coming and her face lights up, then runs over to you and starts doting over you. You smile and let her do her thing.  Once she's done, she looks deep into your eyes.");
        this.outputText("\n\n\"<i>I... I w-was wondering... I mean...</i>\"  She raises her head to yours and just as you assume she's about to kiss you, one of the guards grunts loudly, interrupting the moment.  He then motions her to follow him into the tunnels.");
        this.outputText("\n\nYou hear someone else clear their throat behind you, and turn to see your guide, his trusty rusty blade at his side.  He simply shows you to the exit of the arena before turning and walking away.  Apparently he trusts you enough to see yourself out?  You follow the lit tunnel back to the surface.");
        // (Player Recovers 10 Fatigue)
        this.player.changeFatigue(10);
        // (+1 Win Score)
        this.flags[kFLAGS.ANT_ARENA_WINS]++;
        this.combat.cleanupAfterCombat();
    }

    // ►(Minotaur- Loss)
    public phyllaPCLostToMino(): void {
        this.clearOutput();
        this.spriteSelect(SpriteDb.s_antguards);
        this.outputText("After your staggering defeat and subsequent humiliation in the arena two guards approach you as you try to leave.  One of them holds out a small vial.  Princess Phylla is off in the corner of the room crying, and you try to move closer to her but one of the guards steps in front of you.  \"<i>Drink!</i>\" he commands, uncorking the vial.");
        this.outputText("\n\nIt's strange... you don't care for the idea of being commanded by an ant, but you find yourself indifferent now that you smell the liquid.  You drink the whole thing in one go; it has no taste or texture and afterwards you don't feel any different.  The guards tell you to leave again, though you don't really want to.  Looking around you, you muse that you would be completely contented with staying underground here for a while... maybe forever, if you had to!  One of the guards, however, pushes you towards the exit, causing you to stumble a bit until you catch yourself.  Before you leave, you glance at where Princess Phylla was watching you, but she's already been removed by the other dutiful guards.  You head up the path to the surface, and from there back to camp.");
        // (+1 Loss Score)
        this.flags[kFLAGS.ANT_ARENA_LOSSES]++;
        if (this.flags[kFLAGS.ANT_ARENA_LOSSES] > 3) {
            this.antastrophyBadEnd();
            return;
        }
        this.combat.cleanupAfterCombat();
    }

    public phyllaPCBeatsGnoll(): void {
        this.clearOutput();
        this.spriteSelect(SpriteDb.s_antguards);
        // ►(Gnoll - Win First Time)
        if (this.flags[kFLAGS.ANTS_PC_BEAT_GNOLL] == 0) {
            this.outputText("As you stand over your defeated opponent and the red mist of combat fades, you finally become conscious of the crowd.  Everyone is cheering, and some are even throwing gems into the arena at your feet.  You hold your [weapon] up to the sky proudly, only making them erupt in greater roars and whistles.  As you make your way out, Phylla greets you, doting over every cut and scrape, as maternal as always.  You smile and let her do her thing.  The usual guards don't seem to be around, but you suppose they're lurking just out of sight.");
            this.outputText("\n\n\"<i>You're the most amazing champion I've ever met,</i>\" the girl says.  \"<i>I mean, not that I've met many; you're actually the first.  Er, the first I've ever talked to...</i>\"  She seems to stumble around the words - you're not sure if she's just shy or if she's unused to speaking; both, maybe.  Clearly she doesn't have a chance to talk with outsiders often.");
            this.outputText("\n\nGingerly, you raise a finger and put it to her lips, shushing her, then flash her a wink and a grin.  She blushes slightly and returns the smile.  There's no time for more than that, as two guards arrive; one to reclaim her and the other - your rust-wielding guide - to escort you out.");
            this.flags[kFLAGS.ANTS_PC_BEAT_GNOLL]++;
        }
        else if (this.flags[kFLAGS.ANT_ARENA_WINS] - this.flags[kFLAGS.ANT_ARENA_LOSSES] >= 2 && this.flags[kFLAGS.ANT_ARENA_WINS] >= 3 && this.player.gender > 0) {
            this.getGame().inCombat = false;
            this.flags[kFLAGS.ANT_ARENA_WINS]++;
            this.antGirlGoodEnd();
            return;
        }
        // ►(Gnoll - Win Repeat) Standard Gnoll Win Scene. +
        else {
            this.outputText("This isn't the first time you've accomplished this, but it still brings the crowd to their feet.  You simply stand in the center of the arena, taking it all in.  Phylla makes her way to you, blushing as the rowdy audience follows her with catcalls and demands for her to give her champion a kiss.  She tends to you as always and, when she's done, takes your hand in hers and looks at you expectantly.  You smile at her, brushing the hair from her face with your other hand; she colors deeply at the contact as two guards appear to lead you both off.  Having no more reason to stay, you allow your guide to return you to the surface.");
        }
        // (+1 Win Score)
        this.flags[kFLAGS.ANT_ARENA_WINS]++;
        this.combat.cleanupAfterCombat();
    }

    public phyllaGnollBeatsPC(): void {
        this.clearOutput();
        this.spriteSelect(SpriteDb.s_antguards);
        // ►(Gnoll - Loss First Time) Standard Gnoll Loss Scene. +
        if (this.flags[kFLAGS.ANTS_PC_LOST_TO_GNOLL] == 0) {
            this.flags[kFLAGS.ANTS_PC_LOST_TO_GNOLL]++;
            this.outputText("You lie on the arena floor, listening to the crowd boo you and cheer the gnoll.  After enough time to recover yourself, you stand up and start to head to the exit.  Four guards block the way and one of them presents you with a vial of mysterious clear liquid, motioning for you to drink.  They appear disinclined to let you leave without doing so, and as you peer down into the uncorked vial, a strange tingle in the back of your head tells you not to worry.  You drink it in one gulp and the guards tell you to leave.  You are completely oblivious of Phylla crying to herself as you stroll past her.");
        }
        // ►(Gnoll - Loss Repeat)
        else {
            this.outputText("The crowd boos you loudly as you exit the arena.  As you do so, four guards block your path; one of them presents you with a vial of mysterious tasteless liquid.  \"<i>Drink!</i>\" he booms at you.");
            this.outputText("\n\nYou quickly grab the vial and drink its contents, irritated at being crowded by the ants.  After drinking it however, the feeling lessens somewhat.  You look at the vial absently, then shake your head.  The guards move aside and you step past them; you look around a bit for Phylla but don't see her.  Not having any reason to stay, you return to the surface.");
        }
        // (+1 Loss Score)
        this.flags[kFLAGS.ANT_ARENA_LOSSES]++;
        if (this.flags[kFLAGS.ANT_ARENA_LOSSES] > 3) {
            this.antastrophyBadEnd();
            return;
        }
        this.combat.cleanupAfterCombat();
    }

    private antastrophyBadEnd(): void {
        this.clearOutput();
        this.spriteSelect(SpriteDb.s_antguards);
        this.outputText("As you go to leave the arena queen Chylla and four bodyguards approach you.");
        this.outputText("\n\n\"<i>Come with me, it's time you join our colony.</i>\" Chylla states dismissively.  You want to leave but at the same time, the idea of being underground helping the colony grow is something you never considered to be an option.");

        this.outputText("\n\nThe queen continues in her dry tone. \"<i>As I suspected, you have proven yourself inadequate for surviving on the surface world, much less a fitting suitor for my daughter's hand.  The only way you can survive in this world, is with us. Come.</i>\"");
        this.outputText("\n\nConsidering the options of fighting your way out or just joining willingly, you choose the latter.");
        this.outputText("\n\nYou're half dragged, half shoved deeper into the colony than you've ever been, accompanied by an escort of armed muscular warriors, and Chylla.  Eventually you arrive at a room that looks a small step up from a prison cell.");
        this.outputText("\n\n\"<i>Welcome to your new home [name]. Your meals are to be delivered every 4 hours. You will eat, every morsel.  Is that understood?</i>\"");
        this.outputText("\n\nBefore you can even respond she continues.");

        this.outputText("\n\n\"<i>Any attempt to leave this room without my express permission will result in your death. When I choose to allow you out, you are to not talk to my daughter. In fact, I forbid you from ever making contact with her in any way... Farewell 'champion'.</i>\" Chylla turns and leaves, leaving you in your room. Once you hear the sounds of footsteps completely fade you take a step to leave, seeing as there's no bars or barriers to stop you. As you reach your 'door frame,' you're suddenly reminded that you're not fit for the surface. The queen was right, you muse. Perhaps this is what's best for you, at least you'll be safe here. Looking at your new room you get the strange feeling that you're finally at home. You've been traveling and searching and finally found what you're looking for. Gazing out your doorway you come to the realization that even if you wanted to leave you would be completely lost in the maze like structure of the colony. You chuckle to yourself, how silly of you to think to escape.");
        this.outputText("\n\nAfter a few hours daydreaming of what Chylla might task you with, a small ant brings you a small clay cup filled with the clear liquid that the vials were filled with. Wordlessly, he extends it to you. Accepting the cup you thank him with a pat on the head as he skitters off. Drinking deep, the liquid glides down your throat. A sudden feeling of safety and warmth covers you as the liquid hits your stomach. After you've completely drained the contents of the cup you feel a strange thankfulness for everything you've been given, even if it's only a small room. It's the best room you've ever had and you never want to leave it.");
        this.outputText("\n\nDays past of the same routine. An ant comes, gives you a cup and sometimes some food then disappears back into the tunnels...");

        this.outputText("\n\n<b>Epilogue</b>\n");
        this.outputText("You live out the rest of your days in blissful ignorance, helping the colony in any way you can. Mostly you're used as an experimental sex toy. They force you to drink an uncountable number of different potions and elixirs. Eventually you start to beg for more as your mind and body crave the sexual liquids. Oftentimes Chylla even puts you in the arena, sometimes to pleasure yourself in front of the whole colony or calling upon you to service as many males as you can please at once. Sometimes you're a male, sometimes you're a female, and sometimes both. Your mind becomes completely consumed with pleasing the colony in any way you can. You never get to see the outside world or Phylla again, but you don't care. You're busy pleasing every cock placed in front of you. As long as you're helping the colony grow and become strong, nothing else matters to you.");
        this.getGame().gameOver();
    }

    // Good End
    // Good End / Waifu Content
    private antGirlGoodEnd(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("ant-desert-kissing"));
        this.spriteSelect(SpriteDb.s_phylla);
        this.flags[kFLAGS.PHYLLA_CAPACITY] = 50;
        this.outputText("As you turn to leave, something is different; the crowd seems unusually silent. Phylla swiftly climbs down from her seat and jumps into the arena.  You glance warily at the gnoll but it's already being dragged out.  Phylla runs to you, and gives you a massive hug, wrapping all four of her arms around you and squeezing as hard as she can.  Her open display of affection leaves you more than a little shocked, given the creaking and soft cracking of bone in your body.  Interlocking her fingers with yours, she turns and raises your hands in the air, proclaiming your victory to every ant in the colony.  The awed crowd suddenly erupts, filling the stadium with cheers for your victory.  She turns towards the exit and tugs on your sleeve.");
        this.outputText("\n\nPhylla drags you blindly through myriads of unlit tunnels until you reach the Queen's chamber, where Chylla seems to be awaiting you. Though, something is different than the last time you saw her; she's dressed just as regally as Phylla is, but it appears more...  formal.");
        this.outputText("\n\n\"<i>Phylla seems to have been right about you. You are as smart as you are strong.  Though I had my doubts, you are truly something special.  You have my blessing to start your own colony with Phylla, should you choose to.</i>\" Chylla turns to her daughter and nods some kind of silent message.  You're not sure if the Ant-Queen has really warmed up to you, or she's just saying it because she must in her role as Queen, bestowing a great honor on someone she detests.  Whatever the reason, Phylla seems ecstatic about what's to come next.");
        this.outputText("\n\nPhylla pulls you off to a private chamber.  Unlike the passages that run through the colony, this one is actually lit, allowing you to follow behind Phylla as the two of you enter her quarters.  You assume this is the Princess' room judging by the layout; there's a small stone bed with some sheets neatly folded and a few multi-colored silk pillows strewn about the floor.  In the center of the room there's two larger cushions with a golden bowl in between them.  It looks like her room has been set up for some kind of ritual.");
        this.outputText("\n\nOnce Phylla sees you've taken it all in, she sits you on one of the large cushions and plants herself on the one across from you.  She pulls out a vial of clear liquid and pours it into the golden bowl that sits on the floor between you.  The color of the liquid changes as soon as it makes contact with the bowl, refracting the light as a prism would.  As the rainbow-tinged light spreads, so does the sweet smell of flowers, emanating from the golden bowl.");
        this.outputText("\n\n\"<i>I'm happy you're with me, for this.  I mean, you do want to be with me, right?</i>\"  You nod, although you're not entirely sure what 'this' is.");
        this.outputText("\n\nA huge smile grows on Phylla's face.");
        this.outputText("\n\n\"<i>This is going to feel strange for you, at first.  I mean, after too... but not during...  I mean-</i>\" She looks away from you bashfully.  \"<i>It will be strange for me too.  It's my first time, so I'm not really sure what's going to happen myself, I mean, I just...</i>\"  The nervous Princess stammers out.");
        this.outputText("\n\nYou're not really sure what to do or say in this situation, but you quickly put two and two together.  It seems Phylla wants to take the lead, as she crawls over the incense and presses her body to yours.  You take a deep breath as her earthy smell mixes with the sweet scent of flowers.  Your bodies start to move on sexual instinct, as you hear your new lover's deep breathing in your ears.  Your lips press lightly against her neck as your arms wrap around her.  Lightly dragging your nails down her back, you seek to test the waters.  Phylla shudders in your arms, a small moan escaping her mouth in response.  As your small kisses move up her neck and across her cheek, your lips meet hers, her tongue pushing into your mouth as your caress begins to deepen, and you feel a wave of emotions wash over you.");
        this.outputText("\n\nAs you look into her eyes and your lips lock together, you feel as if you're a single mind. It's one of the strangest feelings; you can feel... what she's feeling.  As you run your hands over her body you feel your own motions as if you were the recipient.  It's almost thrilling in a way, knowing exactly how your touch feels on another.  You smile wickedly as you lay her down on the cushioned pillows.");
        // Use Penis - Male Continuation
        // Use Vagina - Female Continuation
        this.menu();
        if (this.player.hasCock()) this.addButton(0, "Use Penis", this.gigititigitigitigitigityAntGirl);
        if (this.player.hasVagina()) this.addButton(1, "Use Vagina", this.femalePhyllaFirstFuckGooooo);
        this.addButton(3, "Not Now", this.declineAntSexForNow);
        this.addButton(4, "Reject", this.rejectAntSex);
    }

    // Put off the sex for now.
    private declineAntSexForNow(): void {
        this.clearOutput();
        this.outputText("Your mind finally fires up and shake your head. You just tell her that today just isn't the right day.");
        this.outputText("\n\n\"<i>I... I understand.</i>\" She looks down and pauses in silence then looks back at you, smiling nervously and resumes, \"<i>Please, come back anytime.</i>\"");
        this.outputText("\n\nYou reassuringly tell her and plant a kiss on her lips then get yourself redressed and make the departure back to your camp.");
        this.flags[kFLAGS.PHYLLA_GEMS_HUNTED_TODAY] = 1; // Dirty checking for disabling the ant temporarily for 1 day.
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Reject sex. This disables further encounter.
    private rejectAntSex(): void {
        this.clearOutput();
        this.outputText("Your mind finally fires up; she's not worth your time. You quickly dart off towards the door, leaving Phylla heart-broken.");
        this.outputText("\n\n\"<i>What are you doing? I mean... You won't?</i>\" She looks down, tears leaking from her eyes.");
        this.outputText("\n\nYou have a feeling that you won't see her again.");
        this.flags[kFLAGS.ANTS_PC_FAILED_PHYLLA] = 1;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // ►Male Continuation
    private gigititigitigitigitigityAntGirl(): void {
        this.clearOutput();
        this.outputText("Sporting a painfully obvious tent, your body betrays its desire for sexual gratification and it causes Phylla to smile with interest.  \"<i>I-I didn't think I had that ability to... to...  I mean I'm not like you, so I thought...</i>\" she begins, but trails off as she takes in the rough, obscured shape given off by your bulge.");
        let x: number = this.player.cockThatFits(this.phyllaCapacity());
        if (x < 0) x = this.player.smallestCockIndex();
        // ***Dick(s) size less than 36 inches:
        if (this.player.cockArea(x) < 36) {
            this.outputText("\n\nHer delicate face wears an expression of utmost curiosity.  She seems to be interested in your outline but unsure of what to do with it. As if she's never... then you recall her saying it's her first time; she's a virgin!");
            // PC has more than one dick:
            if (this.player.cockTotal() > 1) this.outputText("\n\nShe probably won't be able to handle ONE, let alone all of your " + this.player.multiCockDescriptLight() + "!");
        }
        // ***Dick(s) size more than 36 inches, but less than 72 inches:
        else if (this.player.cockArea(x) < 72) {
            this.outputText("\n\nThe constant bobbing and twitching of your " + this.player.multiCockDescriptLight() + " is apparently not obvious enough to her that your trousers aren't built to accommodate the size of your loins.  You grimace in response as the fabric of your pants become painfully constrictive and unyielding. Snapping out of her inexperienced musings, the Ant Morph sees your obvious predicament.");
            this.outputText("\n\nIn an effort to get your loins free she rushes in, all four of her arms working feverishly to help spring you free.  After a quick flurry of motions, your " + this.player.multiCockDescriptLight() + " snap out of your britches; the size of which apparently intimidates the Ant Morph, whose eyes go wide.  \"<i>H-Ho- How am I... wow...</i>\"");
            // PC has more than one dick:
            if (this.player.cockTotal() > 1) this.outputText("\n\nShe probably won't be able to handle ONE, let alone all of your " + this.player.multiCockDescriptLight() + "!");
        }
        // ***Dick(s) size more than 72 inches:
        else {
            this.outputText("\n\nThe fabric of your pants simply cannot contain your " + this.player.multiCockDescriptLight() + " any longer as you frantically tug and yank at the button, trying to get your loins free before you injure yourself or ruin a good pair of trousers. Phylla's absent mindedness comes to an abrupt end when she sees your face flush with red and fury as you desperately work to free yourself.");
            this.outputText("\n\n\"<i>I-I've never... is that... your...  I mean...</i>\"  You give her a quick, serious look as you continue to fidget with your trousers.  \"<i>Eeep! Let me help you!</i>\"");
        }
        this.outputText("\n\nToo late!  With a final groan and a rip, your pants give way to the force and power of your quickly hardening " + this.player.multiCockDescriptLight() + ", sending a cursed button flying asunder from your waistline. The button connects with Phylla's forehead with a mighty 'thwack' and careens off her skull.  Fortunately for you, and her, she's more fixated on what's coming out of your pants rather than the pants themselves.");
        // Dick Size huge:
        if (this.player.cockArea(x) >= 72) {
            this.outputText("\n\nDespite the early warning, [eachCock] bursts outward and slams into her shoulder blade. \"<i>Ahh~tk!</i>\" She clicks, more in surprise than pain.  She rubs at her bruised shoulder, somewhat shocked that someone could possess THAT kind of ability.  \"<i>Oops</i>\", you playfully apologize.  Phylla looks completely awestruck and doesn't seem hear you as her large eyes are fixated on your enormous member");
            if (this.player.cockTotal() > 1) this.outputText("s");
            this.outputText(".");
            // LOGIC FUNCTION
            // Dick Size massive (first time male fuck, LF1): (It/They) swing downwards at her,
            // causing her to unleash a surprised scream as she scrambles out of the way. Narrowly avoiding being smashed by the brutish, fleshy cudgel that is your loins as it swings downward in what arguably could have been a debilitating injury for Phylla.
            // PC has more than one dick:
            if (this.player.cockTotal() > 1) this.outputText("\n\nOverwhelmed by the sight of ONE of your members, Phylla arguably goes catatonic when she sees all of what your packing.  She probably won't be able to handle the one, let alone all of your " + this.player.multiCockDescriptLight() + "!");
            // Tentacle dick check for Dick Size Huge and Massive
            // One penis longer than 8 feet, or two or more dicks that are 5 feet long:
            if (this.player.countCocksOfType(CockTypesEnum.TENTACLE) > 0) {
                this.outputText("\n\nAt your whim, you command your tentacle dick");
                if (this.player.countCocksOfType(CockTypesEnum.TENTACLE) > 1) this.outputText("s");
                this.outputText(" forward and wrap them tightly around Phylla, taking her hand and tugging her in close.");
            }
            // (****See these two options? One is where your dick isn't huge, one is where it is huge.****)
            this.outputText("\n\nOpting to josh her a bit, you release your cock");
            if (this.player.cockTotal() > 1) this.outputText("s");
            this.outputText(" from around her and hang it in front of her face, grinning your antics on your face as Phylla stares at ");
            if (this.player.cockTotal() == 1) this.outputText("it");
            else this.outputText("them");
            this.outputText(", slightly intimidated.");

            this.outputText("\n\n\"<i>W-What is that?  I m-mean... don't tell me you're THAT big!  There's gotta be something for you to... \"put\" in me, right?...</i>\"  You see her peek around your cock");
            if (this.player.cockTotal() > 1) this.outputText("s");
            this.outputText(" looking for something more sizeable.  You can tell Phylla is more scared of what might happen to her than what might happen to you.");

            // END DICK CHECK
        }
        this.menu();
        // If PC has dick(s) that will fit: Jump to - Regular Male Scene Continuation
        if (this.player.cockArea(x) <= this.phyllaCapacity()) {
            this.addButton(0, "Next", this.malePhyllaContinuation, x);
        }
        // If PC has dick(s) that won't fit: Jump to - Cunnilingus Scene Continuation
        else {
            this.addButton(0, "Next", this.cuntmuffinLingusPhyllaDickBig);
        }
    }

    private malePhyllaContinuation(x: number): void {
        this.clearOutput();
        this.outputText(this.images.showImage("ant-desert-first-male-vagsex"));
        this.outputText("Phylla stares down at your " + this.player.multiCockDescriptLight() + " and starts nervously rubbing her hands together.  \"<i>It's my first time... I mean, I hope it isn't going to be bad for you...</i>\" she says, before trailing off; uncertain of her sexual prowess.");
        // Corruption less than 75:
        if (this.player.isPureEnough(75)) this.outputText("\n\nYou assure her that she shouldn't worry so much about her first time.");
        // Corruption more than 75:
        else this.outputText("\n\nYou think to yourself that her pussy better be tight and pleasurable.  You didn't risk your life for 'royal' sub-par snatch.");

        this.outputText("\n\nYou tug ");
        if (this.player.cor < 75) this.outputText("playfully");
        else this.outputText("forcefully");
        this.outputText(" at her royal dress, wickedly commenting about how this will have to come off.  You hook a hand in the folds of her clothing and begin to slowly pull upwards, allowing the silk-like fabric of her royal vestments to slide easily off her.  You've never had to take the clothes off of something with four arms before, but you manage.  As you remove her bra you drag your hand along the ridge of her breasts, causing the Princess to moan softly; she doesn't stop you, instead allowing you to continue in your efforts to bring her to a sexual boil.  You work your dexterous hands down her toned stomach but before you can reach between her legs she stops you.");
        this.outputText("\n\n\"<i>I want... I mean... just like this...</i>\"  Tossing her clothes aside, Phylla guides you around to behind her.  \"<i>This, is how... I mean... how... my kind mate.</i>\"");

        this.outputText("\n\nOnce you're behind her, Phylla bends over in an effort to present herself to you.  Her abdomen makes it a bit awkward, but you manage to find a comfortable position.  Leaning over Phylla, you move your mouth to her neck and let your heavy breath warm her supple skin.  Phylla unconsciously moves her head to the side, giving you a much better angle to allow the heat of your essence to wash over her.  You start to nibble her neck as you run your hands across her pelvis and chest, sliding close to her B-cup breasts before snaking away.  Your explorative efforts yield a sweet spot by nibbling along her earlobe, causing Phylla to arch her back and softly hum her approval.  While teasing her with your mouth, you work a hand down to her clit");
        // PC is goo morph:
        if (this.player.isGoo()) this.outputText(", leaving traces of your slimy lust along her body for her to wear, allowing your detached bits of mass to ignite her sexual fires");
        this.outputText(".");
        this.outputText("\n\nOnce you reach the top of her vagina you feel her tense up, the insecurities she harbors flowing like water into your mind.  You whisper something sweet in her ear to ease her uncertainty, the words sending a shiver down her body and making her shake in bliss as your passion ignites her need for your carnal attention.  Another weak and stuttered moan escapes from her mouth, and you can hear her whisper to you.");
        this.outputText("\n\n\"<i>Enough teasing,</i>\" she manages between moans.");
        this.outputText("\n\n\"<i>I... think... no, I'm ready... please...</i>\"");

        // Corruption more than 75:
        if (this.player.cor >= 75) this.outputText("\n\nWell, you wanted her wet and eager like drought-ridden crops during a rain storm; now it's time to \"reap\" your efforts.");

        this.outputText("\n\nLying against the assortment of cushions she's fashioned into a bed, Phylla glances back at you eagerly; her amateurish sexual demeanor and giddiness shine through her like light through pitch darkness.  She seems somewhat aware of this, but not as much as before; with her mind and body wholly consumed by lust, she longs only for your voice, your touch, and your inevitable penetration of her quivering form.");

        this.outputText("\n\nTrembling ever so slightly, her dripping ");
        if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] > 0) this.outputText("nipples and ");
        this.outputText("wet vagina betray her timidness.  You move up along the bedding and brush your " + this.player.skin.desc + " against her own tender flesh.  Finally, you come to rest in the perfect position for penetration, Phylla looking over her shoulder at you with longing eyes and eager lips.  As you slide your tongue inside her mouth, you feel her twitch at the foreign sensation.  Closing her eyes, Phylla instantly melts like butter as your tongue finds hers of its own volition; clearly a turn for the better for you.  Phylla finally relaxes her legs and spreads them apart; the foreign sense of humid heat from her genitals registering as it warms your nethers.");
        // (Radar note:
        // Because Phylla is a virgin, I wouldn't go past 2 inches total width for two dick penetration; you're taking her virginity, so that will be painful enough.
        // @FEN: Please note the following coding calls for two dicks that are less than two inches in total width.)
        this.outputText("\n\nSimply dragging your " + this.player.cockDescript(x) + " along the entrance her of moist pussy causes her to moan and wiggle under you. Parting her pink little lips with the head of your cock, you finally hit the sweet spot for penetration. With ");
        if (this.player.cor < 75) this.outputText("a gentle amount of force, ");
        else this.outputText("an uncaring, brutish amount of force, ");
        this.outputText("you push past the tight opening of Phylla's folds.  You hear Phylla inhale sharply as she stretches to accommodate your width. In what seems to be a prolonged amount of time, you finally manage to ease the head of your " + this.player.cockDescript(x) + " into her.  The act takes a loud and pained turn as Phylla moans and shifts in obvious discomfort.  You feel her squeeze her vaginal walls tightly around your cock as her considerable strength almost cuts off blood flow.  After a moment, Phylla realizes how much pressure she's exerting and her body relaxes, realizing the potential for injuring her partner.  Sighing heavily, she moves her hips down to take even more of you in. As you slide further in, her eyes flash with pain as she bites down on her lip, it becomes glaringly clear that something has yielded inside of Phylla.");
        this.outputText("\n\n<b>You have taken Phylla's virginity!</b>");
        // Corruption less than 75:
        if (this.player.cor < 75) this.outputText("\n\nHolding yourself still, you stare down at Phylla and inquire as to whether she is okay.");
        // Corruption more than 75:
        else this.outputText("\n\nUndeterred, you soldier on and breach further into her depths, barely giving her any time whatsoever to prepare herself for the onslaught of hard dicking that is to come.  The loss of her cherry and innocence is not up on your list of concerns right now.");
        this.outputText("\n\n\"<i>I'm okay- GUH! No, re-really I'm fine!</i>\" she stammers out behind half winced eyes.  You can tell she's trying to look past the obvious pain, eager to savor every moment of this ultimately fleeting \"first-time\".  You continue to touch all of her most sensitive spots, trying to replace the pain you're inflicting with softer pleasure.");

        this.menu();
        // (Jump to Corruption less than 75 - Pure Ending)
        if (this.player.cor < 75) this.addButton(0, "Next", this.phyllaFirstTimePureBabiesFuckEnding);
        // (Jump to Corruption more than 75 - Corrupt Ending)
        else this.addButton(0, "Next", this.phyllaCorruptMascEnding);
    }

    // PURE ENDING!
    private phyllaFirstTimePureBabiesFuckEnding(): void {
        this.clearOutput();
        if (!this.player.canOvipositSpider()) this.outputText(this.images.showImage("ant-desert-male-first-pure-vagsex"));
        let x: number = this.player.cockThatFits(this.phyllaCapacity());
        if (x < 0) x = this.player.smallestCockIndex();
        this.outputText("For a while, you allow Phylla to slowly adapt to your presence inside of her and the stretching of her vaginal walls; something she reacts to with soft moans of pleasurable appreciation.  She wears her obvious discomfort at being forcefully stretched by your " + this.player.cockDescript(x) + ", but you see she can hardly complain as her body cradles yours in an attempt to keep you where you are.  Once you feel she's comfortable you start slowly pumping away at her, gradually building your own rut.");
        this.outputText("\n\nYou feel the smaller set of her hands move between your [legs] and start to fondle your ");
        if (this.player.balls > 0) this.outputText("[balls]");
        else this.outputText("sensitive taint");
        this.outputText(".  The moans that escape her lips pick up in both volume and stress as she knowingly encourages your lustful efforts on.  The working of her hips in concert with your thrusts affirms her readiness for your full force, giving you the all clear to pin her down and free your sexual aggression on her tight little love hole; slamming your cock into her, picking up the force and tempo behind each thrust.");
        this.outputText("\n\nPhylla's own sporadic moaning begins to mimic your movements, increasing in sync with each hard thrust into her.  The many soft, delicate hands of the ant morph cling to the bedding and tighten with each gyration, intent on not letting go until you both achieve your mutual satisfaction.");
        this.outputText("\n\nPhylla abruptly connects her mouth to yours with another fierce kiss, darting her tongue in your mouth and against yours, slapping it around with surprising ferocity as your saliva intermingles. Your carnal pleasures suddenly begin to mix and intertwine with something... else.  It dawns on you that Phylla has initiated her \"link\" once more; Pleasures, of your own and your lover, are shared between you both instantaneously.  The primal need to guide your " + this.player.cockDescript(x) + " deeper into her passes from her mind to yours.  With this new shared perception you feel the walls of her vagina sending pulses down your shaft, washing you in waves of pleasure.  Her long clit drags along the shaft of your cock, causing her to arch her back again and again.  Your thrusting comes to a rapid staccato as your hips and hers work together in shared concert.  Yet, you can feel her grasping and understanding your rut; your need to work your cock just right along her depths.  Your need to penetrate her as hard as you can as you both build your orgasms.  Your feeling of the uncontrollable, primal urge to inseminate her love canal and breed her to bear your young.  You unknowingly make a snarl and grind your teeth together as you pound away at her, too consumed by animal like lust to notice.");
        this.outputText("\n\nAt this tempo, it's not long before your mind is suddenly bombarded by unfamiliar warnings.  It's a mix of yes and no, go and stop, pleasure and pain; and you revel in what exactly what it's receiving.  Thankfully the mixed messages from Phylla are understood within a few moments as she abruptly clamps down hard with her whole body and braces for what is to come.  With a girlish little howl, Phylla can't resist it anymore and climaxes.  You can feel the sweet smelling, and very wet release of her lady fluids on your genitalia.  Nearing your own orgasm, you begin to thrust at just that right angle, her vagina seemingly begging for you to release inside her.  It's when your " + this.player.cockDescript(x) + " is deepest inside her that she sends a fleshy quake down her vaginal walls.  As if that wasn't enough; you feel a whispering in your mind beckoning you to flood her with your seed.  You feel a distinct pull on your consciousness; as if impregnating her would fulfill her every need, her very destiny to become a mother.  This emotional crescendo is too much; you can't ignore it, can't control, or bear it any longer.  You arch your back, giving one final rock crushing thrust as your " + this.player.cockDescript(x) + " reaches its deepest point inside her.  Grunting fiercely, you cum inside her, firing your ");
        if (this.player.cumQ() < 50) this.outputText("thin");
        else if (this.player.cumQ() < 500) this.outputText("hefty");
        else this.outputText("thick");
        this.outputText(" ejaculate far into her womb.  Phylla responses in kind, working her hips and squeezing your body with her legs in an almost milking fashion, trying to draw as much seed as she can into her womb.");

        this.outputText("\n\nWith the last of your strength you pull out of Phylla and watch as almost none of your semen spills out of her.");
        // If cum milliliters over 100:
        if (this.player.cumQ() >= 100 && this.player.cumQ() < 1000) this.outputText("  Truly amazing considering how much your loads usually contain.  You think you see a little bulge in her stomach that wasn't there before.");
        // If cum milliliters over 1000:
        else if (this.player.cumQ() >= 1000) this.outputText("  As you look down at her nethers your mind struggles to understand just how she could... then looking up her body, you see.  Her belly is bloated with your sperm, almost to the point of already looking pregnant.");

        this.outputText("\n\nSpent, you drop your head down next to Phylla's, panting and breathing heavily as you resign yourself to rest.  Bits of the link remain as you feel Phylla's contentment.  She strokes your head lovingly, and pats her stomach.  Clearly her thoughts dwell on the package you just deposited inside her.  With the sync quickly fading you probe her mind one last time.  You can almost feel the sensation of your hot, sticky semen as it clings heavily on her vaginal walls.  A warm feeling flows over you as the excited thoughts of you getting her pregnant on her first try, making her a mother at long last... or so Phylla seemingly hopes.  Finally you sense at long last the closeness and intimate bond that she feels she shares with you at this very moment.  A sense of not wanting to let go, and wanting the breeding that has just past to continue forever and ever.  She yearns to pop out as many children as her body will allow her to and fulfill her need to breed.");
        // PC is a Female/Herm Drider:
        if (this.player.canOvipositSpider()) {
            this.outputText("\n\nThis overwhelming maternal feeling brings forth an interesting idea!  Turning to Phylla, you tell her that you can help to make her desire come true.  She looks at you a bit taken back, as if what you already did wasn't enough already.");
            this.outputText("\n\nYou go on to explain, telling her that your body is chock full of eggs that eagerly await a willing host to gestate in.  If she wants to birth as many children as possible, your union can grant her wishes; albeit, she will be birthing both Ant and Spider children.");
            // Persuade Phylla: Random chance of failing, affected by INT level and whether she's already housing eggs in her vagina.
            if (this.player.inte / 20 + rand(20) + 1 < 16) {
                // Persuasion failure:
                this.outputText("\n\nPhylla ponders for a moment and shakes her head.  \"<i>I'm sorry [name], I'm not comfortable with that right now.");
                // (If player has already impregnated Phylla:
                if (this.pregnancy.isPregnant) this.outputText("  I just can't hold anything else inside me. I'm sorry! Please don't be mad... I mean I will!  Just a-after... this batch...");
                // (If player has not impregnated: I mean...I just don't feel comfortable with that right now...
                this.outputText("</i>\"\n\n\"<i>Maybe later though...</i>\"");
                // End of persuasion failure
            }
            // Persuasion success:
            {
                this.outputText("\n\nWith some hesitation and consideration, Phylla ponders for a bit on the idea of being a brood mother in more than one way.  With a shy smile, Phylla reluctantly agrees to house both of your children.  \"<i>H-How will we do this?  I mean, I've never seen or heard of anything mating with a Drider before... M-my eggs come out of my abdo~ ...</i>\"  She inquires.");
                this.outputText("\n\nYou raise a finger to her lips and tell her to lie down against the bed and to relax.  You know exactly where her eggs come out of.  The image of Phylla dropping eggs out of both her vagina and her abdomen makes you want this all the more.");
                // If PC corruption over X:
                if (this.player.cor >= 75) this.outputText("  Little does poor Phylla know, you're going to just use her as a baby maker to ease the tension of your own sacks.");
                this.outputText("\n\nIn uncertain anticipation, Phylla heeds your directions and lies down, her back on the bed with her abdomen in the air.  You help pose her in the right position; angling her pussy towards you as you clamber along the bed. Coming to rest on top of Phylla, you take her soft face in your hands and kiss her, firmly holding her against you as you work your ovipositor against her vagina.");
                this.outputText("\n\nShe compresses her arms around you as you work your way into her and begin to release your lubricating fluids.  Phylla moans into your mouth as the secretions tickle her pleasure centers.  Through the link, you tell her to get ready as you feel the first of many eggs working their way down your ovipositor and into her pussy.");
                this.outputText("\n\nShe squints and braces for the inevitable egg forcing its way into her, gasping as the oval mass finally makes contact and works its way into her.  You can feel the egg as it makes it way into Phylla, stretching her pussy out to accommodate future deposits as the frontrunner hits her cervix, and manages it to make its way inside.");
                this.outputText("\n\n\"<i>UGH! It hurts... a little~ feels so strange... I-mea~ good!</i>\" she cries out.");
                this.outputText("\n\nYou comfort her while telling her that you have a few more on the way; something that causes Phylla to beam with pride at the thought of being filled with so much new life that she will eventually birth.  Egg after egg slides into Phylla, causing her stomach to bulge bigger and bigger with your brood as you stuff more into her.  At last, the final egg is laid inside of Phylla, and with a loud pop, you  retract your ovipositor from her love hole;  you know it'll recover in time.  Phylla rubs her belly and gleams with delight, filled with her lover's future children that will help the colony to grow strong.");
                this.player.dumpEggs();
                if (!this.pregnancy.isPregnant) this.pregnancy.knockUpForce(PregnancyStore.PREGNANCY_DRIDER_EGGS, 8 * 24); // Supposed to be eight days, not eight hours
            }
            // (End Drider Continuation)
        }
        this.outputText("\n\nThe link fades not long after you both have settled down, and Phylla hums her approval as she kisses your neck lovingly.  You smile back, but never knew how strong one's maternal instincts could really be.  Hearing primal drives that are not your own was almost deafening.  Yet, you can't help but feel an appreciation for such an understanding that has been shown to you.");
        // PC has other waifus:
        if (this.camp.loversCount() > 1) this.outputText("\n\nSo this is what your other lovers must feel.");
        this.outputText("\n\nYou drift off to sleep not long after, while Phylla demonstrates her appreciation for the intimacy you two just shared, kissing your body and rubbing you sensually as you doze off.");
        this.player.orgasm('Generic');
        this.menu();
        this.addButton(0, "Next", this.waifuQuestOver);
    }

    // Corruption greater than 75 (Corrupt Ending):
    private phyllaCorruptMascEnding(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("ant-desert-male-first-corrupt-vagsex"));
        this.outputText("For a few moments longer, you pump yourself hard against her rump in an attempt to \"break\" your new fucktoy in.  Once you're satisfied that she will be able to handle what is to come, you take to sliding yourself along against her fuckhole as you grab her by the hair.  The backside of her abdomen grinds along your ");
        if (this.player.tallness >= 72) this.outputText("chest");
        else this.outputText("belly");
        this.outputText(", but it will only serve to help you.  You will need a brace for what you're about to pull and her rigid abdomen will do just fine.  Phylla makes a confused noise, glancing over her shoulder with a look of concern growing on her face.");
        this.outputText("\n\n\"<i>W-What are you doing?</i>\" she asks nervously. \"<i>This isn't how I imag~</i>\"");
        let x: number = this.player.cockThatFits(this.phyllaCapacity());
        if (x < 0) x = this.player.smallestCockIndex();

        this.outputText("\n\nWithout letting her finish, you plunge your " + this.player.cockDescript(x) + " into her, causing her to yell out in sheer surprise and discomfort.  \"<i>This is how <b>I</b> mate!</i>\" you inform her, telling her that she won't EVER forget her first time with you.  Her mouth goes open slightly before your subsequent gyrations put an end to whatever she was going to sputter out.  Smirking like a mad jester at the position you have Phylla in, you begin to work your hips as you dominate her from behind.  You hear your ");
        if (this.player.balls == 0) this.outputText("thighs");
        else this.outputText(this.player.ballsDescriptLight());
        this.outputText(" slap loudly off of her rump with every aggressive thrust against her clit.  She wails out in frustration at the lack of intimacy that you apparently have in mind.  The moaning that is mixed into her pathetic protests, however, suggests that the naive little woman is getting off on being treated so roughly; a hard slap on the ass affirms this as she whines out in annoyed pleasure.  You feel the growing heat from her pussy as it gets wetter and wetter, continuing your pressure on her abdomen as you use it to support your brutal fucking of her cunt.");
        // PC has Goo Body:
        if (this.player.isGoo()) this.outputText("  Perhaps the poor dear could use some tender attention, you ponder to yourself.  Reducing the solidity of your body, you work her abdomen deep into your sticky, goopy body, re-solidifying once she's firmly in there and lowering your hands down to her nipples, pinching them hard as you continue your pumping of her rump.");
        this.outputText("\n\nPoor Phylla can only grasp at her cushions as she struggles to maintain her comfort.  The brutish drilling of her pussy forces her to lift her rear further and further towards an acute angle. Try as she might, her efforts are no match for your barbaric tactics as you pound her love hole into oblivion.  All her attempts at maintaining a comfortable position quickly evaporate, and she resigns herself to being roughly taken from behind.  You watch as she buries her head into her cushions to muffle her howls of painful ecstasy.");
        // PC has more than one cock that is suitable:
        let y: number = this.player.cockThatFits2(this.phyllaCapacity());
        if (this.player.cockTotal() < 2) y = -1;
        if (y >= 0) {
            this.outputText("\n\nIntent on increasing your own pleasures, you decide to work ");
            if (this.player.cockTotal() > 2) this.outputText("one of your free cocks");
            else this.outputText("your free cock");
            this.outputText(" against her tight ass. Feeling this new intruder, she turns back to you.");
            this.outputText("\n\n\"<i>No... P-please, you can't... I mean...</i>\" she manages to protest between moans of ecstasy and cries of pain as your cock works its way deeper with each thrust.  Scoffing at her plea, you guide your other cock into her anus.  It was never her choice to make in the first place, you tell her.  You feel the tightness of her muscular butt squeeze around your shaft - it's not as tight as her cunt is but it'll do!  You continue to thrust your hips as your cocks fill both of her holes.  You hear more muffled, painful moaning as you pound away along her anus.");
            this.outputText("\n\n<b>You have taken Phylla's anal virginity! And you love every second of it.</b>");
            // PC has more than one cock that is over 25 inches that's not in Phylla's butt or vag:
            if (this.player.biggestCockArea() > this.phyllaCapacity()) {
                this.outputText("\n\nSeeing as how her hands aren't busy and she's certainly not using that mouth for anything useful; you reach down and guide one of your cocks so it presses against her down turned stomach.  You tell her to press it between her breasts and start sucking at the head.  Though this doesn't stop you from pounding away at her backside. She quickly grabs your [cock biggest] with her smaller hands and guides for a better position between her breasts.  She uses her upper hands to press her breasts together.  You immediately feel the effect of her B-Cups as with each thrust they warm the shaft of your long cock.");
            }
        }
        this.outputText("\n\nYou maintain your vice-like pressure on her abdomen as you press onward, forcing your member");
        if (y >= 0) this.outputText("s");
        this.outputText(" deep within her.  You further your power and control over Phylla, in a way that seems to convey to Phylla to let it all out, don't hold back, to have her completely resign herself to you.  The unconscious move unleashes a loud series of lust-filled gibberish from Phylla.  You feel her body fold to your will as she abandons her shyness and restraint, mashing her rump against you with the intent to rut along with you like two primal animals intertwined in savage mating.  You can't see it, but you taste her hunger to be bred; you can feel and visualize her attractive, beet red little face wearing her passion as she clenches her teeth, your instincts and consciousness completely taking her over and commanding her to hump and fuck your cock until she gets what her cunt hungers for.");
        this.outputText("\n\nThe minutes that follow are hard for either of you to accurately remember.  The sweating of your bodies as they grind against each other.  The smell of your coupling filling the air...  Phylla moaning out like a cheap whore who's getting paid in gold bars... the increasing noisy crescendo of flesh as you rapt, your pelvis against her pussy.  All of it is but a murky blur of fierce, barbaric lust before the final release.  As you near orgasm, you can hear something in your head... something foreign... something warning Phylla that you will lead to her downfall.  Pleading with her to get away from your corruptive taint...  the instantaneous cockblocking voice of concern is quickly drowned out in a loud series of unmuffled wails and moans as Phylla nears climax.  You ignore the strange pleas but you aren't sure if she heard it or was she was the one thinking it.  The distraction gone, you continue thrusting wildly against her.");
        this.outputText("\n\nWith a roar that would cause even gods to notice, you explode into her.  Your cock");
        if (this.player.cockTotal() > 1) this.outputText("s twitch, ");
        else this.outputText(" twitches, ");
        this.outputText("ushering forth your corrupted seed into her womb");
        if (y >= 0) this.outputText(" and her ass.");
        else this.outputText(", and onto the bedspread below.");
        this.outputText("  As her pulsing cunt works to suck the semen out of your ");
        if (this.player.balls > 0) this.outputText("balls");
        else this.outputText("shaft");
        this.outputText(", Phylla retaliates with her own orgasm, flooding your groin with her sticky girl cum.  You glance down to your joined nethers and find a massive amount of Phylla's cum has pooled around your knees and more seems to be flowing every second.  Clearly, she's a squirter.");

        this.outputText("\n\nPhylla's wailing becomes muffled once more as she drives her face back into her pillows. Taking a deep breath you clear the orgasmic high from your mind.  You manage to calm down, and with a loud 'slack' sound, you dismount her.  Whatever link there was between you two is now thankfully broken.  Laying back you consider the 'warning' you felt, as Phylla curls up next to you.  You ponder what will happen to Phylla if she continues to mate with you?  Will she turn into a mindless slut that exists solely for your carnal desires?  Will she allow the corruption of you to take root and control her life?  Or maybe you should take a good look at yourself and see if what you're becoming is truly something you want.");
        // Sillymode:
        if (this.silly()) this.outputText("\n\nYou remember an old saying: \"<i>Those who fuck monsters are doomed to fuck monsters</i>\".  No, that's not right.  \"<i>Those who are monsters are doomed to fuck monsters?</i>\"  No, that's not it either.  Oh well.  You're sure it has something to do with something fucking something else.  A good analogy for your time here in Mareth.");
        // Corruption is greater than 80:
        this.outputText("\n\nPerhaps corrupting her is the best route; look how you turned out! You could live with that...!  Giggling, you smirk at the thought of Phylla's mother; how she was right about you the whole time.  The thought of what kinds of corruption you can inflict on Phylla fill your mind until you finally drift off, holding your unsuspecting victim in your arms.");
        this.player.orgasm('Dick');
        this.dynStats("cor", 1);
        this.menu();
        this.addButton(0, "Next", this.waifuQuestOver);
    }

    // Cunnilingus Scene: (Triggered if PC does NOT have a dick that is suitable for vaginal sex with Phylla.)
    private cuntmuffinLingusPhyllaDickBig(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("ant-desert-male-first-cunning"));
        this.outputText("Sadly, as you gaze down at your " + this.player.multiCockDescriptLight() + ", you realize that trying to penetrate Phylla with your freakishly large prick");
        if (this.player.cockTotal() > 1) this.outputText("s");
        this.outputText(" isn't going to work.  Phylla's eyes begin to tear up as she also comes to the realization that her first time is a non-starter.");
        this.outputText("\n\nNot wanting to leave her virgin night a bust you playfully push her back onto the cushioned floor, causing her to land bottom first.  Confusion washes over her as she struggles to understand what you are planning to do; something that's further exacerbated when you lay down next to her.  Awkwardly you roll over on your back, doing your best not to knock over any furniture in the process.");
        this.outputText("\n\n\"<i>W-What are you doing?</i>\" she asks, somewhat upset that she won't be getting the traditional first time sex.  Arcing your " + this.player.multiCockDescriptLight() + ", you ");
        // Dick Size Over 48 but Under 69 inches:
        if (this.player.longestCockLength() < 69) {
            this.outputText("angle your hips so that ");
            if (this.player.cockTotal() == 1) this.outputText("it points");
            else this.outputText("they point");
            this.outputText(" at the ceiling, placing them out of the way for what you have in mind.");
        }
        // Dick size Over 70 inches::
        else {
            this.outputText("angle your hips so that ");
            if (this.player.cockTotal() == 1) this.outputText("it is");
            else this.outputText("they are");
            this.outputText(" aimed out the doorway.");
        }
        this.outputText("  You wickedly beckon Phylla over to you with a hooked finger.  Phylla looks at you quizzically for a moment before it dawns on her.  Her eyes widen and cooing she scrambles over to you.");

        this.outputText("\n\nPhylla giggles in relief at both her inexperience and embarrassment over not being able to take a hint.  Disrobing as she walks towards you, her hips and abdomen swaying sensually, you can see her long clit sticking out of the folds of her pussy.  Clear strands and drops of her wetness glean from between her legs.  You see her lower set of arms disappear between her legs as she moves around you.  Phylla then emerges above your head.  Her hips shift and come to a stop with her facing outward on top of you, the warmth of her moist cunt washing over you, and you clearly seeing her long inviting clit, begging you to lick at her button.  You reach up and take hold of her chitinous legs.  You slowly drag her hips down and press your mouth against the smooth folds of her labia.  The intoxicating aroma of her scent fills your nostrils, causing your eyes to roll back in your skull.");
        this.outputText("\n\nLooking down she places her larger set of hands on your shoulders, and playfully shoves you back against the bed.  Ruefully, Phylla reaches down toward your face with one of her smaller hands, as if wanting to show you something.  Her small hand is covered in what appears to be her own love juices.  Holding you in place, she gently places her hand on your cheek and slowly glides her lathered fingers along your chin, leaving a small trial of sweet smelling nectar.");
        // Silly Mode:
        if (this.silly()) this.outputText("\n\nYou hear her whisper \"Simba\", as she rubs her fingers across your brow.  You inquire as to what that means; as it awkwardly broke the tension you were building.  She tells you it means \"Silly\" in her native tongue. You raise an inquiring eyebrow in response.");
        this.outputText("\n\nSighing, Phylla gestures to your enormous cock.  Clearly she's still depressed you're unable to penetrate her properly.");
        this.outputText("\n\nTo finish up her teasing, she runs her fingers down the bridge of your nose ending on your lips. The scent and warmth of her essence again is starting to drive you crazy.  You feel your already hard cock stiffen even further, driving your body into a rut as you inhale her sweetness.  Your inhumanly large cock");
        if (this.player.cockTotal() == 1) this.outputText(" switches and bobs");
        else this.outputText("s switch and bob");
        this.outputText(", loudly brushing against the ");
        if (this.player.longestCockLength() < 69) this.outputText("ceiling");
        else this.outputText("wall in the hallway");
        this.outputText(".");
        this.outputText("\n\n\"<i>I didn't think... that would work...</i>\"  Phylla whispers sweetly into your ear, grinning like a fool.");
        this.outputText("\n\nPulling her hands away from your shoulders, Phylla gives you a small nod and smile, signaling the go ahead for you to claim her pussy for your own.  You waste little time in doing so as you dart in and seize a portion of her labia in your lips.  Above you, Phylla makes a girlish gasp as you make contact.  Two of her hands caress your hair as the other two hold your head in place while you eat her out.  Grinning, but still holding her labia in your mouth, you drive your tongue into her, unleashing a series of quick flicks inside of her as you eat her out.  The very taste of her insides drives you even further into your rut.  It's then you feel a very blunt object sticking you in the nose as your tongue probes deeper and deeper into Phylla.  You realize her clit sticking out almost 2 inches past its hood, the long pink rod pleading for attention.  You reach up with your hand and give it a good pinch between your fingers. In immediate response Phylla moans loudly and squeezes your head between her legs.");
        // PC has goo body:
        if (this.player.isGoo()) this.outputText("\n\nA thought enters your head and fills your mind with images of her grinding furiously against your face.  Realizing that she'd probably appreciate a firm \"base\", you work some of your mass up her legs and cradle her lower body into your own slightly thinned and warped mass.  Phylla looks down in surprise as she sees what you're doing, but hums approvingly once she figures out what you have in mind.");
        this.outputText("\n\nClosing her eyes to enjoy your efforts, Phylla utters a pathetic moan as she better positions herself against your face.  Once she's found her optimal position you find your face pinned between her cunt and cushioned floor, the antsy Princess completely intent on keeping you there until you've done your duty.");
        this.outputText("\n\nTaking her cue, you remove your tongue from inside her and spread her lips apart with your hands, then begin to tease the tip of her long clit with your tongue, allowing the soft yet bumpy texture of your tongue to slide along the full length of her love button.");
        // If Snake Tongue:
        if (this.player.tongue.type == Tongue.SNAKE) this.outputText("  You run the split of your forked mouth muscle from the tip of her clit to the base.  As your textured feeler makes its way down, you wrap around the rest of her long clitorus, like a boa constrictor.  Once your split reaches the hood of her clit you roll and flick the tip of your tongue rapidly.  Pulling at your hair she gasps for breath in between teeth grinding moans.");
        this.outputText("\n\nA surprised, muffled moan escapes from your lover's mouth as you lick past one particular spot near the hood of her clit.  More out of curiosity than anything else you \"retrace\" your efforts past that spot.  Again, Phylla whines out in unrestrained ecstasy, signalling that you found a sensitive spot.  You half hum, half sigh into her vagina, knowing full well further 'investigation' around this area will make Phylla act like a bug caught in a spider web.  Phylla tenses up as she figures out you've found her weakness.  You hear her pleading that you focus on all of her stiff nub.  Obviously, she has no idea how intense this can get and isn't too keen to find out.  But you can't pass this up!  With a playful little war cry, you take to her sensitive spot.  You immediately began licking and smashing your tongue against it like there's no tomorrow.");
        this.outputText("\n\nYou hear her attempt to say something before her body takes over her mind.  She drowns herself out in moaning and whining as she braces her thighs against your shoulders and head, violently shaking your entrapped head back and forth, while simultaneously grinding her hips into your face. You ravenously assault her clit with no regard for her other desires;  She'll overcome her doubts and see that your \"technique\" is more than adequate. Gazing upwards, you see her face as she looks completely overcome with euphoria.");
        this.outputText("\n\nPhylla quickly begins to grind her clit against your mouth harder and faster. Drenching your already wet face in even greater volumes of her lady juices. She furiously works her hips to yield more pleasure.");
        this.outputText("\n\nAt this rate it won't be long before she reaches her peak, so you might as well make the finish one to remember.  Driving your fingers against her clit and teasing her labia you begin to rub at a lightning pace.  Phylla almost instantly loses her balance and stumbles backwards onto your " + this.player.multiCockDescriptLight());
        if (this.player.isGoo()) this.outputText(", tumbling out of your mass as she tears free");
        this.outputText(".  She holds one of her hands out in an attempt to catch her breath.  Ignoring her, you dive in and continue your unrelenting assault as her legs twitch uncontrollably over your head, like a dog having its stomach petted.  Screaming out, Phylla seemingly sputters a garbled string of nonsense until she takes your head in a vice like grip between her thighs.  Feeling her vaginal muscles convulse and tighten on your tongue you notice the signaling of climax.  With one final body contracting pulse Phylla arches her back and roars in orgasmic bliss.  You open your mouth in eager anticipation as her orgasm washes over you.  Her girl cum seems almost never ending as pulse after pulse of it squirt out of her.  You swallow at least two mouthfuls before turning your head, only to feel more splash on your cheek.  Still holding you firmly in between her legs, your Ant Morph lover continues to grind and spurt out juices all over your [face].");
        this.outputText("\n\nPhylla is clearly a squirter, in both volume and force.  You decide that it would be best to make a mental note of that for next time.  Exhausted, Phylla slumps against your prick");
        if (this.player.cockTotal() > 1) this.outputText("s");
        this.outputText(" and pants heavily, having just gone through the equivalent of an orgasm triathlon.  As you sigh, you can hear her giggle in what sounds like disbelief.  \"<i>Heh... I didn't think I had it in me to do... that,</i>\" she coos, staring mischievously up at you.  \"<i>Just... could you shrink ");
        if (this.player.cockTotal() == 1) this.outputText("this monster");
        else this.outputText("these monsters");
        this.outputText(" down?  I mean, I'm not complaining!  But I... just... I mean... you... inside me,</i>\" she shyly remarks, obviously wanting something more... traditional.");
        // (Player lust increases to 100)
        this.dynStats("lus=", this.player.maxLust());
        this.flags[kFLAGS.DIDNT_FUCK_PHYLLA_ON_RECRUITMENT] = 1;
        // Where the fuck is this going?
        this.menu();
        this.addButton(0, "Next", this.waifuQuestOver);
    }

    // ►Female Continuation
    private femalePhyllaFirstFuckGooooo(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("ant-desert-female-first-boobsucking"));
        this.outputText("Eager to get to some good old fashion fun, you direct your thoughts to Phylla, telling her to 'remove her clothing'.  After all of the pieces of her royal attire are removed, she closes in and rubs her naked body against yours.  Her fingers move fluidly as she slowly traces her ever hardening nipples along your chest and along the ridges of your back, sending a sensual chill up and down your spine.  Your " + this.player.nippleDescript(0) + "s harden in response, and with surprising speed she shifts her body downward and locks her mouth around your nipple, firmly suckling at your hardened areola.");
        // If PC Lactating:
        if (this.player.lactationQ() > 250) this.outputText("\n\nYou can feel her suck some of the milk from your breasts, slating her weak thirst in the process as she becomes immensely aroused at the sensation of \"nursing\" from her lover's " + this.player.breastDescript(0) + ".  Weird... you can taste the nutritious warmth of your nectar as it flows down her throat and into her stomach.  Drinking and tasting one's own breast milk could definitely weird someone out, but the foreignness of the act is an odd turn-on for you, and you let her continue to suckle.");

        this.outputText("\n\nHer tongue moves expertly, darting over your nipple whilst she moves a hand over to the other, gently caressing and teasing your sensitive flesh with her soft tongue.  The thought of having your nipples pinched runs wild through your mind, and before you realize what you have done, your lover does exactly that.  You let out a surprised moan of pleasure, and she seems to get the picture as she escalates into running the nipple in her mouth along her teeth, even biting down just the right amount to find the space between pain and pleasure.  When she finally unlatches herself from your nipple, she looks up to you with the most devilish smile.  Grinning ear to ear as she licks your milk from her lips, she stares deep into your eyes.");
        // PC has Goo body:
        if (this.player.isGoo()) this.outputText("\n\n\"<i>How did I not get slime in the milk?</i>\" she asks, breaking the stare.  \"<i>I figured the slime would make your milk taste bad, but... it made me want it more... Sorry,  I got distracted there</i>\" She says, apologizing as she stares once more into your eyes.");

        this.outputText("\n\nYou suddenly sense an idea... no; a suggestion, tickling the back of your mind.  Somehow you decide it's a good idea to lay on your back with your legs spread wide open.  You're not sure where this foreign thought is coming from, but it appears to be \"asking\" you to lay back and prepare for a little carnal loving; something that entices your " + this.player.clitDescript() + " as you heed its direction and lay back on the bed.  Looking upwards as you prepare for her loving assault, you see the liquid in the bowl reflecting a shifting rainbow along the ceiling.  You also realize, while on your back that whatever Phylla did to you works both ways, as you come to the stark realization she has gotten you laying on your back.  She moves her hips over your face so her moist, inviting vagina is suspended ever so slightly over your mouth; the rest of her abdomen extending just past the top of your head.  Her scent fills your nostrils and floods your body with its intoxicating allure.  Lust takes hold of your mind, and you cannot restrain yourself from wanting to bury your face in that tender hole of hers.  No! You want to do more than that; you want to ravage her moistening cunt with your mouth like a dog with a new chew toy, but something holds you back.  It's like your body is being shackled by your mind, but you get the feeling it's not \"your\" mind holding you back.");
        this.outputText("\n\nYou shoot a gaze down your own body and see her looking up at you, upside down from your vantage point, from between your legs.  She smiles mischievously at you and then moves her face over your [clit].  You can feel her humid breath on your womanhood and it stiffen in response.  Starting at your knee, she runs her two lower hands down your inner legs, ever so gently, and ending in a circular motion right above your now engorged " + this.player.clitDescript() + ", while using the other two hands to spread you wide open for her mouth's descent on your clit, her tongue savagely attacking it like a pack of lioness' on a gazelle.  You arch your back again and moan; not wanting this to be a one way gift you reach up and take hold of her nipples, giving them each the slightest pinch to tease Phylla.  Your enamored lover shudders and moans loudly, but the sound is muffled by your [clit] in her mouth.");
        this.outputText("\n\nYou've had just about enough of her denying you her pussy, and concentrate hard on forcing her to lower herself onto you.  Quite a task, given your current predicament.  Right when you think about giving up trying and just enjoying her going to town on you, you feel her mind bend to you and her once out of reach lips lower.  She's so wet you can see the streams of her arousal running down both sides of her chitinous legs.  Zeroing in, you fixate on her clit, which is much longer than you expected and sticks out far past the folds of her fuckhole.");
        this.menu();
        // (If PC has NO DICK(S)! Jump to - Scissoring Continuation)
        if (!this.player.hasCock()) this.addButton(0, "Next", this.girlFiller);
        // (If PC has ANY NUMBER of DICK(S)! - Jump to - If PC Herm/Has (a) cock(s))
        else this.addButton(0, "Next", this.femalePhyllaFirstTimePlusCock);
    }

    private girlFiller(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("ant-desert-female-first-scissoring"));
        // Scissoring Continuation - No Dicks!
        this.outputText("You coo at the prospect of finally allowing your tongue to go to town on her, but right as you're considering what to do you feel something enter you, causing you to let out a surprised moan.  Looking down, you expect to see her mouth still firmly planted on your clit; instead, your lover's chitinous fingers have begun to penetrate your pussy.");
        this.outputText("\n\nYour body begins moving on its own as you writhe in pleasure, Phylla continuing her loving, unending assault on your nethers.  In a moment of clarity your mind snaps into focus.  Your move!");

        this.outputText("\n\nNow that your lover is fully enthralled and aroused you feel her hard clit and guess it's almost two inches in length.  As you start sucking it, you can feel the surge of pleasure crash into Phylla's mind and hear a loud vocalization that sounds like a mix between a moan and an 'Eeep!'  She momentarily stops her work on you and just starts moaning loudly.  You move your fingers and spread her open, just as she did to you.  Gently, the index finger currently on her sex maneuvers over the threshold of her lips, running up and down it, whilst you continue to suck on her long clit.  The mental directive from your lover to penetrate her registers in your mind, and you happily oblige.  Quickly and expertly you move your finger along the sensitive insides of her love canal, feeling the mounting pleasure filling her in your mind.");

        this.outputText("\n\nYour tongue runs up, down, and all around her tender clit as you continue to suckle it.  The sensation of being out of your body almost take control for a moment as you lovingly bite down on her clit and shove your fingers deep into her, realizing that Phylla exerted a momentary degree of control over your own actions.  Getting the general idea, you start to thrust your fingers deeper and deeper as you suck her clit harder and harder. You can feel her help your fingers search for her g-spot.");

        this.outputText("\n\nThen a sudden image, and sensation of shock fires into your mind; her whole body seems to tense up and with a sudden hip grinding pulse, she orgasms, moaning so loudly it seems to echo off the walls. Well toned legs squeeze tightly against your head and then relax with a hearty groan as she squirts her girl cum all over you. Your hand and face are utterly drenched with her warm love juices and you try to drink up what you can... but there's just too much!");
        this.outputText("\n\nAfter a quick pause to clean your face off, you comment to Phylla how it's unfair for her cum without you. Her eyes open wide in horror, but before she can speak, you fire an image into her mind. It's time you take control of this. You slowly untangle yourself from all of Phylla's limbs and come to rest on top of her. Slowly you pull her legs apart and slide your thighs between hers.");

        this.outputText("\"<i>I-I've... never,</i>\" she stammers, but you just want her to experience this before she ruins the moment.");
        this.outputText("\n\nRocking your hips you see the exact reaction you expected as Phylla moans into the air, arching her back and instinctively rocking her hips into yours.");
        this.menu();
        this.addButton(0, "Next", this.scissorContinue, true);
    }

    // If PC Herm/Has (a) cock(s):
    private femalePhyllaFirstTimePlusCock(): void {
        this.clearOutput();
        if (this.player.smallestCockArea() > this.phyllaCapacity()) this.outputText(this.images.showImage("ant-desert-female-first-scissoring-with-bigcock"));
        else this.outputText(this.images.showImage("ant-desert-female-first-scissoring-with-cock"));
        this.outputText("You coo at the prospect of finally allowing your tongue to go to town on her, but right as you're considering what to do you feel something enter you, causing you to let out a surprised moan.  Looking down, you expect to see her mouth still firmly planted on your clit; instead, the chitinous lover's fingers has begun to penetrate your pussy, while her other free arm");
        this.outputText(" has taken hold of ");
        // One dick only:
        if (this.player.cockTotal() == 1) this.outputText("your " + this.player.cockDescript(0) + ".");
        else this.outputText("your " + this.player.cockDescript(0) + " leaving the lucky member to bask in affectionate glory as the rest of your manhood laments being left out.  \"<i>Don't worry, I have four hands...</i>\" Phylla coos as she works your shaft.");
        this.outputText("\n\nYour body is moving on its own as you writhe in pleasure, Phylla continuing her loving, unending assault on your nethers.  In a moment of clarity your mind snaps into focus.  Your move!");
        this.outputText("\n\nYou thrust your head between her legs and, pursing your lips, grasp her clit. You can guess it's almost two or three inches in length.  As you start sucking it you can feel the surge of pleasure crash into Phylla's mind, and a loud vocalization that sounds like a mix between a moan and an 'Eeep!'.  She momentarily stops her work on you and just starts moaning loudly.  You move your fingers and spread her open, just as she did to you.  Gently, the index finger currently on her sex maneuvers over the threshold of her lips, running it up and down, whilst you continue to suck on her long clit.  The mental directive from your lover to penetrate her registers in your mind, and you happily oblige.  Quickly and expertly you move your finger along the sensitive insides of her love canal, feeling the mounting pleasure filling her in your mind.");
        this.outputText("\n\nYour tongue runs up, down and all around her tender clit as you continue to suckle it.  The sensation of being out of your body almost takes control for a moment as you lovingly bite down on her clit and shove your fingers deep into her, realizing that Phylla exerted a momentary degree of control over your own actions.  Getting the general idea,you start to thrust your fingers deeper and deeper as you suck her clit harder and harder, your hands moving at blinding speed as you finger your new lover.");
        this.outputText("\n\nThen a sudden image, and sensation of shock fires into your mind;  Her whole body seems to tense up and with a sudden hip grinding pulse, she orgasms; moaning so loud it seems to echo off the walls.  Well toned legs squeeze tightly against your head, and then relax with a hearty groan as she squirts her girl cum all over you. Your hand and face are utterly drenched with her warm love juices and you try to drink up what you can... but there's just too much!");
        this.outputText("\n\nShe rolls off of you in a state of absolute euphoria. You sit up on your elbows and make eye contact with her for a moment, causing her to giggle as she admires her comedic handiwork.  Of course, the once shy Ant Morph now eyes your own drooling pussy.  She looks as though she's about to continue stimulating you, but then you think of a better idea.  It's time you take control.");
        // (If dick(s) (is/are) huge, length unknown - Jump to - Dick(s) too Big)
        if (this.player.smallestCockArea() > this.phyllaCapacity()) {
            // Dicks too Big:
            this.outputText("\n\nDespite your best efforts to try and get into a comfortable position to scissor, your painfully erect  " + this.player.multiCockDescriptLight() + " prevent you from doing so, given that they are now compressed against the ceiling.  While the display of rainbows is pretty to watch on your " + this.player.multiCockDescriptLight() + ", the crushing pain and the unyielding nature of your " + this.player.multiCockDescriptLight() + " is too much.  ");

            // Horse: (Cont from ...is too much.)
            if (this.player.isTaur()) this.outputText("Seeing your impending predicament, Phylla quickly scrambles with all four of her arms to collect a bunch of cushions.  She stacks them in a makeshift 'resting place' and helps you into a comfortable position as your cocks precede to grow uncontrollably.");
            // Drider body:
            else if (this.player.isDrider()) this.outputText("Phylla immediately realizes this, and flips you over so that you are resting on your head and neck, ducking in past your " + this.player.multiCockDescriptLight() + " and coming to rest on the border between your spider carapace and soft clit.");
            // Goo body:
            else if (this.player.isGoo()) this.outputText("Phylla immediately realizes this, and flips you over so that you are resting on your head and neck, and she works her way through your goopy mass, connecting her clit with yours in little time or effort. \"<i>This is a little weird... but I like it...</i>\" she flirts. Hardening your mass slightly, you snugly secure Phylla against your body, telling her that things \"might\" get rough.");
            // Human/Harpy/Naga legs:
            else this.outputText("Phylla immediately realizes this, and flips you over so that you are resting on your head and neck, and curls your [legs] towards her.");

            this.outputText("  Your " + this.player.multiCockDescriptLight() + " now resting comfortably out of the open room, Phylla positions herself to scissor your pussy.");
            this.outputText("\n\n\"<i>Y-you had me worried for a second. I mean, I've never seen something... So <b>big!</b></i>\" she teases.");
            // (Transitions to Freakishly huge dick(s):)
        }
        // (If dick 'normal' size - Jump to - All Other Conditions for Scene)
        else {
            this.outputText("\n\nYou position yourself over her so your cunt and hers are pressed together. Grabbing one of her legs you raise it so that her pussy lips are forced apart.");
        }
        // (If applicable transitions to - Freakishly huge dick(s))
        // (If not applicable transition to - Scissoring w/ Dick(s))
        // Freakishly huge dick(s):
        if (this.player.smallestCockArea() > this.phyllaCapacity()) {
            this.outputText("\n\nYou start rocking your hips and your pussies kiss, fluids mixing harmoniously together as shots of pleasure pass through both of you.  Her clit seems to penetrate further and further into yours with every push, and though it's not enough to fully enter you, the sensation on the inside sends wave after wave of euphoric bliss over the both of you.");
            // (Leads to - Scissoring w/ Dick(s))
        }
        // Scissoring w/ Dick(s)
        // If PC does not have an appropriately sized dick(s): Ignore following section and proceed to Scissoring Continuation, below.
        // If PC has an appropriately sized dick(s):
        else {
            this.outputText("\n\n[EachCock] hungers for attention, having been let go by Phylla when you shifted into a scissoring position.  Reaching down to start taking care of yourself; Phylla interrupts you abruptly.  \"<i>Oh, I'm sorry! I mean... I forgot... just feels... so gooood,</i>\" she coos between moans of ecstasy.  After a moment she seems to forget as waves of pleasure wash over her.  You make a playful throat clearing noise and gesture to your " + this.player.multiCockDescriptLight() + ".  Phylla quickly snaps back into reality and takes hold of ");
            // Tentacle dick check
            if (this.player.countCocksOfType(CockTypesEnum.TENTACLE) > 0) {
                // PC has (a) Tentacle dick(s):
                this.outputText("your tentacle dick");
                if (this.player.countCocksOfType(CockTypesEnum.TENTACLE) > 1) this.outputText("s");
                this.outputText(".  Clearly she's never seen anything like it before as she doesn't know what to do.  Laughing, you tell Phylla she doesn't need to do anything except hold still.  You snake your tentacle cock");
                if (this.player.countCocksOfType(CockTypesEnum.TENTACLE) > 1) this.outputText("s");
                this.outputText(" up her body, making sure to caress her most tender places on their way.  She screams out loudly in shock only to realize what happened when she looks down.  \"<i>God, you scared me!</i>\" she yells, embarrassed that she got frightened half to death by your dick");
                if (this.player.countCocksOfType(CockTypesEnum.TENTACLE) > 1) this.outputText("s");
                this.outputText(".  Laughing at her display, you motion to your prick");
                if (this.player.countCocksOfType(CockTypesEnum.TENTACLE) > 1) this.outputText("s and wiggle them ");
                else this.outputText(" and wiggle it ");
                this.outputText("in front of her, like a worm to a bird in her face.  \"<i>Aw, does someone need some attention?</i>\" Phylla teases, taking ");
                // PC has:
                // one tentacle dick:
                if (this.player.countCocksOfType(CockTypesEnum.TENTACLE) == 1) this.outputText("your cock into her mouth as she continues to rock her hips into yours.");
                // two:
                else if (this.player.countCocksOfType(CockTypesEnum.TENTACLE) == 2) this.outputText("your cocks into her mouth and between her breasts as she continues to rock her hips into yours.");
                else this.outputText("your cocks into her mouth, between her breasts, and along her body.  The ones on her body tightly wrap around her insectile joints, using her muscular curves to get you off.");
                // End TD check; if TD's are present, ignore non-TD check and, below, and skip to scissoring continuation.
            }
            else {
                // PC has one/two dick(s) not exceeding 4 inches in width total:
                if (this.player.cockTotal() == 2 && (this.player.cockArea(this.player.smallestCockIndex2()) + this.player.cockArea(this.player.smallestCockIndex()) <= this.phyllaCapacity()))
                    this.outputText("two of your " + this.player.multiCockDescriptLight() + ", stroking them apologetically as she scissors you.  You feel her almost insatiable appetite for all parts of your body.  You feel Phylla's mind slowly becoming lost in pleasure.");
                // TODO: "player.cocks[player.smallestCockIndex()] < 4" changed to cockLength. Not sure if it is the appropriate attribute.
                else if (this.player.cocks[this.player.smallestCockIndex()].cockLength < 4) this.outputText("your " + this.player.cockDescript(this.player.smallestCockIndex()) + ", stroking it apologetically as she scissors you.  You feel her almost insatiable appetite for all parts of your body.  You feel Phylla's mind slowly becoming lost in pleasure.");
                // PC only has a dick(s) that('s) (are) more than 4 inches in width:
                else this.outputText("your " + this.player.cockDescript(this.player.smallestCockIndex()) + ", but she simply can't fit any number of her hands around the entirety of your glans; instead, she takes to caressing the head of your " + this.player.cockDescript(this.player.biggestCockIndex()) + ".");
                // (Leads to - Scissoring Continuation)
            }
        }
        this.scissorContinue(false);
    }

    private scissorContinue(clear: boolean): void {
        if (clear) this.clearOutput();
        else this.outputText("\n\n");
        // Scissoring Continuation
        this.outputText("You increase both your tempo and force as you grind your sex against hers, and your hips are greeted with Phylla trying her best to stay in place and to give the most resistance possible. The sensation of a foreign orgasm enters you, signalling Phylla is close to another body twitching release; at the same time you feel yourself also building up to one of your own. Simultaneously, you work each other up until you're both on the brink.  Your hips work at a fierce speed, caressing your cunts together in a flurry of sexual fury, neither of you letting the other cum and just enjoying the pleasure that you're sharing mentally, until Phylla can't stand it anymore and releases her hold over you.  The barrier to your orgasmic fulfillment gone, your mind becomes overwhelmed and releases control over her own release, flooding her mind with your euphoric delight.  Both of you cum in unison, drowning in earth shattering bliss. Phylla releases all notions of timidness and screams in utter bliss, spraying her love juices all over your cunt like a fountain, and you do the same in return; although not in nearly the same amounts.");
        this.outputText("\n\nYou almost collapse onto her as your body attempts to recover from pleasure.  You catch yourself planting both your arms on either side of Phylla's face, hanging over her.  She reaches up and wraps all her arms around you, bringing you down to lay next to her.  The shy ant morph turns her head and kisses you one final time before you both pass out in each other's embrace.");
        this.player.orgasm('Vaginal');
        this.menu();
        this.addButton(0, "Next", this.waifuQuestOver);
    }

    private waifuQuestOver(): void {
        this.clearOutput();
        this.outputText("You wake but are unsure of how long you've been asleep; hours or maybe a day, it's hard to tell in this place.  Trying to stand was a mistake... you feel like your brain has just gone through three rounds of boxing with a minotaur.  The world spins around as you stagger to gain balance. Whatever Phylla has done to you seems to be wearing off, and it leaves you with an emptiness in your mind.");
        this.outputText("\n\nYou look over at Phylla, noticing that she's completely passed out in a very cute fetal position. You can see the indent you were making next to her before you stood up.  It's odd, but you can still feel that \"link\" you two shared; her thoughts and emotions like the whisper of wind around you. Just looking at her sleeping seems to make your worries melt away.  Your lack of presence in bed causes her to stir and wake, and she rubs her eyes in an effort to fully drag herself into consciousness. You can tell from her body language that she's experiencing the same withdrawals you are.  As you start to gather your things, your sleepy lover groggily says, \"<i>I can join you at camp if you want, I don't take up much space.  Above ground!  I mean, I'll be underground, I mean, I won't bother anyone.  I-I'll be good...</i>\"");
        // [Come to Camp] [Stay Here]
        this.menu();
        this.addButton(0, "Come2Camp", this.getAntWaifuYoShit);
        this.addButton(1, "Stay Here", this.tellPhyllaToStayTheFuckAtHomeThatCunt);
    }

    // [Come to Camp]
    private getAntWaifuYoShit(): void {
        this.clearOutput();
        this.outputText("You smile at her and tell her you would love for her to join you at your camp.  Her face brightens like the sun and she quickly gathers the very few possessions she owns - mostly clothing, the pillows, and some jewelry.  Together you promptly leave the colony and head back to camp.");
        this.outputText("\n\n(<b>Phylla has moved in!  She can be found in the lovers tab!</b>)");
        this.flags[kFLAGS.ANT_WAIFU] = 1;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // ►[Stay Here]
    private tellPhyllaToStayTheFuckAtHomeThatCunt(): void {
        this.clearOutput();
        this.outputText("Telling Phylla that your camp isn't really the safest place for her, even if she's underground, doesn't seem to make her accept the fact you're leaving her here any more heartbreaking.  You tell her you would rather her stay here for now, knowing she's safe, until you can make your campsite 'ready' for her.  She looks a little doleful but she agrees.");

        this.outputText("\n\nAs you turn to leave she quickly says, \"<i>If you ever feel your camp is safe enough for me to join you, p-please come get me.  If you want.  I mean, I'm not going anywhere... not that I could with my mother watching anyway...</i>\"");
        this.outputText("\n\nYou nod and without another word, head back to camp.");
        this.flags[kFLAGS.PHYLLA_STAY_HOME] = 1;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // If PC returns to colony after telling her to stay with her mother:
    private bumpIntoTheAntColonyAfterStayHomePhylla(): void {
        this.clearOutput();
        this.spriteSelect(SpriteDb.s_phylla);
        this.outputText("You make your way down a strangely familiar path that leads to Phylla's room.  Her head quickly snaps around upon seeing your shadow in her doorway.");
        this.outputText("\n\n\"<i>Eeep!</i>\" she clicks - clearly you startled her out of some daydream.");

        this.outputText("\n\n\"<i>Oh! [name] you're back!  I mean, I knew you would come back for me!  I mean... Are you ready for me to join you at your campsite?</i>\"  Phylla asks eagerly.  Looking around you can tell she's already packed everything she owns in preparation for her 'big move'.  You're not sure if she wants to join you that badly or if she just wants to get away from her mother.  Once she notices you looking around she continues.");

        this.outputText("\n\n\"<i>I won't take up much space.  Above ground! I mean, I'll be underground, I-I won't bother anyone.  I-I'll be good...</i>\"");

        this.outputText("\n\nYou consider this.");
        // [Come to Camp] [Stay Here]
        // (Note: There's no content here for her staying at her mother's Colony. She's meant to be a Waifu.)
        this.menu();
        this.addButton(0, "Come2Camp", this.getAntWaifuYoShit);
        this.addButton(1, "Stay Here", this.tellPhyllaToStayTheFuckAtHomeThatCunt);
    }

    // Only used after she becomes a follower
    public phyllaSprite(nude: boolean = false): void {
        if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] == 0) {
            if (nude) this.spriteSelect(SpriteDb.s_phylla_nude);
            else this.spriteSelect(SpriteDb.s_phylla);
        }
        else this.spriteSelect(SpriteDb.s_phylla_preg);
    }

    public introductionToPhyllaFollower(): void {
        if (this.flags[kFLAGS.PHYLLA_CAPACITY] < 50) this.flags[kFLAGS.PHYLLA_CAPACITY] = 50;
        this.clearOutput();
        this.outputText(this.images.showImage("ant-camp-follower-intro"));
        this.phyllaSprite();
        if (this.pregnancy.isPregnant && this.pregnancy.incubation == 0) {
            this.phyllaLaysSomeDriderEggs();
            return;
        }
        // [Follower > Phylla Intro (First Time)]
        if (this.flags[kFLAGS.PHYLLA_CAMP_VISITS] == 0) {
            this.outputText("Gazing into the distance, you see a small dirt hill you can only assume is the beginning of Phylla's colony.  Every now and then you see Phylla's silhouette pop out of the hole then immediately dive back into it.  You smile to yourself as you walk along the unfamiliar path towards the growing anthill.  Not very long after you start down the path, you end your journey at the base of her colony's entrance.  It's pretty impressive that Phylla has moved so much earth in such a small amount of time given that she is alone and 'royalty.'  Then again, she has four arms.  You cautiously make your way down through the threshold of the colony's entrance.  As you walk down the tunnel, you can't help but see the contrast between this single tunnel and her mother's massive, bewildering, colony.");
            this.outputText("\n\nYou come to the end of the tunnel and find Phylla sprawled on her pillows, napping, completely naked.  She seems to have hollowed out a makeshift room for herself.  Everything in the room is carved out of stone.  Then you realize something; this room is almost a carbon copy of your campsite on the surface!  It's even complete with a bedroll and firepit, both completely made of stone, rendering them quite useless.  Clearly Phylla did this to make you more comfortable, but failed in a very cute way.  She wakes up with a weary yawn, stretching all six of her limbs and flexing her abdomen.  Opening her eyes groggily, she jumps in surprise when she notices you standing in her doorway.  Clearly startled, Phylla frantically grasps for her pillows to cover her nudity.");

            this.outputText("\n\n\"<i>Oh! You came! I'm so happy!  I mean, I thought for a second you might not come... I mean...</i>\"");

            this.outputText("\n\nShe trails off, noticing you gazing around the room and taking in the familiar scenery.  She hesitantly admits that her new colony is all because of you.");

            this.outputText("\n\n\"<i>I-I'm trying to... do you like it?  I mean, it's very small, and I know it's not as nice as the surface, but I like it. I mean, are you comfortable?  Is there anything I can...</i>\"");

            this.outputText("\n\nYou cut her off with a funny look.  She takes a deep breath and attempts to calm down.");

            this.outputText("\n\n\"<i>There's been something I've been wanting to tell you.  I mean, if you want to hear it.</i>\"");
            this.outputText("\n\nYou nod.  Couldn't hurt to hear what she has to-");
            this.outputText("\n\n\"<i>I'm pregnant.</i>\"");

            this.outputText("\n\nYour thoughts grind to a halt and display a shocked look on your face.  Your stomach quickly feels like it's knotted up inside of you at the mere surprise and mention of this startling fact.");
            this.outputText("\n\nSeeing your reaction, she frantically waves with all four of her arms as she continues.");

            this.outputText("\n\n\"<i>No! It's not like that!  I mean, I can choose to have children - I mean, I can be not pregnant, too!</i>\"");
            this.outputText("\n\nThe look on your face painfully displays that you don't understand what she's talking about.");
            this.outputText("\n\n\"<i>W-we only need to have sex the one time, I mean! I want to have sex with you more!</i>\"  She quickly covers her mouth and blushes deeply after her mind catches up to what her mouth just blurted out.  Drawing her arms inward around her body, she stoops low in embarrassment but continues on.");

            this.outputText("\n\n\"<i>Ever since my first time with you, I've been pregnant.  I can choose to have children or not.  I-I mean.. my kind, lay eggs. They grow up fast... or fast compared to people like you.  So if you want, I can build us a colony full of our offspring, or I can just be here all by myself.  I don't care as long I'm with you.  The choice is up to you. I mean, if you don't mind.  You don't have to make this choice now either; I mean, I'm always here.</i>\"");
            if (this.flags[kFLAGS.DIDNT_FUCK_PHYLLA_ON_RECRUITMENT] == 1 && this.player.hasCock()) {
                this.outputText("\n\nYou raise your eyebrow and ask her how she can be pregnant if you never stuck it in.");
                this.outputText("\n\nShe takes a deep breath and continues.");
                this.outputText("\n\n\"<i>I don't need semen to have children; I just need certain fluids.</i>\"  Again she blushes and half covers her face with a pillow.  She looks as if she's not going to continue until she looks down between your legs.  \"<i>You were kind of leaking them...</i>\"  All she can muster is a deeper blush...");
            }
            else if (!this.player.hasCock()) {
                this.outputText("\n\nYou raise your eyebrow and ask her how she can be pregnant if neither of you have a penis.");
                this.outputText("\n\nShe takes a deep breath and continues.");
                this.outputText("\n\n\"<i>I don't need semen to have children; I just need certain fluids.</i>\"  Again she blushes and half covers her face with a pillow.  She looks as if she's not going to continue until she looks down between your legs.  \"<i>You know the kind of fluids I'm talking about...  I mean, they're sweet and we shared them... they come from our... I mean, your...</i>\"  All she can muster is to point at where your vagina is located...");
            }
            this.outputText("\n\nYou give her a knowing look and she continues, her voice a little more confident than before.");
            this.outputText("\n\n\"<i>Thank you.  Sometimes I just get embarrassed to talk about things like that, I mean. I'm just happy to see you here.  What do you want to do?</i>\"");

        }
        // ►[Follower > Phylla Intro (Repeat)]
        else {
            this.outputText("Making your way down the familiar path away from your camp it's not long until you reach the growing anthill that is Phylla's campsite-adjacent colony.  You climb to the crest of the ever increasing anthill, and enter down the passage to the caves below.  Once you get to Phylla's room, you see she's working on carving something on the wall.  Half of it looks like a copy of the art you did and the other half looks like a map of her colony with all the networked caves.");

            // If <10 days in camp:
            if (this.flags[kFLAGS.DAYS_PHYLLA_IN_CAMP] < 10) this.outputText("\n\nSo far the map of the caves doesn't look very impressive.");
            // If <30 days in camp:
            else if (this.flags[kFLAGS.DAYS_PHYLLA_IN_CAMP] < 30) this.outputText("\n\nThe map of the cave network is starting to look pretty impressive. You could get lost for quite awhile if you didn't know where you were going.");
            // If <100 days in camp:
            else this.outputText("\n\nJust looking at the carving makes your head spin.  It's almost certain that if you didn't know where you were going, you could easily get lost forever.");

            this.outputText("\n\nThe second your eyes lock onto her back, you feel something in your mind twitch.  You see the same thing happen to her as her whole body twitches.  She quickly turns around and runs over to you.");
            this.outputText("\n\n\"<i>You came back! I mean... I hope you like it. I mean welcome... What do you want to talk about?</i>\"");
        }
        // [Talk] [Sex] [Lay Eggs / Don't Lay Eggs] [Children] [Appearance] [Gems] [Stones]
        this.menu();
        this.addButton(0, "Talk", this.phyllaTalkChoices);
        if (this.player.lust >= 33) this.addButton(1, "Sex", this.phyllaSexMenu);
        else this.addDisabledButton(1, "Sex", "You are not aroused enough.");
        if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] == 0) this.addButton(2, "Lay Eggs", this.phyllaLaysEggsToggle);
        else this.addButton(2, "No Eggs", this.phyllaLaysEggsToggle);
        if (this.flags[kFLAGS.ANT_KIDS] > 0) this.addButton(3, "Children", this.phyllasKidsChildren);
        else this.addDisabledButton(3, "Children", "You have no children yet.");
        this.addButton(4, "Appearance", this.phyllaPearance);
        this.addButton(5, "Find Gems", this.phyllaDigsForGems);
        this.addButton(6, "Take Stones", this.phyllaStones);
        this.addButton(14, "Back", this.camp.campLoversMenu);

        this.flags[kFLAGS.PHYLLA_CAMP_VISITS]++;
    }

    private phyllaSexMenu(): void {
        this.menu();
        this.phyllaSprite(true);
        this.addDisabledButton(0, "Get BJ", "This scene requires you to have cock.");
        this.addDisabledButton(1, "Fuck Her", "This scene requires you to have cock.");
        this.addDisabledButton(2, "Lesbian Sex", "This scene requires you to have vagina.");
        this.addDisabledButton(3, "Orgy (Male)", "This scene requires you to have cock. Also requires at least 10 ant children and enough corruption.");
        this.addDisabledButton(4, "Orgy (Female)", "This scene requires you to have vagina. Also requires at least 10 ant children and enough corruption.");
        this.addDisabledButton(5, "Oviposit", "This scene requires you to have spider ovipositor.");

        if (this.player.hasCock()) {
            this.addButton(0, "Get BJ", this.phyllaBeeeJays);
            // \"<i>Use Dick</i>\"
            this.addButton(1, "Fuck Her", this.dickPhylla);
            // [While Giving Birth]
            // (Note: The above option will only be available if Phylla is 'Laying Eggs.')
            // While Giving Birth (Male) - Written
            if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] > 0 && this.flags[kFLAGS.ANT_KIDS] >= 10) this.addButton(1, "Fuck Her", this.dudesFuckEggLayingBitches);
            if (this.flags[kFLAGS.ANT_KIDS] > 10 && this.player.isCorruptEnough(75)) this.addButton(3, "Orgy (Male)", this.orgyWithDatColonyCorruptDudes);
        }
        // Straight Sex (Lesbian/Fisting) - Written
        if (this.player.hasVagina()) {
            this.addButton(2, "Lesbian Sex", this.lesbianFisting);
            // While Giving Birth (Female) - Written
            if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] > 0 && this.flags[kFLAGS.ANT_KIDS] >= 10) this.addButton(2, "Lesbian Sex", this.birfingSexWithAntsForDasLadies);
            // Orgy w/ Colony (Female)
            // You tell Phylla you're interested in 'inspecting' your children.
            if (this.flags[kFLAGS.ANT_KIDS] > 10 && this.player.isCorruptEnough(75)) this.addButton(4, "Orgy (Female)", this.antColonyOrgy4Ladies);
        }
        // Drider/Bee impregnation scene for Phylla (universal unless otherwise specified, which will include varied intros and stuff.
        // Sex > [Egg Phylla]
        if (this.player.canOvipositSpider()) this.addButton(5, "Oviposit", this.eggDatBitch);
        this.addButton(14, "Back", this.introductionToPhyllaFollower);
    }

    private phyllaTalkChoices(): void {
        this.menu();
        this.addButton(0, "History", this.talkAboutAntHistory);
        // (Ant Morph Mating Ritual / Inherited Knowledge)
        this.addButton(1, "Mating", this.talkAboutAntMatingAndRituals);
        // (Phylla's Life Past & Future)
        this.addButton(2, "Her Life", this.phyllasLifePastAndFuture);
        this.addButton(14, "Back", this.introductionToPhyllaFollower);
    }

    // ►[Talk]
    // ..(Ant Morph History)
    private talkAboutAntHistory(): void {
        this.clearOutput();
        this.flags[kFLAGS.TALKED_WITH_PHYLLA_ABOUT_HISTORY] = 1;
        this.outputText("You relax on one of the many available pillows and ask Phylla about her race's history. She pulls a pillow up next to yours and cuddles in.  \"<i>It's not a very happy story, are you sure you want to hear it?</i>\" You nod and move your hand to hold one of hers.");

        this.outputText("\n\nShe looks down into the darkened tunnel that leads to her room, seeming slightly detached for a moment.  \"<i>There was a time when my people were very prevalent here in Mareth.  We were called the Myrmi by different Tribes.  Though we never really interacted, I mean... we would forage on the surface sometimes, but we mostly kept to ourselves.  The only time we truly interacted with the surface is when a new Princess would go out looking for... for... suitors... if she couldn't find one among her own colony.</i>\"  A flush of red washes over her face as she continues.");

        this.outputText("\n\n\"<i>Sometimes colonies would become so large, that they would connect to each other underground.  Therefore some colonies would never need to go to the surface again.</i>\"");

        this.outputText("\n\nYou try to imagine what these super colonies would have looked like, but the thought boggles your mind.");
        this.outputText("\n\n\"<i>It was a better time, before the demons...</i>\"  Her voice seems to trail off.");

        this.outputText("\n\nYou inquire what happened after the demons came.  \"<i>It was difficult; we were almost driven to extinction.  Whole colonies became corrupted, and because our race only produces a few female eggs, most colonies quickly just turned into massive...</i>\"  Her voice cut, as if she didn't want to say the next word.");

        this.outputText("\n\nYou try and implore her to continue, understanding the implication of her long pause.");

        this.outputText("\n\n\"<i>Massive... orgies...</i>\" She says demurely looking down.  \"<i>The libido of both the workers and warriors became corrupted, they would just about have sex with anything that moved.  Quickly the surface tribes would kill us on sight, for fear of my people dragging them off into the night. We have particularly good night vision.</i>\"  She tries to change subjects but you continue to press her for her history.");
        this.outputText("\n\n\"<i>Queens soon stopped giving birth to females because their lust drove them to crave any male...  even of their own offspring.  Any eggs these queens laid were just as corrupt as the queen herself. So the cycle could never break itself.  The few of us, like my mother, who could still reproduce uncorrupted children, had to flee deeper and deeper into harsh environments to escape the surface, other colonies, and lastly the demons themselves.</i>\"");

        this.outputText("\n\nPhylla looked on the verge of tears, but squeezing your hand, she musters the strength to continue her tale.  \"<i>My mother... she... committed a genocide on her own people... even her own offspring.  Just to remove her colony from the massive underground network that connected all the main colonies.  Digging deep into the desert, far away from everything... and everyone. That's where we've been living for a long time.  Alone, and afraid.</i>\"");

        this.outputText("\n\nTears begin trickling down her cheeks.  Then to your surprise, a smile lights up her face. She turns to you and wipes her tears and nose with her other three hands.  \"<i>That was... until I met you. From the day we met, I knew you were special.  Together, we will write a new chapter for my people. One that has...</i>\"");
        // (Leads to - Corruption Checks)
        // [If corruption less than 40]
        if (this.player.cor < 70) {
            this.outputText("\n\nBefore she finishes her sentence, you pull her to you and kiss her deeply.");
            this.outputText("\n\nYour mind is suddenly bombarded with images of when you first met Phylla.  You watch yourself burst from your hiding spot and heroically defeat the Oasis Demons.  Only this time from her perspective.  The suffocating fear of being pinned down and gang raped replaced with a glimmer of hope that the individual before her would save her from the tainted creatures.  Next, you see yourself in the trials, fighting off each and every horror they sent at you; the same feeling of hope she felt earlier filling her body as you ducked and weaved past minotaurs and the like.  The feeling of this strange yet courageous individual dueling those monsters being the one that would rise to the challenge of being her mate.  You feel an overwhelming sense of love and compassion as Phylla breaks the kiss.");

            this.outputText("\n\n\"<i>...just happy memories.</i>\" she finishes.");
            this.outputText("\n\nYou try to stand and almost fall over; you thought that this mind-link would get easier over time - you were clearly wrong. Phylla catches you in her arms and helps you to the exit of the colony.  Staggering back to camp like a drunkard you feel the weight on your mind ease with each step and by the time you've arrived you feel right as rain.");
        }
        // [If corruption more than 70]
        else if (this.player.cor < 80) {
            this.outputText("\n\nYou interrupt her loving speech by standing up, leaving her momentarily confused.  You then comment on how you were never really interested in her people's history to begin with. All you really wanted was to get away from the surface for a while.  \"<i>W-what?</i>\" she says meekly.  With a small yawn you start to stretch in front of her, sighing to yourself as now you have to explain.");

            this.outputText("\n\nYou tell her you have better things to do than sit here and listen to her half-babble, half-cry on about her mother and the demons.  You're a champion after all; if you wanted to hear people babble on and on about history you would have been a scholar.  Any interest in the subject is long gone at this point.");

            this.outputText("\n\n\"<i>I didn't mean to, I mean, you asked!  I didn't want to bore you, I-I just thought...</i>\" She says timidly, trying to recover the conversation.");
            this.outputText("\n\nYou cut off both her speaking and her attempt to stand up by saying she thought wrong. Maybe she should stop thinking so much and just listen to you.  Also, if she hadn't been crying the whole time the story would have been a lot easier to listen to.");
            this.outputText("\n\nYou don't have time to deal with this right now; you gather your things and head back to camp, leaving Phylla alone in her room, with her sad memories.");
        }
        // [If corruption more than 80]
        else {
            this.outputText("\n\nWith a disgusted scoff you abruptly stand up, cutting Phylla off and pushing her into the uncushioned stone floor.  You look down at her and she looks up at you, shocked.");

            this.outputText("\n\nWith no sympathy for her own feelings, you berate her about how her people were weak and pathetic; they had the numbers and the strength to help stop the demons from spreading as quickly as they did.  Hell, her people could have stopped the invasion altogether if they had cooperated with the surface races.  But no!  They choose to stay underground hiding like cowards as the rest of the surface was systematically ruined by demons and corruption!");

            this.outputText("\n\nIn response to this shaming, she looks into your eyes as though you had just stabbed her in the heart.  She starts shaking and tears are running down both sides of her face.");

            this.outputText("\n\n\"<i>I wasn't even alive... how could you say...</i>\"");

            this.outputText("\n\nThough you've taken 'advantage' of the corruption yourself, it makes you a little horny verbally asserting your dominance over Phylla.");

            // (If PC has not completed the factory)
            if (this.flags[kFLAGS.FACTORY_SHUTDOWN] <= 0) {
                this.outputText("\n\nEvery year!  Every year, your people valiantly send one of their own through that hellish portal to this place in the hopes to try and quell or even stop the spread of corruption.  Now you just learned that it all could have been slowed or even stopped completely by Phylla's race had they all not been gutless yellow-bellied cowards!");
            }
            // (If PC has completed the factory)
            else {
                this.outputText("\n\nKnowing exactly what has happened to those who came before you makes what you're about to say all the sweeter.  You tell Phylla that there have been others before you, and you explain in vivid detail about the factory: how your people were sent as sacrifices, and how Phylla's people could have stopped this if they had even an ounce of courage and intellect to stop them.");
            }
            this.outputText("\n\nPhylla looks shocked that such a place could exist at all.  You continue by telling her that if she doesn't start to shape up, she may very well \"<i>see</i>\" the factory for herself.  Though your comment is jestful in nature and you don't mean that you would send her there to be a slave (yet), she doesn't seem to understand and pleads with you to stop.");

            this.outputText("\n\n\"<i>I'll be better, I'll do whatever you want!  P-please... don't send me away!</i>\"");

            this.outputText("\n\nHow presumptuous.  You tell her to stop reading into things, that she had better follow your instruction and orders, lest she fall prey to this world - once it gets its hooks into you, it doesn't let go until you're perfect for the darkness and its needs.");

            this.outputText("\n\nTurning to leave back to camp, you hear Phylla crying.  Maybe some time alone with her thoughts will help her see what you're trying to accomplish here.");
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // (Ant Morph Mating Ritual / Inherited Knowledge)
    private talkAboutAntMatingAndRituals(): void {
        this.clearOutput();
        this.outputText("You've always wondered how Phylla can project thoughts and images of her life into your mind. Seeing as how she's not busy, you ask her about it.  She tilts her head, trying to think of a way to explain it.  You can see this is taking some thought as she stays silent for almost a minute.");
        this.outputText("\n\n\"<i>It's what we call Inherited Knowledge.  No doubt you felt it when you saved me from the demons. I-I 'marked' you as my potential mate with it.</i>\"  She blushes.  \"<i>I mean! It's not like that.</i>\" She waves all four of her hands frantically.  \"<i>I mean, we princesses have to choose mates that way! Y-you were my first; I had no idea what to expect myself.</i>\"");

        this.outputText("\n\nYou rest your hand on your face and smile as she continues, thinking how cute she is when she stutters.  She gives you an 'Oh right!' look and continues.  \"<i>It's how we are able to pass our thoughts to others that are not like us.  It's not something we control either, at least when connecting to others.  In very intimate situations or when under extreme stress is when everyone's minds are at their most vulnerable.  Under normal conditions our minds can't link, but if your mind is open, my mind can invade yours.  I mean, I don't want it to sound like I'm attacking you! I mean, I wouldn't ever...</i>\"");

        this.outputText("\n\nYou're well aware of that and you make a wickedly playful face to show her you know.  She blushes deeply, her cheeks turning bright red and her hands start to fidget.  \"<i>During mating... I-I mean s-sex, is when the link is the strongest. It's when both minds are open.  It's also why we can... control each others' urges.</i>\"  Phylla still seems very shy when it comes to talking about sex.");
        // If Phylla has ever Laid Eggs:
        if (this.flags[kFLAGS.ANT_KIDS] > 0) this.outputText("\n\n\"<i>Unlike trying to connect to you, I can share knowledge freely with all of my children.  We never even need to make physical contact.  In the same way, they can share with me.</i>\"");
        // If player has made Phylla have Drider Children:
        if (this.flags[kFLAGS.PHYLLA_TIMES_DRIDER_EGG_LAYED] > 0) this.outputText("\n\n\"<i>This of course doesn't extend to our non-ant children.  Like our lovely drider offspring for instance.</i>\"");
        // If Phylla has Ant Children:
        else if (this.flags[kFLAGS.ANT_KIDS] > 0) {
            this.outputText("\n\nYou're a little amazed; you ask her if she can sense all of her children right now.  \"<i>It's not like that. I mean... feeling their every thought, all the time, would probably kill me.</i>\"  She pauses, trying to clear the morbid thought from her mind before a brilliant analogy pops into her head.  You comment that you aren't sure that would happen, but the inevitable headaches would certainly be debilitating.  Or drive her crazy.");
        }
        this.outputText("\n\n\"<i>It's like trying to think of every number between 1 and a 100 at the same time.  I can pick out numbers, but thinking about them all at once is too much.  I can also feel if one of them is in trouble or is sending me a specific feeling.  Fear, triumph, or kinds of rock or dirt...</i>\"");
        this.outputText("\n\nYou giggle at the last one, cutting her off.  Although why you did is clearly lost to Phylla as she gives you a strange look.  You try to explain that normally people aren't concerned with kinds of rocks or dirt.  She gives you a pouty look while crossing all four of her arms, stating those things are very important to ants.  You both pause for a moment then simultaneously burst into laughter.");
        this.outputText("\n\nTrying to completely understand how Inherited Knowledge works seems difficult. At least you have a basic understanding now.");

        // (Leads to - Corruption Checks)
        // If corruption less than 40:
        if (this.player.cor < 60) {
            this.outputText("\n\nYou walk over to her and give her a big kiss.  Nothing happens, so you give her a look and a sarcastic quip about how you were expecting something to happen.");
            this.outputText("\n\nShe gives you a pouty face and then reiterates, again, that she can't control it.");

            this.outputText("\n\nYou thank her for telling you everything, although as you turn to leave you swear she's covertly touching herself, trying to persuade you into a more passionate action.");
            this.outputText("\n\nYou grin and head back to camp thinking you should come visit her again soon.");
        }
        // If corruption more than 60:
        else {
            this.outputText("\n\nIt seems to be almost torture for her to keep describing her sexual organs, or even sex for that matter.  You get a very evil idea - something you know she won't pick up on.");

            this.outputText("\n\nYou feign innocence, asking her to show you all the different parts of her body.  This is met with a look of shock, as if you just asked her to strip down in front of a room full of strangers.  She looks around the empty room as if to make sure nobody but you is watching before proceeding.");
            this.outputText("\n\nVery quietly she says, \"<i>These are my...</i>\"");
            this.outputText("\n\nYou lean in telling her she's speaking too softly and you can't hear.");
            this.outputText("\n\nA little louder she starts again.");
            this.outputText("\n\n\"<i>These are my breasts; they're not very impressive...</i>\"");
            // If PC has over D Cup Continue:
            if (this.player.biggestTitSize() >= 4) this.outputText("\n\n\"<i>At least not like yours... I mean, yours are nicer!</i>\"");
            this.outputText("\n\nShe cups both of her breasts with her two larger hands.");
            this.outputText("\n\nAnd?  \"<i>...and my nipples.</i>\"  Her nipples immediately get hard.  Either from her hands rubbing them or her talking about them, you're not quite sure.");

            // If Phylla is not laying eggs:
            if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] == 0) this.outputText("\n\n\"<i>They don't produce milk unless I'm laying, but... they're very sensitive. I mean, you know that already.</i>\"  Seeing her struggle like this is thrilling in a very sexual way. You ask her just how sensitive they are.  \"<i>I don't... I mean...</i>\" She looks away from you as you stare at her.  You tell her to play with them. You want to see how sensitive they are.  She does, eliciting a gasp of surprised excitement from her open mouth.");
            else this.outputText("\n\n\"<i>R-right now they're much bigger because... I-I'm producing milk for our children.</i>\"  You can tell she hasn't been suckled recently as her breasts are much larger than normal. You ask to see her milk.  Shocked, she turns her head away but does as she's told.  Her two larger hands cup the bottom on her breasts and give a squeeze. You hear her moaning exhale as white milk sprays out of her nipples.  She does it again without you even telling her to - again a louder moan escapes her.  \"<i>I t-told you they're very sensitive...</i>\" Phylla says between deep breaths.");

            this.outputText("\n\nYou make a quip about how you'll keep that in mind the next time you two have sex. She quickly covers her chest with her hands, retracting inward.  \"<i>I don't want to... I mean... I do, but... I'm embarrassed... P-please...</i>\"");
            // If corruption more than 80: (Continued From \"<i>I don't want to... I mean... I do, but... I'm embarrassed... Please...</i>\") You give Phylla your most innocent look, staring up at the ceiling, and putting your index finger on your lip.
            if (this.player.cor >= 80) {
                this.outputText("\n\nShe continues apprehensively by removing her two upper hands from her boobs, but still keeping the lower two covering her nipples.");
                this.outputText("\n\n\"<i>This... this is... my... v-v...</i>\"");
                this.outputText("\n\n\"<i>Your...?</i>\"  You try to coax out of her.");
                this.outputText("\n\n\"<i>My vagina.</i>\"  She says it so quietly, it's almost as if she didn't make any sound at all.");
                this.outputText("\n\nYou say you didn't hear her, and ask her what is it again.  \"<i>You know what this is... I mean, you... w-we...</i>\" She tries to plead, looking for any way out of this.  Watching this is great!  You've never watched anyone get so worked up over a word before.");
                this.outputText("\n\n\"<i>It's my vagina.</i>\" She finally states.");
                this.outputText("\n\n\"<i>Your cunt.</i>\" You quickly correct her.");
                this.outputText("\n\n\"<i>My... c... cunt,</i>\" she says with a defeated tone.");

                this.outputText("\n\nYou tell her you can see her clit sticking out from between her lips.  She quickly looks down and confirms your words.  She quickly places all four of her hands over her pussy, uncovering her still hardened ");
                if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] > 0) this.outputText("milk dripping ");
                this.outputText("nipples.  You tell her you want to see the inside and for her to explain why she doesn't give birth from it.  By this time, you can see you've started making her horny and her modesty is slowly melting away.  She parts her pussy lips for you with her larger arms and then starts pointing at her long clit with one of her lower hands.");

                this.outputText("\n\n\"<i>This is my... m-my...</i>\"  With a gulp of courage she continues.  \"<i>My clitoris.  It's hypersensitive and just touching it can cause me to...</i>\" Her voice trails off.  \"<i>Cause you to...?</i>\"  You probe for the answer with a smile on your face, knowing she isn't looking at you anyway.  \"<i>Orgasm.</i>\"  She says blankly.  You can tell by her changing tone and attitude her lust must be consuming all her thoughts.  You ask for a demonstration, causing her head to twist around to give you a long, hard stare.  You've wiped the wicked smile from your face and replaced it with an innocently inquiring one; a true master of deception on one shoulder, and a devil in disguise on the other.");
                this.outputText("\n\nWith her two upper hands still holding her pussy open for you to see, the lower hand not resting on her clit starts to run up and down the entrance of her quickly moistening cunt.  She moves her smaller right hand and starts from the tip of her love button and slowly runs all her fingers down it.  She moans loudly every time she reaches the base of her clit. Her shoulders tense up and her body shakes as she almost instantly builds to an orgasm.  The resulting climaxes, as you are well aware, are very messy.  With her small left hand, she thrusts two of her fingers into herself, and you watch as she moans deeply and starts masturbating her clit quicker. The two larger hands cease holding her pussy lips apart and start to pinch her nipples");
                if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] > 0) this.outputText(", sending jets of milk shooting out onto the floor");
                this.outputText(".  With a loud moan she orgasms, covering her smaller two forearms, her inner thighs, and the floor below her in thick, sweet-smelling, girl cum.");

                this.outputText("\n\nShe looks at her smaller hands as she pulls them away from her soaked cunt. They're completely covered in her juices.  Amazed at herself after what she did to herself in front of you, she looks at you blankly for guidance.  You then ask her how many orgasms she can have.");
                this.outputText("\n\nPhylla's glazed eyes roll into the back of her skull for a moment as she reaches down between her legs again.");
                this.outputText("\n\n<b>Time passes...</b>");
                this.outputText("\n\nThough you tried to count over such a long period of watching her masturbate, you lost track at around 15.");
                this.outputText("\n\nShe's tried to stop a few times, pleading to you that it's too much but you just kept forcing her to continue.  After what you can only guess would be a few hours of watching her cum again and again in an almost heroic display of fortitude, she breaks.  Phylla falls over, completely spent. Sprawled out in front of you, her whole body from head to foot is covered in her own juices.");
                this.outputText("\n\nYou don't say a word to her as she lies in the pool of her own secretions, her blank eyes gazing into nothingness.  Maybe you broke her, only time will tell, she'll need to recover first.  You set out back to camp, knowing full well she's now just another plaything for you.");
                this.getGame().time.hours++;
                this.dynStats("lus", 25);
            }
            else {
                this.outputText("\n\nYou've had your fun, and Phylla is none the wiser.  You wink at her and thank her for the show. The comment clearly goes over her head leaving her wondering about your meaning as you set off back to camp.");
                this.dynStats("lus", 15);
            }
        }
        this.flags[kFLAGS.PHYLLA_INHERITED_KNOWLEDGE] = 1;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // (Phylla's Life Past & Future)
    private phyllasLifePastAndFuture(): void {
        this.clearOutput();
        // (If Izma at Camp)
        if (kGAMECLASS.izmaScene.izmaFollower() && this.flags[kFLAGS.PHYLLA_IZMA_TALK] == 0) {
            this.flags[kFLAGS.PHYLLA_IZMA_TALK] = 1;
            this.outputText("Phylla seems to be a little distant today as you sit down to talk.  You point it out to her and she cautiously asks about Izma.");
            this.outputText("\n\n\"<i>I k-know there's someone else at your camp.  I mean... I don't want to pretend I'm the only one you'll ever mate with, but this one is special.  I mean, I can feel it inside here.</i>\"  She points to your head with the two arms on her right side, and her head with the two arms on her left side. Seeing you don't deny it, Phylla's eyes well up as she tries to hold back tears.  \"<i>I d-don't know why you didn't tell me you had others staying closer to you...</i>\"");
            this.outputText("\n\nShe seems extremely distressed and your hesitation while you ponder how to respond only compounds it.  \"<i>I want to know how you feel about her.  I saw you two... I mean, I didn't mean to, I just heard moaning and I was tunneling out the colony and glanced over to your camp.  I didn't mean to watch but...</i>\"");
            // (Leads to - Corruption Checks)
            // If Corruption less than 40:
            if (this.player.cor < 40) {
                this.outputText("\n\nYou do your best to explain Izma's situation.  Mostly focusing on the fact that she's not like the other shark morphs.  She withstood the corruption by reading and she's naturally faster and stronger than almost anything that could have corrupted her anyway.");
                this.outputText("\n\nPhylla doesn't look particularly thrilled and seems unsatisfied at your explanation. She sniffles and crosses all four of her arms waiting for further explanation.  There's really not much more to say unless...  You start to explain how Izma and you fought on several occasions.  Phylla looks shocked; the fact that you would attack someone you're in a 'relationship' with clearly escapes her.");
                this.outputText("\n\n\"<i>Y-you fought? Ww-why...?</i>\"");
                this.outputText("\n\nYou try and recover saying how it was Izma's idea in the first place, and continue to talk about your alpha-beta relationship.  Once you're done explaining, Phylla seems a little less stressed than before, but she still has questions.");
                this.outputText("\n\n\"<i>T-the only reason you're with her is because you're stronger than her?</i>\"  Phylla says with a shy but hopeful tone.  You tell her that's not exactly how it is.  Izma means a lot to you in certain respects.  You try to explain how your relationship with Izma is complicated and that it's hard to explain with words.");
                this.outputText("\n\nOnce Phylla hears that she perks up.");
                this.outputText("\n\n\"<i>What if... you know... we... I mean...</i>\"  You raise an eyebrow and give her an inquisitive look.  \"<i>We could join...</i>\" She points at her head and yours, again.");
                // If PC Has the 'inherited knowledge' talk:
                if (this.flags[kFLAGS.PHYLLA_INHERITED_KNOWLEDGE] == 1) {
                    this.outputText("\n\nYou comment on how you thought she couldn't control that. \"<i>I can't... I mean not directly... I've just been stressed recently... ever since I saw the two of you... I think I could... I mean!  I just thought... if you want to try...</i>\"");
                }
                this.outputText("\n\nYou might as well try; Phylla seems pretty worked up over this and you want to help ease her stress in whatever way you can.");
                this.outputText("\n\nYou nod and she walks over to you. All four of her arms wrap around you.  She seems to wait for you to take control of the situation, not wanting to take the lead herself.  You put your index finger on her chin and raise her head up so your mouths meet.  At first you don't feel anything; assuming it's not working, you slide your tongue past her lips into her mouth.  Her grip on you tightens but still nothing happens.  Starting to pull back from her assuming it's not going to work, you feel her grip you hard in desperation as she uses her two upper arms to grab the back of your head to force your tongue deeper into her mouth.  Then, like a triple shot of whiskey right to the brain your mind becomes disoriented with images of Phylla pacing around her room telling herself she didn't see you and Izma together and that it's all just in her mind.");
                this.outputText("\n\nA flash of her crying, trying desperately to console herself about the fact that you would let a corrupt shark morph have their way with you.  After this, there's a lull in the mind link... you feel as if it's your time to present Izma's case for Phylla's understanding.  Thinking back to the first time you and Izma met, and how she was kind and even let you read her books.  You recall her conversation about how her people work out their relationships with each other.  Bringing up your memories of Izma and you locked in ferocious battle for dominance, you feel Phylla get scared at these particular memories but you force the memories of you pulling some of your more brutal attacks so Izma didn't take any real wounds.");
                this.outputText("\n\nThough still off-putting this seems to calm Phylla a bit.  The last memory you recall is the one where Izma submitted to you. At the end of one of your 'fights' Izma confesses that you're her alpha and, if allowed, she would be happy to spend her life at your camp.");
                this.outputText("\n\nYou feel Phylla's grip on you ease and then release. You slowly break the kiss and look into Phylla's eyes.  Your mind still aches as it always does after these things.");
                this.outputText("\n\n\"<i>I don't know what to say... I was wrong... about her... I mean, about you... I'm so sorry.</i>\"");
                this.outputText("\n\nYou tell her it's understandable, but sometimes making assumptions before you have all the facts can be disastrous.  \"<i>I know. I'll never doubt you... or Iz-Izma again.</i>\"  You ask Phylla if she would like to meet Izma someday.  She shyly says, \"<i>Only if you think that would be a good idea. She seems very... aggressive.  I mean not that that's a bad thing... I just don't think... I'm strong, too, but I don't like to fight like she does.</i>\"");
                this.outputText("\n\nYou chuckle, giving Phylla a heavy clap on her chitinous armor, as if to try and reassure her. She'll be fine as long as she's with you.  You are the alpha in the relationship after all.");
                this.outputText("\n\nThis seems to sit right with Phylla, and she smiles widely.  \"<i>Thank you... for everything.</i>\" She says, her voice finally returning to its normal demure tone.");
                this.outputText("\n\nYou head back to your camp.  When you get there you see Izma drying off after a swim in the stream. You give her a devious look and a very wide smile.  She looks around to make sure you're actually smiling at her.  \"<i>What's that about?</i>\" She inquires.  You tell her it's nothing she needs to worry about for now.");
            }
            // If Corruption more than 40: (Continued From: I didn't mean to watch but...</i>\")
            else {
                this.outputText("\n\nYou start to retort but Phylla aggressively kisses you.  She grabs your head and neck with all four of her hands so you can't really break the kiss until she's gotten what she wants from you.");
                this.outputText("\n\nClearly the stress has driven her mind meld to kick in.  She aggressively probes your mind looking for thoughts or memories of Izma.  It's not at all a pleasant feeling; it's as if your mind is being carved up and sorted, piece by piece.  Finally images flash of you first meeting Izma and how she showed you her collection of books.  The next thing you see is you and Izma sitting on a beach reading books together and chit-chatting about how Izma has withstood the corruption by reading.  That image suddenly fades as you see yourself in a fist fight with Izma vying for dominance in your estranged relationship. Eventually you see yourself dominating Izma to the point where she asks you if she's allowed to come back to camp with you.");

                // If Corruption more than 80: (Continued From: You're determined to not let this go without protest.)
                if (this.player.cor >= 80) {
                    this.outputText("\n\nHow dare she!");
                    this.outputText("\n\nAs Phylla attempts to conjure up another memory in your mind, you push her away with all of your strength.  Feeling her hands on the sides of your face start to slip, with one final grunt you send her staggering across the room.  Wiping her saliva from your mouth with the back of your hand, you spit whatever's left onto the floor.  She looks at you with stunned awe.  Clearly she didn't think you could escape.");
                    this.outputText("\n\n\"<i>I-I didn't...  I mean...  she...!</i>\"  She tries to confess, scrambling for words to make you less angry.");
                    this.outputText("\n\nYou collect yourself, but it's not easy - your head is pounding like a morning after a night of heavy drinking and bad decisions.  As soon as you're clearheaded, you see Phylla is sitting in the corner crying, although this doesn't stop you from verbally attacking her.  You curse her up and down, giving her the proverbial 'What the fuck was that for?!' speech.");
                    this.outputText("\n\nEach curse word, each insult, only seems to make her shrink into her corner a little more.  You keep railing on her that she NEVER, EVER has the right to use your own memories and emotions as a weapon against you!  You go on to tell her she was right all along and she's not the only person you're going to \"<i>mate</i>\" with.");
                    this.outputText("\n\nSeeing that last insult, in particular, seemed to make her flinch in pain you continue down that line.  You tell her you two were never exclusive, nor did you ever say you wanted to be.  You start chewing her out, telling her, \"<i>Is this how you repay your lover, your hero?  Did I not save you from being gang raped?  Or how about fighting for your life in the arena, just for you?  How about letting her make her own colony right next to MY camp?  This is how she repays me for all of my kindness!?</i>\"");
                    this.outputText("\n\nYou could slap her, pin her to the ground and make her beg to be willingly bred; she's in no condition to defend herself.  But in a moment of pure genius, you come a better answer.  You walk over to her and seeing how vulnerable she is, you think you have the perfect idea.  You raise your hand and as you do she looks up and flinches, expecting you to hit her.");
                    this.outputText("\n\nInstead you just grab her hair and forcibly pull her head back so she's looking at you.  She's crying, but really, when is she not crying, the dumb bitch!");
                    this.outputText("\n\nWith a firm grasp on her neck, you dart in and kiss her, holding her in place so she can't escape. As your tongue enters her mouth you can feel her jump in surprise,  but you hold her steady.  Her four arms claw at your chest and back, but not enough to actually hurt you.  As your minds synchronize, you feel her mind and how scared she is - how unwanted this is.  So!  She must be feeling what your mind felt like when she did this to you.  Unfortunately for her, you'll be just as rough with her mind as she was with yours.");
                    this.outputText("\n\nYou begin to conjure up all the depraved and disgusting acts you've ever done or seen done. Especially dealing with Izma at first.  Your fights, your sexual exploits, even your deepest depraved thoughts of things you wanted to do to Izma.  Once you're done sending her your thoughts with Izma you move on to Goblins, then Minotaurs, then Tentacle Beasts, and so on.  Each memory you send her seems to be worse than the last, causing her to shake from the vivid imagery.  By the time you've gotten to the Oasis Demons she's stopped wriggling completely; rather, she appears to be enjoying it now.  Her mind is completely open to yours.  In fact, you get the feeling she's starting to welcome these memories, like the broken slut she deserved to be from the start.");
                    this.outputText("\n\nYou can feel her start to probe your mind for anything you haven't already shown her.  You know it probably won't last and you don't really care at this point.  When you finally break your forced kiss, Phylla drops from your arms and hits the rocky floor with a small splash.  You look down to see she had been cumming pretty much the whole time you were overwhelming her mind.");
                    this.outputText("\n\nYou laugh in her face before leaving to return to your camp. You should introduce your new play thing to Izma.  Maybe, if you allow it, Izma can have her very own beta.");
                }
                else {
                    this.outputText("\n\nYou're determined to not let this go without protest so you do your best to probe Phylla's mind; you reach for anything, but all you feel is her profound sense of loneliness and betrayal.  The next thing you start to see is yourself walking up to Izma, at your campsite, with a seductive glint in your eye.  Before the next memory rises up Phylla breaks the kiss and steps away from you, tears already starting to pool around her eyes.");
                    this.outputText("\n\nThere's a long awkward pause as both of you search for the words to make this all better.  Finally after what seems like an eternity Phylla breaks the silence.  \"<i>I'm so sorry.  I thought... I mean...  She's a...  I thought maybe she did something to you... made you her slave or worse!  I can't put my finger on it, but you're just different somehow.  I just...  Their kind isn't known for...</i>\" Phylla starts to sob loudly.");
                    this.outputText("\n\n\"<i>I was so wrong; she's just another person trying her best to fight the corruption.  I don't know what I was thinking...  I was just so jealous and stressed... just don't hate me, p-please.  I'm so sorry.</i>\"");
                    this.outputText("\n\nPhylla turns away from you and starts crying into all four of her hands.  Having your mind invaded like that was not something you ever expected from Phylla.  You walk over to the frightened ant and grab her by the shoulders and spin her around to face you.  Holding your head like you have a bad hangover, you scold Phylla on how she should never do that to you without your permission.");
                    this.outputText("\n\nYou tell her that Izma means a great deal to you, and this seems to break her heart, as her eyes widen in fear.  Sighing, you do your best to explain to her your alpha-beta relationship with Izma but Phylla perks up a little upon hearing that you haven't completely forgotten about her.  \"<i>So... she's just... your plaything?</i>\"  She manages to say between sobs.");
                    this.outputText("\n\nYou continue in your chastising tone, telling her that Izma isn't your 'plaything' nor will she ever be.  She's your friend and one of your lovers.  That last comment hits Phylla as hard if you had physically punched her.  She staggers backwards, even more tears than before now rolling down her face as she continues to sob loudly.  Though leaving her here like this would be appropriate, given the circumstances, you decide that a last ditch effort to make this right would be the way to go.");
                    this.outputText("\n\nYou explain to her that both she and Izma mean a lot to you.  The relationships you have with each of them are different, but that doesn't mean better or worse.");
                    this.outputText("\n\nTo your surprise Phylla wipes her eyes and tries to calm her sobbing.");
                    this.outputText("\n\n\"<i>Do you... do you really mean that?</i>\"");
                    this.outputText("\n\nYou nod.");
                    this.outputText("\n\nThere's a long silence between you two, as she does her best to stop crying.  \"<i>Thank you. I mean, I should have trusted you... I'll do better.</i>\"  You think Phylla finally understands this strange love triangle you've got going, but who knows for sure.  Izma isn't known for her stealth when you two go at it; it's really no surprise to you that Phylla saw you and Izma together.  You leave her still half sobbing, thinking to yourself that she needs some time to think about what you said.  On your walk back to camp you consider introducing them to each other someday - that might break the tension.");
                }
            }
        }
        else {
            this.outputText("You take a seat on one of the many fluffy cushions in her room and she proceeds to cuddle in close, pressing her head against your chest and wrapping her abdomen around you.  She then looks up at you and asks what's on your mind.");
            this.outputText("\n\nYou tell her you want to know what her past was like, and what her plan is for the future.");
            this.outputText("\n\nShe places her back on your chest and seems to relax as she tells you about her past.");
            this.outputText("\n\n\"<i>Well, I mean... I was the first female to be born from my mother... I mean... no doubt she's had another princess by now.  My mother guarded me fiercely and well, I grew up under constant guard and I absolutely... I hated it.  I mean I appreciate it now, but at the time it was suffocating.  I never got to do anything!  I mean... except eating and sleeping... I was confined to my room after...</i>\"  She shudders before continuing on.  \"<i>After some corrupted ants tried to rape me.  My... my guards saw to it that nobody ever laid a hand on me.  That was... well... until I got these urges...</i>\"  Her face turning red as she finishes her last thought.");

            this.outputText("\n\n\"<i>Every young princess has to seek out a... well you know, partner.  I mean... mate - when they reach adulthood that is.  I searched in the colony, and even had some warriors attempt the trials in my name, but none of them... none could pass the tests.  So my mother decided if I could not find a mate in the colony, I would have to find one outside of it.  We both know what happened after that... I found you, and you're the best thing to ever happen to me.  The great Champion to keep me safe... and I couldn't be happier.</i>\"");

            this.outputText("\n\nShe playfully squeezes the muscles in your arm.  \"<i>As for the future, that's really up to you. We're joined now, both in mind and destiny.</i>\"");

            // If Phylla has never laid eggs:
            if (this.flags[kFLAGS.ANT_KIDS] == 0) this.outputText("\n\n\"<i>As I've said before, I can give us a growing colony with hundreds of children or I could just stay here with you.</i>\"  She pauses, hesitating to continue.  \"<i>Although if we have a large colony, it would mean we could repopulate my people...</i>\"  You get the distinct feeling that Phylla really wants to have kids with you.");
            // If Phylla has/is laid/laying eggs:
            else this.outputText("\n\nYou see Phylla looking around as your children scurry about past the doorway to her room.  \"<i>I couldn't think of anything I've ever wanted more. Just to have you visit is like a dream.  Although we could always do... other things, I mean!  It doesn't have to be now, just you know...  I-I get lonely sometimes.</i>\"");

            this.outputText("\n\nYou mull this over in your head, and you must have been thinking pretty hard.  When you get up to leave you find Phylla has completely passed out on your lap.  You take this opportunity to gently unwrap yourself from her, and head back to camp.");

        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // First Time Blowjob:
    private phyllaBeeeJays(): void {
        this.clearOutput();
        this.flags[kFLAGS.PHYLLA_BLOWJOBS]++;
        this.outputText(this.images.showImage("ant-camp-give-bj"));
        if (this.flags[kFLAGS.PHYLLA_BLOWJOBS] == 1) {
            this.outputText("Turning to Phylla, you can't help but smile as you flash her a seductive look, making sure you have her undivided attention before glancing down at the bulge in your pants.  Raising a hand to her mouth in sultry intrigue, Phylla giggles and shoots you a devilish look back.  Turning towards the bed, Phylla presumptuously begins to disrobe...  close!  But not what you had in mind.");
            this.outputText("\n\nCrossing your arms, you let out a loud cough in order to redirect the confused ant morph's attention back to you.  She turns around slowly, obviously uncertain of what you have in mind for intimacy.");

            this.outputText("\n\n\"<i>I thought...  I mean...  that look...</i>\"  She struggles to relay why she was undressing to you.  With a raised eyebrow and a perverted, inviting grin, you beckon her to come back over to you.  Eager, aroused, and a little nervous, Phylla clatters over to you, trying her best to put on her most seductive strut for you, though her inexperience shows.  She almost trips over herself as she throws one leg in front of the other, hips and abdomen in sway.  It's a bit awkward to watch. Nevertheless, you can't help but be aroused as she finishes her little walk.  Her emerald green eyes gaze into your own eyes with wanting and impatient anticipation for your next instruction.");

            this.outputText("\n\nRaising your arms up to her sides, you pull her in close and begin to glide your hands up her stomach.  Teasingly, you caress her breasts as your hands glide to her shoulders.  When your hands stop atop her chitinous shoulders you smile at her thinking: this is where the fun begins.  Pushing down on her shoulders you show her exactly what's in store.  Feeling her shoulders stand stiff for a moment, lingering just long enough before the realization strikes her.  You continue to guide her until she's down to her knees.  Hearing her chitinous knees clatter against the stony floor brings a smile to your face. Giggling in surprise, she rubs the outline of your package through your pants.");
            this.outputText("\n\n\"<i>Y-you want me to...  I mean...  I've never...</i>\"  She shyly wavers between her growing sexual emotions and trying to keep a royal attitude.  Her eyes are locked on your growing package, rubbing at the bulge in your pants, lost in contemplation on how to do this act.  Slowly closing her eyes, she takes a deep breath as if preparing herself to the task you've set for her.  Opening her eyes slowly, she shuffles on her knees to the side your bulge is protruding down.  She coos while attempting to give you a good angle of her face; you catch her lustful and flirty gaze from behind her eyebrows.");

            this.outputText("\n\n\"<i>I-I guess I could give it a shot...  I mean...</i>\"  She stammers, deciding to abandon her following words and get down to business.");
        }
        // Subsequent Blowjobs:
        else {
            this.outputText("Approaching Phylla, you cross your arms and lean against the wall of her bedchamber while sporting a tell-tale tent in your pants.  Phylla stares down at your bulge and picks up immediately on your intentions.");
            this.outputText("\n\n\"<i>Y-You gonna ask me nicely, or let your penis");
            if (this.player.cockTotal() > 1) this.outputText("es");
            this.outputText(" do all the convincing?</i>\"  She teases.  Shrugging, you inform her that whatever works for her works for you.");
        }
        // Continued...
        // If Phylla is not Laying Eggs:
        if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] == 0) this.outputText("\n\nPhylla can't help but grin as she walks over to you, zeroing in on your crotch as she closes in.");
        // If Phylla is Laying Eggs:
        else this.outputText("\n\nPhylla looks a little stuck as she attempts to shift her egg-enlarged abdomen.  \"<i>I'm s-sorry I can't...</i>\" she says, looking on the verge of tears.  Taking a hint you walk over to her and climb atop the bed, leaving your package on an equal level with her mouth.  She immediately locks on to you with her eyes...");

        // First time:
        if (this.flags[kFLAGS.PHYLLA_BLOWJOBS] == 1) this.outputText("\n\n\"<i>Oh!  I get the meal delivered to me.  H-How... kind of you.</i>\"");
        // Subsequent times:
        else this.outputText("\n\n\"<i>Breakfast in bed?  Y-You shouldn't have.</i>\"  She coos playfully.");

        const x: number = this.player.smallestCockIndex();
        // Dick size less than 60 inches:
        if (this.player.cockArea(x) < 60) {
            this.outputText("\n\nWithout even having to utter a word, Phylla jumps right in and starts to work your " + this.player.multiCockDescriptLight() + " free of ");
            if (this.player.cockTotal() == 1) this.outputText("its");
            else this.outputText("their");
            this.outputText(" oppressive trappings. You can feel her undoing the straps of your clothes before gazing at the significantly larger bulge that is held behind the fabric of underwear.  \"<i>How many layers of wrapping do you have on this thing?</i>\"  Phylla jokingly teases, hints of her shy and nervous nature can be heard as she fools around with you.");

            this.outputText("\n\nWith both sets of fingers placed in the fabric band of your undergarments, Phylla pulls downward and releases your " + this.player.multiCockDescriptLight() + ", ");
            if (this.player.cockTotal() > 1) this.outputText("all ");
            this.outputText("bobbing up");
            // Dick size less than 5 inches:
            if (this.player.cocks[x].cockLength < 5) this.outputText(" \"tall\" and proud, rock hard and ready for action.");
            else this.outputText(" tall and proud, rock hard and ready for action.");
        }
        else {
            // Dick size more than 60 inches (First Time):
            if (this.flags[kFLAGS.PHYLLA_BLOWJOBS] == 1) {
                this.outputText("\n\nPhylla jumps in to tug and free your member");
                if (this.player.cockTotal() > 1) this.outputText("s");
                this.outputText(" from your pants, but apparently doesn't realize just how big ");
                if (this.player.cockTotal() == 1) this.outputText("this");
                else this.outputText("these");
                this.outputText(" battering ram");
                if (this.player.cockTotal() > 1) this.outputText("s");
                this.outputText(" can get.  Chuckling at her ignorance, you tell Phylla she'd better back up.  Phylla rolls her eyes and looks up at you, giving you an unamused look.");

                this.outputText("\n\n\"<i>I-It can't be THAT big, [name]...</i>\"  She chiddingly remarks, causing you to raise an eyebrow in eager amusement.  You know she's not ready to meet the challenge you're about to unleash upon her.");
                this.outputText("\n\nYou work to release yourself from your clothing.  Once you're completely free you watch as Phylla's eyes widen in horror.  Smiling, you start to stroke your " + this.player.multiCockDescriptLight() + " and work ");
                if (this.player.cockTotal() == 1) this.outputText("it");
                else this.outputText("them");
                this.outputText(" up to a full raging erection, achieving your maximum state of \"<i>readiness</i>\" in no time at all.");

                this.outputText("\n\nDumbfounded, Phylla stares in awe at how big your " + this.player.multiCockDescriptLight() + " can really get; you can see the look of complete intimidation on her face and who could blame her?  You've seen ship cannons that pale in comparison to your man meat.");
                // If multiple cocks:
                if (this.player.cockTotal() > 1) {
                    this.outputText("\n\nShe's staring down a mighty series of threatening fleshy spears.");
                }
                this.outputText("\n\n\"<i>I don't know if I can... wow...</i>\" She sputters out.  Laughing out loud, you grin down at her and inform her that, in this instance, her slight ignorance IS bliss.  Twitching the muscles in your " + this.player.multiCockDescriptLight() + " to bob a bit in her face you let her know that you rose to the challenge; now it's time for her to \"<i>fulfill</i>\" her end of the bargain: the cock end that is.");
            }
            // Dick size more than 60 inches (subsequent blowjobs):
            else {
                this.outputText("\n\n\"<i>Okay, you're gonna have to be careful so we don't have a repeat of ");
                if (this.flags[kFLAGS.PHYLLA_BLOWJOBS] == 2) this.outputText("last time");
                else this.outputText("our first time");
                this.outputText(".  I'll help to free ");
                if (this.player.cockTotal() == 1) this.outputText("that monster");
                else this.outputText("those monsters");
                this.outputText(", but p-please be careful about my valuables.</i>\"  Phylla asks nervously.");
                this.outputText("\n\nYou tell her that as long as she's helping, there shouldn't be any \"<i>accidents.</i>\"  With synchronous effort, your hulking " + this.player.multiCockDescriptLight() + " ");
                if (this.player.cockTotal() == 1) this.outputText("is");
                else this.outputText("are");
                this.outputText(" freed once more, ready and raring to \"re-acquaint\" with Phylla.  Taking the hint, Phylla closes in and takes the ");
                // Dick size less than 16 inches:
                if (this.player.cocks[x].cockLength < 16) this.outputText("base");
                else this.outputText("middle");
                this.outputText(" of your shaft against her tongue.  You hear a mix of a giggle and hum as she drags her tongue towards the head of your " + this.player.cockDescript(x) + ".  Phylla teases your shaft as she reaches the peak and suckles at your urethral opening.  You feel her drawing up as much pre-cum as she can and lapping it up like she's dying of thirst.  She continues this for a bit, until it becomes apparent that she's either not too sure of what else to do, or that she's never heard of how to properly fellate someone.");
                this.outputText("\n\nWith a chuckle, you pull your " + this.player.cockDescript(x) + " away from her mouth and ask her to look up at you. Clearly embarrassed at your realization of her skills, she begins to tremor softly.  \"<i>S-sorry! I mean, I've never done this!  This act is uncommon for my people.  Such things are not proper for a queen to be...  taught, or learn.</i>\"  She apologizes, begging your forgiveness with her body language and demeanor.");
            }
        }
        this.menu();
        // (If Corruption less than 75 transitions to - Pure BJ Ending)
        if (this.player.cor < 75) this.addButton(0, "Next", this.purePhyllaBJOver);
        // (If Corruption more than 75 transitions to - Corrupt BJ Ending)
        else this.addButton(0, "Next", this.corruptPhyllaEndings);
    }

    // Pure BJ:
    private purePhyllaBJOver(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("ant-camp-give-pure-bj-cum"));
        const x: number = this.player.smallestCockIndex();
        this.outputText("You quickly and softly tell her to calm down, she needn't worry; you'll be more than happy to help her learn how as surely as she would help you if your situations were reversed.  At the mention of counter positions she nods cheerfully.");
        this.outputText("\n\n\"<i>You... know I'd d-do anything for you... I'll get good, I will!</i>\"");

        this.outputText("\n\nHappy and secure that you're willing to tolerate her lack of experience, Phylla lowers herself back down to your " + this.player.cockDescript(x) + " and gives you a tender lick on your head, slurping in all the pre-cum you've been accumulating.  You opt to help her with a more direct approach; you lower your hand down to her chin and tilt her head up so her eyes meet yours.  The tension in Phylla's jaw is fierce, and you tell her that she's putting too much thought and effort into this: just relax. You move your thumb over her lips and part her mouth slightly.  A calm washes over her as your directive registers.");
        this.outputText("\n\nPeacefully, you tell her to open her mouth just a bit and to let your " + this.player.cockDescript(x) + " slide into her mouth, advising her to watch the teeth.  Once she's got it in there, you tell her she can massage your head with her tongue and lips to begin with.  Eventually she'll work her way up to experimenting with the interior of her mouth.  Then once she gets that down, she can take you into her throat, but that's a more 'advanced technique.'");
        this.outputText("Taking your directions, Phylla takes the head of your cock along the top of her wet and humid tongue, leisurely batting around before trapping it with her lips.");

        // (If PC has Multidicks Add Section  - Multidick)
        // (If PC likes Anal Add Section - Anal)
        // (If PC has Vagina Add Section - Vagina)
        // (Else Continue to - Continuation)
        // Multidick:
        if (this.player.cockTotal() > 1) {
            this.outputText("\n\nGasping for a brief moment, you ask Phylla to tend to ");
            if (this.player.cockTotal() == 2) this.outputText("your other dick");
            else this.outputText("the rest of your dicks");
            this.outputText("; if she would be \"<i>so kind.</i>\" With gusto, her four hands shoot up and take your ");
            if (this.player.cockTotal() == 2) this.outputText("cocks into their firm grips");
            else this.outputText("cock into their firm grips");
            this.outputText(".  Phylla mumbles something but absentmindedly realizes she still has your cock in her mouth and gives up on whatever it was she was trying to say.");
        }
        // Vagina:
        if (this.player.hasVagina()) {
            this.outputText("\n\nYou ask Phylla if she can take care of your womanhood while she's at it.  Phylla moves one of her small arms in between your legs and rubs against your " + this.player.clitDescript() + ".  She caresses your labia in between her fingers before inserting them inside of you.  Phylla begins working her wrist diligently in conjunction with her head bobbing.");
        }
        // (Transitions to Continuation, below)
        // Continuation:
        this.outputText("\n\nPushing her short brown unkempt hair back past her ears, you take hold of her head and gently guide her mouth along all the sweet spots on your rod.  As she does you give her tips on how to better adapt her \"<i>technique.</i>\"  You learn that she's a quick study as she uses your suggestions to hit your sweet spots with startling precision... for a rookie.");
        this.outputText("\n\nMinutes fly by as you \"<i>teach</i>\" Phylla how to give proper fellatio, the time notably marked by some sensual moaning on your part... and some corrections in other parts when Phylla gets a little carried away with her sucking or when you feel teeth. Still, for her first time she's doing pretty well.");
        this.outputText("\n\nAfter a while of this, you think Phylla doesn't need guidance anymore and you start to relax yourself.  However, Phylla removes your cock from her mouth right as it's getting good.");
        this.outputText("\n\n\"<i>T-this... doesn't do me...  I~mean... I'm in heat now... can we join so... I can feel this too?</i>\" She looks as if she didn't want to say it at all but her growing sexual appetite seems to be overtaking her timidness.");
        // [Sure]  [Nope]
        this.menu();
        this.addButton(0, "Sure", this.surePhyllaLetsFuck);
        this.addButton(1, "Nope", this.nopeNotOnMouthOrWhateverFuckThisNoise);
    }

    // [Sure]
    private surePhyllaLetsFuck(): void {
        this.clearOutput();
        const x: number = this.player.smallestCockIndex();
        this.outputText("\"<i>We'll have to... kiss...  I mean, I can still taste you... inside my mouth...  I could go wash or... ah~!</i>\" You cut her off by pulling her mouth on to yours.");

        this.outputText("\n\nLike a tidal wave, her pleasures and emotions become one with yours, and you can feel the sensation of her longing for more of your " + this.player.cockDescript(x) + " along her tongue.  You feel how her mind has given into the texture, the scent, the taste of your dick.  It's almost as though she doesn't want to stop - how cute she finds stimulating that one little area of your dick when she wants a shot of pre or how she wants to coax more and more precum out of you until you explode in her mouth.  You feel her wanting to try some more of those 'advanced techniques' you mentioned before, wanting to try and drive your cock down her throat and flood her gullet with all the cum you can muster.  A symphony of ideas and images ring out, drowning your thoughts and overwhelming you with a single chorus chant.  Phylla's voice stands out: \"<i>Cum. Cum! CUM! <b>PLEASE I NEED IT! CUM!</b></i>\"");

        this.outputText("\n\nYou open your eyes to find Phylla staring up at you; you didn't even feel her break the kiss.  Never breaking her longing gaze, she once again wraps her mouth around your member and starts bobbing up and down.  Her eyes continue to lock on yours looking like a begging dog.  You feel the shaft and head of your cock rub along her lips as if you were fellating your own member.");
        // If PC can Autofellatio:
        if (this.player.canAutoFellate()) this.outputText("\n\nThis isn't really a new experience for you, but it's different this time as you feel Phylla's mind being overcome with the need for your nectar.");
        this.outputText("\n\nShe beseeches both your mind and your body to orgasm and fill her mouth and stomach with your seed.");
        // (Leads to - Pure BJ Ending)
        this.pureBJEnding(true);
    }

    // [Nope][w
    private nopeNotOnMouthOrWhateverFuckThisNoise(): void {
        this.clearOutput();
        this.outputText("You pass on her offer, not wanting to know what THAT sensation");
        // If PC can't Autofellatio:
        if (!this.player.canAutoFellate()) this.outputText(" or anything like it would feel like.");
        else this.outputText(" feels like with Phylla's mind linked to your own.");

        this.outputText("\n\nShe whines playfully, but respects your wishes. Getting back into it, she doesn't hold back. Acting as if this is a daily routine for her, she once again stimulates that one little area of your dick when she wants a shot of pre.  You can feel how she wants to coax more and more precum out of you until you explode in her mouth, how she wants you to drive your cock down her throat and flood her gullet with all the cum you can muster.");
        this.outputText("\n\nYou open your eyes to find Phylla staring up at you, never breaking her longing gaze as she gives a look that begs, beseeches you to orgasm and cave to her desires for your seed.");
        // (Leads to - Pure BJ Ending)
        this.pureBJEnding(false);
    }

    // Pure BJ Ending
    private pureBJEnding(linked: boolean = true): void {
        this.outputText(this.images.showImage("ant-camp-give-pure-bj-cum"));
        this.outputText("\n\nTo your surprise, Phylla has fully embraced this new talent you've helped 'teach' her");
        if (!linked) this.outputText(".");
        else if (this.flags[kFLAGS.TIMES_LINKED_BJ_SUCK] == 0) {
            this.outputText(", ");
            // If PC linked, first time occurring:
            this.outputText("leading to you jesting through the link and calling her a damn dirty cheater.");
        }
        if (this.flags[kFLAGS.TIMES_LINKED_BJ_SUCK] > 0) this.outputText("  You can feel her relying less and less on the link with every subsequent time; there's no doubt in your mind that she will no longer \"<i>cheat</i>\" her way into making you cum before you know it.");
        const x: number = this.player.smallestCockIndex();
        this.outputText("\n\nShe giggles up at you as she bobs back and forth along your shaft, sensing the telltale signs of your pending orgasm with her mouth.  When you feel the moment of climax finally arrive, you grab onto the back of her head with your hands. She jumps at the unexpected feeling, but before she can react you roar, thrusting your hips forward.  Phylla, like a pro, times her motions with your release, drawing a steady stream of semen out of your rod.  With each spasm of your cock you shoot your cum into her mouth.  She doesn't relent until she's got a mouthful, pulling free of your " + this.player.cockDescript(x) + " as ");
        if (this.player.cumQ() < 250) this.outputText("thin");
        else if (this.player.cumQ() > 1000) this.outputText("thick");
        this.outputText(" strands of cum hang wildly between her lips and your prick.");
        // If cum volume over 1000ml::
        if (this.player.cumQ() > 1000) this.outputText("  Though she might have a mouthful, you're not finished yet!  You continue to unload the remainder of your hot load on her breasts and stomach.");
        if (this.player.cockTotal() > 1) {
            // If multi cock::
            this.outputText("  Your other cock");
            if (this.player.cockTotal() > 2) this.outputText("s shower");
            else this.outputText(" showers");
            this.outputText(" her hands and body in your white goo as she continues to pump ");
            if (this.player.cockTotal() == 2) this.outputText("on each of ");
            this.outputText("them lovingly.");
        }

        this.outputText("\n\nWith a heavy sigh, and significantly lighter ");
        if (this.player.balls > 0) this.outputText("balls");
        else this.outputText("in the pelvis");
        this.outputText(", you rub Phylla's hair playfully");
        if (this.flags[kFLAGS.PHYLLA_BLOWJOBS] != 1) this.outputText(".");
        // If first time:
        else this.outputText(" and congratulate her on her first time.");

        this.outputText("\n\nShe smiles, but you notice that her cheeks are puffed up; turning your head quizzically, you ask Phylla what's she doing.  Embarrassed, she blushes and opens her mouth.  All of your deposit clings to her tongue and teeth. She can't talk but you can tell that she's looking for direction.");
        this.player.orgasm('Dick');
        // [Swallow it up]   [Spit it out]
        this.menu();
        this.addButton(0, "Swallow It", this.swallowDatJismPhylla);
        this.addButton(1, "SpitItOut", this.spitItOutYouCunt);
    }

    // [Swallow It]
    private swallowDatJismPhylla(): void {
        this.clearOutput();
        this.outputText("Placing your hands on your hips, you smirk and tell Phylla that a true queen never spits. Phylla shoots you a slutty look and gulps your load greedily, taking a moment to savor the warmth and texture as it works its way down her throat.  She ahhhs loudly as she rubs her stomach, humming in pleasure as the steamy load spreads its heat to her belly.  \"<i>Thank you, [name].  That hit the spot.</i>\"");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [Spit it out]
    private spitItOutYouCunt(): void {
        this.clearOutput();
        this.outputText("Crossing your arms, you tell Phylla to spit your load out.  As you dress yourself back up in your [armor], you hear Phylla frantically dig out a hole in the floor.  She playfully leans over and spits the salty payload into it.  She makes a soft hum when she's finished, before quickly covering it up again.  \"<i>Thank you, [name].  Next time I'll do better, I promise.</i>\"");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Corrupt BJ Ending
    private corruptPhyllaEndings(): void {
        this.clearOutput();
        const x: number = this.player.smallestCockIndex();
        this.outputText(this.images.showImage("ant-camp-give-corrupt-bj-cum"));
        this.outputText("\"<i>A slut that can't suck a dick... how can this get any worse?</i>\"  You ponder to yourself while rubbing your nasal bridge. You tell the innocent little ant that she'll learn how to suck a mean cock, even if it kills her.  You're knee deep at this point - might as well turn her into something salvageable.  Commanding her attention, you lift her face up and hover your " + this.player.cockDescript(x) + " close to her lips, smothering her lips with your precum.  She attempts to turn away but you react before she can.  Holding her head in place you comment on how this is what you want from her.");
        this.outputText("\n\n\"<i>Open wide!</i>\"  You forcefully tell her.  Phylla does it immediately, seeing that you're using your 'serious voice.'  You slide your cock in and smash into her tongue.  Smirking, you instruct your fuck toy to close up her mouth and form a tight seal around your rod; you have no intention of fucking an orifice that resembles a goblin brood mother's twat.  Phylla complies, but pulls away to hesitatingly ask if she's ");
        // If first time:
        if (this.flags[kFLAGS.PHYLLA_BLOWJOBS] == 1) this.outputText("achieved the desired effect.");
        // Every other time:
        else this.outputText("improved since the last time.");

        this.outputText("\n\nYou brutishly confirm she has by grabbing the back of her head and shoving it back onto your cock.  With an apathetic tone, you snidely remark that this is how she needs to react every time you approach her.");
        this.outputText("\n\nPhylla groans at the rough treatment, not used to being treated so coarsely as your " + this.player.cockDescript(x) + " lunges back and forth in her mouth, grinding along her cheek and tongue. Your cock seems to have a mind of its own as you somehow manage to wrap her tongue around yourself, knowing full well Phylla lacks the technique required to do it on her own.  The little queen is about to receive a rude awakening about pleasing her master.");
        this.outputText("\n\nMoan after muffled moan escapes from Phylla's mouth as you continue your callous fucking of her delicate little face.  Your little slut is trying her best to keep up with your thrusts but is ultimately failing.  Perhaps she needs a little motivation?  Withdrawing your " + this.player.cockDescript(x) + ", you tell her she doesn't get to suck your dick anymore unless she fingers her tight little hole. Desperate to fulfill your desires, she quickly darts a hand to her pussy and fingers that little fuckhole like her life depends on it.  Within seconds you see her long clit protruding, begging to be touched.");

        // (If PC has Multidicks Add Section  - Multidick)
        // (If PC likes Anal Add Section - Anal)
        // (If PC has Vagina Add Section - Vagina)
        // (Else Continue to - Continuation)
        // Multidick:
        if (this.player.cockTotal() > 1) {
            this.outputText("\n\nGasping for a brief moment, you ask Phylla to tend to ");
            if (this.player.cockTotal() == 2) this.outputText("your other dick");
            else this.outputText("the rest of your dicks");
            this.outputText(" if she would be \"<i>so kind</i>\".  With gusto, her four hands shoot up and take your cocks into their firm grips.  Phylla mumbles something but absentmindedly realizes she still has your cock in her mouth and gives up on whatever it was she was trying to say.");
        }
        // Vagina:
        if (this.player.hasVagina()) {
            this.outputText("\n\nYou ask Phylla if she can take care of your womanhood while she's at it.  Phylla moves one of her small arms in between your legs and rubs against your " + this.player.clitDescript() + ".  She caresses your labia in between her fingers before inserting them inside of you.  Phylla begins working her wrist diligently in conjunction with her head bobbing.");
        }
        // Continuation:
        this.outputText("\n\nCongratulating her for her hasty heeding of your wishes, you ram your " + this.player.cockDescript(x) + " back into her mouth and continue the face fucking once more.  Phylla picks up the effort as she starts working her head and tongue in tandem with your hips.  Soon she's driving you perilously close to an orgasm.  With one last directive, you ask Phylla if she's ready to receive your seed.  Though since you continue your brutal fucking of her mouth, she has no opportunity to reply.");
        this.outputText("\n\n\"<i>WELL?!</i>\" You cheekily yell, making sure your shout echoes off the walls.  Phylla looks up at you with glazed over eyes, letting out a soft appreciative moan from behind your cock.  You act deaf and decide to ask her again, telling her you can't quite \"<i>hear</i>\" her.  Another moan, much louder than the last, rings out from Phylla's full mouth.  Her tongue works at a rapid pace, as if begging you to flood her mouth with your cum and drown her taste buds in your salty surprise.");
        this.outputText("\n\n\"<i>That's more like it,</i>\" you think to yourself, lowering your other arm to the back of her head as you pump her like the local well.  The pressure in your loins cannot be contained any longer; the orgasm your body craves will not be denied this day!  Your cock flexes as a wave of ecstasy washes over you.  Grunting with great relief and release, your semen rushes into her mouth, filling her wanting craw with your salty jizz on the first salvo.  Her tonsils takes the brunt of the second salvo, followed by the back of her throat for the third.  Pulling out, you point your spasming spear of lust into Phylla's face, giving her a ");
        // If PC has under 10ml of Cum:
        if (this.player.cumQ() < 10) this.outputText("tiny");
        else if (this.player.cumQ() < 100) this.outputText("respectable");
        else this.outputText("massive");
        this.outputText(" facial, covering her petite features in cum.");

        // Silly Mode, cum multiplier huge  (Red Letter Media reference)]:
        if (this.silly()) {
            this.outputText("\n\nYet, your constant stream does not stop.  It gets worse - much worse!  The flow of cum simply cannot be controlled as your loins release their fury into Phylla's face.  \"<i>OH, GOD! I CAN'T STOP CUMMING! OH, FUCK!</i>\" You howl out.");
            this.outputText("\n\nPhylla certainly doesn't mind though, bathing her body in your torrent of cum as you continue your painful and torturous ejaculation.  The pain causes your deranged howls to become deeper and longer, echoing throughout the colony as your body squeezes your loins like a package of soy, emptying you out all over your horny slut until there's no sperm left in your ");
            if (this.player.balls > 0) this.outputText("[balls]");
            else this.outputText(this.player.cockDescript(x));
            this.outputText(".  Somehow, you succeed your fortitude roll and remain conscious without passing out even after plummeting to the ground from sheer exhaustion.  You and Phylla can't help but slowly drift off to sleep in a pool of your cum to dream about the bizarre pleasures you two have indulged in.");
        }
        // (If silly mode is engaged. Transition to End of blowjob scene (silly)
        // (Else transition to end of blowjob scene (non-silly)
        // End of blowjob scene (non-silly mode)
        if (!this.silly()) {
            this.outputText("\n\nPhylla works your " + this.player.cockDescript(x) + " the entire time you cum, as if pleading for just a little more to come out.  You grab her hands, signaling you've have just about enough.  Coming down from your climax, you thank your slut for the oral and sit down on the bed and start gathering your scattered clothing.");
            this.outputText("\n\nHowever, you realize Phylla isn't done with her clit yet.  You had almost forgotten you even asked her to play with herself in the first place.  She sits back against the cushion that you might consider her \"<i>headboard</i>\", spreading her legs wide, giving you a full view of herself.  You dismissively tell her to finish herself off, watching in both pride and amusement as your slut eventually brings herself to orgasm.  She violently arches her back, forcing herself up onto her knees as she rubs her cunt furiously.  Her juices seem to flow freely and pool below her. Her moans of orgasm ring through your being and it brings you a great sense of joy at her ability to listen to and obey her master's commands.  Once you're sure she's finished up, you're amazed by the amount of cum she produces as the liquid seems to squirt out from between her legs long after her own orgasm.  You decide to help Phylla to her feet; can't have injured or sidelined lovers, can you?");
        }
        // End of blowjob scene (silly)
        else {
            this.outputText("\n\nAs you stir from your impromptu slumber, you feel the pangs of discomfort shooting up your back. Sleeping on the floor sounds good when you're dead tired, but you always end up regretting it when you wake from the land of dreams. Rising to your feet, you take note of the impact you've had on Phylla's room; she's gonna be busy cleaning this place up to be sure.  The quiet groan of bliss coos forth from your naive lover, and for a moment you are left to consider leaving her on the floor and getting on with your day. Though, can you afford a sidelined lover when your loins stir with need once more?");
        }
        // ***Both mode endings converge here***
        this.outputText("\n\n...Can you? You muse again, thinking about it.  After a few moments of helping Phylla to the pile of, now very wet, cushions she calls a bed, you finish donning your [armor] and head back to the surface.");
        this.player.orgasm('Generic');
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // \"<i>Use Dick</i>\"
    private dickPhylla(): void {
        const x: number = this.player.biggestCockIndex();
        this.clearOutput();
        this.outputText(this.images.showImage("ant-camp-vagsex"));
        this.outputText("You give Phylla a devious look that denotes you didn't come here to just talk.  She looks a little surprised and embarrassed for you as you start removing your [armor].  Noticing her watching, you pull each article of clothing off a little slower, letting her lust build.  You seductively drop your armor, completely revealing yourself to her.  You can see her eyes widen as she visibly feasts on your features.");
        // (NO BJ experience)
        if (this.flags[kFLAGS.PHYLLA_BLOWJOBS] == 0) {
            this.outputText("\n\nYou see it suddenly dawn on her that you're completely nude. Phylla quickly turns her head away but you see her eyes still very focused on your manhood");
            if (this.player.cockTotal() > 1) this.outputText("s");
            this.outputText(".");
            this.outputText("\n\n\"<i>I... what do you want me to...?</i>\"");
            this.outputText("\n\nCutting her off, you gently place your hand on the back of her head as " + this.player.sMultiCockDesc() + " hardens even further.  With a slight pressure you force Phylla's head down onto the head of [oneCock]. At this point she gets the picture.");
        }
        // (Phylla has BJ experience)
        else {
            this.outputText("\n\nLeaving all modesty behind, she scampers over and quickly drops down to her knees, taking your quickly hardening cock into her mouth and against her tongue.  You feel it wrap around the head of your penis as she starts bobbing her head trying her best to fit as much of you into her mouth as she can.");
        }
        this.outputText("\n\nOnce she's gotten you sufficiently stiff, she uses her tremendous strength to push you onto your back - clearly she wants to be on top first.  Holding your shoulders with her two upper hands, she guides your cock to meet her dripping cunt with her lower two.");

        // (If Phylla is not laying Eggs)
        if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] == 0) this.outputText("\n\nPhylla bends her abdomen so that the underside tip of it runs down the ridge of your shaft, leaving a very warm clear liquid on your privates that tingles, causing you to groan in pleasure.");

        this.outputText("\n\nOne of her lower hands starts to slowly pump your member as she starts to touch her long clit with the other.  Even pinned as you are, you can see her clit start to grow and stick out between her lips.  \"<i>Can I...  I mean... can I put you... inside me?</i>\"");

        // 3-4 times:
        if (this.flags[kFLAGS.PHYLLA_FUCKS] >= 3) this.outputText(" she asks playfully, knowing full well that that's what you came here for.");
        // (First time)
        else if (this.flags[kFLAGS.PHYLLA_FUCKS] == 0) this.outputText(" You nod quickly.");
        // (Subsequent fucks)
        if (this.flags[kFLAGS.PHYLLA_FUCKS] > 0) this.outputText("\n\n\"<i>Do you have to ask?</i>\"  You ask her while grinning mischievously; something that causes her to smirk back at you.");

        // 3-4 times:
        if (this.flags[kFLAGS.PHYLLA_FUCKS] >= 3) this.outputText("\n\nShe seems like she's losing some of her shyness, or at the very least feels comfortable enough around you to assert more of her personality.");

        this.outputText("\n\nYou watch as she spreads herself apart for you and guides your cock into her.  As the head of your penis enters her, she lets out a weak moan.  Then in a wicked attempt to make her cum, because you know it's so easy, you thrust your hips upwards forcing as much as you can into her.");
        this.outputText("\n\nHer eyes widen in surprise as your " + this.player.cockDescript(x) + " fills her.  She howls a blissful scream as she drools forth her girl fluids, coating your cock ");
        if (this.player.balls > 0) this.outputText("and balls ");
        this.outputText("in her sexual liquids.");

        this.outputText("\n\nWithout missing a beat, she starts to writhe on top of you, riding your cock.  You feel the walls of her pussy squeeze your cock in a pulsing beat.  Each time your cock is deepest inside her, she rocks her hips at the perfect angle so you experience the full pulsating brunt of her cunt along your shaft.  Phylla picks up speed as her hips rise and fall on you, faster and faster.  Her quiet moaning turns to unabashed screams as waves of pleasure wash over both of you with each thrust.");

        this.outputText("\n\n\"<i>I... this feels... gods!  More!</i>\"  You hear Phylla's futile attempts to construct a sentence between ecstatic exhales and moans.  She throws her head back, arches her back and shifts her upper hands from your shoulders to your legs as she starts to ride you like you're a stolen stallion. Glancing between your legs you see her clit peeking out from between her folds as her body pumps away on top of you.");

        this.outputText("\n\nReaching down you give her hardening love knob a light pinch.  This causes your lover to roar in pleasure, and momentarily pause her thrusts onto you.  \"<i>Harder!  Please!</i>\"  She implores you as she picks up her pace.");

        // PC has only two to four dicks, and a vagina:
        if (this.player.cockTotal() >= 2 && this.player.cockTotal() <= 5) {
            if (this.player.hasVagina()) {
                this.outputText("\n\nAs Phylla pleasures your cocks she uses another hand to make sure your lady parts are seen to as well.");
                // (Transitions to Vagina Dialog)
            }
            else {
                this.outputText("\n\nYou look at Phylla and shrug at her, telling her you aren't sure if you can do that, given that you have some... 'members' that are feeling a little left out.  With a flirty yet annoyed expression,  your lover reaches down and takes hold of your unloved  " + this.player.multiCockDescriptLight() + ".  She coos as she starts to pump ");
                if (this.player.cockTotal() == 2) this.outputText("it");
                else this.outputText("them");
                this.outputText("slowly.");
                // (Transitions to First Time/Subsequent Times)
            }
        }
        // PC has over five dicks:
        if (this.player.cockTotal() > 5) {
            if (this.player.hasVagina()) {
                // PC has over four dicks and a vagina:
                this.outputText("\n\nAlthough she attempts to use all of her hands to pleasure as many cocks as she can, even switching between them proves to be too much for the ant morph.  \"<i>There's too many; I can't take care of all of them!</i>\"  You gesture to your [vagina], as if to tell her she can at least take care of three of your cocks and your wet pussy.");
                // (Transitions to Vagina Dialog)
            }
            else {
                this.outputText("\n\nAlthough she attempts to use all of her hands to pleasure as many cocks as she can, even switching between them the task proves too much.  \"<i>There's too many; I only have so many hands! I can get four of them but the rest will have to remain unattended for now.</i>\"  You sigh, but you knew that might have been a problem going in so you tell Phylla to do what she can.");
                // (Transitions to First Time/Subsequent Times)
            }
        }
        // Vagina Dialog:
        if (this.player.hasVagina()) this.outputText("\n\n\"<i>Let's see how you like it!</i>\" Phylla whispers being playfully aggressive.  She reaches down with one of her uncocked hands and pinches your [clit].  Immediately a wave of euphoria washes over you and you respond by giving her long clit a pinch back.  You both moan in unison, then look at each other and chuckle, breathing heavily.");
        // First Time, PC is multi-genitaled:
        if (this.player.gender >= 3) {
            if (this.flags[kFLAGS.PHYLLA_FUCKS] == 0) this.outputText("\n\n\"<i>God I have to get better at this, leaving my lover's sex all alone...  L-let me fix that.</i>\"  She spits out between moans of pleasure, slightly embarrassed that she forgot her lover's OTHER genitalia. Wasting no time in order to make up for her \"<i>mistake,</i>\" Phylla does her best to please every part of your body.");
            // (Transitions to Phylla does Vulcan shit to PC)
            // Subsequent Times, PC is multi-genitaled:
            else this.outputText("\n\n\"<i>Y-you are really gonna push this aren't you? Involving all of your genitalia?</i>\"  She delightfully teases you between moans of ecstasy. Smirking, you just say sometimes she forgets about all your other 'friends'.");
        }

        // Phylla does Vulcan shit to PC:
        this.outputText("\n\nSatisfied, you give her love button another good hard pinch between your thumb and index finger.  \"<i>Oh, please, don't sto~!</i>\" She tries to say as her breath is stolen away - a labored moan is all that escapes as you feel her insides tighten around your dick.  The warmth of her body sends surges of pleasure up your cock.  \"<i>I need...  I need more...</i>\"  She says panting.  You can see her eyes have got a strange glaze over them.  \"<i>I need you.  In my mind.  Now.</i>\"  She desperately states as she mindlessly lunges towards your face, connecting your lips with hers.");

        this.outputText("\n\nAs her tongue enters your mouth you feel your minds sync with each other immediately.  Your eyes roll up in the back of your head momentarily before you snap back into the present, feeling her needs, her desires, as she feels yours.  You see an image of the first time you mounted her and you have the distinct feeling she wants to do that again.  You feel her experiencing every detail, every contour of your cock inside her.  Savage, raw emotion overtakes all your senses as your mind attempts to deal with the relentless foreign influx of feelings, sensations, and thoughts.  It's hard to tell who's really, REALLY getting off to the sex at this moment.");

        this.outputText("\n\nPhylla's hips slow and eventually cease rocking on top of you.  The foreign desire to change positions quickly enters your mind.  Biting her lip, Phylla raises her hips and softly moans as the head of your cock flicks her clit on its way out of her drooling cunt.");

        this.outputText("\n\nPhylla turns herself to face away from you on all fours... or in her case, all sixes.  She raises her ass into the air as if beseeching you to mount her; the lingering taste of her connection to you gives you a small idea of the desire she has for having you dominate her and fuck her until you gush forth with the seed of life.  Her posture the only motivation you'll ever need, you shift your hips to insert yourself from behind her.  Her abdomen rises upward and she uses one of her smaller sets of arms to spread herself wide open for you.  She turns to look back at you and you feel her in your mind, calling for you to take her and for you to assume utter control of the act.");

        this.outputText("\n\nTaking her \"<i>hint,</i>\" you slam your cock into her pussy, making sure to get as deep as you can. Your initial thrust makes a very loud, squishy noise as your cock enters her soaked canal.  Your mind almost blacks out from the sheer sensual overload you both feel as a shared consciousness, unable to handle both hers and your own.  Phylla's head collapses into her hands as she releases a series of stammering moans.  Her hips twitch slightly with euphoria as she starts to slowly move up and down, her body desperately begging for more cock.");

        // If PC only has the two non TD dicks (greater than 42 inches):
        if (this.player.countCocksOfType(CockTypesEnum.TENTACLE) == 2) {
            this.outputText("\n\nNow content with her efforts, Phylla's body sucks in your long cock as your other is deep inside her. You feel her warm breath escape the seal she's made around the head of your cock when you hit the right spots inside her that cause her to moan.");
        }
        // (Transitions to Doggy style Phylla or If PC has TD)
        // PC has more than two Tentacle dicks (greater than 42 inches):
        else if (this.player.countCocksOfType(CockTypesEnum.TENTACLE) > 2) {
            this.outputText("\n\nNot content with just a little oral attention, you slither your other tentacle cocks up to her hands and give them a hard smack, soliciting a surprised hum from Phylla.  Seeing her lover's tentacle penile appendages caressing the back of her hand helps to clue her in that she still has some \"<i>capacity</i>\" to service you.  Propping herself upwards with a pillow, Phylla takes to leaning on her elbows as she begins to stroke and tease your cocks, coaxing a small flow of pre-cum in the process.");
            // (Transitions to Doggy style Phylla)
        }
        // PC has one-two dicks 42 to 48 inches in length:
        // if (player.cockTotal() >= 2)
        // outputText("\n\nWell, if she wants more dick, then maybe she can be persuaded to put her mouth to use?  Expertly positioning your prick(s), you give her a quick jab in the chin in order to get her attention, causing her to look up at your over her shoulder.  You give her a knowing look and shoot a glance down at what poked her in the chin; she follows your gaze.  \"<i>Well, you did want more of them,</i>\" you convey to her with a wickedly playful grin, as though you're a kid in candy shop.  Phylla takes to your  " + player.cockDescript(a/ & b) + " with a zeal you've never seen before, especially in a woman so shy and uncertain. (Transitions to Doggy style Phylla)

        // Doggy style Phylla:
        this.outputText("\n\nYou give her body what it wants as you start humping her; using her abdomen as a brace, you reach a very staccato rhythm with your thrusts as she spreads out all four of her arms in front of her to hold herself in place.  With almost every other pump you feel her mind and her body building to orgasm, flooding your mind with thoughts of doing the same.  Her cunt seems to be calling upon you to fill it as it clamps down tighter with each plunge of your cock.");

        this.outputText("\n\nHolding out just isn't feasible anymore, and with one more great slam into her, you get as deep as you can and pin [oneCock] inside Phylla as you release the hot seed of life.  As your grip tightens around her abdomen, you hear her let out a gleeful cry of satisfaction.  The quivering mass of meat spear causes her to orgasm as well, washing your lower body in her warm sweet-smelling girl cum.  You feel her transmit the feeling of her insides swallowing your load, as her pussy's spasming starts to subside.");

        this.outputText("\n\nYou both collapse in a hot, sweaty... and sticky heap, dozing off for quite some time only to wake after an hour of uninterrupted sleep, a bit hung over from the mind sharing and physically fatigued from the romp.");

        this.outputText("\n\nPhylla stirs next to you, and groggily says, \"<i>You should come down more often.  I mean...  I miss you sometimes...</i>\"  Her shyness returns as she slowly recovers from the small sex-coma you placed each other in.  You say you'll think about it and wink at her as you get dressed and head back to camp, leaving her to eagerly await the next time you come to take her once again.");
        this.player.orgasm('Dick');
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Straight Sex (Lesbian/Fisting) - Written
    private lesbianFisting(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("ant-camp-female-fisting"));
        this.outputText("You give Phylla a seductive smile as you start to remove your armor; you came here for something all right, but the surprised look on your lover's face shows she hasn't quite caught on yet.  Her eyes dart back and forth between watching you disrobe and staring at the stony ground in a confused manner, as if torn between modesty and desire.  Flirtatiously, you toss your underwear on the ground in front of where Phylla's eyes seem locked.  Her head snaps up in surprise; you're not sure what she was expecting, but clearly seeing you in your birthday suit wasn't it.  You strut over to her, putting on your best version of a succubus's sway in your step.  Once you reach Phylla, you take a seat on the edge of her raised stone bed and slowly cross your legs.");
        this.outputText("\n\nYou ask Phylla to look at you.  As she does, you tantalizingly uncross your legs, spreading them open so Phylla can glimpse your exposed body.  You even decide to go as far as to grab one of your breasts and caress your nipple playfully.");
        this.outputText("\n\n\"<i>Do you... want me to... I mean, you know...</i>\" she says shyly as she blushes.");
        this.outputText("\n\nWithout saying a word, you extend your hand and beckon her over to you with a hooked finger. Raising your eyebrows seductively, you make your intent crystal clear for her.  She quickly scampers off the bed and kneels in between your [hips].  Her upper two hands hold your legs apart, resting on your inner knees.  Her smaller set of hands gently begin to massage your inner [legs] right on the sides of your pussy lips, driving pleasure through your thighs.  It's not long before beads of lubricant start to flow out of your quickly moistening labia, a slight moan of sexual excitement slipping past your lips as Phylla's tongue starts to lick the lubricant coming out of you, pausing only briefly to taste your juices in her mouth like a fine wine.  You fall forward as her mouth finds your clit, wrapping your hands around her head to encourage her to continue.  Your legs attempt to wrap around her head but her upper arms' tremendous strength prevents them, leaving you \"<i>hopelessly</i>\" wide open for her assault.  Her lower hands stop massaging you, and for a moment leave you to wonder what's going on down there.  As you're about to ask why she stopped, her mouth plays erotically with your clit and one of her smaller hands spreads you wide open.");

        // If PC has cocks:
        if (this.player.hasCock()) this.outputText("\n\nNot wanting to deprive you of what your body painfully wants, Phylla grabs hold of [oneCock] and starts pumping away as she does wonders on your female anatomy with her mouth.");

        this.outputText("\n\nMoaning loudly into the air, the aroma of earth, sweat, and sex fills your nostrils.  You can't help but feel a little embarrassed to be so fully exposed to her, but that quickly passes as one of her fingers slips along your labia and brushes past the opening of your " + this.player.vaginaDescript() + ".  Guided by the wetness of your ever eager pussy, her hard fingertips slide forward into your body.  You moan again at this slow insertion.  Encouraged, Phylla rubs up and down the walls of your vagina, leisurely at first but with mounting vigor, searching for your G-spot.");

        this.outputText("\n\nHearing you moan louder and more deeply, her fingers prove dexterous as they reach deep inside you. Again your legs spasm and attempt to collapse on Phylla's head, but she holds firm, denying your lower body the closeness it craves with the lover that is penetrating your pussy so well.  You start to pant heavily, releasing soft moans every time her fingers go deeper into you.  She lovingly nibbles on your pleasure knob and thrusts yet another finger inside you.  You arch your back, crying out in intense pleasure and instinctually thrusting your hips towards her face, forcing it to grind on your cunt.");

        this.outputText("\n\nHer mouth releases from your clit and her fingers slip out of you, sending a pleasing shiver down your spine.  You look between your legs as Phylla looks hungrily up at you, her mouth covered in your juices.  She runs her tongue along her upper and lower lips then starts to gracefully suck your nectar off of each of her fingers that were inside you, making sure not to miss any.");

        this.outputText("\n\nOnce she's done cleaning herself she starts to kiss her way up your body, making weak but cute sounds as she steadily climbs.  She runs all four of her hands across the most sensitive parts of your flesh as her small kisses make their way from your wet cunt up your stomach, in between your breasts, up the side of your neck, nibbling on your earlobe, and finally coming to rest on your own lips.  Your lips lock as she cups your breasts with her large hands and pinches your pair of nipples with her smaller hands.  You begin to moan but Phylla's tongue enters your mouth and cuts off your attempt at vocalizing your euphoria, seemingly wanting you to show her your pleasure instead.");

        this.outputText("\n\nYour minds instantly synchronize with each other.  Sudden warmth is felt, an almost uncomfortable heat coming from between Phylla's legs.  As tongues entwine, you reach a hand down between Phylla's legs to feel the \"<i>flame</i>\" of lust right above her pussy.  Phylla's mind reaches out, begging for your touch, asking you to please her, to make love to her.  Knowing she's probably soaked, you reach up to touch the slick slit between her legs and are pleased to find you were right on the money.  Feeling her long stiff clit rub against your palm, she gasps as an unforeseen wave of pleasure shoots up her body.  Knowing the link is made, you break the kiss and grin.");

        this.outputText("\n\nHer whole body starts slowly thrusting on top of you, hard nipples rubbing against your own as she rocks back and forth, working her clit along your hand.  Suddenly, you curl two of your fingers around her on one of her gyrations backwards.  She moans loudly, her upper half collapsing onto your chest as she unknowingly forces your two fingers into her.  Her hips quickly start writhing on top of your fingers as she breathes sighs of ecstasy into your breasts.  Your fingers start to expertly work their way deeper and deeper into her with each thrust.  She sits upright on top of you, her vagina hovering just above your now drenched hand.  Feeling her in your mind... she's playfully hiding something from you but you can't find out what it is as you're lost in the shared pleasure.  Phylla's eyes meet yours and with an almost pleading tone she implores, \"<i>I need you, to do this, I want this... please~</i>\"");

        this.outputText("\n\nIn your mind's eye you see your fingers make a spear-like formation and you instantly understand what Phylla wants.  You smile wickedly as you heed her wish, making your hand like the tip of a spear, knowing full well what will happen next, and in that moment Phylla drops her hips.  You feel her excitement as all four fingers enter her with alarming speed and force, stretching the walls of her pussy wide, happening upon her G-spot in a sheer stroke of luck.  The link, sharing all of its intricacies and sensations, floods your body with the wild satisfaction this shy little woman has, and you scream in ecstatic pleasure.  One of Phylla's larger hands");

        // (If pussy is Virgin or tight:)
        if (this.player.hasVirginVagina() || this.player.vaginalCapacity() <= 10) this.outputText(" tries to fit itself into you, only managing to insert her fingers into your pussy.  Despite the \"<i>setback,</i>\" Phylla");
        // (If pussy is loose or gaping: Continues as follows...)
        this.outputText(" thrusts into your cunt simultaneously.  You feel her hit the right spot, and an explosion of ecstasy floods your bodies as your minds join together in shared orgasm.  She squirts her warm girl cum all over you, coating your stomach in the sweet smelling liquid.  In return you cum into her hand and release what girl cum you can, but it's nowhere close to as much as Phylla produces.  You slowly remove each others' hands from their respective vaginas and collapse into each other's arms.");

        this.outputText("\n\nYou wake up about an hour later, still smelling of sex and covered in each other's fluids.  \"<i>You should come down more often.  I mean... I miss you sometimes...</i>\"  Her shyness returns as she slowly recovers from the small sex-comas you had placed each other in.");

        this.outputText("\n\nYou say you'll think about it and wink at her as you get dressed and head back to camp, leaving her to eagerly await the next time you come to take her once again.");
        this.player.orgasm('Vaginal');
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [While Giving Birth]
    // (Note: The above option will only be available if Phylla is 'Laying Eggs.')
    // While Giving Birth (Male) - Written
    private dudesFuckEggLayingBitches(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("ant-desert-male-preg-vagsex"));
        this.outputText("Phylla looks completely taken aback when you suggest you want to have sex with her.  Obviously self conscious about how she looks right now, she covers her enlarged breasts with all four of her hands as she sits back in her seat.");
        this.outputText("\n\n\"<i>Are you sure... I mean I could change... to be smaller.  It won't take long...</i>\"  She glances behind her at her engorged abdomen.  \"<i>Ummm... yeah, it won't ta-AHH!</i>\"");

        this.outputText("\n\nShe stops mid-sentence as a contraction shoots through her body; you watch as it makes her whole body tense up.  Then with an almost sexual moan she shudders as all her muscles relax and the contraction pushes a cylindrical egg out from the birthing slit at the tip of her abdomen.");

        this.outputText("\n\nAs if on cue, one of your many children quickly runs in from the shadows and scoops up the egg to remove it and take it somewhere deeper into the colony.  Clearly there's some kind of greater system going on here.");
        this.outputText("\n\nPhylla slowly recovers and looks back at you, trying to remember why you dropped by.  Then you, with a wicked smile, watch as her eyes widen in remembrance.");

        this.outputText("\n\n\"<i>I can't- just not like this... can't you see...</i>\" she attempts to persuade you as she rambles on, but you ");
        // If Corruption is less than 50:
        if (this.player.cor < 50) this.outputText("don't care how she looks right now. Besides, some creatures around here appreciate a little carnal love; it helps with the birthing process.");
        // If Corruption is more than 50:
        else this.outputText("could care less for her pathetic attempts at concealing her pregnant form; you're horny, and she's going to put out, regardless of her insecurities.");

        this.outputText("\n\nYou walk over to her and ");
        if (this.player.cor < 50) this.outputText("lovingly");
        else this.outputText("apathetically");
        this.outputText(" pull her hands away from her breasts.  She resists you at first, but once she sees there's no stopping you she shyly resigns herself to you.");

        this.outputText("\n\nYou see her breasts have doubled in size and beads of milk are leaking out - no doubt a result of her pregnancy.");

        this.outputText("\n\nPlayfully you give one of them a strong squeeze.  Phylla moans as a jet of white milk shoots out.");

        this.outputText("\n\nYou comment on how being this full can't be good for her back.");

        this.outputText("\n\n\"<i>My... I mean, our... they don't... it- it's compl~</i>\"");

        this.outputText("\n\nYou cut her off by giving her breast another tight squeeze, causing milk to jet out onto the ground and Phylla to softly moan again.");

        this.outputText("\n\nTelling her you'll take care of the \"<i>problem,</i>\" you latch on with your mouth like a cobra striking prey, squeezing the other breast firmly before she can retort.  These actions yield the taste of warm milk in your mouth and wetness against your hand as she leaks out her maternal essence.  Amazed at the volume that is flowing out, you swallow as much as possible, pausing to smack your lips, savoring the sweet and very nectarous flavor of her breast milk -  you might have to keep her like this just to enjoy the simple pleasure of this milk.");

        this.outputText("\n\nPhylla's lower arms grab the back of your head, leading you to figure that she's saving those reserves for the children.  However, instead of trying to pull you off of her, she compresses your face fiercely into her mound.  The added pressure of your face against her breast causes even more milk to pour out into your mouth as you hear Phylla's pleasurable sigh more audibly than before - holy hell, how much is in these things?  You shrug and continue to drink from her for a while, pausing only momentarily as her smaller set of hands guide you to her other breast once the one you're on is tapped out.");

        this.outputText("\n\nOnce you detach yourself from Phylla's breasts, you can see she no longer cares how pregnant she is; she wants you, she needs you.  Your growling stomach protests loudly in response; getting a cramp during sex can be a bitch, but your loins inevitably overrule your gut.  Cramp or no cramp, it's time to \"<i>play.</i>\"");

        // Silly Mode:
        if (this.silly()) {
            this.outputText("\n\nYou belch loudly, hoping to clear the rumbling in your stomach.  Phylla then releases a lion-like belch of her own.  It echos throughout the colony and you think you feel the very walls of the chamber shake.  Your jaw drops in awe and you look at Phylla in stunned silence.  \"<i>What? Just because I'm a queen doesn't mean I'm confined to act like one.  If you think that's good, you should hear me hiccup.</i>\"");

            this.outputText("\n\nA quick check of your arousal shows that you're still in the mood in spite of what has just transpired.");
        }
        this.outputText("\n\nMoving your hand in between her sitting legs, it is welcomed like an honored guest.  You feel that she's already completely soaked - a few thin strands of her liquid have even settled between her legs - your hand easily finds her long love button and after a few moments of teasing her, your fingers penetrate her.");

        this.outputText("\n\n\"<i>Oh, noo-NNNNGH!</i>\"  Her voice stops trying to warn you but it's too late.");

        this.outputText("\n\nYou feel her vagina almost crush your fingers as a vice-like contraction causes her whole body to tense up.  It's almost like you're caught in a wrestling hold; you wince as what you thought would be pleasurable turns to pain.  It isn't long before the contraction subsides, and Phylla moans loudly as her vagina releases your fingers along with a small flood of lubricant.");

        this.outputText("\n\nYou quickly glance at the tip of her abdomen as an egg covered in syrup-like birthing goo slowly pushes her folds open and glides gently to the ground.  As you remove your fingers from her slobbering cunt, you turn your head up to look at Phylla's face.  Before you can ponder your next move, Phylla darts in and plants a firm kiss on your lips.");

        // (If corruption is more than 50:
        if (this.player.cor > 50) this.outputText("\n\n(Oh, great, here we go again...)");

        this.outputText("\n\nSuddenly, as if two magnets had locked their opposite poles together, your minds link to each other.  It's extremely uncomfortable for you at first, unlike the previous times.  Experiencing the feeling of being in constant labor quickly takes over the forefront of your mind.");
        this.outputText("\n\nYou can even feel what stage Phylla's egg is in and approximately when it will cause the final, and strongest, contraction.  The intensity of this act is almost too much to bear, but you can feel Phylla's mind help yours to cope with these new feelings, helping to support you and direct your focus to the more... pleasurable aspects of sex with a pregnant queen.");

        this.outputText("\n\nAfter your mind has settled, you feel Phylla's four arms work quickly to get you out of your clothes. Once naked, she looks at you like a cat who's cornered a particularly plump mouse, leering at you with hungry intent. Three of her arms grab you and pull her close as her hips move to the very edge of her seat. Her fourth hand guides your cock into her vagina as she embraces you.");

        this.outputText("\n\nHer stiff clit almost drags along the top of [oneCock] as it enters her.  Once inside her fuckhole, tiny contractions are felt throughout her body, surging up and down her vagina, sending waves of pleasure through your cock as a result.  You start to thrust your hips into her, each time trying your best to get deeper and deeper so the pulsing contractions get sent down the complete length of your man meat.  Quickly building up to a feverish pace, your cock flies in and out of her, sliding her clit up and down the top of your shaft with each rough thrust.  The sensation is simply becoming too much, but she intervenes and restrains your body from releasing its orgasm.");

        this.outputText("\n\nThat's not fair!  You feel her birthing contraction coming up and conclude that two can play at that game.  Despite having no experience with this, you somehow manage to withhold her moment of respite.  You can taste her annoyed frustration but you opt to replace the feeling with your utter bliss, as you grab both of her enlarged breasts with your hands, and squeeze them so milk shoots all over your chest and you catch some of the falling droplets in your mouth.  Your hips still thrust like a madman, mashing into her pelvis as the pulses in her pussy start to synchronize with your thrusts.");

        this.outputText("\n\nIn a similar fashion to the joining of minds, your bodies appear to be sharing information, too.  Then you feel it, just as suddenly as Phylla does.  This contraction can't be held back anymore, and it might have been a mistake to hold it back in the first place.  Phylla's whole body tightens around you, all four of her hands pulling, crushing you into her chest, causing your dick to delve so deep that");
        // (If PC has balls:
        if (this.player.balls > 0) this.outputText(" your balls slap against the smoothness of her pelvis.");
        else this.outputText(" your knees grind along the edge of her makeshift throne.");

        this.outputText("\n\nThrough the link, you can feel the busy work of birth start to work its way down her body from Phylla's mind.  As it increases in intensity, her nails dig unconsciously into your back.  Taking your derriere in her lower arms, Phylla thrusts you completely inside her so that your cock hits the deepest part of her cunt in perfect timing with her contractions.");

        // (If PC is under 5 feet tall:
        if (this.player.tallness < 60) this.outputText("\n\nThis act actually lifts you off your feet, but with Phylla's tremendous strength you're sure she'll be able to hold you up.");

        this.outputText("\n\nThe walls of her pussy warp and wrap around you so tightly that you can feel every single inner detail of her insides.  Her clit turns so hard that if you weren't linked you would have assumed a small blunt fleshy clamp was pushing into the base of your dick.  As the contraction passes, your joined minds share in the dual pleasures of your imminent orgasms.  It's as though time has frozen in this very moment before you and Phylla orgasm.  At the very threshold between want and satisfaction, you feel that you both have become a single consciousness; together you linger there for a moment, as if holding your breaths.  As your single mind seems to let out a prolonged breath, your link splits, sending you both crashing back into your own bodies and individual minds.");

        this.outputText("\n\nCock quivering inside her, her cunt sends one final pulse, begging for you to cum inside her and start the whole process of pregnancy all over again.  Simultaneous, loud moans echo down the halls of the colony as you release your seed deep inside her; her vagina eagerly contracts with each volley of your efforts to inseminate her, intent on inhaling your semen deep inside to provide all of your sperm the chance to fertilize your lover.  Floods of liquid escape from her breasts, cunt, and abdomen as she finishes her own orgasm.");

        this.outputText("\n\nYou feel the contraction pass quickly through all the different stages of her abdomen and almost like a repeating crossbow, three eggs drop abruptly out of her tip.");

        this.outputText("\n\n\"<i>I... I...</i>\" she gasps, trying to catch her breath.  Before she can finish her sentence, she collapses in your arms, still sitting on her throne with you inside her.");

        // If Corruption is less than 75 & If PC STR over 70:
        if (this.player.cor < 75) {
            if (this.player.str >= 70) this.outputText("\n\nYou muster the last of your strength to carry her over to her bed, struggling to overcome the exertive efforts of your mating and the weight of her abdomen. Eventually making it to her bedding, you lay her down and give her a light kiss on the lips as she drifts off to the land of dreams. Quietly you gather your things and head back to camp.");
            // If Corruption is less than 75 & If PC STR less than 70:
            else this.outputText("\n\nPoor girl must be exhausted. You tactfully remove yourself from her and do your best to try to drag Phylla off her throne in order to put her into her bed.  Even with your full strength she weighs too much in her current state.  One of your children just happens to be passing by and sees your predicament.  He makes a series of clicks that echo down the tunnels.  A few moments later a group of your children appear and together you manage to get Phylla into bed.  You thank your children with a pat on the head and quietly you gather your things and head back to camp.");
        }
        // If Corruption is greater than 75:
        else {
            this.outputText("\n\nSighing at her nerve to pass out on top of you, you pull out of her and lift her to her feet, semen dripping out of her as she wobbly takes to her feet.");
            this.outputText("\n\n\"<i>Come on, march!</i>\"  You command her.  \"<i>Over here, Phylla, one foot over the other; yes, that's a good breeding slut.</i>\"");
            this.outputText("\n\nAfter a moment of staggered walking you allow Phylla the courtesy to flop down onto the hard surface of the bed, pausing only for a moment to look over your pregnant little whore.  After a quick remark to her on how she'd better be ready for another round soon, you leave her to the mess you have made as you head back to camp.");
        }
        this.player.orgasm('Generic');
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // While Giving Birth (Female) - Written
    private birfingSexWithAntsForDasLadies(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("ant-camp-female-preg-"));
        this.outputText("Phylla looks completely taken aback when you suggest that you want to have sex with her.  You can tell she is self conscious about the way she looks right now by the way she covers her enlarged breasts with all four of her hands as she sits back in her seat.");
        this.outputText("\n\n\"<i>I... look, we could wait until I've given birth... Wouldn't you want that?</i>\"  She glances behind her at her engorged abdomen.  \"<i>I... It won't ta-AHH!</i>\"");
        this.outputText("\n\nShe stops mid-sentence as a contraction shoots through her body, making the entirety of it tense up.  Then with an almost sexual moan she shudders as all her muscles relax and the contraction pushes a cyclentrial egg out from the birthing slit at the tip of her abdomen. As if on cue, one of your many children quickly runs in from the shadows and scoops up the egg to remove it and take it somewhere deeper into the colony.  Clearly there's some kind of greater system going on here.");
        this.outputText("\n\nAs you walk back in front of her you begin to strip down, leaving your armor and underwear strewn about behind you.");
        if (this.player.isNaga()) this.outputText("  You slither almost whorishly with a slow, measured wriggle,");
        else this.outputText("  You walk almost whorishly with a slow, sensual gait,");
        this.outputText(" allowing her to see the sensual swivel of your " + this.player.buttDescript() + " from left to right and back again as you visibly entice Phylla's mind to lustful thoughts.  Once you're facing Phylla once again, you see her lower two hands are still covering her breasts and the upper two are gripping the stone chair she sits in.");
        this.outputText("\n\n\"<i>I didn't mean... I just thought...</i>\"");

        // If Corruption is less than 75:
        if (this.player.cor < 75) this.outputText("\n\nPressing one of your fingers to her lips to quiet her, you slowly whisper sweet nothings into her ear.  This distraction is just the thing you needed.  Running your hand from her lips, you drag your nails ever so slightly down her neck in a way that ignites Phylla's sexual fires.  Eventually your hands come to rest on hers.  Playfully hooking one finger around one of the hands that's covering her breasts, you use it to slowly pull Phylla's hand back to reveal her hardened nipple.");
        // If Corruption is more than 75:
        else this.outputText("\n\nYou let Phylla know that you want to see those tits, free and proud.  She shyly does as commanded.  You gaze at her breasts like a hungry wolf.  They're much larger than 'normal'; you assume it must be due to the 'pregnancy.'");
        // END CORRUPTION CHECK
        this.outputText("\n\nBeads of milk have already started to dribble out of both her nipples. This causes you to inquire why she even produces milk.");

        this.outputText("\n\n\"<i>W-What do you mean?  I need to feed my... our... children.</i>\"");

        this.outputText("\n\nClearly not understanding your question was more playful than real, you cut her off by giving her boob a soft squeeze.  Both of you are clearly surprised when a white jet of milk practically fires out of her breast like a cannon ball, landing on the floor a few feet away.");

        this.outputText("\n\nWithout warning, you strike at her areola like a viper, latching on and biting down playfully on her breast.  Your efforts are rewarded as your mouth is instantly flooded with warm and sweet liquid.  You hum approvingly and try your best to swallow the massive volume of milk that seems to endlessly pour out of her swollen breasts, but it proves too much.  Detaching yourself from her, you lick your lips and sigh as your hunger is completely sated - for milk anyway.");

        this.outputText("\n\nMoving your hands in between her thighs causes Phylla to moan as you spread her legs apart.  You see her wet cunt has already soaked her inner legs, and spreading them apart like this, you get a full view of her.  Her pussy seems to be visibly pulsating, squirting small amounts of her lubricant with each small contraction.");

        this.outputText("\n\nYou wonder what the inside of her must feel like as you gently run your hand over her; an enormous warmth is being emitted from her vagina before your fingers even fully reach her entrance.  You tease Phylla, commenting on how she's all nice and ready for you as you start to tease her moist fuck-hole and long clit with your fingers, watching as her glinting cunt almost begs to be penetrated as it spits her lubricant all over the floor.");

        this.outputText("\n\n\"<i>Huangg~</i>\"  Phylla's body tightens as she moans, another egg must be coming.  \"<i>I can't... take mu~... more.</i>\"  She struggles to say between moaning gasps for air.  \"<i>I~...</i>\"");

        this.outputText("\n\nHer hands lift your face up and her glazed eyes stare blankly into yours; she must want to link badly if she's not even gazing intently into your eyes.");

        // PC is pure
        if (this.player.cor < 75) {
            this.outputText("\n\nSmiling, you wrap your hand around the back of her head and pull her into a deep kiss.");
            this.outputText("\n\nFeeling the link almost immediately, it hits you as hard as a Minotaur wielding a battle axe.  A fireworks display of emotions wash over you; clearly, your mind was completely unprepared for this cavalcade of feeling.");
            // If PC has IS pregnant:
            if (this.player.pregnancyIncubation > 0) this.outputText("\n\nThe feeling of your pregnancies is instantly transferred between yourself and Phylla; you feel the warmth and energy of her unborn children inside of you, and you can feel her experiencing the warmth of the life still growing within you.  At this moment, you two understand perfectly what it's like for each other to be with child; it's a pretty... enlightening experience... that's distracting you from the task at hand.");
            // If PC has been pregnant:
            else if (this.player.statusEffectv1(StatusEffects.Birthed) > 0) this.outputText("\n\nYou've been pregnant before, but this... this is completely different.  You feel every stage that each of Phylla's eggs in her abdomen is in.  You feel what it's like to have your only goal, your only want in life being to mate and have children for the rest of your life.  It's an amazing turn on for you - you feel a warmth start to spread between your own legs.");
            // If PC has NEVER been pregnant:
            else this.outputText("\n\nIt's one of the most interesting feelings you've ever felt; you feel every stage of pregnancy at once - every stage of each egg in Phylla's ever-laying abdomen.  It makes you want to experience the joys of being pregnant as a flood of maternal thoughts flood your mind.  Though you keep in mind the disadvantages as well - you don't want to go overboard.  You feel what it's like to have your only goal in life be to breed continuously.  It's an amazing turn on for you as you feel a warmth start to spread between your own legs.");
        }
        // PC is corrupted
        else {
            this.outputText("\n\nYou want to just fuck the rest of your days away, but you know that won't happen anytime soon. Stupid goddamn quest and your people ruining a good thing.");
            this.outputText("\n\nLooks like you need to teach Phylla that life's full of disappointment.  You pretend not to see the need in her eyes; heavens know you don't need another headache.  You've got depraved fantasies to carry out after all!");
        }
        this.outputText("\n\nYou ");
        if (this.player.cor < 75) this.outputText("lovingly");
        else this.outputText("dismissively");
        this.outputText(" continue to finger her, forcing her body to writhe on top of your fingers, begging for more... and you're more than happy to oblige.  As two of her arms push you down on your shoulders, the other two apply pressure to the top of your head, encouraging your head to disappear between her legs.  Chin resting on the utterly soaked pillow that your lover is sitting on, you inhale Phylla's sexual scent and allow it to spread throughout your body, encouraging you to coax more of that intoxicating pussy nectar out of her for enjoyment and pleasure.");

        this.outputText("\n\nThe smell of earth mixed with her sex and the taste of her milk on your lips is too much.  You dive into her like a sex-crazed animal.  Plowing your face against her love button, you press her outer labia against your lips before taking her tender clit into your lips and wrapping your tongue around it, sucking hard.  Her lower arms take a full grasp of your " + this.player.hairDescript() + " as she guides your face, intent on having you eat her deeply sooner rather than later.  Taking your cue, you release your tongue from her clit and move it inside of her and allow the bumpy texture of it to tease and caress her hot fuckhole.");

        this.outputText("\n\nAs a reward for your tongue's new position, you hear a prolonged groan of appreciation as she experiences the foreign sensation in her pussy.  Every contraction can be felt as her cunt wraps and releases your probing licker.  Pausing occasionally, you slurp up her sexual fluids, but are constantly assaulted by her rather tight, wet, and delicious pussy. Your tongue rattles around inside of her like an ant caught in a windstorm.  Pulling your tongue out, you lovingly lick along her clit, causing her to draw in a deep breath while grasping your hair even harder.  Phylla grunts girlishly while wrapping her legs firmly around your head.  With a slight shove she forces your face back into her cunt with tremendous force - obviously she's not finished with you yet.");

        this.outputText("\n\nYou decide to make the best of it considering her strength; it could always be worse.");

        // If corruption over 50:
        if (this.player.cor > 50) this.outputText("\n\nYou'll remember this and make her pay for it later.");

        this.outputText("\n\nThe resulting sensation of your second go at her pussy causes her to release a mixture of a moan and whine as she bites her lower lip; being overwhelmed by ecstasy must be nice.");
        // If PC is linked:
        if (this.player.cor <= 50) this.outputText("\n\nYou hear her in your mind: Just keep going.  It'll be your turn soon... please just... a little more.");

        this.outputText("\n\nBy now she's clawing fiercely at your head in a violent yet caressing fashion as each millisecond of your efforts cause instantaneous reactions from your lover.  \"<i>MMMhhPHHp!</i>\"  She moans behind a closed mouth before managing to utter, \"<i>Oh, MY-AHH!  Just like that!  Right there!  DON'T-NGGHH, stop!</i>\"");

        this.outputText("\n\nShe's not ready to cum yet... is she?");
        if (this.player.cor <= 50) this.outputText("  You probe her mind and are almost taken aback.\"<i>NO!  Just please keep going!</i>\"  You hear her voice ring out in your head.");

        this.outputText("\n\n\"<i>Please, lick me... right... THERE!</i>\"  She moans out in her ecstasy quickly covering her mouth with the pair of hands not rooted in your hair in an attempt to muffle her pleasurable noises.");

        // If Corruption is less than 50:
        if (this.player.cor <= 50) {
            this.outputText("\n\nWhile part of you wants to hear her moan her pleasures to the entire colony, you figure you'll allow her to not disturb the colony.");
            this.outputText("\n\nYou continue your attack on her pussy as she tries desperately to contain her moans of pleasure, causing a muffled echo to ring out in the bedchamber as you slide your tongue in and along her pussy.  She's got to be close to cumming, you think to yourself, and realize you've lost yourself in the moment; your " + this.player.vaginaDescript() + " has been neglected... perhaps it's her turn to tend to you?  As if you had said it out loud, Phylla eases her grip on your hair and unwraps her legs from behind your head, composing herself before rising to her feet.");
            this.outputText("\n\n\"<i>How would... you like me... to do this?</i>\"  Phylla manages to moan out between staggered breaths as you playfully shove her backwards onto the bed.  You wait until she finishes positioning her massive abdomen, curling it around the both of you as she lays on her back.  You hover your hips just above her face, letting her smell your scent and feel your heat in the hopes that she'll get the idea and take over from here.");
        }
        // (Transition to EAT PUSSY)
        // If Corruption is over 50:
        else {
            this.outputText("\n\nThis won't do at all, you think to yourself, ripping yourself from her grip, and face slightly away her pussy.  Gazing into her deep emerald eyes, a devious idea creeps in your mind.  In a flash you rip her hands away from her mouth. Simultaneously you dive back into her cunt and nibble on her clit.  A loud perfectly timed moan escapes and echos off the walls. Smiling to yourself, you tell Phylla that her modesty is a turn-off at this point; you want to hear her moans to their fullest extent.  No muffling, no restraint: just moan... for you, her 'king'.  As loudly as she needs to.");

            this.outputText("\n\nWith those pesky hands out of the way, you dart back down to her clit and manhandle it with your tongue, causing her to erupt into a loud series of moans and labored breathing as she resigns herself to the full brunt of euphoria to take her.  Phylla gives in to instinct, letting it consume her as she slams backward onto her bed, milk-filled breasts swaying in the air as she spasms and screams as loudly as her body will let her.  Her leg even begins to twitch against your shoulder, feeding off of the hypersensitivity you have inflicted on her... no, the fuckhole that belongs to you.");

            this.outputText("\n\nSensing that she is nearing an orgasm, you pull back and wrestle out from betwixt her legs.  Finally free, you see she's sprawled out on the bed, her massive abdomen hanging off to the side.  Settling yourself over the top of her, you slide your " + this.player.clitDescript() + " along her nose, intent on getting your scent entrenched in her body, wanting to make her crave your pussy, something that occurs as she takes a long whiff of air and moans like a whore in heat.");

            // If PC has loose pussy:
            if (this.player.vaginas[0].vaginalLooseness >= Vagina.LOOSENESS_GAPING) this.outputText("\n\nYour loose pussy lips cause your juices to drip onto Phylla's face as you hover over her, allowing her to lather in the wetness of your arousal.");

            this.outputText("\n\n\"<i>I think you need to lick my pussy for a bit, my queen,</i>\" you tell her, thinking that you wouldn't want her getting off before she's tended to your needs.  You playfully smile down at her.");
        }
        // EAT PUSSY:
        this.outputText("\n\nLike a starving animal, Phylla's mouth waters as she takes hold of your thighs and spreads your legs apart.  You grab hold of her hair and shove her head inbetween your legs, impacting your " + this.player.clitDescript() + " and causing you to moan slightly.  She certainly isn't shy now, you think, as her tongue starts to work its way into you.  You can \"<i>hear</i>\" Phylla giggle back in response. Thoughts of grinding your pussy across her mouth and face flood your mind, and instinct takes over as your hips start to rock in response to Phylla's eager attack.  Running your hands through her hair,  you grind Phylla's pretty face harder and deeper into your soaking " + this.player.vaginaDescript() + ".  The poor ant can only respond by moaning fiercely as she eagerly sucks and kisses your love button, completely overwhelmed by the desire that has overtaken her.");

        // If PC has (a) Dick(s), that are less than 42 inches:
        if (this.player.cockTotal() > 0 && this.player.cockThatFits(42) >= 0) {
            this.outputText("\n\n[EachCock] begs for your touch, and with no hesitation you grab a hold of ");
            if (this.player.cockTotal() > 1) this.outputText("them");
            else this.outputText("it");
            this.outputText(", stroking ");
            if (this.player.cockTotal() == 1) this.outputText("it");
            else if (this.player.cockTotal() == 2) this.outputText("them");
            else this.outputText("as many as you can");
            this.outputText(" as fiercely as your body will let you.");
        }

        this.outputText("\n\nAs you feel your stiff " + this.player.clitDescript() + " glide along her lips, you can begin to taste bits of her almost primal hunger for you.  As well, you sense that the growing contractions in her abdomen are getting quicker and stronger.");

        // If Corruption is less than 50:
        if (this.player.cor < 50) this.outputText("\n\nYou'll need to finish up quickly; you don't want to keep the children waiting to get her egg while you two are \"<i>busy.</i>\"");
        // If Corruption is more than 50:
        else this.outputText("\n\nIf she lays an egg before you're done with her, not only will you be furious, but you'll have to scare your kids away.  " + this.player.mf("Daddy", "Momma") + " needs to get " + this.player.mf("his", "her") + " rocks off first before any annoying kids get in the way.");

        this.outputText("\n\nHer tongue and fingers work their magic until she has you in a near orgasmic state.");

        this.outputText("\n\nDeciding to end this, you work your hips away from Phylla's eager tongue and lean down, whispering into her ear; you're hell bent on cumming simultaneously in a glorious display of sexual gratification, and want to know if she's thinking along similar lines.  Giggling at your suggestion, the pair of you quickly shift positions so you're in the time-honored sixty-nine.  Her vagina now rests just above your face as her face rests in between your legs, her huge abdomen casting a looming shadow over both of you as it curls over your head and drips warm liquid down your spine.  You feel her yearning to lay eggs, but you suppress her desire.  \"<i>Not yet,</i>\" you think - not until you've both cum.");

        this.outputText("\n\nYour " + this.player.clitDescript() + " comes to rest on her lips again as her head starts to bob between her own strong legs.  Returning the sentiment, you dart in-between her legs, tongue first.  You hit that sweet tasting little pussy of hers with force.  Phylla moans, your intentions crystal clear as she bears down on your pussy hard, intently working for your sexual release.  She reaches up with her lower set of arms and gives both your " + this.player.nippleDescript(0) + "s a firm squeeze, the twist of which is nothing short of exquisite.  Muffled moans of bliss are unintelligible, but in your shared mind-state, you can hear one another screaming words of encouragement and direction.");

        // If PC has (a) Dick(s), that are less than 42 inches:
        if (this.player.cockTotal() > 0 && this.player.cockThatFits(42) >= 0) this.outputText("\n\nWithout warning, Phylla begins to alternate between giving your " + this.player.clitDescript() + " oral and sucking your " + this.player.multiCockDescriptLight() + "; the dual stimulation overwhelms you as she devilishly teases your sexes.");
        this.outputText("\n\nYou recall the tip of her abdomen being particularly sensitive as you reach up overhead. Your arm can barely reach it, but as if she knew what you were trying accomplish, Phylla curls her abdomen just enough so you can start to stroke her birthing slit.  At your caress, Phylla shudders and deeply exhales into your cunt, sending a shiver up your spine. Continuing like this, you both quickly build up orgasms.");

        this.outputText("\n\nHowling in delight, both of you twitch and writhe as the pure bliss of climax seizes your bodies, drooling and squirting lady fluids against each other's faces.");

        // If PC has a dick-two dicks that is/are less than 4 inches wide, in total:
        if (this.player.cockTotal() > 0 && this.player.cockThatFits(42) >= 0) {
            this.outputText("\n\nMoaning savagely, Phylla pops ");
            if (this.player.cockThatFits2(42) >= 0) this.outputText("two of ");
            this.outputText("your " + this.player.multiCockDescriptLight() + " into her mouth and mashes ");
            if (this.player.cockThatFits2(42) >= 0) this.outputText("them");
            else this.outputText("it");
            this.outputText(" against the back of her throat.  Unable to contain the pleasure from this, you howl and blow your hot load into her throat.");
        }
        else if (this.player.hasCock()) this.outputText("\n\nFeeling your own " + this.player.multiCockDescriptLight() + " about to erupt, you quickly roll off your lover.  Just in time, too - you fire your jizzum up at the ceiling, coating it quite well before your salty load falls back down on top of the two of you.");

        // PC dick is out in the hallway:
        if (this.player.biggestCockArea() >= 500) {
            this.outputText("\n\nYour " + this.player.multiCockDescriptLight() + " twitches with orgasmic release, bulging as your load works its way through your urethra");
            if (this.player.cockTotal() > 1) this.outputText("s");
            this.outputText(".  With a heavy heave, you feel the hot and sticky ejaculate launch from your dick, hitting the interior decorations as you do so; what exactly you hit, you can't say... but you'll likely be tripping over your mess on the way out.");
        }

        this.outputText("\n\nYou struggle to breathe for a moment as a massive amount of warm girl cum seems to flood from Phylla's vagina to completely cover your face and soak most of your " + this.player.hairDescript() + ".  While you catch your breath, you can hear Phylla noisily slurping up your fluids before compressing her face against your " + this.player.clitDescript() + " in an eager effort to lather her face in your juices for just a little longer.  Contentment and fulfilled desire - not only your own, but Phylla's as well - spreads like wildfire through your brain.  You grin to yourself, satisfied at the effect you've had on Phylla during your session.");

        this.outputText("\n\nUnfortunately, nature has to ruin the moment as Phylla's muscles seize up and her abdomen begins to contract significantly.");

        // f Corruption less than 75:
        if (this.player.cor < 75) {
            this.outputText("\n\nWith adrenaline pumping through your veins, you quickly flip Phylla over so she's on her hands and knees.  Taking hold of her hand and head as she groans in pain, you offer her your support, assuring her that you're here for her.  Sensing that she might benefit more from the link, you quickly plant a kiss on her lips and hold her close, something she responds to by clutching you in her arms, though it seems more for support than passion at this point. Nevertheless, you can feel that she's grateful that you're here.  With a final, labored groan, she works the impending egg free of her abdomen and breathes a large sigh of relief before passionately returning the kiss.");
            this.outputText("\n\n\"<i>T-Thank you... You're so good to me,</i>\" she whispers in between kisses.");

            this.outputText("\n\nUp the hallway, you can hear the patter of soft feet; one of your many children must be coming to fetch the egg.  Acting quickly, you grab your [armor] and position it so that it obstructs the view of your naked bodies.");

            // (If PC wasn't wearing revealing clothing:)
            if (this.player.findPerk(PerkLib.SluttySeduction) < 0) this.outputText("\n\nThe \"<i>child</i>\" that walks in notices both of you breathing heavily, and quickly takes note of your need for privacy.  Phylla scoops up the egg and embarrassingly extends it to him.  He does his best to avert his eyes and quickly scampers over to fetch the egg and leaves.");
            // (If PC was wearing revealing clothing:)
            else this.outputText("\n\nYour attempts at modesty end up failing as the offspring of your union stumbles in and covers his eyes at the sight.  He quickly fumbles his way over to the egg and takes off, not daring to look back at his bare naked parents.");

            this.outputText("\n\nYou both chuckle and drift off to sleep in Phylla's bed.  Somehow, you know that your back is going to ache when you wake up.");
        }
        // If Corruption more than 75:
        else {
            this.outputText("\n\nYou could care less at this point about what kind of turmoil Phylla is going through, opting instead to doze off next to your contracting lover.  She tries to shake you awake and whines dejectedly as she's left alone to ease her child into this world.  You do your best to pretend to drift off, but she's making too much noise.  Phylla clearly believes your deception as after a moment she stops trying to get your attention, more focused on the task at hand.");
            this.outputText("\n\nYou hear the inevitable groan of relief and feel the seeping liquids of birth a few moments later.  Grinning, you feign sleep, appeased that you've added another... slave to the colony.  That is, until one of your children tries to enter the bedchamber to take Phylla's egg away.  Your eyes snap open and you rise up to make such a display of anger and annoyance that your offspring backs away nervously; he'll have to wait until you're both asleep before he can get the egg.  Phylla looks confused as she thought you were asleep the whole time. ");
            this.outputText("\n\n\"<i>I-I thought... you were...</i>\"  Phylla starts to say, but you cut her off with a look that shows you're in no mood to listen to her.");
            this.outputText("\n\nNow that Phylla's quieted down, you tell her you're going to get some sleep; if she's to have another child, she'll need to either keep quiet or leave to another room.  She nods dejectedly as you settle in for your nap.  You swear you hear her go into labor again right before drifting off.");
        }
        this.player.orgasm('Vaginal');
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [Orgy w/ Colony - Requires Children]
    // (Note: The above option will only be available the PC has sufficient corruption.)
    // Orgy w/ Colony (Male) - Written
    private orgyWithDatColonyCorruptDudes(): void {
        this.flags[kFLAGS.TIMES_CORRUPT_MALE_ANT_ORGY]++;
        this.clearOutput();
        this.outputText(this.images.showImage("ant-camp-mle-orgy"));

        this.outputText("You tell Phylla to call in your strongest and most virile children for 'inspection.'");

        // First Time:
        if (this.flags[kFLAGS.TIMES_CORRUPT_MALE_ANT_ORGY] == 1) {
            this.outputText("\n\nShe looks confused at first and attempts to ask why.  \"<i>I don't think... they will all fit in this room.  We have many warriors...</i>\"");

            this.outputText("\n\nLooking around, though her room is about the size of your campsite on the surface, she's probably right.  Sighing, you just tell Phylla to do what she can.  She closes her eyes then tilts her head back.  After a moment or two of this 'meditation' her eyes snap open.  \"<i>They should be here soon.</i>\"  Her voice is very cheerful.  You wonder how quickly it will change when you tell her just what you have in store.  If you even tell her outright - tricking her could be a better way to get what you want.");
        }
        // (Subsequent Times:)
        else this.outputText("\n\nShe nods meekly, knowing what an 'inspection' means.");

        this.outputText("\n\nA few moments later five of your 'children' show up. Phylla clearly took your advice and chose the best specimens from among her colony to show off for your 'inspection.'");

        this.outputText("\n\nThey line up along the wall as you walk down in front of them like a military officer.  Their chiseled bodies and large frames look akin to statues carved by master artisans.  You stop in front of the largest of them and run your hand over his chest, caressing his skin as your hand moves over his pecs.  His whole body tenses up as you reach his small nipple, but he doesn't make a move to stop you.");

        this.outputText("\n\nYou step away from him and look up and down the line; they're not even fully naked.  This won't do at all.  With a wicked grin, you tell Phylla to have them remove their loincloths.  A few of your sons glance at each other and shift uncomfortably.  Phylla, on the other hand, looks frightened and hesitant to do as you ask.");

        if (this.flags[kFLAGS.TIMES_CORRUPT_MALE_ANT_ORGY] == 1) this.outputText("\n\n\"<i>Why... would you... want to... see...?</i>\"  Phylla seems confused.  You tell her that you need to see everything to get a proper assessment.  That is, unless Phylla thinks she's doing such a bad job of being queen that she would need to hide the facts from you.");
        // Subsequent Times:
        else this.outputText("\n\nThough you can tell Phylla doesn't want to, she gives in. You make a comment about how maybe her children have 'shrunk' since your last inspection.");
        this.outputText("\n\n\"<i>No!  I'm doing a good job!  I promise!</i>\"  Trying to show how wrong you are, she enters her trance.  The warriors before you start to disrobe.  Once all five of them are completely nude, Phylla snaps back into the present.");

        this.outputText("\n\nEmbarrassed for her children, Phylla looks away as your eyes instantly lock on to their genitals.  \"<i>Well...  I mean, they're... all... gifted... like y-you asked,</i>\"  Phylla says, more to the floor than to you.  They certainly are, you think to yourself, as you visually feast on their cocks!  All of them are erect, and a few even have beads of pre-cum running down their slightly pointed, human-looking shafts.  You would guess all of them have about 10-15 inches of long, hard man-meat.  Two testicles swing beneath their long cocks.  Their balls vary in size, but have mostly human-like proportions compared to their cocks.  You walk over to one and slide your hand down his shaft just to see how he reacts.  A low muffled moan escapes his clenched teeth as he does his best to ignore your hand.");

        this.outputText("\n\nYou look over at Phylla as you stroke his long cock with your fingertips.  She's still looking away, not wanting to believe what you're doing.  The ant's pre-cum is slowly making your hand wet.  You go from gently caressing his cock to slowly jacking him off; you can feel his firm rear tighten as his phallus throbs between your strokes.");

        this.outputText("\n\nYou watch the other four ants in line shift awkwardly, watching you jack off their brother, yearning for their own attention.");

        this.outputText("\n\n\"<i>Well, can't you feel them?  Their needs, their lusts?</i>\" you tease Phylla as she glances over.  When she sees what you're doing she gasps in shock, covering her mouth and eyes with all four of her hands.");

        this.outputText("\n\nYou look to the other four.  \"<i>Do help your mother relieve herself of her... insecurities.  There's no reason for you four to hold back on my account.  Just don't touch her cunt!  That belongs to me!</i>\" Heeding your command, the four other soldier ants descend on Phylla, peeling her arms away from her face.  You hear Phylla's muffled protests, but that's quickly stopped when one of them kisses her deeply and guides one of her hands to his cock.  Another starts to suckle on her breast and moves another of her hands to massage his own member.  The third takes both of Phylla's smaller hands and forces her to cup his balls and stroke his cock as he stands in-between his brothers.  The fourth man seems to be left out, but then gets an idea and walks behind Phylla.");

        // If Phylla Is Laying Eggs:
        if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] > 0) this.outputText("\n\nSeeing as how he wouldn't be able to lift her massive abdomen, he lays down and almost completely disappears under it.  Phylla moans loudly as he runs all four of his hands down the underside of her abdomen as a contraction racks her body.  The birthing slit at the end of her abdomen widens as an egg pushes itself out of her, splattering her child's chest with her clear birthing gel as it comes.  The ant-man uses his lower two arms to softly set the egg aside as his large hands part her birth canal.  He licks his way down her long abdomen and begins lapping up the liquid that continues to seep out of her birthing slit.  Drinking and slurping wildly, he starts to jack himself off with his smaller hands.");
        // If Phylla Isn't Laying Eggs:
        else this.outputText("\n\nThe large ant lifts up Phylla's abdomen and bends it so the tip of it rests in front of his face.  Taken by surprise by the sudden stimulation, Phylla 'Eeps!'  The man behind her sniffs at the tip of her abdomen and licks it hesitantly as if testing the waters.  Phylla moans into the mouth of the ant morph kissing her.  Seeing as how he was rewarded for his efforts, the ant at her abdomen dives his head into the tip of her abdomen, licking and fingering her birthing hole.");

        this.outputText("\n\nYou can see Phylla's lust raising as she starts to forget herself and starts to just enjoy the touches and smells of what's happening to her body.  She happily begins jacking off her children with more gusto.  She even switches out who's kissing her, who's suckling on her, who's sucking on her egg opening, and who's getting handjobs - making sure all four of her children get equal shares of her body.");

        this.outputText("\n\nYou feel the ant you're giving a handjob to groan and start thrusting his cock into your hand.  You almost forgot what you were doing - watching Phylla get almost buried in incessant cocks clouded your mind. You release your grip on his cock, leaving him to give you a very confused and needful look.");

        this.outputText("\n\n\"<i>Go get 'er, tiger,</i>\" you say, as you slap his ass.");

        this.outputText("\n\nHe practically charges his mother, lustful wants burning through his veins.  Seeing him dash towards them, his brothers pull Phylla down onto the bed.  Soon she's in position; her shoulders on the edge of the bed and her head looking back up at her children.  Once he gets to his mother, the charging ant-man flops his cock in between her breasts and lets his balls hang above her mouth.  Phylla uses her smaller set of hands to press her breasts together against his long dick.  He starts thrusting his penis between her ");
        if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] > 0) this.outputText("large, lactating ");
        else this.outputText("small ");
        this.outputText("orbs.");
        this.outputText("\n\nWith her face slapped by his balls with each thrust, Phylla takes it upon herself to start sucking on his nuts, covering them in her drooling saliva.");

        this.outputText("\n\nHaving his kiss stolen from him, the ant who was kissing Phylla grabs his nearest brother and shoves his tongue into his mouth.  The two ants who were being jacked off by their mother's smaller hands now find themselves neglected since she's using them to pleasure their brother as he thrusts between her breasts.  Having their own needs, the larger of the two lies down so his brother can lie down reverse on top of him; they immediately start to suck one another off in a sixty-nine position.");

        this.outputText("\n\nIt's then that you realize you're still completely clothed!  How inconsiderate of you.  You quickly shed your " + this.player.armorName + ".  Finding your own cock");
        if (this.player.cockTotal() > 1) this.outputText("s");
        this.outputText(" stiff and longing for immersion into this orgy, you just need to find an opening.  Walking over to Phylla, you tap the ant getting a tit fuck on the shoulder.  Without a second thought, he stands aside for you, letting his balls slip out of Phylla's mouth with an audible pop.  You grin down at Phylla, seeing that she's now completely lost and just enjoying herself.  It's at this moment that you feel shadows looming behind you.  Before you can react, hands reach down and start lovingly stroking [oneCock].");

        // If player has two-three dicks:
        if (this.player.cockTotal() > 1 && this.player.cockTotal() <= 3) {
            this.outputText("\n\nYou quickly find each of your cocks are being taken care of.  You can hardly tell who's touching or sucking what.  Looking down you see Phylla sucking the head of your longest cock as someone's hands run down the shaft.  Your other dick");
            if (this.player.cockTotal() == 2) this.outputText(" is");
            else this.outputText("s are");
            this.outputText(" getting sucked off by two of your children, who themselves are being sucked off.");
        }
        // If player has four-6 six dicks:
        if (this.player.cockTotal() >= 4 && this.player.cockTotal() <= 6) this.outputText("\n\nEven though you have so many cocks, it won't be a problem.  Just standing over Phylla you look down as hands, mouths, and Phylla's breasts do their best to please every one of your cocks in turn.");
        // Silly Mode (LOTR) player has 10+ dicks:
        if (this.silly()) {
            this.outputText("\n\nLooking down at your children, fear can be seen  in their eyes.  You decide to give a heartfelt speech.");

            this.outputText("\n\n\"<i>Sons, offspring, my children!  I see in your eyes the same fear that would take the heart of me!  A day may come when the semen of these cocks fail, when they go limp and never stand erect again... but that is not this day!  An hour of sorrow and sadness when these cocks cease to cum... but that is not this day!  This day you fight!  By all that you hold dear in this good colony, I bid you suck!  Suck all the cock!</i>\"");
        }

        this.outputText("\n\nThere are so many limbs and cocks in the pile that it's starting to get hard for you to distinguish who's who.  Not that you really care; you have your own needs which Phylla is already attending to.");

        this.outputText("\n\nHer mouth hangs open as if begging to be filled by [oneCock].  You didn't come here to get a blow job - you want her cunt.  You want your corrupt dick inside her.  You want to make her have to beg for release.");

        this.outputText("\n\nAll four of her hands welcome your cock, her fingers running up and down your long shaft as she guides it to the lips of her drooling cunt.  Looking down you see her long clit poking out from between her inner folds.  Phylla pants heavily, like a dog in heat; you can actually see the steam coming from her mouth.  You grab her hair and shove your face into hers.  As your tongue penetrates her mouth you feel the familiar tinglings of your minds joining together.");

        // f first time; having orgy:
        if (this.flags[kFLAGS.TIMES_CORRUPT_MALE_ANT_ORGY] == 1) this.outputText("\n\nYou feel the link but it seems strained, like butter spread over too much toast.  You quickly recognize why: you feel the five others in the room in your mind along with Phylla.  They're building to release, but Phylla has been keeping them all from climaxing.  Well, at least you've trained her well.");
        // Repeat:
        else this.outputText("\n\nYou knew this moment would come and you're mentally prepared for it.  Feeling your mind link to everyone in the room is still overwhelming at first, but you quickly get over it as your mind finds balance.");

        let x: number = this.player.cockThatFits(this.phyllaCapacity());
        if (x < 0) x = this.player.smallestCockIndex();
        this.outputText("\n\nWhen you've felt your mind completely sync up with everyone else in the room, it's like being drunk on sexual euphoria.  You almost lose yourself in it for a moment, but focusing your mind, you snap your eyes open. You see Phylla in front of you looking like a drugged slut; she runs all four of her hands over your " + this.player.cockDescript(x) + " at the entrance of her flooded cunt while her children play with her nipples and suck each other off.  Aggressively, you grab her arms and pin her down while simultaneously shoving your cock into her.");

        this.outputText("\n\nYou feel every mind in the room wince in pain, then be overcome with pleasure as your cock rams into the deepest part of Phylla's cunt.");

        this.outputText("\n\nThe pulsations of her vagina run up and down the length of your cock as she struggles to get into a comfortable position under you.  With the help of her children, she finally finds a good position as you thrust harder and harder on top of her.  Phylla blindly reaches out, each of her hands searching for her offspring.  The largest of your children takes position over Phylla's face - she welcomes his long dick into her mouth.  As the others realize that Phylla is searching for their cocks, they untangle themselves from each other and crawl yearningly to their mother.  Phylla start to pump away at their cocks with her four hands as two latch on to her breasts.");

        this.outputText("\n\nOne of your brood leans down and starts to feverishly lick the base of Phylla's clit as your cock slides in and out of her. His warm saliva coupled with Phylla's natural lubricant warms your cock and sends even more pleasure throughout your " + this.player.cockDescript(x) + ".");

        // If PC has Multi-Cocks:
        if (this.player.cockTotal() > 2) this.outputText("\n\nHaving just one of your cocks pleased as you ram her isn't enough.  You command your children, via the link, to get your other dicks off.  Quickly they oblige, using their hands and mouths to make sure no cock goes unpleased.");
        else if (this.player.cockTotal() == 2) this.outputText("\n\nHaving just one of your cocks pleased as you ram her isn't enough.  You command your children, via the link, to get your other dick off.  Quickly they oblige, using their hands and mouths to make sure no cock goes unpleased.");

        this.outputText("\n\nEverything rapidly starts to blur together.  Your nipples are pinched, but you can't tell by who. Your mind struggles to comprehend which limb is where and whose cock is whose.  You just want this feeling to last forever, lost in a sea of pleasure.  You snap out of your hyper-stimulated state of mind as the six minds connected to yours approach their climaxes.");

        this.outputText("\n\nIn a single instant you feel your synchronized release.  You feel the emptying balls of the five other males");
        if (this.player.balls > 0) this.outputText(" along with your own");
        this.outputText(" as they coat Phylla in cum inside and out.  The walls of her pussy pulse and draw your semen towards her womb.  She swallows the cum of the child that released into her mouth, letting the warm feeling spread down her throat into her belly.  The four other males ejaculate all over their mother's stomach and breasts, coating her tan-colored skin in sperm.  You watch as Phylla uses all four of her hands to spread the semen all over her, as if wanting to bathe in it.");

        this.outputText("\n\n\"<i>I... need... more... we... nee~</i>\" Phylla sits up, but she doesn't look at you.  Instead, she licks her lips and gazes to the entrance of her room.  You turn and follow her stare.  Standing in the door are five or six more warriors, completely erect and ready.  You raise an eyebrow, and look to Phylla with a large grin.");

        this.outputText("\n\nYou spend the next few hours in a massive orgy, getting your dick");
        if (this.player.cockTotal() > 1) this.outputText("s");
        this.outputText(" sucked, stroked, inserted, and finally orgasming so many times that you lose track. Hours pass and you eventually pass out sitting atop Phylla's throne watching the writhing mass before you.");

        this.outputText("\n\nYou wake up some time later, body aching from exhaustion. Glancing over at Phylla to see how she's fairing after so much exertion, you see her sprawled out on cushions with pleased warriors surrounding her, her skin and chitin covered in a thick coat of semen.  You wonder to yourself if you should invite her to the stream to wash off.");

        this.outputText("\n\n\"<i>It's okay... they'll... lick me... clean...</i>\"  You hear Phylla's weak voice in your mind, although she still doesn't look conscious.");
        this.outputText("\n\nYou might want to stay and watch that, but you've spent too long down here already.  You collect your things, trying your best not to step on the twenty or so passed out ants on the floor as you head back to camp.");
        this.player.orgasm('Dick');
        this.dynStats("sen", -2);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Orgy w/ Colony (Female)
    // You tell Phylla you're interested in 'inspecting' your children.
    private antColonyOrgy4Ladies(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("ant-camp=female-orgy"));
        this.flags[kFLAGS.TIMES_CORRUPT_FEMALE_ANT_ORGY]++;
        // (First Time)
        if (this.flags[kFLAGS.TIMES_CORRUPT_FEMALE_ANT_ORGY] == 1) {
            this.outputText("She gives you a confused look, but does as you command. Tilting her head back and closing her eyes you watch as she silently 'communicates' to her children.");
            this.outputText("\n\n\"<i>I did what you asked. Five of my~ I mean our... finest warriors are on their way here.</i>\"");
            this.outputText("\n\nYou give her a nod, hoping that 'the finest warriors' will also have the finest cocks. Your mind quickly wanders to how it's going to feel having five dicks to do with what you please. As you thoughts lead you down the familiar path you can feel your [vagina] moisten");
            if (this.player.hasCock()) this.outputText(" and [eachCock] harden");
            this.outputText(" in anticipation. Snapping you out of your daydream, five males walk into the room holding themselves like veteran soldiers.");
        }
        // (Subsequent Times)
        else this.outputText("She nods weakly, knowing full well what 'an inspection' means by now. Looking down at the floor she closes her eyes and concentrates. After a moment you hear the familiar sound of footsteps rushing to her room. By your guess you would assume the children must be as excited for this as you are. Once they enter the room you can see your hypothesis is indeed correct.  All five of the muscular males are already completely nude and their 10-14 inch cocks are standing erect in anticipation.");

        // (Continued From First/Subsequent)
        this.outputText("\n\nPhylla clearly chose the best specimens from among her colony to show off for you. They quickly line up with their small russet brown abdomens to the wall. You walk down the line in front of them, like a military officer inspecting troops. Their chiseled bodies and large masculine frames look as though they've been working in the mines their whole lives. You stop in front of the largest of them and run your hand over his body with sinister intent looming in your mind. You caress his rough skin as your hand moves up and down his sculpted body.  His pecs tense up in surprise as you drag your nails down his neck; but like a good boy, he makes no attempt to stop you.");

        // If Femininity Greater than X:
        if (this.player.femininity >= 80) this.outputText("\n\nLooking how you do, it's really no surprise that all five of them are erect. Or maybe that's Phylla working to try and impress you; you'll find out soon enough.");

        this.outputText("\n\nYou continue to drag your nails into his chest, leaving bright red marks all the way down to the base of his shaft. He shifts uncomfortably as you guide your palm up his long hard member ending at his head. He lets out a studly grunt as you run your hand back down his cock and start to pump slowly.");

        this.outputText("\n\nYou glance up and down the line of men to see how they're holding up. All of them are watching you intently hoping you'll move to them next. Two of them reach out to start stroking their own cocks but you make a loud noise as if clearing your throat.  They all jump in surprise as you shake your head to denote that they're not allowed to touch themselves.");

        this.outputText("\n\nBy the amount of precum dripping from their cocks you would assume their balls are almost full to bursting.");

        this.outputText("\n\nYou turn to face Phylla, still teasing away, and mention her children need 'release' from time to time. Being the only female and Queen it's only fair she takes care of them. It's for the greater good.");
        // (Silly Mode:)
        if (this.silly()) this.outputText("\n\n\"<i>For the greater good.</i>\" you hear your children echo mindlessly.");
        this.outputText("\n\n\"<i>But... I... don't~</i>\" Phylla says, trying not to stare at you or her children.");

        this.outputText("\n\n\"<i>It's not about what you want! It's about what's fair!</i>\" You scold her. \"<i>You four!</i>\" You gesture to the other males who you aren't servicing. </i>\"Go get some 'release.'</i>\"");

        this.outputText("\n\nPhylla looks almost terrified as her four offspring descend on her, cocks in hand.  You stop stroking the cock of the only remaining male and demand he remove your armor. Quickly he uses all four of his strong arms to remove your [armor]. Once you're completely nude you push him onto his knees.");
        if (this.player.isBiped()) this.outputText("  Setting one foot on his shoulder, you present your [vagina] to him.");
        else this.outputText(" Now at the perfect height, you present your [vagina] to him.");
        this.outputText("  Knowing full well what you want he plunges his face into your ready cunt and starts eating you out. You close your eyes and lean back, letting the passion of his licking consume your thoughts. You hear a loud moan and it snaps you out of your revelry.  You look over to Phylla. Her children have forced her onto her knees. Phylla uses all four of her hands and her mouth to please her children. You see her sloppily sucking off one dick then jump to sucking off another, exchanging her mouth with her hands as she services every dick in front of her. You glance between her legs and see streams of her wetness as it runs down her chitin legs and pools around her knees.");
        this.outputText("\n\nGetting close to orgasm just by the oral pleasure coursing through your nethers, you pull the head of the ant");
        if (this.player.isBiped()) this.outputText(" from between your legs.");
        else this.outputText(" from your cunt.");
        this.outputText("  You beckon him to follow you as you strut over to where Phylla is.");
        this.outputText("\n\nPhylla's glazed eyes and blank expression look very cute in a very twisted sort of way. She looks up and gazes at you as a fresh load of semen drips from her open mouth.");

        this.outputText("\n\n\"<i>I...</i>\" She trys to say before you interrupt her.");
        this.outputText("\n\n\"<i>Swallow that! I won't have any of our children's seed go to waste,</i>\" you demand.");
        this.outputText("\n\nPhylla closes her mouth, smiles, and swallows. You watch her small adam's apple go up with a gulp.  Once she's finished she opens her mouth to show you that she didn't let a drop go to waste.");
        this.outputText("\n\n\"<i>Please... I... we... need...</i>\"");
        this.outputText("\n\nYou kiss her, knowing that's what the slut wanted the whole time.");
        this.outputText("\n\nYou feel your mind and emotions synchronize with Phylla's. It's a bit overwhelming at first.  All you can feel from Phylla is her unbridled need to mate with everything, male, female, both, it doesn't matter to her.  She just wants... no, needs... to breed.");
        this.outputText("\n\nThis joined feeling sets both your loins afire.");
        this.outputText("\n\nYou reach down and give her pussy a playful touch. The surprise touch causes her nectar to pulse out, splashing lightly on your hand. You move your legs in between hers so that your pussies meet. Feeling her long hard clit on the folds of your [vagina] only makes you want it more but there's others in the room as well and they need attention. As you rock your hips into Phylla the males gather around the two of you in a circle. Holding on to Phylla's abdomen for balance you grab the nearest cock in front of you and start to suck it wildly. You can hear grunts and moans as Phylla takes a cock in her mouth as well.  You feel a dick caress the back of your free hand. Without a second thought you grab hold of it and start to pump.");
        this.outputText("\n\nYou and Phylla almost break apart as a male wriggles his way between you two and shoves his 14 inch cock interveningly between your two cunts. You hear Phylla coo at this sudden intruder.");
        this.outputText("\n\nThe two of you sandwich his cock between your pussies as you both gyrate your hips along his shaft. The cock between your legs throbs as it slides in and out of between your tightly joined cunts.");
        this.outputText("\n\nFeeling your children's yearnings through Phylla's mind gives you an idea. Though normally you wouldn't want to give up control, the current situation and your craving for something to fill your [vagina] leads you to command your man sluts to stop. You untangle yourself from Phylla, leaving the moaning whore begging and grabbing at you to rejoin her. You stand above her as she practically grovels at your feet, pleading for you. You mention you have a much better idea.");
        this.outputText("\n\nWith a commanding tone in both voice and mind you tell Phylla to get into the doggystyle position facing away from you.");

        // If Laying Eggs:
        if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] > 0) this.outputText("\n\nYou're sure she would have too, had it not been for her massive egg filled abdomen. The best she can muster is to lay on her side with one of her legs up in the air.  Still, you think it will work for what you have in mind.");
        // If NOT Laying Eggs:
        else this.outputText("\n\nQuickly, Phylla scrambles into position.  Reaching back with her two larger hands, she lifts her abdomen so you get a full view of her shapely ass and juicy cunt.  She starts to lightly thrust her ass in the air.");

        this.outputText("\n\nOnce she's in position, you get into the same position adjacent to her, lifting your own [butt] high into the air, like Phylla is. She looks over at you with a shocked expression on her face.  She looks as though she's about to say something but her attention is quickly drawn back to her offspring.  Two of the males present their cocks to your mouths.  The alluring aroma of pre-cum and saliva is practically begging you to take them into your mouth.  Glancing over you can see Phylla is having just as hard a time stopping herself from gobbling down the cock in front of her, but it's not just that time. You make a mental signal and two more step up behind the both of you.  You hear Phylla 'Eep!' as the heat radiating off her sex is intruded upon. The two behind you drag their dicks up and down the folds of your vaginas.  The fifth takes position behind his brother who's behind Phylla.  Wouldn't want any hole going to waste, would we?");

        this.outputText("\n\nWith both yours and Phylla's asses hanging in the air like dogs in heat, you feel your joined excitement for what's going to happen next.  You can feel the heat radiating off your cunts warming the tips of the cocks behind you. You smell the intoxicating aroma of sex in the air.  Male and female fluids joining, the scent of earth, the heavy labored breathing of everyone in the room.  It all joins to consume your senses.");
        if (this.player.hasCock()) {
            this.outputText("  You feel hands run up and down your shaft");
            if (this.player.cockTotal() > 1) this.outputText("s");
            this.outputText(", causing you to spurt bursts of pre all over the floor.");
        }
        this.outputText("\n\nPhylla's mind screams out for penetration.  Your own mind and your body cannot handle the anticipation anymore either.");
        this.outputText("\n\nMentally you give the 'go ahead' to your children, something you feel they've been waiting for! All five males thrust their cocks forward in unison.  You're not sure what feels better; the fact that your mouth and [vagina] are now filled with your own children's genitals, or the fact that Phylla is too hyperstimulated to even fully comprehend what's happening to her.  Your tongue wraps around your son's cock as you do your best to drink in the pre-cum he's been accumulating.  The ant behind you thrusts at an alarming rate, sending shockwaves of passion though your body.  You hear Phylla's moans of pleasure though the dick she has stuffed in her mouth.  The triumphant roar of your child almost overpowers her moan as he thrusts into his brother; who in turn thrusts deep into Phylla.  You want to look over, you want to enjoy the sight of seeing Phylla skewered by dicks like a cabob. Unfortunately the sons at your front and rear keep your mind and body thoroughly occupied with their long throbbing man meat.");
        this.player.cuntChange(20, true, true, false);
        this.outputText("\n\nWhen you can muster the fortitude and focus enough to open your eyes, without them rolling back into your head, all you see is your son's cock as you deep throat him.  The harder and deeper the ant behind penetrates into your [vagina], the deeper the cock of the one in front thrusts into your throat.  Not that you're complaining, both of the feelings send crushing waves of euphoria through your mind and body.");

        // If PC has dick(s):
        if (this.player.hasCock()) {
            this.outputText("  Not forgetting you have 'other needs' the ant mounting you reaches down with his larger arms and grabs hold of [eachCock].  Keeping his smaller arms on your hips to keep stable with each thrust, he pumps vigorously at your cock");
            if (this.player.cockTotal() > 1) this.outputText("s");
            this.outputText(".");
        }

        this.outputText("\n\nYou feel your son's thrusts into the depths of your cunt become slower but with more force behind them, signaling to you the inevitable, conclusion to your insestrial orgy.  Not wanting him to cum too early, you mentally reach for Phylla's mind to see how she's~");
        this.outputText("\n\n Before you can finish searching, Phylla's mind and pleasure crash into your mind like a wave.  She's cum twice already but she's close again and all 5 of your children are teetering on the edge of climax as well.");
        this.outputText("\n\nThe sounds and speed of this sexual romp reach a crescendo as you do your best to tighten the muscles of your ass and cunt, calling to the son mounting to give it all he's got.  You feel and hear Phylla follow your lead, bracing herself as your sons thrust against the two of you in unison.  Both of your mouths form tight seals on the cocks in them as you both get pounded from behind.");
        this.outputText("\n\nIn one last climax-inducing thrust, all five of your children, Phylla and you share in one of the most ectasy filled orgasms you've ever experienced.");
        this.outputText("\n\nYour own orgasm rocks your whole body as you try your best not to black out due to the sheer volume of pleasures your shared minds are experiencing.");

        // If player is squirter:
        if (this.player.wetness() >= 4) this.outputText("\n\nYou roar in climatic bliss as you feel your already soaked cunt release its fury as you squirt your juices all over the ant mounting you.");
        // If player has dick(s)
        if (this.player.cockTotal() > 0) {
            this.outputText("\n\nAlthough you wish someone had been under you to catch your cum as it erupts from your dick");
            if (this.player.cockTotal() > 1) this.outputText("s");
            this.outputText(".  You feel your load");
            if (this.player.cockTotal() > 1) this.outputText("s");
            this.outputText(" splash into your [chest] and chest as ");
            if (this.player.cockTotal() == 1) this.outputText("it");
            else this.outputText("they");
            this.outputText(" unload.");
        }

        this.outputText("\n\nYou feel a flood of warmth fill your womb as the warrior behind you unloads his swollen nuts into you.  This eruption of passion fills you with maternal pride, a feeling you're sure is mostly being projected into your mind by Phylla, as you feel her belly fill with the same warmth.  The ant dick in your mouth throbs; you quickly reach up and gasp his balls, begging for everything he's got, and he doesn't disappoint.");

        this.outputText("\n\nYou feel his salty payload erupt in bursts from his urethra, coating the back of your throat, and flooding into your mouth; causing you to puff out your cheeks a bit.  You hastily gulp it all down, feeling the warm load slide down your esophagus into your stomach.");
        this.outputText("\n\nOnce you're done, you look over at Phylla and see she's just finishing her own 'meal.'  Watching her head bob up and down on her son's cock as the muscles of her neck work to swallow the salty snack is very sexy to watch.");
        this.outputText("\n\nNow that your head is clearing up you see you've completely spent all five of your children as they collapse into a pile.  Phylla half crawls, half drags, herself over to you, semen and her own juices oozing from between her legs, leaving a small trail behind her.");
        this.outputText("\n\n\"<i>I-I need more... not... done...</i>\"");
        this.outputText("\n\nYou then realize Phylla wasn't crawling to you at all, but to the doorway.  Looking at the door you see at least four more males, fully erect and ready to go.");

        this.outputText("\n\nYou chuckle to yourself; what a good slut Phylla has become.  You might as well join her - don't want her to have all the fun.");
        this.outputText("\n\nYou wake up some time later, your body aching from exhaustion.  You look over at Phylla to see how she's fairing after the orgy.  She's sprawled out on her cushions with pleased warriors surrounding her.  Her skin and chitinous armor is covered in a thick coat of semen.  You wonder to yourself if you should invite her to wash off.");
        this.outputText("\n\n\"<i>It's okay... they'll... lick me... clean... oh, don't worry about getting pregnant; they're all sterile unless I say otherwise.</i>\"  You hear Phylla's weak voice in your mind, although she still doesn't look conscious.");
        this.outputText("\n\nYou might want to stay and watch that, but you've spent too long down here already.  You collect your things, trying your best not to step on the twenty or so passed out ants on the floor as you head back to camp.");
        this.player.orgasm('Vaginal');
        this.dynStats("sen", -1);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // ►[Lay Eggs / Don't Lay Eggs]
    private phyllaLaysEggsToggle(): void {
        this.clearOutput();
        // (Lay Eggs)
        if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] == 0) {
            this.flags[kFLAGS.PHYLLA_EGG_LAYING] = 1;
            this.outputText("Phylla seems confused as to what you're thinking as you gaze deeply into her eyes.  You gather all four of her hands between the two of yours and tell her that children are wanted.  Not just one or two; you want as many as she can muster.");
            // If you've talked to her about history:
            if (this.flags[kFLAGS.TALKED_WITH_PHYLLA_ABOUT_HISTORY] > 0) this.outputText("  You tell her you want a colony like those she spoke of in the times before the corruption.");

            this.outputText("\n\nAt first her eyes widen with shock, but then you see the reaction you were expecting; her face lights up with such a gleeful smile you could have sworn you just lit a large fire in the room.  She looks so excited; in fact, she seems to have lost her train of thought and just stands there taking in what you said... it's a bit odd.  Then she suddenly turns around and drops down on all fours.  Her abdomen rises, revealing all of herself to you.  Her embarrassment is clearly overshadowed by her desire to breed with you.  She looks at you from between her own legs and blushes, her cheeks growing as red as a tomato.  Using her two upper arms, she points to her abdomen, keeping her lower arms to support her as she's bent over on all fours.  There's a small opening that almost looks like a second vagina placed at the very end of her abdomen.  A clear coat of transparent liquid is already starting to seep out from the opening and has started to run down her abdomen.");

            this.outputText("\n\n\"<i>I just...  need you to lick it.  I mean, that's one way...  there are others, I mean, but this is the quickest; I want to start laying before nightfall.  Please...  I need this...</i>\"");
            // [Yay!] Transition to - LICK THAT!
            // [On your own] Transition to - DON'T LICK THAT!
            this.menu();
            this.addButton(0, "Lick That", this.lickThatAntButt);
            this.addButton(1, "Don't Lick", this.dontLickAntButt);
        }
        // (Stop Laying Eggs)
        else {
            this.flags[kFLAGS.PHYLLA_EGG_LAYING] = 0;
            this.outputText("You sigh to yourself; you never really wanted this conversation but you knew it might happen someday.  You make a stern face and put a determined fatherly tone in your voice.  Phylla immediately senses you mean business and you have her full attention.  You try to tell her as gently as possible that you don't think it is safe for her to keep having children.");

            this.outputText("\n\nTo your almost astonished surprise she hesitantly agrees with you; somehow, you expected her to argue with you or plead to bring more life into this world.  \"<i>If you feel it's not safe for me to have anymore children, I won't.  I mean, you're both my mate and my colony's protector.  I would not want to endanger my children by overpopulation or the chance of corruption.</i>\"");
            this.outputText("\n\nShe pauses and makes a strange face as her abdomen pulses and another egg emerges from the tip.  She blushes deeply.  \"<i>That's the last one!  I mean, I had to get it out, it was already...</i>\"");
            this.outputText("\n\nYou cut her off by asking when her abdomen will return to normal size - both because you're curious and because you really didn't want her to finish that sentence.  \"<i>It shouldn't take long.  I can already feel it changing.</i>\"");
            this.outputText("\n\nSmiling, you thank her for complying with all your demands.  You leave the colony, heading back to camp.");
            this.doNext(this.camp.returnToCampUseOneHour);
        }
    }

    // LICK THAT!
    private lickThatAntButt(): void {
        this.clearOutput();
        this.phyllaSprite();
        this.outputText(this.images.showImage("ant-camp-lay-egg-licked"));
        this.outputText("You tilt your head slightly.  You thought she said she could start to lay any time after the first time you had sex with her.");
        this.outputText("\n\n\"<i>It is... faster... to kickstart it... if you help... please...</i>\"");

        this.outputText("\n\nHearing Phylla beg like this gets you aroused to some degree, but there's no time!  In the few seconds it took for her to explain to you what you need to do, the small trickle of liquid now seems to be spurting out in pulses much like what you would think the contractions of a pregnant woman would be like.");

        this.outputText("\n\n\"<i>Now!  Please!  I can't wait!</i>\"  Phylla's begging moans force you into action.");

        this.outputText("\n\nYou grab the sides of her abdomen with both of your hands and dive into her birthing slit with your face.  Almost as soon as your tongue enters her river-like slit, she shudders as a powerful orgasm washes over her.  The vagina between her legs sprays girl cum all over the floor, some of it launching far enough to reach your feet.");
        this.outputText("\n\nFaced with this, you don't even attempt to stop or even slow down.  You ravage her birth canal with your tongue like it owes you money.  She orgasms again and then again a few minutes later - the only real way you have of telling at this point is when her warm juices squirt out and splash at your feet.  At this point, she's just moaning and shaking constantly.  If you hadn't been holding her abdomen all this time she'd have fallen over several orgasms ago.");

        this.outputText("\n\nAfter about an hour of this, you remove your face from her wetness and release your vice-like grip on her abdomen.");

        this.outputText("\n\nAs she collapses in front of you, your eyes widen in shock.  You hadn't even noticed while you were occupied with pleasuring her, but her abdomen has almost quadrupled in size!  It's now easily six feet long, and it seems like every time you blink it gets just a little larger.  Stepping towards Phylla's body - now almost blocked by her engorged abdomen - you hear a distinct splash.  Looking down, you find to your amazement that the floor is almost completely coated in a thick layer of mixed girl cum and birth lubricant.  Honestly, there is no way of telling which one there's more of.  The mixture of fluids smells like an earthy plain after a light rain.  As you make your way to Phylla, you see her breasts have also grown in size and could now easily be DDs.  She makes a totally exhausted grab at you with all four of her arms, her eyes still rolling up in the back of her head slightly.  You forget that even in her current state she's amazingly strong and with a small splash, she drags you down into laying next to her.  All four of her arms wrap around you lovingly.");

        this.outputText("\n\nAfter about a minute or two her eyes widen suddenly, her body contracting.  With a sudden pulse you can see a contraction run down Phylla's abdomen.  A small cylindrical egg about the length of your forearm pops out of the birth slit you were just licking for the last hour.");

        // First Time:
        if (this.flags[kFLAGS.ANTS_BIRTHED_FROM_LICKING] == 0) {
            this.outputText("\n\nIt's a strange thing, unlike any egg you've seen before.  It doesn't have a shell and is transparent.  The liquid inside of it seems to be shimmering, as if there were thousands of tiny gold flecks in it.  In the very center there's a black sphere that unfolds into a larva as you look at it.  Phylla quickly snatches it up and holds it between the two of you.");
            this.outputText("\n\n\"<i>This is the beginning of a whole new life for me...  I mean, for us.  I'll always remember this, [name]!</i>\"  Phylla cries, cradling the egg close to her, proud to be a mother.  \"<i>I... I love you.</i>\"");
            this.outputText("\n\nYou were about to return the compliment when her body contracts again and another egg pops out of her abdomen.");
            this.outputText("\n\n\"<i>So quickly?</i>\" you question her, clearly surprised at the rate at which she can reproduce.");
            this.outputText("\n\nOnce she has recovered, she responds, gasping for breath between contractions.");
            this.outputText("\n\n\"<i>It's not usually... this fast.  It's just... you... did so well...</i>\" she gasps between smaller contractions.");
        }
        // Subsequent Times:
        else this.outputText("\n\nYou know the drill.  You unwrap yourself from Phylla and walk over to scoop up the cyclical egg.  Once you've gotten it you bring it back to her.  Although as soon as you do, she snuggles up with it.");
        this.outputText("\n\nAfter only a minute or two, a large contraction passes through her body, and another egg seeps out of the tip of her abdomen.  You can see she's going to be very busy for the next few hours, maybe days; you're not really sure, and clearly she's in no condition to respond even if you asked.  You kiss her and head back to camp, happy with the job you've just accomplished.");
        this.flags[kFLAGS.PHYLLA_COOLDOWN] = 12;
        this.flags[kFLAGS.ANTS_BIRTHED_FROM_LICKING]++;
        if (this.flags[kFLAGS.ANT_KIDS] < 5000) this.flags[kFLAGS.ANT_KIDS] += 5;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // DON'T LICK THAT!
    private dontLickAntButt(): void {
        this.clearOutput();
        this.phyllaSprite();
        this.outputText(this.images.showImage("ant-camp-lay-egg-not-licked"));
        this.outputText("Hesitantly, you tell Phylla that you aren't exactly comfortable with licking her privates... while they are leaking birthing fluids.  Acting quickly though, you reassure your lover and tell her that you're willing to massage her intimate parts.  A warm smile spreads across her face; she's pleased that despite your reservations, you're willing to help her in a way that works for both of you.");
        this.outputText("\n\n\"<i>T-thank you...</i>\"  She whispers, breathing in a mix of anticipation and need as you work your way behind her.  As you touch her slit she gasps, your soft touch causing her to shudder.  The contractions of birth start not long after, no longer held back by Phylla's will.  \"<i>More...  Oh gods, more...</i>\"  She whimpers, groaning with each convulsion of muscle.  Plying your thumbs, you begin to massage the outer opening in a circular fashion, doing your best to gently aid Phylla in bringing your children into the world.");

        this.outputText("\n\nThe process of simulation goes on for a several long, moan filled minutes, until with a hearty cry the orb that holds your newborn child slides out from Phylla's abdomen.  Panting and breathing a sigh of relief, your Ant Morph lover thanks you, but reminds you that she has quite the clutch of eggs that still needs to be laid.  Smiling, you renew your efforts along her orifice, to the affectionate gasps of Phylla...");

        this.outputText("\n\nThe better part of an hour later, the two of you lay against Phylla's bedding in a loving embrace; you cuddle the exhausted ant woman close to you as she enjoys the tender feel of your fingers running through her hair.");

        this.outputText("\n\n\"<i>Thank you.  I-it meant a lot to me for you to be here.</i>\"  She confides.  You tell her that it was no trouble at all; that you wouldn't miss this joyous moment.  Phylla sneaks in a soft kiss on your neck and gives you a firm squeeze of her arms.  \"<i>I should be alright on my own at this point");
        if (this.flags[kFLAGS.ANT_KIDS] > 1) this.outputText("; the children can tend to the eggs and I can really use the rest");
        this.outputText(".  You should get back to your duties...  B-but I wouldn't mind if you came back later...</i>\"");

        this.outputText("\n\nYou remark to Phylla that you might just take her up on that and wink as you leave your exhausted lover to recuperate, passing several of your children as they scoop up the bundle of eggs that lie huddled together on the floor.");
        this.flags[kFLAGS.PHYLLA_COOLDOWN] = 6;
        this.flags[kFLAGS.ANT_KIDS]++;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Phylla lays Drider eggs
    private phyllaLaysSomeDriderEggs(): void {
        this.clearOutput();
        this.phyllaSprite();
        this.pregnancy.knockUpForce(); // Clear Pregnancy
        this.outputText(this.images.showImage("ant-desert-lay-drideregg"));
        this.outputText("As you near Phylla's bedchamber you can hear an 'Eeep!' of surprise and worry. Thinking she might be in trouble you burst into the room.  Glancing around for any immediate danger you only see Phylla's vagina drooling a green, slimy mucus.  The way she holds her very pregnant stomach and splays her legs out on the bedspread suggests that your recently laid spawn are ready to hatch.  \"<i>[name], it's time!  UGH!  I don't... have to words to express how weird this feels!</i>\"  Phylla cries out, somewhat scared at the green ooze that trickled out of her.");

        // PC has less than 75 corruption:
        if (this.player.cor < 75) {
            this.outputText("\n\nQuickly kneeling at her bedside, taking one of her larger her hands in yours, you inform her that your children are ready to enter this world. They need their mother to concentrate and push.");
            // If Phylla is Laying (her) Eggs while Drider eggs hatch:
            if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] > 0) this.outputText("\n\n\"<i>It's~AHHH!</i>\"  Phylla moans into your shoulder as a contraction passes through her abdomen.  \"<i>I don't know if I can do both!</i>\"  Phylla cries.  In a reassuring tone you tell Phylla she just needs to push both at once.");
            this.outputText("\n\n\"<i>I~Ahhh</i>\" her words, again, stolen from her as you see her whole body contract.");
            this.outputText("\n\n\"<i>Oh, gods, I can feel yours sliding out!</i>\"  She half exclaims, half moans.  Phylla's body writhes in a mixture of pleasure and pain as she solely focuses on pushing.  After what seems like an eternity, she breathes a heavy sigh of relief as the first of many eggs works its way out of her.");
            // If Phylla is Laying (her) Eggs while Drider eggs hatch:
            if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] > 0) this.outputText("\n\nAt the same time your egg drops to the floor, you see one of Phylla's eggs glide out of the tip of her abdomen with the aid of the thick gel she produces.");

            this.outputText("\n\nWith the knowledge that ");
            if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] > 0) this.outputText("both eggs are just fine on their own");
            else this.outputText("the egg is just fine on its own");
            this.outputText(", you redirect your focus to helping Phylla through the labor.  Each subsequent egg that finds its way to freedom causes Phylla's once pain filled screams to turn into pleasurable moans of euphoric delight as her pussy becomes overwhelmed by the stimulation of each of your eggs working their way out.  At long last, the final egg slithers out of her vagina and lands gently on the bedding.  Her ordeal over, Phylla breathes a long sigh of relief.");
            // First Time:
            if (this.flags[kFLAGS.PHYLLA_TIMES_DRIDER_EGG_LAYED] == 0) this.outputText("\n\n\"<i>I-I've never given birth like that b-before.</i>\"  She manages between gasps for air while rubbing her now normal-sized belly.\n\n\"<i>I mean!  I want to, it was just different, usually I... use my...</i>\"  She shyly gestures to her abdomen.  \"<i>You'll have to do that to me again sometime.</i>\"  You feel a maternal warmth radiating from Phylla.  It's clear to you she just enjoys being a mother; it doesn't really matter to her what her children look like.");
            // Subsequent Times:
            else this.outputText("\n\nRubbing her now empty belly Phylla remarks on how much she loves giving birth through her 'other hole' and how you should knock her up this way much more often.  Again you feel the maternal warmth radiating from Phylla.");

            this.outputText("\n\nYour intimate moment with her is interrupted by the crackling and hatching of egg shells as your brood clamors for freedom.  Sighting their mother, they scurry up the bedspread and set up a pecking order for who will get the first go at Phylla's milk filled breasts.  The birthing complete, you kiss Phylla on the lips and thank her for hosting your young.  \"<i>Thank you for helping me achieve my purpose in life.  I know you have other things to do, but just know that... I love you.</i>\" She weakly replies.  You wink at her and nod before heading back up to the surface.");
            this.doNext(this.camp.returnToCampUseOneHour);
        }
        // PC has more than 75 corruption:
        else {
            this.outputText("\n\nGood, you get to watch while your corrupted young are birthed out of this creature naive enough to submit to your desires.  Phylla's painful screams quickly turn into blissful moans as her instincts for sexual pleasure dull the irritating agony and take over her mind.  You barely register any of it as your thoughts turn to future instances of pinning Phylla down to her bedding - how her ass will wave enticingly in the air just before you penetrate her and plant as many eggs as you can muster inside of her, how she'll beg to be stuffed with your brood and howl like a depraved whore as your cargo fills her with your corrupted brood.");
            this.outputText("\n\nThe first egg works its way out of Phylla's pussy as she hums in obvious sexual delight.  You lick your lips at the sight; you can barely contain the urge to mount her right now and impregnate her with more of your future children, imagining the look of content violation on her face as you do so.  But you manage to restrain yourself, opting instead to watch the show as egg after egg worms its way out.");
            // If Phylla is Laying (her) Eggs while Drider eggs hatch:
            if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] > 0) this.outputText("\n\nAs if your own corrupt brood weren't enough for her, she has to deal with giving birth to her own offspring at the same time.");
            // First Time:
            if (this.flags[kFLAGS.PHYLLA_TIMES_DRIDER_EGG_LAYED] == 0) this.outputText("\n\nHmm... That's something you didn't know she could do and something you'll damn well keep in mind for the future.  You watch as she struggles to time the different contractions of her abdomen and cunt, but ultimately fails to do so.  It's soon very clear she's no longer aware of which egg is coming out of which hole and just screams out in passionate moans as her whole body surges and pulses with contractions.");
            this.outputText("\n\nWith one last heave the last egg is expelled from Phylla's pussy.");
            // If Phylla is Laying (her) Eggs while Drider eggs hatch:
            if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] > 0) this.outputText("\n\nThough judging by the size of her abdomen, you're sure she still has a few left.  Her own eggs don't seem to cause her as many 'problems' as your eggs do.  Phylla tiredly slumps back to her bed, completely spent.");
            this.dynStats("lus", 45);
            if (this.player.canOvipositSpider()) {
                this.outputText("\n\nGods DAMN!  You want to knock her up so bad!  Your Drider urges to mount her are in danger of overwhelming you and reducing you to a brainless breeder... maybe that isn't so bad after all, but you need to make a decision now before you're consumed by lust!");
                this.menu();
                // [Leave her to recover] - Let Phylla Recover  [Mount] - Mount Phylla
                this.addButton(0, "LetHerRecover", this.letPhyllaRecover);
                this.addButton(1, "Mount", this.driderDoublePhllaMount);
            }
            else {
                this.menu();
                // [Leave her to recover]
                this.addButton(0, "Next", this.letPhyllaRecover);
            }
        }
        this.flags[kFLAGS.PHYLLA_TIMES_DRIDER_EGG_LAYED]++;
        this.flags[kFLAGS.PHYLLA_DRIDER_BABIES_COUNT] += 5 + rand(4);
    }

    // Mount Phylla:
    private driderDoublePhllaMount(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("ant-camp-ant-mounted-by-drider"));
        this.outputText("No longer able to control yourself, you rip free of your [armor] and charge up to Phylla's bed, catching her by surprise as she looks up at you.  With a seductive smile, you pin her down and slather your ovipositor against her fuck hole.");
        this.outputText("\n\nYour voice whispers through her being and ignites her sexual desire as you tell her that you feel she'd benefit from having more eggs inside of her.  Bending her rump so that you have the perfect angle, Phylla whimpers in uncontrollable anticipation.");

        this.outputText("\n\nNot one to keep a 'queen' waiting, you lurch forward and work your egg-filled appendage into her still wet cunt, edging deeper and deeper, releasing your lubricative mucus inside of her until you can go no further.  Now tightly within her depths, your ovipositor convulses in orgasm as your payload works its way into her body, leaving you screaming in sexual fury as you once again impregnate Phylla with your eggs.");

        this.outputText("\n\n\"<i>OH GODS!  I-I NEED MORE!  FILL ME!  FILL ME WITH YOUR YOUNG!  GUAAAHHHHHHHH!</i>\"  She howls furiously.  Grinning, you take satisfaction in how far you've pushed Phylla, turning her into an eager eggslut.  Glazing over, her eyes roll up into her head as she wears an expression of sensual devastation.");

        this.outputText("\n\nAt last, your egg supply is exhausted and you pull free of the Ant Morph, carefully walking over broken and soon to be broken egg shells as your children skitter up to their mother's nourishing breasts.  Phylla only coos with deep content as she cradles her stomach, barely taking notice of the young spiders that squabble over who gets to suckle first.");
        this.player.orgasm('Ovi');
        // empty eggs and such!
        this.player.dumpEggs();
        // set phylla drider preggo timer
        if (!this.pregnancy.isPregnant) this.pregnancy.knockUpForce(PregnancyStore.PREGNANCY_DRIDER_EGGS, 8 * 24); // Supposed to be eight days, not eight hours
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Let Phylla Recover:
    private letPhyllaRecover(): void {
        this.clearOutput();
        this.outputText("Working up all of your self control, you decide that Phylla could use the rest.  You wink at Phylla as you leave, telling her that you'll be back to fuck her brains out shortly... once she feeds your children.  She only musters the strength to smile and mutter something about motherhood but you're already halfway out the door.");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // ►[Children - Only available if Phylla has laid eggs]
    private phyllasKidsChildren(): void {
        this.clearOutput();
        this.outputText("Phylla seems surprised you would be interested in the fruits of your loins.  \"<i>Usually once my kind take a mate they never come back to their colony.  I mean!  Not that I don't want you to come back, I-I like when you come down here.  It's just, usually not what happens.</i>\"  You reassure her you don't mind and that sometimes it's good to get away from the surface to see your progeny.  Her face seems to light up when you imply that they're 'your children.'");

        this.outputText("\n\n\"<i>They're great; I mean... just look at who they come from.</i>\"  She gives a timid nudge and continues.  \"<i>They take care of me and we've started to dig deeper into the ground.</i>\"");

        // If birthing for less than 10 days:
        if (this.flags[kFLAGS.DAYS_PHYLLA_HAS_SPENT_BIRTHING] < 10) this.outputText("\n\n\"<i>We haven't made much progress, but many of our children are still young and not fully able to serve me.  I mean us!</i>\"  She quickly corrects herself.  \"<i>The progress is slow but it's nice to have them around.  Little reminders of you when you're not here.</i>\"  She smiles widely.");
        // If birthing for more than 10 days:
        else if (this.flags[kFLAGS.DAYS_PHYLLA_HAS_SPENT_BIRTHING] < 40) this.outputText("\n\n\"<i>We've made considerable progress as you can no doubt tell.  Most of our children are completely capable of digging their own tunnels and with as many as we have, the progress is quite fast.  A few of them have even taken your name.  I mean, I hope you don't mind.  I started running out of names around the one hundredth egg.</i>\"");
        // If birthing for more than 40 days:
        else {
            this.outputText("\n\n\"<i>The colony is as big and wonderful as I ever hoped it would be. I've now toned back on my egg laying to keep our colony at a sustainable level.  This colony even rivals my mother's - in fact, I think it's a little bigger.</i>\"  You hear a very prideful tone in her voice.  Though she seems thrilled, Phylla can tell that you don't really feel the same way; her mother's colony was massive and you consider the possibility that you might have let this go on a little too long.");
        }
        this.outputText("\n\nClearly she sees you're not at ease and tries to reassure you.  \"<i>We don't have an arena like my mother did; I have no reason for such a thing.  I mean, unless it would make you feel more comfortable down here...</i>\"  That's the last thing that would make you comfortable; you could have died in that arena and you'll be damned if you ever see another one again.  \"<i>Well, your children are happy.  They're living out their lives in peace and prosperity.  All thanks to you.</i>\"");

        // If Phylla given birth to Drider Eggs:
        if (this.flags[kFLAGS.PHYLLA_TIMES_DRIDER_EGG_LAYED] > 0) this.outputText("\n\nYou inquire about ALL of your children, knowing Phylla was just talking about your ant offspring previously.  Phylla quickly glances at the ground, clearly embarrassed she forgot and that you remembered.\n\n\"<i>They're...much larger than I would have expected, and I... can't communicate with them like I can with my... kind... but they help dig, I mean... they're capable of digging... they're just more playfully aggressive and rambunctious than I expected.  But their size makes them excellent guards and caretakers for the rest of the children.  I'm not used to it, but I love them just as much as my own.</i>\"");
        // PC has birthed 30 Drider children or more:
        if (this.flags[kFLAGS.PHYLLA_TIMES_DRIDER_EGG_LAYED] > 10) this.outputText("\n\nShe sighs forlornly but continues.  \"<i>Some of our drider offspring have even taken it upon themselves to leave the colony and venture out into the world.  Not that I mind; it's just sad seeing them go sometimes.  I know we did a good job raising them, and I hope they take the lessons we taught them to heart, and that they never forget where home is...</i>\"");
        // Ending for Scene
        this.outputText("\n\nYou feel good about this.  Standing up to survey the colony, you can see Phylla is also very content.  You thank her for talking to you and head back to the surface, toward camp.");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // ►[Appearance]
    private phyllaPearance(): void {
        this.clearOutput();
        // Not Laying Eggs
        if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] == 0) {
            this.outputText("Phylla is a 5-foot 8-inch tall ant morph with a very small, feminine frame covered in highly defined muscles.  She has four arms, two that attach at her shoulders and two slightly smaller ones that attach at her serratus anterior on her stomach.  Both sets of her arms and human-like legs are covered in plates of semi-reflective brown chitin armor.  Her interlocking joints remind you of how insect joints connect to one another. Her abdomen is about 4 feet long and is covered in large interlocking plates of skin colored exoskeleton.  Despite the fact that she has to carry the weight of an abdomen, her hips are very girly.  Her well toned butt is rarely seen as her abdomen covers it most of the time.  She has a sharp, slightly feminine face and large almond shaped emerald-green eyes with no hint of pupils or irises.  Her mouth is surprisingly large considering how thin her lips are.  When she smiles at you, you see a single row of human like teeth with typical human canines.  Her short brown hair is usually matted and covered in dirt, although on rare occasions she styles it so that two long bangs frame her face leaving the rest to flow around her neck.");
            this.outputText("\n\nShe has a pair of B-cup breasts, with a single 0.5 inch nipple on each breast.");
            this.outputText("\n\nShe has one extremely tight pussy placed between her legs, with a 2.0 inch clitoris.");
            this.outputText("\n\nShe has one asshole placed between her well toned butt-cheeks, right where it belongs.");
            this.outputText("\n\nShe has one birthing slit placed on the underside tip of her abdomen where her eggs are birthed from.");
        }
        // When Laying Eggs
        else {
            this.outputText("Phylla is a 5-foot 8-inch tall ant morph with a very small, feminine frame covered in highly defined muscles.  She has four arms, two that attach at her shoulders and two slightly smaller ones that attach at her serratus anterior on her stomach.  Both sets of her arms and human-like legs are covered in plates of semi-reflective brown chitin armor.  Her interlocking joints remind you of how insect joints connect to one another. Her abdomen is currently engorged with eggs and is about 7 feet long!  It is covered in large interlocking plates of skin colored exoskeleton and every minute or two you watch Phylla moan as it contracts and relaxes, popping out another egg.  Despite the fact that she has to carry the weight of an abdomen, her hips are very girly.  Her well toned butt is rarely seen as her abdomen covers it most of the time.  She has a sharp, slightly feminine face and large almond shaped emerald-green eyes with no hint of pupils or irises.  Her mouth is surprisingly large considering how thin her lips are.  When she smiles at you, you see a single row of human like teeth with typical human canines.  Her short brown hair is usually matted and covered in dirt, although on rare occasions she styles it so that two long bangs frame her face leaving the rest to flow around her neck.");
            this.outputText("\n\nShe has a pair of DD-cup breasts, with a single 0.5 inch nipple on each breast.  Bursts of milk occasionally spurt from her swollen areolas in time with her contractions.");
            this.outputText("\n\nShe has one extremely tight pussy placed between her legs, with a 2.0 inch clitoris.  A small stream of lubricant constantly flows down her legs, her lips slightly parted.");
            this.outputText("\n\nShe has one asshole placed between her well toned butt-cheeks, right where it belongs.");
            this.outputText("\n\nShe has one birthing slit placed on the underside tip of her abdomen and with each contraction it spurts out a puddle of birthing lubricant allowing the eggs to slip out of her onto the floor.");
        }
        // go back to phylla menu.
        this.menu();
        this.addButton(0, "Next", this.introductionToPhyllaFollower);
    }

    // ►[Gems]
    // Success/Failure - Based on {Number of Children} + Random Chance of Failure + Cap of 'X' per day.
    // (Leads to - Success)
    // (Leads to - Failure)
    private phyllaDigsForGems(): void {
        this.clearOutput();
        let kidsMod: number = 0;
        if (this.flags[kFLAGS.ANT_KIDS] > 10) kidsMod++;
        if (this.flags[kFLAGS.ANT_KIDS] > 50) kidsMod++;
        if (this.flags[kFLAGS.ANT_KIDS] > 150) kidsMod++;
        if (this.flags[kFLAGS.ANT_KIDS] > 300) kidsMod++;
        if (this.flags[kFLAGS.ANT_KIDS] > 600) kidsMod++;
        if (this.flags[kFLAGS.ANT_KIDS] > 1000) kidsMod++;
        if (this.flags[kFLAGS.ANT_KIDS] > 2000) kidsMod++;
        // Success
        if (this.flags[kFLAGS.PHYLLA_GEMS_HUNTED_TODAY] == 0 && rand(20) + kidsMod > 10) {
            let gems: number = 0;
            gems = 10 + rand(10) + kidsMod * 2;
            this.player.gems += gems;
            this.statScreenRefresh();
            // If Phylla IS NOT Laying Eggs
            if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] == 0) {
                this.outputText("You ask Phylla is she's found any gems while digging out her colony.  She nods happily and runs over to a small stone chest and rifles though it.  After a moment, she runs back over to you and holds up all four of her hands.");
                this.outputText("\n\n\"<i>I hope... this is enough, I mean... they're rare, even down here.</i>\"  You mess up her hair with your hand, laughing. Telling her it's enough, you advise her to keep looking.  She gives you a playful salute as you place the gems into your pouch.");
                this.outputText("\n\nYou gain " + gems + " gems.");
                this.outputText("\n\n\"<i>Is there anything else you wanted to do while you're down here?</i>\"  She asks excitedly.");
            }
            // If Phylla IS Laying Eggs
            else {
                this.outputText("You ask Phylla if she or her children have found any gems while digging.  She nods happily and closes her eyes, tilting her head back slightly.  After a moment one your children scampers in. He runs overs to a small stone chest in the corner of Phylla's room and after a moment of rifling through it he finds what he's looking for.  Walking over to you, he presents his findings.  You accept the gems he's retrieved.");
                // if corruption under 50
                if (this.player.cor < 50) this.outputText("\n\nYou pat him on the head for a job well done as he walks deeper into the colony leaving you alone with Phylla.");
                // If corruption over 50
                else this.outputText("\n\nYou count the gems, and give both him and Phylla a look of disappointment.  Sighing heavily, you point decisively at the exit and your child hangs his head in shame as he heads back into the tunnels.  Phylla looks just as depressed and just stares at the ground, unable to really move due to her 'pregnancy.'");
                this.outputText("\n\n\"<i>Is there anything else you wanted to do while you're down here?</i>\"");
                this.outputText("\n\nYou gain " + gems + " gems.");
            }
        }
        // Failure
        else {
            this.outputText("You ask Phylla if she's found any more gems while digging.  \"<i>No, I'm sorry.  I haven't.  Not since the last time you asked.  I'll do better!  I mean, I know you like them.  They're rare... even down here.  I'll do better...</i>\"");
            // If corruption is less  than 50
            if (this.player.cor < 50) this.outputText("\n\nYou tell her it's all right and that you'll check back later.");
            else this.outputText("\n\nYou sigh, slightly disappointed, but give her a weak pat on the head anyway.");
            this.outputText("\n\n\"<i>Is there anything else you wanted to do while you're down here?</i>\"  She inquires excitedly.");
        }
        this.flags[kFLAGS.PHYLLA_GEMS_HUNTED_TODAY] = 1;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [Stones]
    private phyllaStones(): void {
        this.clearOutput();
        // Increase amount of stones based on number of kids.
        let kidsMod: number = 0;
        if (this.flags[kFLAGS.ANT_KIDS] > 10) kidsMod++;
        if (this.flags[kFLAGS.ANT_KIDS] > 50) kidsMod++;
        if (this.flags[kFLAGS.ANT_KIDS] > 150) kidsMod++;
        if (this.flags[kFLAGS.ANT_KIDS] > 300) kidsMod++;
        if (this.flags[kFLAGS.ANT_KIDS] > 600) kidsMod++;
        if (this.flags[kFLAGS.ANT_KIDS] > 1000) kidsMod++;
        if (this.flags[kFLAGS.ANT_KIDS] > 2000) kidsMod++;
        // Success
        if (this.flags[kFLAGS.PHYLLA_STONES_HUNTED_TODAY] == 0) {
            // Determine how much stones gained and increase that amount.
            const stones: number = 2 + rand(10) + (kidsMod * 2);
            this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] += stones;
            // Achievement progression.
            this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_ANTWORKS] += stones;
            if (this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_ANTWORKS] >= 200) this.awardAchievement("AntWorks", kACHIEVEMENTS.GENERAL_ANTWORKS);
            this.statScreenRefresh();
            // If Phylla IS NOT Laying Eggs
            if (this.flags[kFLAGS.PHYLLA_EGG_LAYING] == 0) {
                this.outputText("You ask Phylla is she's got any spare stones from digging, which you can take.  She nods happily and runs over to a small stone pile and rifles though it.  After a moment, she runs back over to you and holds up all four of her hands.");
                this.outputText("\n\n\"<i>I hope... this is enough, I mean... we almost always digging, so there will be more of them soon.</i>\"  You mess up her hair with your hand, laughing. Telling her it's enough, you advise her to keep some of them instead throwing outside.  She gives you a playful salute as you taking the stones from her hands.");
                this.outputText("\n\nYou gain " + stones + " stones.");
                this.outputText("\n\n\"<i>Is there anything else you wanted to do while you're down here?</i>\"  She asks excitedly.");
            }
            // If Phylla IS Laying Eggs
            else {
                this.outputText("You ask Phylla if she allows you to take few of the stones that her or her children have gathered while digging.  She nods happily and closes her eyes, tilting her head back slightly.  After a moment one your children scampers in. He runs overs to a stone pile in the corner of Phylla's room and after a moment of gathering walking over to you, he giving you few stones.  You accept them.");
                // if corruption under 50
                if (this.player.cor < 50 || stones >= 10) this.outputText("\n\nYou pat him on the head for a job well done as he walks deeper into the colony leaving you alone with Phylla.");
                // If corruption over 50
                else this.outputText("\n\nYou count the stones, and give both him and Phylla a look of disappointment.  Sighing heavily, you point decisively at the exit and your child hangs his head in shame as he heads back into the tunnels.  Phylla looks just as depressed and just stares at the ground, unable to really move due to her 'pregnancy.'");
                this.outputText("\n\n\"<i>Is there anything else you wanted to do while you're down here?</i>\"");
                this.outputText("\n\nYou gain " + stones + " stones.");
            }
            this.flags[kFLAGS.PHYLLA_STONES_HUNTED_TODAY] = 1;
        }
        // Failure
        else {
            this.outputText("You ask Phylla is she's got any spare stones from digging, which you can take.  She shakes sadly and says, \"<i>Sorry, that's all the stones you'll get for today. Come back tomorrow.</i>\"");
            this.outputText("\n\nYou nod and leave.");
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Drider/Bee impregnation scene for Phylla (universal unless otherwise specified, which will include varied intros and stuff.
    // Sex > [Egg Phylla]
    private eggDatBitch(): void {
        this.clearOutput();
        // PC is a Female/Herm Drider:
        if (this.player.canOvipositSpider()) {
            this.outputText(this.images.showImage("ant-camp-ant-mounted-by-drider"));
            this.outputText("While Phylla appears to be sexually sated, the heaviness in your spider abdomen begs for release.\n\n");
        }
        // First Time:
        if (this.flags[kFLAGS.TIMES_EGG_IMPREGNATING_PHYLLA] == 0) {
            this.outputText("Turning to Phylla, you tell her that you can help to make her wishes of being a brood-mother come true.  She looks at you a bit taken back, as if what you already did wasn't enough already.");
            this.outputText("\n\nYou go on to explain, telling her that your body is chalk full of eggs that eagerly await a willing host to gestate in.  If she wants to birth as many children as possible, your union can grant her wishes; albeit, she would be birthing both Ant and Spider children.");
        }
        // Subsequent Times:
        else this.outputText("You give Phylla a knowing look then glance back at your swollen spider abdomen.  Playfully you thrust your ovipositor at her.  Phylla giggles a little, knowing what you want to do to her.");

        // Persuade Phylla - Random chance of failing, affected by INT and whether she's already housing eggs in her vagina.
        // Persuasion failure
        if (rand(20) + 1 + this.player.inte / 20 < 10) {
            this.outputText("\n\nPhylla ponders for a moment and shakes her head.  \"<i>I'm sorry, [name], I'm not comfortable with that right now.</i>");
            // If player has already impregnated Phylla with drider eggs and fails the check:
            if (this.pregnancy.isPregnant) this.outputText("\n\n\"<i>I just can't hold anything else inside me.  I'm sorry!  Please don't be mad... I mean, I will!  Just a-after... this batch.</i>\"");
            // Else player has not impregnated:
            else this.outputText("\n\n\"<i>I mean... I just, don't feel comfortable with that right now. Maybe later, though.</i>\"");
            this.doNext(this.camp.returnToCampUseOneHour);
        }
        // Persuasion Success
        else {
            this.outputText("\n\nWith some hesitation and consideration, Phylla ponders the idea of being a brood-mother in more than one way for a bit.  With a shy smile, Phylla reluctantly agrees to house both of your children.");
            // First Time:
            if (this.flags[kFLAGS.TIMES_EGG_IMPREGNATING_PHYLLA] == 0) {
                this.outputText("\n\n\"<i>H-How will we do this?</i>\" She inquires. \"<i>I mean, I've never seen or heard of anything mating with a Drider before... M-my eggs come out of my abdo~</i>\"");
                this.outputText("\n\nYou raise a finger to her lips and tell her to lie down against the bed and to relax.  You know exactly where her eggs come out of.  The image of Phylla dropping eggs out of both her vagina and her abdomen makes you want this all the more.  Though the link you send this image to her, and feel her well up with maternal pride.  In uncertain anticipation, Phylla heeds your directions and lies down, her back on the bed with her abdomen curled in the air.");
            }
            // Subsequent Times:
            else {
                this.outputText("\n\nPhylla quickly gets into position, although at first she looks uncertain of if what's she done is correct.");
                // If PC corruption over 75:
                if (this.player.cor > 75) this.outputText("  Little does poor Phylla know, you're going to just use her as a baby maker to ease the tension of your own sacks.");
            }
            this.outputText("\n\nYou help pose her in the right position; angling her pussy towards you as you clamber along the bed.  Finally coming to rest on top of Phylla, you take her soft face in your hands and kiss her. You hold her body firmly under yours as you work your ovipositor against her vagina.");

            this.outputText("\n\nHer tongue probes your mouth seeking your tongue as Phylla compresses her arms around you. Knowing she's ready, you work your way into her and begin to release your lubricating fluids.  Phylla moans into your mouth as the secretions tickle her pleasure centers.  Through the link, you tell her to get ready; the ovipositor bottoming out deep in her womb, feeling the first of many eggs working their way down your perverted appendage.");
            this.outputText("\n\nShe squints and braces for the inevitable egg forcing its way into her.  She breaks your long kiss; gasping as the oval mass finally makes contact and works its way into her.  You can feel your unborn children's shell as it makes it way into Phylla, stretching her cunt out to accommodate future deposits.  As the frontrunner hits her cervix she manages a small moan of discomfort.");
            this.outputText("\n\n\"<i>UGH!  Its hurts... a little~ feels so strange... I-mea~ good!  Give me more!  Please!</i>\" She cries out, her maternal instincts kicking in as her desires to bear many young overtake her.  You comfort her while telling her that you have a few more on the way; something that causes Phylla's eyes to roll up in her head.  You feel the thoughts of being filled with so much new life that she will eventually birth to overwhelm her senses.");
            this.outputText("\n\nEgg after egg slides into Phylla, causing her to moan louder and louder with each egg. Her stomach quickly starts to bulge bigger and bigger with your brood as you stuff more into her.");

            // If PC corruption over 75:
            if (this.player.cor >= 75) this.outputText("\n\nYou can feel her ask you to stop though the link as her body starts to pull away from you, stating that she's nice and full and that any more could hurt her. Not yet! You know she can fit at LEAST three or four more! You KNOW she can hold them safely, she just needs to \"<i>man up</i>\". Using your numerous legs and arms you pin Phylla to the ground. Completely stopping her pulling away. Phylla screams in pleasure or pain, you can't really tell but you continue to deposit your eggs into her.");
            this.outputText("\n\nAt last, the final egg laid inside of Phylla, you retract your ovipositor from her love hole; it'll recover in time. Phylla rubs her belly and gleams with delight, filled with her lover's future children that will help the colony to grow strong.");
            // PC Drider eggs will take 8 days regardless of where she houses them to hatch. (3
            // through 8 children per pregnancy)
            if (!this.pregnancy.isPregnant) this.pregnancy.knockUpForce(PregnancyStore.PREGNANCY_DRIDER_EGGS, 8 * 24); // Supposed to be eight days, not eight hours
            this.flags[kFLAGS.TIMES_EGG_IMPREGNATING_PHYLLA]++;
            this.player.orgasm('Ovi');
            this.player.dumpEggs();
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }
}
