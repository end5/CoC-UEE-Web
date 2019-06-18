/**
 * Created by aimozg on 27.01.14.
 */

	export class SpellcastingAffinityPerk extends PerkType
	{

		public  desc(params:Perk = undefined): string
		{
			return "Reduces spell costs by " + params.value1 + "%.";
		}

		public  SpellcastingAffinityPerk()
		{
			super("Spellcasting Affinity","Spellcasting Affinity", "Reduces spell costs.");
		}
	}

