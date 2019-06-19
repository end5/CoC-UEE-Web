import { RandomDrop } from "./RandomDrop";
import { CoC_Settings } from "../CoC_Settings";

/**
 * Created by aimozg on 11.01.14.
 */

export class ChainedDrop<T> implements RandomDrop<T> {
    private items: T[] = [];
    private probs: number[] = [];
    private defaultItem: T | undefined;

    public constructor(defaultItem?: T) {
        this.defaultItem = defaultItem;
    }

    public add(item: T, prob: number) {
        if (prob < 0 || prob > 1) {
            CoC_Settings.error("Invalid probability value " + prob);
        }
        this.items.push(item);
        this.probs.push(prob);
        return this;
    }

    public elseDrop(item: T) {
        this.defaultItem = item;
        return this;
    }

    public roll() {
        for (let i: number = 0; i < this.items.length; i++) {
            if (Math.random() < this.probs[i]) return this.items[i];
        }
        return this.defaultItem;
    }
}
