/**
 * Coded by aimozg on 06.07.2018.
 */
export class CallStmt extends Statement{
	private  fn;
	private  passContext: boolean;
	public  CallStmt(fn, passContext: boolean =false) {
		this.fn = fn;
		this.passContext = passContext;
	}
	
	public  execute(context:ExecContext): void {
		if (passContext) fn(context);
		else fn();
	}
}

