/**
 * Coded by aimozg on 27.08.2017.
 */

export class SwitchStmt extends Statement{
	public  valueExpr:Eval;
	public  cases:/*CaseStmt*/Array = [];
	public  defaults:StmtList = new StmtList();

	public  SwitchStmt(valueAttr: string =undefined) {
		if (valueAttr) valueExpr = Eval.compile(valueAttr);
	}

	public  execute(context:ExecContext): void {
	var  hasValue: boolean = valueExpr != undefined;
	var  value: any          = hasValue ? valueExpr.vcall(context.scopes) : undefined;
		if (hasValue) context.debug(this,'value = '+value);
		else context.debug(this,'enter');
		for each (var block:CaseStmt in cases) {
			if (block.check(context, hasValue, value)) {
				context.execute(block);
				return;
			}
		}
		context.debug(this,'default');
		context.execute(defaults);
	}

	public  toString(): string {
		return '<switch'+(valueExpr?' value="'+valueExpr.src+'">':'')+
				' [case '+cases.length+']'+
				' [default '+defaults.stmts.length+'] </switch>';
	}
}

