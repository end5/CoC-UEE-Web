import { Weapon } from "../Weapon";

export class FlintlockPistol extends Weapon {
    public constructor(tier: number) {
        const ids = ["Flintlk", "Flntlk1", "Flntlk2"];
        const eqptNames = ["flintlock pistol", "fine flintlock pistol", "masterwork flintlock pistol"];
        const longNames = ["a flintlock pistol", "a fine flintlock pistol", "a masterwork flintlock pistol"];
        super(ids[tier], "Flintlock", eqptNames[tier], longNames[tier], "shot", 14, 250, "A flintlock pistol. Pew pew pew. Can fire once before a reload is required and Speed has a factor in damage instead of Strength.", Weapon.PERK_RANGED);
        this.weightCategory = Weapon.WEIGHT_LIGHT;
        this.tier = tier;
    }

}
