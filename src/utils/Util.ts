import { BinaryExpression, binaryOperator, BinaryOperator, Comma, ConstantExpression, constantKeyword, ConstantKeyword, Expression, FunctionExpression, functionKeyword, FunctionKeyword, NumberExpression, Parenthesis, Token, TokenType, UnaryExpression, unaryOperator, UnaryOperator } from "../types";

const UnaryOperatorKeys: Set<string> = new Set(unaryOperator);
const BinaryOperatorKeys: Set<string> = new Set(binaryOperator);
const ConstantKeywordKeys: Set<string> = new Set(constantKeyword);
const FunctionKeywordKeys: Set<string> = new Set(functionKeyword);

export class Util {
  static isComma(opr: Token): opr is Comma {
    return opr.type === TokenType.Comma;
  }


  static isOpenParenthesis(opr: Token): opr is Parenthesis {
    return opr.value === '(';
  }

  static isCloseParenthesis(opr: Token): opr is Parenthesis {
    return opr.value === ')';
  }
  static isParenthesis(opr: Token): opr is Parenthesis {
    return opr.type === TokenType.Parenthesis;
  }


  static isUnaryOperator(opr: Token): opr is UnaryOperator {
    return UnaryOperatorKeys.has(opr.value);
  }

  static isBinaryOperator(opr: Token): opr is BinaryOperator {
    return BinaryOperatorKeys.has(opr.value);
  }

  static isOperator(opr: Token): opr is BinaryOperator | UnaryOperator {
    return opr.type === TokenType.Operator;
  }

  static associativityOf(opr: BinaryOperator): 'ltr' | 'rtl' {
    return opr.value === '**' ? 'rtl' : 'ltr';
  }


  static isNumber(opr: Token): boolean {
    return opr.type === TokenType.Number;
  }

  static isConstantKeyword(opr: Token): opr is ConstantKeyword {
    if (ConstantKeywordKeys.has(opr.value.toLowerCase())) {
      opr.value = opr.value.toLowerCase();
      return true;
    }
    return false;
  }

  static isFunctionKeyword(opr: Token): opr is FunctionKeyword {
    if (FunctionKeywordKeys.has(opr.value.toLowerCase())) {
      opr.value = opr.value.toLowerCase();
      return true;
    }
    return false;
  }


  static isNumberExpression(exp: Expression): exp is NumberExpression {
    return 'v' in exp && !('o' in exp);
  }

  static isUnaryExpression(exp: Expression): exp is UnaryExpression {
    if (typeof exp === 'number') return false;
    return 'o' in exp && 'v' in exp;
  }

  static isBinaryExpression(exp: Expression): exp is BinaryExpression {
    if (typeof exp === 'number') return false;
    return 'l' in exp && 'o' in exp && 'r' in exp;
  }

  static isConstantExpression(exp: Expression): exp is ConstantExpression {
    if (typeof exp === 'number') return false;
    return 'c' in exp;
  }

  static isFunctionExpression(exp: Expression): exp is FunctionExpression {
    if (typeof exp === 'number') return false;
    return 'f' in exp && 'a' in exp;
  }
}