import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

export class HairDye extends Consumable {
    private _color: string;

    public constructor(id: string, color: string) {
        const shortName: string = color + " Dye";
        const longName: string = "a vial of " + color + " hair dye";
        let value: number = ConsumableLib.DEFAULT_VALUE;
        if (color == "rainbow") value = 100;
        const description: string = "This bottle of dye will allow you to change the color of your hair.  Of course if you don't have hair, using this would be a waste.";
        super(id, shortName, longName, value, description);
        this._color = color.toLowerCase();
    }

    public canUse(): boolean {
        return true;
    }

    public useItem(): boolean {
        this.clearOutput();
        kGAMECLASS.output.menu();

        if (this.game.player.hair.length > 0) {
            this.outputText("You have " + this.game.player.hair.color + " hair.");
            if (this.game.player.hair.color != this._color) kGAMECLASS.output.addButton(0, "Hair", this.dyeHair);
            else kGAMECLASS.output.addButtonDisabled(0, "Hair", "Your already have " + this.game.player.hair.color + " hair!");
        } else {
            this.outputText("You have no hair.");
            kGAMECLASS.output.addButtonDisabled(0, "Hair", "You are bald!");
        }

        if (this.game.player.hasFur()) {
            this.outputText("\n\nYou have " + this.game.player.skin.furColor + " fur.");
            if (this.game.player.skin.furColor != this._color) kGAMECLASS.output.addButton(1, "Fur", this.dyeFur);
            else kGAMECLASS.output.addButtonDisabled(1, "Fur", "Your already have " + this._color + " fur!");
        } else if (this.game.player.hasFeathers() || this.game.player.hasCockatriceSkin()) {
            this.outputText("\n\nYou have " + this.game.player.skin.furColor + " feathers.");
            if (this.game.player.skin.furColor != this._color) kGAMECLASS.output.addButton(1, "Feathers", this.dyeFeathers);
            else kGAMECLASS.output.addButtonDisabled(1, "Feathers", "Your already have " + this._color + " feathers!");
        } else {
            this.outputText("\n\nYou have no fur.");
            kGAMECLASS.output.addButtonDisabled(1, "Fur", "You have no fur!");
        }

        if (this.game.player.hasFurryUnderBody()) {
            this.outputText("\n\nYou have " + this.game.player.underBody.skin.furColor + " fur on your underbody.");
            if (this.game.player.underBody.skin.furColor != this._color) kGAMECLASS.output.addButton(2, "Under Fur", this.dyeUnderBodyFur);
            else kGAMECLASS.output.addButtonDisabled(2, "Under Fur", "Your already have " + this._color + " fur on your underbody!");
        } else if (this.game.player.hasFeatheredUnderBody()) {
            this.outputText("\n\nYou have " + this.game.player.underBody.skin.furColor + " feathers on your underbody.");
            if (this.game.player.underBody.skin.furColor != this._color) kGAMECLASS.output.addButton(2, "Under Feathers", this.dyeUnderBodyFeathers);
            else kGAMECLASS.output.addButtonDisabled(2, "Under Feathers", "Your already have " + this._color + " feathers on your underbody!");
        } else {
            this.outputText("\n\nYou have no special or furry underbody.");
            kGAMECLASS.output.addButtonDisabled(2, "Under Fur", "You have no special or furry underbody!");
        }

        if (this.game.player.wings.canDye()) {
            this.outputText("\n\nYou have [wingColor] wings.");
            if (!this.game.player.wings.hasDyeColor(this._color)) kGAMECLASS.output.addButton(3, "Wings", this.dyeWings);
            else kGAMECLASS.output.addButtonDisabled(3, "Wings", "Your already have " + this._color + " wings!");
        } else {
            this.outputText("\n\nYour wings can't be dyed.");
            kGAMECLASS.output.addButtonDisabled(3, "Wings", "Your wings can't be dyed!");
        }

        if (this.game.player.neck.canDye()) {
            this.outputText("\n\nYou have a [neckColor] neck.");
            if (!this.game.player.neck.hasDyeColor(this._color)) kGAMECLASS.output.addButton(5, "Neck", this.dyeNeck);
            else kGAMECLASS.output.addButtonDisabled(5, "Neck", "Your already have a " + this._color + " neck!");
        } else {
            this.outputText("\n\nYour neck can't be dyed.");
            kGAMECLASS.output.addButtonDisabled(5, "Neck", "Your neck can't be dyed!");
        }

        if (this.game.player.rearBody.canDye()) {
            this.outputText("\n\nYou have a [rearBodyColor] rear body.");
            if (!this.game.player.rearBody.hasDyeColor(this._color)) kGAMECLASS.output.addButton(6, "Rear Body", this.dyeRearBody);
            else kGAMECLASS.output.addButtonDisabled(6, "Rear Body", "Your already have a " + this._color + " rear body!");
        } else {
            this.outputText("\n\nYour rear body can't be dyed.");
            kGAMECLASS.output.addButtonDisabled(6, "Rear Body", "Your rear body can't be dyed!");
        }

        kGAMECLASS.output.addButton(4, "Nevermind", this.dyeCancel);
        return true;
    }

