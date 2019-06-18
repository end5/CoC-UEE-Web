/**
 * Created by aimozg on 13.05.2017.
 */

export class Profiling {
function  Profiling() {
	}

	private static  PF_LOGGER:ILogger        = LoggerFactory.getLogger(Profiling);
	private static  PF_DEPTH: number               = 0; // Callstack depth
	private static  PF_NAME: any[]            = [];// Callstack method names
	private static  PF_START: any[]           = [];// Callstack of Begin() times
	private static  PF_ARGS: any[]            = [];// Callstack of method arguments
	private static  PF_COUNT: Record<string, any>          = {};// method -> times called
	private static  PF_TIME: Record<string, any>           = {};// method -> total execution time
	private static  shouldProfile(classname: string, methodName: string): boolean {
		return true;
	}
	private static  shouldReportProfiling(classname: string, origMethodName: string, dt: number, pfcount: number): boolean {
		return dt > 100;
	}
	public static  LogProfilingReport(): void {
		for (var key: string in PF_COUNT) {
		var  s: string    = "[PROFILE] ";
			s += key;
		var  pfcount: number = PF_COUNT[key];
			s += ", called " + pfcount + " times";
		var  pftime: any    = PF_TIME[key];
			s += ", total time ";
			if (pftime > 10000) s += Math.floor(pftime / 1000) + "s";
			else s += pftime + "ms";
			if (pftime > 0 && pfcount > 0) {
				s += ", avg time " + (pftime / pfcount).toFixed(1) + "ms";
			}
			PF_LOGGER.info(s);
		}
	}
	public static  Begin(classname: string, methodName: string, ...rest: any[]): void {
		if (!shouldProfile(classname, methodName)) return;
		methodName           = classname + "." + methodName;
		PF_NAME[PF_DEPTH]    = methodName;
		PF_START[PF_DEPTH]   = new Date().getTime();
		PF_ARGS[PF_DEPTH]    = rest;
		PF_COUNT[methodName] = (PF_COUNT[methodName] | 0) + 1;
		PF_DEPTH++;
	}
	public static  End(classname: string, methodName: string): void {
		if (!shouldProfile(classname, methodName)) return;
	var  origMethodName: string = methodName;
		methodName                = classname + "." + methodName;
	var  t1: number             = new Date().getTime();
		PF_DEPTH--;
		while (PF_DEPTH >= 0 && PF_NAME[PF_DEPTH] != methodName) {
			PF_LOGGER.error("[ERROR] Inconsistent callstack, expected '" + methodName + "', got '" + PF_NAME[PF_DEPTH] + "'(" +
							PF_ARGS[PF_DEPTH].join() + ")");
			PF_DEPTH--;
		}
		if (PF_DEPTH < 0) {
			PF_LOGGER.error("[ERROR] Empty callstack, expected '" + methodName + "'");
			PF_DEPTH = 0;
			return;
		}
	var  dt: number       = t1 - PF_START[PF_DEPTH];
		PF_TIME[methodName] = (PF_TIME[methodName] | 0) + dt;
	var  pfcount: number     = PF_COUNT[methodName];
	var  args: any[]      = PF_ARGS[PF_DEPTH];
		if (shouldReportProfiling(classname, origMethodName, dt, pfcount)) {
		var  s: string = "[PROFILE] ";
			for (var i: number = PF_DEPTH; i-- > 0;) s += "  ";
			s += methodName;
			if (args.length > 0) s += "(" + args.join(", ") + ")";
			s += " " + dt + "ms";
			if (pfcount > 1) {
				s += ", called " + pfcount + " times";
			var  pftime: any = PF_TIME[methodName];
				if (pftime > 0) {
					s += ", total time ";
					if (pftime > 10000) s += Math.floor(pftime / 1000) + "s";
					else s += pftime + "ms";
					s += ", avg time " + (pftime / pfcount).toFixed(1) + "ms";
				}
			}
			PF_LOGGER.info(s);
		}
	}
}

