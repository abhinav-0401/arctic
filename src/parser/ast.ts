import { TokenType } from "../lexer/token"

export type NodeType =
  | "Program"
  | "NumericLiteral"
  | "Identifier"
  | "BinaryExpr";

export class Stmt {
  kind: NodeType;

  constructor(kind: NodeType) {
    this.kind = kind;
  }
}

export class Program extends Stmt {
  body: Stmt[] = [];

  constructor(body: Stmt[]) {
    super("Program");
    this.body = body;
  }
}

export class Expr extends Stmt {
  constructor(kind: NodeType) {
    super(kind);
  }
}

export class BinaryExpr extends Expr {
  left: Expr;
  right: Expr;
  operator: string;

  constructor(left: Expr, right: Expr, operator: string) {
    super("BinaryExpr");
    this.left = left;
    this.right = right;
    this.operator = operator;
  }
}

export class Identifier extends Expr {
  symbol: string;

  constructor(symbol: string) {
    super("Identifier");
    this.symbol = symbol;
  }
}

export class NumericLiteral extends Expr {
  value: number;

  constructor(value: number) {
    super("NumericLiteral");
    this.value = value;
  }
}