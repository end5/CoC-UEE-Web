/**
 * Created by aimozg on 10.01.14.
 */

	export class RaphaelsRapier extends Weapon {
		
		public  RaphaelsRapier() {
			this.weightCategory = Weapon.WEIGHT_LIGHT;
			super("RRapier", "RRapier", "vulpine rapier", "Raphael's vulpine rapier", "slash", 8, 1000, "He's bound it with his red sash around the length like a ribbon, as though he has now gifted it to you.  Perhaps it is his way of congratulating you.");
		}
		
		public  get attack(): number {
		var  boost: number = 0;
			if (kGAMECLASS.flags[kFLAGS.RAPHAEL_RAPIER_TRANING] < 2) boost += kGAMECLASS.flags[kFLAGS.RAPHAEL_RAPIER_TRANING] * 2;
			else boost += 4 + (kGAMECLASS.flags[kFLAGS.RAPHAEL_RAPIER_TRANING] - 2);
			return (8 + boost); 
		}
	}

