import { BazaarAbstractContent } from "./BazaarAbstractContent";
import { ItemType } from "../../../ItemType";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { SpriteDb } from "../../../display/SpriteDb";
import { StatusEffects } from "../../../StatusEffects";
import { rand } from "../../../Extra";

// By Foxwells
// Sun, the Bizarre Bazaar's Weaponsmith/Blacksmith
// A rather bare-bones version of the actual NPC I made, but eh
// Anyways Sun's an unfriendly grump, much against what his name implies
// He's a jaguar-morph. And a big wall of muscle. Also he has a boyfriend
// Shop uses flag "MRAPIER_BOUGHT" so you can't buy multiple Midnight Rapiers
// Said flag carries through ascension. Really, the weapon is too op to allow multiples

export class ChillySmith extends BazaarAbstractContent {

    public addShopItem(button: number, item: ItemType, price: number, shop: number): void {
        this.outputText("\n" + ChillySmith.capitalizeFirstLetter(item.longName) + " - " + price + " gems");
        this.addButton(button, item.shortName, this.transactionItemConfirmation, item, price, shop);
    }

    public transactionItemConfirmation(item: ItemType, price: number, shop: number): void {
        this.clearOutput();
        this.outputText("Sun looks over as you bring the " + item.longName + " to him. You hold it out to him and ask how much it costs. He takes it out of your hand for a moment, examining it, then grunts, \"<i>" + ChillySmith.num2Text(price) + " Gems.</i>\"");
        if (this.player.gems >= price) {
            this.outputText("\n\nDo you buy it?");
            this.menu();
            this.addButton(0, "Yes", this.transactionYes, item, price, shop);
            this.addButton(1, "No", this.transactionNo, shop);
        }
        else {
            this.outputText("\n\nYou count out your Gems and realize you can't afford it.");
            this.menu();
            this.addButton(0, "Next", this.transactionNo, shop);
        }
    }

    public transactionYes(item: ItemType, price: number, shop: number): void {
        // Determine sub-shop
        let shopToGo;
        if (shop == 1) shopToGo = this.buySomeWeapons;
        else shopToGo = this.buySomeArmor;
        // Process
        this.clearOutput();
        if (this.player.gems >= price) {
            if (this.flags[kFLAGS.MRAPIER_BOUGHT] == 0 && item == this.weapons.MRAPIER) this.flags[kFLAGS.MRAPIER_BOUGHT]++;
            this.outputText("You fill out a couple papers while Sun takes off a security tag. He then holds out " + item.longName + " to you, saying, \"<i>Here.</i>\"");
            this.player.gems -= price;
            this.menu();
            this.statScreenRefresh();
            this.inventory.takeItem(item, shopToGo);
        }
        else {
            this.outputText("You count out your Gems and realize you can't afford it.");
            this.menu();
            this.addButton(0, "Next", this.transactionNo, shop);
        }
    }

    public transactionNo(shop: number): void {
        if (shop == 1) this.buySomeWeapons();
        else this.buySomeArmor();
    }

    public smithButton(setButtonOnly: boolean = false): void { // Shop button/appearance blurb
        if (!setButtonOnly) {
            this.outputText("\n\nOne large wagon near the back of the bazaar is almost unnoticable despite its size. All it has on it is a sign that reads ");
            if (this.silly()) this.outputText("\"<i>Chili's</i>\"");
            else this.outputText("\"<i>Chilly Smith</i>\"");
            this.outputText("Its colors are muted and dark compared to the dazzle of everything else, as though it's trying to hide.");
        }
        else this.addButton(3, "C. Smith", this.smithShop).hint("From the look of the sign, you have a feeling that this might be a shop that sells weapons and armour of sorts.");
    }

    public smithShop(): void { // Entrance, buttons
        this.spriteSelect(SpriteDb.s_chillySmith);
        this.credits.modContent = true;
        this.clearOutput();
        this.outputText("You make your way into ");
        if (this.silly()) this.outputText("the Chili's");
        else this.outputText("Chilly Smith");
        this.outputText(" and glance around, faced with cool-colored walls and a rather calm setting. The jaguar-morph shopowner, Sun, looks over to you and flicks his tail as if that's a proper greeting. The black avian beside him, Harmony, waves and calls out a hello. The two are a rather funny pair, with Sun being a 6'4\" wall of muscle and Harmony slender as can be, barely reaching Sun's shoulder. The shop itself is minimalist and straight-forward. You walk among shelves and glance over the stock.");
        this.menu();
        this.addButton(0, "Buy", this.buySomeShit).hint("Browse the merchandise available in the shop."); // Shop section
        if (!this.player.hasStatusEffect(StatusEffects.KnowsBlackfire)) this.addButton(1, "Talk", this.theFuckIsYouWho).hint("Try to talk to the jaguar-morph. He doesn't look like a nice guy though."); // Left over from original; still need a way for you to learn Blackfire
        this.addButton(4, "Leave", this.bazaar.enterTheBazaarAndMenu);
    }

