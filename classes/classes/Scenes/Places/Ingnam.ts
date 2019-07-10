import { BaseContent } from "../../BaseContent";
import { IngnamFarm } from "./Ingnam/IngnamFarm";
import { ThiefScene } from "./Ingnam/ThiefScene";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { MainView } from "../../../coc/view/MainView";
import { WeaponLib } from "../../Items/WeaponLib";
import { rand } from "../../Extra";
import { PerkLib } from "../../PerkLib";
import { ItemType } from "../../ItemType";
import { Horns } from "../../BodyParts/Horns";
import { Wings } from "../../BodyParts/Wings";
import { Ears } from "../../BodyParts/Ears";
import { StatusEffects } from "../../StatusEffects";
import { kACHIEVEMENTS } from "../../GlobalFlags/kACHIEVEMENTS";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

// Ingnam: The Prologue

export class Ingnam extends BaseContent {
    public ingnamFarm: IngnamFarm = new IngnamFarm();
    public thiefScene: ThiefScene = new ThiefScene();

    public get inIngnam(): boolean { return this.flags[kFLAGS.IN_INGNAM] > 0; }

    // Main Ingnam menu.
    public menuIngnam(): void {
        // Force autosave
        if (this.player.slotName != "VOID" && this.mainView.getButtonText(0) != "Game Over" && this.flags[kFLAGS.HARDCORE_MODE] > 0) {
            this.getGame().saves.saveGame(this.player.slotName);
        }
        // Banished to Mareth.
        if (this.getGame().time.days >= 0 && this.flags[kFLAGS.INGNAM_PROLOGUE_COMPLETE] <= 0 && this.flags[kFLAGS.GRIMDARK_MODE] < 1) {
            this.getBanishedToMareth();
            return;
        }
        this.clearOutput();
        this.credits.modContent = true;
        this.credits.authorText = "Kitteh6660";
        this.outputText(this.images.showImage("location-ingnam"));
        if (this.flags[kFLAGS.GRIMDARK_MODE] > 0) {
            this.outputText("Ingnam is a village well-defended against the tides of monsters outside. There is already a well-established array of shops though some of them seem to be abandoned and there's barely any activity. The temple sits within view of the patrons sitting at tables at the tavern which serves as a hub for people near and far to drink and dance. On the road leading out of the plaza that sits before the temple is a trail that meanders its way to a large farm in the distance.");
            this.outputText("\n\nLooming ominously in the distance is a mountain known by the locals as Mount Ilgast.");
        }
        else {
            this.outputText("Ingnam is a rich and prosperous village despite its small size. There is already a well-established array of shops with a constant hum of tradesmen and merchants. The temple sits within view of the patrons sitting at tables at the tavern which serves as a hub for people near and far to drink and dance. On the road leading out of the plaza that sits before the temple is a trail that meanders its way to a large farm in the distance.");
            this.outputText("\n\nLooming ominously in the distance is a mountain known by the locals as Mount Ilgast. Surrounding Ingnam is a vast expanse of wilderness.");
        }
        if (this.getGame().time.hours >= 21 || this.getGame().time.hours < 6) this.outputText("\n\nIt's dark outside. Stars dot the night sky and a moon casts the moonlight over the landscape, providing little light. Shops are closed at this time.");
        this.mainView.showMenuButton(MainView.MENU_NEW_MAIN);
        this.mainView.showMenuButton(MainView.MENU_DATA);
        this.mainView.showMenuButton(MainView.MENU_STATS);
        this.mainView.showMenuButton(MainView.MENU_PERKS);
        this.mainView.showMenuButton(MainView.MENU_APPEARANCE);
        this.showStats();
        this.mainView.setMenuButton(MainView.MENU_NEW_MAIN, "Main Menu", kGAMECLASS.mainMenu.mainMenu);
        this.mainView.newGameButton.hint("Return to main menu.", "Main Menu");
        if (this.camp.setLevelButton()) return;
        this.hideUpDown();
        this.menu();
        if (this.flags[kFLAGS.GRIMDARK_MODE] == 0) {
            this.addButton(0, "Explore", this.exploreIngnam);
            this.addButton(1, "Shops", this.menuShops);
        }
        this.addButton(2, "Temple", this.menuTemple);
        this.addButton(3, "Inn", this.menuTavern);
        this.addButton(4, "Farm", this.ingnamFarm.menuFarm);
        if (this.flags[kFLAGS.INGNAM_PROLOGUE_COMPLETE] > 0) this.addButton(14, "Return2Camp", this.returnToMareth);
        if (this.flags[kFLAGS.NEW_GAME_PLUS_LEVEL] > 0 && this.inventory.showStash() && this.flags[kFLAGS.INGNAM_PROLOGUE_COMPLETE] <= 0) this.addButton(6, "Stash", this.inventory.stash);
        this.addButton(7, "Inventory", this.inventory.inventoryMenu);
        if (this.player.lust >= 30) {
            if (this.player.lust >= this.player.maxLust()) {
                this.outputText("\n\n<b>You are debilitatingly aroused, and can think of doing nothing other than masturbating.</b>");
                this.removeButton(0);
                this.removeButton(4);
            }
            this.getGame().masturbation.setMasturbateButton();
        }
        // Show wait/rest/sleep depending on conditions.
        this.addButton(9, "Wait", kGAMECLASS.camp.doWait);
        if (this.player.fatigue > 40 || this.player.HP / this.player.maxHP() <= .9) this.addButton(9, "Rest", this.getGame().camp.rest);
        if (this.getGame().time.hours >= 21 || this.getGame().time.hours < 6) {
            this.removeButton(0);
            this.removeButton(1);
            this.removeButton(2);
            this.removeButton(4);
            this.addButton(9, "Sleep", this.getGame().camp.doSleep);
        }
        if (this.flags[kFLAGS.GRIMDARK_MODE] > 0) {
            this.addButton(14, "Leave", this.leaveIngnamGrimdark);
        }
    }

