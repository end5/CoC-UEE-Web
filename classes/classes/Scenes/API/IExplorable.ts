	/**
	 * Interface for explorable areas.
	 */
	public interface IExplorable 
	{
		/**
		 * Check if the area has already been discovered.
		 * @return true if the area has been discovered.
		 */
	function  isDiscovered(): boolean;
		/**
		 * Discover the area, making it available for future exploration.
		 */
	function  discover(): void;
		/**
		 * Explore the area, possibly triggering encounters.
		 */
	function  explore(): void;
	}

