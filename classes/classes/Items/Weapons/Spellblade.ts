/**
 * Created by aimozg on 10.01.14.
 */

	export class Spellblade extends WeaponWithPerk {
		
		public  Spellblade() {
			this.weightCategory = Weapon.WEIGHT_MEDIUM;
			super("S.Blade", "S.Blade", "inscribed spellblade", "a spellblade", "slash", 8, 500, "Forged not by a swordsmith but a sorceress, this arcane-infused blade amplifies your magic.  Unlike the wizard staves it is based on, this weapon also has a sharp edge, a technological innovation which has proven historically useful in battle.", "Wizard's Focus", PerkLib.WizardsFocus, 0.5, 0, 0, 0);
		}
		
	}

