import { Conveyor } from "./";
import { binaryOperator, Token, TokenType, unaryOperator } from "../types";

export class Lexer {
  private conveyor: Conveyor<string>;
  private tokens: Token[];
  

  constructor() {
    this.conveyor = new Conveyor();
    this.tokens = [];
  }

  public lex(str: string): Token[] {
    this.reset();
    this.conveyor.add(str.split(''));
    let current = this.conveyor.peek();
    while (!current.done) {
      const char = current.value;
      const success = 
        this.lexSpace(char) ||
        this.lexComma(char) ||
        this.lexOperator(char) ||
        this.lexParenthesis(char) ||
        this.lexNumber(char) ||
        this.lexKeyword(char);
      if (!success) throw new Error(`Invalid token ${char}`);
      current = this.conveyor.peek();
    }
    return this.tokens;
  }


  private reset(): void {
    this.conveyor = new Conveyor();
    this.tokens = [];
  }

  private lexSpace(char: string): boolean {
    if (!Lexer.isSpace(char)) return false;

    this.conveyor.next();
    return true;
  }
  
  private lexComma(char: string): boolean {
    if (!Lexer.isComma(char)) return false;

    this.tokens.push({ type: TokenType.Comma, value: ',' });
    this.conveyor.next();
    return true;
  }

  private lexOperator(char: string): boolean {
    if (!Lexer.isOperator(char)) return false;

    let next = this.conveyor.peek();
    let operator = '';
    while (!next.done) {
      const temp = operator + next.value;
      if (unaryOperator.every(o => !o.startsWith(temp)) && binaryOperator.every(o => !o.startsWith(temp))) break;
      operator = temp;
      this.conveyor.next();
      next = this.conveyor.peek();
    }

    if (!operator.length) throw new Error('Invalid operator');
    this.tokens.push({ type: TokenType.Operator, value: operator });
    return true;
  }

  private lexParenthesis(char: string): boolean {
    if (!Lexer.isParenthesis(char)) return false;

    this.tokens.push({ type: TokenType.Parenthesis, value: this.conveyor.peek().value });
    this.conveyor.next();
    return true;
  }

  private lexNumber(char: string): boolean {
    if (!Lexer.isNumber(char)) return false;

    let number = '', pointCount = 0;
    let next = this.conveyor.peek();
    while (!next.done) {
      const temp = next.value;
      if (!Lexer.isNumber(temp)) break;
      if (temp === '.' && pointCount++) throw new Error('Two decimal points in a number.');
      number += temp;
      this.conveyor.next();
      next = this.conveyor.peek();
    }

    this.tokens.push({ type: TokenType.Number, value: number });
    return true;
  }

  private lexKeyword(char: string): boolean {
    if (!Lexer.isKeyword(char)) return false;

    let keyword = '';
    let next = this.conveyor.peek();
    while (!next.done) {
      const temp = next.value;
      if (!Lexer.isKeyword(temp)) break;
      keyword += temp;
      this.conveyor.next();
      next = this.conveyor.peek();
    }

    this.tokens.push({ type: TokenType.Keyword, value: keyword });
    return true;
  }


  private static isSpace(char: string): boolean {
    return /[ \n\r]/.test(char);
  }

  private static isComma(char: string): boolean {
    return char === ',';
  }

  private static isOperator(char: string): boolean {
    return /[*/%+\-<>&^|~]/.test(char);
  }

  private static isParenthesis(char: string): boolean {
    return /[\(\)]/.test(char);
  }

  private static isNumber(char: string): boolean {
    return /[\.0-9]/.test(char);
  }

  private static isKeyword(char: string): boolean {
    return /\w/.test(char);
  }
}