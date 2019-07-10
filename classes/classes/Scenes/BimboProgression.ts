import { BaseContent } from "../BaseContent";
import { PerkLib } from "../PerkLib";
import { UndergarmentLib } from "../Items/UndergarmentLib";
import { kFLAGS } from "../GlobalFlags/kFLAGS";
import { rand } from "../Extra";
import { debug } from "console";
import { Vagina } from "../Vagina";
import { StatusEffects } from "../StatusEffects";

export class BimboProgression extends BaseContent {

    public ableToProgress(): boolean {
        if ((this.player.findPerk(PerkLib.BimboBrains) >= 0) && (this.player.findPerk(PerkLib.BimboBody) >= 0)) return false;
        if (this.player.lowerGarment != UndergarmentLib.NOTHING) return false;
        if (this.player.armorName == "bimbo skirt" && this.flags[kFLAGS.BIMBO_MINISKIRT_PROGRESS_DISABLED] == 0) return true;
        return false;
    }

    public readyToProgress(): boolean {
        if (this.player.lowerGarment != UndergarmentLib.NOTHING) return false;

        if (this.player.lust >= this.player.maxLust()) return true;
        if (this.flags[kFLAGS.TIMES_ORGASM_VAGINAL] > 25 || this.flags[kFLAGS.TIMES_ORGASM_TITS] > 25 || this.flags[kFLAGS.TIMES_ORGASM_ANAL] > 25 || this.flags[kFLAGS.TIMES_ORGASM_LIPS] > 25) {
            if (rand(2) == 0) return true;
        }
        if (this.flags[kFLAGS.TIMES_ORGASM_VAGINAL] > 15 || this.flags[kFLAGS.TIMES_ORGASM_TITS] > 15 || this.flags[kFLAGS.TIMES_ORGASM_ANAL] > 15 || this.flags[kFLAGS.TIMES_ORGASM_LIPS] > 15) {
            if (rand(4) == 0) return true;
        }
        if (rand(10) == 0) return true;
        return false;
    }

    private debugProgress(): void {
        this.clearOutput();

        this.outputText("<b>Bimbo score:</b> " + Math.round(this.player.bimboScore() * 10) + "\n");
        if (this.flags[kFLAGS.TIMES_ORGASM_DICK] > 0) this.outputText("  <i>Dick tension:</i> " + this.flags[kFLAGS.TIMES_ORGASM_DICK] + "\n");
        if (this.flags[kFLAGS.TIMES_ORGASM_ANAL] > 0) this.outputText("  <i>Butt tension:</i> " + this.flags[kFLAGS.TIMES_ORGASM_ANAL] + "\n");
        if (this.flags[kFLAGS.TIMES_ORGASM_VAGINAL] > 0) this.outputText("  <i>Pussy tension:</i> " + this.flags[kFLAGS.TIMES_ORGASM_VAGINAL] + "\n");
        if (this.flags[kFLAGS.TIMES_ORGASM_LIPS] > 0) this.outputText("  <i>Lips tension:</i> " + this.flags[kFLAGS.TIMES_ORGASM_LIPS] + "\n");
        if (this.flags[kFLAGS.TIMES_ORGASM_TITS] > 0) this.outputText("  <i>Tits tension:</i> " + this.flags[kFLAGS.TIMES_ORGASM_TITS] + "\n");
        this.outputText("Anal craving: " + this.analCraving() + "\n");
        this.outputText("Lip craving: " + this.lipCraving() + "\n");
        this.outputText("Minimal lust: " + this.flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST] + "\n");
        this.outputText("\n");

        this.outputText("<b>Face</b>: " + this.player.faceDesc() + ", femininity " + this.player.femininity + "\n");
        this.outputText("<b>Tone</b>: " + this.player.tone + "\n");
        this.outputText("<b>Hair</b>: length " + Math.round(this.player.hair.length) + ", " + this.player.hairDescript() + "\n");
        this.outputText("<b>Tits</b>: " + this.player.breastDescript(0) + ", size: " + this.player.breastRows[0].breastRating + " (" + this.player.breastCup(0) + ") with " + this.player.nippleDescript(0) + " of size " + this.player.nippleLength + "\n");
        if (this.player.isLactating()) this.outputText("<b>Lactation</b>: " + this.player.lactationQ() + ", biggest: " + this.player.biggestLactation() + "\n");
        this.outputText("<b>Ass</b>: " + this.player.assDescript() + ", size: " + this.player.butt.rating + ", looseness: " + Math.round(this.player.ass.analLooseness) + ", capacity: " + Math.round(this.player.analCapacity()) + "\n");
        this.outputText("<b>Hips</b>: " + this.player.hipDescript() + ", size: " + this.player.hips.rating + "\n");
        if (this.player.hasCock()) this.outputText("<b>Cock</b>: " + this.player.cockDescript() + ", length " + this.player.cocks[0].cockLength + "\n");
        if (this.player.hasVagina()) {
            this.outputText("<b>Vagina</b>: " + this.player.vaginaDescript() + ", looseness: " + Math.round(this.player.looseness()) + ", capacity: " + Math.round(this.player.vaginalCapacity()) + ", wetness: " + this.player.wetness() + "\n");
        }

        this.menu();

