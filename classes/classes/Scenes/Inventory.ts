import { BaseContent } from "../BaseContent";
import { Serializable } from "../internals/Serializable";
import { LoggerFactory } from "../internals/LoggerFactory";
import { ItemSlot } from "../ItemSlot";
import { Saves } from "../Saves";
import { kFLAGS } from "../GlobalFlags/kFLAGS";
import { StatusEffects } from "../StatusEffects";
import { kACHIEVEMENTS } from "../GlobalFlags/kACHIEVEMENTS";
import { ItemType } from "../ItemType";
import { CoC_Settings } from "../CoC_Settings";
import { Useable } from "../Items/Useable";
import { debug } from "console";
import { PerkLib } from "../PerkLib";
import { Armor } from "../Items/Armor";
import { Weapon } from "../Items/Weapon";
import { Jewelry } from "../Items/Jewelry";
import { Shield } from "../Items/Shield";
import { Undergarment } from "../Items/Undergarment";
import { WeaponLib } from "../Items/WeaponLib";
import { ShieldLib } from "../Items/ShieldLib";
import { JewelryLib } from "../Items/JewelryLib";
import { ArmorLib } from "../Items/ArmorLib";
import { UndergarmentLib } from "../Items/UndergarmentLib";
import { SerializationUtils } from "../internals/SerializationUtils";
import { kGAMECLASS } from "../GlobalFlags/kGAMECLASS";

/**
 * Created by aimozg on 12.01.14.
 */

export class Inventory extends BaseContent implements Serializable {
    private static SERIALIZATION_VERSION: number = 1;
    private static SERIALIZATION_UUID: string = "230d7e43-bbc6-4c25-bd76-1f1175a0c58e";

    private static LOGGER: ILogger = LoggerFactory.getLogger(Inventory);

