import { TokenType } from "./enums";

export const parenthesis = ['(', ')'] as const;
export const unaryOperator = ['+', '-', '~', '√'] as const;
export const binaryOperator = ['**', '*', '×', '/', '÷', '%', '+', '-', '<<', '>>', '>>>', '&', '^', '|'] as const;
export const constantKeyword = ['e', 'inf', 'infinity', '∞', 'ln10', 'ln2', 'log10e', 'log2e', 'nan', 'pi', 'π', 'sqrt1_2', 'sqrt2'] as const;
export const functionKeyword = [
  'abs', 'cbrt', 'clz32', 'exp', 'expm1', 'fact', 'fround', 'imul', 'irandom', 'log', 'log10', 'log1p', 'log2', 'pow', 'random', 'sqrt', 

  'ceil', 'floor', 'round', 'sign', 'trunc', 

  'avg', 'gcd', 'hypot', 'lcm', 'max', 'min', 'prod', 'sqsum', 'stdev', 'sum', 

  'acos', 'acosh', 'asin', 'asinh', 'atan', 'atan2', 'atanh', 'cos', 'cosh', 'sin', 'sinh', 'tan', 'tanh', 

  'date', 'day', 'year', 'hour', 'millisecond', 'minute', 'month', 'now', 'second'
] as const;

export type ParenthesisKey = (typeof parenthesis)[number];
export type UnaryOperatorKey = (typeof unaryOperator)[number];
export type BinaryOperatorKey = (typeof binaryOperator)[number];
export type ConstantKeywordKey = (typeof constantKeyword)[number];
export type FunctionKeywordKey = (typeof functionKeyword)[number];

export type Token = { type: TokenType, value: string, position: number };

export type Comma = { type: TokenType.Comma, value: ',', position: number };
export type Parenthesis = { type: TokenType.Parenthesis, value: ParenthesisKey, position: number };
export type UnaryOperator = { type: TokenType.UnaryOperator, value: UnaryOperatorKey, position: number };
export type BinaryOperator = { type: TokenType.BinaryOperator, value: BinaryOperatorKey, position: number };
export type Operator = UnaryOperator | BinaryOperator;
export type ConstantKeyword = { type: TokenType.ConstantKeyword, value: ConstantKeywordKey, position: number };
export type FunctionKeyword = { type: TokenType.FunctionKeyword, value: FunctionKeywordKey, position: number };
export type Keyword = ConstantKeyword | FunctionKeyword;

export type NumberExpression = { v: number, p: number }
export type UnaryExpression = { o: UnaryOperator, v: Expression, p: number };
export type BinaryExpression = { l: Expression, o: BinaryOperator, r: Expression, p: number };
export type ConstantExpression = { c: ConstantKeywordKey, p: number };
export type FunctionExpression = { f: FunctionKeywordKey, a: Expression[], p: number };
export type Expression = NumberExpression | UnaryExpression | BinaryExpression | ConstantExpression | FunctionExpression;