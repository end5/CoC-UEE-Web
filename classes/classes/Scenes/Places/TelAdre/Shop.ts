import { TelAdreAbstractContent } from "./TelAdreAbstractContent";
import { ItemType } from "../../../ItemType";

export class Shop extends TelAdreAbstractContent {
    // TODO rename Shop to AbstractShop? Because thats what it is.
    protected sprite: Record<string, any> | number = -1;

    public enter(): void {
        this.clearOutput();
        this.spriteSelect(this.sprite);
        this.inside();
    }

    /**
     * This method is called when the player enters a shop.
     * <b>Note:</b> The subclass must override and implement this method.
     * @throws IllegalOperationError if the method is not implemented
     */
    protected inside(): void {
        // Implement this method in the subclass
        throw new IllegalOperationError("Method not implemented!");
    }

    public addItemBuyButton(item: ItemType): void {
        let firstEmptyButtonIndex: number = 0;
        for (let i: number = 0; i < 14; i++) {
            if (!this.mainView.bottomButtons[i].visible) {
                firstEmptyButtonIndex = i;
                break;
            }
        }
        this.addButton(firstEmptyButtonIndex, item.shortName, this.confirmBuy, item).hint(item.description, Shop.capitalizeFirstLetter(item.longName));
    }

    protected debit(itype: ItemType, priceOverride: number = -1, keyItem: string = ""): void {
        this.player.gems -= priceOverride >= 0 ? priceOverride : itype.value;
        this.statScreenRefresh();

        if (keyItem !== "") {
            this.player.createKeyItem(keyItem, 0, 0, 0, 0);
            this.doNext(this.inside);
        } else {
            this.inventory.takeItem(itype, this.inside);
        }
    }

    protected confirmBuy(itype?: ItemType, priceOverride: number = -1, keyItem: string = ""): void {
        if (this.player.gems < priceOverride || (itype && this.player.gems < itype.value)) {
            this.outputText("\n\nYou count out your gems and realize it's beyond your price range.");
            // Goto shop main menu
            this.doNext(this.inside);
            return;
        } else {
            this.outputText("\n\nDo you buy it?\n\n");
        }
        this.doYesNo(Shop.curry(this.debit, itype, priceOverride, keyItem), Shop.curry(this.noBuyOption, itype, keyItem));
    }

    protected noBuyOption(itype?: ItemType, keyItem: string = ""): void {
        this.inside();
    }
}
