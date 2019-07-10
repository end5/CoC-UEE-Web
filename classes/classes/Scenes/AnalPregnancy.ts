/**
 * Interface for anal pregnancy.
 * The class must at least implement a birth scene.
 */
export interface AnalPregnancy {
    /**
     * Progresses a active pregnancy. Updates should eventually lead to birth.
     * @return true if the display output needs to be updated.
     */
    updateAnalPregnancy(): boolean;

    /**
     * Give birth. Should outout a birth scene.
     */
    analBirth(): void;
}
