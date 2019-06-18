/**
 * Created by aimozg on 10.01.14.
 */

	export class LethiciteStaff extends WeaponWithPerk {
		
		public  LethiciteStaff() {
			this.weightCategory = Weapon.WEIGHT_MEDIUM;
			super("L.Staff", "Lthc. Staff", "lethicite staff", "a lethicite staff", "smack", 14, 1337, "This staff is made of a dark material and seems to tingle to the touch. The top consists of a glowing lethicite orb. Somehow you know this will greatly empower your spellcasting abilities.", "Wizard's Focus", PerkLib.WizardsFocus, 0.8, 0, 0, 0);
		}
		
		public  get verb(): string { 
			return game.player.findPerk(PerkLib.StaffChanneling) >= 0 ? "shot" : "smack"; 
		}
		
		public  playerEquip():Weapon {
			while (game.player.findPerk(PerkLib.WizardsFocus) >= 0) game.player.removePerk(PerkLib.WizardsFocus);
			game.player.createPerk(PerkLib.WizardsFocus, 0.8, 0, 0, 0);
			return super.playerEquip();
		}
		
		public  playerRemove():Weapon {
			while (game.player.findPerk(PerkLib.WizardsFocus) >= 0) game.player.removePerk(PerkLib.WizardsFocus);
			return super.playerRemove();
		}
		
	}

