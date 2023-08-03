import { Conveyor, Stack } from "./";
import { BinaryOperator, ConstantExpression, Expression, FunctionExpression, NumberExpression, Token, TokenType, UnaryExpression } from "../types";
import { Util } from "../utils";
import { CalcError, ErrorCodes } from "../errors";

export class Parser {
  /** 用來儲存 lexer 解析後的單詞 */
  private conveyor: Conveyor<Token>;

  /** 儲存表達式的 stack */
  private manager: StackManager;
  
  constructor() {
    this.conveyor = new Conveyor();
    this.manager = new StackManager();
  }

  /** 分析單詞的語法 */
  public parse(tokens: Token[]): Expression {
    this.reset();
    this.conveyor.add(tokens);

    const result = this.parseExpression();

    // 在語法分析結束後，stack 不應留下任何物品
    if (!this.manager.empty) {
      throw new CalcError(-1, ErrorCodes.NonEmptyStack);
    };

    // 在語法分析結束後，儲存單詞的容器不應留下任何物品
    const trailing = this.conveyor.peek();
    if (!trailing.done) {
      throw new CalcError(trailing.value.position, ErrorCodes.ExtraTrailingTokens);
    }

    return result;
  }


  /** 清空容器 */
  private reset() {
    this.conveyor = new Conveyor();
    this.manager.reset();
  }

  /** 遞迴地解析語法 */
  private parseExpression(): Expression {
    let current = this.conveyor.peek();
    if (current.done) {
      throw new CalcError(-1, ErrorCodes.MissingExpressions);
    }

    let exp: Expression | null = 
      this.parseParenthesis(current.value) ??
      this.parseNumber(current.value) ??
      this.parseConstant(current.value) ??
      this.parseFunction(current.value) ??
      this.parseUnaryOperator(current.value);
    if (exp === null) {
      throw new CalcError(current.value.position, ErrorCodes.InvalidToken, current.value.value);
    }

    // 二元運算
    current = this.conveyor.peek();
    if (!current.done && Util.isBinaryOperator(current.value)) {
      this.manager.addExpression(exp);

      const opr: BinaryOperator = { type: TokenType.BinaryOperator, value: current.value.value, position: current.value.position };
      this.manager.clearStack(opr);
      this.manager.addOperator(opr);
      this.conveyor.next();

      this.manager.addExpression(this.parseExpression());
      this.manager.mergeExpression();

      const temp = this.manager.popExpression();
      if (!temp) {
        throw new CalcError(-1, ErrorCodes.EmptyStack);
      }
      exp = temp;
    }
    return exp;
  }

  /**
   * 往下解析括號表達式
   * 
   * `<括號表達式>` = `<左括號>` `<表達式>` `<右括號>`
   */
  private parseParenthesis(token: Token): Expression | null {
    // 左括號
    if (!Util.isOpenParenthesis(token)) return null;
    this.conveyor.next();

    // 表達式
    this.manager.addBarrier();
    const exp = this.parseExpression();
    this.manager.removeBarrier();
    
    // 右括號
    const current = this.conveyor.peek();
    if (current.done || !Util.isCloseParenthesis(current.value)) {
      throw new CalcError(current.value?.position ?? -1, ErrorCodes.MissingCloseParenthesis);
    }
    this.conveyor.next();

    return exp;
  }

  /** 往下解析數字 */
  private parseNumber(token: Token): NumberExpression | null {
    if (!Util.isNumber(token)) return null;

    const num = +token.value;
    if (isNaN(num)) {
      throw new CalcError(token.position, ErrorCodes.NotANumber, token.value);
    }
    this.conveyor.next();

    return { v: num, p: token.position };
  }

  /** 往下解析常數 */
  private parseConstant(token: Token): ConstantExpression | null {
    if (!Util.isConstantKeyword(token)) return null;

    this.conveyor.next();
    return { c: token.value, p: token.position };
  }

