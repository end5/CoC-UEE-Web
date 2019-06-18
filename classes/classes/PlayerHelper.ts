
	/**
	 * This contains some of the helper methods for the player-object I've written
	 * @since June 29, 2016
	 * @author Stadler76
	 */
	export class PlayerHelper extends Character 
	{
		public  PlayerHelper() {}

		public  hasDifferentUnderBody(): boolean
		{
			if ([UnderBody.NONE, UnderBody.NAGA].indexOf(underBody.type) != -1)
				return false;

			/* // Example for later use
			if ([UNDER_BODY_TYPE_MERMAID, UNDER_BODY_TYPE_WHATEVER].indexOf(underBody.type) != -1)
				return false; // The underBody is (mis)used for secondary skin, not for the underBody itself
			*/

			return underBody.skin.type != skin.type || underBody.skin.tone != skin.tone ||
			       underBody.skin.adj  != skin.adj  || underBody.skin.desc != skin.desc ||
			       (underBody.skin.hasFur() && hasFur() && underBody.skin.furColor != skin.furColor);
		}

		public  hasUnderBody(noSnakes: boolean = false): boolean
		{
		var  normalUnderBodies: any[] = [UnderBody.NONE];

			if (noSnakes) {
				normalUnderBodies.push(UnderBody.NAGA);
			}

			return normalUnderBodies.indexOf(underBody.type) == -1;
		}

		public  hasFurryUnderBody(noSnakes: boolean = false): boolean
		{
			return hasUnderBody(noSnakes) && underBody.skin.hasFur();
		}

		public  hasFeatheredUnderBody(noSnakes: boolean = false): boolean
		{
			return hasUnderBody(noSnakes) && underBody.skin.hasFeathers();
		}

		public  hasDragonHorns(fourHorns: boolean = false): boolean
		{
			return (!fourHorns && horns.value > 0 && horns.type == Horns.DRACONIC_X2) || horns.type == Horns.DRACONIC_X4_12_INCH_LONG;
		}

		public  hasReptileEyes(): boolean
		{
			return [Eyes.LIZARD, Eyes.DRAGON, Eyes.BASILISK].indexOf(eyes.type) != -1;
		}

		public  hasLizardEyes(): boolean
		{
			return [Eyes.LIZARD, Eyes.BASILISK].indexOf(eyes.type) != -1;
		}

		public  hasReptileFace(): boolean
		{
			return [Face.SNAKE_FANGS, Face.LIZARD, Face.DRAGON].indexOf(face.type) != -1;
		}

		public  hasReptileUnderBody(withSnakes: boolean = false): boolean
		{
		var  underBodies: any[] = [
				UnderBody.REPTILE,
			];

			if (withSnakes) {
				underBodies.push(UnderBody.NAGA);
			}

			return underBodies.indexOf(underBody.type) != -1;
		}

		public  hasCockatriceSkin(): boolean
		{
			return skin.type == Skin.LIZARD_SCALES && underBody.type == UnderBody.COCKATRICE;
		}

		public  hasNonCockatriceAntennae(): boolean
		{
			return [Antennae.NONE, Antennae.COCKATRICE].indexOf(antennae.type) === -1;
		}

		public  hasInsectAntennae(): boolean
		{
			return antennae.type === Antennae.BEE;
		}

		public  hasDragonWings(large: boolean = false): boolean
		{
			if (large)
				return wings.type == Wings.DRACONIC_LARGE;
			else
				return [Wings.DRACONIC_SMALL, Wings.DRACONIC_LARGE].indexOf(wings.type) != -1;
		}

		public  hasBatLikeWings(large: boolean = false): boolean
		{
			if (large)
				return wings.type == Wings.BAT_LIKE_LARGE;
			else
				return [Wings.BAT_LIKE_TINY, Wings.BAT_LIKE_LARGE].indexOf(wings.type) != -1;
		}

		public  hasLeatheryWings(large: boolean = false): boolean
		{
			return hasDragonWings(large) || hasBatLikeWings(large);
		}

		// To be honest: I seriously considered naming it drDragonCox() :D
		public  dragonCocks(): number
		{
			return countCocksOfType(CockTypesEnum.DRAGON);
		}

		public  lizardCocks(): number
		{
			return countCocksOfType(CockTypesEnum.LIZARD);
		}

		public  hasDragonfire(): boolean
		{
			return findPerk(PerkLib.Dragonfire) >= 0;
		}

		public  hasDragonWingsAndFire(largeWings: boolean = true): boolean
		{
			return hasDragonWings(largeWings) && hasDragonfire();
		}

		public  isBasilisk(): boolean
		{
			return game.bazaar.benoit.benoitBigFamily() && eyes.type == Eyes.BASILISK;
		}

		public  hasReptileTail(): boolean
		{
			return [Tail.LIZARD, Tail.DRACONIC, Tail.SALAMANDER].indexOf(tail.type) != -1;
		}

		public  hasMultiTails(): boolean
		{
			return (tail.type === Tail.FOX && tail.venom > 1);
		}

		// For reptiles with predator arms I recommend to require hasReptileScales() before doing the armType TF to Arms.PREDATOR
		public  hasReptileArms(): boolean
		{
			return arms.type == Arms.SALAMANDER || (arms.type == Arms.PREDATOR && hasReptileScales());
		}

		public  hasReptileLegs(): boolean
		{
			return [LowerBody.LIZARD, LowerBody.DRAGON, LowerBody.SALAMANDER].indexOf(lowerBody.type) != -1;
		}

		public  hasDraconicBackSide(): boolean
		{
			return hasDragonWings(true) && hasDragonScales() && hasReptileTail() && hasReptileArms() && hasReptileLegs();
		}

		public  hasDragonNeck(): boolean
		{
			return neck.type == Neck.DRACONIC && neck.isFullyGrown();
		}

		public  hasNormalNeck(): boolean
		{
			return neck.len <= 2;
		}

		public  hasDragonRearBody(): boolean
		{
			return [RearBody.DRACONIC_MANE, RearBody.DRACONIC_SPIKES].indexOf(rearBody.type) != -1;
		}

		public  hasNonSharkRearBody(): boolean
		{
			return [RearBody.NONE, RearBody.SHARK_FIN].indexOf(rearBody.type) == -1;
		}

		public  fetchEmberRearBody(): number
		{
			return flags[kFLAGS.EMBER_HAIR] == 2 ? RearBody.DRACONIC_MANE : RearBody.DRACONIC_SPIKES;
		}

		public  featheryHairPinEquipped(): boolean
		{
			return hasKeyItem("Feathery hair-pin") >= 0 && keyItemv1("Feathery hair-pin") == 1;
		}
	}

