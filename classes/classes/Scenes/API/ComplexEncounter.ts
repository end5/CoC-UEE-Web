/**
 * Created by aimozg on 26.03.2017.
 */
export class ComplexEncounter extends GroupEncounter {
	private  _chance: any;

	/**
	 * @param chance Number, Boolean, or function() returning Number|Boolean,
	 * @param components Array of Encounter-s
	 */
	public  ComplexEncounter(name: string,chance: any,components: any[]) {
		super(name,components);
		this._chance = chance;
	}

	public  encounterChance(): number {
		return Encounters.convertChance(_chance);
	}

}

