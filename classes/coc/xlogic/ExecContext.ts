/**
 * Coded by aimozg on 27.08.2017.
 */


export class ExecContext {
	private static  LOGGER:ILogger = LoggerFactory.getLogger(ExecContext);
	
	public  ExecContext(_thiz: any[]=undefined) {
		this._scopes = _thiz?_thiz:[];
	}
	private  _scopes: any[];
	public  get scopes(): any[] {
		return _scopes;
	}
	public  set scopes(value: any[]): void {
		_scopes = value;
	}
	public  getObject(path: string): any {
	var  p:/*String*/Array = path.split('.');
	var  o: any = getValue(p[0]);
		for (var j: number = 1; j < p.length; j++) {
			if (!o) {
				LOGGER.error("[ERROR] getObject('"+path+"') -> "+o);
				return undefined;
			}
			o = o[p[j]];
		}
		if (!o) {
			LOGGER.error("[ERROR] getObject('"+path+"') -> "+o);
		}
		return o;
	}
	public  getValue(varname: string,inObj: string=""): any {
		if (inObj) {
		var  obj: any = getObject(inObj);
			if (obj) return obj[varname];
			return undefined;
		}
		for each (var s: any in _scopes) if (varname in s) return s[varname];
		return undefined;
	}
	public  setValue(varname: string,value: any,inObj: string=""): void {
		if (inObj) {
		var  obj: any = getObject(inObj);
			if (obj) {
				obj[varname] = value;
				return;
			}
			// TODO log error
			_scopes[0][varname] = value;
			return;
		}
		for each (var s: any in _scopes) {
			if (varname in s) {
				s[varname] = value;
				return;
			}
		}
		_scopes[0][varname] = value;
	}
	public  hasValue(varname: string): boolean {
		for each (var s: any in _scopes) if (varname in s) return true;
		return false;
	}
	public  execute(stmt:Statement): void {
		stmt.execute(this);
	}
	public  executeAll(stmts:/*Statement*/Array): void {
		for each (var statement:Statement in stmts) {
			statement.execute(this);
		}
	}
	public  error(where: any,message: string): void {
		throw new Error("In "+where+": "+message);
	}
	public  pushScope(scope: Record<string, any>): void {
		scopes.unshift(scope);
	}
	public  popScope(): void {
		scopes.shift();
	}
	/**
	 * For debugging
	 */
	public  debug(where: any,s: string): void {
		if (DEBUG_LOG_ENABLED) {
			LOGGER.debug('' + where + ' ' + s);
		}
	}
	public static  DEBUG_LOG_ENABLED: boolean = false;
}