    // The end of prologue, starts the game.
    public getBanishedToMareth(): void {
        let hasWeapon: boolean = false;
        this.clearOutput();
        this.hideMenus();
        this.outputText("Your time has come to meet up with the village elders. You know you are going to get sent to the demon realm and you're most likely not going to be able to return to Ingnam. You give your family and friends a long farewell.");
        if (this.flags[kFLAGS.NEW_GAME_PLUS_LEVEL] == 0) { // Doesn't happen in New Game+.
            if (this.player.weaponName != "fists") {
                hasWeapon = true;
                this.player.setWeapon(WeaponLib.FISTS);
            }
            while (this.player.hasItem(this.weapons.DAGGER0, 1)) {
                hasWeapon = true;
                this.player.destroyItems(this.weapons.DAGGER0, 1);
            }
            while (this.player.hasItem(this.weapons.PIPE, 1)) {
                hasWeapon = true;
                this.player.destroyItems(this.weapons.PIPE, 1);
            }
            while (this.player.hasItem(this.weapons.SPEAR_0, 1)) {
                hasWeapon = true;
                this.player.destroyItems(this.weapons.SPEAR_0, 1);
            }
            while (this.player.hasItem(this.weapons.KATANA0, 1)) {
                hasWeapon = true;
                this.player.destroyItems(this.weapons.KATANA0, 1);
            }
            if (hasWeapon) this.outputText("\n\n<b>Unfortunately, you were instructed to leave your weapon behind.</b>");
        }
        this.flags[kFLAGS.IN_INGNAM] = 0;
        this.flags[kFLAGS.INGNAM_PROLOGUE_COMPLETE] = 1;
        this.doNext(kGAMECLASS.charCreation.arrival);
    }

