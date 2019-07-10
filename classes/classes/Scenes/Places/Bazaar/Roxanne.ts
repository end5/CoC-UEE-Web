import { BazaarAbstractContent } from "./BazaarAbstractContent";
import { TimeAwareInterface } from "../../../TimeAwareInterface";
import { LoggerFactory } from "../../../internals/LoggerFactory";
import { RandomNumberGenerator } from "../../../internals/RandomNumberGenerator";
import { CoC } from "../../../CoC";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { StatusEffects } from "../../../StatusEffects";
import { SpriteDb } from "../../../display/SpriteDb";
import { PerkLib } from "../../../PerkLib";
import { Tail } from "../../../BodyParts/Tail";

export class Roxanne extends BazaarAbstractContent implements TimeAwareInterface {
    private static LOGGER: ILogger = LoggerFactory.getLogger(Roxanne);

    private randomNumber: RandomNumberGenerator;
    // Roxanne Poisontail
    // -no hair,
    // -stand roughly 5'11\" in height,
    // -wang = 20" long at smallest
    // -tits = DD
    // -Dark purple, lighter violet up middle body.
    // -A pair of horns towards back of head.

    // -Black jacket, silver trim, leather pants + extra tight, black high heeled boots (2" up)
    // -Male but appears female, refuses to received.
    // -Dick grows the longer he goes without being sated.
    // -Drinking contest, has other friends.

    // Score = Height x (Thickness + 100)/200 x (toughness/100) + Bonus Score * 10 (bonus drops by 2 a week
    // 30-50 score needed to win

    /*Sex scenes:
    LOSS:
    -Get reamed when poisontail is huge
    -Get reamed when poisontail is less huge
    WIN:
    -Get licked vaginally
    -get fellatio'ed
    -get rimmed (cheap crappy scene)*/

    // Flags:
    // 221 - //-Met her?
    // 222 -Times Won Contest
    // 223 -Times Lost Contest
    // 224 -Who won contest last? (1 = pc, 2 = strahza)
    // 225 -How long has Strahza gone without sex?
    //     (200+ huge, 300+ 20% chance each day of shrink)
    // 226 -Is PC losing the Roxanne's drinking contest intentionally?
    // 227 -Drinking Contest Bonus Score

    public constructor(randomNumber: RandomNumberGenerator) {
        super();
        CoC.timeAwareClassAdd(this);
        this.randomNumber = randomNumber;
    }