    public buySomeShit(): void { // Shop buttons
        this.clearOutput();
        this.outputText("You announce you want to buy something, which calls Sun's attention. He turns his head to you, same dead look in his eyes that he usually has, and says, \"<i>All right. Bring whatever up to the front when you pick something.</i>\"");
        this.menu();
        this.addButton(0, "Weapons", this.buySomeWeapons);
        this.addButton(1, "Armor", this.buySomeArmor);
        this.addButton(4, "Back", this.smithShop);
    }

    public buySomeWeapons(): void { // Purchase weapons
        this.clearOutput();
        this.outputText("You decide to take a look at the weapons that the shop stocks.\n");
        this.menu();
        this.addShopItem(0, this.weapons.PTCHFRK, 200, 1); // Listen, I just really want this released.
        this.addShopItem(1, this.weapons.L_DAGR0, 150, 1);
        this.addShopItem(2, this.weapons.RIDING0, 50, 1);
        this.addShopItem(3, this.weapons.SUCWHIP, 400, 1);

        this.addShopItem(4, this.weapons.SCIMTR0, 500, 1);
        this.addShopItem(5, this.weapons.SPEAR_0, 450, 1);
        this.addShopItem(6, this.weapons.U_SWORD, 800, 1);
        if (this.flags[kFLAGS.MRAPIER_BOUGHT] == 0 && !this.player.hasItem(this.weapons.MRAPIER, 1) && !this.inventory.hasItemInStorage(this.weapons.MRAPIER)) {
            this.addShopItem(7, this.weapons.MRAPIER, 25000, 1); // One-buy and one-own only given its power.
        }
        else {
            this.addButtonDisabled(7, this.weapons.MRAPIER.shortName, "There's none in stock.", "");
        }

        this.addButton(14, "Back", this.buySomeShit);
    }

    public buySomeArmor(): void { // Purchase armor
        this.clearOutput();
        this.outputText("You decide to take a look at the armor that the shop stocks.\n");
        this.menu();
        this.addShopItem(0, this.armors.DSCLARM, 1000, 2);
        this.addShopItem(1, this.armors.SSARMOR, 2000, 2);
        this.addShopItem(2, this.armors.FULLPLT, 700, 2);
        this.addShopItem(3, this.armors.SCALEML, 500, 2);

        if (this.flags[kFLAGS.GOTTEN_INQUISITOR_ARMOR] == 1) { // A way for you to get the other armor, considering you have to give the Corset to Rubi. If these need price raising, let me know :3
            if (this.flags[kFLAGS.GOTTEN_INQUISITOR_ROBES] == 1 && this.flags[kFLAGS.GOTTEN_INQUISITOR_CORSET] == 0) {
                this.addButton(4, this.armors.I_CORST.shortName, this.buyInquiCorset);
                this.outputText("\nAn inquisitor's corset - 20000 Gems");
            } else if (this.flags[kFLAGS.GOTTEN_INQUISITOR_CORSET] == 1 && this.flags[kFLAGS.GOTTEN_INQUISITOR_ROBES] == 0) {
                this.addButton(4, this.armors.I_ROBES.shortName, this.buyInquiRobes);
                this.outputText("\nAn inquisitor's robes - 20000 Gems");
            } else if (this.flags[kFLAGS.GOTTEN_INQUISITOR_CORSET] == 1 && this.flags[kFLAGS.GOTTEN_INQUISITOR_ROBES] == 1) {
                this.addShopItem(4, this.armors.EBNJACK, 6000, 2);
            }
        } else if (this.flags[kFLAGS.GOTTEN_INQUISITOR_ARMOR] == 0) {
            this.addShopItem(4, this.armors.EBNJACK, 6000, 2);
        }
        this.addShopItem(5, this.armors.SS_ROBE, 2500, 2);
        this.addShopItem(6, this.armors.BIMBOSK, 250, 2);
        this.addShopItem(7, this.armors.INDECST, 1000, 2);
        this.addButton(14, "Back", this.buySomeShit);
    }

