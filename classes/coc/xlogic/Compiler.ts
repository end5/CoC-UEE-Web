/**
 * Coded by aimozg on 27.08.2017.
 */

export class Compiler {
	public  Compiler() {
	}
	public  compile(x:XML):Statement {
		switch (x.nodeKind()) {
			case "element":
				return compileTag(x.localName(),x);
			case "text":
				if (Utils.trimSides(x.toString()) == '') return undefined;
				return compileText(x);
			default:
				return undefined;
		}
	}
	protected  compileTag(tag: string,x:XML):Statement {
		switch (tag) {
			case 'if':
				return compileIf(x);
			case 'switch':
				return compileSwitch(x);
			default:
				return unknownTag(tag,x);
		}
	}
	protected  compileText(x:XML):Statement{
		throw new Error("Encountered text element "+x.toString().substr(0,20));
	}
	protected  unknownTag(tag: string,x:XML):Statement {
		throw new Error("Unknown tag "+tag);
	}
	public  compileChildren(x:XML):StmtList {
		return new StmtList(compileChildrenInto(x,[]));
	}
	protected  compileChildrenInto(x:XML,stmts:/*Statement*/Array):/*Statement*/Array {
		for each(var item:XML in x.children()) {
		var  e:Statement = compile(item);
			if (e is StmtList) {
				stmts.push.apply(stmts,(e as StmtList).stmts)
			} else if (e) stmts.push(e);
		}
		return stmts;
	}
	public  compileXMLList(x:XMLList):StmtList {
		return new StmtList(compileXMLListInto(x,[]));
	}
	protected  compileXMLListInto(x:XMLList,stmts:/*Statement*/Array):/*Statement*/Array {
		for each(var item:XML in x) {
		var  e:Statement = compile(item);
			if (e is StmtList) {
				stmts.push.apply(stmts,(e as StmtList).stmts)
			} else if (e) stmts.push(e);
		}
		return stmts;
	}
	public  compileIf(x:XML):IfStmt {
	var  item:XML;
	var  attrs: any = attrMap(x);
	var  iff:IfStmt = new IfStmt(attrs['test']);
		if ('then' in attrs) iff.thenBlock.push(compileText(x.@then[0]));
		if ('else' in attrs) iff.elseBlock = compileText(x.attribute('else')[0]);
		//noinspection JSMismatchedCollectionQueryUpdate
	var  currentThen:/*Statement*/Array = iff.thenBlock;
	var  currentIf:IfStmt = iff;
	var  versionLock: number = 0;
	var  hasElse: boolean = false;
	var  hasElseIf: boolean = false;
		for each(item in x.children()) {
			switch (item.localName()) {
				case 'else':
					if (hasElse) {
						throw new Error("Duplicate <else> element");
					}
					if (item.children() > 0) {
						iff.elseBlock = compileChildren(item);
						hasElse = true;
						versionLock = 1;
					} else {
						currentIf.elseBlock = new StmtList();
						currentThen = (currentIf.elseBlock as StmtList).stmts;
						hasElse = true;
						versionLock = 1;
					}
					break;
				case 'elseif':
					if (hasElse) {
						throw new Error("<elseif> after <else>");
					}
					if (item.children() > 0) {
						if (versionLock == 2) {
							throw new Error("Inconsistent <elseif> versions (v2 after v1)")
						}
						if (hasElseIf) {
							throw new Error("Duplicate <elseif> in v1 <if>-block")
						}
						iff.elseBlock = compileIf(item);
						versionLock = 1;
						hasElseIf = true;
					} else {
						if (versionLock == 1) {
							throw new Error("Inconsistent <elseif> versions (v1 after v2)")
						}
					var  newIf:IfStmt = new IfStmt(item.@test);
						currentIf.elseBlock = newIf;
						newIf.elseBlock = new StmtList();
						currentThen = newIf.thenBlock;
						currentIf = newIf;
						versionLock = 2;
					}
					break;
				default:
				var  e:Statement = compile(item);
					if (e is StmtList) {
						currentThen.push.apply(currentThen,(e as StmtList).stmts)
					} else if (e) currentThen.push(e);
			}
		}
		return iff;
	}
	public  compileSwitch(x:XML):SwitchStmt {
	var  sattrs: Record<string, any> = attrMap(x);
	var  hasval: boolean           = 'value' in sattrs;
	var  zwitch:SwitchStmt = new SwitchStmt(sattrs['value']);
		for each(var xcase:XML in x.elements()) {
			switch(xcase.localName()) {
				case 'case':
				var  cattrs: Record<string, any> = attrMap(xcase);
				var  caze:CaseStmt = new CaseStmt();
					caze.testAttr = cattrs['test'];
					caze.valueAttr = cattrs['value'];
					caze.valuesAttr = cattrs['values'];
					caze.ltAttr = cattrs['lt'];
					caze.lteAttr = cattrs['lte'];
					caze.gtAttr = cattrs['gt'];
					caze.gteAttr = cattrs['gte'];
					caze.neAttr = cattrs['ne'];
					compileChildrenInto(xcase,caze.thenBlock.stmts);
					zwitch.cases.push(caze);
					break;
				case 'default':
					compileChildrenInto(xcase,zwitch.defaults.stmts);
					break;
			}
		}
		return zwitch;
	}
	public static  attrMap(x:XML): Record<string, any> {
	var  e: Record<string, any> = {};
		for each (var k:XML in x.attributes()) {
			e[k.localName()] = k.toString();
		}
		return e;
	}
}

