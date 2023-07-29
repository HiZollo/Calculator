# Calculator
用 TypeScript 寫成的簡單計算機。

# 使用方式
```ts
import { Calculator } from "@hizollo/calculator";

const calculator = new Calculator();
const formula = '1 + 2 * 3';
const result = calculator.calculate(formula);
console.log(result); // 7
```

# 支援語法
- 一般運算：加法 `+`、減法 `-`、 乘法 `*`、除法 `/`、模運算 `%`、次方 `**`
- 位元運算：位元與 `&`、位元或 `|`、位元異或 `^`、位元左移 `<<`、位元右移 `>>`、無符號位元右移 `>>>`
- 單元運算：正 `+`、負 `-`、位元補數 `~`
- 多層括號：左括號 `(`、右括號 `)`
- 支援常數：`E`、`LN10`、`LN2`、`LOG10E`、`LOG2E`、`PI`、`SQRT1_2`、`SQRT2`
- 支援函數：`abs`、`acos`、`acosh`、`asin`、`asinh`、`atan`、`atan2`、`atanh`、`cbrt`、`ceil`、`clz32`、`cos`、`cosh`、`exp`、`expm1`、`floor`、`fround`、`hypot`、`imul`、`log`、`log10`、`log1p`、`log2`、`max`、`min`、`pow`、`random`、`round`、`sign`、`sin`、`sinh`、`sqrt`、`tan`、`tanh`、`trunc`
  - 函數呼叫：`func(arg1, arg2, ..., argN)`