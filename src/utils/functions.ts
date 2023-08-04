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
  fact(n: number): number {
    if (!Number.isInteger(n) || n <= 0) return NaN;
    if (n >= 171) return Infinity;
    if (n === 1) return 1;
    return n * functions.fact(n - 1);
  }, 
  gcd(...args: number[]): number {
    if (args.length === 0) return NaN;
    if (args.length === 1) return args[0];

    const numbers = args.map(n => BigInt(Math.floor(Math.abs(n))));
    let result = _gcd(numbers[0], numbers[1]);
    for (let i = 2; i < numbers.length; i++) {
      result = _gcd(result, numbers[i]);
    }
    return Number(result);
  }, 
  irandom(a: number, b: number): number {
    a = Math.floor(a);
    b = Math.floor(b);
    return Math.floor(Math.random() * (b - a + 1) + a);
  }, 
  lcm(...args: number[]): number {
    if (args.length === 0) return NaN;
    if (args.length === 1) return args[0];

    const numbers = args.map(n => BigInt(Math.floor(Math.abs(n))));
    let result = _lcm(numbers[0], numbers[1]);
    for (let i = 2; i < numbers.length; i++) {
      result = _lcm(result, numbers[i]);
    }
    return Number(result);
  }, 
  prod(...args: number[]): number {
    return args.reduce((a, c) => a * c, 1);
  }, 
} as const;

function _gcd(m: bigint, n: bigint): bigint {
  if (m === 0n && n === 0n) return 0n;
  if (m === 0n) return n;
  if (n === 0n) return m;

  let k = 0n;
  while (!(m & 1n) && !(n & 1n)) {
    m >>= 1n;
    n >>= 1n;
    k++;
  }

  while (!(m & 1n)) {
    m >>= 1n;
  }

  do {
    while (!(n & 1n)) {
      n >>= 1n;
    }
    if (m > n) {
      [m, n] = [n, m];
    }
    n -= m;
  } while (n !== 0n);

  return m << k;
}

function _lcm(m: bigint, n: bigint): bigint {
  return m * n / _gcd(m, n);
}