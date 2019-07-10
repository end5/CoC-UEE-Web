import { Encounter } from "./Encounter";

/**
 * Created by aimozg on 01.04.2017.
 */

/**
 * A lazily initialized (on first access) Encounter wrapper
 */
export class LateinitEncounter implements Encounter {

    protected _proxied: Encounter | undefined = undefined;
    protected scope: Record<string, any> | undefined = undefined;
    protected get proxied(): Encounter {
        return this._proxied = this._proxied || this.createEncounter.apply(this.scope);
    }
    protected createEncounter: any;

    public encounterChance(): number {
        return this.proxied.encounterChance();
    }

    public execEncounter(): void {
        this.proxied.execEncounter();
    }

    public encounterName(): string {
        return this.proxied.encounterName();
    }

    /**
     *
     * @param scope: A "this" object that is implicitly or explicitly used in function
     * @param createEncounterFn: A function that constructs an Encounter.
     */
    public constructor(scope: Record<string, any>, createEncounterFn: any) {
        this.createEncounter = createEncounterFn;
        this.scope = scope;
    }
}
