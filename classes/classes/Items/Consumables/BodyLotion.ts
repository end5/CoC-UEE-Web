import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { Skin } from "../../BodyParts/Skin";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

/**
 * Body lotions, courtesy of Foxxling.
 * @author Kitteh6660
 */
export class BodyLotion extends Consumable {
    private _adj: string;

    public constructor(id: string, adj: string, longAdj: string) {
        const shortName: string = adj + " Ltn";
        const longName: string = "a flask of " + adj + " lotion";
        const value: number = ConsumableLib.DEFAULT_VALUE;
        const description: string = "A small wooden flask filled with a " + longAdj + " . A label across the front says, \"" + adj + " Lotion.\"";
        super(id, shortName, longName, value, description);
        this._adj = adj.toLowerCase();
    }

    private liquidDesc(): string {
        let phrase: string = "";
        switch (this._adj) {
            case "smooth": phrase = BodyLotion.randomChoice(["smooth liquid", "thick cream"]); break;
            case "rough": phrase = BodyLotion.randomChoice(["abrasive goop", "rough textured goop"]); break;
            case "sexy": phrase = BodyLotion.randomChoice(["smooth liquid", "attractive cream", "beautiful cream"]); break;
            case "clear": phrase = BodyLotion.randomChoice(["smooth liquid", "thick cream"]); break;
            default: phrase = "cream"; // Failsafe
        }
        return phrase;
    }

    public useItem(): boolean {
        if (!this.game.player.hasUnderBody()) {
            this.lotionSkin();
            return true;
        }

        this.clearOutput();
        this.outputText("The skin on your underBody is different from the rest. Where do you want to apply the " + this._adj + " body lotion?");

        kGAMECLASS.output.menu();
        kGAMECLASS.output.addButton(0, "Body", this.lotionSkin);
        kGAMECLASS.output.addButton(1, "Underbody", this.lotionUnderBodySkin);
        kGAMECLASS.output.addButton(4, "Nevermind", this.lotionCancel);
        return true;
    }

