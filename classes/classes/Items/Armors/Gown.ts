import { Armor } from "../Armor";
import { CoC } from "../../CoC";
import { Gender } from "../../lists/Gender";
import { rand } from "../../Extra";
import { BimboProgression } from "../../Scenes/BimboProgression";
import { BreastCup } from "../../lists/BreastCup";
import { Ears } from "../../BodyParts/Ears";
import { Skin } from "../../BodyParts/Skin";
import { LowerBody } from "../../BodyParts/LowerBody";
import { Arms } from "../../BodyParts/Arms";
import { Claws } from "../../BodyParts/Claws";
import { Face } from "../../BodyParts/Face";
import { Hair } from "../../BodyParts/Hair";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

// forest gown that has a slow progression to a dryad

export class Gown extends Armor implements TimeAwareInterface {
    public constructor() {
        super("FrsGown", "FrsGown", "forest gown", "a forest gown", 1, 10, "This the very earthy gown commonly worn by dryads.   It is made from a mixture of plants.   The predominate fabric looks like a weave of fresh grass.   It is decorated by simple flowers that are attached to it.   Strangely, everything seems alive like it was still planted.   There must be some peculiar magic at work here.", "Light");

        CoC.timeAwareClassAdd(this);
    }

    public useText(): void {
        // Produces any text seen when equipping the armor normally
        switch (kGAMECLASS.player.gender) {
            case Gender.FEMALE:
                this.outputText("You comfortably slide into the forest gown. You spin around several times and giggle happily."
                    + " Where did that come from?");
                break;

            case Gender.MALE:
                this.outputText("You slide forest gown over your head and down to your toes. It obviously would fit someone more female."
                    + " You feel sad and wish you had the svelte body that would look amazing in this gown."
                    + " Wait, did you always think that way?");
                break;
            default:  // non-binary
                this.outputText("You slide the gown over your head and slip it into place.");
        }
        if (kGAMECLASS.player.hasCock())
            this.outputText("You notice the bulge from [cock] in the folds of the dress and wish it wasn't there.\n");
    }

    public timeChangeLarge(): boolean { return false; }

    public timeChange(): boolean {
        if (kGAMECLASS.player.armor instanceof Gown && kGAMECLASS.time.hours == 5) { // only call function once per day as time change is called every hour
            this.dryadProgression();
            return true;
        }
        return false; // stop if not wearing
    }