    // Implementation of TimeAwareInterface
    public timeChange(): boolean {
        // Increase Roxanne's growing dick size...
        this.flags[kFLAGS.ROXANNE_TIME_WITHOUT_SEX]++;
        // Reset if she finds someone to take it (random at high values)
        if (this.flags[kFLAGS.ROXANNE_TIME_WITHOUT_SEX] >= 300 && this.getGame().time.hours === 1 && this.randomNumber.random(5) === 0) {
            this.flags[kFLAGS.ROXANNE_TIME_WITHOUT_SEX] = 1;
        }

        // hangover status stuff
        if (this.player.hasStatusEffect(StatusEffects.Hangover)) {
            // Countdown
            if (this.player.statusEffectv1(StatusEffects.Hangover) > 0) {
                this.player.addStatusValue(StatusEffects.Hangover, 1, -1);
            } else {
                this.outputText("\n<b>Your head finally clears as your hangover wears off. Drinking with the shemale lizard was definitely a bad idea.</b>\n");
                // Restore stats
                this.player.str += this.player.statusEffectv2(StatusEffects.Hangover);
                this.player.spe += this.player.statusEffectv3(StatusEffects.Hangover);
                this.player.inte += this.player.statusEffectv4(StatusEffects.Hangover);
                this.dynStats("cor", 0);
                // Clear status
                this.player.removeStatusEffect(StatusEffects.Hangover);
                return true;
            }
        }

        if (this.getGame().time.hours > 23 && this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_BONUS_SCORE] > 0) {
            this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_BONUS_SCORE]--; // Reduce drinking contest bonus
        }

        return false;
    }

    public timeChangeLarge(): boolean {
        return false;
    }
    // End of Interface Implementation

    // [Drinking Table Appearance]
    public RoxanneAppearance(): void {
        // When she there?
        if (this.getGame().time.hours > 12 && this.getGame().time.hours < 19) {
            // (Not Met)
            if (this.flags[kFLAGS.ROXANNE_MET] == 0) this.outputText("\n\nThere's a table with a half-dozen oddly-dressed lizans not too far from the fire. A keg is set up a few feet away and they seem to be having a good time.");
            // Met)
            else this.outputText("\n\nRoxanne and her usual crew are sitting at a table, drinking and telling bawdy stories near the fire.");
        }
        // return undefined;
    }
    // [Drinking Table Approach, Not Met Yet]
    public Roxanne1stApproach(): void {
        this.clearOutput();
        this.spriteSelect(SpriteDb.s_poisontail);
        this.outputText("You hesitantly approach the drinking lizard-folk, taking note of their unusual garments and appearance. They all wear black jackets with silver trim, tight-fitting leather pants, and tall, black boots. Oddly, the most feminine of them appears to be the leader. Her jacket is filled out with large, well-rounded DD-cup breasts, and her boots forgo the traditional shape for a sluttier, higher heel. Her scales are a dark purple, glittering darkly in the light, and while her head has a lizard-like shape, a pair of dragon-like horns bulge from the back of her skull in place of hair. The other lizans all appear to be males, but they act as if they're quite intimidated by the feminine leader.\n\n");
        this.outputText("Suddenly, the alpha-lizan glances up and meets your eye, her expression turning into a leering sneer as she asks, \"<i>See something you like " + this.player.mf("buddy", "girly") + "? Come on over, tell us your story!</i>\"\n\n");
        this.outputText("Do you approach?");
        this.unlockCodexEntry("Lizans", kFLAGS.CODEX_ENTRY_LIZANS);
        this.doYesNo(this.RoxanneChooseApproachOrRepeat, this.bazaar.enterTheBazaar);
    }

    // [Approach] – Flag as Met
    public RoxanneChooseApproachOrRepeat(): void {
        this.spriteSelect(SpriteDb.s_poisontail);
        this.clearOutput();
        if (this.flags[kFLAGS.ROXANNE_MET] == 0) {
            this.flags[kFLAGS.ROXANNE_MET]++;
            this.outputText("You walk up and take an empty chair, getting a better look at the lizans while their leader does the same to you. The others seem to ignore you, moving towards the table's far edge to converse in hushed tones.  The well-endowed girl leans over, sliding you a mug as she introduces herself. \"<i>The name's Roxanne Poisontail. Once a famed pirate, now another soul trapped in this twisted realm. You can just call me Cap'n Poisontail or Roxanne - what's your story?</i>\"\n\n");
            this.outputText("Her eyes slide up and down your body, half-listening as you introduce yourself and explain your role as a champion of Ingnam, sent here to protect it from demonic incursion.\n\n");
            this.outputText("\"<i>Huh. I didn't think anyone would ever come to this place on purpose. Well, maybe a pervert. I mean you can't take two steps without stumbling into some sex around here, if you don't mind slowly losing your mind to corruption that is. All this gorgeous demon-tail around... and I can't even fuck one of them without slowly losing myself. It's maddening!</i>\" exclaims Poisontail, her lip curling back to show rows of pointed teeth. Her desperate, lusty eyes fix on you, lighting up with sudden inspiration.\n\n");
            this.outputText("She says, \"<i>You don't look like one of them... you don't even smell like one. ");
            if (this.player.cor > 66) this.outputText("Yeah, you've got some corruption in you, but I don't think you're contagious like the demons and their ilk yet. ");
            this.outputText("I need to blow off some steam, " + this.player.short + ".</i>\" She spreads her legs and pats at the left one, revealing a dangerously large bulge that would rival that of a minotaur. \"<i>Oh, you hadn't noticed? I'm not exactly a girl. I didn't always look like this, but I foolishly bought a pill off a demon named Ceraph and have regretted it since. Sure, the pill she gave me made my cock bigger, but it NEVER stops growing. The only way I can shrink it back is to orgasm in someone's poop-deck, but it's tough finding someone who can take it. Cinnabar won't even let me buy her services, though I think she's waiting for the fruit to ripen, so to speak,</i>\" she chortles while shifting the equally large shapes of her huge, twin testes.\n\n");
            this.outputText("\"<i>Now, I feel like getting drunk nearly as much as I feel like screwing. Why don't we have a drinking contest? If I win, I get to bury this bad-boy in your ass and cum 'til I'm normal. If you win, I'll give you the best oral service a " + this.player.mf("guy", "girl") + " can get!</i>\"\n\n");
            this.outputText("You point out that she clearly gets the better end of the deal, and she replies, \"<i>So? Those are my terms. I'd rather be pinned under the weight of my own cock before I let someone dictate how I'm gonna get laid. Besides, you know you want to feel this.</i>\" Poisontail opens her mouth, letting her tongue loll out. It stretches out to an obscene length, all the way to the cleft of her big breasts, undulating and squirming sensually. She's got a point");
            if (this.player.cor < 33) this.outputText(", but would a champion really do something like that?");
            else this.outputText(".");
            this.outputText("\n\n");
            this.outputText("The piratical lizan slides a full mug your way and says, \"<i>What about it? We drink one-for-one. Loser is the one that gets cut off by the guy manning the keg first. Hell, I'll even buy.</i>\"\n\n");
            this.outputText("Do you engage her in a drinking competition?");
        }
        // [Approach – met but not drank yet]
        else if (this.flags[kFLAGS.ROXANNE_DRINING_CONTEST_WON] + this.flags[kFLAGS.ROXANNE_DRINING_CONTEST_LOST] <= 0) {
            this.outputText("\"<i>I see you've come back again " + this.player.short + ".  Did you come back for the free drinks, or... ?</i>\" Roxanne trails off, wiggling her tongue at you. She pats the huge, barely concealed bulge and asks, \"<i>Or did you want to lose? Remember, if I win I get to plug your ass with this beast. If you win, I'll give you oral service that only a lizard can. Now come on, let's drink until we forget this wretched place.</i>\"\n\n");
            this.outputText("Do you engage Captain Poisontail in a drinking contest?");
        }
        // [Approach – lost last contest and she's huge]
        else if (this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_LAST_WINNER] == 2 && this.flags[kFLAGS.ROXANNE_TIME_WITHOUT_SEX] >= 200) {
            this.outputText("\"<i>Oooh, praise the sea god Ulrun, you've returned. " + this.player.short + ", it's been a while, and I've gotten sooooo big,</i>\" cheers an ecstatic Roxanne. To emphasize her point she shows the seam-splitting bulge in her pants, rubbing it from the base all the way down to the tip, which rests next to her knee. She's so big, and a damp spot appears at her pant-leg's knee while the huge cock-sausage visibly inflates. Captain Poisontail asks, \"<i>So, can I count on you to get sauced and help me take care of this beast again, or do you actually think you have a chance of winning now?</i>\"\n\n");
            this.outputText("It looks like she wants to engage you in another drinking contest. If you lose ");
            if (this.player.analCapacity() >= 100) this.outputText("she's going to keep you stretched and gaping");
            else this.outputText("she's probably going to stretch your ass beyond its normal limits");
            this.outputText(". Do you enter a drinking contest with Roxanne?");
        }
        // [Approach – lost last contest and she's not big]
        else if (this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_LAST_WINNER] == 2 && this.flags[kFLAGS.ROXANNE_TIME_WITHOUT_SEX] < 200) {
            this.outputText("\"<i>Welcome back " + this.player.short + ". Did you miss my touch badly enough that you came back for more?</i>\" asks Roxanne. She pats an empty chair and spreads her legs, shifting her position to get more comfortable while reminding you of your recent 'defeat'. Thankfully it looks like she's had sex recently and her dick is a far more normal size. The lizan asks, \"<i>So, ready for another drinking contest? Standard rules – I win; I plug your sweet ass full. You win; I lick you to climax.</i>\"\n\n");
            this.outputText("Do you drink with Roxanne again?");
        }
        // [Approach Roxanne and won last time – small Roxanne]
        else if (this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_LAST_WINNER] == 1 && this.flags[kFLAGS.ROXANNE_TIME_WITHOUT_SEX] < 200) {
            this.outputText("Roxanne glares at you as you approach, throwing back a mug of ale before she greets you. \"<i>Welcome back. Well, I suppose I'm not too big right now anyway. Still, getting it back down would make walking around a little easier. What do you say, how about another drinking contest? Same rules – I win; you get reamed. You win, and I'll give you a sloppy oral tongue-bath that's sure to make you squirm.</i>\"\n\n");
            this.outputText("Roxanne slides an empty mug your way. Do you try to drink her under the table again?");
        }
        // [Approach Roxanne and won last time – HUEG Roxanne]
        else if (this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_LAST_WINNER] == 1 && this.flags[kFLAGS.ROXANNE_TIME_WITHOUT_SEX] >= 200) {
            this.outputText("Roxanne winces when you come back, idling rubbing the massive bulge in her trouser. Beads of pre run down the fabric, darkening it noticeably. She grunts, \"<i>You came back huh? I've been practicing and I NEED release. Let's have another drinking contest! The rules are unchanged, and this time I'll win and fuck you 'til you gape!</i>\" She looks desperate and horny, clearly aching for release.\n\n");
            this.outputText("Do you accept her offer to partake in the drinking contest?");

        }
        else this.outputText("If you're reading this, something broke.");
        // Clear the 'are you losing the contest intionally flag'
        this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_LOSE_ON_PURPOSE] = 0; // In case if lizans codex entry didn't unlock.
        this.unlockCodexEntry("Lizans", kFLAGS.CODEX_ENTRY_LIZANS);
        this.menu();
        this.addButton(0, "Yes", this.roxanneDrinkingContest);
        this.addButton(1, "No", this.roxanneDrinkingContestNo);
        this.addButton(2, "Lose", this.roxanneDrinkingContestLoseDeliberately).hint("Why win when the lizan's cock is so tempting and appealing? Lose on purpose.");
    }

    private roxanneDrinkingContestNo(): void {
        if (this.getGame().time.hours == 19 || this.getGame().time.hours == 20) {
            this.flags[kFLAGS.COUNTDOWN_TO_NIGHT_RAPE]++;
            if (this.flags[kFLAGS.COUNTDOWN_TO_NIGHT_RAPE] % 4 == 0 && this.player.gender == 1) {
                this.bazaar.nightBazaarButtfuck();
                return;
            }
        }
        this.bazaar.enterTheBazaarAndMenu();
    }

    private roxanneDrinkingContestLoseDeliberately(): void {
        this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_LOSE_ON_PURPOSE] = 1;
        this.roxanneDrinkingContest();
    }

    protected roxanneDrinkingContest(): void {
        this.spriteSelect(SpriteDb.s_poisontail);
        this.clearOutput();
        this.outputText("Roxanne ");

        if (this.flags[kFLAGS.ROXANNE_TIME_WITHOUT_SEX] >= 200) {
            this.outputText("stumbles over her huge manhood, working towards");
        } else {
            this.outputText("saunters over to");
        }

        this.outputText(" the demonic-looking deer-taur working the tap and gives him a weighty gem-pouch, covering the cost of the contest and her mates' drinking in advance. She lets the keg-keep top off the mug and throws it back, easily draining it with a few practiced swallows. Her tail slaps the table in front of you as she teases, \"<i>Are you going to check me out all day or get smashed? Come on!</i>\"\n\n");
        this.outputText("You take the mug and hand it to the tainted 'taur working the tap. ");

        if (this.flags[kFLAGS.ROXANNE_DRINING_CONTEST_WON] + this.flags[kFLAGS.ROXANNE_DRINING_CONTEST_LOST] <= 0 || this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_LAST_WINNER] === 2) {
            this.outputText("He smirks at you as he fills it, radiating amusement at your attempt to out-drink Roxanne Poisontail. It seems the locals don't believe you can win");

            if (this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_LAST_WINNER] === 2) {
                this.outputText(" after your last humiliation.");
            } else {
                this.outputText(" against such a renowned foe.");
            }
        } else {
            this.outputText("He leers at Roxanne as he fills your mug, remembering her last defeat and likely wishing he could feel her tongue as you did.");
        }

        this.outputText(" You ");
        if (this.flags[kFLAGS.ROXANNE_DRINING_CONTEST_WON] + this.flags[kFLAGS.ROXANNE_DRINING_CONTEST_LOST] < 3) {
            this.outputText("hesitantly sniff at the brew, taking in its dark color and heady, hoppy aroma before");
        } else {
            this.outputText("smile and lick your lips, inhaling the hoppy aroma before");
        }

        this.outputText(" you slam the dark beer back and swallow.\n\n");

        // (FIRST TIME)
        if (this.flags[kFLAGS.ROXANNE_DRINING_CONTEST_WON] + this.flags[kFLAGS.ROXANNE_DRINING_CONTEST_LOST] <= 0) {
            this.outputText("\"<i>You call that drinking? Watch and learn, " + this.player.mf("brother", "sister") + "!</i>\" shouts Roxanne triumphantly as she holds her mug aloft overhead. The frothy beverage begins to pour out, an amber waterfall of intoxicant raining down towards the lizan's face, but the canny pirate is ready for it. She opens her jaw and extends her tongue, over two feet of the pink-hued organ, catching the alcoholic downpour and funneling it past her smiling lips. Finished, she belches loudly and pumps her hips at you rudely. \"<i>I hope you're ready to get fucked!</i>\"\n\n");
        }
        // (REPEAT: PC HAS NOT YET WON)
        else if (this.flags[kFLAGS.ROXANNE_DRINING_CONTEST_WON] === 0) {
            this.outputText("\"<i>You still drink like an amateur. Still, it doesn't surprise me that you came back to old Captain Poisontail for a bout with my little manhood,</i>\" teases the lizan pirate as she wraps her tongue around the handle and lifts it to her lips, gulping the entire thing in one huge, throat-relaxing chug. Roxanne belches loudly and pumps her hips at you as she says, \"<i>Ready for another fucking?</i>\"\n\n");
        }
        // (REPEAT: PC HAS WON AND NEVER LOST)
        else if (this.flags[kFLAGS.ROXANNE_DRINING_CONTEST_WON] > 0 && this.flags[kFLAGS.ROXANNE_DRINING_CONTEST_LOST] <= 0) {
            this.outputText("\"<i>Last time I wasn't ready! Well, I guess it's on! This time I won't lose, and you can bet I'm gonna ride you twice as hard for payback!</i>\" Roxanne shouts with a feigned air of confidence. She downs her drink quickly, foam frothing at the corners of her draconian muzzle in her hurry not to be outdone by you. As you watch, she licks her lips and shivers, fidgeting uncomfortably while her cursed cock gets a bit harder in her pants.\n\n");
        }
        // (REPEAT: PC HAS LOST BEFORE BUT WON LAST TIME)
        else if (this.flags[kFLAGS.ROXANNE_DRINING_CONTEST_LOST] > 0 && this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_LAST_WINNER] === 1) {
            this.outputText("\"<i>Don't get cocky, pup. Roxanne Poisontail has defeated and claimed bigger sailors than you in her lifetime. That last time was a fluke,</i>\" she proclaims. The determined lizan swishes her full mug around for a moment before downing it in one huge, throat-bulging gulp.  Her prehensile tail slaps your " + this.player.buttDescript() + " without warning, and she chuckles when you nearly lurch out of your seat in surprise. \"<i>That's just a warm-up.</i>\"\n\n");
        }
        // (REPEAT: PC HAS WON BEFORE BUT LOST LAST TIME)
        else {
            this.outputText("\"<i>Don't you realize any previous victory was a fluke? Watch and learn pup,</i>\" taunts Roxanne as she devours her mug in a single, throat-bulging swallow. You chuckle, an involuntary burp interrupting your mirth as the piratical lizan pumps her hips at you rudely, her bulging manhood clearly outlined in the suddenly-tight trousers. \"<i>I can't wait to bury this thing inside your ass again!</i>\"\n\n");
        }

        // [DRINKING CONTEST CONTINUES – not losing intentionally]
        if (this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_LOSE_ON_PURPOSE] === 0) {
            this.outputText("The 'taur at the tap quickly grows bored with the constant bantering between the scaly swashbuckler and yourself, only bothering to look your way when the two of you walk back for a refill. The gluttonous chugging that started the contest gives way to a more languid pace as you and Roxanne become increasingly intoxicated, slowing down in hopes that the other will be judged unfit first. It does get a little hard to focus with the way she's constantly eyeballing you, and her curvy figure and ");

            if (this.flags[kFLAGS.ROXANNE_TIME_WITHOUT_SEX] >= 200) {
                this.outputText("massive, seam-ripping bulge");
            } else {
                this.outputText("hard-to-hide bulge");
            }

            this.outputText(" give you more than an eyeful every time you return her leer. Still, the scaly shemale must be feeling the same way, judging by the large damp spot her cock is making.\n\n");
            this.dynStats("lus", 25);
        }
        // [DRINKING CONTEST CONTINUES – losing intentionally]
        else {
            this.outputText("The 'taur at the tap quickly grows bored with the constant bantering from Roxanne and the flirting you shower the lizan in. You down your drinks quickly, even sneaking refills while the lizan is distracted in order to speed your inevitable loss. She looks at you, clearly checking you out while you unabashedly fixate on the pulsing mass of cock-flesh that strains her oh-so-tight pants. Roxanne stops drinking and walks over to you, a little unsteady but still in control of herself, and pulls your head against her groin, letting you nuzzle it while she puts filled mugs in your hands. \"<i>Go on and drink... good " + this.player.mf("boy", "girl") + ",</i>\" she coos when you turn to the side and swallow more of the delicious brew.\n\n");
        }

        let score: number = 0;

        // Calculate score if not
        if (this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_LOSE_ON_PURPOSE] === 0) {
            score = (this.player.tallness * ((this.player.thickness + 100) / 200) * (this.player.tou / 100)) + this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_BONUS_SCORE];
            if (this.player.findPerk(PerkLib.SatyrSexuality) >= 0) {
                score += 10; // satyrs are not easy to beat in drinking contest!
            }

            if (this.player.findPerk(PerkLib.Lustzerker) >= 0) {
                score += 10; // as well as salamanders
            }

            if (this.player.findPerk(PerkLib.Dragonfire) >= 0) {
                score += 10; // and dragons
            }

            if (this.player.findPerk(PerkLib.EnlightenedNinetails) >= 0 || this.player.findPerk(PerkLib.CorruptedNinetails) >= 0) {
                score += 10; // kitsune would always find a way to trick
            }

            if (this.player.findPerk(PerkLib.Medicine) >= 0) {
                score += 5; // it gives poison resistances, after all
            }

            if (this.player.findPerk(PerkLib.Resolute) >= 0) {
                score += 5; // never surrender!
            }
        }
        // If score is less than 30-50 (Strahza is inconsistant!)
        // [Lose!]
        if (score < (45 + this.randomNumber.random(20))) {
            Roxanne.LOGGER.debug("Lost to Roxanne with a score of {0}", score);
            // Increment loss count!
            this.flags[kFLAGS.ROXANNE_DRINING_CONTEST_LOST]++;
            // Set who won contast last
            this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_LAST_WINNER] = 2;
            // Gain big bonus
            this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_BONUS_SCORE] += 10;
            this.outputText("Giggling and nearly tripping up on your own " + this.player.feet() + ", you stumble up to the corrupted deer-taur. He looks at your wobbling stance, nearly-vacant eyes, and dopey grin before he shakes his head from side to side and says, \"<i>No.</i>\" ");

            if (this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_LOSE_ON_PURPOSE] === 0) {
                this.outputText("Nooooo! You're cut off! That means Roxanne won...");
            } else {
                this.outputText("Yessss! You finally got so drunk that Roxanne has no excuse not to pack your drunk ass full of lizan-spoo!");
            }

            this.outputText(" A scaled hand slaps your " + this.player.buttDescript() + " spinning you around to fall drunkenly into the pirate's soft, cushy chest. \"<i>Don't worry, I'll be gentle,</i>\" she whispers, hooking an arm around your sagging frame.");
            // CHOOSE SEX SCENE
            // Chance of big booty butt loss!
            if (this.player.butt.rating > 12 && this.player.tone <= 50 && this.flags[kFLAGS.ROXANNE_DRINING_CONTEST_LOST] > 1 && this.randomNumber.random(2) === 0) {
                Roxanne.LOGGER.debug("Starting loss scene: Big booty");
                this.doNext(this.bigBootyRoxanneContestLoss);
            } else if (this.flags[kFLAGS.ROXANNE_TIME_WITHOUT_SEX] >= 200) {
                // TO huge or regular anal
                Roxanne.LOGGER.debug("Starting loss scene: Huge");
                this.doNext(this.roxanneFucksYourAssOHGODITSHUGE);
            } else {
                Roxanne.LOGGER.debug("Starting loss scene: Normal");
                this.doNext(this.roxanneReamsYouNormal);
            }
        }
        // [WIN]
        else {
            Roxanne.LOGGER.debug("Won against Roxanne with a score of {0}", score);
            // Increment win count!
            this.flags[kFLAGS.ROXANNE_DRINING_CONTEST_WON]++;
            // Set who won contest last
            this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_LAST_WINNER] = 1;
            // Gain small bonus
            this.flags[kFLAGS.ROXANNE_DRINKING_CONTEST_BONUS_SCORE] += 4;
            this.outputText("Laughing uproariously, you watch with a bemused expression while Roxanne tries to stumble up to the tap, tripping over her tail three times before she finally manages to ask for another mug. The partly-corrupted deer-taur shakes his head and folds his arms across his chest. She's been cut off! You win! The lecherous lizan stamps her heeled boot in the dirt before tramping back over to you, hips swaying drunkenly. She trips on her tail again, this time falling face-first into your lap. Hiccuping drunkenly, Roxanne slurs, \"<i>Well at leasht I don't havta go far to give you your winningshh, huh?</i>\"\n\n");
            this.outputText("The other lizans are looking at you with a watchful eye. It looks like you'll have to stick by the terms of the contest. What manner of oral service do you make her provide?");
            // [Fellatio] [Cunnilingus] [Rimming]
            this.menu();

            if (this.player.hasVagina()) {
                this.addButton(0, "Cunnilingus", this.roxanneCunnilingus);
            } else {
                this.addDisabledButton(0, "Cunnilingus");
            }

            if (this.player.hasCock()) {
                this.addButton(1, "Fellatio", this.roxanneGivesABlowjob);
            } else {
                this.addDisabledButton(1, "Fellatio");
            }

            this.addButton(2, "Rimming", this.roxanneRimjob);
        }
    }

    // [GET A JOB OF BLOWNESS]
    private roxanneGivesABlowjob(): void {
        this.spriteSelect(SpriteDb.s_poisontail);
        this.clearOutput();
        const x: number = this.player.biggestCockIndex();
        this.outputText("You open the lower portion of your " + this.player.armorName + " and, pulling it back, hang out your " + this.player.multiCockDescriptLight() + "; ");
        if (this.player.lust100 < 70) this.outputText("it stiffens to a full, erect state.");
        else this.outputText("the already-hard cock-flesh stands proud and erect.");
        this.outputText(" Roxanne giggles drunkenly, her half-lidded eyes looking up as she wobbles back and forth on her knees. \"<i>I don't do thish that much, but when you've got a dick that getsh as big as mine... you learn just where the good spotsh are.</i>\"\n\n");

        this.outputText("Roxanne's smooth, scaled hand curls around the ");
        if (this.player.hasKnot(x)) this.outputText("knot");
        else if (this.player.hasSheath()) this.outputText("sheath");
        else this.outputText("base");
        this.outputText(", squeezing you softly while she steadies herself on your " + this.player.cockDescript(x) + ". She titters, letting a few inches of tongue slip through her lips to envelop your sensitive " + this.player.cockHead(x) + ", circling the engorged cock-flesh with drunken slobbers. ");
        if (this.player.balls > 0) this.outputText("A set of warm, long-nailed fingers squeeze your " + this.player.ballsDescriptLight() + ", dragging sharp nail-tips along the underside of your sack to tease the poor, cum-packed orbs. ");
        this.outputText("The lizan glances back up at you, inebriated; her half-vacant eyes make love to you while her pink tongue worships your beer- and spit-covered member.\n\n");

        this.outputText("You slump back in your chair, sprawling out your " + this.player.legs() + " around you, completely relaxed by the alcohol flowing through your veins and the exquisite oral service. Roxanne returns her focus to your " + this.player.cockDescript(x) + ", more tongue spilling from her gaping maw to curl around your lust-engorged shaft. The drunken lizard's oral organ devours ");
        if (this.player.cockArea(x) < 60) this.outputText("the entire length of your " + this.player.cockDescript(x));
        else this.outputText("as much of your over-sized member as she can encompass");
        this.outputText(", constricting, snake-like, to hold you in a slippery, warm embrace. Suddenly, a pointed nail drags over your taint, pressing just hard enough to hold you still while the shemale pirate works your " + this.player.cockDescript(x) + " with her tongue");
        if (this.player.hasVagina()) this.outputText(", stopping just short of your female entrance");
        this.outputText(".\n\n");

        this.outputText("Slurping and pumping, the pulsating tongue drags over your " + this.player.cockDescript(x) + ", molding into a perfect cock-sleeve. At first it's a slow, gradual pump that smears your shaft with booze-flavored spit, but when the first dollop of pre-cum rolls onto the flexible fellatio-tool, the pirate goes into over-drive, pumping with wild abandon. Her tail whips back and forth, passionately slapping the table, chairs, and dirt in her excitement.\n\n");

        this.outputText("A few demons start to approach, but the lizan crew interposes themselves between their captain and the interlopers, shooing them off before they can start something. You barely notice, so focused are you on the feel of saliva running down your " + this.player.cockDescript(x) + " and the soft, pliant mouth flesh trying to wring the jism from your shaft.  The warmth of orgasm starts to build in your loins, and you begin to pump at the tongue instinctively, hips rising up off the chair in spite of the sharp fingernail's warning.\n\n");

        this.outputText("SMACK! Roxanne's tail slaps into your " + this.player.buttDescript() + ", stinging the exposed " + this.player.skin.desc + ". Her eyebrows narrow in irritation while she wraps her arms around your waistline, steadying her off-balance body while she spanks and pumps you in a drunken frenzy. You hump her face, pressing your " + this.player.cockHead(x) + " against her lips to smear them with a glaze of leaky pre-cum. Grabbing her horns, you cry out and pleasure and try to pull her down, but she spanks you, HARD. You yelp in pain, dropping her horns and submitting completely to her tongue and the pleasure it brings.\n\n");

        this.outputText("The wiggling, flexible tongue-tip presses down on your urethra, bottling the cum up inside you. Tiny rivulets of white goo squirt and leak around the pink blockage, rolling over the many rings of tongue while your urethra bloats wide. The lizan looks up, her dull, glazed eyes locking on to yours as she uncovers your cum-slit, then shivering as a ");
        if (this.player.cumQ() >= 1500) this.outputText("huge torrent utterly drenches her face, horns, neck, and tight top");
        else if (this.player.cumQ() >= 500) this.outputText("a huge spurt soaks her face and horns");
        else this.outputText("big spurt splatters her face");
        this.outputText(" with cum. Her soft, oral organ squeezes the spit-slick surface, milking the rest of your cum from your " + this.player.cockDescript(x) + " and " + this.player.ballsDescriptLight() + ".\n\n");

        this.outputText("The pirate pulls back, uncoiling her tongue to slurp the heavy load from her face");
        if (this.player.cumQ() >= 1500) this.outputText(" and body");
        this.outputText(". \"<i>Jeeze, pent up much?</i>\" she laughs, struggling to stand while giggling at her own supposed cleverness. Happy with how the contest worked out, you slip " + this.player.sMultiCockDesc() + " into your " + this.player.armorName + " and wobble off back to camp.");
        // (-100 lust, -1 int)
        this.player.orgasm('Dick');
        this.dynStats("int", -1);
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    // [Receive Oral – Vaginalingus]
    private roxanneCunnilingus(): void {
        this.spriteSelect(SpriteDb.s_poisontail);
        this.clearOutput();
        this.outputText("You shimmy out of your " + this.player.armorName + " and lean back, exposing your " + this.player.vaginaDescript() + " to the drunken lizan's maw. She wobbles back and forth for a moment, clutching at your " + this.player.legs() + " to steady herself before she leans in, brushing her scaled nose against your vulva. You shudder from the sudden contact with her scales, but she doesn't rush it, instead huffing and sniffing at the moist entrance. Her alcohol-lidded eyes gaze up at you, the bleary orbs slightly confused as her jaw slowly opens to release her tongue.\n\n");
        this.outputText("The pink length of Poisontail's tongue oozes out like a sentient creature, waggling slightly as if sniffing the air before it presses on the ");
        if (this.player.wetness() >= 4) this.outputText("juice-dribbling ");
        else if (this.player.wetness() >= 2) this.outputText("juicy ");
        this.outputText("entrance of your loins. You swoon, leaning against the chair's back and scooting your crotch forward in a fit of wanton need. The tip of Roxanne's nose disappears into the moist lips, her slick, oral organ engulfed by your lusty tunnel. It squirms and wriggles inside you, the thick pink protrusion lashing about, swirling in a circular motion to lap the juice from your walls. Spit begins to drip down your " + this.player.legs() + " and you see Roxanne's saliva frothing at the corners of her mouth while she works you over.\n\n");

        this.outputText("Face blushing red, you groan and hump at the lizan, grabbing her horns so that you can smear her nose into your " + this.player.clitDescript() + ". She pulls back, resisting your insistent pulls with inebriated strength, but before you can let go she reverses direction and smashes her forehead into your gut, winding you. Your fingers release immediately, clutching at your aching middle while the angry lizard snarls, \"<i>You're getting oral, NOT using me as a dildo! ...but I am sorry I hit you that hard. I just needed to breathe. Relax and let me make it up to you...</i>\"\n\n");

        this.outputText("The drunken lizan puts her soft, lightly scaled fingers around you to squeeze at your " + this.player.buttDescript() + " and leans in to give your " + this.player.clitDescript() + " a tender kiss. Her massive tongue ");
        if (this.player.getClitLength() < 16) this.outputText("dwarfs");
        else this.outputText("envelops");
        this.outputText(" the ");
        if (this.player.getClitLength() < 1) this.outputText("little pleasure buzzer");
        else if (this.player.getClitLength() < 3) this.outputText("swollen love-button");
        else this.outputText("cock-like lady-part");
        this.outputText(", slobbering over it with a lewd tongue-kiss. Her frothy spit completely soaks it ");
        if (this.player.getClitLength() >= 3) this.outputText("before she curls tightly around the female member, enveloping it with flexible, gooey tongue. You catch your breath just in time to exhale the noisy sounds of your pleasure, and groan out loud. Roxanne takes the auditory encouragement to heart and begins pumping her tongue while she places her lower lips against your " + this.player.vaginaDescript() + " and hums. As if that wasn't enough, she begins twisting the curled tongue up and down your " + this.player.clitDescript() + " rotating it as she pumps you.");
        else this.outputText("before she lets her spit-sloppy tongue push through the saliva-soaked entrance of your mound. You catch your breath just in time to exhale noisy sounds of pleasure, groaning out loud while you're speared with flexible, gooey tongue. Roxanne takes the auditory encouragement to heart and begins to pump her tongue deep inside you, at least two feet of constantly-thickening appendage coiling over your entrance before sliding inside to kiss your cervix. As if that wasn't enough, a moment later she starts to hum, nuzzling at your " + this.player.clitDescript() + " while she tongue-fucks you.");
        this.outputText("\n\n");

        // (ORGASM HERE!)
        this.outputText("Helplessly twitching in your place, you fight with your body's desire to copulate, trying not to impale your quivering snatch on the pirate's nose. ");
        if (this.player.hasFuckableNipples()) {
            this.outputText("Roxanne pulls her hands off your ass and reaches up, swaying unsteadily until she catches your " + this.player.nippleDescript(0) + "s. A second later she slips her digits inside the welcoming tit-pussies, finger-fucking your breasts as ");
            if (this.player.biggestLactation() < 1.5) this.outputText("expertly as the one below");
            else this.outputText("they begin to squirt milk around her");
            this.outputText(". ");
        }
        this.outputText("Unable to dam the pressure up inside you any longer, you cum with brain-breaking, mouth-babbling intensity. The lizan doesn't relent in the slightest as you begin to spasm");
        if (this.player.wetness() >= 5) this.outputText(" and squirt");
        this.outputText(" against her. She tightens her grip and speeds up her tongue's sensual massaging, nearly blacking you out while you writhe in her embrace. Heat, pure, blissful heat, spreads through you, draining the strength from your uncontrollable twitches and leaving languid warmth in its place. ");
        if (this.player.hasCock()) this.outputText(this.player.SMultiCockDesc() + " bounces on her head, between her horns, spilling a trail of sticky seed down her back. ");
        this.outputText("You slouch down, pleasure-drunk and giggling while Roxanne disentangles herself.\n\n");

        this.outputText("The cocky, drunken lizan slurs, \"<i>Boysh, I'ma need a while to schleep this one off. Next time I plug her asssshh!</i>\"\n\n");

        this.outputText("You smirk back, slowly putting your clothes back on. Roxanne can do little to prevent you from noting the massive, unmistakable cock-outline in her pre-cum-soaked pants. She gives you a smoky glare filled with lust and aggression, but she won't be getting her prize this time!");
        // (-100 lust, -1 int)
        this.player.orgasm('Vaginal');
        this.dynStats("int", -1);
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    // [Receive Oral – SkyrRimjoooooooob]
    private roxanneRimjob(): void {
        this.spriteSelect(SpriteDb.s_poisontail);
        this.clearOutput();
        this.outputText("You shimmy out of your " + this.player.armorName + " and smirk, turning around to lean onto the table");
        if (this.player.biggestTitSize() >= 2) this.outputText(", your breasts cushioning you from the hard wood below");
        this.outputText(". Poisontail eyeballs the ring of your " + this.player.assholeDescript() + ", salivating as she grabs your " + this.player.buttDescript() + " in her scaled hands. With anguished slowness, she pulls the cheeks as wide apart as possible. You hear her gasp in delight a split-second before you do the same. Her tongue launched from her mouth and found your " + this.player.assholeDescript() + " immediately! Now she's sliding it in circles around the sensitive ring, making the skin of that pucker tighten and wink.\n\n");

        this.outputText("Roxanne groans and gives your " + this.player.buttDescript() + " a raunchy squeeze, making love to your cheeks as her tongue worships your asshole. She murmurs, \"<i>Thish would be sho much better if it was jussht foreplay. Why don't you lose next time, okay babe?</i>\" You moan out loud when her tongue returns to its task, arching your back and whimpering from the intense, anal pleasure. ");
        if (this.player.hasCock()) {
            this.outputText(this.player.SMultiCockDesc() + " ");
            if (this.player.lust100 < 70) this.outputText("hardens");
            else this.outputText("pulses with need");
            this.outputText(", a bead of pre-cum already hanging from the tip. ");
        }
        if (this.player.hasVagina()) this.outputText("Meanwhile, your neglected box is getting wetter and wetter, with no sign of stopping. The lizan's massive, questing tongue ignores it. ");
        this.outputText("Completely focused on your anal ring, Roxanne keeps her tongue exactly where it is, working the sparking nerves around your rectum incessantly.\n\n");

        // (Optional cock milking)
        if (this.player.hasCock()) {
            this.outputText("Surprisingly, one of the pirate's hands comes off your " + this.player.buttDescript() + " to tug on ");
            if (this.player.totalCocks() > 1) this.outputText("one of ");
            this.outputText("your member");
            if (this.player.cockTotal() > 1) this.outputText("s");
            this.outputText(", milking the shaft like a cow's teat. Smooth, scaled fingers circle it at the base and slowly slide down, tugging at your skin and squeezing out thick dollops of pre-cum with every pull.\n\n");
        }
        // (Optional pussy milking if no cock)
        else if (this.player.hasVagina()) this.outputText("Surprisingly, one of the pirate's hands comes off your " + this.player.buttDescript() + " to play with your " + this.player.vaginaDescript() + ". Long, sharp nails play over the sensitive skin of your vulva while the supple, scaled thumb presses between them. Juicy girl-cum quickly coats her fingers, but it doesn't seem to bother her in the least.\n\n");

        this.outputText("The long, wondrous tongue pushes forward, wriggling inside you. At first it's just the tip, but the drunken lizard forces inch after inch inside you with constant intensity. You can feel her spit frothing around your " + this.player.assholeDescript() + ", bubbling while she fills your backdoor with ever larger quantities of saliva-covered tongue. Seeming to go on forever, the penetration robs you of strength, filling you with dozens more inches. Roxanne hums at your dark hole, vibrating her tongue inside you while it arches to caress the most sensitive spots.\n\n");

        this.outputText("Orgasm hits you powerfully, your " + this.player.assholeDescript() + " doing its best to choke the massive, pink tongue inside it. You throw back your head and howl with pleasure, bumping your " + this.player.buttDescript() + " into your lizan lover's nose unconsciously. She gives you a knowing squeeze while her tongue keeps up the attack, forcing waves of unfiltered, raw pleasure into your cerebellum.");
        if (this.player.hasCock()) {
            this.outputText(" You spurt in her hand, letting her squeeze out dollop after dollop of cum. Somehow you keep your whimpering to a minimum while that long, perfect tongue rubs your prostate and her hand squeezes every last drop into the dirt.");
            if (this.player.cumQ() < 500) { }
            else if (this.player.cumQ() < 1000) this.outputText(" It forms a nicely-sized pool before the ground wicks it up.");
            else if (this.player.cumQ() < 1500) this.outputText(" It forms a large pool before the ground soaks it up.");
            else this.outputText(" It forms a massive pool before the ground soaks it up.");
        }
        else if (this.player.hasVagina()) {
            this.outputText(" You quiver and cum on her fingers, ");
            if (this.player.wetness() >= 4) this.outputText("soaking them with your gushing orgasms ");
            else this.outputText("sliming them with copious girl-cum ");
            this.outputText("while she teases your " + this.player.clitDescript() + " with those terribly-slow touches.");
        }
        this.outputText("\n\n");

        this.outputText("Completely finished, you can do naught but tremble while Roxanne disentangles her tongue from your rectum, popping from your backside with a noisy slurp. She immediately falls over and giggles, completely drunk, but she somehow staggers back up to give your ass a smack. You follow her example and pull yourself to your feet, tired from the anal orgasm but feeling quite relaxed. Once you've readied yourself, you realize that Roxanne's crew are arranged in a semi-circle around you. You note a number of demons are on the prowl beyond that protective ring, though they seem to be dispersing now that the act has finished. You make your way back to check on camp once it looks safe.");
        // (-100 lust, -1 int
        this.player.orgasm('Anal');
        this.dynStats("int", -1);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [OH SHIT YOU SO DRUNK AND GETTING REAMED BY LIZARD CAWK]
    private roxanneReamsYouNormal(): void {
        this.spriteSelect(SpriteDb.s_poisontail);
        this.clearOutput();
        this.outputText("A foot interposes itself between you and the table, and a shove sends you flopping onto the booze-soaked planks face-down, the last few inches of descent slowed by Roxanne's firm hands. A scaled digit digs under your " + this.player.armorName + ", pulling and tugging. As each piece is forcibly removed, you're left more and more naked, totally exposed to the heat of the fire and the smooth scales of the lizan's body. The room lurches when you to try to move and stop her, and you flop back down, ignoring the drunken spin of your surroundings. Laughing heartily, the pirate leans over you to pin your hands to the table. While her position has the intended effect of restraining you, it also gives you the enviable ability to feel Roxanne's iron-hard nipples pressing into your back.\n\n");

        this.outputText("You giggle underneath the lizan, your face mopping up the frothy brew that spilled during the previous bout of binge drinking. Lapping it up, you forget about your predicament as you adjust to the warm, scaled body overtop you. Roxanne leaves you to your distractions while she wiggles out of her pants, her tail swaying to counterbalance the now-freed bulk of her member. The sodden shaft rises to bump your butt, dripping with pre-cum as it wiggles between your cheeks. It prods your " + this.player.assholeDescript() + ", rousing you from your drunken stupor and earning a look back, but the pirate begins to tongue the edge of your ear, making you giggle and relax into sexy, alcohol-lubricated acquiescence.\n\n");

        this.outputText("With a slow, steady push, Captain Poisontail forces her drippy tip through your liquor-loosened ring and into your innards. You grunt in discomfort from the sudden straightening of your colon, unable to take such a beast in silence. It's enough to stir you from your semi-conscious silence, and you try to ask her to go slower, slobbering and slurring your protests through numbed lips. \"<i>Relax, my helpless prey. Don't fight. Just lie there and take what's coming to you,</i>\" orders the still somewhat-sober lizan while she leers at you with an expression that borders on malice. Her words ring true, you're drunk and helpless to resist the inches of thick shemale cock sliding into your stretched pucker.");
        this.player.buttChange(Math.floor(30 + (this.flags[kFLAGS.ROXANNE_TIME_WITHOUT_SEX] / 4)), true, true, false);
        this.outputText("\n\n");

        this.outputText("Too intoxicated to control yourself, your sphincter clenches repeatedly, drawing in a few more inches of Roxanne's thickness. It packs you completely, filling you in a way that centers all of your limited thoughts on the feel of that bulbous mass inside your anus. While the lizan is scaled from head to toe, her penis clearly isn't. You judge by the shape stuffing you that her cock is like that of a human, a long veiny shaft capped with a rounded crown. Her balls slap ");
        if (this.player.balls > 0) this.outputText("against your own, the " + Roxanne.num2Text(this.player.balls + 2) + " orbs rolling around each other in their sweaty sacks");
        else if (this.player.hasVagina()) this.outputText("against your " + this.player.vaginaDescript() + ", the sweaty orbs growing slick with the moisture of your growing need");
        else this.outputText("against your taint, the sweaty skin pressing hard between your bodies");
        this.outputText(".\n\n");

        this.outputText("There's nothing to do but lie there and accept it. You're too drunk to run even if you did get the aggressive shemale out of your rectum. Worse still, her 'crew' of male lizans are standing guard in a ring around the pair of you. Even though they seem focused on protecting against external threats, you know you'd never get past them without tripping over a tail or being snatched by a strong, sober arm. You belch and relax, your face sliding over the booze-slicked table while Roxanne starts to pound away at your stretched ");
        if (this.player.tail.type > Tail.NONE) this.outputText("tail-hole");
        else this.outputText("anus");
        this.outputText(". It begins to feel good");
        if (this.player.hasCock()) this.outputText(", very good,");
        this.outputText(" as she bumps and grinds against your deepest places, spurting drops of pent-up need from her swollen shaft.\n\n");

        this.outputText("\"<i>Unf... you're so fucking tight, " + this.player.short + "! Gods, I hate Ceraph's curse and this wretched world... but your ass... your gorgeous, cock-slurping asshole... it's divine,</i>\" praises Roxanne, smacking your ass-pillows in between her slow, rump-filling pumps. She continues ranting with her thrusts, picking up the pace while she says, \"<i>So hot... my beautiful, drunken anal slut. Look at you... you're soaked in your spilt beer, panting while I ream your rump. Did you even want to win? I bet you secretly wanted this, didn't you? Go on, nod and tell me how much you want this.</i>\"\n\n");

        this.outputText("You shake your head no, and are rewarded for your disobedience with a violent, butt-jiggling tail-whip. Gasping from the pain, your " + this.player.assholeDescript() + " contracts involuntarily, milking Roxanne's member for a few more drops of pre. The aggressive lizard really gets into it, her massive, DD-cup tits pinning you to the table while she smacks your cheeks with her flexible lizan tail.  Pounding and slapping you, she abuses you for every dick-milking squeeze you'll give her, ");
        if (this.player.findPerk(PerkLib.Masochist) < 0) this.outputText("until you're voluntarily working your abdominal muscles to avoid the pain.");
        else this.outputText("until you're moaning with delight from every butt-reddening strike.");
        this.outputText(" Breaking under the onslaught, you mewl drunkenly, \"<i>Fuck my assh... plug me with your cum,</i>\" and wonder if you actually meant it.\n\n");

        // (DICKS:
        if (this.player.hasCock()) {
            this.outputText("The constant pressure of her thrusts seems to flow straight to " + this.player.sMultiCockDesc() + " as if each of Roxanne's prostate-pounding bumps is injecting you with her lust. ");
            if (this.player.cockTotal() == 1) this.outputText("It bounces against your belly with your heartbeats, loving the forced anal pressure. ");
            else this.outputText("They bounce against your belly with your heartbeats, loving the anal pressure. ");
            this.outputText("Sticky droplets of pre-cum leak from you, and you can't stifle the pleasured gasps that burst from your maw.");
            if (this.player.hasVagina()) this.outputText(" To your delight and shame, your pussy is equally aroused by the action, musky and wet from the pirate's lewd anal battering.");
            this.outputText("\n\n");
        }
        // (JUST CUNTS:
        else if (this.player.hasVagina()) {
            this.outputText("The constant pressure of her thrusts seems to flow straight to your " + this.player.vaginaDescript() + ", inflaming your moistening labia. You can feel her mass compressing your feminine organs, rubbing your inner walls against each other. The sublime internal friction releases your natural lubricants, ");
            if (this.player.wetness() < 2) this.outputText("sliming your ready vulva.");
            else if (this.player.wetness() <= 3) this.outputText("soaking your ready vulva.");
            else if (this.player.wetness() <= 4) this.outputText("which drip from your ready vulva.");
            else this.outputText("which leak in a steady stream from your ready vulva.");
            this.outputText("\n\n");
        }

        if (this.player.tallness <= 50) this.outputText("Roxanne shifts forward, placing her tits around your head, letting the smooth scales of her mammoth breasts envelop you in their soft embrace.");
        else this.outputText("Roxanne shifts forward slightly, heaving the smooth scales of her mammoth breasts a little further up your back.");
        this.outputText(" She doubles her pace suddenly, balls slapping loudly into you while she moans and howls lustily. You feel the telltale bulging of an impending orgasm in your gut, and her balls drag up your " + this.player.skin.desc + ", preparing to disgorge their steamy cargo. The lizan grabs your hair and twists her fingers through it while she hilts you, screaming out her pleasure for all to hear.\n\n");

        this.outputText("Your insides froth and churn while they're filled with pent-up lizan cum. The shemale's balls bounce against you, violently relaxing and contracting in time with the bursts of cream filling your intestines. Wetness fills you completely, but the spurts go on relentlessly. Suddenly, small squirts of hot cum escape your tender " + this.player.assholeDescript() + ", running down Roxanne's still-pulsing balls. The action smears the cummy lather everywhere, and while the discomfort of being so completely filled rises, the pleasure grows in equal measure until you're twitching and moaning with whorish delight.\n\n");

        this.outputText("Finishing her obscene orgasm, Roxanne sighs, depositing one last creamy dollop into your anal seed-lake. She coos in your ear, \"<i>That was nice... I can see you shaking. Did you enjoy being a loser that much?</i>\" You nod meekly, blubbering out your embarrassed agreement. \"<i>How pathetic. You'll probably be back here tomorrow to lose again, won't you? Such a shameful butt-slut.</i>\"\n\n");

        this.outputText("Roxanne tugs back, but even with the pressure of her reproductive leavings inside you, you keep her pinned inside your depths, squeezing and writhing on her shaft. She tugs harder and harder, muscles going taut under her shiny purple scales until, with a violent 'POP', she slides free. You climax in that moment, getting off while a river of cum pours from your gaping asshole. Crying and moaning, you tremble while your beer-stained lips drool in bliss.");
        if (this.player.hasCock()) {
            this.outputText(" ");
            if (this.player.cumQ() >= 1500) {
                this.outputText("A torrential outpouring of spunk pours from " + this.player.sMultiCockDesc() + ", leaking in a steady, submissive flow to grow a ");
                if (this.player.cumQ() <= 2500) this.outputText("puddle");
                else this.outputText("lake");
                this.outputText("below the table.");
            }
            else this.outputText("An outpouring of spunk drools from " + this.player.sMultiCockDesc() + ", spurting submissively under the table.");
        }
        if (this.player.biggestLactation() >= 2) this.outputText(" Bursts of milk erupt from your pinned " + this.player.nippleDescript(0) + "s, blasting out while you cum to stain the table white.");
        this.outputText(" As it winds down, you fall into slumber, snoring happily after your violation.\n\n");

        this.outputText("<b>LATER...</b>\n");
        this.outputText("You wake in the lizan's bed<b> with a nasty hangover</b>, her arm curled around your gurgling belly. From how sore your rear feels, she kept 'winning' at least two or three more times. Your head is pounding, your " + this.player.legs() + " are weak, and you dribble cum with every movement. It takes some doing to extricate yourself from Roxanne's slumbering form, but you find your equipment and leave, hanging your head in shame under the leering eyes of the caravan-goers.");
        // (-100 lust, -1 int, hangover effect)
        this.player.orgasm('Anal');
        this.dynStats("int", -1);
        this.applyHangover();
        this.resetRoxanneSexTimeCounter();
        this.doNext(this.camp.returnToCampUseFourHours);
    }

    // [Roxanne HAS A FUCKING TORPEDO DICK BUTTFUCK]
    private roxanneFucksYourAssOHGODITSHUGE(): void {
        this.spriteSelect(SpriteDb.s_poisontail);
        this.clearOutput();
        this.outputText("Gosh, Roxanne is so strong... she's such a good friend to help you into her wagon, even while she has to drag the weight of her huge prick. The lizan spins you in her arms and kisses you full on the face, her massive tongue battering through your lips to explore the recesses of your still-slack mouth. A moment later, your sluggish reflexes catch up to the kiss, and you lick and suck at her tongue, clinging to the ");
        if (this.player.tallness >= 80) this.outputText("small ");
        else if (this.player.tallness < 50) this.outputText("large ");
        this.outputText("shemale for support. The room sways under you while you struggle to remain upright, tonguing the sweet lizan 'lady' with as much coordination as you can muster. She laughs and pushes back onto her bed, giggling when you fall onto the mattress with all the grace of a three-legged dog.\n\n");

        this.outputText("\"<i>Ohhh, I've waited for this for so long " + this.player.short + ". You have no idea of the need... it just builds and builds, getting bigger and bigger until every step is a cacophony of pleasure that never ends. I'm never sated... never rested... I can't even please myself. I just have to let it grow... and grow until I can find a drunk " + this.player.mf("boy", "slut") + " like you to slake my need and give me reprieve from the curse,</i>\" explains Roxanne as she shreds her own clothes in a frenzy. Her lithe, scaly body glitters in the candle-light, the pendulous swell of her breasts nearly threatening to pull your eyes from the blood-engorged beast between her thighs. Lashing from side to side while she advances, the lizan's tail betrays the rampant emotions surging through her.\n\n");

        this.outputText("The nude newhalf pounces, her thigh-sized monster-cock gushing pre-cum over your belly and twitching in anticipation of the violation to come. Her need is so cute... endearing even, but it isn't until your gear is being removed that you remember Roxanne intends to hilt that thing inside you. Your eyes go wide, your mouth stammering and blubbering about how it will never fit. She places a scaled finger on your boozy lips and whispers, \"<i>Shhhh, don't struggle. You knew what you were getting into, " + this.player.mf("my dear", "sexy girl") + ". You wouldn't welch out on a wager, would you? Besides, it's much too late for you to do anything... my nude, drunken cock-holster.</i>\"\n\n");

        this.outputText("Oh gods, Roxanne's right. She finished getting you naked while she was talking, and you're completely exposed. Her hands grab your arm and pull, rolling you onto your front and letting your " + this.player.legs() + " hang off the side of her bed toward the floor. It's such a silly pose that you nearly forget how perfect a target it makes your " + this.player.buttDescript() + "! The now-confident lizan gives your butt-cheek a slap, giggling when you start in surprise. ");
        if (this.player.tail.type > Tail.NONE) this.outputText("She lifts your tail ");
        else this.outputText("She spreads your cheeks ");
        this.outputText("to examine your " + this.player.assholeDescript() + ", licking the ring before she prods it with a gentle finger-tip. The excited pirate exclaims, \"<i>");
        if (this.player.analCapacity() < 150) this.outputText("Oh, poor " + this.player.mf("boy", "girl") + "! I don't think you can handle me like this. Let me get the ointment... after all, I want you to come back for more.");
        else this.outputText("Oh, wow! It's so... stretchy. Mmmm, I won't even have to use the ointment with you. You're probably used to this kind of thing, aren't you?");
        this.outputText("</i>\"\n\n");

        if (this.player.analCapacity() < 150) this.outputText("Cold slime is rubbed around your pucker, making you shiver before a nozzle is forced completely into the anal ring. Roxanne squeezes, applying a generous coating of the stuff to your internals before she pulls it out and smiles. \"<i>That should make it nice and stretchy. I don't know what I would've done if I hadn't met those goblins!</i>\" exclaims the eager shemale.");
        else this.outputText("You shiver as she runs her fingers and tongue around the ring of your pucker, pulling and stretching on it to make completely sure it'll be able to handle the huge injection she plans to push in. \"<i>Yeah, you're ready - it's already trying to milk my fingers. I can't wait to feel what it does to my cock!</i>\" exclaims the eager shemale.");
        this.outputText(" You look back over your shoulder, pouting out your lip while you feel the warm dick rubbing up your taint to its target. Roxanne squeezes your cheek affectionately and hums with pleasure when she finally lines the tip up with the sloppy hole, but she savors the moment, holding back while she leers at your trembling body.\n\n");

        this.outputText("Suddenly, all traces of her hesitation or restraint evaporate; the lizan pushes forwards, burying the first few inches of her massive cock-head into your clutching, gaped backdoor. ");
        if (this.player.analCapacity() < 150) this.outputText("Thanks to the ointment, there's little discomfort from the gut-distending penetration.");
        else this.outputText("Thanks to your experience with that hole, there's little discomfort from the gut-distending penetration.");
        this.outputText(" She's so big... unnaturally big. Roxanne's cock feels so huge that your drunken mind reels as it tries to process the sheer size, comparing it to everything from clubs to tree-trunks. The lizan sighs with something approaching relief after her head is inside you, squeezed tightly by your anal ring. She doesn't rest there, and pushes forward again to force your ");
        if (this.player.analCapacity() >= 150) this.outputText("spit");
        else this.outputText("ointment");
        this.outputText("-slicked ass to accept ever-greater quantities of cock. Sharp fingernails drag over your " + this.player.hipDescript());
        if (this.player.hasPlainSkin()) this.outputText(", leaving red lines in your unblemished skin");
        this.outputText(" while your hips visibly spread, somehow accepting something a normal human body never could.");
        this.player.buttChange(Math.floor(30 + (this.flags[kFLAGS.ROXANNE_TIME_WITHOUT_SEX] / 4)), true, true, false);
        this.outputText("\n\n");

        this.outputText("Roxanne stops and pants lustily, her two-foot prehensile tongue hanging into her cavernous cleavage while she strokes the exposed half of her member. She traces one of her fingers over the swell of your left cheek, letting her nail leave behind ");
        if (this.player.hasScales()) this.outputText("a roughly-scratched 'X' on your scales");
        else this.outputText("an irritated, red 'X' on your skin");
        this.outputText(". You whimper from the pain and the awkward fullness, but she asks, \"<i>Should we get that tattooed on there? A nice red 'X' to claim Roxanne Poisontail's favorite treasure... wouldn't that be nice?</i>\" A submissive mewl escapes your lips while you try to focus on her words, but the alcohol and complete body distention keep your frazzled consciousness from digesting anything but more cock.\n\n");

        this.outputText("The pressure inside you kicks up a notch once the penetration resumes, sending fireworks of pleasure and pain into your dazed cerebrum. You cross your eyes, puling and crying while your organs shift to accommodate the bulge that's pushed up past your belly button. Hands caress your belly, squeezing the mass through your " + this.player.skin.desc + ", your dazed subconscious taking control to try and cope with the complete reaming of your ass. Roxanne smirks and looks down, her reptilian gaze wavering between a veneer of complete confidence and lust-mad fire. Huge globules of pre-cum bubble out every few seconds, soaking your stretched-out innards moments before they're filled with the lizan's encroaching cock.\n\n");

        this.outputText("You breathe in shallow breaths, trying to see just how much more remains; thankfully it looks like there's only a few more inches left to sink up your butt-hole. Roxanne rubs her palms against the small of your back, pushing hard enough to squish you into the cushions and tighten your prick-packed body around her needy, pulsing shaft. At last she bottoms out, her heavy, swollen testes bouncing against your ");
        if (this.player.balls > 0) this.outputText("own");
        else if (this.player.hasVagina()) this.outputText(this.player.vaginaDescript());
        else this.outputText("now-narrow taint");
        this.outputText(", churning and swelling with the heavy load they're ready to disgorge.\n\n");

        this.outputText("\"<i>Oooh... ohh... so good... I don't think that stretched-out rat would feel this good anyhow,</i>\" comments Roxanne, slapping your ass-cheeks back and forth while she remains fully inserted, enjoying the inadvertent cock-massage your wriggling, dick-distorted body dispenses. She moans and pants, \"<i>I-uh... I think I'm gonna... cum soon. So tight... by the sea-god, I love your ass!</i>\" Her hands grab you and squeeze while her balls draw tight up against the base of the pirate's bloated dick.\n\n");

        this.outputText("\"<i>I'm cuuuuUUUUUMMMMMMIIIIIIIING!</i>\" she wails with banshee-like volume, nearly giving you a headache from her screeching pleasure. Her base bloats, forcing your violated backside ever-wider as her massive cum-vein engorges with seed. You writhe on the end of the heavy cock-spear while your intestines fill with a week's worth of seedy, cursed payload, rumbling and sloshing while they're packed. It's too much for your fragile psyche to bear, and the complete violation of your inebriated, lusty form sets off a body-wrenching orgasm. Your eyes cross, then roll back as your body spasms around the lizan's spit-roasting shaft. The pleasure cascades through you, washing away the discomfort and pain of the act throughout your orgasm, and before you can come back down, you slip into unconsciousness");
        if (this.player.hasCock() && this.player.cumQ() >= 1000) this.outputText(", drooling spit into the huge puddle of cum you made on her bed");
        else if (this.player.hasVagina() && this.player.wetness() >= 4) this.outputText(", drooling spit into the sloppy puddy of fem-cum you splattered on the mattress");
        this.outputText(".");
        this.outputText(" <b>You'll wake and head back to camp with a massive hangover.</b>");
        // (-100 lust, -1 int, hangover effect)
        this.player.orgasm('Anal');
        this.dynStats("int", -1);
        this.applyHangover();
        this.resetRoxanneSexTimeCounter();
        this.doNext(this.camp.returnToCampUseFourHours);
    }

    private applyHangover(): void {
        // Status: Hangover.
        // v1 = hours left.
        // v2 = strength taken
        // v3 = speed taken
        // v4 = intelligence

        // Already hungover?  Reset duration.
        if (this.player.hasStatusEffect(StatusEffects.Hangover)) this.player.changeStatusValue(StatusEffects.Hangover, 1, 8);
        // No hangover yet?  Create and yoink stats
        else {
            this.player.createStatusEffect(StatusEffects.Hangover, 8, 0, 0, 0);
            // Strength minus 5
            this.temp = 5;
            while (this.temp > 0) {
                this.temp--;
                // If PC has strength to lose
                if (this.player.str >= 2) {
                    this.mainView.statsView.showStatDown('str');
                    // strDown.visible = true;
                    // strUp.visible = false;
                    this.player.str--;
                    this.player.addStatusValue(StatusEffects.Hangover, 2, 1);
                }
            }
            // speed minus 10
            this.temp = 10;
            while (this.temp > 0) {
                this.temp--;
                // If PC has speed to lose
                if (this.player.spe >= 2) {
                    this.mainView.statsView.showStatDown('spe');
                    // speDown.visible = true;
                    // speUp.visible = false;
                    this.player.spe--;
                    this.player.addStatusValue(StatusEffects.Hangover, 3, 1);
                }
            }
            // int minus 15
            this.temp = 15;
            while (this.temp > 0) {
                this.temp--;
                // If PC has intelligence to lose
                if (this.player.inte >= 2) {
                    this.mainView.statsView.showStatDown('inte');
                    // inteDown.visible = true;
                    // inteUp.visible = false;
                    this.player.inte--;
                    this.player.addStatusValue(StatusEffects.Hangover, 4, 1);
                }
            }
        }
        this.statScreenRefresh();
    }

    // PC has a big butt and loses to normal Roxanne
    private bigBootyRoxanneContestLoss(): void {
        this.spriteSelect(SpriteDb.s_poisontail);
        this.clearOutput();
        this.outputText("Gods, your head is swimming! The room is pitching from side to side, and you " + this.player.mf("chuckle", "giggle") + " as you idly wonder if this is what it would be like aboard Roxanne's ship. Still, the well-endowed shemale doesn't seem to mind your tipsy bumbling in the slightest. She hooks her hands under your [butt] and squeezes the spacious ass-flesh appreciatively, then growls, \"<i>Such a nice, round ass; perfect for stuffing with cock! You're wasted as a champion. You'd make a better cabin-" + this.player.mf("boy", "girl") + ",</i>\" into your ear as she drags you towards her wagon.");
        this.outputText("\n\nWooden planks rattle as you're pushed against the door, your cushiony cheeks smushing out to the sides to stretch your [armor]. The busty victor nuzzles your neck, leaving lewd, drunken licks all the way up to your chin. Her moist sighs wash over you as she begins to pant faster and faster, her quickening arousal all but stealing the breath from both of your mouths. Squishing up against your thigh, the lizard's semi-flaccid member is slowly filling, growing harder and harder as it floods with burgeoning passion. At some point it escaped the pirate's imprisoning leather pants, and you drunkenly look down at it.");
        this.outputText("\n\nReflexively, Roxanne's penis grows once you look down at it, gaining four or five inches in seconds. It pauses for the split-second before its owner's next heartbeat, and then it expands again. This time, it lurches upward, the sensitive glans bouncing off your [hips] before coming to rest against your belly. The inflating cockflesh slides up to your [chest], leaving a trail of glistening pre-cum as it goes. Roxanne coos, \"<i>Oooh, let's get you inside before we make too much of a scene!</i>\"");
        this.outputText("\n\nThe next moment, you're stumbling inside, manhandled up against a bed before being forcefully bent over it. Groaning, you drunkenly hug one of the pillows as you settle into the odd posture. Shit; you're gonna get fucked, aren't you? You try to get up, but the room spins, and pieces of your [armor] are disappearing with alarming rapidity. Crack! A hand smacks across your [butt] hard enough to make your [hips] sway and set your copious flesh jiggling!");
        this.outputText("\n\n\"<i>Such a big, beautiful butt you've got here,</i>\" Roxanne mumbles, squeezing one of the cheeks, her fingers disappearing into the mound of flesh. \"<i>I can't get enough of thick, cock-craving sluts like you.</i>\"");
        this.outputText("\n\nThe intoxicated shemale massages your derriere passionately as she works her pants zipper open. Her heavy, cum-filled balls pop out, swinging freely. Moments later, Roxanne's leather trousers are kicked away, and her jacket joins them. She exhales in relief and takes the opportunity to get a feel for your [butt], kneading the generous flesh in lustful appreciation while her cock grows and sways dangerously above. Drops of hot lizard-pre splash onto your back - Roxanne's excitement distilled into pure, liquid form. You moan and relax under your more sober compatriot's ministrations. It feels goooood, so good you forgot why you were trying to get up a moment ago. You let yourself sink into the mattress, your muscles going slack, your body open and utterly exposed to her powerful fuckmeat.");
        this.outputText("\n\nDrops of liquid lizan love spatter across your asscheeks when Roxanne pulls herself back, and she comments, \"<i>You've got a beautiful ass, [name]. So thick, soft, and... shiny.</i>\" Narrow, reptilian fingers slide through your ass-cleavage, smearing the pirate's natural lubricants everywhere and circling your [asshole] with slow strokes. You clench at the first touch, an instinctive reaction to the probing, but the newhalf's insistent caresses slowly win your drunken, pleasure-hungry mind (and hole) over. \"<i>Atta " + this.player.mf("boy", "girl") + "!</i>\" the lizard exclaims encouragingly.");
        this.outputText("\n\nAfter all that alcohol, kissing, and sensuous groping, you feel eager and ready to go, suddenly hungry for the pending, plus-sized violation that your lizan lover has been saving up for you. You sigh into your pillow as Roxanne's bulbous cock-tip lines up with your [asshole], the muscles of your sphincter quivering in anticipation. Slurring drunkenly, you beg, \"<i>Put it... put it in already... I'm ssho fukkin' horny!</i>\"");
        this.outputText("\n\nRoxanne gleefully slaps your [butt] and counters, \"<i>I'm getting ready, ya greedy butt-slut!</i>\" She groans, and you feel some of her syrupy pre slipping through your well-lubed ring. Despite her words, she's ready to go and just as ready to blow. She edges her fluid-dribbling invader past your gate and suddenly thrusts, forcing you open and battering her way into your rectum with one hard push. As big as she is, only her tip and the first few inches get in, but you feel as if you're about to be split in half. The pulsating, fleshy spear twitches happily from the warmth of your innards and the squeezing of your big, rounded booty.");
        this.player.buttChange(Math.floor(30 + (this.flags[kFLAGS.ROXANNE_TIME_WITHOUT_SEX] / 4)), true, true, false);
        this.outputText("\n\n[if (hasCock = true) \"[EachCock] twitches, only half-hard and yet trembling from the light bumps your poor prostate receives. You moan and give a saucy wiggle as your ass caresses the bulbous invader, pulling it deeper to rub up against your anal G-spot. A tiny jet of pre squirts on the bed sheets, foreshadowing the fun to come.\"]");
        if (this.player.hasCock() && this.player.hasVagina()) this.outputText(" ");
        this.outputText("[if (hasVagina = true) \"Meanwhile, your [vagina] gets slicker and slicker, your lust permeating the air with potent female musk. Oh, if only Roxanne would fuck you there too!\"]");
        this.outputText(" Roxanne grunts, \"<i>That's a good girl...</i>");
        if (!this.player.hasVagina()) this.outputText(" \"<i>Oh, I know you don't have a pussy, but tonight, you're my big-bootied, cum-dumpster bitch!</i>\"");
        else this.outputText("\"<i>Oh, you'll make such a great anal cum-dumpster for me. Your poor pussy will be so cum-starved, but you'll be so stuffed with jizz that you'll look pregnant anyhow!</i>\"");
        this.outputText("\n\nYou whimper as Roxanne thrusts herself further forward, burying another few inches of potent lizard-cock inside you. Its sheer size shifts your innards slightly, and you're sure there must be a visible bulge on your tummy by now. The shemale sighs blissfully and continues to work her dick further and further inside you. Finally, when you feel you can fit no more, her large, quaking testes press against your rump. If you didn't have such a round ass, she'd probably still be trying to go further inside, but your plump derriere actually helps to distance her from your vulnerable pucker - by a bit.");
        this.outputText("\n\nSighing with relief, your body shudders softly as you adjust to the meat-spear inside you, slowly relaxing until your stretched butt-cunt more comfortably fills the role of Roxanne's fuck-toy. She exhales happily and places her smooth palms on your shoulders, gripping you firmly before she pushes again. You squeal in distress as at least another inch of the pirate's gigantic dong slides inside you, her hips and balls smushing your jiggly cheeks out to the side. Her sack must be painfully pressing into you by now, but Roxanne doesn't relent. She holds you there, forcing you to hold even more than before.");
        this.outputText("\n\nThe drunken, scaled dick-girl pulls most of the way out a few seconds later, teasing, \"<i>Feeling empty, dear? I'll fill you up, my cabin-" + this.player.mf("boy", "girl") + ",</i>\" before plunging back in. Roxanne's hips begin to pump your gaping asshole with practiced efficiency, every stroke smearing her rounded cock-tip [if (hasCock = true) \"across your pre-greased prostate. You cannot help but moan in forced bliss.\" else \"through every sensitive part of your body, hard enough to make you shiver from the onslaught of sensation.\"] Roxanne cries out ecstatically and shoots large globules of fluid into your rectum. Muffled, wet squishes and audible liquid churning can be heard from your guts, but you're pretty certain it's still only pre-cum.");
        this.outputText("\n\nYou're openly moaning and gasping, your face pressed into the mattress by the hard-fucking lizan. She pounds you faster and faster, breathily exulting in the pleasure each time she bottoms out against your gigantic backside. You can't help but clench and squeeze either - your body is being battered relentlessly. Your sphincter convulses around the thick cock, and when you can't take any more, you cum, babbling drunkenly and submissively.");
        this.outputText("\n\nRoxanne moans, \"<i>Here... it... coooomes!</i>\" and thrusts herself into you hilt-deep and hard enough for her balls to leave a mark on your cushiony butt. Eruptions of gooey spunk go off inside you, slowly enlarging the visible bulge in your belly from tip to base, culminating in a spray of spooge from around the edges of Roxanne's still-squirting cock. Jizz drips down your [legs], pooling on the ground. At the same time, your bloated belly is starting to look fairly pregnant. It slowly balloons out, leaving your poor tummy totally, utterly filled. You get so used to the sensation that when Roxanne finally slows, you're roused from your post-orgasmic haze[if (hasCock = true) \", dimly aware of the mess you've made of Roxanne's bedsheets\"]. [if (cumQuantity >= 1000) \"Her bed is utterly drenched, with huge spooge-bubbles dribbling down in thick rivers to puddle on the wet floorboards. Oops. \"]Roxanne pulls out unceremoniously, releasing a torrent of white from your abused back-door.");
        this.outputText("\n\nYour strength is gone, either from booze, or the incredible reaming and creaming you just took. In any case, you slump over into the mess[if (hasCock = true) , falling asleep in your own spooge].");
        this.outputText("\n\n<b>LATER...</b>\n");
        this.outputText("You wake in the lizan's bed, her arm curled around your gurgling belly. From how sore your rear feels, she probably kept 'winning' at least two or three more times. Your head is pounding, your " + this.player.legs() + " are weak, and you dribble cum from your ass with every movement. It takes some doing to extricate yourself from Roxanne's slumbering form, but you find your equipment and leave, hanging your head in shame under the leering eyes of the caravan-goers.");
        // (-100 lust, -1 int, hangover effect)
        this.player.orgasm('Anal');
        this.dynStats("int", -1);
        this.applyHangover();
        this.resetRoxanneSexTimeCounter();
        this.doNext(this.camp.returnToCampUseFourHours);
    }

    private resetRoxanneSexTimeCounter(): void {
        this.flags[kFLAGS.ROXANNE_TIME_WITHOUT_SEX] = 1;
    }
}
