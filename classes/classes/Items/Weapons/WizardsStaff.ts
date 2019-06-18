import { WeaponWithPerk } from "./WeaponWithPerk";
import { PerkLib } from "../../PerkLib";
import { Weapon } from "../Weapon";

/**
 * Created by aimozg on 10.01.14.
 */

export class WizardsStaff extends WeaponWithPerk {

    public constructor() {
        super("W.Staff", "W. Staff", "wizard's staff", "a wizard's staff", "smack", 3, 350, "This staff is made of very old wood and seems to tingle to the touch.  The top has an odd zig-zag shape to it, and the wood is worn smooth from lots of use.  It probably belonged to a wizard at some point and would aid magic use.", "Wizard's Focus", PerkLib.WizardsFocus, 0.4, 0, 0, 0);
        this.weightCategory = Weapon.WEIGHT_MEDIUM;
    }

    public get verb(): string {
        return this.game.player.findPerk(PerkLib.StaffChanneling) >= 0 ? "shot" : "smack";
    }
}
