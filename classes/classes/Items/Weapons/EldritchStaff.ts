import { WeaponWithPerk } from "./WeaponWithPerk";
import { PerkLib } from "../../PerkLib";
import { Weapon } from "../Weapon";

/**
 * Created by aimozg on 10.01.14.
 */

export class EldritchStaff extends WeaponWithPerk {

    public constructor() {
        super("E.Staff", "E.Staff", "eldritch staff", "an eldritch staff", "thwack", 10, 1000, "This eldritch staff once belonged to the Harpy Queen, who was killed after her defeat at your hands.  It fairly sizzles with magical power.", "Wizard's Focus", PerkLib.WizardsFocus, 0.6, 0, 0, 0);
        this.weightCategory = Weapon.WEIGHT_MEDIUM;
    }

    public get verb(): string {
        return this.game.player.findPerk(PerkLib.StaffChanneling) >= 0 ? "shot" : "thwack";
    }
}
