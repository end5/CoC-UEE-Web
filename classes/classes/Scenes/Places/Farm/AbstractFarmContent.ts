/**
 * Created by aimozg on 08.01.14.
 */

	export class AbstractFarmContent extends BaseContent
	{
		public  AbstractFarmContent()
		{
		}
		protected  get farm():Farm {
			return kGAMECLASS.farm;
		}

	}

