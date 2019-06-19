import { Utils } from "./internals/Utils";
import { StatusEffectType } from "./StatusEffectType";
import { Creature } from "./Creature";
import { Player } from "./Player";
import { CoC } from "./CoC";
import { kGAMECLASS } from "./GlobalFlags/kGAMECLASS";

export class StatusEffect extends Utils {
    // constructor
    public constructor(stype: StatusEffectType) {
        super();
        this._stype = stype;
    }
    // data
    private _stype: StatusEffectType;
    private _host: Creature | undefined;
    public value1: number = 0;
    public value2: number = 0;
    public value3: number = 0;
    public value4: number = 0;
    public dataStore: Record<string, any> | undefined = undefined;
    // MEMBER FUNCTIONS
    public get stype(): StatusEffectType {
        return this._stype;
    }
    public get host() {
        return this._host;
    }
    /**
     * Returns undefined if host is not a Player
     */
    public get playerHost(): Player {
        return this._host as Player;
    }

    public toString(): string {
        return "[" + this._stype + "," + this.value1 + "," + this.value2 + "," + this.value3 + "," + this.value4 + "]";
    }
    // ==============================
    // EVENTS - to be overridden in subclasses
    // ===============================

    /**
     * Called when the effect is applied to the creature, after adding to its list of effects.
     */
    public onAttach(): void {
        // do nothing
    }
    /**
     * Called when the effect is removed from the creature, after removing from its list of effects.
     */
    public onRemove(): void {
        // do nothing
    }
    /**
     * Called after combat in player.clearStatuses()
     */
    public onCombatEnd(): void {
        // do nothing
    }
    /**
     * Called during combat in combatStatusesUpdate() for player, then for monster
     */
    public onCombatRound(): void {
        // do nothing
    }
    public remove(/*fireEvent: boolean = true*/): void {
        if (this._host == undefined) return;
        this._host.removeStatusEffectInstance(this/*,fireEvent*/);
        this._host = undefined;
    }
    public removedFromHostList(fireEvent: boolean): void {
        if (fireEvent) this.onRemove();
        this._host = undefined;
    }
    public addedToHostList(host: Creature, fireEvent: boolean): void {
        this._host = host;
        if (fireEvent) this.onAttach();
    }
    public attach(host: Creature/*,fireEvent: boolean = true*/): void {
        if (this._host == host) return;
        if (this._host != undefined) this.remove();
        this._host = host;
        host.addStatusEffect(this/*,fireEvent*/);
    }

    protected static register(id: string, statusEffectClass: any, arity: number = 0): StatusEffectType {
        return new StatusEffectType(id, statusEffectClass || StatusEffect, arity);
    }
    protected static get game(): CoC {
        return kGAMECLASS;
    }
}
