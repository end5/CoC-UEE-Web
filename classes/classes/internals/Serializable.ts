	
	/**
	 * Interface for serialization and de-serialization.
	 * This is used to store class state in an object, so it can be persisted either
	 * to a shared object or file.
	 * The interface also provides a function to reverse the process.
	 */
	public interface Serializable 
	{
		/**
		 * Serialize a class so it can be stored. Any state that is not serialized will be lost and replaced with the
		 * default value on deserialization.
		 * The class variables need to be stored manually.
		 * The object that is passed in must be initialized so class can write to it.
		 * 
		 * e.g.: any relativeRootObject.foo = intValue;
		 * relativeRootObject.bar = StringValue;
		 * relativeRootObject.baz = [];
		 * this.complexObject.serialize(relativeRootObject.baz);
		 * 
		 * @param	relativeRootObject the object this class should write to 
		 */
	function  serialize(relativeRootObject: any): void;
		
		/**
		 * Deserialize a class, restoring it's state. Deserialization requires some form of default constructor, this can be achieved
		 * with all parameters having a default value.
		 * 
		 * @param	relativeRootObject the object this class should read from
		 */
	function  deserialize(relativeRootObject: any): void;
		
		/**
		 * Upgrade from an earlier version of the serialized data.
		 * This modifies the loaded object so it can be processed by the
		 * deserialization code.
		 * @param	relativeRootObject the loaded serialized data
		 * @param	serializedDataVersion a non-negative integer indicating the version of the loaded data
		 */
	function  upgradeSerializationVersion(relativeRootObject: any, serializedDataVersion: number): void;
		
		/**
		 * Get the current serialization version for this class.
		 * @return the current serialization version
		 */
	function  currentSerializationVerison(): number;
		
		/**
		 * A string that is unique among all serializable classes, used to identify the serialization version  for
		 * this class.
		 * The ID remains the same if the class is moved or renamed. Once used it should never be changed.
		 * 
		 * @return the unique id for this class
		 */
	function  serializationUUID(): string;
	}

