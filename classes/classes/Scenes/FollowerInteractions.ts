import { NPCAwareContent } from "./NPCs/NPCAwareContent";
import { kFLAGS } from "../GlobalFlags/kFLAGS";
import { PerkLib } from "../PerkLib";
import { StatusEffects } from "../StatusEffects";
import { ArmorLib } from "../Items/ArmorLib";
import { WeaponLib } from "../Items/WeaponLib";
import { rand } from "../Extra";
import { kGAMECLASS } from "../GlobalFlags/kGAMECLASS";

export class FollowerInteractions extends NPCAwareContent {

    // [Amily meets pure Jojo - ]
    public amilyMeetsPureJojo(): void {
        // set flag for amily met pure jojo
        this.flags[kFLAGS.AMILY_MET_PURE_JOJO]++;
        this.clearOutput();
        this.outputText("Amily appears to have located Jojo, and the two of them are actually hugging!  The smaller female mouse is crying, and Jojo looks a little misty-eyed as well.  They break apart as you approach; when out of the blue, Amily socks Jojo with a right hook!  He stumbles back, rubbing at his jaw as she yells, \"<i>That's for not coming back to the village and finding me!  Oh sure, you could fight demons in the forest for years, but Marae forbid you come back to look for survivors!</i>\"\n\n");

        this.outputText("Jojo colors, turning redder than you've ever seen him.  He tries to explain himself, \"<i>I'm sorry... there were so many, and I dared not return.  If they had caught me-</i>\" but stops and shudders with barely expressed fear.\n\n");

        this.outputText("Amily sighs and hugs him again, \"<i>You're a pansy. You know that Jojo?  But I'm glad " + this.player.short + " reunited us so that we could meet again.</i>\"\n\n");

        this.outputText("Jojo replies, \"<i>Me too,</i>\" before he notices you and coughs.  Amily pulls back and beams a brilliant, buck-toothed smile at you.  She rushes into your arms and gives you a kiss before she runs off.  Jojo looks a little embarrassed and scratches his ear as he centers himself.\n\n");
        this.dynStats("lus", 5);

        // [To jojo camp interaction]
        this.doNext(this.jojoScene.jojoCamp);
    }

    // [Amily and Pure Jojo spar – occurs when going to amily, requires 'amily meets jojo']
    public pureJojoAndAmilySpar(): void {
        this.clearOutput();
        this.flags[kFLAGS.AMILY_SPAR_WITH_PURE_JOJO]++;
        this.outputText("Amily and Jojo appear to be sparring.  Amily has a pair of knives in her hands, and Jojo has a staff.  The twin blurs of fur are whirling about in a frenzy of movement.  Jojo is deflecting most of the smaller mouse's strikes, and even manages to get in the occasional strike with his staff.  He's undone the top of his robe, and sweat is pouring off of his fur.  It's clear he's working himself harder than the female.  The match-up is remarkably even, but they spot you and wrap up the intense sparring session for now.  Jojo gives you a respectful nod and departs, guzzling water from a skin as he pulls his robes back into their normal places.\n\n");

        // [To amily screen]
        this.doNext(this.amilyScene.amilyFollowerEncounter);
    }

    // [Amily rages at what you've done to jojo (corrupted after she met pure jojo) – encountered when visiting corrupt jojo for faps]
    public amilyIsPissedAtYouForRuiningJojo(): void {
        this.clearOutput();
        this.flags[kFLAGS.AMILY_PISSED_PC_CORRUPED_JOJO]++;
        this.outputText("You call for your personal fuck-pet to come take care of your needs, but he doesn't answer.  You call again, and once more, the mouse does not appear.  Irritated, you get up and walk towards the woods.  At the edge you find Jojo.  He's unconscious and humping the ground, with a dart stuck in his ass.  You pluck the drugged dart from his furry cheek and examine it.  It's one of Amily's!\n\n");

        this.outputText("\"<i>What did you DO TO HIM!?</i>\" her voice shrieks.  She's behind you!  You pivot, praying the enraged mouse doesn't hit you with the same dart, and you see Amily half-hidden behind a rock.  Her blowgun is clutched in a trembling hand as she sobs with grief.  So she figured it out...\n\n");

        this.outputText("Amily screams, \"<i>Don't even try to lie!  I met him before you did this to him, and HE TOLD ME IT WAS YOU before he passed out!  We... we have to fix him.  I don't know why you would do something like this, but he- he's broken.  Utterly.  Please.  Find some pure honey and we can fix him!</i>\"\n\n");

        this.outputText("(You're at a crossroads. You can help Amily purify Jojo, but the mouse will likely never give you a chance to corrupt him again.  Alternatively, you could tell the bitch off and keep your favorite fuck-pet.)");

        // [Fix him] [Fuck off]
        this.menu();
        this.addButton(0, "Fix Him", this.agreeToHelpAmilyFixJojo);
        this.addButton(1, "Fuck Off", this.tellAmilyToFuckOffRuinedJojo);
    }

    // [Tell Amily to fuck off]
    private tellAmilyToFuckOffRuinedJojo(): void {
        this.jojoScene.jojoSprite();
        this.clearOutput();
        this.outputText("You chuckle, \"<i>He's a better fuck like this than you ever were.  Why don't you piss off and leave us alone?</i>\"\n\n");

        this.outputText("The sadness she exudes is palpable, but her eyes harden into ice as she replies, \"<i>Fine. I don't want anything to do with a demon anyway.</i>\"  She turns around and jogs off, glancing back over her shoulder with tears in her eyes before she disappears.\n\n");

        this.outputText("No doubt she ran back to the ruins.  Perhaps you could gather some appropriate drugs to teach her a lesson?");
        if (this.player.inte >= 45) this.outputText("  Goblin ale and lust drafts might do the trick.");

        // Follower off
        this.flags[kFLAGS.AMILY_FOLLOWER] = 0;
        this.flags[kFLAGS.AMILY_CORRUPT_FLIPOUT] = 1;
        this.flags[kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED] = 0;
        this.flags[kFLAGS.AMILY_VILLAGE_ACCESSIBLE] = 1;
        this.dynStats("cor", 10);
        this.doNext(this.playerMenu);
    }

    // [Fix Him]
    private agreeToHelpAmilyFixJojo(): void {
        this.jojoScene.jojoSprite();
        this.clearOutput();
        this.outputText("You nod, ");
        if (this.player.cor < 33) this.outputText("feeling genuinely sorry for what you've done.");
        else if (this.player.cor < 66) this.outputText("unsure if you're making the right choice.");
        else this.outputText("wondering if this will wind up as an empty promise to placate the angry mouse-cunt.");
        this.outputText("  You say, \"<i>All right, when I find some pure-honey I'll bring it to you so we can fix him, okay?  I don't know what came over me; the corruption of this place just... got to me.  Let's fix him together.</i>\"\n\n");

        this.outputText("She tearfully nods and promises, \"<i>Just don't expect anything from me until this is taken care of.</i>\"\n\n");

        // (-5 cor
        this.dynStats("cor", -5);
        // Amily won't sex.  Jojo sex still available)
        this.flags[kFLAGS.AMILY_WAIT_FOR_PC_FIX_JOJO] = 1;
        this.doNext(this.playerMenu);
    }

