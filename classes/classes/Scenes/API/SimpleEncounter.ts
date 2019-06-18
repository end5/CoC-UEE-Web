/*
 * Created by aimozg on 26.03.2017.
 */

export class SimpleEncounter implements Encounter {
	private  _weight: any;
	private  name: string;
	private  _body;
	public  SimpleEncounter(name: string,weight: any, body) {
		if (!(weight is Function) && !(weight is Number)) {
			CoC_Settings.error("Encounters.make(weight=" + (typeof weight) + ")");
			weight = 100;
		}
		this.name = name;
		this._weight = weight;
		this._body = body;
	}

	public  encounterChance(): number {
		if (_weight is Function) return _weight();
		return _weight;
	}

	public  execEncounter(): void {
	var  rslt: any = _body();
		/*if (rslt !== undefined && rslt !== undefined) {
			trace("WARNING SimpleEncounter returned "+rslt+" ("+(typeof rslt)+"), value ignored")
		}*/
	}

	public  encounterName(): string {
		return name;
	}
}

