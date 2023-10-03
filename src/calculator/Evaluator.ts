import { BinaryExpression, ConstantExpression, Expression, FunctionExpression, UnaryExpression } from "../types";
import { Util } from "../utils";
import { constants } from "../utils/constants";
import { functions } from "../utils/functions";

export class Evaluator {
  private exp: Expression;


  constructor() {
    this.exp = { v: 0, p: -1 };
  }

  public evaluate(exp: Expression) {
    this.exp = exp;
    return this.eval(this.exp);
  }

  
  private eval(exp: Expression): number {
    if (Util.isNumberExpression(exp)) {
      return exp.v;
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
      case '√':
        return Math.sqrt(this.eval(exp.v));
    }
  }

  private evalBinary(exp: BinaryExpression): number {
    switch (exp.o.value) {
      case '**':
        return this.eval(exp.l) ** this.eval(exp.r);
      case '*': case '×':
        return this.eval(exp.l) * this.eval(exp.r);
      case '/': case '÷':
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
    return Evaluator.constantTrans(exp);
  }

  private evalFunction(exp: FunctionExpression): number {
    const func = Evaluator.functionTrans(exp);
    return func(...exp.a.map(a => this.eval(a)));
  }

  private static constantTrans(con: ConstantExpression): number {
    return constants[con.c];
  }

  private static functionTrans(func: FunctionExpression): ((...a: number[]) => number) {
    return functions[func.f];
  }
}