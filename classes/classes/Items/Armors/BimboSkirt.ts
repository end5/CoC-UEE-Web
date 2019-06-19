import { ArmorWithPerk } from "./ArmorWithPerk";
import { PerkLib } from "../../PerkLib";
import { UndergarmentLib } from "../UndergarmentLib";

/**
 * Created by aimozg on 18.01.14.
 */

export class BimboSkirt extends ArmorWithPerk {

    public constructor() {
        super("BimboSk", "BimboSk", "bimbo skirt", "A skirt that looks like it belongs on a bimbo", 1, 50, "A tight, cleavage-inducing halter top and an extremely short miniskirt.  The sexual allure of this item is undoubtable.", "Light", PerkLib.SluttySeduction, 10, 0, 0, 0, "Your delightfully slutty yet upbeat garb helps you seduce your foes!", undefined, 0, 0, 0, 0, "", false, false);
    }

    public useText(): void { // Produces any text seen when equipping the armor normally

        const wornUpper: boolean = (this.game.player.upperGarment != UndergarmentLib.NOTHING);
        const wornLower: boolean = (this.game.player.lowerGarment != UndergarmentLib.NOTHING);

        if (wornLower && wornLower) {
            this.outputText("You look very awkward wearing " + this.game.player.lowerGarment.longName + " while putting your skirt on.");
            this.outputText(" You realize that you probably won't be able to seduce many of your foes in this ludicrous outfit. For a moment you consider taking your " + this.game.player.lowerGarment.longName + " off, but then decide against it.");
            return;
        }

        this.game.dynStats("lus", 5);

        if (!wornUpper) {
            if (this.game.player.biggestTitSize() >= 8) {
                this.outputText("The halter top clings tightly to your bustline, sending a shiver of pleasure through your body. You feel how your erect [nipples] protrude from the soft fabric of your beautiful dress, and the sensation makes you feel slightly dizzy. ");
                if (this.game.player.isLactating()) {
                    this.outputText("You feel how the top of your dress becomes wet, as droplets of milk leak from your [nipples]. ");
                }
            }
            else if (this.game.player.biggestTitSize() >= 5) {
                this.outputText("The halter top clings to your bustline, sending a shiver of pleasure through your body. ");
                if (this.game.player.isLactating()) {
                    this.outputText("You feel how the top of your dress becomes wet, as droplets of milk leak from your [nipples]. ");
                }
                this.game.dynStats("lus", 2);
            }
            else if (this.game.player.biggestTitSize() >= 2) {
                this.outputText("The halter top of your sluttish outfit snugly embraces your " + this.game.player.breastDescript(0) + ". The sensation of the soft fabric on your bare [nipples] makes you feel warm and sexy. ");
                if (this.game.player.isLactating()) {
                    this.outputText("You feel how the top of your dress becomes wet, as droplets of milk leak from your [nipples]. ");
                }
                this.game.dynStats("lus", 5);
            }
            else if (this.game.player.biggestTitSize() >= 1) {
                this.outputText("You feel how the soft fabric of your dress caresses your " + this.game.player.breastDescript(0) + ". The sensation is very erotic and you touch your sensitive [nipples], feeling the spread of arousal. You idly notice that the halter top of your whorish dress is somewhat loose, and it would feel much better if your breasts were bigger and suppler. ");
                if (this.game.player.isLactating()) {
                    this.outputText("You feel how the top of your dress becomes wet, as droplets of milk leak from your [nipples]. ");
                }
                this.game.dynStats("lus", 10);
            }
            else {
                this.outputText("You feel rather stupid putting the top part on like this, but you're willing to bear with it. As you put it on, you feel how the soft fabric of your dress touches your [nipples], making them erect.");
                this.game.dynStats("lus", 15);
            }
            this.outputText("\n\n");
            this.game.player.orgasm('Tits', false);
        }

        if (!wornLower) {
            if (this.game.player.butt.rating < 8) {
                this.outputText("The sensation of tender fabric clinging to your [butt] arouses you immensely, as you smooth your skirt. ");
            }
            else {
                this.outputText("You can feel how the fine fabric of your sluttish skirt doesn't quite cover your [ass]");
                if (this.game.player.hips.rating > 8) {
                    this.outputText(", and how the smooth skirt is stretched by your [hips]. ");
                }
                else this.outputText(". ");
            }
            if (this.game.player.hasCock()) {
                this.outputText("Your [cock] becomes erect under your obscene skirt, bulging unnaturally. ");
            }
            else if (this.game.player.hasVagina()) {
                switch (this.game.player.vaginas[0].vaginalWetness) {
                    case 5:
                        this.outputText("Your juice constantly escapes your [pussy] and spoils your sexy skirt. ");
                        this.game.dynStats("lus", 5);
                        break;
                    case 4:
                        this.outputText("A thin stream of your girl-cum escapes your [pussy] and spoils your skirt. ");
                        this.game.dynStats("lus", 5);
                        break;
                    case 3:
                        this.outputText("Your [pussy] becomes all tingly and wet under your slutty skirt. ");
                        this.game.dynStats("lus", 5);
                        break;
                    default: // Move along
                }
            }
            if (this.game.player.gender == 0) {
                this.outputText("Despite your lack of features, you indeed feel arousal all over your body. ");
            }
            this.outputText("\n\n");
            this.game.player.orgasm('Anal', false);
            this.game.player.orgasm('Vaginal', false);
        }

        this.game.player.orgasm('Lips', false);
    }

    public get supportsUndergarment(): boolean {
        return this.game.player.isPureEnough(10);
    }

    public canUse(): boolean {

        let wornUpper: boolean = this.game.player.upperGarment != UndergarmentLib.NOTHING;
        const wornLower: boolean = this.game.player.lowerGarment != UndergarmentLib.NOTHING;

        if (!this.game.player.isPureEnough(10)) {
            if (wornUpper || wornLower) {
                let output: string = "";
                output += "It would be awkward to put on " + this.longName + " when you're currently wearing ";
                if (wornUpper) {
                    output += this.game.player.upperGarment.longName;
                    wornUpper = true;
                }
                if (wornLower) {
                    if (wornUpper) {
                        output += " and ";
                    }
                    output += this.game.player.lowerGarment.longName;
                }
                output += ". You should consider removing them. You put it back into your inventory.";
                this.outputText(output);
                return false;
            }
            else
                return true;
        }
        return true;
    }
}
