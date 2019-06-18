/**
 * Created by aimozg on 22.05.2017.
 */


export class PerkTree extends BaseContent {
	private  pdata:Dictionary = new Dictionary();

	public  PerkTree() {
	var  library:Dictionary = PerkType.getPerkLibrary();
	var  perk:PerkType;
		for each(perk in library) {
			//var perk:PerkType = library[k];
			pdata[perk.id] = {
				perk   : perk,
				ctxt   : perk.allRequirementDesc(),
				unlocks: []
			};
		}
		for each(perk in library) {
			for each (var c: Record<string, any> in perk.requirements) {
				switch (c.type) {
					case "perk":
					var  p2:PerkType = c.perk;
						pdata[p2.id].unlocks.push(perk);
						break;
					case "anyperk":
					var  ps: any[] = c.perks;
						for each(p2 in ps) pdata[p2.id].unlocks.push(perk);
						break;
					default: //Move along
				}
			}
		}
		/*for each(var pd: Record<string, any> in pdata) {
		var  s: any[] = [];
			for each (perk in pd.unlocks) s.push(perk.name);
			if (s.length>0 || pd.ctxt) trace("Perk " + pd.perk.name + (pd.ctxt ? "; requires " + pd.ctxt : "") + (s.length > 0 ? "; unlocks " + s.join(", ") : ""));
		}*/
	}
	/**
	 * Returns Array of PerkType
	 */
	public  listUnlocks(p:PerkType): any[] {
		return pdata[p.id].unlocks;
	}
	/**
	 * Returns Array of PerkType
	 */
	public static  obtainablePerks(): any[] {
	var  rslt: any[]=[];
		for each(var perk:PerkType in PerkType.getPerkLibrary()) {
			if (perk.requirements.length > 0) {
				rslt.push(perk);
			}
		}
		return rslt.sortOn("name");
	}
	/**
	 * Returns Array of PerkType
	 */
	public static  availablePerks(player:Player): any[] {
		return obtainablePerks().filter(
			function  (perk:PerkType,idx: number,array: any[]): boolean {
					return !player.hasPerk(perk) && perk.available(player);
				});
	}
}

