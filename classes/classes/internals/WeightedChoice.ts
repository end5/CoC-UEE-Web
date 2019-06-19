import { RandomChoice } from "./RandomChoice";

/**
 * Class for returning weighted random choices derived from WeightedDrop by aimozg
 * @since March 7, 2018
 * @author Stadler76
 */
export class WeightedChoice<T> implements RandomChoice<T> {
    private choices: [T, number][] = [];
    private sum = 0;

    public constructor(first?: T, firstWeight: number = 0) {
        if (first != undefined) {
            this.choices.push([first, firstWeight]);
            this.sum += firstWeight;
        }
    }

    public add(choice: T, weight: number = 1) {
        this.choices.push([choice, weight]);
        this.sum += weight;
        return this;
    }

    public addMany(weight: number, ..._choices: T[]) {
        for (const choice of _choices) {
            this.choices.push([choice, weight]);
            this.sum += weight;
        }
        return this;
    }

    public choose() {
        let random = Math.random() * this.sum;
        let choice;
        const choices = this.choices.slice();
        while (random > 0 && choices.length > 0) {
            const pair = choices.shift()!;
            choice = pair[0];
            random -= pair[1];
        }
        return choice;
    }

    public clone() {
        const other = new WeightedChoice<T>();
        other.choices = this.choices.slice();
        other.sum = this.sum;
        return other;
    }
}
