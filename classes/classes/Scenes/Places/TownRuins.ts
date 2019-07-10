import { BaseContent } from "../../BaseContent";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { Encounter } from "../API/Encounter";
import { CoC } from "../../CoC";
import { FnHelpers } from "../API/FnHelpers";
import { Encounters } from "../API/Encounters";
import { rand } from "../../Extra";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

/**
 * ...
 * @author ...
 */
export class TownRuins extends BaseContent {

    public rackCount(): number {
        let temp: number = 0;
        if (this.player.hasKeyItem("Equipment Rack - Armor") >= 0) temp++;
        if (this.player.hasKeyItem("Equipment Rack - Weapons") >= 0) temp++;
        if (this.player.hasKeyItem("Equipment Rack - Shields") >= 0) temp++;
        return temp;
    }

    public totalDismantled(): number {
        let temp: number = 0;
        temp += this.flags[kFLAGS.TOWN_RUINS_HOUSES_DISMANTLED];
        if (this.flags[kFLAGS.TOWN_RUINS_TOWNHALL_SCAVENGE_PROGRESS] >= 4) temp++;
        if (this.flags[kFLAGS.TOWN_RUINS_SHOP_SCAVENGE_PROGRESS] >= 4) temp++;
        return temp;
    }

    private furnitureFoundToday: string = "";

    public isDiscovered(): boolean {
        return this.flags[kFLAGS.AMILY_VILLAGE_ACCESSIBLE] > 0;
    }