    public lotionSkin(): void {
        if (this.game.player.skin.adj == this._adj) {
            this.outputText("You " + this.game.player.clothedOrNaked("take a second to disrobe before uncorking the flask of lotion and rubbing", "uncork the flask of lotion and rub") + " the " + this.liquidDesc() + " across your body. Once you’ve finished you feel reinvigorated. ");
            this.player.HPChange(10, true);
        }
        else {
            if ([Skin.GOO, Skin.DRAGON_SCALES].indexOf(this.game.player.skin.type) == -1) { // If skin is goo or dragon scales, don't change.
                this.game.player.skin.adj = this._adj != "clear" ? this._adj : "";
            }
            switch (this.game.player.skin.type) {
                case Skin.PLAIN: // Plain
                    this.outputText("You " + this.game.player.clothedOrNaked("take a second to disrobe before uncorking the flask of lotion and rubbing", "uncork the flask of lotion and rub") + " the " + this.liquidDesc() + " across your body. As you rub the mixture into your arms and [chest], your whole body begins to tingle pleasantly. ");
                    switch (this._adj) {
                        case "smooth":
                            this.outputText("Soon your skin is smoother but in a natural healthy way.");
                            break;
                        case "rough":
                            this.outputText("Soon your skin is rougher as if you’ve just finished a long day’s work.");
                            break;
                        case "sexy":
                            this.outputText("Soon your skin is so sexy you find it hard to keep your hands off yourself.");
                            break;
                        case "clear":
                            this.outputText("Soon the natural beauty of your [skinFurScales] is revealed without anything extra or unnecessary.");
                            break;
                        default: // Failsafe
                            this.outputText("<b>This text should not happen. Please let Kitteh6660 know.</b>");
                    }
                    break;
                case Skin.FUR: // Fur
                    this.outputText("" + this.game.player.clothedOrNaked("Once you’ve disrobed you take the lotion and", "You take the lotion and") + " begin massaging it into your skin despite yourself being covered with fur. It takes little effort but once you’ve finished... nothing happens. A few moments pass and then your skin begins to tingle. ");
                    switch (this._adj) {
                        case "smooth":
                            this.outputText("Soon you part your fur to reveal smooth skin that still appears natural.");
                            break;
                        case "rough":
                            this.outputText("Soon you part your fur to reveal rough skin that still appears natural.");
                            break;
                        case "sexy":
                            this.outputText("Soon you part your fur to reveal sexy skin that makes you want to kiss yourself.");
                            break;
                        case "clear":
                            this.outputText("Soon you part your fur to reveal the natural beauty of your skin.");
                            break;
                        default: // Failsafe
                            this.outputText("<b>This text should not happen. Please let Kitteh6660 know.</b>");
                    }
                    break;
                case Skin.LIZARD_SCALES: // Scales
                case Skin.FISH_SCALES: // Scales
                    this.outputText("You " + this.game.player.clothedOrNaked("take a second to disrobe before uncorking the flask of lotion and rubbing", "uncork the flask of lotion and rub") + " the " + this.liquidDesc() + " across your body. As you rub the mixture into your arms and [chest], your whole body begins to tingle pleasantly.");
                    switch (this._adj) {
                        case "smooth":
                            this.outputText("Soon your scales are smoother but in a natural healthy way.");
                            break;
                        case "rough":
                            this.outputText("Soon your scales are rougher as if you’ve just finished a long day’s work.");
                            break;
                        case "sexy":
                            this.outputText("Soon your scales are so sexy you find it hard to keep your hands off yourself.");
                            break;
                        case "clear":
                            this.outputText("Soon the natural beauty of your [skinFurScales] is revealed without anything extra or unnecessary.");
                            break;
                        default: // Failsafe
                            this.outputText("<b>This text should not happen. Please let Kitteh6660 know.</b>");
                    }
                    break;
                case Skin.GOO: // Goo
                    this.outputText("You take the lotion and pour the " + this.liquidDesc() + " into yourself. The concoction dissolves, leaving your gooey epidermis unchanged. As a matter of fact nothing happens at all.");
                    // No changes due to gooey skin.
                    break;
                case Skin.DRAGON_SCALES: // Dragon scales
                    this.outputText("You take the lotion and pour the " + this.liquidDesc() + " on your scales. The concoction dissolves, leaving your dragon scales unchanged. As a matter of fact nothing happens at all.");
                    // No changes due to dragon scales.
                    break;
                default:
                    this.outputText("You " + this.game.player.clothedOrNaked("take a second to disrobe before uncorking the bottle of oil and rubbing", "uncork the bottle of oil and rub") + " the smooth liquid across your body. Even before you’ve covered your arms and [chest] your skin begins to tingle pleasantly all over. After your skin darkens a little, it begins to change until you have " + this._adj + " skin.");
            }
        }
        this.game.inventory.itemGoNext();
    }

