/**
 * Created by aimozg on 01.04.2017.
 */

/**
 * A lazily initialized (on first access) Encounter wrapper
 */
export class LateinitEncounter implements Encounter {

	protected  _proxied:Encounter = undefined;
	protected  scope: Record<string, any> = undefined;
	protected  get proxied():Encounter {
		return _proxied ||= createEncounter.apply(scope);
	}
	protected  createEncounter;

	public  encounterChance(): number {
		return proxied.encounterChance();
	}

	public  execEncounter(): void {
		proxied.execEncounter();
	}

	public  encounterName(): string {
		return proxied.encounterName();
	}

	/**
	 *
	 * @param scope: A "this" object that is implicitly or explicitly used in function
	 * @param createEncounterFn: A function that constructs an Encounter.
	 */
	public  LateinitEncounter(scope: Record<string, any>,createEncounterFn) {
		this.createEncounter = createEncounterFn;
		this.scope = scope;
	}
}