    private static inventorySlotName: any[] = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];

    // TODO refactor storage into own type?
    public static STORAGE_JEWELRY_BOX: string = "Equipment Storage - Jewelry Box";

    /**
     * Stores items that are not gear, using chests?
     */
    private itemStorage: any[];
    /**
     * Stores various gear, such as armor, weapons, shields, etc. Used with different types of racks.
     */
    private gearStorage: any[];
    /**
     * Stores items when in prison?
     */
    private prisonStorage: any[];
    /**
     * These are used so that we know what has to happen once the player finishes with an item
     */
    private callNext: any;
    /**
     * They simplify dealing with items that have a sub menu. Set in inventoryMenu and in takeItem
     */
    private callOnAbandon: any;
    /**
     * The slot previously occupied by the current item - only needed for stashes and items with a sub menu.
     */
    private currentItemSlot: ItemSlot;

    public constructor(saveSystem: Saves) {
        super();
        this.itemStorage = [];
        this.gearStorage = [];
        this.prisonStorage = [];
        saveSystem.linkToInventory(this.gearStorageDirectGet);
    }

    public showStash(): boolean {
        return this.player.hasKeyItem("Equipment Rack - Weapons") >= 0 || this.player.hasKeyItem("Equipment Rack - Armor") >= 0 || this.itemStorage.length > 0 || this.flags[kFLAGS.ANEMONE_KID] > 0 || this.player.hasKeyItem(Inventory.STORAGE_JEWELRY_BOX) >= 0 || this.flags[kFLAGS.CAMP_CABIN_FURNITURE_DRESSER] > 0;
    }

    public itemStorageDirectGet(): any[] { return this.itemStorage; }

    public gearStorageDirectGet(): any[] { return this.gearStorage; }

    public prisonStorageDirectGet(): any[] { return this.prisonStorage; }

    // 		public function currentCallNext() { return callNext; }

    public itemGoNext(): void { if (this.callNext != undefined) this.doNext(this.callNext); }

    public inventoryMenu(): void {
        let x: number;
        let foundItem: boolean = false;
        if (this.getGame().inCombat) {
            this.callNext = this.inventoryCombatHandler; // Player will return to combat after item use
        }
        else {
            this.spriteSelect(undefined);
            this.callNext = this.inventoryMenu; // In camp or in a dungeon player will return to inventory menu after item use
        }
        this.hideMenus();
        this.hideUpDown();
        this.clearOutput();
        kGAMECLASS.displayHeader("Inventory");
        this.outputText("<b><u>Equipment:</u></b>\n");
        this.outputText("<b>Weapon:</b> " + this.player.weapon.name + " (Attack: " + this.player.weaponAttack + (this.player.weapon.isDegradable() ? ", Durability: " + (this.player.weapon.durability - this.flags[kFLAGS.WEAPON_DURABILITY_DAMAGE]) + "/" + this.player.weapon.durability : "") + ")\n");
        this.outputText("<b>Shield:</b> " + this.player.shield.name + " (Block Rating: " + this.player.shieldBlock + ")\n");
        this.outputText("<b>Armour:</b> " + this.player.armor.name + " (Defense: " + this.player.armorDef + ")\n");
        this.outputText("<b>Upper underwear:</b> " + this.player.upperGarment.name + "\n");
        this.outputText("<b>Lower underwear:</b> " + this.player.lowerGarment.name + "\n");
        this.outputText("<b>Accessory:</b> " + this.player.jewelryName + "\n");
        if (this.player.keyItems.length > 0) this.outputText("<b><u>\nKey Items:</u></b>\n");
        for (x = 0; x < this.player.keyItems.length; x++) this.outputText(this.player.keyItems[x].keyName + "\n");
        this.menu();
        for (x = 0; x < 10; x++) {
            if (this.player.itemSlots[x].unlocked && this.player.itemSlots[x].quantity > 0) {
                this.addButton(x, (this.player.itemSlots[x].itype.shortName + " x" + this.player.itemSlots[x].quantity), this.useItemInInventory, x).hint(this.generateInventoryTooltip(this.player.itemSlots[x]), Inventory.capitalizeFirstLetter(this.player.itemSlots[x].itype.longName));
                foundItem = true;
            }
        }
        if (!this.getGame().inCombat) {
            this.addButton(10, "Unequip", this.manageEquipment);
        }

        if (!this.getGame().inCombat && this.flags[kFLAGS.DELETE_ITEMS] == 1) {
            this.addButton(11, "Del Item: One", this.deleteItems).hint("Trash your items, one by one.\n\nClick to trash all in a stack.\nClick twice to stop.", "Delete Items (Single)");
        } else if (!this.getGame().inCombat && this.flags[kFLAGS.DELETE_ITEMS] == 2) {
            this.addButton(11, "Del Item: All", this.deleteItems).hint("Trash all of your items in a stack.\n\nClick to stop.\nClick twice to trash your items one by one.", "Delete Items (Stack)");
        } else if (!this.getGame().inCombat && this.flags[kFLAGS.DELETE_ITEMS] == 0) {
            this.addButton(11, "Del Item: OFF", this.deleteItems).hint("Start throwing away your items.\n\nClick to trash your items one by one.\nClick twice to trash all in a stack.", "Delete Items (Off)");
        }

        if (!this.getGame().inCombat && this.inDungeon == false && this.inRoomedDungeon == false && this.flags[kFLAGS.IN_PRISON] == 0 && this.flags[kFLAGS.IN_INGNAM] == 0 && this.checkKeyItems(true)) {
            this.addButton(12, "Key Items", this.checkKeyItems);
            foundItem = true;
        }
        if (!this.getGame().inCombat && this.player.armor == this.armors.BIMBOSK) {
            this.addButton(13, (this.flags[kFLAGS.BIMBO_MINISKIRT_PROGRESS_DISABLED] == 0 ? "Disable Bimbo" : "Enable Bimbo"), this.getGame().bimboProgress.toggleProgress, undefined, undefined, undefined, (this.flags[kFLAGS.BIMBO_MINISKIRT_PROGRESS_DISABLED] == 0 ? "Disable bimbo progression from Bimbo Miniskirt." : "Enable bimbo progression from Bimbo Miniskirt."));
        }
        if (!foundItem) {
            this.outputText("\nYou have no usable items.");
            this.doNext(this.playerMenu);
            if (!this.getGame().inCombat) {
                this.addButton(10, "Unequip", this.manageEquipment);
            }
            return;
        }
        if (this.getGame().inCombat && this.player.hasStatusEffect(StatusEffects.Sealed) && this.player.statusEffectv1(StatusEffects.Sealed) == 3) {
            this.outputText("\nYou reach for your items, but you just can't get your pouches open.  <b>Your ability to use items was sealed, and now you've wasted a chance to attack!</b>\n\n");
            this.monster.doAI();
            return;
        }
        if (this.flags[kFLAGS.DELETE_ITEMS] > 0) this.outputText("\nWhich item will you discard?");
        else this.outputText("\nWhich item will you use?");
        this.outputText("\n<b>Capacity:</b> " + this.getOccupiedSlots() + " / " + this.getMaxSlots());
        this.addButton(14, "Back", this.exitInventory);
    }

    private exitInventory(): void {
        this.flags[kFLAGS.DELETE_ITEMS] = 0;
        if (this.getGame().inCombat)
            this.combat.combatMenu(false); // Player returns to the combat menu on cancel
        else
            this.playerMenu();
    }

    public stash(): void {
        this.hideMenus();
        this.clearOutput();
        this.spriteSelect(undefined);
        this.menu();
        if (this.flags[kFLAGS.ANEMONE_KID] > 0) {
            kGAMECLASS.anemoneScene.anemoneBarrelDescription();
            if (this.getGame().time.hours >= 6) this.addButton(4, "Anemone", kGAMECLASS.anemoneScene.approachAnemoneBarrel);
        }
        if (this.player.hasKeyItem("Camp - Chest") >= 0 || this.player.hasKeyItem("Camp - Murky Chest") >= 0 || this.player.hasKeyItem("Camp - Ornate Chest") >= 0) {
            const chestArray: any[] = [];
            if (this.player.hasKeyItem("Camp - Chest") >= 0) chestArray.push("a large wood and iron chest");
            if (this.player.hasKeyItem("Camp - Murky Chest") >= 0) chestArray.push("a medium damp chest");
            if (this.player.hasKeyItem("Camp - Ornate Chest") >= 0) chestArray.push("a medium gilded chest");
            this.outputText("You have " + Inventory.formatStringArray(chestArray) + " to help store excess items located ");
            if (this.camp.homeDesc() == "cabin") this.outputText("inside your cabin");
            else this.outputText("near the portal entrance");
            this.outputText(".\n\n");
            this.addButton(0, "Chest Store", this.pickItemToPlaceInCampStorage);
            if (this.hasItemsInStorage()) this.addButton(1, "Chest Take", this.pickItemToTakeFromCampStorage);
        }
        // Weapon Rack
        if (this.player.hasKeyItem("Equipment Rack - Weapons") >= 0) {
            this.outputText("There's a weapon rack set up here, set up to hold up to nine various weapons.");
            this.addButton(2, "W.Rack Put", this.pickItemToPlaceInWeaponRack);
            if (this.weaponRackDescription()) this.addButton(3, "W.Rack Take", this.pickItemToTakeFromWeaponRack);
            this.outputText("\n\n");
        }
        // Armor Rack
        if (this.player.hasKeyItem("Equipment Rack - Armor") >= 0) {
            this.outputText("Your camp has an armor rack set up to hold your various sets of gear.  It appears to be able to hold nine different types of armor.");
            this.addButton(5, "A.Rack Put", this.pickItemToPlaceInArmorRack);
            if (this.armorRackDescription()) this.addButton(6, "A.Rack Take", this.pickItemToTakeFromArmorRack);
            this.outputText("\n\n");
        }
        // Shield Rack
        if (this.player.hasKeyItem("Equipment Rack - Shields") >= 0) {
            this.outputText("There's a shield rack set up here, set up to hold up to nine various shields.");
            this.addButton(7, "S.Rack Put", this.pickItemToPlaceInShieldRack);
            if (this.shieldRackDescription()) this.addButton(8, "S.Rack Take", this.pickItemToTakeFromShieldRack);
            this.outputText("\n\n");
        }
        // Jewelry box
        if (this.player.hasKeyItem(Inventory.STORAGE_JEWELRY_BOX) >= 0) {
            this.outputText("Your jewelry box is located ");
            if (this.flags[kFLAGS.CAMP_BUILT_CABIN] > 0 && this.flags[kFLAGS.CAMP_CABIN_FURNITURE_BED]) {
                if (this.flags[kFLAGS.CAMP_CABIN_FURNITURE_DRESSER]) this.outputText("on your dresser inside your cabin.");
                else {
                    if (this.flags[kFLAGS.CAMP_CABIN_FURNITURE_NIGHTSTAND]) this.outputText("on your nightstand inside your cabin.");
                    else this.outputText("under your bed inside your cabin.");
                }
            }
            else this.outputText("next to your bedroll.");
            this.addButton(10, "J.Box Put", this.inventory.pickItemToPlaceInJewelryBox);
            if (this.inventory.jewelryBoxDescription()) this.addButton(11, "J.Box Take", this.inventory.pickItemToTakeFromJewelryBox);
            this.outputText("\n\n");
        }
        // Dresser
        if (this.flags[kFLAGS.CAMP_CABIN_FURNITURE_DRESSER] > 0) {
            this.outputText("You have a dresser inside your cabin to store nine different types of undergarments.");
            this.addButton(12, "Dresser Put", this.inventory.pickItemToPlaceInDresser);
            if (this.inventory.dresserDescription()) this.addButton(13, "Dresser Take", this.inventory.pickItemToTakeFromDresser);
            this.outputText("\n\n");
        }
        this.addButton(14, "Back", this.playerMenu);
        // Achievement time!
        let isAchievementEligible: boolean = true;
        let i: number = 0;
        if (this.getMaxSlots() < 10) isAchievementEligible = false;
        if (this.getOccupiedSlots() < 10) isAchievementEligible = false;
        if (this.itemStorage.length < 14) isAchievementEligible = false; // Need to have all the chests!
        for (i = 0; i < this.itemStorage.length; i++) {
            if (this.itemStorage[i].quantity <= 0) isAchievementEligible = false;
        }
        if (this.gearStorage.length < 45) isAchievementEligible = false; // Need to have all the storage!
        for (i = 0; i < this.gearStorage.length; i++) {
            if (this.gearStorage[i].quantity <= 0) isAchievementEligible = false;
        }
        if (isAchievementEligible) this.awardAchievement("Item Vault", kACHIEVEMENTS.WEALTH_ITEM_VAULT, true);
    }

    public takeItem(itype: ItemType, nextAction: any, overrideAbandon?: any, source?: ItemSlot): void {
        if (itype == undefined) {
            CoC_Settings.error("takeItem(undefined)");
            return;
        }
        if (itype == ItemType.NOTHING) return;
        if (nextAction != undefined)
            this.callNext = nextAction;
        else this.callNext = this.playerMenu;
        // Check for an existing stack with room in the inventory and return the value for it.
        let temp: number = this.player.roomInExistingStack(itype);
        if (temp >= 0) { // First slot go!
            this.player.itemSlots[temp].quantity++;
            this.outputText("You place " + itype.longName + " in your " + Inventory.inventorySlotName[temp] + " pouch, giving you " + this.player.itemSlots[temp].quantity + " of them.");
            this.itemGoNext();
            return;
        }
        // If not done, then put it in an empty spot!
        // Throw in slot 1 if there is room
        temp = this.player.emptySlot();
        if (temp >= 0) {
            this.player.itemSlots[temp].setItemAndQty(itype, 1);
            if (source != undefined) this.player.itemSlots[temp].damage = source.damage;
            else this.player.itemSlots[temp].damage = 0;
            this.outputText("You place " + itype.longName + " in your " + Inventory.inventorySlotName[temp] + " pouch.");
            this.itemGoNext();
            return;
        }
        if (overrideAbandon != undefined) // callOnAbandon only becomes important if the inventory is full
            this.callOnAbandon = overrideAbandon;
        else this.callOnAbandon = this.callNext;
        // OH NOES! No room! Call replacer functions!
        this.takeItemFull(itype, true, source);
    }

    public returnItemToInventory(item: Useable, showNext: boolean = true): void { // Used only by items that have a sub menu if the player cancels
        if (!debug) {
            if (this.currentItemSlot == undefined) {
                this.takeItem(item, this.callNext, this.callNext, undefined); // Give player another chance to put item in inventory
            }
            else if (this.currentItemSlot.quantity > 0) { // Add it back to the existing stack
                this.currentItemSlot.quantity++;
            }
            else { // Put it back in the slot it came from
                this.currentItemSlot.setItemAndQty(item, 1);
            }
        }
        if (this.getGame().inCombat) {
            this.monster.doAI();
            return;
        }
        if (showNext)
            this.doNext(this.callNext); // Items with sub menus should return to the inventory screen if the player decides not to use them
        else this.callNext(); // When putting items back in your stash we should skip to the take from stash menu
    }

    // Check to see if anything is stored
    public hasItemsInStorage(): boolean { return this.itemAnyInStorage(this.itemStorage, 0, this.itemStorage.length); }

    public hasItemInStorage(itype: ItemType): boolean { return this.itemTypeInStorage(this.itemStorage, 0, this.itemStorage.length, itype); }

    public consumeItemInStorage(itype: ItemType): boolean {
        this.temp = this.itemStorage.length;
        while (this.temp > 0) {
            this.temp--;
            if (this.itemStorage[this.temp].itype == itype && this.itemStorage[this.temp].quantity > 0) {
                this.itemStorage[this.temp].quantity--;
                return true;
            }
        }
        return false;
    }

    public giveHumanizer(): void {
        if (this.flags[kFLAGS.TIMES_CHEATED_COUNTER] > 0) {
            this.clearOutput();
            this.outputText("<b>I was a cheater until I took an arrow to the knee...</b>");
            this.getGame().gameOver();
            return;
        }
        this.clearOutput();
        this.outputText("I AM NOT A CROOK.  BUT YOU ARE!  <b>CHEATER</b>!\n\n");
        this.inventory.takeItem(this.consumables.HUMMUS_, this.playerMenu);
        this.flags[kFLAGS.TIMES_CHEATED_COUNTER]++;
    }

    public getMaxSlots(): number {
        let slots: number = 3;
        if (this.player.findPerk(PerkLib.StrongBack) >= 0) slots++;
        if (this.player.findPerk(PerkLib.StrongBack2) >= 0) slots++;
        slots += this.player.keyItemv1("Backpack");
        // Constrain slots to between 3 and 10.
        if (slots < 3) slots = 3;
        if (slots > 10) slots = 10;
        return slots;
    }
    public getOccupiedSlots(): number {
        let occupiedSlots: number = 0;
        for (let i: number = 0; i < this.player.itemSlots.length; i++) {
            if (!this.player.itemSlot(i).isEmpty() && this.player.itemSlot(i).unlocked) occupiedSlots++;
        }
        return occupiedSlots;
    }

    // Create a storage slot
    public createStorage(): boolean {
        if (this.itemStorage.length >= 16) return false;
        const newSlot: ItemSlot = new ItemSlot();
        this.itemStorage.push(newSlot);
        return true;
    }

    // Clear storage slots
    public clearStorage(): void {
        // Various Errors preventing action
        if (this.itemStorage == undefined) {
            Inventory.LOGGER.error("Cannot clear storage because it does not exist.");
        }
        else {
            Inventory.LOGGER.debug("Attempted to remove {0} storage slots.", this.itemStorage.length);
            this.itemStorage.splice(0, this.itemStorage.length);
        }
    }

    public clearGearStorage(): void {
        // Various Errors preventing action
        if (this.gearStorage == undefined) {
            Inventory.LOGGER.error("Cannot clear gear storage because it does not exist.");
        }
        else {
            Inventory.LOGGER.debug("Attempted to remove {0} gear storage slots.", this.gearStorage.length);
            this.gearStorage.splice(0, this.gearStorage.length);
        }
    }

    public initializeGearStorage(): void {
        // Completely empty storage array
        if (this.gearStorage == undefined) {
            // TODO refactor this to use clearGearStorage()
            Inventory.LOGGER.error("Cannot clear gearStorage because storage does not exist.");
        }
        else {
            Inventory.LOGGER.debug("Attempted to remove {0} gear storage slots.", this.gearStorage.length);
            this.gearStorage.splice(0, this.gearStorage.length);
        }
        // Rebuild a new one!
        let newSlot: ItemSlot;
        while (this.gearStorage.length < 45) {
            newSlot = new ItemSlot();
            this.gearStorage.push(newSlot);
        }
    }

    private useItemInInventory(slotNum: number): void {
        this.clearOutput();
        if (this.player.itemSlots[slotNum].itype instanceof Useable) {
            const item: Useable = this.player.itemSlots[slotNum].itype as Useable;
            if (this.flags[kFLAGS.DELETE_ITEMS] == 1) {
                this.deleteItemPrompt(item, slotNum);
                return;
            } else if (this.flags[kFLAGS.DELETE_ITEMS] == 2) {
                this.deleteItemsPrompt(item, slotNum);
                return;
            }
            if (item.canUse()) { // If an item cannot be used then canUse should provide a description of why the item cannot be used
                if (!debug) this.player.itemSlots[slotNum].removeOneItem();
                this.useItem(item, this.player.itemSlots[slotNum]);
                return;
            }
        }
        else {
            this.outputText("You cannot use " + this.player.itemSlots[slotNum].itype.longName + "!\n\n");
        }
        this.itemGoNext();
    }

    private inventoryCombatHandler(): void {
        if (!this.combat.combatRoundOver()) { // Check if the battle is over.
            this.outputText("\n\n");
            this.monster.doAI();
        }
    }

    private deleteItems(): void {
        if (this.flags[kFLAGS.DELETE_ITEMS] == 0) {
            this.flags[kFLAGS.DELETE_ITEMS]++;
        } else if (this.flags[kFLAGS.DELETE_ITEMS] == 1) {
            this.flags[kFLAGS.DELETE_ITEMS]++;
        } else if (this.flags[kFLAGS.DELETE_ITEMS] == 2) {
            this.flags[kFLAGS.DELETE_ITEMS] = 0;
        }
        this.inventoryMenu();
    }

    private deleteItemPrompt(item: Useable, slotNum: number): void {
        this.clearOutput();
        this.outputText("Are you sure you want to destroy 1 " + item.shortName + "?  You won't be able to retrieve it!");
        this.menu();
        this.addButton(0, "Yes", this.delete1Item, item, slotNum);
        this.addButton(1, "No", this.inventoryMenu);
    }

    private deleteItemsPrompt(item: Useable, slotNum: number): void {
        this.clearOutput();
        this.outputText("Are you sure you want to destroy " + this.player.itemSlots[slotNum].quantity + "x " + item.shortName + "?  You won't be able to retrieve " + (this.player.itemSlots[slotNum].quantity == 1 ? "it" : "them") + "!");
        this.menu();
        this.addButton(0, "Yes", this.deleteItem, item, slotNum);
        this.addButton(1, "No", this.inventoryMenu);
    }

    public delete1Item(item: Useable, slotNum: number): void {
        this.clearOutput();
        this.outputText("1 " + item.shortName + " has been destroyed.");
        this.player.destroyItems(item, 1);
        this.doNext(this.inventoryMenu);
    }

    private deleteItem(item: Useable, slotNum: number): void {
        this.clearOutput();
        this.outputText(this.player.itemSlots[slotNum].quantity + "x " + item.shortName + " " + (this.player.itemSlots[slotNum].quantity == 1 ? "has" : "have") + " been destroyed.");
        this.player.destroyItems(item, this.player.itemSlots[slotNum].quantity);
        this.doNext(this.inventoryMenu);
    }

    private useItem(item: Useable, fromSlot: ItemSlot): void {
        item.useText();
        if (item instanceof Armor) {
            this.player.armor.removeText();
            item = this.player.setArmor(item as Armor); // Item is now the player's old armor
            if (item == undefined)
                this.itemGoNext();
            else this.takeItem(item, this.callNext);
        }
        else if (item instanceof Weapon) {
            this.player.weapon.removeText();
            const temp: ItemSlot = new ItemSlot();
            temp.quantity = - 1;
            temp.damage = this.flags[kFLAGS.WEAPON_DURABILITY_DAMAGE];
            item = this.player.setWeapon(item as Weapon); // Item is now the player's old weapon
            this.flags[kFLAGS.WEAPON_DURABILITY_DAMAGE] = fromSlot != undefined ? fromSlot.damage : 0; // Set condition accordingly
            if (item == undefined)
                this.itemGoNext();
            else this.takeItem(item, this.callNext, undefined, temp);
        }
        else if (item instanceof Jewelry) {
            this.player.jewelry.removeText();
            item = this.player.setJewelry(item as Jewelry); // Item is now the player's old jewelry
            if (item == undefined)
                this.itemGoNext();
            else this.takeItem(item, this.callNext);
        }
        else if (item instanceof Shield) {
            this.player.shield.removeText();
            item = this.player.setShield(item as Shield); // Item is now the player's old shield
            if (item == undefined)
                this.itemGoNext();
            else this.takeItem(item, this.callNext);
        }
        else if (item instanceof Undergarment) {
            if (item.type == 0) this.player.upperGarment.removeText();
            else this.player.lowerGarment.removeText();
            item = this.player.setUndergarment(item as Undergarment, item.type); // Item is now the player's old shield
            if (item == undefined)
                this.itemGoNext();
            else this.takeItem(item, this.callNext);
        }
        else {
            this.currentItemSlot = fromSlot;
            if (!item.useItem()) this.itemGoNext(); // Items should return true if they have provided some form of sub-menu.
            // This is used for Reducto and GroPlus (which always present the player with a sub-menu)
            // and for the Kitsune Gift (which may show a sub-menu if the player has a full inventory)
            // 				if (!item.hasSubMenu()) itemGoNext(); //Don't call itemGoNext if there's a sub menu, otherwise it would never be displayed
        }
    }

    private takeItemFull(itype: ItemType, showUseNow: boolean, source: ItemSlot): void {
        this.outputText("There is no room for " + itype.longName + " in your inventory.  You may replace the contents of a pouch with " + itype.longName + " or abandon it.");
        this.menu();
        for (let x: number = 0; x < 10; x++) {
            if (this.player.itemSlots[x].unlocked)
                this.addButton(x, (this.player.itemSlots[x].itype.shortName + " x" + this.player.itemSlots[x].quantity), this.replaceItem, itype, x, source);
        }
        if (source != undefined && source.quantity >= 0) {
            this.currentItemSlot = source;
            this.addButton(12, "Put Back", this.returnItemToInventory, itype, false);
        }
        if (showUseNow && itype instanceof Useable) this.addButton(13, "Use Now", this.useItemNow, itype as Useable, source);
        this.addButton(14, "Abandon", this.callOnAbandon); // Does not doNext - immediately executes the callOnAbandon function
    }

    private useItemNow(item: Useable, source?: ItemSlot): void {
        this.clearOutput();
        if (item.canUse()) { // If an item cannot be used then canUse should provide a description of why the item cannot be used
            this.useItem(item, source);
        }
        else {
            this.takeItemFull(item, false, source); // Give the player another chance to take this item
        }
    }

    private replaceItem(itype: ItemType, slotNum: number, source?: ItemSlot): void {
        this.clearOutput();
        if (this.player.itemSlots[slotNum].itype == itype) // If it is the same as what's in the slot...just throw away the new item
            this.outputText("You discard " + itype.longName + " from the stack to make room for the new one.");
        else { // If they are different...
            if (this.player.itemSlots[slotNum].quantity == 1) this.outputText("You throw away " + this.player.itemSlots[slotNum].itype.longName + " and replace it with " + itype.longName + ".");
            else this.outputText("You throw away " + this.player.itemSlots[slotNum].itype.longName + "(x" + this.player.itemSlots[slotNum].quantity + ") and replace it with " + itype.longName + ".");
            this.player.itemSlots[slotNum].setItemAndQty(itype, 1);
            if (source != undefined) this.player.itemSlots[slotNum].damage = source.damage;
        }
        this.itemGoNext();
    }

    public armorRackDescription(): boolean {
        if (this.itemAnyInStorage(this.gearStorage, 9, 18)) {
            const itemList: any[] = [];
            for (let x: number = 9; x < 18; x++)
                if (this.gearStorage[x].quantity > 0) itemList[itemList.length] = this.gearStorage[x].itype.longName;
            this.outputText("  It currently holds " + Inventory.formatStringArray(itemList) + ".");
            return true;
        }
        return false;
    }

    public weaponRackDescription(): boolean {
        if (this.itemAnyInStorage(this.gearStorage, 0, 9)) {
            const itemList: any[] = [];
            for (let x: number = 0; x < 9; x++)
                if (this.gearStorage[x].quantity > 0) itemList[itemList.length] = this.gearStorage[x].itype.longName;
            this.outputText("  It currently holds " + Inventory.formatStringArray(itemList) + ".");
            return true;
        }
        return false;
    }

    public shieldRackDescription(): boolean {
        if (this.itemAnyInStorage(this.gearStorage, 36, 45)) {
            const itemList: any[] = [];
            for (let x: number = 36; x < 45; x++)
                if (this.gearStorage[x].quantity > 0) itemList[itemList.length] = this.gearStorage[x].itype.longName;
            this.outputText("  It currently holds " + Inventory.formatStringArray(itemList) + ".");
            return true;
        }
        return false;
    }

    public jewelryBoxDescription(): boolean {
        if (this.itemAnyInStorage(this.gearStorage, 18, 27)) {
            const itemList: any[] = [];
            for (let x: number = 18; x < 27; x++)
                if (this.gearStorage[x].quantity > 0) itemList[itemList.length] = this.gearStorage[x].itype.longName;
            this.outputText("  It currently holds " + Inventory.formatStringArray(itemList) + ".");
            return true;
        }
        return false;
    }

    public dresserDescription(): boolean {
        if (this.itemAnyInStorage(this.gearStorage, 27, 36)) {
            const itemList: any[] = [];
            for (let x: number = 27; x < 36; x++)
                if (this.gearStorage[x].quantity > 0) itemList[itemList.length] = this.gearStorage[x].itype.longName;
            this.outputText("  It currently holds " + Inventory.formatStringArray(itemList) + ".");
            return true;
        }
        return false;
    }

    private itemAnyInStorage(storage: any[], startSlot: number, endSlot: number): boolean {
        for (let x: number = startSlot; x < endSlot; x++) {
            if (storage[x] != undefined) if (storage[x].quantity > 0) return true;
        }
        return false;
    }

    private itemTypeInStorage(storage: any[], startSlot: number, endSlot: number, itype: ItemType): boolean {
        for (let x: number = startSlot; x < endSlot; x++) {
            if (storage[x] != undefined) if (storage[x].quantity > 0 && storage[x].itype == itype) return true;
        }
        return false;
    }

    public removeItemFromStorage(storage: any[], itype: ItemType): void {
        for (let x: number = 0; x < storage.length; x++) {
            if (storage[x] != undefined) {
                if (storage[x].quantity > 0 && storage[x].itype == itype) {
                    storage[x].quantity--;
                    return;
                }
            }
        }
    }

    private pickItemToTakeFromCampStorage(): void {
        this.callNext = this.pickItemToTakeFromCampStorage;
        this.pickItemToTakeFromStorage(this.itemStorage, 0, this.itemStorage.length, "storage");
    }

    public manageEquipment(): void {
        this.clearOutput();
        this.outputText("Which would you like to unequip?\n\n");
        this.menu();
        if (this.player.weapon != WeaponLib.FISTS)
            this.addButton(0, "Weapon", this.unequipWeapon).hint(this.player.weapon.description, Inventory.capitalizeFirstLetter(this.player.weapon.name));
        else
            this.addButtonDisabled(0, "Weapon");

        if (this.player.shield != ShieldLib.NOTHING)
            this.addButton(1, "Shield", this.unequipShield).hint(this.player.shield.description, Inventory.capitalizeFirstLetter(this.player.shield.name));
        else
            this.addButtonDisabled(1, "Shield");

        if (this.player.jewelry != JewelryLib.NOTHING)
            this.addButton(2, "Accessory", this.unequipJewel).hint(this.player.jewelry.description, Inventory.capitalizeFirstLetter(this.player.jewelry.name));
        else
            this.addButtonDisabled(2, "Accessory");

        if (this.player.armor != ArmorLib.NOTHING)
            this.addButton(5, "Armour", this.unequipArmor).hint(this.player.armor.description, Inventory.capitalizeFirstLetter(this.player.armor.name));
        else
            this.addButtonDisabled(5, "Armour");

        if (this.player.upperGarment != UndergarmentLib.NOTHING)
            this.addButton(6, "Upperwear", this.unequipUpperwear).hint(this.player.upperGarment.description, Inventory.capitalizeFirstLetter(this.player.upperGarment.name));
        else
            this.addButtonDisabled(6, "Upperwear");

        if (this.player.lowerGarment != UndergarmentLib.NOTHING)
            this.addButton(7, "Lowerwear", this.unequipLowerwear).hint(this.player.lowerGarment.description, Inventory.capitalizeFirstLetter(this.player.lowerGarment.name));
        else
            this.addButtonDisabled(7, "Lowerwear");

        this.addButton(14, "Back", this.inventoryMenu);
    }
    // Unequip!
    private unequipWeapon(): void {
        const temp: ItemSlot = new ItemSlot();
        temp.damage = this.flags[kFLAGS.WEAPON_DURABILITY_DAMAGE];
        temp.quantity = -1;
        this.takeItem(this.player.setWeapon(WeaponLib.FISTS), this.inventoryMenu, undefined, temp);
        this.flags[kFLAGS.WEAPON_DURABILITY_DAMAGE] = 0;
    }
    public unequipArmor(): void {
        if (this.player.armorName != "goo armor") this.takeItem(this.player.setArmor(ArmorLib.NOTHING), this.inventoryMenu);
        else { // Valeria belongs in the camp, not in your inventory!
            this.player.armor.removeText();
            this.player.setArmor(ArmorLib.NOTHING);
            this.doNext(this.manageEquipment);
        }
    }
    public unequipUpperwear(): void {
        this.takeItem(this.player.setUndergarment(UndergarmentLib.NOTHING, UndergarmentLib.TYPE_UPPERWEAR), this.inventoryMenu);
    }
    public unequipLowerwear(): void {
        this.takeItem(this.player.setUndergarment(UndergarmentLib.NOTHING, UndergarmentLib.TYPE_LOWERWEAR), this.inventoryMenu);
    }
    public unequipJewel(): void {
        this.takeItem(this.player.setJewelry(JewelryLib.NOTHING), this.inventoryMenu);
    }
    public unequipShield(): void {
        this.takeItem(this.player.setShield(ShieldLib.NOTHING), this.inventoryMenu);
    }

    public checkKeyItems(countOnly: boolean = false): boolean {
        let foundItem: boolean = false;
        let button: number = 0;
        if (!countOnly) this.menu();
        if (this.getGame().xmas.xmasMisc.nieveHoliday() && this.flags[kFLAGS.NIEVE_STAGE] > 0 && this.flags[kFLAGS.NIEVE_STAGE] < 5) {
            if (!countOnly) {
                if (this.flags[kFLAGS.NIEVE_STAGE] == 1)
                    this.outputText("\nThere's some odd snow here that you could do something with...\n");
                else
                    this.outputText("\nYou have a snow" + this.getGame().xmas.xmasMisc.nieveMF("man", "woman") + " here that seems like it could use a little something...\n");
                this.addButton(button++, "Snow", this.getGame().xmas.xmasMisc.nieveBuilding);
            }
            foundItem = true;
        }
        if (this.flags[kFLAGS.FUCK_FLOWER_KILLED] == 0 && this.flags[kFLAGS.FUCK_FLOWER_LEVEL] >= 1) {
            if (!countOnly) {
                if (this.flags[kFLAGS.FUCK_FLOWER_LEVEL] == 4) this.outputText("\nHolli is in her tree at the edges of your camp.  You could go visit her if you want.\n");
                this.addButton(button++, (this.flags[kFLAGS.FUCK_FLOWER_LEVEL] >= 3 ? "Tree" : "Plant"), this.getGame().holliScene.treeMenu);
            }
            foundItem = true;
        }
        if (this.player.hasKeyItem("Dragon Egg") >= 0) {
            if (!countOnly) {
                this.getGame().emberScene.emberCampDesc();
                this.addButton(button++, "Egg", this.getGame().emberScene.emberEggInteraction);
            }
            foundItem = true;
        }
        if (this.player.hasKeyItem("Tamani's Satchel") >= 0) {
            if (!countOnly) {
                this.addButton(button++, "Satchel", this.getGame().forest.tamaniScene.openTamanisSatchel);
            }
            foundItem = true;
        }
        if (this.player.hasKeyItem("Feathery hair-pin") >= 0) {
            if (!countOnly) {
                let benoitPinDesc: string;
                benoitPinDesc = "The feathery hair-pin " + this.getGame().bazaar.benoit.benoitMF("Benoit", "Benoite") + " gave to you as a present.";
                this.addButton(button++, "F. Hairpin", this.getGame().bazaar.benoit.equipUnequipHairPin).hint(benoitPinDesc, "Feathery Hair-pin");
            }
            foundItem = true;
        }
        if (!countOnly) this.addButton(14, "Back", this.inventoryMenu);
        return foundItem;
    }

    // Pick item to take from storage
    private pickItemToTakeFromShieldRack(): void {
        this.callNext = this.pickItemToTakeFromShieldRack;
        this.pickItemToTakeFromStorage(this.gearStorage, 36, 45, "rack");
    }

    private pickItemToTakeFromArmorRack(): void {
        this.callNext = this.pickItemToTakeFromArmorRack;
        this.pickItemToTakeFromStorage(this.gearStorage, 9, 18, "rack");
    }

    private pickItemToTakeFromWeaponRack(): void {
        this.callNext = this.pickItemToTakeFromWeaponRack;
        this.pickItemToTakeFromStorage(this.gearStorage, 0, 9, "rack");
    }

    public pickItemToTakeFromJewelryBox(): void {
        this.callNext = this.pickItemToTakeFromJewelryBox;
        this.pickItemToTakeFromStorage(this.gearStorage, 18, 27, "box");
    }

    public pickItemToTakeFromDresser(): void {
        this.callNext = this.pickItemToTakeFromDresser;
        this.pickItemToTakeFromStorage(this.gearStorage, 27, 36, "dresser");
    }

    private pickItemToTakeFromStorage(storage: any[], startSlot: number, endSlot: number, text: string): void {
        this.clearOutput(); // Selects an item from a gear slot. Rewritten so that it no longer needs to use numbered events
        this.hideUpDown();
        if (!this.itemAnyInStorage(storage, startSlot, endSlot)) { // If no items are left then return to the camp menu. Can only happen if the player removes the last item.
            this.playerMenu();
            return;
        }
        this.outputText("What " + text + " slot do you wish to take an item from?");
        let button: number = 0;
        this.menu();
        for (let x: number = startSlot; x < endSlot; x++ , button++) {
            if (storage[x].quantity > 0) this.addButton(button, (storage[x].itype.shortName + " x" + storage[x].quantity), this.pickFrom, storage, x);
        }
        this.addButton(14, "Back", this.stash);
    }

    private pickFrom(storage: any[], slotNum: number): void {
        this.clearOutput();
        const itype: ItemType = storage[slotNum].itype;
        storage[slotNum].quantity--;
        this.inventory.takeItem(itype, this.callNext, this.callNext, storage[slotNum]);
    }

    // Pick items to place in storage
    private pickItemToPlaceInCampStorage(): void { this.pickItemToPlaceInStorage(this.placeInCampStorage, this.allAcceptable, "storage containers", false); }

    private pickItemToPlaceInArmorRack(): void { this.pickItemToPlaceInStorage(this.placeInArmorRack, this.armorAcceptable, "armor rack", true); }

    private pickItemToPlaceInWeaponRack(): void { this.pickItemToPlaceInStorage(this.placeInWeaponRack, this.weaponAcceptable, "weapon rack", true); }

    private pickItemToPlaceInShieldRack(): void { this.pickItemToPlaceInStorage(this.placeInShieldRack, this.shieldAcceptable, "shield rack", true); }

    public pickItemToPlaceInJewelryBox(): void { this.pickItemToPlaceInStorage(this.placeInJewelryBox, this.jewelryAcceptable, "jewelry box", true); }

    public pickItemToPlaceInDresser(): void { this.pickItemToPlaceInStorage(this.placeInDresser, this.undergarmentAcceptable, "dresser", true); }

    // Acceptable type of items
    private allAcceptable(itype: ItemType): boolean { return true; }

    private armorAcceptable(itype: ItemType): boolean { return itype instanceof Armor; }

    private weaponAcceptable(itype: ItemType): boolean { return itype instanceof Weapon; }

    private shieldAcceptable(itype: ItemType): boolean { return itype instanceof Shield; }

    private jewelryAcceptable(itype: ItemType): boolean { return itype instanceof Jewelry; }

    private undergarmentAcceptable(itype: ItemType): boolean { return itype instanceof Undergarment; }

    // Place in storage functions
    private pickItemToPlaceInStorage(placeInStorageFunction: any, typeAcceptableFunction: any, text: string, showEmptyWarning: boolean): void {
        this.clearOutput(); // Selects an item to place in a gear slot. Rewritten so that it no longer needs to use numbered events
        this.hideUpDown();
        this.outputText("What item slot do you wish to empty into your " + text + "?");
        this.menu();
        let foundItem: boolean = false;
        for (let x: number = 0; x < 10; x++) {
            if (this.player.itemSlots[x].unlocked && this.player.itemSlots[x].quantity > 0 && typeAcceptableFunction(this.player.itemSlots[x].itype)) {
                this.addButton(x, (this.player.itemSlots[x].itype.shortName + " x" + this.player.itemSlots[x].quantity), placeInStorageFunction, x);
                foundItem = true;
            }
        }
        if (showEmptyWarning && !foundItem) this.outputText("\n<b>You have no appropriate items to put in this " + text + ".</b>");
        this.addButton(14, "Back", this.stash);
    }

    private placeInCampStorage(slotNum: number): void {
        this.placeIn(this.itemStorage, 0, this.itemStorage.length, slotNum);
        this.doNext(this.pickItemToPlaceInCampStorage);
    }

    private placeInArmorRack(slotNum: number): void {
        this.placeIn(this.gearStorage, 9, 18, slotNum);
        this.doNext(this.pickItemToPlaceInArmorRack);
    }

    private placeInWeaponRack(slotNum: number): void {
        this.placeIn(this.gearStorage, 0, 9, slotNum);
        this.doNext(this.pickItemToPlaceInWeaponRack);
    }

    private placeInShieldRack(slotNum: number): void {
        this.placeIn(this.gearStorage, 36, 45, slotNum);
        this.doNext(this.pickItemToPlaceInShieldRack);
    }

    private placeInJewelryBox(slotNum: number): void {
        this.placeIn(this.gearStorage, 18, 27, slotNum);
        this.doNext(this.pickItemToPlaceInJewelryBox);
    }

    private placeInDresser(slotNum: number): void {
        this.placeIn(this.gearStorage, 27, 36, slotNum);
        this.doNext(this.pickItemToPlaceInDresser);
    }

    private placeIn(storage: any[], startSlot: number, endSlot: number, slotNum: number): void {
        this.clearOutput();
        let x: number;
        let temp: number;
        const itype: ItemType = this.player.itemSlots[slotNum].itype;
        let qty: number = this.player.itemSlots[slotNum].quantity;
        const orig: number = qty;
        this.player.itemSlots[slotNum].emptySlot();
        for (x = startSlot; x < endSlot && qty > 0; x++) { // Find any slots which already hold the item that is being stored
            if (storage[x].itype == itype && storage[x].quantity < itype.getMaxStackSize()) {
                temp = itype.getMaxStackSize() - storage[x].quantity;
                if (qty < temp) temp = qty;
                this.outputText("You add " + temp + "x " + itype.shortName + " into storage slot " + Inventory.num2Text(x + 1 - startSlot) + ".\n");
                storage[x].quantity += temp;
                qty -= temp;
                if (qty == 0) return;
            }
        }
        for (x = startSlot; x < endSlot && qty > 0; x++) { // Find any empty slots and put the item(s) there
            if (storage[x].quantity == 0) {
                storage[x].setItemAndQty(itype, qty);
                this.outputText("You place " + qty + "x " + itype.shortName + " into storage slot " + Inventory.num2Text(x + 1 - startSlot) + ".\n");
                qty = 0;
                return;
            }
        }
        this.outputText("There is no room for " + (orig == qty ? "" : "the remaining ") + qty + "x " + itype.shortName + ".  You leave " + (qty > 1 ? "them" : "it") + " in your inventory.\n");
        this.player.itemSlots[slotNum].setItemAndQty(itype, qty);
    }

    public generateInventoryTooltip(slot: ItemSlot): string {
        let tt: string = slot.itype.description;
        if (slot.itype.isDegradable()) {
            tt += "\nDurability: " + (slot.itype.durability - slot.damage) + "/" + slot.itype.durability;
        }
        return tt;
    }

    public serialize(relativeRootObject: any): void {
        relativeRootObject.itemStorage = [];
        this.serializeItemStorage(relativeRootObject.itemStorage);
    }

    private serializeItemStorage(saveFileItemStorage: any): void {
        Inventory.LOGGER.debug("Serializing {0} slots in itemStorage...", this.itemStorage.length);
        for (let i: number = 0; i < this.itemStorage.length; i++) {
            if (this.itemStorage[i].itype == undefined) {
                saveFileItemStorage.push(undefined);
            } else {
                saveFileItemStorage.push([]);
                SerializationUtils.serialize(saveFileItemStorage[i], this.itemStorage[i]);
            }
        }
    }

    public deserialize(relativeRootObject: any): void {
        this.deserializeItemStorage(relativeRootObject.itemStorage);
    }

    private deserializeItemStorage(saveFileItemStorage: any): void {
        Inventory.LOGGER.debug("Deserializing {0} slots from itemStorage...", saveFileItemStorage.length);
        for (let i: number = 0; i < saveFileItemStorage.length; i++) {
            this.createStorage();
            const storage: ItemSlot = this.itemStorage[i];
            const savedIS: any = saveFileItemStorage[i];

            if (savedIS.quantity > 0) {
                SerializationUtils.deserialize(savedIS, storage);
            } else {
                storage.emptySlot();
            }
        }
    }

    public upgradeSerializationVersion(relativeRootObject: any, serializedDataVersion: number): void {
        switch (serializedDataVersion) {
            case 0:
                this.upgradeLegacyItemStorage(relativeRootObject);

            default:
            /*
             * The default block is left empty intentionally,
             * this switch case operates by using fall through behavior.
             */
        }
    }

    private upgradeLegacyItemStorage(relativeRootObject: any): void {
        Inventory.LOGGER.info("Upgrading legacy item storage");

        if (relativeRootObject.itemStorage === undefined) {
            relativeRootObject.itemStorage = [];
        }
    }

    public currentSerializationVerison(): number {
        return Inventory.SERIALIZATION_VERSION;
    }

    public serializationUUID(): string {
        return Inventory.SERIALIZATION_UUID;
    }
}
