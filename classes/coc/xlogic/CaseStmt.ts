/**
 * Coded by aimozg on 27.08.2017.
 */

export class CaseStmt extends Statement {
	private  testExpr:Eval;
	private  valueExpr:Eval;
	private  valuesExpr:Eval;
	private  ltExpr:Eval;
	private  lteExpr:Eval;
	private  gtExpr:Eval;
	private  gteExpr:Eval;
	private  neExpr:Eval;
	public  thenBlock:StmtList = new StmtList();
	public  set testAttr(value: string): void {
		testExpr = value ? Eval.compile(value) : undefined;
	}
	public  set valueAttr(value: string): void {
		valueExpr = value ? Eval.compile(value) : undefined;
	}
	public  set valuesAttr(value: string): void {
		valuesExpr = value ? Eval.compile('[' + value + ']') : undefined;
	}
	public  set ltAttr(value: string): void {
		ltExpr = value ? Eval.compile(value) : undefined;
	}
	public  set lteAttr(value: string): void {
		lteExpr = value ? Eval.compile(value) : undefined;
	}
	public  set gtAttr(value: string): void {
		gtExpr = value ? Eval.compile(value) : undefined;
	}
	public  set gteAttr(value: string): void {
		gteExpr = value ? Eval.compile(value) : undefined;
	}
	public  set neAttr(value: string): void {
		neExpr = value ? Eval.compile(value) : undefined;
	}
	public  CaseStmt() {
	}
	public  check(context:ExecContext, useValue: boolean, checkValue: any): boolean {
		if (testExpr != undefined && testExpr.vcall(context.scopes)) {
			context.debug(this, ' => test true');
			return true;
		}
		if (useValue) {
		var  pass: boolean = true;
			if (valueExpr) pass &&= checkValue == valueExpr.vcall(context.scopes);
			if (valuesExpr) pass &&= valuesExpr.vcall(context.scopes).indexOf(checkValue) >= 0;
			if (ltExpr) pass &&= checkValue < ltExpr.vcall(context.scopes);
			if (lteExpr) pass &&= checkValue <= lteExpr.vcall(context.scopes);
			if (gtExpr) pass &&= checkValue > gtExpr.vcall(context.scopes);
			if (gteExpr) pass &&= checkValue >= gteExpr.vcall(context.scopes);
			if (neExpr) pass &&= checkValue != neExpr.vcall(context.scopes);
			context.debug(this, pass?'value pass':'value fail');
			return pass;
		}
		context.debug(this, 'skip');
		return false;
	}

	public  execute(context:ExecContext): void {
		context.execute(thenBlock);
	}

	public  toString(): string {
		return '<case' +
				(testExpr ? ' test="' + testExpr.src + '"' : '') +
				(valueExpr ? ' value="' + valueExpr.src + '"' : '') +
				(valuesExpr ? ' values="' + valuesExpr.src + '"' : '') +
				(ltExpr ? ' lt="' + ltExpr.src + '"' : '') +
				(lteExpr ? ' lte="' + lteExpr.src + '"' : '') +
				(gtExpr ? ' gt="' + gtExpr.src + '"' : '') +
				(gteExpr ? ' gte="' + gteExpr.src + '"' : '') +
				(neExpr ? ' ne="' + neExpr.src + '"' : '') +
				'> [' + thenBlock.stmts.length + '] </case>'
	}
}

