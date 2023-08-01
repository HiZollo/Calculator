import { ErrorCodes } from "./ErrorCodes";
import { ErrorTypes } from "./ErrorTypes";

export const Messages = {
  // Lexer
  [ErrorCodes.InvalidCharacter]: (char: string) => `Invalid Character ${char}.`, 
  [ErrorCodes.InvalidOperator]: (operator: string) => `Invalid Operator ${operator}.`, 
  [ErrorCodes.TwoDecimalPoints]: () => `There cannot be two decimal points in a number.`, 

  // Parser
  [ErrorCodes.ExtraTrailingTokens]: () => `There should not be any extra tokens in the end.`, 
  [ErrorCodes.InvalidToken]: (token: string) => `Invalid Token ${token}.`, 
  [ErrorCodes.MissingOpenParenthesis]: () => `Missing open parenthesis.`, 
  [ErrorCodes.MissingCloseParenthesis]: () => `Missing close parenthesis.`, 
  [ErrorCodes.NotANumber]: (token: string) => `${token} cannot be parsed as a number.`, 
  [ErrorCodes.NothingToParse]: () => `There is nothing to parse.`, 

  // Evaluator

  // Implementation
  [ErrorCodes.EmptyExpressionStack]: () => `The expression stack is empty. This is probably caused by a bug in calculator itself.`, 
  [ErrorCodes.NonEmptyStack]: () => `Non-empty stack after parsing. This is probably caused by a bug in calculator itself.`, 
} as const;

export const Types = {
    // Lexer
    [ErrorCodes.InvalidCharacter]: ErrorTypes.LexerError, 
    [ErrorCodes.InvalidOperator]: ErrorTypes.LexerError, 
    [ErrorCodes.TwoDecimalPoints]: ErrorTypes.LexerError, 
  
    // Parser
    [ErrorCodes.ExtraTrailingTokens]: ErrorTypes.ParserError, 
    [ErrorCodes.InvalidToken]: ErrorTypes.ParserError, 
    [ErrorCodes.MissingOpenParenthesis]: ErrorTypes.ParserError, 
    [ErrorCodes.MissingCloseParenthesis]: ErrorTypes.ParserError, 
    [ErrorCodes.NotANumber]: ErrorTypes.ParserError, 
    [ErrorCodes.NothingToParse]: ErrorTypes.ParserError, 
  
    // Evaluator

    // Implementation
    [ErrorCodes.EmptyExpressionStack]: ErrorTypes.ImplementationError, 
    [ErrorCodes.NonEmptyStack]: ErrorTypes.ImplementationError, 
} as const;