    // [Go to amily with pure honey in inventory]
    public fixJojoOOOOHYEEEEAHSNAPINTOASLIMJIM(): void {
        this.clearOutput();
        this.outputText("\"<i>You brought it!  Yes!</i>\" cheers Amily.  She reaches into your pouches and pulls out the bottle of pure honey and takes off for the woods.  You're forced to chase after her, and by the time you catch up, she's already hit Jojo with a knock-out dart.  The corrupted mouse is still hard and dripping with spunk, even while unconscious.  Amily moans, \"<i>You poor dear... here, drink up.  This will help make you better.</i>\"\n\n");
        // She noms your honey
        this.player.consumeItem(this.consumables.PURHONY);

        this.outputText("She only gives him a few sips before she turns back to you and says, \"<i>This is going to take me a few hours.  It would be best if you weren't here when he wakes up.  I doubt he'll want anything to do with you after this.  I'll give him directions to find our children.  I'm sure they'll be able to help him recover the rest of the way.</i>\"\n\n");

        this.outputText("You nod and leave, ");
        if (this.player.cor > 66) this.outputText("already regretting your choice");
        else if (this.player.cor > 33) this.outputText("a little confused by the whole situation");
        else this.outputText("glad the damage you did to Jojo wasn't permanent");
        this.outputText(".");
        // (Jojo leaves, never encountered again.)
        this.flags[kFLAGS.JOJO_DEAD_OR_GONE] = 1;
        // (-5 corruption)
        this.dynStats("cor", -5);
        // (Amily not encounterable for 4 hours)
        this.flags[kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO] = 4;
        // Amily fuckable again
        this.flags[kFLAGS.AMILY_WAIT_FOR_PC_FIX_JOJO] = 0;
        // Jojo 'fixed'
        this.flags[kFLAGS.JOJO_FIXED_STATUS] = 1;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [Find note from jojo @ followers menu after pufying him]
    public findJojosNote(): void {
        this.flags[kFLAGS.JOJO_FIXED_STATUS] = 2;
        this.clearOutput();
        this.outputText("There is a note left on your bedroll. You pick it up and unseal it – it's from Jojo!\n\n");
        this.outputText("\"<i>After the things that have transpired between us, I felt I ought to give this chapter of our lives some closure.   What you did to me was inexcusable.  It was a violation of everything that I am and was.  But, even though I wasn't able to help you tame your inner corruption, I'm glad that Amily was able to do so in my place.  And although I shall never again be able to return to my life as a chaste monk due to the changes you made to my body and libido, I take solace in the fact that Amily was able to repopulate our people.  Perhaps I'll even get married; its impossible to hide how 'large' I've gotten and the girls all seem to want to see what I've got under my robes.  In any event, good-bye 'Champion'.</i>\"");
        this.doNext(this.playerMenu);
    }

    // [Amily finds tentacle Jojo]
    public amilyDiscoversJojoWithTentaclesAndShitOhBoy(): void {
        this.clearOutput();
        this.flags[kFLAGS.AMILY_DISCOVERED_TENTATLE_JOJO]++;
        this.outputText("You settle down for a nice fuck with your tentacle-mousey, but your pet doesn't answer your calls.  Snarling in irritation, you set off towards the woods to find your corrupted fuck-toy.  It does not take long.  Jojo's body is face-down in the dirt, unconscious.  You can see his hips pumping weakly as his cum-oozing tentacles fuck each other.  There's a dart in his neck, and with great trepidation, you pluck the needle-tipped weapon from the horror-rodent.  It's one of Amily's!\n\n");

        this.outputText("\"<i>What did you DO TO HIM!?</i>\" her voice shrieks.  She's behind you!  You pivot, praying the enraged mouse doesn't hit you with the same dart, and you see Amily half-hidden behind a rock.  Her blowgun is clutched in a trembling hand as she sobs with grief.  So she figured it out...\n\n");

        this.outputText("Amily screams, \"<i>Don't even try to lie!  I met him before you did this to him, and HE TOLD ME IT WAS YOU before he passed out!  You're a monster!  How could you pretend to help me with my quest while you were warping one of my kind behind my back!?  Were you going to do the same to me?  'Just wait until Amily lets her guard down, then turn her and all her children into tentacle-tipped pussies for you to fuck.'  FUCK YOU!</i>\"\n\n");

        // Corrupt: Go to 'flip bird')
        if (!this.player.isPureEnough(66)) {
            this.outputText("You flip her the bird.  She was a shitty fuck anyways.  Amily's eyes flood with tears, but her expression hardens with rage.  The mouse yells, \"<i>Like I'd want to stay with a demon like you anyway!</i>\"  She turns and jogs off into the distance.  Amily stops just before you lose sight of her and looks over her shoulder with tears in her eyes.  You've utterly crushed her heart.  She starts jogging again and disappears from your life forever.  Meanwhile, Jojo begins to stir.  It appears he'll be ready to serve soon...\n\n");
            // (No amily, back to camp)
            // Follower off
            this.flags[kFLAGS.AMILY_FOLLOWER] = 0;
            this.outputText("No doubt she ran back to the ruins.  Perhaps you could gather some appropriate drugs to teach her a lesson?");
            if (this.player.inte >= 45) this.outputText("  Goblin ale and lust drafts might do the trick.");

            // Follower off
            this.flags[kFLAGS.AMILY_FOLLOWER] = 0;
            this.flags[kFLAGS.AMILY_CORRUPT_FLIPOUT] = 1;
            this.flags[kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED] = 0;
            this.flags[kFLAGS.AMILY_VILLAGE_ACCESSIBLE] = 1;
            // +5 corruption)
            this.dynStats("cor", 5);
            this.doNext(this.playerMenu);
        }
        // Else:
        else {
            this.outputText("This is bad.  You could try to explain that what happened to Jojo was a moment of weakness before you overcame your corruption, but judging from the look in her eyes, she would KILL JOJO rather than let him continue to live in such a pathetic state.  Or, you could stand by your choice to corrupt Jojo, but you'd have to get Amily to leave so she couldn't harm Jojo.  Flipping her the bird might do the trick.");
            // [Corrupt/Choose Jojo]
            this.menu();
            this.addButton(0, "Explain", this.aerisDies);
            this.addButton(1, "Flip Bird", this.AmilyLeavesBirdJojoTentacles);
        }
    }

    private AmilyLeavesBirdJojoTentacles(): void {
        this.clearOutput();
        this.outputText("You flip her the bird.  She was a shitty fuck anyways.  Amily's eyes flood with tears, but her expression hardens with rage.  The mouse yells, \"<i>Like I'd want to stay with a demon like you anyway!</i>\"  She turns and jogs off into the distance.  Amily stops just before you lose sight of her and looks over her shoulder with tears in her eyes.  You've utterly crushed her heart.  She starts jogging again and disappears from your life forever.  Meanwhile, Jojo begins to stir.  It appears he'll be ready to serve soon...\n\n");

        this.outputText("No doubt she ran back to the ruins.  Perhaps you could gather some appropriate drugs to teach her a lesson?");
        if (this.player.inte >= 45) this.outputText("  Goblin ale and lust drafts might do the trick.");
        // Follower off
        this.flags[kFLAGS.AMILY_FOLLOWER] = 0;
        this.flags[kFLAGS.AMILY_CORRUPT_FLIPOUT] = 1;
        this.flags[kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED] = 0;
        this.flags[kFLAGS.AMILY_VILLAGE_ACCESSIBLE] = 1;
        // +5 corruption)
        this.dynStats("cor", 5);
        this.doNext(this.playerMenu);
    }

    // (Uncorrupt)
    // [Choose Amily – Aeris (I mean Jojo) Dies]
    private aerisDies(): void {
        this.clearOutput();
        this.outputText("Amily listens impassively at first, but as you explain the situation, she comes around to understand you a little better.  She walks to your side and gives you a kiss on the cheek and explains, \"<i>There's no way to fix him.  What's been done can't be undone by any magic or item.  I have to put him out of misery and stop him from corrupting anything else.</i>\"\n\n");

        this.outputText("(Amily is going to kill Jojo.  What do you do?)");

        // [Stop Her] [Let Her]
        this.menu();
        this.addButton(0, "Stop Her!", this.stopJojoDeathInTheNameOfLove);
        this.addButton(1, "Let Her", this.whyWouldDoThis);
    }

    // [STOP – in the name of love]
    private stopJojoDeathInTheNameOfLove(): void {
        this.jojoScene.jojoSprite();
        this.clearOutput();
        this.outputText("You grab her by the shoulders and say, \"");
        if (this.player.inte < 40) {
            // (NOT SMART)
            this.outputText("Stop, think about this.  We can't do this, can we?</i>\"   She answers, \"<i>We do what we must,</i>\" and pulls her dagger.  You can't watch the grisly deed and avert your eyes.  She slits the once-pious monk's throat and it's done.  The two of you build a cairn of rocks over the mouse's body, as fitting a burial as you're able to provide for him.");
            // (-80 lust)
            this.dynStats("lus", -99);
            // (You suck and Jojo died.)
            this.flags[kFLAGS.JOJO_DEAD_OR_GONE] = 2;
        }

        // (SMART)
        else {
            this.outputText("Amily, this is wrong.  He may be corrupted, but we don't need to kill helpless innocents, no matter how horny they may be.  Yes he's corrupted beyond redemption, but his body and mind aren't geared towards spreading that corruption.  The mouse isn't a threat to anyone.</i>\"\n\n");

            this.outputText("She slowly nods and pulls her hand away from her dagger.  Amily answers, \"<i>You're right, as usual.  I'll leave him be, but if you ever do something like this again, I'm gone.</i>\"\n\n");
            // (+1 int)
            this.dynStats("int", 1);
            // (YAY SAVED JOJO), and amily didn't leave.
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    // [Let Her Kill Jojo]
    private whyWouldDoThis(): void {
        this.jojoScene.jojoSprite();
        this.clearOutput();
        this.outputText("You can't watch the grisly deed and avert your eyes.  She slits the once-pious monk's throat and it's done.  The two of you build a cairn of rocks over the mouse's body, as fitting a burial as you're able to provide for him.");

        // (-99 lust)
        this.dynStats("lus", -99);
        // (You suck and Jojo died.)
        this.flags[kFLAGS.JOJO_DEAD_OR_GONE] = 2;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [Amily introduces herself to Rathazul – happens at Rathazul]
    public AmilyIntroducesSelfToRathazul(): void {
        this.clearOutput();
        this.flags[kFLAGS.AMILY_MET_RATHAZUL]++;
        this.outputText("Amily is here with the elderly rodent alchemist and carrying on a rather deep conversation.  They have not noticed you yet, and the two are currently discussing the medicinal properties of the various herbs and materials in Mareth.  Amily pays rapt attention as the old rat concludes his lecture on the effects of imp grass.  She thanks him, \"<i>I really appreciate this, Rathazul.  I know our tribes never saw eye to eye, but you've done a lot.  My father was an alchemist like you, and I know he'd be happy to know someone like you was continuing to teach me the craft.</i>\"\n\n");

        this.outputText("The wise rat strokes his frazzled whiskers as he listens, clearly pleased with the younger rodent's words.  \"<i>The pleasure is mine.  It's not often I find such a rapt and attentive listener,</i>\" he replies.\n\n");

        this.outputText("Amily gives him a friendly hug and turns to leave.  She squeaks in surprise when she sees you and stamps over to demand, \"<i>How long have you been there?</i>\"\n\n");

        this.outputText("You stutter for a second until she kisses you on the lips and laughs, \"<i>It's ok, we were just wrapping up the lesson.  Go on, I'm sure you have something important to see to with Rathazul!</i>\"\n\n");

        this.outputText("Amily takes off, leaving you alone with the alchemist.");

        // (+5 lust!)/
        this.dynStats("lus", 5);
        this.doNext(kGAMECLASS.rathazul.returnToRathazulMenu);
    }
    // [Amily delivers ingredients to Rathazul – happens at Rathazul]
    public amilyIngredientDelivery(): void {
        this.clearOutput();
        this.outputText("As you make your way to Rathazul's lab, a ");

        if (this.flags[kFLAGS.AMILY_NOT_FURRY] == 1) this.outputText("big-eared blur whizzes past you");
        else this.outputText("blur of fur whizzes past you");

        this.outputText(".  Amily sprints into the rat's lab with an armful of flowers, plants, and other ingredients.  Rathazul says, \"<i>Thank you, child - these will be a huge help.  It is fortunate you knew where to find some of these.  Purchasing them is difficult and expensive.</i>\"\n\n");
        this.outputText("Amily bobs her head happily as Rathazul reaches into his robes and says, \"<i>Here is the payment, as promised,</i>\" and hands her an old alchemical text.  She squeals happily and runs past you, her tail curling about your waist for the briefest moment before she's gone.\n\n");
        // [To rathazul, +4 lust]
        this.dynStats("lus", 4);
        // [Prices reduced for reducto!
        this.flags[kFLAGS.AMILY_MET_RATHAZUL]++;
        this.doNext(kGAMECLASS.rathazul.returnToRathazulMenu);
    }

    // [Amily ask Rathazul what happened to his village]
    public amilyAsksAboutRathazulsVillage(): void {
        this.clearOutput();
        this.flags[kFLAGS.AMILY_MET_RATHAZUL]++;
        this.outputText("Amily is once again at Rathazul's lab.  She just finished asking him what happened to his village.  Rathazul's expression clouds with anger as he thinks on it.  His response is slow and measured as he explains, \"<i>We were sold out.  Our elders knew we couldn't triumph by strength of arms, and rather than join the others they sold us out in exchange for the safety of the council.  The demons gave the elders corrupted agents to lace into the village's well, and my people fell prey to the demons in a single night.  The elders were rewarded and 'raised' to full demon-hood.  I survived because I was at the lake at the time.  The sounds of the orgy were all the warning I needed to keep hidden.  I can't help but think that things would have been different if less selfish rats had been in charge.</i>\"\n\n");

        this.outputText("Rathazul sighs and shuffles around uncomfortably as he wraps it up, \"<i>'What-ifs' will get us nowhere.  Our villages are gone, and we must look to the future, child.</i>\"\n\n");

        this.outputText("Amily nods solemnly and says her farewells.  She looks a little bleary-eyed as you pass her, and you give her a comforting squeeze on the shoulder.   The mouse gives you a tight smile and continues away, leaving you alone with the rat.");
        this.doNext(kGAMECLASS.rathazul.returnToRathazulMenu);
    }

    // [Rathazul and Corrupt/Tentacle Jojo] – Occurs instead of camp
    public rathazulFreaksOverJojo(): void {
        this.clearOutput();
        this.flags[kFLAGS.RATHAZUL_CORRUPT_JOJO_FREAKOUT]++;
        this.outputText("Rathazul comes up to you with a serious, worried expression.  You ask him what's wrong, and he explains, \"<i>There is a creature in the woods.  I've seen glimpses of it numerous times, and I believe it to be some kind of demon-tainted mouse.  We must deal with it, lest it strike while we are unawares!</i>\"\n\n");

        this.outputText("You work hard to keep a straight face.  The 'creature' is clearly your fuck-pet, Jojo.  What do you tell the old mouse?  ");

        this.outputText("(He is mine, I can handle it, or he's harmless?)");
        // [Jojo is yours] [I can handle it] [It's harmless]
        this.menu();
        this.addButton(0, "Mine", this.tellRathazulYouOwnJojo);
        this.addButton(1, "Handle It", this.tellRathazulYouCanHandleIt);
        this.addButton(2, "Harmless", this.TellRathazulJojoIsHarmless);
    }
    // 	[Jojo is yours]
    private tellRathazulYouOwnJojo(): void {
        this.jojoScene.jojoSprite();
        this.clearOutput();
        this.outputText("You tell Rathazul, \"<i>Oh that's just Jojo.  He's been corrupted, but he isn't evil and he hangs around because he knows I like to sleep with him.</i>\"\n\n");

        this.outputText("Rathazul scratches his head in confusion and stutters, \"<i>You, uh, f-fuck the creature?  Well, umm... okay.  I guess I don't have to worry about it then...</i>\"\n\n");

        this.outputText("He blushes red and lurches back towards his laboratory, muttering under his breath about crazy kids.");
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    // [I can handle it]
    private tellRathazulYouCanHandleIt(): void {
        this.jojoScene.jojoSprite();
        this.clearOutput();
        this.outputText("You tell Rathazul, \"<i>Don't worry about it.  I've been all over the woods and fought that mouse before.  He's a pushover, and if he tries to sneak up on either of us I'll take care of it.</i>\"\n\n");

        this.outputText("Rathazul looks you over and asks, \"<i>Why didn't you kill it?  With all the corruption in this world, we would be better off nipping these things in the bud.</i>\"\n\n");

        this.outputText("You answer, \"<i>Do I look like a demon to you?  I don't kill my enemies if I can help it.  Trust me, we're safe.</i>\"\n\n");

        this.outputText("The rat seems satisfied by your response and nods respectfully.  He lurches back towards his laboratory, wringing his clawed hands with worry.");
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    // [Its harmless]
    private TellRathazulJojoIsHarmless(): void {
        this.jojoScene.jojoSprite();
        this.clearOutput();
        this.outputText("You explain to Rathazul, \"<i>That's just Jojo.  He got pretty fucked up and is hoping I'll let him fuck me.  The little mouse is a push-over, and nothing to worry about.</i>\"\n\n");

        this.outputText("Rathazul looks a little incredulous at the declaration and he asks, \"<i>Can we do something about him?  He's very creepy.</i>\"\n\n");

        this.outputText("You snort disdainfully and answer, \"<i>It's fine.  He's not interested in you – it's me he wants, and he won't be getting any of me unless I decide to let him.</i>\"\n\n");

        this.outputText("With the conversation concluded, Rathazul wanders off, murmuring, \"<i>Oh my, no...</i>\"");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [Rathazul and non-corrupt Jojo]
    public jojoOffersRathazulMeditation(): void {
        this.clearOutput();
        this.flags[kFLAGS.JOJO_RATHAZUL_INTERACTION_COUNTER]++;
        this.outputText("Jojo is at Rathazul's lab.  The smaller, white mouse is asking the elderly rodent if he would like to meditate.  Rathazul considers for a moment and agrees, \"<i>I'll have to try it when I have some time.  A little reflection would do my old soul some good.  However we cannot now; " + this.player.short + " has need of me.</i>\"\n\n");

        this.outputText("Jojo turns to you, gives a quick bow, and departs.");
        // [To rathazul]
        this.doNext(kGAMECLASS.rathazul.returnToRathazulMenu);
    }
    // [Rathazul Napping]
    public catchRathazulNapping(): void {
        this.clearOutput();
        // (Occurs when visiting Jojo)
        this.flags[kFLAGS.JOJO_RATHAZUL_INTERACTION_COUNTER]++;
        this.outputText("Rathazul and Jojo look to be engaged in some intensive meditation, so you hang back.  The two rodents are sitting cross-legged on a pair of flat rocks with their eyes closed and reflecting on something.  The air is eerily silent until a loud snore escapes from the rat's muzzle.  He's fallen asleep!  Jojo cracks one eye and sighs, \"<i>The old ones always fall asleep.</i>\"\n\n");

        this.outputText("The mouse quietly rises and walks a fair distance away from the sleeping rat, letting his elder rest.  He motions for you to follow and leave Rathazul in peace.");
        // [NEXT – to normal jojo]
        this.doNext(this.jojoScene.jojoCamp);
    }

    public marbleVsAmilyFreakout(): void {
        kGAMECLASS.amilyScene.amilySprite();
        this.clearOutput();
        this.flags[kFLAGS.AMILY_NOT_FREAKED_OUT]++;
        // Marble is in camp first
        if (this.flags[kFLAGS.MARBLE_OR_AMILY_FIRST_FOR_FREAKOUT] <= 1) this.outputText("As you bring Amily into your camp, you see Marble look towards you with a smile for a moment, before that smile turns into a frown.  You realize that this might not have been such a good idea...\n\n");
        //// Amily is in camp first
        else this.outputText("As you bring Marble back to your camp, you see Amily sitting there as Marble asks while frowning, \"<i>Sweetie, who is that?</i>\"  Uh-oh, this could get bad.\n\n");

        // After either
        this.outputText("Within moments, Marble has walked up to Amily and, with a forced smile on her face, asks, \"<i>May I ask who you are?</i>\"\n\nWithout realizing what is happening yet, Amily cheerfully responds. \"<i>I'm Amily, " + this.player.short + "'s lover.  Who're you?</i>\" She extends her hand towards Marble.  At this moment you hear something like a low growl coming from Marble as she turns to face you, absolutely livid.  \"<i>YOU!  Why didn't you tell me about this girl?!  I trusted you!</i>\"\n\nHow do you respond?");

        // Player choices how they want to respond.
        // Stay silent (A1), pimp (B1), or explain (C1).
        this.menu();
        this.addButton(0, "StaySilent", this.marbleIsPissyAndYourTooDumbToTalk);
        this.addButton(1, "Pimp", this.beAPimpMarbleLovesIt);
        this.addButton(2, "Explain", this.LucyYouGotSomeSplainingToDo);
    }

    // Stay silent like a douche
    private marbleIsPissyAndYourTooDumbToTalk(): void {
        this.clearOutput();
        // Stay silent (A1)
        this.outputText("You can't think of anything to say to her at this point, and can do nothing but stare.  Marble then turns to Amily and yells, \"<i>I'm " + this.player.mf("his", "her") + " lover too.  " + this.player.mf("He", "She") + " didn't tell you about me, did " + this.player.mf("he", "she") + "?</i>\"  Amily looks at Marble for a few moments before looking back at you with tears in her eyes.  She says, \"<i>I know what kind of world this is, but I'd think you'd at least tell me about someone like her.  Did our kids together mean nothing to you?</i>\"  At this point, Marble's hammer flies to the ready in her hands.  She practically screams, \"<i>YOU HAD KIDS TOGETHER?!?!</i>\" her hammer flying to the ready in her hands.\n\n");

        // If PC was addicted (A2), if PC had kids with Marble and is not addicted (A3), otherwise (A4)
        if (this.player.findPerk(PerkLib.MarblesMilk) >= 0) {
            // Silent -> PC is addicted (A2)
            // outputText("Marble moves in front of you and faces towards Amily.  \"<i>This " + player.mf("man","woman") + " is mine!  " + player.mf("He","She") + " needs me to survive, and I will do anything to protect them.</i>\" Marble declares before saying in a dangerous low voice towards Amily \"<i>Leave now, or I will kill you.</i>\" Amily tries to look at you through her tear filled eyes for a moment, but Marble softly says to you \"<i>" + player.short + ", put your arms around me.</i>\"  It wasn't a request, and without hesitation you put your arms around her.  Amily gives one last horrified look at you before grabbing her things and running away from the camp.  You doubt that you'll see her again.\n\n");
            this.outputText("Marble moves protectively in front of you and turns to Amily.  \"<i>This " + this.player.race + " is mine!  " + this.player.mf("He", "She") + " needs me to survive, and I will do anything to protect " + this.player.mf("him", "her") + ",</i>\"  Marble declares.  Then, in a dangerously gentle voice, says, \"<i>Leave now, or I will kill you.</i>\"  Amily tries to look at you through her tear-filled eyes, but Marble softly whispers,  \"<i>" + this.player.short + ", put your arms around me.</i>\"  Though soft, her words had nothing in them to suggest a request rather than a command.  You hesitate for a  moment, but, remembering that an angry Marble is a Marble that could revoke milk privileges, you decide that making her mad is something you just can't afford.  You take a deep breath and wrap your arms around Marble.  Amily gives one last anguished look at you before she turns to pack her things.  As she scurries away from the site of her former bed, you doubt that you'll see her again.\n\n");
            // end event, Amily leave the camp for good
            this.flags[kFLAGS.AMILY_FOLLOWER] = 0;
            this.flags[kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED] = 1;
        }
        else if (this.flags[kFLAGS.MARBLE_KIDS] > 0) {
            // Silent -> PC has had kid(s) with Marble and is not addicted (A3)
            this.outputText("Marble suddenly bursts into tears herself and, between sobs, yells \"<i>Why " + this.player.short + "?  Did none of our kids mean anything to you?</i>\"  In frustration she slams her hammer against the ground, causing a tremor that almost knocks you and Amily onto your asses.  However, at this point the two of them have broken down and collapsed on their knees sobbing.  You have no idea what you can say at this point, or what you should do.  After a few minutes pass, the two of them each give you a sad look in turn before collecting their things (and in Marble's case, her kids) and leaving the camp.  You doubt that you'll ever see either of them again.");
            // end event, Amily and Marble leave the camp for good
            this.player.removeStatusEffect(StatusEffects.CampMarble);
            this.flags[kFLAGS.AMILY_FOLLOWER] = 0;
            this.flags[kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED] = 1;
        }
        // Silent -> Otherwise (A4)
        else {
            this.outputText("Turning to face you with her hammer raised, Marble says to you \"<i>So I guess that I'm nothing but a fuck to you then, hun?!  After all I sacrificed to help you get over your addiction, just so that you could be with someone else?!</i>\"  She swings her hammer at you and you barely dodge it in time and look back at the angry cowgirl.  \"<i>" + this.player.short + "!</i>\" Amily calls out to you while rushing to your side and wiping her tears.  \"<i>Fine!</i>\"  Marble yells at the two of you. \"<i>You two can be together and have as many kids with each other as you want!  I'm leaving " + this.player.short + ", don't come looking for me.</i>\" she declares before collecting her things and leaving the camp.  You doubt you'll see her again.");
            // end event, Marble leaves the camp for good
            this.player.removeStatusEffect(StatusEffects.CampMarble);
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    private beAPimpMarbleLovesIt(): void {
        this.clearOutput();
        // Pimp (B1)
        this.outputText("You look at both of them in the eyes in turn before replying, \"<i>Come on girls, there is plenty of me to go around!</i>\"  ");
        // Can go to B2 if the PC is addicted to Marble, otherwise B3

        // Pimp -> PC is addicted (B2)
        if (this.player.findPerk(PerkLib.MarblesMilk) >= 0) {
            this.outputText("Marble blinks before saying \"<i>" + this.player.short + ", try again, I know you're better than that.</i>\"  You blink in response and wonder yourself what possessed you to say that.\n\n");
            // Player chooses stay silent (A1) or explain (C1)
            this.menu();
            this.addButton(0, "StaySilent", this.marbleIsPissyAndYourTooDumbToTalk);
            this.addButton(1, "Explain", this.LucyYouGotSomeSplainingToDo);
        }
        // Pimp -> PC is not addicted (B3)
        else {
            this.outputText("The two of them simply stare at you for several minutes in disbelief at your statement, it doesn't seem like either expected you to say that.  Finally Amily sputters, \"<i>I... what, how?   This isn't like how you acted when we were back in my village.</i>\"  You give her a winning smile and say, \"<i>Hey baby, I meant every word of it, and just look at me!  I can handle two girls like you, easy.</i>\"  Marble gives you the strangest of looks before saying, \"<i>Apparently you have a death wish,</i>\" before her hammer comes to the ready.  Amily does the same with her blowpipe.\n\nThe mouse begs, \"<i>" + this.player.short + ", please tell me you were making a bad joke.</i>\"\n\n");
            // Player chooses serious (B4), just joking (B5)
            this.menu();
            this.addButton(0, "Serious", this.srslyPimpinGuyz);
            this.addButton(1, "Joking", this.jokeAboutPimpularness);
        }
    }
    // Pimp -> PC is not addicted -> serious (B4)
    private srslyPimpinGuyz(): void {
        this.clearOutput();
        this.outputText("\"<i>Yes I'm serious.  What, you don't think I can take both of you?</i>\" you say while putting your hands on your hips and swinging them around.  The two of them almost scream as one before descending upon you.  In an instant you're hit with a dart from Amily, causing your body to lock up, just before Marble brings her hammer down onto your head in a massive overhead swing and everything goes black.\n\n");
        this.player.takeDamage(this.player.HP - 1);
        this.outputText("You wake up several hours later to find that neither of the two girls are still around, your camp is in shambles, and most of your equipment is gone.  After looking around camp, you realize that all of your expendable items, gems, and even your weapons and armor have been taken.  ");
        if (this.player.armorName != "goo armor") this.outputText("All that is left is a suit of comfortable clothes that you put on.  ");
        else this.outputText("\"<i>Are you all right?</i>\" the armor-goo asks.  You insist her that you have a terrible headache.  ");
        this.outputText("You also find a note in a rough script that says: <i>This is what you get for being an asshole.</i>  Those damn bitches.");
        this.player.gems *= 0;
        this.player.itemSlot(0).quantity = 0;
        this.player.itemSlot(1).quantity = 0;
        this.player.itemSlot(2).quantity = 0;
        this.player.itemSlot(3).quantity = 0;
        this.player.itemSlot(4).quantity = 0;
        this.player.setArmor(ArmorLib.NOTHING); // Old armor disappears unless it's Valeria
        this.player.setWeapon(WeaponLib.FISTS);
        // 	player.armor = armors.C_CLOTH;
        // 	player.weapon.unequip(player,false,true);
        this.player.removeStatusEffect(StatusEffects.CampMarble);
        this.outputText("\n\nNo doubt Amily ran back to the ruins.  Perhaps you could gather some appropriate drugs to teach her a lesson?");
        if (this.player.inte >= 45) this.outputText("  Goblin ale and lust drafts might do the trick.");
        // Follower off
        this.flags[kFLAGS.AMILY_FOLLOWER] = 0;
        this.flags[kFLAGS.AMILY_CORRUPT_FLIPOUT] = 1;
        this.flags[kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED] = 0;
        this.flags[kFLAGS.AMILY_VILLAGE_ACCESSIBLE] = 1;
        this.doNext(this.camp.returnToCampUseEightHours);
    }
    // Pimp -> PC is not addicted -> just joking (B5)
    private jokeAboutPimpularness(): void {
        this.clearOutput();
        this.outputText("You assure them that you thought a joke might help them calm down.  The two of them seem to disagree with you on that sentiment, but wait for you to say something else.");
        // Player chooses stay silent (A1) or explain (C1)
        this.menu();
        this.addButton(0, "StaySilent", this.marbleIsPissyAndYourTooDumbToTalk);
        this.addButton(1, "Explain", this.LucyYouGotSomeSplainingToDo);
    }

    private LucyYouGotSomeSplainingToDo(): void {
        this.clearOutput();
        // Explain (C1)
        this.outputText("You spend some time trying to explain to the two of them why you never told either of them about each other.  ");
        // int check, pass (C2), fail (C3)
        if (this.player.inte > 50) {
            // Explain -> pass (C2)
            this.outputText("Right away, you realize that this situation isn't really something that you can talk your way out of.  You start to tell the two of them why you like them and why you were with them.  You tell Marble about Amily's desire to repopulate her people, and you tell Amily about Marble's desire to find someone and the difficulties that her species brings with it.  At the end of your talk, the two of them are just looking at each other.  After a few moments Amily says, \"<i>So, you're corrupt huh?  I guess you seem nice enough...</i>\"  Marble responds, \"<i>You're really cute yourself, little mousy, and you definitely needed someone for a good reason.  The real problem is that " + this.player.short + " didn't get the two of us to talk to each other before now.</i>\"  The two of them then turn back to you with dirty looks in their eyes.  It looks like things aren't going to be all that nice for you for a while, but at least they don't seem to hate each other.");
            // end event, set lust or other sex values to minimum to make it so that Marble and Amily "punish" the player a little for awhile.
            this.flags[kFLAGS.MARBLE_LUST] = -100;
            this.doNext(this.camp.returnToCampUseOneHour);
            return;
        }
        // Explain -> fail (C3)
        else {
            this.outputText("After a while it becomes apparent to both yourself and the others that you have no idea what you're talking about.  Marble then says to you, \"<i>Well, do you have anything else to say?</i>\" At this point it probably isn't possible to say something to make both of them happy, will you stay silent or turn on one of them to try and keep the other?\n\n");
            // Player chooses stay silent (A1), blame Marble (C4), blame Amily (C5)
            this.menu();
            this.addButton(0, "StaySilent", this.marbleIsPissyAndYourTooDumbToTalk);
            if (this.player.findPerk(PerkLib.MarblesMilk) >= 0) {
                this.addDisabledButton(1, "BlameMarble", "Since you need Marble's milk to live, there's no way you can blame her.  It would be tantamount to suicide.");
            } else {
                this.addButton(1, "BlameMarble", this.BlameMarblezSweetVagoozle);
            }
            this.addButton(2, "BlameAmily", this.blameAmilysDumbMouseCunt);
            return;
        }
    }
    // Explain -> blame Marble
    public BlameMarblezSweetVagoozle(): void {
        this.clearOutput();
        this.outputText("You turn to Marble and point blankly tell her that it's her fault that you weren't faithful to Amily.  You start to rant about how Marble's milk has affected you, and how you lost your willpower to the addiction.  You go on about how she uses it to get what she wants, and how she didn't warn you about what would happen if you drank it.  At this Amily runs to your side and looks into your eyes for a moment before turning back to Marble and saying, \"<i>Is this the truth?</i>\"  Marble looks at you for a moment like she is going to explode before saying, \"<i>Is that really what you think of me?  How could you lie to me like this up until now?!</i>\" she then turns around and almost mechanically gathers her things ");
        if (this.flags[kFLAGS.MARBLE_KIDS] == 1) this.outputText("and child");
        else if (this.flags[kFLAGS.MARBLE_KIDS] > 1) this.outputText("and her children");
        this.outputText(" before slowly walking away from the camp without looking back.  \"<i>I'm going back to the farm, I guess I'll see you around.</i>\"\n\n");
        // end event, Marble leaves the camp and returns to the farm, she can now be encountered if she had not joined you in the camp.
        this.player.removeStatusEffect(StatusEffects.CampMarble);
        // Marble goes back to farm
        this.player.removeStatusEffect(StatusEffects.NoMoreMarble);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Explain -> blame Amily
    private blameAmilysDumbMouseCunt(): void {
        // ----Quiet Browser should write this part----
        this.clearOutput();
        this.outputText("You turn to Amily and tell her point blank that she's the one who is in the wrong here. She claimed to be a pure individual, free of all corruption in this world and begging you for your help, but instead she tricked you, seduced you into being unfaithful to your lover, Marble, and making you into her breeding stud and pleasure toy - and then she had the audacity to try and claim you and her had some connection, when it was nothing but trickery and lies on her part. At this tirade, Amily looks first hurt, then outraged, then livid; it's only when Marble silently and defiantly positions herself beside you, holding her hammer and ready to charge, that the female mouse-morph removes her hand from the handle of her knife. Blinking back tears, she starts scurrying around the camp as fast as she can, gathering up all of her few belongings and then heading for the edge of the camp as fast as she can. She halts at the edge, turning to face the two of you, and starts screaming a tirade of the most profane obscenities she can muster, blistering your ears with imprecations about your sexual tastes, habits and skills, your lineage, your personal hygiene and your talents before vanishing into the undergrowth whilst you're both stunned by the litany of swearing and trying to wrap your mind around some of the things she said. Particularly the one about the greasy maggots, the centaur stallion, the candied apple and the plunger. It's pretty obvious she's never coming back.");
        // end event, Amily leaves the camp permanently
        this.flags[kFLAGS.AMILY_FOLLOWER] = 0;
        this.flags[kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED] = 1;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Amily/Urta Interaction
    // Must have Pure Amily as follower
    // flags[kFLAGS.AMILY_FOLLOWER] == 1
    // Must have "UrtaSexed" flagged

    // Must have Lover Urta?
    // urtaLove()

    // AMILY_VISITING_URTA = 346;
    public amilyUrtaReaction(): void {
        this.clearOutput();
        this.outputText("As you finish making your way back to camp, Amily surprises you from behind a rock, her arms folded across her chest.  \"<i>Hey, remember when you told me about that city in the desert?  I decided to check it out.</i>\"  You don't remember, but you're too busy absorbing the implications to respond.  \"<i>You'll never guess what I heard!  It seems someone just like you has been seen in the company of one of their prominent citizens,</i>\" she continues.  \"<i>I can't say I didn't expect something like this might happen.  I mean... she's not some demon, right?  Still... I thought we had something special, " + this.player.short + ".</i>\"  As you try to formulate a reply, she seizes her tail and twists it pensively in her hands, already deciding her next move.  \"<i>I-I've got to meet her... to know what you see in her.</i>\"\n\n");

        this.outputText("Amily bounds out of camp before you can react, sniffling as she disappears into the distance. She's lost to sight almost immediately thanks to the properties of this accursed landscape.");
        this.flags[kFLAGS.AMILY_VISITING_URTA] = 1;
        this.flags[kFLAGS.AMILY_NEED_TO_FREAK_ABOUT_URTA] = 0;
        this.doNext(this.playerMenu);
        // disable Amily button and replace her camp screen status, enable [Ask about Amily] button at Wet Bitch
    }

    // [Ask about Amily]
    public askAboutAmily(): void {
        this.clearOutput();
        // after 1400 and Urta's on duty:
        if (this.getGame().time.hours > 14) {
            this.outputText("You ask the assembled bar patrons if anybody has seen either a strange mouse-woman or Urta around, but don't get much of a response.  One cat-boy drinking at the bar haltingly suggests he may have noticed someone like that earlier in the day, but that was before Urta went on duty.  You thank him for the info.");
            this.doNext(kGAMECLASS.telAdre.barTelAdre);
            return;
        }
        // before Urta goes on duty at 1400:
        else {
            this.outputText("You ask the assembled bar patrons if anybody has seen either a strange mouse-woman or Urta around. The sparse morning crowd points, virtually as one, toward the back rooms. As you approach, you hear a thumping, banging commotion coming from one of the rooms...\n\n");

            this.outputText("To a mixture of confusion and relief, you realize they aren't the sounds of violence.\n\n");

            this.outputText("\"<i>Mmm... yeah, you're *burp* great at this!</i>\" you hear Urta groan, laboriously.\n\n");

            this.outputText("This is met with a chittering squeal you distinctly recognize as Amily's.  \"<i>Oooohhh... I see why " + this.player.short + " - yeah, gimme all you got! - fell for you!</i>\"\n\n");

            this.outputText("Curious, you ease open the door.  Inside, you see Urta and Amily, both naked, sitting on one of the cushioned couches along the wall.  Well, Urta is sitting there; Amily is perched in her lap, Urta's girthy prick visibly stuffed into her folds, with");
            if (this.flags[kFLAGS.AMILY_WANG_LENGTH] > 0) this.outputText(" her " + this.amilyScene.amilyCock() + " half-erect and drooling pre and");
            this.outputText(" her stomach swollen from the fox-morph's prodigious cum output to the point she looks ");
            if (this.amilyScene.pregnancy.event >= 3) this.outputText("almost twice as ");
            this.outputText("pregnant.  The mouse is holding a half-full bottle of what you think is Barkardi 151, waving it enthusiastically through the air even as she thumps up and down in Urta's lap, trying to coax one last orgasm from the visibly-drained hermaphrodite.  She giggles with delight and takes a messy swig from her bottle, spilling some of the booze onto her " + this.amilyScene.amilyTits() + " before twisting around and sloppily kissing Urta, trying to feed the contents of her mouth to the fox but dribbling half down her neck.\n\n");

            this.outputText("Do you leave them to get acquainted (and possibly be up for threesomes in the future), or do you barge in and stop these cheating sluts?");
            // [Leave Them (finishes as normal] [Interrupt]
            this.menu();
            this.addButton(0, "Leave Them", this.askAboutAmilyPt2);
            this.addButton(1, "Interrupt", this.cheatingSloots);
        }
    }

    private askAboutAmilyPt2(): void {
        this.clearOutput();
        this.outputText("Amily breaks the kiss and gives Urta a drunkenly affectionate smile, gently stroking her cheek.  \"<i>Mmm... I wish " + this.player.short + " had introduced ush earlier... I think we're gonna be good friendsh,</i>\" she slurs.  Urta simply nods, giving her a goofy grin but clearly miles away, mentally. The mouse promptly yawns, dropping the now empty bottle to the floor, shuts her eyes and snuggles up to Urta, who cuddles her close and also drifts off.\n\n");

        this.outputText("With a soft sigh, you shut the door and leave them to sleep it off.  While you can't predict that they will be quite so magnanimous about all this when they wake up, right now, it looks like neither of them is inclined to declare war over you.");
        this.dynStats("lus", 75);
        this.doNext(this.camp.returnToCampUseOneHour);
        // Progress to next stage!
        this.flags[kFLAGS.AMILY_VISITING_URTA] = 2;
        // Tag that Urta needs to freak out!
        this.flags[kFLAGS.URTA_AMILY_FOLLOWUP_NEEDED] = 1;
    }
    private cheatingSloots(): void {
        this.clearOutput();
        this.outputText("You kick open the door and roar, \"<i>What the fuck is this!?</i>\"  Both Amily and Urta turn to you and look at you with puzzled expressions before the severity of the situation seeps into their alcohol-fuzzed consciousnesses.  Almost simultaneously, they yell, \"<i>" + this.player.short + "!</i>\" and stumble apart drunkenly, leaking each other's slime all over the floor.  Urta slurs, \"<i>We didn't mean to... it jusht... happened...</i>\"\n\n");
        this.outputText("You growl and turn to Amily, who quietly squeaks, \"<i>I thought... I thought if I knew her better *hic* I could find a way to save what we had... *burp* I am REALLLY out of it, but I thought... ya know, if I was willing to sleep with her too that we could all be happy together.</i>\"\n\n");

        this.outputText("Well, the mouse may have a point.  You could let them get to know each other and perhaps turn this into a threesome down the road, or you could put a firm end to it right now.  There's a pretty good chance putting your boot down on this might piss off one of them.");
        // [Let Them Be] [End It]
        this.menu();
        this.addButton(0, "Let It Be", this.letTheSlootsFuck);
        this.addButton(1, "End It", this.endThisMadness);
    }
    private letTheSlootsFuck(): void {
        this.clearOutput();
        this.outputText("You chuckle and tell them you understand, though they had better include you in the future.  Drunken relief spreads across their faces when you give them a wink and step out.  Soon you hear the sloppy sounds of sex and giggles about how great their lover is.");
        this.dynStats("lus", 75);
        this.doNext(this.camp.returnToCampUseOneHour);
        this.flags[kFLAGS.AMILY_VISITING_URTA] = 4;
    }
    private endThisMadness(): void {
        this.clearOutput();
        this.outputText("You slam your fist into the wall and rage at the two cheating bitches.  Did they really think you wouldn't notice them screwing around on you behind your back?  You tell them that no, this is not going to make things better, and you scowl at Amily as you tell her that her excuse is piss-poor.  Looking towards Urta, you shout that she needs to think and stop letting her pecker lead her around.  For fuck's sake, she's nearly as bad as the monsters in the wilds!\n\n");

        // (Chance of Amily rage)
        if (rand(2) == 0) {
            this.outputText("\"<i>" + this.player.short + ", I did this for you!  I loved you so much I worked to see what you liked in Urta!</i>\" cries Amily.  Her face blushes, not in shame, but in anger as her temper flares.  She actually says, \"<i>Everything, all of this, it was me wanting things to be perfect for YOU!  FOR US!  You... you... asshole!</i>\"\n\n");
            this.outputText("The mouse scurries past you and disappears into the night.  Somehow you know you won't see her again.\n\n");
            // No more amily follower
            this.flags[kFLAGS.AMILY_FOLLOWER] = 0;
            this.flags[kFLAGS.AMILY_CORRUPT_FLIPOUT] = 1;
        }
        // (Chance of Urta rage)
        else {
            this.outputText("Urta scowls and straightens, sobering noticeably as an angry emerald fire seems to light in her eyes.  The vixen mutters, \"<i>You seduce both of us with kind words and affection, and now that we get together and realize we can love each other too, you have the nerve to accuse US of cheating?  You idiot!  This was all for you!  This was us learning to love each other the same way we learned to love you, so that together, we could make all three of us happy.</i>\"\n\n");

            this.outputText("The angry vixen snatches her clothes from a peg on the wall and slides out the door, too pissed to care that she's standing naked.  \"<i>I won't be a problem for you any more.  Just stay away from me.</i>\"\n\n");
            this.urtaLove(-100);
            this.flags[kFLAGS.URTA_PC_LOVE_COUNTER] = -1;
            this.flags[kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY] = -1;
        }
        this.flags[kFLAGS.AMILY_VISITING_URTA] = 3;
        this.outputText("You shrug.  Well, that puts an end to that.");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Next Morning
    public amilyUrtaMorningAfter(): void {
        // This scene plays the next morning after the second half of the "Amily goes to see Urta" scene
        // Should disable Amily as a follower option until the next day.
        this.outputText("\nAs you leave your bedding, you see a rather dilapidated-looking mouse sprawled restlessly in her nest.  Amily's back, obviously suffering from the effects of a really bad hangover.  Sympathetically, you bring her one of your water skins, holding it over her so that she can take it from you. She opens one bleary eye and stares at you incomprehensibly for a moment, then her vision focuses and she grabs it, gulping down water and spilling more over her clearly aching head.  You ask if she's all right.\n\n");

        this.outputText("\"<i>Ughhh... I'll live,</i>\" she groans, letting the last of the water run out over herself.  \"<i>Whaa...  Oh... right.  About Urta.  I'd still rather you'd told me about it, but... it's okay.</i>\"\n\n");

        this.outputText("You wait for her to relax, and then, with studied nonchalance, add that it looked like the two of them had settled things amicably enough.  At that, Amily looks panic-stricken, fear and embarrassment warring for her face.  \"<i>... you saw?</i>\" she manages to blurt.  \"<i>Uh... uh... sorry,</i>\" Amily is mumbling, panic still evident.  \"<i>I mean...</i>\"  The mouse trails off, looking at you for reassurance.  What do you do?");

        // [Smile and nod][Be totally a dick]
        this.menu();
        this.addButton(0, "Be Nice", this.smileAndNodToAmilyXUrta);
        this.addButton(1, "Be A Dick", this.beADickToAmily);
    }

    // [Be totally a dick]
    private beADickToAmily(): void {
        this.clearOutput();
        this.outputText("With a wicked, shit-eating grin, you tease Amily about falling into the trap she set for you.  Her expression hardens, winces breaking her frown as her hangover thrums every time you laugh.\n\n");

        this.outputText("\"<i>F-fuck you, " + this.player.short + ",</i>\" she finally rejoins.  \"<i>You did the same damn thing.</i>\"\n\n");

        this.outputText("You tell her that's <b>exactly</b> why you're laughing; she may act pure and monogamous, a perfect little wife, but her legs spread open just the same as every other whore's when confronted with a hard and ready cock like Urta's.\n\n");

        this.outputText("\"<i>That's bullshit!</i>\" she fumes, jumping to her feet with a hand to her head.  \"<i>I don't have to take that from you, asshole!  Did you maybe stop and think that I fell for Urta because she's humble and kind and tried to understand my feelings?  When I went to her over this she was nothing but patient with me, even as I raged at her!  She even forgave <b>you</b> for keeping me a secret, and Marae-knows what a piece of crap <b>you</b> are!  You know what?  I'm glad I did it all.  Because now I know I have somewhere else I can go to see another decent person.  I'm leaving you.</i>\"\n\n");

        this.outputText("With that, Amily grabs her gear closest to hand and pushes past you with the best flounce she can manage, heading toward the desert.");
        // plus PC corruption a little
        this.dynStats("cor", 5);
        this.flags[kFLAGS.AMILY_VISITING_URTA] = 3;
        // No more amily follower
        this.flags[kFLAGS.AMILY_FOLLOWER] = 0;
        this.flags[kFLAGS.AMILY_CORRUPT_FLIPOUT] = 1;

        // no more Puru Amily, corruption path only
        this.doNext(this.playerMenu);
    }

    // [Smile and nod]
    private smileAndNodToAmilyXUrta(): void {
        this.clearOutput();
        this.outputText("You grin and tell her that you're not surprised she hit it off so well with Urta.  She breaks into an uneasy calm as you tell her that the scene was actually kind of hot, and that you won't hold it against her... though you hint that you'd like to be there if the two of them ever feel like going at it again.\n\n");

        this.outputText("Amily is blushing with embarrassment at that last remark.  \"<i>O-Okay... I'll remember that.  But, can I go back to sleep, please?  My head is killing me.</i>\"\n\n");

        this.outputText("You nod and leave her to sleep.");

        // "Urta" is now unlocked in Amily's options between 0600 and 1400
        this.outputText("\n\n(<b>Urta is now unlocked from Amily's sex menu.</b>)");
        this.flags[kFLAGS.AMILY_VISITING_URTA] = 4;
        this.doNext(this.playerMenu);
    }

    // Amily Option - Urta
    // This option should probably only appear when Urta is actually at the Wet Bitch
    public amilyUrtaSex(): void {
        this.flags[kFLAGS.URTA_AMILY_FOLLOWUP_NEEDED] = 2;
        this.clearOutput();
        this.outputText("With a knowing smirk, you ask how Amily would feel about going to see Urta and maybe having a little fun with her.  The mouse-girl flushes with embarrassment, but you can see the eagerness in her body language.  \"<i>Okay, sure; I kind of like going to the city... besides, between you and me?  I think Urta needs all the friends she can get... never thought I'd feel sorry for a hermaphrodite.</i>\"  She mumbles this last part to herself, but you can still hear her.");
        if (!this.player.isPureEnough(50) && this.flags[kFLAGS.AMILY_WANG_LENGTH] > 0) this.outputText("  Privately, you note that it's bullshit; she's nothing <b>but</b> self-pity.");
        this.outputText("\n\n");

        this.outputText("With a gesture, the two of you set off.  As soon as you pass through the gates, you head towards the Wet Bitch.  Sure enough, Urta is at her usual table, and she smiles in delight to see you.  \"<i>" + this.player.short + ", Amily, hello!</i>\"  You take seats at the same table, as she ");
        if (!this.urtaLove()) this.outputText("blushes softly at the clunk of her erection against the table");
        else this.outputText("turns sideways to let her dress tent without banging into the table");
        this.outputText(".\n\n");

        this.outputText("Amily smiles shyly at the fox, but clearly can't bring herself to say why you're here.  So, you decide to take matters into your own hands.  Smiling knowingly, you reach a hand under the table to caress Urta's excited erection.  \"<i>I was thinking we could take this little pony for a ride.  What do you think?</i>\" you ask playfully.\n\n");

        this.outputText("Urta's face lights up in hungry delight and she promptly gets up and hurries off to one of the backrooms.  Amily also arises, face red with shame, and quickly follows her, with you bringing up the rear.\n\n");

        this.outputText("Once the three of you are in an empty room, you lock the door behind you as Urta and Amily both strip down, eyeing each other and you with equal attention.  \"<i>So... are you going to partake?  Or just watch?</i>\" Amily asks, hesitantly.");

        // Watch (only game in town for now, so suppress the choice buttons and route right to this)
        this.menu();
        if (this.player.hasCock()) {
            this.addButton(0, "Use Dick", this.amilyScene.threesomeAmilUrtaCAWKS);
        } else {
            this.addDisabledButton(0, "Use Dick", "This scene requires you to have cock.");
        }
        if (this.player.hasVagina()) {
            this.addButton(1, "Use Vag", this.amilyScene.urtaXAmilyCuntPussyVagSQUICK);
        } else {
            this.addDisabledButton(1, "Use Vag", "This scene requires you to have vagina.");
        }
        this.addButton(3, "Watch", this.amilyUrtaSexWatch);
    }
    private amilyUrtaSexWatch(): void {
        this.clearOutput();

        this.outputText("You tell the two that, this time, you're content to just watch.  You head over to one end of the couch and sit down, leaning back and waiting for them to begin.\n\n");

        this.outputText("Urta takes a deep breath, and then exhales it slowly.  \"<i>I'm not really used to doing this with an audience... but it might be fun to give it a try,</i>\" she declares.  You can see her erection isn't shrinking at the prospect.\n\n");

        this.outputText("\"<i>I'm... not sure of how we'll do this,</i>\" Amily says, hesitant despite the gathering moisture in her nether lips.\n\n");

        this.outputText("You just smile and assure them that they'll be just fine; just pretend you aren't in the room, you tell them, and do what comes naturally.\n\n");

        this.outputText("Urta rolls her eyes at the cliche advice, but turns to face Amily.  \"<i>Well, all right... come on, squeaky... I'm sure you know what fits where.</i>\"  She smiles as she says this, and gives the mouse a friendly wink.\n\n");

        this.outputText("Amily smiles back and approaches Urta, giving her a small peck on the lips and gently stroking her cock.\n\n");

        this.outputText("Urta groans, unable to resist groping Amily's " + this.amilyScene.amilyTits() + ".  \"<i>Let me sit down, first, squeaky; I've never been one for sex while standing up</i>\".  She slowly lowers herself to the ground and then pulls Amily down into her lap, idly grinding her mare-cock against Amily's torso");
        if (this.flags[kFLAGS.AMILY_WANG_LENGTH] > 0) this.outputText(", up the underside of her penis,");
        this.outputText(" and between her " + this.amilyScene.amilyTits() + ".\n\n");

        this.outputText("Amily slides her cleavage down Urta's length to gently give her flared tip a small lick, before rising");
        if (this.flags[kFLAGS.AMILY_WANG_LENGTH] > 0) this.outputText(", a bead of pre-cum stretching into a line connecting their two members");
        this.outputText(".  Straddling Urta and aligning the heavy horse-cock with her moist snatch, Amily teases, \"<i>Ready for this, foxy?</i>\"  Her eyes dart towards you for a split second.\n\n");

        this.outputText("You just smile gently and watch Urta, who swallows hard, tongue lolling out with anticipation before she remembers herself.  \"<i>Anytime, little mouse; if you can handle all of this.</i>\"  She's obviously trying to be bold about this - maybe your presence is unnerving her more than you thought.\n\n");

        this.outputText("Amily spares you another quick glance and lets gravity do its work, spearing herself on Urta's equine dick; she squeaks in pleasure and pain at the sudden intrusion.  Urta lets out a soft whine of delight, all attention lost from you and focused on the womanly folds now gripping her shaft.  \"<i>Are you all right?</i>\" she asks, a worried look eclipsing any show of pleasure.\n\n");

        this.outputText("\"<i>Y-Yeah, just give me a second to get adjusted,</i>\" Amily replies, bending over to support herself on the floor, bringing her panting lips dangerously close to Urta's own.  Too close, evidently, as Urta can't resist kissing her rodent lover when she does so.  Amily kisses her back, rubbing their breasts together as they begin to make out; Amily's hips begin slowly moving up and down Urta's shaft, settling in a slow rhythm.  It doesn't take long for the room to be filled with muffled squeaks and moans, as well as the noise of the wet grinding of cock and pussy.\n\n");

        this.outputText("Urta huffs and growls, easily getting into the spirit of things as she thrusts her long, girthy shaft into the rodent's surprisingly stretchable cunny.  Well, now you have a good idea why the demons would want to enslave her people, if she's typical of their ability to handle large insertions...\n\n");

        this.outputText("Amily breaks the kiss and reaches towards the ceiling, voicing her pleasure as she meets each and every one of Urta's thrusts. Her gaze turns to you and she looks at you with pure, undiluted lust; the idea of putting on a show for you bringing her to a whole new level of pleasure; the mouse-girl obviously has an exhibitionist streak!  Urta's tongue lolls out and she starts to whine and pant.  You can tell it's not going to be long before she cums...\n\n");

        this.outputText("Amily squeaks and moans, her stretched pussy clamping down as she impales herself fully on  Urta's invading shaft.  Urta can't take it any more; she actually barks with joy as her apple-sized nuts visibly clench, unleashing a cumsplosion into your rodent lover's waiting womb.\n\n");

        this.outputText("Amily does her best to milk Urta for all she's worth, even as her belly bloats with the volume of the vixen's spunk. Urta, in return, tries to give Amily everything she has, her hands clasping onto Amily's inflating belly and cradling it as if it were swollen with the lonely prick-vixen's children.  But, even Urta has her limits and, soon enough, the last jet of spunk splashes into Amily's depths, Urta's cock going flaccid as she spends her arousal into her lover.\n\n");

        this.outputText("With a sigh and a smile, Amily collapses on top of Urta, sated and full.  Her eyes dart towards you one more time before she cuddles the panting vixen to rest and enjoy the afterglow.\n\n");

        this.outputText("By this point, you are feeling very turned on indeed, but you can't bring yourself to disturb them.  Instead, you simply grin again and leave them to recover.");
        this.dynStats("lus", 50);
        this.doNext(this.camp.returnToCampUseOneHour);
    }
}
