/**
 * Coded by aimozg on 12.07.2017.
 */

export class Eval {
	// (condition,then,elze) => ()=>(condition()?then():elze())
	public static  functionIf(condition,then,elze) {
		return function (): any {
			return condition() ? then() : elze();
		};
	}
	
	private  scopes:/*Object*/Array;
	private  expr: string;
	private  _src: string;
	private  _call;
	public  call(...scopes:/*Object*/Array): any {
		return vcall(scopes);
	}
	public  get src(): string {
		return _src;
	}
	public  vcall(scopes:/*Object*/Array): any {
		this.scopes = scopes;
		try {
			return _call();
		} catch (e:Error){
			throw error(_src,"",e.message,false);
		}
	}
	
	public  Eval(thiz: any, expr: string) {
		this.scopes = [thiz];
		this._src   = expr;
		this.expr   = expr;
	}
	
	private static  RX_FLOAT:RegExp = /^[+\-]?(\d+(\.\d+)?|\.\d+)(e[+\-]?\d+)?$/;
	private static  RX_INT:RegExp = /^[+\-]?(0x)?\d+$/;
	
	private static  LA_BLOCK_COMMENT:RegExp = /^\/\*([^*\/]|\*[^\/]|[^\*]\/)*\*+\//;
	private static  LA_FLOAT:RegExp = /^[+\-]?(\d+(\.\d+)?|\.\d+)(e[+\-]?\d+)?/;
	private static  LA_INT:RegExp = /^[+\-]?(0x)?\d+/;
	private static  LA_ID:RegExp = /^[a-zA-Z_$][a-zA-Z_$0-9]*/;
	private static  LA_OPERATOR:RegExp = /^(>=?|<=?|!==?|={1,3}|\|\||&&|or|and|eq|neq?|[lg](te|t|e)|[-+*\/%])/;
	private static  OP_PRIORITIES: any = {
		'||' : 10,
		'or' : 10,
		'&&' : 20,
		'and': 20,
		'>=' : 30,
		'>'  : 30,
		'<=' : 30,
		'<'  : 30,
		'!==': 30,
		'!=' : 30,
		'===': 30,
		'==' : 30,
		'='  : 30,
		'lt' : 30,
		'le' : 30,
		'lte': 30,
		'gt' : 30,
		'ge' : 30,
		'gte': 30,
		'neq': 30,
		'ne' : 30,
		'eq' : 30,
		'+'  : 40,
		'-'  : 40,
		'*'  : 50,
		'/'  : 50,
		'%'  : 50
	};
	public static  eval(thiz: any, expr: string): any {
		if (expr.match(RX_INT)) return int(expr);
		return new Eval(thiz, expr).evalUntil("")();
	}
	public static  evalScoped(expr: string,...scopes:/*Object*/Array): any {
		return evalVScoped(expr,scopes);
	}
	public static  evalVScoped(expr: string,scopes:/*Object*/Array): any {
		if (expr.match(RX_INT)) return int(expr);
		return compile(expr).vcall(scopes);
	}
	public static  compile(expr: string):Eval {
	var  e:Eval = new Eval({}, expr);
		if (expr.match(RX_INT)) {
		const  i: number = parseInt(expr);
			e._call     = function (): number {return i;};
		} else if (expr.match(RX_FLOAT)) {
		const  f: number = parseFloat(expr);
			e._call     = function (): number {return f;};
		} else {
			e._call = e.evalUntil("");
		}
		
		return e;
	}
	private static  error(src: string, expr: string, msg: string, tail: boolean = true):Error {
		return new Error("In expr: "+src+"\n"+msg+(tail?": "+expr:""));
	}
	private  evalPostExpr(x,minPrio: number) {
	var  m: any[];
	var  y,z;
		while (true) {
			eatWs();
			if (eatStr('()')) {
				x = wrapCall(x,[]);
			} else if (eatStr('(')) {
			var  args:/*Function*/Array = [];
				while(true){
					y = evalExpr(0);
					args.push(y);
					if (eatStr(')')) break;
					if (!eatStr(',')) throw error(_src,expr,"Expected ')' or ','");
				}
				x = wrapCall(x,args);
			} else if (eatStr('.')) {
				m = eat(LA_ID);
				if (!m) throw error(_src,expr,"Identifier expected");
				x = wrapDot(x, wrapVal(m[0]));
			} else if (eatStr('[')) {
				y = evalUntil("]");
				eatWs();
				if (!eatStr(']')) throw error(_src,expr,"Expected ']'");
				x    = wrapDot(x, y);
			} else if (eatStr('?')) {
				y = evalUntil(':');
				if (!eatStr(':')) throw error(_src,expr,"Expected ':'");
				z = evalExpr(0);
				x = wrapIf(x, y, z);
			} else if ((m = eat(LA_OPERATOR))) {
			var  p: number = OP_PRIORITIES[m[0]];
				if (p>minPrio) {
					y = evalExpr(p);
					x = wrapOp(x, m[0], y);
				} else {
					unshift(m[0]);
					break;
				}
			} else break;
		}
		eatWs();
		return x;
	}
	public static  calculateOp(x: any,op: string,y: any): any {
		switch (op) {
			case '>':
			case 'gt':
				return x > y;
			case '>=':
			case 'gte':
			case 'ge':
				return x >= y;
			case '<':
			case 'lt':
				return x < y;
			case '<=':
			case 'lte':
			case 'le':
				return x <= y;
			case '=':
			case '==':
			case 'eq':
				return x == y;
			case '===':
				return x === y;
			case '!=':
			case 'ne':
			case 'neq':
				return x != y;
			case '!==':
				return x !== y;
			case '+':
				return x + y;
			case '-':
				return x - y;
			case '%':
				return x % y;
			case '*':
				return x * y;
			case '/':
				return x / y;
			case '||':
			case 'or':
				return x || y;
			case '&&':
			case 'and':
				return x && y;
			default:
				throw new Error("Unregistered operator " + op);
		}
	}
	private  calculate(x, op: string, y): any {
//		trace("Evaluating " + (typeof x) + " " + x + " " + op + " " + (typeof y) + " " + y);
		switch (op) {
			case '||':
			case 'or':
				return x() || y();
			case '&&':
			case 'and':
				return x() && y();
			default:
				try {
					return calculateOp(x(),op,y());
				} catch (e: Error) {
					throw error(_src, expr, "Unregistered operator " + op, false);
				}
		}
	}
	private  evalExpr(minPrio: number) {
	var  m:/*String*/Array;
	var  x;
		eatWs();
		if (eatStr('(')) {
			x = evalUntil(")");
			eatStr(")");
		} else if (eatStr('!') || eat(/^not\b/)) {
			x = wrapNot(evalExpr(60));
		} else if (eatStr('[')) {
		var  f:/*Function*/Array;
			if (eatStr(']')) {
				f = [];
			} else {
				f = [evalExpr(0)];
				while (eatStr(',')) {
					f.push(evalExpr(0));
				}
				if (!eatStr("]")) throw error(_src, expr, "Expected ',' or ']'");
			}
			x = wrapArray(f);
		} else if (eatStr('{')) {
			if (eatStr('}')) {
				f = [];
			} else {
				f = [];
				while (true) {
					eatWs();
				var  key: string;
					if ((m = eat(/^['"]/))) {
					var  delim: string = m[0];
						key = evalStringLiteral(delim);
					} else if ((m = eat(LA_ID))) {
						key = m[1];
					} else break;
					f.push(wrapVal(key));
					eatWs();
					if (!eatStr(':')) throw error(_src, expr, "Expected ':' after '"+key+"'");
					eatWs();
					f.push(evalExpr(0));
					if (eatStr('}')) break;
					if (!eatStr(',')) throw error(_src, expr, "Expected ',' or '}'");
				}
			}
			x = wrapCall(wrapVal(Utils.createMapFromPairs),f);
		} else if ((m = eat(LA_FLOAT))) {
			x = wrapVal(parseFloat(m[0]));
		} else if ((m = eat(LA_INT))) {
			x = wrapVal(parseInt(m[0]));
		} else if ((m = eat(/^['"]/))) {
			delim = m[0];
		var  s: string     = evalStringLiteral(delim);
			x                = wrapVal(s);
		} else if ((m = eat(LA_ID))) {
			x = wrapId(m[0]);
		} else {
			throw error(_src,expr,"Not a sub-expr");
		}
		return evalPostExpr(x,minPrio);
	}
	private  evalStringLiteral(delim: string): string {
	var  s: string   = '';
	var  m:/*String*/Array;
	var  rex:RegExp = delim == '"' ? /^[^"\\]*/ : /^[^'\\]*/;
		while (true) {
			if (eatStr('\\')) {
			var  c: string = eatN(1);
				s += {
					     'n': '\n', 't': '\t', 'r': '', '"': '"', "'": "'"
				     }[c] || '';
			} else if (eatStr(delim)) {
				break
			} else if ((m = eat(rex))) {
				s += m[0];
			} else {
				throw error(_src, expr, "Expected text");
			}
		}
		return s;
	}
	private  evalUntil(until: string): any {
	var  x: any = evalExpr(0);
		if (expr == until || expr.charAt(0) == until) return x;
		if (until) throw error(_src,expr,"Operator or " + until + "expected");
		throw error(_src,expr,"Operator expected");
	}
	private  eat(rex:RegExp): any[] {
	var  m: any[] = expr.match(rex);
		if (m) eatN(m[0].length);
		return m;
	}
	private  unshift(s: string): void {
		expr = s+expr;
	}
	private  eatN(n: number): string {
	var  s: string = expr.substr(0,n);
		expr = expr.substr(n);
		return s;
	}
	private  eatStr(s: string): boolean {
		if (expr.substr(0,s.length).indexOf(s) == 0) {
			eatN(s.length);
			return true;
		}
		return false;
	}
	private  eatWs(): void {
		//noinspection StatementWithEmptyBodyJS
		while (eat(/^\s+/) || eat(LA_BLOCK_COMMENT)){}
	}
	private  evalId(id: string): any {
		switch (id) {
			case 'Math': return Math;
			case 'undefined': return undefined;
			case 'undefined': return undefined;
			case 'int': return int;
			case 'uint': return uint;
			case 'String': return String;
			case 'string': return String;
			case 'Number': return Number;
			case 'true': return true;
			case 'false': return false;
			default:
				for each (var thiz: any in scopes) if (id in thiz) return thiz[id];
				return undefined;
		}
	}
	private  wrapId(id: string) {
		return function(): any{ return evalId(id); };
	}
	private  evalDot(obj: Record<string, any>,key: string): any {
		if (!(key in obj)) return undefined;
	var  y: any = obj[key];
		if (y is Function) {
			y = Utils.bindThis(y,obj);
		}
		return y;
	}
	
	private  wrapVal(x: any) {
		return function (): any { return x; };
	}
	/**
	 * @param fn ()=>( (args)=>any )
	 * @param args (()=>arg)[]
	 */
	private  wrapCall(fn,args:/*Function*/Array) {
		return function (): any {
		var  a: any[] = [];
			for (var i: number = 0, n: number = args.length; i < n; i++) a[i] = args[i]();
			return (fn() as Function).apply(undefined, a);
		};
	}
	private  wrapIf(condition,then,elze) {
		return functionIf(condition,then,elze);
	}
	private  wrapDot(obj,index) {
		return function(): any {
			return evalDot(obj(),index());
		};
	}
	private  wrapOp(x,op: string,y) {
		return function(): any {
			return calculate(x,op,y);
		};
	}
	private  wrapNot(x) {
		return function(): any {
			return !x();
		};
	}
	private  wrapArray(array:/*Function*/Array) {
		return function(): any[] {
			return array.map(function (el,id: number,arr: any[]): any {
				return el();
			})
		};
	}
	
	public static  escapeString(s: string): string {
		return s.replace(/\n/g,'\n').replace(/\r/g,'\r').replace(/'/g,"\\'").replace(/"/g,'\\"').replace(/\\/g,'\\\\');
	}
}

