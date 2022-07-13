import { Conveyor, Stack } from "./";
import { BinaryOperator, ConstantExpression, Expression, FunctionExpression, Token, TokenType, UnaryExpression } from "../types";
import { Util } from "../utils";

export class Parser {
  private conveyor: Conveyor<Token>;
  private expressions: Stack<Expression>;
  private operators: Stack<BinaryOperator>;
  

  constructor() {
    this.conveyor = new Conveyor();
    this.expressions = new Stack();
    this.operators = new Stack();
  }

  public parse(tokens: Token[]): Expression {
    this.reset();
    this.conveyor.add(tokens);

    const result = this.parseExpression();
    if (this.expressions.size || this.operators.size) throw new Error('Invalid end');
    if (!this.conveyor.peek().done) throw new Error('Extra tokens at tail');
    return result;
  }


  private reset() {
    this.conveyor = new Conveyor();
    this.expressions = new Stack();
    this.operators = new Stack();
  }

  private parseExpression(): Expression {
    let current = this.conveyor.peek();
    if (current.done) throw new Error('Nothing to parse');

    let exp: Expression | null = 
      this.parseParenthesis(current.value) ||
      this.parseNumber(current.value) ||
      this.parseConstantKeyword(current.value) ||
      this.parseFunctionKeyword(current.value) ||
      this.parseUnaryOperator(current.value);
    if (exp === null) throw new Error(`Invalid token ${current.value.value}`);

    current = this.conveyor.peek();
    if (!current.done && Util.isBinaryOperator(current.value)) {
      const size = this.operators.size;
      this.expressions.push(exp);

      const opr: BinaryOperator = { type: TokenType.BinaryOperator, value: current.value.value };
      this.operators.push(opr);
      this.clearStack(opr);
      this.conveyor.next();

      this.expressions.push(this.parseExpression());
      this.clearStack(size);

      const temp = this.expressions.pop();
      if (!temp) throw new Error('Invalid expression');
      exp = temp;
    }
    return exp;
  }

  private parseParenthesis(token: Token): Expression | null {
    if (!Util.isOpenParenthesis(token)) return null;
    this.conveyor.next();

    const exp = this.parseExpression();
    
    const current = this.conveyor.peek();
    if (!current.done && !Util.isCloseParenthesis(current.value)) throw new Error('Parenthesis not closed');
    this.conveyor.next();

    return exp;
  }

  private parseNumber(token: Token): number | null {
    if (!Util.isNumber(token)) return null;

    const num = +token.value;
    if (isNaN(num)) throw new Error('Not a number');
    this.conveyor.next();

    return num;
  }

  private parseConstantKeyword(token: Token): ConstantExpression | null {
    if (!Util.isConstantKeyword(token)) return null;

    this.conveyor.next();
    return { c: token.value };
  }

  private parseFunctionKeyword(token: Token): FunctionExpression | null {
    if (!Util.isFunctionKeyword(token)) return null;
      const func = token.value;
      this.conveyor.next();
      
      let current = this.conveyor.peek();
      if (!current.done && !Util.isOpenParenthesis(current.value)) throw new Error('Expecting parenthesis');
      this.conveyor.next();
      
      const funcArgs = this.parseArguments();
      
      current = this.conveyor.peek();
      if (!current.done && !Util.isCloseParenthesis(current.value)) throw new Error('Parenthesis not closed');
      this.conveyor.next();

      return { f: func, a: funcArgs };
  }

  private parseUnaryOperator(token: Token): UnaryExpression | null {
    if (!Util.isUnaryOperator(token)) return null;

    this.conveyor.next();
    return { o: token, v: this.parseExpression() };
  }

  private parseArguments(): Expression[] {
    const args: Expression[] = [];
    args.push(this.parseExpression());

    let current = this.conveyor.peek();
    while (!current.done && Util.isComma(current.value)) {
      this.conveyor.next();
      args.push(this.parseExpression());
      current = this.conveyor.peek();
    }
    return args;
  }

  private clearStack(arg?: BinaryOperator | number): void {
    let current = this.operators.peek();
    while (current && (typeof arg === 'number' ? this.operators.size - arg : Parser.comparePrecedence(current, arg)) > 0) {
      const rExp = this.expressions.pop();
      const lExp = this.expressions.pop();
      this.operators.pop();
      if (!lExp || !rExp) throw new Error('Invalid expressions');
      this.expressions.push({
        l: lExp, 
        o: current, 
        r: rExp
      });
      current = this.operators.peek();
    }
  }

  private static comparePrecedence(opr1: BinaryOperator, opr2?: BinaryOperator): number {
    return this.getPrecedence(opr1) - this.getPrecedence(opr2);
  }

  private static getPrecedence(opr?: BinaryOperator): number {
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