  /**
   * 往下解析函數表達式
   * 
   * `<函數表達式>` = `<函數關鍵字>` `<左括號>` `[參數表達式]` `<右括號>`
   */
  private parseFunction(token: Token): FunctionExpression | null {
    // 函數關鍵字
    if (!Util.isFunctionKeyword(token)) return null;
    this.conveyor.next();
    
    // 左括號
    let current = this.conveyor.peek();
    if (current.done || !Util.isOpenParenthesis(current.value)) {
      throw new CalcError(current.value?.position ?? -1, ErrorCodes.MissingOpenParenthesis);
    }
    this.conveyor.next();
    
    current = this.conveyor.peek();
    if (current.done) {
      throw new CalcError(-1, ErrorCodes.MissingCloseParenthesis);
    }

    // 如果是右括號，代表沒有參數
    if (Util.isCloseParenthesis(current.value)) {
      this.conveyor.next();
      return { f: token.value, a: [], p: token.position };
    }

    // 參數表達式
    const funcArgs = this.parseArguments();
    
    // 右括號
    current = this.conveyor.peek();
    if (current.done || !Util.isCloseParenthesis(current.value)) {
      throw new CalcError(current.value?.position ?? -1, ErrorCodes.MissingCloseParenthesis);
    }
    this.conveyor.next();

    return { f: token.value, a: funcArgs, p: token.position };
  }

  /** 往下解析單元運算表達式 */
  private parseUnaryOperator(token: Token): UnaryExpression | null {
    if (!Util.isUnaryOperator(token)) return null;

    this.conveyor.next();
    return { o: token, v: this.parseExpression(), p: token.position };
  }

  /**
   * 往下解析參數表達式
   * 
   * `<參數表達式>` = `<表達式>` [...`<逗號>` `<表達式>`]
   */
  private parseArguments(): Expression[] {
    const args: Expression[] = [];

    // 表達式
    this.manager.addBarrier();
    args.push(this.parseExpression());
    this.manager.removeBarrier();

    // 逗號
    let current = this.conveyor.peek();
    while (!current.done && Util.isComma(current.value)) {
      this.conveyor.next();

      // 表達式
      this.manager.addBarrier();
      args.push(this.parseExpression());
      this.manager.removeBarrier();

      current = this.conveyor.peek();
    }

    return args;
  }
}

class StackManager {
  /** 儲存表達式的 stack */
  private expressions: Stack<Expression>;

  /** 儲存二元運算子的 stack */
  private operators: Stack<BinaryOperator>;

  /** 儲存 clearStack() 最多只能把 operators 清剩的數量 */
  private barriers: Stack<number>;

  constructor() {
    this.expressions = new Stack();
    this.operators = new Stack();
    this.barriers = new Stack();
  }

  public get empty() {
    return this.expressions.size === 0 && this.operators.size === 0;
  }

  public reset() {
    this.expressions = new Stack();
    this.operators = new Stack();
    this.barriers = new Stack();
  }

  public addExpression(exp: Expression) {
    this.expressions.push(exp);
  }

  public addOperator(opr: BinaryOperator) {
    this.operators.push(opr);
  }

  public popExpression() {
    return this.expressions.pop();
  }

  public addBarrier() {
    this.barriers.push(this.operators.size);
  }

  public removeBarrier() {
    this.barriers.pop();
  }

  /** 依據優先序高於 `arg` 的暫存表達式合併 */
  public clearStack(opr: BinaryOperator): void {
    let current = this.operators.peek();
    while (current && this.comparePrecedence(current, opr) > 0 && this.operators.size > (this.barriers.peek() ?? 0)) {
      this.mergeExpression();
      current = this.operators.peek();
    }
  }

  /** 將 stack 最上層的兩個表達式與運算子合併成一個表達式，並放回 stack 中 */
  public mergeExpression(): void {
    if (this.operators.size <= (this.barriers.peek() ?? 0)) return;

    const rExp = this.expressions.pop();
    const lExp = this.expressions.pop();
    const opr = this.operators.pop();
    if (!lExp || !opr || !rExp) {
      throw new CalcError(-1, ErrorCodes.EmptyStack);
    }

    this.expressions.push({
      l: lExp, 
      o: opr, 
      r: rExp, 
      p: lExp.p
    });
  }

  /** 判斷 `opr1` 相較於 `opr2` 是否有比較高的優先權，若有，則回傳正值，反之則回傳負值，若相等則回傳 0 */
  private comparePrecedence(opr1: BinaryOperator, opr2: BinaryOperator): number {
    return this.getPrecedence(opr1) - this.getPrecedence(opr2);
  }

  private getPrecedence(opr: BinaryOperator): number {
    if (opr === undefined) return -2;
    switch (opr.value) {
      case '**': return 14;
      case '*': case '/': case '%': return 13;
      case '+': case '-': return 12;
      case '<<': case '>>': case '>>>': return 11;
      case '&': return 8;
      case '^': return 7;
      case '|': return 6;
    }
  }
}