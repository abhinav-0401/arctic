import { TokenType } from "../lexer/token"

export type NodeType =
  // Statements
  | "Program"
  | "VarDeclaration"
  | "VarAssignment"
  | "FunDeclaration"
  | "PrintStmt"
  | "ReturnStmt"
  // Expressions
  | "IntLiteral"
  | "NullLiteral"
  | "Identifier"
  | "BinaryExpr"
  | "FunCall"
  | "IfExpr";

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

export class FunDeclaration extends Stmt {
  identifier: string;
  body: Stmt[];

  constructor(identifier: string, body: Stmt[]) {
    super("FunDeclaration");
    this.identifier = identifier;
    this.body = body;
  }
}

export class ReturnStmt extends Stmt {
  value: Expr;

  constructor(value: Expr) {
    super("ReturnStmt");
    this.value = value;
  }
}

export class PrintStmt extends Stmt {
  argument: Expr;

  constructor(argument: Expr) {
    super("PrintStmt");
    this.argument = argument;
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

export class FunCall extends Expr {
  identifier: string;

  constructor(identifier: string) {
    super("FunCall");
    this.identifier = identifier;
  }
}

export class IfExpr extends Expr {
  ifBlock: Stmt[];
  condition: Expr;
  elseBlock?: Stmt[];

  constructor(condition: Expr, ifBlock: Stmt[], elseBlock?: Stmt[]) {
    super("IfExpr");
    this.condition = condition;
    this.ifBlock = ifBlock;
    if (elseBlock) {
      this.elseBlock = elseBlock;
    }
  }
}