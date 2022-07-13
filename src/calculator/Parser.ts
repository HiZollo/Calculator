import { Conveyor, Stack } from "./";
import { BinaryOperator, Expression, Token, TokenType, UnaryOperator } from "../types";
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
    let exp: Expression;
    if (!current.done) {
      if (Parser.isOpenParenthesis(current.value)) {
        this.conveyor.next();

        exp = this.parseExpression();
        
        current = this.conveyor.peek();
        if (!current.done && !Parser.isCloseParenthesis(current.value)) throw new Error('Parenthesis not closed');
        this.conveyor.next();
      }
      else if (Parser.isNumber(current.value)) {
        const num = +current.value.value;
        if (isNaN(num)) throw new Error('Not a number');
        exp = num;
        this.conveyor.next();
      }
      else if (Util.isConstantKeyword(current.value)) {
        exp = { c: current.value.value };
        this.conveyor.next();
      }
      else if (Util.isFunctionKeyword(current.value)) {
        const func = current.value.value;
        this.conveyor.next();
        
        current = this.conveyor.peek();
        if (!current.done && !Parser.isOpenParenthesis(current.value)) throw new Error('Expecting parenthesis');
        this.conveyor.next();
        
        const funcArgs = this.parseArguments();
        
        current = this.conveyor.peek();
        if (!current.done && !Parser.isCloseParenthesis(current.value)) throw new Error('Parenthesis not closed');
        this.conveyor.next();

        exp = { f: func, a: funcArgs };
      }
      else if (Util.isUnaryOperator(current.value)) {
        const opr: UnaryOperator = current.value;
        this.conveyor.next();
        exp = { o: opr, v: this.parseExpression() };
      }
      else throw new Error(`Invalid token ${current.value.value}`);

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
    throw new Error('Nothing to parse');
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


  private static isOpenParenthesis(token: Token): boolean {
    return token.type === TokenType.Parenthesis && token.value === '(';
  }

  private static isCloseParenthesis(token: Token): boolean {
    return token.type === TokenType.Parenthesis && token.value === ')';
  }

  private static isNumber(token: Token): boolean {
    return token.type === TokenType.Number;
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