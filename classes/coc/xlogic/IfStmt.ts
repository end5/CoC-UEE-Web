/**
 * Coded by aimozg on 27.08.2017.
 */

export class IfStmt extends Statement {
	public  expr:Eval;
	public  thenBlock:/*Statement*/Array = [];
	public  elseBlock:Statement          = undefined;

	public  IfStmt(condition: string) {
		super();
		this.expr = Eval.compile(condition);
	}

	public  execute(context:ExecContext): void {
		if (expr.vcall(context.scopes)) {
			context.debug(this,'then');
			context.executeAll(thenBlock);
		} else if (elseBlock != undefined) {
			context.debug(this,'else');
			context.execute(elseBlock);
		} else {
			context.debug(this,'skip');
		}
	}

	public  toString(): string {
		return '<if test="'+expr.src+'"> [then '+thenBlock.length+'] '+
				(elseBlock?'<else/> ':'')+'</if>';
	}
}

