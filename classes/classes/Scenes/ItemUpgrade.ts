import { BaseContent } from "../BaseContent";
import { TimeAwareInterface } from "../TimeAwareInterface";
import { CoC } from "../CoC";
import { kFLAGS } from "../GlobalFlags/kFLAGS";
import { ItemType } from "../ItemType";
import { Weapon } from "../Items/Weapon";
import { Armor } from "../Items/Armor";
import { Shield } from "../Items/Shield";
import { Jewelry } from "../Items/Jewelry";

export class ItemUpgrade extends BaseContent implements TimeAwareInterface {
    private shopkeeper: string = "";
    private returnFunc: any;

    public static TELADRE_WEAPON_SHOP: string = "TelAdreWeaponShop";
    public static TELADRE_ARMOUR_SHOP: string = "TelAdreArmourShop";
    public static BAZAAR_SMITH_SHOP: string = "BazaarChillSmith";
    public static ARIAN_ENHANCEMENTS: string = "ArianEnhancements";

    public constructor() {
        super();
        CoC.timeAwareClassAdd(this);
    }

    public timeChange(): boolean {
        if (this.flags[kFLAGS.WEAPON_SHOP_UPGRADE_TIME] > 0) {
            this.flags[kFLAGS.WEAPON_SHOP_UPGRADE_TIME]--;
        }
        if (this.flags[kFLAGS.ARMOUR_SHOP_UPGRADE_TIME] > 0) {
            this.flags[kFLAGS.ARMOUR_SHOP_UPGRADE_TIME]--;
        }
        if (this.flags[kFLAGS.CHILL_SMITH_UPGRADE_TIME] > 0) {
            this.flags[kFLAGS.CHILL_SMITH_UPGRADE_TIME]--;
        }
        return false;
    }

    public timeChangeLarge(): boolean {
        return false;
    }

    private isAValidItem(item: ItemType): boolean {
        let valid: boolean = false;
        if (item instanceof Weapon) {
            if (this.shopkeeper == ItemUpgrade.TELADRE_WEAPON_SHOP || this.shopkeeper == ItemUpgrade.BAZAAR_SMITH_SHOP) valid = true;
        }
        if (item instanceof Armor || item instanceof Shield) {
            if (this.shopkeeper == ItemUpgrade.TELADRE_ARMOUR_SHOP) valid = true;
        }
        if (item instanceof Jewelry) {
            if (this.shopkeeper == ItemUpgrade.ARIAN_ENHANCEMENTS) valid = true;
        }
        return valid;
    }

