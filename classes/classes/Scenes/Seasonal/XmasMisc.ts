import { BaseContent } from "../../BaseContent";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { CockTypesEnum } from "../../CockTypesEnum";

// CONSTS
// const CANDY_CANE_YEAR_MET: number = 637;
// const XMAS_CHICKEN_YEAR: number = 642;
// const KAMI_ENCOUNTER: number = 643;
// const POLAR_PETE_YEAR_MET: number = 644;
// const NIEVE_STAGE: number = 647;
// const NIEVE_GENDER: number = 648;
// const NIEVE_MOUTH: number = 649;

// TOC (Ctr + F to find):
// 1. Kirbster's Bunny Trap
// 2. Abraxas's Christmas Chicken
// 3. nRage's Kanga herm loving
// 4. Donto's Polar Pete
// 5. Third's Nieve

// 1. Kirbster's Bunny Trap
// if (isHolidays() && flags[kFLAGS.CANDY_CANE_YEAR_MET] < date.fullYear)

export class XmasMisc extends BaseContent {

    public candyCaneTrapDiscovery(): void {
        this.clearOutput();
        this.outputText("Shortly after embarking into the plains, your thoughts drift back to your life and home in your village.  The slight chill in the air today reminds you of a time of cheer celebrated by your former friends and family.  As days grew shorter and colder, people exchanged humble trinkets, and great feasts were prepared.  ");
        if (this.player.cor < 50) this.outputText("The memory brings a nostalgic smile to your [face].");
        else this.outputText("The memory reminds you of how bland your world truly was in comparison to Mareth.");

        this.outputText("\n\nYour musings are interrupted by a sharp moan that immediately catches your attention.  It's light enough that whoever did it must be a distance away, but audible enough for you to be sure of where it came from.  Keeping your [weapon] up and prepared, you venture in the direction where the sound originated.  Stepping through a dense patch of shrubbery, you find yourself in a semi-secluded glade littered with puddles of semen.  Whatever creature these came from must be rather \"<i>pent up,</i>\" so to speak.");

        this.outputText("\n\nDo you run the risk of investigating?");
        this.menu();
        this.addButton(0, "Investigate", this.investigateCandyCaneBun);
        this.addButton(4, "Leave", this.leaveBeforeMeetingCandyCaneBun);
    }

