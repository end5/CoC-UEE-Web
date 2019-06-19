import { SimpleUseable } from "./SimpleUseable";

export class DebugWand extends SimpleUseable {

    public constructor() {
        super("DbgWand", "Debug Wand", "a wand of debugging", 1000, "This mysterious wand has an entirely unknown origin but somehow you feel like a cheater when using it.", "You raise the wand and a slab of stone emerges from the ground. The slab has fifteen buttons and a text panel.");
    }

    public canUse(): boolean {
        return true;
    }

    public useItem(): boolean {
        if (!this.game.debug) this.game.inventory.takeItem(this, this.game.debugMenu.accessDebugMenu);
        this.game.debugMenu.accessDebugMenu();
        return true;
    }

}