    public dryadProgression(): void {
        let verb: string;
        let text: string;
        let changed: boolean = false;
        const tfChoice = [];
        const dryadDreams = [
            "In your dream you find yourself in a lush forest standing next to a tree. The tree seems like your best friend and You give it a hug before sitting down next to it. Looking around, there is grass and flowers all about. You can’t help but hum a cheery tune enjoying nature as a bright butterfly flutters nearby, holding out your hand the butterfly lands softly on your finger and smile sweetly to it.",
            "You walk through a meadow and down towards a swift running brook, It looks like some clean water.   You sit down, pull up your gown and admire your feet. They are brown, the color of bark.   You place your feet in the cool water of the brook and soak up the water through your feet,  a cool refreshing feeling fills your body. Ah, being a Dryad is so nice.",
            "Your imagination runs a bit wild and you picture yourself dressed in your nice forest gown eyeing a satyr you stumble across in a grove.   You can't help but smirk as you consider all the fun you could have with him.",
            "You imagine running into a waterfall. You dance around playfully while torrents of water splash against your body.  Your soaked gown scandalously clings to your frame.",
            "You dream about tending to plants in a meadow. Some fairies are following you.  One of them buzzes around your head playfully and kisses you on the cheek.",
            "In your dream you are laying out in a lush glade soaking up the sun. You inspect your leafy hair and find that here are some buds forming. You can't help but wonder what the flowers will look like. ",
            "You dream of a starlight dance in the meadow. Several satyrs, nymphs and dryads are gathered together to celebrate the full moon. You take your gown off and gather around the fairy circle. The half dozen naked revelers dance the night away in the pale moonlight.",
            "You dream of skipping joyfully through a flowered meadow. After a while you kneel down and pick several budding flowers, placing them in your hair  you find that they merge with the leafy vines. They will bloom in a day or so.  It will be so lovely.",
            "In your dream, you and another dryad dance for a reed playing satyr. The dance is very intimate and you can't help wonder how excited the satyr will become from watching. ",
            "You dream of being in a lush grove watching a satyr sleeping. He is leaning up against a tree that you are very fond of! Some mischief is in order. You politely ask the tree for help and it lowers several vines that lift you up and move you above him. The vine lowers you mere inches away from his body. You can practically hear him breathing and his chest rising and falling slowly.  Leaning forward, you nibble on his ear, jolting him awake with a surprised look in his eyes just in time to see the vines recede back into the tree.   Chuckling to yourself, you watch the satry try to figure out what just happened from a branch above him. ",
            "You dream of being in a field surrounded by butterflies. There are blue ones, yellow ones, and pink ones, buthich ones are your favorite?   You spin around in your gown and laugh as you decide they are all your favorite!",
            "You dream about wandering around in the mountains. There is snow everywhere, and you notice something off in the distance digging its way out from under the snow. It’s a big bear and two smaller ones pawing their way out! You gleefully saunter up and say, 'Hello Mrs.bear, did you and your children enjoy your nap?'   You awake shortly after the strange dream, feeling confused. Was that really you?",
            "You dream about sitting on a tree branch in your lovely gown. You freely hang off the large oak, dangling over the side while your legs hold you up.   Your gown falls down to your arms and hangs over your head. You get excited, pondering if someone might be watching and just got flashed.   You sit back up and straighten out your gown,  coy smile playing across your face.",
        ];
        // display a random dream
        this.clearOutput();
        this.outputText("\n\n" + dryadDreams[rand(dryadDreams.length)] + "\n\n");
        // build a list of non ideal parts
        if (kGAMECLASS.player.hips.rating != 5)
            tfChoice.push("hips");
        if (kGAMECLASS.player.butt.rating != 5)
            tfChoice.push("butt");
        if (kGAMECLASS.player.hasCock())
            tfChoice.push("cock");
        if (kGAMECLASS.player.breastRows[0].breastRating != 4 || kGAMECLASS.player.bRows() > 1)
            tfChoice.push("breasts");
        if (kGAMECLASS.player.femininity < 70)
            tfChoice.push("girlyness");

        // progress slowly to the ideal dryad build
        switch (Gown.randomChoice(tfChoice)) {
            case "hips":
                this.outputText("You wiggle around in your gown, the pleasant feeling of flower petals rubbing against your skin washes over you."
                    + " The feeling settles on your [hips].\n");

                if (kGAMECLASS.player.hips.rating < 5) {
                    verb = "enlarge";
                    kGAMECLASS.player.hips.rating++;
                } else {
                    verb = "shrink";
                    kGAMECLASS.player.hips.rating--;
                }

                this.outputText("You feel them slowly " + verb + ".<b>  You now have [hips].</b>\n");
                changed = true;
                break;

            case "butt":
                this.outputText("You wiggle around in your gown, the pleasant feeling of flower petals rubbing against your skin washes over you."
                    + "The feeling settles on your [butt].\n");

                if (kGAMECLASS.player.butt.rating < 5) {
                    verb = "enlarge";
                    kGAMECLASS.player.butt.rating++;
                } else {
                    verb = "shrink";
                    kGAMECLASS.player.butt.rating--;
                }

                this.outputText("You feel them slowly " + verb + ". <b>You now have a [butt].</b>");
                changed = true;
                break;

            case "cock":
                this.outputText("Your [cock] feels strange as it brushes against the fabric of your gown.\n");
                (new BimboProgression()).shrinkCock();
                changed = true;
                break;

            case "breasts":
                this.outputText("You feel like a beautful flower in your gown. Dawn approaches and you place your hands on your chest"
                    + " as if expecting your nipples to bloom to greet the rising sun.\n");

                if (kGAMECLASS.player.bRows() > 1) {
                    this.outputText("Some of your breasts shrink back into your body leaving you with just two.");
                    kGAMECLASS.player.breastRows.length = 1;
                }

                if (kGAMECLASS.player.breastRows[0].breastRating !== BreastCup.D) {
                    if (kGAMECLASS.player.breastRows[0].breastRating > BreastCup.D) {
                        this.outputText("\nA chill runs against your chest and your boobs become smaller.");
                    } else {
                        this.outputText("\nHeat builds in chest and your boobs become bigger.");
                    }
                    this.outputText("\n<b>You now have [breasts]</b>");
                    kGAMECLASS.player.breastRows[0].breastRating = BreastCup.D;
                    changed = true;
                }
                break;

            case "girlyness":
                text = kGAMECLASS.player.modFem(70, 2);
                if (text == "") break;
                this.outputText("You run your [hands] across the fabric of your Gown, then against your face as it feels like"
                    + " there is something you need to wipe off.\n");
                this.outputText(text);
                changed = true;
                break;

            default:
            // no error, intended
        }
        this.outputText("\n\n"); // spacing issues
        if (!changed) {
            this.dryadProg(); // if no small changes, start big changes
        }
    }

