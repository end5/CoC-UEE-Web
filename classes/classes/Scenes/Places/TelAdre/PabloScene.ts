import { TelAdreAbstractContent } from "./TelAdreAbstractContent";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { SpriteDb } from "../../../display/SpriteDb";
import { StatusEffects } from "../../../StatusEffects";

/**
 * Pablo the Maleherm Pseudo-Imp by worldofdrakan
 * @author Kitteh6660
 */
export class PabloScene extends TelAdreAbstractContent {

    public pabloIntro(textOutput: boolean = true): boolean {
        if (this.getGame().time.hours > 14 && this.getGame().time.hours <= 20) {
            if (textOutput) {
                if (this.flags[kFLAGS.PABLO_MET] == 0)
                    this.outputText("\n\nOver in the back, there is a short, no, -really- short figure doing chin-ups. He couldn’t possibly stand more than three and a half feet tall. He is shirtless, wearing only a pair of shorts. His skin is a bright peach color with a hint of blush on his nose and cheeks. He is lithe, but still noticeably muscular. Behind him swings a tail that nearly matches his body height in length, tipped with a tiny, arrowhead-like shape. A pair of small, bat-like wings grow out from his shoulderblades. His toes end in sharp claws, as well as his fingers. Your attention then turns to his face. It is slightly effeminate, though still visibly masculine. Atop his head is a mop of shaggy, curly, unkempt hair, sandy blonde hair. Squinting, you can make out a pair of tiny horns under the mop on his head, as well as a pair of cute, pointed ears. His eyes are almost completely black, save for his vermillon irises. Come to think of it, he kind of looks like… an imp? No, not in Tel’Adre. There’s no way he can be an imp. Or is there?");
                else
                    this.outputText("\n\nAs usual, Pablo is in the back doing his usual chin-up workout.");
            }
            return true;
        }
        else {
            return false;
        }
    }

    public pabloAffection(mod: number = 0): number {
        this.flags[kFLAGS.PABLO_AFFECTION] += mod;
        if (this.flags[kFLAGS.PABLO_AFFECTION] < 0) this.flags[kFLAGS.PABLO_AFFECTION] = 0;
        if (this.flags[kFLAGS.PABLO_AFFECTION] > 100) this.flags[kFLAGS.PABLO_AFFECTION] = 100;
        return this.flags[kFLAGS.PABLO_AFFECTION];
    }

    private checkPablosVirginity(anal: boolean): void {
        if (anal) {
            if (this.flags[kFLAGS.PABLO_GOT_DICKED_ANALLY] == 0) {
                this.outputText("<b>You have claimed Pablo's anal virginity!</b>");
            }
        }
        else {
            if (this.flags[kFLAGS.PABLO_GOT_DICKED_VAGINALLY] == 0) {
                this.outputText("<b>You have claimed Pablo's vaginal virginity!</b>");
            }
        }
    }

    // Introduction to Pablo
    public approachPablo(): void {
        this.spriteSelect(SpriteDb.s_pablo);
        this.clearOutput();
        this.credits.modContent = true;
        this.credits.authorText = "worldofdrakan";
        if (this.flags[kFLAGS.PABLO_MET] == 0) {
            this.outputText("You approach the imp-like creature, a whole swarm of questions flooding your mind. Noticing you, he hops down from his bar.");
            this.outputText("\n\n\"<i><i>Hello there. I don’t believe we’ve met. The name’s Pablo. And you?</i></i>\"");
            this.outputText("\n\n\"<i>" + this.player.short + ",</i>\" you respond.");
            this.outputText("\n\nAlthough you imagine it to be rude to ask, as you’ve only just met, but you must know.");
            this.outputText("\n\n\"<i>Are you?...</i>\"");
            this.outputText("\n\nYou hesitate for a moment.");
            this.outputText("\n\n\"<i>An imp?</i>\" Pablo interrupts. He seems to have anticipated your question. \"<i>I get that question a lot. I guess I am, but not quite.</i>\"");
            this.outputText("\n\nHe certainly looks like an imp, though. You’re curious. How exactly did he get into Tel’Adre. They had to have thought he was an imp.");
            this.outputText("\n\n\"<i>They did,</i>\" he begins, lowering his head and shuffling his feet. He can’t help but chuckle as he looks back on the day he first arrived in the city. \"<i>I had a lot of explaining to do, and it certainly wasn’t easy. In the end, it all came down to this weird corruption scan with some kind of special crystal. You could imagine how surprised they were when I passed their test.</i>\"");
            this.outputText("\n\nIf he wasn’t always like this, what was he? And how did he get this way? You really hope he doesn’t mind you asking.");
            this.outputText("\n\n\"<i>If you can believe it, I was a human once. I was an adventurer, you see. One day, I stumbled through this portal, and voila! I was in this place, the land of Mareth!</i>\"");
            this.outputText("\n\nYour eyes widen. He used to be a human, just like you " + (this.player.race == "human" ? "are" : "were") + "!");
            this.outputText("\n\n\"<i>Eventually, I got hungry, -really- hungry. For a while, food was hard to come by, and I had to make do with whatever I could find. Sometimes the imps would have this strange food on them, and sometimes they would have drinks. I think you can see where I’m going here. Long story short, the things I ate ended up changing me.</i>\"");
            this.outputText("\n\nYou intently continue to listen to his story.");
            this.outputText("\n\n\"<i>My hair wasn’t always this color, either. It was black.</i>\" he says, twirling one of his sandy blonde locks. \"<i>Some crazy bitch out in the desert made it that way, called herself a Sand Witch. Heh. She threw this hissy fit when I refused to let her cast a spell on me. What else was I supposed to do? She wouldn’t even tell me what kind of spell it was. In the end, I gave in just to calm her crazy tits. I’ve gotten kinda used to this color, actually. But I guess that’s enough about me. Perhaps you and I could work out together?</i>\"");
            this.flags[kFLAGS.PABLO_MET] = 1;
            this.pabloAffection(10);
        }
        else if (this.flags[kFLAGS.PABLO_AFFECTION] < 80) {
            this.outputText("You approach Pablo.");
            this.outputText("\n\n\"<i>Oh, hey there, " + this.player.short + "! Stopping by for another workout?</i>\"");
        }
        else {
            this.outputText("Smiling, you approach Pablo, glad to see your friend again.");
            this.outputText("\n\n\"<i>Well look who’s here,</i>\" the imp says, grinning widely as he turns to face you. \"<i>Hey there, friend. You stopping by for a workout? You know you’re always welcome. Or did you just drop in to say hi?</i>\"");
        }
        this.doYesNo(this.workoutWithPablo, this.declineWorkout);
    }

