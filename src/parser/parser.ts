import { Token, TokenType } from "../lexer/token";
import { 
  Stmt, Program, Expr, IntLiteral, Identifier, BinaryExpr, IfExpr,                  // expressions
  VarDeclaration, VarAssignment, FunDeclaration, PrintStmt, FunCall, ReturnStmt,    // statements
} from "./ast";

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
    switch (this.peek().type) {
      case TokenType.Let:
        return this.parseVarDeclaration();
      case TokenType.Identifier:
        return this.parseVarAssignment();
      case TokenType.Function:
        return this.parseFunDeclaration();
      case TokenType.Print:
        return this.parsePrint();
      case TokenType.Return:
        return this.parseReturnStmt();
      default:
        return this.parseExpr();
    }
  }

  parseVarDeclaration(): Stmt {
    const letToken: Token = this.advance();
    const varName: string = this.expect(TokenType.Identifier).literal;
    
    if (this.peek().type === TokenType.Semicolon) {
      this.advance();
      return new VarDeclaration(varName);
    }

    const equal: Token = this.expect(TokenType.Assign);
    const valExpr: Expr = this.parseExpr();
    console.log(valExpr);
    const semi: Token = this.expect(TokenType.Semicolon);
    return new VarDeclaration(varName, valExpr);
  }

  parseVarAssignment(): Stmt {
    const varName: string = this.peek().literal;

    if (this.peekNext().type === TokenType.Assign) {
      this.advance(); // eat the identifier token as wee already have it
      this.advance(); // eat the equals sign as we have already checked for it
      const valExpr: Expr = this.parseExpr();
      const semi: Token = this.expect(TokenType.Semicolon);
      return new VarAssignment(varName, valExpr);
    }
    return this.parseExpr();
  }

  parseFunDeclaration(): Stmt {
    const body: Stmt[] = [];

    this.advance();   // skip the "fun" keyword
    const funName: Token = this.advance();

    this.expect(TokenType.LeftParenthesis);
    this.expect(TokenType.RightParenthesis);
    this.expect(TokenType.LeftBrace);

    while (this.peek().type !== TokenType.RightBrace) {
      const funStmt: Stmt = this.parseStmt();
      body.push(funStmt);
    }
    this.advance();   // get past the closing brace

    return new FunDeclaration(funName.literal, body);
  }

  parsePrint(): Stmt {
    this.advance();   // skip the "print" keyword

    const expr: Expr = this.parseExpr();
    this.expect(TokenType.Semicolon);

    return new PrintStmt(expr);
  }

  parseReturnStmt(): Stmt {
    this.advance();   // skip the "return" keyword

    if (this.peek().type !== TokenType.Semicolon) {
      const value: Expr = this.parseExpr();
      this.expect(TokenType.Semicolon);  
      return new ReturnStmt(value);
    } else {
      this.advance();
      return new ReturnStmt();
    }
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
    let left: Expr = this.parseConditionalExpr();

    while (
      this.peek().type === TokenType.Asterisk ||
      this.peek().type === TokenType.Slash
    ) {
      const operator: Token = this.advance();
      const right: Expr = this.parseConditionalExpr();

      left = new BinaryExpr(left, right, operator.literal);
    }

    return left;
  }

  parseConditionalExpr(): Expr {
    let left: Expr = this.parsePrimary();

    while (
      this.peek().type === TokenType.GreaterThan ||
      this.peek().type === TokenType.LessThan ||
      this.peek().type === TokenType.Equal ||
      this.peek().type === TokenType.NotEqual
    ) {
      const operator: Token = this.advance();
      const right: Expr = this.parsePrimary();

      left = new BinaryExpr(left, right, operator.literal);
    }

    return left;
  }

  parseFunCall(identToken: Token): Expr {
    this.advance();     // we already know that there is a left parenthesis
    this.expect(TokenType.RightParenthesis);

    return new FunCall(identToken.literal);
  }

  parseIfExpr(): Expr {
    this.expect(TokenType.LeftParenthesis);
    console.log("inside if expr");

    const condition: Expr = this.parseExpr();
    if (!condition) { throw "An if expression must have a condition within parenthesis"; }
    
    this.expect(TokenType.RightParenthesis);
    this.expect(TokenType.LeftBrace);
    
    const ifBlock: Stmt[] = [];
    const elseBlock: Stmt[] = [];

    while (this.peek().type !== TokenType.RightBrace) {
      ifBlock.push(this.parseStmt());
    }
    this.advance();
    console.log(this.peek());

    if (this.peek().type === TokenType.Else) {
      this.advance();

      this.expect(TokenType.LeftBrace);
      while (this.peek().type !== TokenType.RightBrace) {
        elseBlock.push(this.parseStmt());
      }
      this.advance();

      return new IfExpr(condition, ifBlock, elseBlock);
    } else {
      return new IfExpr(condition, ifBlock);
    }
  }

  parsePrimary(): Expr {
    let currentToken: Token = this.advance();

    switch (currentToken.type) {
      case TokenType.Identifier:
        if (this.peek().type === TokenType.LeftParenthesis) {
          return this.parseFunCall(currentToken);
        } else {
          return new Identifier(currentToken.literal);
        }
      case TokenType.Int:
        return new IntLiteral(parseInt(currentToken.literal));
      // case TokenType.Null:
      //   return new NullLiteral();
      case TokenType.LeftParenthesis:
        let expr: Expr = this.parseExpr();
        if (this.advance().type === TokenType.RightParenthesis) {
          return expr;
        }
      case TokenType.If:
        return this.parseIfExpr();
      case TokenType.GreaterThan:
      case TokenType.LessThan:
      case TokenType.Equal:
      case TokenType.NotEqual:
        return this.parseConditionalExpr();
      default:
        console.error("Token not supported by the parser :/", currentToken, this.peek(), this.peekNext());
        process.exit(1);
    }
  }

  peek(): Token {
    return this.tokens[this.index];
  }

  peekNext(): Token {
    return this.tokens[this.index + 1];
  }

  advance(): Token {
    const token = this.tokens[this.index];
    ++this.index;
    return token;
  }

  isEOF(): boolean {
    return this.tokens[this.index].type === TokenType.EOF;
  }

  expect(expectedType: TokenType): Token {
    const parsed: Token = this.advance();

    if (parsed.type === expectedType) {
      return parsed;
    } else {
      console.error(`Expected ${TokenType[expectedType as keyof typeof TokenType]}, found ${parsed.toString()}`);
      process.exit(1);
    }
  }
}