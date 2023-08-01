import { FunctionKeywordKey } from "../types";

export const functions: { [key in FunctionKeywordKey]: (...args: number[]) => number } = {
  // Math functions
  abs: Math.abs, 
  acos: Math.acos, 
  acosh: Math.acosh, 
  asin: Math.asin, 
  asinh: Math.asinh, 
  atan: Math.atan, 
  atan2: Math.atan2, 
  atanh: Math.atanh, 
  cbrt: Math.cbrt, 
  ceil: Math.ceil, 
  clz32: Math.clz32, 
  cos: Math.cos, 
  cosh: Math.cosh, 
  exp: Math.exp, 
  expm1: Math.expm1, 
  floor: Math.floor, 
  fround: Math.fround, 
  hypot: Math.hypot, 
  imul: Math.imul, 
  log: Math.log, 
  log10: Math.log10, 
  log1p: Math.log1p, 
  log2: Math.log2, 
  max: Math.max, 
  min: Math.min, 
  pow: Math.pow, 
  random: Math.random, 
  round: Math.round, 
  sign: Math.sign, 
  sin: Math.sin, 
  sinh: Math.sinh, 
  sqrt: Math.sqrt, 
  tan: Math.tan, 
  tanh: Math.tanh, 
  trunc: Math.trunc, 

  // statistics
  sum(...args: number[]): number {
    return args.reduce((a, c) => a + c, 0);
  }, 
  sqsum(...args: number[]): number {
    return args.reduce((a, c) => a + c ** 2, 0);
  }, 
  avg(...args: number[]): number {
    return functions.sum(...args) / args.length;
  }, 
  stdev(...args: number[]): number {
    return functions.sqrt(functions.sqsum(...args) / args.length - functions.avg(...args) ** 2);
  }, 

  // misc
  prod(...args: number[]): number {
    return args.reduce((a, c) => a * c, 1);
  }, 
  fact(n: number): number {
    if (!Number.isInteger(n) || n <= 0) return NaN;
    if (n >= 171) return Infinity;
    if (n === 1) return 1;
    return n * functions.fact(n - 1);
  }, 
} as const;