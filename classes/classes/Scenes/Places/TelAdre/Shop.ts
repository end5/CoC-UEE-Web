
export class Shop extends TelAdreAbstractContent {
	//TODO rename Shop to AbstractShop? Because thats what it is.
	protected  sprite: Record<string, any> = -1;

	public  enter(): void {
		clearOutput();
		spriteSelect(sprite);
		inside();
	}

	/**
	 * This method is called when the player enters a shop.
	 * <b>Note:</b> The subclass must override and implement this method.
	 * @throws IllegalOperationError if the method is not implemented
	 */
	protected  inside(): void {
		//Implement this method in the subclass
		throw new IllegalOperationError("Method not implemented!");
	}

	public  addItemBuyButton(item:ItemType): void {
	var  firstEmptyButtonIndex: number = 0;
		for (var i: number = 0; i < 14; i++) {
			if (!mainView.bottomButtons[i].visible) {
				firstEmptyButtonIndex = i;
				break;
			}
		}
		addButton(firstEmptyButtonIndex, item.shortName, confirmBuy, item).hint(item.description, capitalizeFirstLetter(item.longName));
	}
	
	protected  debit(itype:ItemType = undefined, priceOverride: number = -1, keyItem: string = ""): void {
		player.gems -= priceOverride >= 0 ? priceOverride : itype.value;
		statScreenRefresh();
		
		if (keyItem !== "") {
			player.createKeyItem(keyItem, 0, 0, 0, 0);
			doNext(inside);
		} else {
			inventory.takeItem(itype, inside);
		}
	}

	protected  confirmBuy(itype:ItemType = undefined, priceOverride: number = -1, keyItem: string = ""): void {
		if (player.gems < priceOverride || (itype && player.gems < itype.value)) {
			outputText("\n\nYou count out your gems and realize it's beyond your price range.");
			//Goto shop main menu
			doNext(inside);
			return;
		} else {
			outputText("\n\nDo you buy it?\n\n");
		}
		doYesNo(curry(debit, itype, priceOverride, keyItem), curry(noBuyOption, itype, keyItem));
	}

	protected  noBuyOption(itype:ItemType = undefined, keyItem: string = ""): void {
		inside();
	}
}

