/**
 * Interface for explorable areas.
 */
export interface IExplorable {
    /**
     * Check if the area has already been discovered.
     * @return true if the area has been discovered.
     */
    isDiscovered(): boolean;
    /**
     * Discover the area, making it available for future exploration.
     */
    discover(): void;
    /**
     * Explore the area, possibly triggering encounters.
     */
    explore(): void;
}
