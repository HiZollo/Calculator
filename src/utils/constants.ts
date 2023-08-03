import { ConstantKeywordKey } from "../types";

export const constants: { [key in ConstantKeywordKey]: number } = {
  // Math constants
  'e'        : Math.E, 
  'inf'      : Infinity, 
  'infinity' : Infinity, 
  '∞'        : Infinity, 
  'ln10'     : Math.LN10, 
  'ln2'      : Math.LN2, 
  'log10e'   : Math.LOG10E, 
  'log2e'    : Math.LOG2E, 
  'pi'       : Math.PI, 
  'π'        : Math.PI, 
  'sqrt1_2'  : Math.SQRT1_2, 
  'sqrt2'    : Math.SQRT2, 
} as const;