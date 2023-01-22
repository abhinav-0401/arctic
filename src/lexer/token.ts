export enum TokenType {
  Illegal,
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
  Let,
  True,
  False,
  If,
  Else,
  Return,

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
  ["true", TokenType.True],
  ["false", TokenType.False],
  ["if", TokenType.If],
  ["else", TokenType.Else],
  ["return", TokenType.Return],
]);

export class Token {
  public type: TokenType;
  public literal: string;

  constructor(type: TokenType, literal: string) {
    this.type = type;
    this.literal = literal;
  }

  toString(): string {
    return `[TokenType: ${this.type}, Literal: ${TokenType[this.type as keyof typeof TokenType]}]`;
  }
}