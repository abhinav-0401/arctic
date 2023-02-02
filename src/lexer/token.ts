export enum TokenType {
  // Null,
  EOF,

  // Identifiers and literals
  Identifier,
  Int,

  // Operators
  Assign,
  Plus,
  Minus,
  Bang,
  Asterisk,
  Slash,
  LessThan,
  GreaterThan,
  Equal,
  NotEqual,

  // Delimiters
  Comma,
  Semicolon,

  // Keywords
  Function,
  Procedure,
  Let,
  // True,
  // False,
  If,
  Else,
  Return,
  Print,

  LeftParenthesis,
  RightParenthesis,
  LeftBrace,
  RightBrace,

  String,

  LeftBracket,
  RightBracket,

  Colon,

  // placeholder token type
  IDK
}

export const keywordMap: Map<string, TokenType> = new Map([
  ["fun", TokenType.Function],
  ["let", TokenType.Let],
  // ["proc", TokenType.Procedure],
  // ["true", TokenType.True],
  // ["false", TokenType.False],
  ["if", TokenType.If],
  ["else", TokenType.Else],
  ["return", TokenType.Return],
  // ["null", TokenType.Null],
  ["print", TokenType.Print],
]);

export class Token {
  public type: TokenType;
  public literal: string;

  constructor(type: TokenType, literal: string) {
    this.type = type;
    this.literal = literal;
  }

  toString(): string {
    return `[TokenType: ${TokenType[this.type as keyof typeof TokenType]}, Literal: ${this.literal}]`;
  }
}