import { BaseContent } from "../../BaseContent";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

// The secret Beta Zone, home of the cut and unfinished content.

export class BetaZone extends BaseContent {

    public betaZoneEntry(): void {
        this.clearOutput();
        this.credits.modContent = true;
        this.credits.authorText = "Kitteh6660";
        this.outputText("The bizarre zone is unlike anything you've ever experienced. Looking up, you make out the " + (this.time.hours < 20 ? "black" : "green") + " zeros and ones in Consolas covering the otherwise-" + (this.time.hours < 20 ? "white" : "black") + " sky.");
        this.outputText("\n\nWhile the grassy terrain looks normal, it appears completely flat with no signs of hills nearby. Interestingly, paths run from where you originally entered to the various points of interest.");
        this.outputText("\n\nThe nearest object that catches your attention is a large sign. A bit further but still on your left is a camp consisting of a few tents. Occasionally, the purple-skinned horned creature steps out of a large tent for a breath of fresh debug-filled air.");
        this.outputText("\n\nTo the right is a set of doors. They all look different from each other, one being of wooden, one metallic and the last one being of stone design.");
        this.outputText("\n\nFar away, you see what appears to be a subterranean-styled city under construction. Presently, the buildings appear to be constructed from seemingly-untextured colored rectangular prisms of varying sizes. A cursory glance at the sign by the unfinished city reveals the city to be named Suo'Jure when it's finished.");
        this.menu();
        this.addButton(0, "Sign", this.examineSign).hint("Examine the large sign and get the inside scoop on what this zone is all about!");
        this.addButton(1, this.flags[kFLAGS.MET_BEHEMOTH] == 0 ? "Tent" : "Behemoth", this.getGame().volcanicCrag.behemothScene.behemothIntro);
        this.addButton(2, "Ghoulish Hyena", this.getGame().desert.ghoulScene.ghoulEncounter).hint("Encounter the mysterious hyena, which you suspect is not what it seems to be.");
        this.addButtonDisabled(5, "Door 1: FC", "The elaborately-designed wooden doors are wrapped in chains and secured with a padlock. The note reads 'Under Construction' in large letters and beneath the texts read 'The church is not yet coded in the game.'", "Door 1: Fetish Church");
        this.addButton(6, "Door 2: HHC", this.getGame().dungeons.hellcomplex.enterDungeonDev).hint("The large metallic door intimidates you a bit. A note affixed on the door explains that the dungeon will be filled with hellhounds and where the Hellhound Master will lurk. It technically existed in the base game but not freely explorable.", "Door 2: Hellhound Complex");
        this.addButton(7, "Door 3: DC", this.getGame().dungeons.dragoncity.enterDungeonDev).hint("The label on the carved stone door reads 'Dragon City' and a brief summary on the note explains that the city will play a part in Ember's quest and swarming with Kobolds.", "Door 3: Dragon City");
        this.addButton(14, "Leave", this.camp.returnToCampUseOneHour);
    }

    private examineSign(): void {
        this.clearOutput();
        this.outputText("You step closer to the sign and gaze over the contents. It's lined with pictures and associated names, and beneath those are notes explaining the current status of each subject.\n\n");
        this.outputText("<b><u>Personalities</u></b>\n");
        this.outputText("<b>Ghoulish Hyena</b>\n  Status: Cut from the game and moved to Beta Zone.\n  Reason: Unfitting with the theme of the game.\n\n");
        this.outputText("<b>Behemoth</b>\n  Status: Cut from the game and moved to Beta Zone.\n  Reason: Subpar quality of writing.\n\n");
        this.outputText("<b>Corrupted Minerva</b>\n  Status: Not yet accessible.\n  Progress: Only the first few parts are coded. Coders are free to help bring this to reality.\n\n");
        this.outputText("<b>Demon Soldiers</b>\n  Status: Not yet in the game.\n  Progress: Awaiting coding once proofreading is complete.\n\n");
        this.outputText("<b><u>Locations</u></b>\n");
        this.outputText("<b>The City of Suo'jure</b>\n  Status: City under construction, not yet accessible.\n  Progress: Document still incomplete since last checking.\n\n");
        this.outputText("<b>Fetish Church</b>\n  Status: Still under construction.\n  Progress: Room layout still not coded.\n\n");
        this.outputText("<b>Hellhound Complex</b>\n  Status: Layout established, rooms still placeholder.\n  Progress: Document still not being worked on yet.\n\n");
        this.outputText("<b>Dragon City</b>\n  Status: Layout established, few placeholder rooms. No encounters yet.\n  Progress: Document still being checked. Partially complete but still missing important scenes.\n\n");
        this.outputText("<b>Mistress Elly's Prison</b>\n  Status: Accessible in debug only.\n  Progress: Still many placeholder scenes, could do with expanding.\n\n");
        this.doNext(this.betaZoneEntry);
    }

}