    // Stop! Workout time!
    private workoutWithPablo(): void {
        this.clearOutput();
        if (this.flags[kFLAGS.PABLO_WORKOUT_COUNTER] == 0) {
            this.outputText("You nod at the faux imp, telling him that you could use some exercise.");
            if (this.flags[kFLAGS.LIFETIME_GYM_MEMBER] == 0) this.outputText("\n\nThe centauress working the door walks up to collect her fee, and you drop 10 gems for an hour workout into her hand.");
            this.outputText("\n\n\"<i>Great,</i>\" Pablo responds with a grin. \"<i>There’s another bar next to mine. Maybe you could try doing some chin-ups?</i>\"");
            this.outputText("\n\nWith that, Pablo flutters his wings, lifting himself to his bar.");
            this.outputText("\n\n");
        }
        if (this.flags[kFLAGS.PABLO_AFFECTION] < 80) {
            this.outputText("You work out for about an hour or so, exchanging a few stories of your own travels in Mareth as you do so. He pays close attention to his stories, adding commentary whenever appropriate.");
            this.outputText("\n\nYou depart to take a quick shower before returning to camp, Pablo waving goodbye at you as you go.");
        }
        else {
            this.outputText("You accept the imp-morph’s invitation eagerly.");
            this.outputText("\n\n\"<i>Great! You know how much I enjoy our workouts. There’s a bar you can use right next to mine, as per the usual.</i>\"");
            this.outputText("\n\nNodding, you hop up, grasping the bar. You work out for an hour, exchanging various stories of your adventures in Mareth. He adds in commentary whenever appropriate, as well as the occasional witty banter.");
            this.outputText("\n\nWhen your hour is up, you hop down from your bar and make your way to the showers, Pablo waving goodbye to you as you do so. Once you finish with your shower, you return to camp.");
        }
        if (this.player.str100 < 40) this.dynStats("str", 0.5);
        if (this.player.str100 < 60) this.dynStats("str", 0.5);
        if (this.player.str100 < 80) this.dynStats("str", 0.5);
        if (this.player.str100 < 90) this.dynStats("str", 0.4);
        this.dynStats("str", 0.1);
        this.player.modTone(90);
        this.flags[kFLAGS.PABLO_WORKOUT_COUNTER]++;
        if (this.flags[kFLAGS.PABLO_AFFECTION] < 60) this.pabloAffection(5);
        this.pabloAffection(5);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    private declineWorkout(): void {
        this.clearOutput();
        if (this.flags[kFLAGS.PABLO_WORKOUT_COUNTER] == 0) {
            this.outputText("You politely decline, not really feeling up to working out at the moment.");
            this.outputText("\n\n\"<i>It’s alright,</i>\" the imp says. \"<i>You’re welcome to work out with me anytime, though.</i>\"");
            this.outputText("\n\nWith that, you make your leave.");
            this.pabloAffection(5);
        }
        else if (this.flags[kFLAGS.PABLO_AFFECTION] < 80) {
            this.outputText("You decline, explaining that you just dropped by to say hello.");
            this.outputText("\n\nPablo smiles, seemingly flattered at the gesture.");
            this.outputText("\n\n\"<i>It’s alright, " + this.player.short + ". It was nice of you to drop by, though.</i>\"");
        }
        else {
            this.outputText("You smile at your friend, explaining that you just dropped by to say hello, and to ask how he’s been.");
            this.outputText("\n\n\"<i>Well that’s nice of you,</i>\" Pablo remarks, chuckling slightly. \"<i>I’ve been doing great, even better after our encounter in the showers.</i>\"");
            this.outputText("\n\nYou can feel yourself beaming with pride. You’re so glad that you were able to help him out. You tell him that you’ll see him later.");
            this.outputText("\n\n\"<i>I look forward to it!</i>\" the imp replies happily, giving you a quick wave.");
        }
        this.doNext(this.telAdre.gym.gymDesc);
    }

    // Pablo has let the cat out of the bag.
    public pabloSecret(): void {
        this.spriteSelect(SpriteDb.s_pablo_nude);
        this.clearOutput();
        this.outputText("You raise an arm, smelling your armpit. You wrinkle your nose in disgust. The smell is absolutely rank! Bashfully looking around, making certain that everyone around you is out of detection range, you make your way to the lockers. " + this.player.clothedOrNaked("There, you remove your " + this.player.armorDescript() + ", stripping naked before grabbing", "There, being naked already, you grab") + " a towel to cover yourself. You hear the sound of running water as you approach the showers, confirming the presence of someone else. Before reaching the entrance to the room, the water stops. Whoever it is, they must be getting out. As you reach the entrance, you see Pablo leaving one of the stalls, getting a full glimpse of his naked figure. He doesn’t appear to have noticed you.");
        this.outputText("\n\nBetween his legs is a generous human cock, at least for someone of his stature. You estimate it to be about six inches in length and one and a half inches in width. His balls, the average, each about an inch across. He turns to the stall, giving you a full glimpse of his backside as he flaps his wings, lifting himself in the air to grab his towel which hung over the door. You can now see the small slit which would otherwise be hidden by his balls. He’s a herm!");
        this.outputText("\n\nDeciding that you’ve stared at him long enough, you pick a stall and make your way over to it.");
        this.outputText("\n\nYou greet him as you enter the stall, hanging your towel over the door as you shut it behind you.");
        this.outputText("\n\nPablo jumps back, covering his crotch as he reels in shock at the fact that you’ve seen him naked. His expression of shock soon turns to one of despair, tears of embarrassment welling up in his eyes.");
        this.outputText("\n\n\"<i>No, no, damn it, no!</i>\" he whimpers, hastily wrapping the towel around him. \"<i>I was hoping that no-one would ever see me like this!</i>\"");
        this.outputText("\n\nYou look down at him, confused. Was he referring to the fact that he was a maleherm? Why, in a place like Mareth, would someone be embarrassed by such a thing, let alone want to keep it a secret? You elect to ask him that exactly.");
        this.outputText("\n\nThe imp-morph removes his hands from his face at looks up at you, nodding sadly.");
        this.outputText("\n\nBut why does that embarrass him so much? You’ve come across many just like him" + (this.player.gender == 3 ? ", and you happen to be one yourself." : "."));
        this.outputText("\n\nHe looks to the side for a moment, and then back to you.");
        this.outputText("\n\n\"<i>You mean… You’re actually interested in me, and why I’d want to hide it?</i>\" he asks.");
        this.outputText("\n\nOf course you’re interested. You’re friends, aren’t you?");
        this.outputText("\n\nThe imp stands silent for a moment, going through the options in his head.");
        this.outputText("\n\n\"<i>Alright,</i>\" he begins, leaning against your stall door, \"<i>I’ll tell you. If you can believe it, there’s a real stigma against people like me, people with both sexes. I’m pretty sure it has something to do with the demons. Apparently possessing both sexes was practically unheard of before they came. So I guess people just came to associate us with them, the demons… It’s also kinda my fault that I’m this way. Remember when I said that some of the things I ate and drank changed me? That’s how I ended up getting a vagina. I used to just have a penis.</i>\"");
        this.outputText("\n\nAs you listen, a frown crosses your face. It all becomes clear to you. You feel nothing but pity for your faux imp friend. You turn back to Pablo, giving him a reassuring smile. You tell him that he’s your friend. Of course his extra equipment doesn’t bother you.");
        this.outputText("\n\nThe imp-morph’s face lights up, his usual friendly smile returning.");
        this.outputText("\n\n\"<i>You don’t? Oh, " + this.player.short + "! You really have been a great friend to me!</i>\"");
        this.outputText("\n\nYou let out a sigh of relief, glad to have cheered up your friend.");
        this.outputText("\n\nIt was nothing, really.");
        this.outputText("\n\nFinishing your shower, you shut off the water, grabbing the towel to dry. Once dry, you wrap yourself in it and leave your stall, making your way to the locker room. You wave goodbye to Pablo as you reach the entrance. There, you " + this.player.clothedOrNaked("re-equip your [Armor] and ") + "make your way back to camp, satisfied.");
        this.flags[kFLAGS.PABLO_SECRET_LEARNED] = 1;
        this.pabloAffection(20);
        this.player.changeFatigue(-10);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Shower sexy times!
    public pabloShowerSexIntro(): void {
        this.spriteSelect(SpriteDb.s_pablo);
        this.clearOutput();
        this.outputText("After a long, hard workout, you rest for a moment, wiping your brow of sweat as you catch your breath. If your forehead is that sweaty, surely the rest of your body must be the same way. As such, you elect to take a quick shower before you head back to camp.");
        this.outputText("\n\nAs usual, you retreat to the locker room, removing your [Armor] and covering yourself with a towel. As you enter your stall, you see a familiar face enter the room. It’s Pablo. Judging by the towel around his waist, he must be wanting a shower, too. He appears to be very nervous, looking at the floor and twiddling his thumbs.");
        this.outputText("\n\n\"<i>Ah… Hey there, " + this.player.short + ".</i>\" He reaches a hand to his head, scratching behind one of his ears. \"<i>There’s been something that I’ve been meaning to talk to you about- for a while now, as a matter of fact.</i>\"");
        this.outputText("\n\nAfter turning on the water, you turn to face your imp friend. What could he possibly be getting at?");
        this.outputText("\n\n\"<i>Well,</i>\" he gulps, \"<i>you’ve done so much for me in the time that we’ve been friends. It’s unreal. No-one has ever treated me as nicely as you have. I’ve been having a hard time sleeping at night, and it’s because I’ve always been thinking of you, dreaming of you. I was thinking that maybe we… I don’t know, could do some other things together. Like, um, dates, and maybe even,</i>\" he pauses, hesitating, \"<i>sex.</i>\"");
        this.outputText("\n\nYour mouth hangs agape, shocked at your friend’s confession. At the same time, you can’t help but feel incredibly flattered by it. He clearly likes you in more ways than one!");
        this.outputText("\n\n\"<i>Oh, forget it! Forget I said anything! I should’ve known that this was a stupid idea!</i>\" he cries, his head in his hands. He appears to have taken your stunned silence as a rejection. He turns toward the entrance of the room, intent on leaving. Should you stop him, or maybe it’d be better to just let him go?");
        this.menu();
        this.addButton(0, "Let him go", this.pabloShowerLetGo).hint("Let Pablo go. There's no harm in letting him go. You're sure you'll be able to see him again.");
        this.addButton(1, "Stop him", this.pabloShowerStopHim).hint("Stop Pablo. This will lead to some sexy times.");
    }

    private pabloShowerLetGo(): void {
        this.clearOutput();
        this.outputText("You sigh, resolving yourself to let him go. Pablo seemed embarrassed, ashamed even. He may need some time alone. Perhaps this was for your own good as well. You may need some time to think about all of this, to take it all in. It’s not everyday that someone admits to touching themselves to the thought of you.");
        this.outputText("\n\nYou look to the ground, watching the water go down the drain. The water goes cold, and you find that you’re not enjoying yourself as much as you did with your other showers. Are you certain that you made the right decision?");
        this.outputText("\n\nShivering, you turn off the water, drying yourself off as quickly as you can. You rush to the locker room, discarding your towel and re-equipping your [Armor]. With that, you make your way back to camp.");
        this.player.changeFatigue(-10);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    private pabloShowerStopHim(): void {
        this.clearOutput();
        this.outputText("Intent on stopping Pablo, you swing open your stall door, not even bothering to cover yourself. You run to him frantically, nearly slipping on the wet floor as you do so. You drop to your knees and wrap your arms around him, preventing his escape. The imp-morph freezes, speechless.");
        this.outputText("\n\n\"<i>...But… why, " + this.player.short + "?</i>\"");
        this.outputText("\n\nDid it ever occur to him that you find his attraction to you flattering? Not even once?");
        this.outputText("\n\nYou turn your head to face his, giving him a soft kiss on the cheek. Never would you think that his cheeks could possibly get any redder, but in that moment, you would swear that they did. To your surprise, Pablo slips from your grasp, wrapping his arms about your neck in a tight hug. He wastes no time in giving you a passionate kiss on the lips, his entire body shivering in excitement.");
        this.outputText("\n\n\"<i>Oh, " + this.player.short + "!</i>\" he begins, breaking the kiss. \"<i>You just have no idea how relieved I am to hear that!</i>\"");
        this.outputText("\n\nYou think you have an idea.");
        this.outputText("\n\nOnly then does Pablo stop to admire your naked figure. He nods in approval as he scales your body, just taking it all in. Already you can make out the shape of an erection tenting the towel around his waist. His eyes widen as he realizes just what’s going on down below, quickly covering his crotch with his hands.");
        this.outputText("\n\n\"<i>Oh, sorry. Maybe that’s a bit too straightforward.</i>\"");
        this.outputText("\n\nYou wouldn’t say so. In fact, maybe you could help him with that?");
        this.outputText("\n\n\"<i>You mean you really want to?</i>\" Pablo asks, his face lighting up at the notion.");
        this.outputText("\n\nOf course you do. Your stall is still open, and you motion inside.");
        this.outputText("\n\n\"<i>Y-yes, I’d like that very much,</i>\" he says, nodding furiously.");
        this.outputText("\n\nWith that, you make your way to the stall, swinging your hips in a teasing fashion. Pablo is not far behind. On your way there, you consider how to tackle this. Should you take charge, or let Pablo run the show? What parts will you use?");
        if (this.player.hasStatusEffect(StatusEffects.Infested)) {
            this.pabloGetsGrossedOutByWorms();
            return;
        }
        this.pabloSexMenu();
    }

    public pabloSexMenu(): void {
        this.spriteSelect(SpriteDb.s_pablo_nude);
        this.menu();
        if (this.player.hasCock()) this.addButton(0, "Use Dick", this.pabloDickingTimeSubMenus);
        else this.addButtonDisabled(0, "Use Dick", "You need to have a cock for that.");
        if (this.player.hasVagina()) this.addButton(1, "Use Pussy", this.PabloPussPussSubMenus);
        else this.addButtonDisabled(1, "Use Pussy", "You need to have a pussy for that.");
        this.addButton(2, "Use Ass", this.pabloButtsecksSubMenus);
    }

    private pabloDickingTimeSubMenus(): void {
        this.clearOutput();
        this.outputText("How shall your dick be used? Do you take charge or let him lead? And would you do it vaginally or anally?");
        this.menu();
        this.addButton(0, "TakeCharge(Vag)", this.pabloDickingTime, true, false, undefined, "You'll take charge and give him vaginally.", "Take Charge (Vaginal)");
        this.addButtonDisabled(1, "TakeCharge(Anal)", "Unfortunately this scene has not been written yet. Y U NO write that scene, worldofdrakan?", "Take Charge (Anal)");
        // addButton(1, "TakeCharge(Anal)", pabloDickingTime, true, true, undefined, "You'll take charge but do it anally.", "Take Charge (Anal)");
        this.addButton(2, "PabloLeads(Vag)", this.pabloDickingTime, false, false, undefined, "You'll let Pablo lead and he'll take your dick vaginally.", "Pablo Leads (Vaginal)");
        this.addButtonDisabled(3, "PabloLeads(Anal)", "Unfortunately this scene has not been written yet. Y U NO write that scene, worldofdrakan?", "Take Charge (Anal)");
        // addButton(3, "PabloLeads(Anal)", pabloDickingTime, false, true, undefined, "You'll let Pablo lead and he'll ride your dick anally.", "Pablo Leads (Anal)");
    }
    private pabloDickingTime(inCharge: boolean = false, anal: boolean = false): void {
        this.clearOutput();
        // Anal (Worldofdrakan, Y U NO write anal pitch scene?)
        if (anal) {
            if (inCharge) {
                this.outputText("");
                this.outputText("\n\n");
                this.outputText("\n\n");
                this.outputText("\n\n");
                this.outputText("\n\n");
                this.outputText("\n\n");
                this.outputText("\n\n");
                this.checkPablosVirginity(true);
            }
            else {
                this.outputText("");
                this.outputText("\n\n");
                this.outputText("\n\n");
                this.outputText("\n\n");
                this.outputText("\n\n");
                this.outputText("\n\n");
                this.outputText("\n\n");
            }
            this.flags[kFLAGS.PABLO_GOT_DICKED_ANALLY]++;
        }
        // Vaginal
        else {
            if (inCharge) {
                if (this.player.tallness >= 60 && !this.player.isTaur()) {
                    this.outputText("You look down at your imp friend, your [cock] hardening as you inspect his naked body. You are significantly taller than him, and you contemplate on how you can fuck him comfortably. You smile slyly as you remember the back wall of the stall. You know just what to do.");
                    this.outputText("\n\nAbruptly, you scoop up the imp-morph, hugging him tightly. He lets out a surprised gasp, but he welcomes your sudden embrace, planting a kiss on your cheek. You look deeply into his eyes, and ask him if he’s ready to make some good use of the back of this stall. He seems to have taken the hint.");
                    this.outputText("\n\n\"<i>Yes, y-yes. Take me, please!</i>\" Pablo whimpers as he wraps his legs around you, his foot-claws digging softly into your back.");
                    this.outputText("\n\nYou decide not to keep the excited imp waiting any longer. Carefully, you prop him up against the back of the stall, telling him to keep his legs wrapped around you for support. Right as you’ve lined your [cock] up with his already-drooling cunt, he lightly shoves you.");
                    this.outputText("\n\n\"<i>Um, wait,</i>\" he says nervously.");
                    this.outputText("\n\n\"<i>What’s wrong?</i>\" you ask.");
                    this.outputText("\n\nYour friend hesitates for a moment before answering. \"<i>It… It’s my first time. Uh, in there at least. Could you, ah, maybe go a bit easy on me?</i>\"");
                    this.outputText("\n\nOf course you can. All he needed to do was ask. With that, you carefully ease your length into him. He winces slightly, and you worry that you may have hurt him. You ask him if he’s alright, and he insists that he is, urging you to continue. You oblige him, but you keep your pace slow and easy, just as promised. ");
                    this.checkPablosVirginity(false);
                    this.outputText("\n\nPablo continues to whine softly as you thrust in and out of his needy puss. As if on reflex, he reaches a hand down to his throbbing manhood, pumping it furiously until the tip begins to dribble precum. You smile widely at the imp-morph’s enthusiasm, upping your pace a bit.");
                    this.outputText("\n\nHe practically squeals at the sensation of your rod pistoning in and out of his cooch. It isn’t long before the shambling mess of an imp-morph completely loses it, his pecker twitching violently as rope upon rope of spooge erupts from his tip and onto your chest. The inner walls of his cunt feverishly clamping down on your own member, milking it for all that it’s worth. He slumps against the back of the stall, exhausted from your lovemaking. You opt to hold him there until he completely catches his breath, despite being more than a little exhausted yourself.");
                    this.outputText("\n\nHe finally speaks up, his breathing still labored. \"<i>That was amazing, " + this.player.short + ". I don’t think I’ve ever cum that quickly before. You can put me down now.</i>\"");
                    this.outputText("\n\nYou waste no time in returning him to the ground, allowing the both of you to clean up under the running water. Pablo exits the stall, drying off and wrapping his towel around his waist. You follow suit. Before leaving, he gives you one last hug and kiss.");
                    this.outputText("\n\n\"<i>Thank you, lover. I couldn’t have asked for better.</i>\"");
                }
                else {
                    this.outputText("You look at your imp friend, your [cock] hardening as you inspect his naked body. The both of you aren’t very far off in terms of height. This is good. You have an idea, and given your lack of significant height difference(/’your body type’ if centaur), it shouldn’t be too hard to pull off. You smile slyly at him, abruptly flipping him onto his hands and knees and mounting him. He seems startled at first, but does not seem to be taking unkindly to your actions. As you press your stiff pecker against his wet folds, his tail blocks your way. Is something wrong?");
                    this.outputText("\n\n\"<i>Hey, could you maybe go a bit easy on me? I may not be new to sex, but I’m still a virgin, ah, in there.</i>\"");
                    this.outputText("\n\nOf course you can. All he needed to do was ask. With that, Pablo’s tail moves out of the way, and you’re able to carefully ease your length into him. He winces slightly, and you can feel him shuddering under you. For a moment, you worry that you might have hurt him. You ask him if he’s alright, and he insists that he is, urging you to continue. You oblige him, but you keep your pace slow and easy, just as promised. ");
                    this.checkPablosVirginity(false);
                    this.outputText("\n\nHe practically squeals at the sensation of your rod pistoning in and out of his cooch. It isn’t long before the shambling mess of an imp-morph completely loses it, his pecker twitching violently as rope upon rope of spooge erupts from his tip and washes down the drain below. The inner walls of his cunt feverishly clamping down on your own member, milking it for all that it’s worth. He slumps to the floor of the stall, exhausted from your lovemaking. You move off of the imp and give him some space, needing a little breather yourself.");
                    this.outputText("\n\nHe finally speaks up, his breathing still labored. \"<i>That was amazing, " + this.player.short + ". I don’t think I’ve ever cum that quickly before. You can move now. I can’t exactly get up with you looming over me like that.</i>\"");
                    this.outputText("\n\nYou waste no time in getting up, allowing the both of you to clean up under the running water. Pablo exits the stall, drying off and wrapping his towel around his waist. You follow suit. Before leaving, he gives you one last hug and kiss.");
                    this.outputText("\n\n\"<i>Thank you, lover. I couldn’t have asked for better.</i>\"");
                }
            }
            else {
                this.outputText("Pablo eyeballs you with a look of confusion as you lay down on the floor of the shower stall, scratching his head. He doesn’t seem to be taking the hint. You can’t help but chuckle at his confusion. You would think that he’d know what you were getting at. Still, you expose yourself to him, and that’s all it takes for it to sink in.");
                this.outputText("\n\n\"<i>You actually want me to lead?</i>\" the imp-morph asks. \"<i>Wow, and I thought you would be the one taking charge. That’s not a bad thing, though. I’ll do it. I just wasn’t expecting it.</i>\"");
                this.outputText("\n\nPablo is hovering over you now, clearly thinking to himself. You can only guess that he’s trying to figure out exactly what he wants to do here. He takes your [cock] in his clawed hand, stroking it lovingly.");
                this.outputText("\n\n\"<i>You know, I might be far from a stranger to sex, but I’m still a virgin in the vagina, if that makes sense. Maybe you’re just the right one to help me break it in, hm? What do you say?</i>\"");
                this.outputText("\n\nYou give your partner a nod in approval. If that’s what he wants, go right ahead.");
                this.outputText("\n\nThe imp licks his lips in anticipation. His already-drooling is already right above your stiff pecker. Carefully, he lowers himself down to where your leaking tip is just barely pressing against his entrance. From there, he takes a deep breath, allowing you to slip inside of him. For a moment, the imp-morph gasps at the sensation of your rod in his folds. You’re concerned that he might have hurt himself, and you ask him if he’s alright.");
                this.checkPablosVirginity(false);
                this.outputText("\n\n\"<i>Yeah, I’m fine,</i>\" he responds. \"<i>I just have to get used to it, that’s all. I’ll be ready to go in a minute.</i>\"");
                this.outputText("\n\nSmiling, you give the imp-morph’s body all the time it needs to adjust to you, stroking his wet, sandy blonde hair from time to time. Eventually, he moves about experimentally, letting out a pleasured sigh as he does so. He’s probably about ready to continue. Indeed, he is. By now, he’s begun to gyrate his hips at a steady pace, and he only gets faster as he goes along.");
                this.outputText("\n\n\"<i>Oooh, " + this.player.short + ",</i>\" the imp moans. \"<i>This feels amazing!</i>\"");
                this.outputText("\n\nHe isn’t doing a half bad job himself. If he keeps going like this, it won’t be long before the both of you are sent over the edge. In fact, you’re already struggling to hold back your orgasm. You’re really hoping that the both of you will be able to cum together.");
                this.outputText("\n\nIn that moment, you would swear that Pablo was reading your thoughts. You can feel his inner walls contracting rapidly around your [cock] as he tosses his head back, wailing in pleasure. Rope after rope of cum sprays from your partner’s ample cock and onto your chest. As you blow your own load, you’re forced to grip Pablo’s firm ass for support, and he’s loving every second of it.");
                this.outputText("\n\nOnce you both come down from your high, all you can do is stay there and catch your breaths. The first to try and get up is Pablo, but even then his breathing is still noticeably labored. You can see little droplets of your seed dripping from his snatch as your prick pops free. You can’t help but smile triumphantly at the fact that you’ve filled him to the brim with cum.");
                this.outputText("\n\n\"<i>That was great, " + this.player.short + ",</i>\" he finally speaks up. \"<i>I don’t think I’ve ever cum that quickly before.</i>\"");
                this.outputText("\n\nWhat’s he talking about, you ask. He did all the work after all. Pablo chuckles bashfully as you point this out.");
                this.outputText("\n\n\"<i>I guess you’re right, but I still had a great time. That’s all that matters, right? Oh, and before I forget. Thanks, lover.</i>\"");
                this.outputText("\n\nWith that, the imp-morph leaves, allowing you to finish cleaning yourself up before returning to camp.");
            }
            this.flags[kFLAGS.PABLO_GOT_DICKED_VAGINALLY]++;
        }
        this.pabloAffection(5);
        this.player.orgasm();
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    private PabloPussPussSubMenus(): void {
        this.clearOutput();
        this.outputText("How shall your " + this.player.vaginaDescript() + " be used? Do you take charge or let him lead?");
        this.menu();
        this.addButton(0, "Take Charge", this.pabloPussPuss, true, undefined, undefined, "You'll take charge and receive vaginally.", "Take Charge");
        this.addButton(1, "Pablo Leads", this.pabloPussPuss, false, undefined, undefined, "You'll let Pablo lead and he'll put his dick to a good use.", "Pablo Leads");
    }
    private pabloPussPuss(inCharge: boolean = false): void {
        this.clearOutput();
        if (inCharge) {
            if (this.player.tallness >= 60 && !this.player.isTaur()) {
                this.outputText("You look down at your imp friend, your cunt moistening as you inspect his naked body. You are significantly taller than him, and you contemplate on how you can fuck him comfortably. You smile slyly as you remember the back wall of the stall. You know just what to do.");
                this.outputText("\n\nAbruptly, you scoop up the imp-morph, hugging him tightly. He lets out a surprised gasp, but he welcomes your sudden embrace, planting a kiss on your cheek. You look deeply into his eyes, and ask him if he’s ready to make some good use of the back of this stall. He seems to have taken the hint.");
                this.outputText("\n\n\"<i>Yes, y-yes. Take me, please!</i>\" Pablo whimpers as he wraps his legs around you, his foot-claws digging softly into your back.");
                this.outputText("\n\nYou decide not to keep the excited imp waiting any longer. Carefully, you prop him up against the back of the stall, telling him to keep his legs wrapped around you for support. Right as you’ve lined your muff up with his eager prick, you can already see him licking his lips in anticipation.");
                this.outputText("\n\n\"<i>Come on, " + this.player.short + ". Stop teasing me like this!</i>\" he whines.");
                this.outputText("\n\nYou find yourself grinning from ear to ear at Pablo’s eagerness to start. He really is ready for you, isn’t he? Well, you figure that it isn’t really worth making him wait any longer. You’re quite eager to start yourself, after all. So, without further ado, you ease yourself onto the imp-morph’s throbbing cock. He sighs dreamily as you allow him into the warm confines of your inviting folds, his eyes rolling into the back of his head.");
                this.player.cuntChange(20, true, true, true);
                this.outputText("\n\nAt first, you start out slow, gyrating your hips at a steady pace, but you aren’t able to keep this pace for long. The sensation of Pablo’s twitching prick inside you is already close to driving you off the edge. Judging by your partner’s rapid breathing, he isn’t very far off himself. At this point, the both of you are rutting like animals. Any gym-goers who come in for a shower are sure to get an earful of the lewd sounds of your lovemaking. Pablo is the first to lose it, releasing a guttural moan as he fills you to the brim with his seed. You follow soon after, your rapidly-clamping inner walls milking his pecker for all that its worth" + (this.player.hasCock() ? " while your " + this.player.cockDescript() + " shoots jism all over his belly" : "") + ". You both are forced to take a breather, and you struggle to keep the imp-morph pinned to the wall.");
                this.outputText("\n\nPablo finally speaks up, his breathing still labored. \"<i>That was amazing, " + this.player.short + ". I don’t think I’ve ever cum that quickly before. You can put me down now.</i>\"");
                this.outputText("\n\nYou waste no time in returning him to the ground, allowing the both of you to clean up under the running water. Pablo exits the stall, drying off and wrapping his towel around his waist. You follow suit. Before leaving, he gives you one last hug and kiss.");
                this.outputText("\n\n\"<i>Thank you, lover. I couldn’t have asked for better.</i>\"");
            }
            else {
                this.outputText("You look at your imp friend, your cunt moistening as you inspect his naked body. The both of you aren’t very far off in terms of height. This is good. You have an idea, and given your lack of significant height difference, it shouldn’t be too hard to pull off. You smile slyly at him, abruptly pushing him to the ground and onto his back. From there, you’re able to mount him comfortably. He seems startled at first, but does not seem to be taking unkindly to your actions.");
                this.outputText("\n\n\"<i>Ahh, I see where this is going,</i>\" Pablo comments, smirking. \"<i>I like this. I like this a lot.</i>\"");
                this.outputText("\n\nAlready, you’re hovering just above his stiff member. You lower yourself to where his cock is just barely pressed against your entrance and stop, teasing him. He seems to know exactly what you’re doing, and he isn’t amused.");
                this.outputText("\n\n\"<i>Come on, " + this.player.short + ". There’s no sense in teasing me like this. You want to get started as much as I do, and you know I’m right.</i>\"");
                this.outputText("\n\nPablo isn’t wrong. What a smart imp-morph he is! And for being so smart, you figure that now would be the appropriate time to give him exactly what he wants. So, without further ado, you impale yourself upon Pablo’s pulsating rod. It feels just as wonderful as you imagined. It’s clear how your partner feels about you, too. For the brief moment that they were open, you could see his eyes rolling into the back of his head.");
                this.player.cuntChange(20, true, true, true);
                this.outputText("\n\nAt first, you start out slow, gyrating your hips at a steady pace, but you aren’t able to keep this pace for long. The sensation of Pablo’s twitching prick inside you is already close to driving you off the edge. Judging by your partner’s rapid breathing, he isn’t very far off himself. At this point, the both of you are rutting like animals. Any gym-goers who come in for a shower are sure to get an earful of the lewd sounds of your lovemaking. Pablo is the first to lose it, releasing a guttural moan as he fills you to the brim with his seed. You follow soon after, your rapidly-clamping inner walls milking his pecker for all that its worth" + (this.player.hasCock() ? " while your " + this.player.cockDescript() + " shoots jism all over his belly" : "") + ". You both have no choice but to rest for a moment, taking a much needed breather.");
                this.outputText("\n\nPablo finally speaks up, his breathing still labored. \"<i>That was amazing, " + this.player.short + ". I don’t think I’ve ever cum that quickly before. You can get off of me now.</i>\"");
                this.outputText("\n\nYou waste no time in returning him to the ground, allowing the both of you to clean up under the running water. Pablo exits the stall, drying off and wrapping his towel around his waist. You follow suit. Before leaving, he gives you one last hug and kiss.");
                this.outputText("\n\n\"<i>Thank you, lover. I couldn’t have asked for better.</i>\"");
            }
        }
        else {
            this.outputText("Pablo eyeballs you with a look of confusion as you lay down on the floor of the shower stall, scratching his head. He doesn’t seem to be taking the hint. You can’t help but chuckle at his confusion. You would think that he’d know what you were getting at. Still, you expose yourself to him, and that’s all it takes for it to sink in.");
            this.outputText("\n\n\"<i>You actually want me to lead?</i>\" the imp-morph asks. \"<i>Wow, and I thought you would be the one taking charge. That’s not a bad thing, though. I’ll do it. I just wasn’t expecting it.</i>\"");
            this.outputText("\n\nPablo is hovering over you now, clearly thinking to himself. You can only guess that he’s trying to figure out exactly what he wants to do here. He grabs onto your naked body for support, effectively mounting you..");
            this.outputText("\n\n\"<i>You know, I might be far from a stranger to sex, but I still want to be sure that I’m not hurting you when we do this. If I start to get carried away, please tell me.</i>\"");
            this.outputText("\n\nYou let out a chuckle at Pablo’s concern for your well-being. You tell him that you’ll be just fine, playfully messing with his wet hair. He smiles at you, his tail swishing about happily.");
            this.outputText("\n\n\"<i>Alright, " + this.player.short + ", if you say so,</i>\" the imp-morph replies. His throbbing cock is already lined up with your [vagina], its dribbling cock pressed against your waiting entrance. \"<i>I hope you’re ready for this, because I’m going in!</i>\"");
            this.outputText("\n\nAnd go in he does! Despite your best efforts, you can’t help but sigh dreamily at the sensation of Pablo’s wonderful cock making itself at home in your warm folds. He’s only been inside you for a moment, and already he feels absolutely magnificent! You’ll have to do everything in your power to be sure that this lovemaking session goes on for as long as humanly possible.");
            this.player.cuntChange(20, true, true, true);
            this.outputText("\n\nAt first, the imp-morph start out slow, pistoning in and out of you at a steady pace, but he isn’t able to keep this pace for long. The heavenly feeling your sweet muff is providing him is already beginning to drive him off the edge. You aren’t very far off yourself, and you greatly encourage him to go faster. He happily obliges. At this point, the both of you are rutting like animals. Any gym-goers who come in for a shower are sure to get an earful of the lewd sounds the both of you are making. Pablo is the first to lose it, releasing a guttural moan as he fills you to the brim with his seed. You follow soon after, your rapidly-clamping inner walls milking his pecker for all that it’s worth. You both have no choice but to rest for a moment, taking a much needed breather.");
            this.outputText("\n\n\"<i>That was great, " + this.player.short + ",</i>\" he finally speaks up. \"<i>I don’t think I’ve ever cum that quickly before.</i>\"");
            this.outputText("\n\nWhat’s he talking about, you ask. He did all the work after all. Pablo chuckles bashfully as you point this out.");
            this.outputText("\n\n\"<i>I guess you’re right, but I still had a great time. That’s all that matters, right? Oh, and before I forget. Thanks, lover.</i>\"");
            this.outputText("\n\nWith that, the imp-morph leaves, allowing you to finish cleaning yourself up before returning to camp.");
        }
        this.flags[kFLAGS.PABLO_USED_YOUR_PUSSY]++;
        this.pabloAffection(5);
        this.player.orgasm();
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    private pabloButtsecksSubMenus(): void {
        this.clearOutput();
        this.outputText("How shall your " + this.player.assDescript() + " be used? Do you take charge or let him lead?");
        this.menu();
        this.addButton(0, "Take Charge", this.pabloButtSecks, true, undefined, undefined, "You'll take charge and give him vaginally.", "Take Charge");
        this.addButton(1, "Pablo Leads", this.pabloButtSecks, false, undefined, undefined, "You'll let Pablo lead and he'll take your dick vaginally.", "Pablo Leads");
    }
    private pabloButtSecks(inCharge: boolean): void {
        this.clearOutput();
        if (inCharge) {
            this.outputText("Pablo eyeballs you with a look of confusion as you lay down on the floor of the shower stall, scratching his head. He doesn’t seem to be taking the hint. You find yourself chuckling at his confusion. You would think that he’d know what you were getting at. Still, you expose your [ass] to him, wiggling it enticingly, and that’s all it takes for it to sink in.");
            this.outputText("\n\n\"<i>Oh… Oh! So you want me to put it in there? Up your bum?</i>\"");
            this.outputText("\n\nPablo can’t help but chuckle at his own comment. Though it’s funny to you as well, you still shake a finger at him in response, scolding him playfully. He should keep his mouth shut and put it in already, lest he’s willing to be teased back.");
            this.outputText("\n\n\"<i>Okay, okay, if you say so,</i>\" the imp-morph responds to your scolding. \"<i>Alright, " + this.player.short + ", prepare thine anus!</i>\"");
            this.outputText("\n\nJust as the tip of Pablo’s eager cock presses against your entrance, you move, denying him entry. The imp-morph gasps in surprise, an obvious disappointment evident in his voice. He backs away from you with a raised eyebrow, crossing his arms.");
            this.outputText("\n\n\"<i>Come on, " + this.player.short + ". What are you doing?</i>\" he asks.");
            this.outputText("\n\nYou warned him, didn’t you? With a smirk on your face, you remind him how you told him to cut out the witty banter unless he was willing to be on the receiving end of the teasing. So here he is, on the receiving end of the teasing. You burst into laughter as Pablo shakes his head at you.");
            this.outputText("\n\n\"<i>You and I both know that you want to get this started as much as I do,</i>\" he says. He’s not wrong. \"<i>I’m gonna try again, and please don’t move this time!</i>\"");
            this.outputText("\n\nWell, he did say please. That was nice of him. Alright, you suppose that you’ve made him wait long enough. Pablo mounts you once again, and this time, you make no effort to stop him as he slips past your anal ring.");
            this.player.buttChange(20, true, true, true);
            this.outputText("As hard as it must be for him, he stays still for now, making absolutely sure that you’re ready. You tell him that you’ll be just fine and give him the okay to go ahead. Pablo nods in response, and wastes no time in getting started.");
            this.outputText("\n\nAt first, the imp-morph start out slow, pistoning in and out of you at a steady pace, but he isn’t able to keep this pace for long. The heavenly feeling your sweet ass is providing him is already beginning to drive him off the edge. You aren’t very far off yourself, and you greatly encourage him to go faster. He happily obliges. At this point, the both of you are rutting like animals. Any gym-goers who come in for a shower are sure to get an earful of the lewd sounds the both of you are making. Pablo is the first to lose it, releasing a guttural moan as he fills you to the brim with his seed. You follow soon after, reflexively clamping down on his hot, throbbing pecker. The both of you have no choice but to rest for a moment, taking a much needed breather.");
            this.outputText("\n\n\"<i>That was great, " + this.player.short + ",</i>\" he finally speaks up. \"<i>I don’t think I’ve ever cum that quickly before.</i>\"");
            this.outputText("\n\nWhat’s he talking about, you ask. He did most of the work after all. Pablo chuckles bashfully as you point this out.");
            this.outputText("\n\n\"<i>I guess you’re right, but I still had a great time. That’s all that matters, right? Oh, and before I forget. Thanks, lover.</i>\"");
            this.outputText("\n\nWith that, the imp-morph leaves, allowing you to finish cleaning yourself up before returning to camp.");
        }
        else {
            this.outputText("Pablo eyeballs you with a look of confusion as you lay down on the floor of the shower stall, scratching his head. He doesn’t seem to be taking the hint. You find yourself chuckling at his confusion. You would think that he’d know what you were getting at. Still, you expose your [ass] to him, wiggling it enticingly, and that’s all it takes for it to sink in.");
            this.outputText("\n\n\"<i>Oh… Oh! So you want me to put it in there? Up your bum?</i>\"");
            this.outputText("\n\nPablo can’t help but chuckle at his own comment. You would tell him to cut it out, but you find it pretty funny yourself. For now, you’ll let the imp-morph have his fun. He quickly mounts you, gripping the sides of your [ass] for support.");
            this.outputText("\n\n\"<i>Alright, " + this.player.short + ", prepare thine anus! I’m going in!</i>\" Pablo announces for all to hear.");
            this.outputText("\n\nHe quickly slips past your anal ring, hardly giving you any time to react.");
            this.player.buttChange(20, true, true, true);
            this.outputText("As hard as it must be for him, he stays still for now, making absolutely sure that you’re ready. You tell him that you’ll be just fine and give him the okay to go ahead. Pablo nods in response, and wastes no time in getting started.");
            this.outputText("\n\nAt first, the imp-morph start out slow, pistoning in and out of you at a steady pace, but he isn’t able to keep this pace for long. The heavenly feeling your sweet ass is providing him is already beginning to drive him off the edge. You aren’t very far off yourself, and you greatly encourage him to go faster. He happily obliges. At this point, the both of you are rutting like animals. Any gym-goers who come in for a shower are sure to get an earful of the lewd sounds the both of you are making. Pablo is the first to lose it, releasing a guttural moan as he fills you to the brim with his seed. You follow soon after, reflexively clamping down on his hot, throbbing pecker. The both of you have no choice but to rest for a moment, taking a much needed breather.");
            this.outputText("\n\n\"<i>That was great, " + this.player.short + ",</i>\" he finally speaks up. \"<i>I don’t think I’ve ever cum that quickly before.</i>\"");
            this.outputText("\n\nWhat’s he talking about, you ask. He did most of the work after all. Pablo chuckles bashfully as you point this out.");
            this.outputText("\n\n\"<i>I guess you’re right, but I still had a great time. That’s all that matters, right? Oh, and before I forget. Thanks, lover.</i>\"");
            this.outputText("\n\nWith that, the imp-morph leaves, allowing you to finish cleaning yourself up before returning to camp.");
        }
        this.flags[kFLAGS.PABLO_USED_YOUR_PUSSY]++;
        this.pabloAffection(5);
        this.player.orgasm();
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public pabloGetsGrossedOutByWorms(): void {
        // clearOutput();
        this.outputText("\n\nAs you contemplate just how you want to go about fucking the imp-morph, he jumps backwards, reeling in shock. What’s got him so frightened? He points at your already-erect penis, finger shaking. It doesn’t take long for you to see what the big deal is. You look down at yourself just in time to see a worm inching its way out of the tip of your pecker. It falls to the floor with a splat and is flushed down the drain.");
        this.outputText("\n\n\"<i>Worms!</i>\" Pablo exclaims, gagging. In that moment, his stiff dick went immediately limp. \"<i>I… I’m sorry, " + this.player.short + ". I don’t think I can be with you like this, with those things. I don’t want to get them too!</i>\" The imp-morph heads for the shower stall exit, but stops for a moment, sighing. He turns to face you. \"<i>This doesn’t mean that I don’t want to be with you at all, though. I do! Just… Come see me if you get rid of those worms, then we can do it!</i>\"");
        this.outputText("\n\nWith that, he makes his leave. You swear you could hear him whisper, \"<i>please get rid of them,</i>\" on his way out. He must have really wanted to do this. You can feel his disappointment. You were really looking forward to this yourself. Still, you suppose that it’s not worth dwelling on, and finish your shower before heading back to camp.");
        this.pabloAffection(-10);
        this.flags[kFLAGS.PABLO_FREAKED_OUT_OVER_WORMS] = 1;
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    public pabloComesBackAfterWormCure(): void {
        this.spriteSelect(SpriteDb.s_pablo);
        this.clearOutput();
        this.outputText("Pablo’s eyes light up as you approach him. He’s clearly happy to see you. But why does he avoid eye contact as you draw closer. What’s got him so bothered? Maybe he’s embarrassed over what happened between the two of you in the showers?");
        this.outputText("\n\n\"<i>Oh, hey " + this.player.short + ",</i>\" he greets you, tail limp. \"<i>I’m… Ah, sorry about before. I really did want to, you know, do it. It’s just… The worms! Whoa, wait a minute. Did you, by chance, come back because you got rid of them?</i>\"");
        this.outputText("\n\nIn that moment, the cheerful gleam in his eyes returns, his tail swishing to and fro happily. Indeed, you have gotten rid of the worms, and you’re more than willing to pick up where you left off. Pablo is positively beaming at this development. It’s hard to say for certain, but you swear that you can make out the beginnings of an erection in his shorts.");
        this.outputText("\n\n\"<i>Wow, " + this.player.short + ", that’s great!</i>\" the imp-morph exclaims, already heading for the showers. \"<i>Come on, let’s go!</i>\"");
        this.outputText("\n\nHe really is an eager one, isn’t he? As you make your way to the showers, you consider how to tackle this. Should you take charge, or let Pablo run the show? What parts will you use?");
        this.pabloAffection(10);
        this.flags[kFLAGS.PABLO_FREAKED_OUT_OVER_WORMS] = 0;
        this.pabloSexMenu();
    }

}