        this.addButton(1, "Vaginal", this.vaginalRelieve);
        this.addButton(2, "Tits", this.titsRelieve);
        this.addButton(3, "Anal", this.analRelieve);
        this.addButton(0, "Lips", this.lipRelieve);
        this.addButton(4, "Dick", this.debimbifyMe);
        this.addButton(5, "Bimbify", this.bimbifyMe);
        this.addButton(6, "Leave", this.camp.returnToCampUseOneHour);

    }

    public toggleProgress(): void {
        this.flags[kFLAGS.BIMBO_MINISKIRT_PROGRESS_DISABLED] ^= 1;
        this.getGame().inventory.inventoryMenu();
    }

    public bimboDoProgress(): boolean {

        if (debug) {
            this.debugProgress();
            return true;
        }
        let state: number = 0;
        let choices: any[] = new Array();
        let bra: boolean = (this.player.upperGarment != UndergarmentLib.NOTHING);

        // Add human numbers to choices
        this.temp = 5 - this.bimboRating();
        while (this.temp > 0) {
            choices[choices.length] = 0;
            this.temp--;
        }
        this.temp = this.flags[kFLAGS.TIMES_ORGASM_VAGINAL];
        while (this.temp > 0) {
            choices[choices.length] = 1;
            this.temp--;
        }
        if (!bra) {
            this.temp = this.flags[kFLAGS.TIMES_ORGASM_TITS];
            while (this.temp > 0) {
                choices[choices.length] = 2;
                this.temp--;
            }
        }
        this.temp = this.flags[kFLAGS.TIMES_ORGASM_ANAL];
        while (this.temp > 0) {
            choices[choices.length] = 3;
            this.temp--;
        }
        this.temp = this.flags[kFLAGS.TIMES_ORGASM_LIPS];
        while (this.temp > 0) {
            choices[choices.length] = 4;
            this.temp--;
        }
        this.temp = this.flags[kFLAGS.TIMES_ORGASM_DICK];
        while (this.temp > 0) {
            choices[choices.length] = 5;
            this.temp--;
        }
        state = choices[rand(choices.length)];

        let needNext: boolean = false;

        if (state == 1) {
            needNext = this.vaginalRelieve();
        }
        else if (state == 2 && !bra) {
            needNext = this.titsRelieve();
        }
        else if (state == 3) {
            needNext = this.analRelieve();
        }
        else if (state == 4) {
            needNext = this.lipRelieve();
        }
        else if (state == 5) {
            this.debimbifyMe();
        }

        return needNext;

    }

    // -----------------------------------

    public vaginalRelieve(): boolean {

        this.outputText("\n");
        if (this.flags[kFLAGS.TIMES_ORGASM_VAGINAL] > 10) {
            if (rand(2) == 0) this.getGame().dynStats("lus", rand(30) + rand(this.player.sens));
            else this.getGame().dynStats("lus", rand(30) + rand(this.player.lib));
        }
        else this.getGame().dynStats("lus", rand(20) + rand(this.player.sens / 2));
        if (this.flags[kFLAGS.TIMES_ORGASM_VAGINAL] > 0) this.flags[kFLAGS.TIMES_ORGASM_VAGINAL]--;

        if (!this.player.hasVagina()) {

            this.outputText("Your mind wanders, you keep thinking about pussies. ");
            if (this.player.hasCock()) {
                this.outputText("You feel your [cock] becomes erect under your obscene skirt, bulging unnaturally. ");
            }
            this.outputText("Sensation of the gentle fabric of your slutty outfit against your [butt] arouses you even more. ");
        }
        else {

            this.outputText("Your mind wanders off recalling your recent hussles. ");

            switch (this.player.vaginas[0].vaginalWetness) {
                case Vagina.WETNESS_DROOLING:
                    this.outputText("Juices constantly escape your [pussy] and spoil your sexy skirt. You feel an immense desire to spread lips of your [pussy] and just wait there to be fucked. ");
                    break;
                case Vagina.WETNESS_SLICK:
                    this.outputText("Aroused, you feel how thin stream of girl-cum escapes your [pussy]. Blood runs to your head, you flush as sweet pulsations make it difficult to think of anything but sex. ");
                    break;
                case Vagina.WETNESS_WET:
                    this.outputText("Your [pussy] becomes all tingly and wet under your slutty skirt, as sweet pulsations inside you make it hard to think of anything but pleasure. ");
                    break;
                case Vagina.WETNESS_NORMAL:
                    this.outputText("You feel arousal quickly spread over your groin, as your [pussy] becomes slightly wet. ");
                    break;
                case Vagina.WETNESS_DRY:
                default:
                    this.outputText("You feel how your groin become warm from arousal. ");
                    break;
            }

        }
        if (this.player.lust >= this.player.maxLust()) {

            this.vaginalOrgasm();
            return true;
        }
        else {
            this.outputText("You make deep breaths, struggling to keep your mind straight. Finally, your lust subside, and you resume your journey.\n\n");
            return false;
        }
    }

    public vaginalOrgasm(): void {

        let removeCock: boolean = false;
        let titPlay: boolean = false;
        let useDildo: number = 0;

        if (rand(2) == 0) titPlay = true;

        this.getGame().dynStats("lib", 1, "sen", 2);

        if (this.player.hasCock() && rand(2) == 0) removeCock = true;

        if (this.player.hasVagina()) {

            this.outputText("Without a second thought you reach under your skirt and start stroking your [pussy]. All resistance fades into nothing and you give in to your lust.\n\n");

            if (titPlay) {

                if (this.player.biggestTitSize() > 3) {
                    this.getGame().masturbation.titForeplay();
                    if (rand(2) == 0) {
                        this.outputText(" Hot feeling from your " + this.player.allBreastsDescript() + " send a wave of pleasure down your spine, and you moan, feeling pulsation in your breasts and [pussy].\n\n");
                        this.player.orgasm('Tits');
                        if (this.player.biggestTitSize() < 12) this.player.growTits(0.5, 1, false, 3);
                        this.getGame().dynStats("cor", 0.2);
                    }
                }
                else {
                    this.outputText("You free your " + this.player.breastDescript(0) + " from the halter top of your dress and start pinching your [nipples]. Each tug resonates in your [clit], and each time the pleasure you experience becomes more and more intense. ");
                    if (this.player.biggestTitSize() < 1) {
                        this.outputText("As you fondle yourself, you start feeling how a tender flesh swells under your hands. ");
                        this.player.growTits(1, 1, false, 3);
                        this.getGame().dynStats("cor", 2);
                        this.player.orgasm('Tits');
                        this.outputText("Expanding " + this.player.breastDescript(0) + " send a wave of immense pleasure down your spine and your are unable to hold your moans, bathing in a waves of pure pleasure. ");
                    }
                    else {
                        this.outputText("You feel how sensation in your " + this.player.allBreastsDescript() + " and [vagina] overwhelms your mind, as a waves of pure pleasure runs up and down your spine. You moan loudly as a first wave of orgasm washes over you. ");
                        if (this.player.biggestTitSize() < 12) this.player.growTits(0.5, 1, false, 3);
                        this.getGame().dynStats("cor", 0.2);
                        this.player.orgasm('Tits');
                    }
                }

            }

            // Prelude
            if (this.player.lib < 45) this.outputText("You touch and play with your [vagina], ");
            else if (this.player.lib < 70) this.outputText("You slap your [pussy] softly, ");
            else this.outputText("You touch your enflamed and aroused [vagina], ");
            switch (this.player.vaginas[0].vaginalWetness) {
                case Vagina.WETNESS_DRY:
                    this.outputText("expertly arousing your female parts.  "); break;
                case Vagina.WETNESS_NORMAL:
                    this.outputText("sighing as it quickly becomes moist.  "); break;
                case Vagina.WETNESS_WET:
                    this.outputText("giggling as your fingers get a little wet.  "); break;
                case Vagina.WETNESS_SLICK:
                    this.outputText("smiling as your fingers become coated in your slick fluids.  "); break;
                case Vagina.WETNESS_DROOLING:
                    this.outputText("slicking your fingers in the juices that constantly dribble from " + this.player.vaginaDescript() + ". "); break;
                default:
                    this.outputText("licking your lips as a small spurt of fluid squirts from your nethers.");
            }
            this.outputText("You let your hand roam over your pussy-lips, slowly teasing yourself, diving deeper into your folds to arouse and expose your clit.\n\n");

            // Penetration
            if (this.player.hasKeyItem("Deluxe Dildo") >= 0) {

                this.outputText("You retrieve the floppy pink dildo from your possessions, shivering with the sexual thrill.   A drop of pink aphrodisiac leaks from the tip, offering you a hint of the pleasure you're in for. You make sure to catch it on your crotch, letting the fluid seep into your [pussy].");

                if (this.player.hasVirginVagina()) {

                    this.outputText(" You hesitate before moving it to your tender pussy lips. Your [pussy] trembles, awaiting what may happen very soon. You bring the dildo to your [vagina], realizing how large the object really is. It's not nearly as thin, short, and bendable as a finger. You bite your lip and tease pussy with your dildo, ");
                    if (rand(10) == 0 || (this.player.vaginas[0].vaginalWetness >= Vagina.WETNESS_DROOLING && rand(2) == 0)) {
                        this.outputText("pressing it harder and harder. You start moaning, your hands shaking, unable to think straight. Your well-lubricated [pussy] aches for it, and you give so much desired push. ");
                        this.player.cuntChange(8, true, true, true);
                        this.outputText(" You scream in pain and pleasure, as your [pussy] stretches, accommodating to a throbbing item inside. You take a deep breath, then push again, this time further. It becomes impossible to think of anything but wild urge in your [vagina].");
                        this.player.cuntChange(16, true, true, false);
                        this.getGame().dynStats("cor", 3);
                        useDildo = 2;
                        this.outputText("\n\n");
                    }
                    else {
                        this.outputText("feeling how the dildo expands in your hand, becomes harder and bigger. You bring it to your mouth and start sucking the dribbling pre-cum, at the same time trying to satisfy your desire by stroking you [clit].\n\n");
                        this.getGame().dynStats("cor", 0.2);
                        this.player.orgasm('Lips');
                    }
                }
                else {
                    this.outputText("  You don't hesitate before slowly working it inside you, gasping at the enhanced sensitivity of your [pussy].");
                    this.outputText("  You splay your [legs]  and lie there with it inside you, feeling it respond to your wetness, becoming more and more turned on by the second.\n\n");
                    useDildo = 2;
                }
            }
            else if (this.player.hasKeyItem("Dildo") >= 0) {

                if (this.player.hasVirginVagina()) {

                    if (rand(10) == 0 || (rand(2) == 0 && this.player.vaginas[0].vaginalWetness >= Vagina.WETNESS_DROOLING)) {
                        this.outputText("You blush nervously as you take your phallic toy form your possessions. The firm dildo bends slightly as you hold it in your hand. You begin to rub the length of the slender tube against your [vagina]. As you pick up the pace, moans begin to escape your lips.  Your [clit] fills with blood and twitches as the faux cock slides against it.  You tenderly caress your [chest] with your other hand, becoming more breathy as you do so. ");
                        this.outputText("\n\nSwallowing, you lean back and position the dildo toward your [vagina], the entrance twitching as it yearns for penetration. With an experimental push, you prod at the hole, jumping at the realization of how large the object really is. It's not nearly as thin, short, and bendable as a finger. You bite your lip and press the toy into you. The pain of your splitting hymen shoots through you. You gasp, easing the pressure on the toy, letting it sink one more inch before letting go altogether.");
                        this.player.cuntChange(8, true, true, false);
                        this.getGame().dynStats("cor", 3);
                        this.outputText("\n\nBreathing heavily, you slowly pull the invasive, fake phallus from your stinging vagina. A light stain of blood now coats the first several inches of the dildo. Taking a deep breath, you push the toy back in, this time feeling less pain. The worst of the experience behind you, you gently pump in and out. Your once pure pussy is now accepting the intruder deeply. Your speed increases as you get used to it. Breathing heavier in between moans, you thrust your cherry-picker in towards unforeseen ecstasy. The tears in your eyes, accumulated from pain, well up even larger in pleasure.\n\n");
                        useDildo = 1;

                    }

                }
                else {
                    this.outputText("You retrieve the phallic toy from your possessions and suck it to lubricate properly. Your [vagina] becomes slick with your juices in moments and you eagerly delve a finger into the thirsty hole. The digit goes in slowly and deeply, pleasuring your inner walls with tender stimulation. Your muscles begin to relax, and you feel ready to move onto the main event. Removing the saliva-slicked toy from your mouth, you trade it with your finger. The satisfying easing of the dildo into your nethers is matched by your feminine flavor pushing across your tongue. Muffled moans escape your plugged maw as the beloved toy sinks deep into your [vagina]. Using your free hand, you grope and caress your [chest].\n\n");
                    this.player.cuntChange(8, true, true, false);
                    this.getGame().dynStats("cor", 0.2);
                    useDildo = 1;
                }
            }

            // Work up
            if (useDildo > 0) {

                if (rand(2) == 0 && this.player.hips.rating < 12) {
                    this.outputText("Using one hand to piston the imitation cock in your [vagina] and the other to massage around your [clit], the stimulation becomes almost unbearable. You can't help but grind your [hips] and slide slowly onto your back. Your moans becoming louder and more intense while vaginal juices drip down your buttcheeks. You push dildo faster and deeper, crying from immense pleasure it brings you, and feeling how your hips are feeling wider than before.");
                    this.player.hips.rating++;
                    this.player.cuntChange(8 + 0.75 * this.player.vaginalCapacity(), true, false, false);
                    this.getGame().dynStats("cor", 0.5);
                    this.outputText("\n\n");
                }
                if (rand(2) == 0 && this.player.butt.rating < 12) {
                    this.outputText("You thrust your toy inside, deeper and deeper, faster and faster, feeling how your [ass] is bouncing in rhythm with your motions. You feel how it blossoms, becomes more sensitive and seductive, as you pump your insatiable [pussy]. ");
                    this.player.butt.rating++;
                    this.outputText("You get on your knees, slower your pace, but start to thrust the dildo in your pussy much more vigorously, making loud moans every time the phallos enters you pussy, forcing it even deeper and harder inside, and feeling your [ass] shakes with every thrust.");
                    this.player.cuntChange(8 + 0.75 * this.player.vaginalCapacity(), true, false, false);
                    this.getGame().dynStats("cor", 0.5);
                    this.outputText("\n\n");
                }
            }
            else {

                if (rand(3) == 0 && this.player.hips.rating < 12) {
                    this.outputText("You stroke your clit vigorously, spreading your [legs] widely. You put one sticky finger inside, then second finger and start rubbing the walls of your [pussy], moaning from building extasy. You try to give your hand even better access to your pussy hole, and feel how your [hips] become even wider than before. ");
                    this.getGame().dynStats("cor", 0.5);
                    this.player.hips.rating++;
                }
                if (rand(3) == 0 && this.player.butt.rating < 12) {
                    this.outputText("You focus your attention on your clit, while the other hand start caressing your [ass]. Your [asshole] is wet from your pussy juices, and as your finger easily slips inside, you let a shriek. Your [ass] feels so warm and sexy, you almost feel how it becomes even softer than it was before. ");
                    this.getGame().dynStats("cor", 0.5);
                    this.player.butt.rating++;
                }

            }

            // Orgasm
            if (useDildo == 1) {
                this.outputText("Soon the pleasure is rising up into unstoppable tide of phallus-induced ecstasy, and you slide from against the rock to on your side, still fucking yourself with blissful joy. The constant thrusting of the toy begins to make you shake and lose rhythm, your body wanting only to fuck as hard and fast as possible.");
                this.outputText("\n\nIt arrives with supreme relief as you force the dildo to your furthest depths. ");
                this.player.cuntChange(16, true, false, true);
            }
            else if (useDildo == 2) {
                if (this.player.vaginas[0].vaginalWetness < Vagina.WETNESS_SLICK)
                    this.outputText("The thickness of the toy gradually increases, filling you more and more effectively as it reacts to your bodily fluids.  You grab it two-handed and start slamming it into your [pussy], vigorously fucking yourself with the swelling dong.  The sensations just keep getting better and better as more and more of the goblin's sex-drug leaks into you. Even your [clit] and cunt-lips tingle with need. You answer that need by picking up the pace, pistoning faster and faster.\n\n");
                else if (this.player.vaginas[0].vaginalWetness < Vagina.WETNESS_SLAVERING) {
                    this.outputText("The toy's girth seems to pulse and swell within you, spreading you wide open as it sops up your natural wetness and grows larger.  You grab it in a two-handed grip and begin working it in and out of your [pussy], gasping and twitching as every ridge and feature of the dildo rubs you just right.  Every inch of your nethers tingles with a desire to be touched, rubbed, and squeezed. ");
                    this.outputText("You answer that need by pistoning the fat juicy dick even harder into your tightly stretched box, cooing as tiny squirts of fluid erupt with every thrust.\n\n");
                }
                else {
                    this.outputText("You can feel the dildo growing inside you, reacting to gushing feminine fluids by stretching your [pussy] wide.  It doesn't seem to stop when you start fucking yourself with it.  If anything, it only seems to get thicker and thicker until there is barely room for your juices to squirt around it and your hips feel sore.  However, the tingling hotness of the dildo's aphrodisiac cum overwhelms the discomfort of the fattening fuck-tool, and you work it harder and harder, reveling in being stretched beyond your normal capacity.\n\n");
                }
                this.outputText("Brutalizing your stretched fuck-hole with the bloated toy, you manage to get yourself off.   Your body quakes and spasms while your [hips] buck into the air, fucking an imaginary lover.  The dildo sinks into your core, your arms instinctively fulfilling your desire for complete penetration.  A warm wetness suddenly soaks your womb as the fuck-stick erupts, filling you.  Just like that the orgasm you had seems like foreplay.  Your eyes roll back into your head and you begin convulsing, practically having a pleasure-seizure from the drugs and your already oversensitive twat.");
                this.player.cuntChange(this.player.vaginalCapacity() * 0.9, true);
                this.getGame().dynStats("cor", 0.2);
            }
            else {
                this.outputText("Your [pussy] quivers as the pleasure overwhelms you, robbing you of muscle control, your passage rippling and contracting around your fingers.");
            }

            // Liquids

            if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_SLAVERING && useDildo > 0) {
                this.outputText(" Your [pussy] gushes fluids down your leg as you cry in a mind-shattering orgasm. You sprawl there, wiggling and cumming your brains out for what feels like an eternity.\n");
                this.flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST]++;
                if (this.player.inte > 5) this.getGame().dynStats("int", -1);
                this.getGame().dynStats("cor", 0.2);
            }
            else if (this.player.vaginas[0].vaginalWetness >= Vagina.WETNESS_DROOLING) {
                this.outputText(" Your cry in a mind blowing orgasm, squirting copious fluids over yourself and the ground.  The fluids quickly disappear into the dirt.\n");
                this.flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST]++;
                this.getGame().dynStats("cor", 0.2);
            }
            else if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_SLICK) {
                this.outputText(" You feel a trickle of your pussy juice down your leg, as you moan in a powerful orgasm.\n");
            }
            else if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_WET) {
                this.outputText(" You let a final shriek as pleasure rises its peak, moisture of your [pussy] all over your hands.\n");
            }
            else if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_NORMAL) {
                this.outputText(" You moan reaching a powerful orgasm, wet lips of your [pussy] clenching.\n");
            }
            else {
                this.outputText(" You make a loud moan as you finally reach an orgasm.\n");
            }
            if (rand(3) == 0) {
                this.temp = this.player.vaginas.length;
                while (this.temp > 0) {
                    this.temp--;
                    if (this.player.vaginas[0].vaginalWetness < Vagina.WETNESS_SLAVERING) this.player.vaginas[this.temp].vaginalWetness++;
                }
            }

        }
        else if (this.player.hasCock()) {

            this.outputText("You try to calm down, and make a deep breath, but as you exhale you make a soft moan, and feel your hand on your [cock].");

            this.outputText("\n\nYou start gently caressing your " + this.player.cockDescript(0) + " your mind fixated on images of pussies you've encountered in your journey. You imagine opening slicky pussy lips, wet with sweet girl-cum. As you stroke your [cock], you imagine licking soft pink clit, so small compared to your large member, but somehow so much prettier and enjoyable. You think of what pleasures you would have if you had that soft womanhood, and the idea drives you into frenzy.");

            if (rand(4) == 0 && this.player.hips.rating < 12) {
                this.outputText("\n\nYou close your eyes and pant hard, feeling sensation of warmth spread over your hips. With your other hand you start caressing your [hips]. You need big hips, or cocks would not fit inside. Your mind stumbles processing this idea, but your hand don't stop. The sensation of expanding flesh makes you gulp with a thrill, as you rhythmically rock your [hips] back and forth, entranced by obsession with pussies.");
                this.player.hips.rating += 0.5;
                this.getGame().dynStats("cor", 0.5);
            }
            if (rand(4) == 0 && this.player.butt.rating < 12) {
                this.outputText("\n\nYou fill folds of your sluttish skirt on your [ass], and your mind starts to fantasize about filling pussy from behind. You imagine bloated and soft ass, bouncing with every movement, and you almost feel the jiggling flesh as you rhythmically shake your [hips]. You imagine being taken from behind, and close your eyes in immense pleasure.");
                this.player.butt.rating += 0.5;
                this.getGame().dynStats("cor", 0.5);
            }
            if (removeCock) {
                this.outputText("\n\nSuddenly you feel itching just under your [cock]. For a moment you start thinking that your dream became true and new pussy blossomed between your legs. You cry out in orgasm, feeling how your [cock] starts to ooze a cum. You lay, shuddering and broken, feeling how your lustful mind tricked you.\n");
                this.getGame().dynStats("cor", 1);
            }
            else {
                this.outputText("\n\nFinally, you reach a high point and cry, as your [cock] starts to ooze a cum.\n");

            }
            if (rand(4) == 0) this.flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST]++;

            if (removeCock) this.shrinkCock();

        }
        else {
            this.outputText("You try to calm down, and make a deep breath, but as you exhale you make a soft moan, and feel your hand on your crotch.");
            this.growVagina();
        }

        if (titPlay && rand(2) == 0 && this.player.biggestLactation() >= 2) {
            this.outputText("\nWith your mind numb, your hands raise up to your " + this.player.breastDescript(0) + " as your body is shaken by waves of pleasure. ");
            this.getGame().masturbation.titCum();
            this.getGame().masturbation.titDrink();
        }

        this.player.orgasm('Vaginal');

        if (this.player.hasCock() || rand(3) == 0) this.outputText(this.player.modFem(this.player.hasCock() ? 80 : 100, 4));

        this.bimbifyMe();
        this.postOrgasm();
    }

    public titsRelieve(): boolean {
        this.outputText("\n");
        if (this.flags[kFLAGS.TIMES_ORGASM_TITS] > 10) {
            if (rand(2) == 0) this.getGame().dynStats("lus", rand(30) + rand(this.player.sens));
            else this.getGame().dynStats("lus", rand(30) + rand(this.player.lib));
        }
        else this.getGame().dynStats("lus", rand(20) + rand(this.player.sens / 2));
        if (this.flags[kFLAGS.TIMES_ORGASM_TITS] > 0) this.flags[kFLAGS.TIMES_ORGASM_TITS]--;

        if (this.player.biggestTitSize() >= 8) {
            this.outputText("Your mind wanders off recalling your recent hussles. You gently stroke your " + this.player.breastDescript(0) + ", thinking about all the way you could use them to satisfy the needs of all the monsters and demons you encountered. You think about hugging monstrous cocks with your tits, squeezing the precious cum. You feel how your erect [nipples] protrude from the soft fabric of you beautiful dress, and sensation make you feel slightly dizzy. ");
            if (this.player.isLactating()) {
                this.outputText("You feel how the snug top your dress become wet, as droplets of milk sip from your [nipples]. ");
            }
        }
        else if (this.player.biggestTitSize() >= 5) {
            this.outputText("Your mind wanders off, thinking of all kinds of monsters you encounter in this corrupted lands. You think of imps and minotaurs, about their throbbing members, and start stroking your " + this.player.breastDescript(0) + ". You imagine them cuming on your tits, and you imagine their corrupted seed spoils your " + this.player.breastDescript(0) + ", make them even more sensitive then they are now. ");
            if (this.player.isLactating()) {
                this.outputText("You feel how the top your dress becomes wet, as droplets of milk sip from your [nipples]. ");
            }
        }
        else if (this.player.biggestTitSize() >= 2) {
            this.outputText("Your mind wanders off. You feel the weight of your " + this.player.breastDescript(0) + ", thinking of how sensitive they've become in these corrupted lands. Your sluttish outfit snugly embraces your " + this.player.breastDescript(0) + ", and your cheeks blush at a thought of how attractive it makes you. Sensation of a soft fabric on your bare [nipples] makes you feel warm and sexy. ");
            if (this.player.isLactating()) {
                this.outputText("You feel how the top your dress become wet, as droplets of milk sip from your [nipples]. ");
            }
        }
        else if (this.player.biggestTitSize() >= 1) {
            this.outputText("You feel how soft fabric of your dress caresses your " + this.player.breastDescript(0) + ". Sensation is very erotic and you touch your sensitive [nipples], feeling the spread of arousal. You idly notice that halter top of your whorish dress is loose, and it would feel much better if only your breasts would be bigger and suppler. ");
            if (this.player.isLactating()) {
                this.outputText("You feel how the top your dress become wet, as droplets of milk sip from your [nipples]. ");
            }
        }
        else {
            this.outputText("You feel how soft fabric of your dress touches your [nipples], making them erect. Lazily wondering, why you chose to put on this sluttish outfit, you touch your erect nipples, feeling how warmth spread in your " + this.player.breastDescript(0) + ". ");
        }

        if (this.player.lust >= this.player.maxLust()) {

            this.titsOrgasm();
            return true;

        }
        else {
            this.outputText("After a while you manage to control yourself and calm down a bit, but your still feel somewhat aroused.\n");
            return false;
        }

    }

    public titsOrgasm(): void {

        let titPlay: boolean = false;
        let growTits: boolean = false;
        let removeCock: boolean = false;
        let drinkTits: boolean = false;

        this.getGame().dynStats("lib", 2, "sen", 3);

        this.outputText("Carried away by erotic fantasies, you realize that it becomes impossible to stop touching yourself. You bite your lip, caressing your [nipples] with gentle strokes of your hands.\n\n");

        if (rand(2) == 0 && this.player.biggestTitSize() < 12) growTits = true;

        if (this.player.cocks.length > 0 && rand(3) == 0) removeCock = true;

        if (this.player.biggestTitSize() < 1) {
            this.outputText("You are fantasizing about cupping your tits, wanting them to be fuller. You are imagining succubi and goblin girls, how they may feel with all the the added weight on their chest.");
            // outputText("\nYou imagine becoming a slut with a luscious tits, ready to be fucked by anyone. You daydream of riding a monstrous cock, with tits swaying from side to side, and a soft moan escapes your mouth as you touch your areolas. ");
            if (growTits) {
                this.outputText(" As you fondle yourself, you start feeling a how tender flesh swells under your hands. With a blissful smile you realize that <b>you have A-cup breast now</b>, and this realization make you cum.\n\n");
                this.player.growTits(1, 1, false, 3);
                this.getGame().dynStats("cor", 2);
                this.flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST]++;
            }
            else {
                this.outputText(" In a desperate envy you start to feverishly pinch your [nipples], and finally you cum, panting.\n\n");
                removeCock = false;
            }
        }
        else if (this.player.biggestTitSize() < 2) {
            this.outputText("You grope your " + this.player.breastDescript(0) + ". They feel very sensitive and yet somehow supple. You are imagining succubi and goblin girls, and how they may feel with their boobs swaying from side to side, as they are fucked, and a soft moan escapes your mouth as you touch your areolas.");
            if (growTits) {
                this.outputText(" It’s almost impossible to pull your hands away, but you make do, if only so you can better view your burgeoning bosom as it grows. <b>Your titties are getting pretty big now!</b>  Moaning in excitement, you realize that one hand has reached back up to caress a sensitive nipple. You don’t try to stop it. Best of all, the sensations grow hotter and more potent moment by moment. Your legs curl as you feel a tide of mind-melting orgasm overcomes your resistance, and you shake in convulsions, feeling your hot and jiggly flesh under your palm.\n");
                this.player.growTits(1, 1, false, 3);
                this.getGame().dynStats("cor", 0.2);
            }
            else {
                this.outputText(" In a desperate envy you start to feverishly pinch your [nipples], and finally you cum, panting, your [nipples] sore.\n\n");
                removeCock = false;
            }
        }
        else {

            if (this.bimboRating() > 1) {
                this.outputText("Freeing your " + this.player.breastDescript(0) + " from the halter top of your beautiful dress, you start squeezing them aggressively, emitting loud moans of pleasure each time you flick one of your ");
            }
            else {
                this.outputText("You free your " + this.player.breastDescript(0) + " from confines of your sluttish outfit and start caressing them gently, emitting soft gasps of pleasure each time you flick one of your ");
            }
            if (this.player.biggestLactation() > 2) this.outputText("huge, swollen nipples. ");
            else if (this.player.biggestLactation() > 1) this.outputText("fat, puckered nipples. ");
            else this.outputText("erect nipples. ");

            if (this.player.biggestLactation() > 1 && this.player.biggestLactation() < 2)
                this.outputText("Droplets of milk dribble from each nipple, spattering milk onto your [legs] and crotch. ");
            else if (this.player.biggestLactation() >= 2 && this.player.biggestLactation() < 3)
                this.outputText("Thin squirts of milk spray from each nipple, spattering milk onto your [legs] and crotch. ");
            else if (this.player.biggestLactation() >= 3) this.outputText("A constant stream of milk drizzles from each teat, soaking your [legs] and crotch. ");

            if (growTits) {
                if (this.player.biggestTitSize() > 8) {
                    this.outputText("\n\nThe flesh under your palm feels good and... right, like it was molded to support the firm press of your digits, to feel every nook and cranny of your hand cup it and support it. There’s so much to hold on to, a marvelous new softness that can only be evidence of a perfectly swelling rack. <b>You feel the added milky and jiggling weight</b>, and throaty purr escapes your mouth as you give yourself over to the sensations. ");
                }
                else {
                    this.outputText("\n\nIt’s almost impossible to pull your hands away, but you make do, if only so you can better view your burgeoning bosom as it grows. <b>Your titties are getting pretty big now!</b>  Moaning in excitement, you realize that one hand has reached back up to tug a sensitive nipple. You don’t try to stop it. Best of all, the sensations grow hotter and more potent moment by moment. ");
                }

                this.player.growTits(1, 1, false, 3);
                this.getGame().dynStats("cor", 0.2);

                if (this.player.biggestTitSize() >= 8.5 && this.player.nippleLength < 2) {
                    this.outputText("A tender ache starts at your " + this.player.nippleDescript(0) + "s as they grow to match your burgeoning breast-flesh. ");
                    this.player.nippleLength = 2;
                }
                if (this.player.biggestTitSize() >= 7 && this.player.nippleLength < 1) {
                    this.outputText("A tender ache starts at your " + this.player.nippleDescript(0) + "s as they grow to match your burgeoning breast-flesh. ");
                    this.player.nippleLength = 1;
                }
                if (this.player.biggestTitSize() >= 5 && this.player.nippleLength < .75) {
                    this.outputText("A tender ache starts at your " + this.player.nippleDescript(0) + "s as they grow to match your burgeoning breast-flesh. ");
                    this.player.nippleLength = .75;
                }
                if (this.player.biggestTitSize() >= 3 && this.player.nippleLength < .5) {
                    this.outputText("A tender ache starts at your " + this.player.nippleDescript(0) + "s as they grow to match your blossoming breast-flesh. ");
                    this.player.nippleLength = .5;
                }

            }
            if (rand(2) == 0 && this.player.tone > 0) {
                if (this.bimboRating() >= 2) {
                    this.outputText(" You imagine riding a monstrous cock, and your hips starts shaking involuntarily. You feel your how you fuckable flesh jiggles, tits swaying from side to side. ");
                }
                else if (this.bimboRating() >= 1) {
                    this.outputText(" You fantasize about holding a dick between your mammaries, as your tits are being fucked, and corrupt semen is liberally sprayed over your jiggling flesh. ");
                }
                else {
                    this.outputText(" You fantasize about having a soft and yielding body, images of all kings of pleasures that you can have run through your mind. ");
                }
                this.player.modTone(0, 4);
                this.getGame().dynStats("cor", 0.2);
            }

            if (!this.player.isLactating() && rand(3) == 0) {

                this.outputText("Your busily tugging fingers grow wet while they work, coated in a thin sheen of tawny from their efforts. You're lactating? The thought sends a delicious thrill through your body and, most importantly, your striking nipples. You tug one and focus in on that thought. <b>You're lactating.</b>");
                if (this.player.hasVagina()) {
                    if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_SLAVERING) {
                        this.outputText(" Your feel your [vagina] gushes fluids down your leg, ");
                    }
                    if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_DROOLING) {
                        this.outputText(" Your [vagina] clenches and squirts under your skirt, ");
                    }
                    if (this.player.vaginas[0].vaginalWetness == Vagina.WETNESS_SLICK) {
                        this.outputText(" You feel a trickle of girl-cum down your leg, as your [vagina] clenches, ");
                    }
                    else {
                        this.outputText(" Your [vagina] clenches under your skirt, ");
                    }
                    this.outputText("heedlessly cumming without so much as a brush against your clits. The orgasm pales in intensity next to the pleasure of expressing a single drop of milk.\n\n");
                    this.player.orgasm('Vaginal');
                    this.getGame().dynStats("cor", 0.2);
                }
                else if (this.player.hasCock()) {
                    this.outputText(" You feel wetness under your skirt, as your floppy cock is oozing cum. The orgasm pales in intensity next to the pleasure of expressing a single drop of milk.\n\n");
                }
                this.player.boostLactation(1);
                this.getGame().dynStats("lib", .5, "sen", 1, "lus", 10);
                this.getGame().dynStats("cor", 2);
            }
            else if (this.player.isLactating()) {

                if (rand(2) == 0) drinkTits = true;

                if (this.player.biggestLactation() < 0.1) {
                    drinkTits = false;
                    this.outputText("Your busily tugging fingers grow wet while they work, coated in a thin sheen of creamy from their efforts. You are lactating! The thought sends a delicious thrill through your body, and strong pulsation starts in your [vagorass]. ");
                    if (this.player.biggestTitSize() > 0) this.outputText("It stops all too soon, though you hope that you can lactate quite often now. ");
                    else this.outputText("You kind of wish your " + this.player.breastDescript(0) + " were big enough to drink it directly, just to sample it. ");
                    this.player.boostLactation(0.75);
                    this.getGame().dynStats("cor", 0.2);
                    this.getGame().dynStats("lib", .5, "sen", 1, "lus", 10);
                }
                else if (this.player.biggestLactation() < 2) {
                    this.outputText("Your busily tug your [nipples], feeling a strong pressure in your chest. You yank down your top as powerful jets of milk spray from your nipples, spraying thick streams all around. ");
                    if (drinkTits) this.titDrink();
                    this.outputText("\n\nYour [vagorass] clenches in rhythmic pulsations, the pleasure becomes unbearable, and your whole body shakes in a powerful orgasm.");
                    this.player.boostLactation(.5);
                    this.getGame().dynStats("cor", 0.2);
                    this.dynStats("lib", 1, "sen", 4, "lus", 15);
                }
                else if (this.player.biggestLactation() <= 2.6) {
                    this.outputText("Your busily tug your [nipples], feeling a strong pressure in your " + this.player.breastDescript(0) + ". You yank down your top as eruptions of milk squirt from your nipples, hosing thick streams everywhere. The feeling of the constant gush of fluids is very erotic, and you find yourself getting more and more into this. ");
                    if (drinkTits) this.titDrink();
                    this.outputText("\n\nYour mind is overwhelmed by a pleasure as your " + this.player.breastDescript(0) + " are producing jets of delicious white cream. Your [vagorass] clenches and [hips] shake in rhythmic pulsations. The pressure builds and builds until you mind loses any control, and your body shatters in an orgasm.\n\n");
                    this.player.boostLactation(.5);
                    this.getGame().dynStats("cor", 0.2);
                    this.dynStats("lib", 1, "sen", 4, "lus", 15);
                }
                else if (this.player.biggestLactation() < 3) {

                    this.outputText("Your busily tug your [nipples], feeling a strong pressure in your " + this.player.breastDescript(0) + ". You yank down your top as thick hoses of milk erupt from your aching nipples, forming puddles in the ground.  You smile at yourself, your milk coating the ground faster than it can be absorbed.  The constant lactation entrances you, and you find yourself moaning and pulling on your nipples, totally outside of your control. ");
                    if (drinkTits) this.titDrink();

                    this.outputText("\n\nYour legs curl as your [vagorass] clenches, your dress sticky from the milk sprayed all over you. A low moan builds up in your chest, rising up to a high-pitched scream of immense pleasure, as hour hands feverishly tug your nipples dry. Powerful convulsions shutter your resistance, and you lay back, spent. You feel lightheaded from the intense milking, and have difficulty focusing on anything but the residue of fluids coating your " + this.player.allBreastsDescript() + ".\n\n");

                    if (this.player.inte > 5) this.getGame().dynStats("int", -1);
                    this.getGame().dynStats("lib", 1, "sen", 4);
                    this.getGame().dynStats("lus", 15);
                    this.getGame().dynStats("cor", 0.2);
                    this.player.boostLactation(.5);
                }
                else {
                    this.outputText("Your feverishly tug your [nipples], and feel that there's no stopping the tidal wave of backed - up bliss. You can feel it pushing against your buds from the inside, released in squirts and sprays more orgasmic than any climax amidst your nethers. You tug at them in a wild frenzy, too delirious to register pain or discomfort. On your back, you mindlessly milk huge squirts of white ambrosia onto yourself and the ground. There's so much! Rivers of it wash down the sides of your " + this.player.breastDescript(0) + ".");
                    if (drinkTits) this.titDrink();
                    this.outputText("\n\nSeconds, minutes, and maybe even hours are passing, but they're of little consequence to you. ");
                    this.outputText(" You're lead, squirming and moaning, from one milk-dripping orgasm to the next, coating yourself so thickly in the sticky fluid that its all you can smell anymore.  On and on, the cascades of ecstasy wash over you, exuded from your prominent buds as easily as the constant streams, but eventually, even seemingly timeless pleasure must abate. You dimly become aware that your milk has stopped flowing, your reserves exhausted. ");
                    if (this.player.inte < 10) this.outputText(" You moo with delight, totally relaxed after good milking. ");
                    else if (this.player.inte < 20) this.outputText(" You stretch and let out a contented moo, long and loud, aroused even more by the silliness of it. ");
                    else if (this.player.inte < 30) this.outputText(" You quietly moo, your mind barely register how strange you're acting.");
                    this.player.boostLactation(.4);
                    this.getGame().dynStats("cor", 0.5);
                    if (this.player.inte > 5) this.getGame().dynStats("int", -1);
                    if (this.player.biggestTitSize() >= 12 && rand(2) == 0) {
                        this.player.orgasm('Vaginal');
                    }
                }

                this.flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST]++;

            }

        }
        if (rand(4) == 0) this.flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST]++;
        if (removeCock) {
            this.shrinkCock();
        }
        else if (!this.player.hasVagina() && !this.player.hasCock()) {
            this.growVagina();
        }
        this.outputText(this.player.modFem(this.player.hasCock() ? 80 : 100, 2));
        this.outputText("\n\n");
        this.player.orgasm('Tits');
        this.bimbifyMe();
        this.postOrgasm();
    }

    public analRelieve(): boolean {
        this.outputText("\n");

        if (this.flags[kFLAGS.TIMES_ORGASM_ANAL] > 10) {
            if (rand(2) == 0) this.getGame().dynStats("lus", rand(30) + rand(this.player.sens));
            else this.getGame().dynStats("lus", rand(30) + rand(this.player.lib));
        }
        else this.getGame().dynStats("lus", rand(20) + rand(this.player.sens / 2));
        if (this.flags[kFLAGS.TIMES_ORGASM_ANAL] > 0) this.flags[kFLAGS.TIMES_ORGASM_ANAL]--;

        if (this.bimboRating() <= 1) {
            this.outputText("Sensation of tender fabric clinging to your [butt] arouses you immensely, as you smooth your skirt. You give in to temptation and gently stroke your [ass]. You cannot stop thinking of how nice and smooth it feels.");
        }
        else if (this.bimboRating() <= 2) {
            this.outputText("You feel how fine fabric of your sluttish skirt don't quite cover your [ass], and how smooth skirt is stretched by your [hips]. Your[asshole] clenches as you imagine how your cheeks are spread and a head of a hard cock pushes your [butthole].");
        }
        else {
            this.outputText("You mind wanders recalling your recent hussles. Your gently stroke your [butt], thinking about the pleasures of being filled with large and tasty cocks.");
            if (this.player.butt.rating > 6) this.outputText(" Your whorish [ass] looks quite seductive in your nice dress, you caress it, feeling how your [asshole] clenches is anticipation of a pleasure.");
            this.outputText(" You daydream about getting fucked by all kinds of monstrous cocks, from minotaurs' thick, smelly dongs to demons' towering, bumpy pleasure-rods.");
        }
        if (this.flags[kFLAGS.TIMES_ORGASM_ANAL] > 10) {
            if (rand(2) == 0) this.getGame().dynStats("lus", rand(30) + rand(this.player.sens));
            else this.getGame().dynStats("lus", rand(30) + rand(this.player.lib));
        }
        else this.getGame().dynStats("lus", rand(20) + rand(this.player.sens / 2));
        if (this.flags[kFLAGS.TIMES_ORGASM_ANAL] > 0) this.flags[kFLAGS.TIMES_ORGASM_ANAL]--;

        if (this.player.lust >= this.player.maxLust()) {
            this.analOrgasm();
            return true;
        }
        else {
            this.outputText(" After a while you manage to control yourself and calm down a bit, but your still feel somewhat aroused.\n");
            return false;
        }

    }

    public analOrgasm(): void {

        let removeCock: boolean = false;
        let craving: number = this.analCraving();

        // Prelude

        if (this.bimboRating() <= 1) {
            this.outputText(" Warmth spreads all over your [butt], your [asshole] clenches, and you realize that it becomes impossible to stop touching yourself.\n");
            this.outputText("\nYou adjust your position as you spread your [legs], giving you the most comfortable access to your [asshole].");
        }
        else if (this.bimboRating() <= 2) {
            this.outputText(" Your mind slowly melts in anticipation of immense pleasure of being penetrated.\n");
            this.outputText("\nYou spread your [legs], giving you the most comfortable access to your [asshole].");
        }
        else {
            this.outputText("  Your skin flushes, and you become very aware of just how utterly exposed your soft behind is. Desire to be brutally filled like a dumb slut becomes unbearable, and your mind dissolve in pure lust.\n");
            this.outputText("\nYou eagerly spread your [legs], giving you the most comfortable access to your [asshole].");
        }

        // Lubrication

        if (this.player.hasCock()) {
            this.outputText(" As your reach under your skirt, you give your [cock] a teasing tug. You trail your fingers lazily along its length; scooping up some of the pre-cum drooling from its glans.");
        }
        else if (this.player.hasVagina()) {
            this.outputText(" As you reach under your skirt, you idly give your [vagina] a tantalizing stroke. You coat your fingers with a quantity of clear girl-cum.");
        }
        else if (this.player.hasStatusEffect(StatusEffects.LustyTongue)) {
            this.outputText(" You idly lick your aroused lips, and put a finger in your mouth. You suck it right and proper, lubricating it with your saliva.");
        }
        else {
            this.outputText(" You sloppily lick your finger lubricating it.");
        }

        // Penetration

        if (craving == 3) {
            this.outputText(" A shiver runs up your spine as you plunge your finger, then next one in the deep, but your [asshole] is begging your for more. Unsatisfied, you are working your fingers in and out of your ass. This is not enough, it deserves more, you think. And then a kinky idea comes to you mind. You retrieve the floppy pink dildo from your possessions, shivering with the sexual thrill.\n\n");
            this.outputText("A drop of pink aphrodisiac leaks from the tip, offering you a hint of the pleasure you're in for.");
            if (rand(2) == 0) {
                this.outputText("You give in to temptation and lick the dildo, and immediately feel how your cheeks flash, your tongue on fire with a sensual pleasure of arousing juice.");
                this.player.orgasm('Lips');
                this.getGame().dynStats("cor", 0.2);
            }
            if (rand(2) == 0 && this.player.biggestTitSize() > 2) {
                this.outputText("Entranced by desire, you start smudging the precum around your [nipples], as pulses of pleasure spread over your " + this.player.breastDescript(0) + ".");
                this.player.orgasm('Tits');
                this.getGame().dynStats("cor", 0.2);
            }
            this.outputText("  You don't hesitate and start slowly working well-lubricated dildo inside you, gasping at the enhanced sensitivity of your [ass].");
            this.outputText("  You splay your " + this.player.legs() + " and lie there with it inside you, feeling it respond to your arousal, becoming more and more turned on by the second.\n\n");
            this.player.buttChange(16, true, false, true);
            this.getGame().dynStats("cor", 0.2);
            this.outputText("The thickness of the toy gradually increases, filling you more and more effectively as it reacts to your heat.  You grab it two-handed and start slamming it into your [asshole], vigorously fucking yourself with the swelling dong.  The sensations just keep getting better and better as more and more of the goblin's sex-drug leaks into you. ");
        }
        else if (craving == 2) {
            this.outputText(" A shiver runs up your spine as you plunge your finger, then next one in the deep, but your [asshole] is begging your for more. Somewhat unsatisfied, you continue working your fingers in and out of your ass, when a kinky idea crosses your mind, and you think of your dildo.");
            this.outputText("\n\nGrabbing your toy, you give it several long wet licks before holding your [legs] up and sending the substitute cock to its true task. You rub the tip against your [asshole] momentarily before finally pushing it inside. Stuttering moans escape your lips as your butt gets its much-needed fill of firm faux phallus. ");
            this.outputText("Your toes curl as you begin to pull in and out, pumping the dildo with smooth motions. Your tongue hangs from your mouth, your breathing becomes heavy, and you squeak lewdly expressing pure lust as you increase your tempo. ");
            this.player.buttChange(8, true, true, false);
            this.getGame().dynStats("cor", 0.2);
        }
        else {
            if (this.player.ass.analLooseness < 2) {
                this.outputText(" Properly prepared, you use a solitary, lubricated finger to gingerly ply at the ring of your [asshole], encountering plenty of resistance in the process. You've soon worked your finger in all the way, the bulk of your palm now stopping any further progress as you start to wriggle the invading digit around inside your ass.\n\n");
            }
            else {
                this.outputText(" Properly prepared, you use lubricated finger to ply your [asshole]. Encountering little resistance in the process, you push second finger inside, working in all the way, the bulk of your palm now stopping any further progress as you start to wriggle the invading digits around inside your ass.\n\n");
            }
            this.player.buttChange(4, true, false, true);
            this.getGame().dynStats("cor", 0.2);
        }

        // Build-up
        if (rand(2) == 0 && this.player.hips.rating < 12) {
            if (craving < 2) {
                this.outputText("You moan as your pleasure builds. Your [hips] involuntarily twist back and forth as you drive your finger with increasing fervor into your bum, trying to inch it just a little bit deeper.");
                this.player.buttChange(8, true, true, true);
            }
            else {
                this.outputText("You moan as your pleasure builds. Your [hips] involuntarily twist back and forth as you drive the dildo with increasing fervor into your bum, trying to inch it just a little bit deeper. ");
                this.player.buttChange(32, true, false, true);
            }
            this.player.hips.rating++;
            this.getGame().dynStats("cor", 0.5);
            this.outputText("You feel how the fabric of the skirt is stretched by your [hips] as they become wider, more appropriate for a whore in a heat. ");
        }
        if (rand(2) == 0 && (this.player.tone > 0 || this.player.butt.rating < 12)) {
            this.outputText("Your cheeks are burning hot with arousal now. Every inch of your [ass] seems alight with sensation. ");
            this.player.modTone(0, 4);
            if (this.player.butt.rating < 12) this.player.butt.rating++;
            this.getGame().dynStats("cor", 0.5);
            this.outputText("You imagine being some kind of butt slut, as you feverishly pump your fuckable [butt]. You moan softly in enjoyment. ");
        }

        if (rand(2) == 0) {
            this.outputText("Your free hand slips up to your " + this.player.allBreastsDescript() + ", grabbing hold of one of your breasts and squeezing in time to the fingering of your ass. ");
            if (this.player.biggestTitSize() < 1) {
                this.outputText("As you fondle yourself, you feel how your sensitive flesh swells under your hand, and a wave of pleasure overwhelms you. ");
                this.player.growTits(1, 1, false, 3);
                this.getGame().dynStats("cor", 0.5);
                this.player.orgasm('Tits');
            }
            else {
                if (craving < 2) {
                    this.outputText("Working your finger deeply into your ass has your whole body twisting and writhing in just the right way to make your tits jiggle and quake, every muscle, every inch of skin touched by the building pleasure. ");
                }
                else {
                    this.outputText("Working your dildo deeply into your ass has your whole body twisting and writhing in just the right way to make your tits jiggle and quake, every muscle, every inch of skin touched by the building pleasure. ");
                }
                if (this.player.biggestTitSize() < 12) this.player.growTits(0.5, 1, false, 3);
                this.player.orgasm('Tits');
            }
        }
        this.outputText("You can almost taste the release just over the horizon, and you make one final push to drive yourself over the edge.\n\n");

        if (craving == 3) {
            this.player.buttChange(0.9 * this.player.analCapacity(), true, false, true);

            this.outputText("Your body quakes and spasms while your " + this.player.hipDescript() + " buck into the air, fucking an imaginary lover.  The dildo sinks into your core, your arms instinctively fulfilling your desire for complete penetration.  A warm wetness suddenly soaks your belly as the fuck-stick erupts, filling you.  Just like that the orgasm you had seems like foreplay.  Your eyes roll back into your head and you begin convulsing, practically having a pleasure-seizure from the drugs and your already oversensitive butt.   You sprawl there, wiggling and cumming your brains out for what feels like an eternity, but it does eventually end, and when it does the dildo is back to its normal size, lying in a puddle of aphrodisiacs and cum.\n\n");
            this.getGame().dynStats("lib", 2, "sen", 3);
            this.getGame().dynStats("cor", 0.2);
        }
        else if (craving == 2) {
            this.player.buttChange(20, true, false, true);

            if (this.player.hasCock() && this.player.hasVagina())
                this.outputText("You moan in ecstasy while your [vagina] and " + this.player.multiCockDescriptLight() + " erupt with sex juices. ");
            else if (this.player.hasCock())
                this.outputText("You moan in ecstasy while cum spurts from your " + this.player.multiCockDescriptLight() + ". ");
            else if (this.player.hasVagina()) {
                this.outputText("You moan in ecstasy while juices ");
                if (this.player.wetness() >= 4)
                    this.outputText("squirt");
                else this.outputText("trickle");
                this.outputText(" from your [vagina]. ");
            }
            this.outputText("Your body shakes and rocks from the anal orgasm before slumping onto your back. Happily tightening around the toy with each beat of your hammering heart, you rest.\n\n");
            this.getGame().dynStats("lib", 2, "sen", 3);
            this.getGame().dynStats("cor", 0.2);
        }
        else {
            this.player.buttChange(6, true, false, true);

            this.outputText("With one final wiggling thrust it finally hits, and you scream in ecstasy. Your legs lash out uncontrollably as a bolt of pleasure wracks your body, every muscle convulsing in shared bliss.\n\n");
            this.getGame().dynStats("lib", 1, "sen", 2);
            this.getGame().dynStats("cor", 0.2);
        }

        if (this.player.cocks.length > 0 && rand(5) == 0) removeCock = true;
        this.player.modFem(this.player.hasCock() ? 80 : 100, 1);

        if (rand(3) == 0) {
            this.flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST]++;
        }
        if (removeCock) {
            // outputText("\nYou notice and ooze trickling out of your " + player.cockDescript(0) + ". You feel somehow empiter\n");
            this.shrinkCock();
        }
        else if (!this.player.hasVagina() && !this.player.hasCock()) {
            this.growVagina();
        }
        this.player.orgasm('Anal');
        this.bimbifyMe();
        this.postOrgasm();
    }

    public lipRelieve(): boolean {

        this.getGame().dynStats("lus", rand(this.flags[2 * kFLAGS.TIMES_ORGASM_LIPS] + 5) + rand(this.player.sens / 2));
        if (this.flags[kFLAGS.TIMES_ORGASM_LIPS] > 60) this.flags[kFLAGS.TIMES_ORGASM_LIPS] = 60;
        this.outputText("\n");

        let craving: number = this.lipCraving();

        if (craving == 1) {
            this.outputText("Absentmindedly you lick your lips, and immediately feel warmth spreading over our face. You lick your lips again, feeling how sensual they become. ");
        }
        else if (craving == 2) {
            this.outputText("Your mind wanders off recalling your recent hussles. You keep licking your lips, blushing with the sexual pleasure it brings you. You are thinking of how wet your lips are, and you swallow, feeling strange hunger and itching all over your face. ");
        }
        else if (craving == 3) {
            this.outputText("Your mind wanders off, recalling taste of cum in your mouth. You keep licking your whorish lips, almost feeling the stickiness and musky smell. You wander how much time will pass before you can taste that magnificent cum again. ");
        }
        // Lips don't decrease unless one is very lucky
        if (this.flags[kFLAGS.TIMES_ORGASM_LIPS] > 0 && rand(10) == 0) this.flags[kFLAGS.TIMES_ORGASM_LIPS]--;

        if (this.player.lust >= this.player.maxLust()) {
            this.lipOrgasm();
            return true;
        }
        else {
            this.outputText("Eventually this sensation fades, and your mind returns to your quest.\n");
            return false;
        }
    }

    public lipOrgasm(): void {

        let craving: number = this.lipCraving();
        let reduceDick: boolean = false;

        if (!this.player.hasStatusEffect(StatusEffects.LustyTongue)) {
            // outputText("\nAnticipation in your mouth doesn't seem to fade, only becoming more and more intense.  It will be hard to keep from getting turned on any time you lick your lips or eat some food.\n");
            this.player.createStatusEffect(StatusEffects.LustyTongue, 24, 0, 0, 0);
        }
        else {
            this.player.changeStatusValue(StatusEffects.LustyTongue, 1, this.player.statusEffectv1(StatusEffects.LustyTongue) + 10);
        }

        if (craving == 1) {

            this.outputText("You keep licking your lips, while your hands start caressing your body, unable to resist the rising pleasure. You give in to sensation of the soft fabric under your hands and feeling of sweet wetness in your mouth, a soft moan escapes your lips.\n\n");

            this.outputText("You start pinching your [nipple] with one hand, while the other hand reaches under the skirt. ");
            if (this.player.hasVagina()) {
                this.outputText("You gently stroke your [vagina], touch your [clit]. ");
                this.outputText("You are feeling moisture inside, and overwhelmed by a strange thoughts, you take your hand out and start licking your juices from your finger. Your pussy tastes delicious, and you feel how your lips start to tingle. You make another soft moan, feeling how your [vagina] clenches in a powerful orgasm under your indecent dress.\n");
                this.player.orgasm('Vaginal', false);
            }
            else if (this.player.hasCock()) {
                this.outputText("Your gently stroke your [cock], feeling a dribble of precum. Overwhelmed by strange thoughts, you take your hand out and start licking pre-cum from you fingers. The taste is disgusting but somehow delicious, and you feel how your lips start to tingle. You make another soft moan, feeling how your indecent skirt becomes wet as your [cock] spray cum all over your shaky [legs].\n");

            }
            else {
                this.outputText("Your gently stroke your [asshole], teasing the entrance. Your face starts to tingle, as you make another soft moan, your finger inside your [ass].\n");
            }
            this.getGame().dynStats("lib", 1, "sen", 2);
            this.player.orgasm('Lips');
            this.getGame().dynStats("cor", 0.2);
            this.outputText(this.player.modFem(this.player.hasCock() ? 80 : 100, 1));

        }
        else if (craving == 2) {

            this.outputText("Your mind slowly melts from the feeling of warmth radiating from your pussy-like mouth. Your hands stroke your " + this.player.breastDescript(0) + ", touch your [nipples], than get down under the smoothness of your dress, to your [ass]. You give in to your lust and drop on your knees.\n\n");

            this.outputText("You undress the top of your slutty outfit and begin caressing your [nipples]. ");
            if (rand(2) == 0) {
                this.outputText("A thin line of drool escapes from your mouth and drops to your " + this.player.breastDescript(0) + ".");
                if (this.player.biggestTitSize() < 1) {
                    this.outputText(" Immediately you feel as warmth spreads over your chest, and you are feeling how tender titflesh expands under your palm. ");
                    this.player.growTits(1, 1, false, 3);
                    this.getGame().dynStats("cor", 0.5);
                }
                else this.outputText(" Immediately you feel how sensation of warmth and pleasure spreads all over your " + this.player.breastDescript(0) + ". ");
                this.player.orgasm('Tits');
            }
            this.outputText("You close your eyes, awashed by wonderful feeling from your lips, and a strange thought keeps returning to you. You need to suck. You need to put something big in your mouth and suck it. Just sucking would be so much rewarding.");
            if (this.player.biggestTitSize() > 5 && rand(2) == 0) {
                if (this.player.averageLactation() > 1) this.titDrink();
                else {
                    this.outputText(" You lift one of your " + this.player.breastDescript(0) + " to your lips and start sucking. You are feeling mounting warmth and pleasure in " + this.player.breastDescript(0) + ", and soon your [nipple] starts dripping milk. Creamy taste in your mouth make you roll your eyes and cry in extasy, your legs curling.\n");
                    this.player.orgasm('Lips');
                    this.player.boostLactation(1);
                    this.getGame().dynStats("cor", 1);
                }
                this.player.orgasm('Tits');
                this.getGame().dynStats("cor", 0.2);
                this.outputText(" As waves of pleasure subside, you open your eyes. Satisfied, you let your tit rest for a while. You should definitely repeat this some time.\n");
            }
            else {
                this.outputText("\n\nMindlessly, you stuck a thumb in your mouth and start sucking. Your sensitive lips make this experience unbearable, you start moaning even harder. ");
                if (this.player.hasVagina()) {
                    this.outputText("With you other hand you quickly reach under to your [vagina] and start stroking it. ");
                    this.outputText("Interrupting only to lick sweet girl-cum, you continue sucking your thumb and fingering your [pussy]. In your fantasy, you suck a cock, as it becomes thicker, ready to unload in your mouth. This thought arouses you immensely, and very soon all the barriers break, as your hot [pussy] and your indecent mouth explode in breath-taking pleasure. ");
                    this.player.orgasm('Vaginal', false);
                    this.getGame().dynStats("cor", 0.2);
                    this.player.orgasm('Lips');
                }
                else if (this.player.hasCock()) {
                    this.outputText("With you other hand you quickly reach under to your [cock] and start tugging it. ");
                    this.outputText("Interrupting only to lick musky pre-cum from your fingers, you continue sucking your thumb and stroking your [cock]. In your fantasy, you suck a cock much bigger than yours, as it becomes thicker, ready to unload in your mouth. This thought arouses you immensely, and very soon all the barriers break, as your hot [cock] and your indecent mouth explode in breath-taking pleasure. ");
                    if (rand(10) == 0) reduceDick = true;
                    this.getGame().dynStats("cor", 0.2);
                    this.player.orgasm('Lips');
                }
                this.outputText(" As waves of pleasure subside, you open your eyes. Satisfied, you let your thumb out for a while. You should definitely repeat this some time.\n");
            }
            if (this.player.inte > 5) this.getGame().dynStats("int", -0.1);
            this.getGame().dynStats("lib", 1, "sen", 2);
            this.outputText(this.player.modFem(this.player.hasCock() ? 80 : 100, 1));

        }
        else if (craving == 3) {

            this.outputText("Your cum-hunger is so powerful that you cannot think of anything else. You put a thumb in your mouth and your knees lock. You fall back in pleasure, twisting and moaning like a whore. Images of monstrous cocks flash before your eyes as desire to suck dick overwhelms you.\n\n");
            this.outputText("You are sucking your thumb, moving it in and out of your indecent mouth, moaning loudly. Quickly, you undress the top of your outfit and grope your " + this.player.breastDescript(0) + " lubricating your [nipples] liberally with your saliva. ");
            if (this.player.hair.length > 10) {
                this.outputText("A lock of your " + this.player.hairDescript() + " falls on your " + this.player.breastDescript(0) + " and you mindlessly shrug it away");
                if (this.player.hair.length > 30 && this.player.hair.color != "platinum blonde") {
                    this.outputText(", noticing on the back of the mind how they became perfectly bimbo-blonde.");
                    this.player.hair.color = "platinum blonde";
                    this.getGame().dynStats("cor", 0.3);
                }
                else {
                    this.outputText(".");
                }
            }
            if (rand(2) == 0 && this.player.biggestTitSize() < 12) {
                this.outputText(" Familiar sensation of warmth spreads all over your chest, and you feel your " + this.player.breastDescript(0) + " becomes slightly bigger. ");
                this.player.growTits(0.5, 1, false, 3);
                this.getGame().dynStats("cor", 0.2);
                this.player.orgasm('Tits');
            }

            this.outputText(" You close your eyes, awashed by wonderful feeling from your lips, and start feverishly fucking your mouth with your thumb, desperately craving for something bigger and hotter.\n\n");
            if (this.player.biggestTitSize() > 5) {
                if (this.player.averageLactation() > 1) {
                    this.outputText("Your magnificent teats throb with pleasure, desperate for attention.");
                    this.titDrink();
                    this.outputText("\n\n");
                }
                else {
                    this.outputText("You lift one of your " + this.player.breastDescript(0) + " to your lips and start sucking. You are feeling mounting warmth and pleasure in " + this.player.breastDescript(0) + ", and soon your [nipple] starts dripping milk. Creamy taste in your mouth make you roll your eyes and cry in extasy, your legs curling. <b>You are lactating!</b> This thought fill you mind with bliss.\n\n");
                    this.player.orgasm('Lips');
                    this.player.boostLactation(1);
                    this.getGame().dynStats("cor", 1);
                }
                this.player.orgasm('Tits');
                this.outputText("Reaching a peak, you let your mind race. How much you would like a proper dick in your mouth! ");
            }
            else this.player.orgasm('Lips');

            if (this.player.hasKeyItem("Deluxe Dildo") >= 0) {
                this.outputText("A shiver runs up your spine as you remember the floppy pink dildo that Tamani gave to you. With shaking hands you retrieve it from your possessions and lick it hungrily. It responses by leaking a drop of pink aphrodisiac from the tip, and you greedily put it in your mouth and start sucking. You are feeling how your tongue is set on fire by a sensual pleasure of arousing juice. The thickness of the toy gradually increases, filling you more and more effectively as it reacts to your wetness. The sensations just keep getting better and better as more and more of the goblin's sex-drug leaks into you.\n\n");

                if (this.player.hasVagina()) {
                    this.outputText("With you other hand you quickly reach under to your [vagina] and start stroking it. ");
                    this.outputText("Interrupting only to lick sweet girl-cum, you continue sucking your thumb and fingering your [pussy]. Down on your knees, as you suck dildo and pleasure your [cunt], the fantasies of being a whore overwhelm you and your mind shutters in a powerful orgasm.");
                    this.player.orgasm('Vaginal', false);
                    this.getGame().dynStats("cor", 0.5);
                }
                else if (this.player.hasCock()) {
                    this.outputText("With you other hand you quickly reach under to your [cock] and start tugging it. ");
                    this.outputText("Interrupting only to lick musky pre-cum from your finders, you continue sucking your thumb and stroking your [cock]. Down on your knees, as you suck dildo and pleasure your [cock], the fantasies of being a whore overwhelm you and your mind shutters in a powerful orgasm.");
                    if (rand(2) == 0) reduceDick = true;
                    this.getGame().dynStats("cor", 0.5);
                }
                this.outputText("\n\nClenching, you continue to mindlessly suck the dildo, and you feel a sudden eruption in your mouth. You gulp and cough, as sticky liquid covers your " + this.player.breastDescript(0) + " and face, and another way of pleasure melts you. Your eyes roll back into your head and you begin convulsing, practically having a pleasure-seizure from the drugs as you swallow so much craved cum.   You sprawl there, wiggling and cumming your brains out for what feels like an eternity, but it does eventually end, and when it does the dildo is back to its normal size, lying in a puddle of aphrodisiacs and cum.\n");
                if (this.player.inte > 5) this.getGame().dynStats("int", -0.5);
                this.getGame().dynStats("lib", 3, "sen", 5);
                this.getGame().dynStats("cor", 0.5);
                this.player.orgasm('Lips');
            }
            else if (this.player.hasKeyItem("Dildo") >= 0) {
                this.outputText("A shiver runs up your spine as you remember your dildo. You retrieve it from your possessions and start hungrily sucking it, imagining it being real phallos. In your fantasy you are a whore, who's only purpose is to serve as a cocksucker. You greedily plunge it inside your mouth, hoping in vain that it will fill you with cum.\n\n");

                if (this.player.hasVagina()) {
                    this.outputText("With you other hand you quickly reach under to your [vagina] and start stroking it. ");
                    this.outputText("Interrupting only to lick sweet girl-cum, you continue sucking your thumb and fingering your [pussy]. Down on your knees, as you suck dildo and pleasure your [cunt], the fantasies overwhelm you and your mind shutters in a powerful orgasm.");
                    this.player.orgasm('Vaginal', false);
                    this.getGame().dynStats("cor", 0.2);
                }
                else if (this.player.hasCock()) {
                    this.outputText("With you other hand you quickly reach under to your [cock] and start tugging it. ");
                    this.outputText("Interrupting only to lick musky pre-cum from your finders, you continue sucking your thumb and stroking your [cock]. Down on your knees, as you suck dildo and pleasure your [cock], the fantasies overwhelm you and your mind shutters in a powerful orgasm.");
                    if (rand(2) == 0) reduceDick = true;
                    this.getGame().dynStats("cor", 0.2);
                }
                if (this.player.inte > 5) this.getGame().dynStats("int", -0.2);
                this.getGame().dynStats("lib", 1, "sen", 2);

            }
            else {
                if (this.player.hasVagina()) {
                    this.outputText("With you other hand you quickly reach under to your [vagina] and start stroking it. ");
                    this.outputText("Interrupting only to lick sweet girl-cum, you continue sucking your thumb and fingering your [pussy]. In your fantasy, you suck a cock, as it becomes thicker, ready to unload in your mouth. This thought arouses you immensely, and very soon all the barriers break, as your hot [pussy] and your indecent mouth explode in breath-taking pleasure. ");
                    this.player.orgasm('Vaginal', false);
                }
                else if (this.player.hasCock()) {
                    this.outputText("With you other hand you quickly reach under to your [cock] and start tugging it. ");
                    this.outputText("Interrupting only to lick musky pre-cum from your finders, you continue sucking your thumb and stroking your [cock]. In your fantasy, you suck a cock much bigger than yours, as it becomes thicker, ready to unload in your mouth. This thought arouses you immensely, and very soon all the barriers break, as your hot [cock] and your indecent mouth explode in breath-taking pleasure. ");
                    if (rand(2) == 0) reduceDick = true;
                }
                this.outputText(" As waves of pleasure subside, you open your eyes. Satisfied, you let your thumb out for a while. You should definitely repeat this some time.\n");
                if (this.player.inte > 5) this.getGame().dynStats("int", -0.2);
                this.getGame().dynStats("lib", 1, "sen", 2);
                this.getGame().dynStats("cor", 0.2);
            }

            this.outputText(this.player.modFem(this.player.hasCock() ? 80 : 100, 1));
            if (this.player.hair.length < 36) {
                this.player.growHair(0.5);
                this.getGame().dynStats("cor", 0.2);
            }

            if (rand(2) == 0) this.flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST]++;

        }
        if (reduceDick) this.shrinkCock();
        else if (!this.player.hasVagina() && !this.player.hasCock()) {
            this.growVagina();
        }
        this.outputText("\n");

        this.bimbifyMe();
        this.postOrgasm();
    }

    // -----------------------------------

    public postOrgasm(): void {

        this.doNext(this.playerMenu);

    }

    public bimbifyMe(): void {

        if (this.flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST] <= 50) return;
        this.flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST] = 50;

        if (!(this.player.tone == 0)) {
            this.outputText("\nYou are losing your mind in a sea pure enjoyment that awashes your broken body. Somehow you want to just stop bothering with your silly quest, and give in to the pleasure of being a whore, having your soft and sinful body fucked beyond all senses...\n\n");
            if (rand(2) == 0) this.player.orgasm('Anal', false);
            else this.player.orgasm('Tits', false);
        }
        else if (!(this.player.hips.rating >= 12)) {
            this.outputText("\nYou are losing your mind in a sea pure enjoyment that awashes your broken body. You lay down, spreading your [legs] to let everyone see your [vagorass]. Somehow you want to just stop bothering with your silly quest, and give in to the pleasure of being a whore, being pumped with a cum up to the very brims ...\n\n");
            if (rand(2) == 0) this.player.orgasm('Anal', false);
            else this.player.orgasm('Tits', false);
        }
        else if (!(this.player.butt.rating >= 12)) {
            this.outputText("\nYou are losing your mind in a sea pure enjoyment that awashes your broken body. Somehow you want to just stop bothering with your silly quest, and give in to the pleasure of being a whore, having your large and fuckable [ass] violated by monstrous cocks...\n\n");
            if (rand(2) == 0) this.player.orgasm('Anal', false);
            else this.player.orgasm('Vaginal', false);
        }
        else if (!(this.player.biggestTitSize() >= 12)) {
            this.outputText("\nYou are losing your mind in a sea pure enjoyment that awashes your broken body. Somehow you want to just stop bothering with your silly quest, and give in to the pleasure of being a whore, having your jiggly udders swishing as your drooling cunt is being pumped by monstrous cocks...\n\n");
            this.player.orgasm('Tits', false);
        }
        else {
            this.outputText("\nYou are losing your mind in a sea pure enjoyment that awashes your broken body. Somehow you want to just stop bothering with your silly quest, and give in to the pleasure of being a whore, feeling how hot and throbbing member sprouts babymaking cum inside your belly...\n\n");
        }

        if (this.player.inte > 5) this.getGame().dynStats("int", -1);

        this.getGame().dynStats("lib", 4, "sen", 4);
        this.getGame().dynStats("cor", 1);

        if (this.player.inte <= 20 && !(this.player.findPerk(PerkLib.BimboBrains) >= 0)) {
            this.outputText("A bubbly giggle bursts from your lips, which you then lick hungrily.  You, like, totally want some dick to suck!  Wow, that came out of left field.  You shake your head and try to clear the unexpected, like, words from your head but it's getting kind of hard.  Omigosh, you feel kind of like a dumb bimbo after, like, drinking that weird booze.  Oh, well, it doesn't matter anyhow – you can, like, still stop the demons and stuff.  You'll just have to show off your sexy bod until they're offering to serve you.\n\n");
            this.outputText("<b>(Bimbo Brains - Perk Gained!)</b>\n\n"); // int to 20.  max int 50)
            this.player.createPerk(PerkLib.BimboBrains, 0, 0, 0, 0);
            this.getGame().dynStats("cor", 1);
        }
        if (this.player.tone == 0 && this.player.hips.rating >= 12 && this.player.butt.rating >= 12 && this.player.biggestTitSize() >= 12 && this.player.hasVagina() && !this.player.hasCock() && !(this.player.findPerk(PerkLib.BimboBody) >= 0)) {

            if (this.player.hair.color != "platinum blonde") {
                this.outputText("You notice a change in your " + this.player.hairDescript() + ".  It starts with a tingling in your scalp and intensifies ");
                if (this.player.hair.length < 36) {
                    this.outputText("as you feel the weight of your hair growing heavier and longer. ");
                    this.player.hair.length = 36;
                }
                else this.outputText("as your hair grows thicker and heavier. ");
                this.outputText(" You grab a lock of the silken strands and watch open-mouthed while streaks so blonde they're almost white flow down the " + this.player.hair.color + " hair.  It goes faster and faster until your hair has changed into perfectly bimbo-blonde, flowing locks.\n\n");
                this.player.hair.color = "platinum blonde";
            }

            else {

                this.outputText("You sigh and run one hand over your " + this.player.nippleDescript(0) + "s");
                if (this.player.breastRows[0].breastRating < 10) {
                    this.player.breastRows[0].breastRating += 5 + rand(5);
                    this.outputText(", surprised at how large and rounded your expanding breasts have become while fresh tit-flesh continues to spill out around your needy fingers.  They feel so supple and soft, but when you let them go, they still sit fairly high and firm on your chest.  The newer, more generous, " + this.player.breastCup(0) + " cleavage has you moaning with how sensitive it is, pinching a nipple with one hand ");
                }
                else {
                    this.player.breastRows[0].breastRating += 5 + rand(5);
                    this.outputText(", admiring how sensitive they're getting.  The big breasts start getting bigger and bigger, soft chest-flesh practically oozing out between your fingers as the squishy mammaries sprout like weeds, expanding well beyond any hand's ability to contain them.  The supple, " + this.player.breastCup(0) + " boobs still manage to sit high on your chest, almost gravity defying in their ability to generate cleavage.  You pinch a nipple with one hand ");
                }
                this.getGame().dynStats("sen", 20);
                this.outputText("while the other toys with the juicy entrance of your folds.  Mmmm, it, like, feels too good not to touch yourself, and after being worried about getting all dumb and stuff, you need to relax.  Thinking is hard, but sex is so easy and, like, natural!  You lean back and start grunting as you plunge four fingers inside yourself, plowing your " + this.player.vaginaDescript(0) + " like no tomorrow.  By now, your " + this.player.clitDescript() + " is throbbing, and you give it an experimental ");
                if (this.player.getClitLength() >= 3) this.outputText("jerk ");
                else this.outputText("caress ");
                this.outputText("that makes your " + this.player.legs() + " give out as you cum, splattering female fluids as you convulse nervelessly on the ground.\n\n");

                this.outputText("Though the orgasm is intense, you recover a few moments later feeling refreshed, but still hot and horny.  Maybe you could find a partner to fuck?  After all, sex is, like, better with a partner or two.  Or that number after two.  You brush a lengthy, platinum blonde strand of hair out of your eyes and lick your lips - you're ready to have some fun!\n\n");
                this.outputText("<b>(Bimbo Body - Perk Gained!)</b>\n");
                this.player.createPerk(PerkLib.BimboBody, 0, 0, 0, 0);
                this.getGame().dynStats("cor", 5);
            }
        }

    }

    public debimbifyMe(): void {

        this.outputText("\nYour mind wanders off recalling your recent hussles, but you keep focus on your quest.\n");

        if (this.flags[kFLAGS.TIMES_ORGASM_VAGINAL] > 0) this.flags[kFLAGS.TIMES_ORGASM_VAGINAL]--;
        else if (this.flags[kFLAGS.TIMES_ORGASM_TITS] > 0) this.flags[kFLAGS.TIMES_ORGASM_TITS]--;
        else if (this.flags[kFLAGS.TIMES_ORGASM_ANAL] > 0) this.flags[kFLAGS.TIMES_ORGASM_ANAL]--;
        else if (this.flags[kFLAGS.TIMES_ORGASM_LIPS] > 0) this.flags[kFLAGS.TIMES_ORGASM_LIPS]--;
        else if (this.flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST] > 0 && rand(2) == 0) this.flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST]--;
        if (this.flags[kFLAGS.TIMES_ORGASM_DICK] > 0) this.flags[kFLAGS.TIMES_ORGASM_DICK]--;
    }

    public shrinkCock(): void {
        let temp: number = 0;
        let temp2: number = this.player.cocks.length;
        let temp3: number = 0;

        // If the player has at least one dick, decrease the size of each slightly,
        this.outputText("\n\n");
        // Find biggest cock
        while (temp2 > 0) {
            temp2--;
            if (this.player.cocks[temp].cockLength <= this.player.cocks[temp2].cockLength) temp = temp2;
        }
        // Shrink said cock
        if (this.player.cocks[temp].cockLength < 6 && this.player.cocks[temp].cockLength >= 2.9) {
            this.player.cocks[temp].cockLength -= .5;
            temp3 -= .5;
        }
        temp3 += this.player.increaseCock(temp, (rand(3) + 1) * -1);
        this.player.lengthChange(temp3, 1);
        if (this.player.cocks[temp].cockLength < 2) {
            this.outputText("  ");
            if (this.player.cockTotal() == 1 && !this.player.hasVagina()) {
                this.outputText("Your " + this.player.cockDescript(0) + " suddenly starts tingling.  It's a familiar feeling, similar to an orgasm.  However, this one seems to start from the top down, instead of gushing up from your loins.  You spend a few seconds frozen to the odd sensation, when it suddenly feels as though your own body starts sucking on the base of your shaft.  Almost instantly, your cock sinks into your crotch with a wet slurp.  The tip gets stuck on the front of your body on the way down, but your glans soon loses all volume to turn into a shiny new clit.");
                if (this.player.balls > 0) this.outputText("  At the same time, your " + this.player.ballsDescriptLight() + " fall victim to the same sensation; eagerly swallowed whole by your crotch.");
                this.outputText("  Curious, you touch around down there, to find you don't have any exterior organs left.  All of it got swallowed into the gash you now have running between two fleshy folds, like sensitive lips.  It suddenly occurs to you; <b>you now have a vagina!</b>");
                this.player.balls = 0;
                this.player.ballSize = 1;
                this.player.createVagina();
                this.player.setClitLength(.25);
                this.player.removeCock(0, 1);
                this.getGame().dynStats("cor", 1);
            }
            else {
                this.player.killCocks(1);
                this.getGame().dynStats("cor", 0.2);
            }
        }
        // if the last of the player's dicks are eliminated this way, they gain a virgin vagina;
        if (this.player.cocks.length == 0 && !this.player.hasVagina()) {

            if (this.player.balls > 0) {
                this.outputText("\n\nThere's a light pinch against your [sack] that makes you gasp in surprise, followed by an exquisite tightness that makes your [vagina] drool.  Looking down, <b>you see your balls slowly receding into your body, leaving nothing behind but your puffy mons.</b>");
                this.player.balls = 0;
                this.player.ballSize = 3;
                this.player.cumMultiplier = 2;
            }

            this.player.createVagina();
            this.player.vaginas[0].vaginalLooseness = Vagina.LOOSENESS_TIGHT;
            this.player.vaginas[0].vaginalWetness = Vagina.WETNESS_NORMAL;
            this.player.vaginas[0].virgin = true;
            this.player.setClitLength(.25);
            this.outputText("\n\nAn itching starts in your crotch and spreads vertically.  You reach down and discover an opening.  You have grown a <b>new " + this.player.vaginaDescript(0) + "</b>!");
            this.getGame().dynStats("lus", 10);
        }

    }

    public growVagina(): void {
        this.player.createVagina();
        this.player.vaginas[0].vaginalLooseness = Vagina.LOOSENESS_TIGHT;
        this.player.vaginas[0].vaginalWetness = Vagina.WETNESS_NORMAL;
        this.player.vaginas[0].virgin = true;
        this.player.setClitLength(.25);
        this.outputText("\n\nAn itching starts in your crotch and spreads vertically.  You reach down and discover an opening.  You have grown a <b>new " + this.player.vaginaDescript(0) + "</b>!");
        this.getGame().dynStats("lus", 10);
    }

    public titDrink(): void {
        if (this.player.biggestTitSize() > 5 && this.player.averageLactation() > 1) {
            if (this.player.biggestLactation() > 3) {

                this.outputText(" Mindlessly you bring one of your " + this.player.breastDescript(0) + " to your mouth and gulp greedily from the torrent of precious milk. It splatters all over you face, as you nearly gag. Your tongue tingles and vibrates with the sinfully sweet taste in your mouth, dancing in circles around your nipple, washed by the thick torrent of the cream from your swollen jug. It's easy to lose yourself in that taste, falling into a rhythm of alternatively sucking, swallowing, and licking.");
                this.player.refillHunger(50);
                this.player.boostLactation(.1);
                this.getGame().dynStats("cor", 0.2);
                this.player.orgasm('Lips');
                this.player.milked();
            }
            else if (this.player.biggestLactation() > 2) {
                this.outputText(" You lift one of your " + this.player.breastDescript(0) + " to your lips and drink deeply of your bounty.  It floods your cheeks with its creamy flavor, and you greedily gulp it down. Your tongue tingles and vibrates with the sinfully sweet taste in your mouth, dancing in circles around the nipple, coaxing yet more nectar from your swollen jug. It's easy to lose yourself in that taste, falling into a rhythm of alternatively sucking, swallowing, and licking.");

                this.player.refillHunger((this.player.biggestLactation() - 2) * 30 + 20);
                this.player.boostLactation(.1);
                this.getGame().dynStats("cor", 0.2);
                this.player.orgasm('Lips');
                this.player.milked();
            }
            else if (this.player.biggestLactation() > 1) {
                this.outputText(" You lift one of your " + this.player.breastDescript(0) + " to your lips and suck your bounty. You are gulping most of your milk feeling sweet creamy flavor. Your tongue tingles, dancing in circles around the nipple, coaxing yet more nectar from your swollen jug. It's easy to lose yourself in that taste, falling into a rhythm of alternatively sucking, swallowing, and licking.");

                this.player.refillHunger((this.player.biggestLactation() - 1) * 20);
                this.player.boostLactation(.1);
                this.getGame().dynStats("cor", 0.2);
                this.player.orgasm('Lips');
                this.player.milked();
            }
        }
    }

    // 0 = not wearing a bimbo dress, 1 = minimal transformation, 2 = intermediate, 3 = high, 4 = already a bimbo
    public bimboRating(): number {
        if ((this.player.findPerk(PerkLib.BimboBrains) >= 0) && (this.player.findPerk(PerkLib.BimboBody) >= 0)) return 4;

        if (this.ableToProgress()) {

            if (this.flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST] > 25 && this.player.hasVagina() && !this.player.hasCock()) return 3;

            if (this.flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST] > 10 || (this.player.hasVagina() && !this.player.hasCock() && this.player.biggestTitSize() > 2)) return 2;

            return 1;

        }
        else {
            return 0;
        }

    }

    // 0 = not want anal sex, 1 = want buttfuck, 2 = want regular dildo, 3 = want anal madness
    public analCraving(): number {

        // 3 - big ones
        let craving: number = 0;

        if (this.player.ass.analLooseness > 4 || this.player.ass.analWetness > 1 && rand(4) < 3) craving = 3; // 75% chance for big un
        else if (this.player.ass.analLooseness > 3 && this.player.butt.rating > 8 && rand(4) < 3) craving = 3;
        else if (this.player.ass.analLooseness > 2 && this.player.butt.rating >= 12 && rand(4) < 3) craving = 3;

        // 2 - regular-sized
        else if (this.player.ass.analLooseness > 2 && rand(4) < 3) craving = 2;
        else if (this.player.butt.rating > 8 || this.player.ass.analWetness >= 1) craving = 2;

        // 1 - finger
        else if (this.player.ass.analLooseness >= 2 && rand(2) == 0) craving = 1;
        else if (this.player.hasCock() && this.player.butt.rating > 4 && rand(2) == 0) craving = 1;
        else if (this.player.hasCock() && rand(4) == 0) craving = 1;

        if (craving >= 3 && this.player.hasKeyItem("Deluxe Dildo") >= 0) craving = 3;
        else if (craving >= 2 && this.player.hasKeyItem("Dildo") >= 0) craving = 2;
        else craving = 1;

        return craving;

    }

    // 1 - small, 2 - modest, 3 - maddening
    public lipCraving(): number {

        if (this.flags[kFLAGS.TIMES_ORGASM_LIPS] > 50) return 3;
        else if (this.flags[kFLAGS.TIMES_ORGASM_LIPS] > 40 && rand(4) < 3) return 3;
        else if (this.flags[kFLAGS.TIMES_ORGASM_LIPS] > 30 && rand(2) == 0) return 3;
        else if (this.flags[kFLAGS.TIMES_ORGASM_LIPS] > 20 && rand(4) == 0) return 3;
        else if (this.flags[kFLAGS.TIMES_ORGASM_LIPS] > 10 && rand(20) == 0) return 3;

        if (this.flags[kFLAGS.TIMES_ORGASM_LIPS] > 30) return 2;
        else if (this.flags[kFLAGS.TIMES_ORGASM_LIPS] > 20 && rand(4) < 3) return 2;
        else if (this.flags[kFLAGS.TIMES_ORGASM_LIPS] > 10 && rand(2) == 0) return 2;
        else if (rand(4) == 0) return 2;

        return 1;

    }
}

