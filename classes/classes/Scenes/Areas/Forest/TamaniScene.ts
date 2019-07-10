import { BaseContent } from "../../../BaseContent";
import { TimeAwareInterface } from "../../../TimeAwareInterface";
import { Encounter } from "../../API/Encounter";
import { PregnancyStore } from "../../../PregnancyStore";
import { TamainsDaughtersScene } from "./TamainsDaughtersScene";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { CoC } from "../../../CoC";
import { rand } from "../../../Extra";
import { SpriteDb } from "../../../display/SpriteDb";
import { Tamani } from "./Tamani";
import { PerkLib } from "../../../PerkLib";
import { CockTypesEnum } from "../../../CockTypesEnum";
import { Appearance } from "../../../Appearance";
import { ItemType } from "../../../ItemType";

export class TamaniScene extends BaseContent implements TimeAwareInterface, Encounter {

    // const TIMES_OVIPOSITED_TAMANI: number = 581;
    // const TAMANI_TIME_OUT: number = 580;

    /*NOTES:
    Tamani encountered if you have a dick, short alternate female scene available.
    Variables:
        -\"Tamani\"
        --v1 stores pregnancy incubation in v1,
        --v2 - total number of daughters,
        --v3 - number of offspring to be born v3,
        --v4 - number of times pregnant
        -\"Tamani's Brood\" - stores number of losses in v1.
    Males: anyNote – Tamani becomes increasingly familiar with the player as time passes, perhaps even affectionate, but will still fight to rape them if necessary.
        -Tamani attacks like regular goblins, but is much tougher and has more attacks.
        -Tamani always gets pregnant from player if she gets enough cum in her womb.
            -Tamani will be pregnant for 10 days, then give birth.
            -Birth will not happen until the player encounters her to see it.
        -After first birth player may voluntarily sex up Tamani (and repreg her).  Note – Tamani's tits will grow each time.
        -After three births, the player has a chance of encountering her with her brood and getting gangbanged (or having a more difficult fight on his/her hands).
        -If the player loses to the 'brood', brood encounters become more frequent.
        -If the player lose 3 times, game over as breeding stud.
    */

    public pregnancy: PregnancyStore;
    public tamaniDaughtersScene: TamainsDaughtersScene = new TamainsDaughtersScene();

    public encounterChance(): number {
        return this.flags[kFLAGS.TAMANI_TIME_OUT] == 0
            && this.player.gender > 0
            && this.flags[kFLAGS.TAMANI_BAD_ENDED] == 0
            && (this.player.totalCocks() > 0
                || this.player.hasKeyItem("Deluxe Dildo") < 0) ? 1 : 0;
    }

    public encounterName(): string {
        return "tamani";
    }

    public execEncounter(): void {
        if (this.player.totalCocks() > 0 && this.flags[kFLAGS.TAMANI_DAUGHTER_PREGGO_COUNTDOWN] == 0 && this.flags[kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS] >= 24) {
            this.tamaniDaughtersScene.encounterTamanisDaughters();
        } else this.encounterTamani();
    }

    public constructor() {
        super();
        this.pregnancy = new PregnancyStore(kFLAGS.TAMANI_PREGNANCY_TYPE, kFLAGS.TAMANI_PREGNANCY_INCUBATION, 0, 0);
        this.pregnancy.addPregnancyEventSet(PregnancyStore.PREGNANCY_PLAYER, 96, 48);
        // Event: 0 (= not pregnant), 1,  2,  3 (< 48)
        CoC.timeAwareClassAdd(this);
    }

    // Implementation of TimeAwareInterface
    public timeChange(): boolean {
        this.pregnancy.pregnancyAdvance();
        // trace("\nTamani time change: Time is " + getGame().time.hours + ", incubation: " + pregnancy.incubation + ", event: " + pregnancy.event);
        if (this.pregnancy.isPregnant && this.pregnancy.incubation == 0) this.tamaniGivesBirth(); // Silently clear Tamani's pregnancy if the player doesn't encounter her in time
        return false;
    }

    public timeChangeLarge(): boolean {
        return false;
    }
    // End of Interface Implementation

    private tamaniGivesBirth(): void {
        if (this.pregnancy.type == PregnancyStore.PREGNANCY_PLAYER) { // Don't want drider eggs to add to her daughers
            this.flags[kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS] += this.flags[kFLAGS.TAMANI_PREGNANCY_COUNT];
            this.flags[kFLAGS.TAMANI_PREGNANCY_COUNT] = 0;
            this.flags[kFLAGS.TAMANI_TIMES_IMPREGNATED]++;
        }
        this.pregnancy.knockUpForce(); // Clear Pregnancy
    }

    public tamaniChest(): string {
        let descript: string = "";
        switch (this.flags[kFLAGS.TAMANI_TIMES_IMPREGNATED]) {
            case -1:
            case 0: descript = (rand(2) == 0 ? "ample " : "handful of "); break;
            case 1:
            case 2:
            case 3: descript = (rand(2) == 0 ? "large " : "jiggling "); break;
            case 4:
            case 5:
            case 6: descript = (rand(2) == 0 ? "wobbling " : "impressive "); break;
            case 7:
            case 8:
            case 9:
            case 10: descript = (rand(2) == 0 ? "over-proportioned " : "super-sized "); break;
            default: descript = (rand(2) == 0 ? "massive " : "gigantic "); break;
        }
        switch (rand(11)) {
            case 0:
            case 1:
            case 2: return descript + "tits";
            case 3: return descript + "melons";
            case 4: return descript + "mounds";
            case 5: return descript + "muffins";
            case 6: return descript + "knockers";
            case 7: return descript + "love-pillows";
            default:
        }
        return descript + "breasts";
    }

    // [Encounter Tamani – female]
    private tamaniFemaleEncounter(): void {
        this.spriteSelect(SpriteDb.s_tamani);
        this.clearOutput();
        this.outputText(this.images.showImage("tamani-encounter"));
        this.outputText("A goblin leaps out from behind a rock outcropping.  She keeps her arms folded across her " + this.tamaniChest() + " and glares at you.  The little thing is only about four feet tall, with pink and black dyed hair cut into a cute little 'do.  The greenish-gray skin of her breasts bulges out around her arms, supported by a few leather straps, amplifying her cleavage.  Her cunt lips are pierced multiple times, inflamed, and slightly parted.  There really isn't any clothing on her to hide them, just more of the ever-present straps wrapping around her thighs.\n\n");
        this.outputText("She says, \"<i>There's only so much cock around, and I got dibs on ALL of it, O.K. skank?</i>\"\n\n");
        // [Umm OK?] [No]
        this.menu();
        this.addButton(0, "Umm OK?", this.tamaniFemaleYes);
        this.addButton(1, "No", this.tamaniFemaleNo);
        this.addButton(2, "PreferGirls", this.preferTamaniFemdom);
    }

