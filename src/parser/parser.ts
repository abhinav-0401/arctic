import { Token, TokenType } from "../lexer/token";
import { Stmt, Program, Expr, IntLiteral, NullLiteral, Identifier, BinaryExpr } from "./ast";

export class Parser {
  private index: number;
  private tokens: Token[];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.index = 0;
  }

  produceAST(): Program {
    const program: Program = new Program([]);

    while (!this.isEOF()) {
      program.body.push(this.parseStmt());
    }

    return program;
  }

  parseStmt(): Stmt {
    return this.parseExpr();
  }

  parseExpr(): Expr {
    return this.parseAdditiveExpr();
  }

  parseAdditiveExpr(): Expr {
    let left: Expr = this.parseMultiplicative();

    while (
      this.peek().type === TokenType.Plus || 
      this.peek().type === TokenType.Minus
    ) {
      const operator: Token = this.advance();
      const right: Expr = this.parseMultiplicative();
      
      left = new BinaryExpr(left, right, operator.literal);
    }

    return left;
  }

  parseMultiplicative(): Expr {
    let left: Expr = this.parsePrimary();

    while (
      this.peek().type === TokenType.Asterisk ||
      this.peek().type === TokenType.Slash
    ) {
      const operator: Token = this.advance();
      const right: Expr = this.parsePrimary();

      left = new BinaryExpr(left, right, operator.literal);
    }

    return left;
  }

  parsePrimary(): Expr {
    let currentToken: Token = this.advance();

    switch (currentToken.type) {
      case TokenType.Identifier:
        return new Identifier(currentToken.literal);
      case TokenType.Int:
        return new IntLiteral(parseInt(currentToken.literal));
      case TokenType.Null:
        return new NullLiteral();
      case TokenType.LeftParenthesis:
        let expr: Expr = this.parseExpr();
        if (this.advance().type === TokenType.RightParenthesis) {
          return expr;
        }
      default:
        console.error("Token not supported by the parser :/", currentToken);
        process.exit(1);
    }
  }

  peek(): Token {
    return this.tokens[this.index];
  }

  advance(): Token {
    const token = this.tokens[this.index];
    ++this.index;
    return token;
  }

  isEOF(): boolean {
    return this.tokens[this.index].type === TokenType.EOF;
  }
}