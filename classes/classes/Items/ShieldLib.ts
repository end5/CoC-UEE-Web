import { Nothing } from "./Shields/Nothing";
import { WoodenShield } from "./Shields/WoodenShield";
import { Buckler } from "./Shields/Buckler";
import { GreatShield } from "./Shields/GreatShield";
import { KiteShield } from "./Shields/KiteShield";
import { TowerShield } from "./Shields/TowerShield";
import { DragonShellShield } from "./Shields/DragonShellShield";

/**
 * ...
 * @author Kitteh6660
 */

export class ShieldLib {
    public static DEFAULT_VALUE: number = 6;

    public static NOTHING = new Nothing();

    // Regular Shields
    public WOODSHL = new WoodenShield();

    public BUCKLR0 = new Buckler(0);
    public BUCKLR1 = new Buckler(1);
    public BUCKLR2 = new Buckler(2);

    public GRTSHL0 = new GreatShield(0);
    public GRTSHL1 = new GreatShield(1);
    public GRTSHL2 = new GreatShield(2);

    public KITESH0 = new KiteShield(0);
    public KITESH1 = new KiteShield(1);
    public KITESH2 = new KiteShield(2);

    public TOWRSH0 = new TowerShield(0);
    public TOWRSH1 = new TowerShield(1);
    public TOWRSH2 = new TowerShield(2);

    // Special Shields
    public DRGNSHL = new DragonShellShield(false);
    public RUNESHL = new DragonShellShield(true);
}