    public dryadProg(): void {
        // types of changes
        const tfChoice: string = Gown.randomChoice("skin", "ears", "face", "lowerbody", "arms", "hair");
        this.outputText("\n\n");
        switch (tfChoice) {
            case "ears":
                if (kGAMECLASS.player.ears.type !== Ears.ELFIN) {
                    this.outputText("There is a tingling on the sides of your head as your ears change to pointed elfin ears.");
                    kGAMECLASS.player.ears.type = Ears.ELFIN;
                }
                break;

            case "skin":
                if (kGAMECLASS.player.skin.type !== Skin.PLAIN) {
                    this.outputText("A tingling runs up along your [skin] as it changes back to normal");
                } else if (kGAMECLASS.player.skin.tone !== "bark" && kGAMECLASS.player.skin.type == Skin.PLAIN) {
                    this.outputText("Your skin hardens and becomes the consistency of tree’s bark.");
                    kGAMECLASS.player.skin.tone = "woodly brown";
                    kGAMECLASS.player.skin.type = Skin.BARK;
                }
                break;

            case "lowerbody":
                if (kGAMECLASS.player.lowerBody.type !== LowerBody.HUMAN) {
                    this.outputText("There is a rumbling in your lower body as it returns to a human shape.");
                    kGAMECLASS.player.lowerBody.type = LowerBody.HUMAN;
                }
                break;

            case "arms":
                if (kGAMECLASS.player.arms.type !== Arms.HUMAN || kGAMECLASS.player.arms.claws.type !== Claws.NORMAL) {
                    this.outputText("Your hands shake and shudder as they slowly transform back into normal human hands.");
                    kGAMECLASS.player.arms.restore();
                }
                break;

            case "face":
                if (kGAMECLASS.player.face.type !== Face.HUMAN) {
                    this.outputText("Your face twitches a few times and slowly morphs itself back to a normal human face.");
                    kGAMECLASS.player.face.type = Face.HUMAN;
                }
                break;

            case "hair":
                if (kGAMECLASS.player.hair.type !== Hair.LEAF) {
                    this.outputText("Much to your shock, your hair begins falling out in tuffs onto the ground. "
                        + " Moments later, your scalp sprouts vines all about that extend down and bloom into leafy hair.");
                    kGAMECLASS.player.hair.type = Hair.LEAF;
                }
                break;

            default:
                this.outputText("\nERROR: this forest gown TF choice shouldn't ever get called.");
        }
    }
}
