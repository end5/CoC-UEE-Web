import { Consumable } from "../Consumable";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { PerkLib } from "../../PerkLib";
import { Vagina } from "../../Vagina";
import { rand, int } from "../../Extra";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

/**
 * @since March 30, 2018
 * @author Stadler76
 */
export class MinotaurCum extends Consumable {
    public static STANDARD: number = 0;
    public static PURIFIED: number = 1;

    private purified: boolean;

    public constructor(type: number) {
        let id: string;
        let shortName: string;
        let longName: string;
        let description: string;
        let value: number;

        switch (type) {
            case MinotaurCum.STANDARD:
                id = "MinoCum";
                shortName = "MinoCum";
                longName = "a sealed bottle of minotaur cum";
                description = "This bottle of minotaur cum looks thick and viscous."
                    + " You know it has narcotic properties, but aside from that its effects are relatively unknown.";
                value = 60;
                break;

            case MinotaurCum.PURIFIED:
                id = "P.M.Cum";
                shortName = "P.MinoCum";
                longName = "a sealed bottle of purified minotaur cum";
                description = "This bottle of minotaur cum looks thick and viscous."
                    + " You know it has narcotic properties, but aside from that its effects are relatively unknown."
                    + " This bottle of cum has been purified to prevent corruption and addiction.";
                value = 30;
                break;

            default: // Remove this if someone manages to get SonarQQbe to not whine about a missing default ... ~Stadler76
                throw new Error("Minotaur Cum. Incorrect or no type was passed to constructor");
        }

        super(id, shortName, longName, value, description);
        this.purified = type === MinotaurCum.PURIFIED;
    }

    public useItem(): boolean {
        this.player.slimeFeed();
        this.clearOutput();
        // Minotaur cum addiction
        if (!this.purified) this.player.minoCumAddiction(7);
        else this.player.minoCumAddiction(-2);
        this.outputText("As soon as you crack the seal on the bottled white fluid, a ");
        if (this.flags[kFLAGS.MINOTAUR_CUM_ADDICTION_STATE] == 0 && !this.player.hasPerk(PerkLib.MinotaurCumResistance)) this.outputText("potent musk washes over you.");
        else this.outputText("heavenly scent fills your nostrils.");
        if (!this.purified) {
            if (this.flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] < 50) this.outputText("  It makes you feel dizzy, ditzy, and placid.");
            else this.outputText("  It makes you feel euphoric, happy, and willing to do ANYTHING to keep feeling this way.");
        }
        else this.outputText("  You know that the bottle is purified and you're positive you won't get any addiction from this bottle.");
        this.outputText("  Unbidden, your hand brings the bottle to your lips, and the heady taste fills your mouth as you convulsively swallow the entire bottle.");
        // -Raises lust by 10.
        // -Raises sensitivity
        this.dynStats("sen", 1, "lus", 10);
        // -Raises corruption by 1 to 50, then by .5 to 75, then by .25 to 100.
        if (!this.purified) {
            if (this.player.cor < 50) this.dynStats("cor", 1);
            else if (this.player.cor < 75) this.dynStats("cor", .5);
            else this.dynStats("cor", .25);
        }
        this.outputText("\n\nIntermittent waves of numbness wash through your body, turning into a warm tingling that makes you feel sensitive all over.  The warmth flows through you, converging in your loins and bubbling up into lust.");
        if (this.player.cocks.length > 0) {
            this.outputText("  ");
            if (this.player.cockTotal() == 1) this.outputText("Y");
            else this.outputText("Each of y");
            this.outputText("our " + this.player.multiCockDescriptLight() + " aches, flooding with blood until it's bloating and trembling.");
        }
        if (this.player.hasVagina()) {
            this.outputText("  Your " + this.player.clitDescript() + " engorges, ");
            if (this.player.getClitLength() < 3) this.outputText("parting your lips.");
            else this.outputText("bursting free of your lips and bobbing under its own weight.");
            if (this.player.vaginas[0].vaginalWetness <= Vagina.WETNESS_NORMAL) this.outputText("  Wetness builds inside you as your " + this.player.vaginaDescript(0) + " tingles and aches to be filled.");
            else if (this.player.vaginas[0].vaginalWetness <= Vagina.WETNESS_SLICK) this.outputText("  A trickle of wetness escapes your " + this.player.vaginaDescript(0) + " as your body reacts to the desire burning inside you.");
            else if (this.player.vaginas[0].vaginalWetness <= Vagina.WETNESS_DROOLING) this.outputText("  Wet fluids leak down your thighs as your body reacts to this new stimulus.");
            else this.outputText("  Slick fluids soak your thighs as your body reacts to this new stimulus.");
        }
        // (Minotaur fantasy)
        if (!kGAMECLASS.inCombat && rand(10) == 1 && (!this.purified && !this.player.hasPerk(PerkLib.MinotaurCumResistance))) {
            this.outputText("\n\nYour eyes flutter closed for a second as a fantasy violates your mind.  You're on your knees, prostrate before a minotaur.  Its narcotic scent fills the air around you, and you're swaying back and forth with your belly already sloshing and full of spunk.  Its equine-like member is rubbing over your face, and you submit to the beast, stretching your jaw wide to take its sweaty, glistening girth inside you.  Your tongue quivers happily as you begin sucking and slurping, swallowing each drop of pre-cum you entice from the beastly erection.  Gurgling happily, you give yourself to your inhuman master for a chance to swallow into unthinking bliss.");
            this.dynStats("lib", 1, "lus", rand(5) + this.player.cor / 20 + this.flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] / 5);
        }
        // (Healing – if hurt and uber-addicted (hasperk))
        if (this.player.HP < this.player.maxHP() && this.player.hasPerk(PerkLib.MinotaurCumAddict)) {
            this.outputText("\n\nThe fire of your arousal consumes your body, leaving vitality in its wake.  You feel much better!");
            this.player.HPChange(int(this.player.maxHP() / 4), false);
        }
        // Uber-addicted status!
        if (this.player.hasPerk(PerkLib.MinotaurCumAddict) && this.flags[kFLAGS.MINOTAUR_CUM_REALLY_ADDICTED_STATE] <= 0 && !this.purified) {
            this.flags[kFLAGS.MINOTAUR_CUM_REALLY_ADDICTED_STATE] = 3 + rand(2);
            this.outputText("\n\n<b>Your body feels so amazing and sensitive.  Experimentally you pinch yourself and discover that even pain is turning you on!</b>");
        }
        // Clear mind a bit
        if (this.purified && (this.player.hasPerk(PerkLib.MinotaurCumAddict) || this.flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] >= 40)) {
            this.outputText("\n\nYour mind feels a bit clearer just from drinking the purified minotaur cum. Maybe if you drink more of these, you'll be able to rid yourself of your addiction?");
            if (this.player.hasPerk(PerkLib.MinotaurCumAddict) && this.flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] <= 50) {
                this.outputText("  Suddenly, you black out and images flash in your mind about getting abducted by minotaurs and the abandonment of your quest that eventually leads to Lethice's success in taking over Mareth. No, it cannot be! You wake up and recover from the blackout, horrified to find out what would really happen if you spend the rest of your life with the Minotaurs! You shake your head and realize that you're no longer dependent on the cum.  ");
                this.outputText("\n<b>(Lost Perk: Minotaur Cum Addict!)</b>");
                this.player.removePerk(PerkLib.MinotaurCumAddict);
            }

        }
        this.player.refillHunger(25);

        return false;
    }
}
