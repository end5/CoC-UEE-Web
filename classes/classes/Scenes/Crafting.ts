import { BaseContent } from "../BaseContent";
import { ItemType } from "../ItemType";

export class Crafting extends BaseContent {
    public static TYPE_ALCHEMY: number = 0;
    public static TYPE_COOKING: number = 1;
    public static TYPE_SMITHING: number = 2;
    public static TYPE_TAILORING: number = 3;

    private item1: ItemType | undefined = undefined;
    private item1Quantity: number = 0;
    private item2: ItemType | undefined = undefined;
    private item2Quantity: number = 0;
    private item3: ItemType | undefined = undefined;
    private item3Quantity: number = 0;
    private item4: ItemType | undefined = undefined;
    private item4Quantity: number = 0;
    private itemResult: ItemType | undefined = undefined;

    public accessCraftingMenu(type: number, page: number = 1): void {
        this.clearOutput();
        this.outputText("What would you like to craft?");
        this.menu();
        if (type == Crafting.TYPE_ALCHEMY) {

        }
        else if (type == Crafting.TYPE_COOKING) {

        }
        else if (type == Crafting.TYPE_SMITHING) {

        }
        else if (type == Crafting.TYPE_TAILORING) {

        }
        this.addButton(14, "Back", this.playerMenu);
    }

    private createCraftingRecipe(item: any, recipe: any[]): void {
        let button: number = 0;
        let temp: number = 0;
        const goal: number = 14;
        while (temp < goal) {
            if (this.output.buttonIsVisible(temp)) {
                button++;
            }
            if (button == 4 || button == 9) button++;
            temp++;
        }
        this.addButton(button, item.shortName, this.displayCraftingRequirement, item, recipe);
    }

    private meetsItemRequirement(id: number): boolean {
        if (id == 1) {
            if (this.item1 == undefined) return true;
            if (this.player.hasItem(this.item1, this.item1Quantity)) return true;
        }
        else if (id == 2) {
            if (this.item2 == undefined) return true;
            if (this.player.hasItem(this.item2, this.item2Quantity)) return true;
        }
        else if (id == 3) {
            if (this.item3 == undefined) return true;
            if (this.player.hasItem(this.item3, this.item3Quantity)) return true;
        }
        else if (id == 4) {
            if (this.item4 == undefined) return true;
            if (this.player.hasItem(this.item4, this.item4Quantity)) return true;
        }
        return false;
    }

    private displayCraftingRequirement(item: ItemType, recipe: any[]): void {
        // Item #1
        if (recipe[0] != undefined) this.item1 = recipe[0];
        else this.item1 = undefined;
        if (recipe[1] != undefined) this.item1Quantity = recipe[1];
        // Item #2
        if (recipe[2] != undefined) this.item2 = recipe[2];
        else this.item2 = undefined;
        if (recipe[3] != undefined) this.item2Quantity = recipe[3];
        // Item #3
        if (recipe[4] != undefined) this.item3 = recipe[4];
        else this.item3 = undefined;
        if (recipe[5] != undefined) this.item3Quantity = recipe[5];
        // Item #4
        if (recipe[6] != undefined) this.item4 = recipe[6];
        else this.item4 = undefined;
        if (recipe[7] != undefined) this.item4Quantity = recipe[7];
        // Set result item
        this.itemResult = item;
        this.clearOutput();
        this.outputText("<b>Item:</b> " + item.longName + "\n\n");
        this.outputText("<b><u>Items Needed:</u></b>\n");
        if (this.item1 != undefined) {
            if (this.player.hasItem(this.item1, this.item1Quantity)) this.outputText("<font color=\"#008000\">" + this.player.itemCount(this.item1) + " / " + this.item1Quantity + " " + this.item1.longName + "</font>");
            else this.outputText("<font color=\"#800000\">" + this.player.itemCount(this.item1) + " / " + this.item1Quantity + " " + this.item1.longName + "</font>");
            this.outputText("\n");
        }
        if (this.item2 != undefined) {
            if (this.player.hasItem(this.item2, this.item2Quantity)) this.outputText("<font color=\"#008000\">" + this.player.itemCount(this.item2) + " / " + this.item2Quantity + " " + this.item2.longName + "</font>");
            else this.outputText("<font color=\"#800000\">" + this.player.itemCount(this.item2) + " / " + this.item2Quantity + " " + this.item2.longName + "</font>");
            this.outputText("\n");
        }
        if (this.item3 != undefined) {
            if (this.player.hasItem(this.item3, this.item3Quantity)) this.outputText("<font color=\"#008000\">" + this.player.itemCount(this.item3) + " / " + this.item3Quantity + " " + this.item3.longName + "</font>");
            else this.outputText("<font color=\"#800000\">" + this.player.itemCount(this.item3) + " / " + this.item3Quantity + " " + this.item3.longName + "</font>");
            this.outputText("\n");
        }
        if (this.item4 != undefined) {
            if (this.player.hasItem(this.item4, this.item4Quantity)) this.outputText("<font color=\"#008000\">" + this.player.itemCount(this.item4) + " / " + this.item4Quantity + " " + this.item4.longName + "</font>");
            else this.outputText("<font color=\"#800000\">" + this.player.itemCount(this.item4) + " / " + this.item4Quantity + " " + this.item4.longName + "</font>");
            this.outputText("\n");
        }
        this.outputText("\n");
        // Is it okay to craft this shit?
        if (this.meetsItemRequirement(1) && this.meetsItemRequirement(2) && this.meetsItemRequirement(3) && this.meetsItemRequirement(4)) {
            this.outputText("Would you like to craft this item?");
            this.doYesNo(this.craftItem, this.accessCraftingMenu);
        }
        else {
            this.outputText("You do not have the required ingredients to craft this item.");
            this.doNext(this.accessCraftingMenu);
        }
    }

    private craftItem(): void {
        this.clearOutput();
        if (this.item1 != undefined) this.player.destroyItems(this.item1, this.item1Quantity);
        if (this.item2 != undefined) this.player.destroyItems(this.item2, this.item2Quantity);
        if (this.item3 != undefined) this.player.destroyItems(this.item3, this.item3Quantity);
        if (this.item4 != undefined) this.player.destroyItems(this.item4, this.item4Quantity);
        this.inventory.takeItem(this.itemResult, this.accessCraftingMenu);
    }
}
