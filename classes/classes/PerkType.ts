import { BaseContent } from "./BaseContent";
import { Perk } from "./Perk";
import { CoC_Settings } from "./CoC_Settings";
import { Player } from "./Player";
import { kFLAGS } from "./GlobalFlags/kFLAGS";
import { StatusEffectType } from "./StatusEffectType";
import { kGAMECLASS } from "./GlobalFlags/kGAMECLASS";

/**
 * Created by aimozg on 26.01.14.
 */

export class PerkType extends BaseContent {
    private static PERK_LIBRARY = new Dictionary();

    public static lookupPerk(id: string): PerkType {
        return PerkType.PERK_LIBRARY[id];
    }

    public static getPerkLibrary(): Dictionary {
        return PerkType.PERK_LIBRARY;
    }

    private _id: string;
    private _name: string;
    private _desc: string;
    private _longDesc: string;
    private _keepOnAscension: boolean;
    public defaultValue1: number = 0;
    public defaultValue2: number = 0;
    public defaultValue3: number = 0;
    public defaultValue4: number = 0;

    /**
     * Unique perk id, should be kept in future game versions
     */
    public get id(): string {
        return this._id;
    }

    /**
     * Perk short name, could be changed in future game versions
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Short description used in perk listing
     */
    public desc(params: Perk): string {
        return this._desc;
    }

    /**
     * Long description used when offering perk at levelup
     */
    public get longDesc(): string {
        return this._longDesc;
    }

    public keepOnAscension(respec: boolean = false): boolean {
        if (this._keepOnAscension)
            return true;

        return this._longDesc != this._desc && !respec; // dirty condition
    }

    public constructor(id: string, name: string, desc: string, longDesc?: string, keepOnAscension: boolean = false) {
        super();
        this._id = id;
        this._name = name;
        this._desc = desc;
        this._longDesc = longDesc || this._desc;
        this._keepOnAscension = keepOnAscension;
        if (PerkType.PERK_LIBRARY[id] != undefined) {
            CoC_Settings.error("Duplicate perk id " + id + ", old perk is " + (PerkType.PERK_LIBRARY[id] as PerkType)._name);
        }
        PerkType.PERK_LIBRARY[id] = this;
    }

    public toString(): string {
        return "\"" + this._id + "\"";
    }

    /**
     * Array of: any {
     *   fn: (Player)=>Boolean,
     *   text: string,
     *   type: string
     *   // additional depending on type
     * }
     */
    public requirements: any[] = [];

    /**
     * @return "requirement1, requirement2, ..."
     */
    public allRequirementDesc(): string {
        const s: any[] = [];
        for (const c of this.requirements) {
            if (c.text) s.push(c.text);
        }
        return s.join(", ");
    }
    public available(player: Player): boolean {
        for (const c of this.requirements) {
            if (!c.fn(player)) return false;
        }
        return true;
    }

    public requireCustomFunction(playerToBoolean: any, requirementText: string, internalType: string = "custom"): PerkType {
        this.requirements.push({
            fn: playerToBoolean,
            text: requirementText,
            type: internalType
        });
        return this;
    }

