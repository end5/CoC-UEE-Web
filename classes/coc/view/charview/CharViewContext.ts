/**
 * Coded by aimozg on 27.08.2017.
 */


/**
 * Evaluation context
 */
export class CharViewContext extends ExecContext {
	private  charview:CharView;
	public  CharViewContext(charview:CharView, character: any) {
		this.charview = charview;
		pushScope(character);
		// Globals used in model.xml
		pushScope({
			Antennae : Antennae,
			Arms     : Arms,
			Beard    : Beard,
			BreastCup: BreastCup,
			Butt     : Butt,
			Claws    : Claws,
			Ears     : Ears,
			Eyes     : Eyes,
			Face     : Face,
			Gender   : Gender,
			Gills    : Gills,
			Hair     : Hair,
			Hips     : Hips,
			Horns    : Horns,
			LowerBody: LowerBody,
			Neck     : Neck,
			Pattern  : Pattern,
			Piercing : Piercing,
			RearBody : RearBody,
			Skin     : Skin,
			Tail     : Tail,
			Tongue   : Tongue,
			UnderBody: UnderBody,
			Wings    : Wings
		});
		// Intermod compatibility layer
		// - objects not present in character but required in model.xml scripts should be listed here
	var  creature:Creature = character as Creature;
		if (creature) {
			pushScope({
				hairLength: creature.hair.length,
				hairType: creature.hair.type,
				faceType: creature.face.type,
				lowerBody: creature.lowerBody.type,
				legCount: creature.lowerBody.legCount,
				tailType: creature.tail.type,
				tailCount: creature.tail.venom,
				skin: {
					type: creature.skin.type,
					base: {
						type: creature.skin.type,
						pattern: 0
					},
					coat: {
						type: creature.skin.type,
						pattern: 0
					}
				},
				hasPartialCoat: function(): boolean {
					return false;
				},
				hasPartialCoatOfType: function(...types): boolean {
					return false;
				},
				hasFullCoatOfType: function(...types): boolean {
					return types.indexOf(creature.skin.type) >= 0;
				}
			});
		}
	}
}
}

// EJ compatibility layer
class Pattern {
	public static  NONE: number                    = 0;
	public static  MAGICAL_TATTOO: number          = 1;
	public static  ORCA_UNDERBODY: number          = 2;
	public static  BEE_STRIPES: number             = 3;
	public static  TIGER_STRIPES: number           = 4;
	public static  BATTLE_TATTOO: number           = 5;
	public static  SPOTTED: number                 = 6;
	public static  LIGHTNING_SHAPED_TATTOO: number = 7;
