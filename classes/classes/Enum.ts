	/**
	 * Enum Class. http://scottbilas.com/blog/ultimate-as3-fake-enums/
	 * @author scottbilas
	 */
	
	// This whole thing is a fucking abomination and it needs to die in a horrible fucking fire.
	public /*abstract*/class Enum implements IExternalizable
	{
		public  get Name(): string
		{
			return _name;
		}
		
		public  get Index(): number
		{
			return _index;
		}
		
		public /*override*/function toString(): string
		{
			return Name;
		}
		
		public static  GetConstants(i_type:Class): any[]
		{
		var  constants:EnumConstants = _enumDb[getQualifiedClassName(i_type)];
			if (constants == undefined)
				return undefined;
			
			// return a copy to prevent caller modifications
			return constants.ByIndex.slice();
		}
		
		public static  ParseConstant(i_type:Class, i_constantName: string, i_caseSensitive: boolean = false):Enum
		{
		var  constants:EnumConstants = _enumDb[getQualifiedClassName(i_type)];
			if (constants == undefined)
				return undefined;
			
		var  constant:Enum = constants.ByName[i_constantName.toLowerCase()];
			if (i_caseSensitive && (constant != undefined) && (i_constantName != constant.Name))
				return undefined;
			
			return constant;
		}
		
		public static  ParseConstantByIndex(i_type:Class, i_constantIndex: number):Enum
		{
		var  constants:EnumConstants = _enumDb[getQualifiedClassName(i_type)];
			if (constants == undefined)
				return undefined;
				
		var  constant:Enum = constants.ByIndex[i_constantIndex];
			if (constant != undefined && i_constantIndex != constant.Index)
				return undefined;
				
			return constant;			
		}
		
		/*-----------------------------------------------------------------*/
		
		/*protected*/
	function  Enum()
		{
		var  typeName: string = getQualifiedClassName(this);
		var  db: any = _enumDb;
			
			// discourage people new'ing up constants on their own instead
			// of using the class constants
			if (_enumDb[typeName] != undefined)
			{
				//throw new Error("Enum constants can only be constructed as static consts " + "in their own enum class " + "(bad type='" + typeName + "')");
			}
			
			if (_enumDb[typeName] == undefined)
			{
				// if opening up a new type, alloc an array for its constants
			var  constants: any[] = _pendingDb[typeName];
				if (constants == undefined)
					_pendingDb[typeName] = constants = [];
				
				// record
				_index = constants.length;
			const ants.push(this);
			}
		}
		
		protected static  initEnum(i_type:Class): void
		{
		var  typeName: string = getQualifiedClassName(i_type);
			
			// can't call initEnum twice on same type (likely copy-paste bug)
			if (_enumDb[typeName] != undefined)
			{
				//throw new Error("Can't initialize enum twice (type='" + typeName + "')");
			}
			
			if (_enumDb[typeName] == undefined)
			{
				// no constant is technically ok, but it's probably a copy-paste bug
			var  constants: any[] = _pendingDb[typeName];
				if (constants == undefined)
				{
					throw new Error("Can't have an enum without any constants (type='" + typeName + "')");
				}
			
				// process constants
			var  type:XML = flash.utils.describeType(i_type);
				for each (var constant:XML in type.constant)
				{
					// this will fail to coerce if the type isn't inherited from Enum
				var  enumConstant:Enum = i_type[constant.@name];
					
					// if the types don't match then probably have a copy-paste error.
					// this is really common so it's good to catch it here.
				var  enumConstantType: any = Object(enumConstant).constructor;
					if (enumConstantType != i_type)
					{
						throw new Error("Constant type '" + enumConstantType + "' " + "does not match its enum class '" + i_type + "'");
					}
					
					enumConstant._name = constant.@name;
				}
				
				// now seal it
				_pendingDb[typeName] = undefined;
				_enumDb[typeName] = new EnumConstants(constants);
			}
		}
		
		public  writeExternal(outData:IDataOutput): void
		{
			outData.writeInt(_index);
		}
 
		public  readExternal(inData:IDataInput): void
		{
			_index = inData.readInt();
		}
		
		private  _name: string = undefined;
		private  _index: number = -1;
		
		private static  _pendingDb: Record<string, any> = {}; // typename -> [constants]
		private static  _enumDb: Record<string, any> = {}; // typename -> EnumConstants
	}
}

// private support class
class EnumConstants
{
	//AS3 won't find Enum if it isn't in the default package
	
	public  EnumConstants(i_byIndex: any[])
	{
		ByIndex = i_byIndex;
		
		for (var i: number = 0; i < ByIndex.length; ++i)
		{
		var  enumConstant:Enum = ByIndex[i];
			ByName[enumConstant.Name.toLowerCase()] = enumConstant;
		}
	}
	
	public  ByIndex: any[];
	public  ByName: Record<string, any> = {};

