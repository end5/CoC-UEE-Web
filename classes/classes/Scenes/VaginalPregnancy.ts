	/**
	 * Interface for vaginal pregnancy.
	 * The class must at least implement a birth scene.
	 */
	public interface VaginalPregnancy 
	{
		/**
		 * Progresses a active pregnancy. Updates should eventually lead to birth.
		 * @return true if the display output needs to be updated.
		 */
	function  updateVaginalPregnancy(): boolean;
		
		/**
		 * Give birth. Should outout a birth scene and clean up the pregnancy.
		 */
	function  vaginalBirth(): void;
	}

