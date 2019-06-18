import { WeaponWithPerk } from "./WeaponWithPerk";
import { PerkLib } from "../../PerkLib";
import { Weapon } from "../Weapon";

/**
 * Created by aimozg on 10.01.14.
 */

export class LethiciteStaff extends WeaponWithPerk {

    public constructor() {
        super("L.Staff", "Lthc. Staff", "lethicite staff", "a lethicite staff", "smack", 14, 1337, "This staff is made of a dark material and seems to tingle to the touch. The top consists of a glowing lethicite orb. Somehow you know this will greatly empower your spellcasting abilities.", "Wizard's Focus", PerkLib.WizardsFocus, 0.8, 0, 0, 0);
        this.weightCategory = Weapon.WEIGHT_MEDIUM;
    }

    public get verb(): string {
        return this.game.player.findPerk(PerkLib.StaffChanneling) >= 0 ? "shot" : "smack";
    }

    public playerEquip(): Weapon {
        while (this.game.player.findPerk(PerkLib.WizardsFocus) >= 0) this.game.player.removePerk(PerkLib.WizardsFocus);
        this.game.player.createPerk(PerkLib.WizardsFocus, 0.8, 0, 0, 0);
        return super.playerEquip();
    }

    public playerRemove() {
        while (this.game.player.findPerk(PerkLib.WizardsFocus) >= 0) this.game.player.removePerk(PerkLib.WizardsFocus);
        return super.playerRemove();
    }

}
