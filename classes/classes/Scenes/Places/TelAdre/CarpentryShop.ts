import { TelAdreAbstractContent } from "./TelAdreAbstractContent";
import { SpriteDb } from "../../../display/SpriteDb";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { kACHIEVEMENTS } from "../../../GlobalFlags/kACHIEVEMENTS";

export class CarpentryShop extends TelAdreAbstractContent {
    public nails: number = 0;
    public wood: number = 0;
    public stone: number = 0;

    // -----------------
    // -- CARPENTRY SHOP
    // -----------------
    public enter(): void {
        this.clearOutput();
        this.spriteSelect(SpriteDb.s_carpenter);
        this.credits.modContent = true;
        this.outputText("You enter the shop marked by a sign with hammer and saw symbol painted on it. There are array of tools all hung neatly. A six feet tall zebra-morph stallion stands behind the counter. He appears to be wearing typical lumberjack outfit.\n\n");
        this.outputText("\"<i>Welcome to my hardware shop dear customer. Feel free to look around,</i>\" he says. \n\n");
        this.unlockCodexEntry("Zebra-Morphs", kFLAGS.CODEX_ENTRY_ZEBRAS, false, false);
        this.doNext(this.carpentryShopInside);
    }

    public carpentryShopInside(): void {
        this.clearOutput();
        this.credits.modContent = true;
        this.outputText("\"<i>So what will it be?</i>\"\n\n");
        if (this.player.hasKeyItem("Carpenter's Toolbox") >= 0) this.camp.cabinProgress.checkMaterials();
        this.menu();
        if (this.player.hasKeyItem("Carpenter's Toolbox") >= 0) {
            this.addButton(0, "Buy Nails", this.carpentryShopBuyNails);
        } else {
            this.addDisabledButton(0, "Buy Nails", "You don't have a toolbox. How are you going to carry nails safely?");
        }
        this.addButton(1, "Buy Wood", this.carpentryShopBuyWood);
        this.addButton(2, "Buy Stones", this.carpentryShopBuyStone);
        if (this.player.keyItemv1("Carpenter's Toolbox") > 0) {
            this.addButton(5, "Sell Nails", this.carpentryShopSellNails);
        } else {
            this.addDisabledButton(5, "Sell Nails", "You have no nails to sell.");
        }
        if (this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] > 0) {
            this.addButton(6, "Sell Wood", this.carpentryShopSellWood);
        } else {
            this.addDisabledButton(6, "Sell Wood", "You have no wood to sell.");
        }
        if (this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] > 0) {
            this.addButton(7, "Sell Stones", this.carpentryShopSellStone);
        } else {
            this.addDisabledButton(7, "Sell Stones", "You have no stones to sell.");
        }
        if (this.player.hasKeyItem("Carpenter's Toolbox") < 0) {
            this.addButton(10, "Toolbox", this.carpentryShopBuySet);
            this.addDisabledButton(11, "Nail box", "You need a Carpenter's Toolbox to make use of this.");
        } else {
            this.addDisabledButton(10, "Toolbox", "You already own a set of carpentry tools.");
            if (this.player.hasKeyItem("Carpenter's Nail Box") < 0) {
                this.addButton(11, "Nail box", this.carpentryShopBuyNailbox);
            } else {
                this.addDisabledButton(11, "Nail box", "You already own a nail box.");
            }
        }

        // addButton(12, "StoneBuildingsGuide", carpentryShopBuySet3);
        this.addButton(14, "Leave", this.telAdre.telAdreMenu);
    }
    // Buy nails
    public carpentryShopBuyNails(): void {
        this.clearOutput();
        this.outputText("You ask him if he has nails for sale. He replies \"<i>Certainly! I've got nails. Your toolbox can hold up to " + this.camp.cabinProgress.maxNailSupply() + " nails. I'll be selling nails at a price of two gems per nail.</i>\" \n\n");
        this.camp.cabinProgress.checkMaterials(1);
        this.menu();
        this.addButton(0, "Buy 10", this.carpentryShopBuyNailsAmount, 10);
        this.addButton(1, "Buy 25", this.carpentryShopBuyNailsAmount, 25);
        this.addButton(2, "Buy 50", this.carpentryShopBuyNailsAmount, 50);
        this.addButton(3, "Buy 75", this.carpentryShopBuyNailsAmount, 75);
        this.addButton(4, "Buy 100", this.carpentryShopBuyNailsAmount, 100);
        this.addButton(14, "Back", this.carpentryShopInside);
    }

    private carpentryShopBuyNailsAmount(amount: number): void {
        this.clearOutput();
        this.nails = amount;
        this.outputText("You ask him for " + amount + " nails. He replies \"<i>That'll be " + (amount * 2) + " gems, please.</i>\" \n\nDo you buy the nails?");
        this.doYesNo(this.carpentryShopBuyNailsYes, this.carpentryShopBuyNails);
    }

    private carpentryShopBuyNailsYes(): void {
        this.clearOutput();
        if (this.player.gems >= (this.nails * 2)) {
            this.player.gems -= (this.nails * 2);
            this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_HAMMER_TIME] += this.nails;
            if (this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_HAMMER_TIME] >= 300) this.awardAchievement("Hammer Time", kACHIEVEMENTS.GENERAL_HAMMER_TIME);
            this.player.addKeyValue("Carpenter's Toolbox", 1, this.nails);
            this.outputText("You hand over " + (this.nails * 2) + " gems. \"<i>Done,</i>\" he says as he hands over bundle of " + this.nails + " nails to you.\n\n");
            // If over the limit
            if (this.player.keyItemv1("Carpenter's Toolbox") > this.camp.cabinProgress.maxNailSupply()) {
                this.outputText("Unfortunately, your toolbox can't hold anymore nails. You notify him and he refunds you the gems.\n\n");
                this.player.gems += ((this.player.keyItemv1("Carpenter's Toolbox") - this.camp.cabinProgress.maxNailSupply()) * 2);
                this.player.addKeyValue("Carpenter's Toolbox", 1, -(this.player.keyItemv1("Carpenter's Toolbox") - this.camp.cabinProgress.maxNailSupply()));
            }
            this.camp.cabinProgress.checkMaterials(1);
        }
        else {
            this.outputText("\"<i>I'm sorry, my friend. You do not have enough gems.</i>\"");
        }
        this.statScreenRefresh();
        this.doNext(this.carpentryShopBuyNails);
    }

    // Buy wood
    public carpentryShopBuyWood(): void {
        this.clearOutput();
        this.outputText("You ask him if he has wood for sale. He replies \"<i>Certainly! I've got extra supply of wood. I'll be selling wood at a price of 10 gems per wood plank.</i>\" \n\n");
        this.camp.cabinProgress.checkMaterials(2);
        this.menu();
        this.addButton(0, "Buy 10", this.carpentryShopBuyWoodAmount, 10);
        this.addButton(1, "Buy 20", this.carpentryShopBuyWoodAmount, 20);
        this.addButton(2, "Buy 30", this.carpentryShopBuyWoodAmount, 30);
        this.addButton(3, "Buy 40", this.carpentryShopBuyWoodAmount, 40);
        this.addButton(4, "Buy 50", this.carpentryShopBuyWoodAmount, 50);
        this.addButton(14, "Back", this.carpentryShopInside);
    }

    private carpentryShopBuyWoodAmount(amount: number): void {
        this.clearOutput();
        this.wood = amount;
        this.outputText("You ask him for " + amount + " wood planks. He replies \"<i>That'll be " + (amount * 10) + " gems, please.</i>\" \n\nDo you buy the wood?");
        this.doYesNo(this.carpentryShopBuyWoodYes, this.carpentryShopBuyWood);
    }

    private carpentryShopBuyWoodYes(): void {
        if (this.player.gems >= (this.wood * 10)) {
            this.player.gems -= (this.wood * 10);
            this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_IM_NO_LUMBERJACK] += this.wood;
            if (this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_IM_NO_LUMBERJACK] >= 100) this.awardAchievement("I'm No Lumberjack", kACHIEVEMENTS.GENERAL_IM_NO_LUMBERJACK);
            this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] += this.wood;
            this.outputText("You hand over " + (this.wood * 10) + " gems. \"<i>I'll have the caravan deliver the wood to your camp as soon as you leave my shop,</i>\" he says.\n\n");
            // If over the limit
            if (this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] > this.camp.cabinProgress.maxWoodSupply()) {
                this.outputText("Unfortunately, your wood supply seem to be full. You inform him. He refunds you the gems.\n\n");
                this.player.gems += ((this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] - this.camp.cabinProgress.maxWoodSupply()) * 10);
                this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] -= (this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] - this.camp.cabinProgress.maxWoodSupply());
            }
            this.camp.cabinProgress.checkMaterials(2);
        }
        else {
            this.clearOutput();
            this.outputText("\"<i>I'm sorry, my friend. You do not have enough gems.</i>\"");
        }
        this.statScreenRefresh();
        this.doNext(this.carpentryShopBuyWood);
    }

    // Buy Stones
    public carpentryShopBuyStone(): void {
        this.clearOutput();
        this.outputText("You ask him if he has stones for sale. He replies \"<i>Certainly! I've got extra supply of stones. I'll be selling stones at a price of 20 gems per stone.</i>\" \n\n");
        this.camp.cabinProgress.checkMaterials(3);
        this.menu();
        this.addButton(0, "Buy 10", this.carpentryShopBuyStoneAmount, 10);
        this.addButton(1, "Buy 20", this.carpentryShopBuyStoneAmount, 20);
        this.addButton(2, "Buy 30", this.carpentryShopBuyStoneAmount, 30);
        this.addButton(3, "Buy 40", this.carpentryShopBuyStoneAmount, 40);
        this.addButton(4, "Buy 50", this.carpentryShopBuyStoneAmount, 50);
        this.addButton(14, "Back", this.carpentryShopInside);
    }

    private carpentryShopBuyStoneAmount(amount: number): void {
        this.clearOutput();
        this.stone = amount;
        this.outputText("You ask him for " + amount + " stones. He replies \"<i>That'll be " + (amount * 20) + " gems, please.</i>\" \n\nDo you buy the stones?");
        this.doYesNo(this.carpentryShopBuyStoneYes, this.carpentryShopBuyStone);
    }

    private carpentryShopBuyStoneYes(): void {
        if (this.player.gems >= (this.stone * 20)) {
            this.player.gems -= (this.stone * 20);
            this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_YABBA_DABBA_DOO] += this.stone;
            if (this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_YABBA_DABBA_DOO] >= 100) this.awardAchievement("Yabba Dabba Doo", kACHIEVEMENTS.GENERAL_YABBA_DABBA_DOO);
            this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] += this.stone;
            this.outputText("You hand over " + (this.stone * 20) + " gems. \"<i>I'll have the caravan deliver the stones to your camp as soon as you leave my shop,</i>\" he says.\n\n");
            // If over the limit
            if (this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] > this.camp.cabinProgress.maxStoneSupply()) {
                this.outputText("Unfortunately, your stone seem to be full. You inform him. He refunds you the gems.\n\n");
                this.player.gems += ((this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] - this.camp.cabinProgress.maxStoneSupply()) * 20);
                this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] -= (this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] - this.camp.cabinProgress.maxStoneSupply());
            }
            this.camp.cabinProgress.checkMaterials(3);
        }
        else {
            this.outputText("\"<i>I'm sorry, my friend. You do not have enough gems.</i>\"");
        }
        this.statScreenRefresh();
        this.doNext(this.carpentryShopBuyStone);
    }

    // Sell Nails
    public carpentryShopSellNails(): void {
        this.clearOutput();
        this.outputText("You ask him if he's willing to buy nails from you. He says, \"<i>Certainly! I'll be buying nails at a rate of one gem per nail.</i>\" \n\n");
        this.camp.cabinProgress.checkMaterials(1);
        this.menu();
        if (this.player.keyItemv1("Carpenter's Toolbox") >= 10) this.addButton(0, "Sell 10", this.carpentryShopSellNailsAmount, 10);
        if (this.player.keyItemv1("Carpenter's Toolbox") >= 25) this.addButton(1, "Sell 25", this.carpentryShopSellNailsAmount, 25);
        if (this.player.keyItemv1("Carpenter's Toolbox") >= 50) this.addButton(2, "Sell 50", this.carpentryShopSellNailsAmount, 50);
        if (this.player.keyItemv1("Carpenter's Toolbox") >= 75) this.addButton(3, "Sell 75", this.carpentryShopSellNailsAmount, 75);
        if (this.player.keyItemv1("Carpenter's Toolbox") >= 100) this.addButton(3, "Sell 100", this.carpentryShopSellNailsAmount, 100);
        if (this.player.keyItemv1("Carpenter's Toolbox") > 0) this.addButton(4, "Sell All", this.carpentryShopSellNailsAmount, this.player.keyItemv1("Carpenter's Toolbox"));
        this.addButton(14, "Back", this.carpentryShopInside);
    }

    private carpentryShopSellNailsAmount(amount: number): void {
        this.clearOutput();
        this.nails = amount;
        this.outputText("You're willing to offer " + CarpentryShop.num2Text(amount) + " " + (this.player.keyItemv1("Carpenter's Toolbox") == 1 ? "piece" : "pieces") + " of nails. He replies \"<i>I'll buy that for " + amount + " gems.</i>\" \n\nDo you sell the nails?");
        this.doYesNo(this.carpentryShopSellNailsYes, this.carpentryShopSellNails);
    }

    private carpentryShopSellNailsYes(): void {
        this.clearOutput();
        if (this.player.keyItemv1("Carpenter's Toolbox") >= this.nails) {
            this.player.gems += this.nails;
            this.player.addKeyValue("Carpenter's Toolbox", 1, -this.nails);
            this.outputText("You take " + CarpentryShop.num2Text(this.nails) + " " + (this.player.keyItemv1("Carpenter's Toolbox") ? "piece" : "pieces") + " of nails out of your toolbox and hand them over to the carpenter. \"<i>Deal. Here are " + this.nails + " gems,</i>\" he says.\n\n");
            this.camp.cabinProgress.checkMaterials(1);
        }
        else {
            this.outputText("\"<i>I'm sorry, my friend. You do not have enough nails.</i>\"");
        }
        this.statScreenRefresh();
        this.doNext(this.carpentryShopSellNails);
    }

    // Sell wood
    public carpentryShopSellWood(): void {
        this.clearOutput();
        this.outputText("You ask him if he's willing to buy wood from you. He says, \"<i>Certainly! I'll be buying wood at a rate of five gems per piece.</i>\" \n\n");
        this.camp.cabinProgress.checkMaterials(2);
        this.menu();
        if (this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] >= 1) this.addButton(0, "Sell 1", this.carpentryShopSellWoodAmount, 1);
        if (this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] >= 5) this.addButton(1, "Sell 5", this.carpentryShopSellWoodAmount, 5);
        if (this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] >= 10) this.addButton(2, "Sell 10", this.carpentryShopSellWoodAmount, 10);
        if (this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] >= 25) this.addButton(3, "Sell 25", this.carpentryShopSellWoodAmount, 25);
        if (this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] > 0) this.addButton(4, "Sell All", this.carpentryShopSellWoodAmount, this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES]);
        this.addButton(14, "Back", this.carpentryShopInside);
    }

    private carpentryShopSellWoodAmount(amount: number): void {
        this.clearOutput();
        this.wood = amount;
        this.outputText("You're willing to offer " + CarpentryShop.num2Text(amount) + " " + (this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] == 1 ? "piece" : "pieces") + " of wood. He replies \"<i>I'll buy that for " + (amount * 5) + " gems.</i>\" \n\nDo you sell the wood?");
        this.doYesNo(this.carpentryShopSellWoodYes, this.carpentryShopSellWood);
    }

    private carpentryShopSellWoodYes(): void {
        this.clearOutput();
        if (this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] >= this.wood) {
            this.player.gems += (this.wood * 5);
            this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] -= this.wood;
            this.outputText("You sign the permission form for " + CarpentryShop.num2Text(this.wood) + " " + (this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] == 1 ? "piece" : "pieces") + " of wood to be unloaded from your camp. \"<i>Deal. Here are " + (this.wood * 5) + " gems,</i>\" he says.\n\n");
            this.camp.cabinProgress.checkMaterials(2);
        }
        else {
            this.outputText("\"<i>I'm sorry, my friend. You do not have enough wood.</i>\"");
        }
        this.statScreenRefresh();
        this.doNext(this.carpentryShopSellWood);
    }

    // Sell Stones
    public carpentryShopSellStone(): void {
        this.clearOutput();
        this.outputText("You ask him if he's willing to buy stones from you. He says, \"<i>Certainly! I'll be buying stones at a rate of ten gems per piece.</i>\" \n\n");
        this.camp.cabinProgress.checkMaterials(3);
        this.menu();
        if (this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] >= 1) this.addButton(0, "Sell 1", this.carpentryShopSellStoneAmount, 1);
        if (this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] >= 5) this.addButton(1, "Sell 5", this.carpentryShopSellStoneAmount, 5);
        if (this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] >= 10) this.addButton(2, "Sell 10", this.carpentryShopSellStoneAmount, 10);
        if (this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] >= 25) this.addButton(3, "Sell 25", this.carpentryShopSellStoneAmount, 25);
        if (this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] > 0) this.addButton(4, "Sell All", this.carpentryShopSellStoneAmount, this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES]);
        this.addButton(14, "Back", this.carpentryShopInside);
    }

    private carpentryShopSellStoneAmount(amount: number): void {
        this.clearOutput();
        this.stone = amount;
        this.outputText("You're willing to offer " + CarpentryShop.num2Text(amount) + " " + (this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] == 1 ? "piece" : "pieces") + " of stone. He replies \"<i>I'll buy that for " + (amount * 10) + " gems.</i>\" \n\nDo you sell the stones?");
        this.doYesNo(this.carpentryShopSellStoneYes, this.carpentryShopSellStone);
    }

    private carpentryShopSellStoneYes(): void {
        this.clearOutput();
        if (this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] >= this.stone) {
            this.player.gems += (this.stone * 10);
            this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] -= this.stone;
            this.outputText("You sign the permission form for " + CarpentryShop.num2Text(this.stone) + " " + (this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] == 1 ? "piece" : "pieces") + " of stones to be unloaded from your camp. \"<i>Deal. Here are " + (this.stone * 10) + " gems,</i>\" he says.\n\n");
            this.camp.cabinProgress.checkMaterials(3);
        }
        else {
            this.outputText("\"<i>I'm sorry, my friend. You do not have enough stones.</i>\"");
        }
        this.statScreenRefresh();
        this.doNext(this.carpentryShopSellStone);
    }

    // Buy toolbox
    public carpentryShopBuySet(): void {
        this.clearOutput();
        if (this.player.hasKeyItem("Carpenter's Toolbox") >= 0) {
            this.outputText("<b>You already own a set of carpentry tools!</b>");
            this.doNext(this.carpentryShopInside);
            return;
        }
        this.outputText("You walk around for a while until you see a wooden toolbox. It's filled with assorted tools. One of them is a hammer. Another one is a saw. Even another is an axe. There is a measuring tape. There's even a book with hundreds of pages, all about how to use tools and it even has project instructions! There's also a compartment in the toolbox for nails.");
        if (this.flags[kFLAGS.CAMP_CABIN_PROGRESS] >= 4) this.outputText(" Just what you need to build your cabin.\n\n");
        else this.outputText(" Would be handy should you want to build something to make your life more comfortable.\n\n");
        this.outputText("\"<i>Two hundred gems and it's all yours,</i>\" the shopkeeper says.\n\n");
        if (this.player.gems >= 200) {
            this.outputText("Do you buy it?");
            this.doYesNo(this.carpentryShopBuySetYes, this.carpentryShopBuySetNo);
        }
        else {
            this.outputText("You count out your gems and realize it's beyond your price range.");
            this.doNext(this.carpentryShopInside);
        }
    }

    public carpentryShopBuySetYes(): void {
        this.player.gems -= 200;
        this.outputText("You hand over two hundred gems to the shopkeeper. ");
        this.outputText("\"<i>Here you go,</i>\" he says. You feel so proud to have your own tools for building stuff! \n\n");
        this.outputText("<b>Gained Key Item: Carpenter's Toolbox!</b>");
        this.player.createKeyItem("Carpenter's Toolbox", 0, 0, 0, 0);
        this.statScreenRefresh();
        this.doNext(this.carpentryShopInside);
    }

    public carpentryShopBuySetNo(): void {
        this.clearOutput();
        this.outputText("\"<i>No thanks,</i>\" you tell him. \n\n");
        this.outputText("\"<i>Suit yourself,</i>\" he says as you put the box of tools back where it was.");
        this.doNext(this.carpentryShopInside);
    }

    public carpentryShopBuyNailbox(): void {
        if (this.player.hasKeyItem("Carpenter's Nail Box") >= 0) {
            this.outputText("<b>You already own a nail box!</b>");
            this.doNext(this.carpentryShopInside);
            return;
        }
        this.outputText("\n\nYou walk back to where you remember you bought the toolbox. There are nail boxes designed to hold four hundred nails. Certainly, you'll be able to hold more nails and ensure you can keep on building in one trip.");
        this.outputText("\"<i>Two hundred gems and it's all yours,</i>\" the shopkeeper says.\n\n");
        if (this.player.gems >= 200) {
            this.outputText("Do you buy it?");
            this.doYesNo(this.carpentryShopBuyNailboxYes, this.carpentryShopBuyNailboxNo);
        }
        else {
            this.outputText("You count out your gems and realize it's beyond your price range.");
            this.doNext(this.carpentryShopInside);
        }
    }

    public carpentryShopBuyNailboxYes(): void {
        this.player.gems -= 200;
        this.outputText("You hand over two hundred gems to the shopkeeper. ");
        this.outputText("\"<i>Here you go,</i>\" he says. Now you can hold more nails for your projects! \n\n");
        this.outputText("<b>Gained Key Item: Carpenter's Nail Box!</b>");
        this.player.createKeyItem("Carpenter's Nail Box", 400, 0, 0, 0);
        this.statScreenRefresh();
        this.doNext(this.carpentryShopInside);
    }

    public carpentryShopBuyNailboxNo(): void {
        this.clearOutput();
        this.outputText("\"<i>No thanks,</i>\" you tell him. \n\n");
        this.outputText("\"<i>Suit yourself,</i>\" he says as you put the nail box back where it was.");
        this.doNext(this.carpentryShopInside);
    }

    // StoneBuildingsGuide

}
