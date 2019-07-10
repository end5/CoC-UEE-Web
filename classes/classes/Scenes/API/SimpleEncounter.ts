import { Encounter } from "./Encounter";
import { CoC_Settings } from "../../CoC_Settings";

/*
 * Created by aimozg on 26.03.2017.
 */

export class SimpleEncounter implements Encounter {
    private _weight: any;
    private name: string;
    private _body: any;
    public constructor(name: string, weight: any, body: any) {
        if (!(typeof weight === 'function') && !(typeof weight === 'number')) {
            CoC_Settings.error("Encounters.make(weight=" + (typeof weight) + ")");
            weight = 100;
        }
        this.name = name;
        this._weight = weight;
        this._body = body;
    }

    public encounterChance(): number {
        if (typeof this._weight === 'function') return this._weight();
        return this._weight;
    }

    public execEncounter(): void {
        const rslt: any = this._body();
        /*if (rslt !== undefined && rslt !== undefined) {
            trace("WARNING SimpleEncounter returned "+rslt+" ("+(typeof rslt)+"), value ignored")
        }*/
    }

    public encounterName(): string {
        return name;
    }
}
