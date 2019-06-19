import { Tongue } from "../BodyParts/Tongue";
import { Wings } from "../BodyParts/Wings";
import { Face } from "../BodyParts/Face";
import { Tail } from "../BodyParts/Tail";

/**
 * Class for BodyPart lists
 * @since August 08, 2017
 * @author Stadler76
 */
export class BodyPartLists {
    /**
     * Echidna 1 ft long (i'd consider it barely qualifying), demonic 2 ft long, draconic 4 ft long
     */
    public static LONG_TONGUES = [
        Tongue.DEMONIC,
        Tongue.DRACONIC,
        Tongue.ECHIDNA,
    ];

    public static CAN_FLY_WINGS = [
        Wings.BEE_LIKE_LARGE,
        Wings.BAT_LIKE_LARGE,
        Wings.FEATHERED_LARGE,
        Wings.DRACONIC_LARGE,
        Wings.GIANT_DRAGONFLY,
        Wings.IMP_LARGE,
        Wings.HARPY,
    ];

    public static MUZZLES = [
        Face.HORSE,
        Face.DOG,
        Face.CAT,
        Face.LIZARD,
        Face.KANGAROO,
        Face.FOX,
        Face.DRAGON,
        Face.RHINO,
        Face.ECHIDNA,
        Face.DEER,
        Face.WOLF,
        Face.RED_PANDA,
    ];

    public static HUMANISH_FACES = [
        Face.HUMAN,
        Face.SHARK_TEETH,
        Face.SNAKE_FANGS,
        Face.SPIDER_FANGS,
    ];

    public static LONG_TAILS = [
        Tail.DOG,
        Tail.DEMONIC,
        Tail.COW,
        Tail.SHARK,
        Tail.CAT,
        Tail.LIZARD,
        Tail.KANGAROO,
        Tail.FOX,
        Tail.DRACONIC,
        Tail.RACCOON,
        Tail.MOUSE,
        Tail.FERRET,
        Tail.BEHEMOTH,
        Tail.SCORPION,
        Tail.SALAMANDER,
        Tail.WOLF,
        Tail.IMP,
        Tail.COCKATRICE,
        Tail.RED_PANDA,
    ];
}