    public equipmentUpgradeMenu(chosenShop: string = "", exitFunc?: any, isObsidianUpgrade: boolean = false): void {
        this.clearOutput();
        this.menu();
        // Set variables
        if (chosenShop != "") this.shopkeeper = chosenShop;
        if (exitFunc != undefined) this.returnFunc = exitFunc;
        switch (chosenShop) {
            case ItemUpgrade.TELADRE_WEAPON_SHOP:
                if (this.flags[kFLAGS.WEAPON_SHOP_UPGRADE_TIME] > 0) {
                    this.outputText("The weaponsmith is currently busy upgrading your weapon. Come back later.");
                    this.doNext(this.returnFunc);
                    return;
                }
                else if (this.flags[kFLAGS.WEAPON_SHOP_UPGRADE_ITEM] != 0) {
                    this.claimWeapon();
                    return;
                }
                break;
            case ItemUpgrade.TELADRE_ARMOUR_SHOP:
                if (this.flags[kFLAGS.ARMOUR_SHOP_UPGRADE_TIME] > 0) {
                    this.outputText("The armoursmith is currently busy upgrading your armour. Come back later.");
                    this.doNext(this.returnFunc);
                    return;
                }
                else if (this.flags[kFLAGS.ARMOUR_SHOP_UPGRADE_ITEM] != 0) {
                    this.claimWeapon();
                    return;
                }
                break;
            case ItemUpgrade.BAZAAR_SMITH_SHOP:
                if (this.flags[kFLAGS.CHILL_SMITH_UPGRADE_TIME] > 0) {
                    this.outputText("The grouchy weaponsmith is currently busy upgrading your weapon. Come back later.");
                    this.doNext(this.returnFunc);
                    return;
                }
                else if (this.flags[kFLAGS.CHILL_SMITH_UPGRADE_ITEM] != 0) {
                    this.claimWeapon();
                    return;
                }
                break;
            default:
            // Nothing here, move on.
        }
        // The main meat of this function
        this.outputText("\"<i>What equipment would you like to reinforce" + (isObsidianUpgrade ? " with obsidian" : "") + "?</i>\" The smith asks with a brow raised.");
        for (let i: number = 0; i < this.inventory.getMaxSlots(); i++) {
            if (this.player.itemSlot(i).itype == ItemType.NOTHING) {
                this.addButtonDisabled(i, "", "");
            }
            else if (this.player.itemSlot(i).itype instanceof Weapon && isObsidianUpgrade) {
                this.addButton(i, this.player.itemSlot(i).itype.shortName, this.obsidianWeaponUpgrade, this.player.itemSlot(i).itype, false, chosenShop).hint(this.player.itemSlot(i).itype.description, ItemUpgrade.capitalizeFirstLetter(this.player.itemSlot(i).itype.longName));
            }
            else if (this.player.itemSlot(i).itype instanceof Weapon && (this.player.itemSlot(i).itype as Weapon).tier >= 2) {
                this.addButtonDisabled(i, this.player.itemSlot(i).itype.shortName, "This equipment is already at its maximum tier.");
            }
            else if (this.isAValidItem(this.player.itemSlot(i).itype)) {
                this.addButton(i, this.player.itemSlot(i).itype.shortName, this.equipmentUpgradeRouter, this.player.itemSlot(i).itype).hint(this.player.itemSlot(i).itype.description, ItemUpgrade.capitalizeFirstLetter(this.player.itemSlot(i).itype.longName));
            }
            else {
                this.addButtonDisabled(i, this.player.itemSlot(i).itype.shortName, "This is not a valid type of equipment to upgrade.");
            }
        }
        if ((chosenShop == ItemUpgrade.TELADRE_WEAPON_SHOP || chosenShop == ItemUpgrade.BAZAAR_SMITH_SHOP) && !isObsidianUpgrade) {
            this.addButton(11, "Obsidian", this.equipmentUpgradeMenu, chosenShop, exitFunc, true).hint("You can reinforce certain weapons with obsidian to make it even deadlier.", "Obsidian Reinforcement");
        }
        this.addButton(14, "Back", this.returnFunc);
    }
    private equipmentUpgradeRouter(item: ItemType): void {
        this.clearOutput();
        let isSpecial: boolean = false;
        // Special upgrades that will require certain items.
        switch (item) {
            case this.weapons.BBSWORD:
            case this.weapons.B_SWORD:
            case this.weapons.B_SCARB:
            case this.weapons.U_SWORD:
            case this.weapons.S_BLADE:
            case this.weapons.JRAPIER:
            case this.weapons.W_STAFF:
                isSpecial = true;
                break;
            default:
        }
        if (isSpecial) {
            this.specialUpgradePrompt(item);
            return;
        }
        else {
            this.equipmentUpgrade(item, false);
        }
    }
    private specialUpgradePrompt(item: ItemType): void {
        // Broken Beautiful Sword -> Beautiful Sword
        if (item == this.weapons.BBSWORD) {
            this.outputText("You'll need 1000 gems to restore the broken sword.");
            if (this.player.gems >= 1000) {
                this.doYesNo(this.createCallBackFunction(this.equipmentUpgrade, item, true), this.equipmentUpgradeMenu);
            }
            else {
                this.outputText("\n\nUnfortunately, you don't have the required gems.");
                this.doNext(this.equipmentUpgradeMenu);
            }
        }
        // Beautiful Sword -> Divine Pearl Sword
        if (item == this.weapons.B_SWORD) {
            this.outputText("You'll need 1x pure pearl and 2000 gems for the upgrade.");
            if (this.player.hasItem(this.consumables.P_PEARL) && this.player.gems >= 2000) {
                this.doYesNo(this.createCallBackFunction(this.equipmentUpgrade, item, true), this.equipmentUpgradeMenu);
            }
            else {
                this.outputText("\n\nUnfortunately, you don't have the required materials and gems.");
                this.doNext(this.equipmentUpgradeMenu);
            }
        }
        // Broken Scarred Blade -> Scarred Blade
        if (item == this.weapons.B_SCARB) {
            this.outputText("You'll need 1000 gems to restore the broken sword.");
            if (this.player.gems >= 1000) {
                this.doYesNo(this.createCallBackFunction(this.equipmentUpgrade, item, true), this.equipmentUpgradeMenu);
            }
            else {
                this.outputText("\n\nUnfortunately, you don't have the required gems.");
                this.doNext(this.equipmentUpgradeMenu);
            }
        }
        // Ugly Sword -> Scarred Blade
        if (item == this.weapons.U_SWORD) {
            this.outputText("You'll need 5x regular lethicite or 1x large lethicite of any kind and 2000 gems for the upgrade.");
            if ((this.player.hasKeyItem("Marae's Lethicite") >= 0 || this.player.hasKeyItem("Stone Statue Lethicite") >= 0 || this.player.hasKeyItem("Sheila's Lethicite") || this.player.hasItem(this.useables.LETHITE, 5)) && this.player.gems >= 2000) {
                this.menu();
                this.outputText("Which lethicite will you use?");
                if (this.player.hasItem(this.useables.LETHITE, 5)) this.addButton(0, "Regular x5", this.routeLethiciteUpgrade, "Normal");
                if (this.player.hasKeyItem("Marae's Lethicite") >= 0) this.addButton(1, "Marae", this.routeLethiciteUpgrade, "Marae");
                if (this.player.hasKeyItem("Sheila's Lethicite") >= 0) this.addButton(2, "Sheila", this.routeLethiciteUpgrade, "Sheila");
                if (this.player.hasKeyItem("Stone Statue Lethicite") >= 0) this.addButton(3, "Statue", this.routeLethiciteUpgrade, "Statue");
                this.addButton(5, "Cancel", this.equipmentUpgradeMenu);
            }
            else {
                this.outputText("\n\nUnfortunately, you don't have the required materials and gems.");
                this.doNext(this.equipmentUpgradeMenu);
            }
        }
        // Jeweled Rapier -> Midnight Rapier
        if (item == this.weapons.JRAPIER) {
            this.outputText("You'll need 5x regular lethicite and 2000 gems for the upgrade.");
            if (this.player.hasItem(this.useables.LETHITE, 5) && this.player.gems >= 2000) {
                this.doYesNo(this.createCallBackFunction(this.equipmentUpgrade, item, true), this.equipmentUpgradeMenu);
            }
            else {
                this.outputText("\n\nUnfortunately, you don't have the required materials and gems.");
                this.doNext(this.equipmentUpgradeMenu);
            }
        }
        if (item == this.weapons.S_BLADE) {
            this.outputText("You'll need 1x regular lethicite, 1x fox jewel and 1500 gems for the upgrade.");
            if (this.player.hasItem(this.useables.LETHITE, 1) && this.player.hasItem(this.consumables.FOXJEWL) && this.player.gems >= 1500) {
                this.doYesNo(this.createCallBackFunction(this.equipmentUpgrade, item, true), this.equipmentUpgradeMenu);
            }
            else {
                this.outputText("\n\nUnfortunately, you don't have the required materials and gems.");
                this.doNext(this.equipmentUpgradeMenu);
            }
        }
        // Eggshell Shield -> Runed Eggshell Shield
        if (item == this.shields.DRGNSHL) {
            this.outputText("You'll need 2x dragon eggs, 1x lethicite and 1250 gems for the upgrade.");
            if (this.player.hasItem(this.useables.LETHITE, 1) && this.player.hasItem(this.consumables.DRGNEGG, 2) && this.player.gems >= 1250) {
                this.doYesNo(this.createCallBackFunction(this.equipmentUpgrade, item, true), this.equipmentUpgradeMenu);
            }
            else {
                this.outputText("\n\nUnfortunately, you don't have the required materials and gems.");
                this.doNext(this.equipmentUpgradeMenu);
            }
        }
    }
    private routeLethiciteUpgrade(choice: string): void {
        switch (choice) {
            case "Marae":
                this.player.removeKeyItem("Marae's Lethicite");
                break;
            case "Sheila":
                this.player.removeKeyItem("Sheila's Lethicite");
                break;
            case "Statue":
                this.player.removeKeyItem("Stone Statue Lethicite");
                break;
            default:
                this.player.destroyItems(this.useables.LETHITE, 5);
        }
        this.equipmentUpgrade(this.weapons.U_SWORD, true);
    }
    private equipmentUpgrade(item: ItemType, confirmation: boolean = false): void {
        this.clearOutput();
        // Determine which flag to set.
        let flagID: number = 0;
        switch (this.shopkeeper) {
            case ItemUpgrade.TELADRE_WEAPON_SHOP:
                flagID = kFLAGS.WEAPON_SHOP_UPGRADE_ITEM;
                break;
            case ItemUpgrade.TELADRE_ARMOUR_SHOP:
                flagID = kFLAGS.ARMOUR_SHOP_UPGRADE_ITEM;
                break;
            case ItemUpgrade.BAZAAR_SMITH_SHOP:
                flagID = kFLAGS.CHILL_SMITH_UPGRADE_ITEM;
                break;
            default:
                flagID = 0;
        }
        // Sort through item upgrade process
        let itemToGet: ItemType | undefined;
        let gemCost: number = item.value;
        switch (item) {
            // Weapons
            case this.weapons.BLUNDR0:
                itemToGet = this.weapons.BLUNDR1;
                break;
            case this.weapons.BLUNDR1:
                itemToGet = this.weapons.BLUNDR2;
                break;
            case this.weapons.CLAYMR0:
                itemToGet = this.weapons.CLAYMR1;
                break;
            case this.weapons.CLAYMR1:
                itemToGet = this.weapons.CLAYMR2;
                break;
            case this.weapons.CRSBOW0:
                itemToGet = this.weapons.CRSBOW1;
                break;
            case this.weapons.CRSBOW1:
                itemToGet = this.weapons.CRSBOW2;
                break;
            case this.weapons.DAGGER0:
                itemToGet = this.weapons.DAGGER1;
                break;
            case this.weapons.DAGGER1:
                itemToGet = this.weapons.DAGGER2;
                break;
            case this.weapons.FLAIL_0:
                itemToGet = this.weapons.FLAIL_1;
                break;
            case this.weapons.FLAIL_1:
                itemToGet = this.weapons.FLAIL_2;
                break;
            case this.weapons.FLNTLK0:
                itemToGet = this.weapons.FLNTLK1;
                break;
            case this.weapons.FLNTLK1:
                itemToGet = this.weapons.FLNTLK2;
                break;
            case this.weapons.S_GAUN0:
                itemToGet = this.weapons.S_GAUN1;
                break;
            case this.weapons.S_GAUN1:
                itemToGet = this.weapons.S_GAUN2;
                break;
            case this.weapons.H_GAUN0:
                itemToGet = this.weapons.H_GAUN1;
                break;
            case this.weapons.H_GAUN1:
                itemToGet = this.weapons.H_GAUN2;
                break;
            case this.weapons.RRAPIER:
                itemToGet = this.weapons.JRAPIER;
                break;
            case this.weapons.KATANA0:
                itemToGet = this.weapons.KATANA1;
                break;
            case this.weapons.KATANA1:
                itemToGet = this.weapons.KATANA2;
                break;
            case this.weapons.L__AXE0:
                itemToGet = this.weapons.L__AXE1;
                break;
            case this.weapons.L__AXE1:
                itemToGet = this.weapons.L__AXE2;
                break;
            case this.weapons.L_HAMR0:
                itemToGet = this.weapons.L_HAMR1;
                break;
            case this.weapons.L_HAMR1:
                itemToGet = this.weapons.L_HAMR2;
                break;
            case this.weapons.MACE__0:
                itemToGet = this.weapons.MACE__1;
                break;
            case this.weapons.MACE__1:
                itemToGet = this.weapons.MACE__2;
                break;
            case this.weapons.RIDING0:
                itemToGet = this.weapons.RIDING1;
                break;
            case this.weapons.RIDING1:
                itemToGet = this.weapons.RIDING2;
                break;
            case this.weapons.SCIMTR0:
                itemToGet = this.weapons.SCIMTR1;
                break;
            case this.weapons.SCIMTR1:
                itemToGet = this.weapons.SCIMTR2;
                break;
            case this.weapons.SPEAR_0:
                itemToGet = this.weapons.SPEAR_1;
                break;
            case this.weapons.SPEAR_1:
                itemToGet = this.weapons.SPEAR_2;
                break;
            case this.weapons.WARHAM0:
                itemToGet = this.weapons.WARHAM1;
                break;
            case this.weapons.WARHAM1:
                itemToGet = this.weapons.WARHAM2;
                break;
            case this.weapons.WHIP__0:
                itemToGet = this.weapons.WHIP__1;
                break;
            case this.weapons.WHIP__1:
                itemToGet = this.weapons.WHIP__2;
                break;
            // Unique Weapons
            case this.weapons.BBSWORD:
                gemCost = 1500;
                itemToGet = this.weapons.B_SWORD;
                break;
            case this.weapons.B_SWORD:
                gemCost = 2000;
                if (confirmation) this.player.destroyItems(this.consumables.P_PEARL, 1);
                itemToGet = this.weapons.DPSWORD;
                break;
            case this.weapons.B_SCARB:
                gemCost = 1500;
                itemToGet = this.weapons.SCARBLD;
                break;
            case this.weapons.U_SWORD:
                gemCost = 2000;
                itemToGet = this.weapons.SCARBLD;
                break;
            case this.weapons.JRAPIER:
                gemCost = 2000;
                if (confirmation) this.player.destroyItems(this.useables.LETHITE, 5);
                itemToGet = this.weapons.MRAPIER;
                break;
            case this.weapons.S_BLADE:
                gemCost = 1500;
                if (confirmation) {
                    this.player.destroyItems(this.useables.LETHITE, 1);
                    this.player.destroyItems(this.consumables.FOXJEWL, 2); // May change
                }
                itemToGet = this.weapons.RSBLADE;
                break;
            // Armours
            // < NOT YET IMPLEMENTED >
            // Shields
            case this.shields.BUCKLR0:
                itemToGet = this.shields.BUCKLR1;
                break;
            case this.shields.BUCKLR1:
                itemToGet = this.shields.BUCKLR2;
                break;
            case this.shields.KITESH0:
                itemToGet = this.shields.KITESH1;
                break;
            case this.shields.KITESH1:
                itemToGet = this.shields.KITESH2;
                break;
            case this.shields.GRTSHL0:
                itemToGet = this.shields.GRTSHL1;
                break;
            case this.shields.GRTSHL1:
                itemToGet = this.shields.GRTSHL2;
                break;
            case this.shields.TOWRSH0:
                itemToGet = this.shields.TOWRSH1;
                break;
            case this.shields.TOWRSH1:
                itemToGet = this.shields.TOWRSH2;
                break;
            case this.shields.DRGNSHL:
                gemCost = 1250;
                if (confirmation) {
                    this.player.destroyItems(this.useables.LETHITE, 1);
                    this.player.destroyItems(this.consumables.DRGNEGG, 2);
                }
                itemToGet = this.shields.RUNESHL;
                break;
        }
        // Check to make sure item is valid.
        if (itemToGet == undefined) {
            this.outputText("\"<i>Sorry, it doesn't look like I can improve this weapon,</i>\" the smith frowns. Maybe there's something else you could commission an upgrade?");
            this.doNext(this.returnFunc);
            return;
        }
        if (!confirmation) {
            this.outputText("\"<i>I definitely can work on improving this weapon. This will cost you " + item.value + " gems. Would you like me to proceed?</i>\" The smith asks.");
            if (this.player.gems >= item.value) {
                this.doYesNo(this.createCallBackFunction(this.equipmentUpgrade, item, true), this.equipmentUpgradeMenu);
            }
            else {
                this.outputText("\n\nUnfortunately, you don't have the required gems.");
                this.doNext(this.equipmentUpgradeMenu);
            }
            return;
        }
        // Set flags
        this.outputText("\"<i>Thank you, I'll get working on this now. Come back tomorrow on the same time of day to pick it up,</i>\" The smith speaks.");
        this.flags[flagID] = itemToGet.id;
        this.flags[flagID + 1] = 24;
        this.player.gems -= gemCost;
        this.player.destroyItems(item, 1);
        this.doNext(this.returnFunc);
    }
    private obsidianWeaponUpgrade(item: ItemType, confirmation: boolean = false, shop: string = ""): void {
        this.clearOutput();
        // Determine which flag to set.
        let flagID: number = 0;
        switch (this.shopkeeper) {
            case ItemUpgrade.TELADRE_WEAPON_SHOP:
                flagID = kFLAGS.WEAPON_SHOP_UPGRADE_ITEM;
                break;
            case ItemUpgrade.TELADRE_ARMOUR_SHOP:
                flagID = kFLAGS.ARMOUR_SHOP_UPGRADE_ITEM;
                break;
            case ItemUpgrade.BAZAAR_SMITH_SHOP:
                flagID = kFLAGS.CHILL_SMITH_UPGRADE_ITEM;
                break;
            default:
                flagID = 0;
        }
        // Sort through item upgrade process
        let itemToGet: ItemType | undefined;
        let gemCost: number = item.value;
        const gemCostDivided: number = (item as Weapon).tier + 1;
        let shardCost: number = 0;
        switch (item) {
            case this.weapons.CLAYMR0:
            case this.weapons.CLAYMR1:
            case this.weapons.CLAYMR2:
                gemCost = 1500 / gemCostDivided;
                shardCost = 9;
                itemToGet = this.weapons.CLAYMRO;
                break;
            case this.weapons.DAGGER0:
            case this.weapons.DAGGER1:
            case this.weapons.DAGGER2:
                gemCost = 500 / gemCostDivided;
                shardCost = 3;
                itemToGet = this.weapons.DAGGERO;
                break;
            case this.weapons.FLAIL_0:
            case this.weapons.FLAIL_1:
            case this.weapons.FLAIL_2:
                gemCost = 1000 / gemCostDivided;
                shardCost = 5;
                itemToGet = this.weapons.FLAIL_O;
                break;
            case this.weapons.HALBRD0:
            case this.weapons.HALBRD1:
            case this.weapons.HALBRD2:
                gemCost = 1000 / gemCostDivided;
                shardCost = 6;
                itemToGet = this.weapons.HALBRDO;
                break;
            case this.weapons.H_GAUN0:
            case this.weapons.H_GAUN1:
            case this.weapons.H_GAUN2:
                gemCost = 500 / gemCostDivided;
                shardCost = 4;
                itemToGet = this.weapons.H_GAUNO;
                break;
            case this.weapons.KATANA0:
            case this.weapons.KATANA1:
            case this.weapons.KATANA2:
                gemCost = 1000 / gemCostDivided;
                shardCost = 6;
                itemToGet = this.weapons.KATANAO;
                break;
            case this.weapons.L__AXE0:
            case this.weapons.L__AXE1:
            case this.weapons.L__AXE2:
                gemCost = 1500 / gemCostDivided;
                shardCost = 9;
                itemToGet = this.weapons.L__AXEO;
                break;
            case this.weapons.L_HAMR0:
            case this.weapons.L_HAMR1:
            case this.weapons.L_HAMR2:
                gemCost = 1200 / gemCostDivided;
                shardCost = 8;
                itemToGet = this.weapons.L_HAMRO;
                break;
            case this.weapons.MACE__0:
            case this.weapons.MACE__1:
            case this.weapons.MACE__2:
                gemCost = 500 / gemCostDivided;
                shardCost = 4;
                itemToGet = this.weapons.MACE__O;
                break;
            case this.weapons.SCIMTR0:
            case this.weapons.SCIMTR1:
            case this.weapons.SCIMTR2:
                gemCost = 1000 / gemCostDivided;
                shardCost = 6;
                itemToGet = this.weapons.SCIMTRO;
                break;
            case this.weapons.SPEAR_0:
            case this.weapons.SPEAR_1:
            case this.weapons.SPEAR_2:
                gemCost = 1000 / gemCostDivided;
                shardCost = 6;
                itemToGet = this.weapons.SPEAR_O;
                break;
            case this.weapons.S_GAUN0:
            case this.weapons.S_GAUN1:
            case this.weapons.S_GAUN2:
                gemCost = 500 / gemCostDivided;
                shardCost = 4;
                itemToGet = this.weapons.S_GAUNO;
                break;
            case this.weapons.WARHAM0:
            case this.weapons.WARHAM1:
            case this.weapons.WARHAM2:
                gemCost = 1500 / gemCostDivided;
                shardCost = 6;
                itemToGet = this.weapons.WARHAMO;
                break;
            default:
                itemToGet = undefined;
        }
        // Check to make sure item is valid.
        if ((item as Weapon).isObsidian()) {
            this.outputText("That weapon is already reinforced with obsidian. Maybe you can reinforce something else?");
            this.doNext(this.equipmentUpgradeMenu);
            return;
        }
        if (itemToGet == undefined) {
            this.outputText("\"<i>Sorry, I don't think I can improve this weapon with obsidian. Try something else?</i>\" The smith speaks with a gentle frown.");
            this.doNext(this.equipmentUpgradeMenu);
            return;
        }
        if (!confirmation) {
            this.outputText("\"<i>I definitely can work on improving this weapon with obsidian. This will cost you " + item.value + " gems. Would you like me to proceed?</i>\" The smith asks.");
            if (this.player.gems < gemCost) {
                this.outputText("\n\nUnfortunately, you don't have enough gems to pay for that.");
                this.doNext(this.equipmentUpgradeMenu);
                return;
            }
            if (!this.player.hasItem(this.useables.OBSHARD, shardCost)) {
                this.outputText("\n\nYou don't have enough obsidian shards to improve the weapon.");
                this.doNext(this.equipmentUpgradeMenu);
                return;
            }
            this.doYesNo(this.createCallBackFunction(this.obsidianWeaponUpgrade, item, true), this.equipmentUpgradeMenu);
            return;
        }
        // Set flags
        this.outputText("\"<i>Thank you, I'll get working on this now. Come back tomorrow on the same time of day to pick it up,</i>\" The smith speaks.");
        this.flags[flagID] = itemToGet.id;
        this.flags[flagID + 1] = 24;
        this.player.gems -= gemCost;
        this.player.destroyItems(item, 1);
        this.player.destroyItems(this.useables.OBSHARD, shardCost);
        this.doNext(this.returnFunc);
    }
    private claimWeapon(): void {
        // Determine which flag to set.
        let flagID: number = 0;
        switch (this.shopkeeper) {
            case ItemUpgrade.TELADRE_WEAPON_SHOP:
                flagID = kFLAGS.WEAPON_SHOP_UPGRADE_ITEM;
                break;
            case ItemUpgrade.TELADRE_ARMOUR_SHOP:
                flagID = kFLAGS.ARMOUR_SHOP_UPGRADE_ITEM;
                break;
            case ItemUpgrade.BAZAAR_SMITH_SHOP:
                flagID = kFLAGS.CHILL_SMITH_UPGRADE_ITEM;
                break;
            default:
                flagID = 0;
        }
        this.inventory.takeItem(ItemType.lookupItem(this.flags[flagID]), this.equipmentUpgradeMenu);
        this.flags[flagID] = 0; // Clear the flag
    }

}
