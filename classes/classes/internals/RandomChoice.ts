/**
 * Interface for returning random choices derived from RandomDrop by aimozg
 * @since March 7, 2018
 * @author Stadler76
 */
export interface RandomChoice<T> {
    choose(): T | undefined;
}
