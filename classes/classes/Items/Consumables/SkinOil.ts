import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { Wings } from "../../BodyParts/Wings";
import { BaseBodyPart } from "../../BodyParts/BaseBodyPart";
import { Skin } from "../../BodyParts/Skin";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

/**
 * Skin oils, courtesy of Foxxling.
 * @author Kitteh6660
 */
export class SkinOil extends Consumable {
    private _color: string;

    public constructor(id: string, color: string) {
        const shortName: string = color + " Oil";
        const longName: string = "a bottle of " + color + " oil";
        const value: number = ConsumableLib.DEFAULT_VALUE;
        const description: string = "A small glass bottle filled with a smooth clear liquid. A label across the front says, \"" + color + " Skin Oil.\"";
        super(id, shortName, longName, value, description);
        this._color = color.toLowerCase();
    }

    public useItem(): boolean {
        if (!this.game.player.hasUnderBody() && !this.game.player.wings.canOil()) {
            this.oilSkin();
            return true;
        }

        this.clearOutput();
        if (this.game.player.hasUnderBody()) {
            this.outputText("The skin on your underbody is different from the rest. ");
        }
        this.outputText("Where do you want to apply the " + this._color + " skin oil?");

        kGAMECLASS.output.menu();
        kGAMECLASS.output.addButton(0, "Body", this.oilSkin);
        if (this.game.player.hasUnderBody()) {
            kGAMECLASS.output.addButton(1, "Underbody", this.oilUnderBodySkin);
        } else {
            kGAMECLASS.output.addButtonDisabled(1, "Underbody", "You have no special underbody!");
        }
        if (this.game.player.wings.type === Wings.NONE) {
            this.outputText("\n\nYou have no wings.");
            kGAMECLASS.output.addButtonDisabled(2, "Wings", "You have no wings.");
        } else if (this.game.player.wings.canOil()) {
            this.outputText("\n\nYour wings have [wingColor] [wingColorDesc].");
            if (!this.game.player.wings.hasOilColor(this._color))
                kGAMECLASS.output.addButton(2, "Wings", this.oilWings).hint("Apply oil to your wings' " + this.game.player.wings.getColorDesc(BaseBodyPart.COLOR_ID_MAIN) + ".");
            else
                kGAMECLASS.output.addButtonDisabled(2, "Wings", "Your wings' " + this.game.player.wings.getColorDesc(BaseBodyPart.COLOR_ID_MAIN) + " already are " + this._color + " colored!");
        } else {
            this.outputText("\n\nYour wings can't be oiled.");
            kGAMECLASS.output.addButtonDisabled(2, "Wings", "Your wings can't be oiled!");
        }
        if (this.game.player.wings.type === Wings.NONE) {
            this.outputText("\n\nYou have no wings.");
            kGAMECLASS.output.addButtonDisabled(3, "Wings 2", "You have no wings.");
        } else if (this.game.player.wings.canOil2()) {
            this.outputText("\n\nYour wings have [wingColor2] [wingColor2Desc].");
            if (!this.game.player.wings.hasOil2Color(this._color))
                kGAMECLASS.output.addButton(3, "Wings 2", this.oil2Wings).hint("Apply oil to your wings' " + this.game.player.wings.getColorDesc(BaseBodyPart.COLOR_ID_2ND) + ".");
            else
                kGAMECLASS.output.addButtonDisabled(3, "Wings 2", "Your wings' " + this.game.player.wings.getColorDesc(BaseBodyPart.COLOR_ID_2ND) + " already are " + this._color + " colored!");
        } else {
            kGAMECLASS.output.addButtonDisabled(3, "Wings 2", "Your wings have no secondary color to apply skin oil to!");
        }
        kGAMECLASS.output.addButton(4, "Nevermind", this.oilCancel);
        return true;
    }

