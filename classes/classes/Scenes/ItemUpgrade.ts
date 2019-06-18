
	export class ItemUpgrade extends BaseContent implements TimeAwareInterface
	{
		private  shopkeeper: string = "";
		private  returnFunc;
		
		public static  TELADRE_WEAPON_SHOP: string = "TelAdreWeaponShop";
		public static  TELADRE_ARMOUR_SHOP: string = "TelAdreArmourShop";
		public static  BAZAAR_SMITH_SHOP: string = "BazaarChillSmith";
		public static  ARIAN_ENHANCEMENTS: string = "ArianEnhancements";
		
		public  ItemUpgrade() {
			CoC.timeAwareClassAdd(this);
		}
		
		public  timeChange(): boolean {
			if (flags[kFLAGS.WEAPON_SHOP_UPGRADE_TIME] > 0) {
				flags[kFLAGS.WEAPON_SHOP_UPGRADE_TIME]--;
			}
			if (flags[kFLAGS.ARMOUR_SHOP_UPGRADE_TIME] > 0) {
				flags[kFLAGS.ARMOUR_SHOP_UPGRADE_TIME]--;
			}
			if (flags[kFLAGS.CHILL_SMITH_UPGRADE_TIME] > 0) {
				flags[kFLAGS.CHILL_SMITH_UPGRADE_TIME]--;
			}
			return false;
		}
		
		public  timeChangeLarge(): boolean {
			return false;
		}
		
		private  isAValidItem(item:ItemType): boolean {
		var  valid: boolean = false;
			if (item is Weapon) {
				if (shopkeeper == TELADRE_WEAPON_SHOP || shopkeeper == BAZAAR_SMITH_SHOP) valid = true;
			}
			if (item is Armor || item is Shield) {
				if (shopkeeper == TELADRE_ARMOUR_SHOP) valid = true;
			}
			if (item is Jewelry) {
				if (shopkeeper == ARIAN_ENHANCEMENTS) valid = true;
			}
			return valid;
		}
		
		public  equipmentUpgradeMenu(chosenShop: string = "", exitFunc = undefined, isObsidianUpgrade: boolean = false): void {
			clearOutput();
			menu();
			//Set variables
			if (chosenShop != "") shopkeeper = chosenShop;
			if (exitFunc != undefined) returnFunc = exitFunc;
			switch(chosenShop) {
				case TELADRE_WEAPON_SHOP:
					if (flags[kFLAGS.WEAPON_SHOP_UPGRADE_TIME] > 0) {
						outputText("The weaponsmith is currently busy upgrading your weapon. Come back later.");
						doNext(returnFunc);
						return;
					}
					else if (flags[kFLAGS.WEAPON_SHOP_UPGRADE_ITEM] != 0) {
						claimWeapon();
						return;
					}
					break;
				case TELADRE_ARMOUR_SHOP:
					if (flags[kFLAGS.ARMOUR_SHOP_UPGRADE_TIME] > 0) {
						outputText("The armoursmith is currently busy upgrading your armour. Come back later.");
						doNext(returnFunc);
						return;
					}
					else if (flags[kFLAGS.ARMOUR_SHOP_UPGRADE_ITEM] != 0) {
						claimWeapon();
						return;
					}
					break;
				case BAZAAR_SMITH_SHOP:
					if (flags[kFLAGS.CHILL_SMITH_UPGRADE_TIME] > 0) {
						outputText("The grouchy weaponsmith is currently busy upgrading your weapon. Come back later.");
						doNext(returnFunc);
						return;
					}
					else if (flags[kFLAGS.CHILL_SMITH_UPGRADE_ITEM] != 0) {
						claimWeapon();
						return;
					}
					break;
				default:
					//Nothing here, move on.
			}
			//The main meat of this function
			outputText("\"<i>What equipment would you like to reinforce" + (isObsidianUpgrade ? " with obsidian" : "") + "?</i>\" The smith asks with a brow raised.");
			for (var i: number = 0; i < inventory.getMaxSlots(); i++) {
				if (player.itemSlot(i).itype == ItemType.NOTHING) {
					addButtonDisabled(i, "", "");
				}
				else if (player.itemSlot(i).itype is Weapon && isObsidianUpgrade) {
					addButton(i, player.itemSlot(i).itype.shortName, obsidianWeaponUpgrade, player.itemSlot(i).itype, false, chosenShop).hint(player.itemSlot(i).itype.description, capitalizeFirstLetter(player.itemSlot(i).itype.longName));
				}
				else if (player.itemSlot(i).itype is Weapon && (player.itemSlot(i).itype as Weapon).tier >= 2) {
					addButtonDisabled(i, player.itemSlot(i).itype.shortName, "This equipment is already at its maximum tier.");
				}
				else if (isAValidItem(player.itemSlot(i).itype)) {
					addButton(i, player.itemSlot(i).itype.shortName, equipmentUpgradeRouter, player.itemSlot(i).itype).hint(player.itemSlot(i).itype.description, capitalizeFirstLetter(player.itemSlot(i).itype.longName));
				}
				else {
					addButtonDisabled(i, player.itemSlot(i).itype.shortName, "This is not a valid type of equipment to upgrade.");
				}
			}
			if ((chosenShop == TELADRE_WEAPON_SHOP || chosenShop == BAZAAR_SMITH_SHOP) && !isObsidianUpgrade) {
				addButton(11, "Obsidian", equipmentUpgradeMenu, chosenShop, exitFunc, true).hint("You can reinforce certain weapons with obsidian to make it even deadlier.", "Obsidian Reinforcement");
			}
			addButton(14, "Back", returnFunc);
		}
		private  equipmentUpgradeRouter(item:ItemType): void {
			clearOutput();
		var  isSpecial: boolean = false;
			//Special upgrades that will require certain items.
			switch(item) {
				case weapons.BBSWORD:
				case weapons.B_SWORD:
				case weapons.B_SCARB:
				case weapons.U_SWORD:
				case weapons.S_BLADE:
				case weapons.JRAPIER:
				case weapons.W_STAFF:
					isSpecial = true;
					break;
				default:
			}
			if (isSpecial) {
				specialUpgradePrompt(item);
				return;
			}
			else {
				equipmentUpgrade(item, false);
			}
		}
		private  specialUpgradePrompt(item:ItemType): void {
			//Broken Beautiful Sword -> Beautiful Sword
			if (item == weapons.BBSWORD) {
				outputText("You'll need 1000 gems to restore the broken sword.");
				if (player.gems >= 1000) {
					doYesNo(createCallBackFunction(equipmentUpgrade, item, true), equipmentUpgradeMenu);
				}
				else {
					outputText("\n\nUnfortunately, you don't have the required gems.");
					doNext(equipmentUpgradeMenu);
				}
			}
			//Beautiful Sword -> Divine Pearl Sword
			if (item == weapons.B_SWORD) {
				outputText("You'll need 1x pure pearl and 2000 gems for the upgrade.");
				if (player.hasItem(consumables.P_PEARL) && player.gems >= 2000) {
					doYesNo(createCallBackFunction(equipmentUpgrade, item, true), equipmentUpgradeMenu);
				}
				else {
					outputText("\n\nUnfortunately, you don't have the required materials and gems.");
					doNext(equipmentUpgradeMenu);
				}
			}
			//Broken Scarred Blade -> Scarred Blade
			if (item == weapons.B_SCARB) {
				outputText("You'll need 1000 gems to restore the broken sword.");
				if (player.gems >= 1000) {
					doYesNo(createCallBackFunction(equipmentUpgrade, item, true), equipmentUpgradeMenu);
				}
				else {
					outputText("\n\nUnfortunately, you don't have the required gems.");
					doNext(equipmentUpgradeMenu);
				}
			}
			//Ugly Sword -> Scarred Blade
			if (item == weapons.U_SWORD) {
				outputText("You'll need 5x regular lethicite or 1x large lethicite of any kind and 2000 gems for the upgrade.");
				if ((player.hasKeyItem("Marae's Lethicite") >= 0 || player.hasKeyItem("Stone Statue Lethicite") >= 0 || player.hasKeyItem("Sheila's Lethicite") || player.hasItem(useables.LETHITE, 5)) && player.gems >= 2000) {
					menu();
					outputText("Which lethicite will you use?");
					if (player.hasItem(useables.LETHITE, 5)) addButton(0, "Regular x5", routeLethiciteUpgrade, "Normal");
					if (player.hasKeyItem("Marae's Lethicite") >= 0) addButton(1, "Marae", routeLethiciteUpgrade, "Marae");
					if (player.hasKeyItem("Sheila's Lethicite") >= 0) addButton(2, "Sheila", routeLethiciteUpgrade, "Sheila");
					if (player.hasKeyItem("Stone Statue Lethicite") >= 0) addButton(3, "Statue", routeLethiciteUpgrade, "Statue");
					addButton(5, "Cancel", equipmentUpgradeMenu);
				}
				else {
					outputText("\n\nUnfortunately, you don't have the required materials and gems.");
					doNext(equipmentUpgradeMenu);
				}
			}
			//Jeweled Rapier -> Midnight Rapier
			if (item == weapons.JRAPIER) {
				outputText("You'll need 5x regular lethicite and 2000 gems for the upgrade.");
				if (player.hasItem(useables.LETHITE, 5) && player.gems >= 2000) {
					doYesNo(createCallBackFunction(equipmentUpgrade, item, true), equipmentUpgradeMenu);
				}
				else {
					outputText("\n\nUnfortunately, you don't have the required materials and gems.");
					doNext(equipmentUpgradeMenu);
				}
			}
			if (item == weapons.S_BLADE) {
				outputText("You'll need 1x regular lethicite, 1x fox jewel and 1500 gems for the upgrade.");
				if (player.hasItem(useables.LETHITE, 1) && player.hasItem(consumables.FOXJEWL) && player.gems >= 1500) {
					doYesNo(createCallBackFunction(equipmentUpgrade, item, true), equipmentUpgradeMenu);
				}
				else {
					outputText("\n\nUnfortunately, you don't have the required materials and gems.");
					doNext(equipmentUpgradeMenu);
				}
			}
			//Eggshell Shield -> Runed Eggshell Shield
			if (item == shields.DRGNSHL) {
				outputText("You'll need 2x dragon eggs, 1x lethicite and 1250 gems for the upgrade.");
				if (player.hasItem(useables.LETHITE, 1) && player.hasItem(consumables.DRGNEGG, 2) && player.gems >= 1250) {
					doYesNo(createCallBackFunction(equipmentUpgrade, item, true), equipmentUpgradeMenu);
				}
				else {
					outputText("\n\nUnfortunately, you don't have the required materials and gems.");
					doNext(equipmentUpgradeMenu);
				}
			}
		}
		private  routeLethiciteUpgrade(choice: string): void {
			switch(choice) {
				case "Marae":
					player.removeKeyItem("Marae's Lethicite");
					break;
				case "Sheila":
					player.removeKeyItem("Sheila's Lethicite");
					break;
				case "Statue":
					player.removeKeyItem("Stone Statue Lethicite");
					break;
				default:
					player.destroyItems(useables.LETHITE, 5);
			}
			equipmentUpgrade(weapons.U_SWORD, true);
		}
		private  equipmentUpgrade(item:ItemType, confirmation: boolean = false): void {
			clearOutput();
			//Determine which flag to set.
		var  flagID: number = 0;
			switch(shopkeeper) {
				case TELADRE_WEAPON_SHOP:
					flagID = kFLAGS.WEAPON_SHOP_UPGRADE_ITEM;
					break;
				case TELADRE_ARMOUR_SHOP:
					flagID = kFLAGS.ARMOUR_SHOP_UPGRADE_ITEM;
					break;
				case BAZAAR_SMITH_SHOP:
					flagID = kFLAGS.CHILL_SMITH_UPGRADE_ITEM;
					break;
				default:
					flagID = 0;
			}
			//Sort through item upgrade process
		var  itemToGet:ItemType = undefined;
		var  gemCost: number = item.value;
			switch(item) {
				//Weapons
				case weapons.BLUNDR0:
					itemToGet = weapons.BLUNDR1;
					break;
				case weapons.BLUNDR1:
					itemToGet = weapons.BLUNDR2;
					break;
				case weapons.CLAYMR0:
					itemToGet = weapons.CLAYMR1;
					break;
				case weapons.CLAYMR1:
					itemToGet = weapons.CLAYMR2;
					break;
				case weapons.CRSBOW0:
					itemToGet = weapons.CRSBOW1;
					break;
				case weapons.CRSBOW1:
					itemToGet = weapons.CRSBOW2;
					break;
				case weapons.DAGGER0:
					itemToGet = weapons.DAGGER1;
					break;
				case weapons.DAGGER1:
					itemToGet = weapons.DAGGER2;
					break;
				case weapons.FLAIL_0:
					itemToGet = weapons.FLAIL_1;
					break;
				case weapons.FLAIL_1:
					itemToGet = weapons.FLAIL_2;
					break;
				case weapons.FLNTLK0:
					itemToGet = weapons.FLNTLK1;
					break;
				case weapons.FLNTLK1:
					itemToGet = weapons.FLNTLK2;
					break;
				case weapons.S_GAUN0:
					itemToGet = weapons.S_GAUN1;
					break;
				case weapons.S_GAUN1:
					itemToGet = weapons.S_GAUN2;
					break;
				case weapons.H_GAUN0:
					itemToGet = weapons.H_GAUN1;
					break;
				case weapons.H_GAUN1:
					itemToGet = weapons.H_GAUN2;
					break;
				case weapons.RRAPIER:
					itemToGet = weapons.JRAPIER;
					break;
				case weapons.KATANA0:
					itemToGet = weapons.KATANA1;
					break;
				case weapons.KATANA1:
					itemToGet = weapons.KATANA2;
					break;
				case weapons.L__AXE0:
					itemToGet = weapons.L__AXE1;
					break;
				case weapons.L__AXE1:
					itemToGet = weapons.L__AXE2;
					break;
				case weapons.L_HAMR0:
					itemToGet = weapons.L_HAMR1;
					break;
				case weapons.L_HAMR1:
					itemToGet = weapons.L_HAMR2;
					break;
				case weapons.MACE__0:
					itemToGet = weapons.MACE__1;
					break;
				case weapons.MACE__1:
					itemToGet = weapons.MACE__2;
					break;
				case weapons.RIDING0:
					itemToGet = weapons.RIDING1;
					break;
				case weapons.RIDING1:
					itemToGet = weapons.RIDING2;
					break;
				case weapons.SCIMTR0:
					itemToGet = weapons.SCIMTR1;
					break;
				case weapons.SCIMTR1:
					itemToGet = weapons.SCIMTR2;
					break;
				case weapons.SPEAR_0:
					itemToGet = weapons.SPEAR_1;
					break;
				case weapons.SPEAR_1:
					itemToGet = weapons.SPEAR_2;
					break;
				case weapons.WARHAM0:
					itemToGet = weapons.WARHAM1;
					break;
				case weapons.WARHAM1:
					itemToGet = weapons.WARHAM2;
					break;
				case weapons.WHIP__0:
					itemToGet = weapons.WHIP__1;
					break;
				case weapons.WHIP__1:
					itemToGet = weapons.WHIP__2;
					break;
				//Unique Weapons
				case weapons.BBSWORD:
					gemCost = 1500;
					itemToGet = weapons.B_SWORD;
					break;
				case weapons.B_SWORD:
					gemCost = 2000;
					if (confirmation) player.destroyItems(consumables.P_PEARL, 1);
					itemToGet = weapons.DPSWORD;
					break;
				case weapons.B_SCARB:
					gemCost = 1500;
					itemToGet = weapons.SCARBLD;
					break;
				case weapons.U_SWORD:
					gemCost = 2000;
					itemToGet = weapons.SCARBLD;
					break;
				case weapons.JRAPIER:
					gemCost = 2000;
					if (confirmation) player.destroyItems(useables.LETHITE, 5);
					itemToGet = weapons.MRAPIER;
					break;
				case weapons.S_BLADE:
					gemCost = 1500;
					if (confirmation) {
						player.destroyItems(useables.LETHITE, 1);
						player.destroyItems(consumables.FOXJEWL, 2); //May change
					}
					itemToGet = weapons.RSBLADE;
					break;
				//Armours
				// < NOT YET IMPLEMENTED >
				//Shields
				case shields.BUCKLR0:
					itemToGet = shields.BUCKLR1;
					break;
				case shields.BUCKLR1:
					itemToGet = shields.BUCKLR2;
					break;
				case shields.KITESH0:
					itemToGet = shields.KITESH1;
					break;
				case shields.KITESH1:
					itemToGet = shields.KITESH2;
					break;
				case shields.GRTSHL0:
					itemToGet = shields.GRTSHL1;
					break;
				case shields.GRTSHL1:
					itemToGet = shields.GRTSHL2;
					break;
				case shields.TOWRSH0:
					itemToGet = shields.TOWRSH1;
					break;
				case shields.TOWRSH1:
					itemToGet = shields.TOWRSH2;
					break;
				case shields.DRGNSHL:
					gemCost = 1250;
					if (confirmation) {
						player.destroyItems(useables.LETHITE, 1);
						player.destroyItems(consumables.DRGNEGG, 2);
					}
					itemToGet = shields.RUNESHL;
					break;
			}
			//Check to make sure item is valid.
			if (itemToGet == undefined) {
				outputText("\"<i>Sorry, it doesn't look like I can improve this weapon,</i>\" the smith frowns. Maybe there's something else you could commission an upgrade?");
				doNext(returnFunc);
				return;
			}
			if (!confirmation) {
				outputText("\"<i>I definitely can work on improving this weapon. This will cost you " + item.value + " gems. Would you like me to proceed?</i>\" The smith asks.");
				if (player.gems >= item.value) {
					doYesNo(createCallBackFunction(equipmentUpgrade, item, true), equipmentUpgradeMenu);
				}
				else {
					outputText("\n\nUnfortunately, you don't have the required gems.");
					doNext(equipmentUpgradeMenu);
				}
				return;
			}
			//Set flags
			outputText("\"<i>Thank you, I'll get working on this now. Come back tomorrow on the same time of day to pick it up,</i>\" The smith speaks.");
			flags[flagID] = itemToGet.id;
			flags[flagID+1] = 24;
			player.gems -= gemCost;
			player.destroyItems(item, 1);
			doNext(returnFunc);
		}
		private  obsidianWeaponUpgrade(item:ItemType, confirmation: boolean = false, shop: string = ""): void {
			clearOutput();
			//Determine which flag to set.
		var  flagID: number = 0;
			switch(shopkeeper) {
				case TELADRE_WEAPON_SHOP:
					flagID = kFLAGS.WEAPON_SHOP_UPGRADE_ITEM;
					break;
				case TELADRE_ARMOUR_SHOP:
					flagID = kFLAGS.ARMOUR_SHOP_UPGRADE_ITEM;
					break;
				case BAZAAR_SMITH_SHOP:
					flagID = kFLAGS.CHILL_SMITH_UPGRADE_ITEM;
					break;
				default:
					flagID = 0;
			}
			//Sort through item upgrade process
		var  itemToGet:ItemType = undefined;
		var  gemCost: number = item.value;
		var  gemCostDivided: number = (item as Weapon).tier + 1;
		var  shardCost: number = 0;
			switch(item) {
				case weapons.CLAYMR0:
				case weapons.CLAYMR1:
				case weapons.CLAYMR2:
					gemCost = 1500 / gemCostDivided;
					shardCost = 9;
					itemToGet = weapons.CLAYMRO;
					break;
				case weapons.DAGGER0:
				case weapons.DAGGER1:
				case weapons.DAGGER2:
					gemCost = 500 / gemCostDivided;
					shardCost = 3;
					itemToGet = weapons.DAGGERO;
					break;
				case weapons.FLAIL_0:
				case weapons.FLAIL_1:
				case weapons.FLAIL_2:
					gemCost = 1000 / gemCostDivided;
					shardCost = 5;
					itemToGet = weapons.FLAIL_O;
					break;
				case weapons.HALBRD0:
				case weapons.HALBRD1:
				case weapons.HALBRD2:
					gemCost = 1000 / gemCostDivided;
					shardCost = 6;
					itemToGet = weapons.HALBRDO;
					break;
				case weapons.H_GAUN0:
				case weapons.H_GAUN1:
				case weapons.H_GAUN2:
					gemCost = 500 / gemCostDivided;
					shardCost = 4;
					itemToGet = weapons.H_GAUNO;
					break;
				case weapons.KATANA0:
				case weapons.KATANA1:
				case weapons.KATANA2:
					gemCost = 1000 / gemCostDivided;
					shardCost = 6;
					itemToGet = weapons.KATANAO;
					break;
				case weapons.L__AXE0:
				case weapons.L__AXE1:
				case weapons.L__AXE2:
					gemCost = 1500 / gemCostDivided;
					shardCost = 9;
					itemToGet = weapons.L__AXEO;
					break;
				case weapons.L_HAMR0:
				case weapons.L_HAMR1:
				case weapons.L_HAMR2:
					gemCost = 1200 / gemCostDivided;
					shardCost = 8;
					itemToGet = weapons.L_HAMRO;
					break;
				case weapons.MACE__0:
				case weapons.MACE__1:
				case weapons.MACE__2:
					gemCost = 500 / gemCostDivided;
					shardCost = 4;
					itemToGet = weapons.MACE__O;
					break;
				case weapons.SCIMTR0:
				case weapons.SCIMTR1:
				case weapons.SCIMTR2:
					gemCost = 1000 / gemCostDivided;
					shardCost = 6;
					itemToGet = weapons.SCIMTRO;
					break;
				case weapons.SPEAR_0:
				case weapons.SPEAR_1:
				case weapons.SPEAR_2:
					gemCost = 1000 / gemCostDivided;
					shardCost = 6;
					itemToGet = weapons.SPEAR_O;
					break;
				case weapons.S_GAUN0:
				case weapons.S_GAUN1:
				case weapons.S_GAUN2:
					gemCost = 500 / gemCostDivided;
					shardCost = 4;
					itemToGet = weapons.S_GAUNO;
					break;
				case weapons.WARHAM0:
				case weapons.WARHAM1:
				case weapons.WARHAM2:
					gemCost = 1500 / gemCostDivided;
					shardCost = 6;
					itemToGet = weapons.WARHAMO;
					break;
				default:
					itemToGet = undefined;
			}
			//Check to make sure item is valid.
			if ((item as Weapon).isObsidian()) {
				outputText("That weapon is already reinforced with obsidian. Maybe you can reinforce something else?");
				doNext(equipmentUpgradeMenu);
				return;
			}
			if (itemToGet == undefined) {
				outputText("\"<i>Sorry, I don't think I can improve this weapon with obsidian. Try something else?</i>\" The smith speaks with a gentle frown.");
				doNext(equipmentUpgradeMenu);
				return;
			}
			if (!confirmation) {
				outputText("\"<i>I definitely can work on improving this weapon with obsidian. This will cost you " + item.value + " gems. Would you like me to proceed?</i>\" The smith asks.");
				if (player.gems < gemCost) {
					outputText("\n\nUnfortunately, you don't have enough gems to pay for that.");
					doNext(equipmentUpgradeMenu);
					return;
				}
				if (!player.hasItem(useables.OBSHARD, shardCost)) {
					outputText("\n\nYou don't have enough obsidian shards to improve the weapon.");
					doNext(equipmentUpgradeMenu);
					return;
				}
				doYesNo(createCallBackFunction(obsidianWeaponUpgrade, item, true), equipmentUpgradeMenu);
				return;
			}
			//Set flags
			outputText("\"<i>Thank you, I'll get working on this now. Come back tomorrow on the same time of day to pick it up,</i>\" The smith speaks.");
			flags[flagID] = itemToGet.id;
			flags[flagID+1] = 24;
			player.gems -= gemCost;
			player.destroyItems(item, 1);
			player.destroyItems(useables.OBSHARD, shardCost);
			doNext(returnFunc);
		}
		private  claimWeapon(): void {
			//Determine which flag to set.
		var  flagID: number = 0;
			switch(shopkeeper) {
				case TELADRE_WEAPON_SHOP:
					flagID = kFLAGS.WEAPON_SHOP_UPGRADE_ITEM;
					break;
				case TELADRE_ARMOUR_SHOP:
					flagID = kFLAGS.ARMOUR_SHOP_UPGRADE_ITEM;
					break;
				case BAZAAR_SMITH_SHOP:
					flagID = kFLAGS.CHILL_SMITH_UPGRADE_ITEM;
					break;
				default:
					flagID = 0;
			}
			inventory.takeItem(ItemType.lookupItem(flags[flagID]), equipmentUpgradeMenu);
			flags[flagID] = 0; //Clear the flag
		}
		
	}

