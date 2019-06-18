/**
 * Created by aimozg on 10.01.14.
 */

	export class JeweledRapier extends Weapon {
		
		public  JeweledRapier() {
			this.weightCategory = Weapon.WEIGHT_LIGHT;
			super("JRapier", "JRapier", "jeweled rapier", "a jeweled rapier", "slash", 13, 1400, "This jeweled rapier is ancient but untarnished.  The hilt is wonderfully made, and fits your hand like a tailored glove.  The blade is shiny and perfectly designed for stabbing.");
		}
		
		public  get attack(): number {
		var  boost: number = 0;
			if (kGAMECLASS.flags[kFLAGS.RAPHAEL_RAPIER_TRANING] < 2) boost += kGAMECLASS.flags[kFLAGS.RAPHAEL_RAPIER_TRANING] * 2;
			else boost += 4 + (kGAMECLASS.flags[kFLAGS.RAPHAEL_RAPIER_TRANING] - 2);
			return (13 + boost); 
		}
	}

