import { TelAdreAbstractContent } from "./TelAdreAbstractContent";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { rand } from "../../../Extra";
import { Tail } from "../../../BodyParts/Tail";

// NECESSARY FLAGS:
// 263 - Met nancy
// 264 - Nancy relationship level
// 265 - Talk Nancy
// 266 - Times boned
export class AuntNancy extends TelAdreAbstractContent {

    // [Introduction Blurb:
    // (appears in the Wet Bitch between 6:00 and 14:00)]
    public auntNancy(display: boolean = true): boolean {
        if (this.getGame().time.hours >= 6 && this.getGame().time.hours <= 14) {
            if (display) {
                this.outputText("\n\nYou see a rather buxom woman with short, white hair in a neck- and sleeve-less black dress cleaning glasses with her bar towel.  She makes the task look simple, moreso because she has two pairs of arms, wrapped in what look like shiny black gloves.");
                // [If MetNancy = 0]
                if (this.flags[kFLAGS.NANCY_MET] == 0) this.outputText("  She");
                else this.outputText("  Aunt Nancy");
                this.outputText(" glances up at you and smiles as you enter");
                // [(if unmet)
                if (this.flags[kFLAGS.NANCY_MET] == 0) this.outputText(", and you see that she has additional red eyes spread across her forehead");
                this.outputText(".");
            }
            return true;
        }
        else return false;
    }

    public interactWithAuntNancy(): void {
        this.clearOutput();
        // [Interaction 2]
        // [If Time = 1400, Relationship with Aunt Nancy >= 30, and PillowTalk= 0]
        if (this.flags[kFLAGS.NANCY_RELATIONSHIP_LEVEL] >= 30 && this.getGame().time.hours == 14 && this.flags[kFLAGS.NANCY_TIMES_BONED] == 0) {
            this.outputText("As you enter the bar, looking forward to spending some time with Aunt Nancy, you see that she is cleaning up and getting ready to leave.  She spots you with one of her eyes and smiles, waving you closer with a single hand as the other three set glasses under the bar.\n\n");

            this.outputText("\"<i>Afternoon, friend!</i>\" she says, cheerily.  \"<i>You've certainly been coming in a lot, and I can't say I don't appreciate your company.</i>\"  Aunt Nancy looks you over a little, smiling a little more wistfully and melancholically now.  \"<i>You remind me a little of my husband,</i>\" she admits, finishing up and skittering out from behind the bar on her many legs as the afternoon shift bartender takes her place.  \"<i>It's... nothing I can put my finger on.  Just, you have a certain... <b>quality</b> to you.</i>\"\n\n");

            this.outputText("Aunt Nancy sighs.  \"<i>Sorry. I don't mean to bore you with an old woman's rambling.  I... I just miss him, so much, and I get a little... lonely, sometimes.</i>\"  She looks at you, with a strange, half-hungry, half-desperate look in her eyes.  \"<i>Would you mind... coming home with me?  You seem a little tense, and I'd like to give you a massage.</i>\"\n\n");
            // [Gain 20 Lust.] (I remain steadfastly unaroused; maudlin self-pity isn't sexy.  -Z)
            this.dynStats("lus", 10);
            this.menu();
            this.addButton(0, "Agree", this.timeForAuntNancySpiderCooch);
            this.addButton(1, "Decline", this.declineAuntNancyMassage);
        }
        // [If Time >= 1400 - (100*(Relationship with Aunt Nancy/30), Relationship with Aunt Nancy >= 30, and PillowTalk= 1]
        else if (this.flags[kFLAGS.NANCY_RELATIONSHIP_LEVEL] >= 30 && this.getGame().time.hours >= (14 - (this.flags[kFLAGS.NANCY_RELATIONSHIP_LEVEL] / 30)) && this.flags[kFLAGS.NANCY_TIMES_BONED] > 0) {
            this.outputText("Aunt Nancy looks up as you walk over to her, and her eyes light up.  Happily, she greets you with a prim little hand atop yours, a bit of evidence of the intimacy you've shared.\n\n");

            this.outputText("\"<i>Couldn't stay away, could you friend?</i>\" she asks, quietly, a sexy smile on her lovely face.  \"<i>What'll it be? Do you want a drink...</i>\"  The spider-lady leans her white-haired head next to your ear conspiratorially, and whispers, \"<i>Or, do you want me to get off early and give you a little... massage?</i>\"  You shiver at her words.\n\n");
            this.menu();
            // [Choice: Strong, Light, Agree, Decline]
            if (this.pc.gems < 5) {
                this.addDisabledButton(0, "Strong", "You can't afford it!");
                this.addDisabledButton(1, "Light", "You can't afford it!");
            } else {
                this.addButton(0, "Strong", this.strongStuff);
                this.addButton(1, "Light", this.lightStuff);
            }
            this.addButton(5, "Massage", this.timeForAuntNancySpiderCooch);
            this.addButton(14, "Back", this.declineAuntNancyMassage);
        }
        // [Interaction 1]
        // If Relationship with Nancy < 30
        else {
            this.outputText("You decide to talk with the bartender, and walk right up to the bar.  She sees you coming, and folds her towel up with her first pair of hands, while putting the glass she was polishing away with the other.\n\n");

            this.outputText("\"<i>Welcome to the Wet Bitch.  My name's Aunt Nancy, and I'll be your server this morning.</i>\"  She smiles.  \"<i>Well, what'll it be, friend?</i>\" the bartender asks, her voice rich and velvety rather than cute as she leans on the bar, giving you a good look at her cleavage.  \"<i>Bit early in the day for the strong stuff, I reckon.</i>\"\n\n");
            // [If MetNancy < 1, MetNancy += 1]
            if (this.flags[kFLAGS.NANCY_MET] < 1) this.flags[kFLAGS.NANCY_MET] = 1;
            this.menu();
            // [Choice: Strong, Light]
            if (this.pc.gems < 5) {
                this.addDisabledButton(0, "Strong", "You can't afford it!");
                this.addDisabledButton(1, "Light", "You can't afford it!");
            } else {
                this.addButton(0, "Strong", this.strongStuff);
                this.addButton(1, "Light", this.lightStuff);
            }
            this.addButton(14, "Leave", this.telAdre.barTelAdre);
        }
    }