    public oilSkin(): void {
        if (this.game.player.skin.tone == this._color) {
            this.outputText("You " + this.game.player.clothedOrNaked("take a second to disrobe before uncorking the bottle of oil and rubbing", "uncork the bottle of oil and rub") + " the smooth liquid across your body. Once you’ve finished you feel rejuvenated.");
            this.game.player.changeFatigue(-10);
        }
        else {
            if (!this.game.player.hasGooSkin()) {
                this.game.player.skin.tone = this._color;
                this.game.player.arms.updateClaws(this.game.player.arms.claws.type);
            }
            switch (this.game.player.skin.type) {
                case Skin.PLAIN: // Plain
                    this.outputText("You " + this.game.player.clothedOrNaked("take a second to disrobe before uncorking the bottle of oil and rubbing", "uncork the bottle of oil and rub") + " the smooth liquid across your body. Even before you’ve covered your arms and [chest] your skin begins to tingle pleasantly all over. After your skin darkens a little, it begins to change until you have " + this._color + " skin.");
                    break;
                case Skin.FUR: // Fur
                    this.outputText("" + this.game.player.clothedOrNaked("Once you’ve disrobed you take the oil and", "You take the oil and") + " begin massaging it into your skin despite yourself being covered with fur. Once you’ve finished... nothing happens. Then your skin begins to tingle and soon you part your fur to reveal " + this._color + " skin.");
                    break;
                case Skin.LIZARD_SCALES: // Lizard scales
                case Skin.DRAGON_SCALES: // Dragon scales
                case Skin.FISH_SCALES:   // Fish scales
                    this.outputText("You " + this.game.player.clothedOrNaked("take a second to disrobe before uncorking the bottle of oil and rubbing", "uncork the bottle of oil and rub") + " the smooth liquid across your body. Even before you’ve covered your arms and [chest] your scaly skin begins to tingle pleasantly all over. After your skin darkens a little, it begins to change until you have " + this._color + " skin.");
                    break;
                case Skin.GOO: // Goo
                    this.outputText("You take the oil and pour the contents into your skin. The clear liquid dissolves, leaving your gooey skin unchanged. You do feel a little less thirsty though.");
                    this.game.player.slimeFeed();
                    break;
                default:
                    this.outputText("You " + this.game.player.clothedOrNaked("take a second to disrobe before uncorking the bottle of oil and rubbing", "uncork the bottle of oil and rub") + " the smooth liquid across your body. Even before you’ve covered your arms and [chest] your skin begins to tingle pleasantly all over. After your skin darkens a little, it begins to change until you have " + this._color + " skin.");
            }
        }
        this.game.inventory.itemGoNext();
    }

    public oilUnderBodySkin(): void {
        if (this.game.player.underBody.skin.tone == this._color) {
            this.outputText("You " + this.game.player.clothedOrNaked("take a second to disrobe before uncorking the bottle of oil and rubbing", "uncork the bottle of oil and rub") + " the smooth liquid across your underbody. Once you’ve finished you feel rejuvenated.");
            this.game.player.changeFatigue(-10);
        }
        else {
            if (!this.game.player.hasGooSkin()) {
                this.game.player.underBody.skin.tone = this._color;
            }
            switch (this.game.player.underBody.skin.type) {
                case Skin.PLAIN: // Plain
                    this.outputText("You " + this.game.player.clothedOrNaked("take a second to disrobe before uncorking the bottle of oil and rubbing", "uncork the bottle of oil and rub") + " the smooth liquid across your underbody. Even before you’ve covered your [chest] your skin begins to tingle pleasantly all over. After your skin darkens a little, it begins to change until you have " + this._color + " skin on your underbody.");
                    break;
                case Skin.FUR: // Fur
                    this.outputText("" + this.game.player.clothedOrNaked("Once you’ve disrobed you take the oil and", "You take the oil and") + " begin massaging it into the skin on your underbody despite yourself being covered with fur. Once you’ve finished... nothing happens. Then your skin begins to tingle and soon you part your fur on your [chest] to reveal " + this._color + " skin.");
                    break;
                case Skin.LIZARD_SCALES: // Lizard scales
                case Skin.DRAGON_SCALES: // Dragon scales
                case Skin.FISH_SCALES:   // Fish scales
                    this.outputText("You " + this.game.player.clothedOrNaked("take a second to disrobe before uncorking the bottle of oil and rubbing", "uncork the bottle of oil and rub") + " the smooth liquid across your underbody. Even before you’ve covered your [chest] your scaly skin begins to tingle pleasantly all over. After your skin darkens a little, it begins to change until you have " + this._color + " skin on your underbody.");
                    break;
                case Skin.GOO: // Goo
                    this.outputText("You take the oil and pour the contents into your skin. The clear liquid dissolves, leaving your gooey skin unchanged. You do feel a little less thirsty though.");
                    this.game.player.slimeFeed();
                    break;
                default:
                    this.outputText("You " + this.game.player.clothedOrNaked("take a second to disrobe before uncorking the bottle of oil and rubbing", "uncork the bottle of oil and rub") + " the smooth liquid across your underbody. Even before you’ve covered your [chest] your skin begins to tingle pleasantly all over. After your skin darkens a little, it begins to change until you have " + this._color + " skin on your underbody.");
            }
        }
        this.game.inventory.itemGoNext();
    }

    private oilWings(): void {
        this.clearOutput();
        this.outputText("You rub the oil into the [wingColorDesc] of your [wings].  ");
        this.game.player.wings.applyOil(this._color);
        this.outputText("Your wings now have [wingColor] [wingColorDesc].");
        this.game.inventory.itemGoNext();
    }

    private oil2Wings(): void {
        this.clearOutput();
        this.outputText("You rub the oil into the [wingColor2Desc] of your [wings].  ");
        this.game.player.wings.applyOil2(this._color);
        this.outputText("Your wings now have [wingColor2] [wingColor2Desc].");
        this.game.inventory.itemGoNext();
    }

    private oilCancel(): void {
        this.clearOutput();
        this.outputText("You put the skin oil away.\n\n");
        this.game.inventory.returnItemToInventory(this);
    }
}