    public requireLevel(value: number): PerkType {
        this.requirements.push({
            fn: this.fnRequireAttr("level", value),
            text: "Level " + value,
            type: "level",
            value
        });
        return this;
    }
    public requireStr(value: number): PerkType {
        this.requirements.push({
            fn: this.fnRequireAttr("str", value),
            text: "Strength " + value,
            type: "attr",
            attr: "str",
            value
        });
        return this;
    }
    public requireTou(value: number): PerkType {
        this.requirements.push({
            fn: this.fnRequireAttr("tou", value),
            text: "Toughness " + value,
            type: "attr",
            attr: "tou",
            value
        });
        return this;
    }
    public requireSpe(value: number): PerkType {
        this.requirements.push({
            fn: this.fnRequireAttr("spe", value),
            text: "Speed " + value,
            type: "attr",
            attr: "spe",
            value
        });
        return this;
    }
    public requireInt(value: number): PerkType {
        this.requirements.push({
            fn: this.fnRequireAttr("inte", value),
            text: "Intellect " + value,
            type: "attr",
            attr: "inte",
            value
        });
        return this;
    }
    public requireWis(value: number): PerkType {
        this.requirements.push({
            fn: this.fnRequireAttr("wis", value),
            text: "Wisdom " + value,
            type: "attr",
            attr: "wis",
            value
        });
        return this;
    }
    public requireLib(value: number): PerkType {
        this.requirements.push({
            fn: this.fnRequireAttr("lib", value),
            text: "Libido " + value,
            type: "attr",
            attr: "lib",
            value
        });
        return this;
    }
    public requireCor(value: number): PerkType {
        this.requirements.push({
            fn(player: Player): boolean {
                return player.isCorruptEnough(value);
            },
            text: "Corruption &gt; " + value,
            type: "attr-gt",
            attr: "cor",
            value
        });
        return this;
    }
    public requireLibLessThan(value: number): PerkType {
        this.requirements.push({
            fn(player: Player): boolean {
                return player.lib < value;
            },
            text: "Libido &lt; " + value,
            type: "attr-lt",
            attr: "lib",
            value
        });
        return this;
    }
    public requireNGPlus(value: number): PerkType {
        this.requirements.push({
            fn(player: Player): boolean {
                return player.newGamePlusMod() >= value;
            },
            text: "New Game+ " + value,
            type: "ng+",
            value
        });
        return this;
    }
    /* [INTREMOD: xianxia]
    public  requirePrestigeJobSlot():PerkType {
        requirements.push({
            fn  : function(player:Player): boolean {
                return player.maxPrestigeJobs() > 0;
            },
            text: "Free Prestige Job Slot",
            type: "prestige"
        });
        return this;
    }
    */
    public requireHungerEnabled(): PerkType {
        this.requirements.push({
            fn(player: Player): boolean {
                return kGAMECLASS.flags[kFLAGS.HUNGER_ENABLED] > 0;
            },
            text: "Hunger enabled",
            type: "hungerflag"
        });
        return this;
    }
    public requireMinLust(value: number): PerkType {
        this.requirements.push({
            fn(player: Player): boolean {
                return player.minLust() >= value;
            },
            text: "Min. Lust " + value,
            type: "minlust",
            value
        });
        return this;
    }
    /* [INTERMOD: xianxia]
    public  requireMaxSoulforce(value: number):PerkType {
        requirements.push({
            fn  : function(player:Player): boolean {
                return player.maxSoulforce() >= value;
            },
            text: "Max. Soulforce "+value,
            type: "soulforce",
            value: value
        });
        return this;
    }
    */
    private fnRequireAttr(attrname: string, value: number) {
        return (player: Player): boolean => {
            return player[attrname] >= value;
        };
    }
    public requireStatusEffect(effect: StatusEffectType, text: string): PerkType {
        this.requirements.push({
            fn(player: Player): boolean {
                return player.hasStatusEffect(effect);
            },
            text,
            type: "effect",
            effect
        });
        return this;
    }
    public requirePerk(perk: PerkType): PerkType {
        this.requirements.push({
            fn(player: Player): boolean {
                return player.findPerk(perk) >= 0;
            },
            text: perk.name,
            type: "perk",
            perk
        });
        return this;
    }
    public requireAnyPerk(...perks: any[]): PerkType {
        if (perks.length == 0) throw new Error(("Incorrect call of requireAnyPerk() - should NOT be empty"));
        const text: any[] = [];
        for (const perk of perks) {
            text.push(perk.allRequirementDesc());
        }
        this.requirements.push({
            fn(player: Player): boolean {
                for (const perk of perks) {
                    if (this.player.findPerk(perk) >= 0) return true;
                }
                return false;
            },
            text: text.join(" or "),
            type: "anyperk",
            perks
        });
        return this;
    }
}
