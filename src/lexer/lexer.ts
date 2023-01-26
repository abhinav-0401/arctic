import { TokenType, Token, keywordMap } from "./token";
// import { tokenise } from "./static-helpers";

export class Lexer {
  private src: string;
  private index: number = 0;
  private peekIndex: number = 1;
  private srcLen: number;

  constructor(src: string) {
    this.src = src;
    this.srcLen = src.length;
  }

  lex(src: string): Token[] {
    const tokens: Token[] = [];

    while (this.index < this.srcLen) {
      let char: string = this.advance();
      
      const newToken = this.tokenise(char);
      if (newToken.type === TokenType.IDK) {
        continue;
      } else {
        tokens.push(newToken);
      }
    }
    
    tokens.push(new Token(TokenType.EOF, ""));
    return tokens;
  }

  tokenise(char: string): Token {
    const token = new Token(TokenType.IDK, "");

    switch (char) {
      case '=':
        token.type = TokenType.Assign;
        token.literal = char;
        break;
      case '==':
        token.type = TokenType.Equal;
        token.literal = char;
        break;
      case '!=':
        token.type = TokenType.NotEqual;
        token.literal = char;
        break;
      case '+':
        token.type = TokenType.Plus;
        token.literal = char;
        break;
      case '-':
        token.type = TokenType.Minus;
        token.literal = char;
        break;
      case '*':
        token.type = TokenType.Asterisk;
        token.literal = char;
        break;
      case '!':
        token.type = TokenType.Bang;
        token.literal = char;
        break;
      case '>':
        token.type = TokenType.GreaterThan;
        token.literal = char;
        break;
      case '<':
        token.type = TokenType.LessThan;
        token.literal = char;
        break;
      case '/':
        token.type = TokenType.Slash;
        token.literal = char;
        break;
      case ';':
        token.type = TokenType.Semicolon;
        token.literal = char;
        break;
      case ',':
        token.type = TokenType.Comma;
        token.literal = char;
        break;
      case '(':
        token.type = TokenType.LeftParenthesis;
        token.literal = char;
        break;
      case ')':
        token.type = TokenType.RightParenthesis;
        token.literal = char;
        break;
      case '{':
        token.type = TokenType.LeftBrace;
        token.literal = char;
        break;
      case '}':
        token.type = TokenType.RightBrace;
        token.literal = char;
        break;
      case '[':
        token.type = TokenType.LeftBracket;
        token.literal = char;
        break;
      case ']':
        token.type = TokenType.RightBracket;
        token.literal = char;
        break;
      case ':':
        token.type = TokenType.Colon;
        token.literal = char;
        break;
      case ' ':
      case '/t':
      case '/r':
      case '/n':
        break;
      default:
        if (this.isDigit(char)) {
          const intToken: Token = this.tokeniseNumber(char);
          token.type = intToken.type;
          token.literal = intToken.literal;
          break;
        } else if (this.isAlpha(char)) {
          const identToken: Token = this.tokeniseIdent(char);
          token.type = identToken.type;
          token.literal = identToken.literal;
          break;
        } else {
          break;
        }
    }

    return token;
  }


  isDigit(char: string): boolean {
    const digitRegex = /^\d$/;
    return digitRegex.test(char);
  }

  isAlpha(char: string): boolean {
    return (new RegExp("[a-zA-Z]")).test(char);
  }

  isAlphaNumeric(char: string): boolean {
    return (new RegExp("[a-zA-Z0-9]")).test(char);
  }

  isKeyword(literal: string): boolean {
    return keywordMap.has(literal);
  }

  tokeniseNumber(char: string): Token {
    const intToken = new Token(TokenType.Int, "");
    intToken.literal = intToken.literal.concat(char);

    while (this.isDigit(this.peek())) {
      intToken.literal = intToken.literal.concat(this.advance());
    }

    return intToken;
  }

  tokeniseIdent(char: string): Token {
    const identToken = new Token(TokenType.IDK, "");
    identToken.literal = identToken.literal.concat(char);

    while (this.isAlphaNumeric(this.peek())) {
      identToken.literal = identToken.literal.concat(this.advance());
    }

    if (this.isKeyword(identToken.literal)) {
      identToken.type = keywordMap.get(identToken.literal) as TokenType;
    } else {
      identToken.type = TokenType.Identifier;
    }

    return identToken;
  }

  advance(): string {
    let char: string = this.src[this.index];

    ++this.index;
    ++this.peekIndex;
    return char;
  }

  peek(): string {
    return this.src[this.index];
  }

  peekNext(): string {
    return this.src[this.peekIndex];
  }

  static printTokens(tokens: Token[]): void {
    for (const token of tokens) {
      console.log(token.toString());
    }
  }
}

