	/**
	 * Class that provides random numbers.
	 */
	export class ActionScriptRNG implements RandomNumberGenerator
	{
		/**
		 * Returns a number that is between 0 and max exclusive.
		 * @param	max the upper limit for the random number
		 * @return a value between 0 and max - 1
		 */
		public  random(max: number): number 
		{
			return Utils.rand(max);
		}
		
		/**
		 * Returns a number that is between 0 and max inclusive.
		 * @param	max the upper limit for the random number
		 * @return a value between 0 and max inclusive
		 */
		public  randomCorrected(max: number): number 
		{
			return Utils.rand(max + 1);
		}
	}

