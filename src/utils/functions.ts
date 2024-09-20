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
  pow: Math.pow, 
  round: Math.round, 
  sign: Math.sign, 
  sin: Math.sin, 
  sinh: Math.sinh, 
  sqrt: Math.sqrt, 
  tan: Math.tan, 
  tanh: Math.tanh, 
  trunc: Math.trunc, 

  max(...args: number[]): number {
    return args.length ? Math.max(...args) : NaN;
  }, 
  min(...args: number[]): number {
    return args.length ? Math.min(...args) : NaN;
  }, 

  // Date functions
  now() {
    return Date.now();
  }, 
  year() {
    return new Date().getFullYear();
  }, 
  month() {
    return new Date().getMonth() + 1;
  }, 
  day() {
    const day = new Date().getDay();
    return day === 0 ? 7 : day;
  }, 
  date() {
    return new Date().getDate();
  }, 
  hour() {
    return new Date().getHours();
  }, 
  minute() {
    return new Date().getMinutes();
  }, 
  second() {
    return new Date().getSeconds();
  }, 
  millisecond() {
    return new Date().getMilliseconds();
  }, 

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

    const numbers = args.map(n => BigInt(Math.trunc(Math.abs(n))));
    let result = _gcd(numbers[0], numbers[1]);
    for (let i = 2; i < numbers.length; i++) {
      result = _gcd(result, numbers[i]);
    }
    return Number(result);
  }, 
  irandom(a: number, b: number): number {
    if (a > b) {
      [a, b] = [b, a];
    }
    a = Math.ceil(a);
    b = Math.floor(b);
    return Math.floor(Math.random() * (b - a + 1) + a);
  }, 
  lcm(...args: number[]): number {
    if (args.length === 0) return NaN;
    if (args.length === 1) return args[0];

    const numbers = args.map(n => BigInt(Math.trunc(Math.abs(n))));
    let result = _lcm(numbers[0], numbers[1]);
    for (let i = 2; i < numbers.length; i++) {
      result = _lcm(result, numbers[i]);
    }
    return Number(result);
  }, 
  prod(...args: number[]): number {
    return args.reduce((a, c) => a * c, 1);
  }, 
  random(a?: number, b?: number): number {
    if (a == null && b == null) return Math.random();

    a = a ?? 0;
    b = b ?? 0;
    return Math.random() * (b - a) + a;
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