    // LEAVE
    public leaveBeforeMeetingCandyCaneBun(): void {
        this.clearOutput();
        this.outputText("You're not willing to run the risk of getting a foreign cock stuffed up your [butt].");
        // (If corruption or libido>50)
        if (this.player.cor > 50 || this.player.lib > 50) this.outputText("  At least not right now.  You turn back, navigating your way back to your camp.");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // INVESTIGATE
    public investigateCandyCaneBun(): void {
        this.clearOutput();
        this.outputText("You make the decision to find out just what's going on.  You cautiously follow the small pools of goo, slightly on edge.  You approach a wall of low hanging vine which you quickly pull aside.  Sitting in the largest puddle of semen you've seen yet, a trembling bunny-like figure kneels on its knees.");
        // (If corruption and libido<50)
        if (this.player.cor < 50 && this.player.lib < 50) this.outputText("  Your eyes are quickly drawn to the rabbit morph's stark nudity.");
        // (If corruption or libido>50)
        else this.outputText("  Your eyes are quickly drawn to the rabbit morph's finely curved ass.");
        this.outputText("  A pair of heavily hanging balls confirm the figure to be at least partially male.");
        this.outputText("\n\nYou make the move to ");
        // (If corruption and libido<50)
        if (this.player.cor < 50 && this.player.lib < 50) this.outputText("leave, ");
        // (If corruption or libido<50)
        else this.outputText("approach, ");
        this.outputText("but one of your [feet] snaps a twig and causes the bunny to turn at the sound. As its large eyes lock with your, you get your first good look at the figure.  It is predominantly human looking, but the floppy ears sprouting from its head and fluff adorning him from the thighs down indicates at least a little mutation.  Two small nipples lie on a flat chest, confirming him to be a male.  His eight inch dick and kiwi-sized balls leave even less to your imagination.  He is lightly tanned, his skin colored a non abrasive brown.  The hair on his body stands in a sharp contrast to his relatively regular skin.  A mop of shoulder length hair on his head is as white as freshly fallen snow, with sprinklings of red stripes highlighting it.  You can't help but notice how nicely it frames his surprisingly soft, feminine face.  The fur covering his legs is similarly covered.  His hips jut out notably, adding even further to his overall girly appearance.");
        this.outputText("\n\n\"<i>You're not going to rape me?</i>\"  The bunny boy's remarkably high voice breaks your train of thought.  ");
        // (If corruption<50)
        if (this.player.cor < 50) this.outputText("You calmly inform him that you didn't have the intention of violating him. ");
        // (If corruption>50)
        else this.outputText("Your train of thought is derailed, but you agree to let the bunny believe whatever he wants to.");
        // (If silly mode on)
        if (this.silly()) this.outputText("  You're willing to say anything to calm him down.  This kid's voice is even more shrill than that asshole from Glee!");
        this.outputText("  A smile lights up his face, his shoulders visibly drop and lose their tension.   He sits like that for but a moment, before he realizes the full scope of the current situation.  His eyes grow wide while he throws down his arms with a rather unmanly yelp, covering his dripping cock.  Despite his embarrassment, it's evident that he's not going to get off unassisted.");
        this.flags[kFLAGS.CANDY_CANE_YEAR_MET] = this.date.fullYear;
        this.outputText("\n\nDo you help him out?");
        // (Present \"<i>Yes</i>\" and \"<i>No</i>\" options)
        this.menu();
        this.addButton(0, "Yes", this.helpWithTheCandyCane);
        this.addButton(1, "No", this.declineCandyCaneCawks);
        this.dynStats("lus", 10 + this.player.lib / 10, "scale", false);
    }

    // NO
    public declineCandyCaneCawks(): void {
        this.clearOutput();
        this.outputText("Turning around a tad awkwardly, you stumble out of the glade.  Tempting as he is, you don't have time to help the random bunny orgasm.");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // YES
    public helpWithTheCandyCane(): void {
        this.clearOutput();
        this.outputText("You lower your eyes seductively as you begin to sashay your [hips], approaching the lusty rabbit.  He trembles slightly as you lift his hands away from his dick, but he doesn't protest.  Up close, you can see his cock is adorned with red stripes similar to the ones in his hair. You push your [face] up against it, letting the pheromone laced tool drag across your face.  The rigid rod even leaves a few streaks of pre cum in your [hair].  After a minute of teasing the whimpering bunny, you pull his cock down, dragging it past your lips.  Your mouth lights up with a chilling sensation the moment his cock's head touches your tongue.  It fills you with an indescribable happiness, as if the boy inside your mouth is radiating pure joy.  You begin to moan around his tonsil-tickler while ");
        // (if male)
        if (this.player.gender == 1) this.outputText("[eachCock] rises up, rocking against you.");
        // (If female)
        else if (this.player.gender == 2) this.outputText("your [vagina] and [clit] become coated in liberal amounts of juices.");
        // (If herm)
        else if (this.player.gender == 3) this.outputText("both of your sexes flare with arousal.");
        // (If genderless)
        else this.outputText("sweat drips off of you.");
        this.outputText("  You pay no mind to this, too pre-occupied bobbing your head on the delicious dick in your mouth.");

        this.outputText("\n\n\"<i>Oh my goodness!</i>\"  The bunny cries out from above you as he wraps his furry legs around your neck.  \"<i>I can't keep from squirting if you keep it up like this!</i>\"  You smile around him before pulling off of his prick.  Your lips make a grotesque popping noise as his cock head pulls out of your dick-craving suck-hole.  You wrap a hand around his throbbing rod, jacking him off while you whisper throatily to him to coat you in his seed.  He wriggles under your experienced grip, dripping his slippery spunk down your fingers.  The mess that coats your fingers allows you to improve your handjob even further.  You hand becomes a practical blur as it draws up and down at an alarming rate.");

        this.outputText("\n\nThe feminine boy's slender hands suddenly grip at your [hair], pulling you up against his penis.  You feel his balls churning up against your [face].  Preparing to receive your generous gift, a sharp ringing suddenly distracts you.  Your eyes open wide to identify the odd jingling, but your field of view only lets you view the balls pressing up against your face.  As they churn visibly, you quickly deduce that his nuts are the source of the jingling, announcing his impending climax!  The ringing quickly ceases as his cock swells and blasts of jet of semen onto your [face].  You reflexively open your mouth as wide as you can, resembling a whore clenched between the legs of this bunny boy. His next spurt layers your entire mouth in the white cream, sending a pleasurable shiver down your spine.  His cum is so minty and chilling that you immediately dive on him, engulfing him in your mouth once more.  He allows you to suck down the last few shots of his cum before falling back, utterly spent.  Shuddering slightly, he pulls you on top of him, and leans up to place a not-too-chaste kiss on your cum coated lips.  You remain for a moment, caressing his soft hair.  He eventually lays back, thanking you before drifting into slumber.");
        // (If corruption<50)
        if (this.player.cor < 50) this.outputText("  Not wanting to disturb him, you make your way back to camp and attempt to ignore the burning fire in your loins.");
        // (If corruption>50)
        else this.outputText("  Despite your rising urge to take advantage of the unknowing bunny, you decide to retire and return to camp.");
        // (Lust set to 100, hour passes.)
        this.dynStats("lib", 1, "sen", 1, "lus=", 100, "cor", -5, "scale", false);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // 2. Abraxas's Christmas Chicken
    // [Wake up, whatever morning]
    public getAChristmasChicken(): void {
        this.flags[kFLAGS.XMAS_CHICKEN_YEAR] = this.date.fullYear;
        this.outputText("\nThe grating sound of squawking rouses you in the morning.  You groggily roll over, hoping to go back to sleep for a while, but the annoying noise persists unrelenting.  Realizing that it probably isn't going away any time soon, you reluctantly force your eyes open and push yourself up.  The sight around you causes you to blink a few times to shake away the disbelief: a layer of brilliant white snow frosts the ground, a rare sight at your camp thus far.  You hadn't really noticed it getting that much colder, but the chill this morning is biting through your [armor].  A shiver wracks your body, and your thoughts on the odd snowfall are interrupted by another loud call.");
        this.outputText("\n\nDetermined to shut whatever is making such a racket up, you trudge off through the cold, crisp blanket towards where you think the sound is coming from.  You crest a small hill and are greeted with another peculiar image.  Faintly visible against the snow, what appears to be a very pale harpy woman lays on her back, beating her pure-white wings against the ground and sweeping her legs back and forth against the freshly-fallen powder.  She caws and shrieks happily, apparently too caught up in... whatever it is she's doing to notice you.");
        this.menu();
        this.addButton(0, "Talk", this.talkToXmasChicken);
        this.addButton(4, "Leave", this.leaveXmasChicken);
    }

    // [Leave]
    public leaveXmasChicken(): void {
        this.clearOutput();
        this.outputText("Too exasperated by the plain absurdity of the situation to deal with it, you bury your face in your hands and decide to leave her to it.  Maybe some imps will shut her up for you.  You head back to camp with her piercing cries following you all the way, and prepare for the day ahead.  Her cries fade a while later; the snow thaws and the air warms soon after.");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [Talk]
    public talkToXmasChicken(): void {
        this.clearOutput();
        this.outputText("Figuring you should at least try asking her to pipe down, you continue your approach.  She finally takes notice of your footsteps crunching the snow beside her and goes still and silent for a moment as she looks up at you.  Now that you're closer, you can make out some more of her features against the snowy ground.  She wears a light dress, almost as pale as her skin and the snow around her, thin enough that you can just see her perky nipples through its white fabric.  A shiver of your own makes you wonder why she's wearing something like that on a day like this.  The thick, fluffy-looking feathers of her wings even manage to stand out as somehow even whiter than the frosty backdrop of the snow.  A faint, silvery glow seems to radiate from her, but it's probably just a trick of the light against the snowfall.");
        this.outputText("\n\nYou watch her lie there quietly for a moment before she goes back to happily cooing as loudly as ever and flapping about on the ground.  Fed up, you finally ask her what she thinks she's doing out here.  She looks up quizzically for a moment and tells you matter-of-factly that she's making shapes in the snow, and returns to her task dutifully and noisily.  You bury your face in your hands, unsure how to deal with this.  You ask her why exactly she's doing that.");
        this.outputText("\n\nThe harpy looks up and opens her mouth for a moment, but stops herself to think.  \"<i>Well, I was dancing in the snow because I was so happy to see it.  Then I slipped and fell, so I started doing this instead.</i>\"  Thinking again.  \"<i>Oh!  Right, I can't get up.  My wings won't fold right for that.  Too big.</i>\"  Apparently expecting you to be satisfied, she gets back to it.  Forced to yell over her resumed deafening shrieks of joy, you tell her you can help her up if she'll quiet down.  She contemplates your offer for a second, then extends a hand.");
        this.outputText("\n\nDespite the apparent thickness of her plumage, she's rather light, and you easily pull her to her feet.  Err, talons.  She seems grateful, beaming a smile at you.  You're just happy that she's shut up.  \"<i>Thanks!  I guess I should repay you somehow.  ");
        // (if male)
        if (this.player.gender == 1) this.outputText("How's a blowjob sound to you?");
        // (if female)
        else if (this.player.gender == 2) this.outputText("How about I eat you out?");
        // (if herm)
        else this.outputText("How about I give you a few minutes to do whatever you want with my mouth?");
        this.outputText("</i>\"  You raise an eyebrow, not entirely sure what to make of her suddenly lascivious nature.  It's certainly quite a change.  She giggles.  \"<i>Oh, don't be surprised.  Where do you think we are");
        // (if sillymode)
        if (this.silly()) this.outputText(", scrub");
        this.outputText("?</i>\"");
        this.menu();
        this.addButton(0, "Accept", this.acceptChristmasBJs);
        this.addButton(4, "Decline", this.declineChickenBlowjobs);
    }

    // [Decline]
    public declineChickenBlowjobs(): void {
        this.clearOutput();
        this.outputText("The harpy squints at you suspiciously.  \"<i>What do you mean, 'no thanks?'  Nobody says that around here!</i>\"  She rolls her eyes and sighs in an obviously exaggerated manner, then turns tail and flaps off into the distance.  You head back to camp, quite looking forward to the silence.  The air warms and the snow thaws soon after you return, leaving no trace of its presence but a few spots of slushy mud.");
        this.doNext(this.playerMenu);
    }

    // [Accept]
    public acceptChristmasBJs(): void {
        // (male)
        if (this.player.gender == 1) {
            this.acceptChristmasManBJ();
        }
        else if (this.player.gender == 2) {
            this.acceptChristmasWomanBJ();
        }
        else {
            this.clearOutput();
            this.outputText("Would you like her to service your male parts or lady bits?");
            this.menu();
            this.addButton(0, "Man Parts", this.acceptChristmasManBJ);
            this.addButton(1, "Lady Bits", this.acceptChristmasWomanBJ);
        }
    }

    public acceptChristmasManBJ(): void {
        this.clearOutput();
        let x: number = this.player.cockThatFits(80);
        if (x < 0) x = this.player.biggestCockIndex();
        // (if cock >= ridonkulous)
        if (this.player.cockArea(x) >= 80) {
            this.outputText("You free your [cock " + (x + 1) + "] from your [armor], signaling your acceptance.  Your monster flops free, and the harpy grabs at her throat reflexively when she looks at it.  She glances up to you with wide eyes and back down at it.  \"<i>A-a promise is a promise, but...</i>\"");
            this.outputText("\n\nShe turns and flees with a few terrified flaps of her wings.  You sigh, covering your enormous prick once more.  At least you won't have to deal with her pesky shrieking any more.  The air warms and the snow thaws soon after you return, leaving no trace of its presence but a few spots of slushy mud.");
            this.dynStats("lus", 10);
            this.doNext(this.playerMenu);
            return;
        }
        // (else if cock would please Goldilocks) (area<= 30 or some shit i dunno whatever the standard is)
        else {
            this.outputText("You free your [cock " + (x + 1) + "] from your [armor], signaling your acceptance.  The immediate rush of cold air that greets it makes you hope she won't be wasting any time.  The pale harpy woman squeals at the sight, raising her hands to her chin and practically bouncing in place.  In a flash she's on her knees, stroking and licking at your meat until it's hard in front of her face.  Her hot breath against your shaft has you more than ready for the sanctuary from the biting cold.  She eyes your erect prick");
            if (this.player.cockTotal() > 1) this.outputText("s");
            this.outputText(" almost hungrily, licking her lips before swiftly engulfing almost its entire length in her mouth.  Her expert technique astounds you; you certainly didn't expect her to have any idea what she was doing but she's able to take you nearly to the base of your shaft in one motion.");

            this.outputText("\n\nThe heat of her throat against your sensitive flesh is such a relief that you lose your balance.  You gasp air and place a hand on the back of her head, partly to steady yourself and partly to bring her closer in.  Not meeting resistance, you pull her against you until her full lips are wrapped around the very base of your [cock " + (x + 1) + "].  She smiles around its girth and slowly slides her head back, dragging the tip of her tongue along its length and leaving you covered in her glistening saliva.  The freezing temperature elicits another sharp intake of air, but the painful sensation is forgotten as she starts to bob back and forth, taking you in so deeply and so quickly that it's impossible to think of much but the warm comfort of her mouth.  ");
            // (if only one cock)
            if (this.player.cockTotal() == 1) this.outputText("She grabs onto your hips, enabling herself to move all the quicker.");
            // (if two cocks)
            else if (this.player.cockTotal() == 2) this.outputText("With her other hands she starts to work the shaft of the second cock, pumping in time with the motions of her head.");
            // (if 3+ cocks)
            else this.outputText("She grabs onto two of your other erect cocks with her hands and begins pumping away at them in time with the motions of her head.");

            this.outputText("\n\nHer fellating tongue and pursed lips are more than enough to make up for the uncomfortable temperature; the nip of the cold is forgotten as pleasure clouds your mind.  At the pace she's going, you near the edge in no time at all.  You try to warn her, but climax takes you before you can get out more than a pant.  Caught up in the bliss, you hold her close against you as you empty your hot load into the harpy's receptive throat.");
            // (if cum output is low-moderate)
            if (this.player.cumQ() < 250) this.outputText("  She closes her eyes and looks quite contented while she swallows your spunk.");
            // (else if cum output is high)
            else if (this.player.cumQ() < 1000) this.outputText("  Semen gushes out of you for what seems like forever, but the harpy doesn't seem to mind.  She closes her eyes and looks quite contented while she swallows your still-torrenting spunk.");
            // (else if cum output is ridonkulous)
            else this.outputText("  Though at first she looks like she'll be able to handle it, the river of semen exploding from the rip of your cock doesn't stop.  Her eyes widen as the almost unending torrent of spunk fills her, rushing down her throat and into her belly.  You can almost see her bloating with the stuff before it starts to spill back out, dripping white from her lips around your shaft.");
            // (if multicock)
            if (this.player.cockTotal() > 1) this.outputText("  Your cum sprays over her, coating her skin and plumage in a white to rival their own.  Strands of your semen dripping and running over her hardly even stand out on her bright body.");
            this.outputText("  When you finish, you let the harpy go.  She looks just as satisfied as you are.  A trail of cum and saliva still connects your [cockHead " + (x + 1) + "] to her; she breaks it with a lick of her lips and gives your softening member a longing glance before standing up, panting from exertion.");

            this.outputText("\n\nThe happy girl suddenly hugs you as you're in the process of putting your prick back into your [armor].  The silvery glow around her pale skin looks stronger now, so strong that you're almost sure you can see it.  \"<i>Oh, thank you!</i>\" she starts, but quickly composes herself.  \"<i>For, um, helping me.  Up.</i>\"  She lets go and backs away from you.  \"<i>I've gotta be going though, see you around!  Enjoy the weather!</i>\"  With that, she wings off into the skies.  She lands atop a nearby tree, arms outstretched in an odd pose.  The silvery glow surrounding her is still visible, even at a distance.  You shake your head and return to camp, wondering who in the world that was.  Not long after you return, the air warms once more and the snow melts, leaving the ground a slushy mess in spots.");
        }
        this.player.orgasm('Dick');
        this.doNext(this.playerMenu);
    }

    public acceptChristmasWomanBJ(): void {
        this.clearOutput();
        this.outputText("You nod, signaling your acceptance of her offer.  The pale harpy squeals happily, bringing her hands to her chin and practically bouncing with joy.  You open your [armor] and in a flash she's kneeling with her head between your thighs.  Her hot breath against your soft flesh feels wonderful against the chill of the air.  The eager girl wastes no time in getting to work, rubbing your [clit] with two of the fingers on one hand and gently stroking your labia with the others.  Her pressure increases with the warm, comfortable feelings of arousal that her touches bring you.");
        this.outputText("\n\nIt's not long before she has you dripping and tingling down there with a need for more involved attention.  Apparently satisfied with your wetness, she grabs your thighs and pulls her face in against your crotch.  Her smooth, thick tongue runs over your lower lips, pushing you just a little further each time.  Its sudden flick into your sex is enough to elicit a sharp gasp, and you palm the back of her head almost by instinct as a shudder wracks your body.  Your gentle coos and sighs of pleasure blend into moans as she eats your [vagina] more and more fervently, her tongue probing you for the softest, most sensitive spots of your inner walls.  Your mind seems to float now, carried by waves of sexual need.  You need to cum, you need her to give you more.  Pressing her more forcefully against you now, any thoughts of her comfort vanish from your head as you run your fingers through her thick blond hair.");
        this.outputText("\n\nThe harpy gets the message and attacks your needy cunt with an almost-violent intensity.  A yelp escapes you despite yourself, but she holds you close and keeps it up unrelentingly.  Your vision nearly fogs with lusty sensation.  You roll your head back and close your eyes, drifting away on the sea of arousal building inside of your body.  At the pace she's going and with her expert technique, it's not long before that sea overflows into orgasm.  Your thoughts blank as the muscles of your [cunt] clench, your juices spraying into the mouth of the harpy.  She drinks them thirstily, tongue still lapping away as you slowly come down from your climax.  You finally let the woman go, and she removes herself from between your legs almost reluctantly while you bathe in the afterglow.");
        this.outputText("\n\nShe suddenly embraces you as you readjust your [armor].  The silvery glow around her pale skin looks stronger now, so strong that you're almost sure you can see it.  \"<i>Oh, thank you!</i>\" she starts, but quickly composes herself.  \"<i>For, um, helping me.  Up.</i>\"  She lets go and backs away from you.  \"<i>I've gotta be going though, see you around!  Enjoy the weather!</i>\"  With that, she wings off into the skies.  She lands atop a nearby tree, arms outstretched in an odd pose.  The silvery glow surrounding her is still visible, even at a distance.  You shake your head and return to camp, wondering who in the world that was.  Not long after you return, the air warms once more and the snow melts, leaving the ground a slushy mess in spots.");
        // (end female)
        this.player.orgasm('Dick');
        this.doNext(this.playerMenu);
    }

    // 3. nRage's Kanga herm lovin
    // Xmas 'Roo Romping.
    // Character:
    // Kami, the hermaphrodite Kangaroo-morph.
    // Location:
    // The Bakery
    // Requirements:
    // Should work with Centaurs, Nagas and bipeds of all genders. 100% repeatable encounter.
    // Scenes:
    // Anal (giving), anal (receiving), blowjob (giving) and a dual dick scene (also giving.) Too big cocks or tentacle-dicked characters can still give the blowjob. All scenes done. Woooooooo.)

    // Short Explanation:
    // The player enters the bakery and encounters a Kangaroo herm who hands them a 'present'. Inside there's a note offering the player sex. The player can choose to take her up on the offer and except her 'xmas present' or not. Also please note that the player is free to enter the bakery and interact with Kami again after smexing her the first time or try again after being an ass and denying her during the initial encounter. Turns out she's actually the chick responsible for making the Xmas pud (because she's so damn good at it.)

    // [Player enters bakery, Date must be at least 15 Dec and KamiEnc must be 0]
    public encounterKamiTheChristmasRoo(): void {
        if (this.flags[kFLAGS.KAMI_ENCOUNTER] == 0) {
            this.outputText("You enter the Tel Adre bakery with the intention of sampling some of the local confectionaries.  This time around, you're surprised to find that the place is adorned with wintery, festive decor of all shapes and sizes - even a pine tree hangs around, with gifts delicately placed underneath.   The place is packed, and you allow a curvaceous kangaroo-morph waitress to escort you to your table.  You don't remember seeing her here before, and you're certain you'd never forget a chest like hers.  The girl's heaving, E-cups press against her dainty red and white waitress uniform as she sorts your table.  She manages to catch you off-guard, realizing the objects of your interest and blushing profusely. The waitress scurries off before you have chance to apologize, her hips wiggling almost exaggeratedly as she goes.\n\n");
            // [Player must select an action, out of eating cakes etc, Rubi or the kangaroo waitress. Description provided below.]
            // To normal Bakery menu!
        }
        else {
            this.outputText("You enter the Tel'Adre bakery, the building adorned with wintery decor of all shapes and sizes.  A pine tree lies at the back, decorated with fancy gifts.  The place is livelier than usual, with the local civilians scrabbling around to buy delicacies at the counter up front.  You approach the hungry mob to investigate, identifying the commotion to be a caused by a particularly appetizing pudding dessert.  You smack your lips at the festive treat, your building hunger interrupted by a delicate, familiar voice.  \"<i>Hey there! I see you're eyeing the pudding I made!  You want some?</i>\"  The young 'roo waitress shouts across the group of feisty Tel'Adrians, waving to get your attention.  \"<i>You might wanna snatch one up before these guys do!  35 gems!  I'm gonna go ahead and take a break  - would you be interested in burning off some steam with me, doll?</i>\"\n\n");
        }
    }

    // [Player chooses Kangaroo girl]
    public approachKamiTheChristmasRoo(): void {
        this.clearOutput();
        if (this.flags[kFLAGS.KAMI_ENCOUNTER] == 1) {
            // [Player chooses 'Kami']
            this.outputText("You give Kami a nod, heading out back as she punches out for a quick break.  The waitress is out quicker than you expect, already ripping out of her red and white uniform to expose her hungry phallus.  \"<i>I'm not gonna lie, doll, you wouldn't BELIEVE how frisky working in this outfit has gotten me.</i>\"  You eye over her bodacious figure, planning your course of action.  You can tell she's been sampling her own lust-inducing cakes, and as impossible as it sounds, she looks far more hornier than usual.");
            // [Player gets the 4 options again]
            // Give Anal (Requires cock and no naga or centaur legs.)
            // Receive Anal (Again, no naga or centaur legs.)
            // Blow Job
            // Double-Dick Fuck (requires at least 2 cocks)
            this.menu();
            if (this.player.hasCock() && this.player.cockThatFits(70) >= 0) this.addButton(0, "Give Anal", this.giveKamiTheChristmasRooAnal);
            this.addButton(1, "Receive Anal", this.takeItRooButtStyle);
            this.addButton(2, "Give BJ", this.KamiBlowJob);
            if (this.player.cockTotal() > 1 && this.player.cockThatFits(70) >= 0 && this.player.cockThatFits2(70) >= 0) this.addButton(3, "Doube-Fuck", this.KamiDoubleDickFuck);
        }
        else {
            this.outputText("You summon the buxom waitress over, getting a much better view of her gentle face now that she's found the time to sit and talk with you.  With hazelnut-brown eyes, a gorgeous set of lips and tousled blonde hair, her faux-rebellious look is the icing on the festive cake for this busty waitress, her cute little santa hat being the strawberry on top.  Smooth, olive skin runs halfway down her meaty thighs before fading into soft fur, while her frail forearms follow the same pattern. Her huge kangaroo tail wags idly throughout your conversation, and you've gained a pretty good rhythm whilst engaging her in it. Determined to make things go well, you pause to pull out a charming one-liner when her index finger meets your ");
            if (this.player.femininity >= 75) this.outputText("feminine ");
            else if (this.player.femininity <= 25) this.outputText("masculine ");
            this.outputText("lips abruptly.");
            this.outputText("\n\n\"<i>Stop.  Stay right here.  I'll be right back.</i>\"");

            this.outputText("\n\nThe kanga girl rises and walks into the bakery storage room, appearing again only seconds later with a medium-sized present in her hands.  You'd almost be curious about it, but an even more intriguing 'surprise' catches your eyes directly beneath it in the form of a massive, protruding and honestly, quite blatant, wet bulge that presses against her garments gloriously.  Apparently this waitress is packing a little something extra.");
            this.outputText("\n\nShe places the present in your lap, then scoots backwards to await your response.  You notice her legs twitching agitatedly in anticipation, presumably from the lubricants dripping from between her well-formed thighs.  She's pretty damn aroused right now, by the looks of it.  You decide to open the present at once, opening the lid to reveal... a small, folded note.  You give the kangaroo girl one last glance before you thumb the little message open to see what the fuss is about.");
            this.outputText("\n\nThe note reads: \"<i>\<i>Hey there " + this.player.mf("stud", "babe") + "\</i>.  My name's Kami.  Wanna come out the back and fuck?  It can be my special present to you.</i>\"  She signed it with a winking smiley face");
            if (this.silly()) this.outputText(" and found space to scrawl a little penis in one corner. Clever");
            this.outputText(".");
            this.outputText("\n\nWow, well, that's pretty blunt.  What should you do now?");
            // [Present options, 'Let's go!' and 'Leave']
            this.menu();
            this.addButton(0, "Let's Go", this.chooseLetsGoKami);
            this.addButton(4, "Leave", this.skipOutAfterOpeningKamisBox);
        }
    }

    // [Player chooses 'Leave']
    public skipOutAfterOpeningKamisBox(): void {
        this.clearOutput();
        this.outputText("You politely decline Kami's sexual advances, apologizing before making a turn for the door. You begin to wonder why you didn't buy anything at the bakery.");
        // [Return to Tel Adre, KamiEnc = 1]
        this.flags[kFLAGS.KAMI_ENCOUNTER] = 1;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [Player chooses 'Let's go!']
    public chooseLetsGoKami(): void {
        this.clearOutput();
        this.outputText("You decide to give Kami exactly what she wants - 'tis the season for giving, after all!  You grin approvingly before heading out into the back alley, taking your time to stare at her wobbling ass.");
        this.outputText("\n\nOnce outside, Kami confirms your suspicions by immediately ripping down her tight skirt, sighing softly as her impressive member flops free from her lacy black thong. You wonder how she managed to hide it so effectively with the virtually non-existent piece of lingerie.");
        this.outputText("\n\n\"<i>Ah, so much better!  Come here and ravish me, hon.</i>\" She moans enticingly, stroking her self-made lubricant along her growing thickness.");

        this.outputText("\n\nYou gaze over the situation.  How should you handle this?");

        // [Player given 4 options:
        // Give Anal (Requires none-tentacle cock and no naga or centaur legs.)
        // Receive Anal (Again, no naga or centaur legs.)
        // Blow Job
        // Double-Dick Fuck (requires at least 2 cocks)
        // Note: I don't know much about vaginal or anal capacities so just give her general ones similar to Izma or Urta. ]
        this.menu();
        if (this.player.hasCock() && this.player.cockThatFits(70) >= 0) this.addButton(0, "Give Anal", this.giveKamiTheChristmasRooAnal);
        this.addButton(1, "Receive Anal", this.takeItRooButtStyle);
        this.addButton(2, "Give BJ", this.KamiBlowJob);
        if (this.player.cockTotal() > 1 && this.player.cockThatFits(70) >= 0 && this.player.cockThatFits2(70) >= 0) this.addButton(3, "DoubleFuck", this.KamiDoubleDickFuck);
    }

    // [Player chooses 'Give Anal']
    public giveKamiTheChristmasRooAnal(): void {
        this.clearOutput();
        const x: number = this.player.cockThatFits(70);
        this.outputText("You head briskly towards the voluptuous waitress, rearing her around by the wrists and pressing her against the wall.  \"<i>H-Hey, wait!</i>\" Kami yelps, but you sense excitement in her delicate plea.");

        this.outputText("\n\nIntent on being the dominant partner, you spit on one of your fingers and slide it into her tight asshole at once, prepping it for your oncoming invasion.  Freeing just enough room in your garments for your own member to breathe, you waste no time at all in aligning your fuck-stick underneath her thick kangaroo tail and right between her rosy asscheeks. Kami invites you into her ass as seductively as she can, swaying her ample thighs and massaging her pucker against your cock-head aggressively.  \"<i>Be at least a bit gentle, doll,</i>\"  she coos seductively in your ear, giving you the green light for a full-on pounding as your cock sinks into her heart-shaped butt and unleashes hell.");

        this.outputText("\n\nKami squeals between each of your dominating thrusts");
        // [If player has balls]
        if (this.player.balls > 0) this.outputText(", your balls slapping against her with every push");
        this.outputText(".  \"<i>Anh! No! Ah!</i>\"  She winces between each thrust, your [hips] doing little to help as they pick up the pace.  You continue pounding her ass for as long as you can, briefly releasing her wrists to give her bubble-butt a hard smack.  Kami's passage is warm and moist with your pre, and it isn't long before you find your cock sliding in and out of your slut's snug ass-tunnel as if it was made for you.  Eventually, Kami's vice-like grip on your " + this.player.cockDescript(x) + " loosens, and she begins lose herself to your dominating display.  Swaying her head side to side in enjoyment, you fuck her raw and hard - her hat bobbing up and down in a manner as hypnotising as her jiggling flesh.  You pull her to the ground to give her your final few thrusts before you churn out your spunk, falling over her and weakly bucking like some manner of beast.");

        this.outputText("\n\n\Kami squeals excitedly as she reaches her own climax underneath you, tugging rapidly on her precum-soaked herm cock, milking it like crazy onto the ground beneath her.  You can feel her dripping fem-sex mesh against your own [sack] as you empty into her tight passage.");

        // {If cum quantity = light, medium}
        if (this.player.cumQ() < 1000) this.outputText("  \"<i>Mmm... just like that, babe,</i>\" Kami moans submissively, her asshole clenching one last time before you pull out and climb off your satiated conquest, your " + this.player.cockDescript(x) + " still dripping creamy white spunk.");
        // {if cum quantity ≧ heavy}
        else
            this.outputText("  One of Kami's hands flies from her dick to her suddenly swollen belly as your mighty seed gushes forth.  The unexpectedly heavy girl sinks further into the ground, your load swishing back up and loosening her tunnel around you and forcing you to remove your still-spewing " + this.player.cockDescript(x) + " before something unfortunate happens.  Semen starts tumbling out as soon as you dismount your kangaroo conquest, but judging by the slow pace, she's going to look heavily pregnant for a while.");

        this.outputText("\n\n\Replacing your clothes, you give Kami one last glance over before you leave.  She's lying happily encumbered on the floor, covered in a combination of your fluids.  She'll probably be good to head home later - that is, if she can still walk.");
        // [Player heads back to camp, An hour passes, Lust is reduced to zero and KamiEnc = 1]
        this.flags[kFLAGS.KAMI_ENCOUNTER] = 1;
        this.player.orgasm('Dick');
        this.dynStats("sen", -2);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [Player selects 'Receive Anal']
    public takeItRooButtStyle(): void {
        this.clearOutput();
        this.outputText("You wink at the stacked waitress, turning around and planting your [chest] against the alley wall submissively.  Quickly removing your [armor], you turn to give your advancing lover a smile - but you're quickly caught off guard by the kangaroo girl's phallus plunging towards and into your [butt] at full speed.");
        this.player.buttChange(24, true, true, false);

        this.outputText("\n\n\"<i>Oh shit!</i>\" she cries, her plump hips pistoning into your [asshole] recklessly.  You estimate at least eight inches of her meaty member are inside with the first few thrusts alone, not including however many she's already trying to squeeze in. You feel her thick tail brush along your thighs, shivering as she whispers into your ear. \"<i>I'm going to pump you so full of cum, you'll be out of commission for weeks, doll.</i>\"   You try to focus your attention on absorbing her powerful thrusts, gradually easing into it as her lubricants soften up your hot passage.  Eventually, at least 14 inches of pure cock slams deep into your pucker. With every buck, her balls ricochet off ");
        if (this.player.balls > 0) this.outputText("your own");
        // [Else if have vagina]
        else if (this.player.hasVagina()) this.outputText("your pussy");
        // [Else if neither]
        else this.outputText("your taint");
        this.outputText(".  Each time, the waitress fondles your form with her eager hands.  ");

        this.outputText("\n\n");
        // [If player has pussy]
        if (this.player.hasVagina()) this.outputText("Your cunt oozes in return, envious of the tenderized hole above it.  ");
        this.outputText("You dedicate a few more minutes to soaking up every moment of her animalistic romping, savoring the feeling of a hung rod in your punished posterior.  Your climax quickly comes to loom over you, however, the potent, ");
        if (this.player.hasCock()) this.outputText("prostate");
        else this.outputText("ass");
        this.outputText("-numbing sensations at your rear becoming too much to bear.  Slamming back into Kami's pole one last time, you breathe a shuddered sigh of relief as your orgasm takes over, the sensation spreading throughout your entire body like electricity.");
        // [If male]
        if (this.player.hasCock()) this.outputText("  Your pent-up cock ejaculates there and then, shamelessly gushing sloppy semen against the wall in front of you.");
        // [If female]
        if (this.player.gender == 3) this.outputText("  Meanwhile, y");
        else if (this.player.hasVagina()) this.outputText("Y");
        if (this.player.hasVagina()) this.outputText("our eager pussy buckles in arousal, gushing fem-juices on the floor below you.");
        this.outputText("  You're truly spent.");

        this.outputText("\n\nKami, on the other hand, needs a tad more encouragement.  She desperately diddles her unused slit for as long as she can take it, her own belated orgasm finally erupting messily into your asshole moments later.  \"<i>Oh doll, I - ungh - needed that more than anything.  If you come back before the end of winter, we should definitely try this again.</i>\"  You give a thumbs up in approval of Kami's idea, turning around to head back to camp. Before you go, however, you take the opportunity to get a good squeeze of her ample tits, quickly taking off with complete satisfaction.");
        // [Player heads back to camp, An hour passes, Asshole tightness is reduced, Lust is reduced to zero and KamiEnc = 1]
        this.player.orgasm('Anal');
        this.dynStats("sen", 1);
        this.doNext(this.camp.returnToCampUseOneHour);
        this.flags[kFLAGS.KAMI_ENCOUNTER] = 1;
    }

    // [Player selects 'Blow Job']
    public KamiBlowJob(): void {
        this.clearOutput();
        // [If player is none-Naga]
        if (!this.player.isNaga()) this.outputText("You get down on your knees");
        // [Else if is Naga]
        else this.outputText("You steer your serpentine half into position, leaning your upper body within arms reach of Kami's wanting member.  You reach out");
        this.outputText(" and grab the thick rod impulsively with your hand, all 14 inches of the slick tool in your firm grasp.  Kami giggles in approval as you take the first few licks of the phallus, jerking your hand up and down its length slowly.  \"<i>Mmm... someone knows what they're doing.</i>\"  You spit on the head of her thick cock, smearing the improvised lubricant all over her girth generously, her digitigrade legs crossing and twitching agitatedly in response.  \"<i>Oh god hurry up and put it in your mouth already!</i>\"  You grin at her impatience, teasing her tip a bit longer before finally knuckling down.  Her first few inches slide in with much resistance, fresh saliva coating the shaft and easing her in against your tonsils smoothly and without fuss.");

        this.outputText("\n\nThe reaction you get from her, however, is much more spontaneous - Kami's kangaroo toes curl out while she moans enthusiastically.  The joy of having her length engulfed by your tight throat is painted plain on her face as much as you are buried into her crotch.  Throttling your head forward, Kami groans.  Her warm precum already starts to spill against your bottom lip, a little spooge dribbling out sloppily every time you pull back.  You reach behind her large member and spear her two holes with a finger each, drilling your two digits inside her erogenous pockets with lustful intent.  \"<i>W- oh god!</i>\"  She cries, your stimulation apparently too much for her to handle. Kami's tight pucker clamps down hard as her fem-sex and cock erupt simultaneously, soaking cum against both your active finger and the back of your throat.");

        this.outputText("\n\nYou gulp down her load without a sweat, pulling your fingers free from Kami's wetness. You allow Kami's soft, delicate lips to envelope and smother your own, giving her a taste of her man-milk in return.  You give her a seductive wink before finally pulling away to put on your garments, but Kami insists on your attention to apologize.  \"<i>Hey, uh, sorry for cumming so early there - if it's any consolation, that was amazing!  Next time you should be the one taking charge, doll.</i>\"  You beam at Kami, the waitress pecking you on the cheek before you head back to camp.");
        if (this.player.hasCock()) this.outputText("  You think you might still need to find an outlet for that itch of yours, with [eachCock] still erect and needing release.");
        this.dynStats("lus", 20 + this.player.lib / 10 + this.player.sens / 10);
        // [Player heads back to camp, An hour passes, Lust = + 40 and KamiEnc = 1]
        this.flags[kFLAGS.KAMI_ENCOUNTER] = 1;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public KamiDoubleDickFuck(): void {
        // [Player selects 'Double-Dick Fuck']
        const x: number = this.player.cockThatFits(70);
        const y: number = this.player.cockThatFits2(70);
        this.clearOutput();
        this.outputText("You chuckle heartily - of course you're going to ravish her!  How ridiculous to assume otherwise.  In a split second, you've already grabbed her by her arms, forcing her back against the wall.  Kami passionately yelps, but her eagerness to grind against your growing package reveals her true intentions.");
        this.outputText("\n\nTaking the initiative, you hold the waitress by the throat whilst you free room in your [armor] for your succulent snatch-hungry sausages.  Wasting no time at all, you align your rock-hard rods underneath her huge phallus and directly at her needy orifices, moving your hands underneath her legs and lifting her slightly to add leverage for yourself.  Kami pants in anticipation, gently pressing herself against your cockheads in an attempt to entice you.  Ever the tease, you notice the waitress gasp between her delectable lips.  \"<i>Are you gonna put those fine-ass rods to use, or do I have to do it myself?</i>\"  Not about to disappoint, you push into her, penetrating the soft confines of her pussy before reaching into her tight little ass, slowly but steadily plunging further and further inside until your needy tools can't reach any further.  \"<i>F-Fuck!  Drill me hard!</i>\" she cries desperately.");
        this.outputText("\n\nRearing out slower than you had entered, her hips support yourself as you dive your way back in, slowly speeding up the frequency of your thrusts each time.  As you aggressively pump into your new kanga-slut, you force the waitress to press further against the alleyway wall behind her, her arms spreading out while her pillowy chest is squished against the brick.");
        this.outputText("\n\n\"<i>I could do this all goddamn day!</i>\"  Kami screams, your wicked thrashing leaving her pelvis moist with sheer bliss.  You can already feel your own orgasm approaching, so with due haste you grab Kami's ample bust and pick up your thrusts energetically, ramming your cocks home with as much speed as you can muster.  Your ass-engorged " + this.player.cockDescript(x) + " cums first, packing Kami's tight hole with your sticky seed, shortly followed by your other " + this.player.cockDescript(y) + " giving her delicate-yet-punished pussy the same treatment.");

        this.outputText("\n\nKami is only seconds behind, her figure leaning forward into your arms and spasming up against you in a sexual seizure.  \"<i>Oh my god!</i>\"  The 'roo girl squeals, her tongue lolling out in intense arousal as her 14 inch cock spurts its pent-up frustration all over your abdomen.  You can feel the fur on her thighs standing briefly on end as she coils them around you, the sensation gradually fading away slowly as her frantic panting slows down.");

        this.outputText("\n\nYou gather your thoughts for a second, exhausted from the actual ordeal.  You slowly put back your [armor] while sharing an appreciative farewell to the now-satiated waitress - of who is panting so profusely she can't even return the gesture.");
        // [Player heads back to camp, An hour passes, Lust is reduced to zero and KamiEnc = 1]
        this.player.orgasm('Dick');
        this.dynStats("sen", -3);
        this.flags[kFLAGS.KAMI_ENCOUNTER] = 1;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [Player can choose 'Winter Pudding']
    public getWinterPudding(): void {
        this.clearOutput();
        if (this.player.gems < 35) {
            this.outputText("Sadly, the pudding isn't free, and it looks like you don't have the 35 gems you'd need to try a bite!");
            this.doNext(this.getGame().telAdre.bakeryScene.bakeryuuuuuu);
            return;
        }
        this.player.gems -= 35;
        this.statScreenRefresh();
        this.outputText("You opt for a slice of the tasty treat - you've only got until the festivities wade away, so you might as well take one now!  Do you eat the treat or save it for later?\n\n");
        this.menu();
        this.addButton(0, "Eat", this.eatWinterPudding).hint("Eat the delicious Winter Pudding. It looks so irresistible...");
        this.addButton(1, "Take", this.inventory.takeItem, this.consumables.W_PDDNG, this.getGame().telAdre.bakeryScene.bakeryuuuuuu, undefined, "Bring the pudding with you.");
    }

    private eatWinterPudding(): void {
        this.consumables.W_PDDNG.useItem();
        this.doNext(this.getGame().telAdre.bakeryScene.bakeryuuuuuu);
    }

    // 4. Donto's Polar Pete
    // Random Holiday plains encounter
    public polarPete(): void {
        this.clearOutput();
        this.outputText("As you travel through the plains, something seems to be off the further you continue to walk.  Soon your breath mists in front of your mouth, and you hug yourself as the temperature seems to drop.  As you look up, flakes of pure white fall from above.  The ground at your feet is littered with frost and dusted with snow, and you feel a chill run up your spine as you adjust to the colder weather. Something unnatural seems to be affecting the area.");
        this.outputText("\n\nWith a crunch of snow, you turn your head to see a large figure in the distance.  The flurry of snowfall blurs your vision, though it seem to be getting closer.  Once it's close enough, you can make out what it is.");
        this.outputText("\n\nWalking towards you is a rather large man - from far away he seemed to simply be a tall human, but as he gets closer you can tell something is off.  He is hairy, very much so, as his body is covered in short white fur.  Rounded ears peek out of his crown of white hair, the color matching his rugged, short boxed beard.  A smile on his lips at the sight of you, his muscled arms heft a large sack hung over his shoulder.  The strange man seems unperturbed by the weather, perhaps because he is wearing a large crimson coat lined with white fur and matching pants.  His big black boots crunch the snow underfoot.");
        this.outputText("\n\n\"<i>Happy holiday!</i>\" His deep voice bellows out to you, and despite your unease, the strange male gives off a sense of... jolliness.  You can't help but feel a bit happier simply looking at him - he certainly seems happy to see you.");
        this.outputText("\n\n\"<i>I had hoped to run into someone like you on my trip.  I've got a lot of stops to make, many gifts to give.</i>\"  His arm sets the large sack down in the snow next to himself.  You take a closer look and can make out square bulges in the large brown bag.  \"<i>My name's Polar Pete,</i>\" he says, his lips curling into a confident grin.");

        this.outputText("\n\n\"<i>And for you, I have a very special package, just for the good boys and girls.</i>\"  His large furred hand lewdly cups over his groin, making his bulge more pronounced as he stretches the fabric of his pants.  You can see the girth of his 'candy cane' hanging limp over his heavy sack.  His eyes give you a lurid gaze, an expectant twinkle in his eyes.  \"<i>Come over and unwrap it.</i>\"  His low voice makes goosebumps crawl over your skin.");
        // Open options Leave, Unwrap
        this.menu();
        this.addButton(0, "Unwrap", this.unwrapPolarPete);
        this.addButton(4, "Leave", this.leaveDisFukkinPolarBear);
    }
    // Unwrap
    public unwrapPolarPete(): void {
        this.clearOutput();
        this.outputText("The temptation too strong, you walk closer to Pete.  Sinking down to your knees before him as he adjusts his hips to your level.  Your hands on his crimson pants, pulling them down with bated breath.  His dark ebony length flops free, long and swollen with heat before your nose. Your hand rubs along it's smooth black surface coaxing a pleased groan from Pete.");

        this.outputText("\n\n\"<i>Give my south pole a good shining,</i>\" he purrs.  You lift up the rapidly swelling candy cane to get a good look at Pete's shaved sack.  Your face leans forward to lick your tongue over Pete's balls, his musky scent fresh on your lips.  Pete must have been walking a long time with little breaks, you can taste a small amount of sweat on his loins, his scent heavy with neglect and need.");

        this.outputText("\n\nYour eyes look up to see his head tilted back, his mouth open wide as he bellows out a guttural groan.  You continue to spit shine the festive man's sack, the cold air contrasting with the warmth of his loins and your mouth.  The warmth of your saliva lingers as your lips brush over the base of his black length, and you give the stiff cock a few strokes with your hand.  You take a moment to feel just how long Pete has gotten, he's so thick you can't completely wrap your fingers around him.");

        this.outputText("\n\nYour tongue runs along the long black cock, reaching the cockhead to kiss it with your lips.  His foreskin folds over most of his cockhead, the tip peeking out with a pearl of milky white at it's slit.  The scent of peppermint mixes with his musk, you catch the precum with your tongue, letting out a pleased hum as you taste sweet minty freshness.");

        this.outputText("\n\nPete's hand nestles in your [hair], egging you on insistently.  You slip your tongue under his foreskin, swirling it under the flap of skin, tasting a strong tang of sweat and musk.  The teasing of his cockhead makes his moans all the louder, his candy cane fully erect in your grip and dripping with precum.");

        this.outputText("\n\n\"<i>I got something more for a perfect little cocksucker, work real hard and it's all yours.</i>\"  Pete smiles, his half lidded gaze on you.  With his words, you wrap your warm lips around his girth, taking the minty cock into your mouth as your tongue continues to slither over the drooling cockhead.  Your hands pumping along the smooth black shaft as you suckle on his cock, his heavy sack swaying as his hips rock, nudging his length to thrust gently into your hot mouth.");

        this.outputText("\n\nSoon his length is bumping the back of your throat, you snake your tongue along the underside of his shaft as he shoves his fat cock down your throat.  He gives a jolly chuckle as he takes the reins.  His hands move your head along his slick ebony cock, his hips pressing to your face.  He takes a few steps forward, before beginning to thrust at a rapid pace, his boots planted firm in the cold snow as he begins to fuck your face.");

        this.outputText("\n\nPanting heavily as his groin rams your face, his fat black sack slapping your chin.  His massive candy cane opens your jaw wide, plunging down your throat as he stretches the silken walls of your insides.  Your throat visibly bulges from the outside as his giant pole plows into your mouth, every inch of his dark dick glistens with your spit mixed with his creamy, mint flavored spunk.");

        this.outputText("\n\n\"<i>Your 'chimney' is so tight and hot, perfect for me to go down.</i>\"  He stares down at you, laughing heartily as he slows his pace.  He watches his black cock slide along your lips, the tight ring of your mouth slurping up his dick, milking it as it tugs and squeezes his stiff flesh.");

        this.outputText("\n\n\"<i>Open wide for your present,</i>\" he grunts, pulling his cock free as your spit still clings to it, his large hand jerking himself off as you hold your face poised and ready.  With a satisfied groan he unloads his christmas cheer all over your face, the snow white load spilling over your cheeks, clinging to your body with a heat that warms your cold body.  He fires a few ropes into your open mouth, the liquid creamy and minty at the same time.  It slides over your tongue as you swallow the thick spunk.  It warms your belly as Pete gives you a pleased grin.");

        this.outputText("\n\n\"<i>That's the holiday spirit.</i>\"  He winks at you slyly.  \"<i>You've been real... good this year [name].</i>\"  You blink as he calls you by name, wondering how he knows it as he rummages through his large sack.  Pete pulls out a gigantic candy cane, bigger than any you've ever seen.  He grins at you as he holds it in one hand, nudging the long straight end to press to your lips.");
        this.outputText("\n\n\"<i>It's a special treat just for you.  Go on, use that wonderful mouth of yours,</i>\" he eggs you on as you comply.  The strange candy cane doesn't feel normal at all, Pete has to angle it to nudge your lips as it isn't as stiff as normal candy.  As you wrap your lips around the thick sugary treat it feels flexible in your lips.  The sweet peppermint flavor washes over your tongue along with something else.  You can't quite pick out what it is, but something mixed in with the special candy is making your skin hot against the cold weather.");

        this.outputText("\n\n\"<i>Yes, that's it. Don't be shy now.</i>\"  Pete gives a jolly laugh as he starts pushing more past your lips.  You give a muffled moan, your lips wrapped tight around the giant confection.  The heat in your body grows, and your loins began to ache.");
        if (this.player.hasCock()) this.outputText("  [EachCock] grows stiff and soaks your [armor] with precum.");
        // (if vagina)
        if (this.player.hasVagina()) this.outputText("  Your [vagina] grows moist, dripping eager juices and soaking your [armor].");

        this.outputText("\n\n\"<i>Oh ho ho ho, seems like you're really enjoying your gift.  Let ol' Polar Pete lend you a hand,</i>\" he says with a twinkle in his eyes as he lays you down in the snow, his free hand stripping you of your [armor].  Despite the cold you can only sigh in relief, your skin so hot it feels like you could melt the ice and snow with ease.  Pete begins to thrust the massive candy cane into your mouth, the flexible treat dipping down inside your throat with ease.");

        this.outputText("\n\n\"<i>Looks like I missed a spot to cram in my Holiday cheer,</i>\" Pete snickers as his free hand pulls apart your [legs] and feels up your [butt].  His fingers rubbing over your [asshole].  He brings his hand to his spit and cum slick cock, and smears the slurry all over his fingers before loosening up your [asshole].  He thrusts his digits in time with the giant candy cane jammed down your throat.  You groan in pleasure helplessly, the addictive candy melting in your mouth and glazing your throat in sweet, arousing goodness.");

        this.outputText("\n\nYou shut your eyes in bliss, and before you know it, Polar Pete slips between your [legs].  His south pole is pushing into your loosened pucker.  \"<i>Oh ho ho..</i>\" he groans as his smooth ebony length slips past your rim and stretches your inner walls.  He leaves the candy cane stuffed in your mouth as he begins to slap his hips against your [butt].  You moan and squirm as Polar Pete goes to town on your [asshole], the warm sticky precum lubing you up as he sinks in further.");

        this.outputText("\n\nHis entire length hilting in you again and again, both your holes stuffed with Polar Pete's gifts.  He rubs his south pole all over your inner confines, angling his thrusts to grind and smear his warm seed against every inch of your chimney.  Your ass cheeks jiggle as his hips ram into them, coaxing muffled moans from your gagged mouth.");
        this.player.buttChange(25, true, true, false);

        this.outputText("\n\n\"<i>Mmm, I'll definitely have to go down your chimney every year.  You're so very good,</i>\" he pants, clouds of mist fogging his face as he exhales deep breaths in the cold air.  He suddenly takes on a brutal pace, the sound of flesh slapping flesh filling your ears as he leans forward and begins to pound away at you with refocused intent.");
        // [(if cock)
        if (this.player.hasCock()) this.outputText("  His continued ramming of your prostate mixed with the addictive candy crammed in your mouth sends you over the edge, [eachCock] shooting out ropes of snow white all over your chest.  Pete eyes you over with a lurid gaze, your face covered in his cum and your body covered in your own.");
        else if (this.player.hasVagina()) this.outputText("  Your [vagina] quivers, the rough thrusting into your [asshole] mixed with the addictive candy in your mouth sending you over the edge.  With a low muffled moan your mound spills your lust over your groin, dripping down to lube Pete's thrusts as well as your [legs].  Pete gives you a lurid gaze.");

        this.outputText("\n\nWatching you writhe in pleasure filled bliss, Pete pounds away at you with a few sharp thrusts.  His ballsack nestles in between your ass cheeks as he buries as much of his south pole into you as possible.  With his ebony cock twitching and unloading into you, he groans loudly, and he pumps your stomach full of his creamy Holiday cheer.  You feel a bit bloated as your stomach bulges.  Pete pulls out as his hot minty spunk spills from your abused [asshole].");

        this.outputText("\n\n\"<i>You've been very good, but it's time for me to go.  Many more people I need to see, so many gifts to hand out,</i>\" Pete chuckles as he pulls the candy cane from your mouth.  He lets you slowly get up and get dressed as he zips up his pants and tucks away the massive candy cane in his pack.  You finish dressing as Pete rummages through his large leather sack for a few moments before producing a box wrapped in brightly colored paper.");

        this.outputText("\n\n\"<i>A little something extra to remember me by.  I'll be keeping an eye out for you next year.</i>\"  He gives you a sly wink as he places the box in your hand.  With that he lifts up his sack and walks off, no doubt to continue his gift giving journey.  You look at the box a moment, unwrapping it to find a crystal bottle filled with a familiar white liquid inside.  You uncork the bottle to smell the familiar minty scent.  You begin wonder why would someone bottle their own seed and give it as a present, though you shrug it off and take the bottle with you as you return to camp.\n\n");

        // Lust sated
        // end encounter
        // Receive \"<i>Peppermint White</i>\"
        this.player.orgasm('Anal');
        this.inventory.takeItem(this.consumables.PEPPWHT, this.camp.returnToCampUseOneHour);
    }

    // Leave
    public leaveDisFukkinPolarBear(): void {
        this.clearOutput();
        this.outputText("You've decided not to trust the stranger, with a nod of your head you walk away from the man.  \"<i>Wait!  Before you go...</i>\" he speaks as he moves his massive sack in front of himself with a huff.  He leans forward, his upper body rummaging through the sack before reappearing.  He hands you a brightly wrapped gift.");

        this.outputText("\n\n\"<i>A little something from me,</i>\" he says with a bright smile.  Despite your hesitation, something about this gesture seems genuine.  You nod your head taking the gift from him and leaving after a simple word of thanks.  You unwrap the gift after returning to a normal climate, inside you find a small crystal bottle filled with a white liquid that looks strangely familiar.  Popping the cork and smelling the contents fills your nose with the refreshing scent of mint. It smells delicious, though you resist the temptation and cork the bottle again.  You take it with you back to camp.\n\n");
        // Receive \"<i>Peppermint White</i>\"
        this.inventory.takeItem(this.consumables.PEPPWHT, this.camp.returnToCampUseOneHour);
    }

    // 5. Third's Nieve
    // Winter Snowfall
    // Accessible after sleeping as long as it's Winter (December - February)
    public nieveHoliday(): boolean {
        return this.date.month == 11 || this.date.month == 0;
    }

    public snowLadyActive(): void {
        this.clearOutput();
        this.hideMenus();
        this.outputText("A chill pervades the air as you awaken, making you shiver.  You open your eyes blearily, looking around the camp, until your gaze falls onto a solid white patch of earth. Its bright, glittering white actually hurts your eyes for a second, as you're so used to the dark, hellish red that surrounds you.");

        this.outputText("\n\nYou stand up from your bedroll and walk towards the shimmering patch of white.  Could this be some sort of trap, laid by the demons?  What could it possibly be? As you approach you realize the white is not only on the ground... it's falling from the sky.");
        this.outputText("\n\n<b>Snow!</b>");

        this.outputText("\n\nYou dash into the frosty area, delighting in the familiar crunch of snow underfoot.  More snowflakes float down, landing on your " + this.player.skinFurScales() + " and melting immediately.  For just a moment, you feel like a kid again, twirling and spinning in the flurry, sticking your tongue out and tasting the flakes, you swear you can almost smell the fresh baked winter delights of your village.  As the nostalgic feeling fades, you hear a slight jingling in the air, far off in the distance, followed by a hearty, jolly laugh.");

        this.outputText("\n\nYou lay down in the snow, waving your arms and legs to make a quick snow angel as you think about all the things you could do with this holiday gift.  You think back to your childhood, and kids making snowmen after a fresh snowfall.");

        this.outputText("\n\nSitting up in the glittering field of white, you figure you've got enough here to make a decently sized snowman.  For materials... sticks for the arms, of course, are freely available around you, and you're certain you've got a few old rags around for a scarf.  For the eyes, all the kids in Ingnam used coal, but you figure gems would also work. The nose, you think to yourself, would be the trickiest, where to find a carrot in this place?");

        this.outputText("\n\nThinking over the logistics of the snowman, you head back into the camp proper.");

        // (Adds \"<i>Snow</i>\" to the Stash or Lover menu)
        this.outputText("\n\n('Snow' added to the <b>Items</b> menu!)");
        this.flags[kFLAGS.NIEVE_STAGE] = 1;
        this.doNext(this.playerMenu);
    }

    // Creation!
    // Accessed from \"<i>Snow</i>\" at the Lover or Stash menu.
    public nieveBuilding(): void {
        this.clearOutput();
        // First Step: The Body
        if (this.flags[kFLAGS.NIEVE_STAGE] == 1) {
            // Consumes an hour of time.
            // This determines the sex of Nieve once she's complete.
            this.outputText("You head back over to the snowy patch by your camp.  The crunch of snow again makes you feel just a little nostalgic, and you think of drinking hot cocoa topped with marshmallows.  With a smile on your face, you set about rolling up the soft powder-like crystals into a huge ball.  It takes some effort, but after a while you're left with a large ball of snow, which will serve as the perfect base.");
            this.outputText("\n\nYou set yourself to making the second section, the torso.  It takes less time, but then you have to haul it up onto the base without it falling apart.  You take your time, though, and everything goes smoothly.");
            this.outputText("\n\nFinally, the head.  You make yet another small ball of tightly packed snow and place it upon the tower, and stand back to look at your creation.  You grab a couple sticks nearby and grab a piece of torn cloth from your camp, placing them all on the snowman to make arms and a scarf.  It's a pretty good piece of work.");
            this.outputText("\n\nSuddenly, a naughty thought strikes you. You could probably make this snowman into a snowwoman if you wanted to.");
            this.menu();
            this.addButton(0, "Snowwoman", this.nieveSnowWoman);
            this.addButton(1, "Snowman", this.nieveSnowMan);
            // [Snowwoman] [Snowman]
        }
        // Second Step: Eyes & Mouth
        // Alters Nieve's eyes in scenes
        else if (this.flags[kFLAGS.NIEVE_STAGE] == 2) {
            this.outputText("You approach your snow" + this.nieveMF("man", "woman") + " again, looking it over.");
            this.outputText("\n\nIt still needs eyes and a mouth.  Coal is the best option, but who knows how common that is around here?  Gems, you decide, are an acceptable stand-by.  It'd probably take 9 gems to complete, two for the eyes and seven for the mouth.");
            // [Coal (Only available if PC has coal)] [Gems]
            this.menu();
            if (this.player.hasItem(this.consumables.COAL___)) this.addButton(0, "Coal", this.nieveCoalEyes);
            this.addButton(1, "Gems", this.nieveGemEyes);
            this.addButton(4, "Back", this.camp.returnToCampUseOneHour);
        }
        // Fourth Step: The Nose
        else if (this.flags[kFLAGS.NIEVE_STAGE] == 3) {
            this.outputText("You approach your nearly finished snowman. To others, it might be a perfectly acceptable creation, but not to you. It needs a carrot to finish it off.");
            // (If PC has the carrot)
            if (this.player.hasKeyItem("Carrot") >= 0) {
                this.outputText("\n\nLuckily, you've got the perfect one, courtesy of Whitney's farm.  You quickly wash it up and snip the tail end of it off before sticking it right into the center of the snowman's face.  Nostalgia flows over you as you stand back to admire your handiwork.  You feel as if you've brought a little of Ingnam into this strange land, a little bit of cheer into this desolate landscape.");
                this.outputText("\n\nYou enjoy the presence of your new snowman creation for a while, and then return to your camp with a little smile laid out on your face.");
                this.flags[kFLAGS.NIEVE_STAGE] = 4;
                this.player.removeKeyItem("Carrot");
                this.outputText("\n\n(Removed Key Item: Carrot)");
            }
            // (Else)
            else {
                this.outputText("Unfortunately, you've yet to find one in your adventures.  You suppose you'll have to look more carefully.  Who knows, there might be a farm right under your nose.");
            }
            this.doNext(this.camp.returnToCampUseOneHour);
        }
        else {
            this.outputText("Your snowman is done!  There's nothing more to add to it.  It looks mighty fine however, and just looking at it brings a nostalgia-fueled smile to your lips.");
            this.doNext(this.camp.returnToCampUseOneHour);
        }
    }
    // Coal
    // Add to previous text if possible?
    public nieveCoalEyes(): void {
        this.clearOutput();
        this.player.consumeItem(this.consumables.COAL___);
        this.outputText("Luckily, you happen to have two lumps of coal.");
        this.outputText("\n\nYou split the coal into smaller chunks, and place them evenly around the Snowman's face, creating a nice, vacant smile.  It still needs a nose, however, and for that, you'll need a carrot.  Perhaps there's a farm nearby, or maybe you could buy one somewhere?");
        this.flags[kFLAGS.NIEVE_MOUTH] = "coal";
        this.flags[kFLAGS.NIEVE_STAGE] = 3;
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    // Gems
    // Add to previous text if possible?
    public nieveGemEyes(): void {
        this.clearOutput();
        if (this.player.gems >= 9) {
            this.outputText("Taking a handful of gems out of your pouch, you spread them evenly around the Snowman's face, giving it a nice, vacant smile.  It still needs a nose, however, and for that, you'll need a carrot.  Perhaps there's a farm nearby?");
            this.player.gems -= 9;
            this.statScreenRefresh();
            this.flags[kFLAGS.NIEVE_MOUTH] = "gems";
            this.flags[kFLAGS.NIEVE_STAGE] = 3;
        }
        // Too broke to use the gems option? What the fuck is wrong with you?
        else {
            this.outputText("You open up your pouch, and frown.  Unfortunately, you don't have enough gems to create the eyes and mouth. With a sigh you march your broke ass back to camp.");
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Snowwoman
    public nieveSnowWoman(): void {
        this.clearOutput();
        // Add to existing text if possible, rather than a new window?
        this.outputText("You grin mischievously to yourself and set about making two more balls of powdery snow.  It takes less time than any of the others, and before you know it you've attached two icy-breasts to the snowman.  They aren't terribly big, any heavier and you're sure they'd fall off, but they get the point across.");
        this.outputText("\n\nYour snowwoman still needs a face, of course, but you'll leave that until later.  For now, you head back into the main part of camp.");
        this.doNext(this.camp.returnToCampUseOneHour);
        this.flags[kFLAGS.NIEVE_STAGE] = 2;
        this.flags[kFLAGS.NIEVE_GENDER] = 2;
    }
    // Snowman
    // Add to existing text if possible, rather than a new window?
    public nieveSnowMan(): void {
        this.clearOutput();
        this.outputText("You decide to leave it as is. Not everything has to have breasts, of course, even in Mareth.");
        this.outputText("\n\nYour snowman still needs a face, of course, but you'll leave that until later.  For now, you head back into the main part of camp.");
        this.doNext(this.camp.returnToCampUseOneHour);
        this.flags[kFLAGS.NIEVE_STAGE] = 2;
        this.flags[kFLAGS.NIEVE_GENDER] = 1;
    }

    // Third Step: Carrots!
    // Available at Whitney's Farm.
    // Reqs NIEVE_STAGE == 3
    public findACarrot(): void {
        this.clearOutput();
        this.outputText("As you explore the farm, you come across several rows of green plants.  Getting closer, you recognize them... carrots!  You pull one of them from the ground.  It's expectedly dirty, but bright orange, and straight enough to be the perfect nose for your snowman.");
        this.outputText("\n\nWhitney passes by, and you ask if you can take the carrot.  She just shrugs, \"<i>Sure, hun.  I need to clear out that crop to make room for more peppers anyhow.</i>\"");
        this.outputText("\n\nYou stash the carrot away with a smile.  You've got a nose for your snowman!");
        this.outputText("\n\n(Gained Key Item: Carrot)");
        this.player.createKeyItem("Carrot", 0, 0, 0, 0);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public nieveMF(Man: string = "", Woman: string = ""): string {
        if (this.flags[kFLAGS.NIEVE_GENDER] == 1) return Man;
        else return Woman;
    }

    // IT'S ALIVE!
    public nieveComesToLife(): void {
        this.clearOutput();
        this.flags[kFLAGS.NIEVE_STAGE] = 5;
        this.outputText("You awaken with a shiver.  A chill is in the air again, and in the distance you can make out a jolly laugh and jingling bells.  You bolt upright, looking in the direction of the snow pile, expecting a new flurry.  Sadly, there doesn't seem to be any new snow, nor is any coming down.  Frowning, you stand and approach the snow drift.");
        this.outputText("\n\nThere's nothing to indicate any visitors through the night...  Except, wait...  Your snow" + this.nieveMF("", "wo") + "man is gone!  Did someone destroy it while you slept?");
        this.outputText("\n\nCreeping closer to the snow pile, you believe you may have found the culprit.  A pale blue humanoid, and thoroughly unclothed, shape lies in the soft white expanse, right where your snowman used to be.");
        if (this.flags[kFLAGS.NIEVE_GENDER] == 1) this.outputText("  It appears to be male, judging by the modestly sized cock sprouting from its loins.");
        else this.outputText("  It appears to be female, judging by the modestly sized tits on its chest, and the lack of a penis, which is quite a feat in Mareth.");
        this.outputText("  Pure white hair spills down from its head, almost blending in with the surrounding snow.");

        this.outputText("\n\nYou ready your [weapon] and give the naked body a poke with your [foot].  " + this.nieveMF("He", "She") + " opens one eye with confusion, then the other.");

        this.outputText("\n\nA soft, \"<i>Whaaa?</i>\" escapes " + this.nieveMF("his", "her") + " lips.  \"<i>Where am I?</i>\" " + this.nieveMF("He", "She") + " brings a pale blue hand to " + this.nieveMF("his", "her") + " head as " + this.nieveMF("he", "she") + " surveys the red, blighted landscape surrounding you.  \"<i>This isn't home.</i>\"");
        this.outputText("\n\nResponding cautiously, in the event this is all an elaborate trick set up by some demon, you ask who " + this.nieveMF("he", "she") + " is, and where " + this.nieveMF("he", "she") + "'s from.");
        this.outputText("\n\n" + this.nieveMF("His", "Her") + " eyes, ");
        if (this.flags[kFLAGS.NIEVE_MOUTH] == "gems") this.outputText("glittering purple");
        else this.outputText("coal black");
        this.outputText(" orbs, fall on you, as if registering you for the first time.  Then a hint of recognition hits " + this.nieveMF("him", "her") + ".  \"<i>Oh!  [Master]!  You're my [master]!</i>\"  In a flash " + this.nieveMF("he", "she") + "'s standing, looking pleased as punch, with " + this.nieveMF("his", "her") + " hands clasped excitedly in front of " + this.nieveMF("himself", "herself") + ".");

        this.outputText("\n\nNow it's your time to look confused.  You again ask this strange person who they are, and where " + this.nieveMF("he", "she") + "'s from.");

        this.outputText("\n\n\"<i>Oh! I'm from,</i>\" " + this.nieveMF("he", "she") + " frowns.  \"<i>I... I can't remember its name anymore.  The rumors must be true, then.  Once you leave it, you can't remember it.</i>\"  " + this.nieveMF("He", "She") + " sighs mournfully.  \"<i>I can remember snow as far as the eye could see.  Great icy cliffs, like shiny blue and white mountains.  An immense factory making toys.  But I can't remember faces, or names...</i>\"");
        this.outputText("\n\nYou feel sorry for " + this.nieveMF("him", "her") + ", cut off from " + this.nieveMF("his", "her") + " home both physically and mentally, but what does this all have to do with you?");

        this.outputText("\n\n\"<i>Yes!  Right!  I'm an Ice Spirit, my name's Nieve!</i>\" " + this.nieveMF("he", "she") + " says, happily extending an arm.  You introduce yourself and shake the pale blue hand warily, noting the flesh is cold to the touch, but not painfully so.  \"<i>When winter rolls around, and snow falls, we get sent out to random people around the world.  It's our duty to help out in any way... especially sexually.  This, ah, this is my first time out.  You're my first [master].</i>\"");
        this.outputText("\n\nYou raise an eyebrow.  That's new.  You were just sent a love slave, no strings attached?");
        this.outputText("\n\nNieve looks around the red landscape, " + this.nieveMF("his", "her") + " gaze eventually settling on your camp.  \"<i>It's so different here.  Is this where you live?</i>\"");

        this.outputText("\n\nYou nod, though you say you're actually from a village named Ingnam, and explain your mission here in Mareth.  Nieve nods in rapt attention.");
        this.outputText("\n\n\"<i>Wow.  That's great.  You're like a champion or something.  So, Champion,</i>\" " + this.nieveMF("he", "she") + " begins, \"<i>Do you want me to stay?</i>\"");
        // [Y/N]
        this.menu();
        this.addButton(0, "Yes", this.yesKeepNieve);
        this.addButton(1, "No", this.noNoKeepNieve);
    }

    // Yes of course, what do you look like, an idiot?
    public yesKeepNieve(): void {
        this.clearOutput();
        this.outputText("You actually laugh at the question.  Of course you want " + this.nieveMF("him", "her") + " to stay!");
        // [Silly mode:
        if (this.silly()) this.outputText("  A free follower, no worries about buying worthless dye or raising their affection?  Fuck yeah, you'll take " + this.nieveMF("him", "her") + "!");
        this.outputText("  " + this.nieveMF("He", "She") + " doesn't seem to be a threat, and indeed seems sincere in the fact that " + this.nieveMF("he", "she") + " was sent here to be your lover.");
        this.outputText("\n\nNieve beams at you, \"<i>You won't regret it, [name]!  Just give me a little while to set up a cozy place here... then we can get cozy.</i>\"");
        this.outputText("\n\nYou return to your camp proper with a goofy smirk on your face.\n\n(<b>Nieve is now available in the Lovers menu.</b>)");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // No, because I'm an idiot.
    public noNoKeepNieve(): void {
        this.clearOutput();
        this.outputText("You shake your head.  Of course not!  While " + this.nieveMF("he", "she") + " certainly seems like a nice person on the surface, you can't help but think that's just the tip of the iceberg.  For all you know, " + this.nieveMF("he", "she") + "'s a frigid bitch underneath, a trap set by the demons to lure you into a false sense of security.  Clever bastards, you conclude.  They certainly know the best way to serve revenge, but you won't have any of it.");
        this.outputText("\n\nNieve looks disappointed, but nods understandably.  \"<i>I was told not everyone accepts us.  Perhaps I'll find someone more hospitable next year.</i>\"  You shrug, giving " + this.nieveMF("him", "her") + " the cold shoulder.");
        this.outputText("\n\nIn a blinding flash of light, Nieve is gone, and all that remains is the snowman you built.  You can feel the temperature begin to rise, and know that in a matter of hours, there won't be anything left of this icy wonderland.");
        this.flags[kFLAGS.NIEVE_STAGE] = -1;
        this.flags[kFLAGS.NIEVE_GENDER] = 0;
        this.flags[kFLAGS.NIEVE_MOUTH] = "";
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Followers Menu
    // Camp Description
    public nieveCampDescs(): void {
        // 6:00
        if (this.getGame().time.hours == 6) this.outputText("Nieve is sitting cross-legged in the snowdrift, munching on what looks to be icicles.  As you watch, " + this.nieveMF("he", "she") + " reaches down into the glittering powder surrounding " + this.nieveMF("him", "her") + " and produces another one.");
        // 7:00
        else if (this.getGame().time.hours == 7) this.outputText("Nieve is giggling and laughing as a fresh flurry flutters down on " + this.nieveMF("him", "her") + ".  You wonder idly if " + this.nieveMF("he", "she") + "'s causing it to happen.");
        // 8:00
        else if (this.getGame().time.hours == 8) this.outputText("Nieve is sitting in the white wintery wonderland, carefully constructing a snowman.  It strikes you as strange, and almost masturbatory in a way.  " + this.nieveMF("He", "She") + " spots you and gives you a wave and a smile.  For a moment, you think the snowman has too, but you eventually conclude it's your imagination.");
        // 9:00
        else if (this.getGame().time.hours == 9) this.outputText("Nieve is sprawled out in the icy field, creating a series of snow angels without a care in the world.  When " + this.nieveMF("he", "she") + " catches sight of you, she gives a friendly wave, then dives back into the snow.");
        // 10:00
        else if (this.getGame().time.hours == 10) this.outputText("Nieve, the ice spirit, sits quietly at the edge of the snowdrift, looking out at the landscape beyond.  When " + this.nieveMF("he", "she") + " sees you looking, " + this.nieveMF("he", "she") + " gives a somber wave.");
        // 11:00
        else if (this.getGame().time.hours == 11) this.outputText("Nieve is in your camp, poking around your supplies and water barrels. You notice " + this.nieveMF("he", "she") + " seems a little uncomfortable to be away from " + this.nieveMF("his", "her") + " snowdrift.");
        // 12:00
        else if (this.getGame().time.hours == 12) this.outputText("Nieve is carefully compressing snowballs in " + this.nieveMF("his", "her") + " little camp.  To your surprise, " + this.nieveMF("he", "she") + " picks one up and begins eating it like you would an apple.  When " + this.nieveMF("he", "she") + " catches you looking mid-bite, " + this.nieveMF("he", "she") + " gives you a grin with her mouth full, " + this.nieveMF("his", "her") + " cheeks puffed out.");
        // 13:00
        else if (this.getGame().time.hours == 13) this.outputText("Nieve is sitting cross-legged, in the middle of what appears to be an argument with a snowman " + this.nieveMF("he", "she") + "'s just made.");
        // 14:00
        else if (this.getGame().time.hours == 14) this.outputText("Nieve is in " + this.nieveMF("his", "her") + " usual spot, seemingly deep in concentration.  Around " + this.nieveMF("him", "her") + " snow begins to fall slowly, then quicker and quicker, whipping " + this.nieveMF("his", "her") + " hair around wildly.  Although strangely, the air is still where you are.");
        // 15:00
        else if (this.getGame().time.hours == 15) this.outputText("\n\nNieve the ice spirit is whirling around " + this.nieveMF("his", "her") + " area, practicing with what appears to be a translucent blue spear.  " + this.nieveMF("He", "She") + " jabs and thrusts, spins and swipes.  " + this.nieveMF("He", "She") + " may be new to Mareth, but you've got to hand it to " + this.nieveMF("him", "her") + ", it looks like " + this.nieveMF("he", "she") + " could take care of " + this.nieveMF("him", "her") + "self.");
        // 16:00
        else if (this.getGame().time.hours == 16) this.outputText("\n\nNieve is at first nowhere to be seen.  Then you see " + this.nieveMF("his", "her") + " head pop out of a snowdrift.  " + this.nieveMF("He", "She") + " looks around quickly, then leaps into the air, diving head first into another pile of the powdery stuff.");
        // 17:00
        else if (this.getGame().time.hours == 17) this.outputText("\n\nNieve appears to have constructed a firepit constructed from translucent blue logs and rocks.  A vivid blue flame roars in the pit, over which Nieve appears to be roasting... marshmallows?  As you watch " + this.nieveMF("he", "she") + " peels the burnt black skin off a marshmallow, gobbles it down, and begins roasting the rest.");
        // 18:00
        else if (this.getGame().time.hours == 18) this.outputText("\n\nNieve seems to be working on a spear, sharpening it with a jagged piece of ice.  When " + this.nieveMF("he", "she") + " catches sight of you " + this.nieveMF("he", "she") + " waves and gives a friendly smile.");
        // 19:00
        else if (this.getGame().time.hours == 19) this.outputText("\n\nNieve is sitting at the edge of " + this.nieveMF("his", "her") + " icy expanse, staring off at the distant mountains.  You wonder if " + this.nieveMF("he", "she") + "'s looking for home.");
        // 20:00
        else if (this.getGame().time.hours == 20) this.outputText("\n\nNieve is, surprisingly, outside of " + this.nieveMF("his", "her") + " cold camp.  " + this.nieveMF("He", "She") + "'s dancing along the battered, parched ground, calling down snow.  Wherever a flake hits, it's immediately devoured by the thirsty earth.  Is Nieve perhaps trying to... water the ground?");
        // 21:00
        else this.outputText("\n\nYou can hear Nieve sleeping soundly from within a small ice-fort.");
    }

    // Appearance Screen
    public approachNieve(): void {
        this.clearOutput();
        this.outputText("You wave at Nieve, getting " + this.nieveMF("his", "her") + " attention and calling for " + this.nieveMF("him", "her") + ".  The icy spirit-" + this.nieveMF("man", "woman") + " happily walks over, smiling.  " + this.nieveMF("He", "She") + " takes " + this.nieveMF("his", "her") + " time, allowing you to take in " + this.nieveMF("his", "her") + " naked body.");

        this.outputText("\n\nThe ice spirit is about five foot ten inches tall.  " + this.nieveMF("His", "Her") + " skin is a pale blue that reminds you of a frozen-over lake.  Between " + this.nieveMF("his", "her") + " thighs, " + this.nieveMF("he", "she") + " sports " + this.nieveMF("a dark blue human-like cock that appears to be about 9 inches long", "a pair of dark blue pussy lips") + ".");
        // [Silly Mode:]
        if (this.silly()) this.outputText("  And you presume a butthole nestled between " + this.nieveMF("his", "her") + " cheeks, right where it belongs.");
        this.outputText("  " + this.nieveMF("His", "Her") + " stomach is flat and toned, " + this.nieveMF("as is his chest", "and she possesses a pair of perky B-cup breasts") + ". " + this.nieveMF("His", "Her") + " face is the same pale blue as the rest of " + this.nieveMF("his", "her") + " body, though it is off-set by " + this.nieveMF("his", "her") + " glittering, ");
        if (this.flags[kFLAGS.NIEVE_MOUTH] == "coal") this.outputText("dusky black");
        else this.outputText("vibrant purple");
        this.outputText(" eyes and pure white hair, which " + this.nieveMF("barely goes past his ears", "tumbles down past her shoulders") + ".  Much of " + this.nieveMF("his", "her") + " body glimmers with a fine layer of powdered snow or ice.");
        this.outputText("\n\nNieve stops, gives you a friendly hug, and asks, \"<i>What can I do for you, [Master]?</i>\"");
        this.menu();
        this.addButton(0, "Sex", this.nieveSexMenu);
        this.addButton(4, "Back", this.camp.campLoversMenu);
    }

    // Sex Menu
    public nieveSexMenu(): void {
        this.clearOutput();
        this.outputText("What will you do with your oh-so-cool lover?");
        if (this.player.lust < 33) this.outputText("  You aren't quite turned on enough for normal fucking.");
        this.menu();
        if (this.flags[kFLAGS.NIEVE_GENDER] == 2) this.addButton(0, "Lick Her", this.lickNieve);
        if (this.flags[kFLAGS.NIEVE_GENDER] == 1) this.addButton(0, "Suck Him", this.suckNieveOff);
        // Fuck Her
        // Female Nieve
        // Must have a penis or at least a 3.5 inch clit
        // Nieve's capacity is about 130.
        if ((this.player.hasCock() || (this.player.hasVagina() && this.player.getClitLength() >= 3.5)) && this.player.lust >= 33) {
            if (this.flags[kFLAGS.NIEVE_GENDER] == 2) this.addButton(1, "Fuck Her", this.fuckNieve);
        }
        // Get Fucked by Gurumash
        // Male Nieve
        // Any Gender
        // Nieve's cock is 9x1.5
        if (this.flags[kFLAGS.NIEVE_GENDER] == 1 && this.player.lust >= 33) this.addButton(1, "Get Fucked", this.nieveFucksYou);
        this.addButton(14, "Back", this.camp.campLoversMenu);
    }

    // Lick Her
    // Obviously for Female Nieve.
    public lickNieve(): void {
        this.clearOutput();
        this.outputText("You explain your intentions and how you'd like to be the one to give her pleasure.  She looks rather surprised at first, but then she smiles.  \"<i>You want to go down... on me?</i>\"  You nod and she giggles, \"<i>That would be wonderful!</i>\"");
        this.outputText("\n\nYou grab Nieve around the waist, pulling her close for a kiss.  Your tongue explodes into her mouth, as she offers very little resistance.  It feels rather like you're kissing an icecube than a mouth, albeit a soft, fleshy icecube.  Your lips tingle from the cold as you break the kiss.");
        this.outputText("\n\nNieve lays down in the icy field and spreads her legs invitingly, but you don't go for the prize just yet.  Instead you start at her neck, letting your lips latch on to her pale blue skin.  Your warm lips touching her cold, frosty flesh actually causes steam to rise before your very eyes.  With a bit of a smirk, you begin kissing down her body, entertained by the little tufts of steam that rise from every smooch.  You make your way to a nipple and take it into your mouth.  It feels a little like an icecube, hard, wet and cold.");
        this.outputText("\n\nSoon your lips leave the nipple, traveling downwards once more.  Down to her belly button, which you nuzzle for just a moment, and then down further.  You avoid going straight for the vagina again, instead letting your lips caress her thighs, all the way down to her calves.  Switching over to the other leg, you work your way up the calf, up the thigh, and then you finally plant a kiss right on her frosty pussy.  Nieve giggles and squirms a little as you work your lips over her nethers.  You quickly locate the clitoris, an icy nub glittering like a diamond, and begin licking, kissing and rubbing it.");
        if (!this.silly()) {
            this.outputText("\n\nNieve lets out little gasps and sighs as you assault her clit with your tongue.  Not content to leave it at that, you dive in to her frigid, slick cunt, lapping and licking.  ");
            // (Normal/Snake Tongue:
            if (!this.player.hasLongTongue()) this.outputText("It doesn't get far, but elicits squeals of surprise and pleasure from your elemental slave who's already grasping at the snow surrounding her for support.");
            // Demon Tongue:
            else this.outputText("Her eyes widen as you snake your impressive tongue into her. She grunts and squeals with pleasure, hands grasping piles of snow, wishing they were bedsheets.");
            this.outputText("  After a minute of this, you realize you've lost the feeling in your tongue!  Pulling it back into your mouth, you find it warms back up quickly, and then you're at it again.");

            this.outputText("\n\nNot quite willing to let your precious tongue go numb like that again, you focus your attention on her clitoris and all the little sensitive spots along the inner thighs.  While your mouth is drawing her attention elsewhere, you carefully bury two fingers knuckle deep into her frozen fuckhole.");

            this.outputText("\n\n\"<i>Oh!</i>\" she exclaims, her head bolting up to look in your direction.  \"<i>Oohh.  Fuck that's nice,</i>\" she smirks down at you.  The finger-tongue combined assault leaves her writhing in the snow, and she reflexively attempts to back away.  You stare up at her for a second and grab hold of her hips with your free hand, commanding her to sit still with your most authoritative voice.  Nieve lets out a \"<i>meep</i>\" and ceases her squirming... at least for a minute.  After that, her legs and arms are trembling from barely contained pleasure, but she does her best to remain where she is.");

            this.outputText("\n\nRight when you're about to go back down, Nieve says, \"<i>I... I can't take it anymore!</i>\" She sits up, throws her legs around your neck, and in one swift motion you find yourself on your back");
            if (this.player.isTaur()) this.outputText(", or as close to it with your body,");
            this.outputText(" with Nieve straddling your face.  \"<i>Mm, this is much better.  Now you wanted to lick me, [Master]? So... lick,</i>\" she whispers, lowering her chilly cunt down onto your face.");

            this.outputText("\n\nYou try to protest, but all that comes out is a muffled \"<i>Mmmrrrfffgggll!</i>\"  To her credit, Nieve looks a little embarrassed, but shakes her head.  \"<i>This is the only way I can control myself.  Now unless you want to be stuck here all day, [Master], I suggest you put that mouth to work.</i>\"");

            this.outputText("\n\nNot wanting to be buried under this avalanche of quim any longer than you have to, you steel yourself and get to work.  Nieve herself makes it all the more difficult by undulating with every lick, grinding her cunt against your face as she lets out quivering moans.  You grasp onto her thighs with each arm to keep her as still as possible while you eat her out.");

            this.outputText("\n\nThankfully, it doesn't take long. You first notice Nieve's legs tensing up, then her back straightens and her frosted muff begins to tremble and quake around your tongue.  Her grinding grows more and more erratic, until finally she's had enough.  Her powder blue legs squeeze your head, holding you fast while her whole body seems to spasm.  Her back arches, her fingers clamp down on your head, gripping your hair.  From her mouth emits an unearthly, and intensely erotic moan of utter relief.  Oddly, you think you hear BELLS echoing from her throat, but it's hard to tell, being neck-deep in elemental pussy.");

            this.outputText("\n\nTo top it all off, at the same time a gush of glacial girl-spunk spills out onto your face.  You can't help but taste some of it, and you are pleasantly surprised to find it has a strong minty flavor.  You lap at the juices, at least until Nieve finally falls forward, completely spent.  Gratefully, you inhale properly, getting a good whiff of fem-cum and spearmint mingling in the air.");

            this.outputText("\n\nWith a smirk, you get to your feet and survey the situation.  Nieve has collapsed, face down in the icy powder, and there are two rather oddly shaped snow angels.  The smirk turns into a grin as you wipe the juices from your face and head back to camp, leaving Nieve to recover.");
            this.dynStats("lus", 10 + this.player.lib / 10, "scale", false);
        }
        // Silly Mode:
        else {
            this.outputText("\n\nAfter a moment you pause awkwardly.  Nieve lets out half a moan, then raises her head and looks down at you, nestled in her crotch.  There is an embarrassingly long pause, eventually broken by the ice woman's voice, \"<i>Your tongue is stuck to me, isn't it.</i>\"");
            this.outputText("\n\nAnother pause. You let out a muffled \"<i>Yeth,</i>\" and Nieve sighs.");
            this.outputText("\n\nIt takes you the better part of an hour to crawl your way back to the camp proper, you on your hands and knees, tongue stuck firmly to the icy love button.  It's a bit like being walked on a leash, and you find the whole ordeal utterly embarrassing and degrading, but quite arousing.  After the two of you manage your way over to a water barrel");
            // (no Kid A:
            if (this.flags[kFLAGS.ANEMONE_KID] != 1) this.outputText(", Nieve takes a ladle full of water and pours it onto her snatch");
            // Kid A:
            else this.outputText(", your little anemone spawn giggles and laughs at your predicament before finally ladling some water onto your lover's snatch");
            this.outputText(", effectively allowing you to pull your tongue away.");
            this.outputText("\n\nThe both of you thoroughly flustered, Nieve returns to the winter paradise and you go back to your duties.");
            this.dynStats("lus", -5 - this.player.sens / 5);
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Suck Him by Kinathis
    // For male Nieve
    // Any gender
    public suckNieveOff(): void {
        this.clearOutput();
        this.outputText("Looking your chilly companion up and down, you inspect " + this.nieveMF("his", "her") + " snowy features.  The ice spirit's chiseled body and well defined features look like they were cut by a master sculptor.  The wintery spirit notices your critical gaze, shifting to stand tall and look his best for you. Smirking at his actions you can't help but notice his body react to your intimate stare; the dark blue flesh between his legs rising as if it sensed your sexual intent.  Chuckling, you step forward, your hand reaching down to cup the cold swelling cock in your warm hand.  The sheer heat of your touch on Nieve's sensitive, shivery manhood pulls a gasp from him, the spirit now realising just what you're after.");
        this.outputText("\n\nLeaning in you give him a squeeze as you whisper to him, telling the glacial being that you're going to 'thaw his icicle'.  Your words draw a purple blush from his blue cheeks but you can clearly tell he is happy to get such attention from you.  \"<i>You want to pleasure me?  I... I'm honored you want to give me pleasure like this [master], thank you, so much,</i>\" he says as his cold hands slip around you.  Squeezing down, you start to stroke the chilly cock slowly, gently massaging Nieve until his body is ready for you.  Under your soothing, heated touch he soon rises to full attention, the thick shaft achingly hard in your hand as you keep stroking.  Being made of snow and ice, it seems your friend is more than a little sensitive to the heat of your body.  If he likes your hands this much, you're sure he will love your hot, wet mouth.");

        this.outputText("\n\nKneeling down, you look up with a grin before you inhale and blow across the frosty flesh, the soft hot air making him gasp as his hands slide onto your head.  Letting out a snicker at his reaction, you lean in.  Taking his thick member in both hands, you stroke and squeeze it as you take a deep breath, inhaling the spirit's chilly scent of wintery mint.  The oddly fresh scent is almost as relaxing as it is arousing and compelling you to get an even deeper breath of the soothing smell.  Leaning in even more, you press your face against his flesh, taking deep breaths as you push your nose and mouth against Nieve's cold apple sized-balls.  Your hot tongue flicks out to lick those refreshing fertile nuts, his flesh starting to hiss as puffs of steam rise from his snowy skin as a crisp cloud bursts from your arctic associate \"<i>So... So hot...</i>\" he says with a gasp, his hands running through your [hair] as he basks in the pleasure you give him.");

        this.outputText("\n\nEven as you lick and suck on his frozen balls your hands stroke and work the shivery shaft swiftly, the heat of your hands melting flakes of snow and frosty pre into a slick lube for your passionately pleasurable work.  Licking up from those tasty testis, you draw your tongue up the base of Nieve's glacial girth, your lips and mouth stopping only to kiss the thick cool cumvein running up the length you seek to pleasure.  Slurping and sucking your way to the top you plant a deep kiss right on the crown of Nieve's carnal column.  As your tongue slides across the bulging mushroom-like head, drawing pleasure filled moans and gasps from Nieve, you get a taste of him, the frosty spirit actually tasting chilly, refreshing and like mint with just a ghost of sweetness to him.  The unique flavor spurs your oral attentions and makes the act even more delicious for you.");

        this.outputText("\n\nWith Nieve enjoying you so much and with such a pleasant taste to his body you can't help but dig right in.  Licking all over the tip, you sink down, taking his icy spear deep into your hot, wet mouth.  Your tongue lashes out, licking all over the bulging blue beast inside you.  Your hands massage those chilly, orifice clogging balls as you suck and lick your wintry lover.  Unable to help himself, Nieve grips your head, moaning into the air as he pulls you in.  You help him deeper inside you to get at more of your sweet heat and pleasure.  Bobbing your head up and down you suck his cool minty meat down, taking him deeper and deeper until he presses against your throat, the bulbous tip pressing against your warm flesh before slithering down your throat like the minty sausage it is.");

        this.outputText("\n\n\"<i>Ooohhh... Oh so, sooo hot yesssss,</i>\" he hisses out, the scented steam flowing from your mouth like mist as you violate his frozen fuckstick.  The spine tingling pleasure you're giving is clear as pure ice on your lovers face, his cheeks flushed violet, a dazed look of bliss in his eyes as he holds your head in his hands.  From the look of sweet desperate pleasure you can tell he's growing closer and closer to the edge of his eye crossing abyss.  Seeing your snowbound spirit getting so close makes you smile and close your eyes, working harder to bring the wintery friend ever more enjoyment.  Going as deep as you can, your face soon presses against his pelvis as you suck him down like a pro.  Clenching your throat, you swallow around the frigid throbbing member, forcing that big blue dick into a tight hot embrace that makes him let out a deep throaty groan of pure delight.");

        this.outputText("\n\nSucking as hard as you can, you slither your tongue around the length inside your mouth, licking everywhere you can in spite of having your mouth full already.  Cupping those swollen balls in your hands you gently fondle them, massaging them tenderly even as they lurch and swell, their icy payload ready to burst and gush into your mouth already.  Giving you only seconds notice, the pleasure filed gasps warn you of the impending orgasm.  Letting out a long moan of pure ecstasy Nieve blows his minty load inside your mouth.  Pulse after pulse, burst after thick burst of creamy minty cum flows over your tongue and down your throat.  With each gush your tongue is overwhelmed by the strong minty flavor, the thick stuff gushing down your throat to pool inside your stomach.  With his body presumably made from ice and snow, you're unsure as to where he is keeping all this minty cream, more and more gushing until your belly swells just a little under the chilling amount.  Shivering from the icy cum in your tummy you slowly pull back, sucking the last streams of pearly seed from your wintery lover before popping off.");

        this.outputText("\n\nLetting out a deep sigh you grin and look up, wanting to see the look on Nieve's face.  The iceborn man looks like he couldn't be happier, a silly smile on his face as he looks down at you.  \"<i>Oh [Master]... that was amazing, I've never met someone so skilled before.  I hope you're not too cold now,</i>\" he says with a hint of worry, knowing that his body and by extension, his cum, must be quite cold.  Reassuring him you tell your frosty friend you're fine and that he actually tasted pretty good. Looking quite pleased Nieve helps you up before sweeping you up into a squeezing hug.  \"<i>Thank you so much for this, but next time let me do you though, you need to be pleasured as well,</i>\" the elemental spirit says gently before helping you get cleaned up and ready for your adventures.");
        this.dynStats("lus", 10 + this.player.lib / 10, "scale", false);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Fuck Her
    // Female Nieve
    // Must have a penis or at least a 3.5 inch clit
    // Nieve's capacity is about 130.
    // Note for fen/gats: In the interest of fairness, I just wanna say that this scene was unfinished at the time the contest closed.
    public fuckNieve(): void {
        this.clearOutput();
        let x: number = -1;
        if (this.player.hasCock()) {
            x = this.player.cockThatFits(130);
            if (x <= 0 && this.player.hasVagina() && this.player.getClitLength() >= 3.5 && XmasMisc.rand(2) == 0) x = -1;
            else x = this.player.smallestCockIndex();
        }
        this.outputText("You look your naked, icy lover up and down, thinking of all the things you could do to her.  She raises a white eyebrow at you curiously while you take in her statuesque form.  A thin layer of frost covers her flesh, giving her pale blue skin a sparkling, shimmering appearance.  You find yourself getting aroused at all the potentialities.  Your " + this.player.cockClit(x) + " rises to attention as you ponder it, and with a smirk, you finally settle on something.");

        this.outputText("\n\nFirst you disrobe, tossing your clothes aside, and order Nieve onto her knees.  She does so immediately, and without needing to be told what to do, she leans in and grasps your " + this.player.cockClit(x) + " with one hand.  Like the rest of her, Nieve's hands are freezing cold, and though it's a strange sensation at first, it's not at all painful or uncomfortable.  \"<i>Allow me, [Master],</i>\" she says, licking the tip of your " + this.player.cockClit(x) + " with a wet, cold \"<i>schlick</i>\" that makes you shiver.");

        this.outputText("\n\nNot wasting any time, she takes the whole tip into her mouth, swirling her tongue around it with practiced ease.");
        // (If small cock/clit (<6):
        if (x >= 0) {
            if (this.player.cocks[x].cockLength < 6) this.outputText("  \"<i>It's so cute, [Master],</i>\" Nieve says while catching a breath, \"<i>Like a little toy cock.</i>\"");
            // If overly large (>130):
            else if (this.player.cocks[x].cockLength >= 24) this.outputText("  She has to take a breath almost immediately, saying, \"<i>By the fat man's beard this thing is huge.  You must make the rest of this world jealous.</i>\"");
            else this.outputText("  \"<i>Mmm,</i>\" she smacks her lips and takes a quick breath, \"<i>Such a nice example of a candycane right here.  Let's go in for another taste.</i>\"");
        }
        else {
            if (this.player.getClitLength() < 6) this.outputText("\"<i>It's so cute, [Master],</i>\" Nieve says while catching a breath, \"<i>Like a little toy cock.</i>\"");
            else if (this.player.getClitLength() >= 24) this.outputText("  She has to take a breath almost immediately, saying, \"<i>By the fat man's beard this thing is huge.  You must make the rest of this world jealous.</i>\"");
            else this.outputText("  \"<i>Mmm,</i>\" she smacks her lips and takes a quick breath, \"<i>Such a nice example of a candycane right here.  Let's go in for another taste.</i>\"");
        }
        this.outputText("  And with that she dives back down onto your " + this.player.cockClit(x) + ".  Her head bobs and bows, giving the sensation of an icecube running up and down your ");
        if (x >= 0) this.outputText("dick");
        else this.outputText("clit");
        this.outputText(" at great speed.");

        // (Variable depending on dick-type)
        if (x >= 0) {
            // (Human)
            if (this.player.cocks[x].cockType == CockTypesEnum.HUMAN) this.outputText("  Your normal, unaltered cock seems to take on a slight blue tint, although you can confirm it's not going numb.  Quite the contrary, it seems to be getting more sensitive as Nieve's lips roll over it.");
            // (Equine)
            else if (this.player.cocks[x].cockType == CockTypesEnum.HORSE) this.outputText("  Nieve fawns over your horsecock like a cultist praying to a god.  She sucks and kisses, running the tip of her tongue all along the sides until she reaches the sheathe, and then right back up the other side.");
            // (Canine)
            else if (this.player.hasKnot(x)) {
                this.outputText("  Nieve eyes the knot on your cock as though it were a challenge.  She inches down your shaft, getting ever closer.");
                // (Cocksize >40)
                if (this.player.cockArea(x) >= 40) this.outputText("  Eventually, though, she admits defeat and goes back to working your shaft, though she eyes that knot from time to time with no small amount of anger.");
                // (Cocksize <40)
                else this.outputText("  It takes her a few good minutes, but eventually she works her way down and takes the entire knot into her mouth.  She raises her hands in triumph and lets out a \"<i>Mmmmrrrrrpphhh!</i>\" before pulling back for a breath, inadvertently exposing your wet hard cock to the cold, wintery air.");
            }
            /*Cock types
            0 - human
            1 - horse
            2 - dog
            3 - demon
            4 - tentacle?
            5 - CAT
            6 - Lizard/Naga?
            7 - ANEMONE!
            8 - ugliest wang ever (kangaroo)
            9 - dragon
            */
            // (Demonic)
            else if (this.player.cocks[x].cockType == CockTypesEnum.DEMON) this.outputText("  Your purple, demonic shaft pulses and throbs, seemingly immune to the unnatural cold of Nieve's mouth. Seemingly oblivious to its nature, Nieve slavers over each nodule, giving every ridge and bump a kiss and more than just a lick.");
            // (Tentacle)
            else if (this.player.cocks[x].cockType == CockTypesEnum.TENTACLE) this.outputText("  Nieve does not seem put off by your tentacle cock in the least, in fact she confesses, \"<i>It reminds me of a comic I read before coming here.</i>\"  As she fawns over your cock, you're certain you hear whispers of \"<i>Oh, you sexy tentacle beast...</i>\" coming from her mouth when she gets her breath.");
            // (Feline)
            else if (this.player.cocks[x].cockType == CockTypesEnum.CAT) this.outputText("  Though the barbs on your cock are soft and pliable, they reflexively harden up after Nieve's tongue washes over them.  She doesn't pay particular attention to the barbs, but she does seem rather careful not to get one hooked on her lip.");
            // (Lizard)
            else if (this.player.cocks[x].cockType == CockTypesEnum.LIZARD) this.outputText("  Nieve fawns over your scaled and ridged reptilian cock, slurping and smooching up and down its length. It seems a bit more resistant to the biting cold of Nieve's mouth, which is lucky when she backs off, exposing your entire wet, frigid length to the wintery air surrounding you.");
            // (Anemone)
            else if (this.player.cocks[x].cockType == CockTypesEnum.ANEMONE) this.outputText("  Nieve giggles whenever one of your wriggling tentacles stings her, seemingly immune to its effects, and kisses it back.  Soon after she devours your whole length, delighted to feel the sting of your cock in the back of her throat.");
            // (Kangaroo)
            else if (this.player.cocks[x].cockType == CockTypesEnum.KANGAROO) this.outputText("  It takes Nieve a little while to catch on that your cock isn't quite human, and by the time she figures it out, she mutters, \"<i>Huh, that's strange... I thought kangaroos had balls above the cock,</i>\" before shrugging and getting back to work.");
            // (If you add dicks later, placeholder text:)
            else this.outputText("  Nieve works on your mutant cock, spending time working every unique little facet of it.");
        }
        // (Clitoris)
        else {
            this.outputText("  Nieve nuzzles and lavishes your elongated love button, showering it with attention. \"<i>I didn't know clits could get this big,</i>\" she says with wonder in her voice. \"<i>");
            if (this.player.getClitLength() < 5) this.outputText("It's just like a little cock");
            else if (this.player.getClitLength() < 9) this.outputText("It's just like a cock");
            else this.outputText("I bet even men get jealous of this bad girl");
            this.outputText(".</i>\"");
        }
        this.outputText("\n\nEventually you just can't handle anymore and your body tenses.  Your legs lock up, " + this.player.cockClit(x) + " trembling, back arching slightly. Nieve notices this and latches on to the tip just in time as an orgasm rocks your body.");
        if (x >= 0) this.outputText("  Your " + this.player.cockClit(x) + " quivers and spurts cum directly into Nieve's eager mouth, who gulps it down as if she were drinking direct from the tap.");
        this.outputText("\n\nAs you come down from your little orgasmic high, you glance down at the ice woman, ");
        if (x < 0 || this.player.cumQ() <= 250) this.outputText("who has a bit of cum dribbling down her chin");
        else if (this.player.cumQ() <= 400) this.outputText("who has a steady stream of cum pouring from her mouth");
        else if (this.player.cumQ() < 600) this.outputText("who is patting her stomach as though she'd just had a large meal");
        else if (this.player.cumQ() < 1000) this.outputText("whose stomach appears slightly distended from the amount of cum you've poured into her");
        else this.outputText("whose stomach is rather large, like a pregnant woman's, from the sheer amount of cum you've pumped into her gullet");
        this.outputText(".  With a smirk, you tell her it's not over yet.  That was just the appetizer.");

        this.outputText("\n\nWith a command Nieve falls backwards into the white, glittering powder and spreads her legs, revealing her deep blue nethers, wet and slick despite the intense cold of her body.  With a smile spreading across your face, you get down onto your knees between hers, and rub the head of your " + this.player.cockClit(x) + " against her icy cavern.  A chill runs down it and up your spine, but you ignore it. You tease and taunt Nieve's cunt, flicking her joy buzzer ");
        if (x >= 0) this.outputText("with your " + this.player.cockDescript(x) + "");
        else this.outputText("with yours");
        this.outputText(", and just slipping the tip in before pulling out.  You do this until your snowbound lover is biting her lip, squirming with barely contained pleasure.");

        this.outputText("\n\nRight as she begins to open her mouth, to beg you to just stop it and fuck her, you slip your " + this.player.cockClit(x) + " in ");
        // (if too big:
        if (x >= 0) {
            if (this.player.cockArea(x) >= 130) this.outputText("at least as far as it will go, ");
        }
        this.outputText("with a wet \"<i>schluck.</i>\"  The words coming out of her mouth are lost in a loud \"<i>ooohhhh</i>\" as her eyes roll backwards, closely followed by her head.  Her wet pussy grips you tightly, giving you a strange tingling sensation.  Your hot rod combined with her arctic nethers actually causes some steam to rise up, and you're a little captivated to see more tufts of steam rise with every slow, gentle thrust you make.");

        this.outputText("\n\nDeciding to take this to the next level, you take hold of Nieve's legs and lift so that her ankles rest on your shoulders.  You give a soft grunt, moving your grip down to her firm buttocks now raised in the air, and plow away once more.  ");
        if (x >= 0) {
            // ((cocksize 3/Clit 3)
            if (this.player.cockArea(x) <= 7) this.outputText("Your meager penis isn't much, but at this angle you manage to hit all the right places.  Soon Nieve is wriggling around, eyes staring up at you, urging you on faster and faster.");
            // (Cocksize 30/Clit 12)
            else if (this.player.cockArea(x) <= 30) this.outputText("At this angle you manage to hit all the right places.  Soon Nieve is wriggling around, eyes tightly shut as she whispers dirty words you can't even make out.");
            // (Cocksize 70/Clit 24)
            else if (this.player.cockArea(x) <= 70) this.outputText("Nieve's cunt feels like an icy vice on your oversized cock, but even so, you manage to hit all the right places.  Soon she is wriggling around, eyes tightly shut as she pants for breath.");
            // (Cocksize 130+/Clit 48+)
            else this.outputText("Though you can't fit your entire " + this.player.cockClit(x) + " inside, you are amazed at how much she takes.  Her pale blue stomach bulges with every thrust.  Soon Nieve is wriggling, her eyes slightly open as she bites her lip in ecstasy.");
        }
        else {
            if (this.player.getClitLength() <= 4) this.outputText("Your meager clit isn't much, but at this angle you manage to hit all the right places.  Soon Nieve is wriggling around, eyes staring up at you, urging you on faster and faster.");
            else if (this.player.getClitLength() <= 12) this.outputText("At this angle you manage to hit all the right places.  Soon Nieve is wriggling around, eyes tightly shut as she whispers dirty words you can't even make out.");
            else if (this.player.cockArea(x) <= 24) this.outputText("Nieve's cunt feels like an icy vice on your oversized clitty, but even so, you manage to hit all the right places.  Soon she is wriggling around, eyes tightly shut as she pants for breath.");
            // (Cocksize 130+/Clit 48+)
            else this.outputText("Though you can't fit your entire " + this.player.cockClit(x) + " inside, you are amazed at how much she takes.  Her pale blue stomach bulges with every thrust.  Soon Nieve is wriggling, her eyes slightly open as she bites her lip in ecstasy.");
        }
        this.outputText("\n\nNieve's body tenses underneath you while a deep, \"<i>Ohhh yes!</i>\" rolls from her lips languidly.  She bites her deep blue lip, stifling any more cries.  Her already tight, bitingly cold quim grips you tighter causing your entire body to shiver.  Her arms extend out into the snow, twitching wildly.  Her legs, meanwhile, can't decide whether they want to grip your neck or bow outwards.  As the orgasm crashes over her body you know you can't hold out much longer either.");

        this.outputText("\n\nThe icy cold chill of her snatch helps to prolong the inevitable. You manage to send Nieve over the edge at least once more, leaving her a tangled mess of limbs, one arm grasping her hair, the other furiously buried between her legs. But with one final thrust you're pushed over the edge as well as a warm tingling sensation overtakes your body.");
        // ((Clitfucking?)
        if (x < 0) this.outputText("  Your [clit] suddenly feels suddenly warm, like every nerve ending inside were on fire. It aches and pulses with the rest of your body, as though it were a little cock longing to cum.");
        else {
            this.outputText("  Your " + this.player.cockClit(x) + " aches and pulses with need before ");
            if (this.player.cumQ() < 100) this.outputText("spilling its meager offering into the ice spirit's womb");
            else if (this.player.cumQ() < 250) this.outputText("ejecting streams of white hot jizz into the ice spirit's hungry snatch");
            else if (this.player.cumQ() < 400) this.outputText("painting the ice spirit's insides with your cream until some begins to pour out");
            else if (this.player.cumQ() < 700) this.outputText("arcs of pearly white cum shoot forth, filling the ice spirit's womb so much her belly visibly inflates");
            else this.outputText("erupting inside, filling the ice spirit up with so much of your hot cum so much that she looks visibly pregnant");
            this.outputText(".");
        }
        this.outputText("\n\nExhausted, you slump backwards, splaying out in the snow.  You leave your anatomy to work itself out for now, just savoring the afterglow and catching your breath as much as you can.  Nieve, however, seems to have other things in mind.  She pulls away from you, twists around, and gets on her hands and knees between your legs.");

        this.outputText("\n\n\"<i>So messy, [Master],</i>\" she notes with a smile.  \"<i>Allow me to clean you up.</i>\"  Her cool mouth descends on your member, licking and sucking away all of your juices and hers, leaving you spotless.  She seems to delight in the flavor, and once she's done, she leans in and gives you a big, sloppy kiss that tastes more like mint than anything else.  She then cuddles up next to you, her cold body somehow comforting, until you've recuperated enough to head back to the camp proper.");
        this.player.orgasm('Dick');
        this.dynStats("sen", -2);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Get Fucked by Gurumash
    // Male Nieve
    // Any Gender
    // Nieve's cock is 9x1.5
    public nieveFucksYou(): void {
        this.clearOutput();
        this.outputText("Your arrival to Nieve's part of the camp elicits a friendly smile from the ice man.  He notices the longing in your eyes with a grin, and speaks in a gentle, yet low tone, \"<i>[Master], you seem to need help from me...</i>\"");
        this.outputText("\n\nTo which you nod, ");
        if (this.player.cor < 50) this.outputText("telling him that you find his form... appeasing to say the least, and would like to know how his 'parts' are working properly.");
        else this.outputText("letting your creation know that you are interested in 'how' it can please you, giving him no room to imagine what you're insinuating you then tell him bluntly that you want him to fuck you like the plaything he is.");

        this.outputText("\n\nNieve bows subserviently, then moves closer to you, doing the work of disrobing you like he's practiced at it.  He caresses your [chest] and [nipples] as he nibbles on your neck and ears, the cool kisses and touches feeling electric in the contrasting warmth of the air, causing you to shiver in delight at his surprisingly experienced movements.");
        // {Silly Mode:}
        if (this.silly()) this.outputText("   He did say that his kind were effectively love slaves, and boy does this prove it!");
        // [if (hasVagina = true)
        if (this.player.hasVagina()) this.outputText("  Your [vag] is a sodden box so soon after he started, and you start to want more, much more!");
        // [if (hasCock = true)
        if (this.player.hasCock()) this.outputText("  Your [cock biggest] is also rock hard in a short while and you quickly desire some more stimulation from your icy love slave.");

        // [(if PC has vagina or large enough tits) \"<i>So [master],</i>\" He says pulling back slightly, \"<i>Where would you like me to put this?</i>\"][(if anal is the only option, automatically selected) \"<i>Well I guess I know where to put this huh?</i>\" He says coyly.]
        // [Anal][Vaginal][(tits >3) Tit-Fuck]
        this.menu();
        this.addButton(0, "Anal", this.takeNieveAnal);
        if (this.player.hasVagina()) this.addButton(1, "Vaginal", this.takeNieveVaginal);
    }
    // Anal
    public takeNieveAnal(): void {
        this.clearOutput();
        this.outputText("You let you wintery lover know just where you want his blue member, turning around and setting yourself up on all fours as you grab your [butt] on both sides with your hands, spreading your cheeks to expose your [asshole] quite vulgarly. He needs no further invitation as he moves to match his face to your dirty hole.  You feel the pristine chill of his breath cover your nethers, making you tremble.  Already hot and horny from his foreplay earlier, you wait anxiously for what seems like minutes until he probes your hole with his tongue, lathering your [butthole] with his cool lubing saliva, the temperature making you quaver even more as you enjoy the ice play his tongue is giving you.");
        this.outputText("\n\nAfter a few exciting minutes, he pulls away as you look at him from over your shoulder.  You take a little time to admire your creation and how perfectly sculpted his body is when his nine-inch member thrusts into your anus in one quick thrust, causing an enraptured squeal to come from your mouth.  Thoughtfully, Nieve waits a few moments to allow your hole to get familiar with his sizable member before ever-so slowly thrusting into you.  You enjoy the ride for what it's worth, since even though almost every penis you've encountered in this land has been bigger, there's something unique about his frozen phallus that you can't get enough of.  You finish the thought, only to be wakened from your internal monologue to the increasing rhythm of the polar penetration he's giving you.");
        this.player.buttChange(9, true, true, false);

        this.outputText("\n\nHe continues increasing the tempo until you're both rutting like animals, the lewd squelches coming from the pounding fill the environment as you start to feel a warming sensation in your ass.  The unusually loud squelches tell you he's leaking some precum as the frigid phallus drives into your [asshole] like a perverted slip 'n slide.");
        // [if (hasCock = true)
        if (this.player.hasCock()) this.outputText("  Nieve then bends forward while keeping his pace to give you a reach-around.  Grabbing your own [cock biggest] in one hand, he starts to pump it to the speed of his thrusts, torturing you with the extra-stimulation in such a good way.");
        // [if (hasVagina = true)
        else if (this.player.hasVagina()) this.outputText("  As Nieve continues to pound away, he places one hand on your sopping wet cunt and begins to finger you in time with his assault, making you lust-drunk with the stimulation as he finger bangs you.");

        this.outputText("\n\nNieve continues to grunt as he prods and plunges into your ");
        // if (silly mode)
        if (this.silly()) this.outputText("pooper");
        else this.outputText("[asshole]");
        this.outputText(" as you feel an oncoming climax.  Nieve, furiously impaling you with his long and cold cock, comes first, and in one final thrust drives his penis as deeply as possible, flooding your bowels with a crisp current of cum as his body rocks from the orgasm.  You join him in the throes of ecstasy as soon as his jizz hits your inner walls");
        if (this.player.gender > 0) {

            // [if (hasCock = true)
            if (this.player.hasCock()) {
                this.outputText(", ");
                this.outputText("while your body undulates and seizes as cum starts to spew forth from [eachCock]");
                // (normal volume:
                if (this.player.cumQ() < 200) this.outputText(", as you cum, you leave a small puddle on the floor below you");
                else if (this.player.cumQ() < 500) this.outputText(", as you cum you start to dress your arms and hands with your own cream as you shoot your stuff out onto the floor");
            }
            // [if (hasVagina = true)
            if (this.player.hasVagina()) this.outputText(".  Your soaking vagina makes your body quake and shudder as you orgasm, splashing your femcum all over Nieve and the ground");
        }
        this.outputText(".");

        this.outputText("\n\nYou both rest in that position, Nieve still trickling cum into you even though he stopped moving minutes ago.  You turn your head to look at him and notice his face a few inches from yours.  It's clear that at the moment he's barely conscious, and you shift a bit to kiss him, thanking him for a job well done.  After a little while you both recover, redress, and silently go back to business.  Looking back at him as you leave, you know you want to do it again real soon.");
        this.player.orgasm('Anal');
        this.dynStats("sen", -2);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Vaginal
    public takeNieveVaginal(): void {
        this.clearOutput();
        this.outputText("You're already wet from the foreplay, and it shows.  Moreso, Nieve notices, with a grin similar to the one he gave you earlier.  The look on his face suggests he knows what you want, he's just merely waiting for his [master] to give the word.");

        // if (corruption < 50)
        if (this.player.cor < 50) this.outputText("\n\nYou give him a dirty look, asking if he's going to make you say it.  \"<i>I do not know what it is you mean, [master],</i>\" he whistles complacently, giving you a sideways glance.  Frustration sets in your mind at the sheer smugness your love slave just exhibited, so much so that you blurt out that you just want him to fuck your cunt like the stud he is.");
        // if (corruption > 50)
        else this.outputText("\n\nYou ask your toy if he's playing coy, to which he merely gives you another sidelong glance.  You then grab him by the chin and force him to look into your eyes, barely an inch away from each others faces.  You whisper that he's going to empty those pretty blue balls of his directly into your womb, and he'd better get started.  Right.  Now.");

        this.outputText("\n\nNieve obliges with a, \"<i>Yes ma'am!</i>\" quickly laying you on your back");
        // [if (hasBalls = true)
        if (this.player.balls > 0) this.outputText(", gently moving your [balls] out of the way in the process");
        this.outputText(".  He slams his nine inch blue rod balls deep into your sodden box.  A loud squelch fills the air at the penetration, giving Nieve the go ahead to start in top gear, pistoning in and out at a hurried pace.");
        // [if (hasCock = true)
        if (this.player.hasCock()) this.outputText("  During the pounding Nieve grabs your dangling [cock biggest] and starts to pump it in time with his own thrusts, quite eager to please his [master].  Every time your feminine half cums, so does your male half, splashing its happy seed into the valley that your combined bodies have made.");
        // [if (isLactating = true)
        if (this.player.lactationQ() >= 100) this.outputText("  Your ice man reaches out with a free hand to caress your [chest], twiddling his fingers around your delicate [nipples]. After some rough pulling and flicking, pounding away all the while, he feels milk dribble onto his hand.  He catches a quick glance of the liquid before diving head-first to suckle on your milk faucets, drinking heavily of your cream as he's about to give you his.");
        this.outputText("\n\nYou enjoy the ride and then some, as his phallus hammers away at your cunt, desperate to feed your womb with his seed.  He caresses, fondles and nibbles all parts of your body, quickly stimulating one area after the other to freshen the feeling again and again... and again.  Everytime you come, he pounds a little slower and harder, grunting heavier as you try to wring him dry of all his dickmilk, wanting desperately to feel full of it.");
        this.player.cuntChange(9, true, true, false);

        this.outputText("\n\nOne last time you cum, and this time so does he, his cock barreling deep inside, the head kissing the entrance of your womb as it spills forth that crisp current of cool cum, bloating your womb with the sheer amount.  The cold sensation combined with the cum's chemical reaction in your womb send you into a drooling euphoria as you throw your head back in tumultuous screams of rapture.  You can barely see at the bottom of your vision your pregnant-sized belly and rest your head back, blissfully unaware of anything else in the world except this feeling.");

        this.outputText("\n\nYou come to your senses after what seems a couple of hours, Nieve resting peacefully on and still connected. He seems to have passed out and is pleasantly resting his head on your [chest].  You lay there, still flushed and warm from your recent activity despite the ice cold body on you.  You feel comfortable enough to doze off again.");

        this.outputText("\n\nAnother hour passes and you wake up clean and dressed, laying next to Nieve.  You noticed he's probably been watching you for the last several minutes.  You get up, pat yourself off, then with one hand tussle his snow-white hair, while uttering the words, \"<i>Good boy.</i>\"");
        this.player.orgasm('Vaginal');
        this.dynStats("sen", -2);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Goodbye (Outline by PyroJenkins)
    public nieveIsOver(): void {
        this.clearOutput();
        this.hideMenus();
        // Nieve Not Completed
        if (this.flags[kFLAGS.NIEVE_STAGE] < 5) {
            this.outputText("You wake up with a yawn and a stretch. It feels just like any other day, though a bit warmer.  Quite a bit warmer in fact.  It feels like winter's grasp on Mareth has slipped, and it's entering Spring.  Curiously, you glance over towards the snow which had been recently deposited in your camp, and note it's melting away before your eyes.");
            this.outputText("\n\nOh well, not a huge loss, you figure.  It was fun while it lasted.");
            this.flags[kFLAGS.NIEVE_STAGE] = 0;
        }
        // Nieve Completed
        else {
            this.outputText("You wake up with a yawn and a stretch.  It feels just like any other day, though a bit warmer.  Quite a bit warmer in fact.  It feels like winter's grasp on Mareth has slipped, and it's entering Spring.  You consider the fact absently at first, but then you stop dead in your tracks.  What about Nieve?!");
            this.outputText("\n\nYou turn to " + this.nieveMF("his", "her") + " winter wonderland, relief washing over you as you see it's still there, but note that it is diminishing.  You rush over, watching the parched landscape claiming the slushy terrain bit by bit.  Nieve sits in the middle, looking up at the sky with a worried look on " + this.nieveMF("his", "her") + " face.  " + this.nieveMF("His", "Her") + " normally glittering skin now shines with sweat, not frost. Beads of perspiration roll down " + this.nieveMF("his", "her") + " body and into a worryingly large puddle at " + this.nieveMF("his", "her") + " feet.");

            this.outputText("\n\n\"<i>Ah, [Master], you're here. I was concerned we might not have been able to talk before... before I go home,</i>\" " + this.nieveMF("he", "she") + " says sadly.  You question " + this.nieveMF("him", "her") + ", why does " + this.nieveMF("he", "she") + " have to go home? You've seen " + this.nieveMF("him", "her") + " make snow before, why can't " + this.nieveMF("he", "she") + " just sustain " + this.nieveMF("him", "her") + "self like that?  Nieve justs shakes " + this.nieveMF("his", "her") + " head, \"<i>I'm afraid it doesn't work like that.  My kind can only exist outside our homeland during the winter season.  Any further, and we simply melt away.</i>\"  " + this.nieveMF("He", "She") + " sighs sorrowfully, and you take " + this.nieveMF("his", "her") + " hand.  It's strangely warm, like the body temperature of a human, not at all " + this.nieveMF("his", "her") + " usual frigid touch.");

            this.outputText("\n\nA familiar jingling fills the air, and you both look down to see Nieve's legs replaced by a large ball of melting snow and ice.  Clearly not wanting to think about it, " + this.nieveMF("he", "she") + " throws " + this.nieveMF("his", "her") + " arms around you and pulls you into a hug.  \"<i>I just want to say,</i>\" " + this.nieveMF("he", "she") + " whispers into your ear.  \"<i>You were the best master I could have hoped for.  And...</i>\" " + this.nieveMF("he", "she") + " pauses, tears forming in " + this.nieveMF("his", "her") + " eyes, \"<i>And I'll mi--...</i>\"  " + this.nieveMF("His", "Her") + " voice drifts off.  When you break the hug to look at " + this.nieveMF("him", "her") + ", to urge " + this.nieveMF("him", "her") + " to continue, only the lifeless eyes of the snowman you first created stare back at you.");

            this.outputText("\n\nEverything about it looks the exact same... except for a sparkling, teardrop shaped icicle which hangs from the eye.  As you inspect it, it comes dislodged, falling and landing on your shoulder.  A final tear shed by Nieve, the ice spirit.");
            this.outputText("\n\nYou pick up the frozen tear, which doesn't appear to be melting at all, and clutch it tightly.");
            if (this.player.cor < 50) this.outputText("  You even tear up yourself, sad to see such a good friend leave, and so abruptly.");
            // Corruption >50:
            else this.outputText("  You even feel a little sad yourself, it's such a pity to see a good, obedient fucktoy leave.");
            this.outputText("  The snowman collapses on itself, melting away before your very eyes.  In a matter of hours, this entire area will be nothing but a dried up, dehydrated desert once more.  But as the jingling fades out into the distance, you vow to hold on to the tear.");

            this.outputText("\n\nThe tear of Nieve.");
            if (this.player.cor < 50) this.outputText("\n\nThe tear of a friend.");
            if (this.player.hasKeyItem("Nieve's Tear") < 0) {
                this.outputText("\n\n(<b>Gained Key Item: Nieve's Tear</b>)");
                this.player.createKeyItem("Nieve's Tear", 1, 0, 0, 0);
            }
            this.flags[kFLAGS.NIEVE_STAGE] = 0;
        }
        this.doNext(this.playerMenu);
    }

    private fixNieve(): void {
        if (this.flags[kFLAGS.NIEVE_GENDER] == 0) {
            this.clearOutput();
            this.outputText("(There was an error with stat tracking that cleared Nieve's stats out at the end of last year's event. <b>What gender do you want Nieve to be?</b>)");
            this.menu();
            this.addButton(0, "Male", this.fixNieveGender, 1);
            this.addButton(1, "Female", this.fixNieveGender, 2);
        }
        else if (this.flags[kFLAGS.NIEVE_MOUTH] == "" || this.flags[kFLAGS.NIEVE_MOUTH] == 0) {
            this.clearOutput();
            this.outputText("(There was an error with stat tracking that cleared Nieve's stats out at the end of last year's event. <b>What were Nieve's eyes and mouth made out of?</b>)");
            this.menu();
            this.addButton(0, "Gems", this.fixNieveMouth, 0);
            this.addButton(1, "Coal", this.fixNieveMouth, 1);
        }
        else this.nieveReturnsPartII();
    }

    private fixNieveGender(arg: number = 1): void {
        this.flags[kFLAGS.NIEVE_GENDER] = arg;
        this.fixNieve();
    }
    private fixNieveMouth(arg: number = 1): void {
        if (arg == 0) this.flags[kFLAGS.NIEVE_MOUTH] = "gems";
        else this.flags[kFLAGS.NIEVE_MOUTH] = "coal";
        this.fixNieve();
    }

    // The Return of Nieve
    // Occurs during winter if the PC has Nieve's tear.
    public returnOfNieve(): void {
        this.clearOutput();
        this.outputText("As you awake in the morning you find yourself shivering slightly.  A cool breeze sweeps over your camp, while in the distance jingling bells can be heard.  How odd.  You haven't heard bells like that since...");
        this.outputText("\n\nYour heart skips a beat.");
        this.outputText("\n\n<i>You haven't heard bells like that since Nieve left you</i>.");
        this.outputText("\n\nYou quickly glance around the campsite until your eyes fall upon a glittering patch of white: fresh fallen snow.  The pure white almost hurts your eyes against the hellish red of the surrounding landscape.  You make a mad dash into the snow, which comes up to your ankles.  Little snowflakes continue to drift slowly down as the jingling noise fades away into nothingness.  But you can't see anything...  No familiar snow " + this.nieveMF("man", "woman") + " to greet you.  Perhaps Nieve really is gone forever?");
        this.outputText("\n\nYou sink down into the snow, clutching Nieve's tear close and remember " + this.nieveMF("his", "her") + " last words to you.  \"<i>You were the best master I could have hoped for.</i>\"  The voice rings through your head. \"<i>And...  And I’ll mi--...</i>\"  Though " + this.nieveMF("he", "she") + " was cut off, you knew what " + this.nieveMF("he", "she") + " was saying.");
        this.outputText("\n\n\"<i>I miss you too,</i>\" you whisper to the tear, before closing your fist around it.  Your vision blurs as your own eyes begin to tear up.");
        this.outputText("\n\nThere really is nothing left of " + this.nieveMF("him", "her") + ".  Nothing but this lost fragment.  An echo of a friend.");
        // [Next]
        this.menu();
        this.addButton(0, "Next", this.fixNieve);
    }

    private nieveReturnsPartII(): void {
        this.clearOutput();
        this.outputText("You sigh, resigning yourself to your companion's fate.  However, as you rise from the snow to return to camp, you hear a soft, muffled voice.  Perplexed, you crawl forward in the snow, frantically seeking out the source.");
        this.outputText("\n\nThat's when you see it, a small mound of snow, practically invisible among the white mass surrounding it.  You plunge your hands into the freezing cold stuff and find something solid.  Something large.  Something about the size of a person.  You move to pull the person up and forward, but it doesn't take much.");
        this.outputText("\n\nThe figure moves on its own, bursting from its snowy blanket.  All you catch is a brief flash of blue before the creature wraps its arms around you in a tight hug.  You can make out soft sobbing from the person... One glance down is all you need to confirm your suspicions.  That frozen, blue skin and pert squeezable ass.  It's definitely Nieve.");
        this.outputText("\n\n\"<i>Oh master!</i>\" " + this.nieveMF("he", "she") + " cries, breaking the hug to look you in the eyes.  " + this.nieveMF("His", "Her") + " ");
        if (this.flags[kFLAGS.NIEVE_MOUTH] == "coal") this.outputText("coal black");
        else this.outputText("glittering purple");
        this.outputText(" eyes shine with crystallizing tears, not entirely unlike the ones " + this.nieveMF("he", "she") + " left with you on your last meeting.  \"<i>I'm so glad to be back!  I was worried I would be sent somewhere else, but I had so much fun here, and I told the big man that, and then Winter came and I wasn't sure you were still here, and then it turned out I might have gone to someone else, but oh my goodness I'm so happy I came back!</i>\" Nieve belts out without pause for breath before wrapping " + this.nieveMF("his", "her") + " arms around you once again.");
        this.outputText("\n\nYou hold " + this.nieveMF("him", "her") + " close, thankful to whoever this \"big man\" is for sending Nieve back to you.");
        this.outputText("\n\n\"<i>I... I can still only stay the winter, at least for now, but it's something, right?</i>\" the snow spirit says, clasping your hand in theirs.");
        this.outputText("\n\nYou nod.  You'll take what you can get, even if it is such a brief moment.  The two of you share stories, well, you share stories while Nieve listens with rapt attention, for the next hour or so.  It's been a long time since you've seen each other, and there's a lot to catch up on...");
        this.flags[kFLAGS.NIEVE_STAGE] = 5;
        this.doNext(this.camp.returnToCampUseOneHour);
    }
}

/*Credits
Fenoxo- for providing the game in which this scene might go into
Kinathis - The \"<i>Suck Him</i>\" scene
Gurumash - The \"<i>Get Fucked</i>\" scene
Third - Everything else
Pyro - The \"<i>Goodbye</i>\" outline*/
