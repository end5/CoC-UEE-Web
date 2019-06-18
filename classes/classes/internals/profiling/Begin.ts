/**
 * Created by aimozg on 13.05.2017.
 */

public  Begin(classname: string, methodName: string, ...rest: any[]): void {
	Profiling.Begin.apply(undefined,[classname,methodName].concat(rest));
}

