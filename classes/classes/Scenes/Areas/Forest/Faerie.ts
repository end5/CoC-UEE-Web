import { BaseContent } from "../../../BaseContent";
import { Encounter } from "../../API/Encounter";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { SpriteDb } from "../../../display/SpriteDb";
import { BreastCup } from "../../../lists/BreastCup";
import { rand } from "../../../Extra";
import { StatusEffects } from "../../../StatusEffects";
import { Vagina } from "../../../Vagina";
import { Appearance } from "../../../Appearance";
import { CockTypesEnum } from "../../../CockTypesEnum";

export class Faerie extends BaseContent implements Encounter {

    public encounterChance(): number {
        return this.flags[kFLAGS.FAERIE_ENCOUNTER_DISABLED] <= 0 ? 1 : 0;
    }

    public encounterName(): string {
        return "faerie";
    }

    // faerie Encounter
    public execEncounter(): void {
        this.spriteSelect(SpriteDb.s_faerie);
        this.clearOutput();
        this.outputText("A faerie slightly taller and thicker than your middle finger flits about the air. Her flat chest and girlish bob of hair make her look quite cute, but the solid black stockings and leather straps covering her chest show her slutty nature. Her wings are a light red, the color of aroused genitals.\n\n");
        if (this.player.cockTotal() > 0 && (this.player.biggestTitSize() <= BreastCup.B || rand(2) == 0)) {
            this.outputText("She seems to notice you getting hard at the sight of her and looks down. \"<i>Ew, man parts!</i>\" the faerie exclaims, flying away like a frightened bird.");
            if (rand(this.player.spe / 2) + this.player.statusEffectv1(StatusEffects.FaerieFucked) > 15) {
                if (this.player.statusEffectv1(StatusEffects.FaerieFucked) < 5) {
                    this.outputText("\n\nYou make a desperate lunge for the faerie girl and grab her before she can fly away.   She wriggles and squirms in your grasp, shouting, \"<i>Let me go you meanie!</i>\"\n\n");
                    this.outputText("It would be cute if she wasn't dressed up like such a slut.  You bet you could get her to help pleasure you, but she might not like it.  Or you could be a nice " + this.player.mf("guy", "girl") + " and let her go...\n\nDo you force her to pleasure you?");
                }
                else if (this.player.statusEffectv1(StatusEffects.FaerieFucked) < 10) {
                    this.outputText("\n\nYou snatch her out of the air fairly easily.  She seems like she's slowed down a little.   She squirms and wriggles, begging you, \"<i>Please don't cover me in cum again... I get so drunk and feel even sluttier afterwards.  I don't want to be a slut!</i>\"\n\nShe pouts, but blushes.  Do you make her get you off again?");
                }
                else if (this.player.statusEffectv1(StatusEffects.FaerieFucked) < 15) {
                    this.outputText("\n\nYou grasp the dizzy faerie out of the air with ease, smiling as you feel the flood of wetness between her thighs moistening your hand.  She wriggles and moans, \"<i>No, not again!  I want another cum-bath so bad... but I'm losing myself to it.  It's hard to keep flowers pollinated when you're jilling off half the day and waiting for a nice hard cock to wander your way...</i>\"\n\nShe wants to get you off almost as you do.  Do you make her service you again?");
                }
                else this.outputText("\n\nYou lazily make a grab for her and easily snatch her out of the air.  Her body is sticky with a mix of desire and your last encounter.  You can feel her humping against your pinky while she begs, \"<i>Come on, let me crawl into your " + this.player.armorName + " and wrap myself around your shaft.  I promise I'll only drink a little pre-cum this time, just enough to let me get off.  I'll be a good faerie slut, just let me get you off!</i>\"\n\nDo you let the faerie get you off?");
                this.dynStats("lus", this.player.lib / 10 + 2);
                this.doYesNo(this.faerieCaptureHJ, this.letFaerieGo);
                this.addButton(2, "Never", this.disableFaerieEncounterForGood);
                return;
            }
            this.dynStats("lus", this.player.lib / 10 + 2);
            if (this.player.lust100 >= 90) {
                this.outputText("\n\nYou groan miserably with frustration. Desperate for stimulation, you sink to your knees and start jacking off, the faerie's visage still fresh in your mind. You catch a fleeting glimpse of yourself tightly gripping the faerie's legs in each of your fists, dragging her toward ");
                if (this.player.cockTotal() == 1) this.outputText("your dick");
                else this.outputText("one of your dicks");
                this.outputText(", too large for her tiny frame... the depraved image overwhelms your mind's eye and you find yourself shooting all over the ground furiously.");
                this.player.orgasm('Dick');
            }
            else this.outputText("\n\nYou try in vain to jump and catch her, but she's too high above you and much too fast.");
            this.doNext(this.camp.returnToCampUseOneHour);
            return;
        }
        this.outputText("The faerie slows the beating of her wings and hovers towards you. You dismiss your fearful notions, certain a small faerie is quite harmless to you.\n\n");
        this.outputText("How do you react?");
        // Shoo Away, Nothing, RAEP
        this.menu();
        this.addButton(0, "Shoo Away", this.faerieShooAway);
        this.addButton(1, "Nothing", this.faerieDoNothing);
        if (this.player.hasVagina()) this.addButton(2, "Rape", this.faerieRAEP);
        this.addButton(4, "No More!", this.disableFaerieEncounterForGood, true);
    }

