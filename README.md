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
見[文件](./documents.md)。


# 錯誤系統
## `class CalcError extends Error`
- 額外屬性
  - `code`（`ErrorCodes`）：錯誤代碼
  - `type`（`ErrorTypes`）：錯誤類別
  - `position`（`number`）：出錯位置
  - `args`（`unknown[]`）：出錯參數

# 使用範例
```ts
import { Calculator, CalcError, ErrorCodes } from "@hizollo/calculator";

const calculator = new Calculator();
const formula = 'random thing';

try {
  const result = calculator.calculate(formula);
  console.log(result);
} catch (e) {
  const error = e as CalcError<ErrorCodes>;
  console.log(`${error.message}\nAt: ${error.position}`);
}
```