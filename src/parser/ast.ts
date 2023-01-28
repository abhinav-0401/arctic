import { TokenType } from "../lexer/token"

export type NodeType =
  // Statements
  | "Program"
  | "VarDeclaration"
  | "VarAssignment"
  // Expressions
  | "IntLiteral"
  | "NullLiteral"
  | "Identifier"
  | "BinaryExpr";

export class Stmt {
  type: NodeType;

  constructor(type: NodeType) {
    this.type = type;
  }
}

export class Program extends Stmt {
  body: Stmt[] = [];

  constructor(body: Stmt[]) {
    super("Program");
    this.body = body;
  }
}

export class VarDeclaration extends Stmt {
  identifier: string;
  value?: Expr;

  constructor(identifier: string, value?: Expr) {
    super("VarDeclaration");
    this.identifier = identifier;
    this.value = value;
  }
}

export class VarAssignment extends Stmt {
  identifier: string;
  value: Expr;

  constructor(identifier: string, value: Expr) {
    super("VarAssignment");
    this.identifier = identifier;
    this.value = value;
  }
}

export class Expr extends Stmt {
  constructor(type: NodeType) {
    super(type);
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

export class IntLiteral extends Expr {
  value: number;

  constructor(value: number) {
    super("IntLiteral");
    this.value = value;
  }
}