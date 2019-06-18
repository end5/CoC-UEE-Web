/**
 * Created by aimozg on 10.01.14.
 */

	export class RunedSpellblade extends WeaponWithPerk {
		
		public  RunedSpellblade() {
			this.weightCategory = Weapon.WEIGHT_MEDIUM;
			super("RSBlade", "RSBlade", "inscribed runed spellblade", "a glowing runed spellblade", "slash", 14, 2000, "Forged not by a swordsmith but a sorceress, this arcane-infused blade amplifies your magic. Unlike the wizard staves it is based on, this weapon also has a sharp edge, a technological innovation which has proven historically useful in battle. This weapon has been further enhanced and now runes glow along the blade.", "Wizard's Focus", PerkLib.WizardsFocus, 0.7, 0, 0, 0);
		}
		
	}

