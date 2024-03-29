import { BaseContent } from "../../BaseContent";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { Encounter } from "../API/Encounter";
import { Encounters } from "../API/Encounters";
import { kACHIEVEMENTS } from "../../GlobalFlags/kACHIEVEMENTS";
import { StatusEffects } from "../../StatusEffects";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

/**
 * Lovely and comfortable cabin for you to sleep in peace.
 * @author Kitteh6660
 */
export class CabinProgress extends BaseContent {

    // ------------
    // VALUES
    // ------------
    public maxNailSupply(): number {
        return 200 + this.player.keyItemv1("Carpenter's Nail Box");
    }
    public maxWoodSupply(): number {
        return 999;
    }
    public maxStoneSupply(): number {
        return 999;
    }

    public checkMaterials(highlight: number = 0): void {
        // Nails
        if (highlight == 1) this.outputText("<b>");
        this.outputText("Nails: " + this.player.keyItemv1("Carpenter's Toolbox") + "/" + this.maxNailSupply() + " \n");
        if (highlight == 1) this.outputText("</b>");
        // Wood
        if (highlight == 2) this.outputText("<b>");
        this.outputText("Wood: " + this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] + "/" + this.maxWoodSupply() + " \n");
        if (highlight == 2) this.outputText("</b>");
        // Stones
        if (highlight == 3) this.outputText("<b>");
        this.outputText("Stones: " + this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] + "/" + this.maxStoneSupply() + " \n");
        if (highlight == 3) this.outputText("</b>");
    }

    // ------------
    // HARVESTING
    // ------------
    private _forestEncounter: Encounter | undefined = undefined;
    public get forestEncounter(): Encounter {
        return this._forestEncounter = this._forestEncounter || Encounters.build({
            name: "lumber",
            call: this.gatherWoods,
            when: () => {
                return (this.flags[kFLAGS.CAMP_CABIN_PROGRESS] >= 4 || this.player.hasKeyItem("Carpenter's Toolbox") >= 0)
                    && this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] < this.maxWoodSupply();
            }
        });
    }
    public gatherWoods(): void {
        this.combat.cleanupAfterCombat();
        this.outputText("While exploring the forest, you survey the trees. The trees are at the right thickness. You could cut down the trees. \n\n");
        this.menu();
        if (this.player.fatigueLeft() < 30) {
            this.outputText("<b>You are too tired to consider cutting down the trees. Perhaps some rest will suffice?</b>");
            this.doNext(this.camp.returnToCampUseOneHour);
            return;
        }
        if (this.player.hasItem(this.weapons.L__AXE0) || this.player.weaponName == "large axe") {
            this.outputText("You are carrying a large axe with you.");
            this.addButton(0, "Axe", this.cutTreeTIMBER);
        }
        if (this.player.hasKeyItem("Carpenter's Toolbox") >= 0) {
            this.outputText("You are carrying carpenter's box with you. It contains an axe.\n");
            this.addButton(0, "Axe", this.cutTreeTIMBER);
        }
        if (this.camp.followerKiha()) {
            this.outputText("You have someone who might help you. Kiha might be able to assist you.\n");
            this.addButton(1, "Kiha", this.getHelpFromKiha);
        }
        if (this.silly() && this.player.str >= 70) {
            this.outputText("You suddenly have the strange urge to punch trees. Do you punch the tree? \n");
            this.addButton(2, "Punch Tree", this.punchTreeMinecraftStyle);
        }
        if (!(this.output.buttonIsVisible(0) || this.output.buttonIsVisible(1) || this.output.buttonIsVisible(2))) {
            this.outputText("<b>Unfortunately, there is nothing you can do right now.</b>");
        }
        this.addButton(14, "Leave", this.noThanks);
    }

    // Silly Mode! Punch trees the Minecraft way!
    private punchTreeMinecraftStyle(): void {
        this.clearOutput();
        if (this.player.str >= 90) {
            this.outputText("Who needs axes when you've got pure strength? Bracing yourself, you crack your knuckles and punch the tree with your mighty strength. Crack begins to form and you keep punching. As soon as the crack gets big enough, a block of wood breaks off. Strangely, the tree floats. ");
        }
        else {
            this.outputText("Who needs axes when you've got pure strength? Bracing yourself, you crack your knuckles and punch the tree with all your strength. It takes effort and while you're punching the tree, crack appears. It grows bigger as you keep punching. When the crack gets big enough, the log just broke off and the tree strangely floats. ");
        }
        this.outputText("You shrug and pick up the wood block when you hear crashing sound as the tree falls over and splits into many wooden blocks! Surprisingly, they clump together into one bunch. You pick the bunch of wood, noting how easy it is to carry. You return to your camp. \n\n");
        this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_DEFORESTER] += (10 + Math.floor(this.player.str / 8));
        this.incrementWoodSupply(10 + Math.floor(this.player.str / 8));
        this.awardAchievement("Getting Wood", kACHIEVEMENTS.GENERAL_GETTING_WOOD);
        this.player.changeFatigue(50, 2);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Cut down the tree yourself with large axe.
    private cutTreeTIMBER(): void {
        this.clearOutput();
        const wood: number = 10 + Math.floor(this.player.str / 8);
        if (this.player.weaponName == "large axe") this.outputText("You ready your oversized axe. ");
        else this.outputText("You ready your axe. ");
        this.outputText("With your strength, you hack away at the tree, making wedge-shaped cuts. After ten strikes, you yell \"<i>TIMMMMMMMMBER!</i>\" as the tree falls and lands on the ground with a loud crash. You are quite the fine lumberjack! You then cut the felled tree into pieces and you haul the wood back to your camp.\n\n");
        this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_DEFORESTER] += (wood);
        this.incrementWoodSupply(wood);
        this.player.changeFatigue(50, 2);
        this.doNext(this.camp.returnToCampUseTwoHours);
    }

    // Get help from Kiha.
    private getHelpFromKiha(): void {
        this.outputText("You recall Kiha wields an oversized axe. You call out for her. After a minute, she walks over to you and says \"<i>Yes, my idiot?</i>\" You tell her that you would like her to cut down some trees so you can haul the wood. She nods and yells \"<i>Stand back!</i>\" as you stand back while you watch her easily cut down not one but two trees! With the trees cut down, you and Kiha haul the wood back to your camp. ");
        if (this.player.str < 33) this.outputText("It's a daunting task as you can only carry few of the wood at a time. Even Kiha is far superior to your carrying capacity as she can carry a lot of wood. \n\n");
        if (this.player.str >= 33 && this.player.str < 66) this.outputText("It's quite the chore. Though you can carry several pieces of wood at a time, Kiha is still superior to you when it comes to carrying wood. \n\n");
        if (this.player.str >= 66) this.outputText("You easily tackle the task of carrying wood. You even manage to carry five pieces of wood at a time!\n\n");
        this.outputText("It takes some time but you eventually bring the last of wood back to your camp. \n\n");
        this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_DEFORESTER] += (20 + Math.floor(this.player.str / 5));
        this.incrementWoodSupply(20 + Math.floor(this.player.str / 5));
        this.player.changeFatigue(50, 2);
        this.doNext(this.camp.returnToCampUseTwoHours);
    }

    public incrementWoodSupply(amount: number): void {
        this.outputText("<b>(+" + amount + " wood!");
        this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] += amount;
        if (this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] >= this.maxWoodSupply()) {
            this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] = this.maxWoodSupply();
            this.outputText(" Your wood capacity is full.");
        }
        this.outputText(")</b>");
    }

    // ------------
    // PROGRESSION
    // ------------
    public initiateCabin(): void {
        this.clearOutput();
        if (this.player.hasKeyItem("Nails") >= 0) this.player.removeKeyItem("Nails");
        // Start cabin project!
        if (this.flags[kFLAGS.CAMP_CABIN_PROGRESS] >= 10) this.flags[kFLAGS.CAMP_BUILT_CABIN] = 1;
        if (this.flags[kFLAGS.CAMP_BUILT_CABIN] == 1) {
            kGAMECLASS.dungeons.cabin.enterCabin();
            return;
        }
        if (this.player.fatigue <= this.player.maxFatigue() - 50 || this.flags[kFLAGS.CAMP_CABIN_PROGRESS] <= 1) {
            switch (this.flags[kFLAGS.CAMP_CABIN_PROGRESS]) {
                case 1:
                    this.thinkOfCabin();
                    break;
                case 2:
                    this.prepareLocation();
                    break;
                case 3:
                    this.startThinkingOfMaterials();
                    break;
                case 4:
                    this.checkToolbox();
                    break;
                case 5:
                    this.drawCabinPlans();
                    break;
                case 6:
                    this.buildCabinPart1();
                    break;
                case 7:
                    this.buildCabinPart2();
                    break;
                case 8:
                    this.buildCabinPart3();
                    break;
                case 9:
                    this.buildCabinPart4();
                    break;
                case 10:
                    this.enterCabinFirstTime();
                    break;
                default:
                    this.thinkOfCabin(); // This shouldn't happen, move along! Failsafe method.
            }
        }
        else {
            this.outputText("You are too exhausted to work on your cabin!");
            this.doNext(this.playerMenu);
        }
    }

    // Error message
    public errorNotEnough(): void {
        this.outputText("\n\n<b>You do not have sufficient resources. You may buy more nails from the carpentry shop in Tel'Adre and get more wood from either the Forest or the Deepwoods.</b>");
    }
    public errorNotHave(): void {
        this.outputText("\n\n<b>You do not have the tools to build.</b>");
    }

    // STAGE 1 - A wild idea appears!
    public thinkOfCabin(): void {
        this.outputText("You wistfully think back to your old town of Ingnam, so close and yet so far away on the other side of the portal. A feeling of homesickness comes over you. Wandering around your camp area in your thoughts, an idea comes to you.\n\n");
        this.outputText("Why not build a house like the ones back home? Well, a cabin at least. You’re not completely inexperienced in building and there are plenty of materials available. Tools would be an issue though… as your thoughts take off, the feeling of homesickness starts to lift. If there’s no trace of your familiar village life in Mareth, you’ll just have to build it yourself.\n\n");
        this.outputText("You know just the site too…");
        this.flags[kFLAGS.CAMP_CABIN_PROGRESS] = 2;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // STAGE 2 - Survey and clear area for cabin site.
    private prepareLocation(): void {
        this.outputText("Some might call it silly to think about building a home when you have such an important quest, but you have no idea how long it will take. And frankly, you’re sick of waking up covered in dew or getting caught in sudden storms. A good stout cabin in good Ingnam style would do wonders for your recuperation each night. Luckily you haven’t caught a cold, yet.\n\n");
        this.outputText("The spot for the cabin is up on a small hill, close enough to see the portal and the surrounding area. You can see several of the spots you’ve explored at this distance, mostly the forest and the lake. It’s a good spot for defense in case you’re ever attacked. Plus the water should drain from the spot easily so your cabin won’t get washed away or weakened. It’s painful to think about but this could become your permanent home. Might as well make it good.\n\n");
        this.outputText("Clearing away the site takes some time. First all the forest dander is pushed aside into a pile.  Next are the rocks. Some have to be levered out of the ground. Fortunately, there’s not many of them. It’s a lot of work, but it makes you feel good afterward.");
        this.player.changeFatigue(50);
        this.flags[kFLAGS.CAMP_CABIN_PROGRESS] = 3;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // STAGE 3 - Think of materials. Obviously, wood.
    private startThinkingOfMaterials(): void {
        this.outputText("Your site is nice and leveled now. Time to think about what you’ll make the cabin out of. The easiest thing would be wood. There isn’t a lot of fieldstone around here and there are plenty of trees. Wood would be the obvious choice.\n\n");
        // Tool check!
        if (this.player.hasKeyItem("Carpenter's Toolbox") >= 0) {
            this.outputText("Luckily, you found that carpenter’s shop in Tel’Adre and picked up a tool kit. That has an axe, an adze, and a spud, and a bunch of other tools. Everything you need to turn logs into basic beams for a cabin. It’s quite a heavy kit, but you did manage to lug it back across the desert to your campsite. You might as well put it to good use!");
        }
        else if (this.player.hasItem(this.weapons.L__AXE0) || this.player.weapon == this.weapons.L__AXE0) {
            this.outputText("Good thing you found that big axe, right? That’ll make the job easy.\n\n");
            this.outputText("Although when you think about it, an axe alone isn’t going to be enough. You’ll need at least an adze and a bark spud. Maybe there’s somewhere you can buy a toolkit with all the things you need. Tel’Adre maybe?\n\n");
        }
        else if (this.camp.followerKiha()) {
            this.outputText("Kiha has an axe, doesn’t she? Would she let you borrow it? Probably not, but she might come along to help. She’s awful attached to her axe!\n\n");
            this.outputText("Although when you think about it, an axe alone isn’t going to be enough. You’ll need at least an adze and a bark spud. Maybe there’s somewhere you can buy a toolkit with all the things you need. Tel’Adre maybe?\n\n");
        }
        else {
            this.outputText("Too bad you can’t punch down trees and shape them with your hands. You’re going to need at least an axe to get started. And a few other tools if you can find them…");
        }
        this.flags[kFLAGS.CAMP_CABIN_PROGRESS] = 4;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    private checkToolbox(): void {
        if (this.player.hasKeyItem("Carpenter's Toolbox") >= 0) {
            this.outputText("You should be able to work on your cabin as you have the toolbox. \n\n");
            this.outputText("You take out the book included in your toolbox. It's titled \"Carpenter's Guide\" and you open the book. There are hundreds of pages, most of them have illustrations on how to use tools and how to build projects. You read through the book, page by page. \n\n");
            this.dynStats("int", 1);
            this.flags[kFLAGS.CAMP_CABIN_PROGRESS] = 5;
        }
        else {
            this.outputText("You are missing a toolbox. Maybe one of the shops sell these? \n\n");
        }
        this.doNext(this.playerMenu);
    }

    private noThanks(): void {
        this.outputText("Deciding not to cut down the tree at the moment, you return to your camp. ");
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    private noThanks2(): void {
        this.outputText("Deciding not to work on your cabin right now, you return to the center of your camp.");
        this.doNext(this.playerMenu);
    }

    // STAGE 5 - Draw plans for your cabin.
    private drawCabinPlans(): void {
        this.outputText("Now that you’ve harvested some trees, you can now make some plans. You start with taking some of the inner bark of the trees you’ve harvested and pounding it flat. It makes primitive but useful paper. A chunk of charcoal from your campfire and a few moments with a blade make a nice point. Now you can draw up some plans for your cabin.\n\n");
        this.outputText("You cast your mind back to the homes in Ingnam, trying to remember all the details you can about how they looked and how they were put together. ");
        if (this.player.inte >= 60)
            this.outputText("Fortunately, your early training in carpentry hasn’t been forgotten. It only takes a brief time before you have a complete set of plans.");
        else
            this.outputText("It takes a lot of effort to make your plans. You wish you had more building experience! But, you make do from what you remember and complete your plans. Hopefully they’ll stand up over time…");
        this.flags[kFLAGS.CAMP_CABIN_PROGRESS] = 6;
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // STAGE 6 - Build cabin part 1.
    private buildCabinPart1(): void {
        // No toolbox? Access denied!
        if (this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] < 10 && !this.player.hasKeyItem("Carpenter's Toolbox")) {
            this.outputText("Without any tools and without any wood, you’ll never get this project off the ground. You’ll need both before you begin. Wood is easy to find; there’s a forest nearby. Tools may be a bit trickier...");
            this.doNext(this.playerMenu);
            return;
        }
        // Got toolbox? Proceed!
        this.outputText("You have the tools and your finished plans. Now you can finally get this cabin off the ground. The first thing you’ll need to build is a foundation and flooring. There’s enough field stone around from your clearing here to create some simple piers.\n\n");
        this.outputText("You estimate that it’s going to take around 100 nails and 50 units of wood to build your flooring. Do you wish to start now?\n\n");
        this.checkMaterials();
        if (this.player.hasKeyItem("Carpenter's Toolbox")) {
            if (this.player.keyItemv1("Carpenter's Toolbox") >= 100 && this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] >= 50) {
                this.doYesNo(this.doCabinWork1, this.noThanks2);
            }
            else {
                this.errorNotEnough();
                this.doNext(this.playerMenu);
            }
        }
        else {
            this.errorNotHave();
            this.doNext(this.playerMenu);
        }
    }

    private doCabinWork1(): void {
        this.clearOutput();
        this.outputText("You take a peek through the manual that came with the toolbox and compare its cabin plans with your own before you start.\n\n");
        if (this.player.inte >= 60) // Placeholder for carpenter perk
            this.outputText("It’s good to see that your memory didn’t fail you! Your plans should work quite nicely and the manual was a good review of the basic principles of laying a foundation.\n\n");
        else
            this.outputText("Wow… there’s a lot more to this carpentry than you thought. You spend some time making some major corrections to your foundation plan using the information in the manual.\n\n");
        this.outputText("First you lay down a foundation beam as a guideline and stack up field stone in the corners to about a foot off the ground in each corner. Then you put a stack in between each one and one in the middle. With a loud grunt you lift your hewn timbers onto the two long edges and get to work chiseling notches. ");
        // NPCs hear sounds
        if (this.camp.companionsCount() > 0) this.outputText("The sound attracts some of your companions.");
        this.outputText("\n\n");
        // NPC comments, WIP
        // if (kGAMECLASS.amilyScene.amilyFollower() && flags[kFLAGS.AMILY_FOLLOWER] == 1) outputText("\"<i>PLACEHOLDER</i>\" Amily asks. \n\n");
        this.outputText("You start to construct a wooden frame according to the instructions. Using your hammer and nails, you put the wood frame together and put it up. You then add temporary supports to ensure it doesn't fall down. You make two more frames of the same shape. Lastly, you construct one more frame, this time the frame is designed to have door and window.\n\n");
        if (this.player.hasStatusEffect(StatusEffects.CampRathazul)) this.outputText("\"<i>My, my. What are you building?</i>\" Rathazul asks. \n\n");
        if (this.player.hasStatusEffect(StatusEffects.PureCampJojo)) this.outputText(this.flags[kFLAGS.JOJO_BIMBO_STATE] >= 3 ? "\"<i>Like, what are you building? House? Fun!</i>\" Joy quips and sticks her out at you playfully. \n\n" : "\"<i>You're building something?</i>\" Jojo asks. \n\n");
        if (this.camp.marbleFollower()) this.outputText("\"<i>Sweetie, you're building a cabin? That's nice,</i>\" Marble says. \n\n");
        if (this.camp.companionsCount() > 0) this.outputText("You announce that yes, you're building a cabin.\n\n");
        // End of NPC comments
        this.outputText("Once the notches are chiseled you hammer the foundation beams together. Taking your nails, hammer, and planks, you pound in some joists between the foundation beams, then lap together flooring on top of the whole thing. The process takes all day and you’re completely worn out, but you have a pretty good start!\n\n");
        this.outputText("You might even throw your bedroll up on here tonight.\n\n");
        this.outputText("<b>You have finished building the foundation! You can now work on constructing the framing and walls.</b>\n\n");
        /*if (player.canFly() && player.str >= 80) outputText("You use your wings, lift the roof frame and carefully place it on the frame. ")
        else outputText("You construct a temporary ramp to push the roof frame into place. ");
        outputText("You then hammer nails in place to secure the roof frame.\n\n");
        outputText("<b>You have finished framing the cabin! You can work on constructing wall.</b>\n\n");
        if (camp.companionsCount() == 1) outputText("Your lone camp follower comes to see what you've been working on. They nod in approval, impressed by your handiwork.");
        else if (camp.companionsCount() > 1) outputText("Your camp followers come to see what you've built so far. Most of them are even impressed.");*/
        // Deduct resources
        this.player.addKeyValue("Carpenter's Toolbox", 1, -100);
        this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] -= 50;
        // Fatigue the player, increment flag
        this.player.changeFatigue(100);
        this.flags[kFLAGS.CAMP_CABIN_PROGRESS] = 7;

        this.doNext(this.camp.returnToCampUseEightHours);
    }

    // Stage 7 - Build cabin part 2.
    private buildCabinPart2(): void {
        this.clearOutput();
        this.outputText("Now that you have a solid foundation in place, it’s time to raise the walls and the roof. This is going to take a lot of nails, probably as much as the toolbox can carry. You’ll also need quite a bit of wood, around 75 units of it if your math is right.\n\n");
        this.outputText("You know this is going to be a long, hard day of work.\n\n");
        this.outputText("You’re going to need some paint too, for protection.\n\n");
        this.outputText("Raise walls and the roof?\n\n");
        this.checkMaterials();
        if (this.player.hasKeyItem("Carpenter's Toolbox")) {
            if (this.player.keyItemv1("Carpenter's Toolbox") >= 200 && this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] >= 75) {
                this.doYesNo(this.doCabinWork2Part1, this.noThanks2);
            }
            else {
                this.errorNotEnough();
                this.doNext(this.playerMenu);
            }
        }
        else {
            this.errorNotHave();
            this.doNext(this.playerMenu);
        }
    }

    private doCabinWork2Part1(): void {
        this.clearOutput();
        this.outputText("You spend a few minutes consulting your plans, the carpentry manual, and your own memories. The structures in Ingnam are pretty simple. No weird curves or anything. So the basic framing instructions in the book should suffice. You get to work measuring out boards, sawing them to the right length, and nailing them in the proper proportions. You take care in framing out the windows and the door and checking your geometry.\n\n");
        this.outputText("The cabin isn’t all that big, so it’s quite doable as a one-person job. But it is a lot of work. You can feel the fatigue building as you raise the walls up and nail them into place. Next come the trusses on the ends to support the central roof beam. Making them is easy, but carrying them to the top and nailing them into place is even more exhausting. At least the ridge beam is short and easy to set in place.\n\n");
        this.outputText("Next come the rafters. Easy in comparison to the rest once you figure out the right cut. Those don’t take much time at all. The sun is already starting to go down by the time you finish. The urge to continue is strong, but sleep is necessary. You drag your bedroll up to the framed cabin and sleep here for the night.");
        this.player.changeFatigue(100);
        this.doNext(this.doCabinWork2Part2);
    }

    private doCabinWork2Part2(): void {
        this.clearOutput();
        this.getGame().time.hours = 0;
        this.getGame().time.days++;
        this.player.HP = this.player.maxHP();
        this.player.fatigue = 0;
        this.outputText("As soon as dawn hits and you’ve eaten, you head right back to work. Starting with the roof, you nail stretchers across your rafters. These provide the nailing surface for your primitive roof. You carefully balance yourself on the structure to nail boards one by one across the stretchers to seal up your roof. Then you do the same for the walls. It’s definitely primitive, but it’ll work for now.\n\n");
        this.outputText("You’re glad to put down the hammer and pick up a paint brush. Painting is tedious work but it’s not nearly as stressful. By the end of the day, your cabin is looking almost finished. Just needs a good door and shutters really.\n\n");
        this.outputText("You have finished constructing the walls and roof!\n\n");
        // Deduct resources
        this.player.addKeyValue("Carpenter's Toolbox", 1, -200);
        this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] -= 75;
        // Fatigue the player, increment flag
        this.player.changeFatigue(100);
        this.flags[kFLAGS.CAMP_CABIN_PROGRESS] = 8;
        this.doNext(this.camp.returnToCampUseEightHours);
    }

    // Stage 8 - Build cabin part 3 - Install door and window.
    private buildCabinPart3(): void {
        this.clearOutput();
        this.outputText("You can continue working on your cabin. Do you start work on installing door and window for your cabin? (Cost: 100 nails and 50 wood.)\n");
        this.checkMaterials();
        if (this.player.hasKeyItem("Carpenter's Toolbox")) {
            if (this.player.keyItemv1("Carpenter's Toolbox") >= 100 && this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] >= 50) {
                this.doYesNo(this.doCabinWork3, this.noThanks2);
            }
            else {
                this.errorNotEnough();
                this.doNext(this.playerMenu);
            }
        }
        else {
            this.errorNotHave();
            this.doNext(this.playerMenu);
        }
    }

    private doCabinWork3(): void {
        this.clearOutput();
        this.player.addKeyValue("Carpenter's Toolbox", 1, -100);
        this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] -= 50;
        this.outputText("You walk back to your cabin construction site and resume working. You take out the book and flip pages until you come across instructions on how to construct a door.\n\n");
        this.outputText("Following the instructions, you construct a wooden door that comes complete with a window. You frame the doorway and install the door into place.\n\n");
        this.outputText("Next, you flip the book pages until you come across instructions on how to construct a window with functional shutters. You measure and cut the wood into the correct sizes before you nail it together into a frame. Next, you construct two shutters and install the shutters into window frame. Finally, you install the window into place.\n\n");
        this.outputText("<b>You have finished installing the door and window!</b>\n\n");
        this.flags[kFLAGS.CAMP_CABIN_PROGRESS] = 9;
        this.player.changeFatigue(100);
        this.doNext(this.camp.returnToCampUseFourHours);
    }

    // Stage 9 - Build cabin part 4 - Install flooring.
    private buildCabinPart4(): void {
        this.clearOutput();
        this.outputText("You can continue working on your cabin. Do you start work on installing flooring for your cabin? (Cost: 200 nails and 50 wood.)\n\n"); // What about adding few stones here additionaly? 50 maybe?
        this.checkMaterials();
        if (this.player.hasKeyItem("Carpenter's Toolbox")) {
            if (this.player.keyItemv1("Carpenter's Toolbox") >= 200 && this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] >= 50) {
                this.doYesNo(this.doCabinWork4, this.noThanks2);
            }
            else {
                this.errorNotEnough();
                this.doNext(this.playerMenu);
            }
        }
        else {
            this.errorNotHave();
            this.doNext(this.playerMenu);
        }
    }

    private doCabinWork4(): void {
        this.clearOutput();
        this.player.addKeyValue("Carpenter's Toolbox", 1, -200);
        this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] -= 50;
        this.outputText("You walk back to your cabin construction site and resume working. You take out the book and flip pages until you come across instructions on how to install wooden flooring.\n\n");
        this.outputText("Following the instructions, you lay some wood on the ground and measure the gap between each wood to be consistent.\n\n");
        this.outputText("Next, you lay the wood and nail them in place. This takes time and effort but by the time you've finished putting the flooring into place, your cabin has wooden flooring ready to be polished. You spend the next few hours painting and polishing your floor.\n\n");
        this.outputText("After spending time painting, you leave the floor to dry.\n\n");
        this.outputText("<b>You have finished installing the flooring!</b>\n\n");
        this.outputText("<b>Congratulations! You have finished your cabin structure! You may want to construct some furniture though.</b>\n\n");
        this.flags[kFLAGS.CAMP_CABIN_PROGRESS] = 10;
        this.flags[kFLAGS.CAMP_BUILT_CABIN] = 1;
        this.player.changeFatigue(100);
        this.doNext(this.enterCabinFirstTime);
    }

    // Stage 10 - Finished! CABIN INTERACTIONS
    public enterCabinFirstTime(): void {
        this.clearOutput();
        this.outputText("You enter your newly-constructed cabin. You are proud of what you've built. Except that your cabin is empty.\n\n");
        this.flags[kFLAGS.CAMP_BUILT_CABIN] = 1;
        this.doNext(kGAMECLASS.dungeons.cabin.enterCabin);
    }

}
