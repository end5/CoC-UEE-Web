	
	/**
	 * Class for manipulating save games.
	 */
	export class SaveGameUtils
	{
		private static  LOGGER:ILogger = LoggerFactory.getLogger(SaveGameUtils);
		
		private static  SAVE_ROOT_DIRECTORY: string = "/";
		
		public  SaveGameUtils()
		{
			throw new IllegalOperationError("This is a static class, no instance can be created");
		}
		
		/**
		 * Deletes a savegame without confirmation.
		 * @param	saveName the name of the savegame to delete
		 */
		public static  deleteSaveGame(saveName: string): void
		{
			LOGGER.debug("Deleting savegame {0}", saveName);
			
		var  savegame:SharedObject = SharedObject.getLocal(saveName, SAVE_ROOT_DIRECTORY);
			savegame.clear();
		}
		
		/**
		 * Copy the source save to the destination. This method will overwrite the destination without confirmation.
		 * @param	sourceSaveName filename of the source save to copy
		 * @param	destinationSaveName filename of the destination save to overwrite
		 */
		public static  copySaveGame(sourceSaveName: string, destinationSaveName: string): void
		{
			LOGGER.debug("Copying savegame {0} to {1}...", sourceSaveName, destinationSaveName);
			
		var  source:SharedObject = SharedObject.getLocal(sourceSaveName, SAVE_ROOT_DIRECTORY);
		var  destination:SharedObject = SharedObject.getLocal(destinationSaveName, SAVE_ROOT_DIRECTORY);
			
			LOGGER.debug("Deleting destination savegame {0}...", destinationSaveName);
			destination.clear();
			
			/**
			 * The reason this has to be done in such a roundabout way is that
			 * SharedObject.data is read only, so destination.data = source.data
			 * will not work - a compile error is thrown.
			 */
			for (var prop: string in source.data)
			{
				LOGGER.debug("Copying root property {0} to new savegame", prop);
				destination.data[prop] = source.data[prop];
			}
			
			LOGGER.debug("Copy done, flushing savegame {0} to disk", destinationSaveName);
			destination.flush();
		}
	}

