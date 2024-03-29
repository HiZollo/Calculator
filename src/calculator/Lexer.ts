import { Conveyor } from "./";
import { CalcError, ErrorCodes } from "../errors";
import { binaryOperator, constantKeyword, functionKeyword, Token, TokenType, unaryOperator } from "../types";

const operators = [...unaryOperator, ...binaryOperator];
const operatorChars = new Set([unaryOperator.map(o => o.split('')), binaryOperator.map(o => o.split(''))].flat(2));
const keywordChars = new Set([constantKeyword.map(o => o.split('')), functionKeyword.map(o => o.split(''))].flat(2));
const numberPatterns = [/^0x[\da-zA-Z]+$/, /^0o[\da-zA-Z]+$/, /^0b[\da-zA-Z]+$/, /^\d+$/, /^\d+\.\d+$/, /^\d+\.$/, /^\.\d+$/];

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

      if (!success) {
        throw new CalcError(this.conveyor.position, ErrorCodes.InvalidCharacter, char);
      }
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

    this.tokens.push({ type: TokenType.Comma, value: ',', position: this.conveyor.position });
    this.conveyor.next();
    return true;
  }

  /** 分析接下來的原始資料的含意是否為運算元，如是，則加入 `#tokens` 中 */
  private lexOperator(char: string): boolean {
    if (!Lexer.isOperator(char)) return false;

    const position = this.conveyor.position;

    let candidates = operators;
    let operator = '';
    let next = this.conveyor.peek();

    while (!next.done) {
      const temp = operator + next.value;
      candidates = candidates.filter(o => o.startsWith(temp));
      if (!candidates.length) break;

      operator = temp;
      this.conveyor.next();
      next = this.conveyor.peek();
    }

    if (!operators.some(o => o === operator)) {
      throw new CalcError(position, ErrorCodes.InvalidOperator, operator);
    }
    this.tokens.push({ type: TokenType.Operator, value: operator, position });
    return true;
  }

  /** 分析接下來的原始資料的含意是否為括號，如是，則加入 `#tokens` 中 */
  private lexParenthesis(char: string): boolean {
    if (!Lexer.isParenthesis(char)) return false;

    this.tokens.push({ type: TokenType.Parenthesis, value: char, position: this.conveyor.position });
    this.conveyor.next();
    return true;
  }

  /** 分析接下來的原始資料的含意是否為數字，如是，則加入 `#tokens` 中 */
  private lexNumber(char: string): boolean {
    if (!Lexer.isNumber(char)) return false;

    const position = this.conveyor.position;

    let number = '';
    let validChars = "";
    let next = this.conveyor.peek();

    while (!next.done) {
      const temp = number + next.value;
      if (!numberPatterns.some(p => p.test(temp + '0'))) break;

      validChars ||=
        number.startsWith('0b') ? "01" :
        number.startsWith('0o') ? "01234567" :
        number.startsWith('0x') ? "0123456789abcdefABCDEF" : "";

      if (validChars && !validChars.includes(next.value)) {
        throw new CalcError(
          this.conveyor.position, 
          ErrorCodes.PositionNotationError, 
          validChars.length === 2 ? 'binary' : validChars.length === 8 ? 'octal' : 'hexadecimal',
          next.value
        );
      }

      number = temp;
      this.conveyor.next();
      next = this.conveyor.peek();
    }

    if (number === '.') {
      this.conveyor.wayback(1);
      return false;
    }
    
    if (!numberPatterns.some(p => p.test(number))) {
      throw new CalcError(position, ErrorCodes.InvalidNumber, number);
    }

    this.tokens.push({ type: TokenType.Number, value: number, position });
    return true;
  }

  /** 分析接下來的原始資料的含意是否為關鍵字，如是，則加入 `#tokens` 中 */
  private lexKeyword(char: string): boolean {
    if (!Lexer.isKeyword(char)) return false;

    let keyword = '';
    let next = this.conveyor.peek();
    let position = this.conveyor.position;
    while (!next.done) {
      const temp = next.value;
      if (!Lexer.isKeyword(temp)) break;
      keyword += temp;
      this.conveyor.next();
      next = this.conveyor.peek();
    }

    this.tokens.push({ type: TokenType.Keyword, value: keyword, position });
    return true;
  }


  private static isSpace(char: string): boolean {
    return /[ \n\r]/.test(char);
  }

  private static isComma(char: string): boolean {
    return char === ',';
  }

  private static isOperator(char: string): boolean {
    return operatorChars.has(char.toLowerCase());
  }

  private static isParenthesis(char: string): boolean {
    return /[\(\)]/.test(char);
  }

  private static isNumber(char: string): boolean {
    return /[\.0-9]/.test(char);
  }

  private static isKeyword(char: string): boolean {
    return keywordChars.has(char.toLowerCase());
  }
}