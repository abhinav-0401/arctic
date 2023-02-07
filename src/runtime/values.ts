export type ValueType = "null" | "int" | "boolean" | "return";

export class RuntimeValue {
  type: ValueType;

  constructor(type: ValueType) {
    this.type = type;
  }
}

export class NullValue extends RuntimeValue {
  value: null;

  constructor() {
    super("null");
    this.value = null;
  }
}

export class IntValue extends RuntimeValue {
  value: number;

  constructor(value: number) {
    super("int");
    this.value = value;
  }
}

export class BooleanValue extends RuntimeValue {
  value: boolean;

  constructor(value: boolean) {
    super("boolean");
    this.value = value;
  }
}

export class ReturnValue extends RuntimeValue {
  value: RuntimeValue;

  constructor(value: RuntimeValue) {
    super("return");
    this.value = value;
  }
}