    private dyeHair(): void {
        this.clearOutput();
        if (this.game.player.hair.length == 0) {
            this.outputText("You rub the dye into your bald head, but it has no effect.");
        }
        else if (this.game.player.hair.color.indexOf("rubbery") != -1 || this.game.player.hair.color.indexOf("latex-textured") != -1) {
            this.outputText("You massage the dye into your " + this.game.player.hairDescript() + " but the dye cannot penetrate the impermeable material your hair is composed of.");
        }
        else {
            this.outputText("You rub the dye into your " + this.game.player.hairDescript() + ", then use a bucket of cool lakewater to rinse clean a few minutes later.  ");
            this.game.player.hair.color = this._color;
            this.outputText("You now have " + this.game.player.hairDescript() + ".");
            if (this.game.player.lust100 > 50) {
                this.outputText("\n\nThe cool water calms your urges somewhat, letting you think more clearly.");
                this.game.dynStats("lus", -15);
            }
        }
        this.game.inventory.itemGoNext();
    }

    private dyeFur(): void {
        this.clearOutput();
        this.outputText("You rub the dye into your fur, then use a bucket of cool lakewater to rinse clean a few minutes later.  ");
        this.game.player.skin.furColor = this._color;
        this.outputText("You now have " + this.game.player.skin.furColor + " fur.");
        this.finalize();
    }

    private dyeUnderBodyFur(): void {
        this.clearOutput();
        this.outputText("You rub the dye into your fur on your underside, then use a bucket of cool lakewater to rinse clean a few minutes later.  ");
        this.game.player.underBody.skin.furColor = this._color;
        this.outputText("You now have " + this.game.player.underBody.skin.furColor + " fur on your underside.");
        this.finalize();
    }

    private dyeFeathers(): void {
        this.clearOutput();
        this.outputText("You rub the dye into your feathers, then use a bucket of cool lakewater to rinse clean a few minutes later.  ");
        this.game.player.skin.furColor = this._color;
        this.outputText("You now have " + this.game.player.skin.furColor + " feathers.");
        this.finalize();
    }

    private dyeUnderBodyFeathers(): void {
        this.clearOutput();
        this.outputText("You rub the dye into your feathers on your underside, then use a bucket of cool lakewater to rinse clean a few minutes later.  ");
        this.game.player.underBody.skin.furColor = this._color;
        this.outputText("You now have " + this.game.player.underBody.skin.furColor + " feathers on your underside.");
        this.finalize();
    }

    private dyeWings(): void {
        this.clearOutput();
        this.outputText("You rub the dye into your [wings], then use a bucket of cool lakewater to rinse clean a few minutes later.  ");
        this.game.player.wings.applyDye(this._color);
        this.outputText("You now have [wingColor] wings.");
        this.finalize();
    }

    private dyeNeck(): void {
        this.clearOutput();
        this.outputText("You rub the dye onto your [neck], then use a bucket of cool lakewater to rinse clean a few minutes later.  ");
        this.game.player.neck.applyDye(this._color);
        this.outputText("You now have a [neckColor] neck.");
        this.finalize();
    }

    private dyeRearBody(): void {
        this.clearOutput();
        this.outputText("You rub the dye onto your [rearBody], then use a bucket of cool lakewater to rinse clean a few minutes later.  ");
        this.game.player.rearBody.applyDye(this._color);
        this.outputText("You now have a [rearBodyColor] rear body.");
        this.finalize();
    }

    private dyeCancel(): void {
        this.clearOutput();
        this.outputText("You put the dye away.\n\n");
        this.game.inventory.returnItemToInventory(this);
    }

    private finalize(): void {
        if (this.game.player.lust100 > 50) {
            this.outputText("\n\nThe cool water calms your urges somewhat, letting you think more clearly.");
            this.game.dynStats("lus", -15);
        }
        this.game.inventory.itemGoNext();
    }
}
