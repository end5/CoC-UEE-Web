import { Consumable } from "../Consumable";
import { PerkLib } from "../../PerkLib";
import { StatusEffects } from "../../StatusEffects";

/**
 * Maximum manliness!
 */
export class BroBrew extends Consumable {
    private static ITEM_VALUE: number = 1000;

    public constructor() {
        super("BroBrew", "BroBrew", "a can of Bro Brew", BroBrew.ITEM_VALUE, "This aluminum can is labelled as 'Bro Brew'.  It even has a picture of a muscly, bare-chested man flexing on it.  A small label in the corner displays: \"Demon General's Warning: Bro Brew's effects are as potent (and irreversible) as they are refreshing.");
    }

    public useItem(): boolean {
        this.player.slimeFeed();
        this.clearOutput();
        // no drink for bimbos!
        if (this.player.findPerk(PerkLib.BimboBody) >= 0) {
            this.outputText("The stuff hits you like a giant cube, nearly staggering you as it begins to settle.");
            if (this.player.tallness < 77) {
                this.player.tallness = 77;
                this.outputText(".. Did the ground just get farther away?  You glance down and realize, you're growing!  Like a sped-up flower sprout, you keep on getting taller until finally stopping around... six and a half feet, you assume.  Huh.  You didn't expect that to happen!");
            }
            if (this.player.tone < 100) {
                this.outputText("  A tingling in your arm draws your attention just in time to see your biceps and triceps swell with new-found energy, skin tightening until thick cords of muscle run across the whole appendage.  Your other arm surges forward with identical results.  To compensate, your shoulders and neck widen to bodybuilder-like proportions while your chest and abs tighten to a firm, statuesque physique.  Your " + this.player.legs() + " and glutes are the last to go, bulking up to proportions that would make any female martial artist proud.  You feel like you could kick forever with legs this powerful.");
                this.player.tone = 100;
            }
            this.outputText("\n\n");

            // female
            if (!this.player.hasCock()) {
                this.outputText("The beverage isn't done yet, however, and it makes it perfectly clear with a building pleasure in your groin.  You can only cry in ecstasy and loosen the bottoms of your " + this.player.armorName + " just in time for a little penis to spring forth.  You watch, enthralled, as blood quickly stiffens the shaft to its full length – then keeps on going!  Before long, you have a quivering 10-inch maleness, just ready to stuff into a welcoming box.");
                this.player.createCock();
                this.player.cocks[0].cockLength = 10;
                this.player.cocks[0].cockThickness = 2;
                if (this.player.balls === 0) {
                    this.outputText("  Right on cue, two cum-laden testicles drop in behind it, their contents swirling and churning.");
                    this.player.balls = 2;
                    this.player.ballSize = 3;
                }
                this.outputText("\n\n");
            }
            else if (this.player.balls === 0) {
                this.outputText("A swelling begins behind your man-meat, and you're assailed with an incredibly peculiar sensation as two sperm-filled balls drop into a newly-formed scrotum.  Frikkin' sweet!\n\n");
                this.player.balls = 2;
                this.player.ballSize = 3;
            }
            this.outputText("Finally, you feel the transformation skittering to a halt, leaving you to openly roam your new chiseled and sex-ready body.  So what if you can barely form coherent sentences anymore?  A body like this does all the talking you need, you figure!");
            if (this.player.inte > 35) {
                const boost: number = (this.player.inte - 35) / 5;
                this.player.inte = 35 + boost;
                this.dynStats("int", -0.1);

            }
            if (this.player.lib < 50) {
                this.player.lib = 50;
                this.dynStats("lib", .1);
            }
            this.outputText("\n\n");
            if (this.player.findPerk(PerkLib.BimboBrains) >= 0) this.outputText("<b>(Lost Perks - Bimbo Brains, Bimbo Body)\n");
            else this.outputText("<b>(Lost Perk - Bimbo Body)\n");
            this.player.removePerk(PerkLib.BimboBrains);
            this.player.removePerk(PerkLib.BimboBody);
            this.player.createPerk(PerkLib.FutaForm, 0, 0, 0, 0);
            this.player.createPerk(PerkLib.FutaFaculties, 0, 0, 0, 0);
            this.outputText("(Gained Perks - Futa Form, Futa Faculties)</b>");
            return false;
        }
        // HP restore for bros!
        if (this.player.findPerk(PerkLib.BroBody) >= 0 || this.player.findPerk(PerkLib.FutaForm) >= 0) {
            this.outputText("You crack open the can and guzzle it in a hurry.  Goddamn, this shit is the best.  As you crush the can against your forehead, you wonder if you can find a six-pack of it somewhere?\n\n");
            this.player.changeFatigue(-33);
            this.player.HPChange(100, true);
            this.player.refillHunger(30);
            return false;
        }
        this.outputText("Well, maybe this will give you the musculature that you need to accomplish your goals.  You pull on the tab at the top and hear the distinctive snap-hiss of venting, carbonating pressure.  A smoky haze wafts from the opened container, smelling of hops and alcohol.  You lift it to your lips, the cold, metallic taste of the can coming to your tongue before the first amber drops of beer roll into your waiting mouth.  It tingles, but it's very, very good.  You feel compelled to finish it as rapidly as possible, and you begin to chug it.  You finish the entire container in seconds.\n\n");

        this.outputText("A churning, full sensation wells up in your gut, and without thinking, you open wide to release a massive burp. It rumbles through your chest, startling birds into flight in the distance.  Awesome!  You slam the can into your forehead hard enough to smash the fragile aluminum into a flat, crushed disc.  Damn, you feel stronger already");
        if (this.player.inte > 50) this.outputText(", though you're a bit worried by how much you enjoyed the simple, brutish act");
        this.outputText(".\n\n");

        // (Tits b' gone)
        if (this.player.biggestTitSize() >= 1) {
            this.outputText("A tingle starts in your " + this.player.nippleDescript(0) + "s before the tight buds grow warm, hot even.  ");
            if (this.player.biggestLactation() >= 1) this.outputText("Somehow, you know that the milk you had been producing is gone, reabsorbed by your body.  ");
            this.outputText("They pinch in towards your core, shrinking along with your flattening " + this.player.allChestDesc() + ".  You shudder and flex in response.  Your chest isn't just shrinking, it's reforming, sculping itself into a massive pair of chiseled pecs.  ");
            if (this.player.breastRows.length > 1) {
                this.outputText("The breasts below vanish entirely.  ");
                while (this.player.breastRows.length > 1) {
                    this.player.removeBreastRow(this.player.breastRows.length - 1, 1);
                }
            }
            this.player.breastRows[0].breastRating = 0;
            this.player.breastRows[0].nipplesPerBreast = 1;
            this.player.breastRows[0].fuckable = false;
            if (this.player.nippleLength > .5) this.player.nippleLength = .25;
            this.player.breastRows[0].lactationMultiplier = 0;
            this.player.removeStatusEffect(StatusEffects.Feeder);
            this.player.removePerk(PerkLib.Feeder);
            this.outputText("All too soon, your boobs are gone.  Whoa!\n\n");
        }

        this.outputText("Starting at your hands, your muscles begin to contract and release, each time getting tighter, stronger, and more importantly - larger.  The oddness travels up your arms, thickens your biceps, and broadens your shoulders.  Soon, your neck and chest are as built as your arms.  You give a few experimental flexes as your abs ");
        if (this.player.tone >= 70) this.outputText("further define themselves");
        else this.outputText("become extraordinarily visible");
        this.outputText(".  The strange, muscle-building changes flow down your " + this.player.legs() + ", making them just as fit and strong as the rest of you.  You curl your arm and kiss your massive, flexing bicep.  You're awesome!\n\n");

        this.outputText("Whoah, you're fucking ripped and strong, not at all like the puny weakling you were before.  Yet, you feel oddly wool-headed.  Your thoughts seem to be coming slower and slower, like they're plodding through a marsh.  You grunt in frustration at the realization.  Sure, you're a muscle-bound hunk now, but what good is it if you're as dumb as a box of rocks?  Your muscles flex in the most beautiful way, so you stop and strike a pose, mesmerized by your own appearance.  Fuck thinking, that shit's for losers!\n\n");

        // (has dick less than 10 inches)
        if (this.player.hasCock()) {
            if (this.player.cocks[0].cockLength < 10) {
                this.outputText("As if on cue, the familiar tingling gathers in your groin, and you dimly remember you have one muscle left to enlarge.  If only you had the intelligence left to realize that your penis is not a muscle.  In any event, your " + this.player.cockDescript(0) + " swells in size, ");
                if (this.player.cocks[0].cockThickness < 2.75) {
                    this.outputText("thickening and ");
                    this.player.cocks[0].cockThickness = 2.75;
                }
                this.outputText("lengthening until it's ten inches long and almost three inches wide.  Fuck, you're hung!  ");
                this.player.cocks[0].cockLength = 10;
            }
            // Dick already big enough! BALL CHECK!
            if (this.player.balls > 0) {
                this.outputText("Churning audibly, your " + this.player.sackDescript() + " sways, but doesn't show any outward sign of change.  Oh well, it's probably just like, getting more endurance or something.");
            }
            else {
                this.outputText("Two rounded orbs drop down below, filling out a new, fleshy sac above your " + this.player.legs() + ".  Sweet!  You can probably cum buckets with balls like these.");
                this.player.balls = 2;
                this.player.ballSize = 3;
            }
            this.outputText("\n\n");
        }
        // (No dick)
        else {
            this.outputText("You hear a straining, tearing noise before you realize it's coming from your underwear.  Pulling open your " + this.player.armorName + ", you gasp in surprise at the huge, throbbing manhood that now lies between your " + this.player.hipDescript() + ".  It rapidly stiffens to a full, ten inches, and goddamn, it feels fucking good.  You should totally find a warm hole to fuck!");
            if (this.player.balls === 0) this.outputText("  Two rounded orbs drop down below, filling out a new, fleshy sac above your " + this.player.legs() + ".  Sweet!  You can probably cum buckets with balls like these.");
            this.outputText("\n\n");
            this.player.createCock();
            this.player.cocks[0].cockLength = 12;
            this.player.cocks[0].cockThickness = 2.75;
            if (this.player.balls === 0) {
                this.player.balls = 2;
                this.player.ballSize = 3;
            }
        }
        // (Pussy b gone)
        if (this.player.hasVagina()) {
            this.outputText("At the same time, your " + this.player.vaginaDescript(0) + " burns hot, nearly feeling on fire.  You cuss in a decidedly masculine way for a moment before the pain fades to a dull itch.  Scratching it, you discover your lady-parts are gone.  Only a sensitive patch of skin remains.\n\n");
            this.player.removeVagina(0, 1);
        }
        // (below max masculinity)
        if (this.player.femininity > 0) {
            this.outputText("Lastly, the change hits your face.  You can feel your jawbones shifting and sliding around, your skin changing to accommodate your face's new shape.  Once it's finished, you feel your impeccable square jaw and give a wide, easy-going grin.  You look awesome!\n\n");
            this.player.modFem(0, 100);
        }
        this.outputText("You finish admiring yourself and adjust your " + this.player.armorName + " to better fit your new physique.  Maybe there's some bitches around you can fuck.  Hell, as good as you look, you might have other dudes wanting you to fuck them too, no homo.\n\n");
        // max tone.  Thickness + 50
        this.player.modTone(100, 100);
        this.player.modThickness(100, 50);
        // Bonus cum production!
        this.player.createPerk(PerkLib.BroBrains, 0, 0, 0, 0);
        this.player.createPerk(PerkLib.BroBody, 0, 0, 0, 0);
        this.outputText("<b>(Bro Body - Perk Gained!)\n");
        this.outputText("(Bro Brains - Perk Gained!)</b>\n"); // int to 20.  max int 50)
        if (this.player.findPerk(PerkLib.Feeder) >= 0) {
            this.outputText("<b>(Perk Lost - Feeder!)</b>\n");
            this.player.removePerk(PerkLib.Feeder);
        }
        if (this.player.inte > 21) {
            const boost = (this.player.inte - 20) / 4;
            this.player.inte = 21 + boost;
        }
        this.dynStats("str", 33, "tou", 33, "int", -1, "lib", 4, "lus", 40);
        this.player.refillHunger(30);

        return false;
    }
}
