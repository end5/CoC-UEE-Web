/**
 * Created by aimozg on 11.01.14.
 */
export interface RandomDrop<T> {
    roll(): T | undefined;
}