    // (Umm OK?)
    private tamaniFemaleYes(): void {
        this.spriteSelect(SpriteDb.s_tamani);
        this.clearOutput();
        this.outputText(this.images.showImage("tamani-dDildo"));
        this.outputText("\"<i>That's what I thought,</i>\" says the goblin as she fishes around in her pouches, \"<i>but I'm not cruel, I'll give you my best dildo so you can keep your hot little box stuffed all the time.</i>\"\n\n");
        this.outputText("She pulls out a long pink dick and tosses it to you.  You catch it and it flops around, nearly slapping you in the cheek.  ");
        if (this.player.cor < 50) this.outputText("Gross.\n\n");
        else this.outputText("Getting cock-slapped would've been kind of hot...\n\n");
        this.outputText("The goblin leaves you with a warning, \"<i>Be careful, it likes to leak aphrodisiacs like crazy.  Believe me, those are FUN to get addicted to.  Oh, and remember – Tamani owns all the cocks around here, so if you ever grow one, come pay your dues!</i>\"\n\n");
        this.doNext(this.tamaniFemaleItem);
    }
    private tamaniFemaleItem(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("item-dDildo"));
        this.outputText("(<b>Deluxe Dildo acquired!</b>)");
        this.player.createKeyItem("Deluxe Dildo", 0, 0, 0, 0);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [No]
    private tamaniFemaleNo(): void {
        this.spriteSelect(SpriteDb.s_tamani);
        this.clearOutput();
        this.outputText("The goblin harrumphs, \"<i>We'll see about that slut.  I'll be knocked up from every monster and stud this side of the mountain.  Hell, just grow one dick, and see how fast Tamani's legs get wrapped around you!</i>\"\n\n");
        this.outputText("She flounces off, clearly planning on fucking everything capable of producing sperm on her way home.  ");
        if (this.player.cor < 33) this.outputText("What a slut.");
        else if (this.player.cor < 66) this.outputText("How odd.");
        else this.outputText("You hope she misses a few.");
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    // [Encounter Tamani – HAZ COCK]
    // [First Time]
    private tamaniMaleFirstEncounter(): void {
        this.spriteSelect(SpriteDb.s_tamani);
        this.flags[kFLAGS.TAMANI_MET] = 1; // Indicates you've met her as a male at least once
        this.clearOutput();
        this.outputText(this.images.showImage("tamani-encounter"));
        this.outputText("A goblin leaps out from behind a rock outcropping.  For something so small, she has a lot of curves.  She advances towards you, rolling her hips in a suggestive way, immediately diverting your blood-flow to your crotch.  The little thing is only about four feet tall, with pink and black dyed hair cut into a cute little 'do.  The greenish-gray skin of her breasts jiggles pleasantly with every step, supported by a few leather straps, amplifying her cleavage.  Her cunt lips are pierced multiple times, inflamed, and slightly parted.  There really isn't any clothing on her to hide them, just more of the ever-present straps wrapping around her thighs.\n\n");
        this.outputText("The goblin makes you an offer that's difficult to turn down, \"<i>Hey there stud, want to fuck me pregnant?  I promise my box will milk your dick dry.  Just let Tamani take care of all your boners OK?</i>\"");
        // [Fuck Her] [Refuse]
        this.menu();
        this.addButton(0, "Fuck Her", this.tamaniFirstTimeConsentual);
        this.addButton(1, "Refuse", this.tamaniFirstTimeRefusal);
    }
    // [Fuck Her – Consentual First Time]
    private tamaniFirstTimeConsentual(): void {
        this.spriteSelect(SpriteDb.s_tamani);
        this.tamaniKnockUp();
        this.clearOutput();
        this.outputText(this.images.showImage("tamani-fuck"));
        this.outputText("You almost can't believe your good fortune.  Finally you meet a creature willing to talk instead of just launching into violent rape.   Her direct advances were so crude and overtly sexual that you felt yourself stiffening before she could even finish her offer.   Your decision was made by the tent in your " + this.player.armorName + ".  You'll give Tamani exactly what you both want.\n\n");
        this.outputText("Her hips sway seductively as she approaches with her right hand dipping into the moist honeypot of her sex.  You disrobe, throwing your " + this.player.armorName + " to the side before you reach down and lift her up, pressing her curvy body against your ");
        if (this.player.biggestTitSize() > 1) this.outputText(this.player.allBreastsDescript());
        else this.outputText("chest");
        this.outputText(".  She wraps her tiny arms around your neck and kisses you passionately, letting her tongue slither through your lips.   The two of you french kiss hard, virtually tongue-fucking each other.\n\n");
        this.outputText("She breaks the kiss and smiles, licking the shining purple lipstick she wears as she whispers in your ear, \"<i>Mmmhmm, I knew your juicy cock just couldn't resist a wet and ready pussy like mine.  I made sure to lace my lipstick with fertility enhancing chemicals too, so we'll be nice and messy.</i>\"\n\n");
        this.outputText("As if to emphasize her point, she curls her toes around your " + this.player.cockDescript(0) + ", squeezing as she slides her feet up and down your length, milking out a few large drops of pre-cum.  You groan and kiss her again – too turned on to care if the drug-laced lipstick turns your orgasm into a pregnancy-inducing flood. ");
        if (this.player.balls > 0) this.outputText("Your " + this.player.ballsDescriptLight() + " swell with seed, spurring your desire to new heights.");
        else this.outputText("Something inside you swells up with seed, spurring your desire to new heights.");
        this.outputText("  You NEED to fuck her pussy full – NOW.\n\n");
        // (FITS)
        if (this.player.cockArea(0) <= 90) {
            this.outputText("Tamani breaks the kiss and gives you a coy smile as she shimmies down your body, dropping her moist cunt onto your " + this.player.cockDescript(0) + "'s " + this.player.cockHead() + ".  She swings her hips in a little circle, teasing you with her moist entrance as your drug-enhanced pre-cum bubbles and drools around her lips, mixing with her own copious fluids as it flows down your length");
            if (this.player.balls > 0) this.outputText(" and drips from your " + this.player.ballsDescriptLight());
            this.outputText(".  She stops and teases, \"<i>Ready to stuff me full of your cream?  I just KNOW I'll get pregnant from such a purrfect mate.</i>\"\n\n");
            this.outputText("Tamani doesn't wait for an answer – she pauses until you're about to reply, then drops her weight down, fully impaling herself and turning the beginnings of your reply into a babbled moan.  She plants her feet on your thighs and her arms around your back and begins bouncing up and down rapidly, squeezing and contracting, milking your " + this.player.cockDescript(0) + " in her tight wet walls the entire time. Your inner abdominal muscles begin clenching and squeezing, sending a wave of heat through your groin as your baby-batter begins its journey towards the goblin's womb.\n\n");
            this.outputText("You grab her with both hands and slam her down, taking her to the hilt");
            if (this.player.cockArea(0) > 30) this.outputText(" and watching her belly bulge from your size");
            this.outputText(".  She twists violently, practically thrashing in your arms as spunk begins pouring into her womb, making her belly start to bloat.  The goblin babbles incoherently with each blast of cum, stretching tighter and tighter around you as her pussy works to hold in every drop of spunk.  Her belly bloats a bit more, until the pressure is too much to bear and jism begins spurting around her opening, splattering into a puddle on the ground.\n\n");
            this.outputText("All good things eventually end, and with a sigh you pull the insensate goblin slut free of your " + this.player.cockDescript(0) + ", watching a river of whiteness drain from between her thighs.  You set her down and the escaping jism suddenly stops, the remainder held inside by some kind of reflex.  Tamani giggles and pats her still pregnant-looking belly, \"<i>Wasn't the sample nice?  Come see me when your dick has had a chance to recover and we can do this again, and again, and again.  You're practically hooked already aren't you " + this.player.mf("stud", "hun") + "?</i>\"\n\n");
            this.outputText("It takes a moment to put your " + this.player.armorName + " back on and make ready to leave, but somehow you know this isn't the last you've seen of this goblin.");
            // [CORRUPT]
            if (this.player.cor > 66) this.outputText("  Your " + this.player.cockDescript(0) + " twitches at the thought, ready and wanting more.");
        }
        // (TOO BIG)
        else {
            this.outputText("Tamani breaks your sloppy kiss and shimmies down your body, clutching tightly to your " + this.player.cockDescript(0) + " and " + this.player.skin.desc + " as she settles down lower on your groin.  The goblin somehow manages to turn herself around so that is she is hanging upside-down, with her legs and arms clutching tightly to your member while her tongue ");
            if (this.player.hasSheath()) {
                this.outputText("licks the edges of your sheath");
                if (this.player.balls > 0) this.outputText(" and balls");
            }
            else {
                if (this.player.balls > 0) this.outputText("licks all over your balls");
                else if (this.player.hasVagina()) this.outputText("sneaks between your folds to tease your now-hardening clit");
                else this.outputText("licks the sensitive " + this.player.skin.tone + " " + this.player.skin.desc + " of your inner thighs");
            }
            this.outputText("\n\n");
            this.outputText("Her cunt grinds on your crown, smearing it with a mixture of the drooling cunt-lubricant and your own drizzles of pre-cum.  As your dick becomes slick and wet, the feeling of her arms and legs wrapped around you feels better and better.   She even squeezes her arms tight around you like a cock-ring, making your dick pulse and swell with blood for a few seconds before she releases.  Your inner abdominal muscles begin clenching and squeezing, sending a wave of heat through your groin as your baby-batter begins its journey to freedom.\n\n");
            this.outputText("She feels it pass between the fingers she has pressing on her vulva, and with surprising athleticism, the goblin pushes herself up, landing the wet gash of her cunt directly on top of your over-sized urethra.  You groan as the first wad blasts free of your body, filling her rather adaptable love-canal with thick spoo.  A few sprays of spunk squirt out to the sides around the edge of the imperfect seal, while her hands work from the bottom to the top of your " + this.player.cockDescript(0) + " trying to squeeze out even more.\n\n");
            this.outputText("Tamani's body starts to distend as you pack more and more spunk into her hungry womb.  Her belly bloats out as more and more jizz escapes around her wet lips, unable to fill her any further.  The goblin rocks from the force of your eruptions before falling off and landing flat on her back.  Still, your body keeps pumping out more");
            if (this.player.balls > 0 && this.player.hoursSinceCum > 200) this.outputText(", visibly draining your " + this.player.ballsDescriptLight() + " down to their normal size");
            this.outputText(" as Tamani does her best to catch it in her mouth and soaked cunt.\n\n");
            this.outputText("You shake the last few drops of spoo free, letting them drip into her hair as you finish.  You look down at the satisfied goblin girl as she says, \"<i>Wasn't my free sample nice?  Come see me when your dick has had a chance to recover and we can do this again, and again, and again.  You're practically hooked already aren't you " + this.player.mf("stud", "hun") + "?</i>\"\n\n");
            this.outputText("It takes a moment to put your " + this.player.armorName + " back on and make ready to leave, but somehow you know this isn't the last you've seen of this goblin.");
            // ([CORRUPT]
            if (this.player.cor > 66) this.outputText("  Your " + this.player.cockDescript(0) + " twitches at the thought, ready and wanting more.");
        }
        this.player.orgasm('Dick');
        this.dynStats("lib", .5, "sen", -1, "cor", .5);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [Refuse – First Time Meeting]
    private tamaniFirstTimeRefusal(): void {
        this.spriteSelect(SpriteDb.s_tamani);
        this.clearOutput();
        this.outputText("Tamani's eyes widen in surprise, \"<i>Don't let the size fool you, big " + this.player.mf("boy", "girl") + ". I can take more than you think,</i>\" she says while her hands begins playing with her box, \"<i>Are you sure you don't want to just let off a little steam?</i>\"\n\n");
        // [Fuck Her (Goes to fuck her - consensual first time)]
        // [No means no]
        this.menu();
        this.addButton(0, "Fuck Her", this.tamaniFirstTimeConsentual);
        this.addButton(1, "No", this.tamaniSecondRefusal);
        this.dynStats("lus", 5);
    }
    // [No Means No]
    private tamaniSecondRefusal(): void {
        this.spriteSelect(SpriteDb.s_tamani);
        this.clearOutput();
        this.outputText("The goblin pouts, anger clouding her cute little features.  She turns and storms off, clearly pissed at you, \"<i>Think about it.  Next time that dick better ache for me, or I'll MAKE you want it.</i>\"\n\n");
        this.outputText("...What?");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [REPEAT MALE ENCOUNTER]
    private tamaniMaleRepeatEncounter(): void {
        this.spriteSelect(SpriteDb.s_tamani);
        this.clearOutput();
        this.outputText(this.images.showImage("tamani-encounter"));
        // (IF FUCKED - check to see if she's pregnant or has given birth)
        if (this.pregnancy.isPregnant || this.flags[kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS] > 0) this.outputText("While exploring, you're startled by the feeling of tiny hands stroking the insides of your thighs.  You look down and find Tamani there, grinning wolfishly,  \"<i>Ready for another fuck, big " + this.player.mf("boy", "girl") + "?</i>\"\n\n");
        // (ELSE)
        else this.outputText("While exploring, you're startled by the feeling of tiny hands stroking the insides of your thighs.  You look down and find Tamani the goblin there, grinning with desire, \"<i>Ready to stuff me with cum?  I'm not taking no for an answer this time.</i>\"\n\n");
        if (this.flags[kFLAGS.TAMANI_TIMES_HYPNOTISED] > 19 && rand(2) == 0) {
            this.getRapedByTamaniYouHypnoSlut();
            return;
        }
        // (+1 lust per 10 sensitivity)
        this.dynStats("lus", this.player.sens / 10);
        // [Take Her – win sex]
        // [Let Her – Get dommed]
        // [No – starts fight]
        this.menu();
        this.addButton(0, "Take Her", this.tamaniSexWon);
        this.addButton(1, "Let Her", this.tamaniSexLetHer);
        this.addButton(2, "No", this.tamaniStartFight);
    }

    private tamaniStartFight(): void {
        this.clearOutput();
        this.outputText("Tamani adopts a fighting pose and says, \"<i>If I have to I'll beat my children out of you!</i>\"");
        this.startCombat(new Tamani());
    }

    // [Let Her (Or Combat Rape)]
    // [let her]
    public tamaniSexLetHer(): void {
        this.spriteSelect(SpriteDb.s_tamani);
        this.tamaniKnockUp();
        this.clearOutput();
        this.outputText(this.images.showImage("tamani-letHer-fuck"));
        // [lost combat]
        if (this.getGame().inCombat) {
            // Taurs
            if (this.player.isTaur()) {
                if (this.player.HP < 1) this.outputText("You stumble, legs weaving drunkenly as you try to keep your feet.  ");
                else this.outputText("You stumble, legs weaving drunkenly as " + this.player.sMultiCockDesc() + " ache and drool with need.  ");
                this.outputText("Tamani sidles up to you and pats your flank, cooing, \"<i>There there horsey, everything's going to be okay.  Momma Tamani's going to take really good care of you.</i>\"  Before you know it your " + this.player.armorName + " is on the ground and the goblin is underneath you, climbing up to your crotch.\n\n");
            }
            // Not taur
            else {
                if (this.player.HP < 1) this.outputText("You collapse, unable to fight back any longer.  For her part, Tamani seems disappointed with the outcome, but approaches your prone form in spite of your sorry appearance.");
                else this.outputText("You tear off your clothes in a frenzy of lust and stagger towards Tamani, openly fondling your groin.   She smirks and pushes you hard, throwing you off balance and onto your back.");
                this.outputText("  She wiggles her " + this.tamaniChest() + ", and despite your efforts to control your body, ");
                if (this.player.cockTotal() == 1) this.outputText("an erection emerges");
                else this.outputText("erections sprout up like weeds");
                this.outputText(".  She strips you down, giving you a smirk as she says, \"<i>Just lie there and I'll take what I need, babe.</i>\"\n\n");
            }
        }
        // Voluntary submission
        else {
            // Taur
            if (this.player.isTaur()) {
                this.outputText("You meekly undress and ask Tamani how she would like to take you today.  She titters and slowly walks around you, taking her time, taking in your formidable bestial body and your " + this.player.multiCockDescriptLight() + ". \"<i>All this, for little ol' me,</i>\" she breathes. She sounds more tantalized than daunted. \"<i>Stand still for me, horsie,</i>\" she commands. Unable to see her any more behind your flank, you do as she says. You feel a pair of tiny hands on your back thigh and then a small but dense weight climbing steadily towards your groin. You bite back laughter at the ticklish sensation.\n\n");
            }
            else {
                this.outputText("You meekly undress and ask Tamani how she would like to take you today.  She titters and gives your ");
                this.temp = rand(3);
                switch (this.temp) {
                    case 0:
                        this.outputText(this.player.cockDescript(0));
                        break;
                    case 1:
                        this.outputText("bellybutton");
                        break;
                    case 2:
                        this.outputText(this.player.nippleDescript(0));
                        break;
                    default:
                    // Shouldn't happen.
                }
                this.outputText(" a quick kiss before pushing hard against you, shoving you onto the ground and flashing a brilliant smile.\n\n");
                this.outputText("\"<i>Just lie there and take it " + this.player.mf("stud", "slut") + ",</i>\" she commands.\n\n");
            }
        }
        // Taur-zilla
        if (this.player.isTaur()) {
            this.outputText("Hidden entirely by your relatively vast form, you cannot see anything that Tamani is doing, only feel. Perhaps aware of this, Tamani seems determined to make sure that what you feel is a lot. A hand clutches onto your flank as you feel her lean into your groin and begin to slather every part of your " + this.player.cockDescript(0) + " that she can reach with saliva. The goblin lipstick has its traditional effect and before long your " + this.player.cockDescript(0) + " is straining, a hard trembling pleasure-center. You hear a teasing giggle from somewhere underneath you, and then you gasp as Tamani clambers onto your groin proper, hands clutching onto your tender underside, most of her weight supported by your bulging cock.\n\n");

            this.outputText("Such is your arousal you find you can support her easily, but the sensation makes you cringe, particularly as Tamani sets about her work in earnest. Hanging onto your stomach she slathers your head with attention, her tingling lips and wet tongue all over your tip until you can barely stand it, beading pre-cum into her hungry mouth.\n\n");

            // If <18 Inches
            if (this.player.cocks[0].cockLength <= 18) {
                this.outputText("Before you can get too far she stops and agonizingly shifts her attention; you feel her transfer her weight to her hands, and then the rough but soft bottoms of her feet work their way down to the other end of your " + this.player.cockDescript(0) + ", pressing against your inner thighs. The wet velvet sensation of her snatch envelopes your head and then slowly works its way down your shaft. Before she can bottom out, Tamani stops, teasingly and slowly withdraws until once again your head is pressed against her sopping entrance. She begins to work her thighs, smearing herself against the end of your straining cock with increasing urgency until she squeals in orgasm, slathering her juices onto your tip. Then, with a sigh and a snicker and again with agonising slowness, she works herself down onto your " + this.player.cockDescript(0) + ". ");
                // No balls:
                if (this.player.balls == 0) this.outputText("You find yourself wondering vaguely where a goblin learns these kinds of gymnastics.\n\n");
                else this.outputText("You find yourself wondering vaguely where a goblin learns these kinds of gymnastics, before the goblin in question drives all thoughts out of your head by mashing her soft soles into your " + this.player.ballsDescriptLight() + ".\n\n");

                this.outputText("Tamani has her way with you like this for what seems like hours, squealing as she gets off over and over until your underside is drenched in her juices, but drawing away every time you get close to your own release, playing you like the world's most sensitive fiddle until your human half is drenched with sweat. You stamp your back hooves in deep agitation and fill the forest with bellowing shouts. There is nothing you can do; attached securely to your nether regions as she is, you couldn't reach her or otherwise knock her off even if you wanted to. She is evidently enjoying every minute it, laughing cruelly every time she manages to draw a scream from you, spurring her on to invent some new way of agonizing your poor cock. There is something about this situation which is driving you wild; that you can't do anything about what a creature many times smaller than you is doing to you, and that you willingly allowed it to happen, is a shamefully powerful sensation.\n\n");
                this.outputText("\"<i>Go on then,</i>\" she breathes eventually. \"<i>I guess you've had enough. Cum for Mistress Tamani, " + this.player.mf("stud", "slut") + ". Fill me to the brim.</i>\" With this she finally works herself all the way to the bottom of your shaft, and with surprising strength grips your stomach and begins to pound her plump behind against your inner thighs with increasing force.\n\n");

                this.outputText("You need no further invitation, and with a ragged, blissful sigh you orgasm hard enough for stars to swim at the edge of your vision. Tamani holds onto you with all four of her limbs and milks you expertly as you spurt load after load into her hot, needy twat. She doesn't stop grinding you until you can feel spooge dripping out of her and hear it spatter lightly on the ground.\n\n");

                this.outputText("When you have finished, you feel an intense amount of relief as Tamani finally lets go of your underside and drops to the floor. She happily waddles around to face you, her cunt dripping with your seed. \"<i>Who knew that riding a horsie could be so much fun! We're going to have to do that again, stud. Next time I might make it a gallop instead of a canter. Won't that be nice? Until next time, big " + this.player.mf("boy", "girl") + ".</i>\" She swaggers off, leaving you to wonder if you'll ever be in a fit enough state to let her near your cock again, and where the nearest whereabouts of a gallon of water is.\n\n");
            }
            // If >18 Inches
            else {
                this.outputText("Before you can get too far she stops and agonizingly shifts her attention; you feel her rough but soft bottoms of her feet work their way down to the other end of your " + this.player.cockDescript(0) + ". Hanging onto the base of your member she begins to rub her plump, diminutive form along the bottom of it, her tits and thighs caressing your length. ");
                if (this.player.balls == 0) this.outputText("You find yourself wondering vaguely where a goblin learns these kinds of gymnastics.\n\n");
                else this.outputText("You find yourself wondering vaguely where a goblin learns these kinds of gymnastics, before the goblin in question drives all thoughts out of your head by beginning to mash her soft soles into your " + this.player.ballsDescriptLight() + ".\n\n");

                this.outputText("Tamani has her way with you like this for what seems like hours, crawling up and down your massive cock");
                if (this.player.balls > 0) this.outputText(" and " + this.player.ballsDescriptLight());
                this.outputText(", sucking, tonguing, fondling, and foot rubbing you with horrible accuracy, slapping against you and squealing as she gets off over and over until your underside is drenched in her juices, but drawing away every time you get close to your own release, playing you like the world's most sensitive fiddle until your human half is drenched with sweat. You stamp your back hooves in deep agitation and fill the forest with bellowing shouts. There is nothing you can do; attached securely to your nether regions as she is, you couldn't reach her or otherwise knock her off even if you wanted to. She is evidently enjoying every minute it, laughing cruelly every time she manages to draw a scream from you, spurring her on to invent some new way of agonizing your poor cock. There is something about this situation which is driving you wild; that you can't do anything about what a creature many times smaller than you is doing to you, and that you willingly allowed it to happen, is a shamefully powerful sensation.\n\n");

                this.outputText("\"<i>Go on then,</i>\" she breathes eventually. \"<i>I guess you've had enough. Cum for Mistress Tamani, " + this.player.mf("stud", "slut") + ". Cover me from head to toe.</i>\" As she says this, she walks her hands down your belly, positions herself directly over your head, uses her own lubrication to rub her feet furiously down your " + this.player.cockDescript(0) + " and then, with one last evil giggle, sticks her tongue directly into your urethra.\n\n");

                // Low cum:
                if (this.player.cumQ() < 1200) {
                    this.outputText("With a ragged sigh, you reach your peak. Your first blast of jizz goes straight into Tamani's mouth, but you feel the goblin nimbly and hastily changing her position so that the very tip of your " + this.player.cockDescript(0) + " can feel her moist snatch. Being teased for so long makes the sensation incredible, and it feels like entire minutes go by whilst you stand there, sweat dripping off you as you cum over and over again until your cock is doing nothing but flexing mindlessly.\n\n");

                    this.outputText("When you have finished, you feel an intense feeling of relief as Tamani finally lets go of your underside and drops to the floor. She happily paws off the jizz coating her face and attempts to stuff more into her dripping cunt as she waddles around to face you. \"<i>Who knew that riding a horsie could be so much fun! We're going to have to do that again, stud. Next time I might make it a gallop instead of a canter. Won't that be nice? Until next time, big " + this.player.mf("boy", "girl") + ".</i>\" She swaggers off, leaving you to wonder if you'll ever be in a fit enough state to let her near your cock again, and where the nearest whereabouts of a gallon of water is.\n\n");
                }
                // High cum:
                else {
                    this.outputText("With a bellowing roar, you cum with mind blowing force. Your churning balls blast out a river of gooey fluid, the first glorious arc of which flies straight past your human front and paints the tree in front of you. Totally insensate, you can do nothing for entire minutes but stand there and cum, over and over again, sweat dripping off your frame, until the entire area underneath you is covered with your spooge.\n\n");

                    this.outputText("When you finally come to your senses, you wearily but with intense satisfaction clop around to take in the lake of jizz you have created. ");
                    if (this.player.balls > 0) this.outputText("Your " + this.player.ballsDescriptLight() + " ache and you feel very thirsty indeed.");
                    else this.outputText("You feel very thirsty indeed.");
                    this.outputText(" It's only when you manage to drag your mind away from your own privations that you suddenly wonder where Tamani went. She isn't still attached to you, is she? It is then that a small lump in the center of the vast puddle in front of you stands up and begins to happily wipe herself down, taking care to stuff as much of the seed plastering her into herself as she can.\n\n");

                    this.outputText("\"<i>Wheeeeeeeee,</i>\" she says, with a grin which almost splits her face in half. \"<i>Who knew that riding a horsie could be so much fun! We're going to have to do that again, stud. Next time I might make it a gallop instead of a canter. Won't that be nice? Until next time, big  " + this.player.mf("boy", "girl") + ".</i>\" She swaggers off, leaving you to wonder if you'll ever be in a fit enough state to let her near your cock again, and where the nearest whereabouts of a gallon of water is.\n\n");
                }
            }
            this.outputText("After a little while you redress, but the scent of horny goblin stays with you for hours.");
            // Combat end:
            if (this.getGame().inCombat) {
                this.outputText("  After the stress and strain of a lost fight and the stress of having your seed so expertly stolen, you lie down on your flank and go to sleep.");
                this.combat.cleanupAfterCombat();
                this.player.orgasm('Dick');
            }
            // (Noncombat end:
            else {
                this.player.orgasm('Dick');
                this.dynStats("lus", +10);
                this.doNext(this.camp.returnToCampUseOneHour);
            }
        }
        // Not-taurs
        else {
            this.outputText("She gets down on all fours, crawling up your legs until her gloss-covered lips reach your " + this.player.multiCockDescriptLight() + ".   Warm wetness slides along your length as the gobbo-slut gets you slick and wet with her saliva.   It has quite the effect on you, turning your " + this.player.cockDescript(0) + " into a hard trembling pleasure-center.  You sigh, enjoying the attention but more than ready to release your pent-up sexual need into the willing girl.\n\n");
            // (fits)
            if (this.player.cockArea(0) <= 90) {
                this.outputText("Tamani turns about, dragging her wet gash across you and giving you a nice view of her plump butt-cheeks.  The soft skin of her palms squeezes around you as she lifts you up, positioning your " + this.player.cockDescript(0) + " against her womanhood.   She grinds against your " + this.player.cockHead() + ", her folds slowly parting to take you.  Slowly, inch after inch of dickflesh sinks into her amazingly elastic yet tight pussy.  ");
                if (this.player.cocks[0].cockLength >= 12) this.outputText("Her body visibly stretches around you, and you silently thank whatever gods or demons adapted goblins to be able to fulfill this role.  ");
                this.outputText("Moaning like a whore, she easily slips the rest of the way down, bottoming out her sopping-wet fuck-tunnel.\n\n");
                this.outputText("You gasp in pain and surprise as Tamani pinches and tugs ");
                if (this.player.totalNipples() == 2) this.outputText("both");
                else this.outputText("all");
                this.outputText(" of your " + this.player.nippleDescript(0) + "s.  She eases up her grip a bit when she sees how bad it hurts, but she does not release them.  The noisy squelching of her cunt fucking you draws your attention back to your groin.  Your body begins thrusting up to meet her, finally understanding it's on the receiving end of a passionate screw.  ");
                if (this.player.biggestTitSize() >= 2) this.outputText("Your " + this.player.allBreastsDescript() + " bounce and jiggle obscenely as the goblin twists and pulls, abusing your nipples.");
                else this.outputText("Your " + this.player.nippleDescript(0) + "s burn with pain as the goblin twists and pulls on them, abusing them.  Pleasure and pain mix together, overwhelming you, reducing your world to little more than the slap of genital against genital and the painful torture happening to your chest.\n\n");
                this.outputText("Tamani plays your body like a fiddle, keeping you near the edge as she noisily orgasms over your shaft again and again.  You can tell she's starting to tire, so she gives you a kind look and begins to pick up the tempo.   She whispers softly, \"<i>Go ahead, cream my honeypot until I can barely walk.</i>\"\n\n");
                this.outputText("That's all the encouragement you need.  ");
                if (this.player.balls > 0) this.outputText("Your " + this.player.ballsDescriptLight() + " twitch powerfully, venting their contents, releasing a jet of hot cum into the goblin.");
                else this.outputText("Your body's internal muscles twitch, pushing a jet of hot cum into the goblin.");
                this.outputText("  Tamani wriggles happily, giving your nipples one last tweak before releasing them to play with her own.  Rope after rope of your goopey jism paints the inside of her canal, and the happy slut only begs for more the whole time.");
                if (this.player.cumQ() >= 250) this.outputText("  After a while you can feel the pressure building inside her, starting to give her a bit of a belly.  Tamani rubs it and begs, \"<i>More!</i>\"");
                if (this.player.cumQ() >= 500) this.outputText("  Your body fulfills her requests and more, stuffing her until she's positively pregnant and your spunk is squirting from her entrance with each wave of sticky spooge.");
                else this.outputText("  Sadly, you only manage a few more spurts before your orgasm ends.");
                this.outputText("\n\nA sudden draft of cold air blows across your suddenly released member, making you shiver.   You look over at Tamani, watching your seed run down her thighs as she primps her hair and does a quick touch-up of her make-up.  She finishes up and blows you a kiss, bidding you farewell, \"<i>I'll be back for more if this one doesn't take");
                if (this.player.cumQ() < 250) this.outputText(".  I really enjoy our fucks " + this.player.mf("stud", "hun") + ", and I can't wait to 'bump' into you again.");
                else {
                    this.outputText(".  You make sure and let your ");
                    if (this.player.balls > 0) this.outputText(this.player.ballsDescriptLight() + " fill back up with cum, ok?");
                    else this.outputText(this.player.cockDescript(0) + " fills back up with cum, ok?");
                }
                this.outputText("</i>\"\n\n");
                // Combat end:
                if (this.getGame().inCombat) {
                    this.outputText("You black out, exhausted from the ordeal.");
                    this.combat.cleanupAfterCombat();
                    this.player.orgasm('Dick');
                }
                // (Noncombat end:
                else {
                    this.outputText("You lie there, recovering from the intense sex.  After a little while you manage to get up and redress, but the scent of horny goblin stays with you for hours.");
                    this.player.orgasm('Dick');
                    this.dynStats("lus", +10);
                    this.doNext(this.camp.returnToCampUseOneHour);
                }
            }
            // (Doesnt fit)
            else {
                this.outputText("Tamani turns about, dragging her wet gash across you and giving you a nice view of her plump butt-cheeks.  She looks over her shoulder and sucks on one of her lacquered fingernails, looking equal parts mischievous and sexy.   You rock your hips under her until she gives your ");
                if (this.player.balls > 0) this.outputText(this.player.ballsDescriptLight());
                else this.outputText(this.player.cockDescript(0));
                this.outputText(" a rough slap.  Whimpering, you still your rebellious hips and allow her to play you like the world's most sensitive fiddle.  Tamani pulls your " + this.player.cockHead() + " up and rocks herself against it, openly moaning as you dribble pre into her sopping gash.\n\n");
                this.outputText("\"<i>Oooh, you're too big for little ol' me,</i>\" moans the goblin, easing back a bit, \"<i>but I have something that might make you cum just as hard.   I'll just make sure to catch all your cum with my cunny!</i>\"    She pulls out a hot-pink dildo and gives it a lick.  You watch in horror as a drop of thick fluid leaks from the tip.  No doubt Tamani intends for you to take take the entire thing in one way or another.\n\n");
                this.outputText("You pout, protesting meekly as she ");
                if (this.player.balls > 0) this.outputText("lifts up your " + this.player.ballsDescriptLight());
                else this.outputText("leans forwards, looking between your legs");
                this.outputText(", and places the dildo's leaking tip against your " + this.player.assholeOrPussy() + ".  You feel it stretching you out, reacting with your body's own fluids to swell up inside you like a pervert's balloon as Tamani pushes it further and further inside you.");
                if (this.player.hasVagina()) {
                    this.outputText("  ");
                    this.player.cuntChange(this.player.vaginalCapacity() * .95, true);
                    this.outputText("Your walls squeeze tightly around it in an unconscious milking motion as your body reacts to it as if it were a real dick.");
                }
                else {
                    this.player.buttChange(this.player.analCapacity() * .95, true);
                    this.outputText("Your body clamps down around it, resisting the strange intrusion as it swells up to fill you, pressing tightly against your prostate.");
                }
                this.outputText("  A burning heat radiates through your body, making your " + this.player.nippleDescript(0) + " tingle and grow ever more sensitive.\n\n");
                this.outputText("Tamani rocks back and forth, sliding herself against your " + this.player.cockDescript(0) + ", humping it lewdly as your veins rub her hard little nub of a clit.  She pants, making sure to keep giving you sultry looks over her shoulder, licking her glossy lips as she brutally teases you.  You can feel her getting off over and over as she grinds, sliding faster and faster on your shaft.   For your part, your " + this.player.cockDescript(0) + " begins making a puddle of pre-cum on your belly as the dildo's drug-like cum affects you, making you feel horny and hot.\n\n");
                this.outputText("The kinky goblin dominatrix on your " + this.player.cockDescript(0) + " leans even further forwards, angling the dildo in your " + this.player.assholeOrPussy() + " upwards to squeeze your ");
                if (this.player.hasVagina()) this.outputText("cock's base ");
                else this.outputText("prostate ");
                this.outputText(" with delicious intensity.  You quiver underneath her, panting and moaning, totally subservient to the tiny girl giving your body the sexual workout of a life-time.  She slides back, her cunt squishing back and forth against your prick-head, driving you wild.  She coos, \"<i>Go ahead and cum stud,</i>\" while squeezing your ");
                if (this.player.balls > 0) this.outputText("balls");
                else this.outputText("crotch");
                this.outputText(", \"<i>let out all that hot sticky spunk for Mistress Tamani.</i>\"\n\n");
                this.outputText("Your body immediately and happily complies, squirting a jet of thick white jism onto the goblin's jiggling ass-cheeks.  She slides down, aligning her cunt with your swollen cock-tip, taking the next squirt directly between her lips as she rubs against you.  Tamani slaps the dildo in your " + this.player.assholeOrPussy() + " gently, squeezing out an incredibly thick gout of semen as she stretches you wider.  ");
                if (this.player.cumQ() >= 250) {
                    this.outputText("You cum harder and harder, pushing her back a bit and splattering her belly with white cream.  She moans, rubbing it into her skin and twat");
                    if (this.player.cumQ() >= 500) this.outputText(" as you keep cumming, splattering her tits and face, soaking the little goblin slut");
                    this.outputText(".  ");
                }
                this.outputText("The dildo slips out of your abused " + this.player.assholeOrPussy() + " forgotten in the heat of your lovemaking, leaking pink goo.\n\n");
                this.outputText("Tamani eases up off of you, dripping a mixture of sexual fluids and stretching as if she had just completed a long workout.  The slutty goblin winks at you and waves, \"<i>Thanks for the cum.  Be sure and take some time to refill.  I wanna be soaked again next time!</i>\"\n\n");

                // Combat end:
                if (this.getGame().inCombat) {
                    this.outputText("You black out, exhausted from the ordeal.");
                    this.combat.cleanupAfterCombat();
                    this.player.orgasm('VaginalAnal');
                }
                // (Noncombat end:
                else {
                    this.outputText("You lie there, recovering from the intense sex.  After a little while you manage to get up and redress, but the scent of horny goblin stays with you for hours.");
                    this.player.orgasm('VaginalAnal');
                    this.dynStats("lus", +10);
                    this.doNext(this.camp.returnToCampUseOneHour);
                }
            }
        }
    }

    // [NORMAL COMBAT – LOSS TEXT]
    public tamaniSexLost(): void {
        this.spriteSelect(SpriteDb.s_tamani);
        this.tamaniKnockUp();
        this.clearOutput();
        this.outputText("Tamani gives you a knowing smile as you ");
        if (this.player.HP < 1) this.outputText("lie there, unable to fight back.  ");
        else this.outputText("touch yourself, giving in to the tiny goblin's desire to breed.  ");
        this.outputText("She advances, her bare feet padding across the soil as she rummages in a faded leather pouch for something.  Her eyes light up as she finds whatever it is she was looking for.  In her hand is a ribbed silver ring, covered on every surface with numerous carved runes.  You whimper and back up, knowing she intends to fit it over your " + this.player.cockDescript(0) + ", but Tamani only 'tsks' and shakes her head.\n\n");
        this.outputText("\"<i>You were such a naughty boy, teasing me with that juicy dick and then pretending like you didn't want this.  I'll have to punish you for being bad, that's all there is to it,</i>\" she explains, pushing your hands away and fitting the ring around your flare.  ");
        if (this.player.cocks[0].cockThickness >= 5) this.outputText("Impossibly, despite your titanic girth, the ring somehow expands to squeeze onto you, though it's painfully tight.\n\n");
        else this.outputText("Somehow the ring fits onto you perfectly, as if it was made exactly for your " + this.player.cockDescript(0) + ", though it remains painfully tight.\n\n");
        this.outputText("\"<i>Don't fret, " + this.player.mf("stud", "hun") + ".  I'll still let you get off after I feel you've learned your lesson,</i>\" she offers, pulling up a large empty milk-bottle in her other hand.  \"<i>Of course I'll need to collect some for myself,</i>\" she says, \"<i>Since you played hard to get, you'll have to miss out on the feel of my juicy snatch!</i>\"  At the mere mention your eyes lock between her legs, zeroing in on her puffy engorged labia.  Why didn't you just submit right away and let her have your cum?\n\n");
        this.outputText("She forces the ring down your entire length, not stopping until it bottoms out against the flesh of your groin.  In response, the obviously magical ring cinches even tighter and begins a slow vibration, providing pleasure but denying you the ability to orgasm.  Tamani wraps a single hand around your tight tender shaft, squeezing and pulling, using discomfort to guide you up onto your hands and knees.  She eases up on the pressure, allowing you a bit of pleasure once she has you where she wants you.  You look down between your arms ");
        if (this.player.biggestTitSize() >= 6) this.outputText("but can't manage to see your bloated prick past the wall of titflesh.\n\n");
        else this.outputText("at your bloated prick, looking almost overinflated from all the blood that tight ring has forced into it.\n\n");
        this.outputText("<b>*SMACK*</b>  Tamani's hand cracks against your " + this.player.buttDescript() + " making you lurch and bite back a cry of pain.   \"<i>Bad boys get punished!</i>\" she yells as she brings her hand down again, slapping your other cheek.  You're sure there must be two tiny red hand-prints forming already. The kinetic impacts of her blows vibrate through your hips, traveling into your sensitive " + this.player.cockDescript(0) + " and working with the magic-ring to spread equal measures of pain and pleasure through its length.\n\n");
        this.outputText("The spanking doesn't let up until your ass is cherry-red and tender.  Tamani gently pats it, making you wince in displeasure, and giggles, pleased with herself, \"<i>Hehe, do you think I've punished you enough?  I'm sure you do, but what I really want to know is – have you learned your lesson?  I need to make sure you'll be a good boy and jump right into my honeypot next time I ask.  I hate wasting time fighting when we could be making love and breeding.</i>\"\n\n");
        this.outputText("Tamani pours oil over your abused backside, letting it soak in and start to numb the pain.  She pours quite a different type of oil into her hands and starts massaging you, letting the alchemical mixture make your skin tingle and enhance the sensation of pleasure while numbing away the pain of your cock being kept so... tightly bound.  Your arms and " + this.player.legs() + " tremble from supporting yourself at such an awkward angle, struggling not to relax at the sudden influx of pleasure.  The feelings bring you to the edge, and you feel your body's internal muscles clenching, but the tight vibrating ring blocks your cum and your orgasm, leaving you backed up and desperate.\n\n");
        this.outputText("Your goblin mistress ");
        if (this.player.balls > 0) this.outputText("cups your " + this.player.ballsDescriptLight() + " tightly");
        else this.outputText("caresses you around the ring");
        this.outputText(" and asks, \"<i>So are you sorry for making me wait for my cream " + this.player.mf("stud", "slut") + "?  If you are, just say <b>I'm sorry mistress Tamani, please milk my cock whenever you want</b> and then beg me to cum.</i>\"\n\n");

        this.outputText(this.images.showImage("tamani-loss-fuck"));
        this.outputText("You NEED to cum.  Her hands... they keep stroking you, and each time your body begins to orgasm it's held back, trapped within you painfully.  ");
        if (this.player.balls > 0) this.outputText("Your balls are getting VERY swollen and tender.");
        else this.outputText("Your body aches inside, feeling bloated and ready to pop.");
        if (this.player.cor < 50) this.outputText("  You have no choice, you'll say what she wants you to say.\n\n");
        else this.outputText("  Being denied like this was kind of fun, but you REALLY need to get off now, so you'll say what she wants you to say.\n\n");

        this.outputText("\"<i>Mistress Tamani, I'm so sorry!  Milk my cock dry any time you want!  Puhleeeeeaaaaase let me cum!  Please, I'm so fucking horny, I'll do what you want, just give me release!</i>\" you beg, ");
        if (this.player.cor > 50) this.outputText("blushing hotly and doing your best to look like a submissive toy.\n\n");
        else this.outputText("blushing in shame and embarrassment, but meaning every word.\n\n");

        this.outputText("She takes the empty bottle and presses it against your " + this.player.cockHead() + ", caressing your length with loving affection with her free hand as she replies, \"<i>Not exactly what I told you to say, but it DID sound heartfelt.  Let's let out all that backed up cum now, hrmmm?</i>\"   Her free hand touches the ring and you feel the pressure relax a bit - still tight enough to keep you beyond-hard, but loose enough for you to cum.  She strokes and squeezes as your blocked orgasms slowly flow into the bottle, smiling as it thickens and begins spurting as pleasure overtakes you.  You hold yourself on all fours, red-assed and submissive as your goblin mistress milks you of the last of your cum.");
        if (this.player.cumQ() >= 250) this.outputText("  The bottle quickly overflows, but Tamani happily sets it aside and slides her own cunt under you, letting you pump the rest of your seed into her fertile womb.");
        if (this.player.cumQ() >= 500) this.outputText("  She coos happily when you still manage to pump enough jism into her to bloat her belly, but even with your impressive fertility, the orgasm has to end.");
        this.outputText("\n\n");

        this.outputText("Tamani removes the ring once you have finished.  She seals the bottle and places it in her pouch as you drop to the ground, exhausted.  All you can do is watch as she walks away, her ass swaying confidently from side to side.  Your last thought before you pass out is how much easier it would've been to just fuck her.");
        this.player.orgasm('Dick');
        this.dynStats("lib", .5, "sen", -1, "cor", .5);
        this.combat.cleanupAfterCombat();
    }

    // [NORMAL COMBAT – VICTORY RAEEP]
    // Shove her face in the mud and fuck her
    public tamaniSexWon(): void {
        this.spriteSelect(SpriteDb.s_tamani);
        this.tamaniKnockUp();
        let x: number = this.player.cockThatFits(90);
        if (x == -1) x = this.player.biggestCockIndex();
        this.clearOutput();
        this.outputText(this.images.showImage("tamani-win-fuck"));
        if (this.player.cockArea(x) <= 90) {
            this.outputText("You grab hold of the insensate goblin by her pink-dyed hair and shove her into the mud, irritated with her constant demands and rape attempts.  The horny slut doesn't even have the grace to be ashamed of her defeat.  She just lies in the mud, wiggling her exposed ass back and forth in the air, trying to tempt you with it.\n\n");
            this.outputText("It's too tempting of a target to resist.  You open your " + this.player.armorName + " and allow your " + this.player.multiCockDescriptLight() + " to flop free.  You're already hard from the enticing display, and in a moment you're pressing against her lust-slicked pussy");
            if (this.player.totalCocks() > 1) this.outputText(" and tight asshole");
            this.outputText(".  You don't allow her any say in the matter, pushing forward as you feel the small girl's flesh yield around ");
            if (this.player.totalCocks() > 1) this.outputText("each of ");
            this.outputText("your girth");
            if (this.player.totalCocks() > 1) this.outputText("s");
            this.outputText(".  She squeals happily, clearly getting what she desires.  For a moment you feel disappointed in yourself, but the sensations of her tight hole");
            if (this.player.totalCocks() > 1) this.outputText("s");
            this.outputText(" clenching and squeezing around you quickly washes it away.\n\n");

            this.outputText("You rock back and forth methodically, treating Tamani like a tight cock-sleeve.  The goblin slut's hands rub her belly, not even attempting to pull her face out of the mud as she moans and giggles like a whore.  You keep working her cunt like a ");
            if (this.player.gender == 1) this.outputText("man");
            else this.outputText("herm");
            this.outputText(" possessed, sawing in and out with brutal efficiency, the wet squelches of the slut's juices driving you to piston back and forth with even greater force.  She gurgles happily, her ");
            if (this.player.totalCocks() == 1) this.outputText("pussy squeezing tightly as she cums hard.\n\n");
            else this.outputText("holes squeezing tightly as she cums hard.\n\n");

            if (this.player.totalCocks() > 1) {
                this.outputText("Each of your " + this.player.multiCockDescriptLight() + " pulsates, spasming inside your goblin-flesh prison, spraying a bit of sticky goo into the happy slut.   You can hear her babbling, pleasure-drunk as she quivers around you, \"<i>Fuck yes! Cu-ah-ahm in me!  Fuck fuckfuckfucKFUCKYEAH!  Oooh, that's it, put me in the dirt and show me who's boss!</i>\"  The words seem to have the desired effect, helping you empty every ounce of cock-cream into the slut's tight holes.");
                if (this.player.cumQ() >= 250) this.outputText("  She pants, turning her head in the mud to watch as her belly visibly inflates, stuffed totally full of cum. ");
                if (this.player.cumQ() >= 500) this.outputText("  In no time at all a river of jism pours from her, pooling below as you overwhelm her body's capacity to store spunk.");
            }
            else {
                this.outputText("Your " + this.player.multiCockDescriptLight() + " pulsates, spasming inside your goblin-flesh prison, spraying a bit of sticky goo into the happy slut.   You can hear her babbling, pleasure-drunk as she quivers around you, \"<i>Fuck yes! Cu-ah-ahm in me!  Fuck fuckfuckfucKFUCKYEAH!  Oooh, that's it, put me in the dirt and show me who's boss!</i>\"  The words seem to have the desired effect, helping you empty every ounce of cock-cream into the slut's tight hole.");
                if (this.player.cumQ() >= 250) this.outputText("  She pants, turning her head in the mud to watch as her belly visibly inflates, stuffed totally full of cum. ");
                if (this.player.cumQ() >= 500) this.outputText("  In no time at all a river of jism pours from her, pooling below as you overwhelm her body's capacity to store spunk.");
            }
            this.outputText("\n\nTamani winks, sucking on her finger as she staggers up.  She coos, \"<i>Mmmm, Tamani loves it when her " + this.player.mf("sexy lover", "stud") + " dominates her.  Do you think your ");
            if (this.player.balls > 0) this.outputText("sexy balls have ");
            else this.outputText("sweet cock has ");
            this.outputText("any more cream to give to me?</i>\"\n\n");
            this.outputText("She doesn't give you a chance to answer as she wobbles off, jiggling pleasantly in all the right places, \"<i>Of course you do.  I'll be back for the rest later!</i>\"\n\n");
            this.player.orgasm('Dick');
            if (this.getGame().inCombat) this.combat.cleanupAfterCombat();
            else this.doNext(this.camp.returnToCampUseOneHour);
        }
        // Too big? Jerk off with feet and bukkake
        else {
            this.outputText("You throw Tamani on her back, too drunk on desire to care how it feels for the tiny slut.  There's no way she could ever take ");
            if (this.player.totalCocks() > 1) this.outputText("any of your massive members");
            else this.outputText("your massive member");
            this.outputText(", so you grab her by the ankles and wrap her soft-soled feet about yourself.   You start jerking yourself off, using Tamani as a cute but expendable masturbation aid.  She chews a fingernail and massages her " + this.tamaniChest() + " as she watches you, doing her best to put on a show.  The little slut seems to like it.\n\n");
            this.outputText("Her feet start to grow slick with your sweat and pre-cum, sliding effortlessly along the length of your shaft as you continue to bring yourself towards orgasm.  You watch while Tamani dips her fingers into the slick folds of her hungry cunt, getting off on being used in such a perverse manner.  She coos, \"<i>How do my feet feel " + this.player.mf("stud", "slut") + "?  Are they soft and slick when they slide on your cock?  Are you going to cum for Tamani and paint her white?  You are.  You know you are.  Cum for Tamani.</i>\"\n\n");

            this.outputText("Oh gods, you are... it'd be so easy to just release all over her tight little body, soaking her in cum from head to toe.  You know she'd like it.  Hell, you'd like it, but you want to make her wait.   Your hands keep sliding and squeezing, jerking her now-slippery soles with faster and faster strokes.  Holding back is TOO hard!  You need to release – the little slut's words ring true as you squeeze tightly, feeling warmth building in your crotch as your body begins to climax.\n\n");

            this.outputText("Tamani licks her lips and pushes with her legs, assisting you as you milk yourself with her feet, squeezing out the first jet of hot goblin-treat.   It spatters over the green girl's forehead, running into her pink highlights.  She opens wide, craning up to catch the next blast of salty seed in her dirty lipstick-coated mouth.   Swallowing like a pro, she leans up further, letting you coat her tits with cream.");
            if (this.player.cumQ() >= 250) this.outputText("  You continue working your " + this.player.cockDescript(x) + " with her supple feet, watching your dripping spooge froth and bubble as you continue to pump more onto the sassy wench.");
            if (this.player.cumQ() >= 500) this.outputText("  She sputters, blowing some of the caked up semen off her face so she can breathe.  The slut gathers up the goopy mess as you continue to paint her, alternatively devouring it with her mouth and shoveling drippy handfuls into her eager cunt.");
            this.outputText("\n\n");

            this.outputText("Tamani winks, blinking the cum out of an eye as you finish up, releasing her seed-covered form.  She coos, \"<i>Mmmm, Tamani loves it when you dominate her, " + this.player.mf("stud", "sexy") + ".  Do you think your ");
            if (this.player.balls > 0) this.outputText("sexy balls have ");
            else this.outputText("sweet cock has");
            this.outputText("has any more cream to give to me?</i>\"\n\n");

            this.outputText("She doesn't give you a chance to answer as she staggers up and strikes a sexy pose, \"<i>Of course you do.  I'll be back for the rest later!</i>\"\n\n");

            this.outputText("Tamani wiggles in the sexiest way as she leaves, arousing your body all over again...");
            this.player.orgasm('Dick');
            this.dynStats("lus", 35);
            if (this.getGame().inCombat) this.combat.cleanupAfterCombat();
            else this.doNext(this.camp.returnToCampUseOneHour);
        }
    }

    // [REPEAT MALE PREGNANT ENCOUNTER]
    private tamaniPregnantEncounter(): void {
        this.spriteSelect(SpriteDb.s_tamani);
        this.clearOutput();
        this.outputText(this.images.showImage("tamani-preggo-encounter"));
        this.outputText("Tamani strolls out from behind a boulder, and wow is she ever pregnant.  It doesn't diminish the look of lust in her eyes when she meets your gaze, but her hands do keep rubbing the outside of her belly, only pausing to squeeze drops of milk from her nipples.  Her leather straps seem to fit her even better than before, accentuating her expanding curves and looking fantastic on her pregnant form.\n\n");
        this.outputText("She parts her legs and rubs her lower lips while she begs you, \"<i>Please fuck me!   I'm so horny from the pregnancy and I can't wait to give you daughters so you can knock me up all over again!</i>\"");
        // [Fuck Her] [Refuse]
        this.menu();
        this.addButton(0, "Fuck Her", this.tamaniPregnantFuck);
        this.addButton(1, "Refuse", this.tamaniPregnantRefusal);
    }

    // [Refuse]
    private tamaniPregnantRefusal(): void {
        this.spriteSelect(SpriteDb.s_tamani);
        this.clearOutput();
        this.outputText("She bursts into tears and waddles away crying.  You aren't sure if you should feel bad or not.");
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    // [FUCK HER PREGGERS – Consentual]
    private tamaniPregnantFuck(): void {
        this.spriteSelect(SpriteDb.s_tamani);
        this.clearOutput();
        this.outputText("Tamani's eyes light up and she pounces you, somehow managing to jump up and latch onto your chest despite the weight of her burgeoning pregnancy.  The two of you overbalance as her weight carries you to the ground, flat on your back.   Your " + this.player.buttDescript() + " hurts a little from the impact but it's the last thing on your mind.  More important are the milk-dribbling twin mounds pressing tightly against your ");
        if (this.player.biggestTitSize() >= 2) this.outputText(this.player.allBreastsDescript());
        else this.outputText("chest");
        this.outputText(".\n\n");
        this.outputText("You grab her under the arms and lift her up, examining her milk-laden nipples.  They shine with moisture, practically begging to be sucked.  You nuzzle them, gently sucking one into your mouth and drinking down the nutritious beverage.  Tamani grinds her hips against one of your " + this.player.nippleDescript(0) + "s as she moans softly into your ear, practically cumming on you from the suckling alone.  You take a break when her milk-flow slows and take the other into your mouth, squeezing both her " + this.tamaniChest() + ", enjoying the enhanced fullness her pregnancy has brought.");
        // (Very large:
        if (this.flags[kFLAGS.TAMANI_TIMES_IMPREGNATED] > 6) this.outputText("  They're almost too big for you to handle; they probably make it hard for the poor girl to walk.");
        this.outputText("\n\n");

        this.outputText("Tired of the teasing, Tamani yanks her nipples free of your mouth and kisses you fiercely.  Her lips are hot, almost feverish, and taste of sweet cherries.  Fiery warmth races through your body, collecting at your groin as her tongue curls around yours.  She sucks on your lower lip before pulling back and giving you an all-too-knowing smile.  Your " + this.player.cockDescript(0) + " is just getting harder and harder, so tight it almost hurts.  You whine softly as Tamani wraps her feet around it, stroking it with her bare soles as she pulls herself down.\n\n");
        this.outputText("Her pregnancy swollen belly and growing breasts rub along your shaft as she kisses and squeezes it.  You're so turned on it hurts, and you KNOW it's from whatever she put in her lipstick this time.  You beg her, \"<i>Please, fuck me, I'm so horny it hurts!</i>\"\n\n");

        this.outputText(this.images.showImage("tamani-preggo-fuck"));
        // (Fits) – pregnant capacity is lowered by about 50%
        if (this.player.cockArea(0) <= 50) {
            this.outputText("Tamani pulls herself up to her feet and grabs your " + this.player.cockDescript(0) + " with a two-handed grip, guiding it towards her dripping cunny.  She squats down, taking the entire length in a quick thrust.   She giggles and starts bouncing on you relentlessly, teasing her nipples and talking dirty to you the whole time, \"<i>Come on stud, fuck your pregnant goblin wife.   I want to walk around pregnant and dripping with your cum for the rest of the day.  If you really stuff me up I can bring it back and share with the rest of my family, what do you think about that?  Dozens of my hot little sisters and daughters stuffed with your babies?</i>\"\n\n");
            this.outputText("You cum with near-painful intensity.  Tamani is actually lifted up by the force of your ejaculation.  Cum squirts from her abused fuckhole as she slips back down, rubbing her belly with both hands and tittering girlishly.  The waves of seed you're putting out seem far beyond your normal ability, and you try to manage a glare at her, blaming her, but she just licks her lips and winks in between orgasmic moans.    Cum squirts from her, streaming down her thighs and puddling under your " + this.player.buttDescript() + ".  At last you finish, leaving her looking even more pregnant than before.  Your ");
            if (this.player.balls > 0) this.outputText(this.player.ballsDescriptLight());
            else this.outputText("genitals");
            this.outputText(" ache from the explosive discharge, leaving you sore and exhausted.\n\n");
            this.outputText("For her part, Tamani staggers to her feet, letting you flop free as a river of your cum pours between her legs, soaking your lower body.  She staggers over to your face, pleasure-drunk, and leans down to give you another sloppy kiss.\n\n");
            this.outputText("\"<i>Thanks for the good fuck, " + this.player.mf("stud", "lover") + ",</i>\" she says, smiling cruelly as you find yourself getting hard again from her drug-laced kisses.  Tamani doesn't hang around to help though; she waddles off, cradling her belly and smiling.\n\n");
            this.player.orgasm('Dick');
            this.dynStats("lus", 25);
        }
        // (Doesn't Fit)
        else {
            this.outputText("\"<i>Sorry " + this.player.mf("stud", "lover") + ", you're just too big and <b>hard</b> for me.   Don't worry, I'll help you unload everything straight into my sweet cunt,</i>\" she apologizes, ");
            if (this.player.balls > 0) this.outputText("massaging your balls with her feet");
            else this.outputText("jacking the base of your " + this.player.cockDescript(0) + " with her feet");
            this.outputText(" while her hands caress and tease you.   Tamani pulls herself downwards, pressing the " + this.player.cockHead() + " partway up her drooling box.  She grinds hard against your cock-head, nearly driving you mad with pleasure.  She grabs her " + this.tamaniChest() + " and squeezes, splattering you with a thick coating of milk before returning to jacking you off with her feet and hands.\n\n");
            this.outputText("You cum with near-painful intensity.  Tamani is actually pushed back a bit by your first blast, getting splattered from her chest down as jizz tries to escape her suddenly fluid-filled cunt.  She lunges forwards, grinding her pregnancy-bloated body against your pole, using her arms and legs like tight cock-rings.  Her gash and hard little clit spread her fragrant wetness as she orgasms with you, feeling each wave of your spunk pass underneath her.   With no receptacle, you end up drenched in a puddle of the stuff.  While it does eventually end, your sore body is a clear indication that some drug in her lipstick probably helped you push out such a ludicrous volume.\n\n");
            this.outputText("Tamani grinds on you a bit longer before staggering up and stretching.  She pauses to get a narrow bottle and abruptly jams the end into your urethra.  With one practiced motion, she squeezes your " + this.player.cockDescript(0) + " from bottom to top, squeezing the last of your spoo into the container.  She pops it free, corks it, and pockets it.  She pats her pockets and explains, \"<i>A few of the girls back home aren't pregnant, and I thought you might like to help contribute to the local slut population.  Don't worry though baby, I'll always own your cock.</i>\"\n\n");
            this.flags[kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS] += 3;
            this.outputText("Tamani comes over to you and gives you a sloppy goodbye kiss, sending an immediate surge of hardness and desire to your groin.  She looks back and giggles, then waddles off, patting her pouches and dripping with your spooge.");
            this.player.orgasm('Dick');
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // [Birth Encounter]
    private tamaniPoopsOutBabies(): void {
        this.spriteSelect(SpriteDb.s_tamani);
        this.clearOutput();
        this.outputText(this.images.showImage("tamani-encounter-preggo"));
        this.outputText("You hear orgiastic screams in the distance as you explore.  You turn to investigate, and as you go, they become even louder and higher pitched.  You crest a rise and find Tamani ");
        if (this.flags[kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS] > 0) this.outputText("with her daughters, "); // She always has at least two daughters if she has any
        this.outputText("laying against a scrubby tree with her legs spread wide and surrounded by a small puddle.  Her " + this.tamaniChest() + " heave with deep breaths as she pushes hard, stretching her cunt wide.  Her eyes roll back as a green form slips free, revealing a tiny goblin that immediately stands up on wobbly legs.  The little girl turns and latches onto her mother's bloated nipple as another child slips free.");
        if (this.flags[kFLAGS.TAMANI_PREGNANCY_COUNT] > 2) {
            this.outputText("  Moments later a third appears");
            if (this.flags[kFLAGS.TAMANI_PREGNANCY_COUNT] > 3) {
                this.outputText(", a fourth");
                if (this.flags[kFLAGS.TAMANI_PREGNANCY_COUNT] == 5) {
                    this.outputText(", and a fifth");
                }
                else this.outputText(", and more than you can count");
            }
            this.outputText(".");
        }
        this.outputText("\n\n");

        if (this.flags[kFLAGS.TAMANI_PREGNANCY_COUNT] == 2) {
            this.outputText("The twins drink deeply, growing taller before your eyes as Tamani comes out of her pregnancy induced orgasms.");
        }
        else {
            this.outputText("The goblin children drink deeply, squabbling for a chance at suckling the nipples as their mother recovers from her birthing-induced orgasms.");
        }
        this.outputText("  She looks up at you and whispers breathily, \"<i>Come fuck me a little later, I'll give you even more beautiful little girls.  These " + TamaniScene.num2Text(this.flags[kFLAGS.TAMANI_PREGNANCY_COUNT]) + " will be fully grown in a week or two and out man-hunting, but none of them will please you like me, I promise.</i>\"\n\n");
        this.outputText("Tamani sighs and relaxes, enjoying the breastfeeding and waving you away.  You shrug and head back to camp, more than a little aroused.");
        this.dynStats("lus", this.player.lib / 10 + this.player.cor / 10);
        this.tamaniGivesBirth();
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public tamaniKnockUp(): void {
        if (this.pregnancy.isPregnant) return; // Already preggers
        this.pregnancy.knockUpForce(PregnancyStore.PREGNANCY_PLAYER, 216); // Nine day long pregnancy
        // Determine how many kids...
        this.flags[kFLAGS.TAMANI_PREGNANCY_COUNT] = 2;
        const cum: number = this.player.cumQ();
        // Breeder perk is awesome
        if (this.player.findPerk(PerkLib.MaraesGiftStud) >= 0) this.flags[kFLAGS.TAMANI_PREGNANCY_COUNT] += 3;
        if (cum >= 50 && rand(2) == 0) this.flags[kFLAGS.TAMANI_PREGNANCY_COUNT]++;
        if (cum >= 100 && rand(2) == 0) this.flags[kFLAGS.TAMANI_PREGNANCY_COUNT]++;
        if (cum >= 200 && rand(2) == 0) this.flags[kFLAGS.TAMANI_PREGNANCY_COUNT]++;
        if (cum >= 300 && rand(2) == 0) this.flags[kFLAGS.TAMANI_PREGNANCY_COUNT]++;
        if (cum >= 400 && rand(2) == 0) this.flags[kFLAGS.TAMANI_PREGNANCY_COUNT]++;
        if (cum >= 500 && rand(2) == 0) this.flags[kFLAGS.TAMANI_PREGNANCY_COUNT]++;
        if (cum >= 600 && rand(2) == 0) this.flags[kFLAGS.TAMANI_PREGNANCY_COUNT]++;
    }

    public encounterTamani(): void {
        // Fems:
        if (this.player.totalCocks() <= 0) {
            this.tamaniFemaleEncounter();
        }
        // Dudezillaz:
        else if (this.flags[kFLAGS.TAMANI_MET] == 0) {
            this.tamaniMaleFirstEncounter();
        }
        else {
            switch (this.pregnancy.event) {
                case 2: this.tamaniPregnantEncounter(); break;	// She's moderately pregnant
                case 3: this.tamaniPoopsOutBabies(); break;		// She's close to giving birth so do it now
                default: this.tamaniMaleRepeatEncounter();		// She's not pregnant or is only slightly pregnant
            }
        }
    }
    // TAMANI HYPNO SHIT

    // [GIVE IN TO TAMANI'S HYPNO SHENANIGANS]
    public getRapedByTamaniYouHypnoSlut(): void {
        this.spriteSelect(SpriteDb.s_tamani);
        this.clearOutput();
        // Find a dick that fits
        const primary: number = this.player.cockThatFits(65);
        let secondary: number = 0;
        const cocks: number = this.player.totalCocks();
        this.outputText("Tamani crooks her finger and you come running, already feeling yourself straining against your " + this.player.armorName + " for a chance to fuck your wife and mistress.  She giggles, \"<i>Ohhh, how sweet, you're so ready to do your duty.</i>\"\n\n");
        this.outputText("The goblin traces her fingers over the bulge in your " + this.player.armorName + " before reaching inside of it to give you a tender squeeze.  You sigh, happy to have earned such tender treatment from your lovely wife.  Automatically, your hands undo your " + this.player.armorName + ", removing the troublesome garment so as not to interfere with your lovemaking.   Tamani gives you another squeeze and teases, \"<i>Oh baby, you're hooked on Tamani's pussy, aren't you?  I can tell, you're practically trembling.  Let Tamani help take care of that for you.</i>\"\n\n");
        this.outputText("She smirks and bends over, looking back up at you from between her legs.  She offers, \"<i>Go ahead and stick it in.  A horny " + this.player.mf("boy", "herm") + " like you needs to have that delicious cock inside a nice, tight wife like myself.</i>\"\n\n");

        this.outputText(this.images.showImage("tamani-willing-sex"));
        // [FITS]
        if (primary >= 0) {
            this.outputText("Tamani is completely right.  You grab her ass, feeling your fingers sink in to her supple flesh as you pull her back towards your ");
            if (cocks > 0) this.outputText("main ");
            this.outputText(this.player.cockDescript(0) + ".  Her warmth spreads over your " + this.player.cockHead(primary) + " slowly, making you twitch and drip inside her, lubricating her already dripping channel with even more slick fluids.  With a mighty heave you push inside her, feeling yourself penetrating deep inside her, directly into her fertile womb.  Tamani rubs your " + this.player.legs() + " with her hands, giving you a massage as you bottom out against her, feeling her juices stain your ");
            if (this.player.hasSheath()) this.outputText("sheath");
            else this.outputText("crotch");
            this.outputText("\n\n");

            this.outputText("You wait a second, adjusting to the feeling of being completely contained by such a warm, wet hole before you slowly push her away.  The slick walls of her tunnel clench around you as you pull her back, massaging the parts of you still inside her.  ");
            if (cocks > 1) {
                if (primary > 0) secondary = 0;
                else secondary = 1;
                this.outputText("She moans and pulls your " + this.player.cockDescript(secondary) + " into her mouth, running her tongue around the tip and sliding her palm along the underside.");
            }
            else this.outputText("She moans and pants, babbling about how good you are to her the whole time.");
            this.outputText("  You don't stop until your " + this.player.cockHead(primary) + " is the only thing inside her.\n\n");

            this.outputText("  The second thrust is even better than the first.  It's slippery, hot, and passionate, and the idea of slowing down or stopping for any reason is inconceivable.  Tamani pants with each thrust, pawing at her bouncing breasts, grabbing one by the nipple with a free hand and moaning loudly");
            if (cocks > 0) this.outputText(" around your " + this.player.cockDescript(secondary));
            this.outputText(". Her tiny form jiggles, ");
            if (this.player.tallness > 55) this.outputText("lifting off the ground as you get into it, giving yourself over to her sex.");
            else this.outputText("nearly falling over as you give your body over to her sex.");
            this.outputText("  She visibly orgasms, shaking and trembling from head to toe as her pussy milks your " + this.player.cockDescript(primary) + ".  It only lasts a few seconds, though they feel like heaven, before her body goes nerveless.\n\n");

            this.outputText("Taking that as an opportunity, you pick up the pace, plunging yourself in and out of her with a renewed, almost vicious vigor.  The wet slaps of your juice-");
            if (this.player.hasFur()) this.outputText("matted");
            else this.outputText("slicked");
            this.outputText(" " + this.player.skin.desc + " impacting her ass fill the air.  You fuck your wife harder and faster with every stroke, knowing you won't last more than a few more thrusts before you're painting her womb white.  Your wife is too cummed out to care or respond, ");
            if (cocks == 1) this.outputText("her tongue hanging out as she pants nonsensical pleasure-noises.");
            else this.outputText("and her mouth is too full of " + this.player.cockDescript(secondary) + " to do anything but gurgle out nonsensical pleasure-noises.");
            this.outputText("  Swelling wider inside the wet hole, your " + this.player.cockDescript(primary) + " tingles and clenches, about to unload.\n\n");

            this.outputText("An intense orgasm rolls through you, making your body clench as your piston your " + this.player.cockDescript(primary) + " forwards, burying it deeply inside the goblin-shaped cum-receptacle.  ");
            if (this.player.hasKnot(primary)) this.outputText("Your knot balloons inside her, locking her in place");
            else if (this.player.cocks[primary].cockType == CockTypesEnum.HORSE) this.outputText("Your flare widens, actually holding itself inside Tamani's womb");
            else if (this.player.cocks[primary].cockType == CockTypesEnum.DEMON) this.outputText("The corrupted nodules along your " + this.player.cockDescript(primary) + " pulsate in rippling, wave-like motions, massaging the interior of Tamani's twat");
            else if (this.player.cocks[primary].cockType == CockTypesEnum.TENTACLE) this.outputText("Your tentacle-cock's tip widens, becoming mushroom-like inside Tamani's womb");
            else this.outputText("Your sensitive head swells slightly in time with the contractions of your orgasm");
            this.outputText(" as you begin to fill your wife's womb with seed.   The orgasm is intense");
            if (this.player.cumQ() < 50) this.outputText(", but brief, and after a few moments of spasming pleasure, the flood of cum slows to a trickle.");
            else if (this.player.cumQ() < 300) this.outputText(" and voluminous, forcing more and more seed into Tamani's uterus until she sloshes with each new squirt.  After a few long moments of spasming pleasure, the flood of cum slows to a trickle.");
            else {
                this.outputText(" and massive, squirting thick gouts of semen directly into Tamani's waiting womb until each new explosion of spunk makes her slosh.  She moans, her belly bloating slightly until she's unable to take any more.");
                if (this.player.cumQ() < 1000) this.outputText("  Though your orgasm tapers off, the additional seed squirts from between her thighs, trickling down to a slow drip of viscous white goo.");
                else this.outputText("  Trapped inside her and cumming as hard as ever, you raise the pressure inside the goblin until your seed is washing out of her cunt around you, puddling on the ground.");
                if (this.player.cumQ() >= 1000 && this.player.cumQ() < 4000) this.outputText("  It does eventually end, but not until a sizable puddle has formed between the pair of you.");
                else this.outputText("  It lasts seemingly forever, and by the time you're done, the two of you are standing in a puddle inches deep.");
            }
            if (cocks > 1) {
                this.outputText("  During it all Tamani's throat works to swallow every drop");
                if (this.player.cumQ() > 300) {
                    this.outputText(", but before long she's failing, with cum leaking out from the corners of her mouth.");
                    if (this.player.cumQ() > 600) this.outputText("  A few seconds later she pulls back coughing, and the perky goblin takes the rest of your load in her face.");
                }
                else this.outputText(".");
            }
            this.outputText("\n\n");

            this.outputText("Joined at the hips, the two of you manage to stay upright, each leaning into the other");
            if (this.player.tallness > 55) this.outputText(" in spite of the height differential");
            this.outputText(".  Tamani regains her senses and pushes you back, waddling slightly after the intense fuck.   White jism and clear feminine fluids drool down her thighs, and your mistress couldn't be happier.  She pets your still-dripping " + this.player.cockDescript(primary) + " affectionately as she says, \"<i>You're such a wonderful husband.  I can't wait to see how you get along with your new daughters!</i>\"\n\n");

            this.outputText("A surge of pride spreads through you at her praise, and you lean down to give your wife a long french kiss before heading back to camp.  On the way back your head slowly clears, and you wonder what came over you back there?!");
            this.tamaniKnockUp();
            this.player.orgasm('Dick');
            this.dynStats("int", -.5, "sen", -1);
        }
        // [DOESNT FIT]
        else {
            this.outputText("Tamani is completely right.  You grab her ass, feeling your fingers sink in to her supple flesh as you pull her back towards your ");
            if (cocks > 1) this.outputText("main ");
            this.outputText(this.player.cockDescript(0) + ".  Her warmth spreads over the " + this.player.cockHead() + " of your " + this.player.cockDescript(0) + ", but will go no further.  You tug harder on her bouncing backside, but you're simply too large to fit inside your wife's beautiful pussy.  She turns around and places a small hand ");
            if (this.player.biggestTitSize() < 1) this.outputText("on your chest ");
            else this.outputText("between your " + this.player.breastDescript(0) + " ");
            this.outputText(" and commands, \"<i>Stop, you're just too big of a man for Tamani to do it the old fashioned way.</i>\"\n\n");

            this.outputText("Disgruntled but obedient, you stop your vaginal assault and release your wife.  It seems she has another way for your aching " + this.player.cockDescript(0) + " to perform its duties anyway.  Tamani turns around and pulls out some clear tubing, along with a floppy, flexible sheath while she explains, \"<i>I'll just have to get you off and let you pump all your babies into me with this!</i>\"\n\n");

            this.outputText("Her small, dextrous fingers wrap the upper half of your ");
            if (cocks > 1) this.outputText("primary ");
            this.outputText(this.player.cockDescript(0) + " inside the sheath, constricting it inside the tight, transparent material.  You sigh while you endure the treatment, disappointed you won't get to feel her clenching about you as you pour sperm into her fertile womb. She finishes up, slowly pushing the tube up her gorgeous, feminine hole until you're certain it'll be depositing your precious cargo into her deepest recesses. Tamani claps her hands together excitedly, \"<i>I haven't had a man big enough to use this with until you.  Oh husband, you're going to love this, just lie back for Tamani, okay?</i>\"\n\n");

            this.outputText("You do as you are told, like a good husband, and Tamani stays close, bound to you by a flexible, artificial umbilical.  She sits next to you, propping her feet up onto your " + this.player.cockDescript(0) + ".   The goblin doesn't have any shoes on her green-tinted feet, and in spite of the rough living conditions, they're softer than her hands, and nearly as dextrous.  You look over at her, questioningly at first, though it shifts to confused happiness as she begins stroking her left foot up and down your length.  Your wife shifts her right leg underneath you, and curls her toes around to interlock them with her left.\n\n");

            this.outputText("With both her feet locked together, wrapped around most of your sensitive " + Appearance.cockNoun(CockTypesEnum.HUMAN) + " and sliding along it, your petite wife begins giving you the foot-job of a lifetime.  The awkward position and intense desire make the both of you break out in a sweat, and before long her slippery feet are lubricated enough for her to pick up the tempo.  You rock against her soles, gazing lovingly into her eyes as she fondles her clit and gives you a perverted wink.  Tamani exclaims, \"<i>Oooh, I can feel you twitching under my toes!  Does Tamani's little feet feel good on her ");
            if (this.player.tallness > 60) this.outputText("big ");
            this.outputText(this.player.mf("strong man's", "sexy lover's") + " " + Appearance.cockNoun(CockTypesEnum.HUMAN) + "?</i>\"\n\n");

            this.outputText("You assure her that they do like what she is doing – very much so – and ");
            if (this.player.cor < 33) this.outputText("beg");
            else if (this.player.cor < 66) this.outputText("ask");
            else this.outputText("command");
            this.outputText(" her not to stop.  Tamani starts to giggle, but bursts into a moan as her fingers slide along her easily visible clit. She pants, \"<i>Hurry up and come for Tamani baby, I wanna feel you pumping your cum inside me!</i>\"\n\n");

            this.outputText("Obedient until the end, you obey your tiny mistress and reach your climax.  You gasp out loud, twitching between her feet as your cum slowly boils out from your body.  Tamani watches in fascination as your urethra bulges out, actually shifting the position of her feet to make room for your jism.  White goop rockets out of your urethra, pumping through the tube and into your wife's waiting gash.  She squeals and dribbles clear fluid underneath the tube, actually getting off from the feeling of being impregnated.");
            if (this.player.cumQ() > 250) this.outputText("  In no time, you've filled her to capacity, and white mixes in with the clear sexual fluids that are dripping from the goblin's cunt.");
            if (this.player.cumQ() > 700) this.outputText("  A few more blasts visibly bloat her belly, and Tamani pulls her hands away from her pussy to stroke the slowly rounding dome on her abdomen.");
            if (this.player.cumQ() > 1500) {
                this.outputText("  You just keep cumming, forcing the spooge to squirt out around the tube, puddling on the ground");
                if (this.player.cumQ() > 3000) this.outputText(", and by the time you finish, both of you are in a thick puddle of spunk");
                this.outputText(".");
            }
            if (cocks > 1) {
                if (cocks == 2) this.outputText("  Your other" + this.player.cockDescript(1));
                else this.outputText("  Each of your other " + this.player.multiCockDescriptLight());
                this.outputText(" splatters its own orgasmic juice everywhere, making a thorough mess of things, but neither of you seem to mind.");
            }
            this.outputText("\n\n");

            this.outputText("Tamani smiles as she pulls the tube out and stands up.  White jism and clear feminine fluids drool down her thighs, and your mistress couldn't be happier.  She peels her device off your still-dripping " + this.player.cockDescript(0) + ", pats it affectionately, and says, \"<i>You're such a wonderful husband.  I can't wait to see how you get along with your new daughters!</i>\"\n\n");

            this.outputText("A surge of pride spreads through you at her praise, and you get up to give your wife a long french kiss before heading back to camp.  On the way back your head slowly clears, and you wonder what came over you back there?!");
            this.tamaniKnockUp();
            this.player.orgasm('Dick');
            this.dynStats("int", -.5, "sen", -1);
        }
        if (this.getGame().inCombat) this.combat.cleanupAfterCombat();
        else this.doNext(this.camp.returnToCampUseOneHour);
    }

    public tamaniVictoryMenu(): void {
        this.flags[kFLAGS.TAMANI_DEFEAT_COUNTER]++;

        if (this.flags[kFLAGS.SFW_MODE] > 0) {
            this.outputText("You smile in satisfaction as Tamani collapses, unable to continue fighting.");

            this.combat.cleanupAfterCombat();
            return;
        }

        this.menu();

        if (this.flags[kFLAGS.TAMANI_DEFEAT_COUNTER] >= 4) {
            this.outputText(" If you're tired of Tamani trying to force herself upon you, you could resolve to not see her again.");
            this.addButton(10, "NO MORE!", this.killTamaniChoice);
        }
        this.addButton(14, "Leave", this.combat.cleanupAfterCombat);

        if (this.flags[kFLAGS.SFW_MODE] <= 0) {
            this.addDisabledButton(0, "Fuck", "This scene requires you to have cock and sufficient arousal.");
            this.addDisabledButton(1, "Buttfuck", "This scene requires you to have fitting cock and sufficient arousal.");
            this.addDisabledButton(2, "Lay Eggs", "This scene requires you to have spider ovipositor and enough eggs. She should not be pregnant.");

            if (this.player.lust >= 33 && this.player.hasCock()) {
                this.outputText(" You could fuck her, but if that's the case why did you bother fighting her?");
                this.addButton(0, "Fuck", this.tamaniSexWon);
                if (this.player.cockThatFits(this.monster.analCapacity()) >= 0)
                    this.addButton(1, "Buttfuck", this.tamaniAnalShits);
            }
            if (!this.pregnancy.isPregnant && this.player.canOvipositSpider())
                this.addButton(2, "Lay Eggs", this.tamaniBeaten); // NOT PREGGERS

            if (this.player.hasKeyItem("Deluxe Dildo") < 0) {
                this.addButton(3, "Take Dildo", this.tamaniStealDildo, undefined, undefined, undefined, "This bad girl doesn't deserve a good toy.");
            }
        }
    }

    private tamaniStealDildo(): void {
        this.outputText(this.images.showImage("item-dDildo"));
        this.outputText("And to the victor go the spoils. You open her satchel and take a look inside. ");
        this.outputText("\n\n<b>(You find a well-crafted pink dildo inside! There are also some other stuff.)</b>");
        this.player.createKeyItem("Deluxe Dildo", 0, 0, 0, 0);
        this.combat.cleanupAfterCombat();
    }

    public tamaniAnalShits(): void {
        this.spriteSelect(SpriteDb.s_tamani);
        const x: number = this.player.cockThatFits(this.monster.analCapacity());
        this.clearOutput();
        this.outputText(this.images.showImage("tamani-fuck"));
        this.outputText("You grab hold of the insensate goblin by her pink-dyed hair and shove her into the mud, irritated with her constant demands and rape attempts.  The horny slut doesn't even have the grace to be ashamed of her defeat.  She just lies in the mud, wiggling her exposed ass back and forth in the air, trying to tempt you with it.\n\n");
        this.outputText("It's too tempting of a target to resist.  You open your " + this.player.armorName + " and allow your prick to flop free.  You're already hard from the enticing display, and unable to resist any longer, you grab her hips and pull her plump ass up towards you.  She gasps as she's dragged along the ground and tries to crane her neck to face you.  \"<i>H-hey stud,</i>\" Tamani stammers, suddenly nervous, \"<i>you aren't thinking of-</i>\" You pull her close and press the tip of your " + this.player.cockDescript(x) + " against her tight asshole.  \"<i>HEY!</i>\" she shouts back, glaring threateningly at you.  \"<i>You better not, I need that baby batter in my womb, not my ass!</i>\"\n\n");
        this.outputText("Your menacing grin betrays no pity for the goblin, though.  You slowly press into her, her face contorting in pain as the tightness of her ass envelops you.  She grunts, hands clenched into tight fists as you bottom out in her.  \"<i>Please,</i>\" she begs, her eyes watering in pain and frustration, \"<i>I need you in my cunt! It... I don't want- oof!</i>\"  You start pumping your shaft forcefully in and out of her, slamming her full cheeks against you with every thrust.  You can tell from the way she feels around you that she's not very experienced with this way of doing things.\n\n");
        this.outputText("The more your " + this.player.cockDescript(x) + " stretches her tight anus, though, the more comfortable she seems to get with it.  She still protests weakly between grunts, but every once in a while a moan bursts from her, and the passion in them tells you that she's starting to like this.  Eventually she relaxes in your grip, resigning herself to letting you abuse her ass like it's a cheap toy.  One of her hands even sneaks up to her wet snatch and dips in.  Her hips start to move a bit without your influence, too, bouncing back and forth and you ram into her harder and harder.  Clearly she likes the feeling, even if she knows she won't get pregnant from it.\n\n");
        this.outputText("The slutty creature's moans turn to shouts as the sensation overwhelms her, and she bucks wildly back against you, face still in the dirt and tongue lolling out of her mouth.  \"<i>Oh, fuck yes, harder, HARDER!</i>\" she bursts forth wildly.  You oblige and pick up the intensity, absolutely ravaging her tight ass now with the motions of your " + this.player.cockDescript(x) + ".  She squeals somewhere down below you as her face is ground against the mud.  You rock her whole body back and forth as you slam into her, reveling in the feeling of her tight ass squeezing your cock as you slide inches in and out of her.\n\n");
        this.outputText("You can feel the cum building up inside you, and you know that you won't be able to hold out much longer.  Looking down, you can see that Tamani isn't far from orgasm, either.  Her fingers slip rapidly in and out of her cunt, and the look on her face is one of thoughtless bliss.  She shudders and goes limp in your grasp just as you cum, painting the insides of her ass with your semen.  Her eyes are still rolled up into the back of her head as you pull your softening prick out of her ass.  You drop her, letting her legs fall back to the ground with a dull thud.  She turns over onto her side, looking up at you.  Between exhausted pants, she manages to say, \"<i>Don't... think that I... enjoyed that... or anything... I'll be back for you, and you better not...</i>\" before she passes out.  You shake your head and laugh at the stubborn little slut as you tuck " + this.player.sMultiCockDesc() + " back into your " + this.player.armorName + " and head back to your camp.");
        this.player.orgasm('Dick');
        this.combat.cleanupAfterCombat();
    }

    public tamaniBeaten(): void {
        this.clearOutput();
        this.outputText("With the goblin defeated, you're finally free to tend to your body's true desires, even if they may be different than the ones the goblin was intent on stoking.  You shed your [armor] like a second skin, shrugging out of the offending garments with ease.  With your nude form revealed, Tamani ");
        if (this.player.hasCock()) this.outputText("licks her lips in anticipation, eyes locked on [eachCock]");
        else this.outputText("frowns in displeasure, noting your lack of a penis");
        this.outputText(".  She's clueless to the growing size that dangles beneath your spider-half, the secret drider treasure that you usually keep retracted.  A dollop of green goo drips from the tip of the semi-hard organ, still hidden from the goblin matron.");
        this.outputText("\n\nYou skitter up to her and calmly say, \"<i>Bend over.  I want to take you with my spider half.</i>\"");
        this.outputText("\n\nThe eager slut smirks and chuckles, \"<i>Whatever you say, ");
        if (this.flags[kFLAGS.TIMES_OVIPOSITED_TAMANI] == 0) this.outputText("my baby-" + this.player.mf("daddy", "momma"));
        else this.outputText("my egg-obsessed arachnophile");
        this.outputText(".</i>\"  Soon, the purple-haired skank has assumed the position, though she has the temerity to look back over her shoulder and lick her lips.  Her smouldering gaze is just beckoning for cock, but in this case, she'll be making do with your ovipositor.  You look away from her hungry eyes down to the green bubble-butt, admiring the swell of her cheeks, her puckered anus, and best of all, her sopping wet nethers.\n\n");

        this.outputText(this.images.showImage("goblinelder-win-drider-egged"));
        this.outputText("Tamani exhales, \"<i>Eyes up here, " + this.player.mf("stud", "breeder") + ".  I want to watch your face while you fuck me,</i>\" in a tone that promises delights beyond imagining.  \"<i>Put it in my pussy and give me your babies.  There's nothing like fucking a woman who'll take your cock straight into her womb and let you bathe her eggs with cum");
        if (this.flags[kFLAGS.TIMES_OVIPOSITED_TAMANI] > 0) this.outputText(", or in your case even more eggs");
        this.outputText(".</i>\"  Petite hands massage the goblin's perky, lust-thickened nipples as she talks and wiggles her bouncy bum in your direction.");
        this.outputText("\n\nYour hard legs clatter noisily as you advance on the prostrate, baby-hungry goblin.  Flexing foreign muscles, you bring your abdomen down and align the turgid organ with the goblin's gushing lips.  Her glistening gateway parts for your masculine egg-layer, easily allowing the ooze-dripping prong to slide right through her passage, and soon enough, your carapace is rubbing on jiggly green bottom, the ovipositor completely swallowed by the goblin's rapacious cunt.  Her rippling passages squeezes it gently, as if to say 'hi'.  Your drider instincts answer with a thick squirt of green goo.");
        this.outputText("\n\nTamani giggles happily and asks, \"<i>A little eager today, " + this.player.mf("stud", "baby") + "?  Is your spider-stick that happy to experience a little goblin loving?</i>\"  She gleefully begins to move herself, riding your arachnid tool like a bucking show-pony.  You moan at that, enjoying it for a moment before remembering that you just defeated this arrogant, cock-hungry slut.  You place your hands on her shoulders and push her down, filling her as you flatten her against the dirt, where she belongs.  With the goblin firmly hilted, you clench and release the first of your eggs; as soon as you allow one to roll down your fleshy tube, the next chases after.");
        this.outputText("\n\n\"<i>W-wha... oooohhhh.  That's niiiicccce,</i>\" Tamani sighs while trying to meet your gaze.  You smirk mirthfully at her and reach down to play with her " + this.tamaniChest() + ", squeezing and groping roughly while your eggs roll unimpeded into her willing, elastic womb.  The green girl shivers and moans, \"<i>Yes!  Fill me!  Fill me up!</i>\"");
        this.outputText("\n\nStill holding her fast, you simply enjoy the sensation, slowly stuffing Tamani's womb full of round orbs and gushy green padding.  A trickle of extra ooze escapes the curvy skank's thighs, mixed with her own clear juices.  It forms a sticky puddle beneath her that only grows larger as the goblin bloats.  Trickles of milk suddenly burst from the darkened nipples to wet your fingers, so you squeeze harder, milking the little slut like the whore-cow she is.  She cries, \"<i>FUCK YES!  Make me carry your babes and squirt milk everywhere!  Gods... so... pregnant...</i>\"");
        this.outputText("\n\nTamani's hands begin to roam across the taut dome of her gravid belly as it swells still bigger, and with a jubilant shriek, she climaxes, spraying gouts of green-tinged pussy-juice in a fan beneath her.  She goes limp in your grip, though her milk keeps flowing unimpeded.  You let her go, though she's held to your prong by the pressure of the last few eggs that pass into her stretchy, fertile womb.  You hum happily, feeling completely relieved, utterly languid and satisfied.");
        if (this.player.hasCock()) this.outputText("  White coats the goblin from her shoulders up, the only evidence of your male satisfaction.  You were so focused on the act of impregnation and the unique pleasure that it provides that you barely noticed [eachCock] erupting in sympathetic pleasure.");
        this.outputText("\n\nAt last, the bloated bitch slides into the gooey green puddle with a splash, freeing your ovipositor to retract.  She immediately begins snoring, clearly as satisfied as you.  What a strange creature.");
        this.flags[kFLAGS.TIMES_OVIPOSITED_TAMANI]++;
        // Don't encounter Tamani for 3 days if fertilized
        if (this.player.fertilizedEggs() == 0) this.pregnancy.knockUpForce(PregnancyStore.PREGNANCY_DRIDER_EGGS, 72);
        this.player.dumpEggs();
        this.player.orgasm('Ovi');
        this.combat.cleanupAfterCombat();
    }

    private killTamaniChoice(): void {
        this.clearOutput();
        this.outputText("Tamani has really gotten to your nerves and you tire of her forcing herself upon you. You kick Tamani once and she writhes in pain. \"<i>Guess you don't want me anymore?</i>\" Tamani sniffles.");
        this.outputText("");
        this.menu();
        if (this.silly()) {
            this.addButton(0, "FIGHT", this.killTamani);
            this.addButton(1, "MERCY", this.spareTamani);
        }
        else {
            this.addButton(0, "Kill Her", this.killTamani);
            this.addButton(1, "Spare Her", this.spareTamani);
        }
    }

    private killTamani(): void {
        this.clearOutput();
        this.outputText("You step over and grab her head. \"<i>NO!</i>\" Tamani cries out. You tell her that she shouldn't have forced herself upon you. You snap her neck and set her lifeless body on the ground.");
        this.flags[kFLAGS.TAMANI_BAD_ENDED] = 1;
        this.postTamaniRemoval();
    }
    private spareTamani(): void {
        this.clearOutput();
        this.outputText("You tell her that should she ever cross paths again, she's going to have a really bad time. \"<i>Yes...</i>\" Tamani sniffles, tears welling up in her face. She gets up and leaves her satchel on the ground before running into the foliage, never to be seen again.\n\n");
        this.flags[kFLAGS.TAMANI_BAD_ENDED] = 0.5;
        this.postTamaniRemoval();
    }
    private postTamaniRemoval(): void {
        this.outputText(this.images.showImage("tamani-satchel"));
        this.outputText("With Tamani no more, you take her satchel and return to your camp.");
        this.monster.XP += 100; // Gain more XP as Tamani's removed from the game.
        this.player.createKeyItem("Tamani's Satchel", 2, 1, 1, 100);
        if (this.pregnancy.isPregnant) this.pregnancy.knockUpForce(); // Clear pregnancy.
        this.combat.cleanupAfterCombat();
    }

    // Butts McGee Facesitting Tamaniz
    private preferTamaniFemdom(): void {
        this.clearOutput();
        // Tamani Facesit
        // ===========Tamani============
        // ((Female PC has a third option when they encounter Tamani, labeled 'Like girls' if this is implemented; it gets them the following text.))
        this.outputText("\"<i>You're into girls, huh?</i>\" Tamani laughs, turning around and giving her fat butt a playful swat.  You watch as she does it a second time, laughing more at you than <i>with</i> you now, and then turns back around.  \"<i>Tell you what then, slut! I've had crap luck today finding a good stud, so I'll make you a deal.</i>\"");
        this.outputText("\n\nTamani advances closer, staring you straight in the eye with an impish smirk.  \"<i>I'll let you get me off if you swear to stay away from </i>my<i> cocks. Deal?</i>\"");
        this.menu();
        this.addButton(0, "Accept", this.acceptTamaniFacesits);
        this.addButton(1, "Refuse", this.declineZeFacesits);
    }
    // (("Refuse" choice))
    private declineZeFacesits(): void {
        this.clearOutput();
        this.outputText("You tell her you're not interested.");
        this.outputText("\n\nThe curvy goblin kicks you with a snarl, making you instinctively grab at one [leg] and hop around on the other - until she kicks it too, knocking you down.  \"<i>Fine, bitch. Have it your way. But if I find you taking <b>my</b> cocks again, you're going to be in trouble!</i>\"  She darts off before you can get a word in edgewise, leaving you alone.");
        // ((Needs non-leg and centaur equivalents))
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // (("Accept" choice))
    private acceptTamaniFacesits(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("tamani-fuck"));
        this.outputText("You eye the goblin's wide hips again before you nod, anticipating the idea.");
        this.outputText("\n\nTamani's impish smirk blooms into a wide grin, and the little goblin gently shoves you.  \"<i>Lay down, then!</i>\" she tells you.  You decide to comply, reaching for your [armor] - but she stops your hand.  \"<i>No need to strip, skank. Just lay down,</i>\" she tells you, pushing again.  You shrug and comply with her request, finding a comfortable spot on the ground to lay on, and then look over at her.");
        this.outputText("\n\nShe's pulled a vial off of one of the straps of fabric draped over her body and uncorked it; she empties the vial's purple-hued contents into a hand, not even looking at you, and then smears them all over her pussy.  The goblin gives a lusty moan as her fingers dig in, jilling herself as her knees shake, and a heat starts to build between your legs as you watch her getting off.  Just as your hands are about to creep south for a little self-pleasuring of your own, Tamani starts to walk over to you, her engorged, green cunt dripping with her juices, rather than the fluid she just rubbed all over it.");
        this.outputText("\n\n\"<i>A little insurance.</i>\"  Tamani explains.  \"<i>I know </i>you're<i> going to enjoy getting me off, skank. I want to make sure I'll enjoy it just as much,</i>\"  She swings a leg over your head, one to either side of your neck - and then slowly sits down.  \"<i>Here we go~</i>\" she coos, sing-song.");
        this.outputText("\n\nYour field of view is already dominated by her giant green butt, the thick globes of her ass-cheeks jiggling as she lowers herself down - and her pussy drips all over your mouth, the little green whore using the fluids to line herself up.  There's a sudden rush of air as her butt drops the rest of the way all at once, her hips dropping straight down onto your [face], and her pussy lips mash against your mouth in a perverse, sloppy 'kiss'.");
        this.outputText("\n\nYour nose ends up jammed somewhere between her cheeks, tainting your every breath with the scent of goblin butt, and the juicy haunches of her backside block most of your view, most of the light you can see coming from the crack between them.  \"<i>Lick me, cunt!</i>\" she yells, grinding her hips left-to-right and rubbing her wet snatch against you in the process.");
        this.outputText("\n\nYou try to breathe - but find it difficult, most of your breath being blocked out by plump goblin ass, and so you reach your hands up and move the squishy cheeks, your tongue darting out as you breathe.  You run your tongue up and down along the goblin's gash, enjoying the weird, slightly-creamy taste of her juices, and she lets out a short moan.  \"<i>Come on, you can do better than that!</i>\"  She grabs your hands, then bounces up, bringing her gash smacking back down against your tongue - which slips between her outer lips.");
        this.outputText("\n\n\"<i>Fuck yeah!</i>\" she yells, bouncing on top of your [face] and smothering you with 50 pounds of dripping goblin pussy and ass.  Your tongue dips in and out of her honey pot, and you try your best to slather her walls and her lips with attention whenever they're within reach, drawing more and more juices out of the lusty bitch.  \"<i>Yeah, f-f-fuck, keep licking!</i>\"  You consider reaching up to grab her butt and <i>hold</i> her against your [face], but her constant bouncing keeps your efforts to move your hands from amounting to too much.");
        this.outputText("\n\nInstead she stops on her own, grinding her snatch against you instead, and her soppy cunt smears its juices all over your mouth as she rubs it back and forth, using your [face] like some kind of living sex toy before stopping with her cunt over your mouth.  \"<i>Get your tongue in there!</i>\" She playfully orders you, leaning forward and freeing a bit of your view from the thick green asscheeks.");
        this.outputText("\n\nIt takes all you have to not let out a frustrated 'finally' as the goblin settles down long enough for you to actually try to get her off, but you manage to slip your tongue deep between her folds instead.  You lick and lap at the inside of her tunnel, letting out a few hushed moans and sighs as your own cunt drips far below, and her juices keep flowing out in reward.  The slutty goblin herself 'helps' things along by constantly rubbing her breasts and moaning, and you keep licking away at her insides.");
        this.outputText("\n\nGetting an idea, you slip one hand around to her front and one towards her big ass - and attack her from both angles at once as you curl your tongue around inside of her, forcing its tip against her walls as you swirl it around and around in circles.  Your right hand reaches out and grabs the goblin's engorged clit, forcing a shrill cry of pleasure out of her whorish lips, and your left slips a pair of fingers between the cunt's cheeks, piercing her asshole.");
        this.outputText("\n\n\"<i>O-oh f-fuck!</i>\" she cries, cheeks clenching down on your hand - but you're not having any of that.  You pinch her clit and give it a little twist, making her hips jump forward as her legs try to close in front of her - and then quickly fingerfuck her asshole, stopping that movement with the sudden shock.  Back and forth you pleasure her, licking her sloppy cunt all the while, and she bucks atop you, crying out in pleasure.");
        this.outputText("\n\n\"<i>F-fuck yeah, fuck yeah, ye-he-he-hehhsss!</i>\" she screams, pinching and twisting her nipples.  Her hips move so that her lips are pushed at an awkward angle against your mouth and searching tongue - and you manage to snake it into rubbing against a weird-feeling little spot inside of her.  Instantly, her entire body seizes up as you lick what has to be a sensitive spot in her green twat, and you abuse the advantage by assaulting it with your tongue.");

        this.outputText("\n\nThe movements of her bucking hips and fat ass stop, instead replaced by a full-body shivering as you finger her ass and molest her clit on top of everything else, and she tries to speak again.  \"<i>F-f-f... ff-... f-f-f-f...</i>\"  All she manages to do is let out high-pitched, half-squealing little 'fffff' sounds, like she's trying to swear over and over and failing just as often, and then you pinch her clit one more time.");
        this.outputText("\n\n\"<i>FFFFFFFNNNNNnnnnnnnn!</i>\" the green whore cries out, her thighs clamping down on the sides of your head like a vice.  Her asshole grips down on your invading fingers, holding them in place, and her pussy undulates around your tongue like a living thing, more and more of her juices gushing out as the little slut comes <b>hard</b> before she just... goes limp.");
        this.outputText("\n\nYou withdraw your fingers from her ass and let go of her clit, and the little green fuck-doll topples over, falling into the dirt and muttering something incoherently. You sit up and look, admiring the sight of her fat green ass sticking up in the air with her juices still dripping down her thighs, and decide to walk away from the clearly unconscious goblin.");
        this.dynStats("lus", 20 + this.player.lib / 20);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public openTamanisSatchel(): void {
        this.clearOutput();
        let isEmpty: boolean = true;
        this.outputText("You open the satchel taken from Tamani and take a look inside. ");
        if (this.player.hasKeyItem("Deluxe Dildo") < 0) {
            this.outputText(this.images.showImage("item-dDildo"));
            this.outputText("\n\n<b>(You find a well-crafted pink dildo inside! There are also other stuff you can take if you like.)</b>");
            this.player.createKeyItem("Deluxe Dildo", 0, 0, 0, 0);
        }
        this.menu();
        if (this.player.keyItemv1("Tamani's Satchel") > 0) {
            this.outputText(this.images.showImage("item-reducto"));
            this.outputText("\nThere " + (this.player.keyItemv1("Tamani's Satchel") == 1 ? "is a container" : "are two containers") + " of pasty substance labelled as 'Reducto'.");
            this.addButton(0, this.consumables.REDUCTO.shortName, this.satchelTakeItem, this.consumables.REDUCTO, 1);
            isEmpty = false;
        }
        if (this.player.keyItemv2("Tamani's Satchel") > 0) {
            this.outputText(this.images.showImage("item-dye"));
            this.outputText("\nThere's a bottle of pink hair dye inside.");
            this.addButton(1, this.consumables.PINKDYE.shortName, this.satchelTakeItem, this.consumables.PINKDYE, 2);
            isEmpty = false;
        }
        if (this.player.keyItemv3("Tamani's Satchel") > 0) {
            this.outputText(this.images.showImage("item-lDraft"));
            this.outputText("\nThere " + (this.player.keyItemv3("Tamani's Satchel") == 1 ? "is a bottle" : "are two bottles") + " of pink fluid, labelled 'Lust Draft'.");
            this.addButton(2, this.consumables.L_DRAFT.shortName, this.satchelTakeItem, this.consumables.L_DRAFT, 3);
            isEmpty = false;
        }
        if (this.player.keyItemv4("Tamani's Satchel") > 0) {
            this.outputText(this.images.showImage("item-gems"));
            this.outputText("\nThere are 100 gems inside within the satchel. You can take them if you want.");
            this.addButton(3, "Gems", this.satchelTakeGems);
            isEmpty = false;
        }
        this.outputText("\n\n");
        this.addButton(14, "Close", this.inventory.checkKeyItems, false);
        if (isEmpty) {
            this.clearOutput();
            this.outputText("The satchel is devoid of its content. You discard the empty satchel.");
            this.player.removeKeyItem("Tamani's Satchel");
            this.doNext(this.inventory.checkKeyItems);
        }
    }
    private satchelTakeItem(item: ItemType, keyValue: number): void {
        this.player.addKeyValue("Tamani's Satchel", keyValue, -1);
        this.inventory.takeItem(item, this.openTamanisSatchel);
    }
    private satchelTakeGems(): void {
        this.player.gems += 100;
        this.player.addKeyValue("Tamani's Satchel", 4, -100);
        this.statScreenRefresh();
        this.openTamanisSatchel();
    }

}
