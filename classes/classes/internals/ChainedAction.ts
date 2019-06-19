import { RandomAction } from "./RandomAction";
import { CoC_Settings } from "../CoC_Settings";

/**
 * Class for performing chained random actions (function/method calls) derived from ChainedDrop by aimozg
 * @since May 7, 2017
 * @author Stadler76
 */
export class ChainedAction implements RandomAction {
    private actions: any[] = [];
    private probs: any[] = [];
    private defaultAction: any | undefined;

    public constructor(defaultAction?: any) {
        this.defaultAction = defaultAction;
    }

    public add(action: any, prob: number) {
        if (prob < 0 || prob > 1) {
            CoC_Settings.error("Invalid probability value " + prob);
        }
        this.actions.push(action);
        this.probs.push(prob);
        return this;
    }

    public elseAction(action: any) {
        this.defaultAction = action;
        return this;
    }

    public exec(): void {
        for (let i: number = 0; i < this.actions.length; i++) {
            if (Math.random() < this.probs[i]) {
                this.actions[i]();
                return;
            }
        }

        if (this.defaultAction != undefined)
            this.defaultAction();
    }
}
