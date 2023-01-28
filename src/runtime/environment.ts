import { RuntimeValue } from "./values";

export class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeValue>;

  constructor(parent?: Environment) {
    this.parent = parent;
    this.variables = new Map();
  }

  declareVar(varname: string, value: RuntimeValue): RuntimeValue {
    if (this.variables.has(varname)) {
      throw `Cannot declare variable ${varname}. As it already is defined.`;
    }

    this.variables.set(varname, value);
    return value;
  }

  lookupVar(varname: string): RuntimeValue {
    const env = this.resolve(varname);
    return env.variables.get(varname) as RuntimeValue;
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
}