    // Encounters
    // [Ruined Village]
    // [Exploring the Lake]
    public discoverAmilyVillage(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("location-townruins-path"));
        this.outputText("As you roam the shores of the lake, you find your footsteps echoing as though you were stepping on wood rather than squishing in the sandy mud of the shore. Curious, you squat down and brush the soil away, revealing the rotting form of a wooden plank. Looking carefully at the ground underfoot, you realize that it is part of a pathway - the kind that villages make to provide easier access to and from muddy rivers, lakes and beaches. You believe you can make out the rest of the path clearly enough to follow it to its end.\n\n");
        this.outputText("Do you follow the pathway?");
        this.doYesNo(this.exploreAmilyVillage, this.dontExploreAmilyVillage);
    }

    private dontExploreAmilyVillage(): void { // [No]
        this.clearOutput();
        this.outputText(this.images.showImage("location-townruins-path"));
        this.outputText("Standing up, you turn and walk away. You presume from the state of the pathway that the village at the other end must either be in dire straits, abandoned, or overwhelmed by demons. In other words, it's no safe place for a traveler like you.\n\n");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    private exploreAmilyVillage(): void { // [Yes]
        this.clearOutput();
        this.outputText(this.images.showImage("location-townruins"));
        this.outputText("You follow the overgrown path inland, away from the shore of the lake. You pass through thick trees, struggling not to lose the path, before finally reaching what is clearly the end.  In front of you lie crumbling walls, broken and scattered by the wind and rain... and by other forces entirely. Beyond them are houses that have been torn apart, burned or collapsed. This was clearly once a village, but it was devastated at some point in the past. Demon attack is the first possibility that leaps into your mind. You examine the ruins for a time, and then decide to head back to camp. You don't think it would be wise to investigate here without preparing first.\n\n");
        this.outputText("(<b>\"TownRuins\" added to Places menu.</b>)");
        this.flags[kFLAGS.AMILY_VILLAGE_ACCESSIBLE] = 1; // set village unlock flag
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    private _explorationEncounter: Encounter | undefined = undefined;
    public get explorationEncounter(): Encounter {
        const game: CoC = kGAMECLASS;
        const fn: FnHelpers = Encounters.fn;
        return this._explorationEncounter = this._explorationEncounter || Encounters.group(
            {
                name: "shouldra",
                chance: 0.5,
                when: () => {
                    return this.flags[kFLAGS.SHOULDRA_PALADIN_MAIDEN_COUNTDOWN] == 0
                        && this.rackCount() >= 2
                        && !game.shouldraFollower.followerShouldra()
                        && this.flags[kFLAGS.SHOULDRA_FOLLOWER_STATE] != .5;
                },
                call: this.getGame().shouldraScene.shouldraGreeting
            }, {
                name: "rack",
                chance: 0.2,
                when: () => {
                    return this.rackCount() < 3;
                },
                call: this.findRack
            }, {
                name: "amily",
                when: () => {
                    return this.flags[kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED] != 1;
                },
                call: game.amilyScene.encounterAmily
            }, {
                name: "scavenge",
                when: () => {
                    return this.flags[kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED] == 1;
                },
                call: this.scavengeTownRuinsOption
            }
        );
    }
    public exploreVillageRuin(): void {
        this.flags[kFLAGS.AMILY_VILLAGE_EXPLORED]++;
        this.clearOutput();
        this.explorationEncounter.execEncounter();
    }

    private findRack(): void {
        let rack: number;
        const rackArray: any[] = [];
        if (this.player.hasKeyItem("Equipment Rack - Armor") < 0) rackArray[rackArray.length] = 0;
        if (this.player.hasKeyItem("Equipment Rack - Weapons") < 0) rackArray[rackArray.length] = 1;
        if (this.player.hasKeyItem("Equipment Rack - Shields") < 0) rackArray[rackArray.length] = 2;
        rack = rackArray[rand(rackArray.length)];
        this.outputText(this.images.showImage("item-rack"));
        this.outputText("While picking through the ruined houses and abandoned structures of this dilapidated village, you manage to find something useful!  There's an intact but empty ");
        switch (rack) {
            case 0: this.outputText("armor"); break;
            case 1: this.outputText("weapon"); break;
            case 2: this.outputText("shield"); break;
            default: this.outputText("undefined");
        }
        this.outputText(" rack here.  It looks like it could hold nine different ");
        switch (rack) {
            case 0: this.outputText("armors"); break;
            case 1: this.outputText("weapons"); break;
            case 2: this.outputText("shields"); break;
            default: this.outputText("undefined");
        }
        this.outputText(".  You check it over and spot an easy way to fold it up for transport.  This would be a fine addition to your camp, so you pack it up and haul it back.");
        switch (rack) {
            case 0: this.player.createKeyItem("Equipment Rack - Armor", 0, 0, 0, 0); break;
            case 1: this.player.createKeyItem("Equipment Rack - Weapons", 0, 0, 0, 0); break;
            case 2: this.player.createKeyItem("Equipment Rack - Shields", 0, 0, 0, 0); break;
            default: this.outputText("  <b>Please let Kitteh6660 know about this bug.</b>");
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    private scavengeTownRuinsOption(): void { // SCAVENGING
        this.outputText(this.images.showImage("location-townruins"));
        if (this.flags[kFLAGS.TOWN_RUINS_SCAVENGE_CONSIDERED] == 0) {
            this.outputText("Even though the village is in ruins, there are plenty of resources to salvage; wood, stones, and nails are all there for you to haul. You contemplate which structure you should focus on salvaging for resources to bring to your camp.");
            this.flags[kFLAGS.TOWN_RUINS_SCAVENGE_CONSIDERED] = 1;
        }
        else this.outputText("Once again, you return to the ruined village, pondering which structure to salvage.");
        if (this.totalDismantled() < 12) {
            this.outputText("\n\n");
            if (this.totalDismantled() < 8) {
                this.outputText("There are burnt-down houses, smashed-in doorways, ripped-off roofs... everything is covered with dust and grime. ");
                if (this.totalDismantled() >= 1) this.outputText(TownRuins.Num2Text(this.totalDismantled()) + " of the structures " + (this.totalDismantled() == 1 ? "is" : "are") + " completely stripped, leaving only " + (this.totalDismantled() == 1 ? "its foundation" : "their foundations") + ".");
            }
            else {
                this.outputText("Most of the ruined houses are gone, leaving only foundations in their wake. ");
                if (this.totalDismantled() >= 10) this.outputText("It won’t be long until the ruined village is completely devoid of structures.");
            }
            this.menu();
            if (this.flags[kFLAGS.TOWN_RUINS_HOUSES_DISMANTLED] < 10) this.addButton(0, "House #" + this.flags[kFLAGS.TOWN_RUINS_HOUSES_DISMANTLED], this.dismantleHouse);
            else this.addButtonDisabled(0, "House", "You have already dismantled all the houses.");
            if (this.flags[kFLAGS.TOWN_RUINS_TOWNHALL_SCAVENGE_PROGRESS] < 4) this.addButton(1, "Town Hall", this.dismantleTownHall);
            else this.addButtonDisabled(1, "Town Hall", "That building is no more. It's stripped down to its foundations.");
            if (this.flags[kFLAGS.TOWN_RUINS_SHOP_SCAVENGE_PROGRESS] < 4) this.addButton(2, "Shop", this.dismantleShop);
            else this.addButtonDisabled(2, "Shop", "That building is no more. It's stripped down to its foundations.");
            this.addButton(4, "Leave", this.camp.returnToCampUseOneHour);
        }
        else this.doNext(this.camp.returnToCampUseOneHour);
    }

    private dismantleHouse(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("location-townruins-house"));
        this.outputText("A house seems like a good start. You walk over to one of the ruined houses and enter to check for any furniture to be removed.");
        if (this.flags[kFLAGS.TOWN_RUINS_HOUSE_FURNITURE_FOUND] == 0 && this.flags[kFLAGS.TOWN_RUINS_HOUSE_SCAVENGE_PROGRESS] == 0 && rand(100) < 80) this.findFurniture("house");
        this.dismantleMainText(kFLAGS.TOWN_RUINS_HOUSE_SCAVENGE_PROGRESS, "house");
    }

    private dismantleTownHall(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("location-townruins-townhall"));
        this.outputText("Your eyes land on the remains of the town hall.  Of all the broken down structures, this is the largest and it definitely might yield something of use. You enter the town hall and check for any furniture to be removed.");
        if (this.flags[kFLAGS.TOWN_RUINS_TOWNHALL_FURNITURE_FOUND] == 0 && this.flags[kFLAGS.TOWN_RUINS_TOWNHALL_SCAVENGE_PROGRESS] == 0) this.findFurniture("town hall");
        this.dismantleMainText(kFLAGS.TOWN_RUINS_TOWNHALL_SCAVENGE_PROGRESS, "town hall");
    }

    private dismantleShop(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("location-townruins-shop"));
        this.outputText("Your eyes are drawn to what was once a shop from the look of its vandalized sign. Who knows what might be inside? You enter the ruined shop and check for anything to be removed.");
        if (this.flags[kFLAGS.TOWN_RUINS_TOWNHALL_FURNITURE_FOUND] == 0 && this.flags[kFLAGS.TOWN_RUINS_TOWNHALL_SCAVENGE_PROGRESS] == 0) this.findFurniture("shop");
        this.dismantleMainText(kFLAGS.TOWN_RUINS_SHOP_SCAVENGE_PROGRESS, "shop");
    }

    private dismantleMainText(progress: number = 0, buildingDesc: string = ""): void { // Main text goes here
        let nails: number = 0;
        let wood: number = 0;
        let stones: number = 0;
        const resourceGainText: any[] = [];
        this.outputText("\n\n");
        if (this.player.hasKeyItem("Carpenter's Toolbox") < 0) { // No toolbox? Cancel!
            this.outputText("You gaze around, looking over the empty house. You could probably get something from the roof and walls, but how are you going to demolish them? With your fists? A toolbox would definitely help…");
            this.doNext(this.camp.returnToCampUseOneHour);
            return;
        }
        if (this.flags[progress] == 0) { // Have toolbox?
            this.outputText("With the interior now checked and confirmed to be empty, you set down your toolbox and open it to take out a tool belt and put it around your waist. After putting on your belt, you load it with the necessary tools. Safety first, of course! You put on your safety goggles and hard hat. Time to get started with recovering useful resources.\n\n");
            this.outputText("The roof is something you should remove first and from the looks of it, it’s pretty much just wooden frames nailed together. It’s possible that the roof once had some kind of thatch to keep the rain out. Whatever it was must have burned away, leaving the wooden frame behind. You’ll have to reach it, though.\n\n");
            if (!(this.player.isTaur() || !this.player.canFly())) {
                if (this.player.hasKeyItem("Ladder") >= 0) this.outputText("You haul over the ladder you previously constructed, lean it against the wall and give it an experimental shake to confirm the ladder is safe to climb on. ");
                else {
                    this.outputText("You haul some loose pieces of wood that look long and thick enough to be of use and cut up one of the long pieces into equal parts to be used as rungs. Next, you lay the two long pieces of wood and arrange the smaller pieces, using a measuring tape to ensure that the rungs are spaced apart evenly. ");
                    if (this.player.keyItemv1("Carpenter's Toolbox") >= 24) {
                        this.outputText("You take the nails out of your tool belt and drive them into place.");
                        this.player.addKeyValue("Carpenter's Toolbox", 1, -24);
                    }
                    else this.outputText("You realize you are short on nails but you make do by picking up any loose nails that seemed to have come off one of the destroyed sections. Once you have found a sufficient amount of nails that are in usable condition, you hammer them into place.");
                    this.outputText("\n\nTo ensure the ladder is going to be stable, you saw off the broken ends of the long wooden pieces so they are flat and place a flat piece of wood against the ends of two long pieces. You then take out a metal L-square ruler to check if it’s perfectly equal and make some adjustments as necessary. With the ladder now assembled, you prop it up against a wall and test the stability by giving it an experimental shake and adjust the angle. Yup, the ladder looks safe to climb on. ");
                    this.outputText("<b>Gained Key Item: Ladder!</b> ");
                    this.player.changeFatigue(50);
                    this.player.createKeyItem("Ladder", 0, 0, 0, 0);
                }
                this.outputText("You climb up the ladder and grab onto the roof.");
            }
            else if (this.player.canFly()) this.outputText("\n\nNothing is out of reach when you have wings that allow you to fly! You flap your wings to fly off the ground and land on the roof.");
            else if (this.player.isTaur() || this.player.isDrider()) this.outputText("\n\nIt seems that having the lower body of an animal is giving you the advantage. You rear up to get a boost to your reach, and plant your front [feet] flat against the wall for stability.");
            // Merge checks here!
            this.outputText("With the roof now in your reach, you can start with sawing the wood apart. You pull out a saw from your tool belt and work on sawing away the wooden roof frames, sorting the broken and workable pieces of wood in separate piles. With the roof successfully removed and dismantled, you take apart any remaining nailed-together wood and carefully remove the nails embedded in said wood. These nails seem good enough to be reused in your construction projects so you put them in the nail compartment of your toolbox.You bind the usable wood into a pile and finally haul it ");
            if (this.furnitureFoundToday) this.outputText("along with the newly-found " + this.furnitureFoundToday + " ");
            this.outputText("to your camp.");
            nails = 10 + rand(20) + Math.floor(rand((this.player.str + this.player.inte) / 4));
            wood = 10 + rand(10) + Math.floor(rand((this.player.str + this.player.inte) / 8));
        }
        else if (this.flags[progress] == 1) {
            this.outputText("Now that the roof has been removed, you can safely dismantle the interior walls. You pull out a hammer and chisel from your tool belt, angle the chisel against one of the walls and strike the handle, causing the plaster to break away. With the plaster broken off, you strike the exposed section and it collapses, sending out a cloud of chipped plaster and dust. Once the cloud has cleared, you chisel away the remaining section of the wall and knock it down. Next, you pull up the wooden studs from the floor and lay them neatly on the ground. You repeat the process for the rest of the interior walls. With the interior walls now removed, you comb through the heaps of debris for intact stone bricks. The process takes you an entire hour.\n\n");
            this.outputText("You pick up the stone bricks, place them in a neat pile on a pallet and tie them together along with the wooden pieces before finally hauling the newly-scavenged resources home.");
            wood = 10 + rand(10) + Math.floor(rand((this.player.str + this.player.inte) / 8));
            stones = 5 + rand(5) + Math.floor(rand((this.player.str + this.player.inte) / 20));
        }
        else if (this.flags[progress] == 2) {
            this.outputText("With the interior of the building hollow and the roof removed you can begin dismantling the frame. Taking out your hammer and chisel you begin to chip away at the mortar keeping the stone wall together, slowly weakening the structure with each strike. Once you reach the end you look back at your progress, piles of chipped mortar line the floor next to the wall. Taking one last look at it, you take a place inside the hollow structure and push the wall outwards, sending it crashing down, upon impact with the ground it breaks into debris that consists of stone and left-over mortar. Repeating this process for the other sides you get a good look at the wooden studs that have been freed from the surrounding stone; it takes " + (this.player.str < 80 ? "great" : "a bit of") + " effort, but you manage to pluck them from the ground and arrange them in a neat pile to be hauled off back to camp.");
            this.player.changeFatigue(Math.max(10, 40 - Math.floor(this.player.str / 5)));
            wood = 10 + rand(10) + Math.floor(rand((this.player.str + this.player.inte) / 8));
            stones = 5 + rand(5) + Math.floor(rand((this.player.str + this.player.inte) / 20));
        }
        else if (this.flags[progress] == 3) {
            this.outputText("With the " + buildingDesc + " now reduced to a pile of debris, you can focus on grabbing anything of use. The stone bricks are in a decent condition, even after all the trauma they could still be reclaimed for use in your construction projects. You take out your chisel and strike it with your hammer to chip away at the remaining mortar. It doesn’t take a lot of effort as the bricks easily fall apart into usable pieces. You sort the stone bricks into a neat pile on a pallet; the process taking you the better half of an hour. You tie the bricks together to secure them and take a final look at what was once a " + buildingDesc + ", now completely stripped down to the foundation. You leave behind the barren plot and haul the pile of stone bricks to your camp.");
            stones = 5 + rand(5) + Math.floor(rand((this.player.str + this.player.inte) / 12));
        }
        // Add to resources and display text.
        this.player.addKeyValue("Carpenter's Toolbox", 1, nails);
        this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] += wood;
        this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] += stones;

        if (nails > 0) resourceGainText.push("" + nails + (nails == 1 ? " nail" : " nails"));
        if (wood > 0) resourceGainText.push(wood + " wood");
        if (stones > 0) resourceGainText.push("" + stones + (stones == 1 ? " stone" : " stones"));

        if (nails + wood + stones > 0) this.outputText("\n\n<b>You have scavenged " + TownRuins.formatStringArray(resourceGainText) + "!</b>");

        this.flags[progress]++; // Increment progress and clear furniture found variable, if any.
        if (progress == 4) this.outputText("\n\n<b>The " + buildingDesc + " you had been focusing on dismantling and scavenging has been completely stripped down to the foundation.</b>");
        if (progress == kFLAGS.TOWN_RUINS_HOUSE_SCAVENGE_PROGRESS && this.flags[kFLAGS.TOWN_RUINS_HOUSES_DISMANTLED] < 10 && this.flags[progress] >= 4) {
            this.flags[progress] = 0;
            this.flags[kFLAGS.TOWN_RUINS_HOUSES_DISMANTLED]++;
            this.flags[kFLAGS.TOWN_RUINS_HOUSE_FURNITURE_FOUND] = 0;
        }
        this.furnitureFoundToday = "";
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    private findFurniture(building: string = "house"): void { // Find furniture? Lucky!
        if (this.furnitureFoundToday != "") return;
        const choice: any[] = [];
        let select: number;
        if (this.flags[kFLAGS.CAMP_CABIN_FURNITURE_BED] == 0 && building == "house") choice[choice.length] = 0;
        if (this.flags[kFLAGS.CAMP_CABIN_FURNITURE_NIGHTSTAND] == 0 && building == "house") choice[choice.length] = 1;
        if (this.flags[kFLAGS.CAMP_CABIN_FURNITURE_DRESSER] == 0 && building == "house") choice[choice.length] = 2;
        if (this.flags[kFLAGS.CAMP_CABIN_FURNITURE_TABLE] == 0) choice[choice.length] = 3;
        if (this.flags[kFLAGS.CAMP_CABIN_FURNITURE_CHAIR1] == 0 || this.flags[kFLAGS.CAMP_CABIN_FURNITURE_CHAIR2] == 0 || this.flags[kFLAGS.CAMP_CABIN_FURNITURE_DESKCHAIR]) choice[choice.length] = 4;
        if (this.flags[kFLAGS.CAMP_CABIN_FURNITURE_BOOKSHELF] == 0) choice[choice.length] = 5;
        if (this.flags[kFLAGS.CAMP_CABIN_FURNITURE_DESK] == 0) choice[choice.length] = 6;
        select = choice[rand(choice.length)];
        switch (select) {
            case 0:
                this.outputText("\n\nMoving around the debris inside of the house you find a bed! Thinking you'll finally have something other than your old sleep roll to lay on gives you a sense of hope, which is quickly shattered when you find the actual mattress. It's covered in ash and some wh... Oh that's… Well, you aren't going to sleep on that, but the bed frame itself still seems usable and untainted.");
                this.outputText("\n\nAfter carefully removing the gross mattress, the bed frame seems to be made from nicely carved wood, but durability is a factor here as well so you give it a slight kick. When the frame proves resilient and unmoving you nod to yourself in approval and begin to wonder how you’re going to lug this back to camp...");
                this.furnitureFoundToday = "bed";
                this.flags[kFLAGS.CAMP_CABIN_FURNITURE_BED] = 1;
                break;
            case 1:
                this.outputText("\n\nLooking around the interior you move a broken piece of wood and find a drawer under it that must belong to a nightstand; useless without the actual stand, though. You put it down in a corner and go back to scavenging until you find another! Two drawers for one stand. This might actually be usable if you could just find the stand… Sifting through the larger piles of debris you find something that looks to be a hollow box with a carved design around it, maybe this is it?");
                this.outputText("\n\nYou find the drawers easily and slide them in; they fit perfectly, showing off the neat design of the piece and rolling out easily. Overall it seems undamaged, what a lucky find! Now, how to get this back to camp…");
                this.furnitureFoundToday = "nightstand";
                this.flags[kFLAGS.CAMP_CABIN_FURNITURE_NIGHTSTAND] = 1;
                break;
            case 2:
                this.outputText("Looking around the interior you move a broken piece of wood and find a wide drawer under it that must belong to a dresser; useless without the actual dresser, though. You put it down in a corner and go back to scavenging until you find another! And another. And yet another. Four drawers for one dresser. This might actually be usable if you could just find the stand… Sifting through the larger piles of debris you find something that looks to be a wide hollow box with a carved design around it, maybe this is it?");
                this.outputText("\n\nYou find the drawers easily and slide them in; they fit perfectly, showing off the neat design of the piece and rolling out easily. There are no missing drawers. Overall it seems undamaged, what a lucky find! Now, how to get this back to camp…");
                this.furnitureFoundToday = "dresser";
                this.flags[kFLAGS.CAMP_CABIN_FURNITURE_DRESSER] = 1;
                break;
            case 3:
                this.outputText("\n\nThere is a table that’s surprisingly intact. It looks large enough to be accompanied by two chairs but none are seen within the vicinity. Giving the table an experimental shake you confirm that the table is stable and in usable condition.");
                this.furnitureFoundToday = "table";
                this.flags[kFLAGS.CAMP_CABIN_FURNITURE_TABLE] = 1;
                break;
            case 4:
                this.outputText("\n\nYou find a toppled over chair amidst the debris of the house; it’s finely carved from wood, and doesn't look too damaged. You give it an experimental sit to test its stability. The chair withstands the test and seems to have kept its strength through the wear of time.");
                this.furnitureFoundToday = "chair";
                if (this.flags[kFLAGS.CAMP_CABIN_FURNITURE_CHAIR2] > 0) this.flags[kFLAGS.CAMP_CABIN_FURNITURE_DESKCHAIR] = 1;
                else if (this.flags[kFLAGS.CAMP_CABIN_FURNITURE_CHAIR1] > 0) this.flags[kFLAGS.CAMP_CABIN_FURNITURE_CHAIR2] = 1;
                else this.flags[kFLAGS.CAMP_CABIN_FURNITURE_CHAIR1] = 1;
                break;
            case 5:
                this.outputText("\n\nMoving some debris from a wall something topples over and nearly catches you under it! You manage to step back before it falls and see it's a bookshelf. It seems surprisingly intact, although not as much can be said for the few books that lay within it, all but one charred by fire. With an air of curiosity, you pick up and open it, flipping through the pages that are... stained with demon spunk. Is nothing sacred? You haul up the bookshelf and roughly shake out the contents, spilling them to mix with the debris already filling the room. You move the bookcase outside and take a good look at it. It's hand carved and made of durable wood, as your rough handling proved earlier.");
                this.outputText("\n\nNow that you think of it, you could always use a bookshelf back at camp...");
                this.furnitureFoundToday = "bookshelf";
                this.flags[kFLAGS.CAMP_CABIN_FURNITURE_BOOKSHELF] = 1;
                break;
            case 6:
                this.outputText("\n\nWhile you're moving a particularly large bit of debris you notice it's actually a desk, and a rather nice one at that! Quickly checking it over, it looks finely carved and made of sturdy wood, and a few knocks in certain areas confirms it. This desk is still in pretty good condition and could be used at your camp, now it's just a matter of how to get it there…");
                this.furnitureFoundToday = "desk";
                this.flags[kFLAGS.CAMP_CABIN_FURNITURE_DESK] = 1;
                break;
            default:
                this.outputText("\n\nYou continue to search thoroughly but despite that, you fail to find anything useful."); // Failsafe
                this.furnitureFoundToday = "undefined";
        }
        if (this.furnitureFoundToday != "undefined") {
            this.outputText("\n\n");
            if (this.flags[kFLAGS.CAMP_CABIN_PROGRESS] >= 10) this.outputText("This would be a great addition to your cabin. ");
            this.outputText("You haul the " + this.furnitureFoundToday + " outside the " + building + ", sitting it down in sight but away from the " + building + ". Ready to be hauled back to camp when you're done here.");
        }
    }
}
