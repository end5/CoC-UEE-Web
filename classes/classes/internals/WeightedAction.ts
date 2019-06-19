import { RandomAction } from "./RandomAction";

/**
 * Class for performing weighted random actions (function/method calls) derived from WeightedDrop by aimozg
 * @since May 7, 2017
 * @author Stadler76
 */
export class WeightedAction implements RandomAction {
    private actions: any[] = [];
    private sum: number = 0;

    public constructor(first?: any, firstWeight: number = 0) {
        if (first != undefined) {
            this.actions.push([first, firstWeight]);
            this.sum += firstWeight;
        }
    }

    public add(action: any, weight: number = 1) {
        this.actions.push([action, weight]);
        this.sum += weight;
        return this;
    }

    public addMany(weight: number, ..._actions: any[]) {
        for (const action of _actions) {
            this.actions.push([action, weight]);
            this.sum += weight;
        }
        return this;
    }

    public exec() {
        let random: number = Math.random() * this.sum;
        let action;
        const actions: any[] = this.actions.slice();
        while (random > 0 && actions.length > 0) {
            const pair: any[] = actions.shift();
            action = pair[0];
            random -= pair[1];
        }

        if (action != undefined)
            action();
    }

    public clone() {
        const other = new WeightedAction();
        other.actions = this.actions.slice();
        other.sum = this.sum;
        return other;
    }
}