    public whatTheFuckDude(): void { // "No" choice for any special purchases
        this.clearOutput();
        this.outputText("You shake your head. That's simply too much for you to pay. You wish him luck in selling it and turn back to the rest of the shop.");
        this.menu();
        this.addButton(0, "Next", this.buySomeShit);
    }

    public buyInquiCorset(): void { // Inquisitor's Corset purchase confirmation
        this.clearOutput();
        this.outputText("You point to the overly sexual corset and ask what it's about. Sun shrugs in reply.\n\n");
        this.outputText("\"<i>Found it in some weird place at the Swamp. 20,000 Gems.</i>\"\n\n");
        this.outputText("Do you buy the Inquisitor's Corset?");
        this.menu();
        this.addButton(0, "Yes", this.timeForSexy);
        this.addButton(1, "No", this.whatTheFuckDude);
    }

    public timeForSexy(): void {
        this.clearOutput();
        if (this.player.gems < 20000) {
            this.outputText("You'd love to buy the corset, but it's out of your price range right now. You wish Sun good luck in selling it and move on in the shop.");
            this.menu();
            this.addButton(0, "Next", this.buySomeArmor);
        }
        else {
            this.outputText("You tell Sun that you want to buy it. He nods and has you bring it to the counter, where he removes a security tag, takes your Gems, and hands it over.");
            this.player.gems -= 20000;
            this.flags[kFLAGS.GOTTEN_INQUISITOR_CORSET]++;
            this.statScreenRefresh();
            this.menu();
            this.inventory.takeItem(this.armors.I_CORST, this.buySomeArmor);
        }
    }

    public buyInquiRobes(): void { // Inquisitor's Robes purchase confirmation
        this.clearOutput();
        this.outputText("You point to the forboding robes and ask what it's about. Sun shrugs in reply.\n\n");
        this.outputText("\"<i>Found it in some weird place at the Swamp. 20,000 Gems.</i>\"\n\n");
        this.outputText("Do you buy the Inquisitor's Robes?");
        this.menu();
        this.addButton(0, "Yes", this.timeForDoubleSexy);
        this.addButton(1, "No", this.whatTheFuckDude);
    }

    public timeForDoubleSexy(): void {
        this.clearOutput();
        if (this.player.gems < 20000) {
            this.outputText("You'd love to buy the armor, but it's out of your price range right now. You wish Sun good luck in selling it and move on in the shop.");
            this.menu();
            this.addButton(0, "Next", this.buySomeArmor);
        } else {
            this.outputText("You tell Sun that you want to buy it. He nods and has you bring it to the counter, where he removes a security tag, takes your Gems, and hands it over.");
            this.player.gems -= 20000;
            this.flags[kFLAGS.GOTTEN_INQUISITOR_ROBES]++;
            this.statScreenRefresh();
            this.menu();
            this.inventory.takeItem(this.armors.I_ROBES, this.buySomeArmor);
        }
    }

    public theFuckIsYouWho(): void { // Talk stuff
        this.clearOutput();
        this.outputText("You walk up to Sun and give him a merry greeting. He glances you up and down, looking less than pleased.\n\n");
        if (rand(10) == 0 && !this.player.hasStatusEffect(StatusEffects.KnowsBlackfire)) {
            this.outputText("With a long sigh, he grabs a book from a nearby shelf and shoves it into your arms, saying, \"<i>Here. Take this and leave me to do my damn job. This isn't a fucking playground.</i>\"\n\n");
            this.outputText("You frown. You'd only wanted to talk. Still, you mumble a thanks and quickly back out of the store. You read the book and blink with new knowledge when you're done-- <b>you have learned the spell Blackfire!</b>");
            this.player.createStatusEffect(StatusEffects.KnowsBlackfire, 0, 0, 0, 0);
        }
        else {
            if (rand(4) == 0) {
                this.outputText("Sun reaches into his pocket and and crams a handful of Gems against your chest, saying, \"<i>I'm gonna pay you five ");
                if (this.silly()) this.outputText("dollars");
                else this.outputText("Gems");
                this.outputText(" to fuck off.</i>\" You give a confused thanks and back away.");
                this.player.gems += 5;
            }
            else {
                if (rand(2) == 0) this.outputText("When he says nothing besides giving you a hard glare, you get the point and back away with a murmured apology.");
                else this.outputText("\"<i>I have a boyfriend.</i>\" He jabs a thumb in Harmony's direction. You glance at Harmony, then blink at Sun a couple times. That wasn't what you really wanted, but okay. You give him a congrats and duck out of the store.");
            }
        }
        this.menu();
        this.addButton(0, "Next", this.camp.returnToCampUseOneHour);
    }

}
