import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { rand } from "../../Extra";
import { PerkLib } from "../../PerkLib";

/**
 * Balls and cum transformation item.
 */
export class SuccubisDream extends Consumable {

    public constructor() {
        super("S.Dream", "S.Dream", "a bottle of 'Succubus' Dream'", ConsumableLib.DEFAULT_VALUE, "This precious fluid is often given to men a succubus intends to play with for a long time, though this batch has been enhanced by Lumi to have even greater potency.");
    }

    public useItem(): boolean {
        this.player.slimeFeed();

        let temp: number = 0;
        let crit: number = 1;
        // Determine crit multiplier (x2 or x3)
        crit += rand(2) + 1;
        this.mutations.initTransformation([2, 2]);
        // Generic drinking text
        this.clearOutput();
        this.outputText("You uncork the bottle and drink down the strange substance, struggling to down the thick liquid.");
        // low corruption thoughts
        if (this.player.cor < 33) this.outputText("  This stuff is gross, why are you drinking it?");
        // high corruption
        if (this.player.cor >= 66) this.outputText("  You lick your lips, marvelling at how thick and sticky it is.");
        // Corruption increase
        if (this.player.cor < 50 || rand(2)) {
            this.outputText("\n\nThe drink makes you feel... dirty.");
            temp = 1;
            // Corrupts the uncorrupted faster
            if (this.player.cor < 50) temp++;
            if (this.player.cor < 40) temp++;
            if (this.player.cor < 30) temp++;
            // Corrupts the very corrupt slower
            if (this.player.cor >= 90) temp = .5;
            this.dynStats("cor", temp + 2);
            this.changes++;
        }
        // NEW BALLZ
        if (this.player.balls < 4) {
            if (this.player.balls > 0) {
                this.player.balls = 4;
                this.outputText("\n\nIncredible pain scythes through your crotch, doubling you over.  You stagger around, struggling to pull open your " + this.player.armorName + ".  In shock, you barely register the sight before your eyes: <b>You have four balls.</b>");
            }
            if (this.player.balls === 0) {
                this.player.balls = 2;
                this.outputText("\n\nIncredible pain scythes through your crotch, doubling you over.  You stagger around, struggling to pull open your " + this.player.armorName + ".  In shock, you barely register the sight before your eyes: <b>You have balls!</b>");
                this.player.ballSize = 1;
            }
            this.changes++;
        }
        // Makes your balls biggah! (Or cummultiplier higher if futa!)
        if (rand(1.5) === 0 && this.changes < this.changeLimit && this.player.balls > 0 && this.player.cocks.length > 0) {
            this.player.ballSize++;
            // They grow slower as they get bigger...
            if (this.player.ballSize > 10) this.player.ballSize -= .5;
            // Texts
            if (this.player.ballSize <= 2) this.outputText("\n\nA flash of warmth passes through you and a sudden weight develops in your groin.  You pause to examine the changes and your roving fingers discover your " + this.player.simpleBallsDescript() + " have grown larger than a human's.");
            if (this.player.ballSize > 2) this.outputText("\n\nA sudden onset of heat envelops your groin, focusing on your " + this.player.sackDescript() + ".  Walking becomes difficult as you discover your " + this.player.simpleBallsDescript() + " have enlarged again.");
            this.dynStats("lib", 1, "lus", 3);
        }
        // Boost cum multiplier
        if (this.changes < this.changeLimit && rand(2) === 0 && this.player.cocks.length > 0) {
            if (this.player.cumMultiplier < 6 && rand(2) === 0 && this.changes < this.changeLimit) {
                // Temp is the max it can be raised to
                temp = 3;
                // Lots of cum raises cum multiplier cap to 6 instead of 3
                if (this.player.findPerk(PerkLib.MessyOrgasms) >= 0) temp = 6;
                if (temp < this.player.cumMultiplier + .4 * crit) {
                    this.changes--;
                }
                else {
                    this.player.cumMultiplier += .4 * crit;
                    // Flavor text
                    if (this.player.balls === 0) this.outputText("\n\nYou feel a churning inside your body as something inside you changes.");
                    if (this.player.balls > 0) this.outputText("\n\nYou feel a churning in your " + this.player.ballsDescriptLight() + ".  It quickly settles, leaving them feeling somewhat more dense.");
                    if (crit > 1) this.outputText("  A bit of milky pre dribbles from your " + this.player.multiCockDescriptLight() + ", pushed out by the change.");
                    this.dynStats("lib", 1);
                }
                this.changes++;
            }
        }
        // Fail-safe
        if (this.changes === 0) {
            this.outputText("\n\nYour groin tingles, making it feel as if you haven't cum in a long time.");
            this.player.hoursSinceCum += 100;
            this.changes++;
        }
        if (this.player.balls > 0 && rand(3) === 0) {
            this.outputText(this.player.modFem(12, 5));
        }
        this.player.refillHunger(15);

        return false;
    }
}
