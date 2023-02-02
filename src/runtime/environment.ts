import { RuntimeValue } from "./values";
import { Stmt } from "../parser/ast";

export class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeValue>;
  private functionValues: Map<string, RuntimeValue>;
  private functions: Map<string, Stmt[]>;
  private functionEnv: Map<string, Environment>;

  constructor(parent?: Environment) {
    this.parent = parent;
    this.variables = new Map();
    this.functions = new Map();
    this.functionEnv = new Map();
  }

  declareVar(varname: string, value: RuntimeValue): RuntimeValue {
    if (this.variables.has(varname)) {
      throw `Cannot declare variable ${varname}. As it already is defined.`;
    }

    this.variables.set(varname, value);
    return value;
  }

  lookupVar(varname: string): RuntimeValue {
    const env: Environment = this.resolve(varname);
    return env.variables.get(varname) as RuntimeValue;
  }

  assignVar(varname: string, value: RuntimeValue): RuntimeValue {
    const env: Environment = this.resolve(varname);
    env.variables.set(varname, value);
    return value;
  }

  resolve(varname: string): Environment {
    if (this.variables.has(varname)) {
      return this;
    }

    if (this.parent === undefined) {
      throw `Cannot resolve '${varname}' as it does not exist.`;
    }

    return this.parent.resolve(varname);
  }

  declareFun(funName: string, body: Stmt[]) {
    if (this.functions.has(funName)) {
      throw `Cannot declare function ${funName}. As it already is defined.`;
    }

    this.functions.set(funName, body);
    // this.functionEnv.set(funName, new Environment());
  }

  lookupFun(funName: string): Stmt[] {
    const env: Environment = this.resolveFun(funName);
    return env.functions.get(funName) as Stmt[];
  }

  lookupFunEnv(funName: string): Environment {
    return this.functionEnv.get(funName) as Environment;
  }

  setParentEnv(env: Environment): void {
    this.parent = env;
  }

  setFunEnv(funName: string, funEnv: Environment) {
    this.functionEnv.set(funName, funEnv);
  }

  destroyFunEnv(funName: string): void {
    this.functionEnv.delete(funName);
  }

  // assignFun(funName: string, value: RuntimeValue): RuntimeValue {
  //   const env: Environment = this.resolve(funName);
  //   env.functions.set(funName, value);
  //   return value;
  // }

  resolveFun(funName: string): Environment {
    if (this.functions.has(funName)) {
      return this;
    }

    if (this.parent === undefined) {
      throw `Cannot resolve '${funName}' as it does not exist.`;
    }

    return this.parent.resolveFun(funName);
  }

}