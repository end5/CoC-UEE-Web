import { BaseContent } from "../../../BaseContent";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { Ghoul } from "./Ghoul";

// By Foxwells
// Ghouls! Their lore is that they look like hyenas and lure people to places and then eat them
// Apparently also they live in deserts and graveyards

export class GhoulScene extends BaseContent {

    public ghoulEncounter(): void {
        this.clearOutput();
        this.credits.authorText = "Foxwells";
        this.outputText(this.images.showImage("event-hyena"));
        this.outputText("As you wander the bizarrely unfinished zone, your eyes catch something moving. You look in its direction. It's a hyena. Not a hyena-morph, but a literal hyena. If that wasn't weird enough, you're pretty certain anything hyena would be found ");
        if (this.flags[kFLAGS.TIMES_EXPLORED_PLAINS] > 0) {
            this.outputText("at the Plains.");
        } else {
            this.outputText("elsewhere.");
        }
        this.outputText(" But it hardly matters. The hyena has spotted you and is charging at you, ruining any more contemplation. Instead, you prep yourself for a fight.");
        this.startCombat(new Ghoul());
    }

    public ghoulWon(): void {
        this.combat.cleanupAfterCombat();
        this.clearOutput();
        this.credits.authorText = "Foxwells";
        this.outputText(this.images.showImage("monster-ghoul"));
        if (this.player.HP <= 0) {
            this.outputText("You fall into the sand, your wounds too great. ");
        }
        else { // lust loss I guess
            this.outputText("You fall into the sand, your lust too overpowering. ");
        }
        this.outputText("The ghoul wastes no time and lunges forward at you. The last thing you see before you pass out is the ghoul's outstretched jaws.\n\nYou have no idea what time it is when you wake up. Bite marks and other wounds cover your body, and pain wracks you with every breath you take. The sand is red with your blood and the metallic smell makes your stomach churn, but at the very least, you don't seem to be bleeding anymore. With great effort, you heave yourself up and stagger your way back to camp.");
        this.dynStats("str", -2);
        this.dynStats("tou", -3);
        this.dynStats("sens", 3);
        this.doNext(this.camp.returnToCampUseFourHours);
    }
}
