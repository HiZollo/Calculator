import { BinaryExpression, ConstantExpression, ConstantKeywordKey, Expression, FunctionExpression, FunctionKeywordKey, UnaryExpression } from "../types";
import { Util } from "../utils";

export class Evaluator {
  private exp: Expression;


  constructor() {
    this.exp = 0;
  }

  public evaluate(exp: Expression) {
    this.exp = exp;
    return this.eval(this.exp);
  }

  
  private eval(exp: Expression): number {
    if (typeof exp === 'number') {
      return exp;
    }
    if (Util.isUnaryExpression(exp)) {
      return this.evalUnary(exp);
    }
    if (Util.isBinaryExpression(exp)) {
      return this.evalBinary(exp);
    }
    if (Util.isConstantExpression(exp)) {
      return this.evalConstant(exp);
    }
    return this.evalFunction(exp);
  }

  private evalUnary(exp: UnaryExpression): number {
    switch (exp.o.value) {
      case '+':
        return +this.eval(exp.v);
      case '-':
        return -this.eval(exp.v);
      case '~':
        return ~this.eval(exp.v);
    }
  }

  private evalBinary(exp: BinaryExpression): number {
    switch (exp.o.value) {
      case '**':
        return this.eval(exp.l) ** this.eval(exp.r);
      case '*':
        return this.eval(exp.l) * this.eval(exp.r);
      case '/':
        return this.eval(exp.l) / this.eval(exp.r);
      case '%':
        return this.eval(exp.l) % this.eval(exp.r);
      case '+':
        return this.eval(exp.l) + this.eval(exp.r);
      case '-':
        return this.eval(exp.l) - this.eval(exp.r);
      case '<<':
        return this.eval(exp.l) << this.eval(exp.r);
      case '>>':
        return this.eval(exp.l) >> this.eval(exp.r);
      case '>>>':
        return this.eval(exp.l) >>> this.eval(exp.r);
      case '&':
        return this.eval(exp.l) & this.eval(exp.r);
      case '^':
        return this.eval(exp.l) ^ this.eval(exp.r);
      case '|':
        return this.eval(exp.l) | this.eval(exp.r);
    
      }
  }

  private evalConstant(exp: ConstantExpression): number {
    return Evaluator.constantTrans(exp.c);
  }

  private evalFunction(exp: FunctionExpression): number {
    const func = Evaluator.functionTrans(exp.f);
    return func(...exp.a.map(a => this.eval(a)));
  }

  private static constantTrans(con: ConstantKeywordKey): number {
    if (con in Math) return Math[con];
    throw new Error('Invalid constant');
  }

  private static functionTrans(func: FunctionKeywordKey): ((...a: number[]) => number) {
    if (func in Math) return Math[func];
    throw new Error('Invalid function');
  }
}