    public returnToMareth(): void {
        this.clearOutput();
        this.outputText("You make your journey to Mount Ilgast, walk through the portal back to Mareth and return to your camp.");
        this.flags[kFLAGS.IN_INGNAM] = 0;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public returnToIngnam(): void {
        this.clearOutput();
        this.outputText("You enter the portal and make your return to Ingnam, thanks to the debug powers.");
        this.flags[kFLAGS.IN_INGNAM] = 1;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public leaveIngnamGrimdark(): void {
        this.inRoomedDungeonResume = this.getGame().dungeons.resumeFromFight;
        this.getGame().dungeons._currentRoom = "wasteland";
        this.getGame().dungeons.move(this.getGame().dungeons._currentRoom);
    }

    // Explore Ingnam
    public exploreIngnam(): void {
        this.hideMenus();
        this.clearOutput();
        const chooser: number = rand(4);
        if (chooser == 0) {
            this.thiefScene.encounterThief();
            return;
        }
        else {
            this.outputText("You explore the village of Ingnam for a while but you don't find anything interesting.");
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Shopping time!
    public menuShops(): void {
        this.hideMenus();
        this.clearOutput();
        this.outputText("Which shop would you like to visit?");
        this.menu();
        this.addButton(0, "Blacksmith", this.shopBlacksmith);
        this.addButton(1, "Tailor", this.shopTailor);
        this.addButton(2, "Alchemist", this.shopAlchemist);
        this.addButton(3, "Trading Post", this.shopTradingPost);
        this.addButton(4, "Black Market", this.shopBlackMarket);
        this.addButton(14, "Back", this.menuIngnam);
    }

    public shopBlacksmith(): void {
        this.clearOutput();
        this.outputText("You enter the armor shop, noting the sign depicting armors. Some armor is proudly displayed on racks. You can hear the sound of hammering although it stops shortly after you enter. The local blacksmith, Ben, comes from the rear door and steps up to the counter and wipes away sweat from his face flushed red by the forge, \"<i>Welcome to my shop. In a need of protection? Or something sharp?</i>\"");
        if (this.flags[kFLAGS.INGNAM_WEAPONSMITH_TALKED] <= 0 && this.flags[kFLAGS.INGNAM_PROLOGUE_COMPLETE] <= 0) {
            this.outputText("\n\n\Before you can get a word in Ben lets out an exasperated sigh \"<i>Ah, just forget about…</i>\"");
            this.outputText("\n\nYou crook an eyebrow questioningly at the blacksmith. Ben then realizes his blunder.");
            this.outputText("\n\n\"<i>Ah, well it’s just… You’re the new Champion, right? None of the people I’ve seen who get sent to the portal brought a weapon and you would waste some gems. Still, if you want to train with weapons, you can go ahead and buy them. A little preparation never hurt anyone.</i>\" the blacksmith says.");
            this.flags[kFLAGS.INGNAM_WEAPONSMITH_TALKED] = 1;
        }
        this.outputText("\n\n<b><u>Blacksmith's pricings</u></b>");
        this.menu();
        if (this.player.findPerk(PerkLib.HistoryFighter) >= 0) { // 20% discount for History: Fighter
            this.addShopItem(this.weapons.DAGGER0, 32, 1);
            this.addShopItem(this.weapons.PIPE, 40, 1);
            this.addShopItem(this.weapons.SPEAR_0, 140, 1);
            this.addShopItem(this.weapons.KATANA0, 200, 1);
            this.addShopItem(this.weapons.MACE__0, 80, 1);
        }
        else {
            this.addShopItem(this.weapons.DAGGER0, 40, 1);
            this.addShopItem(this.weapons.PIPE, 50, 1);
            this.addShopItem(this.weapons.SPEAR_0, 175, 1);
            this.addShopItem(this.weapons.KATANA0, 250, 1);
            this.addShopItem(this.weapons.MACE__0, 100, 1);
        }
        if (this.player.findPerk(PerkLib.HistorySmith) >= 0) { // 20% discount for History: Smith perk
            this.addShopItem(this.armors.LEATHRA, 40, 2);
            this.addShopItem(this.armors.FULLCHN, 120, 2);
            this.addShopItem(this.armors.SCALEML, 160, 2);
        }
        else {
            this.addShopItem(this.armors.LEATHRA, 50, 2);
            this.addShopItem(this.armors.FULLCHN, 150, 2);
            this.addShopItem(this.armors.SCALEML, 200, 2);
        }
        this.addButton(14, "Leave", this.menuShops);
    }

    public shopTailor(): void {
        this.clearOutput();
        this.outputText("You enter the tailor’s. The interior is laden with mannequins wearing half-finished works. Clothes are displayed on racks without obvious flaws. A fastidious, well-groomed young man with an immaculate blue three-piece suit topped with a measuring tape draping around his collar stands behind the counter and smiles at you with deference.");
        this.outputText("\n\n\"<i>Welcome to my shop. Do you need to get outfitted?</i>\" he says pulling keenly at the measuring tape draping his shoulders.");
        this.outputText("\n\n<b><u>Tailor shop pricings</u></b>");
        this.menu();
        this.addShopItem(this.armors.C_CLOTH, 10, 3);
        this.addShopItem(this.armors.ADVCLTH, 75, 3);
        this.addShopItem(this.armors.CLSSYCL, 100, 3);
        this.addShopItem(this.armors.TUBETOP, 40, 3);
        this.addShopItem(this.armors.OVERALL, 30, 3);
        this.addShopItem(this.armors.M_ROBES, 75, 3);
        this.addShopItem(this.armors.LTHRPNT, 200, 3);
        this.addShopItem(this.armors.RBBRCLT, 500, 3);
        this.addShopItem(this.armors.T_BSUIT, 650, 3);
        this.addButton(14, "Leave", this.menuShops);
    }

    public shopAlchemist(): void {
        this.clearOutput();
        if (this.flags[kFLAGS.INGNAM_ALCHEMIST_TALKED] <= 0) {
            this.outputText("As you approach the stone building the overpowering smell of herbs and plants being brewed hits your nose. The crimson banner over the heavy wooden door indicates that this is where the potions are made. You enter what appears to be the place where the alchemist works on his famed remedies.");
            this.outputText("\n\nYou open the door and enter. Despite the establishment being dimly lit by candlelight you can make out the vast multicolored rows of countless potions, elixirs and tonics. Fragrant drying herbs are hanging from the rafters and various strange-looking equipment is set up in a variety of locations in the store.");
            this.outputText("\n\nAn ancient-looking man in a much-singed pair of robes is working on something volatile in the corner until he hears your presence. He stops and shuffles up to the timber counter, drumming it under his stained fingers. \"<i>What can I do for you, young master?</i>\" he says from under his frayed hood.");
            this.flags[kFLAGS.INGNAM_ALCHEMIST_TALKED] = 1;
        }
        else {
            this.outputText("Once again, you return to the alchemist, letting the overpowering smell of herbs and plants being brewed hits your nose.");
            this.outputText("\n\nThe alchemist senses your presences and he steps up to the counter and says, \"<i>How may I help you?</i>\"");
        }
        this.outputText("\n\n<b><u>Alchemy shop pricings</u></b>");
        this.menu();
        if (this.player.findPerk(PerkLib.HistoryAlchemist) >= 0) { // 20% discount for History: Alchemist perk
            this.addShopItem(this.consumables.REDUCTO, 80, 4);
            this.addShopItem(this.consumables.GROPLUS, 80, 4);
            this.addShopItem(this.consumables.L_DRAFT, 25, 4);
            this.addShopItem(this.consumables.LACTAID, 40, 4);
        }
        else {
            this.addShopItem(this.consumables.REDUCTO, 100, 4);
            this.addShopItem(this.consumables.GROPLUS, 100, 4);
            this.addShopItem(this.consumables.L_DRAFT, 30, 4);
            this.addShopItem(this.consumables.LACTAID, 50, 4);
        }
        this.addButton(14, "Leave", this.menuShops);
    }

    public shopTradingPost(): void {
        this.clearOutput();
        this.outputText("The trading post is one of the larger buildings in the village with its porch covered in barrels filled with pickled goods, preserved delicacies and dried goods from the humble local farm to exotic faraway lands. The interior is packed with crowded shelves that boast a variety of goods, all arranged neatly on shelves.");
        this.outputText("\n\nYou suspect you could buy some imported goods here.");
        this.outputText("\n\n<b><u>Trading post pricings</u></b>");
        this.menu();
        this.addShopItem(this.consumables.VITAL_T, 30, 5);
        this.addShopItem(this.consumables.SMART_T, 30, 5);
        this.addShopItem(this.consumables.FISHFIL, 5, 5);
        this.addButton(14, "Leave", this.menuShops);
    }

    public shopBlackMarket(): void {
        this.clearOutput();
        if (this.flags[kFLAGS.INGNAM_BLACKMARKET_TALKED] <= 0) {
            this.outputText("You walk into an alley you swear you have never explored before. You stifle your fear as you walk into the dingy looking alley.");
            this.outputText("\n\nUnease creeps over you until you hear a raspy voice whisper from the darkness of the alley. You look around to see a hooded figure skulk from the shadows to approach you.");
            this.outputText("\n\n\"<i>Greetings. I know you. You’re going to be the new Champion, right?</i>\" The hooded figure croaks. His face is mostly concealed by the shade of his hood. Slightly unnerved by the prowling figure you tell him that yes, you’re going to be the Champion of Ingnam.");
            this.outputText("\n\nHe pulls his hood down, quickly looking for the all-clear and rasps, \"<i>I’ve managed to sneak into the portal at the mountains. There is extraordinary stuff that can transform you! It takes me years of planning as the portal is only open for a short window of time before it closes for the rest of the year.</i>\"");
            this.outputText("\n\nWith a skin-crawling chuckle he opens up his coat and shows you the array of goods and says, \"<i>I’ve managed to smuggle these in. They aren’t cheap but I guarantee you, they’re the real deal! See anything you like?</i>\"");
            this.flags[kFLAGS.INGNAM_BLACKMARKET_TALKED] = 1;
        }
        else {
            this.outputText("Once again, you walk into the alley where the shady dealer should be. He approaches you as if he knows you.");
            this.outputText("\n\n\"<i>Back, I see? See any deals you like?</i>\" The shady man asks.");
        }
        this.outputText("\n\n<b><u>Black market pricings</u></b>");
        this.menu();
        this.addShopItem(this.consumables.W_FRUIT, 75, 6);
        this.addShopItem(this.consumables.CANINEP, 75, 6);
        this.addShopItem(this.consumables.EQUINUM, 75, 6);
        this.addShopItem(this.consumables.INCUBID, 75, 6);
        this.addShopItem(this.consumables.SUCMILK, 75, 6);
        this.addButton(14, "Leave", this.menuShops);
    }

    // Transaction for buying items.
    public transactionItemConfirmation(item: ItemType, price: number, shop: number): void {
        this.clearOutput();
        this.outputText("\"<i>That will be " + Ingnam.num2Text(price) + " gems for " + item.longName + ".</i>\"");
        if (this.player.gems >= price) {
            this.outputText("\n\nDo you buy it?");
            this.menu();
            this.addButton(0, "Yes", this.transactionYes, item, price, shop);
            this.addButton(1, "No", this.transactionNo, shop);
        }
        else {
            this.outputText("\n\nYou count out your gems and realize it's beyond your price range.");
            this.menu();
            this.addButton(0, "Next", this.transactionNo, shop);
        }
    }
    public transactionYes(item: ItemType, price: number, shop: number): void {
        // Determine shop
        let shopToGo;
        if (shop == 1) shopToGo = this.shopBlacksmith;
        else if (shop == 2) shopToGo = this.shopBlacksmith;
        else if (shop == 3) shopToGo = this.shopTailor;
        else if (shop == 4) shopToGo = this.shopAlchemist;
        else if (shop == 5) shopToGo = this.shopTradingPost;
        else shopToGo = this.shopBlackMarket;
        // Process
        this.clearOutput();
        if (this.player.gems >= price) {
            this.outputText("You have purchased " + item.longName + " for " + price + " gems. ");
            this.player.gems -= price;
            this.menu();
            this.statScreenRefresh();
            this.inventory.takeItem(item, shopToGo);
        }
        else {
            this.outputText("You count out your gems and realize it's beyond your price range.");
            this.menu();
            this.addButton(0, "Next", this.transactionNo, shop);
        }
    }
    public transactionNo(shop: number): void {
        if (shop == 1) this.shopBlacksmith();
        else if (shop == 2) this.shopBlacksmith();
        else if (shop == 3) this.shopTailor();
        else if (shop == 4) this.shopAlchemist();
        else if (shop == 5) this.shopTradingPost();
        else if (shop == 6) this.shopBlackMarket();
        else this.shopBlackMarket();
    }

    public addShopItem(item: ItemType, price: number, shop: number): void {
        this.outputText("\n" + Ingnam.capitalizeFirstLetter(item.longName) + " - " + price + " gems");
        let button: number = 0;
        for (let i: number = 0; i < 14; i++) {
            if (this.output.buttonIsVisible(i)) button++;
        }
        this.addButton(button, item.shortName, this.transactionItemConfirmation, item, price, shop);
    }

    // Temple
    public menuTemple(): void {
        this.hideMenus();
        this.clearOutput();
        this.outputText(this.images.showImage("location-ingnam-temple"));
        this.outputText("The village’s temple appears humble looking from its stony exterior but the interior of temple is truly a marvel to behold - intricately decorated wooden arches adorned with complex patterns of arcane runes of the Old World, walls adorned with majestic tapestries depicting the Gods and their most valiant of feats and, to the end of the temple stands an incredibly designed shrine to the All-Giving, the mother of all Gods.");
        this.outputText("\n\nIncense languorously wafts from the alcoves where offerings of fruit are left out for the Gods. Monks passively move amongst the parishioners, offering solace to those in need, food or drink to those who are weary, or in meditation.");
        this.outputText("\n\nThere are several soft mats on the floor to provide soft areas for people to pray on.");
        this.menu();
        this.addButton(0, "Meditate", kGAMECLASS.masturbation.meditate);
        this.addButton(14, "Leave", this.menuIngnam);
    }

    // Tavern
    public menuTavern(): void {
        this.hideMenus();
        this.clearOutput();
        this.outputText(this.images.showImage("location-ingnam-inn"));
        this.outputText("The inn is a cozy little nook that exudes a warm and welcoming air. You see several guardsmen roaring with laughter over a few steins and a hand of cards, and some townsfolk chatting about random topics. The innkeeper stands behind the polished wooden counter, serving beverages to his patrons and cleaning up spilled drinks.");
        if (this.flags[kFLAGS.INGNAM_PROLOGUE_COMPLETE] > 0 && this.flags[kFLAGS.INGNAM_GREETED_AFTER_LONGTIME] <= 0) {
            this.welcomeBack();
        }
        if ((this.player.ears.type > 0 && this.player.ears.type != this.flags[kFLAGS.INGNAM_EARS_LAST_TYPE] && this.flags[kFLAGS.INGNAM_EARS_FREAKOUT] <= 0) || (this.player.tail.type > 0 && this.player.tail.type != this.flags[kFLAGS.INGNAM_TAIL_LAST_TYPE] && this.flags[kFLAGS.INGNAM_TAIL_FREAKOUT] <= 0) && this.flags[kFLAGS.INGNAM_PROLOGUE_COMPLETE] <= 0) {
            this.appearanceFreakout();
            return;
        }
        this.menu();
        this.addButton(0, "Order Drink", this.orderDrink).hint("Buy some refreshing beverages.");
        this.addButton(1, "Order Food", this.orderFood).hint("Buy some food" + (this.flags[kFLAGS.HUNGER_ENABLED] > 0 && this.player.hunger < 50 ? " and curb that hunger of yours!" : ".") + "");
        if (this.flags[kFLAGS.INGNAM_RUMORS] < 3) this.addButton(2, "Stories", this.hearRumors).hint("Hear the story the innkeeper has to offer.");
        // if (player.findPerk(PerkLib.HistoryWhore) >= 0) addButton(5, "Prostitute", whoreForGems).hint("Seek someone who's willing to have sex with you for profit.");
        this.addButton(14, "Leave", this.menuIngnam);
    }

    public welcomeBack(): void {
        this.clearOutput();
        this.outputText("The innkeeper looks at you and says, \"<i>Welcome back! I've missed you! How did your adventures go?</i>\"");
        this.outputText("\n\nYou tell the innkeeper about your adventures and how you've met various denizens in Mareth.\n\n");
        if (this.flags[kFLAGS.TIMES_TRANSFORMED] <= 0) this.outputText("The innkeeper looks at you in awe and says, \"<i>Wow, you haven't changed at all! How did you manage to stay in that strange realm for years and still be normal?</i>\"");
        else if (this.player.race == "human") {
            this.outputText("The innkeeper looks at you and says, \"<i>I can see that you have changed a bit.</i>\" ");
        }
        else {
            this.outputText("The innkeeper looks at you and says, \"<i>I can see that you have changed quite a lot! Back then, before you left, you were a human. Now look at yourself!</i>\"");
        }
        if (this.player.horns.value > 0 && this.player.horns.type > 0) {
            this.outputText("\n\n\"<i>Are these " + (this.player.horns.type == Horns.ANTLERS ? "antlers" : "horns") + "? I can imagine they must be real,</i>\" The innkeeper says before touching your [horns]. You can already feel his fingers rubbing against your [horns]. \"<i>Yes, they're real and I think you look better,</i>\" he says. You thank him for complimenting on your horns.");
        }
        if (this.player.wings.type != Wings.NONE) {
            this.outputText("\n\nNext, he looks at your wings that sprout from your back and says, \"<i>Wings? I've never seen a person with wings before!</i>\" ");
            if (this.player.canFly()) this.outputText("You tell him that you can fly. To demonstrate, you guide the innkeeper outside and you grit your teeth with effort as you flap your wings and you finally launch off from the ground and fly around the town! The people of Ingnam, including your family and friends, look at you in shock and some even say, \"<i>" + this.player.mf("He", "She") + " can fly!</i>\"");
        }
        this.outputText("\n\nPLACEHOLDER.");
        this.flags[kFLAGS.INGNAM_GREETED_AFTER_LONGTIME] = 1;
        this.doNext(this.menuTavern);
    }

    public appearanceFreakout(): void {
        this.clearOutput();
        this.outputText("The innkeeper stands up to see that there's something unusual with your appearance.");
        if (this.player.ears.type > 0) {
            if (this.player.ears.type == Ears.HORSE) {
                this.outputText("\n\nHe says, \"<i>Your ears... They look different! They look like horse's! I have no idea how your ears changed.</i>\"");
            }
            if (this.player.ears.type == Ears.DOG) {
                this.outputText("\n\nHe says, \"<i>Your ears... They look like dog's! I have no idea how your ears changed.</i>\"");
            }
            if (this.player.ears.type == Ears.CAT) {
                this.outputText("\n\nHe says, \"<i>Your ears... They look like cat's! I have no idea how your ears changed but other than that, you look much cuter with cat ears!</i>\" He walks over to you and scratch your cat-ears. \"<i>They look and feel so real,</i>\" he says.");
            }
            this.flags[kFLAGS.INGNAM_EARS_LAST_TYPE] = this.player.ears.type;
            this.flags[kFLAGS.INGNAM_EARS_FREAKOUT] = 1;
        }
        if (this.player.ears.type > 0 && this.player.tail.type > 0 && this.player.hasLongTail()) this.outputText("Next, he walks behind you, taking a glance at your tail.");
        if (this.player.tail.type > 0) {
            if (this.player.hasLongTail()) {
                this.outputText("\n\nHe says with a surprised look, \"<i>You have a tail now? Are you sure this is fake?</i>\" You tell him that your tail is not fake; it's real. \"<i>Prove it,</i>\" he says as he tugs your tail. Ouch! That hurts! \"<i>Sorry about that,</i>\" he says, \"<i>but that tail definitely looks and feels real! I think your tail does look nice.</i>\"");
                this.outputText("\n\nYou wag your tail and thank him for the compliment and he walks behind the counter.");
            }
            this.flags[kFLAGS.INGNAM_TAIL_LAST_TYPE] = this.player.tail.type;
            this.flags[kFLAGS.INGNAM_TAIL_FREAKOUT] = 1;
        }
        this.doNext(this.menuTavern);
    }

    public orderDrink(): void {
        this.clearOutput();
        this.outputText("What kind of drink would you like?");
        this.outputText("\n\n<b><u>Pricings</u></b>");
        this.outputText("\n5 gems - Beer");
        this.outputText("\n2 gems - Milk");
        this.outputText("\n3 gems - Root Beer");

        this.menu();
        this.addButton(0, "Beer", this.buyBeer);
        this.addButton(1, "Milk", this.buyMilk);
        this.addButton(2, "Root Beer", this.buyRootBeer);
        this.addButton(14, "Back", this.menuTavern);
    }

    public buyBeer(): void {
        this.clearOutput();
        if (this.player.gems < 5) {
            this.outputText("You don't have enough gems for that.");
            this.doNext(this.orderDrink);
            return;
        }
        this.player.gems -= 5;
        this.outputText("\"<i>I'd like a glass of beer please,</i>\" you say. You hand over the five gems to the innkeeper and he pours you a glass of beer.");
        this.outputText("\n\nYou kick back and drink the beer slowly. ");
        this.dynStats("lus", 20);
        this.player.refillHunger(10);
        if (!this.player.hasStatusEffect(StatusEffects.Drunk)) {
            this.player.createStatusEffect(StatusEffects.Drunk, 2, 1, 1, 0);
            this.dynStats("str", 0.1);
            this.dynStats("inte", -0.5);
            this.dynStats("lib", 0.25);
        }
        else {
            this.player.addStatusValue(StatusEffects.Drunk, 2, 1);
            if (this.player.statusEffectv1(StatusEffects.Drunk) < 2) this.player.addStatusValue(StatusEffects.Drunk, 1, 1);
            if (this.player.statusEffectv2(StatusEffects.Drunk) == 2) {
                this.outputText("\n\n<b>You feel a bit drunk. Maybe you should cut back on the beers?</b>");
            }
            // Get so drunk you end up peeing! Genderless can still urinate.
            if (this.player.statusEffectv2(StatusEffects.Drunk) >= 3) {
                this.outputText("\n\nYou feel so drunk. Your vision is blurry and you realize something's not feeling right. Gasp! You have to piss like a racehorse! You stumble toward the back door and go outside. ");
                if (this.player.hasVagina() && !this.player.hasCock()) this.outputText("You open up your [armor] and squat down while you release your pressure onto the ground. ");
                else this.outputText("You open up your [armor] and lean against the wall using one of your arms for support while you release your pressure onto the wall. ");
                this.outputText("It's like as if the floodgate has opened! ");
                this.awardAchievement("Urine Trouble", kACHIEVEMENTS.GENERAL_URINE_TROUBLE, true, true, false);
                this.awardAchievement("Smashed", kACHIEVEMENTS.GENERAL_SMASHED, true, true, false);
                this.outputText("\n\nIt seems to take forever but it eventually stops. You look down to see that your urine has been absorbed into the ground. You close up your [armor] and head back inside.");
                this.player.removeStatusEffect(StatusEffects.Drunk);
                this.cheatTime(1 / 12);
            }
        }
        this.cheatTime(1 / 12);
        this.doNext(this.menuTavern);
    }
    public buyMilk(): void {
        this.clearOutput();
        if (this.player.gems < 2) {
            this.outputText("You don't have enough gems for that.");
            this.doNext(this.orderDrink);
            return;
        }
        this.player.gems -= 2;
        this.outputText("\"<i>I'd like a glass of milk please,</i>\" you say. You hand over the two gems to the innkeeper and he pours you a glass of milk.");
        this.outputText("\n\nYou drink the cup of milk. You feel calm and refreshed. ");
        this.player.changeFatigue(-15);
        this.player.HPChange(this.player.maxHP() / 4, false);
        this.player.refillHunger(10);
        this.cheatTime(1 / 12);
        this.doNext(this.menuTavern);
    }
    public buyRootBeer(): void {
        this.clearOutput();
        if (this.player.gems < 3) {
            this.outputText("You don't have enough gems for that.");
            this.doNext(this.orderDrink);
            return;
        }
        this.player.gems -= 3;
        this.outputText("\"<i>I'd like a glass of root beer please,</i>\" you say. You hand over the three gems to the innkeeper and he pours you a glass of root beer.");
        this.outputText("\n\nYou drink the cup of root beer. Refreshing! ");
        this.player.changeFatigue(-15);
        this.player.HPChange(this.player.maxHP() / 4, false);
        this.player.refillHunger(10);
        this.cheatTime(1 / 12);
        this.doNext(this.menuTavern);
    }

    public orderFood(): void { // Order food, because you need to be able to fill hunger.
        this.clearOutput();
        this.outputText("You take a seat and look at the menu. What would you like?");
        this.outputText("\n\n<b><u>Pricings</u></b>");
        this.outputText("\n5 gems - Sandwich");
        this.outputText("\n3 gems - Soup");
        this.outputText("\n5 gems - Hard biscuits (Packed)");
        this.outputText("\n10 gems - Trail mix (Packed)");
        this.menu();
        this.addButton(0, "Sandwich", this.buySandwich);
        this.addButton(1, "Soup", this.buySoup);
        this.addButton(2, "Biscuits", this.buyHardBiscuits);
        this.addButton(3, "Trail Mix", this.buyTrailMix);
        this.addButton(14, "Back", this.menuTavern);
    }

    public buySandwich(): void { // Eat sandwich, refill hunger. The reason it's ambiguous is to let you imagine what sandwich you're eating.
        this.clearOutput();
        if (this.player.gems < 5) {
            this.outputText("You don't have enough gems for that.");
            this.doNext(this.orderDrink);
            return;
        }
        this.player.gems -= 5;
        this.outputText("You tell the innkeeper that you would like a sandwich and toss five gems at him. \"<i>Certainly, " + this.player.mf("sir", "madam") + ",</i>\" he says as he quickly grabs a plate and assembles a sandwich. Hey, it's your favorite type!");
        this.outputText("\n\nYou eat the sandwich. Delicious!");
        this.player.HPChange(this.player.maxHP() / 3, false);
        this.player.refillHunger(25);
        this.cheatTime(1 / 12);
        this.doNext(this.menuTavern);
    }

    public buySoup(): void { // Eat soup. Again, it's vague to let you imagine what soup you're eating.
        this.clearOutput();
        if (this.player.gems < 3) {
            this.outputText("You don't have enough gems for that.");
            this.doNext(this.orderDrink);
            return;
        }
        this.player.gems -= 3;
        this.outputText("You tell the innkeeper that you would like a bowl of soup and toss three gems at him. \"<i>Certainly, " + this.player.mf("sir", "madam") + ",</i>\" he says as he grabs a bowl and fills it with steaming soup. Hey, it's your favorite type!");
        this.outputText("\n\nYou take one spoonful at a time, blowing to make sure the soup isn't too hot. You eventually finish the soup. Delicious!");
        this.player.HPChange(this.player.maxHP() / 3, false);
        this.player.refillHunger(20);
        this.cheatTime(1 / 12);
        this.doNext(this.menuTavern);
    }

    private buyHardBiscuits(): void {
        this.clearOutput();
        if (this.player.gems < 5) {
            this.outputText("You can't afford one of those!");
            this.doNext(this.orderFood);
            return;
        }
        this.outputText("You pay five gems for a pack of hard biscuits.  ");
        this.player.gems -= 5;
        this.statScreenRefresh();
        this.inventory.takeItem(this.consumables.H_BISCU, this.orderFood);
    }

    private buyTrailMix(): void {
        this.clearOutput();
        if (this.player.gems < 10) {
            this.outputText("You can't afford one of those!");
            this.doNext(this.orderFood);
            return;
        }
        this.outputText("You pay twenty gems for a pack of trail mix.  ");
        this.player.gems -= 10;
        this.statScreenRefresh();
        this.inventory.takeItem(this.consumables.TRAILMX, this.orderFood);
    }

    public hearRumors(): void { // Hear rumors. Will be altered after defeating Lethice so he will say "Welcome back".
        this.clearOutput();
        const rumor: number = rand(4);
        this.outputText("You ask the innkeeper if he has anything special to tell you.");
        if (this.flags[kFLAGS.INGNAM_RUMORS] == 0) {
            this.outputText("\n\nHe nods and says, \"<i>Let me tell you. You know what happens to the so-called 'champions'?</i>\" ");
            this.outputText("\n\nYou nod in response and he continues, \"<i>Well... Nobody ever came. I've seen twenty people departing over the course of my career. Twenty years. None of them ever returned. Who knows what happened to them? Some say they're abducted by an evil presence as soon as they set foot into the portal.</i>\"");
            this.outputText("\n\nHe looks at you and sniffles. \"<i>Truth be told, you're going to be the Champion of Ingnam. You will be sent to the so-called 'portal' that is supposedly located in Mount Ilgast. I will miss your patronage at the inn. You're still welcome anytime.</i>\"");
            this.flags[kFLAGS.INGNAM_RUMORS] = 1;
        }
        else if (this.flags[kFLAGS.INGNAM_RUMORS] == 1) {
            this.outputText("\n\nHe nods and says, \"<i>You know Mount Ilgast?</i>\" ");
            this.outputText("\n\nYou nod in response and he continues, \"<i>Before I began my work as an innkeeper, I was an adventurer. I've explored Mount Ilgast once. There was something glowing. It's a portal but it's no ordinary portal. Even strange was that there was something stirring in my groin. Honestly, I swear I never felt that sensation before. I winded up masturbating at the cave entrance just because of that warmth. As soon as I go near the portal, the warm sensation came back again. It's just strange, really strange. So I've hurried back to Ingnam and never visited the mountain again.</i>\"");
            this.outputText("\n\nYou thank him for telling you.");
            this.flags[kFLAGS.INGNAM_RUMORS] = 2;
        }
        else if (this.flags[kFLAGS.INGNAM_RUMORS] == 2) {
            this.outputText("\n\nHe nods and says, \"<i>Would you really like to know something special?</i>\" You nod in response and he continues, \"<i>One time I've seen a man with cat ears and a tail. I thought they were just accessories but he insisted it was real. So I tugged on his ears and it was... real. I thought he used a lot of glue but he insisted that it's real. His ears do feel real. His tail even swished from side to side like it's an actual cat tail. He told me about something called 'Whisker Fruit' or something. So my guess is that the food in the so-called 'demon realm' can change you.</i>\"");
            this.outputText("\n\nYou tell him if he has some tips for you. He says, \"<i>Yes. If I were you, I would eat them only as last resort. Even a food that could transform you can make the difference between life and death.</i>\" You thank him for the advice.");
            this.outputText("\n\n\"<i>You're welcome. I have nothing left to tell you but you're always welcome,</i>\" he says.");
            this.flags[kFLAGS.INGNAM_RUMORS] = 3; // Finished
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }

}
