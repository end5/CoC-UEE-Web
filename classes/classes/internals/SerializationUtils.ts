	
	/**
	 * A class providing utility methods to make serialization and deserialization easier.
	 */
	export class SerializationUtils 
	{
		private static  LOGGER:ILogger = LoggerFactory.getLogger(SerializationUtils);
		
		private static  SERIALIZATION_VERSION_PROPERTY: string = "serializationVersion";
		private static  SERIALIZATION_VERSION2_PROPERTY: string = "serializationVersionDictionary";
		
		public  SerializationUtils() 
		{
			throw new IllegalOperationError("This class cannot be instantiated");
		}
		
		/**
		 * Serializes a Vector into an array.
		 * @param	vector to serialize
		 * @return a array containing the serialized vector
		 */
		public static  serializeVector(vector:Vector.<*>): any[] {
		var  serialized: any[] = [];
			
			for each(var element:Serializable in vector) {
			var  obj: any[] = [];
				serialized.push(obj);
				
				SerializationUtils.serialize(obj, element);
			}
			
			return serialized;
		}
		
		/**
		 * Deserializes a Array into a Vector of Serializable
		 * @param   destinationVector Vector where deserialized items will be written
		 * @param	serializedVector an Array containing the serialized vector
		 * @param	type of the serialized Vector
		 * @return a deserialized Vector
		 */
		public static  deserializeVector(destinationVector:Vector.<*>, serializedVector: any[], type:Class): void {
			// 'is' will only work on an instance
			if (!(new type() is Serializable)) {
				throw new ArgumentError("Type must implement Serializable");
			}
			
			if (destinationVector === undefined) {
				throw new ArgumentError("Destination Vector cannot be undefined");
			}
			
			if (serializedVector === undefined) {
				throw new ArgumentError("Serialized Vector cannot be undefined");
			}
			
			for each(var element: Record<string, any> in serializedVector) {
			var  instance:Serializable = new type();
				SerializationUtils.deserialize(element, instance);
				destinationVector.push(instance);
			}
		}
		
		/**
		 * Casts a vector from one type to another. DOES NO VALIDATION.
		 * @param	destinationVector vector where casted elements will be put
		 * @param	sourceVector where elements for casting will be read from
		 * @param	destinationType the class to cast to
		 */
		public static  castVector(destinationVector: any, sourceVector: any, destinationType:Class): void {
			/**
			 * If anyone has a better idea, i'm all ears.
			 * Implement your solution and see if the tests pass.
			 */
			
			for each(var element: any in sourceVector) {
				destinationVector.push(element as destinationType);
			}
		}
		
		/**
		 * Legacy method, do not use for new code
		 * Get the serialization version from the object, if any.
		 * @param	relativeRootObject that possibly contains a serialization version
		 * @return the serialization version, or 0 if no version is found
		 */
		public static  legacySerializationVersion(relativeRootObject: any): number {
			return relativeRootObject[SERIALIZATION_VERSION_PROPERTY];
		}
		
		/**
		 * Get the serialization version from the object for the matching ID, if any.
		 * @param	relativeRootObject that possibly contains a serialization version
		 * @param	serialized the class for which the version should be queried
		 * @return the serialization version, or 0 if no version is found
		 */
		public static  serializationVersion(relativeRootObject: any, serialized:Serializable): number {
			if (relativeRootObject[SERIALIZATION_VERSION2_PROPERTY] === undefined) {
				return 0;
			}
			
			return relativeRootObject[SERIALIZATION_VERSION2_PROPERTY][serialized.serializationUUID()];
		}
		
		/**
		 * Check the version of the serialized data and compare it with the current version.
		 * @param	relativeRootObject object that contains serialized data
		 * @return true if the serialized version is compatible with the current verison
		 */
		public static  serializedVersionCheck(relativeRootObject: any, expectedVersion: number, serialized:Serializable): boolean {
		var  version: number = SerializationUtils.serializationVersion(relativeRootObject, serialized);
			
			if (version > expectedVersion) {
				LOGGER.error("Serialized version is {0}, but the current version is {1}. Backward compatibility is not guaranteed!", version, expectedVersion);
				return false;
			}else{
				LOGGER.debug("Serialized version is {0}", version);
			}
			
			return true;
		}
		
		/**
		 * Check the version of the serialized data and compare it with the current version. Throws a Exception
		 * if the version is newer.
		 * @param	relativeRootObject object that contains serialized data
		 * @param	serialized class instance that should have it's state restored
		 * @throws RangeError if the stored version is newer than the current version
		 */
		public static  serializedVersionCheckThrowError(relativeRootObject: any, expectedVersion: number, serialized:Serializable): void {
			if (!SerializationUtils.serializedVersionCheck(relativeRootObject, expectedVersion, serialized)) {
				throw new RangeError("Stored version is newer than the current version");
			}
		}
		
		/**
		 * Deserialize a class. This method is intended to automate deserialization, in order to avoid
		 * a lot of code duplication.
		 * @param	relativeRootObject the object that contains the serialized classes data
		 * @param	serialized class instance that should have it's state restored
		 */
		public static  deserialize(relativeRootObject: any, serialized:Serializable): void {
			LOGGER.debug("Deserializing  {0}...", serialized);

			objectDefinedCheck(relativeRootObject, "Object passed for deserialization must be defined. Does the loaded property exist?")
			objectDefinedCheck(serialized, "Instance of class to load is not defined. Did you call the class constructor?");
			
			if (isUsingV1Serialization(relativeRootObject)) {
				upgradeSerializationVersionToV2(relativeRootObject, serialized);
			}
			
			SerializationUtils.serializedVersionCheckThrowError(relativeRootObject, serialized.currentSerializationVerison(), serialized);
		var  serializedObjectVersion: number = SerializationUtils.serializationVersion(relativeRootObject, serialized);
			
			serialized.upgradeSerializationVersion(relativeRootObject, serializedObjectVersion);
			serialized.deserialize(relativeRootObject);
		}
		
		private static  upgradeSerializationVersionToV2(relativeRootObject: any, serialized:Serializable): void
		{
			LOGGER.info("Upgrading serialization for {0}", serialized);
			
			relativeRootObject[SERIALIZATION_VERSION2_PROPERTY] = [];
			relativeRootObject[SERIALIZATION_VERSION2_PROPERTY][serialized.serializationUUID()] = relativeRootObject[SERIALIZATION_VERSION_PROPERTY];
			delete relativeRootObject[SERIALIZATION_VERSION_PROPERTY];
		}
		
		/**
		 * Serialize a class. This method is intended to automate serialization, in order to avoid
		 * a lot of code duplication.
		 * 
		 * @param	relativeRootObject to write the classes data to
		 * @param	toSerialize instance of class to serialize
		 */
		public static  serialize(relativeRootObject: any, toSerialize:Serializable): void {
			LOGGER.debug("Serializing {0}...", toSerialize);
			
			objectDefinedCheck(relativeRootObject, "Object used for storage must be defined. Did you forget to initialize e.g. foo = []; ?");
			objectDefinedCheck(toSerialize, "Instance of class to store is not defined. Did you call the class constructor?");
			
			relativeRootObject[SERIALIZATION_VERSION2_PROPERTY] = [];
			relativeRootObject[SERIALIZATION_VERSION2_PROPERTY][toSerialize.serializationUUID()] = toSerialize.currentSerializationVerison();
			
			toSerialize.serialize(relativeRootObject);
		}
		
		private static  objectDefinedCheck(object: any, message: string): void {
			if (object === undefined || object === undefined) {
				LOGGER.error("Object failed defined check with message: {0}", message);
				throw new ArgumentError(message);
			}
		}
		
		/**
		 * Check if the object is using version 1 serialization.
		 * @param	relativeRootObject the object to check
		 * @return true if using version 1
		 */
		public static  isUsingV1Serialization(relativeRootObject: any): boolean
		{
			return legacySerializationVersion(relativeRootObject) !== 0;
		}
	}

