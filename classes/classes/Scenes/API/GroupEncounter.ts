import { Encounter } from "./Encounter";
import { Encounters } from "./Encounters";

/**
 * Created by aimozg on 26.03.2017.
 */
export class GroupEncounter implements Encounter {
    protected components: any[]; // of Encounter
    protected name: string;
    public constructor(name: string, components: any[]) {
        this.name = name;
        this.components = [];
        for (const c of components) {
            this.add(c);
        }
    }

    public encounterName(): string {
        return name;
    }

    /**
     * Builds and adds encounters.
     * Sample usage: any build({
     *   name: "encounter1", call: function1,
     *   chance: 0.2, when: Encounters.fn.ifMinLevel(5)
     * },{
     *   name: "encounter2",
     *   call: function(): void{},
     *   chance: function(): number {}, // default 1
     *  when: function(): boolean {} // default true
     * })
     * @param defs Array of defs objects or Encounter-s.
     * @see Encounters.build
     */
    public add(...defs: any[]): GroupEncounter {
        for (const def of defs) {
            if (def instanceof Encounter) this.components.push(def);
            else this.components.push(Encounters.build(def));
        }
        return this;
    }

    public execEncounter(): void {
        // trace(Encounters.debug_indent+encounterName()+".execEncounter()");
        Encounters.debug_indent += "  ";
        Encounters.select(this.components).execEncounter();
        Encounters.debug_indent = Encounters.debug_indent.slice(2);
    }

    public encounterChance(): number {
        let sum: number = 0;
        for (const encounter of this.components) sum += encounter.encounterChance();
        return sum;
    }
}
