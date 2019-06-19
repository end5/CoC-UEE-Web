import { StatusEffect } from "../StatusEffect";
import { LoggerFactory } from "../internals/LoggerFactory";
import { StatusEffectType } from "../StatusEffectType";

/**
 * Common superclass for temporary stat [de]buffs with complete recovery after time.
 *
 * Implementation details: any 1. Subclass. Pass affected stat names (dynStat keys like 'str','spe','tou','int','lib','sen') as superclass
 *    constructor args.
 * 2. Override apply() with a call to buffHost to buff host and remember effect
 * 3. To apply buff, add it to host; call increase() on already existing buff to increase it effect
 *
 * Using host.dynStats instead of buffHost makes the effect permanent
 */
export class TemporaryBuff extends StatusEffect {
    private static LOGGER: ILogger = LoggerFactory.getLogger(TemporaryBuff);
    private stat1: string;
    private stat2: string;
    private stat3: string;
    private stat4: string;
    public constructor(stype: StatusEffectType, stat1: string, stat2: string = '', stat3: string = '', stat4: string = '') {
        super(stype);
        this.stat1 = stat1;
        this.stat2 = stat2;
        this.stat3 = stat3;
        this.stat4 = stat4;
    }
    /**
     * This function does a host.dynStats(...args) and stores the buff in status effect values
     */
    protected buffHost(...args: any[]): any {
        const buff: any = this.host.dynStats.apply(this.host, args);
        if (this.stat1) this.value1 += buff[this.stat1];
        if (this.stat2) this.value2 += buff[this.stat2];
        if (this.stat3) this.value3 += buff[this.stat3];
        if (this.stat4) this.value4 += buff[this.stat4];
        TemporaryBuff.LOGGER.debug("buffHost(" + args.join(",") + "): " +
            this.stat1 + " " + (this.stat1 ? buff[this.stat1] : "") + " " +
            this.stat2 + " " + (this.stat2 ? buff[this.stat2] : "") + " " +
            this.stat3 + " " + (this.stat3 ? buff[this.stat3] : "") + " " +
            this.stat4 + " " + (this.stat4 ? buff[this.stat4] : "") + " " +
            "->(" + this.value1 + ", " + this.value2 + ", " + this.value3 + ", " + this.value4 + ")");
        return buff;
    }
    protected restore(): void {
        const dsargs: any[] = ['scale', false];
        if (this.stat1) dsargs.push(this.stat1, -this.value1);
        if (this.stat2) dsargs.push(this.stat2, -this.value2);
        if (this.stat3) dsargs.push(this.stat3, -this.value3);
        if (this.stat4) dsargs.push(this.stat4, -this.value4);
        const debuff: any = this.host.dynStats.apply(this.host, dsargs);
        if (this.stat1) this.value1 += debuff[this.stat1];
        if (this.stat2) this.value2 += debuff[this.stat2];
        if (this.stat3) this.value3 += debuff[this.stat3];
        if (this.stat4) this.value4 += debuff[this.stat4];
        TemporaryBuff.LOGGER.debug("restore(" + dsargs.join(",") + "): " +
            this.stat1 + " " + (this.stat1 ? debuff[this.stat1] : "") + " " +
            this.stat2 + " " + (this.stat2 ? debuff[this.stat2] : "") + " " +
            this.stat3 + " " + (this.stat3 ? debuff[this.stat3] : "") + " " +
            this.stat4 + " " + (this.stat4 ? debuff[this.stat4] : "") + " " +
            "->(" + this.value1 + ", " + this.value2 + ", " + this.value3 + ", " + this.value4 + ")");
    }
    public buffValue(stat: string): number {
        switch (stat) {
            case this.stat1: return this.value1;
            case this.stat2: return this.value2;
            case this.stat3: return this.value3;
            case this.stat4: return this.value4;
            default: return 0;
        }
    }
    protected apply(firstTime: boolean): void {
    }
    public onAttach(): void {
        super.onAttach();
        this.apply(true);
    }
    public increase(): void {
        if (this.host == undefined) return;
        this.apply(false);
    }
    public onRemove(): void {
        super.onRemove();
        this.restore();
    }
}
