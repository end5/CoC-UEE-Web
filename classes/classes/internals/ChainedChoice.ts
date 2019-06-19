import { RandomChoice } from "./RandomChoice";
import { CoC_Settings } from "../CoC_Settings";

/**
 * Class for returning chained random choices derived from ChainedDrop by aimozg
 * @since March 7, 2018
 * @author Stadler76
 */
export class ChainedChoice<T> implements RandomChoice<T> {
    private choices: T[] = [];
    private probs: number[] = [];
    private defaultChoice: T | undefined;

    public constructor(defaultChoice?: T) {
        this.defaultChoice = defaultChoice;
    }

    public add(item: T, prob: number) {
        if (prob < 0 || prob > 1) {
            CoC_Settings.error("Invalid probability value " + prob);
        }
        this.choices.push(item);
        this.probs.push(prob);
        return this;
    }

    public elseChoice(item: T) {
        this.defaultChoice = item;
        return this;
    }

    public choose() {
        for (let i: number = 0; i < this.choices.length; i++) {
            if (Math.random() < this.probs[i]) {
                return this.choices[i];
            }
        }

        return this.defaultChoice;
    }
}