    private faerieRAEP(): void {
        this.spriteSelect(SpriteDb.s_faerie);
        // Count secksins
        if (!this.player.hasStatusEffect(StatusEffects.FaerieFemFuck)) this.player.createStatusEffect(StatusEffects.FaerieFemFuck, 1, 0, 0, 0);
        else this.player.addStatusValue(StatusEffects.FaerieFemFuck, 1, 1);
        this.clearOutput();
        this.outputText("You let the tiny faerie buzz closer to investigate, then with an explosion of movement, snatch her out of the air.  She squirms in your palm, struggling futilely in your grasp.  You poke between her legs with a finger, noting the flushed redness of the faerie's skin.  ");
        // Changes based on times fucked
        if (this.player.statusEffectv1(StatusEffects.FaerieFemFuck) == 1) this.outputText("She juices herself and screams, \"<i>Let me goooooooo,</i>\" trying to sound outraged instead of turned on, but the tiny girl's body gives away the lie.");
        else if (this.player.statusEffectv1(StatusEffects.FaerieFemFuck) <= 5) this.outputText("She juices herself and moans, \"<i>Stop teasing meeeeee,</i>\" doing her best to wriggle back against you, as if she could somehow impale herself on your digit.");
        else this.outputText("She squeals, rocking her hips back against you and moaning, \"<i>Ohhhh I love it when you do that,</i>\" grinding her incredibly small love-button on your digit.");
        // Special Taurness
        if (this.player.isTaur()) {
            this.outputText("\n\nYou bop the tiny Faerie on the head to daze her briefly, then place her on a branch. You back yourself up against the tiny creature, lifting your tail so she can see your " + this.player.vaginaDescript(0) + ". The scent washes toward her and you hear a high pitched giggle; evidently that was more than enough to give her quite the contact high.  You feel a strange sensation in your slit as she slides her legs inside you and wraps her arms around your " + this.player.clitDescript() + ".\n\n");

            // [If cock-like clit:
            if (this.player.getClitLength() >= 3) {
                this.outputText("The tiny fae begins jerking your clit like a cock, squeezing her arms tightly around you and sliding in and out of your " + this.player.vaginaDescript(0) + ". Her motions are frenetic and unpredictable, but incredibly pleasurable.  She starts licking at your " + this.player.clitDescript() + " as your femcum runs down it, which only serves to make her more excited. She gets so excited that her legs start kicking wildly as she screams \"<i>Swim! Swim! Swim! Swim!</i>\" over and over again.  ");
                // [Small amount of cum:
                if (this.player.vaginas[0].vaginalWetness <= Vagina.WETNESS_WET) this.outputText("The fae giggles more and more as the fluid seeps about her and your " + this.player.vaginaDescript(0) + " ripples. She hugs your " + this.player.clitDescript() + " tighter and starts gently gnawing at it, such a peculiar sensation that you cum suddenly, and wetly.  Her giggles quickly become all-out laughter, and she loses her grip on your clit, sprawling to the ground into a small puddle of femcum.\n\n");
                // [Normal amount of cum:
                else if (this.player.vaginas[0].vaginalWetness <= Vagina.WETNESS_DROOLING) this.outputText("The fae giggles more and more as the fluid squirts about her and your " + this.player.vaginaDescript(0) + " ripples. She hugs your " + this.player.clitDescript() + " tighter and starts gently gnawing at it, such a peculiar sensation that you cum suddenly, and wetly.  Her giggles quickly become all-out laughter, and she loses her grip on your clit, sprawling to the ground into a puddle of femcum.\n\n");
                // [Huge amount of cum:
                else this.outputText("The fae giggles more and more as the fluid sprays about her and your " + this.player.vaginaDescript(0) + " ripples. She hugs your " + this.player.clitDescript() + " tighter and starts gently gnawing at it, such a peculiar sensation that you cum suddenly, and wetly.  Her giggles quickly become all-out laughter, and she loses her grip on your clit, sprawling to the ground into a huge puddle of femcum, her giggling frame floating on the surface as her legs kick about erratically.\n\n");
            }
            // [All other clits:
            else {
                this.outputText("The tiny fae rubs her hands around your " + this.player.clitDescript() + " as if entranced by it. Your body responds by pumping out more femcum, which she laps up happily.  She starts laughing maniacally and banging on your clit like a drum, periodically yelling out \"<i>CONGA!</i>\" for some reason. The strange ministrations feel incredible though, and you feel your love canal squeezing down on the faerie's tiny body.  ");
                // [Small amount of cum:
                if (this.player.vaginas[0].vaginalWetness <= Vagina.WETNESS_WET) this.outputText("You cum suddenly, and wetly. The fae giggles more and more as the fluid seeps about her and your " + this.player.vaginaDescript(0) + " ripples. Her giggles quickly become all-out laughter, and she loses her grip on your innards, sprawling to the ground into a small puddle of femcum.\n\n");
                // [Normal amount of cum:
                else if (this.player.vaginas[0].vaginalWetness <= Vagina.WETNESS_DROOLING) this.outputText("You cum suddenly, and wetly. The fae giggles more and more as the fluid squirts around her and your " + this.player.vaginaDescript(0) + " ripples. Her giggles quickly become all-out laughter, and she loses her grip on your innards, sprawling to the ground into a puddle of femcum.\n\n");
                // [Huge amount of cum:
                else this.outputText("You cum suddenly, and wetly. The fae tries desperately to hold on to your " + this.player.clitDescript() + " but the amount of fluid overwhelms her and she's sent spiralling to the ground into a huge puddle of your fluid, her giggling frame floating on the surface as her legs kick about erratically.\n\n");
            }
        }
        // Non-Taurs
        else {
            this.outputText("\n\nYou release the lower portion of your " + this.player.armorName + ", revealing your aroused slit to the faerie.  ");
            if (this.player.statusEffectv1(StatusEffects.FaerieFemFuck) < 4) this.outputText("Her mood immediately shifts from panic to desire, and she licks her lips hungrily, locking her eyes onto your feminine folds.");
            else this.outputText("Her eyes open wide, like a junkie seeing a fix.  She licks her lips hungrily and humps the inside of your hand, ready for action.");
            this.outputText("  You release the faerie, letting the pussy-entranced fae buzz down to your sensitive nether-regions.  She lands softly, her tiny feet and hands prancing over your vulva.  You gasp in delight, ");
            if (this.player.vaginas[0].vaginalWetness >= Vagina.WETNESS_SLAVERING) this.outputText("releasing a tiny squirt");
            else if (this.player.vaginas[0].vaginalWetness >= Vagina.WETNESS_DROOLING) this.outputText("dribbling juices");
            else if (this.player.vaginas[0].vaginalWetness >= Vagina.WETNESS_WET) this.outputText("growing so slippery the faerie nearly loses her footing");
            else this.outputText("feeling yourself moistening with need");
            this.outputText(" from the tiny touches.\n\n");

            // (small) <= .50\"
            if (this.player.getClitLength() <= .5) {
                this.outputText("She pulls apart your lips, revealing your tiny bud and repositioning herself to plant her feet inside you.  The flawless skin of her thighs pulls another gasp of pleasure from your lips.  They squeeze tightly around your " + this.player.clitDescript() + ", scissoring her gash across its sensitive surface.   You squirm, too engrossed in the rough grinding your button is receiving to worry about the faerie.   She clings to you, hanging on for dear life as your crotch nearly throws her free.  During the gyrations, she's slammed back into the " + this.player.clitDescript() + ", instantly penetrated by the nub with a wet 'schlick'.\n\n");
                this.outputText("Squealing and bouncing as she hangs on tightly, the faerie noisily orgasms around your clit, squirting her own fluids into your aching " + this.player.vaginaDescript(0) + ".  The fluid tingles, and you shove your fingers in, smearing the sticky-sweet faerie-cum through your passage.   Before you can get far with it, your own orgasm goes off, squeezing your fingers and rippling around them, trying to milk your hand as if it was a dick.  Your legs go weak and wobbly, forcing you down on your " + this.player.buttDescript() + " as the waves of pleasure flow through you, soaking the faerie in girlcum.\n\n");
            }
            // (medium) <= .1.25\"
            else if (this.player.getClitLength() <= 1.25) {
                this.outputText("She watches, entranced as your " + this.player.clitDescript() + " hardens, poking between your lips, flushed with blood like a tiny cock.   The faerie swivels around, planting her dainty butt squarely on your snatch, sinking down a bit into the folds as she wraps her legs around the pulsating 'shaft'.   She hugs it, pressing it between her tiny breasts and licking it up and down, making you moan and squirm from unexpected stimulation of your most sensitive area.\n\n");
                this.outputText("You spread your " + this.player.legs() + ", careful not to dislodge the faerie as she releases the " + this.player.clitDescript() + " and stands up, placing her dripping gash against the tip.   A quick plunge later and she's bottomed out, pressing her hips into the opening of your " + this.player.vaginaDescript(0) + " her feet slipping over the outer folds as she tries to maintain her balance.   You start rocking back and forth happily, bouncing the faerie up and down.  She moans, cute and barely audible, but sexy in a way that makes your sopping fuckhole even wetter.\n\n");
                this.outputText("She orgasms on you, squirting copiously, drenching your " + this.player.clitDescript() + " and " + this.player.vaginaDescript(0) + " in clear faerie-fluid.  It tingles, wicking into your button and soaking into your snatch, enhancing every sensation.  You can feel the cool forest air as it flows over your vulva, seeming to stroke you, and without any chance of holding yourself back, you plunge your fingers into your " + this.player.vaginaDescript(0) + ", immediately orgasming from the penetration, not even noticing the exhausted faerie sliding off the large clit and slipping partway into your cunt.\n\n");
            }
            // (streeeetch – large) <= 4.5\"
            else if (this.player.getClitLength() <= 4.5) {
                this.outputText("Entranced by the growing " + this.player.clitDescript() + ", the faerie caresses her body, watching your love-button swell up, not stopping until it looks too huge for her tiny frame.  She climbs in a circle around it, awestruck by the size and majesty of your cock-like button.    She looks up at you, aroused but worried, saying, \"<i>You're so... BIG.  Oh goddess, I want to feel it inside me!</i>\"\n\n");
                this.outputText("She grabs hold of its slippery surface with both hands and jumps, lifting her lower body up before gravity yanks it back down onto the tip of your " + this.player.clitDescript() + ".  The tip barely slips in, despite the slippery wetness of the faerie.   She screams, though in pleasure or pain you cannot be sure.  You reason that it must be pleasure, because the faerie is wiggling her hips and grabbing hold of the rest of your " + this.player.clitDescript() + ", straining to pull herself further down the fem-cock.  Her belly starts to distort, displaying the cylindrical bulge on her tummy, expanding and contracting slightly as each of your heart-beats works through your clit.\n\n");
                this.outputText("In time, she manages to fully impale herself, quivering in orgasm as she gets off from the vibrations your pounding heart sends through your " + this.player.clitDescript() + ".  Her tongue lolls out and her eyes roll back, shut down by the extreme penetration, pain, and pleasure of the act.  You feel her cum soaking into you, sliding down into your slit and making your sensitive slit tingle.  Watching her get off is all it takes to bring you to orgasm with her, and the walls of your " + this.player.vaginaDescript(0) + " clamp down hungrily, contracting and gushing fluids over the faerie as she lies there, impaled on your crotch like a perverted ornament.\n\n");
            }
            // (too big) (else – hump dat shit)
            else {
                this.outputText("Entranced by your swollen " + this.player.clitDescript() + ", the faerie watches it slowly erect, filling with blood like a smooth over-sensitive cock.  She tentatively touches it, gasping and pulling back when it twitches in response.   With a look of awe, she turns to you and says, \"<i>There's no way I could take this beautiful monster, but I know I can make it feel good!</i>\"\n\n");
                this.outputText("She jumps onto it, making it bounce in the air as it takes her relatively insubstantial weight.  Embracing it in a full-body hug, she starts grinding on it, smearing her thick faerie juices into the clit and giggling every time you twitch from the feeling.  You squirm, sinking down from the raw sensation, your " + this.player.legs() + " giving out underneath you.   Grabbing hold of a stump, you try to steady yourself, but the faerie humping your " + this.player.clitDescript() + " is interfering with your motor ability, and you slump into the forest loam, happily twitching as orgasm washes over you.\n\n");
                this.outputText("Your " + this.player.clitDescript() + " jumps, throwing the tiny woman off.  She slips and scrabbles across the surface of your " + this.player.vaginaDescript(0) + ", sliding into your soaking gash.  She's squeezed tightly, sloshed around in the wetness of your orgasm.   The faerie's eyes cross, as she grows dizzy and battered in the sizzling whirlpool that is your groin.\n\n");
            }
        }
        // [OH SHIT ITS OVER, POOR BITCH CRAWLS OUT ALL STONE ON GIRLCUM]
        // [FIRST TIME]
        if (this.player.statusEffectv1(StatusEffects.FaerieFemFuck) == 1) {
            this.outputText("Lying in the forest loam as you recover, you watch as the faerie stumbles out of your groin, holding her head and giggling nonstop.  She tries to put on a serious face but it's instantly overpowered by another fit of laughter, \"<i>Hehe, did you know I'd get stoned off your girlcum?  Omigod I've never been this -heheheheheh- high before!  Like I can see EVERYTHING.  Puuhleeeease don't make me do this again...</i>\"\n\n");
            this.outputText("She flies off, hungry and looking for a flower to munch on.");
        }
        // [REPEAT LOW]
        else if (this.player.statusEffectv1(StatusEffects.FaerieFemFuck) <= 5) {
            this.outputText("The faerie slowly drags herself out of your " + this.player.vaginaDescript(0) + ", smiling broadly with her eyes dilated wide.  She slips off you, dropping to the ground and giggling, \"<i>Everything feels so soft.  Mmmm that was fun!</i>\"\n\n");
            this.outputText("The little woman spins around happily, proclaiming, \"<i>The colors are like, so bright!  Oh gosh, I'm hungry!  See you and your clit later, just don't let me fall in your snatch, it fucks me up so much.  I don't think I can handle much more or I'll be crawling between your legs every chance I get!</i>\"\n\n");
            this.outputText("She flits away, calling out, \"<i>Bye sweetie!</i>\"");
        }
        // [SLUTTIN IT UP]
        else {
            this.outputText("The faerie stumbles out of your snatch, giggling and scooping the slippery girl-goo off her body, licking it up.  She crawls up your body to your lips, giving you a cunt-flavored kiss and babbling happily, \"<i>Mmm your cunt makes me so warm and giggly!  I'm so fucking stoned!  Gawddess, I'm hungry too – I'm gonna grab some food, and then come back for another dip in your honeypot, ok?</i>\"\n\n");
            this.outputText("She flits away, a little unsteady and reeking of female sex and desire.");
        }
        this.player.orgasm('Vaginal');
        this.dynStats("lib", -2, "cor", .5);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    private faerieShooAway(): void {
        this.spriteSelect(SpriteDb.s_faerie);
        this.clearOutput();
        this.outputText("You shake your hands, shooing away the tiny faerie.  She's clearly been touched by the magics of this land and you want nothing to do with her. With a pouting look, she turns and buzzes away.");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    protected faerieDoNothing(): void {
        this.spriteSelect(SpriteDb.s_faerie);
        this.clearOutput();
        if (this.player.nippleLength >= 1) {
            this.outputText("She looks you over, stopping at your upper torso and letting out a cry of glee. She lands on your chest, her exposed pussy coming to rest on your nipple. With one hand she grabs hold of you above her head and uses her other hand to guide the rapidly hardening nub between her legs. She sighs in delight as her tight confines squeeze your nipple hard, the feeling somewhere between pinching fingers and suckling lips. You gasp in delight yourself, and you notice she can exercise amazing control with her groin muscles as a rippling feeling courses through your nipple.\n\n");
            this.outputText("Your nipple starts to get sloppy and wet as if someone's tongue were around it, but it's really the faerie's love juices dribbling down, some running down your breast and some down her legs. She starts thrusting against you, and you notice her clit getting hard and pushing into your soft flesh. With a free hand you grab the area around your nipple and squeeze it harder, forcing more into her.\n\n");
            if (this.player.biggestLactation() > 1) this.outputText("A squirt of milk shoots inside her, making the faerie moan. She looks up at you with lusty, slitted eyes, squeezing her legs together to draw more from you.\n\n");
            this.outputText("Eventually you both find a rhythm and soon she's moaning loudly.  ");
            if (this.player.hasVagina()) this.outputText("With your other hand you start diddling your " + this.player.vaginaDescript(0) + ", adding your own soft moans to hers.  ");
            else if (this.player.hasCock()) this.outputText("With your other hand you start jerking your " + this.player.cockDescript(0) + ", adding your own soft moans to hers.  ");
            this.outputText("A few blissful moments later, she shudders and you feel her uncontrolled spasms around your nipple.  ");
            if (!this.player.isGenderless()) this.outputText("You join her shortly after.  ");
            this.outputText("The faerie goes limp and spirals to the ground, crashing gently and still twitching in the afterglow. Stepping back carefully, you leave her.");
            if (this.player.biggestLactation() > 1.5) this.outputText("\n\nA copious gout of your milk escapes her rosy folds.");
            this.player.orgasm('Tits');
            this.dynStats("lib", -2);
            this.doNext(this.camp.returnToCampUseOneHour);
            return;
        }
        if (this.player.hasVagina() && this.player.getClitLength() >= 1.0 && this.player.getClitLength() <= 4.5 && rand(2) == 0) {
            this.outputText("A smile crosses her face and she flutters down to your crotch. She starts by scissoring you despite the size difference, driving your clit into her despite its erect state. Compared to her, it looks massive. She swings one leg over it and starts impaling herself on it. Your taut clitoris barely fits inside her, and the tight confines on your sensitive nub are enough to make you weak in the knees. Staggering to the ground, you grab hold of her frail body in your fist and thrust her roughly on your engorged button. She wails in both pain and pleasure, being crushed and stretched open at once. Her cries of pain combined with the intense stimulation on your most sensitive part bring you to a quick orgasm.\n\n");
            if (this.player.vaginas[0].vaginalWetness >= Vagina.WETNESS_DROOLING) this.outputText("You drench the poor faerie completely in your female juices, soaking her hair and body. Overwhelmed and spent, you drop her to the ground and catch your breath. She licks up what's around her face, but is too weak to do anything else but lie in the dirt.\n\n");
            else this.outputText("Shuddering, you maintain your composure and keep going, trying to ride the high for another. Eventually you look down and you can see the faerie's eyes have glazed over and rolled to the back of her head. Her cunt has started clamping down on you a lot harder, evidence of her state of near-constant orgasm. The random clenching brings you off again very quickly and you have an intense orgasm, joining your fae cohort.\n\n");
            this.outputText("Time skips a beat and you eventually come down, gently relaxing your grip and disengaging the worn out faerie from your softening female parts. The faerie regains consciousness slowly and thanks you before flying off.");
            this.player.orgasm('Vaginal');
            this.dynStats("lib", -1);
            this.doNext(this.camp.returnToCampUseOneHour);
            return;
        }
        if (this.player.hasVagina() && this.player.getClitLength() > 4.5) {
            this.outputText("The faerie flies close to your ear and speaks in a volume that would be a whisper from another human, \"You've got some sexy parts girl, but you're too big for me. I hope you find someone to get you off so I can watch.\" Then she flies in front of you, cutely kisses the bridge of your nose, and flies off.");
            this.dynStats("lus", 5);
            this.doNext(this.camp.returnToCampUseOneHour);
            return;
        }
        this.outputText("The faerie flies close to your nipple and sucks it gingerly.  You pant in pleasure as you feel it pucker tight in her mouth, tingling with her saliva.  She lets it pop free, swollen with arousal.  Her hand flicks it playfully, the sudden sensation fluttering through you as you close your eyes in pleasure.  You recover and find she has flown high into the trees, waving playfully as she escapes.\n\nYou frown and begin to dress yourself, flushing irritably as your nipples protrude further into your clothes than you remember.");
        this.player.nippleLength += .25;
        if (this.player.nippleLength > 3 || this.player.biggestTitSize() <= 2) {
            this.outputText("  Thankfully it appears to be temporary.");
            this.player.nippleLength -= .25;
        }
        this.dynStats("sen", 1, "lus", 5);
        this.doNext(this.camp.returnToCampUseOneHour);
        return;
    }

    // [No] *(let her go)
    private letFaerieGo(): void {
        this.spriteSelect(SpriteDb.s_faerie);
        this.clearOutput();
        this.outputText("You apologize and release her, letting her fly away on gossamer wings.  She thanks you, buzzing up to your lips and planting a chaste kiss on your mouth.  She zips away into the woods without a glance back...");
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    // Disable Faerie encounter
    private disableFaerieEncounterForGood(alt: boolean = false): void {
        this.spriteSelect(SpriteDb.s_faerie);
        this.clearOutput();
        if (alt) {
            this.outputText("You tell the fairy to never bother you again. She looks heartbroken but knows that she's making the promise never to bother you.");
            this.outputText("\n\nYou have the feeling that you'll never be seeing her again...");
        }
        else {
            this.outputText("You apologize and release her, letting her fly away on gossamer wings.  She thanks you, buzzing up to your lips and planting a chaste kiss on your mouth.  She zips away into the woods without a glance back...");
            this.outputText("\n\nYou make a mental note and resolve to never catch her again.");
        }
        this.flags[kFLAGS.FAERIE_ENCOUNTER_DISABLED] = 1;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [YES] *make her pleasure you
    private faerieCaptureHJ(): void {
        this.spriteSelect(SpriteDb.s_faerie);
        if (this.player.hasStatusEffect(StatusEffects.FaerieFucked)) this.player.addStatusValue(StatusEffects.FaerieFucked, 1, 2);
        else this.player.createStatusEffect(StatusEffects.FaerieFucked, 2, 0, 0, 0);
        this.clearOutput();
        if (this.player.statusEffectv1(StatusEffects.FaerieFucked) < 15) {
            this.outputText("You hold her tightly and scold her, \"<i>If you don't like hard cocks, you shouldn't be dressed up like a such a slut, flying around and teasing me like that.  You should be ashamed of yourself.  Now you've got me all worked up - so you better make it up to me and take care of my little 'problem'</i>.\"\n\n");
            this.outputText("She looks up at you and gulps before nodding silently, unwilling or unable to resist your command.   ");
        }
        this.outputText("You let her loose and she hovers in place, as if pondering her one last chance to escape.  She sighs and looks back up, blushing fiercely as she lands on your hip and gazes down at " + this.player.clothedOrNakedLower("the bulge of ") + "your groin.  You can't help but laugh as she " + this.player.clothedOrNakedLower("slips under your " + this.player.armorName, "climbs onto you") + ", crawling across your sensitive thigh towards your " + this.player.multiCockDescriptLight() + ".\n\n");
        // Taurs get a special scene!
        if (this.player.isTaur()) {
            this.outputText("The tiny Faerie climbs on top of your " + this.player.cockDescript(0));
            if (this.player.cockTotal() > 0) this.outputText("largest " + Appearance.cockNoun(CockTypesEnum.HUMAN));
            this.outputText(" and crawls about on it for a while, getting used to its shape and taking in deep lungfuls of its musky odor. She wraps herself around you and begins rubbing herself up and down your hard length. As she moves around her tiny slit leaks cum in long streaks, teasing you with a cunt you can't penetrate. Pre begins to leak steadily from your tip as the faerie continues to work her way around, moaning quietly and betraying her inner desire.\n\n");
            this.outputText("Your body begins to naturally jerk forward and backward, attempting to hump the mare that isn't there. You can feel the faerie sliding about until she clenches onto you tighter, which only serves to make you hump harder. Realizing her mistake too late, she attempts to loosen herself, but your wild bucking sends her flying forward.\n\n");
            this.outputText("She smashes onto the end of your " + this.player.multiCockDescriptLight() + " and grasps at it. Her face crushes into your urethra as her tiny legs wrap themselves around the tip. Your wildly flailing cock starts to grow larger as your orgasm approaches, but the faerie doesn't notice as she happily drinks up your pre.\n\n");
            // [No testicles:
            if (this.player.balls == 0) this.outputText("Your tiny globules of semen go straight into her open mouth and she sucks them down gleefully before falling with a splat onto the pre soaked ground.\n\n");
            else {
                // [Small amount of cum:
                if (this.player.cumQ() < 50) this.outputText("Your semen splashes straight into her face and she's quick to suck it up. She falls with a splat onto the pre soaked ground while your member drips periodic droplets of cum onto her head.\n\n");
                // [Normal amount of cum:
                else if (this.player.cumQ() < 200) this.outputText("Your semen washes into her face and she loses her grip on your " + this.player.multiCockDescriptLight() + ". She falls with a splat onto the pre soaked ground and you spray her with periodic spurts of fresh cum.\n\n");
                // [Huge amount of cum:
                else this.outputText("Your semen collides with her face and she is propelled off of your cock onto the pre soaked ground. Your " + this.player.ballsDescriptLight() + " continue pumping out cum like a hose until she's almost swimming in it.\n\n");
            }
            this.player.orgasm('Generic');
            this.dynStats("lib", -.5);
            // Epilogue!
            if (this.player.statusEffectv1(StatusEffects.FaerieFucked) < 10) this.outputText("The faerie burps and giggles again before glaring up at you, accusing you with a mildly unfocused glare and asking, \"<i>Did you know we get drunk on cum?  Caushe I TRY SO HARRD not to get meshed up like this.</i>\"\n\n");
            else if (this.player.statusEffectv1(StatusEffects.FaerieFucked) < 15) this.outputText("The faerie burps and laughs drunkenly, patting the side of your " + this.player.leg() + " and slurring, \"<i>Oh by Marae's ripe titsh!  I needed that.  Do you thhink you could catsch me again?  I love feeling your cum coating my body.</i>\"\n\n");
            else this.outputText("The faerie burps and begins openly masturbating, panting and slurring happily, \"<i>Yush I-gasp-uh feel great!  MMMmmmhm, it makesh my twat so sensitive.  I'm gonna fly home and schtuff it full, then play with my clit till I fall ashleep!</i>\"\n\n");
            if (this.player.statusEffectv1(StatusEffects.FaerieFucked) < 15) this.outputText("She licks her fingers and rolls around laughing, \"<i>Hehe, who caresh!  I'm happy! WHEEEEE!</i>\"\n\n");
            this.outputText("The faerie takes off, still dripping, and flying in something less than a straight line...");
        }
        // Non-taurs
        else {
            this.outputText("The faerie reaches your swollen member and ");
            if (this.player.hasKnot(0)) this.outputText("climbs atop your knot, wrapping her legs around the narrower shaft to hold on.  You can feel her cheeks resting atop the 'bulb' of your canine anatomy, teasing you with feminine features you're far too large to penetrate.  ");
            else if (this.player.cocks[0].cockType == CockTypesEnum.HORSE) this.outputText("climbs atop your " + this.player.cockDescript(0) + ", hanging onto your ring of prepuce and wrapping her legs as far around your horse-like maleness as she can.  ");
            else if (this.player.cocks[0].cockType == CockTypesEnum.DEMON) this.outputText("climbs atop your " + this.player.cockDescript(0) + ", hanging on to the corrupted nubs and nodules as she threads her legs between them, squeezing you tightly as she hangs on.  You can feel her wet gash sitting atop a particularly sensitive bump, teasing you with a tiny cunt you'll never be able to penetrate.  ");
            else if (this.player.cocks[0].cockType == CockTypesEnum.TENTACLE) this.outputText("climbs onto your squirming " + this.player.cockDescript(0) + ", wrapping her legs tightly around it as it wiggles and writhes with excitement.  Unbidden, it curls around and rubs its reddish-purple head against her face like an animal.  She gives it a gentle squeeze and licks it.  ");
            else this.outputText("climbs on to your hardness, wrapping her legs tightly around it as she secures a perch against you.   You can feel her wet gash rubbing against your sensitive skin, teasing you with a tiny cunt you'll never be able to penetrate.  ");
            this.outputText("Your internal muscles clench unconsciously, squeezing out a dollop of pre that rolls down into the faerie's hair, soaking her head and face.  You can't see her reaction, but you can feel it oozing between her body and you, lubricating her as she humps and rubs against you.  Tiny muffled moans escape " + this.player.clothedOrNakedLower("your " + this.player.armorName + "", "her mouth") + ", indicating that some part of her is enjoying the task.\n\n");
            this.outputText("Though she can only stimulate a few inches of you at a time, it feels really good – better than it should, and a budding warmth on the edge of release builds inside you.  " + this.player.clothedOrNakedLower("Too late you realize you should have gotten at least partially undressed.  You cum before you can do anything about it, splattering your " + this.player.armorName + " with seed and leaving a wet patch on the crotch.  You can feel it dripping back onto you and the faerie as more spunk squirts out, soaking the tiny girl in spooge as the wet spot grows", "Good thing your junk is exposed as otherwise you would have ended up jizzing in your pants. You cum, splattering the faerie with seed. This continues until the tiny girl is soaked in spooge") + ".  ");
            if (this.player.cumQ() > 250) {
                this.outputText("You cum uncontrollably, " + this.player.clothedOrNakedLower("regretting your fertility as your body paints the inside of your " + this.player.armorName + " with goopy whiteness.", "painting the ground with goopy whiteness.") + "  ");
                if (this.player.cumQ() > 500) this.outputText("The proof of your release forms a puddle around you as your legs give out and y");
                else this.outputText("Falling backwards as your legs give out, y");
            }
            else this.outputText("Y");
            this.outputText("ou watch your wet groin squirm as the faerie finishes releasing your built-up tension and crawls out.  She's covered from head to toe in sloppy white jism, and is noisily slurping it up.\n\n");
            this.outputText("She rolls off of you, staggers, and plops down on her cute little ass next to you");
            if (this.player.cumQ() > 500) this.outputText(" in the cum");
            this.outputText(", giggling drunkenly.  ");
            if (this.player.statusEffectv1(StatusEffects.FaerieFucked) < 10) this.outputText("The faerie burps and giggles again before glaring up at you, accusing you with a mildly unfocused glare and asking, \"<i>Did you know we get drunk on cum?  Caushe I TRY SO HARRD not to get meshed up like this.</i>\"\n\n");
            else if (this.player.statusEffectv1(StatusEffects.FaerieFucked) < 15) this.outputText("The faerie burps and laughs drunkenly, patting the side of your " + this.player.leg() + " and slurring, \"<i>Oh by Marae's ripe titsh!  I needed that.  Do you thhink you could catsch me again?  I love feeling your cum coating my body.</i>\"\n\n");
            else this.outputText("The faerie burps and begins openly masturbating, panting and slurring happily, \"<i>Yush I-gasp-uh feel great!  MMMmmmhm, it makesh my twat so sensitive.  I'm gonna fly home and schtuff it full, then play with my clit till I fall ashleep!</i>\"\n\n");
            if (this.player.statusEffectv1(StatusEffects.FaerieFucked) < 15) this.outputText("She licks her fingers and rolls around laughing, \"<i>Hehe, who caresh!  I'm happy! WHEEEEE!</i>\"\n\n");
            this.outputText("The faerie takes off, still dripping, and flying in something less than a straight line...");
            this.player.orgasm('Generic');
            this.dynStats("lib", -.5);
            if (!this.player.hasStatusEffect(StatusEffects.Jizzpants) && this.player.armor.name != "nothing" && this.player.armor != this.armors.LTHCARM && this.player.armor != this.armors.GOOARMR) this.player.createStatusEffect(StatusEffects.Jizzpants, 1, 0, 0, 0);
            if (this.player.armor == this.armors.GOOARMR) {
                this.outputText("\n\nFortunately, your jizz gets absorbed into the blue goo covering your body.");
                this.getGame().valeria.feedValeria(this.player.cumQ() / 10);
            }
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }

}