    public lotionUnderBodySkin(): void {
        if (this.game.player.underBody.skin.adj == this._adj) {
            this.outputText("You " + this.game.player.clothedOrNaked("take a second to disrobe before uncorking the flask of lotion and rubbing", "uncork the flask of lotion and rub") + " the " + this.liquidDesc() + " across your underbody. Once you’ve finished you feel reinvigorated. ");
            this.player.HPChange(10, true);
        }
        else {
            if (this.game.player.underBody.skin.type != Skin.GOO) { // If skin is goo, don't change.
                this.game.player.underBody.skin.adj = this._adj != "clear" ? this._adj : "";
            }
            switch (this.game.player.underBody.skin.type) {
                case Skin.PLAIN: // Plain
                    this.outputText("You " + this.game.player.clothedOrNaked("take a second to disrobe before uncorking the flask of lotion and rubbing", "uncork the flask of lotion and rub") + " the " + this.liquidDesc() + " across your underbody. As you rub the mixture onto your [chest], it begins to tingle pleasantly. ");
                    switch (this._adj) {
                        case "smooth":
                            this.outputText("Soon your skin on your underbody is smoother but in a natural healthy way.");
                            break;
                        case "rough":
                            this.outputText("Soon your skin on your underbody is rougher as if you’ve just finished a long day’s work.");
                            break;
                        case "sexy":
                            this.outputText("Soon your skin on your underbody is so sexy you find it hard to keep your hands off yourself.");
                            break;
                        case "clear":
                            this.outputText("Soon the natural beauty of your [underBody.skinFurScales] is revealed without anything extra or unnecessary.");
                            break;
                        default: // Failsafe
                            this.outputText("<b>This text should not happen. Please let Kitteh6660 know.</b>");
                    }
                    break;
                case Skin.FUR: // Fur
                    this.outputText("" + this.game.player.clothedOrNaked("Once you’ve disrobed you take the lotion and", "You take the lotion and") + " begin massaging it into your skin despite yourself being covered with fur. It takes little effort but once you’ve finished... nothing happens. A few moments pass and then your skin begins to tingle. ");
                    switch (this._adj) {
                        case "smooth":
                            this.outputText("Soon you part your fur on your underbody to reveal smooth skin that still appears natural.");
                            break;
                        case "rough":
                            this.outputText("Soon you part your fur on your underbody to reveal rough skin that still appears natural.");
                            break;
                        case "sexy":
                            this.outputText("Soon you part your fur on your underbody to reveal sexy skin that makes you want to kiss yourself.");
                            break;
                        case "clear":
                            this.outputText("Soon you part your fur on your underbody to reveal the natural beauty of your skin.");
                            break;
                        default: // Failsafe
                            this.outputText("<b>This text should not happen. Please let Kitteh6660 know.</b>");
                    }
                    break;
                case Skin.LIZARD_SCALES: // Scales
                case Skin.DRAGON_SCALES: // Dragon scales
                case Skin.FISH_SCALES: // Scales
                    this.outputText("You " + this.game.player.clothedOrNaked("take a second to disrobe before uncorking the flask of lotion and rubbing", "uncork the flask of lotion and rub") + " the " + this.liquidDesc() + " across your underbody. As you rub the mixture into your arms and [chest], your whole body begins to tingle pleasantly.");
                    switch (this._adj) {
                        case "smooth":
                            this.outputText("Soon your scales on your underbody are smoother but in a natural healthy way.");
                            break;
                        case "rough":
                            this.outputText("Soon your scales on your underbody are rougher as if you’ve just finished a long day’s work.");
                            break;
                        case "sexy":
                            this.outputText("Soon your scales on your underbody are so sexy you find it hard to keep your hands off yourself.");
                            break;
                        case "clear":
                            this.outputText("Soon the natural beauty of your [underBody.skinFurScales] is revealed without anything extra or unnecessary.");
                            break;
                        default: // Failsafe
                            this.outputText("<b>This text should not happen. Please let Kitteh6660 know.</b>");
                    }
                    break;
                case Skin.GOO: // Goo
                    this.outputText("You take the lotion and pour the " + this.liquidDesc() + " into yourself. The concoction dissolves, leaving your gooey epidermis unchanged. As a matter of fact nothing happens at all.");
                    // No changes due to gooey skin.
                    break;
                default:
                    this.outputText("You " + this.game.player.clothedOrNaked("take a second to disrobe before uncorking the bottle of oil and rubbing", "uncork the bottle of oil and rub") + " the smooth liquid across your body. Even before you’ve covered your arms and [chest] your skin begins to tingle pleasantly all over. After your skin darkens a little, it begins to change until you have " + this._adj + " skin on your underbody.");
            }
        }
        this.game.inventory.itemGoNext();
    }

    private lotionCancel(): void {
        this.clearOutput();
        this.outputText("You put the body lotion away.\n\n");
        this.game.inventory.returnItemToInventory(this);
    }
}