    // [Strong:]
    private strongStuff(): void {
        this.clearOutput();
        // [Lose 5 Gems.]
        if (this.player.gems < 5) {
            this.outputText("You start to ask for a strong drink and then remember you can't afford it.");
            // Do next
            this.doNext(this.interactWithAuntNancy);
            return;
        }
        this.dynStats("tou", 1, "int", -1, "lus", 15);
        this.player.gems -= 5;
        this.statScreenRefresh();
        this.outputText("You ask for a strong drink anyway, and Aunt Nancy nods.  Easily, she picks up a glass with one hand, reaches out with another two, and fills it with something greenish.\n\n");

        this.outputText("The bartender sees your gaze and smiles.  \"<i>Heavy mead,</i>\" she explains, hefting it.  \"<i>We make it from honeybee honey.  Have a taste, friend.</i>\"\n\n");

        this.outputText("You pay a few gems and take a sip.  The alcohol burns a bit, but it tastes deliciously, achingly sweet, and before you know it the glass is empty.\n\n");

        // [(If Toughness is >= 30)]
        if (this.player.tou100 >= 30) {
            this.outputText("It was good, but it seems to have gone straight to your head with surprising speed, giving you a pleasant buzz after only one glass. It might be a prudent idea to walk it off before you get another.  You thank Aunt Nancy for the drink, before climbing to your " + this.player.feet() + " and leaving.  She eyes you respectfully as you go.");
            // [+10 Relationship with Aunt Nancy]
            this.flags[kFLAGS.NANCY_RELATIONSHIP_LEVEL] += 10;
        }
        // [Else]
        else {
            this.outputText("Wow, that one took it out of you.  You're pretty sure you don't want to try to have another.  Feeling a little wobbly, you thank the bartender for the drink, and unsteadily stagger out of the shop.  As you leave, you hear Aunt Nancy giggling, and out of the corner of your eye, you see her bunched up, one hand over her mouth as she chuckles, amused at your inability to hold your liquor.");
            // [+5 Relationship with Aunt Nancy]
            this.flags[kFLAGS.NANCY_RELATIONSHIP_LEVEL] += 5;
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    // [Light:]
    private lightStuff(): void {
        this.clearOutput();
        // [Lose 5 Gems.]
        if (this.player.gems < 5) {
            this.outputText("You start to ask for a light drink and then remember you can't afford it.");
            // Do next
            this.doNext(this.interactWithAuntNancy);
            return;
        }
        this.player.gems -= 5;
        this.dynStats("tou", .5, "int", -.5, "lus", 7);
        this.outputText("You don't feel like throwing back a really heavy drink this early, come to think, and instead ask for something light.  Aunt Nancy nods and pours you something thin and bright yellow from out of a barrel behind her, giving you a good look at her from behind.  Her lower half seems to stick out behind her in a long stretch of black chitin, with several long, thick legs supporting it.");
        // [If Intelligence >= 20]
        if (this.player.inte >= 20) this.outputText("  You realize that what look like almost-shoulder-length gloves over her hands must actually be shell-like portions of this exoskeleton.");
        this.outputText("\n\n");

        this.outputText("Once she gives you the drink, you take a tentative sip, and find it very sweet and refreshing, without seeming very strong or alcoholic.  It's very good, and you quickly have another.  ");

        // [If FirstTalkNancy = 0]
        if (this.flags[kFLAGS.NANCY_TIMES_TALKED] == 0) {
            this.flags[kFLAGS.NANCY_TIMES_TALKED]++;
            this.outputText("\"<i>So,</i>\" she says, settling one set of arms on the bar and supporting her head with the other, \"<i>what's your story, friend?  You have a certain...</i>\" Aunt Nancy waves with a hand. \"<i>look about you.  Like my late husband, Marae send him to his reward.  You're an... adventurer, I take it?  You live off the land, fighting monsters for gems, scavenging all your equipment off what you can find or put together yourself?</i>\"\n\n");

            this.outputText("You nod, hesitantly, remembering that here, at least, you're in no danger from demons.\n\n");

            this.outputText("\"<i>Wonderful!</i>\" she says enthusiastically, spreading her upper set of arms. \"<i>I reckon that means that you've got quite a few stories on you, friend. Feel like sharing?</i>\" The drink, despite its low alcohol content, has still left you feeling a little chatty, and you eagerly tell her about your adventures.\n\n");
            /*[If Corruption < 30]
            You tell Aunt Nancy about a too-close experience you had once fighting with the tentacle beast in the woods. It swung at you with powerful blows and tried to snatch you up with its mighty tendrils, but you kept out of its reach and wore it down until it was almost too exhausted to keep fighting, knocking off a tentacle or two whenever it faltered. In the end, you managed to lure it into a trap, where it got stuck, and peppered it with arrows until it collapsed and began to fade to yellow, then brown, in death. You howled in victory, and tore the creature open to scavenge valuable gems from its, taken from its previous, less lucky victims.

            [If Corruption is 75 >= 30]
            You tell Aunt Nancy about a past run-in with a sand witch, how the creature and you started by trading blows before she stuck... something up your ass, something oddly pleasant that filled your body with need and sapped your will. In a rage, you fought back, throwing yourself against her defenses with all your might, until, on the very cusp of orgasm, you knocked her flat with a right hook to her head. As she lay on the ground, you, on fire with lust, simply took her. She fought for a bit, but, soon, she started really getting into it, before, finally, you both came, explosively, and you staggered off, helping yourself to her gear in the process.

            [If Corruption is >=75]
            You tell Aunt Nancy about a fight you once got into with a minotaur in the mountains. The beast was much stronger and better-armed than you, carrying a massive battle axe, but it was also sexually ravenous, and barely able to conceal its gigantic member and swollen testicles. You tempted the poor creature with flashes of your own most intimate places and flirty stares, inflaming its already overstimulated sexual instincts without even touching it, and always keeping just out of reach of its grasping hands and deadly axe. Ultimately, the minotaur simply collapsed, desperately trying and failing to vent the unthinkable pressure building in its swollen nuts, and you left it there, cruelly, with a smirk of evil satisfaction.

            (it would be better to limit these to things to things the PC is guaranteed to have encountered (the entrance to T'A if pure, Zetaz's intro if middling, or some tawdry flirting if corrupt), or else make up urbane shit about his reflections on the world. Failing that, I'd say cut them to avoid space-time paradox and internet bitchery, not last in line will be my own. -Z)
            */

            this.outputText("You tell her of some of your recent exploits in the demon realm.  Like most stories in this strange land, it ends up focusing on the strange, perverted sexuality of the monsters that dwell here, but she doesn't seem to mind.\n\n");

            this.outputText("The bartender listens, entranced, and reacts on all the right beats, her bosom bouncing on the particularly shocking ones.  When you're done, she smiles at you, and says, \"<i>Well, that was quite a tale.  Let me tell you one...</i>\"\n\n");

            this.outputText("Aunt Nancy pours herself a glass of the same drink you're having, and gulps down a long pull.\n\n");

            this.outputText("\"<i>Well,</i>\" she begins, \"<i>I wasn't always a bartender.  I grew up in a cave, after all.  My people used to get prey to wander into our webs so we could eat them, or you know,</i>\" the bartender smiles lustfully, \"<i>indulge ourselves, if they were cute.  That was how I met him.  He was one of the folk from another world, ");
            // [If PC is human:]
            if (this.player.humanScore() >= 4) this.outputText("like you,");
            else this.outputText("like poor little Yara at the earring shop,");
            this.outputText(" and, well, one thing led to another, and I ended up chasing him out into the wider world.</i>\"\n\n");

            this.outputText("Aunt Nancy sighs, dreamily.  \"<i>Oh, the adventures we had together, friend!  We'd wrestle over ancient treasures, fight midst old ruins, argue over who actually finished off that omnibus, fuck like rabbits and then insist that the other one came first.</i>\"  She seems to be staring off into midair, a wistful smile on her face.  \"<i>Marae on earth, how I miss him.  It's been almost a decade now, since I last saw him.  Somedays, I still think he'll just... walk in here, with that cocky smile on his face and that shiny old magic sword over his shoulder and make a pun.</i>\"\n\n");

            this.outputText("She takes another drink, melancholically, before shaking her head to clear it.  \"<i>Well, thank you for sharing some time with an old widow like me.</i>\"  She flutters her still-beautiful eyelashes at you once or twice, then chuckles.  \"<i>Come back some time.</i>\"\n\n");

            // [50% chance to gain 1-2 Intelligence, +20 Relationship with Aunt Nancy, FirstTalkNancy += 1]
            if (rand(2) == 0) this.dynStats("int", 1 + rand(2));
            this.flags[kFLAGS.NANCY_RELATIONSHIP_LEVEL] += 20;
        }
        // [Else:]
        else {
            this.outputText("As you sip your drink, you and Nancy swap adventuring stories for a while, enjoying one another's company in the fairly quiet bar.  The older spider-lady is a good conversationalist, and you feel a little closer for having shared some time with her.");
            // [50% chance to gain 1-2 Intelligence, +10 Relationship with Aunt Nancy]
            if (rand(2) == 0) this.dynStats("int", 1 + rand(2));
            this.flags[kFLAGS.NANCY_RELATIONSHIP_LEVEL] += 20;
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [If Decline]
    private declineAuntNancyMassage(): void {
        this.clearOutput();
        this.outputText("Aunt Nancy listens as you politely turn her down, and nods her head, the hungry look fading from her eyes.  \"<i>I understand completely.  Sorry to have bothered you.</i>\"  She starts to walk out of the bar, stops, and turns back to size you up again.  \"<i>Of course,</i>\" she says, \"<i>if you ever change your mind... just come by whenever my shift's over.</i>\"\n\n");

        this.outputText("Aunt Nancy raises one of her black-covered hands in front of her mouth, and blows you a kiss before scuttling away.");
        // [Gain 20 Lust.]
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [If Agree]
    private timeForAuntNancySpiderCooch(): void {
        this.clearOutput();
        this.outputText("You look the still-beautiful spider-lady in the eye, and, half-mesmerized, nod in agreement.  She smiles broadly (and, you can't help but notice, quite lewdly) and puts one of her lower arms through one of yours, while putting the upper one on your shoulder.  \"<i>Well then,</i>\" Aunt Nancy says, \"<i>I suppose we should be off.</i>\"\n\n");

        this.outputText("She leads you through the streets of Tel'Adre, weaving through crowds and back alleys, before you finally end up just outside a modest little adobe building tucked away in a side street.  Slowly, she wraps all four of her arms around you, giving you a gentle hug");
        if (this.player.biggestTitSize() >= 1) this.outputText(" and taking the opportunity to grope your " + this.player.allBreastsDescript() + " right through your " + this.player.armorName);
        this.outputText(".\n\n");

        this.outputText("\"<i>Come into my parlor,</i>\" she whispers into your ear, licking it gently before sticking the tip of her long tongue into the hole before pressing her soft lips against the lobe of it.\n\n");

        this.outputText("Then, she lets go of you and skitters easily up to her door, opening it and slipping inside.");
        // [Gain 30 Lust, New Page]
        this.player.lust += 29;
        this.dynStats("lus", 1);
        this.doNext(this.auntNancyPoonPartII);
    }
    private auntNancyPoonPartII(): void {
        this.clearOutput();
        this.outputText("Slowly, you follow Aunt Nancy into her home. Inside, the building is fairly dark and gloomy, even in the middle of the day, with thick curtains of unidentifiable white matter keeping most of the sun outside. Blinded, your vision still attuned to the bright desert, you can discern little of the house's insides before you hear a sudden skittering sound behind you and, as you turn to face it, are pushed further into the gloom. Your heel is caught by a thick strand of what feels like rope, and you fall flat onto your back, arms and legs splayed out to either side of you, as you land on some sort of taut net.\n\n");

        this.outputText("You try to climb back up, only to find that your flesh and " + this.player.armorName + " alike are caught fast against the adhesive matter of the net, which, you suddenly realize, is actually a thick web, spread across the house's floor. You feel a surge of panic and begin to pull and struggle, when suddenly you feel a smooth, cool hand on your face. Your night vision is beginning to recover, and you make out Aunt Nancy's face, her pale skin seeming to glow in the gloom, as she leans over you, staring into your eyes with hers, one finger trailing across your face before covering your lips in a gesture for quiet.\n\n");

        this.outputText("With her other three hands, the spider-lady lights a match and ignites a little lantern, which she raises to hang from the wall.  In the little area it illuminates, you can see that Aunt Nancy has removed her neck-less black dress, letting her impressive bosom bounce modestly as she works, and catch a glimpse of her unusual genitals before she turns to face you again.\n\n");

        // [If PillowTalk = 0]
        if (this.flags[kFLAGS.NANCY_TIMES_BONED] == 0) this.outputText("\"<i>It's... been a long, long time,</i>\" murmurs Aunt Nancy, her throaty voice washing over you, as two of her hands rest on your " + this.player.chestDesc() + " and the other two wrap carefully around your shoulders and neck, gently rubbing you in the promised massage.  She's crawling along the web, her many feet easily avoiding the sticky parts, and her face is mere inches from yours.  You can smell her sweet, slightly alcohol-scented breath as her many eyes look down at you.  \"<i>I haven't... been with anyone since I lost my husband, and... well... I... I need this.  Will you please be with me, if only for a little while?</i>\"\n\n");
        else this.outputText("\"<i>Are you ready for me, friend?</i>\" murmurs Aunt Nancy, her throaty voice washing over you, as two of her hands rest on your " + this.player.chestDesc() + " and the other two wrap carefully around your neck and shoulders, gently rubbing you in the promised massage. She's crawling along the web, her many feet easily avoiding the sticky parts, and her face is mere inches from yours. You can smell her sweet, slightly alcohol-scented breath as her many eyes look down at you.  \"<i>I certainly am, little fly.</i>\"\n\n");

        this.outputText("Quietly, mesmerized by her needy red eyes, you nod.  Aunt Nancy smiles demurely.  \"<i>Good,</i>\" she purrs, and lowers her lips to yours.  You weren't quite sure what to expect, but her lips are soft and gentle as she presses them on you.  Her tongue gently snakes into your mouth, wrapping around yours with ease, and her sweet-tasting saliva is soon sliding down your throat.  Instantly, you feel your body loosening up, and ");
        // [Intelligence > 40]
        if (this.player.inte > 40) this.outputText("realize that the spit must contain some kind of chemical originally meant to still prey");
        else this.outputText("question whether or not the spider-lady's kiss is responsible");
        this.outputText(".\n\n");

        this.outputText("As you unwind at her touch, her many arms are working to strip away your " + this.player.armorName + ", gently peeling them away with care until you are naked and needy in the spider-lady's web.\n\n");

        this.outputText("You are soon hanging in utter relaxation, idly wondering whether the ongoing massage Aunt Nancy's many hands are still performing all over your " + this.player.chestDesc() + ", " + this.player.buttDescript() + ", back, and neck, or the loving, strange kiss of her lips and long, curling tongue is more responsible.  Ultimately, however, she pulls her white-haired head away from yours, and removes her many hands from your trunk.  Smiling at your sudden unhappy look, Aunt Nancy begins to kiss her way down your body, first along the curve of your neck, sliding her long, moist tongue against your chest as you shiver in pleasure at the sensation and pressing her soft lips against your " + this.player.nippleDescript(0) + "s and nibbling gently on them to enjoy your moans of delight, before moving her head down your belly");
        if (this.player.tail.type > Tail.NONE) this.outputText(" to the top of your tail");
        this.outputText(".\n\n");

        // [If a naga]
        if (this.player.isNaga()) this.outputText("Gently, she peels away the fold of skin that disguises your genitals, now moist-and-dripping with anticipation.  ");
        this.outputText("Aunt Nancy licks her lips, a hungry look in her many eyes as she look down at you, clearly quite pleased by what she sees.\n\n");

        // [If you have balls:]
        if (this.player.balls > 0) {
            this.outputText("She smiles at the sight of your " + this.player.ballsDescriptLight() + ", gently raising two of her hands to fondle and squeeze them as her soft lips press against them, ");
            // [If BallSize allows]
            if (this.player.ballSize < 15) {
                if (this.player.ballSize > 5 && this.player.ballSize < 15) this.outputText("taking one");
                else this.outputText("both of them");
                this.outputText(" into her mouth to soak in her saliva as she wraps and caresses ");
                if (this.player.ballSize <= 5) this.outputText("them");
                else this.outputText("it");
                this.outputText(" with her long, dextrous tongue.\n\n");
            }
            else this.outputText("kissing and licking at them with those moist, relaxing lips.\n\n");
        }

        // [If you have a vagina:]
        if (this.player.hasVagina()) {
            this.outputText("The spider lady ");
            if (this.player.balls > 0 && this.player.hasCock()) this.outputText("lifts away your other \"<i>equipment</i>\" and ");
            this.outputText("examines the folds of your " + this.player.vaginaDescript(0) + ".  You shiver at the sensation of one of her smooth, cold hands rubbing against your folds, the tips of her fingers sliding into you.  Aunt Nancy smiles up at you, enjoying your reaction.  \"<i>Did you like that?</i>\" she asks with her deliciously throaty voice, and you nod enthusiastically.  \"<i>Good...</i>\" she purrs, before slipping her long, slippery tongue inside of you.  You cry out in sudden surprise at the sudden feeling of it moving inside of you, exploring your shape, before she pulls it out as you squirm.  \"<i>Mmmmmm...</i>\" Aunt Nancy murmurs.  \"<i>You taste goood, friend.</i>\"\n\n");
        }
        // [If you have a penis:]
        if (this.player.hasCock()) {
            this.outputText("Aunt Nancy gently caresses your " + this.player.multiCockDescriptLight() + " with her smooth black hands, enjoying your moans of delight, before lowering her head to kiss the head of your " + this.player.cockDescript(0) + ".  Her tongue snakes around it, and the spider-lady sucks a little, drinking up the little stream of pre-cum now leaking out, before raising her head up to look at you, a gentle smile on her face as her many hands continue to rub and explore your " + this.player.multiCockDescriptLight() + ".  \"<i>Not as good as my husband's,</i>\" she whispers, \"<i>but quite a piece, certainly.</i>\"\n\n");
        }
        // [If you have no genitals at all:]
        if (this.player.gender == 0) this.outputText("\"<i>Well, well, well,</i>\" murmurs Aunt Nancy, intrigued by what she sees.  \"<i>Very unorthodox, but we'll see what we can do.</i>\"  She pauses to lick the fleshy expanse where your genitals used to be.\n\n");

        // [All:]
        this.outputText("Two of her hands suddenly wrap themselves around the cheeks of your " + this.player.buttDescript() + ", and squeeze gently.  \"<i>Very nice,</i>\" the spider-lady whispers, and then her long tongue spools out to slide over the surface of your " + this.player.buttDescript() + ".  The tip of it even slips inside, gently, and you feel her saliva coating the inside of your bum.  It feels sensitive, and much more relaxed now than a minute ago.\n\n");

        if (this.player.hasCock()) this.outputText("Aunt Nancy rises up above you, still smiling with gentle sensuality, and reaches out.  ");
        // [If you have at least one dick, she always takes the smallest so as to avoid missing out on another scene later:]
        const x: number = this.player.shortestCockIndex();
        if (this.player.hasCock()) {
            this.outputText("Gently, she picks " + this.player.oMultiCockDesc() + ", and brings it up to her pussy. You see its entrance, two parted shell-plates dripping wet fluid, and would almost panic at the unfamiliar sight if you weren't so very relaxed.  With loving guidance, Aunt Nancy slides the full length of your " + this.player.cockDescript(x) + " deep inside of her.  Both of you moan in delight as your dick rubs and stimulates her in a way she's clearly been missing for a long, long while; her exotic insides, smooth and silky and deep, squeeze and caress your " + this.player.cockDescript(x) + " like a velvet glove.  Little feelers inside of her begin to massage your cock, and the wet, dripping fluids inside of her are just as relaxing as her saliva.\n\n");

            this.outputText("\"<i>Oooooh,</i>\" she sighs dreamily, her eyes temporarily distant and unfocused.  \"<i>Marae on earth, that hits the spot.</i>\"\n\n");
            let titFucked: boolean = false;
            const y: number = this.player.longestCock();
            // [If your longest dick is of at least auto-titfucking size:]
            if (this.player.cockTotal() >= 2) {
                if (this.player.cocks[y].cockLength >= 22) {
                    titFucked = true;
                    this.outputText("As Aunt Nancy rides you enthusiastically, the spider-lady lifts ");
                    if (this.player.totalCocks() > 2) this.outputText("another one of ");
                    this.outputText("your ");
                    if (this.player.cockTotal() == 2) this.outputText("other cock ");
                    else this.outputText("cocks ");
                    this.outputText("up to her heaving bosom, and slips it between her soft, lovely breasts.  \"<i>Want something else nice?</i>\" asks the spider-lady, eyes twinkling.\n\n");

                    this.outputText("Still rising and falling atop your body as she rides you, Aunt Nancy grips her breasts with two of her black-shelled hands and begins to slide them up and down on either side of your tall, dripping " + this.player.cockDescript(y) + ", ");
                    if (this.player.cocks[y].cockLength >= 30) this.outputText("letting its head slip into her mouth, where she sucks and licks at it hungrily, ");
                    else this.outputText("letting her long, dexterous tongue dangle down from her mouth to wrap around the head of her dick, occasionally licking at her own impressive bosom as well, ");
                    this.outputText("all the while staring down into your eyes.\n\n");

                    this.outputText("The sensation, both of her soft, pillowy bosom wrapped around your " + this.player.cockDescript(y) + " and of her skillful tongue");
                    // [If player.cockDescript (Longest Cock) is long enough for auto-fellatio]
                    if (this.player.cocks[y].cockLength >= 30) this.outputText(" and mouth");
                    this.outputText(", is incredible.  Aunt Nancy coos happily, clearly enjoying the taste.\n\n");
                }
                // [If there are still dicks left over:]
                if (this.player.cockTotal() > 2) {
                    if (this.player.cockTotal() == 3) this.outputText("Another of her hands wraps itself around your other cock");
                    else this.outputText("Her other hands wrap themselves around more of your cocks");
                    this.outputText(", milking and stroking the ");
                    this.outputText("pulsating prick");
                    if (this.player.cockTotal() > 3) this.outputText("s");
                    this.outputText(" for all ");
                    if (this.player.cockTotal() == 3) this.outputText("it's");
                    else this.outputText("they're");
                    this.outputText(" worth.\n\n");
                }
            }

            // [If PC is lactating, and there are no dicks of autotitfucking size available:]
            if (!titFucked && this.player.biggestLactation() >= 1) {
                this.outputText("As milk leaks slowly from your " + this.player.nippleDescript(0) + "s, the spider-lady notices.  She lowers her head and wraps her soft, lovely lips around the tip of one of your " + this.player.allBreastsDescript() + ", sucking gently and frantically flicking her tongue against your " + this.player.nippleDescript(0) + ".  You moan and lie back into the web, the multitude of sexual pleasures assaulting your senses almost more than you can bear as Aunt Nancy begins swallowing up your milk.\n\n");
            }
            // [If no cocks are of titfucking size and # Cocks <= 4 or if there are cocks of titfucking size and # Cocks <= 3 (If Nancy still has free hands)]
            if (!titFucked || (titFucked && this.player.cockTotal() <= 2)) {
                this.outputText("Her remaining hands gently work their way across your body, alternating between rubbing and squeezing your " + this.player.buttDescript() + ", even sometimes slipping fingers inside to probe the insides, ");
                // [If the player has balls]
                if (this.player.balls > 0) this.outputText("gently kneading and caressing your " + this.player.ballsDescriptLight() + " as the cum inside churns and boils and ");
                // [If the player has a vagina]
                else if (this.player.hasVagina()) this.outputText("exploring the folds and creases of your " + this.player.vaginaDescript(0) + " and ");
                this.outputText("massaging your " + this.player.chestDesc() + ".  Occasionally, they stroke through your " + this.player.hairDescript() + ".\n\n");
            }
        }
        // [If player has vagina but no dicks: (Nancy prefers dicks and will always choose them over lesbian sex)]
        else if (this.player.hasVagina()) {
            this.outputText("Gently, Aunt Nancy leans down to stroke your face as two of her other hands reach out and begin caressing your chest, while a fourth explores the outer folds of your " + this.player.vaginaDescript(0) + ".  \"<i>Such a pretty little fly,</i>\" the spider-lady whispers as she stares at your face, her bright red eyes full of longing.   She presses her face against the side of your head, and you gently turn it to allow her access to your ear, which she quickly slips her tongue into again, enjoying the feeling as you quiver and yelp beneath her.\n\n");

            this.outputText("With your face turned, you suddenly spot a once-well-made dildo lying on the floor beneath the web.  You see that it has been worn down as smooth as an apple rind and probably much thinner than it was before, and you suddenly wonder just how pent up the widow's sexual desires really are.\n\n");

            this.outputText("Such thoughts are interrupted when you suddenly feel Aunt Nancy's fingers on the lower half of your body again, caressing your ");
            if (this.player.tail.type > Tail.NONE) this.outputText("tail before rising to your ");
            this.outputText(this.player.vaginaDescript(0) + " and " + this.player.buttDescript() + ".  Aunt Nancy turns your head to face hers, and rises up onto her legs again as her fingers begin to sink deep into your " + this.player.vaginaDescript(0) + " and your " + this.player.assholeDescript() + ".  You moan, loudly and long at the sensation, and Aunt Nancy smiles lewdly, her other hands still exploring and squeezing your " + this.player.chestDesc() + ", rubbing and kneading them softly and occasionally pinching and pulling at your " + this.player.nippleDescript(0) + "s.\n\n");

            this.outputText("Suddenly, you realize that your left hand is now free, courtesy of one of Aunt Nancy's smooth, gentle arms.  She whispers, quietly, \"<i>A little for me too, please.</i>\"  Realizing exactly what she means, you press the " + this.player.skinFurScales() + " of your hand against her pussy.  Its entrance, two parted shell-plates dripping wet fluid, would almost be scary if you weren't so very relaxed.  Gently, your press your fingers into her body, and hear her moan, loudly, feel her own hands scrabbling inside of your " + this.player.vaginaDescript(0) + " and " + this.player.assholeDescript() + ", pawing your chest and " + this.player.buttDescript() + ", trailing through your " + this.player.hairDescript() + ".\n\n");

            this.outputText("It feels wonderful.  You lie back and moan, enjoying the smooth, silky insides of her pussy, feeling tiny feelers occasionally caress and pull at your fingers inside of her.\n\n");
            // [If PC is lactating:]
            if (this.player.biggestLactation() >= 1) this.outputText("As milk leaks slowly from your " + this.player.nippleDescript(0) + "s, the spider-lady notices. She lowers her head and wraps her soft, lovely lips around the tip of one of your " + this.player.allBreastsDescript() + ", sucking gently and frantically flicking her tongue against your " + this.player.nippleDescript(0) + ".  You moan and lie back into the web, the multitude of sexual pleasures assaulting your senses almost more than you can bear as Aunt Nancy begins swallowing up your milk.\n\n");
        }
        // [If the PC has no genitals at all:]
        else {
            this.outputText("Gently, Aunt Nancy leans down to stroke your face as two of her other hands reach out and begin stroking your " + this.player.chestDesc() + " while a fourth explores the smooth, fleshless expanse where your genitals once were.  \"<i>Such a pretty little fly,</i>\" the spider-lady whispers as she stares at your face, her bright red eyes full of longing.  She presses her face against the side of your head, and you gently turn it to allow her access to your ear, which she quickly slips her tongue into again, enjoying the feeling as you quiver and yelp beneath her.\n\n");

            this.outputText("With your face turned, you suddenly spot a once-well-made dildo lying on the floor beneath the web.  You see that it has been worn down as smooth as an apple rind and probably much thinner than it was before, and you suddenly wonder just how pent up the widow's sexual desires really are.\n\n");

            this.outputText("Such thoughts are interrupted when you suddenly feel Aunt Nancy's fingers on the lower half of your body, caressing your " + this.player.buttDescript() + " before rising again to your lack of genitals.\n\n");

            this.outputText("Smiling at the puzzle before her, Aunt Nancy gently runs her hands over your " + this.player.nippleDescript(0) + "s and " + this.player.hairDescript() + " as she thinks over how best to make love to you.  Gently, her white-haired head returns to your " + this.player.buttDescript() + ", and her long tongue snakes out again, sliding between its lobes.  As you relax, it slips inside of you, just far enough for you to moan at the nigh-sexual pleasure of total relaxation.  The spider-lady removes her tongue from your anus, much to your dissatisfaction, and carefully wipes it off on a nearby bit of cloth before returning it to her mouth, then, smiling up at your petulant expression, slips a few of her fingers into your now-loose and sensitive " + this.player.assholeDescript() + ".\n\n");

            this.outputText("Aunt Nancy climbs back atop you as you moan at the welcome new sensation, licking at your chest as she does.  \"<i>Bet you didn't think I could do it,</i>\" she purrs to you, as you enjoy the many, many sensations working at you.\n\n");

            this.outputText("Suddenly, you realize that your left hand is now free, courtesy of one of Aunt Nancy's smooth, gentle arm.  She whispers, quietly, \"<i>A little for me too, please.</i>\"  Realizing exactly what she means, you press the " + this.player.skinFurScales() + " of your hand against her pussy.  Its entrance, two parted shell-plates dripping wet fluid, would almost be scary if you weren't so very relaxed.  Gently, your press your fingers into her body, and hear her moan, loudly, feel her own hands scrabbling inside of your " + this.player.assholeDescript() + ", pawing your chest and " + this.player.buttDescript() + ", trailing through your " + this.player.hairDescript() + ".\n\n");

            this.outputText("It feels wonderful.  You lie back and moan, enjoying the smooth, silky insides of her pussy, feeling tiny feelers occasionally caress and pull at your fingers inside of her.\n\n");

            // [If PC is lactating:]
            if (this.player.biggestLactation() >= 1) this.outputText("As milk leaks slowly from your " + this.player.nippleDescript(0) + "s, the spider-lady notices. She lowers her head and wraps her soft, lovely lips around the tip of one of your " + this.player.allBreastsDescript() + ", sucking gently and frantically flicking her tongue against your " + this.player.nippleDescript(0) + ".  You moan and lie back into the web, the multitude of sexual pleasures assaulting your senses almost more than you can bear as Aunt Nancy begins swallowing up your milk.\n\n");
        }
        this.doNext(this.auntNancyPoonPartIII);
    }

    private auntNancyPoonPartIII(): void {
        this.clearOutput();
        // [If PC has a cock]
        if (this.player.hasCock()) {
            const x: number = this.player.shortestCockIndex();
            const y: number = this.player.longestCock();
            this.outputText("You can feel it when the spider-lady's pussy begins to quiver in delight. Aunt Nancy soon moans, then cries out in incredible pleasure.  The lower half of her eyes all close, while the others all roll up into her head in ecstasy.  \"<i>Yes!  YEEEEESSSSSSS!</i>\" she hisses with throaty, feminine indulgence.  The tiny feelers in her otherwise silky-smooth vagina suddenly begin to squeeze and pull at your " + this.player.cockDescript(x) + ", and you let out a bellow of pleasure of your own as you feel your ");
            // [If PC has balls]
            if (this.player.balls > 0) this.outputText(this.player.ballsDescriptLight() + " tense, churning and tightening.");
            // Else:]
            else this.outputText("body tensing in preparation for letting out your seed.");
            this.outputText("\n\n");

            this.outputText("You cum, and cum hard.  Thick wet jets of sticky semen pour into Aunt Nancy's seemingly-bottomless pussy, whose feelers and soft, smooth interior continue to rub at and stroke your " + this.player.cockDescript(x) + " even as it vents the immense pressure in your " + this.player.ballsDescriptLight() + ". If anything, the constant powerful surges seem to be extending and intensifying the spider-lady's orgasm.");
            // [If PC has cum multiplier of at least 2]
            if (this.player.cumQ() >= 750) this.outputText("  Sooner or later though, even her marvelous body can simply contain no more of your jizz, and she slips her swollen cunt up off of your organ, letting it continue squirting your thick, plentiful cum all over her as it swings free.");
            this.outputText("\n\n");

            // [If PC has another dick of at least auto-titfucking size:]
            if (this.player.cocks[y].cockLength >= 22 && this.player.cockTotal() > 1) {
                this.outputText("Aunt Nancy unwraps her tongue from your " + this.player.cockDescript(y) + " to cry out in delight, even as her hands let go of her lovely breasts to grab at your trunk.  Nonetheless, her big, pillowy boobs are more than firm enough to keep the shaft of your " + this.player.cockDescript(y) + " snugly inside as she bucks and shrieks atop you, and they more than contribute to your own sexual pleasure.\n\n");

                this.outputText("It too spasms, spitting gooey ropes of cum all over both of you");
                // [If PC has cum multiplier of at least 2]
                if (this.player.cumQ() >= 750) this.outputText(", some even reaching to the ceiling to fall into her short, pretty white hair and splattering over her trailing abdomen");
                this.outputText(".\n\n");
            }
            // [If there are still dicks left over:]
            if (this.player.cockTotal() > 2) {
                // [If no cocks are of titfucking size and # Cocks = 2 or if there are cocks of titfucking size and # Cocks = 3]
                if (this.player.cockTotal() > 1) {
                    if ((this.player.cocks[y].cockLength < 22 && this.player.cockTotal() == 2) || (this.player.cocks[y].cockLength >= 22 && this.player.cockTotal() == 2))
                        this.outputText("Your other dick fires off too, her smooth, shell-covered hands still wrapped around it, and it makes even more of a mess, splattering over both of you.\n\n");
                    // [Else]
                    else if ((this.player.cocks[y].cockLength < 22 && this.player.cockTotal() > 2) || (this.player.cocks[y].cockLength >= 22 && this.player.cockTotal() > 2))
                        this.outputText("The rest of your " + this.player.multiCockDescriptLight() + " fire off too, her smooth, shell-covered hands still wrapped around them, and they make even more of a mess, splattering over both of you.\n\n");
                }
            }
            // [If you also have a vagina:]
            if (this.player.hasVagina()) {
                this.outputText("Your " + this.player.vaginaDescript(0) + " clenches, tightly, ");
                if (this.player.balls == 0 && (this.player.cocks[y].cockLength < 22 || (this.player.cocks[y].cockLength >= 22 && this.player.cockTotal() <= 2)))
                    this.outputText("squeezing the fingers on Aunt Nancy's hand still tickling your insides");
                else this.outputText("making you long for something inside of it");
                this.outputText(", as " + this.player.sMultiCockDesc() + " spasms in ecstasy.\n\n");
            }
            // [All w/ penis:]
            this.outputText("Eventually, both your orgasms end.  You feel worn out, like you just ran a long mile, even though Aunt Nancy was doing most of the work.  However, she seems fine, smiling down at you with a big, happy grin.");
            // [If the PC has multiple dicks or a cum multiplier of at least 2]
            if (this.player.cockTotal() >= 2 && this.player.cumQ() >= 700) this.outputText("  Her lower body's a mess of smeary dollops of cum, right up to the bottom halves of her impressive boobs, and her face and upper body haven't fared much better. Behind her you can see where stray shots that sprayed over her have painted streaks of her abdomen white.");
            this.outputText("\n\n");

            // [If the PC has multiple dicks or a cum multiplier of at least 2]
            if (this.player.cockTotal() >= 2 && this.player.cumQ() >= 700)
                this.outputText("Aunt Nancy runs one hand up her milky-pale body, digging a wide furrow in the thick layer of gooey cum as it moves up her belly and up the curve of her breast, before she peels it away and lifts it in front of her mouth.");
            else
                this.outputText("Aunt Nancy puts one hand beneath her dripping pussy and squeezes some powerful internal muscle.  A thick dollop of gooey cum falls onto it from inside of her, and she lifts it in front of her mouth.");
            this.outputText("  Snaking her long tongue around her fluid-smeared hand, the spider-lady licks up a thick load of the contents of your ");
            if (this.player.balls > 0) this.outputText(this.player.ballsDescriptLight());
            else this.outputText("body");
            this.outputText(", and throws back her head to let it slide into her mouth.\n\n");

            this.outputText("\"<i>Mmmmm...</i>\" she purrs.  Aunt Nancy notices the look on your face and smiles sexily.  \"<i>What? A lady needs her protein, friend.  Do you think I can spin my webs out of nothing?</i>\"\n\n");
        }
        // [Else:]
        else {
            this.outputText("You can feel it when the spider-lady's pussy begins to quiver in delight.  Aunt Nancy soon moans, then cries out in incredible pleasure.  The lower half of her eyes all close, while the others all roll up into her head in ecstasy.  \"<i>Yes!  YEEEEESSSSSSS!</i>\" she hisses with throaty, feminine indulgence.  The tiny feelers in her otherwise silky-smooth vagina suddenly begin to squeeze and pull at your fingers, and her own fingers are soon touching sensitive places of their own inside of your ");
            // [If PC has a vagina:]
            if (this.player.hasVagina()) this.outputText(this.player.vaginaDescript(0) + " and ");
            this.outputText(this.player.assholeDescript() + ".\n\n");

            this.outputText("You howl in pleasure, feeling the orgasm coursing through you like hot metal up and down your spine.  You let out an exclamation of pleasure of your own, as you feel her hands tighten on your " + this.player.chestDesc() + ", and soon you too are luxuriating in the feeling of her body against yours, inside of you, pressing all your most vulnerable places.");
            // [If PC has a vagina and is a squirter and/or is lactating:]
            if (this.player.wetness() >= 5 || this.player.biggestLactation() >= 1)
                this.outputText("  Her hands are soon drenched in your body's wonderful secretions, just as your");
            else this.outputText("  Your");
            this.outputText(" fingers are soon soaked in the lovely, sweet-smelling juices of her pussy.\n\n");

            this.outputText("Eventually, the sensation subsides, and she gently slides her fingers from your ");
            // [If PC has a vagina:]
            if (this.player.hasVagina()) this.outputText(this.player.vaginaDescript(0) + " and ");
            this.outputText(this.player.assholeDescript() + ".  You feel worn out, like you just ran a long mile, even though Aunt Nancy was doing most of the work, and you let your arm fall back down against the sticky surface of her web.  However, she seems fine, smiling down at you with a big, happy grin.");
            // [If PC has a vagina:]
            if (this.player.hasVagina()) this.outputText("  Lifting the smooth, soaked hand that has only just been soaked in the juices of your " + this.player.vaginaDescript(0) + " in front of her mouth, Aunt Nancy smiles at you.  Snaking her long tongue around her fluid-smeared hand, the spider-lady licks up the fluid with every sign of enjoyment.  \"<i>Mmmmm...</i>\" she purrs.  \"<i>You DO taste good.</i>\"\n\n");
        }
        // [All]
        this.outputText("Aunt Nancy leans down and presses her soft lips against yours again, wrapping your web-bound body up in a hug with all four of her arms, and again you feel much more relaxed and (now that you think of it) aroused than you had a minute ago.  However, this particular sex session has taken an awful lot out of you, and you look longingly at the door over her shoulder as the kiss ends.  Unfortunately, the spider-lady sees you doing so and smiles wickedly.\n\n");

        this.outputText("\"<i>Not a chance on Marae's green earth, friend,</i>\" she purrs, her voice like hoarse velvet as she rubs the surface of her still-needy pussy against your belly.  \"<i>I haven't had a lover in my bed in more than ten years, and you're not going anywhere until I say you can.</i>\"  That last part was punctuated with a wicked squeeze of your " + this.player.buttDescript() + ", and Aunt Nancy presses her lips to yours again, much less gently and more passionately this time.  You moan into her mouth, feeling her aphrodisiacal bodily fluids seeping in, and, as she soon frees your upper body and presses your head into her soft, silky pussy, you know she's right.\n\n");

        this.outputText("\"<i>And I'll be damned if I do all the work this time,</i>\" Aunt Nancy adds, before letting out a satisfied groan at the touch of your lips.");

        // [Next Page, Time += 200]
        this.doNext(this.auntNancyPoonPartIV);
    }
    private auntNancyPoonPartIV(): void {
        this.clearOutput();
        this.outputText("<b>Two passionate, sticky hours pass...</b>\n\n");

        // [70 % for Toughness, Strength to increase 2-6 points]
        this.player.orgasm('Generic');
        this.dynStats("str", .3, "tou", .3);
        // [+35 Fatigue]
        this.player.changeFatigue(35);
        // [+20 Relationship with Aunt Nancy, PillowTalk += 1]
        this.flags[kFLAGS.NANCY_RELATIONSHIP_LEVEL] += 20;

        // [Next Page, If PillowTalk = 0]
        if (this.flags[kFLAGS.NANCY_TIMES_BONED] == 0) {
            this.outputText("You awaken on Aunt Nancy's \"<i>bed,</i>\" an unbelievably comfortable pile of discarded, non-sticky webbing, your head still resting on her comfortable, pillowy bosom.  Slowly, you manage to sit up, tenderly massaging your aching body, especially your ");
            if (this.player.gender > 0) this.outputText("genitals");
            else this.outputText("jaw");
            this.outputText(".  The last hour or so is just a blur to you at the moment, a haze of sex and passion and stickiness.  You can still taste Aunt Nancy's scent in your mouth and smell it in the air.  The widow had been insatiable, always coming back for more no matter how often you got her off... and skilled enough to make sure you could too.  Privately, you wonder exactly what killed her husband.\n\n");

            this.outputText("Suddenly, you start at the feeling of Aunt Nancy's soft breasts squishing into your back, and her four arms sleepily embracing you, wrapping around the front of your chest.  You aren't sure whether to shiver in anticipation or tremble in fear, but you feel her lips gently kissing your ear, and hear the spider-lady's deliciously throaty, sexy voice whispering,  \"<i>Don't worry, friend.  You've satisfied me... for now.</i>\"  Gently, you feel her body rocking against your back, humming happily.\n\n");

            this.outputText("\"<i>Thank you,</i>\" she murmurs into your ear.  \"<i>I... I needed that. I appreciate you being willing to meet this dirty old widow woman's needs.  It was... kind.</i>\"  She pauses, then sighs.  \"<i>I won't ask you to stay any longer.  You have... a great and terrible destiny ahead of you.  No need to try to hide it.  Ol' Aunt Nancy can see these things.  Like my husband did...</i>\"\n\n");

            this.outputText("You can feel Aunt Nancy's hot tears on your back, and you place a comforting hand onto one of hers.  You can all but feel her smile through her tears, and she presses another kiss into your ear.  \"<i>I know, I know,</i>\" the widow whispers. \"<i>I won't try to stop you.  Just... come back some time, if you please? Every now and again?  I'd... appreciate that.</i>\"\n\n");

            this.outputText("The spider-lady pulls her head back, releasing your body with her four arms, and says, rather loudly, \"<i>Now, friend, get on out of here!  Go out there and get to the adventuring and world-saving!</i>\"  Suddenly, mischievously, she pinches you rather hard on the " + this.player.buttDescript() + ".  You jump, yelping in pain, and turn indignantly to face her as she doubles over, chuckling, tears still streaming down her face.  \"<i>Let these old exoskeletal chitins rest awhile, friend,</i>\" Aunt Nancy laughs, lying back onto the soft mound of webbing.  She smiles lazily up at you.  \"<i>There's water next to the foyer if you want to clean off, and your " + this.player.armorName + " in the parlor.  And... please do keep in touch.</i>\"\n\n");

            this.outputText("Tentatively, you smile back, before getting cleaned up, getting dressed, and walking out into the suddenly-blinding sun of Tel'Adre.\n\n");
        }
        // [Else]
        else {
            this.outputText("Worn out and sticky, you awaken in the spider-lady's arms in her bed.  You share a kiss and tender moment with the widow, before leaving Aunt Nancy to rest as you go to get cleaned up and leave, tired and worn out but also feeling stronger from your exercise.  As you leave, she tells you to come by when next you can...");
        }
        // Increment times boned!
        this.flags[kFLAGS.NANCY_TIMES_BONED] += 1;
        this.doNext(this.camp.returnToCampUseTwoHours);
    }
}
