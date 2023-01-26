export type ValueType = "null" | "int";

export class RuntimeValue {
  type: ValueType;

  constructor(type: ValueType) {
    this.type = type;
  }
}

export class NullValue extends RuntimeValue {
  value: string;

  constructor() {
    super("null");
    this.value = "null";
  }
}

export class IntValue extends RuntimeValue {
  value: number;

  constructor(value: number) {
    super("int");
    this.value = value;
  }
}