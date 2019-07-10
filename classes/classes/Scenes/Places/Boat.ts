import { AbstractLakeContent } from "../Areas/Lake/AbstractLakeContent";
import { SharkGirlScene } from "./Boat/SharkGirlScene";
import { MaraeScene } from "./Boat/MaraeScene";
import { StatusEffects } from "../../StatusEffects";
import { Encounter } from "../API/Encounter";
import { Encounters } from "../API/Encounters";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { FnHelpers } from "../API/FnHelpers";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

/**
 * Created by aimozg on 06.01.14.
 */

export class Boat extends AbstractLakeContent {
    public sharkGirlScene: SharkGirlScene = new SharkGirlScene();
    public marae: MaraeScene = new MaraeScene();

    public isDiscovered(): boolean {
        return this.player.hasStatusEffect(StatusEffects.BoatDiscovery);
    }

    public discoverBoat(): void {
        this.clearOutput();
        this.player.createStatusEffect(StatusEffects.BoatDiscovery, 0, 0, 0, 0);
        this.outputText("You journey around the lake, seeking demons to fight");
        if (this.player.cor > 60) this.outputText(" or fuck");
        this.outputText(".  The air is fresh, and the grass is cool and soft under your feet.   Soft waves lap against the muddy sand of the lake-shore, as if radiating outward from the lake.   You pass around a few bushes carefully, being wary of hidden 'surprises', and come upon a small dock.  The dock is crafted from old growth trees lashed together with some crude rope.  Judging by the appearance of the rope, it is very old and has not been seen to in quite some time.  Tied to the dock is a small rowboat, only about seven feet long and three feet wide.   The boat appears in much better condition than the dock, and appears to be brand new.\n\n");
        this.outputText("<b>You have discovered the lake boat!</b>\n(You may return and use the boat to explore the lake's interior by using the 'places' menu.)");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    private _explorationEncounter: Encounter | undefined = undefined;
    public get explorationEncounter(): Encounter {
        return this._explorationEncounter = this._explorationEncounter || Encounters.group(kGAMECLASS.commonEncounters,
            {
                name: "izmakids",
                chance: 0.1,
                when: () => {
                    return this.flags[kFLAGS.IZMA_KIDS_IN_WILD] > 0 && kGAMECLASS.izmaScene.izmaFollower();
                },
                call: kGAMECLASS.izmaScene.findLostIzmaKids
            }, this.marae.encounterObject, {
                name: "nothing",
                call: this.nothingSpecial
            }, {
                name: "sharkgirl",
                call: Boat.curry(this.sharkGirlScene.sharkGirlEncounter, 1)
            }, {
                name: "zealot",
                chance: 0.5,
                mods: [FnHelpers.FN.ifLevelMin(2)],
                when: () => {
                    return this.flags[kFLAGS.FACTORY_SHUTDOWN] > 0;
                },
                call: this.lake.fetishZealotScene.zealotBoat
            }, {
                name: "anemone",
                call: kGAMECLASS.anemoneScene.mortalAnemoneeeeee
            });
    }

    public boatExplore(): void {
        // XXX: This is supposed to be displayed for all encounters except Fetish Zealot. I guess new system doesn't allow this without putting it to every other encounter. Or removing clearOutput() from them.
        this.clearOutput();
        this.player.addStatusValue(StatusEffects.BoatDiscovery, 1, 1);
        this.outputText("You reach the dock without any incident and board the small rowboat.  The water is calm and placid, perfect for rowing.  ");
        if (this.flags[kFLAGS.FACTORY_SHUTDOWN] == 2) {
            this.outputText("The water appears somewhat muddy and has a faint pungent odor.  ");
            if (this.player.inte > 40) this.outputText("You realize what it smells like – sex.  ");
        }
        this.outputText("You set out, wondering if you'll find any strange islands or creatures in the lake.\n\n");

        this.explorationEncounter.execEncounter();
    }

    private nothingSpecial(): void {
        this.outputText(this.images.showImage("location-boat"));
        if (Boat.rand(2) == 0) {
            this.outputText("You row for nearly an hour, until your arms practically burn with exhaustion from all the rowing.");
        } else {
            this.outputText("You give up on finding anything interesting, and decide to go check up on your camp.");
        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }
}
