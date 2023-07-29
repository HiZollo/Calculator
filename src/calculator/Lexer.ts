import { Conveyor } from "./";
import { binaryOperator, Token, TokenType, unaryOperator } from "../types";

const operators = [...unaryOperator, ...binaryOperator];

export class Lexer {
  /** 用來儲存原始資料的結構 */
  private conveyor: Conveyor<string>;

  /** 用來儲存解析後的單詞 */
  private tokens: Token[];
  
  constructor() {
    this.conveyor = new Conveyor();
    this.tokens = [];
  }

  /** 分析字串的詞法 */
  public lex(str: string): Token[] {
    this.reset();
    
    // 將原始資料拆分為字元陣列
    this.conveyor.add(str.split(''));

    // 逐字元分析詞法
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

    const result = this.tokens;
    return result;
  }


  /** 清空容器 */
  private reset(): void {
    this.conveyor = new Conveyor();
    this.tokens = [];
  }

  /** 分析接下來的原始資料的含意是否為空白，如是，則加入 `#tokens` 中 */
  private lexSpace(char: string): boolean {
    if (!Lexer.isSpace(char)) return false;

    // 空白視為單詞之間的分隔
    this.conveyor.next();
    return true;
  }
  
  /** 分析接下來的原始資料的含意是否為逗號，如是，則加入 `#tokens` 中 */
  private lexComma(char: string): boolean {
    if (!Lexer.isComma(char)) return false;

    this.tokens.push({ type: TokenType.Comma, value: ',' });
    this.conveyor.next();
    return true;
  }

  /** 分析接下來的原始資料的含意是否為運算元，如是，則加入 `#tokens` 中 */
  private lexOperator(char: string): boolean {
    if (!Lexer.isOperator(char)) return false;

    let candidates = operators;
    let next = this.conveyor.peek();
    let operator = '';
    while (!next.done) {
      const temp = operator + next.value;
      candidates = candidates.filter(o => o.startsWith(temp));
      if (!candidates.length) break;
      operator = temp;
      this.conveyor.next();
      next = this.conveyor.peek();
    }

    if (!operators.some(o => o === operator)) throw new Error('Invalid operator');
    this.tokens.push({ type: TokenType.Operator, value: operator });
    return true;
  }

  /** 分析接下來的原始資料的含意是否為括號，如是，則加入 `#tokens` 中 */
  private lexParenthesis(char: string): boolean {
    if (!Lexer.isParenthesis(char)) return false;

    this.tokens.push({ type: TokenType.Parenthesis, value: this.conveyor.peek().value });
    this.conveyor.next();
    return true;
  }

  /** 分析接下來的原始資料的含意是否為數字，如是，則加入 `#tokens` 中 */
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

  /** 分析接下來的原始資料的含意是否為關鍵字，如是，則加入 `#tokens` 中 */
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