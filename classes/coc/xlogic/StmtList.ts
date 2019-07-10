/**
 * Coded by aimozg on 27.08.2017.
 */
export class StmtList extends Statement{
	private  _stmts:/*Statement*/Array = [];

	public  get stmts(): any[] {
		return _stmts;
	}
	public  StmtList(init:/*Statement*/Array = undefined) {
		if (init!=undefined) _stmts.push.apply(_stmts,init);
	}

	public  execute(context:ExecContext): void {
		context.executeAll(_stmts);
	}
}

